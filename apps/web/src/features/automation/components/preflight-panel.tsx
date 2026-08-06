'use client';

import type { ReactElement } from 'react';
import { DefinitionList, LoadingState, Notice, SkeletonText } from '@relay/design-system/patterns';
import { Button, StatusDot } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { providerLabelKey } from '@/features/analytics/labels';
import { useValueFormat } from '@/features/analytics/use-value-format';

import type { RulePreflight } from '../types';

/**
 * Everything the rule can do, before it can do any of it.
 *
 * This is the screen's most important block and it deliberately reads as a
 * contract rather than as a summary: the accounts it can reach, the ceiling on
 * external actions, the approval that still applies, the provider restrictions,
 * the estimated metered cost with the date its prices came from, what happens to
 * cadence and duplicates, what happens when a run fails, and one worked example
 * built from a real past event.
 *
 * The activation button lives at the end of this block and nowhere else, so a
 * rule cannot be turned on from a screen that did not just state its ceiling.
 */

export interface PreflightPanelProps {
  readonly preflight: RulePreflight | undefined;
  readonly loading: boolean;
  readonly onActivate: () => void;
  readonly onTest: () => void;
  readonly activating: boolean;
  /** Issues from the editor that must be resolved first, already translated. */
  readonly blockers: readonly string[];
}

export function PreflightPanel({
  preflight,
  loading,
  onActivate,
  onTest,
  activating,
  blockers,
}: PreflightPanelProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();

  if (loading || !preflight) {
    return (
      <LoadingState label={t('automation.state.loadingRule')}>
        <SkeletonText lines={6} />
      </LoadingState>
    );
  }

  const allBlockers = [...blockers, ...preflight.blockers];

  return (
    <section
      aria-labelledby="preflight-heading"
      className="border-border-bold bg-surface-raised flex flex-col gap-4 rounded-lg border-2 p-4 md:p-6"
    >
      <div className="flex max-w-[70ch] flex-col gap-1">
        <h2 id="preflight-heading" className="text-title-sm text-text-primary">
          {t('automation.preflight.title')}
        </h2>
        <p className="text-body-md text-text-secondary">{t('automation.preflight.intro')}</p>
      </div>

      <DefinitionList
        layout="columns"
        items={[
          {
            id: 'accounts',
            term: t('automation.preflight.accountsLabel'),
            definition: (
              <ul className="flex flex-col gap-1">
                {preflight.accounts.map((account) => (
                  <li key={account.connectionId} className="flex items-center gap-2">
                    <StatusDot provider={account.provider} />
                    {account.displayName}
                    <span className="text-text-tertiary">
                      {t(providerLabelKey(account.provider))}
                    </span>
                  </li>
                ))}
              </ul>
            ),
            hint: t('automation.preflight.accounts', {
              count: preflight.accounts.length,
            }),
          },
          {
            id: 'max',
            term: t('automation.preflight.maxActionsLabel'),
            definition: t('automation.preflight.maxActions', {
              count: preflight.maxExternalActionsPerRun,
            }),
            hint: t('automation.preflight.maxActionsPeriod', {
              count: preflight.maxExternalActionsPerPeriod,
              period: preflight.periodLabel,
            }),
          },
          {
            id: 'approval',
            term: t('automation.preflight.approvalLabel'),
            definition:
              preflight.approvalPolicyName === null
                ? t('automation.preflight.approvalNone')
                : t('automation.preflight.approval', {
                    policy: preflight.approvalPolicyName,
                  }),
          },
          {
            id: 'provider',
            term: t('automation.preflight.providerLabel'),
            definition:
              preflight.providerRestrictions.length === 0 ? (
                t('automation.preflight.providerNone')
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {preflight.providerRestrictions.map((restriction) => (
                    <li key={`${restriction.provider}-${restriction.text}`}>
                      <span className="text-text-primary">
                        {t(providerLabelKey(restriction.provider))}
                      </span>
                      <span className="text-text-secondary ps-1.5">{restriction.text}</span>
                      {restriction.sourceUrl ? (
                        <a
                          className="text-text-accent ps-1.5 underline underline-offset-2"
                          href={restriction.sourceUrl}
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          {t('analytics.definition.sourceLink')}
                        </a>
                      ) : null}
                      {restriction.verifiedOn ? (
                        <span className="text-text-tertiary ps-1.5">
                          {t('analytics.definition.verifiedOn', {
                            date: format.date(restriction.verifiedOn),
                          })}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ),
          },
          {
            id: 'cost',
            term: t('automation.preflight.costLabel'),
            definition:
              preflight.estimatedCost.formatted === null
                ? t('automation.preflight.costUnknown')
                : t('automation.preflight.estimatedCost', {
                    amount: preflight.estimatedCost.formatted,
                  }),
            hint: preflight.estimatedCost.pricedOn
              ? t('automation.preflight.costMethod', {
                  date: format.date(preflight.estimatedCost.pricedOn),
                })
              : undefined,
          },
          {
            id: 'cadence',
            term: t('automation.preflight.cadenceLabel'),
            definition: t('automation.preflight.cadenceBody'),
          },
          {
            id: 'failure',
            term: t('automation.preflight.failureLabel'),
            definition:
              preflight.failureBehaviour.kind === 'pause_after'
                ? t('automation.preflight.failure.pauseAfter', {
                    count: preflight.failureBehaviour.consecutiveFailures,
                  })
                : t('automation.preflight.failure.continue'),
          },
        ]}
      />

      <section className="border-border-subtle flex flex-col gap-2 border-t pt-4">
        <h3 className="text-body-md text-text-primary font-medium">
          {t('automation.preflight.exampleLabel')}
        </h3>
        {preflight.example === null ? (
          <p className="text-body-md text-text-secondary max-w-[70ch]">
            {t('automation.preflight.exampleNone')}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-body-sm text-text-tertiary">
              {t('automation.preflight.exampleIntro')}
              <time dateTime={preflight.example.triggeredAt} className="ps-1.5 tabular-nums">
                {format.dateTime(preflight.example.triggeredAt)}
              </time>
            </p>
            <p className="text-body-md text-text-primary">{preflight.example.triggerSummary}</p>
            <ul className="flex flex-col gap-1">
              {preflight.example.conditions.map((condition) => (
                <li key={condition.label} className="text-body-md text-text-secondary">
                  {condition.passed
                    ? t('automation.test.conditionPassed', { condition: condition.label })
                    : t('automation.test.conditionFailed', { condition: condition.label })}
                </li>
              ))}
              {preflight.example.actions.map((action) => (
                <li key={action.label} className="text-body-md text-text-secondary">
                  {action.outcome === 'would_run'
                    ? t('automation.test.actionSimulated', { action: action.label })
                    : t('automation.test.actionSkipped', {
                        action: action.label,
                        reason: action.reason ?? '',
                      })}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {allBlockers.length > 0 ? (
        <Notice
          tone="warning"
          liveness="status"
          title={t('automation.preflight.blocked', { count: allBlockers.length })}
          description={
            <ul className="marker:text-text-tertiary flex list-disc flex-col gap-1 ps-5">
              {allBlockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          }
        />
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={onTest}>
          {t('action.testRule')}
        </Button>
        <Button
          variant="primary"
          loading={activating}
          disabled={allBlockers.length > 0}
          onClick={onActivate}
        >
          {t('automation.preflight.activate')}
        </Button>
      </div>
    </section>
  );
}
