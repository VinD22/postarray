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
  'shell.appName': 'Relä',
  'shell.documentTitle': '{page} · Relä',
  'shell.tagline': 'En förlagsdisk för människor och agenter.',
  'shell.menu.open': 'Öppna menyn',
  'shell.menu.title': 'Meny',
  'shell.nav.more': 'Mer',
  'shell.help.title': 'Hjälp',
  'shell.help.documentation': 'Dokumentation',
  'shell.help.keyboardShortcuts': 'Kortkommandon',
  'shell.help.platformStatus': 'Plattformsstatus',
  'shell.help.whatChanged': 'Vad förändrades',
  'shell.help.contactSupport': 'Kontakta supporten',
  'shell.account.settings': 'Inställningar',
  'shell.account.profile': 'Din profil',
  'shell.workspace.create': 'Skapa en arbetsyta',
  'shell.workspace.manage': 'Inställningar för arbetsyta',
  'shell.workspace.role': 'Du är {role} här',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Demodata',
  'shell.demo.title': 'Du tittar på demodata',
  'shell.demo.body':
    'Relay API kan inte nås från den här webbläsaren, så skärmarna är fyllda med en seedad arbetsyta. Inget här är kopplat till ett riktigt konto och ingenting kan publiceras.',
  'shell.demo.howToConnect':
    'Ställ in NEXT_PUBLIC_RELAY_API_URL och starta om appen för att använda livedata.',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Du är offline',
  'shell.offline.body':
    'Utkast sparas på den här enheten. Schemaläggning och publicering återupptas när anslutningen återkommer.',
  'shell.offline.retry': 'Kontrollera anslutningen',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Öppna kommandopaletten',
  'palette.title': 'Kommandopalett',
  'palette.description': 'Sök efter en skärm, ett konto eller en åtgärd.',
  'palette.placeholder': 'Skriv ett kommando eller ett skärmnamn',
  'palette.empty': 'Inget matchar {query}.',
  'palette.group.actions': 'Åtgärder',
  'palette.group.goTo': 'Gå till',
  'palette.group.workspaces': 'Arbetsytor',
  'palette.group.settings': 'Inställningar',
  'palette.hint.navigate': 'Flytta med piltangenterna',
  'palette.hint.select': 'Öppna med Enter',
  'palette.hint.close': 'Stäng med Escape',
  'palette.action.compose': 'Skriv ett inlägg',
  'palette.action.connectAccount': 'Anslut ett konto',
  'palette.action.openActionCenter': 'Öppna Action Center',
  'palette.action.uploadMedia': 'Ladda upp media',
  'palette.action.createRule': 'Skapa en automatiseringsregel',
  'palette.action.toggleTheme': 'Byt tema',
  'palette.action.signOut': 'Logga ut',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Öppna Action Center',
  'actionCenter.group.now.label': 'Nu',
  'actionCenter.group.soon.label': 'Snart',
  'actionCenter.group.watching.label': 'Tittar på',
  'actionCenter.group.now.hint': 'Publicering är i riskzonen tills dessa hanteras.',
  'actionCenter.group.soon.hint': 'Dessa har en deadline du fortfarande kan hålla.',
  'actionCenter.group.watching.hint': 'Inte akut. Värt att titta på denna vecka.',
  'actionCenter.severity.now': 'Behöver dig nu',
  'actionCenter.severity.soon': 'Behöver dig snart',
  'actionCenter.severity.watching': 'Tittar på',
  'actionCenter.filter.all': 'Alla',
  'actionCenter.filter.connections': 'Anslutningar',
  'actionCenter.filter.publishing': 'Publicering',
  'actionCenter.filter.automation': 'Automation',
  'actionCenter.filter.billing': 'Billing',
  'actionCenter.snoozed': 'Snoozed',
  'actionCenter.snoozeOneDay': 'Snooza en dag',
  'actionCenter.snoozedUntil': 'Snoozad till {date}',
  'actionCenter.unsnooze': 'Ta tillbaka det här',
  'actionCenter.resolved': 'Löst {relativeTime}',
  'actionCenter.emptyFiltered': 'Ingenting i den här gruppen behöver uppmärksamhet.',
  'actionCenter.errorTitle': 'Åtgärdscentret kunde inte laddas',
  'actionCenter.loading': 'Laddar det som behöver uppmärksamhet',
  'actionCenter.affectedAccount': 'Påverkar {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Ingenting behöver uppmärksamhet} one {# objekt} other {# objekt}}',
  'actionCenter.action.reconnect': 'Återanslut',
  'actionCenter.action.openReceipt': 'Öppna kvittot',
  'actionCenter.action.review': 'Granska',
  'actionCenter.action.openDraft': 'Öppna utkastet',
  'actionCenter.action.openCalendar': 'Öppna kalendern',
  'actionCenter.action.viewStatus': 'Visa status',
  'actionCenter.action.checkFeed': 'Kontrollera fodret',
  'actionCenter.action.inspectDeliveries': 'Inspektera leveranser',
  'actionCenter.action.addBalance': 'Granska användningen',
  'actionCenter.action.fixConnection': 'Fixa anslutningen',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Hem',
  'home.subtitle': 'Vad behöver dig idag och vad som går ut härnäst.',
  'home.greetingSummary':
    '{actions, plural, =0 {Inget behöver dig just nu} one {# objekt behöver dig} other {# objekt behöver dig}}. {upcoming, plural, =0 {Ingenting är schemalagt under de kommande 24 timmarna} one {# inlägg slocknar under de kommande 24 timmarna} other {# inlägg slocknar under de kommande 24 timmarna}}.',
  'home.needsYou.title': 'Behöver dig nu',
  'home.needsYou.empty': 'Inget behöver dig just nu.',
  'home.needsYou.emptyBody':
    'Anslutningshälsa, godkännanden och misslyckade publiceringar visas här när de inträffar.',
  'home.needsYou.viewAll': 'Öppna Action Center',
  'home.needsYou.emptyQuiet':
    'Njut av tystnaden. Allt som behöver ett beslut dyker upp här i det ögonblick det gör det.',
  'home.upcoming.title': 'Nästa 24 timmar',
  'home.upcoming.empty': 'Inget är schemalagt under de närmaste 24 timmarna.',
  'home.upcoming.emptyBody': 'Skriv ett inlägg och välj en tid. Du kan ändra det senare.',
  'home.upcoming.viewAll': 'Öppna kalendern',
  'home.upcoming.timeZoneNote': 'Tiderna visas i {timeZone}, arbetsytan.',
  'home.upcoming.columnTime': 'Tid',
  'home.upcoming.columnAccount': 'konto',
  'home.upcoming.columnContent': 'Innehåll',
  'home.upcoming.columnStatus': 'Status',
  'home.receipts.title': 'Senaste kvitton',
  'home.receipts.empty': 'Inga inlägg har publicerats från denna arbetsyta än.',
  'home.receipts.emptyBody':
    'Varje publikation producerar ett kvitto som du kan inspektera och dela.',
  'home.receipts.viewAll': 'Alla kvitton',
  'home.receipts.publishedTo': 'Publicerad till {account}',
  'home.connections.title': 'Anslutningshälsa',
  'home.connections.summary':
    '{healthy, plural, one {# konto fungerar} other {# konton fungerar}}. {attention, plural, =0 {Ingen behöver uppmärksamhet} one {# behöver uppmärksamhet} other {# behöver uppmärksamhet}}.',
  'home.connections.viewAll': 'Alla anslutningar',
  'home.connections.empty': 'Inga konton anslutna än.',
  'home.advisor.title': 'Tillväxtrådgivare',
  'home.advisor.summary':
    'Planversion {version} godkändes {date}. Vecka {week} av {total} har {briefs, plural, one {# brief ännu inte utkast} other {# brief ännu inte utkast}}.',
  'home.advisor.noPlan':
    'Rådgivaren bygger en plan utifrån fakta som du bekräftar. Den föreslår arbete och publicerar aldrig på egen hand.',
  'home.advisor.openPlan': 'Öppna planen',
  'home.advisor.createDrafts': 'Skapa utkast från vecka {week}',
  'home.advisor.start': 'Starta företagsprofilen',
  'home.trial.banner':
    'Trial, {days, plural, =0 {ends today} one {# day left} other {# days left}}. Converts {date} to {amount}.',
  'home.trial.manage': 'Manage or cancel',
  'home.error.title': 'Hemmet kunde inte laddas',
  'home.error.body': 'Din arbetsyta är intakt. Det här är ett problem med att nå Relay API.',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title': 'Publicera via officiella API:er och se exakt vad som hände.',
  'auth.aside.point.receipts':
    'Varje publikation ger ett kvitto: vem godkände den, när den skickades, vad plattformen returnerade.',
  'auth.aside.point.approvals':
    'Ingenting når en plattform utan det godkännande som din policy kräver.',
  'auth.aside.point.surfaces': 'Samma arbetsflöde från webbappen, REST API, MCP, CLI och webhooks.',
  'auth.provider.title': 'Innan du fortsätter',
  'auth.provider.google.access':
    'Google delar ditt namn, din e-postadress och din profilbild med Relay. Relay kan inte läsa din Gmail, Drive eller Kalender.',
  'auth.provider.facebook.access':
    'Facebook delar ditt namn, din e-postadress och din profilbild med Relay. Att ansluta en sida att publicera till är ett separat steg som du godkänner senare.',
  'auth.provider.note': 'Detta loggar in dig. Det kopplar inte ett konto att publicera till.',
  'auth.continueWithEmail': 'Fortsätt med e-post',
  'auth.method.password': 'Lösenord',
  'auth.method.magicLink': 'E-postlänk',
  'auth.method.username': 'Användarnamn',
  'auth.method.chooseLabel': 'Hur vill du logga in?',
  'auth.username.placeholder': 'ditt-användarnamn',
  'auth.username.aliasNote':
    'Ett användarnamn är ett alias för e-postadressen på ditt konto. Lösenordet är detsamma.',
  'auth.password.placeholder': 'Ditt lösenord',
  'auth.submit.signIn': 'Logga in',
  'auth.submit.signUp': 'Skapa konto',
  'auth.submit.working': 'Kontrollerar',
  'auth.failure.credentials':
    'Den e-postadressen och lösenordet matchar inte ett konto. Kontrollera båda och försök igen.',
  'auth.failure.usernameCredentials':
    'Det användarnamnet och lösenordet stämmer inte överens med ett konto. Kontrollera båda och försök igen.',
  'auth.failure.noAccountLeak': 'För din säkerhet säger vi inte om en adress är registrerad.',
  'auth.failure.provider': 'Inloggningen med {provider} slutfördes inte. Ingenting ändrades.',
  'auth.failure.network': 'Vi kunde inte nå relä. Kontrollera din anslutning och försök igen.',
  'auth.signUp.trialNote': 'Sju hela provdagar. En betalningsmetod krävs. $0 förfaller idag.',
  'auth.signUp.emailInUseNote':
    'Om den här adressen redan har ett konto skickar vi en inloggningslänk via e-post istället för att skapa en andra.',
  'auth.legal.readTerms': 'Läs Villkoren',
  'auth.legal.readPrivacy': 'Läs integritetsmeddelandet',
  'auth.switchToSignUp': 'Skapa ett konto',
  'auth.switchToSignIn': 'Logga in istället',
  'auth.checkEmail.body': 'Vi skickade en inloggningslänk till {email}. Det fungerar en gång.',
  'auth.checkEmail.wrongAddress': 'Använd en annan adress',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Fakturering',
  'onboarding.stepName.workspace': 'Arbetsyta',
  'onboarding.stepName.role': 'Användningsfall',
  'onboarding.stepName.connect': 'Anslut',
  'onboarding.stepName.compose': 'Första inlägget',
  'onboarding.stepName.receipt': 'Bekräftelse',
  'onboarding.stepList': 'Inställningssteg',
  'onboarding.stepComplete': 'Klart',
  'onboarding.stepCurrent': 'Aktuellt steg',
  'onboarding.exit': 'Avsluta senare',
  'onboarding.plan.intervalMonthlyLabel': '$29 per månad',
  'onboarding.plan.intervalAnnualLabel': '$300 per år',
  'onboarding.plan.checkoutHint':
    'Nästa skärm är Polar, vår rekordhandlare. Åtkomst ges när Polar bekräftar prenumerationen, inte när webbläsaren kommer tillbaka.',
  'onboarding.plan.factsTitle': 'Vad händer när du fortsätter',
  'onboarding.workspace.help':
    'En arbetsyta innehåller dina varumärken, anslutna konton, utkast och kvitton. Du kan skapa fler senare.',
  'onboarding.workspace.localeNote':
    'Ditt gränssnittsspråk ändrar den här appen. Innehållsspråk väljs per inlägg och är separata från den här inställningen.',
  'onboarding.workspace.timeZoneDetected': 'Upptäckt från den här enheten: {timeZone}',
  'onboarding.connect.permissionsTitle': 'Vad {provider} kommer att efterfrågas',
  'onboarding.connect.permissionsFooter':
    'Relay ber aldrig om ett tillstånd som det inte använder, och du kan koppla från när som helst.',
  'onboarding.connect.chooseProvider': 'Välj en plattform',
  'onboarding.connect.opensProvider': 'Om du fortsätter öppnar {provider} på den här fliken.',
  'onboarding.compose.help':
    'Skriv inlägget och kontrollera sedan förhandsgranskningen och valideringen innan du väljer en tid.',
  'onboarding.compose.openComposer': 'Öppna hela kompositören',
  'onboarding.receipt.title': 'Ditt första inlägg är schemalagt',
  'onboarding.receipt.body':
    'Här är rekordet så här långt. Det fortsätter att uppdateras genom utskick, leverantörens svar och den första analyssynkroniseringen.',
  'onboarding.receipt.goHome': 'Gå till Hem',
  'onboarding.blocked.title': 'Detta steg behöver det föregående',
  'onboarding.blocked.body': 'Avsluta {step} först. Inget du angett är förlorat.',
} as const;
