/**
 * L'écran de l'assistant dans l'application web.
 *
 * La personne qui lit cet écran publie, elle ne fait pas fonctionner un
 * logiciel. Chaque phrase est écrite pour elle : elle dit ce que l'assistant
 * propose, elle dit clairement qu'une suggestion est une suggestion, et avant
 * que quoi que ce soit ne soit écrit, elle dit exactement ce qui va se passer,
 * sur quels comptes, avec quel texte, à quelle heure, dans le fuseau horaire de
 * l'espace de travail lui-même.
 *
 * Rien dans cet espace de noms ne promet une action qui n'a pas encore eu lieu,
 * et rien ne laisse entendre que l'assistant puisse agir de lui-même.
 */
export const assistantWebMessages = {
  'assistantWeb.title': 'Assistant',
  'assistantWeb.subtitle':
    'Dites ce que vous voulez. Il propose, vous décidez, rien ne se produit tout seul.',

  'assistantWeb.empty.title': 'Dites-lui ce que vous voulez, avec vos propres mots.',
  'assistantWeb.empty.body':
    "Il peut planifier une semaine de publications, proposer d'autres façons d'en commencer une, vous dire ce qui va partir et préparer une publication pour que vous l'approuviez. Il ne publie jamais rien de lui-même.",
  'assistantWeb.empty.promptsLabel': 'Ce que les gens demandent',
  'assistantWeb.empty.promptPlan': 'Planifiez ma semaine de publications.',
  'assistantWeb.empty.promptWeek': 'Que part-il cette semaine ?',
  'assistantWeb.empty.promptFailures': 'Une publication a-t-elle échoué ?',
  'assistantWeb.empty.promptCaption': 'Proposez une autre façon de commencer cette publication.',
  'assistantWeb.empty.reassurance':
    "Vous pouvez changer d'avis à tout moment. Rien n'est écrit tant que vous ne l'avez pas approuvé.",

  'assistantWeb.input.label': 'Que souhaitez-vous faire ?',
  'assistantWeb.input.placeholder':
    'Demandez un plan, une ouverture, ou ce qui part cette semaine.',
  'assistantWeb.input.send': 'Envoyer',
  'assistantWeb.input.hint': "Les mots simples fonctionnent le mieux. Il n'y a rien à apprendre.",

  'assistantWeb.turn.you': 'Vous',
  'assistantWeb.turn.assistant': 'Assistant',
  'assistantWeb.turn.working': "Lecture de votre espace de travail et rédaction d'une réponse.",
  'assistantWeb.turn.workingNote': "Rien n'a changé pendant cette opération.",
  'assistantWeb.turn.suggestionBadge': 'Suggestion',
  'assistantWeb.turn.suggestionNote':
    "Ceci est une suggestion, pas un compte rendu de ce qui s'est passé.",
  'assistantWeb.turn.provenance': 'Suggéré par {provider} {model}.',
  'assistantWeb.turn.degraded':
    'Rédigé cette fois à partir de vos propres réglages, sans le modèle de rédaction.',

  'assistantWeb.subject.label': 'La publication concernée',
  'assistantWeb.subject.none': "Aucune publication choisie pour l'instant.",
  'assistantWeb.subject.choose': 'Choisissez une publication',
  'assistantWeb.subject.needed':
    "Choisissez de quelle publication il s'agit, puis posez à nouveau la question.",
  'assistantWeb.subject.untitled': 'Publication sans titre',
  'assistantWeb.subject.composerOnly':
    "Cela se fait dans le compositeur, où vous voyez la publication telle que chaque compte l'affichera.",
  'assistantWeb.subject.openComposer': 'Ouvrir dans le compositeur',

  'assistantWeb.confirm.title': 'Avant que quoi que ce soit ne se produise',
  'assistantWeb.confirm.body':
    "Rien n'a encore été écrit. Lisez ceci et approuvez-le seulement si c'est ce que vous voulez.",
  'assistantWeb.confirm.accountsLabel': 'Comptes concernés',
  'assistantWeb.confirm.accountsUnavailable': 'Les comptes concernés ne sont pas disponibles.',
  'assistantWeb.confirm.accountCount':
    '{count, plural, one {# compte} many {# comptes} other {# comptes}}',
  'assistantWeb.confirm.textLabel': 'Le texte',
  'assistantWeb.confirm.textUnavailable': 'Cette action ne modifie aucun texte.',
  'assistantWeb.confirm.timeLabel': "L'heure",
  'assistantWeb.confirm.timeValue': '{dateTime} ({timeZone})',
  'assistantWeb.confirm.timeUnavailable': 'Cette action ne fixe aucune heure.',
  'assistantWeb.confirm.zoneNote':
    'Les heures sont affichées dans le fuseau horaire de votre espace de travail.',
  'assistantWeb.confirm.noteLabel': "Note à l'intention de la personne qui approuve",
  'assistantWeb.confirm.expires': 'Cette approbation expire le {dateTime}.',
  'assistantWeb.confirm.approve': 'Approuver et effectuer',
  'assistantWeb.confirm.cancel': 'Pas maintenant',
  'assistantWeb.confirm.cancelled': "Annulé. Rien n'a été écrit.",
  'assistantWeb.confirm.applied': "Terminé. Vous l'avez approuvé, donc cela a été effectué.",
  'assistantWeb.confirm.openConfirmation': "Ouvrir l'écran d'approbation complet",
  'assistantWeb.confirm.proposalTitle': 'Une simple proposition',
  'assistantWeb.confirm.working': 'Approbation en cours. Ne fermez pas cet écran.',

  'assistantWeb.overBudget.title': "Cet espace de travail a utilisé son quota d'IA pour le mois.",
  'assistantWeb.overBudget.body':
    "L'assistant ne peut plus rien rédiger tant que le quota n'a pas repris. Rien de ce que vous avez déjà fait n'est affecté, et vous pouvez toujours écrire, planifier et publier vous-même.",
  'assistantWeb.overBudget.reset': 'Le quota reprend le {dateTime}.',
  'assistantWeb.overBudget.resetUnknown': "Nous n'avons pas de date pour sa reprise.",
  'assistantWeb.overBudget.compose': 'Écrivez une publication vous-même',

  'assistantWeb.result.planTitle': "Une semaine suggérée. Rien n'est planifié.",
  'assistantWeb.result.planSlot': 'Jour {day} à {time}',
  'assistantWeb.result.planEmpty': "Aucune publication n'a été suggérée.",
  'assistantWeb.result.weekTitle': 'Ce qui est planifié',
  'assistantWeb.result.weekEmpty': "Rien n'est planifié pour cette période.",
  'assistantWeb.result.weekMore': 'Il y en a plus que cela. Le calendrier montre tout.',
  'assistantWeb.result.openCalendar': 'Ouvrir le calendrier',
  'assistantWeb.result.failuresTitle':
    'Ce qui a échoué, et le motif enregistré au moment des faits',
  'assistantWeb.result.failuresEmpty': "Rien n'a échoué.",
  'assistantWeb.result.captionsTitle': 'Autres façons de commencer cette publication',
  'assistantWeb.result.captionsEmpty': "Aucune autre ouverture n'a été suggérée.",
  'assistantWeb.result.copy': 'Copier ce texte',
  'assistantWeb.result.copied': 'Copié.',

  'assistantWeb.error.title': "Cela n'a pas abouti.",
  'assistantWeb.error.body': "Rien n'a été modifié. Vous pouvez poser à nouveau la question.",
  'assistantWeb.error.retry': 'Poser à nouveau la question',
} as const;
