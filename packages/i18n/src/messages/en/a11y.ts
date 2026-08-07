/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Primary navigation',
  'a11y.region.breadcrumb': 'Breadcrumb',
  'a11y.region.main': 'Main content',
  'a11y.region.composer': 'Composer',
  'a11y.region.preview': 'Preview',
  'a11y.region.validation': 'Validation issues',
  'a11y.region.targets': 'Target accounts',
  'a11y.region.notifications': 'Notifications',

  'a11y.announce.saved': 'Draft saved',
  'a11y.announce.saving': 'Saving draft',
  'a11y.announce.saveFailed': 'Draft could not be saved. Your text is still here.',
  'a11y.announce.offline': 'You are offline. Changes are kept on this device.',
  'a11y.announce.online': 'Back online',
  'a11y.announce.validationCount':
    '{count, plural, =0 {No validation issues} one {# validation issue} other {# validation issues}}',
  'a11y.announce.validationCleared': 'All validation issues resolved',
  'a11y.announce.targetSelected':
    '{account} selected. {count, plural, one {# target} other {# targets}} in total.',
  'a11y.announce.targetOverridden': '{account} now has its own version',
  'a11y.announce.targetReset': '{account} reset to the master draft',
  'a11y.announce.uploadProgress': '{name}, {percent} uploaded',
  'a11y.announce.uploadComplete': '{name} uploaded',
  'a11y.announce.uploadFailed': '{name} failed to upload',
  'a11y.announce.scheduled': 'Scheduled for {time} in {timeZone}',
  'a11y.announce.rescheduled': 'Moved to {time} in {timeZone}',
  'a11y.announce.publishing': 'Publishing',
  'a11y.announce.published':
    '{count, plural, one {Published to # account} other {Published to # accounts}}',
  'a11y.announce.publishPartial':
    'Published to {published} of {total} accounts. {failed, plural, one {# account needs attention} other {# accounts need attention}}.',
  'a11y.announce.publishFailed': 'Publishing failed. Your content is preserved.',
  'a11y.announce.approvalRequested': 'Approval requested from {approver}',
  'a11y.announce.approved': 'Approved',
  'a11y.announce.connectionAdded': '{account} connected',
  'a11y.announce.connectionRemoved': '{account} disconnected',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Filters cleared} one {# filter applied} other {# filters applied}}, {results, plural, one {# result} other {# results}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Copied to the clipboard',
  'a11y.announce.suggestionApplied': 'Suggestion applied',
  'a11y.announce.suggestionRejected': 'Suggestion rejected',

  'a11y.label.closeDialog': 'Close dialog',
  'a11y.label.openMenu': 'Open menu',
  'a11y.label.sortBy': 'Sort by {field}',
  'a11y.label.sortAscending': 'Sorted ascending',
  'a11y.label.sortDescending': 'Sorted descending',
  'a11y.label.removeTarget': 'Remove {account} from the targets',
  'a11y.label.removeMedia': 'Remove {name}',
  'a11y.label.editAltText': 'Edit alt text for {name}',
  'a11y.label.mediaPreview': 'Preview of {name}',
  'a11y.label.playVideo': 'Play {name}',
  'a11y.label.pauseVideo': 'Pause {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {nothing scheduled} one {# post} other {# posts}}',
  'a11y.label.postSummary': '{account} on {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} of {limit} characters used',
  'a11y.label.requiredField': 'Required',
  'a11y.label.externalLink': 'Opens in a new tab',
  'a11y.label.loadingRegion': 'Loading content',
  'a11y.label.expandRow': 'Show details for {name}',
  'a11y.label.collapseRow': 'Hide details for {name}',
  'a11y.languagePicker.label': 'Choose interface language',
  'a11y.languagePicker.filterLabel': 'Filter languages',
  'a11y.languagePicker.announceChanged': 'Interface language changed to {language}',

  'a11y.keyboard.hint.calendar':
    'Use the arrow keys to move between slots. Press Enter to open a post. Press Space then the arrow keys to reschedule.',
  'a11y.keyboard.hint.composer':
    'Press Control and the bracket keys to move between targets. Press Control and I to move to the next issue.',
  'a11y.keyboard.hint.dialog': 'Press Escape to close.',
  'a11y.keyboard.shortcutsTitle': 'Keyboard shortcuts',

  'a11y.table.alternative': 'Table view',
  'a11y.table.alternativeHint': 'The same schedule as a sortable table.',
  'a11y.motion.reduced': 'Animations are reduced because of your system setting.',
} as const;
