/**
 * The media library feature.
 *
 * The picture editor here is non generative by construction: its plan has no
 * prompt, no model and no seed, only operations on pixels that already exist.
 */

export { LibraryScreen } from './components/library-screen.js';
export type { LibraryScreenProps, LibraryStatus } from './components/library-screen.js';
export { MediaDetail } from './components/media-detail.js';
export { MediaPickerDialog } from './components/media-picker-dialog.js';
export { PictureEditor } from './components/picture-editor.js';
export { UploadPanel } from './components/upload-panel.js';
export { AltTextForm } from './components/alt-text-form.js';
export { RightsForm } from './components/rights-form.js';

export { useUploadQueue } from './hooks/use-upload-queue.js';
export type { UploadQueue, UploadTransport } from './hooks/use-upload-queue.js';

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
} from './state/media-rules.js';
export type { AccountRule, CandidateFile, FileVerdict } from './state/media-rules.js';
export { SEED_ASSETS } from './state/seed.js';

export { IDENTITY_EDIT_PLAN } from './types.js';
export type {
  AspectPreset,
  MediaAsset,
  MediaEditPlan,
  MediaProvenance,
  MediaVersion,
  RightsDeclaration,
  UploadItem,
} from './types.js';
