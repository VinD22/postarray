import { RelayError, ERROR_CODES, isCustomerVisible } from '@relay/contracts';
import type { BusinessProfile, OpportunityRecord, ToolRecord } from '@relay/contracts';

import { addDays, isoDateOf } from '../clock';
import type { AiVariables, UntrustedSource } from '../types';

/**
 * Retrieval for the Growth Advisor.
 *
 * Retrieval is restricted to three things and nothing else: the CONFIRMED
 * business profile, project sources a human approved, and catalog records in the
 * `active` state. Catalog records enter the prompt as an id plus a summary, so
 * a URL never travels through the model in either direction.
 */

export interface ApprovedProjectSource {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly retrievedAt: string;
  /** Only sources a human approved are eligible. Enforced here, not by callers. */
  readonly approved: boolean;
}

/**
 * Profile fields a user typed or explicitly confirmed. They are valid evidence
 * without being modelled as individual `Fact` rows.
 */
export const PROFILE_EVIDENCE_IDS: readonly string[] = [
  'profile.description',
  'profile.category',
  'profile.idealCustomer',
  'profile.objective',
  'profile.conversionEvent',
  'profile.markets',
  'profile.contentLocales',
  'profile.existingChannels',
  'profile.proofAssets',
  'profile.competitors',
  'profile.weeklyCapacityHours',
];

export interface GrowthContextInput {
  readonly profile: BusinessProfile;
  readonly projectSources: readonly ApprovedProjectSource[];
  readonly opportunities: readonly OpportunityRecord[];
  readonly tools: readonly ToolRecord[];
  readonly windowStart: string;
  readonly windowEnd: string;
}

export interface GrowthPlanContext {
  readonly variables: AiVariables;
  readonly untrustedSources: readonly UntrustedSource[];
  readonly allowedOpportunityIds: ReadonlySet<string>;
  readonly allowedToolIds: ReadonlySet<string>;
  readonly allowedEvidenceIds: ReadonlySet<string>;
  readonly weeklyCapacity: number;
  readonly prohibitedClaims: readonly string[];
  readonly prohibitedTopics: readonly string[];
  readonly windowStart: string;
  readonly windowEnd: string;
  /** Records excluded because they are not `active`, reported back to the user. */
  readonly excludedCatalogIds: readonly string[];
}

function summarizeOpportunity(record: OpportunityRecord): string {
  return [
    `id=${record.id}`,
    `category=${record.category}`,
    `audience=${record.audience}`,
    `regions=${record.regions.join('|')}`,
    `submission=${record.submissionMethod}`,
    `effort=${record.effort}`,
    `cost=${record.costMinor === null ? 'unknown' : `${record.costMinor} ${record.currency ?? ''}`.trim()}`,
    `requiredAsset=${record.requiredAsset ?? 'none'}`,
    `rules=${record.rules.join(' // ')}`,
    `lastVerifiedAt=${record.lastVerifiedAt}`,
  ].join('; ');
}

function summarizeTool(record: ToolRecord): string {
  return [
    `id=${record.id}`,
    `workflows=${record.workflows.join('|')}`,
    `inputs=${record.inputs.join('|')}`,
    `outputs=${record.outputs.join('|')}`,
    `price=${record.priceModel}`,
    `limitations=${record.limitations.join(' // ')}`,
    `rules=${record.rules.join(' // ')}`,
    `lastVerifiedAt=${record.lastVerifiedAt}`,
  ].join('; ');
}

/**
 * Build the grounded context. Throws when the profile has not been confirmed,
 * because confirmation is a human act and the advisor cannot run without it.
 */
export function buildGrowthContext(input: GrowthContextInput): GrowthPlanContext {
  if (input.profile.confirmedAt === null) {
    throw new RelayError(ERROR_CODES.CONFLICT, {
      messageKey: 'error.conflict.message',
      details: { reason: 'business_profile_not_confirmed', profileId: input.profile.id },
    });
  }

  const activeOpportunities = input.opportunities.filter(isCustomerVisible);
  const activeTools = input.tools.filter(isCustomerVisible);
  const excluded = [
    ...input.opportunities
      .filter((record) => !isCustomerVisible(record))
      .map((record) => record.id),
    ...input.tools.filter((record) => !isCustomerVisible(record)).map((record) => record.id),
  ];

  const approvedSources = input.projectSources.filter((source) => source.approved);

  const allowedEvidenceIds = new Set<string>([
    ...PROFILE_EVIDENCE_IDS,
    ...input.profile.facts.map((fact) => fact.id),
    ...approvedSources.map((source) => source.id),
    ...activeOpportunities.map((record) => record.id),
    ...activeTools.map((record) => record.id),
  ]);

  const variables: AiVariables = {
    businessProfileId: input.profile.id,
    businessProfileRevision: input.profile.revision,
    productName: input.profile.productName,
    description: input.profile.description,
    category: input.profile.category,
    idealCustomer: input.profile.idealCustomer,
    objective: input.profile.objective,
    conversionEvent: input.profile.conversionEvent,
    markets: [...input.profile.markets],
    contentLocales: [...input.profile.contentLocales],
    existingChannels: [...input.profile.existingChannels],
    proofAssets: [...input.profile.proofAssets],
    competitors: [...input.profile.competitors],
    weeklyCapacity: input.profile.weeklyCapacityHours,
    confirmedFacts: input.profile.facts.map((fact) => `${fact.id}: ${fact.statement}`),
    assumptions: input.profile.assumptions.map(
      (assumption) => `${assumption.id}: ${assumption.statement}`,
    ),
    prohibitedClaims: [...input.profile.prohibitedClaims],
    prohibitedTopics: [...input.profile.prohibitedTopics],
    approvedSourceIds: approvedSources.map((source) => source.id),
    catalogOpportunities: activeOpportunities.map(summarizeOpportunity),
    catalogTools: activeTools.map(summarizeTool),
    windowStart: input.windowStart,
    windowEnd: input.windowEnd,
  };

  const untrustedSources: UntrustedSource[] = approvedSources.map((source) => ({
    id: source.id,
    origin: 'uploaded_file',
    label: source.title,
    text: source.text,
    retrievedAt: source.retrievedAt,
  }));

  return {
    variables,
    untrustedSources,
    allowedOpportunityIds: new Set(activeOpportunities.map((record) => record.id)),
    allowedToolIds: new Set(activeTools.map((record) => record.id)),
    allowedEvidenceIds,
    weeklyCapacity: input.profile.weeklyCapacityHours,
    prohibitedClaims: [...input.profile.prohibitedClaims],
    prohibitedTopics: [...input.profile.prohibitedTopics],
    windowStart: input.windowStart,
    windowEnd: input.windowEnd,
    excludedCatalogIds: excluded,
  };
}

/** Four whole weeks starting on the given date, as ISO dates. */
export function planWindow(start: Date): { windowStart: string; windowEnd: string } {
  return { windowStart: isoDateOf(start), windowEnd: isoDateOf(addDays(start, 27)) };
}
