/**
 * The comparison pages' chrome.
 *
 * What belongs here: state words, section headings, labels, and the three
 * disclosure sentences whose numbers are read at render time from the code
 * that decides them. What deliberately does not: the claims themselves. A
 * comparison table is several hundred words of dated, sourced content per
 * page, and the English catalog is merged into one object that every page load
 * resolves, so those claims live in typed modules under
 * `apps/web/src/features/comparisons/entries` and are loaded per slug.
 *
 * The `web.compare.*` namespace is the older `/compare` index. This namespace
 * is the per comparison page, kept separate so the index copy that beta locales
 * already carry is not disturbed.
 */
export const webComparisonMessages = {
  'web.comparison.eyebrow': 'Porównanie',

  'web.comparison.state.yes': 'Tak',
  'web.comparison.state.no': 'Nie',
  'web.comparison.state.partial': 'Częściowo',
  'web.comparison.state.notVerified': 'Niezweryfikowane',

  'web.comparison.label.claim': 'Twierdzenie',
  'web.comparison.label.sourceRead': 'Przeczytano {date}',
  'web.comparison.label.checked': 'Każdy wiersz sprawdzony {date}',
  'web.comparison.label.nextReview': 'Następne sprawdzenie zaplanowane na {date}',
  'web.comparison.label.backToIndex': 'Wszystkie porównania',

  'web.comparison.table.title': 'Co robi każda opcja',
  'web.comparison.table.caption':
    'Jedno twierdzenie na wiersz, ze źródłem stojącym za każdą odpowiedzią',

  'web.comparison.bestFor.title': 'Które pasuje',
  'web.comparison.bestFor.ours': 'Wybierz ten produkt, gdy',
  'web.comparison.bestFor.alternative': 'Wybierz {name}, gdy',

  'web.comparison.notDo.title': 'Czego ten produkt nie robi',
  'web.comparison.notDo.body':
    'Te zdania są odczytywane z kodu, który je ustala, a nie wpisywane ręcznie, więc ta sekcja nie może oddalić się od tego, czym produkt naprawdę dziś jest.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {Żaden łącznik nie ukończył weryfikacji dostawcy, więc dziś nic nie jest publikowane na żadnej platformie przez ten produkt.} one {# łącznik ukończył weryfikację dostawcy. Każda inna platforma w grupie startowej to nadal zamiar.} few {# łączniki ukończyły weryfikację dostawcy. Każda inna platforma w grupie startowej to nadal zamiar.} many {# łączników ukończyło weryfikację dostawcy. Każda inna platforma w grupie startowej to nadal zamiar.} other {# łącznika ukończyło weryfikację dostawcy. Każda inna platforma w grupie startowej to nadal zamiar.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {Żaden język nie ukończył ludzkiej weryfikacji, więc każdy język interfejsu jest oznaczony jako beta.} one {# język ukończył ludzką weryfikację. Każdy inny język jest oznaczony jako beta.} few {# języki ukończyły ludzką weryfikację. Każdy inny język jest oznaczony jako beta.} many {# języków ukończyło ludzką weryfikację. Każdy inny język jest oznaczony jako beta.} other {# języka ukończyło ludzką weryfikację. Każdy inny język jest oznaczony jako beta.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Każdy poziom cenowy został ustalony i ma rzeczywistą cenę.} one {# poziom cenowy jest wciąż nierozstrzygniętym miejscem tymczasowym i nie można go kupić.} few {# poziomy cenowe są wciąż nierozstrzygniętymi miejscami tymczasowymi i nie można ich kupić.} many {# poziomów cenowych jest wciąż nierozstrzygniętymi miejscami tymczasowymi i nie można ich kupić.} other {# poziomu cenowego jest wciąż nierozstrzygniętym miejscem tymczasowym i nie można go kupić.}}',

  'web.comparison.notVerified.title': 'Co oznacza niezweryfikowane',
  'web.comparison.notVerified.body':
    'Komórka mówi niezweryfikowane, gdy faktu nie można było odczytać w oficjalnej publicznej dokumentacji drugiej opcji w dniu sprawdzenia. Nigdy nie jest uzupełniana z pamięci ani kopiowana z podsumowania napisanego przez kogoś innego.',

  'web.comparison.method.title': 'Jak powstaje ta strona',
  'web.comparison.method.body':
    'Każdy wiersz to jedno twierdzenie, z dokumentem, z którego pochodzi, i datą, kiedy ktoś go przeczytał. Nie ma zrzutów ekranu konkurencji, skopiowanych opisów funkcji ani wymyślonych słabości.',
  'web.comparison.method.cadence':
    'Każde porównanie jest ponownie sprawdzane co najmniej raz na 90 dni, a natychmiast, gdy platforma lub opcja zmienia coś, co stwierdza dany wiersz.',

  'web.comparison.questions.title': 'Pytania',
  'web.comparison.sources.title': 'Źródła cytowane na tej stronie',

  'web.comparison.index.title': 'Opublikowane porównania',
  'web.comparison.index.body':
    'Każda strona porównuje ten produkt z kategorią alternatyw, których fakty można odczytać z oficjalnej dokumentacji. Nazwany produkt otrzymuje stronę, gdy jego aktualne fakty można odczytać z jego własnych publicznych stron, i nie wcześniej.',
  'web.comparison.index.checked': 'Sprawdzono {date}',
} as const;
