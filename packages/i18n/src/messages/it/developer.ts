/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Agenti e API',
  'developer.subtitle':
    "L'API, il server MCP e la CLI utilizzano le stesse autorizzazioni, criteri di approvazione e ricevute dell'app.",

  'developer.serviceAccount.title': 'Conti di servizio',
  'developer.serviceAccount.create': 'Crea un account di servizio',
  'developer.serviceAccount.name': 'Nome',
  'developer.serviceAccount.scopeProjects': 'Progetti e account che può utilizzare',
  'developer.serviceAccount.scopePlatforms': 'Piattaforme',
  'developer.serviceAccount.scopeLocales': 'Lingue dei contenuti',
  'developer.serviceAccount.scopeDomains': 'Domini di collegamento consentiti',
  'developer.serviceAccount.scopeHours': 'Orari consentiti',
  'developer.serviceAccount.scopeCadence': 'Numero massimo di post al giorno',
  'developer.serviceAccount.scopeLookAhead': 'Con quanto anticipo potrebbe programmare',
  'developer.serviceAccount.approvalLevel': 'Livello di approvazione',
  'developer.serviceAccount.killSwitch': 'Ferma questo agente',

  'developer.approvalLevel.0': 'Solo leggere e convalidare',
  'developer.approvalLevel.1': 'Creare e modificare bozze',
  'developer.approvalLevel.2': 'Programma entro i limiti sopra stabiliti',
  'developer.approvalLevel.3': 'Chiedi a una persona prima di pubblicare',
  'developer.approvalLevel.description.0':
    "L'agente può esaminare account, funzionalità, calendari e analisi. Non cambia nulla.",
  'developer.approvalLevel.description.1':
    "L'agente può scrivere bozze. Una persona pianifica e pubblica ancora.",
  'developer.approvalLevel.description.2':
    "L'agente può pianificare in base agli account, alle ore, alla cadenza, alle lingue, ai domini e guardare avanti da te impostati. Qualunque cosa al di fuori di questi limiti ha bisogno di una persona.",
  'developer.approvalLevel.description.3':
    "La pubblicazione immediata, un nuovo account o dominio, un'azione collettiva, contenuti sensibili o una modifica delle impostazioni sulla privacy necessitano sempre di una conferma esplicita da parte di una persona.",
  'developer.bulkThreshold':
    'Collettivo significa più di {publications, plural, one {# pubblicazione esterna} many {# pubblicazioni esterne} other {# pubblicazioni esterne}} in una richiesta oppure lo stesso contenuto per più di {accounts, plural, one {# account} many {# account} other {# account}}.',

  'developer.credential.title': 'Credenziali',
  'developer.credential.create': 'Crea una chiave API',
  'developer.credential.shownOnce':
    'Questa credenziale viene mostrata una volta. Copialo adesso. Ne memorizziamo solo un hash.',
  'developer.credential.prefix': 'Prefisso',
  'developer.credential.created': 'Creato {date} da {name}',
  'developer.credential.lastUsed': 'Ultimo utilizzato {relativeTime}',
  'developer.credential.neverUsed': 'Mai usato',
  'developer.credential.expires': 'Scade {date}',
  'developer.credential.revokeConfirm':
    'Revocare questa credenziale? Qualunque cosa lo utilizzi smette di funzionare immediatamente.',

  'developer.scope.title': 'Ambiti',
  'developer.scope.accountsRead': 'Leggi gli account collegati e le loro funzionalità',
  'developer.scope.draftsWrite': 'Creare e modificare bozze',
  'developer.scope.postsSchedule': 'Pianifica i contenuti approvati',
  'developer.scope.postsPublish': 'Pubblica immediatamente',
  'developer.scope.analyticsRead': "Leggi l'analisi",
  'developer.scope.receiptsRead': 'Leggere le ricevute di pubblicazione',
  'developer.scope.webhooksWrite': 'Gestisci webhook',
  'developer.scope.connectionsAdmin': 'Connetti e disconnetti gli account',
  'developer.scope.billingRead': 'Leggi lo stato di fatturazione',
  'developer.scope.consequential': 'Consequenziale',
  'developer.scope.readOnly': 'Sola lettura',

  'developer.setup.title': 'Connetti un cliente',
  'developer.setup.claudeCode': 'Codice Claudio',
  'developer.setup.codex': 'Codice',
  'developer.setup.hermes': 'Ermes',
  'developer.setup.buzz': 'Flusso di lavoro buzz',
  'developer.setup.cli': 'CLI',
  'developer.setup.genericMcp': 'Qualsiasi client MCP',
  'developer.setup.copyConfig': 'Copia configurazione',
  'developer.setup.mcpEndpoint': 'Punto finale MCP',
  'developer.setup.apiBaseUrl': "URL di base dell'API",

  'developer.playground.title': 'Prova a secco',
  'developer.playground.description':
    'Esegui strumenti rispetto ai dati seminati. Niente raggiunge una piattaforma reale.',
  'developer.playground.run': 'Corri',
  'developer.playground.sandboxBadge': 'Sabbiera',

  'developer.activity.title': 'Attività recente',
  'developer.activity.toolCall': '{tool} chiamato da {actor} {relativeTime}',
  'developer.activity.denied': 'Negato: {reason}',
  'developer.activity.empty': 'Nessuna chiamata ancora.',
  'developer.activity.redacted':
    'I corpi delle richieste e delle risposte vengono archiviati con i segreti rimossi.',

  'developer.apps.title': 'App per sviluppatori',
  'developer.apps.subtitle':
    'Consenti a un altro prodotto di agire tramite Relay con le autorizzazioni concesse da un utente.',
  'developer.apps.create': "Registra un'app",
  'developer.apps.name': "Nome dell'app",
  'developer.apps.type.label': 'Tipologia cliente',
  'developer.apps.type.public': 'Pubblico, non può mantenere un segreto',
  'developer.apps.type.confidential': 'Riservato, viene eseguito su un server',
  'developer.apps.homepage': 'URL della home page',
  'developer.apps.privacyUrl': "URL dell'informativa sulla privacy",
  'developer.apps.termsUrl': 'URL dei termini',
  'developer.apps.logo': 'Marchio',
  'developer.apps.redirectUris': 'Reindirizzare gli URI',
  'developer.apps.redirectUrisHelp':
    'Solo corrispondenze esatte. I caratteri jolly e i percorsi parziali vengono rifiutati.',
  'developer.apps.clientId': 'ID cliente',
  'developer.apps.clientSecret': 'Segreto del cliente',
  'developer.apps.secretShownOnce':
    'Il segreto viene mostrato una volta. Ruotalo se lo perdi. Non lo mostreremo più.',
  'developer.apps.status.draft': 'Bozza',
  'developer.apps.status.active': 'Attivo',
  'developer.apps.status.disabled': 'Disabilitato',
  'developer.apps.consentPreview': 'Anteprima della schermata di consenso',
  'developer.apps.grants.title': 'Sovvenzioni attive',
  'developer.apps.grants.count':
    '{count, plural, one {# sovvenzioni} many {# sovvenzioni} other {# sovvenzioni}}',
  'developer.apps.deleteConfirm':
    'Eliminare questa app? Ogni concessione viene revocata e i suoi token smettono di funzionare.',

  'developer.consent.title': '{app} vuole accedere al tuo spazio di lavoro',
  'developer.consent.workspace': 'Workspace',
  'developer.consent.projects': 'Progetti e account',
  'developer.consent.willBeAbleTo': '{app} sarà in grado di farlo',
  'developer.consent.willNotBeAbleTo': '{app} non sarà in grado di farlo',
  'developer.consent.approvalStillApplies':
    'La tua politica di approvazione è ancora valida. Questa app non può pubblicare attorno ad essa.',
  'developer.consent.revokeAnyTime': 'Puoi revocarlo dalle Impostazioni in qualsiasi momento.',
  'developer.consent.allow': "Consenti l'accesso",
  'developer.consent.deny': 'Non consentire',
  'developer.consent.developerIdentity': 'Pubblicato da {developer}',

  'developer.grants.title': 'App con accesso',
  'developer.grants.grantedOn': 'Concesso {date}',
  'developer.grants.lastUsed': 'Ultimo utilizzato {relativeTime}',
  'developer.grants.revoke': "Revoca l'accesso",
  'developer.grants.revoked':
    'Accesso revocato. Le tue connessioni e i post programmati non sono interessati.',

  'developer.docs.openapi': 'Documento OpenAPI',
  'developer.docs.clients': 'Clienti generati',
  'developer.docs.idempotency':
    'Invia una chiave di idempotenza con ogni richiesta di creazione, pianificazione e pubblicazione. La ripetizione di una richiesta con la stessa chiave restituisce il risultato originale invece di pubblicarla due volte.',
  'developer.docs.pagination':
    'I risultati vengono impaginati con il cursore. Gli orari sono espliciti e includono una zona.',
  'developer.docs.rateLimits':
    'I limiti di velocità si applicano per area di lavoro, credenziale, percorso e connettore.',
} as const;
