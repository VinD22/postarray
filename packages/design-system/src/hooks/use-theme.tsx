'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY, themeBootstrapScript } from '../theme-bootstrap';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

export type ThemePreference = 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

function isPreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark';
}

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'light';
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(raw) ? raw : systemTheme();
  } catch {
    // Private browsing or a blocked storage partition. System is a safe answer.
    return 'light';
  }
}

function systemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia(THEME_MEDIA_QUERY).matches ? 'dark' : 'light';
}

function applyTheme(preference: ThemePreference): ResolvedTheme {
  const resolved = preference;
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);
  root.style.colorScheme = resolved;
  return resolved;
}

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
  const [preference, setPreferenceState] = useState<ThemePreference>(forcedPreference ?? 'light');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  useIsomorphicLayoutEffect(() => {
    const initial = forcedPreference ?? readStoredPreference();
    setPreferenceState(initial);
    setResolvedTheme(applyTheme(initial));
  }, [forcedPreference]);

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

export { THEME_STORAGE_KEY, themeBootstrapScript };

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return context;
}
