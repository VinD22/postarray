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
  'analytics.chart.legend': 'Serie mostrate in questo grafico',
  'analytics.tab.overview': 'Panoramica',
  'analytics.tab.experiments': 'Esperimenti',
  'analytics.tab.links': 'Collegamenti tracciati',
  'analytics.tab.label': 'Sezioni di analisi',

  'analytics.question.baseline': 'Quali post si sono allontanati dalla tua linea di base?',
  'analytics.question.baselineHelp':
    "Ogni post viene confrontato con i tuoi post recenti sullo stesso account e nello stesso formato. Niente qui ti paragona a un altro spazio di lavoro o a un'altra azienda.",
  'analytics.question.accounts': 'Quali account necessitano di attenzione?',
  'analytics.question.next': 'Cosa vale la pena testare dopo?',

  'analytics.filter.project': 'Progetto',
  'analytics.filter.accounts': 'Conti',
  'analytics.filter.allAccounts': 'Tutti gli account collegati',
  'analytics.filter.range': 'Intervallo di date',
  'analytics.filter.format': 'Formato del contenuto',
  'analytics.filter.allFormats': 'Tutti i formati',
  'analytics.filter.comparePrevious': 'Confronta con il periodo precedente',
  'analytics.filter.applied':
    '{count, plural, =0 {Nessun filtro} one {# filtro} many {# filtri} other {# filtri}} applicati. {results, plural, =0 {Nessun post corrispondente} one {# post corrispondenti} many {# post corrispondenti} other {# post corrispondenti}}.',

  'analytics.rankMetric.label': 'Classifica i post in base a',
  'analytics.rankMetric.help':
    'Non esiste un punteggio combinato in Post Array. Scegli una metrica di cui ti fidi della definizione e la tabella verrà ordinata solo in base a quella metrica.',
  'analytics.rankMetric.chosen':
    'Classificato in base a {metric}, come riportato da ciascun fornitore di account.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Consapevolezza',
  'analytics.outcome.awarenessHelp':
    'Quante volte il post è stato consegnato o visto. I fornitori lo contano in modo diverso, quindi un valore è paragonabile solo a se stesso nel tempo.',
  'analytics.outcome.consumption': 'Consumo',
  'analytics.outcome.consumptionHelp':
    'Quanti post le persone hanno effettivamente guardato o letto.',
  'analytics.outcome.interaction': 'Interazione',
  'analytics.outcome.interactionHelp':
    'Cosa hanno fatto le persone sulla piattaforma: Mi piace, commenti, condivisioni e salvataggi.',
  'analytics.outcome.conversion': 'Conversione',
  'analytics.outcome.conversionHelp':
    'Cosa hanno fatto le persone dopo aver lasciato la piattaforma. Solo i collegamenti tracciati possono rispondere a questa domanda e solo per i collegamenti che hai scelto di monitorare.',
  'analytics.outcome.separateNote':
    'Questi quattro gruppi vengono conteggiati separatamente. Sommandoli insieme conterebbe la stessa persona più di una volta.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    "Post pubblicati nell'intervallo selezionato, ciascuno confrontato con il tuo riferimento recente.",
  'analytics.table.post': 'Posta',
  'analytics.table.account': 'Conto',
  'analytics.table.format': 'Formato',
  'analytics.table.published': 'Pubblicato',
  'analytics.table.value': 'Valore',
  'analytics.table.delta': 'Contro la linea di base',
  'analytics.table.sample': 'Campione',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Prove',
  'analytics.table.openEvidence': 'Mostra le prove per {post}',
  'analytics.table.rowActions': 'Azioni per {post}',
  'analytics.table.openPost': 'Apri le metriche dei post',
  'analytics.table.openReceipt': 'Ricevuta di pubblicazione aperta',
  'analytics.table.noBaseline': 'Nessuna linea di base ancora',
  'analytics.table.noBaselineReason':
    'In questo account esistono meno di {required} post comparabili. Un confronto sarebbe rumore, quindi non ne viene mostrato nessuno.',
  'analytics.table.sortBy': 'Ordina per {column}',
  'analytics.table.detailToggle': 'Dettagli',

  'analytics.delta.above': '{percent} sopra la linea di base',
  'analytics.delta.below': '{percent} sotto la linea di base',
  'analytics.delta.level': 'In linea con il riferimento',
  'analytics.delta.unavailable': 'Nessun confronto',

  'analytics.evidence.title': 'Come è stato fatto questo confronto',
  'analytics.evidence.baseline':
    'Riferimento: la mediana {metric} del precedente {count, plural, one {# post comparabili} many {# post comparabili} other {# post comparabili}} su {account}.',
  'analytics.evidence.comparableBy':
    "Paragonabile significa lo stesso account, lo stesso formato di contenuto ({format}) e un tempo di pubblicazione all'interno dello stesso periodo.",
  'analytics.evidence.postsUsed': 'Post utilizzati per la linea di base',
  'analytics.evidence.excluded':
    '{count, plural, =0 {Nessun post è stato escluso} one {# post è stato escluso} many {# post sono stati esclusi} other {# post sono stati esclusi}} perché la metrica non era disponibile per loro.',
  'analytics.evidence.smallSample':
    'Con {count, plural, one {# post} many {# post} other {# post}} nella linea di fondo, un singolo post insolito sposta molto la mediana. Trattalo come un segnale per ripetere il test, non come un risultato.',
  'analytics.evidence.confounders': 'Di cosa questo non tiene conto',
  'analytics.evidence.confounder.time':
    "L'ora del giorno di pubblicazione variava tra i post di base.",
  'analytics.evidence.confounder.format':
    'I post di immagini e i post di video non sono direttamente comparabili qui.',
  'analytics.evidence.confounder.followers':
    'Il conteggio dei follower su {account} è cambiato da {percent} durante questo periodo.',
  'analytics.evidence.confounder.paid':
    'Post Array non è in grado di stabilire se qualcuno di questi post ha ricevuto una distribuzione a pagamento.',
  'analytics.evidence.confounder.provider':
    "{provider} ha cambiato il modo in cui segnala {metric} all'interno di questo periodo.",

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'Cosa significa {metric}',
  'analytics.definition.inlineHeading': 'Definizione',
  'analytics.definition.observedAt': 'Osservato {dateTime}.',
  'analytics.definition.sourceLink': 'Documentazione del fornitore',
  'analytics.definition.verifiedOn':
    'Controllato rispetto alla documentazione del fornitore su {date}.',
  'analytics.definition.panelTitle': 'Definizioni metriche in questa vista',
  'analytics.definition.panelIntro':
    'Ogni numero in questa schermata proviene da un campo del provider denominato. Le definizioni seguenti vengono ripetute anche accanto a ciascun valore, quindi nulla di importante risiede solo in un tooltip.',
  'analytics.definition.aggregation.sum': 'Aggregato aggiungendo ogni osservazione.',
  'analytics.definition.aggregation.average': 'Aggregato come media.',
  'analytics.definition.aggregation.median': 'Aggregato come mediana.',
  'analytics.definition.aggregation.last': "L'osservazione più recente.",
  'analytics.definition.aggregation.delta': "Il cambiamento tra la prima e l'ultima osservazione.",
  'analytics.definition.aggregation.none': 'Riportato come una singola osservazione.',
  'analytics.definition.denominator.none': 'Questo è un conteggio, non un tasso.',
  'analytics.definition.historyWindow':
    '{provider} conserva {days, plural, one {# giorno} many {# giorni} other {# giorni}} di cronologia per questo campo.',
  'analytics.definition.historyWindowNone':
    '{provider} non indica un limite di cronologia per questo campo.',

  'analytics.definition.term.providerField': 'Campo fornitore',
  'analytics.definition.term.unit': 'Unità',
  'analytics.definition.term.denominator': 'Denominatore',
  'analytics.definition.term.aggregation': 'Come viene aggregato',
  'analytics.definition.term.history': 'Cronologia conservata dal fornitore',
  'analytics.definition.term.definition': 'Ciò che dice il fornitore significa',

  'analytics.unit.count': 'Un conteggio di eventi',
  'analytics.unit.seconds': 'Secondi',
  'analytics.unit.percent': 'Una percentuale già calcolata dal fornitore',
  'analytics.unit.ratio': 'Un rapporto Post Array calcolato da due campi del provider',
  'analytics.unit.currency_minor': 'Una somma di denaro in unità minori',

  'analytics.denominator.none': 'Questo è un conteggio, non un tasso. Non ha denominatore.',
  'analytics.denominator.impressions': 'Diviso per impressioni',
  'analytics.denominator.reach': 'Diviso per portata',
  'analytics.denominator.views': 'Diviso per punti di vista',
  'analytics.denominator.followers':
    "Diviso per il conteggio dei follower al momento dell'osservazione",
  'analytics.denominator.sessions': 'Diviso per sessioni',

  'analytics.format.text': 'Testo',
  'analytics.format.image': 'Immagine',
  'analytics.format.carousel': 'Carosello',
  'analytics.format.video': 'Video',
  'analytics.format.short_video': 'Breve video',
  'analytics.format.long_video': 'Video lungo',
  'analytics.format.document': 'Documento',
  'analytics.format.thread': 'Filo',

  'analytics.value.unavailableReason.notImplemented':
    'Post Array non ha ancora creato la mappatura per questa metrica su {provider}.',
  'analytics.value.estimated': 'Stima',
  'analytics.value.estimatedMethod': 'Metodo: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'Da dove provengono questi numeri',
  'analytics.freshness.intro':
    'I fornitori si aggregano secondo il proprio programma. Niente su questa schermata è in diretta.',
  'analytics.freshness.accountRow': '{account} su {provider}',
  'analytics.freshness.never': 'Mai sincronizzato',
  'analytics.freshness.nextAttempt': 'Prossimo tentativo di sincronizzazione {relativeTime}.',
  'analytics.freshness.openStatus': 'Stato del fornitore',

  'analytics.accounts.title': 'Conti che necessitano di attenzione',
  'analytics.accounts.empty':
    'Ogni account connesso ha restituito dati in questo periodo. Niente ha bisogno di te qui.',
  'analytics.accounts.reason.permission':
    "L'autorizzazione di analisi non è stata concessa quando questo account è stato connesso.",
  'analytics.accounts.reason.expired':
    "L'accesso è scaduto, quindi non è stata raccolta alcuna metrica a partire da {date}.",
  'analytics.accounts.reason.stale': "L'ultima sincronizzazione riuscita è stata {relativeTime}.",
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# tentativo di sincronizzazione} many {# tentativi di sincronizzazione} other {# tentativi di sincronizzazione}} non riusciti consecutivi. Il motivo registrato era {reason}.',
  'analytics.accounts.reason.noPosts':
    "Non è stato pubblicato nulla su questo account nell'intervallo selezionato.",

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Osservazioni',
  'analytics.observations.intro':
    'Queste sono le descrizioni di ciò che mostrano i numeri. Non sono previsioni e non stabiliscono la causa.',
  'analytics.observations.empty':
    'Non c’è ancora abbastanza storia pubblicata per descrivere uno schema. Pubblica qualche post in più sullo stesso account e formato.',
  'analytics.observations.citedPosts': 'Basato su',
  'analytics.observations.citedPeriod': 'Periodo: da {start} a {end}.',
  'analytics.observations.nextTestTitle': 'Un test che potresti eseguire dopo',
  'analytics.observations.nextTestBody':
    'Pubblica {count, plural, one {# altro post} many {# altri post} other {# altri post}} su {account} modificando solo {variable}, quindi confronta la stessa metrica. Taggalo come esperimento prima della pubblicazione in modo che il confronto venga pianificato anziché trovato in seguito.',
  'analytics.observations.tagFirst': 'Tagga un esperimento',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} nel tempo',
  'analytics.chart.summary':
    '{metric} su {account}, {count, plural, one {# punto} many {# punti} other {# punti}} da {start} a {end}.',
  'analytics.chart.showTable': 'Mostra come tabella',
  'analytics.chart.hideTable': 'Nascondi la tabella',
  'analytics.chart.tableCaption': 'La stessa serie di un tavolo.',
  'analytics.chart.columnPeriod': 'Periodo',
  'analytics.chart.columnValue': 'Valore',
  'analytics.chart.gapLabel': 'Nessun dato raccolto',
  'analytics.chart.gapExplained':
    "Un'interruzione nella riga significa che per quel periodo non è stata raccolta alcuna osservazione. Non significa zero.",
  'analytics.chart.annotation': 'Annotazione',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'Non sono state raccolte osservazioni in questo intervallo.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Pianifica un esperimento',
  'analytics.experiment.empty':
    "Nessun esperimento ancora. Un esperimento è un confronto che decidi prima della pubblicazione, che è l'unico tipo in grado di rispondere a una domanda.",
  'analytics.experiment.emptyExample':
    "Esempio: pubblica due volte lo stesso annuncio su X, una volta con il link nel post e una volta con il link nel primo commento, quindi confronta i clic sul link nell'arco di 72 ore.",
  'analytics.experiment.name': 'Cosa stai testando?',
  'analytics.experiment.namePlaceholder': 'Primo commento a 5 minuti contro 30 minuti',
  'analytics.experiment.hypothesisPlaceholder':
    'Un ritardo più breve prima che il primo commento ottenga più risposte su X.',
  'analytics.experiment.variantLabel': 'Variante {index}',
  'analytics.experiment.variantDescription': "Cosa c'è di diverso in questa variante",
  'analytics.experiment.addVariant': 'Aggiungi una variante',
  'analytics.experiment.removeVariant': 'Rimuovi la variante {index}',
  'analytics.experiment.accounts': 'Conti inclusi',
  'analytics.experiment.windowHelp':
    'Le metriche continuano a muoversi dopo la pubblicazione di un post. Correggi la finestra ora in modo che il confronto non venga effettuato in un momento adatto a una variante.',
  'analytics.experiment.windowDays':
    'Misura per {count, plural, one {# giorno} many {# giorni} other {# giorni}} dopo la pubblicazione di ogni post',
  'analytics.experiment.minSample': 'Post minimi per variante',
  'analytics.experiment.minSampleHelp':
    'Al di sotto di questo conteggio il risultato viene mostrato come inconcludente anziché vincente.',
  'analytics.experiment.status.planned': 'Pianificato',
  'analytics.experiment.status.collecting':
    'Collezionare. {published} di {target} post pubblicati.',
  'analytics.experiment.status.inconclusive': 'Completo, nessuna differenza chiara',
  'analytics.experiment.result.difference':
    '{variant} ha registrato {percent} più {metric} che {otherVariant}.',
  'analytics.experiment.result.noDifference':
    "Le due varianti si trovano all'interno di {percent} l'una dall'altra su {metric}. Questo è comunque all'interno dell'intervallo in cui questi post variano.",
  'analytics.experiment.result.association':
    "Questa è un'associazione misurata su {count, plural, one {# post} many {# post} other {# post}}. Ciò non prova che il cambiamento abbia causato la differenza.",
  'analytics.experiment.result.unavailable':
    '{metric} non era disponibile per {count, plural, one {# post} many {# post} other {# post}} in questo esperimento, pertanto tali post vengono esclusi anziché conteggiati come zero.',
  'analytics.experiment.result.title': 'Risultato',
  'analytics.experiment.completeNow': 'Chiudi questo esperimento',
  'analytics.experiment.completeConfirm':
    'La chiusura interrompe la raccolta. I post restano pubblicati e i numeri restano disponibili.',
  'analytics.experiment.postsTitle': 'Post in questo esperimento',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Caricamento delle analisi per gli account selezionati',
  'analytics.state.loadingProvider': 'Recupero analisi {provider}',
  'analytics.state.empty': 'Niente pubblicato in questa gamma',
  'analytics.state.emptyBody':
    "Analytics descrive i post già pubblicati. Pubblica qualcosa o amplia l'intervallo di date.",
  'analytics.state.emptyExample':
    'Una volta pubblicato un post, vedrai una riga come: X @acme, "Avvia thread", 12.400 impressioni, il 58% sopra la media delle 10 precedenti.',
  'analytics.state.errorTitle': "Impossibile caricare l'analisi",
  'analytics.state.errorBody':
    'Non viene mostrato alcun numero piuttosto che uno indovinato. I tuoi post e le tue ricevute non saranno interessati.',
  'analytics.state.partialTitle': '{loaded} degli account {total} hanno restituito dati',
  'analytics.state.partialBody':
    'Gli account che hanno risposto vengono mostrati con la loro freschezza. Il resto è elencato con il motivo per cui non lo ha fatto.',
  'analytics.state.partialSucceeded': 'Dati restituiti',
  'analytics.state.partialFailed': 'Non ha restituito i dati',
  'analytics.state.offlineTitle': 'Sei offline',
  'analytics.state.offlineBody':
    'Le figure seguenti sono state caricate prima che la connessione si interrompesse, quindi sono più vecchie di quanto suggeriscano le etichette di freschezza.',
  'analytics.state.permissionTitle': "Non puoi visualizzare l'analisi in quest'area di lavoro",
  'analytics.state.permissionBody':
    "Per l'analisi è necessario il ruolo di analista o superiore. Un proprietario o un amministratore di questa area di lavoro può concederlo.",
  'analytics.state.rateLimitTitle': '{provider} limita la velocità delle richieste di analisi',
  'analytics.state.rateLimitCause':
    "L'account ha utilizzato la sua quota della quota del provider per questa finestra. Post Array non riprova più duramente perché ciò ritarderebbe la pubblicazione.",
  'analytics.state.rateLimitAlternative':
    "Restringi l'intervallo di date o il filtro dell'account, che richiede meno al fornitore.",
  'analytics.state.rateLimitReset': 'Le richieste riprendono',
  'analytics.state.reference': 'Riferimento diagnostico',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Crea un collegamento tracciato',
  'analytics.links.empty': 'Nessun collegamento ancora tracciato',
  'analytics.links.emptyBody':
    'Un collegamento tracciato è un URL breve attraverso il quale Post Array reindirizza, quindi puoi vedere i clic anche quando una piattaforma non ne segnala nessuno. La destinazione originale non viene mai modificata senza una voce di controllo.',
  'analytics.links.emptyExample':
    'Esempio: relè.to/a7Kq2 reindirizza a acme.com/blog/launch con la campagna q3-launch.',
  'analytics.links.table.caption':
    "Collegamenti monitorati in quest'area di lavoro e conteggio dei clic proprietari.",
  'analytics.links.campaign': 'Campagna',
  'analytics.links.created': 'Creato',
  'analytics.links.usedIn':
    '{count, plural, =0 {Non ancora utilizzato in un post} one {Utilizzato in # post} many {Utilizzato in # post} other {Utilizzato in # post}}',
  'analytics.links.state.active': 'Attivo',
  'analytics.links.state.expired': '{date} scaduto',
  'analytics.links.state.disabled': 'Disabilitato',
  'analytics.links.state.disabledAt':
    'Disabilitato il {date}. Questo URL breve non reindirizza più.',
  'analytics.links.state.blocked': 'Bloccato per sicurezza',
  'analytics.links.state.blockedBody':
    'Questo reindirizzamento non è disponibile perché la destinazione non ha superato un controllo di sicurezza. Modifica la destinazione o contatta il supporto.',
  'analytics.links.state.disabledReason':
    'Disabilitato da {actor} su {date}. Motivo registrato: {reason}.',
  'analytics.links.detailTitle': 'Collegamento tracciato {slug}',
  'analytics.links.exactRedirect': 'Reindirizzamento esatto',
  'analytics.links.exactRedirectHelp':
    'Questa è la destinazione che un visitatore raggiunge in questo momento, inclusi tutti i parametri UTM, mostrati per intero e non abbreviati.',
  'analytics.links.editDestination': 'Cambia la destinazione',
  'analytics.links.editDestinationWarning':
    'La modifica della destinazione influisce su ogni luogo in cui questo collegamento era già pubblicato. I report relativi ai periodi precedenti alla modifica mantengono la destinazione attiva in quel momento.',
  'analytics.links.editDestinationAudit':
    'La modifica viene registrata nel registro di controllo con il tuo nome, la vecchia destinazione e quella nuova.',
  'analytics.links.destinationHistory': 'Storia della destinazione',
  'analytics.links.destinationHistoryRow': '{destination}, attivo da {start} a {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, attivo da {start}',
  'analytics.links.domainLabel': 'Dominio corto',
  'analytics.links.domainDefault': 'Dominio predefinito Post Array',
  'analytics.links.domainVerified': 'Verificato dal DNS su {date}',
  'analytics.links.domainPending': 'In attesa del record DNS',
  'analytics.links.domainPendingHelp':
    'Aggiungi il record TXT di seguito in {domain}, quindi controlla di nuovo. Fino alla verifica, questo dominio non può essere selezionato per un nuovo collegamento.',
  'analytics.links.domainFailed': 'Il record DNS non corrispondeva su {date}',
  'analytics.links.domainCheck': 'Controlla di nuovo il DNS',
  'analytics.links.expiry': 'Scadenza',
  'analytics.links.expiryNone': 'Nessuna scadenza fissata',
  'analytics.links.expiryHelp':
    'Dopo la scadenza il collegamento restituisce una pagina semplice che informa che è terminato. Non viene mai puntato silenziosamente altrove.',
  'analytics.links.disable': 'Disabilita questo collegamento adesso',
  'analytics.links.disableTitle': 'Disabilitare {slug}?',
  'analytics.links.disableBody':
    "I visitatori raggiungono una pagina che dice che il collegamento non è più disponibile. I post pubblicati contengono ancora l'URL breve, quindi questo è visibile a chiunque faccia clic.",
  'analytics.links.disableReason': 'Motivo della disabilitazione',
  'analytics.links.enable': 'Abilita nuovamente questo collegamento',
  'analytics.links.abuseTitle': 'Segnala un abuso di questo link',
  'analytics.links.abuseBody':
    'Se questo URL breve viene utilizzato per qualcosa che non volevi, segnalalo e il reindirizzamento verrà sospeso durante la revisione.',
  'analytics.links.abuseAction': 'Segnala questo collegamento',
  'analytics.links.measurementLabel': 'Misurazione del reindirizzamento di prima parte',
  'analytics.links.measurementExplained':
    "Post Array conta una richiesta quando al servizio di reindirizzamento viene richiesto questo URL. Un clic deduplicato rimuove le richieste ripetute dallo stesso visitatore all'interno di una breve finestra e le richieste che corrispondono a modelli noti del crawler vengono escluse anziché eliminate.",
  'analytics.links.botsNote':
    '{count, plural, one {# richiesta} many {# richieste} other {# richieste}} sono state classificate come automatizzate e sono escluse dal conteggio deduplicato.',
  'analytics.links.series.title': 'Richieste e clic deduplicati nel tempo',
  'analytics.links.series.requests': 'Richieste totali',
  'analytics.links.series.clicks': 'Clic deduplicati',
  'analytics.links.breakdownTitle': 'Da dove provengono i clic',
  'analytics.links.breakdown.share': '{percent} di clic deduplicati',
  'analytics.links.referrer.direct': 'Nessun referrer inviato',
  'analytics.links.referrer.social': 'Piattaforma sociale',
  'analytics.links.referrer.search': 'Motore di ricerca',
  'analytics.links.referrer.email': 'Cliente di posta elettronica',
  'analytics.links.referrer.other': 'Altro sito web',
  'analytics.links.device.mobile': 'Cellulare',
  'analytics.links.device.desktop': 'Desktop',
  'analytics.links.device.tablet': 'Tavoletta',
  'analytics.links.device.unknown': 'Non determinato',
  'analytics.links.countryUnknown': 'Paese non determinato',
  'analytics.links.lastEventLabel': 'Ultimo clic',
  'analytics.links.noEvents': 'Nessun clic ancora registrato',
  'analytics.links.noEventsBody':
    'Questo collegamento non è stato richiesto da quando è stato creato. Questo è un vero zero, misurato dal nostro servizio di reindirizzamento.',
  'analytics.links.compareWarning':
    "{provider} segnala i clic sui link {providerValue} per questo post. Post Array ha registrato {relayValue} clic deduplicati. I due contano eventi diversi e nessuno dei due sostituisce l'altro.",
  'analytics.links.errorTitle': 'Impossibile caricare le statistiche dei collegamenti',
  'analytics.links.errorBody':
    'Il servizio di reindirizzamento funziona ancora, quindi il collegamento continua a inviare i visitatori a destinazione. Ne è interessata solo la rendicontazione.',
  'analytics.links.createDestination': 'URL di destinazione',
  'analytics.links.createDestinationHelp':
    'Deve essere un indirizzo https pubblico. Gli indirizzi di rete privata e le catene di reindirizzamento vengono rifiutati dal servizio di reindirizzamento.',
  'analytics.links.createCampaign': 'Nome della campagna',
  'analytics.links.createSlug': 'Finale personalizzato',
  'analytics.links.createSlugHelp': 'Lascialo vuoto e Post Array genererà un breve finale casuale.',
  'analytics.links.createUtm': 'Parametri UTM',
  'analytics.links.blockedScheme': 'Sono accettate solo destinazioni https.',
  'analytics.links.blockedPrivate':
    "Quell'indirizzo si trova su una rete privata, quindi il servizio di reindirizzamento non lo accetterà.",

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Regole',
  'automation.tab.feeds': 'Feed RSS',
  'automation.tab.label': 'Sezioni di automazione',

  'automation.rules.table.caption': "Regole di automazione in quest'area di lavoro.",
  'automation.rules.table.rule': 'Regola',
  'automation.rules.table.state': 'Stato',
  'automation.rules.table.accounts': 'Conti',
  'automation.rules.table.lastRun': 'Ultima corsa',
  'automation.rules.table.nextCheck': 'Prossimo controllo',
  'automation.rules.neverRun': 'Non ancora eseguito',
  'automation.rules.emptyExample':
    "Esempio: quando un nuovo elemento appare nel feed del blog Acme, se la lingua è l'inglese, crea una bozza dal modello di annuncio del blog e richiedi l'approvazione.",
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {Nessun account selezionato} one {# account} many {# account} other {# account}}',
  'automation.rules.openRule': 'Apri {name}',
  'automation.rules.duplicateRule': 'Duplica {name}',
  'automation.rules.deleteTitle': 'Eliminare {name}?',
  'automation.rules.deleteBody':
    'La regola si interrompe immediatamente e la cronologia di esecuzione viene conservata per il registro di controllo. I post già creati non sono interessati.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'un commento pianificato o un elemento del thread non riesce',

  'automation.condition.timeWindow': 'il tempo è compreso tra {start} e {end} in {timeZone}',
  'automation.condition.domainPresent': 'il testo si collega a {domain}',
  'automation.condition.hashtagPresent': "il testo contiene l'hashtag {hashtag}",
  'automation.condition.providerCapability': "l'account può effettivamente eseguire {capability}",
  'automation.condition.planStatus': "l'abbonamento è attivo",

  'automation.action.continueSequence': 'continuare il thread preparato o la sequenza di commenti',
  'automation.action.notifyEmail': "inviare un'e-mail a {target}",
  'automation.action.notifyWebhook': 'invia un webhook a {target}',
  'automation.action.pauseConnection': "mettere in pausa l'account interessato",
  'automation.action.quotePost': 'citare il post di origine una volta',
  'automation.action.followUpComment': 'aggiungi un commento preparato sul post di origine',

  'automation.param.feed': 'Nutrire',
  'automation.param.template': 'Modello',
  'automation.param.signature': 'Firma',
  'automation.param.disclosure': 'Divulgazione',
  'automation.param.locale': 'Lingua',
  'automation.param.project': 'Progetto',
  'automation.param.campaign': 'Campagna',
  'automation.param.account': 'Conto',
  'automation.param.platform': 'Piattaforma',
  'automation.param.contentType': 'Tipo di contenuto',
  'automation.param.keyword': 'Parola chiave',
  'automation.param.hashtag': 'Hashtag',
  'automation.param.domain': 'Dominio',
  'automation.param.capability': 'Capacità',
  'automation.param.timeZone': 'Fuso orario',
  'automation.param.startTime': 'Da',
  'automation.param.endTime': 'A',
  'automation.param.duration': 'Durata',
  'automation.param.metric': 'Metrico',
  'automation.param.value': 'Valore',
  'automation.param.target': 'Invia a',
  'automation.param.time': 'Tempo',
  'automation.param.cadence': 'Quanto spesso',
  'automation.param.notSet': 'non impostato',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Nome della regola',
  'automation.editor.namePlaceholder': 'Blog sui social',
  'automation.editor.when': 'Quando',
  'automation.editor.if': 'Se',
  'automation.editor.then': 'Poi',
  'automation.editor.after': 'Dopo',
  'automation.editor.until': 'Fino a quando',
  'automation.editor.sentenceLabel': 'Frase di regola',
  'automation.editor.readBack': "Rileggi la frase prima di attivarla. È l'intera regola.",
  'automation.editor.chooseTrigger': 'Scegli cosa dà inizio a questa regola',
  'automation.editor.addCondition': 'Aggiungi una condizione',
  'automation.editor.addAction': "Aggiungi un'azione",
  'automation.editor.removeCondition': 'Rimuovere la condizione {label}',
  'automation.editor.removeAction': "Rimuovere l'azione {label}",
  'automation.editor.moveActionUp': 'Sposta {label} prima',
  'automation.editor.moveActionDown': 'Sposta {label} più tardi',
  'automation.editor.actionOrder':
    "Le azioni vengono eseguite in questo ordine, dall'alto verso il basso.",
  'automation.editor.noConditions':
    'Nessuna condizione. La regola viene eseguita ogni volta che viene attivata.',
  'automation.editor.noActions':
    'Nessuna azione ancora. Una regola senza azione non può essere salvata.',
  'automation.editor.delayNone': 'nessun ritardo',
  'automation.editor.delayLabel': "Ritardo prima dell'esecuzione delle azioni",
  'automation.editor.endLabel': 'Quando questa regola finirà',
  'automation.editor.end.manual': 'Lo spengo',
  'automation.editor.end.date': 'una data che scelgo',
  'automation.editor.end.count':
    'è stato eseguito {count, plural, one {# volta} many {# volte} other {# volte}}',
  'automation.editor.end.dateValue': 'Fermati',
  'automation.editor.end.countValue': 'Fermati dopo così tante corse',
  'automation.editor.parameterFor': 'Impostazioni per {label}',
  'automation.editor.saveDraft': 'Salva come bozza',
  'automation.editor.savedAt': 'Salvato {time}',
  'automation.editor.unsaved': 'Modifiche non salvate',

  'automation.editor.view.sentence': 'Frase',
  'automation.editor.view.structured': 'Strutturato',
  'automation.editor.view.api': "Rappresentazione dell'API",
  'automation.editor.view.label': "Visualizzazione dell'editor",
  'automation.editor.apiHelp':
    "Questo è esattamente ciò che inviano l'API REST, la CLI e il server MCP. Modificandolo qui e tornando alla frase si mantengono tutti i campi.",
  'automation.editor.apiInvalid':
    'Questa non è una regola JSON valida, quindi non è stata applicata: {reason}',
  'automation.editor.apiApply': 'Applica questo JSON',
  'automation.editor.structuredHelp':
    'La stessa regola dei campi. Usalo quando una regola ha molte condizioni e la frase diventa lunga.',

  'automation.editor.error.noAction': "Aggiungi almeno un'azione prima di salvare.",
  'automation.editor.error.noTrigger': 'Scegli un trigger prima di salvare.',
  'automation.editor.error.noAccounts': 'Scegli almeno un account su cui questa regola può agire.',
  'automation.editor.error.missingParameter': '{label} necessita di un valore.',
  'automation.editor.error.summary':
    '{count, plural, one {# cose richiedono la tua attenzione} many {# cose richiedono la tua attenzione} other {# cose richiedono la tua attenzione}} prima che questa regola possa essere salvata.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'Ciò che dà inizio a questa regola',
  'automation.picker.conditionTitle': 'Aggiungi una condizione',
  'automation.picker.actionTitle': "Aggiungi un'azione",
  'automation.picker.search': 'Filtra questo elenco',
  'automation.picker.noResults': 'Niente in questo elenco corrisponde a ciò che hai digitato.',
  'automation.picker.groupContent': 'Contenuto',
  'automation.picker.groupPublishing': 'Editoria',
  'automation.picker.groupNotify': 'Persone e sistemi',
  'automation.picker.groupControl': 'Controllo delle regole',
  'automation.picker.groupSchedule': 'Tempo',
  'automation.picker.groupExternal': 'Eventi esterni',
  'automation.picker.groupMeasurement': 'Misurazione',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# azione è} many {# azioni sono} other {# azioni sono}} non elencato perché gli account selezionati non possono eseguirle.',
  'automation.picker.hiddenDetail': '{action} non è disponibile per {provider}. {reason}',
  'automation.picker.consequential': 'Crea qualcosa su una piattaforma',
  'automation.picker.internalOnly': "Rimane all'interno di Post Array",

  'automation.accounts.label': 'Account su cui questa regola può agire',
  'automation.accounts.help':
    'Una regola non può mai toccare un account che non è elencato qui, qualunque siano le sue condizioni.',
  'automation.accounts.none': 'Nessun account ancora selezionato',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Regole di misurazione per questo trigger',
  'automation.threshold.intro':
    'Una regola che reagisce a un numero deve sapere quale numero, misurato in quale periodo e con quale frequenza può agire.',
  'automation.threshold.metric': "Metrica da tenere d'occhio",
  'automation.threshold.value': 'Valore soglia',
  'automation.threshold.window': 'Finestra di misurazione',
  'automation.threshold.windowHelp':
    'Contato dal momento in cui è stato pubblicato il post di origine. Al di fuori di questa finestra la regola smette di guardare il post.',
  'automation.threshold.expiry': 'Smetti di guardare un post dopo',
  'automation.threshold.cooldown': 'Recupero tra le esecuzioni',
  'automation.threshold.cooldownHelp':
    'Il tempo più breve consentito tra due esecuzioni per lo stesso post di origine.',
  'automation.threshold.maxPerPost': 'Esecuzioni massime per post di origine',
  'automation.threshold.defaultsTitle':
    'Impostazioni predefinite che rimangono attive a meno che non vengano modificate',
  'automation.threshold.defaultOncePerPost': 'Esegui una volta per post di origine.',
  'automation.threshold.defaultStale':
    'Non eseguire se la metrica non è disponibile o non è aggiornata. Il limite di freschezza utilizzato è {duration}.',
  'automation.threshold.staleLimit': 'Tratta una metrica come obsoleta dopo',
  'automation.threshold.providerNote':
    '{provider} segnala {metric} in caso di ritardo, quindi questa regola può agire solo dopo che il provider ha pubblicato il numero.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Segui da un altro account',
  'automation.crossAccount.off': "Spento. Questa regola agisce solo sull'account di origine.",
  'automation.crossAccount.enable': 'Consenti un follow-up da un altro account',
  'automation.crossAccount.body':
    'Entrambi gli account devono essere connessi a questo spazio di lavoro ed entrambi devono essere nominati qui. Il follow-up è un post preparato che scrivi in ​​anticipo e viene sottoposto alla stessa politica di approvazione di qualsiasi altra cosa.',
  'automation.crossAccount.sourceAccount': 'Conto di origine',
  'automation.crossAccount.followUpAccount': 'Account che pubblica il follow-up',
  'automation.crossAccount.preauthorize':
    'Confermo che questa area di lavoro controlla sia {sourceAccount} che {followUpAccount} e che il follow-up non viene presentato come approvazione indipendente.',
  'automation.crossAccount.preauthorizeRequired':
    'Conferma la preautorizzazione prima che questa regola possa essere salvata.',
  'automation.crossAccount.duplicateCheck':
    'I controlli di duplicazione e cadenza tra account vengono eseguiti prima del follow-up e vengono saltati anziché ritardati se si ripete il post di origine.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro':
    'Tutto ciò che questa regola può fare, prima di poter fare qualsiasi altra cosa.',
  'automation.preflight.accountsLabel': 'Conti su cui può agire',
  'automation.preflight.maxActionsLabel': 'La maggior parte delle azioni esterne per esecuzione',
  'automation.preflight.maxActionsPeriod':
    'Al massimo {count, plural, one {# azione esterna} many {# azioni esterne} other {# azioni esterne}} in {period}.',
  'automation.preflight.approvalLabel': 'Approvazione',
  'automation.preflight.approvalNone':
    'Nessuna azione in questa regola crea nulla su una piattaforma, quindi non si applica alcuna approvazione.',
  'automation.preflight.providerLabel': 'Restrizioni del fornitore',
  'automation.preflight.providerNone': 'Nessuna si applica alle azioni in questa regola.',
  'automation.preflight.costLabel': 'Costo misurato stimato',
  'automation.preflight.costUnknown':
    'Non è possibile stimare il costo di queste azioni finché non si conosce il prezzo del fornitore.',
  'automation.preflight.costMethod':
    'Stimato dal listino prezzi del fornitore su {date}. La ricevuta riporta quanto effettivamente addebitato.',
  'automation.preflight.cadenceLabel': 'Cadenza e duplicati',
  'automation.preflight.cadenceBody':
    "I controlli duplicati e di cadenza vengono eseguiti prima di ogni azione. Un'azione che supererebbe il budget di cadenza per un account viene saltata e registrata, non messa in coda.",
  'automation.preflight.failureLabel': 'Se una corsa fallisce',
  'automation.preflight.failure.pauseAfter':
    "La regola viene sospesa dopo {count, plural, one {# errori consecutivi} many {# errori consecutivi} other {# errori consecutivi}} e archivia un'azione.",
  'automation.preflight.failure.continue':
    'La regola continua a essere eseguita e ogni errore viene registrato nel registro di esecuzione.',
  'automation.preflight.exampleLabel': 'Esecuzione di esempio',
  'automation.preflight.exampleIntro':
    "Utilizzando l'evento più recente questo trigger avrebbe corrisposto.",
  'automation.preflight.exampleNone':
    'Non si è ancora verificato alcun evento corrispondente, quindi non è possibile mostrare alcun esempio. Esegui invece un evento di prova.',
  'automation.preflight.activate': 'Attiva questa regola',
  'automation.preflight.activateConfirmTitle': 'Attivare {name}?',
  'automation.preflight.activateConfirmBody':
    "D'ora in poi questa regola agisce senza chiedertelo prima, entro i limiti sopra elencati.",
  'automation.preflight.blocked':
    'Questa regola non può ancora essere attivata. {count, plural, one {# elemento} many {# elementi} other {# elementi}} sopra richiede una decisione.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Evento di prova',
  'automation.test.body':
    "Un test valuta l'intera frase e mostra cosa farebbe. Non pubblica mai, non pubblica mai un commento e non invia mai un webhook a un endpoint reale.",
  'automation.test.useLastEvent': "Utilizza l'evento corrispondente più recente",
  'automation.test.usePayload': "Incolla un payload dell'evento",
  'automation.test.run': 'Esegui il test',
  'automation.test.running': 'Esecuzione del test',
  'automation.test.resultTitle': 'Cosa ha fatto il test',
  'automation.test.conditionPassed': '{condition} superato',
  'automation.test.conditionFailed': '{condition} non è passato, quindi la regola si è fermata qui',
  'automation.test.actionSimulated': '{action} verrebbe eseguito',
  'automation.test.actionSkipped': '{action} verrebbe saltato: {reason}',
  'automation.test.noExternalEffect': 'Niente è rimasto sul Post Array durante questo test.',
  'automation.test.failed': 'Impossibile completare il test: {reason}',

  'automation.runs.table.caption': 'Esecuzioni recenti di questa regola.',
  'automation.runs.startedAt': 'Iniziato',
  'automation.runs.outcome.label': 'Risultato',
  'automation.runs.actionsTaken': 'Azioni',
  'automation.runs.trigger': 'Innescato da',
  'automation.runs.outcome.completed': 'Completato',
  'automation.runs.outcome.skipped': 'Saltato',
  'automation.runs.outcome.failed': 'Fallito',
  'automation.runs.outcome.testMode': 'Modalità di prova',
  'automation.runs.actionCount':
    '{count, plural, =0 {Nessuna azione esterna} one {# azione esterna} many {# azioni esterne} other {# azioni esterne}}',
  'automation.runs.skippedReason': 'Saltato perché {reason}',
  'automation.runs.openDetail': 'Apri la corsa da {time}',
  'automation.runs.createdItems': 'Creato',

  'automation.versions.caption': 'Ogni versione salvata di questa regola.',
  'automation.versions.current': 'Corrente',
  'automation.versions.savedBy': 'Salvato da {actor} su {date}',
  'automation.versions.compare': 'Confronta con la versione attuale',
  'automation.versions.restore': 'Ripristina questa versione',
  'automation.versions.restoreConfirm':
    'Il ripristino crea una nuova versione. Niente viene sovrascritto e la regola rimane nel suo stato corrente finché non la attivi.',
  'automation.versions.diffTitle': 'Versione {from} rispetto alla versione {to}',

  'automation.kill.title': 'Interrompi {name} adesso',
  'automation.kill.body':
    'La regola si interrompe immediatamente, nel bel mezzo di una corsa se ne sta accadendo una. Tutto ciò che è già stato inviato a una piattaforma rimane pubblicato, perché un post esterno non viene mai ripristinato.',
  'automation.kill.confirmPhrase': 'FERMARE',
  'automation.kill.confirmLabel': 'Digita STOP per confermare',
  'automation.kill.stopped':
    'Questa regola è stata interrotta da {actor} su {date}. Non può essere eseguito di nuovo finché non lo riaccendi.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Caricamento delle regole di automazione',
  'automation.state.loadingRule': 'Caricamento della regola e delle sue esecuzioni recenti',
  'automation.state.errorTitle': 'Impossibile caricare le regole',
  'automation.state.errorBody':
    'Le regole già in esecuzione non vengono influenzate da ciò. Solo questa schermata non è riuscita.',
  'automation.state.offlineTitle': 'Sei offline',
  'automation.state.offlineBody':
    "Puoi leggere una regola e modificare la bozza, che rimarrà su questo dispositivo. Il salvataggio, il test e l'attivazione di una regola richiedono una connessione.",
  'automation.state.permissionTitle': 'Non è possibile modificare le regole di automazione',
  'automation.state.permissionBody':
    'Le regole agiscono sugli account collegati, quindi per cambiarne uno è necessario il ruolo di manager o superiore. Puoi comunque leggere ogni regola e la relativa cronologia di esecuzione.',
  'automation.state.rateLimitTitle': "L'esecuzione delle regole viene rallentata",
  'automation.state.rateLimitCause':
    "Quest'area di lavoro ha raggiunto il limite di esecuzione dell'automazione per la finestra corrente. I post pianificati e la pubblicazione manuale non sono interessati.",
  'automation.state.rateLimitAlternative':
    'Alle regole con cadenza è possibile assegnare un intervallo più lungo, che utilizza meno corse.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Trasforma un feed in bozze o post programmati, con la stessa convalida e approvazione di qualsiasi cosa scrivi tu stesso.',
  'automation.rss.empty': 'Nessun feed ancora',
  'automation.rss.emptyBody':
    'Aggiungi un feed e Post Array lo controlla in base a una pianificazione. Ogni nuovo elemento diventa una bozza, un post programmato o una richiesta di approvazione, a seconda di quale scegli.',
  'automation.rss.emptyExample':
    'Esempio: il feed del blog Acme crea una bozza per X e LinkedIn ogni volta che viene pubblicato un articolo e attende un approvatore.',
  'automation.rss.table.caption': 'Fornisce sondaggi a questo spazio di lavoro.',
  'automation.rss.table.feed': 'Nutrire',
  'automation.rss.table.policy': 'Cosa succede a un nuovo elemento',
  'automation.rss.table.health': 'Salute',

  'automation.rss.step.url': 'Indirizzo del feed',
  'automation.rss.step.preview': 'Controlla il feed',
  'automation.rss.step.seen': 'Punto di partenza',
  'automation.rss.step.targets': 'Dove va',
  'automation.rss.step.template': 'Cosa dice il post',
  'automation.rss.step.policy': 'Come viene pubblicato',
  'automation.rss.stepOf': 'Passaggio {current} di {total}',

  'automation.rss.urlHelp':
    'Post Array recupera il feed dai nostri server, non dal tuo browser. Gli indirizzi di rete privata vengono rifiutati.',
  'automation.rss.validateAction': 'Controlla questo feed',
  'automation.rss.validateFailed': "Quell'indirizzo non ha restituito un feed leggibile",
  'automation.rss.validateFailedReason': 'Cosa abbiamo ottenuto: {reason}',
  'automation.rss.validateBlocked':
    "L'indirizzo punta a una rete privata, quindi non è stato recuperato.",
  'automation.rss.previewTitle': 'Anteprima del feed',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# elemento} many {# elementi} other {# elementi}} restituito, partendo dal più recente.',
  'automation.rss.previewItemPublished': 'Pubblicato {dateTime}',
  'automation.rss.previewNoImage': 'Nessuna immagine in questo articolo',
  'automation.rss.previewImageAlt': "Immagine dall'elemento feed {title}",
  'automation.rss.previewNoDate':
    "Questo elemento non ha un timestamp, quindi Post Array utilizza l'ora in cui lo ha visto per la prima volta.",
  'automation.rss.previewFieldsTitle': 'Campi forniti da questo feed',
  'automation.rss.previewFieldMissing': 'Non presente in questo feed',

  'automation.rss.seenTitle': 'Ciò che conta è già visto',
  'automation.rss.seenLatest':
    'Tratta tutto ciò che è attualmente nel feed come visto. Vengono pubblicati solo gli elementi futuri.',
  'automation.rss.seenAll':
    "Considera l'elemento più recente come nuovo e pubblicalo nel controllo successivo.",
  'automation.rss.seenHelp':
    'La maggior parte dei feed contiene vecchi articoli. Scegliere la prima opzione è il modo per evitare di pubblicare un arretrato.',

  'automation.rss.targetsHelp':
    'Scegli gli account o il gruppo salvato. Ogni destinazione riceve comunque la propria convalida prima che venga pianificata qualsiasi cosa.',
  'automation.rss.targetGroup': 'Gruppo salvato',
  'automation.rss.targetIndividual': 'Conti individuali',

  'automation.rss.templateFields': 'Campi disponibili',
  'automation.rss.templateInsert': 'Inserisci {field}',
  'automation.rss.templateField.title': "Titolo dell'articolo",
  'automation.rss.templateField.summary': "Riepilogo dell'articolo",
  'automation.rss.templateField.link': "Collegamento all'articolo",
  'automation.rss.templateField.author': "Autore dell'articolo",
  'automation.rss.templateField.published': 'Data di pubblicazione',
  'automation.rss.templateField.categories': 'Categorie',
  'automation.rss.templatePreview': "Anteprima con l'elemento più recente",
  'automation.rss.adaptWithAi': 'Adattare il testo per ciascun target',
  'automation.rss.adaptHelp':
    "Il testo viene riscritto per adattarsi a ciascuna piattaforma e mostrato come una differenza che accetti o rifiuti. I contenuti multimediali provengono dall'elemento del feed. Post Array non genera immagini.",
  'automation.rss.noImageGeneration':
    "Se un elemento del feed non ha un'immagine, il post esce senza.",
  'automation.rss.imageFromFeed': "Utilizza l'immagine dell'elemento del feed quando ne ha una",

  'automation.rss.policyHelp':
    'Un elemento del feed non è speciale. Segue la stessa politica di approvazione di un post che scrivi tu stesso.',
  'automation.rss.cadenceInterval': 'Al massimo un articolo ciascuno',
  'automation.rss.cadenceHelp':
    'Gli elementi aggiuntivi attendono in coda anziché essere pubblicati insieme, quindi un feed che pubblica dieci articoli contemporaneamente non inonda un account.',
  'automation.rss.immediateWarning':
    'La pubblicazione immediata invia un post a una piattaforma senza che una persona lo legga prima. È disponibile solo se la politica di approvazione per questi account lo consente.',

  'automation.rss.healthTitle': 'Nutri la salute',
  'automation.rss.healthOk': 'Funzionante',
  'automation.rss.healthStalled': 'Nessun nuovo elemento per {duration}',
  'automation.rss.healthFailing':
    "L'ultima {count, plural, one {verifica} many {# verifiche} other {# verifiche}} non è riuscita.",
  'automation.rss.health.nextPoll': 'Successivamente controlla {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Nessun elemento ancora elaborato} one {# elemento elaborato} many {# elementi elaborati} other {# elementi elaborati}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {nessun duplicato saltato} one {# duplicato saltato} many {# duplicati saltati} other {# duplicati saltati}}',
  'automation.rss.health.lastPollLabel': 'Ultimo controllo',
  'automation.rss.health.lastItemLabel': 'Ultimo nuovo elemento nel feed',
  'automation.rss.health.lastPostLabel': 'Ultima bozza o post creato',
  'automation.rss.health.processedLabel': 'Articoli elaborati',
  'automation.rss.recentItems': 'Elementi recenti',
  'automation.rss.itemOutcome.draft': 'Bozza creata',
  'automation.rss.itemOutcome.scheduled': 'Previsto per {time}',
  'automation.rss.itemOutcome.published': 'Pubblicato',
  'automation.rss.itemOutcome.awaitingApproval': 'In attesa di approvazione',
  'automation.rss.itemOutcome.duplicate': 'Saltato, già visto',
  'automation.rss.itemOutcome.failed': 'Non riuscito: {reason}',
  'automation.rss.pauseFeed': 'Metti in pausa questo feed',
  'automation.rss.resumeFeed': 'Riprendi questo feed',
  'automation.rss.deleteTitle': 'Rimuovere {title}?',
  'automation.rss.deleteBody':
    'Post Array interrompe il controllo di questo feed. Le bozze e i post già creati rimangono esattamente come sono.',
  'automation.rss.errorTitle': 'Impossibile leggere questo feed',
  'automation.rss.errorBody':
    'Post Array continua a controllare il programma normale. Non è stato pubblicato nulla da una risposta parziale.',

  /* ----------------------------------------------------------------------
     What Post Array refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'Non disponibile in nessuna regola',
  'automation.refuse.body':
    'Mi piace e follow automatici, gruppi di coinvolgimento, risposte e messaggi non richiesti e la pubblicazione dello stesso contenuto da diversi account per farlo sembrare popolare non sono opzioni qui. Le piattaforme li vietano e danneggiano gli account che li utilizzano.',
  'automation.refuse.readPolicy': 'Leggi la politica di utilizzo accettabile',
} as const;
