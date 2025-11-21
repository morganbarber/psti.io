/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/ui', '@repo/database', '@repo/auth', '@repo/validation', '@repo/security', '@repo/types', '@repo/config'],
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

export default nextConfig;
