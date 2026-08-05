'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

import { useHotkeys } from '@relay/design-system/hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Kbd,
  VisuallyHidden,
} from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { useSession } from '@/lib/auth/session-context';
import { useTranslations } from '@/lib/i18n';

import { NAV_ITEMS } from './nav-items';

interface Command {
  readonly id: string;
  readonly label: string;
  readonly group: string;
  readonly run: () => void;
  readonly shortcut?: string;
}

/**
 * The command palette.
 *
 * Real actions only. It is a keyboard route to things the product actually
 * does, so every entry here either navigates somewhere that exists or performs
 * something the user could otherwise do with the mouse.
 *
 * The pattern is the ARIA combobox with a listbox popup:
 * `aria-activedescendant` moves the visual selection while focus stays in the
 * input, which is what lets a screen reader announce each option as you arrow
 * through it.
 */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { session, workspace, canPublish } = useSession();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const close = useCallback(() => {
    onOpenChange(false);
    setQuery('');
    setActiveIndex(0);
  }, [onOpenChange]);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  const commands = useMemo<readonly Command[]>(() => {
    const actionGroup = t('palette.group.actions');
    const goToGroup = t('palette.group.goTo');
    const workspaceGroup = t('palette.group.workspaces');
    const settingsGroup = t('palette.group.settings');

    const entries: Command[] = [];

    if (canPublish) {
      entries.push({
        id: 'compose',
        label: t('palette.action.compose'),
        group: actionGroup,
        run: () => {
          go('/compose');
        },
        shortcut: 'mod+shift+c',
      });
    }

    entries.push(
      {
        id: 'connect',
        label: t('palette.action.connectAccount'),
        group: actionGroup,
        run: () => {
          go('/connections/new');
        },
      },
      {
        id: 'action-center',
        label: t('palette.action.openActionCenter'),
        group: actionGroup,
        run: () => {
          go('/action-center');
        },
      },
      {
        id: 'upload',
        label: t('palette.action.uploadMedia'),
        group: actionGroup,
        run: () => {
          go('/library?upload=1');
        },
      },
      {
        id: 'rule',
        label: t('palette.action.createRule'),
        group: actionGroup,
        run: () => {
          go('/automation/new');
        },
      },
    );

    for (const item of NAV_ITEMS) {
      entries.push({
        id: `nav-${item.id}`,
        label: t(item.labelKey),
        group: goToGroup,
        run: () => {
          go(item.href);
        },
      });
    }

    for (const candidate of session.workspaces) {
      if (candidate.id === workspace.id) {
        continue;
      }
      entries.push({
        id: `ws-${candidate.id}`,
        label: candidate.name,
        group: workspaceGroup,
        run: () => {
          document.cookie = `relay_ws=${candidate.id}; path=/; SameSite=Lax`;
          close();
          router.refresh();
        },
      });
    }

    entries.push(
      {
        id: 'settings-billing',
        label: t('settings.nav.billing'),
        group: settingsGroup,
        run: () => {
          go('/settings/billing');
        },
      },
      {
        id: 'settings-members',
        label: t('settings.nav.members'),
        group: settingsGroup,
        run: () => {
          go('/settings/members');
        },
      },
      {
        id: 'settings-webhooks',
        label: t('settings.nav.webhooks'),
        group: settingsGroup,
        run: () => {
          go('/settings/webhooks');
        },
      },
    );

    return entries;
  }, [canPublish, close, go, router, session.workspaces, t, workspace.id]);

  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (needle.length === 0) {
      return commands;
    }
    return commands.filter((command) => command.label.toLocaleLowerCase().includes(needle));
  }, [commands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      // Focus after the dialog has mounted so the caret lands in the field.
      const frame = requestAnimationFrame(() => inputRef.current?.focus());
      return () => {
        cancelAnimationFrame(frame);
      };
    }
    return undefined;
  }, [open]);

  const grouped = useMemo(() => {
    const order: string[] = [];
    const byGroup = new Map<string, { command: Command; index: number }[]>();
    results.forEach((command, index) => {
      if (!byGroup.has(command.group)) {
        byGroup.set(command.group, []);
        order.push(command.group);
      }
      byGroup.get(command.group)?.push({ command, index });
    });
    return order.map((group) => ({ group, entries: byGroup.get(group) ?? [] }));
  }, [results]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + results.length) % results.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(results.length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      results[activeIndex]?.run();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('a11y.label.closeDialog')} size="md" className="p-0">
        <VisuallyHidden>
          <DialogTitle>{t('palette.title')}</DialogTitle>
          <DialogDescription>{t('palette.description')}</DialogDescription>
        </VisuallyHidden>

        <div className="flex items-center gap-2 border-b border-border-subtle px-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-text-tertiary" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-label={t('palette.title')}
            aria-activedescendant={
              results.length > 0 ? `${listId}-option-${activeIndex}` : undefined
            }
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            onKeyDown={onKeyDown}
            placeholder={t('palette.placeholder')}
            className={cn(
              'h-12 w-full bg-transparent text-body-lg text-text-primary',
              'placeholder:text-text-tertiary focus-visible:outline-none',
            )}
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2 relay-scrollbar">
          {results.length === 0 ? (
            <p className="px-2 py-6 text-center text-body-md text-text-secondary">
              {t('palette.empty', { query })}
            </p>
          ) : (
            <ul id={listId} role="listbox" aria-label={t('palette.title')} className="flex flex-col">
              {grouped.map((section) => (
                <li key={section.group} role="presentation">
                  <p
                    role="presentation"
                    className="px-2 pt-3 pb-1 text-label uppercase tracking-wide text-text-tertiary"
                  >
                    {section.group}
                  </p>
                  <ul role="group" aria-label={section.group} className="flex flex-col">
                    {section.entries.map(({ command, index }) => (
                      <li
                        key={command.id}
                        id={`${listId}-option-${index}`}
                        role="option"
                        aria-selected={index === activeIndex}
                        onMouseEnter={() => {
                          setActiveIndex(index);
                        }}
                        onClick={command.run}
                        className={cn(
                          'flex min-h-11 cursor-pointer items-center justify-between gap-3',
                          'rounded-md px-2 py-2 text-body-md',
                          index === activeIndex
                            ? 'bg-accent-subtle text-text-primary'
                            : 'text-text-secondary',
                        )}
                      >
                        <span className="truncate">{command.label}</span>
                        {command.shortcut === undefined ? null : (
                          <Kbd keys={command.shortcut} />
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border-subtle px-3 py-2 text-body-sm text-text-tertiary">
          <span>{t('palette.hint.navigate')}</span>
          <span>{t('palette.hint.select')}</span>
          <span>{t('palette.hint.close')}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Binds Cmd+K / Ctrl+K anywhere in the shell, including inside a field. */
export function useCommandPaletteHotkey(onOpen: () => void): void {
  useHotkeys(
    {
      'mod+k': () => {
        onOpen();
      },
    },
    { enableInFormFields: true },
  );
}
