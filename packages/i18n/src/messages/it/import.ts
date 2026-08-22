/**
 * Bulk CSV import.
 *
 * Two groups of strings. The `import.error.*` keys are the ones the parser and
 * the apply step emit: they are stored on a row, rendered in the report and
 * written into the downloadable CSV, so they have to make sense to someone
 * reading a spreadsheet rather than a screen. Everything else is the wizard.
 *
 * The copy says drafts wherever drafts are what happens, and it says schedule
 * only on the step where a person chooses it. Nothing here promises that a post
 * reaches a platform.
 */
export const importMessages = {
  'import.title': 'Importa post da un CSV',
  'import.subtitle':
    'Carica un foglio di calcolo, leggi cosa farà, poi decidi. Il caricamento controlla il file. Non crea nulla.',

  'import.step.upload': 'Carica',
  'import.step.columns': 'Colonne',
  'import.step.review': 'Revisione',
  'import.step.apply': 'Applica',
  'import.step.results': 'Risultati',
  'import.step.position': 'Passaggio {current} di {total}',

  'import.upload.heading': 'Scegli un file CSV',
  'import.upload.help':
    'Solo CSV. I file di foglio di calcolo come .xlsx non vengono letti. Esporta prima il tuo foglio come CSV.',
  'import.upload.field': 'File CSV',
  'import.upload.fieldHelp': 'Seleziona un file, oppure incolla le righe nel riquadro qui sotto.',
  'import.upload.paste': 'Oppure incolla il testo CSV',
  'import.upload.pasteHelp':
    'Includi la riga di intestazione. Tutto viene controllato prima che venga creato qualcosa.',
  'import.upload.project': 'Marchio',
  'import.upload.projectHelp': 'Ogni riga in un file appartiene a questo marchio.',
  'import.upload.submit': 'Controlla questo file',
  'import.upload.submitting': 'Lettura del file in corso',
  'import.upload.allowPast': 'Consenti orari già passati',
  'import.upload.allowPastHelp':
    'Disattivato per impostazione predefinita. Una riga datata nel passato viene segnalata così puoi correggerla, invece di essere spostata al posto tuo.',
  'import.upload.tooLarge': 'Quel file supera {limit} caratteri. Dividilo e riprova.',
  'import.upload.duplicate':
    "Questo è lo stesso file che hai caricato in precedenza, quindi stai visualizzando quell'importazione anziché una seconda copia.",

  'import.template.heading': 'Cosa significano le colonne',
  'import.template.download': 'Scarica un CSV modello',
  'import.template.required': 'Colonne obbligatorie',
  'import.template.optional': 'Colonne facoltative',
  'import.column.external_row_id':
    "Il tuo id per la riga. Deve essere univoco all'interno del file.",
  'import.column.project': "Il nome o l'id del marchio a cui appartiene la riga.",
  'import.column.targets':
    'Set: seguito da un id di set di destinazione, oppure id di account separati da una barra verticale.',
  'import.column.caption': 'Il testo del post.',
  'import.column.scheduled_local_time': 'Data e ora locali, scritte come 2026-09-01T10:00.',
  'import.column.time_zone':
    "Il fuso IANA in cui viene letta quell'ora locale, ad esempio Europe/Berlin.",
  'import.column.media':
    'Un id media, sha256: seguito dal checksum di un media che possiedi già, oppure un indirizzo https da cui il server deve recuperarlo.',
  'import.column.title': 'Un titolo, dove la destinazione ne usa uno.',
  'import.column.destination': "La pagina, la bacheca o il canale all'interno dell'account.",
  'import.column.privacy': 'Il valore di privacy atteso dalla destinazione.',
  'import.column.first_comment': 'Testo pubblicato come primo commento dopo il post.',
  'import.column.approval_policy': 'La politica di approvazione da collegare a ciascuna bozza.',
  'import.column.perPlatform':
    'Una colonna caption_ o title_ con il nome di una piattaforma sovrascrive solo quella piattaforma, ad esempio caption_instagram.',

  'import.columns.heading': 'Controllo delle colonne',
  'import.columns.ok': 'Ogni colonna obbligatoria è presente.',
  'import.columns.missing':
    '{count, plural, one {# colonna obbligatoria manca} many {# colonne obbligatorie mancano} other {# colonne obbligatorie mancano}}',
  'import.columns.unknown':
    '{count, plural, one {# colonna non è stata riconosciuta ed è ignorata} many {# colonne non sono state riconosciute e sono ignorate} other {# colonne non sono state riconosciute e sono ignorate}}',
  'import.columns.present': 'Colonne trovate',

  'import.review.heading': 'Cosa farà questo file',
  'import.review.counts':
    '{valid, plural, =0 {Nessuna riga è pronta} one {# riga è pronta} many {# righe sono pronte} other {# righe sono pronte}}, {invalid, plural, =0 {nessuna richiede attenzione} one {# richiede attenzione} many {# richiedono attenzione} other {# richiedono attenzione}}.',
  'import.review.empty': 'Nessuna riga è stata letta da questo file.',
  'import.review.rowsHeading': 'Righe',
  'import.review.filterAll': 'Tutte le righe',
  'import.review.filterValid': 'Pronte',
  'import.review.filterInvalid': 'Richiedono attenzione',
  'import.review.filterFailed': 'Fallite',
  'import.review.downloadErrors': 'Scarica i problemi come CSV',
  'import.review.parsedWith': 'Letto con il parser {version}',

  'import.table.row': 'Id riga',
  'import.table.line': 'Riga',
  'import.table.state': 'Stato',
  'import.table.caption': 'Testo',
  'import.table.time': 'Programmato',
  'import.table.problems': 'Problemi',
  'import.table.draft': 'Bozza',
  'import.table.noProblems': 'Nessuno',

  'import.state.pending': 'Non controllato',
  'import.state.valid': 'Pronto',
  'import.state.invalid': 'Richiede attenzione',
  'import.state.applied': 'Bozza creata',
  'import.state.skipped': 'Già fatto',
  'import.state.failed': 'Fallito',

  'import.job.state.uploaded': 'Caricato',
  'import.job.state.validating': 'Controllo in corso',
  'import.job.state.validated': 'Controllato',
  'import.job.state.applying': 'Applicazione in corso',
  'import.job.state.applied': 'Applicato',
  'import.job.state.failed': 'Non è stato possibile leggerlo',

  'import.apply.heading': 'Cosa deve succedere alle righe pronte?',
  'import.apply.drafts': 'Crea bozze',
  'import.apply.draftsHelp':
    "L'impostazione predefinita. Ogni riga pronta diventa una bozza che puoi aprire, modificare e approvare. Niente viene programmato.",
  'import.apply.scheduled': 'Crea bozze e programmale',
  'import.apply.scheduledHelp':
    "Ogni riga pronta diventa una bozza e prende l'orario scritto nel file. Scegli questa opzione solo se gli orari sono corretti.",
  'import.apply.confirm': 'Applica {count, plural, one {# riga} many {# righe} other {# righe}}',
  'import.apply.confirmScheduled':
    'Crea e programma {count, plural, one {# riga} many {# righe} other {# righe}}',
  'import.apply.running': 'Applicazione delle righe in corso',
  'import.apply.safeToRepeat':
    'Applicare due volte è sicuro. Una riga che ha già creato una bozza viene lasciata invariata.',

  'import.results.heading': 'Risultati',
  'import.results.applied':
    '{count, plural, one {# bozza creata} many {# bozze create} other {# bozze create}}',
  'import.results.skipped':
    '{count, plural, one {# riga era già stata fatta} many {# righe erano già state fatte} other {# righe erano già state fatte}}',
  'import.results.failed':
    '{count, plural, one {# riga fallita} many {# righe fallite} other {# righe fallite}}',
  'import.results.retry': 'Applica di nuovo le righe rimanenti',
  'import.results.openDrafts': 'Apri le bozze',
  'import.results.unavailable': 'non disponibile',

  'import.history.heading': 'Importazioni precedenti',
  'import.history.empty': 'Ancora nessuna importazione.',
  'import.history.open': 'Apri',

  'import.a11y.rowsTable': 'Righe del manifest e i loro problemi',
  'import.a11y.stepList': "Passaggi dell'importazione",
  'import.a11y.uploadedFile': 'File selezionato: {filename}',

  'import.error.emptyFile': 'Quel file non contiene righe.',
  'import.error.missingColumn': 'La colonna {column} è mancante.',
  'import.error.unknownColumn':
    'La colonna {column} non è stata riconosciuta, quindi viene ignorata.',
  'import.error.duplicateRowId': "L'id riga {value} è usato più di una volta in questo file.",
  'import.error.required': 'Questa cella non può essere vuota.',
  'import.error.invalidCell': 'Questa cella non è in un formato che possiamo leggere.',
  'import.error.rowShape': "Questa riga ha {actual} celle ma l'intestazione ne ha {expected}.",
  'import.error.invalidLocalTime':
    "L'orario {value} non è una data e ora locale come 2026-09-01T10:00.",
  'import.error.invalidTimeZone': 'Il fuso {value} non è un nome di fuso orario IANA.',
  'import.error.nonexistentLocalTime':
    "L'orario {value} non esiste in {zone}. Le lancette lo saltano.",
  'import.error.ambiguousLocalTime':
    "L'orario {value} si verifica due volte in {zone} in quel giorno. Scegli un orario diverso.",
  'import.error.scheduleInPast': "L'orario {value} in {zone} è già passato.",
  'import.error.invalidTargets':
    'Il valore {value} non è un set di destinazione salvato né un elenco di id account.',
  'import.error.invalidMedia':
    'Il valore {value} non è un id media, un checksum sha256 o un indirizzo https.',
  'import.error.mediaNotFound': "Nessun media in quest'area di lavoro corrisponde a {value}.",
  'import.error.mediaImportStarted':
    'Il media a {value} è in fase di recupero. Applica di nuovo questo file una volta che sarà nella libreria.',
  'import.error.unknownVariantTarget':
    'Questa riga non ha un account {provider}, quindi il testo per {provider} non è stato usato.',
  'import.error.applyFailed': 'Non è stato possibile applicare questa riga. Riferimento: {code}.',
  'import.error.alreadyApplied':
    'Questa riga ha già creato una bozza, quindi è stata lasciata invariata.',
  'import.error.tooManyRows': 'Vengono lette solo le prime {limit} righe di un file.',
} as const;
