import type { ContentKind, ProviderId } from '@relay/contracts';

/**
 * Catalog keys for enum values that appear on screen.
 *
 * These live in one file so a component never builds a key by string
 * concatenation in the middle of JSX. A key built inline is a key the catalog
 * lint cannot see, and the first missing translation is discovered by a user.
 */

export function providerLabelKey(provider: ProviderId): string {
  return `web.provider.${provider}`;
}

export function formatLabelKey(kind: ContentKind): string {
  return `analytics.format.${kind}`;
}

export function unitLabelKey(unit: string): string {
  return `analytics.unit.${unit}`;
}

export function denominatorLabelKey(denominator: string): string {
  return `analytics.denominator.${denominator}`;
}

export function aggregationLabelKey(aggregation: string): string {
  return `analytics.definition.aggregation.${aggregation}`;
}

export function referrerLabelKey(referrerClass: string): string {
  return `analytics.links.referrer.${referrerClass}`;
}

export function deviceLabelKey(deviceClass: string): string {
  return `analytics.links.device.${deviceClass}`;
}
