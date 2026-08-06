import type { ReactElement } from 'react';

import { RuleEditorScreen } from '@/features/automation/rule-editor-screen';

export default function NewRulePage(): ReactElement {
  return <RuleEditorScreen ruleId={null} />;
}
