import Link from 'next/link';

import { EmptyState } from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';

import { getRequestIntl } from '@/lib/i18n/server';

export default async function NotFound() {
  const intl = await getRequestIntl();

  return (
    <main id="main" className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 md:p-8">
      <EmptyState
        title={intl.t.format('error.not_found.message')}
        description={intl.t.format('error.not_found.action')}
        action={
          <Button variant="primary" asChild>
            <Link href="/">{intl.t.format('nav.home')}</Link>
          </Button>
        }
      />
    </main>
  );
}
