import type { ReactNode } from 'react';

import { SettingsNav } from '@/features/settings/components/settings-nav';

/**
 * The settings shell.
 *
 * At 1024px and above the section list sits beside the content as a rail. Below
 * that it becomes a single scrolling strip above the content, so a narrow
 * screen never has to open a menu to change section and the page itself never
 * scrolls sideways.
 */
export default function SettingsLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <div className="bg-surface-sunken mx-auto grid w-full max-w-[90rem] gap-3 p-3 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
      <SettingsNav />
      <div className="border-border-default bg-surface-canvas min-w-0 overflow-hidden rounded-lg border">
        {children}
      </div>
    </div>
  );
}
