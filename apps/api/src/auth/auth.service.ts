import { Injectable } from '@nestjs/common';
import { createServiceClient } from '@repo/database';

@Injectable()
export class AuthService {
    private supabase = createServiceClient();

    async validateUser(accessToken: string) {
        const {
            data: { user },
            error,
        } = await this.supabase.auth.getUser(accessToken);

        if (error || !user) {
            return null;
        }

        return user;
    }

    async getUserProfile(userId: string) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            return null;
        }

        return data;
    }
}
