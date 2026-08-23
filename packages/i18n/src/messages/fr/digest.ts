/** Weekly digest copy for the French interface. */
export const digestMessages = {
  'digest.title': 'Cette semaine',
  'digest.subtitle': 'Ce que nous pouvons voir du {windowStart} au {windowEnd}.',
  'digest.empty':
    "Il n'y a encore rien à résumer pour cette semaine. Publiez quelque chose et cela apparaîtra ici.",
  'digest.regenerate': 'Reconstruire le résumé de cette semaine',
  'digest.generating': 'Création du résumé de cette semaine',
  'digest.source.deterministic':
    "Rédigé à partir de vos publications et de vos propres mesures, sans l'assistant d'écriture.",
  'digest.source.ai':
    "Rédigé par l'assistant à partir de vos propres données. Chaque nombre a été vérifié avec celles-ci.",
  'digest.unavailable.aiOff':
    "L'assistant d'écriture est désactivé. Voici donc la version simple. Rien ne manque.",
  'digest.unavailable.rejected':
    "La version de l'assistant ne correspondait pas à vos données et a été supprimée. Voici la version simple.",
  'digest.headline.published':
    '{published, plural, =0 {Aucune publication terminée} one {# publication terminée} other {# publications terminées}} entre {windowStart} et {windowEnd}.',
  'digest.headline.nothingPublished':
    "Aucune publication n'a été effectuée entre {windowStart} et {windowEnd}.",
  'digest.outcome.published':
    '{count, plural, one {# publication terminée sur {provider}} many {# publications terminées sur {provider}} other {# publications terminées sur {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {# publication a atteint certaines de ses destinations sur {provider}, mais pas les autres} many {# publications ont atteint certaines de leurs destinations sur {provider}, mais pas les autres} other {# publications ont atteint certaines de leurs destinations sur {provider}, mais pas les autres}}.',
  'digest.outcome.failed':
    "{count, plural, one {# publication n'a pas été envoyée sur {provider}} many {# publications n'ont pas été envoyées sur {provider}} other {# publications n'ont pas été envoyées sur {provider}}}.",
  'digest.metrics.noneYet':
    "Aucune mesure n'est encore arrivée cette semaine. Cela signifie que nous ne savons pas comment ces publications ont fonctionné, pas qu'elles ont mal fonctionné.",
  'digest.freshness.statement':
    '{label, select, fresh {Les mesures ont été synchronisées pour la dernière fois à {lastObservedAt}.} stale {Les mesures ne sont plus synchronisées depuis {lastObservedAt}. Les chiffres ci-dessus peuvent donc être obsolètes.} other {Rien n’a encore été synchronisé, donc rien de ce qui précède n’est mesuré.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'À savoir : {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Résumé hebdomadaire par e-mail',
  'digest.settings.description':
    'Un e-mail court chaque semaine avec ce qui a été publié et ce que nous avons pu mesurer. Activé par défaut.',
  'digest.settings.enabled': 'Envoyer le résumé hebdomadaire',
  'email.digest.subject': 'Votre semaine sur {workspaceName}',
  'email.digest.intro':
    'Voici ce que nous pouvons voir pour {workspaceName} entre {windowStart} et {windowEnd}.',
  'email.digest.noData':
    "Nous n'avons rien pu mesurer cette semaine. Lorsqu'un chiffre manque, c'est parce que nous n'avons pas pu le lire, pas parce qu'il était égal à zéro.",
  'email.digest.footer':
    'Vous recevez cet e-mail, car le résumé hebdomadaire est activé pour {workspaceName}. Désactivez-le dans les paramètres de votre espace de travail.',
} as const;
