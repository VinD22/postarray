import { z } from 'zod';

/**
 * Protected resource metadata.
 *
 * We are a resource server, not a second authorization system. Publishing this
 * document is what lets a compliant MCP client discover where to get a token
 * without being told out of band, and returning it in `WWW-Authenticate` on a
 * 401 is what lets it recover.
 */

export const protectedResourceMetadataSchema = z
  .object({
    resource: z.string().min(1),
    authorization_servers: z.array(z.string().min(1)).min(1),
    scopes_supported: z.array(z.string().min(1)),
    bearer_methods_supported: z.array(z.literal('header')),
    resource_documentation: z.string().min(1).optional(),
  })
  .strict();
export type ProtectedResourceMetadata = z.infer<typeof protectedResourceMetadataSchema>;

export const PROTECTED_RESOURCE_PATH = '/.well-known/oauth-protected-resource';

export interface MetadataInput {
  /** The canonical URL of this MCP resource. Tokens must be bound to it. */
  readonly resourceUrl: string;
  readonly issuerUrl: string;
  readonly scopes: readonly string[];
  readonly documentationUrl?: string | undefined;
}

export function buildProtectedResourceMetadata(input: MetadataInput): ProtectedResourceMetadata {
  return protectedResourceMetadataSchema.parse({
    resource: input.resourceUrl,
    authorization_servers: [input.issuerUrl],
    scopes_supported: [...input.scopes],
    // Never a query parameter. A token in a URL ends up in logs and referrers.
    bearer_methods_supported: ['header'],
    ...(input.documentationUrl === undefined
      ? {}
      : { resource_documentation: input.documentationUrl }),
  });
}

export interface ChallengeInput {
  readonly resourceMetadataUrl: string;
  readonly error?: 'invalid_token' | 'insufficient_scope' | undefined;
  readonly errorDescription?: string | undefined;
  readonly requiredScope?: string | undefined;
}

/** The `WWW-Authenticate` value that tells a client how to recover. */
export function buildAuthenticateChallenge(input: ChallengeInput): string {
  const parts = [`Bearer resource_metadata="${input.resourceMetadataUrl}"`];
  if (input.error !== undefined) {
    parts.push(`error="${input.error}"`);
  }
  if (input.errorDescription !== undefined) {
    // Machine readable only. Never a provider payload and never user content.
    parts.push(`error_description="${input.errorDescription.replace(/"/g, '')}"`);
  }
  if (input.requiredScope !== undefined) {
    parts.push(`scope="${input.requiredScope}"`);
  }
  return parts.join(', ');
}
