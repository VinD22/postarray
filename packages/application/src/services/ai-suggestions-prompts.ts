import { z } from 'zod';

import type { AiCallRequest, UntrustedSourceInput } from '../types';
import type { SuggestionKind, SuggestionProposal, SuggestionRequest } from './ai-suggestions-types';

/**
 * Which prompt each Suggest menu entry runs, and how its answer becomes a list
 * of proposals.
 *
 * Pure: no database, no gateway. The draft text and the brief are always
 * passed as fenced untrusted sources and referenced from the variables by id,
 * so nothing a person typed can become instruction text.
 *
 * The output schemas below restate the fields this file reads from the prompt
 * contracts in `@relay/ai`. The application package does not depend on
 * `@relay/ai`; the gateway validates the full contract there, and this parse
 * is the second, narrower gate on our side of the port.
 */

export const PROMPT_BY_KIND: Readonly<Record<SuggestionKind, string>> = {
  draft_from_brief: 'draft-from-brief',
  hooks: 'hook-options',
  ctas: 'cta-options',
  shorten: 'shorten',
  tone: 'tone-adjust',
  platform_variant: 'platform-variant',
  transcreate: 'transcreate',
};

const uncertainty = {
  uncertain: z.boolean(),
  uncertaintyReason: z.string().nullable(),
};

const bodyOnly = z.object({ body: z.string().min(1), ...uncertainty }).passthrough();

export const OUTPUT_SCHEMAS = {
  draft_from_brief: z
    .object({
      body: z.string().min(1),
      threadParts: z.array(z.string()),
      rationale: z.string(),
      ...uncertainty,
    })
    .passthrough(),
  hooks: z
    .object({
      options: z.array(z.object({ hook: z.string().min(1), angle: z.string() }).passthrough()),
      ...uncertainty,
    })
    .passthrough(),
  ctas: z
    .object({
      options: z.array(
        z
          .object({ cta: z.string().min(1), intent: z.string(), linkRef: z.string().nullable() })
          .passthrough(),
      ),
      ...uncertainty,
    })
    .passthrough(),
  shorten: bodyOnly.extend({ removedIdeas: z.array(z.string()) }),
  tone: bodyOnly.extend({ changes: z.array(z.string()) }),
  platform_variant: bodyOnly.extend({
    threadParts: z.array(z.string()),
    changes: z.array(z.string()),
    withinLimitEstimate: z.boolean(),
  }),
  transcreate: bodyOnly.extend({
    untranslatablePhrases: z.array(
      z.object({ phrase: z.string(), note: z.string() }).passthrough(),
    ),
    registerNote: z.string(),
  }),
} as const;

export type SuggestionOutput<K extends SuggestionKind> = z.infer<(typeof OUTPUT_SCHEMAS)[K]>;

export const DRAFT_SOURCE_ID = 'draft_body';
export const BRIEF_SOURCE_ID = 'brief';

export interface PromptTarget {
  readonly provider: string;
  readonly accountType: string;
  readonly characterLimit: number;
}

export interface BuiltCall {
  readonly promptId: string;
  readonly variables: AiCallRequest['variables'];
  readonly untrustedSources: readonly UntrustedSourceInput[];
}

function source(
  sourceId: string,
  label: string,
  body: string,
  retrievedAt: string,
): UntrustedSourceInput {
  return { id: sourceId, origin: 'user_note', label, text: body, retrievedAt };
}

/** Build the one gateway call a Suggest entry makes. */
export function buildSuggestionCall(
  input: SuggestionRequest,
  context: {
    readonly now: string;
    readonly locale: string;
    readonly target: PromptTarget | null;
    readonly extraSources: readonly UntrustedSourceInput[];
  },
): BuiltCall {
  const body = input.body ?? '';
  const draft = source(DRAFT_SOURCE_ID, 'Draft body', body, context.now);
  const withDraft = [draft, ...context.extraSources];

  switch (input.kind) {
    case 'draft_from_brief':
      return {
        promptId: PROMPT_BY_KIND.draft_from_brief,
        variables: {
          brief: BRIEF_SOURCE_ID,
          contentKind: 'text',
          locale: input.targetLanguage ?? context.locale,
          projectVoice: 'direct, calm, specific',
        },
        untrustedSources: [
          source(BRIEF_SOURCE_ID, 'Brief', input.brief ?? '', context.now),
          ...(body.trim().length > 0 ? [draft] : []),
          ...context.extraSources,
        ],
      };
    case 'hooks':
      return {
        promptId: PROMPT_BY_KIND.hooks,
        variables: {
          body: DRAFT_SOURCE_ID,
          audience: input.audience ?? 'the project audience',
          provider: context.target?.provider ?? 'linkedin',
        },
        untrustedSources: withDraft,
      };
    case 'ctas':
      return {
        promptId: PROMPT_BY_KIND.ctas,
        variables: {
          body: DRAFT_SOURCE_ID,
          objective: input.objective ?? 'replies',
          availableLinkRefs: input.linkRefs ?? [],
        },
        untrustedSources: withDraft,
      };
    case 'shorten':
      return {
        promptId: PROMPT_BY_KIND.shorten,
        variables: {
          body: DRAFT_SOURCE_ID,
          targetCharacters:
            input.targetCharacters ??
            context.target?.characterLimit ??
            Math.max(10, Math.floor(body.length * 0.7)),
        },
        untrustedSources: withDraft,
      };
    case 'tone':
      return {
        promptId: PROMPT_BY_KIND.tone,
        variables: { body: DRAFT_SOURCE_ID, tone: input.tone ?? 'plain' },
        untrustedSources: withDraft,
      };
    case 'platform_variant':
      return {
        promptId: PROMPT_BY_KIND.platform_variant,
        variables: {
          masterBody: DRAFT_SOURCE_ID,
          provider: context.target?.provider ?? 'x',
          characterLimit: context.target?.characterLimit ?? 280,
          accountType: context.target?.accountType ?? 'unknown',
        },
        untrustedSources: withDraft,
      };
    case 'transcreate':
      return {
        promptId: PROMPT_BY_KIND.transcreate,
        variables: {
          sourceBody: DRAFT_SOURCE_ID,
          sourceLanguage: input.sourceLanguage ?? context.locale,
          targetLanguage: input.targetLanguage ?? context.locale,
          register: 'neutral',
          protectedTerms: input.protectedTerms ?? [],
        },
        untrustedSources: withDraft,
      };
  }
}

export interface MappedSuggestion {
  readonly proposals: readonly SuggestionProposal[];
  readonly warnings: readonly string[];
  readonly uncertain: boolean;
  readonly uncertaintyReason: string | null;
}

function proposal(body: string, note: string | null, threadParts: readonly string[] = []) {
  return { body, note, threadParts, linkRef: null } satisfies SuggestionProposal;
}

/**
 * Turn a validated model answer into proposals.
 *
 * `linkRef` is kept only when it names a link the request supplied: a model
 * cannot introduce a destination the draft does not already own.
 */
export function mapSuggestionOutput(
  kind: SuggestionKind,
  output: unknown,
  request: SuggestionRequest,
): MappedSuggestion {
  const base = (value: { uncertain: boolean; uncertaintyReason: string | null }) => ({
    uncertain: value.uncertain,
    uncertaintyReason: value.uncertaintyReason,
  });

  switch (kind) {
    case 'draft_from_brief': {
      const value = OUTPUT_SCHEMAS.draft_from_brief.parse(output);
      return {
        proposals: [proposal(value.body, value.rationale, value.threadParts)],
        warnings: [],
        ...base(value),
      };
    }
    case 'hooks': {
      const value = OUTPUT_SCHEMAS.hooks.parse(output);
      return {
        proposals: value.options.slice(0, 5).map((option) => proposal(option.hook, option.angle)),
        warnings: [],
        ...base(value),
      };
    }
    case 'ctas': {
      const value = OUTPUT_SCHEMAS.ctas.parse(output);
      const allowed = new Set(request.linkRefs ?? []);
      return {
        proposals: value.options.slice(0, 5).map((option) => ({
          body: option.cta,
          note: option.intent,
          threadParts: [],
          linkRef: option.linkRef !== null && allowed.has(option.linkRef) ? option.linkRef : null,
        })),
        warnings: [],
        ...base(value),
      };
    }
    case 'shorten': {
      const value = OUTPUT_SCHEMAS.shorten.parse(output);
      return {
        proposals: [proposal(value.body, null)],
        warnings: value.removedIdeas,
        ...base(value),
      };
    }
    case 'tone': {
      const value = OUTPUT_SCHEMAS.tone.parse(output);
      return { proposals: [proposal(value.body, null)], warnings: value.changes, ...base(value) };
    }
    case 'platform_variant': {
      const value = OUTPUT_SCHEMAS.platform_variant.parse(output);
      return {
        proposals: [proposal(value.body, null, value.threadParts)],
        warnings: value.changes,
        ...base(value),
      };
    }
    case 'transcreate': {
      const value = OUTPUT_SCHEMAS.transcreate.parse(output);
      return {
        proposals: [proposal(value.body, value.registerNote)],
        warnings: value.untranslatablePhrases.map((entry) => `${entry.phrase}: ${entry.note}`),
        ...base(value),
      };
    }
  }
}
