import type { ReactElement, ReactNode } from 'react';

import { AnalyticsShell } from '@/features/analytics/components/analytics-shell';

/**
 * Analytics is three destinations behind one header: the overview, the
 * experiments a user planned before publishing, and tracked links, which are a
 * separate first party measurement and never mixed with provider figures.
 */
export default function AnalyticsLayout({
  children,
}: {
  readonly children: ReactNode;
}): ReactElement {
  return <AnalyticsShell>{children}</AnalyticsShell>;
}
