import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { en } from '@relay/i18n';

import { FORBIDDEN_BILLING_PHRASES, MANDATED_COPY, PRICE_PRESENTATION } from './products.js';
import { FORBIDDEN_METER_NAMES } from './usage.js';

/**
 * Copy compliance, enforced by the build rather than by a release checklist.
 *
 * Nothing anywhere may claim "20% off", because the annual saving is 13.8%, and
 * nothing may claim a "$2 hold" or any other temporary card authorization,
 * because Polar's trial mechanism collects a payment method and defers the
 * first charge, which is not the same thing.
 */

const SOURCE_DIR = fileURLToPath(new URL('.', import.meta.url));

function sourceFiles(): readonly string[] {
  return readdirSync(SOURCE_DIR)
    .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
    .map((name) => join(SOURCE_DIR, name));
}

/**
 * `products.ts` names the forbidden phrases in order to ban them, and
 * `usage.ts` names the forbidden meters in order to reject them. Those two
 * declarations are removed before scanning so the ban does not trip over
 * itself.
 */
function scannableSource(path: string): string {
  const raw = readFileSync(path, 'utf8');
  return raw
    .replace(/export const FORBIDDEN_BILLING_PHRASES[\s\S]*?\n\]\);\n/, '\n')
    .replace(/export const FORBIDDEN_METER_NAMES[\s\S]*?\n\]\);\n/, '\n')
    .replace(/export const FORBIDDEN_MARGIN_LEVERS[\s\S]*?\n\]\);\n/, '\n');
}

describe('forbidden billing claims', () => {
  it('lists the phrases that may never ship', () => {
    expect(FORBIDDEN_BILLING_PHRASES).toContain('20% off');
    expect(FORBIDDEN_BILLING_PHRASES).toContain('$2 hold');
  });

  it('never says "20% off" anywhere in the package', () => {
    for (const path of sourceFiles()) {
      expect(scannableSource(path).toLowerCase(), path).not.toContain('20% off');
    }
  });

  it('never mentions a card hold of any amount anywhere in the package', () => {
    for (const path of sourceFiles()) {
      const source = scannableSource(path).toLowerCase();
      expect(source, path).not.toContain('$2 hold');
      expect(source, path).not.toContain('card hold');
      expect(source, path).not.toContain('verification hold');
      expect(source, path).not.toContain('temporary authorization');
      expect(source, path).not.toContain('temporary authorisation');
    }
  });

  it('never says "20% off" or claims a hold in the English billing catalog', () => {
    const catalog = en as Readonly<Record<string, string>>;
    for (const [key, value] of Object.entries(catalog)) {
      if (!key.startsWith('billing.')) {
        continue;
      }
      const lowered = value.toLowerCase();
      for (const phrase of FORBIDDEN_BILLING_PHRASES) {
        expect(lowered, `${key} contains "${phrase}"`).not.toContain(phrase.toLowerCase());
      }
    }
  });
});

describe('the annual framing', () => {
  it('states a saving in money, never a discount percentage', () => {
    expect(MANDATED_COPY.annualFraming).toBe('$25/month billed annually. Save $48/year.');
    expect(MANDATED_COPY.annualFraming).not.toContain('%');
    expect(MANDATED_COPY.annualFraming).not.toContain('off');
  });

  it('has arithmetic that holds up', () => {
    expect(PRICE_PRESENTATION.annualFraming.effectiveMonthlyMinor * 12).toBe(
      PRICE_PRESENTATION.year.priceMinor,
    );
    expect(PRICE_PRESENTATION.month.priceMinor * 12 - PRICE_PRESENTATION.year.priceMinor).toBe(
      PRICE_PRESENTATION.annualFraming.savingMinor,
    );
  });
});

describe('no em dashes in product visible billing copy', () => {
  it('keeps the mandated strings free of em dashes', () => {
    for (const value of Object.values(MANDATED_COPY)) {
      expect(value).not.toContain('—');
    }
  });

  it('keeps the English billing catalog free of em dashes', () => {
    const catalog = en as Readonly<Record<string, string>>;
    for (const [key, value] of Object.entries(catalog)) {
      if (key.startsWith('billing.')) {
        expect(value, key).not.toContain('—');
      }
    }
  });
});

describe('no media generation product exists', () => {
  it('bans every image and video meter name', () => {
    expect(FORBIDDEN_METER_NAMES).toContain('image_generation');
    expect(FORBIDDEN_METER_NAMES).toContain('video_generation');
  });

  it('never mentions image or video credits as something we sell', () => {
    for (const path of sourceFiles()) {
      const source = scannableSource(path).toLowerCase();
      expect(source, path).not.toContain('image credit');
      expect(source, path).not.toContain('video credit');
    }
  });

  it('explains the boundary through the approved catalog key', () => {
    const catalog = en as Readonly<Record<string, string>>;
    expect(PRICE_PRESENTATION.mediaGenerationBoundaryKey).toBe(
      'billing.mediaGeneration.explanation',
    );
    expect(catalog[PRICE_PRESENTATION.mediaGenerationBoundaryKey]).toBeTypeOf('string');
  });
});
