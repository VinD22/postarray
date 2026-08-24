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
  'mediaLib.derivative.heading': 'Editar esta imagen',
  'mediaLib.derivative.description':
    'Recorta, rota, cambia el tamaño, cambia el formato o comprime. Cada cambio actúa sobre los píxeles que ya están en tu archivo. No se agrega nada que no estuviera ahí.',
  'mediaLib.derivative.originalKept':
    'El original nunca se reemplaza. Cada edición se guarda como una versión separada que puedes elegir al componer.',
  'mediaLib.derivative.apply': 'Guardar esta versión',
  'mediaLib.derivative.applying': 'Guardando esta versión',
  'mediaLib.derivative.discard': 'Descartar cambios',
  'mediaLib.derivative.noChanges': 'Aún no hay nada que guardar. Cambia un valor arriba.',

  'mediaLib.derivative.tab.crop': 'Recortar',
  'mediaLib.derivative.tab.transform': 'Rotar y cambiar tamaño',
  'mediaLib.derivative.tab.output': 'Formato',

  'mediaLib.derivative.cropHint':
    'Escribe los números, o usa las teclas de flecha en cualquier campo. Ningún paso aquí necesita un mouse.',
  'mediaLib.derivative.cropX': 'Borde izquierdo, en píxeles',
  'mediaLib.derivative.cropY': 'Borde superior, en píxeles',
  'mediaLib.derivative.cropWidth': 'Ancho del recorte, en píxeles',
  'mediaLib.derivative.cropHeight': 'Alto del recorte, en píxeles',
  'mediaLib.derivative.rotate': 'Rotar',
  'mediaLib.derivative.rotateNone': 'Sin rotación',
  'mediaLib.derivative.rotateDegrees': '{degrees} grados en sentido horario',
  'mediaLib.derivative.resizeWidth': 'Nuevo ancho, en píxeles',
  'mediaLib.derivative.resizeHeight': 'Nuevo alto, en píxeles',
  'mediaLib.derivative.lockRatio': 'Mantener la forma al cambiar un lado',
  'mediaLib.derivative.format': 'Guardar como',
  'mediaLib.derivative.formatSame': 'Mantener el formato actual',
  'mediaLib.derivative.quality': 'Calidad',
  'mediaLib.derivative.qualityHint':
    'Una calidad menor produce un archivo más pequeño. Se aplica a JPEG y WebP. PNG no tiene pérdida y lo ignora.',
  'mediaLib.derivative.projected': 'Esta versión será de {width} por {height} píxeles.',
  'mediaLib.derivative.projectedUnavailable':
    'El tamaño de esta versión no está disponible hasta que se genere.',

  // ==================================================== the versions list ====
  'mediaLib.derivative.listHeading': 'Versiones',
  'mediaLib.derivative.original': 'Original',
  'mediaLib.derivative.originalHint': 'Siempre se conserva. Nunca se sobrescribe.',
  'mediaLib.derivative.item': '{width} por {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty':
    'Aún no hay versiones editadas. El original es el único archivo aquí.',
  'mediaLib.derivative.select': 'Usar esta versión',
  'mediaLib.derivative.selected': 'En uso para esta publicación',
  'mediaLib.derivative.useOriginal': 'Usar el original',
  'mediaLib.derivative.processing':
    'Esta versión se está generando. Aparecerá aquí cuando esté lista.',
  'mediaLib.derivative.alreadyExists':
    'Ya hiciste exactamente esta misma edición antes, así que reutilizamos esa versión en lugar de crear una segunda.',
  'mediaLib.derivative.failedTitle': 'No se pudo generar esta versión',
  'mediaLib.derivative.failedBody':
    'No se guardó nada y tu original no fue tocado. Cambia los valores e intenta de nuevo.',
  'mediaLib.derivative.openEditor': 'Editar {name}',

  'mediaLib.derivative.unsupportedTitle': 'La edición solo funciona con imágenes',
  'mediaLib.derivative.unsupportedBody':
    'Video, audio y documentos no se pueden editar aquí. Prepara el archivo antes de subirlo. Tu carga original nunca cambia de ninguna forma.',

  'mediaLib.derivative.nonGenerative':
    'Post Array no genera imágenes ni videos. Este editor solo recorta, rota, cambia el tamaño, convierte y comprime lo que subiste.',

  // ==================================================== refusals ====
  'error.media_derivative_no_operations.message':
    'Elige al menos un cambio antes de guardar una versión.',
  'error.media_derivative_duplicate_operation.message':
    'Cada tipo de cambio puede aparecer una sola vez. Elimina el segundo {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Ese recorte se extiende más allá del borde de la imagen, que mide {sourceWidth} por {sourceHeight} píxeles. Muévelo o hazlo más pequeño.',
  'error.media_derivative_upscale_rejected.message':
    'Este editor nunca agranda una imagen, porque los píxeles adicionales serían inventados en lugar de tuyos. El tamaño máximo posible de esta versión es {availableWidth} por {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'La edición funciona con imágenes JPEG, PNG, WebP y GIF. Este archivo es {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Todavía no conocemos el tamaño de esta imagen, así que no podemos verificar el cambio contra ella. Intenta de nuevo cuando termine el procesamiento.',
  'error.media_derivative_format_required.message':
    'Elige un formato para guardar. Un archivo {sourceMimeType} no se puede guardar aquí como sí mismo.',
  'error.media_derivative_quality_unsupported.message':
    'PNG no tiene pérdida, así que un ajuste de calidad no haría nada. Quítalo, o guarda como JPEG o WebP.',
  'error.media_derivative_no_change.message': 'Ese es el formato que ya usa este archivo.',
  'error.media_derivative_source_unavailable.message':
    'El archivo del que provendría esta versión ya no está en el almacenamiento.',
  'error.media_derivative_preset_mismatch.message':
    'Esta solicitud de edición no coincide con los cambios que describe. No se generó nada. Intenta de nuevo desde el editor.',
  'error.media_derivative_empty_result.message':
    'La edición no produjo ninguna imagen, así que no se guardó nada. Tu original no fue tocado.',
  'error.media_derivative_transform_failed.message':
    'No se pudo leer ni escribir esta imagen. No se guardó nada y tu original no fue tocado.',
  'error.media_derivative_write_failed.message':
    'No se pudo registrar esta versión. No se guardó nada y tu original no fue tocado.',
} as const;
