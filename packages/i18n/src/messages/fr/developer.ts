/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Agents et API',
  'developer.subtitle':
    "L'API, le serveur MCP et la CLI utilisent les mêmes autorisations, politiques d'approbation et reçus que l'application.",

  'developer.serviceAccount.title': 'Comptes de service',
  'developer.serviceAccount.create': 'Créer un compte de service',
  'developer.serviceAccount.name': 'Nom',
  'developer.serviceAccount.scopeProjects': "Projets et comptes qu'il peut utiliser",
  'developer.serviceAccount.scopePlatforms': 'Plateformes',
  'developer.serviceAccount.scopeLocales': 'Langues du contenu',
  'developer.serviceAccount.scopeDomains': 'Domaines de liens autorisés',
  'developer.serviceAccount.scopeHours': 'Heures autorisées',
  'developer.serviceAccount.scopeCadence': 'Nombre maximum de publications par jour',
  'developer.serviceAccount.scopeLookAhead': "Jusqu'où il peut planifier",
  'developer.serviceAccount.approvalLevel': "Niveau d'approbation",
  'developer.serviceAccount.killSwitch': 'Arrêtez cet agent',

  'developer.approvalLevel.0': 'Lire et valider uniquement',
  'developer.approvalLevel.1': 'Créer et modifier des brouillons',
  'developer.approvalLevel.2': 'Horaire dans les limites fixées ci-dessus',
  'developer.approvalLevel.3': 'Demander à une personne avant de publier',
  'developer.approvalLevel.description.0':
    "L'agent peut consulter les comptes, les capacités, les calendriers et les analyses. Cela ne change rien.",
  'developer.approvalLevel.description.1':
    "L'agent peut rédiger des brouillons. Une personne planifie et publie toujours.",
  'developer.approvalLevel.description.2':
    "L'agent peut planifier selon les comptes, les heures, la cadence, les langues, les domaines et l'anticipation que vous avez définis. Tout ce qui se situe en dehors de ces limites a besoin d'une personne.",
  'developer.approvalLevel.description.3':
    "Une publication immédiate, un nouveau compte ou domaine, une action groupée, un contenu sensible ou un paramètre de confidentialité modifié nécessite toujours une confirmation explicite d'une personne.",
  'developer.bulkThreshold':
    'Le vrac signifie plus que {publications, plural, one {# publication externe} many {# publications externes} other {# publications externes}} dans une seule requête, ou le même contenu à plus de {accounts, plural, one {# compte} many {# comptes} other {# comptes}}.',

  'developer.credential.title': "Informations d'identification",
  'developer.credential.create': 'Créer une clé API',
  'developer.credential.shownOnce':
    'Cet identifiant est affiché une fois. Copiez-le maintenant. Nous n’en stockons qu’un hachage.',
  'developer.credential.prefix': 'Préfixe',
  'developer.credential.created': 'Créé {date} par {name}',
  'developer.credential.lastUsed': 'Dernière utilisation {relativeTime}',
  'developer.credential.neverUsed': 'Jamais utilisé',
  'developer.credential.expires': 'Expire {date}',
  'developer.credential.revokeConfirm':
    "Révoquer cet identifiant ? Tout ce qui l'utilise cesse de fonctionner immédiatement.",

  'developer.scope.title': 'Portées',
  'developer.scope.accountsRead': 'Lire les comptes connectés et leurs capacités',
  'developer.scope.draftsWrite': 'Créer et modifier des brouillons',
  'developer.scope.postsSchedule': 'Programmer du contenu approuvé',
  'developer.scope.postsPublish': 'Publier immédiatement',
  'developer.scope.analyticsRead': 'Lire les analyses',
  'developer.scope.receiptsRead': 'Lire les reçus de publication',
  'developer.scope.webhooksWrite': 'Gérer les webhooks',
  'developer.scope.connectionsAdmin': 'Connecter et déconnecter des comptes',
  'developer.scope.billingRead': "Lire l'état de facturation",
  'developer.scope.consequential': 'Consécutif',
  'developer.scope.readOnly': 'Lecture seule',

  'developer.setup.title': 'Connecter un client',
  'developer.setup.claudeCode': 'Claude Code',
  'developer.setup.codex': 'Manuscrit',
  'developer.setup.hermes': 'Hermès',
  'developer.setup.buzz': 'Flux de travail Buzz',
  'developer.setup.cli': 'CLI',
  'developer.setup.genericMcp': 'Tout client MCP',
  'developer.setup.copyConfig': 'Copier la configuration',
  'developer.setup.mcpEndpoint': 'Point de terminaison MCP',
  'developer.setup.apiBaseUrl': "URL de base de l'API",

  'developer.playground.title': 'Essai à sec',
  'developer.playground.description':
    'Exécutez des outils sur des données prédéfinies. Rien n’atteint une véritable plateforme.',
  'developer.playground.run': 'Courir',
  'developer.playground.sandboxBadge': 'Bac à sable',

  'developer.activity.title': 'Activité récente',
  'developer.activity.toolCall': '{tool} appelé par {actor} {relativeTime}',
  'developer.activity.denied': 'Refusé: {reason}',
  'developer.activity.empty': "Aucun appel pour l'instant.",
  'developer.activity.redacted':
    'Les corps de demande et de réponse sont stockés avec les secrets supprimés.',

  'developer.apps.title': 'Applications de développement',
  'developer.apps.subtitle':
    "Laissez un autre produit agir via Relay avec les autorisations qu'un utilisateur lui accorde.",
  'developer.apps.create': 'Enregistrer une application',
  'developer.apps.name': "Nom de l'application",
  'developer.apps.type.label': 'Type de client',
  'developer.apps.type.public': 'Public, ne peut pas garder un secret',
  'developer.apps.type.confidential': 'Confidentiel, fonctionne sur un serveur',
  'developer.apps.homepage': "URL de la page d'accueil",
  'developer.apps.privacyUrl': 'URL de la politique de confidentialité',
  'developer.apps.termsUrl': 'URL des conditions',
  'developer.apps.logo': 'Logo',
  'developer.apps.redirectUris': 'Redirection des URI',
  'developer.apps.redirectUrisHelp':
    'Correspondances exactes uniquement. Les caractères génériques et les chemins partiels sont rejetés.',
  'developer.apps.clientId': 'Identifiant client',
  'developer.apps.clientSecret': 'Secret client',
  'developer.apps.secretShownOnce':
    'Le secret est révélé une fois. Faites-le pivoter si vous le perdez. Nous ne le montrerons plus.',
  'developer.apps.status.draft': 'Brouillon',
  'developer.apps.status.active': 'Actif',
  'developer.apps.status.disabled': 'Désactivé',
  'developer.apps.consentPreview': "Aperçu de l'écran de consentement",
  'developer.apps.grants.title': 'Subventions actives',
  'developer.apps.grants.count':
    '{count, plural, one {# accorder} many {# subventions} other {# subventions}}',
  'developer.apps.deleteConfirm':
    'Supprimer cette application ? Chaque subvention est révoquée et ses jetons cessent de fonctionner.',

  'developer.consent.title': '{app} souhaite accéder à votre espace de travail',
  'developer.consent.workspace': 'Workspace',
  'developer.consent.projects': 'Projets et comptes',
  'developer.consent.willBeAbleTo': '{app} pourra',
  'developer.consent.willNotBeAbleTo': '{app} ne pourra pas',
  'developer.consent.approvalStillApplies':
    "Votre politique d'approbation s'applique toujours. Cette application ne peut pas publier autour d'elle.",
  'developer.consent.revokeAnyTime': 'Vous pouvez le révoquer depuis les paramètres à tout moment.',
  'developer.consent.allow': "Autoriser l'accès",
  'developer.consent.deny': 'Ne permettez pas',
  'developer.consent.developerIdentity': 'Publié par {developer}',

  'developer.grants.title': 'Applications avec accès',
  'developer.grants.grantedOn': 'Accordé {date}',
  'developer.grants.lastUsed': 'Dernière utilisation {relativeTime}',
  'developer.grants.revoke': "Révoquer l'accès",
  'developer.grants.revoked':
    'Accès révoqué. Vos propres connexions et publications programmées ne sont pas affectées.',

  'developer.docs.openapi': 'Document OpenAPI',
  'developer.docs.clients': 'Clients générés',
  'developer.docs.idempotency':
    "Envoyez une clé d'idempotence à chaque demande de création, de planification et de publication. Répéter une requête avec la même clé renvoie le résultat original au lieu de publier deux fois.",
  'developer.docs.pagination':
    'Les résultats sont paginés par le curseur. Les horaires sont explicites et incluent une zone.',
  'developer.docs.rateLimits':
    "Des limites de débit s'appliquent par espace de travail, identifiant, itinéraire et connecteur.",
} as const;
