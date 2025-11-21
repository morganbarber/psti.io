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
