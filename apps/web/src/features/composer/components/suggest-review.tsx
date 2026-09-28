'use client';

/**
 * The Review button and the review's place in the readiness checklist.
 *
 * Review runs three checks on the current master text: claims against the
 * project's confirmed facts, accessibility, and similarity to recent posts.
 * Each check shows its own status with an icon and words, never colour alone.
 * A check that could not run says so; it is never shown as a pass. Nothing here
 * approves or blocks a post: the findings are readiness items a person reads.
 */

import { type ReactNode } from 'react';
import { CircleAlert, CircleCheck, CircleHelp, OctagonX } from 'lucide-react';
import { Button } from '@relay/design-system/primitives';
import { LoadingState } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context';
import { isUnsavedDraft } from '../types';
import {
  useLastReview,
  useReviewRunning,
  useRunReview,
  type ReviewCheckView,
} from './suggest-data';

const CHECK_KEY = {
  claims: 'web.suggest.review.check.claims',
  accessibility: 'web.suggest.review.check.accessibility',
  duplicates: 'web.suggest.review.check.duplicates',
} as const;

const STATUS_KEY = {
  passed: 'web.suggest.review.status.passed',
  attention: 'web.suggest.review.status.attention',
  blocked: 'web.suggest.review.status.blocked',
  unavailable: 'web.suggest.review.status.unavailable',
} as const;

function StatusIcon({ status }: { readonly status: ReviewCheckView['status'] }): ReactNode {
  const common = 'mt-0.5 size-4 shrink-0';
  switch (status) {
    case 'passed':
      return <CircleCheck aria-hidden className={`${common} text-success-fg`} />;
    case 'attention':
      return <CircleAlert aria-hidden className={`${common} text-warning-fg`} />;
    case 'blocked':
      return <OctagonX aria-hidden className={`${common} text-destructive-fg`} />;
    case 'unavailable':
      return <CircleHelp aria-hidden className={`${common} text-text-tertiary`} />;
  }
}

/** Draft key shared by the button and the checklist rows. */
function useDraftKey(): string {
  const { state } = useComposer();
  return isUnsavedDraft(state.master) ? 'unsaved' : state.master.id;
}

export function SuggestReviewButton(): ReactNode {
  const t = useTranslations();
  const { state, online } = useComposer();
  const draftKey = useDraftKey();
  const review = useRunReview();
  const empty = state.master.body.trim().length === 0;

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={empty || !online || review.isPending}
      loading={review.isPending}
      loadingLabel={t.full('web.suggest.review.pending')}
      title={empty ? t.full('web.suggest.emptyBody') : undefined}
      onClick={() =>
        review.mutate({
          draftId: draftKey,
          body: state.master.body,
          ...(isUnsavedDraft(state.master) ? {} : { contentItemId: state.master.id }),
          ...(state.master.mediaIds.length === 0 ? {} : { mediaIds: state.master.mediaIds }),
        })
      }
    >
      {t.full('web.suggest.review.button')}
    </Button>
  );
}

/**
 * The review's rows in the readiness checklist. Renders nothing until a
 * Review has run for this draft in this session.
 */
export function SuggestReviewItems(): ReactNode {
  const t = useTranslations();
  const draftKey = useDraftKey();
  const review = useLastReview(draftKey);
  const running = useReviewRunning();

  if (review === null) {
    return running ? (
      <LoadingState label={t.full('web.suggest.review.pending')}>
        <p className="text-body-sm text-text-secondary">{t.full('web.suggest.review.pending')}</p>
      </LoadingState>
    ) : null;
  }

  return (
    <section aria-labelledby="composer-suggest-review-heading" className="flex flex-col gap-2">
      <h3
        id="composer-suggest-review-heading"
        className="text-body-sm text-text-primary font-semibold"
      >
        {t.full('web.suggest.review.title')}
      </h3>
      <p className="text-label text-text-tertiary">{t.full('web.suggest.review.disclaimer')}</p>
      <ul className="flex flex-col gap-2">
        {review.checks.map((check) => (
          <li key={check.check} className="flex flex-col gap-1">
            <span className="text-body-sm text-text-primary flex items-start gap-2">
              <StatusIcon status={check.status} />
              <span>
                <span className="font-semibold">{t.full(CHECK_KEY[check.check])}</span>{' '}
                <span className="text-text-secondary">{t.full(STATUS_KEY[check.status])}</span>
              </span>
            </span>
            {check.status === 'unavailable' ? (
              <p className="text-label text-text-secondary ps-6">
                {t(check.reasonKey ?? 'web.suggest.review.unavailable')}
              </p>
            ) : null}
            {check.findings.length > 0 ? (
              <ul className="text-label text-text-secondary flex flex-col gap-1 ps-6">
                {check.findings.map((finding) => (
                  <li
                    key={`${finding.code}:${finding.explanation}`}
                    className="flex flex-col gap-0.5"
                  >
                    {finding.quote === null ? null : (
                      <span>{t.full('web.suggest.review.quote', { text: finding.quote })}</span>
                    )}
                    <span>{finding.explanation}</span>
                    {finding.suggestion === null ? null : (
                      <span>
                        {t.full('web.suggest.review.suggestedWording', {
                          text: finding.suggestion,
                        })}
                      </span>
                    )}
                    {finding.relatedContentIds.length > 0 ? (
                      <span>
                        {t.full('web.suggest.review.relatedCount', {
                          count: finding.relatedContentIds.length,
                        })}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
