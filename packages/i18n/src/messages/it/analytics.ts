/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Analitica',
  'analytics.subtitle': 'Cosa è successo, quanto è nuovo e cosa vale la pena testare dopo.',
  'analytics.range.7d': 'Ultimi 7 giorni',
  'analytics.range.30d': 'Ultimi 30 giorni',
  'analytics.range.90d': 'Ultimi 90 giorni',
  'analytics.range.custom': 'Gamma personalizzata',
  'analytics.range.limitedByProvider':
    '{provider} restituisce al massimo {days, plural, one {# giorno} many {# giorni} other {# giorni}} di cronologia per questo account.',
  'analytics.account.select': 'Scegli un conto',
  'analytics.compareTo': 'Rispetto a {baseline}',
  'analytics.baseline.trailingMedian':
    'la tua mediana del precedente {count, plural, one {# post comparabili} many {# post comparabili} other {# post comparabili}}',

  'analytics.metric.followers': 'Seguaci',
  'analytics.metric.subscribers': 'Abbonati',
  'analytics.metric.profileViews': 'Viste del profilo',
  'analytics.metric.impressions': 'Impressioni',
  'analytics.metric.reach': 'Raggiungere',
  'analytics.metric.views': 'Viste',
  'analytics.metric.videoViews': 'Visualizzazioni video',
  'analytics.metric.watchTime': 'Guarda il tempo',
  'analytics.metric.averageViewDuration': 'Durata media della visualizzazione',
  'analytics.metric.averageViewPercentage': 'Percentuale media visualizzata',
  'analytics.metric.likes': 'Mi piace e reazioni',
  'analytics.metric.comments': 'Commenti e risposte',
  'analytics.metric.shares': 'Condivisioni, ripubblicazioni e citazioni',
  'analytics.metric.saves': 'Salva e segnalibri',
  'analytics.metric.linkClicks': 'Clic sul collegamento',
  'analytics.metric.clickThroughRate': 'Percentuale di clic',
  'analytics.metric.engagementRate': 'Tasso di coinvolgimento',
  'analytics.metric.publishedCount': 'Post pubblicati',
  'analytics.metric.followerChange': 'Cambio seguace',

  'analytics.definition.title': 'Come viene definito {metric}',
  'analytics.definition.provider': 'Segnalato da {provider} come {providerField}.',
  'analytics.definition.denominator.label': 'Denominatore: {denominator}.',
  'analytics.definition.unit': 'Unità: {unit}.',
  'analytics.definition.normalized':
    'Normalizzato dal valore del provider. Il valore grezzo viene mantenuto e disponibile.',
  'analytics.definition.notComparable':
    '{provider} e {otherProvider} lo definiscono diversamente. Confrontateli con attenzione.',

  'analytics.value.unavailable': 'Non disponibile',
  'analytics.value.unavailableReason.permission':
    "Questo account non ha concesso l'autorizzazione necessaria per questa metrica.",
  'analytics.value.unavailableReason.unsupported': '{provider} non segnala questa metrica.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} pubblica questa metrica in un secondo momento. Ricontrolla dopo {time}.',
  'analytics.value.unavailableReason.syncFailed':
    "L'ultima sincronizzazione non è riuscita. Stiamo riprovando e non mostreremo un numero indovinato.",
  'analytics.freshness.synced': '{relativeTime} sincronizzato',
  'analytics.freshness.stale':
    'Ultima sincronizzazione riuscita {relativeTime}. Potrebbe non essere aggiornato.',
  'analytics.freshness.coverage':
    '{covered} dei post {total} in questo intervallo contengono dati correnti.',

  'analytics.feedback.title': 'Cosa suggerisce questo',
  'analytics.feedback.aboveBaseline':
    'Questo post ha ricevuto {percent} più {metric} che {baseline}.',
  'analytics.feedback.belowBaseline':
    'Questo post ha ricevuto {percent} meno {metric} rispetto a {baseline}.',
  'analytics.feedback.notComparableFormats':
    'I post di immagini e i post di video non sono direttamente comparabili qui.',
  'analytics.feedback.smallSample':
    'Il campione è piccolo. Prova di nuovo lo stesso gancio prima di trarre una conclusione.',
  'analytics.feedback.association':
    "I commenti sono aumentati dopo che il ritardo del primo commento è cambiato da {before} a {after}. Questa è un'associazione, non una prova di causa.",
  'analytics.feedback.nextTest': 'Cosa testare dopo',
  'analytics.feedback.doNotInfer': 'Ciò che questo non dimostra',
  'analytics.feedback.noScore':
    'Non esiste un unico punteggio multipiattaforma qui. Scegli una metrica con una definizione di cui ti fidi.',

  'analytics.experiment.title': 'Esperimenti',
  'analytics.experiment.hypothesis': 'Ipotesi',
  'analytics.experiment.variants': 'Varianti',
  'analytics.experiment.successMetric': 'Metrica del successo',
  'analytics.experiment.window': 'Finestra di misurazione',
  'analytics.experiment.status.running': 'In esecuzione fino a {date}',
  'analytics.experiment.status.complete': 'Completo',
  'analytics.experiment.tagBeforePublishing':
    'Contrassegna un esperimento prima della pubblicazione in modo che il confronto non venga effettuato a posteriori.',
  'analytics.experiment.caveats': 'Avvertenze',

  'analytics.export.title': 'Esportazione',
  'analytics.export.csv': 'Scarica CSV',
  'analytics.export.json': 'Scarica JSON',
  'analytics.export.providerRestriction':
    '{provider} limita il modo in cui i suoi dati possono essere combinati o archiviati. Alcuni campi non sono inclusi.',

  'analytics.links.title': 'Collegamenti tracciati',
  'analytics.links.subtitle':
    'Misurazioni di reindirizzamento di prima parte. Si tratta di una serie separata dai clic sui collegamenti riportati su una piattaforma.',
  'analytics.links.destination': 'Destinazione',
  'analytics.links.shortUrl': 'URL breve',
  'analytics.links.totalRequests': 'Richieste totali',
  'analytics.links.humanClicks': 'Clic deduplicati',
  'analytics.links.suspectedBots': 'Bot sospetti',
  'analytics.links.referrerClass': 'Referente',
  'analytics.links.deviceClass': 'Dispositivo',
  'analytics.links.country': 'Paese',
  'analytics.links.lastEvent': 'Ultimo clic {relativeTime}',
  'analytics.links.privacyNote':
    'Manteniamo solo la posizione approssimativa e la classe del dispositivo. Gli indirizzi IP non elaborati vengono conservati brevemente per evitare abusi e rilevamento di duplicati, quindi eliminati.',
  'analytics.links.separateSources':
    'Non aggiungere questi clic a un numero segnalato dalla piattaforma. Contano cose diverse.',
} as const;
