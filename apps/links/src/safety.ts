import { RelayError } from '@relay/contracts';

/**
 * Destination safety.
 *
 * The same function runs at CREATE (called by the application service before a
 * short link is stored) and again at RESOLVE (here, before every 302). A link
 * that was safe when it was created can become unsafe: the record can be
 * tampered with, the safety scanner can change its mind, or the destination can
 * start carrying a nested redirect. Checking once is not checking.
 */

export const SAFETY_REASONS = [
  'MALFORMED_URL',
  'SCHEME_NOT_ALLOWED',
  'CREDENTIALS_IN_URL',
  'HOST_MISSING',
  'HOST_NOT_PUBLIC',
  'PRIVATE_NETWORK_TARGET',
  'LOOPBACK_TARGET',
  'LINK_SHORTENER_LOOP',
  'NESTED_REDIRECT_UNSAFE',
  'REDIRECT_DEPTH_EXCEEDED',
  'PORT_NOT_ALLOWED',
  'URL_TOO_LONG',
] as const;
export type SafetyReason = (typeof SAFETY_REASONS)[number];

export interface SafetyOptions {
  /**
   * Schemes a destination may use. Everything else, including `javascript:`,
   * `data:`, `file:` and `blob:`, is rejected.
   */
  readonly allowedSchemes?: readonly string[];
  /**
   * Hosts this service itself answers on. A destination may never be one of
   * them: that is how a redirect chain starts.
   */
  readonly selfHosts?: readonly string[];
  /** How many nested absolute URLs may appear inside a destination. */
  readonly maxRedirectDepth?: number;
  /** Non-standard ports a destination may use. 80 and 443 are always allowed. */
  readonly allowedPorts?: readonly number[];
  readonly maxUrlLength?: number;
}

export interface SafetyDecision {
  readonly safe: boolean;
  readonly reasons: readonly SafetyReason[];
  /** The normalized absolute URL, present only when the decision is safe. */
  readonly normalizedUrl: string | null;
}

export const DEFAULT_ALLOWED_SCHEMES: readonly string[] = ['https:', 'http:'];
export const DEFAULT_MAX_REDIRECT_DEPTH = 3;
export const DEFAULT_MAX_URL_LENGTH = 2048;
const ALWAYS_ALLOWED_PORTS: readonly number[] = [80, 443];

/** Query and fragment keys that conventionally carry a follow-on destination. */
const NESTED_REDIRECT_KEYS: readonly string[] = [
  'url',
  'u',
  'uri',
  'redirect',
  'redirect_uri',
  'redirect_url',
  'redirecturl',
  'return',
  'returnto',
  'return_to',
  'returnurl',
  'return_url',
  'next',
  'dest',
  'destination',
  'target',
  'continue',
  'goto',
  'go',
  'out',
  'link',
  'r',
  'q',
];

const SUFFIXES_NOT_PUBLIC: readonly string[] = [
  '.local',
  '.localhost',
  '.internal',
  '.intranet',
  '.lan',
  '.home',
  '.home.arpa',
  '.corp',
  '.private',
  '.test',
  '.invalid',
  '.example',
  '.onion',
  '.i2p',
];

const HOSTNAMES_NOT_PUBLIC: readonly string[] = [
  'localhost',
  'ip6-localhost',
  'ip6-loopback',
  'broadcasthost',
  'metadata',
  'metadata.google.internal',
  'instance-data',
];

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;
const FRAGMENT_URL_PATTERN = /https?:\/\/[^\s&]+/i;
const DNS_NAME_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

function stripBrackets(hostname: string): string {
  return hostname.startsWith('[') && hostname.endsWith(']') ? hostname.slice(1, -1) : hostname;
}

function parseIpv4(hostname: string): readonly number[] | null {
  const parts = hostname.split('.');
  if (parts.length !== 4) {
    return null;
  }
  const octets: number[] = [];
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) {
      return null;
    }
    const value = Number(part);
    if (!Number.isInteger(value) || value < 0 || value > 255) {
      return null;
    }
    octets.push(value);
  }
  return octets;
}

/** RFC 1918, loopback, link local, CGNAT, benchmarking, multicast and reserved. */
export function isPrivateIpv4(hostname: string): boolean {
  const octets = parseIpv4(hostname);
  if (octets === null) {
    return false;
  }
  const first = octets[0];
  const second = octets[1];
  if (first === undefined || second === undefined) {
    return true;
  }
  if (first === 0 || first === 10 || first === 127) return true;
  if (first === 169 && second === 254) return true;
  if (first === 172 && second >= 16 && second <= 31) return true;
  if (first === 192 && second === 168) return true;
  if (first === 192 && second === 0) return true;
  if (first === 198 && (second === 18 || second === 19)) return true;
  if (first === 100 && second >= 64 && second <= 127) return true;
  if (first >= 224) return true;
  return false;
}

/**
 * Expand an IPv6 literal to its eight 16-bit groups.
 *
 * The WHATWG URL parser rewrites `::ffff:10.0.0.1` to `::ffff:a00:1`, so a
 * prefix match on the textual form is not enough. Expanding first is what makes
 * the IPv4-mapped bypass impossible.
 */
export function expandIpv6(hostname: string): readonly number[] | null {
  const value = stripBrackets(hostname).toLowerCase().split('%')[0] ?? '';
  if (!value.includes(':')) {
    return null;
  }
  const [head, tail, ...rest] = value.split('::');
  if (rest.length > 0 || head === undefined) {
    return null;
  }
  const parseGroups = (segment: string): number[] | null => {
    if (segment.length === 0) {
      return [];
    }
    const groups: number[] = [];
    for (const part of segment.split(':')) {
      if (part.includes('.')) {
        const octets = parseIpv4(part);
        if (octets === null) {
          return null;
        }
        const [a, b, c, d] = octets;
        if (a === undefined || b === undefined || c === undefined || d === undefined) {
          return null;
        }
        groups.push((a << 8) | b, (c << 8) | d);
        continue;
      }
      if (!/^[0-9a-f]{1,4}$/.test(part)) {
        return null;
      }
      groups.push(Number.parseInt(part, 16));
    }
    return groups;
  };

  const left = parseGroups(head);
  const right = tail === undefined ? [] : parseGroups(tail);
  if (left === null || right === null) {
    return null;
  }
  if (tail === undefined) {
    return left.length === 8 ? left : null;
  }
  const fillLength = 8 - left.length - right.length;
  if (fillLength < 0) {
    return null;
  }
  return [...left, ...new Array<number>(fillLength).fill(0), ...right];
}

/** Loopback, unique local, link local, unspecified and IPv4-mapped forms. */
export function isPrivateIpv6(hostname: string): boolean {
  const groups = expandIpv6(hostname);
  if (groups === null) {
    return false;
  }
  const first = groups[0];
  if (first === undefined) {
    return true;
  }
  if (groups.every((group) => group === 0)) {
    return true;
  }
  if (groups.slice(0, 7).every((group) => group === 0) && groups[7] === 1) {
    return true;
  }
  // IPv4-mapped (::ffff:a.b.c.d) and IPv4-compatible forms.
  if (groups.slice(0, 5).every((group) => group === 0)) {
    const marker = groups[5];
    const high = groups[6] ?? 0;
    const low = groups[7] ?? 0;
    if (marker === 0xffff || marker === 0) {
      const embedded = `${(high >> 8) & 0xff}.${high & 0xff}.${(low >> 8) & 0xff}.${low & 0xff}`;
      return isPrivateIpv4(embedded);
    }
  }
  if ((first & 0xfe00) === 0xfc00) return true;
  if ((first & 0xffc0) === 0xfe80) return true;
  if ((first & 0xff00) === 0xff00) return true;
  return false;
}

/**
 * A destination host must be a registrable public name or a public IP. Bare
 * single-label names resolve differently on every network, so they are never
 * acceptable as a public redirect target.
 */
export function isPubliclyRoutableHost(hostname: string): boolean {
  const host = stripBrackets(hostname).toLowerCase().replace(/\.$/, '');
  if (host.length === 0 || host.length > 253) {
    return false;
  }
  if (HOSTNAMES_NOT_PUBLIC.includes(host)) {
    return false;
  }
  if (SUFFIXES_NOT_PUBLIC.some((suffix) => host.endsWith(suffix))) {
    return false;
  }
  if (isPrivateIpv4(host) || isPrivateIpv6(host)) {
    return false;
  }
  if (host.includes(':')) {
    // An IPv6 literal that is not private is acceptable.
    return true;
  }
  if (parseIpv4(host) !== null) {
    return true;
  }
  if (!host.includes('.')) {
    return false;
  }
  return DNS_NAME_PATTERN.test(host);
}

function reasonForUnroutableHost(hostname: string): SafetyReason {
  const host = stripBrackets(hostname).toLowerCase();
  if (host === 'localhost' || host === '::1' || host === '127.0.0.1') {
    return 'LOOPBACK_TARGET';
  }
  if (isPrivateIpv4(host) || isPrivateIpv6(host)) {
    return 'PRIVATE_NETWORK_TARGET';
  }
  return 'HOST_NOT_PUBLIC';
}

function candidateNestedUrls(url: URL): readonly string[] {
  const found: string[] = [];
  for (const [key, value] of url.searchParams.entries()) {
    if (!NESTED_REDIRECT_KEYS.includes(key.toLowerCase())) {
      continue;
    }
    const trimmed = value.trim();
    if (ABSOLUTE_URL_PATTERN.test(trimmed)) {
      found.push(trimmed);
    }
  }
  const fragment = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
  if (fragment.length > 0) {
    const match = fragment.match(FRAGMENT_URL_PATTERN);
    const nested = match?.[0];
    if (nested !== undefined) {
      found.push(nested);
    }
  }
  return found;
}

interface ResolvedOptions {
  readonly allowedSchemes: readonly string[];
  readonly selfHosts: readonly string[];
  readonly maxRedirectDepth: number;
  readonly maxUrlLength: number;
  readonly allowedPorts: readonly number[];
}

function evaluate(url: string, options: ResolvedOptions, depth: number): SafetyDecision {
  if (depth > options.maxRedirectDepth) {
    return { safe: false, reasons: ['REDIRECT_DEPTH_EXCEEDED'], normalizedUrl: null };
  }
  if (url.length > options.maxUrlLength) {
    return { safe: false, reasons: ['URL_TOO_LONG'], normalizedUrl: null };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { safe: false, reasons: ['MALFORMED_URL'], normalizedUrl: null };
  }

  const reasons = new Set<SafetyReason>();

  if (!options.allowedSchemes.includes(parsed.protocol)) {
    reasons.add('SCHEME_NOT_ALLOWED');
  }
  if (parsed.username.length > 0 || parsed.password.length > 0) {
    // `https://accounts.example.com@attacker.test/` is the oldest phishing
    // trick there is. It never reaches a visitor from here.
    reasons.add('CREDENTIALS_IN_URL');
  }
  if (parsed.hostname.length === 0) {
    reasons.add('HOST_MISSING');
  } else if (!isPubliclyRoutableHost(parsed.hostname)) {
    reasons.add(reasonForUnroutableHost(parsed.hostname));
  }
  if (parsed.port.length > 0) {
    const port = Number(parsed.port);
    if (!ALWAYS_ALLOWED_PORTS.includes(port) && !options.allowedPorts.includes(port)) {
      reasons.add('PORT_NOT_ALLOWED');
    }
  }
  if (options.selfHosts.includes(stripBrackets(parsed.hostname).toLowerCase())) {
    reasons.add('LINK_SHORTENER_LOOP');
  }

  if (reasons.size > 0) {
    return { safe: false, reasons: [...reasons], normalizedUrl: null };
  }

  for (const nested of candidateNestedUrls(parsed)) {
    const inner = evaluate(nested, options, depth + 1);
    if (!inner.safe) {
      const reason: SafetyReason = inner.reasons.includes('REDIRECT_DEPTH_EXCEEDED')
        ? 'REDIRECT_DEPTH_EXCEEDED'
        : 'NESTED_REDIRECT_UNSAFE';
      return { safe: false, reasons: [reason], normalizedUrl: null };
    }
  }

  return { safe: true, reasons: [], normalizedUrl: parsed.toString() };
}

function resolveOptions(options: SafetyOptions): ResolvedOptions {
  return {
    allowedSchemes: options.allowedSchemes ?? DEFAULT_ALLOWED_SCHEMES,
    selfHosts: (options.selfHosts ?? []).map((host) => host.toLowerCase()),
    maxRedirectDepth: options.maxRedirectDepth ?? DEFAULT_MAX_REDIRECT_DEPTH,
    maxUrlLength: options.maxUrlLength ?? DEFAULT_MAX_URL_LENGTH,
    allowedPorts: options.allowedPorts ?? [],
  };
}

/**
 * Decide whether a destination may be published or followed.
 *
 * Pure and synchronous on purpose: no DNS lookup and no fetch, so nothing here
 * can be turned into a network probe. Name resolution safety for outbound
 * fetches belongs to the media and RSS import paths, which actually make
 * requests. This service only emits a 302.
 */
export function checkDestination(url: string, options: SafetyOptions = {}): SafetyDecision {
  return evaluate(url, resolveOptions(options), 0);
}

/**
 * Create-time guard. Throws the taxonomy error the API surfaces to the user,
 * carrying only stable reason codes, never the rejected URL.
 */
export function assertDestinationSafe(url: string, options: SafetyOptions = {}): string {
  const decision = checkDestination(url, options);
  if (!decision.safe || decision.normalizedUrl === null) {
    throw new RelayError('SSRF_BLOCKED', {
      messageKey: 'error.short_link_destination_blocked.message',
      details: { reasons: decision.reasons },
    });
  }
  return decision.normalizedUrl;
}
