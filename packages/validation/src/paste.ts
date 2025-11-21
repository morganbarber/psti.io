import { z } from 'zod';
import { PasteVisibility, PasteExpiration } from '@repo/types';
import {
    PASTE_CONSTRAINTS,
    SUPPORTED_LANGUAGES,
} from '@repo/config';

// Paste creation schema
export const createPasteSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(PASTE_CONSTRAINTS.MAX_TITLE_LENGTH, `Title must be less than ${PASTE_CONSTRAINTS.MAX_TITLE_LENGTH} characters`),
    content: z
        .string()
        .min(PASTE_CONSTRAINTS.MIN_CONTENT_LENGTH, 'Content is required')
        .max(PASTE_CONSTRAINTS.MAX_CONTENT_LENGTH, `Content must be less than ${PASTE_CONSTRAINTS.MAX_CONTENT_LENGTH} bytes`),
    language: z
        .string()
        .refine((lang) => SUPPORTED_LANGUAGES.includes(lang as any), {
            message: 'Invalid language',
        })
        .default('plaintext'),
    visibility: z.nativeEnum(PasteVisibility).default(PasteVisibility.PUBLIC),
    password: z.string().min(4, 'Password must be at least 4 characters').optional(),
    expiration: z.nativeEnum(PasteExpiration).optional(),
    encrypted: z.boolean().default(false),
    burn_after_read: z.boolean().default(false),
    folder_id: z.string().uuid().optional(),
});

// Paste update schema
export const updatePasteSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(PASTE_CONSTRAINTS.MAX_TITLE_LENGTH, `Title must be less than ${PASTE_CONSTRAINTS.MAX_TITLE_LENGTH} characters`)
        .optional(),
    content: z
        .string()
        .min(PASTE_CONSTRAINTS.MIN_CONTENT_LENGTH, 'Content is required')
        .max(PASTE_CONSTRAINTS.MAX_CONTENT_LENGTH, `Content must be less than ${PASTE_CONSTRAINTS.MAX_CONTENT_LENGTH} bytes`)
        .optional(),
    language: z
        .string()
        .refine((lang) => SUPPORTED_LANGUAGES.includes(lang as any), {
            message: 'Invalid language',
        })
        .optional(),
    visibility: z.nativeEnum(PasteVisibility).optional(),
    password: z.string().min(4, 'Password must be at least 4 characters').optional(),
    expiration: z.nativeEnum(PasteExpiration).optional(),
    folder_id: z.string().uuid().nullable().optional(),
});

// Paste password verification schema
export const verifyPastePasswordSchema = z.object({
    password: z.string().min(1, 'Password is required'),
});

// Folder creation schema
export const createFolderSchema = z.object({
    name: z
        .string()
        .min(1, 'Folder name is required')
        .max(PASTE_CONSTRAINTS.MAX_FOLDER_NAME_LENGTH, `Folder name must be less than ${PASTE_CONSTRAINTS.MAX_FOLDER_NAME_LENGTH} characters`),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

// Folder update schema
export const updateFolderSchema = z.object({
    name: z
        .string()
        .min(1, 'Folder name is required')
        .max(PASTE_CONSTRAINTS.MAX_FOLDER_NAME_LENGTH, `Folder name must be less than ${PASTE_CONSTRAINTS.MAX_FOLDER_NAME_LENGTH} characters`)
        .optional(),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

// Search schema
export const searchPastesSchema = z.object({
    query: z.string().min(1, 'Search query is required'),
    language: z
        .string()
        .refine((lang) => SUPPORTED_LANGUAGES.includes(lang as any), {
            message: 'Invalid language',
        })
        .optional(),
    visibility: z.nativeEnum(PasteVisibility).optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
});

// Pagination schema
export const paginationSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
    sort_by: z.string().optional(),
    sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// Export types
export type CreatePasteInput = z.infer<typeof createPasteSchema>;
export type UpdatePasteInput = z.infer<typeof updatePasteSchema>;
export type VerifyPastePasswordInput = z.infer<typeof verifyPastePasswordSchema>;
export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
export type SearchPastesInput = z.infer<typeof searchPastesSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
