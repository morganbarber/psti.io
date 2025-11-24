import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from root .env.local
// This must happen before Next.js starts to make env vars available in Edge runtime
dotenvConfig({ path: resolve(process.cwd(), '../../.env.local') });
dotenvConfig({ path: resolve(process.cwd(), '../../.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@psti/ui', '@psti/database', '@psti/auth', '@psti/validation', '@psti/security', '@psti/types', '@psti/config'],
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

export default nextConfig;
