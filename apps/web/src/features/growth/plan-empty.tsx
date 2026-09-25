'use client';

/**
 * Step three, before there is a plan.
 *
 * This used to be a dead end. A person filled in the intake, confirmed every
 * assumption we read back to them, arrived at the last step and was told the
 * capability was not implemented, with nothing to press. It was implemented:
 * the gateway that generates a plan had been there the whole time and the
 * screen simply never called it.
 *
 * Four states, and the failure is split in two because the two need different
 * things from the reader. A rate limit is a wait, and it says when. Anything
 * else is a retry, and it says the confirmed profile is untouched so trying
 * again costs nothing.
 */

import type { ReactNode } from 'react';
import { EmptyState, Notice } from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import type { DescribedError } from '../settings/lib/api-error';

export interface GrowthPlanEmptyProps {
  readonly generating: boolean;
  readonly failure: DescribedError | null;
  /** Formats the instant a rate limit lifts, in the workspace's zone. */
  readonly formatDate: (instant: string) => string;
  readonly onGenerate: () => void;
}

export function GrowthPlanEmpty({
  generating,
  failure,
  formatDate,
  onGenerate,
}: GrowthPlanEmptyProps): ReactNode {
  const t = useTranslations();
  const rateLimited = failure !== null && failure.kind === 'rate-limit';

  return (
    <>
      {failure === null ? null : (
        <Notice
          liveness="alert"
          tone={rateLimited ? 'warning' : 'destructive'}
          title={
            rateLimited ? t('error.rate_limited.message') : t('growth.ui.plan.generateFailedTitle')
          }
          description={
            rateLimited && failure.resetAt !== null
              ? t('error.rate_limited.action', { time: formatDate(failure.resetAt) })
              : t('growth.ui.plan.generateFailedBody')
          }
        />
      )}

      <EmptyState
        title={t('growth.ui.plan.emptyTitle')}
        description={
          generating ? t('growth.ui.plan.generatingBody') : t('growth.ui.plan.emptyBody')
        }
        example={t('growth.ui.plan.emptyExample')}
        action={
          <Button
            variant="primary"
            loading={generating}
            loadingLabel={t('growth.ui.confirm.generate')}
            onClick={onGenerate}
          >
            {t('growth.ui.confirm.generate')}
          </Button>
        }
      />
    </>
  );
}
