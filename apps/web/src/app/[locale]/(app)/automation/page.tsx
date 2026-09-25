import type { Metadata } from 'next';
import { getRequestIntl } from '@/lib/i18n/server';
import type { ReactElement } from 'react';

import { RulesListScreen } from '@/features/automation/rules-list-screen';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('automation.title') };
}

export default function AutomationRulesPage(): ReactElement {
  return <RulesListScreen />;
}
