/**
 * Web surface strings for Analytics, Automation Rules, RSS autopost and
 * tracked links.
 *
 * `analytics.ts` and `automation.ts` hold the domain vocabulary shared by every
 * surface (metric names, trigger sentences, provider caveats). This file holds
 * what only the web screens need: column headings, filter labels, wizard steps,
 * the sentence builder chrome and the per screen empty, error, offline,
 * permission and rate limit copy.
 *
 * Every leaf name here is new. Nothing in this file overwrites a key defined in
 * `analytics.ts` or `automation.ts`, which is asserted by `lint.test.ts`.
 */
export const webAnalyticsMessages = {
  /* ======================================================================
     Analytics shell
     ====================================================================== */
  'analytics.chart.legend': 'Séries présentées dans ce tableau',
  'analytics.tab.overview': 'Aperçu',
  'analytics.tab.experiments': 'Expériences',
  'analytics.tab.links': 'Liens suivis',
  'analytics.tab.label': "Sections d'analyse",

  'analytics.question.baseline': 'Quels messages se sont éloignés de votre propre référence ?',
  'analytics.question.baselineHelp':
    'Chaque publication est comparée à vos propres publications récentes sur le même compte et dans le même format. Rien ici ne vous compare à un autre espace de travail ou à une autre entreprise.',
  'analytics.question.accounts': 'Quels comptes nécessitent une attention particulière ?',
  'analytics.question.next': 'Qu’est-ce qui vaut la peine d’être testé ensuite ?',

  'analytics.filter.brand': 'Brand',
  'analytics.filter.accounts': 'Comptes',
  'analytics.filter.allAccounts': 'Tous les comptes connectés',
  'analytics.filter.range': 'Plage de dates',
  'analytics.filter.format': 'Format du contenu',
  'analytics.filter.allFormats': 'Tous les formats',
  'analytics.filter.comparePrevious': 'Comparer avec la période précédente',
  'analytics.filter.applied':
    '{count, plural, =0 {Aucun filtre} one {# filtre} many {# filtres} other {# filtres}} appliqué. {results, plural, =0 {Aucun message ne correspond} one {# poster des correspondances} many {# posts correspondent} other {# posts correspondent}}.',

  'analytics.rankMetric.label': 'Classer les publications par',
  'analytics.rankMetric.help':
    'Il n’y a pas de score combiné dans Relay. Choisissez une métrique dont vous faites confiance à la définition et le tableau est trié en fonction de cette seule métrique.',
  'analytics.rankMetric.chosen':
    'Classé par {metric}, tel que rapporté par chaque fournisseur de compte.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Conscience',
  'analytics.outcome.awarenessHelp':
    "Combien de fois le courrier a été livré ou vu. Les fournisseurs comptent cela différemment, de sorte qu'une valeur n'est comparable à elle-même qu'au fil du temps.",
  'analytics.outcome.consumption': 'Consommation',
  'analytics.outcome.consumptionHelp':
    'Quelle quantité de message les gens ont réellement regardé ou lu.',
  'analytics.outcome.interaction': 'Interaction',
  'analytics.outcome.interactionHelp':
    'Ce que les gens ont fait sur la plateforme : likes, commentaires, partages et sauvegardes.',
  'analytics.outcome.conversion': 'Conversion',
  'analytics.outcome.conversionHelp':
    'Ce que les gens ont fait après avoir quitté la plateforme. Seuls les liens suivis peuvent répondre à cette question, et uniquement pour les liens que vous avez choisi de suivre.',
  'analytics.outcome.separateNote':
    'Ces quatre groupes sont comptés séparément. Les additionner compterait la même personne plus d’une fois.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Articles publiés dans la plage sélectionnée, chacun étant comparé à votre propre référence récente.',
  'analytics.table.post': 'Poste',
  'analytics.table.account': 'Compte',
  'analytics.table.format': 'Format',
  'analytics.table.published': 'Publié',
  'analytics.table.value': 'Valeur',
  'analytics.table.delta': 'Par rapport à la ligne de base',
  'analytics.table.sample': 'Échantillon',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Preuve',
  'analytics.table.openEvidence': 'Montrer les preuves de {post}',
  'analytics.table.rowActions': 'Actions pour {post}',
  'analytics.table.openPost': 'Statistiques des publications ouvertes',
  'analytics.table.openReceipt': 'Récépissé de publication ouverte',
  'analytics.table.noBaseline': 'Pas encore de référence',
  'analytics.table.noBaselineReason':
    "Moins de {required} des postes comparables existent sur ce compte. Une comparaison serait du bruit, donc aucun n'est affiché.",
  'analytics.table.sortBy': 'Trier par {column}',
  'analytics.table.detailToggle': 'Détails',

  'analytics.delta.above': '{percent} au-dessus de la ligne de base',
  'analytics.delta.below': '{percent} en dessous de la ligne de base',
  'analytics.delta.level': 'Conformément à la ligne de base',
  'analytics.delta.unavailable': 'Aucune comparaison',

  'analytics.evidence.title': 'Comment cette comparaison a été faite',
  'analytics.evidence.baseline':
    'Ligne de base : la médiane {metric} du précédent {count, plural, one {# post comparable} many {# posts comparables} other {# posts comparables}} sur {account}.',
  'analytics.evidence.comparableBy':
    'Comparable signifie le même compte, le même format de contenu ({format}) et une heure de publication dans la même période.',
  'analytics.evidence.postsUsed': 'Messages utilisés pour la référence',
  'analytics.evidence.excluded':
    "{count, plural, =0 {Aucun message n'a été exclu} one {# post a été exclu} many {# posts ont été exclus} other {# posts ont été exclus}} parce que la métrique n'était pas disponible pour eux.",
  'analytics.evidence.smallSample':
    'Avec {count, plural, one {# poste} many {# messages} other {# messages}} dans la ligne de base, un seul message inhabituel déplace la médiane sur une longue distance. Traitez cela comme un signal pour tester à nouveau, et non comme un résultat.',
  'analytics.evidence.confounders': 'Ce que cela ne tient pas compte',
  'analytics.evidence.confounder.time':
    'L’heure de publication variait selon les publications de base.',
  'analytics.evidence.confounder.format':
    'Les publications d’images et les publications vidéo ne sont pas directement comparables ici.',
  'analytics.evidence.confounder.followers':
    'Les adeptes comptent sur {account} changé par {percent} durant cette période.',
  'analytics.evidence.confounder.paid':
    "Relay ne peut pas dire si l'un de ces messages a reçu une distribution payante.",
  'analytics.evidence.confounder.provider':
    "{provider} changé la façon dont il rapporte {metric} à l'intérieur de cette période.",

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'Quoi {metric} moyens',
  'analytics.definition.inlineHeading': 'Définition',
  'analytics.definition.observedAt': 'Observé {dateTime}.',
  'analytics.definition.sourceLink': 'Documentation du fournisseur',
  'analytics.definition.verifiedOn':
    'Vérifié par rapport à la documentation du fournisseur sur {date}.',
  'analytics.definition.panelTitle': 'Définitions de métriques dans cette vue',
  'analytics.definition.panelIntro':
    "Chaque numéro sur cet écran provient d'un champ de fournisseur nommé. Les définitions ci-dessous sont également répétées à côté de chaque valeur, donc rien d'important ne se trouve dans une info-bulle.",
  'analytics.definition.aggregation.sum': 'Agrégé en ajoutant chaque observation.',
  'analytics.definition.aggregation.average': 'Agrégé comme moyenne.',
  'analytics.definition.aggregation.median': 'Agrégé en médiane.',
  'analytics.definition.aggregation.last': "L'observation la plus récente.",
  'analytics.definition.aggregation.delta':
    'Le changement entre la première et la dernière observation.',
  'analytics.definition.aggregation.none': 'Signalé comme une seule observation.',
  'analytics.definition.denominator.none': "Il s'agit d'un décompte, pas d'un taux.",
  'analytics.definition.historyWindow':
    "{provider} garde {days, plural, one {# jour} many {# jours} other {# jours}} d'histoire pour ce domaine.",
  'analytics.definition.historyWindowNone':
    "{provider} n'indique pas de limite d'historique pour ce champ.",

  'analytics.definition.term.providerField': 'Champ Fournisseur',
  'analytics.definition.term.unit': 'Unité',
  'analytics.definition.term.denominator': 'Dénominateur',
  'analytics.definition.term.aggregation': 'Comment il est agrégé',
  'analytics.definition.term.history': 'Historique que le fournisseur conserve',
  'analytics.definition.term.definition': 'Ce que le fournisseur dit que cela signifie',

  'analytics.unit.count': "Un décompte d'événements",
  'analytics.unit.seconds': 'Secondes',
  'analytics.unit.percent': 'Un pourcentage que le fournisseur a déjà calculé',
  'analytics.unit.ratio': 'Un ratio Relay calculé à partir de deux champs fournisseur',
  'analytics.unit.currency_minor': "Une somme d'argent en unités mineures",

  'analytics.denominator.none':
    "Il s'agit d'un décompte, pas d'un taux. Il n’y a pas de dénominateur.",
  'analytics.denominator.impressions': 'Divisé par impressions',
  'analytics.denominator.reach': 'Divisé par portée',
  'analytics.denominator.views': 'Divisé par vues',
  'analytics.denominator.followers': "Divisé par le nombre de followers au moment de l'observation",
  'analytics.denominator.sessions': 'Divisé par séances',

  'analytics.format.text': 'Texte',
  'analytics.format.image': 'Image',
  'analytics.format.carousel': 'Carrousel',
  'analytics.format.video': 'Vidéo',
  'analytics.format.short_video': 'Courte vidéo',
  'analytics.format.long_video': 'Longue vidéo',
  'analytics.format.document': 'Document',
  'analytics.format.thread': 'Fil',

  'analytics.value.unavailableReason.notImplemented':
    "Relay n'a pas créé le mappage pour cette métrique sur {provider} encore.",
  'analytics.value.estimated': 'Estimé',
  'analytics.value.estimatedMethod': 'Méthode: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': "D'où viennent ces chiffres",
  'analytics.freshness.intro':
    "Les fournisseurs se regroupent selon leur propre horaire. Rien sur cet écran n'est en direct.",
  'analytics.freshness.accountRow': '{account} sur {provider}',
  'analytics.freshness.never': 'Jamais synchronisé',
  'analytics.freshness.nextAttempt': 'Prochaine tentative de synchronisation {relativeTime}.',
  'analytics.freshness.openStatus': 'Statut du fournisseur',

  'analytics.accounts.title': 'Comptes qui nécessitent une attention particulière',
  'analytics.accounts.empty':
    "Chaque compte connecté a renvoyé des données au cours de cette période. Rien n'a besoin de toi ici.",
  'analytics.accounts.reason.permission':
    "L'autorisation d'analyse n'a pas été accordée lorsque ce compte a été connecté.",
  'analytics.accounts.reason.expired':
    "L'accès a expiré, donc aucune statistique n'a été collectée depuis {date}.",
  'analytics.accounts.reason.stale':
    'La dernière synchronisation réussie a eu lieu {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    "{count, plural, one {# tentative de synchronisation} many {# tentatives de synchronisation} other {# tentatives de synchronisation}} échoué d'affilée. La raison enregistrée était {reason}.",
  'analytics.accounts.reason.noPosts':
    "Rien n'a été publié sur ce compte dans la plage sélectionnée.",

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Observations',
  'analytics.observations.intro':
    'Ce sont des descriptions de ce que montrent les chiffres. Ce ne sont pas des prédictions et elles n’établissent pas de cause.',
  'analytics.observations.empty':
    'Il n’y a pas encore suffisamment d’histoire publiée pour décrire une tendance. Publiez quelques articles supplémentaires sur le même compte et dans le même format.',
  'analytics.observations.citedPosts': 'Basé sur',
  'analytics.observations.citedPeriod': 'Période: {start} à {end}.',
  'analytics.observations.nextTestTitle': 'Un test que vous pourriez exécuter ensuite',
  'analytics.observations.nextTestBody':
    'Publier {count, plural, one {# autre message} many {# autres messages} other {# autres messages}} sur {account} changer seulement {variable}, puis comparez la même métrique. Marquez-le comme une expérience avant de le publier afin que la comparaison soit planifiée plutôt que trouvée par la suite.',
  'analytics.observations.tagFirst': 'Taguer une expérience',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} au fil du temps',
  'analytics.chart.summary':
    '{metric} sur {account}, {count, plural, one {# indiquer} many {# points} other {# points}} depuis {start} à {end}.',
  'analytics.chart.showTable': 'Afficher sous forme de tableau',
  'analytics.chart.hideTable': 'Cacher le tableau',
  'analytics.chart.tableCaption': "La même série qu'un tableau.",
  'analytics.chart.columnPeriod': 'Période',
  'analytics.chart.columnValue': 'Valeur',
  'analytics.chart.gapLabel': 'Aucune donnée collectée',
  'analytics.chart.gapExplained':
    'Une rupture de ligne signifie qu’aucune observation n’a été collectée pour cette période. Cela ne veut pas dire zéro.',
  'analytics.chart.annotation': 'Annotation',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': "Aucune observation n'a été collectée dans cette plage.",

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Planifier une expérience',
  'analytics.experiment.empty':
    "Aucune expérience pour l'instant. Une expérience est une comparaison que vous décidez avant de publier, et qui est la seule qui puisse répondre à une question.",
  'analytics.experiment.emptyExample':
    'Exemple : publiez deux fois la même annonce sur X, une fois avec le lien dans la publication et une fois avec le lien dans le premier commentaire, puis comparez les clics sur les liens sur 72 heures.',
  'analytics.experiment.name': "Qu'est-ce que tu testes",
  'analytics.experiment.namePlaceholder': 'Premier commentaire à 5 minutes contre 30 minutes',
  'analytics.experiment.hypothesisPlaceholder':
    'Un délai plus court avant que le premier commentaire obtienne plus de réponses sur X.',
  'analytics.experiment.variantLabel': 'Variante {index}',
  'analytics.experiment.variantDescription': 'Ce qui est différent dans cette variante',
  'analytics.experiment.addVariant': 'Ajouter une variante',
  'analytics.experiment.removeVariant': 'Supprimer la variante {index}',
  'analytics.experiment.accounts': 'Comptes inclus',
  'analytics.experiment.windowHelp':
    "Les métriques continuent d'évoluer après la mise en ligne d'une publication. Corrigez la fenêtre maintenant afin que la comparaison ne soit pas effectuée à un moment qui convient à une variante.",
  'analytics.experiment.windowDays':
    "Mesurer pour {count, plural, one {# jour} many {# jours} other {# jours}} après chaque publication d'article",
  'analytics.experiment.minSample': 'Nombre minimum de publications par variante',
  'analytics.experiment.minSampleHelp':
    'En dessous de ce décompte, le résultat est affiché comme non concluant plutôt que comme gagnant.',
  'analytics.experiment.status.planned': 'Prévu',
  'analytics.experiment.status.collecting':
    'Collectionner. {published} de {target} articles publiés.',
  'analytics.experiment.status.inconclusive': 'Complet, pas de différence nette',
  'analytics.experiment.result.difference':
    '{variant} enregistré {percent} plus {metric} que {otherVariant}.',
  'analytics.experiment.result.noDifference':
    "Les deux variantes sont dans {percent} les uns des autres sur {metric}. C'est dans la fourchette dans laquelle ces messages varient de toute façon.",
  'analytics.experiment.result.association':
    'Il s’agit d’une association mesurée sur {count, plural, one {# poste} many {# messages} other {# messages}}. Cela ne prouve pas que le changement ait causé la différence.',
  'analytics.experiment.result.unavailable':
    "{metric} n'était pas disponible pour {count, plural, one {# poste} many {# messages} other {# messages}} dans cette expérience, ces publications sont donc exclues plutôt que comptées comme zéro.",
  'analytics.experiment.result.title': 'Résultat',
  'analytics.experiment.completeNow': 'Fermer cette expérience',
  'analytics.experiment.completeConfirm':
    'La fermeture arrête la collecte. Les articles restent publiés et les numéros restent disponibles.',
  'analytics.experiment.postsTitle': 'Messages dans ce test',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Chargement des analyses pour les comptes sélectionnés',
  'analytics.state.loadingProvider': 'Récupération {provider} analytique',
  'analytics.state.empty': 'Rien de publié dans cette gamme',
  'analytics.state.emptyBody':
    'Analytics décrit les publications déjà publiées. Publiez quelque chose ou élargissez la plage de dates.',
  'analytics.state.emptyExample':
    'Une fois qu\'une publication est en ligne, vous verrez une ligne comme : X @acme, "Launch thread", 12 400 impressions, 58 % au-dessus de votre médiane des 10 précédentes.',
  'analytics.state.errorTitle': 'Impossible de charger les analyses',
  'analytics.state.errorBody':
    "Aucun numéro n'est affiché plutôt qu'un numéro deviné. Vos publications et reçus ne sont pas affectés.",
  'analytics.state.partialTitle': '{loaded} de {total} les comptes ont renvoyé des données',
  'analytics.state.partialBody':
    "Les comptes qui ont répondu sont affichés avec leur propre fraîcheur. Les autres sont répertoriés avec la raison pour laquelle ils ne l'ont pas fait.",
  'analytics.state.partialSucceeded': 'Données renvoyées',
  'analytics.state.partialFailed': "N'a pas renvoyé de données",
  'analytics.state.offlineTitle': 'Vous êtes hors ligne',
  'analytics.state.offlineBody':
    'Les chiffres ci-dessous ont été chargés avant la coupure de la connexion, ils sont donc plus anciens que ce que suggèrent les étiquettes de fraîcheur.',
  'analytics.state.permissionTitle':
    'Vous ne pouvez pas voir les analyses dans cet espace de travail',
  'analytics.state.permissionBody':
    "Les analyses nécessitent le rôle d'analyste ou un rôle supérieur. Un propriétaire ou un administrateur de cet espace de travail peut l'accorder.",
  'analytics.state.rateLimitTitle': "{provider} est-ce que le débit limite les demandes d'analyse",
  'analytics.state.rateLimitCause':
    'Le compte a utilisé sa part du quota du fournisseur pour cette fenêtre. Relay ne réessaye pas plus fort, car cela retarderait la publication.',
  'analytics.state.rateLimitAlternative':
    'Affinez la plage de dates ou le filtre de compte, qui demande moins au fournisseur.',
  'analytics.state.rateLimitReset': 'Reprise des demandes',
  'analytics.state.reference': 'Référence diagnostique',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Créer un lien suivi',
  'analytics.links.empty': "Aucun lien suivi pour l'instant",
  'analytics.links.emptyBody':
    "Un lien suivi est une URL courte vers laquelle Relay redirige, afin que vous puissiez voir les clics même lorsqu'une plate-forme n'en signale aucun. La destination d'origine n'est jamais modifiée sans une entrée d'audit.",
  'analytics.links.emptyExample':
    'Exemple : relay.to/a7Kq2 redirige vers acme.com/blog/launch avec la campagne q3-launch.',
  'analytics.links.table.caption':
    'Liens suivis dans cet espace de travail et nombre de clics de première partie.',
  'analytics.links.campaign': 'Campagne',
  'analytics.links.created': 'Créé',
  'analytics.links.usedIn':
    '{count, plural, =0 {Pas encore utilisé dans un article} one {Utilisé dans # post} many {Utilisé dans # posts} other {Utilisé dans # posts}}',
  'analytics.links.state.active': 'Actif',
  'analytics.links.state.expired': 'Expiré {date}',
  'analytics.links.state.disabled': 'Désactivé',
  'analytics.links.state.disabledAt': 'Désactivé le {date}. Cette URL courte ne redirige plus.',
  'analytics.links.state.blocked': 'Bloqué pour des raisons de sécurité',
  'analytics.links.state.blockedBody':
    'Cette redirection est indisponible car sa destination a échoué à un contrôle de sécurité. Modifiez la destination ou contactez le support.',
  'analytics.links.state.disabledReason':
    'Désactivé par {actor} sur {date}. Raison enregistrée : {reason}.',
  'analytics.links.detailTitle': 'Lien suivi {slug}',
  'analytics.links.exactRedirect': 'Redirection exacte',
  'analytics.links.exactRedirectHelp':
    "Il s'agit de la destination qu'un visiteur atteint actuellement, y compris tous les paramètres UTM, affichés dans leur intégralité et non abrégés.",
  'analytics.links.editDestination': 'Changer la destination',
  'analytics.links.editDestinationWarning':
    'La modification de la destination affecte chaque endroit où ce lien a déjà été publié. Les rapports pour les périodes précédant le changement conservent la destination qui était active à ce moment-là.',
  'analytics.links.editDestinationAudit':
    "Le changement est enregistré dans le journal d'audit avec votre nom, l'ancienne destination et la nouvelle.",
  'analytics.links.destinationHistory': 'Historique des destinations',
  'analytics.links.destinationHistoryRow': '{destination}, actif depuis {start} à {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, actif depuis {start}',
  'analytics.links.domainLabel': 'Domaine court',
  'analytics.links.domainDefault': 'Domaine par défaut Relay',
  'analytics.links.domainVerified': 'Vérifié par DNS sur {date}',
  'analytics.links.domainPending': "En attente de l'enregistrement DNS",
  'analytics.links.domainPendingHelp':
    "Ajoutez l'enregistrement TXT ci-dessous à {domain}, puis vérifiez à nouveau. Jusqu'à ce qu'il soit vérifié, ce domaine ne peut pas être sélectionné pour un nouveau lien.",
  'analytics.links.domainFailed': "L'enregistrement DNS ne correspond pas {date}",
  'analytics.links.domainCheck': 'Vérifiez à nouveau le DNS',
  'analytics.links.expiry': 'Expiration',
  'analytics.links.expiryNone': "Pas de date d'expiration fixée",
  'analytics.links.expiryHelp':
    "Après l'expiration, le lien renvoie une page simple indiquant qu'il est terminé. Il n’est jamais pointé silencieusement ailleurs.",
  'analytics.links.disable': 'Désactivez ce lien maintenant',
  'analytics.links.disableTitle': 'Désactiver {slug}?',
  'analytics.links.disableBody':
    "Les visiteurs accèdent à une page indiquant que le lien n'est plus disponible. Les articles publiés contiennent toujours l’URL courte, elle est donc visible par toute personne qui clique.",
  'analytics.links.disableReason': 'Raison de la désactivation',
  'analytics.links.enable': 'Activez à nouveau ce lien',
  'analytics.links.abuseTitle': 'Signaler un abus de ce lien',
  'analytics.links.abuseBody':
    "Si cette URL courte est utilisée pour quelque chose que vous n'aviez pas prévu, signalez-le et la redirection sera suspendue pendant son examen.",
  'analytics.links.abuseAction': 'Signaler ce lien',
  'analytics.links.measurementLabel': 'Mesure de redirection de première partie',
  'analytics.links.measurementExplained':
    "Relay compte une requête lorsque le service de redirection est demandé pour cette URL. Un clic dédupliqué supprime les demandes répétées du même visiteur dans une courte fenêtre, et les demandes correspondant aux modèles de robot d'exploration connus sont exclues plutôt que supprimées.",
  'analytics.links.botsNote':
    '{count, plural, one {# demande} many {# demandes} other {# demandes}} ont été classés comme automatisés et sont exclus du décompte des déduplications.',
  'analytics.links.series.title': 'Requêtes et clics dédupliqués au fil du temps',
  'analytics.links.series.requests': 'Total des demandes',
  'analytics.links.series.clicks': 'Clics dédupliqués',
  'analytics.links.breakdownTitle': "D'où viennent les clics",
  'analytics.links.breakdown.share': '{percent} de clics dédupliqués',
  'analytics.links.referrer.direct': 'Aucun référent envoyé',
  'analytics.links.referrer.social': 'Plateforme sociale',
  'analytics.links.referrer.search': 'Moteur de recherche',
  'analytics.links.referrer.email': 'Client de messagerie',
  'analytics.links.referrer.other': 'Autre site internet',
  'analytics.links.device.mobile': 'Mobile',
  'analytics.links.device.desktop': 'Bureau',
  'analytics.links.device.tablet': 'Comprimé',
  'analytics.links.device.unknown': 'Non déterminé',
  'analytics.links.countryUnknown': 'Pays non déterminé',
  'analytics.links.lastEventLabel': 'Dernier clic',
  'analytics.links.noEvents': "Aucun clic enregistré pour l'instant",
  'analytics.links.noEventsBody':
    "Ce lien n'a pas été demandé depuis sa création. C’est un vrai zéro, mesuré par notre propre service de redirection.",
  'analytics.links.compareWarning':
    '{provider} rapports {providerValue} clics sur le lien pour cet article. Relay enregistré {relayValue} clics dédupliqués. Les deux comptent des événements différents et aucun ne remplace l’autre.',
  'analytics.links.errorTitle': "Les statistiques de lien n'ont pas pu être chargées",
  'analytics.links.errorBody':
    "Le service de redirection fonctionne toujours, le lien continue donc d'envoyer les visiteurs vers sa destination. Seul le reporting est concerné.",
  'analytics.links.createDestination': 'URL de destination',
  'analytics.links.createDestinationHelp':
    "Il doit s'agir d'une adresse https publique. Les adresses de réseau privé et les chaînes de redirection sont rejetées par le service de redirection.",
  'analytics.links.createCampaign': 'Nom de la campagne',
  'analytics.links.createSlug': 'Fin personnalisée',
  'analytics.links.createSlugHelp':
    'Laissez ce champ vide et Relay génère une courte fin aléatoire.',
  'analytics.links.createUtm': 'Paramètres UTM',
  'analytics.links.blockedScheme': 'Seules les destinations https sont acceptées.',
  'analytics.links.blockedPrivate':
    "Cette adresse se trouve sur un réseau privé, le service de redirection ne l'acceptera donc pas.",

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Règles',
  'automation.tab.feeds': 'Flux RSS',
  'automation.tab.label': "Sections d'automatisation",

  'automation.rules.table.caption': "Règles d'automatisation dans cet espace de travail.",
  'automation.rules.table.rule': 'Règle',
  'automation.rules.table.state': 'État',
  'automation.rules.table.accounts': 'Comptes',
  'automation.rules.table.lastRun': 'Dernière course',
  'automation.rules.table.nextCheck': 'Vérification suivante',
  'automation.rules.neverRun': 'Pas encore exécuté',
  'automation.rules.emptyExample':
    "Exemple : lorsqu'un nouvel élément apparaît dans le flux du blog Acme, si la langue est l'anglais, créez un brouillon à partir du modèle d'annonce du blog et demandez l'approbation.",
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {Aucun compte sélectionné} one {# compte} many {# comptes} other {# comptes}}',
  'automation.rules.openRule': 'Ouvrir {name}',
  'automation.rules.duplicateRule': 'Double {name}',
  'automation.rules.deleteTitle': 'Supprimer {name}?',
  'automation.rules.deleteBody':
    "La règle s'arrête immédiatement et son historique d'exécution est conservé pour le journal d'audit. Les publications déjà créées ne sont pas affectées.",

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed':
    'un commentaire ou un élément de fil de discussion planifié échoue',

  'automation.condition.timeWindow': 'le temps est entre {start} et {end} dans {timeZone}',
  'automation.condition.domainPresent': 'le texte renvoie à {domain}',
  'automation.condition.hashtagPresent': 'le texte contient le hashtag {hashtag}',
  'automation.condition.providerCapability': 'le compte peut réellement faire {capability}',
  'automation.condition.planStatus': "l'abonnement est actif",

  'automation.action.continueSequence':
    'continuer le fil de discussion ou la séquence de commentaires préparés',
  'automation.action.notifyEmail': 'envoyer un email à {target}',
  'automation.action.notifyWebhook': 'envoyer un webhook à {target}',
  'automation.action.pauseConnection': 'suspendre le compte concerné',
  'automation.action.quotePost': 'citer le message source une fois',
  'automation.action.followUpComment': 'ajouter un commentaire préparé sur la publication source',

  'automation.param.feed': 'Alimentation',
  'automation.param.template': 'Modèle',
  'automation.param.signature': 'Signature',
  'automation.param.disclosure': 'Divulgation',
  'automation.param.locale': 'Langue',
  'automation.param.brand': 'Brand',
  'automation.param.campaign': 'Campagne',
  'automation.param.account': 'Compte',
  'automation.param.platform': 'Plate-forme',
  'automation.param.contentType': 'Type de contenu',
  'automation.param.keyword': 'Mot clé',
  'automation.param.hashtag': 'Hashtag',
  'automation.param.domain': 'Domaine',
  'automation.param.capability': 'Capacité',
  'automation.param.timeZone': 'Fuseau horaire',
  'automation.param.startTime': 'Depuis',
  'automation.param.endTime': 'À',
  'automation.param.duration': 'Durée',
  'automation.param.metric': 'Métrique',
  'automation.param.value': 'Valeur',
  'automation.param.target': 'Envoyer à',
  'automation.param.time': 'Temps',
  'automation.param.cadence': 'À quelle fréquence',
  'automation.param.notSet': 'pas réglé',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Nom de la règle',
  'automation.editor.namePlaceholder': 'Bloguer sur les réseaux sociaux',
  'automation.editor.when': 'Quand',
  'automation.editor.if': 'Si',
  'automation.editor.then': 'Alors',
  'automation.editor.after': 'Après',
  'automation.editor.until': "Jusqu'à",
  'automation.editor.sentenceLabel': 'Phrase de règle',
  'automation.editor.readBack': "Relisez la phrase avant de l'activer. C'est toute la règle.",
  'automation.editor.chooseTrigger': 'Choisissez ce qui déclenche cette règle',
  'automation.editor.addCondition': 'Ajouter une condition',
  'automation.editor.addAction': 'Ajouter une action',
  'automation.editor.removeCondition': 'Supprimer la condition {label}',
  'automation.editor.removeAction': "Supprimer l'action {label}",
  'automation.editor.moveActionUp': 'Se déplacer {label} plus tôt',
  'automation.editor.moveActionDown': 'Se déplacer {label} plus tard',
  'automation.editor.actionOrder': "Les actions s'exécutent dans cet ordre, de haut en bas.",
  'automation.editor.noConditions':
    "Aucune condition. La règle s'exécute à chaque fois qu'elle est déclenchée.",
  'automation.editor.noActions':
    "Aucune action pour l'instant. Une règle sans action ne peut pas être enregistrée.",
  'automation.editor.delayNone': 'pas de retard',
  'automation.editor.delayLabel': "Délai avant l'exécution des actions",
  'automation.editor.endLabel': "Quand cette règle s'arrête",
  'automation.editor.end.manual': "J'éteins ça",
  'automation.editor.end.date': 'une date que je choisis',
  'automation.editor.end.count':
    'il a couru {count, plural, one {# temps} many {# fois} other {# fois}}',
  'automation.editor.end.dateValue': 'Arrêtez-vous',
  'automation.editor.end.countValue': 'Arrêtez-vous après autant de courses',
  'automation.editor.parameterFor': 'Paramètres pour {label}',
  'automation.editor.saveDraft': 'Enregistrer comme brouillon',
  'automation.editor.savedAt': 'Enregistré {time}',
  'automation.editor.unsaved': 'Modifications non enregistrées',

  'automation.editor.view.sentence': 'Phrase',
  'automation.editor.view.structured': 'Structuré',
  'automation.editor.view.api': 'Représentation API',
  'automation.editor.view.label': 'Vue Éditeur',
  'automation.editor.apiHelp':
    'C’est exactement ce qu’envoient l’API REST, la CLI et le serveur MCP. Le modifier ici et revenir à la phrase conserve tous les champs.',
  'automation.editor.apiInvalid':
    "Il ne s'agit pas d'une règle JSON valide, elle n'a donc pas été appliquée : {reason}",
  'automation.editor.apiApply': 'Appliquer ce JSON',
  'automation.editor.structuredHelp':
    "La même règle que les champs. Utilisez-le lorsqu'une règle comporte de nombreuses conditions et que la phrase devient longue.",

  'automation.editor.error.noAction': "Ajoutez au moins une action avant d'enregistrer.",
  'automation.editor.error.noTrigger': 'Choisissez un déclencheur avant de sauvegarder.',
  'automation.editor.error.noAccounts':
    'Choisissez au moins un compte sur lequel cette règle peut agir.',
  'automation.editor.error.missingParameter': "{label} a besoin d'une valeur.",
  'automation.editor.error.summary':
    '{count, plural, one {# chose a besoin de votre attention} many {# choses nécessitent votre attention} other {# choses nécessitent votre attention}} avant que cette règle puisse être enregistrée.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': "Qu'est-ce qui déclenche cette règle",
  'automation.picker.conditionTitle': 'Ajouter une condition',
  'automation.picker.actionTitle': 'Ajouter une action',
  'automation.picker.search': 'Filtrer cette liste',
  'automation.picker.noResults': 'Rien dans cette liste ne correspond à ce que vous avez tapé.',
  'automation.picker.groupContent': 'Contenu',
  'automation.picker.groupPublishing': 'Édition',
  'automation.picker.groupNotify': 'Personnes et systèmes',
  'automation.picker.groupControl': 'Contrôle des règles',
  'automation.picker.groupSchedule': 'Temps',
  'automation.picker.groupExternal': 'Événements externes',
  'automation.picker.groupMeasurement': 'Mesures',
  'automation.picker.hiddenForProvider':
    "{count, plural, one {# l'action est} many {# actions sont} other {# actions sont}} non répertorié car les comptes sélectionnés ne peuvent pas les exécuter.",
  'automation.picker.hiddenDetail': "{action} n'est pas disponible pour {provider}. {reason}",
  'automation.picker.consequential': 'Crée quelque chose sur une plateforme',
  'automation.picker.internalOnly': "Reste à l'intérieur de Relay",

  'automation.accounts.label': 'Comptes sur lesquels cette règle peut agir',
  'automation.accounts.help':
    "Une règle ne peut jamais toucher un compte qui n'est pas répertorié ici, quelles que soient ses conditions.",
  'automation.accounts.none': 'Aucun compte sélectionné pour le moment',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Règles de mesure pour ce déclencheur',
  'automation.threshold.intro':
    'Une règle qui réagit à un nombre doit savoir quel nombre, mesuré sur quelle période et à quelle fréquence elle peut agir.',
  'automation.threshold.metric': 'Métrique à surveiller',
  'automation.threshold.value': 'Valeur seuil',
  'automation.threshold.window': 'Fenêtre de mesure',
  'automation.threshold.windowHelp':
    'Compté à partir du moment où le message source a été publié. En dehors de cette fenêtre, la règle arrête de regarder la publication.',
  'automation.threshold.expiry': 'Arrêtez de regarder un message après',
  'automation.threshold.cooldown': 'Temps de recharge entre les exécutions',
  'automation.threshold.cooldownHelp':
    'Le délai le plus court autorisé entre deux exécutions pour la même publication source.',
  'automation.threshold.maxPerPost': 'Exécutions maximales par publication source',
  'automation.threshold.defaultsTitle':
    "Valeurs par défaut qui restent activées jusqu'à ce que vous les modifiiez",
  'automation.threshold.defaultOncePerPost': 'Exécuter une fois par publication source.',
  'automation.threshold.defaultStale':
    'Ne pas exécuter si la métrique est indisponible ou obsolète. La limite de fraîcheur utilisée est {duration}.',
  'automation.threshold.staleLimit': 'Traitez une métrique comme obsolète après',
  'automation.threshold.providerNote':
    "{provider} rapports {metric} avec un retard, cette règle ne peut donc agir qu'après que le fournisseur a publié le numéro.",

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Faire un suivi depuis un autre compte',
  'automation.crossAccount.off': "Désactivé. Cette règle n'agit que sur le compte source.",
  'automation.crossAccount.enable': 'Autoriser un suivi depuis un autre compte',
  'automation.crossAccount.body':
    'Les deux comptes doivent être connectés à cet espace de travail et tous deux doivent être nommés ici. Le suivi est un message préparé que vous écrivez à l’avance et qui est soumis à la même politique d’approbation que toute autre chose.',
  'automation.crossAccount.sourceAccount': 'Compte source',
  'automation.crossAccount.followUpAccount': 'Compte qui publie le suivi',
  'automation.crossAccount.preauthorize':
    "Je confirme que cet espace de travail contrôle les deux {sourceAccount} et {followUpAccount}, et que le suivi n'est pas présenté comme une approbation indépendante.",
  'automation.crossAccount.preauthorizeRequired':
    'Confirmez la préautorisation avant que cette règle puisse être enregistrée.',
  'automation.crossAccount.duplicateCheck':
    "Les contrôles de doublons et de cadence entre comptes sont exécutés avant le suivi, et ils sont ignorés plutôt que retardés s'ils répètent la publication source.",

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro': 'Tout ce que cette règle peut faire, avant de pouvoir le faire.',
  'automation.preflight.accountsLabel': 'Comptes sur lesquels il peut agir',
  'automation.preflight.maxActionsLabel': 'La plupart des actions externes par exécution',
  'automation.preflight.maxActionsPeriod':
    'Au plus {count, plural, one {# action extérieure} many {# actions extérieures} other {# actions extérieures}} dans {period}.',
  'automation.preflight.approvalLabel': 'Approbation',
  'automation.preflight.approvalNone':
    "Aucune action dans cette règle ne crée quoi que ce soit sur une plateforme, donc aucune approbation ne s'applique.",
  'automation.preflight.providerLabel': 'Restrictions du fournisseur',
  'automation.preflight.providerNone': "Aucune ne s'applique aux actions de cette règle.",
  'automation.preflight.costLabel': 'Coût estimé au compteur',
  'automation.preflight.costUnknown':
    'Le coût de ces actions ne peut être estimé que lorsque le prix du fournisseur est connu.',
  'automation.preflight.costMethod':
    'Estimé à partir du tarif fournisseur du {date}. Le reçu enregistre ce qui a été réellement facturé.',
  'automation.preflight.cadenceLabel': 'Cadence et doublons',
  'automation.preflight.cadenceBody':
    "Des contrôles de doublons et de cadence sont effectués avant chaque action. Une action qui dépasserait le budget de cadence d'un compte est ignorée et enregistrée, et non mise en file d'attente.",
  'automation.preflight.failureLabel': 'Si une exécution échoue',
  'automation.preflight.failure.pauseAfter':
    "La règle s'arrête après {count, plural, one {# échec consécutif} many {# échecs consécutifs} other {# échecs consécutifs}} et dépose une action.",
  'automation.preflight.failure.continue':
    "La règle continue de s'exécuter et chaque échec est enregistré dans le journal d'exécution.",
  'automation.preflight.exampleLabel': "Exemple d'exécution",
  'automation.preflight.exampleIntro':
    "En utilisant l'événement le plus récent, ce déclencheur aurait correspondu.",
  'automation.preflight.exampleNone':
    "Aucun événement correspondant ne s'est encore produit, aucun exemple ne peut donc être affiché. Exécutez plutôt un événement de test.",
  'automation.preflight.activate': 'Activez cette règle',
  'automation.preflight.activateConfirmTitle': 'Allumer {name}?',
  'automation.preflight.activateConfirmBody':
    'Désormais cette règle agit sans vous le demander au préalable, dans les limites listées ci-dessus.',
  'automation.preflight.blocked':
    'Cette règle ne peut pas encore être activée. {count, plural, one {# article} many {# articles} other {# articles}} ci-dessus nécessite une décision.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Événement test',
  'automation.test.body':
    "Un test évalue la phrase entière et montre ce qu’elle ferait. Il ne publie jamais, ne publie jamais de commentaire et n'envoie jamais de webhook à un véritable point de terminaison.",
  'automation.test.useLastEvent': "Utiliser l'événement correspondant le plus récent",
  'automation.test.usePayload': "Coller une charge utile d'événement",
  'automation.test.run': 'Exécutez le test',
  'automation.test.running': 'Exécuter le test',
  'automation.test.resultTitle': 'Ce que le test a fait',
  'automation.test.conditionPassed': '{condition} passé',
  'automation.test.conditionFailed':
    "{condition} n'a pas été adopté, donc la règle s'est arrêtée ici",
  'automation.test.actionSimulated': '{action} courrait',
  'automation.test.actionSkipped': '{action} serait ignoré : {reason}',
  'automation.test.noExternalEffect': 'Il ne reste plus rien de Relay lors de ce test.',
  'automation.test.failed': "Le test n'a pas pu se terminer : {reason}",

  'automation.runs.table.caption': 'Exécutions récentes de cette règle.',
  'automation.runs.startedAt': 'Commencé',
  'automation.runs.outcome.label': 'Résultat',
  'automation.runs.actionsTaken': 'Actes',
  'automation.runs.trigger': 'Déclenché par',
  'automation.runs.outcome.completed': 'Complété',
  'automation.runs.outcome.skipped': 'Sauté',
  'automation.runs.outcome.failed': 'Échoué',
  'automation.runs.outcome.testMode': 'Mode test',
  'automation.runs.actionCount':
    '{count, plural, =0 {Aucune action extérieure} one {# action extérieure} many {# actions extérieures} other {# actions extérieures}}',
  'automation.runs.skippedReason': 'Sauté parce que {reason}',
  'automation.runs.openDetail': 'Ouvrir la course à partir de {time}',
  'automation.runs.createdItems': 'Créé',

  'automation.versions.caption': 'Chaque version enregistrée de cette règle.',
  'automation.versions.current': 'Actuel',
  'automation.versions.savedBy': 'Enregistré par {actor} sur {date}',
  'automation.versions.compare': 'Comparez avec la version actuelle',
  'automation.versions.restore': 'Restaurer cette version',
  'automation.versions.restoreConfirm':
    "La restauration crée une nouvelle version. Rien n'est écrasé et la règle reste dans son état actuel jusqu'à ce que vous l'activiez.",
  'automation.versions.diffTitle': 'Version {from} par rapport à la version {to}',

  'automation.kill.title': 'Arrêt {name} maintenant',
  'automation.kill.body':
    "La règle s'arrête immédiatement, au milieu d'une course s'il y en a une. Tout ce qui est déjà envoyé à une plateforme reste publié, car une publication externe n'est jamais annulée.",
  'automation.kill.confirmPhrase': 'ARRÊT',
  'automation.kill.confirmLabel': 'Tapez STOP pour confirmer',
  'automation.kill.stopped':
    "Cette règle a été arrêtée par {actor} sur {date}. Il ne peut pas fonctionner à nouveau tant que vous ne l'avez pas rallumé.",

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': "Chargement des règles d'automatisation",
  'automation.state.loadingRule': 'Chargement de la règle et de ses exécutions récentes',
  'automation.state.errorTitle': "Les règles n'ont pas pu être chargées",
  'automation.state.errorBody':
    "Les règles déjà en cours d'exécution ne sont pas affectées par cela. Seul cet écran a échoué.",
  'automation.state.offlineTitle': 'Vous êtes hors ligne',
  'automation.state.offlineBody':
    "Vous pouvez lire une règle et modifier le brouillon, et celle-ci reste sur cet appareil. L'enregistrement, le test et l'activation d'une règle nécessitent une connexion.",
  'automation.state.permissionTitle': "Vous ne pouvez pas modifier les règles d'automatisation",
  'automation.state.permissionBody':
    "Les règles agissent sur les comptes connectés, donc en changer un nécessite le rôle de gestionnaire ou supérieur. Vous pouvez toujours lire chaque règle et son historique d'exécution.",
  'automation.state.rateLimitTitle': "L'exécution des règles est ralentie",
  'automation.state.rateLimitCause':
    "Cet espace de travail a atteint sa limite d'exécution d'automatisation pour la fenêtre actuelle. Les publications programmées et la publication manuelle ne sont pas affectées.",
  'automation.state.rateLimitAlternative':
    'Les règles avec une cadence peuvent avoir un intervalle plus long, ce qui utilise moins de courses.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Transformez un flux en brouillons ou en publications programmées, avec la même validation et approbation que tout ce que vous écrivez vous-même.',
  'automation.rss.empty': 'Pas encore de flux',
  'automation.rss.emptyBody':
    "Ajoutez un flux et Relay le vérifie selon un calendrier. Chaque nouvel élément devient un brouillon, une publication planifiée ou une demande d'approbation, selon votre choix.",
  'automation.rss.emptyExample':
    "Exemple : le flux du blog Acme crée un brouillon pour X et LinkedIn à chaque fois qu'un article est publié et attend un approbateur.",
  'automation.rss.table.caption': 'Alimente les sondages de cet espace de travail.',
  'automation.rss.table.feed': 'Alimentation',
  'automation.rss.table.policy': "Qu'arrive-t-il à un nouvel article",
  'automation.rss.table.health': 'Santé',

  'automation.rss.step.url': 'Adresse du flux',
  'automation.rss.step.preview': 'Vérifier le flux',
  'automation.rss.step.seen': 'Point de départ',
  'automation.rss.step.targets': 'Où ça va',
  'automation.rss.step.template': 'Ce que dit le message',
  'automation.rss.step.policy': 'Comment il est publié',
  'automation.rss.stepOf': 'Étape {current} de {total}',

  'automation.rss.urlHelp':
    'Relay récupère le flux depuis nos serveurs, pas depuis votre navigateur. Les adresses de réseaux privés sont refusées.',
  'automation.rss.validateAction': 'Vérifiez ce flux',
  'automation.rss.validateFailed': "Cette adresse n'a pas renvoyé de flux lisible",
  'automation.rss.validateFailedReason': 'Ce que nous avons récupéré : {reason}',
  'automation.rss.validateBlocked':
    'Cette adresse pointe vers un réseau privé, elle n’a donc pas été récupérée.',
  'automation.rss.previewTitle': 'Aperçu du flux',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# article} many {# articles} other {# articles}} retourné, le plus récent en premier.',
  'automation.rss.previewItemPublished': 'Publié {dateTime}',
  'automation.rss.previewNoImage': 'Aucune image dans cet article',
  'automation.rss.previewImageAlt': "Image de l'élément de flux {title}",
  'automation.rss.previewNoDate':
    "Cet élément n'a pas d'horodatage, donc Relay utilise l'heure à laquelle il l'a vu pour la première fois.",
  'automation.rss.previewFieldsTitle': 'Champs fournis par ce flux',
  'automation.rss.previewFieldMissing': 'Non présent dans ce flux',

  'automation.rss.seenTitle': 'Ce qui compte comme déjà vu',
  'automation.rss.seenLatest':
    'Traitez tout ce qui se trouve actuellement dans le flux comme indiqué. Seuls les articles futurs sont publiés.',
  'automation.rss.seenAll':
    "Traitez l'article le plus récent comme neuf et publiez-le lors du prochain chèque.",
  'automation.rss.seenHelp':
    'La plupart des flux contiennent d’anciens articles. Choisir la première option permet d’éviter de publier un backlog.',

  'automation.rss.targetsHelp':
    'Choisissez les comptes ou le groupe enregistré. Chaque cible reçoit toujours sa propre validation avant que quoi que ce soit ne soit planifié.',
  'automation.rss.targetGroup': 'Groupe enregistré',
  'automation.rss.targetIndividual': 'Comptes individuels',

  'automation.rss.templateFields': 'Champs disponibles',
  'automation.rss.templateInsert': 'Insérer {field}',
  'automation.rss.templateField.title': "Titre de l'article",
  'automation.rss.templateField.summary': "Résumé de l'article",
  'automation.rss.templateField.link': "Lien vers l'article",
  'automation.rss.templateField.author': "Auteur de l'article",
  'automation.rss.templateField.published': 'Date de publication',
  'automation.rss.templateField.categories': 'Catégories',
  'automation.rss.templatePreview': "Aperçu avec l'élément le plus récent",
  'automation.rss.adaptWithAi': 'Adapter le texte pour chaque cible',
  'automation.rss.adaptHelp':
    "Le libellé est réécrit pour s'adapter à chaque plate-forme et affiché sous la forme d'une différence que vous acceptez ou rejetez. Le média provient de l'élément de flux. Relay ne génère pas d'images.",
  'automation.rss.noImageGeneration':
    'Si un élément de fil n’a pas d’image, la publication est publiée sans image.',
  'automation.rss.imageFromFeed': "Utiliser l'image de l'élément de flux lorsqu'il en a une",

  'automation.rss.policyHelp':
    'Un élément de flux n’a rien de spécial. Il suit la même politique d’approbation qu’un article que vous écrivez vous-même.',
  'automation.rss.cadenceInterval': 'Un article au maximum tous les',
  'automation.rss.cadenceHelp':
    "Les éléments supplémentaires attendent dans la file d'attente plutôt que d'être publiés ensemble, de sorte qu'un flux qui publie dix articles à la fois n'inonde pas un compte.",
  'automation.rss.immediateWarning':
    "La publication immédiate envoie une publication sur une plateforme sans que personne ne la lise au préalable. Il n'est disponible que si la politique d'approbation de ces comptes le permet.",

  'automation.rss.healthTitle': 'Alimentation saine',
  'automation.rss.healthOk': 'Fonctionnement',
  'automation.rss.healthStalled': 'Aucun nouvel article pour {duration}',
  'automation.rss.healthFailing':
    'Le dernier {count, plural, one {vérifier} many {# chèques} other {# chèques}} échoué',
  'automation.rss.health.nextPoll': 'Vérification suivante {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Aucun article traité pour le moment} one {# article traité} many {# éléments traités} other {# éléments traités}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {Aucun doublon ignoré} one {# doublon ignoré} many {# doublons ignorés} other {# doublons ignorés}}',
  'automation.rss.health.lastPollLabel': 'Dernière vérification',
  'automation.rss.health.lastItemLabel': 'Dernier nouvel élément dans le flux',
  'automation.rss.health.lastPostLabel': 'Dernier brouillon ou message créé',
  'automation.rss.health.processedLabel': 'Articles traités',
  'automation.rss.recentItems': 'Articles récents',
  'automation.rss.itemOutcome.draft': 'Brouillon créé',
  'automation.rss.itemOutcome.scheduled': 'Prévu pour {time}',
  'automation.rss.itemOutcome.published': 'Publié',
  'automation.rss.itemOutcome.awaitingApproval': "En attente d'approbation",
  'automation.rss.itemOutcome.duplicate': 'Sauté, déjà vu',
  'automation.rss.itemOutcome.failed': 'Échoué: {reason}',
  'automation.rss.pauseFeed': 'Suspendre ce flux',
  'automation.rss.resumeFeed': 'Reprendre ce flux',
  'automation.rss.deleteTitle': 'Retirer {title}?',
  'automation.rss.deleteBody':
    'Relay arrête de vérifier ce flux. Les brouillons et les publications déjà créés restent exactement tels qu’ils sont.',
  'automation.rss.errorTitle': "Ce flux n'a pas pu être lu",
  'automation.rss.errorBody':
    'Relay continue de vérifier le calendrier normal. Rien n’a été publié à partir d’une réponse partielle.',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'Non disponible dans aucune règle',
  'automation.refuse.body':
    "Les likes et les suivis automatiques, les groupes d'engagement, les réponses et messages non sollicités et la publication du même contenu à partir de plusieurs comptes pour le rendre populaire ne sont pas des options ici. Les plateformes les interdisent et elles endommagent les comptes qui les utilisent.",
  'automation.refuse.readPolicy': "Lire la politique d'utilisation acceptable",
} as const;
