import { ID_PREFIXES, safeParseId } from '@relay/contracts';
import type { IdEntity } from '@relay/contracts';

/**
 * Deterministic, schema-valid fixture identifiers.
 *
 * `newId` from `@relay/contracts` is time based and random, which is exactly
 * right in production and exactly wrong in a golden file. `fixtureId` derives
 * the same 26 character Crockford base32 body from a seed string, so the same
 * seed always produces the same id, the id still parses, and ids still sort
 * chronologically by the encoded timestamp.
 *
 * Every identifier, handle and domain in this package is obviously fake. Hosts
 * are on `example.test`, which is reserved by RFC 6761 and can never resolve.
 */

const CROCKFORD_ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz';
const ID_BODY_LENGTH = 26;
const ENTROPY_BITS = 80n;
const ENTROPY_MASK = (1n << ENTROPY_BITS) - 1n;

/** The instant every fixture id is anchored to: 4 August 2026, 12:00 UTC. */
export const FIXTURE_EPOCH_MS = 1_785_844_800_000;

/** The instant fixtures use as "now" unless a test moves the clock. */
export const FIXTURE_NOW = '2026-08-04T12:00:00.000Z';

/** Reserved by RFC 6761. It can never resolve, which is the point. */
export const FIXTURE_DOMAIN = 'example.test';

export const FIXTURE_EMAIL_DOMAIN = 'example.test';

export function fixtureEmail(local: string): string {
  return `${local}@${FIXTURE_EMAIL_DOMAIN}`;
}

export function fixtureUrl(path = ''): string {
  return `https://${FIXTURE_DOMAIN}${path.startsWith('/') ? path : `/${path}`}`;
}

/** 64 bit FNV-1a. Deterministic across runtimes, adequate for fixture spread. */
function fnv1a64(value: string): bigint {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const mask = (1n << 64n) - 1n;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= BigInt(value.charCodeAt(index));
    hash = (hash * prime) & mask;
  }
  return hash;
}

function encodeBase32(value: bigint, length: number): string {
  let remaining = value;
  const characters = new Array<string>(length);
  for (let position = length - 1; position >= 0; position -= 1) {
    const character = CROCKFORD_ALPHABET[Number(remaining & 31n)];
    if (character === undefined) {
      throw new RangeError('FIXTURE_ID_ENCODING_FAILED');
    }
    characters[position] = character;
    remaining >>= 5n;
  }
  return characters.join('');
}

export interface FixtureIdOptions {
  /** Milliseconds after `FIXTURE_EPOCH_MS`, so fixtures sort predictably. */
  readonly offsetMs?: number;
}

/**
 * Build a stable identifier for `entity` from `seed`.
 *
 * `fixtureId('workspace', 'acme')` is the same string on every machine and in
 * every run, so a golden file can contain it and a diff stays readable.
 */
export function fixtureId(entity: IdEntity, seed: string, options: FixtureIdOptions = {}): string {
  const prefix = ID_PREFIXES[entity];
  const timestamp = BigInt(FIXTURE_EPOCH_MS + (options.offsetMs ?? 0));
  const entropy = fnv1a64(`${prefix}:${seed}`) & ENTROPY_MASK;
  return `${prefix}_${encodeBase32((timestamp << ENTROPY_BITS) | entropy, ID_BODY_LENGTH)}`;
}

/** True when a value is a fixture id for the given entity. */
export function isFixtureId(entity: IdEntity, value: string): boolean {
  const parsed = safeParseId(value);
  return parsed !== null && parsed.prefix === ID_PREFIXES[entity];
}

/** A short, obviously fake external identifier for a provider-side object. */
export function fakeExternalId(provider: string, seed: string): string {
  const digits = (fnv1a64(`${provider}:${seed}`) % 10_000_000_000n).toString().padStart(10, '0');
  return `fake-${provider}-${digits}`;
}

/** An obviously fake public handle. Never a real person's or company's. */
export function fakeHandle(seed: string): string {
  return `fixture_${seed.replace(/[^a-z0-9_]/gi, '_').toLowerCase()}`;
}

/**
 * A token-shaped string that is unmistakably not a credential. Used by the
 * simulator's `token_echo` mode, which exists to prove the log sanitizer
 * catches a provider that echoes an authorization header back in an error.
 */
export const FAKE_BEARER_TOKEN = 'Bearer FAKE-TOKEN-FOR-TESTS-DO-NOT-USE';

/** A sha256-shaped checksum derived from a seed, for fixture payload hashes. */
export function fixtureChecksum(seed: string): string {
  let out = '';
  let counter = 0n;
  while (out.length < 64) {
    const chunk = fnv1a64(`${seed}:${counter}`).toString(16).padStart(16, '0');
    out += chunk;
    counter += 1n;
  }
  return out.slice(0, 64);
}
