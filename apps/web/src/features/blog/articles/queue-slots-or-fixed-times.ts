import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import type { BlogArticle } from '../types';

/**
 * Content module, loaded per slug. Each language this article exists in is a
 * key of `content`. See `../types.ts` for why article prose is not in the ICU
 * catalog, and why titles are written per language rather than translated.
 */
export const queueSlotsOrFixedTimes: BlogArticle = {
  slug: 'queue-slots-or-fixed-times',
  cluster: 'scheduling',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-10',
  updated: '2026-08-10',
  sources: [
    {
      title: 'IANA Time Zone Database',
      url: 'https://www.iana.org/time-zones',
      readOn: '2026-08-10',
    },
    {
      title: 'X automation rules and best practices',
      url: 'https://help.x.com/en/rules-and-policies/x-automation',
      readOn: '2026-08-04',
    },
  ],
  content: {
    en: {
      title: 'Queue slots or fixed times: two scheduling models, two failure modes',
      description:
        'A fixed time says when a post goes out. A queue slot says where it lands in a rhythm. The difference decides what breaks when a week changes.',
      blocks: [
        {
          kind: 'paragraph',
          text: 'There are only two ways to answer the question of when a post goes out, and every scheduling tool is a variation on one of them.',
        },
        {
          kind: 'list',
          items: [
            'A fixed time binds a piece to an instant. This post, Thursday, 09:30, Europe/Berlin.',
            'A queue slot binds a piece to a position in a repeating rhythm. This post, next available weekday morning slot, whenever that turns out to be.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'Teams usually pick by habit rather than by fit, then spend a year fighting the failure mode of the model they picked. The two models fail in opposite directions, which makes the choice easy once you name them.',
        },

        { kind: 'heading', id: 'fixed', text: 'What a fixed time is good at' },
        {
          kind: 'paragraph',
          text: 'A fixed time is a commitment, and commitments are what coordination is made of. If a post has to land with a press embargo, a product release, an event opening, a sponsor obligation or a partner announcement, there is no substitute. The time is part of the content.',
        },
        {
          kind: 'paragraph',
          text: 'Fixed times are also easier to reason about after the fact. When someone asks why a post went out at 09:30, the answer is that someone chose 09:30. There is no scheduling logic to reconstruct.',
        },
        {
          kind: 'callout',
          title: 'The failure mode of fixed times',
          body: 'Fixed times do not reflow. Move one piece and the ones behind it do not move with it, so a delayed week produces a cluster on Thursday and silence on Monday. The calendar still looks planned. The reader experiences a burst.',
        },

        { kind: 'heading', id: 'slots', text: 'What a queue slot is good at' },
        {
          kind: 'paragraph',
          text: 'A queue slot separates two decisions that fixed times fuse together: what the rhythm is, and what goes into it. You define the rhythm once, as a set of windows in a named time zone, and then work only on the ordering of the queue.',
        },
        {
          kind: 'paragraph',
          text: 'This is the model that survives a bad week. Something slips, the queue reflows, gaps stay even, and the rhythm a reader perceives is unchanged. It is also the model that makes a buffer visible: a queue with eleven items and three slots a week is three and a half weeks of runway, stated as a fact rather than a feeling.',
        },
        {
          kind: 'table',
          caption: 'The same delay under each model',
          columns: ['Situation', 'Fixed times', 'Queue slots'],
          rows: [
            [
              'One piece is not approved in time',
              'A gap on its day, unchanged elsewhere',
              'Everything behind it moves up one slot',
            ],
            [
              'Three pieces arrive at once',
              'Three chosen times, possibly clustered',
              'Three consecutive slots, evenly spaced',
            ],
            [
              'A public holiday lands mid week',
              'Each affected post is edited by hand',
              'The window is closed once and the queue reflows',
            ],
            [
              'A launch must land at a specific minute',
              'Exactly what the model is for',
              'Needs an escape hatch back to a fixed time',
            ],
          ],
        },
        {
          kind: 'callout',
          title: 'The failure mode of queue slots',
          body: 'A slot is a prediction, not a commitment. If a person needs to know the exact minute a piece will publish, a queue answers with an estimate that can move when the item ahead of it moves. Any queue used for real work needs a way to pin one item to a real time and a way to see the resolved time before it happens.',
        },

        { kind: 'heading', id: 'hybrid', text: 'Most real calendars are a hybrid' },
        {
          kind: 'paragraph',
          text: 'In practice the honest arrangement is a queue for the steady majority and fixed times for the small number of pieces with an external obligation. The design question is what happens where the two meet.',
        },
        {
          kind: 'list',
          items: [
            'A pinned item should consume a slot rather than sit beside one, otherwise the day it lands on quietly gets two posts.',
            'A pinned item that moves should release its slot back to the queue rather than leave a hole.',
            'The queue should refuse to place two items within a minimum gap, including across the boundary with pinned items.',
            'Every slot a person accepts should be shown as a resolved local time and its equivalent in the reference zone, not as the phrase next slot.',
          ],
        },

        { kind: 'heading', id: 'zones', text: 'Both models depend on a named time zone' },
        {
          kind: 'paragraph',
          text: 'A rhythm expressed as weekday mornings is meaningless until you say whose morning. The rules that convert a local wall clock time into an instant are jurisdictional, they change, and the reference dataset that records those changes is the IANA time zone database, which is revised when a government alters its rules.',
        },
        {
          kind: 'paragraph',
          text: 'This is why a stored schedule needs both an instant and the zone name it was expressed in. Store only the instant and you cannot honour a later rule change. Store only the local time and you have no instant at all. Queue slots make this more visible than fixed times do, because a queue keeps generating new times after the rules have moved.',
        },

        { kind: 'heading', id: 'choose', text: 'Choosing between them' },
        {
          kind: 'paragraph',
          text: 'Two questions settle it for most teams.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Does anything outside your team depend on the exact minute? If yes, that piece needs a fixed time, whatever the rest of the calendar does.',
            'Do gaps between posts matter more than the specific times? If yes, the steady work belongs in a queue, because keeping gaps even by hand is a chore that gets abandoned.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'One thing neither model is: a way to post more of the same thing in more places. X publishes automation rules that treat duplicative or substantially similar content across multiple accounts you control as a distinct violation, independent of the timing mechanism. A queue that fans one text out to five accounts has not solved a scheduling problem. It has automated a policy breach.',
        },
        {
          kind: 'paragraph',
          text: 'Pick the model that matches how your work actually arrives. Then write down which pieces are allowed to be pinned, because that list is the part that grows quietly until the queue is doing nothing at all.',
        },
      ],
    },
  },
};
