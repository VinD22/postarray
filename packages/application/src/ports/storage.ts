import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, normalize, relative, resolve, sep } from 'node:path';

import { MediaInvalidError, RelayError } from '@relay/contracts';

import type { Clock, StorageObjectPage, StoragePort, StoredObject, UploadTicket } from '../types';

import { systemClock } from './clock';

/**
 * Local filesystem storage.
 *
 * The default implementation, so the product runs with no object store. It
 * hands out a ticket pointing at the local upload endpoint rather than a signed
 * S3 URL; the media service does not care which, because it only ever sees a
 * `UploadTicket`.
 */

const CONTENT_TYPE_HEADER = 'content-type';
const CHECKSUM_HEADER = 'x-relay-content-sha256';
const MAX_LIST_LIMIT = 1_000;

function assertListInput(input: {
  readonly workspaceId: string;
  readonly prefix: string;
  readonly cursor: string | null;
}): void {
  const workspacePrefix = `${input.workspaceId}/`;
  if (
    !input.prefix.startsWith(workspacePrefix) ||
    input.prefix.includes('..') ||
    /[\r\n]/u.test(input.prefix) ||
    (input.cursor !== null &&
      (!input.cursor.startsWith(workspacePrefix) || input.cursor.includes('..')))
  ) {
    throw new MediaInvalidError({ details: { reason: 'invalid_storage_prefix' } });
  }
}

function pageForKeys(
  keys: readonly string[],
  cursor: string | null,
  requestedLimit: number,
): StorageObjectPage {
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.min(MAX_LIST_LIMIT, Math.trunc(requestedLimit)))
    : 1;
  const next = cursor === null ? 0 : keys.findIndex((key) => key > cursor);
  const start = next === -1 ? keys.length : next;
  const page = keys.slice(start, start + limit);
  return {
    keys: page,
    nextCursor: start + page.length < keys.length ? (page.at(-1) ?? null) : null,
  };
}

export interface LocalStorageOptions {
  readonly rootDirectory: string;
  /** Base URL of the endpoint that accepts the upload body. */
  readonly uploadBaseUrl: string;
  /** Base URL a browser can read a finalized object from. */
  readonly downloadBaseUrl: string;
  readonly ticketTtlSeconds?: number;
  readonly clock?: Clock;
}

export class LocalFileStorage implements StoragePort {
  readonly #root: string;
  readonly #uploadBaseUrl: string;
  readonly #downloadBaseUrl: string;
  readonly #ticketTtlSeconds: number;
  readonly #clock: Clock;

  constructor(options: LocalStorageOptions) {
    this.#root = resolve(options.rootDirectory);
    this.#uploadBaseUrl = options.uploadBaseUrl.replace(/\/+$/, '');
    this.#downloadBaseUrl = options.downloadBaseUrl.replace(/\/+$/, '');
    this.#ticketTtlSeconds = options.ticketTtlSeconds ?? 900;
    this.#clock = options.clock ?? systemClock;
  }

  /**
   * Resolve a storage key to a path inside the root. A key that escapes the
   * root through `..` or an absolute segment is refused rather than clamped,
   * because a caller producing one has a bug worth surfacing.
   */
  #pathFor(key: string): string {
    const cleaned = normalize(key).replace(/^([\\/]|\.\.[\\/])+/, '');
    const candidate = resolve(join(this.#root, cleaned));
    if (candidate !== this.#root && !candidate.startsWith(this.#root + sep)) {
      throw new MediaInvalidError({ details: { reason: 'storage_key_escapes_root' } });
    }
    return candidate;
  }

  async createUploadTicket(input: {
    readonly workspaceId: string;
    readonly key: string;
    readonly contentType: string;
    readonly byteSize: number;
    readonly checksumSha256: string;
  }): Promise<UploadTicket> {
    const expiresAt = new Date(
      this.#clock.now().getTime() + this.#ticketTtlSeconds * 1000,
    ).toISOString();
    return {
      uploadUrl: `${this.#uploadBaseUrl}/${encodeURI(input.key)}`,
      method: 'PUT',
      headers: {
        [CONTENT_TYPE_HEADER]: input.contentType,
        [CHECKSUM_HEADER]: input.checksumSha256,
      },
      expiresAt,
      storageKey: input.key,
    };
  }

  async head(key: string): Promise<StoredObject | null> {
    const path = this.#pathFor(key);
    try {
      const info = await stat(path);
      const bytes = await readFile(path);
      return {
        key,
        byteSize: info.size,
        contentType: 'application/octet-stream',
        checksumSha256: createHash('sha256').update(bytes).digest('hex'),
      };
    } catch {
      return null;
    }
  }

  async read(key: string): Promise<Uint8Array> {
    const path = this.#pathFor(key);
    try {
      const buffer = await readFile(path);
      return new Uint8Array(buffer);
    } catch (cause) {
      throw new MediaInvalidError({ details: { reason: 'object_missing' }, cause });
    }
  }

  async write(key: string, bytes: Uint8Array, contentType: string): Promise<StoredObject> {
    const path = this.#pathFor(key);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, bytes);
    return {
      key,
      byteSize: bytes.byteLength,
      contentType,
      checksumSha256: createHash('sha256').update(bytes).digest('hex'),
    };
  }

  async remove(key: string): Promise<void> {
    await rm(this.#pathFor(key), { force: true });
  }

  async list(input: {
    readonly workspaceId: string;
    readonly prefix: string;
    readonly cursor: string | null;
    readonly limit: number;
  }): Promise<StorageObjectPage> {
    assertListInput(input);
    const root = this.#pathFor(input.prefix);
    const keys = (await this.#fileKeys(root)).sort((left, right) => left.localeCompare(right));
    return pageForKeys(keys, input.cursor, input.limit);
  }

  async #fileKeys(directory: string): Promise<string[]> {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (cause: unknown) {
      if (
        typeof cause === 'object' &&
        cause !== null &&
        'code' in cause &&
        cause.code === 'ENOENT'
      ) {
        return [];
      }
      throw new RelayError('PROVIDER_UNAVAILABLE', {
        details: { subsystem: 'storage', operation: 'list' },
        cause,
      });
    }

    const keys: string[] = [];
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        keys.push(...(await this.#fileKeys(path)));
      } else if (entry.isFile()) {
        keys.push(relative(this.#root, path).split(sep).join('/'));
      }
    }
    return keys;
  }

  async createDownloadUrl(key: string, ttlSeconds: number): Promise<string> {
    const expires = Math.floor(this.#clock.now().getTime() / 1000) + Math.max(1, ttlSeconds);
    return `${this.#downloadBaseUrl}/${encodeURI(key)}?expires=${expires}`;
  }
}

/** Entirely in memory. Used by the test suite so nothing touches a disk. */
export class MemoryStorage implements StoragePort {
  readonly #objects = new Map<string, { bytes: Uint8Array; contentType: string }>();
  readonly #clock: Clock;

  constructor(clock: Clock = systemClock) {
    this.#clock = clock;
  }

  async createUploadTicket(input: {
    readonly workspaceId: string;
    readonly key: string;
    readonly contentType: string;
    readonly byteSize: number;
    readonly checksumSha256: string;
  }): Promise<UploadTicket> {
    return {
      uploadUrl: `memory://uploads/${input.key}`,
      method: 'PUT',
      headers: {
        [CONTENT_TYPE_HEADER]: input.contentType,
        [CHECKSUM_HEADER]: input.checksumSha256,
      },
      expiresAt: new Date(this.#clock.now().getTime() + 900_000).toISOString(),
      storageKey: input.key,
    };
  }

  async head(key: string): Promise<StoredObject | null> {
    const entry = this.#objects.get(key);
    if (entry === undefined) {
      return null;
    }
    return {
      key,
      byteSize: entry.bytes.byteLength,
      contentType: entry.contentType,
      checksumSha256: createHash('sha256').update(entry.bytes).digest('hex'),
    };
  }

  async read(key: string): Promise<Uint8Array> {
    const entry = this.#objects.get(key);
    if (entry === undefined) {
      throw new MediaInvalidError({ details: { reason: 'object_missing' } });
    }
    return entry.bytes;
  }

  async write(key: string, bytes: Uint8Array, contentType: string): Promise<StoredObject> {
    this.#objects.set(key, { bytes, contentType });
    const head = await this.head(key);
    if (head === null) {
      throw new RelayError('INTERNAL', { details: { reason: 'write_lost' } });
    }
    return head;
  }

  async remove(key: string): Promise<void> {
    this.#objects.delete(key);
  }

  async list(input: {
    readonly workspaceId: string;
    readonly prefix: string;
    readonly cursor: string | null;
    readonly limit: number;
  }): Promise<StorageObjectPage> {
    assertListInput(input);
    const keys = [...this.#objects.keys()]
      .filter((key) => key.startsWith(input.prefix))
      .sort((left, right) => left.localeCompare(right));
    return pageForKeys(keys, input.cursor, input.limit);
  }

  async createDownloadUrl(key: string, ttlSeconds: number): Promise<string> {
    const expires = Math.floor(this.#clock.now().getTime() / 1000) + Math.max(1, ttlSeconds);
    return `memory://objects/${key}?expires=${expires}`;
  }
}

export const STORAGE_HEADERS = {
  contentType: CONTENT_TYPE_HEADER,
  checksum: CHECKSUM_HEADER,
} as const;
