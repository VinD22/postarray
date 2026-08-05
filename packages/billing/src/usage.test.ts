import { describe, expect, it } from 'vitest';

import { microToMinor } from './money';
import {
  DEFAULT_SPEND_CONTROLS,
  FORBIDDEN_METER_NAMES,
  METERED_OPERATIONS,
  X_PRICE_BOOK,
  assertMeterAllowed,
  createAiTextPriceBook,
  estimateUsage,
  evaluateSpendControls,
  isPriceBookStale,
  mergePriceBooks,
  periodTotal,
  priceFor,
  reconcileUsage,
  recordUsage,
  toPolarUsageEvents,
  usageMeterName,
  xPostOperation,
} from './usage';
import type { UsageRecord } from './usage';

const NOW = '2026-08-10T12:00:00.000Z';

describe('the price book', () => {
  it('prices X post creates from the book, not from a constant in the composer', () => {
    const plain = priceFor(X_PRICE_BOOK, 'x', 'post_create', NOW);
    const withUrl = priceFor(X_PRICE_BOOK, 'x', 'post_create_with_url', NOW);
    expect(plain?.unitMicroDollars).toBe(15_000);
    expect(withUrl?.unitMicroDollars).toBe(200_000);
    expect(plain?.sourceUrl).toContain('docs.x.com');
  });

  it('returns nothing for a price that is not yet effective', () => {
    expect(priceFor(X_PRICE_BOOK, 'x', 'post_create', '2026-01-01T00:00:00.000Z')).toBeNull();
  });

  it('meters no provider other than X out of the box', () => {
    expect(priceFor(X_PRICE_BOOK, 'linkedin', 'post_create', NOW)).toBeNull();
    expect(priceFor(X_PRICE_BOOK, 'instagram', 'post_create', NOW)).toBeNull();
    expect(priceFor(X_PRICE_BOOK, 'tiktok', 'post_create', NOW)).toBeNull();
  });

  it('marks itself stale after thirty days so the UI can say when prices were checked', () => {
    expect(isPriceBookStale(X_PRICE_BOOK, '2026-08-20T00:00:00.000Z')).toBe(false);
    expect(isPriceBookStale(X_PRICE_BOOK, '2026-09-20T00:00:00.000Z')).toBe(true);
  });

  it('takes AI text prices from configuration rather than hard coding a volatile rate', () => {
    const ai = createAiTextPriceBook({
      version: 'test',
      inputMicroPerMillionTokens: 140_000,
      outputMicroPerMillionTokens: 280_000,
      effectiveFrom: '2026-08-01T00:00:00.000Z',
      verifiedAt: '2026-08-01T00:00:00.000Z',
      sourceUrl: 'https://example.test/pricing',
    });
    const merged = mergePriceBooks('merged', [X_PRICE_BOOK, ai]);
    expect(priceFor(merged, 'ai', 'ai_text_input_tokens', NOW)?.unitSize).toBe(1_000_000);
    expect(priceFor(merged, 'x', 'post_create', NOW)?.unitMicroDollars).toBe(15_000);
  });
});

describe('the estimate shown before the action', () => {
  it('reproduces the composer cost panel from the documented example', () => {
    const estimate = estimateUsage({
      book: X_PRICE_BOOK,
      now: NOW,
      operations: [
        { provider: 'x', operation: 'post_create_with_url', quantity: 1, targetId: 'pv_1' },
        { provider: 'x', operation: 'post_create', quantity: 2, targetId: 'pv_1' },
      ],
    });
    expect(estimate.lines[0]?.amountText).toBe('$0.200');
    expect(estimate.lines[1]?.amountText).toBe('$0.030');
    expect(estimate.totalMicroDollars).toBe(230_000);
    expect(estimate.totalText).toBe('$0.230');
    expect(estimate.pricesVerifiedAt).toBe('2026-08-04T00:00:00.000Z');
    expect(estimate.pricesStale).toBe(false);
  });

  it('never treats an unpriced operation as free without saying so', () => {
    const estimate = estimateUsage({
      book: X_PRICE_BOOK,
      now: NOW,
      operations: [{ provider: 'ai', operation: 'ai_text_input_tokens', quantity: 1_000 }],
    });
    expect(estimate.unpriced).toHaveLength(1);
    expect(estimate.lines[0]?.priced).toBe(false);
    expect(estimate.totalMicroDollars).toBe(0);
  });

  it('chooses the URL price only when the post contains a URL', () => {
    expect(xPostOperation(true)).toBe('post_create_with_url');
    expect(xPostOperation(false)).toBe('post_create');
  });
});

describe('recording and reconciling the actual', () => {
  const book = X_PRICE_BOOK;

  function record(
    operation: 'post_create' | 'post_create_with_url',
    quantity: number,
  ): UsageRecord {
    return recordUsage({
      id: `usage_${operation}_${quantity}`,
      workspaceId: 'ws_01',
      provider: 'x',
      operation,
      quantity,
      occurredAt: NOW,
      book,
      source: 'actual',
      receiptId: 'receipt_01',
    });
  }

  it('prices each performed operation at the book version in force', () => {
    const line = record('post_create_with_url', 1);
    expect(line.microDollars).toBe(200_000);
    expect(line.priceBookVersion).toBe(book.version);
    expect(line.source).toBe('actual');
  });

  it('writes an adjustment when the provider reports something different', () => {
    const adjustments = reconcileUsage({
      recorded: [record('post_create', 3)],
      providerReported: { post_create: 4 },
      book,
      at: NOW,
    });
    expect(adjustments).toHaveLength(1);
    expect(adjustments[0]?.deltaQuantity).toBe(1);
    expect(adjustments[0]?.deltaMicroDollars).toBe(15_000);
  });

  it('writes a negative adjustment when we over-recorded', () => {
    const adjustments = reconcileUsage({
      recorded: [record('post_create', 5)],
      providerReported: { post_create: 4 },
      book,
      at: NOW,
    });
    expect(adjustments[0]?.deltaMicroDollars).toBe(-15_000);
  });

  it('writes nothing when the estimate and the actual agree', () => {
    expect(
      reconcileUsage({
        recorded: [record('post_create', 4)],
        providerReported: { post_create: 4 },
        book,
        at: NOW,
      }),
    ).toHaveLength(0);
  });

  it('accumulates in micro-dollars and converts once, with no rounding gain to us', () => {
    const records = Array.from({ length: 1_000 }, (_, index) =>
      recordUsage({
        id: `usage_${index}`,
        workspaceId: 'ws_01',
        provider: 'x',
        operation: 'post_create',
        quantity: 1,
        occurredAt: NOW,
        book,
        source: 'actual',
      }),
    );
    const total = periodTotal(records);
    expect(total.microDollars).toBe(15_000_000);
    expect(total.minor).toBe(1_500);
    expect(total.carriedMicroDollars).toBe(0);
    expect(microToMinor(total.microDollars) * 10_000).toBeLessThanOrEqual(total.microDollars);
  });
});

describe('spend controls', () => {
  it('defaults to a $25 alert, no hard pause and a $5 trial cap', () => {
    expect(DEFAULT_SPEND_CONTROLS.alertAtMinor).toBe(2_500);
    expect(DEFAULT_SPEND_CONTROLS.hardPauseEnabled).toBe(false);
    expect(DEFAULT_SPEND_CONTROLS.trialCapMinor).toBe(500);
  });

  it('alerts without pausing at the alert threshold', () => {
    const decision = evaluateSpendControls({
      periodMicroDollars: 26_000_000,
      isTrialing: false,
    });
    expect(decision.alert).toBe(true);
    expect(decision.pauseXPublishing).toBe(false);
  });

  it('pauses X publishing when a hard pause is configured and reached', () => {
    const decision = evaluateSpendControls({
      periodMicroDollars: 51_000_000,
      isTrialing: false,
      controls: { ...DEFAULT_SPEND_CONTROLS, hardPauseEnabled: true, hardPauseAtMinor: 5_000 },
    });
    expect(decision.pauseXPublishing).toBe(true);
    expect(decision.reason).toBe('hard_pause');
  });

  it('caps metered spend during a trial', () => {
    const decision = evaluateSpendControls({ periodMicroDollars: 6_000_000, isTrialing: true });
    expect(decision.reason).toBe('trial_cap');
    expect(decision.pauseXPublishing).toBe(true);
  });

  it('stays quiet inside the budget', () => {
    const decision = evaluateSpendControls({ periodMicroDollars: 1_000_000, isTrialing: false });
    expect(decision.alert).toBe(false);
    expect(decision.reason).toBe('within_budget');
  });
});

describe('no media generation meter exists', () => {
  it('declares only post creates and AI text tokens', () => {
    expect([...METERED_OPERATIONS]).toEqual([
      'post_create',
      'post_create_with_url',
      'ai_text_input_tokens',
      'ai_text_output_tokens',
    ]);
  });

  it('refuses to build a meter name for image or video generation', () => {
    for (const forbidden of FORBIDDEN_METER_NAMES) {
      expect(() => assertMeterAllowed(`relay.${forbidden}`)).toThrow(RangeError);
    }
    expect(() => assertMeterAllowed(usageMeterName('post_create'))).not.toThrow();
  });

  it('emits Polar usage events only for allowed meters', () => {
    const events = toPolarUsageEvents(
      [
        recordUsage({
          id: 'usage_1',
          workspaceId: 'ws_01',
          provider: 'x',
          operation: 'post_create',
          quantity: 1,
          occurredAt: NOW,
          book: X_PRICE_BOOK,
          source: 'actual',
        }),
      ],
      (workspaceId) => `ext_${workspaceId}`,
    );
    expect(events[0]?.name).toBe('relay.post_create');
    expect(events[0]?.externalCustomerId).toBe('ext_ws_01');
    expect(events[0]?.metadata.microDollars).toBe(15_000);
  });
});
