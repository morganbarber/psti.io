/**
 * Database types generated from Supabase schema
 * These should be regenerated when the database schema changes
 * Run: npx supabase gen types typescript --project-id <project-id> > src/types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    username: string | null;
                    role: 'user' | 'admin';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    username?: string | null;
                    role?: 'user' | 'admin';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    username?: string | null;
                    role?: 'user' | 'admin';
                    created_at?: string;
                    updated_at?: string;
                };
            };
            pastes: {
                Row: {
                    id: string;
                    user_id: string | null;
                    title: string;
                    content: string;
                    language: string;
                    visibility: 'public' | 'unlisted' | 'private';
                    password_hash: string | null;
                    expires_at: string | null;
                    encrypted: boolean;
                    encryption_iv: string | null;
                    encryption_auth_tag: string | null;
                    encryption_salt: string | null;
                    burn_after_read: boolean;
                    view_count: number;
                    created_at: string;
                    updated_at: string;
                    folder_id: string | null;
                };
                Insert: {
                    id?: string;
                    user_id?: string | null;
                    title: string;
                    content: string;
                    language?: string;
                    visibility?: 'public' | 'unlisted' | 'private';
                    password_hash?: string | null;
                    expires_at?: string | null;
                    encrypted?: boolean;
                    encryption_iv?: string | null;
                    encryption_auth_tag?: string | null;
                    encryption_salt?: string | null;
                    burn_after_read?: boolean;
                    view_count?: number;
                    created_at?: string;
                    updated_at?: string;
                    folder_id?: string | null;
                };
                Update: {
                    id?: string;
                    user_id?: string | null;
                    title?: string;
                    content?: string;
                    language?: string;
                    visibility?: 'public' | 'unlisted' | 'private';
                    password_hash?: string | null;
                    expires_at?: string | null;
                    encrypted?: boolean;
                    encryption_iv?: string | null;
                    encryption_auth_tag?: string | null;
                    encryption_salt?: string | null;
                    burn_after_read?: boolean;
                    view_count?: number;
                    created_at?: string;
                    updated_at?: string;
                    folder_id?: string | null;
                };
            };
            folders: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    description: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    description?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    description?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            paste_views: {
                Row: {
                    id: string;
                    paste_id: string;
                    viewer_ip: string | null;
                    viewer_user_id: string | null;
                    viewed_at: string;
                };
                Insert: {
                    id?: string;
                    paste_id: string;
                    viewer_ip?: string | null;
                    viewer_user_id?: string | null;
                    viewed_at?: string;
                };
                Update: {
                    id?: string;
                    paste_id?: string;
                    viewer_ip?: string | null;
                    viewer_user_id?: string | null;
                    viewed_at?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            user_role: 'user' | 'admin';
            paste_visibility: 'public' | 'unlisted' | 'private';
        };
    };
}
