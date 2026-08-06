import type { ReactElement, ReactNode } from 'react';

import { AutomationShell } from '@/features/automation/components/automation-shell';

/**
 * Automation holds two things that run without a person present: rules and RSS
 * feeds. Both state their limits before they can be switched on.
 */
export default function AutomationLayout({
  children,
}: {
  readonly children: ReactNode;
}): ReactElement {
  return <AutomationShell>{children}</AutomationShell>;
}
