import {
  adaptDraftTextInputSchema,
  assistantTurnRequestSchema,
  checkPlatformFitInputSchema,
  draftPostInputSchema,
  planWeekInputSchema,
  reportFailuresInputSchema,
  reportWeekInputSchema,
  requestApprovalInputSchema,
  schedulePostInputSchema,
  suggestCaptionInputSchema,
} from '@relay/contracts';

/**
 * The assistant's request payloads.
 *
 * Every one of them is the shared contract from `@relay/contracts`, re-exported
 * rather than restated, because the in-app assistant and an external agent must
 * be validated against the same shapes. A second schema here would be a second
 * definition of what the assistant accepts.
 *
 * There is no streaming variant. Nothing in this API streams today: the problem
 * filter, the idempotency interceptor and the context enrichment interceptor
 * all assume one whole response body, and inventing a transport for one
 * endpoint would put the assistant outside the conventions every other route
 * follows. A turn is a single request and a single response.
 */
export {
  adaptDraftTextInputSchema,
  assistantTurnRequestSchema,
  checkPlatformFitInputSchema,
  draftPostInputSchema,
  planWeekInputSchema,
  reportFailuresInputSchema,
  reportWeekInputSchema,
  requestApprovalInputSchema,
  schedulePostInputSchema,
  suggestCaptionInputSchema,
};
