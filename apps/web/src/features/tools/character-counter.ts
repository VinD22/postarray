import type { MessageKey } from '@relay/i18n/translate';

import {
  PUBLISHING_LIMITS,
  PUBLISHING_LIMIT_PROVIDERS,
} from '@/features/marketing/data/publishing-limits';
import type {
  LimitCountingUnit,
  LimitLinkCountingMode,
  LimitSource,
  PublishingLimitProvider,
} from '@/features/marketing/data/publishing-limits-types';
import { platformSlug } from '@/features/platforms/registry';

import { NEAR_LIMIT_FRACTION } from './preflight';
import { countText, detectUrls } from './text-count';

/**
 * The generated per platform character counters.
 *
 * One page exists for each platform whose generated dataset carries a body
 * text ceiling. That is the whole rule, and it is the same rule the `/specs`
 * cluster follows: no recorded value, no page. A platform with no adapter in
 * this build has `text: null`, produces no entry here, and therefore has no
 * route, no sitemap line and no row on the tools index. Nothing downstream has
 * to branch on missing data, because nothing downstream is ever handed any.
 *
 * The measurement itself is pure and lives here rather than in the component,
 * so the rule that matters most on this cluster can be read and tested without
 * rendering: a platform that rewrites links to its own shortener charges a flat
 * width per link, so a URL costs what the platform says it costs and not what
 * it looks like. `text-count.ts` implements that; this module decides which
 * platform gets which rule, and states the result.
 *
 * This module must not import `features/marketing/site`: the site map imports
 * these slugs to register the routes, and a cycle between the two would be
 * resolved by whichever module happened to evaluate first.
 */

export interface CharacterCounterPage {
  readonly provider: PublishingLimitProvider;
  /** URL segment. Underscores become hyphens; nothing else changes. */
  readonly slug: string;
  /** Display name, from the shared provider catalog the product also uses. */
  readonly nameKey: MessageKey;
  /** Never null and never zero. A platform without one has no page. */
  readonly maxLength: number;
  readonly countingUnit: LimitCountingUnit;
  readonly linkCountingMode: LimitLinkCountingMode;
  /** The flat width a link is charged at, when the platform charges one. */
  readonly charactersPerLink: number | null;
  readonly source: LimitSource | null;
}

function toPage(provider: PublishingLimitProvider): CharacterCounterPage | null {
  const limits = PUBLISHING_LIMITS[provider];
  if (!limits.adapterPresent || limits.text === null || limits.countingUnit === null) {
    return null;
  }
  if (limits.text.maxLength <= 0) {
    return null;
  }
  return {
    provider,
    slug: platformSlug(provider),
    nameKey: `web.provider.${provider}` as MessageKey,
    maxLength: limits.text.maxLength,
    countingUnit: limits.countingUnit,
    linkCountingMode: limits.text.linkCountingMode,
    charactersPerLink: limits.text.charactersPerLink,
    source: limits.source,
  };
}

export const CHARACTER_COUNTER_PAGES: readonly CharacterCounterPage[] =
  PUBLISHING_LIMIT_PROVIDERS.map(toPage).filter(
    (page): page is CharacterCounterPage => page !== null,
  );

export const CHARACTER_COUNTER_SLUGS: readonly string[] = CHARACTER_COUNTER_PAGES.map(
  (page) => page.slug,
);

const BY_SLUG = new Map(CHARACTER_COUNTER_PAGES.map((page) => [page.slug, page]));

export function findCharacterCounterPage(slug: string): CharacterCounterPage | undefined {
  return BY_SLUG.get(slug);
}

/**
 * The link rule a page may state.
 *
 * `fixed` is only ever reported when the dataset also carries the flat cost,
 * because "a link costs a fixed width" without the width is a sentence with a
 * hole in it, and the measurement falls back to counting the URL as written in
 * exactly that case. Keeping the two in step here means a page cannot describe
 * a rule the counter is not applying.
 */
export function linkRule(page: CharacterCounterPage): LimitLinkCountingMode {
  if (page.linkCountingMode === 'fixed' && page.charactersPerLink === null) {
    return 'actual';
  }
  return page.linkCountingMode;
}

export type CharacterCountStatus = 'pass' | 'warning' | 'fail';

export interface CharacterCount {
  /** What the platform would measure, in the platform's own unit. */
  readonly count: number;
  readonly limit: number;
  /** Characters still available. Negative once the post is over. */
  readonly remaining: number;
  /** How far over the ceiling the post is. Zero while it fits. */
  readonly over: number;
  readonly status: CharacterCountStatus;
  /** Share of the ceiling used, capped at 1 so a bar cannot run off its track. */
  readonly usedFraction: number;
  readonly linkCount: number;
  /** The flat per link cost this platform applied, or null if it charges none. */
  readonly linkCost: number | null;
}

/**
 * Measure one post against one platform.
 *
 * The link rule is the reason this is not `body.length`. Under a `fixed`
 * counting mode the platform replaces every URL with a shortened one before it
 * counts, so a 90 character link and a 20 character link cost the same, and a
 * post can be well past 280 literal characters and still be publishable.
 * Reporting the literal length there would tell a person to cut text they did
 * not need to cut.
 */
export function measurePost(body: string, page: CharacterCounterPage): CharacterCount {
  const count = countText(body, {
    unit: page.countingUnit,
    linkCountingMode: page.linkCountingMode,
    charactersPerLink: page.charactersPerLink,
  });
  const remaining = page.maxLength - count;
  const over = remaining < 0 ? -remaining : 0;
  const near = count >= Math.floor(page.maxLength * NEAR_LIMIT_FRACTION);
  const charged = page.linkCountingMode === 'fixed' ? page.charactersPerLink : null;

  return {
    count,
    limit: page.maxLength,
    remaining,
    over,
    status: over > 0 ? 'fail' : near && body !== '' ? 'warning' : 'pass',
    usedFraction: Math.min(1, count / page.maxLength),
    linkCount: detectUrls(body).length,
    linkCost: charged,
  };
}
