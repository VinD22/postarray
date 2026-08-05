'use client';

import Link from 'next/link';

import { LoadingState, SkeletonText } from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';

import { useGrowthPlanSummary } from '@/lib/api/hooks';
import { useFormatters, useTranslations } from '@/lib/i18n';

import { HomeSection } from './section';

/**
 * The Growth advisor entry point.
 *
 * The advisor is not a navigation destination: it lives here and inside
 * campaign setup. What Home shows is one honest sentence about the current plan
 * and the two things worth doing with it. It proposes work; it never publishes.
 */
export function GrowthAdvisorEntry() {
  const t = useTranslations();
  const format = useFormatters();
  const query = useGrowthPlanSummary();

  if (query.isPending) {
    return (
      <HomeSection id="home-advisor" title={t('home.advisor.title')}>
        <LoadingState label={t('loading.default')}>
          <SkeletonText lines={2} />
        </LoadingState>
      </HomeSection>
    );
  }

  // A failure here never blocks Home. The advisor is a suggestion surface, and
  // the queue above it is what the person actually came for.
  if (query.error || !query.data) {
    return null;
  }

  const plan = query.data;
  const hasPlan =
    plan.planId !== null &&
    plan.version !== null &&
    plan.approvedAt !== null &&
    plan.currentWeek !== null &&
    plan.totalWeeks !== null;

  return (
    <HomeSection id="home-advisor" title={t('home.advisor.title')}>
      {hasPlan ? (
        <>
          <p className="prose-measure text-body-md text-text-secondary">
            {t('home.advisor.summary', {
              version: plan.version ?? 0,
              date: format.date(plan.approvedAt ?? new Date()),
              week: plan.currentWeek ?? 0,
              total: plan.totalWeeks ?? 0,
              briefs: plan.undraftedBriefCount,
            })}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/growth/plan/${plan.planId ?? ''}`}>{t('home.advisor.openPlan')}</Link>
            </Button>
            {plan.undraftedBriefCount > 0 ? (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/growth/plan/${plan.planId ?? ''}?week=${plan.currentWeek ?? 1}`}>
                  {t('home.advisor.createDrafts', { week: plan.currentWeek ?? 1 })}
                </Link>
              </Button>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <p className="prose-measure text-body-md text-text-secondary">
            {t('home.advisor.noPlan')}
          </p>
          <div>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/growth/profile">{t('home.advisor.start')}</Link>
            </Button>
          </div>
        </>
      )}
    </HomeSection>
  );
}
