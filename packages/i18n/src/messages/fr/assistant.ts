/**
 * L'assistant.
 *
 * Chaque phrase dit ce que l'assistant a fait, au passé, et dit clairement
 * quand il n'a rien fait. Rien dans ce catalogue ne présente une suggestion
 * comme un fait, et rien ne promet une action qui n'a pas encore eu lieu.
 */
export const assistantMessages = {
  'assistant.tool.plan_week': 'Rédiger une semaine de publications pour ce projet.',
  'assistant.tool.suggest_caption': "Proposer d'autres façons de commencer cette publication.",
  'assistant.tool.check_platform_fit':
    'Vérifier cette publication par rapport à ce que le compte autorise.',
  'assistant.tool.report_week': 'Montrer ce qui part cette semaine.',
  'assistant.tool.report_failures': 'Montrer ce qui a échoué, et pourquoi.',
  'assistant.tool.draft_post': 'Créer un brouillon.',
  'assistant.tool.adapt_draft_text': 'Réécrire cette publication pour un compte.',
  'assistant.tool.schedule_post': 'Placer cette publication dans le prochain créneau de la file.',
  'assistant.tool.request_approval': 'Envoyer cette publication pour approbation.',

  'assistant.turn.plan_week': "Voici une semaine suggérée. Rien n'est encore planifié.",
  'assistant.turn.suggest_caption':
    "Voici quelques ouvertures suggérées. Votre brouillon n'a pas changé.",
  'assistant.turn.check_platform_fit':
    'Voici comment cette publication convient à ce compte en ce moment.',
  'assistant.turn.report_week': 'Voici ce qui est planifié pour cette période.',
  'assistant.turn.report_failures':
    'Voici ce qui a échoué, avec le motif enregistré au moment des faits.',
  'assistant.turn.draft_post': 'Cela créera un brouillon une fois que vous aurez confirmé.',
  'assistant.turn.adapt_draft_text':
    'Cela réécrira la version de ce compte une fois que vous aurez confirmé.',
  'assistant.turn.schedule_post':
    'Cela planifiera la publication une fois que vous aurez confirmé.',
  'assistant.turn.request_approval':
    'Cela enverra la publication pour approbation une fois que vous aurez confirmé.',

  'assistant.state.awaiting_confirmation':
    "En attente de votre confirmation. Rien n'a encore changé.",
  'assistant.state.applied': "Terminé. Vous l'avez confirmé, donc cela a été effectué.",

  'assistant.blocked.no_confirmable_subject':
    "Ceci est une simple proposition. Créez le brouillon dans le compositeur, l'assistant pourra ensuite agir dessus.",
  'assistant.blocked.confirmation_unavailable':
    'Ceci est une simple proposition. Cette session ne peut pas recevoir de confirmation pour agir.',

  'assistant.error.profile_required':
    "Remplissez d'abord le profil de l'entreprise, pour qu'un plan repose sur vos propres mots.",

  'assistant.label.suggestion': 'Suggestion',
} as const;
