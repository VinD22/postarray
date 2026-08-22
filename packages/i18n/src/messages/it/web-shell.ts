/**
 * The web application shell: Home, the command palette, the Action center
 * queue chrome, the demo data notice, and the parts of sign in and onboarding
 * that the shared `auth`, `onboarding` and `billing` catalogs do not cover.
 *
 * Owned by the web shell. Screen catalogs (composer, calendar, analytics)
 * belong to their own files.
 */
export const webShellMessages = {
  /* -- Document and shell chrome ----------------------------------------- */
  'shell.appName': 'Relay',
  'shell.documentTitle': '{page} · Relay',
  'shell.tagline': 'Un desk editoriale per persone e agenti.',
  'shell.menu.open': 'Apri il menù',
  'shell.menu.title': 'Menù',
  'shell.nav.more': 'Di più',
  'shell.help.title': 'Aiuto',
  'shell.help.documentation': 'Documentazione',
  'shell.help.keyboardShortcuts': 'Scorciatoie da tastiera',
  'shell.help.platformStatus': 'Stato della piattaforma',
  'shell.help.whatChanged': 'Cosa è cambiato',
  'shell.help.contactSupport': "Contatta l'assistenza",
  'shell.account.settings': 'Impostazioni',
  'shell.account.profile': 'Il tuo profilo',
  'shell.workspace.create': 'Crea uno spazio di lavoro',
  'shell.workspace.manage': 'Impostazioni Workspace',
  'shell.workspace.role': 'Qui sei {role}',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Dati dimostrativi',
  'shell.demo.title': 'Stai guardando i dati demo',
  'shell.demo.body':
    "L'API Relay non è raggiungibile da questo browser, quindi le schermate vengono riempite con un'area di lavoro di esempio seminata. Niente qui è collegato ad un conto reale e niente può essere pubblicato.",
  'shell.demo.howToConnect':
    "Imposta NEXT_PUBLIC_RELAY_API_URL e riavvia l'app per utilizzare i dati in tempo reale.",

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Sei offline',
  'shell.offline.body':
    'Le bozze vengono conservate su questo dispositivo. La pianificazione e la pubblicazione riprendono al ripristino della connessione.',
  'shell.offline.retry': 'Controlla la connessione',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Apri la tavolozza dei comandi',
  'palette.title': 'Tavolozza dei comandi',
  'palette.description': "Cerca una schermata, un account o un'azione.",
  'palette.placeholder': 'Digita un comando o un nome visualizzato',
  'palette.empty': 'Niente corrisponde a {query}.',
  'palette.group.actions': 'Azioni',
  'palette.group.goTo': 'Vai a',
  'palette.group.workspaces': 'Workspaces',
  'palette.group.settings': 'Impostazioni',
  'palette.hint.navigate': 'Muoversi con i tasti freccia',
  'palette.hint.select': 'Apri con Invio',
  'palette.hint.close': 'Chiudi con Escape',
  'palette.action.compose': 'Scrivi un post',
  'palette.action.connectAccount': 'Collega un account',
  'palette.action.openActionCenter': 'Apri il centro operativo',
  'palette.action.uploadMedia': 'Carica contenuti multimediali',
  'palette.action.createRule': 'Crea una regola di automazione',
  'palette.action.toggleTheme': 'Cambia il tema',
  'palette.action.signOut': 'Esci',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Apri il centro operativo',
  'actionCenter.group.now.label': 'Ora',
  'actionCenter.group.soon.label': 'Presto',
  'actionCenter.group.watching.label': 'Guardando',
  'actionCenter.group.now.hint':
    'La pubblicazione è a rischio finché questi problemi non verranno gestiti.',
  'actionCenter.group.soon.hint': 'Questi hanno una scadenza che puoi ancora rispettare.',
  'actionCenter.group.watching.hint':
    "Non urgente. Vale la pena dare un'occhiata questa settimana.",
  'actionCenter.severity.now': 'Ha bisogno di te adesso',
  'actionCenter.severity.soon': 'Ha bisogno di te presto',
  'actionCenter.severity.watching': 'Guardando',
  'actionCenter.filter.all': 'Tutto',
  'actionCenter.filter.connections': 'Connessioni',
  'actionCenter.filter.publishing': 'Editoria',
  'actionCenter.filter.automation': 'Automazione',
  'actionCenter.filter.billing': 'Fatturazione',
  'actionCenter.snoozed': 'Posticipato',
  'actionCenter.snoozeOneDay': 'Posticipa per un giorno',
  'actionCenter.snoozedUntil': 'Posticipato fino a {date}',
  'actionCenter.unsnooze': 'Riporta questo indietro',
  'actionCenter.resolved': 'Risolto {relativeTime}',
  'actionCenter.emptyFiltered': 'Niente in questo gruppo ha bisogno di attenzione.',
  'actionCenter.errorTitle': 'Impossibile caricare il centro operativo',
  'actionCenter.loading': 'Caricamento di ciò che richiede attenzione',
  'actionCenter.affectedAccount': 'Colpisce {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Niente richiede attenzione} one {# elemento} many {# elementi} other {# elementi}}',
  'actionCenter.action.reconnect': 'Riconnettiti',
  'actionCenter.action.openReceipt': 'Apri la ricevuta',
  'actionCenter.action.review': 'Recensione',
  'actionCenter.action.openDraft': 'Apri la bozza',
  'actionCenter.action.openCalendar': 'Apri il calendario',
  'actionCenter.action.viewStatus': 'Visualizza lo stato',
  'actionCenter.action.checkFeed': 'Controlla il feed',
  'actionCenter.action.inspectDeliveries': 'Ispezionare le consegne',
  'actionCenter.action.addBalance': "Esaminare l'utilizzo",
  'actionCenter.action.fixConnection': 'Correggi la connessione',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Casa',
  'home.subtitle': 'Cosa ha bisogno di te oggi e cosa accadrà dopo.',
  'home.greetingSummary':
    '{actions, plural, =0 {Niente ha bisogno di te in questo momento} one {# articolo ha bisogno di te} many {# articoli hanno bisogno di te} other {# articoli hanno bisogno di te}}. {upcoming, plural, =0 {Non è previsto nulla nelle prossime 24 ore} one {# post uscirà nelle prossime 24 ore} many {# post uscirà nelle prossime 24 ore} other {# post uscirà nelle prossime 24 ore}}.',
  'home.needsYou.title': 'Ha bisogno di te adesso',
  'home.needsYou.empty': 'Niente ha bisogno di te in questo momento.',
  'home.needsYou.emptyQuiet':
    'Goditi la tranquillità. Tutto ciò che richiede una decisione appare qui non appena accade.',
  'home.needsYou.emptyBody':
    'Lo stato della connessione, le approvazioni e le pubblicazioni non riuscite vengono visualizzate qui nel momento in cui si verificano.',
  'home.needsYou.viewAll': 'Apri il centro operativo',
  'home.upcoming.title': 'Le prossime 24 ore',
  'home.upcoming.empty': 'Non è previsto nulla nelle prossime 24 ore.',
  'home.upcoming.emptyBody': 'Scrivi un post e scegli un orario. Puoi cambiarlo più tardi.',
  'home.upcoming.viewAll': 'Apri il calendario',
  'home.upcoming.timeZoneNote':
    "I tempi vengono visualizzati in {timeZone}, la zona dell'area di lavoro.",
  'home.upcoming.columnTime': 'Tempo',
  'home.upcoming.columnAccount': 'Conto',
  'home.upcoming.columnContent': 'Contenuto',
  'home.upcoming.columnStatus': 'Stato',
  'home.receipts.title': 'Incassi recenti',
  'home.receipts.empty': "Nessun post è stato ancora pubblicato da quest'area di lavoro.",
  'home.receipts.emptyBody':
    'Ogni pubblicazione produce una ricevuta che puoi visionare e condividere.',
  'home.receipts.viewAll': 'Tutte le ricevute',
  'home.receipts.publishedTo': 'Pubblicato su {account}',
  'home.connections.title': 'Stato della connessione',
  'home.connections.summary':
    '{healthy, plural, one {# account funziona} many {# account funzionano} other {# account funzionano}}. {attention, plural, =0 {Nessuno richiede attenzione} one {# richiede attenzione} many {# richiede attenzione} other {# richiede attenzione}}.',
  'home.connections.viewAll': 'Tutte le connessioni',
  'home.connections.empty': 'Nessun account ancora collegato.',
  'home.advisor.title': 'Consulente per la crescita',
  'home.advisor.summary':
    'La versione del piano {version} è stata approvata {date}. La settimana {week} di {total} ha {briefs, plural, one {# brief non ancora redatto} many {# brief non ancora redatto} other {# brief non ancora redatto}}.',
  'home.advisor.noPlan':
    'Il consulente costruisce un piano partendo dai fatti che confermi. Propone lavori e non pubblica mai per conto proprio.',
  'home.advisor.openPlan': 'Apri il piano',
  'home.advisor.createDrafts': 'Crea bozze dalla settimana {week}',
  'home.advisor.start': 'Avvia il profilo aziendale',
  'home.trial.banner':
    'Prova, {days, plural, =0 {termina oggi} one {# giorno rimasto} many {# giorni rimasti} other {# giorni rimasti}}. Converte {date} in {amount}.',
  'home.trial.manage': 'Gestisci o annulla',
  'home.error.title': 'Impossibile caricare la casa',
  'home.error.body':
    "Il tuo spazio di lavoro è intatto. Si tratta di un problema nel raggiungimento dell'API Relay.",

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title': 'Pubblica tramite API ufficiali e guarda esattamente cosa è successo.',
  'auth.aside.point.receipts':
    "Ogni pubblicazione produce una ricevuta: chi l'ha approvata, quando è stata spedita, cosa ha restituito la piattaforma.",
  'auth.aside.point.approvals':
    "Niente raggiunge una piattaforma senza l'approvazione richiesta dalla tua politica.",
  'auth.aside.point.surfaces':
    "Lo stesso flusso di lavoro dall'app Web, dall'API REST, da MCP, dalla CLI e dai webhook.",
  'auth.provider.title': 'Prima di continuare',
  'auth.provider.google.access':
    'Google condivide il tuo nome, indirizzo email e immagine del profilo con Relay. Relay non può leggere Gmail, Drive o Calendar.',
  'auth.provider.facebook.access':
    'Facebook condivide il tuo nome, indirizzo email e immagine del profilo con Relay. Collegare una Pagina su cui pubblicare è un passaggio separato che approverai in seguito.',
  'auth.provider.note': 'Questo ti fa accedere. Non collega un account su cui pubblicare.',
  'auth.continueWithEmail': "Continua con l'e-mail",
  'auth.method.password': "Parola d'ordine",
  'auth.method.magicLink': 'Collegamento e-mail',
  'auth.method.username': 'Nome utente',
  'auth.method.chooseLabel': 'Come vuoi accedere?',
  'auth.username.placeholder': 'il tuo nome utente',
  'auth.username.aliasNote':
    "Un nome utente è un alias per l'indirizzo email sul tuo account. La password è la stessa.",
  'auth.password.placeholder': 'La tua password',
  'auth.submit.signIn': 'Accedi',
  'auth.submit.signUp': 'Crea un account',
  'auth.submit.working': 'Controllo',
  'auth.failure.credentials':
    "L'indirizzo email e la password non corrispondono a un account. Controllali entrambi e riprova.",
  'auth.failure.usernameCredentials':
    'Il nome utente e la password non corrispondono a un account. Controllali entrambi e riprova.',
  'auth.failure.noAccountLeak': 'Per la tua sicurezza non diciamo se un indirizzo è registrato.',
  'auth.failure.provider':
    "L'accesso con {provider} non è stato completato. Niente è stato cambiato.",
  'auth.failure.network':
    'Non siamo riusciti a raggiungere Relay. Controlla la connessione e riprova.',
  'auth.signUp.trialNote':
    'Sette giorni interi di prova. È richiesto un metodo di pagamento. $ 0 con scadenza oggi.',
  'auth.signUp.emailInUseNote':
    'Se questo indirizzo dispone già di un account, invieremo via email un collegamento di accesso invece di crearne un secondo.',
  'auth.legal.readTerms': 'Leggi i Termini',
  'auth.legal.readPrivacy': "Leggi l'Informativa sulla Privacy",
  'auth.switchToSignUp': 'Crea un account',
  'auth.switchToSignIn': 'Accedi invece',
  'auth.checkEmail.body':
    'Abbiamo inviato un collegamento di accesso a {email}. Funziona una volta.',
  'auth.checkEmail.wrongAddress': 'Utilizza un indirizzo diverso',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Fatturazione',
  'onboarding.stepName.workspace': 'Workspace',
  'onboarding.stepName.role': "Caso d'uso",
  'onboarding.stepName.connect': 'Connettiti',
  'onboarding.stepName.compose': 'Primo articolo',
  'onboarding.stepName.receipt': 'Conferma',
  'onboarding.stepList': 'Passaggi di configurazione',
  'onboarding.stepComplete': 'Fatto',
  'onboarding.stepCurrent': 'Passaggio attuale',
  'onboarding.exit': 'Finisci più tardi',
  'onboarding.plan.intervalMonthlyLabel': '$ 29 al mese',
  'onboarding.plan.intervalAnnualLabel': "$ 300 all'anno",
  'onboarding.plan.checkoutHint':
    "La schermata successiva è Polar, il nostro commerciante registrato. L'accesso viene concesso quando Polar conferma l'abbonamento, non quando il browser si ripristina.",
  'onboarding.plan.factsTitle': 'Cosa succede se continui?',
  'onboarding.workspace.help':
    'Uno spazio di lavoro contiene i tuoi progetti, account collegati, bozze e ricevute. Puoi crearne altri in seguito.',
  'onboarding.workspace.localeNote':
    "La lingua dell'interfaccia cambia questa app. Le lingue dei contenuti vengono scelte per post e sono separate da questa impostazione.",
  'onboarding.workspace.timeZoneDetected': 'Rilevato da questo dispositivo: {timeZone}',
  'onboarding.connect.permissionsTitle': 'Cosa verrà richiesto {provider}',
  'onboarding.connect.permissionsFooter':
    "Relay non richiede mai un'autorizzazione che non utilizza e puoi disconnetterti in qualsiasi momento.",
  'onboarding.connect.chooseProvider': 'Scegli una piattaforma',
  'onboarding.connect.opensProvider': 'Continuando si apre {provider} in questa scheda.',
  'onboarding.compose.help':
    "Scrivi il post, quindi controlla l'anteprima e la convalida prima di scegliere un orario.",
  'onboarding.compose.openComposer': 'Apri il compositore completo',
  'onboarding.receipt.title': 'Il tuo primo post è programmato',
  'onboarding.receipt.body':
    "Ecco il resoconto finora. Continua ad aggiornarsi tramite l'invio, la risposta del fornitore e la prima sincronizzazione dell'analisi.",
  'onboarding.receipt.goHome': 'Vai a casa',
  'onboarding.blocked.title': 'Questo passaggio necessita del precedente',
  'onboarding.blocked.body': 'Completa prima {step}. Niente di ciò che hai inserito è perso.',
} as const;
