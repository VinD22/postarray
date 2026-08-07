import {
  ID_PREFIXES,
  idSchema,
  ianaTimeZoneSchema,
  isoInstantSchema,
  localeSchema,
  publishStateSchema,
  providerIdSchema,
  scopeSchema,
} from '@relay/contracts';
import { z } from 'zod';

/**
 * Route parameter and query schemas shared by more than one module.
 *
 * Every identifier is parsed with its own prefix, so `GET /v1/brands/conn_...`
 * is a 422 at the edge and never becomes a lookup. That is cheap, and it keeps
 * a malformed identifier from ever reaching a repository.
 */

export const workspaceIdSchema = idSchema(ID_PREFIXES.workspace);
export const brandIdSchema = idSchema(ID_PREFIXES.brand);
export const connectionIdSchema = idSchema(ID_PREFIXES.connection);
export const contentItemIdSchema = idSchema(ID_PREFIXES.contentItem);
export const postVariantIdSchema = idSchema(ID_PREFIXES.postVariant);
export const mediaIdSchema = idSchema(ID_PREFIXES.media);
export const publishJobIdSchema = idSchema(ID_PREFIXES.publishJob);
export const receiptIdSchema = idSchema(ID_PREFIXES.receipt);
export const approvalIdSchema = idSchema(ID_PREFIXES.approval);
export const ruleIdSchema = idSchema(ID_PREFIXES.rule);
export const feedIdSchema = idSchema(ID_PREFIXES.feed);
export const shortLinkIdSchema = idSchema(ID_PREFIXES.shortLink);
export const apiKeyIdSchema = idSchema(ID_PREFIXES.apiKey);
export const oauthClientIdSchema = idSchema(ID_PREFIXES.oauthClient);
export const oauthGrantIdSchema = idSchema(ID_PREFIXES.oauthGrant);
export const webhookEndpointIdSchema = idSchema(ID_PREFIXES.webhookEndpoint);
export const webhookDeliveryIdSchema = idSchema(ID_PREFIXES.webhookDelivery);
export const growthProfileIdSchema = idSchema(ID_PREFIXES.growthProfile);
export const growthPlanIdSchema = idSchema(ID_PREFIXES.growthPlan);
export const membershipIdSchema = idSchema(ID_PREFIXES.membership);
export const campaignIdSchema = idSchema(ID_PREFIXES.campaign);
export const experimentIdSchema = idSchema(ID_PREFIXES.experiment);
export const setIdSchema = idSchema(ID_PREFIXES.set);
export const signatureIdSchema = idSchema(ID_PREFIXES.signature);
export const userIdSchema = idSchema(ID_PREFIXES.user);
export const agentConfirmationIdSchema = idSchema(ID_PREFIXES.agentConfirmation);
export const dataExportIdSchema = idSchema(ID_PREFIXES.dataExport);

/** A single path parameter named `id`, validated against its prefix. */
export function idParamSchema(schema: z.ZodType<string>): z.ZodObject<{ id: z.ZodType<string> }> {
  return z.object({ id: schema }).strict();
}

export const stateFilterSchema = publishStateSchema.optional();
export const providerFilterSchema = providerIdSchema.optional();

export { ianaTimeZoneSchema, isoInstantSchema, localeSchema, scopeSchema };

/**
 * Free text that a person typed. Bounded so an oversized field is rejected at
 * the edge rather than in a database driver, and never interpreted as markup or
 * as an identifier.
 */
export const shortTextSchema = z.string().trim().min(1).max(200);
export const mediumTextSchema = z.string().trim().min(1).max(2000);
export const noteSchema = z.string().trim().max(2000);

/** An opaque, already-validated payload forwarded to an application service. */
export const passthroughObjectSchema = z.record(z.string(), z.unknown());
