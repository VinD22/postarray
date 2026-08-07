import { describe, expect, it } from 'vitest';

import { createOAuthAppSchema, updateOAuthAppSchema } from './developer-apps.schemas';

const identity = {
  name: 'Partner console',
  clientType: 'confidential' as const,
  homepageUrl: 'https://partner.example',
  privacyPolicyUrl: 'https://partner.example/privacy',
  termsUrl: 'https://partner.example/terms',
  supportEmail: 'support@partner.example',
  logoUrl: null,
  redirectUris: ['https://partner.example/callback'],
  allowedScopes: ['accounts:read'] as const,
};

describe('developer app schemas', () => {
  it('requires the consent identity when registering an app', () => {
    expect(createOAuthAppSchema.parse(identity)).toEqual(identity);
  });

  it('allows an app to move from sandbox to active or disabled', () => {
    expect(updateOAuthAppSchema.parse({ status: 'active' })).toEqual({ status: 'active' });
    expect(updateOAuthAppSchema.parse({ status: 'disabled' })).toEqual({ status: 'disabled' });
  });

  it('rejects undocumented update fields', () => {
    expect(updateOAuthAppSchema.safeParse({ rateLimitPerHour: 5000 }).success).toBe(false);
  });
});
