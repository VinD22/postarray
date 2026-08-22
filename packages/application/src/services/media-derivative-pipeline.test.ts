import {
  RelayError,
  mediaDerivativePresetKey,
  type MediaDerivativeOperation,
} from '@relay/contracts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MediaDerivativeView, MediaTransformInput, MediaTransformResult } from '../types';

import {
  derivativeStorageKey,
  produceDerivative,
  type DerivativeBytesPort,
  type DerivativeInsert,
  type DerivativeSource,
  type DerivativeStore,
} from './media-derivative-pipeline';
import { mediaDerivativeWorkflowId } from './media-derivatives';

const WORKSPACE = 'ws_test';
const SOURCE_KEY = `${WORKSPACE}/${'a'.repeat(64)}`;

const CROP: MediaDerivativeOperation = { op: 'crop', x: 10, y: 10, width: 400, height: 300 };
const COMPRESS: MediaDerivativeOperation = { op: 'compress', quality: 70 };

function source(overrides: Partial<DerivativeSource> = {}): DerivativeSource {
  return {
    id: 'media_1',
    storageKey: SOURCE_KEY,
    mimeType: 'image/jpeg',
    width: 1600,
    height: 1200,
    ...overrides,
  };
}

/** An in-memory stand-in for the unique constraint on (asset, preset key). */
class FakeStore implements DerivativeStore {
  readonly rows = new Map<string, MediaDerivativeView>();
  inserts = 0;
  constructor(private readonly asset: DerivativeSource = source()) {}

  async findByPreset(mediaAssetId: string, presetKey: string): Promise<MediaDerivativeView | null> {
    return this.rows.get(`${mediaAssetId}:${presetKey}`) ?? null;
  }

  async loadSource(): Promise<DerivativeSource> {
    return this.asset;
  }

  async insert(input: DerivativeInsert): Promise<MediaDerivativeView> {
    const id = `${input.mediaAssetId}:${input.presetKey}`;
    const existing = this.rows.get(id);
    if (existing !== undefined) {
      return existing;
    }
    this.inserts += 1;
    const view: MediaDerivativeView = {
      id: `mder_${String(this.inserts)}`,
      workspaceId: WORKSPACE,
      mediaAssetId: input.mediaAssetId,
      kind: input.kind,
      presetKey: input.presetKey,
      storageKey: input.storageKey,
      mimeType: input.mimeType,
      byteSize: input.byteSize,
      checksumSha256: input.checksumSha256,
      width: input.width,
      height: input.height,
      operations: input.operations,
      createdAt: '2026-08-10T09:00:00.000Z',
    };
    this.rows.set(id, view);
    return view;
  }
}

class FakeStorage implements DerivativeBytesPort {
  readonly objects = new Map<string, Uint8Array>();
  reads = 0;
  constructor() {
    this.objects.set(SOURCE_KEY, new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
  }
  async read(key: string): Promise<Uint8Array> {
    this.reads += 1;
    const bytes = this.objects.get(key);
    if (bytes === undefined) {
      throw new Error(`missing:${key}`);
    }
    return bytes;
  }
  async write(key: string, bytes: Uint8Array): Promise<unknown> {
    this.objects.set(key, bytes);
    return undefined;
  }
}

function transformer(): {
  fn: (input: MediaTransformInput) => Promise<MediaTransformResult>;
  calls: MediaTransformInput[];
} {
  const calls: MediaTransformInput[] = [];
  return {
    calls,
    fn: async (input: MediaTransformInput): Promise<MediaTransformResult> => {
      calls.push(input);
      const bytes = new Uint8Array([9, 9, 9, 9]);
      return {
        bytes,
        byteSize: bytes.byteLength,
        width: 400,
        height: 300,
        mimeType: input.targetMimeType,
      };
    },
  };
}

async function presetFor(operations: readonly MediaDerivativeOperation[]): Promise<string> {
  return mediaDerivativePresetKey(operations);
}

describe('media derivative pipeline', () => {
  let store: FakeStore;
  let storage: FakeStorage;

  beforeEach(() => {
    store = new FakeStore();
    storage = new FakeStorage();
  });

  it('produces a new object under the workspace prefix and never touches the original', async () => {
    const presetKey = await presetFor([CROP, COMPRESS]);
    const transform = transformer();

    const outcome = await produceDerivative(
      { store, storage, workspaceId: WORKSPACE },
      { mediaAssetId: 'media_1', presetKey, operations: [CROP, COMPRESS] },
      transform.fn,
    );

    expect(outcome.reprocessed).toBe(true);
    expect(outcome.derivative.storageKey).toBe(
      derivativeStorageKey(WORKSPACE, outcome.derivative.checksumSha256),
    );
    expect(outcome.derivative.storageKey.startsWith(`${WORKSPACE}/`)).toBe(true);
    expect(outcome.derivative.storageKey).not.toBe(SOURCE_KEY);
    // The original bytes are exactly as they were.
    expect(storage.objects.get(SOURCE_KEY)).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
    expect(outcome.derivative.checksumSha256).toMatch(/^[0-9a-f]{64}$/u);
    expect(outcome.derivative.kind).toBe('crop');
  });

  it('returns the existing derivative and reprocesses nothing on a repeat request', async () => {
    const presetKey = await presetFor([CROP, COMPRESS]);
    const transform = transformer();
    const call = () =>
      produceDerivative(
        { store, storage, workspaceId: WORKSPACE },
        { mediaAssetId: 'media_1', presetKey, operations: [CROP, COMPRESS] },
        transform.fn,
      );

    const first = await call();
    const second = await call();

    expect(second.reprocessed).toBe(false);
    expect(second.derivative.id).toBe(first.derivative.id);
    expect(store.inserts).toBe(1);
    expect(transform.calls).toHaveLength(1);
    expect(storage.reads).toBe(1);
  });

  it('treats the same operations in a different order as the same derivative', async () => {
    const forwards = await presetFor([CROP, COMPRESS]);
    const backwards = await presetFor([COMPRESS, CROP]);
    expect(backwards).toBe(forwards);

    const transform = transformer();
    await produceDerivative(
      { store, storage, workspaceId: WORKSPACE },
      { mediaAssetId: 'media_1', presetKey: forwards, operations: [CROP, COMPRESS] },
      transform.fn,
    );
    const repeat = await produceDerivative(
      { store, storage, workspaceId: WORKSPACE },
      { mediaAssetId: 'media_1', presetKey: backwards, operations: [COMPRESS, CROP] },
      transform.fn,
    );

    expect(repeat.reprocessed).toBe(false);
    expect(store.inserts).toBe(1);
  });

  it('writes no row when the transform fails', async () => {
    const presetKey = await presetFor([CROP]);
    const failing = vi.fn(async () => {
      throw new Error('decode_failed');
    });

    await expect(
      produceDerivative(
        { store, storage, workspaceId: WORKSPACE },
        { mediaAssetId: 'media_1', presetKey, operations: [CROP] },
        failing,
      ),
    ).rejects.toThrow(/decode_failed/u);

    expect(store.rows.size).toBe(0);
    expect(store.inserts).toBe(0);
    expect(await store.findByPreset('media_1', presetKey)).toBeNull();
  });

  it('writes no row when the transform returns nothing usable', async () => {
    const presetKey = await presetFor([CROP]);
    const empty = async (input: MediaTransformInput): Promise<MediaTransformResult> => ({
      bytes: new Uint8Array(),
      byteSize: 0,
      width: 0,
      height: 0,
      mimeType: input.targetMimeType,
    });

    await expect(
      produceDerivative(
        { store, storage, workspaceId: WORKSPACE },
        { mediaAssetId: 'media_1', presetKey, operations: [CROP] },
        empty,
      ),
    ).rejects.toBeInstanceOf(RelayError);
    expect(store.inserts).toBe(0);
  });

  it('refuses a preset key that does not match the operations it travelled with', async () => {
    const transform = transformer();
    await expect(
      produceDerivative(
        { store, storage, workspaceId: WORKSPACE },
        { mediaAssetId: 'media_1', presetKey: 'f'.repeat(64), operations: [CROP] },
        transform.fn,
      ),
    ).rejects.toBeInstanceOf(RelayError);
    expect(transform.calls).toHaveLength(0);
  });

  it('rejects a plan the source cannot satisfy before it reads a single byte', async () => {
    const outOfBounds: MediaDerivativeOperation = {
      op: 'crop',
      x: 1500,
      y: 0,
      width: 400,
      height: 300,
    };
    const presetKey = await presetFor([outOfBounds]);
    const transform = transformer();

    await expect(
      produceDerivative(
        { store, storage, workspaceId: WORKSPACE },
        { mediaAssetId: 'media_1', presetKey, operations: [outOfBounds] },
        transform.fn,
      ),
    ).rejects.toBeInstanceOf(RelayError);
    expect(storage.reads).toBe(0);
    expect(transform.calls).toHaveLength(0);
  });
});

/**
 * The policy assertion `docs/planning/media-v1-policy.md` asks for.
 *
 * V1 generates no image and no video. The pipeline therefore has exactly one
 * outbound call, and this suite pins both halves of that claim: the call count,
 * and the shape of what crosses it.
 */
describe('non-generative guarantee', () => {
  it('invokes exactly one outbound seam, and it is the local transform', async () => {
    const store = new FakeStore();
    const storage = new FakeStorage();
    const seen: MediaTransformInput[] = [];
    const transform = vi.fn(async (input: MediaTransformInput): Promise<MediaTransformResult> => {
      seen.push(input);
      const bytes = new Uint8Array([4, 4]);
      return { bytes, byteSize: 2, width: 400, height: 300, mimeType: input.targetMimeType };
    });
    const presetKey = await presetFor([CROP, COMPRESS]);

    await produceDerivative(
      { store, storage, workspaceId: WORKSPACE },
      { mediaAssetId: 'media_1', presetKey, operations: [CROP, COMPRESS] },
      transform,
    );

    expect(transform).toHaveBeenCalledTimes(1);
    const input = seen[0];
    expect(input).toBeDefined();
    expect(Object.keys(input ?? {}).sort()).toEqual([
      'bytes',
      'operations',
      'sourceMimeType',
      'targetMimeType',
    ]);
  });

  it('carries no prompt, model, seed or provider anywhere in the request', async () => {
    const store = new FakeStore();
    const storage = new FakeStorage();
    const captured: MediaTransformInput[] = [];
    const presetKey = await presetFor([CROP, COMPRESS]);

    await produceDerivative(
      { store, storage, workspaceId: WORKSPACE },
      { mediaAssetId: 'media_1', presetKey, operations: [CROP, COMPRESS] },
      async (input) => {
        captured.push(input);
        const bytes = new Uint8Array([7]);
        return { bytes, byteSize: 1, width: 400, height: 300, mimeType: input.targetMimeType };
      },
    );

    const banned = ['prompt', 'model', 'seed', 'provider', 'generate', 'upscale', 'inpaint'];
    const serialized = JSON.stringify(
      captured.map((entry) => ({
        sourceMimeType: entry.sourceMimeType,
        targetMimeType: entry.targetMimeType,
        operations: entry.operations,
      })),
    ).toLowerCase();
    for (const word of banned) {
      expect(serialized).not.toContain(word);
    }
  });
});

describe('mediaDerivativeWorkflowId', () => {
  it('is deterministic per asset and preset', () => {
    const key = 'b'.repeat(64);
    expect(mediaDerivativeWorkflowId(WORKSPACE, 'media_1', key)).toBe(
      mediaDerivativeWorkflowId(WORKSPACE, 'media_1', key),
    );
    expect(mediaDerivativeWorkflowId(WORKSPACE, 'media_1', key)).not.toBe(
      mediaDerivativeWorkflowId(WORKSPACE, 'media_2', key),
    );
  });
});
