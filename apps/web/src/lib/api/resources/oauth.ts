import type { Scope } from '@relay/contracts';

import { call } from '../call';
import type { WorkspaceView } from '../types';

export interface OAuthConsentClientView {
  readonly name: string;
  readonly clientId: string;
  readonly homepageUrl: string;
  readonly privacyPolicyUrl: string;
  readonly termsUrl: string;
  readonly logoUrl: string | null;
  readonly firstParty: boolean;
}

export interface OAuthConsentScopeView {
  readonly scope: Scope;
  readonly risk: string;
  readonly descriptionKey: string;
}

export interface OAuthConsentView {
  readonly client: OAuthConsentClientView;
  readonly consentNonce: string;
  readonly workspaces: readonly WorkspaceView[];
  readonly scopes: readonly OAuthConsentScopeView[];
  readonly approvalLevelKey: string;
}

export interface OAuthConsentDecisionInput {
  readonly requestId: string;
  readonly consentNonce: string;
  readonly decision: 'approve' | 'deny';
  readonly workspaceId: string;
  readonly projectIds: readonly string[];
  readonly connectionIds: readonly string[];
  readonly grantedScopes: readonly Scope[];
  readonly consentVersionHash: string;
}

export interface OAuthConsentDecisionView {
  readonly redirectTo: string;
}

const demoWorkspace: WorkspaceView = {
  id: 'ws_demo0000000000000000001',
  name: 'Demo workspace',
  slug: 'demo-workspace',
  timeZone: 'UTC',
  locale: 'en',
  role: 'owner',
  readOnly: false,
  projectLimit: 3,
};

export const oauthApi = {
  getConsent: (requestId: string): Promise<OAuthConsentView> =>
    call(
      '/oauth/consent',
      { query: { request_id: requestId } },
      () => ({
        client: {
          name: 'Relay demo client',
          clientId: 'client_demo',
          homepageUrl: 'https://example.com',
          privacyPolicyUrl: 'https://example.com/privacy',
          termsUrl: 'https://example.com/terms',
          logoUrl: null,
          firstParty: false,
        },
        consentNonce: 'demo-consent-nonce',
        workspaces: [demoWorkspace],
        scopes: [
          { scope: 'accounts:read', risk: 'read', descriptionKey: 'scopes.accounts_read' },
          { scope: 'drafts:write', risk: 'reversible', descriptionKey: 'scopes.drafts_write' },
        ],
        approvalLevelKey: 'developer.consent.approval_level.level_2_scheduled',
      }),
    ),

  submitConsent: (
    input: OAuthConsentDecisionInput,
    idempotencyKey: string,
  ): Promise<OAuthConsentDecisionView> =>
    call(
      '/oauth/consent',
      { method: 'POST', body: input, idempotencyKey },
      () => ({ redirectTo: '/' }),
    ),
};
