import { z } from 'zod';
import type { ApprovalLevel, Scope } from '@relay/contracts';

import type { AuthorizationRequirement } from '../auth/authorize';
import type { ActorContextLike, RelayServicePort } from '../ports';
import type { ConfirmationStore } from '../confirmations';
import type { VerifiedGrant } from '../auth/verifier';

/**
 * The tool contract.
 *
 * Every tool declares its risk, its required scope and its approval level as
 * data, and the description a client shows is generated from that declaration
 * rather than written by hand. A tool whose description disagrees with its
 * enforcement is worse than no description at all, so they cannot disagree:
 * there is one source.
 *
 * There is deliberately no `publish_everywhere` and no tool whose blast radius
 * is invisible from its name and arguments.
 */

export const TOOL_RISKS = ['read', 'reversible', 'consequential'] as const;
export type ToolRisk = (typeof TOOL_RISKS)[number];

export interface ToolContext {
  readonly grant: VerifiedGrant;
  readonly actor: ActorContextLike;
  readonly services: RelayServicePort;
  readonly confirmations: ConfirmationStore;
  readonly clock: { now(): number };
  /** Sandbox routes every provider call to the fake connector. */
  readonly sandbox: boolean;
  readonly idempotencyKey: string | undefined;
}

export interface ToolResult {
  /** Compact structured payload. Never a full calendar or metric history. */
  readonly data: unknown;
  /** Pointers a client can follow instead of us dumping the whole resource. */
  readonly resourceLinks: readonly ResourceLink[];
  /** Present when the tool produced an external publication. */
  readonly receiptIds?: readonly string[];
  /** Set when the call needs a human before it can proceed. */
  readonly pendingConfirmation?: { readonly confirmationId: string; readonly confirmUrl: string };
}

export interface ResourceLink {
  readonly uri: string;
  readonly name: string;
  readonly description: string;
}

export interface ToolDefinition<Input extends z.ZodType = z.ZodType> {
  readonly name: string;
  readonly risk: ToolRisk;
  /** One sentence. What it does, in the imperative. */
  readonly summary: string;
  /** What changes outside Relay. `none` for a read tool, and it must be true. */
  readonly sideEffects: string;
  readonly scopes: readonly Scope[];
  readonly approvalLevel: ApprovalLevel;
  readonly requiresIdempotencyKey: boolean;
  readonly requiresHumanConfirmation: boolean;
  readonly inputSchema: Input;
  /**
   * Declared as a method rather than a property so a specific tool is
   * assignable to `ToolDefinition`. The dispatcher parses with `inputSchema`
   * before calling this, so the argument really is the parsed shape.
   */
  run(context: ToolContext, input: z.infer<Input>): Promise<ToolResult>;
}

/** Identity helper that infers `Input` from `inputSchema`. */
export function defineTool<Input extends z.ZodType>(
  definition: ToolDefinition<Input>,
): ToolDefinition<Input> {
  return definition;
}

const RISK_SENTENCE: Readonly<Record<ToolRisk, string>> = {
  read: 'Risk: read. It changes nothing.',
  reversible:
    'Risk: reversible. It creates or changes something inside Relay and publishes nothing.',
  consequential:
    'Risk: consequential. It can cause something to appear on, or disappear from, a real platform.',
};

const APPROVAL_SENTENCE: Readonly<Record<ApprovalLevel, string>> = {
  level_0_read: 'Approval: none. Available at approval level 0 and above.',
  level_1_draft: 'Approval: available at approval level 1 and above.',
  level_2_scheduled:
    'Approval: available at approval level 2 and above, and only inside the accounts, hours, cadence, languages, domains and look ahead the grant preauthorized.',
  level_3_confirm:
    'Approval: requires approval level 3 and an explicit confirmation from a person, obtained in Relay rather than in the agent host.',
};

/**
 * The description a client renders.
 *
 * It states the side effect, the required scope and the approval level, in that
 * order, because that is the order a person deciding whether to allow a tool
 * needs them.
 */
export function describeTool(tool: ToolDefinition): string {
  const parts = [
    tool.summary,
    RISK_SENTENCE[tool.risk],
    `Side effects: ${tool.sideEffects}`,
    `Scopes: ${tool.scopes.join(', ')}.`,
    APPROVAL_SENTENCE[tool.approvalLevel],
  ];
  if (tool.requiresIdempotencyKey) {
    parts.push(
      'Requires an idempotency_key. Repeating a call with the same key returns the original result instead of acting twice.',
    );
  }
  if (tool.requiresHumanConfirmation) {
    parts.push(
      'The first call returns a confirmation link and performs nothing. Call it again with confirmation_id once a person has approved it in Relay.',
    );
  }
  parts.push('Results are compact and link to resources rather than dumping them.');
  return parts.join(' ');
}

export function requirementOf(tool: ToolDefinition): AuthorizationRequirement {
  return {
    toolName: tool.name,
    scopes: tool.scopes,
    approvalLevel: tool.approvalLevel,
    requiresIdempotencyKey: tool.requiresIdempotencyKey,
    requiresHumanConfirmation: tool.requiresHumanConfirmation,
  };
}

export interface ToolRegistry {
  readonly tools: readonly ToolDefinition[];
  get(name: string): ToolDefinition | undefined;
  readonly names: readonly string[];
}

export function createRegistry(tools: readonly ToolDefinition[]): ToolRegistry {
  const byName = new Map(tools.map((tool) => [tool.name, tool] as const));
  if (byName.size !== tools.length) {
    throw new Error('DUPLICATE_TOOL_NAME');
  }
  return {
    tools,
    get: (name: string) => byName.get(name),
    names: tools.map((tool) => tool.name),
  };
}

/** Bounded page sizes. A tool never returns an unbounded collection. */
export const MAX_PAGE_LIMIT = 25;
export const DEFAULT_PAGE_LIMIT = 10;

export const pageInputShape = {
  cursor: z.string().min(1).max(512).optional(),
  limit: z.number().int().min(1).max(MAX_PAGE_LIMIT).default(DEFAULT_PAGE_LIMIT),
};

export const idempotencyInputShape = {
  idempotency_key: z
    .string()
    .min(8)
    .max(255)
    .regex(/^[A-Za-z0-9_.:-]+$/, { error: 'INVALID_IDEMPOTENCY_KEY' }),
};

export function resourceLink(uri: string, name: string, description: string): ResourceLink {
  return { uri, name, description };
}

/** Canonical `relay://` URIs so a client can fetch detail on demand. */
export const RESOURCE_URIS = {
  connection: (id: string) => `relay://connections/${id}`,
  capabilities: (id: string) => `relay://connections/${id}/capabilities`,
  contentItem: (id: string) => `relay://content/${id}`,
  job: (id: string) => `relay://jobs/${id}`,
  receipt: (id: string) => `relay://receipts/${id}`,
  plan: (id: string) => `relay://growth/plans/${id}`,
  opportunity: (id: string) => `relay://growth/opportunities/${id}`,
  calendar: (from: string, to: string) => `relay://calendar?from=${from}&to=${to}`,
} as const;
