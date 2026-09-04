/**
 * The web application shell: Home, the command palette, the Action center
 * queue chrome, the demo data notice, and the parts of sign in and onboarding
 * that the shared `auth`, `onboarding` and `billing` catalogs do not cover.
 *
 * Owned by the web shell. Screen catalogs (composer, calendar, analytics)
 * belong to their own files.
 */
export const webShellMessages = {
  /* -- Document and shell chrome ----------------------------------------- */
  'shell.appName': 'Post Array',
  'shell.documentTitle': '{page} · Post Array',
  'shell.tagline': 'Ein Verlagstisch für Menschen und Agenten.',
  'shell.menu.open': 'Öffnen Sie das Menü',
  'shell.menu.title': 'Menü',
  'shell.nav.more': 'Mehr',
  'shell.help.title': 'Hilfe',
  'shell.help.documentation': 'Dokumentation',
  'shell.help.keyboardShortcuts': 'Tastaturkürzel',
  'shell.help.platformStatus': 'Plattformstatus',
  'shell.help.whatChanged': 'Was hat sich geändert?',
  'shell.help.contactSupport': 'Kontaktieren Sie den Support',
  'shell.account.settings': 'Einstellungen',
  'shell.account.profile': 'Ihr Profil',
  'shell.workspace.create': 'Erstellen Sie einen Arbeitsbereich',
  'shell.workspace.manage': 'Arbeitsbereichseinstellungen',
  'shell.workspace.role': 'Sie sind hier {role}',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Demodaten',
  'shell.demo.title': 'Sie sehen sich Demodaten an',
  'shell.demo.body':
    'Die Post Array-API ist über diesen Browser nicht erreichbar, daher werden die Bildschirme mit einem vordefinierten Beispielarbeitsbereich gefüllt. Hier ist nichts mit einem echten Konto verbunden und nichts kann veröffentlicht werden.',
  'shell.demo.howToConnect':
    'Legen Sie NEXT_PUBLIC_POSTARRAY_API_URL fest und starten Sie die App neu, um Live-Daten zu verwenden.',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Du bist offline',
  'shell.offline.body':
    'Entwürfe werden auf diesem Gerät gespeichert. Die Planung und Veröffentlichung wird fortgesetzt, sobald die Verbindung wiederhergestellt ist.',
  'shell.offline.retry': 'Überprüfen Sie die Verbindung',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Öffnen Sie die Befehlspalette',
  'palette.title': 'Befehlspalette',
  'palette.description': 'Suchen Sie nach einem Bildschirm, einem Konto oder einer Aktion.',
  'palette.placeholder': 'Geben Sie einen Befehl oder einen Bildschirmnamen ein',
  'palette.empty': 'Nichts stimmt mit {query} überein.',
  'palette.group.actions': 'Aktionen',
  'palette.group.goTo': 'Gehe zu',
  'palette.group.workspaces': 'Arbeitsbereiche',
  'palette.group.settings': 'Einstellungen',
  'palette.hint.navigate': 'Bewegen Sie sich mit den Pfeiltasten',
  'palette.hint.select': 'Mit Enter öffnen',
  'palette.hint.close': 'Schließen Sie mit Escape',
  'palette.action.compose': 'Verfassen Sie einen Beitrag',
  'palette.action.connectAccount': 'Verbinden Sie ein Konto',
  'palette.action.openActionCenter': 'Öffnen Sie das Action Center',
  'palette.action.uploadMedia': 'Medien hochladen',
  'palette.action.createRule': 'Erstellen Sie eine Automatisierungsregel',
  'palette.action.toggleTheme': 'Wechseln Sie das Thema',
  'palette.action.signOut': 'Abmelden',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Öffnen Sie das Action Center',
  'actionCenter.group.now.label': 'Jetzt',
  'actionCenter.group.soon.label': 'Bald',
  'actionCenter.group.watching.label': 'Zuschauen',
  'actionCenter.group.now.hint': 'Die Veröffentlichung ist gefährdet, bis diese bearbeitet werden.',
  'actionCenter.group.soon.hint': 'Diese haben eine Frist, die Sie noch einhalten können.',
  'actionCenter.group.watching.hint': 'Nicht dringend. Diese Woche lohnt sich ein Blick.',
  'actionCenter.severity.now': 'Braucht dich jetzt',
  'actionCenter.severity.soon': 'Braucht dich bald',
  'actionCenter.severity.watching': 'Zuschauen',
  'actionCenter.filter.all': 'Alle',
  'actionCenter.filter.connections': 'Verbindungen',
  'actionCenter.filter.publishing': 'Veröffentlichung',
  'actionCenter.filter.automation': 'Automatisierung',
  'actionCenter.filter.billing': 'Abrechnung',
  'actionCenter.snoozed': 'Geschlummert',
  'actionCenter.snoozeOneDay': 'Einen Tag lang schlafen',
  'actionCenter.snoozedUntil': 'Schlummert bis {date}',
  'actionCenter.unsnooze': 'Bring das zurück',
  'actionCenter.resolved': '{relativeTime} behoben',
  'actionCenter.emptyFiltered': 'Nichts in dieser Gruppe braucht Aufmerksamkeit.',
  'actionCenter.errorTitle': 'Das Action Center konnte nicht geladen werden',
  'actionCenter.loading': 'Laden, was Aufmerksamkeit erfordert',
  'actionCenter.affectedAccount': 'Betrifft {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Nichts erfordert Aufmerksamkeit} one {# Artikel} other {# Artikel}}',
  'actionCenter.action.reconnect': 'Wieder verbinden',
  'actionCenter.action.openReceipt': 'Öffnen Sie die Quittung',
  'actionCenter.action.review': 'Rezension',
  'actionCenter.action.openDraft': 'Öffnen Sie den Entwurf',
  'actionCenter.action.openCalendar': 'Öffnen Sie den Kalender',
  'actionCenter.action.viewStatus': 'Status anzeigen',
  'actionCenter.action.checkFeed': 'Überprüfen Sie den Feed',
  'actionCenter.action.inspectDeliveries': 'Lieferungen prüfen',
  'actionCenter.action.addBalance': 'Überprüfen Sie die Nutzung',
  'actionCenter.action.fixConnection': 'Korrigieren Sie die Verbindung',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Zuhause',
  'home.subtitle': 'Was Sie heute brauchen und was als nächstes kommt.',
  'home.greetingSummary':
    '{actions, plural, =0 {Nichts braucht dich im Moment} one {# Artikel braucht dich} other {# Artikel braucht dich}}. {upcoming, plural, =0 {In den nächsten 24 Stunden ist nichts geplant} one {# Beitrag geht in den nächsten 24 Stunden raus} other {# Beiträge gehen in den nächsten 24 Stunden raus}}.',
  'home.needsYou.title': 'Braucht dich jetzt',
  'home.needsYou.empty': 'Im Moment braucht dich nichts.',
  'home.needsYou.emptyBody':
    'Verbindungsstatus, Genehmigungen und fehlgeschlagene Veröffentlichungen werden hier angezeigt, sobald sie auftreten.',
  'home.needsYou.viewAll': 'Öffnen Sie das Action Center',
  'home.needsYou.emptyQuiet':
    'Genießen Sie die Ruhe – alles, was eine Entscheidung erfordert, erscheint hier in dem Moment, in dem es passiert.',
  'home.upcoming.title': 'Nächste 24 Stunden',
  'home.upcoming.empty': 'In den nächsten 24 Stunden ist nichts geplant.',
  'home.upcoming.emptyBody':
    'Schreiben Sie einen Beitrag und wählen Sie einen Zeitpunkt aus. Sie können es später ändern.',
  'home.upcoming.viewAll': 'Öffnen Sie den Kalender',
  'home.upcoming.timeZoneNote':
    'Die Zeiten werden in {timeZone}, der Arbeitsbereichszone, angezeigt.',
  'home.upcoming.columnTime': 'Zeit',
  'home.upcoming.columnAccount': 'Konto',
  'home.upcoming.columnContent': 'Inhalt',
  'home.upcoming.columnStatus': 'Status',
  'home.receipts.title': 'Aktuelle Quittungen',
  'home.receipts.empty': 'In diesem Arbeitsbereich wurden noch keine Beiträge veröffentlicht.',
  'home.receipts.emptyBody':
    'Für jede Veröffentlichung gibt es eine Quittung, die Sie einsehen und weitergeben können.',
  'home.receipts.viewAll': 'Alle Quittungen',
  'home.receipts.publishedTo': 'Veröffentlicht auf {account}',
  'home.connections.title': 'Verbindungszustand',
  'home.connections.summary':
    '{healthy, plural, one {# Konto funktioniert} other {# Konten funktionieren}}. {attention, plural, =0 {Keine Aufmerksamkeit erforderlich} one {# Aufmerksamkeit erforderlich} other {# Aufmerksamkeit erforderlich}}.',
  'home.connections.viewAll': 'Alle Verbindungen',
  'home.connections.empty': 'Noch keine Konten verbunden.',
  'home.advisor.title': 'Wachstumsberater',
  'home.advisor.summary':
    'Die Planversion {version} wurde {date} genehmigt. Woche {week} von {total} hat {briefs, plural, one {# Brief noch nicht erstellt} other {# Brief noch nicht erstellt}}.',
  'home.advisor.noPlan':
    'Der Berater erstellt einen Plan anhand der von Ihnen bestätigten Fakten. Es schlägt Arbeiten vor und veröffentlicht niemals selbst.',
  'home.advisor.openPlan': 'Öffnen Sie den Plan',
  'home.advisor.createDrafts': 'Erstellen Sie Entwürfe aus der Woche {week}',
  'home.advisor.start': 'Starten Sie das Unternehmensprofil',
  'home.trial.banner':
    'Testversion, {days, plural, =0 {endet heute} one {# verbleibender Tag} other {# verbleibender Tag}}. Konvertiert {date} in {amount}.',
  'home.trial.manage': 'Verwalten oder stornieren',
  'home.error.title': 'Startseite konnte nicht geladen werden',
  'home.error.body':
    'Ihr Arbeitsbereich ist intakt. Dies ist ein Problem beim Erreichen der Post Array-API.',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title':
    'Veröffentlichen Sie über offizielle APIs und sehen Sie genau, was passiert ist.',
  'auth.aside.point.receipts':
    'Für jede Veröffentlichung gibt es eine Quittung: Wer hat sie genehmigt, wann hat sie versendet, was hat die Plattform zurückgegeben?',
  'auth.aside.point.approvals':
    'Nichts erreicht eine Plattform ohne die Genehmigung, die Ihre Richtlinie erfordert.',
  'auth.aside.point.surfaces':
    'Derselbe Workflow von der Web-App, der REST-API, MCP, der CLI und Webhooks.',
  'auth.provider.title': 'Bevor Sie fortfahren',
  'auth.provider.google.access':
    'Google gibt Ihren Namen, Ihre E-Mail-Adresse und Ihr Profilbild an Post Array weiter. Post Array kann Ihr Gmail, Laufwerk oder Kalender nicht lesen.',
  'auth.provider.facebook.access':
    'Facebook teilt Ihren Namen, Ihre E-Mail-Adresse und Ihr Profilbild mit Post Array. Das Verbinden einer Seite zum Veröffentlichen ist ein separater Schritt, den Sie später genehmigen.',
  'auth.provider.note':
    'Dadurch werden Sie angemeldet. Es wird kein Konto zum Veröffentlichen verknüpft.',
  'auth.continueWithEmail': 'Weiter mit E-Mail',
  'auth.method.password': 'Passwort',
  'auth.method.magicLink': 'E-Mail-Link',
  'auth.method.username': 'Benutzername',
  'auth.method.chooseLabel': 'Wie möchten Sie sich anmelden?',
  'auth.username.placeholder': 'Ihr-Benutzername',
  'auth.username.aliasNote':
    'Ein Benutzername ist ein Alias für die E-Mail-Adresse Ihres Kontos. Das Passwort ist dasselbe.',
  'auth.password.placeholder': 'Ihr Passwort',
  'auth.submit.signIn': 'Melden Sie sich an',
  'auth.submit.signUp': 'Konto erstellen',
  'auth.submit.working': 'Überprüfen',
  'auth.failure.credentials':
    'Diese E-Mail-Adresse und dieses Passwort stimmen nicht mit einem Konto überein. Überprüfen Sie beides und versuchen Sie es erneut.',
  'auth.failure.usernameCredentials':
    'Dieser Benutzername und dieses Passwort stimmen nicht mit einem Konto überein. Überprüfen Sie beides und versuchen Sie es erneut.',
  'auth.failure.noAccountLeak':
    'Zu Ihrer Sicherheit sagen wir nicht, ob eine Adresse registriert ist.',
  'auth.failure.provider':
    'Die Anmeldung mit {provider} wurde nicht abgeschlossen. Es wurde nichts geändert.',
  'auth.failure.network':
    'Wir konnten Post Array nicht erreichen. Überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
  'auth.signUp.emailInUseNote':
    'Wenn für diese Adresse bereits ein Konto vorhanden ist, senden wir einen Anmeldelink per E-Mail, anstatt einen zweiten zu erstellen.',
  'auth.legal.readTerms': 'Lesen Sie die Bedingungen',
  'auth.legal.readPrivacy': 'Lesen Sie die Datenschutzerklärung',
  'auth.switchToSignUp': 'Erstellen Sie ein Konto',
  'auth.switchToSignIn': 'Melden Sie sich stattdessen an',
  'auth.checkEmail.body':
    'Wir haben einen Anmeldelink an {email} gesendet. Es funktioniert einmal.',
  'auth.checkEmail.wrongAddress': 'Verwenden Sie eine andere Adresse',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Abrechnung',
  'onboarding.stepName.workspace': 'Arbeitsbereich',
  'onboarding.stepName.role': 'Anwendungsfall',
  'onboarding.stepName.connect': 'Verbinden',
  'onboarding.stepName.compose': 'Erster Beitrag',
  'onboarding.stepName.receipt': 'Bestätigung',
  'onboarding.stepList': 'Einrichtungsschritte',
  'onboarding.stepComplete': 'Fertig',
  'onboarding.stepCurrent': 'Aktueller Schritt',
  'onboarding.exit': 'Später beenden',
  'onboarding.plan.intervalMonthlyLabel': '29 $ pro Monat',
  'onboarding.plan.intervalAnnualLabel': '300 $ pro Jahr',
  'onboarding.plan.checkoutHint':
    'Der nächste Bildschirm ist Polar, unser eingetragener Händler. Der Zugriff wird gewährt, wenn Polar das Abonnement bestätigt, nicht, wenn der Browser zurückkommt.',
  'onboarding.plan.factsTitle': 'Was passiert, wenn Sie fortfahren?',
  'onboarding.workspace.help':
    'Ein Arbeitsbereich enthält Ihre Projekte, verbundene Konten, Entwürfe und Quittungen. Sie können später weitere erstellen.',
  'onboarding.workspace.localeNote':
    'Die Sprache Ihrer Benutzeroberfläche ändert diese App. Die Inhaltssprachen werden pro Beitrag ausgewählt und sind von dieser Einstellung unabhängig.',
  'onboarding.workspace.timeZoneDetected': 'Von diesem Gerät erkannt: {timeZone}',
  'onboarding.connect.permissionsTitle': 'Wonach {provider} gefragt wird',
  'onboarding.connect.permissionsFooter':
    'Post Array fragt niemals nach einer Erlaubnis, die es nicht nutzt, und Sie können die Verbindung jederzeit trennen.',
  'onboarding.connect.chooseProvider': 'Wählen Sie eine Plattform',
  'onboarding.connect.opensProvider':
    'Wenn Sie fortfahren, wird {provider} in dieser Registerkarte geöffnet.',
  'onboarding.compose.help':
    'Schreiben Sie den Beitrag und überprüfen Sie dann die Vorschau und die Validierung, bevor Sie einen Zeitpunkt auswählen.',
  'onboarding.compose.openComposer': 'Öffnen Sie den vollständigen Composer',
  'onboarding.receipt.title': 'Ihr erster Beitrag ist geplant',
  'onboarding.receipt.body':
    'Hier ist der bisherige Rekord. Es wird durch den Versand, die Antwort des Anbieters und die erste Analysesynchronisierung ständig aktualisiert.',
  'onboarding.receipt.goHome': 'Gehen Sie zu Startseite',
  'onboarding.blocked.title': 'Dieser Schritt erfordert den vorherigen',
  'onboarding.blocked.body':
    'Beenden Sie zuerst {step}. Nichts, was Sie eingegeben haben, geht verloren.',
} as const;
