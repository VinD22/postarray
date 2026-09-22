import { evaluateAgentAction, type AgentActionKind, type AgentTarget } from '@relay/authz';
import {
  ApprovalRequiredError,
  EntitlementRequiredError,
  MAX_SCHEDULE_HORIZON_DAYS,
  PolicyBlockedError,
  type CommitPreview,
  type CommitPreviewNote,
  type RelayError,
  type ScheduleSpec,
  type ValidationParamValue,
  type ValidationResult,
} from '@relay/contracts';

import type { ActorContext, PublishConfirmationEvidence, ServiceDeps } from '../types';

import { linkHosts, loadCapabilitiesFor } from './capabilities';
import { loadAggregate, type AggregateVariant, type ContentAggregate } from './content-store';
import { invalid } from './errors';
import { toProviderId } from './mappers';
import { confirmationMatchesContent, confirmationMatchesEscalations } from './publish-confirmation';
import type { ActorSnapshot, Db } from './runtime';
import { resolveTarget } from './stored-content';

/**
 * The shared preflight of every commit.
 *
 * `runPublishPath` and the commit preview both call this. It checks targets,
 * validation, the schedule horizon, the entitlement, the approval policy and
 * the autonomy ladder, and it writes nothing. The preview reports what it found;
 * the publish path throws the first blocker, in the order the checks run, which
 * is the order the path always refused in.
 */

export interface PublishPreflightInput {
  readonly contentItemId: string;
  readonly scheduleSpec: ScheduleSpec;
  readonly kind: Extract<AgentActionKind, 'schedule' | 'publish_now'>;
  /** Limit the commit to these connections. Undefined means every target. */
  readonly connectionIds?: readonly string[] | undefined;
  readonly validate: () => Promise<ValidationResult>;
}

type BlockerKind = 'invalid' | 'entitlement' | 'approval' | 'policy';

export interface PreflightBlocker extends CommitPreviewNote {
  readonly kind: BlockerKind;
  /** Sanitized details for the thrown error. Never shown to a person. */
  readonly details: Readonly<Record<string, unknown>>;
}

export interface PublishPreflight {
  readonly aggregate: ContentAggregate;
  /** The targets this commit covers, after the connection filter. */
  readonly variants: readonly AggregateVariant[];
  readonly validation: ValidationResult;
  readonly capabilities: Awaited<ReturnType<typeof loadCapabilitiesFor>>;
  readonly blockers: readonly PreflightBlocker[];
  readonly escalations: readonly CommitPreviewNote[];
  readonly externalPublicationCount: number;
  readonly similarAccountCount: number;
}

export async function runPublishPreflight(
  db: Db,
  deps: ServiceDeps,
  ctx: ActorContext,
  actor: ActorSnapshot,
  input: PublishPreflightInput,
): Promise<PublishPreflight> {
  const aggregate = await loadAggregate(db, input.contentItemId);
  const filter = input.connectionIds === undefined ? null : new Set(input.connectionIds);
  const variants =
    filter === null
      ? aggregate.variants
      : aggregate.variants.filter((variant) => filter.has(variant.connectionId));

  const blockers: PreflightBlocker[] = [];
  if (variants.length === 0) {
    blockers.push(
      blocker('invalid', 'no_targets_selected', 'errors.no_targets_selected', {
        contentItemId: aggregate.itemId,
      }),
    );
  }

  // 1. Deterministic preflight. Issues that belong to a target outside the
  //    filter do not block this commit.
  const raw = await input.validate();
  const excluded = new Set(
    aggregate.variants
      .filter((variant) => !variants.includes(variant))
      .flatMap((variant) => [variant.id, variant.connectionId]),
  );
  const issues = raw.issues.filter(
    (issue) => issue.targetId === undefined || !excluded.has(issue.targetId),
  );
  const validation: ValidationResult = {
    ...raw,
    issues,
    ok: !issues.some((issue) => issue.severity === 'error'),
  };
  const errorCodes = issues.filter((issue) => issue.severity === 'error').map((i) => i.code);
  if (errorCodes.length > 0) {
    blockers.push(
      blocker('invalid', 'content_invalid', 'errors.content_invalid', { issueCodes: errorCodes }),
    );
  }

  // 1b. The thirty day horizon, the same window media is retained for.
  const horizonMs = MAX_SCHEDULE_HORIZON_DAYS * 24 * 60 * 60 * 1000;
  if (new Date(input.scheduleSpec.instant).getTime() > deps.clock.now().getTime() + horizonMs) {
    blockers.push(
      blocker('invalid', 'schedule_too_far_ahead', 'validation.schedule_too_far_ahead.message', {
        limit: `${MAX_SCHEDULE_HORIZON_DAYS} days`,
        instant: input.scheduleSpec.instant,
      }),
    );
  }

  // 2. Entitlement.
  const entitlement = await deps.billing.checkEntitlement({
    workspaceId: ctx.workspaceId,
    key: 'publishing.enabled',
  });
  if (!entitlement.allowed) {
    blockers.push(
      blocker(
        'entitlement',
        'entitlement_required',
        entitlement.reasonKey ?? 'errors.entitlement_missing',
        { limit: entitlement.limit, used: entitlement.used },
      ),
    );
  }

  // 3. Workspace approval policy.
  const approval = approvalBlocker(aggregate);
  if (approval !== null) {
    blockers.push(approval);
  }

  // 4. The autonomy ladder, identical on every surface.
  const capabilities = await loadCapabilitiesFor(
    db,
    deps,
    variants.map((variant) => variant.connectionId),
  );
  if (variants.length === 0) {
    return {
      aggregate,
      variants,
      validation,
      capabilities,
      blockers,
      escalations: [],
      externalPublicationCount: 0,
      similarAccountCount: 0,
    };
  }

  const now = deps.clock.now();
  const agentTargets: AgentTarget[] = variants.map((variant) => {
    const resolved = resolveTarget(aggregate.master, variant.settings.overrides);
    const schedule = resolved.values.schedule ?? input.scheduleSpec;
    return {
      connectionId: variant.connectionId,
      provider: toProviderId(variant.provider),
      projectId: aggregate.projectId,
      locale: resolved.values.locale,
      body: resolved.values.body,
      scheduledInstant: schedule.instant,
      external: true,
      privacyChanged: variant.settings.privacyValue !== null,
      linkHosts: linkHosts(resolved.values.body),
    };
  });

  const publishedToday = await db.publicationReceipt.count({
    where: { publishedAt: { gte: startOfUtcDay(now) } },
  });
  const firstUse: string[] = [];
  for (const variant of variants) {
    const seen = await db.publicationReceipt.count({
      where: { connectionId: variant.connectionId },
    });
    if (seen === 0) {
      firstUse.push(variant.connectionId);
    }
  }

  const decision = evaluateAgentAction({
    kind: input.kind,
    approvalLevel: actor.policyActor.approvalLevel,
    restrictions: actor.restrictions,
    targets: agentTargets,
    firstUseConnectionIds: firstUse,
    publishedTodayCount: publishedToday,
    now,
    ...(raw.estimatedCostMinor === undefined ? {} : { estimatedCostMinor: raw.estimatedCostMinor }),
    ...(raw.currency === undefined ? {} : { costCurrency: raw.currency }),
    // Confirmation evidence is checked against the decision separately. It
    // must never collapse into a trusted boolean here.
    humanConfirmed: false,
  });

  if (!decision.allowed) {
    const codes = decision.blockers.map((entry) => entry.code);
    for (const entry of decision.blockers) {
      blockers.push({
        kind: 'policy',
        code: entry.code,
        messageKey: entry.messageKey,
        params: { ...entry.params },
        ...(entry.targetId === undefined ? {} : { connectionId: entry.targetId }),
        details: {
          blockers: codes,
          externalPublicationCount: decision.externalPublicationCount,
        },
      });
    }
  }

  const escalations: CommitPreviewNote[] = decision.escalations.map((entry) => {
    const variant =
      entry.targetId === undefined
        ? undefined
        : variants.find((candidate) => candidate.connectionId === entry.targetId);
    const params: Record<string, ValidationParamValue> = { ...entry.params };
    if (variant !== undefined) {
      params.accountLabel = variant.accountHandle ?? variant.accountDisplayName;
      params.provider = toProviderId(variant.provider);
    }
    return {
      code: entry.code,
      messageKey: entry.messageKey,
      params,
      ...(entry.targetId === undefined ? {} : { connectionId: entry.targetId }),
    };
  });

  return {
    aggregate,
    variants,
    validation,
    capabilities,
    blockers,
    escalations,
    externalPublicationCount: decision.externalPublicationCount,
    similarAccountCount: decision.similarAccountCount,
  };
}

/** The distinct escalation codes a confirmation must acknowledge, sorted. */
export function requiredEscalationCodes(preflight: PublishPreflight): string[] {
  return [...new Set(preflight.escalations.map((entry) => entry.code))].sort();
}

/** Throw the first blocker, as the typed error the publish path always threw. */
export function assertNoBlockers(preflight: PublishPreflight): void {
  const first = preflight.blockers[0];
  if (first !== undefined) {
    throw blockerError(first);
  }
}

/**
 * Refuse a commit whose confirmation does not match what the preview showed:
 * the target count, the version checksum and the exact set of escalations.
 */
export function assertConfirmed(
  preflight: PublishPreflight,
  ctx: ActorContext,
  confirmation: PublishConfirmationEvidence | false,
): void {
  if (
    confirmation !== false &&
    !confirmationMatchesContent(confirmation, {
      targetCount: preflight.variants.length,
      checksum: preflight.aggregate.checksum,
    })
  ) {
    throw invalid('errors.human_confirmation_required', {
      contentItemId: preflight.aggregate.itemId,
      reason: 'stale_confirmation',
      expectedTargetCount: preflight.variants.length,
      acknowledgedTargetCount: confirmation.acknowledgedTargetCount,
      expectedVersionChecksum: preflight.aggregate.checksum,
      acknowledgedVersionChecksum: confirmation.acknowledgedVersionChecksum,
    });
  }

  const required = requiredEscalationCodes(preflight);
  if (required.length === 0 || ctx.humanConfirmed === true) {
    return;
  }
  const matches = confirmation !== false && confirmationMatchesEscalations(confirmation, required);
  if (!matches) {
    throw new ApprovalRequiredError({
      messageKey: 'errors.human_confirmation_required',
      details: {
        escalations: required,
        acknowledgedEscalations: confirmation === false ? [] : confirmation.acknowledgedEscalations,
        externalPublicationCount: preflight.externalPublicationCount,
        similarAccountCount: preflight.similarAccountCount,
      },
    });
  }
}

/** The read model every surface renders its confirm step from. */
export function toCommitPreview(
  preflight: PublishPreflight,
  kind: CommitPreview['kind'],
): CommitPreview {
  const blockers = preflight.blockers.map(
    ({ kind: _kind, details: _details, ...note }): CommitPreviewNote => note,
  );
  return {
    contentItemId: preflight.aggregate.itemId,
    kind,
    targetCount: preflight.variants.length,
    versionChecksum: preflight.aggregate.checksum,
    externalPublicationCount: preflight.externalPublicationCount,
    blockers,
    escalations: [...preflight.escalations],
    validation: { issues: [...preflight.validation.issues] },
    canCommit: blockers.length === 0,
    requiresConfirmation: preflight.escalations.length > 0,
  };
}

function blocker(
  kind: BlockerKind,
  code: string,
  messageKey: string,
  details: Record<string, unknown>,
): PreflightBlocker {
  return { kind, code, messageKey, params: publicParams(details), details };
}

/** Only scalar details travel to a client as message parameters. */
function publicParams(details: Record<string, unknown>): Record<string, ValidationParamValue> {
  const params: Record<string, ValidationParamValue> = {};
  for (const [key, value] of Object.entries(details)) {
    if (
      value === null ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      params[key] = value;
    }
  }
  return params;
}

function approvalBlocker(aggregate: ContentAggregate): PreflightBlocker | null {
  if (aggregate.approvalPolicy === 'none') {
    return null;
  }
  if (aggregate.approvedVersionId === null) {
    return blocker('approval', 'approval_required', 'errors.approval_required', {
      contentItemId: aggregate.itemId,
    });
  }
  if (aggregate.approvedChecksum !== aggregate.checksum) {
    return blocker(
      'approval',
      'content_changed_after_approval',
      'errors.content_changed_after_approval',
      {
        contentItemId: aggregate.itemId,
        approvedChecksum: aggregate.approvedChecksum,
        currentChecksum: aggregate.checksum,
      },
    );
  }
  return null;
}

function blockerError(entry: PreflightBlocker): RelayError {
  const details = { ...entry.details };
  switch (entry.kind) {
    case 'invalid':
      return invalid(entry.messageKey, details);
    case 'entitlement':
      return new EntitlementRequiredError({ messageKey: entry.messageKey, details });
    case 'approval':
      return new ApprovalRequiredError({ messageKey: entry.messageKey, details });
    case 'policy':
      return new PolicyBlockedError({ messageKey: entry.messageKey, details });
  }
}

function startOfUtcDay(instant: Date): Date {
  const start = new Date(instant.getTime());
  start.setUTCHours(0, 0, 0, 0);
  return start;
}
