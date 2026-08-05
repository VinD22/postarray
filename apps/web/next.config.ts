import { fileURLToPath } from 'node:url';

import type { NextConfig } from 'next';

/**
 * Workspace packages ship TypeScript source with no build step, so Next has to
 * transpile them itself.
 */
const workspacePackages = ['@relay/design-system', '@relay/i18n', '@relay/contracts'];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Docker runtime stage copies .next/standalone and runs server.js.
  output: 'standalone',
  outputFileTracingRoot: fileURLToPath(new URL('../../', import.meta.url)),
  poweredByHeader: false,
  transpilePackages: workspacePackages,

  // The app is a control plane for other people's accounts. Nothing here is
  // embeddable and nothing here should be sniffed into a different type.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },

  experimental: {
    optimizePackageImports: ['lucide-react', '@relay/design-system'],
  },

  typescript: {
    // A type error is a build failure. Never ignore.
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
