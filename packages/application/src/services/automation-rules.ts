import { requiredApprovalLevel } from '@relay/authz';
import {
  CONSEQUENTIAL_RULE_ACTION_KINDS,
  newIdFor,
  ruleActionKindSchema,
  ruleTriggerKindSchema,
  type OperationRef,
  type Paginated,
  type RuleActionKind,
} from '@relay/contracts';
import { z } from 'zod';

import type {
  ActorContext,
  AutomationRuleInput,
  AutomationRuleService,
  PageQuery,
  ServiceDeps,
} from '../types';
import type { AutomationRuleView, RuleEndCondition, RulePreview, RuleRunView } from '../views';

import { recordAudit } from '../internal/audit';
import { loadCapabilitiesFor } from '../internal/capabilities';
import { enqueueWorkflowOutbox } from '../internal/enqueue-outbox';
import { invalid, notFound } from '../internal/errors';
import { toJson } from '../internal/json';
import { toProviderId } from '../internal/mappers';
import { pageArgs, toPage } from '../internal/pagination';
import { ruleWorkflowId } from '../ports/scheduler';
import { authorized, guard, type Db } from '../internal/runtime';

/**
 * Automation Rules.
 *
 * "When [trigger], if [conditions], then [actions], after [delay], until [end]."
 *
 * A rule can never activate a disallowed platform action. The policy check runs
 * at save and again at every run, and there is no rule shape that produces an
 * automated like, follow, unsolicited reply or direct message: those action
 * kinds do not exist in the vocabulary, so the request is rejected by the
 * schema rather than by a runtime guard somebody could forget.
 */

const triggerSchema = z
  .object({ kind: ruleTriggerKindSchema, config: z.record(z.string(), z.unknown()).default({}) })
  .strict();

const conditionSchema = z
  .object({ kind: z.string().min(1), config: z.record(z.string(), z.unknown()).default({}) })
  .strict();

const actionSchema = z
  .object({ kind: ruleActionKindSchema, config: z.record(z.string(), z.unknown()).default({}) })
  .strict();

const RULE_SELECT = {
  id: true,
  workspaceId: true,
  brandId: true,
  name: true,
  state: true,
  trigger: true,
  conditions: true,
  actions: true,
  delaySeconds: true,
  endCondition: true,
  requiresApproval: true,
  preauthorizedConnectionIds: true,
  version: true,
  executionCount: true,
  maxExecutionsPerSource: true,
  maxExecutions: true,
  lastRunAt: true,
  pausedReason: true,
  measurementWindowSeconds: true,
  cooldownSeconds: true,
} as const;

interface RuleRow {
  id: string;
  workspaceId: string;
  brandId: string;
  name: string;
  state: string;
  trigger: unknown;
  conditions: unknown;
  actions: unknown;
  delaySeconds: number;
  endCondition: unknown;
  requiresApproval: boolean;
  preauthorizedConnectionIds: string[];
  version: number;
  executionCount: number;
  maxExecutionsPerSource: number | null;
  maxExecutions: number | null;
  lastRunAt: Date | null;
  pausedReason: string | null;
  measurementWindowSeconds: number | null;
  cooldownSeconds: number | null;
}

function parseTrigger(value: unknown): AutomationRuleView['trigger'] {
  const parsed = triggerSchema.safeParse(value);
  return parsed.success
    ? { kind: parsed.data.kind, config: parsed.data.config }
    : { kind: 'manual_command', config: {} };
}

function parseConditions(value: unknown): AutomationRuleView['conditions'] {
  const parsed = z.array(conditionSchema).safeParse(value);
  return parsed.success
    ? parsed.data.map((entry) => ({ kind: entry.kind, config: entry.config }))
    : [];
}

function parseActions(value: unknown): AutomationRuleView['actions'] {
  const parsed = z.array(actionSchema).safeParse(value);
  return parsed.success
    ? parsed.data.map((entry) => ({ kind: entry.kind, config: entry.config }))
    : [];
}

const endConditionSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('manual') }).strict(),
  z.object({ kind: z.literal('count'), runs: z.number().int().positive() }).strict(),
]);

function parseEndCondition(value: unknown): RuleEndCondition {
  const parsed = endConditionSchema.safeParse(value);
  return parsed.success ? parsed.data : { kind: 'manual' };
}

function hasReachedEnd(endCondition: unknown, executionCount: number): boolean {
  const end = parseEndCondition(endCondition);
  return end.kind === 'count' && executionCount >= end.runs;
}

function toView(row: RuleRow): AutomationRuleView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    brandId: row.brandId,
    name: row.name,
    state: row.state as AutomationRuleView['state'],
    trigger: parseTrigger(row.trigger),
    conditions: parseConditions(row.conditions),
    actions: parseActions(row.actions),
    delaySeconds: row.delaySeconds,
    endCondition: parseEndCondition(row.endCondition),
    requiresApproval: row.requiresApproval,
    preauthorizedConnectionIds: [...row.preauthorizedConnectionIds],
    version: row.version,
    executionCount: row.executionCount,
    maxExecutionsPerSource: row.maxExecutionsPerSource,
    maxExecutions: row.maxExecutions,
    lastRunAt: row.lastRunAt?.toISOString() ?? null,
    pausedReasonKey: row.pausedReason,
  };
}

const RUN_SELECT = {
  id: true,
  automationRuleId: true,
  ruleVersion: true,
  state: true,
  isTest: true,
  sourceKind: true,
  sourceId: true,
  performedActions: true,
  blockedReason: true,
  errorCode: true,
  startedAt: true,
  endedAt: true,
} as const;

interface RunRow {
  id: string;
  automationRuleId: string;
  ruleVersion: number;
  state: string;
  isTest: boolean;
  sourceKind: string;
  sourceId: string | null;
  performedActions: unknown;
  blockedReason: string | null;
  errorCode: string | null;
  startedAt: Date;
  endedAt: Date | null;
}

const performedActionSchema = z.object({ kind: z.string(), outcome: z.string() }).strict();

function toRunView(row: RunRow): RuleRunView {
  const performed = z.array(performedActionSchema).safeParse(row.performedActions);
  return {
    id: row.id,
    ruleId: row.automationRuleId,
    ruleVersion: row.ruleVersion,
    state: row.state as RuleRunView['state'],
    isTest: row.isTest,
    sourceKind: row.sourceKind,
    sourceId: row.sourceId,
    performedActions: performed.success ? performed.data : [],
    blockedReasonKey: row.blockedReason,
    errorCode: row.errorCode,
    startedAt: row.startedAt.toISOString(),
    endedAt: row.endedAt?.toISOString() ?? null,
  };
}

function consequentialActions(actions: readonly { kind: RuleActionKind }[]): RuleActionKind[] {
  return actions
    .map((action) => action.kind)
    .filter((kind) => CONSEQUENTIAL_RULE_ACTION_KINDS.includes(kind));
}

/**
 * An engagement-threshold rule must carry a measurement window, a cooldown and
 * an execution cap. Without all three it can loop on a metric that keeps
 * crossing the line, which is exactly the manipulation pattern we refuse.
 */
function assertThresholdGuards(input: AutomationRuleInput): void {
  if (input.trigger.kind !== 'analytics_threshold') {
    return;
  }
  if (
    input.measurementWindowSeconds === undefined ||
    input.measurementWindowSeconds === null ||
    input.cooldownSeconds === undefined ||
    input.cooldownSeconds === null ||
    input.maxExecutionsPerSource === undefined ||
    input.maxExecutionsPerSource === null
  ) {
    throw invalid('errors.rule_threshold_guards_required', {});
  }
}

/** Every consequential target must be explicitly preauthorized on the rule. */
function assertPreauthorized(input: AutomationRuleInput): void {
  const consequential = consequentialActions(input.actions);
  if (consequential.length === 0) {
    return;
  }
  if ((input.preauthorizedConnectionIds ?? []).length === 0) {
    throw invalid('errors.rule_requires_preauthorized_connections', {
      actions: consequential,
    });
  }
}

async function requireRule(db: Db, ruleId: string): Promise<RuleRow> {
  const row = await db.automationRule.findFirst({ where: { id: ruleId }, select: RULE_SELECT });
  if (row === null) {
    throw notFound('automation_rule', ruleId);
  }
  return row;
}

export function createAutomationRuleService(deps: ServiceDeps): AutomationRuleService {
  return {
    async list(ctx: ActorContext, query: PageQuery = {}): Promise<Paginated<AutomationRuleView>> {
      return authorized(deps, ctx, 'rule.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.automationRule.findMany({
          where: { state: { not: 'archived' } },
          orderBy: { id: 'asc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: RULE_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toView);
      });
    },

    async get(ctx: ActorContext, ruleId: string): Promise<AutomationRuleView> {
      return authorized(deps, ctx, 'rule.read', undefined, async (db) =>
        toView(await requireRule(db, ruleId)),
      );
    },

    async create(ctx: ActorContext, input: AutomationRuleInput): Promise<AutomationRuleView> {
      return authorized(deps, ctx, 'rule.write', { brandId: input.brandId }, async (db, actor) => {
        if (actor.userId === null) {
          throw invalid('errors.rule_requires_user', {});
        }
        assertThresholdGuards(input);
        assertPreauthorized(input);
        for (const connectionId of input.preauthorizedConnectionIds ?? []) {
          guard(actor, 'post.schedule', { connectionId, brandId: input.brandId });
        }

        const created = await db.automationRule.create({
          data: {
            workspaceId: actor.workspace.id,
            brandId: input.brandId,
            name: input.name,
            state: 'draft',
            trigger: toJson({ kind: input.trigger.kind, config: input.trigger.config ?? {} }),
            conditions: toJson(
              (input.conditions ?? []).map((condition) => ({
                kind: condition.kind,
                config: condition.config ?? {},
              })),
            ),
            actions: toJson(
              input.actions.map((action) => ({
                kind: action.kind,
                config: action.config ?? {},
              })),
            ),
            delaySeconds: input.delaySeconds ?? 0,
            endCondition: toJson(input.endCondition ?? { kind: 'manual' }),
            requiresApproval: input.requiresApproval ?? true,
            preauthorizedConnectionIds: [...(input.preauthorizedConnectionIds ?? [])],
            maxExecutionsPerSource: input.maxExecutionsPerSource ?? null,
            maxExecutions: input.endCondition?.kind === 'count' ? input.endCondition.runs : null,
            cooldownSeconds: input.cooldownSeconds ?? null,
            measurementWindowSeconds: input.measurementWindowSeconds ?? null,
            createdByUserId: actor.userId,
          },
          select: RULE_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'automation_rule.paused',
          targetType: 'automation_rule',
          targetId: created.id,
          after: { state: 'draft', actions: input.actions.map((action) => action.kind) },
        });

        return toView(created);
      });
    },

    async update(
      ctx: ActorContext,
      ruleId: string,
      input: Partial<AutomationRuleInput>,
    ): Promise<AutomationRuleView> {
      return authorized(deps, ctx, 'rule.write', undefined, async (db, actor) => {
        const before = await requireRule(db, ruleId);
        const merged: AutomationRuleInput = {
          brandId: input.brandId ?? before.brandId,
          name: input.name ?? before.name,
          trigger: input.trigger ?? parseTrigger(before.trigger),
          conditions: input.conditions ?? parseConditions(before.conditions),
          actions: input.actions ?? parseActions(before.actions),
          ...(input.delaySeconds === undefined ? {} : { delaySeconds: input.delaySeconds }),
          endCondition: input.endCondition ?? parseEndCondition(before.endCondition),
          preauthorizedConnectionIds:
            input.preauthorizedConnectionIds ?? before.preauthorizedConnectionIds,
          maxExecutionsPerSource:
            input.maxExecutionsPerSource === undefined
              ? before.maxExecutionsPerSource
              : input.maxExecutionsPerSource,
          cooldownSeconds:
            input.cooldownSeconds === undefined ? before.cooldownSeconds : input.cooldownSeconds,
          measurementWindowSeconds:
            input.measurementWindowSeconds === undefined
              ? before.measurementWindowSeconds
              : input.measurementWindowSeconds,
        };
        assertThresholdGuards(merged);
        assertPreauthorized(merged);

        // A change to a live rule bumps its version, so a run in flight keeps
        // the definition it started with.
        const after = await db.automationRule.update({
          where: { id: ruleId },
          data: {
            name: merged.name,
            trigger: toJson({ kind: merged.trigger.kind, config: merged.trigger.config ?? {} }),
            conditions: toJson(
              (merged.conditions ?? []).map((condition) => ({
                kind: condition.kind,
                config: condition.config ?? {},
              })),
            ),
            actions: toJson(
              merged.actions.map((action) => ({
                kind: action.kind,
                config: action.config ?? {},
              })),
            ),
            ...(input.delaySeconds === undefined ? {} : { delaySeconds: input.delaySeconds }),
            endCondition: toJson(merged.endCondition ?? { kind: 'manual' }),
            ...(input.requiresApproval === undefined
              ? {}
              : { requiresApproval: input.requiresApproval }),
            preauthorizedConnectionIds: [...(merged.preauthorizedConnectionIds ?? [])],
            maxExecutionsPerSource: merged.maxExecutionsPerSource ?? null,
            maxExecutions: merged.endCondition?.kind === 'count' ? merged.endCondition.runs : null,
            cooldownSeconds: merged.cooldownSeconds ?? null,
            measurementWindowSeconds: merged.measurementWindowSeconds ?? null,
            version: before.version + 1,
          },
          select: RULE_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'automation_rule.paused',
          targetType: 'automation_rule',
          targetId: ruleId,
          before: toView(before),
          after: toView(after),
          metadata: { versionBumped: true },
        });

        return toView(after);
      });
    },

    async enable(ctx: ActorContext, ruleId: string): Promise<AutomationRuleView> {
      return authorized(deps, ctx, 'rule.run', undefined, async (db, actor) => {
        const before = await requireRule(db, ruleId);
        const preview = await buildPreview(db, deps, before);
        if (preview.blockedReasonKeys.length > 0) {
          throw invalid('errors.rule_blocked_by_policy', {
            reasons: [...preview.blockedReasonKeys],
          });
        }
        const after = await db.automationRule.update({
          where: { id: ruleId },
          data: { state: 'active', pausedReason: null },
          select: RULE_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'automation_rule.activated',
          targetType: 'automation_rule',
          targetId: ruleId,
          before: { state: before.state },
          after: { state: 'active' },
          metadata: { maxExternalActionsPerRun: preview.maxExternalActionsPerRun },
        });
        return toView(after);
      });
    },

    async disable(
      ctx: ActorContext,
      ruleId: string,
      reasonKey?: string,
    ): Promise<AutomationRuleView> {
      return authorized(deps, ctx, 'rule.write', undefined, async (db, actor) => {
        const before = await requireRule(db, ruleId);
        const after = await db.automationRule.update({
          where: { id: ruleId },
          data: { state: 'paused', pausedReason: reasonKey ?? 'rule.paused_by_user' },
          select: RULE_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'automation_rule.paused',
          targetType: 'automation_rule',
          targetId: ruleId,
          before: { state: before.state },
          after: { state: 'paused' },
        });
        return toView(after);
      });
    },

    async delete(ctx: ActorContext, ruleId: string): Promise<void> {
      await authorized(deps, ctx, 'rule.write', undefined, async (db, actor) => {
        await db.automationRule.update({
          where: { id: ruleId },
          data: { state: 'archived' },
        });
        await recordAudit(db, actor, {
          action: 'automation_rule.paused',
          targetType: 'automation_rule',
          targetId: ruleId,
          after: { state: 'archived' },
        });
      });
    },

    /** Everything the activation screen must show before a rule goes live. */
    async preview(ctx: ActorContext, ruleId: string): Promise<RulePreview> {
      return authorized(deps, ctx, 'rule.read', undefined, async (db) =>
        buildPreview(db, deps, await requireRule(db, ruleId)),
      );
    },

    async testRun(
      ctx: ActorContext,
      input: { ruleId: string; sampleEvent: Record<string, unknown> },
    ): Promise<RuleRunView> {
      return authorized(deps, ctx, 'rule.read', undefined, async (db, actor) => {
        const rule = await requireRule(db, input.ruleId);
        // A test run never produces an external action. It records what would
        // have happened so the sentence builder can show an example.
        const created = await db.automationRuleRun.create({
          data: {
            workspaceId: actor.workspace.id,
            automationRuleId: rule.id,
            ruleVersion: rule.version,
            state: 'succeeded',
            isTest: true,
            sourceKind: 'test',
            sourceId: `test:${deps.clock.now().toISOString()}`,
            triggerPayload: toJson(input.sampleEvent),
            evaluatedConditions: toJson(
              parseConditions(rule.conditions).map((condition) => ({
                kind: condition.kind,
                matched: true,
              })),
            ),
            performedActions: toJson(
              parseActions(rule.actions).map((action) => ({
                kind: action.kind,
                outcome: 'simulated',
              })),
            ),
            correlationId: ctx.correlationId,
          },
          select: RUN_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'automation_rule.activated',
          targetType: 'automation_rule_run',
          targetId: created.id,
          after: { isTest: true },
        });
        return toRunView(created);
      });
    },

    async listRuns(
      ctx: ActorContext,
      input: PageQuery & { ruleId: string },
    ): Promise<Paginated<RuleRunView>> {
      return authorized(deps, ctx, 'rule.read', undefined, async (db) => {
        const args = pageArgs(input);
        const rows = await db.automationRuleRun.findMany({
          where: { automationRuleId: input.ruleId },
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: RUN_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toRunView);
      });
    },

    async triggerFromInbound(
      ctx: ActorContext,
      input: { ruleName: string; event: Record<string, unknown> },
    ): Promise<OperationRef> {
      return authorized(deps, ctx, 'rule.run', undefined, async (db, actor) => {
        const rule = await db.automationRule.findFirst({
          where: { name: input.ruleName, state: 'active' },
          select: { id: true, endCondition: true, executionCount: true },
        });
        if (rule === null) {
          throw notFound('automation_rule', input.ruleName);
        }
        if (hasReachedEnd(rule.endCondition, rule.executionCount)) {
          await db.automationRule.update({
            where: { id: rule.id },
            data: { state: 'paused', pausedReason: 'rule.paused.execution_limit_reached' },
          });
          throw invalid('errors.rule_execution_limit_reached', {});
        }
        const ruleRunId = newIdFor('ruleRun');
        const workflowId = ruleWorkflowId(ctx.workspaceId, rule.id, ruleRunId);
        await enqueueWorkflowOutbox(db, {
          kind: 'start_rule_run',
          dedupeKey: `start-rule-run:${ruleRunId}`,
          payload: {
            ctx: {
              workspaceId: ctx.workspaceId,
              correlationId: ctx.correlationId,
              actorId: ctx.actorId,
              actorType: ctx.actorType,
              surface: ctx.surface,
              approvalLevel: ctx.approvalLevel,
              locale: ctx.locale,
            },
            ruleId: rule.id,
            workspaceId: ctx.workspaceId,
            runId: ruleRunId,
            sourceKey: ctx.idempotencyKey ?? `inbound:${ctx.correlationId}`,
            event: input.event,
          },
        });
        const operationId = newIdFor('operation');
        await recordAudit(db, actor, {
          action: 'automation_rule.activated',
          targetType: 'automation_rule',
          targetId: rule.id,
          after: { workflowId, source: 'inbound' },
        });
        return {
          operationId,
          status: 'queued',
          resourceType: 'automation_rule',
          resourceId: rule.id,
          createdAt: deps.clock.now().toISOString(),
          completedAt: null,
          error: null,
        };
      });
    },
  };
}

async function buildPreview(db: Db, deps: ServiceDeps, rule: RuleRow): Promise<RulePreview> {
  const actions = parseActions(rule.actions);
  const consequential = consequentialActions(actions);
  const connectionIds = rule.preauthorizedConnectionIds;

  const connections = await db.socialConnection.findMany({
    where: { id: { in: connectionIds } },
    select: { id: true, provider: true, displayName: true, status: true },
  });

  const capabilities = await loadCapabilitiesFor(db, deps, connectionIds);

  const blocked: string[] = [];
  if (hasReachedEnd(rule.endCondition, rule.executionCount)) {
    blocked.push('rule.blocked.execution_limit_reached');
  }
  if (consequential.length > 0 && connectionIds.length === 0) {
    blocked.push('rule.blocked.no_preauthorized_connections');
  }
  for (const connection of connections) {
    if (connection.status !== 'active') {
      blocked.push('rule.blocked.connection_not_active');
      break;
    }
  }

  const providerRestrictionKeys: string[] = [];
  let estimatedCostMinor: number | null = null;
  let costCurrency: string | null = null;

  for (const connectionId of connectionIds) {
    const snapshot = capabilities.get(connectionId)?.snapshot;
    if (snapshot === undefined || snapshot === null) {
      providerRestrictionKeys.push('rule.restriction.capability_unavailable');
      continue;
    }
    if (snapshot.cost !== null) {
      // The pessimistic estimate: a create containing a URL is the expensive
      // case on the networks that meter per operation.
      estimatedCostMinor = (estimatedCostMinor ?? 0) + snapshot.cost.perUrlCreateMinor;
      costCurrency = snapshot.cost.currency;
    }
    if (
      snapshot.threads.support !== 'supported' &&
      actions.some((a) => a.kind === 'continue_sequence')
    ) {
      providerRestrictionKeys.push('rule.restriction.threads_unsupported');
    }
    if (
      snapshot.firstComment.support !== 'supported' &&
      actions.some((a) => a.kind === 'add_first_comment')
    ) {
      providerRestrictionKeys.push('rule.restriction.first_comment_unsupported');
    }
  }

  const maxExternalActionsPerRun = consequential.length * Math.max(1, connectionIds.length);

  const requiredLevel = consequential.some((kind) => kind === 'publish_post')
    ? requiredApprovalLevel('post.publish_now')
    : consequential.length > 0
      ? requiredApprovalLevel('post.schedule')
      : requiredApprovalLevel('content.write');

  return {
    ruleId: rule.id,
    connections: connections.map((connection) => ({
      connectionId: connection.id,
      provider: toProviderId(connection.provider),
      displayName: connection.displayName,
    })),
    maxExternalActionsPerRun,
    requiresApproval: rule.requiresApproval,
    requiredApprovalLevel: requiredLevel,
    providerRestrictionKeys: [...new Set(providerRestrictionKeys)],
    estimatedCostMinor,
    costCurrency,
    cadenceImpactPerDay: maxExternalActionsPerRun,
    duplicateRiskKey:
      connectionIds.length > 1 && consequential.length > 0
        ? 'rule.duplicate_risk.cross_account'
        : null,
    blockedReasonKeys: [...new Set(blocked)],
  };
}
