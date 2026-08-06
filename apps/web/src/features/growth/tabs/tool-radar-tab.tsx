'use client';

import type { ReactNode } from 'react';
import { Badge, Button } from '@relay/design-system/primitives';
import { DefinitionList, EmptyState, FreshnessLabel, Notice } from '@relay/design-system/patterns';
import { cn, panelPoster } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';
import { MAX_TOOL_RECOMMENDATIONS, type GrowthPlan, type ToolRecord } from '@relay/contracts';
import { ExternalLink } from 'lucide-react';

import { SettingsPanel } from '../../settings/components/section';
import { useFormatters } from '../../settings/lib/formatters';

export interface ToolRadarTabProps {
  plan: GrowthPlan;
  records: readonly ToolRecord[];
}

/**
 * At most five reviewed tools.
 *
 * Every entry states what the tool cannot do and when its price was last
 * checked, because a recommendation without a limitation is an advertisement.
 * The affiliate disclosure sits on the row, not in a page footer, and the
 * media generation boundary is reproduced verbatim at the end so the reason
 * this list exists is stated rather than implied.
 *
 * Each recommendation is a poster card (`panelPoster`) rather than the
 * quiet document `SettingsPanel` the rest of Growth's plan uses — this is
 * the one screen whose whole subject is "which five, in what order", so the
 * rank is drawn as a numeral chip rather than left implicit in list order.
 * The numeral is `aria-hidden`: the heading level and DOM order already
 * carry the same rank for assistive technology.
 */
export function ToolRadarTab({ plan, records }: ToolRadarTabProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();

  const byId = new Map(records.map((record) => [record.id, record]));
  const staleIds = new Set(plan.risks_and_unknowns.staleCatalogRecordIds);
  const recommendations = plan.tool_recommendations.filter((entry) => byId.has(entry.toolId));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-body-md text-text-secondary max-w-[68ch]">{t('growth.tools.help')}</p>
        <p className="text-body-sm text-text-tertiary">
          {t('growth.ui.tools.shown', {
            shown: recommendations.length,
            max: MAX_TOOL_RECOMMENDATIONS,
          })}
        </p>
        {recommendations.length > 0 && recommendations.length < MAX_TOOL_RECOMMENDATIONS ? (
          <Notice
            tone="neutral"
            title={t('growth.ui.tools.fewerThanMax', { count: recommendations.length })}
          />
        ) : null}
      </div>

      {recommendations.length === 0 ? (
        <EmptyState
          title={t('growth.ui.tools.emptyTitle')}
          description={t('growth.ui.tools.emptyBody')}
          example={t('growth.ui.tools.emptyExample')}
        />
      ) : (
        recommendations.map((recommendation, index) => {
          const record = byId.get(recommendation.toolId);
          if (record === undefined) {
            return null;
          }
          const stale = staleIds.has(record.id);
          return (
            <article key={record.id} className={cn(panelPoster, 'flex flex-col gap-4 p-5')}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'border-border-bold font-display text-title-sm flex size-9 shrink-0 -rotate-3 items-center justify-center rounded-full border-2',
                      index === 0 ? 'bg-cta text-cta-on' : 'bg-surface-sunken text-text-secondary',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-title-sm text-text-primary flex min-w-0 flex-wrap items-center gap-2 pt-1">
                    {record.name}
                    {stale ? <Badge tone="warning">{t('growth.ui.tools.stale')}</Badge> : null}
                  </h3>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <a href={record.officialUrl} target="_blank" rel="noreferrer noopener">
                    <span className="inline-flex items-center gap-1">
                      {t('action.open')}
                      <ExternalLink aria-hidden="true" className="size-3.5" />
                    </span>
                    <span className="sr-only">
                      {t('growth.ui.tools.openSite', { name: record.name })}
                    </span>
                  </a>
                </Button>
              </div>

              <DefinitionList
                items={[
                  {
                    id: 'best-for',
                    term: t('growth.tools.bestFor'),
                    definition: formatters.list([...record.workflows]),
                  },
                  {
                    id: 'why',
                    term: t('growth.tools.whyItFits'),
                    definition: recommendation.taskFit,
                  },
                  {
                    id: 'limitations',
                    term: t('growth.tools.limitations'),
                    definition: (
                      <ul className="flex list-disc flex-col gap-0.5 ps-4">
                        {[...recommendation.limitations, ...record.limitations].map(
                          (limitation) => (
                            <li key={limitation}>{limitation}</li>
                          ),
                        )}
                      </ul>
                    ),
                  },
                  {
                    id: 'skills',
                    term: t('growth.tools.requiredSkills'),
                    definition: formatters.list([...record.inputs]),
                  },
                  {
                    id: 'handoff',
                    term: t('growth.tools.handoff'),
                    definition: formatters.list([...record.outputs]),
                    hint: formatters.list([...record.integrations]),
                  },
                  {
                    id: 'rights',
                    term: t('growth.tools.rights'),
                    definition: (
                      <ul className="flex list-disc flex-col gap-0.5 ps-4">
                        {record.rules.map((rule) => (
                          <li key={rule}>{rule}</li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    id: 'price',
                    term: t('growth.tools.priceChecked', {
                      date: formatters.date(record.lastVerifiedAt),
                    }),
                    definition: record.priceModel,
                    hint: (
                      <FreshnessLabel
                        level={stale ? 'stale' : 'fresh'}
                        isoTimestamp={record.lastVerifiedAt}
                        text={
                          stale
                            ? t('growth.tools.staleCatalog', {
                                date: formatters.date(record.lastVerifiedAt),
                              })
                            : t('growth.opportunities.lastVerified', {
                                date: formatters.date(record.lastVerifiedAt),
                              })
                        }
                      />
                    ),
                  },
                ]}
              />

              {record.affiliate.isAffiliate ? (
                <p className="text-body-sm text-text-tertiary border-border-subtle border-t pt-3">
                  {t('growth.tools.affiliateDisclosure')}
                </p>
              ) : null}
            </article>
          );
        })
      )}

      <SettingsPanel title={t('billing.mediaGeneration.title')}>
        <p className="text-body-md text-text-secondary max-w-[68ch]">
          {t('billing.mediaGeneration.explanation')}
        </p>
      </SettingsPanel>
    </div>
  );
}
