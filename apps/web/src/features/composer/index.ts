/**
 * The composer feature.
 *
 * Routes import from here. Everything below is either a pure state module that
 * a test can drive directly, or a presentational component that takes the draft
 * from `ComposerProvider`.
 */

export { ComposerProvider, useComposer, useActiveTarget } from './composer-context';
export type { ComposerContextValue, ComposerProviderProps } from './composer-context';

export { ComposerScreen } from './components/composer-screen';
export type { ComposerScreenProps } from './components/composer-screen';
export type { ScheduleIntent } from './components/schedule-sheet';
export type { ResolvedEntity } from './components/entity-search-field';
export { PROVIDER_LABEL, ProviderIdentity } from './components/provider-identity';
export { CheckRow, RadioRow, SwitchRow } from './components/form-rows';

export { composerReducer, newThreadItem, sequenceFor } from './state/composer-reducer';
export {
  noticeCount,
  restoreSelection,
  type ComposerChannel,
  type RestoredSelection,
} from './state/remembered-targets';
export {
  useForgetTargets,
  useRememberTargets,
  useRememberedTargets,
  type RememberTargetsInput,
} from './data/use-remembered-targets';
export {
  useSeedRememberedTargets,
  type SeedRememberedTargetsInput,
  type SeededTargets,
} from './data/use-seed-remembered-targets';
export type { ComposerAction } from './state/composer-reducer';
export { planGlobalEdit, commitGlobalEdit } from './state/global-edit';
export type { GlobalEditPlan } from './state/global-edit';
export {
  issueCursorList,
  repeatOccurrences,
  sequenceTimeline,
  summarizeTargets,
  totalsFor,
} from './state/selectors';
export type { DraftTotals, MediaLookup } from './state/selectors';
export { validateTarget } from './state/validate-draft';
export {
  adaptBodyFor,
  appendUtm,
  countCharacters,
  findUrls,
  mediaLimitFor,
  readCounter,
  resolvePublishedUrl,
} from './state/capability-rules';
export { isoDateIn, isoTimeIn, zonedToInstant } from './state/time';
export {
  initialComposerState,
  SEED_ACCOUNTS,
  SEED_BOOTSTRAP,
  SEED_MASTER,
  SEED_SETS,
  SEED_SIGNATURES,
  SEED_DOMAINS,
} from './state/seed';

export type {
  ComposerBootstrap,
  ComposerState,
  LinkPlan,
  SignatureOption,
  TargetAccount,
  TargetRailState,
  TargetSet,
  TargetSummary,
  VariantSettings,
} from './types';
