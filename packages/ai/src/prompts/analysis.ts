import { z } from 'zod';

import { weeklyDigestResultSchema } from '../digest/schema';
import type { WeeklyDigestResult } from '../digest/schema';
import { GROWTH_PLAN_FIXTURE_BODY } from '../growth/fixture';
import { JSON_OUTPUT_RULE } from './types';
import type { PromptModule } from './types';
import {
  analyticsSummaryResultSchema,
  experimentSuggestionResultSchema,
  growthPlanBodySchema,
} from './schemas';
import type { AnalyticsSummaryResult, ExperimentSuggestionResult } from './schemas';

/** Analysis and planning prompts. */

const VERSION = '2026-08-04.1';

/**
 * The weekly digest is a new prompt, so it starts at its own version. Prompt
 * versions are append-only: never edit a version that has produced a stored
 * insight, mint the next one.
 */
const DIGEST_VERSION = '2026-08-12.1';

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

/**
 * The weekly digest: "what has been happening".
 *
 * Retrieval is deterministic and happens in `../digest/retrieval`. This prompt
 * only turns already-assembled first-party rows into prose, and the number
 * audit in `../digest/postprocess` rejects any numeral that was not in those
 * rows. The model is structurally incapable of producing a metric.
 */
export const weeklyDigestPrompt: PromptModule<WeeklyDigestResult> = {
  id: 'weekly-digest',
  version: DIGEST_VERSION,
  locale: 'en',
  mode: 'fast',
  schema: weeklyDigestResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 1600,
  timeoutMs: 30_000,
  budgetCents: 5,
  degradation: 'raw_data_only',
  requiredVariables: [
    'receiptSummary',
    'metricRows',
    'baselineOutcomes',
    'freshnessReport',
    'unavailableMetrics',
    'windowStart',
    'windowEnd',
  ],
  scan: { checkVoice: true },
  instruction: [
    'Summarise what happened in this workspace between windowStart and windowEnd,',
    'using only the supplied rows. You are writing sentences about data somebody else',
    'already gathered. You are not measuring anything.',
    '',
    'Rules that are not negotiable:',
    '- A metric listed in unavailableMetrics is unknown. Never treat it as zero, never',
    '  estimate it, and never describe it as "no engagement" or "nothing happened".',
    '- Only numbers that already appear in the supplied rows may appear in your answer.',
    '  Do not add, subtract, average, or convert. If a number you want is not in the',
    '  rows, write the sentence without it.',
    '- published, partial and failed are three different outcomes. A partial publication',
    '  reached some destinations and not others. Never fold it into either neighbour.',
    '- Every observation cites the receipt ids or metric names it rests on, and carries',
    '  at least one confounder.',
    '- State the freshness of the data you were given, in your own words, from',
    '  freshnessReport. A summary that hides how old its data is has misled the reader.',
    '- Differences are associations. Never write that one thing caused another.',
    '- When any baseline row says smallSample=true, set "sampleIsSmall" and say the',
    '  sample is small in the observation itself.',
    '- "There is not enough data yet" is a complete and acceptable answer. An empty',
    '  observations array with an honest headline is better than a padded one.',
    '',
    'Put anything the data cannot support into "notSupported". Set "suggestedNextAction"',
    'to null unless the rows support one concrete next step.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      /**
       * Week one for a new customer: posts went out, no analytics exist at all.
       * This is the common first-run state, so it is a first-class fixture.
       */
      name: 'receipts-only-no-metrics',
      variables: {
        receiptSummary: ['provider=mastodon published=2 partial=1 failed=0 receipts=r1|r2|r3'],
        metricRows: [],
        baselineOutcomes: [],
        freshnessReport: 'label=never_synced lastObservedAt=never ageSeconds=unknown',
        unavailableMetrics: [],
        windowStart: '2026-08-03',
        windowEnd: '2026-08-10',
      },
      output: {
        headline: 'Three publications went out and no measurements have arrived yet.',
        observations: [
          {
            statement:
              'One publication reached some destinations and not others, and is recorded as partial rather than as a success or a failure.',
            evidenceIds: ['r1', 'r2', 'r3'],
            confidence: 'high',
            confounders: ['A partial publication may still be retried.'],
          },
        ],
        notSupported: [
          'No metrics have been synced for this window, so reach and engagement are unknown.',
        ],
        suggestedNextAction: null,
        sampleIsSmall: true,
        uncertain: false,
        uncertaintyReason: null,
      },
    },
    {
      /**
       * The other real first-week state: posts published, and the connection was
       * never granted the permission the metric needs. Unknown, not zero.
       */
      name: 'metrics-unavailable-by-permission',
      variables: {
        receiptSummary: ['provider=mastodon published=2 partial=0 failed=0 receipts=r1|r2'],
        metricRows: [],
        baselineOutcomes: [],
        freshnessReport: 'label=fresh lastObservedAt=2026-08-10T09:00:00Z ageSeconds=600',
        unavailableMetrics: [
          'metric=impressions provider=mastodon reason=unavailable_permission receipts=r1|r2',
        ],
        windowStart: '2026-08-03',
        windowEnd: '2026-08-10',
      },
      output: {
        headline: 'Two publications went out. Impressions cannot be read for this account.',
        observations: [
          {
            statement:
              'Both publications completed. Impressions are unknown for them because the connection was not granted the permission that metric requires.',
            evidenceIds: ['r1', 'r2'],
            confidence: 'high',
            confounders: ['Unknown is not the same as low.'],
          },
        ],
        notSupported: [
          'Impressions are unavailable for this connection, so reach cannot be described.',
        ],
        suggestedNextAction:
          'Reconnect the account and grant the analytics permission if you want impressions in next week digest.',
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

/**
 * Per-post feedback: "how did this one do, compared with your own posts".
 *
 * Its own version, because it is a new prompt and versions are append-only.
 * Never edit a version that has produced a stored insight; mint the next one.
 */
const POST_FEEDBACK_VERSION = '2026-08-13.1';

export const POST_FEEDBACK_VERDICTS = ['above', 'below', 'similar', 'insufficient_data'] as const;

export const postFeedbackResultSchema = z
  .object({
    verdict: z.enum(POST_FEEDBACK_VERDICTS),
    statement: z.string().min(1),
    evidenceIds: z.array(z.string().min(1)),
    confounders: z.array(z.string().min(1)),
    /** At most one, changing exactly one variable. Null is the common answer. */
    suggestion: z
      .object({
        statement: z.string().min(1),
        changedVariable: z.string().min(1),
        successMetric: z.string().min(1),
      })
      .strict()
      .nullable(),
    uncertain: z.boolean(),
    uncertaintyReason: z.string().min(1).nullable(),
  })
  .strict();
export type PostFeedbackResult = z.infer<typeof postFeedbackResultSchema>;

/**
 * One post, one baseline, one sentence.
 *
 * The retrieval is deterministic and happens before this prompt runs: the
 * baseline handed in is the account's own trailing median over comparable
 * posts, and the metric rows are the readings that were actually taken. The
 * model compares the two and writes it down. It measures nothing, and
 * "insufficient_data" is a complete answer rather than a failure.
 */
export const postFeedbackPrompt: PromptModule<PostFeedbackResult> = {
  id: 'post-feedback',
  version: POST_FEEDBACK_VERSION,
  locale: 'en',
  mode: 'fast',
  schema: postFeedbackResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 500,
  timeoutMs: 20_000,
  budgetCents: 2,
  degradation: 'raw_data_only',
  requiredVariables: [
    'metricRows',
    'baselineDescription',
    'baselineRows',
    'sampleSize',
    'smallSampleThreshold',
    'availableMetrics',
    'unavailableMetrics',
  ],
  scan: { checkVoice: true },
  instruction: [
    'Say how this one post did against the baseline you were given. One post, one',
    'comparison, at most one suggestion.',
    '',
    'Rules that are not negotiable:',
    '- Compare only against the supplied baseline, which is this account own trailing',
    '  median over comparable posts. There is no global benchmark, no industry average',
    '  and no cross platform score. If you were given no baseline rows, the verdict is',
    '  "insufficient_data".',
    '- A metric listed in unavailableMetrics is unknown. Never treat it as zero, never',
    '  estimate it, and never describe it as "no engagement".',
    '- Only numbers that already appear in metricRows or baselineRows may appear in your',
    '  answer. Do not add, average or convert.',
    '- Differences are associations. Never write that the post caused the difference, and',
    '  never write that a change would cause one.',
    '- When sampleSize is below smallSampleThreshold, set "uncertain", say the sample is',
    '  small in the statement itself, and prefer "insufficient_data" over a verdict the',
    '  sample cannot carry.',
    '- Every statement carries the evidence ids it rests on and at least one confounder.',
    '- "insufficient_data" is a complete, valid answer. An honest one-line answer with no',
    '  suggestion is better than a padded one.',
    '',
    'The suggestion is optional and there is never more than one. It must change exactly',
    'one variable, and its successMetric must be one of availableMetrics: do not propose',
    'something this account cannot measure. Set "suggestion" to null whenever the rows do',
    'not support a single concrete change.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      /** The first post on a new account: nothing to compare it with yet. */
      name: 'no-baseline-yet',
      variables: {
        metricRows: ['receipt=r1 metric=impressions value=310'],
        baselineDescription: 'median of the previous 5 comparable posts',
        baselineRows: [],
        sampleSize: 0,
        smallSampleThreshold: 5,
        availableMetrics: ['impressions', 'likes'],
        unavailableMetrics: [],
      },
      output: {
        verdict: 'insufficient_data',
        statement:
          'This is the first comparable post on this account, so there is nothing to compare it with yet.',
        evidenceIds: ['r1'],
        confounders: ['A single post cannot establish a baseline.'],
        suggestion: null,
        uncertain: true,
        uncertaintyReason: 'No baseline posts exist for this account yet.',
      },
    },
    {
      /** A real comparison on a small sample, with one metric unreadable. */
      name: 'above-baseline-small-sample',
      variables: {
        metricRows: ['receipt=r9 metric=impressions value=1200'],
        baselineDescription: 'median of the previous 4 comparable posts',
        baselineRows: ['metric=impressions median=800 posts=4'],
        sampleSize: 4,
        smallSampleThreshold: 5,
        availableMetrics: ['impressions'],
        unavailableMetrics: ['metric=saves reason=unavailable_permission'],
      },
      output: {
        verdict: 'above',
        statement:
          'This post reached more impressions than the median of the previous four comparable posts. Four posts is a small sample.',
        evidenceIds: ['r9'],
        confounders: [
          'Posting time was three hours earlier than the comparable posts.',
          'Saves cannot be read for this account, so engagement depth is unknown.',
        ],
        suggestion: {
          statement: 'Post the next one at the same hour and leave everything else as it was.',
          changedVariable: 'posting hour',
          successMetric: 'impressions',
        },
        uncertain: true,
        uncertaintyReason: 'The baseline rests on four posts.',
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
