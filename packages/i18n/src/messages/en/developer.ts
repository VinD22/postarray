/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Agents and API',
  'developer.subtitle':
    'The API, the MCP server and the CLI use the same permissions, approval policy and receipts as the app.',

  'developer.serviceAccount.title': 'Service accounts',
  'developer.serviceAccount.create': 'Create a service account',
  'developer.serviceAccount.name': 'Name',
  'developer.serviceAccount.scopeProjects': 'Projects and accounts it can use',
  'developer.serviceAccount.scopePlatforms': 'Platforms',
  'developer.serviceAccount.scopeLocales': 'Content languages',
  'developer.serviceAccount.scopeDomains': 'Allowed link domains',
  'developer.serviceAccount.scopeHours': 'Allowed hours',
  'developer.serviceAccount.scopeCadence': 'Maximum posts per day',
  'developer.serviceAccount.scopeLookAhead': 'How far ahead it may schedule',
  'developer.serviceAccount.approvalLevel': 'Approval level',
  'developer.serviceAccount.killSwitch': 'Stop this agent',

  'developer.approvalLevel.0': 'Read and validate only',
  'developer.approvalLevel.1': 'Create and edit drafts',
  'developer.approvalLevel.2': 'Schedule inside the limits set above',
  'developer.approvalLevel.3': 'Ask a person before publishing',
  'developer.approvalLevel.description.0':
    'The agent can look at accounts, capabilities, calendars and analytics. It changes nothing.',
  'developer.approvalLevel.description.1':
    'The agent can write drafts. A person still schedules and publishes.',
  'developer.approvalLevel.description.2':
    'The agent can schedule within the accounts, hours, cadence, languages, domains and look ahead you set. Anything outside those limits needs a person.',
  'developer.approvalLevel.description.3':
    'Immediate publishing, a new account or domain, a bulk action, sensitive content or a changed privacy setting always needs an explicit confirmation from a person.',
  'developer.bulkThreshold':
    'Bulk means more than {publications, plural, one {# external publication} other {# external publications}} in one request, or the same content to more than {accounts, plural, one {# account} other {# accounts}}.',

  'developer.credential.title': 'Credentials',
  'developer.credential.create': 'Create an API key',
  'developer.credential.shownOnce':
    'This credential is shown once. Copy it now. We store only a hash of it.',
  'developer.credential.prefix': 'Prefix',
  'developer.credential.created': 'Created {date} by {name}',
  'developer.credential.lastUsed': 'Last used {relativeTime}',
  'developer.credential.neverUsed': 'Never used',
  'developer.credential.expires': 'Expires {date}',
  'developer.credential.revokeConfirm':
    'Revoke this credential? Anything using it stops working immediately.',

  'developer.scope.title': 'Scopes',
  'developer.scope.accountsRead': 'Read connected accounts and their capabilities',
  'developer.scope.draftsWrite': 'Create and edit drafts',
  'developer.scope.postsSchedule': 'Schedule approved content',
  'developer.scope.postsPublish': 'Publish immediately',
  'developer.scope.analyticsRead': 'Read analytics',
  'developer.scope.receiptsRead': 'Read publication receipts',
  'developer.scope.webhooksWrite': 'Manage webhooks',
  'developer.scope.connectionsAdmin': 'Connect and disconnect accounts',
  'developer.scope.billingRead': 'Read billing state',
  'developer.scope.consequential': 'Consequential',
  'developer.scope.readOnly': 'Read only',

  'developer.setup.title': 'Connect a client',
  'developer.setup.claudeCode': 'Claude Code',
  'developer.setup.codex': 'Codex',
  'developer.setup.hermes': 'Hermes',
  'developer.setup.buzz': 'Buzz workflow',
  'developer.setup.cli': 'CLI',
  'developer.setup.genericMcp': 'Any MCP client',
  'developer.setup.copyConfig': 'Copy configuration',
  'developer.setup.mcpEndpoint': 'MCP endpoint',
  'developer.setup.apiBaseUrl': 'API base URL',

  'developer.playground.title': 'Dry run',
  'developer.playground.description':
    'Run tools against seeded data. Nothing reaches a real platform.',
  'developer.playground.run': 'Run',
  'developer.playground.sandboxBadge': 'Sandbox',

  'developer.activity.title': 'Recent activity',
  'developer.activity.toolCall': '{tool} called by {actor} {relativeTime}',
  'developer.activity.denied': 'Denied: {reason}',
  'developer.activity.empty': 'No calls yet.',
  'developer.activity.redacted': 'Request and response bodies are stored with secrets removed.',

  'developer.apps.title': 'Developer apps',
  'developer.apps.subtitle':
    'Let another product act through Relay with the permissions a user grants it.',
  'developer.apps.create': 'Register an app',
  'developer.apps.name': 'App name',
  'developer.apps.type.label': 'Client type',
  'developer.apps.type.public': 'Public, cannot keep a secret',
  'developer.apps.type.confidential': 'Confidential, runs on a server',
  'developer.apps.homepage': 'Homepage URL',
  'developer.apps.privacyUrl': 'Privacy policy URL',
  'developer.apps.termsUrl': 'Terms URL',
  'developer.apps.logo': 'Logo',
  'developer.apps.redirectUris': 'Redirect URIs',
  'developer.apps.redirectUrisHelp':
    'Exact matches only. Wildcards and partial paths are rejected.',
  'developer.apps.clientId': 'Client ID',
  'developer.apps.clientSecret': 'Client secret',
  'developer.apps.secretShownOnce':
    'The secret is shown once. Rotate it if you lose it. We will not show it again.',
  'developer.apps.status.draft': 'Draft',
  'developer.apps.status.active': 'Active',
  'developer.apps.status.disabled': 'Disabled',
  'developer.apps.consentPreview': 'Consent screen preview',
  'developer.apps.grants.title': 'Active grants',
  'developer.apps.grants.count': '{count, plural, one {# grant} other {# grants}}',
  'developer.apps.deleteConfirm':
    'Delete this app? Every grant is revoked and its tokens stop working.',

  'developer.consent.title': '{app} wants access to your workspace',
  'developer.consent.workspace': 'Workspace',
  'developer.consent.projects': 'Projects and accounts',
  'developer.consent.willBeAbleTo': '{app} will be able to',
  'developer.consent.willNotBeAbleTo': '{app} will not be able to',
  'developer.consent.approvalStillApplies':
    'Your approval policy still applies. This app cannot publish around it.',
  'developer.consent.revokeAnyTime': 'You can revoke this from Settings at any time.',
  'developer.consent.allow': 'Allow access',
  'developer.consent.deny': 'Do not allow',
  'developer.consent.developerIdentity': 'Published by {developer}',

  'developer.grants.title': 'Apps with access',
  'developer.grants.grantedOn': 'Granted {date}',
  'developer.grants.lastUsed': 'Last used {relativeTime}',
  'developer.grants.revoke': 'Revoke access',
  'developer.grants.revoked':
    'Access revoked. Your own connections and scheduled posts are not affected.',

  'developer.docs.openapi': 'OpenAPI document',
  'developer.docs.clients': 'Generated clients',
  'developer.docs.idempotency':
    'Send an idempotency key with every create, schedule and publish request. Repeating a request with the same key returns the original result instead of publishing twice.',
  'developer.docs.pagination':
    'Results are cursor paginated. Times are explicit and include a zone.',
  'developer.docs.rateLimits': 'Rate limits apply per workspace, credential, route and connector.',

  'developer.confirmation.title': 'Confirm agent publication',
  'developer.confirmation.subtitle':
    'Review the exact accounts and content version before an agent can publish anything.',
  'developer.confirmation.loading': 'Loading the publication confirmation',
  'developer.confirmation.errorTitle': 'This confirmation could not be loaded',
  'developer.confirmation.errorBody':
    'It may have expired, been used, or belong to another workspace. Nothing was published by this attempt.',
  'developer.confirmation.reviewTitle': 'One decision, exact blast radius',
  'developer.confirmation.reviewBody':
    'Approval applies only to this content version and these named accounts. Any change requires a new confirmation.',
  'developer.confirmation.state.pending': 'Awaiting your decision',
  'developer.confirmation.state.approved': 'Approved',
  'developer.confirmation.state.consumed': 'Used',
  'developer.confirmation.state.expired': 'Expired',
  'developer.confirmation.publicationsLabel': 'External publications',
  'developer.confirmation.publicationsValue':
    '{count, plural, one {# post to one account} other {# posts to # accounts}}',
  'developer.confirmation.providersLabel': 'Platforms',
  'developer.confirmation.expiresLabel': 'Decision expires',
  'developer.confirmation.versionLabel': 'Content version',
  'developer.confirmation.versionHint':
    'This checksum changes when the content changes, which cancels this approval.',
  'developer.confirmation.accountsTitle': 'Accounts that will receive a post',
  'developer.confirmation.accountPosition': '{position} of {count}',
  'developer.confirmation.pendingTitle': 'Nothing has been published yet',
  'developer.confirmation.pendingBody':
    'Approving lets the requesting agent continue once. It does not approve later edits or another set of accounts.',
  'developer.confirmation.approve': 'Approve this publication',
  'developer.confirmation.approvedTitle': 'Approved for this exact plan',
  'developer.confirmation.approvedBody':
    'Return to the agent. It can now continue this one publication request before the confirmation expires.',
  'developer.confirmation.consumedTitle': 'This approval was already used',
  'developer.confirmation.consumedBody':
    'The agent already continued with this decision. The publication receipt records what happened next.',
  'developer.confirmation.expiredTitle': 'This decision window has closed',
  'developer.confirmation.expiredBody':
    'Ask the agent to request a new confirmation. The old link cannot publish anything.',
  'developer.confirmation.stepUpTitle': 'Confirm it is you',
  'developer.confirmation.stepUpBody':
    'Re-enter your password. This authorizes sensitive actions in this session for ten minutes.',
  'developer.confirmation.passwordLabel': 'Current password',
  'developer.confirmation.verifyAndApprove': 'Verify and approve',
  'developer.confirmation.actionErrorTitle': 'The publication was not approved',
} as const;
