import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import { ROUTES } from '@/features/marketing/site';
import type { BlogArticle } from '../types';

/**
 * Content module, loaded per slug. See `../types.ts` for why article prose is
 * not in the ICU catalog.
 *
 * READ BEFORE EDITING. This page answers a question whose entire search result
 * page is populated with invented numbers. Every roundup quoting a dollar
 * figure per thousand views is quoting either a small unrepresentative sample
 * or nothing at all, and YouTube publishes no per view rate.
 *
 * So this article states exactly two figures, both of them percentages, both
 * of them from YouTube's own earnings page, and it states them as revenue
 * shares rather than as earnings. It must never acquire a dollar amount, a
 * per view rate, an RPM range or an estimate labelled typical. A fabricated
 * earnings figure here would be both an honesty violation under AGENTS.md and
 * a legal risk, and it is the reason this comment exists.
 */
export const howMuchYouTubePaysPerView: BlogArticle = {
  slug: 'how-much-youtube-pays-per-view',
  cluster: 'operations',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-22',
  updated: '2026-08-22',
  sources: [
    {
      title: 'YouTube Partner Program earnings overview',
      url: 'https://support.google.com/youtube/answer/72902?hl=en',
      readOn: '2026-08-22',
    },
  ],
  content: {
    en: {
      title: 'How much does YouTube pay per view? What YouTube itself actually states',
      description:
        'YouTube publishes no per view rate. It publishes revenue shares: 55 percent of net watch page ad revenue and 45 percent of Shorts feed ad revenue from the Creator Pool.',
      lede: 'YouTube does not publish a rate per view, and it says outright that there are no guarantees about how much or whether you will be paid. What it does publish is a share: 55 percent of the net revenue from ads on your public watch page videos, and 45 percent of the Shorts feed ad revenue allocated to you from the Creator Pool. Everything else you have read as a per view figure is somebody else estimating.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'In short',
          items: [
            'There is no official per view rate. YouTube publishes revenue shares, not rates, and states there are no guarantees under the partner agreement about how much or whether you will be paid.',
            'Watch page ads: YouTube states creators receive 55 percent of net revenues from ads served on their public videos.',
            'Shorts feed ads: YouTube states creators receive 45 percent of the revenue allocated to them based on their share of views from the Creator Pool.',
            'Those two shares are calculated on different bases, so a view on a Short and a view on a long video are not comparable units of anything.',
            'Any dollar figure per thousand views you find online is an estimate drawn from one sample of channels, not a published rate.',
          ],
        },
        {
          kind: 'stat',
          value: '55%',
          label:
            'The share of net watch page ad revenue YouTube states it pays creators, read on 22 August 2026.',
          source: 'https://support.google.com/youtube/answer/72902?hl=en',
        },
        {
          kind: 'heading',
          id: 'no-rate',
          text: 'Why there is no number to give you',
        },
        {
          kind: 'paragraph',
          text: 'A rate per view would require that every view carry the same advertising revenue, and it does not. What an advertiser paid for the impression on your video depends on the auction that filled it, which depends on the country the viewer is in, the time of year, the subject of the video, the advertiser demand for that audience that week, and whether an ad was served on that view at all. Many views carry no ad and therefore no revenue. Averaging across all of that produces a number that describes one channel in one period and predicts nothing about another.',
        },
        {
          kind: 'paragraph',
          text: 'YouTube is direct about this on its own earnings page: there are no guarantees under the partner agreement about how much or whether you will be paid. That sentence is the honest answer to the question, and it is the reason this page has percentages on it rather than dollars.',
        },
        {
          kind: 'heading',
          id: 'the-shares',
          text: 'The two shares YouTube does publish',
        },
        {
          kind: 'table',
          caption:
            'Revenue shares stated on the YouTube Partner Program earnings page, read 22 August 2026.',
          columns: ['Where the ad ran', 'Share stated', 'What it is a share of'],
          rows: [
            [
              'Watch page ads on public videos',
              '55 percent',
              'Net revenues from the ads served on those videos',
            ],
            [
              'Shorts feed ads',
              '45 percent',
              'Revenue allocated by share of views from the Creator Pool',
            ],
          ],
        },
        {
          kind: 'paragraph',
          text: 'Read the third column carefully, because it does most of the work. The watch page share is taken on the ad revenue attributable to your own videos. The Shorts share is taken on a pool: revenue is gathered from ads in the Shorts feed, allocated between creators according to their share of views, and then the 45 percent is applied to that allocation. Two different mechanisms with two different denominators. A higher headline percentage on one of them would not mean a higher payment.',
        },
        {
          kind: 'heading',
          id: 'what-moves-it',
          text: 'What moves the amount that actually arrives',
        },
        {
          kind: 'paragraph',
          text: 'YouTube names several things that change the final figure rather than a fixed rate: traffic it identifies as invalid, Content ID claims on your material, disputes, and the kinds of ad campaign that ran. Music rights alone can move a video from earning to not earning. This is why two channels with the same view count in the same month can be paid very differently, and neither number is anomalous.',
        },
        {
          kind: 'heading',
          id: 'estimate-your-own',
          text: 'How to work out your own figure instead',
        },
        {
          kind: 'paragraph',
          text: 'The only reliable per view number for a channel is the one derived from that channel. In YouTube Analytics, take the revenue reported for a period and divide it by the views in the same period, using the same date range on both sides. That gives you your own rate for that period. Recalculate it each month rather than treating it as a constant, and never lend it to another channel, another country mix or another format. If you need a figure for a plan, write it as a range you observed with the months it came from, not as a rate.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'How much does YouTube pay per 1,000 views?',
              a: 'YouTube publishes no such rate. It publishes revenue shares, and states there are no guarantees about how much or whether you will be paid. The only per thousand figure that means anything is one you calculate from your own analytics.',
            },
            {
              q: 'Is the Shorts share worse than the long form share?',
              a: 'They are not comparable as headline percentages. The 55 percent applies to net revenue from ads on your videos. The 45 percent applies to an allocation from a shared pool of Shorts feed ad revenue, based on your share of views.',
            },
            {
              q: 'Why do published estimates vary so much?',
              a: 'Because they are samples. Advertising rates vary by country, season, subject and advertiser demand, and many views carry no ad at all, so any average describes the sample it came from rather than the platform.',
            },
            {
              q: 'Where can I see what I actually earned?',
              a: 'In YouTube Analytics, in the revenue reporting for your channel. That is also the only place a per view figure for your channel can be derived honestly.',
            },
          ],
        },
        {
          kind: 'callout',
          title: 'If you are quoting this in a proposal',
          body: 'Quote the two shares as shares and attribute them to the YouTube Partner Program earnings page with the date read. Do not convert them into a per view rate. The conversion needs revenue data neither you nor YouTube has published, and the resulting number would be an invention wearing the clothes of a citation.',
        },
        {
          kind: 'cta',
          label: 'See the image sizes YouTube publishes for its own surfaces',
          href: ROUTES.specsDimensions,
        },
      ],
    },
  },
};
