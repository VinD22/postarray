/**
 * The single import point every provider adapter uses for the connector core.
 *
 * The core modules (`../../contract.js`, `../../http.js`, `../../errors.js`,
 * `../../oauth.js`, `../../vault.js`) are owned by the connector package author.
 * Re-exporting them here means a change in the core surface is a one file edit for the
 * adapters instead of thirty. `CONTRACT-ASSUMPTIONS.md` records the exact shape these
 * adapters were written against and the date it was written.
 *
 * Two names are aliases the adapters were written to. They point at the contract types
 * verbatim, so there is exactly one definition of each shape:
 *
 * - `ProviderConnection` is `ConnectionRef`.
 * - `OAuthGrant` is `OAuthGrantInput`.
 */

export {
  CONNECTOR_CONTRACT_VERSION,
  NOT_IMPLEMENTED_FEATURES,
  type AuthorizationDefinition,
  type CanonicalPreview,
  type CapabilitySnapshot,
  type Clock,
  type ConnectionRef,
  type ConnectorConfig,
  type ConnectorDeps,
  type ConnectorFeature,
  type ConnectorLabel,
  type ConnectorLogger,
  type ConnectorRegistry,
  type CredentialResult,
  type DeleteRequest,
  type DestinationRequest,
  type ExternalAccount,
  type FailedItem,
  type MediaPreparationRequest,
  type MediaUploadState,
  type MentionEntity,
  type MentionKind,
  type MentionSearchRequest,
  type MetricsRequest,
  // The adapters were written against these two names.
  type ConnectionRef as ProviderConnection,
  type OAuthGrantInput as OAuthGrant,
  type OAuthGrantInput,
  type OAuthScopeDefinition,
  type PreparedMedia,
  type PreviewEntityRange,
  type ProviderDestination,
  type ProviderDraft,
  type ProviderErrorSummary,
  type ProviderIdentity,
  type ProviderMedia,
  type ProviderMediaRef,
  type ProviderThreadItem,
  type PublishItemResult,
  type PublishRequest,
  type PublishResult,
  type PublishStatus,
  type PublishedItem,
  type RefreshRequest,
  type RevokeRequest,
  type SocialConnector,
  type StatusRequest,
} from '../../contract';

export { type HttpClient, type HttpRequest, type HttpResponse } from '../../http';

export {
  REMEDIATION,
  ensureOk,
  parseProviderBody,
  providerFailure,
  type ProviderFailureContext,
  type RemediationCode,
} from '../../errors';

export { refreshOAuth2Token, revokeCredential, type OAuth2RefreshInput } from '../../oauth';

export {
  SecretValue,
  type ConnectorVault,
  type CredentialRef,
  type SecretHandle,
} from '../../vault';
