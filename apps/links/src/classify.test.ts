import { describe, expect, it } from 'vitest';

import { classifyBot, classifyDevice, classifyReferrer, normalizeCountry } from './classify';
import type { RequestSignals } from './classify';

function signals(overrides: Partial<RequestSignals> = {}): RequestSignals {
  return {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
    referrer: undefined,
    accept: 'text/html,application/xhtml+xml',
    purpose: undefined,
    countryHeader: 'DE',
    ...overrides,
  };
}

describe('classifyBot', () => {
  it('treats a normal browser as human', () => {
    expect(classifyBot(signals())).toBe('human');
  });

  it('recognises declared crawlers and link unfurlers', () => {
    const agents = [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'facebookexternalhit/1.1',
      'Twitterbot/1.0',
      'LinkedInBot/1.0 (compatible; Mozilla/5.0)',
      'Slackbot-LinkExpanding 1.0',
      'Mozilla/5.0 (compatible; ClaudeBot/1.0)',
      'GPTBot/1.2',
      'Mozilla/5.0 (compatible; AhrefsBot/7.0)',
    ];
    for (const userAgent of agents) {
      expect(classifyBot(signals({ userAgent })), userAgent).toBe('known_bot');
    }
  });

  it('recognises programmatic clients', () => {
    for (const userAgent of [
      'curl/8.7.1',
      'python-requests/2.32.3',
      'Go-http-client/2.0',
      'okhttp/4.12.0',
      'axios/1.7.7',
      'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/140.0',
    ]) {
      expect(classifyBot(signals({ userAgent })), userAgent).toBe('known_bot');
    }
  });

  it('suspects a missing or implausible agent', () => {
    expect(classifyBot(signals({ userAgent: undefined }))).toBe('suspected_bot');
    expect(classifyBot(signals({ userAgent: '' }))).toBe('suspected_bot');
    expect(classifyBot(signals({ userAgent: 'x' }))).toBe('suspected_bot');
    expect(
      classifyBot(signals({ userAgent: 'CustomFetcherAgent/9.1 (+https://example.test)' })),
    ).toBe('suspected_bot');
  });

  it('suspects a prefetch or prerender', () => {
    expect(classifyBot(signals({ purpose: 'prefetch' }))).toBe('suspected_bot');
    expect(classifyBot(signals({ purpose: 'prefetch;prerender' }))).toBe('suspected_bot');
  });

  it('suspects a request that does not want a document', () => {
    expect(classifyBot(signals({ accept: 'application/json' }))).toBe('suspected_bot');
    expect(classifyBot(signals({ accept: '*/*' }))).toBe('human');
  });
});

describe('classifyDevice', () => {
  it('labels a known bot as bot regardless of the agent shape', () => {
    expect(classifyDevice(signals({ userAgent: 'Googlebot/2.1' }), 'known_bot')).toBe('bot');
  });

  it('separates mobile, tablet and desktop', () => {
    expect(
      classifyDevice(signals({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)' }), 'human'),
    ).toBe('mobile');
    expect(
      classifyDevice(signals({ userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9)' }), 'human'),
    ).toBe('mobile');
    expect(classifyDevice(signals({ userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_0)' }), 'human')).toBe(
      'tablet',
    );
    expect(classifyDevice(signals(), 'human')).toBe('desktop');
  });

  it('says unknown rather than guessing', () => {
    expect(classifyDevice(signals({ userAgent: undefined }), 'suspected_bot')).toBe('unknown');
    expect(classifyDevice(signals({ userAgent: 'Mozilla/5.0 (Unknown)' }), 'human')).toBe(
      'unknown',
    );
  });
});

describe('classifyReferrer', () => {
  it('classifies without keeping the URL', () => {
    expect(classifyReferrer(undefined)).toBe('direct');
    expect(classifyReferrer('')).toBe('direct');
    expect(classifyReferrer('https://www.google.com/search?q=secret+query')).toBe('search');
    expect(classifyReferrer('https://t.co/abcdef')).toBe('social');
    expect(classifyReferrer('https://www.linkedin.com/feed/')).toBe('social');
    expect(classifyReferrer('https://mail.google.com/mail/u/0')).toBe('email');
    expect(classifyReferrer('https://news.example.org/post')).toBe('other');
    expect(classifyReferrer('nonsense')).toBe('other');
  });
});

describe('normalizeCountry', () => {
  it('accepts a two letter code', () => {
    expect(normalizeCountry('de')).toBe('DE');
    expect(normalizeCountry(' BR ')).toBe('BR');
  });

  it('rejects placeholders and junk rather than storing them', () => {
    for (const value of [undefined, '', 'XX', 'T1', 'EU', 'DEU', '1']) {
      expect(normalizeCountry(value), String(value)).toBeNull();
    }
  });
});
