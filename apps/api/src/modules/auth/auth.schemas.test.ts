import { PLANNED_LOCALES, PUBLIC_LOCALE_CODES, RETIRED_LOCALE_CODES } from '@relay/i18n';
import { describe, expect, it } from 'vitest';

import { magicLinkSchema, passwordResetSchema, signUpSchema } from './auth.schemas';

const HASH = 'a'.repeat(64);

describe('authentication interface locale boundary', () => {
  it('accepts every public launch locale for email-driven auth flows', () => {
    for (const locale of PUBLIC_LOCALE_CODES) {
      expect(magicLinkSchema.safeParse({ identifier: 'owner@example.test', locale }).success).toBe(
        true,
      );
      expect(passwordResetSchema.safeParse({ identifier: 'owner@example.test', locale }).success).toBe(
        true,
      );
      expect(
        signUpSchema.safeParse({
          email: 'owner@example.test',
          password: 'a-secure-password',
          displayName: 'Owner',
          locale,
          timeZone: 'UTC',
          termsVersionHash: HASH,
          privacyVersionHash: HASH,
          acceptedTerms: true,
        }).success,
      ).toBe(true);
    }
  });

  it('rejects retired and planned locales before provider calls or redirects', () => {
    const unsupported = [...RETIRED_LOCALE_CODES, ...PLANNED_LOCALES.map((locale) => locale.bcp47)];
    expect(unsupported.length).toBeGreaterThan(0);

    for (const locale of unsupported) {
      expect(magicLinkSchema.safeParse({ identifier: 'owner@example.test', locale }).success).toBe(
        false,
      );
      expect(passwordResetSchema.safeParse({ identifier: 'owner@example.test', locale }).success).toBe(
        false,
      );
      expect(
        signUpSchema.safeParse({
          email: 'owner@example.test',
          password: 'a-secure-password',
          displayName: 'Owner',
          locale,
          timeZone: 'UTC',
          termsVersionHash: HASH,
          privacyVersionHash: HASH,
          acceptedTerms: true,
        }).success,
      ).toBe(false);
    }
  });

});
