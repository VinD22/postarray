import type {
  AccountFreshnessRow,
  AccountRef,
  AnalyticsOverview,
  PostComparisonRow,
} from './types';

/**
 * The per-channel rollup under the post table.
 *
 * What this deliberately does not contain: followers, reach and an engagement
 * rate. The overview read does not carry them, and a rate assembled here from
 * numbers that are not in the response would be a figure this screen invented.
 * When the API grows a `channels` field the row gains those columns; until
 * then the table shows what the response actually said.
 *
 * The one derived number here is a sum, and it is guarded. A metric may only
 * be added across posts when the provider's own definition says its
 * aggregation is `sum`. Adding an average, a median or a last-value reading
 * across five posts produces a number that looks like a total and means
 * nothing, so a channel whose readings are not addable reports the reason
 * rather than a figure.
 *
 * Posts with an unavailable reading are counted and excluded, never folded in
 * as zero. Folding them in would move every channel's total toward whichever
 * provider has the worse coverage, which is the opposite of what the reader is
 * trying to see.
 */

export interface ChannelRollup {
  readonly account: AccountRef;
  /** Posts from this account that this period measured. A count, not a metric. */
  readonly postsMeasured: number;
  /**
   * The ranked metric added across those posts, or null when there is nothing
   * to add or the metric may not be added.
   */
  readonly total: number | null;
  /** False when the provider's definition forbids adding this metric up. */
  readonly addable: boolean;
  /** Posts whose ranked metric the provider did not return. */
  readonly unavailableCount: number;
  readonly freshness: AccountFreshnessRow | null;
}

export type ChannelSortKey = 'account' | 'posts' | 'total' | 'unavailable';

function rollupFor(
  account: AccountRef,
  rows: readonly PostComparisonRow[],
  freshness: AccountFreshnessRow | null,
): ChannelRollup {
  let total = 0;
  let counted = 0;
  let unavailableCount = 0;
  let addable = true;

  for (const row of rows) {
    if (row.reading.availability !== 'available' || row.reading.value === null) {
      unavailableCount += 1;
      continue;
    }
    // Null aggregation is "this read did not say", which is not permission to
    // add. Only an explicit `sum` is.
    if (row.reading.definition.aggregation !== 'sum') {
      addable = false;
      continue;
    }
    total += row.reading.value;
    counted += 1;
  }

  return {
    account,
    postsMeasured: rows.length,
    total: addable && counted > 0 ? total : null,
    addable,
    unavailableCount,
    freshness,
  };
}

/**
 * One row per account that appears in the period, in the order the caller
 * supplied the accounts, with any account the response mentions but the filter
 * list does not appended.
 *
 * An account with no posts still gets a row. A silently shorter table is how a
 * reader concludes an account is fine when it simply returned nothing, and the
 * whole screen is built to make that impossible.
 */
export function buildChannelRollups(
  overview: AnalyticsOverview,
  accounts: readonly AccountRef[],
): readonly ChannelRollup[] {
  const byConnection = new Map<string, PostComparisonRow[]>();
  const seen = new Map<string, AccountRef>();

  for (const row of overview.rows) {
    const id = row.account.connectionId;
    seen.set(id, row.account);
    const list = byConnection.get(id) ?? [];
    list.push(row);
    byConnection.set(id, list);
  }

  const freshnessByConnection = new Map(
    overview.freshness.map((row) => [row.account.connectionId, row]),
  );
  for (const row of overview.freshness) seen.set(row.account.connectionId, row.account);
  for (const row of overview.attention) seen.set(row.account.connectionId, row.account);

  // The filter list first, in its own order, then anything the response
  // mentioned that the filter list did not. An account with no posts keeps its
  // row: "we asked and it said nothing" is a row, not an absence.
  const ordered: AccountRef[] = [...accounts];
  const placed = new Set(accounts.map((account) => account.connectionId));
  for (const [id, account] of seen) {
    if (!placed.has(id)) ordered.push(account);
  }

  return ordered.map((account) =>
    rollupFor(
      account,
      byConnection.get(account.connectionId) ?? [],
      freshnessByConnection.get(account.connectionId) ?? null,
    ),
  );
}

/**
 * Sort the rollups.
 *
 * A channel with no total sorts last in both directions rather than being
 * treated as a zero. "We could not add this up" is not the bottom of the
 * ranking, it is outside it, and letting it float to the top on an ascending
 * sort would put a non-answer where the worst performer belongs.
 */
export function sortChannelRollups(
  rollups: readonly ChannelRollup[],
  key: ChannelSortKey,
  direction: 'ascending' | 'descending',
): readonly ChannelRollup[] {
  const sign = direction === 'ascending' ? 1 : -1;

  return [...rollups].sort((a, b) => {
    if (key === 'account') {
      return sign * a.account.displayName.localeCompare(b.account.displayName);
    }
    if (key === 'posts') return sign * (a.postsMeasured - b.postsMeasured);
    if (key === 'unavailable') return sign * (a.unavailableCount - b.unavailableCount);

    if (a.total === null && b.total === null) return 0;
    if (a.total === null) return 1;
    if (b.total === null) return -1;
    return sign * (a.total - b.total);
  });
}
