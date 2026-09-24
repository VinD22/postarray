'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { newIdempotencyKey } from '@/lib/api';
import { call } from '@/lib/api/call';

/**
 * Reads for stored insights: per-post "How it did", what works for you, the
 * weekly digest and its email preference.
 *
 * Every route is served by `services.insights` in `@relay/application`, the
 * same use case the MCP server and the CLI reach. Responses are parsed here,
 * because an HTTP response read in a browser is an external boundary. Every
 * sentence arrives as an i18n key plus arguments; nothing here holds English.
 */

type Args = Readonly<Record<string, string | number | boolean | null>>;
export type FeedbackVerdict = 'above' | 'below' | 'similar' | 'insufficient_data';

export interface PostFeedbackReading {
  readonly insightId: string;
  readonly window: 'twenty_four_hours' | 'seven_days';
  readonly verdict: FeedbackVerdict;
  readonly metric: string;
  readonly subjectValue: number | null;
  readonly medianValue: number | null;
  readonly effectSize: number | null;
  readonly sampleSize: number | null;
  readonly smallSample: boolean;
  readonly confounderKeys: readonly string[];
}

export interface PostChannelFeedback {
  readonly publishJobId: string;
  readonly receiptId: string | null;
  readonly connectionId: string;
  readonly provider: string;
  readonly state: string;
  readonly scheduledFor: string | null;
  readonly dispatchedAt: string | null;
  readonly publishedAt: string | null;
  readonly permalink: string | null;
  readonly readings: readonly PostFeedbackReading[];
  readonly verdict: FeedbackVerdict | null;
  readonly nextTest: {
    readonly messageKey: string;
    readonly messageArgs: Args;
    readonly metric: string;
    readonly source: 'deterministic' | 'ai';
  } | null;
  readonly failure: {
    readonly messageKey: string;
    readonly fixKey: string;
    readonly action: 'reconnect' | 'edit' | 'retry' | 'wait' | null;
  } | null;
  readonly pendingReasonKey: string | null;
}

export interface PostFeedback {
  readonly contentItemId: string;
  readonly channels: readonly PostChannelFeedback[];
}

export interface WhatWorksRow {
  readonly provider: string;
  readonly trait: 'person' | 'text_in_image' | 'logo';
  readonly metric: string;
  readonly ratio: number;
  readonly sampleSize: number;
}

export interface WhatWorks {
  readonly minimumSample: number;
  readonly rows: readonly WhatWorksRow[];
  readonly emptyReasonKey: string | null;
}

export interface DigestRow {
  readonly messageKey: string;
  readonly messageArgs: Args;
  readonly isNarrative: boolean;
}

export interface Digest {
  readonly windowStart: string;
  readonly windowEnd: string;
  readonly source: string;
  readonly fallbackReasonKey: string | null;
  readonly rows: readonly DigestRow[];
}

export interface StoredInsight {
  readonly id: string;
  readonly kind: string;
  readonly contentItemId: string | null;
  readonly messageArgs: Readonly<Record<string, unknown>>;
  readonly evidenceIds: readonly string[];
  readonly sampleSize: number | null;
  readonly createdAt: string;
}

export interface PostExperiment {
  readonly experimentId: string;
  readonly name: string;
  readonly metric: string;
  readonly variantId: string | null;
  readonly conclusive: boolean;
  readonly leadingVariantId: string | null;
  readonly variants: readonly {
    readonly variantId: string;
    readonly label: string;
    readonly sampleSize: number;
    readonly medianValue: number | null;
  }[];
}

export interface OpenExperiment {
  readonly experimentId: string;
  readonly name: string;
  readonly variants: readonly { readonly id: string; readonly label: string }[];
}

export interface DigestSettings {
  readonly emailEnabled: boolean;
  readonly canChange: boolean;
}

/* -------------------------------------------------------------------------
   Parsing. The web app has no schema library of its own, so these are small
   explicit guards. A malformed response throws; it is never cast.
   ------------------------------------------------------------------------- */

class InsightShapeError extends Error {
  constructor(field: string) {
    super(`INSIGHT_RESPONSE_INVALID:${field}`);
  }
}

type Obj = Readonly<Record<string, unknown>>;

function obj(value: unknown, field: string): Obj {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new InsightShapeError(field);
  }
  return value as Obj;
}
function str(value: unknown, field: string): string {
  if (typeof value !== 'string') throw new InsightShapeError(field);
  return value;
}
function strOrNull(value: unknown, field: string): string | null {
  return value === null || value === undefined ? null : str(value, field);
}
function num(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new InsightShapeError(field);
  return value;
}
function numOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}
function arr(value: unknown, field: string): readonly unknown[] {
  if (!Array.isArray(value)) throw new InsightShapeError(field);
  return value;
}
function oneOf<T extends string>(value: unknown, options: readonly T[], field: string): T {
  const found = options.find((option) => option === value);
  if (found === undefined) throw new InsightShapeError(field);
  return found;
}
function argsOf(value: unknown): Args {
  const out: Record<string, string | number | boolean | null> = {};
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    for (const [key, entry] of Object.entries(value)) {
      if (
        entry === null ||
        typeof entry === 'string' ||
        typeof entry === 'number' ||
        typeof entry === 'boolean'
      ) {
        out[key] = entry;
      }
    }
  }
  return out;
}

const VERDICTS: readonly FeedbackVerdict[] = ['above', 'below', 'similar', 'insufficient_data'];

function parseReading(value: unknown): PostFeedbackReading {
  const o = obj(value, 'reading');
  return {
    insightId: str(o.insightId, 'insightId'),
    window: oneOf(o.window, ['twenty_four_hours', 'seven_days'] as const, 'window'),
    verdict: oneOf(o.verdict, VERDICTS, 'verdict'),
    metric: str(o.metric, 'metric'),
    subjectValue: numOrNull(o.subjectValue),
    medianValue: numOrNull(o.medianValue),
    effectSize: numOrNull(o.effectSize),
    sampleSize: numOrNull(o.sampleSize),
    smallSample: o.smallSample === true,
    confounderKeys: arr(o.confounderKeys, 'confounderKeys').filter(
      (entry): entry is string => typeof entry === 'string',
    ),
  };
}

function parseChannel(value: unknown): PostChannelFeedback {
  const o = obj(value, 'channel');
  const next = o.nextTest === null || o.nextTest === undefined ? null : obj(o.nextTest, 'nextTest');
  const failure = o.failure === null || o.failure === undefined ? null : obj(o.failure, 'failure');
  return {
    publishJobId: str(o.publishJobId, 'publishJobId'),
    receiptId: strOrNull(o.receiptId, 'receiptId'),
    connectionId: str(o.connectionId, 'connectionId'),
    provider: str(o.provider, 'provider'),
    state: str(o.state, 'state'),
    scheduledFor: strOrNull(o.scheduledFor, 'scheduledFor'),
    dispatchedAt: strOrNull(o.dispatchedAt, 'dispatchedAt'),
    publishedAt: strOrNull(o.publishedAt, 'publishedAt'),
    permalink: strOrNull(o.permalink, 'permalink'),
    readings: arr(o.readings, 'readings').map(parseReading),
    verdict:
      o.verdict === null || o.verdict === undefined ? null : oneOf(o.verdict, VERDICTS, 'verdict'),
    nextTest:
      next === null
        ? null
        : {
            messageKey: str(next.messageKey, 'nextTest.messageKey'),
            messageArgs: argsOf(next.messageArgs),
            metric: str(next.metric, 'nextTest.metric'),
            source: oneOf(next.source, ['deterministic', 'ai'] as const, 'nextTest.source'),
          },
    failure:
      failure === null
        ? null
        : {
            messageKey: str(failure.messageKey, 'failure.messageKey'),
            fixKey: str(failure.fixKey, 'failure.fixKey'),
            action:
              failure.action === null || failure.action === undefined
                ? null
                : oneOf(failure.action, ['reconnect', 'edit', 'retry', 'wait'] as const, 'action'),
          },
    pendingReasonKey: strOrNull(o.pendingReasonKey, 'pendingReasonKey'),
  };
}

export function parsePostFeedback(value: unknown): PostFeedback {
  const o = obj(value, 'postFeedback');
  return {
    contentItemId: str(o.contentItemId, 'contentItemId'),
    channels: arr(o.channels, 'channels').map(parseChannel),
  };
}

export function parseWhatWorks(value: unknown): WhatWorks {
  const o = obj(value, 'whatWorks');
  return {
    minimumSample: num(o.minimumSample, 'minimumSample'),
    rows: arr(o.rows, 'rows').map((entry) => {
      const row = obj(entry, 'row');
      return {
        provider: str(row.provider, 'provider'),
        trait: oneOf(row.trait, ['person', 'text_in_image', 'logo'] as const, 'trait'),
        metric: str(row.metric, 'metric'),
        ratio: num(row.ratio, 'ratio'),
        sampleSize: num(row.sampleSize, 'sampleSize'),
      };
    }),
    emptyReasonKey: strOrNull(o.emptyReasonKey, 'emptyReasonKey'),
  };
}

export function parseDigest(value: unknown): Digest | null {
  if (value === null || value === undefined) return null;
  const o = obj(value, 'digest');
  return {
    windowStart: str(o.windowStart, 'windowStart'),
    windowEnd: str(o.windowEnd, 'windowEnd'),
    source: str(o.source, 'source'),
    fallbackReasonKey: strOrNull(o.fallbackReasonKey, 'fallbackReasonKey'),
    rows: arr(o.rows, 'rows').map((entry) => {
      const row = obj(entry, 'row');
      return {
        messageKey: str(row.messageKey, 'messageKey'),
        messageArgs: argsOf(row.messageArgs),
        isNarrative: row.isNarrative === true,
      };
    }),
  };
}

export function parseStoredInsights(value: unknown): readonly StoredInsight[] {
  const list = Array.isArray(value) ? value : obj(value, 'insights').data;
  return arr(list, 'data').map((entry) => {
    const o = obj(entry, 'insight');
    return {
      id: str(o.id, 'id'),
      kind: str(o.kind, 'kind'),
      contentItemId: strOrNull(o.contentItemId, 'contentItemId'),
      messageArgs:
        typeof o.messageArgs === 'object' && o.messageArgs !== null
          ? (o.messageArgs as Readonly<Record<string, unknown>>)
          : {},
      evidenceIds: arr(o.evidenceIds, 'evidenceIds').filter(
        (id): id is string => typeof id === 'string',
      ),
      sampleSize: numOrNull(o.sampleSize),
      createdAt: str(o.createdAt, 'createdAt'),
    };
  });
}

export function parsePostExperiment(value: unknown): PostExperiment | null {
  if (value === null || value === undefined) return null;
  const o = obj(value, 'experiment');
  return {
    experimentId: str(o.experimentId, 'experimentId'),
    name: str(o.name, 'name'),
    metric: str(o.metric, 'metric'),
    variantId: strOrNull(o.variantId, 'variantId'),
    conclusive: o.conclusive === true,
    leadingVariantId: strOrNull(o.leadingVariantId, 'leadingVariantId'),
    variants: arr(o.variants, 'variants').map((entry) => {
      const v = obj(entry, 'variant');
      return {
        variantId: str(v.variantId, 'variantId'),
        label: str(v.label, 'label'),
        sampleSize: num(v.sampleSize, 'sampleSize'),
        medianValue: numOrNull(v.medianValue),
      };
    }),
  };
}

function parseOpenExperiments(value: unknown): readonly OpenExperiment[] {
  return arr(obj(value, 'openExperiments').data, 'data').map((entry) => {
    const o = obj(entry, 'openExperiment');
    return {
      experimentId: str(o.experimentId, 'experimentId'),
      name: str(o.name, 'name'),
      variants: arr(o.variants, 'variants').map((variant) => {
        const v = obj(variant, 'variant');
        return { id: str(v.id, 'id'), label: str(v.label, 'label') };
      }),
    };
  });
}

function parseDigestSettings(value: unknown): DigestSettings {
  const o = obj(value, 'digestSettings');
  return { emailEnabled: o.emailEnabled === true, canChange: o.canChange === true };
}

/** Demo mode shows the honest empty states, never invented readings. */
export const insightsGateway = {
  postFeedback: async (contentItemId: string): Promise<PostFeedback> =>
    parsePostFeedback(
      await call<unknown>(`/insights/posts/${encodeURIComponent(contentItemId)}`, {}, () => ({
        contentItemId,
        channels: [],
      })),
    ),
  whatWorks: async (): Promise<WhatWorks> =>
    parseWhatWorks(
      await call<unknown>('/insights/what-works', {}, () => ({
        minimumSample: 5,
        rows: [],
        emptyReasonKey: 'insight.whatWorks.empty.noPosts',
      })),
    ),
  latestDigest: async (): Promise<Digest | null> =>
    parseDigest(await call<unknown>('/insights/digest/latest', {}, () => null)),
  list: async (): Promise<readonly StoredInsight[]> => {
    return parseStoredInsights(await call<unknown>('/insights', {}, () => ({ data: [] })));
  },
  postExperiment: async (contentItemId: string): Promise<PostExperiment | null> =>
    parsePostExperiment(
      await call<unknown>(
        `/insights/posts/${encodeURIComponent(contentItemId)}/experiment`,
        {},
        () => null,
      ),
    ),
  openExperiments: async (): Promise<readonly OpenExperiment[]> =>
    parseOpenExperiments(
      await call<unknown>('/insights/experiments/open', {}, () => ({ data: [] })),
    ),
  tagExperiment: async (
    contentItemId: string,
    input: { readonly experimentId: string; readonly variantId: string },
  ): Promise<PostExperiment | null> =>
    parsePostExperiment(
      await call<unknown>(
        `/insights/posts/${encodeURIComponent(contentItemId)}/experiment`,
        { method: 'PUT', body: input, idempotencyKey: newIdempotencyKey('experiment-tag') },
        () => null,
      ),
    ),
  digestSettings: async (): Promise<DigestSettings> =>
    parseDigestSettings(
      await call<unknown>('/insights/digest/settings', {}, () => ({
        emailEnabled: true,
        canChange: true,
      })),
    ),
  updateDigestSettings: async (emailEnabled: boolean): Promise<DigestSettings> =>
    parseDigestSettings(
      await call<unknown>(
        '/insights/digest/settings',
        {
          method: 'PUT',
          body: { emailEnabled },
          idempotencyKey: newIdempotencyKey('digest-settings'),
        },
        () => ({ emailEnabled, canChange: true }),
      ),
    ),
};

const FIVE_MINUTES = 5 * 60 * 1000;

export const insightKeys = {
  all: ['insights'] as const,
  post: (contentItemId: string) => ['insights', 'post', contentItemId] as const,
  whatWorks: ['insights', 'what-works'] as const,
  digest: ['insights', 'digest'] as const,
  digestSettings: ['insights', 'digest', 'settings'] as const,
  list: ['insights', 'list'] as const,
  postExperiment: (contentItemId: string) => ['insights', 'experiment', contentItemId] as const,
  openExperiments: ['insights', 'experiments', 'open'] as const,
};

export function usePostFeedback(contentItemId: string, enabled = true) {
  return useQuery({
    queryKey: insightKeys.post(contentItemId),
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: () => insightsGateway.postFeedback(contentItemId),
  });
}

export function useWhatWorks(enabled = true) {
  return useQuery({
    queryKey: insightKeys.whatWorks,
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: () => insightsGateway.whatWorks(),
  });
}

export function useLatestDigest(enabled = true) {
  return useQuery({
    queryKey: insightKeys.digest,
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: () => insightsGateway.latestDigest(),
  });
}

export function useStoredInsights(enabled = true) {
  return useQuery({
    queryKey: insightKeys.list,
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: () => insightsGateway.list(),
  });
}

export function useDigestSettings(enabled = true) {
  return useQuery({
    queryKey: insightKeys.digestSettings,
    enabled,
    queryFn: () => insightsGateway.digestSettings(),
  });
}

export function useUpdateDigestSettings() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (emailEnabled: boolean) => insightsGateway.updateDigestSettings(emailEnabled),
    onSuccess: (settings) => {
      client.setQueryData(insightKeys.digestSettings, settings);
    },
  });
}

export function usePostExperiment(contentItemId: string, enabled = true) {
  return useQuery({
    queryKey: insightKeys.postExperiment(contentItemId),
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: () => insightsGateway.postExperiment(contentItemId),
  });
}

export function useOpenExperiments(enabled = true) {
  return useQuery({
    queryKey: insightKeys.openExperiments,
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: () => insightsGateway.openExperiments(),
  });
}

export function useTagExperiment(contentItemId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { readonly experimentId: string; readonly variantId: string }) =>
      insightsGateway.tagExperiment(contentItemId, input),
    onSuccess: (experiment) => {
      client.setQueryData(insightKeys.postExperiment(contentItemId), experiment);
    },
  });
}
