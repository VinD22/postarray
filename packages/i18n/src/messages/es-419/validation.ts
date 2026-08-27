/** Spanish (Latin America) beta catalog. B5 legal, billing and consent messages deliberately use English fallback. */
export const validationMessages = {
  'validation.text_required.message':
    '{provider}Necesita algo de texto para este tipo de publicación.',
  'validation.text_too_long.message':
    '{over, plural, one {#carácter por encima del límite para {account}} other {#caracteres por encima del límite para {account}} many {#caracteres por encima del límite para {account}}}',
  'validation.text_too_long.hint': '{provider}permite {limit}personajes para esta cuenta.',
  'validation.text_too_short.message': '{provider}necesita al menos {min}personajes aquí.',
  'validation.title_required.message': '{provider}necesita un título.',
  'validation.title_too_long.message': 'El título está sobre el {limit}límite de caracteres.',
  'validation.description_too_long.message':
    'La descripción está por encima del {limit}límite de caracteres.',
  'validation.media_required.message':
    '{provider}necesita al menos una imagen o video para este tipo de publicación.',
  'validation.media_count_exceeded.message':
    '{provider}acepta como mucho {limit, plural, one {#archivo} other {#archivos} many {#archivos}}aquí. Esta publicación tiene {count}.',
  'validation.media_type_unsupported.message': '{provider}no acepta {mimeType}archivos.',
  'validation.media_aspect_ratio_unsupported.message':
    'Este archivo es {actual}. {provider}necesita una relación entre {min}y {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Recórtelo con la plataforma preestablecida para solucionar este problema.',
  'validation.media_resolution_too_low.message':
    'Este archivo es {actual}. {provider}necesita al menos {required}.',
  'validation.media_duration_too_long.message':
    'Este vídeo es {actual}. {provider}acepta hasta {limit}para esta cuenta.',
  'validation.media_duration_too_short.message':
    'Este vídeo es {actual}. {provider}necesita al menos {limit}.',
  'validation.media_file_too_large.message':
    'Este archivo es {actual}. {provider}acepta hasta {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider}No se pueden publicar imágenes y videos en la misma publicación.',
  'validation.media_unavailable.message':
    'Un archivo adjunto ya no está disponible. Quítelo de la publicación o vuelva a subirlo.',
  'validation.alt_text_missing.message':
    'Falta el texto alternativo {count, plural, one {#imagen} other {#imágenes} many {#imágenes}}.',
  'validation.alt_text_missing.hint': 'Describe la imagen o márcala como decorativa.',
  'validation.thumbnail_unsupported.message':
    '{provider}No acepta una miniatura personalizada aquí.',
  'validation.destination_required.message': 'Elija dónde se publica esto {provider}.',
  'validation.destination_unsupported.message':
    '{destination}no acepta este tipo de publicación en {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {#la mención no se ha relacionado con una cuenta real} other {#las menciones no se han relacionado con cuentas reales} many {#las menciones no se han relacionado con cuentas reales}}.',
  'validation.mention_unresolved.hint':
    'Seleccione la cuenta de los resultados de búsqueda o elimine la mención. El texto sin formato nunca se publica como etiqueta nativa.',
  'validation.hashtag_count_exceeded.message':
    '{count}hashtags. {provider}cuenta más que {limit}como spam.',
  'validation.link_not_allowed.message': '{provider}no permite enlaces en este campo.',
  'validation.link_destination_unverified.message':
    'El dominio de enlace {domain}no está verificado para este espacio de trabajo.',
  'validation.privacy_setting_required.message':
    '{provider}requiere una elección de privacidad explícita antes de publicar.',
  'validation.privacy_setting_required.hint':
    'No hay ningún valor predeterminado. Elige quién puede ver esta publicación.',
  'validation.disclosure_required.message':
    'Esta publicación necesita una divulgación según las reglas del proyecto para {market}.',
  'validation.first_comment_unsupported.message':
    '{provider}no admite un primer comentario programado para esta cuenta.',
  'validation.thread_unsupported.message': '{provider}no admite hilos para esta cuenta.',
  'validation.repeat_end_required.message':
    'Una publicación repetida necesita una fecha de finalización o varias repeticiones.',
  'validation.schedule_in_past.message': 'Ese tiempo ha pasado {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'Las publicaciones se pueden programar con hasta {limit} de anticipación, que es también el tiempo que se conservan los archivos subidos.',
  'validation.schedule_outside_quiet_hours.message':
    'Esto cae dentro de las horas de silencio establecidas para {project}.',
  'validation.duplicate_within_window.message':
    'Contenido muy similar ya está programado o publicado para {account}dentro {window}.',
  'validation.blocked_term_present.message':
    'El texto contiene un término bloqueado para {project}.',
  'validation.unsupported_claim.message':
    'Este reclamo no está entre los reclamos aprobados para {project}.',
  'validation.unsupported_claim.hint':
    'Agréguelo a las afirmaciones aprobadas con evidencia o reformule la oración.',
  'validation.cadence_exceeded.message':
    '{account}publicaría {count, plural, one {#tiempo} other {#veces} many {#veces}}ese día, sobre el límite de {limit}.',
  'validation.connection_paused.message': '{account}está en pausa y no se publicará.',
  'validation.account_type_invalid.message':
    '{account}no es el tipo de cuenta {provider}requiere para este tipo de publicación.',
  'validation.severity.error': 'debe arreglar',
  'validation.severity.warning': 'Mira esto',
  'validation.severity.info': 'Para tu información',
  'validation.field.required': 'Este campo es obligatorio.',
  'validation.field.tooShort':
    'Utilice al menos {min, plural, one {#personaje} other {#personajes} many {#personajes}}.',
  'validation.field.tooLong':
    'Usar como máximo {max, plural, one {#personaje} other {#personajes} many {#personajes}}.',
  'validation.field.invalidEmail': 'Ingrese una dirección de correo electrónico válida.',
  'validation.field.invalidUrl': 'Introduzca una URL completa, incluido https.',
  'validation.field.invalidDate': 'Introduzca una fecha válida.',
  'validation.field.invalidTime': 'Introduzca una hora válida.',
  'validation.field.invalidNumber': 'Introduzca un número.',
  'validation.field.outOfRange': 'Introduzca un valor entre {min}y {max}.',
  'validation.field.mustMatch': 'Estos dos valores deben coincidir.',
  'validation.field.alreadyTaken': 'Eso ya está en uso.',
  'validation.field.unsafeValue': 'Ese valor no está permitido aquí.',
} as const;
