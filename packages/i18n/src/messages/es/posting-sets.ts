export const postingSetMessages = {
  /* ------------------------------------------------------------- la pausa */
  'calendar.hold.action': 'Pausar',
  'calendar.hold.resumeAction': 'Reanudar',
  'calendar.hold.badge': 'Pausado',
  'calendar.hold.badgeBilling': 'Pausado por facturación',
  'calendar.hold.term': 'Pausa',
  'calendar.hold.byPerson': 'Pausado por ti el {date}.',
  'calendar.hold.byBilling': 'Pausado el {date} porque este workspace perdió el acceso completo.',
  'calendar.hold.none': 'No pausado',

  'calendar.hold.confirmTitle': '¿Pausar esta publicación?',
  'calendar.hold.confirmBody':
    'Esta publicación se quedará donde está y no saldrá a las {time}. Puedes reanudarla en cualquier momento antes de eso, o elegir un nuevo horario si ya pasó.',
  'calendar.hold.confirmScope':
    'Pausar detiene lo que aún no ha ocurrido. Todo lo que ya se publicó en una plataforma sigue publicado, y pausar no lo elimina ni lo edita.',
  'calendar.hold.confirmNoteLabel': '¿Por qué estás pausando esto? (opcional)',
  'calendar.hold.confirmNoteHint':
    'Se guarda en el registro de auditoría de tu equipo. No se envía a ninguna plataforma.',
  'calendar.hold.confirm': 'Pausar esta publicación',
  'calendar.hold.cancel': 'Dejarla programada',

  'calendar.hold.resumeTitle': '¿Reanudar esta publicación?',
  'calendar.hold.resumeBody': 'Saldrá a las {time}, en {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'Ese horario ya pasó',
  'calendar.hold.resumeMissedBody':
    'Esta publicación estaba prevista para las {time} mientras estaba pausada. Elige un nuevo horario para que no salga en el momento en que la reanudes.',
  'calendar.hold.resumeTimeLabel': 'Nuevo horario de publicación',
  'calendar.hold.resumeConfirm': 'Reanudar',

  'calendar.hold.paused': 'Pausado. No saldrá hasta que lo reanudes.',
  'calendar.hold.resumed': 'Reanudado. Saldrá a las {time}.',

  'calendar.hold.blocked.published':
    'Esta publicación ya salió. Pausar no puede retirarla de la plataforma.',
  'calendar.hold.blocked.inFlight':
    'Esta publicación se está enviando ahora mismo. Es demasiado tarde para pausarla, y detenerla a la mitad podría dejarla publicada solo parcialmente.',
  'calendar.hold.blocked.finished': 'Esta publicación ya terminó, así que no hay nada que pausar.',
  'calendar.hold.blocked.billing':
    'Esta publicación está en pausa porque el workspace perdió el acceso completo. Reanudarla es un asunto de facturación, no de programación.',
  'calendar.hold.blocked.billingAction': 'Ir a facturación',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Posting Sets',
  'set.lede':
    'Una respuesta guardada a "a quién le estoy publicando esto, y cómo". Aplicar un Set copia su configuración en un nuevo borrador.',
  'set.appliedOnce':
    'Un Set se lee una vez, cuando lo aplicas. Editarlo después cambia con qué empieza la siguiente publicación. Los borradores y publicaciones programadas que ya creaste a partir de él quedan exactamente como están.',
  'set.empty.title': 'Todavía no hay Sets',
  'set.empty.body': 'Crea uno para dejar de reconstruir la misma lista de cuentas en cada publicación.',
  'set.create': 'Nuevo Set',
  'set.edit': 'Editar Set',
  'set.archive': 'Archivar Set',
  'set.archived': 'Archivado',
  'set.archivedNote': 'Los Sets archivados quedan ocultos en el selector. Las publicaciones hechas a partir de ellos no cambian.',
  'set.showArchived': 'Mostrar archivados',
  'set.saved': 'Set guardado.',
  'set.archivedToast': 'Set archivado. Las publicaciones ya creadas a partir de él no cambian.',

  'set.field.name': 'Nombre',
  'set.field.nameHint': 'Lo que buscarás en el selector. Uno por proyecto.',
  'set.field.description': 'Descripción',
  'set.field.descriptionHint': 'Opcional. Para qué sirve este Set.',
  'set.field.targets': 'Cuentas',
  'set.field.targetsHint': 'Toda cuenta con la que empieza una publicación hecha a partir de este Set.',
  'set.field.targetCount': '{count, plural, =0 {Ninguna cuenta} one {# cuenta} many {# cuentas} other {# cuentas}}',
  'set.field.signature': 'Firma',
  'set.field.signatureNone': 'Sin firma',
  'set.field.approval': 'Aprobación',
  'set.field.approvalHint': 'La aprobación que necesita una publicación hecha a partir de este Set antes de poder publicarse.',
  'set.field.schedule': 'Cuándo publicar',

  'set.approval.none': 'No hace falta aprobación',
  'set.approval.single_approver': 'Un aprobador designado',
  'set.approval.any_approver': 'Cualquier aprobador',
  'set.approval.named_approver': 'Un aprobador específico',
  'set.approval.policy_auto': 'Lo que diga la política del workspace',

  'set.slot.next_free_slot': 'Próximo horario libre de la cola',
  'set.slot.next_free_slotHint':
    'Usa las reglas de cola de este proyecto para ofrecer un horario. Ella propone; tú aceptas.',
  'set.slot.pick_time': 'Pídeme un horario',
  'set.slot.pick_timeHint': 'Aplicar el Set deja el horario en blanco para que tú lo elijas.',
  'set.slot.draft_only': 'Dejarlo como borrador',
  'set.slot.draft_onlyHint': 'Aplicar el Set no toca la programación en absoluto.',
  'set.slot.noRules':
    'Este proyecto todavía no tiene reglas de cola, así que la cola ofrecerá la primera hora libre y lo dirá.',
  'set.slot.rulesLink': 'Reglas de cola',

  'set.defaults.title': 'Valores predeterminados por plataforma',
  'set.defaults.body':
    'Valores iniciales copiados en cada nueva publicación. Puedes cambiar cualquiera de ellos en el compositor después.',
  'set.defaults.add': 'Agregar una plataforma',
  'set.defaults.remove': 'Quitar los valores predeterminados de {platform}',
  'set.defaults.privacy': 'Privacidad',
  'set.defaults.privacyNone': 'Predeterminado de la plataforma',
  'set.defaults.bodyPrefix': 'Texto antes de la publicación',
  'set.defaults.bodySuffix': 'Texto después de la publicación',
  'set.defaults.requireAltText': 'Exigir texto alternativo en toda imagen',
  'set.defaults.requireAltTextHint':
    'Una publicación hecha a partir de este Set no se puede programar para esta plataforma hasta que toda imagen tenga texto alternativo.',
  'set.defaults.empty': 'Sin valores predeterminados por plataforma. Toda cuenta parte de la publicación maestra.',

  'set.error.nameTaken': 'Otro Set en este proyecto ya usa ese nombre.',
  'set.error.archived': 'Este Set está archivado. Restáuralo antes de editarlo.',
  'set.error.duplicateTarget': 'Esa cuenta ya está en este Set.',
  'set.error.duplicatePlatform': 'Este Set ya tiene valores predeterminados para esa plataforma.',

  /* --------------------------------------------------- cuentas recordadas */
  'targetMemory.setting.title': 'Recordar cuentas entre publicaciones',
  'targetMemory.setting.body':
    'Cuando esto está activado, el compositor empieza cada nueva publicación con las cuentas que esa persona eligió la última vez en este proyecto. Está desactivado a menos que lo actives.',
  'targetMemory.setting.stored':
    'Solo se guarda la lista de cuentas, y solo para la persona que las eligió. No se guarda ninguna leyenda, horario, configuración de privacidad ni estado de aprobación, y nadie más en el proyecto puede ver tu lista.',
  'targetMemory.setting.offNote': 'Mientras esto está desactivado, no se guarda nada en absoluto.',
  'targetMemory.setting.turnOffWarning':
    'Desactivar esto elimina toda selección guardada en este proyecto, para todos.',
  'targetMemory.setting.enabled': 'Activado',
  'targetMemory.setting.disabled': 'Desactivado',
  'targetMemory.setting.saved': 'Configuración guardada.',
  'targetMemory.setting.cleared': 'Configuración guardada. Se eliminaron las selecciones guardadas en este proyecto.',

  'targetMemory.composer.restored':
    '{count, plural, one {Empezó con # cuenta de la última vez.} many {Empezó con # cuentas de la última vez.} other {Empezó con # cuentas de la última vez.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {# cuenta que usaste la última vez se dejó fuera porque necesita atención.} many {# cuentas que usaste la última vez se dejaron fuera porque necesitan atención.} other {# cuentas que usaste la última vez se dejaron fuera porque necesitan atención.}}',
  'targetMemory.composer.droppedAll':
    'Ninguna de las cuentas que usaste la última vez está disponible ahora, así que no se preseleccionó nada.',
  'targetMemory.composer.undo': 'Borrar selección',
  'targetMemory.composer.forget': 'Dejar de recordar mis cuentas',
  'targetMemory.composer.forgotten': 'Tu selección guardada fue eliminada.',
  'targetMemory.composer.reviewAccounts': 'Revisar cuentas',
} as const;
