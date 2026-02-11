import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true, // Enable Gzip compression

  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'], // Optimize image formats
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['next-qrcode'],
  },
};

export default withNextIntl(nextConfig);
