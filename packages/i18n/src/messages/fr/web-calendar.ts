/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'Facebook',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Threads',
  'web.provider.bluesky': 'Bluesky',
  'web.provider.mastodon': 'Mastodon',
  'web.provider.telegram': 'Telegram',
  'web.provider.reddit': 'Reddit',
  'web.provider.wordpress': 'WordPress',
  'web.provider.medium': 'Medium',
  'web.provider.devto': 'Dev.to',
  'web.provider.pinterest': 'Pinterest',
  'web.provider.discord': 'Discord',
  'web.provider.slack': 'Slack',
  'web.connection.requirement.mastodon':
    'Mastodon se connecte avec un jeton d’accès créé sur votre propre instance, pas votre mot de passe.',
  'web.connection.requirement.telegram':
    'Post Array publie en tant que bot. Ajoutez le bot au canal ou groupe où vous voulez publier.',
  'web.connection.requirement.reddit':
    'Écrire sur Reddit exige une application approuvée, et chaque post a besoin d’un titre et d’un subreddit.',
  'web.connection.requirement.wordpress':
    'Post Array publie via l’API REST du site avec un mot de passe d’application créé dans WordPress.',
  'web.connection.requirement.medium':
    'Medium se connecte via OAuth et Post Array publie des histoires publiques en Markdown.',
  'web.connection.requirement.devto':
    'Dev.to se connecte avec une clé API créée dans vos paramètres Dev.to.',
  'web.connection.requirement.pinterest':
    'Écrire sur Pinterest exige un accès d’application approuvé, et un pin exige une image et un tableau qui vous appartient.',
  'web.connection.requirement.discord':
    'Post Array publie en tant que bot. Ajoutez le bot aux serveurs et canaux où vous voulez publier.',
  'web.connection.requirement.slack':
    'Post Array publie en tant qu’app. Ajoutez l’app aux canaux où vous voulez publier.',
  'web.provider.fake': 'Connecteur de test',

  'web.accountType.personal_profile': 'Profil personnel',
  'web.accountType.creator_profile': 'Compte créateur',
  'web.accountType.business_profile': 'Compte professionnel',
  'web.accountType.page': 'Page',
  'web.accountType.organization': 'Organisation',
  'web.accountType.channel': 'Canal',
  'web.accountType.group': 'Groupe',
  'web.accountType.board': 'Conseil',
  'web.accountType.community': 'Communauté',
  'web.accountType.publication': 'Publication',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    "Tout ce qui est programmé, en attente d'approbation, publié ou bloqué, en un seul endroit.",
  'web.calendar.view.agenda': 'Ordre du jour',
  'web.calendar.view.table': 'Tableau',
  'web.calendar.view.switchLabel': 'Choisissez la façon dont le planning est organisé',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} à {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'Affichage {range} dans {timeZone}',
  'web.calendar.timeZone.workspace': 'Fuseau horaire de Workspace : {timeZone}',
  'web.calendar.timeZone.change': "Modification des paramètres de l'espace de travail",
  'web.calendar.jumpToDate': 'Aller à une date',
  'web.calendar.nowLabel': 'Maintenant',
  'web.calendar.allDayHeading': "Pas encore d'heure exacte",

  'web.calendar.filter.group': 'Groupe de clients',
  'web.calendar.filter.anyProject': "N'importe quel projet",
  'web.calendar.filter.anyAccount': "N'importe quel compte",
  'web.calendar.filter.anyPlatform': "N'importe quelle plateforme",
  'web.calendar.filter.anyStatus': "N'importe quel statut",
  'web.calendar.filter.anyLocale': "N'importe quelle langue de contenu",
  'web.calendar.filter.anyCampaign': "N'importe quelle campagne",
  'web.calendar.filter.anyGroup': 'Chaque groupe',
  'web.calendar.filter.regionLabel': 'Filtrer le planning',
  'web.calendar.bucket.scheduled': 'Programmé',
  'web.calendar.bucket.draft': 'Projets et approbations',
  'web.calendar.bucket.published': 'Publié',
  'web.calendar.bucket.failed': "A besoin d'attention",
  'web.calendar.filter.summary':
    '{count, plural, =0 {Aucun filtre} one {# filtre} many {# filtres} other {# filtres}}, {results, plural, =0 {pas de messages} one {# poste} many {# messages} other {# messages}}',

  'web.calendar.grid.label': 'Grille horaire pour {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Rien à {time} sur {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {Afficher # autre message} many {Afficher # messages supplémentaires} other {Afficher # messages supplémentaires}}',
  'web.calendar.month.label': 'Grille mensuelle pour {month}',
  'web.calendar.agenda.label': 'Ordre du jour pour {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Rien de prévu',

  'web.calendar.table.caption': 'Chaque message dans {range}, triés par heure de publication.',
  'web.calendar.table.column.time': 'Temps',
  'web.calendar.table.column.account': 'Compte',
  'web.calendar.table.column.content': 'Contenu',
  'web.calendar.table.column.language': 'Langue',
  'web.calendar.table.column.media': 'Médias',
  'web.calendar.table.column.status': 'Statut',
  'web.calendar.table.column.approver': 'Approbateur',
  'web.calendar.table.column.campaign': 'Campagne',
  'web.calendar.table.column.actions': 'Actes',
  'web.calendar.table.rowMenu': 'Actions pour {title}',
  'web.calendar.table.noApprover': 'Aucune approbation nécessaire',
  'web.calendar.table.noCampaign': 'Aucune campagne',

  'web.calendar.entry.untitled': 'Brouillon sans titre',
  'web.calendar.entry.language': 'Langue {locale}',
  'web.calendar.entry.openDetail': 'Ouvrir {title}',
  'web.calendar.entry.selected': '{title} choisi. {hint}',
  'web.calendar.detail.title': 'Publication programmée',
  'web.calendar.detail.close': 'Fermez ce message',

  'web.calendar.keyboard.title': 'Déplacer un message avec le clavier',
  'web.calendar.keyboard.body':
    "Concentrez une publication et appuyez sur Entrée pour l'ouvrir. Appuyez sur M pour récupérer un message, puis utilisez les touches fléchées pour le déplacer d'un emplacement et Entrée pour confirmer. Appuyez sur Échap pour le remettre en place.",
  'web.calendar.keyboard.pickUp': 'Déplacer ce message',
  'web.calendar.keyboard.grabbed':
    "{title} ramassé de {from}. Les touches fléchées le déplacent. Entrez confirme. L'évasion s'annule.",
  'web.calendar.keyboard.moved': 'Heure proposée {to}. Entrez confirme.',
  'web.calendar.keyboard.released': '{title} remettre à {from}.',
  'web.calendar.keyboard.stepMinutes': 'Chaque étape est {minutes} minutes.',

  'web.calendar.reschedule.title': 'Déplacer ce message ?',
  'web.calendar.reschedule.subject': '{account} sur {provider}',
  'web.calendar.reschedule.from': 'Depuis {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'À {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Déplacer le message',
  'web.calendar.reschedule.dstTitle': 'Les horloges changent entre ces deux heures',
  'web.calendar.reschedule.dstBody':
    "Le décalage dans {timeZone} est {fromOffset} à l'époque ancienne et {toOffset} à la nouvelle heure. L'heure locale que vous avez choisie est conservée, donc l'instant UTC change.",
  'web.calendar.reschedule.conflictTitle': "D'autres articles sont proches de cette fois",
  'web.calendar.reschedule.conflictBody':
    '{account} a déjà {count, plural, one {# poste} many {# messages} other {# messages}} dans {window} du temps nouveau.',
  'web.calendar.reschedule.campaignTitle': 'Conflit de campagne',
  'web.calendar.reschedule.campaignBody':
    'Campagne {campaign} court de {start} à {end}. La nouvelle heure est en dehors de cette fenêtre.',
  'web.calendar.reschedule.leadTimeTitle': "C'est très bientôt",
  'web.calendar.reschedule.leadTimeBody':
    'La nouvelle heure est {duration} à partir de maintenant. {provider} besoins {required} pour préparer les médias pour ce type de message.',
  'web.calendar.reschedule.pastTitle': 'Ce temps est passé',
  'web.calendar.reschedule.pastBody': 'Choisissez une heure dans le futur ou publiez maintenant.',

  'web.calendar.published.title': 'Cet article est déjà publié',
  'web.calendar.published.body':
    "Un message existe sur {provider} à {permalinkLabel}. Le déplacement de l'entrée dans Post Array ne déplace pas la publication sur la plateforme. Choisissez ce que vous voulez qu'il se passe.",
  'web.calendar.published.optionLocal': "Mettre à jour l'enregistrement local uniquement",
  'web.calendar.published.optionLocalHint':
    "Le reçu conserve l'heure réelle de publication. Seule l'entrée de planification bouge, votre calendrier correspond donc à votre plan.",
  'web.calendar.published.optionNew': 'Programmer une nouvelle publication à la nouvelle heure',
  'web.calendar.published.optionNewHint':
    'Cela crée un deuxième poste externe distinct. Celui déjà allumé {provider} reste en ligne.',
  'web.calendar.published.optionLabel': 'Que devrait-il arriver',

  'web.calendar.attention.title':
    '{count, plural, one {# post nécessite une décision ou une solution} many {# posts nécessitent une décision ou un correctif} other {# posts nécessitent une décision ou un correctif}}',
  'web.calendar.attention.body':
    "Ils restent ici et dans le centre d'action jusqu'à ce qu'ils soient résolus.",
  'web.calendar.attention.open': "Ouvrir le centre d'action",
  'web.calendar.attention.showOnly': 'Afficher uniquement ceux-ci',

  'web.calendar.loading': 'Chargement du planning',
  'web.calendar.error.title': "Le planning n'a pas pu être chargé",
  'web.calendar.error.body':
    "Rien de prévu n'a changé. Vos messages sont toujours publiés aux heures prévues.",
  'web.calendar.error.retry': 'Essayer à nouveau',
  'web.calendar.empty.example':
    '09:30 Europe/Berlin, X @acme, "Les premiers commentaires programmés sont en direct", Programmé, 1 image',
  'web.calendar.emptyFiltered.body':
    'Pas de message dans {range} correspond à ces filtres. Élargissez la plage ou supprimez un filtre.',
  'web.calendar.offline.title': 'Vous êtes hors ligne',
  'web.calendar.offline.body':
    "Le calendrier ci-dessous est la dernière copie chargée par cet appareil. La replanification et la publication ne sont pas disponibles jusqu'au retour de la connexion.",
  'web.calendar.rateLimited.cause':
    'Cet espace de travail lit le calendrier plus de fois que ne le permet la fenêtre actuelle.',
  'web.calendar.rateLimited.resetLabel': 'Vous pouvez réessayer dans',
  'web.calendar.rateLimited.resetUnknown': "{provider} Je n'ai pas dit quand cela se réinitialise.",
  'web.calendar.permission.requirementsLabel': 'Portée requise',
  'web.calendar.permission.title': 'Vous ne pouvez pas voir ce calendrier',
  'web.calendar.permission.body':
    "L'accès au calendrier est accordé par projet. Votre compte ne figure sur aucun des projets de cette vue.",

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Calendrier',
  'web.receipt.breadcrumb.post': 'Poste',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Chargement du récépissé de publication',
  'web.receipt.notFound.title': 'Aucun reçu avec cette référence',
  'web.receipt.notFound.body':
    "Un reçu existe une fois qu'un courrier a été expédié. Vérifiez la référence ou ouvrez la publication depuis le calendrier.",
  'web.receipt.error.title': "Le reçu n'a pas pu être chargé",
  'web.receipt.error.body': "Le reçu est immuable et n’en est pas affecté. Rien n'a été republié.",

  'web.receipt.section.summary': "Ce qui s'est passé",
  'web.receipt.section.timeline': "Chronologie de l'événement",
  'web.receipt.section.items': 'Publication racine et éléments de suivi',
  'web.receipt.section.attempts': 'Tentatives',
  'web.receipt.section.provenance': 'Provenance',
  'web.receipt.section.cost': 'Utilisation du fournisseur',
  'web.receipt.section.analytics': 'Synchronisation des analyses',
  'web.receipt.section.targets': 'Cibles dans cette campagne',

  'web.receipt.item.root': 'Message racine',
  'web.receipt.item.comment': 'Commentaire {position}',
  'web.receipt.item.thread': 'Partie filetée {position}',
  'web.receipt.item.delay': 'Fonctionne {delay} après le post racine',
  'web.receipt.item.noDelay': 'Fonctionne avec la publication racine',
  'web.receipt.item.pending': 'Pas encore commencé',
  'web.receipt.item.rootUnaffected':
    'La publication racine est en ligne. Un élément de suivi qui échoue ne change jamais cela.',

  'web.receipt.attempt.heading': 'Tentative {number}',
  'web.receipt.attempt.startedAt': 'Commencé {time}',
  'web.receipt.attempt.startedLabel': 'Commencé',
  'web.receipt.attempt.responseSummary': 'Réponse du fournisseur aseptisée',
  'web.receipt.attempt.duration': 'A pris {duration}',
  'web.receipt.attempt.httpStatus': 'Statut HTTP',
  'web.receipt.attempt.providerRequestId': 'Référence de la demande du fournisseur',
  'web.receipt.attempt.retryable': 'Réessayé automatiquement',
  'web.receipt.attempt.notRetryable': 'Pas de nouvelle tentative automatique',
  'web.receipt.attempt.nextRetry': 'Prochaine tentative de {time}',
  'web.receipt.attempt.nextRetryLabel': 'Prochaine tentative',
  'web.receipt.attempt.showResponse': 'Afficher la réponse nettoyée du fournisseur',
  'web.receipt.attempt.hideResponse': 'Masquer la réponse nettoyée du fournisseur',
  'web.receipt.attempt.none': "Une tentative, pas d'échec.",

  'web.receipt.provenance.capabilityVersion': 'Aperçu des fonctionnalités',
  'web.receipt.provenance.capabilityHint':
    "L'instantané utilisé lors de l'approbation et revérifié avant l'expédition.",
  'web.receipt.provenance.accountType': 'Type de compte',
  'web.receipt.provenance.externalAccount': 'Référence du compte externe',
  'web.receipt.provenance.workflow': 'Référence du flux de travail',
  'web.receipt.provenance.createdAt': 'Reçu écrit {time}',

  'web.receipt.approval.notRequired': 'Aucune approbation n’était requise pour cet objectif.',
  'web.receipt.approval.policy': 'Politique {policy}',
  'web.receipt.approval.unknownPolicy': 'Référence de politique non enregistrée',

  'web.receipt.cost.currency': 'Chargé en {currency}',
  'web.receipt.cost.estimatedLabel': 'Estimé avant publication',
  'web.receipt.cost.actualLabel': 'Réel rapproché',
  'web.receipt.provenance.writtenLabel': 'Reçu écrit',
  'web.receipt.cost.reconciledAt': 'Réconcilié {time}',
  'web.receipt.cost.notMetered':
    '{provider} ne facture pas par opération pour ce type de publication.',

  'web.receipt.analytics.never':
    "Les analyses n'ont pas encore été synchronisées pour cette publication.",
  'web.receipt.analytics.explain':
    "Les fournisseurs se regroupent selon leurs propres horaires. L'heure ci-dessous correspond à la dernière fois que Post Array les a lus, et non à l'heure à laquelle les chiffres étaient vrais.",

  'web.receipt.export.download': 'Téléchargez le reçu',
  'web.receipt.export.copyReference': 'Copiez la référence du reçu',
  'web.receipt.export.denied':
    "Le partage d'un reçu nécessite le rôle de propriétaire, d'administrateur ou d'approbateur. Tu es {role}.",

  'web.receipt.partial.retryFailedOnly': 'Réessayez uniquement les cibles qui ont échoué',
  'web.receipt.partial.retryHint':
    'Une nouvelle tentative ne touche jamais une cible qui a déjà produit une publication externe.',

  'web.receipt.remediation.user_action_required':
    'Cela nécessite un changement dans Post Array ou sur {provider} avant de pouvoir fonctionner à nouveau.',
  'web.receipt.remediation.content_invalid':
    "Modifiez le contenu pour qu'il passe {provider} validation, puis planifiez-la à nouveau.",
  'web.receipt.remediation.transient_provider':
    '{provider} a renvoyé une erreur temporaire. Post Array a réessayé selon son propre calendrier.',
  'web.receipt.remediation.permanent_provider':
    "{provider} l'a refusé définitivement. Réessayer le même contenu ne changera pas la réponse.",
  'web.receipt.remediation.internal':
    "C'était une faute de notre part. Il est enregistré avec la référence ci-dessous.",
  'web.receipt.remediation.unknown':
    "{provider} a renvoyé quelque chose pour lequel nous n'avons pas de règle. La réponse aseptisée est ci-dessous.",

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Comptes',
  'web.connection.tab.capabilities': 'Matrice de capacités',
  'web.connection.tab.groups': 'Groupes de clients',
  'web.connection.loading': 'Chargement des comptes connectés',
  'web.connection.error.title': "Les comptes connectés n'ont pas pu être chargés",
  'web.connection.error.body':
    "La publication n’est pas affectée. Les publications planifiées sont toujours exécutées avec l'accès stocké.",
  'web.connection.list.label': 'Comptes connectés',
  'web.connection.empty.example':
    'X, @acme, profil personnel, connecté le 12 juin par Ana Ruiz, publication et métriques, publié pour la dernière fois le 6 août',
  'web.connection.filter.provider': 'Plate-forme',
  'web.connection.filter.health': 'Santé',
  'web.connection.filter.group': 'Groupe de clients',
  'web.connection.filter.anyHealth': 'Toute santé',
  'web.connection.healthFilter.healthy': 'Fonctionnement',
  'web.connection.healthFilter.expiring_soon': 'Expire bientôt',
  'web.connection.healthFilter.expired': 'Accès expiré',
  'web.connection.healthFilter.revoked': 'Accès révoqué',
  'web.connection.healthFilter.permission_missing': 'Autorisation manquante',
  'web.connection.healthFilter.review_pending': "En attente de l'examen de la plateforme",
  'web.connection.healthFilter.paused': 'En pause',
  'web.connection.healthFilter.unknown': 'Santé indisponible',

  'web.connection.row.summaryLabel': 'Ce que ce compte peut faire',
  'web.connection.row.expand': 'Afficher le résumé complet de {account}',
  'web.connection.row.collapse': 'Masquer le résumé complet pour {account}',
  'web.connection.row.metered': 'Mesuré par opération. Estimé {amount} par publication créée.',
  'web.connection.row.limitationHeading': 'Limites sur ce compte',
  'web.connection.row.noLimitations':
    'Aucune limitation de production ou de version bêta sur ce compte.',
  'web.connection.row.beta': 'Connecteur bêta',
  'web.connection.row.betaBody':
    "Ce connecteur fonctionne, avec des limites que nous n'avons pas fini de vérifier. Vérifiez le message publié avant de vous y fier.",

  'web.connection.detail.expiryLabel': "L'accès expire",
  'web.connection.health.expiresIn': "L'accès expire {relativeTime}, sur {date}",
  'web.connection.health.noExpiry':
    "Cet accès n'expire pas selon un calendrier {provider} nous dit.",
  'web.connection.health.checkedAt': 'Santé vérifiée {relativeTime}',

  'web.connection.action.inspect': 'Inspecter les autorisations',
  'web.connection.action.viewCapabilities': "Voir ce qu'il prend en charge",
  'web.connection.action.moveGroup': 'Passer à un autre groupe',
  'web.connection.action.menu': 'Plus de propositions pour {account}',

  'web.connection.pause.title': 'Pause {account}?',
  'web.connection.resume.title': 'CV {account}?',
  'web.connection.resume.body':
    "Les publications programmées pour ce compte recommencent à être publiées aux heures planifiées. Les messages dont l'heure est déjà écoulée ne sont pas déclenchés rétroactivement.",
  'web.connection.disconnect.confirmWord': 'DÉCONNEXION',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# publication programmée} many {# posts programmés} other {# posts programmés}} car ce compte ne publiera pas.',
  'web.connection.disconnect.consequence.published':
    'Les articles déjà publiés restent en ligne {provider}. Post Array ne les supprime pas.',
  'web.connection.disconnect.consequence.analytics':
    'Les métriques déjà collectées restent dans cet espace de travail et cessent de se mettre à jour.',

  'web.connection.connect.title': 'Connecter un compte',
  'web.connection.connect.chooseProvider': 'Quelle plateforme',
  'web.connection.connect.permissionHeading': 'Ce que Post Array demandera {provider} pour',
  'web.connection.connect.requirementHeading': 'Avant de continuer',
  'web.connection.connect.continue': 'Continuez à {provider}',
  'web.connection.connect.handoffNote':
    "L'écran suivant est {provider}, et non Post Array. Post Array ne voit jamais votre mot de passe.",
  'web.connection.connect.noWriteWithoutApproval':
    "Connecter un compte ne publie rien. Chaque publication suit toujours cette politique d'approbation de l'espace de travail.",

  'web.connection.requirement.instagram':
    "La publication Instagram nécessite un compte professionnel, c'est-à-dire un compte professionnel ou créateur lié à une Page Facebook.",
  'web.connection.requirement.facebook':
    'Post Array publie sur Facebook Pages. Un profil personnel ne peut pas être une cible de publication.',
  'web.connection.requirement.linkedin':
    "Pour publier pour une organisation, vous avez besoin d'un rôle d'administrateur de contenu sur cette page LinkedIn.",
  'web.connection.requirement.youtube':
    "Jusqu'à ce que Google ait terminé l'audit de l'application, les téléchargements de ce projet sont publiés comme privés. Vous pourrez ensuite modifier la visibilité sur YouTube.",
  'web.connection.requirement.tiktok':
    'TikTok vous oblige à choisir vous-même l’audience de chaque publication. Post Array ne peut pas en présélectionner un pour vous.',
  'web.connection.requirement.x':
    'X facture par opération. Une publication contenant une URL coûte plus cher qu’une publication en texte brut, et l’estimation est affichée avant la planification.',
  'web.connection.requirement.threads':
    'La publication Threads utilise le compte lié à votre compte professionnel Instagram.',
  'web.connection.requirement.bluesky':
    "Bluesky se connecte avec un mot de passe d'application créé dans vos paramètres Bluesky, et non avec le mot de passe de votre compte.",
  'web.connection.requirement.generic':
    "Vous avez besoin d'une autorisation pour publier sur ce compte depuis la plateforme elle-même. Post Array ne peut pas l'accorder.",

  'web.connection.purpose.publish': 'Publication des publications que vous planifiez dans Post Array.',
  'web.connection.purpose.readPosts':
    "Relisant un message publié par Post Array, afin que le reçu puisse prouver qu'il est en ligne.",
  'web.connection.purpose.identity':
    'Affichage du nom exact du compte dans Post Array, afin de ne jamais publier sur le mauvais compte.',
  'web.connection.purpose.analytics':
    'Lire les métriques rapportées par cette plateforme pour vos propres publications.',
  'web.connection.purpose.refresh':
    "Maintenir l'accès en vie afin qu'une publication planifiée n'échoue pas du jour au lendemain.",
  'web.connection.purpose.chooseDestination':
    'Liste des pages et des canaux que vous pouvez choisir comme cible de publication.',

  'web.connection.permissions.title': 'Autorisations sur {account}',
  'web.connection.permissions.scopeColumn': 'Autorisation',
  'web.connection.permissions.stateColumn': 'État',
  'web.connection.permissions.purposeColumn': "Pourquoi Post Array l'utilise-t-il ?",
  'web.connection.permissions.missingWarning':
    '{count, plural, one {# autorisation est manquante} many {# autorisations sont manquantes} other {# autorisations sont manquantes}}. Reconnectez-vous et acceptez-le pour restaurer les fonctionnalités ci-dessous.',
  'web.connection.permissions.snapshot': 'Lire depuis {provider} {relativeTime}',

  'web.connection.capability.title': 'Matrice de capacités',
  'web.connection.capability.subtitle':
    'Généré à partir des définitions de connecteur versionnées dans cette version, puis révisé manuellement. Ce sont les mêmes données que le compositeur et la page de fonctionnalités publiques utilisent.',
  'web.connection.capability.tableLabel': 'Capacités par plateforme',
  'web.connection.capability.featureColumn': 'Capacité',
  'web.connection.capability.legendTitle': 'Comment lire ceci',
  'web.connection.capability.legend.supported':
    "Post Array peut le faire aujourd'hui pour un compte connecté du bon type.",
  'web.connection.capability.legend.not_implemented':
    "La plateforme propose cela et Post Array ne l'a pas encore construit. C'est sur la feuille de route du connecteur.",
  'web.connection.capability.legend.unsupported':
    'La plateforme ne propose pas cela via son API officielle, aucun outil ne peut donc le faire en toute sécurité.',
  'web.connection.capability.legend.requires_review':
    "Construit, et la plateforme ne l'accorde qu'après avoir examiné l'application ou le compte.",
  'web.connection.capability.versionLabel': 'Définitions des connecteurs',
  'web.connection.capability.version': 'Version des définitions de connecteur {version}',
  'web.connection.capability.observedAt': "Lecture d'un instantané {relativeTime}",
  'web.connection.capability.forAccount': 'Montré pour {account}',
  'web.connection.capability.noSnapshot':
    "Aucun instantané des fonctionnalités pour ce compte pour l'instant. Reconnectez-vous pour en lire un.",
  'web.connection.capability.cellLabel': '{feature} sur {provider}: {state}',

  'web.connection.group.title': 'Groupes de clients',
  'web.connection.group.listLabel': 'Groupes de clients',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Aucun compte} one {# compte} many {# comptes} other {# comptes}}',
  'web.connection.group.create': 'Créer un groupe',
  'web.connection.group.nameLabel': 'Nom du groupe',
  'web.connection.group.namePlaceholder': 'Acme UE',
  'web.connection.group.moveTitle': 'Se déplacer {account}',
  'web.connection.group.moveLabel': 'Passer à',
  'web.connection.group.moveConfirm': 'Déplacer le compte',
  'web.connection.group.movedAnnouncement': '{account} déménagé à {group}',
  'web.connection.group.filterCalendarHint':
    'Un groupe filtre le calendrier et les analyses. Le déplacement d’un compte conserve toutes les publications, reçus et statistiques dont il dispose déjà.',
  'web.connection.group.empty.title': "Aucun groupe de clients pour l'instant",
  'web.connection.group.empty.body':
    'Un projet réunit un produit ou un client et ses comptes connectés dans le calendrier et les analyses.',

  'web.connection.incident.title': "Ce compte a besoin d'attention",
  'web.connection.incident.remediationHeading': "Ce qu'il faut faire",
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# post programmé est en attente} many {# posts programmés sont en attente} other {# posts programmés sont en attente}} pour ce compte.',
  'web.connection.incident.nothingLost': "Rien n'est perdu et rien n'est dupliqué.",
  'web.connection.projectScope.title': 'Affichage des canaux de {project}',
  'web.connection.projectScope.body':
    'Les nouveaux canaux se connectent à ce projet. Changez de projet dans la barre du haut pour gérer un autre ensemble.',
  'web.connection.projectMissing.title': 'Créez un projet avant de connecter un canal',
  'web.connection.projectMissing.body':
    'Les projets gardent séparés les canaux, les médias, les brouillons et les calendriers de produits ou de clients différents.',
} as const;
