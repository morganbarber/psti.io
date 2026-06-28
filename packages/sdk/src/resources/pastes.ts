import { CreatePasteInput, UpdatePasteInput } from '@psti/validation';
import { Paste, PasteVersion, ApiResponse } from '@psti/types';
import { PstiClient } from '../client';

export class PastesResource {
    constructor(private readonly client: PstiClient) {}

    create(input: CreatePasteInput): Promise<ApiResponse<Paste>> {
        return this.client.request<Paste>('/api/v1/pastes', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    }

    get(id: string, password?: string): Promise<ApiResponse<Paste>> {
        const queryParams = password ? `?password=${encodeURIComponent(password)}` : '';
        return this.client.request<Paste>(`/api/v1/pastes/${id}${queryParams}`, {
            method: 'GET',
        });
    }

    list(): Promise<ApiResponse<Paste[]>> {
        return this.client.request<Paste[]>('/api/v1/pastes', {
            method: 'GET',
        });
    }

    fork(id: string, password?: string): Promise<ApiResponse<Paste>> {
        return this.client.request<Paste>(`/api/v1/pastes/${id}/fork`, {
            method: 'POST',
            body: JSON.stringify({ password }),
        });
    }

    getVersions(id: string, password?: string): Promise<ApiResponse<PasteVersion[]>> {
        const queryParams = password ? `?password=${encodeURIComponent(password)}` : '';
        return this.client.request<PasteVersion[]>(`/api/v1/pastes/${id}/versions${queryParams}`, {
            method: 'GET',
        });
    }

    update(id: string, input: UpdatePasteInput): Promise<ApiResponse<Paste>> {
        return this.client.request<Paste>(`/api/v1/pastes/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(input),
        });
    }

    delete(id: string): Promise<ApiResponse<{ success: true }>> {
        return this.client.request<{ success: true }>(`/api/v1/pastes/${id}`, {
            method: 'DELETE',
        });
    }

    trackView(id: string, data: { referrer?: string; language?: string; screen_resolution?: string; timezone?: string }): Promise<ApiResponse<{ success: true }>> {
        return this.client.request<{ success: true }>(`/api/v1/pastes/${id}/views`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    getAnalytics(): Promise<ApiResponse<any>> {
        return this.client.request<any>('/api/v1/pastes/analytics/aggregate', {
            method: 'GET',
        });
    }
}
