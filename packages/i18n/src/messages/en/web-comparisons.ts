/**
 * The comparison pages' chrome.
 *
 * What belongs here: state words, section headings, labels, and the three
 * disclosure sentences whose numbers are read at render time from the code
 * that decides them. What deliberately does not: the claims themselves. A
 * comparison table is several hundred words of dated, sourced content per
 * page, and the English catalog is merged into one object that every page load
 * resolves, so those claims live in typed modules under
 * `apps/web/src/features/comparisons/entries` and are loaded per slug.
 *
 * The `web.compare.*` namespace is the older `/compare` index. This namespace
 * is the per comparison page, kept separate so the index copy that beta locales
 * already carry is not disturbed.
 */
export const webComparisonMessages = {
  'web.comparison.eyebrow': 'Comparison',

  'web.comparison.state.yes': 'Yes',
  'web.comparison.state.no': 'No',
  'web.comparison.state.partial': 'Partly',
  'web.comparison.state.notVerified': 'Not verified',

  'web.comparison.label.claim': 'Claim',
  'web.comparison.label.sourceRead': 'Read {date}',
  'web.comparison.label.checked': 'Every row checked {date}',
  'web.comparison.label.nextReview': 'Next check due {date}',
  'web.comparison.label.backToIndex': 'All comparisons',

  'web.comparison.table.title': 'What each option does',
  'web.comparison.table.caption': 'One claim per row, with the source behind each answer',

  'web.comparison.bestFor.title': 'Which one fits',
  'web.comparison.bestFor.ours': 'Choose this product when',
  'web.comparison.bestFor.alternative': 'Choose {name} when',

  'web.comparison.notDo.title': 'What this product does not do',
  'web.comparison.notDo.body':
    'These sentences are read from the code that decides them, not typed by hand, so this section cannot drift away from what the product actually is today.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {No connector has completed provider verification, so nothing publishes to any platform through this product today.} one {# connector has completed provider verification. Every other platform in the cohort is still intent.} other {# connectors have completed provider verification. Every other platform in the cohort is still intent.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {No language has completed human review, so every language in the interface is labelled beta.} one {# language has completed human review. Every other language is labelled beta.} other {# languages have completed human review. Every other language is labelled beta.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Every pricing tier has been decided and carries a real price.} one {# pricing tier is still an undecided placeholder and cannot be bought.} other {# pricing tiers are still undecided placeholders and cannot be bought.}}',

  'web.comparison.notVerified.title': 'What not verified means',
  'web.comparison.notVerified.body':
    'A cell says not verified when the fact could not be read on the other option official public documentation on the day of the check. It is never filled in from memory, and never copied from a summary somebody else wrote.',

  'web.comparison.method.title': 'How this page is made',
  'web.comparison.method.body':
    'Every row is one claim, with the document it came from and the date a person read it. There are no competitor screenshots, no copied feature wording and no invented weaknesses.',
  'web.comparison.method.cadence':
    'Every comparison is rechecked at least once every 90 days, and immediately when a platform or an option changes something a row states.',

  'web.comparison.questions.title': 'Questions',
  'web.comparison.sources.title': 'Sources cited on this page',

  'web.comparison.index.title': 'Published comparisons',
  'web.comparison.index.body':
    'Each page compares this product with a category of alternative whose facts can be read from official documentation. A named product gets a page when its current facts can be read from its own public pages, and not before.',
  'web.comparison.index.checked': 'Checked {date}',
} as const;
