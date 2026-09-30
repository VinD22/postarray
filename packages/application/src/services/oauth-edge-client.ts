import { normalizeScopes } from '@relay/contracts';
import { z } from 'zod';

import type { ServiceDeps } from '../types';

/**
 * The edge copy of an OAuth client.
 *
 * The authorization server in `apps/api` never reads PostgreSQL on the token
 * path: it reads this record from the key value store. Every write to a
 * client row is therefore followed by a write here, and both the managed
 * developer-app service and dynamic registration go through this one module so
 * the two can never drift into two record shapes.
 */

const EDGE_CLIENT_NAMESPACE = 'relay:edge:client';

export const edgeClientSchema = z
  .object({
    clientId: z.string(),
    appId: z.string(),
    /** Null for a dynamically registered client, which no workspace owns. */
    workspaceId: z.string().nullable(),
    name: z.string(),
    clientType: z.enum(['public', 'confidential']),
    secretHash: z.string().nullable(),
    previousSecretHash: z.string().nullable(),
    previousSecretExpiresAt: z.string().nullable(),
    redirectUris: z.array(z.string()),
    homepageUrl: z.string(),
    privacyPolicyUrl: z.string(),
    termsUrl: z.string(),
    logoUrl: z.string().nullable(),
    supportEmail: z.string(),
    allowedScopes: z.array(z.string()),
    firstParty: z.boolean(),
    /** `dynamic` means the name is self-asserted and the consent screen says so. */
    registration: z.enum(['managed', 'dynamic', 'resource_server']).default('managed'),
    disabledAt: z.string().nullable(),
    createdAt: z.string(),
  })
  .strict();
export type EdgeClientRecord = z.infer<typeof edgeClientSchema>;

/** The row fields the edge record is derived from. */
export interface EdgeClientRow {
  readonly id: string;
  readonly workspaceId: string | null;
  readonly name: string;
  readonly clientId: string;
  readonly clientType: string;
  readonly secretHash: string | null;
  readonly redirectUris: readonly string[];
  readonly allowedScopes: readonly string[];
  readonly homepageUrl: string | null;
  readonly privacyPolicyUrl: string | null;
  readonly termsUrl: string | null;
  readonly logoUrl: string | null;
  readonly supportEmail: string | null;
  readonly status: string;
  readonly registration?: string;
  readonly createdAt: Date;
}

export function edgeClientKey(clientId: string): string {
  return `${EDGE_CLIENT_NAMESPACE}:${clientId}`;
}

export async function previousEdgeClient(
  deps: ServiceDeps,
  clientId: string,
): Promise<EdgeClientRecord | null> {
  const raw = await deps.kv.get(edgeClientKey(clientId));
  if (raw === null) {
    return null;
  }
  try {
    return edgeClientSchema.safeParse(JSON.parse(raw)).data ?? null;
  } catch {
    return null;
  }
}

export async function writeEdgeClient(
  deps: ServiceDeps,
  row: EdgeClientRow,
  previous: { readonly hash: string | null; readonly expiresAt: string | null } = {
    hash: null,
    expiresAt: null,
  },
): Promise<void> {
  const record = edgeClientSchema.parse({
    clientId: row.clientId,
    appId: row.id,
    workspaceId: row.workspaceId,
    name: row.name,
    clientType: row.clientType === 'confidential' ? 'confidential' : 'public',
    secretHash: row.secretHash,
    previousSecretHash: previous.hash,
    previousSecretExpiresAt: previous.expiresAt,
    redirectUris: [...row.redirectUris],
    homepageUrl: row.homepageUrl ?? '',
    privacyPolicyUrl: row.privacyPolicyUrl ?? '',
    termsUrl: row.termsUrl ?? '',
    logoUrl: row.logoUrl,
    supportEmail: row.supportEmail ?? '',
    allowedScopes: [...normalizeScopes(row.allowedScopes)],
    firstParty: false,
    registration: row.registration === 'dynamic' ? 'dynamic' : 'managed',
    disabledAt: row.status === 'active' ? null : deps.clock.now().toISOString(),
    createdAt: row.createdAt.toISOString(),
  });
  await deps.kv.set(edgeClientKey(row.clientId), JSON.stringify(record));
}
