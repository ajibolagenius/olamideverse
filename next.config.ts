import type { NextConfig } from "next";

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
    experimental: {
        turbo: true,
        serverComponentsExternalPackages: ['three'],
    },
};

export default nextConfig;
