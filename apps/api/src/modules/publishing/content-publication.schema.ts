import { providerIdSchema, publishJobSchema, publishStateSchema } from '@relay/contracts';
import { z } from 'zod';

/** Response shape of `GET /v1/content/{id}/publication`, for the OpenAPI catalog. */
export const contentPublicationTargetSchema = z
  .object({
    postVariantId: z.string().nullable(),
    connectionId: z.string(),
    provider: providerIdSchema,
    accountLabel: z.string().nullable(),
    job: publishJobSchema,
    jobCount: z.number().int().min(1),
    final: z.boolean(),
    retryable: z.boolean(),
    receiptId: z.string().nullable(),
    externalPostId: z.string().nullable(),
    permalink: z.string().nullable(),
    publishedAt: z.string().nullable(),
    failureCode: z.string().nullable(),
  })
  .strict();

export const contentPublicationSchema = z
  .object({
    contentItemId: z.string(),
    state: publishStateSchema,
    settled: z.boolean(),
    createdByName: z.string().nullable(),
    targets: z.array(contentPublicationTargetSchema),
  })
  .strict();
