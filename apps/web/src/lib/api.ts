import { PstiClient } from '@psti/sdk';
import { createClient as createSupabaseClient } from './supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create a singleton instance of the client
export const apiClient = new PstiClient({ baseUrl: API_BASE_URL });

/**
 * Get the authorization token from Supabase session
 * and inject it into the API client.
 */
async function injectAuthToken() {
    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        apiClient.setToken(session.access_token);
    } else {
        apiClient.clearToken();
    }
}

/**
 * Wrap API calls to ensure token is injected
 */
async function withAuth<T>(apiCall: () => Promise<T>): Promise<T> {
    await injectAuthToken();
    return apiCall();
}

/**
 * Create a new paste
 */
export async function createPaste(input: Parameters<typeof apiClient.pastes.create>[0]) {
    return withAuth(() => apiClient.pastes.create(input));
}

/**
 * Get a paste by ID
 */
export async function getPaste(id: string, password?: string) {
    return withAuth(() => apiClient.pastes.get(id, password));
}

/**
 * Get all versions of a paste
 */
export async function getPasteVersions(id: string, password?: string) {
    return withAuth(() => apiClient.pastes.getVersions(id, password));
}

/**
 * Get all pastes for the current user
 */
export async function getUserPastes() {
    return withAuth(() => apiClient.pastes.list());
}

/**
 * Update a paste
 */
export async function updatePaste(id: string, input: Parameters<typeof apiClient.pastes.update>[1]) {
    return withAuth(() => apiClient.pastes.update(id, input));
}

/**
 * Delete a paste
 */
export async function deletePaste(id: string) {
    return withAuth(() => apiClient.pastes.delete(id));
}

/**
 * Track a paste view
 */
export async function trackPasteView(id: string, data: Parameters<typeof apiClient.pastes.trackView>[1]) {
    return withAuth(() => apiClient.pastes.trackView(id, data));
}

/**
 * Get aggregated analytics
 */
export async function getPasteAnalytics() {
    return withAuth(() => apiClient.pastes.getAnalytics());
}

/**
 * Get user profile
 */
export async function getUserProfile() {
    return withAuth(() => apiClient.users.getProfile());
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: Parameters<typeof apiClient.users.updateProfile>[0]) {
    return withAuth(() => apiClient.users.updateProfile(data));
}
