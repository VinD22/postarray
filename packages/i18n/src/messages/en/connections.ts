/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'Connections',
  'connection.subtitle': 'The accounts, Pages and channels this workspace can publish to.',
  'connection.add': 'Connect an account',
  'connection.count': '{used, plural, one {# active channel} other {# active channels}} of {limit}',
  'connection.limitReached':
    'This workspace is using all {limit} channels. Disconnect one before connecting another.',

  'connection.account.label': 'Account',
  'connection.account.type.profile': 'Profile',
  'connection.account.type.page': 'Page',
  'connection.account.type.channel': 'Channel',
  'connection.account.type.group': 'Group',
  'connection.account.type.organization': 'Organization',
  'connection.account.type.business': 'Business account',
  'connection.account.type.creator': 'Creator account',
  'connection.connectedBy': 'Connected by {name} on {date}',
  'connection.lastPublished': 'Last published {relativeTime}',
  'connection.lastPublishedNever': 'Nothing published from this account yet',
  'connection.lastAnalyticsSync': 'Analytics synced {relativeTime}',

  'connection.status.healthy': 'Working',
  'connection.status.expiringSoon': 'Expires {relativeTime}',
  'connection.status.expired': 'Access expired',
  'connection.status.revoked': 'Access revoked',
  'connection.status.paused': 'Paused',
  'connection.status.permissionMissing': 'Missing permission',
  'connection.status.reviewPending': 'Waiting on platform review',
  'connection.status.unknown': 'Health unavailable',

  'connection.token.expiresAt': 'Access expires {date}',
  'connection.token.expiryUnknown': '{provider} does not tell us when this access expires.',

  'connection.permissions.title': 'Permissions',
  'connection.permissions.granted': 'Granted',
  'connection.permissions.missing': 'Not granted',
  'connection.permissions.explainBeforeOAuth':
    'Relay will ask {provider} for these permissions. You can disconnect at any time.',
  'connection.permissions.whyNeeded': 'Why this is needed',

  'connection.reconnect.title': 'Reconnect {account}',
  'connection.reconnect.body':
    'Scheduled posts for this account are on hold until it is reconnected. Nothing is lost.',
  'connection.disconnect.title': 'Disconnect {account}?',
  'connection.disconnect.body':
    'Scheduled posts for this account will not publish. Receipts and analytics already collected stay in this workspace.',
  'connection.pause.body':
    'A paused account keeps its history and its schedule, but does not publish until you resume it.',

  'connection.incident.invalidToken':
    '{provider} rejected the stored access for {account}. Reconnect to restore publishing.',
  'connection.incident.permissionLost':
    '{account} no longer grants {permission}. Reconnect and accept that permission.',
  'connection.incident.roleLost':
    'Your {provider} user no longer has a role on {account}. Ask an admin of that Page to restore it.',
  'connection.incident.accountTypeInvalid':
    'Instagram needs a professional account. Switch {account} to a business or creator account, then reconnect.',
  'connection.incident.reviewRestricted':
    '{provider} has restricted this app pending review. Posts from {account} publish privately until review completes.',

  'connection.group.title': 'Customer groups',
  'connection.group.description': 'Group accounts by client or brand to filter every screen.',
  'connection.group.assign': 'Move to group',
  'connection.group.none': 'Ungrouped',
  'connection.group.moveNote': 'Moving an account keeps its posts, receipts and analytics.',

  'connection.oauth.starting': 'Opening {provider}',
  'connection.oauth.returned': 'Finishing the connection',
  'connection.oauth.chooseAccounts': 'Choose which accounts to connect',
  'connection.oauth.noEligibleAccounts':
    'No accounts on this {provider} login can be connected. {reason}',
  'connection.oauth.canceled': 'The connection was canceled on {provider}. Nothing changed.',
  'connection.oauth.alreadyConnected': '{account} is already connected to this workspace.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} is connected to another workspace. Disconnect it there first.',

  'capability.title': 'What this account supports',
  'capability.matrix.title': 'Platform capabilities',
  'capability.matrix.subtitle':
    'Generated from the connector definitions we maintain and reviewed by hand.',
  'capability.level.supported': 'Supported',
  'capability.level.unsupported': 'Not offered by the platform',
  'capability.level.not_implemented': 'Not built yet',
  'capability.level.requires_review': 'Needs platform review',
  'capability.level.beta': 'Beta',
  'capability.level.unknown': 'Unavailable',
  'capability.explain.supported': 'Relay can do this for this account today.',
  'capability.explain.unsupported':
    '{provider} does not offer this through its official API, so no tool can do it safely.',
  'capability.explain.not_implemented':
    '{provider} offers this, but Relay has not built it yet. It is on the connector roadmap.',
  'capability.explain.requires_review':
    '{provider} grants this only after it reviews the app or the account. It stays unavailable until that review passes.',
  'capability.explain.beta':
    'This works, with limits we have not finished verifying. Check the result before you rely on it.',
  'capability.explain.unknown':
    'We could not read the current permissions for this account. Reconnect to refresh them.',
  'capability.lastChecked': 'Checked {relativeTime}',
  'capability.feature.text': 'Text posts',
  'capability.feature.image': 'Images',
  'capability.feature.carousel': 'Carousels',
  'capability.feature.video': 'Video',
  'capability.feature.document': 'Documents',
  'capability.feature.firstComment': 'Scheduled first comment',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'Native mentions',
  'capability.feature.destinations': 'Destination selection',
  'capability.feature.privacy': 'Privacy controls',
  'capability.feature.thumbnail': 'Custom thumbnail',
  'capability.feature.altText': 'Alt text',
  'capability.feature.analytics': 'Analytics',
  'capability.feature.delete': 'Delete a published post',
  'capability.feature.commentCount': 'Comment counts',
  'capability.feature.commentReplies': 'Reading and replying to comments',
  'capability.feature.disclosure': 'Automation disclosure',
} as const;
