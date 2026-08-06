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
 * completed step marked with a check, and a plain "Step 2 of 6" sentence for
 * anyone who cannot see the marks. That sentence carries the same
 * information as the rail, so a screen reader loses nothing from the rail
 * being `aria-hidden`.
 *
 * The rail behind the circles (desktop's vertical list only — the mobile
 * layout wraps into rows, where a single straight rail cannot track every
 * circle) fills toward the current step in brand blue as `currentIndex`
 * advances; the current step itself is the loud system's yellow "you are
 * here" mark, with an ink numeral via `--cta-on` in both themes. Numbered
 * circles otherwise stay ink-outlined poster marks, not filled — only the
 * current one and the rail behind it carry color.
 */
export function OnboardingStepList() {
  const t = useTranslations();
  const pathname = usePathname();

  const currentId = (ONBOARDING_STEPS.find((step) => pathname.startsWith(step.href))?.id ??
    'plan') as OnboardingStepId;
  const currentIndex = stepIndex(currentId);
  const totalSteps = ONBOARDING_STEPS.length;
  const fillPercent = totalSteps > 1 ? (currentIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <nav aria-label={t('onboarding.stepList')} className="flex flex-col gap-3">
      <p className="text-body-sm text-text-tertiary">
        {t('onboarding.progress', {
          current: currentIndex + 1,
          total: totalSteps,
        })}
      </p>

      <div className="relative">
        <div
          aria-hidden="true"
          className="border-border-default inset-inline-start-[9px] absolute top-[9px] hidden w-px lg:block"
          style={{ blockSize: 'calc(100% - 18px)' }}
        >
          <div className="relay-step-rail-fill w-px" style={{ blockSize: `${fillPercent}%` }} />
        </div>

        <ol className="relative flex flex-wrap gap-x-4 gap-y-2 lg:flex-col lg:gap-2">
          {ONBOARDING_STEPS.map((step, index) => {
            const done = index < currentIndex;
            const current = index === currentIndex;

            return (
              <li key={step.id} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    'text-label border-border-bold flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                    current && 'bg-cta text-cta-on shadow-hard-sm',
                    done && !current && 'bg-accent-subtle text-text-accent',
                    !done && !current && 'bg-surface-raised text-text-tertiary',
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
      </div>
    </nav>
  );
}
