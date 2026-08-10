import { LOCALE_REVIEWS } from '@relay/i18n';
import type { MessageKey } from '@relay/i18n/translate';

import { pendingTiers } from '@/features/billing/tiers';
import { capabilityStateCounts } from '@/features/marketing/data/connectors';

/**
 * What this product does not do, read from the code that decides it.
 *
 * A comparison page that omits its own gaps is an advertisement. These three
 * sentences are the gaps that matter most to somebody choosing a publishing
 * tool today, and none of them is typed by hand:
 *
 *  - `supported` capability cells come from the reviewed connector records,
 *    which are generated from the connector registry. Zero of them means no
 *    connector has completed its definition of done, which means nothing
 *    publishes to any platform through this product.
 *  - `LOCALE_REVIEWS` is the only thing that can promote a locale out of beta,
 *    and a locale gets an entry there only when a named person signs a date
 *    against it.
 *  - A pricing tier still carrying a founder placeholder cannot be sold, and
 *    `pendingTiers()` is the same function the pricing page uses to decide
 *    what it may put a price on.
 *
 * So when a connector passes, when a locale is reviewed, or when a tier is
 * decided, these rows change themselves. There is no second copy of the truth
 * to forget to update, which is the only way a disclosure survives a year.
 *
 * The sentences themselves are ICU messages with a count argument rather than
 * content strings, because they are the one part of a comparison page whose
 * wording is fixed and whose numbers are not.
 */
export interface ComparisonDisclosure {
  readonly id: string;
  readonly messageKey: MessageKey;
  /** The live count the message pluralizes on. Never a hand written literal. */
  readonly count: number;
}

export function comparisonDisclosures(): readonly ComparisonDisclosure[] {
  return [
    {
      id: 'connectors',
      messageKey: 'web.comparison.disclosure.connectors',
      count: capabilityStateCounts().supported,
    },
    {
      id: 'locales',
      messageKey: 'web.comparison.disclosure.locales',
      count: LOCALE_REVIEWS.length,
    },
    {
      id: 'tiers',
      messageKey: 'web.comparison.disclosure.tiers',
      count: pendingTiers().length,
    },
  ];
}
