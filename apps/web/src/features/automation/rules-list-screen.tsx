'use client';

import type { ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { useBreakpoint } from '@relay/design-system/hooks';
import { EmptyState, LoadingState, Notice, SkeletonTable } from '@relay/design-system/patterns';
import {
  Badge,
  Button,
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

import { useAutomationRules } from './queries';
import type { RuleState } from './types';

/**
 * Every rule in the workspace, with its sentence.
 *
 * The row leads with the rule's own sentence rather than with a name, because a
 * name is what somebody called it and the sentence is what it does. The state
 * is a word, and "stopped by kill switch" is its own state rather than a
 * variant of paused, because the two mean different things to the person
 * reading the list at speed.
 */

const STATE_KEY: Readonly<Record<RuleState, string>> = {
  draft: 'automation.rules.state.draft',
  testing: 'automation.rules.state.testing',
  active: 'automation.rules.state.active',
  paused: 'automation.rules.state.paused',
  stopped: 'automation.rules.state.stopped',
};

const STATE_TONE: Readonly<
  Record<RuleState, 'neutral' | 'accent' | 'warning' | 'destructive' | 'info'>
> = {
  draft: 'neutral',
  testing: 'info',
  active: 'accent',
  paused: 'warning',
  stopped: 'destructive',
};

export function RulesListScreen(): ReactElement {
  const t = useTranslations();
  const router = useRouter();
  const format = useValueFormat();
  const isWide = useBreakpoint('md');
  const rules = useAutomationRules();

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex max-w-[70ch] flex-col gap-1">
          <h2 className="text-title-md text-text-primary">{t('automation.rules.title')}</h2>
          <p className="text-body-md text-text-secondary">{t('automation.preflight.intro')}</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/automation/rules/new')}>
          {t('automation.rules.create')}
        </Button>
      </div>

      {rules.isPending ? (
        <LoadingState label={t('automation.state.loading')}>
          <SkeletonTable rows={5} columns={4} />
        </LoadingState>
      ) : rules.isError ? (
        <QueryErrorState
          error={rules.error}
          title={t('automation.state.errorTitle')}
          description={t('automation.state.errorBody')}
          permission={{
            title: t('automation.state.permissionTitle'),
            description: t('automation.state.permissionBody'),
          }}
          rateLimit={{
            title: t('automation.state.rateLimitTitle'),
            cause: t('automation.state.rateLimitCause'),
            alternative: t('automation.state.rateLimitAlternative'),
          }}
          onRetry={() => {
            void rules.refetch();
          }}
        />
      ) : rules.data.length === 0 ? (
        <EmptyState
          title={t('automation.rules.title')}
          description={t('automation.rules.empty')}
          example={t('automation.rules.emptyExample')}
          action={
            <Button variant="primary" onClick={() => router.push('/automation/rules/new')}>
              {t('automation.rules.create')}
            </Button>
          }
        />
      ) : isWide ? (
        <TableContainer>
          <Table density="compact">
            <TableCaption>{t('automation.rules.table.caption')}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">{t('automation.rules.table.rule')}</TableHead>
                <TableHead scope="col">{t('automation.rules.table.state')}</TableHead>
                <TableHead scope="col">{t('automation.rules.table.accounts')}</TableHead>
                <TableHead scope="col">{t('automation.rules.table.lastRun')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.data.map((rule) => (
                <TableRow key={rule.id} attention={rule.state === 'stopped'}>
                  <TableCell>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <button
                        type="button"
                        className="text-body-md text-text-primary text-start underline-offset-2 hover:underline"
                        onClick={() => router.push(`/automation/rules/${rule.id}`)}
                      >
                        {rule.name}
                      </button>
                      <span className="text-body-sm text-text-secondary max-w-[60ch]">
                        {rule.sentence}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge tone={STATE_TONE[rule.state]}>{t(STATE_KEY[rule.state])}</Badge>
                  </TableCell>
                  <TableCell>
                    {t('automation.rules.summaryAccounts', { count: rule.connectionCount })}
                  </TableCell>
                  <TableCell>
                    {rule.lastRunAt === null ? (
                      t('automation.rules.neverRun')
                    ) : (
                      <time dateTime={rule.lastRunAt} className="tabular-nums">
                        {format.relative(rule.lastRunAt)}
                      </time>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <ul className="border-border-subtle flex flex-col border-t">
          {rules.data.map((rule) => (
            <li key={rule.id} className="border-border-subtle border-b py-3">
              <button
                type="button"
                className="flex min-h-11 w-full flex-col items-start gap-1 text-start"
                onClick={() => router.push(`/automation/rules/${rule.id}`)}
              >
                <span className="text-body-lg text-text-primary">{rule.name}</span>
                <span className="text-body-sm text-text-secondary">{rule.sentence}</span>
                <span className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge tone={STATE_TONE[rule.state]}>{t(STATE_KEY[rule.state])}</Badge>
                  <span className="text-body-sm text-text-tertiary">
                    {t('automation.rules.summaryAccounts', {
                      count: rule.connectionCount,
                    })}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Notice
        tone="neutral"
        title={t('automation.refuse.title')}
        description={t('automation.refuse.body')}
      />
    </div>
  );
}
