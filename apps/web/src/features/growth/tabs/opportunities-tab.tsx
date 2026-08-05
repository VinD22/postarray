'use client';

import { useState, type ReactNode } from 'react';
import {
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
  Textarea,
} from '@relay/design-system/primitives';
import {
  DefinitionList,
  EmptyState,
  FreshnessLabel,
  Notice,
} from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { GrowthPlan, OpportunityRecord } from '@relay/contracts';
import { ExternalLink } from 'lucide-react';

import { useFormatters } from '../../settings/lib/formatters.js';
import { ItemActions, type DismissReason } from '../item-actions.js';

export interface OpportunitiesTabProps {
  plan: GrowthPlan;
  records: readonly OpportunityRecord[];
  /** Ids the user has already marked as submitted, for their own tracking. */
  submitted: Readonly<Record<string, string>>;
  busyItemId: string | null;
  onCreatePitchDraft: (opportunityId: string) => void;
  onMarkSubmitted: (opportunityId: string) => void;
  onDismiss: (opportunityId: string, reason: DismissReason, note: string) => void;
}

/**
 * Catalog backed promotion opportunities.
 *
 * Everything on this screen comes from a verified catalog record. There is no
 * bulk action at any width: preparing one good submission is the work, and a
 * control that submits ten at once would be a spam button with a friendly
 * label. When the catalog has nothing that fits, the honest empty state is the
 * correct output.
 */
export function OpportunitiesTab({
  plan,
  records,
  submitted,
  busyItemId,
  onCreatePitchDraft,
  onMarkSubmitted,
  onDismiss,
}: OpportunitiesTabProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();
  const [preparing, setPreparing] = useState<OpportunityRecord | null>(null);
  const [dismissed, setDismissed] = useState<readonly string[]>([]);

  const byId = new Map(records.map((record) => [record.id, record]));
  const matches = plan.opportunities.filter((match) => byId.has(match.opportunityId));
  const staleIds = new Set(plan.risks_and_unknowns.staleCatalogRecordIds);

  if (matches.length === 0) {
    return (
      <EmptyState
        title={t('growth.opportunities.empty')}
        description={t('growth.opportunities.noGuarantee')}
        example={t('growth.ui.opportunities.emptyExample')}
      />
    );
  }

  function costLabel(record: OpportunityRecord): string {
    if (record.costMinor === null || record.currency === null || record.costMinor === 0) {
      return t('growth.ui.opportunities.costFree');
    }
    return formatters.money({ amountMinor: record.costMinor, currency: record.currency });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-[68ch] text-body-md text-text-secondary">
        {t('growth.opportunities.help')}
      </p>
      <Notice tone="neutral" title={t('growth.opportunities.boundary')} />

      {staleIds.size > 0 ? (
        <Notice
          tone="warning"
          title={t('growth.ui.opportunities.staleTitle')}
          description={t('growth.ui.opportunities.staleBody', { count: staleIds.size })}
        />
      ) : null}

      {/* 1024px and up: the full table. */}
      <div className="hidden lg:block">
        <TableContainer>
          <Table>
            <TableCaption className="sr-only">
              {t('growth.ui.opportunities.caption')}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">
                  {t('growth.ui.opportunities.column.opportunity')}
                </TableHead>
                <TableHead scope="col">{t('growth.ui.opportunities.column.type')}</TableHead>
                <TableHead scope="col">
                  {t('growth.ui.opportunities.column.audience')}
                </TableHead>
                <TableHead scope="col">{t('growth.ui.opportunities.column.fit')}</TableHead>
                <TableHead scope="col">
                  {t('growth.ui.opportunities.column.requirements')}
                </TableHead>
                <TableHead scope="col">{t('growth.ui.opportunities.column.rules')}</TableHead>
                <TableHead scope="col">{t('growth.ui.opportunities.column.cost')}</TableHead>
                <TableHead scope="col">{t('growth.ui.opportunities.column.effort')}</TableHead>
                <TableHead scope="col">
                  {t('growth.ui.opportunities.column.verified')}
                </TableHead>
                <TableHead scope="col">
                  {t('growth.ui.opportunities.column.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => {
                const record = byId.get(match.opportunityId);
                if (record === undefined) {
                  return null;
                }
                const stale = staleIds.has(record.id);
                return (
                  <TableRow key={record.id} attention={stale}>
                    <TableRowHeader>
                      <a
                        className="inline-flex items-center gap-1 text-text-accent underline underline-offset-2"
                        href={record.officialUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {record.name}
                        <ExternalLink aria-hidden="true" className="size-3.5" />
                        <span className="sr-only">{t('a11y.label.externalLink')}</span>
                      </a>
                    </TableRowHeader>
                    <TableCell>{record.category}</TableCell>
                    <TableCell>{record.audience}</TableCell>
                    <TableCell className="max-w-72">{match.fitExplanation}</TableCell>
                    <TableCell>
                      {match.requiredAsset ??
                        record.requiredAsset ??
                        t('growth.ui.opportunities.noRequiredAsset')}
                    </TableCell>
                    <TableCell className="max-w-72">
                      <ul className="flex list-disc flex-col gap-0.5 ps-4">
                        {record.rules.map((rule) => (
                          <li key={rule}>{rule}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>{costLabel(record)}</TableCell>
                    <TableCell>
                      {t(`growth.ui.opportunities.effort.${match.effort}`)}
                    </TableCell>
                    <TableCell>
                      <FreshnessLabel
                        level={stale ? 'stale' : 'fresh'}
                        isoTimestamp={record.lastVerifiedAt}
                        text={t('growth.opportunities.lastVerified', {
                          date: formatters.date(record.lastVerifiedAt),
                        })}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="secondary" size="sm" asChild>
                            <a
                              href={record.officialUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {t('action.open')}
                            </a>
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPreparing(record)}
                          >
                            {t('action.prepareSubmission')}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            loading={busyItemId === record.id}
                            onClick={() => onCreatePitchDraft(record.id)}
                          >
                            {t('action.createPitchDraft')}
                          </Button>
                          {submitted[record.id] === undefined ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onMarkSubmitted(record.id)}
                            >
                              {t('action.markSubmitted')}
                            </Button>
                          ) : (
                            <Badge tone="success">
                              {t('growth.ui.opportunities.submittedOn', {
                                date: formatters.date(submitted[record.id] ?? ''),
                              })}
                            </Badge>
                          )}
                        </div>
                        <ItemActions
                          itemId={record.id}
                          dismissed={dismissed.includes(record.id)}
                          explanation={match.fitExplanation}
                          evidence={match.evidenceIds}
                          onDismiss={(reason, note) => {
                            setDismissed((current) => [...current, record.id]);
                            onDismiss(record.id, reason, note);
                          }}
                          onUndoDismiss={() =>
                            setDismissed((current) =>
                              current.filter((entry) => entry !== record.id),
                            )
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Below 1024px: the same rows as blocks with a detail list. */}
      <ul className="flex flex-col lg:hidden">
        {matches.map((match) => {
          const record = byId.get(match.opportunityId);
          if (record === undefined) {
            return null;
          }
          const stale = staleIds.has(record.id);
          return (
            <li
              key={record.id}
              className="flex flex-col gap-2 border-b border-border-subtle py-4 last:border-b-0"
            >
              <a
                className="inline-flex w-fit items-center gap-1 text-body-md font-medium text-text-accent underline underline-offset-2"
                href={record.officialUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                {record.name}
                <ExternalLink aria-hidden="true" className="size-3.5" />
                <span className="sr-only">{t('a11y.label.externalLink')}</span>
              </a>
              <DefinitionList
                layout="columns"
                items={[
                  {
                    id: 'type',
                    term: t('growth.ui.opportunities.column.type'),
                    definition: record.category,
                  },
                  {
                    id: 'audience',
                    term: t('growth.ui.opportunities.column.audience'),
                    definition: record.audience,
                  },
                  {
                    id: 'fit',
                    term: t('growth.ui.opportunities.column.fit'),
                    definition: match.fitExplanation,
                  },
                  {
                    id: 'requirements',
                    term: t('growth.ui.opportunities.column.requirements'),
                    definition:
                      match.requiredAsset ??
                      record.requiredAsset ??
                      t('growth.ui.opportunities.noRequiredAsset'),
                  },
                  {
                    id: 'rules',
                    term: t('growth.ui.opportunities.column.rules'),
                    definition: (
                      <ul className="flex list-disc flex-col gap-0.5 ps-4">
                        {record.rules.map((rule) => (
                          <li key={rule}>{rule}</li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    id: 'cost',
                    term: t('growth.ui.opportunities.column.cost'),
                    definition: costLabel(record),
                  },
                  {
                    id: 'effort',
                    term: t('growth.ui.opportunities.column.effort'),
                    definition: t(`growth.ui.opportunities.effort.${match.effort}`),
                  },
                  {
                    id: 'verified',
                    term: t('growth.ui.opportunities.column.verified'),
                    definition: (
                      <FreshnessLabel
                        level={stale ? 'stale' : 'fresh'}
                        isoTimestamp={record.lastVerifiedAt}
                        text={t('growth.opportunities.lastVerified', {
                          date: formatters.date(record.lastVerifiedAt),
                        })}
                      />
                    ),
                  },
                ]}
              />
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" asChild>
                  <a href={record.officialUrl} target="_blank" rel="noreferrer noopener">
                    {t('action.open')}
                  </a>
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setPreparing(record)}>
                  {t('action.prepareSubmission')}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  loading={busyItemId === record.id}
                  onClick={() => onCreatePitchDraft(record.id)}
                >
                  {t('action.createPitchDraft')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkSubmitted(record.id)}
                  disabled={submitted[record.id] !== undefined}
                >
                  {t('action.markSubmitted')}
                </Button>
              </div>
              <ItemActions
                itemId={record.id}
                dismissed={dismissed.includes(record.id)}
                explanation={match.fitExplanation}
                evidence={match.evidenceIds}
                onDismiss={(reason, note) => {
                  setDismissed((current) => [...current, record.id]);
                  onDismiss(record.id, reason, note);
                }}
                onUndoDismiss={() =>
                  setDismissed((current) => current.filter((entry) => entry !== record.id))
                }
              />
            </li>
          );
        })}
      </ul>

      <p className="text-body-sm text-text-tertiary">
        {t('growth.opportunities.noGuarantee')}
      </p>

      <Dialog
        open={preparing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPreparing(null);
          }
        }}
      >
        <DialogContent closeLabel={t('a11y.label.closeDialog')} size="lg">
          <DialogHeader>
            <DialogTitle>
              {t('growth.ui.opportunities.prepareTitle', { name: preparing?.name ?? '' })}
            </DialogTitle>
            <DialogDescription>
              {t('growth.ui.opportunities.prepareManual')}
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <section className="flex flex-col gap-1">
                <h3 className="text-body-md font-medium text-text-primary">
                  {t('growth.ui.opportunities.prepareRules')}
                </h3>
                <ul className="flex list-disc flex-col gap-1 ps-5 text-body-md text-text-secondary">
                  {(preparing?.rules ?? []).map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </section>

              <section className="flex flex-col gap-1">
                <h3 className="text-body-md font-medium text-text-primary">
                  {t('growth.ui.opportunities.prepareChecklist')}
                </h3>
                <p className="text-body-md text-text-secondary">
                  {preparing?.requiredAsset ??
                    t('growth.ui.opportunities.noRequiredAsset')}
                </p>
              </section>

              <section className="flex flex-col gap-1">
                <h3 className="text-body-md font-medium text-text-primary">
                  {t('growth.ui.opportunities.pitchTitle')}
                </h3>
                <p className="text-body-sm text-text-secondary">
                  {t('growth.ui.opportunities.pitchHelp')}
                </p>
                <Textarea
                  aria-label={t('growth.ui.opportunities.pitchTitle')}
                  minRows={6}
                  defaultValue={
                    matches.find((match) => match.opportunityId === preparing?.id)?.pitchDraft ??
                    ''
                  }
                />
              </section>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPreparing(null)}>
              {t('action.close')}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (preparing !== null) {
                  onCreatePitchDraft(preparing.id);
                  setPreparing(null);
                }
              }}
            >
              {t('action.createPitchDraft')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
