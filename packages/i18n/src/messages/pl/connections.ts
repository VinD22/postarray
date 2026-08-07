/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'Połączenia',
  'connection.subtitle': 'Konta, strony i kanały, na których ten obszar roboczy może publikować.',
  'connection.add': 'Połącz konto',
  'connection.count':
    '{used, plural, one {# aktywny kanał} other {# aktywne kanały} few {# aktywne kanały} many {# aktywne kanały}} z {limit}',
  'connection.limitReached':
    'W tym obszarze roboczym używane są wszystkie {limit} kanałów. Odłącz jedno przed podłączeniem drugiego.',

  'connection.account.label': 'Konto',
  'connection.account.type.profile': 'Profil',
  'connection.account.type.page': 'Strona',
  'connection.account.type.channel': 'Kanał',
  'connection.account.type.group': 'Grupa',
  'connection.account.type.organization': 'Organizacja',
  'connection.account.type.business': 'Konto firmowe',
  'connection.account.type.creator': 'Konto twórcy',
  'connection.connectedBy': 'Połączono przez {name} na {date}',
  'connection.lastPublished': 'Ostatnia publikacja {relativeTime}',
  'connection.lastPublishedNever': 'Nie opublikowano jeszcze nic z tego konta',
  'connection.lastAnalyticsSync': 'Zsynchronizowano statystyki {relativeTime}',

  'connection.status.healthy': 'Praca',
  'connection.status.expiringSoon': 'Wygasa {relativeTime}',
  'connection.status.expired': 'Dostęp wygasł',
  'connection.status.revoked': 'Dostęp cofnięty',
  'connection.status.paused': 'Wstrzymano',
  'connection.status.permissionMissing': 'Brak uprawnień',
  'connection.status.reviewPending': 'Oczekiwanie na recenzję platformy',
  'connection.status.unknown': 'Zdrowie niedostępne',

  'connection.token.expiresAt': 'Dostęp wygasa {date}',
  'connection.token.expiryUnknown': '{provider} nie informuje nas, kiedy ten dostęp wygasa.',

  'connection.permissions.title': 'Uprawnienia',
  'connection.permissions.granted': 'To prawda',
  'connection.permissions.missing': 'Nie przyznano',
  'connection.permissions.explainBeforeOAuth':
    'Przekaźnik zapyta {provider} dla tych uprawnień. Możesz rozłączyć się w dowolnym momencie.',
  'connection.permissions.whyNeeded': 'Dlaczego jest to potrzebne',

  'connection.reconnect.title': 'Połącz ponownie {account}',
  'connection.reconnect.body':
    'Zaplanowane posty na tym koncie zostaną wstrzymane do czasu jego ponownego połączenia. Nic straconego.',
  'connection.disconnect.title': 'Rozłącz {account}?',
  'connection.disconnect.body':
    'Zaplanowane posty dla tego konta nie zostaną opublikowane. Potwierdzenia i zebrane już statystyki pozostają w tym obszarze roboczym.',
  'connection.pause.body':
    'Wstrzymane konto zachowuje swoją historię i harmonogram, ale nie jest publikowane, dopóki nie zostanie wznowione.',

  'connection.incident.invalidToken':
    '{provider} odrzucił zapisany dostęp dla {account}. Połącz się ponownie, aby przywrócić publikowanie.',
  'connection.incident.permissionLost':
    '{account} nie zapewnia już {permission}. Połącz się ponownie i zaakceptuj to pozwolenie.',
  'connection.incident.roleLost':
    'Twoje {provider} użytkownik nie ma już roli w {account}. Poproś administratora tej strony o jej przywrócenie.',
  'connection.incident.accountTypeInvalid':
    'Instagram potrzebuje konta profesjonalnego. Przełącznik {account} do konta firmowego lub twórcy, a następnie połącz się ponownie.',
  'connection.incident.reviewRestricted':
    '{provider} ograniczył tę aplikację do czasu sprawdzenia. Posty z {account} publikuj prywatnie do zakończenia sprawdzania.',

  'connection.group.title': 'Grupy klientów',
  'connection.group.description':
    'Grupuj konta według klienta lub marki, aby filtrować każdy ekran.',
  'connection.group.assign': 'Przejdź do grupy',
  'connection.group.none': 'Rozgrupowane',
  'connection.group.moveNote':
    'Przeniesienie konta powoduje zachowanie wpisów, potwierdzeń i statystyk.',

  'connection.oauth.starting': 'Otwieranie {provider}',
  'connection.oauth.returned': 'Kończenie połączenia',
  'connection.oauth.chooseAccounts': 'Wybierz konta, które chcesz połączyć',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'Brak kont na tym {provider} login można podłączyć. {reason}',
  'connection.oauth.canceled':
    'Połączenie zostało anulowane w dniu {provider}. Nic się nie zmieniło.',
  'connection.oauth.alreadyConnected': '{account} jest już połączony z tym obszarem roboczym.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} jest podłączony do innego obszaru roboczego. Najpierw odłącz go tam.',

  'capability.title': 'Co obsługuje to konto',
  'capability.matrix.title': 'Możliwości platformy',
  'capability.matrix.subtitle':
    'Wygenerowano na podstawie definicji złączy, które utrzymujemy i sprawdzamy ręcznie.',
  'capability.level.supported': 'Obsługiwane',
  'capability.level.unsupported': 'Nie oferowane przez platformę',
  'capability.level.not_implemented': 'Jeszcze nie zbudowano',
  'capability.level.requires_review': 'Wymaga przeglądu platformy',
  'capability.level.beta': 'Beta',
  'capability.level.unknown': 'Niedostępne',
  'capability.explain.supported': 'Przekaźnik może to zrobić dzisiaj dla tego konta.',
  'capability.explain.unsupported':
    '{provider} nie oferuje tego za pośrednictwem oficjalnego API, więc żadne narzędzie nie może tego zrobić bezpiecznie.',
  'capability.explain.not_implemented':
    '{provider} oferuje to, ale Relay jeszcze tego nie zbudował. Jest to uwzględnione w planie działania dotyczącym złącza.',
  'capability.explain.requires_review':
    '{provider} przyznaje to dopiero po sprawdzeniu aplikacji lub konta. Pozostaje niedostępny do czasu zatwierdzenia tej recenzji.',
  'capability.explain.beta':
    'To działa, ale w przypadku limitów nie zakończyliśmy weryfikacji. Sprawdź wynik, zanim na nim polegasz.',
  'capability.explain.unknown':
    'Nie mogliśmy odczytać bieżących uprawnień dla tego konta. Połącz się ponownie, aby je odświeżyć.',
  'capability.lastChecked': 'Sprawdzone {relativeTime}',
  'capability.feature.text': 'Posty tekstowe',
  'capability.feature.image': 'Obrazy',
  'capability.feature.carousel': 'Karuzele',
  'capability.feature.video': 'Wideo',
  'capability.feature.document': 'Dokumenty',
  'capability.feature.firstComment': 'Zaplanowany pierwszy komentarz',
  'capability.feature.thread': 'Wątki',
  'capability.feature.mentions': 'Wzmianki rodzime',
  'capability.feature.destinations': 'Wybór miejsca docelowego',
  'capability.feature.privacy': 'Kontrola prywatności',
  'capability.feature.thumbnail': 'Niestandardowa miniatura',
  'capability.feature.altText': 'Tekst alternatywny',
  'capability.feature.analytics': 'Analizy',
  'capability.feature.delete': 'Usuń opublikowany post',
  'capability.feature.commentCount': 'Liczą się komentarze',
  'capability.feature.commentReplies': 'Czytanie i odpowiadanie na komentarze',
  'capability.feature.disclosure': 'Ujawnienie automatyzacji',
} as const;
