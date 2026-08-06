'use client';

/**
 * The calendar and queue screen.
 *
 * Responsibilities, in the order they matter:
 *
 *  1. Hold the view, the anchor date and the filters in the URL.
 *  2. Load exactly the visible window and filter it on the client.
 *  3. Render every state the specification requires, not just the happy one:
 *     loading, empty, empty-because-filtered, error, offline, permission
 *     denied and rate limited each have their own shape here.
 *  4. Offer a complete keyboard path for rescheduling, so no operation on this
 *     screen is drag-only.
 *  5. Keep work that needs a person visible above the grid until it is done.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CalendarPlus } from 'lucide-react';
import {
  Button,
  EmptyState,
  ErrorState,
  Kbd,
  LoadingState,
  Notice,
  OfflineBanner,
  PageHeader,
  PermissionDenied,
  RateLimitNotice,
  SkeletonList,
  SkeletonTable,
  useAnnouncer,
  useBreakpoint,
  useHotkeys,
} from '@relay/design-system';
import { useI18n, useTranslations } from '@relay/i18n/react';
import { ApiError } from '@/lib/api/error';
import { CalendarAgenda } from './calendar-agenda';
import { CalendarGrid } from './calendar-grid';
import { CalendarMonth } from './calendar-month';
import { CalendarTable } from './calendar-table';
import { CalendarToolbar } from './calendar-toolbar';
import { CalendarViewTransition } from './calendar-view-transition';
import { AttentionBar } from './attention-bar';
import { EntryDetailSheet } from './entry-detail-sheet';
import { RescheduleDialog } from './reschedule-dialog';
import { computeRange, stepAnchor } from './date-range';
import { useCalendarFormat } from './format';
import {
  applyFilters,
  countActiveFilters,
  entryKey,
  formatAnchor,
  needsAttention,
  parseAnchor,
  parseFilters,
  parseView,
  toSearchParams,
} from './filters';
import { buildProposal, collectWarnings, keyboardStep, KEYBOARD_STEP_MINUTES } from './reschedule';
import { useCalendarEntries, useRescheduleEntry } from './use-calendar';
import { EMPTY_FILTERS } from './types';
import type {
  CalendarEntry,
  CalendarFilterOptions,
  CalendarView,
  PublishedMoveMode,
  RescheduleProposal,
} from './types';

export interface CalendarScreenProps {
  /** Route for the composer, used by the empty state and the header action. */
  composeHref: string;
  actionCenterHref: string;
  /** Route pattern for one post. `{id}` is replaced with the content item id. */
  postHrefPattern: string;
  /**
   * Named brands and customer groups from the session. Passed in rather than
   * derived from the entries, because deriving them would mean showing an
   * identifier where a person expects a name.
   */
  brands?: readonly { readonly id: string; readonly name: string }[];
  customerGroups?: readonly { readonly id: string; readonly name: string }[];
}

export function CalendarScreen({
  composeHref,
  actionCenterHref,
  postHrefPattern,
  brands = [],
  customerGroups = [],
}: CalendarScreenProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const { direction } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { announce } = useAnnouncer();

  // Week on a real screen, agenda on a phone. Both are honest defaults rather
  // than one layout squeezed: the agenda is how a schedule is read on a phone.
  const isWide = useBreakpoint('md');
  const defaultView: CalendarView = isWide ? 'week' : 'list';

  const view = parseView(searchParams, defaultView);
  const anchor = useMemo(() => parseAnchor(searchParams, new Date()), [searchParams]);
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const range = useMemo(
    () => computeRange(view, anchor, format.timeZone, format.weekStartsOn),
    [view, anchor, format.timeZone, format.weekStartsOn],
  );

  const query = useCalendarEntries({
    from: range.start,
    to: range.end,
    brandId: filters.brandId,
  });

  // Recompute the derived list only when the fetched page or the filters
  // change, not on every render of a screen that also holds dialog state.

  const allEntries = useMemo(
    () => (query.data?.data ?? []) as readonly CalendarEntry[],
    [query.data],
  );
  const entries = useMemo(() => applyFilters(allEntries, filters), [allEntries, filters]);
  const attentionCount = useMemo(() => allEntries.filter(needsAttention).length, [allEntries]);

  const options = useMemo(
    () => buildFilterOptions(allEntries, brands, customerGroups),
    [allEntries, brands, customerGroups],
  );

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [detailEntry, setDetailEntry] = useState<CalendarEntry | null>(null);
  const [grabbed, setGrabbed] = useState<CalendarEntry | null>(null);
  const [proposal, setProposal] = useState<RescheduleProposal | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const reschedule = useRescheduleEntry();

  const navigate = useCallback(
    (next: { view?: CalendarView; anchor?: Date; filters?: typeof filters }) => {
      const params = toSearchParams(
        next.view ?? view,
        next.anchor ?? anchor,
        next.filters ?? filters,
        defaultView,
      );
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, view, anchor, filters, defaultView],
  );

  /* --------------------------------------------------------------------
     Keyboard rescheduling.

     Pick a post up with the Move control or the M key, step it with the
     arrows, confirm with Enter, put it back with Escape. Every step is
     announced, because the visual change is a highlight a screen reader
     cannot see.
     ------------------------------------------------------------------ */

  const beginMove = useCallback(
    (entry: CalendarEntry) => {
      setGrabbed(entry);
      setProposal(buildProposal({ entry, timeZone: format.timeZone }));
      announce(
        t('web.calendar.keyboard.grabbed', {
          title: entry.title.trim() || t('web.calendar.entry.untitled'),
          from: format.dateTime(entry.scheduledAt),
        }),
      );
    },
    [announce, format, t],
  );

  const cancelMove = useCallback(() => {
    if (grabbed) {
      announce(
        t('web.calendar.keyboard.released', {
          title: grabbed.title.trim() || t('web.calendar.entry.untitled'),
          from: format.dateTime(grabbed.scheduledAt),
        }),
      );
    }
    setGrabbed(null);
    setProposal(null);
  }, [announce, format, grabbed, t]);

  useEffect(() => {
    if (!grabbed || dialogOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        cancelMove();
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        setDialogOpen(true);
        return;
      }
      const step = keyboardStep(event.key, view, direction);
      if (!step) return;
      event.preventDefault();
      setProposal((current) => {
        const base = current ?? buildProposal({ entry: grabbed, timeZone: format.timeZone });
        const next = buildProposal({
          entry: { ...grabbed, scheduledAt: base.toInstant },
          timeZone: format.timeZone,
          ...step,
        });
        const merged: RescheduleProposal = {
          entry: grabbed,
          fromInstant: grabbed.scheduledAt,
          toInstant: next.toInstant,
          keepsLocalTime: next.keepsLocalTime,
        };
        announce(t('web.calendar.keyboard.moved', { to: format.dateTime(merged.toInstant) }));
        return merged;
      });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [grabbed, dialogOpen, view, format, direction, announce, cancelMove, t]);

  useHotkeys(
    {
      m: () => {
        const focused = document.activeElement?.closest('article[data-entry-key]');
        const key = focused?.getAttribute('data-entry-key');
        const entry = entries.find((candidate) => entryKey(candidate) === key);
        if (entry) beginMove(entry);
      },
    },
    { enabled: !dialogOpen },
  );

  const warnings = useMemo(() => {
    if (!proposal) return [];
    const siblings = allEntries.filter(
      (candidate) => candidate.contentItemId !== proposal.entry.contentItemId,
    );
    return collectWarnings({
      proposal,
      timeZone: format.timeZone,
      siblingEntries: siblings,
      now: new Date(),
    });
  }, [proposal, allEntries, format.timeZone]);

  const openRescheduleFor = useCallback(
    (entry: CalendarEntry) => {
      setGrabbed(entry);
      setProposal(buildProposal({ entry, days: 1, timeZone: format.timeZone }));
      setDialogOpen(true);
    },
    [format.timeZone],
  );

  const confirmReschedule = useCallback(
    (confirmed: RescheduleProposal, mode: PublishedMoveMode | null) => {
      reschedule.mutate(
        {
          entry: confirmed.entry,
          toInstant: confirmed.toInstant,
          timeZone: format.timeZone,
          publishedMode: mode,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setGrabbed(null);
            setProposal(null);
          },
        },
      );
    },
    [reschedule, format.timeZone],
  );

  const hrefForEntry = useCallback(
    (entry: CalendarEntry) => postHrefPattern.replace('{id}', entry.contentItemId),
    [postHrefPattern],
  );
  // The receipt lives on the post page. A post with no publish job has no
  // receipt yet, and linking to one that does not exist is worse than no link.
  const hrefForReceipt = useCallback(
    (entry: CalendarEntry) =>
      entry.publishJobId ? `${postHrefPattern.replace('{id}', entry.contentItemId)}#receipt` : null,
    [postHrefPattern],
  );
  const hrefForDay = useCallback(
    (day: Date) => {
      const params = toSearchParams('day', day, filters, defaultView);
      return `${pathname}?${params.toString()}`;
    },
    [pathname, filters, defaultView],
  );

  const rangeLabel = useMemo(() => {
    if (view === 'day') return format.date(range.start, 'full');
    if (view === 'month') {
      return new Intl.DateTimeFormat(format.locale, {
        month: 'long',
        year: 'numeric',
        timeZone: format.timeZone,
      }).format(range.start);
    }
    const last = range.days[range.days.length - 1] ?? range.start;
    return t('web.calendar.range.week', {
      start: format.date(range.start, 'medium'),
      end: format.date(last, 'medium'),
    });
  }, [view, range, format, t]);

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title={t('calendar.title')}
        description={t('web.calendar.description')}
        actions={
          <Button
            variant="primary"
            asChild
            iconStart={<CalendarPlus aria-hidden="true" className="size-4" />}
          >
            <a href={composeHref}>{t('empty.calendar.action')}</a>
          </Button>
        }
        toolbar={
          <CalendarToolbar
            view={view}
            onViewChange={(next) => navigate({ view: next })}
            rangeLabel={rangeLabel}
            onStep={(direction) =>
              navigate({ anchor: stepAnchor(view, anchor, direction, format.timeZone) })
            }
            onToday={() => navigate({ anchor: new Date() })}
            anchorIso={formatAnchor(anchor)}
            onAnchorChange={(isoDate) => {
              const next = new Date(`${isoDate}T12:00:00.000Z`);
              if (!Number.isNaN(next.getTime())) navigate({ anchor: next });
            }}
            filters={filters}
            onFiltersChange={(next) => navigate({ filters: next })}
            options={options}
            resultCount={entries.length}
            filterSheetOpen={filterSheetOpen}
            onFilterSheetOpenChange={setFilterSheetOpen}
          />
        }
      />

      <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:px-6">
        {grabbed ? (
          <Notice
            tone="info"
            liveness="status"
            title={t('web.calendar.keyboard.title')}
            description={
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{t('web.calendar.keyboard.body')}</span>
                <span className="inline-flex items-center gap-1">
                  <Kbd keys="enter" />
                  <Kbd keys="escape" />
                </span>
                <span>
                  {t('web.calendar.keyboard.stepMinutes', {
                    minutes: KEYBOARD_STEP_MINUTES,
                  })}
                </span>
              </span>
            }
            actions={
              <Button variant="secondary" size="sm" onClick={cancelMove}>
                {t('action.cancel')}
              </Button>
            }
          />
        ) : null}

        <CalendarBody
          query={query}
          view={view}
          entries={entries}
          allEntryCount={allEntries.length}
          range={range}
          rangeLabel={rangeLabel}
          composeHref={composeHref}
          actionCenterHref={actionCenterHref}
          attentionCount={attentionCount}
          filtersActive={countActiveFilters(filters) > 0}
          grabbedKey={grabbed ? entryKey(grabbed) : null}
          proposal={grabbed ? proposal : null}
          onPickUp={beginMove}
          onReschedule={openRescheduleFor}
          onOpenDetail={setDetailEntry}
          onShowOnlyAttention={() => navigate({ filters: { ...filters, attentionOnly: true } })}
          onClearFilters={() => navigate({ filters: EMPTY_FILTERS })}
          hrefForEntry={hrefForEntry}
          hrefForReceipt={hrefForReceipt}
          hrefForDay={hrefForDay}
          showingOnlyAttention={filters.attentionOnly}
        />
      </div>

      <RescheduleDialog
        proposal={proposal}
        warnings={warnings}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open && grabbed) cancelMove();
        }}
        submitting={reschedule.isPending}
        onConfirm={confirmReschedule}
      />

      <EntryDetailSheet
        entry={detailEntry}
        open={detailEntry !== null}
        onOpenChange={(open) => {
          if (!open) setDetailEntry(null);
        }}
        hrefForEntry={hrefForEntry}
        hrefForReceipt={hrefForReceipt}
        onReschedule={openRescheduleFor}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------
   Every state this screen can be in.
   ------------------------------------------------------------------------- */

interface CalendarBodyProps {
  query: ReturnType<typeof useCalendarEntries>;
  view: CalendarView;
  entries: readonly CalendarEntry[];
  allEntryCount: number;
  range: ReturnType<typeof computeRange>;
  rangeLabel: string;
  composeHref: string;
  actionCenterHref: string;
  attentionCount: number;
  filtersActive: boolean;
  grabbedKey: string | null;
  proposal: RescheduleProposal | null;
  onPickUp: (entry: CalendarEntry) => void;
  onReschedule: (entry: CalendarEntry) => void;
  onOpenDetail: (entry: CalendarEntry) => void;
  onShowOnlyAttention: () => void;
  onClearFilters: () => void;
  hrefForEntry: (entry: CalendarEntry) => string;
  hrefForReceipt: (entry: CalendarEntry) => string | null;
  hrefForDay: (day: Date) => string;
  showingOnlyAttention: boolean;
}

function CalendarBody(props: CalendarBodyProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const { direction } = useI18n();
  const { query, view } = props;

  // Which way the visible range moved since the last render, for the period
  // step slide below. `null` on the first render and on a view switch, both
  // of which play a plain crossfade instead of a directional slide. Reading
  // and writing a ref during render (rather than in an effect) is what lets
  // this be ready in time for the transition's own first effect, with no
  // extra render in between.
  const previousRef = useRef<{ view: CalendarView; startMs: number } | null>(null);
  const previous = previousRef.current;
  const startMs = props.range.start.getTime();
  const stepDirection: -1 | 0 | 1 =
    previous && previous.view === view ? (Math.sign(startMs - previous.startMs) as -1 | 0 | 1) : 0;
  previousRef.current = { view, startMs };

  if (query.isPending) {
    return (
      <LoadingState label={t('loading.calendar')}>
        {view === 'list' ? <SkeletonTable rows={8} columns={6} /> : <SkeletonList rows={6} />}
      </LoadingState>
    );
  }

  if (query.isError) {
    const error = ApiError.is(query.error) ? query.error : null;

    if (error?.isOffline) {
      return (
        <OfflineBanner
          title={t('web.calendar.offline.title')}
          description={t('web.calendar.offline.body')}
          actions={
            <Button variant="secondary" size="sm" onClick={() => void query.refetch()}>
              {t('action.refresh')}
            </Button>
          }
        />
      );
    }

    if (error?.isAuthorization) {
      return (
        <PermissionDenied
          title={t('web.calendar.permission.title')}
          description={t('web.calendar.permission.body')}
          requirementsLabel={t('web.calendar.permission.requirementsLabel')}
          contact={t('permission.denied.contactOwner', {
            owner: String(error.details.owner ?? t('common.unknown')),
          })}
        />
      );
    }

    if (error?.isRateLimited) {
      return (
        <RateLimitNotice
          title={t('rateLimit.title')}
          cause={t('web.calendar.rateLimited.cause')}
          resetLabel={t('web.calendar.rateLimited.resetLabel')}
          resetAt={
            error.retryAfterSeconds === null
              ? t('common.unavailable')
              : format.duration(error.retryAfterSeconds * 1000)
          }
          alternative={t('rateLimit.cheaperAlternative')}
          actions={
            <Button variant="secondary" size="sm" onClick={() => void query.refetch()}>
              {t('action.retry')}
            </Button>
          }
        />
      );
    }

    return (
      <ErrorState
        title={t('web.calendar.error.title')}
        description={t('web.calendar.error.body')}
        onRetry={() => void query.refetch()}
        retryLabel={t('web.calendar.error.retry')}
        retrying={query.isFetching}
        {...(error?.correlationId
          ? { reference: { label: t('receipt.correlationId'), value: error.correlationId } }
          : {})}
      />
    );
  }

  if (props.entries.length === 0) {
    if (props.filtersActive || props.allEntryCount > 0) {
      return (
        <EmptyState
          title={t('empty.filtered.title')}
          description={t('web.calendar.emptyFiltered.body', { range: props.rangeLabel })}
          action={
            <Button variant="secondary" onClick={props.onClearFilters}>
              {t('empty.filtered.action')}
            </Button>
          }
        />
      );
    }
    return (
      <EmptyState
        title={t('empty.calendar.title')}
        description={t('empty.calendar.body')}
        example={t('web.calendar.empty.example')}
        illustration={
          <span className="border-border-strong inline-flex size-12 items-center justify-center rounded-full border-2 border-dashed">
            <CalendarPlus aria-hidden="true" className="size-5" />
          </span>
        }
        action={
          <Button
            variant="cta"
            asChild
            iconStart={<CalendarPlus aria-hidden="true" className="size-4" />}
          >
            <a href={props.composeHref}>{t('empty.calendar.action')}</a>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <AttentionBar
        count={props.attentionCount}
        actionCenterHref={props.actionCenterHref}
        showingOnlyAttention={props.showingOnlyAttention}
        onShowOnlyAttention={props.onShowOnlyAttention}
      />

      <CalendarViewTransition
        transitionKey={`${view}:${startMs}`}
        direction={stepDirection}
        isRtl={direction === 'rtl'}
      >
        {view === 'list' ? (
          <CalendarTable
            entries={props.entries}
            rangeLabel={props.rangeLabel}
            hrefForEntry={props.hrefForEntry}
            hrefForReceipt={props.hrefForReceipt}
            onReschedule={props.onReschedule}
            onOpenDetail={props.onOpenDetail}
          />
        ) : view === 'month' ? (
          <CalendarMonth
            range={props.range}
            entries={props.entries}
            timeZone={format.timeZone}
            hrefForEntry={props.hrefForEntry}
            hrefForDay={props.hrefForDay}
            label={t('web.calendar.month.label', { month: props.rangeLabel })}
          />
        ) : (
          <>
            {/* The grid on a real screen, the agenda on a phone. Both render, one
                is hidden, so no layout shift when the media query settles. */}
            <div className="hidden md:block">
              <CalendarGrid
                range={props.range}
                entries={props.entries}
                timeZone={format.timeZone}
                hrefForEntry={props.hrefForEntry}
                grabbedKey={props.grabbedKey}
                onPickUp={props.onPickUp}
                proposal={props.proposal}
                label={t('web.calendar.grid.label', { range: props.rangeLabel })}
              />
            </div>
            <div className="md:hidden">
              <CalendarAgenda
                range={props.range}
                entries={props.entries}
                timeZone={format.timeZone}
                hrefForEntry={props.hrefForEntry}
                grabbedKey={props.grabbedKey}
                onPickUp={props.onPickUp}
                proposal={props.proposal}
                label={t('web.calendar.agenda.label', { range: props.rangeLabel })}
              />
            </div>
          </>
        )}
      </CalendarViewTransition>
    </>
  );
}

/** Filter choices, built from what is actually in the window. Never invented. */
function buildFilterOptions(
  entries: readonly CalendarEntry[],
  brands: readonly { readonly id: string; readonly name: string }[],
  customerGroups: readonly { readonly id: string; readonly name: string }[],
): CalendarFilterOptions {
  const connections = new Map<
    string,
    { id: string; label: string; provider: CalendarEntry['provider'] }
  >();
  const providers = new Set<CalendarEntry['provider']>();
  const locales = new Set<string>();
  const campaigns = new Set<string>();
  const usedGroupIds = new Set<string>();

  for (const entry of entries) {
    if (entry.connectionId) {
      connections.set(entry.connectionId, {
        id: entry.connectionId,
        label: entry.accountLabel,
        provider: entry.provider,
      });
    }
    providers.add(entry.provider);
    if (entry.contentLocale) locales.add(entry.contentLocale);
    if (entry.campaignName) campaigns.add(entry.campaignName);
    if (entry.customerGroupId) usedGroupIds.add(entry.customerGroupId);
  }

  return {
    brands,
    connections: [...connections.values()],
    providers: [...providers],
    locales: [...locales].sort(),
    campaigns: [...campaigns].sort(),
    // Only groups that actually have something in this window, so the select
    // does not offer a choice that can only ever return nothing.
    customerGroups: customerGroups.filter((group) => usedGroupIds.has(group.id)),
  };
}
