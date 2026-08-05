/**
 * Global edit.
 *
 * A global edit always writes the master draft. What it does to the targets is
 * the interesting part, and the product rule is absolute: a field that a target
 * cannot accept is never quietly dropped. The plan below splits every selected
 * target into three named groups, and the panel shows all three before anything
 * is written.
 */

import { resolveVariant, type OverridableVariantField } from '@relay/contracts';

import {
  adaptBodyFor,
  checkBodyCompatibility,
  checkMediaCompatibility,
  checkSequenceCompatibility,
  type Incompatibility,
  type MediaFacts,
} from './capability-rules.js';
import type { ComposerAction } from './composer-reducer.js';
import type { ComposerState, TargetAccount } from '../types.js';

export interface GlobalEditIncompatibility {
  readonly connectionId: string;
  readonly reasons: readonly Incompatibility[];
  /**
   * What this target receives instead. Shown in full before the user confirms,
   * and written as an explicit override so the divergence stays visible.
   */
  readonly adaptedBody: string | null;
}

export interface GlobalEditPlan {
  readonly field: OverridableVariantField;
  /** Targets that still inherit this field and can take the value unchanged. */
  readonly appliesTo: readonly string[];
  /** Targets with their own version. The master changes, they do not. */
  readonly keepsOverride: readonly string[];
  readonly incompatible: readonly GlobalEditIncompatibility[];
  readonly noChange: boolean;
}

export interface PlanGlobalEditInput {
  readonly state: ComposerState;
  readonly accounts: readonly TargetAccount[];
  readonly field: OverridableVariantField;
  readonly body?: string;
  readonly mediaIds?: readonly string[];
  readonly mediaFacts?: readonly MediaFacts[];
}

export function planGlobalEdit(input: PlanGlobalEditInput): GlobalEditPlan {
  const { state, accounts, field } = input;
  const byId = new Map(accounts.map((account) => [account.connectionId, account]));
  const appliesTo: string[] = [];
  const keepsOverride: string[] = [];
  const incompatible: GlobalEditIncompatibility[] = [];

  const noChange =
    (field === 'body' && input.body === state.master.body) ||
    (field === 'mediaIds' &&
      input.mediaIds !== undefined &&
      input.mediaIds.length === state.master.mediaIds.length &&
      input.mediaIds.every((id, index) => state.master.mediaIds[index] === id));

  for (const connectionId of state.selectedConnectionIds) {
    const account = byId.get(connectionId);
    if (!account) {
      continue;
    }
    const overrides = state.overrides[connectionId] ?? {};
    if (overrides[field] !== undefined) {
      keepsOverride.push(connectionId);
      continue;
    }

    const reasons = reasonsFor(input, account);
    if (reasons.length === 0) {
      appliesTo.push(connectionId);
      continue;
    }

    incompatible.push({
      connectionId,
      reasons,
      adaptedBody:
        field === 'body' && input.body !== undefined
          ? adaptBodyFor(input.body, account.capabilities)
          : null,
    });
  }

  return { field, appliesTo, keepsOverride, incompatible, noChange };
}

function reasonsFor(input: PlanGlobalEditInput, account: TargetAccount): Incompatibility[] {
  const snapshot = account.capabilities;
  if (input.field === 'body' && input.body !== undefined) {
    return checkBodyCompatibility(input.body, snapshot);
  }
  if (input.field === 'mediaIds' && input.mediaFacts !== undefined) {
    const resolved = resolveVariant(input.state.master, input.state.overrides[account.connectionId] ?? {});
    return checkMediaCompatibility(input.mediaFacts, snapshot, resolved.values.contentKind);
  }
  if (input.field === 'threadItems') {
    return checkSequenceCompatibility(input.state.master.threadItems.length, snapshot);
  }
  return [];
}

/**
 * The exact writes a confirmed plan performs: the master change, plus one
 * explicit override per incompatible target carrying the adapted value.
 * Targets in `appliesTo` are written nowhere, because inheritance already
 * delivers the new master value to them.
 */
export function commitGlobalEdit(
  plan: GlobalEditPlan,
  input: PlanGlobalEditInput,
): ComposerAction[] {
  const actions: ComposerAction[] = [];

  if (input.field === 'body' && input.body !== undefined) {
    actions.push({ type: 'master/patch', patch: { body: input.body } });
  } else if (input.field === 'mediaIds' && input.mediaIds !== undefined) {
    actions.push({ type: 'master/patch', patch: { mediaIds: [...input.mediaIds] } });
  }

  for (const entry of plan.incompatible) {
    if (entry.adaptedBody !== null) {
      actions.push({
        type: 'variant/override',
        connectionId: entry.connectionId,
        field: 'body',
        value: entry.adaptedBody,
      });
    }
  }

  return actions;
}
