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
  'shell.appName': 'Relé',
  'shell.documentTitle': '{page} · Relé',
  'shell.tagline': 'Publikační pult pro lidi a agenty.',
  'shell.menu.open': 'Otevřete nabídku',
  'shell.menu.title': 'Nabídka',
  'shell.nav.more': 'Více',
  'shell.help.title': 'Nápověda',
  'shell.help.documentation': 'Dokumentace',
  'shell.help.keyboardShortcuts': 'Klávesové zkratky',
  'shell.help.platformStatus': 'Stav platformy',
  'shell.help.whatChanged': 'Co se změnilo',
  'shell.help.contactSupport': 'Kontaktujte podporu',
  'shell.account.settings': 'Nastavení',
  'shell.account.profile': 'Váš profil',
  'shell.workspace.create': 'Vytvořit pracovní prostor',
  'shell.workspace.manage': 'Nastavení pracovního prostoru',
  'shell.workspace.role': 'Jste {role} zde',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Ukázková data',
  'shell.demo.title': 'Prohlížíte si ukázková data',
  'shell.demo.body':
    'Rozhraní Relay API není z tohoto prohlížeče dostupné, takže obrazovky jsou vyplněny nasazeným příkladem pracovního prostoru. Nic zde není spojeno se skutečným účtem a nic nelze publikovat.',
  'shell.demo.howToConnect':
    'Nastavte NEXT_PUBLIC_RELAY_API_URL a restartujte aplikaci, abyste mohli používat živá data.',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Jste offline',
  'shell.offline.body':
    'Na tomto zařízení jsou uchovávány koncepty. Plánování a publikování se obnoví, když se připojení vrátí.',
  'shell.offline.retry': 'Zkontrolujte připojení',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Otevřete paletu příkazů',
  'palette.title': 'Paleta příkazů',
  'palette.description': 'Vyhledejte obrazovku, účet nebo akci.',
  'palette.placeholder': 'Zadejte příkaz nebo název obrazovky',
  'palette.empty': 'Nic neodpovídá {query}.',
  'palette.group.actions': 'Akce',
  'palette.group.goTo': 'Přejít na',
  'palette.group.workspaces': 'Pracovní prostory',
  'palette.group.settings': 'Nastavení',
  'palette.hint.navigate': 'Pohybujte pomocí kláves se šipkami',
  'palette.hint.select': 'Otevřít pomocí Enter',
  'palette.hint.close': 'Zavřít pomocí Escape',
  'palette.action.compose': 'Napsat příspěvek',
  'palette.action.connectAccount': 'Připojit účet',
  'palette.action.openActionCenter': 'Otevřít centrum akcí',
  'palette.action.uploadMedia': 'Nahrát média',
  'palette.action.createRule': 'Vytvořte pravidlo automatizace',
  'palette.action.toggleTheme': 'Přepnout motiv',
  'palette.action.signOut': 'Odhlásit se',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Otevřít centrum akcí',
  'actionCenter.group.now.label': 'Nyní',
  'actionCenter.group.soon.label': 'Brzy',
  'actionCenter.group.watching.label': 'Sledování',
  'actionCenter.group.now.hint': 'Zveřejnění je ohroženo, dokud se s tím nevyřídí.',
  'actionCenter.group.soon.hint': 'Tyto mají termín, který ještě můžete dodržet.',
  'actionCenter.group.watching.hint': 'Není naléhavé. Tento týden stojí za to se podívat.',
  'actionCenter.severity.now': 'Potřebuje vás hned',
  'actionCenter.severity.soon': 'Brzy vás potřebuje',
  'actionCenter.severity.watching': 'Sledování',
  'actionCenter.filter.all': 'Vše',
  'actionCenter.filter.connections': 'Připojení',
  'actionCenter.filter.publishing': 'Publikování',
  'actionCenter.filter.automation': 'Automatizace',
  'actionCenter.filter.billing': 'Fakturace',
  'actionCenter.snoozed': 'Odloženo',
  'actionCenter.snoozeOneDay': 'Odložit o den',
  'actionCenter.snoozedUntil': 'Odloženo do {date}',
  'actionCenter.unsnooze': 'Vraťte to zpět',
  'actionCenter.resolved': 'Vyřešeno {relativeTime}',
  'actionCenter.emptyFiltered': 'Nic v této skupině nevyžaduje pozornost.',
  'actionCenter.errorTitle': 'Centrum akcí se nepodařilo načíst',
  'actionCenter.loading': 'Načítání toho, co vyžaduje pozornost',
  'actionCenter.affectedAccount': 'Ovlivňuje {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Nic nevyžaduje pozornost} one {# položka} other {# položky} few {# položky} many {# položky}}',
  'actionCenter.action.reconnect': 'Znovu připojit',
  'actionCenter.action.openReceipt': 'Otevřete účtenku',
  'actionCenter.action.review': 'Recenze',
  'actionCenter.action.openDraft': 'Otevřít koncept',
  'actionCenter.action.openCalendar': 'Otevřít kalendář',
  'actionCenter.action.viewStatus': 'Zobrazit stav',
  'actionCenter.action.checkFeed': 'Zkontrolujte zdroj',
  'actionCenter.action.inspectDeliveries': 'Kontrola dodávek',
  'actionCenter.action.addBalance': 'Zkontrolujte použití',
  'actionCenter.action.fixConnection': 'Opravit připojení',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Domů',
  'home.subtitle': 'Co vás dnes potřebuje a co vyjde dál.',
  'home.greetingSummary':
    '{actions, plural, =0 {Nic vás právě teď nepotřebuje} one {# položka vás potřebuje} other {# položky vás potřebují} few {# položky vás potřebují} many {# položky vás potřebují}}. {upcoming, plural, =0 {V příštích 24 hodinách není nic naplánováno} one {# příspěvek bude zveřejněn během následujících 24 hodin} other {# příspěvky budou zveřejněny během následujících 24 hodin} few {# příspěvky budou zveřejněny během následujících 24 hodin} many {# příspěvky budou zveřejněny během následujících 24 hodin}}.',
  'home.needsYou.title': 'Potřebuje vás hned',
  'home.needsYou.empty': 'Nic vás právě teď nepotřebuje.',
  'home.needsYou.emptyBody':
    'Stav připojení, schválení a neúspěšná publikování se zde objeví v okamžiku, kdy k nim dojde.',
  'home.needsYou.viewAll': 'Otevřít centrum akcí',
  'home.needsYou.emptyQuiet':
    'Užijte si klid. Vše, co potřebuje rozhodnutí, se zde objeví ve chvíli, kdy je potřeba.',
  'home.upcoming.title': 'Příštích 24 hodin',
  'home.upcoming.empty': 'V příštích 24 hodinách není nic naplánováno.',
  'home.upcoming.emptyBody': 'Napište příspěvek a vyberte čas. Můžete jej později změnit.',
  'home.upcoming.viewAll': 'Otevřít kalendář',
  'home.upcoming.timeZoneNote': 'Časy jsou uvedeny v {timeZone}, zóna pracovního prostoru.',
  'home.upcoming.columnTime': 'Čas',
  'home.upcoming.columnAccount': 'Účet',
  'home.upcoming.columnContent': 'Obsah',
  'home.upcoming.columnStatus': 'Stav',
  'home.receipts.title': 'Poslední účtenky',
  'home.receipts.empty': 'Z tohoto pracovního prostoru nebyly dosud publikovány žádné příspěvky.',
  'home.receipts.emptyBody':
    'Každá publikace obsahuje účtenku, kterou si můžete prohlédnout a sdílet.',
  'home.receipts.viewAll': 'Všechny účtenky',
  'home.receipts.publishedTo': 'Zveřejněno na {account}',
  'home.connections.title': 'Stav připojení',
  'home.connections.summary':
    '{healthy, plural, one {# účet funguje} other {# účty fungují} few {# účty fungují} many {# účty fungují}}. {attention, plural, =0 {Nikdo nevyžaduje pozornost} one {# vyžaduje pozornost} other {# vyžaduje pozornost} few {# vyžaduje pozornost} many {# vyžaduje pozornost}}.',
  'home.connections.viewAll': 'Všechna připojení',
  'home.connections.empty': 'Zatím nejsou připojeny žádné účty.',
  'home.advisor.title': 'Růstový poradce',
  'home.advisor.summary':
    'Verze plánu {version} byl schválen {date}. Týden {week} z {total} má {briefs, plural, one {# stručná zpráva dosud nevypracována} other {# briefingy dosud nevypracované} few {# briefingy dosud nevypracované} many {# briefingy dosud nevypracované}}.',
  'home.advisor.noPlan':
    'Poradce sestaví plán z faktů, které potvrdíte. Navrhuje práci a nikdy nepublikuje sama o sobě.',
  'home.advisor.openPlan': 'Otevřít plán',
  'home.advisor.createDrafts': 'Vytvářejte koncepty z týdne {week}',
  'home.advisor.start': 'Zahájit obchodní profil',
  'home.trial.banner':
    'Zkušební verze, {days, plural, =0 {končí dnes} one {# zbývá den} other {# zbývající dny} few {# zbývající dny} many {# zbývající dny}}. Převádí {date} až {amount}.',
  'home.trial.manage': 'Spravovat nebo zrušit',
  'home.error.title': 'Domov se nepodařilo načíst',
  'home.error.body':
    'Váš pracovní prostor je nedotčen. Toto je problém při dosahování rozhraní Relay API.',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title':
    'Publikujte prostřednictvím oficiálních rozhraní API a uvidíte, co se přesně stalo.',
  'auth.aside.point.receipts':
    'Každá publikace obsahuje potvrzení: kdo ji schválil, kdy byla odeslána, co platforma vrátila.',
  'auth.aside.point.approvals':
    'Na platformu se nic nedostane bez schválení, které vaše zásady vyžadují.',
  'auth.aside.point.surfaces':
    'Stejný pracovní postup z webové aplikace, REST API, MCP, CLI a webhooků.',
  'auth.provider.title': 'Než budete pokračovat',
  'auth.provider.google.access':
    'Google sdílí vaše jméno, e-mailovou adresu a profilový obrázek se službou Relay. Relay nemůže číst váš Gmail, Disk nebo Kalendář.',
  'auth.provider.facebook.access':
    'Facebook sdílí vaše jméno, e-mailovou adresu a profilový obrázek se službou Relay. Připojení stránky k publikování je samostatný krok, který schvalujete později.',
  'auth.provider.note': 'Tím se přihlásíte. Nepřipojuje se k účtu pro publikování.',
  'auth.continueWithEmail': 'Pokračovat e-mailem',
  'auth.method.password': 'Heslo',
  'auth.method.magicLink': 'E-mailový odkaz',
  'auth.method.username': 'Uživatelské jméno',
  'auth.method.chooseLabel': 'Jak se chcete přihlásit?',
  'auth.username.placeholder': 'vaše uživatelské jméno',
  'auth.username.aliasNote':
    'Uživatelské jméno je alias pro e-mailovou adresu vašeho účtu. Heslo je stejné.',
  'auth.password.placeholder': 'Vaše heslo',
  'auth.submit.signIn': 'Přihlásit se',
  'auth.submit.signUp': 'Vytvořit účet',
  'auth.submit.working': 'Kontrola',
  'auth.failure.credentials':
    'Tato e-mailová adresa a heslo neodpovídají účtu. Zkontrolujte oba a zkuste to znovu.',
  'auth.failure.usernameCredentials':
    'Toto uživatelské jméno a heslo neodpovídají účtu. Zkontrolujte oba a zkuste to znovu.',
  'auth.failure.noAccountLeak': 'Pro vaši bezpečnost neříkáme, zda je adresa registrována.',
  'auth.failure.provider': 'Přihlášení pomocí {provider} nebylo dokončeno. Nic se nezměnilo.',
  'auth.failure.network': 'Nedosáhli jsme relé. Zkontrolujte připojení a zkuste to znovu.',
  'auth.signUp.trialNote':
    'Sedm plných zkušebních dnů. Je vyžadována platební metoda. 0 $ splatných dnes.',
  'auth.signUp.emailInUseNote':
    'Pokud tato adresa již má účet, zašleme e-mailem odkaz pro přihlášení namísto vytvoření druhého.',
  'auth.legal.readTerms': 'Přečtěte si podmínky',
  'auth.legal.readPrivacy': 'Přečtěte si oznámení o ochraně osobních údajů',
  'auth.switchToSignUp': 'Vytvořit účet',
  'auth.switchToSignIn': 'Přihlaste se místo toho',
  'auth.checkEmail.body': 'Poslali jsme odkaz na přihlášení na adresu {email}. Funguje to jednou.',
  'auth.checkEmail.wrongAddress': 'Použít jinou adresu',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Fakturace',
  'onboarding.stepName.workspace': 'Pracovní prostor',
  'onboarding.stepName.role': 'Případ použití',
  'onboarding.stepName.connect': 'Připojit',
  'onboarding.stepName.compose': 'První příspěvek',
  'onboarding.stepName.receipt': 'Potvrzení',
  'onboarding.stepList': 'Kroky nastavení',
  'onboarding.stepComplete': 'Hotovo',
  'onboarding.stepCurrent': 'Aktuální krok',
  'onboarding.exit': 'Dokončit později',
  'onboarding.plan.intervalMonthlyLabel': '29 $ měsíčně',
  'onboarding.plan.intervalAnnualLabel': '300 $ ročně',
  'onboarding.plan.checkoutHint':
    'Další obrazovkou je Polar, náš rekordní obchodník. Přístup je udělen, když Polar potvrdí předplatné, nikoli když se prohlížeč vrátí.',
  'onboarding.plan.factsTitle': 'Co se stane, když budete pokračovat',
  'onboarding.workspace.help':
    'Pracovní prostor obsahuje vaše projekty, propojené účty, koncepty a účtenky. Později můžete vytvořit další.',
  'onboarding.workspace.localeNote':
    'Jazyk vašeho rozhraní změní tuto aplikaci. Jazyky obsahu se vybírají u příspěvku a jsou oddělené od tohoto nastavení.',
  'onboarding.workspace.timeZoneDetected': 'Zjištěno z tohoto zařízení: {timeZone}',
  'onboarding.connect.permissionsTitle': 'Co {provider} bude požádáno o',
  'onboarding.connect.permissionsFooter':
    'Relay nikdy nepožaduje povolení, které nepoužívá, a můžete se kdykoli odpojit.',
  'onboarding.connect.chooseProvider': 'Vyberte platformu',
  'onboarding.connect.opensProvider': 'Pokračování otevření {provider} na této kartě.',
  'onboarding.compose.help':
    'Napište příspěvek a než si vyberete čas, zkontrolujte náhled a ověření.',
  'onboarding.compose.openComposer': 'Otevřít celý skladatel',
  'onboarding.receipt.title': 'Váš první příspěvek je naplánován',
  'onboarding.receipt.body':
    'Zde je dosavadní rekord. Neustále se aktualizuje prostřednictvím odeslání, odezvy poskytovatele a první synchronizace analýzy.',
  'onboarding.receipt.goHome': 'Přejít na domovskou stránku',
  'onboarding.blocked.title': 'Tento krok vyžaduje předchozí',
  'onboarding.blocked.body': 'Dokončit {step} nejprve. Nic, co jste zadali, se neztratilo.',
} as const;
