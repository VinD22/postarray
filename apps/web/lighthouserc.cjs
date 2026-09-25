/**
 * Lighthouse CI against a production server (`next build` then `next start`).
 * Assertions are errors for accessibility, layout shift and public-page SEO,
 * and warnings for performance, so a noisy CI runner reports a slow page without blocking on a single sample.
 */
const origin = process.env.LHCI_ORIGIN ?? 'http://localhost:3000';
const paths = [
  '/',
  '/pricing',
  '/specs/x/character-limit',
  '/tools/post-preflight',
  '/home',
  '/compose',
];

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm start',
      startServerReadyPattern: 'Ready',
      url: paths.map((path) => `${origin}${path}`),
      numberOfRuns: 3,
      settings: { preset: 'desktop' },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: '.*',
          assertions: {
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['warn', { minScore: 0.9 }],
            'categories:performance': ['warn', { minScore: 0.8 }],
            'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['warn', { maxNumericValue: 300 }],
          },
        },
        {
          // The product routes are noindex on purpose, so SEO is scored only
          // on the public pages.
          matchingUrlPattern: '^(?!.*/(home|compose)$).*',
          assertions: { 'categories:seo': ['error', { minScore: 0.9 }] },
        },
      ],
    },
    upload: { target: 'filesystem', outputDir: '.next/lighthouseci' },
  },
};
