/**
 * Web surface strings for Analytics, Automation Rules, RSS autopost and
 * tracked links.
 *
 * `analytics.ts` and `automation.ts` hold the domain vocabulary shared by every
 * surface (metric names, trigger sentences, provider caveats). This file holds
 * what only the web screens need: column headings, filter labels, wizard steps,
 * the sentence builder chrome and the per screen empty, error, offline,
 * permission and rate limit copy.
 *
 * Every leaf name here is new. Nothing in this file overwrites a key defined in
 * `analytics.ts` or `automation.ts`, which is asserted by `lint.test.ts`.
 */
export const webAnalyticsMessages = {
  /* ======================================================================
     Analytics shell
     ====================================================================== */
  'analytics.chart.legend': 'Seria pokazana na tym wykresie',
  'analytics.tab.overview': 'Przegląd',
  'analytics.tab.experiments': 'Eksperymenty',
  'analytics.tab.links': 'Śledzone linki',
  'analytics.tab.label': 'Sekcje analityczne',

  'analytics.question.baseline': 'Które posty odbiegły od Twojego poziomu bazowego?',
  'analytics.question.baselineHelp':
    'Każdy post jest porównywany z Twoimi ostatnimi postami na tym samym koncie i w tym samym formacie. Nic tutaj nie porównuje Cię z innym miejscem pracy lub inną firmą.',
  'analytics.question.accounts': 'Które konta wymagają uwagi?',
  'analytics.question.next': 'Co warto przetestować w następnej kolejności?',

  'analytics.filter.project': 'Marka',
  'analytics.filter.accounts': 'Konta',
  'analytics.filter.allAccounts': 'Wszystkie połączone konta',
  'analytics.filter.range': 'Zakres dat',
  'analytics.filter.format': 'Format treści',
  'analytics.filter.allFormats': 'Wszystkie formaty',
  'analytics.filter.comparePrevious': 'Porównaj z poprzednim okresem',
  'analytics.filter.applied':
    '{count, plural, =0 {Brak filtrów} one {# filtr} other {# filtry} few {# filtry} many {# filtry}} zastosowano. {results, plural, =0 {Brak pasujących postów} one {# publikuj mecze} other {# posty pasujące} few {# posty pasujące} many {# posty pasujące}}.',

  'analytics.rankMetric.label': 'Oceń posty autorstwa',
  'analytics.rankMetric.help':
    'W sztafecie nie ma łącznego wyniku. Wybierz jedną metrykę, której definicji ufasz, a tabela będzie uporządkowana według tej metryki.',
  'analytics.rankMetric.chosen':
    'Ranking według {metric}, zgodnie z raportem każdego dostawcy kont.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Świadomość',
  'analytics.outcome.awarenessHelp':
    'Ile razy post został dostarczony lub wyświetlony. Dostawcy liczą to w różny sposób, dlatego wartość można porównywać tylko ze sobą w czasie.',
  'analytics.outcome.consumption': 'Zużycie',
  'analytics.outcome.consumptionHelp': 'Ile postów ludzie faktycznie obejrzeli lub przeczytali.',
  'analytics.outcome.interaction': 'Interakcja',
  'analytics.outcome.interactionHelp':
    'Co ludzie robili na platformie: polubienia, komentarze, udostępnienia i zapisy.',
  'analytics.outcome.conversion': 'Konwersja',
  'analytics.outcome.conversionHelp':
    'Co ludzie zrobili po opuszczeniu platformy. Na to pytanie mogą odpowiedzieć tylko linki śledzone i tylko te, które wybrałeś do śledzenia.',
  'analytics.outcome.separateNote':
    'Te cztery grupy są liczone osobno. Dodanie ich razem spowodowałoby, że ta sama osoba zostałaby policzona więcej niż raz.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Posty opublikowane w wybranym zakresie, każdy z nich porównany z Twoim ostatnim poziomem bazowym.',
  'analytics.table.post': 'Opublikuj',
  'analytics.table.account': 'Konto',
  'analytics.table.format': 'Format',
  'analytics.table.published': 'Opublikowano',
  'analytics.table.value': 'Wartość',
  'analytics.table.delta': 'W porównaniu z wartością bazową',
  'analytics.table.sample': 'Próbka',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Dowód',
  'analytics.table.openEvidence': 'Pokaż dowody na {post}',
  'analytics.table.rowActions': 'Działania dla {post}',
  'analytics.table.openPost': 'Otwórz statystyki postów',
  'analytics.table.openReceipt': 'Otwórz potwierdzenie publikacji',
  'analytics.table.noBaseline': 'Nie ma jeszcze wartości bazowej',
  'analytics.table.noBaselineReason':
    'Mniej niż {required} na tym koncie istnieją podobne posty. Porównaniem byłby szum, więc nie pokazano żadnego.',
  'analytics.table.sortBy': 'Sortuj według {column}',
  'analytics.table.detailToggle': 'Szczegóły',

  'analytics.delta.above': '{percent} powyżej wartości bazowej',
  'analytics.delta.below': '{percent} poniżej wartości bazowej',
  'analytics.delta.level': 'Zgodnie z wartością bazową',
  'analytics.delta.unavailable': 'Brak porównania',

  'analytics.evidence.title': 'Jak dokonano tego porównania',
  'analytics.evidence.baseline':
    'Linia bazowa: mediana {metric} z poprzedniego {count, plural, one {# porównywalny post} other {# porównywalne posty} few {# porównywalne posty} many {# porównywalne posty}} na {account}.',
  'analytics.evidence.comparableBy':
    'Porównywalne oznacza to samo konto, ten sam format treści ({format}) i czas publikacji w tym samym okresie.',
  'analytics.evidence.postsUsed': 'Posty wykorzystane jako punkt odniesienia',
  'analytics.evidence.excluded':
    '{count, plural, =0 {Żadne posty nie zostały wykluczone} one {# post został wykluczony} other {# posty zostały wykluczone} few {# posty zostały wykluczone} many {# posty zostały wykluczone}}, ponieważ metryka była dla nich niedostępna.',
  'analytics.evidence.smallSample':
    'Z {count, plural, one {# post} other {# posty} few {# posty} many {# posty}} w scenariuszu bazowym pojedynczy nietypowy post znacznie przesuwa medianę. Potraktuj to jako sygnał do ponownego przetestowania, a nie wynik.',
  'analytics.evidence.confounders': 'Czego to nie uwzględnia',
  'analytics.evidence.confounder.time':
    'Pora dnia publikacji była różna w zależności od postów bazowych.',
  'analytics.evidence.confounder.format':
    'Posty graficzne i posty wideo nie są tutaj bezpośrednio porównywalne.',
  'analytics.evidence.confounder.followers':
    'Liczba obserwujących na {account} zmienione przez {percent} w tym okresie.',
  'analytics.evidence.confounder.paid':
    'Przekaźnik nie może stwierdzić, czy którykolwiek z tych postów otrzymał płatną dystrybucję.',
  'analytics.evidence.confounder.provider':
    '{provider} zmienił sposób raportowania {metric} w tym okresie.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'Co {metric} oznacza',
  'analytics.definition.inlineHeading': 'Definicja',
  'analytics.definition.observedAt': 'Zaobserwowano {dateTime}.',
  'analytics.definition.sourceLink': 'Dokumentacja dostawcy',
  'analytics.definition.verifiedOn': 'Sprawdziliśmy z dokumentacją dostawcy na {date}.',
  'analytics.definition.panelTitle': 'Definicje metryk w tym widoku',
  'analytics.definition.panelIntro':
    'Każdy numer na tym ekranie pochodzi z jednego nazwanego pola dostawcy. Poniższe definicje są również powtarzane obok każdej wartości, więc nic ważnego nie pojawia się tylko w podpowiedzi.',
  'analytics.definition.aggregation.sum': 'Agregowane poprzez dodanie każdej obserwacji.',
  'analytics.definition.aggregation.average': 'Zagregowane jako średnia.',
  'analytics.definition.aggregation.median': 'Zagregowane jako mediana.',
  'analytics.definition.aggregation.last': 'Najnowsza obserwacja.',
  'analytics.definition.aggregation.delta': 'Zmiana pomiędzy pierwszą i ostatnią obserwacją.',
  'analytics.definition.aggregation.none': 'Zgłoszone jako pojedyncza obserwacja.',
  'analytics.definition.denominator.none': 'To jest liczba, a nie stawka.',
  'analytics.definition.historyWindow':
    '{provider} utrzymuje {days, plural, one {# dzień} other {# dni} few {# dni} many {# dni}} historii dla tego pola.',
  'analytics.definition.historyWindowNone': '{provider} nie określa limitu historii dla tego pola.',

  'analytics.definition.term.providerField': 'Pole dostawcy',
  'analytics.definition.term.unit': 'Jednostka',
  'analytics.definition.term.denominator': 'Mianownik',
  'analytics.definition.term.aggregation': 'Jak jest agregowane',
  'analytics.definition.term.history': 'Historia prowadzona przez dostawcę',
  'analytics.definition.term.definition': 'Co to oznacza według dostawcy',

  'analytics.unit.count': 'Liczba zdarzeń',
  'analytics.unit.seconds': 'Sekundy',
  'analytics.unit.percent': 'Procent, który dostawca już obliczył',
  'analytics.unit.ratio': 'Współczynnik Przekaźnik obliczony na podstawie dwóch pól dostawcy',
  'analytics.unit.currency_minor': 'Kwota pieniędzy w mniejszych jednostkach',

  'analytics.denominator.none': 'To jest liczba, a nie stawka. Nie ma mianownika.',
  'analytics.denominator.impressions': 'Podzielone według wyświetleń',
  'analytics.denominator.reach': 'Podzielone przez zasięg',
  'analytics.denominator.views': 'Podzielone według wyświetleń',
  'analytics.denominator.followers': 'Podzielone przez liczbę obserwujących w momencie obserwacji',
  'analytics.denominator.sessions': 'Podzielone według sesji',

  'analytics.format.text': 'Tekst',
  'analytics.format.image': 'Obraz',
  'analytics.format.carousel': 'Karuzela',
  'analytics.format.video': 'Wideo',
  'analytics.format.short_video': 'Krótki film',
  'analytics.format.long_video': 'Długi film',
  'analytics.format.document': 'Dokument',
  'analytics.format.thread': 'Wątek',

  'analytics.value.unavailableReason.notImplemented':
    'Przekaźnik nie utworzył mapowania dla tej metryki w dniu {provider} jeszcze.',
  'analytics.value.estimated': 'Szacowane',
  'analytics.value.estimatedMethod': 'Metoda: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'Skąd pochodzą te liczby',
  'analytics.freshness.intro':
    'Dostawcy agregują dane według własnego harmonogramu. Nic na tym ekranie nie jest aktywne.',
  'analytics.freshness.accountRow': '{account} na {provider}',
  'analytics.freshness.never': 'Nigdy nie synchronizowano',
  'analytics.freshness.nextAttempt': 'Następna próba synchronizacji {relativeTime}.',
  'analytics.freshness.openStatus': 'Stan dostawcy',

  'analytics.accounts.title': 'Konta wymagające uwagi',
  'analytics.accounts.empty':
    'Każde połączone konto zwróciło dane w tym okresie. Nic cię tu nie potrzebuje.',
  'analytics.accounts.reason.permission':
    'Pozwolenie na analizę nie zostało przyznane podczas połączenia tego konta.',
  'analytics.accounts.reason.expired': 'Dostęp wygasł, więc od {date}.',
  'analytics.accounts.reason.stale': 'Ostatnia udana synchronizacja miała miejsce {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# próba synchronizacji} other {# próby synchronizacji} few {# próby synchronizacji} many {# próby synchronizacji}} nie powiodło się z rzędu. Zarejestrowanym powodem było {reason}.',
  'analytics.accounts.reason.noPosts':
    'Nic nie zostało opublikowane na tym koncie w wybranym zakresie.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Obserwacje',
  'analytics.observations.intro':
    'To są opisy tego, co pokazują liczby. Nie są to przewidywania i nie ustalają przyczyny.',
  'analytics.observations.empty':
    'Nie ma jeszcze wystarczającej liczby opublikowanych historii, aby opisać wzorzec. Opublikuj jeszcze kilka postów na tym samym koncie i w tym samym formacie.',
  'analytics.observations.citedPosts': 'Na podstawie',
  'analytics.observations.citedPeriod': 'Okres: {start} do {end}.',
  'analytics.observations.nextTestTitle': 'Test, który możesz przeprowadzić jako następny',
  'analytics.observations.nextTestBody':
    'Opublikuj {count, plural, one {# kolejny post} other {# więcej postów} few {# więcej postów} many {# więcej postów}} na {account} zmiana tylko {variable}, a następnie porównaj te same dane. Oznacz go jako eksperyment przed publikacją, aby porównanie było zaplanowane, a nie znalezione później.',
  'analytics.observations.tagFirst': 'Oznacz eksperyment',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} z biegiem czasu',
  'analytics.chart.summary':
    '{metric} na {account}, {count, plural, one {# punkt} other {# punkty} few {# punkty} many {# punkty}} z {start} do {end}.',
  'analytics.chart.showTable': 'Pokaż jako tabelę',
  'analytics.chart.hideTable': 'Ukryj stół',
  'analytics.chart.tableCaption': 'Ta sama seria co tabela.',
  'analytics.chart.columnPeriod': 'Kropka',
  'analytics.chart.columnValue': 'Wartość',
  'analytics.chart.gapLabel': 'Nie zebrano żadnych danych',
  'analytics.chart.gapExplained':
    'Przerwa w wierszu oznacza, że w tym okresie nie zebrano żadnych obserwacji. To nie oznacza zera.',
  'analytics.chart.annotation': 'Adnotacja',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'Nie zebrano żadnych obserwacji w tym zakresie.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Zaplanuj eksperyment',
  'analytics.experiment.empty':
    'Brak jeszcze eksperymentów. Eksperyment to porównanie, na które decydujesz się przed publikacją i tylko ono może dać odpowiedź na pytanie.',
  'analytics.experiment.emptyExample':
    'Przykład: dwukrotnie opublikuj to samo ogłoszenie w serwisie X, raz z linkiem w poście i raz z linkiem w pierwszym komentarzu, a następnie porównaj kliknięcia linku w ciągu 72 godzin.',
  'analytics.experiment.name': 'Co testujesz',
  'analytics.experiment.namePlaceholder':
    'Pierwszy komentarz po 5 minutach w porównaniu z 30 minutami',
  'analytics.experiment.hypothesisPlaceholder':
    'Krótsze opóźnienie, zanim pierwszy komentarz otrzyma więcej odpowiedzi na X.',
  'analytics.experiment.variantLabel': 'Wariant {index}',
  'analytics.experiment.variantDescription': 'Co różni się w tym wariancie',
  'analytics.experiment.addVariant': 'Dodaj wariant',
  'analytics.experiment.removeVariant': 'Usuń wariant {index}',
  'analytics.experiment.accounts': 'Uwzględniono konta',
  'analytics.experiment.windowHelp':
    'Po opublikowaniu posta wskaźniki stale się zmieniają. Napraw okno teraz, aby porównanie nie było dokonywane w momencie pasującym do jednego wariantu.',
  'analytics.experiment.windowDays':
    'Miara dla {count, plural, one {# dzień} other {# dni} few {# dni} many {# dni}} po opublikowaniu każdego posta',
  'analytics.experiment.minSample': 'Minimalna liczba postów na wariant',
  'analytics.experiment.minSampleHelp':
    'Poniżej tej liczby wynik jest przedstawiany jako niejednoznaczny, a nie zwycięski.',
  'analytics.experiment.status.planned': 'Planowane',
  'analytics.experiment.status.collecting': 'Zbieranie. {published} z {target} opublikowane posty.',
  'analytics.experiment.status.inconclusive': 'Kompletny, bez wyraźnych różnic',
  'analytics.experiment.result.difference':
    '{variant} nagrano {percent} więcej {metric} niż {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'Te dwa warianty mieszczą się w {percent} siebie nawzajem w {metric}. To i tak mieści się w zakresie, w jakim te posty się różnią.',
  'analytics.experiment.result.association':
    'To jest powiązanie zmierzone w dniu {count, plural, one {# post} other {# posty} few {# posty} many {# posty}}. Nie dowodzi, że zmiana spowodowała różnicę.',
  'analytics.experiment.result.unavailable':
    '{metric} był niedostępny dla {count, plural, one {# post} other {# posty} few {# posty} many {# posty}} w tym eksperymencie, więc te posty są wykluczane, a nie liczone jako zero.',
  'analytics.experiment.result.title': 'Wynik',
  'analytics.experiment.completeNow': 'Zamknij ten eksperyment',
  'analytics.experiment.completeConfirm':
    'Zamknięcie zatrzymuje kolekcję. Posty pozostają publikowane, a numery pozostają dostępne.',
  'analytics.experiment.postsTitle': 'Posty w tym eksperymencie',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Ładowanie statystyk dla wybranych kont',
  'analytics.state.loadingProvider': 'Pobieranie {provider} analityka',
  'analytics.state.empty': 'Nic nie opublikowano w tym zakresie',
  'analytics.state.emptyBody':
    'Statystyki opisują posty, które już się ukazały. Opublikuj coś lub poszerz zakres dat.',
  'analytics.state.emptyExample':
    'Po opublikowaniu posta zobaczysz wiersz w stylu: X @acme, „Uruchom wątek”, 12 400 wyświetleń, 58 procent powyżej mediany z poprzednich 10.',
  'analytics.state.errorTitle': 'Nie można załadować statystyk',
  'analytics.state.errorBody':
    'Nie jest pokazywana żadna liczba zamiast odgadniętej. Nie ma to wpływu na Twoje posty i potwierdzenia.',
  'analytics.state.partialTitle': '{loaded} z {total} konta zwróciły dane',
  'analytics.state.partialBody':
    'Konta, które odpowiedziały, są pokazane z własną świeżością. Pozostałe są wymienione z powodem, dla którego tego nie zrobiły.',
  'analytics.state.partialSucceeded': 'Zwrócone dane',
  'analytics.state.partialFailed': 'Nie zwróciło danych',
  'analytics.state.offlineTitle': 'Jesteś offline',
  'analytics.state.offlineBody':
    'Poniższe liczby zostały załadowane przed zerwaniem połączenia, więc są starsze, niż sugerują etykiety świeżości.',
  'analytics.state.permissionTitle': 'Nie możesz zobaczyć statystyk w tym obszarze roboczym',
  'analytics.state.permissionBody':
    'Analitycy potrzebują roli analityka lub wyższej. Może to przyznać właściciel lub administrator tego obszaru roboczego.',
  'analytics.state.rateLimitTitle':
    '{provider} to żądania analityczne ograniczające szybkość transmisji',
  'analytics.state.rateLimitCause':
    'Konto wykorzystało swoją część limitu dostawcy dla tego okna. Przekaźnik nie próbuje ponownie mocniej, ponieważ opóźniłoby to publikację.',
  'analytics.state.rateLimitAlternative':
    'Zawęź zakres dat lub filtr konta, który poprosi dostawcę o mniej.',
  'analytics.state.rateLimitReset': 'Prośba o wznowienie',
  'analytics.state.reference': 'Informacje diagnostyczne',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Utwórz link śledzony',
  'analytics.links.empty': 'Brak jeszcze śledzonych linków',
  'analytics.links.emptyBody':
    'Śledzony link to krótki adres URL, przez który przekierowuje Relay, dzięki czemu możesz zobaczyć kliknięcia, nawet jeśli platforma ich nie zgłasza. Pierwotne miejsce docelowe nigdy nie jest zmieniane bez wpisu kontroli.',
  'analytics.links.emptyExample':
    'Przykład: Relay.to/a7Kq2 przekierowuje do acme.com/blog/launch z kampanią q3-launch.',
  'analytics.links.table.caption':
    'Śledzone linki w tym obszarze roboczym i liczba ich pierwszych kliknięć.',
  'analytics.links.campaign': 'Kampania',
  'analytics.links.created': 'Utworzono',
  'analytics.links.usedIn':
    '{count, plural, =0 {Nie użyto jeszcze w poście} one {Używane w # post} other {Używane w # posty} few {Używane w # posty} many {Używane w # posty}}',
  'analytics.links.state.active': 'Aktywny',
  'analytics.links.state.expired': 'Wygasło {date}',
  'analytics.links.state.disabled': 'Wyłączone',
  'analytics.links.state.disabledAt':
    'Wyłączono {date}. Ten krótki adres URL już nie przekierowuje.',
  'analytics.links.state.blocked': 'Zablokowano ze względów bezpieczeństwa',
  'analytics.links.state.blockedBody':
    'To przekierowanie jest niedostępne, ponieważ miejsce docelowe nie przeszło kontroli bezpieczeństwa. Zmień miejsce docelowe lub skontaktuj się z pomocą techniczną.',
  'analytics.links.state.disabledReason':
    'Wyłączone przez {actor} na {date}. Powód nagrania: {reason}.',
  'analytics.links.detailTitle': 'Śledzony link {slug}',
  'analytics.links.exactRedirect': 'Dokładne przekierowanie',
  'analytics.links.exactRedirectHelp':
    'To jest miejsce docelowe, do którego obecnie dociera użytkownik, łącznie ze wszystkimi parametrami UTM, pokazane w całości i bez skrócenia.',
  'analytics.links.editDestination': 'Zmień miejsce docelowe',
  'analytics.links.editDestinationWarning':
    'Zmiana miejsca docelowego wpływa na każde miejsce, w którym ten link został już opublikowany. Raporty za okresy przed zmianą zachowują miejsce docelowe, które było wówczas aktywne.',
  'analytics.links.editDestinationAudit':
    'Zmiana zostanie odnotowana w dzienniku audytu wraz z Twoim imieniem i nazwiskiem, starym i nowym miejscem docelowym.',
  'analytics.links.destinationHistory': 'Historia miejsc docelowych',
  'analytics.links.destinationHistoryRow': '{destination}, aktywne od {start} do {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, aktywne od {start}',
  'analytics.links.domainLabel': 'Krótka domena',
  'analytics.links.domainDefault': 'Domyślna domena przekaźnika',
  'analytics.links.domainVerified': 'Zweryfikowano przez DNS w dniu {date}',
  'analytics.links.domainPending': 'Oczekiwanie na rekord DNS',
  'analytics.links.domainPendingHelp':
    'Dodaj poniższy rekord TXT pod adresem {domain}, a następnie sprawdź ponownie. Dopóki nie zostanie zweryfikowana, tej domeny nie można wybrać do nowego połączenia.',
  'analytics.links.domainFailed': 'Rekord DNS nie pasował w {date}',
  'analytics.links.domainCheck': 'Sprawdź ponownie DNS',
  'analytics.links.expiry': 'Wygaśnięcie',
  'analytics.links.expiryNone': 'Brak ustawionego terminu wygaśnięcia',
  'analytics.links.expiryHelp':
    'Po wygaśnięciu link zwraca zwykłą stronę z informacją, że został zakończony. Nigdy nie jest to dyskretnie wskazane gdzie indziej.',
  'analytics.links.disable': 'Wyłącz teraz ten link',
  'analytics.links.disableTitle': 'Wyłącz {slug}?',
  'analytics.links.disableBody':
    'Odwiedzający trafiają na stronę z informacją, że link nie jest już dostępny. Opublikowane posty nadal zawierają krótki adres URL, więc jest on widoczny dla każdego, kto kliknie.',
  'analytics.links.disableReason': 'Powód wyłączenia',
  'analytics.links.enable': 'Włącz ten link ponownie',
  'analytics.links.abuseTitle': 'Zgłoś nadużycie tego linku',
  'analytics.links.abuseBody':
    'Jeśli ten krótki adres URL jest używany do celów niezgodnych z Twoim przeznaczeniem, zgłoś to, a przekierowanie zostanie zawieszone na czas sprawdzania.',
  'analytics.links.abuseAction': 'Zgłoś ten link',
  'analytics.links.measurementLabel': 'Własny pomiar przekierowań',
  'analytics.links.measurementExplained':
    'Przekaźnik zlicza żądanie, gdy usługa przekierowania jest proszona o ten adres URL. Deduplikowane kliknięcie usuwa powtarzające się żądania od tego samego użytkownika w krótkim oknie, a żądania pasujące do znanych wzorców robota są wykluczane, a nie usuwane.',
  'analytics.links.botsNote':
    '{count, plural, one {# prośba} other {# żądania} few {# żądania} many {# żądania}} zostały sklasyfikowane jako zautomatyzowane i wykluczone z liczby deduplikatów.',
  'analytics.links.series.title': 'Żądania i deduplikacja kliknięć w czasie',
  'analytics.links.series.requests': 'Wszystkie żądania',
  'analytics.links.series.clicks': 'Deduplikowane kliknięcia',
  'analytics.links.breakdownTitle': 'Skąd pochodzą kliknięcia',
  'analytics.links.breakdown.share': '{percent} deduplikowanych kliknięć',
  'analytics.links.referrer.direct': 'Nie wysłano strony odsyłającej',
  'analytics.links.referrer.social': 'Platforma społecznościowa',
  'analytics.links.referrer.search': 'Wyszukiwarka',
  'analytics.links.referrer.email': 'Klient poczty e-mail',
  'analytics.links.referrer.other': 'Inna witryna internetowa',
  'analytics.links.device.mobile': 'Urządzenie mobilne',
  'analytics.links.device.desktop': 'Pulpit',
  'analytics.links.device.tablet': 'Tablet',
  'analytics.links.device.unknown': 'Nieokreślono',
  'analytics.links.countryUnknown': 'Kraj nieokreślony',
  'analytics.links.lastEventLabel': 'Ostatnie kliknięcie',
  'analytics.links.noEvents': 'Nie zarejestrowano jeszcze żadnych kliknięć',
  'analytics.links.noEventsBody':
    'Nie żądano tego linku od czasu jego utworzenia. To jest prawdziwe zero mierzone przez naszą własną usługę przekierowania.',
  'analytics.links.compareWarning':
    '{provider} raporty {providerValue} kliknięć linku do tego posta. Przekaźnik zarejestrowany {relayValue} deduplikowane kliknięcia. Oba liczą różne zdarzenia i żadne z nich nie zastępuje drugiego.',
  'analytics.links.errorTitle': 'Nie można załadować statystyk linków',
  'analytics.links.errorBody':
    'Usługa przekierowania nadal działa, więc link nadal kieruje odwiedzających do miejsca docelowego. Dotyczy to tylko raportowania.',
  'analytics.links.createDestination': 'Docelowy adres URL',
  'analytics.links.createDestinationHelp':
    'Musi być publicznym adresem https. Prywatne adresy sieciowe i łańcuchy przekierowań są odrzucane przez usługę przekierowań.',
  'analytics.links.createCampaign': 'Nazwa kampanii',
  'analytics.links.createSlug': 'Niestandardowe zakończenie',
  'analytics.links.createSlugHelp':
    'Pozostaw to puste, a Przekaźnik wygeneruje krótkie losowe zakończenie.',
  'analytics.links.createUtm': 'Parametry UTM',
  'analytics.links.blockedScheme': 'Akceptowane są tylko miejsca docelowe https.',
  'analytics.links.blockedPrivate':
    'Ten adres znajduje się w sieci prywatnej, więc usługa przekierowania go nie zaakceptuje.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Zasady',
  'automation.tab.feeds': 'Kanały RSS',
  'automation.tab.label': 'Sekcje automatyki',

  'automation.rules.table.caption': 'Reguły automatyzacji w tym obszarze roboczym.',
  'automation.rules.table.rule': 'Reguła',
  'automation.rules.table.state': 'Stan',
  'automation.rules.table.accounts': 'Konta',
  'automation.rules.table.lastRun': 'Ostatnie uruchomienie',
  'automation.rules.table.nextCheck': 'Następne sprawdzenie',
  'automation.rules.neverRun': 'Jeszcze nie uruchomiono',
  'automation.rules.emptyExample':
    'Przykład: gdy w kanale bloga Acme pojawi się nowy element, jeśli językiem jest angielski, utwórz wersję roboczą na podstawie szablonu ogłoszenia na blogu i poproś o zatwierdzenie.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {Nie wybrano żadnych kont} one {# konto} other {# konta} few {# konta} many {# konta}}',
  'automation.rules.openRule': 'Otwórz {name}',
  'automation.rules.duplicateRule': 'Duplikat {name}',
  'automation.rules.deleteTitle': 'Usuń {name}?',
  'automation.rules.deleteBody':
    'Reguła zatrzymuje się natychmiast, a historia jej uruchamiania jest zapisywana w dzienniku audytu. Nie ma to wpływu na posty, które już utworzył.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'zaplanowany komentarz lub element wątku nie powiódł się',

  'automation.condition.timeWindow': 'czas upływa pomiędzy {start} i {end} w {timeZone}',
  'automation.condition.domainPresent': 'tekst prowadzi do {domain}',
  'automation.condition.hashtagPresent': 'tekst zawiera hashtag {hashtag}',
  'automation.condition.providerCapability': 'konto faktycznie może zrobić {capability}',
  'automation.condition.planStatus': 'subskrypcja jest aktywna',

  'automation.action.continueSequence': 'kontynuuj przygotowany wątek lub sekwencję komentarzy',
  'automation.action.notifyEmail': 'wyślij e-mail do {target}',
  'automation.action.notifyWebhook': 'wyślij webhooka do {target}',
  'automation.action.pauseConnection': 'wstrzymaj konto, którego dotyczy problem',
  'automation.action.quotePost': 'cytuj post źródłowy raz',
  'automation.action.followUpComment': 'dodaj przygotowany komentarz do postu źródłowego',

  'automation.param.feed': 'Kanał',
  'automation.param.template': 'Szablon',
  'automation.param.signature': 'Podpis',
  'automation.param.disclosure': 'Ujawnienie',
  'automation.param.locale': 'Język',
  'automation.param.project': 'Marka',
  'automation.param.campaign': 'Kampania',
  'automation.param.account': 'Konto',
  'automation.param.platform': 'Platforma',
  'automation.param.contentType': 'Typ treści',
  'automation.param.keyword': 'Słowo kluczowe',
  'automation.param.hashtag': 'Hashtag',
  'automation.param.domain': 'Domena',
  'automation.param.capability': 'Możliwości',
  'automation.param.timeZone': 'Strefa czasowa',
  'automation.param.startTime': 'Od',
  'automation.param.endTime': 'Do',
  'automation.param.duration': 'Czas trwania',
  'automation.param.metric': 'Metryczne',
  'automation.param.value': 'Wartość',
  'automation.param.target': 'Wyślij do',
  'automation.param.time': 'Czas',
  'automation.param.cadence': 'Jak często',
  'automation.param.notSet': 'nie ustawiono',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Nazwa reguły',
  'automation.editor.namePlaceholder': 'Bloguj w mediach społecznościowych',
  'automation.editor.when': 'Kiedy',
  'automation.editor.if': 'Jeśli',
  'automation.editor.then': 'Następnie',
  'automation.editor.after': 'Po',
  'automation.editor.until': 'Do',
  'automation.editor.sentenceLabel': 'Zdanie reguły',
  'automation.editor.readBack': 'Przeczytaj zdanie jeszcze raz, zanim to włączysz. To cała zasada.',
  'automation.editor.chooseTrigger': 'Wybierz, od czego rozpoczyna się ta reguła',
  'automation.editor.addCondition': 'Dodaj warunek',
  'automation.editor.addAction': 'Dodaj akcję',
  'automation.editor.removeCondition': 'Usuń warunek {label}',
  'automation.editor.removeAction': 'Usuń akcję {label}',
  'automation.editor.moveActionUp': 'Przesuń {label} wcześniej',
  'automation.editor.moveActionDown': 'Przesuń {label} później',
  'automation.editor.actionOrder': 'Akcje są wykonywane w tej kolejności, od góry do dołu.',
  'automation.editor.noConditions':
    'Brak warunków. Reguła jest uruchamiana przy każdym uruchomieniu.',
  'automation.editor.noActions':
    'Nie wykonano jeszcze żadnych działań. Nie można zapisać reguły bez żadnej akcji.',
  'automation.editor.delayNone': 'bez opóźnienia',
  'automation.editor.delayLabel': 'Opóźnienie przed uruchomieniem akcji',
  'automation.editor.endLabel': 'Kiedy ta reguła przestaje działać',
  'automation.editor.end.manual': 'Wyłączam to',
  'automation.editor.end.date': 'data, którą wybieram',
  'automation.editor.end.count':
    'uruchomił {count, plural, one {# czas} other {# razy} few {# razy} many {# razy}}',
  'automation.editor.end.dateValue': 'Zatrzymaj się',
  'automation.editor.end.countValue': 'Zatrzymaj po tylu uruchomieniach',
  'automation.editor.parameterFor': 'Ustawienia dla {label}',
  'automation.editor.saveDraft': 'Zapisz jako wersję roboczą',
  'automation.editor.savedAt': 'Zapisano {time}',
  'automation.editor.unsaved': 'Niezapisane zmiany',

  'automation.editor.view.sentence': 'Zdanie',
  'automation.editor.view.structured': 'Strukturowy',
  'automation.editor.view.api': 'Reprezentacja API',
  'automation.editor.view.label': 'Widok edytora',
  'automation.editor.apiHelp':
    'To jest dokładnie to, co wysyłają API REST, CLI i serwer MCP. Edytowanie go tutaj i powrót do zdania powoduje zachowanie wszystkich pól.',
  'automation.editor.apiInvalid':
    'To nie jest poprawna reguła JSON, więc nie została zastosowana: {reason}',
  'automation.editor.apiApply': 'Zastosuj ten JSON',
  'automation.editor.structuredHelp':
    'Ta sama zasada co w przypadku pól. Użyj tej opcji, gdy reguła ma wiele warunków, a zdanie jest długie.',

  'automation.editor.error.noAction': 'Dodaj co najmniej jedną akcję przed zapisaniem.',
  'automation.editor.error.noTrigger': 'Wybierz wyzwalacz przed zapisaniem.',
  'automation.editor.error.noAccounts':
    'Wybierz co najmniej jedno konto, na którym może działać ta reguła.',
  'automation.editor.error.missingParameter': '{label} potrzebuje wartości.',
  'automation.editor.error.summary':
    '{count, plural, one {# sprawa wymaga Twojej uwagi} other {# sprawy wymagają Twojej uwagi} few {# sprawy wymagają Twojej uwagi} many {# sprawy wymagają Twojej uwagi}}, zanim będzie można zapisać tę regułę.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'Co rozpoczyna tę regułę',
  'automation.picker.conditionTitle': 'Dodaj warunek',
  'automation.picker.actionTitle': 'Dodaj akcję',
  'automation.picker.search': 'Przefiltruj tę listę',
  'automation.picker.noResults': 'Nic na tej liście nie pasuje do tego, co wpisałeś.',
  'automation.picker.groupContent': 'Treść',
  'automation.picker.groupPublishing': 'Publikowanie',
  'automation.picker.groupNotify': 'Ludzie i systemy',
  'automation.picker.groupControl': 'Kontrola reguł',
  'automation.picker.groupSchedule': 'Czas',
  'automation.picker.groupExternal': 'Zdarzenia zewnętrzne',
  'automation.picker.groupMeasurement': 'Pomiar',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# akcja to} other {# działania to} few {# działania to} many {# działania to}} nie znajduje się na liście, ponieważ wybrane konta nie mogą ich wykonać.',
  'automation.picker.hiddenDetail': '{action} nie jest dostępny dla {provider}. {reason}',
  'automation.picker.consequential': 'Tworzy coś na platformie',
  'automation.picker.internalOnly': 'Pozostaje w Przekaźniku',

  'automation.accounts.label': 'Konta, na których może działać ta reguła',
  'automation.accounts.help':
    'Reguła nigdy nie może dotyczyć konta, które nie jest tutaj wymienione, niezależnie od jej warunków.',
  'automation.accounts.none': 'Nie wybrano jeszcze żadnych kont',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Zasady pomiaru dla tego wyzwalacza',
  'automation.threshold.intro':
    'Reguła reagująca na liczbę musi wiedzieć, która liczba, mierzona w jakim okresie i jak często może działać.',
  'automation.threshold.metric': 'Wskaźnik do obejrzenia',
  'automation.threshold.value': 'Wartość progowa',
  'automation.threshold.window': 'Okno pomiarowe',
  'automation.threshold.windowHelp':
    'Liczone od momentu opublikowania postu źródłowego. Poza tym oknem reguła przestaje oglądać post.',
  'automation.threshold.expiry': 'Przestań oglądać post po',
  'automation.threshold.cooldown': 'Czas odnowienia pomiędzy egzekucjami',
  'automation.threshold.cooldownHelp':
    'Najkrótszy dozwolony czas między dwoma uruchomieniami tego samego posta źródłowego.',
  'automation.threshold.maxPerPost': 'Maksymalna liczba wykonań na post źródłowy',
  'automation.threshold.defaultsTitle':
    'Ustawienia domyślne pozostają włączone, chyba że je zmienisz',
  'automation.threshold.defaultOncePerPost': 'Uruchom raz na post źródłowy.',
  'automation.threshold.defaultStale':
    'Nie wykonuj, jeśli metryka jest niedostępna lub nieaktualna. Stosowany limit świeżości to {duration}.',
  'automation.threshold.staleLimit': 'Traktuj metrykę jako nieaktualną po',
  'automation.threshold.providerNote':
    '{provider} raporty {metric} w przypadku opóźnienia, więc ta reguła może działać dopiero po opublikowaniu numeru przez dostawcę.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Kontynuacja z innego konta',
  'automation.crossAccount.off': 'Wyłączone. Ta reguła działa tylko na koncie źródłowym.',
  'automation.crossAccount.enable': 'Pozwól na kontakt z innego konta',
  'automation.crossAccount.body':
    'Oba konta muszą być połączone z tym obszarem roboczym i oba muszą być tutaj nazwane. Dalszy ciąg to przygotowany post, który piszesz z wyprzedzeniem i podlega takim samym zasadom zatwierdzania jak wszystko inne.',
  'automation.crossAccount.sourceAccount': 'Konto źródłowe',
  'automation.crossAccount.followUpAccount': 'Konto, na którym publikuje się dalsze informacje',
  'automation.crossAccount.preauthorize':
    'Potwierdzam, że ten obszar roboczy kontroluje oba {sourceAccount} i {followUpAccount} i że dalsze działania nie są przedstawiane jako niezależne poparcie.',
  'automation.crossAccount.preauthorizeRequired':
    'Potwierdź preautoryzację, zanim będzie można zapisać tę regułę.',
  'automation.crossAccount.duplicateCheck':
    'Przed następną kontrolą przeprowadzane są kontrole duplikatów i rytmu między kontami, które w przypadku powtórzenia postu źródłowego są raczej pomijane niż opóźniane.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro':
    'Wszystko, co może zrobić ta reguła, zanim będzie mogła zrobić cokolwiek innego.',
  'automation.preflight.accountsLabel': 'Konta, na których może działać',
  'automation.preflight.maxActionsLabel': 'Większość działań zewnętrznych na uruchomienie',
  'automation.preflight.maxActionsPeriod':
    'Co najwyżej {count, plural, one {# działanie zewnętrzne} other {# działania zewnętrzne} few {# działania zewnętrzne} many {# działania zewnętrzne}} w {period}.',
  'automation.preflight.approvalLabel': 'Zatwierdzenie',
  'automation.preflight.approvalNone':
    'Żadne działanie w tej regule nie tworzy niczego na platformie, więc nie ma zastosowania żadne zatwierdzenie.',
  'automation.preflight.providerLabel': 'Ograniczenia dostawcy',
  'automation.preflight.providerNone':
    'Żadne nie mają zastosowania do działań opisanych w tej regule.',
  'automation.preflight.costLabel': 'Szacowany zmierzony koszt',
  'automation.preflight.costUnknown':
    'Nie można oszacować kosztu tych działań, dopóki nie będzie znana cena dostawcy.',
  'automation.preflight.costMethod':
    'Oszacowane na podstawie cennika dostawcy z dnia {date}. Na paragonie widnieje informacja o faktycznie pobranej kwocie.',
  'automation.preflight.cadenceLabel': 'Cadence i duplikaty',
  'automation.preflight.cadenceBody':
    'Przed każdą akcją przeprowadzane są kontrole duplikatów i rytmu. Akcja, która przekroczyłaby budżet kadencji konta, jest pomijana i rejestrowana, a nie umieszczana w kolejce.',
  'automation.preflight.failureLabel': 'Jeśli uruchomienie się nie powiedzie',
  'automation.preflight.failure.pauseAfter':
    'Reguła wstrzymuje się po {count, plural, one {# kolejna awaria} other {# kolejne awarie} few {# kolejne awarie} many {# kolejne awarie}} i zapisuje element działania.',
  'automation.preflight.failure.continue':
    'Reguła działa dalej, a każda awaria jest rejestrowana w dzienniku uruchamiania.',
  'automation.preflight.exampleLabel': 'Przykładowe uruchomienie',
  'automation.preflight.exampleIntro':
    'Używając najnowszego zdarzenia, do którego pasowałby ten wyzwalacz.',
  'automation.preflight.exampleNone':
    'Nie wydarzyło się jeszcze żadne pasujące wydarzenie, więc nie można wyświetlić żadnego przykładu. Zamiast tego uruchom zdarzenie testowe.',
  'automation.preflight.activate': 'Włącz tę regułę',
  'automation.preflight.activateConfirmTitle': 'Włącz {name}?',
  'automation.preflight.activateConfirmBody':
    'Od teraz ta reguła działa bez uprzedniego pytania, w granicach wymienionych powyżej.',
  'automation.preflight.blocked':
    'Nie można jeszcze włączyć tej reguły. {count, plural, one {# przedmiot} other {# elementy} few {# elementy} many {# elementy}} powyżej wymaga decyzji.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Zdarzenie testowe',
  'automation.test.body':
    'Przebieg testowy ocenia całe zdanie i pokazuje, co by spowodowało. Nigdy nie publikuje, nigdy nie publikuje komentarzy i nigdy nie wysyła webhooka do prawdziwego punktu końcowego.',
  'automation.test.useLastEvent': 'Użyj najnowszego pasującego zdarzenia',
  'automation.test.usePayload': 'Wklej ładunek zdarzenia',
  'automation.test.run': 'Uruchom test',
  'automation.test.running': 'Uruchamianie testu',
  'automation.test.resultTitle': 'Co wykazał test',
  'automation.test.conditionPassed': '{condition} zaliczony',
  'automation.test.conditionFailed':
    '{condition} nie przeszło, więc reguła zatrzymała się w tym miejscu',
  'automation.test.actionSimulated': '{action} uruchomiłoby się',
  'automation.test.actionSkipped': '{action} zostanie pominięte: {reason}',
  'automation.test.noExternalEffect': 'Nic nie zostało w przekaźniku podczas tego testu.',
  'automation.test.failed': 'Test nie mógł zostać ukończony: {reason}',

  'automation.runs.table.caption': 'Ostatnie uruchomienia tej reguły.',
  'automation.runs.startedAt': 'Rozpoczęto',
  'automation.runs.outcome.label': 'Wynik',
  'automation.runs.actionsTaken': 'Działania',
  'automation.runs.trigger': 'Wywołane przez',
  'automation.runs.outcome.completed': 'Zakończono',
  'automation.runs.outcome.skipped': 'Pominięte',
  'automation.runs.outcome.failed': 'Niepowodzenie',
  'automation.runs.outcome.testMode': 'Tryb testowy',
  'automation.runs.actionCount':
    '{count, plural, =0 {Brak działań zewnętrznych} one {# działanie zewnętrzne} other {# działania zewnętrzne} few {# działania zewnętrzne} many {# działania zewnętrzne}}',
  'automation.runs.skippedReason': 'Pominięte, ponieważ {reason}',
  'automation.runs.openDetail': 'Otwórz przebieg z {time}',
  'automation.runs.createdItems': 'Utworzono',

  'automation.versions.caption': 'Każda zapisana wersja tej reguły.',
  'automation.versions.current': 'Aktualny',
  'automation.versions.savedBy': 'Zapisane przez {actor} na {date}',
  'automation.versions.compare': 'Porównaj z aktualną wersją',
  'automation.versions.restore': 'Przywróć tę wersję',
  'automation.versions.restoreConfirm':
    'Przywracanie powoduje utworzenie nowej wersji. Nic nie jest nadpisywane, a reguła pozostaje w obecnym stanie, dopóki jej nie włączysz.',
  'automation.versions.diffTitle': 'Wersja {from} w porównaniu z wersją {to}',

  'automation.kill.title': 'Zatrzymaj {name} teraz',
  'automation.kill.body':
    'Reguła zatrzymuje się natychmiast, w środku biegu, jeśli taki ma miejsce. Wszystko, co zostało już wysłane na platformę, pozostaje opublikowane, ponieważ post zewnętrzny nigdy nie jest wycofywany.',
  'automation.kill.confirmPhrase': 'ZATRZYMAJ',
  'automation.kill.confirmLabel': 'Wpisz STOP, aby potwierdzić',
  'automation.kill.stopped':
    'Ta reguła została zatrzymana przez {actor} na {date}. Nie może uruchomić się ponownie, dopóki go nie włączysz.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Ładowanie reguł automatyzacji',
  'automation.state.loadingRule': 'Ładowanie reguły i jej ostatnich uruchomień',
  'automation.state.errorTitle': 'Nie można załadować reguł',
  'automation.state.errorBody':
    'Nie ma to wpływu na już działające reguły. Tylko ten ekran się nie powiódł.',
  'automation.state.offlineTitle': 'Jesteś offline',
  'automation.state.offlineBody':
    'Możesz przeczytać regułę i edytować wersję roboczą, a reguła pozostanie na tym urządzeniu. Zapisywanie, testowanie i włączanie reguły wymaga połączenia.',
  'automation.state.permissionTitle': 'Nie możesz zmienić reguł automatyzacji',
  'automation.state.permissionBody':
    'Reguły działają na połączonych kontach, więc zmiana jednego wymaga roli menedżera lub wyższej. Nadal możesz przeczytać każdą regułę i jej historię działania.',
  'automation.state.rateLimitTitle': 'Uruchamianie reguł jest spowalniane',
  'automation.state.rateLimitCause':
    'W tym obszarze roboczym osiągnięto limit automatyzacji dla bieżącego okna. Nie ma to wpływu na zaplanowane posty i ręczne publikowanie.',
  'automation.state.rateLimitAlternative':
    'Reguły z rytmem mogą mieć dłuższy interwał, co wymaga mniejszej liczby przebiegów.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Zamień kanał w wersje robocze lub zaplanowane posty z taką samą walidacją i zatwierdzeniem, jak wszystko, co napiszesz samodzielnie.',
  'automation.rss.empty': 'Brak jeszcze kanałów',
  'automation.rss.emptyBody':
    'Dodaj kanał, a Relay sprawdzi go zgodnie z harmonogramem. Każdy nowy element staje się wersją roboczą, zaplanowanym postem lub prośbą o zatwierdzenie, w zależności od tego, co wybierzesz.',
  'automation.rss.emptyExample':
    'Przykład: kanał bloga Acme tworzy wersję roboczą dla X i LinkedIn za każdym razem, gdy publikowany jest artykuł, i czeka na zatwierdzenie.',
  'automation.rss.table.caption': 'Zasila ankiety tego obszaru roboczego.',
  'automation.rss.table.feed': 'Kanał',
  'automation.rss.table.policy': 'Co stanie się z nowym przedmiotem',
  'automation.rss.table.health': 'Zdrowie',

  'automation.rss.step.url': 'Adres kanału',
  'automation.rss.step.preview': 'Sprawdź kanał',
  'automation.rss.step.seen': 'Punkt początkowy',
  'automation.rss.step.targets': 'Gdzie to idzie',
  'automation.rss.step.template': 'Co mówi post',
  'automation.rss.step.policy': 'Jak jest publikowany',
  'automation.rss.stepOf': 'Krok {current} z {total}',

  'automation.rss.urlHelp':
    'Przekaźnik pobiera sygnał z naszych serwerów, a nie z Twojej przeglądarki. Adresy sieci prywatnej są odrzucane.',
  'automation.rss.validateAction': 'Sprawdź ten kanał',
  'automation.rss.validateFailed': 'Ten adres nie zwrócił czytelnego kanału',
  'automation.rss.validateFailedReason': 'Co otrzymaliśmy w zamian: {reason}',
  'automation.rss.validateBlocked': 'Ten adres wskazuje na sieć prywatną, więc nie został pobrany.',
  'automation.rss.previewTitle': 'Podgląd kanału',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# przedmiot} other {# elementy} few {# elementy} many {# elementy}} wróciło, najpierw najnowsze.',
  'automation.rss.previewItemPublished': 'Opublikowano {dateTime}',
  'automation.rss.previewNoImage': 'Brak obrazu w tym elemencie',
  'automation.rss.previewImageAlt': 'Obraz z elementu kanału {title}',
  'automation.rss.previewNoDate':
    'Ten element nie ma sygnatury czasowej, więc Relay wykorzystuje czas, w którym został zobaczony po raz pierwszy.',
  'automation.rss.previewFieldsTitle': 'Pola udostępniane przez ten kanał',
  'automation.rss.previewFieldMissing': 'Nie ma w tym kanale',

  'automation.rss.seenTitle': 'Co liczy się jako już widziane',
  'automation.rss.seenLatest':
    'Traktuj wszystko, co aktualnie znajduje się w kanale, jak widać. Publikowane są tylko przyszłe elementy.',
  'automation.rss.seenAll':
    'Potraktuj najnowszy przedmiot jako nowy i wyślij go przy następnym sprawdzeniu.',
  'automation.rss.seenHelp':
    'Większość kanałów zawiera stare artykuły. Wybranie pierwszej opcji pozwala uniknąć publikowania zaległości.',

  'automation.rss.targetsHelp':
    'Wybierz konta lub zapisaną grupę. Każdy cel nadal podlega własnej weryfikacji, zanim cokolwiek zostanie zaplanowane.',
  'automation.rss.targetGroup': 'Zapisana grupa',
  'automation.rss.targetIndividual': 'Konta indywidualne',

  'automation.rss.templateFields': 'Dostępne pola',
  'automation.rss.templateInsert': 'Wstaw {field}',
  'automation.rss.templateField.title': 'Tytuł przedmiotu',
  'automation.rss.templateField.summary': 'Podsumowanie przedmiotu',
  'automation.rss.templateField.link': 'Link do przedmiotu',
  'automation.rss.templateField.author': 'Autor elementu',
  'automation.rss.templateField.published': 'Data publikacji',
  'automation.rss.templateField.categories': 'Kategorie',
  'automation.rss.templatePreview': 'Podgląd najnowszego elementu',
  'automation.rss.adaptWithAi': 'Dostosuj tekst do każdego celu',
  'automation.rss.adaptHelp':
    'Sformułowanie zostało przepisane tak, aby pasowało do każdej platformy i pokazane jako różnica, którą akceptujesz lub odrzucasz. Media pochodzą z elementu kanału. Przekaźnik nie generuje obrazów.',
  'automation.rss.noImageGeneration':
    'Jeśli element kanału nie zawiera obrazu, post zostanie opublikowany bez niego.',
  'automation.rss.imageFromFeed': 'Użyj obrazu z elementu kanału, jeśli taki posiada',

  'automation.rss.policyHelp':
    'Element kanału nie jest wyjątkowy. Podlega takim samym zasadom zatwierdzania, jak post, który sam piszesz.',
  'automation.rss.cadenceInterval': 'Maksymalnie jeden przedmiot co',
  'automation.rss.cadenceHelp':
    'Dodatkowe elementy czekają w kolejce, zamiast publikować razem, więc kanał publikujący dziesięć artykułów na raz nie powoduje zalewania konta.',
  'automation.rss.immediateWarning':
    'Natychmiastowe opublikowanie powoduje wysłanie posta na platformę bez uprzedniego przeczytania go przez osobę. Jest dostępne tylko wtedy, gdy pozwalają na to zasady zatwierdzania tych kont.',

  'automation.rss.healthTitle': 'Zdrowie paszy',
  'automation.rss.healthOk': 'Praca',
  'automation.rss.healthStalled': 'Brak nowych pozycji dla {duration}',
  'automation.rss.healthFailing':
    'Ostatni {count, plural, one {sprawdź} other {# sprawdza} few {# sprawdza} many {# sprawdza}} nie powiodło się',
  'automation.rss.health.nextPoll': 'Następne sprawdzenie {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Żadne elementy nie zostały jeszcze przetworzone} one {# przedmiot przetworzony} other {# przetworzone elementy} few {# przetworzone elementy} many {# przetworzone elementy}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {Żadne duplikaty nie zostały pominięte} one {# pominięto duplikat} other {# pominięte duplikaty} few {# pominięte duplikaty} many {# pominięte duplikaty}}',
  'automation.rss.health.lastPollLabel': 'Ostatnio sprawdzane',
  'automation.rss.health.lastItemLabel': 'Ostatnia nowa pozycja w kanale',
  'automation.rss.health.lastPostLabel': 'Ostatnia wersja robocza lub utworzony post',
  'automation.rss.health.processedLabel': 'Przetworzone elementy',
  'automation.rss.recentItems': 'Ostatnie przedmioty',
  'automation.rss.itemOutcome.draft': 'Utworzono wersję roboczą',
  'automation.rss.itemOutcome.scheduled': 'Zaplanowano na {time}',
  'automation.rss.itemOutcome.published': 'Opublikowano',
  'automation.rss.itemOutcome.awaitingApproval': 'Oczekiwanie na zatwierdzenie',
  'automation.rss.itemOutcome.duplicate': 'Pominięte, już widziane',
  'automation.rss.itemOutcome.failed': 'Niepowodzenie: {reason}',
  'automation.rss.pauseFeed': 'Wstrzymaj ten kanał',
  'automation.rss.resumeFeed': 'Wznów ten kanał',
  'automation.rss.deleteTitle': 'Usuń {title}?',
  'automation.rss.deleteBody':
    'Przekaźnik przestaje sprawdzać to źródło. Wersje robocze i posty, które już utworzyłeś, pozostają dokładnie takie same.',
  'automation.rss.errorTitle': 'Nie można odczytać tego kanału',
  'automation.rss.errorBody':
    'Przekaźnik sprawdza zgodnie z normalnym harmonogramem. Z częściowej odpowiedzi nic nie zostało opublikowane.',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'Niedostępne w żadnej regule',
  'automation.refuse.body':
    'Automatyczne polubienia i obserwowanie, grupy angażujące, niechciane odpowiedzi i wiadomości oraz publikowanie tych samych treści z kilku kont, aby wyglądały popularnie, nie wchodzą w grę tutaj. Platformy ich zabraniają i szkodzą kontom, które z nich korzystają.',
  'automation.refuse.readPolicy': 'Przeczytaj zasady dopuszczalnego użytkowania',
} as const;
