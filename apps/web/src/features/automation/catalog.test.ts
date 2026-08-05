import { en } from '@relay/i18n';
import { describe, expect, it } from 'vitest';

import { ACTIONS, CONDITIONS, CONTRACT_ENUMS, TRIGGERS } from './catalog';

const catalog = en as Record<string, string | undefined>;

describe('automation catalog coverage', () => {
  it('offers every trigger the contract defines, and nothing else', () => {
    expect([...TRIGGERS.map((spec) => spec.kind)].sort()).toEqual(
      [...CONTRACT_ENUMS.triggers].sort(),
    );
  });

  it('offers every condition the contract defines, and nothing else', () => {
    expect([...CONDITIONS.map((spec) => spec.kind)].sort()).toEqual(
      [...CONTRACT_ENUMS.conditions].sort(),
    );
  });

  it('offers every action the contract defines, and nothing else', () => {
    expect([...ACTIONS.map((spec) => spec.kind)].sort()).toEqual(
      [...CONTRACT_ENUMS.actions].sort(),
    );
  });

  it('marks exactly the contract-consequential actions as consequential', () => {
    const marked = ACTIONS.filter((spec) => spec.consequential).map((spec) => spec.kind);
    expect([...marked].sort()).toEqual([...CONTRACT_ENUMS.consequentialActions].sort());
  });
});

describe('what the catalog must never contain', () => {
  /**
   * These are not features we have not built. They are behaviours this product
   * does not perform, so they must not exist as an option, a disabled option or
   * a string anywhere in the builder.
   */
  const forbidden = [
    'auto_like',
    'like_post',
    'auto_follow',
    'follow_account',
    'send_dm',
    'direct_message',
    'unsolicited_reply',
    'engagement_pod',
    'mass_duplicate',
    'amplify',
  ];

  it('has no forbidden action kind', () => {
    const kinds = ACTIONS.map((spec) => spec.kind as string);
    for (const banned of forbidden) {
      expect(kinds).not.toContain(banned);
    }
  });

  it('has no forbidden trigger or condition kind', () => {
    const kinds = [
      ...TRIGGERS.map((spec) => spec.kind as string),
      ...CONDITIONS.map((spec) => spec.kind as string),
    ];
    for (const banned of forbidden) {
      expect(kinds).not.toContain(banned);
    }
  });
});

describe('every catalog entry can be rendered', () => {
  it('has a real message for every trigger, condition and action sentence', () => {
    for (const spec of [...TRIGGERS, ...CONDITIONS, ...ACTIONS]) {
      expect(catalog[spec.sentenceKey], spec.sentenceKey).toBeTypeOf('string');
      expect(catalog[spec.groupKey], spec.groupKey).toBeTypeOf('string');
    }
  });

  it('has a real message for every parameter label', () => {
    for (const spec of [...TRIGGERS, ...CONDITIONS, ...ACTIONS]) {
      for (const parameter of spec.parameters) {
        expect(catalog[parameter.labelKey], parameter.labelKey).toBeTypeOf('string');
      }
    }
  });
});

describe('safety requirements carried by the catalog', () => {
  it('requires a measurement block on the analytics threshold trigger', () => {
    const threshold = TRIGGERS.find((spec) => spec.kind === 'analytics_threshold');
    expect(threshold?.requiresMeasurement).toBe(true);
  });

  it('requires no measurement block on any other trigger', () => {
    const others = TRIGGERS.filter((spec) => spec.kind !== 'analytics_threshold');
    expect(others.every((spec) => !spec.requiresMeasurement)).toBe(true);
  });

  it('requires preauthorization only on the cross account follow up', () => {
    const requiring = ACTIONS.filter(
      (spec) => spec.requiresCrossAccountPreauthorization === true,
    ).map((spec) => spec.kind);
    expect(requiring).toEqual(['cross_account_follow_up']);
  });

  it('gates every platform specific action behind a connector capability', () => {
    const platformActions = [
      'repost',
      'quote_post',
      'follow_up_comment',
      'continue_sequence',
      'cross_account_follow_up',
      'add_first_comment',
    ];
    for (const kind of platformActions) {
      const spec = ACTIONS.find((entry) => entry.kind === kind);
      expect(spec?.requiresCapability, kind).toBeTypeOf('string');
    }
  });
});
