import type { Translator } from '@relay/i18n';

/**
 * The notice page.
 *
 * One page, one shape, for every reason a link does not resolve: unknown,
 * disabled, expired or flagged. An attacker enumerating slugs must not be able
 * to tell "no such link" from "this link exists and is switched off", so the
 * body, the status and the headers are identical in all four cases.
 *
 * It is plain HTML with no script, no external request and no cookie. On a
 * domain whose whole job is to bounce strangers to third-party sites, anything
 * else is a liability.
 */

const ESCAPES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ESCAPES[character] ?? character);
}

export interface NoticePageInput {
  readonly translator: Translator;
  /** Shown so a person reporting a problem can quote it. Not a link id. */
  readonly reference: string;
  /** Absolute URL on the product domain where abuse is reported. */
  readonly abuseReportUrl: string | null;
  readonly locale: string;
  readonly direction: 'ltr' | 'rtl';
}

const STYLE = `
:root{color-scheme:light dark}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
padding:2rem;font:16px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
background:#faf9f7;color:#1c1a17}
main{max-width:34rem}
h1{font-size:1.35rem;font-weight:600;margin:0 0 .5rem}
p{margin:0 0 .75rem;color:#4b4640}
a{color:#1c1a17}
small{color:#6f6961;display:block;margin-top:1.5rem;font-variant-numeric:tabular-nums}
@media (prefers-color-scheme:dark){
body{background:#171614;color:#f2efe9}
p{color:#b8b2a8}
a{color:#f2efe9}
small{color:#8b857c}
}
`.trim();

/** Uses neutral catalog intents so blocked, expired and unknown links stay indistinguishable. */
export function renderNoticePage(input: NoticePageInput): string {
  const { translator } = input;
  const title = translator.t('common.unavailable');
  const body = translator.t('error.not_found.message');
  const reportLabel = translator.t('error.reportToSupport');
  const referenceLine = translator.t('error.reference', { correlationId: input.reference });

  const reportLink =
    input.abuseReportUrl === null
      ? ''
      : `<p><a rel="noreferrer noopener nofollow" href="${escapeHtml(input.abuseReportUrl)}">${escapeHtml(reportLabel)}</a></p>`;

  return [
    '<!doctype html>',
    `<html lang="${escapeHtml(input.locale)}" dir="${input.direction}">`,
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta name="robots" content="noindex,nofollow">',
    '<meta name="referrer" content="no-referrer">',
    `<title>${escapeHtml(title)}</title>`,
    `<style>${STYLE}</style>`,
    '</head>',
    '<body>',
    '<main>',
    `<h1>${escapeHtml(title)}</h1>`,
    `<p>${escapeHtml(body)}</p>`,
    reportLink,
    `<small>${escapeHtml(referenceLine)}</small>`,
    '</main>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

/** Shown when a source is asking for far too many slugs. */
export function renderRateLimitedPage(input: NoticePageInput): string {
  const { translator } = input;
  const title = translator.t('rateLimit.title');
  const body = translator.t('error.rate_limited.message');
  return [
    '<!doctype html>',
    `<html lang="${escapeHtml(input.locale)}" dir="${input.direction}">`,
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta name="robots" content="noindex,nofollow">',
    '<meta name="referrer" content="no-referrer">',
    `<title>${escapeHtml(title)}</title>`,
    `<style>${STYLE}</style>`,
    '</head>',
    '<body>',
    '<main>',
    `<h1>${escapeHtml(title)}</h1>`,
    `<p>${escapeHtml(body)}</p>`,
    `<small>${escapeHtml(translator.t('error.reference', { correlationId: input.reference }))}</small>`,
    '</main>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

/** The only headers a notice page ever carries. No cookie, no cache, no script. */
export const NOTICE_HEADERS: Readonly<Record<string, string>> = Object.freeze({
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'no-store',
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'x-robots-tag': 'noindex, nofollow',
  'content-security-policy':
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
});
