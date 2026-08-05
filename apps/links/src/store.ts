import { shortLinkRecordSchema } from './types';
import type { ClickEvent, ShortLinkLookup, ShortLinkRecord, ShortLinkStore } from './types';

/**
 * Read models.
 *
 * `apps/links` never imports `@relay/application`, `@relay/connectors` or
 * `@relay/ai`. It reads two tables and writes one, through a narrow port, so a
 * compromise of the redirect tier yields no tenant credential and no publishing
 * capability.
 */

/** The minimal query surface a Postgres pool exposes. Keeps `pg` swappable. */
export interface SqlQueryable {
  query(
    text: string,
    values?: readonly unknown[],
  ): Promise<{ rows: readonly Record<string, unknown>[] }>;
}

const RESOLVE_SQL = `
  select
    id             as "linkId",
    workspace_id   as "workspaceId",
    domain         as "domain",
    slug           as "slug",
    destination_url as "destinationUrl",
    state::text    as "state",
    expires_at     as "expiresAt",
    coalesce(safety_scan ->> 'verdict', 'unscanned') as "safetyVerdict"
  from app.short_links
  where slug = $1
    and (domain = $2 or (domain is null and $3))
  limit 1
`;

const INSERT_CLICK_SQL = `
  insert into app.short_link_clicks (
    workspace_id, short_link_id, occurred_at, country_code,
    device_class, referrer_class, bot_class, dedupe_key, dedupe_expires_at
  )
  select * from unnest(
    $1::uuid[], $2::uuid[], $3::timestamptz[], $4::text[],
    $5::text[], $6::text[], $7::app.bot_classification[], $8::text[], $9::timestamptz[]
  )
  on conflict (short_link_id, dedupe_key) do nothing
`;

function toRecord(row: Record<string, unknown>): ShortLinkRecord | null {
  const expiresAt = row['expiresAt'];
  const candidate = {
    ...row,
    expiresAt:
      expiresAt === null || expiresAt === undefined
        ? null
        : expiresAt instanceof globalThis.Date
          ? expiresAt.toISOString()
          : String(expiresAt),
    safetyVerdict: ['safe', 'blocked', 'unscanned'].includes(String(row['safetyVerdict']))
      ? row['safetyVerdict']
      : 'unscanned',
  };
  const parsed = shortLinkRecordSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

/**
 * The default store: one indexed read, parsed at the boundary. A row we cannot
 * parse is treated as a miss rather than trusted, because a half-understood
 * destination is exactly the thing we must not redirect to.
 */
export function createSqlShortLinkStore(
  db: SqlQueryable,
  options: { readonly defaultHosts?: readonly string[] } = {},
): ShortLinkStore {
  const defaultHosts = (options.defaultHosts ?? []).map((host) => host.toLowerCase());
  return {
    async resolve(lookup: ShortLinkLookup): Promise<ShortLinkRecord | null> {
      const host = lookup.host.toLowerCase();
      const isDefaultDomain = defaultHosts.includes(host);
      const result = await db.query(RESOLVE_SQL, [lookup.slug, host, isDefaultDomain]);
      const row = result.rows[0];
      return row === undefined ? null : toRecord(row);
    },
  };
}

/** Batched click writer for the same pool. Runs behind the buffer, never inline. */
export function createSqlClickWriter(
  db: SqlQueryable,
): (events: readonly ClickEvent[]) => Promise<void> {
  return async (events: readonly ClickEvent[]): Promise<void> => {
    if (events.length === 0) {
      return;
    }
    await db.query(INSERT_CLICK_SQL, [
      events.map((event) => event.workspaceId),
      events.map((event) => event.linkId),
      events.map((event) => event.occurredAt),
      events.map((event) => event.countryCode),
      events.map((event) => event.deviceClass),
      events.map((event) => event.referrerClass),
      events.map((event) => event.botClass),
      events.map((event) => event.dedupeKey),
      events.map((event) => event.dedupeExpiresAt),
    ]);
  };
}

export interface MemoryShortLinkStore extends ShortLinkStore {
  put(record: ShortLinkRecord): void;
  clear(): void;
}

/** Used by tests and by the sandbox deployment. */
export function createMemoryShortLinkStore(
  seed: readonly ShortLinkRecord[] = [],
): MemoryShortLinkStore {
  const byKey = new Map<string, ShortLinkRecord>();
  const keyFor = (domain: string | null, slug: string): string => `${domain ?? '*'}:${slug}`;

  const store: MemoryShortLinkStore = {
    async resolve(lookup: ShortLinkLookup): Promise<ShortLinkRecord | null> {
      const host = lookup.host.toLowerCase();
      return byKey.get(keyFor(host, lookup.slug)) ?? byKey.get(keyFor(null, lookup.slug)) ?? null;
    },
    put(record: ShortLinkRecord): void {
      byKey.set(
        keyFor(record.domain === null ? null : record.domain.toLowerCase(), record.slug),
        record,
      );
    },
    clear(): void {
      byKey.clear();
    },
  };
  for (const record of seed) {
    store.put(record);
  }
  return store;
}
