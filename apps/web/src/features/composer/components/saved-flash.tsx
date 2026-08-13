'use client';

/**
 * The one-off "Saved" flourish for `Mod+s`.
 *
 * This is not the shared `Toaster` (`@relay/design-system/primitives`) — a
 * manual save is not a fact anyone needs to find again later (the draft's own
 * autosave state already carries that, and a failed save surfaces through the
 * rate-limit notice, not a toast). It is a transient confirmation: a `Badge`
 * that slides in near the header and clears itself
 * after 1.5s, using the theme's own `.relay-toast-bounce` CSS entrance
 * (`packages/design-system/src/tokens/theme.css`) rather than GSAP, since
 * `Mod+s` sits directly on the composer's hottest path and this must add
 * nothing to the keystroke cost of typing — the global 1ms
 * `prefers-reduced-motion` override neutralizes the entrance for free.
 *
 * The entrance is retimed to `--duration-fast` here rather than in the
 * keyframe, because the shared `.relay-toast-bounce` recipe is used by
 * genuine overlay toasts where the expressive 400ms is right. This one is
 * in-app chrome on the composer's hottest path, so it takes the app tier: the
 * badge is confirming something that already finished, and a confirmation
 * that is still arriving three frames later reads as latency.
 */

import { useEffect, useRef, useState } from 'react';

import { Badge } from '@relay/design-system/primitives';

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
      <Badge
        tone="accent"
        className="relay-toast-bounce shadow-raised [animation-duration:var(--duration-fast)]"
      >
        {t.full('composerWeb.savedFlash')}
      </Badge>
    </div>
  );
}
