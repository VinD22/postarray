import { z } from 'zod';

/**
 * Sortable, prefixed public identifiers.
 *
 * Layout: `<prefix>_<26 char base32-crockford>` where the 130 encoded bits hold
 * a 48 bit millisecond timestamp followed by 80 bits of entropy sourced from
 * `crypto.randomUUID()`. Two ids minted in the same millisecond stay strictly
 * ordered because the entropy is incremented rather than resampled.
 */

export const ID_PREFIXES = {
  user: 'user',
  userAlias: 'alias',
  workspace: 'ws',
  membership: 'membership',
  invitation: 'invitation',
  rolePermission: 'roleperm',
  project: 'project',
  projectSource: 'bsrc',
  glossaryTerm: 'term',
  campaign: 'campaign',
  contentItem: 'content',
  contentVersion: 'cver',
  postVariant: 'pv',
  connection: 'conn',
  credential: 'cred',
  destination: 'dest',
  mention: 'mention',
  media: 'media',
  derivative: 'mder',
  publishJob: 'job',
  publishAttempt: 'att',
  receipt: 'receipt',
  providerLimit: 'limit',
  connectionIncident: 'incident',
  approval: 'approval',
  approvalDecision: 'apdecision',
  comment: 'cmt',
  rule: 'rule',
  ruleRun: 'rulerun',
  queueRule: 'qrule',
  queueSlotReservation: 'qslot',
  feed: 'rss',
  feedItem: 'rssitem',
  shortLink: 'lnk',
  shortLinkClick: 'click',
  apiKey: 'key',
  serviceAccount: 'svc',
  oauthClient: 'app',
  oauthGrant: 'grant',
  agentConfirmation: 'confirm',
  oauthTransaction: 'oauth',
  oauthPendingDiscovery: 'oauthpend',
  outboxEvent: 'outbox',
  outboxDeadLetter: 'outboxdl',
  webhookEndpoint: 'whep',
  webhookDelivery: 'whd',
  growthProfile: 'bprof',
  growthPlan: 'plan',
  opportunity: 'opp',
  opportunityMatch: 'oppmatch',
  tool: 'tool',
  metricDefinition: 'metric',
  metricObservation: 'observation',
  analyticsSyncRun: 'sync',
  experiment: 'exp',
  insight: 'insight',
  auditEvent: 'aud',
  userSession: 'session',
  consent: 'consent',
  polarCustomer: 'customer',
  subscription: 'sub',
  entitlement: 'entitlement',
  usageEvent: 'usage',
  billingWebhook: 'billingevent',
  affiliate: 'aff',
  referral: 'referral',
  commission: 'commission',
  payout: 'payout',
  deletionRequest: 'deletion',
  dataExport: 'export',
  bulkImportJob: 'import',
  bulkImportRow: 'importrow',
  operation: 'op',
  set: 'set',
  signature: 'sig',
  rememberedTargets: 'remtgt',
  onboardingState: 'onboarding',
  seoKeywordTarget: 'kwtarget',
  postCreditLedgerEntry: 'credit',
} as const;

export type IdEntity = keyof typeof ID_PREFIXES;
export type IdPrefix = (typeof ID_PREFIXES)[IdEntity];

export const ID_ENTITIES = Object.keys(ID_PREFIXES) as readonly IdEntity[];
export const ID_PREFIX_VALUES = Object.values(ID_PREFIXES) as readonly IdPrefix[];

const CROCKFORD_ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz';
const CROCKFORD_INDEX = new Map<string, number>(
  Array.from(CROCKFORD_ALPHABET, (character, index) => [character, index] as const),
);

/** 26 base32 characters carry 130 bits; the identifier body uses the low 128. */
export const ID_BODY_LENGTH = 26;
const TIMESTAMP_BITS = 48n;
const ENTROPY_BITS = 80n;
const MAX_ENTROPY = (1n << ENTROPY_BITS) - 1n;
const MAX_TIMESTAMP = Number((1n << TIMESTAMP_BITS) - 1n);

const ID_BODY_PATTERN = new RegExp(`^[${CROCKFORD_ALPHABET}]{${ID_BODY_LENGTH}}$`);

function encodeBase32(value: bigint, length: number): string {
  let remaining = value;
  const characters: string[] = new Array<string>(length);
  for (let position = length - 1; position >= 0; position -= 1) {
    const character = CROCKFORD_ALPHABET[Number(remaining & 31n)];
    if (character === undefined) {
      throw new RangeError('ID_ENCODING_OUT_OF_RANGE');
    }
    characters[position] = character;
    remaining >>= 5n;
  }
  return characters.join('');
}

function decodeBase32(body: string): bigint {
  let value = 0n;
  for (const character of body) {
    const index = CROCKFORD_INDEX.get(character);
    if (index === undefined) {
      throw new RangeError('ID_DECODING_INVALID_CHARACTER');
    }
    value = (value << 5n) | BigInt(index);
  }
  return value;
}

function randomEntropy(): bigint {
  const uuid = globalThis.crypto.randomUUID().replace(/-/g, '');
  return BigInt(`0x${uuid.slice(0, 20)}`) & MAX_ENTROPY;
}

interface GeneratorState {
  lastTimestamp: number;
  lastEntropy: bigint;
}

const state: GeneratorState = { lastTimestamp: -1, lastEntropy: 0n };

function nextBody(now: number): string {
  let timestamp = now;
  let entropy: bigint;
  if (timestamp === state.lastTimestamp) {
    if (state.lastEntropy >= MAX_ENTROPY) {
      timestamp += 1;
      entropy = randomEntropy();
    } else {
      entropy = state.lastEntropy + 1n;
    }
  } else if (timestamp < state.lastTimestamp) {
    // Clock moved backwards. Keep monotonicity by continuing from the last value.
    timestamp = state.lastTimestamp;
    entropy = state.lastEntropy >= MAX_ENTROPY ? randomEntropy() : state.lastEntropy + 1n;
  } else {
    entropy = randomEntropy();
  }
  state.lastTimestamp = timestamp;
  state.lastEntropy = entropy;
  return encodeBase32((BigInt(timestamp) << ENTROPY_BITS) | entropy, ID_BODY_LENGTH);
}

/**
 * Reset the monotonic generator.
 *
 * The generator deliberately keeps process-wide state so that two ids minted in
 * the same millisecond still sort, and so that a backwards clock step cannot
 * produce a lower id. That state outlives an individual test, so a test which
 * fakes the clock must reset it first, otherwise the backwards-clock guard
 * correctly pins the timestamp to the previously observed one.
 *
 * Test-only. Calling this in production would reintroduce the ordering bugs the
 * state exists to prevent.
 */
export function resetIdGeneratorState(): void {
  state.lastTimestamp = -1;
  state.lastEntropy = 0n;
}

/** Mint a new sortable identifier for the given public prefix. */
export function newId(prefix: IdPrefix): string {
  const now = Date.now();
  if (now > MAX_TIMESTAMP) {
    throw new RangeError('ID_TIMESTAMP_OUT_OF_RANGE');
  }
  return `${prefix}_${nextBody(now)}`;
}

/** Mint a new identifier from the entity name rather than the wire prefix. */
export function newIdFor(entity: IdEntity): string {
  return newId(ID_PREFIXES[entity]);
}

export interface ParsedId {
  readonly prefix: string;
  readonly body: string;
  readonly timestamp: Date;
  readonly entropy: bigint;
}

/** Parse an identifier, returning null when the shape is not recognised. */
export function safeParseId(value: string): ParsedId | null {
  const separator = value.indexOf('_');
  if (separator <= 0) {
    return null;
  }
  const prefix = value.slice(0, separator);
  const body = value.slice(separator + 1);
  if (!ID_BODY_PATTERN.test(body)) {
    return null;
  }
  let decoded: bigint;
  try {
    decoded = decodeBase32(body);
  } catch {
    return null;
  }
  const milliseconds = Number(decoded >> ENTROPY_BITS);
  if (!Number.isSafeInteger(milliseconds)) {
    return null;
  }
  return {
    prefix,
    body,
    timestamp: new Date(milliseconds),
    entropy: decoded & MAX_ENTROPY,
  };
}

/** Parse an identifier or throw when it is malformed. */
export function parseId(value: string): ParsedId {
  const parsed = safeParseId(value);
  if (parsed === null) {
    throw new RangeError('ID_MALFORMED');
  }
  return parsed;
}

/** True when `value` is a well formed identifier carrying exactly `prefix`. */
export function isId(prefix: string, value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  const parsed = safeParseId(value);
  return parsed !== null && parsed.prefix === prefix;
}

/** True when `value` is a well formed identifier with any known prefix. */
export function isKnownId(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  const parsed = safeParseId(value);
  return parsed !== null && ID_PREFIX_VALUES.includes(parsed.prefix as IdPrefix);
}

/** Zod schema for an identifier carrying exactly `prefix`. */
export function idSchema(prefix: string): z.ZodType<string> {
  return z.string().refine((value) => isId(prefix, value), { error: 'INVALID_ID' });
}

/** Zod schema for an identifier carrying any known prefix. */
export const anyIdSchema: z.ZodType<string> = z
  .string()
  .refine((value) => isKnownId(value), { error: 'INVALID_ID' });

/** Extract the creation instant encoded in an identifier. */
export function idTimestamp(value: string): Date {
  return parseId(value).timestamp;
}

/** Lexicographic comparison, which for these identifiers is also chronological. */
export function compareIds(left: string, right: string): number {
  if (left === right) {
    return 0;
  }
  return left < right ? -1 : 1;
}
