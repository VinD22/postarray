/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'Connessioni',
  'connection.subtitle':
    'Gli account, le Pagine e i canali su cui questo spazio di lavoro può pubblicare.',
  'connection.add': 'Collega un account',
  'connection.count':
    '{used, plural, one {# canale attivo} many {# canali attivi} other {# canali attivi}} di {limit}',
  'connection.limitReached':
    'Questo spazio di lavoro utilizza tutti i canali {limit}. Scollegarne uno prima di collegarne un altro.',

  'connection.account.label': 'Conto',
  'connection.account.type.profile': 'Profilo',
  'connection.account.type.page': 'Pagina',
  'connection.account.type.channel': 'Canale',
  'connection.account.type.group': 'Gruppo',
  'connection.account.type.organization': 'Organizzazione',
  'connection.account.type.business': 'Conto aziendale',
  'connection.account.type.creator': 'Conto Creatore',
  'connection.connectedBy': 'Connesso da {name} su {date}',
  'connection.lastPublished': 'Ultimo pubblicato {relativeTime}',
  'connection.lastPublishedNever': 'Non è stato ancora pubblicato nulla da questo account',
  'connection.lastAnalyticsSync': 'Analytics sincronizzato {relativeTime}',

  'connection.status.healthy': 'Funzionante',
  'connection.status.expiringSoon': 'Scade {relativeTime}',
  'connection.status.expired': 'Accesso scaduto',
  'connection.status.revoked': 'Accesso revocato',
  'connection.status.paused': 'In pausa',
  'connection.status.permissionMissing': 'Autorizzazione mancante',
  'connection.status.reviewPending': 'In attesa della revisione della piattaforma',
  'connection.status.unknown': 'Salute non disponibile',

  'connection.token.expiresAt': "L'accesso scade {date}",
  'connection.token.expiryUnknown': '{provider} non ci dice quando scade questo accesso.',

  'connection.permissions.title': 'Autorizzazioni',
  'connection.permissions.granted': 'Concesso',
  'connection.permissions.missing': 'Non concesso',
  'connection.permissions.explainBeforeOAuth':
    'Relay chiederà a {provider} queste autorizzazioni. Puoi disconnetterti in qualsiasi momento.',
  'connection.permissions.whyNeeded': 'Perché questo è necessario',

  'connection.reconnect.title': 'Ricollegare {account}',
  'connection.reconnect.body':
    'I post pianificati per questo account saranno sospesi finché non verrà ricollegato. Niente è perduto.',
  'connection.disconnect.title': 'Disconnettere {account}?',
  'connection.disconnect.body':
    "I post pianificati per questo account non verranno pubblicati. Le ricevute e le analisi già raccolte rimangono in quest'area di lavoro.",
  'connection.pause.body':
    'Un account in pausa conserva la sua cronologia e la sua pianificazione, ma non pubblica finché non lo riprendi.',

  'connection.incident.invalidToken':
    "{provider} ha rifiutato l'accesso memorizzato per {account}. Riconnettiti per ripristinare la pubblicazione.",
  'connection.incident.permissionLost':
    '{account} non fornisce più {permission}. Riconnettiti e accetta tale autorizzazione.',
  'connection.incident.roleLost':
    'Il tuo utente {provider} non ha più un ruolo su {account}. Chiedi a un amministratore di quella pagina di ripristinarla.',
  'connection.incident.accountTypeInvalid':
    'Instagram ha bisogno di un account professionale. Passa da {account} a un account aziendale o creatore, quindi riconnettiti.',
  'connection.incident.reviewRestricted':
    '{provider} ha limitato questa app in attesa di revisione. I post di {account} vengono pubblicati in privato fino al completamento della revisione.',

  'connection.group.title': 'Gruppi di clienti',
  'connection.group.description':
    'Raggruppa gli account per cliente o progetto per filtrare ogni schermata.',
  'connection.group.assign': 'Passa al gruppo',
  'connection.group.none': 'Non raggruppato',
  'connection.group.moveNote':
    'Lo spostamento di un account mantiene i suoi post, ricevute e analisi.',

  'connection.oauth.starting': 'Apertura di {provider}',
  'connection.oauth.returned': 'Fine della connessione',
  'connection.oauth.chooseAccounts': 'Scegli quali account connettere',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'Nessun account su questo accesso {provider} può essere collegato. {reason}',
  'connection.oauth.canceled': 'La connessione è stata annullata su {provider}. Niente è cambiato.',
  'connection.oauth.alreadyConnected': '{account} è già connesso a questo spazio di lavoro.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} è connesso a un altro spazio di lavoro. Prima disconnettilo da lì.',

  'capability.title': 'Cosa supporta questo account',
  'capability.matrix.title': 'Funzionalità della piattaforma',
  'capability.matrix.subtitle':
    'Generato dalle definizioni dei connettori che manteniamo e rivisto manualmente.',
  'capability.level.supported': 'Supportato',
  'capability.level.unsupported': 'Non offerto dalla piattaforma',
  'capability.level.not_implemented': 'Non ancora costruito',
  'capability.level.requires_review': 'Necessita di revisione della piattaforma',
  'capability.level.beta': 'Beta',
  'capability.level.unknown': 'Non disponibile',
  'capability.explain.supported':
    'Relay può eseguire questa operazione per questo account oggi stesso.',
  'capability.explain.unsupported':
    '{provider} non lo offre tramite la sua API ufficiale, quindi nessuno strumento può farlo in sicurezza.',
  'capability.explain.not_implemented':
    '{provider} lo offre, ma Relay non lo ha ancora creato. È sulla roadmap del connettore.',
  'capability.explain.requires_review':
    "{provider} lo concede solo dopo aver esaminato l'app o l'account. Rimane non disponibile finché la revisione non viene superata.",
  'capability.explain.beta':
    'Funziona, con limiti che non abbiamo finito di verificare. Controlla il risultato prima di fare affidamento su di esso.',
  'capability.explain.unknown':
    'Non è stato possibile leggere le autorizzazioni attuali per questo account. Riconnettiti per aggiornarli.',
  'capability.lastChecked': 'Selezionato {relativeTime}',
  'capability.feature.text': 'Post di testo',
  'capability.feature.image': 'Immagini',
  'capability.feature.carousel': 'Caroselli',
  'capability.feature.video': 'Video',
  'capability.feature.document': 'Documenti',
  'capability.feature.firstComment': 'Primo commento programmato',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'Menzioni native',
  'capability.feature.destinations': 'Selezione della destinazione',
  'capability.feature.privacy': 'Controlli sulla privacy',
  'capability.feature.thumbnail': 'Miniatura personalizzata',
  'capability.feature.altText': 'Testo alternativo',
  'capability.feature.analytics': 'Analitica',
  'capability.feature.delete': 'Elimina un post pubblicato',
  'capability.feature.commentCount': 'Il commento conta',
  'capability.feature.commentReplies': 'Leggere e rispondere ai commenti',
  'capability.feature.disclosure': "Divulgazione dell'automazione",
} as const;
