'use client';

/**
 * Estimated provider cost and the approval state.
 *
 * An unmetered provider shows no number at all rather than a fabricated zero,
 * which is what `MetricValue` exists to enforce. The link surcharge is called
 * out because it is the one cost decision the user can act on while writing.
 */

import { type ReactNode } from 'react';
import { DefinitionList, MetricValue } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { formatCurrency } from '@relay/i18n';

import { useComposer } from '../composer-context.js';
import { findUrls } from '../state/capability-rules.js';
import { PROVIDER_LABEL } from './provider-identity.js';

export function CostPanel(): ReactNode {
  const t = useTranslations();
  const { bootstrap, state, summaries, totals } = useComposer();
  const hasUrl = findUrls(state.master.body).length > 0;

  const surcharged = summaries.filter(
    (summary) =>
      hasUrl &&
      summary.account.capabilities.cost !== null &&
      summary.account.capabilities.cost.perUrlCreateMinor >
        summary.account.capabilities.cost.perCreateMinor,
  );

  return (
    <section aria-labelledby="composer-cost-heading" className="flex flex-col gap-3">
      <h3 id="composer-cost-heading" className="text-title-sm text-text-primary">
        {t.full('composer.cost.title')}
      </h3>

      {totals.estimatedCostMinor === null || totals.costCurrency === null ? (
        <MetricValue
          label={t.full('composer.cost.title')}
          availability="unsupported"
          unavailableText={t.full('common.unavailable')}
          reason={t.full('composer.cost.none')}
        />
      ) : (
        <MetricValue
          label={t.full('composer.cost.title')}
          availability="available"
          value={formatCurrency(t.locale, totals.estimatedCostMinor, totals.costCurrency, {
            trimZeroFraction: false,
          })}
          definition={t.full('composer.cost.reconciled')}
        />
      )}

      <ul className="flex flex-col">
        {summaries
          .filter((summary) => summary.estimatedCostMinor !== null && summary.costCurrency !== null)
          .map((summary) => (
            <li
              key={summary.connectionId}
              className="border-border-subtle text-body-sm flex items-baseline justify-between gap-3 border-b py-1.5 last:border-b-0"
            >
              <span className="text-text-secondary min-w-0 truncate">
                {summary.account.displayName}
              </span>
              <span className="text-text-primary shrink-0 tabular-nums">
                {formatCurrency(
                  t.locale,
                  summary.estimatedCostMinor ?? 0,
                  summary.costCurrency ?? 'USD',
                  { trimZeroFraction: false },
                )}
              </span>
            </li>
          ))}
      </ul>

      {surcharged.map((summary) => (
        <p key={summary.connectionId} className="text-body-sm text-text-secondary">
          {t.full('composer.cost.linkSurcharge', {
            provider: PROVIDER_LABEL[summary.account.provider],
          })}
        </p>
      ))}

      {totals.targetCount > 3 ? (
        <p className="text-body-sm text-warning-fg">
          {t.full('composer.cost.bulkWarning', { count: totals.targetCount })}
        </p>
      ) : null}

      <DefinitionList
        layout="columns"
        items={[
          {
            id: 'approver',
            term: t.full('composer.schedule.approverLabel'),
            definition: bootstrap.approverName ?? t.full('composerWeb.review.approverNone'),
          },
          ...(bootstrap.approvalPolicy === null
            ? []
            : [
                {
                  id: 'policy',
                  term: t.full('composer.schedule.policyLabel'),
                  definition: bootstrap.approvalPolicy,
                },
              ]),
        ]}
      />
    </section>
  );
}
