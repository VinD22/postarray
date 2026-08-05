'use client';

import { useMemo, useState, type ReactElement } from 'react';
import { Plus } from 'lucide-react';
import {
  Badge,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

/**
 * The one picker used for triggers, conditions and actions.
 *
 * Options are grouped and each group is a labelled list, so a keyboard user
 * walks a structure rather than a flat run of twenty buttons. Filtering is a
 * plain text input over the already translated labels, which means it keeps
 * working in a language whose word order differs from English.
 *
 * `unavailableNote` is the sentence that appears under the list when options
 * were withheld. Withholding an option silently would leave a user hunting for
 * something that will never appear.
 */

export interface PickerOption {
  readonly id: string;
  /** Already translated. */
  readonly label: string;
  /** Already translated group heading. */
  readonly group: string;
  /** Marks an option that creates something on a platform. */
  readonly consequential?: boolean;
}

export interface ItemPickerProps {
  /** Already translated dialog heading. */
  readonly title: string;
  /** Already translated trigger button label. */
  readonly triggerLabel: string;
  readonly options: readonly PickerOption[];
  readonly onSelect: (id: string) => void;
  readonly unavailableNote?: string | undefined;
  readonly triggerVariant?: 'secondary' | 'ghost';
}

export function ItemPicker({
  title,
  triggerLabel,
  options,
  onSelect,
  unavailableNote,
  triggerVariant = 'secondary',
}: ItemPickerProps): ReactElement {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    const filtered = needle
      ? options.filter((option) => option.label.toLocaleLowerCase().includes(needle))
      : options;
    const map = new Map<string, PickerOption[]>();
    for (const option of filtered) {
      const list = map.get(option.group) ?? [];
      list.push(option);
      map.set(option.group, list);
    }
    return [...map.entries()];
  }, [options, query]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setQuery('');
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant={triggerVariant}
          iconStart={<Plus aria-hidden="true" className="size-4" />}
        >
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(24rem,calc(100vw-2rem))]">
        <div className="flex flex-col gap-3">
          <h3 className="text-title-sm text-text-primary">{title}</h3>

          <Input
            type="search"
            value={query}
            aria-label={t('automation.picker.search')}
            placeholder={t('automation.picker.search')}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className="max-h-80 overflow-y-auto">
            {groups.length === 0 ? (
              <p className="text-body-md text-text-secondary">{t('automation.picker.noResults')}</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {groups.map(([group, groupOptions]) => (
                  <li key={group}>
                    <p className="text-label text-text-tertiary pb-1">{group}</p>
                    <ul className="flex flex-col">
                      {groupOptions.map((option) => (
                        <li key={option.id}>
                          <button
                            type="button"
                            className="text-body-md text-text-primary hover:bg-surface-hover focus-visible:outline-border-focus flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-2 text-start focus-visible:outline-2 focus-visible:outline-offset-2"
                            onClick={() => {
                              onSelect(option.id);
                              setOpen(false);
                              setQuery('');
                            }}
                          >
                            <span className="min-w-0">{option.label}</span>
                            {option.consequential ? (
                              <Badge tone="warning">{t('automation.picker.consequential')}</Badge>
                            ) : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {unavailableNote ? (
            <p className="border-border-subtle text-body-sm text-text-secondary border-t pt-2">
              {unavailableNote}
            </p>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
