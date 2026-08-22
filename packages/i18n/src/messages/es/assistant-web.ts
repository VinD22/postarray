/**
 * La pantalla del asistente en la aplicación web.
 *
 * Quien lee esta pantalla es alguien que publica, no alguien que opera
 * software. Cada frase está escrita para esa persona: dice qué ofrece el
 * asistente, dice con claridad que una sugerencia es una sugerencia y, antes de
 * escribir nada, dice exactamente qué va a pasar, en qué cuentas, con qué texto
 * y a qué hora, en la zona horaria del propio espacio de trabajo.
 *
 * Nada en este espacio de nombres promete una acción que todavía no ha
 * ocurrido, y nada da a entender que el asistente pueda actuar por su cuenta.
 */
export const assistantWebMessages = {
  'assistantWeb.title': 'Asistente',
  'assistantWeb.subtitle': 'Di lo que quieres. Él sugiere, tú decides, nada ocurre por su cuenta.',

  'assistantWeb.empty.title': 'Dile lo que quieres, con tus propias palabras.',
  'assistantWeb.empty.body':
    'Puede planificar una semana de publicaciones, sugerir otras formas de empezar una, decirte qué va a salir y dejar una publicación lista para que la apruebes. Nunca publica nada por su cuenta.',
  'assistantWeb.empty.promptsLabel': 'Lo que suele pedirse',
  'assistantWeb.empty.promptPlan': 'Planifica mi semana de publicaciones.',
  'assistantWeb.empty.promptWeek': '¿Qué sale esta semana?',
  'assistantWeb.empty.promptFailures': '¿Falló alguna publicación?',
  'assistantWeb.empty.promptCaption': 'Sugiere otra forma de empezar esta publicación.',
  'assistantWeb.empty.reassurance':
    'Puedes cambiar de opinión en cualquier momento. No se escribe nada hasta que lo apruebas.',

  'assistantWeb.input.label': '¿Qué te gustaría hacer?',
  'assistantWeb.input.placeholder':
    'Pide un plan, un texto de apertura o qué va a salir esta semana.',
  'assistantWeb.input.send': 'Enviar',
  'assistantWeb.input.hint': 'Las palabras sencillas funcionan mejor. No hay nada que aprender.',

  'assistantWeb.turn.you': 'Tú',
  'assistantWeb.turn.assistant': 'Asistente',
  'assistantWeb.turn.working': 'Leyendo tu espacio de trabajo y escribiendo una respuesta.',
  'assistantWeb.turn.workingNote': 'No ha cambiado nada mientras esto se ejecuta.',
  'assistantWeb.turn.suggestionBadge': 'Sugerencia',
  'assistantWeb.turn.suggestionNote': 'Esto es una sugerencia, no un registro de lo que ocurrió.',
  'assistantWeb.turn.provenance': 'Sugerido por {provider} {model}.',
  'assistantWeb.turn.degraded':
    'Escrito esta vez a partir de tus propios ajustes, sin el modelo de redacción.',

  'assistantWeb.subject.label': 'La publicación de la que se trata',
  'assistantWeb.subject.none': 'Todavía no has elegido ninguna publicación.',
  'assistantWeb.subject.choose': 'Elige una publicación',
  'assistantWeb.subject.needed': 'Elige a qué publicación te refieres y vuelve a preguntar.',
  'assistantWeb.subject.untitled': 'Publicación sin título',
  'assistantWeb.subject.composerOnly':
    'Esto se hace en el compositor, donde puedes ver la publicación tal como la mostrará cada cuenta.',
  'assistantWeb.subject.openComposer': 'Abrir en el compositor',

  'assistantWeb.confirm.title': 'Antes de que ocurra nada',
  'assistantWeb.confirm.body':
    'Todavía no se ha escrito nada. Lee esto y apruébalo solo si es lo que quieres.',
  'assistantWeb.confirm.accountsLabel': 'Cuentas a las que llega',
  'assistantWeb.confirm.accountsUnavailable': 'No está disponible a qué cuentas llega esto.',
  'assistantWeb.confirm.accountCount':
    '{count, plural, one {# cuenta} many {# cuentas} other {# cuentas}}',
  'assistantWeb.confirm.textLabel': 'El texto',
  'assistantWeb.confirm.textUnavailable': 'Esta acción no cambia ningún texto.',
  'assistantWeb.confirm.timeLabel': 'La hora',
  'assistantWeb.confirm.timeValue': '{dateTime} ({timeZone})',
  'assistantWeb.confirm.timeUnavailable': 'Esta acción no fija ninguna hora.',
  'assistantWeb.confirm.zoneNote':
    'Las horas se muestran en la zona horaria de tu espacio de trabajo.',
  'assistantWeb.confirm.noteLabel': 'Nota para quien lo apruebe',
  'assistantWeb.confirm.expires': 'Esta aprobación caduca el {dateTime}.',
  'assistantWeb.confirm.approve': 'Aprobar y hacerlo',
  'assistantWeb.confirm.cancel': 'Ahora no',
  'assistantWeb.confirm.cancelled': 'Cancelado. No se escribió nada.',
  'assistantWeb.confirm.applied': 'Listo. Lo aprobaste, así que se llevó a cabo.',
  'assistantWeb.confirm.openConfirmation': 'Abrir la pantalla de aprobación completa',
  'assistantWeb.confirm.proposalTitle': 'Solo una propuesta',
  'assistantWeb.confirm.working': 'Aprobando. No cierres esta pantalla.',

  'assistantWeb.overBudget.title': 'Este espacio de trabajo ha agotado su cuota de IA del mes.',
  'assistantWeb.overBudget.body':
    'El asistente no puede escribir nada más hasta que la cuota vuelva a empezar. Nada de lo que ya has creado se ve afectado, y puedes seguir escribiendo, programando y publicando tú.',
  'assistantWeb.overBudget.reset': 'La cuota vuelve a empezar el {dateTime}.',
  'assistantWeb.overBudget.resetUnknown': 'No tenemos una fecha para cuándo vuelve a empezar.',
  'assistantWeb.overBudget.compose': 'Escribe tú una publicación',

  'assistantWeb.result.planTitle': 'Una semana sugerida. No hay nada programado.',
  'assistantWeb.result.planSlot': 'Día {day} a las {time}',
  'assistantWeb.result.planEmpty': 'No se sugirió ninguna publicación.',
  'assistantWeb.result.weekTitle': 'Lo que está programado',
  'assistantWeb.result.weekEmpty': 'No hay nada programado para ese periodo.',
  'assistantWeb.result.weekMore': 'Hay más que esto. El calendario lo muestra todo.',
  'assistantWeb.result.openCalendar': 'Abrir el calendario',
  'assistantWeb.result.failuresTitle': 'Lo que falló, y el motivo registrado en ese momento',
  'assistantWeb.result.failuresEmpty': 'No falló nada.',
  'assistantWeb.result.captionsTitle': 'Otras formas de empezar esta publicación',
  'assistantWeb.result.captionsEmpty': 'No se sugirieron otras aperturas.',
  'assistantWeb.result.copy': 'Copiar este texto',
  'assistantWeb.result.copied': 'Copiado.',

  'assistantWeb.error.title': 'Eso no se llevó a cabo.',
  'assistantWeb.error.body': 'No se cambió nada. Puedes volver a preguntar.',
  'assistantWeb.error.retry': 'Preguntar de nuevo',
} as const;
