import { RelayError, missingScopes } from '@relay/contracts';
import type { ApprovalLevel, Scope } from '@relay/contracts';

import type { VerifiedGrant } from './verifier.js';

/**
 * Per-call authorization.
 *
 * This runs on every tool call, against the granting user's scopes, after the
 * token has been re-verified. It never consults anything the agent host told
 * us. An agent host can display whatever dialog it likes; what it displayed is
 * not an authorization fact we can observe, so it is not one we act on.
 */

export const APPROVAL_LEVEL_ORDER: readonly ApprovalLevel[] = [
  'level_0_read',
  'level_1_draft',
  'level_2_scheduled',
  'level_3_confirm',
];

export function approvalRank(level: ApprovalLevel): number {
  const index = APPROVAL_LEVEL_ORDER.indexOf(level);
  return index < 0 ? 0 : index;
}

/** True when a grant at `granted` may perform work that needs `required`. */
export function approvalLevelSatisfies(granted: ApprovalLevel, required: ApprovalLevel): boolean {
  return approvalRank(granted) >= approvalRank(required);
}

export interface AuthorizationRequirement {
  readonly toolName: string;
  readonly scopes: readonly Scope[];
  readonly approvalLevel: ApprovalLevel;
  readonly requiresIdempotencyKey: boolean;
  readonly requiresHumanConfirmation: boolean;
}

export interface AuthorizationInput {
  readonly grant: VerifiedGrant;
  readonly requirement: AuthorizationRequirement;
  readonly idempotencyKey: string | undefined;
  /** Workspace-wide stop, checked separately from the per-grant one. */
  readonly workspaceKilled: boolean;
}

/**
 * Authorize or throw. Every refusal is a `RelayError` with a stable code, so
 * the tool result the agent sees carries the same taxonomy as the REST API.
 */
export function authorizeCall(input: AuthorizationInput): void {
  if (input.workspaceKilled) {
    throw new RelayError('POLICY_BLOCKED', {
      messageKey: 'error.forbidden.message',
      details: { reason: 'WORKSPACE_DISABLED', tool: input.requirement.toolName },
    });
  }
  if (input.grant.killed) {
    throw new RelayError('FORBIDDEN', {
      messageKey: 'error.forbidden.message',
      details: { reason: 'GRANT_DISABLED', tool: input.requirement.toolName },
    });
  }

  const missing = missingScopes(input.grant.scopes, input.requirement.scopes);
  if (missing.length > 0) {
    throw new RelayError('SCOPE_INSUFFICIENT', {
      messageKey: 'error.insufficient_scope.message',
      details: {
        tool: input.requirement.toolName,
        missingScopes: missing,
        grantedScopes: input.grant.scopes,
      },
    });
  }

  if (!approvalLevelSatisfies(input.grant.approvalLevel, input.requirement.approvalLevel)) {
    throw new RelayError('APPROVAL_REQUIRED', {
      messageKey: 'error.approval_required.message',
      details: {
        tool: input.requirement.toolName,
        grantedApprovalLevel: input.grant.approvalLevel,
        requiredApprovalLevel: input.requirement.approvalLevel,
      },
    });
  }

  if (input.requirement.requiresIdempotencyKey && (input.idempotencyKey ?? '').length === 0) {
    // A consequential tool without a key is a request to publish twice on the
    // first retry. It is rejected, not defaulted.
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { tool: input.requirement.toolName, reason: 'IDEMPOTENCY_KEY_REQUIRED' },
    });
  }
}
