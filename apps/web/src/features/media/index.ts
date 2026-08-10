/**
 * The media library feature.
 *
 * The picture editor here is non generative by construction: its plan has no
 * prompt, no model and no seed, only operations on pixels that already exist.
 */

export { LibraryScreen } from './components/library-screen';
export type { LibraryScreenProps, LibraryStatus } from './components/library-screen';
export { MediaDetail } from './components/media-detail';
export { mediaAssetFromApi } from './state/from-api';
export { mediaPolicyLimits } from './state/media-policy';
export { MediaPickerDialog } from './components/media-picker-dialog';
export { PictureEditor } from './components/picture-editor';
export { DerivativeDialog } from './components/derivative-dialog';
export type { DerivativeDialogProps } from './components/derivative-dialog';
export { DerivativeEditor } from './components/derivative-editor';
export type { DerivativeEditorProps, DerivativeEditorSource } from './components/derivative-editor';
export { DerivativeList } from './components/derivative-list';
export type { DerivativeListProps } from './components/derivative-list';
export { useDerivatives } from './hooks/use-derivatives';
export type { DerivativesState } from './hooks/use-derivatives';
export { derivativesApi } from './state/derivatives-api';
export type {
  DerivativeFormat,
  DerivativeOperation,
  DerivativeRequestView,
  DerivativeView,
} from './state/derivatives-api';
export {
  EMPTY_DERIVATIVE_PLAN,
  clampCrop,
  projectedSize,
  toDerivativeOperations,
} from './state/derivative-plan';
export type { DerivativeCrop, DerivativePlan } from './state/derivative-plan';
export { UploadPanel } from './components/upload-panel';
export { MediaPolicyNotice } from './components/media-policy-notice';
export { AltTextForm } from './components/alt-text-form';
export { RightsForm } from './components/rights-form';

export { useUploadQueue } from './hooks/use-upload-queue';
export type { UploadQueue, UploadTransport } from './hooks/use-upload-queue';

export {
  acceptedMimeTypes,
  altTextLimit,
  altTextRequiredBy,
  aspectPresetsFor,
  checkFile,
  describeRatio,
  estimateBytes,
  lowestByteLimit,
  planChangesAnything,
  projectedDimensions,
} from './state/media-rules';
export type { AccountRule, CandidateFile, FileVerdict } from './state/media-rules';
export { SEED_ASSETS } from './state/seed';

export { IDENTITY_EDIT_PLAN } from './types';
export type {
  AspectPreset,
  MediaAsset,
  MediaEditPlan,
  MediaProvenance,
  MediaVersion,
  RightsDeclaration,
  UploadItem,
} from './types';
