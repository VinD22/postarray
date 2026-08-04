'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

export interface FocusTrapProps {
  children: ReactNode;
  /** Turn the trap off without unmounting the subtree. */
  active?: boolean;
  /** Move focus into the trap on mount. */
  autoFocus?: boolean;
  /** Restore focus to whatever was focused before the trap opened. */
  restoreFocus?: boolean;
  className?: string;
}

function focusableWithin(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (node) =>
      node.offsetParent !== null ||
      node.getClientRects().length > 0 ||
      node === document.activeElement,
  );
}

/**
 * A focus trap for surfaces that are not Dialog or Sheet.
 *
 * Dialog and Sheet already trap focus through Radix and should be preferred.
 * This exists for the cases they do not cover: an inline confirmation that
 * replaces a row, a media crop overlay, a keyboard rescheduling mode on the
 * calendar. Escape is not handled here on purpose, because what Escape should
 * do differs per surface and a silent default would hide that decision.
 */
export function FocusTrap({
  children,
  active = true,
  autoFocus = true,
  restoreFocus = true,
  className,
}: FocusTrapProps): ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return undefined;
    previouslyFocused.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (autoFocus && containerRef.current) {
      const [first] = focusableWithin(containerRef.current);
      (first ?? containerRef.current).focus();
    }

    return () => {
      if (restoreFocus) previouslyFocused.current?.focus();
    };
  }, [active, autoFocus, restoreFocus]);

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!active || event.key !== 'Tab') return;
      const container = containerRef.current;
      if (!container) return;
      const focusable = focusableWithin(container);
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      const activeElement = document.activeElement;
      if (event.shiftKey && (activeElement === first || activeElement === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [active],
  );

  return (
    <div ref={containerRef} tabIndex={-1} onKeyDown={onKeyDown} className={className}>
      {children}
    </div>
  );
}
