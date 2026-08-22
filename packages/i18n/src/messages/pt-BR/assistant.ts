/**
 * O assistente.
 *
 * Cada frase aqui diz o que o assistente fez, no passado, e diz claramente
 * quando ele não fez nada. Nada neste catálogo apresenta uma sugestão como um
 * fato, e nada promete uma ação que ainda não aconteceu.
 */
export const assistantMessages = {
  'assistant.tool.plan_week': 'Rascunhar uma semana de publicações para este projeto.',
  'assistant.tool.suggest_caption': 'Sugerir outras formas de começar esta publicação.',
  'assistant.tool.check_platform_fit':
    'Verificar esta publicação em relação ao que a conta permite.',
  'assistant.tool.report_week': 'Mostrar o que sai esta semana.',
  'assistant.tool.report_failures': 'Mostrar o que falhou, e por quê.',
  'assistant.tool.draft_post': 'Criar um rascunho.',
  'assistant.tool.adapt_draft_text': 'Reescrever esta publicação para uma conta.',
  'assistant.tool.schedule_post': 'Colocar esta publicação no próximo horário da fila.',
  'assistant.tool.request_approval': 'Enviar esta publicação para aprovação.',

  'assistant.turn.plan_week': 'Aqui está uma semana sugerida. Nada foi agendado ainda.',
  'assistant.turn.suggest_caption':
    'Aqui estão algumas aberturas sugeridas. Seu rascunho não mudou.',
  'assistant.turn.check_platform_fit':
    'Veja como esta publicação se encaixa nessa conta neste momento.',
  'assistant.turn.report_week': 'Isto é o que está agendado para esse período.',
  'assistant.turn.report_failures': 'Isto é o que falhou, com o motivo registrado na ocasião.',
  'assistant.turn.draft_post': 'Isto criará um rascunho depois que você confirmar.',
  'assistant.turn.adapt_draft_text':
    'Isto reescreverá a versão dessa conta depois que você confirmar.',
  'assistant.turn.schedule_post': 'Isto agendará a publicação depois que você confirmar.',
  'assistant.turn.request_approval':
    'Isto enviará a publicação para aprovação depois que você confirmar.',

  'assistant.state.awaiting_confirmation': 'Aguardando sua confirmação. Nada mudou ainda.',
  'assistant.state.applied': 'Pronto. Você confirmou, então foi executado.',

  'assistant.blocked.no_confirmable_subject':
    'Isto é apenas uma proposta. Crie o rascunho no compositor e então o assistente poderá agir sobre ele.',
  'assistant.blocked.confirmation_unavailable':
    'Isto é apenas uma proposta. Esta sessão não pode receber uma confirmação para agir.',

  'assistant.error.profile_required':
    'Preencha primeiro o perfil da empresa, para que o plano se baseie nas suas próprias palavras.',

  'assistant.label.suggestion': 'Sugestão',
} as const;
