import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_HOST || process.env.BACKEND_URL;
const backendImagePattern = backendUrl
  ? (() => {
      const url = new URL(backendUrl);
      return {
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
        port: url.port,
        pathname: '/media/**',
      };
    })()
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      ...(backendImagePattern ? [backendImagePattern] : []),
    ],
    unoptimized: true, // Disable image optimization
  },
};

export default withNextIntl(nextConfig);
