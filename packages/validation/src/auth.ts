import { z } from 'zod';
import { PASSWORD_CONSTRAINTS } from '@repo/config';

// Email validation
const emailSchema = z.string().email('Invalid email address');

// Password validation with strength requirements
const passwordSchema = z
    .string()
    .min(PASSWORD_CONSTRAINTS.MIN_LENGTH, `Password must be at least ${PASSWORD_CONSTRAINTS.MIN_LENGTH} characters`)
    .max(PASSWORD_CONSTRAINTS.MAX_LENGTH, `Password must be less than ${PASSWORD_CONSTRAINTS.MAX_LENGTH} characters`)
    .refine(
        (password) => {
            if (PASSWORD_CONSTRAINTS.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
                return false;
            }
            if (PASSWORD_CONSTRAINTS.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
                return false;
            }
            if (PASSWORD_CONSTRAINTS.REQUIRE_NUMBER && !/[0-9]/.test(password)) {
                return false;
            }
            if (PASSWORD_CONSTRAINTS.REQUIRE_SPECIAL && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                return false;
            }
            return true;
        },
        {
            message: 'Password must contain uppercase, lowercase, and number',
        }
    );

// Login schema
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
});

// Signup schema
export const signupSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
        .optional(),
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
    email: emailSchema,
});

// Password reset schema
export const passwordResetSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
});

// Change password schema
export const changePasswordSchema = z.object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: passwordSchema,
});

// Update profile schema
export const updateProfileSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
        .optional(),
    email: emailSchema.optional(),
});

// Export types
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
