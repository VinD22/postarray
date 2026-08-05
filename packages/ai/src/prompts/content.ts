import { JSON_OUTPUT_RULE } from './types';
import type { PromptModule } from './types';
import {
  altTextResultSchema,
  ctaOptionsResultSchema,
  draftFromBriefResultSchema,
  hookOptionsResultSchema,
  platformVariantResultSchema,
  shortenResultSchema,
  toneAdjustResultSchema,
  transcreateResultSchema,
} from './schemas';
import type {
  AltTextResult,
  CtaOptionsResult,
  DraftFromBriefResult,
  HookOptionsResult,
  PlatformVariantResult,
  ShortenResult,
  ToneAdjustResult,
  TranscreateResult,
} from './schemas';

/** Composer prompts. All instruction text here is model-facing, not product copy. */

const VERSION = '2026-08-04.1';

export const draftFromBriefPrompt: PromptModule<DraftFromBriefResult> = {
  id: 'draft-from-brief',
  version: VERSION,
  locale: 'en',
  mode: 'fast',
  schema: draftFromBriefResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 1200,
  timeoutMs: 20_000,
  budgetCents: 3,
  degradation: 'return_input_unchanged',
  requiredVariables: ['brief', 'contentKind', 'locale', 'brandVoice'],
  scan: { checkVoice: true },
  instruction: [
    'Write one social post from the brief below.',
    '',
    'Use only facts present in the brief or in the fenced sources. If the brief implies a',
    'number, a date, a price or a customer outcome that is not stated, leave it out and',
    'list what is missing in "rationale". Match the brand voice exactly. Write in the',
    'requested locale. Do not add hashtags unless the brand uses them. Do not write a call',
    'to action containing a link; the tool inserts links itself.',
    '',
    'Cite the ids of the brief fields and sources you relied on in "evidenceIds".',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'plain-announcement',
      variables: {
        brief: 'We shipped scheduled publishing.',
        contentKind: 'text',
        locale: 'en',
        brandVoice: 'direct',
      },
      output: {
        title: null,
        body: 'Scheduled publishing is live. Pick a time and a time zone, and the post goes out when you said it would.',
        contentKind: 'text',
        locale: 'en',
        threadParts: [],
        suggestedHashtags: [],
        evidenceIds: ['brief'],
        rationale: 'Uses only the brief. No metrics were stated, so none are claimed.',
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};

export const platformVariantPrompt: PromptModule<PlatformVariantResult> = {
  id: 'platform-variant',
  version: VERSION,
  locale: 'en',
  mode: 'fast',
  schema: platformVariantResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 1200,
  timeoutMs: 20_000,
  budgetCents: 3,
  degradation: 'return_input_unchanged',
  requiredVariables: ['masterBody', 'provider', 'characterLimit', 'accountType'],
  scan: { checkVoice: true },
  instruction: [
    'Adapt the master text for one platform without changing what it claims.',
    '',
    'Respect the stated character limit, the account type and the platform conventions',
    'given to you. Never add a fact, a statistic, a date or a link. Never remove a legal or',
    'disclosure sentence. If the text cannot fit the limit without losing meaning, keep the',
    'meaning, set "withinLimitEstimate" to false and explain in "changes".',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'shorten-for-x',
      variables: {
        masterBody: 'Scheduled publishing is live.',
        provider: 'x',
        characterLimit: 280,
        accountType: 'business_profile',
      },
      output: {
        provider: 'x',
        body: 'Scheduled publishing is live.',
        threadParts: [],
        changes: ['No change was needed to fit the limit.'],
        withinLimitEstimate: true,
        evidenceIds: ['master'],
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};

export const transcreatePrompt: PromptModule<TranscreateResult> = {
  id: 'transcreate',
  version: VERSION,
  locale: 'en',
  mode: 'thinking',
  schema: transcreateResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 2000,
  timeoutMs: 40_000,
  budgetCents: 6,
  degradation: 'fail_visibly',
  requiredVariables: [
    'sourceBody',
    'sourceLanguage',
    'targetLanguage',
    'register',
    'protectedTerms',
  ],
  scan: { checkVoice: false },
  instruction: [
    'Transcreate the source text into the target language.',
    '',
    'This is not a literal translation. Keep the intent, the register and the brand voice,',
    'and use phrasing a native speaker of the target market would actually write. Leave',
    'every protected term exactly as written. Follow the market conventions supplied for',
    'punctuation, honorifics, hashtags and emoji.',
    '',
    'When a phrase has no clean equivalent, keep the closest honest wording, list it in',
    '"untranslatablePhrases" and set "uncertain" to true. Never quietly drop a caveat, a',
    'disclosure or a legal sentence. Never add a claim that is not in the source.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'en-to-de',
      variables: {
        sourceBody: 'Scheduled publishing is live.',
        sourceLanguage: 'en',
        targetLanguage: 'de',
        register: 'formal',
        protectedTerms: ['Relay'],
      },
      output: {
        targetLanguage: 'de',
        body: 'Geplantes Veroeffentlichen ist ab sofort verfuegbar.',
        preservedTerms: ['Relay'],
        untranslatablePhrases: [],
        registerNote: 'Formal register, Sie form, no contractions.',
        rationale: 'Direct equivalent exists. No claim was added.',
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};

export const shortenPrompt: PromptModule<ShortenResult> = {
  id: 'shorten',
  version: VERSION,
  locale: 'en',
  mode: 'fast',
  schema: shortenResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 800,
  timeoutMs: 15_000,
  budgetCents: 2,
  degradation: 'return_input_unchanged',
  requiredVariables: ['body', 'targetCharacters'],
  scan: { checkVoice: true },
  instruction: [
    'Make the text shorter without changing what it claims.',
    '',
    'Remove repetition and filler first. Keep every disclosure, caveat and legal sentence.',
    'Report what you removed in "removedIdeas" so the writer can put an idea back.',
    'Report the exact character count of your output.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'trim-filler',
      variables: {
        body: 'We are really very excited to announce that scheduled publishing is now live.',
        targetCharacters: 60,
      },
      output: {
        body: 'Scheduled publishing is live.',
        removedIdeas: ['The excitement framing.'],
        characterCount: 29,
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};

export const toneAdjustPrompt: PromptModule<ToneAdjustResult> = {
  id: 'tone-adjust',
  version: VERSION,
  locale: 'en',
  mode: 'fast',
  schema: toneAdjustResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 900,
  timeoutMs: 15_000,
  budgetCents: 2,
  degradation: 'return_input_unchanged',
  requiredVariables: ['body', 'tone'],
  scan: { checkVoice: true },
  instruction: [
    'Rewrite the text in the requested tone. Change the wording, never the substance.',
    '',
    'Do not add enthusiasm the facts do not support. Do not add superlatives, urgency or a',
    'promise of a result. Keep every disclosure sentence. List each change you made.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'to-plain',
      variables: { body: 'We are thrilled to unveil our newest capability.', tone: 'plain' },
      output: {
        tone: 'plain',
        body: 'Scheduled publishing is available now.',
        changes: ['Removed the launch language.', 'Named the capability directly.'],
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};

export const altTextPrompt: PromptModule<AltTextResult> = {
  id: 'alt-text',
  version: VERSION,
  locale: 'en',
  mode: 'fast',
  schema: altTextResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 200,
  timeoutMs: 10_000,
  budgetCents: 1,
  degradation: 'leave_empty_required',
  requiredVariables: ['imageDescription', 'language', 'context'],
  scan: { checkVoice: false },
  instruction: [
    'Write alternative text for one image, using only the description supplied.',
    '',
    'Describe what a sighted reader would get from the image in this context. Lead with the',
    'subject. Do not begin with "image of". Do not interpret mood or intent. If the image',
    'contains readable text, transcribe it and set "describesText" to true. If the',
    'description is too thin to write useful alt text, set "uncertain" to true and say why',
    'rather than inventing detail.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'chart-screenshot',
      variables: {
        imageDescription: 'Screenshot of a calendar view with four scheduled posts on Tuesday.',
        language: 'en',
        context: 'Product announcement post.',
      },
      output: {
        altText: 'A calendar week view with four scheduled posts stacked on Tuesday.',
        language: 'en',
        describesText: false,
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};

export const hookOptionsPrompt: PromptModule<HookOptionsResult> = {
  id: 'hook-options',
  version: VERSION,
  locale: 'en',
  mode: 'fast',
  schema: hookOptionsResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 600,
  timeoutMs: 15_000,
  budgetCents: 2,
  degradation: 'leave_empty_required',
  requiredVariables: ['body', 'audience', 'provider'],
  scan: { checkVoice: true },
  instruction: [
    'Offer up to five opening lines for this post.',
    '',
    'Each one must be supported by the post itself. No curiosity gaps that the post does not',
    'pay off, no invented statistics, no fake urgency. Give each option a one line angle so',
    'the writer can choose deliberately.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'three-hooks',
      variables: {
        body: 'Scheduled publishing is live.',
        audience: 'social media managers',
        provider: 'linkedin',
      },
      output: {
        options: [
          {
            hook: 'Scheduling now respects the time zone you picked.',
            angle: 'Names the concrete change.',
            evidenceIds: ['body'],
          },
          {
            hook: 'You can stop keeping a posting calendar in a spreadsheet.',
            angle: 'Speaks to the current workaround.',
            evidenceIds: ['body'],
          },
        ],
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};

export const ctaOptionsPrompt: PromptModule<CtaOptionsResult> = {
  id: 'cta-options',
  version: VERSION,
  locale: 'en',
  mode: 'fast',
  schema: ctaOptionsResultSchema,
  outputFormat: 'json',
  maxOutputTokens: 500,
  timeoutMs: 15_000,
  budgetCents: 2,
  degradation: 'leave_empty_required',
  requiredVariables: ['body', 'objective', 'availableLinkRefs'],
  scan: { checkVoice: true },
  instruction: [
    'Offer up to five calls to action for this post.',
    '',
    'Never write a URL or a domain. If a call to action needs a destination, reference one',
    'of the supplied link identifiers in "linkRef" and let the tool render the link. Match',
    'the stated objective. Do not promise an outcome.',
    JSON_OUTPUT_RULE,
  ].join('\n'),
  fixtures: [
    {
      name: 'signup-ctas',
      variables: {
        body: 'Scheduled publishing is live.',
        objective: 'sign-ups',
        availableLinkRefs: ['link_primary'],
      },
      output: {
        options: [
          {
            cta: 'Try it on one post this week.',
            intent: 'Low commitment trial.',
            linkRef: 'link_primary',
          },
          {
            cta: 'Tell us which platform you want next.',
            intent: 'Invite a reply.',
            linkRef: null,
          },
        ],
        uncertain: false,
        uncertaintyReason: null,
      },
    },
  ],
};
