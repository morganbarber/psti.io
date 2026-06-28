import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { createServiceClient, type Database } from '@psti/database';
import { encrypt, decrypt, hashPassword, verifyPassword } from '@psti/security';
import { CreatePasteInput, UpdatePasteInput } from '@psti/validation';
import { EXPIRATION_DURATIONS } from '@psti/config';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class PastesService {
    private supabase = createServiceClient();

    async create(userId: string | null, createPasteDto: CreatePasteInput) {
        let content = createPasteDto.content;
        let encryptionData = null;

        // Encrypt content if requested and NOT client-side encrypted
        if (createPasteDto.encrypted && !createPasteDto.encrypted_client_side) {
            const encrypted = encrypt(content, createPasteDto.password);
            content = encrypted.encrypted;
            encryptionData = {
                encryption_iv: encrypted.iv,
                encryption_auth_tag: encrypted.authTag,
                encryption_salt: encrypted.salt,
            };
        }

        // Hash password if provided
        let passwordHash = null;
        // If client-side encrypted, we still might want password protection (access control)
        // So we hash the password if provided, regardless of encryption method
        if (createPasteDto.password) {
            passwordHash = hashPassword(createPasteDto.password);
        }

        // Calculate expiration date
        let expiresAt = null;
        if (createPasteDto.expiration && createPasteDto.expiration !== 'never') {
            const duration = EXPIRATION_DURATIONS[createPasteDto.expiration];
            expiresAt = new Date(Date.now() + duration).toISOString();
        }

        const { data, error } = await this.supabase
            .from('pastes')
            .insert({
                user_id: userId,
                title: createPasteDto.title,
                content,
                language: createPasteDto.language || 'plaintext',
                visibility: createPasteDto.visibility,
                password_hash: passwordHash,
                expires_at: expiresAt,
                encrypted: createPasteDto.encrypted || false,
                burn_after_read: createPasteDto.burn_after_read || false,
                folder_id: createPasteDto.folder_id,
                fork_of: createPasteDto.fork_of,
                ...encryptionData,
            })
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        return data;
    }

    private verifyAccessData(data: any, password?: string) {
        if (!data) {
            throw new NotFoundException('Paste not found');
        }

        const paste = { ...data } as Database['public']['Tables']['pastes']['Row'];

        // Check if expired
        if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
            throw new NotFoundException('Paste has expired');
        }

        // Verify password if required
        if (paste.password_hash && !password) {
            throw new ForbiddenException('Password required');
        }

        if (paste.password_hash && password) {
            const valid = verifyPassword(password, paste.password_hash);
            if (!valid) {
                throw new ForbiddenException('Invalid password');
            }
        }

        return paste;
    }

    async findOne(id: string, password?: string) {
        const { data, error } = await this.supabase
            .from('pastes')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            throw new NotFoundException('Paste not found');
        }

        const paste = this.verifyAccessData(data, password);

        // Decrypt content if encrypted AND we have server-side encryption data
        if (paste.encrypted && password && paste.encryption_iv) {
            const decrypted = decrypt(
                {
                    encrypted: paste.content,
                    iv: paste.encryption_iv,
                    authTag: paste.encryption_auth_tag!,
                    salt: paste.encryption_salt!,
                },
                password
            );
            paste.content = decrypted;
        }

        // Increment view count
        await (this.supabase as any).rpc('increment_paste_view', { p_id: id });

        // Handle burn after read
        if (paste.burn_after_read) {
            await this.supabase.from('pastes').delete().eq('id', id);
        }

        return paste;
    }

    async findVersions(id: string, password?: string) {
        // Fetch paste and its versions in a single query
        const { data: pasteData, error } = await (this.supabase as any)
            .from('pastes')
            .select('*, paste_versions(*)')
            .eq('id', id)
            .single();

        if (error || !pasteData) {
            throw new NotFoundException('Paste not found');
        }

        // Verify access to the parent paste
        this.verifyAccessData(pasteData, password);

        // Sort versions descending
        const data = (pasteData.paste_versions || []).sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Decrypt versions if needed
        return data.map((version: any) => {
            if (version.encrypted && password && version.encryption_iv) {
                try {
                    const decrypted = decrypt(
                        {
                            encrypted: version.content,
                            iv: version.encryption_iv,
                            authTag: version.encryption_auth_tag!,
                            salt: version.encryption_salt!,
                        },
                        password
                    );
                    version.content = decrypted;
                } catch (error) {
                    // Ignore decryption failure for versions (might have used a different key)
                    console.error('Failed to decrypt version', version.id, error);
                }
            }
            return version;
        });
    }

    async findAll(userId: string) {
        const { data, error } = await this.supabase
            .from('pastes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        return data;
    }

    async update(id: string, userId: string, updatePasteDto: UpdatePasteInput) {
        // Verify ownership
        const { data: existing } = await this.supabase
            .from('pastes')
            .select('user_id')
            .eq('id', id)
            .single() as { data: Pick<Database['public']['Tables']['pastes']['Row'], 'user_id'> | null };

        if (!existing || existing.user_id !== userId) {
            throw new ForbiddenException('You do not have permission to update this paste');
        }

        const { data, error } = await this.supabase
            .from('pastes')
            // @ts-expect-error - Supabase type inference issue with update method
            .update(updatePasteDto)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        return data;
    }

    async remove(id: string, userId: string) {
        // Verify ownership
        const { data: existing } = await this.supabase
            .from('pastes')
            .select('user_id')
            .eq('id', id)
            .single() as { data: Pick<Database['public']['Tables']['pastes']['Row'], 'user_id'> | null };

        if (!existing || existing.user_id !== userId) {
            throw new ForbiddenException('You do not have permission to delete this paste');
        }

        const { error } = await this.supabase.from('pastes').delete().eq('id', id);

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        return { success: true };
    }

    async fork(id: string, userId: string | null, password?: string) {
        // 1. Fetch the original paste
        const originalPaste = await this.findOne(id, password);

        // 2. Prepare the new paste DTO based on the original
        // If the original was encrypted, we just clone the raw encrypted content and the password hash
        // Wait, findOne decrypts the content if a password is provided! 
        // So we just re-create it with the decrypted content and the original password.
        const createDto: CreatePasteInput = {
            title: `${originalPaste.title} (Fork)`,
            content: originalPaste.content,
            language: originalPaste.language,
            visibility: originalPaste.visibility as any,
            password: password, // if password was required, we apply the same password
            encrypted: originalPaste.encrypted,
            burn_after_read: originalPaste.burn_after_read,
            fork_of: id
        };

        // 3. Create the new paste
        return this.create(userId, createDto);
    }

    async trackView(
        id: string,
        ip: string,
        userAgent: string,
        clientData: {
            referrer?: string;
            language?: string;
            screen_resolution?: string;
            timezone?: string;
            viewer_user_id?: string;
        }
    ) {
        // Parse user agent
        const parser = new UAParser(userAgent);
        const browser = parser.getBrowser();
        const os = parser.getOS();
        const device = parser.getDevice();

        const { error } = await (this.supabase as any).from('paste_views').insert({
            paste_id: id,
            viewer_ip: ip,
            viewer_user_id: clientData.viewer_user_id || null,
            user_agent: userAgent,
            referrer: clientData.referrer,
            browser: browser.name,
            os: os.name,
            device_type: device.type || 'desktop', // fallback to desktop if undefined
            language: clientData.language,
            screen_resolution: clientData.screen_resolution,
            timezone: clientData.timezone,
            // country could be populated if we have a way to resolve IP to geo, but we'll leave it out for now
        });

        if (error) {
            console.error('Error tracking view:', error);
            // Non-critical, so we don't necessarily throw
        }
    }

    async getAnalytics(userId: string) {
        const { data, error } = await (this.supabase as any)
            .rpc('get_user_analytics', { p_user_id: userId });

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        return data;
    }
}
