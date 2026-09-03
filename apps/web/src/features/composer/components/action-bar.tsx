'use client';

/**
 * The composer's action bar: sticky at every width.
 *
 * The primary action used to live at the bottom of the review column, which
 * scrolls. On a 1280px screen with a few targets open, "Schedule" was below the
 * fold, so the last step of writing a post was to go looking for the button.
 * The mobile layout already had a persistent bar; this is that idea at every
 * width, and it is the only vermilion on the screen.
 *
 * It never covers the last field. The bar reports its own height into
 * `--composer-action-bar-size` on the composer root, and the scrolling column
 * reserves exactly that much padding, so the reservation stays right when the
 * bar wraps to two lines on a narrow screen.
 *
 * No motion here at all. The label swaps between "Schedule" and "Publish now"
 * the instant the schedule changes: a bar that animates under the cursor while
 * somebody is deciding whether to publish is a bar that gets misclicked.
 */

import { useEffect, type ReactNode, type RefObject } from 'react';
import { Badge, Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { formatDateTime } from '@relay/i18n';
import { cn } from '@relay/design-system/utils';

import { useComposer } from '../composer-context';

export interface ActionBarProps {
  /** Opens the schedule sheet, which is where a commit is confirmed. */
  readonly onCommit: () => void;
  /** Reveals the validation panel and moves to it. */
  readonly onShowIssues: () => void;
  readonly barRef?: RefObject<HTMLDivElement | null>;
}

export function ActionBar({ onCommit, onShowIssues, barRef }: ActionBarProps): ReactNode {
  const t = useTranslations();
  const { bootstrap, state, totals, autosave, saveNow, online } = useComposer();
  const schedule = state.master.schedule;
  const scheduled = schedule !== null;

  return (
    <div
      ref={barRef}
      role="toolbar"
      aria-label={t.full('composerWeb.actionBar.label')}
      className={cn(
        'sticky bottom-0 z-(--z-index-sticky) flex flex-wrap items-center gap-x-4 gap-y-2',
        'bg-surface-raised border-border-bold shadow-hard border-t-2 px-4 py-2.5',
        'pb-[max(0.625rem,env(safe-area-inset-bottom))]',
      )}
    >
      {autosave === 'saved' ? (
        <Badge tone="accent">{t.full('composerWeb.savedFlash')}</Badge>
      ) : (
        <span className="text-label text-text-secondary">
          {autosave === 'saving' ? t.full('composer.autosave.saving') : null}
          {autosave === 'offline' ? t.full('composer.autosave.offline') : null}
          {autosave === 'failed' ? t.full('composer.autosave.failed') : null}
        </span>
      )}

      {totals.issueCount > 0 ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onShowIssues}
          className={totals.blockedCount > 0 ? 'text-destructive-fg' : 'text-warning-fg'}
        >
          {t.full('composerWeb.actionBar.toFix', { count: totals.issueCount })}
        </Button>
      ) : null}

      <span className="text-label text-text-secondary tabular-nums">
        {t.full('composerWeb.summary.targets', { count: totals.targetCount })}
      </span>

      <span className="text-label text-text-secondary tabular-nums">
        {schedule === null
          ? t.full('composerWeb.summary.notScheduled')
          : t.full('composerWeb.summary.scheduledFor', {
              time: formatDateTime(t.locale, schedule.instant, {
                timeZone: schedule.ianaTimeZone ?? bootstrap.workspaceTimeZone,
                dateStyle: 'short',
                timeStyle: 'short',
              }),
            })}
      </span>

      <div className="ms-auto flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="md" className="scroll-mb-24" onClick={() => void saveNow()}>
          {t.full('action.saveDraft')}
        </Button>
        <Button
          variant="primary"
          size="md"
          className="scroll-mb-24"
          disabled={!online}
          onClick={onCommit}
        >
          {scheduled ? t.full('action.schedule') : t.full('action.publishNow')}
        </Button>
      </div>
    </div>
  );
}

/** How much room the bar needs, before it has been measured. */
const FALLBACK_RESERVE = '4rem';

/**
 * Reserve the bar's height on the composer root.
 *
 * A sticky element sits in the flow but content still scrolls underneath it
 * while it is stuck, so the column it sticks inside has to end that much
 * earlier. Measuring rather than hard coding is what keeps the reservation
 * correct when the bar wraps, which it does at 360px and in a locale with
 * longer labels.
 */
export function useActionBarReserve(
  rootRef: RefObject<HTMLElement | null>,
  barRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const root = rootRef.current;
    const bar = barRef.current;
    if (!root || !bar) {
      return;
    }
    const apply = (): void => {
      root.style.setProperty('--composer-action-bar-size', `${bar.offsetHeight}px`);
    };
    apply();
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(apply);
    observer.observe(bar);
    return () => {
      observer.disconnect();
    };
  }, [barRef, rootRef]);
}

export { FALLBACK_RESERVE as ACTION_BAR_FALLBACK_RESERVE };
