/**
 * Web catalog for settings, the developer portal, billing and the Growth
 * Advisor.
 *
 * This file only adds what the web screens need on top of the intent catalogs
 * in `settings.ts`, `developer.ts`, `billing.ts` and `growth.ts`. Everything
 * here lives under a `.ui.` segment so a key can never collide with one of
 * those files when the catalogs are merged.
 *
 * Several strings are mandated word for word and must not be softened:
 *  - `billing.ui.annualFraming` states the saving in currency, never a percent.
 *  - `billing.ui.cancelConfirmedBeforeConversion` must read
 *    "Canceled. You will not be charged."
 *  - the media generation boundary paragraph is NOT restated here. It already
 *    exists as `billing.mediaGeneration.explanation`, and the Tool Radar
 *    renders that same key so there is one sentence to review and translate.
 */
export const webSettingsMessages = {
  /* ------------------------------------------------------------------ shell */

  'settings.ui.subtitle':
    'Tutto ciò che configura questo spazio di lavoro. Niente qui pubblica nulla.',
  'settings.ui.nav.label': 'Sezioni Impostazioni',
  'settings.ui.index.help':
    'Scegli una sezione. Ogni modifica ti viene attribuita e appare nel registro di controllo.',

  'settings.ui.section.members': 'Membri e ruoli',
  'settings.ui.section.membersSummary':
    "Chi è presente in quest'area di lavoro e cosa può fare ciascuna persona.",
  'settings.ui.section.projects': 'Projects',
  'settings.ui.section.projectsSummary':
    'Voce, pubblico, affermazioni approvate, termini bloccati, regole locali, domini e glossario.',
  'settings.ui.section.agents': 'Agenti e API',
  'settings.ui.section.agentsSummary':
    'Account di servizio, ambiti, limiti, credenziali, attività e terreno di gioco.',
  'settings.ui.section.apps': 'App per sviluppatori',
  'settings.ui.section.appsSummary':
    'Applicazioni OAuth di terze parti, liste consentite di reindirizzamento, consenso e concessioni.',
  'settings.ui.section.webhooks': 'Webhook',
  'settings.ui.section.webhooksSummary':
    'Eventi in uscita firmati, registri di consegna, riconsegna e rotazione segreta.',
  'settings.ui.section.billing': 'Fatturazione',
  'settings.ui.section.billingSummary':
    'Piano, prova, intervallo, utilizzo del fornitore misurato, fatture e annullamento.',
  'settings.ui.section.referrals': 'Referral e affiliazione',
  'settings.ui.section.referralsSummary':
    'Il tuo link di riferimento divulgato, iscrizioni attribuite e stato delle commissioni.',
  'settings.ui.section.localization': 'Localizzazione',
  'settings.ui.section.localizationSummary':
    "Lingua dell'interfaccia, lingue dei contenuti, mercati, fuso orario e formato orario.",
  'settings.ui.section.security': 'Sicurezza',
  'settings.ui.section.securitySummary':
    'Sessioni, autenticazione a due fattori, credenziali, agenti, webhook e concessioni di app.',
  'settings.ui.section.data': 'Controlli sui dati',
  'settings.ui.section.dataSummary':
    "Esporta, revoca una connessione, elimina un marchio, elimina contenuti o chiudi l'account.",

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Caricamento in corso di {section}',
  'settings.ui.state.errorTitle': 'Impossibile caricare {section}',
  'settings.ui.state.errorRetry': 'Riprova',
  'settings.ui.state.savingAnnouncement': 'Salvataggio di {section}',
  'settings.ui.state.savedAnnouncement': '{section} salvato',
  'settings.ui.state.saveFailedAnnouncement':
    '{section} non è stato salvato. Il tuo contributo è ancora qui.',
  'settings.ui.state.offlineTitle': 'Sei offline',
  'settings.ui.state.offlineBody':
    'Puoi leggere questa pagina. Non è possibile salvare le modifiche finché non viene ripristinata la connessione.',
  'settings.ui.state.permissionTitle': 'Non hai accesso a {section}',
  'settings.ui.state.permissionBody':
    "Questa sezione modifica il comportamento dell'area di lavoro, quindi è limitata dal ruolo.",
  'settings.ui.state.permissionRequirements': 'Di cosa hai bisogno',
  'settings.ui.state.permissionContact':
    'Un proprietario o un amministratore di questa area di lavoro può concederlo. Sono elencati in Membri e ruoli.',
  'settings.ui.state.rateLimitTitle': 'Troppi cambiamenti in poco tempo',
  'settings.ui.state.rateLimitCause':
    "Quest'area di lavoro ha raggiunto il limite di scrittura per le modifiche alle impostazioni.",
  'settings.ui.state.rateLimitReset': 'Il limite viene reimpostato',
  'settings.ui.state.rateLimitAlternative':
    "Niente di ciò che hai salvato è andato perduto. Le azioni di sola lettura continuano a funzionare durante l'attesa.",
  'settings.ui.state.rateLimitUsage': "Le impostazioni scrivono a quest'ora",
  'settings.ui.state.rateLimitUsageText': '{used} di {limit} utilizzato',
  'settings.ui.state.unsavedTitle': 'Sono presenti modifiche non salvate',
  'settings.ui.state.unsavedBody': 'Salvali prima di lasciare questa sezione.',
  'settings.ui.state.readOnlyTitle': 'Questo spazio di lavoro è di sola lettura',
  'settings.ui.state.readOnlyBody':
    'La fatturazione è scaduta. I tuoi contenuti, ricevute e connessioni sono intatti. Le impostazioni possono essere lette ma non modificate.',

  'settings.ui.state.referenceLabel': 'Riferimento di supporto',

  'settings.ui.attribution': 'Modificato da {name} {relativeTime}',
  'settings.ui.attributionNever': 'Non è cambiato da quando è stato creato',
  'settings.ui.copyFailed':
    'Il tuo browser ha bloccato la copia. Seleziona il testo e copialo manualmente.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    "Ogni invito, cambio di ruolo e rimozione viene registrato con il tuo nome e l'ora.",
  'settings.ui.members.tableCaption': 'Persone in questo spazio di lavoro, con ruolo e ambito',
  'settings.ui.members.column.person': 'Persona',
  'settings.ui.members.column.role': 'Ruolo',
  'settings.ui.members.column.scope': 'Ambito',
  'settings.ui.members.column.approvals': 'Approvazioni',
  'settings.ui.members.column.lastActive': 'Ultimo attivo',
  'settings.ui.members.column.actions': 'Azioni',
  'settings.ui.members.scopeAll': 'Tutti i marchi e gli account',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {# marchio} many {# marchi} other {# marchi}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Può approvare',
  'settings.ui.members.approvals.cannotApprove': 'Impossibile approvare',
  'settings.ui.members.approvals.canApproveOwnProjects': 'Può approvare per i marchi elencati',
  'settings.ui.members.lastActiveNever': "Non ha ancora effettuato l'accesso",
  'settings.ui.members.changeRole': 'Cambia ruolo per {name}',
  'settings.ui.members.remove': 'Rimuovere {name}',
  'settings.ui.members.lastOwnerTitle': "Un'area di lavoro mantiene almeno un proprietario",
  'settings.ui.members.lastOwnerBody':
    'Rendi prima proprietario qualcun altro, poi questa modifica diventerà disponibile.',
  'settings.ui.members.inviteTitle': "Invita qualcuno in quest'area di lavoro",
  'settings.ui.members.inviteBody':
    "Ricevono un'e-mail con un collegamento. L'invito scade dopo sette giorni e puoi revocarlo prima di allora.",
  'settings.ui.members.inviteRole': 'Ruolo',
  'settings.ui.members.inviteScope': 'Project in cui possono lavorare',
  'settings.ui.members.inviteScopeAll': 'Ogni marchio in questo spazio di lavoro',
  'settings.ui.members.inviteScopeSelected': 'Solo i marchi che seleziono',
  'settings.ui.members.inviteApprovals': 'Può decidere le richieste di approvazione',
  'settings.ui.members.inviteApprovalsHelp':
    'Questo può essere assegnato solo ai ruoli che già includono la revisione. È separato dalla modifica.',
  'settings.ui.members.inviteSubmit': 'Invia invito',
  'settings.ui.members.invitePending': 'Invitato {relativeTime} da {name}',
  'settings.ui.members.inviteRevoke': 'Revoca invito',
  'settings.ui.members.inviteResend': "Invia nuovamente l'invito",
  'settings.ui.members.emptyTitle': "Tu sei l'unica persona qui",
  'settings.ui.members.emptyBody':
    'Invita le persone che scrivono, approvano o leggono i risultati. Ognuno ha un ruolo e un ambito di applicazione del marchio.',
  'settings.ui.members.emptyExample':
    'Una forma comune: un proprietario per la fatturazione, un approvatore per marchio e redattori che redigono ma non pubblicano mai.',
  'settings.ui.members.roleReferenceTitle': 'Cosa può fare ciascun ruolo',
  'settings.ui.members.roleReferenceCaption': 'Ruoli e azioni consentite da ciascuno',
  'settings.ui.members.roleColumn.role': 'Ruolo',
  'settings.ui.members.roleColumn.can': 'Può fare',
  'settings.ui.members.roleColumn.cannot': 'Non posso farlo',
  'settings.ui.members.roleCannot.owner': 'Nulla viene trattenuto al proprietario.',
  'settings.ui.members.roleCannot.admin': "Modifica la fatturazione o elimina l'area di lavoro.",
  'settings.ui.members.roleCannot.manager':
    "Modifica fatturazione, ruoli o eliminazione dell'area di lavoro.",
  'settings.ui.members.roleCannot.editor':
    'Approva, pianifica, pubblica o modifica le connessioni.',
  'settings.ui.members.roleCannot.approver': 'Modifica connessioni, regole o fatturazione.',
  'settings.ui.members.roleCannot.analyst': 'Crea, modifica, approva o pubblica qualsiasi cosa.',
  'settings.ui.members.roleCannot.viewer': 'Cambia qualsiasi cosa.',
  'settings.ui.members.removeTitle': "Rimuovi {name} da quest'area di lavoro",
  'settings.ui.members.removeConsequence.access':
    'Perdono immediatamente l’accesso, su ogni superficie.',
  'settings.ui.members.removeConsequence.drafts':
    "Le bozze scritte rimangono nell'area di lavoro e sono modificabili.",
  'settings.ui.members.removeConsequence.audit':
    'Le loro azioni passate rimangono nel registro di controllo e nelle ricevute.',
  'settings.ui.members.removeConsequence.approvals':
    'Le richieste di approvazione in attesa tornano in coda per un altro approvatore.',

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'Tieni separati ogni prodotto, cliente, pubblicazione o iniziativa. Ogni progetto ha i propri canali, contenuti multimediali, bozze, programmazione e regole di pubblicazione.',
  'settings.ui.projects.listCaption': "Progetti in quest'area di lavoro",
  'settings.ui.projects.column.project': 'Progetto',
  'settings.ui.projects.column.locales': 'Lingue dei contenuti',
  'settings.ui.projects.column.accounts': 'Conti',
  'settings.ui.projects.column.updated': 'Aggiornato',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Nessun account} one {# account} many {# account} other {# account}}',
  'settings.ui.projects.emptyTitle': 'Crea il tuo primo progetto',
  'settings.ui.projects.emptyBody':
    'Un progetto mantiene un prodotto o un cliente sincronizzato sui suoi canali social, senza mescolare contenuti multimediali, bozze o programmazioni con un altro progetto.',
  'settings.ui.projects.emptyExample':
    "Esempio: Acme App, Acme Podcast e Cliente Northwind possono essere tre progetti separati in un'unica area di lavoro.",
  'settings.ui.projects.voiceHelp':
    'Come dovrebbe suonare questo progetto. Utilizzato per le linee guida di revisione e per il controllo delle affermazioni.',
  'settings.ui.projects.audienceHelp': 'A chi è rivolto il contenuto, per mercato.',
  'settings.ui.projects.approvedClaimsHelp':
    "Dichiarazioni che un revisore ha autorizzato. Tutto ciò che non rientra in questo elenco viene contrassegnato prima dell'approvazione, non dopo la pubblicazione.",
  'settings.ui.projects.blockedTermsHelp':
    'Parole che bloccano la programmazione per questo progetto. Uno per riga.',
  'settings.ui.projects.domainsHelp':
    'Domini a cui questo progetto può collegarsi e che può abbreviare. Solo i domini verificati possono essere selezionati nel compositore.',
  'settings.ui.projects.domainVerified': '{date} verificato',
  'settings.ui.projects.domainPending': 'Record DNS non ancora visto',
  'settings.ui.projects.domainVerificationUnavailable': 'La verifica non è ancora disponibile',
  'settings.ui.projects.disclosureUnavailable':
    'I valori predefiniti di divulgazione per canale non sono ancora disponibili. Aggiungi la divulgazione richiesta nel post finché questa funzione non sarà rilasciata.',
  'settings.ui.projects.glossaryUnavailable':
    "Il glossario dell'area di lavoro non è ancora disponibile. La voce, il pubblico, le affermazioni approvate e i termini bloccati qui sopra sono salvati e applicati.",
  'settings.ui.projects.localeRulesUnavailable':
    "Le regole di scrittura per lingua non sono ancora disponibili. Le lingue e i mercati dell'area di lavoro restano disponibili in Localizzazione.",
  'settings.ui.projects.disclosureHelp':
    "Applicato per impostazione predefinita nel compositore per le piattaforme scelte qui. Può essere modificato per post prima dell'approvazione.",
  'settings.ui.projects.glossaryHelp':
    'Nomi di prodotti, termini legali e tutto ciò che deve sopravvivere inalterato ad una traduzione.',
  'settings.ui.projects.glossaryCaption':
    'Termini protetti e modalità di gestione di ciascuno di essi per lingua',
  'settings.ui.projects.glossaryEmpty':
    'Nessun termine protetto ancora. Aggiungi nomi di prodotti e termini legali che non devono essere tradotti o riformulati.',
  'settings.ui.projects.localeRulesHelp':
    "Regole per lingua del contenuto. Vengono applicati durante l'adattamento o la transcreazione e mostrati al revisore.",
  'settings.ui.projects.saveProject': 'Salva progetto',
  'settings.ui.projects.capacityTitle': 'Capacità dei progetti',
  'settings.ui.projects.capacityHelp':
    "Il piano base da 29 $ include 3 progetti attivi. Un'area di lavoro può avere diritto fino a 20 senza creare un altro account.",
  'settings.ui.projects.capacitySummary': '{used} di {limit}',
  'settings.ui.projects.atLimitTitle': "Quest'area di lavoro ha usato ogni spazio per progetti",
  'settings.ui.projects.atLimitBody':
    "Archivia un progetto inattivo o cambia il diritto dell'area di lavoro prima di aggiungerne un altro. Il limite attuale è {limit}.",
  'settings.ui.projects.listLabel': 'Scegli un progetto da modificare',
  'settings.ui.projects.detailsTitle': 'Dettagli del progetto',
  'settings.ui.projects.projectMeta':
    '{accounts, plural, =0 {Nessun canale} one {# canale} many {# canali} other {# canali}} · Aggiornato {updated}',
  'settings.ui.projects.archiveAction': 'Archivia progetto',
  'settings.ui.projects.archiveTitle': 'Archiviare {project}?',
  'settings.ui.projects.archiveBody':
    "Questo progetto inattivo lascia l'area di lavoro attiva e libera uno spazio per progetti.",
  'settings.ui.projects.archiveChannels':
    'I suoi canali collegati smettono di comparire nei flussi dei progetti attivi.',
  'settings.ui.projects.archiveHistory':
    'Bozze, post pubblicati, ricevute e cronologia di controllo vengono conservati.',
  'settings.ui.projects.archiveLastDisabled':
    "Mantieni almeno un progetto attivo nell'area di lavoro.",
  'settings.ui.projects.archiveConnectedDisabled':
    'Disconnetti i canali di questo progetto prima di archiviarlo.',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    "Tre impostazioni separate: la lingua di questa app, le lingue in cui pubblichi e i mercati per cui scrivi. Cambiarne uno non cambia mai l'altro.",
  'settings.ui.localization.interfaceOnlyEnglish':
    'Scegli una lingua di interfaccia per questa app. Le lingue dei contenuti sono separate e già disponibili.',
  'settings.ui.localization.marketHelp':
    'Un mercato cambia esempi, informative legali e inviti all’azione. Non cambia la lingua di un post.',
  'settings.ui.localization.previewTitle': 'Come verranno letti date e numeri',
  'settings.ui.localization.previewDate': 'Data',
  'settings.ui.localization.previewTime': 'Tempo',
  'settings.ui.localization.previewNumber': 'Numero',
  'settings.ui.localization.previewCurrency': 'Valuta',
  'settings.ui.localization.weekStartHelp':
    'Utilizzato dalla visualizzazione della settimana del calendario.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    "Tutto ciò che può agire su questo spazio di lavoro, in un unico posto: le tue sessioni, credenziali, agenti, webhook e le app a cui hai concesso l'accesso.",
  'settings.ui.security.sessionsCaption': 'Sessioni con accesso per il tuo account',
  'settings.ui.security.sessionColumn.device': 'Dispositivo e browser',
  'settings.ui.security.sessionColumn.location': 'Posizione approssimativa',
  'settings.ui.security.sessionColumn.lastSeen': 'Ultimo usato',
  'settings.ui.security.sessionCurrent': 'Questa sessione',
  'settings.ui.security.sessionRevokeAll': 'Esci a ogni altra sessione',
  'settings.ui.security.sessionLocationUnknown': 'Posizione non registrata',
  'settings.ui.security.mfaOn': "L'autenticazione a due fattori è attiva",
  'settings.ui.security.mfaOff': "L'autenticazione a due fattori è disattivata",
  'settings.ui.security.mfaBody':
    'Un secondo fattore è necessario prima delle modifiche alla fatturazione, alla creazione di un account di servizio, alla riconnessione di un account e alla revoca delle credenziali.',
  'settings.ui.security.credentialsTitle': 'Chiavi API',
  'settings.ui.security.credentialsBody':
    'Chiavi possedute da questo spazio di lavoro. Sono separati dalle concessioni delle app e dalla tua sessione.',
  'settings.ui.security.agentsTitle': 'Conti di servizio',
  'settings.ui.security.webhooksTitle': 'Endpoint del webhook',
  'settings.ui.security.grantsTitle': 'App che hai consentito',
  'settings.ui.security.grantsBody':
    "La revoca di un'app ne interrompe immediatamente i token. Le tue connessioni e i post programmati non sono interessati.",
  'settings.ui.security.grantScopes': 'Autorizzazioni concesse',
  'settings.ui.security.socialPermissionsTitle': "Autorizzazioni dell'account social",
  'settings.ui.security.socialPermissionsBody':
    'Ciò che ciascun account connesso ha consentito di eseguire a Relay, dallo snapshot della funzionalità acquisito al momento della connessione.',
  'settings.ui.security.viewInSection': 'Gestisci in {section}',
  'settings.ui.security.emptySessions': "È stata effettuata l'accesso solo a questa sessione.",
  'settings.ui.security.emptyGrants':
    "Nessuna app di terze parti ha accesso a quest'area di lavoro. Le app vengono visualizzate qui dopo averle autorizzate in una schermata di consenso.",
  'settings.ui.security.revokeGrantTitle': "Revoca l'accesso per {app}",
  'settings.ui.security.revokeGrantConsequence.tokens':
    'I suoi token di accesso e aggiornamento smettono di funzionare immediatamente.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'I post già programmati rimangono programmati. Annullali separatamente se vuoi che vengano interrotti.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    "L'app può richiedere nuovamente l'accesso e tu puoi rifiutare.",

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'Take your data out, remove one thing, or close the account. Every destructive action names exactly what it touches first.',
  'settings.ui.data.exportTitle': 'Export',
  'settings.ui.data.exportBody':
    'A portable archive of content, schedules, receipts, analytics and audit events, plus your uploaded media.',
  'settings.ui.data.exportJson': 'Structured JSON',
  'settings.ui.data.exportCsv': 'Spreadsheet CSV',
  'settings.ui.data.exportMedia': 'Media archive',
  'settings.ui.data.exportJsonHelp':
    'One file per record type. Documented and stable across versions.',
  'settings.ui.data.exportCsvHelp': 'Posts, receipts and metrics as flat tables for a spreadsheet.',
  'settings.ui.data.exportMediaHelp':
    'The original files you uploaded or imported, with checksums.',
  'settings.ui.data.exportStart': 'Prepare export',
  'settings.ui.data.exportRunning':
    'Preparing your export. It keeps running if you close this page.',
  'settings.ui.data.exportReady': 'Export ready, prepared {date}',
  'settings.ui.data.exportDownload': 'Download export',
  'settings.ui.data.exportExpires': 'The download link expires {date}.',
  'settings.ui.data.deleteTitle': 'Delete',
  'settings.ui.data.deleteBody':
    'Choose the smallest thing that solves your problem. Each option below says what survives.',
  'settings.ui.data.deleteConnection': 'Revoke one social connection',
  'settings.ui.data.deleteConnectionHelp':
    'Removes Relay access to that account. The workspace, its content and its receipts stay.',
  'settings.ui.data.deleteProject': 'Delete a project',
  'settings.ui.data.deleteProjectHelp':
    'Removes the project, its rules and its glossary. Content published under it keeps its receipts.',
  'settings.ui.data.deleteContent': 'Delete content and media',
  'settings.ui.data.deleteContentHelp':
    'Removes drafts and stored files. It does not remove anything already published on a platform.',
  'settings.ui.data.deleteAccount': 'Close this workspace',
  'settings.ui.data.deleteAccountHelp':
    'Cancels scheduled jobs, revokes every connection, removes stored media and closes the workspace.',
  'settings.ui.data.scheduledJobsTitle': 'Scheduled work that will be canceled first',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {Nothing is scheduled right now} one {# scheduled post} many {# scheduled posts} other {# scheduled posts}}',
  'settings.ui.data.cancelJobsFirst': 'Cancel scheduled posts now',
  'settings.ui.data.cancelJobsDone': 'Scheduled posts canceled. Nothing will publish.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'Type the workspace name to confirm',
  'settings.ui.data.deleteConsequence.jobs':
    'Every scheduled post is canceled before anything is removed.',
  'settings.ui.data.deleteConsequence.connections':
    'Every social connection is revoked at the provider.',
  'settings.ui.data.deleteConsequence.media': 'Stored media is deleted and cannot be recovered.',
  'settings.ui.data.deleteConsequence.receipts':
    'Publication receipts are kept for the retention period stated in the Terms, then removed.',
  'settings.ui.data.deleteConsequence.published':
    'Posts already live on a platform are not deleted. Remove those on the platform.',
  'settings.ui.data.exportFirst': 'Export your data before you delete it.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'Condividi Relay con un collegamento divulgato. La Commissione non è mai subordinata a una revisione positiva.',
  'settings.ui.referral.linkLabel': 'Il tuo link di riferimento',
  'settings.ui.referral.tableCaption': 'Iscrizioni attribuite e relativo stato della commissione',
  'settings.ui.referral.column.signup': 'Iscriviti',
  'settings.ui.referral.column.date': 'Data',
  'settings.ui.referral.column.state': 'Commissione',
  'settings.ui.referral.column.amount': 'Importo',
  'settings.ui.referral.emptyTitle': 'Nessuna iscrizione ancora attribuita',
  'settings.ui.referral.emptyBody':
    'Le iscrizioni vengono visualizzate qui quando qualcuno avvia una prova tramite il tuo collegamento. Gli importi rimangono in sospeso fino alla chiusura della finestra di rimborso.',
  'settings.ui.referral.emptyExample':
    'Riga di esempio: acme.example, ha iniziato una prova il 12 giugno, in attesa fino al 12 luglio, poi approvata.',
  'settings.ui.referral.termsLink': 'Leggi i termini del partner',
  'settings.ui.referral.balance': 'Commissione approvata',
  'settings.ui.referral.balanceUnavailableReason':
    'Il registro delle commissioni per questo periodo non è stato ancora riconciliato.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    "Un account di servizio è un'identità denominata per un agente, uno script o un flusso di lavoro. Ha i propri scopi, i propri limiti e la propria pista di controllo.",
  'developer.ui.agents.emptyTitle': 'Nessun account di servizio ancora',
  'developer.ui.agents.emptyBody':
    'Creane uno per ogni automazione che esegui. Con account separati puoi revocarne uno senza interrompere gli altri.',
  'developer.ui.agents.emptyExample':
    'Esempio: "Content agent", marchio Acme EU, può redigere e programmare fino a 6 post al giorno tra le 07:00 e le 22:00, non pubblica mai immediatamente.',
  'developer.ui.agents.step.identity': 'Nome e scopo',
  'developer.ui.agents.step.scope': 'Cosa può raggiungere',
  'developer.ui.agents.step.limits': 'Limiti',
  'developer.ui.agents.purpose': 'A cosa serve questo conto',
  'developer.ui.agents.purposeHelp':
    'Una frase. Viene visualizzato accanto a ogni azione eseguita da questo account nel registro di controllo.',
  'developer.ui.agents.scopeHelp':
    "Un ambito garantisce esattamente se stesso. Niente qui implica qualcos'altro.",
  'developer.ui.agents.limitsHelp':
    "I limiti vengono applicati dall'API, non dall'agente. Un agente non può aumentare il proprio limite.",
  'developer.ui.agents.quietHours': 'Ore tranquille',
  'developer.ui.agents.quietHoursHelp':
    "L'account non può pianificare o pubblicare entro questi orari, nel fuso orario dell'area di lavoro.",
  'developer.ui.agents.lookAheadHelp': 'Quanto lontano nel futuro potrebbe pubblicare un post.',
  'developer.ui.agents.cadenceHelp':
    'Le pubblicazioni più esterne che potrebbe causare in un giorno.',
  'developer.ui.agents.expiry': 'Scadenza credenziali',
  'developer.ui.agents.expiryHelp':
    'Una vita più breve è più sicura. Puoi ruotare in qualsiasi momento.',
  'developer.ui.agents.summaryTitle': 'Prima di crearlo',
  'developer.ui.agents.summaryAccounts': 'Conti che può raggiungere',
  'developer.ui.agents.summaryMaxActions':
    'Al massimo {count, plural, one {# pubblicazione esterna} many {# pubblicazioni esterne} other {# pubblicazioni esterne}} al giorno.',
  'developer.ui.agents.summaryApproval': 'Comportamento di approvazione',
  'developer.ui.agents.summaryCreate': 'Crea un account di servizio',
  'developer.ui.agents.detailTitle': 'Conto di servizio',
  'developer.ui.agents.statusActive': 'Attivo',
  'developer.ui.agents.statusStopped': 'Fermato',
  'developer.ui.agents.statusExpired': 'Credenziale scaduta',
  'developer.ui.agents.stoppedBody':
    'Questo account è stato interrotto. Ogni chiamata effettuata viene rifiutata con una chiara ragione. Niente di ciò che ha creato è stato rimosso.',
  'developer.ui.agents.killTitle': 'Arresta {name}',
  'developer.ui.agents.killConsequence.calls':
    'Ogni chiamata API, MCP e CLI da questo account viene rifiutata immediatamente.',
  'developer.ui.agents.killConsequence.scheduled':
    'I post già programmati rimangono programmati. Cancellali dal calendario se vuoi che vengano fermati.',
  'developer.ui.agents.killConsequence.reversible': 'Puoi ricominciarlo più tardi.',
  'developer.ui.agents.resume': 'Avvia di nuovo questo agente',
  'developer.ui.agents.rotate': 'Ruota credenziale',
  'developer.ui.agents.rotateTitle': 'Ruota la credenziale per {name}',
  'developer.ui.agents.rotateConsequence.old':
    'La credenziale corrente smette di funzionare immediatamente.',
  'developer.ui.agents.rotateConsequence.new':
    'Quello nuovo viene mostrato una volta, in questa pagina.',
  'developer.ui.agents.rotateConsequence.clients':
    'Tutto ciò che utilizza il vecchio valore fallisce finché non lo aggiorni.',
  'developer.ui.agents.credentialStored': 'Ho memorizzato questa credenziale',
  'developer.ui.agents.credentialLabel': "Credenziali dell'account di servizio",
  'developer.ui.agents.credentialWarning':
    "Questa è l'unica volta in cui viene mostrata questa credenziale",
  'developer.ui.agents.credentialWarningBody':
    'Copialo nel tuo negozio segreto adesso. Manteniamo solo un hash, quindi non possiamo mostrarlo nuovamente. La rotazione ne crea uno nuovo.',
  'developer.ui.agents.credentialConsumed':
    'La credenziale non viene più visualizzata. Ruotalo se non lo hai memorizzato.',
  'developer.ui.agents.credentialReveal': 'Mostra credenziale',
  'developer.ui.agents.credentialHide': 'Nascondi credenziale',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read':
    'Visualizza i tuoi account collegati e cosa può fare ciascuno',
  'developer.ui.scope.accounts_write':
    'Rinomina gli account e modifica il modo in cui sono raggruppati',
  'developer.ui.scope.drafts_read': 'Leggi le tue bozze e le loro varianti',
  'developer.ui.scope.drafts_write': 'Creare e modificare bozze',
  'developer.ui.scope.posts_schedule': 'Pianifica i contenuti approvati nei tuoi account',
  'developer.ui.scope.posts_publish': 'Pubblica immediatamente sui tuoi account',
  'developer.ui.scope.posts_cancel': 'Cancella i post programmati',
  'developer.ui.scope.analytics_read': 'Leggi le analisi per i tuoi account',
  'developer.ui.scope.media_read': 'Visualizza i file nella tua libreria',
  'developer.ui.scope.media_write': 'Carica e modifica i file nella tua libreria',
  'developer.ui.scope.rules_read': 'Leggi le tue regole di automazione',
  'developer.ui.scope.rules_write':
    'Crea e modifica le regole di automazione che possono essere pubblicate',
  'developer.ui.scope.growth_read': 'Leggi i tuoi piani di crescita',
  'developer.ui.scope.growth_write': 'Creare e modificare piani di crescita',
  'developer.ui.scope.webhooks_manage': 'Crea e modifica gli endpoint webhook',
  'developer.ui.scope.billing_read': "Leggi il tuo piano, lo stato di prova e l'utilizzo",
  'developer.ui.scope.connections_admin': 'Connetti e disconnetti gli account social',

  'developer.ui.activity.caption':
    'Richiami recenti agli strumenti, con quelli che sono stati rifiutati',
  'developer.ui.activity.column.time': 'Tempo',
  'developer.ui.activity.column.tool': 'Strumento o percorso',
  'developer.ui.activity.column.outcome': 'Risultato',
  'developer.ui.activity.column.subject': 'Oggetto',
  'developer.ui.activity.outcome.ok': 'Consentito',
  'developer.ui.activity.outcome.denied': 'Negato',
  'developer.ui.activity.outcome.failed': 'Fallito',
  'developer.ui.activity.filterDenied': 'Mostra solo i tentativi negati',
  'developer.ui.activity.deniedExplain':
    'Un tentativo negato è il modo in cui si presenta un agente configurato in modo errato. Queste righe vengono mantenute, non nascoste.',
  'developer.ui.activity.emptyTitle': 'Nessuna chiamata ancora registrata',
  'developer.ui.activity.emptyBody':
    "Le chiamate vengono visualizzate qui entro pochi secondi dall'avvenimento, comprese quelle che sono state rifiutate.",
  'developer.ui.activity.emptyExample':
    "Riga di esempio: 12:03, draft_post, Consentito, bozza per l'account X @acme.",

  'developer.ui.setup.help':
    'Incollalo nel client a cui ti stai connettendo. Sostituisci il segnaposto della credenziale con il valore archiviato.',
  'developer.ui.setup.credentialPlaceholder':
    'Lo snippet utilizza un segnaposto. Non impegnare mai le credenziali reali in un repository.',
  'developer.ui.setup.copySnippet': 'Copia lo snippet per {client}',
  'developer.ui.setup.snippetCopied': 'Frammento copiato',
  'developer.ui.setup.tabLabel': 'Snippet di configurazione del client',

  'developer.ui.playground.help':
    'Le chiamate vengono eseguite su una copia seed di questa area di lavoro. Nessun fornitore viene contattato e nulla è programmato.',
  'developer.ui.playground.tool': 'Strumento',
  'developer.ui.playground.arguments': 'Argomenti',
  'developer.ui.playground.argumentsHelp': "JSON. Lo stesso corpo accettato dall'API reale.",
  'developer.ui.playground.result': 'Risultato',
  'developer.ui.playground.resultEmpty':
    'Esegui uno strumento per vedere la risposta che restituirebbe.',
  'developer.ui.playground.invalidJson':
    'Questo non è ancora un JSON valido, quindi non può essere inviato.',
  'developer.ui.playground.deniedByApproval':
    "Il livello di approvazione {level} non consente questa chiamata. La prova di prova lo rifiuta esattamente come farebbe l'API.",
  'developer.ui.playground.announceResult': 'Il test di prova è terminato. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    "Registrare un'applicazione in modo che altre persone possano concederle l'accesso al proprio spazio di lavoro. Ogni app ha la propria identità, la propria lista consentita di reindirizzamento e il proprio audit trail.",
  'developer.ui.apps.emptyTitle': 'Nessuna app registrata',
  'developer.ui.apps.emptyBody':
    "Registra un'app quando un altro prodotto deve agire per conto di un utente Relay. Per la tua automazione, utilizza invece un account di servizio.",
  'developer.ui.apps.emptyExample':
    'Esempio: "Acme Publisher", client riservato, reindirizzamento https://acme.example/oauth/callback, ambiti account:lettura e bozze:scrittura.',
  'developer.ui.apps.typeHelp':
    "Un client riservato viene eseguito su un server che controlli e può mantenerlo segreto. Un client pubblico è un browser o un'app desktop e utilizza PKCE senza segreto.",
  'developer.ui.apps.redirectAdd': 'Aggiungi un URI di reindirizzamento',
  'developer.ui.apps.redirectRemove': 'Rimuovere {uri}',
  'developer.ui.apps.redirectInvalid':
    "Inserisci un URI https completo senza caratteri jolly e senza stringa di query. Deve corrispondere esattamente al valore inviato dall'app.",
  'developer.ui.apps.linksTitle': 'Collegamenti pubblicati',
  'developer.ui.apps.linksHelp':
    "Questi appaiono nella schermata di consenso. Un utente che non può raggiungerlo non concederà l'accesso.",
  'developer.ui.apps.linkUnreachable':
    "Non siamo riusciti a raggiungere questo URL l'ultima volta che abbiamo controllato, {date}.",
  'developer.ui.apps.linkReachable': 'Raggiungibile, controllato {date}',
  'developer.ui.apps.scopesTitle': 'Autorizzazioni che questa app potrebbe richiedere',
  'developer.ui.apps.scopesHelp':
    'Chiedi il minimo di cui hai bisogno. Un utente vede le autorizzazioni di lettura e le autorizzazioni consequenziali come due gruppi separati.',
  'developer.ui.apps.scopeGroup.read': 'Permessi di lettura',
  'developer.ui.apps.scopeGroup.reversible': 'Modifiche che puoi annullare',
  'developer.ui.apps.scopeGroup.consequential': 'Autorizzazioni consequenziali',
  'developer.ui.apps.scopeGroupHelp.read':
    "Questi consentono all'app di esaminare i dati. Non cambia nulla.",
  'developer.ui.apps.scopeGroupHelp.reversible':
    "Questi consentono all'app di creare o modificare elementi all'interno di Relay. Niente raggiunge una piattaforma.",
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Ciò può causare un post su un account reale o modificare chi può raggiungere i tuoi account. Sono sempre elencati separatamente e non sono mai raggruppati.',
  'developer.ui.apps.noBundling':
    "Non esiste un ambito di accesso combinato. La fatturazione e l'amministrazione della connessione vengono sempre richieste per nome.",
  'developer.ui.apps.secretTitle': 'Segreto del cliente',
  'developer.ui.apps.secretWarning':
    "Questa è l'unica volta in cui viene mostrato il segreto client",
  'developer.ui.apps.secretWarningBody':
    "Archivialo ora nel gestore dei segreti lato server. Manteniamo solo un hash. Se lo perdi, ruotalo: non c'è modo di rivelarlo nuovamente.",
  'developer.ui.apps.secretConsumed':
    'Il segreto non viene più visualizzato. Ruotalo se non lo hai memorizzato.',
  'developer.ui.apps.secretStored': 'Ho conservato questo segreto',
  'developer.ui.apps.secretPublicClient':
    'Un cliente pubblico non ha segreti. Utilizza il flusso del codice di autorizzazione con PKCE.',
  'developer.ui.apps.rotateTitle': 'Ruota il segreto client per {app}',
  'developer.ui.apps.rotateConsequence.old':
    "L'attuale segreto smette di funzionare immediatamente.",
  'developer.ui.apps.rotateConsequence.grants':
    'Le concessioni utente esistenti non vengono revocate.',
  'developer.ui.apps.rotateConsequence.deploy':
    'I tuoi server non riescono ad aggiornare i token finché non distribuisci il nuovo valore.',
  'developer.ui.apps.consentPreviewTitle': 'Anteprima della schermata di consenso',
  'developer.ui.apps.consentPreviewHelp':
    "Questo è ciò che vede un utente. Viene generato dal record dell'app, quindi non può promettere più di quanto richiesto dall'app.",
  'developer.ui.apps.consentPreviewSample':
    'Solo anteprima. Non viene concesso nulla e non viene emesso alcun token.',
  'developer.ui.apps.grantsCaption': "Workspace che hanno concesso l'accesso all'app",
  'developer.ui.apps.grantColumn.workspace': 'Workspace',
  'developer.ui.apps.grantColumn.scopes': 'Ambiti',
  'developer.ui.apps.grantColumn.granted': 'Concesso',
  'developer.ui.apps.grantColumn.lastUsed': 'Ultimo usato',
  'developer.ui.apps.grantsEmpty': "Nessuno ha ancora concesso l'accesso a questa app.",
  'developer.ui.apps.logsCaption': 'Richieste recenti, con segreti e payload rimossi',
  'developer.ui.apps.logColumn.time': 'Tempo',
  'developer.ui.apps.logColumn.route': 'Itinerario',
  'developer.ui.apps.logColumn.status': 'Stato',
  'developer.ui.apps.logColumn.workspace': 'Workspace',
  'developer.ui.apps.logsRedacted':
    'I corpi delle richieste e delle risposte vengono archiviati con credenziali, token e contenuti utente rimossi.',
  'developer.ui.apps.sandboxTitle': 'Credenziali della sandbox',
  'developer.ui.apps.sandboxBody':
    "Un ID client e un'area di lavoro separati con dati seminati. Le chiamate effettuate con esso non raggiungono mai un fornitore.",
  'developer.ui.apps.rateLimitLabel': 'Limite di tariffa',
  'developer.ui.apps.rateLimitUsage': "{used} di {limit} richiede quest'ora",
  'developer.ui.apps.disable': 'Disabilita app',
  'developer.ui.apps.enable': 'Abilita app',
  'developer.ui.apps.disabledBody':
    'Questa app è disabilitata. I token esistenti vengono rifiutati e non è possibile avviare una nuova sovvenzione. Le sovvenzioni vengono mantenute in modo da poterle riattivare.',
  'developer.ui.apps.deleteTitle': 'Elimina {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Ogni concessione viene revocata e ogni token smette di funzionare.',
  'developer.ui.apps.deleteConsequence.logs':
    'I registri delle richieste vengono conservati per il periodo di conservazione del controllo.',
  'developer.ui.apps.deleteConsequence.irreversible': "L'ID client non può essere riutilizzato.",

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Consegne HTTPS firmate per gli eventi che scegli. Ogni consegna viene registrata con la relativa risposta e qualsiasi consegna può essere inviata nuovamente.',
  'developer.ui.webhooks.emptyTitle': 'Nessun endpoint ancora',
  'developer.ui.webhooks.emptyBody':
    'Aggiungi un endpoint per ricevere risultati di pubblicazione, decisioni di approvazione e integrità della connessione nei tuoi sistemi.',
  'developer.ui.webhooks.emptyExample':
    'Esempio: https://hooks.acme.example/relay, iscritto a post.published, post.failed e Connection.action_required.',
  'developer.ui.webhooks.create': 'Aggiungi un punto finale',
  'developer.ui.webhooks.url': "URL dell'endpoint",
  'developer.ui.webhooks.urlHelp':
    'Solo HTTPS. Non seguiamo reindirizzamenti e non riproviamo un 2xx.',
  'developer.ui.webhooks.eventsTitle': 'Eventi',
  'developer.ui.webhooks.eventsHelp':
    'Scegli gli eventi che gestisci. Inviare tutto a un endpoint che ne ignora la maggior parte rende più difficile vedere gli errori.',
  'developer.ui.webhooks.eventsAll': 'Ogni evento',
  'developer.ui.webhooks.eventsSelected': 'Solo gli eventi che seleziono',
  'developer.ui.webhooks.eventsCount':
    '{count, plural, one {# evento} many {# eventi} other {# eventi}}',
  'developer.ui.webhooks.eventGroup.connections': 'Connessioni',
  'developer.ui.webhooks.eventGroup.content': 'Contenuto e approvazione',
  'developer.ui.webhooks.eventGroup.publishing': 'Editoria',
  'developer.ui.webhooks.eventGroup.automation': 'Automazione e feed',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'Project e account',
  'developer.ui.webhooks.scopeAll': 'Ogni marchio e account',
  'developer.ui.webhooks.scopeSelected': 'Solo quelli che seleziono',
  'developer.ui.webhooks.secretTitle': 'Firma segreta',
  'developer.ui.webhooks.secretBody':
    "Verificare l'intestazione della firma prima di analizzare un corpo. Deduplica sull'ID di consegna, che è stabile tra i tentativi.",
  'developer.ui.webhooks.secretRotateTitle': 'Ruota il segreto di firma',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Entrambi i segreti vengono accettati per 24 ore, quindi puoi distribuirli senza perdere una consegna.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Dopo quella finestra viene utilizzato solo il nuovo segreto.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Invia un evento di esempio firmato contrassegnato come test, in modo che il destinatario possa ignorarlo in sicurezza.',
  'developer.ui.webhooks.testDeliverySent':
    'Consegna di prova inviata. Il risultato viene visualizzato nel registro sottostante.',
  'developer.ui.webhooks.deliveriesCaption': 'Consegne recenti e la risposta ricevuta da ciascuna',
  'developer.ui.webhooks.deliveryColumn.time': 'Richiesto',
  'developer.ui.webhooks.deliveryColumn.event': 'Evento',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Tentativo',
  'developer.ui.webhooks.deliveryColumn.response': 'Risposta',
  'developer.ui.webhooks.deliveryColumn.status': 'Stato',
  'developer.ui.webhooks.deliveryStatus.pending': 'In attesa',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Consegnato',
  'developer.ui.webhooks.deliveryStatus.failed': 'Fallito, riproveremo',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Fallito, nessun altro tentativo',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Non inviato, endpoint disabilitato',
  'developer.ui.webhooks.deliveryNoResponse': 'Nessuna risposta ricevuta',
  'developer.ui.webhooks.deliveryNextAttempt': 'Prossimo tentativo {relativeTime}',
  'developer.ui.webhooks.inspect': 'Ispezionare la consegna',
  'developer.ui.webhooks.inspectTitle': 'Consegna {id}',
  'developer.ui.webhooks.inspectRequest': 'Richiedi corpo',
  'developer.ui.webhooks.inspectResponse': 'Corpo della risposta',
  'developer.ui.webhooks.redeliver': 'Invia di nuovo questa consegna',
  'developer.ui.webhooks.redeliverHelp':
    'Lo stesso ID evento viene inviato nuovamente con il flag di riconsegna impostato, quindi un destinatario idempotente lo ignora in modo sicuro.',
  'developer.ui.webhooks.redelivered': 'In coda per la riconsegna.',
  'developer.ui.webhooks.failureTitle': 'Questo endpoint non funziona',
  'developer.ui.webhooks.failureBody':
    "{count, plural, one {# consegne consecutive non riuscite} many {# consegne consecutive non riuscite} other {# consegne consecutive non riuscite}}. Dopo errori consecutivi {limit}, l'endpoint viene disabilitato e viene archiviata un'azione.",
  'developer.ui.webhooks.disabledTitle':
    'Questo endpoint è stato disabilitato dopo ripetuti errori',
  'developer.ui.webhooks.disabledBody':
    "Abbiamo interrotto l'invio in modo che la tua coda non si riempia. Correggi il ricevitore, invia una consegna di prova, quindi riattivalo.",
  'developer.ui.webhooks.lastSuccessLabel': 'Ultimo successo',
  'developer.ui.webhooks.lastSuccessNever': 'Nessuna consegna è mai riuscita',
  'developer.ui.webhooks.deleteTitle': 'Elimina questo endpoint',
  'developer.ui.webhooks.deleteConsequence.stop': 'Non viene inviato altro a questo URL.',
  'developer.ui.webhooks.deleteConsequence.logs':
    "I registri di consegna vengono conservati per il periodo di conservazione dell'audit.",

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'One plan, two intervals. Polar is the merchant of record: it holds the payment method, issues invoices and handles cancellation.',
  'billing.ui.statusHeading': 'Current status',
  'billing.ui.planHeading': 'Plan',
  'billing.ui.intervalHeading': 'Billing interval',
  'billing.ui.usageHeading': 'Metered provider usage',
  'billing.ui.invoicesHeading': 'Invoices',
  'billing.ui.cancelHeading': 'Cancellation',
  'billing.ui.trialDaysRemaining':
    'Trial, {count, plural, =0 {ends today} one {# day remaining} many {# days remaining} other {# days remaining}}',
  'billing.ui.convertsOn': 'Converts on {date} to {amount} per {interval}.',
  'billing.ui.dueToday': '$0 due today',
  'billing.ui.conversionLabel': 'Converts',
  'billing.ui.channelsLabel': 'Active channels',
  'billing.ui.paymentMethodPolar': 'Payment method held by Polar',
  'billing.ui.paymentMethodDescriptor': '{project} ending {last4}, expires {expiry}',
  'billing.ui.paymentMethodMissing': 'No payment method on file yet',
  'billing.ui.cancelBeforeDate': 'Cancel before {date} and you will not be charged.',
  'billing.ui.annualFraming': '$25/month billed annually. Save $48/year.',
  'billing.ui.monthlyOption': '$29 per month',
  'billing.ui.annualOption': '$300 per year',
  'billing.ui.intervalChangeHelp':
    'Changing the interval takes effect at the next renewal. Polar prorates it and shows the exact amount before you confirm.',
  'billing.ui.intervalChangedAnnouncement': 'Billing interval set to {interval}.',
  'billing.ui.allowanceChannels':
    '30 active social channels. A channel is one connected account, page or channel.',
  'billing.ui.allowanceChannelsUsage': '{used} of {limit} active channels',
  'billing.ui.allowanceFairUse':
    'Fair use means anti spam, rate and provider cost controls. They apply the same way to every subscriber and are published, not discretionary.',
  'billing.ui.allowanceMetered':
    'X and some other providers charge per operation. Those charges are passed through at cost and are not part of the plan price.',
  'billing.ui.allowanceNoMedia':
    'Image generation and video generation are not included and are not sold. Relay does not generate media.',
  'billing.ui.readFairUse': 'Read the fair use policy',
  'billing.ui.readMeteredPolicy': 'Read how metered usage is billed',
  'billing.ui.usageCaption': 'Metered provider usage this period, billed at cost',
  'billing.ui.usageColumn.item': 'Item',
  'billing.ui.usageColumn.quantity': 'Quantity',
  'billing.ui.usageColumn.unitPrice': 'Unit price',
  'billing.ui.usageColumn.amount': 'Amount',
  'billing.ui.usageTotal': 'Total this period',
  'billing.ui.usagePeriod': 'Period {start} to {end}',
  'billing.ui.usageSource': 'Prices published by the provider. Verified {date}.',
  'billing.ui.usageReconciled': 'Reconciled against the provider invoice on {date}.',
  'billing.ui.usagePending': 'Not reconciled yet. The final amount can move slightly.',
  'billing.ui.usageUnavailableReason':
    'The provider has not returned usage for this period yet. It is normally available within 24 hours.',
  'billing.ui.usageEmpty': 'No metered usage this period.',
  'billing.ui.spendAlert': 'Spend alert',
  'billing.ui.spendAlertHelp':
    'We email you when metered usage passes this amount in a billing period.',
  'billing.ui.spendAlertPause': 'Also pause metered actions when the alert is reached',
  'billing.ui.balanceLabel': 'Usage balance',
  'billing.ui.balanceHelp': 'Metered usage is drawn from this balance and invoiced by Polar.',
  'billing.ui.invoicesCaption': 'Invoices issued by Polar',
  'billing.ui.invoiceColumn.date': 'Date',
  'billing.ui.invoiceColumn.description': 'Description',
  'billing.ui.invoiceColumn.amount': 'Amount',
  'billing.ui.invoiceColumn.state': 'State',
  'billing.ui.invoiceState.paid': 'Paid',
  'billing.ui.invoiceState.open': 'Open',
  'billing.ui.invoiceState.uncollectible': 'Not collected',
  'billing.ui.invoiceState.refunded': 'Refunded',
  'billing.ui.invoicesEmpty': 'No invoice yet. The first one is issued when the trial converts.',
  'billing.ui.invoicesInPortal': 'Every invoice and receipt is available in the Polar portal.',
  'billing.ui.portalHelp':
    'The portal is where you change the payment method, download invoices and cancel. It opens in a new tab.',
  'billing.ui.pastDueHeading': 'Payment overdue',
  'billing.ui.pastDueBody':
    'The last payment did not go through. Update the payment method in the Polar portal to keep publishing.',
  'billing.ui.gracePolicy':
    'Scheduled posts keep running until {date}. After that the workspace becomes read only: nothing is deleted and nothing is published.',
  'billing.ui.cancelBody':
    'Cancelling is one action and takes effect at the end of the period you have paid for. There is no call to make and no form to fill in.',
  'billing.ui.cancelStart': 'Cancel subscription',
  'billing.ui.cancelDialogTitle': 'Cancel this subscription',
  'billing.ui.cancelConsequence.noCharge':
    'You will not be charged. Nothing is taken today or on {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'You keep every feature until {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Drafts, receipts, media and analytics stay in this workspace.',
  'billing.ui.cancelConsequence.scheduled':
    'Posts scheduled after {date} will not publish. Cancel or reschedule them before then.',
  'billing.ui.cancelConsequence.restart': 'You can start the subscription again at any time.',
  'billing.ui.cancelConfirm': 'Cancel subscription',
  'billing.ui.cancelKeep': 'Keep subscription',
  'billing.ui.cancelConfirmedBeforeConversion': 'Canceled. You will not be charged.',
  'billing.ui.cancelConfirmedAfterConversion': 'Canceled. Access continues until {date}.',
  'billing.ui.cancelAnnouncement': 'Subscription canceled.',
  'billing.ui.canceledNotice': 'This subscription is canceled.',
  'billing.ui.resume': 'Start the subscription again',
  'billing.ui.noSubscriptionTitle': 'No subscription on this workspace',
  'billing.ui.noSubscriptionBody':
    'Start the seven day trial to publish. Polar collects a payment method and charges nothing today.',
  'billing.ui.noSubscriptionExample':
    'Monthly is $29. Annual is $300, which is $25/month billed annually. Save $48/year.',
  'billing.ui.overChannelLimitAction': 'Review connected channels',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'Rispondi a una breve assunzione, conferma ciò che abbiamo capito e ottieni un piano che puoi accettare articolo per articolo. Propone lavoro. Non pianifica né pubblica mai nulla da solo.',
  'growth.ui.step.intake': 'Assunzione',
  'growth.ui.step.confirm': 'Conferma',
  'growth.ui.step.plan': 'Piano',
  'growth.ui.stepIndicator': 'Passaggio {current} di {total}: {name}',
  'growth.ui.intake.section.product': 'Prodotto',
  'growth.ui.intake.section.audience': 'Pubblico e mercati',
  'growth.ui.intake.section.objective': 'Obiettivo',
  'growth.ui.intake.section.capacity': 'Canali e capacità',
  'growth.ui.intake.section.limits': 'Cosa è vietato',
  'growth.ui.intake.help':
    'Niente qui è indovinato per te. Tutto ciò che lasci vuoto viene contrassegnato come mancante anziché compilato.',
  'growth.ui.intake.productNameHelp': 'Il nome che usi con i clienti.',
  'growth.ui.intake.siteUrlHelp':
    'Leggiamo la pagina che ci fornisci come materiale di partenza. Confermi ogni fatto che ne deduciamo.',
  'growth.ui.intake.descriptionHelp': 'Cosa vendi e a chi è destinato, con parole tue.',
  'growth.ui.intake.marketsHelp': 'Paesi o regioni. Uno per riga.',
  'growth.ui.intake.localesHelp': 'Le lingue in cui pubblicherai.',
  'growth.ui.intake.objectiveHelp': 'Cosa vuoi di più nel prossimo trimestre.',
  'growth.ui.intake.conversionHelp':
    "L'azione che puoi effettivamente misurare. Una registrazione, una demo, un acquisto.",
  'growth.ui.intake.proofHelp':
    'Case study, benchmark eseguiti, screenshot di tua proprietà, autorizzazioni che già possiedi. Uno per riga.',
  'growth.ui.intake.proofNone': 'Non ho ancora prove approvate',
  'growth.ui.intake.proofNoneEffect':
    'Il piano eviterà completamente i risultati dei clienti e le richieste di risultato.',
  'growth.ui.intake.channelsHelp': 'Gli account da cui già pubblichi.',
  'growth.ui.intake.capacityHelp': 'Sii onesto. Un piano che non puoi eseguire non è un piano.',
  'growth.ui.intake.competitorsHelp': 'Facoltativo. Uno per riga.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Reclami che non puoi avanzare per motivi legali o politici. Uno per riga.',
  'growth.ui.intake.prohibitedTopicsHelp': 'Argomenti da cui stare alla larga. Uno per riga.',
  'growth.ui.intake.submit': 'Rivedere ciò che abbiamo capito',
  'growth.ui.intake.savedAnnouncement': 'Profilo aziendale salvato.',
  'growth.ui.intake.requiredMissing':
    'Compila i campi contrassegnati come obbligatori prima di continuare.',

  'growth.ui.confirm.factsTitle': 'Fatti che hai confermato',
  'growth.ui.confirm.factsHelp': 'Questi possono essere utilizzati in copia.',
  'growth.ui.confirm.assumptionsTitle': 'Supposizioni che abbiamo fatto',
  'growth.ui.confirm.assumptionsHelp':
    'Questi non sono fatti. Danno forma al piano ma non diventano mai una rivendicazione in un post.',
  'growth.ui.confirm.missingTitle': 'Mancante',
  'growth.ui.confirm.missingHelp':
    'Il piano gira attorno a ciascuno di questi aspetti e lo dice dove conta.',
  'growth.ui.confirm.confidence.label': 'Fiducia: {level}',
  'growth.ui.confirm.confidence.low': 'basso',
  'growth.ui.confirm.confidence.medium': 'medio',
  'growth.ui.confirm.confidence.high': 'alto',
  'growth.ui.confirm.promote': 'Confermalo come un dato di fatto',
  'growth.ui.confirm.correct': 'Correggilo',
  'growth.ui.confirm.correctLabel': 'La tua correzione',
  'growth.ui.confirm.generate': 'Genera il piano',
  'growth.ui.confirm.announcement': 'Profilo aziendale confermato.',

  'growth.ui.plan.generatingBody':
    "L'operazione richiede alcuni secondi. Puoi lasciare questa pagina: il piano termina da solo.",
  'growth.ui.plan.stateDraft': 'Bozza, non approvata',
  'growth.ui.plan.stateApproved': 'Approvato',
  'growth.ui.plan.stateSuperseded': 'Sostituito da una versione più recente',
  'growth.ui.plan.newVersionNotice':
    'Un aggiornamento crea la versione {version} e lascia intatta la versione approvata.',
  'growth.ui.plan.emptyTitle': 'Nessun piano ancora',
  'growth.ui.plan.emptyBody':
    'Compila il profilo aziendale e costruiremo un piano in base ai fatti che confermi.',
  'growth.ui.plan.emptyExample':
    'Un piano contiene una strategia, quattro settimane di brief, una campagna UGC, opportunità supportate dal catalogo e fino a cinque strumenti.',
  'growth.ui.plan.tabsLabel': 'Sezioni del piano',
  'growth.ui.plan.modelNote': 'Generato da {model}, prompt {promptVersion}, su {date}.',

  'growth.ui.strategy.snapshotTitle': 'Istantanea aziendale',
  'growth.ui.strategy.channelPriority': 'Priorità {rank}',
  'growth.ui.strategy.channelFormats': 'Formati nativi',
  'growth.ui.strategy.pillarProof': 'La prova su cui si appoggia questo pilastro',
  'growth.ui.strategy.pillarProofNone':
    'Nessuna prova approvata. Mantieni questo pilastro descrittivo.',
  'growth.ui.strategy.cadenceCaption': 'Post a settimana per canale',
  'growth.ui.strategy.cadenceColumn.channel': 'Canale',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Post a settimana',
  'growth.ui.strategy.cadenceTotal': 'Totale a settimana',
  'growth.ui.strategy.capacityWarning':
    'Questa cadenza è di {planned} post a settimana a fronte di una capacità dichiarata di {capacity} ore. Ridurlo o aumentare la capacità nel profilo.',
  'growth.ui.strategy.measurementBody':
    'Rispetto ai tuoi post finali sullo stesso canale e formato. Non viene utilizzato alcun benchmark esterno perché nessuno è paragonabile al tuo account.',
  'growth.ui.strategy.localeAdaptations': 'Note sulla lingua',

  'growth.ui.fourWeek.caption': 'Brief proposti per settimana e giorno',
  'growth.ui.fourWeek.column.date': 'Data',
  'growth.ui.fourWeek.column.channel': 'Canale',
  'growth.ui.fourWeek.column.pillar': 'Pilastro',
  'growth.ui.fourWeek.column.format': 'Formato',
  'growth.ui.fourWeek.column.brief': 'Breve',
  'growth.ui.fourWeek.column.cta': "Invito all'azione",
  'growth.ui.fourWeek.column.measurement': 'Etichetta di misurazione',
  'growth.ui.fourWeek.column.actions': 'Azioni',
  'growth.ui.fourWeek.approvalRequired': "È richiesta l'approvazione prima della pubblicazione",
  'growth.ui.fourWeek.approvalNotRequired': 'Nessuna approvazione richiesta per questo account',
  'growth.ui.fourWeek.noCta': "Nessun invito all'azione",
  'growth.ui.fourWeek.weekEmpty': 'Nessun brief proposto per questa settimana.',
  'growth.ui.fourWeek.acceptedCount': '{accepted} di {total} brief accettati come bozze',
  'growth.ui.fourWeek.acceptAnnouncement': 'Bozza creata da questo brief.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Proposta di calendario aggiunta per {date}.',

  'growth.ui.ugc.promptAngle': 'Angolo {number}',
  'growth.ui.ugc.checklistTitle': 'Diritti, consenso e trasparenza',
  'growth.ui.ugc.checklistHelp':
    'Esamina questo aspetto con ogni partecipante prima che venga pubblicato qualcosa. Il consenso a comparire non è consenso a fare pubblicità.',
  'growth.ui.ugc.incentiveNone': 'Nessun incentivo offerto',
  'growth.ui.ugc.incentiveDisclosure':
    'Un incentivo deve essere dichiarato in ogni post che ne deriva, sia da te che dal partecipante.',
  'growth.ui.ugc.honesty':
    'Questo pianifica una campagna che gestisci tu con persone reali. Relay non cerca creator, non li contatta, non scrive testimonianze né crea contenuti per i clienti.',

  'growth.ui.opportunities.caption':
    'Opportunità verificate dal catalogo, classificate in base alla compatibilità con il tuo profilo',
  'growth.ui.opportunities.column.opportunity': 'Opportunità',
  'growth.ui.opportunities.column.type': 'Digitare',
  'growth.ui.opportunities.column.audience': 'Pubblico',
  'growth.ui.opportunities.column.fit': 'Perché questo si adatta',
  'growth.ui.opportunities.column.requirements': 'Requisiti',
  'growth.ui.opportunities.column.rules': 'Regole di autopromozione',
  'growth.ui.opportunities.column.cost': 'Costo',
  'growth.ui.opportunities.column.effort': 'Sforzo',
  'growth.ui.opportunities.column.verified': 'Ultimo verificato',
  'growth.ui.opportunities.column.actions': 'Azioni',
  'growth.ui.opportunities.costFree': 'Gratuito',
  'growth.ui.opportunities.effort.low': 'Basso',
  'growth.ui.opportunities.effort.medium': 'Medio',
  'growth.ui.opportunities.effort.high': 'Alto',
  'growth.ui.opportunities.noRequiredAsset': 'Nessuna risorsa richiesta',
  'growth.ui.opportunities.prepareTitle': 'Prepara una presentazione per {name}',
  'growth.ui.opportunities.prepareRules': 'Le loro regole, citate',
  'growth.ui.opportunities.prepareChecklist': 'Cosa avere pronto',
  'growth.ui.opportunities.prepareManual':
    'Lo invii tu stesso sul loro sito. Relay non compila moduli, non crea account né invia e-mail a nessuno.',
  'growth.ui.opportunities.pitchTitle': 'Bozza del passo',
  'growth.ui.opportunities.pitchHelp':
    'Modificalo prima di inviarlo. Utilizza solo i fatti che hai confermato.',
  'growth.ui.opportunities.submittedOn': 'Inserito {date}',
  'growth.ui.opportunities.staleTitle': 'Alcune voci necessitano di una nuova verifica',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# voci hanno superato la data di revisione} many {# voci hanno superato la data di revisione} other {# voci hanno superato la data di revisione}}. Controlla le regole attuali sul sito prima di fare affidamento su di esse.',
  'growth.ui.opportunities.emptyExample':
    "Una riga del catalogo riporta l'URL ufficiale, il pubblico, le regole di invio citate dal sito, il costo, l'impegno e la data dell'ultima volta in cui una persona l'ha controllato.",

  'growth.ui.tools.shown': '{shown} di {max} mostrato',
  'growth.ui.tools.fewerThanMax':
    "Solo {count, plural, one {# strumento corrisponde} many {# strumenti corrispondono} other {# strumenti corrispondono}} questo flusso di lavoro con una revisione corrente. Preferiremmo mostrarne meno piuttosto che riempire l'elenco.",
  'growth.ui.tools.emptyTitle':
    'Nessuno strumento recensito si adatta ancora a questo flusso di lavoro',
  'growth.ui.tools.emptyBody':
    'Ogni voce necessita di un prezzo controllato, dei termini dei diritti controllati e di una limitazione denominata prima di apparire qui.',
  'growth.ui.tools.emptyExample':
    "Una voce indica per cosa è meglio, perché si adatta al tuo piano, cosa non può fare, le competenze di cui ha bisogno, come l'output ritorna in Relay e quando è stato controllato l'ultima volta il prezzo.",
  'growth.ui.tools.openSite': 'Apri il sito ufficiale di {name}',
  'growth.ui.tools.stale': 'Oltre la data di revisione. Escluso dai piani generati.',

  'growth.ui.item.explainTitle': 'Perché è stato suggerito questo',
  'growth.ui.item.explainEvidence': 'Su cosa si basa',
  'growth.ui.item.explainNoEvidence':
    "Ciò deriva dall'obiettivo e dalle regole del canale, non da un fatto confermato sulla tua attività.",
  'growth.ui.item.dismissTitle': 'Ignora questo suggerimento',
  'growth.ui.item.dismissBody':
    'Dicci perché. Il motivo viene memorizzato insieme al progetto e dà forma alla versione successiva.',
  'growth.ui.item.dismissReasonLabel': 'Motivo',
  'growth.ui.item.dismissReason.notRelevant': 'Non rilevante per questa attività',
  'growth.ui.item.dismissReason.noCapacity': 'Non ne abbiamo la capacità',
  'growth.ui.item.dismissReason.wrongAudience': 'Pubblico sbagliato',
  'growth.ui.item.dismissReason.alreadyDone': 'Lo facciamo già',
  'growth.ui.item.dismissReason.policy': 'Contro la nostra politica o le nostre rivendicazioni',
  'growth.ui.item.dismissReason.other': "Qualcos'altro",
  'growth.ui.item.dismissNote': 'Tutto quello che vuoi aggiungere',
  'growth.ui.item.dismissed': 'Licenziato. Rimane visibile in modo da poterlo annullare.',
  'growth.ui.item.undoDismiss': 'Annulla Ignora',

  'growth.ui.export.title': 'Esporta questo piano',
  'growth.ui.export.formatLabel': 'Formato',
  'growth.ui.export.copy': 'Copia negli appunti',
  'growth.ui.export.download': 'Scarica file',
  'growth.ui.export.copied': 'Piano copiato negli appunti.',
  'growth.ui.export.schemaNote':
    'Tutti e tre i formati provengono da uno schema convalidato, versione {version}. Le visualizzazioni strutturate sono sicure per il controllo del codice sorgente e non contengono segreti.',
  'growth.ui.export.previewLabel': "Anteprima dell'esportazione",
} as const;
