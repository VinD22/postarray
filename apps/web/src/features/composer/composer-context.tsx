'use client';

/**
 * One context holds the draft, the derived summaries and the autosave state.
 *
 * Everything below it is a presentational component that reads what it needs.
 * The reducer is the single writer, so no panel can invent a divergent copy of
 * the draft and no edit can leak from one target to another.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';
import type { ValidationIssue } from '@relay/contracts';

import { composerReducer, type ComposerAction } from './state/composer-reducer';
import { findUrls } from './state/capability-rules';
import { initialComposerState } from './state/seed';
import {
  hasMeaningfulEdit,
  summarizeTargets,
  totalsFor,
  type DraftTotals,
  type MediaLookup,
} from './state/selectors';
import { isUnsavedDraft } from './types';
import type {
  AutosaveState,
  ComposerBootstrap,
  ComposerSaveOutcome,
  ComposerState,
  ConflictInfo,
  TargetSummary,
} from './types';

export interface ComposerContextValue {
  readonly bootstrap: ComposerBootstrap;
  readonly state: ComposerState;
  readonly dispatch: (action: ComposerAction) => void;
  readonly runAll: (actions: readonly ComposerAction[]) => void;
  readonly summaries: readonly TargetSummary[];
  readonly totals: DraftTotals;
  readonly autosave: AutosaveState;
  readonly savedAt: string | null;
  readonly conflict: ConflictInfo | null;
  readonly resolveConflict: (keep: 'mine' | 'theirs') => void;
  readonly online: boolean;
  /** Saves now and resolves with the content item id, creating it if needed. */
  readonly saveNow: () => Promise<string>;
  /** Targets whose last variant write was rejected. They retry on the next save. */
  readonly failedTargetConnectionIds: readonly string[];
}

const ComposerContext = createContext<ComposerContextValue | null>(null);

export function useComposer(): ComposerContextValue {
  const value = useContext(ComposerContext);
  if (!value) {
    throw new Error('useComposer must be used inside ComposerProvider');
  }
  return value;
}

export interface ComposerProviderProps {
  readonly bootstrap: ComposerBootstrap;
  readonly media: MediaLookup;
  readonly approvalRequired: boolean;
  readonly serverIssues?: readonly ValidationIssue[];
  /** Persists the draft. Rejecting marks the header failed and keeps the text. */
  readonly onSave: (state: ComposerState) => Promise<ComposerSaveOutcome>;
  readonly children: ReactNode;
}

const AUTOSAVE_DELAY_MS = 800;
const NO_SERVER_ISSUES: readonly ValidationIssue[] = [];

export function ComposerProvider({
  bootstrap,
  media,
  approvalRequired,
  serverIssues = NO_SERVER_ISSUES,
  onSave,
  children,
}: ComposerProviderProps): ReactNode {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const [state, rawDispatch] = useReducer(composerReducer, bootstrap, initialComposerState);
  const [autosave, setAutosave] = useState<AutosaveState>('idle');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [conflict, setConflict] = useState<ConflictInfo | null>(null);
  const [online, setOnline] = useState(true);
  const [failedTargetConnectionIds, setFailedTargets] = useState<readonly string[]>([]);
  const lastSavedRevision = useRef(0);
  // A save reads the draft when it runs, not when it was asked for, so a
  // coalesced round writes the latest text rather than the text of the
  // keystroke that scheduled it.
  const stateRef = useRef(state);
  stateRef.current = state;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispatch = useCallback((action: ComposerAction) => {
    rawDispatch(action);
  }, []);

  const runAll = useCallback((actions: readonly ComposerAction[]) => {
    for (const action of actions) {
      rawDispatch(action);
    }
  }, []);

  // Keep the link list in step with the URLs actually present in the master.
  useEffect(() => {
    const urls = findUrls(state.master.body);
    dispatch({ type: 'links/sync', urls });
  }, [dispatch, state.master.body]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const update = (): void => {
      const next = window.navigator.onLine;
      setOnline(next);
      announce(next ? t.full('a11y.announce.online') : t.full('a11y.announce.offline'), 'polite');
    };
    setOnline(window.navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, [announce, t]);

  /*
   * Saves are coalesced, never stacked.
   *
   * At most one save is in flight and at most one is waiting behind it. Every
   * request that arrives while a save is running joins that single follow-up
   * round, so holding a key down cannot queue thirty writes of the same draft.
   */
  const runningSave = useRef<Promise<string> | null>(null);
  const queuedSave = useRef<Promise<string> | null>(null);

  const runSave = useCallback(async (): Promise<string> => {
    const next = stateRef.current;
    const revision = next.revision;
    setAutosave('saving');
    announce(t.full('a11y.announce.saving'), 'polite');
    try {
      const outcome = await onSave(next);
      lastSavedRevision.current = revision;
      if (next.master.id !== outcome.contentItemId) {
        dispatch({ type: 'master/assign-id', contentItemId: outcome.contentItemId });
      }
      dispatch({ type: 'save/settled', savedConnectionIds: outcome.savedConnectionIds });
      setFailedTargets(outcome.failedConnectionIds);
      setSavedAt(outcome.savedAt);
      // A round where one target was rejected is not a save that worked. The
      // header says failed, and that target is still dirty, so the next edit
      // writes it again.
      setAutosave(outcome.failedConnectionIds.length > 0 ? 'failed' : 'saved');
      announce(
        outcome.failedConnectionIds.length > 0
          ? t.full('a11y.announce.saveFailed')
          : t.full('a11y.announce.saved'),
        outcome.failedConnectionIds.length > 0 ? 'assertive' : 'polite',
      );
      return outcome.contentItemId;
    } catch (error) {
      setAutosave('failed');
      announce(t.full('a11y.announce.saveFailed'), 'assertive');
      throw error;
    }
  }, [announce, dispatch, onSave, t]);

  const persist = useCallback((): Promise<string> => {
    if (runningSave.current === null) {
      const started = runSave().finally(() => {
        runningSave.current = null;
      });
      runningSave.current = started;
      return started;
    }
    if (queuedSave.current === null) {
      const queued = runningSave.current
        .catch(() => undefined)
        .then(() => {
          queuedSave.current = null;
          const started = runSave().finally(() => {
            runningSave.current = null;
          });
          runningSave.current = started;
          return started;
        });
      queuedSave.current = queued;
      return queued;
    }
    return queuedSave.current;
  }, [runSave]);

  // Debounced autosave. Nothing here can discard text: the state is the source
  // of truth and a failed save leaves it exactly where it was.
  useEffect(() => {
    if (state.revision === lastSavedRevision.current) {
      return;
    }
    // Nothing is created for a visit. Until this draft has content of its own,
    // there is nothing to write and no row to write it to.
    if (isUnsavedDraft(state.master) && !hasMeaningfulEdit(state)) {
      return;
    }
    if (!online) {
      setAutosave('offline');
      return;
    }
    if (timer.current !== null) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      void persist().catch(() => undefined);
    }, AUTOSAVE_DELAY_MS);
    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
    };
  }, [online, persist, state]);

  const saveNow = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
    }
    return persist();
  }, [persist]);

  const resolveConflict = useCallback(
    (keep: 'mine' | 'theirs') => {
      if (keep === 'theirs' && conflict) {
        dispatch({ type: 'master/patch', patch: { body: conflict.theirBody } });
      }
      setConflict(null);
      setAutosave('idle');
    },
    [conflict, dispatch],
  );

  const summaries = useMemo(
    () =>
      summarizeTargets({
        state,
        accounts: bootstrap.accounts,
        media,
        approvalRequired,
        serverIssues,
      }),
    [approvalRequired, bootstrap.accounts, media, serverIssues, state],
  );

  const totals = useMemo(() => totalsFor(summaries), [summaries]);

  // Announce the issue count whenever it moves, never on every keystroke.
  const lastIssueCount = useRef(totals.issueCount);
  useEffect(() => {
    if (lastIssueCount.current === totals.issueCount) {
      return;
    }
    lastIssueCount.current = totals.issueCount;
    announce(
      totals.issueCount === 0
        ? t.full('a11y.announce.validationCleared')
        : t.full('a11y.announce.validationCount', { count: totals.issueCount }),
      'polite',
    );
  }, [announce, t, totals.issueCount]);

  const value = useMemo<ComposerContextValue>(
    () => ({
      bootstrap,
      state,
      dispatch,
      runAll,
      summaries,
      totals,
      autosave: conflict ? 'conflict' : autosave,
      savedAt,
      conflict,
      resolveConflict,
      online,
      saveNow,
      failedTargetConnectionIds,
    }),
    [
      autosave,
      bootstrap,
      conflict,
      dispatch,
      failedTargetConnectionIds,
      online,
      resolveConflict,
      runAll,
      savedAt,
      saveNow,
      state,
      summaries,
      totals,
    ],
  );

  return <ComposerContext.Provider value={value}>{children}</ComposerContext.Provider>;
}

/** The account currently open in the centre pane, or null for the master. */
export function useActiveTarget(): TargetSummary | null {
  const { state, summaries } = useComposer();
  return summaries.find((summary) => summary.connectionId === state.activeConnectionId) ?? null;
}
