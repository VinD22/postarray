import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { Suspense } from 'react';

import { QueueContainer } from '@/features/queue/queue-container';
import { QueueRouteFallback } from '@/features/queue/queue-fallback';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return {
    title: intl.t.format('queue.title'),
    description: intl.t.format('queue.subtitle'),
  };
}

/**
 * Queue rules, under Calendar.
 *
 * The queue decides when this project is willing to post, which is a fact
 * about the schedule rather than about the library or the settings, so the
 * information architecture puts it here. The container reads the session and
 * the rule list, both of which are client concerns, so it sits behind a
 * Suspense boundary whose fallback keeps the page's shape.
 */
export default function QueueRulesPage(): ReactElement {
  return (
    <Suspense fallback={<QueueRouteFallback />}>
      <QueueContainer />
    </Suspense>
  );
}
