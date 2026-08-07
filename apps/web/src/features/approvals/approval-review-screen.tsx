'use client';

import { useState, type ReactNode } from 'react';

import { Link } from '@/components/link';
import { ApiError } from '@/lib/api';
import {
  useApprovalRequest,
  useContentItem,
  useDecideApproval,
  useMembers,
} from '@/lib/api/hooks';
import { useFormatters, useTranslations } from '@/lib/i18n';

import { useAnnouncer } from '@relay/design-system/hooks';
import { EmptyState, ErrorState, Notice, PageHeader } from '@relay/design-system/patterns';
import { Badge, Button, Field, Textarea } from '@relay/design-system/primitives';

import { ApprovalFrame, ApprovalLoading } from './approval-review-states';
import { ApprovalVariantCard } from './approval-variant-card';

type Decision = 'approve' | 'request_changes' | 'reject';

export interface ApprovalReviewScreenProps {
  readonly approvalId: string;
  readonly actionCenterHref: string;
}

export function ApprovalReviewScreen({
  approvalId,
  actionCenterHref,
}: ApprovalReviewScreenProps): ReactNode {
  const t = useTranslations();
  const format = useFormatters();
  const { announce } = useAnnouncer();
  const approvalQuery = useApprovalRequest(approvalId);
  const membersQuery = useMembers();
  const approval = approvalQuery.data ?? null;
  const contentQuery = useContentItem(approval?.contentItemId ?? null);
  const decisionMutation = useDecideApproval();
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState<string | null>(null);
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null);

  const decide = (decision: Decision) => {
    if ((decision === 'request_changes' || decision === 'reject') && note.trim().length === 0) {
      const message = t('approval.comment.required');
      setNoteError(message);
      announce(message, 'assertive');
      return;
    }

    setNoteError(null);
    setPendingDecision(decision);
    decisionMutation.mutate(
      {
        approvalId,
        decision,
        ...(note.trim().length === 0 ? {} : { note: note.trim() }),
      },
      {
        onSuccess: () => {
          const key =
            decision === 'approve'
              ? 'approval.decision.approved'
              : decision === 'request_changes'
                ? 'approval.decision.changesRequested'
                : 'approval.decision.rejected';
          announce(t(key), 'polite');
          setPendingDecision(null);
        },
        onError: () => setPendingDecision(null),
      },
    );
  };

  if (approvalQuery.isPending) {
    return <ApprovalLoading />;
  }

  if (approvalQuery.isError) {
    return (
      <ApprovalFrame title={t('approval.requestTitle')}>
        <ErrorState
          title={t('home.error.title')}
          description={t(
            ApiError.is(approvalQuery.error)
              ? approvalQuery.error.actionKey
              : 'error.internal.action',
            ApiError.is(approvalQuery.error) ? approvalQuery.error.messageValues : {},
          )}
          onRetry={() => void approvalQuery.refetch()}
          retryLabel={t('action.retry')}
        />
      </ApprovalFrame>
    );
  }

  if (approval === null) {
    return (
      <ApprovalFrame title={t('approval.requestTitle')}>
        <EmptyState
          title={t('approval.notFound.title')}
          description={t('approval.notFound.body')}
          action={
            <Button variant="secondary" asChild>
              <Link href={actionCenterHref}>{t('home.needsYou.viewAll')}</Link>
            </Button>
          }
        />
      </ApprovalFrame>
    );
  }

  if (contentQuery.isPending) {
    return <ApprovalLoading />;
  }

  if (contentQuery.isError) {
    return (
      <ApprovalFrame title={t('approval.requestTitle')}>
        <ErrorState
          title={t('home.error.title')}
          description={t(
            ApiError.is(contentQuery.error) ? contentQuery.error.actionKey : 'error.internal.action',
            ApiError.is(contentQuery.error) ? contentQuery.error.messageValues : {},
          )}
          onRetry={() => void contentQuery.refetch()}
          retryLabel={t('action.retry')}
        />
      </ApprovalFrame>
    );
  }

  const content = contentQuery.data;
  const requester = membersQuery.data?.data.find(
    (member) => member.userId === approval.requestedBy,
  );
  const changed =
    content.currentVersionId === null || content.currentVersionId !== approval.contentVersionId;
  const resolved = decisionMutation.data ?? (approval.state === 'requested' ? null : approval);
  const successKey =
    resolved?.state === 'approved'
      ? 'approval.decision.approved'
      : resolved?.state === 'changes_requested'
        ? 'approval.decision.changesRequested'
        : 'approval.decision.rejected';

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        breadcrumb={{
          label: t('a11y.region.navigation'),
          items: [
            { id: 'actions', label: t('home.needsYou.viewAll'), href: actionCenterHref },
            { id: 'approval', label: t('approval.requestTitle') },
          ],
        }}
        title={content.title || t('approval.requestTitle')}
        description={t('approval.reviewDescription')}
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-7 px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-body-sm text-text-secondary">
          <Badge tone={approval.state === 'requested' ? 'warning' : 'neutral'}>
            {t(`state.approval.${approval.state}.label`)}
          </Badge>
          <span>
            {t('approval.requestedBy', {
              name: requester?.name ?? t('common.unavailable'),
              relativeTime: format.relative(approval.createdAt),
            })}
          </span>
          {approval.dueAt === null ? null : (
            <span>{t('approval.expiresAt', { date: format.dateTime(approval.dueAt) })}</span>
          )}
        </div>

        {changed ? (
          <Notice
            tone="destructive"
            title={t('approval.changed.title')}
            description={t('approval.changed.body')}
          />
        ) : null}

        {approval.note === null ? null : (
          <section aria-labelledby="approval-author-note" className="flex flex-col gap-2">
            <h2 id="approval-author-note" className="text-title-sm text-text-primary">
              {t('approval.noteFromAuthor')}
            </h2>
            <blockquote className="border-border-bold bg-blush-subtle border-s-4 px-4 py-3 text-body-md text-text-primary">
              {approval.note}
            </blockquote>
          </section>
        )}

        <section aria-labelledby="approval-variants" className="flex flex-col gap-4">
          <div className="max-w-2xl">
            <h2 id="approval-variants" className="text-title-md text-text-primary text-wrap-balance">
              {t('approval.content.title')}
            </h2>
          </div>

          {content.reviewVariants.map((variant, index) => (
            <ApprovalVariantCard key={variant.variantId} variant={variant} index={index} />
          ))}
        </section>

        <section
          aria-labelledby="approval-decision"
          className="border-border-bold bg-sunshine-subtle shadow-hard flex flex-col gap-5 border-2 p-4 md:p-6"
        >
          <div className="max-w-2xl">
            <h2 id="approval-decision" className="text-title-md text-text-primary">
              {t('approval.decision.title')}
            </h2>
            <p className="mt-1 text-body-sm text-text-secondary">
              {t('approval.decision.description')}
            </p>
          </div>

          {resolved === null ? (
            <>
              <Field
                label={t('approval.comment.label')}
                description={t('approval.comment.optional')}
                error={noteError}
                disabled={decisionMutation.isPending || changed}
              >
                {(control) => (
                  <Textarea
                    {...control}
                    value={note}
                    rows={4}
                    maxLength={2000}
                    placeholder={t('approval.comment.placeholder')}
                    onChange={(event) => {
                      setNote(event.target.value);
                      if (event.target.value.trim().length > 0) setNoteError(null);
                    }}
                  />
                )}
              </Field>

              {decisionMutation.error ? (
                <Notice
                  tone="destructive"
                  title={t('home.error.title')}
                  description={t(
                    ApiError.is(decisionMutation.error)
                      ? decisionMutation.error.actionKey
                      : 'error.internal.action',
                    ApiError.is(decisionMutation.error)
                      ? decisionMutation.error.messageValues
                      : {},
                  )}
                />
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  disabled={changed}
                  loading={pendingDecision === 'approve'}
                  loadingLabel={t('loading.default')}
                  onClick={() => decide('approve')}
                >
                  {t('action.approve')}
                </Button>
                <Button
                  variant="secondary"
                  disabled={changed}
                  loading={pendingDecision === 'request_changes'}
                  loadingLabel={t('loading.default')}
                  onClick={() => decide('request_changes')}
                >
                  {t('action.requestChanges')}
                </Button>
                <Button
                  variant="destructive"
                  disabled={changed}
                  loading={pendingDecision === 'reject'}
                  loadingLabel={t('loading.default')}
                  onClick={() => decide('reject')}
                >
                  {t('action.reject')}
                </Button>
              </div>
            </>
          ) : (
            <Notice
              tone={resolved.state === 'approved' ? 'success' : 'warning'}
              title={t(`state.approval.${resolved.state}.label`)}
              description={t(successKey)}
            />
          )}
        </section>
      </div>
    </div>
  );
}
