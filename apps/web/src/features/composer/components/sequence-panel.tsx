'use client';

/**
 * The root post and every follow up item in one ordered sequence.
 *
 * Each item can inherit or override its author account, copy, media and delay
 * where the provider permits it, and each carries its own validation. Ordering
 * is done with buttons rather than dragging, because there is no drag-only
 * interaction anywhere in this product.
 */

import { type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import {
  Button,
  Field,
  IconButton,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@relay/design-system/primitives';
import { CapabilityBadge, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { DELAY_PRESET_MINUTES, type CapabilitySnapshot, type ThreadItem } from '@relay/contracts';
import { formatDateTime, formatDuration } from '@relay/i18n';

import { useComposer } from '../composer-context.js';
import { newThreadItem, sequenceFor } from '../state/composer-reducer.js';
import { sequenceTimeline } from '../state/selectors.js';
import { PROVIDER_LABEL } from './provider-identity.js';

const CUSTOM_DELAY = 'custom';

export interface SequencePanelProps {
  /** `null` edits the master sequence, an id edits one target's own sequence. */
  readonly scope: string | null;
  /** The capability snapshot that governs this scope, when there is one. */
  readonly capabilities: CapabilitySnapshot | null;
}

export function SequencePanel({ scope, capabilities }: SequencePanelProps): ReactNode {
  const t = useTranslations();
  const { bootstrap, state, dispatch } = useComposer();
  const items = sequenceFor(state, scope);
  const timeline = sequenceTimeline(state.master.schedule?.instant ?? null, items);
  const zone = state.master.schedule?.ianaTimeZone ?? bootstrap.workspaceTimeZone;

  const supported =
    capabilities === null ||
    capabilities.firstComment.support === 'supported' ||
    capabilities.threads.support === 'supported';
  const maxItems =
    capabilities === null
      ? 25
      : Math.max(capabilities.firstComment.maxItems, capabilities.threads.maxItems);

  return (
    <section aria-labelledby="composer-sequence-heading" className="flex flex-col gap-3">
      <h3 id="composer-sequence-heading" className="text-title-sm text-text-primary">
        {t.full('composer.sequence.title')}
      </h3>

      {!supported && capabilities ? (
        <div className="flex flex-col gap-1.5">
          <CapabilityBadge
            state={
              capabilities.firstComment.support === 'not_implemented'
                ? 'not_implemented'
                : 'unsupported'
            }
            label={
              capabilities.firstComment.support === 'not_implemented'
                ? t.full('composerWeb.rail.state.notBuilt')
                : t.full('composerWeb.rail.state.unsupported')
            }
          />
          <p className="text-body-sm text-text-secondary">
            {t.full('composer.sequence.unsupported')}
          </p>
        </div>
      ) : null}

      <ol className="flex flex-col">
        <li className="border-b border-border-subtle py-2">
          <p className="text-body-md text-text-primary">{t.full('composer.sequence.root')}</p>
        </li>
        {items.map((item, index) => (
          <SequenceItem
            key={item.id}
            item={item}
            index={index}
            scope={scope}
            capabilities={capabilities}
            instant={timeline[index]?.instant ?? null}
            timeZone={zone}
            canMoveUp={index > 0}
            canMoveDown={index < items.length - 1}
          />
        ))}
      </ol>

      {supported ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            iconStart={<Plus aria-hidden />}
            disabled={items.length >= maxItems}
            onClick={() =>
              dispatch({
                type: 'sequence/add',
                connectionId: scope,
                item: newThreadItem(items.length, items.length === 0 ? 'comment' : 'thread'),
              })
            }
          >
            {t.full('action.addComment')}
          </Button>
          {capabilities ? (
            <span className="text-body-sm text-text-tertiary">
              {t.full('composerWeb.sequence.maxReached', { limit: maxItems })}
            </span>
          ) : null}
        </div>
      ) : null}

      {items.length > 0 ? (
        <Notice tone="info" title={t.full('composerWeb.sequence.partialFailure')} />
      ) : null}
    </section>
  );
}

interface SequenceItemProps {
  readonly item: ThreadItem;
  readonly index: number;
  readonly scope: string | null;
  readonly capabilities: CapabilitySnapshot | null;
  readonly instant: string | null;
  readonly timeZone: string;
  readonly canMoveUp: boolean;
  readonly canMoveDown: boolean;
}

function SequenceItem({
  item,
  index,
  scope,
  capabilities,
  instant,
  timeZone,
  canMoveUp,
  canMoveDown,
}: SequenceItemProps): ReactNode {
  const t = useTranslations();
  const { bootstrap, state, dispatch } = useComposer();
  const minutes = Math.round(item.delaySeconds / 60);
  const isPreset = DELAY_PRESET_MINUTES.includes(minutes as (typeof DELAY_PRESET_MINUTES)[number]);
  const minDelayMinutes =
    capabilities === null
      ? 1
      : Math.max(
          1,
          Math.ceil(
            Math.min(capabilities.firstComment.minDelaySeconds, capabilities.threads.minDelaySeconds) /
              60,
          ),
        );

  const patch = (next: Partial<ThreadItem>): void => {
    dispatch({ type: 'sequence/patch', connectionId: scope, itemId: item.id, patch: next });
  };

  return (
    <li className="flex flex-col gap-2.5 border-b border-border-subtle py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-body-md text-text-primary">
          {t.full('composer.sequence.item', { position: index + 2 })}
        </p>
        <div className="flex items-center gap-0.5">
          <IconButton
            variant="ghost"
            size="sm"
            label={t.full('composerWeb.sequence.moveUp')}
            icon={<ArrowUp aria-hidden />}
            disabled={!canMoveUp}
            onClick={() =>
              dispatch({ type: 'sequence/move', connectionId: scope, itemId: item.id, delta: -1 })
            }
          />
          <IconButton
            variant="ghost"
            size="sm"
            label={t.full('composerWeb.sequence.moveDown')}
            icon={<ArrowDown aria-hidden />}
            disabled={!canMoveDown}
            onClick={() =>
              dispatch({ type: 'sequence/move', connectionId: scope, itemId: item.id, delta: 1 })
            }
          />
          <IconButton
            variant="ghost"
            size="sm"
            label={t.full('composerWeb.sequence.remove')}
            icon={<Trash2 aria-hidden />}
            onClick={() =>
              dispatch({ type: 'sequence/remove', connectionId: scope, itemId: item.id })
            }
          />
        </div>
      </div>

      <Field label={t.full('composer.editor.label')}>
        {(control) => (
          <Textarea
            id={control.id}
            value={item.body}
            onChange={(event) => patch({ body: event.target.value })}
            autoGrow
            minRows={2}
            maxRows={10}
          />
        )}
      </Field>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <Field label={t.full('composer.sequence.delayLabel')}>
          {(control) => (
            <Select
              value={isPreset ? String(minutes) : CUSTOM_DELAY}
              onValueChange={(value) => {
                if (value === CUSTOM_DELAY) {
                  return;
                }
                patch({ delaySeconds: Number(value) * 60 });
              }}
            >
              <SelectTrigger id={control.id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DELAY_PRESET_MINUTES.filter((preset) => preset >= minDelayMinutes).map((preset) => (
                  <SelectItem key={preset} value={String(preset)}>
                    {t.full('composer.sequence.delayMinutes', { count: preset })}
                  </SelectItem>
                ))}
                <SelectItem value={CUSTOM_DELAY}>
                  {t.full('composer.sequence.delayCustom')}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </Field>

        {isPreset ? null : (
          <Field label={t.full('composerWeb.sequence.customMinutes')}>
            {(control) => (
              <Input
                id={control.id}
                type="number"
                inputMode="numeric"
                min={minDelayMinutes}
                value={minutes}
                onChange={(event) =>
                  patch({ delaySeconds: Math.max(minDelayMinutes, Number(event.target.value)) * 60 })
                }
              />
            )}
          </Field>
        )}

        <Field label={t.full('composer.sequence.accountLabel')}>
          {(control) => (
            <Select
              value={item.connectionId ?? 'inherit'}
              onValueChange={(value) =>
                patch({ connectionId: value === 'inherit' ? null : value })
              }
            >
              <SelectTrigger id={control.id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inherit">
                  {t.full('composerWeb.sequence.inheritAuthor')}
                </SelectItem>
                {bootstrap.accounts
                  .filter((account) => state.selectedConnectionIds.includes(account.connectionId))
                  .map((account) => (
                    <SelectItem
                      key={account.connectionId}
                      value={account.connectionId}
                      description={PROVIDER_LABEL[account.provider]}
                    >
                      {account.displayName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      </div>

      {capabilities ? (
        <p className="text-body-sm text-text-tertiary">
          {t.full('composerWeb.sequence.minDelay', {
            provider: PROVIDER_LABEL[capabilities.provider],
            // A formatted duration, not a translated fragment pushed into
            // another translated sentence.
            duration: formatDuration(t.locale, minDelayMinutes * 60_000),
          })}
        </p>
      ) : null}

      {instant === null ? null : (
        <p className="text-body-sm text-text-secondary">
          {t.full('composerWeb.sequence.absoluteTime', {
            time: formatDateTime(t.locale, instant, {
              timeZone,
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            utc: formatDateTime(t.locale, instant, {
              timeZone: 'UTC',
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
          })}
        </p>
      )}
    </li>
  );
}
