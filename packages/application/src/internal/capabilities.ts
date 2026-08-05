import {
  capabilitySnapshotSchema,
  type CapabilitySnapshot,
  type ProviderId,
} from '@relay/contracts';

import type { ServiceDeps } from '../types.js';

import { fromStoredAccountType, toProviderId } from './mappers.js';
import type { Db } from './runtime.js';

/**
 * Capability snapshots.
 *
 * A snapshot is data. It is stored on the connection, captured at approval and
 * revalidated immediately before dispatch. When the stored copy is missing or
 * no longer parses against the current schema we ask the connector registry
 * rather than guessing, and when that is unavailable we return null so the
 * caller can report `unavailable` instead of inventing a limit.
 */

export interface ConnectionCapabilities {
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly snapshot: CapabilitySnapshot | null;
  readonly capabilityVersion: string | null;
}

export async function loadCapabilities(
  db: Db,
  deps: ServiceDeps,
  connectionId: string,
): Promise<ConnectionCapabilities | null> {
  const row = await db.socialConnection.findFirst({
    where: { id: connectionId },
    select: {
      id: true,
      provider: true,
      accountType: true,
      capabilities: true,
      capabilityVersion: true,
    },
  });
  if (row === null) {
    return null;
  }

  const provider = toProviderId(row.provider);
  const stored = capabilitySnapshotSchema.safeParse(row.capabilities);
  if (stored.success) {
    return {
      connectionId: row.id,
      provider,
      snapshot: stored.data,
      capabilityVersion: stored.data.capabilityVersion,
    };
  }

  if (!deps.connectors.has(provider)) {
    return { connectionId: row.id, provider, snapshot: null, capabilityVersion: null };
  }

  try {
    const fresh = await deps.connectors.capabilitiesFor({
      provider,
      connectionId: row.id,
      accountType: fromStoredAccountType(row.accountType),
    });
    const parsed = capabilitySnapshotSchema.parse(fresh);
    return {
      connectionId: row.id,
      provider,
      snapshot: parsed,
      capabilityVersion: parsed.capabilityVersion,
    };
  } catch (error) {
    deps.logger.warn(
      { connectionId, provider, error: String(error) },
      'capabilities.unavailable',
    );
    return {
      connectionId: row.id,
      provider,
      snapshot: null,
      capabilityVersion: row.capabilityVersion,
    };
  }
}

/** Batch form, so a validation pass makes one round trip per connection. */
export async function loadCapabilitiesFor(
  db: Db,
  deps: ServiceDeps,
  connectionIds: readonly string[],
): Promise<ReadonlyMap<string, ConnectionCapabilities>> {
  const index = new Map<string, ConnectionCapabilities>();
  for (const connectionId of new Set(connectionIds)) {
    const loaded = await loadCapabilities(db, deps, connectionId);
    if (loaded !== null) {
      index.set(connectionId, loaded);
    }
  }
  return index;
}

/**
 * The character cost of a body under this provider's link counting rule. X and
 * others charge a fixed number of characters per URL whatever its real length,
 * which the composer counter has to reflect exactly.
 */
export function countCharacters(body: string, snapshot: CapabilitySnapshot): number {
  const counting = snapshot.text.linkCounting;
  // Check the mode before charactersPerLink. Mode 'none' also carries a null
  // charactersPerLink, so testing that first swallowed it and counted links in
  // full for providers that do not count them at all.
  if (counting.mode === 'actual') {
    return [...body].length;
  }
  const urls = body.match(/https?:\/\/\S+/g) ?? [];
  if (counting.mode === 'none') {
    let stripped = body;
    for (const url of urls) {
      stripped = stripped.replace(url, '');
    }
    return [...stripped].length;
  }
  if (counting.charactersPerLink === null) {
    return [...body].length;
  }
  let total = [...body].length;
  for (const url of urls) {
    total = total - [...url].length + counting.charactersPerLink;
  }
  return total;
}

export function containsUrl(body: string): boolean {
  return /https?:\/\/\S+/.test(body);
}

/** Hostnames of every link in the body, lowercased and de-duplicated. */
export function linkHosts(body: string): readonly string[] {
  const urls = body.match(/https?:\/\/\S+/g) ?? [];
  const hosts = new Set<string>();
  for (const url of urls) {
    try {
      hosts.add(new URL(url).hostname.toLowerCase());
    } catch {
      // A malformed URL is a content problem, reported by validation.
    }
  }
  return [...hosts];
}
