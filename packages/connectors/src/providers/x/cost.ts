import type { ProviderDraft } from '../shared/contract-shape.js';
import { containsUrl } from '../shared/text.js';

/**
 * The X cost model.
 *
 * X charges per operation and charges materially more for a create that contains a URL.
 * As of 4 August 2026 the published pay-per-use prices are $0.015 per post create and
 * $0.200 per post create containing a URL, with separate read, user and webhook charges.
 * The X developer console is authoritative and prices change without notice, so these
 * constants carry their verification date and are re-verified before implementation.
 *
 * Prices are held in micro-USD (one millionth of a dollar) because $0.015 is not an
 * integer number of cents. Minor units are derived from the exact micro total at the end
 * of the calculation, never per operation, so a twenty post campaign is estimated exactly
 * rather than as twenty rounded posts.
 */

export const MICRO_PER_MINOR = 10_000;
export const X_COST_CURRENCY = 'USD';
export const X_PRICE_VERIFIED_ON = '2026-08-04';

/** $0.015 per plain post create. */
export const X_MICRO_PER_CREATE = 15_000;
/** $0.200 per post create containing a URL. */
export const X_MICRO_PER_URL_CREATE = 200_000;

export type XOperationKind = 'create' | 'url_create';

export interface XCostOperation {
  readonly kind: XOperationKind;
  /** `root`, or `thread.<order>` for a reply that continues a thread. */
  readonly label: string;
  readonly microUnits: number;
}

export interface XCostEstimate {
  readonly currency: typeof X_COST_CURRENCY;
  readonly operations: readonly XCostOperation[];
  readonly microUnits: number;
  /** The exact total rounded half up to whole minor units, for money display. */
  readonly minorUnits: number;
  readonly urlOperationCount: number;
  readonly priceVerifiedOn: typeof X_PRICE_VERIFIED_ON;
}

function microFor(body: string): number {
  return containsUrl(body) ? X_MICRO_PER_URL_CREATE : X_MICRO_PER_CREATE;
}

export function microToMinor(microUnits: number): number {
  return Math.round(microUnits / MICRO_PER_MINOR);
}

/**
 * Estimate the API cost of publishing this draft: the root create plus one create for
 * every thread part and first comment, each priced on whether it contains a URL.
 */
export function estimateCost(draft: ProviderDraft): XCostEstimate {
  const operations: XCostOperation[] = [
    { kind: containsUrl(draft.body) ? 'url_create' : 'create', label: 'root', microUnits: microFor(draft.body) },
  ];
  for (const item of draft.threadItems) {
    operations.push({
      kind: containsUrl(item.body) ? 'url_create' : 'create',
      label: `${item.kind}.${item.order}`,
      microUnits: microFor(item.body),
    });
  }
  const microUnits = operations.reduce((total, operation) => total + operation.microUnits, 0);
  return {
    currency: X_COST_CURRENCY,
    operations,
    microUnits,
    minorUnits: microToMinor(microUnits),
    urlOperationCount: operations.filter((operation) => operation.kind === 'url_create').length,
    priceVerifiedOn: X_PRICE_VERIFIED_ON,
  };
}

/**
 * The per-operation figures the capability snapshot carries. The snapshot schema holds
 * whole minor units, and $0.015 is one and a half cents, so the plain create figure is
 * rounded half up to 2 for the coarse capability badge. The authoritative number a user
 * sees in the composer, in the schedule confirmation and on the receipt is
 * `estimateCost(...).minorUnits`, which is computed from the exact micro totals.
 */
export const X_SNAPSHOT_COST = Object.freeze({
  currency: X_COST_CURRENCY,
  perCreateMinor: microToMinor(X_MICRO_PER_CREATE),
  perUrlCreateMinor: microToMinor(X_MICRO_PER_URL_CREATE),
});

/**
 * A campaign is link heavy when enough of its operations carry the expensive URL price
 * that the user should see a prominent warning before scheduling it.
 */
export const LINK_HEAVY_OPERATION_THRESHOLD = 5;

export function isLinkHeavy(estimate: XCostEstimate): boolean {
  return estimate.urlOperationCount >= LINK_HEAVY_OPERATION_THRESHOLD;
}
