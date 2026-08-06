/** Automation rules, RSS autopost, webhooks and inbound integrations. */
export const automationMessages = {
  'automation.title': 'Automation',
  'automation.subtitle':
    'Règles, flux et webhooks, avec les limites indiquées avant de les activer.',
  'automation.rules.title': "Règles d'automatisation",
  'automation.rules.create': 'Nouvelle règle',
  'automation.rules.empty':
    "Pas de règles pour l'instant. Une règle réagit à quelque chose et propose ou exécute une action.",
  'automation.rules.sentence':
    "Quand {trigger}, si {conditions}, alors {actions}, après {delay}, jusqu'à {endCondition}.",
  'automation.rules.sentenceNoConditions':
    "Quand {trigger}, alors {actions}, après {delay}, jusqu'à {endCondition}.",
  'automation.rules.structuredEditor': 'Éditeur structuré',
  'automation.rules.sentenceEditor': 'Éditeur de phrases',

  'automation.trigger.label': 'Déclenchement',
  'automation.trigger.atTime': 'une heure précise',
  'automation.trigger.nextSlot': 'le prochain créneau du calendrier approuvé',
  'automation.trigger.rssItem': 'un nouvel élément apparaît dans {feed}',
  'automation.trigger.inboundWebhook': 'un webhook authentifié arrive',
  'automation.trigger.mediaImported': "les nouveaux médias sont importés via l'API",
  'automation.trigger.postPublished': 'un article publie',
  'automation.trigger.postFailed': 'un message échoue',
  'automation.trigger.postPartiallyPublished':
    'un article est publié uniquement sur certaines cibles',
  'automation.trigger.commentCompleted':
    'un commentaire ou un élément de fil de discussion programmé se termine',
  'automation.trigger.analyticsThreshold': '{metric} sur un message atteint {value}',
  'automation.trigger.connectionExpiring': 'une connexion doit être rafraîchie',
  'automation.trigger.manual': "quelqu'un l'exécute depuis l'application, l'API, MCP ou CLI",
  'automation.trigger.recurring': 'un programme récurrent se déclenche',

  'automation.condition.label': 'Conditions',
  'automation.condition.brand': 'la marque est {brand}',
  'automation.condition.campaign': 'la campagne est {campaign}',
  'automation.condition.account': 'le compte est {account}',
  'automation.condition.platform': 'la plateforme est {platform}',
  'automation.condition.locale': 'la langue du contenu est {locale}',
  'automation.condition.contentType': 'le type de contenu est {contentType}',
  'automation.condition.quietHours': "c'est en dehors des heures calmes {timeZone}",
  'automation.condition.approved': 'le contenu est approuvé',
  'automation.condition.engagementAtLeast': '{metric} est au moins {value}',
  'automation.condition.engagementAtMost': '{metric} est au maximum {value}',
  'automation.condition.timeSincePublish': 'le message a été publié plus de {duration} il y a',
  'automation.condition.containsKeyword': 'le texte contient {keyword}',
  'automation.condition.notDuplicate': "le contenu n'est pas un quasi-double",
  'automation.condition.withinCadenceBudget': 'le budget cadence le permet',
  'automation.condition.connectionHealthy': 'la connexion fonctionne',
  'automation.condition.usageAvailable': "le solde d'utilisation le couvre",

  'automation.action.label': 'Actes',
  'automation.action.createDraft': 'créer un brouillon à partir de {template}',
  'automation.action.transcreate': 'adapter le texte pour {locale}',
  'automation.action.addSignature': 'ajouter la signature {signature}',
  'automation.action.addUtm': 'ajouter des paramètres UTM',
  'automation.action.addDisclosure': 'ajouter la divulgation {disclosure}',
  'automation.action.addFirstComment': 'ajouter le premier commentaire approuvé',
  'automation.action.requestApproval': "demander l'approbation humaine",
  'automation.action.schedule': "planifiez-le via la politique d'approbation",
  'automation.action.publish': "publiez-le via la politique d'approbation",
  'automation.action.wait': 'attendez {duration}',
  'automation.action.notify': 'notifier {target}',
  'automation.action.pauseRule': 'suspendre cette règle',
  'automation.action.repost': 'republier ou citer la publication source une fois',
  'automation.action.followUpFromAccount': 'publier un suivi préparé à partir de {account}',

  'automation.preflight.title': "Avant d'allumer ceci",
  'automation.preflight.accounts':
    'Cette règle peut agir sur {count, plural, one {# compte} many {# comptes} other {# comptes}}.',
  'automation.preflight.maxActions':
    'Il peut créer tout au plus {count, plural, one {# action extérieure} many {# actions extérieures} other {# actions extérieures}} par course.',
  'automation.preflight.approval': 'Chaque publication suit toujours {policy}.',
  'automation.preflight.providerLimits': 'Limites du fournisseur applicables',
  'automation.preflight.estimatedCost': 'Coût estimé par exécution : {amount}.',
  'automation.preflight.duplicateImpact':
    'Des contrôles de doublons et de cadence sont effectués avant chaque action.',
  'automation.preflight.failureBehaviour': 'Si une action échoue, la règle {behaviour}.',
  'automation.preflight.example': "Exemple d'exécution",

  'automation.threshold.windowRequired': 'Choisissez une fenêtre de mesure.',
  'automation.threshold.cooldownRequired': 'Choisissez un temps de recharge entre les exécutions.',
  'automation.threshold.maxExecutions':
    'Fonctionne au maximum {count, plural, one {# temps} many {# fois} other {# fois}} pour chaque publication source.',
  'automation.threshold.staleMetric':
    "Si la métrique est manquante ou obsolète, cette règle ne s’exécute pas. Cette valeur par défaut vous empêche d'agir sur un numéro que nous ne pouvons pas vérifier.",

  'automation.rules.state.draft': 'Brouillon',
  'automation.rules.state.testing': 'Mode test',
  'automation.rules.state.active': 'Actif',
  'automation.rules.state.paused': 'En pause',
  'automation.rules.state.stopped': 'Arrêté par un kill switch',
  'automation.rules.killSwitch': 'Arrêtez cette règle maintenant',
  'automation.rules.runs.title': 'Courses récentes',
  'automation.rules.runs.empty': "Cette règle n'a pas encore été appliquée.",
  'automation.rules.runs.succeeded': 'Complété {relativeTime}',
  'automation.rules.runs.failed': 'Échoué {relativeTime}',
  'automation.rules.versionHistory': 'Historique des versions',

  'automation.notPermitted.title': 'Cette règle ne peut pas être créée',
  'automation.notPermitted.body':
    "Relay n'automatise pas les likes, les suivis, les réponses ou messages non sollicités, les publications de masse en double ou tout ce qui dépend de l'automatisation du navigateur. {provider} l'interdit et nous aussi.",
  'automation.notPermitted.providerCapability':
    "{provider} n'offre pas {action} via son API officielle, cette action n'est donc pas sélectionnable pour celui-ci.",

  'automation.rss.title': 'Publication automatique RSS',
  'automation.rss.add': 'Ajouter un flux',
  'automation.rss.urlLabel': 'URL du flux',
  'automation.rss.validating': 'Vérification du flux',
  'automation.rss.validated': "{title} ça a l'air valide. Dernier article : {itemTitle}.",
  'automation.rss.markSeen': 'Traitez le dernier élément actuel comme déjà vu',
  'automation.rss.targets': 'Publier sur',
  'automation.rss.template': 'Modèle de texte',
  'automation.rss.templateHelp':
    "Utilisez les champs de flux que vous avez mappés. Relay ne génère pas d'images pour les éléments de flux.",
  'automation.rss.policy.draft': 'Créer un brouillon',
  'automation.rss.policy.approval': 'Créer un brouillon et demander l’approbation',
  'automation.rss.policy.nextSlot': 'Programmer dans le prochain créneau libre',
  'automation.rss.policy.cadence': 'Programmer à une cadence fixe',
  'automation.rss.policy.immediate': 'Publier immédiatement',
  'automation.rss.dedupe':
    "Les éléments sont identifiés par identifiant, lien et contenu, de sorte que le même élément n'est pas publié deux fois.",
  'automation.rss.health.lastPoll': 'Dernière vérification {relativeTime}',
  'automation.rss.health.lastItem': 'Dernière nouveauté {relativeTime}',
  'automation.rss.health.lastPost': 'Dernier message créé {relativeTime}',
  'automation.rss.health.error': 'Dernière erreur : {reason}',

  'automation.webhooks.title': 'Webhooks',
  'automation.webhooks.add': 'Ajouter un point de terminaison',
  'automation.webhooks.urlLabel': 'URL du point de terminaison',
  'automation.webhooks.eventsLabel': 'Événements',
  'automation.webhooks.allEvents': 'Tous les événements',
  'automation.webhooks.scopeLabel': 'Marques et comptes',
  'automation.webhooks.allAccounts': 'Tous les comptes',
  'automation.webhooks.secret': 'Secret de signature',
  'automation.webhooks.secretShownOnce': 'Ce secret est montré une fois. Rangez-le maintenant.',
  'automation.webhooks.rotateSecret': 'Faites pivoter le secret de signature',
  'automation.webhooks.testSend': 'Envoyer un événement test',
  'automation.webhooks.testSent': 'Événement test envoyé. Vérifiez le journal de livraison.',
  'automation.webhooks.deliveries.title': 'Livraisons',
  'automation.webhooks.deliveries.status': 'Réponse {status} dans {duration}',
  'automation.webhooks.deliveries.redeliver': 'Relivrer',
  'automation.webhooks.deliveries.retrying':
    'Réessayer avec backoff. Tentative {attempt} de {max}.',
  'automation.webhooks.disabledAfterFailures':
    'Ce point de terminaison a été désactivé après des échecs répétés. Corrigez-le et réactivez-le.',
  'automation.webhooks.event.connectionConnected': 'Une connexion a été ajoutée',
  'automation.webhooks.event.connectionActionRequired':
    'Une connexion nécessite une attention particulière',
  'automation.webhooks.event.draftCreated': 'Un brouillon a été créé',
  'automation.webhooks.event.approvalRequested': "L'approbation a été demandée",
  'automation.webhooks.event.approvalDecided': 'Une approbation a été décidée',
  'automation.webhooks.event.postScheduled': 'Un post était prévu',
  'automation.webhooks.event.postDispatching': "Un message est en cours d'envoi",
  'automation.webhooks.event.postPublished': 'Un article publié',
  'automation.webhooks.event.postPartiallyPublished': 'Un post publié auprès de certaines cibles',
  'automation.webhooks.event.postFailed': 'Un message a échoué',
  'automation.webhooks.event.commentPublished':
    'Un commentaire ou un élément de fil de discussion publié',
  'automation.webhooks.event.commentFailed':
    'Un commentaire ou un élément de fil de discussion a échoué',
  'automation.webhooks.event.analyticsUpdated': 'Analyses mises à jour',
  'automation.webhooks.event.rssItemProcessed': 'Un élément RSS a été traité',
  'automation.webhooks.event.ruleRunCompleted': 'Une exécution de règle terminée',
  'automation.webhooks.event.ruleRunFailed': "Échec d'une exécution de règle",
  'automation.webhooks.event.subscriptionChanged': "L'abonnement a changé",

  'automation.inbound.title': 'Intégrations entrantes',
  'automation.inbound.description':
    "Envoyez du JSON authentifié pour créer un brouillon ou démarrer une règle nommée. Les données entrantes ne contournent jamais la validation, la portée du compte ou l'approbation.",
  'automation.inbound.endpoint': 'Point de terminaison',
  'automation.inbound.credential': "Informations d'identification",
} as const;
