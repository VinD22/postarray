export const mediaMessages = {
  // ==================================================== el editor ====
  'mediaLib.derivative.heading': 'Editar esta imagen',
  'mediaLib.derivative.description':
    'Recorta, gira, redimensiona, cambia el formato o comprime. Todo cambio actúa sobre los píxeles que ya están en tu archivo. No se agrega nada que no estuviera ahí.',
  'mediaLib.derivative.originalKept':
    'El original nunca se reemplaza. Cada edición se guarda como una versión separada que puedes elegir al componer.',
  'mediaLib.derivative.apply': 'Guardar esta versión',
  'mediaLib.derivative.applying': 'Guardando esta versión',
  'mediaLib.derivative.discard': 'Descartar cambios',
  'mediaLib.derivative.noChanges': 'Nada que guardar todavía. Cambia un valor arriba.',

  'mediaLib.derivative.tab.crop': 'Recortar',
  'mediaLib.derivative.tab.transform': 'Girar y redimensionar',
  'mediaLib.derivative.tab.output': 'Formato',

  'mediaLib.derivative.cropHint':
    'Escribe los números, o usa las flechas del teclado en cualquier campo. Ningún paso aquí necesita un mouse.',
  'mediaLib.derivative.cropX': 'Borde izquierdo, en píxeles',
  'mediaLib.derivative.cropY': 'Borde superior, en píxeles',
  'mediaLib.derivative.cropWidth': 'Ancho del recorte, en píxeles',
  'mediaLib.derivative.cropHeight': 'Alto del recorte, en píxeles',
  'mediaLib.derivative.rotate': 'Girar',
  'mediaLib.derivative.rotateNone': 'Sin rotación',
  'mediaLib.derivative.rotateDegrees': '{degrees} grados en el sentido del reloj',
  'mediaLib.derivative.resizeWidth': 'Nuevo ancho, en píxeles',
  'mediaLib.derivative.resizeHeight': 'Nueva altura, en píxeles',
  'mediaLib.derivative.lockRatio': 'Mantener la proporción cuando cambio un lado',
  'mediaLib.derivative.format': 'Guardar como',
  'mediaLib.derivative.formatSame': 'Mantener el formato actual',
  'mediaLib.derivative.quality': 'Calidad',
  'mediaLib.derivative.qualityHint':
    'Una calidad menor genera un archivo más pequeño. Se aplica a JPEG y WebP. PNG no tiene pérdidas y lo ignora.',
  'mediaLib.derivative.projected': 'Esta versión tendrá {width} por {height} píxeles.',
  'mediaLib.derivative.projectedUnavailable':
    'El tamaño de esta versión no está disponible hasta que se genere.',

  // ==================================================== la lista de versiones ====
  'mediaLib.derivative.listHeading': 'Versiones',
  'mediaLib.derivative.original': 'Original',
  'mediaLib.derivative.originalHint': 'Siempre se conserva. Nunca se sobrescribe.',
  'mediaLib.derivative.item': '{width} por {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty':
    'Todavía no hay versiones editadas. El original es el único archivo aquí.',
  'mediaLib.derivative.select': 'Usar esta versión',
  'mediaLib.derivative.selected': 'En uso en esta publicación',
  'mediaLib.derivative.useOriginal': 'Usar el original',
  'mediaLib.derivative.processing':
    'Esta versión se está generando. Aparecerá aquí cuando esté lista.',
  'mediaLib.derivative.alreadyExists':
    'Ya hiciste exactamente esta edición antes, así que reutilizamos esa versión en lugar de crear una segunda.',
  'mediaLib.derivative.failedTitle': 'Esta versión no se pudo generar',
  'mediaLib.derivative.failedBody':
    'No se guardó nada y tu original está intacto. Cambia los valores e inténtalo de nuevo.',
  'mediaLib.derivative.openEditor': 'Editar {name}',

  'mediaLib.derivative.unsupportedTitle': 'La edición solo funciona con imágenes',
  'mediaLib.derivative.unsupportedBody':
    'El video, el audio y los documentos no se pueden editar aquí. Prepara el archivo antes de subirlo. Tu carga original tampoco cambia en ningún caso.',

  'mediaLib.derivative.nonGenerative':
    'La herramienta no genera imágenes ni videos. Este editor solo recorta, gira, redimensiona, convierte y comprime lo que subiste.',

  // ==================================================== rechazos ====
  'error.media_derivative_no_operations.message':
    'Elige al menos un cambio antes de guardar una versión.',
  'error.media_derivative_duplicate_operation.message':
    'Cada tipo de cambio puede aparecer una vez. Quita el segundo {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Ese recorte se sale del borde de la imagen, que tiene {sourceWidth} por {sourceHeight} píxeles. Muévelo o hazlo más pequeño.',
  'error.media_derivative_upscale_rejected.message':
    'Este editor nunca amplía una imagen, porque los píxeles adicionales serían inventados en lugar de tuyos. El tamaño más grande que puede tener esta versión es {availableWidth} por {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'La edición funciona con imágenes JPEG, PNG, WebP y GIF. Este archivo es {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Todavía no sabemos el tamaño de esta imagen, así que no podemos verificar el cambio contra él. Inténtalo de nuevo cuando termine el procesamiento.',
  'error.media_derivative_format_required.message':
    'Elige un formato para guardar. Un archivo {sourceMimeType} no se puede guardar como sí mismo aquí.',
  'error.media_derivative_quality_unsupported.message':
    'PNG no tiene pérdidas, así que una configuración de calidad no haría nada. Quítala, o guarda como JPEG o WebP.',
  'error.media_derivative_no_change.message': 'Ese ya es el formato que usa este archivo.',
  'error.media_derivative_source_unavailable.message':
    'El archivo del que vendría esta versión ya no está en el almacenamiento.',
  'error.media_derivative_preset_mismatch.message':
    'Esta solicitud de edición no coincide con los cambios que describe. No se generó nada. Inténtalo de nuevo desde el editor.',
  'error.media_derivative_empty_result.message':
    'La edición no produjo ninguna imagen, así que no se guardó nada. Tu original está intacto.',
  'error.media_derivative_transform_failed.message':
    'Esta imagen no se pudo leer ni escribir. No se guardó nada y tu original está intacto.',
  'error.media_derivative_write_failed.message':
    'Esta versión no se pudo registrar. No se guardó nada y tu original está intacto.',
} as const;
