'use client';

import type { ReactNode } from 'react';
import { Button } from '@relay/design-system/primitives';
import { DefinitionList, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { displayProjectAllowance, findTier, pendingTiers, publishableTiers } from './tiers';

export interface TierPanelProps {
  /** The tier key the billing service reports, or `null` when it has not. */
  readonly tierKey: string | null;
  /** Active projects the workspace holds, or `null` when unknown. */
  readonly activeProjects: number | null;
  readonly onUpgrade?: () => void;
  readonly upgrading?: boolean;
}

/**
 * The workspace's project capacity, on the Billing settings screen.
 *
 * A tier buys active project capacity and nothing else, so this panel states
 * one number and never implies a feature is waiting behind a larger tier. When
 * the billing service has not told us the tier or the allowance we say
 * "unavailable"; we never print 0, which would read as "you may hold no
 * projects" rather than "we do not know yet".
 */
export function TierPanel({
  tierKey,
  activeProjects,
  onUpgrade,
  upgrading = false,
}: TierPanelProps): ReactNode {
  const t = useTranslations();
  const tier = findTier(tierKey);
  const allowance = displayProjectAllowance(tier);
  const larger = publishableTiers().filter(
    (candidate) => tier === null || candidate.rank > tier.rank,
  );
  const undecided = pendingTiers();

  const allowanceText =
    allowance === null
      ? t('billing.tier.allowanceUnavailable')
      : activeProjects === null
        ? t('billing.tier.projectAllowance', { count: allowance })
        : t('billing.tier.projectAllowanceUsage', { used: activeProjects, limit: allowance });

  const overAllowance = allowance !== null && activeProjects !== null && activeProjects > allowance;

  return (
    <div className="flex flex-col gap-4">
      <DefinitionList
        items={[
          {
            id: 'tier',
            term: t('billing.tier.selected'),
            definition: tier === null ? t('common.unavailable') : t(tier.nameKey),
          },
          {
            id: 'projects',
            term: t('billing.plan.includes.title'),
            definition: allowanceText,
          },
        ]}
      />

      <p className="text-body-md text-text-secondary max-w-[68ch]">
        {t('billing.tier.everyFeature')}
      </p>

      {overAllowance ? (
        <Notice
          tone="warning"
          liveness="status"
          title={t('billing.downgrade.projectsOverAllowance', {
            count: (activeProjects ?? 0) - (allowance ?? 0),
          })}
        />
      ) : null}

      {larger.length > 0 && onUpgrade !== undefined ? (
        <div className="flex flex-col gap-2">
          <p className="text-body-md text-text-secondary max-w-[68ch]">
            {t('billing.tier.upgradeHelp')}
          </p>
          <div>
            <Button variant="secondary" loading={upgrading} onClick={onUpgrade}>
              {t('billing.tier.upgradeAction')}
            </Button>
          </div>
        </div>
      ) : undecided.length > 0 ? (
        <Notice
          tone="info"
          title={t('billing.tier.moreComingTitle')}
          description={t('billing.tier.moreComingBody')}
        />
      ) : null}
    </div>
  );
}
