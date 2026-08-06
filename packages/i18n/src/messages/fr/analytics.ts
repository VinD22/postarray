/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Analytique',
  'analytics.subtitle':
    "Que s'est-il passé, à quel point c'est frais et ce qui mérite d'être testé ensuite.",
  'analytics.range.7d': '7 derniers jours',
  'analytics.range.30d': '30 derniers jours',
  'analytics.range.90d': '90 derniers jours',
  'analytics.range.custom': 'Gamme personnalisée',
  'analytics.range.limitedByProvider':
    "{provider} revient au maximum {days, plural, one {# jour} many {# jours} other {# jours}} d'histoire pour ce compte.",
  'analytics.account.select': 'Choisissez un compte',
  'analytics.compareTo': 'Par rapport à {baseline}',
  'analytics.baseline.trailingMedian':
    'votre médiane du précédent {count, plural, one {# post comparable} many {# posts comparables} other {# posts comparables}}',

  'analytics.metric.followers': 'Abonnés',
  'analytics.metric.subscribers': 'Abonnés',
  'analytics.metric.profileViews': 'Vues de profil',
  'analytics.metric.impressions': 'Impressions',
  'analytics.metric.reach': 'Atteindre',
  'analytics.metric.views': 'Vues',
  'analytics.metric.videoViews': 'Vues vidéo',
  'analytics.metric.watchTime': "Regarder l'heure",
  'analytics.metric.averageViewDuration': 'Durée moyenne de visionnage',
  'analytics.metric.averageViewPercentage': 'Pourcentage moyen consulté',
  'analytics.metric.likes': "J'aime et réactions",
  'analytics.metric.comments': 'Commentaires et réponses',
  'analytics.metric.shares': 'Actions, republications et cotations',
  'analytics.metric.saves': 'Sauvegardes et favoris',
  'analytics.metric.linkClicks': 'Clics sur les liens',
  'analytics.metric.clickThroughRate': 'Taux de clics',
  'analytics.metric.engagementRate': "Taux d'engagement",
  'analytics.metric.publishedCount': 'Articles publiés',
  'analytics.metric.followerChange': 'Changement de suiveur',

  'analytics.definition.title': 'Comment {metric} est défini',
  'analytics.definition.provider': 'Rapporté par {provider} comme {providerField}.',
  'analytics.definition.denominator.label': 'Dénominateur: {denominator}.',
  'analytics.definition.unit': 'Unité: {unit}.',
  'analytics.definition.normalized':
    'Normalisé à partir de la valeur du fournisseur. La valeur brute est conservée et disponible.',
  'analytics.definition.notComparable':
    '{provider} et {otherProvider} définir cela différemment. Comparez-les avec soin.',

  'analytics.value.unavailable': 'Indisponible',
  'analytics.value.unavailableReason.permission':
    "Ce compte n'a pas accordé l'autorisation nécessaire pour cette métrique.",
  'analytics.value.unavailableReason.unsupported': '{provider} ne rapporte pas cette métrique.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} publie cette métrique plus tard. Vérifiez à nouveau après {time}.',
  'analytics.value.unavailableReason.syncFailed':
    "La dernière synchronisation a échoué. Nous réessayons et n'afficherons pas de numéro deviné.",
  'analytics.freshness.synced': 'Synchronisé {relativeTime}',
  'analytics.freshness.stale':
    'Dernière synchronisation réussie {relativeTime}. Cela est peut-être obsolète.',
  'analytics.freshness.coverage':
    '{covered} de {total} les publications de cette plage ont des données actuelles.',

  'analytics.feedback.title': 'Ce que cela suggère',
  'analytics.feedback.aboveBaseline': 'Ce message a reçu {percent} plus {metric} que {baseline}.',
  'analytics.feedback.belowBaseline': 'Ce message a reçu {percent} moins {metric} que {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Les publications d’images et les publications vidéo ne sont pas directement comparables ici.',
  'analytics.feedback.smallSample':
    "L'échantillon est petit. Testez à nouveau le même crochet avant de tirer une conclusion.",
  'analytics.feedback.association':
    "Les commentaires ont augmenté après que le premier délai de commentaire soit passé de {before} à {after}. Il s'agit d'une association, pas d'une preuve de cause.",
  'analytics.feedback.nextTest': 'Que tester ensuite',
  'analytics.feedback.doNotInfer': 'Ce que cela ne montre pas',
  'analytics.feedback.noScore':
    'Il n’y a pas de score multiplateforme unique ici. Choisissez une métrique avec une définition en laquelle vous avez confiance.',

  'analytics.experiment.title': 'Expériences',
  'analytics.experiment.hypothesis': 'Hypothèse',
  'analytics.experiment.variants': 'Variantes',
  'analytics.experiment.successMetric': 'Mesure de réussite',
  'analytics.experiment.window': 'Fenêtre de mesure',
  'analytics.experiment.status.running': "Courir jusqu'à {date}",
  'analytics.experiment.status.complete': 'Complet',
  'analytics.experiment.tagBeforePublishing':
    'Marquez une expérience avant de la publier afin que la comparaison ne soit pas effectuée après coup.',
  'analytics.experiment.caveats': 'Mises en garde',

  'analytics.export.title': 'Exporter',
  'analytics.export.csv': 'Télécharger CSV',
  'analytics.export.json': 'Télécharger JSON',
  'analytics.export.providerRestriction':
    '{provider} restreint la manière dont ses données peuvent être combinées ou stockées. Certains champs ne sont pas inclus.',

  'analytics.links.title': 'Liens suivis',
  'analytics.links.subtitle':
    'Mesures de redirection de première partie. Il s’agit d’une série distincte des rapports sur les clics sur les liens d’une plateforme.',
  'analytics.links.destination': 'Destination',
  'analytics.links.shortUrl': 'URL courte',
  'analytics.links.totalRequests': 'Total des demandes',
  'analytics.links.humanClicks': 'Clics dédupliqués',
  'analytics.links.suspectedBots': 'Bots suspects',
  'analytics.links.referrerClass': 'Référent',
  'analytics.links.deviceClass': 'Appareil',
  'analytics.links.country': 'Pays',
  'analytics.links.lastEvent': 'Dernier clic {relativeTime}',
  'analytics.links.privacyNote':
    "Nous conservons uniquement l'emplacement grossier et la classe d'appareil. Les adresses IP brutes sont conservées brièvement pour la détection des abus et des doublons, puis supprimées.",
  'analytics.links.separateSources':
    "N'ajoutez pas ces clics à un numéro signalé par la plateforme. Ils comptent des choses différentes.",
} as const;
