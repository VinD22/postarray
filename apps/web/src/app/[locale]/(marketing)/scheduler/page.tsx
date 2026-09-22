import type { Metadata } from 'next';
import { SchedulerDemo } from '@/features/calendar/scheduler-demo';
import { pageMetadata } from '@/features/marketing/seo';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('scheduler.demoTitle', 'scheduler.description', '/scheduler', locale);
}

export default function SchedulerPage() {
  return <SchedulerDemo />;
}
