/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Set up Relay',
  'onboarding.progress': 'Step {current} of {total}',
  'onboarding.skipForNow': 'Skip for now',
  'onboarding.goal': 'A verified scheduled post in under ten minutes.',

  'onboarding.plan.title': 'Choose how you want to pay',
  'onboarding.plan.help': 'One plan, every feature. Change the interval whenever you like.',

  'onboarding.workspace.title': 'Name your workspace',
  'onboarding.workspace.help':
    'Your workspace holds billing and teammates. We will create its first project with the same name, and you can add more projects later.',
  'onboarding.workspace.namePlaceholder': 'Your company or client name',
  'onboarding.workspace.timeZone': 'Time zone for scheduling',
  'onboarding.workspace.timeZoneHelp':
    'Every scheduled time is stored with this zone, so a clock change never moves your post by accident.',
  'onboarding.workspace.locale': 'Interface language',

  'onboarding.role.title': 'What describes you best?',
  'onboarding.role.creator': 'Creator',
  'onboarding.role.team': 'In house team',
  'onboarding.role.agency': 'Agency',
  'onboarding.role.developer': 'Developer or agent builder',
  'onboarding.role.help': 'This changes the defaults we suggest. You can change everything later.',

  'onboarding.connect.title': 'Connect your first account',
  'onboarding.connect.help':
    'We will show you exactly which permissions each platform is asked for before you approve anything.',
  'onboarding.connect.skipNote':
    'You can explore with the sample account first. Nothing publishes from it.',
  'onboarding.connect.success': '{account} is connected.',

  'onboarding.content.title': 'Start with something you already have',
  'onboarding.content.useAsset': 'Use an image or video',
  'onboarding.content.useBrief': 'Start from a short brief',
  'onboarding.content.useText': 'Write it yourself',

  'onboarding.preview.title': 'This is what will publish',
  'onboarding.preview.help': 'A real preview from the platform rules for this account.',

  'onboarding.schedule.title': 'Choose when it goes out',
  'onboarding.schedule.help':
    'Review the time, the privacy setting, the disclosure and the estimated provider cost.',

  'onboarding.done.title': 'Scheduled',
  'onboarding.done.body': 'Your post is scheduled for {time} in {timeZone}.',
  'onboarding.done.nextStep.title': 'What to do next',
  'onboarding.done.nextStep.connectMore': 'Connect another account',
  'onboarding.done.nextStep.inviteTeam': 'Invite a teammate',
  'onboarding.done.nextStep.setApproval': 'Set an approval policy',
  'onboarding.done.nextStep.exploreApi': 'Explore the API and MCP server',

  'onboarding.checklist.title': 'Getting started',
  'onboarding.checklist.connectAccount': 'Connect an account',
  'onboarding.checklist.firstPost': 'Publish or schedule a post',
  'onboarding.checklist.inviteTeammate': 'Invite a teammate',
  'onboarding.checklist.setBrandVoice': 'Describe the project voice',
  'onboarding.checklist.tryAutomation': 'Try an automation rule',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {All done} one {# step left} other {# steps left}}',

  /* -- Accounts that came back from a provider consent screen ------------ */
  'onboarding.live.connectedHeading': 'Already connected',
  'onboarding.live.connected': 'Connected',
  'onboarding.live.connectedNote':
    'One account is enough to reach a first post. You can add the rest later.',
} as const;
