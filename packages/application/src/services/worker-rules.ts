import {
  CONSEQUENTIAL_RULE_ACTION_KINDS,
  ERROR_CODES,
  type RuleActionKind,
} from '@relay/contracts';

import type {
  ActorContext,
  ContentService,
  ServiceDeps,
  WorkerActivityContext,
  WorkerRuleActionResult,
  WorkerRuleService,
} from '../types';

import { notFound } from '../internal/errors';
import { toJson } from '../internal/json';
import { runInWorkspace, type Db } from '../internal/runtime';
import { evaluateRuleConditions, parseActions, parseConditions } from './automation-rules';

/**
 * Automation rules, worker half.
 *
 * The interlock is `reserveRuleExecution`. It runs before any action does, and
 * it claims the slot by inserting the run row itself: `automation_rule_runs` is
 * unique on `(rule, source kind, source id)`, so two triggers racing for the
 * same source post produce one run and one loser, decided by the database
 * rather than by a read-then-write this code could lose.
 *
 * `executeRuleAction` dispatches only through the shared content, scheduling
 * and publishing services. There is no path from a rule to a provider that does
 * not pass the same approval policy, validation and tenancy checks a person
 * goes through, and an action kind we have not built is reported as
 * `not_implemented` rather than quietly reported as done.
 */

/** The dedupe anchor. One source post triggers one run of one rule, ever. */
const SOURCE_KIND = 'worker';

function context(ctx: WorkerActivityContext): ActorContext {
  return { ...ctx, scopes: [] };
}

/** Prisma's unique-violation code. The reservation loser lands here. */
function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && Reflect.get(error, 'code') === 'P2002';
}

const RULE_SELECT = {
  id: true,
  state: true,
  version: true,
  actions: true,
  conditions: true,
  delaySeconds: true,
  cooldownSeconds: true,
  maxExecutions: true,
  maxExecutionsPerSource: true,
  executionCount: true,
  runOncePerSource: true,
  requiresApproval: true,
  projectId: true,
  lastRunAt: true,
} as const;

async function requireRule(db: Db, ctx: WorkerActivityContext, ruleId: string) {
  const row = await db.automationRule.findFirst({
    where: { id: ruleId, workspaceId: ctx.workspaceId },
    select: RULE_SELECT,
  });
  if (row === null) {
    throw notFound('automation_rule', ruleId, ctx.correlationId);
  }
  return row;
}

/**
 * Actions the worker performs itself. Everything absent from this set is either
 * consequential (and therefore approval gated) or not built yet, and both of
 * those are reported rather than silently treated as success.
 */
const PERFORMED_ACTION_KINDS = new Set<RuleActionKind>([
  'create_draft',
  'request_approval',
  'notify_workspace',
  'notify_email',
  'notify_webhook',
  'wait_delay',
  'pause_rule',
]);

function notImplemented(): WorkerRuleActionResult {
  return {
    status: 'skipped',
    resourceId: null,
    errorCode: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
    messageKey: 'rule.action_not_implemented',
  };
}

export function createWorkerRuleService(
  deps: ServiceDeps,
  content: ContentService,
): WorkerRuleService {
  return {
    async loadRuleDefinition(input) {
      return runInWorkspace(deps, context(input.ctx), async (db) => {
        const rule = await requireRule(db, input.ctx, input.ruleId);
        const actions = parseActions(rule.actions);
        return {
          ruleId: rule.id,
          enabled: rule.state === 'active',
          cooldownSeconds: rule.cooldownSeconds ?? 0,
          // The schema has no expiry column; a rule ends on its execution
          // budget. Saying "null" is the honest answer, not a fabricated date.
          expiresAt: null,
          maxExecutions: rule.maxExecutions,
          maxExecutionsPerSource: rule.maxExecutionsPerSource,
          executionCount: rule.executionCount,
          oncePerSourcePost: rule.runOncePerSource,
          requiresApproval: rule.requiresApproval,
          actions: actions.map((action, index) => ({
            actionId: `${rule.id}:${String(index)}`,
            kind: action.kind,
            order: index + 1,
            // Only the rule-level delay exists today, and it is applied once,
            // before the first action.
            delaySeconds: index === 0 ? rule.delaySeconds : 0,
            consequential: CONSEQUENTIAL_RULE_ACTION_KINDS.includes(action.kind),
          })),
        };
      });
    },

    async evaluateRuleConditions(input) {
      return runInWorkspace(deps, context(input.ctx), async (db) => {
        const rule = await requireRule(db, input.ctx, input.ruleId);
        return evaluateRuleConditions(parseConditions(rule.conditions), input.event);
      });
    },

    async reserveRuleExecution(input) {
      return runInWorkspace(deps, context(input.ctx), async (db) => {
        const rule = await requireRule(db, input.ctx, input.ruleId);
        const now = new Date(input.now);

        if (rule.state !== 'active') {
          return { verdict: 'disabled', nextEligibleAt: null };
        }
        if (rule.maxExecutions !== null && rule.executionCount >= rule.maxExecutions) {
          return { verdict: 'max_executions', nextEligibleAt: null };
        }
        if (rule.cooldownSeconds !== null && rule.lastRunAt !== null) {
          const eligibleAt = new Date(rule.lastRunAt.getTime() + rule.cooldownSeconds * 1000);
          if (eligibleAt.getTime() > now.getTime()) {
            return { verdict: 'cooldown', nextEligibleAt: eligibleAt.toISOString() };
          }
        }

        // The claim itself. Inserting the run row is the reservation, so the
        // unique index decides the race instead of this process.
        try {
          await db.automationRuleRun.create({
            data: {
              id: input.runId,
              workspaceId: input.ctx.workspaceId,
              automationRuleId: rule.id,
              ruleVersion: rule.version,
              state: 'running',
              isTest: false,
              sourceKind: SOURCE_KIND,
              sourceId: input.sourceKey,
              triggerPayload: toJson({}),
              correlationId: input.ctx.correlationId,
              startedAt: now,
            },
          });
        } catch (error: unknown) {
          if (isUniqueViolation(error)) {
            return { verdict: 'duplicate_source', nextEligibleAt: null };
          }
          throw error;
        }

        await db.automationRule.updateMany({
          where: { id: rule.id, workspaceId: input.ctx.workspaceId },
          data: { executionCount: rule.executionCount + 1, lastRunAt: now },
        });
        return { verdict: 'allowed', nextEligibleAt: null };
      });
    },

    async executeRuleAction(input) {
      // A dry run never touches anything. It is the preview path, and a preview
      // that wrote a row would not be a preview.
      if (input.dryRun) {
        return {
          status: 'skipped',
          resourceId: null,
          errorCode: null,
          messageKey: 'rule.dry_run',
        };
      }

      const rule = await runInWorkspace(deps, context(input.ctx), (db) =>
        requireRule(db, input.ctx, input.ruleId),
      );

      if (CONSEQUENTIAL_RULE_ACTION_KINDS.includes(input.kind)) {
        // Anything that creates an external post stops here and waits for a
        // person. A rule may propose a publication; it may never be the thing
        // that decided one happened.
        return {
          status: 'approval_required',
          resourceId: null,
          errorCode: ERROR_CODES.APPROVAL_REQUIRED,
          messageKey: 'rule.approval_required',
        };
      }
      if (!PERFORMED_ACTION_KINDS.has(input.kind)) {
        return notImplemented();
      }

      switch (input.kind) {
        case 'create_draft': {
          const body = typeof input.event['body'] === 'string' ? input.event['body'] : '';
          if (body === '') {
            return {
              status: 'skipped',
              resourceId: null,
              errorCode: ERROR_CODES.CONTENT_INVALID,
              messageKey: 'rule.no_draft_body',
            };
          }
          // Through the content service, with no targets. A rule never names
          // the account a draft would publish to.
          const draft = await content.createDraft(
            {
              ...context(input.ctx),
              idempotencyKey: `rule:${input.runId}:${input.actionId}`,
            },
            {
              projectId: rule.projectId,
              title: typeof input.event['title'] === 'string' ? input.event['title'] : null,
              body,
            },
          );
          return {
            status: 'succeeded',
            resourceId: draft.id,
            errorCode: null,
            messageKey: null,
          };
        }
        case 'request_approval':
          return {
            status: 'approval_required',
            resourceId: null,
            errorCode: ERROR_CODES.APPROVAL_REQUIRED,
            messageKey: 'rule.approval_required',
          };
        case 'wait_delay':
          // The workflow already slept; nothing is left to do here.
          return { status: 'succeeded', resourceId: null, errorCode: null, messageKey: null };
        case 'pause_rule': {
          await runInWorkspace(deps, context(input.ctx), (db) =>
            db.automationRule
              .updateMany({
                where: { id: rule.id, workspaceId: input.ctx.workspaceId },
                data: { state: 'paused', pausedReason: 'rule.paused_by_rule_action' },
              })
              .then(() => undefined),
          );
          return { status: 'succeeded', resourceId: rule.id, errorCode: null, messageKey: null };
        }
        default: {
          // The three notification kinds. Delivery is the outbox's job, so the
          // rule writes the intent and stops.
          const dedupeKey = `rule-notify:${input.runId}:${input.actionId}`;
          await runInWorkspace(deps, context(input.ctx), (db) =>
            db.outboxEvent
              .upsert({
                where: {
                  workspaceId_dedupeKey: { workspaceId: input.ctx.workspaceId, dedupeKey },
                },
                create: {
                  workspaceId: input.ctx.workspaceId,
                  kind: 'notification.requested',
                  dedupeKey,
                  payload: toJson({
                    messageKey: 'rule.completed',
                    resourceId: input.ruleId,
                    channel: input.kind,
                    params: { ruleId: input.ruleId, runId: input.runId },
                  }),
                },
                update: {},
              })
              .then(() => undefined),
          );
          return {
            status: 'succeeded',
            resourceId: input.runId,
            errorCode: null,
            messageKey: null,
          };
        }
      }
    },

    async recordRuleRun(input) {
      await runInWorkspace(deps, context(input.ctx), async (db) => {
        await db.automationRuleRun.updateMany({
          where: { id: input.runId, workspaceId: input.ctx.workspaceId },
          data: {
            state: input.status,
            endedAt: new Date(input.finishedAt),
            startedAt: new Date(input.startedAt),
            performedActions: toJson(
              input.actionResults.map((result) => ({
                kind: result.actionId,
                outcome: result.status,
              })),
            ),
            blockedReason: input.reasonKey,
          },
        });
      });
    },
  };
}
