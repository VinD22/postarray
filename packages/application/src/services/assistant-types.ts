import type {
  ActionCenterService,
  AgentConfirmationService,
  ApprovalService,
  ConnectionService,
  ContentService,
  GrowthService,
  QueueRuleService,
  ReceiptService,
  SchedulingService,
} from '../types';

/**
 * What the assistant is allowed to reach.
 *
 * Deliberately a narrow slice of `Services` rather than the whole object. The
 * assistant has no publishing service, no billing service and no credential
 * service on it, so "the assistant cannot publish" is a fact about its type
 * rather than a promise about its code.
 */
export interface AssistantDelegates {
  readonly content: ContentService;
  readonly connections: ConnectionService;
  readonly growth: GrowthService;
  readonly queueRules: QueueRuleService;
  readonly scheduling: SchedulingService;
  readonly approvals: ApprovalService;
  readonly receipts: ReceiptService;
  readonly actionCenter: ActionCenterService;
  readonly agentConfirmations: AgentConfirmationService;
}
