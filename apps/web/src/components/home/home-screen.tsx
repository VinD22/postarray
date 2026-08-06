'use client';

import { Link } from '@/components/link';
import { Coffee } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { useAnnouncer } from '@relay/design-system/hooks';
import { EmptyState, PageHeader } from '@relay/design-system/patterns';
import { Badge, Button, Separator } from '@relay/design-system/primitives';

import { ApiError } from '@/lib/api';
import { useActionCenter, useCalendar } from '@/lib/api/hooks';
import { useSession } from '@/lib/auth/session-context';
import { useTranslations } from '@/lib/i18n';
import { StaggerList } from '@/components/motion';
import { ActionCenterList } from '@/components/shell/action-center-list';

import { ConnectionHealth } from './connection-health';
import { GrowthAdvisorEntry } from './growth-advisor-entry';
import { RecentReceipts } from './recent-receipts';
import { HomeSection } from './section';
import { TrialBanner } from './trial-banner';
import { UpcomingQueue } from './upcoming-queue';

const DAY_MS = 86_400_000;

/**
 * Home.
 *
 * It answers one question: what needs me today. Rows, a table and a timeline,
 * in that order of urgency. No charts, no counters, no "welcome back" hero, and
 * no vanity tiles: counts live in Analytics, where they have a denominator and
 * a freshness time next to them.
 */
export function HomeScreen() {
  const t = useTranslations();
  const { session, canPublish } = useSession();
  const { announce } = useAnnouncer();

  const actionQuery = useActionCenter();
  const actionItems = actionQuery.data?.data ?? [];
  const needsYouEmpty = !actionQuery.isPending && !actionQuery.error && actionItems.length === 0;

  const now = new Date();
  const upcomingQuery = useCalendar({
    from: now.toISOString(),
    to: new Date(now.getTime() + DAY_MS).toISOString(),
  });
  const upcomingCount = upcomingQuery.data?.data.length ?? 0;

  // Announce the shape of the day once, when both reads have settled, so a
  // screen reader user does not have to walk the page to find out.
  const announced = useRef(false);
  useEffect(() => {
    if (announced.current || actionQuery.isPending || upcomingQuery.isPending) {
      return;
    }
    announced.current = true;
    announce(
      t('home.greetingSummary', { actions: actionItems.length, upcoming: upcomingCount }),
      'polite',
    );
  }, [
    actionItems.length,
    actionQuery.isPending,
    announce,
    t,
    upcomingCount,
    upcomingQuery.isPending,
  ]);

  return (
    <>
      <PageHeader
        title={t('home.title')}
        description={t('home.subtitle')}
        actions={
          canPublish ? (
            <Button variant="primary" asChild>
              <Link href="/compose">{t('nav.compose')}</Link>
            </Button>
          ) : null
        }
      />

      <StaggerList className="relay-page flex flex-col gap-8 py-5 md:py-6" stagger={0.06} y={16}>
        <TrialBanner />

        <HomeSection
          id="home-needs-you"
          emphasis
          title={t('home.needsYou.title')}
          meta={
            actionItems.length > 0 ? (
              <Badge tone="pop">{t('actionCenter.itemCount', { count: actionItems.length })}</Badge>
            ) : undefined
          }
          link={
            actionItems.length > 0
              ? { href: '/action-center', label: t('home.needsYou.viewAll') }
              : undefined
          }
        >
          {needsYouEmpty ? (
            <EmptyState
              compact
              illustration={
                <span className="border-border-strong inline-flex size-12 items-center justify-center rounded-full border-2 border-dashed">
                  <Coffee aria-hidden="true" className="size-5" />
                </span>
              }
              title={t('actionCenter.empty')}
              description={t('home.needsYou.emptyQuiet')}
            />
          ) : (
            <div className={actionItems.length > 0 ? 'border-cta border-s-[3px] ps-4' : undefined}>
              <ActionCenterList
                items={actionItems}
                loading={actionQuery.isPending}
                error={ApiError.is(actionQuery.error) ? actionQuery.error : null}
                onRetry={() => {
                  void actionQuery.refetch();
                }}
                maxItems={5}
                showSnooze={false}
              />
            </div>
          )}
        </HomeSection>

        <Separator />

        <UpcomingQueue />

        <Separator />

        <div className="grid gap-8 lg:grid-cols-2">
          <RecentReceipts />
          <ConnectionHealth />
        </div>

        <Separator />

        <GrowthAdvisorEntry />

        <p className="text-body-sm text-text-tertiary">
          {t('shell.workspace.current', { name: session.workspace.name })}
        </p>
      </StaggerList>
    </>
  );
}
