import { Injectable } from '@nestjs/common';
import { createServiceClient, type Database } from '@repo/database';

@Injectable()
export class UsersService {
    private supabase = createServiceClient();

    async findOne(id: string) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return null;
        }

        return data;
    }

    async update(id: string, updateData: Database['public']['Tables']['users']['Update']) {
        const { data, error } = await this.supabase
            .from('users')
            // @ts-expect-error - Supabase type inference issue with update method
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}
