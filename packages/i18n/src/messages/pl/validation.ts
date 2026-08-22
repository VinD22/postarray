/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message': '{provider} potrzebuje trochę tekstu dla tego typu posta.',
  'validation.text_too_long.message':
    '{over, plural, one {# znak przekroczył limit dla {account}} other {# znaków przekroczyło limit dla {account}} few {# znaków przekroczyło limit dla {account}} many {# znaków przekroczyło limit dla {account}}}',
  'validation.text_too_long.hint': '{provider} pozwala {limit} znaków dla tego konta.',
  'validation.text_too_short.message': '{provider} potrzebuje co najmniej {min} znaków tutaj.',
  'validation.title_required.message': '{provider} potrzebuje tytułu.',
  'validation.title_too_long.message': 'Tytuł znajduje się nad {limit} limit znaków.',
  'validation.description_too_long.message': 'Opis znajduje się nad {limit} limit znaków.',
  'validation.media_required.message':
    '{provider} potrzebuje co najmniej jednego obrazu lub filmu dla tego typu posta.',
  'validation.media_count_exceeded.message':
    '{provider} akceptuje co najwyżej {limit, plural, one {# plik} other {# pliki} few {# pliki} many {# pliki}} tutaj. Ten post zawiera {count}.',
  'validation.media_type_unsupported.message': '{provider} nie akceptuje {mimeType} pliki.',
  'validation.media_aspect_ratio_unsupported.message':
    'Ten plik to {actual}. {provider} potrzebuje proporcji pomiędzy {min} i {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Przytnij go za pomocą gotowych ustawień platformy, aby to naprawić.',
  'validation.media_resolution_too_low.message':
    'Ten plik to {actual}. {provider} potrzebuje co najmniej {required}.',
  'validation.media_duration_too_long.message':
    'Ten film to {actual}. {provider} akceptuje do {limit} dla tego konta.',
  'validation.media_duration_too_short.message':
    'Ten film to {actual}. {provider} potrzebuje co najmniej {limit}.',
  'validation.media_file_too_large.message':
    'Ten plik to {actual}. {provider} akceptuje do {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} nie może publikować zdjęć i filmów w tym samym poście.',
  'validation.media_unavailable.message':
    'Załączony plik nie jest już dostępny. Usuń go z posta lub prześlij ponownie.',
  'validation.alt_text_missing.message':
    'Brak tekstu alternatywnego w {count, plural, one {# obraz} other {# obrazy} few {# obrazy} many {# obrazy}}.',
  'validation.alt_text_missing.hint': 'Opisz obraz lub oznacz go jako dekoracyjny.',
  'validation.thumbnail_unsupported.message':
    '{provider} nie akceptuje tutaj niestandardowej miniatury.',
  'validation.destination_required.message': 'Wybierz miejsce publikacji w {provider}.',
  'validation.destination_unsupported.message':
    '{destination} nie akceptuje tego typu postów na {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# wzmianka nie została powiązana z prawdziwym kontem} other {# wzmianki nie zostały dopasowane do prawdziwych kont} few {# wzmianki nie zostały dopasowane do prawdziwych kont} many {# wzmianki nie zostały dopasowane do prawdziwych kont}}.',
  'validation.mention_unresolved.hint':
    'Wybierz konto z wyników wyszukiwania lub usuń wzmiankę. Zwykły tekst nigdy nie jest publikowany jako tag natywny.',
  'validation.hashtag_count_exceeded.message':
    '{count} hashtagi. {provider} liczy więcej niż {limit} jako spam.',
  'validation.link_not_allowed.message': '{provider} nie zezwala na linki w tym polu.',
  'validation.link_destination_unverified.message':
    'Domena łącza {domain} nie został zweryfikowany dla tego obszaru roboczego.',
  'validation.privacy_setting_required.message':
    '{provider} wymaga wyraźnego wyboru prywatności przed publikacją.',
  'validation.privacy_setting_required.hint':
    'Nie ma wartości domyślnej. Wybierz, kto może zobaczyć ten post.',
  'validation.disclosure_required.message':
    'Ten post wymaga ujawnienia zgodnie z zasadami projektu dla {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} nie obsługuje zaplanowanego pierwszego komentarza dla tego konta.',
  'validation.thread_unsupported.message': '{provider} nie obsługuje wątków dla tego konta.',
  'validation.repeat_end_required.message':
    'Powtarzający się post wymaga daty zakończenia lub określonej liczby powtórzeń.',
  'validation.schedule_in_past.message': 'Ten czas minął w {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'To dalej przed nami niż {limit} Ustawiono wyszukiwanie w przyszłości dla tego poświadczenia.',
  'validation.schedule_outside_quiet_hours.message':
    'To przypada w godzinach ciszy ustalonych dla {project}.',
  'validation.duplicate_within_window.message':
    'Bardzo podobne treści są już zaplanowane lub opublikowane dla {account} w ciągu {window}.',
  'validation.blocked_term_present.message': 'Tekst zawiera zablokowany termin dla {project}.',
  'validation.unsupported_claim.message':
    'To roszczenie nie znajduje się w zatwierdzonych roszczeniach dotyczących {project}.',
  'validation.unsupported_claim.hint':
    'Dodaj to do zatwierdzonych roszczeń wraz z dowodami lub przeformułuj wyrok.',
  'validation.cadence_exceeded.message':
    '{account} opublikuje {count, plural, one {# czas} other {# razy} few {# razy} many {# razy}} tego dnia, ponad limit {limit}.',
  'validation.connection_paused.message':
    '{account} zostało wstrzymane i nie zostanie opublikowane.',
  'validation.account_type_invalid.message':
    '{account} nie jest typem konta {provider} wymaga dla tego typu postu.',

  'validation.severity.error': 'Trzeba naprawić',
  'validation.severity.warning': 'Sprawdź to',
  'validation.severity.info': 'Dla Twojej informacji',
  'validation.field.required': 'To pole jest wymagane.',
  'validation.field.tooShort':
    'Użyj co najmniej {min, plural, one {# znak} other {# znaki} few {# znaki} many {# znaki}}.',
  'validation.field.tooLong':
    'Użyj maksymalnie {max, plural, one {# znak} other {# znaki} few {# znaki} many {# znaki}}.',
  'validation.field.invalidEmail': 'Wpisz prawidłowy adres e-mail.',
  'validation.field.invalidUrl': 'Wpisz pełny adres URL, łącznie z https.',
  'validation.field.invalidDate': 'Wprowadź prawidłową datę.',
  'validation.field.invalidTime': 'Wprowadź prawidłowy czas.',
  'validation.field.invalidNumber': 'Wprowadź liczbę.',
  'validation.field.outOfRange': 'Wprowadź wartość pomiędzy {min} i {max}.',
  'validation.field.mustMatch': 'Te dwie wartości muszą się zgadzać.',
  'validation.field.alreadyTaken': 'To jest już w użyciu.',
  'validation.field.unsafeValue': 'Ta wartość nie jest tutaj dozwolona.',
} as const;
