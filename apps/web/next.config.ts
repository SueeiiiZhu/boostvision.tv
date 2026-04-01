import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true, // Enable Gzip compression

  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'], // Optimize image formats
    qualities: [75, 80],
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
    optimizePackageImports: ['next-qrcode', '@vercel/analytics'],
  },

  // Production optimization
  productionBrowserSourceMaps: false, // Disable source maps in production

  // Compiler options for modern browsers
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    // Enable tree shaking for production builds
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
      };
    }
    return config;
  },

  // Transpile packages for modern browsers
  transpilePackages: [],
};

export default withNextIntl(nextConfig);
