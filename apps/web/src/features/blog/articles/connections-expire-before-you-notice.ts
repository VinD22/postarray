import { ROUTES } from '@/features/marketing/site';

import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import type { BlogArticle } from '../types';

/**
 * Content module, loaded per slug. Each language this article exists in is a
 * key of `content`. See `../types.ts` for why article prose is not in the ICU
 * catalog, and why titles are written per language rather than translated.
 */
export const connectionsExpireBeforeYouNotice: BlogArticle = {
  slug: 'connections-expire-before-you-notice',
  cluster: 'operations',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-10',
  updated: '2026-08-10',
  sources: [
    {
      title: 'Refresh tokens with OAuth 2.0, LinkedIn',
      url: 'https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens',
      readOn: '2026-08-10',
    },
    {
      title: 'Long lived access tokens, Facebook Login',
      url: 'https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived',
      readOn: '2026-08-10',
    },
    {
      title: 'Using OAuth 2.0 to access Google APIs',
      url: 'https://developers.google.com/identity/protocols/oauth2',
      readOn: '2026-08-10',
    },
  ],
  content: {
    en: {
      title: 'Connections expire on a schedule, and the queue finds out last',
      description:
        'Platform credentials have documented lifetimes and documented ways to die early. Here is how to plan for expiry instead of discovering it at publication time.',
      blocks: [
        {
          kind: 'paragraph',
          text: 'A connected account is not a permanent thing. It is a credential with a documented lifetime, several documented ways to die early, and no obligation to tell you when it does. The queue is the worst possible place to find out, because by then a publication time has already passed.',
        },
        {
          kind: 'paragraph',
          text: 'The good news is that most of this is written down by the platforms themselves. Expiry can be planned for like any other calendar event.',
        },

        { kind: 'heading', id: 'clocks', text: 'The clocks that are actually documented' },
        {
          kind: 'table',
          caption: 'Credential lifetimes as the platforms document them',
          columns: ['What the document states', 'What it means for a schedule'],
          rows: [
            [
              'LinkedIn states that access tokens are valid for 60 days by default, and that programmatic refresh tokens are valid for a year',
              'Two clocks, not one. The short clock is routine maintenance; the long clock is a date when a person has to sign in again.',
            ],
            [
              'LinkedIn states that using a refresh token does not extend it, giving the worked example that on day 360 both tokens expire in five days',
              'Activity does not keep a connection alive. A busy account and a quiet one reach the same wall on the same day.',
            ],
            [
              'LinkedIn states that programmatic refresh tokens are available to approved Marketing Developer Platform partners',
              'Whether you get the long clock at all is a partnership question, not a technical one, and it has to be answered before the design assumes it.',
            ],
            [
              'Meta states that a long lived user access token generally lasts about 60 days',
              'A quarterly planning cycle outlives the credential. Any process that touches an account less than every two months needs a refresh step that is not triggered by publishing.',
            ],
            [
              'Google lists refresh token expiry conditions including six months without use, a project still in testing status, and the user revoking access',
              'Disuse is itself a failure mode. An account connected for a campaign and left alone can expire from inactivity before the next campaign.',
            ],
          ],
        },
        {
          kind: 'callout',
          title: 'A test project is not a quiet place to start',
          body: 'Google documents refresh tokens expiring in seven days for a project in testing status, other than for the basic profile scopes. A pilot built there will keep breaking weekly, and the breakage is a property of the project status rather than of the code.',
        },

        { kind: 'heading', id: 'early', text: 'The early deaths that no timer predicts' },
        {
          kind: 'paragraph',
          text: 'Alongside the clocks, every platform documents ways a credential dies before its date. Google lists a user revoking access, a password change where the token carries mail scopes, and an account exceeding a maximum number of live refresh tokens. LinkedIn states plainly that it reserves the right to revoke tokens for technical or policy reasons, and that the expected response is to fall back to the standard sign in flow.',
        },
        {
          kind: 'paragraph',
          text: 'Notice what that last one implies. A correct system must always be able to send a person back through authorization, at any moment, for a reason it will never be told. Every design that treats reconnection as a rare recovery path is going to meet it as a routine one.',
        },
        {
          kind: 'list',
          items: [
            'A person leaves the company and their access to the page goes with them, which invalidates a credential that was never technically expired.',
            'A page role changes, so the same token now lacks the permission it had yesterday. This is a permission failure, not an authentication failure, and it needs a different message.',
            'An account is switched from a professional to a personal type, removing publishing eligibility entirely.',
          ],
        },

        {
          kind: 'heading',
          id: 'design',
          text: 'Design the interface around the date, not around the error',
        },
        {
          kind: 'paragraph',
          text: 'The interface consequence of all this is that a connection should show a date, not a colour. Connected is not a state anybody can act on. Connected, needs the account owner to sign in again before the fourteenth, is.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Store the expiry the platform returned, not a local guess, and never treat a missing expiry as unlimited.',
            'Refresh well ahead of the deadline on a schedule of your own, so a refresh failure surfaces during working hours rather than at a publication time.',
            'Warn the person who can actually fix it. On a page with roles, that is often not the person who set the connection up.',
            'Show the scheduled work at risk when a credential is near its end. A warning that does not name the six posts it affects is decoration.',
            'Keep the queue intact when a connection dies. Failing the account is correct; deleting the plan is not.',
          ],
        },
        {
          kind: 'callout',
          title: 'Never reconnect quietly on behalf of somebody',
          body: 'Reauthorization is a person granting access, so it is theirs to grant. A tool that hides the grant behind a friendly button teaches people to approve access without reading it, which is exactly the habit that leads to the wrong page being connected to the wrong client.',
        },

        { kind: 'heading', id: 'runbook', text: 'A one page runbook that survives a holiday' },
        {
          kind: 'paragraph',
          text: 'Write down, per platform, four things: the documented access lifetime, the documented refresh lifetime, who at the client can reauthorize, and the date the current credential ends. Four columns, one row per connected account, and a review before every planning cycle.',
        },
        {
          kind: 'paragraph',
          text: 'That sheet turns the most common publishing outage into a diary entry. It also makes the awkward question easy to ask early: if the only person who can reconnect this account is on leave for three weeks, that is a scheduling constraint, and it is better known in advance than discovered at eight in the morning.',
        },
        {
          kind: 'cta',
          label: 'See the account requirements recorded per platform',
          href: ROUTES.capabilities,
        },
      ],
    },
  },
};
