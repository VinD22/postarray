import type { Metadata } from 'next';

import { PlanStep } from '@/components/onboarding/plan-step';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('onboarding.plan.title') };
}

export default function Page() {
  return <PlanStep />;
}
