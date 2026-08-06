/**
 * Web catalog for settings, the developer portal, billing and the Growth
 * Advisor.
 *
 * This file only adds what the web screens need on top of the intent catalogs
 * in `settings.ts`, `developer.ts`, `billing.ts` and `growth.ts`. Everything
 * here lives under a `.ui.` segment so a key can never collide with one of
 * those files when the catalogs are merged.
 *
 * Several strings are mandated word for word and must not be softened:
 *  - `billing.ui.annualFraming` states the saving in currency, never a percent.
 *  - `billing.ui.cancelConfirmedBeforeConversion` must read
 *    "Canceled. You will not be charged."
 *  - the media generation boundary paragraph is NOT restated here. It already
 *    exists as `billing.mediaGeneration.explanation`, and the Tool Radar
 *    renders that same key so there is one sentence to review and translate.
 */
export const webSettingsMessages = {
  /* ------------------------------------------------------------------ shell */

  'settings.ui.subtitle':
    'Everything that configures this workspace. Nothing here publishes anything.',
  'settings.ui.nav.label': 'Settings sections',
  'settings.ui.index.help':
    'Pick a section. Every change is attributed to you and appears in the audit log.',

  'settings.ui.section.members': 'Members and roles',
  'settings.ui.section.membersSummary': 'Who is in this workspace and what each person can do.',
  'settings.ui.section.brands': 'Brands',
  'settings.ui.section.brandsSummary':
    'Voice, audience, approved claims, blocked terms, locale rules, domains and the glossary.',
  'settings.ui.section.agents': 'Agents and API',
  'settings.ui.section.agentsSummary':
    'Service accounts, scopes, limits, credentials, activity and the dry run playground.',
  'settings.ui.section.apps': 'Developer apps',
  'settings.ui.section.appsSummary':
    'Third party OAuth applications, redirect allowlists, consent and grants.',
  'settings.ui.section.webhooks': 'Webhooks',
  'settings.ui.section.webhooksSummary':
    'Signed outbound events, delivery logs, redelivery and secret rotation.',
  'settings.ui.section.billing': 'Billing',
  'settings.ui.section.billingSummary':
    'Plan, trial, interval, metered provider usage, invoices and cancellation.',
  'settings.ui.section.referrals': 'Referral and affiliate',
  'settings.ui.section.referralsSummary':
    'Your disclosed referral link, attributed signups and commission status.',
  'settings.ui.section.localization': 'Localization',
  'settings.ui.section.localizationSummary':
    'Interface language, content languages, markets, time zone and time format.',
  'settings.ui.section.security': 'Security',
  'settings.ui.section.securitySummary':
    'Sessions, two factor authentication, credentials, agents, webhooks and app grants.',
  'settings.ui.section.data': 'Data controls',
  'settings.ui.section.dataSummary':
    'Export, revoke a connection, delete a brand, delete content or close the account.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Loading {section}',
  'settings.ui.state.errorTitle': 'We could not load {section}',
  'settings.ui.state.errorRetry': 'Try again',
  'settings.ui.state.savingAnnouncement': 'Saving {section}',
  'settings.ui.state.savedAnnouncement': '{section} saved',
  'settings.ui.state.saveFailedAnnouncement': '{section} was not saved. Your input is still here.',
  'settings.ui.state.offlineTitle': 'You are offline',
  'settings.ui.state.offlineBody':
    'You can read this page. Changes cannot be saved until the connection comes back.',
  'settings.ui.state.permissionTitle': 'You do not have access to {section}',
  'settings.ui.state.permissionBody':
    'This section changes how the workspace behaves, so it is limited by role.',
  'settings.ui.state.permissionRequirements': 'What you need',
  'settings.ui.state.permissionContact':
    'An owner or an admin of this workspace can grant it. They are listed under Members and roles.',
  'settings.ui.state.rateLimitTitle': 'Too many changes in a short time',
  'settings.ui.state.rateLimitCause':
    'This workspace reached the write limit for settings changes.',
  'settings.ui.state.rateLimitReset': 'Limit resets',
  'settings.ui.state.rateLimitAlternative':
    'Nothing you saved was lost. Read only actions still work while you wait.',
  'settings.ui.state.rateLimitUsage': 'Settings writes this hour',
  'settings.ui.state.rateLimitUsageText': '{used} of {limit} used',
  'settings.ui.state.unsavedTitle': 'You have unsaved changes',
  'settings.ui.state.unsavedBody': 'Save them before you leave this section.',
  'settings.ui.state.readOnlyTitle': 'This workspace is read only',
  'settings.ui.state.readOnlyBody':
    'Billing is past due. Your content, receipts and connections are intact. Settings can be read but not changed.',

  'settings.ui.state.referenceLabel': 'Support reference',

  'settings.ui.attribution': 'Changed by {name} {relativeTime}',
  'settings.ui.attributionNever': 'Not changed since it was created',
  'settings.ui.copyFailed': 'Your browser blocked the copy. Select the text and copy it manually.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'Every invite, role change and removal is recorded with your name and the time.',
  'settings.ui.members.tableCaption': 'People in this workspace, with role and scope',
  'settings.ui.members.column.person': 'Person',
  'settings.ui.members.column.role': 'Role',
  'settings.ui.members.column.scope': 'Scope',
  'settings.ui.members.column.approvals': 'Approvals',
  'settings.ui.members.column.lastActive': 'Last active',
  'settings.ui.members.column.actions': 'Actions',
  'settings.ui.members.scopeAll': 'All brands and accounts',
  'settings.ui.members.scopeLimited': '{count, plural, one {# brand} other {# brands}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Can approve',
  'settings.ui.members.approvals.cannotApprove': 'Cannot approve',
  'settings.ui.members.approvals.canApproveOwnBrands': 'Can approve for the brands listed',
  'settings.ui.members.lastActiveNever': 'Has not signed in yet',
  'settings.ui.members.changeRole': 'Change role for {name}',
  'settings.ui.members.remove': 'Remove {name}',
  'settings.ui.members.lastOwnerTitle': 'A workspace keeps at least one owner',
  'settings.ui.members.lastOwnerBody':
    'Make someone else an owner first, then this change becomes available.',
  'settings.ui.members.inviteTitle': 'Invite someone to this workspace',
  'settings.ui.members.inviteBody':
    'They receive an email with a link. The invite expires after seven days and you can revoke it before then.',
  'settings.ui.members.inviteRole': 'Role',
  'settings.ui.members.inviteScope': 'Brands they can work in',
  'settings.ui.members.inviteScopeAll': 'Every brand in this workspace',
  'settings.ui.members.inviteScopeSelected': 'Only the brands I select',
  'settings.ui.members.inviteApprovals': 'Can decide approval requests',
  'settings.ui.members.inviteApprovalsHelp':
    'Only roles that already include review can be given this. It is separate from editing.',
  'settings.ui.members.inviteSubmit': 'Send invite',
  'settings.ui.members.invitePending': 'Invited {relativeTime} by {name}',
  'settings.ui.members.inviteRevoke': 'Revoke invite',
  'settings.ui.members.inviteResend': 'Send the invite again',
  'settings.ui.members.emptyTitle': 'You are the only person here',
  'settings.ui.members.emptyBody':
    'Invite the people who write, approve or read results. Each one gets a role and a brand scope.',
  'settings.ui.members.emptyExample':
    'A common shape: one owner for billing, one approver per brand, and editors who draft but never publish.',
  'settings.ui.members.roleReferenceTitle': 'What each role can do',
  'settings.ui.members.roleReferenceCaption': 'Roles and the actions each one allows',
  'settings.ui.members.roleColumn.role': 'Role',
  'settings.ui.members.roleColumn.can': 'Can do',
  'settings.ui.members.roleColumn.cannot': 'Cannot do',
  'settings.ui.members.roleCannot.owner': 'Nothing is withheld from an owner.',
  'settings.ui.members.roleCannot.admin': 'Change billing, or delete the workspace.',
  'settings.ui.members.roleCannot.manager': 'Change billing, roles or workspace deletion.',
  'settings.ui.members.roleCannot.editor': 'Approve, schedule, publish or change connections.',
  'settings.ui.members.roleCannot.approver': 'Change connections, rules or billing.',
  'settings.ui.members.roleCannot.analyst': 'Create, edit, approve or publish anything.',
  'settings.ui.members.roleCannot.viewer': 'Change anything at all.',
  'settings.ui.members.removeTitle': 'Remove {name} from this workspace',
  'settings.ui.members.removeConsequence.access': 'They lose access immediately, on every surface.',
  'settings.ui.members.removeConsequence.drafts':
    'Drafts they wrote stay in the workspace and stay editable.',
  'settings.ui.members.removeConsequence.audit':
    'Their past actions stay in the audit log and on receipts.',
  'settings.ui.members.removeConsequence.approvals':
    'Approval requests waiting on them return to the queue for another approver.',

  /* ------------------------------------------------------------------ brands */

  'settings.ui.brands.description':
    'A brand carries the rules that content is checked against: what you may claim, what you may not say, and how each language is written.',
  'settings.ui.brands.listCaption': 'Brands in this workspace',
  'settings.ui.brands.column.brand': 'Brand',
  'settings.ui.brands.column.locales': 'Content languages',
  'settings.ui.brands.column.accounts': 'Accounts',
  'settings.ui.brands.column.updated': 'Updated',
  'settings.ui.brands.accountCount':
    '{count, plural, =0 {No accounts} one {# account} other {# accounts}}',
  'settings.ui.brands.emptyTitle': 'No brands yet',
  'settings.ui.brands.emptyBody':
    'A brand groups accounts, approval rules and language rules. Most teams start with one and add a second when a client or a market needs different rules.',
  'settings.ui.brands.emptyExample':
    'Example: brand "Acme EU", languages English and German, blocked term "guaranteed", disclosure "Paid partnership" on for Instagram.',
  'settings.ui.brands.voiceHelp':
    'How this brand sounds. Used when you ask for a rewrite and when claims are checked.',
  'settings.ui.brands.audienceHelp': 'Who the content is for, per market.',
  'settings.ui.brands.approvedClaimsHelp':
    'Statements a reviewer has cleared. Anything outside this list is flagged before approval, not after publishing.',
  'settings.ui.brands.blockedTermsHelp':
    'Words that block scheduling for this brand. One per line.',
  'settings.ui.brands.domainsHelp':
    'Domains this brand may link to and shorten through. Only verified domains can be selected in the composer.',
  'settings.ui.brands.domainVerified': 'Verified {date}',
  'settings.ui.brands.domainPending': 'DNS record not seen yet',
  'settings.ui.brands.disclosureHelp':
    'Applied by default in the composer for the platforms you choose here. It can be changed per post before approval.',
  'settings.ui.brands.glossaryHelp':
    'Product names, legal terms and anything that must survive a translation unchanged.',
  'settings.ui.brands.glossaryCaption': 'Protected terms and how each one is handled per language',
  'settings.ui.brands.glossaryEmpty':
    'No protected terms yet. Add product names and legal terms that must not be translated or rephrased.',
  'settings.ui.brands.localeRulesHelp':
    'Rules per content language. They are applied when you adapt or transcreate, and shown to the reviewer.',
  'settings.ui.brands.saveBrand': 'Save brand',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'Three separate settings: the language of this app, the languages you publish in, and the markets you are writing for. Changing one never changes another.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Choose an interface language for this app. Content languages are separate and already available.',
  'settings.ui.localization.marketHelp':
    'A market changes examples, legal disclosures and calls to action. It does not change the language of a post.',
  'settings.ui.localization.previewTitle': 'How dates and numbers will read',
  'settings.ui.localization.previewDate': 'Date',
  'settings.ui.localization.previewTime': 'Time',
  'settings.ui.localization.previewNumber': 'Number',
  'settings.ui.localization.previewCurrency': 'Currency',
  'settings.ui.localization.weekStartHelp': 'Used by the calendar week view.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'Everything that can act on this workspace, in one place: your sessions, credentials, agents, webhooks and the apps you have granted access to.',
  'settings.ui.security.sessionsCaption': 'Signed in sessions for your account',
  'settings.ui.security.sessionColumn.device': 'Device and browser',
  'settings.ui.security.sessionColumn.location': 'Approximate location',
  'settings.ui.security.sessionColumn.lastSeen': 'Last used',
  'settings.ui.security.sessionCurrent': 'This session',
  'settings.ui.security.sessionRevokeAll': 'Sign out every other session',
  'settings.ui.security.sessionLocationUnknown': 'Location not recorded',
  'settings.ui.security.mfaOn': 'Two factor authentication is on',
  'settings.ui.security.mfaOff': 'Two factor authentication is off',
  'settings.ui.security.mfaBody':
    'A second factor is required before billing changes, service account creation, reconnecting an account and revoking credentials.',
  'settings.ui.security.credentialsTitle': 'API keys',
  'settings.ui.security.credentialsBody':
    'Keys owned by this workspace. They are separate from app grants and from your own session.',
  'settings.ui.security.agentsTitle': 'Service accounts',
  'settings.ui.security.webhooksTitle': 'Webhook endpoints',
  'settings.ui.security.grantsTitle': 'Apps you have allowed',
  'settings.ui.security.grantsBody':
    'Revoking an app stops its tokens immediately. Your own connections and scheduled posts are not affected.',
  'settings.ui.security.grantScopes': 'Granted permissions',
  'settings.ui.security.socialPermissionsTitle': 'Social account permissions',
  'settings.ui.security.socialPermissionsBody':
    'What each connected account has allowed Relay to do, from the capability snapshot taken at connection time.',
  'settings.ui.security.viewInSection': 'Manage in {section}',
  'settings.ui.security.emptySessions': 'Only this session is signed in.',
  'settings.ui.security.emptyGrants':
    'No third party app has access to this workspace. Apps appear here after you allow them on a consent screen.',
  'settings.ui.security.revokeGrantTitle': 'Revoke access for {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Its access and refresh tokens stop working immediately.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Posts it already scheduled stay scheduled. Cancel them separately if you want them stopped.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'The app can ask for access again, and you can refuse.',

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'Take your data out, remove one thing, or close the account. Every destructive action names exactly what it touches first.',
  'settings.ui.data.exportTitle': 'Export',
  'settings.ui.data.exportBody':
    'A portable archive of content, schedules, receipts, analytics and audit events, plus your uploaded media.',
  'settings.ui.data.exportJson': 'Structured JSON',
  'settings.ui.data.exportCsv': 'Spreadsheet CSV',
  'settings.ui.data.exportMedia': 'Media archive',
  'settings.ui.data.exportJsonHelp':
    'One file per record type. Documented and stable across versions.',
  'settings.ui.data.exportCsvHelp': 'Posts, receipts and metrics as flat tables for a spreadsheet.',
  'settings.ui.data.exportMediaHelp':
    'The original files you uploaded or imported, with checksums.',
  'settings.ui.data.exportStart': 'Prepare export',
  'settings.ui.data.exportRunning':
    'Preparing your export. It keeps running if you close this page.',
  'settings.ui.data.exportReady': 'Export ready, prepared {date}',
  'settings.ui.data.exportDownload': 'Download export',
  'settings.ui.data.exportExpires': 'The download link expires {date}.',
  'settings.ui.data.deleteTitle': 'Delete',
  'settings.ui.data.deleteBody':
    'Choose the smallest thing that solves your problem. Each option below says what survives.',
  'settings.ui.data.deleteConnection': 'Revoke one social connection',
  'settings.ui.data.deleteConnectionHelp':
    'Removes Relay access to that account. The workspace, its content and its receipts stay.',
  'settings.ui.data.deleteBrand': 'Delete a brand',
  'settings.ui.data.deleteBrandHelp':
    'Removes the brand, its rules and its glossary. Content published under it keeps its receipts.',
  'settings.ui.data.deleteContent': 'Delete content and media',
  'settings.ui.data.deleteContentHelp':
    'Removes drafts and stored files. It does not remove anything already published on a platform.',
  'settings.ui.data.deleteAccount': 'Close this workspace',
  'settings.ui.data.deleteAccountHelp':
    'Cancels scheduled jobs, revokes every connection, removes stored media and closes the workspace.',
  'settings.ui.data.scheduledJobsTitle': 'Scheduled work that will be canceled first',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {Nothing is scheduled right now} one {# scheduled post} other {# scheduled posts}}',
  'settings.ui.data.cancelJobsFirst': 'Cancel scheduled posts now',
  'settings.ui.data.cancelJobsDone': 'Scheduled posts canceled. Nothing will publish.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'Type the workspace name to confirm',
  'settings.ui.data.deleteConsequence.jobs':
    'Every scheduled post is canceled before anything is removed.',
  'settings.ui.data.deleteConsequence.connections':
    'Every social connection is revoked at the provider.',
  'settings.ui.data.deleteConsequence.media': 'Stored media is deleted and cannot be recovered.',
  'settings.ui.data.deleteConsequence.receipts':
    'Publication receipts are kept for the retention period stated in the Terms, then removed.',
  'settings.ui.data.deleteConsequence.published':
    'Posts already live on a platform are not deleted. Remove those on the platform.',
  'settings.ui.data.exportFirst': 'Export your data before you delete it.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'Share Relay with a disclosed link. Commission is never conditional on a positive review.',
  'settings.ui.referral.linkLabel': 'Your referral link',
  'settings.ui.referral.tableCaption': 'Attributed signups and their commission state',
  'settings.ui.referral.column.signup': 'Signup',
  'settings.ui.referral.column.date': 'Date',
  'settings.ui.referral.column.state': 'Commission',
  'settings.ui.referral.column.amount': 'Amount',
  'settings.ui.referral.emptyTitle': 'No attributed signups yet',
  'settings.ui.referral.emptyBody':
    'Signups appear here once someone starts a trial through your link. Amounts stay pending until the refund window closes.',
  'settings.ui.referral.emptyExample':
    'Example row: acme.example, started a trial 12 June, pending until 12 July, then approved.',
  'settings.ui.referral.termsLink': 'Read the partner terms',
  'settings.ui.referral.balance': 'Approved commission',
  'settings.ui.referral.balanceUnavailableReason':
    'The commission ledger has not been reconciled for this period yet.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'A service account is a named identity for an agent, a script or a workflow. It carries its own scopes, its own limits and its own audit trail.',
  'developer.ui.agents.emptyTitle': 'No service accounts yet',
  'developer.ui.agents.emptyBody':
    'Create one for each automation you run. Separate accounts mean you can revoke one without stopping the others.',
  'developer.ui.agents.emptyExample':
    'Example: "Content agent", brand Acme EU, may draft and schedule up to 6 posts a day between 07:00 and 22:00, never publishes immediately.',
  'developer.ui.agents.step.identity': 'Name and purpose',
  'developer.ui.agents.step.scope': 'What it can reach',
  'developer.ui.agents.step.limits': 'Limits',
  'developer.ui.agents.purpose': 'What this account is for',
  'developer.ui.agents.purposeHelp':
    'One sentence. It appears next to every action this account takes in the audit log.',
  'developer.ui.agents.scopeHelp':
    'A scope grants exactly itself. Nothing here implies anything else.',
  'developer.ui.agents.limitsHelp':
    'Limits are enforced by the API, not by the agent. An agent cannot raise its own limit.',
  'developer.ui.agents.quietHours': 'Quiet hours',
  'developer.ui.agents.quietHoursHelp':
    'The account cannot schedule or publish inside these hours, in the workspace time zone.',
  'developer.ui.agents.lookAheadHelp': 'How far into the future it may place a post.',
  'developer.ui.agents.cadenceHelp': 'The most external publications it may cause in one day.',
  'developer.ui.agents.expiry': 'Credential expiry',
  'developer.ui.agents.expiryHelp': 'A shorter life is safer. You can rotate at any time.',
  'developer.ui.agents.summaryTitle': 'Before you create it',
  'developer.ui.agents.summaryAccounts': 'Accounts it can reach',
  'developer.ui.agents.summaryMaxActions':
    'At most {count, plural, one {# external publication} other {# external publications}} per day.',
  'developer.ui.agents.summaryApproval': 'Approval behaviour',
  'developer.ui.agents.summaryCreate': 'Create service account',
  'developer.ui.agents.detailTitle': 'Service account',
  'developer.ui.agents.statusActive': 'Active',
  'developer.ui.agents.statusStopped': 'Stopped',
  'developer.ui.agents.statusExpired': 'Credential expired',
  'developer.ui.agents.stoppedBody':
    'This account is stopped. Every call it makes is refused with a plain reason. Nothing it created was removed.',
  'developer.ui.agents.killTitle': 'Stop {name}',
  'developer.ui.agents.killConsequence.calls':
    'Every API, MCP and CLI call from this account is refused at once.',
  'developer.ui.agents.killConsequence.scheduled':
    'Posts it already scheduled stay scheduled. Cancel them from the calendar if you want them stopped.',
  'developer.ui.agents.killConsequence.reversible': 'You can start it again later.',
  'developer.ui.agents.resume': 'Start this agent again',
  'developer.ui.agents.rotate': 'Rotate credential',
  'developer.ui.agents.rotateTitle': 'Rotate the credential for {name}',
  'developer.ui.agents.rotateConsequence.old': 'The current credential stops working immediately.',
  'developer.ui.agents.rotateConsequence.new': 'The new one is shown once, on this page.',
  'developer.ui.agents.rotateConsequence.clients':
    'Anything using the old value fails until you update it.',
  'developer.ui.agents.credentialStored': 'I have stored this credential',
  'developer.ui.agents.credentialLabel': 'Service account credential',
  'developer.ui.agents.credentialWarning': 'This is the only time this credential is shown',
  'developer.ui.agents.credentialWarningBody':
    'Copy it into your secret store now. We keep only a hash, so we cannot show it again. Rotating creates a new one.',
  'developer.ui.agents.credentialConsumed':
    'The credential is no longer displayed. Rotate it if you did not store it.',
  'developer.ui.agents.credentialReveal': 'Show credential',
  'developer.ui.agents.credentialHide': 'Hide credential',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read': 'See your connected accounts and what each one can do',
  'developer.ui.scope.accounts_write': 'Rename accounts and change how they are grouped',
  'developer.ui.scope.drafts_read': 'Read your drafts and their variants',
  'developer.ui.scope.drafts_write': 'Create and edit drafts',
  'developer.ui.scope.posts_schedule': 'Schedule approved content to your accounts',
  'developer.ui.scope.posts_publish': 'Publish to your accounts immediately',
  'developer.ui.scope.posts_cancel': 'Cancel scheduled posts',
  'developer.ui.scope.analytics_read': 'Read analytics for your accounts',
  'developer.ui.scope.media_read': 'See the files in your library',
  'developer.ui.scope.media_write': 'Upload and edit files in your library',
  'developer.ui.scope.rules_read': 'Read your automation rules',
  'developer.ui.scope.rules_write': 'Create and change automation rules that can publish',
  'developer.ui.scope.growth_read': 'Read your growth plans',
  'developer.ui.scope.growth_write': 'Create and edit growth plans',
  'developer.ui.scope.webhooks_manage': 'Create and change webhook endpoints',
  'developer.ui.scope.billing_read': 'Read your plan, trial state and usage',
  'developer.ui.scope.connections_admin': 'Connect and disconnect social accounts',

  'developer.ui.activity.caption': 'Recent tool calls, with the ones that were refused',
  'developer.ui.activity.column.time': 'Time',
  'developer.ui.activity.column.tool': 'Tool or route',
  'developer.ui.activity.column.outcome': 'Outcome',
  'developer.ui.activity.column.subject': 'Subject',
  'developer.ui.activity.outcome.ok': 'Allowed',
  'developer.ui.activity.outcome.denied': 'Denied',
  'developer.ui.activity.outcome.failed': 'Failed',
  'developer.ui.activity.filterDenied': 'Show denied attempts only',
  'developer.ui.activity.deniedExplain':
    'A denied attempt is how a misconfigured agent shows itself. These rows are kept, not hidden.',
  'developer.ui.activity.emptyTitle': 'No calls recorded yet',
  'developer.ui.activity.emptyBody':
    'Calls appear here within a few seconds of happening, including the ones that were refused.',
  'developer.ui.activity.emptyExample':
    'Example row: 12:03, draft_post, Allowed, draft for X account @acme.',

  'developer.ui.setup.help':
    'Paste this into the client you are connecting. Replace the credential placeholder with the value you stored.',
  'developer.ui.setup.credentialPlaceholder':
    'The snippet uses a placeholder. Never commit the real credential to a repository.',
  'developer.ui.setup.copySnippet': 'Copy snippet for {client}',
  'developer.ui.setup.snippetCopied': 'Snippet copied',
  'developer.ui.setup.tabLabel': 'Client setup snippets',

  'developer.ui.playground.help':
    'Calls run against a seeded copy of this workspace. No provider is contacted and nothing is scheduled.',
  'developer.ui.playground.tool': 'Tool',
  'developer.ui.playground.arguments': 'Arguments',
  'developer.ui.playground.argumentsHelp': 'JSON. The same body the real API accepts.',
  'developer.ui.playground.result': 'Result',
  'developer.ui.playground.resultEmpty': 'Run a tool to see the response it would return.',
  'developer.ui.playground.invalidJson': 'This is not valid JSON yet, so it cannot be sent.',
  'developer.ui.playground.deniedByApproval':
    'Approval level {level} does not allow this call. The dry run refuses it exactly as the API would.',
  'developer.ui.playground.announceResult': 'Dry run finished. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'Register an application so other people can grant it access to their workspace. Each app has its own identity, its own redirect allowlist and its own audit trail.',
  'developer.ui.apps.emptyTitle': 'No apps registered',
  'developer.ui.apps.emptyBody':
    'Register an app when another product needs to act on behalf of a Relay user. For your own automation, use a service account instead.',
  'developer.ui.apps.emptyExample':
    'Example: "Acme Publisher", confidential client, redirect https://acme.example/oauth/callback, scopes accounts:read and drafts:write.',
  'developer.ui.apps.typeHelp':
    'A confidential client runs on a server you control and can keep a secret. A public client is a browser or a desktop app and uses PKCE without a secret.',
  'developer.ui.apps.redirectAdd': 'Add a redirect URI',
  'developer.ui.apps.redirectRemove': 'Remove {uri}',
  'developer.ui.apps.redirectInvalid':
    'Enter a full https URI with no wildcard and no query string. It must match the value your app sends exactly.',
  'developer.ui.apps.linksTitle': 'Published links',
  'developer.ui.apps.linksHelp':
    'These appear on the consent screen. A user who cannot reach them will not grant access.',
  'developer.ui.apps.linkUnreachable': 'We could not reach this URL when we last checked, {date}.',
  'developer.ui.apps.linkReachable': 'Reachable, checked {date}',
  'developer.ui.apps.scopesTitle': 'Permissions this app may ask for',
  'developer.ui.apps.scopesHelp':
    'Ask for the least you need. A user sees read permissions and consequential permissions as two separate groups.',
  'developer.ui.apps.scopeGroup.read': 'Read permissions',
  'developer.ui.apps.scopeGroup.reversible': 'Changes you can undo',
  'developer.ui.apps.scopeGroup.consequential': 'Consequential permissions',
  'developer.ui.apps.scopeGroupHelp.read': 'These let the app look at data. Nothing changes.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'These let the app create or edit things inside Relay. Nothing reaches a platform.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'These can cause a post on a real account, or change who can reach your accounts. They are always listed separately and are never bundled.',
  'developer.ui.apps.noBundling':
    'There is no combined access scope. Billing and connection administration are always asked for by name.',
  'developer.ui.apps.secretTitle': 'Client secret',
  'developer.ui.apps.secretWarning': 'This is the only time the client secret is shown',
  'developer.ui.apps.secretWarningBody':
    'Store it in your server side secret manager now. We keep only a hash. If you lose it, rotate it: there is no way to reveal it again.',
  'developer.ui.apps.secretConsumed':
    'The secret is no longer displayed. Rotate it if you did not store it.',
  'developer.ui.apps.secretStored': 'I have stored this secret',
  'developer.ui.apps.secretPublicClient':
    'A public client has no secret. It uses the authorization code flow with PKCE.',
  'developer.ui.apps.rotateTitle': 'Rotate the client secret for {app}',
  'developer.ui.apps.rotateConsequence.old': 'The current secret stops working immediately.',
  'developer.ui.apps.rotateConsequence.grants': 'Existing user grants are not revoked.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Your servers fail to refresh tokens until you deploy the new value.',
  'developer.ui.apps.consentPreviewTitle': 'Consent screen preview',
  'developer.ui.apps.consentPreviewHelp':
    'This is what a user sees. It is generated from the app record, so it cannot promise more than the app asks for.',
  'developer.ui.apps.consentPreviewSample':
    'Preview only. Nothing is granted and no token is issued.',
  'developer.ui.apps.grantsCaption': 'Workspaces that have granted this app access',
  'developer.ui.apps.grantColumn.workspace': 'Workspace',
  'developer.ui.apps.grantColumn.scopes': 'Scopes',
  'developer.ui.apps.grantColumn.granted': 'Granted',
  'developer.ui.apps.grantColumn.lastUsed': 'Last used',
  'developer.ui.apps.grantsEmpty': 'No one has granted this app access yet.',
  'developer.ui.apps.logsCaption': 'Recent requests, with secrets and payloads removed',
  'developer.ui.apps.logColumn.time': 'Time',
  'developer.ui.apps.logColumn.route': 'Route',
  'developer.ui.apps.logColumn.status': 'Status',
  'developer.ui.apps.logColumn.workspace': 'Workspace',
  'developer.ui.apps.logsRedacted':
    'Request and response bodies are stored with credentials, tokens and user content removed.',
  'developer.ui.apps.sandboxTitle': 'Sandbox credentials',
  'developer.ui.apps.sandboxBody':
    'A separate client ID and workspace with seeded data. Calls made with it never reach a provider.',
  'developer.ui.apps.rateLimitLabel': 'Rate limit',
  'developer.ui.apps.rateLimitUsage': '{used} of {limit} requests this hour',
  'developer.ui.apps.disable': 'Disable app',
  'developer.ui.apps.enable': 'Enable app',
  'developer.ui.apps.disabledBody':
    'This app is disabled. Existing tokens are refused and no new grant can be started. Grants are kept so you can enable it again.',
  'developer.ui.apps.deleteTitle': 'Delete {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Every grant is revoked and every token stops working.',
  'developer.ui.apps.deleteConsequence.logs':
    'Request logs are kept for the audit retention period.',
  'developer.ui.apps.deleteConsequence.irreversible': 'The client ID cannot be reused.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Signed HTTPS deliveries for the events you choose. Every delivery is logged with its response, and any delivery can be sent again.',
  'developer.ui.webhooks.emptyTitle': 'No endpoints yet',
  'developer.ui.webhooks.emptyBody':
    'Add an endpoint to receive publish results, approval decisions and connection health in your own systems.',
  'developer.ui.webhooks.emptyExample':
    'Example: https://hooks.acme.example/relay, subscribed to post.published, post.failed and connection.action_required.',
  'developer.ui.webhooks.create': 'Add an endpoint',
  'developer.ui.webhooks.url': 'Endpoint URL',
  'developer.ui.webhooks.urlHelp': 'HTTPS only. We follow no redirects and we do not retry a 2xx.',
  'developer.ui.webhooks.eventsTitle': 'Events',
  'developer.ui.webhooks.eventsHelp':
    'Choose the events you handle. Sending everything to an endpoint that ignores most of it makes failures harder to see.',
  'developer.ui.webhooks.eventsAll': 'Every event',
  'developer.ui.webhooks.eventsSelected': 'Only the events I select',
  'developer.ui.webhooks.eventsCount': '{count, plural, one {# event} other {# events}}',
  'developer.ui.webhooks.eventGroup.connections': 'Connections',
  'developer.ui.webhooks.eventGroup.content': 'Content and approval',
  'developer.ui.webhooks.eventGroup.publishing': 'Publishing',
  'developer.ui.webhooks.eventGroup.automation': 'Automation and feeds',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'Brands and accounts',
  'developer.ui.webhooks.scopeAll': 'Every brand and account',
  'developer.ui.webhooks.scopeSelected': 'Only the ones I select',
  'developer.ui.webhooks.secretTitle': 'Signing secret',
  'developer.ui.webhooks.secretBody':
    'Verify the signature header before you parse a body. Deduplicate on the delivery id, which is stable across retries.',
  'developer.ui.webhooks.secretRotateTitle': 'Rotate the signing secret',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Both secrets are accepted for 24 hours so you can deploy without dropping a delivery.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'After that window only the new secret is used.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Sends one signed example event marked as a test, so your receiver can ignore it safely.',
  'developer.ui.webhooks.testDeliverySent':
    'Test delivery sent. The result appears in the log below.',
  'developer.ui.webhooks.deliveriesCaption': 'Recent deliveries and the response each one received',
  'developer.ui.webhooks.deliveryColumn.time': 'Requested',
  'developer.ui.webhooks.deliveryColumn.event': 'Event',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Attempt',
  'developer.ui.webhooks.deliveryColumn.response': 'Response',
  'developer.ui.webhooks.deliveryColumn.status': 'Status',
  'developer.ui.webhooks.deliveryStatus.pending': 'Waiting',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Delivered',
  'developer.ui.webhooks.deliveryStatus.failed': 'Failed, will retry',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Failed, no more retries',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Not sent, endpoint disabled',
  'developer.ui.webhooks.deliveryNoResponse': 'No response received',
  'developer.ui.webhooks.deliveryNextAttempt': 'Next attempt {relativeTime}',
  'developer.ui.webhooks.inspect': 'Inspect delivery',
  'developer.ui.webhooks.inspectTitle': 'Delivery {id}',
  'developer.ui.webhooks.inspectRequest': 'Request body',
  'developer.ui.webhooks.inspectResponse': 'Response body',
  'developer.ui.webhooks.redeliver': 'Send this delivery again',
  'developer.ui.webhooks.redeliverHelp':
    'The same event id is sent again with the redelivery flag set, so an idempotent receiver ignores it safely.',
  'developer.ui.webhooks.redelivered': 'Queued for redelivery.',
  'developer.ui.webhooks.failureTitle': 'This endpoint is failing',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# delivery in a row failed} other {# deliveries in a row failed}}. After {limit} consecutive failures the endpoint is disabled and an action item is filed.',
  'developer.ui.webhooks.disabledTitle': 'This endpoint was disabled after repeated failures',
  'developer.ui.webhooks.disabledBody':
    'We stopped sending to it so your queue does not fill up. Fix the receiver, send a test delivery, then enable it again.',
  'developer.ui.webhooks.lastSuccessLabel': 'Last success',
  'developer.ui.webhooks.lastSuccessNever': 'No delivery has ever succeeded',
  'developer.ui.webhooks.deleteTitle': 'Delete this endpoint',
  'developer.ui.webhooks.deleteConsequence.stop': 'Nothing more is sent to this URL.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'Delivery logs are kept for the audit retention period.',

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'One plan, two intervals. Polar is the merchant of record: it holds the payment method, issues invoices and handles cancellation.',
  'billing.ui.statusHeading': 'Current status',
  'billing.ui.planHeading': 'Plan',
  'billing.ui.intervalHeading': 'Billing interval',
  'billing.ui.usageHeading': 'Metered provider usage',
  'billing.ui.invoicesHeading': 'Invoices',
  'billing.ui.cancelHeading': 'Cancellation',
  'billing.ui.trialDaysRemaining':
    'Trial, {count, plural, =0 {ends today} one {# day remaining} other {# days remaining}}',
  'billing.ui.convertsOn': 'Converts on {date} to {amount} per {interval}.',
  'billing.ui.dueToday': '$0 due today',
  'billing.ui.conversionLabel': 'Converts',
  'billing.ui.channelsLabel': 'Active channels',
  'billing.ui.paymentMethodPolar': 'Payment method held by Polar',
  'billing.ui.paymentMethodDescriptor': '{brand} ending {last4}, expires {expiry}',
  'billing.ui.paymentMethodMissing': 'No payment method on file yet',
  'billing.ui.cancelBeforeDate': 'Cancel before {date} and you will not be charged.',
  'billing.ui.annualFraming': '$25/month billed annually. Save $48/year.',
  'billing.ui.monthlyOption': '$29 per month',
  'billing.ui.annualOption': '$300 per year',
  'billing.ui.intervalChangeHelp':
    'Changing the interval takes effect at the next renewal. Polar prorates it and shows the exact amount before you confirm.',
  'billing.ui.intervalChangedAnnouncement': 'Billing interval set to {interval}.',
  'billing.ui.allowanceChannels':
    '30 active social channels. A channel is one connected account, page or channel.',
  'billing.ui.allowanceChannelsUsage': '{used} of {limit} active channels',
  'billing.ui.allowanceFairUse':
    'Fair use means anti spam, rate and provider cost controls. They apply the same way to every subscriber and are published, not discretionary.',
  'billing.ui.allowanceMetered':
    'X and some other providers charge per operation. Those charges are passed through at cost and are not part of the plan price.',
  'billing.ui.allowanceNoMedia':
    'Image generation and video generation are not included and are not sold. Relay does not generate media.',
  'billing.ui.readFairUse': 'Read the fair use policy',
  'billing.ui.readMeteredPolicy': 'Read how metered usage is billed',
  'billing.ui.usageCaption': 'Metered provider usage this period, billed at cost',
  'billing.ui.usageColumn.item': 'Item',
  'billing.ui.usageColumn.quantity': 'Quantity',
  'billing.ui.usageColumn.unitPrice': 'Unit price',
  'billing.ui.usageColumn.amount': 'Amount',
  'billing.ui.usageTotal': 'Total this period',
  'billing.ui.usagePeriod': 'Period {start} to {end}',
  'billing.ui.usageSource': 'Prices published by the provider. Verified {date}.',
  'billing.ui.usageReconciled': 'Reconciled against the provider invoice on {date}.',
  'billing.ui.usagePending': 'Not reconciled yet. The final amount can move slightly.',
  'billing.ui.usageUnavailableReason':
    'The provider has not returned usage for this period yet. It is normally available within 24 hours.',
  'billing.ui.usageEmpty': 'No metered usage this period.',
  'billing.ui.spendAlert': 'Spend alert',
  'billing.ui.spendAlertHelp':
    'We email you when metered usage passes this amount in a billing period.',
  'billing.ui.spendAlertPause': 'Also pause metered actions when the alert is reached',
  'billing.ui.balanceLabel': 'Usage balance',
  'billing.ui.balanceHelp': 'Metered usage is drawn from this balance and invoiced by Polar.',
  'billing.ui.invoicesCaption': 'Invoices issued by Polar',
  'billing.ui.invoiceColumn.date': 'Date',
  'billing.ui.invoiceColumn.description': 'Description',
  'billing.ui.invoiceColumn.amount': 'Amount',
  'billing.ui.invoiceColumn.state': 'State',
  'billing.ui.invoiceState.paid': 'Paid',
  'billing.ui.invoiceState.open': 'Open',
  'billing.ui.invoiceState.uncollectible': 'Not collected',
  'billing.ui.invoiceState.refunded': 'Refunded',
  'billing.ui.invoicesEmpty': 'No invoice yet. The first one is issued when the trial converts.',
  'billing.ui.invoicesInPortal': 'Every invoice and receipt is available in the Polar portal.',
  'billing.ui.portalHelp':
    'The portal is where you change the payment method, download invoices and cancel. It opens in a new tab.',
  'billing.ui.pastDueHeading': 'Payment overdue',
  'billing.ui.pastDueBody':
    'The last payment did not go through. Update the payment method in the Polar portal to keep publishing.',
  'billing.ui.gracePolicy':
    'Scheduled posts keep running until {date}. After that the workspace becomes read only: nothing is deleted and nothing is published.',
  'billing.ui.cancelBody':
    'Cancelling is one action and takes effect at the end of the period you have paid for. There is no call to make and no form to fill in.',
  'billing.ui.cancelStart': 'Cancel subscription',
  'billing.ui.cancelDialogTitle': 'Cancel this subscription',
  'billing.ui.cancelConsequence.noCharge':
    'You will not be charged. Nothing is taken today or on {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'You keep every feature until {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Drafts, receipts, media and analytics stay in this workspace.',
  'billing.ui.cancelConsequence.scheduled':
    'Posts scheduled after {date} will not publish. Cancel or reschedule them before then.',
  'billing.ui.cancelConsequence.restart': 'You can start the subscription again at any time.',
  'billing.ui.cancelConfirm': 'Cancel subscription',
  'billing.ui.cancelKeep': 'Keep subscription',
  'billing.ui.cancelConfirmedBeforeConversion': 'Canceled. You will not be charged.',
  'billing.ui.cancelConfirmedAfterConversion': 'Canceled. Access continues until {date}.',
  'billing.ui.cancelAnnouncement': 'Subscription canceled.',
  'billing.ui.canceledNotice': 'This subscription is canceled.',
  'billing.ui.resume': 'Start the subscription again',
  'billing.ui.noSubscriptionTitle': 'No subscription on this workspace',
  'billing.ui.noSubscriptionBody':
    'Start the seven day trial to publish. Polar collects a payment method and charges nothing today.',
  'billing.ui.noSubscriptionExample':
    'Monthly is $29. Annual is $300, which is $25/month billed annually. Save $48/year.',
  'billing.ui.overChannelLimitAction': 'Review connected channels',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'Answer a short intake, confirm what we understood, and get a plan you can accept item by item. It proposes work. It never schedules or publishes anything on its own.',
  'growth.ui.step.intake': 'Intake',
  'growth.ui.step.confirm': 'Confirm',
  'growth.ui.step.plan': 'Plan',
  'growth.ui.stepIndicator': 'Step {current} of {total}: {name}',
  'growth.ui.intake.section.product': 'Product',
  'growth.ui.intake.section.audience': 'Audience and markets',
  'growth.ui.intake.section.objective': 'Objective',
  'growth.ui.intake.section.capacity': 'Channels and capacity',
  'growth.ui.intake.section.limits': 'What is off limits',
  'growth.ui.intake.help':
    'Nothing here is guessed for you. Anything you leave empty is marked as missing rather than filled in.',
  'growth.ui.intake.productNameHelp': 'The name you use with customers.',
  'growth.ui.intake.siteUrlHelp':
    'We read the page you give us as source material. You confirm every fact we take from it.',
  'growth.ui.intake.descriptionHelp': 'What you sell and who it is for, in your own words.',
  'growth.ui.intake.marketsHelp': 'Countries or regions. One per line.',
  'growth.ui.intake.localesHelp': 'The languages you will publish in.',
  'growth.ui.intake.objectiveHelp': 'What you want more of in the next quarter.',
  'growth.ui.intake.conversionHelp':
    'The action you can actually measure. A signup, a demo, a purchase.',
  'growth.ui.intake.proofHelp':
    'Case studies, benchmarks you ran, screenshots you own, permissions you already hold. One per line.',
  'growth.ui.intake.proofNone': 'I have no approved proof yet',
  'growth.ui.intake.proofNoneEffect':
    'The plan will avoid customer results and outcome claims entirely.',
  'growth.ui.intake.channelsHelp': 'The accounts you already publish from.',
  'growth.ui.intake.capacityHelp': 'Be honest. A plan you cannot run is not a plan.',
  'growth.ui.intake.competitorsHelp': 'Optional. One per line.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Claims you may not make, for legal or policy reasons. One per line.',
  'growth.ui.intake.prohibitedTopicsHelp': 'Topics to stay away from. One per line.',
  'growth.ui.intake.submit': 'Review what we understood',
  'growth.ui.intake.savedAnnouncement': 'Business profile saved.',
  'growth.ui.intake.requiredMissing': 'Fill in the fields marked required before continuing.',

  'growth.ui.confirm.factsTitle': 'Facts you confirmed',
  'growth.ui.confirm.factsHelp': 'These can be used in copy.',
  'growth.ui.confirm.assumptionsTitle': 'Assumptions we made',
  'growth.ui.confirm.assumptionsHelp':
    'These are not facts. They shape the plan but they never become a claim in a post.',
  'growth.ui.confirm.missingTitle': 'Missing',
  'growth.ui.confirm.missingHelp':
    'The plan works around each of these and says so where it matters.',
  'growth.ui.confirm.confidence.label': 'Confidence: {level}',
  'growth.ui.confirm.confidence.low': 'low',
  'growth.ui.confirm.confidence.medium': 'medium',
  'growth.ui.confirm.confidence.high': 'high',
  'growth.ui.confirm.promote': 'Confirm as a fact',
  'growth.ui.confirm.correct': 'Correct this',
  'growth.ui.confirm.correctLabel': 'Your correction',
  'growth.ui.confirm.generate': 'Generate the plan',
  'growth.ui.confirm.announcement': 'Business profile confirmed.',

  'growth.ui.plan.generatingBody':
    'This takes a few seconds. You can leave this page: the plan finishes on its own.',
  'growth.ui.plan.stateDraft': 'Draft, not approved',
  'growth.ui.plan.stateApproved': 'Approved',
  'growth.ui.plan.stateSuperseded': 'Superseded by a newer version',
  'growth.ui.plan.newVersionNotice':
    'A refresh creates version {version} and leaves the approved version untouched.',
  'growth.ui.plan.emptyTitle': 'No plan yet',
  'growth.ui.plan.emptyBody':
    'Fill in the business profile and we will build a plan from the facts you confirm.',
  'growth.ui.plan.emptyExample':
    'A plan contains a strategy, four weeks of briefs, one UGC campaign, catalog backed opportunities and up to five tools.',
  'growth.ui.plan.tabsLabel': 'Plan sections',
  'growth.ui.plan.modelNote': 'Generated by {model}, prompt {promptVersion}, on {date}.',

  'growth.ui.strategy.snapshotTitle': 'Business snapshot',
  'growth.ui.strategy.channelPriority': 'Priority {rank}',
  'growth.ui.strategy.channelFormats': 'Native formats',
  'growth.ui.strategy.pillarProof': 'Proof this pillar leans on',
  'growth.ui.strategy.pillarProofNone': 'No approved proof. Keep this pillar descriptive.',
  'growth.ui.strategy.cadenceCaption': 'Posts per week by channel',
  'growth.ui.strategy.cadenceColumn.channel': 'Channel',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Posts per week',
  'growth.ui.strategy.cadenceTotal': 'Total per week',
  'growth.ui.strategy.capacityWarning':
    'This cadence is {planned} posts a week against a stated capacity of {capacity} hours. Reduce it or raise the capacity in the profile.',
  'growth.ui.strategy.measurementBody':
    'Compared against your own trailing posts on the same channel and format. No external benchmark is used, because none is comparable to your account.',
  'growth.ui.strategy.localeAdaptations': 'Language notes',

  'growth.ui.fourWeek.caption': 'Proposed briefs by week and day',
  'growth.ui.fourWeek.column.date': 'Date',
  'growth.ui.fourWeek.column.channel': 'Channel',
  'growth.ui.fourWeek.column.pillar': 'Pillar',
  'growth.ui.fourWeek.column.format': 'Format',
  'growth.ui.fourWeek.column.brief': 'Brief',
  'growth.ui.fourWeek.column.cta': 'Call to action',
  'growth.ui.fourWeek.column.measurement': 'Measurement tag',
  'growth.ui.fourWeek.column.actions': 'Actions',
  'growth.ui.fourWeek.approvalRequired': 'Approval required before it can publish',
  'growth.ui.fourWeek.approvalNotRequired': 'No approval required for this account',
  'growth.ui.fourWeek.noCta': 'No call to action',
  'growth.ui.fourWeek.weekEmpty': 'No briefs proposed for this week.',
  'growth.ui.fourWeek.acceptedCount': '{accepted} of {total} briefs accepted as drafts',
  'growth.ui.fourWeek.acceptAnnouncement': 'Draft created from this brief.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Calendar proposal added for {date}.',

  'growth.ui.ugc.promptAngle': 'Angle {number}',
  'growth.ui.ugc.checklistTitle': 'Rights, consent and disclosure',
  'growth.ui.ugc.checklistHelp':
    'Work through this with each participant before anything is published. Consent to appear is not consent to advertise.',
  'growth.ui.ugc.incentiveNone': 'No incentive offered',
  'growth.ui.ugc.incentiveDisclosure':
    'An incentive must be disclosed on every post that results from it, by you and by the participant.',
  'growth.ui.ugc.honesty':
    'This plans a campaign you run with real people. Relay does not find creators, contact them, write testimonials or create customer content.',

  'growth.ui.opportunities.caption':
    'Verified opportunities from the catalog, ranked by fit with your profile',
  'growth.ui.opportunities.column.opportunity': 'Opportunity',
  'growth.ui.opportunities.column.type': 'Type',
  'growth.ui.opportunities.column.audience': 'Audience',
  'growth.ui.opportunities.column.fit': 'Why this fits',
  'growth.ui.opportunities.column.requirements': 'Requirements',
  'growth.ui.opportunities.column.rules': 'Self promotion rules',
  'growth.ui.opportunities.column.cost': 'Cost',
  'growth.ui.opportunities.column.effort': 'Effort',
  'growth.ui.opportunities.column.verified': 'Last verified',
  'growth.ui.opportunities.column.actions': 'Actions',
  'growth.ui.opportunities.costFree': 'Free',
  'growth.ui.opportunities.effort.low': 'Low',
  'growth.ui.opportunities.effort.medium': 'Medium',
  'growth.ui.opportunities.effort.high': 'High',
  'growth.ui.opportunities.noRequiredAsset': 'No asset required',
  'growth.ui.opportunities.prepareTitle': 'Prepare a submission for {name}',
  'growth.ui.opportunities.prepareRules': 'Their rules, quoted',
  'growth.ui.opportunities.prepareChecklist': 'What to have ready',
  'growth.ui.opportunities.prepareManual':
    'You submit this yourself on their site. Relay does not fill in forms, create accounts or email anyone.',
  'growth.ui.opportunities.pitchTitle': 'Pitch draft',
  'growth.ui.opportunities.pitchHelp':
    'Edit it before you send it. It uses only the facts you confirmed.',
  'growth.ui.opportunities.submittedOn': 'Submitted {date}',
  'growth.ui.opportunities.staleTitle': 'Some entries need re-verification',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# entry is past its review date} other {# entries are past their review date}}. Check the current rules on the site before you rely on them.',
  'growth.ui.opportunities.emptyExample':
    'A catalog row carries the official URL, the audience, the submission rules quoted from the site, the cost, the effort and the date a person last checked it.',

  'growth.ui.tools.shown': '{shown} of {max} shown',
  'growth.ui.tools.fewerThanMax':
    'Only {count, plural, one {# tool matches} other {# tools match}} this workflow with a current review. We would rather show fewer than pad the list.',
  'growth.ui.tools.emptyTitle': 'No reviewed tool fits this workflow yet',
  'growth.ui.tools.emptyBody':
    'Every entry needs a checked price, checked rights terms and a named limitation before it appears here.',
  'growth.ui.tools.emptyExample':
    'An entry says what it is best for, why it fits your plan, what it cannot do, the skills it needs, how the output comes back into Relay, and when the price was last checked.',
  'growth.ui.tools.openSite': 'Open the official site for {name}',
  'growth.ui.tools.stale': 'Past its review date. Excluded from generated plans.',

  'growth.ui.item.explainTitle': 'Why this was suggested',
  'growth.ui.item.explainEvidence': 'What it is based on',
  'growth.ui.item.explainNoEvidence':
    'This came from the objective and the channel rules, not from a confirmed fact about your business.',
  'growth.ui.item.dismissTitle': 'Dismiss this suggestion',
  'growth.ui.item.dismissBody':
    'Tell us why. The reason is stored with the plan and shapes the next version.',
  'growth.ui.item.dismissReasonLabel': 'Reason',
  'growth.ui.item.dismissReason.notRelevant': 'Not relevant to this business',
  'growth.ui.item.dismissReason.noCapacity': 'We do not have the capacity',
  'growth.ui.item.dismissReason.wrongAudience': 'Wrong audience',
  'growth.ui.item.dismissReason.alreadyDone': 'We already do this',
  'growth.ui.item.dismissReason.policy': 'Against our policy or claims',
  'growth.ui.item.dismissReason.other': 'Something else',
  'growth.ui.item.dismissNote': 'Anything you want to add',
  'growth.ui.item.dismissed': 'Dismissed. It stays visible so you can undo it.',
  'growth.ui.item.undoDismiss': 'Undo dismiss',

  'growth.ui.export.title': 'Export this plan',
  'growth.ui.export.formatLabel': 'Format',
  'growth.ui.export.copy': 'Copy to clipboard',
  'growth.ui.export.download': 'Download file',
  'growth.ui.export.copied': 'Plan copied to the clipboard.',
  'growth.ui.export.schemaNote':
    'All three formats come from one validated schema, version {version}. The structured views are safe for source control and contain no secrets.',
  'growth.ui.export.previewLabel': 'Export preview',
} as const;
