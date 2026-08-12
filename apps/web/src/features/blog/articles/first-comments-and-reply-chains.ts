import { ROUTES } from '@/features/marketing/site';

import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import type { BlogArticle } from '../types';

/**
 * Content module, loaded per slug. Each language this article exists in is a
 * key of `content`. See `../types.ts` for why article prose is not in the ICU
 * catalog, and why titles are written per language rather than translated.
 */
export const firstCommentsAndReplyChains: BlogArticle = {
  slug: 'first-comments-and-reply-chains',
  cluster: 'adaptation',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-10',
  updated: '2026-08-10',
  sources: [
    {
      title: 'Create a post, X API',
      url: 'https://docs.x.com/x-api/posts/create-post',
      readOn: '2026-08-10',
    },
    {
      title: 'Comments API, LinkedIn community management',
      url: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/comments-api',
      readOn: '2026-08-10',
    },
    {
      title: 'Creating a post, Bluesky',
      url: 'https://docs.bsky.app/docs/tutorials/creating-a-post',
      readOn: '2026-08-10',
    },
    {
      title: 'Instagram Platform content publishing',
      url: 'https://developers.facebook.com/docs/instagram-platform/content-publishing/',
      readOn: '2026-08-10',
    },
  ],
  content: {
    en: {
      title: 'First comments and reply chains are a second publish, not a field',
      description:
        'A first comment and a thread are extra calls that can fail on their own, with their own permissions and their own rate limits. Plan them as publications.',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Most scheduling interfaces show a first comment as a second text box under the post, and a thread as a list of boxes. That framing is comfortable and it is wrong. Every one of those boxes is a separate call to the platform, made after the first one succeeded, and each can fail on its own for reasons the first one never met.',
        },
        {
          kind: 'paragraph',
          text: 'Once you see them as publications rather than fields, the questions change. What happens when the post goes out and the comment does not. Who is allowed to leave the comment. What the reader sees in the seconds in between.',
        },

        {
          kind: 'heading',
          id: 'ordering',
          text: 'The second call needs an identifier the first one produces',
        },
        {
          kind: 'paragraph',
          text: 'A reply, a comment and a thread continuation all address something that has to exist first. The identifier comes back from the platform, not from your planning tool, so the second call cannot be prepared in advance and fired at the same moment.',
        },
        {
          kind: 'list',
          items: [
            'The X create endpoint takes a reply object carrying in_reply_to_tweet_id, so a chain is a sequence of calls where each one waits for the identifier the previous one returned.',
            'A Bluesky post record carries a reply with a root and a parent strong reference, which means a chain remembers both where it started and what it answers, and both have to be resolved before the call is made.',
            'LinkedIn comments are created against the post URN through a social actions endpoint, and a nested comment additionally names the parent comment it hangs from.',
            'Instagram publishing is already two steps: create a media container, then publish it. A first comment cannot be attempted until the publish step returns, because the thing to comment on does not exist until then.',
          ],
        },
        {
          kind: 'callout',
          title: 'A gap is guaranteed, so decide what belongs in it',
          body: 'There is always a window between the post appearing and the comment appearing. If the post is unreadable without the comment, for example when the link or the disclosure only lives there, the plan is wrong regardless of how fast the calls are.',
        },

        {
          kind: 'heading',
          id: 'permissions',
          text: 'Commenting is a different permission from posting',
        },
        {
          kind: 'paragraph',
          text: 'The most common surprise is an application that can publish and cannot comment, because the two are governed separately.',
        },
        {
          kind: 'paragraph',
          text: 'LinkedIn documents its comment permissions as their own set, restricted to members holding specific company page roles on the organization in question. An application authorized to post for a page has not automatically been authorized to comment as it, and the role a person holds decides whether the call is allowed at all.',
        },
        {
          kind: 'paragraph',
          text: 'The practical consequence is a test that has to be run per account rather than per platform. A first comment that works for one client page can fail for another simply because the person who connected the second page holds a different role.',
        },

        {
          kind: 'heading',
          id: 'limits',
          text: 'The second call has its own limits and its own refusals',
        },
        {
          kind: 'table',
          caption: 'Documented refusals that only affect the follow up call',
          columns: ['What the platform documents', 'What it means for a scheduled chain'],
          rows: [
            [
              'LinkedIn lists a 403 for including an image in an inline comment, described as not currently supported',
              'A comment that carries an image is not a formatting choice you can retry. Plan text, or plan a different destination for the image.',
            ],
            [
              'LinkedIn lists a 429 described as a comment creation rate limit for the member',
              'A burst of comments across many posts can be throttled even when every individual post published. Space them, and treat the throttle as expected rather than exceptional.',
            ],
            [
              'X documents quote_tweet_id as requiring the Enterprise plan',
              'A quote is not always available to the same client that can reply. Check your access level before designing a format around it.',
            ],
            [
              'Instagram limits an account to 100 API published posts in a 24 hour moving period',
              'Chains multiply calls against the account, so a busy day of threaded work reaches a ceiling sooner than a count of ideas suggests.',
            ],
          ],
        },

        { kind: 'heading', id: 'failure', text: 'Decide the failure behaviour before you need it' },
        {
          kind: 'paragraph',
          text: 'A chain has exactly three honest outcomes and you should choose which one your process wants before a chain half publishes at two in the morning.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Leave the post and report the missing comment. Right when the post stands alone and the comment adds something optional.',
            'Retry the comment on a schedule, with a limit, and stop. Right when the comment is important and lateness is acceptable.',
            'Delete the post and report the whole thing as failed. Rarely right, because a deletion is visible and the reader has already seen the post.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'Whichever you choose, the record afterwards has to say which parts published and which did not, with the platform identifier for each part that succeeded. A single status of published or failed cannot describe a chain, and a tool that only offers those two is hiding the state you actually need.',
        },

        { kind: 'heading', id: 'writing', text: 'Write the chain so any prefix of it stands alone' },
        {
          kind: 'paragraph',
          text: 'The editorial version of the same rule is stricter and more useful than any retry policy. Write so that the first post is complete on its own, the first two are complete on their own, and so on. A chain built this way degrades into a shorter chain rather than into nonsense.',
        },
        {
          kind: 'paragraph',
          text: 'This also removes the worst habit in threaded writing, which is holding the point back to reward the reader for continuing. If the point is in the fourth call, a rate limit on the second one deletes it.',
        },
        {
          kind: 'callout',
          title: 'Disclosures never go in the follow up',
          body: 'If a post is an advertisement or carries a material connection, the disclosure belongs in the first call, in the mechanism that destination provides. A disclosure that lives in a comment is a disclosure that can silently fail to publish.',
        },
        {
          kind: 'cta',
          label: 'See which capabilities are recorded per platform, and which are still unbuilt',
          href: ROUTES.capabilities,
        },
      ],
    },
  },
};
