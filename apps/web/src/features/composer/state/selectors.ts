/**
 * Derivations the screen reads. Pure functions over `ComposerState` plus the
 * accounts, so the rail, the counters, the review list and the summary bar can
 * never disagree with each other.
 */

import {
  diffFromMaster,
  estimateCreateCostMinor,
  resolveVariant,
  type ValidationIssue,
} from '@relay/contracts';

import { countCharacters, findUrls, mediaLimitFor, resolvePublishedUrl } from './capability-rules.js';
import { validateTarget, type DraftFacts } from './validate-draft.js';
import type { MediaFacts } from './capability-rules.js';
import type {
  ComposerState,
  TargetAccount,
  TargetRailState,
  TargetSummary,
} from '../types.js';

export interface MediaLookup {
  /** The facts for one media id, or null when the library has not loaded it. */
  readonly get: (mediaId: string) => (MediaFacts & {
    readonly altText: string | null;
    readonly altTextWaived: boolean;
    readonly rightsDeclared: boolean;
  }) | null;
}

function railState(
  account: TargetAccount,
  overriddenCount: number,
  issues: readonly ValidationIssue[],
  approvalRequired: boolean,
): TargetRailState {
  const kindSupport = account.capabilities.contentKinds;
  const anySupported = Object.values(kindSupport).some((value) => value === 'supported');
  const anyNotImplemented = Object.values(kindSupport).some(
    (value) => value === 'not_implemented',
  );
  if (!anySupported) {
    return anyNotImplemented ? 'not_built' : 'unsupported';
  }
  if (issues.some((issue) => issue.severity === 'error')) {
    return 'blocked';
  }
  if (issues.some((issue) => issue.severity === 'warning')) {
    return 'issue';
  }
  if (approvalRequired) {
    return 'needs_approval';
  }
  return overriddenCount > 0 ? 'override' : 'inherits';
}

export interface SummarizeOptions {
  readonly state: ComposerState;
  readonly accounts: readonly TargetAccount[];
  readonly media: MediaLookup;
  readonly approvalRequired: boolean;
  /** Issues the server returned, merged over the locally computed ones. */
  readonly serverIssues?: readonly ValidationIssue[];
}

/** One row per selected target, in the order the user picked them. */
export function summarizeTargets(options: SummarizeOptions): TargetSummary[] {
  const { state, accounts, media, approvalRequired, serverIssues = [] } = options;
  const byId = new Map(accounts.map((account) => [account.connectionId, account]));

  return state.selectedConnectionIds.flatMap((connectionId) => {
    const account = byId.get(connectionId);
    if (!account) {
      return [];
    }
    const overrides = state.overrides[connectionId] ?? {};
    const resolved = resolveVariant(state.master, overrides);
    const settings = state.settings[connectionId];
    const files = resolved.values.mediaIds
      .map((mediaId) => media.get(mediaId))
      .filter((file): file is NonNullable<ReturnType<MediaLookup['get']>> => file !== null);

    const facts: DraftFacts = {
      resolved,
      media: files,
      unresolvedMentionCount: (settings?.mentions ?? []).filter(
        (mention) => mention.externalId.length === 0,
      ).length,
      destinationChosen: settings?.destination != null,
      privacyChosen: (settings?.privacyValue ?? '').length > 0,
      altTextMissingCount: files.filter(
        (file) => file.kind !== 'video' && !file.altTextWaived && !file.altText,
      ).length,
      rightsUndeclaredCount: files.filter((file) => !file.rightsDeclared).length,
    };

    const local = validateTarget(account, facts);
    const fromServer = serverIssues.filter((issue) => issue.targetId === connectionId);
    const issues = mergeIssues(local, fromServer);
    const overriddenFields = diffFromMaster(state.master, overrides).map((diff) => diff.field);
    const containsUrl = findUrls(resolved.values.body).length > 0;
    const cost = estimateCreateCostMinor(account.capabilities, containsUrl);
    const firstLink = resolved.values.links[0];

    return [
      {
        connectionId,
        account,
        state: railState(account, overriddenFields.length, issues, approvalRequired),
        characterCount: countCharacters(resolved.values.body, account.capabilities),
        characterLimit: account.capabilities.text.maxLength,
        mediaCount: resolved.values.mediaIds.length,
        mediaLimit: mediaLimitFor(account.capabilities, resolved.values.contentKind),
        overriddenFields,
        issues,
        blockingIssueCount: issues.filter((issue) => issue.severity === 'error').length,
        warningIssueCount: issues.filter((issue) => issue.severity === 'warning').length,
        estimatedCostMinor: cost,
        costCurrency: account.capabilities.cost?.currency ?? null,
        publishedUrl: firstLink ? resolvePublishedUrl(firstLink) : null,
      } satisfies TargetSummary,
    ];
  });
}

/** Server issues win on a shared code so a stale local guess never lingers. */
function mergeIssues(
  local: readonly ValidationIssue[],
  fromServer: readonly ValidationIssue[],
): ValidationIssue[] {
  const serverCodes = new Set(fromServer.map((issue) => issue.code));
  return [...fromServer, ...local.filter((issue) => !serverCodes.has(issue.code))];
}

export interface DraftTotals {
  readonly targetCount: number;
  readonly blockedCount: number;
  readonly issueCount: number;
  readonly divergentCount: number;
  readonly estimatedCostMinor: number | null;
  readonly costCurrency: string | null;
  readonly canSchedule: boolean;
}

export function totalsFor(summaries: readonly TargetSummary[]): DraftTotals {
  const priced = summaries.filter(
    (summary) => summary.estimatedCostMinor !== null && summary.costCurrency !== null,
  );
  const currencies = new Set(priced.map((summary) => summary.costCurrency));
  const currency = currencies.size === 1 ? [...currencies][0] ?? null : null;
  const blockedCount = summaries.filter((summary) => summary.blockingIssueCount > 0).length;

  return {
    targetCount: summaries.length,
    blockedCount,
    issueCount: summaries.reduce(
      (total, summary) => total + summary.blockingIssueCount + summary.warningIssueCount,
      0,
    ),
    divergentCount: summaries.filter((summary) => summary.overriddenFields.length > 0).length,
    estimatedCostMinor:
      currency === null
        ? null
        : priced.reduce((total, summary) => total + (summary.estimatedCostMinor ?? 0), 0),
    costCurrency: currency,
    canSchedule: summaries.length > 0 && blockedCount === 0,
  };
}

/** Flat, ordered list of issues for the "next issue" keyboard shortcut. */
export function issueCursorList(
  summaries: readonly TargetSummary[],
): { connectionId: string; issue: ValidationIssue }[] {
  return summaries.flatMap((summary) =>
    summary.issues.map((issue) => ({ connectionId: summary.connectionId, issue })),
  );
}

/** The absolute instants each sequence item runs at, given the root time. */
export function sequenceTimeline(
  rootInstant: string | null,
  items: readonly { id: string; delaySeconds: number }[],
): { id: string; instant: string | null }[] {
  let cursor = rootInstant === null ? null : Date.parse(rootInstant);
  return items.map((item) => {
    if (cursor === null || Number.isNaN(cursor)) {
      return { id: item.id, instant: null };
    }
    cursor += item.delaySeconds * 1000;
    return { id: item.id, instant: new Date(cursor).toISOString() };
  });
}

/** The first N occurrence dates for a repeat, so the sheet can list them. */
export function repeatOccurrences(
  startInstant: string,
  cadenceDays: number,
  endDate: string | null,
  count: number | null,
  maximum: number,
): string[] {
  const start = Date.parse(startInstant);
  if (Number.isNaN(start)) {
    return [];
  }
  const limit = count ?? maximum;
  const end = endDate === null ? null : Date.parse(`${endDate}T23:59:59.999Z`);
  const dayMs = 86_400_000;
  const output: string[] = [];
  for (let index = 0; index < Math.min(limit, maximum); index += 1) {
    const instant = start + index * cadenceDays * dayMs;
    if (end !== null && instant > end) {
      break;
    }
    output.push(new Date(instant).toISOString());
  }
  return output;
}
