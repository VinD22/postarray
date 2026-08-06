/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Recibo de publicación',
  'receipt.subtitle': 'Exactamente qué se publicó, dónde, cuándo y con la aprobación de quién.',
  'receipt.target': '{account} on {provider}',
  'receipt.externalId': 'ID de publicación externa',
  'receipt.permalink': 'Enlace permanente',
  'receipt.permalinkUnavailable':
    '{provider} no devuelve un enlace permanente para este tipo de publicación.',
  'receipt.contentVersion': 'Versión del contenido',
  'receipt.contentHash': 'Suma de comprobación de contenido',
  'receipt.mediaVersion': 'Versión multimedia',
  'receipt.idempotencyKey': 'Referencia de idempotencia',
  'receipt.correlationId': 'Referencia de correlación',

  'receipt.surface.label': 'Creado a partir de',
  'receipt.surface.web': 'aplicación web',
  'receipt.surface.api': 'API DESCANSO',
  'receipt.surface.mcp': 'servidor MCP',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'publicación automática RSS',
  'receipt.surface.automation': 'regla de automatización',
  'receipt.surface.webhook': 'Webhook entrante',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Servicio account {name}',
  'receipt.actor.oauthApp': '{app} actuando for {name}',
  'receipt.actor.system': 'Relay',

  'receipt.timeline.title': 'Línea de tiempo',
  'receipt.timeline.created': 'Borrador creado by {actor}',
  'receipt.timeline.approvalRequested': 'Aprobación solicitada from {approver}',
  'receipt.timeline.approved': 'Aprobado by {actor} en policy {policy}',
  'receipt.timeline.scheduled': 'Programado for {local} in {timeZone}',
  'receipt.timeline.revalidated':
    'Se volvieron a verificar las credenciales y los límites de la plataforma',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# archivo preparado para la plataforma} many {# archivos preparados para la plataforma} other {# archivos preparados para la plataforma}}',
  'receipt.timeline.dispatched': 'Enviado to {provider}',
  'receipt.timeline.providerAccepted': '{provider} aceptó la publicación',
  'receipt.timeline.providerProcessing': '{provider} todavía está procesando los medios',
  'receipt.timeline.published': 'Publicado as {externalId}',
  'receipt.timeline.commentPublished': 'Seguimiento item {position} publicado',
  'receipt.timeline.retryScheduled': 'Retry {attempt} programado for {time}',
  'receipt.timeline.failed': 'Attempt {attempt} falló',
  'receipt.timeline.canceled': 'Cancelado by {actor}',
  'receipt.timeline.analyticsSynced': 'Análisis sincronizados',
  'receipt.timeline.deletedExternally': 'La publicación ya no es on {provider}',

  'receipt.times.scheduled': 'hora programada',
  'receipt.times.dispatched': 'tiempo de envío',
  'receipt.times.published': 'Hora de publicación',
  'receipt.times.latency': 'Dispatched {duration} después de la hora programada.',

  'receipt.attempts.title': 'Intentos',
  'receipt.attempts.count': '{count, plural, one {# intento} many {# intentos} other {# intentos}}',
  'receipt.attempts.classification': 'Clasificación',
  'receipt.attempts.providerResponse': 'Respuesta del proveedor',
  'receipt.attempts.responseRedacted':
    'La respuesta del proveedor se almacena con tokens y datos personales eliminados.',
  'receipt.attempts.remediation': '¿Qué hacer a continuación?',

  'receipt.cost.estimated': 'Estimated {amount}',
  'receipt.cost.actual': 'Reconciled {amount}',
  'receipt.cost.pending': 'El uso real aún no se ha conciliado.',

  'receipt.partial.title': 'Publicado parcialmente',
  'receipt.partial.body':
    '{published, plural, one {# objetivos publicados} many {# objetivos publicados} other {# objetivos publicados}}. {failed, plural, one {# objetivo fallido} many {# objetivos fallidos} other {# objetivos fallidos}}. Las publicaciones publicadas aún existen en la plataforma.',
  'receipt.partial.doNotRollback':
    'No eliminamos una publicación que ya se publicó. Bórralo de la plataforma si eso es lo que quieres.',

  'receipt.export.title': 'Comparte este recibo',
  'receipt.export.pdf': 'Descargar como PDF',
  'receipt.export.json': 'Descargar como JSON',
  'receipt.export.permissionNote':
    'Sólo los propietarios, administradores y aprobadores pueden compartir un recibo.',

  'receipt.analytics.lastSync': 'Análisis de las últimas synced {relativeTime}.',
  'receipt.analytics.nextSync': 'Siguiente sincronización around {time}.',
} as const;
