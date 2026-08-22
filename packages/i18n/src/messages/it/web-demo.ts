/**
 * The in-page product demonstration: the hero demonstration on the home page
 * and the guided walkthrough at `/demo`.
 *
 * Rules that bind this file specifically:
 *
 *  - Every panel on those surfaces is built from the real design system, so a
 *    reader is looking at the interface rather than at a drawing of it. The
 *    copy must therefore never describe something the interface does not do.
 *  - The content is sample content for a company that does not exist, and it
 *    says so in words, in the caption a screen reader reads with the figure.
 *  - No number here is an engagement number. There is no follower count, no
 *    reach figure and no score, because the product has no such data and a
 *    demonstration that invents one is a fabricated dashboard.
 *  - Nothing publishes today. No connector has passed provider verification,
 *    so the demonstration stops at the point the product stops: a scheduled
 *    post, an approval, and a receipt whose publishing half is unavailable.
 *  - The demonstration submits nothing. It has no form, no destination and no
 *    account behind it, and the copy must not suggest otherwise.
 */
export const webDemoMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata and navigation                                                 */
  /* ---------------------------------------------------------------------- */

  'web.meta.demo.title': 'Guarda come funziona Relay',
  'web.meta.demo.description':
    'Un tour guidato del flusso di pubblicazione, da un nuovo marchio alla ricevuta, mostrato nella vera interfaccia con contenuti di esempio. Niente viene ancora pubblicato, e il tour dice dove si trova quel confine.',

  'web.demo.nav.label': 'Guardalo funzionare',
  'web.demo.nav.summary':
    "Un tour guidato del prodotto nell'ordine in cui lo incontri, costruito dalla vera interfaccia con contenuti di esempio.",

  /* ---------------------------------------------------------------------- */
  /* The frame every demonstration panel sits in                             */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': 'Dimostrazione',
  'web.demo.frame.sample':
    "Una dimostrazione costruita dalla vera interfaccia, riempita con contenuti di esempio per un'azienda che non esiste. Non un account reale. Niente qui invia nulla.",

  'web.demo.control.pause': 'Metti in pausa la dimostrazione',
  'web.demo.control.play': 'Avvia la dimostrazione',
  'web.demo.control.replay': 'Riguarda la dimostrazione',

  /* ---------------------------------------------------------------------- */
  /* The home page hero demonstration                                        */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.caption':
    'Una bozza diventa una versione per piattaforma, riceve un orario, e atterra sulla settimana. Contenuti di esempio, non un account reale.',
  'web.demo.hero.more': "Percorri l'intero flusso di lavoro",

  /* ---------------------------------------------------------------------- */
  /* The walkthrough page                                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': "Come funziona, nell'ordine in cui lo incontri",
  'web.demo.lede':
    'Nove passaggi, da un workspace vuoto al registro di cosa è successo. Ognuno mostra la superficie che staresti realmente guardando, con contenuti di esempio dentro. Niente in questa pagina si muove da solo, quindi puoi leggerla al tuo ritmo.',
  'web.demo.notice.title': 'Questa è una dimostrazione, non un account reale',
  'web.demo.notice.body':
    "Ogni pannello qui è l'interfaccia del prodotto con contenuti di esempio dentro. Nessun connettore ha superato la verifica del provider, quindi oggi niente viene pubblicato su nessuna piattaforma tramite questo prodotto. Dove il flusso di lavoro si ferma, la pagina lo dice invece di disegnare il resto.",
  'web.demo.contents.title': 'I nove passaggi',
  'web.demo.stepLabel': 'Passaggio {position} di {total}',
  'web.demo.next': 'Avanti: {step}',
  'web.demo.closing.pricing': 'Guarda quanto costa',
  'web.demo.closing.title': 'Questo è tutto il ciclo',
  'web.demo.closing.body':
    "Niente qui sopra è un abbozzo di un prodotto che speriamo di costruire. È l'interfaccia così com'è, con la metà relativa alla pubblicazione onestamente segnalata come non finita.",

  /* ---------------------------------------------------------------------- */
  /* The nine steps                                                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': 'Crea un marchio',
  'web.demo.step.project.body':
    'Un marchio contiene account, bozze, approvazioni e un fuso orario. Ogni interrogazione nel prodotto è limitata a uno solo, nel servizio applicativo e di nuovo nel database, così un cliente non può vedere un altro cliente per errore.',

  'web.demo.step.connect.title': 'Collega un account',
  'web.demo.step.connect.body':
    "Il collegamento passa solo attraverso le API ufficiali della piattaforma, e ti dice cosa richiede la piattaforma dall'account prima di iniziare. Oggi ogni connettore si ferma alla verifica, motivo per cui ogni riga qui sotto lo dice invece di mostrare un segno di spunta verde.",

  'web.demo.step.compose.title': 'Scrivilo una volta, adattalo per piattaforma',
  'web.demo.step.compose.body':
    "Scrivi una bozza principale. Selezionare un account apre una sostituzione solo per quell'account, con i suoi limiti e la sua anteprima. Niente di ciò che scrivi per LinkedIn cambia ciò che riceve X, e i controlli sotto ogni versione vengono eseguiti prima che qualcosa venga programmato.",

  'web.demo.step.variants.title': 'Vedi cosa riceve davvero ciascun account',
  'web.demo.step.variants.body':
    'Una bozza diventa una versione per account, ognuna scritta per la piattaforma a cui va: una riga più breve per X, la nota di rilascio completa per LinkedIn, una didascalia e testo alternativo per Instagram. Puoi modificarne una qualsiasi senza toccare le altre, e ogni versione porta il controllo che le si applica.',

  'web.demo.step.schedule.title': 'Dagli un orario, oppure affidalo alla coda',
  'web.demo.step.schedule.body':
    "Un orario è memorizzato come istante più il fuso orario del marchio, mai come un'ora locale ingenua, così un cambio d'ora legale non ti sposta nulla sotto i piedi. La coda è l'altra strada: prende il prossimo spazio consentito dalle regole che hai impostato.",

  'web.demo.step.calendar.title': 'Guarda il calendario',
  'web.demo.step.calendar.body':
    "La settimana mostra la piattaforma, l'account, lo stato e l'orario per ogni post. Spostarne uno è un pulsante oltre che un trascinamento, quindi il calendario è completamente utilizzabile da tastiera.",

  'web.demo.step.receipt.title': 'Leggi la ricevuta dopo',
  'web.demo.step.receipt.body':
    "Ogni tentativo scrive una ricevuta immutabile: chi l'ha scritto, chi l'ha approvato, sotto quale politica, in quale istante. La metà relativa alla pubblicazione di quel registro è scritta dall'esecuzione di pubblicazione, che è la parte che non esiste ancora.",

  /* ---------------------------------------------------------------------- */
  /* Panel labels                                                            */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': 'Marchio',
  'web.demo.project.zone': 'Fuso orario: {zone}',
  'web.demo.project.scope':
    'Bozze, account, approvazioni e ricevute appartengono a questo marchio e a nessun altro.',

  'web.demo.accounts.label': 'Account in questo marchio',
  'web.demo.accounts.state': 'Verifica non completata',
  'web.demo.accounts.note':
    "Ogni riga porterebbe lo stato del token, i permessi concessi e l'ultimo post riuscito. Nessuno di essi può pubblicare oggi.",

  'web.demo.master.label': 'Bozza principale',
  'web.demo.master.project': 'Nel marchio {project}',

  'web.demo.variants.label': 'Cosa riceve ciascun account',

  'web.demo.schedule.label': 'Programmato',
  'web.demo.schedule.value': '{when} in {zone}',
  'web.demo.schedule.approval':
    "È richiesta un'approvazione prima che qualcosa possa essere inviato.",
  'web.demo.schedule.queue':
    "La coda è l'altra strada: sceglie il prossimo spazio consentito dalle tue regole, in questo fuso orario.",

  'web.demo.week.label': 'La settimana',
  'web.demo.week.caption': 'Gli stessi tre post sul calendario, letti nel fuso orario del marchio.',
  'web.demo.week.empty': 'Niente programmato',

  'web.demo.receipt.label': 'Ricevuta finora',
  'web.demo.receipt.pending':
    "Cosa è stato inviato, cosa ha risposto la piattaforma, l'ID del post esterno e il link permanente sono scritti dall'esecuzione di pubblicazione. Restano non disponibili finché un connettore non supera la verifica del provider.",
  'web.demo.receipt.field.externalId': 'ID post esterno',
  'web.demo.receipt.field.permalink': 'Link permanente',

  /* ---------------------------------------------------------------------- */
  /* Sample content                                                          */
  /*                                                                         */
  /* Northbound Tools is the sample company the marketing pages already use.  */
  /* Its handles sit on the reserved `.example` domain and its people are     */
  /* first names with no surname, so nothing here can be mistaken for a real  */
  /* customer, a real account or a real endorsement.                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools (esempio)',
  'web.demo.sample.actor': 'Ada, collega di esempio',
  'web.demo.sample.approver': 'Ravi, revisore di esempio',
  'web.demo.sample.policy': "Un'approvazione prima dell'invio",
  'web.demo.sample.master':
    'Northbound 2.4 è uscito oggi. Le importazioni sono più veloci, la ricerca ha una scorciatoia da tastiera, ed è risolto il bug di esportazione segnalato da due di voi.',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'Northbound 2.4 è uscito. Importazioni più veloci, ricerca da tastiera, e quel bug di esportazione è risolto.',
  'web.demo.sample.x.check': 'Conteggio dei caratteri e ordine del thread',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    "Northbound 2.4 è uscito oggi. La nota di rilascio spiega per intero le modifiche alle importazioni e la correzione dell'esportazione.",
  'web.demo.sample.linkedin.check': 'Ruolo aziendale e lunghezza del post',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    'La stessa immagine di rilascio, con una didascalia scritta per il feed e testo alternativo scritto da una persona.',
  'web.demo.sample.instagram.check': "Tipo di account, rapporto d'aspetto e testo alternativo",

  /* ---------------------------------------------------------------------- */
  /* The nine scene product tour                                             */
  /*                                                                         */
  /* The step names are the indicator's button labels, so they are short      */
  /* enough to sit in a row of nine and specific enough to be worth clicking. */
  /* They are also the labels of the stacked walkthrough a reader gets with   */
  /* reduced motion or no JavaScript, which is the same tour with the timing  */
  /* taken out rather than a reduced version of it.                           */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': 'Passaggi del tour',
  'web.demo.tour.jump': 'Mostra il passaggio {position}: {step}',
  'web.demo.tour.step.project': 'Crea un marchio',
  'web.demo.tour.step.connect': 'Collega account',
  'web.demo.tour.step.compose': 'Componi una volta',
  'web.demo.tour.step.variants': 'Adatta per piattaforma',
  'web.demo.tour.step.validate': 'Controllalo',
  'web.demo.tour.step.schedule': 'Dagli un orario',
  'web.demo.tour.step.week': 'Guarda la settimana',
  'web.demo.tour.step.publish': 'Pubblica e registra',
  'web.demo.tour.step.digest': 'Leggi il riepilogo',

  /* ---------------------------------------------------------------------- */
  /* Checks (step 5)                                                         */
  /*                                                                         */
  /* Only checks the composer genuinely runs today: the per account character */
  /* limit (`validation.text_too_long`), alt text on every image             */
  /* (`validation.alt_text_missing`), and whether a first comment is allowed  */
  /* on the account it was written for (the `firstComment` capability).       */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': 'Controlli prima della programmazione',
  'web.demo.validate.check.length': 'Limite di caratteri, per account',
  'web.demo.validate.check.lengthDetail':
    "Ogni versione viene misurata rispetto al limite che la piattaforma dà a quell'account.",
  'web.demo.validate.check.altText': 'Testo alternativo su ogni immagine',
  'web.demo.validate.check.altTextDetail':
    "Un'immagine senza descrizione, o senza essere contrassegnata come decorativa, blocca la programmazione.",
  'web.demo.validate.check.firstComment': 'Primo commento consentito qui',
  'web.demo.validate.check.firstCommentDetail':
    'Un primo commento viene offerto solo su account la cui piattaforma ne supporta uno.',
  'web.demo.validate.note':
    'Questi vengono eseguiti nel compositore prima che qualcosa venga programmato, e di nuovo prima che qualcosa venga inviato.',

  /* ---------------------------------------------------------------------- */
  /* Publish and receipt (step 8)                                            */
  /*                                                                         */
  /* The steps a scheduled post has really passed are completed. Everything   */
  /* the publish run would write is pending, because no connector has passed  */
  /* provider verification, so there is no publish run to write it.           */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': 'Pubblicazione e il suo registro',
  'web.demo.live.step.approved': 'Approvato da {approver}',
  'web.demo.live.step.queued': 'In coda per il suo spazio',
  'web.demo.live.step.sent': 'Inviato alla piattaforma',
  'web.demo.live.step.confirmed': 'Confermato dalla piattaforma',
  'web.demo.live.badge.pending': 'Non pubblicato',
  'web.demo.live.badge.live': 'Live',
  'web.demo.live.pending':
    "Gli ultimi due passaggi sono scritti dall'esecuzione di pubblicazione. Nessun connettore ha ancora superato la verifica del provider, quindi restano in sospeso e l'ID del post esterno e il link permanente restano non disponibili.",

  /* ---------------------------------------------------------------------- */
  /* The weekly digest (step 9)                                              */
  /*                                                                         */
  /* Sentences about what the product did, never engagement figures. There is */
  /* no reach, no impression count and no score here, because the product has */
  /* none to read and a digest that invented one would be a fabricated        */
  /* dashboard with a friendlier voice.                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': 'La tua settimana, in frasi',
  'web.demo.digest.sample': 'Esempio',
  'web.demo.digest.line.variants':
    'Questa settimana sono uscite tre versioni native per piattaforma da una bozza.',
  'web.demo.digest.line.earliest': 'Martedì mattina è stato il tuo spazio più presto.',
  'web.demo.digest.line.approval': 'Ogni versione è stata approvata prima di essere messa in coda.',
  'web.demo.digest.line.alt': 'Ogni immagine portava testo alternativo scritto da una persona.',
  'web.demo.digest.footer':
    'Le analisi live appariranno qui man mano che i tuoi post vengono pubblicati.',

  /* ---------------------------------------------------------------------- */
  /* The three added walkthrough steps                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': 'Controllalo prima che sia programmato',
  'web.demo.step.validate.body':
    "Il compositore misura ogni versione rispetto all'account per cui è scritta: il limite di caratteri che quell'account ha davvero, il testo alternativo su ogni immagine, e se la piattaforma offre affatto un primo commento. Una versione che fallisce un controllo non può essere programmata.",

  'web.demo.step.publish.title': 'Pubblica, e conserva il registro',
  'web.demo.step.publish.body':
    "Un'esecuzione di pubblicazione invia ogni versione al suo istante, registra cosa ha risposto la piattaforma, e scrive una ricevuta immutabile. Quell'esecuzione è la parte che non esiste ancora, quindi gli ultimi due passaggi qui sotto sono in sospeso invece di essere disegnati come finiti.",

  'web.demo.step.digest.title': 'Leggi il riepilogo settimanale',
  'web.demo.step.digest.body':
    'Il riepilogo descrive cosa ha fatto il prodotto in frasi: quante versioni sono uscite da una bozza, quale spazio è stato il più presto, cosa è stato approvato. Non porta cifre di coinvolgimento, perché le analisi arrivano dalle piattaforme dopo che un post viene pubblicato e niente viene ancora pubblicato.',
} as const;
