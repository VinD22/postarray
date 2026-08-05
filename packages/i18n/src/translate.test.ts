import { describe, expect, it } from 'vitest';

import { en } from './messages/en/index';
import type { PartialCatalog } from './messages/index';
import { createCollectingReporter, createTranslator, scopeTranslator } from './translate';

const english = en as PartialCatalog;

describe('createTranslator', () => {
  it('formats a plain message', () => {
    const t = createTranslator('en', english);
    expect(t.t('action.saveDraft')).toBe('Save draft');
  });

  it('formats plurals', () => {
    const t = createTranslator('en', english);
    expect(t.t('composer.targets.count', { count: 0 })).toBe('No accounts selected');
    expect(t.t('composer.targets.count', { count: 1 })).toBe('1 account');
    expect(t.t('composer.targets.count', { count: 6 })).toBe('6 accounts');
  });

  it('formats selects', () => {
    const t = createTranslator('en', english);
    expect(t.t('composer.targets.publishSummary', { count: 6, when: 'now' })).toBe(
      'This will publish to 6 accounts now',
    );
  });

  it('interpolates named arguments', () => {
    const t = createTranslator('en', english);
    expect(t.t('receipt.target', { account: 'Acme HQ', provider: 'LinkedIn' })).toBe(
      'Acme HQ on LinkedIn',
    );
  });
});

describe('missing translations', () => {
  it('falls back to English and reports once', () => {
    const reporter = createCollectingReporter();
    const partial: PartialCatalog = { 'action.save': 'Guardar' };
    const t = createTranslator('es', partial, { reporter });

    expect(t.t('action.save')).toBe('Guardar');
    expect(t.t('action.saveDraft')).toBe('Save draft');
    expect(t.t('action.saveDraft')).toBe('Save draft');

    expect(reporter.reports).toHaveLength(1);
    expect(reporter.reports[0]).toMatchObject({
      key: 'action.saveDraft',
      locale: 'es',
      reason: 'missing-translation',
    });
  });

  it('reports which keys the active catalog owns', () => {
    const t = createTranslator('es', { 'action.save': 'Guardar' });
    expect(t.has('action.save')).toBe(true);
    expect(t.has('action.saveDraft')).toBe(false);
  });
});

describe('never rendering a key or a broken interpolation', () => {
  it('returns an empty string for a key that exists nowhere', () => {
    const reporter = createCollectingReporter();
    const t = createTranslator('en', english, { reporter });
    expect(t.format('nav.doesNotExist')).toBe('');
    expect(reporter.reports[0]?.reason).toBe('unknown-key');
  });

  it('falls back to the literal text when an argument is missing', () => {
    const reporter = createCollectingReporter();
    const t = createTranslator('en', english, { reporter });
    const output = t.format('receipt.target');
    expect(output).not.toContain('{');
    expect(output).not.toContain('receipt.target');
    expect(output).toBe('on');
    expect(reporter.reports.some((report) => report.reason === 'format-error')).toBe(true);
  });

  it('falls back to English when the translated message is malformed', () => {
    const reporter = createCollectingReporter();
    const broken: PartialCatalog = { 'composer.targets.count': '{count, plural, one {' };
    const t = createTranslator('de', broken, { reporter });
    expect(t.t('composer.targets.count', { count: 3 })).toBe('3 accounts');
    expect(reporter.reports.some((report) => report.reason === 'parse-error')).toBe(true);
  });

  it('does not leak argument values into a report', () => {
    const reporter = createCollectingReporter();
    const t = createTranslator('en', english, { reporter });
    t.format('receipt.target', { account: 'a-private-account-name' });
    const serialized = JSON.stringify(reporter.reports);
    expect(serialized).not.toContain('a-private-account-name');
  });
});

describe('every English message compiles', () => {
  it('formats with a generous set of arguments', () => {
    const reporter = createCollectingReporter();
    const t = createTranslator('en', english, { reporter });
    for (const key of Object.keys(en)) {
      const output = t.format(key, sampleValues);
      expect(typeof output).toBe('string');
      expect(output).not.toContain('{');
    }
    const parseErrors = reporter.reports.filter((report) => report.reason === 'parse-error');
    expect(parseErrors).toEqual([]);
  });
});

describe('scopeTranslator', () => {
  it('prefixes a namespace', () => {
    const t = createTranslator('en', english);
    const scoped = scopeTranslator(t, 'composer.schedule');
    expect(scoped('title')).toBe('Schedule');
  });

  it('tolerates a trailing dot', () => {
    const t = createTranslator('en', english);
    expect(scopeTranslator(t, 'composer.schedule.')('title')).toBe('Schedule');
  });
});

/** Enough arguments to format any message in the catalog. */
const sampleValues: Record<string, string | number> = {
  account: 'Acme HQ',
  accounts: 3,
  action: 'reposting',
  actor: 'Dana',
  amount: '$0.20',
  app: 'Example',
  approver: 'Dana',
  attempt: 1,
  behaviour: 'pauses',
  before: '30 minutes',
  after: '5 minutes',
  baseline: 'your median',
  blocked: 1,
  brand: 'Acme',
  brands: 'Acme',
  cadence: 'every 7 days',
  campaign: 'Launch',
  contentType: 'video',
  correlationId: 'abc123',
  count: 3,
  covered: 8,
  current: 1,
  currentRole: 'Editor',
  date: '4 August 2026',
  days: 30,
  delay: '5 minutes',
  denominator: 'impressions',
  destination: 'Builders',
  developer: 'Example',
  disclosure: 'Paid partnership',
  domain: 'links.example.com',
  duration: '2 minutes',
  email: 'you@example.com',
  end: '1 October',
  endCondition: 'the campaign ends',
  endpoint: 'https://example.com/hooks',
  externalId: '1234567890',
  failed: 1,
  feed: 'Example feed',
  from: '10:00',
  inviter: 'Dana',
  itemTitle: 'Latest item',
  keyword: 'launch',
  label: 'Acme',
  language: 'Japanese',
  limit: 280,
  local: '09:00',
  locale: 'ja',
  market: 'Germany',
  max: 5,
  metric: 'views',
  mimeType: 'image/heic',
  min: 3,
  minutes: 15,
  name: 'Dana',
  number: 1,
  otherProvider: 'LinkedIn',
  over: 12,
  owner: 'Dana',
  percent: '42%',
  permission: 'pages_manage_posts',
  platform: 'LinkedIn',
  policy: 'any approver',
  position: 2,
  provider: 'LinkedIn',
  publications: 5,
  published: 5,
  query: 'launch',
  ready: 2,
  reason: 'the feed timed out',
  relativeTime: '2 minutes ago',
  required: '1080 by 1080',
  results: 12,
  role: 'Admin',
  schedule: 'monthly',
  scope: 'posts:publish',
  seconds: 30,
  signature: 'Acme closing',
  size: '2.1 MB',
  source: 'example.com',
  state: 'Scheduled',
  status: 200,
  target: 'the team channel',
  template: 'Weekly update',
  time: '09:00',
  timeZone: 'Europe/Berlin',
  title: 'Calendar',
  to: '11:00',
  tool: 'draft_post',
  total: 8,
  targets: 3,
  trigger: 'a new feed item appears',
  url: 'https://example.com/a',
  used: 120,
  utc: '07:00',
  value: 100,
  version: '3',
  when: 'now',
  width: 1080,
  height: 1080,
  actual: '1920 by 1080',
  window: '24 hours',
  word: 'delete',
  conditions: 'the brand is Acme',
  actions: 'create a draft',
  query2: '',
  months: 1,
};
