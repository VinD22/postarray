/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Navegación primaria',
  'a11y.region.main': 'Contenido principal',
  'a11y.region.composer': 'Composer',
  'a11y.region.preview': 'Vista previa',
  'a11y.region.validation': 'Problemas de validación',
  'a11y.region.targets': 'Cuentas objetivo',
  'a11y.region.notifications': 'Notificaciones',

  'a11y.announce.saved': 'Borrador guardado',
  'a11y.announce.saving': 'Guardando borrador',
  'a11y.announce.saveFailed': 'No se pudo guardar el borrador. Tu texto todavía está aquí.',
  'a11y.announce.offline': 'Estás desconectado. Los cambios se guardan en este dispositivo.',
  'a11y.announce.online': 'De nuevo en línea',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Sin problemas de validación} one {# problema de validación} many {# problemas de validación} other {# problemas de validación}}',
  'a11y.announce.validationCleared': 'Todos los problemas de validación resueltos',
  'a11y.announce.targetSelected':
    '{account} seleccionado. {count, plural, one {# objetivo} many {# objetivos} other {# objetivos}} en total.',
  'a11y.announce.targetOverridden': '{account} ahora tiene su propia versión',
  'a11y.announce.targetReset': '{account} restablecer al borrador maestro',
  'a11y.announce.uploadProgress': '{name}, {percent} subido',
  'a11y.announce.uploadComplete': '{name} subido',
  'a11y.announce.uploadFailed': '{name} no pudo subir',
  'a11y.announce.scheduled': 'Programado for {time} in {timeZone}',
  'a11y.announce.rescheduled': 'Movido to {time} in {timeZone}',
  'a11y.announce.publishing': 'Publicación',
  'a11y.announce.published':
    '{count, plural, one {Publicado en # cuenta} many {Publicado en # cuentas} other {Publicado en # cuentas}}',
  'a11y.announce.publishPartial':
    'Publicadas to {published} of {total} cuentas. {failed, plural, one {# cuenta necesita atención} many {# cuentas necesita atención} other {# cuentas necesita atención}}.',
  'a11y.announce.publishFailed': 'La publicación falló. Su contenido se conserva.',
  'a11y.announce.approvalRequested': 'Aprobación solicitada from {approver}',
  'a11y.announce.approved': 'Aprobado',
  'a11y.announce.connectionAdded': '{account} conectado',
  'a11y.announce.connectionRemoved': '{account} desconectado',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Filtros borrados} one {# filtro aplicado} many {# filtros aplicados} other {# filtros aplicados}}, {results, plural, one {# resultado} many {# resultados} other {# resultados}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Copiado al portapapeles',
  'a11y.announce.suggestionApplied': 'Sugerencia aplicada',
  'a11y.announce.suggestionRejected': 'Sugerencia rechazada',

  'a11y.label.closeDialog': 'Cerrar diálogo',
  'a11y.label.openMenu': 'abrir menú',
  'a11y.label.sortBy': 'Ordenar by {field}',
  'a11y.label.sortAscending': 'Ordenado ascendente',
  'a11y.label.sortDescending': 'Ordenado descendente',
  'a11y.label.removeTarget': 'Remove {account} de los objetivos',
  'a11y.label.removeMedia': 'Remove {name}',
  'a11y.label.editAltText': 'Editar texto alternativo for {name}',
  'a11y.label.mediaPreview': 'Vista previa of {name}',
  'a11y.label.playVideo': 'Play {name}',
  'a11y.label.pauseVideo': 'Pause {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {nada programado} one {# publicación} many {# publicaciones} other {# publicaciones}}',
  'a11y.label.postSummary': '{account} on {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} of {limit} caracteres utilizados',
  'a11y.label.requiredField': 'Requerido',
  'a11y.label.externalLink': 'Se abre en una nueva pestaña',
  'a11y.label.loadingRegion': 'Cargando contenido',
  'a11y.label.expandRow': 'Mostrar detalles for {name}',
  'a11y.label.collapseRow': 'Ocultar detalles for {name}',
  'a11y.languagePicker.label': 'Elija el idioma de la interfaz',
  'a11y.languagePicker.filterLabel': 'Filtrar idiomas',
  'a11y.languagePicker.announceChanged': 'Idioma de la interfaz cambiado to {language}',

  'a11y.keyboard.hint.calendar':
    'Utilice las teclas de flecha para moverse entre las ranuras. Presione Entrar para abrir una publicación. Presione la barra espaciadora y luego las teclas de flecha para reprogramar.',
  'a11y.keyboard.hint.composer':
    'Presione Control y las teclas de corchete para moverse entre objetivos. Presione Control y yo para pasar al siguiente número.',
  'a11y.keyboard.hint.dialog': 'Presione Escape para cerrar.',
  'a11y.keyboard.shortcutsTitle': 'Atajos de teclado',

  'a11y.table.alternative': 'Vista de tabla',
  'a11y.table.alternativeHint': 'El mismo horario que una mesa ordenable.',
  'a11y.motion.reduced': 'Las animaciones se reducen debido a la configuración de su sistema.',
} as const;
