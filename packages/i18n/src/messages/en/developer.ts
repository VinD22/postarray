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
  'developer.consent.notFirstParty': 'This app is not built by Relay.',
  'developer.consent.clientId': 'Client ID',
  'developer.consent.selectWorkspace': 'Choose the workspace this app can use',
  'developer.consent.workspaceHelp':
    'The app receives access only to the workspace you choose here.',
  'developer.consent.loading': 'Loading the access request',
  'developer.consent.missingRequest':
    'This access request is missing or has expired. Start the connection again from the app that sent you here.',
  'developer.consent.errorTitle': 'This access request could not be loaded',
  'developer.consent.errorBody':
    'Nothing has been granted. Try the connection again, or return to the app that sent you here.',
  'developer.consent.returning': 'Returning you to {app}',
  'developer.consent.approvalLevel': 'Approval policy: {level}',
  'developer.consent.approval_level.level_2_scheduled':
    'The app may schedule within your workspace limits. Publishing still needs the approval required by your workspace.',
  'developer.consent.submitting': 'Saving your choice',

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

  // CLI help is catalog copy too. Command and option names stay stable in
  // `apps/cli`; these descriptions are the human-facing part of that
  // contract and can be translated independently.
  'cli.help.option.json': 'stable machine-readable output',
  'cli.help.option.profile': 'configuration profile',
  'cli.help.option.apiUrl': 'API base URL',
  'cli.help.option.workspaceId': 'workspace to act in',
  'cli.help.option.dryRun': 'show the external actions instead of performing them',
  'cli.help.option.yes': 'skip interactive confirmation where one is offered',
  'cli.help.auth.flow': 'authorization flow',
  'cli.help.auth.scopes': 'scopes to request',
  'cli.help.auth.workspace': 'workspace to bind the grant to',
  'cli.help.auth.logout': 'revoke the grant and forget it locally',
  'cli.help.auth.whoami': 'subject, workspace, scopes and approval level',
  'cli.help.posts.validate':
    'deterministic preflight against live platform limits. Risk: read with --content-item. With a file it first creates the draft, which publishes nothing but does need --idempotency-key and drafts:write',
  'cli.help.posts.existingDraft': 'validate an existing draft instead of a file',
  'cli.help.posts.preview': 'exact platform variant preview. Risk: read',
  'cli.help.posts.schedule':
    'schedule approved content. Risk: consequential. Requires --idempotency-key and posts:schedule',
  'cli.help.posts.publish':
    'publish now. Risk: consequential. Requires --confirm, --idempotency-key and posts:publish',
  'cli.help.posts.confirm': 'explicit human confirmation for immediate publication',
  'cli.help.posts.status': 'publish job state, attempts and receipt. Risk: read',
  'cli.help.posts.cancel':
    'cancel a scheduled job. Risk: consequential. Requires posts:cancel',
  'cli.help.posts.list': 'content items in this workspace. Risk: read',
  'cli.help.media.list': 'assets in this workspace. Risk: read',
  'cli.help.media.kind': 'image, video, gif, document or audio',
  'cli.help.media.get': 'one asset, its scan state and its retention date. Risk: read',
  'cli.help.media.upload':
    'upload a local file and hand it to processing. Risk: reversible. Requires --idempotency-key and media:write',
  'cli.help.media.import':
    'import a finished file by URL. Risk: reversible. Requires --idempotency-key and media:write',
  'cli.help.calendar.list': 'scheduled entries in a window. Risk: read',
  'cli.help.receipts.get': 'immutable evidence of one publication. Risk: read',
  'cli.help.analytics.post':
    'post metrics. Unavailable metrics are labelled, never zero. Risk: read',
  'cli.help.analytics.account': 'account metrics. Risk: read',
  'cli.help.growth.planGet': 'a versioned plan summary. Risk: read',
  'cli.help.growth.planExport': 'export a plan. Risk: read',
  'cli.help.growth.format': 'export format',
  'cli.help.rules.list': 'rules and their limits. Risk: read',
  'cli.help.rules.test':
    'test run against a sample event. Performs no external action. Risk: read',
  'cli.help.links.create':
    'mint a tracked short link. Risk: reversible. Requires --idempotency-key',
  'cli.help.links.stats': 'first-party redirect measurements. Risk: read',
  'cli.help.config.set': 'set apiUrl, workspaceId, locale, output or profile',
  'cli.help.config.unset': 'clear one setting',
  'cli.help.config.get': 'read settings',
} as const;
