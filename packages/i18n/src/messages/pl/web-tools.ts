/**
 * The free tools on the public site.
 *
 * These pages exist because this repository already knows every launch cohort
 * platform's real publishing limits from its connector capability code. A tool
 * here may therefore state a number, but only a number the generated dataset
 * carries, always beside the official source and the date a person read it.
 *
 * Rules that bind this file specifically:
 *
 *  - A tool never claims the product publishes anywhere. Nothing in the launch
 *    cohort is verified for production yet, and these pages say so.
 *  - Every calculation described here runs in the reader's browser. Copy that
 *    promises privacy must stay true of the component that renders it.
 *  - No tool writes, rewrites, suggests or scores content. No tool looks up a
 *    handle, a follower count or anything else that would need an unofficial
 *    endpoint.
 *  - A limit we do not have is "unavailable". Never zero, never a guess.
 */
export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': 'Darmowe narzędzia publikacyjne',
  'web.meta.tools.description':
    'Małe, prywatne narzędzia dla osób publikujących na kilku platformach: sprawdzanie limitów dla platformy, generator UTM, sprawdzanie długości tytułów YouTube i planer stref czasowych.',
  'web.meta.tools.preflight.title': 'Sprawdzanie posta przed publikacją',
  'web.meta.tools.preflight.description':
    'Sprawdź jeden szkic względem opublikowanych limitów tekstu i mediów dziesięciu platform, ze źródłem i datą, kiedy każdy limit został odczytany.',
  'web.meta.tools.utm.title': 'Generator linków UTM',
  'web.meta.tools.utm.description':
    'Skomponuj oznaczony adres URL kampanii i zobacz, co oznacza każdy parametr UTM. Działa całkowicie w Twojej przeglądarce.',
  'web.meta.tools.youtubeTitle.title': 'Sprawdzanie długości tytułów YouTube',
  'web.meta.tools.youtubeTitle.description':
    'Zmierz tytuł YouTube względem udokumentowanego limitu, liczonego tak, jak człowiek liczy znaki.',
  'web.meta.tools.timeZone.title': 'Planer stref czasowych i czasu letniego',
  'web.meta.tools.timeZone.description':
    'Zobacz jedną godzinę publikacji w kilku strefach czasowych odbiorców i znajdź tygodnie, w których zmiana czasu letniego przesuwa lokalną godzinę.',
  'web.meta.tools.engagementRate.title': 'Kalkulator wskaźnika zaangażowania',
  'web.meta.tools.engagementRate.description':
    'Podziel interakcje przez zasięg, obserwujących lub wyświetlenia. Trzy proste obliczenia, żadnego wymyślonego wzorca.',

  /* ---------------------------------------------------------------------- */
  /* Shared tool furniture                                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'Darmowe narzędzia',
  'web.tools.index.summary':
    'Małe kalkulatory zbudowane na tych samych danych o limitach platform, które odczytują nasze łączniki.',
  'web.tools.index.lede':
    'Cztery małe narzędzia, zbudowane na tych samych danych o limitach platform, których używają nasze łączniki. Żadnego konta, żadnego przesyłania, żadnego śledzenia tego, co piszesz.',
  'web.tools.index.dataTitle': 'Skąd pochodzą te liczby',
  'web.tools.index.dataBody':
    'Każdy limit jest generowany z kodu możliwości łączników w tym repozytorium, a każdy wiersz platformy niesie oficjalną stronę dokumentacji, z której pochodzi, i datę, kiedy ktoś tę stronę przeczytał.',
  'web.tools.index.honesty':
    'Te narzędzia niczego nie publikują. Żaden łącznik nie ukończył jeszcze weryfikacji dostawcy, więc nic tutaj nie łączy konta.',
  'web.tools.shared.privacyTitle': 'To działa w Twojej przeglądarce',
  'web.tools.shared.privacyBody':
    'Wszystko, co wpiszesz, zostaje na tej stronie. Nie ma żadnego żądania do serwera, żadnego przechowywania i żadnego zdarzenia analitycznego niosącego Twój tekst.',
  'web.tools.shared.sourceLink': 'Dokumentacja platformy',
  'web.tools.shared.sourceRead': 'Przeczytano {date}',
  'web.tools.shared.unavailable': 'niedostępne',
  'web.tools.shared.unavailableWhy':
    'Nie dostarczamy jeszcze łącznika dla tej platformy, więc nie mamy zweryfikowanego limitu do pokazania. Wolimy nie mówić nic niż zgadywać.',
  'web.tools.shared.copy': 'Kopiuj',
  'web.tools.shared.copied': 'Skopiowano',
  'web.tools.shared.copyFailed': 'Twoja przeglądarka zablokowała kopiowanie. Zaznacz tekst i skopiuj go.',
  'web.tools.shared.faqTitle': 'Pytania',
  'web.tools.shared.baselineTitle': 'Które konto opisują te liczby',
  'web.tools.shared.baselineBody':
    'Przypadek ostrożny: świeżo połączone konto bez podwyższonych uprawnień. Niektóre platformy podnoszą limit, gdy kanał lub firma zostaną zweryfikowane, i tam, gdzie tak się dzieje, strona to mówi.',
  'web.tools.shared.otherTools': 'Inne narzędzia',

  /* ---------------------------------------------------------------------- */
  /* Tool names and one line summaries, shared by the index and the footer   */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'Sprawdzanie posta przed publikacją',
  'web.tools.preflight.summary':
    'Jeden szkic, sprawdzony jednocześnie względem limitów tekstu i mediów dziesięciu platform.',
  'web.tools.utm.name': 'Generator linków UTM',
  'web.tools.utm.summary': 'Zbuduj oznaczony adres URL kampanii, nie psując posiadanego ciągu zapytania.',
  'web.tools.youtubeTitle.name': 'Sprawdzanie długości tytułów YouTube',
  'web.tools.youtubeTitle.summary': 'Zmierz tytuł tak, jak człowiek liczy znaki.',
  'web.tools.timeZone.name': 'Planer stref czasowych i czasu letniego',
  'web.tools.timeZone.summary':
    'Jedna godzina publikacji w kilku strefach czasowych odbiorców, z zaznaczonymi zmianami czasu letniego.',
  'web.tools.engagementRate.name': 'Kalkulator wskaźnika zaangażowania',
  'web.tools.engagementRate.summary':
    'Interakcje podzielone przez zasięg, obserwujących lub wyświetlenia. Bez wyszukiwania, bez wzorców.',

  /* ---------------------------------------------------------------------- */
  /* Post preflight checker                                                  */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'Sprawdzanie posta przed publikacją',
  'web.tools.preflight.lede':
    'Wklej szkic, wybierz platformy, na których publikujesz, i zobacz, które by go odrzuciły, zanim dowiesz się o tym z błędu API.',
  'web.tools.preflight.explainer.title': 'Dlaczego licznik znaków to za mało',
  'web.tools.preflight.explainer.body':
    'Platformy nie zgadzają się co do tego, czym jest znak. Niektóre liczą jednostki kodu, więc jedno emoji kosztuje dwa. Niektóre liczą grafemy, więc flaga lub emoji rodziny kosztuje jeden. Niektóre przepisują każdy link na stałą szerokość, więc adres URL o 200 znakach kosztuje tyle samo co ten o 20. To narzędzie stosuje regułę każdej platformy osobno.',
  'web.tools.preflight.explainer.counting':
    'Szkic jest mierzony segmentatorem Intl przeglądarki, który dzieli tekst na jednostki, które czytelnik nazwałby znakami, a następnie dostosowywany do reguły platformy.',
  'web.tools.preflight.field.draft.label': 'Twój szkic',
  'web.tools.preflight.field.draft.help':
    'Wklej treść posta. Linki są wykrywane automatycznie, aby ich koszt mógł być zastosowany dla każdej platformy.',
  'web.tools.preflight.field.platforms.label': 'Platformy do sprawdzenia',
  'web.tools.preflight.field.platforms.help': 'Wybierz tyle, ile używasz do publikacji.',
  'web.tools.preflight.field.mediaKind.label': 'Załączone media',
  'web.tools.preflight.field.mediaKind.none': 'Bez mediów',
  'web.tools.preflight.field.mediaKind.image': 'Obrazy',
  'web.tools.preflight.field.mediaKind.video': 'Jeden film',
  'web.tools.preflight.field.mediaCount.label': 'Ile obrazów',
  'web.tools.preflight.field.byteSize.label': 'Rozmiar pliku w megabajtach',
  'web.tools.preflight.field.byteSize.help': 'Największy pojedynczy plik. Zostaw puste, aby pominąć.',
  'web.tools.preflight.field.duration.label': 'Długość filmu w sekundach',
  'web.tools.preflight.field.duration.help': 'Zostaw puste, aby pominąć sprawdzanie długości.',
  'web.tools.preflight.field.width.label': 'Szerokość mediów w pikselach',
  'web.tools.preflight.field.height.label': 'Wysokość mediów w pikselach',
  'web.tools.preflight.field.dimensions.help':
    'Opcjonalnie. Używane tylko do pokazania proporcji, które byś opublikował.',
  'web.tools.preflight.results.title': 'Wynik dla platformy',
  'web.tools.preflight.results.empty': 'Wybierz co najmniej jedną platformę, aby zobaczyć wynik.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Nic nie blokuje} other {# nie powiodłoby się}}, {warning, plural, =0 {brak ostrzeżeń} other {# do sprawdzenia}}.',
  'web.tools.preflight.status.pass': 'Pasuje',
  'web.tools.preflight.status.warning': 'Warto sprawdzić',
  'web.tools.preflight.status.fail': 'Nie powiodłoby się',
  'web.tools.preflight.status.unavailable': 'Niedostępne',
  'web.tools.preflight.count.label':
    '{count} z {limit} {unit, select, grapheme {znaków} utf16 {jednostek kodu} weighted {znaków ważonych} other {znaków}}',
  'web.tools.preflight.finding.textOver':
    'Przekroczono limit o {over, plural, one {# znak} few {# znaki} many {# znaków} other {# znaku}}.',
  'web.tools.preflight.finding.textNear': 'W granicach {remaining} znaków od limitu.',
  'web.tools.preflight.finding.textFits': 'Tekst mieści się.',
  'web.tools.preflight.finding.linkFixed':
    'Każdy link jest przepisywany na stałą szerokość, więc każdy kosztuje {cost} znaków niezależnie od jego rzeczywistej długości.',
  'web.tools.preflight.finding.linkActual': 'Linki liczą się jako znaki, które zajmują.',
  'web.tools.preflight.finding.imagesOver':
    'Ta platforma akceptuje {limit, plural, =0 {brak obrazów} one {# obraz} few {# obrazy} many {# obrazów} other {# obrazu}} w jednym poście.',
  'web.tools.preflight.finding.videosOver':
    'Ta platforma akceptuje {limit, plural, =0 {brak filmów} one {# film} few {# filmy} many {# filmów} other {# filmu}} w jednym poście.',
  'web.tools.preflight.finding.bytesOver': 'Plik jest większy niż limit {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    'Brak opublikowanego limitu bajtów dla tego typu mediów, więc rozmiar nie został sprawdzony.',
  'web.tools.preflight.finding.durationOver': 'Dłuższy niż limit {limit} sekund.',
  'web.tools.preflight.finding.durationUnder': 'Krótszy niż minimum {limit} sekund.',
  'web.tools.preflight.finding.durationUnknown':
    'Brak opublikowanego limitu długości, więc długość nie została sprawdzona.',
  'web.tools.preflight.finding.altText':
    'Tekst alternatywny jest akceptowany do {limit} znaków, co warto wykorzystać.',
  'web.tools.preflight.finding.ratio': 'Publikowałbyś w proporcji około {ratio} do 1.',
  'web.tools.preflight.faq.counting.q': 'Jak liczycie znaki?',
  'web.tools.preflight.faq.counting.a':
    'Według grafemu, za pomocą segmentatora Intl przeglądarki, czyli jednostki, którą czytelnik ma na myśli, mówiąc o znaku. Tam, gdzie platforma dokumentuje inną regułę, na przykład liczenie jednostek kodu lub naliczanie stałej szerokości za link, ta reguła jest stosowana dodatkowo.',
  'web.tools.preflight.faq.accuracy.q': 'Jak aktualne są te limity?',
  'web.tools.preflight.faq.accuracy.a':
    'Każdy limit jest generowany z kodu łączników w naszym repozytorium, a nie wpisywany na stronie, a każdy wiersz platformy pokazuje oficjalny dokument, z którego pochodzi, i datę, kiedy ktoś go przeczytał. Jeśli platforma zmieni liczbę, poprawka to jedna zmiana kodu, a każde narzędzie tutaj podąża za nią.',
  'web.tools.preflight.faq.privacy.q': 'Czy mój szkic jest gdzieś przesyłany?',
  'web.tools.preflight.faq.privacy.a':
    'Nie. Sprawdzenie działa w Twojej przeglądarce. Nie ma żadnego żądania niosącego Twój tekst, nic nie jest przechowywane, a zamknięcie karty wystarczy, aby to odrzucić.',
  'web.tools.preflight.faq.publish.q': 'Czy to narzędzie może publikować za mnie?',
  'web.tools.preflight.faq.publish.a':
    'Nie dzisiaj. Żaden łącznik nie ukończył weryfikacji dostawcy, więc nic na tej stronie jeszcze nie publikuje na platformie. Ta strona to sprawdzenie limitów, nie kompozytor.',

  /* ---------------------------------------------------------------------- */
  /* UTM builder                                                             */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'Generator linków UTM',
  'web.tools.utm.lede':
    'Dodaj parametry kampanii do adresu URL, nie tracąc ciągu zapytania, który już miał, i nie zgadując, co oznacza każdy parametr.',
  'web.tools.utm.explainer.title': 'Do czego służy każdy parametr',
  'web.tools.utm.explainer.body':
    'Parametry UTM są odczytywane przez narzędzia analityczne, nie przez platformę, na której publikujesz. Podróżują w adresie URL, więc widzi je każdy, kto zobaczy link. Utrzymuj je krótkie, małymi literami i spójne, ponieważ dwie pisownie tej samej kampanii stają się dwoma wierszami w raporcie.',
  'web.tools.utm.field.url.label': 'Docelowy adres URL',
  'web.tools.utm.field.url.help': 'Strona, na którą chcesz skierować ludzi, łącznie z https.',
  'web.tools.utm.field.url.invalid': 'To nie jest parsowane jako adres URL http lub https.',
  'web.tools.utm.field.source.label': 'Źródło kampanii',
  'web.tools.utm.field.source.help': 'Skąd przyszło kliknięcie. Na przykład nazwa platformy.',
  'web.tools.utm.field.medium.label': 'Nośnik kampanii',
  'web.tools.utm.field.medium.help': 'Rodzaj linku. Na przykład social, e-mail lub polecenie.',
  'web.tools.utm.field.campaign.label': 'Nazwa kampanii',
  'web.tools.utm.field.campaign.help': 'Uruchomienie, promocja lub motyw, do którego należy ten link.',
  'web.tools.utm.field.term.label': 'Termin kampanii',
  'web.tools.utm.field.term.help': 'Opcjonalnie. Tradycyjnie płatne słowo kluczowe.',
  'web.tools.utm.field.content.label': 'Treść kampanii',
  'web.tools.utm.field.content.help':
    'Opcjonalnie. Odróżnia dwa linki do tej samej strony, na przykład dwie wersje posta.',
  'web.tools.utm.result.title': 'Twój oznaczony adres URL',
  'web.tools.utm.result.empty': 'Wprowadź docelowy adres URL, aby zobaczyć wynik.',
  'web.tools.utm.result.label': 'Skomponowany adres URL',
  'web.tools.utm.result.preserved':
    'Ciąg zapytania, który już był w Twoim adresie URL, jest zachowywany dokładnie tak, jak go wpisałeś.',
  'web.tools.utm.result.replaced':
    'Twój adres URL już zawierał jeden z tych parametrów. Wartość, którą tu wpisałeś, go zastępuje.',
  'web.tools.utm.faq.encoding.q': 'Co dzieje się ze spacjami i akcentami?',
  'web.tools.utm.faq.encoding.a':
    'Są kodowane procentowo, co sprawia, że link przetrwa wklejenie do posta. Spacja staje się znakiem plus, a litera z akcentem staje się swoją zakodowaną formą, a narzędzia analityczne dekodują obie z powrotem.',
  'web.tools.utm.faq.existing.q': 'Czy zepsuje to adres URL, który już ma parametry?',
  'web.tools.utm.faq.existing.a':
    'Nie. Istniejące parametry są zachowywane w oryginalnej kolejności, a dodawany lub zastępowany jest tylko parametr UTM, który wypełniłeś. Fragment na końcu adresu URL pozostaje na końcu.',
  'web.tools.utm.faq.privacy.q': 'Czy mój adres URL jest gdzieś wysyłany?',
  'web.tools.utm.faq.privacy.a':
    'Nie. Adres URL jest komponowany w Twojej przeglądarce i nigdy nie opuszcza tej strony.',

  /* ---------------------------------------------------------------------- */
  /* YouTube title length checker                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'Sprawdzanie długości tytułów YouTube',
  'web.tools.youtubeTitle.lede':
    'Tytuł, który jest o jeden znak za długi, zostaje odrzucony przy przesyłaniu. Tytuł, który jest po prostu długi, zostaje ucięty w miejscu, którego nie wybrałeś.',
  'web.tools.youtubeTitle.explainer.title': 'Dwa różne limity',
  'web.tools.youtubeTitle.explainer.body':
    'Twardy limit to to, co akceptuje punkt przesyłania. To, gdzie tytuł jest pokazywany, to osobna kwestia: wynik wyszukiwania, pasek boczny i telefon ucinają tytuł w różnych miejscach, i żadne z tych miejsc nie jest publikowane. To narzędzie podaje udokumentowany limit i pokazuje kształt Twojego tytułu, i nie wymyśla liczby ucięcia.',
  'web.tools.youtubeTitle.field.title.label': 'Tytuł filmu',
  'web.tools.youtubeTitle.field.title.help': 'Liczony według grafemu, więc emoji kosztuje jeden.',
  'web.tools.youtubeTitle.result.count': '{count} z {limit} znaków',
  'web.tools.youtubeTitle.result.over':
    'Przekroczono o {over, plural, one {# znak} few {# znaki} many {# znaków} other {# znaku}}. Przesyłanie zostałoby odrzucone.',
  'web.tools.youtubeTitle.result.fits': 'W granicach udokumentowanego limitu.',
  'web.tools.youtubeTitle.result.front':
    'Pierwsze {count} znaków niesie największą wagę, ponieważ to mniej więcej tyle miejsca ma wąski układ. Twój zaczyna się: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'Limit tytułu jest niedostępny w tej wersji, więc nic tutaj nie jest sprawdzane.',
  'web.tools.youtubeTitle.faq.limit.q': 'Skąd pochodzi limit?',
  'web.tools.youtubeTitle.faq.limit.a':
    'Z oficjalnego dokumentu referencyjnego videos insert, wygenerowanego na tej stronie z tego samego kodu łączników, którego użyłby nasz mechanizm przesyłania. Data, kiedy ktoś ostatnio przeczytał tę stronę, jest pokazana obok liczby.',
  'web.tools.youtubeTitle.faq.truncation.q': 'Gdzie dokładnie YouTube ucina tytuł?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'Zależy to od powierzchni i widoku, a YouTube nie publikuje dla tego liczby znaków. Pokazujemy limit, który jest udokumentowany, i nie drukujemy liczby ucięcia, która byłaby zgadywaniem.',
  'web.tools.youtubeTitle.faq.emoji.q': 'Czy emoji liczy się jako jeden znak?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'W tym liczniku tak, ponieważ liczymy grafemy. Platforma, która wewnętrznie liczy jednostki kodu, może naliczać więcej za to samo emoji, dlatego sprawdzanie przed publikacją stosuje regułę każdej platformy osobno.',

  /* ---------------------------------------------------------------------- */
  /* Time zone and daylight saving planner                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'Planer stref czasowych i czasu letniego',
  'web.tools.timeZone.lede':
    'Cotygodniowy termin, który wygląda stabilnie w Twoim kalendarzu, przesuwa się dla połowy Twoich odbiorców dwa razy w roku. To pokazuje gdzie i kiedy.',
  'web.tools.timeZone.explainer.title': 'Dlaczego stały czas lokalny nie jest stałym czasem',
  'web.tools.timeZone.explainer.body':
    'Czas znaczy coś tylko z dołączoną strefą. Strefy zmieniają swoje przesunięcie w datach różniących się w zależności od kraju, a dwa regiony oddalone o pięć godzin w styczniu mogą być oddalone o cztery godziny w kwietniu. Harmonogram przechowywany jako moment plus strefa to przetrwa. Harmonogram przechowywany jako godzina lokalna nie.',
  'web.tools.timeZone.field.date.label': 'Data',
  'web.tools.timeZone.field.time.label': 'Godzina',
  'web.tools.timeZone.field.zone.label': 'Twoja strefa',
  'web.tools.timeZone.field.audience.label': 'Strefy odbiorców',
  'web.tools.timeZone.field.audience.help': 'Wybierz strefy, w których naprawdę są Twoi czytelnicy.',
  'web.tools.timeZone.result.title': 'Ta sama chwila, wszędzie, gdzie wybrałeś',
  'web.tools.timeZone.result.empty': 'Wybierz co najmniej jedną strefę odbiorców.',
  'web.tools.timeZone.result.shift':
    'Zmiana czasu letniego przypada między tą datą a tym samym dniem tygodnia cztery tygodnie później, więc godzina lokalna się przesuwa.',
  'web.tools.timeZone.result.stable': 'Brak zmiany przesunięcia w ciągu najbliższych czterech tygodni.',
  'web.tools.timeZone.result.later': 'Cztery tygodnie później, {time}.',
  'web.tools.timeZone.result.invalidDate': 'Wprowadź datę i godzinę, aby zobaczyć porównanie.',
  'web.tools.timeZone.faq.dst.q': 'W którą stronę przesuwa się godzina?',
  'web.tools.timeZone.faq.dst.a':
    'Zależy to od strefy i kierunku zmiany, dlatego tabela pokazuje rzeczywisty czas lokalny cztery tygodnie później, zamiast opisywać regułę. Przesunięcie dla każdej strefy jest odczytywane z bazy danych stref czasowych Twojej przeglądarki.',
  'web.tools.timeZone.faq.storage.q': 'Jak zaplanowany post powinien przechowywać swój czas?',
  'web.tools.timeZone.faq.storage.a':
    'Jako moment plus strefa IANA wybrana przez osobę, nigdy jako naiwny czas lokalny. Tak robimy to wewnętrznie, i dlatego post zaplanowany przed zmianą zegarka nadal ląduje o zamierzonej godzinie lokalnej.',

  /* ---------------------------------------------------------------------- */
  /* Engagement rate calculator                                              */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': 'Kalkulator wskaźnika zaangażowania',
  'web.tools.engagementRate.lede':
    'Wpisz liczby, które Twój własny panel już Ci pokazuje. To dzieli je na trzy sposoby i na tym się zatrzymuje: żadnego wzorca, żadnego progu „dobry”, niczego, czego naprawdę nie mamy.',
  'web.tools.engagementRate.explainer.title': 'Dlaczego trzy mianowniki, a nie jeden',
  'web.tools.engagementRate.explainer.body':
    'Zasięg, obserwujący i wyświetlenia odpowiadają na różne pytania. Wskaźnik według zasięgu mówi, jak zareagowały osoby, które faktycznie zobaczyły post. Wskaźnik według obserwujących mówi, jaki udział Twoich odbiorców się zaangażował, niezależnie od tego, czy post dotarł do wszystkich. Wskaźnik według wyświetleń liczy każde wyświetlenie, w tym powtórzenia. Porównywanie wskaźnika obliczonego w jeden sposób z wskaźnikiem obliczonym w inny sposób to częste źródło liczby zaangażowania, która wygląda błędnie.',
  'web.tools.engagementRate.field.interactions.label': 'Interakcje',
  'web.tools.engagementRate.field.interactions.help':
    'Polubienia, komentarze, udostępnienia i zapisania zsumowane razem, z posta, który mierzysz.',
  'web.tools.engagementRate.field.reach.label': 'Zasięg',
  'web.tools.engagementRate.field.reach.help': 'Konta, które zobaczyły post co najmniej raz.',
  'web.tools.engagementRate.field.followers.label': 'Obserwujący',
  'web.tools.engagementRate.field.followers.help': 'Wielkość konta w momencie posta.',
  'web.tools.engagementRate.field.impressions.label': 'Wyświetlenia',
  'web.tools.engagementRate.field.impressions.help':
    'Łączna liczba wyświetleń, w tym osoby, która zobaczyła to dwa razy.',
  'web.tools.engagementRate.result.title': 'Wskaźnik zaangażowania, na trzy sposoby',
  'web.tools.engagementRate.result.empty': 'niedostępne',
  'web.tools.engagementRate.result.note':
    'Nie ma uniwersalnego dobrego wskaźnika do porównania. Zależy to od platformy, formatu, wielkości odbiorców i branży, a każda pojedyncza liczba oferowana jako wzorzec to zgadywanie przebrane za dane.',
  'web.tools.engagementRate.basis.reach': 'Według zasięgu',
  'web.tools.engagementRate.basis.followers': 'Według obserwujących',
  'web.tools.engagementRate.basis.impressions': 'Według wyświetleń',
  'web.tools.engagementRate.faq.formula.q': 'Jaki jest rzeczywisty wzór?',
  'web.tools.engagementRate.faq.formula.a':
    'Interakcje podzielone przez wybrany przez Ciebie mianownik, pokazane jako procent. Interakcje oznaczają tutaj polubienia, komentarze, udostępnienia i zapisania zsumowane razem; niektóre platformy raportują je osobno, w takim przypadku zsumuj je sam przed wpisaniem sumy.',
  'web.tools.engagementRate.faq.basis.q': 'Którego mianownika powinienem użyć?',
  'web.tools.engagementRate.faq.basis.a':
    'Tego, który Twoja platforma raportuje obok posta, aby obie liczby pochodziły z tego samego okna pomiarowego. Porównywanie wskaźnika według zasięgu na jednym poście ze wskaźnikiem według obserwujących na innym nie jest uczciwym porównaniem, mimo że oba nazywa się wskaźnikiem zaangażowania.',
} as const;
