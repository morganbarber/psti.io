import { ApiResponse } from '@psti/types';
import { PastesResource } from './resources/pastes';
import { UsersResource } from './resources/users';
import { AuthResource } from './resources/auth';
import { PstiApiError } from './errors';

export interface PstiClientConfig {
    baseUrl: string;
    token?: string;
}

export class PstiClient {
    private baseUrl: string;
    private token?: string;

    public readonly pastes: PastesResource;
    public readonly users: UsersResource;
    public readonly auth: AuthResource;

    constructor(config: PstiClientConfig) {
        this.baseUrl = config.baseUrl;
        this.token = config.token;

        this.pastes = new PastesResource(this);
        this.users = new UsersResource(this);
        this.auth = new AuthResource(this);
    }

    setToken(token: string) {
        this.token = token;
    }

    clearToken() {
        this.token = undefined;
    }

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
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
                throw new PstiApiError(data.message || `API error: ${response.status}`, response.status);
            }

            return data as ApiResponse<T>;
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'An unexpected error occurred',
            };
        }
    }
}
