import type { BotClass, DeviceClass, ReferrerClass } from './types.js';

/**
 * Request classification.
 *
 * Everything here reduces a request to a handful of low-cardinality labels.
 * That is deliberate: a click row must never be able to identify a person, so
 * the user agent, the referrer URL and the address are read once here and are
 * not carried any further.
 */

/** Agents that identify themselves. A crawl is not a click. */
const KNOWN_BOT_TOKENS: readonly string[] = [
  'googlebot',
  'google-inspectiontool',
  'storebot-google',
  'bingbot',
  'bingpreview',
  'adidxbot',
  'slurp',
  'duckduckbot',
  'duckduckgo',
  'baiduspider',
  'yandexbot',
  'sogou',
  'exabot',
  'seznambot',
  'petalbot',
  'applebot',
  'facebookexternalhit',
  'facebookcatalog',
  'facebot',
  'meta-externalagent',
  'twitterbot',
  'linkedinbot',
  'pinterest',
  'redditbot',
  'slackbot',
  'slack-imgproxy',
  'discordbot',
  'telegrambot',
  'whatsapp',
  'skypeuripreview',
  'embedly',
  'quora link preview',
  'outbrain',
  'vkshare',
  'w3c_validator',
  'ia_archiver',
  'archive.org_bot',
  'ahrefsbot',
  'semrushbot',
  'mj12bot',
  'dotbot',
  'blexbot',
  'dataforseobot',
  'serpstatbot',
  'bytespider',
  'gptbot',
  'oai-searchbot',
  'chatgpt-user',
  'claudebot',
  'claude-web',
  'anthropic-ai',
  'perplexitybot',
  'ccbot',
  'amazonbot',
  'google-extended',
  'bot',
  'crawler',
  'spider',
  'scraper',
];

/** Programmatic clients. Not necessarily malicious, definitely not a reader. */
const TOOL_TOKENS: readonly string[] = [
  'curl/',
  'wget/',
  'libwww-perl',
  'python-requests',
  'python-urllib',
  'aiohttp',
  'httpx',
  'go-http-client',
  'java/',
  'okhttp',
  'apache-httpclient',
  'axios/',
  'node-fetch',
  'undici',
  'got (',
  'guzzlehttp',
  'postmanruntime',
  'insomnia',
  'headlesschrome',
  'phantomjs',
  'puppeteer',
  'playwright',
  'scrapy',
  'lighthouse',
  'monitoring',
  'uptimerobot',
  'pingdom',
  'statuscake',
];

const MOBILE_TOKENS: readonly string[] = [
  'iphone',
  'ipod',
  'android',
  'windows phone',
  'blackberry',
  'bb10',
  'opera mini',
  'mobile safari',
  'fennec',
];

const TABLET_TOKENS: readonly string[] = [
  'ipad',
  'tablet',
  'kindle',
  'silk',
  'playbook',
  'nexus 7',
];

const DESKTOP_TOKENS: readonly string[] = [
  'windows nt',
  'macintosh',
  'mac os x',
  'x11',
  'linux',
  'cros',
];

const SEARCH_HOST_TOKENS: readonly string[] = [
  'google.',
  'bing.',
  'duckduckgo.',
  'yahoo.',
  'baidu.',
  'yandex.',
  'ecosia.',
  'brave.com',
  'startpage.com',
  'search.',
];

const SOCIAL_HOST_TOKENS: readonly string[] = [
  'x.com',
  'twitter.com',
  't.co',
  'linkedin.com',
  'lnkd.in',
  'facebook.com',
  'fb.com',
  'instagram.com',
  'threads.net',
  'threads.com',
  'tiktok.com',
  'youtube.com',
  'youtu.be',
  'bsky.app',
  'reddit.com',
  'pinterest.',
  'mastodon.',
  'discord.com',
  'slack.com',
  'telegram.',
  'whatsapp.com',
];

const EMAIL_HOST_TOKENS: readonly string[] = [
  'mail.google.com',
  'outlook.',
  'mail.yahoo.',
  'mail.proton.me',
  'superhuman.com',
  'hey.com',
  'zoho.com',
  'mail.',
  'webmail.',
];

export interface RequestSignals {
  readonly userAgent: string | undefined;
  readonly referrer: string | undefined;
  readonly accept: string | undefined;
  /** `Sec-Purpose`, `Purpose` or `X-Moz`. A prefetch is not a visit. */
  readonly purpose: string | undefined;
  /** Edge-supplied country. Validated, never derived from the raw address here. */
  readonly countryHeader: string | undefined;
}

function normalize(value: string | undefined): string {
  return (value ?? '').toLowerCase();
}

function includesAny(haystack: string, needles: readonly string[]): boolean {
  return needles.some((needle) => haystack.includes(needle));
}

/**
 * Three-way classification. `known_bot` is a self-declared agent or a tool.
 * `suspected_bot` is a request that no browser makes: no agent string, a
 * prefetch hint, or an accept header that does not want a document.
 */
export function classifyBot(signals: RequestSignals): BotClass {
  const agent = normalize(signals.userAgent).trim();
  if (agent.length === 0) {
    return 'suspected_bot';
  }
  if (includesAny(agent, KNOWN_BOT_TOKENS) || includesAny(agent, TOOL_TOKENS)) {
    return 'known_bot';
  }
  const purpose = normalize(signals.purpose);
  if (
    purpose.includes('prefetch') ||
    purpose.includes('preview') ||
    purpose.includes('prerender')
  ) {
    return 'suspected_bot';
  }
  if (agent.length < 16) {
    return 'suspected_bot';
  }
  if (!agent.includes('mozilla/') && !agent.includes('opera/')) {
    return 'suspected_bot';
  }
  const accept = normalize(signals.accept);
  if (accept.length > 0 && !accept.includes('text/html') && !accept.includes('*/*')) {
    return 'suspected_bot';
  }
  return 'human';
}

export function classifyDevice(signals: RequestSignals, botClass: BotClass): DeviceClass {
  if (botClass === 'known_bot') {
    return 'bot';
  }
  const agent = normalize(signals.userAgent);
  if (agent.length === 0) {
    return 'unknown';
  }
  if (includesAny(agent, TABLET_TOKENS)) {
    return 'tablet';
  }
  if (includesAny(agent, MOBILE_TOKENS)) {
    return 'mobile';
  }
  if (includesAny(agent, DESKTOP_TOKENS)) {
    return 'desktop';
  }
  return 'unknown';
}

/**
 * Referrer class only. The full referrer URL can carry a session token or a
 * search query, so it is never stored.
 */
export function classifyReferrer(referrer: string | undefined): ReferrerClass {
  const raw = (referrer ?? '').trim();
  if (raw.length === 0) {
    return 'direct';
  }
  let host: string;
  try {
    host = new URL(raw).hostname.toLowerCase();
  } catch {
    return 'other';
  }
  if (host.length === 0) {
    return 'other';
  }
  if (includesAny(host, EMAIL_HOST_TOKENS)) {
    return 'email';
  }
  if (includesAny(host, SOCIAL_HOST_TOKENS)) {
    return 'social';
  }
  if (includesAny(host, SEARCH_HOST_TOKENS)) {
    return 'search';
  }
  return 'other';
}

const COUNTRY_PATTERN = /^[A-Z]{2}$/;
/** Placeholders several edges emit when they do not know. */
const COUNTRY_PLACEHOLDERS: readonly string[] = ['XX', 'T1', 'ZZ', 'A1', 'A2', 'AP', 'EU'];

/** Two-letter country or nothing. An unknown country is never guessed. */
export function normalizeCountry(value: string | undefined): string | null {
  const candidate = (value ?? '').trim().toUpperCase();
  if (!COUNTRY_PATTERN.test(candidate) || COUNTRY_PLACEHOLDERS.includes(candidate)) {
    return null;
  }
  return candidate;
}
