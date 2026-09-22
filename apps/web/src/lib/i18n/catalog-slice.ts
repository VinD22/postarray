import type { PartialCatalog } from '@relay/i18n';

/**
 * The keys every route group's client tree can reach: the document-level
 * accessibility labels, the shared actions, the public header and navigation,
 * the theme and language pickers and the motion pause control.
 *
 * The root layout ships only this slice. Marketing formats on the server, so it
 * needs nothing more; the signed-in, onboarding, auth and consent trees mount
 * their own provider with the catalog they need. Sending the whole catalog from
 * the root put every product string into every public page's RSC payload.
 */
export const SHELL_KEY_PREFIXES = [
  'a11y.',
  'action.',
  'common.',
  'nav.',
  'shell.',
  'web.nav.',
  'web.motion.',
] as const;

/** Keep only the keys under one of `prefixes`. */
export function sliceCatalog(catalog: PartialCatalog, prefixes: readonly string[]): PartialCatalog {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(catalog)) {
    if (typeof value === 'string' && prefixes.some((prefix) => key.startsWith(prefix))) {
      out[key] = value;
    }
  }
  return out as PartialCatalog;
}
