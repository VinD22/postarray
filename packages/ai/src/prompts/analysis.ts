import { GROWTH_PLAN_FIXTURE_BODY } from '../growth/fixture.js';
import { JSON_OUTPUT_RULE } from './types.js';
import type { PromptModule } from './types.js';
import {
  analyticsSummaryResultSchema,
  experimentSuggestionResultSchema,
  growthPlanBodySchema,
} from './schemas.js';
import type { AnalyticsSummaryResult, ExperimentSuggestionResult } from './schemas.js';

/** Analysis and planning prompts. */

const VERSION = '2026-08-04.1';

export const analyticsSummaryPrompt: PromptModule<AnalyticsSummaryResult> = {
  id: 'analytics-summary',
  version: VERSION,
  locale: 'en',
  mode: 'fast',
  schema: analyticsSummaryResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 1200,
  timeoutMs: 25_000,
  budgetCents: 4,
  degradation: 'raw_data_only',
  requiredVariables: ['metricRows', 'baselineDescription', 'sampleSize', 'unavailableMetrics'],
  scan: { checkVoice: true },
  instruction: [
    'Describe what the supplied measurements show. Nothing more.',
    '',
    'Rules that are not negotiable:',
    '- A metric listed as unavailable is unknown. Never treat it as zero and never estimate it.',
    '- Compare only against the baseline you were given, which is the account own trailing',
    '  median. There is no global benchmark and no cross platform score.',
    '- Every observation carries the evidence ids it rests on and at least one confounder.',
    '- Differences are associations. Never write that one thing caused another.',
    '- When the sample size is below the stated threshold, set "sampleIsSmall" and say the',
    '  sample is small in the observation itself.',
    '- Image, video and text posts are different formats. Say so instead of ranking them.',
    '',
    'Put anything the data cannot support into "notSupported".',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'small-sample',
      variables: {
        metricRows: 'receipt_a impressions 1200; receipt_b impressions 900',
        baselineDescription: 'median of the previous 3 comparable posts',
        sampleSize: 3,
        unavailableMetrics: 'saves (permission)',
      },
      output: {
        observations: [
          {
            statement:
              'The most recent post reached more impressions than the median of the previous three comparable posts. The sample is small.',
            evidenceIds: ['receipt_a', 'receipt_b'],
            confidence: 'low',
            confounders: ['Only three comparable posts.', 'Posting time differed by four hours.'],
          },
        ],
        notSupported: ['Saves are unavailable for this account, so engagement depth is unknown.'],
        sampleIsSmall: true,
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};

export const experimentSuggestionPrompt: PromptModule<ExperimentSuggestionResult> = {
  id: 'experiment-suggestion',
  version: VERSION,
  locale: 'en',
  mode: 'fast',
  schema: experimentSuggestionResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 800,
  timeoutMs: 25_000,
  budgetCents: 3,
  degradation: 'raw_data_only',
  requiredVariables: ['observations', 'cadencePerWeek', 'availableMetrics'],
  scan: { checkVoice: true },
  instruction: [
    'Propose exactly one falsifiable experiment.',
    '',
    'Change one variable only. The success metric must be one of the metrics that is',
    'actually available for this account. The window must be long enough to collect the',
    'minimum sample at the stated cadence, and you must say what would make the result',
    'meaningless. Do not propose an experiment that needs a metric the account cannot read.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'hook-position',
      variables: {
        observations: 'Posts that name the change in line one reached more people.',
        cadencePerWeek: 2,
        availableMetrics: 'impressions, link_clicks',
      },
      output: {
        hypothesis: 'Naming the change in the first line increases impressions on this account.',
        variantA: 'Open with the change itself.',
        variantB: 'Open with the problem it solves.',
        successMetric: 'impressions',
        windowDays: 28,
        minimumSampleSize: 8,
        caveats: [
          'Posting time is not held constant.',
          'Eight posts is a small sample and will not settle a small difference.',
        ],
        evidenceIds: ['receipt_a'],
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};

export const growthPlanPrompt: PromptModule<unknown> = {
  id: 'growth-plan',
  version: VERSION,
  locale: 'en',
  mode: 'thinking',
  schema: growthPlanBodySchema,
  outputFormat: 'json',
  maxOutputTokens: 12_000,
  timeoutMs: 180_000,
  budgetCents: 60,
  degradation: 'partial_with_unavailable_sections',
  requiredVariables: [
    'businessProfileId',
    'businessProfileRevision',
    'confirmedFacts',
    'assumptions',
    'weeklyCapacity',
    'contentLocales',
    'catalogOpportunities',
    'catalogTools',
    'windowStart',
    'windowEnd',
  ],
  scan: { checkVoice: true },
  instruction: [
    'Produce a four week growth plan with exactly nine sections, in this order:',
    'business_snapshot, goals_and_metrics, audiences_and_channels, content_system,',
    'ugc_plan, opportunities, tool_recommendations, calendar_proposal, risks_and_unknowns.',
    '',
    'Grounding rules:',
    '- Use only the confirmed facts, the approved sources and the catalog records supplied.',
    '- Reference opportunities and tools by their catalog id only. You cannot write a URL,',
    '  a domain, an email address or a phone number anywhere in this document.',
    '- If no catalog record fits, return an empty array. An empty list is a correct answer.',
    '- An assumption may shape strategy. It may never appear as a fact, in a pitch draft or',
    '  in any sentence a customer would read as confirmed.',
    '- Unknown numbers are null. Never zero.',
    '- Cadence must not exceed the confirmed weekly capacity.',
    '- Never imply that anything is submitted, published, scheduled or sent automatically.',
    '  Never promise a ranking, reach, backlinks or a result.',
    '- calendar_proposal contains exactly four weeks numbered 1 to 4. Each slot is a brief,',
    '  not finished copy, and every slot requires approval.',
    '- ugc_plan describes a campaign the customer runs with real people. Never draft a',
    '  testimonial, never propose creator discovery or outreach, never propose synthetic',
    '  participants.',
    '- risks_and_unknowns must list every claim you wanted to make and could not support,',
    '  every missing permission and every assumption the plan leans on. It may not be empty',
    '  when information is missing.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'empty-catalog',
      variables: {
        businessProfileId: 'bprof_00000000000000000000000000',
        businessProfileRevision: 1,
        confirmedFacts: ['The product schedules and publishes social posts for small teams.'],
        assumptions: ['The buyer is the person who also writes the posts.'],
        weeklyCapacity: 2,
        contentLocales: ['en'],
        catalogOpportunities: [],
        catalogTools: [],
        windowStart: '2026-08-10',
        windowEnd: '2026-09-07',
      },
      output: GROWTH_PLAN_FIXTURE_BODY,
    },
  ],
};
