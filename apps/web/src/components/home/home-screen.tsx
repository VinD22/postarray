'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { useAnnouncer } from '@relay/design-system/hooks';
import { PageHeader } from '@relay/design-system/patterns';
import { Button, Separator } from '@relay/design-system/primitives';

import { ApiError } from '@/lib/api';
import { useActionCenter, useCalendar } from '@/lib/api/hooks';
import { useSession } from '@/lib/auth/session-context';
import { useTranslations } from '@/lib/i18n';
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

      <div className="3xl:max-w-[90rem] flex flex-col gap-8 px-4 py-5 md:px-6 md:py-6 2xl:mx-auto 2xl:max-w-[85rem]">
        <TrialBanner />

        <HomeSection
          id="home-needs-you"
          title={t('home.needsYou.title')}
          meta={t('actionCenter.itemCount', { count: actionItems.length })}
          link={
            actionItems.length > 0
              ? { href: '/action-center', label: t('home.needsYou.viewAll') }
              : undefined
          }
        >
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
      </div>
    </>
  );
}
