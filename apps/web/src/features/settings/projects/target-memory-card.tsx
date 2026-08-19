'use client';

/**
 * The project opt in for remembering channel selections.
 *
 * The copy carries the weight here. This is a setting one person turns on for
 * everybody in a project, so the card has to say three things without being
 * asked: it is off unless you turn it on, only channel identifiers are stored
 * and only for the person who picked them, and turning it off deletes what was
 * already stored rather than hiding it.
 *
 * The switch is not optimistic. A privacy setting that appears to be off while
 * the server still has it on would be a lie in the most costly possible place.
 */

import { useState, type ReactNode } from 'react';
import { Button, Notice, Switch } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

import { useSetTargetMemory } from './use-target-memory';

export interface TargetMemoryCardProps {
  projectId: string;
  /** The project's current setting, read from the project record. */
  enabled: boolean;
}

export function TargetMemoryCard({ projectId, enabled }: TargetMemoryCardProps): ReactNode {
  const t = useTranslations();
  const [confirmingOff, setConfirmingOff] = useState(false);
  const setting = useSetTargetMemory();

  const apply = (next: boolean): void => {
    setting.mutate({ projectId, enabled: next }, { onSettled: () => setConfirmingOff(false) });
  };

  return (
    <section className="border-border-subtle flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-heading-sm text-text-primary">{t('targetMemory.setting.title')}</h3>
          <p className="text-body-sm text-text-secondary">{t('targetMemory.setting.body')}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-body-sm text-text-secondary">
            {enabled ? t('targetMemory.setting.enabled') : t('targetMemory.setting.disabled')}
          </span>
          <Switch
            checked={enabled}
            disabled={setting.isPending}
            aria-label={t('targetMemory.setting.title')}
            onCheckedChange={(next) => {
              // Turning it on is immediate. Turning it off deletes other
              // people's saved selections, so it asks first.
              if (next) {
                apply(true);
                return;
              }
              setConfirmingOff(true);
            }}
          />
        </div>
      </div>

      <p className="text-body-sm text-text-tertiary">
        {enabled ? t('targetMemory.setting.stored') : t('targetMemory.setting.offNote')}
      </p>

      {confirmingOff ? (
        <div className="flex flex-col gap-3">
          <Notice
            tone="warning"
            title={t('targetMemory.setting.title')}
            description={t('targetMemory.setting.turnOffWarning')}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              loading={setting.isPending}
              loadingLabel={t('loading.default')}
              onClick={() => apply(false)}
            >
              {t('targetMemory.setting.disabled')}
            </Button>
            <Button variant="secondary" onClick={() => setConfirmingOff(false)}>
              {t('action.cancel')}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
