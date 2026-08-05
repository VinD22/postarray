'use client';

import type { ReactNode } from 'react';
import { Badge, Button } from '@relay/design-system/primitives';
import { DefinitionList, EmptyState, FreshnessLabel, Notice } from '@relay/design-system/patterns';
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
        recommendations.map((recommendation) => {
          const record = byId.get(recommendation.toolId);
          if (record === undefined) {
            return null;
          }
          const stale = staleIds.has(record.id);
          return (
            <SettingsPanel
              key={record.id}
              title={
                <span className="flex flex-wrap items-center gap-2">
                  {record.name}
                  {stale ? <Badge tone="warning">{t('growth.ui.tools.stale')}</Badge> : null}
                </span>
              }
              actions={
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
              }
              footnote={
                record.affiliate.isAffiliate ? t('growth.tools.affiliateDisclosure') : undefined
              }
            >
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
            </SettingsPanel>
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
