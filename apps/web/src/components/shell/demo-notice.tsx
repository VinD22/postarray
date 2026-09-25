'use client';

import { Notice } from '@relay/design-system/patterns';

import { isDemoMode } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';

/**
 * The demo data notice.
 *
 * Seeded example content is useful for review and dishonest if it is not
 * labelled. This banner is not dismissible, because the label has to be true
 * for as long as the data is fake.
 */
export function DemoNotice() {
  const t = useTranslations();

  if (!isDemoMode) {
    return null;
  }

  return (
    <Notice
      tone="neutral"
      title={t('scheduler.demoShort')}
      className="rounded-none border-x-0 border-t-0"
    />
  );
}
