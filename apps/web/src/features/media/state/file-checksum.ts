import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

const HASH_CHUNK_BYTES = 4 * 1024 * 1024;

function readBlob(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') {
    return blob.arrayBuffer();
  }
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () =>
      reject(reader.error ?? new DOMException('File read failed', 'DataError'));
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new DOMException('File read returned text', 'DataError'));
      }
    };
    reader.readAsArrayBuffer(blob);
  });
}

/** Incremental SHA-256 keeps a 500 MiB video from being copied into memory at once. */
export async function sha256File(file: Blob, signal?: AbortSignal): Promise<string> {
  const hash = sha256.create();
  for (let offset = 0; offset < file.size; offset += HASH_CHUNK_BYTES) {
    signal?.throwIfAborted();
    const chunk = file.slice(offset, Math.min(offset + HASH_CHUNK_BYTES, file.size));
    hash.update(new Uint8Array(await readBlob(chunk)));
  }
  signal?.throwIfAborted();
  return bytesToHex(hash.digest());
}
