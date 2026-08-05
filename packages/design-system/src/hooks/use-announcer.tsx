'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/**
 * Screen-reader announcements.
 *
 * Required by the accessibility bar for save state, validation changes, upload
 * progress, schedule confirmation and publish result. Two regions are mounted
 * once at the app root: a polite region for progress and confirmations, and an
 * assertive region for failures and anything that blocks the user.
 *
 * Announcements carry no styling and are never the only place the information
 * appears. They are a parallel channel, not a substitute for visible state.
 */

export type AnnouncementPoliteness = 'polite' | 'assertive';

export interface AnnouncerContextValue {
  announce: (message: string, politeness?: AnnouncementPoliteness) => void;
  clear: (politeness?: AnnouncementPoliteness) => void;
}

const AnnouncerContext = createContext<AnnouncerContextValue | null>(null);

const visuallyHiddenStyle = {
  position: 'absolute',
  inlineSize: '1px',
  blockSize: '1px',
  margin: '-1px',
  padding: 0,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
} as const;

export interface AnnouncerProviderProps {
  children: ReactNode;
  /**
   * How long a message stays in the region before it is cleared. Clearing lets
   * an identical repeat message (for example a second "Saved") be announced
   * again instead of being treated as unchanged text.
   */
  clearAfterMs?: number;
}

export function AnnouncerProvider({
  children,
  clearAfterMs = 1000,
}: AnnouncerProviderProps): ReactNode {
  const [polite, setPolite] = useState('');
  const [assertive, setAssertive] = useState('');
  const timers = useRef<Record<AnnouncementPoliteness, ReturnType<typeof setTimeout> | null>>({
    polite: null,
    assertive: null,
  });

  const clear = useCallback((politeness?: AnnouncementPoliteness) => {
    if (!politeness || politeness === 'polite') setPolite('');
    if (!politeness || politeness === 'assertive') setAssertive('');
  }, []);

  const announce = useCallback(
    (message: string, politeness: AnnouncementPoliteness = 'polite') => {
      const set = politeness === 'assertive' ? setAssertive : setPolite;
      const pending = timers.current[politeness];
      if (pending) clearTimeout(pending);

      // Blank first so a repeated message still registers as a change.
      set('');
      const raf =
        typeof window !== 'undefined' && window.requestAnimationFrame
          ? window.requestAnimationFrame
          : (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0);
      raf(() => set(message));

      timers.current[politeness] = setTimeout(() => set(''), clearAfterMs);
    },
    [clearAfterMs],
  );

  useEffect(
    () => () => {
      for (const key of ['polite', 'assertive'] as const) {
        const pending = timers.current[key];
        if (pending) clearTimeout(pending);
      }
    },
    [],
  );

  const value = useMemo<AnnouncerContextValue>(() => ({ announce, clear }), [announce, clear]);

  return (
    <AnnouncerContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        data-relay-live-region="polite"
        style={visuallyHiddenStyle}
      >
        {polite}
      </div>
      <div
        aria-live="assertive"
        aria-atomic="true"
        role="alert"
        data-relay-live-region="assertive"
        style={visuallyHiddenStyle}
      >
        {assertive}
      </div>
    </AnnouncerContext.Provider>
  );
}

/**
 * Returns the announcer. Outside a provider it returns a no-op so a component
 * rendered in isolation, in a test, or in an email preview does not crash.
 */
export function useAnnouncer(): AnnouncerContextValue {
  const context = useContext(AnnouncerContext);
  return (
    context ?? {
      announce: () => undefined,
      clear: () => undefined,
    }
  );
}
