'use client';

/**
 * "Before this goes out": the commit preview on the confirm step.
 *
 * Blockers say what stops the commit and how to fix it. Escalations are plain
 * sentences with a checkbox each ("First post from @acme on LinkedIn"), and the
 * commit buttons stay disabled until every one that applies is ticked. The
 * codes ticked here are exactly the codes sent with the commit.
 */

import { useId, type ReactNode } from 'react';
import type { CommitPreviewNote } from '@relay/contracts';
import { Checkbox } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import {
  blockerSentence,
  escalationSentence,
  mergedEscalations,
  noteKey,
  type PreviewState,
} from '../state/commit-preview';

export interface CommitPreviewPanelProps {
  readonly schedule: PreviewState;
  readonly publishNow: PreviewState;
  readonly acknowledged: ReadonlySet<string>;
  readonly onToggle: (key: string, checked: boolean) => void;
  readonly providerLabel: (provider: string) => string;
}

export function CommitPreviewPanel({
  schedule,
  publishNow,
  acknowledged,
  onToggle,
  providerLabel,
}: CommitPreviewPanelProps): ReactNode {
  const t = useTranslations();
  const headingId = useId();

  if (schedule.status === 'loading' || publishNow.status === 'loading') {
    return (
      <p className="text-body-sm text-text-tertiary" role="status">
        {t('web.commitPreview.loading')}
      </p>
    );
  }

  const blockers = uniqueBlockers(schedule, publishNow);
  const escalations = mergedEscalations(schedule, publishNow);
  const unavailable = schedule.status === 'unavailable' || publishNow.status === 'unavailable';

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h3 id={headingId} className="text-title-sm text-text-primary">
        {t('web.commitPreview.heading')}
      </h3>

      {blockers.length === 0 ? null : (
        <Notice
          tone="destructive"
          liveness="status"
          title={t('web.commitPreview.blockedTitle')}
          description={
            <ul className="flex flex-col gap-1">
              {blockers.map((note) => {
                const sentence = blockerSentence(note);
                return <li key={note.code}>{t(sentence.key, sentence.values)}</li>;
              })}
            </ul>
          }
        />
      )}

      {publishNow.status === 'forbidden' ? (
        <Notice tone="warning" title={t('web.commitPreview.publishNowForbidden')} />
      ) : null}

      {unavailable ? <Notice tone="warning" title={t('web.commitPreview.unavailable')} /> : null}

      {escalations.length === 0 ? null : (
        <>
          <p className="text-body-sm text-text-secondary">
            {t('web.commitPreview.acknowledgeHint')}
          </p>
          <ul className="flex flex-col gap-2">
            {escalations.map(({ note, publishNowOnly }) => (
              <EscalationRow
                key={noteKey(note)}
                note={note}
                publishNowOnly={publishNowOnly}
                checked={acknowledged.has(noteKey(note))}
                onToggle={onToggle}
                providerLabel={providerLabel}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function EscalationRow({
  note,
  publishNowOnly,
  checked,
  onToggle,
  providerLabel,
}: {
  readonly note: CommitPreviewNote;
  readonly publishNowOnly: boolean;
  readonly checked: boolean;
  readonly onToggle: (key: string, checked: boolean) => void;
  readonly providerLabel: (provider: string) => string;
}): ReactNode {
  const t = useTranslations();
  const id = useId();
  const sentence = escalationSentence(note, providerLabel);
  return (
    <li className="flex items-start gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onToggle(noteKey(note), value === true)}
        className="mt-0.5"
      />
      <label htmlFor={id} className="text-body-sm text-text-primary flex flex-col">
        <span>{t(sentence.key, sentence.values)}</span>
        {publishNowOnly ? (
          <span className="text-label text-text-tertiary">
            {t('web.commitPreview.publishNowOnly')}
          </span>
        ) : null}
      </label>
    </li>
  );
}

function uniqueBlockers(schedule: PreviewState, publishNow: PreviewState): CommitPreviewNote[] {
  const seen = new Set<string>();
  const out: CommitPreviewNote[] = [];
  for (const state of [schedule, publishNow]) {
    if (state.status !== 'ready') {
      continue;
    }
    for (const note of state.preview.blockers) {
      if (!seen.has(note.code)) {
        seen.add(note.code);
        out.push(note);
      }
    }
  }
  return out;
}
