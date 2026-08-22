/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'Jeszcze nic nie zaplanowano',
  'empty.calendar.body': 'Napisz swój pierwszy post i wybierz godzinę. Możesz to zmienić później.',
  'empty.calendar.action': 'Napisz post',
  'empty.drafts.title': 'Brak wersji roboczych',
  'empty.drafts.body':
    'Zapisane wersje robocze pojawiają się tutaj wraz z ich celami i problemami.',
  'empty.connections.title': 'Brak połączonych kont',
  'empty.connections.body':
    'Połącz konto, aby na nim publikować. Najpierw pokażemy Ci dokładne uprawnienia.',
  'empty.connections.action': 'Połącz konto',
  'empty.analytics.title': 'Brak jeszcze wskaźników',
  'empty.analytics.body':
    'Statystyki pojawiają się, gdy Twój pierwszy post jest opublikowany wystarczająco długo, aby platforma mogła go zgłosić.',
  'empty.analytics.noPermission':
    'To konto nie przyznało dostępu do statystyk. Połącz się ponownie, aby go dodać.',
  'empty.approvals.title': 'Nic na Ciebie nie czeka',
  'empty.approvals.body': 'Tutaj pojawiają się prośby o zatwierdzenie Twoich projektów.',
  'empty.library.title': 'Twoja biblioteka jest pusta',
  'empty.library.body':
    'Prześlij obrazy i filmy lub zaimportuj je z adresu URL lub interfejsu API.',
  'empty.library.action': 'Prześlij multimedia',
  'empty.automation.title': 'Nie ma jeszcze żadnych reguł',
  'empty.automation.body':
    'Reguła reaguje na coś i proponuje akcję. Każda reguła pokazuje swoje ograniczenia, zanim ją włączysz.',
  'empty.webhooks.title': 'Brak punktów końcowych',
  'empty.webhooks.body':
    'Dodaj punkt końcowy, aby otrzymywać podpisane zdarzenia dotyczące publikowania i połączeń.',
  'empty.searchResults.title': 'Brak wyników dla {query}',
  'empty.searchResults.body': 'Sprawdź pisownię lub wyczyść filtr.',
  'empty.filtered.title': 'Nic nie pasuje do tych filtrów',
  'empty.filtered.action': 'Wyczyść filtry',
  'empty.auditLog.title': 'Jeszcze brak aktywności',
  'empty.receipts.title': 'Brak jeszcze rachunków',
  'empty.receipts.body': 'Każda publikacja zawiera paragon, który możesz sprawdzić i udostępnić.',

  'loading.default': 'Ładowanie',
  'loading.calendar': 'Ładowanie kalendarza',
  'loading.analytics': 'Ładowanie danych',
  'loading.preview': 'Tworzenie podglądu',
  'loading.validating': 'Sprawdzanie aktualnych limitów platformy',
  'loading.publishing': 'Publikowanie w {provider}',
  'loading.uploading': 'Przesyłanie {name}',
  'loading.uploadProgress': '{percent} przesłano',
  'loading.connecting': 'Łączenie z {provider}',
  'loading.savingDraft': 'Zapisywanie wersji roboczej',
  'loading.generatingPlan': 'Tworzenie planu',
  'loading.longRunning': 'To trwa dłużej niż zwykle. Nadal działa.',

  'offline.banner': 'Jesteś offline. Zmiany są przechowywane na tym urządzeniu.',
  'offline.draftSafe':
    'Twoja wersja robocza jest bezpieczna. Synchronizuje się, gdy znów będziesz online.',
  'offline.publishDisabled':
    'Publikowanie wymaga połączenia. To nie zostanie umieszczone w kolejce w trybie cichym.',
  'offline.scheduleQueued':
    'To żądanie harmonogramu znajduje się w kolejce na tym urządzeniu i zostanie wysłane, gdy ponownie będziesz online.',
  'offline.reconnected': 'Wróciłem do trybu online. Synchronizowanie zmian.',
  'offline.syncConflict':
    'Niektórych zmian nie udało się połączyć automatycznie. Przejrzyj je przed zapisaniem.',

  'permission.denied.title': 'Nie masz do tego dostępu',
  'permission.denied.role': 'To wymaga {role} rola. Jesteś {currentRole}.',
  'permission.denied.scope': 'To dane uwierzytelniające wymagają zakresu {scope}.',
  'permission.denied.contactOwner': 'Zapytaj {owner}, aby to przyznać.',
  'permission.denied.projectScope': 'Twój dostęp jest ograniczony do {projects}.',
  'permission.readOnly': 'Ten obszar roboczy jest teraz tylko do odczytu.',
  'permission.mfaRequired':
    'Potwierdź za pomocą uwierzytelniania dwuskładnikowego, aby kontynuować.',

  'rateLimit.title': 'Zwolnij na chwilę',
  'rateLimit.body': 'Dokonałeś {count} żądania w {window}. Limit wynosi {limit}.',
  'rateLimit.resetsAt': 'Resetuje się o {time}.',
  'rateLimit.cheaperAlternative':
    'Planowanie zamiast publikowania pozwala teraz uniknąć tego ograniczenia.',
  'rateLimit.providerCost': '{provider} opłaty za operację. To działanie szacuje się na {amount}.',

  'incident.providerDegraded': '{provider} ma problemy. Zaplanowane posty są ponawiane.',
  'incident.providerDown':
    '{provider} jest niedostępne. Nic nie zostaje utracone i nic nie jest powielane.',
  'incident.isolated': 'Inne platformy pozostają nienaruszone.',
  'incident.statusPage': 'Stan aktywności według złącza i powierzchni',
  'incident.startedAt': 'Rozpoczęto {relativeTime}',

  'translation.incomplete':
    'Część tekstu na tym ekranie nie jest przetłumaczona na {language} jeszcze i jest wyświetlany w języku angielskim.',
  'translation.beta': 'Ten język jest w fazie beta. Zgłaszaj wszystko, co jest nieprawidłowe.',

  'confirm.discardChanges.title': 'Odrzucić zmiany?',
  'confirm.discardChanges.body': 'Nie można tego cofnąć.',
  'confirm.deleteItem.title': 'Usuń {name}?',
  'confirm.deleteItem.body': 'Nie można tego cofnąć.',
  'confirm.cancelScheduled.title': 'Anulować ten zaplanowany post?',
  'confirm.cancelScheduled.body':
    'Nie zostanie opublikowany. Wersja robocza pozostanie tutaj, więc możesz zaplanować ją ponownie.',
  'confirm.publishNow.title': 'Opublikować teraz?',
  'confirm.publishNow.body':
    '{count, plural, one {To publikuje w # konto natychmiast} other {To publikuje w # konta natychmiast} few {To publikuje w # konta natychmiast} many {To publikuje w # konta natychmiast}}. Nie można go przywołać z przekaźnika.',
  'confirm.typeToConfirm': 'Wpisz {word}, aby potwierdzić.',
} as const;
