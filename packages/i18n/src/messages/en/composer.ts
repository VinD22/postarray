/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Compose',
  'composer.titleWithProject': 'Compose for {project}',
  'composer.master.label': 'Master draft',
  'composer.master.description':
    'Write once here. Compatible changes reach every selected target. Open a target to write a version only that account will receive.',
  'composer.master.globalEdit': 'Global edit',
  'composer.master.placeholder': 'What do you want to publish?',
  'composer.brief.label': 'Brief',
  'composer.brief.placeholder': 'Describe the idea, the audience and the outcome you want.',
  'composer.sources.label': 'Source references',
  'composer.sources.empty': 'No sources attached.',
  'composer.campaign.label': 'Campaign',
  'composer.campaign.none': 'No campaign',
  'composer.contentLocale.label': 'Content language',
  'composer.contentLocale.help':
    'The language of the post. This is separate from your interface language.',
  'composer.market.label': 'Audience market',

  'composer.targets.title': 'Targets',
  'composer.targets.count':
    '{count, plural, =0 {No accounts selected} one {# account} other {# accounts}}',
  'composer.targets.publishSummary':
    '{count, plural, one {This will publish to # account} other {This will publish to # accounts}} {when, select, now {now} scheduled {at the scheduled time} other {}}',
  'composer.targets.add': 'Add accounts',
  'composer.targets.empty': 'Select at least one account to publish to.',
  'composer.targets.state.ready': 'Ready',
  'composer.targets.state.inherited': 'Inherited from master',
  'composer.targets.state.overridden': 'Overridden',
  'composer.targets.state.warning': 'Check before publishing',
  'composer.targets.state.error': 'Needs a fix',
  'composer.targets.state.approvalNeeded': 'Approval needed',
  'composer.targets.overrideBadge': 'Override',
  'composer.targets.resetConfirm.title': 'Reset this target to the master draft?',
  'composer.targets.resetConfirm.body':
    'The copy, media and settings you changed for {account} will be replaced by the master draft. Other targets are not affected.',
  'composer.targets.divergence':
    '{count, plural, one {# target differs from the master draft} other {# targets differ from the master draft}}',

  'composer.applyToAll.title': 'Apply to all targets',
  'composer.applyToAll.compatible':
    '{count, plural, one {# field is compatible with every selected target} other {# fields are compatible with every selected target}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# field cannot be applied and stays per target} other {# fields cannot be applied and stay per target}}',
  'composer.applyToAll.creates': 'Applying creates an explicit version for each target.',

  'composer.editor.label': 'Post text',
  'composer.editor.characterCount': '{used} of {limit} characters',
  'composer.editor.characterCountOver': '{over} characters over the {limit} character limit',
  'composer.editor.characterCountUnknown': 'Character limit unavailable for this account',
  'composer.editor.remaining': '{count, plural, one {# character left} other {# characters left}}',
  'composer.editor.hashtagCount': '{count, plural, one {# hashtag} other {# hashtags}}',
  'composer.editor.formatting': 'Formatting',
  'composer.editor.emoji': 'Emoji',
  'composer.editor.mention': 'Mention',
  'composer.editor.link': 'Link',

  'composer.mentions.search': 'Search people, pages and companies',
  'composer.mentions.searching': 'Searching {provider}',
  'composer.mentions.resolved': 'Tagged {label} on {provider}',
  'composer.mentions.unresolved':
    'This mention has not been matched to a {provider} account yet. It will publish as plain text until you select a result.',
  'composer.mentions.noResults': 'No matching accounts on {provider}.',
  'composer.mentions.unsupported': 'Native tagging is not available for this account.',

  'composer.destination.label': 'Destination',
  'composer.destination.placeholder': 'Choose where this publishes',
  'composer.destination.community': 'Community',
  'composer.destination.board': 'Board',
  'composer.destination.group': 'Group',
  'composer.destination.page': 'Page',
  'composer.destination.organization': 'Organization',
  'composer.destination.channel': 'Channel',
  'composer.destination.refresh': 'Refresh destinations',
  'composer.destination.lastRefreshed': 'Destinations refreshed {relativeTime}',

  'composer.media.title': 'Media',
  'composer.media.count': '{count, plural, one {# file} other {# files}}',
  'composer.media.dropHint': 'Drag files here or browse your library.',
  'composer.media.inheritFromMaster': 'Using the master media',
  'composer.media.overridden': 'This target uses its own media',
  'composer.media.altText.label': 'Alt text',
  'composer.media.altText.placeholder': 'Describe the image for people using a screen reader.',
  'composer.media.altText.missing': 'Alt text is missing.',
  'composer.media.altText.waive': 'This image does not need alt text',
  'composer.media.altText.generate': 'Write alt text',
  'composer.media.crop': 'Crop',
  'composer.media.resize': 'Resize',
  'composer.media.rotate': 'Rotate',
  'composer.media.compress': 'Compress',
  'composer.media.convertFormat': 'Convert format',
  'composer.media.thumbnail': 'Thumbnail',
  'composer.media.aspectPreset': 'Platform preset',
  'composer.media.original': 'Original',
  'composer.media.originalPreserved': 'The original file is kept. Edits create a new version.',
  'composer.media.uploading': 'Uploading {name}',
  'composer.media.processing': 'Preparing {name}',
  'composer.media.rights.label': 'Rights and consent',
  'composer.media.rights.confirm':
    'I have the rights to publish this media, including any people, music, logos and brands in it.',

  'composer.sequence.title': 'Comments and thread',
  'composer.sequence.root': 'Main post',
  'composer.sequence.item': 'Item {position}',
  'composer.sequence.add': 'Add comment or thread item',
  'composer.sequence.delayLabel': 'Delay after the previous item',
  'composer.sequence.delayImmediate': 'Immediately',
  'composer.sequence.delayMinutes': '{count, plural, one {# minute} other {# minutes}}',
  'composer.sequence.delayCustom': 'Custom delay',
  'composer.sequence.accountLabel': 'Publish this item as',
  'composer.sequence.unsupported': 'This account does not support scheduled follow up items.',

  'composer.repeat.title': 'Repeat',
  'composer.repeat.off': 'Do not repeat',
  'composer.repeat.everyDays': '{count, plural, one {Every day} other {Every # days}}',
  'composer.repeat.endLabel': 'Stop repeating',
  'composer.repeat.endOnDate': 'On a date',
  'composer.repeat.endAfterCount': 'After a number of posts',
  'composer.repeat.endRequired': 'Choose an end date or a number of repeats.',
  'composer.repeat.summary':
    'Repeats {cadence} until {end}. Each occurrence gets its own approval and receipt.',

  'composer.links.title': 'Links',
  'composer.links.keepOriginal': 'Keep the original URL',
  'composer.links.track': 'Replace with a tracked short link',
  'composer.links.utm': 'UTM parameters',
  'composer.links.domain': 'Link domain',
  'composer.links.finalUrl': 'This will publish as {url}',
  'composer.links.frozenAtApproval':
    'The exact short URL and destination are frozen into the approved version.',

  'composer.signature.title': 'Signature',
  'composer.signature.none': 'No signature',
  'composer.signature.autoApplied': 'Signature {name} was added automatically. You can change it.',

  'composer.set.title': 'Sets',
  'composer.set.startFrom': 'Start from a Set',
  'composer.set.continueWithout': 'Continue without a Set',
  'composer.set.applied': 'Applied Set {name}. This draft is now independent of the Set.',

  'composer.validation.title': 'Validation',
  'composer.validation.clean': 'No issues found for the selected targets.',
  'composer.validation.issueCount':
    '{count, plural, one {# issue} other {# issues}} across {targets, plural, one {# target} other {# targets}}',
  'composer.validation.blocking': 'This must be fixed before scheduling.',
  'composer.validation.warning': 'Check this before publishing.',
  'composer.validation.revalidated': 'Rechecked against current platform limits {relativeTime}.',

  'composer.preview.title': 'Preview',
  'composer.preview.forAccount': 'Preview for {account} on {provider}',
  'composer.preview.approximate':
    'This preview uses the platform rules we have recorded. The published post can differ if the platform changes.',
  'composer.preview.unavailable': 'A true preview is not available for this account yet.',

  'composer.cost.title': 'Estimated provider cost',
  'composer.cost.estimate': '{provider} estimates {amount} of API usage for this post.',
  'composer.cost.linkSurcharge':
    '{provider} charges more for posts that contain a URL. Removing the link lowers the estimate.',
  'composer.cost.bulkWarning':
    '{count, plural, one {# publication} other {# publications}} in one action. Review the estimate before you continue.',
  'composer.cost.reconciled': 'Actual usage is reconciled after publishing.',
  'composer.cost.none': 'No metered provider cost for this post.',

  'composer.autosave.saving': 'Saving',
  'composer.autosave.saved': 'Saved {relativeTime}',
  'composer.autosave.offline': 'Offline. Your draft is kept on this device and will sync.',
  'composer.autosave.conflict':
    '{name} edited this draft while you were writing. Review both versions before saving.',
  'composer.autosave.failed': 'Could not save. Your text is still here. Retrying.',

  'composer.ai.title': 'Assist',
  'composer.ai.makeConcise': 'Make more concise',
  'composer.ai.adaptForPlatform': 'Adapt for {provider}',
  'composer.ai.transcreate': 'Transcreate to {language}',
  'composer.ai.checkClaims': 'Check claims',
  'composer.ai.writeAltText': 'Write alt text',
  'composer.ai.suggestHooks': 'Suggest hooks',
  'composer.ai.suggestCta': 'Suggest a call to action',
  'composer.ai.diffTitle': 'Proposed change',
  'composer.ai.diffHelp': 'Nothing changes until you accept it.',
  'composer.ai.working': 'Working on it',
  'composer.ai.sources': 'Based on {count, plural, one {# source} other {# sources}} you approved',
  'composer.ai.uncertain':
    'This phrase has no clean equivalent in {language}. Review it with a native speaker before publishing.',

  'composer.schedule.title': 'Schedule',
  'composer.schedule.dateLabel': 'Date',
  'composer.schedule.timeLabel': 'Time',
  'composer.schedule.timeZoneLabel': 'Time zone',
  'composer.schedule.nextFreeSlot': 'Next free slot',
  'composer.schedule.localAndUtc': '{local} in {timeZone}. {utc} UTC.',
  'composer.schedule.dstWarning':
    'The clocks change in {timeZone} on this date. This post runs at {local}, which is {utc} UTC.',
  'composer.schedule.pastWarning': 'That time has passed. Choose a later time.',
  'composer.schedule.confirmTitle': 'Confirm before scheduling',
  'composer.schedule.confirmPublishNow': 'Confirm before publishing now',
  'composer.schedule.approverLabel': 'Approver',
  'composer.schedule.policyLabel': 'Approval policy',
  'composer.schedule.duplicateWarning':
    'Similar content was published to {account} {relativeTime}. Publishing it again can breach the platform rules on duplicate content.',
  'composer.schedule.cadenceWarning':
    '{account} already has {count, plural, one {# post} other {# posts}} scheduled that day.',
} as const;
