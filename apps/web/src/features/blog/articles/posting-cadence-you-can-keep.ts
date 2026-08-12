import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import type { BlogArticle } from '../types';

/**
 * Content module, loaded per slug. Each language this article exists in is a
 * key of `content`. See `../types.ts` for why article prose is not in the ICU
 * catalog, and why titles are written per language rather than translated.
 */
export const postingCadenceYouCanKeep: BlogArticle = {
  slug: 'posting-cadence-you-can-keep',
  cluster: 'cadence',
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
  ],
  content: {
    en: {
      title: 'Building a posting cadence you can keep',
      description:
        'How to size a publishing schedule against the hours you actually have, and what to change first when a week goes wrong.',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Most publishing plans fail in week three. The plan was written on a quiet Sunday, it assumed a quiet Sunday every week, and the first ordinary week ended it. Nothing about the content was wrong. The arithmetic was.',
        },
        {
          kind: 'paragraph',
          text: 'A cadence is a promise about time, not about ideas. This is how to size one so that the promise survives contact with a normal month, and how to shrink it deliberately instead of abandoning it by accident.',
        },

        { kind: 'heading', id: 'budget', text: 'Start from the hours, not from the channels' },
        {
          kind: 'paragraph',
          text: 'The usual planning order is backwards. People pick the channels first, then a frequency per channel, then discover the total. Do it the other way. Decide how many hours a week you will spend on publishing, in the calendar, defended like any other commitment, and only then find out what fits.',
        },
        {
          kind: 'paragraph',
          text: 'Be honest about what one post costs end to end. The writing is rarely the expensive part. A single piece usually carries a research step, a media step, a rewrite for each destination, an approval wait, and a check after it goes out. Two hours of writing can hide five hours of work.',
        },
        {
          kind: 'table',
          caption: 'A worked example of the true cost of one piece across three destinations',
          columns: ['Step', 'Typical time', 'Who is blocked'],
          rows: [
            ['Decide the idea and check it is not a repeat', '15 minutes', 'The writer'],
            ['Draft the source version', '45 minutes', 'The writer'],
            ['Adapt for each destination', '30 minutes', 'The writer'],
            ['Prepare and describe the media', '25 minutes', 'The writer or a designer'],
            ['Review and approval', '20 minutes of work, up to two days of waiting', 'Someone else'],
            ['Check what actually published', '10 minutes', 'Whoever is on call'],
          ],
        },
        {
          kind: 'paragraph',
          text: 'That example lands near two and a half hours of hands on work per piece, plus a wait that is outside your control. If you have four hours a week, you have one piece a week and some slack. A plan for five is not ambitious, it is arithmetic that has already failed.',
        },

        { kind: 'heading', id: 'floor', text: 'Set a floor, not a target' },
        {
          kind: 'paragraph',
          text: 'Targets are aspirational and get missed quietly. A floor is the smallest amount you will publish in a bad week, and it is the number the whole system should be designed around. Anything above the floor is a good week, not a requirement.',
        },
        {
          kind: 'list',
          items: [
            'Write the floor as a number per week per destination, not per month. Monthly numbers hide three empty weeks and a panic.',
            'Set it at roughly half of what a good week produces. If a good week is four posts, the floor is two.',
            'Keep the floor identical for at least eight weeks before changing it. A cadence you keep adjusting is not a cadence.',
            'Publish the floor even when the idea is ordinary. Consistency is a schedule property, not a quality property.',
          ],
        },
        {
          kind: 'callout',
          title: 'The floor is a staffing decision',
          body: 'If the floor cannot be met by one person in one ordinary week, it is not a content problem. It is a resourcing problem wearing a content costume, and no scheduling tool fixes it.',
        },

        { kind: 'heading', id: 'buffer', text: 'Hold a buffer that is measured in weeks' },
        {
          kind: 'paragraph',
          text: 'The single change that keeps a cadence alive is a buffer of finished, approved pieces waiting to go out. Not drafts. Finished. A draft in a folder is a promise to do work later, which is exactly the thing a bad week cannot afford.',
        },
        {
          kind: 'paragraph',
          text: 'Two weeks of buffer absorbs a holiday, an illness, or a launch. Four weeks starts to go stale, because anything referring to this month reads oddly next month. Somewhere between two and three weeks is the range that survives without rotting.',
        },
        {
          kind: 'paragraph',
          text: 'Build the buffer once, in a single deliberate block of work, and then treat it as capital. Every week you publish from the front of it and top up the back. The week you top up less than you spend is the week to notice, before the buffer is gone rather than after.',
        },

        { kind: 'heading', id: 'platform', text: 'Let each destination set its own rhythm' },
        {
          kind: 'paragraph',
          text: 'A single frequency applied to every destination is the fastest way to sound wrong on at least one of them. The platforms themselves also disagree about what repetition means, and some of those disagreements are written into their rules rather than into taste.',
        },
        {
          kind: 'paragraph',
          text: 'X publishes automation rules that treat posting duplicative or substantially similar content across multiple accounts you control as a distinct problem, separate from how often you post. That is a constraint on shape, not on volume, and it applies whether a person or a scheduler pressed the button.',
        },
        {
          kind: 'paragraph',
          text: 'Instagram is different in a way that changes planning rather than tone: publishing through the official Instagram Platform requires a professional account, so the first question is not how often to post but whether the account type permits scheduled publishing at all. Answer that before you build a calendar around it.',
        },
        {
          kind: 'list',
          items: [
            'Give each destination its own floor. Three a week somewhere fast moving and one a week somewhere slow is a coherent plan, not an inconsistent one.',
            'Track the gap between posts rather than the count per week. A reader experiences gaps, not spreadsheets.',
            'When you cut, cut a whole destination for a season rather than thinning every destination at once. Half a presence everywhere reads worse than a full presence in two places.',
          ],
        },

        { kind: 'heading', id: 'slip', text: 'What to do in the week it slips' },
        {
          kind: 'paragraph',
          text: 'It will slip. The useful question is what the system does on the day you notice, and the answer should already be written down before you need it.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Publish the floor from the buffer. Do not skip the week to protect a standard nobody outside the team can see.',
            'Cancel the extras above the floor without negotiating with yourself about each one.',
            'Write one line in a log saying what was cut and why. Three of those lines in a row is a real signal about capacity.',
            'Refill the buffer before adding anything new. The buffer is the thing that failed, so it is the thing to repair.',
            'If the floor is missed twice in six weeks, lower the floor. A number you do not hit is not a plan, it is a grievance.',
          ],
        },
        {
          kind: 'callout',
          title: 'Lowering a floor is a success',
          body: 'A team that drops from four a week to two and then holds two for six months has a working cadence. A team that insists on four and delivers a scattered average of one and a half has an argument.',
        },

        { kind: 'heading', id: 'review', text: 'Review the cadence on a fixed date' },
        {
          kind: 'paragraph',
          text: 'Put a recurring review in the calendar, monthly or quarterly, and give it three questions with numeric answers. What was the floor, how many weeks did we meet it, and what did the buffer look like at the end of each week. Everything else is a conversation about content, which is a different meeting.',
        },
        {
          kind: 'paragraph',
          text: 'A cadence review that only looks at results teaches you nothing you can act on next week. A cadence review that looks at capacity, buffer and gaps tells you exactly which of the three to fix.',
        },
      ],
    },
  },
};
