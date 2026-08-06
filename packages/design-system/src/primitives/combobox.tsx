'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';
import { focusRing, transitionBase } from '../utils/style-constants';
import { Spinner } from './spinner';

/**
 * An editable combobox with an asynchronous option source.
 *
 * This is the control behind mention resolution and destination lookup, so it
 * has one non-negotiable rule: a selection is an object with a provider
 * identifier, never the typed text. Typing "@relay" and walking away must not
 * produce a mention; only choosing a resolved result does.
 *
 * It follows the ARIA 1.2 combobox pattern with `aria-activedescendant`: focus
 * stays in the text input while the arrow keys move the active option, so the
 * user can keep typing to narrow the list. The listbox is rendered inline
 * rather than in a portal, which keeps it inside the same scroll container as
 * the field and avoids a detached popup on a 360px screen.
 *
 * Every piece of user-visible text is a prop, supplied by the caller from the
 * message catalog.
 */

export interface ComboboxItem {
  /** Stable identity. For a mention this is the provider's external id. */
  readonly id: string;
  /** The primary line. */
  readonly label: string;
  /** The secondary line: a handle, a channel name, a page. */
  readonly description?: string | undefined;
  /** A small leading node: a StatusDot, an Avatar, a provider mark. */
  readonly leading?: ReactNode;
  readonly disabled?: boolean | undefined;
}

export type ComboboxStatus = 'idle' | 'loading' | 'error' | 'ready';

export interface ComboboxMessages {
  /** Accessible name for the text input. */
  readonly label: string;
  /** Shown inside the field before typing. */
  readonly placeholder?: string | undefined;
  /** Shown while results are being fetched. Also announced politely. */
  readonly loading: string;
  /** Shown when the query returned nothing. Explain what to try instead. */
  readonly empty: string;
  /** Shown when the lookup itself failed. Naming the provider is better. */
  readonly error: string;
  /** Accessible name for the button that opens the list. */
  readonly toggle: string;
  /**
   * Announced when results arrive, already formatted by the caller through
   * ICU so the count pluralises correctly.
   */
  readonly resultCount: (count: number) => string;
}

export interface ComboboxProps {
  items: readonly ComboboxItem[];
  status?: ComboboxStatus;
  value: ComboboxItem | null;
  onValueChange: (item: ComboboxItem | null) => void;
  /** The current query. Controlled so the caller can debounce the request. */
  inputValue: string;
  onInputValueChange: (query: string) => void;
  messages: ComboboxMessages;
  id?: string;
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  className?: string;
  'aria-describedby'?: string | undefined;
  'aria-errormessage'?: string | undefined;
  /** Called when the field is closed without a resolved selection. */
  onDismiss?: () => void;
}

export interface ComboboxHandle {
  focus: () => void;
}

export const Combobox = forwardRef<ComboboxHandle, ComboboxProps>(function Combobox(
  {
    items,
    status = 'ready',
    value,
    onValueChange,
    inputValue,
    onInputValueChange,
    messages,
    id: providedId,
    name,
    disabled = false,
    invalid = false,
    required,
    className,
    onDismiss,
    ...aria
  },
  forwardedRef,
) {
  const generatedId = useId();
  const id = providedId ?? `${generatedId}-combobox`;
  const listboxId = `${id}-listbox`;
  const statusId = `${id}-status`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(forwardedRef, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  const selectableIndexes = useMemo(
    () =>
      items.reduce<number[]>((acc, item, index) => {
        if (!item.disabled) acc.push(index);
        return acc;
      }, []),
    [items],
  );

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  // Reset the active option whenever the result set changes, so the highlight
  // never points at a row that has been replaced by a newer response.
  useEffect(() => {
    setActiveIndex(selectableIndexes.length > 0 ? (selectableIndexes[0] ?? -1) : -1);
  }, [selectableIndexes, items]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
        onDismiss?.();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, close, onDismiss]);

  const move = useCallback(
    (direction: 1 | -1) => {
      if (selectableIndexes.length === 0) return;
      const position = selectableIndexes.indexOf(activeIndex);
      const next =
        position === -1
          ? (selectableIndexes[direction === 1 ? 0 : selectableIndexes.length - 1] ?? -1)
          : (selectableIndexes[
              (position + direction + selectableIndexes.length) % selectableIndexes.length
            ] ?? -1);
      setActiveIndex(next);
      const option = listRef.current?.querySelector<HTMLElement>(`[data-index="${next}"]`);
      option?.scrollIntoView({ block: 'nearest' });
    },
    [activeIndex, selectableIndexes],
  );

  const commit = useCallback(
    (item: ComboboxItem) => {
      if (item.disabled) return;
      onValueChange(item);
      onInputValueChange(item.label);
      close();
    },
    [close, onInputValueChange, onValueChange],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) setOpen(true);
        else move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) setOpen(true);
        else move(-1);
        break;
      case 'Home':
        if (!open) break;
        event.preventDefault();
        setActiveIndex(selectableIndexes[0] ?? -1);
        break;
      case 'End':
        if (!open) break;
        event.preventDefault();
        setActiveIndex(selectableIndexes[selectableIndexes.length - 1] ?? -1);
        break;
      case 'Enter': {
        if (!open || activeIndex < 0) break;
        const item = items[activeIndex];
        if (!item) break;
        event.preventDefault();
        commit(item);
        break;
      }
      case 'Escape':
        if (!open) break;
        event.preventDefault();
        close();
        onDismiss?.();
        break;
      case 'Tab':
        // Tabbing away is a dismissal, not a selection. An unresolved query
        // must not silently become a mention.
        close();
        break;
      default:
        break;
    }
  };

  const activeId = activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined;
  const showList = open && !disabled;

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <div
        className={cn(
          'bg-surface-raised flex items-center gap-1 rounded-md border-[1.5px]',
          'h-8 ps-2.5 pe-1',
          invalid ? 'border-destructive-border' : 'border-border-strong',
          disabled && 'bg-surface-sunken cursor-not-allowed',
          'focus-within:outline-2 focus-within:outline-offset-2',
          'focus-within:outline-[color:var(--border-focus)]',
          transitionBase,
        )}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          required={required}
          aria-label={messages.label}
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          aria-invalid={invalid || undefined}
          aria-describedby={
            [aria['aria-describedby'], statusId].filter(Boolean).join(' ') || undefined
          }
          aria-errormessage={aria['aria-errormessage']}
          aria-busy={status === 'loading' || undefined}
          placeholder={messages.placeholder}
          value={inputValue}
          onChange={(event) => {
            onInputValueChange(event.target.value);
            if (value) onValueChange(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={cn(
            'text-body-md text-text-primary min-w-0 flex-1 bg-transparent outline-none',
            'placeholder:text-text-tertiary disabled:text-text-disabled disabled:cursor-not-allowed',
          )}
        />
        {status === 'loading' ? <Spinner size="sm" /> : null}
        <button
          type="button"
          tabIndex={-1}
          aria-label={messages.toggle}
          disabled={disabled}
          onClick={() => {
            setOpen((current) => !current);
            inputRef.current?.focus();
          }}
          className={cn(
            'inline-flex size-6 shrink-0 items-center justify-center rounded-sm',
            'text-text-tertiary hover:text-text-primary',
            focusRing,
          )}
        >
          <ChevronDown aria-hidden="true" className="size-4" />
        </button>
      </div>

      {/* A polite summary of what the list currently holds. Tooltips and
          visual-only counts are not enough here. */}
      <span id={statusId} aria-live="polite" className="sr-only">
        {status === 'loading'
          ? messages.loading
          : status === 'error'
            ? messages.error
            : showList
              ? messages.resultCount(items.length)
              : ''}
      </span>

      {showList ? (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={messages.label}
          className={cn(
            'absolute start-0 end-0 z-(--z-index-dropdown) mt-1 max-h-64 overflow-y-auto',
            'border-border-default bg-surface-overlay shadow-overlay rounded-lg border p-1',
            'relay-scrollbar relay-anim-fade-in',
          )}
        >
          {status === 'error' ? (
            <li className="text-body-sm text-destructive-fg px-2 py-2">{messages.error}</li>
          ) : items.length === 0 && status !== 'loading' ? (
            <li className="text-body-sm text-text-secondary px-2 py-2">{messages.empty}</li>
          ) : (
            items.map((item, index) => (
              <li
                key={item.id}
                id={`${id}-option-${index}`}
                data-index={index}
                role="option"
                aria-selected={value?.id === item.id}
                aria-disabled={item.disabled || undefined}
                onPointerDown={(event) => {
                  // Keep focus in the input so the active descendant model holds.
                  event.preventDefault();
                  commit(item);
                }}
                onPointerMove={() => {
                  if (!item.disabled) setActiveIndex(index);
                }}
                className={cn(
                  'flex cursor-default items-start gap-2 rounded-sm px-2 py-1.5',
                  'text-body-md text-text-primary',
                  index === activeIndex && 'bg-surface-hover',
                  item.disabled && 'text-text-disabled cursor-not-allowed',
                )}
              >
                {item.leading ? <span className="mt-0.5 shrink-0">{item.leading}</span> : null}
                <span className="flex min-w-0 flex-col">
                  <span className="truncate">{item.label}</span>
                  {item.description ? (
                    <span className="text-body-sm text-text-tertiary truncate">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
});
