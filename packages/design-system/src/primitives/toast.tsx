'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { Toast as ToastPrimitive } from 'radix-ui';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '../utils/cn.js';
import { focusRing } from '../utils/style-constants.js';

/**
 * Transient confirmations.
 *
 * A toast is the second place a fact appears, never the first and never the
 * only one. Anything that needs action, anything that failed and anything a
 * user may need to find again also lives in the action center and on the
 * object itself. This is a hard product rule: a failed publish that exists
 * only in a toast is a lost publish.
 *
 * Toasts enter from the inline end so they never cover the primary action
 * column, and a toast carrying an action does not auto-dismiss.
 */

export type ToastTone = 'neutral' | 'success' | 'warning' | 'destructive' | 'info';

export interface ToastOptions {
  id?: string;
  title: string;
  description?: string | undefined;
  tone?: ToastTone;
  /** A single follow-up action. Its label comes from the message catalog. */
  action?: { label: string; onSelect: () => void } | undefined;
  /** Milliseconds. Omit for a toast that must be dismissed deliberately. */
  duration?: number | undefined;
}

interface ToastRecord extends ToastOptions {
  id: string;
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneIcon: Record<ToastTone, ReactNode> = {
  neutral: null,
  success: <CheckCircle2 aria-hidden="true" className="text-success-fg size-4" />,
  warning: <AlertTriangle aria-hidden="true" className="text-warning-fg size-4" />,
  destructive: <XCircle aria-hidden="true" className="text-destructive-fg size-4" />,
  info: <Info aria-hidden="true" className="text-info-fg size-4" />,
};

const toneBorder: Record<ToastTone, string> = {
  neutral: 'border-border-default',
  success: 'border-success-border',
  warning: 'border-warning-border',
  destructive: 'border-destructive-border',
  info: 'border-info-border',
};

export interface ToasterProps {
  children: ReactNode;
  /** Accessible name for the toast region, from the message catalog. */
  regionLabel: string;
  /** Accessible name for each toast's close control. */
  closeLabel: string;
  /** Default lifetime for a toast without an action. */
  defaultDuration?: number;
}

export function Toaster({
  children,
  regionLabel,
  closeLabel,
  defaultDuration = 6000,
}: ToasterProps): ReactNode {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions): string => {
    const id = options.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current.filter((item) => item.id !== id), { ...options, id }]);
    return id;
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider label={regionLabel} swipeDirection="right">
        {children}
        {toasts.map((item) => {
          const tone = item.tone ?? 'neutral';
          return (
            <ToastPrimitive.Root
              key={item.id}
              duration={item.action ? Infinity : (item.duration ?? defaultDuration)}
              onOpenChange={(open) => {
                if (!open) dismiss(item.id);
              }}
              className={cn(
                'bg-surface-overlay flex items-start gap-2.5 rounded-lg border',
                'shadow-overlay relay-anim-enter-toast p-3',
                toneBorder[tone],
              )}
            >
              {toneIcon[tone] ? <span className="mt-0.5 shrink-0">{toneIcon[tone]}</span> : null}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <ToastPrimitive.Title className="text-body-md text-text-primary font-medium">
                  {item.title}
                </ToastPrimitive.Title>
                {item.description ? (
                  <ToastPrimitive.Description className="text-body-sm text-text-secondary">
                    {item.description}
                  </ToastPrimitive.Description>
                ) : null}
              </div>
              {item.action ? (
                <ToastPrimitive.Action
                  altText={item.action.label}
                  onClick={item.action.onSelect}
                  className={cn(
                    'border-border-default shrink-0 rounded-md border px-2 py-1',
                    'text-body-sm text-text-primary hover:bg-surface-hover font-medium',
                    focusRing,
                  )}
                >
                  {item.action.label}
                </ToastPrimitive.Action>
              ) : null}
              <ToastPrimitive.Close
                aria-label={closeLabel}
                className={cn(
                  'text-text-tertiary hover:text-text-primary shrink-0 rounded-sm p-0.5',
                  focusRing,
                )}
              >
                <X aria-hidden="true" className="size-4" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          );
        })}
        <ToastPrimitive.Viewport
          className={cn(
            'fixed end-0 bottom-0 z-(--z-index-toast) flex max-h-dvh w-[min(24rem,calc(100vw-1.5rem))]',
            'm-0 list-none flex-col gap-2 p-3 outline-none',
          )}
        />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

/** Returns a no-op outside a Toaster so an isolated render never crashes. */
export function useToast(): ToastContextValue {
  return (
    useContext(ToastContext) ?? {
      toast: () => '',
      dismiss: () => undefined,
    }
  );
}

export const ToastAction = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(function ToastAction({ className, ...props }, ref) {
  return (
    <ToastPrimitive.Action
      ref={ref}
      className={cn(
        'border-border-default shrink-0 rounded-md border px-2 py-1',
        'text-body-sm text-text-primary hover:bg-surface-hover font-medium',
        focusRing,
        className,
      )}
      {...props}
    />
  );
});
