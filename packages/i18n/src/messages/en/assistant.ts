/**
 * The assistant.
 *
 * Every sentence here says what the assistant did, in the past tense, and says
 * plainly when it did nothing. Nothing in this catalog claims a suggestion is a
 * fact, and nothing promises an action that has not happened yet.
 */
export const assistantMessages = {
  'assistant.tool.plan_week': 'Draft a week of posts for this project.',
  'assistant.tool.suggest_caption': 'Suggest other ways to open this post.',
  'assistant.tool.check_platform_fit': 'Check this post against what the account allows.',
  'assistant.tool.report_week': 'Show what is going out this week.',
  'assistant.tool.report_failures': 'Show what failed, and why.',
  'assistant.tool.draft_post': 'Create a draft.',
  'assistant.tool.adapt_draft_text': 'Rewrite this post for one account.',
  'assistant.tool.schedule_post': 'Put this post in the next queue slot.',
  'assistant.tool.request_approval': 'Send this post for approval.',

  'assistant.turn.plan_week': 'Here is a suggested week. Nothing is scheduled yet.',
  'assistant.turn.suggest_caption': 'Here are some suggested openings. Your draft is unchanged.',
  'assistant.turn.check_platform_fit': 'Here is how this post fits that account right now.',
  'assistant.turn.report_week': 'Here is what is scheduled for that period.',
  'assistant.turn.report_failures': 'Here is what failed, with the reason recorded at the time.',
  'assistant.turn.draft_post': 'This will create a draft once you confirm it.',
  'assistant.turn.adapt_draft_text': 'This will rewrite that account version once you confirm it.',
  'assistant.turn.schedule_post': 'This will schedule the post once you confirm it.',
  'assistant.turn.request_approval': 'This will send the post for approval once you confirm it.',

  'assistant.state.awaiting_confirmation': 'Waiting for you to confirm. Nothing has changed yet.',
  'assistant.state.applied': 'Done. You confirmed this, so it went through.',

  'assistant.blocked.no_confirmable_subject':
    'This is a proposal only. Create the draft in the composer, then the assistant can act on it.',
  'assistant.blocked.confirmation_unavailable':
    'This is a proposal only. This session cannot be given a confirmation to act on.',

  'assistant.error.profile_required':
    'Fill in the business profile first, so a plan is grounded in your own words.',
  'assistant.label.suggestion': 'Suggestion',
} as const;
