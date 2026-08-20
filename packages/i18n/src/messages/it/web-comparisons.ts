/**
 * The comparison pages' chrome.
 *
 * What belongs here: state words, section headings, labels, and the three
 * disclosure sentences whose numbers are read at render time from the code
 * that decides them. What deliberately does not: the claims themselves. A
 * comparison table is several hundred words of dated, sourced content per
 * page, and the English catalog is merged into one object that every page load
 * resolves, so those claims live in typed modules under
 * `apps/web/src/features/comparisons/entries` and are loaded per slug.
 *
 * The `web.compare.*` namespace is the older `/compare` index. This namespace
 * is the per comparison page, kept separate so the index copy that beta locales
 * already carry is not disturbed.
 */
export const webComparisonMessages = {
  'web.comparison.eyebrow': 'Confronto',

  'web.comparison.state.yes': 'Sì',
  'web.comparison.state.no': 'No',
  'web.comparison.state.partial': 'In parte',
  'web.comparison.state.notVerified': 'Non verificato',

  'web.comparison.label.claim': 'Affermazione',
  'web.comparison.label.sourceRead': 'Letto il {date}',
  'web.comparison.label.checked': 'Ogni riga verificata il {date}',
  'web.comparison.label.nextReview': 'Prossimo controllo previsto per il {date}',
  'web.comparison.label.backToIndex': 'Tutti i confronti',

  'web.comparison.table.title': 'Cosa fa ciascuna opzione',
  'web.comparison.table.caption': 'Una affermazione per riga, con la fonte dietro ogni risposta',

  'web.comparison.bestFor.title': 'Quale si adatta',
  'web.comparison.bestFor.ours': 'Scegli questo prodotto quando',
  'web.comparison.bestFor.alternative': 'Scegli {name} quando',

  'web.comparison.notDo.title': 'Cosa non fa questo prodotto',
  'web.comparison.notDo.body':
    'Queste frasi sono lette dal codice che le determina, non digitate a mano, quindi questa sezione non può allontanarsi da ciò che il prodotto è davvero oggi.',
  'web.comparison.disclosure.connectors':
    "{count, plural, =0 {Nessun connettore ha completato la verifica del provider, quindi oggi niente viene pubblicato su nessuna piattaforma tramite questo prodotto.} one {# connettore ha completato la verifica del provider. Ogni altra piattaforma del gruppo di lancio è ancora un'intenzione.} many {# connettori hanno completato la verifica del provider. Ogni altra piattaforma del gruppo di lancio è ancora un'intenzione.} other {# connettori hanno completato la verifica del provider. Ogni altra piattaforma del gruppo di lancio è ancora un'intenzione.}}",
  'web.comparison.disclosure.locales':
    "{count, plural, =0 {Nessuna lingua ha completato la revisione umana, quindi ogni lingua dell'interfaccia è etichettata come beta.} one {# lingua ha completato la revisione umana. Ogni altra lingua è etichettata come beta.} many {# lingue hanno completato la revisione umana. Ogni altra lingua è etichettata come beta.} other {# lingue hanno completato la revisione umana. Ogni altra lingua è etichettata come beta.}}",
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Ogni livello di prezzo è stato deciso e ha un prezzo reale.} one {# livello di prezzo è ancora un segnaposto non deciso e non può essere acquistato.} many {# livelli di prezzo sono ancora segnaposto non decisi e non possono essere acquistati.} other {# livelli di prezzo sono ancora segnaposto non decisi e non possono essere acquistati.}}',

  'web.comparison.notVerified.title': 'Cosa significa non verificato',
  'web.comparison.notVerified.body':
    "Una cella indica non verificato quando il fatto non ha potuto essere letto nella documentazione pubblica ufficiale dell'altra opzione nel giorno del controllo. Non viene mai compilata a memoria, e mai copiata da un riassunto scritto da qualcun altro.",

  'web.comparison.method.title': 'Come è realizzata questa pagina',
  'web.comparison.method.body':
    'Ogni riga è una affermazione, con il documento da cui proviene e la data in cui una persona lo ha letto. Non ci sono screenshot dei concorrenti, nessuna formulazione di funzionalità copiata e nessuna debolezza inventata.',
  'web.comparison.method.cadence':
    "Ogni confronto viene ricontrollato almeno una volta ogni 90 giorni, e immediatamente quando una piattaforma o un'opzione cambia qualcosa che una riga afferma.",

  'web.comparison.questions.title': 'Domande',
  'web.comparison.sources.title': 'Fonti citate in questa pagina',

  'web.comparison.index.title': 'Confronti pubblicati',
  'web.comparison.index.body':
    'Ogni pagina confronta questo prodotto con una categoria di alternative i cui fatti possono essere letti dalla documentazione ufficiale. Un prodotto nominato ottiene una pagina quando i suoi fatti attuali possono essere letti dalle sue stesse pagine pubbliche, e non prima.',
  'web.comparison.index.checked': 'Verificato il {date}',
} as const;
