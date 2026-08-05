import {
  REMEDIATION,
  providerFailure,
  refreshOAuth2Token,
  type AuthorizationDefinition,
  type ConnectorDeps,
  type CredentialResult,
  type OAuthScopeDefinition,
} from '../shared/contract-shape.js';
import {
  FACEBOOK_OAUTH_BASE,
  GRAPH_BASE,
  THREADS_GRAPH_BASE,
  THREADS_OAUTH_BASE,
  metaLongLivedTokenSchema,
  type MetaSurface,
} from './graph.js';

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
    descriptionKey: 'connectors.instagram.scope.instagram_basic',
  },
  {
    scope: 'instagram_content_publish',
    descriptionKey: 'connectors.instagram.scope.instagram_content_publish',
  },
  {
    scope: 'instagram_manage_insights',
    descriptionKey: 'connectors.instagram.scope.instagram_manage_insights',
  },
  {
    scope: 'instagram_manage_comments',
    descriptionKey: 'connectors.instagram.scope.instagram_manage_comments',
  },
  { scope: 'pages_show_list', descriptionKey: 'connectors.instagram.scope.pages_show_list' },
  {
    scope: 'pages_read_engagement',
    descriptionKey: 'connectors.instagram.scope.pages_read_engagement',
  },
  { scope: 'business_management', descriptionKey: 'connectors.instagram.scope.business_management' },
]);

export const FACEBOOK_SCOPES: readonly OAuthScopeDefinition[] = Object.freeze([
  { scope: 'pages_show_list', descriptionKey: 'connectors.facebook.scope.pages_show_list' },
  {
    scope: 'pages_manage_posts',
    descriptionKey: 'connectors.facebook.scope.pages_manage_posts',
  },
  {
    scope: 'pages_read_engagement',
    descriptionKey: 'connectors.facebook.scope.pages_read_engagement',
  },
  {
    scope: 'pages_manage_engagement',
    descriptionKey: 'connectors.facebook.scope.pages_manage_engagement',
  },
  { scope: 'read_insights', descriptionKey: 'connectors.facebook.scope.read_insights' },
  { scope: 'business_management', descriptionKey: 'connectors.facebook.scope.business_management' },
]);

export const THREADS_SCOPES: readonly OAuthScopeDefinition[] = Object.freeze([
  { scope: 'threads_basic', descriptionKey: 'connectors.threads.scope.threads_basic' },
  {
    scope: 'threads_content_publish',
    descriptionKey: 'connectors.threads.scope.threads_content_publish',
  },
  { scope: 'threads_manage_replies', descriptionKey: 'connectors.threads.scope.threads_manage_replies' },
  { scope: 'threads_manage_insights', descriptionKey: 'connectors.threads.scope.threads_manage_insights' },
]);

export function metaAuthorization(surface: MetaSurface): AuthorizationDefinition {
  if (surface === 'threads') {
    return {
      flavor: 'oauth2_code',
      authorizeUrl: THREADS_OAUTH_BASE,
      tokenUrl: THREADS_TOKEN_URL,
      // Threads exposes no revoke endpoint. Disconnect deletes our stored credential and
      // the connect screen tells the user how to remove the app on Threads.
      revokeUrl: null,
      requiresPkce: false,
      multiStep: false,
      redirectPath: '/oauth/threads/callback',
      scopes: THREADS_SCOPES,
      notesKey: 'connectors.threads.authorization_note',
    };
  }
  return {
    flavor: 'oauth2_code',
    authorizeUrl: FACEBOOK_OAUTH_BASE,
    tokenUrl: FACEBOOK_TOKEN_URL,
    revokeUrl: `${GRAPH_BASE}/me/permissions`,
    requiresPkce: false,
    // Meta returns a user token from which we exchange Page tokens, and for Instagram we
    // then walk Pages to their linked professional account.
    multiStep: true,
    redirectPath: surface === 'instagram' ? '/oauth/instagram/callback' : '/oauth/facebook/callback',
    scopes: surface === 'instagram' ? INSTAGRAM_SCOPES : FACEBOOK_SCOPES,
    notesKey:
      surface === 'instagram'
        ? 'connectors.instagram.authorization_note'
        : 'connectors.facebook.authorization_note',
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
      remediationKey: REMEDIATION.contactSupport,
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
      remediationKey: REMEDIATION.reconnectAccount,
    });
  }
  const parsed = metaLongLivedTokenSchema.parse(response.body);
  const expiresIn = parsed.expires_in;
  return {
    accessToken: parsed.access_token,
    refreshToken: null,
    expiresAt:
      expiresIn === undefined
        ? null
        : new Date(deps.clock.now().getTime() + expiresIn * 1000).toISOString(),
    scopes: [],
  };
}
