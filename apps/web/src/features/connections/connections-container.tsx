'use client';

/**
 * Route entry for connections.
 *
 * The scope list per provider is authored here rather than fetched, because it
 * describes what Relay's own OAuth client asks for. Each entry is a scope the
 * provider names plus the catalog key for the sentence saying what it is used
 * for, so the pre-OAuth explainer is specific rather than a paraphrase of the
 * provider's consent screen.
 *
 * TODO(web): read this from `beginOAuth`, which already returns the scope list
 * the consent screen will show, once it is fetched before the handoff rather
 * than at it.
 */

import type { ReactNode } from 'react';
import { ConnectionsScreen } from './connections-screen';
import type { PermissionView } from './types';

const PERMISSIONS: Readonly<Record<string, readonly PermissionView[]>> = {
  x: [
    { scope: 'tweet.read', granted: false, purposeKey: 'web.connection.purpose.readPosts' },
    { scope: 'tweet.write', granted: false, purposeKey: 'web.connection.purpose.publish' },
    { scope: 'users.read', granted: false, purposeKey: 'web.connection.purpose.identity' },
    { scope: 'offline.access', granted: false, purposeKey: 'web.connection.purpose.refresh' },
  ],
  linkedin: [
    { scope: 'w_member_social', granted: false, purposeKey: 'web.connection.purpose.publish' },
    {
      scope: 'r_organization_social',
      granted: false,
      purposeKey: 'web.connection.purpose.analytics',
    },
    { scope: 'openid', granted: false, purposeKey: 'web.connection.purpose.identity' },
  ],
  instagram: [
    {
      scope: 'instagram_content_publish',
      granted: false,
      purposeKey: 'web.connection.purpose.publish',
    },
    {
      scope: 'instagram_manage_insights',
      granted: false,
      purposeKey: 'web.connection.purpose.analytics',
    },
    {
      scope: 'pages_show_list',
      granted: false,
      purposeKey: 'web.connection.purpose.chooseDestination',
    },
  ],
  facebook: [
    {
      scope: 'pages_manage_posts',
      granted: false,
      purposeKey: 'web.connection.purpose.publish',
    },
    {
      scope: 'pages_read_engagement',
      granted: false,
      purposeKey: 'web.connection.purpose.analytics',
    },
    {
      scope: 'pages_show_list',
      granted: false,
      purposeKey: 'web.connection.purpose.chooseDestination',
    },
  ],
  youtube: [
    {
      scope: 'youtube.upload',
      granted: false,
      purposeKey: 'web.connection.purpose.publish',
    },
    {
      scope: 'yt-analytics.readonly',
      granted: false,
      purposeKey: 'web.connection.purpose.analytics',
    },
  ],
  tiktok: [
    { scope: 'video.publish', granted: false, purposeKey: 'web.connection.purpose.publish' },
    { scope: 'user.info.basic', granted: false, purposeKey: 'web.connection.purpose.identity' },
  ],
  threads: [
    {
      scope: 'threads_content_publish',
      granted: false,
      purposeKey: 'web.connection.purpose.publish',
    },
    {
      scope: 'threads_basic',
      granted: false,
      purposeKey: 'web.connection.purpose.identity',
    },
  ],
  bluesky: [
    { scope: 'app-password', granted: false, purposeKey: 'web.connection.purpose.publish' },
  ],
};

export function ConnectionsContainer(): ReactNode {
  return (
    <ConnectionsScreen
      connectionHrefPattern="/connections/{id}"
      permissionsByProvider={PERMISSIONS}
    />
  );
}
