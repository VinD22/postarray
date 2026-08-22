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
    'Alles, was diesen Arbeitsbereich konfiguriert. Hier wird nichts veröffentlicht.',
  'settings.ui.nav.label': 'Abschnitte „Einstellungen“.',
  'settings.ui.index.help':
    'Wählen Sie einen Abschnitt aus. Jede Änderung wird Ihnen zugeordnet und erscheint im Audit-Protokoll.',

  'settings.ui.section.members': 'Mitglieder und Rollen',
  'settings.ui.section.membersSummary':
    'Wer ist in diesem Arbeitsbereich und was kann jede Person tun?',
  'settings.ui.section.projects': 'Projekte',
  'settings.ui.section.projectsSummary':
    'Stimme, Zielgruppe, genehmigte Ansprüche, blockierte Begriffe, Gebietsschemaregeln, Domänen und das Glossar.',
  'settings.ui.section.agents': 'Agenten und API',
  'settings.ui.section.agentsSummary':
    'Dienstkonten, Bereiche, Limits, Anmeldeinformationen, Aktivität und der Probelauf-Spielplatz.',
  'settings.ui.section.apps': 'Entwickler-Apps',
  'settings.ui.section.appsSummary':
    'OAuth-Anwendungen von Drittanbietern, Weiterleitungs-Zulassungslisten, Einwilligungen und Gewährungen.',
  'settings.ui.section.webhooks': 'Webhooks',
  'settings.ui.section.webhooksSummary':
    'Signierte ausgehende Ereignisse, Zustellungsprotokolle, erneute Zustellung und geheime Rotation.',
  'settings.ui.section.billing': 'Abrechnung',
  'settings.ui.section.billingSummary':
    'Plan, Testversion, Intervall, gemessene Anbieternutzung, Rechnungen und Kündigung.',
  'settings.ui.section.referrals': 'Empfehlung und Affiliate',
  'settings.ui.section.referralsSummary':
    'Ihr offengelegter Empfehlungslink, zugeschriebene Anmeldungen und Provisionsstatus.',
  'settings.ui.section.localization': 'Lokalisierung',
  'settings.ui.section.localizationSummary':
    'Schnittstellensprache, Inhaltssprachen, Märkte, Zeitzone und Zeitformat.',
  'settings.ui.section.security': 'Sicherheit',
  'settings.ui.section.securitySummary':
    'Sitzungen, Zwei-Faktor-Authentifizierung, Anmeldeinformationen, Agenten, Webhooks und App-Zuweisungen.',
  'settings.ui.section.data': 'Datenkontrollen',
  'settings.ui.section.dataSummary':
    'Finden Sie die richtige Stelle, um eine Verbindung zu trennen, ein Projekt zu archivieren oder Inhalte zu löschen.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': '{section} wird geladen',
  'settings.ui.state.errorTitle': 'Wir konnten {section} nicht laden',
  'settings.ui.state.errorRetry': 'Versuchen Sie es erneut',
  'settings.ui.state.savingAnnouncement': 'Speichern von {section}',
  'settings.ui.state.savedAnnouncement': '{section} gespeichert',
  'settings.ui.state.saveFailedAnnouncement':
    '{section} wurde nicht gespeichert. Ihr Beitrag ist immer noch hier.',
  'settings.ui.state.offlineTitle': 'Du bist offline',
  'settings.ui.state.offlineBody':
    'Sie können diese Seite lesen. Änderungen können erst gespeichert werden, wenn die Verbindung wiederhergestellt ist.',
  'settings.ui.state.permissionTitle': 'Sie haben keinen Zugriff auf {section}',
  'settings.ui.state.permissionBody':
    'Dieser Abschnitt ändert das Verhalten des Arbeitsbereichs und ist daher durch die Rolle eingeschränkt.',
  'settings.ui.state.permissionRequirements': 'Was Sie brauchen',
  'settings.ui.state.permissionContact':
    'Ein Besitzer oder ein Administrator dieses Arbeitsbereichs kann es gewähren. Sie sind unter Mitglieder und Rollen aufgeführt.',
  'settings.ui.state.rateLimitTitle': 'Zu viele Änderungen in kurzer Zeit',
  'settings.ui.state.rateLimitCause':
    'Dieser Arbeitsbereich hat das Schreiblimit für Einstellungsänderungen erreicht.',
  'settings.ui.state.rateLimitReset': 'Limit-Resets',
  'settings.ui.state.rateLimitAlternative':
    'Nichts, was Sie gespeichert haben, ist verloren gegangen. Während Sie warten, funktionieren schreibgeschützte Aktionen weiterhin.',
  'settings.ui.state.rateLimitUsage': 'Einstellungen schreibt diese Stunde',
  'settings.ui.state.rateLimitUsageText': '{used} von {limit} verwendet',
  'settings.ui.state.unsavedTitle': 'Sie haben nicht gespeicherte Änderungen',
  'settings.ui.state.unsavedBody': 'Speichern Sie sie, bevor Sie diesen Abschnitt verlassen.',
  'settings.ui.state.readOnlyTitle': 'Dieser Arbeitsbereich ist schreibgeschützt',
  'settings.ui.state.readOnlyBody':
    'Die Abrechnung ist überfällig. Ihre Inhalte, Belege und Verbindungen sind intakt. Einstellungen können gelesen, aber nicht geändert werden.',

  'settings.ui.state.referenceLabel': 'Support-Referenz',

  'settings.ui.attribution': 'Geändert durch {name} {relativeTime}',
  'settings.ui.attributionNever': 'Seit der Erstellung nicht geändert',
  'settings.ui.copyFailed':
    'Ihr Browser hat das Kopieren blockiert. Wählen Sie den Text aus und kopieren Sie ihn manuell.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'Jede Einladung, jeder Rollenwechsel und jede Entfernung wird mit Ihrem Namen und der Uhrzeit erfasst.',
  'settings.ui.members.tableCaption': 'Personen in diesem Arbeitsbereich mit Rolle und Umfang',
  'settings.ui.members.column.person': 'Person',
  'settings.ui.members.column.role': 'Rolle',
  'settings.ui.members.column.scope': 'Umfang',
  'settings.ui.members.column.approvals': 'Zulassungen',
  'settings.ui.members.column.lastActive': 'Zuletzt aktiv',
  'settings.ui.members.column.actions': 'Aktionen',
  'settings.ui.members.scopeAll': 'Alle Projekte und Konten',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {# Projekt} other {# Projekte}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Kann zustimmen',
  'settings.ui.members.approvals.cannotApprove': 'Kann nicht genehmigt werden',
  'settings.ui.members.approvals.canApproveOwnProjects':
    'Kann für die aufgeführten Projekte genehmigen',
  'settings.ui.members.lastActiveNever': 'Hat sich noch nicht angemeldet',
  'settings.ui.members.changeRole': 'Ändern Sie die Rolle für {name}',
  'settings.ui.members.remove': 'Entfernen Sie {name}',
  'settings.ui.members.lastOwnerTitle': 'Ein Arbeitsbereich behält mindestens einen Besitzer',
  'settings.ui.members.lastOwnerBody':
    'Machen Sie zuerst eine andere Person zum Eigentümer, dann wird diese Änderung verfügbar.',
  'settings.ui.members.inviteTitle': 'Laden Sie jemanden in diesen Arbeitsbereich ein',
  'settings.ui.members.inviteBody':
    'Sie erhalten eine E-Mail mit einem Link. Die Einladung läuft nach sieben Tagen ab und Sie können sie bis dahin widerrufen.',
  'settings.ui.members.inviteRole': 'Rolle',
  'settings.ui.members.inviteScope': 'Projekte, in denen sie arbeiten können',
  'settings.ui.members.inviteScopeAll': 'Jedes Projekt in diesem Arbeitsbereich',
  'settings.ui.members.inviteScopeSelected': 'Nur die Projekte, die ich auswähle',
  'settings.ui.members.inviteApprovals': 'Kann über Genehmigungsanfragen entscheiden',
  'settings.ui.members.inviteApprovalsHelp':
    'Dies können nur Rollen erhalten, die bereits eine Überprüfung beinhalten. Es ist von der Bearbeitung getrennt.',
  'settings.ui.members.inviteSubmit': 'Einladung senden',
  'settings.ui.members.invitePending': 'Eingeladen {relativeTime} von {name}',
  'settings.ui.members.inviteRevoke': 'Einladung widerrufen',
  'settings.ui.members.inviteResend': 'Senden Sie die Einladung erneut',
  'settings.ui.members.emptyTitle': 'Du bist die einzige Person hier',
  'settings.ui.members.emptyBody':
    'Laden Sie die Personen ein, die Ergebnisse schreiben, genehmigen oder lesen. Jede Person erhält eine Rolle und einen Projektumfang.',
  'settings.ui.members.emptyExample':
    'Eine übliche Form: ein Eigentümer für die Abrechnung, ein Genehmiger pro Projekt und Redakteure, die Entwürfe schreiben, aber nie veröffentlichen.',
  'settings.ui.members.roleReferenceTitle': 'Was jede Rolle tun kann',
  'settings.ui.members.roleReferenceCaption': 'Rollen und die Aktionen, die jede einzelne zulässt',
  'settings.ui.members.roleColumn.role': 'Rolle',
  'settings.ui.members.roleColumn.can': 'Kann',
  'settings.ui.members.roleColumn.cannot': 'Geht nicht',
  'settings.ui.members.roleCannot.owner': 'Einem Eigentümer wird nichts vorenthalten.',
  'settings.ui.members.roleCannot.admin':
    'Ändern Sie die Abrechnung oder löschen Sie den Arbeitsbereich.',
  'settings.ui.members.roleCannot.manager':
    'Abrechnung, Rollen oder Arbeitsbereichslöschung ändern.',
  'settings.ui.members.roleCannot.editor':
    'Genehmigen, planen, veröffentlichen oder ändern Sie Verbindungen.',
  'settings.ui.members.roleCannot.approver': 'Ändern Sie Verbindungen, Regeln oder Abrechnungen.',
  'settings.ui.members.roleCannot.analyst':
    'Erstellen, bearbeiten, genehmigen oder veröffentlichen Sie alles.',
  'settings.ui.members.roleCannot.viewer': 'Ändere überhaupt etwas.',
  'settings.ui.members.removeTitle': 'Entfernen Sie {name} aus diesem Arbeitsbereich',
  'settings.ui.members.removeConsequence.access':
    'Sie verlieren sofort den Zugang, auf jeder Oberfläche.',
  'settings.ui.members.removeConsequence.drafts':
    'Von ihnen verfasste Entwürfe bleiben im Arbeitsbereich und können weiter bearbeitet werden.',
  'settings.ui.members.removeConsequence.audit':
    'Ihre vergangenen Aktionen bleiben im Prüfprotokoll und auf Belegen erhalten.',
  'settings.ui.members.removeConsequence.approvals':
    'Darauf wartende Genehmigungsanfragen werden in die Warteschlange für einen anderen Genehmiger zurückgestellt.',

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'Halten Sie jedes Produkt, jeden Kunden, jede Publikation und jedes Vorhaben getrennt. Jedes Projekt hat eigene Kanäle, Medien, Entwürfe, Zeitpläne und Veröffentlichungsregeln.',
  'settings.ui.projects.listCaption': 'Projekte in diesem Arbeitsbereich',
  'settings.ui.projects.column.project': 'Projekt',
  'settings.ui.projects.column.locales': 'Inhaltssprachen',
  'settings.ui.projects.column.accounts': 'Konten',
  'settings.ui.projects.column.updated': 'Aktualisiert',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Keine Konten} one {# Konto} other {# Konten}}',
  'settings.ui.projects.emptyTitle': 'Erstellen Sie Ihr erstes Projekt',
  'settings.ui.projects.emptyBody':
    'Ein Projekt hält ein Produkt oder einen Kunden über seine sozialen Kanäle hinweg synchron, ohne Medien, Entwürfe oder Zeitpläne mit einem anderen Projekt zu vermischen.',
  'settings.ui.projects.emptyExample':
    'Beispiel: Acme App, Acme Podcast und Kunde Northwind können drei getrennte Projekte in einem Arbeitsbereich sein.',
  'settings.ui.projects.voiceHelp':
    'Wie dieses Projekt klingen soll. Wird als Leitfaden für die Prüfung und für die Prüfung von Aussagen verwendet.',
  'settings.ui.projects.audienceHelp': 'Für wen der Inhalt gedacht ist, pro Markt.',
  'settings.ui.projects.approvedClaimsHelp':
    'Aussagen, die ein Rezensent freigegeben hat. Alles außerhalb dieser Liste wird vor der Genehmigung markiert, nicht nach der Veröffentlichung.',
  'settings.ui.projects.blockedTermsHelp':
    'Wörter, die die Terminplanung für dieses Projekt blockieren. Ein Wort pro Zeile.',
  'settings.ui.projects.domainsHelp':
    'Domains, auf die dieses Projekt verlinken und über die es kürzen darf. Im Composer können nur verifizierte Domains ausgewählt werden.',
  'settings.ui.projects.domainVerified': 'Verifiziert {date}',
  'settings.ui.projects.domainPending': 'DNS-Eintrag noch nicht gesehen',
  'settings.ui.projects.disclosureHelp':
    'Wird standardmäßig im Composer für die hier ausgewählten Plattformen angewendet. Es kann vor der Genehmigung per Post geändert werden.',
  'settings.ui.projects.glossaryHelp':
    'Produktnamen, juristische Begriffe und alles, was eine Übersetzung unverändert überstehen muss.',
  'settings.ui.projects.glossaryCaption': 'Geschützte Begriffe und deren Handhabung pro Sprache',
  'settings.ui.projects.glossaryEmpty':
    'Noch keine geschützten Begriffe. Fügen Sie Produktnamen und Rechtsbegriffe hinzu, die nicht übersetzt oder umformuliert werden dürfen.',
  'settings.ui.projects.localeRulesHelp':
    'Regeln pro Inhaltssprache. Sie werden beim Anpassen oder Transkreieren angewendet und dem Prüfer angezeigt.',
  'settings.ui.projects.saveProject': 'Projekt speichern',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'Drei separate Einstellungen: die Sprache dieser App, die Sprachen, in denen Sie veröffentlichen, und die Märkte, für die Sie schreiben. Wenn man das eine ändert, ändert sich nie das andere.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Wählen Sie eine Oberflächensprache für diese App. Inhaltssprachen sind separat und bereits verfügbar.',
  'settings.ui.localization.marketHelp':
    'Ein Markt verändert Beispiele, rechtliche Offenlegungen und Handlungsaufforderungen. Die Sprache eines Beitrags wird dadurch nicht geändert.',
  'settings.ui.localization.previewTitle': 'Wie Datumsangaben und Zahlen lauten',
  'settings.ui.localization.previewDate': 'Datum',
  'settings.ui.localization.previewTime': 'Zeit',
  'settings.ui.localization.previewNumber': 'Nummer',
  'settings.ui.localization.previewCurrency': 'Währung',
  'settings.ui.localization.weekStartHelp': 'Wird von der Kalenderwochenansicht verwendet.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'Alles, was auf diesen Arbeitsbereich zugreifen kann, an einem Ort: Ihre Sitzungen, Anmeldeinformationen, Agenten, Webhooks und die Apps, auf die Sie Zugriff gewährt haben.',
  'settings.ui.security.sessionsCaption': 'Angemeldete Sitzungen für Ihr Konto',
  'settings.ui.security.sessionColumn.device': 'Gerät und Browser',
  'settings.ui.security.sessionColumn.location': 'Ungefährer Standort',
  'settings.ui.security.sessionColumn.lastSeen': 'Zuletzt verwendet',
  'settings.ui.security.sessionCurrent': 'Diese Sitzung',
  'settings.ui.security.sessionRevokeAll': 'Melden Sie sich bei jeder zweiten Sitzung ab',
  'settings.ui.security.sessionLocationUnknown': 'Standort nicht erfasst',
  'settings.ui.security.mfaOn': 'Die Zwei-Faktor-Authentifizierung ist aktiviert',
  'settings.ui.security.mfaOff': 'Die Zwei-Faktor-Authentifizierung ist deaktiviert',
  'settings.ui.security.mfaBody':
    'Vor Abrechnungsänderungen, der Erstellung eines Dienstkontos, der erneuten Verbindung eines Kontos und dem Widerruf von Anmeldeinformationen ist ein zweiter Faktor erforderlich.',
  'settings.ui.security.credentialsTitle': 'API-Schlüssel',
  'settings.ui.security.credentialsBody':
    'Schlüssel, die diesem Arbeitsbereich gehören. Sie sind von App-Zuschüssen und Ihrer eigenen Sitzung getrennt.',
  'settings.ui.security.agentsTitle': 'Dienstkonten',
  'settings.ui.security.webhooksTitle': 'Webhook-Endpunkte',
  'settings.ui.security.grantsTitle': 'Apps, die Sie zugelassen haben',
  'settings.ui.security.grantsBody':
    'Durch das Widerrufen einer App werden ihre Token sofort gestoppt. Ihre eigenen Verbindungen und geplanten Beiträge sind davon nicht betroffen.',
  'settings.ui.security.grantScopes': 'Gewährte Berechtigungen',
  'settings.ui.security.socialPermissionsTitle': 'Berechtigungen für soziale Konten',
  'settings.ui.security.socialPermissionsBody':
    'Was jedes verbundene Konto Relay ermöglicht hat, anhand des zum Zeitpunkt der Verbindung erstellten Fähigkeits-Snapshots.',
  'settings.ui.security.viewInSection': 'Verwalten Sie in {section}',
  'settings.ui.security.emptySessions': 'Nur diese Sitzung ist angemeldet.',
  'settings.ui.security.emptyGrants':
    'Keine Drittanbieter-App hat Zugriff auf diesen Arbeitsbereich. Apps werden hier angezeigt, nachdem Sie sie auf einem Zustimmungsbildschirm zugelassen haben.',
  'settings.ui.security.revokeGrantTitle': 'Widerrufen Sie den Zugriff für {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Seine Zugriffs- und Aktualisierungstoken funktionieren sofort nicht mehr.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Veröffentlicht den bereits geplanten Aufenthalt. Stornieren Sie sie separat, wenn Sie möchten, dass sie gestoppt werden.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'Die App kann erneut um Zugriff bitten und Sie können dies verweigern.',

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
    '{count, plural, =0 {Nothing is scheduled right now} one {# scheduled post} other {# scheduled posts}}',
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
    'Teilen Sie Relay mit einem offengelegten Link. Die Provision ist niemals von einer positiven Bewertung abhängig.',
  'settings.ui.referral.linkLabel': 'Ihr Empfehlungslink',
  'settings.ui.referral.tableCaption': 'Zugeordnete Anmeldungen und deren Provisionsstatus',
  'settings.ui.referral.column.signup': 'Anmelden',
  'settings.ui.referral.column.date': 'Datum',
  'settings.ui.referral.column.state': 'Kommission',
  'settings.ui.referral.column.amount': 'Betrag',
  'settings.ui.referral.emptyTitle': 'Noch keine zugeordneten Anmeldungen',
  'settings.ui.referral.emptyBody':
    'Anmeldungen werden hier angezeigt, sobald jemand über Ihren Link eine Testversion startet. Beträge bleiben ausstehend, bis das Rückerstattungsfenster geschlossen wird.',
  'settings.ui.referral.emptyExample':
    'Beispielzeile: acme.example, am 12. Juni mit einem Test begonnen, der bis zum 12. Juli aussteht und dann genehmigt wird.',
  'settings.ui.referral.termsLink': 'Lesen Sie die Partnerbedingungen',
  'settings.ui.referral.balance': 'Genehmigte Kommission',
  'settings.ui.referral.balanceUnavailableReason':
    'Das Provisionsbuch wurde für diesen Zeitraum noch nicht abgeglichen.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'Ein Dienstkonto ist eine benannte Identität für einen Agenten, ein Skript oder einen Workflow. Es hat seine eigenen Bereiche, seine eigenen Grenzen und seinen eigenen Prüfpfad.',
  'developer.ui.agents.emptyTitle': 'Noch keine Dienstkonten',
  'developer.ui.agents.emptyBody':
    'Erstellen Sie eine für jede von Ihnen ausgeführte Automatisierung. Separate Konten bedeuten, dass Sie eines widerrufen können, ohne die anderen zu sperren.',
  'developer.ui.agents.emptyExample':
    'Beispiel: „Content-Agent“, Projekt Acme EU, kann bis zu 6 Beiträge pro Tag zwischen 07:00 und 22:00 Uhr verfassen und planen, veröffentlicht jedoch nie sofort.',
  'developer.ui.agents.step.identity': 'Name und Zweck',
  'developer.ui.agents.step.scope': 'Was es erreichen kann',
  'developer.ui.agents.step.limits': 'Grenzen',
  'developer.ui.agents.purpose': 'Wozu dieses Konto dient',
  'developer.ui.agents.purposeHelp':
    'Ein Satz. Es erscheint neben jeder Aktion, die dieses Konto im Überwachungsprotokoll durchführt.',
  'developer.ui.agents.scopeHelp':
    'Ein Geltungsbereich gewährt sich genau selbst. Nichts hier impliziert etwas anderes.',
  'developer.ui.agents.limitsHelp':
    'Grenzwerte werden von der API erzwungen, nicht vom Agenten. Ein Agent kann sein eigenes Limit nicht erhöhen.',
  'developer.ui.agents.quietHours': 'Ruhige Stunden',
  'developer.ui.agents.quietHoursHelp':
    'Das Konto kann innerhalb dieser Stunden in der Zeitzone des Arbeitsbereichs keine Planungen oder Veröffentlichungen durchführen.',
  'developer.ui.agents.lookAheadHelp': 'Wie weit in der Zukunft kann ein Beitrag platziert werden?',
  'developer.ui.agents.cadenceHelp':
    'Die meisten externen Veröffentlichungen, die es an einem Tag verursachen kann.',
  'developer.ui.agents.expiry': 'Ablauf des Berechtigungsnachweises',
  'developer.ui.agents.expiryHelp':
    'Ein kürzeres Leben ist sicherer. Sie können jederzeit rotieren.',
  'developer.ui.agents.summaryTitle': 'Bevor Sie es erstellen',
  'developer.ui.agents.summaryAccounts': 'Konten, die es erreichen kann',
  'developer.ui.agents.summaryMaxActions':
    'Höchstens {count, plural, one {# externe Veröffentlichung} other {# externe Veröffentlichungen}} pro Tag.',
  'developer.ui.agents.summaryApproval': 'Zustimmungsverhalten',
  'developer.ui.agents.summaryCreate': 'Dienstkonto erstellen',
  'developer.ui.agents.detailTitle': 'Dienstkonto',
  'developer.ui.agents.statusActive': 'Aktiv',
  'developer.ui.agents.statusStopped': 'Angehalten',
  'developer.ui.agents.statusExpired': 'Anmeldedaten abgelaufen',
  'developer.ui.agents.stoppedBody':
    'Dieses Konto ist gesperrt. Jeder Anruf wird mit einem klaren Grund abgelehnt. Nichts, was es erstellt hat, wurde entfernt.',
  'developer.ui.agents.killTitle': 'Stoppen Sie {name}',
  'developer.ui.agents.killConsequence.calls':
    'Jeder API-, MCP- und CLI-Aufruf von diesem Konto wird sofort abgelehnt.',
  'developer.ui.agents.killConsequence.scheduled':
    'Veröffentlicht den bereits geplanten Aufenthalt. Löschen Sie sie aus dem Kalender, wenn Sie möchten, dass sie gestoppt werden.',
  'developer.ui.agents.killConsequence.reversible': 'Sie können es später erneut starten.',
  'developer.ui.agents.resume': 'Starten Sie diesen Agenten erneut',
  'developer.ui.agents.rotate': 'Anmeldeinformationen rotieren',
  'developer.ui.agents.rotateTitle': 'Drehen Sie die Anmeldeinformationen für {name} um',
  'developer.ui.agents.rotateConsequence.old':
    'Die aktuellen Anmeldeinformationen funktionieren sofort nicht mehr.',
  'developer.ui.agents.rotateConsequence.new': 'Das neue wird einmalig auf dieser Seite angezeigt.',
  'developer.ui.agents.rotateConsequence.clients':
    'Alles, was den alten Wert verwendet, schlägt fehl, bis Sie ihn aktualisieren.',
  'developer.ui.agents.credentialStored': 'Ich habe diesen Berechtigungsnachweis gespeichert',
  'developer.ui.agents.credentialLabel': 'Anmeldeinformationen für das Dienstkonto',
  'developer.ui.agents.credentialWarning':
    'Dies ist das einzige Mal, dass dieser Berechtigungsnachweis angezeigt wird',
  'developer.ui.agents.credentialWarningBody':
    'Kopieren Sie es jetzt in Ihren Geheimspeicher. Wir behalten nur einen Hash und können ihn daher nicht erneut anzeigen. Durch Drehen entsteht ein neues.',
  'developer.ui.agents.credentialConsumed':
    'Der Ausweis wird nicht mehr angezeigt. Drehen Sie es, wenn Sie es nicht aufbewahrt haben.',
  'developer.ui.agents.credentialReveal': 'Ausweis vorzeigen',
  'developer.ui.agents.credentialHide': 'Anmeldedaten ausblenden',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read':
    'Sehen Sie sich Ihre verbundenen Konten an und sehen Sie, was jedes einzelne tun kann',
  'developer.ui.scope.accounts_write': 'Benennen Sie Konten um und ändern Sie ihre Gruppierung',
  'developer.ui.scope.drafts_read': 'Lesen Sie Ihre Entwürfe und deren Varianten',
  'developer.ui.scope.drafts_write': 'Entwürfe erstellen und bearbeiten',
  'developer.ui.scope.posts_schedule': 'Planen Sie genehmigte Inhalte für Ihre Konten',
  'developer.ui.scope.posts_publish': 'Veröffentlichen Sie es sofort auf Ihren Konten',
  'developer.ui.scope.posts_cancel': 'Geplante Beiträge abbrechen',
  'developer.ui.scope.analytics_read': 'Lesen Sie Analysen für Ihre Konten',
  'developer.ui.scope.media_read': 'Sehen Sie sich die Dateien in Ihrer Bibliothek an',
  'developer.ui.scope.media_write':
    'Laden Sie Dateien in Ihre Bibliothek hoch und bearbeiten Sie sie',
  'developer.ui.scope.rules_read': 'Lesen Sie Ihre Automatisierungsregeln',
  'developer.ui.scope.rules_write':
    'Erstellen und ändern Sie Automatisierungsregeln, die veröffentlicht werden können',
  'developer.ui.scope.growth_read': 'Lesen Sie Ihre Wachstumspläne',
  'developer.ui.scope.growth_write': 'Wachstumspläne erstellen und bearbeiten',
  'developer.ui.scope.webhooks_manage': 'Erstellen und ändern Sie Webhook-Endpunkte',
  'developer.ui.scope.billing_read': 'Lesen Sie Ihren Plan, den Teststatus und die Nutzung',
  'developer.ui.scope.connections_admin': 'Soziale Konten verbinden und trennen',

  'developer.ui.activity.caption':
    'Kürzlich durchgeführte Toolaufrufe, darunter diejenigen, die abgelehnt wurden',
  'developer.ui.activity.column.time': 'Zeit',
  'developer.ui.activity.column.tool': 'Werkzeug oder Route',
  'developer.ui.activity.column.outcome': 'Ergebnis',
  'developer.ui.activity.column.subject': 'Betreff',
  'developer.ui.activity.outcome.ok': 'Erlaubt',
  'developer.ui.activity.outcome.denied': 'Abgelehnt',
  'developer.ui.activity.outcome.failed': 'Fehlgeschlagen',
  'developer.ui.activity.filterDenied': 'Nur abgelehnte Versuche anzeigen',
  'developer.ui.activity.deniedExplain':
    'Ein abgelehnter Versuch ist die Art und Weise, wie sich ein falsch konfigurierter Agent zeigt. Diese Zeilen werden beibehalten und nicht ausgeblendet.',
  'developer.ui.activity.emptyTitle': 'Es wurden noch keine Anrufe aufgezeichnet',
  'developer.ui.activity.emptyBody':
    'Hier werden innerhalb weniger Sekunden Anrufe angezeigt, auch solche, die abgelehnt wurden.',
  'developer.ui.activity.emptyExample':
    'Beispielzeile: 12:03, draft_post, Erlaubt, Entwurf für X-Konto @acme.',

  'developer.ui.setup.help':
    'Fügen Sie dies in den Client ein, den Sie verbinden. Ersetzen Sie den Platzhalter für die Anmeldeinformationen durch den von Ihnen gespeicherten Wert.',
  'developer.ui.setup.credentialPlaceholder':
    'Das Snippet verwendet einen Platzhalter. Übertragen Sie niemals die echten Anmeldeinformationen an ein Repository.',
  'developer.ui.setup.copySnippet': 'Snippet für {client} kopieren',
  'developer.ui.setup.snippetCopied': 'Snippet kopiert',
  'developer.ui.setup.tabLabel': 'Client-Setup-Snippets',

  'developer.ui.playground.help':
    'Aufrufe werden für eine Seed-Kopie dieses Arbeitsbereichs ausgeführt. Es wird kein Anbieter kontaktiert und nichts geplant.',
  'developer.ui.playground.tool': 'Werkzeug',
  'developer.ui.playground.arguments': 'Argumente',
  'developer.ui.playground.argumentsHelp': 'JSON. Derselbe Körper, den die echte API akzeptiert.',
  'developer.ui.playground.result': 'Ergebnis',
  'developer.ui.playground.resultEmpty':
    'Führen Sie ein Tool aus, um die zurückgegebene Antwort anzuzeigen.',
  'developer.ui.playground.invalidJson':
    'Dies ist noch kein gültiger JSON-Code und kann daher nicht gesendet werden.',
  'developer.ui.playground.deniedByApproval':
    'Die Genehmigungsstufe {level} lässt diesen Aufruf nicht zu. Der Probelauf lehnt es genau so ab, wie es die API tun würde.',
  'developer.ui.playground.announceResult': 'Trockenlauf beendet. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'Registrieren Sie eine Anwendung, damit andere Personen ihr Zugriff auf ihren Arbeitsbereich gewähren können. Jede App hat ihre eigene Identität, ihre eigene Weiterleitungs-Zulassungsliste und ihren eigenen Prüfpfad.',
  'developer.ui.apps.emptyTitle': 'Keine Apps registriert',
  'developer.ui.apps.emptyBody':
    'Registrieren Sie eine App, wenn ein anderes Produkt im Namen eines Relay-Benutzers agieren muss. Verwenden Sie für Ihre eigene Automatisierung stattdessen ein Dienstkonto.',
  'developer.ui.apps.emptyExample':
    'Beispiel: „Acme Publisher“, vertraulicher Client, Weiterleitung https://acme.example/oauth/callback, Bereiche Konten:Lesen und Entwürfe:Schreiben.',
  'developer.ui.apps.typeHelp':
    'Ein vertraulicher Client läuft auf einem Server, den Sie kontrollieren und der ein Geheimnis bewahren kann. Ein öffentlicher Client ist ein Browser oder eine Desktop-App und verwendet PKCE ohne Geheimnis.',
  'developer.ui.apps.redirectAdd': 'Fügen Sie einen Umleitungs-URI hinzu',
  'developer.ui.apps.redirectRemove': 'Entfernen Sie {uri}',
  'developer.ui.apps.redirectInvalid':
    'Geben Sie einen vollständigen https-URI ohne Platzhalter und ohne Abfragezeichenfolge ein. Er muss genau mit dem Wert übereinstimmen, den Ihre App sendet.',
  'developer.ui.apps.linksTitle': 'Veröffentlichte Links',
  'developer.ui.apps.linksHelp':
    'Diese erscheinen auf dem Zustimmungsbildschirm. Ein Benutzer, der sie nicht erreichen kann, gewährt keinen Zugriff.',
  'developer.ui.apps.linkUnreachable':
    'Bei unserer letzten Überprüfung konnten wir diese URL nicht erreichen: {date}.',
  'developer.ui.apps.linkReachable': 'Erreichbar, überprüft {date}',
  'developer.ui.apps.scopesTitle': 'Berechtigungen, nach denen diese App möglicherweise fragt',
  'developer.ui.apps.scopesHelp':
    'Bitten Sie um das Mindeste, was Sie brauchen. Ein Benutzer sieht Leseberechtigungen und Folgeberechtigungen als zwei separate Gruppen.',
  'developer.ui.apps.scopeGroup.read': 'Leseberechtigungen',
  'developer.ui.apps.scopeGroup.reversible': 'Änderungen, die Sie rückgängig machen können',
  'developer.ui.apps.scopeGroup.consequential': 'Folgeberechtigungen',
  'developer.ui.apps.scopeGroupHelp.read':
    'Dadurch kann die App Daten einsehen. Es ändert sich nichts.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Dadurch kann die App Dinge in Relay erstellen oder bearbeiten. Nichts erreicht eine Plattform.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Diese können zu einem Beitrag auf einem echten Konto führen oder dazu führen, dass sich die Zugriffsrechte für Ihre Konten ändern. Sie werden immer separat aufgeführt und niemals gebündelt.',
  'developer.ui.apps.noBundling':
    'Es gibt keinen kombinierten Zugriffsbereich. Abrechnung und Verbindungsverwaltung werden immer namentlich abgefragt.',
  'developer.ui.apps.secretTitle': 'Kundengeheimnis',
  'developer.ui.apps.secretWarning':
    'Dies ist das einzige Mal, dass das Client-Geheimnis angezeigt wird',
  'developer.ui.apps.secretWarningBody':
    'Speichern Sie es jetzt in Ihrem serverseitigen Secret Manager. Wir behalten nur einen Hash. Wenn Sie es verlieren, drehen Sie es: Es gibt keine Möglichkeit, es wieder freizulegen.',
  'developer.ui.apps.secretConsumed':
    'Das Geheimnis wird nicht mehr angezeigt. Drehen Sie es, wenn Sie es nicht aufbewahrt haben.',
  'developer.ui.apps.secretStored': 'Ich habe dieses Geheimnis gespeichert',
  'developer.ui.apps.secretPublicClient':
    'Ein öffentlicher Auftraggeber hat kein Geheimnis. Es verwendet den Autorisierungscodefluss mit PKCE.',
  'developer.ui.apps.rotateTitle': 'Rotieren Sie den geheimen Clientschlüssel für {app}',
  'developer.ui.apps.rotateConsequence.old':
    'Das aktuelle Geheimnis funktioniert sofort nicht mehr.',
  'developer.ui.apps.rotateConsequence.grants':
    'Bestehende Benutzerberechtigungen werden nicht widerrufen.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Ihre Server aktualisieren die Token erst, wenn Sie den neuen Wert bereitstellen.',
  'developer.ui.apps.consentPreviewTitle': 'Vorschau des Einwilligungsbildschirms',
  'developer.ui.apps.consentPreviewHelp':
    'Das sieht ein Benutzer. Es wird aus dem App-Datensatz generiert und kann daher nicht mehr versprechen, als die App verlangt.',
  'developer.ui.apps.consentPreviewSample':
    'Nur Vorschau. Es wird nichts gewährt und kein Token ausgegeben.',
  'developer.ui.apps.grantsCaption': 'Arbeitsbereiche, die dieser App Zugriff gewährt haben',
  'developer.ui.apps.grantColumn.workspace': 'Arbeitsbereich',
  'developer.ui.apps.grantColumn.scopes': 'Bereiche',
  'developer.ui.apps.grantColumn.granted': 'Zugegeben',
  'developer.ui.apps.grantColumn.lastUsed': 'Zuletzt verwendet',
  'developer.ui.apps.grantsEmpty': 'Noch hat niemand dieser App Zugriff gewährt.',
  'developer.ui.apps.logsCaption': 'Aktuelle Anfragen, mit entfernten Geheimnissen und Payloads',
  'developer.ui.apps.logColumn.time': 'Zeit',
  'developer.ui.apps.logColumn.route': 'Route',
  'developer.ui.apps.logColumn.status': 'Status',
  'developer.ui.apps.logColumn.workspace': 'Arbeitsbereich',
  'developer.ui.apps.logsRedacted':
    'Anforderungs- und Antworttexte werden ohne Anmeldeinformationen, Token und Benutzerinhalte gespeichert.',
  'developer.ui.apps.sandboxTitle': 'Sandbox-Anmeldeinformationen',
  'developer.ui.apps.sandboxBody':
    'Eine separate Client-ID und ein Arbeitsbereich mit Seed-Daten. Damit getätigte Anrufe erreichen nie einen Anbieter.',
  'developer.ui.apps.rateLimitLabel': 'Ratenbegrenzung',
  'developer.ui.apps.rateLimitUsage': '{used} von {limit} fordert diese Stunde an',
  'developer.ui.apps.disable': 'App deaktivieren',
  'developer.ui.apps.enable': 'App aktivieren',
  'developer.ui.apps.disabledBody':
    'Diese App ist deaktiviert. Vorhandene Token werden abgelehnt und es kann keine neue Gewährung gestartet werden. Zuschüsse bleiben erhalten, sodass Sie sie erneut aktivieren können.',
  'developer.ui.apps.deleteTitle': 'Löschen Sie {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Jede Gewährung wird widerrufen und jeder Token funktioniert nicht mehr.',
  'developer.ui.apps.deleteConsequence.logs':
    'Anforderungsprotokolle werden für den Audit-Aufbewahrungszeitraum aufbewahrt.',
  'developer.ui.apps.deleteConsequence.irreversible':
    'Die Client-ID kann nicht wiederverwendet werden.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Signierte HTTPS-Lieferungen für die von Ihnen ausgewählten Ereignisse. Jede Lieferung wird mit ihrer Antwort protokolliert und jede Lieferung kann erneut versendet werden.',
  'developer.ui.webhooks.emptyTitle': 'Noch keine Endpunkte',
  'developer.ui.webhooks.emptyBody':
    'Fügen Sie einen Endpunkt hinzu, um Veröffentlichungsergebnisse, Genehmigungsentscheidungen und Verbindungsstatus in Ihren eigenen Systemen zu erhalten.',
  'developer.ui.webhooks.emptyExample':
    'Beispiel: https://hooks.acme.example/relay, abonniert für post.published, post.failed und Connection.action_required.',
  'developer.ui.webhooks.create': 'Fügen Sie einen Endpunkt hinzu',
  'developer.ui.webhooks.url': 'Endpunkt-URL',
  'developer.ui.webhooks.urlHelp':
    'Nur HTTPS. Wir folgen keinen Weiterleitungen und versuchen es nicht erneut mit einem 2xx.',
  'developer.ui.webhooks.eventsTitle': 'Veranstaltungen',
  'developer.ui.webhooks.eventsHelp':
    'Wählen Sie die Ereignisse aus, die Sie bearbeiten. Wenn alles an einen Endpunkt gesendet wird, der das meiste davon ignoriert, sind Fehler schwerer zu erkennen.',
  'developer.ui.webhooks.eventsAll': 'Jede Veranstaltung',
  'developer.ui.webhooks.eventsSelected': 'Nur die Ereignisse, die ich auswähle',
  'developer.ui.webhooks.eventsCount': '{count, plural, one {# Ereignis} other {# Ereignisse}}',
  'developer.ui.webhooks.eventGroup.connections': 'Verbindungen',
  'developer.ui.webhooks.eventGroup.content': 'Inhalt und Genehmigung',
  'developer.ui.webhooks.eventGroup.publishing': 'Veröffentlichung',
  'developer.ui.webhooks.eventGroup.automation': 'Automatisierung und Feeds',
  'developer.ui.webhooks.eventGroup.workspace': 'Arbeitsbereich',
  'developer.ui.webhooks.scopeTitle': 'Projekte und Konten',
  'developer.ui.webhooks.scopeAll': 'Jedes Projekt und jedes Konto',
  'developer.ui.webhooks.scopeSelected': 'Nur die, die ich auswähle',
  'developer.ui.webhooks.secretTitle': 'Unterzeichnungsgeheimnis',
  'developer.ui.webhooks.secretBody':
    'Überprüfen Sie den Signaturheader, bevor Sie einen Text analysieren. Deduplizieren Sie die Zustellungs-ID, die über Wiederholungsversuche hinweg stabil bleibt.',
  'developer.ui.webhooks.secretRotateTitle': 'Rotieren Sie das Signaturgeheimnis',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Beide Geheimnisse werden 24 Stunden lang akzeptiert, sodass Sie sie bereitstellen können, ohne eine Lieferung abzubrechen.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Nach diesem Fenster wird nur noch das neue Geheimnis verwendet.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Sendet ein signiertes Beispielereignis, das als Test markiert ist, sodass Ihr Empfänger es problemlos ignorieren kann.',
  'developer.ui.webhooks.testDeliverySent':
    'Testlieferung verschickt. Das Ergebnis erscheint im Protokoll unten.',
  'developer.ui.webhooks.deliveriesCaption':
    'Aktuelle Lieferungen und die Antwort, die sie jeweils erhalten haben',
  'developer.ui.webhooks.deliveryColumn.time': 'Angefordert',
  'developer.ui.webhooks.deliveryColumn.event': 'Veranstaltung',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Versuch',
  'developer.ui.webhooks.deliveryColumn.response': 'Antwort',
  'developer.ui.webhooks.deliveryColumn.status': 'Status',
  'developer.ui.webhooks.deliveryStatus.pending': 'Warten',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Geliefert',
  'developer.ui.webhooks.deliveryStatus.failed': 'Fehlgeschlagen, es wird erneut versucht',
  'developer.ui.webhooks.deliveryStatus.exhausted':
    'Fehlgeschlagen, keine weiteren Wiederholungsversuche',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Nicht gesendet, Endpunkt deaktiviert',
  'developer.ui.webhooks.deliveryNoResponse': 'Keine Antwort erhalten',
  'developer.ui.webhooks.deliveryNextAttempt': 'Nächster Versuch {relativeTime}',
  'developer.ui.webhooks.inspect': 'Lieferung prüfen',
  'developer.ui.webhooks.inspectTitle': 'Lieferung {id}',
  'developer.ui.webhooks.inspectRequest': 'Anforderungstext',
  'developer.ui.webhooks.inspectResponse': 'Antwortkörper',
  'developer.ui.webhooks.redeliver': 'Senden Sie diese Lieferung erneut',
  'developer.ui.webhooks.redeliverHelp':
    'Dieselbe Ereignis-ID wird erneut mit gesetztem Redelivery-Flag gesendet, sodass ein idempotenter Empfänger sie sicher ignoriert.',
  'developer.ui.webhooks.redelivered': 'In der Warteschlange für eine erneute Lieferung.',
  'developer.ui.webhooks.failureTitle': 'Dieser Endpunkt schlägt fehl',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# Zustellung in Folge fehlgeschlagen} other {# Zustellung in Folge fehlgeschlagen}}. Nach {limit} aufeinanderfolgenden Fehlern wird der Endpunkt deaktiviert und ein Aktionselement wird abgelegt.',
  'developer.ui.webhooks.disabledTitle':
    'Dieser Endpunkt wurde nach wiederholten Fehlern deaktiviert',
  'developer.ui.webhooks.disabledBody':
    'Wir haben die Übermittlung an diesen Server eingestellt, sodass Ihre Warteschlange nicht voll wird. Reparieren Sie den Empfänger, senden Sie eine Testzustellung und aktivieren Sie ihn dann erneut.',
  'developer.ui.webhooks.lastSuccessLabel': 'Letzter Erfolg',
  'developer.ui.webhooks.lastSuccessNever': 'Es gelang noch nie eine Lieferung',
  'developer.ui.webhooks.deleteTitle': 'Löschen Sie diesen Endpunkt',
  'developer.ui.webhooks.deleteConsequence.stop': 'An diese URL wird nichts mehr gesendet.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'Zustellungsprotokolle werden für den Audit-Aufbewahrungszeitraum aufbewahrt.',

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
    'Trial, {count, plural, =0 {ends today} one {# day remaining} other {# days remaining}}',
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
    'Beantworten Sie eine kurze Aufnahme, bestätigen Sie, was wir verstanden haben, und erhalten Sie einen Plan, den Sie Punkt für Punkt akzeptieren können. Es schlägt Arbeit vor. Es plant oder veröffentlicht niemals selbst etwas.',
  'growth.ui.step.intake': 'Aufnahme',
  'growth.ui.step.confirm': 'Bestätigen',
  'growth.ui.step.plan': 'Planen',
  'growth.ui.stepIndicator': 'Schritt {current} von {total}: {name}',
  'growth.ui.intake.section.product': 'Produkt',
  'growth.ui.intake.section.audience': 'Zielgruppe und Märkte',
  'growth.ui.intake.section.objective': 'Ziel',
  'growth.ui.intake.section.capacity': 'Kanäle und Kapazität',
  'growth.ui.intake.section.limits': 'Was ist tabu?',
  'growth.ui.intake.help':
    'Hier ist nichts für Sie erraten. Alles, was Sie leer lassen, wird als fehlend markiert und nicht ausgefüllt.',
  'growth.ui.intake.productNameHelp': 'Der Name, den Sie bei Kunden verwenden.',
  'growth.ui.intake.siteUrlHelp':
    'Wir lesen die Seite, die Sie uns als Ausgangsmaterial geben. Sie bestätigen alle Fakten, die wir daraus ziehen.',
  'growth.ui.intake.descriptionHelp':
    'Was Sie verkaufen und für wen es ist, in Ihren eigenen Worten.',
  'growth.ui.intake.marketsHelp': 'Länder oder Regionen. Eine pro Zeile.',
  'growth.ui.intake.localesHelp': 'Die Sprachen, in denen Sie veröffentlichen werden.',
  'growth.ui.intake.objectiveHelp': 'Wovon Sie im nächsten Quartal mehr wollen.',
  'growth.ui.intake.conversionHelp':
    'Die Aktion, die Sie tatsächlich messen können. Eine Anmeldung, eine Demo, ein Kauf.',
  'growth.ui.intake.proofHelp':
    'Fallstudien, von Ihnen durchgeführte Benchmarks, Screenshots, die Sie besitzen, Berechtigungen, die Sie bereits besitzen. Eine pro Zeile.',
  'growth.ui.intake.proofNone': 'Ich habe noch keinen genehmigten Beweis',
  'growth.ui.intake.proofNoneEffect':
    'Durch den Plan werden Kundenergebnisse und Ergebnisansprüche vollständig vermieden.',
  'growth.ui.intake.channelsHelp': 'Die Konten, von denen Sie bereits veröffentlichen.',
  'growth.ui.intake.capacityHelp':
    'Seien Sie ehrlich. Ein Plan, den Sie nicht ausführen können, ist kein Plan.',
  'growth.ui.intake.competitorsHelp': 'Optional. Eine pro Zeile.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Ansprüche, die Sie aus rechtlichen oder politischen Gründen nicht geltend machen dürfen. Eine pro Zeile.',
  'growth.ui.intake.prohibitedTopicsHelp':
    'Themen, von denen man die Finger lassen sollte. Eine pro Zeile.',
  'growth.ui.intake.submit': 'Überprüfen Sie, was wir verstanden haben',
  'growth.ui.intake.savedAnnouncement': 'Unternehmensprofil gespeichert.',
  'growth.ui.intake.requiredMissing':
    'Füllen Sie die als Pflichtfelder gekennzeichneten Felder aus, bevor Sie fortfahren.',

  'growth.ui.confirm.factsTitle': 'Fakten, die Sie bestätigt haben',
  'growth.ui.confirm.factsHelp': 'Diese können in Kopie verwendet werden.',
  'growth.ui.confirm.assumptionsTitle': 'Annahmen, die wir gemacht haben',
  'growth.ui.confirm.assumptionsHelp':
    'Das sind keine Fakten. Sie formen den Plan, werden aber nie zu einem Anspruch in einem Beitrag.',
  'growth.ui.confirm.missingTitle': 'Fehlt',
  'growth.ui.confirm.missingHelp':
    'Der Plan berücksichtigt alle diese Punkte und gibt an, wo es darauf ankommt.',
  'growth.ui.confirm.confidence.label': 'Vertrauen: {level}',
  'growth.ui.confirm.confidence.low': 'niedrig',
  'growth.ui.confirm.confidence.medium': 'mittel',
  'growth.ui.confirm.confidence.high': 'hoch',
  'growth.ui.confirm.promote': 'Als Tatsache bestätigen',
  'growth.ui.confirm.correct': 'Korrigieren Sie dies',
  'growth.ui.confirm.correctLabel': 'Deine Korrektur',
  'growth.ui.confirm.generate': 'Generieren Sie den Plan',
  'growth.ui.confirm.announcement': 'Unternehmensprofil bestätigt.',

  'growth.ui.plan.generatingBody':
    'Dies dauert einige Sekunden. Sie können diese Seite verlassen: Der Plan wird von selbst beendet.',
  'growth.ui.plan.stateDraft': 'Entwurf, nicht genehmigt',
  'growth.ui.plan.stateApproved': 'Genehmigt',
  'growth.ui.plan.stateSuperseded': 'Durch eine neuere Version ersetzt',
  'growth.ui.plan.newVersionNotice':
    'Eine Aktualisierung erstellt die Version {version} und lässt die genehmigte Version unberührt.',
  'growth.ui.plan.emptyTitle': 'Noch kein Plan',
  'growth.ui.plan.emptyBody':
    'Füllen Sie das Unternehmensprofil aus und wir erstellen anhand der von Ihnen bestätigten Fakten einen Plan.',
  'growth.ui.plan.emptyExample':
    'Ein Plan enthält eine Strategie, vierwöchige Briefings, eine UGC-Kampagne, kataloggestützte Möglichkeiten und bis zu fünf Tools.',
  'growth.ui.plan.tabsLabel': 'Abschnitte planen',
  'growth.ui.plan.modelNote':
    'Generiert von {model}, Eingabeaufforderung {promptVersion}, auf {date}.',

  'growth.ui.strategy.snapshotTitle': 'Geschäftsschnappschuss',
  'growth.ui.strategy.channelPriority': 'Priorität {rank}',
  'growth.ui.strategy.channelFormats': 'Native Formate',
  'growth.ui.strategy.pillarProof': 'Ein Beweis dafür, dass sich diese Säule stützt',
  'growth.ui.strategy.pillarProofNone':
    'Kein genehmigter Beweis. Halten Sie diese Säule beschreibend.',
  'growth.ui.strategy.cadenceCaption': 'Beiträge pro Woche nach Kanal',
  'growth.ui.strategy.cadenceColumn.channel': 'Kanal',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Beiträge pro Woche',
  'growth.ui.strategy.cadenceTotal': 'Insgesamt pro Woche',
  'growth.ui.strategy.capacityWarning':
    'Dieser Rhythmus beträgt {planned} Beiträge pro Woche bei einer angegebenen Kapazität von {capacity} Stunden. Reduzieren oder erhöhen Sie die Kapazität im Profil.',
  'growth.ui.strategy.measurementBody':
    'Verglichen mit Ihren eigenen Trailing-Posts auf demselben Kanal und Format. Es wird kein externer Benchmark verwendet, da keiner mit Ihrem Konto vergleichbar ist.',
  'growth.ui.strategy.localeAdaptations': 'Sprachnotizen',

  'growth.ui.fourWeek.caption': 'Vorgeschlagene Kurzbeschreibungen nach Woche und Tag',
  'growth.ui.fourWeek.column.date': 'Datum',
  'growth.ui.fourWeek.column.channel': 'Kanal',
  'growth.ui.fourWeek.column.pillar': 'Säule',
  'growth.ui.fourWeek.column.format': 'Formatieren',
  'growth.ui.fourWeek.column.brief': 'Kurz',
  'growth.ui.fourWeek.column.cta': 'Aufruf zum Handeln',
  'growth.ui.fourWeek.column.measurement': 'Messetikett',
  'growth.ui.fourWeek.column.actions': 'Aktionen',
  'growth.ui.fourWeek.approvalRequired':
    'Für die Veröffentlichung ist eine Genehmigung erforderlich',
  'growth.ui.fourWeek.approvalNotRequired': 'Für dieses Konto ist keine Genehmigung erforderlich',
  'growth.ui.fourWeek.noCta': 'Kein Aufruf zum Handeln',
  'growth.ui.fourWeek.weekEmpty': 'Für diese Woche sind keine Briefings vorgeschlagen.',
  'growth.ui.fourWeek.acceptedCount':
    '{accepted} von {total}-Schriftsätzen als Entwürfe akzeptiert',
  'growth.ui.fourWeek.acceptAnnouncement': 'Aus diesem Brief erstellter Entwurf.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Kalendervorschlag für {date} hinzugefügt.',

  'growth.ui.ugc.promptAngle': 'Angle {number}',
  'growth.ui.ugc.checklistTitle': 'Rights, consent and disclosure',
  'growth.ui.ugc.checklistHelp':
    'Work through this with each participant before anything is published. Consent to appear is not consent to advertise.',
  'growth.ui.ugc.incentiveNone': 'No incentive offered',
  'growth.ui.ugc.incentiveDisclosure':
    'An incentive must be disclosed on every post that results from it, by you and by the participant.',
  'growth.ui.ugc.honesty':
    'This plans a campaign you run with real people. Relay does not find creators, contact them, write testimonials or create customer content.',

  'growth.ui.opportunities.caption':
    'Verifizierte Möglichkeiten aus dem Katalog, sortiert nach Übereinstimmung mit Ihrem Profil',
  'growth.ui.opportunities.column.opportunity': 'Gelegenheit',
  'growth.ui.opportunities.column.type': 'Typ',
  'growth.ui.opportunities.column.audience': 'Publikum',
  'growth.ui.opportunities.column.fit': 'Warum das passt',
  'growth.ui.opportunities.column.requirements': 'Anforderungen',
  'growth.ui.opportunities.column.rules': 'Regeln zur Eigenwerbung',
  'growth.ui.opportunities.column.cost': 'Kosten',
  'growth.ui.opportunities.column.effort': 'Aufwand',
  'growth.ui.opportunities.column.verified': 'Zuletzt überprüft',
  'growth.ui.opportunities.column.actions': 'Aktionen',
  'growth.ui.opportunities.costFree': 'Kostenlos',
  'growth.ui.opportunities.effort.low': 'Niedrig',
  'growth.ui.opportunities.effort.medium': 'Mittel',
  'growth.ui.opportunities.effort.high': 'Hoch',
  'growth.ui.opportunities.noRequiredAsset': 'Kein Vermögenswert erforderlich',
  'growth.ui.opportunities.prepareTitle': 'Bereiten Sie eine Übermittlung für {name} vor',
  'growth.ui.opportunities.prepareRules': 'Ihre Regeln, zitiert',
  'growth.ui.opportunities.prepareChecklist': 'Was Sie bereithalten sollten',
  'growth.ui.opportunities.prepareManual':
    'Sie reichen dies selbst auf ihrer Website ein. Relay füllt keine Formulare aus, erstellt keine Konten und sendet keine E-Mails an Dritte.',
  'growth.ui.opportunities.pitchTitle': 'Pitch-Entwurf',
  'growth.ui.opportunities.pitchHelp':
    'Bearbeiten Sie es, bevor Sie es senden. Es werden nur die von Ihnen bestätigten Fakten verwendet.',
  'growth.ui.opportunities.submittedOn': 'Eingereicht {date}',
  'growth.ui.opportunities.staleTitle': 'Einige Einträge müssen erneut überprüft werden',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# Eintrag hat sein Überprüfungsdatum überschritten} other {# Einträge haben sein Überprüfungsdatum überschritten}}. Überprüfen Sie die aktuellen Regeln auf der Website, bevor Sie sich darauf verlassen.',
  'growth.ui.opportunities.emptyExample':
    'Eine Katalogzeile enthält die offizielle URL, die Zielgruppe, die auf der Website angegebenen Einreichungsregeln, die Kosten, den Aufwand und das Datum, an dem eine Person sie zuletzt überprüft hat.',

  'growth.ui.tools.shown': '{shown} von {max} angezeigt',
  'growth.ui.tools.fewerThanMax':
    'Nur {count, plural, one {# Tool stimmt überein} other {# Tools stimmt überein}} dieser Workflow mit einer aktuellen Überprüfung. Wir zeigen lieber weniger, als die Liste aufzufüllen.',
  'growth.ui.tools.emptyTitle':
    'Es gibt noch kein getestetes Tool, das für diesen Workflow geeignet ist',
  'growth.ui.tools.emptyBody':
    'Jeder Eintrag benötigt einen geprüften Preis, geprüfte Rechtebedingungen und eine benannte Einschränkung, bevor er hier erscheint.',
  'growth.ui.tools.emptyExample':
    'In einem Eintrag wird angegeben, wozu es am besten geeignet ist, warum es zu Ihrem Plan passt, was es nicht kann, welche Fähigkeiten es benötigt, wie die Ausgabe in Relay zurückkommt und wann der Preis zuletzt überprüft wurde.',
  'growth.ui.tools.openSite': 'Öffnen Sie die offizielle Website für {name}',
  'growth.ui.tools.stale':
    'Das Überprüfungsdatum ist überschritten. Von generierten Plänen ausgeschlossen.',

  'growth.ui.item.explainTitle': 'Warum dies vorgeschlagen wurde',
  'growth.ui.item.explainEvidence': 'Worauf es basiert',
  'growth.ui.item.explainNoEvidence':
    'Dies ergab sich aus dem Ziel und den Kanalregeln, nicht aus einer bestätigten Tatsache über Ihr Unternehmen.',
  'growth.ui.item.dismissTitle': 'Lehnen Sie diesen Vorschlag ab',
  'growth.ui.item.dismissBody':
    'Sagen Sie uns warum. Der Grund wird mit dem Plan gespeichert und prägt die nächste Version.',
  'growth.ui.item.dismissReasonLabel': 'Grund',
  'growth.ui.item.dismissReason.notRelevant': 'Für dieses Unternehmen nicht relevant',
  'growth.ui.item.dismissReason.noCapacity': 'Wir haben nicht die Kapazität',
  'growth.ui.item.dismissReason.wrongAudience': 'Falsches Publikum',
  'growth.ui.item.dismissReason.alreadyDone': 'Das machen wir bereits',
  'growth.ui.item.dismissReason.policy': 'Gegen unsere Richtlinien oder Ansprüche',
  'growth.ui.item.dismissReason.other': 'Etwas anderes',
  'growth.ui.item.dismissNote': 'Alles, was Sie hinzufügen möchten',
  'growth.ui.item.dismissed':
    'Entlassen. Es bleibt sichtbar, sodass Sie es rückgängig machen können.',
  'growth.ui.item.undoDismiss': 'Entlassen rückgängig machen',

  'growth.ui.export.title': 'Exportieren Sie diesen Plan',
  'growth.ui.export.formatLabel': 'Formatieren',
  'growth.ui.export.copy': 'In die Zwischenablage kopieren',
  'growth.ui.export.download': 'Datei herunterladen',
  'growth.ui.export.copied': 'Plan in die Zwischenablage kopiert.',
  'growth.ui.export.schemaNote':
    'Alle drei Formate stammen aus einem validierten Schema, Version {version}. Die strukturierten Ansichten sind sicher für die Quellcodeverwaltung und enthalten keine Geheimnisse.',
  'growth.ui.export.previewLabel': 'Vorschau exportieren',
  'settings.ui.projects.domainVerificationUnavailable': 'Die Verifizierung ist noch nicht gebaut',
  'settings.ui.projects.disclosureUnavailable':
    'Offenlegungsvorgaben pro Kanal sind noch nicht gebaut. Fügen Sie die erforderliche Offenlegung so lange im Beitrag hinzu.',
  'settings.ui.projects.glossaryUnavailable':
    'Das Glossar des Arbeitsbereichs ist noch nicht gebaut. Stimme, Zielgruppe, freigegebene Aussagen und gesperrte Begriffe oben werden gespeichert und durchgesetzt.',
  'settings.ui.projects.localeRulesUnavailable':
    'Schreibregeln pro Sprache sind noch nicht gebaut. Sprachen und Märkte des Arbeitsbereichs bleiben unter Lokalisierung verfügbar.',
  'settings.ui.projects.capacityTitle': 'Projektkapazität',
  'settings.ui.projects.capacitySummary': '{used} von {limit}',
  'settings.ui.projects.atLimitTitle': 'Dieser Arbeitsbereich hat jeden Projektplatz belegt',
  'settings.ui.projects.atLimitBody':
    'Archivieren Sie ein inaktives Projekt oder ändern Sie die Berechtigung des Arbeitsbereichs, bevor Sie ein weiteres hinzufügen. Das aktuelle Limit ist {limit}.',
  'settings.ui.projects.listLabel': 'Wählen Sie ein Projekt zum Bearbeiten',
  'settings.ui.projects.detailsTitle': 'Projektdetails',
  'settings.ui.projects.projectMeta':
    '{accounts, plural, =0 {Keine Kanäle} one {# Kanal} other {# Kanäle}} · Aktualisiert {updated}',
  'settings.ui.projects.archiveAction': 'Projekt archivieren',
  'settings.ui.projects.archiveTitle': '{project} archivieren?',
  'settings.ui.projects.archiveBody':
    'Dieses inaktive Projekt verlässt den aktiven Arbeitsbereich und gibt einen Projektplatz frei.',
  'settings.ui.projects.archiveChannels':
    'Seine verbundenen Kanäle erscheinen nicht mehr in den Abläufen aktiver Projekte.',
  'settings.ui.projects.archiveHistory':
    'Entwürfe, veröffentlichte Beiträge, Belege und Prüfhistorie bleiben erhalten.',
  'settings.ui.projects.archiveLastDisabled':
    'Behalten Sie mindestens ein aktives Projekt im Arbeitsbereich.',
  'settings.ui.projects.archiveConnectedDisabled':
    'Trennen Sie die Kanäle dieses Projekts, bevor Sie es archivieren.',
} as const;
