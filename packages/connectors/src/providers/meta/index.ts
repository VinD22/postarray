/**
 * The Meta family: one shared Graph client and OAuth definition, three separate adapters
 * with three separate permission sets, account rules and capability snapshots.
 */

export {
  GRAPH_BASE,
  GRAPH_VERSION,
  PAGE_PUBLISH_TASKS,
  THREADS_GRAPH_BASE,
  THREADS_GRAPH_VERSION,
  canPublishToPage,
  createMetaClient,
  metaContainerSchema,
  metaContainerStatusSchema,
  metaErrorSchema,
  metaPageSchema,
  metaPagesResponseSchema,
  metaPublishSchema,
  metaRemediation,
  metaUserMessage,
  type MetaClient,
  type MetaContainerStatus,
  type MetaError,
  type MetaPage,
  type MetaSurface,
} from './graph.js';

export {
  FACEBOOK_SCOPES,
  INSTAGRAM_SCOPES,
  THREADS_SCOPES,
  metaAuthorization,
  refreshMetaCredential,
} from './oauth.js';

export {
  CONTAINER_TERMINAL_STATUSES,
  assertContainerReady,
  containerStatusToPublishStatus,
  readContainerStatus,
  type ContainerStatusResult,
} from './container.js';

export * from './instagram/index.js';
export * from './facebook/index.js';
export * from './threads/index.js';
