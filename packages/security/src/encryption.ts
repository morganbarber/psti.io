import { createCipheriv, createDecipheriv, randomBytes, pbkdf2Sync } from 'crypto';
import { ENCRYPTION_CONFIG } from '@psti/config';

/**
 * Encryption utilities for paste content
 * Uses AES-256-GCM for authenticated encryption
 */

export interface EncryptedData {
    encrypted: string; // Base64 encoded
    iv: string; // Base64 encoded
    authTag: string; // Base64 encoded
    salt: string; // Base64 encoded
}

/**
 * Derive encryption key from password using PBKDF2
 */
function deriveKey(password: string, salt: Buffer): Buffer {
    return pbkdf2Sync(
        password,
        salt,
        ENCRYPTION_CONFIG.ITERATIONS,
        ENCRYPTION_CONFIG.KEY_LENGTH,
        'sha256'
    );
}

/**
 * Encrypt data using AES-256-GCM
 * @param data - Data to encrypt
 * @param password - Encryption password (optional, uses env key if not provided)
 * @returns Encrypted data object
 */
export function encrypt(data: string, password?: string): EncryptedData {
    const salt = randomBytes(ENCRYPTION_CONFIG.SALT_LENGTH);
    const key = password
        ? deriveKey(password, salt)
        : Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');

    if (key.length !== ENCRYPTION_CONFIG.KEY_LENGTH) {
        throw new Error('Invalid encryption key length');
    }

    const iv = randomBytes(ENCRYPTION_CONFIG.IV_LENGTH);
    const cipher = createCipheriv(ENCRYPTION_CONFIG.ALGORITHM, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag();

    return {
        encrypted,
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        salt: salt.toString('base64'),
    };
}

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedData - Encrypted data object
 * @param password - Decryption password (optional, uses env key if not provided)
 * @returns Decrypted data
 */
export function decrypt(encryptedData: EncryptedData, password?: string): string {
    const salt = Buffer.from(encryptedData.salt, 'base64');
    const key = password
        ? deriveKey(password, salt)
        : Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');

    if (key.length !== ENCRYPTION_CONFIG.KEY_LENGTH) {
        throw new Error('Invalid encryption key length');
    }

    const iv = Buffer.from(encryptedData.iv, 'base64');
    const authTag = Buffer.from(encryptedData.authTag, 'base64');
    const decipher = createDecipheriv(ENCRYPTION_CONFIG.ALGORITHM, key, iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData.encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Generate a secure random string
 * @param length - Length of the string
 * @returns Random hex string
 */
export function generateRandomString(length: number = 32): string {
    return randomBytes(length).toString('hex');
}

/**
 * Generate a secure encryption key
 * @returns Hex-encoded encryption key
 */
export function generateEncryptionKey(): string {
    return randomBytes(ENCRYPTION_CONFIG.KEY_LENGTH).toString('hex');
}

/**
 * Hash a password using PBKDF2
 * @param password - Password to hash
 * @returns Hashed password with salt (format: salt:hash)
 */
export function hashPassword(password: string): string {
    const salt = randomBytes(ENCRYPTION_CONFIG.SALT_LENGTH);
    const hash = pbkdf2Sync(
        password,
        salt,
        ENCRYPTION_CONFIG.ITERATIONS,
        ENCRYPTION_CONFIG.KEY_LENGTH,
        'sha256'
    );
    return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

/**
 * Verify a password against a hash
 * @param password - Password to verify
 * @param hashedPassword - Hashed password (format: salt:hash)
 * @returns True if password matches
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
    const [saltHex, hashHex] = hashedPassword.split(':');
    const salt = Buffer.from(saltHex, 'hex');
    const hash = pbkdf2Sync(
        password,
        salt,
        ENCRYPTION_CONFIG.ITERATIONS,
        ENCRYPTION_CONFIG.KEY_LENGTH,
        'sha256'
    );
    return hash.toString('hex') === hashHex;
}
