/**
 * Client-side encryption utilities using Web Crypto API
 * Compatible with the browser environment
 */

/**
 * Decrypt content using AES-GCM
 * @param encryptedData - Base64 encoded encrypted data (IV + Ciphertext)
 * @param keyString - Base64 encoded key
 * @returns Decrypted string
 */
export async function decryptContent(encryptedData: string, keyString: string): Promise<string> {
    try {
        // Convert base64 key to ArrayBuffer
        const keyBuffer = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));

        // Import the key
        const key = await window.crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'AES-GCM' },
            false,
            ['decrypt']
        );

        // Convert encrypted data (base64) to ArrayBuffer
        const encryptedBuffer = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));

        // Extract IV (first 12 bytes) and ciphertext
        const iv = encryptedBuffer.slice(0, 12);
        const ciphertext = encryptedBuffer.slice(12);

        // Decrypt
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            ciphertext
        );

        // Decode to string
        return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Failed to decrypt content. Invalid key or corrupted data.');
    }
}

/**
 * Generate a random encryption key
 * @returns Base64 encoded key
 */
export async function generateKey(): Promise<string> {
    const key = await window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );

    const exported = await window.crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

/**
 * Encrypt content using AES-GCM
 * @param content - Plain text content
 * @param keyString - Base64 encoded key
 * @returns Base64 encoded encrypted data (IV + Ciphertext)
 */
export async function encryptContent(content: string, keyString: string): Promise<string> {
    // Convert base64 key to ArrayBuffer
    const keyBuffer = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));

    // Import the key
    const key = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );

    // Generate IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(content)
    );

    // Combine IV and ciphertext
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    // Convert to base64
    return btoa(String.fromCharCode(...combined));
}
