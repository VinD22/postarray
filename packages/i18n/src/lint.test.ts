import { describe, expect, it } from 'vitest';

import {
  APPROVAL_STATES,
  PUBLISH_STATES,
  RELAY_ERROR_CODES,
  VALIDATION_ISSUE_CODES,
} from './codes';
import { assertCatalogValid, formatLintResult, lintCatalog } from './lint';
import { en } from './messages/en/index';

const english = en as Record<string, string>;

function lintOne(key: string, value: string) {
  return lintCatalog({ [key]: value }, { requireCoverage: false });
}

describe('the shipped English catalog', () => {
  it('passes every rule', () => {
    const result = lintCatalog(english, { locale: 'en' });
    if (!result.ok) {
      throw new Error(formatLintResult(result));
    }
    expect(result.ok).toBe(true);
  });

  it('has no warnings either', () => {
    const result = lintCatalog(english, { locale: 'en' });
    expect(result.findings).toEqual([]);
  });

  it('covers every RelayError code', () => {
    for (const code of RELAY_ERROR_CODES) {
      expect(english[`error.${code}.message`], code).toBeTypeOf('string');
    }
  });

  it('covers every publish state', () => {
    expect(PUBLISH_STATES).toHaveLength(15);
    for (const state of PUBLISH_STATES) {
      expect(english[`state.${state}.label`], state).toBeTypeOf('string');
    }
  });

  it('covers every approval state', () => {
    for (const state of APPROVAL_STATES) {
      expect(english[`state.approval.${state}.label`], state).toBeTypeOf('string');
    }
  });

  it('covers every validation issue code', () => {
    for (const code of VALIDATION_ISSUE_CODES) {
      expect(english[`validation.${code}.message`], code).toBeTypeOf('string');
    }
  });

  it('carries the mandated billing copy word for word', () => {
    expect(english['billing.trial.dueToday']).toBe('$0 due today');
    // Kept as a literal because `@relay/i18n` is a leaf and may not import
    // `@relay/billing`. `billing/products.test.ts` is the other end of the
    // pincer: it ties this same sentence to the arithmetic, so the pair fails
    // if a price moves, if the catalog moves, or if the two drift apart.
    expect(english['billing.plan.annualFraming']).toBe('Save $50/year. That is 2 months free.');
    expect(english['billing.plan.annualFraming']).not.toContain('%');
    // A year is quoted as a year. No per-month equivalent, because $250 over
    // twelve is $20.83 and a price with cents in it is the rejected form.
    expect(english['billing.plan.annualFraming']).not.toContain('/month');
    expect(english['billing.mediaGeneration.explanation']).toContain(
      'We do not generate images or video in V1',
    );
    expect(english['billing.mediaGeneration.explanation']).toContain('you keep creative control');
  });

  it('does not mention media generation as something that exists', () => {
    for (const [key, value] of Object.entries(english)) {
      expect(value.toLowerCase(), key).not.toContain('generate an image');
      expect(value.toLowerCase(), key).not.toContain('generate a video');
    }
  });

  it('assertCatalogValid does not throw', () => {
    expect(() => assertCatalogValid(english, { locale: 'en' })).not.toThrow();
  });
});

describe('key rules', () => {
  it('rejects English text used as a key', () => {
    const result = lintOne('Save draft', 'Save draft');
    expect(result.findings.map((f) => f.rule)).toContain('key-is-english-text');
  });

  it('rejects a key with no namespace', () => {
    expect(lintOne('save', 'Save').findings.map((f) => f.rule)).toContain('key-format');
  });

  it('rejects a segment that does not start lower case', () => {
    expect(lintOne('nav.Home', 'Home').findings.map((f) => f.rule)).toContain('key-format');
  });

  it('rejects two keys differing only by case', () => {
    const result = lintCatalog(
      { 'nav.home': 'Home', 'nav.HOME': 'Home' },
      { requireCoverage: false },
    );
    expect(result.findings.map((f) => f.rule)).toContain('key-collision');
  });

  it('rejects a key used as both a message and a namespace', () => {
    const result = lintCatalog(
      { 'action.save': 'Save', 'action.save.tooltip': 'Save this' },
      { requireCoverage: false },
    );
    const collision = result.findings.find((f) => f.rule === 'key-collision');
    expect(collision?.message).toContain('action.save');
  });
});

describe('message rules', () => {
  it('rejects an empty message', () => {
    expect(lintOne('nav.home', '   ').findings.map((f) => f.rule)).toContain('message-empty');
  });

  it('rejects surrounding whitespace', () => {
    expect(lintOne('nav.home', 'Home ').findings.map((f) => f.rule)).toContain(
      'no-trailing-whitespace',
    );
  });

  it('rejects an em dash', () => {
    const result = lintOne('nav.home', 'Home — the calendar');
    expect(result.findings.map((f) => f.rule)).toContain('no-em-dash');
  });

  it('rejects hype words', () => {
    for (const phrase of [
      'A magical calendar',
      'Effortless publishing',
      'Go viral today',
      'Fully autonomous posting',
      'A seamless workflow',
      'Unleash your reach',
      'A game-changing release',
    ]) {
      const result = lintOne('nav.home', phrase);
      expect(
        result.findings.map((f) => f.rule),
        phrase,
      ).toContain('no-hype-word');
    }
  });

  it('accepts ordinary words that merely contain a forbidden word', () => {
    expect(lintOne('nav.home', 'Reviral is not a word here').errorCount).toBe(0);
  });

  it('rejects concatenation markers', () => {
    for (const value of [
      'Published to %s accounts',
      'Published to {0} accounts',
      'Published to {{count}} accounts',
      'Published to ${count} accounts',
    ]) {
      expect(
        lintOne('nav.home', value).findings.map((f) => f.rule),
        value,
      ).toContain('no-concatenation-marker');
    }
  });

  it('rejects a message that is not valid ICU', () => {
    const result = lintOne('nav.home', '{count, plural, one {');
    expect(result.findings.map((f) => f.rule)).toContain('message-parses');
  });
});

describe('plural rules', () => {
  it('accepts a plural that covers the locale categories', () => {
    const result = lintCatalog(
      { 'nav.count': '{count, plural, one {# post} other {# posts}}' },
      { locale: 'en', requireCoverage: false },
    );
    expect(result.errorCount).toBe(0);
  });

  it('rejects a plural missing the other case', () => {
    const result = lintCatalog(
      { 'nav.count': '{count, plural, one {# post}}' },
      { locale: 'en', requireCoverage: false },
    );
    const finding = result.findings.find((f) => f.rule === 'plural-categories');
    expect(finding?.message).toContain('other');
  });

  it('rejects a select missing the other case', () => {
    const result = lintCatalog(
      { 'nav.count': '{when, select, now {Now}}' },
      { locale: 'en', requireCoverage: false },
    );
    const finding = result.findings.find((f) => f.rule === 'plural-categories');
    expect(finding?.message).toContain('select');
  });

  it('rejects a plural missing a category the locale needs', () => {
    const result = lintCatalog(
      { 'nav.count': '{count, plural, one {# wpis} other {# wpisow}}' },
      { locale: 'pl', requireCoverage: false },
    );
    const finding = result.findings.find((f) => f.rule === 'plural-categories');
    expect(finding?.message).toContain('few');
  });

  it('accepts exact selectors as a deliberate cover', () => {
    const result = lintCatalog(
      { 'nav.count': '{count, plural, =0 {Brak} =1 {Jeden} other {Wiele}}' },
      { locale: 'pl', requireCoverage: false },
    );
    expect(result.errorCount).toBe(0);
  });
});

describe('coverage rules', () => {
  it('names every missing domain code', () => {
    const result = lintCatalog({ 'nav.home': 'Home' }, { locale: 'en' });
    const keys = result.findings.map((f) => f.key);
    expect(keys).toContain('error.connection_revoked.message');
    expect(keys).toContain('state.partially_published.label');
    expect(keys).toContain('state.approval.changes_requested.label');
    expect(keys).toContain('validation.alt_text_missing.message');
    expect(formatLintResult(result)).toContain('error.connection_revoked.message');
  });

  it('can be skipped for a catalog under translation', () => {
    const result = lintCatalog({ 'nav.home': 'Startseite' }, { requireCoverage: false });
    expect(result.ok).toBe(true);
  });
});

describe('argument parity against the reference catalog', () => {
  it('rejects a translation that drops an argument', () => {
    const result = lintCatalog(
      { 'receipt.target': '{account} auf dem Kanal' },
      { locale: 'de', requireCoverage: false, reference: english },
    );
    const finding = result.findings.find((f) => f.rule === 'argument-parity');
    expect(finding?.message).toContain('provider');
  });

  it('rejects a translation that invents an argument', () => {
    const result = lintCatalog(
      { 'receipt.target': '{account} on {provider} for {invented}' },
      { locale: 'de', requireCoverage: false, reference: english },
    );
    const finding = result.findings.find((f) => f.rule === 'argument-parity');
    expect(finding?.message).toContain('invented');
  });

  it('accepts a faithful translation', () => {
    const result = lintCatalog(
      { 'receipt.target': '{account} auf {provider}' },
      { locale: 'de', requireCoverage: false, reference: english },
    );
    expect(result.errorCount).toBe(0);
  });
});
