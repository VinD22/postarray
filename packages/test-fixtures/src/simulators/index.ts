/**
 * Provider simulators.
 *
 * One in-process HTTP-level simulator per V1 provider, plus the `fake` provider
 * used by product tests. They mimic the real request and response shapes, the
 * container and polling lifecycles and the error bodies, and they can produce
 * every deterministic failure mode a connector has to survive.
 *
 * No simulator, and no test using `createSimulatorFetch`, can reach the
 * network: an unregistered host throws.
 */

export { BaseProviderSimulator, type BaseSimulatorOptions } from './engine';

export { BlueskySimulator, FakeProviderSimulator } from './atproto';
export {
  BLUESKY_DUPLICATE_ERROR,
  BLUESKY_OAUTH_SESSION,
  BLUESKY_PUBLISH_RECORD,
  BLUESKY_REFRESHED_SESSION,
  BLUESKY_REVOKE_RESPONSE,
} from './atproto-fixtures';
export { LinkedInSimulator } from './linkedin';
export { FacebookSimulator, InstagramSimulator, ThreadsSimulator } from './meta';
export { TikTokSimulator, YouTubeSimulator } from './video';
export { XSimulator } from './x';

export {
  SimulatorRegistry,
  createSimulatorFetch,
  createSimulatorRegistry,
  simulatorBaseUrls,
  type SimulatorFetch,
  type SimulatorFetchOptions,
  type SimulatorRegistryOptions,
} from './registry';

export {
  CONTAINER_STATES,
  DEFERRED_ID_POLLS,
  FAILURE_KINDS,
  RETRY_AFTER_SECONDS,
  SIMULATOR_MODES,
  SIMULATOR_MODE_HEADER,
  SLOW_ACCEPT_DELAY_MS,
  SLOW_MEDIA_POLLS,
  SimulatedNetworkError,
  isSimulatorMode,
  type ContainerState,
  type FailureKind,
  type ProviderSimulator,
  type SimulatedContainer,
  type SimulatedPost,
  type SimulatedRequest,
  type SimulatedResponse,
  type SimulatorMode,
} from './types';
