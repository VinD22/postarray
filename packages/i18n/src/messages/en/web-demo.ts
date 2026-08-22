/**
 * The in-page product demonstration: the hero demonstration on the home page
 * and the guided walkthrough at `/demo`.
 *
 * Rules that bind this file specifically:
 *
 *  - Every panel on those surfaces is built from the real design system, so a
 *    reader is looking at the interface rather than at a drawing of it. The
 *    copy must therefore never describe something the interface does not do.
 *  - The content is sample content for a company that does not exist, and it
 *    says so in words, in the caption a screen reader reads with the figure.
 *  - No number here is an engagement number. There is no follower count, no
 *    reach figure and no score, because the product has no such data and a
 *    demonstration that invents one is a fabricated dashboard.
 *  - Nothing publishes today. No connector has passed provider verification,
 *    so the demonstration stops at the point the product stops: a scheduled
 *    post, an approval, and a receipt whose publishing half is unavailable.
 *  - The demonstration submits nothing. It has no form, no destination and no
 *    account behind it, and the copy must not suggest otherwise.
 */
export const webDemoMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata and navigation                                                 */
  /* ---------------------------------------------------------------------- */

  'web.meta.demo.title': 'See how Relay works',
  'web.meta.demo.description':
    'A guided tour of the publishing workflow, from a new project to the receipt, shown in the real interface with sample content. Nothing publishes yet, and the tour says where that line is.',

  'web.demo.nav.label': 'See it work',
  'web.demo.nav.summary':
    'A guided tour of the product in the order you meet it, built from the real interface with sample content.',

  /* ---------------------------------------------------------------------- */
  /* The frame every demonstration panel sits in                             */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': 'Demonstration',
  'web.demo.frame.sample':
    'A demonstration built from the real interface, filled with sample content for a company that does not exist. Not a live account. Nothing here submits anything.',

  'web.demo.control.pause': 'Pause the demonstration',
  'web.demo.control.play': 'Play the demonstration',
  'web.demo.control.replay': 'Replay the demonstration',

  /* ---------------------------------------------------------------------- */
  /* The home page hero demonstration                                        */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.caption':
    'One draft becomes a version per platform, gets a time, and lands on the week. Sample content, not a live account.',
  'web.demo.hero.more': 'Walk through the whole workflow',

  /* ---------------------------------------------------------------------- */
  /* The walkthrough page                                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': 'How it works, in the order you meet it',
  'web.demo.lede':
    'Nine steps, from an empty workspace to the record of what happened. Each one shows the surface you would actually be looking at, with sample content in it. Nothing on this page moves on its own, so you can read it at your own pace.',
  'web.demo.notice.title': 'This is a demonstration, not a live account',
  'web.demo.notice.body':
    'Every panel here is the product interface with sample content in it. No connector has passed provider verification, so nothing publishes to any platform through this product today. Where the workflow stops, the page says so instead of drawing the rest.',
  'web.demo.contents.title': 'The nine steps',
  'web.demo.stepLabel': 'Step {position} of {total}',
  'web.demo.next': 'Next: {step}',
  'web.demo.closing.pricing': 'See what it costs',
  'web.demo.closing.title': 'That is the whole loop',
  'web.demo.closing.body':
    'Nothing above is a mock up of a product we hope to build. It is the interface as it stands, with the publishing half honestly marked as unfinished.',

  /* ---------------------------------------------------------------------- */
  /* The nine steps                                                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': 'Create a project',
  'web.demo.step.project.body':
    'A project holds accounts, drafts, approvals and a time zone. Every query in the product is scoped to one, in the application service and again in the database, so a client cannot see another client by accident.',

  'web.demo.step.connect.title': 'Connect an account',
  'web.demo.step.connect.body':
    'Connecting runs through official platform APIs only, and tells you what the platform requires of the account before you start. Today every connector stops at verification, which is why each row below says so rather than showing a green tick.',

  'web.demo.step.compose.title': 'Write it once, adapt it per platform',
  'web.demo.step.compose.body':
    'You write a master draft. Selecting one account opens an override for that account alone, with its own limits and its own preview. Nothing you write for LinkedIn changes what X receives, and the checks under each version run before anything is scheduled.',

  'web.demo.step.variants.title': 'See what each account actually receives',
  'web.demo.step.variants.body':
    'One draft becomes one version per account, each written for the platform it goes to: a shorter line for X, the full release note for LinkedIn, a caption and alt text for Instagram. You edit any of them without touching the others, and every version carries the check that applies to it.',

  'web.demo.step.schedule.title': 'Give it a time, or hand it to the queue',
  'web.demo.step.schedule.body':
    'A time is stored as an instant plus the project time zone, never as a naive local time, so a daylight saving change moves nothing under you. The queue is the other route: it takes the next slot allowed by the rules you set.',

  'web.demo.step.calendar.title': 'Watch the calendar',
  'web.demo.step.calendar.body':
    'The week shows the platform, the account, the state and the time for every post. Moving one is a button as well as a drag, so the calendar is fully usable from the keyboard.',

  'web.demo.step.receipt.title': 'Read the receipt afterwards',
  'web.demo.step.receipt.body':
    'Every attempt writes an immutable receipt: who wrote it, who approved it, under which policy, at which instant. The publishing half of that record is written by the publish run, which is the part that does not exist yet.',

  /* ---------------------------------------------------------------------- */
  /* Panel labels                                                            */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': 'Project',
  'web.demo.project.zone': 'Time zone: {zone}',
  'web.demo.project.scope':
    'Drafts, accounts, approvals and receipts belong to this project and nowhere else.',

  'web.demo.accounts.label': 'Accounts in this project',
  'web.demo.accounts.state': 'Verification not complete',
  'web.demo.accounts.note':
    'Each row would carry token health, the permissions granted and the last successful post. None of them can publish today.',

  'web.demo.master.label': 'Master draft',
  'web.demo.master.project': 'In project {project}',

  'web.demo.variants.label': 'What each account receives',

  'web.demo.schedule.label': 'Scheduled',
  'web.demo.schedule.value': '{when} in {zone}',
  'web.demo.schedule.approval': 'One approval is required before anything can be sent.',
  'web.demo.schedule.queue':
    'The queue is the other route: it picks the next slot your rules allow, in this time zone.',

  'web.demo.week.label': 'The week',
  'web.demo.week.caption': 'The same three posts on the calendar, read in the project time zone.',
  'web.demo.week.empty': 'Nothing scheduled',

  'web.demo.receipt.label': 'Receipt so far',
  'web.demo.receipt.pending':
    'What was sent, what the platform answered, the external post ID and the permalink are written by the publish run. They stay unavailable until a connector passes provider verification.',
  'web.demo.receipt.field.externalId': 'External post ID',
  'web.demo.receipt.field.permalink': 'Permalink',

  /* ---------------------------------------------------------------------- */
  /* Sample content                                                          */
  /*                                                                         */
  /* Northbound Tools is the sample company the marketing pages already use.  */
  /* Its handles sit on the reserved `.example` domain and its people are     */
  /* first names with no surname, so nothing here can be mistaken for a real  */
  /* customer, a real account or a real endorsement.                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools (sample)',
  'web.demo.sample.actor': 'Ada, sample teammate',
  'web.demo.sample.approver': 'Ravi, sample reviewer',
  'web.demo.sample.policy': 'One approval before sending',
  'web.demo.sample.master':
    'Northbound 2.4 is out today. Imports are faster, search has a keyboard shortcut, and the export bug two of you reported is fixed.',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'Northbound 2.4 is out. Faster imports, keyboard search, and that export bug is fixed.',
  'web.demo.sample.x.check': 'Character count and thread order',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    'Northbound 2.4 is out today. The release note explains the import changes and the export fix in full.',
  'web.demo.sample.linkedin.check': 'Organization role and post length',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    'The same release picture, with a caption written for the feed and alt text written by a person.',
  'web.demo.sample.instagram.check': 'Account type, aspect ratio and alt text',

  /* ---------------------------------------------------------------------- */
  /* The nine scene product tour                                             */
  /*                                                                         */
  /* The step names are the indicator's button labels, so they are short      */
  /* enough to sit in a row of nine and specific enough to be worth clicking. */
  /* They are also the labels of the stacked walkthrough a reader gets with   */
  /* reduced motion or no JavaScript, which is the same tour with the timing  */
  /* taken out rather than a reduced version of it.                           */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': 'Tour steps',
  'web.demo.tour.jump': 'Show step {position}: {step}',
  'web.demo.tour.step.project': 'Create a project',
  'web.demo.tour.step.connect': 'Connect accounts',
  'web.demo.tour.step.compose': 'Compose once',
  'web.demo.tour.step.variants': 'Adapt per platform',
  'web.demo.tour.step.validate': 'Check it',
  'web.demo.tour.step.schedule': 'Give it a time',
  'web.demo.tour.step.week': 'See the week',
  'web.demo.tour.step.publish': 'Publish and record',
  'web.demo.tour.step.digest': 'Read the digest',

  /* ---------------------------------------------------------------------- */
  /* Checks (step 5)                                                         */
  /*                                                                         */
  /* Only checks the composer genuinely runs today: the per account character */
  /* limit (`validation.text_too_long`), alt text on every image             */
  /* (`validation.alt_text_missing`), and whether a first comment is allowed  */
  /* on the account it was written for (the `firstComment` capability).       */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': 'Checks before scheduling',
  'web.demo.validate.check.length': 'Character limit, per account',
  'web.demo.validate.check.lengthDetail':
    'Each version is measured against the limit the platform gives that account.',
  'web.demo.validate.check.altText': 'Alt text on every image',
  'web.demo.validate.check.altTextDetail':
    'An image without a description, or without being marked decorative, stops the schedule.',
  'web.demo.validate.check.firstComment': 'First comment allowed here',
  'web.demo.validate.check.firstCommentDetail':
    'A first comment is only offered on accounts whose platform supports one.',
  'web.demo.validate.note':
    'These run in the composer before anything is scheduled, and again before anything is sent.',

  /* ---------------------------------------------------------------------- */
  /* Publish and receipt (step 8)                                            */
  /*                                                                         */
  /* The steps a scheduled post has really passed are completed. Everything   */
  /* the publish run would write is pending, because no connector has passed  */
  /* provider verification, so there is no publish run to write it.           */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': 'Publishing and the record of it',
  'web.demo.live.step.approved': 'Approved by {approver}',
  'web.demo.live.step.queued': 'Queued for its slot',
  'web.demo.live.step.sent': 'Sent to the platform',
  'web.demo.live.step.confirmed': 'Confirmed by the platform',
  'web.demo.live.badge.pending': 'Not published',
  'web.demo.live.badge.live': 'Live',
  'web.demo.live.pending':
    'The last two steps are written by the publish run. No connector has passed provider verification yet, so they stay pending and the external post ID and permalink stay unavailable.',

  /* ---------------------------------------------------------------------- */
  /* The weekly digest (step 9)                                              */
  /*                                                                         */
  /* Sentences about what the product did, never engagement figures. There is */
  /* no reach, no impression count and no score here, because the product has */
  /* none to read and a digest that invented one would be a fabricated        */
  /* dashboard with a friendlier voice.                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': 'Your week, in sentences',
  'web.demo.digest.sample': 'Sample',
  'web.demo.digest.line.variants':
    'Three platform-native versions went out from one draft this week.',
  'web.demo.digest.line.earliest': 'Tuesday morning was your earliest slot.',
  'web.demo.digest.line.approval': 'Every version was approved before it was queued.',
  'web.demo.digest.line.alt': 'Every image carried alt text written by a person.',
  'web.demo.digest.footer': 'Live analytics appear here as your posts publish.',

  /* ---------------------------------------------------------------------- */
  /* The three added walkthrough steps                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': 'Check it before it is scheduled',
  'web.demo.step.validate.body':
    'The composer measures each version against the account it is written for: the character limit that account really has, alt text on every image, and whether the platform offers a first comment at all. A version that fails a check cannot be scheduled.',

  'web.demo.step.publish.title': 'Publish, and keep the record',
  'web.demo.step.publish.body':
    'A publish run sends each version at its instant, records what the platform answered, and writes an immutable receipt. That run is the part that does not exist yet, so the last two steps below are pending rather than drawn as finished.',

  'web.demo.step.digest.title': 'Read the weekly digest',
  'web.demo.step.digest.body':
    'The digest describes what the product did in sentences: how many versions went out from one draft, which slot was earliest, what was approved. It carries no engagement figures, because analytics come from the platforms after a post publishes and nothing publishes yet.',
} as const;
