import { describe, expect, it } from 'vitest';

import { testConnection, testDraft, testThreadItem } from '../shared/testing.js';
import { buildXCapabilities } from './capabilities.js';
import {
  LINK_HEAVY_OPERATION_THRESHOLD,
  X_MICRO_PER_CREATE,
  X_MICRO_PER_URL_CREATE,
  estimateCost,
  isLinkHeavy,
  microToMinor,
} from './cost.js';

const connection = testConnection({
  provider: 'x',
  scopes: ['tweet.read', 'tweet.write', 'users.read', 'media.write'],
  metadata: { username: 'sample_studio_fake' },
});
const capabilities = buildXCapabilities({
  connection,
  observedAt: '2026-08-04T12:00:00.000Z',
  grantedScopes: connection.scopes,
});

describe('X cost model', () => {
  it('prices a plain post at the plain create rate', () => {
    const estimate = estimateCost(
      testDraft({ connection, capabilities, body: 'A short note with no link.' }),
    );
    expect(estimate.microUnits).toBe(X_MICRO_PER_CREATE);
    expect(estimate.urlOperationCount).toBe(0);
    expect(estimate.operations).toHaveLength(1);
  });

  it('prices a post containing a URL at the materially higher URL rate', () => {
    const estimate = estimateCost(
      testDraft({ connection, capabilities, body: 'Read it at https://example.invalid/post' }),
    );
    expect(estimate.microUnits).toBe(X_MICRO_PER_URL_CREATE);
    expect(estimate.urlOperationCount).toBe(1);
    expect(X_MICRO_PER_URL_CREATE).toBeGreaterThan(X_MICRO_PER_CREATE * 10);
  });

  it('charges every thread part as its own create', () => {
    const estimate = estimateCost(
      testDraft({
        connection,
        capabilities,
        body: 'Part one.',
        threadItems: [testThreadItem(1, 'Part two.'), testThreadItem(2, 'Part three.')],
      }),
    );
    expect(estimate.operations).toHaveLength(3);
    expect(estimate.microUnits).toBe(X_MICRO_PER_CREATE * 3);
  });

  it('sums exactly and rounds only once, so twenty plain posts are 30 cents not 40', () => {
    const threadItems = Array.from({ length: 19 }, (_value, index) =>
      testThreadItem(index + 1, `Part ${String(index + 2)}.`),
    );
    const estimate = estimateCost(
      testDraft({ connection, capabilities, body: 'Part one.', threadItems }),
    );
    expect(estimate.operations).toHaveLength(20);
    expect(estimate.microUnits).toBe(X_MICRO_PER_CREATE * 20);
    expect(estimate.minorUnits).toBe(30);
  });

  it('flags a link heavy campaign so the warning reaches the composer', () => {
    const threadItems = Array.from({ length: LINK_HEAVY_OPERATION_THRESHOLD }, (_value, index) =>
      testThreadItem(index + 1, `See https://example.invalid/${String(index)}`),
    );
    const estimate = estimateCost(
      testDraft({ connection, capabilities, body: 'Opening line.', threadItems }),
    );
    expect(isLinkHeavy(estimate)).toBe(true);
    expect(estimate.minorUnits).toBe(microToMinor(X_MICRO_PER_CREATE + X_MICRO_PER_URL_CREATE * 5));
  });

  it('does not flag a campaign with a single link', () => {
    const estimate = estimateCost(
      testDraft({ connection, capabilities, body: 'One link: https://example.invalid/a' }),
    );
    expect(isLinkHeavy(estimate)).toBe(false);
  });
});
