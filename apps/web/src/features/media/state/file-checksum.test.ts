import { describe, expect, it } from 'vitest';

import { sha256File } from './file-checksum';

describe('sha256File', () => {
  it('hashes a browser file incrementally', async () => {
    await expect(sha256File(new Blob(['abc']))).resolves.toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  it('honors cancellation before reading bytes', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(sha256File(new Blob(['not-read']), controller.signal)).rejects.toMatchObject({
      name: 'AbortError',
    });
  });
});
