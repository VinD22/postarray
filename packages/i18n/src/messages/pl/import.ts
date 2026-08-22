/**
 * Bulk CSV import.
 *
 * Two groups of strings. The `import.error.*` keys are the ones the parser and
 * the apply step emit: they are stored on a row, rendered in the report and
 * written into the downloadable CSV, so they have to make sense to someone
 * reading a spreadsheet rather than a screen. Everything else is the wizard.
 *
 * The copy says drafts wherever drafts are what happens, and it says schedule
 * only on the step where a person chooses it. Nothing here promises that a post
 * reaches a platform.
 */
export const importMessages = {
  'import.title': 'Importuj posty z pliku CSV',
  'import.subtitle':
    'Prześlij arkusz, przeczytaj, co zrobi, a potem zdecyduj. Przesłanie sprawdza plik. Nic nie tworzy.',

  'import.step.upload': 'Prześlij',
  'import.step.columns': 'Kolumny',
  'import.step.review': 'Przegląd',
  'import.step.apply': 'Zastosuj',
  'import.step.results': 'Wyniki',
  'import.step.position': 'Krok {current} z {total}',

  'import.upload.heading': 'Wybierz plik CSV',
  'import.upload.help':
    'Tylko CSV. Pliki arkuszy, takie jak .xlsx, nie są odczytywane. Najpierw wyeksportuj arkusz jako CSV.',
  'import.upload.field': 'Plik CSV',
  'import.upload.fieldHelp': 'Wybierz plik albo wklej wiersze w polu poniżej.',
  'import.upload.paste': 'Albo wklej tekst CSV',
  'import.upload.pasteHelp':
    'Uwzględnij wiersz nagłówka. Wszystko jest sprawdzane, zanim cokolwiek zostanie utworzone.',
  'import.upload.project': 'Marka',
  'import.upload.projectHelp': 'Każdy wiersz w jednym pliku należy do tej marki.',
  'import.upload.submit': 'Sprawdź ten plik',
  'import.upload.submitting': 'Odczytywanie pliku',
  'import.upload.allowPast': 'Zezwól na terminy, które już minęły',
  'import.upload.allowPastHelp':
    'Domyślnie wyłączone. Wiersz z datą w przeszłości jest zgłaszany, abyś mógł go poprawić, zamiast być za ciebie przesunięty.',
  'import.upload.tooLarge':
    'Ten plik jest większy niż {limit} znaków. Podziel go i spróbuj ponownie.',
  'import.upload.duplicate':
    'To ten sam plik, który przesłałeś wcześniej, więc patrzysz na tamten import, a nie na jego drugą kopię.',

  'import.template.heading': 'Co oznaczają kolumny',
  'import.template.download': 'Pobierz szablon CSV',
  'import.template.required': 'Wymagane kolumny',
  'import.template.optional': 'Opcjonalne kolumny',
  'import.column.external_row_id':
    'Twój własny identyfikator wiersza. Musi być unikalny w obrębie pliku.',
  'import.column.project': 'Nazwa lub identyfikator marki, do której należy wiersz.',
  'import.column.targets':
    'Set: a następnie identyfikator zestawu docelowego, albo identyfikatory kont oddzielone kreską pionową.',
  'import.column.caption': 'Tekst posta.',
  'import.column.scheduled_local_time': 'Lokalna data i godzina, zapisana jako 2026-09-01T10:00.',
  'import.column.time_zone':
    'Strefa IANA, w której odczytywana jest ta lokalna godzina, na przykład Europe/Berlin.',
  'import.column.media':
    'Identyfikator mediów, sha256: a następnie suma kontrolna mediów, które już masz, albo adres https, z którego serwer ma je pobrać.',
  'import.column.title': 'Tytuł, tam gdzie miejsce docelowe go używa.',
  'import.column.destination': 'Strona, tablica lub kanał wewnątrz konta.',
  'import.column.privacy': 'Wartość prywatności oczekiwana przez miejsce docelowe.',
  'import.column.first_comment': 'Tekst opublikowany jako pierwszy komentarz po poście.',
  'import.column.approval_policy': 'Zasada zatwierdzania do dołączenia do każdego szkicu.',
  'import.column.perPlatform':
    'Kolumna caption_ lub title_ nazwana po platformie nadpisuje tylko tę platformę, na przykład caption_instagram.',

  'import.columns.heading': 'Sprawdzenie kolumn',
  'import.columns.ok': 'Obecna jest każda wymagana kolumna.',
  'import.columns.missing':
    '{count, plural, one {Brakuje # wymaganej kolumny} few {Brakuje # wymaganych kolumn} many {Brakuje # wymaganych kolumn} other {Brakuje # wymaganej kolumny}}',
  'import.columns.unknown':
    '{count, plural, one {# kolumna nie została rozpoznana i jest ignorowana} few {# kolumny nie zostały rozpoznane i są ignorowane} many {# kolumn nie zostało rozpoznanych i jest ignorowanych} other {# kolumny nie zostały rozpoznane i są ignorowane}}',
  'import.columns.present': 'Znalezione kolumny',

  'import.review.heading': 'Co zrobi ten plik',
  'import.review.counts':
    '{valid, plural, =0 {Żaden wiersz nie jest gotowy} one {# wiersz jest gotowy} few {# wiersze są gotowe} many {# wierszy jest gotowych} other {# wiersza jest gotowe}}, {invalid, plural, =0 {żaden nie wymaga uwagi} one {# wymaga uwagi} few {# wymagają uwagi} many {# wymaga uwagi} other {# wymagają uwagi}}.',
  'import.review.empty': 'Z tego pliku nie odczytano żadnych wierszy.',
  'import.review.rowsHeading': 'Wiersze',
  'import.review.filterAll': 'Wszystkie wiersze',
  'import.review.filterValid': 'Gotowe',
  'import.review.filterInvalid': 'Wymagają uwagi',
  'import.review.filterFailed': 'Nieudane',
  'import.review.downloadErrors': 'Pobierz problemy jako CSV',
  'import.review.parsedWith': 'Odczytano parserem {version}',

  'import.table.row': 'Identyfikator wiersza',
  'import.table.line': 'Linia',
  'import.table.state': 'Stan',
  'import.table.caption': 'Tekst',
  'import.table.time': 'Zaplanowano',
  'import.table.problems': 'Problemy',
  'import.table.draft': 'Szkic',
  'import.table.noProblems': 'Brak',

  'import.state.pending': 'Niesprawdzone',
  'import.state.valid': 'Gotowe',
  'import.state.invalid': 'Wymaga uwagi',
  'import.state.applied': 'Szkic utworzony',
  'import.state.skipped': 'Już zrobione',
  'import.state.failed': 'Nieudane',

  'import.job.state.uploaded': 'Przesłano',
  'import.job.state.validating': 'Sprawdzanie',
  'import.job.state.validated': 'Sprawdzone',
  'import.job.state.applying': 'Stosowanie',
  'import.job.state.applied': 'Zastosowano',
  'import.job.state.failed': 'Nie udało się odczytać',

  'import.apply.heading': 'Co powinno się stać z gotowymi wierszami?',
  'import.apply.drafts': 'Utwórz szkice',
  'import.apply.draftsHelp':
    'Domyślne. Każdy gotowy wiersz staje się szkicem, który możesz otworzyć, edytować i zatwierdzić. Nic nie jest planowane.',
  'import.apply.scheduled': 'Utwórz szkice i je zaplanuj',
  'import.apply.scheduledHelp':
    'Każdy gotowy wiersz staje się szkicem i przyjmuje termin zapisany w pliku. Wybierz to tylko, jeśli terminy są prawidłowe.',
  'import.apply.confirm':
    'Zastosuj {count, plural, one {# wiersz} few {# wiersze} many {# wierszy} other {# wiersza}}',
  'import.apply.confirmScheduled':
    'Utwórz i zaplanuj {count, plural, one {# wiersz} few {# wiersze} many {# wierszy} other {# wiersza}}',
  'import.apply.running': 'Stosowanie wierszy',
  'import.apply.safeToRepeat':
    'Zastosowanie dwa razy jest bezpieczne. Wiersz, który już utworzył szkic, pozostaje bez zmian.',

  'import.results.heading': 'Wyniki',
  'import.results.applied':
    '{count, plural, one {# szkic utworzony} few {# szkice utworzone} many {# szkiców utworzonych} other {# szkicu utworzone}}',
  'import.results.skipped':
    '{count, plural, one {# wiersz był już zrobiony} few {# wiersze były już zrobione} many {# wierszy było już zrobionych} other {# wiersza było już zrobione}}',
  'import.results.failed':
    '{count, plural, one {# wiersz nieudany} few {# wiersze nieudane} many {# wierszy nieudanych} other {# wiersza nieudane}}',
  'import.results.retry': 'Zastosuj ponownie pozostałe wiersze',
  'import.results.openDrafts': 'Otwórz szkice',
  'import.results.unavailable': 'niedostępne',

  'import.history.heading': 'Wcześniejsze importy',
  'import.history.empty': 'Brak jeszcze importów.',
  'import.history.open': 'Otwórz',

  'import.a11y.rowsTable': 'Wiersze manifestu i ich problemy',
  'import.a11y.stepList': 'Kroki importu',
  'import.a11y.uploadedFile': 'Wybrany plik: {filename}',

  'import.error.emptyFile': 'Ten plik nie ma wierszy.',
  'import.error.missingColumn': 'Brakuje kolumny {column}.',
  'import.error.unknownColumn': 'Kolumna {column} nie została rozpoznana, więc jest ignorowana.',
  'import.error.duplicateRowId':
    'Identyfikator wiersza {value} jest użyty więcej niż raz w tym pliku.',
  'import.error.required': 'Ta komórka nie może być pusta.',
  'import.error.invalidCell': 'Ta komórka nie jest w formacie, który możemy odczytać.',
  'import.error.rowShape': 'Ten wiersz ma {actual} komórek, ale nagłówek ma ich {expected}.',
  'import.error.invalidLocalTime':
    'Godzina {value} nie jest lokalną datą i godziną, taką jak 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'Strefa {value} nie jest nazwą strefy czasowej IANA.',
  'import.error.nonexistentLocalTime':
    'Godzina {value} nie istnieje w strefie {zone}. Zegary ją pomijają.',
  'import.error.ambiguousLocalTime':
    'Godzina {value} występuje dwukrotnie w strefie {zone} tego dnia. Wybierz inną godzinę.',
  'import.error.scheduleInPast': 'Godzina {value} w strefie {zone} już minęła.',
  'import.error.invalidTargets':
    'Wartość {value} nie jest zapisanym zestawem docelowym ani listą identyfikatorów kont.',
  'import.error.invalidMedia':
    'Wartość {value} nie jest identyfikatorem mediów, sumą kontrolną sha256 ani adresem https.',
  'import.error.mediaNotFound': 'Żadne media w tym obszarze roboczym nie pasują do {value}.',
  'import.error.mediaImportStarted':
    'Media pod adresem {value} są pobierane. Zastosuj ten plik ponownie, gdy znajdą się w bibliotece.',
  'import.error.unknownVariantTarget':
    'Ten wiersz nie ma konta {provider}, więc tekst dla {provider} nie został użyty.',
  'import.error.applyFailed': 'Nie udało się zastosować tego wiersza. Odniesienie: {code}.',
  'import.error.alreadyApplied': 'Ten wiersz już utworzył szkic, więc pozostał bez zmian.',
  'import.error.tooManyRows': 'Odczytywane są tylko pierwsze {limit} wierszy pliku.',
} as const;
