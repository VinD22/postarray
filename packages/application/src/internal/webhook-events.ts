import { WEBHOOK_EVENT_NAMES } from '@relay/contracts';

/**
 * Membership test for the customer-facing subset of domain events. A `Set`
 * because the dispatcher asks once per event and the array is not tiny.
 */
export const WEBHOOK_EVENT_NAME_SET: ReadonlySet<string> = new Set(WEBHOOK_EVENT_NAMES);
