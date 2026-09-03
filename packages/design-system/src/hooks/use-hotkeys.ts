'use client';

import { useEffect, useMemo, useRef } from 'react';

/**
 * Keyboard shortcuts for the composer and the calendar.
 *
 * A binding is written as a lowercase combination: `mod+enter`, `shift+?`,
 * `alt+arrowright`. `mod` is Command on Apple platforms and Control elsewhere,
 * so one binding covers both without a platform branch at the call site.
 *
 * Shortcuts never fire while the user is typing in a field unless the binding
 * opts in with `enableInFormFields`, because a bare letter shortcut that eats
 * a character in a draft is worse than no shortcut at all.
 */

export interface HotkeyOptions {
  /** Fire even when focus is inside an input, textarea or contenteditable. */
  enableInFormFields?: boolean;
  /** Call preventDefault when the binding matches. Defaults to true. */
  preventDefault?: boolean;
  /** Temporarily disable without changing the binding map. */
  enabled?: boolean;
  /** Listen on this node instead of the document. */
  target?: HTMLElement | Document | null;
}

export type HotkeyHandler = (event: KeyboardEvent) => void;
export type HotkeyMap = Record<string, HotkeyHandler>;

const isApplePlatform = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform;
  return /mac|iphone|ipad|ipod/i.test(platform ?? '');
};

function normalizeBinding(binding: string, apple: boolean): string {
  const parts = binding
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean);

  const modifiers = new Set<string>();
  let key = '';
  for (const part of parts) {
    if (part === 'mod') modifiers.add(apple ? 'meta' : 'ctrl');
    else if (part === 'cmd' || part === 'meta') modifiers.add('meta');
    else if (part === 'ctrl' || part === 'control') modifiers.add('ctrl');
    else if (part === 'shift') modifiers.add('shift');
    else if (part === 'alt' || part === 'option') modifiers.add('alt');
    else key = part;
  }
  return [...['ctrl', 'meta', 'alt', 'shift'].filter((m) => modifiers.has(m)), key].join('+');
}

/**
 * A single character that is not a letter or a digit, so a shifted symbol
 * rather than a shifted letter. `?`, `:` and `+` are typed with Shift held and
 * arrive with `shiftKey` set; `C` arrives the same way but is a letter, where
 * Shift genuinely distinguishes two different shortcuts.
 */
function isShiftedSymbol(key: string): boolean {
  return key.length === 1 && !/[a-z0-9]/.test(key);
}

/**
 * The bindings this event could reasonably be written as.
 *
 * A shifted symbol has two honest spellings and people mean the same thing by
 * both: `?` is the character the key produces, `shift+?` is how it is typed.
 * The browser reports them together, `shiftKey` set and `key` already `?`, so
 * a binding registered as a bare `?` could never match anything at all. Both
 * spellings are returned here, which is why the composer's help shortcut fires
 * for the first time and why the shell's `shift+?` keeps working unchanged.
 *
 * Only symbols get the second spelling. Dropping Shift from a letter would
 * make `mod+shift+c` and `mod+c` the same shortcut, which they are not.
 */
function eventBindings(event: KeyboardEvent): readonly string[] {
  const modifiers: string[] = [];
  if (event.ctrlKey) modifiers.push('ctrl');
  if (event.metaKey) modifiers.push('meta');
  if (event.altKey) modifiers.push('alt');
  const key = event.key.toLowerCase();

  const shifted = [...modifiers, ...(event.shiftKey ? ['shift'] : []), key].join('+');
  if (!event.shiftKey || !isShiftedSymbol(key)) {
    return [shifted];
  }
  return [shifted, [...modifiers, key].join('+')];
}

function isFormField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

export function useHotkeys(map: HotkeyMap, options: HotkeyOptions = {}): void {
  const { enableInFormFields = false, preventDefault = true, enabled = true, target } = options;

  const mapRef = useRef(map);
  mapRef.current = map;

  const apple = useMemo(() => isApplePlatform(), []);
  const bindings = useMemo(
    () => Object.keys(map).map((raw) => [normalizeBinding(raw, apple), raw] as const),
    // Only the set of bindings matters here; handlers are read through the ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Object.keys(map).join('|'), apple],
  );

  useEffect(() => {
    if (!enabled) return undefined;
    const node = target ?? (typeof document !== 'undefined' ? document : null);
    if (!node) return undefined;

    const onKeyDown = (event: Event): void => {
      if (!(event instanceof KeyboardEvent)) return;
      if (!enableInFormFields && isFormField(event.target)) return;
      const pressed = eventBindings(event);
      for (const [normalized, raw] of bindings) {
        if (!pressed.includes(normalized)) continue;
        const handler = mapRef.current[raw];
        if (!handler) continue;
        if (preventDefault) event.preventDefault();
        handler(event);
        return;
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => node.removeEventListener('keydown', onKeyDown);
  }, [bindings, enabled, enableInFormFields, preventDefault, target]);
}

/**
 * Formats a binding for display next to a menu item, using the platform's own
 * symbols. The returned segments are symbols and key names, not sentences, so
 * they are safe to render without a translation catalog.
 */
export function formatHotkey(binding: string, apple = isApplePlatform()): string[] {
  return binding
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (part === 'mod') return apple ? '⌘' : 'Ctrl';
      if (part === 'meta' || part === 'cmd') return apple ? '⌘' : 'Win';
      if (part === 'ctrl' || part === 'control') return apple ? '⌃' : 'Ctrl';
      if (part === 'alt' || part === 'option') return apple ? '⌥' : 'Alt';
      if (part === 'shift') return apple ? '⇧' : 'Shift';
      if (part === 'enter') return apple ? '↩' : 'Enter';
      if (part === 'escape') return 'Esc';
      if (part === 'arrowup') return '↑';
      if (part === 'arrowdown') return '↓';
      if (part === 'arrowleft') return '←';
      if (part === 'arrowright') return '→';
      return part.length === 1 ? part.toUpperCase() : part;
    });
}
