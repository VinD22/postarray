/** Spanish (Latin America) beta catalog. B5 legal, billing and consent messages deliberately use English fallback. */
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
  'calendar.timeZoneNote': 'Los tiempos se muestran en {timeZone}.',
  'calendar.weekOf': 'Semana de {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount':
    '{count, plural, =0 {Nada programado} one {#publicar} other {#publicaciones} many {#publicaciones}}',
  'calendar.slotOverflow': '{count, plural, one {#más} other {#más} many {#más}}',
  'calendar.newPostAt': 'Nueva publicación en {time}',
  'calendar.filter.brand': 'Brand',
  'calendar.filter.account': 'cuenta',
  'calendar.filter.platform': 'Plataforma',
  'calendar.filter.status': 'Estado',
  'calendar.filter.locale': 'Idioma del contenido',
  'calendar.filter.campaign': 'Campaña',
  'calendar.filter.applied':
    '{count, plural, one {#filtro aplicado} other {#filtros aplicados} many {#filtros aplicados}}',
  'calendar.drag.instructions':
    'Arrastra una publicación a un nuevo espacio o selecciónala y usa las teclas de flecha para moverla.',
  'calendar.drag.confirmTitle': '¿Mover esta publicación?',
  'calendar.drag.confirmBody': 'De {from}a {to}en {timeZone}.',
  'calendar.drag.dstNotice':
    'Los relojes cambian entre estos tiempos en{timeZone}. El nuevo tiempo es {utc}hora UTC.',
  'calendar.drag.publishedNotice':
    'Esta publicación ya está publicada. Al moverlo, solo se cambia el registro local. Publicarlo nuevamente es una acción separada.',
  'calendar.drag.conflictNotice':
    '{account}ya tiene {count, plural, one {#publicar} other {#publicaciones} many {#publicaciones}}dentro de una hora de la nueva hora.',
  'calendar.queue.title': 'cola',
  'calendar.queue.upcoming': 'Próximo',
  'calendar.queue.needsApproval': 'Esperando aprobación',
  'calendar.queue.drafts': 'Borradores',
  'calendar.queue.published': 'Publicado',
  'calendar.queue.failed': 'Fallido',
  'calendar.queue.nextSlot': 'El siguiente espacio libre es {time}.',
  'calendar.post.publishesAt': 'Publica {time}en {timeZone}',
  'calendar.post.publishedAt': 'Publicado {time}',
  'calendar.post.targetCount': '{count, plural, one {#cuenta} other {#cuentas} many {#cuentas}}',
  'calendar.post.mediaType.text': 'Texto',
  'calendar.post.mediaType.image': 'Imagen',
  'calendar.post.mediaType.carousel': 'carrusel',
  'calendar.post.mediaType.video': 'Vídeo',
  'calendar.post.mediaType.document': 'Documento',
  'actionCenter.title': 'centro de acción',
  'actionCenter.description': 'Todo lo que necesita una decisión o una solución, en una sola cola.',
  'actionCenter.empty': 'Nada necesita atención en este momento.',
  'actionCenter.item.connectionExpiring':
    '{account}necesita ser reconectado antes {date}o las publicaciones programadas fallarán.',
  'actionCenter.item.connectionActionRequired':
    '{account}necesita atención en {provider}antes de que pueda publicarse nuevamente.',
  'actionCenter.item.validationFailed': 'un borrador para {account}no pasa {provider}validación.',
  'actionCenter.item.approvalOverdue':
    'Una solicitud de aprobación ha estado esperando desde {date}.',
  'actionCenter.item.scheduleConflict':
    '{account}tiene publicaciones programadas muy juntas el {date}.',
  'actionCenter.item.providerIncident':
    '{provider}está informando un problema. Las publicaciones programadas se volverán a intentar.',
  'actionCenter.item.commentFailed':
    'La publicación principal publicada, pero un elemento de seguimiento para {account}falló.',
  'actionCenter.item.analyticsStale': 'Análisis para {account}no he actualizado desde {date}.',
  'actionCenter.item.rssStalled':
    'la alimentación {name}no ha devuelto un artículo válido desde {date}.',
  'actionCenter.item.webhookFailing':
    'Entregas a {endpoint}han fallado {count, plural, one {#tiempo} other {#veces} many {#veces}}en una fila.',
  'actionCenter.item.usageBalance':
    'Una acción medida para {provider}necesita un equilibrio de uso antes de poder ejecutarse.',
  'approval.title': 'Aprobaciones',
  'approval.requestTitle': 'Solicitud de aprobación',
  'approval.requestedBy': 'Solicitado por {name} {relativeTime}',
  'approval.requestedFrom': 'esperando {name}',
  'approval.policy.none': 'No se requiere aprobación para estos objetivos.',
  'approval.policy.anyApprover': 'Cualquier aprobador puede aprobar esto.',
  'approval.policy.namedApprover': '{name}debe aprobar esto.',
  'approval.policy.everyApprover': 'Cada aprobador debe aprobar esto.',
  'approval.decision.approvedBy': 'Aprobado por {name}en {date}',
  'approval.decision.rejectedBy': 'Rechazado por {name}en {date}',
  'approval.decision.changesRequestedBy': 'Cambios solicitados por {name}en {date}',
  'approval.comment.label': 'Nota para el autor',
  'approval.comment.placeholder': 'Diga qué necesita cambiar y por qué.',
  'approval.reapproval.needed':
    'Esta publicación cambió después de la aprobación. Necesita aprobación nuevamente antes de poder publicar.',
  'approval.reapproval.reason.content': 'El contenido cambió.',
  'approval.reapproval.reason.account': 'Las cuentas objetivo cambiaron.',
  'approval.reapproval.reason.media': 'Los medios cambiaron.',
  'approval.reapproval.reason.schedule': 'La hora de publicación cambió.',
  'approval.reapproval.reason.locale': 'El idioma del contenido cambió.',
  'approval.expiresAt': 'Esta solicitud vence el {date}.',
} as const;
