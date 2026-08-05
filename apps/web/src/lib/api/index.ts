/**
 * The API surface every screen imports:
 *
 *   import { api, ApiError, newIdempotencyKey } from '@/lib/api';
 *   import { useConnections } from '@/lib/api/hooks';
 */

export { api, type Api } from './client.js';
export { ApiError, type ApiErrorInit, type MessageCode } from './error.js';
export { apiConfig, isDemoMode, readApiConfig, type ApiConfig } from './config.js';
export { newCorrelationId, newIdempotencyKey } from './correlation.js';
export { keys } from './keys.js';
export { ApiProvider } from './provider.js';
export { createQueryClient, queryClientConfig } from './query-client.js';
export { request, type HttpMethod, type RequestOptions } from './transport.js';
export * from './types.js';
export type { ConnectionListQuery } from './resources/connections.js';
export type { CalendarQuery, ContentListQuery } from './resources/content.js';
export type { ActionCenterQuery } from './resources/action-center.js';
export type {
  MediaAssetView,
  MediaEditInput,
  RightsDeclarationInput,
  UploadTicket,
} from './resources/media.js';
export type { ExperimentView, MetricWindow, ShortLinkStats, ShortLinkView } from './resources/insights.js';
export type {
  ApiKeyView,
  FeedInput,
  FeedView,
  OAuthAppView,
  OAuthGrantView,
  RuleInput,
  RulePreflightView,
  RuleRunView,
  RuleView,
} from './resources/platform.js';
export type { PasswordCredentials, SocialAuthProvider } from './resources/auth.js';
