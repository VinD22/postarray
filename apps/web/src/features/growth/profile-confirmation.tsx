'use client';

import { useState, type ReactNode } from 'react';
import { Badge, Button, Input } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { BusinessProfile } from '@relay/contracts';
import { AlertCircle, Check, HelpCircle } from 'lucide-react';

import { SettingsPanel } from '../settings/components/section.js';

export interface ProfileConfirmationProps {
  profile: BusinessProfile;
  saving: boolean;
  onConfirm: (input: {
    profileId: string;
    confirmedAssumptionIds: readonly string[];
    corrections: Readonly<Record<string, string>>;
  }) => void;
}

/**
 * Reading the profile back before anything is generated.
 *
 * Facts, assumptions and gaps are three visually separate lists with three
 * different icons and three different words. An assumption is only promoted to
 * a fact by an explicit action here, and a correction is stored as the user's
 * own sentence rather than as an edit to a model output.
 */
export function ProfileConfirmation({
  profile,
  saving,
  onConfirm,
}: ProfileConfirmationProps): ReactNode {
  const t = useTranslations();
  const [confirmed, setConfirmed] = useState<readonly string[]>([]);
  const [corrections, setCorrections] = useState<Record<string, string>>({});
  const [correcting, setCorrecting] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <Notice tone="neutral" title={t('growth.profile.neverInferClaims')} />

      <SettingsPanel
        title={t('growth.ui.confirm.factsTitle')}
        description={t('growth.ui.confirm.factsHelp')}
      >
        {profile.facts.length === 0 ? (
          <p className="text-body-md text-text-secondary">{t('common.none')}</p>
        ) : (
          <ul className="flex flex-col">
            {profile.facts.map((fact) => (
              <li
                key={fact.id}
                className="flex items-start gap-2 border-b border-border-subtle py-2.5 last:border-b-0"
              >
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success-fg" />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-body-md text-text-primary">{fact.statement}</span>
                  <span className="text-body-sm text-text-tertiary">
                    {t('growth.profile.fact')}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </SettingsPanel>

      <SettingsPanel
        title={t('growth.ui.confirm.assumptionsTitle')}
        description={t('growth.ui.confirm.assumptionsHelp')}
      >
        {profile.assumptions.length === 0 ? (
          <p className="text-body-md text-text-secondary">{t('common.none')}</p>
        ) : (
          <ul className="flex flex-col">
            {profile.assumptions.map((assumption) => {
              const isConfirmed = confirmed.includes(assumption.id);
              return (
                <li
                  key={assumption.id}
                  className="flex flex-col gap-2 border-b border-border-subtle py-3 last:border-b-0"
                >
                  <div className="flex items-start gap-2">
                    <HelpCircle
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-warning-fg"
                    />
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-body-md text-text-primary">
                        {corrections[assumption.id] ?? assumption.statement}
                      </span>
                      <span className="flex flex-wrap items-center gap-2">
                        <Badge tone={isConfirmed ? 'success' : 'warning'}>
                          {isConfirmed
                            ? t('growth.profile.fact')
                            : t('growth.profile.assumption')}
                        </Badge>
                        <span className="text-body-sm text-text-tertiary">
                          {t('growth.ui.confirm.confidence', {
                            level: t(
                              `growth.ui.confirm.confidence.${assumption.confidence}`,
                            ),
                          })}
                        </span>
                      </span>
                    </span>
                  </div>

                  {correcting === assumption.id ? (
                    <div className="flex flex-col gap-2 ps-6 sm:flex-row sm:items-center">
                      <Input
                        aria-label={t('growth.ui.confirm.correctLabel')}
                        defaultValue={corrections[assumption.id] ?? assumption.statement}
                        onBlur={(event) =>
                          setCorrections((current) => ({
                            ...current,
                            [assumption.id]: event.target.value,
                          }))
                        }
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setCorrecting(null)}
                      >
                        {t('action.done')}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 ps-6">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isConfirmed}
                        onClick={() =>
                          setConfirmed((current) => [...current, assumption.id])
                        }
                      >
                        {t('growth.ui.confirm.promote')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCorrecting(assumption.id)}
                      >
                        {t('growth.ui.confirm.correct')}
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </SettingsPanel>

      <SettingsPanel
        title={t('growth.ui.confirm.missingTitle')}
        description={t('growth.ui.confirm.missingHelp')}
      >
        <ul className="flex flex-col">
          <li className="flex items-start gap-2 py-2 text-body-md text-text-secondary">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {profile.proofAssets.length === 0
              ? t('growth.ui.intake.proofNoneEffect')
              : t('common.none')}
          </li>
        </ul>
      </SettingsPanel>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="primary"
          loading={saving}
          onClick={() =>
            onConfirm({
              profileId: profile.id,
              confirmedAssumptionIds: confirmed,
              corrections,
            })
          }
        >
          {t('growth.ui.confirm.generate')}
        </Button>
      </div>
    </div>
  );
}
