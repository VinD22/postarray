import { describe, expect, it } from 'vitest';

import { ID_PREFIXES, idTimestamp, safeParseId } from '@relay/contracts';

import {
  FIXTURE_DOMAIN,
  FIXTURE_EPOCH_MS,
  FIXTURE_NOW,
  fakeExternalId,
  fakeHandle,
  fixtureChecksum,
  fixtureEmail,
  fixtureId,
  fixtureUrl,
  isFixtureId,
} from './ids';

describe('fixture identifiers', () => {
  it('produces ids that the contracts parser accepts', () => {
    for (const entity of Object.keys(ID_PREFIXES) as Array<keyof typeof ID_PREFIXES>) {
      const id = fixtureId(entity, 'seed');
      const parsed = safeParseId(id);
      expect(parsed, entity).not.toBeNull();
      expect(parsed?.prefix).toBe(ID_PREFIXES[entity]);
      expect(isFixtureId(entity, id)).toBe(true);
    }
  });

  it('is deterministic, which is what makes a golden file reviewable', () => {
    expect(fixtureId('workspace', 'acme')).toBe(fixtureId('workspace', 'acme'));
    expect(fixtureId('workspace', 'acme')).not.toBe(fixtureId('workspace', 'other'));
  });

  it('anchors every id to the fixture epoch so they sort predictably', () => {
    expect(idTimestamp(fixtureId('contentItem', 'a')).getTime()).toBe(FIXTURE_EPOCH_MS);
    const later = fixtureId('contentItem', 'b', { offsetMs: 1_000 });
    expect(idTimestamp(later).getTime()).toBe(FIXTURE_EPOCH_MS + 1_000);
    expect(fixtureId('contentItem', 'a') < later).toBe(true);
  });

  it('anchors the fixture epoch to the documented instant', () => {
    expect(new Date(FIXTURE_EPOCH_MS).toISOString()).toBe(FIXTURE_NOW);
  });

  it('separates entities even when the seed is identical', () => {
    expect(fixtureId('workspace', 'same')).not.toBe(fixtureId('brand', 'same'));
  });
});

describe('fake external identity', () => {
  it('produces obviously fake external ids and handles', () => {
    expect(fakeExternalId('x', 'primary')).toMatch(/^fake-x-\d{10}$/);
    expect(fakeHandle('X Primary')).toBe('fixture_x_primary');
  });

  it('keeps every address and url on a domain that can never resolve', () => {
    expect(FIXTURE_DOMAIN).toBe('example.test');
    expect(fixtureEmail('owner')).toBe('owner@example.test');
    expect(fixtureUrl('/blog')).toBe('https://example.test/blog');
    expect(fixtureUrl('blog')).toBe('https://example.test/blog');
  });

  it('produces sha256 shaped checksums deterministically', () => {
    expect(fixtureChecksum('a')).toMatch(/^[0-9a-f]{64}$/);
    expect(fixtureChecksum('a')).toBe(fixtureChecksum('a'));
    expect(fixtureChecksum('a')).not.toBe(fixtureChecksum('b'));
  });
});
