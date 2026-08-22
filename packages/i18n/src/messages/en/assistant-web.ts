/**
 * The assistant screen in the web app.
 *
 * The person reading this screen is someone who posts, not someone who
 * operates software. Every sentence here is written for them: it says what the
 * assistant is offering, it says plainly that a suggestion is a suggestion, and
 * before anything is written it says exactly what will happen, to which
 * accounts, with what text, at what time, in the workspace's own time zone.
 *
 * Nothing in this namespace promises an action that has not happened yet, and
 * nothing implies the assistant can act on its own.
 */
export const assistantWebMessages = {
  'assistantWeb.title': 'Assistant',
  'assistantWeb.subtitle':
    'Say what you want. It suggests, you decide, nothing happens on its own.',

  'assistantWeb.empty.title': 'Tell it what you want, in your own words.',
  'assistantWeb.empty.body':
    'It can plan a week of posts, suggest other ways to open one, tell you what is going out, and get a post ready for you to approve. It never posts anything by itself.',
  'assistantWeb.empty.promptsLabel': 'Things people ask',
  'assistantWeb.empty.promptPlan': 'Plan my week of posts.',
  'assistantWeb.empty.promptWeek': 'What is going out this week?',
  'assistantWeb.empty.promptFailures': 'Did anything fail to post?',
  'assistantWeb.empty.promptCaption': 'Suggest another way to open this post.',
  'assistantWeb.empty.reassurance':
    'You can change your mind at any point. Nothing is written until you approve it.',

  'assistantWeb.input.label': 'What would you like to do?',
  'assistantWeb.input.placeholder': 'Ask for a plan, a caption, or what is going out this week.',
  'assistantWeb.input.send': 'Send',
  'assistantWeb.input.hint': 'Plain words work best. There is nothing to learn.',

  'assistantWeb.turn.you': 'You',
  'assistantWeb.turn.assistant': 'Assistant',
  'assistantWeb.turn.working': 'Reading your workspace and writing a reply.',
  'assistantWeb.turn.workingNote': 'Nothing has changed while this runs.',
  'assistantWeb.turn.suggestionBadge': 'Suggestion',
  'assistantWeb.turn.suggestionNote': 'This is a suggestion, not a record of what happened.',
  'assistantWeb.turn.provenance': 'Suggested by {provider} {model}.',
  'assistantWeb.turn.degraded':
    'Written from your own settings this time, without the writing model.',

  'assistantWeb.subject.label': 'The post this is about',
  'assistantWeb.subject.none': 'No post chosen yet.',
  'assistantWeb.subject.choose': 'Choose a post',
  'assistantWeb.subject.needed': 'Choose which post you mean, then ask again.',
  'assistantWeb.subject.untitled': 'Untitled post',
  'assistantWeb.subject.composerOnly':
    'This one is done in the composer, where you can see the post as each account will show it.',
  'assistantWeb.subject.openComposer': 'Open in the composer',

  'assistantWeb.confirm.title': 'Before anything happens',
  'assistantWeb.confirm.body':
    'Nothing has been written yet. Read this, and approve it only if it is what you want.',
  'assistantWeb.confirm.accountsLabel': 'Accounts this reaches',
  'assistantWeb.confirm.accountsUnavailable': 'Which accounts this reaches is unavailable.',
  'assistantWeb.confirm.accountCount': '{count, plural, one {# account} other {# accounts}}',
  'assistantWeb.confirm.textLabel': 'The text',
  'assistantWeb.confirm.textUnavailable': 'This action does not change any text.',
  'assistantWeb.confirm.timeLabel': 'The time',
  'assistantWeb.confirm.timeValue': '{dateTime} ({timeZone})',
  'assistantWeb.confirm.timeUnavailable': 'This action does not set a time.',
  'assistantWeb.confirm.zoneNote': 'Times are shown in your workspace time zone.',
  'assistantWeb.confirm.noteLabel': 'Note to whoever approves it',
  'assistantWeb.confirm.expires': 'This approval expires {dateTime}.',
  'assistantWeb.confirm.approve': 'Approve and do it',
  'assistantWeb.confirm.cancel': 'Not now',
  'assistantWeb.confirm.cancelled': 'Cancelled. Nothing was written.',
  'assistantWeb.confirm.applied': 'Done. You approved it, so it went through.',
  'assistantWeb.confirm.openConfirmation': 'Open the full approval screen',
  'assistantWeb.confirm.proposalTitle': 'A proposal only',
  'assistantWeb.confirm.working': 'Approving. Do not close this screen.',

  'assistantWeb.overBudget.title': 'This workspace has used its AI allowance for the month.',
  'assistantWeb.overBudget.body':
    'The assistant cannot write anything else until the allowance starts again. Nothing you have already made is affected, and you can still write, schedule and publish posts yourself.',
  'assistantWeb.overBudget.reset': 'The allowance starts again {dateTime}.',
  'assistantWeb.overBudget.resetUnknown': 'We do not have a date for when it starts again.',
  'assistantWeb.overBudget.compose': 'Write a post yourself',

  'assistantWeb.result.planTitle': 'A suggested week. Nothing is scheduled.',
  'assistantWeb.result.planSlot': 'Day {day} at {time}',
  'assistantWeb.result.planEmpty': 'No posts were suggested.',
  'assistantWeb.result.weekTitle': 'What is scheduled',
  'assistantWeb.result.weekEmpty': 'Nothing is scheduled for that period.',
  'assistantWeb.result.weekMore': 'There is more than this. The calendar shows all of it.',
  'assistantWeb.result.openCalendar': 'Open the calendar',
  'assistantWeb.result.failuresTitle': 'What failed, and the reason recorded at the time',
  'assistantWeb.result.failuresEmpty': 'Nothing failed.',
  'assistantWeb.result.captionsTitle': 'Other ways to open this post',
  'assistantWeb.result.captionsEmpty': 'No other openings were suggested.',
  'assistantWeb.result.copy': 'Copy this text',
  'assistantWeb.result.copied': 'Copied.',

  'assistantWeb.error.title': 'That did not go through.',
  'assistantWeb.error.body': 'Nothing was changed. You can ask again.',
  'assistantWeb.error.retry': 'Ask again',
} as const;
