/**
 * The in-page product demonstration: the hero demonstration on the home page
 * and the guided walkthrough at `/demo`.
 *
 * Rules that bind this file specifically:
 *
 *  - Every panel on those surfaces is built from the real design system, so a
 *    reader is looking at the interface rather than at a drawing of it. The
 *    copy must therefore never describe something the interface does not do.
 *  - The content is sample content for a company that does not exist, and it
 *    says so in words, in the caption a screen reader reads with the figure.
 *  - No number here is an engagement number. There is no follower count, no
 *    reach figure and no score, because the product has no such data and a
 *    demonstration that invents one is a fabricated dashboard.
 *  - Nothing publishes today. No connector has passed provider verification,
 *    so the demonstration stops at the point the product stops: a scheduled
 *    post, an approval, and a receipt whose publishing half is unavailable.
 *  - The demonstration submits nothing. It has no form, no destination and no
 *    account behind it, and the copy must not suggest otherwise.
 */
export const webDemoMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata and navigation                                                 */
  /* ---------------------------------------------------------------------- */

  'web.meta.demo.title': 'Zobacz, jak działa Relay',
  'web.meta.demo.description':
    'Prowadzona wycieczka po przepływie publikacji, od nowego projektu po potwierdzenie, pokazana w prawdziwym interfejsie z przykładową treścią. Nic jeszcze nie jest publikowane, a wycieczka pokazuje, gdzie przebiega ta granica.',

  'web.demo.nav.label': 'Zobacz, jak to działa',
  'web.demo.nav.summary':
    'Prowadzona wycieczka po produkcie w kolejności, w jakiej go poznajesz, zbudowana z prawdziwego interfejsu z przykładową treścią.',

  /* ---------------------------------------------------------------------- */
  /* The frame every demonstration panel sits in                             */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': 'Demonstracja',
  'web.demo.frame.sample':
    'Demonstracja zbudowana z prawdziwego interfejsu, wypełniona przykładową treścią dla firmy, która nie istnieje. Nie prawdziwe konto. Nic tutaj niczego nie wysyła.',

  'web.demo.control.pause': 'Wstrzymaj demonstrację',
  'web.demo.control.play': 'Odtwórz demonstrację',
  'web.demo.control.replay': 'Odtwórz demonstrację ponownie',

  /* ---------------------------------------------------------------------- */
  /* The home page hero demonstration                                        */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.caption':
    'Jeden szkic staje się wersją na platformę, otrzymuje termin i ląduje w tygodniu. Przykładowa treść, nie prawdziwe konto.',
  'web.demo.hero.more': 'Przejdź przez cały przepływ pracy',

  /* ---------------------------------------------------------------------- */
  /* The walkthrough page                                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': 'Jak to działa, w kolejności, w jakiej to poznajesz',
  'web.demo.lede':
    'Dziewięć kroków, od pustego obszaru roboczego po zapis tego, co się wydarzyło. Każdy pokazuje powierzchnię, na którą naprawdę byś patrzył, z przykładową treścią w środku. Nic na tej stronie nie porusza się samo, więc możesz czytać we własnym tempie.',
  'web.demo.notice.title': 'To jest demonstracja, nie prawdziwe konto',
  'web.demo.notice.body':
    'Każdy panel tutaj to interfejs produktu z przykładową treścią w środku. Żaden łącznik nie przeszedł weryfikacji dostawcy, więc dziś nic nie jest publikowane na żadnej platformie przez ten produkt. Tam, gdzie przepływ pracy się zatrzymuje, strona to mówi zamiast rysować resztę.',
  'web.demo.contents.title': 'Dziewięć kroków',
  'web.demo.stepLabel': 'Krok {position} z {total}',
  'web.demo.next': 'Dalej: {step}',
  'web.demo.closing.pricing': 'Zobacz, ile to kosztuje',
  'web.demo.closing.title': 'To cała pętla',
  'web.demo.closing.body':
    'Nic powyżej nie jest makietą produktu, który mamy nadzieję zbudować. To interfejs w obecnym stanie, z połową dotyczącą publikacji uczciwie oznaczoną jako niedokończoną.',

  /* ---------------------------------------------------------------------- */
  /* The nine steps                                                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': 'Utwórz projekt',
  'web.demo.step.project.body':
    'Projekt zawiera konta, szkice, zatwierdzenia i strefę czasową. Każde zapytanie w produkcie jest ograniczone do jednego projektu, w usłudze aplikacji i ponownie w bazie danych, więc klient nie może przypadkowo zobaczyć innego klienta.',

  'web.demo.step.connect.title': 'Połącz konto',
  'web.demo.step.connect.body':
    'Łączenie przechodzi wyłącznie przez oficjalne API platformy i mówi Ci, czego platforma wymaga od konta, zanim zaczniesz. Dziś każdy łącznik zatrzymuje się na weryfikacji, dlatego każdy wiersz poniżej to mówi zamiast pokazywać zieloną fajkę.',

  'web.demo.step.compose.title': 'Napisz raz, dostosuj do platformy',
  'web.demo.step.compose.body':
    'Piszesz szkic główny. Wybranie jednego konta otwiera nadpisanie tylko dla tego konta, z własnymi limitami i własnym podglądem. Nic, co napiszesz dla LinkedIn, nie zmienia tego, co otrzymuje X, a kontrole pod każdą wersją działają, zanim cokolwiek zostanie zaplanowane.',

  'web.demo.step.variants.title': 'Zobacz, co naprawdę otrzymuje każde konto',
  'web.demo.step.variants.body':
    'Jeden szkic staje się jedną wersją na konto, każda napisana dla platformy, do której trafia: krótsza linijka dla X, pełna notatka wydania dla LinkedIn, podpis i tekst alternatywny dla Instagrama. Edytujesz dowolną z nich, nie dotykając pozostałych, a każda wersja niesie kontrolę, która się do niej stosuje.',

  'web.demo.step.schedule.title': 'Nadaj termin albo oddaj to kolejce',
  'web.demo.step.schedule.body':
    'Termin jest przechowywany jako moment plus strefa czasowa projektu, nigdy jako naiwny czas lokalny, więc zmiana czasu letniego niczego pod Tobą nie przesuwa. Kolejka to druga droga: bierze następny termin dozwolony przez ustawione przez Ciebie reguły.',

  'web.demo.step.calendar.title': 'Obserwuj kalendarz',
  'web.demo.step.calendar.body':
    'Tydzień pokazuje platformę, konto, stan i godzinę dla każdego posta. Przesunięcie jednego to zarówno przycisk, jak i przeciągnięcie, więc kalendarz jest w pełni użyteczny z klawiatury.',

  'web.demo.step.receipt.title': 'Przeczytaj potwierdzenie później',
  'web.demo.step.receipt.body':
    'Każda próba zapisuje niezmienne potwierdzenie: kto je napisał, kto je zatwierdził, na podstawie jakiej zasady, w jakiej chwili. Połowę tego zapisu dotyczącą publikacji zapisuje przebieg publikacji, czyli część, która jeszcze nie istnieje.',

  /* ---------------------------------------------------------------------- */
  /* Panel labels                                                            */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': 'Projekt',
  'web.demo.project.zone': 'Strefa czasowa: {zone}',
  'web.demo.project.scope':
    'Szkice, konta, zatwierdzenia i potwierdzenia należą do tego projektu i nigdzie indziej.',

  'web.demo.accounts.label': 'Konta w tej marce',
  'web.demo.accounts.state': 'Weryfikacja niekompletna',
  'web.demo.accounts.note':
    'Każdy wiersz niósłby kondycję tokena, przyznane uprawnienia i ostatni udany post. Żadne z nich nie mogą dziś publikować.',

  'web.demo.master.label': 'Szkic główny',
  'web.demo.master.project': 'W marce {project}',

  'web.demo.variants.label': 'Co otrzymuje każde konto',

  'web.demo.schedule.label': 'Zaplanowano',
  'web.demo.schedule.value': '{when} w strefie {zone}',
  'web.demo.schedule.approval': 'Przed wysłaniem czegokolwiek wymagane jest jedno zatwierdzenie.',
  'web.demo.schedule.queue':
    'Kolejka to druga droga: wybiera następny termin dozwolony przez Twoje reguły, w tej strefie czasowej.',

  'web.demo.week.label': 'Tydzień',
  'web.demo.week.caption':
    'Te same trzy posty w kalendarzu, odczytane w strefie czasowej projektu.',
  'web.demo.week.empty': 'Nic zaplanowane',

  'web.demo.receipt.label': 'Potwierdzenie dotychczasowe',
  'web.demo.receipt.pending':
    'Co zostało wysłane, co odpowiedziała platforma, zewnętrzny identyfikator posta i stały link są zapisywane przez przebieg publikacji. Pozostają niedostępne, dopóki łącznik nie przejdzie weryfikacji dostawcy.',
  'web.demo.receipt.field.externalId': 'Zewnętrzny identyfikator posta',
  'web.demo.receipt.field.permalink': 'Stały link',

  /* ---------------------------------------------------------------------- */
  /* Sample content                                                          */
  /*                                                                         */
  /* Northbound Tools is the sample company the marketing pages already use.  */
  /* Its handles sit on the reserved `.example` domain and its people are     */
  /* first names with no surname, so nothing here can be mistaken for a real  */
  /* customer, a real account or a real endorsement.                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools (przykład)',
  'web.demo.sample.actor': 'Ada, przykładowa koleżanka z zespołu',
  'web.demo.sample.approver': 'Ravi, przykładowy recenzent',
  'web.demo.sample.policy': 'Jedno zatwierdzenie przed wysłaniem',
  'web.demo.sample.master':
    'Northbound 2.4 wychodzi dzisiaj. Importy są szybsze, wyszukiwanie ma skrót klawiszowy, a błąd eksportu zgłoszony przez dwoje z was jest naprawiony.',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'Northbound 2.4 już jest. Szybsze importy, wyszukiwanie klawiaturą, a ten błąd eksportu jest naprawiony.',
  'web.demo.sample.x.check': 'Liczba znaków i kolejność wątku',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    'Northbound 2.4 wychodzi dzisiaj. Notatka wydania w pełni wyjaśnia zmiany w imporcie i naprawę eksportu.',
  'web.demo.sample.linkedin.check': 'Rola organizacji i długość posta',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    'To samo zdjęcie wydania, z podpisem napisanym dla feedu i tekstem alternatywnym napisanym przez człowieka.',
  'web.demo.sample.instagram.check': 'Typ konta, proporcje obrazu i tekst alternatywny',

  /* ---------------------------------------------------------------------- */
  /* The nine scene product tour                                             */
  /*                                                                         */
  /* The step names are the indicator's button labels, so they are short      */
  /* enough to sit in a row of nine and specific enough to be worth clicking. */
  /* They are also the labels of the stacked walkthrough a reader gets with   */
  /* reduced motion or no JavaScript, which is the same tour with the timing  */
  /* taken out rather than a reduced version of it.                           */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': 'Kroki wycieczki',
  'web.demo.tour.jump': 'Pokaż krok {position}: {step}',
  'web.demo.tour.step.project': 'Utwórz projekt',
  'web.demo.tour.step.connect': 'Połącz konta',
  'web.demo.tour.step.compose': 'Skomponuj raz',
  'web.demo.tour.step.variants': 'Dostosuj do platformy',
  'web.demo.tour.step.validate': 'Sprawdź to',
  'web.demo.tour.step.schedule': 'Nadaj termin',
  'web.demo.tour.step.week': 'Zobacz tydzień',
  'web.demo.tour.step.publish': 'Publikuj i zapisuj',
  'web.demo.tour.step.digest': 'Przeczytaj podsumowanie',

  /* ---------------------------------------------------------------------- */
  /* Checks (step 5)                                                         */
  /*                                                                         */
  /* Only checks the composer genuinely runs today: the per account character */
  /* limit (`validation.text_too_long`), alt text on every image             */
  /* (`validation.alt_text_missing`), and whether a first comment is allowed  */
  /* on the account it was written for (the `firstComment` capability).       */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': 'Kontrole przed zaplanowaniem',
  'web.demo.validate.check.length': 'Limit znaków, dla konta',
  'web.demo.validate.check.lengthDetail':
    'Każda wersja jest mierzona względem limitu, jaki platforma daje temu kontu.',
  'web.demo.validate.check.altText': 'Tekst alternatywny na każdym obrazie',
  'web.demo.validate.check.altTextDetail':
    'Obraz bez opisu lub bez oznaczenia jako dekoracyjny zatrzymuje planowanie.',
  'web.demo.validate.check.firstComment': 'Pierwszy komentarz dozwolony tutaj',
  'web.demo.validate.check.firstCommentDetail':
    'Pierwszy komentarz jest oferowany tylko na kontach, których platforma go obsługuje.',
  'web.demo.validate.note':
    'Te kontrole działają w kompozytorze, zanim cokolwiek zostanie zaplanowane, i ponownie, zanim cokolwiek zostanie wysłane.',

  /* ---------------------------------------------------------------------- */
  /* Publish and receipt (step 8)                                            */
  /*                                                                         */
  /* The steps a scheduled post has really passed are completed. Everything   */
  /* the publish run would write is pending, because no connector has passed  */
  /* provider verification, so there is no publish run to write it.           */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': 'Publikacja i jej zapis',
  'web.demo.live.step.approved': 'Zatwierdzone przez {approver}',
  'web.demo.live.step.queued': 'W kolejce na swój termin',
  'web.demo.live.step.sent': 'Wysłane do platformy',
  'web.demo.live.step.confirmed': 'Potwierdzone przez platformę',
  'web.demo.live.badge.pending': 'Nieopublikowane',
  'web.demo.live.badge.live': 'Na żywo',
  'web.demo.live.pending':
    'Ostatnie dwa kroki są zapisywane przez przebieg publikacji. Żaden łącznik nie przeszedł jeszcze weryfikacji dostawcy, więc pozostają w oczekiwaniu, a zewnętrzny identyfikator posta i stały link pozostają niedostępne.',

  /* ---------------------------------------------------------------------- */
  /* The weekly digest (step 9)                                              */
  /*                                                                         */
  /* Sentences about what the product did, never engagement figures. There is */
  /* no reach, no impression count and no score here, because the product has */
  /* none to read and a digest that invented one would be a fabricated        */
  /* dashboard with a friendlier voice.                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': 'Twój tydzień, w zdaniach',
  'web.demo.digest.sample': 'Przykład',
  'web.demo.digest.line.variants':
    'W tym tygodniu z jednego szkicu wyszły trzy wersje natywne dla platformy.',
  'web.demo.digest.line.earliest': 'Wtorkowy poranek był Twoim najwcześniejszym terminem.',
  'web.demo.digest.line.approval': 'Każda wersja została zatwierdzona, zanim trafiła do kolejki.',
  'web.demo.digest.line.alt': 'Każdy obraz niósł tekst alternatywny napisany przez człowieka.',
  'web.demo.digest.footer': 'Analizy na żywo pojawią się tutaj w miarę publikowania Twoich postów.',

  /* ---------------------------------------------------------------------- */
  /* The three added walkthrough steps                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': 'Sprawdź to przed zaplanowaniem',
  'web.demo.step.validate.body':
    'Kompozytor mierzy każdą wersję względem konta, dla którego jest napisana: limit znaków, jaki to konto naprawdę ma, tekst alternatywny na każdym obrazie oraz to, czy platforma w ogóle oferuje pierwszy komentarz. Wersja, która nie przejdzie kontroli, nie może zostać zaplanowana.',

  'web.demo.step.publish.title': 'Publikuj i zachowaj zapis',
  'web.demo.step.publish.body':
    'Przebieg publikacji wysyła każdą wersję w jej chwili, zapisuje, co odpowiedziała platforma, i tworzy niezmienne potwierdzenie. Ten przebieg to część, która jeszcze nie istnieje, więc ostatnie dwa kroki poniżej są w oczekiwaniu, a nie narysowane jako ukończone.',

  'web.demo.step.digest.title': 'Przeczytaj cotygodniowe podsumowanie',
  'web.demo.step.digest.body':
    'Podsumowanie opisuje w zdaniach, co zrobił produkt: ile wersji wyszło z jednego szkicu, który termin był najwcześniejszy, co zostało zatwierdzone. Nie zawiera liczb zaangażowania, ponieważ analizy pochodzą z platform po opublikowaniu posta, a nic jeszcze nie jest publikowane.',
} as const;
