import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * WCAG 2.4.2: every primary signed-in screen names itself in the tab. These
 * routes used to fall back to the bare product name, so eight open tabs all
 * read "Post Array".
 */
const TITLED_ROUTES = [
  'analytics',
  'analytics/experiments',
  'analytics/links',
  'automation',
  'automation/rss',
  'settings',
  'settings/billing',
  'settings/data',
  'settings/localization',
  'settings/members',
  'settings/projects',
  'settings/referrals',
  'settings/security',
  'settings/webhooks',
] as const;

describe('signed-in page titles', () => {
  it.each(TITLED_ROUTES)('%s declares its own title', (route) => {
    const source = readFileSync(
      path.join(__dirname, '[locale]', '(app)', route, 'page.tsx'),
      'utf8',
    );
    expect(source).toMatch(/export async function generateMetadata\(/);
    expect(source).toMatch(/title: intl\.t\.format\('/);
  });
});
