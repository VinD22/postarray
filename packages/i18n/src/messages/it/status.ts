/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'Niente di programmato ancora',
  'empty.calendar.body': 'Scrivi il tuo primo post e scegli un orario. Puoi cambiarlo più tardi.',
  'empty.calendar.action': 'Scrivi un post',
  'empty.drafts.title': 'Nessuna bozza',
  'empty.drafts.body':
    'Le bozze salvate vengono visualizzate qui con i relativi obiettivi e problemi.',
  'empty.connections.title': 'Nessun account collegato',
  'empty.connections.body':
    'Collega un account per pubblicare su di esso. Ti mostriamo prima le autorizzazioni esatte.',
  'empty.connections.action': 'Collega un account',
  'empty.analytics.title': 'Nessuna metrica ancora',
  'empty.analytics.body':
    'Le metriche vengono visualizzate dopo che il tuo primo post è rimasto pubblicato abbastanza a lungo da consentire alla piattaforma di segnalarlo.',
  'empty.analytics.noPermission':
    "Questo account non ha concesso l'accesso all'analisi. Riconnettiti per aggiungerlo.",
  'empty.approvals.title': 'Niente ti aspetta',
  'empty.approvals.body':
    'Le richieste di approvazione per i tuoi progetti vengono visualizzate qui.',
  'empty.library.title': 'La tua libreria è vuota',
  'empty.library.body': "Carica immagini e video o importali da un URL o dall'API.",
  'empty.library.action': 'Carica contenuti multimediali',
  'empty.automation.title': 'Nessuna regola ancora',
  'empty.automation.body':
    "Una regola reagisce a qualcosa e propone un'azione. Ogni regola mostra i suoi limiti prima di attivarla.",
  'empty.webhooks.title': 'Nessun endpoint',
  'empty.webhooks.body':
    'Aggiungi un endpoint per ricevere eventi firmati sulla pubblicazione e sulle connessioni.',
  'empty.searchResults.title': 'Nessun risultato per {query}',
  'empty.searchResults.body': "Controlla l'ortografia o cancella un filtro.",
  'empty.filtered.title': 'Niente corrisponde a questi filtri',
  'empty.filtered.action': 'Cancella filtri',
  'empty.auditLog.title': 'Nessuna attività ancora',
  'empty.receipts.title': 'Nessuna ricevuta ancora',
  'empty.receipts.body':
    'Ogni pubblicazione produce una ricevuta che puoi visionare e condividere.',

  'loading.default': 'Caricamento in corso',
  'loading.calendar': 'Caricamento del tuo calendario',
  'loading.analytics': 'Caricamento delle metriche',
  'loading.preview': "Costruire l'anteprima",
  'loading.validating': 'Verifica rispetto ai limiti attuali della piattaforma',
  'loading.publishing': 'Pubblicazione su {provider}',
  'loading.uploading': 'Caricamento di {name}',
  'loading.uploadProgress': '{percent} caricato',
  'loading.connecting': 'Connessione a {provider}',
  'loading.savingDraft': 'Salvataggio della bozza',
  'loading.generatingPlan': 'Costruisci il tuo piano',
  'loading.longRunning': "L'operazione sta richiedendo più tempo del solito. È ancora in funzione.",

  'offline.banner': 'Sei offline. Le modifiche vengono mantenute su questo dispositivo.',
  'offline.draftSafe': 'La tua bozza è al sicuro. Si sincronizza quando sei di nuovo online.',
  'offline.publishDisabled':
    'La pubblicazione richiede una connessione. Questo non verrà messo in coda in silenzio.',
  'offline.scheduleQueued':
    'Questa richiesta di pianificazione è in coda su questo dispositivo e verrà inviata quando sarai di nuovo online.',
  'offline.reconnected': 'Di nuovo in linea. Sincronizzazione delle modifiche.',
  'offline.syncConflict':
    'Non è stato possibile unire automaticamente alcune modifiche. Rivedili prima di salvare.',

  'permission.denied.title': 'Non hai accesso a questo',
  'permission.denied.role': 'Ciò richiede il ruolo {role}. Tu sei {currentRole}.',
  'permission.denied.scope': "Questa credenziale necessita dell'ambito {scope}.",
  'permission.denied.contactOwner': 'Chiedi a {owner} di concederlo.',
  'permission.denied.projectScope': 'Il tuo accesso è limitato a {projects}.',
  'permission.readOnly': 'Questa area di lavoro è di sola lettura al momento.',
  'permission.mfaRequired': "Conferma con l'autenticazione a due fattori per continuare.",

  'rateLimit.title': 'Rallenta per un momento',
  'rateLimit.body': 'Hai effettuato richieste {count} in {window}. Il limite è {limit}.',
  'rateLimit.resetsAt': 'Questo si reimposta su {time}.',
  'rateLimit.cheaperAlternative':
    'La pianificazione invece della pubblicazione ora evita questo limite.',
  'rateLimit.providerCost':
    '{provider} addebiti per operazione. Questa azione è stimata in {amount}.',

  'incident.providerDegraded':
    '{provider} sta riscontrando problemi. I post pianificati continuano a riprovare.',
  'incident.providerDown': '{provider} non è disponibile. Niente è perduto e nulla è duplicato.',
  'incident.isolated': 'Le altre piattaforme non sono interessate.',
  'incident.statusPage': 'Stato in tempo reale per connettore e superficie',
  'incident.startedAt': 'Avviato {relativeTime}',

  'translation.incomplete':
    'Parte del testo in questa schermata non è ancora tradotto in {language} e viene visualizzato in inglese.',
  'translation.beta': 'Questa lingua è in versione beta. Segnala tutto ciò che legge male.',

  'confirm.discardChanges.title': 'Annullare le modifiche?',
  'confirm.discardChanges.body': 'Questa operazione non può essere annullata.',
  'confirm.deleteItem.title': 'Eliminare {name}?',
  'confirm.deleteItem.body': 'Questa operazione non può essere annullata.',
  'confirm.cancelScheduled.title': 'Cancellare questo post programmato?',
  'confirm.cancelScheduled.body':
    'Non verrà pubblicato. La bozza rimane qui in modo da poterla programmare di nuovo.',
  'confirm.publishNow.title': 'Pubblicare adesso?',
  'confirm.publishNow.body':
    '{count, plural, one {Pubblica immediatamente su # account} many {Pubblica immediatamente su # account} other {Pubblica immediatamente su # account}}. Non può essere richiamato da Relay.',
  'confirm.typeToConfirm': 'Digitare {word} per confermare.',
} as const;
