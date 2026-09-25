import type { ReactNode } from 'react';

import { AiSettingsScreen } from '@/features/settings/ai/ai-settings-screen';

/**
 * Server component. It renders the screen and nothing else: every string on
 * this route comes from the catalog through the client component.
 */
export default function Page(): ReactNode {
  return <AiSettingsScreen />;
}
