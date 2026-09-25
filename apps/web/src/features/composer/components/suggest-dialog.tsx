'use client';

/**
 * One Suggest request, from the inputs it needs to the proposals it returns.
 *
 * The request only runs when the person presses Suggest, so opening the menu
 * never spends model budget. Proposals are labelled as suggestions with the
 * model and prompt version that wrote them. "Use this" is the only path into
 * the draft.
 */

import { useState, type ReactNode } from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@relay/design-system/primitives';
import { LoadingState, Notice } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';

import type { ApiError } from '@/lib/api';
import { SuggestProposalList } from './suggest-proposals';
import {
  useAcceptSuggestion,
  useSuggest,
  type SuggestionKind,
  type SuggestionTone,
} from './suggest-data';

const TONES: readonly SuggestionTone[] = [
  'plain',
  'warm',
  'direct',
  'technical',
  'playful',
  'formal',
];

const TONE_KEY = {
  plain: 'web.suggest.tone.plain',
  warm: 'web.suggest.tone.warm',
  direct: 'web.suggest.tone.direct',
  technical: 'web.suggest.tone.technical',
  playful: 'web.suggest.tone.playful',
  formal: 'web.suggest.tone.formal',
} as const satisfies Record<SuggestionTone, string>;

export interface SuggestDialogProps {
  readonly kind: SuggestionKind;
  readonly title: string;
  readonly body: string;
  readonly connectionId: string | null;
  readonly contentItemId: string | null;
  readonly mediaIds: readonly string[];
  readonly contentLocale: string;
  readonly onApply: (text: string) => void;
  readonly onClose: () => void;
}

/** Where a hook or a call to action goes. Everything else replaces the text. */
function compose(kind: SuggestionKind, body: string, proposal: string): string {
  if (kind === 'hooks') {
    return body.trim().length === 0 ? proposal : `${proposal}\n\n${body}`;
  }
  if (kind === 'ctas') {
    return body.trim().length === 0 ? proposal : `${body}\n\n${proposal}`;
  }
  return proposal;
}

function errorKey(error: ApiError): string {
  if (error.isOffline) return 'web.suggest.offline';
  if (error.isRateLimited) return 'web.suggest.rateLimited';
  if (error.isAuthorization) return 'web.suggest.forbidden';
  return 'web.suggest.error';
}

export function SuggestDialog({
  kind,
  title,
  body,
  connectionId,
  contentItemId,
  mediaIds,
  contentLocale,
  onApply,
  onClose,
}: SuggestDialogProps): ReactNode {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const suggest = useSuggest();
  const accept = useAcceptSuggestion();
  const [brief, setBrief] = useState('');
  const [tone, setTone] = useState<SuggestionTone>('plain');
  const [language, setLanguage] = useState('');
  const [discarded, setDiscarded] = useState<readonly number[]>([]);

  const needsBody = kind !== 'draft_from_brief';
  const bodyMissing = needsBody && body.trim().length === 0;
  const inputMissing =
    (kind === 'draft_from_brief' && brief.trim().length === 0) ||
    (kind === 'transcreate' && language.trim().length < 2);

  const run = (): void => {
    setDiscarded([]);
    suggest.mutate({
      kind,
      ...(needsBody || body.trim().length > 0 ? { body } : {}),
      ...(kind === 'draft_from_brief' ? { brief } : {}),
      ...(kind === 'tone' ? { tone } : {}),
      ...(kind === 'transcreate'
        ? { targetLanguage: language.trim(), sourceLanguage: contentLocale }
        : {}),
      ...(connectionId === null ? {} : { connectionId }),
      ...(contentItemId === null ? {} : { contentItemId }),
      ...(mediaIds.length === 0 ? {} : { mediaIds }),
    });
  };

  const use = (suggestionId: string, index: number): void => {
    accept.mutate(
      {
        suggestionId,
        proposalIndex: index,
        ...(contentItemId === null ? {} : { contentItemId }),
        ...(connectionId === null ? {} : { connectionId }),
      },
      {
        onSuccess: (accepted) => {
          onApply(compose(kind, body, accepted.body));
          announce(t.full('web.suggest.accepted'));
          onClose();
        },
      },
    );
  };

  const result = suggest.data;

  return (
    <Dialog open onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogContent size="lg" closeLabel={t.full('action.close')}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{t.full('web.suggest.review.disclaimer')}</DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          {kind === 'draft_from_brief' ? (
            <Field
              label={t.full('web.suggest.brief.label')}
              description={t.full('web.suggest.brief.hint')}
            >
              {(control) => (
                <Textarea
                  {...control}
                  rows={4}
                  value={brief}
                  onChange={(event) => setBrief(event.target.value)}
                />
              )}
            </Field>
          ) : null}
          {kind === 'tone' ? (
            <Field label={t.full('web.suggest.tone.label')}>
              {(control) => (
                <Select value={tone} onValueChange={(value) => setTone(value as SuggestionTone)}>
                  <SelectTrigger id={control.id}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((entry) => (
                      <SelectItem key={entry} value={entry}>
                        {t.full(TONE_KEY[entry])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          ) : null}
          {kind === 'transcreate' ? (
            <Field label={t.full('web.suggest.transcreate.label')}>
              {(control) => (
                <Input
                  {...control}
                  value={language}
                  maxLength={35}
                  onChange={(event) => setLanguage(event.target.value)}
                />
              )}
            </Field>
          ) : null}

          {bodyMissing ? <Notice tone="neutral" title={t.full('web.suggest.emptyBody')} /> : null}

          {suggest.isPending ? (
            <LoadingState label={t.full('web.suggest.pending')}>
              <p className="text-body-sm text-text-secondary">{t.full('web.suggest.pending')}</p>
            </LoadingState>
          ) : null}

          {suggest.error ? (
            <Notice tone="warning" liveness="alert" title={t(errorKey(suggest.error))} />
          ) : null}

          {result?.status === 'unavailable' ? (
            <Notice tone="neutral" liveness="status" title={t(result.reasonKey)} />
          ) : null}

          {result?.status === 'ready' ? (
            <SuggestProposalList
              result={result}
              discarded={discarded}
              accepting={accept.isPending}
              acceptError={accept.error ? t.full('web.suggest.acceptFailed') : null}
              onUse={(index) => use(result.suggestionId, index)}
              onDiscard={(index) => setDiscarded((current) => [...current, index])}
            />
          ) : null}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {t.full('web.suggest.cancel')}
          </Button>
          <Button
            variant="secondary"
            onClick={run}
            loading={suggest.isPending}
            disabled={bodyMissing || inputMissing || suggest.isPending}
          >
            {kind === 'draft_from_brief'
              ? t.full('web.suggest.brief.submit')
              : t.full('web.suggest.run')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
