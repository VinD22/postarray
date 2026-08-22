'use client';

import { Link } from '@/components/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { Timeline, type TimelineEvent } from '@relay/design-system/patterns';
import { Button, Separator } from '@relay/design-system/primitives';

import { CelebrationBurst, KineticHeadline, MagneticButton } from '@/components/motion';
import { api } from '@/lib/api';
import { useSession } from '@/lib/auth/session-context';
import { useFormatters, useTranslations } from '@/lib/i18n';

/**
 * Step 7: the receipt, and one next action.
 *
 * The timeline shown here is the same one the publication receipt uses: the
 * step that has actually happened, then the ones that are still to come,
 * labelled pending rather than hidden, because the point of a receipt is that a
 * person can see what is still ahead of them.
 *
 * The scheduled instant is the one the compose step really sent to the API,
 * carried here in the query string. It is not recomputed and it is certainly
 * not `new Date()`: this screen used to stamp both "created" and "scheduled"
 * with the current time, so a post scheduled for Tuesday read as scheduled for
 * now. A receipt that invents its own timestamps is worse than no receipt, so
 * when the instant is absent the timeline is not rendered at all rather than
 * filled in with something plausible. There is no "created" row for the same
 * reason: nothing on this screen knows when the draft was created.
 *
 * The one deliberately celebratory moment in the signed-in product (WP-4):
 * the heading rises in via `KineticHeadline` and a one-time burst plays
 * behind it, both named exceptions to those components' marketing-tier
 * default (see `components/motion/README.md`). Everything else on this
 * screen — the timeline, the facts, the next-step list — stays exactly as
 * plain and honest as every other receipt in the product.
 *
 * The burst is the shared `<CelebrationBurst tier="lg">` (Track B) rather
 * than this directory's original single-purpose `ConfettiBurst`. Same
 * gesture, one implementation: the publish celebration on the receipt page
 * fires the same component at the same tier, so finishing onboarding and
 * landing a first cross-post look like the same moment, because they are.
 */
export function DoneStep() {
  const t = useTranslations();
  const format = useFormatters();
  const { workspace } = useSession();
  const searchParams = useSearchParams();
  const contentItemId = searchParams.get('post');

  const scheduledAt = readInstant(searchParams.get('scheduledAt'));

  // Reaching the receipt is what finishes the first run, so it is recorded
  // here rather than inferred. Recording is idempotent on the server, and a
  // failure never blocks the screen: completion is also derived from the real
  // project and connection this person now has.
  useEffect(() => {
    void api.onboarding.complete({ step: 'done' }).catch(() => {
      // Nothing to tell the person. Their post is scheduled either way.
    });
  }, []);

  const events: TimelineEvent[] =
    scheduledAt === null
      ? []
      : [
          {
            id: 'scheduled',
            title: t('receipt.timeline.scheduled', {
              local: format.dateTime(scheduledAt),
              timeZone: workspace.timeZone,
            }),
            timestamp: format.dateTime(scheduledAt),
            isoTimestamp: scheduledAt,
            outcome: 'completed',
          },
          {
            id: 'revalidated',
            title: t('receipt.timeline.revalidated'),
            outcome: 'pending',
          },
          {
            id: 'dispatched',
            title: t('receipt.timeline.dispatched', { provider: t('common.unknown') }),
            outcome: 'pending',
          },
          {
            id: 'analytics',
            title: t('receipt.timeline.analyticsSynced'),
            outcome: 'pending',
          },
        ];

  return (
    <div className="flex flex-col gap-8">
      {/* Positioned, so the burst radiates from behind the heading rather
          than from the document origin. Renders nothing under reduced
          motion, which is why there is no static fallback here. */}
      <div aria-hidden="true" className="pointer-events-none relative">
        <CelebrationBurst tier="lg" className="start-1/2 top-8" />
      </div>

      <div className="flex flex-col gap-1">
        <KineticHeadline as="h1" className="text-title-lg text-text-primary">
          {t('onboarding.receipt.title')}
        </KineticHeadline>
        <p className="prose-measure text-body-md text-text-secondary">
          {t('onboarding.receipt.body')}
        </p>
      </div>

      {events.length === 0 ? null : (
        <Timeline label={t('receipt.timeline.title')} events={events} />
      )}

      <Separator />

      <section className="flex flex-col gap-3">
        <h2 className="text-title-sm text-text-primary">{t('onboarding.done.nextStep.title')}</h2>
        <ul className="border-border-subtle flex flex-col border-t">
          {[
            { href: '/connections', labelKey: 'onboarding.done.nextStep.connectMore' },
            { href: '/settings/members', labelKey: 'onboarding.done.nextStep.inviteTeam' },
            { href: '/settings/projects', labelKey: 'onboarding.done.nextStep.setApproval' },
            { href: '/settings/developer-apps', labelKey: 'onboarding.done.nextStep.exploreApi' },
          ].map((entry) => (
            <li key={entry.href} className="border-border-subtle border-b">
              <Link
                href={entry.href}
                className="text-body-md text-text-primary flex min-h-11 items-center hover:underline"
              >
                {t(entry.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <MagneticButton variant="primary" size="lg" asChild>
          <Link href="/home">{t('onboarding.receipt.goHome')}</Link>
        </MagneticButton>
        {contentItemId === null ? null : (
          <Button variant="secondary" size="lg" asChild>
            <Link href={`/posts/${contentItemId}`}>{t('action.viewReceipt')}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * The scheduled instant, or nothing.
 *
 * A query parameter is caller-supplied text. It is parsed rather than trusted,
 * and anything that is not a real instant produces `null`, which renders as no
 * timeline instead of as `Invalid Date`.
 */
function readInstant(value: string | null): string | null {
  if (value === null || value === '') {
    return null;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}
