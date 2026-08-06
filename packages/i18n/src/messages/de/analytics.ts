/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Analytik',
  'analytics.subtitle':
    'Was ist passiert, wie frisch ist es und was lohnt sich als nächstes zu testen?',
  'analytics.range.7d': 'Letzte 7 Tage',
  'analytics.range.30d': 'Letzte 30 Tage',
  'analytics.range.90d': 'Letzte 90 Tage',
  'analytics.range.custom': 'Benutzerdefiniertes Sortiment',
  'analytics.range.limitedByProvider':
    '{provider} gibt höchstens {days, plural, one {# Tag} other {# Tage}} des Verlaufs für dieses Konto zurück.',
  'analytics.account.select': 'Wählen Sie ein Konto',
  'analytics.compareTo': 'Verglichen mit {baseline}',
  'analytics.baseline.trailingMedian':
    'Ihr Median des vorherigen {count, plural, one {# vergleichbarer Beitrag} other {# vergleichbarer Beitrag}}',

  'analytics.metric.followers': 'Anhänger',
  'analytics.metric.subscribers': 'Abonnenten',
  'analytics.metric.profileViews': 'Profilansichten',
  'analytics.metric.impressions': 'Eindrücke',
  'analytics.metric.reach': 'Erreichen',
  'analytics.metric.views': 'Ansichten',
  'analytics.metric.videoViews': 'Videoaufrufe',
  'analytics.metric.watchTime': 'Sehen Sie sich time an',
  'analytics.metric.averageViewDuration': 'Durchschnittliche Ansichtsdauer',
  'analytics.metric.averageViewPercentage': 'Durchschnittlicher Prozentsatz der Aufrufe',
  'analytics.metric.likes': 'Likes und Reaktionen',
  'analytics.metric.comments': 'Kommentare und Antworten',
  'analytics.metric.shares': 'Shares, Reposts und Zitate',
  'analytics.metric.saves': 'Speichert und Lesezeichen',
  'analytics.metric.linkClicks': 'Linkklicks',
  'analytics.metric.clickThroughRate': 'Klickrate',
  'analytics.metric.engagementRate': 'Engagement-Rate',
  'analytics.metric.publishedCount': 'Beiträge veröffentlicht',
  'analytics.metric.followerChange': 'Followerwechsel',

  'analytics.definition.title': 'Wie {metric} definiert ist',
  'analytics.definition.provider': 'Gemeldet von {provider} als {providerField}.',
  'analytics.definition.denominator.label': 'Nenner: {denominator}.',
  'analytics.definition.unit': 'Einheit: {unit}.',
  'analytics.definition.normalized':
    'Normalisiert aus dem Anbieterwert. Der Rohwert bleibt erhalten und steht zur Verfügung.',
  'analytics.definition.notComparable':
    '{provider} und {otherProvider} definieren dies unterschiedlich. Vergleichen Sie sie sorgfältig.',

  'analytics.value.unavailable': 'Nicht verfügbar',
  'analytics.value.unavailableReason.permission':
    'Dieses Konto hat nicht die für diese Metrik erforderliche Berechtigung erteilt.',
  'analytics.value.unavailableReason.unsupported': '{provider} meldet diese Metrik nicht.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} veröffentlicht diese Metrik später. Überprüfen Sie es nach {time} noch einmal.',
  'analytics.value.unavailableReason.syncFailed':
    'Die letzte Synchronisierung ist fehlgeschlagen. Wir versuchen es erneut und zeigen kein erratenes number an.',
  'analytics.freshness.synced': 'Synchronisiert {relativeTime}',
  'analytics.freshness.stale':
    'Letzte erfolgreiche Synchronisierung {relativeTime}. Dies kann außerhalb von date liegen.',
  'analytics.freshness.coverage':
    '{covered} der {total} Beiträge in diesem Bereich verfügen über aktuelle Daten.',

  'analytics.feedback.title': 'Was das vermuten lässt',
  'analytics.feedback.aboveBaseline':
    'Dieser Beitrag hat {percent} mehr {metric} als {baseline} erhalten.',
  'analytics.feedback.belowBaseline':
    'Dieser Beitrag erhielt {percent} weniger {metric} als {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Bildbeiträge und Videobeiträge sind hier nicht direkt vergleichbar.',
  'analytics.feedback.smallSample':
    'Die Stichprobe ist klein. Testen Sie denselben Haken noch einmal, bevor Sie eine Schlussfolgerung ziehen.',
  'analytics.feedback.association':
    'Die Anzahl der Kommentare nahm zu, nachdem sich die erste Kommentarverzögerung von {before} in {after} geändert hatte. Dies ist eine Assoziation, kein Beweis einer Ursache.',
  'analytics.feedback.nextTest': 'Was als nächstes testen sollte',
  'analytics.feedback.doNotInfer': 'Was das nicht zeigt',
  'analytics.feedback.noScore':
    'Es gibt hier keinen einzigen plattformübergreifenden Score. Wählen Sie eine Metrik mit einer Definition aus, der Sie vertrauen.',

  'analytics.experiment.title': 'Experimente',
  'analytics.experiment.hypothesis': 'Hypothese',
  'analytics.experiment.variants': 'Varianten',
  'analytics.experiment.successMetric': 'Erfolgsmetrik',
  'analytics.experiment.window': 'Messfenster',
  'analytics.experiment.status.running': 'Läuft bis {date}',
  'analytics.experiment.status.complete': 'Vollständig',
  'analytics.experiment.tagBeforePublishing':
    'Kennzeichnen Sie ein Experiment vor der Veröffentlichung, damit der Vergleich nicht im Nachhinein erfolgt.',
  'analytics.experiment.caveats': 'Vorbehalte',

  'analytics.export.title': 'Export',
  'analytics.export.csv': 'CSV herunterladen',
  'analytics.export.json': 'Laden Sie JSON herunter',
  'analytics.export.providerRestriction':
    '{provider} schränkt ein, wie seine Daten kombiniert oder gespeichert werden dürfen. Einige Felder sind nicht enthalten.',

  'analytics.links.title': 'Verfolgte Links',
  'analytics.links.subtitle':
    'Erstanbieter-Redirect-Messungen. Hierbei handelt es sich um eine separate Serie zu den Berichten über Linkklicks auf einer Plattform.',
  'analytics.links.destination': 'Ziel',
  'analytics.links.shortUrl': 'Kurze URL',
  'analytics.links.totalRequests': 'Gesamtzahl der Anfragen',
  'analytics.links.humanClicks': 'Deduplizierte Klicks',
  'analytics.links.suspectedBots': 'Verdacht auf Bots',
  'analytics.links.referrerClass': 'Referrer',
  'analytics.links.deviceClass': 'Gerät',
  'analytics.links.country': 'Land',
  'analytics.links.lastEvent': 'Letzter Klick {relativeTime}',
  'analytics.links.privacyNote':
    'Wir behalten nur den groben Standort und die Geräteklasse bei. Unformatierte IP-Adressen werden zur Missbrauchs- und Duplikaterkennung kurzzeitig aufbewahrt und dann verworfen.',
  'analytics.links.separateSources':
    'Fügen Sie diese Klicks nicht einer Plattform hinzu, die number gemeldet wurde. Sie zählen verschiedene Dinge.',
} as const;
