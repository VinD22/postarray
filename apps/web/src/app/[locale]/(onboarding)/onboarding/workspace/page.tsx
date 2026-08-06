import type { Metadata } from 'next';

import { WorkspaceStep } from '@/components/onboarding/workspace-step';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('onboarding.workspace.title') };
}

export default function Page() {
  return <WorkspaceStep />;
}
