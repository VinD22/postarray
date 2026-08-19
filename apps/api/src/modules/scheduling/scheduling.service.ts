import { Inject, Injectable } from '@nestjs/common';
import type { IanaTimeZone, IsoInstant, Paginated } from '@relay/contracts';

import type { ActorContext, CalendarEntry, PublishJobView, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type {
  CalendarQueryInput,
  PauseRequestInput,
  RescheduleRequestInput,
  ResumeRequestInput,
  ScheduleRequestInput,
} from './scheduling.schemas';

/**
 * Transport-level delegation for scheduling and the calendar.
 *
 * The cadence budget, the duplicate preflight, the approval policy and the
 * Temporal workflow start all sit behind `services.scheduling`. This class
 * translates a query string into that call and nothing else.
 */
@Injectable()
export class SchedulingService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  schedule(ctx: ActorContext, input: ScheduleRequestInput): Promise<PublishJobView> {
    return this.services.scheduling.schedule(ctx, input);
  }

  reschedule(
    ctx: ActorContext,
    input: RescheduleRequestInput & { jobId: string },
  ): Promise<PublishJobView> {
    return this.services.scheduling.reschedule(ctx, input);
  }

  cancel(ctx: ActorContext, jobId: string, reason: string): Promise<PublishJobView> {
    return this.services.scheduling.cancel(ctx, { jobId, reason });
  }

  pause(ctx: ActorContext, jobId: string, input: PauseRequestInput): Promise<PublishJobView> {
    return this.services.scheduling.pause(ctx, {
      jobId,
      ...(input.note === undefined ? {} : { note: input.note }),
    });
  }

  resume(ctx: ActorContext, jobId: string, input: ResumeRequestInput): Promise<PublishJobView> {
    return this.services.scheduling.resume(ctx, {
      jobId,
      ...(input.scheduleSpec === undefined ? {} : { scheduleSpec: input.scheduleSpec }),
      ...(input.confirmDst === undefined ? {} : { confirmDst: input.confirmDst }),
    });
  }

  getCalendar(ctx: ActorContext, query: CalendarQueryInput): Promise<Paginated<CalendarEntry>> {
    const { from, to, cursor, limit, ...filters } = query;
    return this.services.scheduling.getCalendar(ctx, {
      from,
      to,
      filters,
      ...(cursor === undefined ? {} : { cursor }),
      ...(limit === undefined ? {} : { limit }),
    });
  }

  nextAvailableSlot(
    ctx: ActorContext,
    input: { projectId: string; after?: IsoInstant },
  ): Promise<{ instant: IsoInstant; ianaTimeZone: IanaTimeZone }> {
    return this.services.scheduling.nextAvailableSlot(ctx, input);
  }
}
