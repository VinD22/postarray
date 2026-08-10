import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import type { IanaTimeZone, IsoInstant, Paginated } from '@relay/contracts';

import type { ActorContext, CalendarEntry, PublishJobView } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { publishJobIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  calendarQuerySchema,
  cancelRequestSchema,
  nextSlotQuerySchema,
  pauseRequestSchema,
  rescheduleRequestSchema,
  resumeRequestSchema,
  scheduleRequestSchema,
} from './scheduling.schemas';
import { SchedulingService } from './scheduling.service';

/**
 * Scheduling and the calendar.
 *
 * `posts:schedule` never implies `posts:publish`. A scheduled post still runs
 * through the approval policy when it dispatches, so scheduling is not a way to
 * publish later without review.
 */
@Controller('v1')
export class SchedulingController {
  constructor(private readonly scheduling: SchedulingService) {}

  /**
   * Schedule a content item. Returns the publish job with the resolved instant
   * and the zone it was chosen in, so a client never has to guess either.
   */
  @Post('schedules')
  @RequireScope('posts:schedule')
  @Idempotent()
  @HttpCode(202)
  schedule(@Actor() actor: ActorContext, @Body() body: unknown): Promise<PublishJobView> {
    return this.scheduling.schedule(actor, parseBody(scheduleRequestSchema, body));
  }

  /**
   * Move a scheduled job. When the new local time is ambiguous or does not
   * exist because of a daylight saving transition, the application layer
   * refuses until the client sends `confirmDst`, rather than picking one of the
   * two possible instants on the user's behalf.
   */
  @Post('schedules/:id/reschedule')
  @RequireScope('posts:schedule')
  @Idempotent()
  @HttpCode(200)
  reschedule(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<PublishJobView> {
    const input = parseBody(rescheduleRequestSchema, body);
    return this.scheduling.reschedule(actor, {
      jobId: parseParams(publishJobIdSchema, id),
      scheduleSpec: input.scheduleSpec,
      ...(input.confirmDst === undefined ? {} : { confirmDst: input.confirmDst }),
    });
  }

  @Post('schedules/:id/cancel')
  @RequireScope('posts:cancel')
  @Idempotent()
  @HttpCode(200)
  cancel(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<PublishJobView> {
    const { reason } = parseBody(cancelRequestSchema, body);
    return this.scheduling.cancel(actor, parseParams(publishJobIdSchema, id), reason);
  }

  /**
   * Hold a scheduled job.
   *
   * Carries `posts:schedule`, not `posts:cancel`: a pause changes when
   * something goes out, it does not destroy it, and it retracts nothing that
   * already reached a platform. The application refuses a job that is published
   * or mid-dispatch, and refuses to write over a hold the billing path placed.
   */
  @Post('schedules/:id/pause')
  @RequireScope('posts:schedule')
  @Idempotent()
  @HttpCode(200)
  pause(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<PublishJobView> {
    return this.scheduling.pause(
      actor,
      parseParams(publishJobIdSchema, id),
      parseBody(pauseRequestSchema, body),
    );
  }

  /**
   * Release a held job.
   *
   * When the original instant passed while the job was held, the application
   * refuses without an explicit `scheduleSpec` rather than publishing on the
   * spot. A client that receives that refusal should ask for a new time, not
   * retry.
   */
  @Post('schedules/:id/resume')
  @RequireScope('posts:schedule')
  @Idempotent()
  @HttpCode(200)
  resume(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<PublishJobView> {
    return this.scheduling.resume(
      actor,
      parseParams(publishJobIdSchema, id),
      parseBody(resumeRequestSchema, body),
    );
  }

  /** The calendar window. Cursor paginated, and always zone-qualified. */
  @Get('calendar')
  @RequireScope('drafts:read')
  calendar(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<Paginated<CalendarEntry>> {
    return this.scheduling.getCalendar(actor, parseQuery(calendarQuerySchema, query));
  }

  /** The next slot that respects the brand's cadence and quiet hours. */
  @Get('calendar/next-slot')
  @RequireScope('drafts:read')
  nextSlot(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<{ instant: IsoInstant; ianaTimeZone: IanaTimeZone }> {
    const input = parseQuery(nextSlotQuerySchema, query);
    return this.scheduling.nextAvailableSlot(actor, input);
  }
}
