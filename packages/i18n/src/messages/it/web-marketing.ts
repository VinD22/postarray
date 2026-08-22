/**
 * The public marketing site and public documentation surfaces.
 *
 * Rules that bind this file specifically, beyond the catalog rules in
 * `lint.ts`:
 *
 *  - Every claim here is either a product fact we control (price, channel
 *    allowance, surfaces) or a provider fact that carries a source link and a
 *    verification date in the page that renders it. No adjective stands in for
 *    a number.
 *  - Nothing here promises reach, ranking, engagement or "going" anywhere.
 *  - Nothing here describes AI image or AI video generation as a Relay
 *    feature, because it is not one.
 *  - No integration is called official until the provider has approved it. The
 *    connector matrix uses `capability.level.*` from `connections.ts` so the
 *    marketing site and the product cannot drift apart.
 *  - Legal wording that must be drafted by counsel is marked with
 *    `web.legal.counselPending.*` rather than guessed at here.
 */
export const webMarketingMessages = {
  /* ---------------------------------------------------------------------- */
  /* Shared marketing furniture                                              */
  /* ---------------------------------------------------------------------- */

  'web.brand.name': 'Relay',
  'web.brand.tagline':
    'Il piano di controllo della pubblicazione multilingue per persone e agenti.',
  'web.skipToContent': 'Passa al contenuto principale',
  'web.nav.label': 'Navigazione del sito',
  'web.nav.openMenu': 'Menù',
  'web.nav.closeMenu': 'Chiudi il menu',
  'web.nav.footerLabel': 'Navigazione nel piè di pagina',

  'web.cta.startTrial': 'Inizia la prova di 7 giorni',
  'web.cta.seePricing': 'Vedi il prezzo',
  'web.cta.seeCapabilities': 'Leggi la matrice delle capacità',
  'web.cta.readDocs': 'Leggi la documentazione',
  'web.cta.trialFootnote':
    'Polar collects a payment method, charges $0 today, and shows the exact first charge date before you confirm.',

  'web.label.lastReviewed': 'Ultima revisione {date}',
  'web.label.nextReview': 'Prossima recensione {date}',
  'web.label.researchDate': 'Ricercato {date}',
  'web.label.officialSource': 'Fonte ufficiale',
  'web.label.onThisPage': 'In questa pagina',
  'web.label.provider': 'Piattaforma',
  'web.label.capability': 'Capacità',

  'web.notFound.title': "Non c'è nessuna pagina a questo indirizzo",
  'web.notFound.body':
    'Il collegamento potrebbe non essere aggiornato oppure abbiamo ritirato la pagina. Le pagine che smettono di essere accurate vengono ritirate anziché lasciate e il registro delle modifiche lo registra quando ciò accade.',
  'web.notFound.action': 'Vai alla home page',

  'web.correction.title': 'Ho trovato qualcosa che non va in questa pagina',
  'web.correction.body':
    "Le regole della piattaforma cambiano e noi sbagliamo. Invia l'URL e ciò che è impreciso e correggeremo la pagina o la ritireremo.",
  'web.correction.email': 'correzioni@relay.esempio',

  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.home.title': 'Relay, il piano di controllo della pubblicazione multilingue',
  'web.meta.home.description':
    "Trasforma un'idea originaria in contenuto nativo della piattaforma, approvala una volta, pubblicala in modo affidabile tramite le API ufficiali della piattaforma e scopri cosa migliorare successivamente.",
  'web.meta.product.title': 'Come funziona Relay',
  'web.meta.product.description':
    'Una passeggiata attraverso il desk editoriale: componi una volta, adatta per piattaforma, convalida rispetto ai limiti reali, approva, pianifica, pubblica e conserva la ricevuta.',
  'web.meta.integrations.title': 'Piattaforme Relay pubblica su',
  'web.meta.integrations.description':
    'A quali piattaforme si connette Relay, cosa può fare oggi ciascuna connessione e cosa non consente la piattaforma stessa.',
  'web.meta.capabilities.title': 'Matrice delle capacità del connettore',
  'web.meta.capabilities.description':
    'Una tabella per piattaforma e capacità generata dalle nostre definizioni di connettore, che separa ciò che abbiamo creato da ciò che la piattaforma non offre.',
  'web.meta.creators.title': 'Relay per i creatori',
  'web.meta.creators.description':
    'Per i creatori solisti che pubblicano la stessa idea in diversi formati e lingue senza riscriverla cinque volte.',
  'web.meta.agencies.title': 'Relay per le agenzie',
  'web.meta.agencies.description':
    'Separazione dei clienti, approvazioni, collegamenti di revisione condivisibili, ricevute e reporting per i team che pubblicano per conto di altre persone.',
  'web.meta.developers.title': 'Relay per gli sviluppatori',
  'web.meta.developers.description':
    "Un backend dietro l'app Web, l'API REST, un server MCP remoto, la CLI e webhook firmati. Stesse regole di omologazione su ogni superficie.",
  'web.meta.pricing.title': 'Pricing',
  'web.meta.pricing.description':
    'One plan. $29 a month, or $300 a year which is $25 a month billed annually. 30 active channels, unlimited team members, no feature tiers.',
  'web.meta.resources.title': 'Risorse',
  'web.meta.resources.description':
    'Stato, registro delle modifiche, documentazione, metodologia, confronti, il radar degli strumenti e il catalogo delle opportunità.',
  'web.meta.status.title': 'Stato',
  'web.meta.status.description':
    'Stato attuale di ogni superficie Relay e di ogni connettore, oltre alla cronologia degli incidenti.',
  'web.meta.changelog.title': 'Registro delle modifiche',
  'web.meta.changelog.description':
    'Cosa è stato spedito, cosa è cambiato per i connettori e cosa è stato corretto.',
  'web.meta.docs.title': 'Documentazione',
  'web.meta.docs.description':
    'API REST, server MCP, CLI e documentazione webhook per la creazione di Relay.',
  'web.meta.methodology.title': 'Metodologia',
  'web.meta.methodology.description':
    'Come effettuiamo ricerche sulle affermazioni della piattaforma, come le dataamo, come confrontiamo altri prodotti e come correggiamo gli errori.',
  'web.meta.compare.title': 'Confronti',
  'web.meta.compare.description':
    'Confronti onesti e datati con altri strumenti di pubblicazione, incluso per chi è il migliore.',
  'web.meta.toolRadar.title': 'Radar degli strumenti creativi',
  'web.meta.toolRadar.description':
    'Un catalogo datato e rivisto dalla redazione di strumenti creativi specialistici, con limitazioni, avvertenze sui diritti e divulgazione commerciale.',
  'web.meta.opportunities.title': 'Opportunità di promozione',
  'web.meta.opportunities.description':
    'Un catalogo curato di luoghi in cui un prodotto può essere elencato, lanciato o discusso, con regole di invio proprie per ciascuna destinazione.',
  'web.meta.legal.title': 'Legale e politiche',
  'web.meta.legal.description':
    "Termini, privacy, utilizzo accettabile, utilizzo dell'intelligenza artificiale, cookie, subresponsabili, rimborsi, copyright, sicurezza, accessibilità, termini per sviluppatori e termini di affiliazione.",

  /* ---------------------------------------------------------------------- */
  /* Home                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.home.promise':
    "Trasforma un'idea originaria in contenuto nativo della piattaforma, approvala una volta, pubblicala in modo affidabile e scopri cosa migliorare successivamente.",
  'web.home.lede':
    "Relay è uno sportello editoriale per persone responsabili di ciò che esce. Scrivi una volta, adatti per piattaforma, vedi i limiti reali prima di pianificare, ottieni l'approvazione di cui hai bisogno, pubblichi tramite le API ufficiali della piattaforma e conservi una ricevuta per ogni post.",
  'web.home.summaryLine':
    'One plan at $29 a month or $300 a year. 30 active social channels, unlimited team members, no feature tiers. The seven day trial collects a payment method and charges $0 at checkout.',

  'web.home.example.title': "Un'idea, cinque versioni native della piattaforma",
  'web.home.example.body':
    "Il compositore inizia con una versione master. La selezione di un account apre una sostituzione solo per quell'account, con i propri limiti attivi e la propria anteprima. Niente di ciò che scrivi per LinkedIn cambia ciò che X riceve.",
  'web.home.example.column.account': 'Conto',
  'web.home.example.column.variant': 'Cosa riceve questo account',
  'web.home.example.column.check': 'Controllato prima della pianificazione',
  'web.home.example.caption':
    'Una composizione illustrativa. I limiti e le impostazioni mostrati derivano dalla definizione del connettore per ciascuna piattaforma, non da una stima.',
  'web.home.example.x.account': 'X, @direzione nord',
  'web.home.example.x.variant': 'Testo principale, abbreviato, più un thread di due post',
  'web.home.example.x.check':
    'Conteggio dei caratteri, ordine dei thread, costo API stimato per un post di collegamento',
  'web.home.example.linkedin.account': 'LinkedIn, Strumenti Northbound',
  'web.home.example.linkedin.variant': 'Testo principale più lungo con il documento allegato',
  'web.home.example.linkedin.check':
    "Ruolo dell'organizzazione, durata del post, tipo di documento",
  'web.home.example.instagram.account': 'Instagram, @northbound.tools',
  'web.home.example.instagram.variant':
    'Ritaglio quadrato della stessa immagine, didascalia riscritta per il feed',
  'web.home.example.instagram.check':
    'Tipo di account professionale, proporzioni, testo alternativo presente',
  'web.home.example.youtube.account': 'YouTube, direzione nord',
  'web.home.example.youtube.variant':
    'La stessa clip di uno Short, con titolo e descrizione propri',
  'web.home.example.youtube.check':
    'Ambito del caricamento, stato di controllo, privacy in cui verrà effettuato il caricamento',
  'web.home.example.bluesky.account': 'Bluesky, direzione nord.esempio',
  'web.home.example.bluesky.variant': 'Masterizza il testo con la scheda di collegamento',
  'web.home.example.bluesky.check':
    'Conteggio dei caratteri, risoluzione della scheda di collegamento, testo alternativo presente',

  'web.home.pillars.title': 'Ciò in cui Relay è stato progettato per essere bravo',
  'web.home.pillars.confidence.title': 'Pubblica con fiducia',
  'web.home.pillars.confidence.body':
    "Un'anteprima reale per account, policy deterministiche e controlli della piattaforma prima che qualsiasi cosa venga messa in coda, l'approvazione richiesta dal tuo spazio di lavoro, una ricevuta immutabile con l'ID postale esterno e uno stato di integrità per ogni connessione.",
  'web.home.pillars.confidence.proof':
    'Ogni scrittura esterna porta con sé una chiave di idempotenza, quindi un arresto anomalo del lavoratore dopo che la piattaforma ha accettato un post non ne crea un secondo.',
  'web.home.pillars.adapt.title': 'Adattare anziché duplicare',
  'web.home.pillars.adapt.body':
    'Varianti per piattaforma che puoi sovrascrivere un account alla volta e transcreazione anziché traduzione letterale, con un glossario del progetto e un revisore nominato per lingua.',
  'web.home.pillars.adapt.proof':
    "L'interfaccia è disponibile nelle lingue selezionate. L'adattamento dei contenuti copre 30 lingue di contenuto e ognuna di esse è revisionabile prima della pubblicazione.",
  'web.home.pillars.loop.title': 'Chiudi il ciclo',
  'web.home.pillars.loop.body':
    "Analisi che denominano la metrica, la piattaforma che l'ha riportata, il denominatore e quando è stata aggiornata l'ultima volta. Laddove una piattaforma non segnala qualcosa, Relay lo dice invece di mostrare uno zero.",
  'web.home.pillars.loop.proof':
    'Un post viene confrontato con la tua mediana anziché con un punteggio che nessuno può verificare.',
  'web.home.pillars.anywhere.title': 'Lavora da dove sei già',
  'web.home.pillars.anywhere.body':
    "L'app web, un'API REST, un server MCP remoto, una CLI e i webhook firmati chiamano gli stessi servizi applicativi, le stesse regole di autorizzazione e gli stessi validatori.",
  'web.home.pillars.anywhere.proof':
    "Un agente non può ignorare una policy di approvazione utilizzando una superficie diversa, perché la policy viene applicata nel servizio, non nell'interfaccia.",
  'web.home.pillars.economics.title': 'Economics you can predict',
  'web.home.pillars.economics.body':
    'One price, every shipped feature, 30 active channels and unlimited team members. Platform usage that a provider charges per operation is passed through at cost and shown before you confirm the action.',
  'web.home.pillars.economics.proof':
    'There is no image or video generation credit system, because Relay does not generate media.',

  'web.home.honest.title': 'Cosa Relay non fa',
  'web.home.honest.lede':
    'Questi sono confini, non una tabella di marcia. Se uno di essi cambia, cambia prima nel registro delle modifiche.',
  'web.home.honest.noMedia':
    'Nessuna generazione di immagini AI e nessuna generazione di video AI. Relay adatta, approva, pubblica e misura i media che porti.',
  'web.home.honest.noAutomationOfEngagement':
    'Nessun Mi piace automatico, follower, ripubblicazioni, risposte non richieste o messaggi diretti. Nessun baccello di coinvolgimento e nessun impegno inventato.',
  'web.home.honest.noUnofficial':
    'Nessuna automazione del browser, nessuna riproduzione dei cookie, nessuno scraping e nessun endpoint di pubblicazione non ufficiale. Solo API della piattaforma ufficiale.',
  'web.home.honest.noPromises':
    'Nessuna promessa su portata, posizionamento o coinvolgimento. Relay può dirti cosa è successo e cosa testare dopo. Non può dirti cosa farà il pubblico.',
  'web.home.honest.noUnattendedPublishing':
    "Nessuna pubblicazione automatica per impostazione predefinita. Un agente può redigere, convalidare e richiedere l'approvazione. Un essere umano decide prima che qualsiasi cosa diventi pubblica, a meno che tu non decida deliberatamente di escludere una politica specifica.",

  'web.home.surfaces.title': 'Cinque superfici, un backend',
  'web.home.surfaces.body':
    "Gli stessi casi d'uso, gli stessi controlli di locazione, gli stessi validatori e gli stessi flussi di lavoro di pubblicazione. Una superficie è una via d'accesso, mai una scorciatoia oltre una regola.",
  'web.home.surfaces.web': 'Applicazione Web',
  'web.home.surfaces.webBody':
    'Composer, calendario, approvazioni, analisi, connessioni e impostazioni.',
  'web.home.surfaces.api': 'API REST',
  'web.home.surfaces.apiBody':
    'Chiavi con ambito, chiavi di idempotenza su ogni scrittura, impaginazione del cursore, errori digitati.',
  'web.home.surfaces.mcp': 'Server MCP remoto',
  'web.home.surfaces.mcpBody':
    "HTTP, OAuth, ambiti per strumento e un'anteprima prima di ogni chiamata consequenziale.",
  'web.home.surfaces.cli': 'CLI',
  'web.home.surfaces.cliBody':
    'Output stabile leggibile dalla macchina per script e integrazione continua.',
  'web.home.surfaces.webhooks': 'Webhook firmati',
  'web.home.surfaces.webhooksBody':
    'Pubblica risultati, decisioni di approvazione e stato della connessione, con riconsegna.',

  'web.home.closing.title': 'Inizia con un account e un post',
  'web.home.closing.body':
    "Collega un account, redige un post, guarda l'esecuzione della convalida, pianificala e leggi la ricevuta. Questo è l'intero prodotto in circa dieci minuti.",

  'web.home.v2.heroTemplate': 'Post nativi e in linea con il Brand per {platform}.',
  'web.home.v2.sticker.trial': 'Prova di 7 giorni',
  'web.home.v2.sticker.official': 'Solo API ufficiali',
  'web.home.v2.marqueeCaption': 'Solo API ufficiali.',
  'web.home.v2.surfacesStat': 'Interfacce su un unico backend condiviso',
  'web.home.v2.pricingTeaser.title': 'Quanto costa',
  'web.home.v2.variantScene.masterLabel': 'Bozza principale',
  'web.home.v2.variantScene.progress': '{revealed} di {total}',

  /* ---------------------------------------------------------------------- */
  /* Product                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.product.title': "La scrivania dell'editoria",
  'web.product.lede':
    'È necessario rispondere a sette domande in ogni passaggio senza fare clic su nulla: cosa viene pubblicato, dove, quale versione riceve ciascun account, quando e in quale fuso orario, chi lo ha approvato, quanto potrebbe costare e cosa è successo.',

  'web.product.step.source.title': 'Fonte',
  'web.product.step.source.body':
    'Parti da un brief, da un file che già possiedi, da un elemento RSS o da una richiesta di un agente. I media importati mantengono la provenienza che hai fornito, incluso da dove provengono e chi ne detiene i diritti.',
  'web.product.step.compose.title': 'Componi una volta, quindi sovrascrivi',
  'web.product.step.compose.body':
    "Una versione master guida ogni obiettivo. La selezione di un account apre una sostituzione solo per quell'account: il proprio testo, il proprio ritaglio multimediale, le proprie impostazioni, il proprio contatore del limite live e la propria anteprima. Il ripristino di un override ripristina il master in un'unica azione e mostra prima la differenza.",
  'web.product.step.validate.title': 'Convalida prima che qualsiasi cosa venga messa in coda',
  'web.product.step.validate.body':
    "La convalida è deterministica e viene eseguita sul server. Controlla i limiti della piattaforma dallo snapshot della funzionalità con versione, il tipo di account, il testo alternativo, i diritti multimediali, le regole di duplicazione e cadenza, la risoluzione di menzione e destinazione e il costo stimato di utilizzo della piattaforma. Ogni problema nomina l'obiettivo a cui appartiene e come risolverlo.",
  'web.product.step.approve.title': 'Approvare una volta',
  'web.product.step.approve.body':
    "L'approvazione è una politica dello spazio di lavoro, non un'abitudine. Un revisore vede ogni obiettivo, ogni variante, il fuso orario, lo stato della privacy e il costo stimato su uno schermo e funziona su un telefono. Il contenuto modificato dopo l'approvazione richiede nuovamente l'approvazione.",
  'web.product.step.schedule.title': 'Pianifica in un fuso orario reale',
  'web.product.step.schedule.body':
    "Ogni post programmato memorizza un istante e un fuso orario IANA, mai un'ingenua ora locale. Le transizioni dell'ora legale vengono visualizzate prima della conferma, non scoperte in seguito.",
  'web.product.step.publish.title': 'Pubblicare e conservare la ricevuta',
  'web.product.step.publish.body':
    "Ogni destinazione viene inviata con una chiave di idempotenza. Un obiettivo che fallisce non ripristina un obiettivo che ha avuto successo e quello stato ha il suo nome: parzialmente pubblicato. Ogni risultato produce una ricevuta immutabile con l'ID postale esterno, l'identificatore della richiesta, la cronologia dei tentativi e l'errore esatto, se presente.",
  'web.product.step.learn.title': 'Impara',
  'web.product.step.learn.body':
    "Le metriche vengono normalizzate, nominate, attribuite alla piattaforma che le ha riportate e contrassegnate con l'orario di aggiornamento. Una metrica che una piattaforma non segnala è contrassegnata come non disponibile con il motivo. Non viene mai rappresentato come zero.",

  'web.product.shot.caption':
    "Le schermate in questa pagina vengono acquisite dal prodotto in esecuzione. Fino a quando una superficie non è sufficientemente completa da poter essere fotografata onestamente, la descriviamo a parole invece di disegnarne un'immagine.",
  'web.product.shot.pending': 'Screenshot in attesa di acquisizione',
  'web.product.shot.pendingReason':
    "Questa superficie è ancora in costruzione. Pubblicheremo una cattura reale piuttosto che un'illustrazione.",

  'web.product.states.title': 'Gli stati a cui a nessuno piace progettare',
  'web.product.states.body':
    "Uno strumento editoriale viene giudicato nella giornata storta, non in quella buona. Ognuno di questi ha una schermata disegnata, una frase semplice e un'azione successiva.",
  'web.product.states.partial':
    'Pubblicato parzialmente: quali obiettivi sono attivi, quali hanno fallito e perché.',
  'web.product.states.revoked':
    "Un token revocato trovato al momento dell'invio, con il percorso di riconnessione.",
  'web.product.states.rateLimited':
    "Un limite di velocità della piattaforma, con quando viene reimpostato e cosa c'è in coda dietro di esso.",
  'web.product.states.duplicate':
    'Un blocco duplicato o di cadenza, con la regola che è stata attivata e il percorso di ricorso.',
  'web.product.states.offline':
    'Offline durante la composizione: nulla di ciò che scrivi va perduto.',
  'web.product.states.permission':
    "Un'azione che il tuo ruolo non consente, nominando il ruolo che la consente.",

  /* ---------------------------------------------------------------------- */
  /* Integrations and capability matrix                                      */
  /* ---------------------------------------------------------------------- */

  'web.integrations.title': 'Piattaforme',
  'web.integrations.lede':
    'Relay si connette tramite API della piattaforma ufficiale. Ogni connettore ha un proprietario denominato, un URL della policy registrato e una data di revisione. Un connettore non viene elencato come supportato finché non supera la definizione del connettore Fine.',
  'web.integrations.reviewNotice.title':
    'Nessun connettore viene descritto come ufficiale prima che la piattaforma lo approvi',
  'web.integrations.reviewNotice.body':
    "Diverse piattaforme richiedono una revisione dell'app prima che un'applicazione possa essere pubblicata per conto di un cliente. Laddove tale revisione è eccezionale, il connettore lo dice e descrive esattamente cosa è limitato fino al superamento.",
  'web.integrations.accountTypes': 'Tipi di account su cui questo connettore può pubblicare',
  'web.integrations.restriction': 'Restrizione che dovresti conoscere prima di connetterti',
  'web.integrations.cost': 'Costo di utilizzo della piattaforma',
  'web.integrations.viewMatrix': 'Scopri tutte le funzionalità di questa piattaforma',

  'web.capabilities.title': 'Matrice delle capacità del connettore',
  'web.capabilities.lede':
    'Generato dalle stesse definizioni del connettore lette dal prodotto, quindi rivisto da una persona prima della pubblicazione. Il marketing non può promettere qualcosa che un adattatore non può fare.',
  'web.capabilities.legend.title': 'Come leggere questa tabella',
  'web.capabilities.legend.body':
    'Quattro stati e la differenza tra i due stati centrali è importante. Non ancora costruito è il nostro arretrato. Non offerto dalla piattaforma è un fatto relativo alla piattaforma che nessuno strumento può aggirare.',
  'web.capabilities.tableCaption':
    'Funzionalità per piattaforma. Ogni cellula nomina il suo stato sia in parole che in base al colore.',
  'web.capabilities.snapshot': 'Versione definizioni connettore {version}, rivista {date}',
  'web.capabilities.sourceNote':
    "Ogni affermazione relativa alla piattaforma in questa tabella è collegata alla documentazione ufficiale da cui proviene e alla data in cui l'abbiamo letta l'ultima volta.",

  /* ---------------------------------------------------------------------- */
  /* Audience pages                                                          */
  /* ---------------------------------------------------------------------- */

  'web.creators.title': 'Per i creatori',
  'web.creators.lede':
    "Pubblichi la stessa idea in diversi formati, a volte in più di una lingua, e sei l'intero team. Il lavoro che Relay rimuove è la ribattitura, il ritaglio e il controllo.",
  'web.creators.job.adapt.title': 'Scrivilo una volta, spedisci cinque versioni native',
  'web.creators.job.adapt.body':
    "La versione master porta l'idea. Ogni account ottiene la lunghezza, il ritaglio, le impostazioni e il tono che la piattaforma si aspetta e puoi vederli tutti fianco a fianco prima di impegnarti.",
  'web.creators.job.languages.title': "Pubblica in un'altra lingua senza indovinare",
  'web.creators.job.languages.body':
    "La transcreazione mantiene l'intento piuttosto che le parole, utilizza il glossario del tuo progetto e segnala se un recensore nativo lo ha letto. Niente viene pubblicato in una lingua per la quale non puoi garantire a meno che tu non lo dica.",
  'web.creators.job.rights.title': 'Conserva il record dei tuoi diritti insieme al file',
  'web.creators.job.rights.body':
    'I media raccontano da dove provengono, chi ne detiene i diritti e se sono stati creati con uno strumento generativo. Le piattaforme lo chiedono sempre più. Relay memorizza la tua risposta con la risorsa invece di chiedertela nuovamente.',
  'web.creators.job.cost.title': 'Conosci il costo prima di pubblicare',
  'web.creators.job.cost.body':
    'X addebita per operazione e addebita di più per un post contenente un URL. Relay lo stima prima di confermare, quindi una settimana pesante di collegamento è una decisione piuttosto che una fattura a sorpresa.',
  'web.creators.notFor.title': 'Cosa non è questo',
  'web.creators.notFor.body':
    "Relay non genera immagini o video, non esegue l'automazione del coinvolgimento e non prevede il rendimento di un post. Se questi sono gli strumenti che desideri, altri prodotti li fanno e preferiremmo che tu lo sapessi ora.",

  'web.agencies.title': 'Per le agenzie',
  'web.agencies.lede':
    "Pubblichi per conto di altre persone, il che rende l'attribuzione, l'approvazione e la prova parte del lavoro piuttosto che un piacere.",
  'web.agencies.job.separation.title': 'Separazione del cliente che regge',
  'web.agencies.job.separation.body':
    'Ogni spazio di lavoro è isolato a livello di database e di applicazione. Una query che attraversa il confine di uno spazio di lavoro fallisce in Postgres, non solo in un percorso di codice che qualcuno potrebbe dimenticare.',
  'web.agencies.job.approval.title': 'Approvazioni che un cliente può effettivamente utilizzare',
  'web.agencies.job.approval.body':
    'Un revisore vede ogni target, ogni variante, il programma con il suo fuso orario e il costo stimato su un unico schermo, e lo schermo funziona su un telefono. Le decisioni di approvazione vengono registrate con chi, quando e cosa hanno visto.',
  'web.agencies.job.receipts.title': 'Prove della conversazione imbarazzante',
  'web.agencies.job.receipts.body':
    "Ogni pubblicazione produce una ricevuta immutabile con l'ID postale esterno e la cronologia completa dei tentativi. Quando un cliente chiede se è successo qualcosa alle nove, alla risposta sono allegati un timestamp e un identificatore della piattaforma.",
  'web.agencies.job.roles.title': 'Ruoli che corrispondono al modo in cui è suddiviso il lavoro',
  'web.agencies.job.roles.body':
    'Proprietario, amministratore, manager, redattore, approvatore, analista e visualizzatore, con ambito per progetto e per account. Membri del team illimitati, perché la tariffazione per posto fa sì che le agenzie condividano gli accessi e questo è un problema di sicurezza.',
  'web.agencies.limits.title': 'Il confine, detto chiaramente',
  'web.agencies.limits.body':
    'Un piano copre 30 canali social attivi. Un canale è un account social, una pagina, un profilo, un gruppo o una connessione a una pubblicazione. Se te ne servono più di 30, dicci di cosa hai bisogno e ti daremo una risposta diretta anziché un livello nascosto.',

  'web.developers.title': 'Per gli sviluppatori',
  'web.developers.lede':
    'La pubblicazione è la parte di un flusso di lavoro in cui un errore è pubblico e permanente. Relay ti offre un backend, errori digitati, idempotenza su ogni scrittura e un modello di approvazione che un agente non può aggirare.',
  'web.developers.surface.api.title': 'API REST',
  'web.developers.surface.api.body':
    'Chiavi API con ambito, una chiave di idempotenza richiesta a ogni scrittura, impaginazione del cursore e una busta di errore digitata contenente un codice stabile, una chiave di messaggio e dettagli ripuliti. Nessun carico utile del provider ti viene mai riflesso in modo grezzo.',
  'web.developers.surface.mcp.title': 'Server MCP remoto',
  'web.developers.surface.mcp.body':
    'HTTP streaming con OAuth. Gli strumenti sono granulari e ognuno dichiara i propri effetti collaterali. Lettura, stesura, richiesta di approvazione, pianificazione e pubblicazione sono ambiti separati, pertanto un modello in grado di eseguire la bozza non può essere pubblicato.',
  'web.developers.surface.cli.title': 'CLI',
  'web.developers.surface.cli.body':
    'Ogni comando supporta un output leggibile dalla macchina con una forma stabile, quindi uno script può analizzarlo e un processo di integrazione continua può fallire su di esso.',
  'web.developers.surface.webhooks.title': 'Webhook firmati',
  'web.developers.surface.webhooks.body':
    'Pubblica risultati, decisioni di approvazione, stato della connessione e risultati di convalida, firmati, resistenti alla riproduzione e riconsegnabili dalla dashboard.',
  'web.developers.safety.title': 'Il modello di sicurezza degli agenti',
  'web.developers.safety.body':
    "Una credenziale dell'agente è un account di servizio con ambito, non una copia di una sessione personale. Presenta restrizioni per marchio, per account, per locale, per dominio, per cadenza e per look ahead e il server autorizza nuovamente ogni chiamata anziché fidarsi dell'host dell'agente.",
  'web.developers.safety.injection':
    "Pagine Web, feed, commenti e risposte della piattaforma vengono trattati come dati non attendibili. L'output del modello viene riconvalidato in modo deterministico, perché un modello che dice che un post va bene non è una decisione di sicurezza.",
  'web.developers.safety.killSwitch':
    'Ogni agente e ogni area di lavoro dispone di un kill switch che interrompe il lavoro in sospeso senza eliminarlo.',
  'web.developers.openSource.title': 'Pezzi aperti',
  'web.developers.openSource.body':
    'Il contratto del connettore, la CLI, gli esempi di schema, le definizioni dello strumento MCP e il simulatore del provider sono le parti necessarie per creare su Relay senza un account sandbox. Laddove un repository non è ancora stato pubblicato, questa pagina lo dice invece di collegarsi a nulla.',

  /* ---------------------------------------------------------------------- */
  /* Pricing                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.pricing.title': 'One plan',
  'web.pricing.lede':
    'There are no feature tiers, so there is no comparison table to read. Both billing intervals unlock every shipped feature.',
  'web.pricing.intervalHeading': 'Choose how you pay',
  'web.pricing.monthlyLabel': 'Billed monthly',
  'web.pricing.annualLabel': 'Billed annually',
  'web.pricing.annualDetail': '$300 charged once a year.',
  'web.pricing.monthlyDetail': '$29 charged every month.',
  'web.pricing.perMonthNote':
    'Prices are in US dollars. Polar adds any sales tax or VAT that applies where you are.',

  'web.pricing.beside.title': 'What you are agreeing to',
  'web.pricing.beside.channels':
    '30 active social channels. A channel is one social account, Page, profile, group or publication connection.',
  'web.pricing.beside.members':
    'Unlimited team members, workspaces and project groups. There is no per seat charge.',
  'web.pricing.beside.fairUse':
    'Unlimited drafts, scheduled posts and stored receipts under a published fair use and anti spam policy. Those controls exist to protect your connected accounts and they apply identically to every subscriber.',
  'web.pricing.beside.metered':
    'X charges per API operation and charges more for a post that contains a URL. Relay passes that through at cost, estimates it before you confirm the action, and shows it in your usage. Other platform fees are passed through only when they are disclosed before the action.',
  'web.pricing.beside.noMedia':
    'AI image generation and AI video generation are not included and are not sold. There are no media credits, because Relay does not generate media.',
  'web.pricing.beside.trial':
    'The trial runs for seven days with every feature. Polar collects a payment method at checkout and charges $0 today. The exact first charge amount and date are shown next to the start action before you confirm.',
  'web.pricing.beside.conversion':
    'If you do nothing, the trial converts on day seven to the interval you chose and Polar charges the amount shown at checkout. Polar emails a reminder three days before that happens.',
  'web.pricing.beside.cancel':
    'Cancel from Settings at any time without contacting support. Cancel before the trial converts and no charge is attempted. Cancel after that and you keep access until the paid period ends.',
  'web.pricing.beside.data':
    'Nothing is deleted when a subscription ends. You can export your content, receipts and analytics, and you can delete them yourself.',

  'web.pricing.included.title': 'Included, in both intervals',
  'web.pricing.compare.title': 'Why there is no comparison table here',
  'web.pricing.compare.body':
    'A comparison table exists to show what a cheaper plan takes away. There is one plan, so the table would have one column. If we ever add a tier, we will say what moved and why on the changelog before the price page changes.',

  'web.pricing.testimonials.title': 'There are no customer quotes on this page yet',
  'web.pricing.testimonials.body':
    'A quote goes up only when the customer wrote it, gave written permission for it, and we can point to the work it describes. Until then an empty space is more honest than a wall of invented praise.',

  'web.pricing.faq.title': 'Questions people ask before paying',
  'web.pricing.faq.channels.q': 'What happens if I go over 30 channels',
  'web.pricing.faq.channels.a':
    'Nothing is disconnected and nothing is deleted. Channels over the limit become read only, you choose which ones stay active, and we tell you before it happens.',
  'web.pricing.faq.refund.q': 'Do you refund',
  'web.pricing.faq.refund.a':
    'Yes, under the published refund and cancellation policy, and always where consumer law requires it. Billing is handled by Polar as merchant of record and refunds are issued through Polar.',
  'web.pricing.faq.selfHost.q': 'Can I run it myself',
  'web.pricing.faq.selfHost.a':
    'Not today. Whether there will be a self hosted edition, and under which licence, is an open decision. We will publish the answer rather than imply one.',
  'web.pricing.faq.xCost.q': 'How much will X actually cost me',
  'web.pricing.faq.xCost.a':
    'It depends on how many posts you publish and how many of them contain a URL, because X prices those differently. Relay estimates each action before you confirm it and totals it in your usage view. We do not mark it up.',
  'web.pricing.faq.trialAbuse.q': 'Can I start a second trial',
  'web.pricing.faq.trialAbuse.a':
    'Repeat trials are limited by Polar. If you have a legitimate reason, contact support and a person will look at it.',

  /* ---------------------------------------------------------------------- */
  /* Resources index                                                         */
  /* ---------------------------------------------------------------------- */

  'web.resources.title': 'Risorse',
  'web.resources.lede':
    'Verità operativa sul prodotto e ricerca alla base di tutto ciò che affermiamo su una piattaforma.',
  'web.resources.status.body':
    'Stato attuale di ogni superficie e ogni connettore, con cronologia degli incidenti.',
  'web.resources.changelog.body':
    'Cosa è stato spedito, cosa è cambiato per un connettore e cosa abbiamo corretto.',
  'web.resources.docs.body': 'Documentazione API REST, MCP, CLI e webhook.',
  'web.resources.methodology.body':
    'Come ricerchiamo, datiamo, reperiamo e correggiamo ogni affermazione relativa alla piattaforma.',
  'web.resources.compare.body':
    'Confronti datati con altri strumenti, incluso chi si adatta a ciascuno.',
  'web.resources.capabilities.body':
    'Per piattaforma, per funzionalità, generato dalle definizioni del connettore.',
  'web.resources.toolRadar.body':
    'Strumenti creativi specialistici, datati, con limitazioni e divulgazione.',
  'web.resources.opportunities.body':
    'Luoghi selezionati da lanciare, elencare o contribuire, con le regole di ciascuna destinazione.',
  'web.resources.legal.body':
    'Terms, privacy, acceptable use, AI use, security and the rest of the policy set.',
  'web.resources.guides.title': 'Guide e flussi di lavoro',
  'web.resources.guides.empty': 'Nessuna guida è stata ancora pubblicata',
  'web.resources.guides.emptyBody':
    'Lo standard editoriale richiede dati di prodotto originali, un flusso di lavoro riproducibile, fonti di piattaforma primarie con una data di verifica e un editor umano nominato. Le prime guide pubblicano quando lo incontrano.',

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.status.title': 'Stato',
  'web.status.lede':
    "Lo stato di ogni superficie Relay e di ogni connettore. Lo stato del connettore copre il nostro adattatore e l'API della piattaforma da cui dipende.",
  'web.status.updated': 'Gli stati sono impostati manualmente. Ultimo aggiornamento {time}.',
  'web.status.surfaces.title': 'Superfici',
  'web.status.connectors.title': 'Connettori',
  'web.status.level.operational': 'Funzionante normalmente',
  'web.status.level.degraded': 'Degradato',
  'web.status.level.partial': 'Interruzione parziale',
  'web.status.level.outage': 'Interruzione',
  'web.status.level.maintenance': 'Manutenzione programmata',
  'web.status.level.notLive': 'Non ancora vivo',
  'web.status.notLiveBody':
    "Questo connettore è stato creato ma non trasporta ancora il traffico dei clienti, quindi non c'è nulla su cui segnalare.",
  'web.status.incidents.title': "Storia dell'incidente",
  'web.status.incidents.empty': 'Nessun incidente è stato registrato',
  'web.status.incidents.emptyBody':
    'Questa pagina inizia volutamente vuota. Pubblichiamo ogni incidente che ha influenzato la pubblicazione, compresi quelli causati dai nostri stessi errori, con la cronologia e cosa è cambiato in seguito.',
  'web.status.incident.started': 'Avviato {time}',
  'web.status.incident.resolved': 'Risolto {time}',
  'web.status.incident.impact': 'Impatto',
  'web.status.incident.cause': 'Causa',
  'web.status.incident.followUp': 'Cosa è cambiato dopo',
  'web.status.subscribe.title': 'Fatti dire quando qualcosa si rompe',
  'web.status.subscribe.body':
    "L'integrità della connessione, gli errori di pubblicazione e gli incidenti della piattaforma vengono forniti come webhook firmati al tuo endpoint. Non esiste ancora una mailing list separata sullo stato.",

  /* ---------------------------------------------------------------------- */
  /* Changelog                                                               */
  /* ---------------------------------------------------------------------- */

  'web.changelog.title': 'Registro delle modifiche',
  'web.changelog.lede':
    'Modifiche al prodotto, modifiche ai connettori e correzioni. Una modifica di funzionalità che influisce su ciò che puoi pubblicare viene visualizzata qui prima che appaia in qualsiasi altro punto del sito.',
  'web.changelog.kind.shipped': 'Spedito',
  'web.changelog.kind.changed': 'Cambiato',
  'web.changelog.kind.fixed': 'Risolto',
  'web.changelog.kind.connector': 'Connettore',
  'web.changelog.kind.correction': 'Correzione',
  'web.changelog.kind.security': 'Sicurezza',
  'web.changelog.empty': 'Niente è stato ancora spedito pubblicamente',
  'web.changelog.emptyBody':
    'Relay è in costruzione. La prima voce qui è la prima cosa che un cliente può utilizzare, non una pietra miliare su di noi.',

  /* ---------------------------------------------------------------------- */
  /* Docs shell                                                              */
  /* ---------------------------------------------------------------------- */

  'web.docs.title': 'Documentazione',
  'web.docs.lede':
    "Un backend, quattro vie d'accesso. Ogni sezione documenta gli stessi casi d'uso, quindi un concetto che impari nell'API REST è lo stesso concetto in MCP e nella CLI.",
  'web.docs.section.start.title': 'Iniziare',
  'web.docs.section.start.body':
    'Autenticazione, spazi di lavoro, progetti e il tuo primo post pubblicato.',
  'web.docs.section.api.title': 'API REST',
  'web.docs.section.api.body':
    'Risorse, impaginazione, idempotenza, codici di errore e limiti di velocità.',
  'web.docs.section.mcp.title': 'server MCP',
  'web.docs.section.mcp.body':
    'Trasporto, OAuth, catalogo degli strumenti, ambiti e handshake di approvazione.',
  'web.docs.section.cli.title': 'CLI',
  'web.docs.section.cli.body':
    'Installa, autentica e il contratto di output leggibile dalla macchina.',
  'web.docs.section.webhooks.title': 'Webhook',
  'web.docs.section.webhooks.body': 'Catalogo eventi, verifica firma, tentativi e riconsegna.',
  'web.docs.section.connectors.title': 'Connettori',
  'web.docs.section.connectors.body':
    'Requisiti per piattaforma, tipi di account, limiti e restrizioni note.',
  'web.docs.section.errors.title': "Riferimento all'errore",
  'web.docs.section.errors.body': 'Ogni codice di errore, cosa lo causa e cosa fare al riguardo.',
  'web.docs.pending': 'Non ancora pubblicato',
  'web.docs.pendingBody':
    "Questa sezione è scritta rispetto all'API fornita e viene pubblicata con essa. Preferiremmo mostrarti solo la documentazione per un endpoint che potrebbe cambiare.",
  'web.docs.principles.title': 'Su cosa puoi contare',
  'web.docs.principles.idempotency':
    'Ogni scrittura richiede una chiave di idempotenza. La riproduzione di una richiesta con la stessa chiave restituisce il risultato originale anziché creare un secondo post.',
  'web.docs.principles.errors':
    'Ogni errore porta con sé un codice stabile, una chiave di messaggio e dettagli ripuliti. I codici non cambiano significato tra le versioni.',
  'web.docs.principles.versioning':
    'Le modifiche importanti ottengono una nuova versione e una finestra di deprecazione annunciata. I cambiamenti additivi no.',
  'web.docs.principles.scopes':
    'La lettura, la stesura, la richiesta di approvazione, la pianificazione e la pubblicazione sono ambiti separati. Una credenziale ottiene il set più piccolo che svolge il suo lavoro.',

  /* ---------------------------------------------------------------------- */
  /* Methodology                                                             */
  /* ---------------------------------------------------------------------- */

  'web.methodology.title': 'Metodologia',
  'web.methodology.lede':
    'Come qualcosa su questo sito può essere definito vero e cosa succede quando si scopre che non lo è.',
  'web.methodology.claims.title': 'Affermazioni sulla piattaforma',
  'web.methodology.claims.body':
    "Ogni affermazione su ciò che una piattaforma consente proviene dalla documentazione o dalla pagina delle policy della piattaforma stessa. Registriamo l'URL, la data in cui è stato letto, la versione API a cui si applica e la persona che lo possiede ricontrollandolo. Un reclamo senza queste quattro cose non verrà pubblicato sul sito.",
  'web.methodology.recheck.title': 'Quando ricontrolleremo',
  'web.methodology.recheck.beforeConnector':
    "Prima dell'avvio di un connettore e di nuovo prima che trasporti il traffico dei clienti.",
  'web.methodology.recheck.monthly':
    'Ogni mese per i log delle modifiche della piattaforma e i prezzi dei fornitori.',
  'web.methodology.recheck.quarterly':
    'Ogni trimestre per piani della concorrenza, norme comunitarie e documenti legali.',
  'web.methodology.recheck.immediate':
    'Immediatamente dopo qualsiasi rifiuto della piattaforma, avviso di applicazione della normativa, deprecazione o cambiamento inspiegabile nel comportamento di pubblicazione o di analisi.',
  'web.methodology.comparison.title': 'Confronti',
  'web.methodology.comparison.bestFor':
    'Ogni confronto indica per chi è il prodotto migliore, anche quando non siamo noi.',
  'web.methodology.comparison.dated':
    'Ogni confronto riporta la data della ricerca e collega le principali fonti di prezzi e capacità.',
  'web.methodology.comparison.distinction':
    'Una capacità mancante viene etichettata come qualcosa che non abbiamo creato o come qualcosa che la piattaforma non consente. Queste sono frasi diverse e non le uniamo mai.',
  'web.methodology.comparison.noLogos':
    "Non utilizziamo loghi, citazioni o schermate dell'interfaccia di clienti di altre società e non rivendichiamo un'approvazione che non abbiamo.",
  'web.methodology.benchmarks.title': 'Benchmark e dati di prodotto',
  'web.methodology.benchmarks.body':
    "Qualsiasi numero estratto dall'attività del cliente indica il campione, le esclusioni, la definizione della metrica e la soglia di privacy e viene aggregato in modo che non sia possibile identificare alcuno spazio di lavoro. Se un campione è troppo piccolo per essere pubblicato in modo sicuro, lo diciamo invece di pubblicarlo comunque.",
  'web.methodology.ai.title': "L'intelligenza artificiale nei nostri contenuti",
  'web.methodology.ai.body':
    'Un modello può ricercare, delineare, tradurre, controllare e formattare. Una persona nominata possiede ogni rivendicazione, modifica il pezzo e lo mantiene aggiornato. Non pubblichiamo articoli generati non revisionati e non generiamo screenshot.',
  'web.methodology.corrections.title': 'Correzioni',
  'web.methodology.corrections.body':
    'Quando una pagina è sbagliata, la correggiamo sul posto, aggiungiamo una nota di correzione con la data ed elenchiamo la correzione nel registro delle modifiche. Quando una pagina è troppo obsoleta per essere riparata, la ritiriamo invece di lasciarla attiva.',

  /* ---------------------------------------------------------------------- */
  /* Compare                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.compare.title': 'Confronti',
  'web.compare.lede':
    "Queste pagine sono utili anche se scegli l'altro prodotto. Questo è lo standard che devono soddisfare prima di pubblicare.",
  'web.compare.rules.title': 'Le regole seguono queste pagine',
  'web.compare.rules.bestFor':
    "Ogni pagina indica innanzitutto per chi è più adatto l'altro prodotto, nella propria sezione.",
  'web.compare.rules.dated':
    'Ogni affermazione è datata e collega alla fonte primaria da cui proviene.',
  'web.compare.rules.distinction':
    'Separiamo ciò che non abbiamo costruito da ciò che una piattaforma non consente.',
  'web.compare.rules.axes':
    "Ogni pagina confronta le stesse cose: indennità dell'account, limiti di pubblicazione, team e approvazione, accesso API, MCP e CLI, lingue dei contenuti, analisi, gestione dei video, utilizzo incorporato, self hosting, supporto e costo dell'API della piattaforma che paghi in aggiunta.",
  'web.compare.rules.correction':
    'Ogni pagina riporta un contatto di correzione e una data di revisione.',
  'web.compare.planned.title': 'Pagine pianificate',
  'web.compare.planned.body':
    'Questi verranno pubblicati una volta completato il controllo attuale dei prezzi e della capacità. Un confronto scritto a memoria è peggio di nessun confronto.',
  'web.compare.empty': 'Nessun confronto è stato ancora pubblicato',
  'web.compare.emptyBody':
    "Ogni pagina necessita di un nuovo controllo dei fatti rispetto ai prezzi e alla documentazione dell'altro prodotto. Ne pubblicano uno alla volta man mano che il lavoro finisce.",

  /* ---------------------------------------------------------------------- */
  /* Tool radar                                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.title': 'Radar degli strumenti creativi',
  'web.toolRadar.lede':
    'Relay non genera immagini o video. Ti aiuta a decidere quale strumento specialistico utilizzare e a portare il bene finito con il record dei diritti intatto.',
  'web.toolRadar.record.title': 'Ciò che ogni disco deve portare con sé',
  'web.toolRadar.record.url': "L'URL ufficiale e l'organizzazione proprietaria del prodotto.",
  'web.toolRadar.record.useCase':
    'Il flusso di lavoro per il quale viene consigliato e i suoi limiti documentati.',
  'web.toolRadar.record.pricing':
    'Il suo modello di prezzo e la data in cui lo abbiamo controllato.',
  'web.toolRadar.record.rights':
    'I suoi diritti, licenze, conservazione e avvertenze sulla privacy, secondo le parole del venditore.',
  'web.toolRadar.record.disclosure':
    'Se abbiamo qualche rapporto commerciale con esso. La classifica non dipende mai da questo.',
  'web.toolRadar.record.verified':
    "Un'ultima data verificata e un avviso visibile una volta che il record ha superato la finestra di revisione.",
  'web.toolRadar.category.title': 'Categorie',
  'web.toolRadar.empty': 'Il catalogo non è ancora popolato',
  'web.toolRadar.emptyBody':
    'I record vengono scritti da una persona in base alla documentazione del fornitore. Non riempiremo questa pagina con collegamenti generati da modelli che sembrino plausibili.',
  'web.toolRadar.noAffiliateYet':
    'Non esiste alcuna relazione di affiliazione con nessuno degli strumenti elencati qui oggi.',

  /* ---------------------------------------------------------------------- */
  /* Opportunities                                                           */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.title': 'Opportunità di promozione',
  'web.opportunities.lede':
    'Un catalogo curato di luoghi in cui un prodotto può essere lanciato, elencato, discusso o contribuito, con le regole che ciascuna destinazione si prefigge.',
  'web.opportunities.rules.title': 'Come si comporta questo catalogo',
  'web.opportunities.rules.curated':
    'Ogni voce è un record esaminato con un URL ufficiale, le attuali regole di invio e una data di verifica. Nulla viene scoperto da un modello e presentato come verificato.',
  'web.opportunities.rules.noAutomation':
    'Relay non invia mai un modulo, non cancella un contatto, non invia e-mail in blocco o post a una community per te. Tu fai la presentazione.',
  'web.opportunities.rules.noGuarantee':
    'Un elenco non è una promessa di posizionamento e un collegamento non è una strategia di crescita. Mostriamo i requisiti di idoneità, pubblico, impegno, costo e divulgazione in modo che tu possa decidere se vale la pena dedicare il tuo pomeriggio.',
  'web.opportunities.rules.stale':
    'Un record che ha superato la data di revisione viene etichettato o nascosto anziché mostrato come corrente.',
  'web.opportunities.category.title': 'Categorie',
  'web.opportunities.empty': 'Il catalogo non è ancora popolato',
  'web.opportunities.emptyBody':
    'Ogni regola di destinazione deve essere letta e registrata da una persona prima che possa essere raccomandata. Le categorie sono elencate sopra in modo da poter vedere la forma di ciò che sta arrivando.',

  /* ---------------------------------------------------------------------- */
  /* Legal, shared                                                           */
  /* ---------------------------------------------------------------------- */

  'web.legal.title': 'Legal and policies',
  'web.legal.lede':
    'The documents that govern using Relay. Where the wording has to be drafted by a lawyer for a specific company and jurisdiction, the page says so instead of pretending.',
  'web.legal.counselPending.title': 'Pending review by counsel before launch',
  'web.legal.counselPending.body':
    'The substance on this page reflects how the product actually behaves and is accurate today. The binding legal wording, the governing jurisdiction and the liability terms are being drafted with qualified counsel and will replace this text before Relay is generally available. This page is not legal advice and it is not a contract yet.',
  'web.legal.contact.title': 'Contact',
  'web.legal.contact.privacy': 'privacy@relay.example',
  'web.legal.contact.legal': 'legal@relay.example',
  'web.legal.contact.security': 'security@relay.example',
  'web.legal.contact.abuse': 'abuse@relay.example',
  'web.legal.contact.copyright': 'copyright@relay.example',
  'web.legal.contact.affiliates': 'affiliates@relay.example',
  'web.legal.contact.accessibility': 'accessibility@relay.example',
  'web.legal.entity.pending':
    'The contracting entity, its registered address and the governing jurisdiction are an open decision and will be named here before launch.',
  'web.legal.index.updated': 'Updated {date}',

  /* Terms ---------------------------------------------------------------- */
  'web.legal.terms.title': 'Terms of Service',
  'web.legal.terms.summary':
    'What Relay agrees to provide, what you agree to do, and what happens when either side stops.',
  'web.legal.terms.service.title': 'What the service is',
  'web.legal.terms.service.body':
    'Relay is a hosted service for creating, approving, scheduling and publishing content to social platforms through those platforms official APIs, together with the receipts, analytics and audit records that result. It is not a social platform and it does not control what any platform does with a post once it is published.',
  'web.legal.terms.content.title': 'Your content stays yours',
  'web.legal.terms.content.body':
    'You keep ownership of everything you upload, write or import. You grant Relay only the licence needed to store it, process it, adapt it into the variants you ask for, and transmit it to the accounts you selected. That licence ends when you delete the content, apart from records we are required to keep.',
  'web.legal.terms.warranties.title': 'What you are confirming when you publish',
  'web.legal.terms.warranties.body':
    'That you are authorized to publish to the accounts you connected, that you hold the rights to the content and the media, that you have the consent required for any person appearing in it, and that publishing it does not breach the destination platform rules.',
  'web.legal.terms.platforms.title': 'Platform dependence',
  'web.legal.terms.platforms.body':
    'Connectors depend on third party APIs that those companies control. A platform can change its API, restrict a permission, revoke an application or close access with little notice. Relay cannot guarantee that any connector remains available, and a connector becoming unavailable is not a failure of this agreement. We will tell you on the status page and the changelog when it happens.',
  'web.legal.terms.ai.title': 'AI output',
  'web.legal.terms.ai.body':
    'Text assistance, translation, transcreation and planning features produce suggestions. They can be wrong, out of date or unsuitable. You are responsible for reviewing anything you publish. Relay does not generate images or video.',
  'web.legal.terms.billing.title': 'Payment',
  'web.legal.terms.billing.body':
    'Polar is the merchant of record. Polar handles checkout, taxes, invoices and refunds. Subscriptions renew automatically at the interval you chose until you cancel. Platform usage that a provider charges per operation is billed separately at cost and is disclosed before the action that incurs it.',
  'web.legal.terms.suspension.title': 'Suspension and scheduled posts',
  'web.legal.terms.suspension.body':
    'If a subscription lapses or a workspace is suspended, scheduled posts stop rather than publishing silently, and the workspace becomes read only. Your content, receipts and connections are preserved and remain exportable.',
  'web.legal.terms.aup.title': 'Acceptable use',
  'web.legal.terms.aup.body':
    'The Acceptable Use Policy forms part of these terms. We may rate limit, pause, require verification, revoke agent or API access, suspend or terminate for a breach of it, and you may appeal any of those decisions to a person.',
  'web.legal.terms.termination.title': 'Ending the agreement',
  'web.legal.terms.termination.body':
    'You can cancel at any time from Settings. After termination you keep an export window before deletion, and deletion is never made conditional on paying an outstanding invoice, other than the billing records we are legally required to retain.',
  'web.legal.terms.developer.title': 'API, MCP and service accounts',
  'web.legal.terms.developer.body':
    'Programmatic access is governed additionally by the API and MCP Terms, including rate limits, scope requirements and the rule that a service account never inherits a human full permissions.',

  /* Privacy -------------------------------------------------------------- */
  'web.legal.privacy.title': 'Privacy Policy',
  'web.legal.privacy.summary':
    'What Relay collects, why, who processes it, how long it is kept, and how to get it out or have it deleted.',
  'web.legal.privacy.collect.title': 'What we hold',
  'web.legal.privacy.collect.account':
    'Account and profile: your name, email, workspace membership and role.',
  'web.legal.privacy.collect.connections':
    'Social connections: the platform account identifier, its display name, its type, the granted scopes and an encrypted access token. Tokens are stored with envelope encryption and are never written to a log.',
  'web.legal.privacy.collect.content':
    'Content and media you create, upload or import, including the rights and provenance you record with it.',
  'web.legal.privacy.collect.schedules':
    'Schedules, approval decisions, publication receipts and audit events.',
  'web.legal.privacy.collect.analytics':
    'Metrics retrieved from platforms about posts you published through Relay.',
  'web.legal.privacy.collect.billing':
    'Billing references held by Polar. Relay does not store your card details.',
  'web.legal.privacy.collect.technical':
    'Device and log data needed to operate and secure the service, redacted by default.',
  'web.legal.privacy.collect.agent':
    'Agent and API activity: which credential took which action, with an input hash rather than the input.',
  'web.legal.privacy.minimization.title': 'What we deliberately do not do',
  'web.legal.privacy.minimization.scopes':
    'We request only the platform scopes the features you have enabled actually need.',
  'web.legal.privacy.minimization.history':
    'We do not ingest your entire social history in order to draw a chart.',
  'web.legal.privacy.minimization.logs':
    'Post content is redacted from general logs and from support tooling.',
  'web.legal.privacy.minimization.training':
    'Your content is not used to train our models or anyone models by default.',
  'web.legal.privacy.subprocessors.title': 'Who else processes it',
  'web.legal.privacy.subprocessors.body':
    'The current subprocessor list is published separately and changes are announced there before they take effect.',
  'web.legal.privacy.retention.title': 'How long we keep it',
  'web.legal.privacy.rights.title': 'Your controls',
  'web.legal.privacy.rights.export':
    'Download your content, receipts and analytics as JSON and CSV with a media archive.',
  'web.legal.privacy.rights.revoke':
    'Disconnect one social account without deleting the workspace. Tokens are revoked at the platform and deleted here.',
  'web.legal.privacy.rights.delete':
    'Delete a project, a piece of content, a media file or the entire account.',
  'web.legal.privacy.rights.cancelJobs':
    'Cancel scheduled jobs before deleting anything, so nothing publishes after you leave.',
  'web.legal.privacy.rights.sessions':
    'See and revoke active sessions, API keys, agent credentials, webhooks and platform permissions.',
  'web.legal.privacy.rights.consent':
    'Consent preferences are versioned and auditable, so you can see what you agreed to and when.',
  'web.legal.privacy.deletion.title': 'Deleting data held at a platform',
  'web.legal.privacy.deletion.body':
    'Disconnecting an account in Relay revokes the token at the platform and deletes the credential here. Content already published on a platform is governed by that platform and has to be deleted there. Where a platform requires deletion of derived data within a fixed period after revocation, we meet that period. For Google and YouTube data that period is currently 30 days.',
  'web.legal.privacy.transfers.title': 'International transfers',
  'web.legal.privacy.transfers.body':
    'Hosting regions and the transfer mechanism are being finalized with counsel and will be named here, together with the safeguards that apply, before launch.',

  /* Acceptable use ------------------------------------------------------- */
  'web.legal.aup.title': 'Acceptable Use Policy',
  'web.legal.aup.summary':
    'Relay helps you publish content you are authorized to publish. It is not built to help anyone evade a platform limit, fake an endorsement or send unwanted messages.',
  'web.legal.aup.prohibited.title': 'Not permitted',
  'web.legal.aup.prohibited.spam':
    'Spam, unsolicited bulk messages, replies or mentions, engagement bait, and repeated unwanted content.',
  'web.legal.aup.prohibited.linkSchemes':
    'Automated directory or form submissions, bulk outreach, link schemes, paid or reciprocal links intended to manipulate search ranking, and community promotion that breaks the destination rules.',
  'web.legal.aup.prohibited.inauthentic':
    'Coordinated inauthentic behaviour, multi account amplification presented as independent, engagement pods, fake reviews, ratings or install counts, automated likes and follows, and trend manipulation.',
  'web.legal.aup.prohibited.duplicate':
    'Publishing duplicate or substantially similar content across many accounts where the platform prohibits it.',
  'web.legal.aup.prohibited.impersonation':
    'Impersonation, phishing, fraud, scams, malware, credential theft and deceptive installation.',
  'web.legal.aup.prohibited.harm':
    'Harassment, doxxing, sexual exploitation, non consensual intimate media, hate or violent extremist content, and illegal goods or services.',
  'web.legal.aup.prohibited.political':
    'Political manipulation and automated political persuasion where it is prohibited. Political content, where permitted at all, is subject to enhanced review.',
  'web.legal.aup.prohibited.rights':
    'Copyright, trademark and publicity violations, unlicensed music or media, synthetic likenesses without rights and disclosure, and undisclosed paid endorsements.',
  'web.legal.aup.prohibited.circumvention':
    'Bypassing official APIs, rate limits, audits, account controls or platform enforcement using browser automation, cookie replay or scraping.',
  'web.legal.aup.prohibited.restrictedStores':
    'Automated submission to app stores, the Chrome Web Store or other restricted submission systems through unauthorized interfaces.',
  'web.legal.aup.prohibited.banEvasion':
    'Evading an account ban or running coordinated account farms.',
  'web.legal.aup.prohibited.training':
    'Training or evaluating models on third party or other customers content without authorization.',
  'web.legal.aup.controls.title': 'The controls that enforce this',
  'web.legal.aup.controls.duplicate':
    'Exact and near duplicate fingerprinting by workspace, account, platform and time window, with a cross account similarity check.',
  'web.legal.aup.controls.cadence':
    'Account level and workspace level cadence budgets, plus mention, hashtag, URL and domain volume checks.',
  'web.legal.aup.controls.escalation':
    'New account, new domain and bulk action escalation, and a maximum number of repetitions for any repeating campaign.',
  'web.legal.aup.controls.linkSafety':
    'Destination scanning on short links, with emergency disable and an abuse report channel.',
  'web.legal.aup.controls.workspaceCaps':
    'A workspace owner can set stricter limits than the plan allows. Risk controls cannot be loosened by paying more.',
  'web.legal.aup.enforcement.title': 'Enforcement and appeal',
  'web.legal.aup.enforcement.body':
    'Where we can, we block before the external action rather than after it, and we record the reason, the rule version and the appeal path. Repeated or serious behaviour goes to a trust review by a person. You will be told what happened, without a level of detail that would help someone evade the check. Every decision can be appealed and reversed.',
  'web.legal.aup.report.title': 'Reporting abuse',
  'web.legal.aup.report.body':
    'If content published through Relay breaks these rules, tell us. Include the post URL and what is wrong with it.',

  /* AI policy ------------------------------------------------------------ */
  'web.legal.ai.title': 'AI Use and Generated Content Policy',
  'web.legal.ai.summary':
    'Which features use a model, what is sent, what is kept, what you stay responsible for, and why Relay does not generate media.',
  'web.legal.ai.features.title': 'Where a model is used',
  'web.legal.ai.features.text':
    'Text assistance in the composer: rewriting, shortening and adapting for a platform.',
  'web.legal.ai.features.translation':
    'Translation and transcreation into your content languages, against your project glossary.',
  'web.legal.ai.features.feedback': 'Content feedback and the four week growth plan.',
  'web.legal.ai.features.provider':
    'These features call DeepSeek. The model identifiers currently in use are published in the documentation and any change is listed on the changelog.',
  'web.legal.ai.data.title': 'What is sent, and what happens to it',
  'web.legal.ai.data.sent':
    'Only the text you asked us to work on, the instruction, and the project context you chose to attach. Credentials, tokens and other customers content are never in a model context.',
  'web.legal.ai.data.training':
    'Your content is not used to train our models. We configure providers so it is not used to train theirs.',
  'web.legal.ai.data.optOut':
    'Optional AI features can be turned off per workspace. Publishing, scheduling, approvals and analytics do not depend on them.',
  'web.legal.ai.responsibility.title': 'What stays yours',
  'web.legal.ai.responsibility.body':
    'A model can be confidently wrong. You are responsible for checking facts, claims, names, numbers and tone before you publish, and for any disclosure a platform requires. No AI feature guarantees reach, engagement or ranking, and none is offered as one.',
  'web.legal.ai.disclosure.title': 'Disclosure and provenance',
  'web.legal.ai.disclosure.body':
    'Relay records whether content was AI assisted in its internal history, reminds you where a platform requires an altered or synthetic media disclosure, and stores the provenance you provide with an imported asset. Where a platform offers a disclosure field, Relay sets it from your declaration rather than guessing.',
  'web.legal.ai.blocks.title': 'What the AI features refuse',
  'web.legal.ai.blocks.impersonation': 'Impersonating a real person or a public figure.',
  'web.legal.ai.blocks.ncii': 'Non consensual intimate imagery, in any form.',
  'web.legal.ai.blocks.fabrication':
    'Fabricated testimonials, invented customers and invented performance figures.',
  'web.legal.ai.blocks.unverified':
    'Presenting a model generated URL as a verified opportunity. Opportunity and tool recommendations come only from the curated catalog.',
  'web.legal.ai.noMedia.title': 'Why there is no image or video generation',
  'web.legal.ai.noMedia.body':
    'Relay has not collected the verified visual system, product detail, asset rights, likeness permissions and campaign context that brand ready output would require, and in app generation would need its own consent, provenance, safety evaluation and cost controls. Media model capability, licensing, pricing and retention also change quickly, which is why our tool recommendations carry dates. You keep creative control by choosing a specialist tool and importing the approved asset. Relay handles adaptation, approval, publishing and measurement.',
  'web.legal.ai.noMedia.caveat':
    'A tool appearing in our radar is not a statement that its output is safe or rights cleared. Its documented caveats are shown with it and your normal rights declaration still applies.',

  /* Cookies -------------------------------------------------------------- */
  'web.legal.cookies.title': 'Cookie Policy',
  'web.legal.cookies.summary':
    'What is stored in your browser, why, and what happens if you refuse the optional parts.',
  'web.legal.cookies.essential.title': 'Strictly necessary',
  'web.legal.cookies.essential.body':
    'A session cookie that keeps you signed in, a cross site request forgery token, and a preference cookie holding your theme and time zone choice. These cannot be turned off without breaking sign in, and they are not used for advertising.',
  'web.legal.cookies.analytics.title': 'Product analytics',
  'web.legal.cookies.analytics.body':
    'Aggregate, first party measurement of which screens are used, so we can fix the ones that are not working. It is optional, it is off until you allow it, and refusing it changes nothing about the product.',
  'web.legal.cookies.marketing.title': 'Advertising',
  'web.legal.cookies.marketing.body':
    'We do not run advertising cookies, we do not embed third party advertising pixels, and we do not sell or share personal information for cross context behavioural advertising.',
  'web.legal.cookies.shortLinks.title': 'Tracked short links',
  'web.legal.cookies.shortLinks.body':
    'A short link click creates first party analytics for the workspace that owns the link. Location and device data are minimized, bot traffic is classified out, IP addresses are truncated or discarded promptly, and a workspace can turn tracking off or shorten retention. Nothing sensitive is ever put in a slug or a query parameter.',
  'web.legal.cookies.control.title': 'Changing your mind',
  'web.legal.cookies.control.body':
    'The consent choice is stored with a version and can be changed at any time in Settings, under data controls. Withdrawing consent takes effect immediately.',

  /* Subprocessors -------------------------------------------------------- */
  'web.legal.subprocessors.title': 'Subprocessors',
  'web.legal.subprocessors.summary':
    'The companies that process customer data on our behalf, what they do, and where.',
  'web.legal.subprocessors.notice.title': 'Change notice',
  'web.legal.subprocessors.notice.body':
    'A new subprocessor is published here before it starts processing customer data, with at least 30 days notice for a change that materially affects processing. Customers with a data processing addendum can object during that window.',
  'web.legal.subprocessors.column.name': 'Subprocessor',
  'web.legal.subprocessors.column.purpose': 'What it processes for us',
  'web.legal.subprocessors.column.data': 'Data categories',
  'web.legal.subprocessors.column.region': 'Processing region',
  'web.legal.subprocessors.platforms.title': 'Social platforms are not subprocessors',
  'web.legal.subprocessors.platforms.body':
    'When you publish, Relay transmits your content to the platform account you selected, at your instruction. Those platforms are independent controllers of what they receive and their own terms govern it.',

  /* Refunds -------------------------------------------------------------- */
  'web.legal.refunds.title': 'Refund and Cancellation Policy',
  'web.legal.refunds.summary':
    'How to cancel, what happens to your data, and when you get money back.',
  'web.legal.refunds.cancel.title': 'Cancelling',
  'web.legal.refunds.cancel.body':
    'Cancel from Settings without contacting support. Cancelling during the seven day trial means no charge is attempted and the cancellation screen confirms that in writing. Cancelling after the trial keeps your access until the end of the period you already paid for.',
  'web.legal.refunds.refund.title': 'Refunds',
  'web.legal.refunds.refund.body':
    'If the service did not work as described, contact support and we will refund the affected period. Mandatory consumer withdrawal rights, including the statutory cooling off period where it applies to you, are honoured in full and are not limited by anything on this page. Refunds are issued by Polar, our merchant of record, to the original payment method.',
  'web.legal.refunds.usage.title': 'Platform usage charges',
  'web.legal.refunds.usage.body':
    'Usage passed through from a platform, such as X per operation pricing, covers a cost we already paid on your behalf for an action you confirmed. It is refundable when the charge was our error, for example a duplicate dispatch caused by a defect on our side.',
  'web.legal.refunds.data.title': 'What happens to your data',
  'web.legal.refunds.data.body':
    'Nothing is deleted at cancellation. The workspace becomes read only, scheduled posts stop rather than publishing, and you keep an export window before deletion. Deletion is never made conditional on paying an invoice, apart from the billing records we must keep by law.',
  'web.legal.refunds.failed.title': 'A failed payment',
  'web.legal.refunds.failed.body':
    'Polar retries and emails you. During the grace period publishing continues. After it, the workspace becomes read only and scheduled posts stop. Nothing is disconnected and nothing is deleted.',

  /* DMCA ----------------------------------------------------------------- */
  'web.legal.dmca.title': 'Copyright and Takedown',
  'web.legal.dmca.summary':
    'How to report content hosted by Relay that infringes your rights, and how to respond if yours was removed.',
  'web.legal.dmca.scope.title': 'What we can act on',
  'web.legal.dmca.scope.body':
    'Relay can remove material stored in our systems, such as a media file or a draft. Content already published on a social platform lives on that platform and has to be reported to it, because we cannot delete a post we do not host. We will tell you which of the two applies to your report.',
  'web.legal.dmca.notice.title': 'Sending a notice',
  'web.legal.dmca.notice.identify':
    'Identify the copyrighted work and the material you say infringes it, with a URL we can reach.',
  'web.legal.dmca.notice.contact': 'Give your name, address, telephone number and email.',
  'web.legal.dmca.notice.goodFaith':
    'State that you believe in good faith that the use is not authorized by the rights holder, its agent or the law.',
  'web.legal.dmca.notice.accuracy':
    'State that the information is accurate and, under penalty of perjury, that you are authorized to act for the rights holder.',
  'web.legal.dmca.notice.signature': 'Sign it, physically or electronically.',
  'web.legal.dmca.counter.title': 'Counter notice',
  'web.legal.dmca.counter.body':
    'If your material was removed and you believe that was a mistake or a misidentification, you can send a counter notice with the same contact details, identifying the material and where it was, and consenting to the jurisdiction that will be named here. We will forward it to the person who complained.',
  'web.legal.dmca.repeat.title': 'Repeat infringers',
  'web.legal.dmca.repeat.body':
    'Accounts that repeatedly infringe are suspended and then terminated. Bad faith notices, used to remove a competitor content, are also grounds for termination.',

  /* Security ------------------------------------------------------------- */
  'web.legal.security.title': 'Security and Responsible Disclosure',
  'web.legal.security.summary':
    'How Relay protects the credentials you trust it with, and how to report a problem you find.',
  'web.legal.security.tokens.title': 'Social credentials',
  'web.legal.security.tokens.body':
    'Platform tokens are encrypted with envelope encryption under a managed key, rotated, stored apart from content and billing data, and redacted from every log. A token is never sent to a browser, never placed in a model context and never included in an error message.',
  'web.legal.security.tenancy.title': 'Tenancy',
  'web.legal.security.tenancy.body':
    'Isolation is enforced three times: at the edge when you authenticate, in the application service when it authorizes the action, and in PostgreSQL through row level security. Being signed in is never treated as permission. Cross workspace access attempts are tested in continuous integration and must fail.',
  'web.legal.security.publishing.title': 'Publishing integrity',
  'web.legal.security.publishing.body':
    'Every external write carries an idempotency key and produces an immutable receipt. Duplicate publication is treated as a defect with a target of zero, and the test suite includes worker crashes after platform acceptance, platform timeouts, duplicated webhooks, revoked tokens at dispatch and daylight saving transitions.',
  'web.legal.security.program.title': 'The programme',
  'web.legal.security.program.threatModel':
    'A written threat model covering OAuth, tenancy, publishing, MCP, media, billing and analytics.',
  'web.legal.security.program.pentest':
    'An independent security review focused on token leakage and cross tenant access before paid launch.',
  'web.legal.security.program.access':
    'Least privilege production access, multi factor authentication, and a device and session inventory.',
  'web.legal.security.program.supplyChain':
    'Dependency and container scanning with patch service levels, and signed build provenance where practical.',
  'web.legal.security.program.logging':
    'Centralized logging that redacts by default, with anomaly alerting.',
  'web.legal.security.program.backups':
    'Encrypted backups with tested restoration and a documented rotation.',
  'web.legal.security.disclosure.title': 'Reporting a vulnerability',
  'web.legal.security.disclosure.body':
    'Email us with enough detail to reproduce the issue. We acknowledge within two business days, keep you updated, and credit you when you want the credit. Please do not access another customer data, degrade the service, or run automated scanning against production. Test against your own workspace.',
  'web.legal.security.disclosure.safeHarbor':
    'We will not pursue legal action for good faith research that follows this policy. The exact safe harbour wording is with counsel.',
  'web.legal.security.incidents.title': 'If something goes wrong',
  'web.legal.security.incidents.body':
    'We have an incident response plan with named decision makers, severity levels, evidence preservation and notification duties. Incidents that affected publishing are published on the status page with a timeline and what changed afterwards, including the ones we caused.',

  /* Accessibility -------------------------------------------------------- */
  'web.legal.accessibility.title': 'Accessibility Statement',
  'web.legal.accessibility.summary':
    'The standard Relay is built to, what we have verified, what we know is not right yet, and how to tell us.',
  'web.legal.accessibility.standard.title': 'The standard',
  'web.legal.accessibility.standard.body':
    'Relay targets WCAG 2.2 level AA across the product and this site. Accessibility is a merge requirement here, not a later ticket, and a screen that fails it does not ship.',
  'web.legal.accessibility.measures.title': 'What that means in practice',
  'web.legal.accessibility.measures.keyboard':
    'Everything is operable from the keyboard, with a visible focus ring and a logical focus order. There is no drag only interaction anywhere.',
  'web.legal.accessibility.measures.contrast':
    'Every colour pair in the design system is asserted at 4.5 to 1 for body text and 3 to 1 for large text and control edges, in both the light and the dark theme, by an automated test.',
  'web.legal.accessibility.measures.colour':
    'Status, capability and freshness always carry an icon and a word as well as a colour.',
  'web.legal.accessibility.measures.announcements':
    'Save state, validation changes, upload progress, schedule confirmation and publish results are announced to screen readers.',
  'web.legal.accessibility.measures.zoom':
    'Layouts work at 320 pixels wide and at 200 percent zoom without horizontal page scrolling. Wide tables scroll inside their own container.',
  'web.legal.accessibility.measures.motion':
    'A reduced motion preference removes every non essential transition.',
  'web.legal.accessibility.measures.targets':
    'Touch targets are at least 44 pixels on a coarse pointer.',
  'web.legal.accessibility.known.title': 'Known gaps',
  'web.legal.accessibility.known.body':
    'We will list specific known issues here with a fix date as they are found, rather than claiming full conformance. An independent audit is planned before general availability and its findings will be published here.',
  'web.legal.accessibility.feedback.title': 'Tell us about a barrier',
  'web.legal.accessibility.feedback.body':
    'Describe what you were trying to do, the page, and the assistive technology you use. We reply within five business days and will offer another way to complete the task while we fix it.',

  /* API and MCP terms ---------------------------------------------------- */
  'web.legal.apiTerms.title': 'API and MCP Terms',
  'web.legal.apiTerms.summary':
    'Additional terms for programmatic access, including agent credentials, rate limits and what a service account may never do.',
  'web.legal.apiTerms.credentials.title': 'Credentials',
  'web.legal.apiTerms.credentials.body':
    'An API key or agent credential identifies a scoped service account. It is not a copy of a person account and it never inherits their full permissions. Keys are shown once, are revocable at any time, and must not be embedded in a client application or a public repository.',
  'web.legal.apiTerms.scopes.title': 'Scopes',
  'web.legal.apiTerms.scopes.body':
    'Reading, drafting, requesting approval, scheduling, publishing immediately, cancelling, analytics and billing are separate scopes. Request the smallest set the integration needs. Immediate publishing and other high risk actions require explicit human confirmation by default and that default is set per workspace, not per credential.',
  'web.legal.apiTerms.limits.title': 'Rate limits and idempotency',
  'web.legal.apiTerms.limits.body':
    'Every write requires an idempotency key. Replaying a request with the same key returns the original result. Rate limits are published in the documentation and are returned in the response headers, and a limit response tells you when it resets.',
  'web.legal.apiTerms.agents.title': 'Agent behaviour',
  'web.legal.apiTerms.agents.body':
    'A single call may not silently publish to every connected account. Bulk actions, a new domain, a new account, a sensitive category, a paid endorsement, a privacy change or content altered after approval always escalate for a human decision. Every agent and every workspace has a kill switch.',
  'web.legal.apiTerms.prohibited.title': 'Not permitted through the API',
  'web.legal.apiTerms.prohibited.body':
    'Reselling access without a written agreement, using Relay as a relay for content you are not authorized to publish, circumventing approval policy, and any use that breaks the Acceptable Use Policy. Programmatic access is subject to the same anti spam controls as the web app.',
  'web.legal.apiTerms.changes.title': 'Change policy',
  'web.legal.apiTerms.changes.body':
    'Additive changes ship without notice. Breaking changes get a new version, an announced deprecation window and a migration note on the changelog. Error codes do not change meaning within a version.',

  /* Affiliate terms ------------------------------------------------------ */
  'web.legal.affiliate.title': 'Affiliate and Creator Terms',
  'web.legal.affiliate.summary':
    'What we pay, what we require, and what will get an account closed.',
  'web.legal.affiliate.commission.title': 'Commission',
  'web.legal.affiliate.commission.body':
    'Recurring commission on referred subscriptions for up to twelve months, subject to fraud review. Commission is held until the refund window closes and is reversed if the customer refunds. Payouts run through Polar.',
  'web.legal.affiliate.disclosure.title': 'Disclosure is not optional',
  'web.legal.affiliate.disclosure.body':
    'Every place you share a referral link must disclose the commercial relationship clearly and close to the link, in the language of the audience. This applies to videos, posts, newsletters, articles and community replies alike.',
  'web.legal.affiliate.honesty.title': 'Paid for work, not for praise',
  'web.legal.affiliate.honesty.body':
    'A sponsored tutorial contract never requires a positive conclusion. You may publish criticism and still be paid. We do not buy reviews, votes, ratings or installs, and we do not offer an incentive conditional on a positive review.',
  'web.legal.affiliate.prohibited.title': 'Grounds for closing an affiliate account',
  'web.legal.affiliate.prohibited.brandBidding':
    'Bidding on our brand terms in paid search, or running ads that imply you are us.',
  'web.legal.affiliate.prohibited.spam':
    'Unsolicited email, mass community posting, or link dropping in threads that did not ask.',
  'web.legal.affiliate.prohibited.cookieStuffing':
    'Cookie stuffing, forced clicks, self referral and coupon squatting.',
  'web.legal.affiliate.prohibited.claims':
    'Inventing customer results, fabricating a testimonial, or claiming Relay does something it does not, including anything about AI media generation.',
  'web.legal.affiliate.prohibited.trademark':
    'Registering a domain, handle or app listing that uses our name in a way that suggests you are the company.',

  /* ---------------------------------------------------------------------- */
  /* Platform names and per platform facts                                   */
  /* ---------------------------------------------------------------------- */

  'web.marketing.provider.x.label': 'X',
  'web.marketing.provider.linkedin.label': 'LinkedIn',
  'web.marketing.provider.instagram.label': 'Instagram',
  'web.marketing.provider.facebook.label': 'Facebook',
  'web.marketing.provider.youtube.label': 'YouTube',
  'web.marketing.provider.tiktok.label': 'TikTok',
  'web.marketing.provider.threads.label': 'Threads',
  'web.marketing.provider.bluesky.label': 'Bluesky',

  'web.marketing.provider.x.accountTypes': 'Un account X personale o aziendale che controlli.',
  'web.marketing.provider.x.restriction':
    "La pubblicazione automatizzata richiede il consenso esplicito del titolare dell'account, che Relay registra. Non sono consentiti post duplicati o sostanzialmente simili tra più account e non vengono create risposte automatiche non richieste.",
  'web.marketing.provider.x.cost':
    'X addebita per ogni operazione API e addebita di più per un post contenente un URL. Relay stima il costo prima della conferma e lo trasferisce senza alcun ricarico.',

  'web.marketing.provider.linkedin.accountTypes':
    "Un profilo membro o una pagina dell'organizzazione in cui ricopri il ruolo corretto.",
  'web.marketing.provider.linkedin.restriction':
    "La pubblicazione per conto di un'organizzazione richiede un prodotto di gestione della comunità approvato e un'identità aziendale verificata. L'analisi dei post dei membri dipende da un'autorizzazione di lettura che LinkedIn ha chiuso a nuove applicazioni, quindi Relay non la offrirà.",
  'web.marketing.provider.linkedin.cost':
    "Nessun costo per operazione. Si applicano limiti giornalieri per l'applicazione e per i membri.",

  'web.marketing.provider.instagram.accountTypes':
    'Un account Instagram professionale, aziendale o creatore.',
  'web.marketing.provider.instagram.restriction':
    'La pubblicazione di contenuti Instagram è disponibile solo per gli account professionali. Non è possibile pubblicare un account consumatore con nessuna applicazione, inclusa questa. La pubblicazione utilizza il contenitore ufficiale e la sequenza di pubblicazione e Relay conferma lo stato finale anziché segnalare il caricamento come riuscito.',
  'web.marketing.provider.instagram.cost':
    'Nessun costo per operazione. Sono necessarie la revisione della meta app e la verifica aziendale.',

  'web.marketing.provider.facebook.accountTypes': 'Una pagina Facebook che amministri.',
  'web.marketing.provider.facebook.restriction':
    "La destinazione della pubblicazione è una pagina. L'automazione di un profilo personale non è offerta dall'API e Relay non tenta di farlo.",
  'web.marketing.provider.facebook.cost':
    'Nessun costo per operazione. Sono necessarie la revisione della meta app e la verifica aziendale.',

  'web.marketing.provider.youtube.accountTypes':
    'Un canale YouTube collegato tramite il tuo account Google.',
  'web.marketing.provider.youtube.restriction':
    "Un progetto che non ha superato il controllo di conformità dell'API di Google può essere caricato solo come privato. Relay non descriverà il caricamento pubblico come disponibile finché il controllo non sarà superato e la schermata di connessione indicherà in quale stato arriveranno i tuoi caricamenti.",
  'web.marketing.provider.youtube.cost':
    'Nessun costo per operazione. Si applica una quota giornaliera e non può essere condivisa tra progetti.',

  'web.marketing.provider.tiktok.accountTypes': 'Un account TikTok con autorizzazione Direct Post.',
  'web.marketing.provider.tiktok.restriction':
    "Fino al superamento del controllo dell'API di pubblicazione dei contenuti, i post sono privati e si applicano limiti per account. Al momento della pubblicazione Relay recupera le informazioni attuali del creatore, mostra le opzioni di privacy disponibili senza preselezionarne una e richiede le impostazioni di commento, duetto e punto e la dichiarazione del contenuto commerciale.",
  'web.marketing.provider.tiktok.cost':
    'Nessun costo per operazione. La modalità non controllata applica limiti di pubblicazione giornalieri.',

  'web.marketing.provider.threads.accountTypes':
    'Un profilo Threads collegato a un account Instagram professionale.',
  'web.marketing.provider.threads.restriction':
    'La pubblicazione segue il contenitore Meta e la sequenza di pubblicazione. Le funzionalità vengono verificate rispetto alla raccolta ufficiale prima che qualsiasi cosa qui venga definita supportata.',
  'web.marketing.provider.threads.cost': 'Nessun costo per operazione.',

  'web.marketing.provider.bluesky.accountTypes':
    'Un account Bluesky su qualsiasi provider di hosting.',
  'web.marketing.provider.bluesky.restriction':
    'Un protocollo aperto senza fase di revisione della domanda. I limiti di tariffa e i limiti di dimensione dei record continuano a essere applicati e vengono applicati prima della spedizione.',
  'web.marketing.provider.bluesky.cost': 'Nessun costo per operazione.',
  'web.marketing.provider.mastodon.label': 'Mastodon',
  'web.marketing.provider.mastodon.accountTypes': 'Un account Mastodon su qualsiasi istanza.',
  'web.marketing.provider.mastodon.restriction':
    'Un protocollo aperto senza revisione dell’app. Il limite di caratteri è fissato da ogni istanza e i suoi limiti di frequenza sono rispettati.',
  'web.marketing.provider.mastodon.cost': 'Nessun costo per operazione.',
  'web.marketing.provider.telegram.label': 'Telegram',
  'web.marketing.provider.telegram.accountTypes':
    'Un bot Telegram che controlli, che pubblica in un canale o gruppo.',
  'web.marketing.provider.telegram.restriction':
    'Un bot pubblica solo dove è stato aggiunto. Il token è una credenziale dell’applicazione e la chat di destinazione si sceglie per connessione.',
  'web.marketing.provider.telegram.cost': 'Nessun costo per operazione.',
  'web.marketing.provider.reddit.label': 'Reddit',
  'web.marketing.provider.reddit.accountTypes': 'Un account Reddit autorizzato a pubblicare.',
  'web.marketing.provider.reddit.restriction':
    'Scrivere su Reddit richiede un’app approvata. I post sono di testo o link nei subreddit consentiti; niente commenti o voti automatici.',
  'web.marketing.provider.reddit.cost': 'Nessun costo per operazione.',
  'web.marketing.provider.wordpress.label': 'WordPress',
  'web.marketing.provider.wordpress.accountTypes': 'Un sito WordPress con password dell’app.',
  'web.marketing.provider.wordpress.restriction':
    'I post escono tramite l’API REST del sito come utente connesso. L’upload di immagini e video non è ancora disponibile.',
  'web.marketing.provider.wordpress.cost': 'Nessun costo per operazione.',
  'web.marketing.provider.medium.label': 'Medium',
  'web.marketing.provider.medium.accountTypes': 'Un profilo autore Medium connesso via OAuth.',
  'web.marketing.provider.medium.restriction':
    'I post escono come storie pubbliche in Markdown. L’API di integrazione non ha eliminazione, quindi non viene offerta.',
  'web.marketing.provider.medium.cost': 'Nessun costo per operazione.',
  'web.marketing.provider.devto.label': 'Dev.to',
  'web.marketing.provider.devto.accountTypes': 'Un profilo Dev.to connesso con la sua chiave API.',
  'web.marketing.provider.devto.restriction':
    'Gli articoli escono come post Markdown pubblici. Upload di immagini e analisi non sono ancora disponibili.',
  'web.marketing.provider.devto.cost': 'Nessun costo per operazione.',
  'web.marketing.provider.pinterest.label': 'Pinterest',
  'web.marketing.provider.pinterest.accountTypes':
    'Un account business Pinterest connesso via OAuth.',
  'web.marketing.provider.pinterest.restriction':
    'Un pin richiede un’immagine e una bacheca tua. Scrivere richiede la revisione dell’app; le bacheche vengono lette alla connessione.',
  'web.marketing.provider.pinterest.cost': 'Nessun costo per operazione.',
  'web.marketing.provider.discord.label': 'Discord',
  'web.marketing.provider.discord.accountTypes':
    'Un bot Discord che controlli, che pubblica nei canali di testo.',
  'web.marketing.provider.discord.restriction':
    'Il bot pubblica solo nei canali che vede. I messaggi di testo sono supportati; gli allegati non ancora.',
  'web.marketing.provider.discord.cost': 'Nessun costo per operazione.',
  'web.marketing.provider.slack.label': 'Slack',
  'web.marketing.provider.slack.accountTypes': 'Uno spazio Slack connesso tramite un’app OAuth.',
  'web.marketing.provider.slack.restriction':
    'I messaggi vanno nei canali pubblici e privati dove si trova l’app. Upload di file e analisi non sono ancora disponibili.',
  'web.marketing.provider.slack.cost': 'Nessun costo per operazione.',

  /* ---------------------------------------------------------------------- */
  /* Capability matrix notes                                                 */
  /* ---------------------------------------------------------------------- */

  'web.capabilities.short.supported': 'Supportato',
  'web.capabilities.short.unsupported': 'La piattaforma non lo offre',
  'web.capabilities.short.not_implemented': 'Non ancora costruito',
  'web.capabilities.short.requires_review': 'Necessita di revisione della piattaforma',
  'web.capabilities.notesTitle': 'Note e fonti',
  'web.capabilities.noteRef': 'Nota {number}',
  'web.capabilities.summary':
    '{supported, plural, one {# funzionalità supportate} many {# funzionalità supportate} other {# funzionalità supportate}}, {requiresReview, plural, one {# in attesa di revisione della piattaforma} many {# in attesa di revisione della piattaforma} other {# in attesa di revisione della piattaforma}}, {notImplemented, plural, one {# non ancora creato} many {# non ancora creato} other {# non ancora creato}}, {unsupported, plural, one {# la piattaforma non offre} many {# la piattaforma non offre} other {# la piattaforma non offre}}.',
  'web.capabilities.buildState.title': 'Nessun connettore trasporta ancora il traffico dei clienti',
  'web.capabilities.buildState.body':
    'Relay è in costruzione. Questa tabella riflette le definizioni dei connettori così come sono oggi, motivo per cui la maggior parte delle celle viene letta come non ancora costruita. Una cella viene supportata solo dopo che il connettore supera la definizione di completamento, compresi i test contrattuali rispetto ai dispositivi della piattaforma registrati. Le celle che dicono che una piattaforma non offre qualcosa, o la chiudono dietro una recensione, sono fatti sulla piattaforma e sono già definitivi.',
  'web.capabilities.note.instagramProfessional':
    'Solo conti professionali. Un account consumatore non può essere pubblicato da alcuna applicazione.',
  'web.capabilities.note.facebookPagesOnly':
    "Solo pagine. L'API non pubblica su un profilo personale.",
  'web.capabilities.note.youtubeAudit':
    "Fino al superamento del controllo di conformità dell'API di Google, i caricamenti saranno privati.",
  'web.capabilities.note.tiktokAudit':
    "Fino al superamento del controllo dell'API di pubblicazione dei contenuti, i post sono privati e limitati.",
  'web.capabilities.note.tiktokPrivacy':
    "L'opzione privacy viene recuperata al momento della pubblicazione e deve essere scelta da una persona.",
  'web.capabilities.note.linkedinMemberAnalytics':
    "L'analisi dei post dei membri richiede un'autorizzazione di lettura LinkedIn ha chiuso a nuove applicazioni.",
  'web.capabilities.note.linkedinOrgAccess':
    "Richiede un prodotto di gestione della comunità approvato e un'azienda verificata.",
  'web.capabilities.note.linkedinDocuments':
    "LinkedIn è l'unica piattaforma connessa con un tipo di post di documenti.",
  'web.capabilities.note.metaReview':
    "Richiede la revisione dell'app Meta e la verifica aziendale.",
  'web.capabilities.note.xConsent':
    "Richiede il consenso registrato del titolare dell'account per la pubblicazione automatizzata.",
  'web.capabilities.note.xDisclosure':
    'La piattaforma fornisce un campo realizzato con AI, che Relay imposta dalla tua dichiarazione.',
  'web.capabilities.note.noDestinations':
    'Questa piattaforma non ha un concetto di destinazione come una pagina, una bacheca o una comunità.',
  'web.capabilities.note.noThreads': 'Questa piattaforma non ha una sequenza multi-post nativa.',
  'web.capabilities.note.noDocuments':
    'Questa piattaforma non ha alcun tipo di pubblicazione di documenti.',
  'web.capabilities.note.videoOnly': 'Questa piattaforma accetta solo caricamenti di video.',
  'web.capabilities.note.noAltText':
    'Questa piattaforma non accetta testo alternativo tramite la sua API di pubblicazione.',
  'web.capabilities.note.noPrivacyChoice':
    "Questa piattaforma non offre un'opzione di privacy per post tramite la sua API.",
  'web.capabilities.note.noThumbnail':
    'Questa piattaforma non accetta una miniatura personalizzata tramite la sua API.',
  'web.capabilities.note.inBuild': "La piattaforma offre questo. Relay non l'ha ancora spedito.",
  'web.capabilities.note.noCarousel': 'La piattaforma non offre un carosello scorrevole.',
  'web.capabilities.note.noDisclosure':
    'La piattaforma non ha un campo di divulgazione per contenuti IA o commerciali.',
  'web.capabilities.note.noAnalytics':
    'La piattaforma non espone metriche di engagement tramite la sua API ufficiale.',
  'web.capabilities.note.redditReview':
    'Scrivere su Reddit richiede un’app approvata per la data API.',
  'web.capabilities.note.redditMedia':
    'I post con immagine e video non sono ancora disponibili per Reddit.',
  'web.capabilities.note.mediumImages': 'L’API di integrazione non accetta allegati immagine.',
  'web.capabilities.note.mediumNoDelete': 'L’API di integrazione non ha endpoint di eliminazione.',
  'web.capabilities.note.devtoImages':
    'L’API accetta solo corpi articolo; l’upload di immagini non è ancora disponibile.',
  'web.capabilities.note.pinterestNeedsImage':
    'Un pin richiede un’immagine; i pin solo testo non esistono.',
  'web.capabilities.note.pinterestReview': 'Scrivere su Pinterest richiede accesso app approvato.',

  /* ---------------------------------------------------------------------- */
  /* Status page surfaces                                                    */
  /* ---------------------------------------------------------------------- */

  'web.status.surface.web': 'Applicazione Web',
  'web.status.surface.api': 'API REST',
  'web.status.surface.mcp': 'server MCP',
  'web.status.surface.cli': 'CLI',
  'web.status.surface.webhooks': 'Consegna del webhook',
  'web.status.surface.publishing': "Lavoratori dell'editoria",
  'web.status.surface.media': 'Elaborazione multimediale',
  'web.status.surface.analytics': 'Raccolta di analisi',
  'web.status.surface.links': 'Reindirizzamenti di collegamenti brevi',
  'web.status.surface.checkout': 'Checkout e fatturazione',
  'web.status.preLaunch.title': 'Relay non è ancora generalmente disponibile',
  'web.status.preLaunch.body':
    "Questa pagina è attiva prima del prodotto, in modo che l'abitudine alla segnalazione esista dal primo cliente anziché essere aggiunta dopo la prima interruzione. Le superfici ancora in costruzione vengono contrassegnate come tali anziché essere visualizzate come integre.",

  /* ---------------------------------------------------------------------- */
  /* Comparison targets                                                      */
  /* ---------------------------------------------------------------------- */

  'web.compare.product.postiz': 'Postiz',
  'web.compare.product.buffer': 'Buffer',
  'web.compare.product.hootsuite': 'Hootsuite',
  'web.compare.product.later': 'Più tardi',
  'web.compare.product.metricool': 'Metricolo',
  'web.compare.product.publer': 'Editore',
  'web.compare.product.socialbee': 'SocialBee',
  'web.compare.product.typefully': 'Tipicamente',
  'web.compare.product.publishingApis': 'API di pubblicazione per sviluppatori',
  'web.compare.state.factCheckPending': 'Verifica dei fatti in corso',

  /* ---------------------------------------------------------------------- */
  /* Tool radar categories                                                   */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.category.video': 'Generazione e editing video',
  'web.toolRadar.category.image': 'Generazione e modifica delle immagini',
  'web.toolRadar.category.audio': 'Audio, voce e musica',
  'web.toolRadar.category.ugc': 'Video in stile avatar e creatore',
  'web.toolRadar.category.clipping': 'Da video lunghi a clip brevi',
  'web.toolRadar.category.design': 'Progettazione e impaginazione',
  'web.toolRadar.category.research': 'Ricerca e raccolta delle fonti',
  'web.toolRadar.category.workflow': 'Automazione del flusso di lavoro',

  /* ---------------------------------------------------------------------- */
  /* Opportunity categories                                                  */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.category.launch': 'Directory di lancio e avvio del prodotto',
  'web.opportunities.category.review': 'Directory di software e recensioni',
  'web.opportunities.category.marketplace': 'Mercati di integrazione e automazione',
  'web.opportunities.category.community':
    "Discussioni della community che consentono l'invio di contributi",
  'web.opportunities.category.partner': 'Ecosistemi dei partner e directory di integrazione',
  'web.opportunities.category.editorial': 'Tutorial per gli ospiti, podcast e newsletter',
  'web.opportunities.category.openSource': 'Elenchi open source e risorse di documentazione',

  /* ---------------------------------------------------------------------- */
  /* Subprocessors and retention                                             */
  /* ---------------------------------------------------------------------- */

  'web.legal.subprocessors.neon.label': 'Neon',
  'web.legal.subprocessors.neon.purpose': 'Managed PostgreSQL, authentication and object storage.',
  'web.legal.subprocessors.neon.data':
    'Account records, content, media, schedules, receipts and audit events.',
  'web.legal.subprocessors.temporal.label': 'Temporal Cloud',
  'web.legal.subprocessors.temporal.purpose':
    'Durable execution of publishing, retry and scheduling workflows.',
  'web.legal.subprocessors.temporal.data':
    'Workflow inputs limited to identifiers and minimized payloads.',
  'web.legal.subprocessors.polar.label': 'Polar',
  'web.legal.subprocessors.polar.purpose':
    'Merchant of record: checkout, subscriptions, taxes, invoices and refunds.',
  'web.legal.subprocessors.polar.data':
    'Name, email, billing address, payment method held by Polar, and subscription state.',
  'web.legal.subprocessors.deepseek.label': 'DeepSeek',
  'web.legal.subprocessors.deepseek.purpose':
    'Text assistance, translation and transcreation, and planning suggestions.',
  'web.legal.subprocessors.deepseek.data':
    'Only the text you submit to an AI feature and the project context you attached to it.',
  'web.legal.subprocessors.hosting.label': 'Application hosting and content delivery',
  'web.legal.subprocessors.hosting.purpose':
    'Serving the web app, the API and the short link service.',
  'web.legal.subprocessors.hosting.data': 'Request metadata and redacted logs.',
  'web.legal.subprocessors.email.label': 'Transactional email delivery',
  'web.legal.subprocessors.email.purpose':
    'Sign in links, approval requests, publish result notifications and trial reminders.',
  'web.legal.subprocessors.email.data': 'Name, email address and the message content.',
  'web.legal.subprocessors.monitoring.label': 'Error and performance monitoring',
  'web.legal.subprocessors.monitoring.purpose':
    'Diagnosing failures in publishing and in the interface.',
  'web.legal.subprocessors.monitoring.data':
    'Redacted stack traces, request identifiers and workspace identifiers. Post content is stripped.',
  'web.legal.subprocessors.region.pending': 'Region being confirmed',
  'web.legal.subprocessors.vendorPending': 'Vendor being selected',

  'web.legal.retention.column.data': 'Data',
  'web.legal.retention.column.period': 'How long it is kept',
  'web.legal.retention.credentials.label': 'Active platform credentials',
  'web.legal.retention.credentials.period':
    'Encrypted while the connection is active. Revoked at the platform and deleted here as soon as you disconnect.',
  'web.legal.retention.oauthState.label': 'OAuth transaction state',
  'web.legal.retention.oauthState.period': 'Minutes, then deleted.',
  'web.legal.retention.drafts.label': 'Drafts and media',
  'web.legal.retention.drafts.period':
    'While the account is active, or your own retention setting, with a trash grace period.',
  'web.legal.retention.receipts.label': 'Publication receipts and audit events',
  'web.legal.retention.receipts.period':
    'Kept for the plan and legal retention period, minimized, and exportable at any time.',
  'web.legal.retention.rawProvider.label': 'Raw platform responses',
  'web.legal.retention.rawProvider.period':
    'The shortest period needed for debugging and compliance, then minimized or deleted.',
  'web.legal.retention.metrics.label': 'Analytics observations',
  'web.legal.retention.metrics.period':
    'The plan retention period, within what the platform terms allow.',
  'web.legal.retention.securityLogs.label': 'Security logs',
  'web.legal.retention.securityLogs.period':
    'A fixed window between 30 and 180 days depending on the risk of the event.',
  'web.legal.retention.billing.label': 'Billing records',
  'web.legal.retention.billing.period':
    'The statutory accounting retention period, held by Polar and by us.',
  'web.legal.retention.deletedAccount.label': 'A deleted account',
  'web.legal.retention.deletedAccount.period':
    'Credentials revoked and scheduled work cancelled immediately. Full deletion completes within the published window, apart from lawful billing records.',
  'web.legal.retention.backups.label': 'Backups',
  'web.legal.retention.backups.period':
    'Encrypted and access controlled, expiring on a documented rotation. A deletion propagates through the restore process.',

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.footer.product': 'Prodotto',
  'web.footer.company': 'Compagnia',
  'web.footer.resources': 'Risorse',
  'web.footer.legal': 'Legale',
  'web.footer.developers': 'Sviluppatori',
  'web.footer.statement':
    'Relay pubblica solo tramite le API della piattaforma ufficiale. La disponibilità del connettore dipende dalle approvazioni controllate dalle piattaforme e ogni dichiarazione di funzionalità su questo sito è datata e fornita.',
  'web.footer.noAffiliation':
    'I nomi e i marchi delle piattaforme appartengono ai rispettivi proprietari. Il loro utilizzo qui identifica un connettore e non implica approvazione o partnership.',
  'web.footer.copyright': 'Relay {year}',
} as const;
