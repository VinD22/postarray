import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import { ROUTES } from '@/features/marketing/site';
import type { BlogArticle } from '../types';

/**
 * Content module, loaded per slug. See `../types.ts` for why article prose is
 * not in the ICU catalog.
 *
 * The two figures this article states, the 20 minute floor and the 29 day
 * ceiling, and the sentence about which time zone applies, all come from the
 * cited help centre page. Nothing here claims this product schedules to
 * Facebook: no connector has passed its definition of done.
 */
export const howToScheduleFacebookPosts: BlogArticle = {
  slug: 'how-to-schedule-facebook-posts',
  cluster: 'scheduling',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-22',
  updated: '2026-08-22',
  sources: [
    {
      title: 'Schedule a post and manage scheduled posts for your Facebook Page',
      url: 'https://www.facebook.com/help/389849807718635',
      readOn: '2026-08-22',
    },
  ],
  content: {
    en: {
      title: 'How to schedule Facebook posts, and the two limits nobody mentions',
      description:
        'Open Meta Business Suite from your Page, create the post, turn on Set date and time, and schedule. Facebook accepts times between 20 minutes and 29 days away.',
      lede: 'From your Facebook Page, open Meta Business Suite, click Create post, switch on the Set date and time toggle under Scheduling options, pick the moment and click Schedule. Two constraints shape everything else on this page: the time you pick is read in your own current time zone, and it has to fall between 20 minutes and 29 days from now.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'In short',
          items: [
            'Scheduling lives in Meta Business Suite, reached from the left menu of the Page, not in the composer on the public Page itself.',
            'Facebook states that posts can be scheduled to publish between 20 minutes and 29 days away.',
            'All scheduling times correspond to your current time zone, not the audience time zone and not the Page time zone.',
            'Scheduled posts are edited, rescheduled, duplicated, moved to drafts or deleted from the Planner calendar.',
            'People need Facebook access or Task access on the Page to create and edit scheduled posts.',
          ],
        },
        {
          kind: 'heading',
          id: 'schedule-a-post',
          text: 'Scheduling one post',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Switch to the Page you want to publish from.',
            'Click Meta Business Suite in the left menu.',
            'Click Create post below the Page profile picture.',
            'Add the text, media and link.',
            'Next to Scheduling options, turn on the Set date and time toggle.',
            'Set the date and time. Active times offers recommended publication times if you want them.',
            'Click Schedule.',
          ],
        },
        {
          kind: 'heading',
          id: 'the-window',
          text: 'The 20 minute floor and the 29 day ceiling',
        },
        {
          kind: 'paragraph',
          text: 'Facebook states plainly that a post can be scheduled to publish between 20 minutes and 29 days away. Both ends matter in practice. The floor rules out scheduling something for a moment that is nearly here, which is a common way a launch checklist quietly fails. The ceiling rules out loading a full quarter of content in one sitting: anything past 29 days has to wait or be held somewhere else until it comes inside the window.',
        },
        {
          kind: 'heading',
          id: 'time-zones',
          text: 'Which time zone the clock is in',
        },
        {
          kind: 'paragraph',
          text: 'The help centre states that all times for scheduling correspond to your current time zone. That is the zone of the person doing the scheduling, at the moment they do it. It is not the audience zone and not a zone stored on the Page. Two people managing the same Page from two countries can enter the same wall clock time and get two different publication moments, and neither of them is doing anything wrong.',
        },
        {
          kind: 'paragraph',
          text: 'This is also where daylight saving quietly bites. A post scheduled before a transition and landing after it was entered in one offset and publishes in another. If a campaign has to land at a fixed local hour for the audience, work the target hour out in the audience zone first and then convert, rather than typing the hour you want and hoping.',
        },
        {
          kind: 'tool',
          tool: 'zone-planner',
          caption: 'Convert a target local hour into your own zone before you type it in.',
        },
        {
          kind: 'heading',
          id: 'manage',
          text: 'Changing something already scheduled',
        },
        {
          kind: 'paragraph',
          text: 'Scheduled posts are managed in Planner, in the Meta Business Suite left menu. The calendar toggles between a week and a month view. Clicking a post and opening Options offers editing the text, media, link or location, duplicating it as a new post, rescheduling it to another date and time, moving it back to the Page drafts, or deleting it.',
        },
        {
          kind: 'heading',
          id: 'access',
          text: 'Who is allowed to do this',
        },
        {
          kind: 'paragraph',
          text: 'Facebook states that scheduled posts can be created and edited by people with Facebook access or Task access to the Page. If a colleague cannot see Planner or cannot save a schedule, the problem is almost always the access level rather than the browser or the post itself.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'How far in advance can I schedule a Facebook post?',
              a: 'Facebook states that posts can be scheduled between 20 minutes and 29 days away. Anything beyond that has to be scheduled later, once the date comes inside the window.',
            },
            {
              q: 'Which time zone does the scheduler use?',
              a: 'Your current time zone. The help centre states that all scheduling times correspond to it, so the same entry made from two countries produces two different publication moments.',
            },
            {
              q: 'Can I reschedule a post after it is queued?',
              a: 'Yes. Open Planner, click the post on the calendar, open Options, and choose Reschedule post, or move it to drafts if the date is not settled yet.',
            },
            {
              q: 'Why can a colleague not schedule on the same Page?',
              a: 'Creating and editing scheduled posts requires Facebook access or Task access on that Page. Without one of those, the option is not available to them.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Check a draft against the limits each platform records',
          href: ROUTES.specs,
        },
      ],
    },
  },
};
