import { createHash } from 'node:crypto';

import { ID_PREFIXES, type IdPrefix } from '@relay/contracts';

/**
 * Deterministic identifiers for unmistakably synthetic seed data.
 *
 * The body is a stable 128-bit digest encoded in Post Array's 26-character
 * Crockford representation. The label category selects the same entity prefix
 * production rows use, so seeded data exercises every boundary validator.
 */

const CROCKFORD_ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz';

const SEED_PREFIXES = {
  alias: ID_PREFIXES.userAlias,
  approval_decision: ID_PREFIXES.approvalDecision,
  approval_request: ID_PREFIXES.approval,
  api_key: ID_PREFIXES.apiKey,
  audit: ID_PREFIXES.auditEvent,
  automation_rule: ID_PREFIXES.rule,
  automation_rule_run: ID_PREFIXES.ruleRun,
  project: ID_PREFIXES.project,
  business_profile: ID_PREFIXES.growthProfile,
  campaign: ID_PREFIXES.campaign,
  comment: ID_PREFIXES.comment,
  connection: ID_PREFIXES.connection,
  consent: ID_PREFIXES.consent,
  content_item: ID_PREFIXES.contentItem,
  content_version: ID_PREFIXES.contentVersion,
  credential: ID_PREFIXES.credential,
  destination: ID_PREFIXES.destination,
  entitlement: ID_PREFIXES.entitlement,
  experiment: ID_PREFIXES.experiment,
  glossary: ID_PREFIXES.glossaryTerm,
  growth_plan: ID_PREFIXES.growthPlan,
  incident: ID_PREFIXES.connectionIncident,
  insight: ID_PREFIXES.insight,
  match: ID_PREFIXES.opportunityMatch,
  membership: ID_PREFIXES.membership,
  mention: ID_PREFIXES.mention,
  metric: ID_PREFIXES.metricDefinition,
  observation: ID_PREFIXES.metricObservation,
  opportunity: ID_PREFIXES.opportunity,
  polar_customer: ID_PREFIXES.polarCustomer,
  post_variant: ID_PREFIXES.postVariant,
  posting_set: ID_PREFIXES.set,
  provider_limit: ID_PREFIXES.providerLimit,
  publish_attempt: ID_PREFIXES.publishAttempt,
  publish_job: ID_PREFIXES.publishJob,
  receipt: ID_PREFIXES.receipt,
  rss_feed: ID_PREFIXES.feed,
  rss_feed_item: ID_PREFIXES.feedItem,
  service_account: ID_PREFIXES.serviceAccount,
  short_link: ID_PREFIXES.shortLink,
  short_link_click: ID_PREFIXES.shortLinkClick,
  signature: ID_PREFIXES.signature,
  subscription: ID_PREFIXES.subscription,
  tool: ID_PREFIXES.tool,
  user: ID_PREFIXES.user,
  webhook_endpoint: ID_PREFIXES.webhookEndpoint,
  workspace: ID_PREFIXES.workspace,
} as const satisfies Readonly<Record<string, IdPrefix>>;

type SeedKind = keyof typeof SEED_PREFIXES;

function isSeedKind(value: string): value is SeedKind {
  return Object.prototype.hasOwnProperty.call(SEED_PREFIXES, value);
}

function encodeSeedBody(label: string): string {
  let value = BigInt(`0x${createHash('sha256').update(label).digest('hex').slice(0, 32)}`);
  const characters = new Array<string>(26);
  for (let index = characters.length - 1; index >= 0; index -= 1) {
    const character = CROCKFORD_ALPHABET[Number(value & 31n)];
    if (character === undefined) throw new RangeError('SEED_ID_ENCODING_OUT_OF_RANGE');
    characters[index] = character;
    value >>= 5n;
  }
  return characters.join('');
}

export function seedId(label: string): string {
  const kind = label.split(':', 1)[0];
  if (kind === undefined || !isSeedKind(kind)) {
    throw new RangeError(`SEED_ID_KIND_UNREGISTERED:${kind ?? ''}`);
  }
  return `${SEED_PREFIXES[kind]}_${encodeSeedBody(label)}`;
}

/** The one seeded workspace. Everything else hangs off it. */
export const SEED_WORKSPACE_ID = seedId('workspace:northwind');

/** The seed clock remains live so scheduled examples stay in the future. */
export function seedNow(): Date {
  return new Date();
}

export function daysFromNow(days: number, hour = 9, minute = 0): Date {
  const base = seedNow();
  const next = new Date(base.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  next.setUTCHours(hour, minute, 0, 0);
  return next;
}

export function hoursAgo(hours: number): Date {
  return new Date(seedNow().getTime() - hours * 60 * 60 * 1000);
}
