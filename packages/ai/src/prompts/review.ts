import { JSON_OUTPUT_RULE } from './types';
import type { PromptModule } from './types';
import {
  accessibilityCheckResultSchema,
  claimCheckResultSchema,
  duplicateCheckResultSchema,
  platformFitCheckResultSchema,
} from './schemas';
import type {
  AccessibilityCheckResult,
  ClaimCheckResult,
  DuplicateCheckResult,
  PlatformFitCheckResult,
} from './schemas';

/**
 * Review prompts. Every one of these degrades to a visible failure rather than
 * an implied pass: "review unavailable" is honest, a silent green tick is not.
 */

const VERSION = '2026-08-04.1';

export const claimCheckPrompt: PromptModule<ClaimCheckResult> = {
  id: 'claim-check',
  version: VERSION,
  locale: 'en',
  mode: 'thinking',
  schema: claimCheckResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 1500,
  timeoutMs: 30_000,
  budgetCents: 5,
  degradation: 'fail_visibly',
  requiredVariables: ['body', 'approvedClaims', 'prohibitedClaims', 'confirmedFacts'],
  scan: { checkVoice: false },
  instruction: [
    'List every factual claim the text makes and judge each one against the supplied',
    'approved claims, confirmed facts and prohibited claims.',
    '',
    'Quote each claim exactly as written. A claim with no supporting fact is',
    '"needs_evidence", not "supported". A claim that contradicts a confirmed fact or',
    'appears in the prohibited list is "prohibited". Comparative superlatives, guarantees,',
    'performance numbers, medical, financial, legal and safety statements always need',
    'evidence. "overall" is the worst verdict in the list.',
    '',
    'A suggested rewrite must not introduce a new claim. You are reviewing, not approving:',
    'nothing you say authorizes publication.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'unsupported-metric',
      variables: {
        body: 'Teams cut their posting time in half.',
        approvedClaims: [],
        prohibitedClaims: [],
        confirmedFacts: [],
      },
      output: {
        claims: [
          {
            quote: 'Teams cut their posting time in half.',
            verdict: 'needs_evidence',
            reason: 'No confirmed measurement supports a fifty percent reduction.',
            evidenceIds: [],
            suggestedRewrite: 'Teams schedule a week of posts in one sitting.',
          },
        ],
        overall: 'needs_evidence',
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};

export const platformFitCheckPrompt: PromptModule<PlatformFitCheckResult> = {
  id: 'platform-fit-check',
  version: VERSION,
  locale: 'en',
  mode: 'fast',
  schema: platformFitCheckResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 900,
  timeoutMs: 20_000,
  budgetCents: 3,
  degradation: 'fail_visibly',
  requiredVariables: ['body', 'provider', 'capabilitySummary', 'contentKind'],
  scan: { checkVoice: false },
  instruction: [
    'Judge how well this post fits the platform, using only the capability summary given.',
    '',
    'Do not guess a limit. If the capability summary does not state a rule, do not assert',
    'one; say so and set "uncertain" to true. Deterministic limits such as character counts',
    'and media counts are already checked elsewhere, so focus on convention: format,',
    'opening line, thread shape, hashtag and mention norms, link placement and tone.',
    'Use a stable machine code for each issue.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'link-in-first-line',
      variables: {
        body: 'Read the announcement, details inside.',
        provider: 'linkedin',
        capabilitySummary: 'Text up to 3000 characters. Links render a preview card.',
        contentKind: 'text',
      },
      output: {
        provider: 'linkedin',
        issues: [
          {
            code: 'OPENING_LACKS_SUBSTANCE',
            severity: 'warning',
            explanation:
              'The first line does not say what changed, so the preview gives readers nothing.',
            suggestion: 'Name the change in the opening line.',
          },
        ],
        fitsNativeFormat: true,
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};

export const duplicateCheckPrompt: PromptModule<DuplicateCheckResult> = {
  id: 'duplicate-check',
  version: VERSION,
  locale: 'en',
  mode: 'fast',
  schema: duplicateCheckResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 600,
  timeoutMs: 20_000,
  budgetCents: 2,
  degradation: 'fail_visibly',
  requiredVariables: ['body', 'candidateSummaries'],
  scan: { checkVoice: false },
  instruction: [
    'Compare the draft against the recent posts supplied and report how similar they are.',
    '',
    'Reference candidates only by the identifiers given. "near_duplicate" means the same',
    'message with cosmetic changes. "similar" means the same topic with a different point.',
    'Reposting on purpose is legitimate, so explain the overlap rather than judging it.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'distinct',
      variables: {
        body: 'Scheduled publishing is live.',
        candidateSummaries: ['content_a: media library update'],
      },
      output: {
        similarContentIds: [],
        similarityScore: 0.1,
        verdict: 'distinct',
        reason: 'The candidate covers the media library, not scheduling.',
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};

export const accessibilityCheckPrompt: PromptModule<AccessibilityCheckResult> = {
  id: 'accessibility-check',
  version: VERSION,
  locale: 'en',
  mode: 'fast',
  schema: accessibilityCheckResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 800,
  timeoutMs: 20_000,
  budgetCents: 2,
  degradation: 'fail_visibly',
  requiredVariables: ['body', 'hasMedia', 'altTextPresent', 'locale'],
  scan: { checkVoice: false },
  instruction: [
    'Review this post for accessibility problems that a screen reader user or a reader with',
    'low vision, dyslexia or limited literacy would hit.',
    '',
    'Check for missing alt text, decorative unicode used as letters, emoji used as bullets',
    'or as words, all caps runs, hashtag casing that breaks screen reader pronunciation,',
    'unlabelled links, sentence length and jargon density. Report a stable machine code and',
    'a concrete fix for each finding. Do not comment on colour or layout; you cannot see them.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'hashtag-casing',
      variables: {
        body: 'Now live #scheduledpublishing',
        hasMedia: false,
        altTextPresent: false,
        locale: 'en',
      },
      output: {
        findings: [
          {
            code: 'HASHTAG_NOT_CAMEL_CASE',
            severity: 'warning',
            explanation: 'A lower case multi word hashtag is read as one run of letters.',
            suggestion: 'Write it as ScheduledPublishing.',
          },
        ],
        readingLevelEstimate: 'simple',
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};
