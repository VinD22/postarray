import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';

import {
  assertSnapshotUsable,
  capabilityDriftError,
  diffCapabilities,
  usageFromDraft,
} from './capability-diff.js';
import { buildFakeCapabilitySnapshot } from './fake/capabilities.js';
import { fakeDraft, fakeImageAsset, fakeThreadItem } from './fake/fixtures.js';
import { fixedClock } from './ports.js';

const clock = fixedClock('2026-08-04T12:00:00.000Z');
const observedAt = '2026-08-04T11:59:00.000Z';

function snapshot(overrides: Parameters<typeof buildFakeCapabilitySnapshot>[0]['overrides'] = {}) {
  return buildFakeCapabilitySnapshot({
    connectionId: 'conn_00000000000000000000000001',
    accountType: 'personal_profile',
    observedAt,
    overrides,
  });
}

describe('usageFromDraft', () => {
  it('reports exactly what the approved content depends on', () => {
    const draft = fakeDraft(
      {
        contentKind: 'image',
        body: 'A post with an image and a first comment. https://example.invalid/x',
        media: [fakeImageAsset()],
        threadItems: [fakeThreadItem()],
        privacyValue: 'public',
        disclosure: { aiAssisted: true, commercialContent: false, brandedContent: false },
      },
      { clock },
    );
    const usage = usageFromDraft(draft);
    expect(usage.imageCount).toBe(1);
    expect(usage.videoCount).toBe(0);
    expect(usage.usesAltText).toBe(true);
    expect(usage.usesFirstComment).toBe(true);
    expect(usage.usesThreadParts).toBe(false);
    expect(usage.containsUrl).toBe(true);
    expect(usage.usesAiDisclosure).toBe(true);
    expect(usage.largestBytesByKind.image).toBe(240_000);
  });
});

describe('diffCapabilities', () => {
  const draft = fakeDraft({}, { clock });
  const usage = usageFromDraft(draft);

  it('proceeds when nothing changed', () => {
    const result = diffCapabilities({ approved: snapshot(), live: snapshot(), usage, clock });
    expect(result.decision).toBe('proceed');
    expect(result.changes).toHaveLength(0);
    expect(result.capabilityVersionChanged).toBe(false);
  });

  it('warns when a limit tightened but the content still fits', () => {
    const result = diffCapabilities({
      approved: snapshot(),
      live: snapshot({ textMaxLength: 1000 }),
      usage,
      clock,
    });
    expect(result.decision).toBe('warn');
    expect(result.blockingChanges).toHaveLength(0);
    expect(result.changes[0]?.path).toBe('text.maxLength');
  });

  it('requires reapproval when the content no longer fits', () => {
    const result = diffCapabilities({
      approved: snapshot(),
      live: snapshot({ textMaxLength: 10 }),
      usage,
      clock,
    });
    expect(result.decision).toBe('require_reapproval');
    expect(result.blockingChanges[0]?.path).toBe('text.maxLength');
    expect(result.blockingChanges[0]?.remediationCode).toBe('content_too_long');
  });

  it('requires reapproval when a capability the content uses regressed', () => {
    const threaded = fakeDraft(
      { threadItems: [fakeThreadItem({ kind: 'thread', order: 1, delaySeconds: 0 })] },
      { clock },
    );
    const result = diffCapabilities({
      approved: snapshot(),
      live: snapshot({ threadsSupport: 'not_implemented' }),
      usage: usageFromDraft(threaded),
      clock,
    });
    expect(result.decision).toBe('require_reapproval');
    expect(result.blockingChanges.map((change) => change.path)).toContain('threads.support');
  });

  it('only warns when a capability the content does not use regressed', () => {
    const result = diffCapabilities({
      approved: snapshot(),
      live: snapshot({ threadsSupport: 'not_implemented' }),
      usage,
      clock,
    });
    expect(result.decision).toBe('warn');
    expect(result.blockingChanges).toHaveLength(0);
  });

  it('blocks when the provider starts demanding an explicit privacy choice', () => {
    const noPrivacy = fakeDraft({ privacyValue: null }, { clock });
    const result = diffCapabilities({
      approved: snapshot(),
      live: snapshot({ privacyMustBeExplicit: true }),
      usage: usageFromDraft(noPrivacy),
      clock,
    });
    expect(result.decision).toBe('require_reapproval');
    expect(result.blockingChanges.map((change) => change.remediationCode)).toContain(
      'choose_privacy_option',
    );
  });

  it('blocks a snapshot that is too old to publish against', () => {
    const stale = buildFakeCapabilitySnapshot({
      connectionId: 'conn_00000000000000000000000001',
      accountType: 'personal_profile',
      observedAt: '2026-08-04T10:00:00.000Z',
    });
    const result = diffCapabilities({ approved: snapshot(), live: stale, usage, clock });
    expect(result.decision).toBe('block');
    expect(result.snapshotStale).toBe(true);
  });

  it('blocks when the snapshots describe different connections', () => {
    const other = buildFakeCapabilitySnapshot({
      connectionId: 'conn_00000000000000000000000002',
      accountType: 'personal_profile',
      observedAt,
    });
    const result = diffCapabilities({ approved: snapshot(), live: other, usage, clock });
    expect(result.decision).toBe('block');
  });

  it('flags a cost increase without blocking the publish', () => {
    const approved = snapshot();
    const live = {
      ...snapshot(),
      cost: { currency: 'USD', perCreateMinor: 9, perUrlCreateMinor: 90 },
    };
    const result = diffCapabilities({ approved, live, usage, clock });
    expect(result.costIncreased).toBe(true);
    expect(result.decision).toBe('warn');
  });

  it('notices a changed capability version', () => {
    const result = diffCapabilities({
      approved: snapshot(),
      live: snapshot({ capabilityVersion: 'fake-2026-08-04.2' }),
      usage,
      clock,
    });
    expect(result.capabilityVersionChanged).toBe(true);
  });
});

describe('assertSnapshotUsable', () => {
  it('accepts a fresh snapshot', () => {
    expect(() => assertSnapshotUsable(snapshot(), { clock })).not.toThrow();
  });

  it('refuses a snapshot past its age budget', () => {
    expect(() => assertSnapshotUsable(snapshot(), { clock, maxAgeSeconds: 10 })).toThrow(RelayError);
  });
});

describe('capabilityDriftError', () => {
  it('names the changed capability and the remediation', () => {
    const draft = fakeDraft({}, { clock });
    const result = diffCapabilities({
      approved: snapshot(),
      live: snapshot({ textMaxLength: 10 }),
      usage: usageFromDraft(draft),
      clock,
    });
    const error = capabilityDriftError(result);
    expect(error.code).toBe('CAPABILITY_UNSUPPORTED');
    expect(error.details['changedPaths']).toEqual(['text.maxLength']);
    expect(error.details['remediationCode']).toBe('content_too_long');
  });
});
