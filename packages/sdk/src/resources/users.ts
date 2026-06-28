import { ApiResponse } from '@psti/types';
import { PstiClient } from '../client';

export class UsersResource {
    constructor(private readonly client: PstiClient) {}

    getProfile(): Promise<ApiResponse<any>> {
        return this.client.request<any>('/api/v1/users/profile', {
            method: 'GET',
        });
    }

    updateProfile(data: any): Promise<ApiResponse<any>> {
        return this.client.request<any>('/api/v1/users/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }
}
