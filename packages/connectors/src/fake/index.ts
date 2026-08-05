/**
 * The fake provider: a complete connector with no credentials, used by seeds,
 * tests, the local development loop and the MCP sandbox.
 */

export {
  FAKE_ALLOWED_MIME_TYPES,
  FAKE_CAPABILITY_VERSION,
  FAKE_CHARACTERS_PER_LINK,
  FAKE_CONTENT_KINDS,
  FAKE_FIRST_COMMENT_MIN_DELAY_SECONDS,
  FAKE_MAX_ALT_TEXT,
  FAKE_MAX_BYTES,
  FAKE_MAX_IMAGES,
  FAKE_MAX_MENTIONS,
  FAKE_MAX_THREAD_ITEMS,
  FAKE_MAX_VIDEOS,
  FAKE_MAX_VIDEO_SECONDS,
  FAKE_MIN_VIDEO_SECONDS,
  FAKE_PRIVACY_OPTIONS,
  FAKE_TEXT_MAX_LENGTH,
  buildFakeCapabilitySnapshot,
  type FakeCapabilityOverrides,
} from './capabilities.js';

export {
  DEFAULT_FAKE_ACCOUNTS,
  DEFAULT_FAKE_DESTINATIONS,
  DEFAULT_FAKE_MENTIONS,
  FAKE_FAILURE_MODES,
  FakeProviderState,
  mulberry32,
  type FakeAccount,
  type FakeContainer,
  type FakeDestination,
  type FakeFailureMode,
  type FakeMention,
  type FakePost,
  type FakeProviderStateOptions,
  type FakeUpload,
} from './state.js';

export { buildFakePreview, validateFakeDraft } from './validate.js';

export { FakeConnector, createFakeConnector, type FakeConnectorOptions } from './connector.js';

export {
  FAKE_CONNECTION_ID,
  FAKE_CONTENT_ITEM_ID,
  FAKE_CONTENT_VERSION_ID,
  FAKE_POST_VARIANT_ID,
  FAKE_WORKSPACE_ID,
  fakeConnectionRef,
  fakeDraft,
  fakeImageAsset,
  fakeMediaPreparationRequest,
  fakeMetricsRequest,
  fakePreparedMedia,
  fakePublishRequest,
  fakeStatusRequest,
  fakeThreadItem,
  fakeVideoAsset,
  type FakeDraftOptions,
} from './fixtures.js';
