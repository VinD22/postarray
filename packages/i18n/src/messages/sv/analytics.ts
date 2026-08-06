/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Analytics',
  'analytics.subtitle': 'Vad hände, hur fräscht det är och vad är värt att testa härnäst.',
  'analytics.range.7d': 'Senaste 7 dagarna',
  'analytics.range.30d': 'Senaste 30 dagarna',
  'analytics.range.90d': 'Senaste 90 dagarna',
  'analytics.range.custom': 'Anpassat sortiment',
  'analytics.range.limitedByProvider':
    '{provider} returnerar högst {days, plural, one {# dag} other {# dagar}} av historik för detta konto.',
  'analytics.account.select': 'Välj ett konto',
  'analytics.compareTo': 'Jämfört med {baseline}',
  'analytics.baseline.trailingMedian':
    'din median för föregående {count, plural, one {# jämförbart inlägg} other {# jämförbara inlägg}}',

  'analytics.metric.followers': 'Följare',
  'analytics.metric.subscribers': 'Prenumeranter',
  'analytics.metric.profileViews': 'Profilvyer',
  'analytics.metric.impressions': 'Intryck',
  'analytics.metric.reach': 'Räckvidd',
  'analytics.metric.views': 'Visningar',
  'analytics.metric.videoViews': 'Videovisningar',
  'analytics.metric.watchTime': 'Titta tid',
  'analytics.metric.averageViewDuration': 'Genomsnittlig visningslängd',
  'analytics.metric.averageViewPercentage': 'Genomsnittlig procentandel sett',
  'analytics.metric.likes': 'Gillar och reaktioner',
  'analytics.metric.comments': 'Kommentarer och svar',
  'analytics.metric.shares': 'Delningar, reposter och citat',
  'analytics.metric.saves': 'Sparar och bokmärken',
  'analytics.metric.linkClicks': 'Länkklick',
  'analytics.metric.clickThroughRate': 'Klickfrekvens',
  'analytics.metric.engagementRate': 'Engagemangsgrad',
  'analytics.metric.publishedCount': 'Inlägg publicerade',
  'analytics.metric.followerChange': 'Följerbyte',

  'analytics.definition.title': 'Hur {metric} definieras',
  'analytics.definition.provider': 'Rapporteras av {provider} som {providerField}.',
  'analytics.definition.denominator.label': 'Nämnare: {denominator}.',
  'analytics.definition.unit': 'Enhet: {unit}.',
  'analytics.definition.normalized':
    'Normaliserad från leverantörsvärdet. Råvärdet hålls och finns tillgängligt.',
  'analytics.definition.notComparable':
    '{provider} och {otherProvider} definierar detta på olika sätt. Jämför dem med omsorg.',

  'analytics.value.unavailable': 'Ej tillgänglig',
  'analytics.value.unavailableReason.permission':
    'Det här kontot har inte gett den behörighet som krävs för detta mätvärde.',
  'analytics.value.unavailableReason.unsupported': '{provider} rapporterar inte detta mått.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} publicerar detta mått senare. Kontrollera igen efter {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'Den senaste synkroniseringen misslyckades. Vi försöker igen och kommer inte att visa ett gissat nummer.',
  'analytics.freshness.synced': 'Synkroniserad {relativeTime}',
  'analytics.freshness.stale':
    'Senaste lyckade synkronisering {relativeTime}. Detta kan vara inaktuellt.',
  'analytics.freshness.coverage':
    '{covered} av {total} inlägg i det här intervallet har aktuella data.',

  'analytics.feedback.title': 'Vad detta antyder',
  'analytics.feedback.aboveBaseline':
    'Det här inlägget fick {percent} fler {metric} än {baseline}.',
  'analytics.feedback.belowBaseline':
    'Det här inlägget fick {percent} färre {metric} än {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Bildinlägg och videoinlägg är inte direkt jämförbara här.',
  'analytics.feedback.smallSample':
    'Urvalet är litet. Testa samma krok igen innan du drar en slutsats.',
  'analytics.feedback.association':
    'Kommentarerna ökade efter att den första kommentarsfördröjningen ändrades från {before} till {after}. Detta är en association, inte bevis på orsak.',
  'analytics.feedback.nextTest': 'Vad ska testas härnäst',
  'analytics.feedback.doNotInfer': 'Vad detta inte visar',
  'analytics.feedback.noScore':
    'Det finns ingen enskild poäng över plattformar här. Välj ett mått med en definition du litar på.',

  'analytics.experiment.title': 'Experiment',
  'analytics.experiment.hypothesis': 'Hypotes',
  'analytics.experiment.variants': 'Varianter',
  'analytics.experiment.successMetric': 'Framgångsmått',
  'analytics.experiment.window': 'Mätfönster',
  'analytics.experiment.status.running': 'Pågår till {date}',
  'analytics.experiment.status.complete': 'Komplett',
  'analytics.experiment.tagBeforePublishing':
    'Tagga ett experiment innan publicering så att jämförelsen inte görs i efterhand.',
  'analytics.experiment.caveats': 'Varningar',

  'analytics.export.title': 'Exportera',
  'analytics.export.csv': 'Ladda ner CSV',
  'analytics.export.json': 'Ladda ner JSON',
  'analytics.export.providerRestriction':
    '{provider} begränsar hur dess data får kombineras eller lagras. Vissa fält ingår inte.',

  'analytics.links.title': 'Spårade länkar',
  'analytics.links.subtitle':
    'Förstaparts omdirigeringsmätningar. Dessa är en separat serie från de länkklick som en plattform rapporterar.',
  'analytics.links.destination': 'Destination',
  'analytics.links.shortUrl': 'Kort URL',
  'analytics.links.totalRequests': 'Totalt antal förfrågningar',
  'analytics.links.humanClicks': 'Avduplicerade klick',
  'analytics.links.suspectedBots': 'Misstänkta bots',
  'analytics.links.referrerClass': 'Referent',
  'analytics.links.deviceClass': 'Enhet',
  'analytics.links.country': 'Land',
  'analytics.links.lastEvent': 'Sista klicket {relativeTime}',
  'analytics.links.privacyNote':
    'Vi håller endast grov plats och enhetsklass. Rå IP-adresser sparas en kort stund för missbruk och dubblettdetektering och kasseras sedan.',
  'analytics.links.separateSources':
    'Lägg inte till dessa klick till ett plattformsrapporterat nummer. De räknar olika saker.',
} as const;
