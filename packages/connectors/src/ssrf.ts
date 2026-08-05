import { lookup as dnsLookup } from 'node:dns/promises';

import { SsrfBlockedError } from '@relay/contracts';

/**
 * The SSRF safe fetch guard.
 *
 * This is the single outbound path for any URL a user supplied: media import,
 * RSS and Atom fetch, branded domain verification, developer app metadata and
 * anything added later. It is exported on its own so media import and RSS reuse
 * exactly this code rather than reimplementing four of the nine steps.
 *
 * The procedure is `docs/planning/04-auth-oauth-and-security.md` section 14.1:
 *
 * 1. Scheme must be http or https.
 * 2. No credentials in the URL.
 * 3. Port must be in the allowlist.
 * 4. Resolve DNS ourselves and reject loopback, link local, private, CGNAT,
 *    multicast, reserved, unspecified and cloud metadata addresses. Every
 *    resolved address must pass, not merely the first, which closes the round
 *    robin rebinding window.
 * 5. Repeat all of the above on every redirect, up to three.
 * 6. Connect and total timeouts, plus a hard response size cap.
 * 7. Send no cookie, no authorization header and no ambient credential.
 * 8. Report the resolved addresses so the caller can write them to the audit
 *    trail for the fetch.
 *
 * Full DNS rebinding closure needs the socket pinned to the address we checked.
 * `fetch` does not expose that, so callers with a hardened deployment pass a
 * pinning `fetchImpl` (an undici Agent with a custom connect lookup). The
 * all-addresses check above is what we guarantee without one.
 */

export const ALLOWED_SCHEMES: readonly string[] = ['http:', 'https:'];
export const ALLOWED_PORTS: readonly number[] = [80, 443, 8080, 8443];
export const MAX_REDIRECTS = 3;
export const CONNECT_TIMEOUT_MS = 10_000;
export const TOTAL_TIMEOUT_MS = 30_000;
export const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

export const SSRF_BLOCK_REASONS = [
  'scheme_not_allowed',
  'credentials_in_url',
  'port_not_allowed',
  'hostname_missing',
  'dns_resolution_failed',
  'address_not_public',
  'too_many_redirects',
  'redirect_missing_location',
  'response_too_large',
  'timed_out',
  'request_failed',
] as const;
export type SsrfBlockReason = (typeof SSRF_BLOCK_REASONS)[number];

function blocked(reason: SsrfBlockReason, details: Record<string, unknown> = {}): SsrfBlockedError {
  return new SsrfBlockedError({
    messageKey: 'error.short_link_destination_blocked.message',
    details: { reason, ...details },
  });
}

export const IP_CATEGORIES = [
  'public',
  'loopback',
  'link_local',
  'private',
  'cgnat',
  'multicast',
  'reserved',
  'unspecified',
  'metadata',
  'unparsed',
] as const;
export type IpCategory = (typeof IP_CATEGORIES)[number];

function classifyIpv4(address: string): IpCategory {
  const parts = address.split('.');
  if (parts.length !== 4) return 'unparsed';
  const octets: number[] = [];
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return 'unparsed';
    const value = Number(part);
    if (value > 255) return 'unparsed';
    octets.push(value);
  }
  const [a = 0, b = 0, c = 0, d = 0] = octets;
  if (a === 169 && b === 254 && c === 169 && d === 254) return 'metadata';
  if (a === 0) return 'unspecified';
  if (a === 127) return 'loopback';
  if (a === 10) return 'private';
  if (a === 172 && b >= 16 && b <= 31) return 'private';
  if (a === 192 && b === 168) return 'private';
  if (a === 169 && b === 254) return 'link_local';
  if (a === 100 && b >= 64 && b <= 127) return 'cgnat';
  if (a >= 224 && a <= 239) return 'multicast';
  if (a >= 240) return 'reserved';
  if (a === 192 && b === 0 && c === 0) return 'reserved';
  if (a === 192 && b === 0 && c === 2) return 'reserved';
  if (a === 198 && (b === 18 || b === 19)) return 'reserved';
  if (a === 198 && b === 51 && c === 100) return 'reserved';
  if (a === 203 && b === 0 && c === 113) return 'reserved';
  if (a === 255 && b === 255 && c === 255 && d === 255) return 'reserved';
  return 'public';
}

function expandIpv6(address: string): number[] | null {
  const zoneless = address.split('%')[0] ?? address;
  const halves = zoneless.split('::');
  if (halves.length > 2) return null;
  const parseGroups = (segment: string): number[] | null => {
    if (segment === '') return [];
    const groups: number[] = [];
    for (const piece of segment.split(':')) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(piece)) return null;
      groups.push(Number.parseInt(piece, 16));
    }
    return groups;
  };
  const head = parseGroups(halves[0] ?? '');
  const tail = halves.length === 2 ? parseGroups(halves[1] ?? '') : [];
  if (head === null || tail === null) return null;
  if (halves.length === 1) {
    return head.length === 8 ? head : null;
  }
  const fill = 8 - head.length - tail.length;
  if (fill < 0) return null;
  return [...head, ...new Array<number>(fill).fill(0), ...tail];
}

function classifyIpv6(address: string): IpCategory {
  const lower = address.toLowerCase();
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(lower);
  if (mapped !== null && mapped[1] !== undefined) {
    return classifyIpv4(mapped[1]);
  }
  if (lower === 'fd00:ec2::254') return 'metadata';
  const groups = expandIpv6(lower);
  if (groups === null) return 'unparsed';
  const [first = 0, second = 0] = groups;
  if (groups.every((group) => group === 0)) return 'unspecified';
  if (groups.slice(0, 7).every((group) => group === 0) && groups[7] === 1) return 'loopback';
  if (groups.slice(0, 5).every((group) => group === 0) && groups[5] === 0xffff) {
    const high = groups[6] ?? 0;
    const low = groups[7] ?? 0;
    return classifyIpv4(`${(high >> 8) & 0xff}.${high & 0xff}.${(low >> 8) & 0xff}.${low & 0xff}`);
  }
  if ((first & 0xffc0) === 0xfe80) return 'link_local';
  if ((first & 0xfe00) === 0xfc00) return 'private';
  if ((first & 0xff00) === 0xff00) return 'multicast';
  if (first === 0x0100 && second === 0x0000) return 'reserved';
  if (first === 0x2001 && (second === 0x0db8 || second <= 0x01ff)) return 'reserved';
  if (first === 0x0064 && second === 0xff9b) return 'reserved';
  return 'public';
}

/** Categorize a literal IP address. Anything but `public` is refused. */
export function classifyIpAddress(address: string): IpCategory {
  const trimmed = address.replace(/^\[|\]$/g, '');
  return trimmed.includes(':') ? classifyIpv6(trimmed) : classifyIpv4(trimmed);
}

export function isPublicIpAddress(address: string): boolean {
  return classifyIpAddress(address) === 'public';
}

export interface ResolvedAddress {
  readonly address: string;
  readonly family: number;
}

export type DnsResolver = (hostname: string) => Promise<readonly ResolvedAddress[]>;

export const systemDnsResolver: DnsResolver = async (hostname) => {
  const results = await dnsLookup(hostname, { all: true, verbatim: true });
  return results.map((entry) => ({ address: entry.address, family: entry.family }));
};

export interface UrlGuardOptions {
  readonly resolver?: DnsResolver;
  readonly allowedPorts?: readonly number[];
  readonly allowedSchemes?: readonly string[];
  /** Hostnames that resolve privately on purpose, for local development only. */
  readonly allowPrivateHosts?: readonly string[];
}

export interface CheckedUrl {
  readonly url: URL;
  readonly hostname: string;
  readonly port: number;
  readonly addresses: readonly ResolvedAddress[];
}

/**
 * Steps 1 to 4. Throws `SsrfBlockedError`. Exported so a caller can validate a
 * URL at save time, before anything is fetched.
 */
export async function assertSafeUrl(
  rawUrl: string,
  options: UrlGuardOptions = {},
): Promise<CheckedUrl> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw blocked('scheme_not_allowed', { url: rawUrl.slice(0, 200) });
  }

  const schemes = options.allowedSchemes ?? ALLOWED_SCHEMES;
  if (!schemes.includes(url.protocol)) {
    throw blocked('scheme_not_allowed', { scheme: url.protocol });
  }
  if (url.username !== '' || url.password !== '') {
    throw blocked('credentials_in_url', { host: url.hostname });
  }
  if (url.hostname === '') {
    throw blocked('hostname_missing');
  }

  const port = url.port === '' ? (url.protocol === 'https:' ? 443 : 80) : Number(url.port);
  const ports = options.allowedPorts ?? ALLOWED_PORTS;
  if (!ports.includes(port)) {
    throw blocked('port_not_allowed', { port });
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  if (options.allowPrivateHosts?.includes(hostname) === true) {
    return { url, hostname, port, addresses: [] };
  }

  const literal = classifyIpAddress(hostname);
  if (literal !== 'unparsed') {
    if (literal !== 'public') {
      throw blocked('address_not_public', { category: literal });
    }
    return {
      url,
      hostname,
      port,
      addresses: [{ address: hostname, family: hostname.includes(':') ? 6 : 4 }],
    };
  }

  const resolver = options.resolver ?? systemDnsResolver;
  let addresses: readonly ResolvedAddress[];
  try {
    addresses = await resolver(hostname);
  } catch (cause) {
    throw new SsrfBlockedError({
      messageKey: 'error.short_link_destination_blocked.message',
      details: { reason: 'dns_resolution_failed', host: hostname },
      cause,
    });
  }
  if (addresses.length === 0) {
    throw blocked('dns_resolution_failed', { host: hostname });
  }
  for (const entry of addresses) {
    const category = classifyIpAddress(entry.address);
    if (category !== 'public') {
      throw blocked('address_not_public', { host: hostname, category });
    }
  }
  return { url, hostname, port, addresses };
}

export interface SafeFetchOptions extends UrlGuardOptions {
  readonly method?: 'GET' | 'HEAD' | 'POST';
  readonly headers?: Readonly<Record<string, string>>;
  readonly body?: string | Uint8Array;
  readonly maxBytes?: number;
  readonly totalTimeoutMs?: number;
  readonly maxRedirects?: number;
  readonly fetchImpl?: typeof fetch;
  readonly signal?: AbortSignal;
}

export interface SafeFetchResult {
  readonly requestedUrl: string;
  readonly finalUrl: string;
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: Uint8Array;
  readonly byteSize: number;
  readonly contentType: string | null;
  readonly redirectChain: readonly string[];
  /** Every address checked along the chain. Written to the fetch audit trail. */
  readonly resolvedAddresses: readonly string[];
}

/** Headers we never forward, whatever the caller passes. */
const STRIPPED_REQUEST_HEADERS = new Set([
  'cookie',
  'authorization',
  'proxy-authorization',
  'x-api-key',
  'x-auth-token',
]);

async function readCapped(response: Response, maxBytes: number): Promise<Uint8Array> {
  const stream = response.body;
  if (stream === null) {
    return new Uint8Array(0);
  }
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value === undefined) continue;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw blocked('response_too_large', { maxBytes });
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

/**
 * Fetch a user supplied URL safely.
 *
 * ```ts
 * const result = await safeFetch(feedUrl, { maxBytes: 10 * 1024 * 1024 });
 * ```
 */
export async function safeFetch(
  rawUrl: string,
  options: SafeFetchOptions = {},
): Promise<SafeFetchResult> {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const maxRedirects = options.maxRedirects ?? MAX_REDIRECTS;
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.totalTimeoutMs ?? TOTAL_TIMEOUT_MS);
  const onOuterAbort = (): void => controller.abort(options.signal?.reason);
  options.signal?.addEventListener('abort', onOuterAbort, { once: true });

  const headers: Record<string, string> = { accept: '*/*' };
  for (const [key, value] of Object.entries(options.headers ?? {})) {
    if (!STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers[key.toLowerCase()] = value;
    }
  }

  const redirectChain: string[] = [];
  const resolvedAddresses: string[] = [];
  let current = rawUrl;

  try {
    for (let hop = 0; hop <= maxRedirects; hop += 1) {
      const checked = await assertSafeUrl(current, options);
      for (const entry of checked.addresses) {
        resolvedAddresses.push(entry.address);
      }

      const sendsBody =
        options.body !== undefined && options.method !== 'GET' && options.method !== 'HEAD';
      let response: Response;
      try {
        response = await fetchImpl(checked.url, {
          method: options.method ?? 'GET',
          headers,
          redirect: 'manual',
          signal: controller.signal,
          credentials: 'omit',
          ...(sendsBody && options.body !== undefined
            ? {
                body:
                  typeof options.body === 'string' ? options.body : new Uint8Array(options.body),
              }
            : {}),
        });
      } catch (cause) {
        if (controller.signal.aborted) {
          throw blocked('timed_out', { host: checked.hostname });
        }
        throw new SsrfBlockedError({
          messageKey: 'error.short_link_destination_blocked.message',
          details: { reason: 'request_failed', host: checked.hostname },
          cause,
        });
      }

      const isRedirect = response.status >= 300 && response.status < 400;
      if (!isRedirect) {
        const declared = response.headers.get('content-length');
        if (declared !== null && Number(declared) > maxBytes) {
          await response.body?.cancel();
          throw blocked('response_too_large', { maxBytes });
        }
        const body =
          options.method === 'HEAD' ? new Uint8Array(0) : await readCapped(response, maxBytes);
        const outHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          outHeaders[key.toLowerCase()] = value;
        });
        return {
          requestedUrl: rawUrl,
          finalUrl: checked.url.toString(),
          status: response.status,
          headers: outHeaders,
          body,
          byteSize: body.byteLength,
          contentType: response.headers.get('content-type'),
          redirectChain,
          resolvedAddresses,
        };
      }

      const location = response.headers.get('location');
      if (location === null || location === '') {
        throw blocked('redirect_missing_location', { status: response.status });
      }
      current = new URL(location, checked.url).toString();
      redirectChain.push(current);
      await response.body?.cancel();
    }
    throw blocked('too_many_redirects', { maxRedirects });
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', onOuterAbort);
  }
}
