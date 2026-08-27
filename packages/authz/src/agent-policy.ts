import type { ApprovalLevel, ProviderId } from '@relay/contracts';

import { clusterSimilar, SUBSTANTIAL_SIMILARITY_THRESHOLD } from './similarity';

/**
 * The approval-level engine.
 *
 * Identical on every surface. The web app, the REST API, the MCP server, the
 * CLI and the worker all call `evaluateAgentAction`; none of them re-implements
 * a piece of it, and none of them may treat "the agent host showed a
 * confirmation dialog" as an authorization fact.
 *
 * Level 0 reads and validates. Level 1 also creates and edits drafts. Level 2
 * also schedules, but only inside the preauthorized accounts, hours, cadence,
 * locales, domains and look-ahead attached to the identity. Level 3 also
 * publishes immediately, and even at level 3 the escalations below always need
 * an explicit human confirmation.
 */

export const AGENT_ACTION_KINDS = [
  'read',
  'validate',
  'draft',
  'request_approval',
  'schedule',
  'reschedule',
  'cancel',
  'publish_now',
] as const;
export type AgentActionKind = (typeof AGENT_ACTION_KINDS)[number];

/** The minimum level at which an action kind is even conceivable. */
export const ACTION_MINIMUM_LEVEL: Readonly<Record<AgentActionKind, ApprovalLevel>> = Object.freeze(
  {
    read: 'level_0_read',
    validate: 'level_0_read',
    draft: 'level_1_draft',
    request_approval: 'level_1_draft',
    schedule: 'level_2_scheduled',
    reschedule: 'level_2_scheduled',
    cancel: 'level_2_scheduled',
    publish_now: 'level_3_confirm',
  },
);

const LEVEL_RANK: Readonly<Record<ApprovalLevel, number>> = Object.freeze({
  level_0_read: 0,
  level_1_draft: 1,
  level_2_scheduled: 2,
  level_3_confirm: 3,
});

/** Every restriction is optional and narrowing only. Empty means no narrowing. */
export interface ServiceAccountRestrictions {
  readonly projectIds?: readonly string[];
  readonly connectionIds?: readonly string[];
  readonly providers?: readonly ProviderId[];
  readonly locales?: readonly string[];
  readonly approvedDomains?: readonly string[];
  /** External publications per rolling day across the whole identity. */
  readonly maxDailyPublishes?: number | null;
  readonly maxLookAheadDays?: number | null;
  /**
   * Inclusive start hour and exclusive end hour in the workspace time zone. A
   * window that wraps midnight (22 to 6) is expressed with `startHour > endHour`.
   */
  readonly allowedHours?: { readonly startHour: number; readonly endHour: number } | null;
  readonly ianaTimeZone?: string;
  readonly maxApprovalLevel?: ApprovalLevel;
  readonly disabled?: boolean;
}

export interface AgentTarget {
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly projectId: string | null;
  readonly locale: string;
  /** The resolved body that will actually publish to this target. */
  readonly body: string;
  /** Absolute instant the target publishes at, ISO 8601 with an offset. */
  readonly scheduledInstant?: string;
  /** True when this target produces an external post in this request. */
  readonly external: boolean;
  /** True when the target's platform privacy or audience setting is changing. */
  readonly privacyChanged?: boolean;
  /** Hostnames of every link that will appear in the published copy. */
  readonly linkHosts?: readonly string[];
}

export interface ContentClassification {
  readonly commercial?: boolean;
  readonly political?: boolean;
  readonly regulated?: boolean;
  readonly sensitive?: boolean;
}

export interface AgentActionRequest {
  readonly kind: AgentActionKind;
  readonly approvalLevel: ApprovalLevel;
  readonly restrictions?: ServiceAccountRestrictions;
  readonly targets: readonly AgentTarget[];
  readonly classification?: ContentClassification;
  /** Content changed after an approval decision, beyond workspace drift policy. */
  readonly changedAfterApproval?: boolean;
  /** Connections this identity has never published to before. */
  readonly firstUseConnectionIds?: readonly string[];
  readonly estimatedCostMinor?: number;
  readonly costCurrency?: string;
  /** External publications this identity already made in the current day. */
  readonly publishedTodayCount?: number;
  /** `now` for look-ahead and quiet-hours arithmetic. */
  readonly now: Date;
  readonly thresholds?: Partial<AgentThresholds>;
  /** Set by the caller when a human has already confirmed this exact request. */
  readonly humanConfirmed?: boolean;
}

export interface AgentThresholds {
  /** More than this many external publications in one request escalates. */
  readonly maxExternalPublications: number;
  /** More than this many accounts receiving similar content escalates. */
  readonly maxSimilarAccounts: number;
  readonly similarityThreshold: number;
  /** Estimated metered provider cost above which a request escalates. */
  readonly costThresholdMinor: number;
}

export const DEFAULT_AGENT_THRESHOLDS: AgentThresholds = Object.freeze({
  maxExternalPublications: 5,
  maxSimilarAccounts: 3,
  similarityThreshold: SUBSTANTIAL_SIMILARITY_THRESHOLD,
  costThresholdMinor: 100,
});

export const ESCALATION_CODES = [
  'bulk_publication_count',
  'similar_content_across_accounts',
  'first_use_connection',
  'unapproved_link_domain',
  'sensitive_content',
  'privacy_change',
  'changed_after_approval',
  'cost_threshold_exceeded',
  'immediate_publish',
] as const;
export type EscalationCode = (typeof ESCALATION_CODES)[number];

export const RESTRICTION_CODES = [
  'service_account_disabled',
  'approval_level_too_low',
  'approval_level_capped',
  'project_not_preauthorized',
  'connection_not_preauthorized',
  'provider_not_preauthorized',
  'locale_not_preauthorized',
  'domain_not_approved',
  'daily_cadence_exceeded',
  'look_ahead_exceeded',
  'outside_allowed_hours',
  'schedule_in_past',
] as const;
export type RestrictionCode = (typeof RESTRICTION_CODES)[number];

export type PolicyNoteValue = string | number | boolean | null;

export interface PolicyNote<Code extends string> {
  readonly code: Code;
  readonly messageKey: string;
  readonly params: Readonly<Record<string, PolicyNoteValue>>;
  readonly targetId?: string;
}

export interface AgentDecision {
  /** False means the request is refused outright, not merely escalated. */
  readonly allowed: boolean;
  /** True when a human must explicitly confirm before anything leaves Post Array. */
  readonly requiresHumanConfirmation: boolean;
  readonly blockers: readonly PolicyNote<RestrictionCode>[];
  readonly escalations: readonly PolicyNote<EscalationCode>[];
  readonly externalPublicationCount: number;
  readonly similarAccountCount: number;
}

function note<Code extends string>(
  code: Code,
  params: Readonly<Record<string, PolicyNoteValue>> = {},
  targetId?: string,
): PolicyNote<Code> {
  return {
    code,
    messageKey: `agent_policy.${code}`,
    params: { ...params },
    ...(targetId === undefined ? {} : { targetId }),
  };
}

function normalizedHost(host: string): string {
  return host
    .trim()
    .toLowerCase()
    .replace(/^www\./, '');
}

/** `example.com` approves `docs.example.com` but never `notexample.com`. */
export function domainApproved(host: string, approved: readonly string[]): boolean {
  if (approved.length === 0) {
    return true;
  }
  const candidate = normalizedHost(host);
  return approved.some((entry) => {
    const allowed = normalizedHost(entry);
    return candidate === allowed || candidate.endsWith(`.${allowed}`);
  });
}

/** The hour of `instant` in `timeZone`, as an integer 0 to 23. */
export function hourInZone(instant: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    hourCycle: 'h23',
  });
  const parsed = Number.parseInt(formatter.format(instant), 10);
  return Number.isNaN(parsed) ? instant.getUTCHours() : parsed % 24;
}

export function withinAllowedHours(
  instant: Date,
  window: { readonly startHour: number; readonly endHour: number },
  timeZone: string,
): boolean {
  const hour = hourInZone(instant, timeZone);
  if (window.startHour === window.endHour) {
    return true;
  }
  if (window.startHour < window.endHour) {
    return hour >= window.startHour && hour < window.endHour;
  }
  // The window wraps midnight.
  return hour >= window.startHour || hour < window.endHour;
}

/**
 * Count the external publications a request would produce. This is the number
 * the bulk-action rule and the confirmation copy both use, so it must count
 * external posts and not drafts, variants or thread items that never leave.
 */
export function countExternalPublications(targets: readonly AgentTarget[]): number {
  return targets.filter((target) => target.external).length;
}

/**
 * The largest number of distinct accounts that would receive substantially
 * similar content in this request.
 */
export function countSimilarAccounts(
  targets: readonly AgentTarget[],
  threshold: number = SUBSTANTIAL_SIMILARITY_THRESHOLD,
): number {
  const external = targets.filter((target) => target.external);
  if (external.length < 2) {
    return external.length;
  }
  const clusters = clusterSimilar(
    external.map((target) => target.body),
    threshold,
  );
  let largest = 0;
  for (const cluster of clusters) {
    const accounts = new Set(
      cluster.memberIndexes
        .map((index) => external[index]?.connectionId)
        .filter((value): value is string => value !== undefined),
    );
    largest = Math.max(largest, accounts.size);
  }
  return largest;
}

/** True when the request trips either half of the bulk-action definition. */
export function detectBulkAction(
  targets: readonly AgentTarget[],
  thresholds: AgentThresholds = DEFAULT_AGENT_THRESHOLDS,
): boolean {
  return (
    countExternalPublications(targets) > thresholds.maxExternalPublications ||
    countSimilarAccounts(targets, thresholds.similarityThreshold) > thresholds.maxSimilarAccounts
  );
}

function daysBetween(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / 86_400_000;
}

function checkRestrictions(
  request: AgentActionRequest,
  restrictions: ServiceAccountRestrictions,
  timeZone: string,
): PolicyNote<RestrictionCode>[] {
  const blockers: PolicyNote<RestrictionCode>[] = [];

  if (restrictions.disabled === true) {
    blockers.push(note('service_account_disabled'));
  }

  const cap = restrictions.maxApprovalLevel;
  if (cap !== undefined && LEVEL_RANK[request.approvalLevel] > LEVEL_RANK[cap]) {
    blockers.push(note('approval_level_capped', { held: request.approvalLevel, cap }));
  }

  const projectIds = restrictions.projectIds ?? [];
  const connectionIds = restrictions.connectionIds ?? [];
  const providers = restrictions.providers ?? [];
  const locales = restrictions.locales ?? [];
  const approvedDomains = restrictions.approvedDomains ?? [];

  for (const target of request.targets) {
    if (
      projectIds.length > 0 &&
      target.projectId !== null &&
      !projectIds.includes(target.projectId)
    ) {
      blockers.push(
        note('project_not_preauthorized', { projectId: target.projectId }, target.connectionId),
      );
    }
    if (connectionIds.length > 0 && !connectionIds.includes(target.connectionId)) {
      blockers.push(
        note(
          'connection_not_preauthorized',
          { connectionId: target.connectionId },
          target.connectionId,
        ),
      );
    }
    if (providers.length > 0 && !providers.includes(target.provider)) {
      blockers.push(
        note('provider_not_preauthorized', { provider: target.provider }, target.connectionId),
      );
    }
    if (locales.length > 0 && !locales.includes(target.locale)) {
      blockers.push(
        note('locale_not_preauthorized', { locale: target.locale }, target.connectionId),
      );
    }
    for (const host of target.linkHosts ?? []) {
      if (!domainApproved(host, approvedDomains)) {
        blockers.push(note('domain_not_approved', { host }, target.connectionId));
      }
    }

    if (target.scheduledInstant !== undefined) {
      const instant = new Date(target.scheduledInstant);
      if (Number.isNaN(instant.getTime())) {
        continue;
      }
      if (instant.getTime() < request.now.getTime()) {
        blockers.push(
          note(
            'schedule_in_past',
            { scheduledInstant: target.scheduledInstant },
            target.connectionId,
          ),
        );
      }
      const lookAhead = restrictions.maxLookAheadDays;
      if (
        lookAhead !== undefined &&
        lookAhead !== null &&
        daysBetween(request.now, instant) > lookAhead
      ) {
        blockers.push(
          note(
            'look_ahead_exceeded',
            { maxLookAheadDays: lookAhead, scheduledInstant: target.scheduledInstant },
            target.connectionId,
          ),
        );
      }
      const hours = restrictions.allowedHours;
      if (hours !== undefined && hours !== null && !withinAllowedHours(instant, hours, timeZone)) {
        blockers.push(
          note(
            'outside_allowed_hours',
            {
              startHour: hours.startHour,
              endHour: hours.endHour,
              ianaTimeZone: timeZone,
            },
            target.connectionId,
          ),
        );
      }
    }
  }

  const dailyCap = restrictions.maxDailyPublishes;
  if (dailyCap !== undefined && dailyCap !== null) {
    const wouldPublish = countExternalPublications(request.targets);
    const alreadyPublished = request.publishedTodayCount ?? 0;
    if (alreadyPublished + wouldPublish > dailyCap) {
      blockers.push(
        note('daily_cadence_exceeded', {
          maxDailyPublishes: dailyCap,
          alreadyPublished,
          requested: wouldPublish,
        }),
      );
    }
  }

  return blockers;
}

function checkEscalations(
  request: AgentActionRequest,
  thresholds: AgentThresholds,
  restrictions: ServiceAccountRestrictions,
): PolicyNote<EscalationCode>[] {
  const escalations: PolicyNote<EscalationCode>[] = [];
  const externalCount = countExternalPublications(request.targets);
  const similarAccounts = countSimilarAccounts(request.targets, thresholds.similarityThreshold);

  if (request.kind === 'publish_now' && externalCount > 0) {
    escalations.push(note('immediate_publish', { targetCount: externalCount }));
  }
  if (externalCount > thresholds.maxExternalPublications) {
    escalations.push(
      note('bulk_publication_count', {
        count: externalCount,
        threshold: thresholds.maxExternalPublications,
      }),
    );
  }
  if (similarAccounts > thresholds.maxSimilarAccounts) {
    escalations.push(
      note('similar_content_across_accounts', {
        accountCount: similarAccounts,
        threshold: thresholds.maxSimilarAccounts,
      }),
    );
  }

  for (const connectionId of request.firstUseConnectionIds ?? []) {
    if (request.targets.some((target) => target.connectionId === connectionId)) {
      escalations.push(note('first_use_connection', { connectionId }, connectionId));
    }
  }

  const approvedDomains = restrictions.approvedDomains ?? [];
  if (approvedDomains.length > 0) {
    for (const target of request.targets) {
      for (const host of target.linkHosts ?? []) {
        if (!domainApproved(host, approvedDomains)) {
          escalations.push(note('unapproved_link_domain', { host }, target.connectionId));
        }
      }
    }
  }

  const classification = request.classification ?? {};
  if (
    classification.commercial === true ||
    classification.political === true ||
    classification.regulated === true ||
    classification.sensitive === true
  ) {
    escalations.push(
      note('sensitive_content', {
        commercial: classification.commercial ?? false,
        political: classification.political ?? false,
        regulated: classification.regulated ?? false,
        sensitive: classification.sensitive ?? false,
      }),
    );
  }

  for (const target of request.targets) {
    if (target.privacyChanged === true) {
      escalations.push(note('privacy_change', {}, target.connectionId));
    }
  }

  if (request.changedAfterApproval === true) {
    escalations.push(note('changed_after_approval', {}));
  }

  const cost = request.estimatedCostMinor;
  if (cost !== undefined && cost > thresholds.costThresholdMinor) {
    escalations.push(
      note('cost_threshold_exceeded', {
        estimatedCostMinor: cost,
        thresholdMinor: thresholds.costThresholdMinor,
        currency: request.costCurrency ?? null,
      }),
    );
  }

  return escalations;
}

/**
 * The single escalation predicate. It answers two separate questions: may this
 * happen at all, and may it happen without a human saying yes first.
 */
export function evaluateAgentAction(request: AgentActionRequest): AgentDecision {
  const thresholds: AgentThresholds = { ...DEFAULT_AGENT_THRESHOLDS, ...request.thresholds };
  const restrictions = request.restrictions ?? {};
  const timeZone = restrictions.ianaTimeZone ?? 'UTC';

  const blockers: PolicyNote<RestrictionCode>[] = [];

  const minimum = ACTION_MINIMUM_LEVEL[request.kind];
  if (LEVEL_RANK[request.approvalLevel] < LEVEL_RANK[minimum]) {
    blockers.push(
      note('approval_level_too_low', {
        required: minimum,
        held: request.approvalLevel,
        kind: request.kind,
      }),
    );
  }

  // Restrictions only bind actions that reach outside Post Array. Reading and
  // drafting inside a narrowed identity is still allowed.
  const consequential =
    request.kind === 'schedule' || request.kind === 'reschedule' || request.kind === 'publish_now';
  if (consequential) {
    blockers.push(...checkRestrictions(request, restrictions, timeZone));
  } else if (restrictions.disabled === true) {
    blockers.push(note('service_account_disabled'));
  }

  const escalations = consequential ? checkEscalations(request, thresholds, restrictions) : [];

  const requiresHumanConfirmation = escalations.length > 0 && request.humanConfirmed !== true;

  return {
    allowed: blockers.length === 0,
    requiresHumanConfirmation: blockers.length === 0 && requiresHumanConfirmation,
    blockers,
    escalations,
    externalPublicationCount: countExternalPublications(request.targets),
    similarAccountCount: countSimilarAccounts(request.targets, thresholds.similarityThreshold),
  };
}
