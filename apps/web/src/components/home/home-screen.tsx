'use client';

import { Link } from '@/components/link';
import { useEffect, useRef } from 'react';

import { useAnnouncer } from '@relay/design-system/hooks';
import { EmptyState, PageHeader } from '@relay/design-system/patterns';
import { Badge, Button, Separator } from '@relay/design-system/primitives';

import { ApiError } from '@/lib/api';
import { useActionCenter, useCalendar } from '@/lib/api/hooks';
import { useSession } from '@/lib/auth/session-context';
import { useTranslations } from '@/lib/i18n';
import { EmptyScene } from '@/components/empty';
import { StaggerList } from '@/components/motion';
import { ActionCenterList } from '@/components/shell/action-center-list';

import { ConnectionHealth } from './connection-health';
import { DigestCard } from './digest-card';
import { RecentReceipts } from './recent-receipts';
import { HomeSection } from './section';
import { StatTiles } from './stat-tiles';
import { TrialBanner } from './trial-banner';
import { UpcomingQueue } from './upcoming-queue';

const DAY_MS = 86_400_000;

/**
 * Home.
 *
 * It answers one question: what needs me today. Rows, a table and a timeline,
 * in that order of urgency. No charts and no "welcome back" hero.
 *
 * It now opens with three counts, which is a deliberate reversal of this
 * file's original "no counters" rule and worth writing down. The objection
 * was never to numbers, it was to vanity tiles: a number with no denominator,
 * no window and no source. `StatTiles` answers all three (posts with a time
 * on them this week, accounts this workspace owns, the next thing out), reads
 * them from the same endpoints the lists below read, and says `unavailable`
 * rather than `0` when a read fails. Engagement numbers still live in
 * Analytics, where they have a freshness time next to them.
 *
 * The whole page arrives on one mount stagger, so the sections land in the
 * order they should be read: what needs you, then what goes out, then what
 * already went.
 */
export function HomeScreen() {
  const t = useTranslations();
  const { session, project, canPublish } = useSession();
  const { announce } = useAnnouncer();

  const actionQuery = useActionCenter();
  const actionItems = actionQuery.data?.data ?? [];
  const needsYouEmpty = !actionQuery.isPending && !actionQuery.error && actionItems.length === 0;

  const now = new Date();
  const upcomingQuery = useCalendar({
    from: now.toISOString(),
    to: new Date(now.getTime() + DAY_MS).toISOString(),
    ...(project === null ? {} : { projectId: project.id }),
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

        <StatTiles />

        <HomeSection
          id="home-needs-you"
          emphasis
          title={t('home.needsYou.title')}
          meta={
            actionItems.length > 0 ? (
              <Badge tone="accent">
                {t('actionCenter.itemCount', { count: actionItems.length })}
              </Badge>
            ) : undefined
          }
          link={
            actionItems.length > 0
              ? { href: '/action-center', label: t('home.needsYou.viewAll') }
              : undefined
          }
        >
          {needsYouEmpty ? (
            // The drawn scene, not an icon in a dashed circle: an empty
            // action center is the single most common thing a healthy
            // workspace sees, so it is worth some character.
            <EmptyState
              compact
              illustration={<EmptyScene scene="actionCenter" />}
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

        <DigestCard />

        <Separator />

        <div className="grid gap-8 lg:grid-cols-2">
          <RecentReceipts />
          <ConnectionHealth />
        </div>

        <p className="text-body-sm text-text-tertiary">
          {t('shell.workspace.current', { name: session.workspace.name })}
        </p>
      </StaggerList>
    </>
  );
}
