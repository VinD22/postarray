/**
 * El asistente.
 *
 * Cada frase dice lo que hizo el asistente, en pasado, y dice con claridad
 * cuando no hizo nada. Nada en este catálogo presenta una sugerencia como un
 * hecho, y nada promete una acción que todavía no ha ocurrido.
 */
export const assistantMessages = {
  'assistant.tool.plan_week': 'Redactar una semana de publicaciones para este proyecto.',
  'assistant.tool.suggest_caption': 'Sugerir otras formas de empezar esta publicación.',
  'assistant.tool.check_platform_fit': 'Revisar esta publicación según lo que permite la cuenta.',
  'assistant.tool.report_week': 'Mostrar lo que sale esta semana.',
  'assistant.tool.report_failures': 'Mostrar lo que falló, y por qué.',
  'assistant.tool.draft_post': 'Crear un borrador.',
  'assistant.tool.adapt_draft_text': 'Reescribir esta publicación para una cuenta.',
  'assistant.tool.schedule_post': 'Poner esta publicación en la siguiente franja de la cola.',
  'assistant.tool.request_approval': 'Enviar esta publicación para aprobación.',

  'assistant.turn.plan_week': 'Aquí tienes una semana sugerida. Todavía no hay nada programado.',
  'assistant.turn.suggest_caption':
    'Aquí tienes algunas aperturas sugeridas. Tu borrador no ha cambiado.',
  'assistant.turn.check_platform_fit': 'Así encaja esta publicación en esa cuenta en este momento.',
  'assistant.turn.report_week': 'Esto es lo que está programado para ese periodo.',
  'assistant.turn.report_failures':
    'Esto es lo que falló, con el motivo registrado en ese momento.',
  'assistant.turn.draft_post': 'Esto creará un borrador cuando lo confirmes.',
  'assistant.turn.adapt_draft_text':
    'Esto reescribirá la versión de esa cuenta cuando lo confirmes.',
  'assistant.turn.schedule_post': 'Esto programará la publicación cuando lo confirmes.',
  'assistant.turn.request_approval':
    'Esto enviará la publicación para aprobación cuando lo confirmes.',

  'assistant.state.awaiting_confirmation':
    'Esperando tu confirmación. Todavía no ha cambiado nada.',
  'assistant.state.applied': 'Listo. Lo confirmaste, así que se llevó a cabo.',

  'assistant.blocked.no_confirmable_subject':
    'Esto es solo una propuesta. Crea el borrador en el compositor y luego el asistente podrá actuar sobre él.',
  'assistant.blocked.confirmation_unavailable':
    'Esto es solo una propuesta. A esta sesión no se le puede dar una confirmación con la que actuar.',

  'assistant.error.profile_required':
    'Completa primero el perfil del negocio, para que el plan se base en tus propias palabras.',

  'assistant.label.suggestion': 'Sugerencia',
} as const;
