import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
        providerImportSource: '@mdx-js/react',
    },
});

const nextConfig: NextConfig = {
    images: {
        domains: [
            'i.scdn.co', // Spotify album art
            'images.genius.com', // Genius images
            'i.ytimg.com', // YouTube thumbnails
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.scdn.co',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.genius.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.ytimg.com',
                pathname: '/**',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        // Handle Konva.js for client-side only
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                canvas: false,
                fs: false,
            };
        }

        // Exclude Konva from server-side bundle
        if (isServer) {
            config.externals = [...(config.externals || []), 'konva', 'react-konva'];
        }

        return config;
    },
    experimental: {
        // serverExternalPackages: ['three'], // Removed as it's not supported in this Next.js version
    },
    // Configure pageExtensions to include md and mdx
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

// Apply MDX configuration
export default withMDX(nextConfig);
