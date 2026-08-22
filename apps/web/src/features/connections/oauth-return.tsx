'use client';

import type { ReactNode } from 'react';

import { OAuthAccountSelectionPanel } from './oauth-account-selection';
import { OAuthCallbackNotice } from './oauth-callback-notice';

/**
 * Everything that has to happen when a browser comes back from a provider.
 *
 * The API's callback redirects to whichever `returnUrl` began the flow, with a
 * small vocabulary in the query string: `connected`, `declined`, `failed` with
 * a safe reason, or `select` plus a transaction id. For `select` the browser
 * still has to fetch the discovered accounts and claim the chosen ones. If the
 * page the person lands on renders none of that, they complete a real provider
 * consent screen and arrive somewhere that tells them they have no connection.
 *
 * That was exactly the onboarding bug: the connect step began OAuth with
 * `returnUrl: '/onboarding/compose'`, and only the connections screen rendered
 * the two panels, so the connection was never claimed.
 *
 * So the return handling is one component and both landing pages render it.
 * Nothing was rewritten to get here: the notice and the selection panel are the
 * same two components the connections screen already used, and every branch
 * they handle (selection required, claim success, claim failure, cancelled,
 * an expired or unknown transaction) is handled identically on both surfaces,
 * because it is the same code.
 *
 * Both halves render nothing at all when the query string carries no callback,
 * so this is safe to place on any page that can be a `returnUrl`.
 */
export function OAuthReturnPanel(): ReactNode {
  return (
    <>
      <OAuthCallbackNotice />
      <OAuthAccountSelectionPanel />
    </>
  );
}
