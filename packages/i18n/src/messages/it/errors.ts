/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'Qualcosa è andato storto e non siamo riusciti a classificarlo.',
  'error.unknown.action': 'Riprova. Se il problema persiste, inviaci il riferimento di seguito.',
  'error.internal.message': 'Questo è un problema da parte nostra, non con i tuoi contenuti.',
  'error.internal.action':
    'Il tuo lavoro è salvato. Siamo stati avvisati. Riprova tra qualche minuto.',
  'error.not_implemented.message': "Relay non l'ha ancora creato.",
  'error.not_implemented.action': 'Segui il registro delle modifiche per quando verrà spedito.',
  'error.offline.message': 'Sei offline.',
  'error.offline.action':
    'La tua bozza è conservata su questo dispositivo. La pubblicazione e la pianificazione riprendono al ripristino della connessione.',
  'error.network_unreachable.message': 'Non siamo riusciti a raggiungere il server.',
  'error.network_unreachable.action':
    'Controlla la connessione e riprova. Niente è andato perduto.',
  'error.request_invalid.message': 'La richiesta non era nella forma che possiamo accettare.',
  'error.request_invalid.action': 'Controlla i campi elencati di seguito e invialo nuovamente.',
  'error.validation_failed.message':
    'Alcuni campi necessitano di una modifica prima di poter essere salvati.',
  'error.validation_failed.action': 'Correggi i campi evidenziati.',
  'error.unauthenticated.message': "Per farlo è necessario effettuare l'accesso.",
  'error.unauthenticated.action': 'Accedi e ti riporteremo qui.',
  'error.session_expired.message': 'La tua sessione è scaduta.',
  'error.session_expired.action': 'Accedi di nuovo. La tua bozza è salvata.',
  'error.mfa_required.message': 'Questa azione richiede la conferma di due fattori.',
  'error.mfa_required.action': "Conferma con l'app di autenticazione per continuare.",
  'error.forbidden.message': 'Il tuo ruolo non consente questa azione.',
  'error.forbidden.action':
    "Chiedi l'accesso a un proprietario o amministratore di questa area di lavoro.",
  'error.insufficient_scope.message': "Questa credenziale non ha l'ambito {scope}.",
  'error.insufficient_scope.action':
    'Concedere tale ambito o utilizzare una credenziale che già lo possiede.',
  'error.workspace_not_found.message': "L'area di lavoro non esiste oppure non sei un membro.",
  'error.workspace_not_found.action': 'Scegli uno spazio di lavoro a cui appartieni.',
  'error.workspace_suspended.message': "Quest'area di lavoro è sospesa.",
  'error.workspace_suspended.action':
    "Contatta l'assistenza per risolverlo. I tuoi dati sono intatti.",
  'error.not_found.message': "Quell'oggetto non esiste più.",
  'error.not_found.action': "Potrebbe essere stato cancellato. Torna indietro e aggiorna l'elenco.",
  'error.conflict.message': "Qualcun altro l'ha cambiato mentre ci stavi lavorando.",
  'error.conflict.action': 'Rivedi entrambe le versioni, quindi salva di nuovo.',
  'error.idempotency_key_reused.message':
    'Questa chiave di idempotenza è già stata utilizzata per una richiesta diversa.',
  'error.idempotency_key_reused.action':
    'Utilizzare una nuova chiave o ripetere esattamente la richiesta originale.',
  'error.rate_limited.message': 'Troppe richieste.',
  'error.rate_limited.action': 'Riprovare dopo {time}.',
  'error.quota_exceeded.message': 'Questa azione supera il limite per il periodo corrente.',
  'error.quota_exceeded.action': 'Il limite si reimposta {relativeTime}.',
  'error.payment_required.message': 'Questa area di lavoro non ha un abbonamento attivo.',
  'error.payment_required.action':
    "Avvia l'abbonamento per pubblicare nuovamente. Niente viene cancellato.",
  'error.subscription_past_due.message': "L'ultimo pagamento non è andato a buon fine.",
  'error.subscription_past_due.action': 'Aggiorna il metodo di pagamento nel portale Polar.',
  'error.trial_expired.message': 'La prova si è conclusa il {date}.',
  'error.trial_expired.action': "Inizia l'abbonamento per continuare a pubblicare.",
  'error.entitlement_missing.message': "Quest'area di lavoro non ha accesso a tale funzionalità.",
  'error.entitlement_missing.action':
    "Controlla le impostazioni di fatturazione o contatta l'assistenza.",
  'error.channel_limit_reached.message':
    'Questa area di lavoro utilizza già tutti i canali attivi {limit}.',
  'error.channel_limit_reached.action': 'Disconnettere un canale prima di collegarne un altro.',
  'error.project_limit_reached.message':
    "Quest'area di lavoro utilizza già tutti i {limit} progetti attivi.",
  'error.project_limit_reached.action':
    "Archivia un progetto inattivo o cambia il limite di progetti dell'area di lavoro.",
  'error.project_has_connections.message':
    'Questo progetto ha ancora {connected, plural, one {# canale collegato} many {# canali collegati} other {# canali collegati}}.',
  'error.project_has_connections.action':
    'Disconnetti ogni canale in questo progetto prima di archiviarlo.',
  'error.project_last_active.message':
    "Un'area di lavoro deve mantenere almeno un progetto attivo.",
  'error.project_last_active.action': 'Crea un altro progetto prima di archiviare questo.',
  'error.connection_not_found.message': "Quella connessione non è più in quest'area di lavoro.",
  'error.connection_not_found.action':
    "Collega nuovamente l'account per continuare a pubblicare su di esso.",
  'error.connection_revoked.message': "{account} ha revocato l'accesso su {provider}.",
  'error.connection_revoked.action':
    "Ricollegare l'account. I post programmati riprenderanno successivamente.",
  'error.connection_expired.message': 'Accesso per {account} scaduto.',
  'error.connection_expired.action':
    "Ricollega l'account per ripristinare la pubblicazione e l'analisi.",
  'error.connection_paused.message': '{account} è in pausa.',
  'error.connection_paused.action': 'Riprendilo da Connections quando sei pronto.',
  'error.connection_permission_missing.message':
    '{account} non ha concesso il permesso necessario per farlo.',
  'error.connection_permission_missing.action':
    'Riconnettiti e accetta {permission} nella schermata di consenso.',
  'error.connection_account_type_invalid.message':
    'Instagram ha bisogno di un account professionale. {account} è un account personale.',
  'error.connection_account_type_invalid.action':
    "Passa a un account aziendale o creativo nell'app Instagram, quindi riconnettiti.",
  'error.connection_review_pending.message':
    '{provider} sta ancora recensendo questa app per {account}.',
  'error.connection_review_pending.action':
    'I post vengono pubblicati in privato fino al superamento della revisione. Aggiorniamo questa pagina quando cambia.',
  'error.capability_unsupported.message': '{provider} non lo offre tramite la sua API ufficiale.',
  'error.capability_unsupported.action': 'Utilizza un formato supportato da questo account.',
  'error.capability_not_implemented.message': 'Relay non lo ha ancora creato per {provider}.',
  'error.capability_not_implemented.action':
    'La pagina delle funzionalità elenca ciò che ogni connettore può fare oggi.',
  'error.capability_requires_review.message':
    "{provider} lo concede solo dopo aver esaminato l'app o l'account.",
  'error.capability_requires_review.action':
    'Rimane non disponibile finché la revisione non viene superata.',
  'error.content_invalid.message': '{provider} non accetterà questo contenuto per {account}.',
  'error.content_invalid.action': 'I problemi sono elencati sul target. Correggili e riprova.',
  'error.content_changed_after_approval.message':
    'Questo post è cambiato dopo essere stato approvato.',
  'error.content_changed_after_approval.action':
    "Richiedi nuovamente l'approvazione prima di poter pubblicare.",
  'error.duplicate_content.message':
    'Contenuti molto simili sono stati pubblicati su {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Modifica il testo o pubblicalo in un secondo momento. Le piattaforme limitano i post duplicati.',
  'error.cadence_limit_reached.message':
    "{account} ha raggiunto la cadenza di pubblicazione impostata per quest'area di lavoro.",
  'error.cadence_limit_reached.action':
    'Pianificalo per uno slot successivo o aumenta il limite di cadenza.',
  'error.media_invalid.message': 'Questo file non può essere pubblicato su {provider}.',
  'error.media_invalid.action': 'Il limite esatto è mostrato accanto al file.',
  'error.media_too_large.message': 'Questo file è più grande di quanto accettato da {provider}.',
  'error.media_too_large.action':
    "Comprimilo o carica una versione più piccola. L'originale viene mantenuto.",
  'error.media_processing_failed.message':
    'Non è stato possibile preparare questo file per {provider}.',
  'error.media_processing_failed.action':
    'Prova a caricarlo di nuovo o utilizza un formato diverso.',
  'error.media_rights_undeclared.message': 'Questo media non ha alcuna dichiarazione sui diritti.',
  'error.media_rights_undeclared.action':
    'Conferma di avere i diritti per pubblicarlo, comprese le persone in esso contenute.',
  'error.alt_text_required.message':
    'Questa immagine necessita di testo alternativo per {provider}.',
  'error.alt_text_required.action': "Descrivi l'immagine o contrassegnala come decorativa.",
  'error.approval_required.message':
    "Questa area di lavoro richiede l'approvazione prima della pubblicazione.",
  'error.approval_required.action': "Richiedi l'approvazione da {approver}.",
  'error.approval_expired.message': "L'approvazione per questo post è scaduta il {date}.",
  'error.approval_expired.action': "Richiedi nuovamente l'approvazione.",
  'error.schedule_in_past.message': 'Quel tempo è già passato in {timeZone}.',
  'error.schedule_in_past.action': 'Scegli un momento successivo o pubblica ora.',
  'error.schedule_conflict.message': '{account} ha già un post in {duration} in questo momento.',
  'error.schedule_conflict.action': 'Spostane uno o continua se è prevista tale spaziatura.',
  'error.time_zone_invalid.message': 'Non riconosciamo il fuso orario {timeZone}.',
  'error.time_zone_invalid.action': "Scegli una zona dall'elenco.",
  'error.destination_unavailable.message':
    'La destinazione {destination} non è più disponibile su {provider}.',
  'error.destination_unavailable.action':
    "Aggiorna l'elenco delle destinazioni e scegline un'altro.",
  'error.mention_unresolved.message':
    'Una menzione non è stata abbinata a un account {provider} reale.',
  'error.mention_unresolved.action':
    "Cerca e seleziona l'account oppure rimuovi la menzione. Non pubblichiamo mai un tag nativo falso.",
  'error.provider_transient.message': '{provider} non può elaborarlo in questo momento.',
  'error.provider_transient.action': 'Riproveremo automaticamente. Niente è duplicato.',
  'error.provider_permanent.message': '{provider} ha rifiutato e non accetterà un nuovo tentativo.',
  'error.provider_permanent.action': 'La risposta disinfettata è sulla ricevuta.',
  'error.provider_rate_limited.message':
    'La velocità {provider} ha limitato questo spazio di lavoro.',
  'error.provider_rate_limited.action': 'Riproveremo dopo {time}.',
  'error.provider_unavailable.message': '{provider} non risponde.',
  'error.provider_unavailable.action':
    'Controlla la pagina di stato. I post pianificati continuano a riprovare.',
  'error.provider_content_rejected.message':
    '{provider} ha rifiutato questo contenuto in base alle proprie politiche.',
  'error.provider_content_rejected.action':
    'Il motivo indicato è sulla ricevuta. Modifica il contenuto o fai ricorso con {provider}.',
  'error.user_action_required.message':
    '{account} ha bisogno di qualcosa da te prima di poter pubblicare.',
  'error.user_action_required.action': 'Apri la connessione per vedere cosa manca.',
  'error.short_link_destination_blocked.message': 'Quella destinazione non può essere abbreviata.',
  'error.short_link_destination_blocked.action':
    'Le reti private, gli schemi non sicuri e le destinazioni abusive note vengono bloccate.',
  'error.short_link_domain_unverified.message': 'Il dominio {domain} non è ancora verificato.',
  'error.short_link_domain_unverified.action':
    'Aggiungi il record DNS mostrato nelle impostazioni, quindi verifica.',
  'error.rss_feed_invalid.message': "L'URL non ha restituito un feed RSS o Atom valido.",
  'error.rss_feed_invalid.action':
    "Controlla l'indirizzo. Lo recuperiamo in modo sicuro e non seguiamo reindirizzamenti privati.",
  'error.webhook_signature_invalid.message': 'La firma su quel webhook non è stata verificata.',
  'error.webhook_signature_invalid.action':
    'Verificare che il mittente utilizzi il segreto di firma corrente. Il payload non è stato elaborato.',
  'error.webhook_delivery_failed.message': 'La consegna a {endpoint} non è riuscita.',
  'error.webhook_delivery_failed.action':
    'Riproviamo con il backoff. Il registro di consegna contiene la risposta.',
  'error.automation_rule_not_permitted.message':
    'Tale regola violerebbe una regola della piattaforma, quindi non può essere creata.',
  'error.automation_rule_not_permitted.action':
    'I Mi piace automatizzati, i follower, le risposte non richieste e i post di massa duplicati non sono mai disponibili.',
  'error.ai_unavailable.message': "L'assistente alla scrittura non è disponibile al momento.",
  'error.ai_unavailable.action': 'Il tuo testo è intatto. Riprova a breve.',
  'error.ai_output_invalid.message':
    "L'assistente ha restituito qualcosa che non abbiamo potuto convalidare.",
  'error.ai_output_invalid.action': 'Non è stato applicato nulla alla tua bozza. Riprova.',
  'error.ai_budget_exceeded.message':
    "Per ora quest'area di lavoro ha raggiunto il limite dell'assistente.",
  'error.ai_budget_exceeded.action':
    'Il limite si reimposta {relativeTime}. Scrivere a mano funziona ancora.',
  'error.storage_unavailable.message': "Non è stato possibile raggiungere l'archivio multimediale.",
  'error.storage_unavailable.action':
    'Il tuo testo è salvato. Riprovare il caricamento tra un attimo.',
  'error.export_unavailable.message': 'Non è stato possibile produrre tale esportazione.',
  'error.export_unavailable.action':
    "Prova una gamma più piccola o contatta l'assistenza con il riferimento.",

  'error.reference': 'Riferimento {correlationId}',
  'error.reportToSupport': 'Invia questo al supporto',
  'error.contentPreserved': 'Il tuo contenuto è preservato. Non è stato pubblicato nulla.',
} as const;
