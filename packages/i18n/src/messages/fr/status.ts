/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': "Rien de prévu pour l'instant",
  'empty.calendar.body':
    'Écrivez votre premier message et choisissez une heure. Vous pourrez le modifier plus tard.',
  'empty.calendar.action': 'Composer un message',
  'empty.drafts.title': 'Aucun brouillon',
  'empty.drafts.body':
    'Les brouillons que vous enregistrez apparaissent ici avec leurs cibles et leurs problèmes.',
  'empty.connections.title': 'Aucun compte connecté',
  'empty.connections.body':
    'Connectez un compte pour y publier. Nous vous montrons d’abord les autorisations exactes.',
  'empty.connections.action': 'Connecter un compte',
  'empty.analytics.title': "Aucune métrique pour l'instant",
  'empty.analytics.body':
    'Les métriques apparaissent après que votre première publication a été publiée suffisamment longtemps pour que la plateforme en fasse rapport.',
  'empty.analytics.noPermission':
    "Ce compte n'a pas accordé l'accès aux analyses. Reconnectez-vous pour l'ajouter.",
  'empty.approvals.title': "Rien ne t'attend",
  'empty.approvals.body': "Les demandes d'approbation pour vos marques apparaissent ici.",
  'empty.library.title': 'Votre bibliothèque est vide',
  'empty.library.body':
    "Téléchargez des images et des vidéos, ou importez-les à partir d'une URL ou de l'API.",
  'empty.library.action': 'Télécharger des médias',
  'empty.automation.title': 'Pas encore de règles',
  'empty.automation.body':
    "Une règle réagit à quelque chose et propose une action. Chaque règle montre ses limites avant que vous ne l'activiez.",
  'empty.webhooks.title': 'Aucun point de terminaison',
  'empty.webhooks.body':
    'Ajoutez un point de terminaison pour recevoir des événements signés concernant la publication et les connexions.',
  'empty.searchResults.title': 'Aucun résultat pour {query}',
  'empty.searchResults.body': "Vérifiez l'orthographe ou supprimez un filtre.",
  'empty.filtered.title': 'Rien ne correspond à ces filtres',
  'empty.filtered.action': 'Effacer les filtres',
  'empty.auditLog.title': 'Aucune activité pour le moment',
  'empty.receipts.title': 'Pas encore de reçus',
  'empty.receipts.body':
    'Chaque publication produit un reçu que vous pouvez consulter et partager.',

  'loading.default': 'Chargement',
  'loading.calendar': 'Chargement de votre calendrier',
  'loading.analytics': 'Chargement des métriques',
  'loading.preview': "Construire l'aperçu",
  'loading.validating': 'Vérification par rapport aux limites actuelles de la plate-forme',
  'loading.publishing': 'Publication sur {provider}',
  'loading.uploading': 'Téléchargement {name}',
  'loading.uploadProgress': '{percent} téléchargé',
  'loading.connecting': 'Connexion à {provider}',
  'loading.savingDraft': 'Enregistrer votre brouillon',
  'loading.generatingPlan': 'Construire votre projet',
  'loading.longRunning': "Cela prend plus de temps que d'habitude. Il est toujours en marche.",

  'offline.banner': 'Vous êtes hors ligne. Les modifications sont conservées sur cet appareil.',
  'offline.draftSafe':
    'Votre brouillon est en sécurité. Il se synchronise lorsque vous êtes de nouveau en ligne.',
  'offline.publishDisabled':
    'La publication nécessite une connexion. Cela ne sera pas mis en attente silencieusement.',
  'offline.scheduleQueued':
    "Cette demande de planification est mise en file d'attente sur cet appareil et sera envoyée lorsque vous serez de nouveau en ligne.",
  'offline.reconnected': 'De retour en ligne. Synchronisation de vos modifications.',
  'offline.syncConflict':
    "Certaines modifications n'ont pas pu être fusionnées automatiquement. Vérifiez-les avant de les enregistrer.",

  'permission.denied.title': "Vous n'y avez pas accès",
  'permission.denied.role': 'Cela nécessite le {role} rôle. Tu es {currentRole}.',
  'permission.denied.scope': 'Ce titre a besoin de la portée {scope}.',
  'permission.denied.contactOwner': "Demander {owner} de l'accorder.",
  'permission.denied.brandScope': 'Votre accès est limité à {brands}.',
  'permission.readOnly': 'Cet espace de travail est en lecture seule pour le moment.',
  'permission.mfaRequired': "Confirmez avec l'authentification à deux facteurs pour continuer.",

  'rateLimit.title': 'Ralentissez un instant',
  'rateLimit.body': 'Vous avez fait {count} demandes dans {window}. La limite est {limit}.',
  'rateLimit.resetsAt': 'Cela se réinitialise à {time}.',
  'rateLimit.cheaperAlternative':
    'La planification au lieu de la publication évite désormais cette limite.',
  'rateLimit.providerCost': '{provider} frais par opération. Cette action est estimée à {amount}.',

  'incident.providerDegraded':
    '{provider} a des problèmes. Les publications programmées continuent de réessayer.',
  'incident.providerDown':
    "{provider} n'est pas disponible. Rien n'est perdu et rien n'est dupliqué.",
  'incident.isolated': 'Les autres plateformes ne sont pas affectées.',
  'incident.statusPage': 'Statut en direct par connecteur et surface',
  'incident.startedAt': 'Commencé {relativeTime}',

  'translation.incomplete':
    'Certains textes sur cet écran ne sont pas traduits en {language} encore et est montré en anglais.',
  'translation.beta': 'Cette langue est en version bêta. Signalez tout ce qui se lit mal.',

  'confirm.discardChanges.title': 'Supprimer vos modifications ?',
  'confirm.discardChanges.body': 'Cela ne peut pas être annulé.',
  'confirm.deleteItem.title': 'Supprimer {name}?',
  'confirm.deleteItem.body': 'Cela ne peut pas être annulé.',
  'confirm.cancelScheduled.title': 'Annuler cette publication programmée ?',
  'confirm.cancelScheduled.body':
    'Il ne sera pas publié. Le brouillon reste ici afin que vous puissiez le planifier à nouveau.',
  'confirm.publishNow.title': 'Publier maintenant ?',
  'confirm.publishNow.body':
    '{count, plural, one {Ceci est publié immédiatement sur # compte} many {Cette publication est publiée immédiatement sur # comptes} other {Cette publication est publiée immédiatement sur # comptes}}. Il ne peut pas être rappelé à partir de Relay.',
  'confirm.typeToConfirm': 'Taper {word} à confirmer.',
} as const;
