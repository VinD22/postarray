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
    'Wszystko, co konfiguruje ten obszar roboczy. Nic tutaj niczego nie publikuje.',
  'settings.ui.nav.label': 'Sekcje ustawień',
  'settings.ui.index.help':
    'Wybierz sekcję. Każda zmiana jest przypisywana Tobie i pojawia się w dzienniku audytu.',

  'settings.ui.section.members': 'Członkowie i role',
  'settings.ui.section.membersSummary':
    'Kto znajduje się w tym obszarze roboczym i co każda osoba może zrobić.',
  'settings.ui.section.brands': 'Marki',
  'settings.ui.section.brandsSummary':
    'Głos, odbiorcy, zatwierdzone roszczenia, zablokowane terminy, reguły regionalne, domeny i glosariusz.',
  'settings.ui.section.agents': 'Agenci i API',
  'settings.ui.section.agentsSummary':
    'Konta usług, zakresy, limity, referencje, aktywność i plac zabaw na sucho.',
  'settings.ui.section.apps': 'Aplikacje dla programistów',
  'settings.ui.section.appsSummary':
    'Aplikacje OAuth innych firm, listy dozwolonych przekierowań, zgody i dotacje.',
  'settings.ui.section.webhooks': 'Webhooki',
  'settings.ui.section.webhooksSummary':
    'Podpisane zdarzenia wychodzące, dzienniki dostaw, ponowne dostarczenie i rotacja tajnych danych.',
  'settings.ui.section.billing': 'Rozliczenia',
  'settings.ui.section.billingSummary':
    'Plan, wersja próbna, interwał, mierzone wykorzystanie dostawcy, faktury i anulowanie.',
  'settings.ui.section.referrals': 'Polecenie i partner',
  'settings.ui.section.referralsSummary':
    'Twój ujawniony link polecający, przypisane rejestracje i status prowizji.',
  'settings.ui.section.localization': 'Lokalizacja',
  'settings.ui.section.localizationSummary':
    'Język interfejsu, języki treści, rynki, strefa czasowa i format czasu.',
  'settings.ui.section.security': 'Bezpieczeństwo',
  'settings.ui.section.securitySummary':
    'Sesje, uwierzytelnianie dwuskładnikowe, dane uwierzytelniające, agenci, webhooki i granty aplikacji.',
  'settings.ui.section.data': 'Kontrola danych',
  'settings.ui.section.dataSummary':
    'Eksportuj, anuluj połączenie, usuń markę, usuń zawartość lub zamknij konto.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Ładowanie {section}',
  'settings.ui.state.errorTitle': 'Nie mogliśmy załadować {section}',
  'settings.ui.state.errorRetry': 'Spróbuj ponownie',
  'settings.ui.state.savingAnnouncement': 'Zapisywanie {section}',
  'settings.ui.state.savedAnnouncement': '{section} zapisane',
  'settings.ui.state.saveFailedAnnouncement':
    '{section} nie został zapisany. Twoje dane nadal tu są.',
  'settings.ui.state.offlineTitle': 'Jesteś offline',
  'settings.ui.state.offlineBody':
    'Możesz przeczytać tę stronę. Nie można zapisać zmian, dopóki połączenie nie zostanie przywrócone.',
  'settings.ui.state.permissionTitle': 'Nie masz dostępu do {section}',
  'settings.ui.state.permissionBody':
    'Ta sekcja zmienia sposób działania obszaru roboczego, dlatego jest ograniczona w zależności od roli.',
  'settings.ui.state.permissionRequirements': 'Czego potrzebujesz',
  'settings.ui.state.permissionContact':
    'Właściciel lub administrator tego obszaru roboczego może to przyznać. Są one wymienione w sekcji Członkowie i role.',
  'settings.ui.state.rateLimitTitle': 'Zbyt wiele zmian w krótkim czasie',
  'settings.ui.state.rateLimitCause':
    'W tym obszarze roboczym osiągnięto limit zapisu dla zmian ustawień.',
  'settings.ui.state.rateLimitReset': 'Resetowanie limitów',
  'settings.ui.state.rateLimitAlternative':
    'Nic, co zapisałeś, nie zostało utracone. Akcje tylko do odczytu nadal działają podczas oczekiwania.',
  'settings.ui.state.rateLimitUsage': 'Ustawienia zapisują tę godzinę',
  'settings.ui.state.rateLimitUsageText': '{used} z {limit} używany',
  'settings.ui.state.unsavedTitle': 'Masz niezapisane zmiany',
  'settings.ui.state.unsavedBody': 'Zapisz je, zanim opuścisz tę sekcję.',
  'settings.ui.state.readOnlyTitle': 'Ten obszar roboczy jest tylko do odczytu',
  'settings.ui.state.readOnlyBody':
    'Zaległość w płatnościach. Twoje treści, rachunki i połączenia są nienaruszone. Ustawienia można odczytać, ale nie można ich zmienić.',

  'settings.ui.state.referenceLabel': 'Odniesienie do pomocy technicznej',

  'settings.ui.attribution': 'Zmienione przez {name} {relativeTime}',
  'settings.ui.attributionNever': 'Niezmienione od czasu utworzenia',
  'settings.ui.copyFailed':
    'Twoja przeglądarka zablokowała kopię. Wybierz tekst i skopiuj go ręcznie.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'Każde zaproszenie, zmiana roli lub usunięcie jest rejestrowane z Twoim imieniem i godziną.',
  'settings.ui.members.tableCaption': 'Osoby w tym obszarze roboczym, z rolą i zakresem',
  'settings.ui.members.column.person': 'Osoba',
  'settings.ui.members.column.role': 'Rola',
  'settings.ui.members.column.scope': 'Zakres',
  'settings.ui.members.column.approvals': 'Zatwierdzenia',
  'settings.ui.members.column.lastActive': 'Ostatni aktywny',
  'settings.ui.members.column.actions': 'Działania',
  'settings.ui.members.scopeAll': 'Wszystkie marki i konta',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {# marka} other {# marki} few {# marki} many {# marki}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Może zatwierdzić',
  'settings.ui.members.approvals.cannotApprove': 'Nie można zatwierdzić',
  'settings.ui.members.approvals.canApproveOwnBrands': 'Może zatwierdzić wymienione marki',
  'settings.ui.members.lastActiveNever': 'Jeszcze się nie zalogował',
  'settings.ui.members.changeRole': 'Zmień rolę dla {name}',
  'settings.ui.members.remove': 'Usuń {name}',
  'settings.ui.members.lastOwnerTitle': 'Przestrzeń robocza ma co najmniej jednego właściciela',
  'settings.ui.members.lastOwnerBody':
    'Najpierw uczyń kogoś innego właścicielem, a następnie ta zmiana stanie się dostępna.',
  'settings.ui.members.inviteTitle': 'Zaproś kogoś do tego obszaru roboczego',
  'settings.ui.members.inviteBody':
    'Otrzymują e-mail z linkiem. Zaproszenie wygasa po siedmiu dniach i możesz je wcześniej odwołać.',
  'settings.ui.members.inviteRole': 'Rola',
  'settings.ui.members.inviteScope': 'Marki, w których mogą pracować',
  'settings.ui.members.inviteScopeAll': 'Każda marka w tym obszarze pracy',
  'settings.ui.members.inviteScopeSelected': 'Tylko wybrane przeze mnie marki',
  'settings.ui.members.inviteApprovals': 'Może decydować o prośbach o zatwierdzenie',
  'settings.ui.members.inviteApprovalsHelp':
    'Można to przypisać tylko rolom, które obejmują już recenzję. Jest to niezależne od edycji.',
  'settings.ui.members.inviteSubmit': 'Wyślij zaproszenie',
  'settings.ui.members.invitePending': 'Zaproszono {relativeTime} autorstwa {name}',
  'settings.ui.members.inviteRevoke': 'Odwołaj zaproszenie',
  'settings.ui.members.inviteResend': 'Wyślij zaproszenie ponownie',
  'settings.ui.members.emptyTitle': 'Jesteś tu jedyną osobą',
  'settings.ui.members.emptyBody':
    'Zaproś osoby, które piszą, zatwierdzają lub czytają wyniki. Każdy otrzymuje rolę i zakres marki.',
  'settings.ui.members.emptyExample':
    'Powszechny kształt: jeden właściciel do celów rozliczeń, jedna osoba zatwierdzająca na markę i redaktorzy, którzy piszą, ale nigdy nie publikują.',
  'settings.ui.members.roleReferenceTitle': 'Co może zrobić każda rola',
  'settings.ui.members.roleReferenceCaption': 'Role i działania, na które pozwala każda z nich',
  'settings.ui.members.roleColumn.role': 'Rola',
  'settings.ui.members.roleColumn.can': 'Może',
  'settings.ui.members.roleColumn.cannot': 'Nie można zrobić',
  'settings.ui.members.roleCannot.owner': 'Nic nie jest ukrywane przed właścicielem.',
  'settings.ui.members.roleCannot.admin': 'Zmień rozliczenia lub usuń obszar roboczy.',
  'settings.ui.members.roleCannot.manager': 'Zmień rozliczenia, role lub usuń obszar roboczy.',
  'settings.ui.members.roleCannot.editor': 'Zatwierdzaj, planuj, publikuj lub zmieniaj połączenia.',
  'settings.ui.members.roleCannot.approver': 'Zmień połączenia, zasady lub rozliczenia.',
  'settings.ui.members.roleCannot.analyst': 'Twórz, edytuj, zatwierdzaj lub publikuj cokolwiek.',
  'settings.ui.members.roleCannot.viewer': 'Zmień cokolwiek.',
  'settings.ui.members.removeTitle': 'Usuń {name} z tego obszaru roboczego',
  'settings.ui.members.removeConsequence.access': 'Natychmiast tracą dostęp na każdej powierzchni.',
  'settings.ui.members.removeConsequence.drafts':
    'Napisane przez nich wersje robocze pozostają w obszarze roboczym i można je edytować.',
  'settings.ui.members.removeConsequence.audit':
    'Ich wcześniejsze działania pozostają w dzienniku audytu i na rachunkach.',
  'settings.ui.members.removeConsequence.approvals':
    'Oczekujące prośby o zatwierdzenie wracają do kolejki dla innej osoby zatwierdzającej.',

  /* ------------------------------------------------------------------ brands */

  'settings.ui.brands.description':
    'Marka rządzi się zasadami sprawdzania treści: czego możesz twierdzić, czego nie możesz mówić i jak jest napisany każdy język.',
  'settings.ui.brands.listCaption': 'Marki w tym obszarze pracy',
  'settings.ui.brands.column.brand': 'Marka',
  'settings.ui.brands.column.locales': 'Języki treści',
  'settings.ui.brands.column.accounts': 'Konta',
  'settings.ui.brands.column.updated': 'Aktualizacja',
  'settings.ui.brands.accountCount':
    '{count, plural, =0 {Brak kont} one {# konto} other {# konta} few {# konta} many {# konta}}',
  'settings.ui.brands.emptyTitle': 'Brak jeszcze marek',
  'settings.ui.brands.emptyBody':
    'Marka grupuje konta, reguły zatwierdzania i reguły językowe. Większość zespołów zaczyna od jednego i dodaje drugie, gdy klient lub rynek potrzebuje innych zasad.',
  'settings.ui.brands.emptyExample':
    'Przykład: marka „Acme EU”, języki angielski i niemiecki, zablokowany termin „gwarantowany”, ujawnienie „Płatnego partnerstwa” na Instagramie.',
  'settings.ui.brands.voiceHelp':
    'Jak brzmi ta marka. Używane, gdy prosisz o przepisanie i sprawdzanie roszczeń.',
  'settings.ui.brands.audienceHelp': 'Dla kogo przeznaczona jest treść, według rynku.',
  'settings.ui.brands.approvedClaimsHelp':
    'Oświadczenia zatwierdzone przez recenzenta. Wszystko spoza tej listy jest oznaczane przed zatwierdzeniem, a nie po opublikowaniu.',
  'settings.ui.brands.blockedTermsHelp':
    'Słowa, które blokują harmonogram dla tej marki. Po jednym w wierszu.',
  'settings.ui.brands.domainsHelp':
    'Domeny, do których ta marka może prowadzić linki i które mogą być skracane. W kompozytorze można wybierać tylko zweryfikowane domeny.',
  'settings.ui.brands.domainVerified': 'Zweryfikowano {date}',
  'settings.ui.brands.domainPending': 'Nie widziano jeszcze rekordu DNS',
  'settings.ui.brands.disclosureHelp':
    'Domyślnie stosowane w kompozytorze dla wybranych tutaj platform. Można go zmienić w każdym poście przed zatwierdzeniem.',
  'settings.ui.brands.glossaryHelp':
    'Nazwy produktów, terminy prawne i wszystko, co musi przetrwać tłumaczenie w niezmienionej formie.',
  'settings.ui.brands.glossaryCaption':
    'Terminy chronione i sposób postępowania z każdym z nich w zależności od języka',
  'settings.ui.brands.glossaryEmpty':
    'Nie ma jeszcze chronionych terminów. Dodaj nazwy produktów i terminy prawne, których nie wolno tłumaczyć ani formułować inaczej.',
  'settings.ui.brands.localeRulesHelp':
    'Reguły według języka treści. Są stosowane podczas adaptacji lub transkreacji i pokazywane recenzentowi.',
  'settings.ui.brands.saveBrand': 'Zapisz markę',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'Trzy oddzielne ustawienia: język tej aplikacji, języki, w których publikujesz i rynki, dla których piszesz. Zmiana jednego nigdy nie zmienia drugiego.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Wybierz język interfejsu tej aplikacji. Języki treści są osobne i już dostępne.',
  'settings.ui.localization.marketHelp':
    'Rynek zmienia przykłady, ujawnienia prawne i wezwania do działania. Nie zmienia języka postu.',
  'settings.ui.localization.previewTitle': 'Jak będą odczytywane daty i liczby',
  'settings.ui.localization.previewDate': 'Data',
  'settings.ui.localization.previewTime': 'Czas',
  'settings.ui.localization.previewNumber': 'Numer',
  'settings.ui.localization.previewCurrency': 'Waluta',
  'settings.ui.localization.weekStartHelp': 'Używany w widoku tygodnia kalendarzowego.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'Wszystko, co może działać w tym obszarze roboczym, w jednym miejscu: Twoje sesje, dane uwierzytelniające, agenci, webhooki i aplikacje, do których udzieliłeś dostępu.',
  'settings.ui.security.sessionsCaption': 'Sesje zalogowane na Twoje konto',
  'settings.ui.security.sessionColumn.device': 'Urządzenie i przeglądarka',
  'settings.ui.security.sessionColumn.location': 'Przybliżona lokalizacja',
  'settings.ui.security.sessionColumn.lastSeen': 'Ostatnio używane',
  'settings.ui.security.sessionCurrent': 'Ta sesja',
  'settings.ui.security.sessionRevokeAll': 'Wyloguj się co drugą sesję',
  'settings.ui.security.sessionLocationUnknown': 'Lokalizacja nie została zarejestrowana',
  'settings.ui.security.mfaOn': 'Uwierzytelnianie dwuskładnikowe jest włączone',
  'settings.ui.security.mfaOff': 'Uwierzytelnianie dwuskładnikowe jest wyłączone',
  'settings.ui.security.mfaBody':
    'Przed zmianami w rozliczeniach, utworzeniem konta usługi, ponownym podłączeniem konta i unieważnieniem danych uwierzytelniających wymagany jest drugi czynnik.',
  'settings.ui.security.credentialsTitle': 'Klucze API',
  'settings.ui.security.credentialsBody':
    'Klucze należące do tego obszaru roboczego. Są niezależne od grantów aplikacji i Twojej własnej sesji.',
  'settings.ui.security.agentsTitle': 'Konta usług',
  'settings.ui.security.webhooksTitle': 'Punkty końcowe webhooka',
  'settings.ui.security.grantsTitle': 'Aplikacje, na które zezwoliłeś',
  'settings.ui.security.grantsBody':
    'Odwołanie aplikacji powoduje natychmiastowe zatrzymanie jej tokenów. Nie ma to wpływu na Twoje własne połączenia i zaplanowane posty.',
  'settings.ui.security.grantScopes': 'Przydzielone uprawnienia',
  'settings.ui.security.socialPermissionsTitle': 'Uprawnienia konta społecznościowego',
  'settings.ui.security.socialPermissionsBody':
    'Co każde połączone konto umożliwia Relay, na podstawie migawki możliwości wykonanej w momencie połączenia.',
  'settings.ui.security.viewInSection': 'Zarządzaj w {section}',
  'settings.ui.security.emptySessions': 'Tylko ta sesja jest zalogowana.',
  'settings.ui.security.emptyGrants':
    'Żadna aplikacja innej firmy nie ma dostępu do tego obszaru roboczego. Aplikacje pojawiają się tutaj, gdy zezwolisz na ich wyświetlanie na ekranie zgody.',
  'settings.ui.security.revokeGrantTitle': 'Odbierz dostęp dla {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Tokeny dostępu i odświeżania natychmiast przestają działać.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Publikuje posty, w których jest już zaplanowany pobyt zaplanowany. Anuluj je osobno, jeśli chcesz je zatrzymać.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'Aplikacja może ponownie poprosić o dostęp, a Ty możesz odmówić.',

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'Wyjmij swoje dane, usuń jedną rzecz lub zamknij konto. Każde destrukcyjne działanie nazywa dokładnie to, czego dotyka jako pierwsze.',
  'settings.ui.data.exportTitle': 'Eksportuj',
  'settings.ui.data.exportBody':
    'Przenośne archiwum treści, harmonogramów, rachunków, analiz i zdarzeń audytowych oraz przesłanych przez Ciebie multimediów.',
  'settings.ui.data.exportJson': 'Strukturalny JSON',
  'settings.ui.data.exportCsv': 'Arkusz kalkulacyjny CSV',
  'settings.ui.data.exportMedia': 'Archiwum multimediów',
  'settings.ui.data.exportJsonHelp':
    'Jeden plik na każdy typ rekordu. Udokumentowane i stabilne w różnych wersjach.',
  'settings.ui.data.exportCsvHelp':
    'Posty, potwierdzenia i dane w postaci płaskich tabel w arkuszu kalkulacyjnym.',
  'settings.ui.data.exportMediaHelp':
    'Oryginalne pliki, które przesłałeś lub zaimportowałeś, wraz z sumami kontrolnymi.',
  'settings.ui.data.exportStart': 'Przygotuj eksport',
  'settings.ui.data.exportRunning':
    'Przygotowywanie eksportu. Będzie działać nadal, jeśli zamkniesz tę stronę.',
  'settings.ui.data.exportReady': 'Eksport gotowy, przygotowany {date}',
  'settings.ui.data.exportDownload': 'Pobierz eksport',
  'settings.ui.data.exportExpires': 'Link do pobrania wygasa {date}.',
  'settings.ui.data.deleteTitle': 'Usuń',
  'settings.ui.data.deleteBody':
    'Wybierz najmniejszą rzecz, która rozwiąże Twój problem. Każda opcja poniżej opisuje, co przetrwa.',
  'settings.ui.data.deleteConnection': 'Unieważnij jedno połączenie społecznościowe',
  'settings.ui.data.deleteConnectionHelp':
    'Usuwa dostęp do tego konta przez przekaźnik. Przestrzeń robocza, jej zawartość i rachunki pozostają.',
  'settings.ui.data.deleteBrand': 'Usuń markę',
  'settings.ui.data.deleteBrandHelp':
    'Usuwa markę, jej zasady i słownik. Treści publikowane pod nim zachowują swoje rachunki.',
  'settings.ui.data.deleteContent': 'Usuń zawartość i multimedia',
  'settings.ui.data.deleteContentHelp':
    'Usuwa wersje robocze i zapisane pliki. Nie usuwa niczego, co zostało już opublikowane na platformie.',
  'settings.ui.data.deleteAccount': 'Zamknij ten obszar roboczy',
  'settings.ui.data.deleteAccountHelp':
    'Anuluje zaplanowane zadania, odwołuje każde połączenie, usuwa zapisane multimedia i zamyka obszar roboczy.',
  'settings.ui.data.scheduledJobsTitle': 'Zaplanowane prace, które zostaną anulowane jako pierwsze',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {W tej chwili nic nie jest zaplanowane} one {# zaplanowany post} other {# zaplanowane posty} few {# zaplanowane posty} many {# zaplanowane posty}}',
  'settings.ui.data.cancelJobsFirst': 'Anuluj teraz zaplanowane posty',
  'settings.ui.data.cancelJobsDone': 'Zaplanowane posty anulowane. Nic nie zostanie opublikowane.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'Wpisz nazwę obszaru roboczego, aby potwierdzić',
  'settings.ui.data.deleteConsequence.jobs':
    'Każdy zaplanowany post jest anulowany, zanim cokolwiek zostanie usunięte.',
  'settings.ui.data.deleteConsequence.connections':
    'Każde połączenie społecznościowe zostaje anulowane u dostawcy.',
  'settings.ui.data.deleteConsequence.media':
    'Przechowywane multimedia zostały usunięte i nie można ich odzyskać.',
  'settings.ui.data.deleteConsequence.receipts':
    'Potwierdzenia publikacji są przechowywane przez okres przechowywania określony w Warunkach, a następnie usuwane.',
  'settings.ui.data.deleteConsequence.published':
    'Posty już opublikowane na platformie nie są usuwane. Usuń te z platformy.',
  'settings.ui.data.exportFirst': 'Wyeksportuj swoje dane, zanim je usuniesz.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'Udostępnij przekaźnik za pomocą ujawnionego linku. Komisja nigdy nie jest uzależniona od pozytywnej recenzji.',
  'settings.ui.referral.linkLabel': 'Twój link polecający',
  'settings.ui.referral.tableCaption': 'Przypisane rejestracje i stan ich prowizji',
  'settings.ui.referral.column.signup': 'Rejestracja',
  'settings.ui.referral.column.date': 'Data',
  'settings.ui.referral.column.state': 'Prowizja',
  'settings.ui.referral.column.amount': 'Kwota',
  'settings.ui.referral.emptyTitle': 'Brak przypisanych jeszcze rejestracji',
  'settings.ui.referral.emptyBody':
    'Rejestracja pojawia się tutaj, gdy ktoś rozpocznie okres próbny za pośrednictwem Twojego linku. Kwoty oczekują do zamknięcia okna zwrotu.',
  'settings.ui.referral.emptyExample':
    'Przykładowy wiersz: acme.example, okres próbny rozpoczął się 12 czerwca, trwa do 12 lipca, a następnie został zatwierdzony.',
  'settings.ui.referral.termsLink': 'Przeczytaj warunki partnera',
  'settings.ui.referral.balance': 'Zatwierdzona prowizja',
  'settings.ui.referral.balanceUnavailableReason':
    'Księga prowizji za ten okres nie została jeszcze uzgodniona.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'Konto usługi to nazwana tożsamość agenta, skryptu lub przepływu pracy. Ma własne zakresy, własne ograniczenia i własną ścieżkę audytu.',
  'developer.ui.agents.emptyTitle': 'Nie ma jeszcze kont usług',
  'developer.ui.agents.emptyBody':
    'Utwórz jedną dla każdej uruchomionej automatyzacji. Oddzielne konta oznaczają, że możesz unieważnić jedno bez zatrzymywania pozostałych.',
  'developer.ui.agents.emptyExample':
    'Przykład: „Agent ds. treści”, marka Acme EU, może przygotować i zaplanować do 6 postów dziennie między 07:00 a 22:00, nigdy nie publikuje natychmiast.',
  'developer.ui.agents.step.identity': 'Nazwa i cel',
  'developer.ui.agents.step.scope': 'Co może osiągnąć',
  'developer.ui.agents.step.limits': 'Limity',
  'developer.ui.agents.purpose': 'Do czego służy to konto',
  'developer.ui.agents.purposeHelp':
    'Jedno zdanie. Pojawia się w dzienniku kontrolnym obok każdej czynności wykonywanej na tym koncie.',
  'developer.ui.agents.scopeHelp':
    'Zakres zapewnia dokładnie sam siebie. Nic tutaj nie sugeruje niczego innego.',
  'developer.ui.agents.limitsHelp':
    'Ograniczenia są egzekwowane przez interfejs API, a nie przez agenta. Agent nie może podnieść własnego limitu.',
  'developer.ui.agents.quietHours': 'Ciche godziny',
  'developer.ui.agents.quietHoursHelp':
    'Na koncie nie można planować ani publikować w tych godzinach, w strefie czasowej obszaru roboczego.',
  'developer.ui.agents.lookAheadHelp': 'Jak daleko w przyszłość może umieścić post.',
  'developer.ui.agents.cadenceHelp':
    'Najwięcej publikacji zewnętrznych, jakie może spowodować w ciągu jednego dnia.',
  'developer.ui.agents.expiry': 'Wygaśnięcie danych uwierzytelniających',
  'developer.ui.agents.expiryHelp':
    'Krótsze życie jest bezpieczniejsze. Możesz dokonać rotacji w dowolnym momencie.',
  'developer.ui.agents.summaryTitle': 'Zanim go utworzysz',
  'developer.ui.agents.summaryAccounts': 'Konta, do których może dotrzeć',
  'developer.ui.agents.summaryMaxActions':
    'Co najwyżej {count, plural, one {# publikacja zewnętrzna} other {# publikacje zewnętrzne} few {# publikacje zewnętrzne} many {# publikacje zewnętrzne}} dziennie.',
  'developer.ui.agents.summaryApproval': 'Zachowanie związane z zatwierdzaniem',
  'developer.ui.agents.summaryCreate': 'Utwórz konto usługi',
  'developer.ui.agents.detailTitle': 'Konto usługi',
  'developer.ui.agents.statusActive': 'Aktywny',
  'developer.ui.agents.statusStopped': 'Zatrzymano',
  'developer.ui.agents.statusExpired': 'Poświadczenia wygasły',
  'developer.ui.agents.stoppedBody':
    'To konto zostało zatrzymane. Każde wykonane przez niego połączenie jest odrzucane z prostego powodu. Nic, co stworzył, nie zostało usunięte.',
  'developer.ui.agents.killTitle': 'Zatrzymaj {name}',
  'developer.ui.agents.killConsequence.calls':
    'Każde wywołanie API, MCP i CLI z tego konta jest natychmiast odrzucane.',
  'developer.ui.agents.killConsequence.scheduled':
    'Opublikuje posty, w których jest już zaplanowany pobyt zaplanowany. Anuluj je z kalendarza, jeśli chcesz, aby zostały zatrzymane.',
  'developer.ui.agents.killConsequence.reversible': 'Możesz uruchomić to ponownie później.',
  'developer.ui.agents.resume': 'Uruchom ponownie tego agenta',
  'developer.ui.agents.rotate': 'Obróć dane uwierzytelniające',
  'developer.ui.agents.rotateTitle': 'Obróć dane uwierzytelniające dla {name}',
  'developer.ui.agents.rotateConsequence.old':
    'Bieżące dane uwierzytelniające natychmiast przestają działać.',
  'developer.ui.agents.rotateConsequence.new': 'Nowy pokazany jest raz, na tej stronie.',
  'developer.ui.agents.rotateConsequence.clients':
    'Wszystko, co używa starej wartości, nie będzie działać, dopóki jej nie zaktualizujesz.',
  'developer.ui.agents.credentialStored': 'Zapisałem to dane uwierzytelniające',
  'developer.ui.agents.credentialLabel': 'Poświadczenia konta usługi',
  'developer.ui.agents.credentialWarning':
    'To jedyny raz, kiedy to dane uwierzytelniające są wyświetlane',
  'developer.ui.agents.credentialWarningBody':
    'Skopiuj go teraz do swojego tajnego sklepu. Przechowujemy tylko skrót, więc nie możemy go pokazać ponownie. Obrót tworzy nowy.',
  'developer.ui.agents.credentialConsumed':
    'Poświadczenie nie jest już wyświetlane. Obróć go, jeśli go nie zapisałeś.',
  'developer.ui.agents.credentialReveal': 'Pokaż dane logowania',
  'developer.ui.agents.credentialHide': 'Ukryj dane logowania',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read': 'Zobacz swoje połączone konta i możliwości każdego z nich',
  'developer.ui.scope.accounts_write': 'Zmień nazwy kont i sposób ich grupowania',
  'developer.ui.scope.drafts_read': 'Przeczytaj wersje robocze i ich warianty',
  'developer.ui.scope.drafts_write': 'Twórz i edytuj wersje robocze',
  'developer.ui.scope.posts_schedule': 'Zaplanuj zatwierdzone treści na swoich kontach',
  'developer.ui.scope.posts_publish': 'Natychmiast opublikuj na swoich kontach',
  'developer.ui.scope.posts_cancel': 'Anuluj zaplanowane posty',
  'developer.ui.scope.analytics_read': 'Przeczytaj statystyki dotyczące swoich kont',
  'developer.ui.scope.media_read': 'Zobacz pliki w swojej bibliotece',
  'developer.ui.scope.media_write': 'Prześlij i edytuj pliki w swojej bibliotece',
  'developer.ui.scope.rules_read': 'Przeczytaj zasady automatyzacji',
  'developer.ui.scope.rules_write': 'Twórz i zmieniaj reguły automatyzacji, które mogą publikować',
  'developer.ui.scope.growth_read': 'Przeczytaj swoje plany rozwoju',
  'developer.ui.scope.growth_write': 'Twórz i edytuj plany rozwoju',
  'developer.ui.scope.webhooks_manage': 'Twórz i zmieniaj punkty końcowe webhooka',
  'developer.ui.scope.billing_read': 'Przeczytaj swój plan, stan próbny i sposób użycia',
  'developer.ui.scope.connections_admin': 'Podłącz i odłącz konta społecznościowe',

  'developer.ui.activity.caption':
    'Ostatnie wywołania narzędzi wraz z tymi, które zostały odrzucone',
  'developer.ui.activity.column.time': 'Czas',
  'developer.ui.activity.column.tool': 'Narzędzie lub trasa',
  'developer.ui.activity.column.outcome': 'Wynik',
  'developer.ui.activity.column.subject': 'Temat',
  'developer.ui.activity.outcome.ok': 'Dozwolone',
  'developer.ui.activity.outcome.denied': 'Odrzucono',
  'developer.ui.activity.outcome.failed': 'Niepowodzenie',
  'developer.ui.activity.filterDenied': 'Pokaż tylko odrzucone próby',
  'developer.ui.activity.deniedExplain':
    'Odmowa próby to sposób, w jaki pokazuje się źle skonfigurowany agent. Te wiersze są zachowywane, a nie ukryte.',
  'developer.ui.activity.emptyTitle': 'Żadne rozmowy nie zostały jeszcze nagrane',
  'developer.ui.activity.emptyBody':
    'Połączenia pojawiają się tutaj w ciągu kilku sekund od wystąpienia, łącznie z tymi, które zostały odrzucone.',
  'developer.ui.activity.emptyExample':
    'Przykładowy wiersz: 12:03, wersja robocza, dozwolona, wersja robocza dla konta X @acme.',

  'developer.ui.setup.help':
    'Wklej to do klienta, z którym się łączysz. Zastąp symbol zastępczy poświadczeń zapisaną wartością.',
  'developer.ui.setup.credentialPlaceholder':
    'Fragment zawiera symbol zastępczy. Nigdy nie przekazuj prawdziwych danych uwierzytelniających do repozytorium.',
  'developer.ui.setup.copySnippet': 'Skopiuj fragment kodu dla {client}',
  'developer.ui.setup.snippetCopied': 'Fragment skopiowany',
  'developer.ui.setup.tabLabel': 'Fragmenty konfiguracji klienta',

  'developer.ui.playground.help':
    'Wywołania są uruchamiane względem zaszczepionej kopii tego obszaru roboczego. Nie skontaktowano się z żadnym dostawcą i nic nie jest zaplanowane.',
  'developer.ui.playground.tool': 'Narzędzie',
  'developer.ui.playground.arguments': 'Argumenty',
  'developer.ui.playground.argumentsHelp': 'JSON. To samo ciało, które akceptuje prawdziwe API.',
  'developer.ui.playground.result': 'Wynik',
  'developer.ui.playground.resultEmpty': 'Uruchom narzędzie, aby zobaczyć odpowiedź, jaką zwróci.',
  'developer.ui.playground.invalidJson':
    'To nie jest jeszcze prawidłowy JSON, więc nie można go wysłać.',
  'developer.ui.playground.deniedByApproval':
    'Poziom zatwierdzenia {level} nie pozwala na to połączenie. Próba próbna odrzuca to dokładnie tak, jak zrobiłby to interfejs API.',
  'developer.ui.playground.announceResult': 'Próba próbna zakończona. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'Zarejestruj aplikację, aby inne osoby mogły przyznać jej dostęp do swojego obszaru roboczego. Każda aplikacja ma własną tożsamość, własną listę dozwolonych przekierowań i własną ścieżkę audytu.',
  'developer.ui.apps.emptyTitle': 'Brak zarejestrowanych aplikacji',
  'developer.ui.apps.emptyBody':
    'Zarejestruj aplikację, gdy inny produkt musi działać w imieniu użytkownika Relay. Do własnej automatyzacji użyj zamiast tego konta usługi.',
  'developer.ui.apps.emptyExample':
    'Przykład: „Acme Publisher”, klient poufny, przekierowanie https://acme.example/oauth/callback, zakresy kont:odczyt i wersje robocze:zapis.',
  'developer.ui.apps.typeHelp':
    'Poufny klient działa na serwerze, który kontrolujesz i może zachować tajemnicę. Klient publiczny to przeglądarka lub aplikacja komputerowa i korzysta z PKCE bez tajemnicy.',
  'developer.ui.apps.redirectAdd': 'Dodaj identyfikator URI przekierowania',
  'developer.ui.apps.redirectRemove': 'Usuń {uri}',
  'developer.ui.apps.redirectInvalid':
    'Wprowadź pełny identyfikator URI https bez symboli wieloznacznych i bez ciągu zapytania. Musi dokładnie odpowiadać wartości wysyłanej przez Twoją aplikację.',
  'developer.ui.apps.linksTitle': 'Opublikowane linki',
  'developer.ui.apps.linksHelp':
    'Te informacje pojawiają się na ekranie zgody. Użytkownik, który nie może się z nimi skontaktować, nie udzieli dostępu.',
  'developer.ui.apps.linkUnreachable':
    'Podczas ostatniego sprawdzania nie mogliśmy dotrzeć do tego adresu URL, {date}.',
  'developer.ui.apps.linkReachable': 'Osiągalny, sprawdzony {date}',
  'developer.ui.apps.scopesTitle': 'Uprawnienia, o które może prosić ta aplikacja',
  'developer.ui.apps.scopesHelp':
    'Poproś o najmniej, czego potrzebujesz. Użytkownik postrzega uprawnienia do odczytu i uprawnienia następcze jako dwie oddzielne grupy.',
  'developer.ui.apps.scopeGroup.read': 'Uprawnienia do odczytu',
  'developer.ui.apps.scopeGroup.reversible': 'Zmiany, które możesz cofnąć',
  'developer.ui.apps.scopeGroup.consequential': 'Uprawnienia następcze',
  'developer.ui.apps.scopeGroupHelp.read':
    'Dzięki nim aplikacja może przeglądać dane. Nic się nie zmienia.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Pozwalają one aplikacji tworzyć i edytować rzeczy w Relay. Nic nie dociera do platformy.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Mogą one spowodować publikację postu na prawdziwym koncie lub zmianę tego, kto może uzyskać dostęp do Twoich kont. Zawsze są wymienione osobno i nigdy nie są łączone.',
  'developer.ui.apps.noBundling':
    'Nie ma połączonego zakresu dostępu. O administrację rozliczeniami i połączeniami zawsze pyta się po imieniu.',
  'developer.ui.apps.secretTitle': 'Tajny sekret klienta',
  'developer.ui.apps.secretWarning': 'To jedyny raz, kiedy pokazywany jest sekret klienta',
  'developer.ui.apps.secretWarningBody':
    'Zapisz go teraz w menedżerze tajnych kluczy po stronie serwera. Trzymamy tylko skrót. Jeśli go zgubisz, obróć go: nie ma możliwości ponownego ujawnienia.',
  'developer.ui.apps.secretConsumed':
    'Sekret nie jest już wyświetlany. Obróć go, jeśli go nie zapisałeś.',
  'developer.ui.apps.secretStored': 'Zapisałem ten sekret',
  'developer.ui.apps.secretPublicClient':
    'Klient publiczny nie ma tajemnicy. Wykorzystuje przepływ kodu autoryzacyjnego z PKCE.',
  'developer.ui.apps.rotateTitle': 'Zamień sekret klienta dla {app}',
  'developer.ui.apps.rotateConsequence.old': 'Bieżący sekret natychmiast przestaje działać.',
  'developer.ui.apps.rotateConsequence.grants':
    'Istniejące uprawnienia użytkowników nie zostały cofnięte.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Twoje serwery nie odświeżą tokenów, dopóki nie wdrożysz nowej wartości.',
  'developer.ui.apps.consentPreviewTitle': 'Podgląd ekranu zgody',
  'developer.ui.apps.consentPreviewHelp':
    'To właśnie widzi użytkownik. Jest generowany na podstawie rekordu aplikacji, więc nie może obiecać więcej, niż prosi aplikacja.',
  'developer.ui.apps.consentPreviewSample':
    'Tylko podgląd. Nic nie jest przyznawane ani nie jest wydawany żaden token.',
  'developer.ui.apps.grantsCaption': 'Obszary robocze, które przyznały tej aplikacji dostęp',
  'developer.ui.apps.grantColumn.workspace': 'Przestrzeń robocza',
  'developer.ui.apps.grantColumn.scopes': 'Zakresy',
  'developer.ui.apps.grantColumn.granted': 'To prawda',
  'developer.ui.apps.grantColumn.lastUsed': 'Ostatnio używane',
  'developer.ui.apps.grantsEmpty': 'Nikt jeszcze nie przyznał tej aplikacji dostępu.',
  'developer.ui.apps.logsCaption': 'Ostatnie żądania z usuniętymi sekretami i ładunkami',
  'developer.ui.apps.logColumn.time': 'Czas',
  'developer.ui.apps.logColumn.route': 'Trasa',
  'developer.ui.apps.logColumn.status': 'Stan',
  'developer.ui.apps.logColumn.workspace': 'Przestrzeń robocza',
  'developer.ui.apps.logsRedacted':
    'Treści żądań i odpowiedzi są przechowywane z usuniętymi poświadczeniami, tokenami i treścią użytkownika.',
  'developer.ui.apps.sandboxTitle': 'Poświadczenia piaskownicy',
  'developer.ui.apps.sandboxBody':
    'Oddzielny identyfikator klienta i obszar roboczy z danymi początkowymi. Połączenia wykonywane za jego pomocą nigdy nie docierają do operatora.',
  'developer.ui.apps.rateLimitLabel': 'Limit szybkości',
  'developer.ui.apps.rateLimitUsage': '{used} z {limit} żąda tej godziny',
  'developer.ui.apps.disable': 'Wyłącz aplikację',
  'developer.ui.apps.enable': 'Włącz aplikację',
  'developer.ui.apps.disabledBody':
    'Ta aplikacja jest wyłączona. Istniejące tokeny są odrzucane i nie można rozpocząć nowego grantu. Dotacje zostaną zachowane, więc możesz je włączyć ponownie.',
  'developer.ui.apps.deleteTitle': 'Usuń {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Każda dotacja zostaje cofnięta i każdy token przestaje działać.',
  'developer.ui.apps.deleteConsequence.logs':
    'Dzienniki żądań są przechowywane przez okres przechowywania audytu.',
  'developer.ui.apps.deleteConsequence.irreversible':
    'Nie można ponownie wykorzystać identyfikatora klienta.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Podpisane dostawy HTTPS dla wybranych przez Ciebie wydarzeń. Każda dostawa jest rejestrowana wraz z odpowiedzią i każdą dostawę można wysłać ponownie.',
  'developer.ui.webhooks.emptyTitle': 'Brak jeszcze punktów końcowych',
  'developer.ui.webhooks.emptyBody':
    'Dodaj punkt końcowy, aby otrzymywać wyniki publikacji, decyzje o zatwierdzeniu i stan połączenia we własnych systemach.',
  'developer.ui.webhooks.emptyExample':
    'Przykład: https://hooks.acme.example/relay, subskrybowano post.published, post.failed i Connection.action_required.',
  'developer.ui.webhooks.create': 'Dodaj punkt końcowy',
  'developer.ui.webhooks.url': 'URL punktu końcowego',
  'developer.ui.webhooks.urlHelp':
    'Tylko HTTPS. Nie podążamy za żadnymi przekierowaniami i nie próbujemy ponownie wykonać 2xx.',
  'developer.ui.webhooks.eventsTitle': 'Wydarzenia',
  'developer.ui.webhooks.eventsHelp':
    'Wybierz zdarzenia, które obsługujesz. Wysyłanie wszystkiego do punktu końcowego, który ignoruje większość, sprawia, że awarie stają się trudniejsze do zauważenia.',
  'developer.ui.webhooks.eventsAll': 'Każde wydarzenie',
  'developer.ui.webhooks.eventsSelected': 'Tylko wybrane przeze mnie zdarzenia',
  'developer.ui.webhooks.eventsCount':
    '{count, plural, one {# wydarzenie} other {# wydarzenia} few {# wydarzenia} many {# wydarzenia}}',
  'developer.ui.webhooks.eventGroup.connections': 'Połączenia',
  'developer.ui.webhooks.eventGroup.content': 'Treść i akceptacja',
  'developer.ui.webhooks.eventGroup.publishing': 'Publikowanie',
  'developer.ui.webhooks.eventGroup.automation': 'Automatyzacja i kanały',
  'developer.ui.webhooks.eventGroup.workspace': 'Przestrzeń robocza',
  'developer.ui.webhooks.scopeTitle': 'Marki i konta',
  'developer.ui.webhooks.scopeAll': 'Każda marka i konto',
  'developer.ui.webhooks.scopeSelected': 'Tylko te, które wybiorę',
  'developer.ui.webhooks.secretTitle': 'Tajne podpisywanie',
  'developer.ui.webhooks.secretBody':
    'Sprawdź nagłówek podpisu przed przeanalizowaniem treści. Deduplikuj identyfikator dostarczenia, który jest stabilny przy kolejnych próbach.',
  'developer.ui.webhooks.secretRotateTitle': 'Obróć sekret podpisu',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Obydwa sekrety są akceptowane przez 24 godziny, więc możesz je wdrożyć bez przerywania dostawy.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Po tym oknie używany jest tylko nowy sekret.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Wysyła jedno podpisane przykładowe zdarzenie oznaczone jako testowe, dzięki czemu Twój odbiornik może je bezpiecznie zignorować.',
  'developer.ui.webhooks.testDeliverySent':
    'Wysłano dostawę testową. Wynik pojawi się w logu poniżej.',
  'developer.ui.webhooks.deliveriesCaption': 'Ostatnie dostawy i otrzymana odpowiedź',
  'developer.ui.webhooks.deliveryColumn.time': 'Zażądano',
  'developer.ui.webhooks.deliveryColumn.event': 'Zdarzenie',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Próba',
  'developer.ui.webhooks.deliveryColumn.response': 'Odpowiedź',
  'developer.ui.webhooks.deliveryColumn.status': 'Stan',
  'developer.ui.webhooks.deliveryStatus.pending': 'Oczekiwanie',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Dostarczono',
  'developer.ui.webhooks.deliveryStatus.failed': 'Nie udało się, spróbuję ponownie',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Nie udało się, koniec z ponownymi próbami',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Nie wysłano, punkt końcowy wyłączony',
  'developer.ui.webhooks.deliveryNoResponse': 'Nie otrzymano odpowiedzi',
  'developer.ui.webhooks.deliveryNextAttempt': 'Następna próba {relativeTime}',
  'developer.ui.webhooks.inspect': 'Sprawdź dostawę',
  'developer.ui.webhooks.inspectTitle': 'Dostawa {id}',
  'developer.ui.webhooks.inspectRequest': 'Treść żądania',
  'developer.ui.webhooks.inspectResponse': 'Treść odpowiedzi',
  'developer.ui.webhooks.redeliver': 'Wyślij tę dostawę ponownie',
  'developer.ui.webhooks.redeliverHelp':
    'Ten sam identyfikator zdarzenia jest wysyłany ponownie z ustawioną flagą ponownego dostarczenia, więc idempotentny odbiornik bezpiecznie go ignoruje.',
  'developer.ui.webhooks.redelivered': 'W kolejce do ponownej dostawy.',
  'developer.ui.webhooks.failureTitle': 'Ten punkt końcowy ulega awarii',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# dostawa z rzędu nie powiodła się} other {# dostawy z rzędu nie powiodły się} few {# dostawy z rzędu nie powiodły się} many {# dostawy z rzędu nie powiodły się}}. Po {limit} kolejne błędy, punkt końcowy zostaje wyłączony i zapisano element akcji.',
  'developer.ui.webhooks.disabledTitle':
    'Ten punkt końcowy został wyłączony w wyniku powtarzających się błędów',
  'developer.ui.webhooks.disabledBody':
    'Przestaliśmy do niego wysyłać, więc Twoja kolejka się nie zapełnia. Napraw odbiornik, wyślij przesyłkę testową, a następnie włącz go ponownie.',
  'developer.ui.webhooks.lastSuccessLabel': 'Ostatni sukces',
  'developer.ui.webhooks.lastSuccessNever': 'Żadna dostawa nigdy się nie powiodła',
  'developer.ui.webhooks.deleteTitle': 'Usuń ten punkt końcowy',
  'developer.ui.webhooks.deleteConsequence.stop': 'Na ten adres URL nie jest wysyłane nic więcej.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'Dzienniki dostaw są przechowywane przez okres przechowywania audytu.',

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'Jeden plan, dwa interwały. Polar jest uznanym sprzedawcą: przechowuje metody płatności, wystawia faktury i obsługuje anulowanie.',
  'billing.ui.statusHeading': 'Aktualny stan',
  'billing.ui.planHeading': 'Plan',
  'billing.ui.intervalHeading': 'Przedział rozliczeniowy',
  'billing.ui.usageHeading': 'Mierzone wykorzystanie dostawcy',
  'billing.ui.invoicesHeading': 'Faktury',
  'billing.ui.cancelHeading': 'Anulowanie',
  'billing.ui.trialDaysRemaining':
    'Próba, {count, plural, =0 {kończy się dzisiaj} one {# pozostały dzień} other {# pozostałe dni} few {# pozostałe dni} many {# pozostałe dni}}',
  'billing.ui.convertsOn': 'Konwertuje w dniu {date} do {amount} na {interval}.',
  'billing.ui.dueToday': 'Należność 0 USD na dzisiaj',
  'billing.ui.conversionLabel': 'Konwersje',
  'billing.ui.channelsLabel': 'Aktywne kanały',
  'billing.ui.paymentMethodPolar': 'Metoda płatności posiadana przez firmę Polar',
  'billing.ui.paymentMethodDescriptor': '{brand} zakończenie {last4}, wygasa {expiry}',
  'billing.ui.paymentMethodMissing': 'Nie ma jeszcze zapisanej metody płatności',
  'billing.ui.cancelBeforeDate': 'Anuluj przed {date}, a nie poniesiesz żadnych opłat.',
  'billing.ui.annualFraming': '25 USD miesięcznie, opłata roczna. Zaoszczędź 48 USD rocznie.',
  'billing.ui.monthlyOption': '29 USD miesięcznie',
  'billing.ui.annualOption': '300 USD rocznie',
  'billing.ui.intervalChangeHelp':
    'Zmiana interwału zacznie obowiązywać przy następnym odnowieniu. Polar dzieli ją proporcjonalnie i pokazuje dokładną kwotę, zanim potwierdzisz.',
  'billing.ui.intervalChangedAnnouncement': 'Ustawiono interwał rozliczeniowy na {interval}.',
  'billing.ui.allowanceChannels':
    '30 aktywnych kanałów społecznościowych. Kanał to jedno połączone konto, strona lub kanał.',
  'billing.ui.allowanceChannelsUsage': '{used} z {limit} aktywne kanały',
  'billing.ui.allowanceFairUse':
    'Dozwolony użytek oznacza kontrolę antyspamową, stawek i kosztów dostawcy. Mają one takie samo zastosowanie do każdego abonenta i są publikowane, a nie uznaniowe.',
  'billing.ui.allowanceMetered':
    'X i niektórzy inni dostawcy pobierają opłaty za operację. Opłaty te są naliczane według kosztów i nie są częścią ceny planu.',
  'billing.ui.allowanceNoMedia':
    'Generowanie obrazu i generowanie wideo nie są uwzględnione i nie są sprzedawane. Przekaźnik nie generuje mediów.',
  'billing.ui.readFairUse': 'Przeczytaj zasady dozwolonego użytku',
  'billing.ui.readMeteredPolicy': 'Przeczytaj, jak naliczane jest licznikowe użycie',
  'billing.ui.usageCaption':
    'Zmierzone wykorzystanie dostawcy w tym okresie, rozliczane według kosztu',
  'billing.ui.usageColumn.item': 'Przedmiot',
  'billing.ui.usageColumn.quantity': 'Ilość',
  'billing.ui.usageColumn.unitPrice': 'Cena jednostkowa',
  'billing.ui.usageColumn.amount': 'Kwota',
  'billing.ui.usageTotal': 'Łączny ten okres',
  'billing.ui.usagePeriod': 'Kropka {start} do {end}',
  'billing.ui.usageSource': 'Ceny publikowane przez dostawcę. Zweryfikowano {date}.',
  'billing.ui.usageReconciled': 'Uzgodniono z fakturą dostawcy z dnia {date}.',
  'billing.ui.usagePending':
    'Jeszcze nie uzgodniono. Ostateczna kwota może się nieznacznie zmienić.',
  'billing.ui.usageUnavailableReason':
    'Dostawca nie zwrócił jeszcze wykorzystania w tym okresie. Zwykle jest dostępny w ciągu 24 godzin.',
  'billing.ui.usageEmpty': 'W tym okresie brak licznika zużycia.',
  'billing.ui.spendAlert': 'Alarm dotyczący wydatków',
  'billing.ui.spendAlertHelp':
    'Wyślemy Ci e-mail, gdy licznik zużycia przekroczy tę kwotę w okresie rozliczeniowym.',
  'billing.ui.spendAlertPause': 'Wstrzymaj także mierzone działania po osiągnięciu alertu',
  'billing.ui.balanceLabel': 'Saldo wykorzystania',
  'billing.ui.balanceHelp':
    'Z tego salda pobierane jest zmierzone zużycie i fakturowane przez firmę Polar.',
  'billing.ui.invoicesCaption': 'Faktury wystawione przez Polar',
  'billing.ui.invoiceColumn.date': 'Data',
  'billing.ui.invoiceColumn.description': 'Opis',
  'billing.ui.invoiceColumn.amount': 'Kwota',
  'billing.ui.invoiceColumn.state': 'Stan',
  'billing.ui.invoiceState.paid': 'Płatne',
  'billing.ui.invoiceState.open': 'Otwórz',
  'billing.ui.invoiceState.uncollectible': 'Nie zebrano',
  'billing.ui.invoiceState.refunded': 'Zwrot środków',
  'billing.ui.invoicesEmpty':
    'Nie ma jeszcze faktury. Pierwszy wydawany jest w momencie konwersji procesu.',
  'billing.ui.invoicesInPortal': 'Każda faktura i paragon są dostępne w portalu Polar.',
  'billing.ui.portalHelp':
    'W portalu możesz zmienić metodę płatności, pobrać faktury i anulować transakcję. Otwiera się w nowej karcie.',
  'billing.ui.pastDueHeading': 'Zaległa płatność',
  'billing.ui.pastDueBody':
    'Ostatnia płatność nie została zrealizowana. Zaktualizuj metodę płatności w portalu Polar, aby móc dalej publikować.',
  'billing.ui.gracePolicy':
    'Zaplanowane posty będą wyświetlane do {date}. Następnie obszar roboczy staje się tylko do odczytu: nic nie jest usuwane i nic nie jest publikowane.',
  'billing.ui.cancelBody':
    'Anulowanie to jedno działanie i następuje po upływie okresu, za który zapłaciłeś. Nie trzeba dzwonić ani wypełniać formularza.',
  'billing.ui.cancelStart': 'Anuluj subskrypcję',
  'billing.ui.cancelDialogTitle': 'Anuluj tę subskrypcję',
  'billing.ui.cancelConsequence.noCharge':
    'Nie zostaniesz obciążony opłatą. Nic nie zostało zrobione dzisiaj ani w dniu {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'Zachowujesz każdą funkcję do {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Wersje robocze, rachunki, multimedia i analizy pozostają w tym obszarze roboczym.',
  'billing.ui.cancelConsequence.scheduled':
    'Posty zaplanowane po {date} nie zostanie opublikowany. Anuluj je lub przełóż wcześniej.',
  'billing.ui.cancelConsequence.restart':
    'Możesz w dowolnym momencie rozpocząć subskrypcję ponownie.',
  'billing.ui.cancelConfirm': 'Anuluj subskrypcję',
  'billing.ui.cancelKeep': 'Zachowaj subskrypcję',
  'billing.ui.cancelConfirmedBeforeConversion': 'Anulowano. Nie zostaniesz obciążony żadną opłatą.',
  'billing.ui.cancelConfirmedAfterConversion': 'Anulowano. Dostęp trwa do {date}.',
  'billing.ui.cancelAnnouncement': 'Subskrypcja anulowana.',
  'billing.ui.canceledNotice': 'Ta subskrypcja została anulowana.',
  'billing.ui.resume': 'Rozpocznij subskrypcję ponownie',
  'billing.ui.noSubscriptionTitle': 'Brak subskrypcji w tym obszarze roboczym',
  'billing.ui.noSubscriptionBody':
    'Rozpocznij siedmiodniowy okres próbny, aby opublikować. Polar wybiera dzisiaj metodę płatności i nie pobiera żadnych opłat.',
  'billing.ui.noSubscriptionExample':
    'Miesięczny koszt wynosi 29 USD. Roczna opłata wynosi 300 USD, co stanowi opłatę roczną w wysokości 25 USD miesięcznie. Zaoszczędź 48 USD rocznie.',
  'billing.ui.overChannelLimitAction': 'Przejrzyj połączone kanały',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'Odpowiedz na krótką ankietę, potwierdź to, co zrozumieliśmy i uzyskaj plan, który możesz zaakceptować element po elemencie. Proponuje pracę. Nigdy nie planuje ani nie publikuje niczego samodzielnie.',
  'growth.ui.step.intake': 'Wlot',
  'growth.ui.step.confirm': 'Potwierdź',
  'growth.ui.step.plan': 'Plan',
  'growth.ui.stepIndicator': 'Krok {current} z {total}: {name}',
  'growth.ui.intake.section.product': 'Produkt',
  'growth.ui.intake.section.audience': 'Odbiorcy i rynki',
  'growth.ui.intake.section.objective': 'Cel',
  'growth.ui.intake.section.capacity': 'Kanały i pojemność',
  'growth.ui.intake.section.limits': 'Co jest zabronione',
  'growth.ui.intake.help':
    'Nic tutaj nie jest domyślone. Wszystko, co pozostawisz puste, zostanie oznaczone jako brakujące, a nie uzupełnione.',
  'growth.ui.intake.productNameHelp': 'Nazwa, której używasz w kontaktach z klientami.',
  'growth.ui.intake.siteUrlHelp':
    'Przeczytaliśmy stronę, którą nam podałeś jako materiał źródłowy. Potwierdzasz każdy fakt, który z tego wyciągamy.',
  'growth.ui.intake.descriptionHelp': 'Co sprzedajesz i dla kogo to jest, własnymi słowami.',
  'growth.ui.intake.marketsHelp': 'Kraje lub regiony. Po jednym w wierszu.',
  'growth.ui.intake.localesHelp': 'Języki, w których będziesz publikować.',
  'growth.ui.intake.objectiveHelp': 'Czego chcesz więcej w następnym kwartale.',
  'growth.ui.intake.conversionHelp': 'Akcja, którą możesz zmierzyć. Rejestracja, demo, zakup.',
  'growth.ui.intake.proofHelp':
    'Studia przypadków, przeprowadzone testy porównawcze, posiadane zrzuty ekranu, uprawnienia, które już posiadasz. Po jednym w wierszu.',
  'growth.ui.intake.proofNone': 'Nie mam jeszcze zatwierdzonego dowodu',
  'growth.ui.intake.proofNoneEffect':
    'Plan całkowicie pozwoli uniknąć wyników klientów i roszczeń wynikających z wyników.',
  'growth.ui.intake.channelsHelp': 'Konta, z których już publikujesz.',
  'growth.ui.intake.capacityHelp':
    'Bądź szczery. Plan, którego nie możesz zrealizować, nie jest planem.',
  'growth.ui.intake.competitorsHelp': 'Opcjonalnie. Po jednym w wierszu.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Roszczenia, których nie możesz zgłaszać ze względów prawnych lub politycznych. Po jednym w wierszu.',
  'growth.ui.intake.prohibitedTopicsHelp':
    'Tematy, od których należy trzymać się z daleka. Po jednym w wierszu.',
  'growth.ui.intake.submit': 'Przejrzyj, co zrozumieliśmy',
  'growth.ui.intake.savedAnnouncement': 'Profil firmy został zapisany.',
  'growth.ui.intake.requiredMissing':
    'Wypełnij pola oznaczone jako wymagane, zanim przejdziesz dalej.',

  'growth.ui.confirm.factsTitle': 'Fakty, które potwierdziłeś',
  'growth.ui.confirm.factsHelp': 'Można ich użyć w kopii.',
  'growth.ui.confirm.assumptionsTitle': 'Przyjęte przez nas założenia',
  'growth.ui.confirm.assumptionsHelp':
    'To nie są fakty. Kształtują plan, ale nigdy nie stają się żądaniem w poście.',
  'growth.ui.confirm.missingTitle': 'Brakuje',
  'growth.ui.confirm.missingHelp':
    'Plan uwzględnia każdy z nich i mówi o tym tam, gdzie ma to znaczenie.',
  'growth.ui.confirm.confidence.label': 'Pewność: {level}',
  'growth.ui.confirm.confidence.low': 'niski',
  'growth.ui.confirm.confidence.medium': 'średni',
  'growth.ui.confirm.confidence.high': 'wysoki',
  'growth.ui.confirm.promote': 'Potwierdź jako fakt',
  'growth.ui.confirm.correct': 'Popraw to',
  'growth.ui.confirm.correctLabel': 'Twoja poprawka',
  'growth.ui.confirm.generate': 'Wygeneruj plan',
  'growth.ui.confirm.announcement': 'Profil działalności potwierdzony.',

  'growth.ui.plan.generatingBody':
    'To zajmuje kilka sekund. Możesz opuścić tę stronę: plan kończy się sam.',
  'growth.ui.plan.stateDraft': 'Wersja robocza, niezatwierdzona',
  'growth.ui.plan.stateApproved': 'Zatwierdzono',
  'growth.ui.plan.stateSuperseded': 'Zastąpione nowszą wersją',
  'growth.ui.plan.newVersionNotice':
    'Odświeżenie tworzy wersję {version} i pozostawia zatwierdzoną wersję bez zmian.',
  'growth.ui.plan.emptyTitle': 'Nie ma jeszcze planu',
  'growth.ui.plan.emptyBody':
    'Wypełnij profil działalności, a my zbudujemy plan na podstawie potwierdzonych przez Ciebie faktów.',
  'growth.ui.plan.emptyExample':
    'Plan zawiera strategię, cztery tygodnie briefingów, jedną kampanię UGC, możliwości wspierane przez katalog i maksymalnie pięć narzędzi.',
  'growth.ui.plan.tabsLabel': 'Zaplanuj przekroje',
  'growth.ui.plan.modelNote':
    'Wygenerowane przez {model}, podpowiedź {promptVersion}, w dniu {date}.',

  'growth.ui.strategy.snapshotTitle': 'Migawka biznesowa',
  'growth.ui.strategy.channelPriority': 'Priorytet {rank}',
  'growth.ui.strategy.channelFormats': 'Formaty natywne',
  'growth.ui.strategy.pillarProof': 'Dowód, że ten filar opiera się na',
  'growth.ui.strategy.pillarProofNone': 'Brak zatwierdzonego dowodu. Zachowaj opis tego filaru.',
  'growth.ui.strategy.cadenceCaption': 'Posty tygodniowo według kanału',
  'growth.ui.strategy.cadenceColumn.channel': 'Kanał',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Posty tygodniowo',
  'growth.ui.strategy.cadenceTotal': 'Łącznie na tydzień',
  'growth.ui.strategy.capacityWarning':
    'Ta kadencja to {planned} publikuje posty tygodniowo przy określonej liczbie {capacity} godzin. Zmniejsz go lub zwiększ pojemność w profilu.',
  'growth.ui.strategy.measurementBody':
    'W porównaniu z Twoimi końcowymi postami na tym samym kanale i w tym samym formacie. Nie stosuje się żadnego zewnętrznego testu porównawczego, ponieważ żaden nie jest porównywalny z Twoim kontem.',
  'growth.ui.strategy.localeAdaptations': 'Notatki językowe',

  'growth.ui.fourWeek.caption': 'Proponowane briefy według tygodnia i dnia',
  'growth.ui.fourWeek.column.date': 'Data',
  'growth.ui.fourWeek.column.channel': 'Kanał',
  'growth.ui.fourWeek.column.pillar': 'Filar',
  'growth.ui.fourWeek.column.format': 'Format',
  'growth.ui.fourWeek.column.brief': 'Krótkie',
  'growth.ui.fourWeek.column.cta': 'Wezwanie do działania',
  'growth.ui.fourWeek.column.measurement': 'Znacznik pomiarowy',
  'growth.ui.fourWeek.column.actions': 'Działania',
  'growth.ui.fourWeek.approvalRequired': 'Wymagana zgoda przed publikacją',
  'growth.ui.fourWeek.approvalNotRequired': 'To konto nie wymaga zgody',
  'growth.ui.fourWeek.noCta': 'Brak wezwania do działania',
  'growth.ui.fourWeek.weekEmpty': 'Nie zaproponowano żadnych briefów na ten tydzień.',
  'growth.ui.fourWeek.acceptedCount':
    '{accepted} z {total} majtki zaakceptowane jako wersje robocze',
  'growth.ui.fourWeek.acceptAnnouncement': 'Wersja robocza utworzona na podstawie tego briefu.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Dodano propozycję kalendarza dla {date}.',

  'growth.ui.ugc.promptAngle': 'Kąt {number}',
  'growth.ui.ugc.checklistTitle': 'Prawa, zgoda i ujawnianie informacji',
  'growth.ui.ugc.checklistHelp':
    'Przeanalizuj to z każdym uczestnikiem, zanim cokolwiek zostanie opublikowane. Zgoda na pojawienie się nie jest zgodą na reklamę.',
  'growth.ui.ugc.incentiveNone': 'Brak oferty zachęty',
  'growth.ui.ugc.incentiveDisclosure':
    'Zachęta musi zostać ujawniona w każdym poście, który z niej wynika, zarówno przez Ciebie, jak i przez uczestnika.',
  'growth.ui.ugc.honesty':
    'To planuje kampanię, którą prowadzisz z prawdziwymi ludźmi. Przekaźnik nie znajduje twórców, nie kontaktuje się z nimi, nie pisze opinii ani nie tworzy treści klientów.',

  'growth.ui.opportunities.caption':
    'Zweryfikowane możliwości z katalogu, uszeregowane według dopasowania do Twojego profilu',
  'growth.ui.opportunities.column.opportunity': 'Możliwość',
  'growth.ui.opportunities.column.type': 'Typ',
  'growth.ui.opportunities.column.audience': 'Odbiorcy',
  'growth.ui.opportunities.column.fit': 'Dlaczego to pasuje',
  'growth.ui.opportunities.column.requirements': 'Wymagania',
  'growth.ui.opportunities.column.rules': 'Zasady autopromocji',
  'growth.ui.opportunities.column.cost': 'Koszt',
  'growth.ui.opportunities.column.effort': 'Wysiłek',
  'growth.ui.opportunities.column.verified': 'Ostatnia weryfikacja',
  'growth.ui.opportunities.column.actions': 'Działania',
  'growth.ui.opportunities.costFree': 'Bezpłatny',
  'growth.ui.opportunities.effort.low': 'Niski',
  'growth.ui.opportunities.effort.medium': 'Średni',
  'growth.ui.opportunities.effort.high': 'Wysoki',
  'growth.ui.opportunities.noRequiredAsset': 'Nie jest wymagany żaden zasób',
  'growth.ui.opportunities.prepareTitle': 'Przygotuj zgłoszenie do {name}',
  'growth.ui.opportunities.prepareRules': 'Ich zasady, cytowane',
  'growth.ui.opportunities.prepareChecklist': 'Co przygotować',
  'growth.ui.opportunities.prepareManual':
    'Przesyłasz to samodzielnie na ich stronie. Relay nie wypełnia formularzy, nie tworzy kont ani nie wysyła e-maili do nikogo.',
  'growth.ui.opportunities.pitchTitle': 'Projekt prezentacji',
  'growth.ui.opportunities.pitchHelp':
    'Edytuj go przed wysłaniem. Wykorzystuje tylko potwierdzone przez Ciebie fakty.',
  'growth.ui.opportunities.submittedOn': 'Przesłano {date}',
  'growth.ui.opportunities.staleTitle': 'Niektóre wpisy wymagają ponownej weryfikacji',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# minęła data recenzji wpisu} other {# data przeglądu wpisów minęła} few {# data przeglądu wpisów minęła} many {# data przeglądu wpisów minęła}}. Zanim zaczniesz na nich polegać, sprawdź aktualne zasady na stronie.',
  'growth.ui.opportunities.emptyExample':
    'Wiersz katalogu zawiera oficjalny adres URL, odbiorców, zasady przesyłania cytowane z witryny, koszt, wysiłek i datę ostatniego sprawdzania przez osobę.',

  'growth.ui.tools.shown': '{shown} z {max} pokazano',
  'growth.ui.tools.fewerThanMax':
    'Tylko {count, plural, one {# narzędzie pasuje} other {# dopasowanie narzędzi} few {# dopasowanie narzędzi} many {# dopasowanie narzędzi}} ten przepływ pracy z aktualną recenzją. Wolelibyśmy pokazać mniej niż uzupełniać listę.',
  'growth.ui.tools.emptyTitle':
    'Żadne sprawdzone narzędzie nie pasuje jeszcze do tego przepływu pracy',
  'growth.ui.tools.emptyBody':
    'Każdy wpis wymaga sprawdzenia ceny, sprawdzonych warunków praw i nazwanego ograniczenia, zanim pojawi się tutaj.',
  'growth.ui.tools.emptyExample':
    'Wpis mówi, do czego jest najlepszy, dlaczego pasuje do Twojego planu, czego nie może zrobić, jakich umiejętności potrzebuje, w jaki sposób dane wyjściowe wracają do Relay i kiedy ostatni raz sprawdzano cenę.',
  'growth.ui.tools.openSite': 'Otwórz oficjalną stronę dla {name}',
  'growth.ui.tools.stale': 'Minęła data przeglądu. Wykluczono z wygenerowanych planów.',

  'growth.ui.item.explainTitle': 'Dlaczego to zasugerowano',
  'growth.ui.item.explainEvidence': 'Na czym się opiera',
  'growth.ui.item.explainNoEvidence':
    'Wynika to z celu i zasad kanału, a nie z potwierdzonego faktu na temat Twojej firmy.',
  'growth.ui.item.dismissTitle': 'Odrzuć tę sugestię',
  'growth.ui.item.dismissBody':
    'Powiedz nam dlaczego. Powód jest przechowywany w planie i kształtuje następną wersję.',
  'growth.ui.item.dismissReasonLabel': 'Powód',
  'growth.ui.item.dismissReason.notRelevant': 'Nie dotyczy tej firmy',
  'growth.ui.item.dismissReason.noCapacity': 'Nie mamy możliwości',
  'growth.ui.item.dismissReason.wrongAudience': 'Niewłaściwi odbiorcy',
  'growth.ui.item.dismissReason.alreadyDone': 'Już to robimy',
  'growth.ui.item.dismissReason.policy': 'Niezgodne z naszymi zasadami lub roszczeniami',
  'growth.ui.item.dismissReason.other': 'Coś innego',
  'growth.ui.item.dismissNote': 'Cokolwiek chcesz dodać',
  'growth.ui.item.dismissed': 'Zwolniony. Pozostaje widoczny, więc możesz go cofnąć.',
  'growth.ui.item.undoDismiss': 'Cofnij zamknięcie',

  'growth.ui.export.title': 'Eksportuj ten plan',
  'growth.ui.export.formatLabel': 'Format',
  'growth.ui.export.copy': 'Skopiuj do schowka',
  'growth.ui.export.download': 'Pobierz plik',
  'growth.ui.export.copied': 'Plan skopiowany do schowka.',
  'growth.ui.export.schemaNote':
    'Wszystkie trzy formaty pochodzą z jednego zatwierdzonego schematu, wersja {version}. Widoki strukturalne są bezpieczne dla kontroli źródła i nie zawierają żadnych tajemnic.',
  'growth.ui.export.previewLabel': 'Podgląd eksportu',
} as const;
