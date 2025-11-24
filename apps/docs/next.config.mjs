import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

// Load environment variables from root .env.local
dotenvConfig({ path: resolve(process.cwd(), '../../.env.local') });
dotenvConfig({ path: resolve(process.cwd(), '../../.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
    options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
    },
})

export default withMDX(nextConfig)
