import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

import { SsrfBlockedError } from '@relay/contracts';

/**
 * Server-side request forgery defence for the two places the product fetches a
 * URL a user supplied: RSS feed validation and media import.
 *
 * The rules are deliberately conservative and are applied to every hop, not
 * only the first: scheme allowlist, no credentials in the URL, no non-standard
 * port, and every resolved address checked against the private, loopback,
 * link-local and carrier-grade NAT ranges. A hostname that resolves to a
 * private address is refused even when the name itself looks public, which is
 * the DNS rebinding case.
 */

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const ALLOWED_PORTS = new Set(['', '80', '443', '8080', '8443']);

function isPrivateIpv4(address: string): boolean {
  const parts = address.split('.').map((part) => Number.parseInt(part, 10));
  const [a, b] = parts;
  if (a === undefined || b === undefined || parts.length !== 4) {
    return true;
  }
  if (a === 0 || a === 10 || a === 127) {
    return true;
  }
  if (a === 169 && b === 254) {
    return true;
  }
  if (a === 172 && b >= 16 && b <= 31) {
    return true;
  }
  if (a === 192 && b === 168) {
    return true;
  }
  if (a === 192 && b === 0) {
    return true;
  }
  // Carrier-grade NAT, benchmarking, multicast and reserved.
  if (a === 100 && b >= 64 && b <= 127) {
    return true;
  }
  if (a === 198 && (b === 18 || b === 19)) {
    return true;
  }
  return a >= 224;
}

const IPV4_MAPPED_PATTERN = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/;

function isPrivateIpv6(address: string): boolean {
  const value = address.toLowerCase();
  if (value === '::' || value === '::1') {
    return true;
  }
  if (value.startsWith('fe80') || value.startsWith('fc') || value.startsWith('fd')) {
    return true;
  }
  // IPv4-mapped addresses inherit the IPv4 rules.
  const mapped = value.match(IPV4_MAPPED_PATTERN);
  const embedded = mapped?.[1];
  if (embedded !== undefined) {
    return isPrivateIpv4(embedded);
  }
  return false;
}

export function isPrivateAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) {
    return isPrivateIpv4(address);
  }
  if (family === 6) {
    return isPrivateIpv6(address);
  }
  return true;
}

export interface FetchableUrl {
  readonly url: URL;
  readonly addresses: readonly string[];
}

/**
 * Throws unless this URL is safe to fetch from a server. Callers must re-check
 * every redirect target with the same function.
 */
export async function assertFetchable(candidate: string): Promise<FetchableUrl> {
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new SsrfBlockedError({
      messageKey: 'errors.url_malformed',
      details: { reason: 'malformed' },
    });
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new SsrfBlockedError({
      messageKey: 'errors.url_scheme_blocked',
      details: { scheme: url.protocol },
    });
  }
  if (url.username !== '' || url.password !== '') {
    throw new SsrfBlockedError({
      messageKey: 'errors.url_credentials_blocked',
      details: { host: url.hostname },
    });
  }
  if (!ALLOWED_PORTS.has(url.port)) {
    throw new SsrfBlockedError({
      messageKey: 'errors.url_port_blocked',
      details: { port: url.port },
    });
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  if (isIP(hostname) !== 0) {
    if (isPrivateAddress(hostname)) {
      throw new SsrfBlockedError({
        messageKey: 'errors.url_private_address_blocked',
        details: { host: hostname },
      });
    }
    return { url, addresses: [hostname] };
  }

  let resolved: { address: string }[];
  try {
    resolved = await lookup(hostname, { all: true });
  } catch {
    throw new SsrfBlockedError({
      messageKey: 'errors.url_unresolvable',
      details: { host: hostname },
    });
  }

  if (resolved.length === 0) {
    throw new SsrfBlockedError({
      messageKey: 'errors.url_unresolvable',
      details: { host: hostname },
    });
  }
  for (const entry of resolved) {
    if (isPrivateAddress(entry.address)) {
      throw new SsrfBlockedError({
        messageKey: 'errors.url_private_address_blocked',
        details: { host: hostname },
      });
    }
  }

  return { url, addresses: resolved.map((entry) => entry.address) };
}
