/**
 * Bulk CSV import.
 *
 * Two groups of strings. The `import.error.*` keys are the ones the parser and
 * the apply step emit: they are stored on a row, rendered in the report and
 * written into the downloadable CSV, so they have to make sense to someone
 * reading a spreadsheet rather than a screen. Everything else is the wizard.
 *
 * The copy says drafts wherever drafts are what happens, and it says schedule
 * only on the step where a person chooses it. Nothing here promises that a post
 * reaches a platform.
 */
export const importMessages = {
  'import.title': 'Import posts from a CSV',
  'import.subtitle':
    'Upload a spreadsheet, read what it will do, then decide. Uploading checks the file. It does not create anything.',

  'import.step.upload': 'Upload',
  'import.step.columns': 'Columns',
  'import.step.review': 'Review',
  'import.step.apply': 'Apply',
  'import.step.results': 'Results',
  'import.step.position': 'Step {current} of {total}',

  'import.upload.heading': 'Choose a CSV file',
  'import.upload.help':
    'CSV only. Spreadsheet files such as .xlsx are not read. Export your sheet as CSV first.',
  'import.upload.field': 'CSV file',
  'import.upload.fieldHelp': 'Select a file, or paste the rows into the box below.',
  'import.upload.paste': 'Or paste CSV text',
  'import.upload.pasteHelp': 'Include the header row. Everything is checked before anything is made.',
  'import.upload.project': 'Project',
  'import.upload.projectHelp': 'Every row in one file belongs to this project.',
  'import.upload.submit': 'Check this file',
  'import.upload.submitting': 'Reading the file',
  'import.upload.allowPast': 'Allow times that have already passed',
  'import.upload.allowPastHelp':
    'Off by default. A row dated in the past is reported so you can fix it rather than being moved for you.',
  'import.upload.tooLarge': 'That file is larger than {limit} characters. Split it and try again.',
  'import.upload.duplicate':
    'This is the same file you uploaded before, so you are looking at that import rather than a second copy of it.',

  'import.template.heading': 'What the columns mean',
  'import.template.download': 'Download a template CSV',
  'import.template.required': 'Required columns',
  'import.template.optional': 'Optional columns',
  'import.column.external_row_id': 'Your own id for the row. It must be unique inside the file.',
  'import.column.project': 'The project name or id the row belongs to.',
  'import.column.targets':
    'Either set: followed by a target set id, or account ids separated by a vertical bar.',
  'import.column.caption': 'The post text.',
  'import.column.scheduled_local_time': 'Local date and time, written as 2026-09-01T10:00.',
  'import.column.time_zone': 'The IANA zone that local time is read in, for example Europe/Berlin.',
  'import.column.media':
    'A media id, sha256: followed by the checksum of media you already have, or an https address for the server to fetch.',
  'import.column.title': 'A title, where the destination uses one.',
  'import.column.destination': 'The page, board or channel inside the account.',
  'import.column.privacy': 'The privacy value the destination expects.',
  'import.column.first_comment': 'Text posted as the first comment after the post.',
  'import.column.approval_policy': 'The approval policy to attach to each draft.',
  'import.column.perPlatform':
    'A caption_ or title_ column named after a platform overrides that platform only, for example caption_instagram.',

  'import.columns.heading': 'Column check',
  'import.columns.ok': 'Every required column is present.',
  'import.columns.missing':
    '{count, plural, one {# required column is missing} other {# required columns are missing}}',
  'import.columns.unknown':
    '{count, plural, one {# column was not recognised and is ignored} other {# columns were not recognised and are ignored}}',
  'import.columns.present': 'Columns found',

  'import.review.heading': 'What this file will do',
  'import.review.counts':
    '{valid, plural, =0 {No rows are ready} one {# row is ready} other {# rows are ready}}, {invalid, plural, =0 {none need attention} one {# needs attention} other {# need attention}}.',
  'import.review.empty': 'No rows were read from this file.',
  'import.review.rowsHeading': 'Rows',
  'import.review.filterAll': 'All rows',
  'import.review.filterValid': 'Ready',
  'import.review.filterInvalid': 'Needs attention',
  'import.review.filterFailed': 'Failed',
  'import.review.downloadErrors': 'Download the problems as CSV',
  'import.review.parsedWith': 'Read with parser {version}',

  'import.table.row': 'Row id',
  'import.table.line': 'Line',
  'import.table.state': 'State',
  'import.table.caption': 'Caption',
  'import.table.time': 'Scheduled',
  'import.table.problems': 'Problems',
  'import.table.draft': 'Draft',
  'import.table.noProblems': 'None',

  'import.state.pending': 'Not checked',
  'import.state.valid': 'Ready',
  'import.state.invalid': 'Needs attention',
  'import.state.applied': 'Draft created',
  'import.state.skipped': 'Already done',
  'import.state.failed': 'Failed',

  'import.job.state.uploaded': 'Uploaded',
  'import.job.state.validating': 'Checking',
  'import.job.state.validated': 'Checked',
  'import.job.state.applying': 'Applying',
  'import.job.state.applied': 'Applied',
  'import.job.state.failed': 'Could not be read',

  'import.apply.heading': 'What should happen to the rows that are ready?',
  'import.apply.drafts': 'Create drafts',
  'import.apply.draftsHelp':
    'The default. Each ready row becomes a draft you can open, edit and approve. Nothing is scheduled.',
  'import.apply.scheduled': 'Create drafts and schedule them',
  'import.apply.scheduledHelp':
    'Each ready row becomes a draft and takes the time written in the file. Choose this only if the times are right.',
  'import.apply.confirm': 'Apply {count, plural, one {# row} other {# rows}}',
  'import.apply.confirmScheduled':
    'Create and schedule {count, plural, one {# row} other {# rows}}',
  'import.apply.running': 'Applying rows',
  'import.apply.safeToRepeat':
    'Applying twice is safe. A row that already made a draft is left alone.',

  'import.results.heading': 'Results',
  'import.results.applied': '{count, plural, one {# draft created} other {# drafts created}}',
  'import.results.skipped':
    '{count, plural, one {# row was already done} other {# rows were already done}}',
  'import.results.failed': '{count, plural, one {# row failed} other {# rows failed}}',
  'import.results.retry': 'Apply the remaining rows again',
  'import.results.openDrafts': 'Open the drafts',
  'import.results.unavailable': 'unavailable',

  'import.history.heading': 'Earlier imports',
  'import.history.empty': 'No imports yet.',
  'import.history.open': 'Open',

  'import.a11y.rowsTable': 'Manifest rows and their problems',
  'import.a11y.stepList': 'Import steps',
  'import.a11y.uploadedFile': 'Selected file: {filename}',

  'import.error.emptyFile': 'That file has no rows in it.',
  'import.error.missingColumn': 'The column {column} is missing.',
  'import.error.unknownColumn': 'The column {column} was not recognised, so it is ignored.',
  'import.error.duplicateRowId': 'The row id {value} is used more than once in this file.',
  'import.error.required': 'This cell cannot be empty.',
  'import.error.invalidCell': 'This cell is not in a shape we can read.',
  'import.error.rowShape': 'This line has {actual} cells but the header has {expected}.',
  'import.error.invalidLocalTime':
    'The time {value} is not a local date and time such as 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'The zone {value} is not an IANA time zone name.',
  'import.error.nonexistentLocalTime':
    'The time {value} does not exist in {zone}. The clocks jump over it.',
  'import.error.ambiguousLocalTime':
    'The time {value} happens twice in {zone} on that day. Pick a different time.',
  'import.error.scheduleInPast': 'The time {value} in {zone} has already passed.',
  'import.error.invalidTargets':
    'The value {value} is not a saved target set or a list of account ids.',
  'import.error.invalidMedia':
    'The value {value} is not a media id, a sha256 checksum or an https address.',
  'import.error.mediaNotFound': 'No media in this workspace matches {value}.',
  'import.error.mediaImportStarted':
    'The media at {value} is being fetched. Apply this file again once it is in the library.',
  'import.error.unknownVariantTarget':
    'This row has no {provider} account, so the {provider} caption was not used.',
  'import.error.applyFailed': 'This row could not be applied. Reference: {code}.',
  'import.error.alreadyApplied': 'This row already created a draft, so it was left alone.',
  'import.error.tooManyRows': 'Only the first {limit} rows of a file are read.',
} as const;
