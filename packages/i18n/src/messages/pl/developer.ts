/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Agenci i API',
  'developer.subtitle':
    'Interfejs API, serwer MCP i interfejs CLI korzystają z tych samych uprawnień, zasad zatwierdzania i potwierdzeń co aplikacja.',

  'developer.serviceAccount.title': 'Konta usług',
  'developer.serviceAccount.create': 'Utwórz konto usługi',
  'developer.serviceAccount.name': 'Nazwa',
  'developer.serviceAccount.scopeProjects': 'Projekty i konta, z których może korzystać',
  'developer.serviceAccount.scopePlatforms': 'Platformy',
  'developer.serviceAccount.scopeLocales': 'Języki treści',
  'developer.serviceAccount.scopeDomains': 'Dozwolone domeny linków',
  'developer.serviceAccount.scopeHours': 'Dozwolone godziny',
  'developer.serviceAccount.scopeCadence': 'Maksymalna liczba postów dziennie',
  'developer.serviceAccount.scopeLookAhead': 'Jak daleko do przodu może zaplanować',
  'developer.serviceAccount.approvalLevel': 'Poziom zatwierdzenia',
  'developer.serviceAccount.killSwitch': 'Zatrzymaj tego agenta',

  'developer.approvalLevel.0': 'Tylko przeczytaj i zatwierdź',
  'developer.approvalLevel.1': 'Twórz i edytuj wersje robocze',
  'developer.approvalLevel.2': 'Harmonogram mieszczący się w granicach określonych powyżej',
  'developer.approvalLevel.3': 'Zapytaj osobę przed publikacją',
  'developer.approvalLevel.description.0':
    'Agent może przeglądać konta, możliwości, kalendarze i analizy. To niczego nie zmienia.',
  'developer.approvalLevel.description.1':
    'Agent może pisać wersje robocze. Osoba nadal planuje i publikuje.',
  'developer.approvalLevel.description.2':
    'Agent może planować w ramach ustawionych kont, godzin, rytmu, języków i domen oraz patrzeć w przyszłość. Wszystko poza tymi granicami wymaga osoby.',
  'developer.approvalLevel.description.3':
    'Natychmiastowa publikacja, nowe konto lub domena, działanie zbiorcze, poufne treści lub zmiana ustawień prywatności zawsze wymagają wyraźnego potwierdzenia od danej osoby.',
  'developer.bulkThreshold':
    'Masowo oznacza więcej niż {publications, plural, one {# publikacja zewnętrzna} other {# publikacje zewnętrzne} few {# publikacje zewnętrzne} many {# publikacje zewnętrzne}} w jednym żądaniu lub tę samą treść do więcej niż {accounts, plural, one {# konto} other {# konta} few {# konta} many {# konta}}.',

  'developer.credential.title': 'Poświadczenia',
  'developer.credential.create': 'Utwórz klucz API',
  'developer.credential.shownOnce':
    'To dane uwierzytelniające są wyświetlane raz. Skopiuj go teraz. Przechowujemy tylko jego skrót.',
  'developer.credential.prefix': 'Przedrostek',
  'developer.credential.created': 'Utworzono {date} autorstwa {name}',
  'developer.credential.lastUsed': 'Ostatnio użyte {relativeTime}',
  'developer.credential.neverUsed': 'Nigdy nie używany',
  'developer.credential.expires': 'Wygasa {date}',
  'developer.credential.revokeConfirm':
    'Unieważnić to uwierzytelnienie? Wszystko, co go używa, natychmiast przestaje działać.',

  'developer.scope.title': 'Zakresy',
  'developer.scope.accountsRead': 'Przeczytaj połączone konta i ich możliwości',
  'developer.scope.draftsWrite': 'Twórz i edytuj wersje robocze',
  'developer.scope.postsSchedule': 'Zaplanuj zatwierdzoną treść',
  'developer.scope.postsPublish': 'Opublikuj natychmiast',
  'developer.scope.analyticsRead': 'Przeczytaj statystyki',
  'developer.scope.receiptsRead': 'Przeczytaj potwierdzenia publikacji',
  'developer.scope.webhooksWrite': 'Zarządzaj webhookami',
  'developer.scope.connectionsAdmin': 'Podłącz i rozłącz konta',
  'developer.scope.billingRead': 'Przeczytaj stan rozliczeń',
  'developer.scope.consequential': 'Wynikowe',
  'developer.scope.readOnly': 'Tylko do odczytu',

  'developer.setup.title': 'Połącz klienta',
  'developer.setup.claudeCode': 'Kod Claude',
  'developer.setup.codex': 'Kodeks',
  'developer.setup.hermes': 'Hermes',
  'developer.setup.buzz': 'Przepływ pracy Buzz',
  'developer.setup.cli': 'CLI',
  'developer.setup.genericMcp': 'Dowolny klient MCP',
  'developer.setup.copyConfig': 'Kopiuj konfigurację',
  'developer.setup.mcpEndpoint': 'Punkt końcowy MCP',
  'developer.setup.apiBaseUrl': 'Podstawowy adres URL API',

  'developer.playground.title': 'Próba próbna',
  'developer.playground.description':
    'Uruchom narzędzia na podstawie danych zaszczepionych. Nic nie dociera do prawdziwej platformy.',
  'developer.playground.run': 'Uruchom',
  'developer.playground.sandboxBadge': 'Piaskownica',

  'developer.activity.title': 'Ostatnia aktywność',
  'developer.activity.toolCall': '{tool} wywołany przez {actor} {relativeTime}',
  'developer.activity.denied': 'Odrzucono: {reason}',
  'developer.activity.empty': 'Brak jeszcze połączeń.',
  'developer.activity.redacted':
    'Treści żądań i odpowiedzi są przechowywane z usuniętymi wpisami tajnymi.',

  'developer.apps.title': 'Aplikacje dla programistów',
  'developer.apps.subtitle':
    'Pozwól innemu produktowi działać poprzez Relay z uprawnieniami przyznanymi mu przez użytkownika.',
  'developer.apps.create': 'Zarejestruj aplikację',
  'developer.apps.name': 'Nazwa aplikacji',
  'developer.apps.type.label': 'Typ klienta',
  'developer.apps.type.public': 'Publiczne, nie można zachować tajemnicy',
  'developer.apps.type.confidential': 'Poufne, działa na serwerze',
  'developer.apps.homepage': 'URL strony głównej',
  'developer.apps.privacyUrl': 'URL polityki prywatności',
  'developer.apps.termsUrl': 'URL Warunków',
  'developer.apps.logo': 'Logo',
  'developer.apps.redirectUris': 'Identyfikatory URI przekierowania',
  'developer.apps.redirectUrisHelp':
    'Tylko dokładne dopasowania. Symbole wieloznaczne i częściowe ścieżki są odrzucane.',
  'developer.apps.clientId': 'Identyfikator klienta',
  'developer.apps.clientSecret': 'Tajny sekret klienta',
  'developer.apps.secretShownOnce':
    'Sekret pokazany jest raz. Obróć go, jeśli go zgubisz. Nie będziemy tego więcej pokazywać.',
  'developer.apps.status.draft': 'Wersja robocza',
  'developer.apps.status.active': 'Aktywny',
  'developer.apps.status.disabled': 'Wyłączone',
  'developer.apps.consentPreview': 'Podgląd ekranu zgody',
  'developer.apps.grants.title': 'Aktywne dotacje',
  'developer.apps.grants.count':
    '{count, plural, one {# dotacja} other {# dotacje} few {# dotacje} many {# dotacje}}',
  'developer.apps.deleteConfirm':
    'Usunąć tę aplikację? Każda dotacja zostaje cofnięta, a jej tokeny przestają działać.',

  'developer.consent.title': '{app} chce dostępu do Twojego obszaru roboczego',
  'developer.consent.workspace': 'Przestrzeń robocza',
  'developer.consent.projects': 'Projekty i konta',
  'developer.consent.willBeAbleTo': '{app} będzie mógł',
  'developer.consent.willNotBeAbleTo': '{app} nie będzie mógł',
  'developer.consent.approvalStillApplies':
    'Twoje zasady zatwierdzania nadal obowiązują. Ta aplikacja nie może publikować wokół niej.',
  'developer.consent.revokeAnyTime': 'Możesz to w każdej chwili odwołać w Ustawieniach.',
  'developer.consent.allow': 'Zezwalaj na dostęp',
  'developer.consent.deny': 'Nie zezwalaj',
  'developer.consent.developerIdentity': 'Opublikowane przez {developer}',

  'developer.grants.title': 'Aplikacje z dostępem',
  'developer.grants.grantedOn': 'Zgoda {date}',
  'developer.grants.lastUsed': 'Ostatnio użyte {relativeTime}',
  'developer.grants.revoke': 'Odbierz dostęp',
  'developer.grants.revoked':
    'Dostęp cofnięty. Nie ma to wpływu na Twoje własne połączenia i zaplanowane posty.',

  'developer.docs.openapi': 'Dokument OpenAPI',
  'developer.docs.clients': 'Wygenerowani klienci',
  'developer.docs.idempotency':
    'Wysyłaj klucz idempotencji przy każdym żądaniu utworzenia, zaplanowania i opublikowania. Powtórzenie żądania z tym samym kluczem zwraca oryginalny wynik zamiast podwójnej publikacji.',
  'developer.docs.pagination':
    'Wyniki są podzielone na strony kursorem. Czasy są określone i obejmują strefę.',
  'developer.docs.rateLimits':
    'Ograniczenia szybkości obowiązują dla obszaru roboczego, danych uwierzytelniających, trasy i łącznika.',
} as const;
