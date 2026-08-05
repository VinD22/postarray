/**
 * Source address restriction for API keys.
 *
 * An optional narrowing on a workspace API key. It is a defence in depth
 * control, never the only one: a leaked key restricted to a CIDR block is still
 * a leaked key, and the expiry, the scopes and the audit trail all still apply.
 *
 * IPv4 and IPv6 are both supported, including IPv4-mapped IPv6 addresses,
 * because a Node server behind a dual-stack proxy commonly sees `::ffff:a.b.c.d`
 * for what the customer typed as an IPv4 block.
 */

function ipv4ToBytes(value: string): Uint8Array | null {
  const parts = value.split('.');
  if (parts.length !== 4) {
    return null;
  }
  const bytes = new Uint8Array(4);
  for (let index = 0; index < 4; index += 1) {
    const part = parts[index];
    if (part === undefined || !/^\d{1,3}$/.test(part)) {
      return null;
    }
    const octet = Number.parseInt(part, 10);
    if (octet > 255) {
      return null;
    }
    bytes[index] = octet;
  }
  return bytes;
}

function ipv6ToBytes(value: string): Uint8Array | null {
  const mapped = value.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i);
  if (mapped !== null && mapped[1] !== undefined) {
    const ipv4 = ipv4ToBytes(mapped[1]);
    if (ipv4 === null) {
      return null;
    }
    const bytes = new Uint8Array(16);
    bytes[10] = 0xff;
    bytes[11] = 0xff;
    bytes.set(ipv4, 12);
    return bytes;
  }

  const halves = value.split('::');
  if (halves.length > 2) {
    return null;
  }
  const head = (halves[0] ?? '').split(':').filter((group) => group.length > 0);
  const tail = halves.length === 2 ? (halves[1] ?? '').split(':').filter((g) => g.length > 0) : [];
  if (halves.length === 1 && head.length !== 8) {
    return null;
  }
  if (head.length + tail.length > 8) {
    return null;
  }
  const groups: string[] = [
    ...head,
    ...new Array<string>(8 - head.length - tail.length).fill('0'),
    ...tail,
  ];
  const bytes = new Uint8Array(16);
  for (let index = 0; index < 8; index += 1) {
    const group = groups[index];
    if (group === undefined || !/^[0-9a-f]{1,4}$/i.test(group)) {
      return null;
    }
    const word = Number.parseInt(group, 16);
    bytes[index * 2] = (word >> 8) & 0xff;
    bytes[index * 2 + 1] = word & 0xff;
  }
  return bytes;
}

/** Normalize any textual address to its 16 byte form, or null. */
export function toBytes(address: string): Uint8Array | null {
  const trimmed = address.trim().toLowerCase();
  if (trimmed.includes(':')) {
    return ipv6ToBytes(trimmed);
  }
  const ipv4 = ipv4ToBytes(trimmed);
  if (ipv4 === null) {
    return null;
  }
  const bytes = new Uint8Array(16);
  bytes[10] = 0xff;
  bytes[11] = 0xff;
  bytes.set(ipv4, 12);
  return bytes;
}

/** True when `address` falls inside `cidr`. Both may be v4 or v6. */
export function ipInCidr(address: string, cidr: string): boolean {
  const [network, prefixText] = cidr.split('/');
  if (network === undefined) {
    return false;
  }
  const addressBytes = toBytes(address);
  const networkBytes = toBytes(network);
  if (addressBytes === null || networkBytes === null) {
    return false;
  }
  const declaredPrefix =
    prefixText === undefined ? (network.includes(':') ? 128 : 32) : Number.parseInt(prefixText, 10);
  if (!Number.isInteger(declaredPrefix) || declaredPrefix < 0) {
    return false;
  }
  // Both sides are held as 16 bytes, so an IPv4 prefix is offset by the 96 bit
  // IPv4-mapped prefix.
  const bits = network.includes(':') ? declaredPrefix : declaredPrefix + 96;
  if (bits > 128) {
    return false;
  }
  const fullBytes = Math.floor(bits / 8);
  for (let index = 0; index < fullBytes; index += 1) {
    if (addressBytes[index] !== networkBytes[index]) {
      return false;
    }
  }
  const remainder = bits % 8;
  if (remainder === 0) {
    return true;
  }
  const mask = (0xff << (8 - remainder)) & 0xff;
  return ((addressBytes[fullBytes] ?? 0) & mask) === ((networkBytes[fullBytes] ?? 0) & mask);
}

/** True when the source address matches any entry. An empty list allows all. */
export function ipInAllowlist(address: string | undefined, allowlist: readonly string[]): boolean {
  if (allowlist.length === 0) {
    return true;
  }
  if (address === undefined || address.length === 0) {
    return false;
  }
  return allowlist.some((entry) => ipInCidr(address, entry));
}
