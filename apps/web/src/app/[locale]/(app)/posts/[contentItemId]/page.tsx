import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { ReceiptScreen } from '@/features/receipts/receipt-screen';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return {
    title: intl.t.format('receipt.title'),
    description: intl.t.format('receipt.subtitle'),
  };
}

/**
 * One post: its publish job and its publication receipt.
 *
 * The route is the content item rather than the job, because that is the
 * identifier a person has in hand from the calendar, from a webhook payload and
 * from the API. The screen resolves the job and every target receipt from it.
 */
export default async function PostPage({
  params,
  searchParams,
}: {
  readonly params: Promise<{ readonly contentItemId: string }>;
  readonly searchParams: Promise<{ readonly job?: string | readonly string[] }>;
}): Promise<ReactElement> {
  const { contentItemId } = await params;
  const query = await searchParams;
  const jobId = typeof query.job === 'string' && query.job.length > 0 ? query.job : null;
  return (
    <ReceiptScreen contentItemId={contentItemId} publishJobId={jobId} calendarHref="/calendar" />
  );
}
