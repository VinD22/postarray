import { ROUTES } from '@/features/marketing/site';

import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import type { BlogArticle } from '../types';

/**
 * Content module. English only, loaded per slug. See `../types.ts` for why
 * article prose is not in the ICU catalog.
 */
export const whenHalfAPostPublishes: BlogArticle = {
  slug: 'when-half-a-post-publishes',
  title: 'When half a multi platform post publishes',
  description:
    'Partial success is the normal outcome of publishing to several platforms at once. Here is how to recover from it without publishing anything twice.',
  cluster: 'operations',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-10',
  updated: '2026-08-10',
  sources: [
    {
      title: 'Instagram Platform content publishing',
      url: 'https://developers.facebook.com/docs/instagram-platform/content-publishing/',
      readOn: '2026-08-10',
    },
    {
      title: 'Posts API, LinkedIn community management',
      url: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api',
      readOn: '2026-08-10',
    },
    {
      title: 'Create a post, X API',
      url: 'https://docs.x.com/x-api/posts/create-post',
      readOn: '2026-08-10',
    },
  ],
  blocks: [
    {
      kind: 'paragraph',
      text: 'One idea sent to five destinations is five independent publications. Four of them can succeed while the fifth times out, and that is not an edge case. It is the ordinary weather of publishing across platforms, and a process that has no answer for it will eventually resolve it by publishing something twice.',
    },
    {
      kind: 'paragraph',
      text: 'This article is about the hour after that happens: what the states actually are, which ones are recoverable, and how to retry without turning one post into two.',
    },

    { kind: 'heading', id: 'states', text: 'Four states, and only one of them is simple' },
    {
      kind: 'list',
      items: [
        'Accepted and confirmed. The platform returned an identifier. This is the only state where you know what the reader sees.',
        'Refused. The platform returned an error before doing anything. Nothing exists, and a retry is safe once the cause is fixed.',
        'Unknown. The call timed out, or the connection dropped after the request was sent. The platform may have done the work. A blind retry here is how duplicates are born.',
        'Accepted and still processing. The platform took the work and has not finished it. Instagram documents this explicitly for video: create a container, then query its status, which its own guidance suggests doing once per minute for no more than five minutes before publishing.',
      ],
    },
    {
      kind: 'callout',
      title: 'Unknown is a state, not a failure',
      body: 'The most expensive mistake is collapsing unknown into failed, because failed invites a retry. Record unknown as itself, resolve it by reading the platform rather than by writing to it, and only then decide.',
    },

    { kind: 'heading', id: 'resolve', text: 'Resolve an unknown by reading, never by writing' },
    {
      kind: 'paragraph',
      text: 'The safe recovery for an unknown is a read against the platform for what exists on that account, using an identifier or a marker you controlled before the call. LinkedIn, for example, documents retrieving posts by author with a sort by creation or last modified time, which is exactly the read you need to answer whether your post landed.',
    },
    {
      kind: 'paragraph',
      text: 'That read has to be paired with something recognizable in the post itself. Time is not enough on a busy account, and neither is the opening line if the same line runs on several destinations. A durable local record of the attempt, with the exact text sent and the timestamp of the request, is what makes the read conclusive.',
    },

    {
      kind: 'heading',
      id: 'idempotency',
      text: 'What the platforms promise, and what they do not',
    },
    {
      kind: 'table',
      caption: 'Documented behaviour that decides how a retry can be written',
      columns: ['What is documented', 'What it lets you do'],
      rows: [
        [
          'LinkedIn states that post deletions are idempotent, and that deleting an already deleted post returns 204',
          'Cleanup after a partial failure is safe to repeat. Creation carries no equivalent promise, so the create path still needs your own guard.',
        ],
        [
          'LinkedIn documents a PUBLISH_FAILED lifecycle state and states that an edit is required before publishing is reattempted',
          'A failed publish is not always retried by sending the same call again. Read the state first, and treat a failed state as work for a person.',
        ],
        [
          'Instagram separates container creation from publishing, and limits an account to 100 API published posts in a 24 hour moving period',
          'A retry that recreates a container consumes the same ceiling as a real post. Reuse the container you already made rather than starting again.',
        ],
        [
          'X documents the create call as a single request with a reply object for chains',
          'There is no partial publish inside one call, but a chain of calls has as many failure points as it has links.',
        ],
      ],
    },
    {
      kind: 'paragraph',
      text: 'Notice the shape of that table. Deletion is idempotent in one place, publishing is a two step process in another, and nowhere is creation promised to be safe to repeat. Publish once semantics are something you build, not something you are given.',
    },

    { kind: 'heading', id: 'building', text: 'The three pieces that make a retry safe' },
    {
      kind: 'list',
      ordered: true,
      items: [
        'A key you generate before the first call and reuse for every retry of that same intent, so your own system can recognise a repeat even when the platform cannot.',
        'A record written before the call, not after it. A record written only on success cannot describe the case where the process died between the request and the response.',
        'A read path that can answer, for one account and one attempt, whether the work exists on the platform. Without this, every unknown ends in a human opening the account and looking.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'None of that is exotic, and all of it has to exist before the first partial failure rather than after it. The reason to build it early is not elegance. It is that the alternative, under time pressure, is somebody clicking retry.',
    },

    { kind: 'heading', id: 'people', text: 'What to tell the person who was counting on it' },
    {
      kind: 'paragraph',
      text: 'The operational half of partial success is communication. A status that says failed when three of five destinations published is a lie that costs somebody a morning. The honest report names each destination, its state, and the platform identifier where there is one.',
    },
    {
      kind: 'paragraph',
      text: 'It also has to distinguish what a retry would do. Retrying two failed destinations is not the same action as republishing everything, and a person under pressure will pick whichever button is larger. Make the safe action the obvious one.',
    },
    {
      kind: 'callout',
      title: 'Never let a scheduled post silently disappear',
      body: 'A publication that ends in an unknown state and is then dropped from the queue is the worst outcome available, because nobody learns anything. Keep it, mark it, and require a person to close it.',
    },
    {
      kind: 'cta',
      label: 'See what is recorded per platform, and what is not built yet',
      href: ROUTES.capabilities,
    },
  ],
};
