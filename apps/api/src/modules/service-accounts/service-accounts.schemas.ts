import { approvalLevelSchema, scopeSchema } from '@relay/contracts';
import { z } from 'zod';

import {
  connectionIdSchema,
  localeSchema,
  projectIdSchema,
  shortTextSchema,
} from '../../common/schemas';

/**
 * Service accounts: the identity an agent acts as.
 *
 * Every field below narrows and none of them widens. An account created by an
 * owner does not inherit the owner's powers: it gets exactly the scopes named
 * here, intersected with what the creator actually holds, recomputed on every
 * request against the creator's live role.
 *
 * `expiresInDays` may be null, which means "the maximum we allow" (365 days)
 * and never "forever". The response carries the real expiry date, so a person
 * who asked for no expiry is told the date rather than left believing there
 * isn't one.
 *
 * Quiet hours are accepted but must describe a full day. The window has no
 * column in `app.service_accounts`, and accepting a restriction we cannot
 * store is accepting one the refusal path will never apply; the application
 * layer answers `not_implemented` for a narrower window.
 */

export const MAX_SERVICE_ACCOUNT_LIFETIME_DAYS = 365;

const hourMinuteSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/u, {
  error: 'INVALID_TIME_OF_DAY',
});

export const createServiceAccountSchema = z
  .object({
    name: shortTextSchema,
    purpose: z.string().trim().max(2000).default(''),
    scopes: z.array(scopeSchema).min(1).max(32),
    /** Narrowing only. An empty array means "no narrowing", not "none allowed". */
    projectIds: z.array(projectIdSchema).max(200).default([]),
    connectionIds: z.array(connectionIdSchema).max(200).default([]),
    contentLocales: z.array(localeSchema).max(50).default([]),
    allowedDomains: z.array(z.string().trim().min(1).max(253)).max(100).default([]),
    /** External publications per rolling day. Null means no cadence ceiling. */
    maxPostsPerDay: z.number().int().min(0).max(200).nullable().default(null),
    lookAheadDays: z.number().int().min(0).max(365).nullable().default(null),
    quietHoursStart: hourMinuteSchema.default('00:00'),
    quietHoursEnd: hourMinuteSchema.default('00:00'),
    approvalLevel: approvalLevelSchema.default('level_1_draft'),
    expiresInDays: z
      .number()
      .int()
      .min(1)
      .max(MAX_SERVICE_ACCOUNT_LIFETIME_DAYS)
      .nullable()
      .default(90),
  })
  .strict();

export const setServiceAccountEnabledSchema = z.object({ enabled: z.boolean() }).strict();

/**
 * A rehearsal request.
 *
 * `args` is an opaque record on purpose: the playground is where a person finds
 * out that a call would be refused, so it must accept the arguments they are
 * about to send rather than only the ones we can validate. Nothing is executed,
 * so nothing here reaches a provider.
 */
export const serviceAccountDryRunSchema = z
  .object({
    tool: z.string().trim().min(1).max(64),
    args: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();

export type CreateServiceAccountRequest = z.infer<typeof createServiceAccountSchema>;
export type ServiceAccountDryRunRequest = z.infer<typeof serviceAccountDryRunSchema>;
