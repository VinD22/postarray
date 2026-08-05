import { describe, expect, it } from 'vitest';

import {
  OVERRIDABLE_VARIANT_FIELDS,
  checksumPayload,
  diffFromMaster,
  linkSpecSchema,
  masterDraftSchema,
  postVariantSchema,
  pruneRedundantOverrides,
  repeatSpecSchema,
  resetFieldToMaster,
  resolveVariant,
  scheduleSpecSchema,
  threadItemSchema,
} from './content';
import type { MasterDraft, ThreadItem, VariantOverrides } from './content';
import { ID_PREFIXES, newId } from './ids';
import { canonicalJson } from './primitives';

function link(url: string) {
  return {
    originalUrl: url,
    tracked: false,
    shortLinkId: null,
    publishedUrl: null,
    utm: null,
    frozenAt: null,
  };
}

function threadItem(order: number, body: string): ThreadItem {
  return {
    id: newId(ID_PREFIXES.comment),
    kind: 'comment',
    order,
    body,
    mediaIds: [],
    links: [],
    delaySeconds: 300,
    connectionId: null,
  };
}

function master(overrides: Partial<MasterDraft> = {}): MasterDraft {
  return {
    id: newId(ID_PREFIXES.contentItem),
    workspaceId: newId(ID_PREFIXES.workspace),
    brandId: null,
    campaignId: null,
    title: null,
    body: 'One master draft, many native variants.',
    contentKind: 'text',
    locale: 'en',
    mediaIds: [],
    links: [link('https://example.com/launch')],
    signature: null,
    threadItems: [threadItem(0, 'A first comment.')],
    schedule: null,
    disclosure: { aiAssisted: false, commercialContent: false, brandedContent: false },
    createdVia: 'web',
    ...overrides,
  };
}

describe('schemas', () => {
  it('accepts a well formed master draft and rejects unknown keys', () => {
    const draft = master();
    expect(masterDraftSchema.parse(draft)).toEqual(draft);
    expect(masterDraftSchema.safeParse({ ...draft, surprise: true }).success).toBe(false);
  });

  it('rejects an identifier carrying the wrong prefix', () => {
    expect(masterDraftSchema.safeParse({ ...master(), id: newId(ID_PREFIXES.media) }).success).toBe(
      false,
    );
  });

  it('requires links to be absolute http(s) URLs', () => {
    expect(linkSpecSchema.safeParse(link('https://example.com')).success).toBe(true);
    expect(linkSpecSchema.safeParse(link('javascript:alert(1)')).success).toBe(false);
    expect(linkSpecSchema.safeParse(link('/relative')).success).toBe(false);
  });

  it('keeps an instant and its IANA zone together', () => {
    expect(
      scheduleSpecSchema.safeParse({
        instant: '2026-08-04T09:00:00.000Z',
        ianaTimeZone: 'Europe/Berlin',
        repeat: null,
      }).success,
    ).toBe(true);
    expect(
      scheduleSpecSchema.safeParse({
        instant: '2026-08-04T09:00:00.000Z',
        ianaTimeZone: 'Mars/Olympus',
        repeat: null,
      }).success,
    ).toBe(false);
  });

  it('requires a repeat to end, and to end only one way', () => {
    expect(repeatSpecSchema.safeParse({ cadenceDays: 7, endDate: null, count: null }).success).toBe(
      false,
    );
    expect(
      repeatSpecSchema.safeParse({ cadenceDays: 7, endDate: '2026-09-01', count: 4 }).success,
    ).toBe(false);
    expect(repeatSpecSchema.safeParse({ cadenceDays: 7, endDate: null, count: 4 }).success).toBe(
      true,
    );
    expect(repeatSpecSchema.safeParse({ cadenceDays: 9, endDate: null, count: 4 }).success).toBe(
      false,
    );
  });

  it('accepts a variant with no overrides at all', () => {
    const variant = {
      id: newId(ID_PREFIXES.postVariant),
      workspaceId: newId(ID_PREFIXES.workspace),
      contentItemId: newId(ID_PREFIXES.contentItem),
      connectionId: newId(ID_PREFIXES.connection),
      provider: 'linkedin' as const,
      accountType: 'organization' as const,
      overrides: {},
      destination: null,
      mentions: [],
      privacyValue: null,
      disclosure: null,
      capabilityVersion: null,
    };
    expect(postVariantSchema.parse(variant)).toEqual(variant);
  });

  it('rejects a thread item with an unknown field', () => {
    expect(threadItemSchema.safeParse({ ...threadItem(0, 'hi'), extra: 1 }).success).toBe(false);
  });
});

describe('resolveVariant', () => {
  it('inherits every field when nothing is overridden', () => {
    const draft = master();
    const resolved = resolveVariant(draft, {});
    expect([...resolved.inherited].sort()).toEqual([...OVERRIDABLE_VARIANT_FIELDS].sort());
    expect(resolved.overridden).toEqual([]);
    expect(resolved.values.body).toBe(draft.body);
    expect(resolved.values.links).toEqual(draft.links);
    expect(resolved.values.signature).toBeNull();
  });

  it('takes the override when one is present', () => {
    const draft = master();
    const overrides: VariantOverrides = { body: 'A shorter native version.', contentKind: 'image' };
    const resolved = resolveVariant(draft, overrides);
    expect(resolved.overridden).toEqual(['body', 'contentKind']);
    expect(resolved.inherited).not.toContain('body');
    expect(resolved.values.body).toBe('A shorter native version.');
    expect(resolved.values.contentKind).toBe('image');
    expect(resolved.values.locale).toBe(draft.locale);
  });

  it('treats an explicit null as a deliberate clear, not as inheritance', () => {
    const signature = {
      signatureId: newId(ID_PREFIXES.signature),
      appliedText: 'Built by the team.',
      locale: 'en',
      autoApplied: true,
    };
    const draft = master({ signature });
    expect(resolveVariant(draft, {}).values.signature).toEqual(signature);
    const cleared = resolveVariant(draft, { signature: null });
    expect(cleared.values.signature).toBeNull();
    expect(cleared.overridden).toContain('signature');
  });

  it('never lets an override on one target reach another target', () => {
    const draft = master();
    const first = resolveVariant(draft, { body: 'Target one.' });
    const second = resolveVariant(draft, {});
    expect(first.values.body).toBe('Target one.');
    expect(second.values.body).toBe(draft.body);
    expect(draft.body).not.toBe('Target one.');
  });

  it('resolves media and thread overrides independently', () => {
    const draft = master();
    const items = [threadItem(0, 'Native first comment.'), threadItem(1, 'And a second part.')];
    const mediaIds = [newId(ID_PREFIXES.media)];
    const resolved = resolveVariant(draft, { threadItems: items, mediaIds });
    expect(resolved.values.threadItems).toEqual(items);
    expect(resolved.values.mediaIds).toEqual(mediaIds);
    expect(resolved.values.links).toEqual(draft.links);
  });
});

describe('diffFromMaster', () => {
  it('reports nothing when the variant inherits everything', () => {
    expect(diffFromMaster(master(), {})).toEqual([]);
  });

  it('reports only fields whose value genuinely differs', () => {
    const draft = master();
    const diffs = diffFromMaster(draft, { body: draft.body, locale: 'de' });
    expect(diffs).toHaveLength(1);
    const [first] = diffs;
    expect(first?.field).toBe('locale');
    expect(first?.masterValue).toBe('en');
    expect(first?.variantValue).toBe('de');
  });

  it('compares structurally rather than by reference', () => {
    const draft = master();
    expect(diffFromMaster(draft, { links: [...draft.links] })).toEqual([]);
    expect(diffFromMaster(draft, { links: [] })).toHaveLength(1);
  });

  it('detects a cleared signature as a difference', () => {
    const draft = master({
      signature: {
        signatureId: newId(ID_PREFIXES.signature),
        appliedText: 'Built by the team.',
        locale: 'en',
        autoApplied: true,
      },
    });
    expect(diffFromMaster(draft, { signature: null })).toHaveLength(1);
  });
});

describe('override maintenance', () => {
  it('prunes overrides that match the master', () => {
    const draft = master();
    const pruned = pruneRedundantOverrides(draft, { body: draft.body, locale: 'fr' });
    expect(pruned).toEqual({ locale: 'fr' });
  });

  it('resets a single field back to inheritance', () => {
    const draft = master();
    const overrides: VariantOverrides = { body: 'Native.', locale: 'fr' };
    const reset = resetFieldToMaster(overrides, 'body');
    expect(reset).toEqual({ locale: 'fr' });
    expect(resolveVariant(draft, reset).values.body).toBe(draft.body);
    expect(overrides.body).toBe('Native.');
  });
});

describe('checksumPayload', () => {
  it('is stable regardless of variant order', () => {
    const draft = master();
    const base = {
      workspaceId: draft.workspaceId,
      contentItemId: draft.id,
      provider: 'x' as const,
      accountType: 'personal_profile' as const,
      overrides: {},
      destination: null,
      mentions: [],
      privacyValue: null,
      disclosure: null,
      capabilityVersion: null,
    };
    const first = {
      ...base,
      id: newId(ID_PREFIXES.postVariant),
      connectionId: newId(ID_PREFIXES.connection),
    };
    const second = {
      ...base,
      id: newId(ID_PREFIXES.postVariant),
      connectionId: newId(ID_PREFIXES.connection),
    };
    expect(canonicalJson(checksumPayload(draft, [first, second]))).toBe(
      canonicalJson(checksumPayload(draft, [second, first])),
    );
  });
});
