/**
 * The per platform scheduler pages.
 *
 * Rules that bind this file specifically:
 *
 *  - Not one string here names a platform, states a character ceiling, a file
 *    size or a capability. Every one of those comes from the generated
 *    datasets the page reads, so a page physically cannot claim support the
 *    connectors do not have. The strings below are labels and framing only.
 *  - The framing is always "what the platform requires" and "what this product
 *    intends to support". Never "what you can publish". No connector has
 *    passed its definition of done, so nothing publishes.
 *  - Anything a platform does not document is `common.unavailable`, never a
 *    zero and never a guess.
 *
 * Note: this locale file translates only the `web.schedule.*` and
 * `web.meta.schedule*` keys. The `web.specs.*` and `web.meta.specs*` keys in
 * the English source stay on the reviewed English fallback for beta locales
 * and are intentionally not duplicated here.
 */
export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'Planowanie, platforma po platformie',
  'web.meta.schedule.description':
    'Czego każda platforma w grupie startowej wymaga od połączonego konta, jakie limity wymusza jej oficjalne API i jak daleko ten produkt zaszedł względem nich.',
  'web.meta.schedulePlatform.title': 'Planowanie dla {platform}',
  'web.meta.schedulePlatform.description':
    'Czego {platform} wymaga od połączonego konta, jakie limity wymusza jej oficjalne API i które części tego ten produkt zbudował.',

  /* ---------------------------------------------------------------------- */
  /* Index                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Planowanie, platforma po platformie',
  'web.schedule.index.lede':
    'Jedna strona na platformę w grupie startowej. Każda podaje, czego platforma wymaga od połączonego konta, jakie limity wymusza jej oficjalne API i na jakim etapie jest budowa. Każda liczba niesie dokument, z którego pochodzi, i datę, kiedy ktoś go przeczytał.',
  'web.schedule.index.listLabel': 'Platformy w grupie startowej',
  'web.schedule.index.cohortNote':
    'Grupa startowa to zbiór platform, dla których budowany jest ten produkt. To plan, a nie lista dostępności.',
  'web.schedule.index.limitsKnown': 'Limity zarejestrowane',
  'web.schedule.index.limitsUnknown': 'Limity jeszcze niezarejestrowane',

  /* ---------------------------------------------------------------------- */
  /* Platform page                                                          */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Planowanie dla {platform}',
  'web.schedule.platform.lede':
    'Czego {platform} wymaga od połączonego konta, jakie limity wymusza jej oficjalne API i przeciwko którym z nich ten produkt został dotąd zbudowany.',

  'web.schedule.notice.title': 'Na {platform} nic jeszcze nie jest publikowane',
  'web.schedule.notice.body':
    'Żaden łącznik nie przeszedł swojej definicji ukończenia i żaden nie jest zweryfikowany produkcyjnie. Ta strona opisuje, czego wymaga platforma i co ten produkt zamierza wspierać. Nie opisuje działającego planera.',

  'web.schedule.requirements.title': 'Czego wymaga {platform}',
  'web.schedule.requirements.accountTypes': 'Typ konta',
  'web.schedule.requirements.restriction': 'Ograniczenie platformy',
  'web.schedule.requirements.cost': 'Koszt API',
  'web.schedule.requirements.unavailable.title': 'Brak jeszcze sprawdzonego rekordu łącznika',
  'web.schedule.requirements.unavailable.body':
    'Ta platforma dołączyła do grupy startowej po ostatnim badaniu łączników, więc nie ma datowanego rekordu jej wymagań dotyczących konta do pokazania. Pojawi się tutaj, gdy tylko ktoś przeczyta oficjalną dokumentację i to zarejestruje.',
  'web.schedule.requirements.apiSource': 'Oficjalna dokumentacja API',
  'web.schedule.requirements.policySource': 'Zasady platformy',

  /* ---------------------------------------------------------------------- */
  /* Limits                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Limity wymuszane przez {platform}',
  'web.schedule.limits.lede':
    'Odczytane dla świeżo połączonego konta bez podwyższonych uprawnień. Platforma może podnieść lub obniżyć dowolny z nich bez informowania kogokolwiek, dlatego każdy zestaw niesie datę, kiedy został odczytany.',
  'web.schedule.limits.unavailable.title': 'Limity niezarejestrowane dla {platform}',
  'web.schedule.limits.unavailable.body':
    'Ta wersja nie zawiera adaptera dla tej platformy, więc nie ma zarejestrowanego limitu do pokazania. Wymyślona liczba byłaby gorsza niż jej brak.',
  'web.schedule.limits.sourceLabel': 'Oficjalna dokumentacja platformy',

  'web.schedule.limits.text': 'Tekst posta',
  'web.schedule.limits.title_field': 'Pole tytułu',
  'web.schedule.limits.countingUnit': 'Jak liczone są znaki',
  'web.schedule.limits.links': 'Jak liczone są linki',
  'web.schedule.limits.images': 'Obrazy na post',
  'web.schedule.limits.videos': 'Filmy na post',
  'web.schedule.limits.videoDuration': 'Długość filmu',
  'web.schedule.limits.imageBytes': 'Największy obraz',
  'web.schedule.limits.gifBytes': 'Największy obraz animowany',
  'web.schedule.limits.videoBytes': 'Największy film',
  'web.schedule.limits.documentBytes': 'Największy dokument',
  'web.schedule.limits.altText': 'Tekst alternatywny',
  'web.schedule.limits.mimeTypes': 'Akceptowane typy plików',
  'web.schedule.limits.markdown': 'Znaczniki formatowania',

  'web.schedule.value.characters':
    '{count, plural, one {# znak} few {# znaki} many {# znaków} other {# znaku}}',
  'web.schedule.value.files':
    '{count, plural, =0 {Brak} one {# plik} few {# pliki} many {# plików} other {# pliku}}',
  'web.schedule.value.durationRange': 'Między {min} a {max}',
  'web.schedule.value.durationMax': 'Do {max}',
  'web.schedule.value.markdownYes': 'Akceptowane',
  'web.schedule.value.markdownNo': 'Publikowane jako zwykłe znaki',

  'web.schedule.unit.utf16':
    'Według jednostki kodu UTF-16, co większość edytorów zgłasza jako liczbę znaków.',
  'web.schedule.unit.grapheme':
    'Według grafemu, więc emoji złożone z kilku punktów kodowych nadal kosztuje jeden znak.',
  'web.schedule.unit.weighted':
    'Według schematu ważonego, w którym większość znaków niełacińskich kosztuje dwa zamiast jednego.',

  'web.schedule.link.none': 'Linki nie są liczone do limitu.',
  'web.schedule.link.actual': 'Link kosztuje dokładnie tyle znaków, ile zajmuje.',
  'web.schedule.link.fixed':
    'Każdy link jest przepisywany na skracacz platformy i kosztuje {count, plural, one {# znak} few {# znaki} many {# znaków} other {# znaku}} niezależnie od jego rzeczywistej długości.',

  /* ---------------------------------------------------------------------- */
  /* Capability state                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'Co jest zbudowane dla {platform}',
  'web.schedule.capabilities.lede':
    'Generowane z rejestru łączników, nie pisane tutaj. „Nieoferowane przez platformę” to fakt o platformie i jest ostateczny. „Jeszcze niezbudowane” to fakt o tym produkcie i jest uczciwym ustawieniem domyślnym, dopóki żaden łącznik nie przeszedł swojej definicji ukończenia.',
  'web.schedule.capabilities.unavailable.title': 'Brak jeszcze rekordu możliwości dla {platform}',
  'web.schedule.capabilities.unavailable.body':
    'W tej wersji nie ma adaptera, więc rejestr nie ma nic do zgłoszenia. Wiersz pojawi się w macierzy możliwości, gdy tylko będzie coś realnego do powiedzenia.',
  'web.schedule.capabilities.matrixLink': 'Przeczytaj pełną macierz możliwości',

  'web.schedule.next.title': 'Dokąd dalej',
  'web.schedule.next.body':
    'Macierz możliwości zawiera każdą platformę i każdą możliwość w jednej tabeli. Strony przypadków użycia opisują przepływy pracy, wokół których budowany jest ten produkt.',
} as const;
