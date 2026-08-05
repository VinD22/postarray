/**
 * Factories.
 *
 * Every factory returns a schema-valid object from `@relay/contracts` and takes
 * an overrides object, so a test states only what it cares about and the rest
 * stays consistent. Identifiers are deterministic, so two factories that refer
 * to the same fixture agree without being wired together by hand.
 */

export {
  makeBrand,
  makeCampaign,
  makeMembership,
  makeUser,
  makeWorkspace,
  makeWorkspaceBundle,
  type BrandFixture,
  type CampaignFixture,
  type MembershipFixture,
  type UserFixture,
  type WorkspaceBundle,
  type WorkspaceFixture,
} from './workspace';

export {
  makeAllCapabilitySnapshots,
  makeCapabilitySnapshot,
  makeDriftedCapabilitySnapshot,
  type MakeCapabilitySnapshotInput,
} from './capabilities';

export {
  CONNECTION_HEALTHS,
  capabilitiesFor,
  makeConnection,
  makeConnectionSet,
  makeDestination,
  makeIneligibleInstagramConnection,
  makeMention,
  makeRevokedConnection,
  type ConnectionFixture,
  type ConnectionHealth,
  type DestinationFixture,
  type MakeConnectionInput,
  type MentionFixture,
} from './connection';

export {
  makeContentVersion,
  makeDraft,
  makeFirstComment,
  makeLink,
  makeOverriddenVariant,
  makePostVariant,
  makeRichDraft,
  makeThreadDraft,
  makeThreadItem,
  type MakeContentVersionInput,
  type MakeDraftInput,
  type MakePostVariantInput,
} from './content';

export {
  makeApprovedJob,
  makeAttempt,
  makeJob,
  makePartialReceipt,
  makePendingApprovalJob,
  makeReceipt,
  makeReceiptItem,
  makeRetryableAttempt,
  makeThreadReceipt,
  type MakeAttemptInput,
  type MakeJobInput,
  type MakeReceiptInput,
} from './publishing';

export {
  makeAccountMetrics,
  makeMetricDefinition,
  makeMetricObservation,
  makeMetricSeries,
  makePostMetrics,
  makeUnavailableObservation,
  type MakeMetricObservationInput,
} from './analytics';

export {
  makeBusinessProfile,
  makeGrowthPlan,
  makeOpportunity,
  makeTool,
  type MakeGrowthPlanInput,
} from './growth';

export {
  makeFailingValidationResult,
  makeOperationRef,
  makePage,
  makePageWithMore,
  makeValidationIssue,
  makeValidationResult,
  makeWebhookEndpoint,
  makeWebhookEnvelope,
  type MakeWebhookEnvelopeInput,
} from './api';
