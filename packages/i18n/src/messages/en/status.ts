/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'Nothing scheduled yet',
  'empty.calendar.body': 'Write your first post and pick a time. You can change it later.',
  'empty.calendar.action': 'Compose a post',
  'empty.drafts.title': 'No drafts',
  'empty.drafts.body': 'Drafts you save appear here with their targets and issues.',
  'empty.connections.title': 'No accounts connected',
  'empty.connections.body':
    'Connect an account to publish to it. We show you the exact permissions first.',
  'empty.connections.action': 'Connect an account',
  'empty.analytics.title': 'No metrics yet',
  'empty.analytics.body':
    'Metrics appear after your first post has been live long enough for the platform to report on it.',
  'empty.analytics.noPermission':
    'This account has not granted analytics access. Reconnect to add it.',
  'empty.approvals.title': 'Nothing waiting on you',
  'empty.approvals.body': 'Approval requests for your brands appear here.',
  'empty.library.title': 'Your library is empty',
  'empty.library.body': 'Upload images and video, or import them from a URL or the API.',
  'empty.library.action': 'Upload media',
  'empty.automation.title': 'No rules yet',
  'empty.automation.body':
    'A rule reacts to something and proposes an action. Every rule shows its limits before you switch it on.',
  'empty.webhooks.title': 'No endpoints',
  'empty.webhooks.body': 'Add an endpoint to receive signed events about publishing and connections.',
  'empty.searchResults.title': 'No results for {query}',
  'empty.searchResults.body': 'Check the spelling, or clear a filter.',
  'empty.filtered.title': 'Nothing matches these filters',
  'empty.filtered.action': 'Clear filters',
  'empty.auditLog.title': 'No activity yet',
  'empty.receipts.title': 'No receipts yet',
  'empty.receipts.body': 'Every publication produces a receipt you can inspect and share.',

  'loading.default': 'Loading',
  'loading.calendar': 'Loading your calendar',
  'loading.analytics': 'Loading metrics',
  'loading.preview': 'Building the preview',
  'loading.validating': 'Checking against current platform limits',
  'loading.publishing': 'Publishing to {provider}',
  'loading.uploading': 'Uploading {name}',
  'loading.uploadProgress': '{percent} uploaded',
  'loading.connecting': 'Connecting to {provider}',
  'loading.savingDraft': 'Saving your draft',
  'loading.generatingPlan': 'Building your plan',
  'loading.longRunning': 'This is taking longer than usual. It is still running.',

  'offline.banner': 'You are offline. Changes are kept on this device.',
  'offline.draftSafe': 'Your draft is safe. It syncs when you are back online.',
  'offline.publishDisabled': 'Publishing needs a connection. This will not be queued silently.',
  'offline.scheduleQueued':
    'This schedule request is queued on this device and will be sent when you are back online.',
  'offline.reconnected': 'Back online. Syncing your changes.',
  'offline.syncConflict':
    'Some changes could not be merged automatically. Review them before saving.',

  'permission.denied.title': 'You do not have access to this',
  'permission.denied.role': 'This needs the {role} role. You are {currentRole}.',
  'permission.denied.scope': 'This credential needs the scope {scope}.',
  'permission.denied.contactOwner': 'Ask {owner} to grant it.',
  'permission.denied.brandScope': 'Your access is limited to {brands}.',
  'permission.readOnly': 'This workspace is read only right now.',
  'permission.mfaRequired': 'Confirm with two factor authentication to continue.',

  'rateLimit.title': 'Slow down for a moment',
  'rateLimit.body': 'You have made {count} requests in {window}. The limit is {limit}.',
  'rateLimit.resetsAt': 'This resets at {time}.',
  'rateLimit.cheaperAlternative': 'Scheduling instead of publishing now avoids this limit.',
  'rateLimit.providerCost':
    '{provider} charges per operation. This action is estimated at {amount}.',

  'incident.providerDegraded': '{provider} is having problems. Scheduled posts keep retrying.',
  'incident.providerDown': '{provider} is unavailable. Nothing is lost and nothing is duplicated.',
  'incident.isolated': 'Other platforms are unaffected.',
  'incident.statusPage': 'Live status by connector and surface',
  'incident.startedAt': 'Started {relativeTime}',

  'translation.incomplete':
    'Some text on this screen is not translated into {language} yet and is shown in English.',
  'translation.beta': 'This language is in beta. Report anything that reads wrong.',

  'confirm.discardChanges.title': 'Discard your changes?',
  'confirm.discardChanges.body': 'This cannot be undone.',
  'confirm.deleteItem.title': 'Delete {name}?',
  'confirm.deleteItem.body': 'This cannot be undone.',
  'confirm.cancelScheduled.title': 'Cancel this scheduled post?',
  'confirm.cancelScheduled.body':
    'It will not publish. The draft stays here so you can schedule it again.',
  'confirm.publishNow.title': 'Publish now?',
  'confirm.publishNow.body':
    '{count, plural, one {This publishes to # account immediately} other {This publishes to # accounts immediately}}. It cannot be recalled from Relay.',
  'confirm.typeToConfirm': 'Type {word} to confirm.',
} as const;
