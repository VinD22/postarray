/**
 * The three project-led use case pages.
 *
 * These describe workflows, not capabilities. The rule that binds every string
 * here: a sentence may describe how the product is designed and what has been
 * built, and may never imply that anything reaches a platform. Nothing
 * publishes, so "what works today" is written in the past and present tense of
 * the build, not of a live service.
 */
export const webUseCaseMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.useCases.title': 'Use cases',
  'web.meta.useCases.description':
    'Three workflows this product is being built around: running several clients in one place, getting work approved before it goes out, and taking one idea to several platforms without rewriting it.',
  'web.meta.useCase.clients.title': 'Managing multiple clients',
  'web.meta.useCase.clients.description':
    'Separate projects, separate connected accounts, separate approvals and separate reporting, for teams publishing on behalf of other people.',
  'web.meta.useCase.approvals.title': 'Approval workflows',
  'web.meta.useCase.approvals.description':
    'How a draft becomes an approved post: who reviews it, what invalidates an approval, and why the same rule holds on every surface.',
  'web.meta.useCase.crossPlatform.title': 'Cross-platform publishing',
  'web.meta.useCase.crossPlatform.description':
    'One master draft, one adapted version per platform, validated against each platform recorded limits before anything is scheduled.',

  /* ---------------------------------------------------------------------- */
  /* Shared furniture                                                       */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': 'Use cases',
  'web.useCases.index.lede':
    'Three workflows this product is being built around. Each page says what the workflow costs a team today, how the product is designed to handle it, and which parts are actually built.',
  'web.useCases.index.listLabel': 'Use cases',

  'web.useCases.notice.title': 'This describes a design, not a running service',
  'web.useCases.notice.body':
    'No connector is verified in production, so nothing on this page publishes anywhere yet. Where a part of the workflow is built, it says so. Where it is not, it says that too.',

  'web.useCases.section.problem': 'The problem',
  'web.useCases.section.approach': 'How the product is designed',
  'web.useCases.section.today': 'What is actually built',
  'web.useCases.section.related': 'Related',

  /* ---------------------------------------------------------------------- */
  /* Managing multiple clients                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': 'Managing multiple clients',
  'web.useCases.clients.lede':
    'Work for one client should never be one wrong click away from another client audience.',
  'web.useCases.clients.problem':
    'Most teams separate clients by being careful. One shared account holds every connected page, one calendar holds every schedule, and the only thing standing between a client draft and the wrong audience is the person looking at the screen at 6pm. When somebody leaves the team, the separation leaves with the habit.',
  'web.useCases.clients.approach1':
    'A project is the unit of separation. Connected accounts, drafts, queues, media and receipts belong to a project, and a member sees only the projects they were added to.',
  'web.useCases.clients.approach2':
    'The separation is enforced three times: at authentication, in the application service that authorizes the action, and in the database itself through row level security. Being signed in is never treated as permission.',
  'web.useCases.clients.approach3':
    'Reporting follows the same boundary, so a per client report is the default shape rather than a spreadsheet someone assembles by hand.',
  'web.useCases.clients.today':
    'Projects, project scoped membership and the row level security policies behind them are built and tested, including tests that attempt cross-project reads and assert they fail. Plans are sized by how many projects a team needs. Nothing publishes to a platform from any project yet.',

  /* ---------------------------------------------------------------------- */
  /* Approval workflows                                                     */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': 'Approval workflows',
  'web.useCases.approvals.lede':
    'An approval is only worth something if the thing approved is the thing that goes out.',
  'web.useCases.approvals.problem':
    'Approvals usually live outside the tool that publishes. A screenshot goes to a client, the client replies yes, and then the copy changes. The approval now refers to a draft nobody has, and the tool has no idea, so it publishes whatever it was last given.',
  'web.useCases.approvals.approach1':
    'An approval is attached to the exact content that was reviewed. Editing an approved draft invalidates the approval and says which field changed, rather than quietly carrying the old decision forward.',
  'web.useCases.approvals.approach2':
    'A reviewer can approve, request changes or reject, and a comment is required for anything other than approval, so the author is never left guessing what to fix.',
  'web.useCases.approvals.approach3':
    'The rule lives in the shared application layer, so the web app, the REST API, the MCP server, the CLI and webhooks all obey it. No surface has a shortcut around review.',
  'web.useCases.approvals.today':
    'The approval states, the review surface, the re-approval rules and the audit events behind them are built. What is not built is the last step, because no connector has passed its definition of done, so an approved post has nowhere to go yet.',

  /* ---------------------------------------------------------------------- */
  /* Cross-platform publishing                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': 'Cross-platform publishing',
  'web.useCases.crossPlatform.lede':
    'One idea, one edit, and a version per platform that respects what that platform actually accepts.',
  'web.useCases.crossPlatform.problem':
    'Posting the same text everywhere produces a version that is truncated on one platform, missing a required title on another, and carrying a link that a third one silently strips. The alternative, rewriting by hand five times, is where the work actually goes.',
  'web.useCases.crossPlatform.approach1':
    'A master draft holds the idea. Each selected account gets its own version, and an edit to the master applies only where it fits, saying plainly which targets could not take it and why.',
  'web.useCases.crossPlatform.approach2':
    'Validation runs against the recorded limits for each platform, counted the way that platform counts, so a character ceiling is checked in graphemes where the platform uses graphemes and in weighted units where it uses those.',
  'web.useCases.crossPlatform.approach3':
    'Every platform limit shown anywhere on this site is generated from the connector registry and carries the document it came from and the date a person read it.',
  'web.useCases.crossPlatform.today':
    'The composer, the per target versions, the validation rules and the generated limits dataset are built. The publishing step is not: no connector is verified in production, so a validated draft can be scheduled internally and cannot reach a platform.',
} as const;
