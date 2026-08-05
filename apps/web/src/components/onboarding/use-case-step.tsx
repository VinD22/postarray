'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Notice } from '@relay/design-system/patterns';
import { Button, Label, RadioGroup, RadioGroupItem } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { ApiError, api, type OnboardingUseCase } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';

const USE_CASES: readonly { readonly id: OnboardingUseCase; readonly labelKey: string }[] = [
  { id: 'creator', labelKey: 'onboarding.role.creator' },
  { id: 'team', labelKey: 'onboarding.role.team' },
  { id: 'agency', labelKey: 'onboarding.role.agency' },
  { id: 'developer', labelKey: 'onboarding.role.developer' },
];

/**
 * Step 4: what the workspace is for.
 *
 * This only changes the defaults we suggest, and the copy says so, because a
 * question that silently locks something is a question people answer wrongly
 * out of caution.
 */
export function UseCaseStep() {
  const t = useTranslations();
  const router = useRouter();

  const [useCase, setUseCase] = useState<OnboardingUseCase>('creator');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setPending(true);
    setError(null);
    try {
      await api.onboarding.setUseCase({ useCase });
      router.push('/onboarding/connect');
    } catch (caught) {
      setPending(false);
      setError(
        ApiError.is(caught)
          ? t(caught.messageKey, caught.messageValues)
          : t('error.internal.message'),
      );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-title-lg text-text-primary">{t('onboarding.role.title')}</h1>
        <p className="prose-measure text-body-md text-text-secondary">
          {t('onboarding.role.help')}
        </p>
      </div>

      {error === null ? null : <Notice tone="destructive" liveness="alert" title={error} />}

      <RadioGroup
        value={useCase}
        onValueChange={(next) => {
          setUseCase(next as OnboardingUseCase);
        }}
        aria-label={t('onboarding.role.title')}
        className="border-border-subtle gap-0 border-t"
      >
        {USE_CASES.map((entry) => {
          const id = `use-case-${entry.id}`;
          const selected = useCase === entry.id;
          return (
            <div
              key={entry.id}
              className={cn(
                'border-border-subtle flex items-center gap-3 border-b py-3',
                selected && 'bg-accent-subtle',
              )}
            >
              <RadioGroupItem value={entry.id} id={id} />
              <Label htmlFor={id} className="text-body-md text-text-primary">
                {t(entry.labelKey)}
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="lg"
          loading={pending}
          loadingLabel={t('auth.submit.working')}
          onClick={() => {
            void submit();
          }}
        >
          {t('action.continue')}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            router.push('/onboarding/connect');
          }}
        >
          {t('onboarding.skipForNow')}
        </Button>
      </div>
    </div>
  );
}
