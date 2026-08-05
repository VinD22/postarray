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
import { summarizeTargets, totalsFor, type DraftTotals, type MediaLookup } from './state/selectors';
import type {
  AssistProposal,
  AutosaveState,
  ComposerBootstrap,
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
  readonly saveNow: () => void;
  readonly proposal: AssistProposal | null;
  readonly setProposal: (proposal: AssistProposal | null) => void;
  readonly acceptProposal: () => void;
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
  readonly onSave: (state: ComposerState) => Promise<void>;
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
  const [proposal, setProposal] = useState<AssistProposal | null>(null);
  const [online, setOnline] = useState(true);
  const lastSavedRevision = useRef(0);
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

  const persist = useCallback(
    async (next: ComposerState) => {
      const revision = next.revision;
      setAutosave('saving');
      announce(t.full('a11y.announce.saving'), 'polite');
      try {
        await onSave(next);
        lastSavedRevision.current = revision;
        setSavedAt(new Date().toISOString());
        setAutosave('saved');
        announce(t.full('a11y.announce.saved'), 'polite');
      } catch {
        setAutosave('failed');
        announce(t.full('a11y.announce.saveFailed'), 'assertive');
      }
    },
    [announce, onSave, t],
  );

  // Debounced autosave. Nothing here can discard text: the state is the source
  // of truth and a failed save leaves it exactly where it was.
  useEffect(() => {
    if (state.revision === lastSavedRevision.current) {
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
      void persist(state);
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
    void persist(state);
  }, [persist, state]);

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

  const acceptProposal = useCallback(() => {
    if (!proposal) {
      return;
    }
    if (proposal.connectionId === null) {
      dispatch({ type: 'master/patch', patch: { body: proposal.after } });
    } else {
      dispatch({
        type: 'variant/override',
        connectionId: proposal.connectionId,
        field: 'body',
        value: proposal.after,
      });
    }
    setProposal(null);
    announce(t.full('a11y.announce.suggestionApplied'), 'polite');
  }, [announce, dispatch, proposal, t]);

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
      proposal,
      setProposal,
      acceptProposal,
    }),
    [
      acceptProposal,
      autosave,
      bootstrap,
      conflict,
      dispatch,
      online,
      proposal,
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
