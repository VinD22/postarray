import { ACTION_MINIMUM_LEVEL, type AgentActionKind } from '@relay/authz';
import type { ApprovalLevel, Scope } from '@relay/contracts';

import type { ServiceAccountDryRunView } from './service-account-views';

/**
 * The rehearsal behind the settings playground.
 *
 * The point of a dry run is not to see a successful response, it is to see the
 * refusal before an agent hits it in production. So this runs the same two
 * gates the real call runs — does the identity hold the scope, and is the
 * action within its approval level — against the same declarations, and stops
 * there. It performs no work, touches no provider and creates nothing, which
 * is why it can be exposed to anyone who may read the account.
 *
 * The tool names are the MCP tool names on purpose: an agent author rehearses
 * the call they are actually going to make, not a paraphrase of it.
 */

interface ToolContract {
  readonly scopes: readonly Scope[];
  readonly action: AgentActionKind;
  /** Argument keys naming a project, checked against the project narrowing. */
  readonly projectArgs: readonly string[];
  /** Argument keys naming a connection, checked against connection narrowing. */
  readonly connectionArgs: readonly string[];
}

const TOOL_CONTRACTS: Readonly<Record<string, ToolContract>> = Object.freeze({
  list_connections: {
    scopes: ['accounts:read'],
    action: 'read',
    projectArgs: [],
    connectionArgs: [],
  },
  get_capabilities: {
    scopes: ['accounts:read'],
    action: 'read',
    projectArgs: [],
    connectionArgs: ['connectionId'],
  },
  create_draft: {
    scopes: ['drafts:write'],
    action: 'draft',
    projectArgs: ['projectId'],
    connectionArgs: ['targets'],
  },
  validate_content: {
    scopes: ['drafts:read'],
    action: 'validate',
    projectArgs: [],
    connectionArgs: [],
  },
  schedule_post: {
    scopes: ['posts:schedule'],
    action: 'schedule',
    projectArgs: [],
    connectionArgs: [],
  },
  publish_now: {
    scopes: ['posts:publish'],
    action: 'publish_now',
    projectArgs: [],
    connectionArgs: [],
  },
  get_analytics: {
    scopes: ['analytics:read'],
    action: 'read',
    projectArgs: [],
    connectionArgs: ['connectionId'],
  },
});

export const DRY_RUN_TOOL_NAMES: readonly string[] = Object.keys(TOOL_CONTRACTS);

const LEVEL_RANK: Readonly<Record<ApprovalLevel, number>> = Object.freeze({
  level_0_read: 0,
  level_1_draft: 1,
  level_2_scheduled: 2,
  level_3_confirm: 3,
});

function stringsAt(args: Readonly<Record<string, unknown>>, key: string): readonly string[] {
  const value = args[key];
  if (typeof value === 'string') {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string');
  }
  return [];
}

export interface DryRunIdentity {
  readonly disabled: boolean;
  readonly scopes: readonly Scope[];
  readonly approvalLevel: ApprovalLevel;
  /** Empty means "no narrowing", never "nothing allowed". */
  readonly projectIds: readonly string[];
  readonly connectionIds: readonly string[];
}

function denied(reason: string, body: Readonly<Record<string, unknown>>): ServiceAccountDryRunView {
  return { outcome: 'denied', body, reason };
}

/**
 * Rehearse one call. Pure: same inputs, same answer, no I/O, no clock.
 *
 * The checks run in the order the real request runs them, so the first refusal
 * a person sees here is the first refusal they would have seen in production.
 */
export function rehearseToolCall(
  identity: DryRunIdentity,
  toolName: string,
  args: Readonly<Record<string, unknown>>,
): ServiceAccountDryRunView {
  const contract = TOOL_CONTRACTS[toolName];
  if (contract === undefined) {
    return denied('agent_policy.unknown_tool', { tool: toolName });
  }

  const base = { tool: toolName, action: contract.action, required_scopes: [...contract.scopes] };

  if (identity.disabled) {
    return denied('agent_policy.service_account_disabled', base);
  }

  const missing = contract.scopes.filter((scope) => !identity.scopes.includes(scope));
  if (missing.length > 0) {
    return denied('agent_policy.scope_missing', { ...base, missing_scopes: missing });
  }

  const required = ACTION_MINIMUM_LEVEL[contract.action];
  if (LEVEL_RANK[identity.approvalLevel] < LEVEL_RANK[required]) {
    return denied('agent_policy.approval_level_too_low', {
      ...base,
      required_approval_level: required,
      granted_approval_level: identity.approvalLevel,
    });
  }

  for (const key of contract.projectArgs) {
    for (const projectId of stringsAt(args, key)) {
      if (identity.projectIds.length > 0 && !identity.projectIds.includes(projectId)) {
        return denied('agent_policy.project_not_preauthorized', { ...base, project_id: projectId });
      }
    }
  }

  for (const key of contract.connectionArgs) {
    for (const connectionId of stringsAt(args, key)) {
      if (identity.connectionIds.length > 0 && !identity.connectionIds.includes(connectionId)) {
        return denied('agent_policy.connection_not_preauthorized', {
          ...base,
          connection_id: connectionId,
        });
      }
    }
  }

  // Permitted, and nothing happened. Both halves matter.
  return { outcome: 'ok', body: { ...base, would_execute: true, executed: false }, reason: null };
}
