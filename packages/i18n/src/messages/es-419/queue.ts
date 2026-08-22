/**
 * Queue rules and slot reservations.
 *
 * The reason keys are the ones the slot finder emits. They are the sentences a
 * person reads before they accept a proposed time, and the sentences an audit
 * reads back years later, so they say what actually happened rather than
 * congratulating anyone.
 */
export const queueMessages = {
  'queue.title': 'Cola de publicaciones',
  'queue.subtitle':
    'Cuándo está dispuesto a publicar este proyecto, y con qué separación. Nada se publica sin que una persona acepte el horario.',

  'queue.rules.heading': 'Reglas de la cola',
  'queue.rules.empty':
    'Aún no hay reglas de cola. Hasta que agregues una, el próximo horario es simplemente la primera hora libre.',
  'queue.rules.create': 'Nueva regla de cola',
  'queue.rules.count':
    '{count, plural, =0 {Sin reglas} one {#regla} other {#reglas} many {#reglas}}',
  'queue.rules.enabled': 'En uso',
  'queue.rules.disabled': 'Pausada',
  'queue.rules.archived': 'Archivada',
  'queue.rules.edit': 'Editar regla',
  'queue.rules.archive': 'Archivar regla',
  'queue.rules.archiveHelp':
    'Archivar detiene las propuestas futuras. Los horarios ya reservados conservan su hora y su motivo.',

  'queue.field.name': 'Nombre de la regla',
  'queue.field.nameHelp': 'Un nombre que reconocerás más tarde, por ejemplo Mañanas de semana.',
  'queue.field.timeZone': 'Zona horaria',
  'queue.field.timeZoneHelp':
    'Los horarios, la cantidad diaria y las fechas de bloqueo se leen todos en esta zona horaria.',
  'queue.field.minimumGap': 'Separación mínima',
  'queue.field.minimumGapHelp':
    'Minutos entre dos publicaciones. Cero significa que no hay regla de separación.',
  'queue.field.maximumPerDay': 'Máximo por día',
  'queue.field.maximumPerDayHelp':
    'Deja vacío si no hay límite diario. Cero significa que esta regla no propone nada.',
  'queue.field.maximumPerDayUnlimited': 'Sin límite diario',
  'queue.field.priority': 'Prioridad',
  'queue.field.priorityHelp':
    'Se usa la regla con la prioridad más alta que pueda ofrecer un horario.',
  'queue.field.enabled': 'Usar esta regla',

  'queue.windows.heading': 'Horarios semanales',
  'queue.windows.help':
    'Elige las horas locales en que este proyecto puede publicar. Usa los campos de día y hora, o los botones de la cuadrícula.',
  'queue.windows.empty':
    'Aún no hay horarios. Una regla sin horarios nunca podrá ofrecer un espacio.',
  'queue.windows.add': 'Agregar horario',
  'queue.windows.remove': 'Quitar horario',
  'queue.windows.entry': '{weekday}, de {start} a {end}',
  'queue.windows.start': 'Desde',
  'queue.windows.end': 'Hasta',
  'queue.windows.weekday': 'Día',
  'queue.windows.toggleCell': '{weekday} a las {hour}',
  'queue.windows.gridLabel': 'Disponibilidad semanal, un botón por cada día y hora',

  'queue.weekday.1': 'Lunes',
  'queue.weekday.2': 'Martes',
  'queue.weekday.3': 'Miércoles',
  'queue.weekday.4': 'Jueves',
  'queue.weekday.5': 'Viernes',
  'queue.weekday.6': 'Sábado',
  'queue.weekday.7': 'Domingo',

  'queue.blackouts.heading': 'Fechas bloqueadas',
  'queue.blackouts.help':
    'Fechas en las que este proyecto no publicará, leídas en la zona horaria de la regla.',
  'queue.blackouts.empty': 'No hay fechas bloqueadas.',
  'queue.blackouts.add': 'Agregar bloqueo',
  'queue.blackouts.remove': 'Quitar bloqueo',
  'queue.blackouts.from': 'Primer día',
  'queue.blackouts.to': 'Último día',
  'queue.blackouts.entry': 'De {from} a {to}',

  'queue.connections.heading': 'Cuentas',
  'queue.connections.all': 'Todas las cuentas de este proyecto',
  'queue.connections.scoped':
    '{count, plural, one {#cuenta} other {#cuentas} many {#cuentas}} a las que se aplica esta regla',

  'queue.slot.heading': 'Próximo horario en cola',
  'queue.slot.action': 'Usar el próximo horario en cola',
  'queue.slot.proposed': '{local} en {timeZone}',
  'queue.slot.utc': 'Eso es {utc} en UTC.',
  'queue.slot.why': 'Por qué esta hora',
  'queue.slot.accept': 'Usar esta hora',
  'queue.slot.release': 'Elegir otra hora',
  'queue.slot.expires': 'Esta propuesta se mantiene hasta {expires}.',
  'queue.slot.unavailable': 'Ningún horario de cola está disponible en este momento.',
  'queue.slot.pending': 'Buscando el próximo horario.',
  'queue.slot.accepted': 'Programado para {local} en {timeZone}.',
  'queue.slot.notAutomatic': 'Nada se programa hasta que elijas esta hora.',

  'queue.reason.noRulesConfigured':
    'Este proyecto no tiene reglas de cola configuradas, así que no se aplicó ningún horario.',
  'queue.reason.fallbackFirstFreeHour':
    'Se usó en su lugar la primera hora libre a partir de ahora.',
  'queue.reason.matchedRule': 'La regla {name} eligió esta hora, en {zone}.',
  'queue.reason.matchedWindow': 'Cae dentro del horario de {start} a {end} en {zone}.',
  'queue.reason.minimumGap': 'Está al menos a {minutes} minutos de cualquier otra publicación.',
  'queue.reason.noMinimumGap': 'Esta regla no establece una separación mínima entre publicaciones.',
  'queue.reason.dailyCap': 'Ese día admite hasta {limit} publicaciones, y aún no está lleno.',
  'queue.reason.dailyCapUnlimited': 'Esta regla no establece un límite diario.',
  'queue.reason.blackoutSkipped':
    'Se {days, plural, one {omitió #día bloqueado} other {omitieron #días bloqueados} many {omitieron #días bloqueados}} para llegar a este horario.',
  'queue.reason.dstNonexistentSkipped':
    'La primera hora del horario no existe en esa fecha en {zone}, así que se usó la siguiente que sí existe.',
  'queue.reason.dstAmbiguousFirst':
    'Esa hora local ocurre dos veces en {zone} en esa fecha. Se usó la primera vez que ocurre.',
  'queue.reason.priorityChosen':
    'Esta regla tiene prioridad {priority}, la más alta que podía ofrecer.',
  'queue.reason.connectionScoped':
    'Esta regla cubre {count, plural, one {#cuenta} other {#cuentas} many {#cuentas}}.',
  'queue.reason.horizonExhausted': 'No hubo ningún horario libre dentro de {days} días.',
} as const;
