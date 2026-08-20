/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Configura Relay',
  'onboarding.progress': 'Passaggio {current} di {total}',
  'onboarding.skipForNow': 'Salta per ora',
  'onboarding.goal': 'Un post programmato verificato in meno di dieci minuti.',

  'onboarding.plan.title': 'Scegli come vuoi pagare',
  'onboarding.plan.help': "Un piano, ogni funzionalità. Cambia l'intervallo quando vuoi.",

  'onboarding.workspace.title': 'Dai un nome al tuo spazio di lavoro',
  'onboarding.workspace.namePlaceholder': 'Il nome della tua azienda o del cliente',
  'onboarding.workspace.timeZone': 'Fuso orario per la pianificazione',
  'onboarding.workspace.timeZoneHelp':
    "Ogni orario programmato viene memorizzato in questa zona, quindi un cambio dell'orologio non sposta mai il tuo post per sbaglio.",
  'onboarding.workspace.locale': "Linguaggio dell'interfaccia",

  'onboarding.role.title': 'Cosa ti descrive meglio?',
  'onboarding.role.creator': 'Creatore',
  'onboarding.role.team': 'Squadra interna',
  'onboarding.role.agency': 'Agenzia',
  'onboarding.role.developer': 'Sviluppatore o costruttore di agenti',
  'onboarding.role.help':
    'Ciò modifica le impostazioni predefinite che suggeriamo. Puoi cambiare tutto più tardi.',

  'onboarding.connect.title': 'Collega il tuo primo account',
  'onboarding.connect.help':
    'Ti mostreremo esattamente quali autorizzazioni sono richieste per ciascuna piattaforma prima di approvare qualsiasi cosa.',
  'onboarding.connect.skipNote':
    "Puoi prima esplorare con l'account di esempio. Non viene pubblicato nulla.",
  'onboarding.connect.success': '{account} è connesso.',

  'onboarding.content.title': 'Inizia con qualcosa che hai già',
  'onboarding.content.useAsset': "Utilizza un'immagine o un video",
  'onboarding.content.useBrief': 'Inizia da un breve brief',
  'onboarding.content.useText': 'Scrivilo tu stesso',

  'onboarding.preview.title': 'Questo è ciò che pubblicherà',
  'onboarding.preview.help':
    'Una vera anteprima delle regole della piattaforma per questo account.',

  'onboarding.schedule.title': 'Scegli quando esce',
  'onboarding.schedule.help':
    "Controlla l'orario, le impostazioni sulla privacy, l'informativa e il costo stimato del fornitore.",

  'onboarding.done.title': 'Programmato',
  'onboarding.done.body': 'Il tuo post è previsto per {time} in {timeZone}.',
  'onboarding.done.nextStep.title': 'Cosa fare dopo',
  'onboarding.done.nextStep.connectMore': 'Collega un altro account',
  'onboarding.done.nextStep.inviteTeam': 'Invita un compagno di squadra',
  'onboarding.done.nextStep.setApproval': 'Imposta una politica di approvazione',
  'onboarding.done.nextStep.exploreApi': 'Esplora il server API e MCP',

  'onboarding.checklist.title': 'Iniziare',
  'onboarding.checklist.connectAccount': 'Collega un account',
  'onboarding.checklist.firstPost': 'Pubblica o pianifica un post',
  'onboarding.checklist.inviteTeammate': 'Invita un compagno di squadra',
  'onboarding.checklist.setProjectVoice': 'Descrivi la voce del tuo marchio',
  'onboarding.checklist.tryAutomation': 'Prova una regola di automazione',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Tutto fatto} one {# passo a sinistra} many {# passi a sinistra} other {# passi a sinistra}}',
} as const;
