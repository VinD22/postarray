/**
 * Media derivatives: the non-generative editor and the refusals it can hit.
 *
 * Two groups. `mediaLib.derivative.*` is what a person reads while cropping,
 * rotating, resizing, converting or compressing a file they already uploaded.
 * `error.media_derivative_*.message` is what the application boundary says when it
 * refuses a plan, and every one of those sentences names the reason and the
 * next step rather than reporting that something failed.
 *
 * The vocabulary is deliberate. Nothing here says generate, enhance, upscale,
 * restore or fix, because Post Array does not do any of those and copy that hinted
 * otherwise would be the first half of a promise the product cannot keep. The
 * word used throughout is "version": an edit adds one, and the original stays
 * exactly where it was.
 */
export const mediaMessages = {
  // ==================================================== the editor ====
  'mediaLib.derivative.heading': 'Edit this picture',
  'mediaLib.derivative.description':
    'Crop, rotate, resize, change the format or compress. Every change works on the pixels already in your file. Nothing is added that was not there.',
  'mediaLib.derivative.originalKept':
    'The original is never replaced. Each edit is saved as a separate version you can pick when you compose.',
  'mediaLib.derivative.apply': 'Save this version',
  'mediaLib.derivative.applying': 'Saving this version',
  'mediaLib.derivative.discard': 'Discard changes',
  'mediaLib.derivative.noChanges': 'Nothing to save yet. Change a value above.',

  'mediaLib.derivative.tab.crop': 'Crop',
  'mediaLib.derivative.tab.transform': 'Rotate and resize',
  'mediaLib.derivative.tab.output': 'Format',

  'mediaLib.derivative.cropHint':
    'Type the numbers, or use the arrow keys in any field. There is no step here that needs a mouse.',
  'mediaLib.derivative.cropX': 'Left edge, in pixels',
  'mediaLib.derivative.cropY': 'Top edge, in pixels',
  'mediaLib.derivative.cropWidth': 'Crop width, in pixels',
  'mediaLib.derivative.cropHeight': 'Crop height, in pixels',
  'mediaLib.derivative.rotate': 'Rotate',
  'mediaLib.derivative.rotateNone': 'No rotation',
  'mediaLib.derivative.rotateDegrees': '{degrees} degrees clockwise',
  'mediaLib.derivative.resizeWidth': 'New width, in pixels',
  'mediaLib.derivative.resizeHeight': 'New height, in pixels',
  'mediaLib.derivative.lockRatio': 'Keep the shape when I change one side',
  'mediaLib.derivative.format': 'Save as',
  'mediaLib.derivative.formatSame': 'Keep the current format',
  'mediaLib.derivative.quality': 'Quality',
  'mediaLib.derivative.qualityHint':
    'Lower quality makes a smaller file. It applies to JPEG and WebP. PNG is lossless and ignores it.',
  'mediaLib.derivative.projected': 'This version will be {width} by {height} pixels.',
  'mediaLib.derivative.projectedUnavailable':
    'The size of this version is unavailable until it is made.',

  // ==================================================== the versions list ====
  'mediaLib.derivative.listHeading': 'Versions',
  'mediaLib.derivative.original': 'Original',
  'mediaLib.derivative.originalHint': 'Always kept. Never overwritten.',
  'mediaLib.derivative.item': '{width} by {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'No edited versions yet. The original is the only file here.',
  'mediaLib.derivative.select': 'Use this version',
  'mediaLib.derivative.selected': 'In use for this post',
  'mediaLib.derivative.useOriginal': 'Use the original',
  'mediaLib.derivative.processing': 'This version is being made. It appears here when it is ready.',
  'mediaLib.derivative.alreadyExists':
    'You have made this exact edit before, so we reused that version instead of making a second one.',
  'mediaLib.derivative.failedTitle': 'This version could not be made',
  'mediaLib.derivative.failedBody':
    'Nothing was saved and your original is untouched. Change the values and try again.',
  'mediaLib.derivative.openEditor': 'Edit {name}',

  'mediaLib.derivative.unsupportedTitle': 'Editing works on pictures only',
  'mediaLib.derivative.unsupportedBody':
    'Video, audio and documents cannot be edited here. Prepare the file before you upload it. Your original upload is never changed either way.',

  'mediaLib.derivative.nonGenerative':
    'Post Array does not generate images or video. This editor only crops, rotates, resizes, converts and compresses what you uploaded.',

  // ==================================================== refusals ====
  'error.media_derivative_no_operations.message':
    'Choose at least one change before saving a version.',
  'error.media_derivative_duplicate_operation.message':
    'Each kind of change can appear once. Remove the second {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'That crop reaches past the edge of the picture, which is {sourceWidth} by {sourceHeight} pixels. Move it or make it smaller.',
  'error.media_derivative_upscale_rejected.message':
    'This editor never enlarges a picture, because the extra pixels would be invented rather than yours. The largest this version can be is {availableWidth} by {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'Editing works on JPEG, PNG, WebP and GIF pictures. This file is {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'We do not know this picture’s size yet, so we cannot check the change against it. Try again once processing finishes.',
  'error.media_derivative_format_required.message':
    'Pick a format to save as. A {sourceMimeType} file cannot be saved back as itself here.',
  'error.media_derivative_quality_unsupported.message':
    'PNG is lossless, so a quality setting would do nothing. Remove it, or save as JPEG or WebP.',
  'error.media_derivative_no_change.message': 'That is the format this file already uses.',
  'error.media_derivative_source_unavailable.message':
    'The file this version would come from is no longer in storage.',
  'error.media_derivative_preset_mismatch.message':
    'This edit request does not match the changes it describes. Nothing was made. Try again from the editor.',
  'error.media_derivative_empty_result.message':
    'The edit produced no picture, so nothing was saved. Your original is untouched.',
  'error.media_derivative_transform_failed.message':
    'This picture could not be read or written. Nothing was saved and your original is untouched.',
  'error.media_derivative_write_failed.message':
    'This version could not be recorded. Nothing was saved and your original is untouched.',

  // ==================================================== the safety check ====
  // Every uploaded and imported file is checked before it can be published:
  // are the bytes the type they claim to be, do they decode, are they within
  // the size that type allows. These are the sentences a person reads when
  // one of those answers is no. Each names what was wrong with the file, not
  // that "an error occurred", because the person can only act on the first.
  'media.scan.pending': 'Checking this file',
  'media.scan.mime_mismatch':
    'This file is not the type its name says it is, so it was not accepted. Save it again in the format you meant and upload it once more.',
  'media.scan.unrecognized_format':
    'This file type could not be identified, so it was not accepted. Upload a JPEG, PNG, GIF, WebP or MP4.',
  'media.scan.decode_failed':
    'This picture could not be opened, which usually means the upload was cut short. Upload it again.',
  'media.scan.too_large':
    'This file is larger than the limit for its type, so it was not accepted.',
  'media.scan.unreadable':
    'This file could not be read back from storage, so it has not been checked yet. Try again in a few minutes.',
  'media.scan.scanner_unavailable':
    'The safety check could not run, so this file is not ready to publish yet. It will be checked again automatically.',
} as const;
