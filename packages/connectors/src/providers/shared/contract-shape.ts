/**
 * The single import point every provider adapter uses for the connector core.
 *
 * The core modules (`../../contract.js`, `../../http.js`, `../../errors.js`,
 * `../../oauth.js`, `../../vault.js`) are owned by the connector package author.
 * Re-exporting them here means a change in the core surface is a one file edit for the
 * adapters instead of thirty. `CONTRACT-ASSUMPTIONS.md` records the exact shape these
 * adapters were written against and the date it was written.
 */

export {
  CONNECTOR_CONTRACT_VERSION,
  type AuthorizationDefinition,
  type CanonicalPreview,
  type Clock,
  type ConnectorConfig,
  type ConnectorDeps,
  type ConnectorLogger,
  type ConnectorRegistry,
  type CredentialResult,
  type DeleteRequest,
  type DestinationRequest,
  type ExternalAccount,
  type MediaPreparationRequest,
  type MentionEntity,
  type MentionSearchRequest,
  type MetricsRequest,
  type OAuthGrant,
  type OAuthScopeDefinition,
  type PreparedMedia,
  type PreviewEntityRange,
  type ProviderConnection,
  type ProviderDestination,
  type ProviderDraft,
  type ProviderIdentity,
  type ProviderMedia,
  type ProviderThreadItem,
  type PublishItemResult,
  type PublishRequest,
  type PublishResult,
  type PublishStatus,
  type RefreshRequest,
  type RevokeRequest,
  type SocialConnector,
  type StatusRequest,
} from '../../contract.js';

export { type HttpClient, type HttpRequest, type HttpResponse } from '../../http.js';

export {
  REMEDIATION,
  ensureOk,
  parseProviderBody,
  providerFailure,
  type ProviderFailureContext,
} from '../../errors.js';

export { refreshOAuth2Token, type OAuth2RefreshInput } from '../../oauth.js';

export { type ConnectorVault, type CredentialRef } from '../../vault.js';
