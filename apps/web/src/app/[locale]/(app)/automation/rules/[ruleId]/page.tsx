import type { ReactElement } from 'react';

import { RuleEditorScreen } from '@/features/automation/rule-editor-screen';

export default async function RulePage({
  params,
}: {
  readonly params: Promise<{ readonly ruleId: string }>;
}): Promise<ReactElement> {
  const { ruleId } = await params;
  return <RuleEditorScreen ruleId={ruleId} />;
}
