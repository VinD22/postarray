import {
  CALENDAR_PROPOSAL_WEEKS,
  MAX_OPPORTUNITIES,
  MAX_TOOL_RECOMMENDATIONS,
} from '@relay/contracts';
import type { GrowthPlan } from '@relay/contracts';

import { parseInstant } from '../clock';
import {
  BARE_DOMAIN_PATTERN,
  EMAIL_PATTERN,
  PHONE_PATTERN,
  PROHIBITED_BEHAVIOUR_PATTERNS,
  TESTIMONIAL_PATTERNS,
  URL_PATTERN,
} from '../patterns';
import type { GrowthPlanContext } from './retrieval';

/**
 * The deterministic post-processor.
 *
 * It runs after the schema parse and before anything is persisted or shown, and
 * it REJECTS rather than silently repairs. Model approval is never security
 * approval: layer one keeps a URL out of the schema, this is layer two, and the
 * renderer that only knows how to resolve catalog ids it looked up itself is
 * layer three.
 */

export const GROWTH_REJECTION_RULES = [
  'R1_UNKNOWN_CATALOG_ID',
  'R2_CATALOG_RECORD_NOT_ACTIVE',
  'R3_UNKNOWN_EVIDENCE_ID',
  'R4_CAP_EXCEEDED',
  'R5_CONTACT_OR_URL_IN_TEXT',
  'R6_INVALID_DATE',
  'R7_CADENCE_OVER_CAPACITY',
  'R8_PROHIBITED_BEHAVIOUR',
  'R9_PROHIBITED_CLAIM_OR_TOPIC',
  'R10_TESTIMONIAL_WITHOUT_CONSENT',
  'R11_ASSUMPTION_STATED_AS_FACT',
  'R12_EMPTY_RISKS_WITH_MISSING_INFORMATION',
  'R13_ZERO_FOR_UNKNOWN_METRIC',
] as const;
export type GrowthRejectionRule = (typeof GROWTH_REJECTION_RULES)[number];

export interface GrowthViolation {
  readonly rule: GrowthRejectionRule;
  /** Dotted path into the plan. */
  readonly path: string;
  /** A short, already-truncated excerpt. Never a whole section. */
  readonly excerpt: string;
}

const EXCERPT_LENGTH = 160;
const MAX_WEEKS_AHEAD = 26;
const MAX_PILLARS = 5;
const MAX_CALENDAR_ITEMS = 28;
const ASSUMPTION_MARKER = /assumption/i;

function excerpt(value: string): string {
  const collapsed = value.replace(/\s+/g, ' ').trim();
  return collapsed.length > EXCERPT_LENGTH ? `${collapsed.slice(0, EXCERPT_LENGTH)}...` : collapsed;
}

interface StringEntry {
  readonly path: string;
  readonly value: string;
}

/** Every string in the plan with its dotted path, for the text-level rules. */
export function collectStrings(value: unknown, prefix = ''): StringEntry[] {
  const entries: StringEntry[] = [];
  const visit = (node: unknown, path: string, depth: number): void => {
    if (depth > 12) {
      return;
    }
    if (typeof node === 'string') {
      entries.push({ path, value: node });
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((entry, index) => {
        visit(entry, `${path}[${index}]`, depth + 1);
      });
      return;
    }
    if (node !== null && typeof node === 'object') {
      for (const [key, entry] of Object.entries(node as Record<string, unknown>)) {
        visit(entry, path.length === 0 ? key : `${path}.${key}`, depth + 1);
      }
    }
  };
  visit(value, prefix, 0);
  return entries;
}

function isIdentifierPath(path: string): boolean {
  return (
    path === 'id' ||
    path === 'schemaVersion' ||
    path === 'promptVersion' ||
    path === 'model' ||
    path === 'generatedAt' ||
    path === 'state' ||
    path.endsWith('opportunityId') ||
    path.endsWith('toolId') ||
    path.endsWith('businessProfileId') ||
    path.endsWith('workspaceId') ||
    path.endsWith('connectionId') ||
    path.endsWith('.id') ||
    path.includes('evidenceIds') ||
    path.includes('proofAssetIds') ||
    path.includes('staleCatalogRecordIds')
  );
}

/** Dates that are structurally `YYYY-MM-DD` and inside a plausible range. */
function checkDate(path: string, value: string, now: Date, violations: GrowthViolation[]): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    violations.push({ rule: 'R6_INVALID_DATE', path, excerpt: excerpt(value) });
    return;
  }
  const parsed = parseInstant(`${value}T00:00:00Z`);
  if (parsed === null) {
    violations.push({ rule: 'R6_INVALID_DATE', path, excerpt: excerpt(value) });
    return;
  }
  const daysAhead = (parsed - now.getTime()) / 86_400_000;
  if (daysAhead < -1) {
    violations.push({ rule: 'R6_INVALID_DATE', path, excerpt: excerpt(value) });
    return;
  }
  if (daysAhead > MAX_WEEKS_AHEAD * 7) {
    violations.push({ rule: 'R6_INVALID_DATE', path, excerpt: excerpt(value) });
  }
}

export interface PostProcessInput {
  readonly plan: GrowthPlan;
  readonly context: GrowthPlanContext;
  readonly now: Date;
  /** Consent artifacts that legitimise a first-person customer claim. */
  readonly consentAssetIds?: readonly string[];
}

export interface PostProcessResult {
  readonly ok: boolean;
  readonly violations: readonly GrowthViolation[];
  /** Rule ids to append to a single repair instruction. */
  readonly repairInstruction: string;
}

export function postProcessGrowthPlan(input: PostProcessInput): PostProcessResult {
  const { plan, context } = input;
  const violations: GrowthViolation[] = [];

  // R1 and R2: catalog ids must have been passed in, and must still be active.
  plan.opportunities.forEach((match, index) => {
    if (!context.allowedOpportunityIds.has(match.opportunityId)) {
      violations.push({
        rule: 'R1_UNKNOWN_CATALOG_ID',
        path: `opportunities[${index}].opportunityId`,
        excerpt: match.opportunityId,
      });
    }
  });
  plan.tool_recommendations.forEach((match, index) => {
    if (!context.allowedToolIds.has(match.toolId)) {
      violations.push({
        rule: 'R1_UNKNOWN_CATALOG_ID',
        path: `tool_recommendations[${index}].toolId`,
        excerpt: match.toolId,
      });
    }
  });
  for (const excluded of context.excludedCatalogIds) {
    const usedInOpportunities = plan.opportunities.some(
      (match) => match.opportunityId === excluded,
    );
    const usedInTools = plan.tool_recommendations.some((match) => match.toolId === excluded);
    if (usedInOpportunities || usedInTools) {
      violations.push({
        rule: 'R2_CATALOG_RECORD_NOT_ACTIVE',
        path: 'opportunities|tool_recommendations',
        excerpt: excluded,
      });
    }
  }

  // R3: evidence must trace to a confirmed fact, an approved source or a record.
  for (const entry of collectStrings(plan)) {
    if (!entry.path.includes('evidenceIds')) {
      continue;
    }
    if (!context.allowedEvidenceIds.has(entry.value)) {
      violations.push({
        rule: 'R3_UNKNOWN_EVIDENCE_ID',
        path: entry.path,
        excerpt: excerpt(entry.value),
      });
    }
  }

  // R4: hard caps. The schema enforces most of these; this catches the rest.
  if (plan.opportunities.length > MAX_OPPORTUNITIES) {
    violations.push({ rule: 'R4_CAP_EXCEEDED', path: 'opportunities', excerpt: 'over 10' });
  }
  if (plan.tool_recommendations.length > MAX_TOOL_RECOMMENDATIONS) {
    violations.push({ rule: 'R4_CAP_EXCEEDED', path: 'tool_recommendations', excerpt: 'over 5' });
  }
  if (plan.content_system.pillars.length > MAX_PILLARS) {
    violations.push({ rule: 'R4_CAP_EXCEEDED', path: 'content_system.pillars', excerpt: 'over 5' });
  }
  if (plan.calendar_proposal.length !== CALENDAR_PROPOSAL_WEEKS) {
    violations.push({
      rule: 'R4_CAP_EXCEEDED',
      path: 'calendar_proposal',
      excerpt: `${plan.calendar_proposal.length} weeks`,
    });
  }
  const calendarItems = plan.calendar_proposal.reduce(
    (total, week) => total + week.slots.length,
    0,
  );
  if (calendarItems > MAX_CALENDAR_ITEMS) {
    violations.push({
      rule: 'R4_CAP_EXCEEDED',
      path: 'calendar_proposal',
      excerpt: `${calendarItems} slots`,
    });
  }

  // R5, R8, R9, R10: text-level rules over every string outside identifier fields.
  const prohibitedClaims = context.prohibitedClaims.map((claim) => claim.toLowerCase());
  const prohibitedTopics = context.prohibitedTopics.map((topic) => topic.toLowerCase());
  const consentIds = new Set(input.consentAssetIds ?? []);

  for (const entry of collectStrings(plan)) {
    if (isIdentifierPath(entry.path)) {
      continue;
    }
    const lowered = entry.value.toLowerCase();

    if (
      URL_PATTERN.test(entry.value) ||
      BARE_DOMAIN_PATTERN.test(entry.value) ||
      EMAIL_PATTERN.test(entry.value) ||
      PHONE_PATTERN.test(entry.value)
    ) {
      violations.push({
        rule: 'R5_CONTACT_OR_URL_IN_TEXT',
        path: entry.path,
        excerpt: excerpt(entry.value),
      });
    }

    for (const pattern of PROHIBITED_BEHAVIOUR_PATTERNS) {
      if (pattern.test(entry.value)) {
        violations.push({
          rule: 'R8_PROHIBITED_BEHAVIOUR',
          path: entry.path,
          excerpt: excerpt(entry.value),
        });
        break;
      }
    }

    for (const claim of prohibitedClaims) {
      if (claim.length > 0 && lowered.includes(claim)) {
        violations.push({
          rule: 'R9_PROHIBITED_CLAIM_OR_TOPIC',
          path: entry.path,
          excerpt: excerpt(claim),
        });
        break;
      }
    }
    for (const topic of prohibitedTopics) {
      if (topic.length > 0 && lowered.includes(topic)) {
        violations.push({
          rule: 'R9_PROHIBITED_CLAIM_OR_TOPIC',
          path: entry.path,
          excerpt: excerpt(topic),
        });
        break;
      }
    }

    if (consentIds.size === 0) {
      for (const pattern of TESTIMONIAL_PATTERNS) {
        if (pattern.test(entry.value)) {
          violations.push({
            rule: 'R10_TESTIMONIAL_WITHOUT_CONSENT',
            path: entry.path,
            excerpt: excerpt(entry.value),
          });
          break;
        }
      }
    }
  }

  // R6: dates.
  checkDate(
    'goals_and_metrics.windowStart',
    plan.goals_and_metrics.windowStart,
    input.now,
    violations,
  );
  checkDate('goals_and_metrics.windowEnd', plan.goals_and_metrics.windowEnd, input.now, violations);
  plan.calendar_proposal.forEach((week, weekIndex) => {
    checkDate(`calendar_proposal[${weekIndex}].startDate`, week.startDate, input.now, violations);
    week.slots.forEach((slot, slotIndex) => {
      checkDate(
        `calendar_proposal[${weekIndex}].slots[${slotIndex}].date`,
        slot.date,
        input.now,
        violations,
      );
    });
  });

  // R7: cadence must fit the capacity the user confirmed.
  const plannedPerWeek = plan.content_system.weeklyCadence.reduce(
    (total, entry) => total + entry.postsPerWeek,
    0,
  );
  if (plannedPerWeek > context.weeklyCapacity) {
    violations.push({
      rule: 'R7_CADENCE_OVER_CAPACITY',
      path: 'content_system.weeklyCadence',
      excerpt: `${plannedPerWeek} planned against a capacity of ${context.weeklyCapacity}`,
    });
  }

  // R11: an assumption may shape strategy. It may never be stated as a fact.
  const assumptionStatements = plan.business_snapshot.assumptions.map((assumption) =>
    assumption.statement
      .replace(/[.!?]+$/, '')
      .trim()
      .toLowerCase(),
  );
  for (const entry of collectStrings(plan)) {
    if (
      entry.path.startsWith('business_snapshot.assumptions') ||
      entry.path.startsWith('risks_and_unknowns.assumptionsRequiringConfirmation') ||
      isIdentifierPath(entry.path)
    ) {
      continue;
    }
    const lowered = entry.value.toLowerCase();
    for (const statement of assumptionStatements) {
      if (
        statement.length >= 12 &&
        lowered.includes(statement) &&
        !ASSUMPTION_MARKER.test(entry.value)
      ) {
        violations.push({
          rule: 'R11_ASSUMPTION_STATED_AS_FACT',
          path: entry.path,
          excerpt: excerpt(entry.value),
        });
        break;
      }
    }
  }

  // R12: a plan built on an incomplete profile must say what it does not know.
  const risks = plan.risks_and_unknowns;
  const risksEmpty =
    risks.unsupportedClaims.length === 0 &&
    risks.missingPermissions.length === 0 &&
    risks.staleCatalogRecordIds.length === 0 &&
    risks.assumptionsRequiringConfirmation.length === 0;
  if (risksEmpty && plan.business_snapshot.missingInformation.length > 0) {
    violations.push({
      rule: 'R12_EMPTY_RISKS_WITH_MISSING_INFORMATION',
      path: 'risks_and_unknowns',
      excerpt: 'empty',
    });
  }

  // R13: unknown is null, never zero.
  if (plan.goals_and_metrics.baseline === 0) {
    violations.push({
      rule: 'R13_ZERO_FOR_UNKNOWN_METRIC',
      path: 'goals_and_metrics.baseline',
      excerpt: '0',
    });
  }
  if (plan.goals_and_metrics.target === 0) {
    violations.push({
      rule: 'R13_ZERO_FOR_UNKNOWN_METRIC',
      path: 'goals_and_metrics.target',
      excerpt: '0',
    });
  }

  const rules = [...new Set(violations.map((violation) => violation.rule))];
  return {
    ok: violations.length === 0,
    violations,
    repairInstruction:
      rules.length === 0
        ? ''
        : `The previous plan broke these rules and was discarded: ${rules.join(', ')}. Fix every one of them.`,
  };
}
