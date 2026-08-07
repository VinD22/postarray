import { scopeSchema } from '@relay/contracts';
import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination';
import { shortTextSchema } from '../../common/schemas';

/**
 * Developer OAuth application registration.
 *
 * Redirect URI rules, enforced here at registration and again at every
 * authorization request (`04-auth-oauth-and-security.md`, section 7.2):
 *
 * - Exact string match after normalization. No prefix match, no wildcard, no
 *   subdomain wildcard, no path-suffix tolerance.
 * - `https://` only, with two exceptions for native and CLI clients:
 *   `http://127.0.0.1:{port}` and `http://[::1]:{port}`. Never
 *   `http://localhost` by name, because name resolution is attacker-influenced.
 * - No fragment component.
 * - No open-redirector shapes: a registered URI whose path or query contains
 *   another absolute URL is rejected.
 * - At most five per application.
 */

export const MAX_REDIRECT_URIS = 5;

/** Loopback literals are permitted for native clients; the hostname is not. */
const LOOPBACK_HOSTS = new Set(['127.0.0.1', '[::1]', '::1']);

export function isAcceptableRedirectUri(candidate: string): boolean {
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return false;
  }
  if (url.hash.length > 0) {
    return false;
  }
  if (url.username.length > 0 || url.password.length > 0) {
    return false;
  }
  // An absolute URL nested in the path or the query is the classic open
  // redirector, and registering one would let us be the redirect hop.
  const nested = `${url.pathname}${url.search}`.toLowerCase();
  if (nested.includes('http://') || nested.includes('https://')) {
    return false;
  }
  if (url.protocol === 'https:') {
    return true;
  }
  return url.protocol === 'http:' && LOOPBACK_HOSTS.has(url.hostname);
}

export const redirectUriSchema = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine(isAcceptableRedirectUri, { error: 'REDIRECT_URI_NOT_ACCEPTABLE' });

const publishedHttpsUrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine(
    (candidate) => {
      try {
        return new URL(candidate).protocol === 'https:';
      } catch {
        return false;
      }
    },
    { error: 'HTTPS_URL_REQUIRED' },
  );

export const createOAuthAppSchema = z
  .object({
    name: shortTextSchema,
    clientType: z.enum(['public', 'confidential']),
    homepageUrl: publishedHttpsUrlSchema,
    privacyPolicyUrl: publishedHttpsUrlSchema,
    termsUrl: publishedHttpsUrlSchema,
    supportEmail: z.email().trim().max(320),
    logoUrl: publishedHttpsUrlSchema.nullable().default(null),
    redirectUris: z.array(redirectUriSchema).min(1).max(MAX_REDIRECT_URIS),
    /**
     * The maximum set this app may ever request. `billing:read` may be granted;
     * there is no `billing:write` or credential-minting scope in the registry
     * that a third party could ask for, and the authorize endpoint rejects any
     * scope outside this list.
     */
    allowedScopes: z.array(scopeSchema).min(1).max(32),
  })
  .strict();

export const updateOAuthAppSchema = createOAuthAppSchema
  .omit({ clientType: true, logoUrl: true })
  .partial()
  .extend({
    logoUrl: publishedHttpsUrlSchema.nullable().optional(),
    status: z.enum(['active', 'sandbox', 'disabled']).optional(),
  })
  .strict();

export const listAppsQuerySchema = cursorQuerySchema;
export const listGrantsQuerySchema = cursorQuerySchema;

export type CreateOAuthAppInput = z.infer<typeof createOAuthAppSchema>;
export type UpdateOAuthAppInput = z.infer<typeof updateOAuthAppSchema>;
