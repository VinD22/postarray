/**
 * `@relay/cli`: the `relay` command.
 *
 * Everything is exported so the CLI can be driven in process by a test or by
 * another tool without spawning anything.
 */

export { VERSION, buildProgram, runCli, type RunResult } from './program.js';

export {
  DEFAULT_CLIENT_ID,
  createContext,
  requireCredential,
  systemClock,
  toIsoInstant,
  type CliContext,
  type CliDeps,
  type CliEnvironment,
  type Clock,
  type GlobalOptions,
} from './context.js';

export {
  EXIT_CODES,
  EXIT_OK,
  EXIT_UNKNOWN,
  EXIT_USAGE,
  errorCodesForExit,
  exitCodeFor,
  isRetryableExit,
} from './exit-codes.js';

export {
  createMemoryWriter,
  describe,
  processWriter,
  renderFailure,
  renderPlan,
  renderSuccess,
  renderTable,
  type JsonEnvelope,
  type PlannedExternalAction,
  type RenderInput,
  type Writer,
} from './output.js';

export {
  CONFIG_KEYS,
  EMPTY_CONFIG,
  cliConfigSchema,
  createFileConfigStore,
  createMemoryConfigStore,
  getProfileValue,
  outputModeSchema,
  profileSchema,
  resolveProfile,
  setProfileValue,
  unsetProfileValue,
  type CliConfig,
  type ConfigKey,
  type ConfigStore,
  type OutputMode,
  type Profile,
} from './config/store.js';

export {
  EMPTY_CREDENTIALS,
  FORBIDDEN_TOKEN_FLAGS,
  TOKEN_ENV_VAR,
  assertNoTokenInArgv,
  createFileCredentialStore,
  createMemoryCredentialStore,
  credentialFileSchema,
  storedCredentialSchema,
  summarize,
  type CredentialFile,
  type CredentialStore,
  type CredentialSummary,
  type StoredCredential,
} from './config/credentials.js';

export {
  CONFIG_DIR_NAME,
  CONFIG_FILE_NAME,
  CREDENTIALS_FILE_NAME,
  configDir,
  configFilePath,
  credentialsFilePath,
} from './config/paths.js';

export {
  DEFAULT_TIMEOUT_MS,
  createApiClient,
  toRelayError,
  type ApiClient,
  type ApiClientOptions,
  type ApiResult,
  type FetchLike,
  type RequestOptions,
} from './api/client.js';

export { DISCOVERY_PATHS, ROUTES } from './api/routes.js';

export {
  authorizationCodeLogin,
  createFetchTransport,
  createPkcePair,
  deviceLogin,
  discoverAuthorizationServer,
  revokeToken,
  type AuthorizationServerMetadata,
  type DeviceAuthorization,
  type LoginResult,
  type OAuthTransport,
} from './auth/oauth.js';

export {
  draftDocumentSchema,
  externalPublicationCount,
  readDraftFile,
  type DraftDocument,
  type DraftTarget,
} from './draft.js';

export {
  BULK_ACCOUNT_THRESHOLD,
  BULK_PUBLICATION_THRESHOLD,
  assessBulk,
  type BulkAssessment,
} from './commands/posts.js';

export { DEFAULT_LOGIN_SCOPES, type LoginFlow } from './commands/auth.js';
