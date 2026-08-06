/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Récépissé de publication',
  'receipt.subtitle': "Exactement ce qui a été publié, où, quand et avec l'approbation de qui.",
  'receipt.target': '{account} sur {provider}',
  'receipt.externalId': 'ID de publication externe',
  'receipt.permalink': 'Lien permanent',
  'receipt.permalinkUnavailable':
    '{provider} ne renvoie pas de lien permanent pour ce type de message.',
  'receipt.contentVersion': 'Version du contenu',
  'receipt.contentHash': 'Somme de contrôle du contenu',
  'receipt.mediaVersion': 'Version média',
  'receipt.idempotencyKey': "Référence d'idempotence",
  'receipt.correlationId': 'Référence de corrélation',

  'receipt.surface.label': 'Créé à partir de',
  'receipt.surface.web': 'Application Web',
  'receipt.surface.api': 'API REST',
  'receipt.surface.mcp': 'Serveur MCP',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'Publication automatique RSS',
  'receipt.surface.automation': "Règle d'automatisation",
  'receipt.surface.webhook': 'Webhook entrant',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Compte de service {name}',
  'receipt.actor.oauthApp': '{app} agissant pour {name}',
  'receipt.actor.system': 'Relay',

  'receipt.timeline.title': 'Chronologie',
  'receipt.timeline.created': 'Brouillon créé par {actor}',
  'receipt.timeline.approvalRequested': 'Approbation demandée à {approver}',
  'receipt.timeline.approved': 'Approuvé par {actor} en vertu de la politique {policy}',
  'receipt.timeline.scheduled': 'Prévu pour {local} dans {timeZone}',
  'receipt.timeline.revalidated':
    'Les identifiants et les limites de la plateforme ont été revérifiés',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# fichier préparé pour la plateforme} many {# fichiers préparés pour la plateforme} other {# fichiers préparés pour la plateforme}}',
  'receipt.timeline.dispatched': 'Envoyé à {provider}',
  'receipt.timeline.providerAccepted': '{provider} accepté le poste',
  'receipt.timeline.providerProcessing': '{provider} est toujours en train de traiter les médias',
  'receipt.timeline.published': 'Publié comme {externalId}',
  'receipt.timeline.commentPublished': 'Article de suivi {position} publié',
  'receipt.timeline.retryScheduled': 'Réessayer {attempt} prévu pour {time}',
  'receipt.timeline.failed': 'Tentative {attempt} échoué',
  'receipt.timeline.canceled': 'Annulé par {actor}',
  'receipt.timeline.analyticsSynced': 'Analyses synchronisées',
  'receipt.timeline.deletedExternally': "Le message n'est plus actif {provider}",

  'receipt.times.scheduled': 'Heure prévue',
  'receipt.times.dispatched': "Délai d'expédition",
  'receipt.times.published': 'Heure de publication',
  'receipt.times.latency': "Expédié {duration} après l'heure prévue.",

  'receipt.attempts.title': 'Tentatives',
  'receipt.attempts.count':
    '{count, plural, one {# tentative} many {# tentatives} other {# tentatives}}',
  'receipt.attempts.classification': 'Classification',
  'receipt.attempts.providerResponse': 'Réponse du fournisseur',
  'receipt.attempts.responseRedacted':
    'La réponse du fournisseur est stockée avec les jetons et les données personnelles supprimées.',
  'receipt.attempts.remediation': 'Que faire ensuite',

  'receipt.cost.estimated': 'Estimé {amount}',
  'receipt.cost.actual': 'Réconcilié {amount}',
  'receipt.cost.pending': "L'utilisation réelle n'est pas encore réconciliée.",

  'receipt.partial.title': 'Partiellement publié',
  'receipt.partial.body':
    '{published, plural, one {# cible publiée} many {# objectifs publiés} other {# objectifs publiés}}. {failed, plural, one {# cible a échoué} many {# cibles ont échoué} other {# cibles ont échoué}}. Les articles publiés existent toujours sur la plateforme.',
  'receipt.partial.doNotRollback':
    "Nous ne supprimons pas un article déjà publié. Supprimez-le sur la plateforme si c'est ce que vous souhaitez.",

  'receipt.export.title': 'Partagez ce reçu',
  'receipt.export.pdf': 'Télécharger au format PDF',
  'receipt.export.json': 'Télécharger en JSON',
  'receipt.export.permissionNote':
    'Seuls les propriétaires, les administrateurs et les approbateurs peuvent partager un reçu.',

  'receipt.analytics.lastSync': 'Dernière synchronisation des analyses {relativeTime}.',
  'receipt.analytics.nextSync': 'Prochaine synchronisation {time}.',
} as const;
