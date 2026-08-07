'use client';

import { Link } from '@/components/link';
import { useSearchParams } from 'next/navigation';

import { Timeline, type TimelineEvent } from '@relay/design-system/patterns';
import { Button, Separator } from '@relay/design-system/primitives';

import { KineticHeadline, MagneticButton } from '@/components/motion';
import { ConfettiBurst } from './confetti-burst';
import { useSession } from '@/lib/auth/session-context';
import { useFormatters, useTranslations } from '@/lib/i18n';

/**
 * Step 7: the receipt, and one next action.
 *
 * The timeline shown here is the same one the publication receipt uses. Two
 * steps have happened, the rest are pending, and they are labelled pending
 * rather than hidden, because the point of the receipt is that a person can see
 * what is still to come.
 *
 * The one deliberately celebratory moment in the signed-in product (WP-4):
 * the heading rises in via `KineticHeadline` and a one-time confetti burst
 * plays behind it, both named exceptions to those components' marketing-tier
 * default (see `components/motion/README.md`). Everything else on this
 * screen — the timeline, the facts, the next-step list — stays exactly as
 * plain and honest as every other receipt in the product.
 */
export function DoneStep() {
  const t = useTranslations();
  const format = useFormatters();
  const { workspace } = useSession();
  const searchParams = useSearchParams();
  const contentItemId = searchParams.get('post');

  const now = new Date().toISOString();

  const events: TimelineEvent[] = [
    {
      id: 'created',
      title: t('receipt.timeline.created', { actor: t('receipt.surface.web') }),
      timestamp: format.dateTime(now),
      isoTimestamp: now,
      outcome: 'completed',
    },
    {
      id: 'scheduled',
      title: t('receipt.timeline.scheduled', {
        local: format.dateTime(now),
        timeZone: workspace.timeZone,
      }),
      timestamp: format.dateTime(now),
      isoTimestamp: now,
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
      <ConfettiBurst />

      <div className="flex flex-col gap-1">
        <KineticHeadline as="h1" className="text-title-lg text-text-primary">
          {t('onboarding.receipt.title')}
        </KineticHeadline>
        <p className="prose-measure text-body-md text-text-secondary">
          {t('onboarding.receipt.body')}
        </p>
      </div>

      <Timeline label={t('receipt.timeline.title')} events={events} />

      <Separator />

      <section className="flex flex-col gap-3">
        <h2 className="text-title-sm text-text-primary">{t('onboarding.done.nextStep.title')}</h2>
        <ul className="border-border-subtle flex flex-col border-t">
          {[
            { href: '/connections', labelKey: 'onboarding.done.nextStep.connectMore' },
            { href: '/settings/members', labelKey: 'onboarding.done.nextStep.inviteTeam' },
            { href: '/settings/brands', labelKey: 'onboarding.done.nextStep.setApproval' },
            { href: '/settings/agents', labelKey: 'onboarding.done.nextStep.exploreApi' },
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
