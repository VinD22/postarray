/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'Relations',
  'connection.subtitle':
    'Les comptes, pages et canaux sur lesquels cet espace de travail peut publier.',
  'connection.add': 'Connecter un compte',
  'connection.count':
    '{used, plural, one {# canal actif} many {# chaînes actives} other {# chaînes actives}} de {limit}',
  'connection.limitReached':
    'Cet espace de travail utilise tous {limit} chaînes. Déconnectez-en un avant d’en connecter un autre.',

  'connection.account.label': 'Compte',
  'connection.account.type.profile': 'Profil',
  'connection.account.type.page': 'Page',
  'connection.account.type.channel': 'Canal',
  'connection.account.type.group': 'Groupe',
  'connection.account.type.organization': 'Organisation',
  'connection.account.type.business': 'Compte professionnel',
  'connection.account.type.creator': 'Compte créateur',
  'connection.connectedBy': 'Connecté par {name} sur {date}',
  'connection.lastPublished': 'Dernière publication {relativeTime}',
  'connection.lastPublishedNever': "Rien de publié pour ce compte pour l'instant",
  'connection.lastAnalyticsSync': 'Analyses synchronisées {relativeTime}',

  'connection.status.healthy': 'Fonctionnement',
  'connection.status.expiringSoon': 'Expire {relativeTime}',
  'connection.status.expired': 'Accès expiré',
  'connection.status.revoked': 'Accès révoqué',
  'connection.status.paused': 'En pause',
  'connection.status.permissionMissing': 'Autorisation manquante',
  'connection.status.reviewPending': "En attente de l'examen de la plateforme",
  'connection.status.unknown': 'Santé indisponible',

  'connection.token.expiresAt': "L'accès expire {date}",
  'connection.token.expiryUnknown': '{provider} ne nous dit pas quand cet accès expire.',

  'connection.permissions.title': 'Autorisations',
  'connection.permissions.granted': 'Accordé',
  'connection.permissions.missing': 'Non accordé',
  'connection.permissions.explainBeforeOAuth':
    'Relay demandera {provider} pour ces autorisations. Vous pouvez vous déconnecter à tout moment.',
  'connection.permissions.whyNeeded': "Pourquoi c'est nécessaire",

  'connection.reconnect.title': 'Reconnecter {account}',
  'connection.reconnect.body':
    "Les publications programmées pour ce compte sont suspendues jusqu'à ce qu'il soit reconnecté. Rien n'est perdu.",
  'connection.disconnect.title': 'Déconnecter {account}?',
  'connection.disconnect.body':
    'Les publications programmées pour ce compte ne seront pas publiées. Les reçus et analyses déjà collectés restent dans cet espace de travail.',
  'connection.pause.body':
    'Un compte en pause conserve son historique et son planning, mais ne publie pas tant que vous ne le reprenez pas.',

  'connection.incident.invalidToken':
    "{provider} a rejeté l'accès stocké pour {account}. Reconnectez-vous pour restaurer la publication.",
  'connection.incident.permissionLost':
    "{account} n'accorde plus {permission}. Reconnectez-vous et acceptez cette autorisation.",
  'connection.incident.roleLost':
    "Ton {provider} l'utilisateur n'a plus de rôle sur {account}. Demandez à un administrateur de cette page de la restaurer.",
  'connection.incident.accountTypeInvalid':
    "Instagram a besoin d'un compte professionnel. Changer {account} à un compte professionnel ou créateur, puis reconnectez-vous.",
  'connection.incident.reviewRestricted':
    "{provider} a restreint cette application en attendant son examen. Messages de {account} publier en privé jusqu'à ce que l'examen soit terminé.",

  'connection.group.title': 'Groupes de clients',
  'connection.group.description':
    'Regroupez les comptes par client ou par marque pour filtrer chaque écran.',
  'connection.group.assign': 'Passer au groupe',
  'connection.group.none': 'Non groupé',
  'connection.group.moveNote':
    "Le déplacement d'un compte conserve ses publications, ses reçus et ses analyses.",

  'connection.oauth.starting': 'Ouverture {provider}',
  'connection.oauth.returned': 'Terminer la connexion',
  'connection.oauth.chooseAccounts': 'Choisissez les comptes à connecter',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'Aucun compte à ce sujet {provider} la connexion peut être connectée. {reason}',
  'connection.oauth.canceled': "La connexion a été annulée le {provider}. Rien n'a changé.",
  'connection.oauth.alreadyConnected': '{account} est déjà connecté à cet espace de travail.',
  'connection.oauth.connectedToAnotherWorkspace':
    "{account} est connecté à un autre espace de travail. Déconnectez-le d'abord.",

  'capability.title': 'Ce que ce compte prend en charge',
  'capability.matrix.title': 'Capacités de la plateforme',
  'capability.matrix.subtitle':
    'Généré à partir des définitions de connecteurs que nous maintenons et examinées à la main.',
  'capability.level.supported': 'Soutenu',
  'capability.level.unsupported': 'Non proposé par la plateforme',
  'capability.level.not_implemented': 'Pas encore construit',
  'capability.level.requires_review': 'Nécessite une révision de la plateforme',
  'capability.level.beta': 'Bêta',
  'capability.level.unknown': 'Indisponible',
  'capability.explain.supported': "Relay peut le faire pour ce compte aujourd'hui.",
  'capability.explain.unsupported':
    '{provider} ne propose pas cela via son API officielle, donc aucun outil ne peut le faire en toute sécurité.',
  'capability.explain.not_implemented':
    "{provider} le propose, mais Relay ne l'a pas encore construit. C'est sur la feuille de route du connecteur.",
  'capability.explain.requires_review':
    "{provider} ne l'accorde qu'après avoir examiné l'application ou le compte. Il reste indisponible jusqu'à ce que cet examen soit terminé.",
  'capability.explain.beta':
    "Cela fonctionne, avec des limites que nous n'avons pas fini de vérifier. Vérifiez le résultat avant de vous y fier.",
  'capability.explain.unknown':
    "Nous n'avons pas pu lire les autorisations actuelles pour ce compte. Reconnectez-vous pour les actualiser.",
  'capability.lastChecked': 'À carreaux {relativeTime}',
  'capability.feature.text': 'Messages texte',
  'capability.feature.image': 'Images',
  'capability.feature.carousel': 'Carrousels',
  'capability.feature.video': 'Vidéo',
  'capability.feature.document': 'Documents',
  'capability.feature.firstComment': 'Premier commentaire programmé',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'Mentions autochtones',
  'capability.feature.destinations': 'Sélection des destinations',
  'capability.feature.privacy': 'Contrôles de confidentialité',
  'capability.feature.thumbnail': 'Miniature personnalisée',
  'capability.feature.altText': 'Texte alternatif',
  'capability.feature.analytics': 'Analytique',
  'capability.feature.delete': 'Supprimer un article publié',
  'capability.feature.commentCount': 'Les commentaires comptent',
  'capability.feature.commentReplies': 'Lire et répondre aux commentaires',
  'capability.feature.disclosure': "Divulgation d'automatisation",
} as const;
