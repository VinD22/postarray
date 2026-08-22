import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import { ROUTES } from '@/features/marketing/site';
import type { BlogArticle } from '../types';

/**
 * Content module, loaded per slug. See `../types.ts` for why article prose is
 * not in the ICU catalog.
 *
 * The scope of the Ad Library is routinely overstated in third party writing:
 * it is described as a full archive of everything every advertiser has ever
 * run. Meta's own page says something much narrower, and the narrower version
 * is the one here. The seven year retention figure is Meta's, from the cited
 * page, and applies only to the political and social issue category.
 */
export const whatTheMetaAdLibraryIs: BlogArticle = {
  slug: 'what-the-meta-ad-library-is',
  cluster: 'operations',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-22',
  updated: '2026-08-22',
  sources: [
    {
      title: 'What is the Meta Ad Library and how do I search it?',
      url: 'https://www.facebook.com/help/259468828226154',
      readOn: '2026-08-22',
    },
  ],
  content: {
    en: {
      title: 'What the Meta Ad Library is, what it actually contains, and how to search it',
      description:
        'A public search over ads currently running across Meta products, plus a longer archive for ads about issues, elections and politics, which Meta stores for 7 years.',
      lede: 'The Meta Ad Library is a public search over the ads running across Meta products right now, at facebook.com/ads/library. For most ads that is the whole scope: currently active only. For ads about issues, elections or politics it goes further, keeping inactive ads too, along with the funder, a spend range and reach, for seven years.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'In short',
          items: [
            'It is free, public, and needs no advertising account to use.',
            'For ordinary commercial ads you can search what is currently active. Ads that stopped running are not there.',
            'For ads about issues, elections or politics you can also search inactive ones, and see who funded the ad, a range for what they spent, and its reach across demographics.',
            'Meta states it stores that category of ad in the library for 7 years.',
            'Ads can be removed in limited circumstances, such as serious Community Standards violations or a valid government request, so absence is not proof an ad never ran.',
          ],
        },
        {
          kind: 'stat',
          value: '7 years',
          label:
            'How long Meta states it stores ads about issues, elections or politics in the Ad Library.',
          source: 'https://www.facebook.com/help/259468828226154',
        },
        {
          kind: 'heading',
          id: 'what-it-covers',
          text: 'The scope, stated carefully',
        },
        {
          kind: 'paragraph',
          text: 'A lot of writing about this tool describes it as an archive of everything every advertiser has ever run. Meta describes something narrower. For all ads, you can search ads that are currently active across Meta products. The extra retention, and the extra fields, apply to ads about issues, elections or politics. That is where the funder, the spend range and the demographic reach come from, and that is the category kept for seven years whether the ad is still running or not.',
        },
        {
          kind: 'paragraph',
          text: 'The distinction is the difference between a research tool and a competitive intelligence tool. For political research it is close to a proper archive. For working out what a competitor ran last spring, it is not, because their inactive commercial ads are simply not in it.',
        },
        {
          kind: 'heading',
          id: 'how-to-search',
          text: 'How to search it',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Open the Ad Library at facebook.com/ads/library.',
            'Choose a country, then choose the ad category. All ads is the default. Issues, elections or politics is the category with the deeper archive.',
            'Search by advertiser or by keyword. Searching by advertiser is the more reliable of the two, because keyword search only matches ad text.',
            'Open an individual result to see its details. In the political category that includes the funding entity, a spend range and reach.',
          ],
        },
        {
          kind: 'heading',
          id: 'related-tools',
          text: 'The three things called the Ad Library',
        },
        {
          kind: 'paragraph',
          text: 'Meta groups several tools under the same name, and confusing them is the usual reason a search comes back empty. The Ad Library itself is the browser interface described above. The Ad Library Report is an aggregated view of spending on ads about issues, elections or politics in a chosen country over a chosen period, which is the right tool for totals rather than individual creatives. The Ad Library API is the programmatic route over the same political and social issue data, intended for deeper analysis than the interface allows.',
        },
        {
          kind: 'heading',
          id: 'limits',
          text: 'What it will not tell you',
        },
        {
          kind: 'paragraph',
          text: 'Absence of an ad is not evidence it never ran. Meta states ads may be removed from the library in limited circumstances, including serious Community Standards violations and valid government requests, and inactive commercial ads were never there to begin with. Spending, where it appears at all, is a range rather than a figure, so a total assembled from ranges is a range too and should be written as one. Meta also notes that an ad which does not follow its advertising policies may still appear in the library, with a warning shown before you view it.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Do I need an ad account to use the Meta Ad Library?',
              a: 'No. It is a public search anyone can open, and it covers ads running across Meta products rather than ads on one account.',
            },
            {
              q: 'Can I see the old ads a competitor ran?',
              a: 'Generally not. For ordinary commercial ads the library covers what is currently active. Inactive ads are retained for the issues, elections and politics category.',
            },
            {
              q: 'How much did an advertiser spend?',
              a: 'For ads about issues, elections or politics, Meta shows a range rather than an exact amount, alongside the funding entity and the reach of the ad.',
            },
            {
              q: 'Is there an API?',
              a: 'Yes. Meta offers an Ad Library API for deeper analysis of ads about social issues, elections or politics, and of ads delivered to the EU and associated territories.',
            },
          ],
        },
        {
          kind: 'heading',
          id: 'in-practice',
          text: 'Using it without overclaiming',
        },
        {
          kind: 'paragraph',
          text: 'If a finding from the Ad Library ends up in a client deck or a story, carry three things with it: the date you searched, the country and category filter you used, and whether the spend you are quoting is a range. All three change the meaning of the result, and all three are easy to lose between the search and the slide.',
        },
        {
          kind: 'cta',
          label: 'Tag the links you publish so the traffic is attributable',
          href: ROUTES.toolUtmBuilder,
        },
      ],
    },
  },
};
