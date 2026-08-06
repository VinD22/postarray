/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Analyse',
  'analytics.subtitle':
    'Wat er is gebeurd, hoe vers het is en wat de moeite waard is om vervolgens te testen.',
  'analytics.range.7d': 'Laatste 7 dagen',
  'analytics.range.30d': 'Laatste 30 dagen',
  'analytics.range.90d': 'Laatste 90 dagen',
  'analytics.range.custom': 'Aangepast bereik',
  'analytics.range.limitedByProvider':
    '{provider} retourneert maximaal {days, plural, one {# dag} other {# dagen}} geschiedenis voor dit account.',
  'analytics.account.select': 'Kies een account',
  'analytics.compareTo': 'Vergeleken met {baseline}',
  'analytics.baseline.trailingMedian':
    'uw mediaan van de vorige {count, plural, one {# vergelijkbaar bericht} other {# vergelijkbare berichten}}',

  'analytics.metric.followers': 'Volgers',
  'analytics.metric.subscribers': 'Abonnees',
  'analytics.metric.profileViews': 'Profielweergaven',
  'analytics.metric.impressions': 'Indrukken',
  'analytics.metric.reach': 'Bereik',
  'analytics.metric.views': 'Bekeken',
  'analytics.metric.videoViews': 'Videoweergaven',
  'analytics.metric.watchTime': 'Kijk naar de tijd',
  'analytics.metric.averageViewDuration': 'Gemiddelde weergaveduur',
  'analytics.metric.averageViewPercentage': 'Gemiddeld percentage bekeken',
  'analytics.metric.likes': 'Likes en reacties',
  'analytics.metric.comments': 'Opmerkingen en antwoorden',
  'analytics.metric.shares': 'Aandelen, reposts en quotes',
  'analytics.metric.saves': 'Opgeslagen en bladwijzers',
  'analytics.metric.linkClicks': 'Klikken op koppelingen',
  'analytics.metric.clickThroughRate': 'Klikfrequentie',
  'analytics.metric.engagementRate': 'Betrokkenheidspercentage',
  'analytics.metric.publishedCount': 'Berichten gepubliceerd',
  'analytics.metric.followerChange': 'Volger verandering',

  'analytics.definition.title': 'Hoe {metric} wordt gedefinieerd',
  'analytics.definition.provider': 'Gerapporteerd door {provider} als {providerField}.',
  'analytics.definition.denominator.label': 'Noemer: {denominator}.',
  'analytics.definition.unit': 'Eenheid: {unit}.',
  'analytics.definition.normalized':
    'Genormaliseerd op basis van de providerwaarde. De ruwe waarde blijft behouden en beschikbaar.',
  'analytics.definition.notComparable':
    '{provider} en {otherProvider} definiëren dit anders. Vergelijk ze zorgvuldig.',

  'analytics.value.unavailable': 'Niet beschikbaar',
  'analytics.value.unavailableReason.permission':
    'Dit account heeft niet de benodigde toestemming voor deze statistiek verleend.',
  'analytics.value.unavailableReason.unsupported': '{provider} rapporteert deze statistiek niet.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} publiceert deze statistiek later. Controleer opnieuw na {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'De laatste synchronisatie is mislukt. We proberen het opnieuw en laten geen geraden getal zien.',
  'analytics.freshness.synced': 'Gesynchroniseerd {relativeTime}',
  'analytics.freshness.stale':
    'Laatste succesvolle synchronisatie {relativeTime}. Dit is mogelijk verouderd.',
  'analytics.freshness.coverage':
    '{covered} van de {total}-berichten in dit bereik bevatten actuele gegevens.',

  'analytics.feedback.title': 'Wat dit suggereert',
  'analytics.feedback.aboveBaseline': 'Dit bericht ontving {percent} meer {metric} dan {baseline}.',
  'analytics.feedback.belowBaseline':
    'Dit bericht ontving {percent} minder {metric} dan {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Beeldposts en videoposts zijn hier niet direct vergelijkbaar.',
  'analytics.feedback.smallSample':
    'De steekproef is klein. Test dezelfde hook opnieuw voordat u een conclusie trekt.',
  'analytics.feedback.association':
    'Het aantal reacties nam toe nadat de eerste reactievertraging was gewijzigd van {before} in {after}. Dit is een verband, geen bewijs van de oorzaak.',
  'analytics.feedback.nextTest': 'Wat nu te testen',
  'analytics.feedback.doNotInfer': 'Wat dit niet laat zien',
  'analytics.feedback.noScore':
    'Er is hier geen enkele cross-platformscore. Kies een statistiek met een definitie die u vertrouwt.',

  'analytics.experiment.title': 'Experimenten',
  'analytics.experiment.hypothesis': 'Hypothese',
  'analytics.experiment.variants': 'Varianten',
  'analytics.experiment.successMetric': 'Successtatistiek',
  'analytics.experiment.window': 'Meetvenster',
  'analytics.experiment.status.running': 'Loopt tot {date}',
  'analytics.experiment.status.complete': 'Compleet',
  'analytics.experiment.tagBeforePublishing':
    'Tag een experiment voordat u het publiceert, zodat de vergelijking niet achteraf wordt gemaakt.',
  'analytics.experiment.caveats': 'Waarschuwingen',

  'analytics.export.title': 'Exporteren',
  'analytics.export.csv': 'CSV downloaden',
  'analytics.export.json': 'JSON downloaden',
  'analytics.export.providerRestriction':
    '{provider} beperkt de manier waarop zijn gegevens kunnen worden gecombineerd of opgeslagen. Sommige velden zijn niet inbegrepen.',

  'analytics.links.title': 'Bijgehouden links',
  'analytics.links.subtitle':
    'Omleidingsmetingen van eerste partijen. Dit zijn een aparte serie van de linkclicks die een platform rapporteert.',
  'analytics.links.destination': 'Bestemming',
  'analytics.links.shortUrl': 'Korte URL',
  'analytics.links.totalRequests': 'Totaal aantal verzoeken',
  'analytics.links.humanClicks': 'Gededupliceerde klikken',
  'analytics.links.suspectedBots': 'Verdachte bots',
  'analytics.links.referrerClass': 'Verwijzer',
  'analytics.links.deviceClass': 'Apparaat',
  'analytics.links.country': 'Land',
  'analytics.links.lastEvent': 'Klik als laatste op {relativeTime}',
  'analytics.links.privacyNote':
    'We houden alleen de grove locatie en apparaatklasse bij. Onbewerkte IP-adressen worden kort bewaard voor misbruik en dubbele detectie en vervolgens verwijderd.',
  'analytics.links.separateSources':
    'Voeg deze klikken niet toe aan een door het platform gerapporteerd aantal. Ze tellen verschillende dingen.',
} as const;
