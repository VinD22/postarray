/** Workspace settings: members, roles, projects, localization, security, data. */
export const settingsMessages = {
  'settings.title': 'Impostazioni',
  'settings.saved': 'Salvato',
  'settings.unsavedChanges': 'Sono presenti modifiche non salvate.',

  'settings.workspace.title': 'Workspace',
  'settings.workspace.name': 'Nome Workspace',
  'settings.workspace.defaultTimeZone': 'Fuso orario predefinito',
  'settings.workspace.defaultLocale': "Lingua dell'interfaccia predefinita",
  'settings.workspace.defaultContentLocale': 'Lingua del contenuto predefinita',
  'settings.workspace.transferOwnership': 'Trasferisci la proprietà',
  'settings.workspace.delete': "Elimina l'area di lavoro",
  'settings.workspace.deleteWarning':
    "L'eliminazione di un'area di lavoro annulla i post programmati, revoca le connessioni e rimuove i media archiviati. Le ricevute vengono conservate per il periodo di conservazione indicato nei Termini.",

  'settings.members.title': 'Membri e ruoli',
  'settings.members.invite': 'Invita persone',
  'settings.members.inviteEmail': 'Indirizzo e-mail',
  'settings.members.inviteSent': 'Invito inviato a {email}.',
  'settings.members.pending': 'Invitato, non ancora accettato',
  'settings.members.count': '{count, plural, one {# membro} many {# membri} other {# membri}}',
  'settings.members.removeConfirm':
    "Rimuovere {name} da quest'area di lavoro? Le loro azioni passate rimangono nel registro di controllo.",
  'settings.role.owner.label': 'Proprietario',
  'settings.role.admin.label': 'Ammin',
  'settings.role.manager.label': 'Direttore',
  'settings.role.editor.label': 'Editore',
  'settings.role.approver.label': 'Approvatore',
  'settings.role.analyst.label': 'Analista',
  'settings.role.viewer.label': 'Visualizzatore',
  'settings.role.owner.description': 'Tutto, compresa fatturazione, sicurezza e cancellazione.',
  'settings.role.admin.description':
    "Tutto tranne la fatturazione e l'eliminazione dello spazio di lavoro.",
  'settings.role.manager.description': 'Gestisci progetti, connessioni, orari e regole.',
  'settings.role.editor.description': "Crea e modifica contenuti, richiedi l'approvazione.",
  'settings.role.approver.description':
    'Approva o rifiuta i contenuti e pianifica ciò che viene approvato.',
  'settings.role.analyst.description': 'Leggi analisi e ricevute.',
  'settings.role.viewer.description': 'Sola lettura.',
  'settings.role.scopeLabel': 'Limite a progetti e account',
  'settings.role.mfaRequired': "I proprietari devono utilizzare l'autenticazione a due fattori.",

  'settings.projects.title': 'Progetti',
  'settings.projects.add': 'Aggiungi un progetto',
  'settings.projects.voice': 'Voce',
  'settings.projects.audience': 'Pubblico',
  'settings.projects.approvedClaims': 'Affermazioni approvate',
  'settings.projects.blockedTerms': 'Termini bloccati',
  'settings.projects.disclosureDefaults': 'Impostazioni predefinite in materia di divulgazione',
  'settings.projects.domains': 'Domini',
  'settings.projects.glossary.title': 'Glossario',
  'settings.projects.glossary.term': 'Termine',
  'settings.projects.glossary.preferred': 'Traduzione preferita',
  'settings.projects.glossary.prohibited': 'Non tradurre come',
  'settings.projects.glossary.context': 'Contesto',
  'settings.projects.glossary.keepUntranslated': 'Mantieni la traduzione non tradotta',
  'settings.projects.localeRules.title': 'Regole locali',
  'settings.projects.localeRules.formality': 'Formalità',
  'settings.projects.localeRules.pronouns': 'Pronomi e onorifici',
  'settings.projects.localeRules.idioms': 'Idiomi da evitare',
  'settings.projects.localeRules.emoji': 'Norme su emoji e hashtag',
  'settings.projects.localeRules.legal': 'Informativa legale regionale',
  'settings.projects.localeRules.cta': "Invito all'azione per mercato",
  'settings.projects.localeRules.reviewedExamples': 'Esempi approvati da un revisore nativo',

  'settings.sets.title': 'Imposta',
  'settings.sets.description':
    "Un gruppo riutilizzabile di obiettivi, varianti, impostazioni, commenti e ritardi. L'applicazione di un set crea una bozza indipendente.",
  'settings.sets.editNote':
    'La modifica di un set non modifica i post già approvati o programmati.',
  'settings.signatures.title': 'Firme',
  'settings.signatures.description':
    'Testo di chiusura, hashtag, link o informative, suddivisi per progetto, piattaforma e lingua.',
  'settings.signatures.autoApply': 'Aggiungi automaticamente quando il contesto corrisponde',

  'settings.localization.title': 'Localizzazione',
  'settings.localization.interfaceLocale': "Linguaggio dell'interfaccia",
  'settings.localization.interfaceLocaleHelp':
    'La lingua di questa app per te. Non cambia la lingua dei tuoi post.',
  'settings.localization.contentLocales': 'Lingue dei contenuti',
  'settings.localization.contentLocalesHelp':
    'Le lingue in cui pubblichi. Ogni progetto può impostare regole e un glossario per lingua.',
  'settings.localization.marketLocales': 'Mercati del pubblico',
  'settings.localization.beta': 'Traduzione beta',
  'settings.localization.betaHelp':
    "Questo linguaggio è assistito da una macchina e non è ancora stato completamente rivisto da una persona. Il testo non tradotto torna all'inglese.",
  'settings.localization.humanReviewed': 'Recensito da un madrelingua',
  'settings.localization.timeZone': 'Fuso orario',
  'settings.localization.weekStart': 'Primo giorno della settimana',
  'settings.localization.hourCycle.label': 'Formato ora',
  'settings.localization.hourCycle.h12': '12 ore',
  'settings.localization.hourCycle.h23': '24 ore',

  'settings.notifications.title': 'Notifiche',
  'settings.notifications.email': 'E-mail',
  'settings.notifications.inApp': "Nell'app",
  'settings.notifications.approvalRequests': 'Richieste di approvazione',
  'settings.notifications.publishResults': 'Pubblica risultati',
  'settings.notifications.connectionHealth': 'Stato della connessione',
  'settings.notifications.ruleFailures': "Guasti dell'automazione",
  'settings.notifications.weeklySummary': 'Riepilogo settimanale',
  'settings.notifications.digestOnly': 'Raggruppali in un messaggio quotidiano',

  'settings.security.title': 'Sicurezza',
  'settings.security.mfa': 'Autenticazione a due fattori',
  'settings.security.mfaEnable': "Attiva l'autenticazione a due fattori",
  'settings.security.mfaRequiredFor':
    'Necessario per modifiche alla fatturazione, account di servizio, riconnessione di un account e revoca delle credenziali.',
  'settings.security.passkeys': 'Chiavi di accesso',
  'settings.security.sessions': 'Sessioni attive',
  'settings.security.sessionRevoke': 'Esci da questa sessione',
  'settings.security.auditLog.title': 'Registro di controllo',
  'settings.security.auditLog.description':
    "Ogni azione, chi o cosa l'ha eseguita e quando. Esportabile da proprietari e amministratori.",
  'settings.security.killSwitch': 'Arresto di emergenza',
  'settings.security.killSwitchBody':
    "Interrompe immediatamente ogni pubblicazione e automazione pianificata in quest'area di lavoro. Niente viene cancellato. Puoi spegnerlo di nuovo.",
  'settings.security.killSwitchActive':
    "L'arresto di emergenza è attivo. Nessun post verrà pubblicato.",

  'settings.data.title': 'Controlli sui dati',
  'settings.data.export': 'Esporta i tuoi dati',
  'settings.data.exportPreparing':
    "Preparare l'esportazione. Ti invieremo un'email quando sarà pronto.",
  'settings.data.deletionRequest': 'Richiedi la cancellazione',
  'settings.data.deletionExplain':
    "L'eliminazione annulla i flussi di lavoro pianificati, revoca l'accesso del provider, rimuove i supporti archiviati e le analisi dei tombstones laddove il provider lo richiede.",
  'settings.data.retention': 'Conservazione',
  'settings.data.consents': 'Consensi',
  'settings.data.consent.productAnalytics': 'Analisi del prodotto',
  'settings.data.consent.diagnostics': 'Condividi la diagnostica con il supporto',
  'settings.data.consent.aiImprovement':
    "Utilizza i miei contenuti per migliorare l'assistente. Questo è spento a meno che tu non lo accenda.",
  'settings.data.consent.marketingEmail': 'Novità sui prodotti via e-mail',
} as const;
