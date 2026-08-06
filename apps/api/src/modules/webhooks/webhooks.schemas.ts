import { webhookEventNameSchema } from '@relay/contracts';
import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination';
import {
  connectionIdSchema,
  passthroughObjectSchema,
  shortTextSchema,
  webhookEndpointIdSchema,
} from '../../common/schemas';
import { createDraftSchema } from '../content/content.schemas';

/**
 * Outbound endpoint management, and the inbound integration payload.
 *
 * Outbound: a customer chooses events and, optionally, a subset of connections.
 * The destination URL goes through the same SSRF rules as every other
 * user-supplied URL, so a customer cannot point a webhook at a cloud metadata
 * address and have us read our own instance credentials back to them.
 *
 * Inbound: a JSON payload from a customer's own system creates a draft or
 * starts a named Automation Rule. It is authenticated, and it goes through the
 * ordinary validation, account scope and approval policy. Arbitrary inbound
 * data never becomes an external publication on its own.
 */

export const createWebhookEndpointSchema = z
  .object({
    url: z.string().trim().min(1).max(2048),
    name: shortTextSchema.optional(),
    events: z.array(webhookEventNameSchema).min(1).max(32),
    /** Empty means every connection in the workspace. */
    connectionIds: z.array(connectionIdSchema).max(200).default([]),
    enabled: z.boolean().default(true),
  })
  .strict();

export const updateWebhookEndpointSchema = createWebhookEndpointSchema.partial().strict();

export const listDeliveriesQuerySchema = cursorQuerySchema.extend({
  endpointId: webhookEndpointIdSchema,
});

/**
 * The inbound integration payload.
 *
 * Exactly one of `draft` or `rule` is accepted. A payload that could mean
 * either is a payload whose blast radius is ambiguous, and an ambiguous request
 * that can publish is not a request we execute.
 */
export const inboundIntegrationSchema = z
  .object({
    /** The caller's own id for this event, used for deduplication. */
    externalEventId: z.string().trim().min(1).max(256),
    draft: createDraftSchema.optional(),
    rule: z
      .object({
        name: shortTextSchema,
        event: passthroughObjectSchema.default({}),
      })
      .strict()
      .optional(),
  })
  .strict()
  .refine((value) => (value.draft === undefined) !== (value.rule === undefined), {
    error: 'EXACTLY_ONE_OF_DRAFT_OR_RULE',
  });

export type CreateWebhookEndpointInput = z.infer<typeof createWebhookEndpointSchema>;
export type UpdateWebhookEndpointInput = z.infer<typeof updateWebhookEndpointSchema>;
export type InboundIntegrationInput = z.infer<typeof inboundIntegrationSchema>;
