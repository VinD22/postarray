/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Calendario',
  'calendar.view.day': 'dia',
  'calendar.view.week': 'Semana',
  'calendar.view.month': 'Mes',
  'calendar.view.list': 'Lista',
  'calendar.view.label': 'Vista de calendario',
  'calendar.today': 'hoy',
  'calendar.goToDate': 'ir a la cita',
  'calendar.previousPeriod': 'Periodo anterior',
  'calendar.nextPeriod': 'Próximo período',
  'calendar.timeZoneNote': 'Los tiempos se muestran in {timeZone}.',
  'calendar.weekOf': 'Semana of {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount':
    '{count, plural, =0 {Nada programado} one {# publicación} many {# publicaciones} other {# publicaciones}}',
  'calendar.slotOverflow': '{count, plural, one {# más} many {# más} other {# más}}',
  'calendar.newPostAt': 'Nueva publicación at {time}',

  'calendar.filter.project': 'Project',
  'calendar.filter.account': 'cuenta',
  'calendar.filter.platform': 'Plataforma',
  'calendar.filter.status': 'Estado',
  'calendar.filter.locale': 'Idioma del contenido',
  'calendar.filter.campaign': 'Campaña',
  'calendar.filter.applied':
    '{count, plural, one {# filtro aplicado} many {# filtros aplicados} other {# filtros aplicados}}',

  'calendar.drag.instructions':
    'Arrastra una publicación a un nuevo espacio o selecciónala y usa las teclas de flecha para moverla.',
  'calendar.drag.confirmTitle': '¿Mover esta publicación?',
  'calendar.drag.confirmBody': 'From {from} to {to} in {timeZone}.',
  'calendar.drag.dstNotice':
    'Los relojes cambian entre estas horas in {timeZone}. La nueva hora is {utc} UTC.',
  'calendar.drag.publishedNotice':
    'Esta publicación ya está publicada. Al moverlo, solo se cambia el registro local. Publicarlo nuevamente es una acción separada.',
  'calendar.drag.conflictNotice':
    '{account} ya has {count, plural, one {# publicación} many {# publicaciones} other {# publicaciones}} dentro de una hora de la nueva hora.',

  'calendar.queue.title': 'cola',
  'calendar.queue.upcoming': 'Próximo',
  'calendar.queue.needsApproval': 'Esperando aprobación',
  'calendar.queue.drafts': 'Borradores',
  'calendar.queue.published': 'Publicado',
  'calendar.queue.failed': 'Fallido',
  'calendar.queue.nextSlot': 'Siguiente espacio libre is {time}.',

  'calendar.post.publishesAt': 'Publishes {time} in {timeZone}',
  'calendar.post.publishedAt': 'Published {time}',
  'calendar.post.targetCount': '{count, plural, one {# cuenta} many {# cuentas} other {# cuentas}}',
  'calendar.post.mediaType.text': 'Texto',
  'calendar.post.mediaType.image': 'Imagen',
  'calendar.post.mediaType.carousel': 'carrusel',
  'calendar.post.mediaType.video': 'Vídeo',
  'calendar.post.mediaType.document': 'Documento',

  'actionCenter.title': 'centro de acción',
  'actionCenter.description': 'Todo lo que necesita una decisión o una solución, en una sola cola.',
  'actionCenter.empty': 'Nada necesita atención en este momento.',
  'actionCenter.item.connectionExpiring':
    'Es necesario volver a conectar {account} before {date} o las publicaciones programadas fallarán.',
  'actionCenter.item.connectionActionRequired':
    '{account} necesita atención on {provider} antes de poder publicar nuevamente.',
  'actionCenter.item.validationFailed':
    'Un borrador for {account} no tiene pass {provider} validación.',
  'actionCenter.item.approvalOverdue':
    'Una solicitud de aprobación ha estado esperando since {date}.',
  'actionCenter.item.scheduleConflict':
    '{account} tiene publicaciones programadas muy juntas on {date}.',
  'actionCenter.item.providerIncident':
    '{provider} informa un problema. Las publicaciones programadas se volverán a intentar.',
  'actionCenter.item.commentFailed':
    'La publicación principal se publicó, pero el elemento de seguimiento for {account} falló.',
  'actionCenter.item.analyticsStale': 'Analytics for {account} no ha actualizado since {date}.',
  'actionCenter.item.rssStalled': 'El feed {name} no ha devuelto un artículo válido since {date}.',
  'actionCenter.item.webhookFailing':
    'Las entregas to {endpoint} tienen failed {count, plural, one {# vez} many {# veces} other {# veces}} seguidas.',
  'actionCenter.item.usageBalance':
    'Una acción medida for {provider} necesita un equilibrio de uso antes de poder ejecutarse.',

  'approval.title': 'Aprobaciones',
  'approval.requestTitle': 'Solicitud de aprobación',
  'approval.requestedBy': 'Solicitado by {name} {relativeTime}',
  'approval.requestedFrom': 'Esperando on {name}',
  'approval.policy.none': 'No se requiere aprobación para estos objetivos.',
  'approval.policy.anyApprover': 'Cualquier aprobador puede aprobar esto.',
  'approval.policy.namedApprover': '{name} debe aprobar esto.',
  'approval.policy.everyApprover': 'Cada aprobador debe aprobar esto.',
  'approval.decision.approvedBy': 'Aprobado by {name} on {date}',
  'approval.decision.rejectedBy': 'Rechazado by {name} on {date}',
  'approval.decision.changesRequestedBy': 'Cambios solicitados by {name} on {date}',
  'approval.comment.label': 'Nota para el autor',
  'approval.comment.placeholder': 'Diga qué necesita cambiar y por qué.',
  'approval.reapproval.needed':
    'Esta publicación cambió después de la aprobación. Necesita aprobación nuevamente antes de poder publicar.',
  'approval.reapproval.reason.content': 'El contenido cambió.',
  'approval.reapproval.reason.account': 'Las cuentas objetivo cambiaron.',
  'approval.reapproval.reason.media': 'Los medios cambiaron.',
  'approval.reapproval.reason.schedule': 'La hora de publicación cambió.',
  'approval.reapproval.reason.privacy': 'La configuración de privacidad o divulgación cambió.',
  'approval.reapproval.reason.locale': 'El idioma del contenido cambió.',
  'approval.expiresAt': 'Esta solicitud caduca el on {date}.',
} as const;
