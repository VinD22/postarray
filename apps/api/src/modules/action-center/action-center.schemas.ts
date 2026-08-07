import { isoInstantSchema, providerIdSchema } from '@relay/contracts';
import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination';

export const actionCenterQuerySchema = cursorQuerySchema
  .extend({
    category: z.enum(['connections', 'publishing', 'automation', 'billing']).optional(),
    includeSnoozed: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
  })
  .strict();

export const snoozeActionSchema = z.object({ until: isoInstantSchema }).strict();

export const actionItemSchema = z
  .object({
    id: z.string().min(1).max(255),
    kind: z.enum([
      'connection_expiring',
      'connection_action_required',
      'validation_failed',
      'approval_overdue',
      'schedule_conflict',
      'provider_incident',
      'comment_failed',
      'analytics_stale',
      'rss_stalled',
      'webhook_failing',
      'usage_balance',
    ]),
    urgency: z.enum(['now', 'soon', 'watching']),
    category: z.enum(['connections', 'publishing', 'automation', 'billing']),
    subject: z.string().min(1),
    provider: providerIdSchema.nullable(),
    createdAt: isoInstantSchema,
    dueAt: isoInstantSchema.nullable(),
    snoozedUntil: isoInstantSchema.nullable(),
    href: z.string().min(1),
    values: z.record(z.string(), z.union([z.string(), z.number()])),
  })
  .strict();
