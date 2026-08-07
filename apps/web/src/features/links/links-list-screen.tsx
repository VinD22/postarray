'use client';

import { useState, type ReactElement } from 'react';
import { useBreakpoint } from '@relay/design-system/hooks';
import { EmptyState, LoadingState, Notice, SkeletonTable } from '@relay/design-system/patterns';
import {
  Badge,
  Button,
  Code,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { QueryErrorState } from '@/features/analytics/components/query-error-state';
import { useValueFormat } from '@/features/analytics/use-value-format';
import { useLocalizedRouter } from '@/lib/i18n';

import { LinkCreateDialog } from './components/link-create-dialog';
import { useCreateLink, useTrackedLinks } from './queries';
import type { LinkState, TrackedLinkView } from './types';

/**
 * Every tracked link in the workspace.
 *
 * The heading of this screen states what these numbers are before any number
 * appears: a first party redirect measurement. A reader who arrives from the
 * analytics overview must not assume this table continues the same series.
 *
 * The state of a link is a word and a badge, never a colour on the row, because
 * "disabled" is the single most consequential fact here and it has to survive a
 * greyscale print and a screenshot.
 */

const STATE_TONE: Readonly<Record<LinkState, 'neutral' | 'warning' | 'destructive'>> = {
  active: 'neutral',
  expired: 'warning',
  disabled: 'destructive',
  blocked: 'destructive',
};

export function LinksListScreen(): ReactElement {
  const t = useTranslations();
  const router = useLocalizedRouter();
  const format = useValueFormat();
  const isWide = useBreakpoint('md');
  const [dialogOpen, setDialogOpen] = useState(false);

  const links = useTrackedLinks({ limit: 50 });
  const create = useCreateLink();

  const stateLabel = (link: TrackedLinkView): string => {
    if (link.state === 'blocked') {
      return t('analytics.links.state.blocked');
    }
    if (link.state === 'disabled') {
      return t('analytics.links.state.disabled');
    }
    if (link.state === 'expired') {
      return t('analytics.links.state.expired', {
        date: link.expiresAt ? format.date(link.expiresAt) : '',
      });
    }
    return t('analytics.links.state.active');
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex max-w-[70ch] flex-col gap-1">
          <h2 className="text-title-md text-text-primary">{t('analytics.links.title')}</h2>
          <p className="text-body-md text-text-secondary">{t('analytics.links.subtitle')}</p>
        </div>
        <Button variant="primary" onClick={() => setDialogOpen(true)}>
          {t('analytics.links.new')}
        </Button>
      </div>

      <Notice
        tone="neutral"
        title={t('analytics.links.measurementLabel')}
        description={t('analytics.links.measurementExplained')}
      />

      {links.isPending ? (
        <LoadingState label={t('analytics.state.loading')}>
          <SkeletonTable rows={5} columns={4} />
        </LoadingState>
      ) : links.isError ? (
        <QueryErrorState
          error={links.error}
          title={t('analytics.links.errorTitle')}
          description={t('analytics.links.errorBody')}
          permission={{
            title: t('analytics.state.permissionTitle'),
            description: t('analytics.state.permissionBody'),
          }}
          rateLimit={{
            title: t('analytics.state.rateLimitTitle', {
              provider: t('analytics.links.measurementLabel'),
            }),
            cause: t('analytics.state.rateLimitCause'),
            alternative: t('analytics.state.rateLimitAlternative'),
          }}
          onRetry={() => {
            void links.refetch();
          }}
        />
      ) : links.data.data.length === 0 ? (
        <EmptyState
          title={t('analytics.links.empty')}
          description={t('analytics.links.emptyBody')}
          example={t('analytics.links.emptyExample')}
          action={
            <Button variant="primary" onClick={() => setDialogOpen(true)}>
              {t('analytics.links.new')}
            </Button>
          }
        />
      ) : isWide ? (
        <TableContainer>
          <Table density="compact">
            <TableCaption>{t('analytics.links.table.caption')}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">{t('analytics.links.shortUrl')}</TableHead>
                <TableHead scope="col">{t('analytics.links.destination')}</TableHead>
                <TableHead scope="col">{t('analytics.links.campaign')}</TableHead>
                <TableHead scope="col">{t('common.status')}</TableHead>
                <TableHead scope="col">{t('analytics.links.created')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.data.data.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <button
                      type="button"
                      className="text-start underline-offset-2 hover:underline"
                      onClick={() => router.push(`/analytics/links/${link.id}`)}
                    >
                      <Code>{link.shortUrl}</Code>
                    </button>
                  </TableCell>
                  <TableCell>
                    <span className="text-text-secondary block max-w-[36ch] truncate">
                      {link.destination}
                    </span>
                  </TableCell>
                  <TableCell>{link.campaign ?? t('common.notSet')}</TableCell>
                  <TableCell>
                    <Badge tone={STATE_TONE[link.state]}>{stateLabel(link)}</Badge>
                  </TableCell>
                  <TableCell>
                    <time dateTime={link.createdAt} className="tabular-nums">
                      {format.date(link.createdAt)}
                    </time>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <ul className="border-border-subtle flex flex-col border-t">
          {links.data.data.map((link) => (
            <li key={link.id} className="border-border-subtle border-b py-3">
              <button
                type="button"
                className="flex min-h-11 w-full flex-col items-start gap-1 text-start"
                onClick={() => router.push(`/analytics/links/${link.id}`)}
              >
                <Code>{link.shortUrl}</Code>
                <span className="text-body-sm text-text-secondary w-full truncate">
                  {link.destination}
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <Badge tone={STATE_TONE[link.state]}>{stateLabel(link)}</Badge>
                  <span className="text-body-sm text-text-tertiary">
                    {link.campaign ?? t('common.notSet')}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <LinkCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        submitting={create.isPending}
        error={create.error}
        onSubmit={(draft) => {
          create.mutate(
            { ...draft, idempotencyKey: crypto.randomUUID() },
            { onSuccess: () => setDialogOpen(false) },
          );
        }}
      />
    </div>
  );
}
