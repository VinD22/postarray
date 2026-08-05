/**
 * The web application shell: Home, the command palette, the Action center
 * queue chrome, the demo data notice, and the parts of sign in and onboarding
 * that the shared `auth`, `onboarding` and `billing` catalogs do not cover.
 *
 * Owned by the web shell. Screen catalogs (composer, calendar, analytics)
 * belong to their own files.
 */
export const webShellMessages = {
  /* -- Document and shell chrome ----------------------------------------- */
  'shell.appName': 'Relay',
  'shell.documentTitle': '{page} · Relay',
  'shell.tagline': 'A publishing desk for people and agents.',
  'shell.menu.open': 'Open the menu',
  'shell.menu.title': 'Menu',
  'shell.nav.more': 'More',
  'shell.help.title': 'Help',
  'shell.help.documentation': 'Documentation',
  'shell.help.keyboardShortcuts': 'Keyboard shortcuts',
  'shell.help.platformStatus': 'Platform status',
  'shell.help.whatChanged': 'What changed',
  'shell.help.contactSupport': 'Contact support',
  'shell.account.settings': 'Settings',
  'shell.account.profile': 'Your profile',
  'shell.workspace.create': 'Create a workspace',
  'shell.workspace.manage': 'Workspace settings',
  'shell.workspace.role': 'You are {role} here',
  'shell.brand.filterHint': 'Filtering Home, Calendar and Analytics to this brand.',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Demo data',
  'shell.demo.title': 'You are looking at demo data',
  'shell.demo.body':
    'The Relay API is not reachable from this browser, so the screens are filled with a seeded example workspace. Nothing here is connected to a real account and nothing can publish.',
  'shell.demo.howToConnect': 'Set NEXT_PUBLIC_RELAY_API_URL and restart the app to use live data.',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'You are offline',
  'shell.offline.body':
    'Drafts are kept on this device. Scheduling and publishing resume when the connection returns.',
  'shell.offline.retry': 'Check the connection',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Open the command palette',
  'palette.title': 'Command palette',
  'palette.description': 'Search for a screen, an account or an action.',
  'palette.placeholder': 'Type a command or a screen name',
  'palette.empty': 'Nothing matches {query}.',
  'palette.group.actions': 'Actions',
  'palette.group.goTo': 'Go to',
  'palette.group.workspaces': 'Workspaces',
  'palette.group.settings': 'Settings',
  'palette.hint.navigate': 'Move with the arrow keys',
  'palette.hint.select': 'Open with Enter',
  'palette.hint.close': 'Close with Escape',
  'palette.action.compose': 'Compose a post',
  'palette.action.connectAccount': 'Connect an account',
  'palette.action.openActionCenter': 'Open the Action center',
  'palette.action.uploadMedia': 'Upload media',
  'palette.action.createRule': 'Create an automation rule',
  'palette.action.toggleTheme': 'Switch the theme',
  'palette.action.signOut': 'Sign out',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Open the Action center',
  'actionCenter.group.now.label': 'Now',
  'actionCenter.group.soon.label': 'Soon',
  'actionCenter.group.watching.label': 'Watching',
  'actionCenter.group.now.hint': 'Publishing is at risk until these are handled.',
  'actionCenter.group.soon.hint': 'These have a deadline you can still meet.',
  'actionCenter.group.watching.hint': 'Not urgent. Worth a look this week.',
  'actionCenter.severity.now': 'Needs you now',
  'actionCenter.severity.soon': 'Needs you soon',
  'actionCenter.severity.watching': 'Watching',
  'actionCenter.filter.all': 'All',
  'actionCenter.filter.connections': 'Connections',
  'actionCenter.filter.publishing': 'Publishing',
  'actionCenter.filter.automation': 'Automation',
  'actionCenter.filter.billing': 'Billing',
  'actionCenter.snoozed': 'Snoozed',
  'actionCenter.snoozeOneDay': 'Snooze for a day',
  'actionCenter.snoozedUntil': 'Snoozed until {date}',
  'actionCenter.unsnooze': 'Bring this back',
  'actionCenter.resolved': 'Resolved {relativeTime}',
  'actionCenter.emptyFiltered': 'Nothing in this group needs attention.',
  'actionCenter.errorTitle': 'The Action center could not load',
  'actionCenter.loading': 'Loading what needs attention',
  'actionCenter.affectedAccount': 'Affects {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Nothing needs attention} one {# item} other {# items}}',
  'actionCenter.action.reconnect': 'Reconnect',
  'actionCenter.action.openReceipt': 'Open the receipt',
  'actionCenter.action.review': 'Review',
  'actionCenter.action.openDraft': 'Open the draft',
  'actionCenter.action.openCalendar': 'Open the calendar',
  'actionCenter.action.viewStatus': 'View status',
  'actionCenter.action.checkFeed': 'Check the feed',
  'actionCenter.action.inspectDeliveries': 'Inspect deliveries',
  'actionCenter.action.addBalance': 'Review usage',
  'actionCenter.action.fixConnection': 'Fix the connection',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Home',
  'home.subtitle': 'What needs you today, and what goes out next.',
  'home.greetingSummary':
    '{actions, plural, =0 {Nothing needs you right now} one {# item needs you} other {# items need you}}. {upcoming, plural, =0 {Nothing is scheduled in the next 24 hours} one {# post goes out in the next 24 hours} other {# posts go out in the next 24 hours}}.',
  'home.needsYou.title': 'Needs you now',
  'home.needsYou.empty': 'Nothing needs you right now.',
  'home.needsYou.emptyBody':
    'Connection health, approvals and failed publishes appear here the moment they happen.',
  'home.needsYou.viewAll': 'Open the Action center',
  'home.upcoming.title': 'Next 24 hours',
  'home.upcoming.empty': 'Nothing is scheduled in the next 24 hours.',
  'home.upcoming.emptyBody': 'Write a post and pick a time. You can change it later.',
  'home.upcoming.viewAll': 'Open the calendar',
  'home.upcoming.timeZoneNote': 'Times are shown in {timeZone}, the workspace zone.',
  'home.upcoming.columnTime': 'Time',
  'home.upcoming.columnAccount': 'Account',
  'home.upcoming.columnContent': 'Content',
  'home.upcoming.columnStatus': 'Status',
  'home.receipts.title': 'Recent receipts',
  'home.receipts.empty': 'No posts have published from this workspace yet.',
  'home.receipts.emptyBody': 'Every publication produces a receipt you can inspect and share.',
  'home.receipts.viewAll': 'All receipts',
  'home.receipts.publishedTo': 'Published to {account}',
  'home.connections.title': 'Connection health',
  'home.connections.summary':
    '{healthy, plural, one {# account is working} other {# accounts are working}}. {attention, plural, =0 {None need attention} one {# needs attention} other {# need attention}}.',
  'home.connections.viewAll': 'All connections',
  'home.connections.empty': 'No accounts connected yet.',
  'home.advisor.title': 'Growth advisor',
  'home.advisor.summary':
    'Plan version {version} was approved {date}. Week {week} of {total} has {briefs, plural, one {# brief not yet drafted} other {# briefs not yet drafted}}.',
  'home.advisor.noPlan':
    'The advisor builds a plan from facts you confirm. It proposes work and never publishes on its own.',
  'home.advisor.openPlan': 'Open the plan',
  'home.advisor.createDrafts': 'Create drafts from week {week}',
  'home.advisor.start': 'Start the business profile',
  'home.trial.banner':
    'Trial, {days, plural, =0 {ends today} one {# day left} other {# days left}}. Converts {date} to {amount}.',
  'home.trial.manage': 'Manage or cancel',
  'home.error.title': 'Home could not load',
  'home.error.body': 'Your workspace is intact. This is a problem reaching the Relay API.',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title': 'Publish through official APIs and see exactly what happened.',
  'auth.aside.point.receipts':
    'Every publication produces a receipt: who approved it, when it dispatched, what the platform returned.',
  'auth.aside.point.approvals': 'Nothing reaches a platform without the approval your policy requires.',
  'auth.aside.point.surfaces': 'The same workflow from the web app, the REST API, MCP, the CLI and webhooks.',
  'auth.provider.title': 'Before you continue',
  'auth.provider.google.access':
    'Google shares your name, email address and profile picture with Relay. Relay cannot read your Gmail, Drive or Calendar.',
  'auth.provider.facebook.access':
    'Facebook shares your name, email address and profile picture with Relay. Connecting a Page to publish to is a separate step you approve later.',
  'auth.provider.note': 'This signs you in. It does not connect an account to publish to.',
  'auth.continueWithEmail': 'Continue with email',
  'auth.method.password': 'Password',
  'auth.method.magicLink': 'Email link',
  'auth.method.username': 'Username',
  'auth.method.chooseLabel': 'How do you want to sign in?',
  'auth.username.placeholder': 'your-username',
  'auth.username.aliasNote':
    'A username is an alias for the email address on your account. The password is the same one.',
  'auth.password.placeholder': 'Your password',
  'auth.submit.signIn': 'Sign in',
  'auth.submit.signUp': 'Create account',
  'auth.submit.working': 'Checking',
  'auth.failure.credentials':
    'That email address and password do not match an account. Check both and try again.',
  'auth.failure.usernameCredentials':
    'That username and password do not match an account. Check both and try again.',
  'auth.failure.noAccountLeak':
    'For your safety we do not say whether an address is registered.',
  'auth.failure.provider': 'The sign in with {provider} did not complete. Nothing was changed.',
  'auth.failure.network': 'We could not reach Relay. Check your connection and try again.',
  'auth.signUp.trialNote': 'Seven full trial days. A payment method is required. $0 due today.',
  'auth.signUp.emailInUseNote':
    'If this address already has an account, we email a sign in link instead of creating a second one.',
  'auth.legal.readTerms': 'Read the Terms',
  'auth.legal.readPrivacy': 'Read the Privacy Notice',
  'auth.switchToSignUp': 'Create an account',
  'auth.switchToSignIn': 'Sign in instead',
  'auth.checkEmail.body': 'We sent a sign in link to {email}. It works once.',
  'auth.checkEmail.wrongAddress': 'Use a different address',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Billing',
  'onboarding.stepName.workspace': 'Workspace',
  'onboarding.stepName.role': 'Use case',
  'onboarding.stepName.connect': 'Connect',
  'onboarding.stepName.compose': 'First post',
  'onboarding.stepName.receipt': 'Confirmation',
  'onboarding.stepList': 'Setup steps',
  'onboarding.stepComplete': 'Done',
  'onboarding.stepCurrent': 'Current step',
  'onboarding.exit': 'Finish later',
  'onboarding.plan.intervalMonthlyLabel': '$29 per month',
  'onboarding.plan.intervalAnnualLabel': '$300 per year',
  'onboarding.plan.checkoutHint':
    'The next screen is Polar, our merchant of record. Access is granted when Polar confirms the subscription, not when the browser comes back.',
  'onboarding.plan.factsTitle': 'What happens when you continue',
  'onboarding.workspace.help':
    'A workspace holds your brands, connected accounts, drafts and receipts. You can create more later.',
  'onboarding.workspace.localeNote':
    'The interface is English in this version. Content languages are chosen per post and are separate from this setting.',
  'onboarding.workspace.timeZoneDetected': 'Detected from this device: {timeZone}',
  'onboarding.connect.permissionsTitle': 'What {provider} will be asked for',
  'onboarding.connect.permissionsFooter':
    'Relay never asks for a permission it does not use, and you can disconnect at any time.',
  'onboarding.connect.chooseProvider': 'Choose a platform',
  'onboarding.connect.opensProvider': 'Continuing opens {provider} in this tab.',
  'onboarding.compose.help':
    'Write the post, then check the preview and the validation before you pick a time.',
  'onboarding.compose.openComposer': 'Open the full composer',
  'onboarding.receipt.title': 'Your first post is scheduled',
  'onboarding.receipt.body':
    'Here is the record so far. It keeps updating through dispatch, the provider response and the first analytics sync.',
  'onboarding.receipt.goHome': 'Go to Home',
  'onboarding.blocked.title': 'This step needs the previous one',
  'onboarding.blocked.body': 'Finish {step} first. Nothing you entered is lost.',
} as const;
