import type { ProviderId, RuleActionKind } from '@relay/contracts';

import { ACTIONS, type ActionSpec } from './catalog';

/**
 * Which actions the selected accounts can actually perform.
 *
 * The rule from the specification: an action a provider does not permit is not
 * a disabled option with a tooltip, it is absent from the picker, and a line
 * under the picker states why. A disabled control invites the user to argue
 * with it. An absent control with a sentence explaining the absence tells them
 * what to do instead.
 *
 * The judgement is never made from a hard coded provider table. It comes from
 * the versioned capability snapshot of each connection, which distinguishes
 * "the provider has no such API" from "Relay has not built it yet". Those two
 * produce different sentences, because they are different facts.
 */

export type CapabilitySupport = 'supported' | 'unsupported' | 'not_implemented' | 'requires_review';

export interface ConnectionCapabilities {
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly displayName: string;
  /** Capability key to its support state in this connection's snapshot. */
  readonly capabilities: Readonly<Record<string, CapabilitySupport>>;
}

export interface HiddenAction {
  readonly kind: RuleActionKind;
  readonly spec: ActionSpec;
  readonly provider: ProviderId;
  readonly displayName: string;
  readonly support: Exclude<CapabilitySupport, 'supported'>;
}

export interface ActionAvailability {
  readonly available: readonly ActionSpec[];
  readonly hidden: readonly HiddenAction[];
}

/**
 * Split the action catalog into what these accounts can do and what they cannot.
 *
 * An action is offered only when every selected account supports it. Offering
 * an action that two of three accounts support would produce a rule that
 * silently does nothing on the third, and a rule that silently does nothing is
 * the worst kind of automation.
 *
 * With no accounts selected every action is offered, because the user has not
 * narrowed anything yet and hiding the whole list would look like a bug.
 */
export function resolveActionAvailability(
  connections: readonly ConnectionCapabilities[],
): ActionAvailability {
  if (connections.length === 0) {
    return { available: ACTIONS, hidden: [] };
  }

  const available: ActionSpec[] = [];
  const hidden: HiddenAction[] = [];

  for (const spec of ACTIONS) {
    if (spec.requiresCapability === undefined) {
      available.push(spec);
      continue;
    }

    const blocking = connections.find((connection) => {
      const support = connection.capabilities[spec.requiresCapability as string];
      return support !== 'supported';
    });

    if (!blocking) {
      available.push(spec);
      continue;
    }

    const support = blocking.capabilities[spec.requiresCapability as string];
    hidden.push({
      kind: spec.kind,
      spec,
      provider: blocking.provider,
      displayName: blocking.displayName,
      support: (support ?? 'not_implemented') as Exclude<CapabilitySupport, 'supported'>,
    });
  }

  return { available, hidden };
}

/** The catalog key explaining why an action is absent for these accounts. */
export function hiddenReasonKey(support: HiddenAction['support']): string {
  switch (support) {
    case 'unsupported':
      return 'capability.explain.unsupported';
    case 'not_implemented':
      return 'capability.explain.not_implemented';
    case 'requires_review':
    default:
      return 'capability.explain.requires_review';
  }
}
