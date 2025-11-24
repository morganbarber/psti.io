import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from root .env.local
dotenvConfig({ path: resolve(process.cwd(), '../../.env.local') });
dotenvConfig({ path: resolve(process.cwd(), '../../.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@psti/database'],
};

export default nextConfig;
