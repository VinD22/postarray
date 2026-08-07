import type { ReactElement } from 'react';

import { AgentConfirmationScreen } from '@/features/developer/confirmations/agent-confirmation-screen';

export default async function AgentConfirmationPage({
  params,
}: {
  readonly params: Promise<{ readonly confirmationId: string }>;
}): Promise<ReactElement> {
  const { confirmationId } = await params;
  return <AgentConfirmationScreen confirmationId={confirmationId} />;
}
