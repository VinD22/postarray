import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import type { BlogArticle } from '../types';

/**
 * Content module, loaded per slug. Each language this article exists in is a
 * key of `content`. See `../types.ts` for why article prose is not in the ICU
 * catalog, and why titles are written per language rather than translated.
 */
export const oneIdeaAdaptedPerPlatform: BlogArticle = {
  slug: 'one-idea-adapted-per-platform',
  cluster: 'adaptation',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-10',
  updated: '2026-08-10',
  sources: [
    {
      title: 'X automation rules and best practices',
      url: 'https://help.x.com/en/rules-and-policies/x-automation',
      readOn: '2026-08-04',
    },
    {
      title: 'Instagram Platform content publishing',
      url: 'https://developers.facebook.com/docs/instagram-platform/content-publishing/',
      readOn: '2026-08-04',
    },
    {
      title: 'LinkedIn Posts API, community management',
      url: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-03',
      readOn: '2026-08-04',
    },
    {
      title: 'TikTok content sharing guidelines',
      url: 'https://developers.tiktok.com/doc/content-sharing-guidelines/',
      readOn: '2026-08-04',
    },
    {
      title: 'YouTube Data API, videos insert',
      url: 'https://developers.google.com/youtube/v3/docs/videos/insert',
      readOn: '2026-08-04',
    },
  ],
  content: {
    en: {
      title: 'One idea, adapted per platform, not duplicated across them',
      description:
        'Cross posting the identical text is a policy risk on some platforms and impossible on others. Here is what actually differs, and how to adapt without writing five things.',
      blocks: [
        {
          kind: 'paragraph',
          text: 'The promise of cross posting is that one piece of writing becomes five posts for free. The reality is that some of those five will be rejected by the platform, some will be accepted and read badly, and on at least one platform the practice itself is against the rules.',
        },
        {
          kind: 'paragraph',
          text: 'The alternative is not writing five separate things. It is writing one idea and deciding, deliberately and in advance, what each destination changes about it.',
        },

        { kind: 'heading', id: 'rules', text: 'Duplication is sometimes a rule, not a taste' },
        {
          kind: 'paragraph',
          text: 'X publishes automation rules that name posting duplicative or substantially similar content across multiple accounts you control as a distinct problem. That is not advice about engagement. It is a policy about what you may do with accounts you own, and it applies to a scheduler exactly as it applies to a person.',
        },
        {
          kind: 'paragraph',
          text: 'This alone rules out the naive design where one text field fans out to every connected account. If you run more than one account on a platform with a rule of this shape, the safe default is one adapted variant per account, and the tool should make writing that variant the easy path rather than an override.',
        },

        { kind: 'heading', id: 'shapes', text: 'The platforms disagree about what a post even is' },
        {
          kind: 'paragraph',
          text: 'Before tone, before length, there is a structural question: does this destination accept the kind of thing you made. The answers are not consistent, and they are not negotiable.',
        },
        {
          kind: 'table',
          caption: 'Structural differences that decide whether a piece can exist at all',
          columns: ['Difference', 'What it means for adaptation'],
          rows: [
            [
              'Some destinations are video only',
              'A text idea has no home there unless someone makes a video. Plan that as work, not as an export setting.',
            ],
            [
              'Document posts exist in few places',
              "LinkedIn's Posts API documents a document post type. Most other platforms have no equivalent, so a slide deck becomes images or a link.",
            ],
            [
              'Threading is not universal',
              'A long argument split into a chain is native in some places and has no representation in others, where it must become one longer post or a link.',
            ],
            [
              'Alt text is not universal',
              'Some platforms have no alt text field at all, so an image that carries meaning through words needs that meaning in the visible caption instead.',
            ],
            [
              'Account type gates publishing',
              'Publishing through the official Instagram Platform requires a professional account, so the account type is a precondition for the whole plan.',
            ],
          ],
        },
        {
          kind: 'callout',
          title: 'Check the shape before the calendar',
          body: 'Deciding that Tuesday is a carousel day and then discovering the destination has no carousel is a planning failure that no amount of rewriting fixes. Establish the accepted shapes per destination once, write them down, and plan inside them.',
        },

        { kind: 'heading', id: 'review', text: 'Some destinations gate you before your first post' },
        {
          kind: 'paragraph',
          text: 'A second class of difference is procedural rather than structural. Several platforms require an approval step before an application may publish on a real account, and the gate is often about what visibility you are allowed to set rather than whether you can call the endpoint.',
        },
        {
          kind: 'list',
          items: [
            "TikTok's content sharing guidelines describe the review that governs what an application may do with post visibility, which is a different question from whether the upload succeeds.",
            "YouTube's Data API documents an audit for API clients, and until it is passed the visibility an uploaded video may be given is restricted.",
            "LinkedIn's community management surface requires an access review before an application may post on behalf of an organization.",
          ],
        },
        {
          kind: 'paragraph',
          text: 'For a publishing plan this means the launch date of a destination is the date its review completes, not the date the code works. Treat every gated destination as unavailable in the calendar until it is not, and say so out loud rather than leaving a column that silently never fills.',
        },

        { kind: 'heading', id: 'method', text: 'A method that is one piece of writing, not five' },
        {
          kind: 'paragraph',
          text: 'The practical technique is to separate the idea from its expression, and to write the idea in a form that no destination will ever receive.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Write the source note. One claim, the reason it is true, and the one thing a reader should do or think afterwards. This never gets published anywhere.',
            'Decide the shape per destination from the table you wrote earlier: text, image with caption, thread, document, video.',
            'Write the opening line per destination. This is where nearly all the adaptation lives, and it is usually two minutes of work.',
            'Cut or extend the body to the destination, and move the link to where that destination expects it.',
            'Write the media description per destination, in the field that destination actually has.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'Steps three to five are the only per destination work, and they take far less time than the first two. The saving that cross posting promised is real. It just comes from sharing the thinking, not from sharing the string.',
        },

        { kind: 'heading', id: 'signals', text: 'What to vary and what to hold constant' },
        {
          kind: 'paragraph',
          text: 'Adaptation goes wrong in the other direction too. A team that rewrites everything ends up saying five slightly different things, which is worse than saying one thing five ways.',
        },
        {
          kind: 'table',
          caption: 'A default split',
          columns: ['Hold constant', 'Vary per destination'],
          rows: [
            ['The claim and the evidence for it', 'The opening line and how much context it assumes'],
            ['Names, numbers and dates', 'Length, and whether the argument is one post or a chain'],
            ['The action you are asking for', 'Where the link sits, and whether there is one at all'],
            ['Required disclosures', 'Media format and how the media is described'],
          ],
        },
        {
          kind: 'callout',
          title: 'Disclosures are not a style choice',
          body: "If a post is an advertisement, a paid partnership or contains a material connection, the disclosure travels with the idea to every destination, in that destination's own mechanism where one exists. It is the one element that must never be adapted away.",
        },

        { kind: 'heading', id: 'audit', text: 'Keep a per destination sheet and date it' },
        {
          kind: 'paragraph',
          text: 'Everything above rests on facts about platforms, and platform facts expire. Keep one sheet per destination with the accepted shapes, the account type required, the review status, and the date each line was last checked against the official documentation. Not a blog post. The documentation.',
        },
        {
          kind: 'paragraph',
          text: 'A dated sheet turns an argument about what a platform allows into a lookup, and it tells you which lines are old enough to be worth rechecking before the next planning cycle.',
        },
      ],
    },
  },
};
