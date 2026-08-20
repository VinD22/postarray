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
  'shell.appName': 'Relay',
  'shell.documentTitle': '{page} · Relay',
  'shell.tagline': 'Een publicatiebureau voor mensen en agenten.',
  'shell.menu.open': 'Open het menu',
  'shell.menu.title': 'Menukaart',
  'shell.nav.more': 'Meer',
  'shell.help.title': 'Hulp',
  'shell.help.documentation': 'Documentatie',
  'shell.help.keyboardShortcuts': 'Sneltoetsen',
  'shell.help.platformStatus': 'Platformstatus',
  'shell.help.whatChanged': 'Wat is er veranderd',
  'shell.help.contactSupport': 'Neem contact op met ondersteuning',
  'shell.account.settings': 'Instellingen',
  'shell.account.profile': 'Jouw profiel',
  'shell.workspace.create': 'Creëer een werkruimte',
  'shell.workspace.manage': 'Workspace-instellingen',
  'shell.workspace.role': 'Je bent hier {role}',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Demogegevens',
  'shell.demo.title': 'U bekijkt demogegevens',
  'shell.demo.body':
    'De Relay API is niet bereikbaar vanuit deze browser, dus de schermen zijn gevuld met een geplaatste voorbeeldwerkruimte. Niets hier is verbonden met een echt account en niets kan publiceren.',
  'shell.demo.howToConnect':
    'Stel NEXT_PUBLIC_RELAY_API_URL in en start de app opnieuw om live gegevens te gebruiken.',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Je bent offline',
  'shell.offline.body':
    'Concepten worden op dit apparaat bewaard. CV plannen en publiceren wanneer de verbinding terugkeert.',
  'shell.offline.retry': 'Controleer de verbinding',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Open het opdrachtpalet',
  'palette.title': 'Commandopalet',
  'palette.description': 'Zoek naar een scherm, een account of een actie.',
  'palette.placeholder': 'Typ een opdracht of een schermnaam',
  'palette.empty': 'Niets komt overeen met {query}.',
  'palette.group.actions': 'Acties',
  'palette.group.goTo': 'Ga naar',
  'palette.group.workspaces': "Workspace's",
  'palette.group.settings': 'Instellingen',
  'palette.hint.navigate': 'Beweeg met de pijltjestoetsen',
  'palette.hint.select': 'Openen met Enter',
  'palette.hint.close': 'Sluit af met Escape',
  'palette.action.compose': 'Stel een bericht samen',
  'palette.action.connectAccount': 'Koppel een account',
  'palette.action.openActionCenter': 'Open het Actiecentrum',
  'palette.action.uploadMedia': 'Media uploaden',
  'palette.action.createRule': 'Maak een automatiseringsregel',
  'palette.action.toggleTheme': 'Wissel van thema',
  'palette.action.signOut': 'Meld u af',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Open het Actiecentrum',
  'actionCenter.group.now.label': 'Nu',
  'actionCenter.group.soon.label': 'Binnenkort',
  'actionCenter.group.watching.label': 'Kijken',
  'actionCenter.group.now.hint': 'Totdat deze zijn afgehandeld, loopt de publicatie gevaar.',
  'actionCenter.group.soon.hint': 'Deze hebben een deadline waar je nog aan kunt voldoen.',
  'actionCenter.group.watching.hint':
    'Niet urgent. Het is de moeite waard om deze week te bekijken.',
  'actionCenter.severity.now': 'Ik heb je nu nodig',
  'actionCenter.severity.soon': 'Ik heb je snel nodig',
  'actionCenter.severity.watching': 'Kijken',
  'actionCenter.filter.all': 'Allemaal',
  'actionCenter.filter.connections': 'Verbindingen',
  'actionCenter.filter.publishing': 'Publiceren',
  'actionCenter.filter.automation': 'Automatisering',
  'actionCenter.filter.billing': 'Facturering',
  'actionCenter.snoozed': 'Gesnoozed',
  'actionCenter.snoozeOneDay': 'Een dagje snoozen',
  'actionCenter.snoozedUntil': 'Gesnoozed tot {date}',
  'actionCenter.unsnooze': 'Breng dit terug',
  'actionCenter.resolved': '{relativeTime} opgelost',
  'actionCenter.emptyFiltered': 'Niets in deze groep heeft aandacht nodig.',
  'actionCenter.errorTitle': 'Het actiecentrum kan niet worden geladen',
  'actionCenter.loading': 'Laden wat aandacht nodig heeft',
  'actionCenter.affectedAccount': 'Heeft invloed op {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Niets heeft aandacht nodig} one {# item} other {# items}}',
  'actionCenter.action.reconnect': 'Maak opnieuw verbinding',
  'actionCenter.action.openReceipt': 'Open de bon',
  'actionCenter.action.review': 'Beoordeling',
  'actionCenter.action.openDraft': 'Open het concept',
  'actionCenter.action.openCalendar': 'Open de kalender',
  'actionCenter.action.viewStatus': 'Bekijk de status',
  'actionCenter.action.checkFeed': 'Controleer de feed',
  'actionCenter.action.inspectDeliveries': 'Leveringen controleren',
  'actionCenter.action.addBalance': 'Gebruik bekijken',
  'actionCenter.action.fixConnection': 'Bevestig de verbinding',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Thuis',
  'home.subtitle': 'Wat heeft je vandaag nodig en wat gaat er daarna gebeuren.',
  'home.greetingSummary':
    '{actions, plural, =0 {Niets heeft je nu nodig} one {# item heeft je nodig} other {# items hebben je nodig}}. {upcoming, plural, =0 {Er is niets gepland in de komende 24 uur} one {# bericht wordt verzonden in de komende 24 uur} other {# berichten worden verzonden in de komende 24 uur}}.',
  'home.needsYou.title': 'Ik heb je nu nodig',
  'home.needsYou.empty': 'Niets heeft jou nu nodig.',
  'home.needsYou.emptyQuiet':
    'Geniet van de rust. Alles wat een beslissing nodig heeft, verschijnt hier zodra dat gebeurt.',
  'home.needsYou.emptyBody':
    'Verbindingsstatus, goedkeuringen en mislukte publicaties verschijnen hier zodra ze plaatsvinden.',
  'home.needsYou.viewAll': 'Open het Actiecentrum',
  'home.upcoming.title': 'Volgende 24 uur',
  'home.upcoming.empty': 'Er staat niets gepland de komende 24 uur.',
  'home.upcoming.emptyBody':
    'Schrijf een bericht en kies een tijdstip. Je kunt het later wijzigen.',
  'home.upcoming.viewAll': 'Open de kalender',
  'home.upcoming.timeZoneNote': 'Tijden worden weergegeven in {timeZone}, de werkruimtezone.',
  'home.upcoming.columnTime': 'Tijd',
  'home.upcoming.columnAccount': 'Rekening',
  'home.upcoming.columnContent': 'Inhoud',
  'home.upcoming.columnStatus': 'Status',
  'home.receipts.title': 'Recente ontvangstbewijzen',
  'home.receipts.empty': 'Er zijn nog geen berichten vanuit deze werkruimte gepubliceerd.',
  'home.receipts.emptyBody':
    'Bij elke publicatie hoort een ontvangstbewijs dat u kunt inzien en delen.',
  'home.receipts.viewAll': 'Alle bonnen',
  'home.receipts.publishedTo': 'Gepubliceerd op {account}',
  'home.connections.title': 'Verbindingsstatus',
  'home.connections.summary':
    '{healthy, plural, one {# account werkt} other {# accounts werken}}. {attention, plural, =0 {Geen aandacht nodig} one {# heeft aandacht nodig} other {# heeft aandacht nodig}}.',
  'home.connections.viewAll': 'Alle aansluitingen',
  'home.connections.empty': 'Nog geen accounts gekoppeld.',
  'home.advisor.title': 'Adviseur groei',
  'home.advisor.summary':
    'Planversie {version} werd goedgekeurd {date}. Week {week} van {total} heeft {briefs, plural, one {# briefing nog niet opgesteld} other {# briefing nog niet opgesteld}}.',
  'home.advisor.noPlan':
    'De adviseur bouwt een plan op op basis van door u bevestigde feiten. Het stelt werk voor en publiceert nooit op zichzelf.',
  'home.advisor.openPlan': 'Open de planning',
  'home.advisor.createDrafts': 'Concepten maken van week {week}',
  'home.advisor.start': 'Start het bedrijfsprofiel',
  'home.trial.banner':
    'Proefperiode, {days, plural, =0 {eindigt vandaag} one {# dag resterend} other {# dagen resterend}}. Converteert {date} naar {amount}.',
  'home.trial.manage': 'Beheer of annuleer',
  'home.error.title': 'Thuis kon niet laden',
  'home.error.body':
    'Uw werkruimte is intact. Dit is een probleem bij het bereiken van de Relay API.',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title': "Publiceer via officiële API's en zie precies wat er is gebeurd.",
  'auth.aside.point.receipts':
    'Elke publicatie levert een ontvangstbewijs op: wie heeft de publicatie goedgekeurd, wanneer deze is verzonden, wat het platform heeft geretourneerd.',
  'auth.aside.point.approvals':
    'Niets bereikt een platform zonder de goedkeuring die uw beleid vereist.',
  'auth.aside.point.surfaces':
    'Dezelfde workflow vanuit de webapp, de REST API, MCP, de CLI en webhooks.',
  'auth.provider.title': 'Voordat u verdergaat',
  'auth.provider.google.access':
    'Google deelt uw naam, e-mailadres en profielfoto met Relay. Relay kan uw Gmail, Drive of Agenda niet lezen.',
  'auth.provider.facebook.access':
    'Facebook deelt uw naam, e-mailadres en profielfoto met Relay. Het verbinden van een pagina om op te publiceren is een aparte stap die u later goedkeurt.',
  'auth.provider.note':
    'Hiermee wordt u aangemeld. Er wordt geen account gekoppeld om naar te publiceren.',
  'auth.continueWithEmail': 'Ga verder met e-mail',
  'auth.method.password': 'Wachtwoord',
  'auth.method.magicLink': 'E-maillink',
  'auth.method.username': 'Gebruikersnaam',
  'auth.method.chooseLabel': 'Hoe wil je inloggen?',
  'auth.username.placeholder': 'jouw-gebruikersnaam',
  'auth.username.aliasNote':
    'Een gebruikersnaam is een alias voor het e-mailadres in uw account. Het wachtwoord is hetzelfde.',
  'auth.password.placeholder': 'Uw wachtwoord',
  'auth.submit.signIn': 'Log in',
  'auth.submit.signUp': 'Account aanmaken',
  'auth.submit.working': 'Controleren',
  'auth.failure.credentials':
    'Dat e-mailadres en wachtwoord komen niet overeen met een account. Controleer beide en probeer het opnieuw.',
  'auth.failure.usernameCredentials':
    'Die gebruikersnaam en wachtwoord komen niet overeen met een account. Controleer beide en probeer het opnieuw.',
  'auth.failure.noAccountLeak':
    'Voor uw veiligheid vermelden wij niet of een adres geregistreerd is.',
  'auth.failure.provider':
    'Het aanmelden met {provider} is niet voltooid. Er werd niets veranderd.',
  'auth.failure.network':
    'We konden Relay niet bereiken. Controleer uw verbinding en probeer het opnieuw.',
  'auth.signUp.trialNote':
    'Zeven volledige proefdagen. Er is een betaalmethode vereist. Vandaag $ 0 verschuldigd.',
  'auth.signUp.emailInUseNote':
    'Als dit adres al een account heeft, e-mailen we een inloglink in plaats van een tweede aan te maken.',
  'auth.legal.readTerms': 'Lees de voorwaarden',
  'auth.legal.readPrivacy': 'Lees de Privacyverklaring',
  'auth.switchToSignUp': 'Maak een account aan',
  'auth.switchToSignIn': 'Meld u in plaats daarvan aan',
  'auth.checkEmail.body':
    'We hebben een aanmeldingslink naar {email} gestuurd. Het werkt een keer.',
  'auth.checkEmail.wrongAddress': 'Gebruik een ander adres',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Facturering',
  'onboarding.stepName.workspace': 'Workspace',
  'onboarding.stepName.role': 'Gebruiksgeval',
  'onboarding.stepName.connect': 'Verbinden',
  'onboarding.stepName.compose': 'Eerste bericht',
  'onboarding.stepName.receipt': 'Bevestiging',
  'onboarding.stepList': 'Installatiestappen',
  'onboarding.stepComplete': 'Klaar',
  'onboarding.stepCurrent': 'Huidige stap',
  'onboarding.exit': 'Eindig later',
  'onboarding.plan.intervalMonthlyLabel': '$ 29 per maand',
  'onboarding.plan.intervalAnnualLabel': '$300 per jaar',
  'onboarding.plan.checkoutHint':
    'Het volgende scherm is Polar, onze bekende handelaar. Toegang wordt verleend wanneer Polar het abonnement bevestigt, niet wanneer de browser terugkomt.',
  'onboarding.plan.factsTitle': 'Wat gebeurt er als je doorgaat',
  'onboarding.workspace.help':
    'Een werkruimte bevat uw merken, gekoppelde accounts, concepten en bonnen. Je kunt er later meer maken.',
  'onboarding.workspace.localeNote':
    'Uw interfacetaal verandert deze app. Inhoudstalen worden per bericht gekozen en staan ​​los van deze instelling.',
  'onboarding.workspace.timeZoneDetected': 'Gedetecteerd door dit apparaat: {timeZone}',
  'onboarding.connect.permissionsTitle': 'Waar {provider} om zal worden gevraagd',
  'onboarding.connect.permissionsFooter':
    'Relay vraagt nooit om toestemming die het niet gebruikt, en u kunt op elk moment de verbinding verbreken.',
  'onboarding.connect.chooseProvider': 'Kies een platform',
  'onboarding.connect.opensProvider': 'Als u doorgaat, wordt {provider} op dit tabblad geopend.',
  'onboarding.compose.help':
    'Schrijf het bericht en controleer vervolgens het voorbeeld en de validatie voordat u een tijdstip kiest.',
  'onboarding.compose.openComposer': 'Open de volledige componist',
  'onboarding.receipt.title': 'Je eerste bericht staat gepland',
  'onboarding.receipt.body':
    'Hier is het record tot nu toe. Het wordt voortdurend bijgewerkt via verzending, de reactie van de provider en de eerste analysesynchronisatie.',
  'onboarding.receipt.goHome': 'Ga naar Thuis',
  'onboarding.blocked.title': 'Deze stap heeft de vorige nodig',
  'onboarding.blocked.body': 'Voltooi eerst {step}. Niets dat u hebt ingevoerd, gaat verloren.',
} as const;
