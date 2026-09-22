'use client';

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUpRight, Building2, Check, Folder, Search } from 'lucide-react';
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';
import { useSession } from '@/lib/auth/session-context';
import { useContextSwitch, type ContextTarget } from '@/lib/auth/use-context-switch';
import { useLocalizedRouter, useTranslations } from '@/lib/i18n';
import { confirmLeavingUnsaved } from '@/lib/navigation/unsaved-changes';

export function ContextPicker({ onClose }: { readonly onClose: () => void }) {
  const t = useTranslations();
  const router = useLocalizedRouter();
  const { session, workspace, project } = useSession();
  const switchContext = useContextSwitch();
  const listId = useId();
  const list = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return [
      ...session.projects.map((item) => ({
        kind: 'project' as const,
        id: item.id,
        name: item.name,
        current: item.id === project?.id,
        detail: t('shell.context.projectDetail', { count: item.connectionIds.length }),
      })),
      ...session.workspaces.map((item) => ({
        kind: 'workspace' as const,
        id: item.id,
        name: item.name,
        current: item.id === workspace.id,
        detail: t('shell.context.workspaceDetail', { timeZone: item.timeZone }),
      })),
    ].filter((item) => item.name.toLocaleLowerCase().includes(needle));
  }, [project?.id, query, session.projects, session.workspaces, t, workspace.id]);

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex]);

  function select(target: ContextTarget) {
    onClose();
    void switchContext(target);
  }

  function navigate(href: string) {
    onClose();
    void confirmLeavingUnsaved().then((confirmed) => {
      if (confirmed) router.push(href);
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((index) => (index + direction + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) select(target);
    }
  }

  return (
    <DialogContent
      closeLabel={t('a11y.label.closeDialog')}
      size="md"
      className="gap-0 overflow-hidden p-0"
    >
      <div className="border-border-subtle border-b px-5 pe-12 pt-5 pb-4">
        <DialogTitle>{t('nav.projectSwitcher')}</DialogTitle>
        <DialogDescription className="mt-1">{t('shell.context.description')}</DialogDescription>
      </div>
      <div className="border-border-subtle focus-within:bg-surface-sunken flex items-center gap-3 border-b px-5">
        <Search aria-hidden="true" className="text-text-tertiary size-4 shrink-0" />
        <input
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={t('shell.context.search')}
          aria-activedescendant={results[activeIndex] ? `${listId}-${activeIndex}` : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={t('shell.context.search')}
          className="text-body-md text-text-primary placeholder:text-text-tertiary min-h-12 min-w-0 flex-1 bg-transparent focus-visible:outline-none"
        />
      </div>
      <p className="text-label text-text-tertiary px-5 pt-3" role="status">
        {t('shell.context.results', { count: results.length })}
      </p>
      <ul
        ref={list}
        id={listId}
        role="listbox"
        aria-label={t('nav.projectSwitcher')}
        className="relay-scrollbar max-h-[min(24rem,45dvh)] overflow-y-auto p-2"
      >
        {results.map((item, index) => {
          const Icon = item.kind === 'project' ? Folder : Building2;
          return (
            <li
              key={`${item.kind}-${item.id}`}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select(item)}
              className={cn(
                'flex min-h-16 cursor-pointer items-center gap-3 rounded-md px-3 py-2',
                index === activeIndex
                  ? 'bg-accent-subtle text-text-primary'
                  : 'text-text-secondary',
              )}
            >
              <span className="border-border-subtle bg-surface-raised flex size-9 shrink-0 items-center justify-center rounded-md border">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-body-md block truncate font-medium">{item.name}</span>
                <span className="text-label text-text-tertiary block truncate">{item.detail}</span>
              </span>
              {item.current ? (
                <>
                  <Check aria-hidden="true" className="text-accent size-4 shrink-0" />
                  <span className="sr-only">
                    {t(
                      item.kind === 'project' ? 'shell.project.current' : 'shell.workspace.current',
                      { name: item.name },
                    )}
                  </span>
                </>
              ) : null}
            </li>
          );
        })}
      </ul>
      {results.length === 0 ? (
        <p className="text-body-md text-text-secondary px-5 py-8">{t('shell.context.empty')}</p>
      ) : null}
      <div className="border-border-subtle bg-surface-sunken flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
        <Button
          variant="ghost"
          size="sm"
          iconEnd={<ArrowUpRight aria-hidden="true" className="size-4" />}
          onClick={() => navigate('/settings/projects')}
        >
          {t('shell.project.manage')}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => navigate('/onboarding/workspace')}>
          {t('shell.workspace.create')}
        </Button>
      </div>
    </DialogContent>
  );
}
