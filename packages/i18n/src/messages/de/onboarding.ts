/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Relay einrichten',
  'onboarding.progress': 'Schritt {current} von {total}',
  'onboarding.skipForNow': 'Überspringen Sie es vorerst',
  'onboarding.goal': 'Ein verifizierter geplanter Beitrag in weniger als zehn Minuten.',

  'onboarding.plan.title': 'Wählen Sie, wie Sie bezahlen möchten',
  'onboarding.plan.help':
    'Ein Plan, alle Funktionen. Ändern Sie das Intervall, wann immer Sie möchten.',

  'onboarding.workspace.title': 'Benennen Sie Ihren Arbeitsbereich',
  'onboarding.workspace.namePlaceholder': 'Ihr Firmen- oder Kundenname',
  'onboarding.workspace.timeZone': 'Zeitzone für die Planung',
  'onboarding.workspace.timeZoneHelp':
    'Jedes geplante time wird in dieser Zone gespeichert, sodass Ihr Beitrag bei einer Zeitumstellung nie versehentlich verschoben wird.',
  'onboarding.workspace.locale': 'Schnittstellensprache',

  'onboarding.role.title': 'Was beschreibt dich am besten?',
  'onboarding.role.creator': 'Schöpfer',
  'onboarding.role.team': 'Inhouse-Team',
  'onboarding.role.agency': 'Agentur',
  'onboarding.role.developer': 'Entwickler oder Agent-Builder',
  'onboarding.role.help':
    'Dadurch ändern sich die von uns vorgeschlagenen Standardeinstellungen. Sie können später alles ändern.',

  'onboarding.connect.title': 'Verbinden Sie Ihr erstes Konto',
  'onboarding.connect.help':
    'Wir zeigen Ihnen genau, um welche Berechtigungen jede Plattform gebeten wird, bevor Sie etwas genehmigen.',
  'onboarding.connect.skipNote':
    'Sie können es zunächst mit dem Beispielkonto erkunden. Es wird nichts daraus veröffentlicht.',
  'onboarding.connect.success': '{account} ist verbunden.',

  'onboarding.content.title': 'Beginnen Sie mit etwas, das Sie bereits haben',
  'onboarding.content.useAsset': 'Verwenden Sie ein Bild oder Video',
  'onboarding.content.useBrief': 'Beginnen Sie mit einem kurzen Briefing',
  'onboarding.content.useText': 'Schreiben Sie es selbst',

  'onboarding.preview.title': 'Das wird veröffentlicht',
  'onboarding.preview.help': 'Eine echte Vorschau auf die Plattformregeln für dieses Konto.',

  'onboarding.schedule.title': 'Wählen Sie, wann es erlischt',
  'onboarding.schedule.help':
    'Überprüfen Sie die time, die Datenschutzeinstellungen, die Offenlegung und die geschätzten Anbieterkosten.',

  'onboarding.done.title': 'Geplant',
  'onboarding.done.body': 'Ihr Beitrag ist für {time} in {timeZone} geplant.',
  'onboarding.done.nextStep.title': 'Was als nächstes zu tun ist',
  'onboarding.done.nextStep.connectMore': 'Verbinden Sie ein anderes Konto',
  'onboarding.done.nextStep.inviteTeam': 'Laden Sie einen Teamkollegen ein',
  'onboarding.done.nextStep.setApproval': 'Legen Sie eine Genehmigungsrichtlinie fest',
  'onboarding.done.nextStep.exploreApi': 'Entdecken Sie die API und den MCP-Server',

  'onboarding.checklist.title': 'Erste Schritte',
  'onboarding.checklist.connectAccount': 'Verbinden Sie ein Konto',
  'onboarding.checklist.firstPost': 'Veröffentlichen oder planen Sie einen Beitrag',
  'onboarding.checklist.inviteTeammate': 'Laden Sie einen Teamkollegen ein',
  'onboarding.checklist.setProjectVoice': 'Beschreiben Sie die Stimme des Projekts',
  'onboarding.checklist.tryAutomation': 'Versuchen Sie es mit einer Automatisierungsregel',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Alles erledigt} one {# Schritt übrig} other {# Schritte übrig}}',
} as const;
