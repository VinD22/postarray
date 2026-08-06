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
    <div className="mx-auto flex w-full max-w-[90rem] flex-col lg:flex-row lg:items-start">
      <SettingsNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
