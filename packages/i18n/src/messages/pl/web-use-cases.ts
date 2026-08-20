/**
 * The three project-led use case pages.
 *
 * These describe workflows, not capabilities. The rule that binds every string
 * here: a sentence may describe how the product is designed and what has been
 * built, and may never imply that anything reaches a platform. Nothing
 * publishes, so "what works today" is written in the past and present tense of
 * the build, not of a live service.
 */
export const webUseCaseMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.useCases.title': 'Przypadki użycia',
  'web.meta.useCases.description':
    'Trzy przepływy pracy, wokół których budowany jest ten produkt: prowadzenie kilku klientów w jednym miejscu, zatwierdzanie pracy przed publikacją i przeniesienie jednego pomysłu na kilka platform bez przepisywania go.',
  'web.meta.useCase.clients.title': 'Zarządzanie wieloma klientami',
  'web.meta.useCase.clients.description':
    'Osobne marki, osobne połączone konta, osobne zatwierdzenia i osobne raportowanie, dla zespołów publikujących w imieniu innych osób.',
  'web.meta.useCase.approvals.title': 'Przepływy zatwierdzania',
  'web.meta.useCase.approvals.description':
    'Jak szkic staje się zatwierdzonym postem: kto go sprawdza, co unieważnia zatwierdzenie i dlaczego ta sama reguła obowiązuje na każdej powierzchni.',
  'web.meta.useCase.crossPlatform.title': 'Publikacja na wielu platformach',
  'web.meta.useCase.crossPlatform.description':
    'Jeden szkic główny, jedna wersja dostosowana do każdej platformy, zweryfikowana względem zarejestrowanych limitów każdej platformy, zanim cokolwiek zostanie zaplanowane.',

  /* ---------------------------------------------------------------------- */
  /* Shared furniture                                                       */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': 'Przypadki użycia',
  'web.useCases.index.lede':
    'Trzy przepływy pracy, wokół których budowany jest ten produkt. Każda strona mówi, ile ten przepływ kosztuje dziś zespół, jak produkt jest zaprojektowany, aby sobie z nim radzić, i które części są rzeczywiście zbudowane.',
  'web.useCases.index.listLabel': 'Przypadki użycia',

  'web.useCases.notice.title': 'To opisuje projekt, a nie działającą usługę',
  'web.useCases.notice.body':
    'Żaden łącznik nie jest zweryfikowany w produkcji, więc nic na tej stronie nigdzie jeszcze nie publikuje. Tam, gdzie część przepływu jest zbudowana, jest to napisane. Tam, gdzie nie jest, jest to napisane również.',

  'web.useCases.section.problem': 'Problem',
  'web.useCases.section.approach': 'Jak zaprojektowano produkt',
  'web.useCases.section.today': 'Co jest faktycznie zbudowane',
  'web.useCases.section.related': 'Powiązane',

  /* ---------------------------------------------------------------------- */
  /* Managing multiple clients                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': 'Zarządzanie wieloma klientami',
  'web.useCases.clients.lede':
    'Praca dla jednego klienta nigdy nie powinna być o jedno błędne kliknięcie od odbiorców innego klienta.',
  'web.useCases.clients.problem':
    'Większość zespołów rozdziela klientów przez uważność. Jedno wspólne konto zawiera każdą połączoną stronę, jeden kalendarz zawiera każdy harmonogram, a jedyną rzeczą stojącą między szkicem klienta a niewłaściwymi odbiorcami jest osoba patrząca na ekran o 18:00. Gdy ktoś odchodzi z zespołu, rozdzielenie odchodzi razem z nawykiem.',
  'web.useCases.clients.approach1':
    'Marka jest jednostką rozdzielenia. Połączone konta, szkice, kolejki, media i potwierdzenia należą do marki, a członek widzi tylko marki, do których został dodany.',
  'web.useCases.clients.approach2':
    'Rozdzielenie jest egzekwowane trzykrotnie: przy uwierzytelnianiu, w usłudze aplikacji, która autoryzuje działanie, i w samej bazie danych poprzez zabezpieczenia na poziomie wiersza. Bycie zalogowanym nigdy nie jest traktowane jako uprawnienie.',
  'web.useCases.clients.approach3':
    'Raportowanie podąża za tą samą granicą, więc raport dla poszczególnego klienta jest domyślnym kształtem, a nie arkuszem kalkulacyjnym składanym ręcznie przez kogoś.',
  'web.useCases.clients.today':
    'Marki, członkostwo ograniczone do marki oraz stojące za nimi zasady bezpieczeństwa na poziomie wiersza są zbudowane i przetestowane, w tym testy próbujące odczytów między markami, które muszą zawieść. Plany są dobierane według liczby marek potrzebnych zespołowi. Z żadnej marki nic nie jest jeszcze publikowane na żadnej platformie.',

  /* ---------------------------------------------------------------------- */
  /* Approval workflows                                                     */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': 'Przepływy zatwierdzania',
  'web.useCases.approvals.lede':
    'Zatwierdzenie jest coś warte tylko wtedy, gdy to, co zatwierdzono, jest tym, co zostaje opublikowane.',
  'web.useCases.approvals.problem':
    'Zatwierdzenia zwykle żyją poza narzędziem, które publikuje. Zrzut ekranu trafia do klienta, klient odpowiada tak, a potem tekst się zmienia. Zatwierdzenie odnosi się teraz do szkicu, którego nikt nie ma, a narzędzie nie ma o tym pojęcia, więc publikuje to, co ostatnio dostało.',
  'web.useCases.approvals.approach1':
    'Zatwierdzenie jest przypięte dokładnie do treści, która została sprawdzona. Edycja zatwierdzonego szkicu unieważnia zatwierdzenie i mówi, które pole się zmieniło, zamiast po cichu przenosić starą decyzję dalej.',
  'web.useCases.approvals.approach2':
    'Recenzent może zatwierdzić, poprosić o zmiany lub odrzucić, a komentarz jest wymagany dla wszystkiego poza zatwierdzeniem, więc autor nigdy nie musi zgadywać, co poprawić.',
  'web.useCases.approvals.approach3':
    'Reguła żyje we wspólnej warstwie aplikacji, więc aplikacja webowa, REST API, serwer MCP, CLI i webhooki wszystkie jej przestrzegają. Żadna powierzchnia nie ma skrótu omijającego recenzję.',
  'web.useCases.approvals.today':
    'Stany zatwierdzenia, powierzchnia recenzji, reguły ponownego zatwierdzania i stojące za nimi zdarzenia audytu są zbudowane. To, co nie jest zbudowane, to ostatni krok, ponieważ żaden łącznik nie przeszedł swojej definicji ukończenia, więc zatwierdzony post nie ma jeszcze dokąd trafić.',

  /* ---------------------------------------------------------------------- */
  /* Cross-platform publishing                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': 'Publikacja na wielu platformach',
  'web.useCases.crossPlatform.lede':
    'Jeden pomysł, jedna edycja i wersja na każdą platformę, która respektuje to, co ta platforma naprawdę akceptuje.',
  'web.useCases.crossPlatform.problem':
    'Publikowanie tego samego tekstu wszędzie daje wersję obciętą na jednej platformie, brakującą wymaganego tytułu na innej i niosącą link, który trzecia po cichu usuwa. Alternatywa, ręczne przepisywanie pięć razy, to miejsce, gdzie naprawdę idzie praca.',
  'web.useCases.crossPlatform.approach1':
    'Szkic główny zawiera pomysł. Każde wybrane konto otrzymuje własną wersję, a edycja szkicu głównego stosuje się tylko tam, gdzie pasuje, jasno mówiąc, które cele nie mogły jej przyjąć i dlaczego.',
  'web.useCases.crossPlatform.approach2':
    'Walidacja działa względem zarejestrowanych limitów dla każdej platformy, liczonych tak, jak liczy je ta platforma, więc limit znaków jest sprawdzany w grafemach tam, gdzie platforma używa grafemów, i w jednostkach ważonych tam, gdzie używa tych.',
  'web.useCases.crossPlatform.approach3':
    'Każdy limit platformy pokazany gdziekolwiek na tej stronie jest generowany z rejestru łączników i niesie dokument, z którego pochodzi, oraz datę, kiedy ktoś go przeczytał.',
  'web.useCases.crossPlatform.today':
    'Kompozytor, wersje dla poszczególnych celów, reguły walidacji i wygenerowany zbiór limitów są zbudowane. Krok publikacji nie: żaden łącznik nie jest zweryfikowany w produkcji, więc zwalidowany szkic można zaplanować wewnętrznie, ale nie może dotrzeć do platformy.',
} as const;
