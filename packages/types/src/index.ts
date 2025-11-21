// Paste visibility options
export enum PasteVisibility {
    PUBLIC = 'public',
    UNLISTED = 'unlisted',
    PRIVATE = 'private',
}

// Paste expiration options
export enum PasteExpiration {
    NEVER = 'never',
    TEN_MINUTES = '10m',
    ONE_HOUR = '1h',
    ONE_DAY = '1d',
    ONE_WEEK = '1w',
    ONE_MONTH = '1m',
    SIX_MONTHS = '6m',
    ONE_YEAR = '1y',
}

// User roles
export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

// Paste interface
export interface Paste {
    id: string;
    user_id: string | null;
    title: string;
    content: string;
    language: string;
    visibility: PasteVisibility;
    password_hash: string | null;
    expires_at: string | null;
    encrypted: boolean;
    burn_after_read: boolean;
    view_count: number;
    created_at: string;
    updated_at: string;
    folder_id: string | null;
}

// Paste creation request
export interface CreatePasteRequest {
    title: string;
    content: string;
    language: string;
    visibility: PasteVisibility;
    password?: string;
    expiration?: PasteExpiration;
    encrypted?: boolean;
    burn_after_read?: boolean;
    folder_id?: string;
}

// Paste update request
export interface UpdatePasteRequest {
    title?: string;
    content?: string;
    language?: string;
    visibility?: PasteVisibility;
    password?: string;
    expiration?: PasteExpiration;
    folder_id?: string;
}

// Paste response (without sensitive data)
export interface PasteResponse {
    id: string;
    user_id: string | null;
    title: string;
    content: string;
    language: string;
    visibility: PasteVisibility;
    has_password: boolean;
    expires_at: string | null;
    encrypted: boolean;
    burn_after_read: boolean;
    view_count: number;
    created_at: string;
    updated_at: string;
    folder_id: string | null;
}

// User interface
export interface User {
    id: string;
    email: string;
    username: string | null;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

// Folder interface
export interface Folder {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

// API response wrapper
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Pagination
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

// Auth types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    username?: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}

// Search
export interface SearchParams extends PaginationParams {
    query: string;
    language?: string;
    visibility?: PasteVisibility;
    user_id?: string;
}
