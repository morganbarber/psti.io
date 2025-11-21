import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { createServiceClient, type Database } from '@repo/database';
import { encrypt, decrypt, hashPassword, verifyPassword } from '@repo/security';
import { CreatePasteInput, UpdatePasteInput } from '@repo/validation';
import { EXPIRATION_DURATIONS } from '@repo/config';

@Injectable()
export class PastesService {
    private supabase = createServiceClient();

    async create(userId: string | null, createPasteDto: CreatePasteInput) {
        let content = createPasteDto.content;
        let encryptionData = null;

        // Encrypt content if requested
        if (createPasteDto.encrypted) {
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
        if (createPasteDto.password && !createPasteDto.encrypted) {
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
                ...encryptionData,
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
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

        // Use a mutable copy since we may modify content after decryption
        const paste = { ...(data as Database['public']['Tables']['pastes']['Row']) };

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

        // Decrypt content if encrypted
        if (paste.encrypted && password) {
            const decrypted = decrypt(
                {
                    encrypted: paste.content,
                    iv: paste.encryption_iv!,
                    authTag: paste.encryption_auth_tag!,
                    salt: paste.encryption_salt!,
                },
                password
            );
            paste.content = decrypted;
        }

        // Increment view count
        await this.supabase
            .from('pastes')
            // @ts-expect-error - Supabase type inference issue with update method
            .update({ view_count: paste.view_count + 1 })
            .eq('id', id);

        // Handle burn after read
        if (paste.burn_after_read) {
            await this.supabase.from('pastes').delete().eq('id', id);
        }

        return paste;
    }

    async findAll(userId: string) {
        const { data, error } = await this.supabase
            .from('pastes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
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
            throw new Error(error.message);
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
            throw new Error(error.message);
        }

        return { success: true };
    }
}
