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
    'Mastodon si collega con un token di accesso creato sulla tua istanza, non con la tua password.',
  'web.connection.requirement.telegram':
    'Relay pubblica come bot. Aggiungi il bot al canale o gruppo dove vuoi pubblicare.',
  'web.connection.requirement.reddit':
    'Scrivere su Reddit richiede un’app approvata e ogni post ha bisogno di un titolo e di un subreddit.',
  'web.connection.requirement.wordpress':
    'Relay pubblica tramite l’API REST del sito con una password dell’app creata in WordPress.',
  'web.connection.requirement.medium':
    'Medium si collega via OAuth e Relay pubblica storie pubbliche in Markdown.',
  'web.connection.requirement.devto':
    'Dev.to si collega con una chiave API creata nelle impostazioni di Dev.to.',
  'web.connection.requirement.pinterest':
    'Scrivere su Pinterest richiede accesso app approvato e un pin ha bisogno di un’immagine e di una bacheca tua.',
  'web.connection.requirement.discord':
    'Relay pubblica come bot. Aggiungi il bot ai server e ai canali dove vuoi pubblicare.',
  'web.connection.requirement.slack':
    'Relay pubblica come app. Aggiungi l’app ai canali dove vuoi pubblicare.',
  'web.provider.fake': 'Connettore di prova',

  'web.accountType.personal_profile': 'Profilo personale',
  'web.accountType.creator_profile': 'Conto Creatore',
  'web.accountType.business_profile': 'Conto aziendale',
  'web.accountType.page': 'Pagina',
  'web.accountType.organization': 'Organizzazione',
  'web.accountType.channel': 'Canale',
  'web.accountType.group': 'Gruppo',
  'web.accountType.board': 'Consiglio',
  'web.accountType.community': 'Comunità',
  'web.accountType.publication': 'Pubblicazione',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Tutto programmato, in attesa di approvazione, pubblicato o bloccato, in un unico posto.',
  'web.calendar.view.agenda': 'ordine del giorno',
  'web.calendar.view.table': 'Tabella',
  'web.calendar.view.switchLabel': 'Scegli come è strutturato il programma',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': 'Da {start} a {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'Visualizzazione di {range} in {timeZone}',
  'web.calendar.timeZone.workspace': 'Fuso orario Workspace: {timeZone}',
  'web.calendar.timeZone.change': "Modifica delle impostazioni dell'area di lavoro",
  'web.calendar.jumpToDate': 'Vai a una data',
  'web.calendar.nowLabel': 'Ora',
  'web.calendar.allDayHeading': "Non c'è ancora l'ora esatta",

  'web.calendar.filter.group': 'Gruppo di clienti',
  'web.calendar.filter.anyBrand': 'Qualsiasi marca',
  'web.calendar.filter.anyAccount': 'Qualsiasi conto',
  'web.calendar.filter.anyPlatform': 'Qualsiasi piattaforma',
  'web.calendar.filter.anyStatus': 'Qualsiasi stato',
  'web.calendar.filter.anyLocale': 'Qualsiasi lingua del contenuto',
  'web.calendar.filter.anyCampaign': 'Qualsiasi campagna',
  'web.calendar.filter.anyGroup': 'Ogni gruppo',
  'web.calendar.filter.regionLabel': 'Filtra il programma',
  'web.calendar.bucket.scheduled': 'Programmato',
  'web.calendar.bucket.draft': 'Bozze e approvazioni',
  'web.calendar.bucket.published': 'Pubblicato',
  'web.calendar.bucket.failed': 'Ha bisogno di attenzione',
  'web.calendar.filter.summary':
    '{count, plural, =0 {Nessun filtro} one {# filtro} many {# filtri} other {# filtri}}, {results, plural, =0 {nessun post} one {# post} many {# post} other {# post}}',

  'web.calendar.grid.label': 'Griglia di pianificazione per {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Niente su {time} su {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {Mostra altro # post} many {Mostra altri # post} other {Mostra altri # post}}',
  'web.calendar.month.label': 'Griglia mensile per {month}',
  'web.calendar.agenda.label': 'Agenda per {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Niente di programmato',

  'web.calendar.table.caption': 'Ogni post in {range}, ordinato per ora di pubblicazione.',
  'web.calendar.table.column.time': 'Tempo',
  'web.calendar.table.column.account': 'Conto',
  'web.calendar.table.column.content': 'Contenuto',
  'web.calendar.table.column.language': 'Lingua',
  'web.calendar.table.column.media': 'Media',
  'web.calendar.table.column.status': 'Stato',
  'web.calendar.table.column.approver': 'Approvatore',
  'web.calendar.table.column.campaign': 'Campagna',
  'web.calendar.table.column.actions': 'Azioni',
  'web.calendar.table.rowMenu': 'Azioni per {title}',
  'web.calendar.table.noApprover': 'Non è necessaria alcuna approvazione',
  'web.calendar.table.noCampaign': 'Nessuna campagna',

  'web.calendar.entry.untitled': 'Bozza senza titolo',
  'web.calendar.entry.language': 'Lingua {locale}',
  'web.calendar.entry.openDetail': 'Apri {title}',
  'web.calendar.entry.selected': '{title} selezionato. {hint}',
  'web.calendar.detail.title': 'Posta programmata',
  'web.calendar.detail.close': 'Chiudi questo post',

  'web.calendar.keyboard.title': 'Sposta un post con la tastiera',
  'web.calendar.keyboard.body':
    'Metti a fuoco un post e premi Invio per aprirlo. Premi M per prendere un post, quindi usa i tasti freccia per spostarlo di uno slot e Invio per confermare. Premi Esc per ripristinarlo.',
  'web.calendar.keyboard.pickUp': 'Sposta questo post',
  'web.calendar.keyboard.grabbed':
    '{title} prelevato da {from}. I tasti freccia lo spostano. Inserisci conferma. La fuga annulla.',
  'web.calendar.keyboard.moved': 'Orario proposto {to}. Inserisci conferma.',
  'web.calendar.keyboard.released': '{title} riportato a {from}.',
  'web.calendar.keyboard.stepMinutes': 'Ogni passaggio dura {minutes} minuti.',

  'web.calendar.reschedule.title': 'Spostare questo post?',
  'web.calendar.reschedule.subject': '{account} su {provider}',
  'web.calendar.reschedule.from': 'Da {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'A {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Sposta posta',
  'web.calendar.reschedule.dstTitle': 'Gli orologi cambiano tra questi due orari',
  'web.calendar.reschedule.dstBody':
    "L'offset in {timeZone} è {fromOffset} alla vecchia ora e {toOffset} alla nuova ora. L'ora locale scelta viene mantenuta, quindi l'istante UTC viene spostato.",
  'web.calendar.reschedule.conflictTitle': 'Altri post sono vicini a questo periodo',
  'web.calendar.reschedule.conflictBody':
    '{account} ha già {count, plural, one {# post} many {# post} other {# post}} entro {window} del nuovo orario.',
  'web.calendar.reschedule.campaignTitle': 'Conflitto della campagna',
  'web.calendar.reschedule.campaignBody':
    'La campagna {campaign} va da {start} a {end}. Il nuovo orario è fuori da quella finestra.',
  'web.calendar.reschedule.leadTimeTitle': 'Questo avverrà molto presto',
  'web.calendar.reschedule.leadTimeBody':
    'Il nuovo orario è {duration} da adesso. {provider} ha bisogno di {required} per preparare i media per questo tipo di post.',
  'web.calendar.reschedule.pastTitle': 'Quel tempo è passato',
  'web.calendar.reschedule.pastBody': 'Scegli un momento nel futuro oppure pubblicalo ora.',

  'web.calendar.published.title': 'Questo post è già pubblicato',
  'web.calendar.published.body':
    "Esiste un post su {provider} all'indirizzo {permalinkLabel}. Lo spostamento della voce in Relay non sposta il post sulla piattaforma. Scegli cosa vuoi che accada.",
  'web.calendar.published.optionLocal': 'Aggiorna solo il record locale',
  'web.calendar.published.optionLocalHint':
    "La ricevuta conserva l'ora di pubblicazione reale. Si sposta solo la voce di pianificazione, quindi il tuo calendario corrisponde al tuo piano.",
  'web.calendar.published.optionNew': 'Pianifica un nuovo post al nuovo orario',
  'web.calendar.published.optionNewHint':
    'Questo crea un secondo post esterno separato. Quello già su {provider} resta online.',
  'web.calendar.published.optionLabel': 'Cosa dovrebbe succedere',

  'web.calendar.attention.title':
    '{count, plural, one {# post necessitano di una decisione o di una correzione} many {# post necessitano di una decisione o di una correzione} other {# post necessitano di una decisione o di una correzione}}',
  'web.calendar.attention.body': 'Rimangono qui e nel centro operativo finché non vengono risolti.',
  'web.calendar.attention.open': 'Apri il centro operativo',
  'web.calendar.attention.showOnly': 'Mostra solo questi',

  'web.calendar.loading': 'Caricamento del programma',
  'web.calendar.error.title': 'Impossibile caricare la pianificazione',
  'web.calendar.error.body':
    'Non è cambiato nulla di programmato. I tuoi post verranno comunque pubblicati negli orari pianificati.',
  'web.calendar.error.retry': 'Riprova',
  'web.calendar.empty.example':
    '09:30 Europa/Berlino, X @acme, "I primi commenti programmati sono in diretta", Programmato, 1 immagine',
  'web.calendar.emptyFiltered.body':
    "Nessun post in {range} corrisponde a questi filtri. Ampliare l'intervallo o eliminare un filtro.",
  'web.calendar.offline.title': 'Sei offline',
  'web.calendar.offline.body':
    "La pianificazione seguente è l'ultima copia caricata su questo dispositivo. La riprogrammazione e la pubblicazione non sono disponibili finché non viene ripristinata la connessione.",
  'web.calendar.rateLimited.cause':
    'Questa area di lavoro legge il calendario più volte di quanto consentito dalla finestra corrente.',
  'web.calendar.rateLimited.resetLabel': 'Puoi riprovare',
  'web.calendar.rateLimited.resetUnknown': '{provider} non ha detto quando si ripristina.',
  'web.calendar.permission.requirementsLabel': 'Ambito richiesto',
  'web.calendar.permission.title': 'Non puoi vedere questo calendario',
  'web.calendar.permission.body':
    "L'accesso al calendario è concesso per marchio. Il tuo account non è presente sui marchi in questa visualizzazione.",

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Calendario',
  'web.receipt.breadcrumb.post': 'Posta',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Caricamento della ricevuta di pubblicazione',
  'web.receipt.notFound.title': 'Nessuna ricevuta con quel riferimento',
  'web.receipt.notFound.body':
    'Una ricevuta esiste una volta che la posta è stata spedita. Controlla il riferimento o apri il post dal calendario.',
  'web.receipt.error.title': 'Impossibile caricare la ricevuta',
  'web.receipt.error.body':
    'Lo scontrino è immutabile e non ne risente. Niente è stato ripubblicato.',

  'web.receipt.section.summary': 'Cosa è successo',
  'web.receipt.section.timeline': "Cronologia dell'evento",
  'web.receipt.section.items': 'Post root e elementi di follow-up',
  'web.receipt.section.attempts': 'Tentativi',
  'web.receipt.section.provenance': 'Provenienza',
  'web.receipt.section.cost': 'Utilizzo del fornitore',
  'web.receipt.section.analytics': 'Sincronizzazione di analisi',
  'web.receipt.section.targets': 'Obiettivi in questa campagna',

  'web.receipt.item.root': 'Posta radice',
  'web.receipt.item.comment': 'Commento {position}',
  'web.receipt.item.thread': 'Parte filettata {position}',
  'web.receipt.item.delay': 'Esegue {delay} dopo il post root',
  'web.receipt.item.noDelay': 'Funziona con il post root',
  'web.receipt.item.pending': 'Non ancora iniziato',
  'web.receipt.item.rootUnaffected':
    'Il post principale è attivo. Un elemento di follow-up che fallisce non cambia mai la situazione.',

  'web.receipt.attempt.heading': 'Tentativo {number}',
  'web.receipt.attempt.startedAt': 'Avviato {time}',
  'web.receipt.attempt.startedLabel': 'Iniziato',
  'web.receipt.attempt.responseSummary': 'Risposta del fornitore disinfettata',
  'web.receipt.attempt.duration': 'Ho preso {duration}',
  'web.receipt.attempt.httpStatus': 'Stato HTTP',
  'web.receipt.attempt.providerRequestId': 'Riferimento della richiesta del fornitore',
  'web.receipt.attempt.retryable': 'Riprovato automaticamente',
  'web.receipt.attempt.notRetryable': 'Non riprovato automaticamente',
  'web.receipt.attempt.nextRetry': 'Prossimo tentativo di {time}',
  'web.receipt.attempt.nextRetryLabel': 'Prossimo tentativo',
  'web.receipt.attempt.showResponse': 'Mostra la risposta del fornitore disinfettato',
  'web.receipt.attempt.hideResponse': 'Nascondi la risposta del fornitore disinfettata',
  'web.receipt.attempt.none': 'Un tentativo, nessun fallimento.',

  'web.receipt.provenance.capabilityVersion': 'Istantanea delle capacità',
  'web.receipt.provenance.capabilityHint':
    'Lo snapshot utilizzato in fase di approvazione e ricontrollato prima della spedizione.',
  'web.receipt.provenance.accountType': 'Tipo di conto',
  'web.receipt.provenance.externalAccount': 'Riferimento al conto esterno',
  'web.receipt.provenance.workflow': 'Riferimento al flusso di lavoro',
  'web.receipt.provenance.createdAt': 'Ricevuta scritta {time}',

  'web.receipt.approval.notRequired':
    'Per questo obiettivo non è stata richiesta alcuna approvazione.',
  'web.receipt.approval.policy': 'Politica {policy}',
  'web.receipt.approval.unknownPolicy': 'Riferimento alla politica non registrato',

  'web.receipt.cost.currency': 'Caricato in {currency}',
  'web.receipt.cost.estimatedLabel': 'Stima prima della pubblicazione',
  'web.receipt.cost.actualLabel': 'Riconciliato reale',
  'web.receipt.provenance.writtenLabel': 'Ricevuta scritta',
  'web.receipt.cost.reconciledAt': 'Riconciliato {time}',
  'web.receipt.cost.notMetered':
    '{provider} non addebita alcun costo per operazione per questo tipo di post.',

  'web.receipt.analytics.never': 'Analytics non è stato ancora sincronizzato per questo post.',
  'web.receipt.analytics.explain':
    "I fornitori si aggregano secondo i propri programmi. L'ora seguente è l'ultima volta che Relay li ha letti, non quando i numeri erano veri.",

  'web.receipt.export.download': 'Scarica la ricevuta',
  'web.receipt.export.copyReference': 'Copia il riferimento della ricevuta',
  'web.receipt.export.denied':
    'La condivisione di una ricevuta richiede il ruolo di proprietario, amministratore o approvatore. Tu sei {role}.',

  'web.receipt.partial.retryFailedOnly': 'Riprovare solo con le destinazioni non riuscite',
  'web.receipt.partial.retryHint':
    'Un nuovo tentativo non tocca mai un target che ha già prodotto un post esterno.',

  'web.receipt.remediation.user_action_required':
    'È necessaria una modifica in Relay o su {provider} prima di poter essere eseguita nuovamente.',
  'web.receipt.remediation.content_invalid':
    'Modifica il contenuto in modo che superi la convalida {provider}, quindi pianificalo di nuovo.',
  'web.receipt.remediation.transient_provider':
    '{provider} ha restituito un errore temporaneo. Relay ha riprovato secondo la propria pianificazione.',
  'web.receipt.remediation.permanent_provider':
    '{provider} ha rifiutato permanentemente. Riprovare lo stesso contenuto non cambierà la risposta.',
  'web.receipt.remediation.internal':
    'Questa è stata una colpa da parte nostra. È registrato con il riferimento di seguito.',
  'web.receipt.remediation.unknown':
    '{provider} ha restituito qualcosa per cui non abbiamo una regola. La risposta disinfettata è riportata di seguito.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Conti',
  'web.connection.tab.capabilities': 'Matrice delle capacità',
  'web.connection.tab.groups': 'Gruppi di clienti',
  'web.connection.loading': 'Caricamento degli account collegati',
  'web.connection.error.title': 'Impossibile caricare gli account collegati',
  'web.connection.error.body':
    "La pubblicazione non è influenzata. I post pianificati vengono comunque eseguiti con l'accesso archiviato.",
  'web.connection.list.label': 'Conti collegati',
  'web.connection.empty.example':
    'X, @acme, profilo personale, collegato il 12 giugno da Ana Ruiz, pubblicazioni e metriche, ultima pubblicazione il 6 agosto',
  'web.connection.filter.provider': 'Piattaforma',
  'web.connection.filter.health': 'Salute',
  'web.connection.filter.group': 'Gruppo di clienti',
  'web.connection.filter.anyHealth': 'Qualsiasi salute',
  'web.connection.healthFilter.healthy': 'Funzionante',
  'web.connection.healthFilter.expiring_soon': 'In scadenza a breve',
  'web.connection.healthFilter.expired': 'Accesso scaduto',
  'web.connection.healthFilter.revoked': 'Accesso revocato',
  'web.connection.healthFilter.permission_missing': 'Autorizzazione mancante',
  'web.connection.healthFilter.review_pending': 'In attesa della revisione della piattaforma',
  'web.connection.healthFilter.paused': 'In pausa',
  'web.connection.healthFilter.unknown': 'Salute non disponibile',

  'web.connection.row.summaryLabel': 'Cosa può fare questo account',
  'web.connection.row.expand': 'Mostra il riepilogo completo per {account}',
  'web.connection.row.collapse': 'Nascondi il riepilogo completo per {account}',
  'web.connection.row.metered': 'Misurato per operazione. {amount} stimati per creazione di post.',
  'web.connection.row.limitationHeading': 'Limitazioni su questo account',
  'web.connection.row.noLimitations': 'Nessuna limitazione di produzione o beta su questo account.',
  'web.connection.row.beta': 'Connettore beta',
  'web.connection.row.betaBody':
    'Questo connettore funziona, con limiti che non abbiamo finito di verificare. Controlla il post pubblicato prima di fare affidamento su di esso.',

  'web.connection.detail.expiryLabel': "L'accesso scade",
  'web.connection.health.expiresIn': "L'accesso scade {relativeTime}, il {date}",
  'web.connection.health.noExpiry':
    'Questo accesso non scade secondo il programma indicato da {provider}.',
  'web.connection.health.checkedAt': 'Stato controllato {relativeTime}',

  'web.connection.action.inspect': 'Ispeziona i permessi',
  'web.connection.action.viewCapabilities': 'Guarda cosa supporta',
  'web.connection.action.moveGroup': 'Passare a un altro gruppo',
  'web.connection.action.menu': 'Più azioni per {account}',

  'web.connection.pause.title': 'Mettere in pausa {account}?',
  'web.connection.resume.title': 'Riprendere {account}?',
  'web.connection.resume.body':
    'La pubblicazione dei post pianificati per questo account riprenderà negli orari pianificati. I post il cui tempo è già trascorso non vengono attivati ​​retroattivamente.',
  'web.connection.disconnect.confirmWord': 'DISCONNESSIONE',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# post programmato} many {# post programmati} other {# post programmati}} per questo account non verrà pubblicato.',
  'web.connection.disconnect.consequence.published':
    'I post già pubblicati rimangono su {provider}. Relay non li elimina.',
  'web.connection.disconnect.consequence.analytics':
    "Le metriche già raccolte rimangono in quest'area di lavoro e interrompono l'aggiornamento.",

  'web.connection.connect.title': 'Collega un account',
  'web.connection.connect.chooseProvider': 'Quale piattaforma',
  'web.connection.connect.permissionHeading': 'Cosa Relay chiederà a {provider}',
  'web.connection.connect.requirementHeading': 'Prima di continuare',
  'web.connection.connect.continue': 'Continua su {provider}',
  'web.connection.connect.handoffNote':
    'La schermata successiva è {provider}, non Relay. Relay non vede mai la tua password.',
  'web.connection.connect.noWriteWithoutApproval':
    "Il collegamento di un account non pubblica nulla. Ogni post segue ancora questa politica di approvazione dell'area di lavoro.",

  'web.connection.requirement.instagram':
    'La pubblicazione su Instagram richiede un account professionale, ovvero un account aziendale o creativo collegato a una pagina Facebook.',
  'web.connection.requirement.facebook':
    'Relay pubblica su Facebook Pages. Un profilo personale non può essere un obiettivo di pubblicazione.',
  'web.connection.requirement.linkedin':
    "Per pubblicare per un'organizzazione è necessario un ruolo di amministratore dei contenuti su quella pagina LinkedIn.",
  'web.connection.requirement.youtube':
    "Fino al completamento del controllo dell'app da parte di Google, i caricamenti da questo progetto verranno pubblicati come privati. Successivamente potrai modificare la visibilità su YouTube.",
  'web.connection.requirement.tiktok':
    'TikTok richiede che tu scelga tu stesso il pubblico per ogni post. Relay non può preselezionarne uno per te.',
  'web.connection.requirement.x':
    'X addebiti per operazione. Un post che contiene un URL costa più di un post di testo semplice e la stima viene visualizzata prima della pianificazione.',
  'web.connection.requirement.threads':
    "La pubblicazione Threads utilizza l'account collegato al tuo account professionale Instagram.",
  'web.connection.requirement.bluesky':
    "Bluesky si connette con una password dell'app creata nelle impostazioni Bluesky, non con la password del tuo account.",
  'web.connection.requirement.generic':
    "È necessaria l'autorizzazione per pubblicare su questo account dalla piattaforma stessa. Relay non può concederlo.",

  'web.connection.purpose.publish': 'Pubblicare i post pianificati in Relay.',
  'web.connection.purpose.readPosts':
    'Rileggendo un post pubblicato da Relay, in modo che la ricevuta possa dimostrare che è attivo.',
  'web.connection.purpose.identity':
    "Mostrando il nome esatto dell'account in Relay, in modo da non pubblicare mai su quello sbagliato.",
  'web.connection.purpose.analytics':
    'Leggendo le metriche riportate da questa piattaforma per i tuoi post.',
  'web.connection.purpose.refresh':
    "Mantenere attivo l'accesso in modo che un post pianificato non fallisca dall'oggi al domani.",
  'web.connection.purpose.chooseDestination':
    'Elenca le Pagine e i canali che puoi scegliere come target di pubblicazione.',

  'web.connection.permissions.title': 'Autorizzazioni su {account}',
  'web.connection.permissions.scopeColumn': 'Autorizzazione',
  'web.connection.permissions.stateColumn': 'Stato',
  'web.connection.permissions.purposeColumn': 'Per cosa viene utilizzato Relay',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {# autorizzazioni mancanti} many {# autorizzazioni mancanti} other {# autorizzazioni mancanti}}. Riconnettiti e accettalo per ripristinare le funzionalità seguenti.',
  'web.connection.permissions.snapshot': 'Leggi da {provider} {relativeTime}',

  'web.connection.capability.title': 'Matrice delle capacità',
  'web.connection.capability.subtitle':
    'Generato dalle definizioni del connettore con versione in questa build, quindi rivisto manualmente. Sono gli stessi dati utilizzati dal compositore e dalla pagina delle funzionalità pubbliche.',
  'web.connection.capability.tableLabel': 'Funzionalità per piattaforma',
  'web.connection.capability.featureColumn': 'Capacità',
  'web.connection.capability.legendTitle': 'Come leggere questo',
  'web.connection.capability.legend.supported':
    'Relay può farlo oggi per un account connesso del tipo giusto.',
  'web.connection.capability.legend.not_implemented':
    "La piattaforma lo offre e Relay non l'ha ancora creato. È sulla roadmap del connettore.",
  'web.connection.capability.legend.unsupported':
    'La piattaforma non lo offre tramite la sua API ufficiale, quindi nessuno strumento può farlo in sicurezza.',
  'web.connection.capability.legend.requires_review':
    "Costruito e la piattaforma lo concede solo dopo aver esaminato l'app o l'account.",
  'web.connection.capability.versionLabel': 'Definizioni dei connettori',
  'web.connection.capability.version': 'Versione definizioni connettore {version}',
  'web.connection.capability.observedAt': "L'istantanea legge {relativeTime}",
  'web.connection.capability.forAccount': 'Mostrato per {account}',
  'web.connection.capability.noSnapshot':
    'Ancora nessuno snapshot delle funzionalità per questo account. Riconnettiti per leggerne uno.',
  'web.connection.capability.cellLabel': '{feature} su {provider}: {state}',

  'web.connection.group.title': 'Gruppi di clienti',
  'web.connection.group.listLabel': 'Gruppi di clienti',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Nessun account} one {# account} many {# account} other {# account}}',
  'web.connection.group.create': 'Crea un gruppo',
  'web.connection.group.nameLabel': 'Nome del gruppo',
  'web.connection.group.namePlaceholder': 'Acme UE',
  'web.connection.group.moveTitle': 'Muovi {account}',
  'web.connection.group.moveLabel': 'Spostati in',
  'web.connection.group.moveConfirm': 'Sposta conto',
  'web.connection.group.movedAnnouncement': '{account} spostato in {group}',
  'web.connection.group.filterCalendarHint':
    'Un gruppo filtra il calendario e le analisi. Lo spostamento di un account mantiene tutti i post, le ricevute e le metriche già presenti.',
  'web.connection.group.empty.title': 'Nessun gruppo di clienti ancora',
  'web.connection.group.empty.body':
    'Un gruppo è un cliente o un marchio. Account di gruppo per filtrare il calendario e le analisi per cliente.',

  'web.connection.incident.title': 'Questo account richiede attenzione',
  'web.connection.incident.remediationHeading': 'Cosa fare',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# post programmati sono sospesi} many {# post programmati sono sospesi} other {# post programmati sono sospesi}} per questo account.',
  'web.connection.incident.nothingLost': 'Niente è perduto e nulla è duplicato.',
} as const;
