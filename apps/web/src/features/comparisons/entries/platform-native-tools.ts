import { ROUTES } from '@/features/marketing/site';

import type { ComparisonPage, ComparisonSource } from '../types';

/**
 * Content module. English only, loaded per slug.
 *
 * This page has more `notVerified` cells than any other, and that is the point
 * of publishing it. Several platforms document their own scheduling tools only
 * in consumer help centres that would not serve a request on the day of the
 * check, so their current behaviour could not be read from an official page.
 * The honest table says so in the cell. It does not fill the gap from memory,
 * from a third party summary, or from what the tools did the last time
 * somebody looked.
 */

const PINTEREST_SCHEDULE: ComparisonSource = {
  title: 'Schedule Pins, Pinterest business help centre',
  url: 'https://help.pinterest.com/en/business/article/schedule-pins',
  readOn: '2026-08-10',
};

const META_SCHEDULE: ComparisonSource = {
  title: 'Schedule a post and manage scheduled posts for your Facebook Page',
  url: 'https://www.facebook.com/business/help/1252240869631062',
  readOn: '2026-08-10',
};

const INSTAGRAM_PUBLISHING: ComparisonSource = {
  title: 'Instagram Platform content publishing',
  url: 'https://developers.facebook.com/docs/instagram-platform/content-publishing/',
  readOn: '2026-08-10',
};

const META_APP_REVIEW: ComparisonSource = {
  title: 'App Review, Meta for Developers',
  url: 'https://developers.facebook.com/docs/app-review',
  readOn: '2026-08-10',
};

const OUR_CAPABILITIES: ComparisonSource = {
  title: 'Connector capability matrix',
  url: ROUTES.capabilities,
  readOn: '2026-08-10',
};

const OUR_PRODUCT: ComparisonSource = {
  title: 'How the product works',
  url: ROUTES.product,
  readOn: '2026-08-10',
};

const OUR_PRICING: ComparisonSource = {
  title: 'Pricing during prelaunch',
  url: ROUTES.pricing,
  readOn: '2026-08-10',
};

const OUR_METHODOLOGY: ComparisonSource = {
  title: 'How claims on this site are checked',
  url: ROUTES.methodology,
  readOn: '2026-08-10',
};

export const platformNativeTools: ComparisonPage = {
  slug: 'platform-native-tools',
  title: "This product compared with the platforms' own scheduling tools",
  description:
    'What the platforms schedule for free, what could not be verified from their own help pages today, and what this product does not do at all.',
  alternative: "The platforms' own scheduling tools",
  lede: 'The free tools inside the platforms are the honest baseline for most people. This page states what could be read on their own help pages on the day of the check, and marks everything else not verified.',
  bestForOurs:
    'A team publishing to several platforms that needs one calendar, an approval step and a record of what happened, and that can wait for connector verification.',
  bestForAlternative:
    'One or two destinations, one person posting, and no need for approval or for a record that outlives the platform interface.',
  checked: '2026-08-10',
  nextReview: '2026-11-08',
  rows: [
    {
      id: 'publishes-today',
      claim: 'It can publish to a platform account today',
      ours: {
        verdict: 'no',
        detail:
          'No connector has completed provider verification, so nothing publishes through this product to any platform.',
        source: OUR_CAPABILITIES,
      },
      theirs: {
        verdict: 'yes',
        detail:
          'Meta documents scheduling a post for a Facebook Page and managing the scheduled ones from its own tools.',
        source: META_SCHEDULE,
      },
    },
    {
      id: 'scheduling-limits',
      claim: 'There is a documented ceiling on how much you can queue ahead',
      ours: {
        verdict: 'no',
        detail:
          'Nothing reaches a platform today, so no queue ceiling is in force. The published tier boundary is the number of projects, not the number of scheduled posts.',
        source: OUR_PRICING,
      },
      theirs: {
        verdict: 'yes',
        detail:
          'Pinterest states that a Pin can be scheduled up to 30 days in advance, and that an account can have up to 10 Pins scheduled for the future.',
        source: PINTEREST_SCHEDULE,
      },
    },
    {
      id: 'cross-platform',
      claim: 'One calendar covers destinations on more than one platform',
      ours: {
        verdict: 'partial',
        detail:
          'The calendar is built across a cohort of ten platforms. The cohort is intent, not availability, and no connector in it is verified.',
        source: OUR_CAPABILITIES,
      },
      theirs: {
        verdict: 'notVerified',
        detail:
          'A platform tool covers that platform, and in some cases a sibling product. Which sibling surfaces are covered today could not be read from an official help page on the day of this check.',
      },
    },
    {
      id: 'account-type',
      claim: 'A professional or business account is required',
      ours: {
        verdict: 'yes',
        detail:
          'Publishing through the Instagram Platform requires a professional account, so the account type is a precondition for that destination whatever tool is used.',
        source: INSTAGRAM_PUBLISHING,
      },
      theirs: {
        verdict: 'notVerified',
        detail:
          'Which account types can reach the scheduling controls inside each platform tool could not be read from an official help page on the day of this check.',
      },
    },
    {
      id: 'api-quota',
      claim: 'API publishing quotas apply',
      ours: {
        verdict: 'yes',
        detail:
          'Instagram limits an account to 100 API published posts within a 24 hour moving period. Any tool publishing through the API shares that ceiling.',
        source: INSTAGRAM_PUBLISHING,
      },
      theirs: {
        verdict: 'no',
        detail:
          "The Instagram ceiling is stated for API published posts, so posting from the platform's own surface is not counted against an application quota.",
        source: INSTAGRAM_PUBLISHING,
      },
    },
    {
      id: 'app-review',
      claim: 'A platform application review stands between you and publishing',
      ours: {
        verdict: 'yes',
        detail:
          'Meta requires App Review for an app used by anyone without a role on it, which is the gate this product has not passed for any connector.',
        source: META_APP_REVIEW,
      },
      theirs: {
        verdict: 'no',
        detail:
          "App Review governs applications calling the platform APIs. A person using the platform's own tool is not an application under review.",
        source: META_APP_REVIEW,
      },
    },
    {
      id: 'approval',
      claim: 'Work can be approved by somebody else before it goes out',
      ours: {
        verdict: 'partial',
        detail:
          'Approval is a workflow step with an audit event behind it. Nothing it approves can publish while no connector is verified.',
        source: OUR_PRODUCT,
      },
      theirs: {
        verdict: 'notVerified',
        detail:
          'Whether each platform tool offers review by a second person, and on which account types, could not be read from an official help page on the day of this check.',
      },
    },
    {
      id: 'record',
      claim: 'There is a durable record of what was published and who approved it',
      ours: {
        verdict: 'partial',
        detail:
          'Every external side effect is designed to write an immutable receipt and an audit event. No receipt describes a live publication yet.',
        source: OUR_PRODUCT,
      },
      theirs: {
        verdict: 'notVerified',
        detail:
          'What each platform tool retains, for how long, and whether it can be exported could not be read from an official help page on the day of this check.',
      },
    },
    {
      id: 'language',
      claim: 'The interface is available in a reviewed translation',
      ours: {
        verdict: 'no',
        detail:
          'Every language other than English is beta. A locale leaves beta only when a named person signs a review against a date, and none has.',
        source: OUR_METHODOLOGY,
      },
      theirs: {
        verdict: 'notVerified',
        detail:
          "The language coverage of each platform's own tool is not something we have checked against an official page, so it is not stated here.",
      },
    },
  ],
  notes: [
    "For one destination and one person, the platform's own tool is usually the right answer, and it is free. That is not a concession. It is the baseline any additional tool has to be worth more than.",
    'The case for anything else starts when the destinations multiply, when somebody other than the author has to see the work first, or when the record of what went out has to outlive the interface it went out from.',
    'Several cells on this page say not verified. That is a statement about our sourcing on the day of the check, not a claim that the platforms lack those features. Several platform help centres would not serve a request that day, and a cell is never filled in from memory.',
  ],
  questions: [
    {
      question: 'Why are so many cells marked not verified?',
      answer:
        "Because a fact is only stated here when it could be read on the option's own public documentation on the day of the check. Several platform help pages could not be retrieved that day, so those cells stay empty rather than guessed.",
    },
    {
      question: 'Does this product replace the tools inside the platforms?',
      answer:
        'Not today. Nothing publishes through this product, because no connector has completed provider verification. The tools inside the platforms are the working option this month.',
    },
    {
      question: 'How often is this comparison rechecked?',
      answer:
        'At least every 90 days, and immediately when a platform changes something a row states. The last check and the next due date are printed at the top of the page.',
    },
  ],
};
