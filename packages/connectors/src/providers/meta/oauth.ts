import {
  REMEDIATION,
  SecretValue,
  providerFailure,
  refreshOAuth2Token,
  type AuthorizationDefinition,
  type ConnectorDeps,
  type CredentialResult,
  type OAuthScopeDefinition,
} from '../shared/contract-shape';
import {
  FACEBOOK_OAUTH_BASE,
  GRAPH_BASE,
  THREADS_GRAPH_BASE,
  THREADS_OAUTH_BASE,
  metaLongLivedTokenSchema,
  type MetaSurface,
} from './graph';

/**
 * Meta OAuth, shared by Instagram, Facebook Pages and Threads.
 *
 * Instagram and Facebook Pages sit on one Meta Login app and one permission review pass.
 * Threads uses a separate authorization host and a separate permission set, which is why
 * its definition is built here rather than copied.
 *
 * Meta long lived user tokens are exchanged rather than refreshed with a refresh token, so
 * `refreshMetaCredential` uses the `fb_exchange_token` grant. Threads uses a documented
 * refresh endpoint instead.
 */

const FACEBOOK_TOKEN_URL = `${GRAPH_BASE}/oauth/access_token`;
const THREADS_TOKEN_URL = `${THREADS_GRAPH_BASE}/oauth/access_token`;
const THREADS_REFRESH_URL = `${THREADS_GRAPH_BASE}/refresh_access_token`;

/**
 * Instagram publishing permissions. Every one of these is requested because a shipped
 * screen uses it; a permission for a future feature is a review rejection.
 */
export const INSTAGRAM_SCOPES: readonly OAuthScopeDefinition[] = Object.freeze([
  {
    scope: 'instagram_basic',
    explanationKey: 'connectors.instagram.scope.instagram_basic',
    usedBy: ['connections', 'composer'],
    required: true,
  },
  {
    scope: 'instagram_content_publish',
    explanationKey: 'connectors.instagram.scope.instagram_content_publish',
    usedBy: ['composer', 'queue'],
    required: true,
  },
  {
    scope: 'instagram_manage_insights',
    explanationKey: 'connectors.instagram.scope.instagram_manage_insights',
    usedBy: ['analytics'],
    required: false,
  },
  {
    scope: 'instagram_manage_comments',
    explanationKey: 'connectors.instagram.scope.instagram_manage_comments',
    usedBy: ['composer'],
    required: false,
  },
  {
    scope: 'pages_show_list',
    explanationKey: 'connectors.instagram.scope.pages_show_list',
    usedBy: ['connections'],
    required: true,
  },
  {
    scope: 'pages_read_engagement',
    explanationKey: 'connectors.instagram.scope.pages_read_engagement',
    usedBy: ['connections', 'analytics'],
    required: true,
  },
  {
    scope: 'business_management',
    explanationKey: 'connectors.instagram.scope.business_management',
    usedBy: ['connections'],
    required: false,
  },
]);

export const FACEBOOK_SCOPES: readonly OAuthScopeDefinition[] = Object.freeze([
  {
    scope: 'pages_show_list',
    explanationKey: 'connectors.facebook.scope.pages_show_list',
    usedBy: ['connections'],
    required: true,
  },
  {
    scope: 'pages_manage_posts',
    explanationKey: 'connectors.facebook.scope.pages_manage_posts',
    usedBy: ['composer', 'queue'],
    required: true,
  },
  {
    scope: 'pages_read_engagement',
    explanationKey: 'connectors.facebook.scope.pages_read_engagement',
    usedBy: ['connections', 'analytics'],
    required: true,
  },
  {
    scope: 'pages_manage_engagement',
    explanationKey: 'connectors.facebook.scope.pages_manage_engagement',
    usedBy: ['composer'],
    required: false,
  },
  {
    scope: 'read_insights',
    explanationKey: 'connectors.facebook.scope.read_insights',
    usedBy: ['analytics'],
    required: false,
  },
  {
    scope: 'business_management',
    explanationKey: 'connectors.facebook.scope.business_management',
    usedBy: ['connections'],
    required: false,
  },
]);

export const THREADS_SCOPES: readonly OAuthScopeDefinition[] = Object.freeze([
  {
    scope: 'threads_basic',
    explanationKey: 'connectors.threads.scope.threads_basic',
    usedBy: ['connections', 'composer'],
    required: true,
  },
  {
    scope: 'threads_content_publish',
    explanationKey: 'connectors.threads.scope.threads_content_publish',
    usedBy: ['composer', 'queue'],
    required: true,
  },
  {
    scope: 'threads_manage_replies',
    explanationKey: 'connectors.threads.scope.threads_manage_replies',
    usedBy: ['composer'],
    required: false,
  },
  {
    scope: 'threads_manage_insights',
    explanationKey: 'connectors.threads.scope.threads_manage_insights',
    usedBy: ['analytics'],
    required: false,
  },
]);

export function metaAuthorization(surface: MetaSurface): AuthorizationDefinition {
  if (surface === 'threads') {
    return {
      // Threads issues a short lived token that is exchanged for a long lived one, with a
      // dedicated refresh endpoint. It is not a PKCE flow.
      flavor: 'oauth2_client_credentials_exchange',
      authorizeUrl: THREADS_OAUTH_BASE,
      tokenUrl: THREADS_TOKEN_URL,
      // Threads exposes no revoke endpoint. Disconnect deletes our stored credential and
      // the connect screen tells the user how to remove the app on Threads.
      revokeUrl: null,
      redirectPath: '/oauth/threads/callback',
      scopes: [...THREADS_SCOPES],
      pkceRequired: false,
      multiStep: false,
      stepDescriptionKeys: ['connectors.threads.authorization_note'],
      supportsRefresh: true,
      refreshAtLifetimeFraction: 0.75,
      extraAuthorizeParameters: {},
    };
  }
  return {
    // Meta exchanges the short lived user token for a long lived one rather than issuing
    // a refresh token, which is what this flavor names.
    flavor: 'oauth2_client_credentials_exchange',
    authorizeUrl: FACEBOOK_OAUTH_BASE,
    tokenUrl: FACEBOOK_TOKEN_URL,
    revokeUrl: `${GRAPH_BASE}/me/permissions`,
    redirectPath:
      surface === 'instagram' ? '/oauth/instagram/callback' : '/oauth/facebook/callback',
    scopes: surface === 'instagram' ? [...INSTAGRAM_SCOPES] : [...FACEBOOK_SCOPES],
    pkceRequired: false,
    // Meta returns a user token from which we exchange Page tokens, and for Instagram we
    // then walk Pages to their linked professional account.
    multiStep: true,
    stepDescriptionKeys: [
      surface === 'instagram'
        ? 'connectors.instagram.authorization_note'
        : 'connectors.facebook.authorization_note',
    ],
    supportsRefresh: true,
    refreshAtLifetimeFraction: 0.75,
    extraAuthorizeParameters: {},
  };
}

/**
 * Exchange a short lived Meta user token for a long lived one. Meta does not issue a
 * refresh token for the Facebook family, so "refresh" is an exchange of the current token.
 */
export async function refreshMetaCredential(
  deps: ConnectorDeps,
  surface: MetaSurface,
  currentToken: string,
): Promise<CredentialResult> {
  const appId = deps.config.providers.meta.appId;
  const appSecret = deps.config.providers.meta.appSecret;
  if (appId === undefined || appSecret === undefined) {
    throw providerFailure({
      provider: surface,
      operation: `${surface}.refresh_credential`,
      remediationCode: REMEDIATION.contactSupport,
      details: { missingConfig: 'META_APP_ID, META_APP_SECRET' },
    });
  }

  if (surface === 'threads') {
    // Threads documents a dedicated refresh endpoint for long lived tokens.
    return refreshOAuth2Token({
      http: deps.http,
      clock: deps.clock,
      provider: surface,
      tokenUrl: THREADS_REFRESH_URL,
      clientId: appId,
      clientSecret: appSecret,
      refreshToken: currentToken,
      extraForm: { grant_type: 'th_refresh_token' },
      basicAuth: false,
    });
  }

  const response = await deps.http.request({
    method: 'GET',
    url: FACEBOOK_TOKEN_URL,
    query: {
      grant_type: 'fb_exchange_token',
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: currentToken,
    },
    accept: 'json',
    provider: surface,
    operation: `${surface}.exchange_long_lived_token`,
  });
  if (!response.ok) {
    throw providerFailure({
      provider: surface,
      operation: `${surface}.exchange_long_lived_token`,
      response,
      remediationCode: REMEDIATION.reconnectAccount,
    });
  }
  const parsed = metaLongLivedTokenSchema.parse(response.body);
  const expiresIn = parsed.expires_in;
  const obtainedAt = deps.clock.now();
  return {
    accessToken: new SecretValue(parsed.access_token, 'access_token'),
    // Meta issues no refresh token for the Facebook family: the exchange above is the
    // whole refresh story, so there is nothing rotated to store alongside it.
    refreshToken: null,
    tokenType: parsed.token_type ?? 'bearer',
    expiresAt:
      expiresIn === undefined
        ? null
        : new Date(obtainedAt.getTime() + expiresIn * 1000).toISOString(),
    grantedScopes: [],
    refreshTokenRotated: false,
    obtainedAt: obtainedAt.toISOString(),
  };
}
