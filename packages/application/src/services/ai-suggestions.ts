import { randomUUID } from 'node:crypto';

import type { ActorContext, ServiceDeps, UntrustedSourceInput } from '../types';
import { assertMonthlyAiBudget, recordAiUsage } from '../internal/ai-spend';
import { recordAudit } from '../internal/audit';
import { loadCapabilities } from '../internal/capabilities';
import { notFound } from '../internal/errors';
import { authorized, type Db } from '../internal/runtime';
import { BEST_TIME_REASON_KEYS, readBestTime } from './ai-suggestions-best-time-read';
import { OUTPUT_SCHEMAS, buildSuggestionCall, mapSuggestionOutput } from './ai-suggestions-prompts';
import type { PromptTarget } from './ai-suggestions-prompts';
import {
  REVIEW_PROMPTS,
  accessibilityOutputSchema,
  claimOutputSchema,
  duplicateOutputSchema,
  mapAccessibilityCheck,
  mapClaimCheck,
  mapDuplicateCheck,
  unavailableCheck,
  worstStatus,
} from './ai-suggestions-review';
import {
  acceptSuggestionRequestSchema,
  reviewRequestSchema,
  suggestionRequestSchema,
} from './ai-suggestions-types';
import type {
  AcceptedSuggestionView,
  AiSuggestionService,
  BestTimeView,
  MediaUnderstandingReader,
  ReviewCheckView,
  ReviewView,
  SuggestionKind,
  SuggestionProposal,
  SuggestionProvenance,
  SuggestionView,
} from './ai-suggestions-types';

/**
 * The composer's Suggest menu, its Review button and the account-specific
 * posting time hint.
 *
 * One service, handed to the REST API, the MCP server and the CLI (through the
 * API), so a suggestion made from a terminal passes the same budget ceiling,
 * the same authorization and the same untrusted-data fence as one made in the
 * editor.
 *
 * Nothing here writes a draft. A suggestion is held for a day under an opaque
 * id; accepting it records which model and which prompt version produced the
 * text, in an audit event, and hands the text back. The composer then puts the
 * text in the draft through the ordinary save path and sets `aiAssisted` on the
 * disclosure, so the provenance the server stored and the flag the draft
 * carries come from the same accepted proposal.
 */

const SUGGESTION_TTL_SECONDS = 24 * 60 * 60;
const DUPLICATE_CANDIDATES = 12;

export const SUGGEST_REASON_KEYS = {
  disabled: 'web.suggest.unavailable.disabled',
  failed: 'web.suggest.unavailable.failed',
  reviewFailed: 'web.suggest.review.unavailable',
  bestTimeSmallSample: BEST_TIME_REASON_KEYS.smallSample,
  bestTimeNoDifference: BEST_TIME_REASON_KEYS.noDifference,
  bestTimeNoMetric: BEST_TIME_REASON_KEYS.noMetric,
} as const;

interface StoredSuggestion {
  readonly workspaceId: string;
  readonly kind: SuggestionKind;
  readonly provenance: SuggestionProvenance;
  readonly proposals: readonly SuggestionProposal[];
}

function storeKey(workspaceId: string, suggestionId: string): string {
  return `ai-suggestion:${workspaceId}:${suggestionId}`;
}

function provenanceOf(meta: {
  promptId: string;
  promptVersion: string;
  provider: string;
  model: string;
  degraded: boolean;
}): SuggestionProvenance {
  return {
    label: 'suggestion',
    promptId: meta.promptId,
    promptVersion: meta.promptVersion,
    provider: meta.provider,
    model: meta.model,
    degraded: meta.degraded,
  };
}

function callContext(ctx: ActorContext, projectId: string | null) {
  return {
    workspaceId: ctx.workspaceId,
    projectId,
    locale: ctx.locale,
    contentLanguage: null,
    correlationId: ctx.correlationId,
  };
}

export interface AiSuggestionServiceOptions {
  /**
   * Stored analyses of attached images (plan 3.2). They reach the prompts as
   * fenced untrusted sources, and only for media that scanned clean in this
   * workspace. Omitted, suggestions read text only.
   */
  readonly mediaUnderstanding?: MediaUnderstandingReader;
}

export function createAiSuggestionService(
  deps: ServiceDeps,
  options: AiSuggestionServiceOptions = {},
): AiSuggestionService {
  /** Only media that finished scanning clean, in this workspace, is ever read. */
  async function mediaSources(
    ctx: ActorContext,
    db: Db,
    mediaIds: readonly string[] | undefined,
    now: string,
  ): Promise<readonly UntrustedSourceInput[]> {
    const reader = options.mediaUnderstanding;
    if (reader === undefined || mediaIds === undefined || mediaIds.length === 0) {
      return [];
    }
    const clean = await db.mediaAsset.findMany({
      where: { workspaceId: ctx.workspaceId, id: { in: [...mediaIds] }, scanState: 'clean' },
      select: { id: true },
    });
    const ids = clean.map((row) => row.id);
    if (ids.length === 0) {
      return [];
    }
    const summaries = await reader.summariesFor(ctx, ids);
    return summaries.map((entry) => ({
      id: `media:${entry.mediaId}`,
      origin: 'uploaded_file' as const,
      label: 'Attached image analysis',
      text: entry.summary,
      retrievedAt: now,
    }));
  }

  async function targetFor(db: Db, connectionId: string | undefined): Promise<PromptTarget | null> {
    if (connectionId === undefined) {
      return null;
    }
    const loaded = await loadCapabilities(db, deps, connectionId);
    if (loaded === null) {
      throw notFound('connection', connectionId);
    }
    return {
      provider: loaded.provider,
      accountType: loaded.snapshot?.accountType ?? 'unknown',
      characterLimit: loaded.snapshot?.text.maxLength ?? 280,
    };
  }

  return {
    async suggest(ctx, rawInput): Promise<SuggestionView> {
      const input = suggestionRequestSchema.parse(rawInput);
      if (!deps.ai.isAvailable()) {
        return { status: 'unavailable', kind: input.kind, reasonKey: SUGGEST_REASON_KEYS.disabled };
      }
      const now = deps.clock.now().toISOString();

      const prepared = await authorized(deps, ctx, 'content.read', undefined, async (db) => {
        await assertMonthlyAiBudget(deps, ctx, db);
        const target = await targetFor(db, input.connectionId);
        const extraSources = await mediaSources(ctx, db, input.mediaIds, now);
        return { target, extraSources };
      });

      const call = buildSuggestionCall(input, {
        now,
        locale: ctx.locale,
        target: prepared.target,
        extraSources: prepared.extraSources,
      });
      const schema: { parse(value: unknown): unknown } = OUTPUT_SCHEMAS[input.kind];
      const result = await deps.ai.completeStructured(schema, {
        context: callContext(ctx, null),
        promptId: call.promptId,
        variables: call.variables,
        untrustedSources: call.untrustedSources,
      });
      await recordAiUsage(deps, ctx, result.meta);

      if (result.meta.degraded) {
        return { status: 'unavailable', kind: input.kind, reasonKey: SUGGEST_REASON_KEYS.failed };
      }

      const mapped = mapSuggestionOutput(input.kind, result.output, input);
      const provenance = provenanceOf(result.meta);
      const suggestionId = `sugg_${randomUUID().replaceAll('-', '')}`;
      const stored: StoredSuggestion = {
        workspaceId: ctx.workspaceId,
        kind: input.kind,
        provenance,
        proposals: mapped.proposals,
      };
      await deps.kv.set(storeKey(ctx.workspaceId, suggestionId), JSON.stringify(stored), {
        ttlSeconds: SUGGESTION_TTL_SECONDS,
      });

      return {
        status: 'ready',
        suggestionId,
        kind: input.kind,
        proposals: mapped.proposals,
        warnings: mapped.warnings,
        uncertain: mapped.uncertain,
        uncertaintyReason: mapped.uncertaintyReason,
        provenance,
        sourceIds: call.untrustedSources.map((entry) => entry.id),
      };
    },

    async review(ctx, rawInput): Promise<ReviewView> {
      const input = reviewRequestSchema.parse(rawInput);
      if (!deps.ai.isAvailable()) {
        const checks = (['claims', 'accessibility', 'duplicates'] as const).map((check) =>
          unavailableCheck(check, SUGGEST_REASON_KEYS.disabled),
        );
        return { checks, overall: 'unavailable' };
      }
      const now = deps.clock.now().toISOString();

      const grounding = await authorized(deps, ctx, 'content.read', undefined, async (db) => {
        await assertMonthlyAiBudget(deps, ctx, db);
        let projectId = input.projectId ?? null;
        if (input.contentItemId !== undefined) {
          const item = await db.contentItem.findFirst({
            where: { id: input.contentItemId, workspaceId: ctx.workspaceId },
            select: { projectId: true },
          });
          if (item === null) {
            throw notFound('content_item', input.contentItemId);
          }
          projectId = item.projectId;
        }
        const profile =
          projectId === null
            ? null
            : await db.businessProfile.findFirst({
                where: { workspaceId: ctx.workspaceId, projectId, confirmedAt: { not: null } },
                orderBy: { version: 'desc' },
                select: { provenClaims: true, prohibitedClaims: true },
              });
        const candidates = await db.contentItem.findMany({
          where: {
            workspaceId: ctx.workspaceId,
            ...(projectId === null ? {} : { projectId }),
            ...(input.contentItemId === undefined ? {} : { id: { not: input.contentItemId } }),
            currentVersionId: { not: null },
          },
          orderBy: { updatedAt: 'desc' },
          take: DUPLICATE_CANDIDATES,
          select: { id: true, currentVersion: { select: { body: true } } },
        });
        return { projectId, profile, candidates };
      });

      const confirmedFacts = Array.isArray(grounding.profile?.provenClaims)
        ? grounding.profile.provenClaims
            .map((entry) => (typeof entry === 'string' ? entry : JSON.stringify(entry)))
            .slice(0, 40)
        : [];
      const draft: UntrustedSourceInput = {
        id: 'draft_body',
        origin: 'user_note',
        label: 'Draft body',
        text: input.body,
        retrievedAt: now,
      };
      const candidateSources: UntrustedSourceInput[] = grounding.candidates.flatMap((row) =>
        row.currentVersion === null
          ? []
          : [
              {
                id: row.id,
                origin: 'social_text' as const,
                label: 'Earlier post',
                text: row.currentVersion.body,
                retrievedAt: now,
              },
            ],
      );
      const candidateIds = candidateSources.map((entry) => entry.id);
      const context = callContext(ctx, grounding.projectId);

      const runCheck = async <T>(
        check: 'claims' | 'accessibility' | 'duplicates',
        schema: { parse(value: unknown): T },
        variables: Record<string, string | number | boolean | null | readonly string[]>,
        sources: readonly UntrustedSourceInput[],
        map: (output: T, provenance: SuggestionProvenance) => ReviewCheckView,
      ): Promise<ReviewCheckView> => {
        try {
          const result = await deps.ai.completeStructured(schema, {
            context,
            promptId: REVIEW_PROMPTS[check],
            variables,
            untrustedSources: sources,
          });
          await recordAiUsage(deps, ctx, result.meta);
          if (result.meta.degraded) {
            return unavailableCheck(check, SUGGEST_REASON_KEYS.reviewFailed);
          }
          return map(result.output, provenanceOf(result.meta));
        } catch (error) {
          deps.logger.warn({ check, error: String(error) }, 'ai.review.check_failed');
          return unavailableCheck(check, SUGGEST_REASON_KEYS.reviewFailed);
        }
      };

      const checks = await Promise.all([
        runCheck(
          'claims',
          claimOutputSchema,
          {
            body: 'draft_body',
            approvedClaims: [],
            prohibitedClaims: grounding.profile?.prohibitedClaims ?? [],
            confirmedFacts,
          },
          [draft],
          (output, provenance) => mapClaimCheck(output, provenance),
        ),
        runCheck(
          'accessibility',
          accessibilityOutputSchema,
          {
            body: 'draft_body',
            hasMedia: (input.mediaIds?.length ?? 0) > 0,
            altTextPresent: input.altTextPresent ?? false,
            locale: ctx.locale,
          },
          [draft],
          (output, provenance) => mapAccessibilityCheck(output, provenance),
        ),
        candidateIds.length === 0
          ? Promise.resolve<ReviewCheckView>({
              check: 'duplicates',
              status: 'passed',
              findings: [],
              reasonKey: null,
              provenance: null,
            })
          : runCheck(
              'duplicates',
              duplicateOutputSchema,
              {
                body: 'draft_body',
                candidateSummaries: candidateIds.map((entry) => `${entry}: see source ${entry}`),
              },
              [draft, ...candidateSources],
              (output, provenance) => mapDuplicateCheck(output, provenance, candidateIds),
            ),
      ]);

      return { checks, overall: worstStatus(checks.map((entry) => entry.status)) };
    },

    async accept(ctx, rawInput): Promise<AcceptedSuggestionView> {
      const input = acceptSuggestionRequestSchema.parse(rawInput);
      const raw = await deps.kv.get(storeKey(ctx.workspaceId, input.suggestionId));
      const stored = raw === null ? null : (JSON.parse(raw) as StoredSuggestion);
      const chosen = stored?.proposals[input.proposalIndex];
      if (stored === null || stored.workspaceId !== ctx.workspaceId || chosen === undefined) {
        throw notFound('suggestion', input.suggestionId, ctx.correlationId);
      }

      await authorized(deps, ctx, 'content.write', undefined, async (db, actor) => {
        if (input.contentItemId !== undefined) {
          const item = await db.contentItem.findFirst({
            where: { id: input.contentItemId, workspaceId: ctx.workspaceId },
            select: { id: true },
          });
          if (item === null) {
            throw notFound('content_item', input.contentItemId);
          }
        }
        await recordAudit(db, actor, {
          action: 'ai.suggestion.accepted',
          targetType: input.contentItemId === undefined ? 'ai_suggestion' : 'content_item',
          targetId: input.contentItemId ?? input.suggestionId,
          after: chosen.body,
          metadata: {
            suggestionId: input.suggestionId,
            kind: stored.kind,
            promptId: stored.provenance.promptId,
            promptVersion: stored.provenance.promptVersion,
            provider: stored.provenance.provider,
            model: stored.provenance.model,
            ...(input.connectionId === undefined ? {} : { connectionId: input.connectionId }),
          },
        });
      });

      return {
        suggestionId: input.suggestionId,
        aiAssisted: true,
        provenance: stored.provenance,
        body: chosen.body,
        threadParts: chosen.threadParts,
      };
    },

    bestTime(ctx, rawInput): Promise<BestTimeView> {
      return readBestTime(deps, ctx, rawInput);
    },
  };
}
