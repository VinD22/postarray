/** Workspace settings: members, roles, projects, localization, security, data. */
export const settingsMessages = {
  'settings.title': 'Einstellungen',
  'settings.saved': 'Gespeichert',
  'settings.unsavedChanges': 'Sie haben nicht gespeicherte Änderungen.',

  'settings.workspace.title': 'Workspace',
  'settings.workspace.name': 'Name des Workspace',
  'settings.workspace.defaultTimeZone': 'Standardzone time',
  'settings.workspace.defaultLocale': 'Standardschnittstellensprache',
  'settings.workspace.defaultContentLocale': 'Standardinhaltssprache',
  'settings.workspace.transferOwnership': 'Eigentum übertragen',
  'settings.workspace.delete': 'Arbeitsbereich löschen',
  'settings.workspace.deleteWarning':
    'Durch das Löschen eines Arbeitsbereichs werden geplante Beiträge abgebrochen, Verbindungen widerrufen und gespeicherte Medien entfernt. Belege werden für die in den Bedingungen angegebene Aufbewahrungsfrist aufbewahrt.',

  'settings.members.title': 'Mitglieder und Rollen',
  'settings.members.invite': 'Leute einladen',
  'settings.members.inviteEmail': 'E-Mail-Adresse',
  'settings.members.inviteSent': 'Einladung gesendet an {email}.',
  'settings.members.pending': 'Eingeladen, noch nicht angenommen',
  'settings.members.count': '{count, plural, one {# Mitglied} other {# Mitglieder}}',
  'settings.members.removeConfirm':
    '{name} aus diesem Arbeitsbereich entfernen? Ihre vergangenen Aktionen bleiben im Audit-Protokoll.',
  'settings.role.owner.label': 'Eigentümer',
  'settings.role.admin.label': 'Admin',
  'settings.role.manager.label': 'Manager',
  'settings.role.editor.label': 'Editor',
  'settings.role.approver.label': 'Genehmiger',
  'settings.role.analyst.label': 'Analytiker',
  'settings.role.viewer.label': 'Zuschauer',
  'settings.role.owner.description': 'Alles, inklusive Abrechnung, Sicherheit und Löschung.',
  'settings.role.admin.description': 'Alles außer Abrechnung und Löschung des Arbeitsbereichs.',
  'settings.role.manager.description':
    'Verwalten Sie Projekte, Verbindungen, Zeitpläne und Regeln.',
  'settings.role.editor.description': 'Inhalte erstellen und bearbeiten, Genehmigung einholen.',
  'settings.role.approver.description':
    'Genehmigen oder lehnen Sie Inhalte ab und planen Sie, was genehmigt wird.',
  'settings.role.analyst.description': 'Lesen Sie Analysen und Quittungen.',
  'settings.role.viewer.description': 'Nur lesen.',
  'settings.role.scopeLabel': 'Auf Projekte und Konten beschränken',
  'settings.role.mfaRequired': 'Besitzer müssen eine Zwei-Faktor-Authentifizierung verwenden.',

  'settings.projects.title': 'Projects',
  'settings.projects.add': 'Projekt hinzufügen',
  'settings.projects.voice': 'Stimme',
  'settings.projects.audience': 'Publikum',
  'settings.projects.approvedClaims': 'Genehmigte Ansprüche',
  'settings.projects.blockedTerms': 'Gesperrte Begriffe',
  'settings.projects.disclosureDefaults': 'Offenlegungsvorgaben',
  'settings.projects.domains': 'Domänen',
  'settings.projects.glossary.title': 'Glossar',
  'settings.projects.glossary.term': 'Begriff',
  'settings.projects.glossary.preferred': 'Bevorzugte Übersetzung',
  'settings.projects.glossary.prohibited': 'Nicht übersetzen als',
  'settings.projects.glossary.context': 'Kontext',
  'settings.projects.glossary.keepUntranslated': 'Unübersetzt aufbewahren',
  'settings.projects.localeRules.title': 'Lokale Regeln',
  'settings.projects.localeRules.formality': 'Formalität',
  'settings.projects.localeRules.pronouns': 'Pronomen und Ehrenbezeichnungen',
  'settings.projects.localeRules.idioms': 'Redewendungen, die man vermeiden sollte',
  'settings.projects.localeRules.emoji': 'Emoji- und Hashtag-Normen',
  'settings.projects.localeRules.legal': 'Regionale rechtliche Offenlegungen',
  'settings.projects.localeRules.cta': 'Aufruf zum Handeln nach Markt',
  'settings.projects.localeRules.reviewedExamples':
    'Von einem einheimischen Rezensenten genehmigte Beispiele',

  'settings.sets.title': 'Sets',
  'settings.sets.description':
    'Eine wiederverwendbare Gruppe von Zielen, Varianten, Einstellungen, Kommentaren und Verzögerungen. Durch Anwenden eines Satzes wird ein unabhängiger Entwurf erstellt.',
  'settings.sets.editNote':
    'Durch das Bearbeiten eines Sets werden Beiträge, die bereits genehmigt oder geplant sind, nicht geändert.',
  'settings.signatures.title': 'Unterschriften',
  'settings.signatures.description':
    'Schlusstext, Hashtags, Links oder Offenlegungen, gegliedert nach Projekt, Plattform und Sprache.',
  'settings.signatures.autoApply': 'Automatisch hinzufügen, wenn der Kontext übereinstimmt',

  'settings.localization.title': 'Lokalisierung',
  'settings.localization.interfaceLocale': 'Schnittstellensprache',
  'settings.localization.interfaceLocaleHelp':
    'Die Sprache dieser App für Sie. Die Sprache Ihrer Beiträge ändert sich dadurch nicht.',
  'settings.localization.contentLocales': 'Inhaltssprachen',
  'settings.localization.contentLocalesHelp':
    'Die Sprachen, in denen Sie veröffentlichen. Jedes Projekt kann Regeln und ein Glossar pro Sprache festlegen.',
  'settings.localization.marketLocales': 'Zielgruppenmärkte',
  'settings.localization.beta': 'Beta-Übersetzung',
  'settings.localization.betaHelp':
    'Diese Sprache ist maschinengestützt und wurde noch nicht vollständig von einer Person überprüft. Nicht übersetzter Text wird auf Englisch zurückgesetzt.',
  'settings.localization.humanReviewed': 'Von einem Muttersprachler rezensiert',
  'settings.localization.timeZone': 'Zeitzone',
  'settings.localization.weekStart': 'Erster Tag der Woche',
  'settings.localization.hourCycle.label': 'Zeitformat',
  'settings.localization.hourCycle.h12': '12 Stunden',
  'settings.localization.hourCycle.h23': '24 Stunden',

  'settings.notifications.title': 'Benachrichtigungen',
  'settings.notifications.email': 'E-Mail',
  'settings.notifications.inApp': 'In App',
  'settings.notifications.approvalRequests': 'Genehmigungsanfragen',
  'settings.notifications.publishResults': 'Ergebnisse veröffentlichen',
  'settings.notifications.connectionHealth': 'Verbindungszustand',
  'settings.notifications.ruleFailures': 'Automatisierungsfehler',
  'settings.notifications.weeklySummary': 'Wöchentliche Zusammenfassung',
  'settings.notifications.digestOnly': 'Fassen Sie diese in einer täglichen Nachricht zusammen',

  'settings.security.title': 'Sicherheit',
  'settings.security.mfa': 'Zwei-Faktor-Authentifizierung',
  'settings.security.mfaEnable': 'Aktivieren Sie die Zwei-Faktor-Authentifizierung',
  'settings.security.mfaRequiredFor':
    'Erforderlich für Rechnungsänderungen, Dienstkonten, erneutes Verbinden eines Kontos und Widerrufen von Anmeldeinformationen.',
  'settings.security.passkeys': 'Passschlüssel',
  'settings.security.sessions': 'Aktive Sitzungen',
  'settings.security.sessionRevoke': 'Melden Sie sich von dieser Sitzung ab',
  'settings.security.auditLog.title': 'Audit-Protokoll',
  'settings.security.auditLog.description':
    'Jede Aktion, wer oder was sie wann ausgeführt hat. Exportierbar durch Eigentümer und Administratoren.',
  'settings.security.killSwitch': 'Nothalt',
  'settings.security.killSwitchBody':
    'Stoppt jede geplante Veröffentlichung und Automatisierung in diesem Arbeitsbereich sofort. Es wird nichts gelöscht. Sie können es wieder ausschalten.',
  'settings.security.killSwitchActive':
    'Notstopp ist aktiviert. Es wird kein Beitrag veröffentlicht.',

  'settings.data.title': 'Datenkontrollen',
  'settings.data.export': 'Exportieren Sie Ihre Daten',
  'settings.data.exportPreparing':
    'Bereiten Sie Ihren Export vor. Wir benachrichtigen Sie per E-Mail, sobald es fertig ist.',
  'settings.data.deletionRequest': 'Löschung beantragen',
  'settings.data.deletionExplain':
    'Durch das Löschen werden geplante Arbeitsabläufe abgebrochen, der Anbieterzugriff widerrufen, gespeicherte Medien entfernt und Tombstone-Analysen dort durchgeführt, wo der Anbieter dies benötigt.',
  'settings.data.retention': 'Zurückbehaltung',
  'settings.data.consents': 'Einwilligungen',
  'settings.data.consent.productAnalytics': 'Produktanalyse',
  'settings.data.consent.diagnostics': 'Teilen Sie die Diagnose mit dem Support',
  'settings.data.consent.aiImprovement':
    'Nutzen Sie meine Inhalte, um den Assistenten zu verbessern. Dies ist deaktiviert, es sei denn, Sie schalten es ein.',
  'settings.data.consent.marketingEmail': 'Produktneuigkeiten per E-Mail',
} as const;
