/**
 * The composer feature.
 *
 * Routes import from here. Everything below is either a pure state module that
 * a test can drive directly, or a presentational component that takes the draft
 * from `ComposerProvider`.
 */

export { ComposerProvider, useComposer, useActiveTarget } from './composer-context.js';
export type { ComposerContextValue, ComposerProviderProps } from './composer-context.js';

export { ComposerScreen } from './components/composer-screen.js';
export type { ComposerScreenProps } from './components/composer-screen.js';
export type { ScheduleIntent } from './components/schedule-sheet.js';
export type { ResolvedEntity } from './components/entity-search-field.js';
export { PROVIDER_LABEL, ProviderIdentity } from './components/provider-identity.js';
export { CheckRow, RadioRow, SwitchRow } from './components/form-rows.js';

export { composerReducer, newThreadItem, sequenceFor } from './state/composer-reducer.js';
export type { ComposerAction } from './state/composer-reducer.js';
export { planGlobalEdit, commitGlobalEdit } from './state/global-edit.js';
export type { GlobalEditPlan } from './state/global-edit.js';
export {
  issueCursorList,
  repeatOccurrences,
  sequenceTimeline,
  summarizeTargets,
  totalsFor,
} from './state/selectors.js';
export type { DraftTotals, MediaLookup } from './state/selectors.js';
export { validateTarget } from './state/validate-draft.js';
export {
  adaptBodyFor,
  appendUtm,
  countCharacters,
  findUrls,
  mediaLimitFor,
  readCounter,
  resolvePublishedUrl,
} from './state/capability-rules.js';
export { isoDateIn, isoTimeIn, zonedToInstant } from './state/time.js';
export {
  initialComposerState,
  SEED_ACCOUNTS,
  SEED_BOOTSTRAP,
  SEED_MASTER,
  SEED_SETS,
  SEED_SIGNATURES,
  SEED_DOMAINS,
} from './state/seed.js';

export type {
  AssistAction,
  AssistProposal,
  ComposerBootstrap,
  ComposerState,
  LinkPlan,
  SignatureOption,
  TargetAccount,
  TargetRailState,
  TargetSet,
  TargetSummary,
  VariantSettings,
} from './types.js';
