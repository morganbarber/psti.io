/**
 * Rate limiting utilities
 * Supports both in-memory and Redis-based rate limiting
 */

export interface RateLimitConfig {
    points: number; // Number of requests allowed
    duration: number; // Time window in seconds
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
}

/**
 * In-memory rate limiter using Map
 * For production, use Redis-based rate limiting
 */
class InMemoryRateLimiter {
    private store: Map<string, { count: number; resetAt: number }> = new Map();

    async consume(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
        const now = Date.now();
        const record = this.store.get(key);

        // Clean up expired entries periodically
        if (Math.random() < 0.01) {
            this.cleanup();
        }

        if (!record || record.resetAt < now) {
            // Create new record
            const resetAt = now + config.duration * 1000;
            this.store.set(key, { count: 1, resetAt });
            return {
                allowed: true,
                remaining: config.points - 1,
                resetAt: new Date(resetAt),
            };
        }

        // Check if limit exceeded
        if (record.count >= config.points) {
            return {
                allowed: false,
                remaining: 0,
                resetAt: new Date(record.resetAt),
            };
        }

        // Increment count
        record.count++;
        this.store.set(key, record);

        return {
            allowed: true,
            remaining: config.points - record.count,
            resetAt: new Date(record.resetAt),
        };
    }

    async reset(key: string): Promise<void> {
        this.store.delete(key);
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [key, record] of this.store.entries()) {
            if (record.resetAt < now) {
                this.store.delete(key);
            }
        }
    }
}

// Singleton instance
const rateLimiter = new InMemoryRateLimiter();

/**
 * Check rate limit for a key
 * @param key - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export async function checkRateLimit(
    key: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    return rateLimiter.consume(key, config);
}

/**
 * Reset rate limit for a key
 * @param key - Unique identifier
 */
export async function resetRateLimit(key: string): Promise<void> {
    return rateLimiter.reset(key);
}

/**
 * Generate rate limit key from IP and endpoint
 * @param ip - IP address
 * @param endpoint - API endpoint
 * @returns Rate limit key
 */
export function generateRateLimitKey(ip: string, endpoint: string): string {
    return `ratelimit:${ip}:${endpoint}`;
}

/**
 * Generate rate limit key from user ID and endpoint
 * @param userId - User ID
 * @param endpoint - API endpoint
 * @returns Rate limit key
 */
export function generateUserRateLimitKey(userId: string, endpoint: string): string {
    return `ratelimit:user:${userId}:${endpoint}`;
}
