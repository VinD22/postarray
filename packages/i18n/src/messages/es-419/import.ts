/**
 * Bulk CSV import.
 *
 * Two groups of strings. The `import.error.*` keys are the ones the parser and
 * the apply step emit: they are stored on a row, rendered in the report and
 * written into the downloadable CSV, so they have to make sense to someone
 * reading a spreadsheet rather than a screen. Everything else is the wizard.
 *
 * The copy says drafts wherever drafts are what happens, and it says schedule
 * only on the step where a person chooses it. Nothing here promises that a post
 * reaches a platform.
 */
export const importMessages = {
  'import.title': 'Importar publicaciones desde CSV',
  'import.subtitle':
    'Sube una hoja de cálculo, lee lo que hará y luego decide. Subir el archivo solo lo verifica. No crea nada.',

  'import.step.upload': 'Subir',
  'import.step.columns': 'Columnas',
  'import.step.review': 'Revisar',
  'import.step.apply': 'Aplicar',
  'import.step.results': 'Resultados',
  'import.step.position': 'Paso {current} de {total}',

  'import.upload.heading': 'Elige un archivo CSV',
  'import.upload.help':
    'Solo CSV. No se leen archivos de hoja de cálculo como .xlsx. Exporta tu hoja como CSV primero.',
  'import.upload.field': 'Archivo CSV',
  'import.upload.fieldHelp': 'Selecciona un archivo, o pega las filas en el cuadro de abajo.',
  'import.upload.paste': 'O pega texto CSV',
  'import.upload.pasteHelp': 'Incluye la fila de encabezado. Todo se verifica antes de crear nada.',
  'import.upload.project': 'Proyecto',
  'import.upload.projectHelp': 'Cada fila de un archivo pertenece a este proyecto.',
  'import.upload.submit': 'Verificar este archivo',
  'import.upload.submitting': 'Leyendo el archivo',
  'import.upload.allowPast': 'Permitir horarios que ya pasaron',
  'import.upload.allowPastHelp':
    'Desactivado de forma predeterminada. Una fila con fecha pasada se informa para que la corrijas, en lugar de moverla por ti.',
  'import.upload.tooLarge':
    'Ese archivo supera los {limit} caracteres. Divídelo y vuelve a intentar.',
  'import.upload.duplicate':
    'Este es el mismo archivo que subiste antes, así que estás viendo esa importación en lugar de una segunda copia.',

  'import.template.heading': 'Qué significan las columnas',
  'import.template.download': 'Descargar una plantilla CSV',
  'import.template.required': 'Columnas requeridas',
  'import.template.optional': 'Columnas opcionales',
  'import.column.external_row_id': 'Tu propio id para la fila. Debe ser único dentro del archivo.',
  'import.column.project': 'El nombre o id del proyecto al que pertenece la fila.',
  'import.column.targets':
    'Ya sea set: seguido de un id de conjunto de destinos, o ids de cuenta separados por una barra vertical.',
  'import.column.caption': 'El texto de la publicación.',
  'import.column.scheduled_local_time': 'Fecha y hora local, escrita como 2026-09-01T10:00.',
  'import.column.time_zone':
    'La zona IANA en la que se lee esa hora local, por ejemplo Europe/Berlin.',
  'import.column.media':
    'Un id de medio, sha256: seguido del checksum de un medio que ya tienes, o una dirección https para que el servidor lo obtenga.',
  'import.column.title': 'Un título, donde el destino use uno.',
  'import.column.destination': 'La página, tablero o canal dentro de la cuenta.',
  'import.column.privacy': 'El valor de privacidad que espera el destino.',
  'import.column.first_comment':
    'Texto publicado como el primer comentario después de la publicación.',
  'import.column.approval_policy': 'La política de aprobación que se adjuntará a cada borrador.',
  'import.column.perPlatform':
    'Una columna caption_ o title_ nombrada según una plataforma reemplaza solo esa plataforma, por ejemplo caption_instagram.',

  'import.columns.heading': 'Verificación de columnas',
  'import.columns.ok': 'Todas las columnas requeridas están presentes.',
  'import.columns.missing':
    '{count, plural, one {Falta #columna requerida} other {Faltan #columnas requeridas} many {Faltan #columnas requeridas}}',
  'import.columns.unknown':
    '{count, plural, one {#columna no se reconoció y se ignora} other {#columnas no se reconocieron y se ignoran} many {#columnas no se reconocieron y se ignoran}}',
  'import.columns.present': 'Columnas encontradas',

  'import.review.heading': 'Lo que hará este archivo',
  'import.review.counts':
    '{valid, plural, =0 {Ninguna fila está lista} one {#fila está lista} other {#filas están listas} many {#filas están listas}}, {invalid, plural, =0 {ninguna necesita atención} one {#necesita atención} other {#necesitan atención} many {#necesitan atención}}.',
  'import.review.empty': 'No se leyó ninguna fila de este archivo.',
  'import.review.rowsHeading': 'Filas',
  'import.review.filterAll': 'Todas las filas',
  'import.review.filterValid': 'Listas',
  'import.review.filterInvalid': 'Necesitan atención',
  'import.review.filterFailed': 'Fallidas',
  'import.review.downloadErrors': 'Descargar los problemas como CSV',
  'import.review.parsedWith': 'Leído con el analizador {version}',

  'import.table.row': 'Id de fila',
  'import.table.line': 'Línea',
  'import.table.state': 'Estado',
  'import.table.caption': 'Texto',
  'import.table.time': 'Programado',
  'import.table.problems': 'Problemas',
  'import.table.draft': 'Borrador',
  'import.table.noProblems': 'Ninguno',

  'import.state.pending': 'Sin verificar',
  'import.state.valid': 'Lista',
  'import.state.invalid': 'Necesita atención',
  'import.state.applied': 'Borrador creado',
  'import.state.skipped': 'Ya se hizo',
  'import.state.failed': 'Fallida',

  'import.job.state.uploaded': 'Subido',
  'import.job.state.validating': 'Verificando',
  'import.job.state.validated': 'Verificado',
  'import.job.state.applying': 'Aplicando',
  'import.job.state.applied': 'Aplicado',
  'import.job.state.failed': 'No se pudo leer',

  'import.apply.heading': '¿Qué debería pasar con las filas que están listas?',
  'import.apply.drafts': 'Crear borradores',
  'import.apply.draftsHelp':
    'La opción predeterminada. Cada fila lista se convierte en un borrador que puedes abrir, editar y aprobar. Nada se programa.',
  'import.apply.scheduled': 'Crear borradores y programarlos',
  'import.apply.scheduledHelp':
    'Cada fila lista se convierte en un borrador y toma el horario escrito en el archivo. Elige esto solo si los horarios son correctos.',
  'import.apply.confirm': 'Aplicar {count, plural, one {#fila} other {#filas} many {#filas}}',
  'import.apply.confirmScheduled':
    'Crear y programar {count, plural, one {#fila} other {#filas} many {#filas}}',
  'import.apply.running': 'Aplicando filas',
  'import.apply.safeToRepeat':
    'Aplicar dos veces es seguro. Una fila que ya creó un borrador se deja intacta.',

  'import.results.heading': 'Resultados',
  'import.results.applied':
    '{count, plural, one {#borrador creado} other {#borradores creados} many {#borradores creados}}',
  'import.results.skipped':
    '{count, plural, one {#fila ya estaba hecha} other {#filas ya estaban hechas} many {#filas ya estaban hechas}}',
  'import.results.failed':
    '{count, plural, one {#fila falló} other {#filas fallaron} many {#filas fallaron}}',
  'import.results.retry': 'Aplicar de nuevo las filas restantes',
  'import.results.openDrafts': 'Abrir los borradores',
  'import.results.unavailable': 'no disponible',

  'import.history.heading': 'Importaciones anteriores',
  'import.history.empty': 'Aún no hay importaciones.',
  'import.history.open': 'Abrir',

  'import.a11y.rowsTable': 'Filas del listado y sus problemas',
  'import.a11y.stepList': 'Pasos de importación',
  'import.a11y.uploadedFile': 'Archivo seleccionado: {filename}',

  'import.error.emptyFile': 'Ese archivo no tiene filas.',
  'import.error.missingColumn': 'Falta la columna {column}.',
  'import.error.unknownColumn': 'La columna {column} no se reconoció, así que se ignora.',
  'import.error.duplicateRowId': 'El id de fila {value} se usa más de una vez en este archivo.',
  'import.error.required': 'Esta celda no puede estar vacía.',
  'import.error.invalidCell': 'Esta celda no tiene un formato que podamos leer.',
  'import.error.rowShape': 'Esta línea tiene {actual} celdas pero el encabezado tiene {expected}.',
  'import.error.invalidLocalTime':
    'La hora {value} no es una fecha y hora local como 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'La zona {value} no es un nombre de zona horaria IANA.',
  'import.error.nonexistentLocalTime': 'La hora {value} no existe en {zone}. El reloj la salta.',
  'import.error.ambiguousLocalTime':
    'La hora {value} ocurre dos veces en {zone} ese día. Elige una hora diferente.',
  'import.error.scheduleInPast': 'La hora {value} en {zone} ya pasó.',
  'import.error.invalidTargets':
    'El valor {value} no es un conjunto de destinos guardado ni una lista de ids de cuenta.',
  'import.error.invalidMedia':
    'El valor {value} no es un id de medio, un checksum sha256 ni una dirección https.',
  'import.error.mediaNotFound': 'Ningún medio en este espacio de trabajo coincide con {value}.',
  'import.error.mediaImportStarted':
    'Se está obteniendo el medio en {value}. Vuelve a aplicar este archivo una vez que esté en la biblioteca.',
  'import.error.unknownVariantTarget':
    'Esta fila no tiene una cuenta de {provider}, así que no se usó el texto de {provider}.',
  'import.error.applyFailed': 'No se pudo aplicar esta fila. Referencia: {code}.',
  'import.error.alreadyApplied': 'Esta fila ya creó un borrador, así que se dejó intacta.',
  'import.error.tooManyRows': 'Solo se leen las primeras {limit} filas de un archivo.',
} as const;
