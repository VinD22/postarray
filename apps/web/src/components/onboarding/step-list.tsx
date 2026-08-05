'use client';

import { usePathname } from 'next/navigation';

import { Check } from 'lucide-react';

import { cn } from '@relay/design-system/utils';

import { useTranslations } from '@/lib/i18n';

import { ONBOARDING_STEPS, stepIndex, type OnboardingStepId } from './steps';

/**
 * The step indicator.
 *
 * An ordered list with the current step marked by `aria-current="step"`, a
 * completed step marked with a check and a word, and a plain "Step 2 of 6"
 * sentence for anyone who cannot see the marks. It is not a progress bar:
 * a bar that fills is decoration, and this has to be readable.
 */
export function OnboardingStepList() {
  const t = useTranslations();
  const pathname = usePathname();

  const currentId = (ONBOARDING_STEPS.find((step) => pathname.startsWith(step.href))?.id ??
    'plan') as OnboardingStepId;
  const currentIndex = stepIndex(currentId);

  return (
    <nav aria-label={t('onboarding.stepList')} className="flex flex-col gap-3">
      <p className="text-body-sm text-text-tertiary">
        {t('onboarding.progress', {
          current: currentIndex + 1,
          total: ONBOARDING_STEPS.length,
        })}
      </p>

      <ol className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-col lg:gap-2">
        {ONBOARDING_STEPS.map((step, index) => {
          const done = index < currentIndex;
          const current = index === currentIndex;

          return (
            <li key={step.id} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  'text-label flex size-5 shrink-0 items-center justify-center rounded-full border',
                  done && 'border-success-border bg-success-bg text-success-fg',
                  current && 'border-accent bg-accent-subtle text-text-accent',
                  !done && !current && 'border-border-default bg-surface-sunken text-text-tertiary',
                )}
              >
                {done ? <Check className="size-3" strokeWidth={3} /> : index + 1}
              </span>

              <span
                {...(current ? { 'aria-current': 'step' as const } : {})}
                className={cn(
                  'text-body-sm',
                  current ? 'text-text-primary font-medium' : 'text-text-secondary',
                )}
              >
                {t(step.labelKey)}
                {done ? <span className="sr-only"> {t('onboarding.stepComplete')}</span> : null}
                {current ? <span className="sr-only"> {t('onboarding.stepCurrent')}</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
