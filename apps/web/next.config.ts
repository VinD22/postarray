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
  // Dev-only: some local browser/DNS setups resolve `127.0.0.1` but not
  // `localhost` for this app's own origin, which Next's cross-origin dev-asset
  // check then blocks by default. Has no effect on a production build.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  /*
   * Standalone output, except on Vercel.
   *
   * A self-hosted deployment wants it: `.next/standalone` carries a server.js
   * and only the files the app actually imports, which is what makes running
   * this on a small box practical.
   *
   * Vercel does its own file tracing and reads `.next/next-server.js.nft.json`
   * in its post-build step. Standalone writes traces inside
   * `.next/standalone` instead and never produces that file, so the build
   * completes, generates every page, and then dies with an ENOENT on the last
   * line. It is a confusing failure precisely because everything before it
   * succeeded.
   */
  ...(process.env.VERCEL === '1' ? {} : { output: 'standalone' as const }),
  outputFileTracingRoot: fileURLToPath(new URL('../../', import.meta.url)),
  poweredByHeader: false,
  typedRoutes: true,
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
