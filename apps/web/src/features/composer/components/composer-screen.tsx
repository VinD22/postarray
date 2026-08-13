'use client';

/**
 * The composer screen.
 *
 * At 1280px and above this is three panes: the canonical draft on the inline
 * start, the open target in the middle, the review on the inline end. At 1024px
 * the review collapses to a toggle. Below 768px it is not a squeezed desktop:
 * it becomes four named steps with a persistent summary bar carrying targets,
 * issues, time, cost and the primary action.
 */

import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { Button } from '@relay/design-system/primitives';
import { Notice, RateLimitNotice } from '@relay/design-system/patterns';
import { useBreakpoint, useHotkeys } from '@relay/design-system/hooks';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';

import { DURATION_FAST, EASE_STANDARD } from '@/lib/motion/constants';
import { Flip, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

import { useComposer } from '../composer-context';
import { issueCursorList } from '../state/selectors';
import { ComposerHeader } from './composer-header';
import { CostPanel } from './cost-panel';
import { MasterPanel } from './master-panel';
import { PaneTransition } from './pane-transition';
import { ProviderPreview } from './provider-preview';
import { SavedFlash, useSavedFlash } from './saved-flash';
import { ScheduleSheet, type ScheduleIntent } from './schedule-sheet';
import { ShortcutsDialog } from './shortcuts-dialog';
import { SummaryBar } from './summary-bar';
import { TargetRail } from './target-rail';
import { ValidationPanel } from './validation-panel';
import { VariantEditor } from './variant-editor';
import type { ResolvedEntity } from './entity-search-field';
import type { MediaAsset } from '../../media/types';

const STEPS = ['targets', 'write', 'variant', 'review'] as const;
type Step = (typeof STEPS)[number];

export interface ComposerScreenProps {
  readonly assets: readonly MediaAsset[];
  readonly contentLocales: readonly string[];
  readonly onClose: () => void;
  readonly onPickMedia: (scope: string | null) => void;
  readonly onEditMedia: (mediaId: string) => void;
  readonly onCommit: (intent: ScheduleIntent) => Promise<void>;
  readonly searchDestinations: (
    connectionId: string,
    query: string,
  ) => Promise<readonly ResolvedEntity[]>;
  readonly searchMentions: (
    connectionId: string,
    query: string,
  ) => Promise<readonly ResolvedEntity[]>;
  /** Present when the workspace has hit its write limit for the window. */
  readonly rateLimit?: {
    readonly resetAt: string;
    readonly used: number;
    readonly limit: number;
    readonly usageText: string;
  };
  readonly scheduleWarnings?: readonly { id: string; text: string }[];
}

export function ComposerScreen(props: ComposerScreenProps): ReactNode {
  const t = useTranslations();
  const { state, dispatch, summaries, totals, saveNow, online } = useComposer();
  // Three named layouts, not one layout squeezed twice.
  const isTablet = useBreakpoint('md'); // 768: editor plus review, rail on top
  const isDesktop = useBreakpoint('lg'); // 1024: three panes, review collapsible

  const [step, setStep] = useState<Step>('write');
  const [showPreview, setShowPreview] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [issueIndex, setIssueIndex] = useState<number | null>(null);
  const savedFlash = useSavedFlash();

  const issues = useMemo(() => issueCursorList(summaries), [summaries]);
  const active =
    summaries.find((summary) => summary.connectionId === state.activeConnectionId) ?? null;

  const moveTarget = useCallback(
    (delta: 1 | -1) => {
      if (summaries.length === 0) {
        return;
      }
      const current = summaries.findIndex(
        (summary) => summary.connectionId === state.activeConnectionId,
      );
      // -1 means the master draft, which sits before the first target.
      const next = current + delta;
      if (next < 0) {
        dispatch({ type: 'target/open', connectionId: null });
        return;
      }
      const target = summaries[Math.min(next, summaries.length - 1)];
      if (target) {
        dispatch({ type: 'target/open', connectionId: target.connectionId });
      }
    },
    [dispatch, state.activeConnectionId, summaries],
  );

  const moveIssue = useCallback(
    (delta: 1 | -1) => {
      if (issues.length === 0) {
        return;
      }
      const next = ((issueIndex ?? -1) + delta + issues.length) % issues.length;
      setIssueIndex(next);
      const entry = issues[next];
      if (entry) {
        dispatch({ type: 'target/open', connectionId: entry.connectionId });
      }
    },
    [dispatch, issueIndex, issues],
  );

  // Modified chords stay live while typing, because moving between variants and
  // issues is the whole point of them. The bare `?` does not, or it would print
  // a question mark into the draft instead of opening the list.
  useHotkeys(
    {
      'Ctrl+]': () => moveTarget(1),
      'Ctrl+[': () => moveTarget(-1),
      'Ctrl+i': () => moveIssue(1),
      'Ctrl+Shift+i': () => moveIssue(-1),
      'Mod+s': () => {
        void saveNow();
        savedFlash.flash();
      },
      'Mod+Enter': () => setScheduleOpen(true),
    },
    { enableInFormFields: true },
  );
  useHotkeys({ '?': () => setShortcutsOpen(true) });

  const reviewPane = (
    <div className="flex flex-col gap-6">
      {active ? <ProviderPreview summary={active} /> : null}
      <ValidationPanel focusedIssueIndex={issueIndex} />
      <CostPanel />
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => setScheduleOpen(true)} disabled={!online}>
          {t.full('action.schedule')}
        </Button>
        <Button variant="secondary" onClick={() => void saveNow()}>
          {t.full('action.saveDraft')}
        </Button>
      </div>
      {online ? null : (
        <Notice tone="warning" title={t.full('composerWeb.review.offlineBlocked')} />
      )}
      {props.rateLimit ? (
        <RateLimitNotice
          title={t.full('composerWeb.page.rateLimitTitle')}
          cause={t.full('composerWeb.page.rateLimitCause')}
          resetAt={props.rateLimit.resetAt}
          resetLabel={t.full('common.time')}
          usage={{
            used: props.rateLimit.used,
            limit: props.rateLimit.limit,
            text: props.rateLimit.usageText,
            label: t.full('composerWeb.page.rateLimitTitle'),
          }}
          alternative={t.full('composerWeb.page.rateLimitAlternative')}
        />
      ) : null}
    </div>
  );

  const editorPane = active ? (
    <VariantEditor
      summary={active}
      assets={props.assets}
      onPickMedia={() => props.onPickMedia(active.connectionId)}
      onEditMedia={props.onEditMedia}
      searchDestinations={props.searchDestinations}
      searchMentions={props.searchMentions}
    />
  ) : (
    <p className="text-body-sm text-text-tertiary">{t.full('composer.master.description')}</p>
  );

  const masterPane = (
    <MasterPanel
      assets={props.assets}
      contentLocales={props.contentLocales}
      onPickMedia={() => props.onPickMedia(null)}
      onEditMedia={props.onEditMedia}
    />
  );

  if (!isTablet) {
    return (
      <div className="flex min-h-dvh flex-col gap-4 px-4 pt-4">
        <ComposerHeader onClose={props.onClose} onShowShortcuts={() => setShortcutsOpen(true)} />

        <StepTabs step={step} onStepChange={setStep} />

        <PaneTransition panelKey={step} className="flex-1 pb-4">
          {step === 'targets' ? <TargetRail /> : null}
          {step === 'write' ? masterPane : null}
          {step === 'variant' ? editorPane : null}
          {step === 'review' ? reviewPane : null}
        </PaneTransition>

        <SummaryBar
          onOpenReview={() => {
            setStep('review');
            setScheduleOpen(true);
          }}
        />

        <ScheduleSheet
          open={scheduleOpen}
          onOpenChange={setScheduleOpen}
          onCommit={props.onCommit}
          {...(props.scheduleWarnings ? { warnings: props.scheduleWarnings } : {})}
        />
        <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
        <SavedFlash visible={savedFlash.visible} />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col gap-4 px-4 pt-4 lg:px-6">
      <ComposerHeader onClose={props.onClose} onShowShortcuts={() => setShortcutsOpen(true)} />

      {/* 768 to 1023: the rail becomes a horizontal strip above the editor. */}
      {isDesktop ? null : (
        <div className="border-border-subtle overflow-x-auto border-b pb-3">
          <div className="min-w-[36rem]">
            <TargetRail />
          </div>
        </div>
      )}

      <div
        className={
          isDesktop
            ? showPreview
              ? 'grid flex-1 grid-cols-[17rem_minmax(0,1fr)] gap-6 xl:grid-cols-[17rem_minmax(0,1fr)_22rem]'
              : 'grid flex-1 grid-cols-[17rem_minmax(0,1fr)] gap-6'
            : 'grid flex-1 grid-cols-[minmax(0,1fr)_20rem] gap-6'
        }
      >
        {isDesktop ? (
          <aside className="border-border-subtle border-e pe-4">
            <TargetRail />
          </aside>
        ) : null}

        <section
          aria-label={
            active ? t.full('composerWeb.pane.variant') : t.full('composerWeb.pane.master')
          }
          className="min-w-0 pb-10"
        >
          <PaneTransition panelKey={active ? active.connectionId : 'master'}>
            {active ? editorPane : masterPane}
          </PaneTransition>
        </section>

        {showPreview ? (
          <aside
            aria-label={t.full('composerWeb.pane.review')}
            className={
              isDesktop
                ? 'border-border-subtle hidden border-s ps-4 pb-10 xl:block'
                : 'border-border-subtle border-s ps-4 pb-10'
            }
          >
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                {t.full('composerWeb.pane.hidePreview')}
              </Button>
            </div>
            {reviewPane}
          </aside>
        ) : null}
      </div>

      {/*
        At 1024 the review sits under the editor rather than being cut off, and
        at any width it can be collapsed and brought back with a real control.
      */}
      {showPreview ? (
        <div className={isDesktop ? 'pb-10 xl:hidden' : 'hidden'}>{reviewPane}</div>
      ) : (
        <div className="border-border-subtle flex flex-wrap items-center gap-3 border-t pt-3 pb-10">
          <p className="text-body-sm text-text-tertiary">
            {t.full('composerWeb.pane.previewCollapsed')}
          </p>
          <Button variant="secondary" size="sm" onClick={() => setShowPreview(true)}>
            {t.full('composerWeb.pane.showPreview')}
          </Button>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {t.full('composer.targets.publishSummary', {
          count: totals.targetCount,
          when: state.master.schedule === null ? 'now' : 'scheduled',
        })}
      </p>

      <ScheduleSheet
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        onCommit={props.onCommit}
        {...(props.scheduleWarnings ? { warnings: props.scheduleWarnings } : {})}
      />
      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <SavedFlash visible={savedFlash.visible} />
    </div>
  );
}

/**
 * The four named steps below 768px, with one sliding thumb.
 *
 * The thumb is a single element moved with GSAP `Flip` rather than four
 * elements each drawing their own selected background, which is the same
 * technique the primary nav's active marker and the calendar's view switch
 * use, and the reason `Flip` is sanctioned for app chrome (see
 * `components/motion/README.md`). Its position is measured from real bounding
 * rects, so it lands correctly under `dir="rtl"` with no logical/physical
 * branch, and the first paint positions it with no animation at all: an
 * indicator that slides in from the corner on load is a distraction, not a
 * transition.
 *
 * `aria-current="step"` on the button is what actually announces the step.
 * The thumb is `aria-hidden` and never the only signal: the selected button
 * also carries its own text colour and border.
 */
function StepTabs({
  step,
  onStepChange,
}: {
  readonly step: Step;
  readonly onStepChange: (next: Step) => void;
}): ReactNode {
  const t = useTranslations();
  const motionOk = useMotionOk();
  const listRef = useRef<HTMLOListElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef(new Map<Step, HTMLButtonElement>());
  const hasPositioned = useRef(false);

  useGSAP(
    () => {
      const list = listRef.current;
      const thumb = thumbRef.current;
      const active = itemRefs.current.get(step);
      if (!list || !thumb || !active) return;

      const shouldAnimate = hasPositioned.current && motionOk;
      const state = shouldAnimate ? Flip.getState(thumb) : null;

      const listRect = list.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      thumb.style.left = `${activeRect.left - listRect.left}px`;
      thumb.style.width = `${activeRect.width}px`;

      if (state) {
        Flip.from(state, { duration: DURATION_FAST, ease: EASE_STANDARD });
      }
      hasPositioned.current = true;
    },
    { scope: listRef, dependencies: [step, motionOk] },
  );

  return (
    <nav aria-label={t.full('composerWeb.step.legend')}>
      <ol ref={listRef} className="relative flex gap-1 overflow-x-auto">
        <span
          ref={thumbRef}
          aria-hidden="true"
          className="border-accent bg-accent-subtle pointer-events-none absolute inset-y-0 z-0 rounded-md border"
        />
        {STEPS.map((entry, index) => (
          <li key={entry}>
            <button
              type="button"
              aria-current={step === entry ? 'step' : undefined}
              ref={(element) => {
                if (element) itemRefs.current.set(entry, element);
                else itemRefs.current.delete(entry);
              }}
              onClick={() => onStepChange(entry)}
              className={cn(
                'text-body-sm relative z-10 min-h-11 rounded-md border px-3',
                step === entry
                  ? 'text-text-primary border-transparent font-medium'
                  : 'border-border-subtle text-text-secondary',
              )}
            >
              {t(`composerWeb.step.${entry === 'variant' ? 'perTarget' : entry}`)}
              <span className="sr-only">
                {t.full('composerWeb.step.progress', {
                  current: index + 1,
                  total: STEPS.length,
                })}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
