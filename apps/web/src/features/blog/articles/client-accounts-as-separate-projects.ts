import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import type { BlogArticle } from '../types';

/**
 * Content module. English only, loaded per slug. See `../types.ts` for why
 * article prose is not in the ICU catalog.
 */
export const clientAccountsAsSeparateProjects: BlogArticle = {
  slug: 'client-accounts-as-separate-projects',
  title: 'Run client accounts as separate projects, not as shared logins',
  description:
    'Shared passwords make offboarding impossible and audit trails meaningless. What a per client boundary needs to contain, and what it costs to add one later.',
  cluster: 'operations',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-10',
  updated: '2026-08-10',
  sources: [
    {
      title: 'Meta business verification in the app release process',
      url: 'https://developers.facebook.com/docs/development/release/business-verification/',
      readOn: '2026-08-04',
    },
    {
      title: 'LinkedIn community management app review',
      url: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management-app-review?view=li-lms-2026-01',
      readOn: '2026-08-04',
    },
  ],
  blocks: [
    {
      kind: 'paragraph',
      text: 'Every agency starts the same way. One shared password manager entry per client, one browser profile, and a rule that whoever is posting today logs in as the client. It works until the third client, and then it fails in five directions at once.',
    },
    {
      kind: 'paragraph',
      text: 'The fix is not a stricter password policy. It is a boundary: a project per client, with its own connections, its own people, its own approval chain and its own record of what happened.',
    },

    { kind: 'heading', id: 'symptoms', text: 'What shared logins actually cost' },
    {
      kind: 'list',
      items: [
        'Offboarding is impossible to prove. When a contractor leaves, the honest answer to whether they can still post is a password rotation and a hope, not a revocation you can point at.',
        'The audit trail says nothing. Every action was taken by the client account, so the question of who scheduled the post that caused the complaint has no answer.',
        'Blast radius is the whole book of business. One compromised session reaches every client at once rather than one.',
        'Least privilege is unavailable. A junior who should be able to draft can also delete, because there is exactly one level of access and it is total.',
        'Client exit is a negotiation. Handing back an account tangled into a shared setup takes days, and the client remembers it.',
      ],
    },
    {
      kind: 'callout',
      title: 'The test that settles the argument',
      body: 'Pick a person who left three months ago and a client you no longer work with. Can you demonstrate, from a record, that the person cannot post and the client is disconnected. If the answer needs a person to remember something, there is no boundary.',
    },

    { kind: 'heading', id: 'oauth', text: 'Official APIs already give you the boundary' },
    {
      kind: 'paragraph',
      text: 'Publishing through an official platform API does not use a password. The client authorizes an application, the application holds a scoped token for that account, and the client can revoke it from their own settings without changing anything else. That is a per client boundary handed to you by design.',
    },
    {
      kind: 'paragraph',
      text: 'It comes with obligations that reinforce the same structure. Meta documents a business verification step in the release process for applications requesting advanced access, and LinkedIn requires an access review before an application may act on behalf of an organization. Both processes ask who you are and what you will do with the access. Both are considerably easier to answer when each client is a distinct, describable relationship rather than a shared browser profile.',
    },

    {
      kind: 'heading',
      id: 'contains',
      text: 'What a project has to contain to be a real boundary',
    },
    {
      kind: 'paragraph',
      text: 'A project that only groups posts is a folder. A project that is a boundary owns everything a client relationship touches.',
    },
    {
      kind: 'table',
      caption: 'The contents of a per client project',
      columns: ['Thing', 'Why it belongs to the project and not to the agency'],
      rows: [
        [
          'Platform connections',
          'A token is granted by one client for one set of accounts. It should be impossible to use it from another project.',
        ],
        [
          'People and roles',
          'Access is per engagement. A freelancer on one client should not be able to see another.',
        ],
        ['Approval chain', 'Who signs off is a term of that contract, and it differs by client.'],
        [
          'Time zone and posting windows',
          'The audience of one client is not the audience of another.',
        ],
        [
          'Brand rules and required disclosures',
          'A disclosure obligation belongs to the client relationship, not to your house style.',
        ],
        [
          'Receipts and audit events',
          'The record of what published is the thing you hand over at the end.',
        ],
        [
          'Media',
          'Rights to an asset were granted for one client. Reusing it elsewhere is a licensing problem.',
        ],
      ],
    },
    {
      kind: 'paragraph',
      text: 'The list is worth reading as a checklist against whatever you use today. Anything on it that is currently agency wide is a boundary violation waiting to be discovered by a client rather than by you.',
    },

    { kind: 'heading', id: 'enforce', text: 'Enforce the boundary more than once' },
    {
      kind: 'paragraph',
      text: 'A boundary that exists only in the interface is a convention. A person who edits a URL, or a script written by a well meaning contractor, walks straight through it.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'At the door: authentication proves who is asking.',
        'In the service: authorization proves this person may act on this project, checked in the code path every surface shares rather than in each screen.',
        'In the database: a row level rule makes a query for another project return nothing, so a bug in the layer above becomes an empty result rather than a leak.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Three checks sounds excessive until you consider that each of them fails differently. The first fails to a stolen session, the second to a missing check on one new endpoint, the third only to a deliberate change in the database itself. They are not redundant. They are independent.',
    },

    { kind: 'heading', id: 'migrate', text: 'Moving from shared logins without stopping work' },
    {
      kind: 'paragraph',
      text: 'The migration is unglamorous and takes about a week of attention spread over a month. It is worth doing before the next client rather than after the next incident.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Inventory. One row per client, per platform account, listing who currently has access and how.',
        "Create one project per client and connect that client's accounts through the official authorization flow, with the client present. This is also the moment they see exactly what they are granting.",
        'Assign people per project, at the lowest role that lets them do their job. Resist a single administrator role for the whole agency.',
        'Move the calendar for one client only, run it in parallel for two weeks, and compare what published against what was planned.',
        'Rotate the old shared credentials and remove them from the password manager. Not later. This step is the whole point.',
        'Write the offboarding runbook while the detail is fresh, and test it on someone who has actually left.',
      ],
    },
    {
      kind: 'callout',
      title: 'Do the smallest client first',
      body: 'The instinct is to prove the model on the biggest account. Do the opposite. The smallest engagement exposes the same structural questions with the least at stake, and a fortnight of running it teaches you what your runbook is missing.',
    },

    { kind: 'heading', id: 'handover', text: 'The boundary is what you hand over at the end' },
    {
      kind: 'paragraph',
      text: 'Engagements end. When one does, a per client project turns a delicate conversation into an export and a revocation: here is everything that published, here is the media, and your accounts no longer authorize us. The client keeps their access the whole time, because it was always theirs.',
    },
    {
      kind: 'paragraph',
      text: 'That clean ending is also a sales argument, and it is one of the few that a prospect can verify before signing. Ask any agency how a client leaves. The answer describes the architecture more accurately than the pitch deck does.',
    },
  ],
};
