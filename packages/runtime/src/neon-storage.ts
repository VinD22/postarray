import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createHash } from 'node:crypto';

import type { Clock, StoragePort, StoredObject, UploadTicket } from '@relay/application';
import { ERROR_CODES, MediaInvalidError, RelayError } from '@relay/contracts';

const UPLOAD_TICKET_SECONDS = 15 * 60;
const SHA256_PATTERN = /^[0-9a-f]{64}$/u;

export interface NeonStorageOptions {
  readonly endpoint: string;
  readonly region: string;
  readonly bucket: string;
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly clock: Clock;
}

export function base64ChecksumToHex(value: string): string | null {
  try {
    const bytes = Buffer.from(value.replace(/^"|"$/gu, ''), 'base64');
    return bytes.length === 32 ? bytes.toString('hex') : null;
  } catch {
    return null;
  }
}

function assertStorageKey(workspaceId: string, key: string): void {
  if (!key.startsWith(`${workspaceId}/`) || key.includes('..') || /[\r\n]/u.test(key)) {
    throw new MediaInvalidError({ details: { reason: 'invalid_storage_key' } });
  }
}

/** S3-compatible adapter for Neon Object Storage. */
export class NeonObjectStorage implements StoragePort {
  readonly #bucket: string;
  readonly #clock: Clock;
  readonly #client: S3Client;

  constructor(options: NeonStorageOptions) {
    this.#bucket = options.bucket;
    this.#clock = options.clock;
    this.#client = new S3Client({
      endpoint: options.endpoint,
      region: options.region,
      forcePathStyle: true,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    });
  }

  async createUploadTicket(input: {
    readonly workspaceId: string;
    readonly key: string;
    readonly contentType: string;
    readonly byteSize: number;
    readonly checksumSha256: string;
  }): Promise<UploadTicket> {
    assertStorageKey(input.workspaceId, input.key);
    if (!SHA256_PATTERN.test(input.checksumSha256) || input.byteSize < 1) {
      throw new MediaInvalidError({ details: { reason: 'invalid_upload_contract' } });
    }
    const checksumBase64 = Buffer.from(input.checksumSha256, 'hex').toString('base64');
    const command = new PutObjectCommand({
      Bucket: this.#bucket,
      Key: input.key,
      ContentType: input.contentType,
      ChecksumSHA256: checksumBase64,
      Metadata: { 'relay-sha256': input.checksumSha256 },
    });
    const uploadUrl = await getSignedUrl(this.#client, command, {
      expiresIn: UPLOAD_TICKET_SECONDS,
    });
    return {
      uploadUrl,
      method: 'PUT',
      headers: {
        'content-type': input.contentType,
        'x-amz-checksum-sha256': checksumBase64,
        'x-amz-meta-relay-sha256': input.checksumSha256,
      },
      expiresAt: new Date(
        this.#clock.now().getTime() + UPLOAD_TICKET_SECONDS * 1_000,
      ).toISOString(),
      storageKey: input.key,
    };
  }

  async head(key: string): Promise<StoredObject | null> {
    try {
      const result = await this.#client.send(
        new HeadObjectCommand({ Bucket: this.#bucket, Key: key, ChecksumMode: 'ENABLED' }),
      );
      const metadataChecksum = result.Metadata?.['relay-sha256'];
      const checksum =
        metadataChecksum !== undefined && SHA256_PATTERN.test(metadataChecksum)
          ? metadataChecksum
          : result.ChecksumSHA256 === undefined
            ? null
            : base64ChecksumToHex(result.ChecksumSHA256);
      if (result.ContentLength === undefined || checksum === null) {
        throw new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
          details: { subsystem: 'storage', reason: 'object_metadata_incomplete' },
        });
      }
      return {
        key,
        byteSize: result.ContentLength,
        contentType: result.ContentType ?? 'application/octet-stream',
        checksumSha256: checksum,
      };
    } catch (cause) {
      if (
        typeof cause === 'object' &&
        cause !== null &&
        '$metadata' in cause &&
        (cause as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404
      ) {
        return null;
      }
      if (cause instanceof RelayError) throw cause;
      throw new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
        details: { subsystem: 'storage', operation: 'head' },
        cause,
      });
    }
  }

  async read(key: string): Promise<Uint8Array> {
    try {
      const result = await this.#client.send(
        new GetObjectCommand({ Bucket: this.#bucket, Key: key }),
      );
      if (result.Body === undefined) {
        throw new MediaInvalidError({ details: { reason: 'object_missing' } });
      }
      return result.Body.transformToByteArray();
    } catch (cause) {
      if (cause instanceof MediaInvalidError) throw cause;
      throw new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
        details: { subsystem: 'storage', operation: 'read' },
        cause,
      });
    }
  }

  async write(key: string, bytes: Uint8Array, contentType: string): Promise<StoredObject> {
    const checksumSha256 = createHash('sha256').update(bytes).digest('hex');
    await this.#client.send(
      new PutObjectCommand({
        Bucket: this.#bucket,
        Key: key,
        Body: bytes,
        ContentType: contentType,
        ChecksumSHA256: Buffer.from(checksumSha256, 'hex').toString('base64'),
        Metadata: { 'relay-sha256': checksumSha256 },
      }),
    );
    return { key, byteSize: bytes.byteLength, contentType, checksumSha256 };
  }

  async remove(key: string): Promise<void> {
    await this.#client.send(new DeleteObjectCommand({ Bucket: this.#bucket, Key: key }));
  }

  async createDownloadUrl(key: string, ttlSeconds: number): Promise<string> {
    return getSignedUrl(this.#client, new GetObjectCommand({ Bucket: this.#bucket, Key: key }), {
      expiresIn: Math.max(1, Math.min(ttlSeconds, 3_600)),
    });
  }

  close(): void {
    this.#client.destroy();
  }
}
