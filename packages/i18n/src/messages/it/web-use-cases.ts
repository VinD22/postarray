/**
 * The three project-led use case pages.
 *
 * These describe workflows, not capabilities. The rule that binds every string
 * here: a sentence may describe how the product is designed and what has been
 * built, and may never imply that anything reaches a platform. Nothing
 * publishes, so "what works today" is written in the past and present tense of
 * the build, not of a live service.
 */
export const webUseCaseMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.useCases.title': "Casi d'uso",
  'web.meta.useCases.description':
    "Tre flussi di lavoro attorno ai quali viene costruito questo prodotto: gestire più clienti in un unico posto, far approvare il lavoro prima che esca, e portare un'idea su più piattaforme senza riscriverla.",
  'web.meta.useCase.clients.title': 'Gestione di più clienti',
  'web.meta.useCase.clients.description':
    'Marchi separati, account collegati separati, approvazioni separate e reportistica separata, per i team che pubblicano per conto di altre persone.',
  'web.meta.useCase.approvals.title': 'Flussi di approvazione',
  'web.meta.useCase.approvals.description':
    "Come una bozza diventa un post approvato: chi la revisiona, cosa invalida un'approvazione, e perché la stessa regola vale su ogni superficie.",
  'web.meta.useCase.crossPlatform.title': 'Pubblicazione multipiattaforma',
  'web.meta.useCase.crossPlatform.description':
    'Una bozza principale, una versione adattata per piattaforma, validata rispetto ai limiti registrati di ciascuna piattaforma prima che qualcosa venga programmato.',

  /* ---------------------------------------------------------------------- */
  /* Shared furniture                                                       */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': "Casi d'uso",
  'web.useCases.index.lede':
    "Tre flussi di lavoro attorno ai quali viene costruito questo prodotto. Ogni pagina dice cosa costa oggi quel flusso a un team, come il prodotto è progettato per gestirlo, e quali parti sono realmente costruite.",
  'web.useCases.index.listLabel': "Casi d'uso",

  'web.useCases.notice.title': 'Questo descrive un progetto, non un servizio funzionante',
  'web.useCases.notice.body':
    'Nessun connettore è verificato in produzione, quindi niente in questa pagina pubblica da nessuna parte, per ora. Dove una parte del flusso è costruita, lo dice. Dove non lo è, lo dice anche.',

  'web.useCases.section.problem': 'Il problema',
  'web.useCases.section.approach': 'Come è progettato il prodotto',
  'web.useCases.section.today': 'Cosa è realmente costruito',
  'web.useCases.section.related': 'Correlati',

  /* ---------------------------------------------------------------------- */
  /* Managing multiple clients                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': 'Gestione di più clienti',
  'web.useCases.clients.lede':
    'Il lavoro per un cliente non dovrebbe mai essere a un clic sbagliato di distanza dal pubblico di un altro cliente.',
  'web.useCases.clients.problem':
    "La maggior parte dei team separa i clienti stando attenta. Un unico account condiviso contiene ogni pagina collegata, un unico calendario contiene ogni programmazione, e l'unica cosa che si frappone tra la bozza di un cliente e il pubblico sbagliato è la persona che guarda lo schermo alle 18. Quando qualcuno lascia il team, la separazione se ne va con l'abitudine.",
  'web.useCases.clients.approach1':
    "Un marchio è l'unità di separazione. Account collegati, bozze, code, media e ricevute appartengono a un marchio, e un membro vede solo i marchi a cui è stato aggiunto.",
  'web.useCases.clients.approach2':
    "La separazione viene applicata tre volte: all'autenticazione, nel servizio applicativo che autorizza l'azione, e nel database stesso tramite la sicurezza a livello di riga. Essere autenticati non viene mai trattato come un permesso.",
  'web.useCases.clients.approach3':
    'La reportistica segue lo stesso confine, quindi un report per cliente è la forma predefinita anziché un foglio di calcolo che qualcuno assembla a mano.',
  'web.useCases.clients.today':
    "I marchi, l'appartenenza limitata al marchio e le politiche di sicurezza a livello di riga dietro di essi sono costruiti e testati, inclusi test che tentano letture tra marchi diversi e verificano che falliscano. I piani sono dimensionati in base a quanti marchi serve a un team. Niente viene ancora pubblicato su una piattaforma da nessun marchio.",

  /* ---------------------------------------------------------------------- */
  /* Approval workflows                                                     */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': 'Flussi di approvazione',
  'web.useCases.approvals.lede': "Un'approvazione vale qualcosa solo se la cosa approvata è la cosa che esce.",
  'web.useCases.approvals.problem':
    "Le approvazioni di solito vivono fuori dallo strumento che pubblica. Uno screenshot va a un cliente, il cliente risponde sì, e poi il testo cambia. L'approvazione ora si riferisce a una bozza che nessuno ha, e lo strumento non ne ha idea, quindi pubblica qualunque cosa gli sia stata data per ultima.",
  'web.useCases.approvals.approach1':
    "Un'approvazione è collegata esattamente al contenuto che è stato revisionato. Modificare una bozza approvata invalida l'approvazione e dice quale campo è cambiato, invece di portare avanti in silenzio la vecchia decisione.",
  'web.useCases.approvals.approach2':
    "Un revisore può approvare, chiedere modifiche o rifiutare, ed è richiesto un commento per qualsiasi cosa diversa dall'approvazione, così l'autore non resta mai a indovinare cosa correggere.",
  'web.useCases.approvals.approach3':
    "La regola vive nel livello applicativo condiviso, quindi l'app web, l'API REST, il server MCP, la CLI e i webhook la rispettano tutti. Nessuna superficie ha una scorciatoia per aggirare la revisione.",
  'web.useCases.approvals.today':
    "Gli stati di approvazione, la superficie di revisione, le regole di ri-approvazione e gli eventi di audit dietro di essi sono costruiti. Ciò che non è costruito è l'ultimo passo, perché nessun connettore ha superato la sua definizione di completamento, quindi un post approvato non ha ancora dove andare.",

  /* ---------------------------------------------------------------------- */
  /* Cross-platform publishing                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': 'Pubblicazione multipiattaforma',
  'web.useCases.crossPlatform.lede':
    "Un'idea, una modifica, e una versione per piattaforma che rispetta ciò che quella piattaforma accetta davvero.",
  'web.useCases.crossPlatform.problem':
    "Pubblicare lo stesso testo ovunque produce una versione troncata su una piattaforma, priva di un titolo richiesto su un'altra, e con un link che una terza rimuove silenziosamente. L'alternativa, riscrivere a mano cinque volte, è dove va davvero il lavoro.",
  'web.useCases.crossPlatform.approach1':
    "Una bozza principale contiene l'idea. Ogni account selezionato ottiene la propria versione, e una modifica alla bozza principale si applica solo dove si adatta, dicendo chiaramente quali destinazioni non hanno potuto accoglierla e perché.",
  'web.useCases.crossPlatform.approach2':
    'La validazione viene eseguita rispetto ai limiti registrati per ciascuna piattaforma, contati nel modo in cui quella piattaforma conta, così un limite di caratteri viene controllato in grafemi dove la piattaforma usa i grafemi e in unità ponderate dove usa quelle.',
  'web.useCases.crossPlatform.approach3':
    'Ogni limite di piattaforma mostrato in qualsiasi punto di questo sito è generato dal registro dei connettori e porta il documento da cui proviene e la data in cui una persona lo ha letto.',
  'web.useCases.crossPlatform.today':
    "Il compositore, le versioni per singola destinazione, le regole di validazione e il dataset dei limiti generato sono costruiti. Il passo di pubblicazione no: nessun connettore è verificato in produzione, quindi una bozza validata può essere programmata internamente e non può raggiungere una piattaforma.",
} as const;
