/**
 * The free tools on the public site.
 *
 * These pages exist because this repository already knows every launch cohort
 * platform's real publishing limits from its connector capability code. A tool
 * here may therefore state a number, but only a number the generated dataset
 * carries, always beside the official source and the date a person read it.
 *
 * Rules that bind this file specifically:
 *
 *  - A tool never claims the product publishes anywhere. Nothing in the launch
 *    cohort is verified for production yet, and these pages say so.
 *  - Every calculation described here runs in the reader's browser. Copy that
 *    promises privacy must stay true of the component that renders it.
 *  - No tool writes, rewrites, suggests or scores content. No tool looks up a
 *    handle, a follower count or anything else that would need an unofficial
 *    endpoint.
 *  - A limit we do not have is "unavailable". Never zero, never a guess.
 */
export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': 'Strumenti di pubblicazione gratuiti',
  'web.meta.tools.description':
    'Piccoli strumenti privati per chi pubblica su più piattaforme: un controllo dei limiti per piattaforma, un generatore di UTM, un controllo della lunghezza dei titoli YouTube e un pianificatore di fusi orari.',
  'web.meta.tools.preflight.title': 'Controllo preflight del post',
  'web.meta.tools.preflight.description':
    'Controlla una bozza rispetto ai limiti di testo e media pubblicati di dieci piattaforme, con la fonte e la data in cui ogni limite è stato letto.',
  'web.meta.tools.utm.title': 'Generatore di link UTM',
  'web.meta.tools.utm.description':
    'Componi un URL di campagna taggato e scopri cosa significa ogni parametro UTM. Funziona interamente nel tuo browser.',
  'web.meta.tools.youtubeTitle.title': 'Controllo della lunghezza dei titoli YouTube',
  'web.meta.tools.youtubeTitle.description':
    'Misura un titolo YouTube rispetto al limite documentato, contato nel modo in cui una persona conta i caratteri.',
  'web.meta.tools.timeZone.title': 'Pianificatore di fusi orari e ora legale',
  'web.meta.tools.timeZone.description':
    "Vedi un orario di pubblicazione in più fusi orari del pubblico e trova le settimane in cui un cambio d'ora legale sposta l'orario locale.",
  'web.meta.tools.engagementRate.title': 'Calcolatore del tasso di coinvolgimento',
  'web.meta.tools.engagementRate.description':
    'Dividi le interazioni per copertura, follower o impression. Tre calcoli semplici, nessun parametro di riferimento inventato.',

  /* ---------------------------------------------------------------------- */
  /* Shared tool furniture                                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'Strumenti gratuiti',
  'web.tools.index.summary':
    'Piccoli calcolatori basati sugli stessi dati sui limiti di piattaforma che leggono i nostri connettori.',
  'web.tools.index.lede':
    'Quattro piccoli strumenti, basati sugli stessi dati sui limiti di piattaforma che usano i nostri connettori. Nessun account, nessun caricamento, nessun tracciamento di ciò che scrivi.',
  'web.tools.index.dataTitle': 'Da dove vengono i numeri',
  'web.tools.index.dataBody':
    "Ogni limite è generato dal codice delle capacità dei connettori in questo repository, e ogni riga di piattaforma porta la pagina di documentazione ufficiale da cui proviene e la data in cui una persona l'ha letta.",
  'web.tools.index.honesty':
    'Questi strumenti non pubblicano nulla. Nessun connettore ha ancora completato la verifica del provider, quindi niente qui collega un account.',
  'web.tools.shared.privacyTitle': 'Funziona nel tuo browser',
  'web.tools.shared.privacyBody':
    "Tutto ciò che scrivi resta su questa pagina. Non c'è nessuna richiesta a un server, nessuna memorizzazione e nessun evento analitico che porti il tuo testo.",
  'web.tools.shared.sourceLink': 'Documentazione della piattaforma',
  'web.tools.shared.sourceRead': 'Letto il {date}',
  'web.tools.shared.unavailable': 'non disponibile',
  'web.tools.shared.unavailableWhy':
    'Non abbiamo ancora un connettore per questa piattaforma, quindi non abbiamo un limite verificato da mostrare. Preferiamo non dire nulla piuttosto che indovinare.',
  'web.tools.shared.copy': 'Copia',
  'web.tools.shared.copied': 'Copiato',
  'web.tools.shared.copyFailed': 'Il tuo browser ha bloccato la copia. Seleziona il testo e copialo.',
  'web.tools.shared.faqTitle': 'Domande',
  'web.tools.shared.baselineTitle': 'Quale account descrivono questi numeri',
  'web.tools.shared.baselineBody':
    "Il caso prudente: un account appena collegato senza idoneità elevata. Alcune piattaforme alzano un limite una volta che un canale o un'attività è verificata, e dove succede la pagina lo dice.",
  'web.tools.shared.otherTools': 'Altri strumenti',

  /* ---------------------------------------------------------------------- */
  /* Tool names and one line summaries, shared by the index and the footer   */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'Controllo preflight del post',
  'web.tools.preflight.summary':
    'Una bozza, controllata rispetto ai limiti di testo e media di dieci piattaforme contemporaneamente.',
  'web.tools.utm.name': 'Generatore di link UTM',
  'web.tools.utm.summary': 'Costruisci un URL di campagna taggato senza rovinare la query string che aveva.',
  'web.tools.youtubeTitle.name': 'Controllo della lunghezza dei titoli YouTube',
  'web.tools.youtubeTitle.summary': 'Misura un titolo nel modo in cui una persona conta i caratteri.',
  'web.tools.timeZone.name': 'Pianificatore di fusi orari e ora legale',
  'web.tools.timeZone.summary':
    "Un orario di pubblicazione in più fusi orari del pubblico, con i cambi d'ora legale segnalati.",
  'web.tools.engagementRate.name': 'Calcolatore del tasso di coinvolgimento',
  'web.tools.engagementRate.summary':
    'Interazioni divise per copertura, follower o impression. Niente ricerche, niente parametri di riferimento.',

  /* ---------------------------------------------------------------------- */
  /* Post preflight checker                                                  */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'Controllo preflight del post',
  'web.tools.preflight.lede':
    'Incolla una bozza, scegli le piattaforme su cui pubblichi, e scopri quali la rifiuterebbero prima di scoprirlo da un errore API.',
  'web.tools.preflight.explainer.title': 'Perché un contatore di caratteri non basta',
  'web.tools.preflight.explainer.body':
    "Le piattaforme non concordano su cosa sia un carattere. Alcune contano le unità di codice, quindi una emoji costa due. Alcune contano i grafemi, quindi una bandiera o una emoji di famiglia costa uno. Alcune riscrivono ogni link a una larghezza fissa, quindi un URL di 200 caratteri costa quanto uno di 20. Questo strumento applica separatamente la regola di ciascuna piattaforma.",
  'web.tools.preflight.explainer.counting':
    'La bozza viene misurata con il segmentatore Intl del browser, che divide il testo nelle unità che un lettore chiamerebbe caratteri, poi adattata alla regola della piattaforma.',
  'web.tools.preflight.field.draft.label': 'La tua bozza',
  'web.tools.preflight.field.draft.help':
    'Incolla il testo del post. I link vengono rilevati automaticamente così il loro costo può essere applicato per piattaforma.',
  'web.tools.preflight.field.platforms.label': 'Piattaforme da controllare',
  'web.tools.preflight.field.platforms.help': 'Scegli quante ne usi per pubblicare.',
  'web.tools.preflight.field.mediaKind.label': 'Media allegato',
  'web.tools.preflight.field.mediaKind.none': 'Nessun media',
  'web.tools.preflight.field.mediaKind.image': 'Immagini',
  'web.tools.preflight.field.mediaKind.video': 'Un video',
  'web.tools.preflight.field.mediaCount.label': 'Quante immagini',
  'web.tools.preflight.field.byteSize.label': 'Dimensione del file in megabyte',
  'web.tools.preflight.field.byteSize.help': 'Il file singolo più grande. Lascia vuoto per saltare.',
  'web.tools.preflight.field.duration.label': 'Durata del video in secondi',
  'web.tools.preflight.field.duration.help': 'Lascia vuoto per saltare il controllo della durata.',
  'web.tools.preflight.field.width.label': 'Larghezza del media in pixel',
  'web.tools.preflight.field.height.label': 'Altezza del media in pixel',
  'web.tools.preflight.field.dimensions.help':
    "Facoltativo. Usato solo per mostrare il rapporto d'aspetto che pubblicheresti.",
  'web.tools.preflight.results.title': 'Risultato per piattaforma',
  'web.tools.preflight.results.empty': 'Scegli almeno una piattaforma per vedere un risultato.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Nessun blocco} other {# fallirebbero}}, {warning, plural, =0 {nessun avviso} other {# da controllare}}.',
  'web.tools.preflight.status.pass': 'Va bene',
  'web.tools.preflight.status.warning': 'Da controllare',
  'web.tools.preflight.status.fail': 'Fallirebbe',
  'web.tools.preflight.status.unavailable': 'Non disponibile',
  'web.tools.preflight.count.label':
    '{count} di {limit} {unit, select, grapheme {caratteri} utf16 {unità di codice} weighted {caratteri ponderati} other {caratteri}}',
  'web.tools.preflight.finding.textOver':
    'Oltre il limite di {over, plural, one {# carattere} many {# caratteri} other {# caratteri}}.',
  'web.tools.preflight.finding.textNear': 'Entro {remaining} caratteri dal limite.',
  'web.tools.preflight.finding.textFits': 'Il testo rientra.',
  'web.tools.preflight.finding.linkFixed':
    'Ogni link viene riscritto a una larghezza fissa, quindi ciascuno costa {cost} caratteri qualunque sia la sua lunghezza reale.',
  'web.tools.preflight.finding.linkActual': 'I link contano come i caratteri che occupano.',
  'web.tools.preflight.finding.imagesOver':
    'Questa piattaforma accetta {limit, plural, =0 {nessuna immagine} one {# immagine} many {# immagini} other {# immagini}} in un post.',
  'web.tools.preflight.finding.videosOver':
    'Questa piattaforma accetta {limit, plural, =0 {nessun video} one {# video} many {# video} other {# video}} in un post.',
  'web.tools.preflight.finding.bytesOver': 'Il file è più grande del limite di {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    'Nessun limite di byte pubblicato per questo tipo di media, quindi la dimensione non è stata controllata.',
  'web.tools.preflight.finding.durationOver': 'Più lungo del limite di {limit} secondi.',
  'web.tools.preflight.finding.durationUnder': 'Più corto del minimo di {limit} secondi.',
  'web.tools.preflight.finding.durationUnknown':
    'Nessun limite di durata pubblicato, quindi la lunghezza non è stata controllata.',
  'web.tools.preflight.finding.altText':
    'Il testo alternativo è accettato fino a {limit} caratteri, il che vale la pena usare.',
  'web.tools.preflight.finding.ratio': 'Pubblicheresti a circa {ratio} a 1.',
  'web.tools.preflight.faq.counting.q': 'Come contate i caratteri?',
  'web.tools.preflight.faq.counting.a':
    "Per grafema, usando il segmentatore Intl del browser, che è l'unità che un lettore intende per carattere. Dove una piattaforma documenta una regola diversa, come contare le unità di codice o addebitare una larghezza fissa per link, quella regola viene applicata in aggiunta.",
  'web.tools.preflight.faq.accuracy.q': 'Quanto sono aggiornati questi limiti?',
  'web.tools.preflight.faq.accuracy.a':
    'Ogni limite è generato dal codice dei connettori nel nostro repository invece di essere digitato in una pagina, e ogni riga di piattaforma mostra il documento ufficiale da cui proviene e la data in cui una persona lo ha letto. Se una piattaforma cambia un numero, la correzione è una sola modifica al codice e ogni strumento qui la segue.',
  'web.tools.preflight.faq.privacy.q': 'La mia bozza viene caricata da qualche parte?',
  'web.tools.preflight.faq.privacy.a':
    "No. Il controllo funziona nel tuo browser. Non c'è nessuna richiesta che porti il tuo testo, niente viene memorizzato, e chiudere la scheda basta per scartarlo.",
  'web.tools.preflight.faq.publish.q': 'Questo strumento può pubblicare per me?',
  'web.tools.preflight.faq.publish.a':
    'Non ancora. Nessun connettore ha completato la verifica del provider, quindi niente su questo sito pubblica ancora su una piattaforma. Questa pagina è un controllo dei limiti, non un compositore.',

  /* ---------------------------------------------------------------------- */
  /* UTM builder                                                             */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'Generatore di link UTM',
  'web.tools.utm.lede':
    "Aggiungi parametri di campagna a un URL senza perdere la query string che aveva già, e senza indovinare cosa significhi ciascun parametro.",
  'web.tools.utm.explainer.title': 'A cosa serve ogni parametro',
  'web.tools.utm.explainer.body':
    "I parametri UTM vengono letti dagli strumenti di analisi, non dalla piattaforma su cui pubblichi. Viaggiano nell'URL, quindi chiunque veda il link li vede. Tienili brevi, minuscoli e coerenti, perché due grafie della stessa campagna diventano due righe in un report.",
  'web.tools.utm.field.url.label': 'URL di destinazione',
  'web.tools.utm.field.url.help': 'La pagina su cui vuoi far atterrare le persone, incluso https.',
  'web.tools.utm.field.url.invalid': 'Questo non viene interpretato come un URL http o https.',
  'web.tools.utm.field.source.label': 'Fonte della campagna',
  'web.tools.utm.field.source.help': 'Da dove è arrivato il clic. Ad esempio il nome di una piattaforma.',
  'web.tools.utm.field.medium.label': 'Mezzo della campagna',
  'web.tools.utm.field.medium.help': 'Il tipo di link. Ad esempio social, email o referral.',
  'web.tools.utm.field.campaign.label': 'Nome della campagna',
  'web.tools.utm.field.campaign.help': 'Il lancio, la promozione o il tema a cui appartiene questo link.',
  'web.tools.utm.field.term.label': 'Termine della campagna',
  'web.tools.utm.field.term.help': 'Facoltativo. Tradizionalmente la parola chiave a pagamento.',
  'web.tools.utm.field.content.label': 'Contenuto della campagna',
  'web.tools.utm.field.content.help':
    'Facoltativo. Distingue due link alla stessa pagina, ad esempio due versioni di un post.',
  'web.tools.utm.result.title': 'Il tuo URL taggato',
  'web.tools.utm.result.empty': 'Inserisci un URL di destinazione per vedere il risultato.',
  'web.tools.utm.result.label': 'URL composto',
  'web.tools.utm.result.preserved':
    "La query string già presente nel tuo URL viene mantenuta esattamente come l'hai digitata.",
  'web.tools.utm.result.replaced':
    'Il tuo URL portava già uno di questi parametri. Il valore che hai inserito qui lo sostituisce.',
  'web.tools.utm.faq.encoding.q': 'Cosa succede a spazi e accenti?',
  'web.tools.utm.faq.encoding.a':
    "Vengono codificati in percentuale, il che è ciò che permette a un link di sopravvivere quando viene incollato in un post. Uno spazio diventa un segno più e una lettera accentata diventa la sua forma codificata, e gli strumenti di analisi decodificano entrambi.",
  'web.tools.utm.faq.existing.q': 'Rompe un URL che ha già dei parametri?',
  'web.tools.utm.faq.existing.a':
    "No. I parametri esistenti vengono conservati nel loro ordine originale, e viene aggiunto o sostituito solo un parametro UTM che hai compilato. Un frammento alla fine dell'URL resta alla fine.",
  'web.tools.utm.faq.privacy.q': 'Il mio URL viene inviato da qualche parte?',
  'web.tools.utm.faq.privacy.a': "No. L'URL viene composto nel tuo browser e non lascia mai questa pagina.",

  /* ---------------------------------------------------------------------- */
  /* YouTube title length checker                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'Controllo della lunghezza dei titoli YouTube',
  'web.tools.youtubeTitle.lede':
    'Un titolo lungo un carattere di troppo viene rifiutato al caricamento. Un titolo semplicemente lungo viene tagliato in un punto che non hai scelto.',
  'web.tools.youtubeTitle.explainer.title': 'Due limiti diversi',
  'web.tools.youtubeTitle.explainer.body':
    "Il limite rigido è ciò che l'endpoint di caricamento accetta. Dove viene mostrato un titolo è una questione separata: un risultato di ricerca, una barra laterale e un telefono tagliano tutti un titolo in un punto diverso, e nessuno di quei punti di taglio è pubblicato. Questo strumento indica il limite documentato e mostra la forma del tuo titolo, e non inventa un numero di troncamento.",
  'web.tools.youtubeTitle.field.title.label': 'Titolo del video',
  'web.tools.youtubeTitle.field.title.help': 'Contato per grafema, quindi una emoji costa uno.',
  'web.tools.youtubeTitle.result.count': '{count} di {limit} caratteri',
  'web.tools.youtubeTitle.result.over':
    'Oltre di {over, plural, one {# carattere} many {# caratteri} other {# caratteri}}. Il caricamento verrebbe rifiutato.',
  'web.tools.youtubeTitle.result.fits': 'Entro il limite documentato.',
  'web.tools.youtubeTitle.result.front':
    'I primi {count} caratteri portano il peso maggiore, perché è circa lo spazio che ha un layout stretto. I tuoi iniziano: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'Il limite del titolo non è disponibile in questa build, quindi qui non viene controllato nulla.',
  'web.tools.youtubeTitle.faq.limit.q': 'Da dove viene il limite?',
  'web.tools.youtubeTitle.faq.limit.a':
    "Dal riferimento ufficiale videos insert, generato in questa pagina dallo stesso codice dei connettori che userebbe il nostro caricatore. La data in cui una persona ha letto per l'ultima volta quella pagina è mostrata accanto al numero.",
  'web.tools.youtubeTitle.faq.truncation.q': 'Dove esattamente YouTube taglia un titolo?',
  'web.tools.youtubeTitle.faq.truncation.a':
    "Dipende dalla superficie e dal viewport, e YouTube non pubblica un conteggio di caratteri per questo. Mostriamo il limite, che è documentato, e non stampiamo un numero di taglio che sarebbe un'ipotesi.",
  'web.tools.youtubeTitle.faq.emoji.q': 'Una emoji conta come un carattere?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'In questo contatore sì, perché contiamo i grafemi. Una piattaforma che conta internamente le unità di codice può addebitare di più per la stessa emoji, motivo per cui il controllo preflight applica separatamente la regola di ciascuna piattaforma.',

  /* ---------------------------------------------------------------------- */
  /* Time zone and daylight saving planner                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'Pianificatore di fusi orari e ora legale',
  'web.tools.timeZone.lede':
    "Uno slot settimanale che sembra stabile nel tuo calendario si sposta per metà del tuo pubblico due volte l'anno. Questo mostra dove e quando.",
  'web.tools.timeZone.explainer.title': 'Perché un orario locale fisso non è un orario fisso',
  'web.tools.timeZone.explainer.body':
    'Un orario significa qualcosa solo con un fuso associato. I fusi cambiano il loro scarto in date che differiscono per paese, e due regioni distanti cinque ore a gennaio possono essere distanti quattro ore ad aprile. Una programmazione memorizzata come istante più fuso sopravvive a questo. Una programmazione memorizzata come ora locale no.',
  'web.tools.timeZone.field.date.label': 'Data',
  'web.tools.timeZone.field.time.label': 'Ora',
  'web.tools.timeZone.field.zone.label': 'Il tuo fuso',
  'web.tools.timeZone.field.audience.label': 'Fusi del pubblico',
  'web.tools.timeZone.field.audience.help': 'Scegli i fusi in cui si trovano davvero i tuoi lettori.',
  'web.tools.timeZone.result.title': 'Lo stesso momento, ovunque tu abbia scelto',
  'web.tools.timeZone.result.empty': 'Scegli almeno un fuso del pubblico.',
  'web.tools.timeZone.result.shift':
    "Un cambio d'ora legale cade tra questa data e lo stesso giorno della settimana quattro settimane dopo, quindi l'ora locale si sposta.",
  'web.tools.timeZone.result.stable': 'Nessun cambio di scarto nelle prossime quattro settimane.',
  'web.tools.timeZone.result.later': 'Quattro settimane dopo, {time}.',
  'web.tools.timeZone.result.invalidDate': 'Inserisci una data e un orario per vedere il confronto.',
  'web.tools.timeZone.faq.dst.q': "In che direzione si sposta l'ora?",
  'web.tools.timeZone.faq.dst.a':
    "Dipende dal fuso e dalla direzione del cambio, motivo per cui la tabella mostra l'orario locale effettivo tra quattro settimane invece di descrivere la regola. Lo scarto per ciascun fuso viene letto dal database dei fusi orari del tuo browser.",
  'web.tools.timeZone.faq.storage.q': 'Come dovrebbe memorizzare il suo orario un post programmato?',
  'web.tools.timeZone.faq.storage.a':
    "Come un istante più il fuso IANA scelto dalla persona, mai come un'ora locale ingenua. È quello che facciamo internamente, ed è il motivo per cui un post programmato prima di un cambio d'ora atterra comunque all'ora locale prevista.",

  /* ---------------------------------------------------------------------- */
  /* Engagement rate calculator                                              */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': 'Calcolatore del tasso di coinvolgimento',
  'web.tools.engagementRate.lede':
    'Digita i numeri che la tua dashboard ti mostra già. Questo li divide in tre modi e si ferma lì: nessun parametro di riferimento, nessuna soglia "buona", niente che non abbiamo davvero.',
  'web.tools.engagementRate.explainer.title': 'Perché tre denominatori, non uno',
  'web.tools.engagementRate.explainer.body':
    'Copertura, follower e impression rispondono a domande diverse. Il tasso per copertura ti dice come hanno risposto le persone che hanno effettivamente visto il post. Il tasso per follower ti dice quale quota del tuo pubblico si è coinvolta, indipendentemente dal fatto che il post abbia raggiunto tutti. Il tasso per impression conta ogni visualizzazione, incluse le ripetizioni. Confrontare un tasso calcolato in un modo con uno calcolato in un altro è una fonte comune di un numero di coinvolgimento che sembra sbagliato.',
  'web.tools.engagementRate.field.interactions.label': 'Interazioni',
  'web.tools.engagementRate.field.interactions.help':
    'Mi piace, commenti, condivisioni e salvataggi sommati insieme, dal post che stai misurando.',
  'web.tools.engagementRate.field.reach.label': 'Copertura',
  'web.tools.engagementRate.field.reach.help': 'Account che hanno visto il post almeno una volta.',
  'web.tools.engagementRate.field.followers.label': 'Follower',
  'web.tools.engagementRate.field.followers.help': "La dimensione dell'account al momento del post.",
  'web.tools.engagementRate.field.impressions.label': 'Impression',
  'web.tools.engagementRate.field.impressions.help':
    'Visualizzazioni totali, incluse quelle di una persona che lo ha visto due volte.',
  'web.tools.engagementRate.result.title': 'Tasso di coinvolgimento, in tre modi',
  'web.tools.engagementRate.result.empty': 'non disponibile',
  'web.tools.engagementRate.result.note':
    "Non esiste un buon tasso universale con cui confrontare. Dipende da piattaforma, formato, dimensione del pubblico e settore, e qualsiasi numero singolo offerto come parametro di riferimento è un'ipotesi travestita da dato.",
  'web.tools.engagementRate.basis.reach': 'Per copertura',
  'web.tools.engagementRate.basis.followers': 'Per follower',
  'web.tools.engagementRate.basis.impressions': 'Per impression',
  'web.tools.engagementRate.faq.formula.q': 'Qual è la formula effettiva?',
  'web.tools.engagementRate.faq.formula.a':
    'Interazioni divise per il denominatore che scegli, mostrate come percentuale. Interazioni qui significa mi piace, commenti, condivisioni e salvataggi sommati insieme; alcune piattaforme li riportano separatamente, nel qual caso sommali tu prima di digitare il totale.',
  'web.tools.engagementRate.faq.basis.q': 'Quale denominatore dovrei usare?',
  'web.tools.engagementRate.faq.basis.a':
    'Quello che la tua piattaforma riporta insieme al post, così i due numeri provengono dalla stessa finestra di misurazione. Confrontare un tasso per copertura su un post con un tasso per follower su un altro non è un confronto equo anche se entrambi sono chiamati tasso di coinvolgimento.',
} as const;
