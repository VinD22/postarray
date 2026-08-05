'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

/** The key the bootstrap script and the React runtime agree on. */
export const THEME_STORAGE_KEY = 'relay.theme';

const MEDIA = '(prefers-color-scheme: dark)';

function isPreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(raw) ? raw : 'system';
  } catch {
    // Private browsing or a blocked storage partition. System is a safe answer.
    return 'system';
  }
}

function systemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia(MEDIA).matches ? 'dark' : 'light';
}

function applyTheme(preference: ThemePreference): ResolvedTheme {
  const resolved = preference === 'system' ? systemTheme() : preference;
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);
  root.style.colorScheme = resolved;
  return resolved;
}

/**
 * The inline bootstrap script, as a string of first-party JavaScript.
 *
 * Inject it as the first `<script>` inside `<head>` so it runs before first
 * paint: the correct theme is on the root element before any pixel is drawn,
 * which is what removes the flash of the wrong theme. It is dependency free,
 * wrapped in try/catch, idempotent, and contains no interpolated input.
 */
export const themeBootstrapScript = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var p=localStorage.getItem(k);if(p!=="light"&&p!=="dark"&&p!=="system"){p="system"}var t=p;if(p==="system"){t=window.matchMedia&&window.matchMedia(${JSON.stringify(
  MEDIA,
)}).matches?"dark":"light"}var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t}catch(e){}})();`;

export interface ThemeContextValue {
  /** What the user chose. */
  preference: ThemePreference;
  /** What is actually painted right now. */
  resolvedTheme: ResolvedTheme;
  setPreference: (next: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Overrides storage. Use in tests and in component previews. */
  forcedPreference?: ThemePreference | undefined;
}

export function ThemeProvider({ children, forcedPreference }: ThemeProviderProps): ReactNode {
  // The server cannot know the preference, so it renders the neutral default
  // and the bootstrap script has already corrected the DOM by the time this
  // mounts. Reading storage in an effect keeps hydration deterministic.
  const [preference, setPreferenceState] = useState<ThemePreference>(forcedPreference ?? 'system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  useIsomorphicLayoutEffect(() => {
    const initial = forcedPreference ?? readStoredPreference();
    setPreferenceState(initial);
    setResolvedTheme(applyTheme(initial));
  }, [forcedPreference]);

  useEffect(() => {
    if (preference !== 'system') return undefined;
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const list = window.matchMedia(MEDIA);
    const onChange = (): void => setResolvedTheme(applyTheme('system'));
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    setResolvedTheme(applyTheme(next));
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // A blocked storage partition still gets the theme for this session.
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return context;
}
