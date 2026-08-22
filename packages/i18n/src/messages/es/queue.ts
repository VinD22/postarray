export const queueMessages = {
  'queue.title': 'Cola de publicaciones',
  'queue.subtitle':
    'Cuándo este proyecto puede publicar, y con qué separación. Nada se publica sin que una persona acepte el horario.',

  'queue.rules.heading': 'Reglas de la cola',
  'queue.rules.empty':
    'Todavía no hay reglas de cola. Hasta que agregues una, el próximo horario es simplemente la primera hora libre.',
  'queue.rules.create': 'Nueva regla de cola',
  'queue.rules.count':
    '{count, plural, =0 {Ninguna regla} one {# regla} many {# reglas} other {# reglas}}',
  'queue.rules.enabled': 'En uso',
  'queue.rules.disabled': 'Pausada',
  'queue.rules.archived': 'Archivada',
  'queue.rules.edit': 'Editar regla',
  'queue.rules.archive': 'Archivar regla',
  'queue.rules.archiveHelp':
    'Archivar detiene las propuestas futuras. Los horarios ya reservados mantienen su hora y su motivo.',

  'queue.field.name': 'Nombre de la regla',
  'queue.field.nameHelp': 'Un nombre que reconocerás después, por ejemplo Mañanas laborables.',
  'queue.field.timeZone': 'Zona horaria',
  'queue.field.timeZoneHelp':
    'Las ventanas, el conteo diario y las fechas de bloqueo se leen todas en esta zona.',
  'queue.field.minimumGap': 'Intervalo mínimo',
  'queue.field.minimumGapHelp':
    'Minutos entre dos publicaciones. Cero significa ninguna regla de espaciado.',
  'queue.field.maximumPerDay': 'Máximo por día',
  'queue.field.maximumPerDayHelp':
    'Déjalo vacío para no tener límite diario. Cero significa que esta regla no propone nada.',
  'queue.field.maximumPerDayUnlimited': 'Sin límite diario',
  'queue.field.priority': 'Prioridad',
  'queue.field.priorityHelp':
    'La regla de mayor prioridad que pueda ofrecer un horario es la que se usa.',
  'queue.field.enabled': 'Usar esta regla',

  'queue.windows.heading': 'Ventanas semanales',
  'queue.windows.help':
    'Elige las horas locales en las que este proyecto puede publicar. Usa los campos de día y hora, o los botones de la cuadrícula.',
  'queue.windows.empty':
    'Todavía no hay ventanas. Una regla sin ventana nunca puede ofrecer un horario.',
  'queue.windows.add': 'Agregar ventana',
  'queue.windows.remove': 'Quitar ventana',
  'queue.windows.entry': '{weekday}, de {start} a {end}',
  'queue.windows.start': 'Desde',
  'queue.windows.end': 'Hasta',
  'queue.windows.weekday': 'Día',
  'queue.windows.toggleCell': '{weekday} a las {hour}',
  'queue.windows.gridLabel': 'Disponibilidad semanal, un botón por día y hora',

  'queue.weekday.1': 'Lunes',
  'queue.weekday.2': 'Martes',
  'queue.weekday.3': 'Miércoles',
  'queue.weekday.4': 'Jueves',
  'queue.weekday.5': 'Viernes',
  'queue.weekday.6': 'Sábado',
  'queue.weekday.7': 'Domingo',

  'queue.blackouts.heading': 'Fechas bloqueadas',
  'queue.blackouts.help':
    'Fechas en las que este proyecto no va a publicar, leídas en la zona horaria de la regla.',
  'queue.blackouts.empty': 'Ninguna fecha bloqueada.',
  'queue.blackouts.add': 'Agregar bloqueo',
  'queue.blackouts.remove': 'Quitar bloqueo',
  'queue.blackouts.from': 'Primer día',
  'queue.blackouts.to': 'Último día',
  'queue.blackouts.entry': '{from} a {to}',

  'queue.connections.heading': 'Cuentas',
  'queue.connections.all': 'Toda cuenta en este proyecto',
  'queue.connections.scoped':
    '{count, plural, one {# cuenta} many {# cuentas} other {# cuentas}} a las que se aplica esta regla',

  'queue.slot.heading': 'Próximo horario de la cola',
  'queue.slot.action': 'Usar el próximo horario de la cola',
  'queue.slot.proposed': '{local} en {timeZone}',
  'queue.slot.utc': 'Eso es {utc} en UTC.',
  'queue.slot.why': 'Por qué este horario',
  'queue.slot.accept': 'Usar este horario',
  'queue.slot.release': 'Elegir otro horario',
  'queue.slot.expires': 'Esta propuesta se mantiene hasta {expires}.',
  'queue.slot.unavailable': 'Un horario de la cola no está disponible ahora.',
  'queue.slot.pending': 'Buscando el próximo horario.',
  'queue.slot.accepted': 'Programado para {local} en {timeZone}.',
  'queue.slot.notAutomatic': 'Nada se programa hasta que elijas este horario.',

  'queue.reason.noRulesConfigured':
    'Este proyecto no tiene reglas de cola configuradas, así que no se aplicó ninguna ventana.',
  'queue.reason.fallbackFirstFreeHour': 'Se usó la primera hora libre a partir de ahora.',
  'queue.reason.matchedRule': 'La regla {name} eligió este horario, en {zone}.',
  'queue.reason.matchedWindow': 'Cae en la ventana de {start} a {end} en {zone}.',
  'queue.reason.minimumGap': 'Está al menos {minutes} minutos separado de toda otra publicación.',
  'queue.reason.noMinimumGap': 'Esta regla no define un intervalo mínimo entre publicaciones.',
  'queue.reason.dailyCap': 'Ese día admite como máximo {limit} publicaciones, y no está lleno.',
  'queue.reason.dailyCapUnlimited': 'Esta regla no define un límite diario.',
  'queue.reason.blackoutSkipped':
    'Se saltaron {days, plural, one {# día bloqueado} many {# días bloqueados} other {# días bloqueados}} para llegar hasta aquí.',
  'queue.reason.dstNonexistentSkipped':
    'La primera hora de la ventana no existe en esa fecha en {zone}, así que se usó la siguiente que sí existe.',
  'queue.reason.dstAmbiguousFirst':
    'Esa hora local ocurre dos veces en {zone} en esa fecha. Se usó la primera ocurrencia.',
  'queue.reason.priorityChosen':
    'Esta regla tiene prioridad {priority}, la más alta que pudo ofrecer.',
  'queue.reason.connectionScoped':
    'Esta regla cubre {count, plural, one {# cuenta} many {# cuentas} other {# cuentas}}.',
  'queue.reason.horizonExhausted': 'Ninguna ventana quedó libre en {days} días.',
} as const;
