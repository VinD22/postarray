import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

import type { CreationSurface } from '@relay/contracts';

/**
 * Request context.
 *
 * Every flow in Post Array carries a correlation id, the workspace it belongs to,
 * who asked for it and which of the five surfaces it came from. The context is
 * ambient so a repository or a connector activity never has to thread it
 * through every signature, and so a log line can never forget it.
 */

export const ACTOR_TYPES = ['user', 'service_account', 'oauth_app', 'system'] as const;

export type ActorType = (typeof ACTOR_TYPES)[number];

export interface Actor {
  readonly type: ActorType;
  readonly id: string;
}

export interface RelayContext {
  readonly correlationId: string;
  readonly workspaceId: string | undefined;
  readonly actor: Actor;
  readonly surface: CreationSurface;
  /** Epoch milliseconds when this unit of work started. */
  readonly startedAt: number;
  /** Optional low cardinality labels. Never secrets, never free text. */
  readonly attributes: Readonly<Record<string, string>>;
}

export interface RelayContextInput {
  readonly correlationId?: string;
  readonly workspaceId?: string;
  readonly actor?: Actor;
  readonly surface: CreationSurface;
  readonly startedAt?: number;
  readonly attributes?: Readonly<Record<string, string>>;
}

const SYSTEM_ACTOR: Actor = { type: 'system', id: 'system' };

const storage = new AsyncLocalStorage<RelayContext>();

export function newCorrelationId(): string {
  return randomUUID();
}

export function createContext(input: RelayContextInput): RelayContext {
  return Object.freeze({
    correlationId: input.correlationId ?? newCorrelationId(),
    workspaceId: input.workspaceId,
    actor: input.actor ?? SYSTEM_ACTOR,
    surface: input.surface,
    startedAt: input.startedAt ?? Date.now(),
    attributes: Object.freeze({ ...input.attributes }),
  });
}

/** Run `fn` with an ambient context. Nested calls replace the whole context. */
export function runWithContext<T>(input: RelayContextInput | RelayContext, fn: () => T): T {
  const context = isContext(input) ? input : createContext(input);
  return storage.run(context, fn);
}

/** Run `fn` with the current context extended. Throws if there is none. */
export function runWithExtendedContext<T>(
  patch: Partial<Omit<RelayContext, 'correlationId'>>,
  fn: () => T,
): T {
  const current = requireContext();
  return storage.run(
    Object.freeze({
      ...current,
      ...patch,
      attributes: Object.freeze({ ...current.attributes, ...patch.attributes }),
    }),
    fn,
  );
}

export function getContext(): RelayContext | undefined {
  return storage.getStore();
}

export function requireContext(): RelayContext {
  const context = storage.getStore();
  if (context === undefined) {
    throw new Error('No Post Array context is active. Wrap this call in runWithContext.');
  }
  return context;
}

export function getCorrelationId(): string | undefined {
  return storage.getStore()?.correlationId;
}

export function getWorkspaceId(): string | undefined {
  return storage.getStore()?.workspaceId;
}

export function getActor(): Actor | undefined {
  return storage.getStore()?.actor;
}

export function getSurface(): CreationSurface | undefined {
  return storage.getStore()?.surface;
}

/** The context flattened for a log line or a span. Omits absent fields. */
export function contextFields(): Record<string, unknown> {
  const context = storage.getStore();
  if (context === undefined) return {};
  const fields: Record<string, unknown> = {
    correlationId: context.correlationId,
    actorType: context.actor.type,
    actorId: context.actor.id,
    surface: context.surface,
  };
  if (context.workspaceId !== undefined) fields['workspaceId'] = context.workspaceId;
  for (const [key, value] of Object.entries(context.attributes)) {
    fields[key] = value;
  }
  return fields;
}

function isContext(value: RelayContextInput | RelayContext): value is RelayContext {
  const candidate = value as Partial<RelayContext>;
  return (
    typeof candidate.correlationId === 'string' &&
    typeof candidate.startedAt === 'number' &&
    candidate.actor !== undefined
  );
}
