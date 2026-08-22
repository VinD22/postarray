/**
 * What Relay asks each provider for, and what it actually got.
 *
 * The requested list is authored here rather than fetched, because it describes
 * what Relay's own OAuth client asks for: the scope the provider names, plus
 * the catalog key for the sentence saying what it is used for. That sentence is
 * the point. A scope list without purposes is a compliance artefact.
 *
 * What is deliberately *not* authored here is whether a scope was granted. That
 * is a fact about one connected account and it comes from
 * `connection.grantedScopes`, which the API reads from
 * `app.social_connections.granted_scopes`. Where Relay has no record of the
 * grant the answer is `unknown`, never `not_granted`: a false negative here
 * puts a wall of warnings on a perfectly healthy account, which reads to a
 * non-technical user as "my account is broken".
 *
 * TODO(web): `beginOAuth` also returns the scope list the consent screen will
 * show. Once it is fetched before the handoff rather than at it, the connect
 * dialog should prefer that response over this table.
 */

import type { PermissionState, PermissionView, RequestedScope } from './types';

export const REQUESTED_SCOPES: Readonly<Record<string, readonly RequestedScope[]>> = {
  x: [
    { scope: 'tweet.read', purposeKey: 'web.connection.purpose.readPosts' },
    { scope: 'tweet.write', purposeKey: 'web.connection.purpose.publish' },
    { scope: 'users.read', purposeKey: 'web.connection.purpose.identity' },
    { scope: 'offline.access', purposeKey: 'web.connection.purpose.refresh' },
  ],
  linkedin: [
    { scope: 'w_member_social', purposeKey: 'web.connection.purpose.publish' },
    { scope: 'r_organization_social', purposeKey: 'web.connection.purpose.analytics' },
    { scope: 'openid', purposeKey: 'web.connection.purpose.identity' },
  ],
  instagram: [
    { scope: 'instagram_content_publish', purposeKey: 'web.connection.purpose.publish' },
    { scope: 'instagram_manage_insights', purposeKey: 'web.connection.purpose.analytics' },
    { scope: 'pages_show_list', purposeKey: 'web.connection.purpose.chooseDestination' },
  ],
  facebook: [
    { scope: 'pages_manage_posts', purposeKey: 'web.connection.purpose.publish' },
    { scope: 'pages_read_engagement', purposeKey: 'web.connection.purpose.analytics' },
    { scope: 'pages_show_list', purposeKey: 'web.connection.purpose.chooseDestination' },
  ],
  youtube: [
    { scope: 'youtube.upload', purposeKey: 'web.connection.purpose.publish' },
    { scope: 'yt-analytics.readonly', purposeKey: 'web.connection.purpose.analytics' },
  ],
  tiktok: [
    { scope: 'video.publish', purposeKey: 'web.connection.purpose.publish' },
    { scope: 'user.info.basic', purposeKey: 'web.connection.purpose.identity' },
  ],
  threads: [
    { scope: 'threads_content_publish', purposeKey: 'web.connection.purpose.publish' },
    { scope: 'threads_basic', purposeKey: 'web.connection.purpose.identity' },
  ],
  bluesky: [{ scope: 'app-password', purposeKey: 'web.connection.purpose.publish' }],
  mastodon: [
    { scope: 'read', purposeKey: 'web.connection.purpose.identity' },
    { scope: 'write:statuses', purposeKey: 'web.connection.purpose.publish' },
  ],
  telegram: [{ scope: 'bot', purposeKey: 'web.connection.purpose.publish' }],
  reddit: [
    { scope: 'identity', purposeKey: 'web.connection.purpose.identity' },
    { scope: 'submit', purposeKey: 'web.connection.purpose.publish' },
    { scope: 'mysubreddits', purposeKey: 'web.connection.purpose.chooseDestination' },
  ],
  wordpress: [{ scope: 'posts', purposeKey: 'web.connection.purpose.publish' }],
  medium: [
    { scope: 'basicProfile', purposeKey: 'web.connection.purpose.identity' },
    { scope: 'publishPost', purposeKey: 'web.connection.purpose.publish' },
  ],
  devto: [{ scope: 'article', purposeKey: 'web.connection.purpose.publish' }],
  pinterest: [
    { scope: 'user_accounts:read', purposeKey: 'web.connection.purpose.identity' },
    { scope: 'boards:read', purposeKey: 'web.connection.purpose.chooseDestination' },
    { scope: 'pins:read', purposeKey: 'web.connection.purpose.readPosts' },
    { scope: 'pins:write', purposeKey: 'web.connection.purpose.publish' },
  ],
  discord: [{ scope: 'bot', purposeKey: 'web.connection.purpose.publish' }],
  slack: [
    { scope: 'users:read', purposeKey: 'web.connection.purpose.identity' },
    { scope: 'channels:read', purposeKey: 'web.connection.purpose.chooseDestination' },
    { scope: 'chat:write', purposeKey: 'web.connection.purpose.publish' },
  ],
};

/**
 * Resolve one account's permission table.
 *
 * `grantedScopes === null` means Relay has no record of what the provider
 * granted. Every row is then `unknown`. It is not `not_granted`, and nothing
 * downstream may count it as missing.
 */
export function buildPermissions(
  provider: string,
  grantedScopes: readonly string[] | null,
): readonly PermissionView[] {
  const requested = REQUESTED_SCOPES[provider] ?? [];
  if (grantedScopes === null) {
    return requested.map((entry) => ({ ...entry, state: 'unknown' as PermissionState }));
  }
  const granted = new Set(grantedScopes);
  return requested.map((entry) => ({
    ...entry,
    state: granted.has(entry.scope) ? ('granted' as const) : ('not_granted' as const),
  }));
}
