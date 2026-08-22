/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message':
    '{provider} necesita algo de texto para este tipo de publicación.',
  'validation.text_too_long.message':
    '{over, plural, one {# carácter por encima del límite for {account}} many {# caracteres por encima del límite for {account}} other {# caracteres por encima del límite for {account}}}',
  'validation.text_too_long.hint': '{provider} allows {limit} caracteres para esta cuenta.',
  'validation.text_too_short.message': '{provider} necesita least {min} caracteres aquí.',
  'validation.title_required.message': '{provider} necesita un título.',
  'validation.title_too_long.message': 'El título supera el límite de the {limit} caracteres.',
  'validation.description_too_long.message':
    'La descripción supera el límite de the {limit} caracteres.',
  'validation.media_required.message':
    '{provider} necesita al menos una imagen o vídeo para este tipo de publicación.',
  'validation.media_count_exceeded.message':
    '{provider} acepta en most {limit, plural, one {# archivo} many {# archivos} other {# archivos}} aquí. Esta publicación has {count}.',
  'validation.media_type_unsupported.message': '{provider} no accept {mimeType} archivos.',
  'validation.media_aspect_ratio_unsupported.message':
    'Este archivo is {actual}. {provider} necesita una proporción between {min} and {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Recórtelo con la plataforma preestablecida para solucionar este problema.',
  'validation.media_resolution_too_low.message':
    'Este archivo is {actual}. {provider} necesita en least {required}.',
  'validation.media_duration_too_long.message':
    'Este vídeo is {actual}. {provider} acepta hasta to {limit} para esta cuenta.',
  'validation.media_duration_too_short.message':
    'Este vídeo is {actual}. {provider} necesita en least {limit}.',
  'validation.media_file_too_large.message':
    'Este archivo is {actual}. {provider} acepta hasta to {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} no puede publicar imágenes y videos en la misma publicación.',
  'validation.alt_text_missing.message':
    'Falta el texto alternativo on {count, plural, one {# imagen} many {# imágenes} other {# imágenes}}.',
  'validation.alt_text_missing.hint': 'Describe la imagen o márcala como decorativa.',
  'validation.thumbnail_unsupported.message':
    '{provider} no acepta una miniatura personalizada aquí.',
  'validation.destination_required.message': 'Elija dónde se publica on {provider}.',
  'validation.destination_unsupported.message':
    '{destination} no acepta este tipo de publicación on {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# mención no se ha relacionado con una cuenta real} many {# menciones no se han relacionado con cuentas reales} other {# menciones no se han relacionado con cuentas reales}}.',
  'validation.mention_unresolved.hint':
    'Seleccione la cuenta de los resultados de búsqueda o elimine la mención. El texto sin formato nunca se publica como etiqueta nativa.',
  'validation.hashtag_count_exceeded.message':
    '{count} hashtags. {provider} cuenta más than {limit} como spam.',
  'validation.link_not_allowed.message': '{provider} no permite enlaces en este campo.',
  'validation.link_destination_unverified.message':
    'El enlace domain {domain} no está verificado para este espacio de trabajo.',
  'validation.privacy_setting_required.message':
    '{provider} requiere una opción de privacidad explícita antes de publicar.',
  'validation.privacy_setting_required.hint':
    'No hay ningún valor predeterminado. Elige quién puede ver esta publicación.',
  'validation.disclosure_required.message':
    'Esta publicación necesita una divulgación según las reglas del proyecto para {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} no admite un primer comentario programado para esta cuenta.',
  'validation.thread_unsupported.message': '{provider} no admite hilos para esta cuenta.',
  'validation.repeat_end_required.message':
    'Una publicación repetida necesita una fecha de finalización o varias repeticiones.',
  'validation.schedule_in_past.message': 'Ese tiempo ha pasado in {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'Esto está más adelante que the {limit} anticipación establecida para esta credencial.',
  'validation.schedule_outside_quiet_hours.message':
    'Esto cae dentro de las horas de silencio establecidas for {project}.',
  'validation.duplicate_within_window.message':
    'Contenido muy similar ya está programado o publicado for {account} within {window}.',
  'validation.blocked_term_present.message':
    'El texto contiene un término bloqueado for {project}.',
  'validation.unsupported_claim.message':
    'Este reclamo no se encuentra entre los reclamos aprobados for {project}.',
  'validation.unsupported_claim.hint':
    'Agréguelo a las afirmaciones aprobadas con evidencia o reformule la oración.',
  'validation.cadence_exceeded.message':
    '{account} sería publish {count, plural, one {# vez} many {# veces} other {# veces}} ese día, por encima del límite of {limit}.',
  'validation.connection_paused.message': '{account} está en pausa y no se publicará.',
  'validation.account_type_invalid.message':
    '{account} no es la cuenta type {provider} requiere para este tipo de publicación.',

  'validation.severity.error': 'debe arreglar',
  'validation.severity.warning': 'Mira esto',
  'validation.severity.info': 'Para tu información',
  'validation.field.required': 'Este campo es obligatorio.',
  'validation.field.tooShort':
    'Usar en least {min, plural, one {# carácter} many {# caracteres} other {# caracteres}}.',
  'validation.field.tooLong':
    'Usar en most {max, plural, one {# carácter} many {# caracteres} other {# caracteres}}.',
  'validation.field.invalidEmail': 'Ingrese una dirección de correo electrónico válida.',
  'validation.field.invalidUrl': 'Introduzca una URL completa, incluido https.',
  'validation.field.invalidDate': 'Introduzca una fecha válida.',
  'validation.field.invalidTime': 'Introduzca una hora válida.',
  'validation.field.invalidNumber': 'Introduzca un número.',
  'validation.field.outOfRange': 'Introduzca un valor between {min} and {max}.',
  'validation.field.mustMatch': 'Estos dos valores deben coincidir.',
  'validation.field.alreadyTaken': 'Eso ya está en uso.',
  'validation.field.unsafeValue': 'Ese valor no está permitido aquí.',
  'validation.media_unavailable.message':
    'Un archivo adjunto ya no está disponible. Quítalo de la publicación o vuelve a subirlo.',
  'validation.media_rights_undeclared.message':
    'Declara los derechos y el consentimiento de cada archivo adjunto antes de publicar.',
  'validation.media_not_ready.message':
    'Un archivo adjunto aún no ha pasado el procesamiento ni las comprobaciones de seguridad.',
  'validation.media_scan_blocked.message':
    'Un archivo adjunto no pasó su comprobación de seguridad y no se puede publicar.',
} as const;
