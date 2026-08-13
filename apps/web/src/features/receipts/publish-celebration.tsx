'use client';

/**
 * The moment a post goes live.
 *
 * This is the one screen in the product that is allowed to be loud, and the
 * loudness comes from choreography rather than from duration:
 *
 *  1. A single large `CelebrationBurst` fires once, keyed to the campaign, at
 *     the moment a fresh publication is first shown. It renders nothing at all
 *     under reduced motion, which is correct: the burst carries no
 *     information, and everything it is celebrating is written in words
 *     directly underneath it.
 *  2. The card slams in — scale 1.04 to 1 on a back-out ease in 200ms. That is
 *     the fast in-app tier, not the expressive one. A slow app is never
 *     delightful.
 *  3. Then nothing else moves until a platform answers. **The receipts
 *     arriving are the animation.** Each row's `LiveBadge` settles the instant
 *     that destination flips to live, so watching a cross-post land is
 *     watching real confirmations arrive one account at a time.
 *
 * There is no sound. Not muted, not behind a toggle: none was built.
 *
 * A partial result is first class here, never a success with a footnote. It
 * keeps its own heading, its own counts and its own warning outline, and both
 * groups of accounts are named. The split is on "does an external post exist",
 * exactly as `campaignOutcome` computes it, so a target that published and was
 * later deleted on the platform is never filed with the failures.
 */

import { useMemo, useRef, type ReactNode } from 'react';
import { Check, CircleSlash, Clock } from 'lucide-react';
import { Badge, cn, panelSurface } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

import { CelebrationBurst, LiveBadge } from '@/components/motion';
import { DURATION_SLOW, EASE_OUT_BACK } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

import type { CampaignOutcome, CampaignTargetView } from './types';

/**
 * How recently a destination must have published for the arrival to still be
 * "the moment". Past this the receipt is a document, not an event, and the
 * page opens quietly.
 */
export const CELEBRATION_WINDOW_MS = 5 * 60_000;

/**
 * Whether this publication is fresh enough to celebrate.
 *
 * Deliberately a pure function of the receipts and a clock reading, so the
 * decision is testable and so it can never be true twice for different
 * reasons. A campaign with nothing published yet is not celebrated: there is
 * nothing to celebrate until a platform has answered.
 */
export function isFreshPublication(
  targets: readonly CampaignTargetView[],
  now: number,
  windowMs: number = CELEBRATION_WINDOW_MS,
): boolean {
  return targets.some(
    (target) =>
      target.hasExternalPost &&
      target.publishedAt !== null &&
      now - Date.parse(target.publishedAt) <= windowMs &&
      now - Date.parse(target.publishedAt) >= 0,
  );
}

export interface PublishCelebrationProps {
  /**
   * Fires the burst and the slam exactly once. False renders the same panel
   * completely still, which is what an old receipt gets.
   */
  readonly celebrate: boolean;
  readonly outcome: CampaignOutcome;
  readonly targets: readonly CampaignTargetView[];
  /** One burst per campaign. Changing it is what fires a second one. */
  readonly campaignId: string;
  /** Renders each destination's account and platform as one sentence. */
  readonly describeTarget: (target: CampaignTargetView) => string;
  /**
   * Off when a `PartialSuccessNotice` directly underneath is already naming
   * every destination with its permalink. The panel stays the loud headline
   * and the notice stays the document; the same list twice is noise.
   */
  readonly renderTargets?: boolean;
  readonly className?: string;
}

export function PublishCelebration({
  celebrate,
  outcome,
  targets,
  campaignId,
  describeTarget,
  renderTargets = true,
  className,
}: PublishCelebrationProps): ReactNode {
  const t = useTranslations();
  const scope = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();

  const live = useMemo(() => targets.filter((target) => target.hasExternalPost), [targets]);
  const notLive = useMemo(() => targets.filter((target) => !target.hasExternalPost), [targets]);

  useGSAP(
    () => {
      if (!motionOk || !celebrate || !cardRef.current) return;
      // `from`, never a class: the finished card is what the server rendered
      // and what a reduced-motion visitor keeps. The 4% overshoot exists only
      // inside this tween.
      gsap.from(cardRef.current, {
        scale: 1.04,
        duration: DURATION_SLOW,
        ease: EASE_OUT_BACK,
        clearProps: 'scale',
      });
    },
    { scope, dependencies: [motionOk, celebrate, campaignId] },
  );

  const partial = outcome === 'partially_published';
  const heading = partial
    ? t.full('publish.receipt.partial.title', {
        published: live.length,
        failed: notLive.length,
      })
    : outcome === 'published'
      ? t.full('publish.receipt.live.title', { count: targets.length })
      : outcome === 'failed'
        ? t.full('publish.receipt.failed.title')
        : t.full('publish.receipt.pending.title');
  const body = partial
    ? t.full('publish.receipt.partial.body')
    : outcome === 'published'
      ? t.full('publish.receipt.live.body')
      : outcome === 'failed'
        ? t.full('publish.receipt.failed.body')
        : t.full('publish.receipt.pending.body');

  return (
    <div ref={scope} className={cn('relative', className)}>
      {celebrate ? (
        // Anchored to the card's own top edge rather than the viewport, so a
        // burst never appears somewhere the reader is not looking. Absent
        // entirely, not frozen, when motion is off.
        <CelebrationBurst tier="lg" trigger={campaignId} className="start-1/2 top-8" />
      ) : null}

      <section
        ref={cardRef}
        aria-labelledby="publish-celebration-heading"
        className={cn(
          panelSurface,
          'relative flex flex-col gap-3 p-4',
          // The warning outline is a second signal, never the only one: the
          // heading above already counts what is live and what is not.
          partial && 'border-warning-border border-2',
        )}
      >
        <div className="flex flex-col gap-1">
          <p className="text-label text-text-tertiary tracking-wide uppercase">
            {t.full('publish.receipt.sectionLabel')}
          </p>
          <h2
            id="publish-celebration-heading"
            className="font-display text-title-sm text-text-primary font-bold"
          >
            {heading}
          </h2>
          <p className="prose-measure text-body-sm text-text-secondary">{body}</p>
        </div>

        {!renderTargets ? null : (
          <ul className="border-border-subtle flex flex-col border-t">
            {targets.map((target) => (
              <li
                key={target.variantId}
                className="border-border-subtle flex flex-wrap items-center gap-x-3 gap-y-1 border-b py-2.5"
              >
                <span className="text-body-md text-text-primary min-w-0 flex-1 truncate">
                  {describeTarget(target)}
                </span>
                <TargetBadge target={target} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/**
 * One destination's status.
 *
 * `LiveBadge` animates only on the false-to-true transition, which is exactly
 * the event we want: a row that was already live when the page opened settles
 * silently, and a row that flips while somebody is watching plays the dot
 * settle and the tick draw-in. A destination that has finished without a post
 * is not a `LiveBadge` at all — it is a plain badge that says so, because
 * "not live" is a different fact from "not live yet".
 */
function TargetBadge({ target }: { readonly target: CampaignTargetView }): ReactNode {
  const t = useTranslations();

  if (target.hasExternalPost) {
    return (
      <LiveBadge
        live
        label={t.full('publish.receipt.badge.live')}
        icon={<Check className="size-3.5" aria-hidden="true" />}
      />
    );
  }

  if (TERMINAL_STATES.includes(target.state)) {
    return (
      <Badge tone="warning" icon={<CircleSlash aria-hidden="true" className="size-3.5" />}>
        {t.full('publish.receipt.badge.notLive')}
      </Badge>
    );
  }

  return (
    <LiveBadge
      live={false}
      label={t.full('publish.receipt.badge.waiting')}
      icon={<Clock className="size-3.5" aria-hidden="true" />}
    />
  );
}

/** States in which a destination has stopped trying without a post. */
const TERMINAL_STATES: readonly CampaignTargetView['state'][] = ['failed_permanently', 'canceled'];
