import { CreatePasteInput, UpdatePasteInput } from '@psti/validation';
import { Paste, ApiResponse } from '@psti/types';

export interface PastebinClientConfig {
    baseUrl: string;
    token?: string;
}

export class PastebinClient {
    private baseUrl: string;
    private token?: string;

    constructor(config: PastebinClientConfig) {
        this.baseUrl = config.baseUrl;
        this.token = config.token;
    }

    /**
     * Set or update the authentication token
     */
    setToken(token: string) {
        this.token = token;
    }

    /**
     * Clear the authentication token
     */
    clearToken() {
        this.token = undefined;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (options.headers) {
            const optionsHeaders = new Headers(options.headers);
            optionsHeaders.forEach((value, key) => {
                headers[key] = value;
            });
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.message === 'Password required') {
                    return {
                        success: false,
                        error: data.message,
                    };
                }
                throw new Error(data.message || `API error: ${response.status}`);
            }

            return data as ApiResponse<T>;
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'An unexpected error occurred',
            };
        }
    }

    public pastes = {
        /**
         * Create a new paste
         */
        create: (input: CreatePasteInput): Promise<ApiResponse<Paste>> => {
            return this.request<Paste>('/api/v1/pastes', {
                method: 'POST',
                body: JSON.stringify(input),
            });
        },

        /**
         * Get a paste by ID
         */
        get: (id: string, password?: string): Promise<ApiResponse<Paste>> => {
            const queryParams = password ? `?password=${encodeURIComponent(password)}` : '';
            return this.request<Paste>(`/api/v1/pastes/${id}${queryParams}`, {
                method: 'GET',
            });
        },

        /**
         * Get all pastes for the current user
         */
        list: (): Promise<ApiResponse<Paste[]>> => {
            return this.request<Paste[]>('/api/v1/pastes', {
                method: 'GET',
            });
        },

        /**
         * Update a paste
         */
        update: (id: string, input: UpdatePasteInput): Promise<ApiResponse<Paste>> => {
            return this.request<Paste>(`/api/v1/pastes/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(input),
            });
        },

        /**
         * Delete a paste
         */
        delete: (id: string): Promise<ApiResponse<{ success: true }>> => {
            return this.request<{ success: true }>(`/api/v1/pastes/${id}`, {
                method: 'DELETE',
            });
        },
    };

    public users = {
        /**
         * Get user profile
         */
        getProfile: (): Promise<ApiResponse<any>> => {
            return this.request<any>('/api/v1/users/profile', {
                method: 'GET',
            });
        },

        /**
         * Update user profile
         */
        updateProfile: (data: any): Promise<ApiResponse<any>> => {
            return this.request<any>('/api/v1/users/profile', {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
        },
    };

    public auth = {
        /**
         * Get current auth context
         */
        getMe: (): Promise<ApiResponse<any>> => {
            return this.request<any>('/api/v1/auth/me', {
                method: 'GET',
            });
        },
    };
}
