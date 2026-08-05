'use client';

import type { ReactNode } from 'react';
import { Checkbox } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { GrowthPlan } from '@relay/contracts';

import { SettingsPanel } from '../../settings/components/section';

export interface UgcTabProps {
  plan: GrowthPlan;
}

/**
 * One UGC campaign, planned end to end.
 *
 * The rights and consent checklist is a real checklist rather than a paragraph,
 * because it is a sequence of things a person has to actually do before
 * anything is published, and because a missed item is a legal problem rather
 * than a quality problem.
 */
export function UgcTab({ plan }: UgcTabProps): ReactNode {
  const t = useTranslations();
  const ugc = plan.ugc_plan;

  return (
    <div className="flex flex-col gap-6">
      <Notice tone="neutral" title={t('growth.ui.ugc.honesty')} />

      <SettingsPanel title={t('growth.ugc.goal')}>
        <p className="text-body-lg text-text-primary max-w-[68ch]">{ugc.goal}</p>
      </SettingsPanel>

      <SettingsPanel title={t('growth.ugc.participant')}>
        <p className="text-body-md text-text-primary max-w-[68ch]">{ugc.participantProfile}</p>
      </SettingsPanel>

      <SettingsPanel title={t('growth.ugc.prompts')}>
        <ol className="flex flex-col">
          {ugc.promptAngles.map((angle, index) => (
            <li
              key={angle}
              className="border-border-subtle flex flex-col gap-0.5 border-b py-2.5 last:border-b-0"
            >
              <span className="text-label text-text-tertiary">
                {t('growth.ui.ugc.promptAngle', { number: index + 1 })}
              </span>
              <span className="text-body-md text-text-primary max-w-[68ch]">{angle}</span>
            </li>
          ))}
        </ol>
      </SettingsPanel>

      <SettingsPanel title={t('growth.ugc.brief')}>
        <p className="text-body-md text-text-primary max-w-[68ch] whitespace-pre-line">
          {ugc.brief}
        </p>
      </SettingsPanel>

      <SettingsPanel
        title={t('growth.ui.ugc.checklistTitle')}
        description={t('growth.ui.ugc.checklistHelp')}
      >
        <ul className="flex flex-col">
          {ugc.consentChecklist.map((item) => (
            <li key={item}>
              <label className="text-body-md text-text-primary flex min-h-11 items-start gap-2 py-1">
                <Checkbox className="mt-1" />
                <span className="max-w-[62ch]">{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </SettingsPanel>

      <SettingsPanel title={t('growth.ugc.incentive')}>
        <p className="text-body-md text-text-primary max-w-[68ch]">
          {ugc.incentive ?? t('growth.ui.ugc.incentiveNone')}
        </p>
        {ugc.incentive === null ? null : (
          <Notice tone="warning" title={t('growth.ui.ugc.incentiveDisclosure')} />
        )}
      </SettingsPanel>

      <SettingsPanel title={t('growth.ugc.review')}>
        <p className="text-body-md text-text-primary max-w-[68ch]">{ugc.reviewWorkflow}</p>
      </SettingsPanel>

      <SettingsPanel title={t('growth.ugc.reuse')}>
        <p className="text-body-md text-text-secondary max-w-[68ch]">{t('growth.ugc.boundary')}</p>
      </SettingsPanel>
    </div>
  );
}
