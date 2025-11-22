import { CreatePasteInput, UpdatePasteInput } from '@psti/validation';
import { Paste, ApiResponse } from '@psti/types';
import { createClient } from './supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Get the authorization token from Supabase session
 */
async function getAuthToken(): Promise<string | null> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const token = await getAuthToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Merge any provided headers
        if (options.headers) {
            const optionsHeaders = new Headers(options.headers);
            optionsHeaders.forEach((value, key) => {
                headers[key] = value;
            });
        }

        // Add authorization header if token is available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.message == "Password required") {
                return {
                    success: false,
                    error: data.message,
                };
            }
            throw new Error(data.message || `API error: ${response.status}`);
        }

        return data;
    } catch (error: any) {
        console.error('API request error:', error);
        return {
            success: false,
            error: error.message || 'An unexpected error occurred',
        };
    }
}

/**
 * Create a new paste
 */
export async function createPaste(input: CreatePasteInput): Promise<ApiResponse<Paste>> {
    return apiRequest<Paste>('/pastes', {
        method: 'POST',
        body: JSON.stringify(input),
    });
}

/**
 * Get a paste by ID
 */
export async function getPaste(id: string, password?: string): Promise<ApiResponse<Paste>> {
    const queryParams = password ? `?password=${encodeURIComponent(password)}` : '';
    return apiRequest<Paste>(`/pastes/${id}${queryParams}`, {
        method: 'GET',
    });
}

/**
 * Get all pastes for the current user
 */
export async function getUserPastes(): Promise<ApiResponse<Paste[]>> {
    return apiRequest<Paste[]>('/pastes', {
        method: 'GET',
    });
}

/**
 * Update a paste
 */
export async function updatePaste(id: string, input: UpdatePasteInput): Promise<ApiResponse<Paste>> {
    return apiRequest<Paste>(`/pastes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    });
}

/**
 * Delete a paste
 */
export async function deletePaste(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiRequest<{ success: boolean }>(`/pastes/${id}`, {
        method: 'DELETE',
    });
}
