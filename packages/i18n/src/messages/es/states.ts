/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Borrador',
  'state.draft.description':
    'Solo las personas en este espacio de trabajo pueden verlo. No hay nada programado.',
  'state.validation_needed.label': 'Validación necesaria',
  'state.validation_needed.description':
    'Uno o más objetivos tienen un problema que debe solucionarse antes de poder programarlo.',
  'state.approval_requested.label': 'Aprobación solicitada',
  'state.approval_requested.description': 'Esperando for {approver} para decidir.',
  'state.approved.label': 'Aprobado',
  'state.approved.description': 'Aprobado by {approver}. Ahora se puede programar o publicar.',
  'state.scheduled.label': 'Programado',
  'state.scheduled.description': 'Publishes {time} in {timeZone}.',
  'state.preparing_media.label': 'Preparando medios',
  'state.preparing_media.description': 'Carga y conversión de archivos para la plataforma.',
  'state.dispatching.label': 'Despacho',
  'state.dispatching.description': 'Enviando to {provider} ahora.',
  'state.provider_processing.label': 'Procesamiento de proveedores',
  'state.provider_processing.description':
    '{provider} aceptó la carga y aún la está procesando. Confirmamos cuando esté en vivo.',
  'state.published.label': 'Publicado',
  'state.published.description': 'En vivo on {provider} since {time}.',
  'state.partially_published.label': 'Publicado parcialmente',
  'state.partially_published.description':
    '{published, plural, one {# objetivo publicado} many {# objetivos publicados} other {# objetivos publicados}}, {failed, plural, one {# falló} many {# falló} other {# falló}}. Las publicaciones publicadas están activas y no fueron revertidas.',
  'state.action_required.label': 'Acción requerida',
  'state.action_required.description': 'Esto no puede continuar hasta que hagas algo.',
  'state.retry_scheduled.label': 'Reintento programado',
  'state.retry_scheduled.description':
    'Attempt {attempt} of {max} ejecutará at {time}. Nada está duplicado.',
  'state.failed_permanently.label': 'Fallido',
  'state.failed_permanently.description':
    'Esto no se volverá a intentar. Su contenido se conserva y el motivo está en el recibo.',
  'state.canceled.label': 'Cancelado',
  'state.canceled.description': 'Cancelado by {actor} on {date}. No se publicó nada.',
  'state.deleted_externally.label': 'Eliminado en la plataforma',
  'state.deleted_externally.description':
    'Esta publicación ya no es on {provider}. Se conservan el recibo y las métricas recopiladas antes de su envío.',

  'state.approval.not_required.label': 'No se necesita aprobación',
  'state.approval.not_required.description':
    'La política para estos objetivos no requiere aprobación.',
  'state.approval.requested.label': 'Solicitado',
  'state.approval.requested.description': 'Enviado to {approver} {relativeTime}.',
  'state.approval.in_review.label': 'En revisión',
  'state.approval.in_review.description': '{approver} está mirando esto ahora.',
  'state.approval.approved.label': 'Aprobado',
  'state.approval.approved.description': 'Aprobado by {approver} on {date}.',
  'state.approval.changes_requested.label': 'Cambios solicitados',
  'state.approval.changes_requested.description': '{approver} solicitó cambios on {date}.',
  'state.approval.rejected.label': 'Rechazado',
  'state.approval.rejected.description': 'Rechazado by {approver} on {date}.',
  'state.approval.expired.label': 'Caducado',
  'state.approval.expired.description': 'Esta solicitud expiró on {date} sin una decisión.',
  'state.approval.withdrawn.label': 'Retirado',
  'state.approval.withdrawn.description': 'El autor retiró esta solicitud on {date}.',

  'state.summary.targets':
    '{ready, plural, one {# objetivo listo} many {# objetivos listos} other {# objetivos listos}}, {blocked, plural, =0 {ninguno bloqueado} one {# bloqueado} many {# bloqueado} other {# bloqueado}}',
  'state.changedAt': 'Changed {relativeTime}',
} as const;
