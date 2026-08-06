/**
 * The API surface every screen imports:
 *
 *   import { api, ApiError, newIdempotencyKey } from '@/lib/api';
 *   import { useConnections } from '@/lib/api/hooks';
 */

export { api, type Api } from './client';
export { ApiError, type ApiErrorInit, type MessageCode } from './error';
export { apiConfig, isDemoMode, readApiConfig, type ApiConfig } from './config';
export { newCorrelationId, newIdempotencyKey } from './correlation';
export { keys } from './keys';
export { ApiProvider } from './provider';
export { createQueryClient, queryClientConfig } from './query-client';
export { request, type HttpMethod, type RequestOptions } from './transport';
export * from './types';
export type { ConnectionListQuery } from './resources/connections';
export type { CalendarQuery, ContentListQuery } from './resources/content';
export type { ActionCenterQuery } from './resources/action-center';
export type {
  MediaAssetView,
  MediaEditOperation,
  RightsDeclarationInput,
  UploadTicket,
} from './resources/media';
export type {
  ExperimentView,
  MetricWindow,
  ShortLinkStats,
  ShortLinkView,
} from './resources/insights';
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
} from './resources/platform';
export type { EstablishedSession, PasswordCredentials } from './resources/auth';
