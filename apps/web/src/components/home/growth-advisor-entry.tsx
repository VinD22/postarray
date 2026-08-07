'use client';

import { Link } from '@/components/link';

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
    plan.totalWeeks !== null;

  return (
    <HomeSection id="home-advisor" title={t('home.advisor.title')}>
      {hasPlan ? (
        <>
          <p className="prose-measure text-body-md text-text-secondary">
            <span>
              {t('growth.plan.version', {
                version: plan.version ?? 1,
                date: format.date(plan.approvedAt ?? new Date()),
              })}
            </span>{' '}
            <span>
              {t('growth.plan.approved', {
                date: format.date(plan.approvedAt ?? new Date()),
              })}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/growth">{t('home.advisor.openPlan')}</Link>
            </Button>
            {plan.currentWeek !== null ? (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/growth?week=${plan.currentWeek ?? 1}`}>
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
              <Link href="/growth">{t('home.advisor.start')}</Link>
            </Button>
          </div>
        </>
      )}
    </HomeSection>
  );
}
