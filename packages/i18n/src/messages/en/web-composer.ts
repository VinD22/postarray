/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
  'composerWeb.pane.targets': 'Target accounts and Sets',
  'composerWeb.pane.master': 'Master draft and shared settings',
  'composerWeb.pane.variant': 'Version for the open target',
  'composerWeb.pane.review': 'Preview, validation, cost and approval',
  'composerWeb.pane.showPreview': 'Show preview',
  'composerWeb.pane.hidePreview': 'Hide preview',
  'composerWeb.pane.previewCollapsed':
    'The preview panel is hidden. Open it to check the final post.',

  'composerWeb.step.targets': 'Targets',
  'composerWeb.step.write': 'Write',
  'composerWeb.step.perTarget': 'Per target',
  'composerWeb.step.review': 'Review',
  'composerWeb.step.progress': 'Step {current} of {total}',
  'composerWeb.step.legend': 'Composer steps',

  'composerWeb.summary.label': 'Draft summary',
  'composerWeb.summary.targets':
    '{count, plural, =0 {No targets} one {# target} other {# targets}}',
  'composerWeb.summary.issues': '{count, plural, =0 {No issues} one {# issue} other {# issues}}',
  'composerWeb.summary.notScheduled': 'No time chosen',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Cost not priced yet',
  'composerWeb.summary.openReview': 'Open review',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Master draft',
  'composerWeb.rail.masterHint': 'Edit here to reach every target that still inherits.',
  'composerWeb.rail.accountsHeading': 'Target accounts',
  'composerWeb.rail.setsHeading': 'Sets and groups',
  'composerWeb.rail.setsHelp':
    'A Set is a saved group of accounts and defaults. Applying one copies its values into this draft. Later edits to the Set do not change this draft.',
  'composerWeb.rail.openTarget': 'Open the version for {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Limit unknown',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {no media} one {# media file} other {# media files}}',
  'composerWeb.rail.paused': 'Paused. It will not publish until you resume it.',
  'composerWeb.rail.state.notBuilt': 'Not built yet',
  'composerWeb.rail.state.unsupported': 'Provider does not support',
  'composerWeb.rail.empty': 'No accounts selected yet.',
  'composerWeb.rail.emptyHelp': 'Pick the accounts this post should reach. You can add more later.',
  'composerWeb.rail.divergenceHint':
    'Open a target to see its own version. The master draft is unchanged.',
  'composerWeb.rail.searchLabel': 'Filter accounts',
  'composerWeb.rail.removeTarget': 'Remove {account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Global edit',
  'composerWeb.globalEdit.title': 'Apply this change to every selected target',
  'composerWeb.globalEdit.description':
    'The master draft always changes. Targets that still inherit this field follow it. Targets with their own version keep it.',
  'composerWeb.globalEdit.fieldLabel': 'Field',
  'composerWeb.globalEdit.compatibleHeading': 'These targets take the change',
  'composerWeb.globalEdit.keepsOverrideHeading': 'These targets keep their own version',
  'composerWeb.globalEdit.incompatibleHeading': 'These targets cannot take the change',
  'composerWeb.globalEdit.incompatibleHelp':
    'Nothing is dropped without telling you. Each account below gets an explicit version with the change adapted, and you can edit it afterwards.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} allows {limit} characters. This text is {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} does not accept a link in this field. The link stays in the master draft and in the targets that allow it.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} accepts {limit, plural, one {# file} other {# files}}. This draft has {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported':
    '{account} does not accept {mimeType} files.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} does not support follow up items, so the sequence stays on the master draft.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} publishes plain text. The formatting marks would appear as characters.',
  'composerWeb.globalEdit.adaptedPreview': 'What {account} gets instead',
  'composerWeb.globalEdit.confirm': 'Apply and create the versions',
  'composerWeb.globalEdit.nothingToApply':
    'Nothing changes. The master draft already has this value.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Change applied to # target} other {Change applied to # targets}}. {adapted, plural, =0 {No target needed an adapted version} one {# target got an adapted version} other {# targets got adapted versions}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'This target has its own version',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# field differs from the master draft} other {# fields differ from the master draft}}',
  'composerWeb.override.field.body': 'Post text',
  'composerWeb.override.field.contentKind': 'Post type',
  'composerWeb.override.field.locale': 'Content language',
  'composerWeb.override.field.mediaIds': 'Media',
  'composerWeb.override.field.links': 'Links',
  'composerWeb.override.field.signature': 'Signature',
  'composerWeb.override.field.threadItems': 'Comments and thread',
  'composerWeb.override.field.schedule': 'Schedule',
  'composerWeb.override.resetField': 'Reset {field} to master',
  'composerWeb.override.resetFieldTitle': 'Reset {field} for {account}?',
  'composerWeb.override.resetFieldBody':
    'The version of {field} written for {account} is discarded and the master draft is used again. No other target changes.',
  'composerWeb.override.resetAll': 'Reset every field to master',
  'composerWeb.override.inheritNotice':
    'This target follows the master draft. Editing anything here creates a version only {account} receives.',
  'composerWeb.override.created': '{account} now has its own {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Limits for {account}',
  'composerWeb.limits.text': 'Text up to {limit} characters',
  'composerWeb.limits.linkCost':
    'A link counts as {count, plural, one {# character} other {# characters}} whatever its length.',
  'composerWeb.limits.images':
    '{count, plural, =0 {No images} one {# image} other {up to # images}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {No video} one {# video} other {up to # videos}}',
  'composerWeb.limits.duration': 'Video up to {duration}',
  'composerWeb.limits.aspect': 'Aspect ratio between {min} and {max}',
  'composerWeb.limits.fileSize': 'Files up to {size}',
  'composerWeb.limits.mimeTypes': 'Accepted file types: {types}',
  'composerWeb.limits.source': 'From capability snapshot {version}, read {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'A thumbnail is required.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider} settings',
  'composerWeb.native.privacy': 'Who can see this',
  'composerWeb.native.privacyChoose': 'Choose an audience',
  'composerWeb.native.privacyExplicit':
    '{provider} does not allow a preselected audience. Choose one before this can be scheduled.',
  'composerWeb.native.community': 'Community',
  'composerWeb.native.board': 'Board',
  'composerWeb.native.group': 'Group or Page',
  'composerWeb.native.organization': 'Organization',
  'composerWeb.native.channel': 'Channel',
  'composerWeb.native.publication': 'Publication',
  'composerWeb.native.disclosureHeading': 'Disclosure',
  'composerWeb.native.disclosureCommercial': 'This post promotes a product or service',
  'composerWeb.native.disclosureBranded': 'This post is branded content for another company',
  'composerWeb.native.disclosureAi': 'Some of this content was made with an AI tool',
  'composerWeb.native.disclosureUnsupported':
    '{provider} does not offer this disclosure through its API. Add it in the text instead.',
  'composerWeb.native.none': 'No {provider} settings apply to this post type.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Resolved on {provider}',
  'composerWeb.entity.resolvedId': 'Account ID {externalId}',
  'composerWeb.entity.plainTextWarning':
    'Not matched. It will publish as plain text, which is not a native tag on {provider}.',
  'composerWeb.entity.removeMention': 'Remove the mention of {label}',
  'composerWeb.entity.addMention': 'Add a mention',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {No mentions} one {# mention} other {# mentions}}, {resolved} matched to a real account',
  'composerWeb.entity.lookupUnsupported':
    '{provider} does not offer entity lookup for this account type.',
  'composerWeb.entity.lookupNotBuilt':
    'Post Array has not built entity lookup for {provider} yet. Nothing is guessed in the meantime.',
  'composerWeb.entity.searchHint': 'Type at least two characters, then choose a result.',
  'composerWeb.entity.searchFailed': 'The search did not complete. Try again.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {No matches} one {# match} other {# matches}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Links',
  'composerWeb.links.detected':
    '{count, plural, one {# link found in this draft} other {# links found in this draft}}',
  'composerWeb.links.noneDetected': 'No links in this draft yet.',
  'composerWeb.links.modeLabel': 'How this link publishes',
  'composerWeb.links.original': 'Original URL',
  'composerWeb.links.utmSource': 'Source',
  'composerWeb.links.utmMedium': 'Medium',
  'composerWeb.links.utmCampaign': 'Campaign',
  'composerWeb.links.utmTerm': 'Term',
  'composerWeb.links.utmContent': 'Content',
  'composerWeb.links.domainVerified': '{domain}, verified for this workspace',
  'composerWeb.links.domainDefault': 'Post Array default domain',
  'composerWeb.links.domainNone': 'No branded domain is verified yet.',
  'composerWeb.links.notAllowedHere': '{account} does not allow a link here.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Comment',
  'composerWeb.sequence.kindThread': 'Thread part',
  'composerWeb.sequence.kindLabel': 'Item type',
  'composerWeb.sequence.moveUp': 'Move this item earlier',
  'composerWeb.sequence.moveDown': 'Move this item later',
  'composerWeb.sequence.remove': 'Remove this item',
  'composerWeb.sequence.absoluteTime': 'Runs at {time}, which is {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'If an item fails, the post already published stays published and the items after it do not run. You get an action item.',
  'composerWeb.sequence.maxReached':
    '{account} accepts {limit, plural, one {# follow up item} other {# follow up items}}.',
  'composerWeb.sequence.minDelay': 'The shortest delay {provider} allows here is {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Same account as the post',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {No issues} one {# issue} other {# issues}} on this item',
  'composerWeb.sequence.customMinutes': 'Minutes after the previous item',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Repeat this post',
  'composerWeb.repeat.cadenceLabel': 'How often',
  'composerWeb.repeat.maximum': 'A repeating post can run at most {limit} times.',
  'composerWeb.repeat.occurrenceLabel': 'Number of posts',
  'composerWeb.repeat.duplicateCheck':
    'Each occurrence is checked for duplicate content before it publishes. An occurrence that fails the check becomes an action item instead of publishing.',
  'composerWeb.repeat.occurrenceList': 'First occurrences',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {and # more occurrence} other {and # more occurrences}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Sets and signature',
  'composerWeb.set.pickerTitle': 'Start from a Set',
  'composerWeb.set.pickerDescription':
    'A Set fills in targets, text and settings. The draft it creates is independent, so editing the Set later never changes an approved or scheduled post.',
  'composerWeb.set.accountCount': '{count, plural, one {# account} other {# accounts}}',
  'composerWeb.set.apply': 'Use this Set',
  'composerWeb.set.none': 'No Sets saved yet.',
  'composerWeb.signature.pickerLabel': 'Signature',
  'composerWeb.signature.scope': 'For project {project} on {provider} in {language}',
  'composerWeb.signature.previewHeading': 'How it ends the post',
  'composerWeb.signature.notMatching':
    'This signature is scoped to a different project, platform or language, so it is not offered here.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'This is the approved version. Editing it creates a new version and clears the approval.',
  'composerWeb.autosave.pinnedAcknowledge': 'Edit and clear the approval',
  'composerWeb.autosave.conflictTitle': 'Two versions of this draft',
  'composerWeb.autosave.conflictKeepMine': 'Keep what I wrote',
  'composerWeb.autosave.conflictKeepTheirs': 'Use the version from {name}',
  'composerWeb.autosave.conflictHelp':
    'Nothing is merged automatically. Choose per field, then save.',
  'composerWeb.autosave.retry': 'Try saving again',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Composer shortcuts',
  'composerWeb.shortcuts.nextTarget': 'Next target',
  'composerWeb.shortcuts.previousTarget': 'Previous target',
  'composerWeb.shortcuts.nextIssue': 'Next issue',
  'composerWeb.shortcuts.previousIssue': 'Previous issue',
  'composerWeb.shortcuts.save': 'Save draft now',
  'composerWeb.shortcuts.openSchedule': 'Open the schedule sheet',
  'composerWeb.shortcuts.open': 'Show shortcuts',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'Review',
  'composerWeb.review.contentVersion': 'Content version {checksum}',
  'composerWeb.review.approvalPolicy': 'Policy: {policy}',
  'composerWeb.review.approverPending': 'Waiting for a decision from {approver}.',
  'composerWeb.review.approverNone': 'No approval is required for these targets.',
  'composerWeb.review.perTargetHeading': 'What each account receives',
  'composerWeb.review.finalUrl': 'Published link',
  'composerWeb.review.privacyState': 'Audience: {value}',
  'composerWeb.review.disclosureState': 'Disclosure: {value}',
  'composerWeb.review.disclosureNone': 'No disclosure set',
  'composerWeb.review.mediaVersion': '{name}, version {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# target cannot be scheduled yet} other {# targets cannot be scheduled yet}}',
  'composerWeb.review.offlineBlocked':
    'Scheduling and publishing need a connection. Your draft is safe on this device.',
  'composerWeb.review.publishConfirm':
    'This publishes to {count, plural, one {# account} other {# accounts}} straight away. It cannot be undone from here.',

  // ------------------------------------------------------- loud system (WP-8)
  'composerWeb.savedFlash': 'Saved',
  'composerWeb.validation.clear.v2': 'Nothing blocking.',
  'composerWeb.schedule.confirmed': 'Scheduled',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'New draft',
  'composerWeb.page.loading': 'Loading the draft, its targets and their limits',
  // A failed commit has to be visible, not only announced. These are the
  // titles the sheet shows and the toast repeats; the sentence underneath them
  // is the typed error's own user-safe message and its remediation.
  'composerWeb.commitFailed.draft': 'This draft was not saved.',
  'composerWeb.commitFailed.approval': 'The approval request was not sent.',
  'composerWeb.commitFailed.schedule': 'This post was not scheduled.',
  'composerWeb.commitFailed.publish': 'Publishing did not finish.',

  'composerWeb.page.errorTitle': 'This draft could not be opened',
  'composerWeb.page.errorBody':
    'Nothing was lost. Try again, and if it keeps failing the reference below helps support find the request.',
  'composerWeb.page.noConnectionsTitle': 'Connect an account before composing',
  'composerWeb.page.noConnectionsBody':
    'A draft needs at least one connected account so Post Array knows the limits, the preview and the settings to show.',
  'composerWeb.page.noConnectionsExample':
    'Example: with X and LinkedIn connected, one draft becomes two native versions with their own counters.',
  'composerWeb.page.permissionTitle': 'You cannot create posts in this workspace',
  'composerWeb.page.permissionBody':
    'Composing needs the editor role or higher. An owner or admin can change your role.',
  'composerWeb.page.rateLimitTitle': 'Too many draft saves in a short time',
  'composerWeb.page.rateLimitCause':
    'This workspace reached its write limit for the current window. Your text is kept on this device meanwhile.',
  'composerWeb.page.rateLimitAlternative':
    'Keep writing. Saving resumes automatically when the window resets.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Grid',
  'mediaLib.view.list': 'List',
  'mediaLib.view.label': 'Layout',
  'mediaLib.sort.label': 'Sort',
  'mediaLib.sort.newest': 'Newest first',
  'mediaLib.sort.name': 'Name',
  'mediaLib.sort.size': 'Largest first',
  'mediaLib.select': 'Select {name}',
  'mediaLib.column.file': 'File',
  'mediaLib.column.type': 'Type',
  'mediaLib.column.size': 'Size',
  'mediaLib.column.altText': 'Alt text',
  'mediaLib.column.rights': 'Rights',
  'mediaLib.column.added': 'Added',
  'mediaLib.openDetail': 'Open {name}',

  'mediaLib.empty.title': 'No media yet',
  'mediaLib.empty.body':
    'Upload images, video, audio or documents you already have. Attached files stay in storage for 30 days after the post is created.',
  'mediaLib.empty.example': 'Example: launch_hero.jpg, 1600 by 900, with alt text set.',
  'mediaLib.error.title': 'The library could not be loaded',
  'mediaLib.error.body': 'Your files are safe. Nothing was changed by this failure.',
  'mediaLib.offline.title': 'The library is unavailable offline',
  'mediaLib.offline.body':
    'We cannot refresh the library without a connection. Files already on this screen are unchanged. Reconnect, then try again.',
  'mediaLib.rateLimited.title': 'The library needs a short pause',
  'mediaLib.rateLimited.cause':
    'The API asked us to slow down while loading your files. Your stored media is safe.',
  'mediaLib.rateLimited.resetLabel': 'Try again after',
  'mediaLib.rateLimited.alternative':
    'You can keep drafting locally, but uploads and library changes wait until the limit resets.',
  'mediaLib.loading': 'Loading your media library',
  'mediaLib.permission.title': 'You cannot see this workspace library',
  'mediaLib.permission.body':
    'Viewing media needs the viewer role or higher on this project. An owner or admin can grant it.',

  'mediaLib.upload.heading': 'Add media',
  'mediaLib.upload.browse': 'Choose files',
  'mediaLib.upload.dropHint':
    'Drag files here, or choose them. A failed upload can be retried without creating a duplicate library item.',
  'mediaLib.upload.queueHeading': 'Uploads',
  'mediaLib.upload.progress': '{name}, {percent} of {size} sent',
  'mediaLib.upload.paused': 'Paused at {sent} of {size}. Resuming sends this file again.',
  'mediaLib.upload.resume': 'Resume upload',
  'mediaLib.upload.pause': 'Pause upload',
  'mediaLib.upload.cancel': 'Cancel this upload',
  'mediaLib.upload.retry': 'Try this upload again',
  'mediaLib.upload.finalizing': 'Finishing {name}',
  'mediaLib.upload.done': '{name} is in your library',
  'mediaLib.upload.failed': '{name} did not finish. {reason}',
  'mediaLib.upload.offline':
    'Offline. Uploads continue from where they stopped when you reconnect.',
  'mediaLib.upload.rejectedType':
    '{name} is {mimeType}, which none of your selected accounts accept.',
  'mediaLib.upload.rejectedSize':
    '{name} is {size}. The lowest limit across your accounts is {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Accepted by # of your accounts} other {Accepted by # of your accounts}}',
  'mediaLib.upload.rejectedBy': 'Not accepted by {accounts}',
  'mediaLib.upload.checkedAgainst': 'Checked against the accounts selected in this draft.',
  'mediaLib.upload.noTargets':
    'No accounts are selected, so the file is checked against the workspace defaults only.',
  'mediaLib.import.urlLabel': 'Public file URL',
  'mediaLib.import.urlPlaceholder': 'https://cdn.example.com/launch-video.mp4',
  'mediaLib.import.importing': 'Importing media',
  'mediaLib.import.succeeded': 'The file is in your library',
  'mediaLib.import.scanPending':
    'Post Array recorded its source. Publishing waits until the safety check finishes.',
  'mediaLib.import.failed': 'The file could not be imported',
  'mediaLib.import.failedHelp':
    'Check that the link is public and points directly to a supported media file, then try again.',
  'mediaLib.import.readOnly': 'Connect the API to import files in this environment.',
  'mediaLib.import.offline': 'Reconnect before importing a file.',
  'mediaLib.import.issue.invalid': 'Enter a complete URL.',
  'mediaLib.import.issue.scheme': 'Use an HTTP or HTTPS link.',
  'mediaLib.import.issue.credentials': 'Use a link without a username or password.',
  'mediaLib.retention.title': 'Stored files are kept for 30 days after the post is created',
  'mediaLib.retention.body':
    'Once a file is attached to a post, we permanently delete it from Post Array storage 30 days after that post is created. Files waiting to be attached use the upload date as a cleanup fallback. Post text, publication receipts and audit history remain available longer. A published post on a social platform is not removed when its stored file expires.',
  'mediaLib.retention.limits':
    'Images, audio and PDF files can be up to {imageSize}. Videos can be up to {videoSize}.',
  'mediaLib.retention.expiresLabel': 'File deletion date',
  'mediaLib.retention.deleted': 'Permanently deleted',
  'mediaLib.retention.deletedTitle': 'This stored file has been deleted',
  'mediaLib.retention.deletedBody':
    'The 30-day storage period ended. The post text, publication receipts and audit history remain.',
  'mediaLib.processing.unavailableTitle': 'This file is not ready to publish',
  'mediaLib.processing.unavailableBody':
    'Processing or a safety check is still pending, or it did not pass. Upload the file again if this state does not clear.',
  'mediaLib.processing.pendingTitle': 'Safety scanning is not available in prelaunch',
  'mediaLib.processing.pendingBody':
    'The file is stored for 30 days, but it cannot be attached to a published post until safety scanning is enabled.',
  'mediaLib.processing.blockedTitle': 'This file cannot be published',
  'mediaLib.processing.blockedBody':
    'The file did not pass processing or a safety check. Upload a different file.',

  'mediaLib.alt.heading': 'Alt text',
  'mediaLib.alt.help':
    'Describe what matters in the image for someone who cannot see it. One or two sentences is usually enough.',
  'mediaLib.alt.nudge': 'Alt text helps everyone',
  'mediaLib.alt.count': '{used} of {limit} characters',
  'mediaLib.alt.requiredBy': 'Required by {accounts}',
  'mediaLib.alt.waive': 'This image carries no information',
  'mediaLib.alt.waiveReason': 'Why it needs no description',
  'mediaLib.alt.waiveHelp':
    'Use this only for decoration. A waived image publishes with an empty description where the platform allows it.',
  'mediaLib.alt.waived': 'Waived by {name} on {date}. Reason: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} does not accept alt text through its API for this account.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# file has no alt text} other {# files have no alt text}}',

  'mediaLib.rights.heading': 'Rights and consent',
  'mediaLib.rights.declared': 'Declared by {name} on {date}',
  'mediaLib.rights.undeclared': 'Not declared yet. Declare it before this file publishes.',
  'mediaLib.rights.ownerLabel': 'Who owns this file',
  'mediaLib.rights.ownerSelf': 'This workspace',
  'mediaLib.rights.ownerLicensed': 'Licensed from someone else',
  'mediaLib.rights.ownerUgc': 'A customer or creator gave permission',
  'mediaLib.rights.licenseLabel': 'License or permission reference',
  'mediaLib.rights.peopleLabel': 'People appear in this file',
  'mediaLib.rights.peopleConsent': 'Everyone shown has agreed to be published',
  'mediaLib.rights.musicLabel': 'This file contains music or a soundtrack',
  'mediaLib.rights.confirm':
    'I have the rights to publish this file, including any people, music, logos and brands in it.',
  'mediaLib.rights.blocking': 'This file cannot be scheduled until the rights are declared.',

  'mediaLib.editor.heading': 'Edit picture',
  'mediaLib.editor.description':
    'Every edit is saved as a new version. The original file is kept and can be restored.',
  'mediaLib.editor.tab.crop': 'Crop',
  'mediaLib.editor.tab.transform': 'Resize and rotate',
  'mediaLib.editor.tab.canvas': 'Canvas',
  'mediaLib.editor.tab.output': 'Format and size',
  'mediaLib.editor.tab.thumbnail': 'Thumbnail',
  'mediaLib.editor.presetLabel': 'Aspect preset',
  'mediaLib.editor.presetFree': 'Free',
  'mediaLib.editor.presetFor': '{ratio}, used by {accounts}',
  'mediaLib.editor.cropX': 'Crop from the start edge',
  'mediaLib.editor.cropY': 'Crop from the top',
  'mediaLib.editor.cropWidth': 'Crop width',
  'mediaLib.editor.cropHeight': 'Crop height',
  'mediaLib.editor.cropKeyboardHint':
    'The crop box is set with number fields, so it works fully from the keyboard.',
  'mediaLib.editor.widthLabel': 'Width in pixels',
  'mediaLib.editor.heightLabel': 'Height in pixels',
  'mediaLib.editor.lockRatio': 'Keep the current ratio',
  'mediaLib.editor.rotateLabel': 'Rotation',
  'mediaLib.editor.rotateDegrees': '{degrees} degrees',
  'mediaLib.editor.flipHorizontal': 'Flip across the vertical axis',
  'mediaLib.editor.flipVertical': 'Flip across the horizontal axis',
  'mediaLib.editor.canvasColor': 'Background colour',
  'mediaLib.editor.canvasFit': 'How the picture sits on the canvas',
  'mediaLib.editor.canvasFitCover': 'Fill the canvas and crop the overflow',
  'mediaLib.editor.canvasFitContain': 'Fit the whole picture and pad the rest',
  'mediaLib.editor.formatLabel': 'Output format',
  'mediaLib.editor.qualityLabel': 'Compression quality',
  'mediaLib.editor.qualityValue': '{value} of 100',
  'mediaLib.editor.estimatedSize': 'Estimated output {size}, from {original}',
  'mediaLib.editor.estimatedSizeUnknown':
    'The output size is only known once the file is processed.',
  'mediaLib.editor.thumbnailHelp':
    'Pick the frame or file used as the video thumbnail where the platform accepts one.',
  'mediaLib.editor.thumbnailFrame': 'Frame at {time}',
  'mediaLib.editor.save': 'Save as a new version',
  'mediaLib.editor.saving': 'Saving version {version}',
  'mediaLib.editor.saved': 'Version {version} saved. The original is still here.',
  'mediaLib.editor.discard': 'Discard these edits',
  'mediaLib.editor.noChanges': 'No changes to save yet.',
  'mediaLib.editor.revalidate':
    'Saving rechecks this file against every account in the drafts that use it.',
  'mediaLib.editor.noGeneration':
    'This editor changes the file you uploaded. It does not create new imagery.',
  'mediaLib.editor.unavailable.title': 'File editing is not implemented in prelaunch',
  'mediaLib.editor.unavailable.body':
    'Prepare the file before uploading it. Your original upload is never changed.',

  'mediaLib.versions.heading': 'Versions',
  'mediaLib.versions.original': 'Original upload',
  'mediaLib.versions.current': 'Current version',
  'mediaLib.versions.restore': 'Restore version {version}',
  'mediaLib.versions.item': 'Version {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'Where this file came from',
  'mediaLib.provenance.sourceUrl': 'Source URL',
  'mediaLib.provenance.fetchedAt': 'Fetched {date}',
  'mediaLib.provenance.declaredAuthor': 'Stated author',
  'mediaLib.provenance.declaredLicense': 'Stated license',
  'mediaLib.provenance.contentCredentials': 'Embedded content credentials',
  'mediaLib.provenance.contentCredentialsNone':
    'This file carries no embedded content credentials. That is common and does not mean anything is wrong.',
  'mediaLib.provenance.unverified':
    'These details come from the source, not from Post Array. Check them before you rely on them.',

  'mediaLib.picker.title': 'Choose media',
  'mediaLib.picker.description': 'Files are checked against the accounts selected in this draft.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Choose files} one {Add # file} other {Add # files}}',
  'mediaLib.picker.forMaster': 'Adding to the master draft',
  'mediaLib.picker.forVariant': 'Adding to the version for {account} only',
} as const;
