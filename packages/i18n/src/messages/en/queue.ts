/**
 * Queue rules and slot reservations.
 *
 * The reason keys are the ones the slot finder emits. They are the sentences a
 * person reads before they accept a proposed time, and the sentences an audit
 * reads back years later, so they say what actually happened rather than
 * congratulating anyone.
 */
export const queueMessages = {
  'queue.title': 'Posting queue',
  'queue.subtitle':
    'When this project is willing to post, and how far apart. Nothing posts without a person accepting the time.',

  'queue.rules.heading': 'Queue rules',
  'queue.rules.empty':
    'No queue rules yet. Until you add one, the next slot is simply the first free hour.',
  'queue.rules.create': 'New queue rule',
  'queue.rules.count': '{count, plural, =0 {No rules} one {# rule} other {# rules}}',
  'queue.rules.enabled': 'In use',
  'queue.rules.disabled': 'Paused',
  'queue.rules.archived': 'Archived',
  'queue.rules.edit': 'Edit rule',
  'queue.rules.archive': 'Archive rule',
  'queue.rules.archiveHelp':
    'Archiving stops future proposals. Slots already reserved keep their time and their reason.',

  'queue.field.name': 'Rule name',
  'queue.field.nameHelp': 'A name you will recognise later, for example Weekday mornings.',
  'queue.field.timeZone': 'Time zone',
  'queue.field.timeZoneHelp':
    'Windows, the daily count and blackout dates are all read in this zone.',
  'queue.field.minimumGap': 'Minimum gap',
  'queue.field.minimumGapHelp': 'Minutes between two posts. Zero means no spacing rule.',
  'queue.field.maximumPerDay': 'Maximum per day',
  'queue.field.maximumPerDayHelp':
    'Leave empty for no daily limit. Zero means this rule proposes nothing.',
  'queue.field.maximumPerDayUnlimited': 'No daily limit',
  'queue.field.priority': 'Priority',
  'queue.field.priorityHelp': 'The highest priority rule that can offer a slot is the one used.',
  'queue.field.enabled': 'Use this rule',

  'queue.windows.heading': 'Weekly windows',
  'queue.windows.help':
    'Pick the local hours this project may post in. Use the day and time fields, or the buttons on the grid.',
  'queue.windows.empty': 'No windows yet. A rule with no window can never offer a slot.',
  'queue.windows.add': 'Add window',
  'queue.windows.remove': 'Remove window',
  'queue.windows.entry': '{weekday}, {start} to {end}',
  'queue.windows.start': 'From',
  'queue.windows.end': 'Until',
  'queue.windows.weekday': 'Day',
  'queue.windows.toggleCell': '{weekday} at {hour}',
  'queue.windows.gridLabel': 'Weekly availability, one button per day and hour',

  'queue.weekday.1': 'Monday',
  'queue.weekday.2': 'Tuesday',
  'queue.weekday.3': 'Wednesday',
  'queue.weekday.4': 'Thursday',
  'queue.weekday.5': 'Friday',
  'queue.weekday.6': 'Saturday',
  'queue.weekday.7': 'Sunday',

  'queue.blackouts.heading': 'Blackout dates',
  'queue.blackouts.help': 'Dates this project will not post on, read in the rule time zone.',
  'queue.blackouts.empty': 'No blackout dates.',
  'queue.blackouts.add': 'Add blackout',
  'queue.blackouts.remove': 'Remove blackout',
  'queue.blackouts.from': 'First day',
  'queue.blackouts.to': 'Last day',
  'queue.blackouts.entry': '{from} to {to}',

  'queue.connections.heading': 'Accounts',
  'queue.connections.all': 'Every account in this project',
  'queue.connections.scoped':
    '{count, plural, one {# account} other {# accounts}} this rule applies to',

  'queue.slot.heading': 'Next queue slot',
  'queue.slot.action': 'Use the next queue slot',
  'queue.slot.proposed': '{local} in {timeZone}',
  'queue.slot.utc': 'That is {utc} in UTC.',
  'queue.slot.why': 'Why this time',
  'queue.slot.accept': 'Use this time',
  'queue.slot.release': 'Pick another time',
  'queue.slot.expires': 'This proposal is held until {expires}.',
  'queue.slot.unavailable': 'A queue slot is unavailable right now.',
  'queue.slot.pending': 'Finding the next slot.',
  'queue.slot.accepted': 'Scheduled for {local} in {timeZone}.',
  'queue.slot.notAutomatic': 'Nothing is scheduled until you choose this time.',

  'queue.reason.noRulesConfigured':
    'This project has no queue rules configured, so no window applied.',
  'queue.reason.fallbackFirstFreeHour': 'The first free hour after now was used instead.',
  'queue.reason.matchedRule': 'The rule {name} chose this time, in {zone}.',
  'queue.reason.matchedWindow': 'It falls in the window {start} to {end} in {zone}.',
  'queue.reason.minimumGap': 'It is at least {minutes} minutes from every other post.',
  'queue.reason.noMinimumGap': 'This rule sets no minimum gap between posts.',
  'queue.reason.dailyCap': 'That day holds at most {limit} posts, and it is not full.',
  'queue.reason.dailyCapUnlimited': 'This rule sets no daily limit.',
  'queue.reason.blackoutSkipped':
    '{days, plural, one {# blackout day was} other {# blackout days were}} skipped to reach it.',
  'queue.reason.dstNonexistentSkipped':
    'The first time in the window does not exist on that date in {zone}, so the next one that does was used.',
  'queue.reason.dstAmbiguousFirst':
    'That local time happens twice in {zone} on that date. The first occurrence was used.',
  'queue.reason.priorityChosen': 'This rule has priority {priority}, the highest that could offer.',
  'queue.reason.connectionScoped':
    'This rule covers {count, plural, one {# account} other {# accounts}}.',
  'queue.reason.horizonExhausted': 'No window was free within {days} days.',

  /* ---------------------------------------------------------------------
   * The web route at /calendar/queue.
   *
   * Filed under `web.` rather than `queue.` because the domain namespace is
   * already translated key for key in every active locale, while these are new
   * English sentences awaiting review. They are registered in
   * `beta-fallbacks.ts` so each locale falls back to this reviewed source.
   * ------------------------------------------------------------------- */
  'web.queue.loading': 'Loading the queue rules.',
  'web.queue.error.title': 'The queue rules could not be loaded',
  'web.queue.error.body':
    'Nothing about your schedule changed. Posts already scheduled keep their times, and slots already reserved keep theirs.',
  'web.queue.noProject.title': 'No project selected',
  'web.queue.noProject.body':
    'Queue rules belong to one project. Pick a project in the workspace switcher, then open this screen again.',
} as const;
