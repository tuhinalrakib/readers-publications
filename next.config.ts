import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      // Production example (optional)
      // {
      //   protocol: 'https',
      //   hostname: 'rp-be.gigafide.com',
      //   pathname: '/media/**',
      // },
    ],
    unoptimized: true, // Disable image optimization
  },
};

export default withNextIntl(nextConfig);
