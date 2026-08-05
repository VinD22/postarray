'use client';

import { useState, type ReactNode } from 'react';
import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@relay/design-system/primitives';
import { DefinitionList } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { GrowthPlan } from '@relay/contracts';

import { SettingsPanel } from '../../settings/components/section.js';
import { useFormatters } from '../../settings/lib/formatters.js';
import { ItemActions, type DismissReason } from '../item-actions.js';

export interface FourWeekTabProps {
  plan: GrowthPlan;
  busyItemId: string | null;
  onAccept: (itemId: string) => void;
  onPropose: (itemId: string, date: string) => void;
  onDismiss: (itemId: string, reason: DismissReason, note: string) => void;
}

/** A slot's identity inside the plan. Stable across a refresh of the same version. */
function slotId(weekNumber: number, index: number): string {
  return `w${weekNumber}-s${index}`;
}

/**
 * Four weeks of proposed briefs as rows.
 *
 * This is a table because the reader is comparing sixteen items across seven
 * attributes, and twenty eight cards would make that comparison impossible.
 * Below 768px each row becomes its own block with the same seven facts.
 */
export function FourWeekTab({
  plan,
  busyItemId,
  onAccept,
  onPropose,
  onDismiss,
}: FourWeekTabProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();
  const [dismissed, setDismissed] = useState<readonly string[]>([]);

  const total = plan.calendar_proposal.reduce((sum, week) => sum + week.slots.length, 0);

  function actionsFor(id: string, date: string, explanation: string): ReactNode {
    return (
      <ItemActions
        itemId={id}
        busy={busyItemId === id}
        dismissed={dismissed.includes(id)}
        explanation={explanation}
        evidence={plan.business_snapshot.facts.map((fact) => fact.statement)}
        onAccept={() => onAccept(id)}
        onPropose={() => onPropose(id, date)}
        onDismiss={(reason, note) => {
          setDismissed((current) => [...current, id]);
          onDismiss(id, reason, note);
        }}
        onUndoDismiss={() =>
          setDismissed((current) => current.filter((entry) => entry !== id))
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-[68ch] text-body-md text-text-secondary">
        {t('growth.fourWeek.help')}
      </p>

      {plan.calendar_proposal.map((week) => (
        <SettingsPanel
          key={week.weekNumber}
          title={t('growth.fourWeek.week', { number: week.weekNumber })}
          description={t('growth.fourWeek.itemCount', { count: week.slots.length })}
        >
          {week.slots.length === 0 ? (
            <p className="text-body-md text-text-secondary">
              {t('growth.ui.fourWeek.weekEmpty')}
            </p>
          ) : (
            <>
              {/* 1024px and up: the full table. */}
              <div className="hidden lg:block">
                <TableContainer>
                  <Table>
                    <TableCaption className="sr-only">
                      {t('growth.ui.fourWeek.caption')}
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead scope="col">
                          {t('growth.ui.fourWeek.column.date')}
                        </TableHead>
                        <TableHead scope="col">
                          {t('growth.ui.fourWeek.column.channel')}
                        </TableHead>
                        <TableHead scope="col">
                          {t('growth.ui.fourWeek.column.pillar')}
                        </TableHead>
                        <TableHead scope="col">
                          {t('growth.ui.fourWeek.column.format')}
                        </TableHead>
                        <TableHead scope="col">
                          {t('growth.ui.fourWeek.column.brief')}
                        </TableHead>
                        <TableHead scope="col">
                          {t('growth.ui.fourWeek.column.cta')}
                        </TableHead>
                        <TableHead scope="col">
                          {t('growth.ui.fourWeek.column.measurement')}
                        </TableHead>
                        <TableHead scope="col">
                          {t('growth.ui.fourWeek.column.actions')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {week.slots.map((slot, index) => {
                        const id = slotId(week.weekNumber, index);
                        return (
                          <TableRow key={id}>
                            <TableRowHeader className="whitespace-nowrap">
                              {formatters.date(`${slot.date}T12:00:00.000Z`)}
                            </TableRowHeader>
                            <TableCell>{slot.provider}</TableCell>
                            <TableCell>{slot.pillar}</TableCell>
                            <TableCell>{slot.contentKind}</TableCell>
                            <TableCell className="max-w-96">
                              <span className="flex flex-col gap-1">
                                {slot.briefSummary}
                                <Badge tone={slot.approvalRequired ? 'accent' : 'neutral'}>
                                  {slot.approvalRequired
                                    ? t('growth.ui.fourWeek.approvalRequired')
                                    : t('growth.ui.fourWeek.approvalNotRequired')}
                                </Badge>
                              </span>
                            </TableCell>
                            <TableCell>
                              {slot.ctaKey ?? t('growth.ui.fourWeek.noCta')}
                            </TableCell>
                            <TableCell className="font-mono">{slot.measurementTag}</TableCell>
                            <TableCell>
                              {actionsFor(id, slot.date, slot.briefSummary)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Below 1024px: the same rows as blocks. */}
              <ul className="flex flex-col lg:hidden">
                {week.slots.map((slot, index) => {
                  const id = slotId(week.weekNumber, index);
                  return (
                    <li
                      key={id}
                      className="flex flex-col gap-2 border-b border-border-subtle py-3 last:border-b-0"
                    >
                      <p className="text-body-md text-text-primary">{slot.briefSummary}</p>
                      <DefinitionList
                        layout="columns"
                        items={[
                          {
                            id: 'date',
                            term: t('growth.ui.fourWeek.column.date'),
                            definition: formatters.date(`${slot.date}T12:00:00.000Z`),
                          },
                          {
                            id: 'channel',
                            term: t('growth.ui.fourWeek.column.channel'),
                            definition: slot.provider,
                          },
                          {
                            id: 'pillar',
                            term: t('growth.ui.fourWeek.column.pillar'),
                            definition: slot.pillar,
                          },
                          {
                            id: 'format',
                            term: t('growth.ui.fourWeek.column.format'),
                            definition: slot.contentKind,
                          },
                          {
                            id: 'cta',
                            term: t('growth.ui.fourWeek.column.cta'),
                            definition: slot.ctaKey ?? t('growth.ui.fourWeek.noCta'),
                          },
                          {
                            id: 'measurement',
                            term: t('growth.ui.fourWeek.column.measurement'),
                            definition: slot.measurementTag,
                          },
                          {
                            id: 'approval',
                            term: t('state.approval.requested.label'),
                            definition: slot.approvalRequired
                              ? t('growth.ui.fourWeek.approvalRequired')
                              : t('growth.ui.fourWeek.approvalNotRequired'),
                          },
                        ]}
                      />
                      {actionsFor(id, slot.date, slot.briefSummary)}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </SettingsPanel>
      ))}

      <p className="text-body-sm text-text-tertiary">
        {t('growth.ui.fourWeek.acceptedCount', {
          accepted: total - dismissed.length,
          total,
        })}
      </p>
      <p className="text-body-sm text-text-tertiary">{t('growth.fourWeek.approvalNote')}</p>
    </div>
  );
}
