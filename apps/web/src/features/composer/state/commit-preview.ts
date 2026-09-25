/**
 * The commit preview, as the confirm step reads it.
 *
 * The server's preflight names blockers and escalations by stable code. This
 * file turns each into a catalog key plus values, keys each note so a person
 * can tick it, and decides whether a commit has been fully acknowledged. It is
 * pure so the sentences and the gating are testable without a browser.
 */

import type { CommitPreview, CommitPreviewNote } from '@relay/contracts';

export type PreviewState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly preview: CommitPreview }
  /** The role may not do this at all. Distinct from a failed check. */
  | { readonly status: 'forbidden' }
  /** The check could not run. The server still checks on commit. */
  | { readonly status: 'unavailable' };

export interface Sentence {
  readonly key: string;
  readonly values: Readonly<Record<string, string | number>>;
}

const ESCALATION_SENTENCES = new Set([
  'immediate_publish',
  'first_use_connection',
  'bulk_publication_count',
  'similar_content_across_accounts',
  'unapproved_link_domain',
  'sensitive_content',
  'privacy_change',
  'changed_after_approval',
  'cost_threshold_exceeded',
]);

const BLOCKER_SENTENCES = new Set([
  'no_targets_selected',
  'content_invalid',
  'schedule_too_far_ahead',
  'entitlement_required',
  'approval_required',
  'content_changed_after_approval',
]);

/** One checkbox per note: the code, scoped to its connection when it has one. */
export function noteKey(note: CommitPreviewNote): string {
  return note.connectionId === undefined ? note.code : `${note.code}:${note.connectionId}`;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function count(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export function escalationSentence(
  note: CommitPreviewNote,
  providerLabel: (provider: string) => string,
): Sentence {
  if (!ESCALATION_SENTENCES.has(note.code)) {
    return { key: 'web.commitPreview.escalation.other', values: {} };
  }
  const params = note.params;
  const account = text(params['accountLabel']) || text(params['connectionId']);
  return {
    key: `web.commitPreview.escalation.${note.code}`,
    values: {
      account,
      provider: providerLabel(text(params['provider'])),
      host: text(params['host']),
      count: count(params['targetCount'] ?? params['count'] ?? params['accountCount']),
    },
  };
}

export function blockerSentence(note: CommitPreviewNote): Sentence {
  return {
    key: BLOCKER_SENTENCES.has(note.code)
      ? `web.commitPreview.blocker.${note.code}`
      : 'web.commitPreview.blocker.other',
    values: {},
  };
}

/** True when every escalation in this preview has been ticked. */
export function fullyAcknowledged(
  preview: CommitPreview,
  acknowledged: ReadonlySet<string>,
): boolean {
  return preview.escalations.every((note) => acknowledged.has(noteKey(note)));
}

/** The distinct codes a confirmation must carry, sorted, exactly as the server compares them. */
export function acknowledgedCodes(preview: CommitPreview): string[] {
  return [...new Set(preview.escalations.map((note) => note.code))].sort();
}

/**
 * Whether a commit of this kind may be attempted from the confirm step.
 *
 * A ready preview must have no blockers and every escalation ticked. An
 * unavailable check does not block: the server runs the same check on commit
 * and refuses with the reason. A forbidden one does.
 */
export function commitAllowed(state: PreviewState, acknowledged: ReadonlySet<string>): boolean {
  switch (state.status) {
    case 'ready':
      return state.preview.canCommit && fullyAcknowledged(state.preview, acknowledged);
    case 'unavailable':
      return true;
    case 'forbidden':
    case 'loading':
    case 'idle':
      return false;
  }
}

/** The notes to show, merged across both previews and de-duplicated by key. */
export function mergedEscalations(
  schedule: PreviewState,
  publishNow: PreviewState,
): readonly { readonly note: CommitPreviewNote; readonly publishNowOnly: boolean }[] {
  const scheduleKeys = new Set(
    schedule.status === 'ready' ? schedule.preview.escalations.map(noteKey) : [],
  );
  const seen = new Set<string>();
  const out: { note: CommitPreviewNote; publishNowOnly: boolean }[] = [];
  for (const state of [schedule, publishNow]) {
    if (state.status !== 'ready') {
      continue;
    }
    for (const note of state.preview.escalations) {
      const key = noteKey(note);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      out.push({
        note,
        publishNowOnly: schedule.status === 'ready' && !scheduleKeys.has(key),
      });
    }
  }
  return out;
}
