'use client';

/**
 * The Suggest menu.
 *
 * Every entry produces a proposal and nothing else. The draft does not change
 * until the person presses "Use this"; that press records which model and
 * prompt version wrote the text, puts the text in the draft, and marks the post
 * AI assisted. Discarding leaves no trace.
 *
 * In the master pane the menu offers writing help for the canonical draft. In
 * a channel tab it also offers "Adapt for this channel", which reads that
 * account's live limits on the server rather than a table here.
 */

import { useState, type ReactNode } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context';
import { isUnsavedDraft } from '../types';
import { SuggestDialog } from './suggest-dialog';
import type { SuggestionKind } from './suggest-data';

export interface SuggestMenuProps {
  /** Null in the master pane; the channel's connection id in a channel tab. */
  readonly connectionId: string | null;
  /** The text the suggestion starts from: the master body or the resolved variant body. */
  readonly body: string;
}

const MASTER_KINDS: readonly SuggestionKind[] = [
  'draft_from_brief',
  'hooks',
  'ctas',
  'shorten',
  'tone',
  'transcreate',
];
const CHANNEL_KINDS: readonly SuggestionKind[] = [
  'platform_variant',
  'hooks',
  'ctas',
  'shorten',
  'tone',
];

const MENU_KEY = {
  draft_from_brief: 'web.suggest.menu.draftFromBrief',
  hooks: 'web.suggest.menu.hooks',
  ctas: 'web.suggest.menu.ctas',
  shorten: 'web.suggest.menu.shorten',
  tone: 'web.suggest.menu.tone',
  platform_variant: 'web.suggest.menu.platformVariant',
  transcreate: 'web.suggest.menu.transcreate',
} as const satisfies Record<SuggestionKind, string>;

export function SuggestMenu({ connectionId, body }: SuggestMenuProps): ReactNode {
  const t = useTranslations();
  const { state, dispatch, online } = useComposer();
  const [kind, setKind] = useState<SuggestionKind | null>(null);
  const kinds = connectionId === null ? MASTER_KINDS : CHANNEL_KINDS;

  /** Put accepted text into the draft and mark the post AI assisted. */
  const apply = (text: string): void => {
    if (connectionId === null) {
      dispatch({
        type: 'master/patch',
        patch: { body: text, disclosure: { ...state.master.disclosure, aiAssisted: true } },
      });
      return;
    }
    dispatch({ type: 'variant/override', connectionId, field: 'body', value: text });
    dispatch({
      type: 'master/patch',
      patch: { disclosure: { ...state.master.disclosure, aiAssisted: true } },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            disabled={!online}
            title={online ? undefined : t.full('web.suggest.offline')}
          >
            <Sparkles aria-hidden className="size-4" />
            {t.full('web.suggest.menu.label')}
            <ChevronDown aria-hidden className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {kinds.map((entry) => (
            <DropdownMenuItem key={entry} onSelect={() => setKind(entry)}>
              {t.full(MENU_KEY[entry])}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {kind === null ? null : (
        <SuggestDialog
          kind={kind}
          title={t.full(MENU_KEY[kind])}
          body={body}
          connectionId={connectionId}
          contentItemId={isUnsavedDraft(state.master) ? null : state.master.id}
          mediaIds={state.master.mediaIds}
          contentLocale={state.master.locale}
          onApply={apply}
          onClose={() => setKind(null)}
        />
      )}
    </>
  );
}
