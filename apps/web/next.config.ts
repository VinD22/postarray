import { fileURLToPath } from 'node:url';

import type { NextConfig } from 'next';

/**
 * Workspace packages ship TypeScript source with no build step, so Next has to
 * transpile them itself.
 */
const workspacePackages = ['@relay/design-system', '@relay/i18n', '@relay/contracts'];

const nextConfig: NextConfig = {
  // Next writes its own AGENTS.md and CLAUDE.md into this app on dev start.
  // The project contract lives in the repository root and must not be shadowed.
  agentRules: false,
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
    // Barrel packages: without this every import pulls the whole module graph
    // into the route's bundle.
    optimizePackageImports: [
      'lucide-react',
      'radix-ui',
      '@tanstack/react-query',
      '@relay/design-system',
      '@relay/i18n',
    ],
  },

  typescript: {
    // A type error is a build failure. Never ignore.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
