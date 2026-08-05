import { randomUUID } from 'node:crypto';

import { z } from 'zod';
import { RelayError } from '@relay/contracts';
import type { ProblemJson } from '@relay/contracts';
import type { Logger } from '@relay/observability';

import { authorizeCall } from './auth/authorize.js';
import type { VerifiedGrant } from './auth/verifier.js';
import type { ConfirmationStore } from './confirmations.js';
import type { ActorContextLike, AuditSink, RelayServicePort } from './ports.js';
import { requirementOf } from './tools/registry.js';
import type { ToolRegistry, ToolResult } from './tools/registry.js';

/**
 * The one path every tool call takes.
 *
 * Re-verify, re-authorize, parse, run, audit. In that order, every time, with
 * no shortcut for a connection that was authorized a moment ago: an MCP
 * connection is long lived and a grant can be revoked in the middle of it.
 */

export interface WorkspaceKillSwitch {
  isDisabled(workspaceId: string): boolean;
}

export interface DispatcherOptions {
  readonly registry: ToolRegistry;
  readonly services: RelayServicePort;
  readonly auditSink: AuditSink;
  readonly confirmations: ConfirmationStore;
  readonly logger: Logger;
  readonly clock: { now(): number };
  readonly killSwitch: WorkspaceKillSwitch;
  readonly sandbox: boolean;
}

export interface DispatchInput {
  readonly toolName: string;
  readonly rawArguments: unknown;
  readonly grant: VerifiedGrant;
  readonly correlationId?: string;
}

export type DispatchOutcome =
  | { readonly ok: true; readonly result: ToolResult; readonly correlationId: string }
  | { readonly ok: false; readonly problem: ProblemJson; readonly correlationId: string };

const idempotencyKeyEnvelope = z.object({
  idempotency_key: z.string().min(1).optional(),
});

/** The idempotency key, if the tool's own arguments carry one. Parsed, not cast. */
function idempotencyKeyOf(argumentsValue: unknown): string | undefined {
  const parsed = idempotencyKeyEnvelope.safeParse(argumentsValue);
  return parsed.success ? parsed.data.idempotency_key : undefined;
}

function buildActor(
  grant: VerifiedGrant,
  correlationId: string,
  idempotencyKey: string | undefined,
): ActorContextLike {
  return {
    // The actor is the granting user acting through a registered app, never the
    // agent host, which we cannot authenticate and do not name in an audit row.
    actorType: 'oauth_app',
    actorId: grant.subject,
    workspaceId: grant.workspaceId,
    scopes: grant.scopes,
    surface: 'mcp',
    correlationId,
    approvalLevel: grant.approvalLevel,
    ...(idempotencyKey === undefined ? {} : { idempotencyKey }),
    locale: grant.locale,
  };
}

export interface Dispatcher {
  call(input: DispatchInput): Promise<DispatchOutcome>;
}

export function createDispatcher(options: DispatcherOptions): Dispatcher {
  return {
    async call(input: DispatchInput): Promise<DispatchOutcome> {
      const correlationId = input.correlationId ?? randomUUID();
      const tool = options.registry.get(input.toolName);
      const idempotencyKey = idempotencyKeyOf(input.rawArguments);

      /**
       * Every call is audited with the app, the granting subject, the
       * workspace, the scope in use and the resulting receipt. Denials are
       * audited too: a refused publish attempt is exactly what an operator
       * needs to see.
       */
      const audit = async (
        outcome: 'allowed' | 'denied' | 'failed',
        metadata: Readonly<Record<string, unknown>>,
        receiptIds: readonly string[] = [],
      ): Promise<void> => {
        try {
          await options.auditSink.record({
            workspaceId: input.grant.workspaceId,
            actorType: 'oauth_app',
            actorId: input.grant.subject,
            action: `mcp.tool.${input.toolName}`,
            correlationId,
            outcome,
            targetType: receiptIds.length > 0 ? 'publication_receipt' : null,
            targetId: receiptIds[0] ?? null,
            metadata: {
              clientId: input.grant.clientId,
              grantId: input.grant.grantId,
              subject: input.grant.subject,
              scopesUsed: tool?.scopes ?? [],
              approvalLevel: input.grant.approvalLevel,
              risk: tool?.risk ?? 'unknown',
              sandbox: options.sandbox,
              idempotencyKeyPresent: idempotencyKey !== undefined,
              receiptIds,
              ...metadata,
            },
          });
        } catch (error) {
          // An audit failure must be loud, but it must not turn an allowed call
          // into a denied one after the side effect already happened.
          options.logger.error(
            { event: 'mcp.audit_failed', correlationId, tool: input.toolName, error },
            'mcp.audit_failed',
          );
        }
      };

      const fail = async (error: RelayError, stage: string): Promise<DispatchOutcome> => {
        await audit(error.status >= 500 ? 'failed' : 'denied', {
          stage,
          errorCode: error.code,
        });
        options.logger.warn(
          {
            event: 'mcp.tool_refused',
            correlationId,
            tool: input.toolName,
            stage,
            errorCode: error.code,
            workspaceId: input.grant.workspaceId,
          },
          'mcp.tool_refused',
        );
        return {
          ok: false,
          correlationId,
          problem: { ...error.toProblemJson(), correlationId },
        };
      };

      if (tool === undefined) {
        return fail(
          new RelayError('NOT_FOUND', {
            messageKey: 'error.not_found.message',
            details: { reason: 'UNKNOWN_TOOL', tool: input.toolName },
          }),
          'lookup',
        );
      }

      try {
        authorizeCall({
          grant: input.grant,
          requirement: requirementOf(tool),
          idempotencyKey,
          workspaceKilled: options.killSwitch.isDisabled(input.grant.workspaceId),
        });
      } catch (error) {
        return fail(RelayError.fromUnknown(error, correlationId), 'authorize');
      }

      const parsed = tool.inputSchema.safeParse(input.rawArguments ?? {});
      if (!parsed.success) {
        return fail(
          new RelayError('VALIDATION_FAILED', {
            messageKey: 'error.request_invalid.message',
            details: {
              tool: tool.name,
              fields: parsed.error.issues
                .slice(0, 10)
                .map((issue) => issue.path.map(String).join('.')),
            },
          }),
          'parse',
        );
      }

      try {
        const result = await tool.run(
          {
            grant: input.grant,
            actor: buildActor(input.grant, correlationId, idempotencyKey),
            services: options.services,
            confirmations: options.confirmations,
            clock: options.clock,
            sandbox: options.sandbox,
            idempotencyKey,
          },
          parsed.data,
        );

        await audit(
          'allowed',
          {
            pendingConfirmation: result.pendingConfirmation !== undefined,
          },
          result.receiptIds ?? [],
        );

        options.logger.info(
          {
            event: 'mcp.tool_called',
            correlationId,
            tool: tool.name,
            risk: tool.risk,
            workspaceId: input.grant.workspaceId,
            receiptCount: (result.receiptIds ?? []).length,
          },
          'mcp.tool_called',
        );

        return { ok: true, result, correlationId };
      } catch (error) {
        return fail(RelayError.fromUnknown(error, correlationId), 'run');
      }
    },
  };
}

/** An in-memory workspace kill switch, flipped by an operator process. */
export function createWorkspaceKillSwitch(initial: readonly string[] = []): WorkspaceKillSwitch & {
  disable(workspaceId: string): void;
  enable(workspaceId: string): void;
} {
  const disabled = new Set(initial);
  return {
    isDisabled: (workspaceId: string) => disabled.has(workspaceId),
    disable: (workspaceId: string) => {
      disabled.add(workspaceId);
    },
    enable: (workspaceId: string) => {
      disabled.delete(workspaceId);
    },
  };
}
