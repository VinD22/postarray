/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 *
 * Three features that all answer "who is this going to, and when", grouped in
 * one namespace so their vocabulary stays consistent. The hold copy is the part
 * most worth reading twice: pausing stops work that has not happened, and every
 * sentence here has to say that plainly rather than implying a post can be
 * pulled back off a platform.
 */
export const postingSetMessages = {
  /* ------------------------------------------------------------- the hold */
  'calendar.hold.action': 'Pausar',
  'calendar.hold.resumeAction': 'Reanudar',
  'calendar.hold.badge': 'Pausada',
  'calendar.hold.badgeBilling': 'Pausada por facturación',
  'calendar.hold.term': 'Retención',
  'calendar.hold.byPerson': 'Pausaste esto el {date}.',
  'calendar.hold.byBilling':
    'Se pausó el {date} porque este espacio de trabajo perdió el acceso completo.',
  'calendar.hold.none': 'Sin pausar',

  'calendar.hold.confirmTitle': '¿Pausar esta publicación?',
  'calendar.hold.confirmBody':
    'Esta publicación se quedará donde está y no saldrá a las {time}. Puedes reanudarla en cualquier momento antes de esa hora, o elegir una nueva hora si esa ya pasó.',
  'calendar.hold.confirmScope':
    'Pausar detiene lo que aún no ha pasado. Todo lo que ya se publicó en una plataforma sigue publicado, y pausar no lo elimina ni lo edita.',
  'calendar.hold.confirmNoteLabel': '¿Por qué estás pausando esto? (opcional)',
  'calendar.hold.confirmNoteHint':
    'Se guarda en el registro de auditoría de tu equipo. No se envía a ninguna plataforma.',
  'calendar.hold.confirm': 'Pausar esta publicación',
  'calendar.hold.cancel': 'Dejarla programada',

  'calendar.hold.resumeTitle': '¿Reanudar esta publicación?',
  'calendar.hold.resumeBody': 'Saldrá a las {time}, en {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'Esa hora ya pasó',
  'calendar.hold.resumeMissedBody':
    'Esta publicación debía salir a las {time} mientras estaba pausada. Elige una nueva hora para que no salga en el momento en que la reanudes.',
  'calendar.hold.resumeTimeLabel': 'Nueva hora de publicación',
  'calendar.hold.resumeConfirm': 'Reanudar',

  'calendar.hold.paused': 'Pausada. No saldrá hasta que la reanudes.',
  'calendar.hold.resumed': 'Reanudada. Saldrá a las {time}.',

  'calendar.hold.blocked.published':
    'Esta publicación ya salió. Pausarla no puede retirarla de la plataforma.',
  'calendar.hold.blocked.inFlight':
    'Esta publicación se está enviando en este momento. Es demasiado tarde para pausarla, y detenerla a mitad de camino podría dejarla publicada solo a medias.',
  'calendar.hold.blocked.finished': 'Esta publicación ya terminó, así que no hay nada que pausar.',
  'calendar.hold.blocked.billing':
    'Esta publicación está en espera porque el espacio de trabajo perdió el acceso completo. Reanudarla es un asunto de facturación, no de programación.',
  'calendar.hold.blocked.billingAction': 'Ir a facturación',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Conjuntos de publicación',
  'set.lede':
    'Una respuesta guardada a "a quién le estoy publicando esto, y cómo". Aplicar un Conjunto copia su configuración en un nuevo borrador.',
  'set.appliedOnce':
    'Un Conjunto se lee una sola vez, cuando lo aplicas. Editarlo después cambia lo que la próxima publicación toma como punto de partida. Los borradores y publicaciones programadas que ya creaste a partir de él se quedan exactamente como están.',
  'set.empty.title': 'Aún no hay Conjuntos',
  'set.empty.body':
    'Crea uno para dejar de reconstruir la misma lista de cuentas en cada publicación.',
  'set.create': 'Nuevo Conjunto',
  'set.edit': 'Editar Conjunto',
  'set.archive': 'Archivar Conjunto',
  'set.archived': 'Archivado',
  'set.archivedNote':
    'Los Conjuntos archivados se ocultan del selector. Las publicaciones hechas a partir de ellos no cambian.',
  'set.showArchived': 'Mostrar archivados',
  'set.saved': 'Conjunto guardado.',
  'set.archivedToast': 'Conjunto archivado. Las publicaciones ya hechas a partir de él no cambian.',

  'set.field.name': 'Nombre',
  'set.field.nameHint': 'Lo que buscarás en el selector. Uno por proyecto.',
  'set.field.description': 'Descripción',
  'set.field.descriptionHint': 'Opcional. Para qué sirve este Conjunto.',
  'set.field.targets': 'Cuentas',
  'set.field.targetsHint':
    'Cada cuenta con la que empieza una publicación creada a partir de este Conjunto.',
  'set.field.targetCount':
    '{count, plural, =0 {Sin cuentas} one {#cuenta} other {#cuentas} many {#cuentas}}',
  'set.field.signature': 'Firma',
  'set.field.signatureNone': 'Sin firma',
  'set.field.approval': 'Aprobación',
  'set.field.approvalHint':
    'La aprobación que necesita una publicación creada a partir de este Conjunto antes de poder publicarse.',
  'set.field.schedule': 'Cuándo publicar',

  'set.approval.none': 'No se necesita aprobación',
  'set.approval.single_approver': 'Un aprobador nombrado',
  'set.approval.any_approver': 'Cualquier aprobador',
  'set.approval.named_approver': 'Un aprobador específico',
  'set.approval.policy_auto': 'Lo que indique la política del espacio de trabajo',

  'set.slot.next_free_slot': 'Próximo horario libre de la cola',
  'set.slot.next_free_slotHint':
    'Usa las reglas de cola de este proyecto para ofrecer una hora. Propone; tú aceptas.',
  'set.slot.pick_time': 'Pídeme una hora',
  'set.slot.pick_timeHint': 'Aplicar el Conjunto deja la hora en blanco para que tú la elijas.',
  'set.slot.draft_only': 'Dejarlo como borrador',
  'set.slot.draft_onlyHint': 'Aplicar el Conjunto no toca el horario en absoluto.',
  'set.slot.noRules':
    'Este proyecto aún no tiene reglas de cola, así que la cola ofrecerá la primera hora libre y lo indicará.',
  'set.slot.rulesLink': 'Reglas de la cola',

  'set.defaults.title': 'Valores predeterminados por plataforma',
  'set.defaults.body':
    'Valores iniciales que se copian en cada nueva publicación. Puedes cambiar cualquiera de ellos después en el compositor.',
  'set.defaults.add': 'Agregar una plataforma',
  'set.defaults.remove': 'Quitar los valores predeterminados de {platform}',
  'set.defaults.privacy': 'Privacidad',
  'set.defaults.privacyNone': 'Valor predeterminado de la plataforma',
  'set.defaults.bodyPrefix': 'Texto antes de la publicación',
  'set.defaults.bodySuffix': 'Texto después de la publicación',
  'set.defaults.requireAltText': 'Exigir texto alternativo en cada imagen',
  'set.defaults.requireAltTextHint':
    'Una publicación creada a partir de este Conjunto no se puede programar para esta plataforma hasta que cada imagen tenga texto alternativo.',
  'set.defaults.empty':
    'Sin valores predeterminados por plataforma. Cada cuenta parte de la publicación principal.',

  'set.error.nameTaken': 'Otro Conjunto en este proyecto ya usa ese nombre.',
  'set.error.archived': 'Este Conjunto está archivado. Restáuralo antes de editarlo.',
  'set.error.duplicateTarget': 'Esa cuenta ya está en este Conjunto.',
  'set.error.duplicatePlatform':
    'Este Conjunto ya tiene valores predeterminados para esa plataforma.',

  /* --------------------------------------------------- remembered targets */
  'targetMemory.setting.title': 'Recordar cuentas entre publicaciones',
  'targetMemory.setting.body':
    'Cuando esto está activado, el compositor inicia cada nueva publicación con las cuentas que esa persona eligió la última vez en este proyecto. Está desactivado a menos que tú lo actives.',
  'targetMemory.setting.stored':
    'Solo se guarda la lista de cuentas, y solo para la persona que las eligió. No se guarda ningún texto, hora, ajuste de privacidad ni estado de aprobación, y nadie más en el proyecto puede ver tu lista.',
  'targetMemory.setting.offNote':
    'Mientras esto está desactivado, no se guarda absolutamente nada.',
  'targetMemory.setting.turnOffWarning':
    'Desactivar esto elimina cada selección guardada en este proyecto, para todos.',
  'targetMemory.setting.enabled': 'Activado',
  'targetMemory.setting.disabled': 'Desactivado',
  'targetMemory.setting.saved': 'Configuración guardada.',
  'targetMemory.setting.cleared':
    'Configuración guardada. Se eliminaron las selecciones guardadas en este proyecto.',

  'targetMemory.composer.restored':
    '{count, plural, one {Se inició con #cuenta de la última vez.} other {Se inició con #cuentas de la última vez.} many {Se inició con #cuentas de la última vez.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {#cuenta que usaste la última vez se dejó fuera porque necesita atención.} other {#cuentas que usaste la última vez se dejaron fuera porque necesitan atención.} many {#cuentas que usaste la última vez se dejaron fuera porque necesitan atención.}}',
  'targetMemory.composer.droppedAll':
    'Ninguna de las cuentas que usaste la última vez está disponible ahora, así que no se preseleccionó nada.',
  'targetMemory.composer.undo': 'Borrar selección',
  'targetMemory.composer.forget': 'Dejar de recordar mis cuentas',
  'targetMemory.composer.forgotten': 'Se eliminó tu selección guardada.',
  'targetMemory.composer.reviewAccounts': 'Revisar cuentas',
} as const;
