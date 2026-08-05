import { z } from 'zod';

import { providerIdSchema } from '@relay/contracts';
import type { ProviderId } from '@relay/contracts';

import type { PolarClient, UsageEventInput } from './client.js';
import { USD, formatMicro, microToMinor, unitsToMinor } from './money.js';
import { addDays, differenceDays, isAfter, isAtOrAfter } from './time.js';

/**
 * Provider usage metering.
 *
 * Only X is metered in V1, because only X charges per operation. Amounts
 * accumulate as integer micro-dollars and are converted to cents once, rounding
 * down, so "at cost" is literally true: no markup and no rounding in our favour.
 *
 * There is no media generation meter, no image product and no video product.
 * `FORBIDDEN_METER_NAMES` exists so that stays true by test rather than by
 * memory.
 */

export const METERED_OPERATIONS = [
  'post_create',
  'post_create_with_url',
  'ai_text_input_tokens',
  'ai_text_output_tokens',
] as const;
export const meteredOperationSchema = z.enum(METERED_OPERATIONS);
export type MeteredOperation = z.infer<typeof meteredOperationSchema>;

/**
 * Meters that must never exist. V1 ships no AI image or video generation, so
 * there is no endpoint, no entitlement and no way to bill for one.
 */
export const FORBIDDEN_METER_NAMES: readonly string[] = Object.freeze([
  'image_generation',
  'ai_image',
  'ai_image_generation',
  'video_generation',
  'ai_video',
  'ai_video_generation',
  'media_generation',
  'image_credits',
  'video_credits',
]);

export interface PriceBookEntry {
  readonly provider: ProviderId | 'ai';
  readonly operation: MeteredOperation;
  /** Price in micro-dollars for `unitSize` units of the operation. */
  readonly unitMicroDollars: number;
  /** 1 for per-operation pricing, 1_000_000 for per-million-token pricing. */
  readonly unitSize: number;
  readonly currency: string;
  readonly effectiveFrom: string;
  /** When a human last checked the published price against the source. */
  readonly verifiedAt: string;
  readonly sourceUrl: string;
}

export interface PriceBook {
  readonly version: string;
  readonly entries: readonly PriceBookEntry[];
}

/**
 * X per-operation prices as published on 4 August 2026. The developer console
 * is authoritative and prices change: re-verify before implementation and
 * before any customer-facing price is rendered.
 */
export const X_PRICE_BOOK: PriceBook = Object.freeze({
  version: '2026-08-04',
  entries: Object.freeze([
    Object.freeze({
      provider: 'x' as const,
      operation: 'post_create' as const,
      unitMicroDollars: 15_000,
      unitSize: 1,
      currency: USD,
      effectiveFrom: '2026-08-04T00:00:00.000Z',
      verifiedAt: '2026-08-04T00:00:00.000Z',
      sourceUrl: 'https://docs.x.com/x-api/getting-started/pricing',
    }),
    Object.freeze({
      provider: 'x' as const,
      operation: 'post_create_with_url' as const,
      unitMicroDollars: 200_000,
      unitSize: 1,
      currency: USD,
      effectiveFrom: '2026-08-04T00:00:00.000Z',
      verifiedAt: '2026-08-04T00:00:00.000Z',
      sourceUrl: 'https://docs.x.com/x-api/getting-started/pricing',
    }),
  ]),
});

/**
 * AI text prices are volatile and are supplied from configuration rather than
 * hard coded, so a provider price change is an environment change.
 */
export function createAiTextPriceBook(input: {
  version: string;
  inputMicroPerMillionTokens: number;
  outputMicroPerMillionTokens: number;
  effectiveFrom: string;
  verifiedAt: string;
  sourceUrl: string;
}): PriceBook {
  const common = {
    provider: 'ai' as const,
    unitSize: 1_000_000,
    currency: USD,
    effectiveFrom: input.effectiveFrom,
    verifiedAt: input.verifiedAt,
    sourceUrl: input.sourceUrl,
  };
  return {
    version: input.version,
    entries: [
      {
        ...common,
        operation: 'ai_text_input_tokens',
        unitMicroDollars: input.inputMicroPerMillionTokens,
      },
      {
        ...common,
        operation: 'ai_text_output_tokens',
        unitMicroDollars: input.outputMicroPerMillionTokens,
      },
    ],
  };
}

export function mergePriceBooks(version: string, books: readonly PriceBook[]): PriceBook {
  return { version, entries: books.flatMap((book) => book.entries) };
}

/** The entry in force at `at`, or null when nothing has been published yet. */
export function priceFor(
  book: PriceBook,
  provider: ProviderId | 'ai',
  operation: MeteredOperation,
  at: string,
): PriceBookEntry | null {
  const candidates = book.entries.filter(
    (entry) =>
      entry.provider === provider &&
      entry.operation === operation &&
      isAtOrAfter(at, entry.effectiveFrom),
  );
  let best: PriceBookEntry | null = null;
  for (const entry of candidates) {
    if (best === null || isAfter(entry.effectiveFrom, best.effectiveFrom)) {
      best = entry;
    }
  }
  return best;
}

/** Prices older than this render with a "prices last checked" note. */
export const PRICE_BOOK_MAX_AGE_DAYS = 30;

export function priceBookVerifiedAt(book: PriceBook): string | null {
  let oldest: string | null = null;
  for (const entry of book.entries) {
    if (oldest === null || isAfter(oldest, entry.verifiedAt)) {
      oldest = entry.verifiedAt;
    }
  }
  return oldest;
}

export function isPriceBookStale(
  book: PriceBook,
  now: string,
  maxAgeDays = PRICE_BOOK_MAX_AGE_DAYS,
): boolean {
  const verifiedAt = priceBookVerifiedAt(book);
  if (verifiedAt === null) {
    return true;
  }
  return differenceDays(now, verifiedAt) > maxAgeDays;
}

export interface UsageOperation {
  readonly provider: ProviderId | 'ai';
  readonly operation: MeteredOperation;
  readonly quantity: number;
  /** Which target this line belongs to, so the composer can group by account. */
  readonly targetId?: string;
}

export interface UsageEstimateLine {
  readonly provider: ProviderId | 'ai';
  readonly operation: MeteredOperation;
  readonly quantity: number;
  readonly unitMicroDollars: number;
  readonly microDollars: number;
  readonly amountText: string;
  readonly targetId: string | null;
  readonly priced: boolean;
}

export interface UsageEstimate {
  readonly currency: string;
  readonly lines: readonly UsageEstimateLine[];
  readonly totalMicroDollars: number;
  readonly totalMinor: number;
  readonly totalText: string;
  readonly pricesVerifiedAt: string | null;
  readonly pricesStale: boolean;
  /** Shown beside every estimate: billed at cost, prices published by X. */
  readonly atCostNoteKey: string;
  readonly staleNoteKey: string | null;
  /** Operations we could not price. Never silently treated as free. */
  readonly unpriced: readonly UsageOperation[];
}

function lineMicro(entry: PriceBookEntry, quantity: number): number {
  return Math.floor((quantity * entry.unitMicroDollars) / entry.unitSize);
}

/**
 * The cost panel shown before the action. Every publish confirmation, schedule
 * confirmation and automation rule preview renders this.
 */
export function estimateUsage(input: {
  book: PriceBook;
  operations: readonly UsageOperation[];
  now: string;
}): UsageEstimate {
  const lines: UsageEstimateLine[] = [];
  const unpriced: UsageOperation[] = [];
  let totalMicro = 0;

  for (const operation of input.operations) {
    const entry = priceFor(input.book, operation.provider, operation.operation, input.now);
    if (entry === null) {
      unpriced.push(operation);
      lines.push({
        provider: operation.provider,
        operation: operation.operation,
        quantity: operation.quantity,
        unitMicroDollars: 0,
        microDollars: 0,
        amountText: '',
        targetId: operation.targetId ?? null,
        priced: false,
      });
      continue;
    }
    const micro = lineMicro(entry, operation.quantity);
    totalMicro += micro;
    lines.push({
      provider: operation.provider,
      operation: operation.operation,
      quantity: operation.quantity,
      unitMicroDollars: entry.unitMicroDollars,
      microDollars: micro,
      amountText: formatMicro(micro, entry.currency),
      targetId: operation.targetId ?? null,
      priced: true,
    });
  }

  const stale = isPriceBookStale(input.book, input.now);
  return {
    currency: USD,
    lines,
    totalMicroDollars: totalMicro,
    totalMinor: microToMinor(totalMicro),
    totalText: formatMicro(totalMicro, USD),
    pricesVerifiedAt: priceBookVerifiedAt(input.book),
    pricesStale: stale,
    atCostNoteKey: 'billing.usage.meteredNote',
    staleNoteKey: stale ? 'billing.usage.periodTotal' : null,
    unpriced,
  };
}

/** The operation a single X post create maps to. Links cost materially more. */
export function xPostOperation(containsUrl: boolean): MeteredOperation {
  return containsUrl ? 'post_create_with_url' : 'post_create';
}

export interface UsageRecord {
  readonly id: string;
  readonly workspaceId: string;
  readonly provider: ProviderId | 'ai';
  readonly operation: MeteredOperation;
  readonly quantity: number;
  readonly microDollars: number;
  readonly currency: string;
  readonly occurredAt: string;
  readonly receiptId: string | null;
  readonly connectionId: string | null;
  readonly source: 'estimate' | 'actual' | 'adjustment';
  readonly priceBookVersion: string;
}

export interface RecordUsageInput {
  readonly id: string;
  readonly workspaceId: string;
  readonly provider: ProviderId | 'ai';
  readonly operation: MeteredOperation;
  readonly quantity: number;
  readonly occurredAt: string;
  readonly book: PriceBook;
  readonly source: 'estimate' | 'actual' | 'adjustment';
  readonly receiptId?: string;
  readonly connectionId?: string;
}

/** Turn one performed operation into a priced, immutable usage record. */
export function recordUsage(input: RecordUsageInput): UsageRecord {
  const entry = priceFor(input.book, input.provider, input.operation, input.occurredAt);
  return {
    id: input.id,
    workspaceId: input.workspaceId,
    provider: input.provider,
    operation: input.operation,
    quantity: input.quantity,
    microDollars: entry === null ? 0 : lineMicro(entry, input.quantity),
    currency: entry?.currency ?? USD,
    occurredAt: input.occurredAt,
    receiptId: input.receiptId ?? null,
    connectionId: input.connectionId ?? null,
    source: input.source,
    priceBookVersion: input.book.version,
  };
}

export interface UsageAdjustment {
  readonly operation: MeteredOperation;
  readonly recordedQuantity: number;
  readonly providerQuantity: number;
  readonly deltaQuantity: number;
  readonly deltaMicroDollars: number;
}

/**
 * The nightly reconciliation. Our recorded operations are compared against the
 * provider's reported usage and the difference is written as an adjustment line
 * rather than by editing history. The receipt shows both numbers.
 */
export function reconcileUsage(input: {
  recorded: readonly UsageRecord[];
  providerReported: Readonly<Partial<Record<MeteredOperation, number>>>;
  book: PriceBook;
  at: string;
  /** Only X charges per operation today, so it is the default. */
  provider?: ProviderId | 'ai';
}): readonly UsageAdjustment[] {
  const provider = input.provider ?? 'x';
  const adjustments: UsageAdjustment[] = [];
  const recordedByOperation = new Map<MeteredOperation, number>();
  for (const record of input.recorded) {
    recordedByOperation.set(
      record.operation,
      (recordedByOperation.get(record.operation) ?? 0) + record.quantity,
    );
  }
  const operations = new Set<MeteredOperation>([
    ...recordedByOperation.keys(),
    ...(Object.keys(input.providerReported) as MeteredOperation[]),
  ]);
  for (const operation of operations) {
    const recorded = recordedByOperation.get(operation) ?? 0;
    const reported = input.providerReported[operation] ?? 0;
    if (recorded === reported) {
      continue;
    }
    const entry = priceFor(input.book, provider, operation, input.at);
    const delta = reported - recorded;
    adjustments.push({
      operation,
      recordedQuantity: recorded,
      providerQuantity: reported,
      deltaQuantity: delta,
      deltaMicroDollars: entry === null ? 0 : lineMicro(entry, Math.abs(delta)) * Math.sign(delta),
    });
  }
  return adjustments;
}

/** Sum a period of usage records into the amount that reaches an invoice. */
export function periodTotal(records: readonly UsageRecord[]): {
  microDollars: number;
  minor: number;
  carriedMicroDollars: number;
} {
  const micro = records.reduce((total, record) => total + record.microDollars, 0);
  const minor = microToMinor(micro);
  return { microDollars: micro, minor, carriedMicroDollars: micro - minor * 10_000 };
}

export const SPEND_ALERT_DEFAULT_MINOR = unitsToMinor(25);
export const TRIAL_SPEND_CAP_MINOR = unitsToMinor(5);
export const HARD_PAUSE_DEFAULT = false;

export interface SpendControls {
  readonly alertAtMinor: number;
  readonly hardPauseEnabled: boolean;
  readonly hardPauseAtMinor: number | null;
  readonly trialCapMinor: number;
}

export const DEFAULT_SPEND_CONTROLS: SpendControls = Object.freeze({
  alertAtMinor: SPEND_ALERT_DEFAULT_MINOR,
  hardPauseEnabled: HARD_PAUSE_DEFAULT,
  hardPauseAtMinor: null,
  trialCapMinor: TRIAL_SPEND_CAP_MINOR,
});

export interface SpendDecision {
  readonly periodMinor: number;
  readonly alert: boolean;
  /** When true, X publishing stops. Other connectors are unaffected. */
  readonly pauseXPublishing: boolean;
  readonly reason: 'within_budget' | 'alert_threshold' | 'hard_pause' | 'trial_cap';
  readonly messageKey: string;
}

/**
 * Spend controls. A hard pause stops X publishing and leaves every other
 * connector untouched. Nothing is deleted and no post is silently dropped: the
 * paused work becomes an Action Center item.
 */
export function evaluateSpendControls(input: {
  periodMicroDollars: number;
  controls?: SpendControls;
  isTrialing: boolean;
}): SpendDecision {
  const controls = input.controls ?? DEFAULT_SPEND_CONTROLS;
  const periodMinor = microToMinor(input.periodMicroDollars);
  if (input.isTrialing && periodMinor >= controls.trialCapMinor) {
    return {
      periodMinor,
      alert: true,
      pauseXPublishing: true,
      reason: 'trial_cap',
      messageKey: 'billing.usage.balance',
    };
  }
  if (
    controls.hardPauseEnabled &&
    controls.hardPauseAtMinor !== null &&
    periodMinor >= controls.hardPauseAtMinor
  ) {
    return {
      periodMinor,
      alert: true,
      pauseXPublishing: true,
      reason: 'hard_pause',
      messageKey: 'billing.usage.balance',
    };
  }
  if (periodMinor >= controls.alertAtMinor) {
    return {
      periodMinor,
      alert: true,
      pauseXPublishing: false,
      reason: 'alert_threshold',
      messageKey: 'billing.usage.periodTotal',
    };
  }
  return {
    periodMinor,
    alert: false,
    pauseXPublishing: false,
    reason: 'within_budget',
    messageKey: 'billing.usage.periodTotal',
  };
}

/** Names sent to Polar's usage meter. Media generation is not among them. */
export function usageMeterName(operation: MeteredOperation): string {
  return `relay.${operation}`;
}

export function assertMeterAllowed(name: string): void {
  const normalized = name.toLowerCase();
  for (const forbidden of FORBIDDEN_METER_NAMES) {
    if (normalized.includes(forbidden)) {
      throw new RangeError('FORBIDDEN_METER');
    }
  }
}

/** Convert usage records into the events Polar's usage meter ingests. */
export function toPolarUsageEvents(
  records: readonly UsageRecord[],
  externalCustomerIdOf: (workspaceId: string) => string,
): readonly UsageEventInput[] {
  return records.map((record) => {
    const name = usageMeterName(record.operation);
    assertMeterAllowed(name);
    return {
      name,
      externalCustomerId: externalCustomerIdOf(record.workspaceId),
      timestamp: record.occurredAt,
      metadata: {
        provider: String(record.provider),
        operation: record.operation,
        quantity: record.quantity,
        microDollars: record.microDollars,
        priceBookVersion: record.priceBookVersion,
      },
    };
  });
}

/** Push a batch of usage to Polar. Returns how many events were accepted. */
export async function publishUsage(
  client: PolarClient,
  records: readonly UsageRecord[],
  externalCustomerIdOf: (workspaceId: string) => string,
): Promise<{ accepted: number }> {
  return client.ingestUsage(toPolarUsageEvents(records, externalCustomerIdOf));
}

/** The next monthly usage period boundary, used by the arrears invoice job. */
export function nextUsagePeriodStart(periodStart: string): string {
  return addDays(periodStart, 30);
}

export const providerMeterSchema = z
  .object({ provider: providerIdSchema, operation: meteredOperationSchema })
  .strict();
