/**
 * `@relay/test-fixtures`
 *
 * Provider simulators, golden examples, factories, a fake clock and a
 * controllable key value store.
 *
 * Two rules hold everywhere in this package:
 *  - no fixture and no simulator may reach a network, and `createSimulatorFetch`
 *    throws on an unregistered host so that stays true by construction;
 *  - every identifier, handle, domain and number is obviously fake. Hosts are on
 *    `example.test`, which RFC 6761 reserves and which can never resolve. There
 *    is no real company name, no real handle, no invented third-party URL and no
 *    fabricated performance claim anywhere in here.
 */

export {
  FAKE_BEARER_TOKEN,
  FIXTURE_DOMAIN,
  FIXTURE_EMAIL_DOMAIN,
  FIXTURE_EPOCH_MS,
  FIXTURE_NOW,
  fakeExternalId,
  fakeHandle,
  fixtureChecksum,
  fixtureEmail,
  fixtureId,
  fixtureUrl,
  isFixtureId,
  type FixtureIdOptions,
} from './ids.js';

export {
  DAY_MS,
  FakeClock,
  HOUR_MS,
  MINUTE_MS,
  SECOND_MS,
  frozenClock,
  steppingClock,
  type Clock,
  type ClockListener,
} from './clock.js';

export {
  ControllableKeyValueStore,
  KV_OPERATIONS,
  type ControllableKeyValueStoreOptions,
  type KeyValueStore,
  type KvOperation,
} from './kv.js';

export * from './factories/index.js';
export * from './golden/index.js';
export * from './simulators/index.js';
