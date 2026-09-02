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
  'shell.appName': 'Przekaźnik',
  'shell.documentTitle': '{page} · Przekaźnik',
  'shell.tagline': 'Punkt wydawniczy dla ludzi i agentów.',
  'shell.menu.open': 'Otwórz menu',
  'shell.menu.title': 'Menu',
  'shell.nav.more': 'Więcej',
  'shell.help.title': 'Pomoc',
  'shell.help.documentation': 'Dokumentacja',
  'shell.help.keyboardShortcuts': 'Skróty klawiaturowe',
  'shell.help.platformStatus': 'Stan platformy',
  'shell.help.whatChanged': 'Co się zmieniło',
  'shell.help.contactSupport': 'Skontaktuj się z pomocą techniczną',
  'shell.account.settings': 'Ustawienia',
  'shell.account.profile': 'Twój profil',
  'shell.workspace.create': 'Utwórz obszar roboczy',
  'shell.workspace.manage': 'Ustawienia obszaru roboczego',
  'shell.workspace.role': 'Jesteś {role} tutaj',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Dane demonstracyjne',
  'shell.demo.title': 'Przeglądasz dane demonstracyjne',
  'shell.demo.body':
    'Interfejs API Post Array nie jest dostępny z tej przeglądarki, dlatego ekrany są wypełnione przykładowym obszarem roboczym z rozstawionymi źródłami. Nic tutaj nie jest połączone z prawdziwym kontem i nic nie może zostać opublikowane.',
  'shell.demo.howToConnect':
    'Ustaw NEXT_PUBLIC_POSTARRAY_API_URL i uruchom ponownie aplikację, aby korzystać z bieżących danych.',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Jesteś offline',
  'shell.offline.body':
    'Wersje robocze są przechowywane na tym urządzeniu. Planowanie i publikowanie zostaną wznowione po przywróceniu połączenia.',
  'shell.offline.retry': 'Sprawdź połączenie',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Otwórz paletę poleceń',
  'palette.title': 'Paleta poleceń',
  'palette.description': 'Wyszukaj ekran, konto lub akcję.',
  'palette.placeholder': 'Wpisz polecenie lub nazwę ekranową',
  'palette.empty': 'Nic nie pasuje {query}.',
  'palette.group.actions': 'Działania',
  'palette.group.goTo': 'Przejdź do',
  'palette.group.workspaces': 'Przestrzenie robocze',
  'palette.group.settings': 'Ustawienia',
  'palette.hint.navigate': 'Poruszaj się za pomocą klawiszy strzałek',
  'palette.hint.select': 'Otwórz za pomocą Enter',
  'palette.hint.close': 'Zamknij za pomocą ucieczki',
  'palette.action.compose': 'Napisz post',
  'palette.action.connectAccount': 'Połącz konto',
  'palette.action.openActionCenter': 'Otwórz Centrum akcji',
  'palette.action.uploadMedia': 'Prześlij multimedia',
  'palette.action.createRule': 'Utwórz regułę automatyzacji',
  'palette.action.toggleTheme': 'Przełącz motyw',
  'palette.action.signOut': 'Wyloguj się',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Otwórz Centrum akcji',
  'actionCenter.group.now.label': 'Teraz',
  'actionCenter.group.soon.label': 'Wkrótce',
  'actionCenter.group.watching.label': 'Oglądanie',
  'actionCenter.group.now.hint': 'Publikowanie jest zagrożone, dopóki nie zostaną rozwiązane.',
  'actionCenter.group.soon.hint': 'Mają termin, którego nadal możesz dotrzymać.',
  'actionCenter.group.watching.hint': 'Niepilne. Warto zajrzeć w tym tygodniu.',
  'actionCenter.severity.now': 'Potrzebuję Cię teraz',
  'actionCenter.severity.soon': 'Potrzebuje Cię wkrótce',
  'actionCenter.severity.watching': 'Oglądanie',
  'actionCenter.filter.all': 'Wszystkie',
  'actionCenter.filter.connections': 'Połączenia',
  'actionCenter.filter.publishing': 'Publikowanie',
  'actionCenter.filter.automation': 'Automatyzacja',
  'actionCenter.filter.billing': 'Rozliczenia',
  'actionCenter.snoozed': 'Odłożone',
  'actionCenter.snoozeOneDay': 'Odłóż na jeden dzień',
  'actionCenter.snoozedUntil': 'Odłożone do {date}',
  'actionCenter.unsnooze': 'Przynieś to z powrotem',
  'actionCenter.resolved': 'Rozwiązano {relativeTime}',
  'actionCenter.emptyFiltered': 'Nic w tej grupie nie wymaga uwagi.',
  'actionCenter.errorTitle': 'Centrum akcji nie mogło się załadować',
  'actionCenter.loading': 'Ładowanie tego, co wymaga uwagi',
  'actionCenter.affectedAccount': 'Wpływa na {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Nic nie wymaga uwagi} one {# przedmiot} other {# elementy} few {# elementy} many {# elementy}}',
  'actionCenter.action.reconnect': 'Połącz ponownie',
  'actionCenter.action.openReceipt': 'Otwórz paragon',
  'actionCenter.action.review': 'Recenzja',
  'actionCenter.action.openDraft': 'Otwórz wersję roboczą',
  'actionCenter.action.openCalendar': 'Otwórz kalendarz',
  'actionCenter.action.viewStatus': 'Wyświetl stan',
  'actionCenter.action.checkFeed': 'Sprawdź kanał',
  'actionCenter.action.inspectDeliveries': 'Sprawdź dostawy',
  'actionCenter.action.addBalance': 'Przejrzyj wykorzystanie',
  'actionCenter.action.fixConnection': 'Napraw połączenie',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Strona główna',
  'home.subtitle': 'Czego potrzebujesz dzisiaj i co będzie dalej.',
  'home.greetingSummary':
    '{actions, plural, =0 {Nic cię teraz nie potrzebuje} one {# przedmiot cię potrzebuje} other {# przedmioty cię potrzebują} few {# przedmioty cię potrzebują} many {# przedmioty cię potrzebują}}. {upcoming, plural, =0 {W ciągu najbliższych 24 godzin nie zaplanowano niczego} one {# post zostanie opublikowany w ciągu najbliższych 24 godzin} other {# posty zostaną opublikowane w ciągu najbliższych 24 godzin} few {# posty zostaną opublikowane w ciągu najbliższych 24 godzin} many {# posty zostaną opublikowane w ciągu najbliższych 24 godzin}}.',
  'home.needsYou.title': 'Potrzebuję Cię teraz',
  'home.needsYou.empty': 'Nic cię teraz nie potrzebuje.',
  'home.needsYou.emptyBody':
    'Stan połączenia, zatwierdzenia i nieudane publikacje pojawiają się tutaj w chwili ich wystąpienia.',
  'home.needsYou.viewAll': 'Otwórz Centrum akcji',
  'home.needsYou.emptyQuiet':
    'Ciesz się ciszą. Wszystko, co wymaga decyzji, pojawi się tutaj, gdy tylko będzie potrzebne.',
  'home.upcoming.title': 'Następne 24 godziny',
  'home.upcoming.empty': 'W ciągu najbliższych 24 godzin nie zaplanowano niczego.',
  'home.upcoming.emptyBody': 'Napisz post i wybierz godzinę. Możesz to zmienić później.',
  'home.upcoming.viewAll': 'Otwórz kalendarz',
  'home.upcoming.timeZoneNote': 'Czasy są wyświetlane w {timeZone}, strefa obszaru roboczego.',
  'home.upcoming.columnTime': 'Czas',
  'home.upcoming.columnAccount': 'Konto',
  'home.upcoming.columnContent': 'Treść',
  'home.upcoming.columnStatus': 'Stan',
  'home.receipts.title': 'Ostatnie rachunki',
  'home.receipts.empty': 'Z tego obszaru roboczego nie opublikowano jeszcze żadnych postów.',
  'home.receipts.emptyBody':
    'Każda publikacja zawiera paragon, który możesz sprawdzić i udostępnić.',
  'home.receipts.viewAll': 'Wszystkie rachunki',
  'home.receipts.publishedTo': 'Opublikowano w {account}',
  'home.connections.title': 'Stan połączenia',
  'home.connections.summary':
    '{healthy, plural, one {# konto działa} other {# konta działają} few {# konta działają} many {# konta działają}}. {attention, plural, =0 {Żaden nie wymaga uwagi} one {# wymaga uwagi} other {# wymaga uwagi} few {# wymaga uwagi} many {# wymaga uwagi}}.',
  'home.connections.viewAll': 'Wszystkie połączenia',
  'home.connections.empty': 'Żadne konta nie są jeszcze połączone.',
  'home.advisor.title': 'Doradca ds. rozwoju',
  'home.advisor.summary':
    'Wersja planu {version} został zatwierdzony {date}. Tydzień {week} z {total} ma {briefs, plural, one {# brief jeszcze nie sporządzony} other {# wytyczne nie zostały jeszcze opracowane} few {# wytyczne nie zostały jeszcze opracowane} many {# wytyczne nie zostały jeszcze opracowane}}.',
  'home.advisor.noPlan':
    'Doradca buduje plan na podstawie faktów, które potwierdzasz. Proponuje pracę i nigdy nie publikuje samodzielnie.',
  'home.advisor.openPlan': 'Otwórz plan',
  'home.advisor.createDrafts': 'Utwórz wersje robocze z tygodnia {week}',
  'home.advisor.start': 'Rozpocznij profil biznesowy',
  'home.trial.banner':
    'Próba, {days, plural, =0 {kończy się dzisiaj} one {# pozostał dzień} other {# pozostało dni} few {# pozostało dni} many {# pozostało dni}}. Konwertuje {date} do {amount}.',
  'home.trial.manage': 'Zarządzaj lub anuluj',
  'home.error.title': 'Nie można załadować strony głównej',
  'home.error.body':
    'Twój obszar roboczy jest nienaruszony. Jest to problem z dostępem do API Post Array.',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title':
    'Opublikuj za pośrednictwem oficjalnych interfejsów API i zobacz dokładnie, co się stało.',
  'auth.aside.point.receipts':
    'Każda publikacja zawiera potwierdzenie: kto ją zatwierdził, kiedy została wysłana, co zwróciła platforma.',
  'auth.aside.point.approvals':
    'Nic nie dociera na platformę bez zgody wymaganej przez Twoją politykę.',
  'auth.aside.point.surfaces':
    'Ten sam przepływ pracy w aplikacji internetowej, REST API, MCP, CLI i webhookach.',
  'auth.provider.title': 'Zanim będziesz kontynuować',
  'auth.provider.google.access':
    'Google udostępnia Post Array Twoje imię i nazwisko, adres e-mail i zdjęcie profilowe. Przekaźnik nie może odczytać Twojego Gmaila, Dysku ani Kalendarza.',
  'auth.provider.facebook.access':
    'Facebook udostępnia Post Array Twoje imię i nazwisko, adres e-mail i zdjęcie profilowe. Podłączenie strony, na której chcesz publikować, to osobny krok, który zatwierdzasz później.',
  'auth.provider.note': 'To oznacza logowanie. Nie łączy konta, na którym można publikować.',
  'auth.continueWithEmail': 'Kontynuuj, wysyłając e-mail',
  'auth.method.password': 'Hasło',
  'auth.method.magicLink': 'Link e-mailowy',
  'auth.method.username': 'Nazwa użytkownika',
  'auth.method.chooseLabel': 'Jak chcesz się zalogować?',
  'auth.username.placeholder': 'twoja-nazwa użytkownika',
  'auth.username.aliasNote':
    'Nazwa użytkownika to alias adresu e-mail na Twoim koncie. Hasło jest takie samo.',
  'auth.password.placeholder': 'Twoje hasło',
  'auth.submit.signIn': 'Zaloguj się',
  'auth.submit.signUp': 'Utwórz konto',
  'auth.submit.working': 'Sprawdzanie',
  'auth.failure.credentials':
    'Ten adres e-mail i hasło nie pasują do konta. Sprawdź oba i spróbuj ponownie.',
  'auth.failure.usernameCredentials':
    'Ta nazwa użytkownika i hasło nie pasują do konta. Sprawdź oba i spróbuj ponownie.',
  'auth.failure.noAccountLeak':
    'Dla Twojego bezpieczeństwa nie podajemy, czy adres jest zarejestrowany.',
  'auth.failure.provider':
    'Zaloguj się za pomocą {provider} nie został ukończony. Nic nie zostało zmienione.',
  'auth.failure.network':
    'Nie udało nam się połączyć z przekaźnikiem. Sprawdź połączenie i spróbuj ponownie.',
  'auth.signUp.emailInUseNote':
    'Jeśli pod tym adresem istnieje już konto, zamiast tworzyć drugie, wyślemy e-mailem link do logowania.',
  'auth.legal.readTerms': 'Przeczytaj Warunki',
  'auth.legal.readPrivacy': 'Przeczytaj Politykę prywatności',
  'auth.switchToSignUp': 'Utwórz konto',
  'auth.switchToSignIn': 'Zaloguj się zamiast tego',
  'auth.checkEmail.body': 'Wysłaliśmy link do logowania do {email}. Działa raz.',
  'auth.checkEmail.wrongAddress': 'Użyj innego adresu',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Rozliczenia',
  'onboarding.stepName.workspace': 'Przestrzeń robocza',
  'onboarding.stepName.role': 'Przypadek użycia',
  'onboarding.stepName.connect': 'Połącz',
  'onboarding.stepName.compose': 'Pierwszy post',
  'onboarding.stepName.receipt': 'Potwierdzenie',
  'onboarding.stepList': 'Etapy konfiguracji',
  'onboarding.stepComplete': 'Gotowe',
  'onboarding.stepCurrent': 'Bieżący krok',
  'onboarding.exit': 'Zakończ później',
  'onboarding.plan.intervalMonthlyLabel': '29 USD miesięcznie',
  'onboarding.plan.intervalAnnualLabel': '300 USD rocznie',
  'onboarding.plan.checkoutHint':
    'Następny ekran to Polar, nasz rekordowy sprzedawca. Dostęp jest przyznawany, gdy Polar potwierdzi subskrypcję, a nie po ponownym uruchomieniu przeglądarki.',
  'onboarding.plan.factsTitle': 'Co się stanie, jeśli będziesz kontynuować',
  'onboarding.workspace.help':
    'Obszar roboczy przechowuje Twoje projekty, połączone konta, wersje robocze i rachunki. Możesz utworzyć więcej później.',
  'onboarding.workspace.localeNote':
    'Twój język interfejsu zmienia tę aplikację. Języki treści są wybierane dla poszczególnych postów i są niezależne od tego ustawienia.',
  'onboarding.workspace.timeZoneDetected': 'Wykryto na tym urządzeniu: {timeZone}',
  'onboarding.connect.permissionsTitle': 'Co {provider} zostanie poproszony o',
  'onboarding.connect.permissionsFooter':
    'Przekaźnik nigdy nie pyta o pozwolenie, z którego nie korzysta i możesz się rozłączyć w dowolnym momencie.',
  'onboarding.connect.chooseProvider': 'Wybierz platformę',
  'onboarding.connect.opensProvider': 'Kontynuacja otwiera {provider} w tej zakładce.',
  'onboarding.compose.help':
    'Napisz post, a następnie sprawdź podgląd i weryfikację, zanim wybierzesz godzinę.',
  'onboarding.compose.openComposer': 'Otwórz pełny kompozytor',
  'onboarding.receipt.title': 'Twój pierwszy post został zaplanowany',
  'onboarding.receipt.body':
    'Oto dotychczasowy rekord. Aktualizuje się poprzez wysyłkę, odpowiedź dostawcy i pierwszą synchronizację analityczną.',
  'onboarding.receipt.goHome': 'Idź do strony głównej',
  'onboarding.blocked.title': 'Ten krok wymaga poprzedniego',
  'onboarding.blocked.body': 'Zakończ {step} najpierw. Nic, co wpisałeś, nie zostanie utracone.',
} as const;
