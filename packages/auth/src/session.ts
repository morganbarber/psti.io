import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '@psti/database';

/**
 * Get the current authenticated user
 * @param supabase - Supabase client
 * @returns User object or null
 */
export async function getCurrentUser(
    supabase: SupabaseClient<Database>
): Promise<User | null> {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return user;
}

/**
 * Get the current user's session
 * @param supabase - Supabase client
 * @returns Session object or null
 */
export async function getSession(supabase: SupabaseClient<Database>) {
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error || !session) {
        return null;
    }

    return session;
}

/**
 * Check if a user is authenticated
 * @param supabase - Supabase client
 * @returns True if authenticated
 */
export async function isAuthenticated(supabase: SupabaseClient<Database>): Promise<boolean> {
    const user = await getCurrentUser(supabase);
    return user !== null;
}

/**
 * Get user profile from database
 * @param supabase - Supabase client
 * @param userId - User ID
 * @returns User profile or null
 */
export async function getUserProfile(
    supabase: SupabaseClient<Database>,
    userId: string
): Promise<Database['public']['Tables']['users']['Row'] | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !data) {
        return null;
    }

    return data;
}

/**
 * Check if user has a specific role
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param role - Role to check
 * @returns True if user has the role
 */
export async function hasRole(
    supabase: SupabaseClient<Database>,
    userId: string,
    role: 'user' | 'admin'
): Promise<boolean> {
    const profile = await getUserProfile(supabase, userId);
    return profile?.role === role;
}

/**
 * Check if user is an admin
 * @param supabase - Supabase client
 * @param userId - User ID
 * @returns True if user is an admin
 */
export async function isAdmin(
    supabase: SupabaseClient<Database>,
    userId: string
): Promise<boolean> {
    return hasRole(supabase, userId, 'admin');
}

/**
 * Refresh the user's session
 * @param supabase - Supabase client
 * @returns New session or null
 */
export async function refreshSession(supabase: SupabaseClient<Database>) {
    const {
        data: { session },
        error,
    } = await supabase.auth.refreshSession();

    if (error || !session) {
        return null;
    }

    return session;
}

/**
 * Sign out the current user
 * @param supabase - Supabase client
 */
export async function signOut(supabase: SupabaseClient<Database>): Promise<void> {
    await supabase.auth.signOut();
}
