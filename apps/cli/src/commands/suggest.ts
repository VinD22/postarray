import { RelayError } from '@relay/contracts';
import { z } from 'zod';

import { ROUTES } from '../api/routes';
import type { CliContext } from '../context';
import { renderSuccess, renderTable } from '../output';
import type { RenderInput } from '../output';

/**
 * `relay suggest`.
 *
 * The editor's Suggest menu, Review button and posting time hint, from a
 * terminal. Every call reaches `services.aiSuggestions` through the API, so the
 * budget, authorization and untrusted-data rules are the web app's. Nothing
 * here writes a draft: `suggest accept` records which model and prompt version
 * produced the text you kept, and prints the text for you to put in the draft.
 */

const SUGGESTION_KINDS = [
  'draft_from_brief',
  'hooks',
  'ctas',
  'shorten',
  'tone',
  'platform_variant',
  'transcreate',
] as const;

const provenanceSchema = z
  .object({ promptId: z.string(), promptVersion: z.string(), model: z.string() })
  .passthrough();

const suggestionSchema = z.discriminatedUnion('status', [
  z
    .object({
      status: z.literal('ready'),
      suggestionId: z.string(),
      kind: z.string(),
      proposals: z.array(z.object({ body: z.string(), note: z.string().nullable() }).passthrough()),
      warnings: z.array(z.string()),
      provenance: provenanceSchema,
    })
    .passthrough(),
  z
    .object({ status: z.literal('unavailable'), kind: z.string(), reasonKey: z.string() })
    .passthrough(),
]);

const reviewSchema = z
  .object({
    overall: z.string(),
    checks: z.array(
      z
        .object({
          check: z.string(),
          status: z.string(),
          findings: z.array(z.object({ code: z.string(), explanation: z.string() }).passthrough()),
        })
        .passthrough(),
    ),
  })
  .passthrough();

const acceptedSchema = z
  .object({
    suggestionId: z.string(),
    aiAssisted: z.literal(true),
    body: z.string(),
    provenance: provenanceSchema,
  })
  .passthrough();

const bestTimeSchema = z.discriminatedUnion('status', [
  z
    .object({
      status: z.literal('available'),
      startHour: z.number(),
      endHour: z.number(),
      ratio: z.number(),
      metric: z.string(),
      timeZone: z.string(),
      bandSampleSize: z.number(),
      totalSampleSize: z.number(),
    })
    .passthrough(),
  z
    .object({
      status: z.literal('unavailable'),
      reasonKey: z.string(),
      totalSampleSize: z.number(),
      minimumSample: z.number(),
    })
    .passthrough(),
]);

function invalid(reason: string): RelayError {
  return new RelayError('VALIDATION_FAILED', {
    messageKey: 'error.request_invalid.message',
    details: { reason },
  });
}

export interface SuggestRunOptions {
  readonly body?: string | undefined;
  readonly brief?: string | undefined;
  readonly contentItemId?: string | undefined;
  readonly connectionId?: string | undefined;
  readonly tone?: string | undefined;
  readonly targetLanguage?: string | undefined;
}

export async function suggestRun(
  context: CliContext,
  render: RenderInput,
  kind: string,
  options: SuggestRunOptions,
): Promise<void> {
  if (!(SUGGESTION_KINDS as readonly string[]).includes(kind)) {
    throw invalid('SUGGESTION_KIND_UNKNOWN');
  }
  const response = await context.api().request({
    method: 'POST',
    path: ROUTES.suggestions(),
    schema: suggestionSchema,
    body: {
      kind,
      ...(options.body === undefined ? {} : { body: options.body }),
      ...(options.brief === undefined ? {} : { brief: options.brief }),
      ...(options.contentItemId === undefined ? {} : { contentItemId: options.contentItemId }),
      ...(options.connectionId === undefined ? {} : { connectionId: options.connectionId }),
      ...(options.tone === undefined ? {} : { tone: options.tone }),
      ...(options.targetLanguage === undefined ? {} : { targetLanguage: options.targetLanguage }),
    },
  });
  const data = response.data;
  const human =
    data.status === 'ready'
      ? [
          `suggestionId: ${data.suggestionId}`,
          `model: ${data.provenance.model} (${data.provenance.promptId} ${data.provenance.promptVersion})`,
          ...renderTable(
            ['index', 'text'],
            data.proposals.map((entry, index) => [String(index), entry.body]),
          ),
        ]
      : [`unavailable: ${data.reasonKey}`];
  renderSuccess({ ...render, correlationId: response.correlationId }, data, human);
}

export async function suggestReview(
  context: CliContext,
  render: RenderInput,
  options: { readonly body?: string | undefined; readonly contentItemId?: string | undefined },
): Promise<void> {
  if (options.body === undefined || options.body.trim().length === 0) {
    throw invalid('BODY_REQUIRED');
  }
  const response = await context.api().request({
    method: 'POST',
    path: ROUTES.suggestionReviews(),
    schema: reviewSchema,
    body: {
      body: options.body,
      ...(options.contentItemId === undefined ? {} : { contentItemId: options.contentItemId }),
    },
  });
  renderSuccess({ ...render, correlationId: response.correlationId }, response.data, [
    `overall: ${response.data.overall}`,
    ...renderTable(
      ['check', 'status', 'findings'],
      response.data.checks.map((entry) => [
        entry.check,
        entry.status,
        String(entry.findings.length),
      ]),
    ),
  ]);
}

export async function suggestAccept(
  context: CliContext,
  render: RenderInput,
  suggestionId: string,
  options: { readonly index?: number | undefined; readonly contentItemId?: string | undefined },
): Promise<void> {
  const response = await context.api().request({
    method: 'POST',
    path: ROUTES.suggestionAcceptances(),
    schema: acceptedSchema,
    body: {
      suggestionId,
      proposalIndex: options.index ?? 0,
      ...(options.contentItemId === undefined ? {} : { contentItemId: options.contentItemId }),
    },
  });
  renderSuccess({ ...render, correlationId: response.correlationId }, response.data, [
    `aiAssisted: true`,
    `model: ${response.data.provenance.model} (${response.data.provenance.promptVersion})`,
    response.data.body,
  ]);
}

export async function suggestBestTime(
  context: CliContext,
  render: RenderInput,
  connectionId: string,
): Promise<void> {
  const response = await context.api().request({
    method: 'POST',
    path: ROUTES.suggestionBestTimes(),
    schema: bestTimeSchema,
    body: { connectionId },
  });
  const data = response.data;
  const human =
    data.status === 'available'
      ? renderTable(
          ['field', 'value'],
          [
            ['hours', `${data.startHour}:00-${data.endHour}:00 ${data.timeZone}`],
            ['metric', data.metric],
            ['ratio', String(data.ratio)],
            ['bandPosts', String(data.bandSampleSize)],
            ['totalPosts', String(data.totalSampleSize)],
          ],
        )
      : [`unavailable: ${data.reasonKey} (${data.totalSampleSize}/${data.minimumSample})`];
  renderSuccess({ ...render, correlationId: response.correlationId }, data, human);
}
