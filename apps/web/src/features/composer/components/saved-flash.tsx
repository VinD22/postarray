'use client';

/**
 * The one-off "Saved" flourish for `Mod+s`.
 *
 * This is not the shared `Toaster` (`@relay/design-system/primitives`) — a
 * manual save is not a fact anyone needs to find again later (the draft's own
 * autosave state already carries that, and a failed save surfaces through the
 * rate-limit notice, not a toast). It is a transient, purely decorative
 * confirmation: a `Sticker` that pops in near the header and clears itself
 * after 1.5s, using the theme's own `.relay-toast-bounce` CSS entrance
 * (`packages/design-system/src/tokens/theme.css`) rather than GSAP, since
 * `Mod+s` sits directly on the composer's hottest path and this must add
 * nothing to the keystroke cost of typing — the global 1ms
 * `prefers-reduced-motion` override neutralizes the entrance for free.
 */

import { useEffect, useRef, useState } from 'react';

import { Sticker } from '@/features/marketing/components/loud/sticker';
import { useTranslations } from '@/lib/i18n';

const VISIBLE_MS = 1500;

/** Tracks the flash's visibility; `flash()` is cheap to call from a hotkey handler. */
export function useSavedFlash(): { readonly visible: boolean; readonly flash: () => void } {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const flash = (): void => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    setVisible(true);
    timerRef.current = window.setTimeout(() => {
      setVisible(false);
      timerRef.current = null;
    }, VISIBLE_MS);
  };

  return { visible, flash };
}

export function SavedFlash({ visible }: { readonly visible: boolean }) {
  const t = useTranslations();
  if (!visible) {
    return null;
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed end-4 top-4 z-(--z-index-toast)"
    >
      <Sticker tone="cta" className="relay-toast-bounce">
        {t.full('composerWeb.savedFlash')}
      </Sticker>
    </div>
  );
}
