import { describe, expect, it } from 'vitest';

import {
  computeContentChecksum,
  inheritedFields,
  overriddenFields,
  parseStoredMaster,
  prune,
  reconcileOverrides,
  resolveTarget,
  storedMasterSchema,
  storedOverridesSchema,
  type StoredMaster,
} from './stored-content.js';

function master(overrides: Partial<StoredMaster> = {}): StoredMaster {
  return storedMasterSchema.parse({
    id: 'content-1',
    workspaceId: 'ws-1',
    brandId: 'brand-1',
    campaignId: null,
    title: 'Release notes',
    body: 'We shipped the scheduler.',
    contentKind: 'text',
    locale: 'en',
    mediaIds: [],
    links: [],
    signature: null,
    threadItems: [],
    schedule: null,
    disclosure: { aiAssisted: false, commercialContent: false, brandedContent: false },
    createdVia: 'web',
    ...overrides,
  });
}

describe('the master and override fold', () => {
  it('inherits every field when a target has claimed nothing', () => {
    const resolved = resolveTarget(master(), {});
    expect(resolved.values.body).toBe('We shipped the scheduler.');
    expect(resolved.overridden).toEqual([]);
    expect(resolved.inherited).toContain('body');
  });

  it('uses the target value for a claimed field and inherits the rest', () => {
    const resolved = resolveTarget(master(), { body: 'Shipped. Details on the blog.' });
    expect(resolved.values.body).toBe('Shipped. Details on the blog.');
    expect(resolved.values.locale).toBe('en');
    expect(resolved.overridden).toEqual(['body']);
  });

  it('reports inherited and overridden fields separately', () => {
    const base = master();
    const overrides = storedOverridesSchema.parse({ locale: 'de', body: 'Wir haben geliefert.' });
    expect([...overriddenFields(base, overrides)].sort()).toEqual(['body', 'locale']);
    expect(inheritedFields(base, overrides)).not.toContain('body');
    expect(inheritedFields(base, overrides)).toContain('mediaIds');
  });

  it('collapses an override that happens to equal the master', () => {
    const base = master();
    const pruned = prune(base, { body: base.body, locale: 'de' });
    expect(pruned).toEqual({ locale: 'de' });
  });
});

describe('editing the master never silently overwrites an override', () => {
  it('keeps a claimed field when the master changes that same field', () => {
    const previous = master();
    const next = master({ body: 'A completely rewritten master.' });
    const overrides = storedOverridesSchema.parse({ body: 'The German target copy.' });

    const reconciled = reconcileOverrides({
      previousMaster: previous,
      nextMaster: next,
      overrides,
    });

    expect(reconciled.body).toBe('The German target copy.');
    expect(resolveTarget(next, reconciled).values.body).toBe('The German target copy.');
  });

  it('lets an unclaimed field follow the master', () => {
    const previous = master();
    const next = master({ body: 'A completely rewritten master.' });
    const reconciled = reconcileOverrides({
      previousMaster: previous,
      nextMaster: next,
      overrides: {},
    });
    expect(resolveTarget(next, reconciled).values.body).toBe('A completely rewritten master.');
  });

  it('releases a field only when the caller says so explicitly', () => {
    const previous = master();
    const next = master({ body: 'A completely rewritten master.' });
    const overrides = storedOverridesSchema.parse({ body: 'The German target copy.' });

    const reconciled = reconcileOverrides({
      previousMaster: previous,
      nextMaster: next,
      overrides,
      releaseFields: ['body'],
    });

    expect(reconciled.body).toBeUndefined();
    expect(resolveTarget(next, reconciled).values.body).toBe('A completely rewritten master.');
  });

  it('does not leak one target override into another', () => {
    const base = master();
    const german = storedOverridesSchema.parse({ locale: 'de', body: 'Auf Deutsch.' });
    const english = storedOverridesSchema.parse({});

    expect(resolveTarget(base, german).values.locale).toBe('de');
    expect(resolveTarget(base, english).values.locale).toBe('en');
    expect(resolveTarget(base, english).values.body).toBe(base.body);
  });
});

describe('the content checksum', () => {
  const variant = {
    id: 'conn-1',
    connectionId: 'conn-1',
    provider: 'linkedin',
    accountType: 'personal_profile',
    overrides: {},
    destinationId: null,
    mentions: [],
    privacyValue: null,
    capabilityVersion: '2026-08-04',
  } as const;

  it('is stable for the same content', async () => {
    const first = await computeContentChecksum(master(), [variant]);
    const second = await computeContentChecksum(master(), [variant]);
    expect(first).toBe(second);
    expect(first).toMatch(/^[0-9a-f]{64}$/);
  });

  it('changes when the master body changes', async () => {
    const before = await computeContentChecksum(master(), [variant]);
    const after = await computeContentChecksum(master({ body: 'Different.' }), [variant]);
    expect(before).not.toBe(after);
  });

  it('changes when a target override changes', async () => {
    const before = await computeContentChecksum(master(), [variant]);
    const after = await computeContentChecksum(master(), [
      { ...variant, overrides: { body: 'Target specific.' } },
    ]);
    expect(before).not.toBe(after);
  });

  it('changes when a target is added, so reapproval is required', async () => {
    const before = await computeContentChecksum(master(), [variant]);
    const after = await computeContentChecksum(master(), [
      variant,
      { ...variant, id: 'conn-2', connectionId: 'conn-2' },
    ]);
    expect(before).not.toBe(after);
  });

  it('changes when the locale changes', async () => {
    const before = await computeContentChecksum(master(), [variant]);
    const after = await computeContentChecksum(master({ locale: 'de' }), [variant]);
    expect(before).not.toBe(after);
  });

  it('changes when the schedule changes', async () => {
    const before = await computeContentChecksum(master(), [variant]);
    const after = await computeContentChecksum(
      master({
        schedule: {
          instant: '2026-08-05T09:00:00.000Z',
          ianaTimeZone: 'Europe/Berlin',
          repeat: null,
        },
      }),
      [variant],
    );
    expect(before).not.toBe(after);
  });

  it('changes when the privacy setting changes', async () => {
    const before = await computeContentChecksum(master(), [variant]);
    const after = await computeContentChecksum(master(), [{ ...variant, privacyValue: 'private' }]);
    expect(before).not.toBe(after);
  });

  it('does not depend on the order targets are listed in', async () => {
    const second = { ...variant, id: 'conn-2', connectionId: 'conn-2' };
    const forward = await computeContentChecksum(master(), [variant, second]);
    const reverse = await computeContentChecksum(master(), [second, variant]);
    expect(forward).toBe(reverse);
  });
});

describe('parseStoredMaster', () => {
  it('accepts the payload it wrote', () => {
    expect(parseStoredMaster(master())).toEqual(master());
  });

  it('refuses a payload with an unknown field rather than dropping it', () => {
    expect(() => parseStoredMaster({ ...master(), surprise: true })).toThrow();
  });

  it('refuses a payload missing a required field', () => {
    const { body, ...rest } = master();
    void body;
    expect(() => parseStoredMaster(rest)).toThrow();
  });
});
