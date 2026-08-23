import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { OAuthConsentScreen } from '@/features/developer';

/** Consent contains a request nonce and is never a search result. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ConsentPage(): ReactNode {
  return <OAuthConsentScreen />;
}
