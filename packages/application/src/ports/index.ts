/**
 * Default, local implementations of every outbound port.
 *
 * With these the whole product runs on a laptop with a database and nothing
 * else: no Redis, no object store, no SMTP, no Temporal. Each has a production
 * counterpart that is wired in by the process that owns the connection.
 */

export { FixedClock, systemClock } from './clock';
export { MemoryKeyValueStore, RedisKeyValueStore, type RedisLikeClient } from './key-value';
export {
  LocalFileStorage,
  MemoryStorage,
  STORAGE_HEADERS,
  type LocalStorageOptions,
} from './storage';
export { LoggingMailer, RecordingMailer } from './mailer';
export {
  InMemoryScheduler,
  dataExportWorkflowId,
  publishWorkflowId,
  ruleWorkflowId,
  type RecordedDataExport,
  type RecordedPublish,
} from './scheduler';
