/**
 * `@relay/authz`: roles, scopes and policy decisions.
 *
 * Every surface asks this package the same question and gets the same answer.
 * It depends only on `@relay/contracts`, holds no I/O and has no clock of its
 * own, so a policy question is always answerable in a unit test.
 */

export {
  CONSEQUENTIAL_PERMISSIONS,
  PERMISSIONS,
  READ_PERMISSIONS,
  isConsequentialPermission,
  isPermission,
  isReadPermission,
  type Permission,
} from './permissions';

export {
  ROLE_PERMISSIONS,
  ROLE_RANK,
  effectivePermissions,
  minimumRoleFor,
  permissionsForRole,
  roleHasPermission,
  rolesWithPermission,
  type EffectivePermissions,
  type RolePermissionOverride,
} from './roles';

export {
  NON_DELEGABLE_PERMISSIONS,
  PERMISSION_SCOPES,
  SCOPE_PERMISSIONS,
  THIRD_PARTY_FORBIDDEN_SCOPES,
  delegableScopes,
  effectiveCredentialPermissions,
  isDelegable,
  isThirdPartyGrantable,
  narrowScopes,
  scopeGrantsPermission,
  scopesForPermission,
  type ScopeNarrowingInput,
  type ScopeNarrowingResult,
} from './scopes';

export {
  DECISION_REASONS,
  MEMBERSHIP_STATES,
  PolicyDenied,
  WORKSPACE_STATES,
  assertCan,
  can,
  grantedPermissions,
  requiredApprovalLevel,
  scopesAreEnforced,
  type Decision,
  type DecisionDetailValue,
  type DecisionReason,
  type MembershipState,
  type PolicyActor,
  type PolicyActorType,
  type PolicyOptions,
  type PolicyResource,
  type WorkspacePolicy,
  type WorkspaceState,
} from './policy';

export {
  SUBSTANTIAL_SIMILARITY_THRESHOLD,
  clusterSimilar,
  contentFingerprint,
  isSubstantiallySimilar,
  normalizeForComparison,
  shingles,
  similarityRatio,
  tokenize,
  type SimilarityCluster,
} from './similarity';

export {
  ACTION_MINIMUM_LEVEL,
  AGENT_ACTION_KINDS,
  DEFAULT_AGENT_THRESHOLDS,
  ESCALATION_CODES,
  RESTRICTION_CODES,
  countExternalPublications,
  countSimilarAccounts,
  detectBulkAction,
  domainApproved,
  evaluateAgentAction,
  hourInZone,
  withinAllowedHours,
  type AgentActionKind,
  type AgentActionRequest,
  type AgentDecision,
  type AgentTarget,
  type AgentThresholds,
  type ContentClassification,
  type EscalationCode,
  type PolicyNote,
  type PolicyNoteValue,
  type RestrictionCode,
  type ServiceAccountRestrictions,
} from './agent-policy';
