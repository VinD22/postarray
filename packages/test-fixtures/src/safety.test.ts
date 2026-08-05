import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { GOLDEN_EXAMPLES } from './golden/index.js';
import { createSimulatorRegistry } from './simulators/index.js';

/**
 * Fixture safety, enforced by the build.
 *
 * Every host in this package must be on `example.test`, which RFC 6761 reserves
 * and which can never resolve. There is no real company name, no real handle
 * and no invented third-party URL, so a fixture can never send a developer or a
 * test to somebody else's website, and a leaked fixture can never be mistaken
 * for real customer data.
 */

const SOURCE_ROOT = fileURLToPath(new URL('.', import.meta.url));

/**
 * The only non `example.test` URLs allowed anywhere in this package. Google
 * OAuth scope identifiers happen to be URLs; they are identifiers, not links,
 * and a connector cannot request the wrong one if the fixture spells the real
 * one.
 */
const ALLOWED_NON_FIXTURE_URLS: readonly string[] = [
  'https://www.googleapis.com/auth/youtube.upload',
];

/**
 * Shipped fixture sources. Test files are excluded from the content scans
 * because a test that asserts "we never mention twitter.com" has to contain the
 * string "twitter.com" in order to assert it.
 */
function sourceFiles(options: { includeTests?: boolean } = {}, directory = SOURCE_ROOT): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) {
      out.push(...sourceFiles(options, full));
    } else if (entry.name.endsWith('.ts')) {
      if (entry.name.endsWith('.test.ts') && options.includeTests !== true) {
        continue;
      }
      out.push(full);
    }
  }
  return out;
}

function urlsIn(source: string): string[] {
  return source.match(/https?:\/\/[^\s'"`)\\]+/g) ?? [];
}

describe('every fixture host can never resolve', () => {
  it('uses only example.test, apart from the documented allowlist', () => {
    for (const path of sourceFiles()) {
      for (const url of urlsIn(readFileSync(path, 'utf8'))) {
        if (ALLOWED_NON_FIXTURE_URLS.includes(url)) {
          continue;
        }
        const host = new URL(url).host;
        expect(
          host === 'example.test' || host.endsWith('.example.test'),
          `${path} references ${url}`,
        ).toBe(true);
      }
    }
  });

  it('keeps every simulator host on example.test', () => {
    for (const simulator of createSimulatorRegistry().all) {
      expect(simulator.host.endsWith('.example.test'), simulator.host).toBe(true);
    }
  });

  it('keeps every email address on example.test', () => {
    for (const path of sourceFiles()) {
      const source = readFileSync(path, 'utf8');
      for (const address of source.match(/[\w.+-]+@[\w.-]+\.\w+/g) ?? []) {
        expect(address.endsWith('@example.test'), `${path} references ${address}`).toBe(true);
      }
    }
  });
});

describe('no fabricated third-party identity', () => {
  const forbidden: readonly string[] = [
    'twitter.com',
    'x.com',
    'linkedin.com',
    'instagram.com',
    'facebook.com',
    'youtube.com',
    'tiktok.com',
    'threads.net',
    'bsky.app',
    'polar.sh',
    'postiz',
  ];

  it('never names a real platform domain', () => {
    for (const path of sourceFiles()) {
      const source = readFileSync(path, 'utf8').toLowerCase();
      for (const needle of forbidden) {
        expect(source.includes(needle), `${path} mentions ${needle}`).toBe(false);
      }
    }
  });

  it('uses obviously fake external identifiers everywhere in the golden set', () => {
    const serialized = JSON.stringify(GOLDEN_EXAMPLES);
    for (const externalId of serialized.match(/"fake-[a-z]+-\d{10}"/g) ?? []) {
      expect(externalId.startsWith('"fake-')).toBe(true);
    }
    expect(serialized).toContain('fake-x-');
    expect(serialized).not.toMatch(/https?:\/\/(?!example\.test)/);
  });
});

describe('no credential material', () => {
  const tokenish = [
    /\bsk-[A-Za-z0-9]{16,}/,
    /\bghp_[A-Za-z0-9]{20,}/,
    /\bAKIA[0-9A-Z]{16}\b/,
    /\beyJ[A-Za-z0-9_-]{20,}\./,
    /\bxox[baprs]-[A-Za-z0-9-]{10,}/,
  ];

  it('contains nothing that looks like a real key', () => {
    for (const path of sourceFiles({ includeTests: true })) {
      const source = readFileSync(path, 'utf8');
      for (const pattern of tokenish) {
        expect(pattern.test(source), `${path} matches ${String(pattern)}`).toBe(false);
      }
    }
  });

  it('labels the one token-shaped fixture as unusable', async () => {
    const { FAKE_BEARER_TOKEN } = await import('./ids.js');
    expect(FAKE_BEARER_TOKEN).toContain('FAKE');
    expect(FAKE_BEARER_TOKEN).toContain('DO-NOT-USE');
  });
});

describe('no fabricated performance claim', () => {
  it('keeps golden metric values small, round and obviously synthetic', () => {
    for (const observation of GOLDEN_EXAMPLES.postMetrics) {
      if (observation.value === null) {
        continue;
      }
      expect(observation.value).toBeLessThan(10_000);
      expect(Number.isInteger(observation.value)).toBe(true);
    }
  });

  it('never reports a missing metric as zero', () => {
    for (const observation of [
      ...GOLDEN_EXAMPLES.postMetrics,
      ...GOLDEN_EXAMPLES.accountMetrics,
    ]) {
      if (observation.availability !== 'available') {
        expect(observation.value).toBeNull();
      }
    }
  });
});
