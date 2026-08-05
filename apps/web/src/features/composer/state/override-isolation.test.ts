/**
 * The isolation guarantee required by `docs/planning/06`, section 6.1.6.
 *
 * Editing one target must never mutate the master draft or another target, for
 * any overridable field. If this file ever fails, the composer is unsafe to
 * ship regardless of how it looks.
 */

import { describe, expect, it } from 'vitest';
import { OVERRIDABLE_VARIANT_FIELDS, resolveVariant } from '@relay/contracts';

import { composerReducer, newThreadItem } from './composer-reducer';
import { initialComposerState, SEED_ACCOUNTS, SEED_BOOTSTRAP } from './seed';
import type { ComposerState } from '../types';

const X = 'conn_seed_x_acme';
const LINKEDIN = 'conn_seed_li_acme';

function base(): ComposerState {
  return initialComposerState(SEED_BOOTSTRAP);
}

const SAMPLE_VALUES = {
  body: 'A version only this account receives.',
  contentKind: 'image' as const,
  locale: 'de',
  mediaIds: ['media_only_here'],
  links: [],
  signature: null,
  threadItems: [newThreadItem(0, 'comment')],
  schedule: null,
};

describe('target overrides are isolated', () => {
  it.each(OVERRIDABLE_VARIANT_FIELDS)('editing %s on one target changes nothing else', (field) => {
    const before = base();
    const masterSnapshot = JSON.stringify(before.master);

    const after = composerReducer(before, {
      type: 'variant/override',
      connectionId: X,
      field,
      value: SAMPLE_VALUES[field],
    });

    expect(JSON.stringify(after.master)).toBe(masterSnapshot);
    expect(after.overrides[LINKEDIN] ?? {}).toEqual({});
    expect(resolveVariant(after.master, after.overrides[LINKEDIN] ?? {}).values).toEqual(
      resolveVariant(before.master, {}).values,
    );
  });

  it('a target keeps its other fields when one field is overridden', () => {
    let state = base();
    state = composerReducer(state, {
      type: 'variant/override',
      connectionId: LINKEDIN,
      field: 'body',
      value: 'A longer version written for LinkedIn.',
    });
    state = composerReducer(state, {
      type: 'variant/override',
      connectionId: LINKEDIN,
      field: 'mediaIds',
      value: ['media_case_study'],
    });

    const resolved = resolveVariant(state.master, state.overrides[LINKEDIN] ?? {});
    expect(resolved.overridden).toContain('body');
    expect(resolved.overridden).toContain('mediaIds');
    expect(resolved.inherited).toContain('links');
    expect(resolved.inherited).toContain('signature');
  });

  it('an override equal to the master collapses back to inheritance', () => {
    const state = composerReducer(base(), {
      type: 'variant/override',
      connectionId: X,
      field: 'body',
      value: SEED_BOOTSTRAP.master.body,
    });
    expect(state.overrides[X]).toEqual({});
  });

  it('reset to master clears one field and leaves the others', () => {
    let state = base();
    state = composerReducer(state, {
      type: 'variant/override',
      connectionId: X,
      field: 'body',
      value: 'Short X version.',
    });
    state = composerReducer(state, {
      type: 'variant/override',
      connectionId: X,
      field: 'mediaIds',
      value: ['media_x_only'],
    });
    state = composerReducer(state, { type: 'variant/resetField', connectionId: X, field: 'body' });

    expect(state.overrides[X]?.body).toBeUndefined();
    expect(state.overrides[X]?.mediaIds).toEqual(['media_x_only']);
    expect(state.master.body).toBe(SEED_BOOTSTRAP.master.body);
  });

  it('a master edit reaches only the targets that still inherit', () => {
    let state = base();
    state = composerReducer(state, {
      type: 'variant/override',
      connectionId: X,
      field: 'body',
      value: 'X keeps its own words.',
    });
    state = composerReducer(state, {
      type: 'master/patch',
      patch: { body: 'A new canonical sentence.' },
    });

    expect(resolveVariant(state.master, state.overrides[X] ?? {}).values.body).toBe(
      'X keeps its own words.',
    );
    expect(resolveVariant(state.master, state.overrides[LINKEDIN] ?? {}).values.body).toBe(
      'A new canonical sentence.',
    );
  });

  it('a sequence edit on one target does not touch the master sequence', () => {
    let state = base();
    state = composerReducer(state, {
      type: 'sequence/add',
      connectionId: null,
      item: newThreadItem(0, 'comment'),
    });
    const masterItems = state.master.threadItems.length;

    state = composerReducer(state, {
      type: 'sequence/add',
      connectionId: X,
      item: newThreadItem(1, 'thread'),
    });

    expect(state.master.threadItems).toHaveLength(masterItems);
    expect(state.overrides[X]?.threadItems).toHaveLength(masterItems + 1);
    expect(state.overrides[LINKEDIN]?.threadItems).toBeUndefined();
  });

  it('removing a target discards only that target state', () => {
    let state = base();
    state = composerReducer(state, {
      type: 'variant/override',
      connectionId: X,
      field: 'body',
      value: 'X only.',
    });
    state = composerReducer(state, {
      type: 'variant/settings',
      connectionId: LINKEDIN,
      patch: { privacyValue: 'public' },
    });
    state = composerReducer(state, { type: 'target/remove', connectionId: X });

    expect(state.overrides[X]).toBeUndefined();
    expect(state.settings[LINKEDIN]?.privacyValue).toBe('public');
    expect(state.selectedConnectionIds).toEqual([LINKEDIN]);
  });

  it('every seeded account carries its own limits rather than a shared constant', () => {
    const limits = SEED_ACCOUNTS.map((account) => account.capabilities.text.maxLength);
    expect(new Set(limits).size).toBeGreaterThan(1);
  });
});
