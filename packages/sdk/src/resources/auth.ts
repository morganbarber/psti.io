import { ApiResponse } from '@psti/types';
import { PstiClient } from '../client';

export class AuthResource {
    constructor(private readonly client: PstiClient) {}

    getMe(): Promise<ApiResponse<any>> {
        return this.client.request<any>('/api/v1/auth/me', {
            method: 'GET',
        });
    }
}
