/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
  'composerWeb.pane.targets': 'Account e set di destinazione',
  'composerWeb.pane.master': 'Bozza principale e impostazioni condivise',
  'composerWeb.pane.variant': 'Versione per la destinazione aperta',
  'composerWeb.pane.review': 'Anteprima, validazione, costo e approvazione',
  'composerWeb.pane.showPreview': 'Mostra anteprima',
  'composerWeb.pane.hidePreview': 'Nascondi anteprima',
  'composerWeb.pane.previewCollapsed':
    'Il pannello di anteprima è nascosto. Aprilo per controllare il post finale.',

  'composerWeb.step.targets': 'Obiettivi',
  'composerWeb.step.write': 'Scrivi',
  'composerWeb.step.perTarget': 'Per bersaglio',
  'composerWeb.step.review': 'Recensione',
  'composerWeb.step.progress': 'Passaggio {current} di {total}',
  'composerWeb.step.legend': 'Composer passi',

  'composerWeb.summary.label': 'Bozza di sintesi',
  'composerWeb.summary.targets':
    '{count, plural, =0 {Nessun target} one {# target} many {# target} other {# target}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {Nessun problema} one {# problema} many {# problemi} other {# problemi}}',
  'composerWeb.summary.notScheduled': 'Nessun orario scelto',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Costo non ancora prezzato',
  'composerWeb.summary.openReview': 'Apri recensione',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Bozza principale',
  'composerWeb.rail.masterHint':
    'Modifica qui per raggiungere tutti gli obiettivi che ancora ereditano.',
  'composerWeb.rail.accountsHeading': 'Account target',
  'composerWeb.rail.setsHeading': 'Insiemi e gruppi',
  'composerWeb.rail.setsHelp':
    'Un Set è un gruppo salvato di account e valori predefiniti. Applicandone uno si copiano i suoi valori in questa bozza. Le modifiche successive al set non modificano questa bozza.',
  'composerWeb.rail.openTarget': 'Apri la versione per {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Limite sconosciuto',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {nessun supporto} one {# file multimediale} many {# file multimediali} other {# file multimediali}}',
  'composerWeb.rail.paused': 'In pausa. Non verrà pubblicato finché non lo riprenderai.',
  'composerWeb.rail.state.notBuilt': 'Non ancora costruito',
  'composerWeb.rail.state.unsupported': 'Il fornitore non supporta',
  'composerWeb.rail.empty': 'Nessun account ancora selezionato.',
  'composerWeb.rail.emptyHelp':
    'Scegli gli account che questo post dovrebbe raggiungere. Puoi aggiungerne altri in seguito.',
  'composerWeb.rail.divergenceHint':
    'Apri una destinazione per vedere la sua versione. Il progetto generale è invariato.',
  'composerWeb.rail.searchLabel': 'Filtra gli account',
  'composerWeb.rail.removeTarget': 'Rimuovere {account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Modifica globale',
  'composerWeb.globalEdit.title': 'Applica questa modifica a ogni target selezionato',
  'composerWeb.globalEdit.description':
    'La bozza principale cambia sempre. I target che ereditano ancora questo campo lo seguono. I target con la propria versione lo mantengono.',
  'composerWeb.globalEdit.fieldLabel': 'Campo',
  'composerWeb.globalEdit.compatibleHeading': 'Questi obiettivi accettano il cambiamento',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Questi obiettivi mantengono la propria versione',
  'composerWeb.globalEdit.incompatibleHeading':
    'Questi obiettivi non possono sopportare il cambiamento',
  'composerWeb.globalEdit.incompatibleHelp':
    'Niente viene eliminato senza dirtelo. Ciascun account riportato di seguito riceve una versione esplicita con la modifica adattata e potrai modificarla in seguito.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} consente i caratteri {limit}. Questo testo è {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} non accetta un collegamento in questo campo. Il collegamento rimane nella bozza principale e nelle destinazioni che lo consentono.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} accetta {limit, plural, one {# file} many {# file} other {# file}}. Questa bozza contiene {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported': '{account} non accetta file {mimeType}.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} non supporta gli elementi successivi, quindi la sequenza rimane nella bozza principale.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} pubblica testo semplice. I segni di formattazione apparirebbero come caratteri.',
  'composerWeb.globalEdit.adaptedPreview': 'Ciò che ottiene invece {account}',
  'composerWeb.globalEdit.confirm': 'Applicare e creare le versioni',
  'composerWeb.globalEdit.nothingToApply':
    'Non cambia nulla. La bozza principale ha già questo valore.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Modifica applicata a # target} many {Modifica applicata a # target} other {Modifica applicata a # target}}. {adapted, plural, =0 {Nessun target necessitava di una versione adattata} one {# target ha ricevuto una versione adattata} many {# target ha ricevuto versioni adattate} other {# target ha ricevuto versioni adattate}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'Questo obiettivo ha una propria versione',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# campo differisce dalla bozza principale} many {# campi differiscono dalla bozza principale} other {# campi differiscono dalla bozza principale}}',
  'composerWeb.override.field.body': 'Pubblica testo',
  'composerWeb.override.field.contentKind': 'Tipo di posta',
  'composerWeb.override.field.locale': 'Linguaggio dei contenuti',
  'composerWeb.override.field.mediaIds': 'Media',
  'composerWeb.override.field.links': 'Collegamenti',
  'composerWeb.override.field.signature': 'Firma',
  'composerWeb.override.field.threadItems': 'Commenti e discussione',
  'composerWeb.override.field.schedule': 'Programma',
  'composerWeb.override.resetField': 'Reimposta {field} su principale',
  'composerWeb.override.resetFieldTitle': 'Reimpostare {field} per {account}?',
  'composerWeb.override.resetFieldBody':
    'La versione di {field} scritta per {account} viene scartata e viene utilizzata nuovamente la bozza principale. Nessun altro cambio di target.',
  'composerWeb.override.resetAll': 'Reimposta ogni campo su master',
  'composerWeb.override.inheritNotice':
    'Questo obiettivo segue la bozza principale. La modifica di qualsiasi cosa qui crea una versione ricevuta solo da {account}.',
  'composerWeb.override.created': '{account} ora ha il proprio {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Limiti per {account}',
  'composerWeb.limits.text': 'Testo fino a {limit} caratteri',
  'composerWeb.limits.linkCost':
    'Un collegamento conta come {count, plural, one {# carattere} many {# caratteri} other {# caratteri}} qualunque sia la sua lunghezza.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Nessuna immagine} one {# immagine} many {fino a # immagini} other {fino a # immagini}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {nessun video} one {# video} many {fino a # video} other {fino a # video}}',
  'composerWeb.limits.duration': 'Video fino a {duration}',
  'composerWeb.limits.aspect': 'Proporzioni tra {min} e {max}',
  'composerWeb.limits.fileSize': 'File fino a {size}',
  'composerWeb.limits.mimeTypes': 'Tipi di file accettati: {types}',
  'composerWeb.limits.source':
    "Dall'istantanea della funzionalità {version}, leggere {relativeTime}.",
  'composerWeb.limits.thumbnailRequired': 'È richiesta una miniatura.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': 'Impostazioni {provider}',
  'composerWeb.native.privacy': 'Chi può vederlo?',
  'composerWeb.native.privacyChoose': 'Scegli un pubblico',
  'composerWeb.native.privacyExplicit':
    '{provider} non consente un pubblico preselezionato. Scegline uno prima che possa essere programmato.',
  'composerWeb.native.community': 'Comunità',
  'composerWeb.native.board': 'Consiglio',
  'composerWeb.native.group': 'Gruppo o Pagina',
  'composerWeb.native.organization': 'Organizzazione',
  'composerWeb.native.channel': 'Canale',
  'composerWeb.native.publication': 'Pubblicazione',
  'composerWeb.native.disclosureHeading': 'Divulgazione',
  'composerWeb.native.disclosureCommercial': 'Questo post promuove un prodotto o servizio',
  'composerWeb.native.disclosureBranded':
    "Questo post è contenuto brandizzato per un'altra azienda",
  'composerWeb.native.disclosureAi':
    'Alcuni di questi contenuti sono stati realizzati con uno strumento AI',
  'composerWeb.native.disclosureUnsupported':
    '{provider} non offre questa divulgazione tramite la sua API. Aggiungilo invece nel testo.',
  'composerWeb.native.none': 'Nessuna impostazione {provider} si applica a questo tipo di post.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Risolto il problema {provider}',
  'composerWeb.entity.resolvedId': 'ID account {externalId}',
  'composerWeb.entity.plainTextWarning':
    'Non abbinato. Verrà pubblicato come testo semplice, che non è un tag nativo su {provider}.',
  'composerWeb.entity.removeMention': 'Rimuovere la menzione di {label}',
  'composerWeb.entity.addMention': 'Aggiungi una menzione',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Nessuna menzione} one {# menzione} many {# menzioni} other {# menzioni}}, {resolved} abbinato ad un conto reale',
  'composerWeb.entity.lookupUnsupported':
    '{provider} non offre la ricerca di entità per questo tipo di account.',
  'composerWeb.entity.lookupNotBuilt':
    'Post Array non ha ancora creato la ricerca di entità per {provider}. Nel frattempo non si indovina nulla.',
  'composerWeb.entity.searchHint': 'Digita almeno due caratteri, quindi scegli un risultato.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {Nessuna corrispondenza} one {# corrispondenza} many {# corrispondenze} other {# corrispondenze}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Collegamenti',
  'composerWeb.links.detected':
    '{count, plural, one {# link trovati in questa bozza} many {# link trovati in questa bozza} other {# link trovati in questa bozza}}',
  'composerWeb.links.noneDetected': 'Nessun collegamento ancora in questa bozza.',
  'composerWeb.links.modeLabel': 'Come viene pubblicato questo collegamento',
  'composerWeb.links.original': 'URL originale',
  'composerWeb.links.utmSource': 'Fonte',
  'composerWeb.links.utmMedium': 'Medio',
  'composerWeb.links.utmCampaign': 'Campagna',
  'composerWeb.links.utmTerm': 'Termine',
  'composerWeb.links.utmContent': 'Contenuto',
  'composerWeb.links.domainVerified': '{domain}, verificato per questa area di lavoro',
  'composerWeb.links.domainDefault': 'Dominio predefinito Post Array',
  'composerWeb.links.domainNone': 'Nessun dominio con marchio è stato ancora verificato.',
  'composerWeb.links.notAllowedHere': '{account} non consente un collegamento qui.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Commento',
  'composerWeb.sequence.kindThread': 'Parte filettata',
  'composerWeb.sequence.kindLabel': 'Tipo di articolo',
  'composerWeb.sequence.moveUp': 'Sposta questo elemento prima',
  'composerWeb.sequence.moveDown': 'Sposta questo elemento più tardi',
  'composerWeb.sequence.remove': 'Rimuovi questo elemento',
  'composerWeb.sequence.absoluteTime': 'Viene eseguito a {time}, ovvero {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'Se un elemento fallisce, il post già pubblicato rimane pubblicato e gli elementi successivi non vengono eseguiti. Ottieni un oggetto di azione.',
  'composerWeb.sequence.maxReached':
    '{account} accetta {limit, plural, one {# elemento successivo} many {# elementi successivi} other {# elementi successivi}}.',
  'composerWeb.sequence.minDelay': 'Il ritardo più breve consentito da {provider} è {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Stesso account del post',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Nessun problema} one {# problema} many {# problemi} other {# problemi}} su questo articolo',
  'composerWeb.sequence.customMinutes': "Minuti dopo l'articolo precedente",

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Ripeti questo post',
  'composerWeb.repeat.cadenceLabel': 'Quanto spesso',
  'composerWeb.repeat.maximum': 'Un post ripetuto può essere eseguito al massimo {limit} volte.',
  'composerWeb.repeat.occurrenceLabel': 'Numero di post',
  'composerWeb.repeat.duplicateCheck':
    "Ogni occorrenza viene controllata per verificare la presenza di contenuti duplicati prima della pubblicazione. Un'occorrenza che non supera il controllo diventa un elemento di azione invece di essere pubblicato.",
  'composerWeb.repeat.occurrenceList': 'Prime occorrenze',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {e altre # occorrenze} many {e altre # occorrenze} other {e altre # occorrenze}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Set e firma',
  'composerWeb.set.pickerTitle': 'Iniziare da un insieme',
  'composerWeb.set.pickerDescription':
    'Un Set riempie obiettivi, testo e impostazioni. La bozza creata è indipendente, quindi la modifica successiva del set non modifica mai un post approvato o programmato.',
  'composerWeb.set.accountCount':
    '{count, plural, one {# account} many {# account} other {# account}}',
  'composerWeb.set.apply': 'Usa questo set',
  'composerWeb.set.none': 'Nessun set ancora salvato.',
  'composerWeb.signature.pickerLabel': 'Firma',
  'composerWeb.signature.scope': 'Per {project} su {provider} in {language}',
  'composerWeb.signature.previewHeading': 'Come finisce il post',
  'composerWeb.signature.notMatching':
    'Questa firma ha come ambito un progetto, una piattaforma o una lingua diversa, quindi non è offerta qui.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Aiutaci con questo testo',
  'composerWeb.assist.unavailableTitle': "L'assistenza testuale non è configurata",
  'composerWeb.assist.unavailableBody':
    'Nessun gateway AI è configurato per questa area di lavoro, quindi le azioni di assistenza sono disattivate. Tutto il resto nel compositore funziona normalmente.',
  'composerWeb.assist.targetLabel': 'Si applica a',
  'composerWeb.assist.targetMaster': 'Il progetto principale',
  'composerWeb.assist.targetVariant': 'La versione per {account}',
  'composerWeb.assist.beforeLabel': 'Testo attuale',
  'composerWeb.assist.afterLabel': 'Testo proposto',
  'composerWeb.assist.regionLabel': 'Modifica del testo proposta, non ancora applicata',
  'composerWeb.assist.added': 'aggiunto',
  'composerWeb.assist.removed': 'rimosso',
  'composerWeb.assist.evidence': 'Prove e fonti',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Nessuna fonte trovata per questa affermazione. Controllalo prima di pubblicare.',
  'composerWeb.assist.failed':
    'La richiesta di assistenza non è stata completata. Il tuo testo è invariato.',
  'composerWeb.assist.noMediaGeneration':
    'Post Array non crea immagini o video. Porta i file finiti nella libreria e pubblicali qui.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    "Questa è la versione approvata. La modifica crea una nuova versione e cancella l'approvazione.",
  'composerWeb.autosave.pinnedAcknowledge': "Modifica e cancella l'approvazione",
  'composerWeb.autosave.conflictTitle': 'Due versioni di questa bozza',
  'composerWeb.autosave.conflictKeepMine': 'Conserva quello che ho scritto',
  'composerWeb.autosave.conflictKeepTheirs': 'Utilizza la versione di {name}',
  'composerWeb.autosave.conflictHelp':
    'Niente viene unito automaticamente. Scegli per campo, quindi salva.',
  'composerWeb.autosave.retry': 'Prova a salvare di nuovo',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Scorciatoie Composer',
  'composerWeb.shortcuts.nextTarget': 'Prossimo obiettivo',
  'composerWeb.shortcuts.previousTarget': 'Obiettivo precedente',
  'composerWeb.shortcuts.nextIssue': 'Prossimo numero',
  'composerWeb.shortcuts.previousIssue': 'Numero precedente',
  'composerWeb.shortcuts.save': 'Salva la bozza adesso',
  'composerWeb.shortcuts.openSchedule': 'Apri il foglio di pianificazione',
  'composerWeb.shortcuts.open': 'Mostra scorciatoie',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'Recensione',
  'composerWeb.review.contentVersion': 'Versione del contenuto {checksum}',
  'composerWeb.review.approvalPolicy': 'Politica: {policy}',
  'composerWeb.review.approverPending': 'In attesa di una decisione da {approver}.',
  'composerWeb.review.approverNone': 'Per questi obiettivi non è richiesta alcuna approvazione.',
  'composerWeb.review.perTargetHeading': 'Ciò che riceve ciascun account',
  'composerWeb.review.finalUrl': 'Collegamento pubblicato',
  'composerWeb.review.privacyState': 'Pubblico: {value}',
  'composerWeb.review.disclosureState': 'Divulgazione: {value}',
  'composerWeb.review.disclosureNone': 'Nessuna divulgazione impostata',
  'composerWeb.review.mediaVersion': '{name}, versione {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# target non può ancora essere pianificato} many {# target non può ancora essere pianificato} other {# target non può ancora essere pianificato}}',
  'composerWeb.review.offlineBlocked':
    'La pianificazione e la pubblicazione richiedono una connessione. La tua bozza è al sicuro su questo dispositivo.',
  'composerWeb.review.publishConfirm':
    'Questo pubblica immediatamente su {count, plural, one {# account} many {# account} other {# account}}. Non è possibile annullarlo da qui.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Nuova bozza',
  'composerWeb.page.loading': 'Caricamento della bozza, dei suoi obiettivi e dei loro limiti',
  'composerWeb.page.errorTitle': 'Impossibile aprire questa bozza',
  'composerWeb.page.errorBody':
    "Niente è andato perduto. Riprova e, se il problema persiste, il riferimento riportato di seguito aiuta l'assistenza a trovare la richiesta.",
  'composerWeb.page.noConnectionsTitle': 'Collega un account prima di comporre',
  'composerWeb.page.noConnectionsBody':
    "Una bozza necessita di almeno un account connesso in modo che Post Array conosca i limiti, l'anteprima e le impostazioni da mostrare.",
  'composerWeb.page.noConnectionsExample':
    'Esempio: con X e LinkedIn collegati, una bozza diventa due versioni native con i propri contatori.',
  'composerWeb.page.permissionTitle': "Non puoi creare post in quest'area di lavoro",
  'composerWeb.page.permissionBody':
    'La composizione richiede il ruolo di editor o superiore. Un proprietario o un amministratore può modificare il tuo ruolo.',
  'composerWeb.page.rateLimitTitle': 'Troppe bozze salvate in poco tempo',
  'composerWeb.page.rateLimitCause':
    "Quest'area di lavoro ha raggiunto il limite di scrittura per la finestra corrente. Nel frattempo il tuo testo verrà conservato su questo dispositivo.",
  'composerWeb.page.rateLimitAlternative':
    'Continua a scrivere. Il salvataggio riprende automaticamente quando la finestra si reimposta.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Griglia',
  'mediaLib.view.list': 'Elenco',
  'mediaLib.view.label': 'Disposizione',
  'mediaLib.sort.label': 'Ordina',
  'mediaLib.sort.newest': 'Prima il più recente',
  'mediaLib.sort.name': 'Nome',
  'mediaLib.sort.size': 'Prima il più grande',
  'mediaLib.select': 'Selezionare {name}',
  'mediaLib.column.file': 'Archivio',
  'mediaLib.column.type': 'Digitare',
  'mediaLib.column.size': 'Dimensioni',
  'mediaLib.column.altText': 'Testo alternativo',
  'mediaLib.column.rights': 'Diritti',
  'mediaLib.column.added': 'Aggiunto',
  'mediaLib.openDetail': 'Apri {name}',

  'mediaLib.empty.title': 'Nessun supporto ancora',
  'mediaLib.empty.body':
    'Carica le immagini e i video che hai già o importa un file da un URL. Post Array controlla il tipo e le dimensioni rispetto a ciascun account su cui pubblichi.',
  'mediaLib.empty.example':
    'Esempio: launch_hero.jpg, 1600 x 900, set di testo alternativo, utilizzato in 2 post.',
  'mediaLib.error.title': 'Impossibile caricare la libreria',
  'mediaLib.error.body': 'I tuoi file sono al sicuro. Nulla è stato cambiato da questo fallimento.',
  'mediaLib.offline.title': 'La libreria non è disponibile offline',
  'mediaLib.offline.body':
    'Non possiamo aggiornare la libreria senza una connessione. I file già su questa schermata non sono cambiati. Riconnettiti, poi riprova.',
  'mediaLib.rateLimited.title': 'La libreria ha bisogno di una breve pausa',
  'mediaLib.rateLimited.cause':
    "L'API ci ha chiesto di rallentare durante il caricamento dei tuoi file. I tuoi media memorizzati sono al sicuro.",
  'mediaLib.rateLimited.resetLabel': 'Riprova dopo',
  'mediaLib.rateLimited.alternative':
    'Puoi continuare a scrivere bozze localmente, ma i caricamenti e le modifiche alla libreria aspettano che il limite si azzeri.',
  'mediaLib.loading': 'Caricamento della libreria multimediale',
  'mediaLib.permission.title': "Non puoi vedere questa libreria dell'area di lavoro",
  'mediaLib.permission.body':
    'Per visualizzare i contenuti multimediali è necessario il ruolo di spettatore o superiore su questo progetto. Un proprietario o un amministratore può concederlo.',

  'mediaLib.upload.heading': 'Aggiungi contenuti multimediali',
  'mediaLib.upload.browse': 'Scegli i file',
  'mediaLib.upload.dropHint':
    'Trascina i file qui o sceglili. I caricamenti riprendono se la connessione si interrompe.',
  'mediaLib.upload.queueHeading': 'Caricamenti',
  'mediaLib.upload.progress': '{name}, {percent} di {size} inviati',
  'mediaLib.upload.paused': 'In pausa. {sent} di {size} è già memorizzato.',
  'mediaLib.upload.resume': 'Riprendi il caricamento',
  'mediaLib.upload.pause': 'Metti in pausa il caricamento',
  'mediaLib.upload.cancel': 'Annulla questo caricamento',
  'mediaLib.upload.retry': 'Prova di nuovo a caricare',
  'mediaLib.upload.finalizing': 'Finitura {name}',
  'mediaLib.upload.done': '{name} è nella tua libreria',
  'mediaLib.upload.failed': '{name} non è terminato. {reason}',
  'mediaLib.upload.offline':
    'Non in linea. I caricamenti continuano da dove si erano interrotti quando ti ricolleghi.',
  'mediaLib.upload.rejectedType':
    '{name} è {mimeType}, che nessuno degli account selezionati accetta.',
  'mediaLib.upload.rejectedSize':
    '{name} è {size}. Il limite più basso tra i tuoi account è {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Accettato da # dei tuoi account} many {Accettato da # dei tuoi account} other {Accettato da # dei tuoi account}}',
  'mediaLib.upload.rejectedBy': 'Non accettato da {accounts}',
  'mediaLib.upload.checkedAgainst': 'Verificato rispetto ai conti selezionati in questa bozza.',
  'mediaLib.upload.noTargets':
    "Nessun account selezionato, quindi il file viene controllato solo rispetto alle impostazioni predefinite dell'area di lavoro.",
  'mediaLib.import.urlLabel': 'URL del file pubblico',
  'mediaLib.import.urlPlaceholder': 'https://cdn.example.com/launch-video.mp4',
  'mediaLib.import.importing': 'Importazione del media in corso',
  'mediaLib.import.succeeded': 'Il file è nella tua libreria',
  'mediaLib.import.scanPending':
    'Post Array ha registrato la sua fonte. La pubblicazione attende che il controllo di sicurezza sia terminato.',
  'mediaLib.import.failed': 'Non è stato possibile importare il file',
  'mediaLib.import.failedHelp':
    'Controlla che il link sia pubblico e punti direttamente a un file multimediale supportato, poi riprova.',
  'mediaLib.import.readOnly': "Collega l'API per importare file in questo ambiente.",
  'mediaLib.import.offline': 'Riconnettiti prima di importare un file.',
  'mediaLib.import.issue.invalid': 'Inserisci un URL completo.',
  'mediaLib.import.issue.scheme': 'Usa un link HTTP o HTTPS.',
  'mediaLib.import.issue.credentials': 'Usa un link senza nome utente o password.',
  'mediaLib.retention.title':
    'I file memorizzati sono conservati per 30 giorni dopo la creazione del post',
  'mediaLib.retention.body':
    "Una volta che un file è collegato a un post, lo eliminiamo permanentemente dall'archivio di Post Array 30 giorni dopo la creazione di quel post. I file in attesa di essere collegati usano la data di caricamento come ripiego per la pulizia. Il testo del post, le ricevute di pubblicazione e la cronologia di controllo restano disponibili più a lungo. Un post pubblicato su una piattaforma social non viene rimosso quando il suo file memorizzato scade.",
  'mediaLib.retention.limits':
    'Immagini, audio e file PDF possono arrivare a {imageSize}. I video possono arrivare a {videoSize}.',
  'mediaLib.retention.expiresLabel': 'Data di eliminazione del file',
  'mediaLib.retention.deleted': 'Eliminato permanentemente',
  'mediaLib.retention.deletedTitle': 'Questo file memorizzato è stato eliminato',
  'mediaLib.retention.deletedBody':
    'Il periodo di conservazione di 30 giorni è terminato. Il testo del post, le ricevute di pubblicazione e la cronologia di controllo restano.',
  'mediaLib.processing.unavailableTitle': 'Questo file non è pronto per la pubblicazione',
  'mediaLib.processing.unavailableBody':
    "L'elaborazione o un controllo di sicurezza sono ancora in sospeso, oppure non sono stati superati. Carica di nuovo il file se questo stato non si risolve.",
  'mediaLib.processing.pendingTitle':
    'La scansione di sicurezza non è disponibile in fase di prelancio',
  'mediaLib.processing.pendingBody':
    'Il file è memorizzato per 30 giorni, ma non può essere collegato a un post pubblicato finché la scansione di sicurezza non è attivata.',
  'mediaLib.processing.blockedTitle': 'Questo file non può essere pubblicato',
  'mediaLib.processing.blockedBody':
    'Il file non ha superato la elaborazione o un controllo di sicurezza. Carica un file diverso.',

  'mediaLib.alt.heading': 'Testo alternativo',
  'mediaLib.alt.help':
    "Descrivi ciò che conta nell'immagine per qualcuno che non può vederlo. Di solito sono sufficienti una o due frasi.",
  'mediaLib.alt.count': '{used} di caratteri {limit}',
  'mediaLib.alt.requiredBy': 'Richiesto da {accounts}',
  'mediaLib.alt.waive': 'Questa immagine non contiene informazioni',
  'mediaLib.alt.waiveReason': 'Perché non ha bisogno di descrizione',
  'mediaLib.alt.waiveHelp':
    "Usalo solo per la decorazione. Un'immagine rinunciata viene pubblicata con una descrizione vuota laddove la piattaforma lo consente.",
  'mediaLib.alt.waived': 'Rinunciato da {name} su {date}. Motivo: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} non accetta testo alternativo tramite la sua API per questo account.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# file non ha testo alternativo} many {# file non hanno testo alternativo} other {# file non hanno testo alternativo}}',

  'mediaLib.rights.heading': 'Diritti e consenso',
  'mediaLib.rights.declared': 'Dichiarato da {name} su {date}',
  'mediaLib.rights.undeclared':
    'Non ancora dichiarato. Dichiararlo prima della pubblicazione del file.',
  'mediaLib.rights.ownerLabel': 'Chi possiede questo file',
  'mediaLib.rights.ownerSelf': 'Questo spazio di lavoro',
  'mediaLib.rights.ownerLicensed': 'Concesso in licenza da qualcun altro',
  'mediaLib.rights.ownerUgc': "Un cliente o un creatore ha dato l'autorizzazione",
  'mediaLib.rights.licenseLabel': "Riferimento alla licenza o all'autorizzazione",
  'mediaLib.rights.peopleLabel': 'Le persone appaiono in questo file',
  'mediaLib.rights.peopleConsent': 'Tutti quelli mostrati hanno accettato di essere pubblicati',
  'mediaLib.rights.musicLabel': 'Questo file contiene musica o una colonna sonora',
  'mediaLib.rights.confirm':
    'Ho il diritto di pubblicare questo file, comprese le persone, la musica, i loghi e i marchi in esso contenuti.',
  'mediaLib.rights.blocking':
    'Questo file non può essere pianificato finché non vengono dichiarati i diritti.',

  'mediaLib.editor.heading': 'Modifica immagine',
  'mediaLib.editor.description':
    'Ogni modifica viene salvata come una nuova versione. Il file originale viene conservato e può essere ripristinato.',
  'mediaLib.editor.tab.crop': 'Ritaglia',
  'mediaLib.editor.tab.transform': 'Ridimensiona e ruota',
  'mediaLib.editor.tab.canvas': 'Tela',
  'mediaLib.editor.tab.output': 'Formato e dimensione',
  'mediaLib.editor.tab.thumbnail': 'Miniatura',
  'mediaLib.editor.presetLabel': 'Aspetto preimpostato',
  'mediaLib.editor.presetFree': 'Gratuito',
  'mediaLib.editor.presetFor': '{ratio}, utilizzato da {accounts}',
  'mediaLib.editor.cropX': 'Ritaglia dal bordo iniziale',
  'mediaLib.editor.cropY': "Ritaglia dall'alto",
  'mediaLib.editor.cropWidth': 'Larghezza del raccolto',
  'mediaLib.editor.cropHeight': 'Altezza del raccolto',
  'mediaLib.editor.cropKeyboardHint':
    'La casella di ritaglio è impostata con campi numerici, quindi funziona completamente dalla tastiera.',
  'mediaLib.editor.widthLabel': 'Larghezza in pixel',
  'mediaLib.editor.heightLabel': 'Altezza in pixel',
  'mediaLib.editor.lockRatio': 'Mantieni il rapporto attuale',
  'mediaLib.editor.rotateLabel': 'Rotazione',
  'mediaLib.editor.rotateDegrees': '{degrees} gradi',
  'mediaLib.editor.flipHorizontal': "Capovolgi lungo l'asse verticale",
  'mediaLib.editor.flipVertical': "Capovolgi lungo l'asse orizzontale",
  'mediaLib.editor.canvasColor': 'Colore di sfondo',
  'mediaLib.editor.canvasFit': "Come l'immagine si trova sulla tela",
  'mediaLib.editor.canvasFitCover': "Riempi la tela e ritaglia l'eccesso",
  'mediaLib.editor.canvasFitContain': "Adatta l'intera immagine e riempi il resto",
  'mediaLib.editor.formatLabel': 'Formato di uscita',
  'mediaLib.editor.qualityLabel': 'Qualità di compressione',
  'mediaLib.editor.qualityValue': '{value} di 100',
  'mediaLib.editor.estimatedSize': 'Uscita stimata {size}, da {original}',
  'mediaLib.editor.estimatedSizeUnknown':
    "La dimensione dell'output è nota solo una volta elaborato il file.",
  'mediaLib.editor.thumbnailHelp':
    'Scegli il fotogramma o il file utilizzato come miniatura del video in cui la piattaforma ne accetta uno.',
  'mediaLib.editor.thumbnailFrame': 'Inquadratura su {time}',
  'mediaLib.editor.save': 'Salva come nuova versione',
  'mediaLib.editor.saving': 'Salvataggio della versione {version}',
  'mediaLib.editor.saved': "Versione {version} salvata. L'originale è ancora qui.",
  'mediaLib.editor.discard': 'Elimina queste modifiche',
  'mediaLib.editor.noChanges': 'Nessuna modifica da salvare ancora.',
  'mediaLib.editor.revalidate':
    'Il salvataggio ricontrolla questo file rispetto a tutti gli account nelle bozze che lo utilizzano.',
  'mediaLib.editor.noGeneration':
    'Questo editor modifica il file che hai caricato. Non crea nuove immagini.',

  'mediaLib.versions.heading': 'Versioni',
  'mediaLib.versions.original': 'Caricamento originale',
  'mediaLib.versions.current': 'Versione attuale',
  'mediaLib.versions.restore': 'Ripristina la versione {version}',
  'mediaLib.versions.item': 'Versione {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'Da dove proviene questo file',
  'mediaLib.provenance.sourceUrl': 'URL di origine',
  'mediaLib.provenance.fetchedAt': 'Recuperato {date}',
  'mediaLib.provenance.declaredAuthor': 'Autore dichiarato',
  'mediaLib.provenance.declaredLicense': 'Licenza dichiarata',
  'mediaLib.provenance.contentCredentials': 'Credenziali del contenuto incorporato',
  'mediaLib.provenance.contentCredentialsNone':
    'Questo file non contiene credenziali di contenuto incorporato. Questo è comune e non significa che ci sia qualcosa che non va.',
  'mediaLib.provenance.unverified':
    'Questi dettagli provengono dalla fonte, non da Post Array. Controllali prima di fare affidamento su di loro.',

  'mediaLib.picker.title': 'Scegli il supporto',
  'mediaLib.picker.description':
    'I file vengono confrontati con gli account selezionati in questa bozza.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Scegli file} one {Aggiungi # file} many {Aggiungi # file} other {Aggiungi # file}}',
  'mediaLib.picker.forMaster': 'Aggiunta alla bozza principale',
  'mediaLib.picker.forVariant': 'Aggiunta solo alla versione per {account}',
} as const;
