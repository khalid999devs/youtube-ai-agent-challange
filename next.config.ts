import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'i.ytimg.com',
        protocol: 'https',
      },
      {
        hostname: 'yt3.ggpht.com',
        protocol: 'https',
      },
      {
        hostname: 'abundant-jaguar-872.convex.cloud',
        protocol: 'https',
      },
    ],
  },

  reactStrictMode: false,
};

export default nextConfig;
