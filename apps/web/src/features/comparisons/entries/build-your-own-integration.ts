import { ROUTES } from '@/features/marketing/site';

import type { ComparisonPage, ComparisonSource } from '../types';

/**
 * Content module. English only, loaded per slug. See `../types.ts` for why a
 * comparison table is typed content rather than catalog copy.
 *
 * The alternative here is an approach, not a vendor: writing the integration
 * yourself against each platform's official API. That is the honest comparison
 * to publish today, because every fact about it can be read on the platforms'
 * own developer documentation, which is the only kind of source this page is
 * allowed to use.
 */

const META_APP_REVIEW: ComparisonSource = {
  title: 'App Review, Meta for Developers',
  url: 'https://developers.facebook.com/docs/app-review',
  readOn: '2026-08-10',
};

const INSTAGRAM_PUBLISHING: ComparisonSource = {
  title: 'Instagram Platform content publishing',
  url: 'https://developers.facebook.com/docs/instagram-platform/content-publishing/',
  readOn: '2026-08-10',
};

const LINKEDIN_POSTS: ComparisonSource = {
  title: 'Posts API, LinkedIn community management',
  url: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api',
  readOn: '2026-08-10',
};

const LINKEDIN_REFRESH: ComparisonSource = {
  title: 'Refresh tokens with OAuth 2.0, LinkedIn',
  url: 'https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens',
  readOn: '2026-08-10',
};

const X_INTRO: ComparisonSource = {
  title: 'X API introduction',
  url: 'https://docs.x.com/x-api/introduction',
  readOn: '2026-08-10',
};

const OUR_CAPABILITIES: ComparisonSource = {
  title: 'Connector capability matrix',
  url: ROUTES.capabilities,
  readOn: '2026-08-10',
};

const OUR_PRICING: ComparisonSource = {
  title: 'Pricing during prelaunch',
  url: ROUTES.pricing,
  readOn: '2026-08-10',
};

const OUR_PRODUCT: ComparisonSource = {
  title: 'How the product works',
  url: ROUTES.product,
  readOn: '2026-08-10',
};

export const buildYourOwnIntegration: ComparisonPage = {
  slug: 'build-your-own-integration',
  title: 'This product compared with building your own integration',
  description:
    'What you take on when you write the platform integrations yourself, and what this product does not do for you today.',
  alternative: 'Building your own integration',
  lede: 'Every claim below names the document it came from and the day a person read it. Where a fact could not be read on an official page, the cell says not verified rather than guessing.',
  bestForOurs:
    'A team that wants one place to plan and approve work across several platforms, and that can wait for connector verification before anything reaches an account.',
  bestForAlternative:
    'A team with one or two destinations, an engineer who can own the platform reviews and the version migrations, and a need for behaviour no shared tool will implement.',
  checked: '2026-08-10',
  nextReview: '2026-11-08',
  rows: [
    {
      id: 'app-registration',
      claim: 'You have to file and maintain your own platform app registrations',
      ours: {
        verdict: 'no',
        detail:
          'Accounts would connect through this product registration. No connector has completed provider verification, so no account connects for publishing today.',
        source: OUR_CAPABILITIES,
      },
      theirs: {
        verdict: 'yes',
        detail:
          'Meta states that an app used by anyone without a role on the app, or a role in a business that has claimed it, must first undergo App Review.',
        source: META_APP_REVIEW,
      },
    },
    {
      id: 'api-versions',
      claim: 'You have to track API versions and migration deadlines yourself',
      ours: {
        verdict: 'no',
        detail:
          'Version tracking belongs to the connector layer. The capability matrix records which platform document each row came from and the date it was read.',
        source: OUR_CAPABILITIES,
      },
      theirs: {
        verdict: 'yes',
        detail:
          'LinkedIn requires a Linkedin-Version header in the year and month format on every call, and publishes deprecation notices when a version is sunset.',
        source: LINKEDIN_POSTS,
      },
    },
    {
      id: 'credentials',
      claim: 'You have to hold and refresh long lived credentials yourself',
      ours: {
        verdict: 'partial',
        detail:
          'Credentials would be held by the product. Nothing is being refreshed for anyone today, because no connector has passed its definition of done.',
        source: OUR_CAPABILITIES,
      },
      theirs: {
        verdict: 'yes',
        detail:
          'LinkedIn access tokens are valid for 60 days by default. Programmatic refresh tokens are valid for a year, are limited to approved Marketing Developer Platform partners, and do not extend when used.',
        source: LINKEDIN_REFRESH,
      },
    },
    {
      id: 'quotas',
      claim: 'Platform publishing quotas apply to you',
      ours: {
        verdict: 'yes',
        detail:
          'A quota is a fact about the platform, not about the client. Instagram limits an account to 100 API published posts within a 24 hour moving period, whatever calls the endpoint.',
        source: INSTAGRAM_PUBLISHING,
      },
      theirs: {
        verdict: 'yes',
        detail:
          'The same limit applies to your own client. Building the integration yourself changes who writes the retry logic, not what the platform permits.',
        source: INSTAGRAM_PUBLISHING,
      },
    },
    {
      id: 'idempotency',
      claim: 'A retry after a timeout is protected from publishing twice',
      ours: {
        verdict: 'partial',
        detail:
          'Every external side effect in the publishing core is designed to be idempotent and to leave an immutable receipt. No real post has gone through it, so no receipt describes a live publication yet.',
        source: OUR_PRODUCT,
      },
      theirs: {
        verdict: 'partial',
        detail:
          'LinkedIn documents that post deletions are idempotent and that a repeat delete returns 204. Creation carries no such guarantee, so a timeout on a create is yours to resolve.',
        source: LINKEDIN_POSTS,
      },
    },
    {
      id: 'approval',
      claim: 'An approval step exists before anything publishes',
      ours: {
        verdict: 'partial',
        detail:
          'Approval is part of the workflow and leaves an audit event. What it approves has nowhere to go while no connector is verified.',
        source: OUR_PRODUCT,
      },
      theirs: {
        verdict: 'notVerified',
        detail:
          'This depends entirely on what you build. The platform publishing documents we read describe post lifecycle states, not review by a second person, and absence from one document is not proof of absence.',
      },
    },
    {
      id: 'cost',
      claim: 'There is a cost before the first post',
      ours: {
        verdict: 'no',
        detail:
          'Checkout is closed during prelaunch, so nothing can be bought today. Two of the planned tiers are still undecided and carry no price.',
        source: OUR_PRICING,
      },
      theirs: {
        verdict: 'yes',
        detail:
          'X states that the X API uses pay per usage pricing with no subscriptions, so API access is a metered cost you carry directly.',
        source: X_INTRO,
      },
    },
    {
      id: 'shapes',
      claim: 'One publishing model covers every destination',
      ours: {
        verdict: 'partial',
        detail:
          'Ten platforms have reviewed records and a generated limits dataset. That cohort is a plan, not an availability list, and one of the ten has no adapter in this build at all.',
        source: OUR_CAPABILITIES,
      },
      theirs: {
        verdict: 'no',
        detail:
          'Each platform is its own integration. Instagram publishes in two steps, creating a media container and then publishing it, while a LinkedIn post is a single versioned call.',
        source: INSTAGRAM_PUBLISHING,
      },
    },
  ],
  notes: [
    'The rows above are deliberately not a feature count. A count would let this page win by listing things nobody asked for, and it would hide the only fact that decides whether either option is usable this month: whether anything publishes at all.',
    'Building it yourself is a reasonable answer. It is the right answer when one destination carries the work, when the behaviour you need is specific to your business, or when an engineer is already inside those APIs for another reason.',
    'It stops being reasonable when the count of destinations grows, because the cost is not the first integration. It is the version migrations, the token expiries and the platform reviews arriving on their own schedule, forever, for every destination you added.',
  ],
  questions: [
    {
      question: 'Can this product publish for me today?',
      answer:
        'No. No connector has completed provider verification, so nothing reaches a platform through this product. The pages describe a design and a plan, and say so wherever they describe either.',
    },
    {
      question: 'Do I still need my own platform app if I use a tool like this?',
      answer:
        'Not for the platforms a tool has taken through verification, because the account connects through the tool registration. You would still need your own app for any destination the tool has not covered.',
    },
    {
      question: 'How often is this comparison rechecked?',
      answer:
        'At least every 90 days, and immediately when a platform changes something a row states. The date of the last check and the date the next one is due are printed at the top of the page.',
    },
  ],
};
