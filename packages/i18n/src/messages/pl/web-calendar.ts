/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'Facebook',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Wątki',
  'web.provider.bluesky': 'Błękitne niebo',
  'web.provider.fake': 'Złącze testowe',

  'web.accountType.personal_profile': 'Profil osobisty',
  'web.accountType.creator_profile': 'Konto twórcy',
  'web.accountType.business_profile': 'Konto firmowe',
  'web.accountType.page': 'Strona',
  'web.accountType.organization': 'Organizacja',
  'web.accountType.channel': 'Kanał',
  'web.accountType.group': 'Grupa',
  'web.accountType.board': 'Płyta',
  'web.accountType.community': 'Społeczność',
  'web.accountType.publication': 'Publikacja',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Wszystko zaplanowane, oczekujące na zatwierdzenie, opublikowane lub zablokowane, w jednym miejscu.',
  'web.calendar.view.agenda': 'Porządek obrad',
  'web.calendar.view.table': 'Tabela',
  'web.calendar.view.switchLabel': 'Wybierz sposób ułożenia harmonogramu',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} do {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'Pokazuję {range} w {timeZone}',
  'web.calendar.timeZone.workspace': 'Strefa czasowa obszaru roboczego: {timeZone}',
  'web.calendar.timeZone.change': 'Zmiana ustawień obszaru roboczego',
  'web.calendar.jumpToDate': 'Przeskocz na randkę',
  'web.calendar.nowLabel': 'Teraz',
  'web.calendar.allDayHeading': 'Nie ma jeszcze dokładnego czasu',

  'web.calendar.filter.group': 'Grupa klientów',
  'web.calendar.filter.anyBrand': 'Dowolna marka',
  'web.calendar.filter.anyAccount': 'Dowolne konto',
  'web.calendar.filter.anyPlatform': 'Dowolna platforma',
  'web.calendar.filter.anyStatus': 'Dowolny stan',
  'web.calendar.filter.anyLocale': 'Dowolny język treści',
  'web.calendar.filter.anyCampaign': 'Dowolna kampania',
  'web.calendar.filter.anyGroup': 'Każda grupa',
  'web.calendar.filter.regionLabel': 'Filtruj harmonogram',
  'web.calendar.bucket.scheduled': 'Zaplanowane',
  'web.calendar.bucket.draft': 'Wersje robocze i zatwierdzenia',
  'web.calendar.bucket.published': 'Opublikowano',
  'web.calendar.bucket.failed': 'Wymaga uwagi',
  'web.calendar.filter.summary':
    '{count, plural, =0 {Brak filtrów} one {# filtr} other {# filtry} few {# filtry} many {# filtry}}, {results, plural, =0 {brak postów} one {# post} other {# posty} few {# posty} many {# posty}}',

  'web.calendar.grid.label': 'Siatka harmonogramu dla {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Nic w {time} na {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {Pokaż # kolejny post} other {Pokaż # więcej postów} few {Pokaż # więcej postów} many {Pokaż # więcej postów}}',
  'web.calendar.month.label': 'Siatka miesięcy dla {month}',
  'web.calendar.agenda.label': 'Porządek obrad {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Nic nie jest zaplanowane',

  'web.calendar.table.caption': 'Każdy post w {range}, posortowane według czasu publikacji.',
  'web.calendar.table.column.time': 'Czas',
  'web.calendar.table.column.account': 'Konto',
  'web.calendar.table.column.content': 'Treść',
  'web.calendar.table.column.language': 'Język',
  'web.calendar.table.column.media': 'Media',
  'web.calendar.table.column.status': 'Stan',
  'web.calendar.table.column.approver': 'Zatwierdzający',
  'web.calendar.table.column.campaign': 'Kampania',
  'web.calendar.table.column.actions': 'Działania',
  'web.calendar.table.rowMenu': 'Działania dla {title}',
  'web.calendar.table.noApprover': 'Zgoda nie jest wymagana',
  'web.calendar.table.noCampaign': 'Brak kampanii',

  'web.calendar.entry.untitled': 'Wersja robocza bez tytułu',
  'web.calendar.entry.language': 'Język {locale}',
  'web.calendar.entry.openDetail': 'Otwórz {title}',
  'web.calendar.entry.selected': '{title}. {hint}',
  'web.calendar.detail.title': 'Zaplanowany post',
  'web.calendar.detail.close': 'Zamknij ten wpis',

  'web.calendar.keyboard.title': 'Przenieś post za pomocą klawiatury',
  'web.calendar.keyboard.body':
    'Zaznacz post i naciśnij Enter, aby go otworzyć. Naciśnij M, aby podnieść słupek, następnie użyj klawiszy strzałek, aby przesunąć go o jedno miejsce i naciśnij Enter, aby potwierdzić. Naciśnij Escape, aby go odłożyć.',
  'web.calendar.keyboard.pickUp': 'Przenieś ten post',
  'web.calendar.keyboard.grabbed':
    '{title} odebrane z {from}. Klawisze strzałek przesuwają go. Enter potwierdza. Ucieczka zostaje anulowana.',
  'web.calendar.keyboard.moved': 'Proponowany termin {to}. Enter potwierdza.',
  'web.calendar.keyboard.released': '{title} odłożono z powrotem na {from}.',
  'web.calendar.keyboard.stepMinutes': 'Każdy krok to {minutes} minut.',

  'web.calendar.reschedule.title': 'Przenieść ten post?',
  'web.calendar.reschedule.subject': '{account} na {provider}',
  'web.calendar.reschedule.from': 'Od {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'Do {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Przenieś post',
  'web.calendar.reschedule.dstTitle': 'Zegary zmieniają się pomiędzy tymi dwoma czasami',
  'web.calendar.reschedule.dstBody':
    'Przesunięcie w {timeZone} to {fromOffset} w dawnych czasach i {toOffset} w nowym czasie. Wybrana godzina lokalna zostaje zachowana, więc czas UTC ulega natychmiastowej zmianie.',
  'web.calendar.reschedule.conflictTitle': 'Inne posty są blisko tego czasu',
  'web.calendar.reschedule.conflictBody':
    '{account} ma już {count, plural, one {# post} other {# posty} few {# posty} many {# posty}} w ciągu {window} nowego czasu.',
  'web.calendar.reschedule.campaignTitle': 'Konflikt kampanii',
  'web.calendar.reschedule.campaignBody':
    'Kampania {campaign} biegnie od {start} do {end}. Nowy czas jest za tym oknem.',
  'web.calendar.reschedule.leadTimeTitle': 'To już wkrótce',
  'web.calendar.reschedule.leadTimeBody':
    'Nowy czas to {duration} od teraz. {provider} potrzebuje {required}, aby przygotować multimedia dla tego typu postu.',
  'web.calendar.reschedule.pastTitle': 'Ten czas minął',
  'web.calendar.reschedule.pastBody':
    'Wybierz termin w przyszłości lub zamiast tego opublikuj teraz.',

  'web.calendar.published.title': 'Ten post został już opublikowany',
  'web.calendar.published.body':
    'Wpis istnieje w {provider} w {permalinkLabel}. Przesunięcie wpisu w Przekaźniku nie powoduje przesunięcia słupa na platformie. Wybierz, co chcesz, żeby się wydarzyło.',
  'web.calendar.published.optionLocal': 'Aktualizuj tylko rekord lokalny',
  'web.calendar.published.optionLocalHint':
    'Potwierdzenie zawiera rzeczywisty czas publikacji. Przesuwa się tylko wpis dotyczący planowania, więc Twój kalendarz pasuje do Twojego planu.',
  'web.calendar.published.optionNew': 'Zaplanuj nowy post o nowej godzinie',
  'web.calendar.published.optionNewHint':
    'Spowoduje to utworzenie drugiego, osobnego wpisu zewnętrznego. Ten, który jest już na {provider} pozostaje online.',
  'web.calendar.published.optionLabel': 'Co powinno się stać',

  'web.calendar.attention.title':
    '{count, plural, one {# post wymaga decyzji lub poprawki} other {# posty wymagają decyzji lub poprawki} few {# posty wymagają decyzji lub poprawki} many {# posty wymagają decyzji lub poprawki}}',
  'web.calendar.attention.body':
    'Pozostają tutaj i w centrum akcji, dopóki nie zostaną rozpatrzone.',
  'web.calendar.attention.open': 'Otwórz centrum akcji',
  'web.calendar.attention.showOnly': 'Pokaż tylko te',

  'web.calendar.loading': 'Ładowanie harmonogramu',
  'web.calendar.error.title': 'Nie można załadować harmonogramu',
  'web.calendar.error.body':
    'Nic zaplanowanego się nie zmieniło. Twoje posty nadal są publikowane w zaplanowanych godzinach.',
  'web.calendar.error.retry': 'Spróbuj ponownie',
  'web.calendar.empty.example':
    '09:30 Europa/Berlin, X @acme, „Zaplanowane pierwsze komentarze są opublikowane”, Zaplanowano, 1 zdjęcie',
  'web.calendar.emptyFiltered.body':
    'Brak postu w {range} pasuje do tych filtrów. Rozszerz zakres lub wyczyść filtr.',
  'web.calendar.offline.title': 'Jesteś offline',
  'web.calendar.offline.body':
    'Poniższy harmonogram to ostatnia kopia załadowana na to urządzenie. Zmiana harmonogramu i publikowanie są niedostępne do czasu przywrócenia połączenia.',
  'web.calendar.rateLimited.cause':
    'W tym obszarze roboczym kalendarz czyta się więcej razy, niż pozwala na to bieżące okno.',
  'web.calendar.rateLimited.resetLabel': 'Możesz spróbować ponownie w',
  'web.calendar.rateLimited.resetUnknown': '{provider} nie powiedział, kiedy to się resetuje.',
  'web.calendar.permission.requirementsLabel': 'Wymagany zakres',
  'web.calendar.permission.title': 'Nie możesz zobaczyć tego kalendarza',
  'web.calendar.permission.body':
    'Dostęp do Kalendarza jest przyznawany dla każdej marki. Twoje konto nie znajduje się w markach w tym widoku.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Kalendarz',
  'web.receipt.breadcrumb.post': 'Opublikuj',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Ładowanie potwierdzenia publikacji',
  'web.receipt.notFound.title': 'Brak rachunku z tym numerem referencyjnym',
  'web.receipt.notFound.body':
    'Po wysłaniu poczty istnieje potwierdzenie. Sprawdź odnośnik lub otwórz post z kalendarza.',
  'web.receipt.error.title': 'Nie można załadować paragonu',
  'web.receipt.error.body':
    'Potwierdzenie jest niezmienne i nie ma na to wpływu. Nic nie zostało ponownie opublikowane.',

  'web.receipt.section.summary': 'Co się stało',
  'web.receipt.section.timeline': 'Oś czasu wydarzenia',
  'web.receipt.section.items': 'Uruchom post i kolejne elementy',
  'web.receipt.section.attempts': 'Próby',
  'web.receipt.section.provenance': 'Pochodzenie',
  'web.receipt.section.cost': 'Wykorzystanie dostawcy',
  'web.receipt.section.analytics': 'Synchronizacja statystyk',
  'web.receipt.section.targets': 'Cele w tej kampanii',

  'web.receipt.item.root': 'Post główny',
  'web.receipt.item.comment': 'Komentarz {position}',
  'web.receipt.item.thread': 'Część gwintu {position}',
  'web.receipt.item.delay': 'Uruchamia {delay} po poście głównym',
  'web.receipt.item.noDelay': 'Działa z postem głównym',
  'web.receipt.item.pending': 'Jeszcze nie rozpoczęte',
  'web.receipt.item.rootUnaffected':
    'Post główny jest aktywny. Kolejny element, który się nie powiedzie, nigdy tego nie zmienia.',

  'web.receipt.attempt.heading': 'Próba {number}',
  'web.receipt.attempt.startedAt': 'Rozpoczęto {time}',
  'web.receipt.attempt.startedLabel': 'Rozpoczęto',
  'web.receipt.attempt.responseSummary': 'Odpowiedź dostawcy oczyszczona',
  'web.receipt.attempt.duration': 'Zajęło {duration}',
  'web.receipt.attempt.httpStatus': 'Stan HTTP',
  'web.receipt.attempt.providerRequestId': 'Numer żądania dostawcy',
  'web.receipt.attempt.retryable': 'Próbowano ponownie automatycznie',
  'web.receipt.attempt.notRetryable': 'Nie ponowiono automatycznie',
  'web.receipt.attempt.nextRetry': 'Następna próba {time}',
  'web.receipt.attempt.nextRetryLabel': 'Następna próba',
  'web.receipt.attempt.showResponse': 'Pokaż oczyszczoną odpowiedź dostawcy',
  'web.receipt.attempt.hideResponse': 'Ukryj oczyszczoną odpowiedź dostawcy',
  'web.receipt.attempt.none': 'Jedna próba i żadnych niepowodzeń.',

  'web.receipt.provenance.capabilityVersion': 'Migawka możliwości',
  'web.receipt.provenance.capabilityHint':
    'Zrzut ekranu użyty podczas zatwierdzania i ponownie sprawdzony przed wysyłką.',
  'web.receipt.provenance.accountType': 'Typ konta',
  'web.receipt.provenance.externalAccount': 'Odniesienie do konta zewnętrznego',
  'web.receipt.provenance.workflow': 'Odniesienie do przepływu pracy',
  'web.receipt.provenance.createdAt': 'Potwierdzenie wypisane {time}',

  'web.receipt.approval.notRequired': 'Ten cel nie wymagał zatwierdzenia.',
  'web.receipt.approval.policy': 'Zasady {policy}',
  'web.receipt.approval.unknownPolicy': 'Nie zarejestrowano odniesienia do zasad',

  'web.receipt.cost.currency': 'Naładowano w {currency}',
  'web.receipt.cost.estimatedLabel': 'Szacowane przed publikacją',
  'web.receipt.cost.actualLabel': 'Uzgodnione rzeczywiste',
  'web.receipt.provenance.writtenLabel': 'Potwierdzenie wypisane',
  'web.receipt.cost.reconciledAt': 'Pojednane {time}',
  'web.receipt.cost.notMetered': '{provider} nie pobiera opłaty za operację dla tego typu postu.',

  'web.receipt.analytics.never': 'Statystyki nie zostały jeszcze zsynchronizowane dla tego wpisu.',
  'web.receipt.analytics.explain':
    'Dostawcy agregują dane według własnych harmonogramów. Poniższy czas dotyczy czasu, w którym Relay ostatni raz je odczytał, a nie momentu, w którym liczby były prawdziwe.',

  'web.receipt.export.download': 'Pobierz paragon',
  'web.receipt.export.copyReference': 'Skopiuj numer paragonu',
  'web.receipt.export.denied':
    'Udostępnienie potwierdzenia wymaga roli właściciela, administratora lub osoby zatwierdzającej. Jesteś {role}.',

  'web.receipt.partial.retryFailedOnly':
    'Ponów próbę tylko w przypadku celów, które zakończyły się niepowodzeniem',
  'web.receipt.partial.retryHint':
    'Ponowna próba nigdy nie dotyka celu, który już wygenerował post zewnętrzny.',

  'web.receipt.remediation.user_action_required':
    'Wymaga to zmiany w przekaźniku lub na {provider}, zanim będzie można go ponownie uruchomić.',
  'web.receipt.remediation.content_invalid':
    'Edytuj treść tak, aby przeszła {provider} walidacja, a następnie zaplanuj ją ponownie.',
  'web.receipt.remediation.transient_provider':
    '{provider} zwróciło tymczasowy błąd. Przekaźnik ponowił próbę według własnego harmonogramu.',
  'web.receipt.remediation.permanent_provider':
    '{provider} odrzucił to na stałe. Ponowna próba tej samej treści nie zmieni odpowiedzi.',
  'web.receipt.remediation.internal':
    'To była wina po naszej stronie. Jest on nagrany z odniesieniem poniżej.',
  'web.receipt.remediation.unknown':
    '{provider} zwróciło coś, dla czego nie mamy reguły. Oczyszczona odpowiedź znajduje się poniżej.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Konta',
  'web.connection.tab.capabilities': 'Macierz możliwości',
  'web.connection.tab.groups': 'Grupy klientów',
  'web.connection.loading': 'Ładowanie połączonych kont',
  'web.connection.error.title': 'Nie można załadować połączonych kont',
  'web.connection.error.body':
    'Nie ma to wpływu na publikację. Zaplanowane posty nadal są uruchamiane w ramach zapisanego dostępu.',
  'web.connection.list.label': 'Połączone konta',
  'web.connection.empty.example':
    'X, @acme, profil osobisty, połączenie 12 czerwca przez Ana Ruiz, publikacje i dane, ostatnia publikacja 6 sierpnia',
  'web.connection.filter.provider': 'Platforma',
  'web.connection.filter.health': 'Zdrowie',
  'web.connection.filter.group': 'Grupa klientów',
  'web.connection.filter.anyHealth': 'Jakiekolwiek zdrowie',
  'web.connection.healthFilter.healthy': 'Praca',
  'web.connection.healthFilter.expiring_soon': 'Wkrótce wygaśnie',
  'web.connection.healthFilter.expired': 'Dostęp wygasł',
  'web.connection.healthFilter.revoked': 'Dostęp cofnięty',
  'web.connection.healthFilter.permission_missing': 'Brak uprawnień',
  'web.connection.healthFilter.review_pending': 'Oczekiwanie na recenzję platformy',
  'web.connection.healthFilter.paused': 'Wstrzymano',
  'web.connection.healthFilter.unknown': 'Zdrowie niedostępne',

  'web.connection.row.summaryLabel': 'Co potrafi to konto',
  'web.connection.row.expand': 'Pokaż pełne podsumowanie dla {account}',
  'web.connection.row.collapse': 'Ukryj pełne podsumowanie dla {account}',
  'web.connection.row.metered': 'Licznik na operację. Szacowany {amount} na utworzenie posta.',
  'web.connection.row.limitationHeading': 'Ograniczenia na tym koncie',
  'web.connection.row.noLimitations': 'Brak ograniczeń produkcyjnych lub beta na tym koncie.',
  'web.connection.row.beta': 'Złącze Beta',
  'web.connection.row.betaBody':
    'To złącze działa, ale nie zakończyliśmy sprawdzania limitów. Sprawdź opublikowany post, zanim na nim polegasz.',

  'web.connection.detail.expiryLabel': 'Dostęp wygasa',
  'web.connection.health.expiresIn': 'Dostęp wygasa {relativeTime}, w dniu {date}',
  'web.connection.health.noExpiry':
    'Ten dostęp nie wygasa zgodnie z harmonogramem {provider} mówi nam.',
  'web.connection.health.checkedAt': 'Sprawdzono stan {relativeTime}',

  'web.connection.action.inspect': 'Sprawdź uprawnienia',
  'web.connection.action.viewCapabilities': 'Zobacz, co obsługuje',
  'web.connection.action.moveGroup': 'Przenieś do innej grupy',
  'web.connection.action.menu': 'Więcej akcji dla {account}',

  'web.connection.pause.title': 'Wstrzymaj {account}?',
  'web.connection.resume.title': 'Wznów {account}?',
  'web.connection.resume.body':
    'Zaplanowane posty dla tego konta zaczną być ponownie publikowane w zaplanowanych godzinach. Posty, których czas już minął, nie są uruchamiane z mocą wsteczną.',
  'web.connection.disconnect.confirmWord': 'ODŁĄCZ',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# zaplanowany post} other {# zaplanowane posty} few {# zaplanowane posty} many {# zaplanowane posty}} dla tego konta nie zostanie opublikowany.',
  'web.connection.disconnect.consequence.published':
    'Posty już opublikowane pozostają na {provider}. Przekaźnik ich nie usuwa.',
  'web.connection.disconnect.consequence.analytics':
    'Zebrane już dane pozostają w tym obszarze roboczym i przestają się aktualizować.',

  'web.connection.connect.title': 'Połącz konto',
  'web.connection.connect.chooseProvider': 'Która platforma',
  'web.connection.connect.permissionHeading': 'O co zapyta przekaźnik {provider} dla',
  'web.connection.connect.requirementHeading': 'Zanim będziesz kontynuować',
  'web.connection.connect.continue': 'Kontynuuj do {provider}',
  'web.connection.connect.handoffNote':
    'Następny ekran to {provider}, a nie przekaźnik. Przekaźnik nigdy nie widzi Twojego hasła.',
  'web.connection.connect.noWriteWithoutApproval':
    'Podłączenie konta nie powoduje żadnej publikacji. Każdy post nadal jest zgodny z tymi zasadami zatwierdzania przestrzeni roboczej.',

  'web.connection.requirement.instagram':
    'Publikowanie na Instagramie wymaga konta profesjonalnego, co oznacza konto firmowe lub twórcy połączone ze stroną na Facebooku.',
  'web.connection.requirement.facebook':
    'Przekaźnik publikuje na stronach Facebooka. Profil osobisty nie może być celem publikacji.',
  'web.connection.requirement.linkedin':
    'Aby publikować dla organizacji, musisz mieć rolę administratora treści na tej stronie LinkedIn.',
  'web.connection.requirement.youtube':
    'Dopóki Google nie zakończy audytu aplikacji, pliki przesłane z tego projektu są publikowane jako prywatne. Możesz później zmienić widoczność w YouTube.',
  'web.connection.requirement.tiktok':
    'TikTok wymaga samodzielnego wybrania odbiorców każdego postu. Przekaźnik nie może wybrać jednego za Ciebie.',
  'web.connection.requirement.x':
    'X opłat za operację. Post zawierający adres URL kosztuje więcej niż zwykły post tekstowy, a szacunkowa cena jest wyświetlana przed zaplanowaniem.',
  'web.connection.requirement.threads':
    'Publikowanie wątków korzysta z konta połączonego z Twoim profesjonalnym kontem na Instagramie.',
  'web.connection.requirement.bluesky':
    'Bluesky łączy się za pomocą hasła do aplikacji utworzonego w ustawieniach Bluesky, a nie hasła do konta.',
  'web.connection.requirement.generic':
    'Potrzebujesz pozwolenia na publikowanie postów na tym koncie z poziomu samej platformy. Przekaźnik nie może tego przyznać.',

  'web.connection.purpose.publish': 'Publikowanie postów zaplanowanych w Relay.',
  'web.connection.purpose.readPosts':
    'Odczytywanie wpisu opublikowanego przez przekaźnik, aby potwierdzenie mogło potwierdzić, że działa.',
  'web.connection.purpose.identity':
    'Pokazuje dokładną nazwę konta w Relay, dzięki czemu nigdy nie publikujesz na niewłaściwym koncie.',
  'web.connection.purpose.analytics':
    'Czytanie wskaźników raportowanych przez tę platformę dla Twoich własnych postów.',
  'web.connection.purpose.refresh':
    'Utrzymywanie dostępu, aby zaplanowany post nie zawiódł z dnia na dzień.',
  'web.connection.purpose.chooseDestination':
    'Lista stron i kanałów, które możesz wybrać jako cel publikacji.',

  'web.connection.permissions.title': 'Uprawnienia w {account}',
  'web.connection.permissions.scopeColumn': 'Pozwolenie',
  'web.connection.permissions.stateColumn': 'Stan',
  'web.connection.permissions.purposeColumn': 'Do czego wykorzystuje go przekaźnik',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {# brak pozwolenia} other {# brakuje uprawnień} few {# brakuje uprawnień} many {# brakuje uprawnień}}. Połącz się ponownie i zaakceptuj, aby przywrócić poniższe funkcje.',
  'web.connection.permissions.snapshot': 'Przeczytaj z {provider} {relativeTime}',

  'web.connection.capability.title': 'Macierz możliwości',
  'web.connection.capability.subtitle':
    'Wygenerowano na podstawie wersjonowanych definicji łączników w tej kompilacji, a następnie sprawdzono ręcznie. Są to te same dane, których używa kompozytor i strona możliwości publicznych.',
  'web.connection.capability.tableLabel': 'Możliwości według platformy',
  'web.connection.capability.featureColumn': 'Możliwości',
  'web.connection.capability.legendTitle': 'Jak to przeczytać',
  'web.connection.capability.legend.supported':
    'Przekaźnik może to zrobić już dziś dla podłączonego konta odpowiedniego typu.',
  'web.connection.capability.legend.not_implemented':
    'Platforma to oferuje, a Relay jeszcze jej nie zbudował. Jest to uwzględnione w planie działania dotyczącym złącza.',
  'web.connection.capability.legend.unsupported':
    'Platforma nie oferuje tego poprzez oficjalne API, więc żadne narzędzie nie zrobi tego bezpiecznie.',
  'web.connection.capability.legend.requires_review':
    'Zbudowany i platforma przyznaje go dopiero po sprawdzeniu aplikacji lub konta.',
  'web.connection.capability.versionLabel': 'Definicje złączy',
  'web.connection.capability.version': 'Wersja definicji złączy {version}',
  'web.connection.capability.observedAt': 'Przeczytanie migawki {relativeTime}',
  'web.connection.capability.forAccount': 'Pokazane dla {account}',
  'web.connection.capability.noSnapshot':
    'Brak jeszcze migawki możliwości tego konta. Połącz się ponownie, aby przeczytać.',
  'web.connection.capability.cellLabel': '{feature} na {provider}: {state}',

  'web.connection.group.title': 'Grupy klientów',
  'web.connection.group.listLabel': 'Grupy klientów',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Brak kont} one {# konto} other {# konta} few {# konta} many {# konta}}',
  'web.connection.group.create': 'Utwórz grupę',
  'web.connection.group.nameLabel': 'Nazwa grupy',
  'web.connection.group.namePlaceholder': 'Acme EU',
  'web.connection.group.moveTitle': 'Przesuń {account}',
  'web.connection.group.moveLabel': 'Przenieś do',
  'web.connection.group.moveConfirm': 'Przenieś konto',
  'web.connection.group.movedAnnouncement': '{account} przeniesiono do {group}',
  'web.connection.group.filterCalendarHint':
    'Grupa filtruje kalendarz i statystyki. Przeniesienie konta powoduje zachowanie wszystkich wpisów, potwierdzeń i danych, które już zawiera.',
  'web.connection.group.empty.title': 'Nie ma jeszcze grup klientów',
  'web.connection.group.empty.body':
    'Grupa to klient lub marka. Grupuj konta, aby filtrować kalendarz i statystyki według klientów.',

  'web.connection.incident.title': 'To konto wymaga uwagi',
  'web.connection.incident.remediationHeading': 'Co robić',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# zaplanowany post jest wstrzymany} other {# zaplanowane posty są wstrzymane} few {# zaplanowane posty są wstrzymane} many {# zaplanowane posty są wstrzymane}} dla tego konta.',
  'web.connection.incident.nothingLost':
    'Nic nie zostanie utracone i nic nie zostanie zduplikowane.',
} as const;
