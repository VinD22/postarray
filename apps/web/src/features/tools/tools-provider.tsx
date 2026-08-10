'use client';

import type { ReactElement, ReactNode } from 'react';
import { I18nProvider } from '@relay/i18n/react';
import type { PartialCatalog } from '@relay/i18n/messages';

/**
 * Message context for the interactive part of a tool page.
 *
 * The rest of the marketing site formats every string on the server and passes
 * finished text down. A tool cannot: the number in "over by 12 characters" does
 * not exist until the reader types. This provider carries the `web.tools.`
 * slice of the catalog so those sentences stay ICU messages rather than becoming
 * string concatenation in a component.
 *
 * The time zone is UTC because no message in this slice renders a date from
 * context. The time zone planner takes every zone it formats as an argument.
 */

export interface ToolsProviderProps {
  readonly locale: string;
  readonly catalog: PartialCatalog;
  readonly children: ReactNode;
}

export function ToolsProvider({ locale, catalog, children }: ToolsProviderProps): ReactElement {
  return (
    <I18nProvider locale={locale} catalog={catalog} timeZone="UTC">
      {children}
    </I18nProvider>
  );
}
