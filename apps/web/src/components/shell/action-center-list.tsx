'use client';

import { Link } from '@/components/link';
import { AlertTriangle, Clock, Eye, Sun } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { EmptyState, ErrorState, LoadingState, SkeletonList } from '@relay/design-system/patterns';
import { Button, StatusDot } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { type ApiError, type ActionItemUrgency, type ActionItemView } from '@/lib/api';
import { useSnoozeActionItem } from '@/lib/api/hooks';
import { useFormatters, useTranslations } from '@/lib/i18n';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

import {
  ACTION_KIND_DEFINITIONS,
  formatActionItemValues,
  providerDotKey,
  URGENCY_HINT_KEY,
  URGENCY_LABEL_KEY,
  URGENCY_ORDER,
  URGENCY_SEVERITY_KEY,
} from './action-center-catalog';

const URGENCY_MARK: Readonly<Record<ActionItemUrgency, ReactNode>> = {
  now: <AlertTriangle aria-hidden="true" className="text-destructive-fg size-4" />,
  soon: <Clock aria-hidden="true" className="text-warning-fg size-4" />,
  watching: <Eye aria-hidden="true" className="text-text-tertiary size-4" />,
};

/** How long a resolved row stays on screen, collapsing, before it is gone. */
const RESOLVE_COLLAPSE_MS = 150;

export interface ActionCenterListProps {
  readonly items: readonly ActionItemView[];
  readonly loading: boolean;
  readonly error: ApiError | null;
  readonly onRetry: () => void;
  /** Cap the rows shown. Home uses this; the full queue does not. */
  readonly maxItems?: number;
  readonly showSnooze?: boolean;
  readonly emptyAction?: ReactNode;
}

/**
 * The Action center queue.
 *
 * One list, grouped by urgency, each row ending in one named verb. Rows, not
 * cards: a queue is scanned top to bottom and a card grid destroys that.
 */
export function ActionCenterList({
  items,
  loading,
  error,
  onRetry,
  maxItems,
  showSnooze = true,
  emptyAction,
}: ActionCenterListProps) {
  const t = useTranslations();
  const format = useFormatters();
  const snooze = useSnoozeActionItem();
  const motionOk = useMotionOk();

  const visible = maxItems === undefined ? items : items.slice(0, maxItems);

  // A row that just left `visible` — snoozed, or resolved elsewhere and
  // dropped by the next refetch — gets one more render as a collapsing ghost
  // instead of vanishing outright. Scoped to `showSnooze`: Home's compact
  // list never offers an action that removes a row, so it never needs this,
  // and diffing there would risk collapsing a row for the wrong reason (a
  // background poll reordering the top five).
  const [resolving, setResolving] = useState<readonly ActionItemView[]>([]);
  const previousRef = useRef<Map<string, ActionItemView>>(new Map());
  const visibleSignature = visible.map((item) => item.id).join('|');

  useEffect(() => {
    const currentMap = new Map(visible.map((item) => [item.id, item] as const));
    const justResolved = [...previousRef.current.values()].filter(
      (item) => !currentMap.has(item.id),
    );
    previousRef.current = currentMap;

    if (!showSnooze || justResolved.length === 0 || !motionOk) {
      return;
    }

    setResolving((current) => [...current, ...justResolved]);
    const timer = window.setTimeout(() => {
      setResolving((current) =>
        current.filter((entry) => !justResolved.some((resolved) => resolved.id === entry.id)),
      );
    }, RESOLVE_COLLAPSE_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleSignature, showSnooze]);

  if (loading) {
    return (
      <LoadingState label={t('actionCenter.loading')}>
        <SkeletonList rows={4} />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t('actionCenter.errorTitle')}
        description={t(error.actionKey, error.messageValues)}
        {...(error.retryable ? { onRetry } : {})}
        retryLabel={t('action.retry')}
        {...(error.correlationId === null
          ? {}
          : {
              reference: {
                label: t('shell.feedback.correlationId', { correlationId: error.correlationId }),
                value: error.correlationId,
              },
            })}
      />
    );
  }

  if (items.length === 0 && resolving.length === 0) {
    return (
      <EmptyState
        compact
        illustration={
          // A sun, not a trophy: the honest reading of an empty queue is
          // "nothing needs you right now", not "you achieved zero". The
          // dashed circle matches every other empty-state illustration in
          // the product (`home-screen.tsx`'s own `Coffee`, among others).
          <span className="border-border-strong inline-flex size-12 items-center justify-center rounded-full border-2 border-dashed">
            <Sun aria-hidden="true" className="size-5" />
          </span>
        }
        title={t('actionCenter.empty')}
        description={t('home.needsYou.emptyBody')}
        {...(emptyAction === undefined ? {} : { action: emptyAction })}
      />
    );
  }

  const groups = URGENCY_ORDER.map((urgency) => ({
    urgency,
    rows: visible.filter((item) => item.urgency === urgency),
    ghosts: resolving.filter((item) => item.urgency === urgency),
  })).filter((group) => group.rows.length > 0 || group.ghosts.length > 0);

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <section key={group.urgency} aria-labelledby={`action-group-${group.urgency}`}>
          <div className="flex flex-col gap-0.5 pb-1.5">
            <h3
              id={`action-group-${group.urgency}`}
              className="text-label text-text-tertiary tracking-wide uppercase"
            >
              {t(URGENCY_LABEL_KEY[group.urgency])}
            </h3>
            <p className="text-body-sm text-text-tertiary">{t(URGENCY_HINT_KEY[group.urgency])}</p>
          </div>

          <ul className="border-border-subtle flex flex-col border-t">
            {group.rows.map((item) => {
              const definition = ACTION_KIND_DEFINITIONS[item.kind];
              const dotProvider = providerDotKey(item.provider);

              return (
                <li
                  key={item.id}
                  className={cn(
                    'border-border-subtle flex flex-col gap-2 border-b py-3',
                    'sm:flex-row sm:items-start sm:gap-4',
                    'transition-[translate,border-color] duration-[--duration-fast] ease-[--ease-standard]',
                    'hover:border-accent hover:-translate-y-0.5 motion-reduce:transition-none',
                  )}
                >
                  <span className="mt-0.5 flex shrink-0 items-center gap-1.5">
                    {URGENCY_MARK[item.urgency]}
                    <span className="sr-only">{t(URGENCY_SEVERITY_KEY[item.urgency])}</span>
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="text-body-md text-text-primary">
                      {t(
                        definition.messageKey,
                        formatActionItemValues(item, format, t('common.unavailable')),
                      )}
                    </p>
                    <p className="text-body-sm text-text-tertiary flex flex-wrap items-center gap-1.5">
                      {dotProvider === undefined ? null : (
                        <StatusDot provider={dotProvider} aria-hidden="true" />
                      )}
                      <span>{t('actionCenter.affectedAccount', { account: item.subject })}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={item.createdAt}>{format.relative(item.createdAt)}</time>
                      {item.snoozedUntil === null ? null : (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>
                            {t('actionCenter.snoozedUntil', {
                              date: format.dateTime(item.snoozedUntil),
                            })}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      asChild
                      className="active:scale-[0.97] motion-reduce:active:scale-100"
                    >
                      <Link href={item.href}>{t(definition.actionKey)}</Link>
                    </Button>
                    {showSnooze && item.snoozedUntil === null ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="active:scale-[0.97] motion-reduce:active:scale-100"
                        loading={snooze.isPending && snooze.variables?.itemId === item.id}
                        loadingLabel={t('loading.default')}
                        onClick={() => {
                          snooze.mutate({
                            itemId: item.id,
                            until: new Date(Date.now() + 86_400_000).toISOString(),
                          });
                        }}
                      >
                        {t('actionCenter.snoozeOneDay')}
                      </Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
            {group.ghosts.map((item) => (
              <ResolvingRow key={item.id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * A row that just resolved: collapsed via the CSS `grid-template-rows`
 * 1fr-to-0fr trick (no JS height measurement), the same technique
 * `validation-panel.tsx`'s ghost issue rows use. Only ever rendered when
 * `useMotionOk()` was true at the moment the row left the list — see the
 * effect above — so there is no reduced-motion branch to thread through
 * here.
 */
function ResolvingRow({ item }: { readonly item: ActionItemView }): ReactNode {
  const t = useTranslations();
  const format = useFormatters();
  const definition = ACTION_KIND_DEFINITIONS[item.kind];
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCollapsed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <li
      aria-hidden="true"
      className={cn(
        'grid transition-[grid-template-rows,opacity] duration-[var(--duration-slow)]',
        'ease-[var(--ease-standard)]',
        collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
      )}
    >
      <span className="overflow-hidden">
        <span className="text-body-sm text-text-tertiary flex min-h-11 items-center gap-2 py-3 line-through">
          {t(
            definition.messageKey,
            formatActionItemValues(item, format, t('common.unavailable')),
          )}
        </span>
      </span>
    </li>
  );
}
