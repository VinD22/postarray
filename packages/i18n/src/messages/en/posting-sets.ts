/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 *
 * Three features that all answer "who is this going to, and when", grouped in
 * one namespace so their vocabulary stays consistent. The hold copy is the part
 * most worth reading twice: pausing stops work that has not happened, and every
 * sentence here has to say that plainly rather than implying a post can be
 * pulled back off a platform.
 */
export const postingSetMessages = {
  /* ------------------------------------------------------------- the hold */
  'calendar.hold.action': 'Pause',
  'calendar.hold.resumeAction': 'Resume',
  'calendar.hold.badge': 'Paused',
  'calendar.hold.badgeBilling': 'Paused by billing',
  'calendar.hold.term': 'Hold',
  'calendar.hold.byPerson': 'Paused by you on {date}.',
  'calendar.hold.byBilling': 'Paused on {date} because this workspace lost full access.',
  'calendar.hold.none': 'Not paused',

  'calendar.hold.confirmTitle': 'Pause this post?',
  'calendar.hold.confirmBody':
    'This post will stay where it is and will not go out at {time}. You can resume it at any point before then, or pick a new time if that one has passed.',
  'calendar.hold.confirmScope':
    'Pausing stops what has not happened yet. Anything already published to a platform stays published, and pausing does not delete or edit it.',
  'calendar.hold.confirmNoteLabel': 'Why are you pausing this? (optional)',
  'calendar.hold.confirmNoteHint':
    'Kept on the audit record for your team. It is not sent to any platform.',
  'calendar.hold.confirm': 'Pause this post',
  'calendar.hold.cancel': 'Leave it scheduled',

  'calendar.hold.resumeTitle': 'Resume this post?',
  'calendar.hold.resumeBody': 'It will go out at {time}, in {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'That time has passed',
  'calendar.hold.resumeMissedBody':
    'This post was due at {time} while it was paused. Choose a new time so it does not go out the moment you resume it.',
  'calendar.hold.resumeTimeLabel': 'New publish time',
  'calendar.hold.resumeConfirm': 'Resume',

  'calendar.hold.paused': 'Paused. It will not go out until you resume it.',
  'calendar.hold.resumed': 'Resumed. It goes out at {time}.',

  'calendar.hold.blocked.published':
    'This post has already gone out. Pausing cannot take it back off the platform.',
  'calendar.hold.blocked.inFlight':
    'This post is being sent right now. It is too late to pause it, and stopping halfway could leave it half published.',
  'calendar.hold.blocked.finished': 'This post is already finished, so there is nothing to pause.',
  'calendar.hold.blocked.billing':
    'This post is on hold because the workspace lost full access. Resuming it is a billing matter, not a scheduling one.',
  'calendar.hold.blocked.billingAction': 'Go to billing',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Posting Sets',
  'set.lede':
    'A saved answer to "who am I posting this to, and how". Applying a Set copies its settings into a new draft.',
  'set.appliedOnce':
    'A Set is read once, when you apply it. Editing it later changes what the next post starts from. Drafts and scheduled posts you already made from it stay exactly as they are.',
  'set.empty.title': 'No Sets yet',
  'set.empty.body': 'Create one to stop rebuilding the same list of accounts for every post.',
  'set.create': 'New Set',
  'set.edit': 'Edit Set',
  'set.archive': 'Archive Set',
  'set.archived': 'Archived',
  'set.archivedNote': 'Archived Sets are hidden from the picker. Posts made from them are unchanged.',
  'set.showArchived': 'Show archived',
  'set.saved': 'Set saved.',
  'set.archivedToast': 'Set archived. Posts already made from it are unchanged.',

  'set.field.name': 'Name',
  'set.field.nameHint': 'What you will look for in the picker. One per project.',
  'set.field.description': 'Description',
  'set.field.descriptionHint': 'Optional. What this Set is for.',
  'set.field.targets': 'Accounts',
  'set.field.targetsHint': 'Every account a post made from this Set starts with.',
  'set.field.targetCount': '{count, plural, =0 {No accounts} one {# account} other {# accounts}}',
  'set.field.signature': 'Signature',
  'set.field.signatureNone': 'No signature',
  'set.field.approval': 'Approval',
  'set.field.approvalHint': 'The approval a post made from this Set needs before it can publish.',
  'set.field.schedule': 'When to publish',

  'set.approval.none': 'No approval needed',
  'set.approval.single_approver': 'One named approver',
  'set.approval.any_approver': 'Any approver',
  'set.approval.named_approver': 'A specific approver',
  'set.approval.policy_auto': 'Whatever the workspace policy says',

  'set.slot.next_free_slot': 'Next free slot from the queue',
  'set.slot.next_free_slotHint':
    'Uses this project queue rules to offer a time. It proposes; you accept.',
  'set.slot.pick_time': 'Ask me for a time',
  'set.slot.pick_timeHint': 'Applying the Set leaves the time blank for you to choose.',
  'set.slot.draft_only': 'Leave it as a draft',
  'set.slot.draft_onlyHint': 'Applying the Set does not touch the schedule at all.',
  'set.slot.noRules':
    'This project has no queue rules yet, so the queue will offer the first free hour and say so.',
  'set.slot.rulesLink': 'Queue rules',

  'set.defaults.title': 'Per platform defaults',
  'set.defaults.body':
    'Starting values copied into each new post. You can change any of them in the composer afterwards.',
  'set.defaults.add': 'Add a platform',
  'set.defaults.remove': 'Remove {platform} defaults',
  'set.defaults.privacy': 'Privacy',
  'set.defaults.privacyNone': 'Platform default',
  'set.defaults.bodyPrefix': 'Text before the post',
  'set.defaults.bodySuffix': 'Text after the post',
  'set.defaults.requireAltText': 'Require alt text on every image',
  'set.defaults.requireAltTextHint':
    'A post made from this Set cannot be scheduled to this platform until every image has alt text.',
  'set.defaults.empty': 'No per platform defaults. Every account starts from the master post.',

  'set.error.nameTaken': 'Another Set in this project already uses that name.',
  'set.error.archived': 'This Set is archived. Restore it before editing.',
  'set.error.duplicateTarget': 'That account is already in this Set.',
  'set.error.duplicatePlatform': 'This Set already has defaults for that platform.',

  /* --------------------------------------------------- remembered targets */
  'targetMemory.setting.title': 'Remember accounts between posts',
  'targetMemory.setting.body':
    'When this is on, the composer starts each new post with the accounts that person picked last time in this project. It is off unless you turn it on.',
  'targetMemory.setting.stored':
    'Only the list of accounts is kept, and only for the person who picked them. No caption, no time, no privacy setting and no approval state is stored, and nobody else in the project can see your list.',
  'targetMemory.setting.offNote': 'While this is off, nothing is stored at all.',
  'targetMemory.setting.turnOffWarning':
    'Turning this off deletes every saved selection in this project, for everyone.',
  'targetMemory.setting.enabled': 'On',
  'targetMemory.setting.disabled': 'Off',
  'targetMemory.setting.saved': 'Setting saved.',
  'targetMemory.setting.cleared': 'Setting saved. Saved selections in this project were deleted.',

  'targetMemory.composer.restored':
    '{count, plural, one {Started with # account from last time.} other {Started with # accounts from last time.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {# account you used last time was left out because it needs attention.} other {# accounts you used last time were left out because they need attention.}}',
  'targetMemory.composer.droppedAll':
    'None of the accounts you used last time are available right now, so nothing was preselected.',
  'targetMemory.composer.undo': 'Clear selection',
  'targetMemory.composer.forget': 'Stop remembering my accounts',
  'targetMemory.composer.forgotten': 'Your saved selection was deleted.',
  'targetMemory.composer.reviewAccounts': 'Review accounts',
} as const;
