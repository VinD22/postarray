import type { ReactElement } from 'react';

import { CalendarRouteFallback } from '@/features/calendar/calendar-fallback';

export default function CalendarLoading(): ReactElement {
  return <CalendarRouteFallback />;
}
