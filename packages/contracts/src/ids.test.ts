import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ID_BODY_LENGTH,
  ID_PREFIXES,
  ID_PREFIX_VALUES,
  anyIdSchema,
  compareIds,
  idSchema,
  idTimestamp,
  isId,
  isKnownId,
  newId,
  newIdFor,
  parseId,
  safeParseId,
} from './ids.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('newId', () => {
  it('produces a prefixed, fixed width, lowercase body', () => {
    const id = newId(ID_PREFIXES.contentItem);
    const [prefix, body] = id.split('_');
    expect(prefix).toBe('content');
    expect(body).toHaveLength(ID_BODY_LENGTH);
    expect(body).toMatch(/^[0-9abcdefghjkmnpqrstvwxyz]+$/);
    expect(body).not.toMatch(/[ilou]/);
  });

  it('round trips every registered prefix', () => {
    for (const prefix of ID_PREFIX_VALUES) {
      const id = newId(prefix);
      expect(parseId(id).prefix).toBe(prefix);
      expect(isId(prefix, id)).toBe(true);
      expect(isKnownId(id)).toBe(true);
    }
  });

  it('accepts an entity name through newIdFor', () => {
    expect(isId(ID_PREFIXES.publishJob, newIdFor('publishJob'))).toBe(true);
  });

  it('encodes the current instant', () => {
    const before = Date.now();
    const stamp = idTimestamp(newId(ID_PREFIXES.receipt)).getTime();
    const after = Date.now();
    expect(stamp).toBeGreaterThanOrEqual(before);
    expect(stamp).toBeLessThanOrEqual(after + 1);
  });
});

describe('monotonic sortability', () => {
  it('is strictly increasing inside a single frozen millisecond', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-04T12:00:00.000Z'));
    const ids = Array.from({ length: 500 }, () => newId(ID_PREFIXES.postVariant));
    const sorted = [...ids].sort(compareIds);
    expect(ids).toEqual(sorted);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('orders ids minted across advancing milliseconds', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-04T12:00:00.000Z'));
    const first = newId(ID_PREFIXES.media);
    vi.advanceTimersByTime(5);
    const second = newId(ID_PREFIXES.media);
    expect(compareIds(first, second)).toBe(-1);
    expect(idTimestamp(second).getTime() - idTimestamp(first).getTime()).toBe(5);
  });

  it('stays monotonic when the clock moves backwards', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-04T12:00:00.000Z'));
    const first = newId(ID_PREFIXES.media);
    vi.setSystemTime(new Date('2026-08-04T11:59:59.000Z'));
    const second = newId(ID_PREFIXES.media);
    expect(compareIds(first, second)).toBe(-1);
  });
});

describe('parsing', () => {
  it('rejects malformed values', () => {
    expect(safeParseId('nope')).toBeNull();
    expect(safeParseId('_0000000000000000000000000')).toBeNull();
    expect(safeParseId('ws_tooshort')).toBeNull();
    expect(safeParseId('ws_uuuuuuuuuuuuuuuuuuuuuuuuuu')).toBeNull();
    expect(() => parseId('nope')).toThrow();
  });

  it('does not confuse similar prefixes', () => {
    const ruleRunId = newId(ID_PREFIXES.ruleRun);
    expect(isId(ID_PREFIXES.rule, ruleRunId)).toBe(false);
    expect(isId(ID_PREFIXES.ruleRun, ruleRunId)).toBe(true);
  });
});

describe('idSchema', () => {
  it('validates a matching prefix and rejects everything else', () => {
    const schema = idSchema(ID_PREFIXES.workspace);
    const workspaceId = newId(ID_PREFIXES.workspace);
    expect(schema.parse(workspaceId)).toBe(workspaceId);
    expect(schema.safeParse(newId(ID_PREFIXES.brand)).success).toBe(false);
    expect(schema.safeParse('ws_').success).toBe(false);
    expect(schema.safeParse(42).success).toBe(false);
  });

  it('accepts any known prefix through anyIdSchema', () => {
    expect(anyIdSchema.safeParse(newId(ID_PREFIXES.approval)).success).toBe(true);
    expect(anyIdSchema.safeParse('unknownprefix_00000000000000000000000000').success).toBe(false);
  });
});
