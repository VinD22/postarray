/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Podstawowa nawigacja',
  'a11y.region.breadcrumb': 'Nawigacja okruszkowa',
  'a11y.region.main': 'Główna treść',
  'a11y.region.composer': 'Kompozytor',
  'a11y.region.preview': 'Podgląd',
  'a11y.region.validation': 'Problemy z walidacją',
  'a11y.region.targets': 'Konta docelowe',
  'a11y.region.notifications': 'Powiadomienia',

  'a11y.announce.saved': 'Wersja robocza zapisana',
  'a11y.announce.saving': 'Zapisywanie wersji roboczej',
  'a11y.announce.saveFailed': 'Nie można zapisać wersji roboczej. Twój SMS nadal tu jest.',
  'a11y.announce.offline': 'Jesteś offline. Zmiany są przechowywane na tym urządzeniu.',
  'a11y.announce.online': 'Powrót do trybu online',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Brak problemów z walidacją} one {# problem z walidacją} other {# problemy z walidacją} few {# problemy z walidacją} many {# problemy z walidacją}}',
  'a11y.announce.validationCleared': 'Wszystkie problemy z walidacją zostały rozwiązane',
  'a11y.announce.targetSelected':
    '{account}. {count, plural, one {# cel} other {# cele} few {# cele} many {# cele}} ogółem.',
  'a11y.announce.targetOverridden': '{account} ma teraz własną wersję',
  'a11y.announce.targetReset': '{account} reset do wersji roboczej głównej',
  'a11y.announce.uploadProgress': '{name}, {percent} przesłano',
  'a11y.announce.uploadComplete': '{name} przesłano',
  'a11y.announce.uploadFailed': '{name} nie udało się przesłać',
  'a11y.announce.scheduled': 'Zaplanowano na {time} w {timeZone}',
  'a11y.announce.rescheduled': 'Przeniesiono do {time} w {timeZone}',
  'a11y.announce.publishing': 'Publikowanie',
  'a11y.announce.published':
    '{count, plural, one {Opublikowano w # konto} other {Opublikowano w # konta} few {Opublikowano w # konta} many {Opublikowano w # konta}}',
  'a11y.announce.publishPartial':
    'Opublikowano w {published} z {total} kont. {failed, plural, one {# konto wymaga uwagi} other {# konta wymagają uwagi} few {# konta wymagają uwagi} many {# konta wymagają uwagi}}.',
  'a11y.announce.publishFailed': 'Publikowanie nie powiodło się. Twoja treść zostanie zachowana.',
  'a11y.announce.approvalRequested': 'Prośba o zgodę od {approver}',
  'a11y.announce.approved': 'Zatwierdzono',
  'a11y.announce.connectionAdded': '{account} podłączony',
  'a11y.announce.connectionRemoved': '{account} rozłączony',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Filtry wyczyszczone} one {# zastosowano filtr} other {# zastosowano filtry} few {# zastosowano filtry} many {# zastosowano filtry}}, {results, plural, one {# wynik} other {# wyniki} few {# wyniki} many {# wyniki}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Skopiowano do schowka',
  'a11y.announce.suggestionApplied': 'Sugestia została zastosowana',
  'a11y.announce.suggestionRejected': 'Sugestia odrzucona',

  'a11y.label.closeDialog': 'Zamknij okno dialogowe',
  'a11y.label.openMenu': 'Otwórz menu',
  'a11y.label.sortBy': 'Sortuj według {field}',
  'a11y.label.sortAscending': 'Posortowane rosnąco',
  'a11y.label.sortDescending': 'Posortowane malejąco',
  'a11y.label.removeTarget': 'Usuń {account} z celów',
  'a11y.label.removeMedia': 'Usuń {name}',
  'a11y.label.editAltText': 'Edytuj tekst alternatywny dla {name}',
  'a11y.label.mediaPreview': 'Podgląd {name}',
  'a11y.label.playVideo': 'Odtwórz {name}',
  'a11y.label.pauseVideo': 'Wstrzymaj {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {nic nie jest zaplanowane} one {# post} other {# posty} few {# posty} many {# posty}}',
  'a11y.label.postSummary': '{account} na {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} z {limit} użyte znaki',
  'a11y.label.requiredField': 'Wymagane',
  'a11y.label.externalLink': 'Otwiera się w nowej karcie',
  'a11y.label.loadingRegion': 'Ładowanie treści',
  'a11y.label.expandRow': 'Pokaż szczegóły dla {name}',
  'a11y.label.collapseRow': 'Ukryj szczegóły dla {name}',
  'a11y.languagePicker.label': 'Wybierz język interfejsu',
  'a11y.languagePicker.filterLabel': 'Filtruj języki',
  'a11y.languagePicker.announceChanged': 'Język interfejsu zmieniony na {language}',

  'a11y.keyboard.hint.calendar':
    'Użyj klawiszy strzałek, aby poruszać się pomiędzy slotami. Naciśnij Enter, aby otworzyć post. Naciśnij spację, a następnie klawisze strzałek, aby zmienić termin.',
  'a11y.keyboard.hint.composer':
    'Naciśnij klawisz Control i nawiasy, aby poruszać się między celami. Naciśnij Control i I, aby przejść do następnego numeru.',
  'a11y.keyboard.hint.dialog': 'Naciśnij Escape, aby zamknąć.',
  'a11y.keyboard.shortcutsTitle': 'Skróty klawiaturowe',

  'a11y.table.alternative': 'Widok tabeli',
  'a11y.table.alternativeHint': 'Ten sam harmonogram co tabela z możliwością sortowania.',
  'a11y.motion.reduced': 'Animacje są ograniczone ze względu na ustawienia systemu.',
} as const;
