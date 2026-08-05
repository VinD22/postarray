'use client';

/**
 * The schedule and approval confirmation.
 *
 * From this sheet alone a reviewer can name every target, the exact content
 * and media version, the local time and its UTC equivalent, the audience and
 * disclosure state, the approver, the estimated cost and any cadence or
 * duplicate warning. The actions are plain verbs: save, request approval,
 * schedule, publish now. Never "Launch" and never "Run".
 */

import { useMemo, useState, type ReactNode } from 'react';
import {
  Button,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@relay/design-system/primitives';
import { DefinitionList, Notice } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';
import { crossesOffsetChange, formatCurrency, formatDateTime } from '@relay/i18n';
import { resolveVariant } from '@relay/contracts';

import { useComposer } from '../composer-context.js';
import { PROVIDER_LABEL } from './provider-identity.js';
import { RepeatPanel } from './repeat-panel.js';
import { isoDateIn, isoTimeIn, zonedToInstant } from '../state/time.js';

export type ScheduleIntent = 'draft' | 'approval' | 'schedule' | 'publish';

export interface ScheduleSheetProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCommit: (intent: ScheduleIntent) => Promise<void>;
  /** Cadence and duplicate warnings the server already knows about. */
  readonly warnings?: readonly { id: string; text: string }[];
}

export function ScheduleSheet({
  open,
  onOpenChange,
  onCommit,
  warnings = [],
}: ScheduleSheetProps): ReactNode {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const { bootstrap, state, dispatch, summaries, totals, online } = useComposer();
  const [busy, setBusy] = useState<ScheduleIntent | null>(null);

  const schedule = state.master.schedule;
  const zone = schedule?.ianaTimeZone ?? bootstrap.workspaceTimeZone;
  const instant = schedule?.instant ?? null;
  const inPast = instant !== null && Date.parse(instant) < Date.now();
  const dstChange = useMemo(
    () => (instant === null ? false : crossesOffsetChange(zone, Date.now(), instant)),
    [instant, zone],
  );

  const setLocal = (date: string, time: string): void => {
    if (date.length === 0 || time.length === 0) {
      dispatch({ type: 'schedule/set', schedule: null });
      return;
    }
    // A naive local string is converted through the chosen zone, never through
    // the browser's zone, so the instant is the one the user actually meant.
    const parsed = zonedToInstant(date, time, zone);
    dispatch({
      type: 'schedule/set',
      schedule: { instant: parsed, ianaTimeZone: zone, repeat: schedule?.repeat ?? null },
    });
  };

  const commit = (intent: ScheduleIntent): void => {
    setBusy(intent);
    onCommit(intent)
      .then(() => {
        if (intent === 'schedule' && instant !== null) {
          announce(
            t.full('a11y.announce.scheduled', {
              time: formatDateTime(t.locale, instant, {
                timeZone: zone,
                dateStyle: 'full',
                timeStyle: 'short',
              }),
              timeZone: zone,
            }),
            'polite',
          );
        }
        if (intent === 'publish') {
          announce(t.full('a11y.announce.publishing'), 'polite');
        }
        onOpenChange(false);
      })
      .catch(() => {
        announce(t.full('a11y.announce.publishFailed'), 'assertive');
      })
      .finally(() => setBusy(null));
  };

  const localDate = instant === null ? '' : isoDateIn(instant, zone);
  const localTime = instant === null ? '' : isoTimeIn(instant, zone);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="inline-end" closeLabel={t.full('action.close')}>
        <SheetHeader>
          <SheetTitle>{t.full('composer.schedule.confirmTitle')}</SheetTitle>
          <SheetDescription>
            {t.full('composer.targets.publishSummary', {
              count: totals.targetCount,
              when: instant === null ? 'now' : 'scheduled',
            })}
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="flex flex-col gap-5">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label={t.full('composer.schedule.dateLabel')}>
              {(control) => (
                <Input
                  id={control.id}
                  type="date"
                  value={localDate}
                  onChange={(event) => setLocal(event.target.value, localTime || '09:00')}
                />
              )}
            </Field>
            <Field label={t.full('composer.schedule.timeLabel')}>
              {(control) => (
                <Input
                  id={control.id}
                  type="time"
                  value={localTime}
                  onChange={(event) => setLocal(localDate || isoDateIn(new Date().toISOString(), zone), event.target.value)}
                />
              )}
            </Field>
          </div>

          <Field label={t.full('composer.schedule.timeZoneLabel')}>
            {(control) => (
              <Select
                value={zone}
                onValueChange={(value) => {
                  if (instant === null) {
                    return;
                  }
                  dispatch({
                    type: 'schedule/set',
                    schedule: { instant, ianaTimeZone: value, repeat: schedule?.repeat ?? null },
                  });
                }}
              >
                <SelectTrigger id={control.id}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={bootstrap.workspaceTimeZone}>
                    {bootstrap.workspaceTimeZone}
                  </SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            )}
          </Field>

          {instant === null ? (
            <p className="text-body-sm text-text-tertiary">
              {t.full('composerWeb.summary.notScheduled')}
            </p>
          ) : (
            <p className="text-body-sm tabular-nums text-text-secondary">
              {t.full('composer.schedule.localAndUtc', {
                local: formatDateTime(t.locale, instant, {
                  timeZone: zone,
                  dateStyle: 'full',
                  timeStyle: 'short',
                }),
                timeZone: zone,
                utc: formatDateTime(t.locale, instant, {
                  timeZone: 'UTC',
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }),
              })}
            </p>
          )}

          {inPast ? (
            <Notice tone="warning" title={t.full('composer.schedule.pastWarning')} />
          ) : null}

          {dstChange && instant !== null ? (
            <Notice
              tone="warning"
              title={t.full('composer.schedule.dstWarning', {
                timeZone: zone,
                local: formatDateTime(t.locale, instant, {
                  timeZone: zone,
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }),
                utc: formatDateTime(t.locale, instant, {
                  timeZone: 'UTC',
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }),
              })}
            />
          ) : null}

          <RepeatPanel />

          <section aria-labelledby="schedule-targets-heading" className="flex flex-col gap-2">
            <h3 id="schedule-targets-heading" className="text-title-sm text-text-primary">
              {t.full('composerWeb.review.perTargetHeading')}
            </h3>
            <ul className="flex flex-col">
              {summaries.map((summary) => {
                const resolved = resolveVariant(
                  state.master,
                  state.overrides[summary.connectionId] ?? {},
                );
                const settings = state.settings[summary.connectionId];
                return (
                  <li
                    key={summary.connectionId}
                    className="border-b border-border-subtle py-3 last:border-b-0"
                  >
                    <DefinitionList
                      layout="columns"
                      items={[
                        {
                          id: 'account',
                          term: PROVIDER_LABEL[summary.account.provider],
                          definition: `${summary.account.displayName}${
                            summary.account.handle ? ` ${summary.account.handle}` : ''
                          }`,
                        },
                        {
                          id: 'text',
                          term: t.full('composer.editor.label'),
                          definition: resolved.values.body,
                          hint: t.full('composer.editor.characterCount', {
                            used: summary.characterCount,
                            limit: summary.characterLimit,
                          }),
                        },
                        {
                          id: 'media',
                          term: t.full('composer.media.title'),
                          definition: t.full('composer.media.count', {
                            count: summary.mediaCount,
                          }),
                        },
                        {
                          id: 'audience',
                          term: t.full('composerWeb.native.privacy'),
                          definition:
                            settings?.privacyValue ?? t.full('common.notSet'),
                        },
                        {
                          id: 'disclosure',
                          term: t.full('composerWeb.native.disclosureHeading'),
                          definition: describeDisclosure(
                            settings?.disclosure ?? state.master.disclosure,
                            t,
                          ),
                        },
                        ...(summary.publishedUrl === null
                          ? []
                          : [
                              {
                                id: 'url',
                                term: t.full('composerWeb.review.finalUrl'),
                                definition: summary.publishedUrl,
                              },
                            ]),
                        ...(summary.estimatedCostMinor === null || summary.costCurrency === null
                          ? []
                          : [
                              {
                                id: 'cost',
                                term: t.full('composer.cost.title'),
                                definition: formatCurrency(
                                  t.locale,
                                  summary.estimatedCostMinor,
                                  summary.costCurrency,
                                ),
                              },
                            ]),
                      ]}
                    />
                  </li>
                );
              })}
            </ul>
          </section>

          {warnings.map((warning) => (
            <Notice key={warning.id} tone="warning" title={warning.text} />
          ))}

          {totals.blockedCount > 0 ? (
            <Notice
              tone="destructive"
              liveness="status"
              title={t.full('composerWeb.review.blocked', { count: totals.blockedCount })}
            />
          ) : null}

          {online ? null : (
            <Notice tone="warning" title={t.full('composerWeb.review.offlineBlocked')} />
          )}
        </SheetBody>

        <SheetFooter className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            loading={busy === 'draft'}
            loadingLabel={t.full('composer.autosave.saving')}
            onClick={() => commit('draft')}
          >
            {t.full('action.saveDraft')}
          </Button>
          <Button
            variant="secondary"
            disabled={!online || totals.blockedCount > 0}
            loading={busy === 'approval'}
            loadingLabel={t.full('composer.autosave.saving')}
            onClick={() => commit('approval')}
          >
            {t.full('action.requestApproval')}
          </Button>
          <Button
            variant="primary"
            disabled={!online || !totals.canSchedule || instant === null || inPast}
            loading={busy === 'schedule'}
            loadingLabel={t.full('composer.autosave.saving')}
            onClick={() => commit('schedule')}
          >
            {t.full('action.schedule')}
          </Button>
          <Button
            variant="secondary"
            disabled={!online || !totals.canSchedule}
            loading={busy === 'publish'}
            loadingLabel={t.full('a11y.announce.publishing')}
            onClick={() => commit('publish')}
          >
            {t.full('action.publishNow')}
          </Button>
          <p className="w-full text-body-sm text-text-tertiary">
            {t.full('composerWeb.review.publishConfirm', { count: totals.targetCount })}
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function describeDisclosure(
  disclosure: { aiAssisted: boolean; commercialContent: boolean; brandedContent: boolean },
  t: ReturnType<typeof useTranslations>,
): string {
  const parts: string[] = [];
  if (disclosure.commercialContent) {
    parts.push(t.full('composerWeb.native.disclosureCommercial'));
  }
  if (disclosure.brandedContent) {
    parts.push(t.full('composerWeb.native.disclosureBranded'));
  }
  if (disclosure.aiAssisted) {
    parts.push(t.full('composerWeb.native.disclosureAi'));
  }
  return parts.length === 0 ? t.full('composerWeb.review.disclosureNone') : parts.join('. ');
}
