import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import { ROUTES } from '@/features/marketing/site';
import type { BlogArticle } from '../types';

/**
 * Content module, loaded per slug. See `../types.ts` for why article prose is
 * not in the ICU catalog.
 *
 * Every factual sentence about YouTube here comes from one of the two help
 * centre pages cited below, read on the date recorded there. The interesting
 * part of this question is the part most answers skip: the list a creator can
 * see is not the list of people who subscribed, because subscriptions are
 * private by default. Saying so is the whole value of the page.
 */
export const howToSeeYourYouTubeSubscribers: BlogArticle = {
  slug: 'how-to-see-your-youtube-subscribers',
  cluster: 'operations',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-22',
  updated: '2026-08-22',
  sources: [
    {
      title: 'Check your YouTube subscriber count',
      url: 'https://support.google.com/youtube/answer/6051134?hl=en',
      readOn: '2026-08-22',
    },
    {
      title: 'Check your recent subscribers',
      url: 'https://support.google.com/youtube/answer/7280745?hl=en',
      readOn: '2026-08-22',
    },
  ],
  content: {
    en: {
      title: 'How to see your YouTube subscribers, and why the list is shorter than the count',
      description:
        'Open YouTube Studio, then Dashboard, then the Recent subscribers card. The list shows only people who made their subscriptions public in the last 28 days.',
      lede: 'Sign in to YouTube Studio and open the Dashboard. The Recent subscribers card lists your newest subscribers, and Analytics shows the count. The two numbers will not match, and the reason is worth understanding before you go looking for a bug.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'In short',
          items: [
            'The named list lives on the YouTube Studio Dashboard, on the Recent subscribers card. Click See all to expand it.',
            'The count lives in Studio under Analytics, on the Overview tab, in the Realtime card, behind See live count.',
            'The list is not the count. Subscriptions are private by default, and the list only shows people who chose to make theirs public and who subscribed in the last 28 days.',
            'Public subscriber counts are rounded once a channel passes a thousand subscribers, so the number a viewer sees is not the number you see.',
          ],
        },
        {
          kind: 'heading',
          id: 'see-the-list',
          text: 'Seeing the list of subscribers',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Sign in to YouTube Studio with the account that owns the channel.',
            'Open the Dashboard.',
            'Find the Recent subscribers card and click See all to expand it.',
            'Use the controls at the top of the expanded card to choose a timeframe and to sort.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'On the mobile apps the same list is reached from your channel rather than from a dashboard: open your account, view your channel, and tap the option to see your subscribers.',
        },
        {
          kind: 'heading',
          id: 'see-the-count',
          text: 'Seeing the count',
        },
        {
          kind: 'paragraph',
          text: 'The count is a separate screen. In YouTube Studio, choose Analytics in the left menu, stay on the Overview tab, and look at the Realtime card. See live count opens the running figure. This is the number that reflects how many viewers have subscribed to the channel, and it is the one to quote in a report.',
        },
        {
          kind: 'heading',
          id: 'why-they-differ',
          text: 'Why the list is shorter than the count',
        },
        {
          kind: 'paragraph',
          text: 'This is the part that sends people looking for a support ticket. YouTube states that subscriptions are private by default. A person who subscribed and left that default in place is counted, receives your uploads in their Subscriptions feed, and never appears on the Recent subscribers list. YouTube also limits that list to the last 28 days, and excludes accounts it has suspended or flagged as spam.',
        },
        {
          kind: 'paragraph',
          text: 'So a channel with several thousand subscribers can open the list and find a few dozen names on it. Nothing is broken. The list answers who recently subscribed and chose to be visible, which is a much narrower question than how many people subscribed.',
        },
        {
          kind: 'heading',
          id: 'rounding',
          text: 'Why viewers see a different number than you do',
        },
        {
          kind: 'paragraph',
          text: 'Public subscriber counts are abbreviated once a channel is large enough. YouTube gives 1,234 displaying as 1.23 K and 123,456 displaying as 123 K as its own examples. Below a thousand subscribers every new subscriber is shown. Above it, the public figure updates in steps rather than one at a time, so the number under your channel name will lag the number in your own analytics. YouTube also removes closed and spam accounts periodically, which can move your count down without anyone unsubscribing.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Can I see a full list of everyone who subscribed?',
              a: 'No. YouTube states that subscriptions are private by default and that people who kept them private do not appear on the recent subscribers list, so no screen shows the complete set.',
            },
            {
              q: 'Why did my subscriber count drop overnight?',
              a: 'YouTube regularly removes closed accounts and accounts it identifies as spam. Its help centre states those removals do not count toward your total and do not appear in your subscriber list.',
            },
            {
              q: 'How far back does the recent subscribers list go?',
              a: 'YouTube states the list covers people who subscribed in the last 28 days and who made their subscriptions public.',
            },
            {
              q: 'Where do I find the count on a phone?',
              a: 'The Studio mobile app carries the same analytics. On the main YouTube app, open your account, view your channel, and use the option to see your subscribers.',
            },
          ],
        },
        {
          kind: 'heading',
          id: 'next',
          text: 'What to do with the number',
        },
        {
          kind: 'paragraph',
          text: 'Subscriber count is a slow signal and a poor one to steer by week to week. It moves after the work, not with it. If you are trying to make a channel legible to someone else, pair it with the per video figures YouTube publishes in the same analytics screens, and record the date you read each of them, because the definitions change.',
        },
        {
          kind: 'cta',
          label: 'See the image sizes each platform publishes',
          href: ROUTES.specsDimensions,
        },
      ],
    },
  },
};
