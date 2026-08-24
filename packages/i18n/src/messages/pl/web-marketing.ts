/**
 * The public marketing site and public documentation surfaces.
 *
 * Rules that bind this file specifically, beyond the catalog rules in
 * `lint.ts`:
 *
 *  - Every claim here is either a product fact we control (price, channel
 *    allowance, surfaces) or a provider fact that carries a source link and a
 *    verification date in the page that renders it. No adjective stands in for
 *    a number.
 *  - Nothing here promises reach, ranking, engagement or "going" anywhere.
 *  - Nothing here describes AI image or AI video generation as a Post Array
 *    feature, because it is not one.
 *  - No integration is called official until the provider has approved it. The
 *    connector matrix uses `capability.level.*` from `connections.ts` so the
 *    marketing site and the product cannot drift apart.
 *  - Legal wording that must be drafted by counsel is marked with
 *    `web.legal.counselPending.*` rather than guessed at here.
 */
export const webMarketingMessages = {
  /* ---------------------------------------------------------------------- */
  /* Shared marketing furniture                                              */
  /* ---------------------------------------------------------------------- */

  'web.brand.name': 'Przekaźnik',
  'web.brand.tagline': 'Wielojęzyczna płaszczyzna kontroli publikacji dla ludzi i agentów.',
  'web.skipToContent': 'Przeskocz do głównej treści',
  'web.nav.label': 'Nawigacja w witrynie',
  'web.nav.openMenu': 'Menu',
  'web.nav.closeMenu': 'Zamknij menu',
  'web.nav.footerLabel': 'Nawigacja stopką',

  'web.cta.startTrial': 'Zacznij za darmo, bez karty',
  'web.cta.seePricing': 'Zobacz cenę',
  'web.cta.seeCapabilities': 'Przeczytaj macierz możliwości',
  'web.cta.readDocs': 'Przeczytaj dokumentację',

  'web.label.lastReviewed': 'Ostatnia recenzja {date}',
  'web.label.nextReview': 'Następna recenzja {date}',
  'web.label.researchDate': 'Badane {date}',
  'web.label.officialSource': 'Oficjalne źródło',
  'web.label.onThisPage': 'Na tej stronie',
  'web.label.provider': 'Platforma',
  'web.label.capability': 'Możliwości',

  'web.notFound.title': 'Pod tym adresem nie ma strony',
  'web.notFound.body':
    'Link może być nieaktualny lub wycofaliśmy stronę. Strony, które przestają być dokładne, są wycofywane, a nie pozostawiane, a dziennik zmian rejestruje to, gdy tak się stanie.',
  'web.notFound.action': 'Przejdź do strony głównej',

  'web.correction.title': 'Znalazłem coś złego na tej stronie',
  'web.correction.body':
    'Zasady platformy zmieniają się i popełniamy błędy. Wyślij adres URL i to, co jest niedokładne, a my poprawimy stronę lub ją wycofamy.',
  'web.correction.email': 'korekty@przekaźnik.przykład',

  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.home.title': 'Post Array, wielojęzyczna płaszczyzna kontroli publikacji',
  'web.meta.home.description':
    'Zamień jeden pomysł źródłowy w treść natywną dla platformy, zatwierdź go raz, opublikuj niezawodnie za pośrednictwem oficjalnych interfejsów API platformy i dowiedz się, co dalej ulepszyć.',
  'web.meta.product.title': 'Jak działa przekaźnik',
  'web.meta.product.description':
    'Przegląd biura wydawniczego: utwórz raz, dostosuj dla każdej platformy, zweryfikuj pod kątem rzeczywistych limitów, zatwierdź, zaplanuj, opublikuj i zachowaj potwierdzenie.',
  'web.meta.integrations.title': 'Platformy Post Array publikuje w',
  'web.meta.integrations.description':
    'Z jakimi platformami łączy się Post Array, co dzisiaj potrafi każde połączenie i na co nie pozwala sama platforma.',
  'web.meta.capabilities.title': 'Macierz możliwości złączy',
  'web.meta.capabilities.description':
    'Tabela możliwości na platformę wygenerowana na podstawie naszych definicji złączy, oddzielająca to, co zbudowaliśmy, od tego, czego platforma nie oferuje.',
  'web.meta.creators.title': 'Przekaźnik dla twórców',
  'web.meta.creators.description':
    'Dla twórców solowych publikujących ten sam pomysł w kilku formatach i językach bez pięciokrotnego przepisywania go.',
  'web.meta.agencies.title': 'Przekaźnik dla agencji',
  'web.meta.agencies.description':
    'Oddzielenie klientów, zatwierdzenia, udostępniane linki do recenzji, rachunki i raporty dla zespołów publikujących w imieniu innych osób.',
  'web.meta.developers.title': 'Przekaźnik dla programistów',
  'web.meta.developers.description':
    'Jeden backend za aplikacją internetową, REST API, zdalny serwer MCP, CLI i podpisane webhooki. Te same zasady zatwierdzania na każdej powierzchni.',
  'web.meta.pricing.title': 'Ceny',
  'web.meta.resources.title': 'Zasoby',
  'web.meta.resources.description':
    'Stan, dziennik zmian, dokumentacja, metodologia, porównania, radar narzędzi i katalog możliwości.',
  'web.meta.status.title': 'Stan',
  'web.meta.status.description':
    'Aktualny stan każdej powierzchni przekaźnika i każdego złącza oraz historia incydentów.',
  'web.meta.changelog.title': 'Dziennik zmian',
  'web.meta.changelog.description': 'Co dostarczono, co zmieniono w złączach i co poprawiono.',
  'web.meta.docs.title': 'Dokumentacja',
  'web.meta.docs.description':
    'REST API, serwer MCP, CLI i dokumentacja webhooka do budowania na Post Array.',
  'web.meta.methodology.title': 'Metodologia',
  'web.meta.methodology.description':
    'Jak badamy twierdzenia dotyczące platform, jak je datujemy, jak porównujemy inne produkty i jak poprawiamy błędy.',
  'web.meta.compare.title': 'Porównania',
  'web.meta.compare.description':
    'Uczciwe, aktualne porównania z innymi narzędziami do publikowania, w tym dla tego, dla kogo każde z nich jest najlepsze.',
  'web.meta.toolRadar.title': 'Radar narzędzi kreatywnych',
  'web.meta.toolRadar.description':
    'Datowany, poddany przeglądowi redakcyjnemu katalog specjalistycznych narzędzi kreatywnych, zawierający ograniczenia, zastrzeżenia dotyczące praw i ujawnienia handlowe.',
  'web.meta.opportunities.title': 'Możliwości promocji',
  'web.meta.opportunities.description':
    'Wybrany katalog miejsc, w których można umieścić listę produktów, wprowadzić je na rynek lub omówić, z własnymi zasadami przesyłania dla każdego miejsca docelowego.',
  'web.meta.legal.title': 'Prawo i zasady',
  'web.meta.legal.description':
    'Warunki, prywatność, dopuszczalne użycie, wykorzystanie sztucznej inteligencji, pliki cookie, podmioty podprzetwarzające, zwroty pieniędzy, prawa autorskie, bezpieczeństwo, dostępność, warunki dla programistów i warunki partnerskie.',

  /* ---------------------------------------------------------------------- */
  /* Home                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.home.promise':
    'Zamień jeden pomysł źródłowy w treść natywną dla platformy, zatwierdź go raz, opublikuj niezawodnie i dowiedz się, co dalej ulepszyć.',
  'web.home.lede':
    'Post Array to biuro wydawnicze dla ludzi, którzy są odpowiedzialni za to, co wychodzi. Piszesz raz, dostosowujesz się do każdej platformy, widzisz rzeczywiste limity przed zaplanowaniem, uzyskujesz potrzebną zgodę, publikujesz za pośrednictwem oficjalnych interfejsów API platformy i zachowujesz potwierdzenie każdego posta.',

  'web.home.example.title': 'Jeden pomysł, pięć wersji natywnych dla platformy',
  'web.home.example.body':
    'Kompozytor zaczyna od wersji wzorcowej. Wybranie jednego konta powoduje otwarcie zmiany tylko dla tego konta, z własnymi limitami na żywo i własnym podglądem. Nic, co napiszesz dla LinkedIn, nie zmieni tego, co otrzymuje X.',
  'web.home.example.column.account': 'Konto',
  'web.home.example.column.variant': 'Co otrzymuje to konto',
  'web.home.example.column.check': 'Sprawdzone przed planowaniem',
  'web.home.example.caption':
    'Ilustracyjna kompozycja. Pokazane limity i ustawienia pochodzą z definicji łącznika dla każdej platformy, a nie z szacunków.',
  'web.home.example.x.account': 'X, @w kierunku północnym',
  'web.home.example.x.variant': 'Tekst główny, skrócony, plus wątek z dwoma postami',
  'web.home.example.x.check':
    'Liczba znaków, kolejność wątków, szacowany koszt API dla postu z linkiem',
  'web.home.example.linkedin.account': 'LinkedIn, narzędzia w kierunku północnym',
  'web.home.example.linkedin.variant': 'Dłuższy tekst główny z załączonym dokumentem',
  'web.home.example.linkedin.check': 'Rola w organizacji, długość postu, typ dokumentu',
  'web.home.example.instagram.account': 'Instagram, @northbound.tools',
  'web.home.example.instagram.variant':
    'Kwadrowane przycięcie tego samego obrazu, podpis przepisany na potrzeby kanału',
  'web.home.example.instagram.check':
    'Typ konta profesjonalnego, proporcje, obecny tekst alternatywny',
  'web.home.example.youtube.account': 'YouTube, w kierunku północnym',
  'web.home.example.youtube.variant': 'Ten sam klip co film Short, z własnym tytułem i opisem',
  'web.home.example.youtube.check':
    'Zakres przesyłania, stan audytu, prywatność, do której trafi przesyłanie',
  'web.home.example.bluesky.account': 'Błękitne niebo, w kierunku północnym.example',
  'web.home.example.bluesky.variant': 'Tekst główny z kartą łącza',
  'web.home.example.bluesky.check':
    'Liczba znaków, rozdzielczość karty łącza, obecność tekstu alternatywnego',

  'web.home.pillars.title': 'W czym przekaźnik jest dobry',
  'web.home.pillars.confidence.title': 'Publikuj bez obaw',
  'web.home.pillars.confidence.body':
    'Prawdziwy podgląd każdego konta, deterministyczne zasady i kontrole platformy, zanim cokolwiek trafi do kolejki, zatwierdzenie wymagane przez Twój obszar roboczy, niezmienne potwierdzenie z zewnętrznym identyfikatorem poczty oraz stan zdrowia każdego połączenia.',
  'web.home.pillars.confidence.proof':
    'Każdy zapis zewnętrzny zawiera klucz idempotencji, więc awaria procesu roboczego po przyjęciu posta przez platformę nie powoduje utworzenia drugiego.',
  'web.home.pillars.adapt.title': 'Dostosuj zamiast powielać',
  'web.home.pillars.adapt.body':
    'W przypadku różnych platform można zastąpić jedno konto na raz i dokonać transkreacji zamiast dosłownego tłumaczenia, korzystając z glosariusza projektu i wyznaczonego recenzenta w każdym języku.',
  'web.home.pillars.adapt.proof':
    'Interfejs jest dostępny w wybranych językach. Adaptacja treści obejmuje 20 języków treści i każdy z nich można sprawdzić przed publikacją.',
  'web.home.pillars.loop.title': 'Zamknij pętlę',
  'web.home.pillars.loop.body':
    'Analizy określające nazwę metryki, platformę, która ją zgłosiła, mianownik i datę ostatniego odświeżenia. Jeśli platforma czegoś nie zgłasza, Post Array to mówi, zamiast pokazywać zero.',
  'web.home.pillars.loop.proof':
    'Wpis jest porównywany z Twoją własną medianą, a nie z wynikiem, którego nikt nie może sprawdzić.',
  'web.home.pillars.anywhere.title': 'Pracuj tam, gdzie już jesteś',
  'web.home.pillars.anywhere.body':
    'Aplikacja internetowa, interfejs API REST, zdalny serwer MCP, interfejs CLI i podpisane webhooki wywołują te same usługi aplikacji, te same reguły autoryzacji i te same walidatory.',
  'web.home.pillars.anywhere.proof':
    'Agent nie może ominąć zasad zatwierdzania, korzystając z innej platformy, ponieważ zasady są wymuszane w usłudze, a nie w interfejsie.',
  'web.home.pillars.economics.title': 'Ekonomia, którą możesz przewidzieć',
  'web.home.pillars.economics.body':
    'Jedna cena, każda dostępna funkcja, 30 aktywnych kanałów i nieograniczona liczba członków zespołu. Korzystanie z platformy, które dostawca pobiera za operację, jest rozliczane według kosztów i pokazywane przed potwierdzeniem działania.',
  'web.home.pillars.economics.proof':
    'Nie ma systemu przyznawania punktów za generowanie obrazu lub wideo, ponieważ Post Array nie generuje multimediów.',

  'web.home.honest.title': 'Czego nie robi przekaźnik',
  'web.home.honest.lede':
    'To są granice, a nie zapowiedź planu działania. Jeśli jeden z nich ulegnie zmianie, zostanie to najpierw zmienione w dzienniku zmian.',
  'web.home.honest.noMedia':
    'Brak generowania obrazów AI i brak generowania wideo AI. Post Array dostosowuje, zatwierdza, publikuje i mierzy media, które przynosisz.',
  'web.home.honest.noAutomationOfEngagement':
    'Brak automatycznych polubień, obserwacji, ponownych postów, niechcianych odpowiedzi i bezpośrednich wiadomości. Żadnych zasobników angażujących i żadnego sfabrykowanego zaangażowania.',
  'web.home.honest.noUnofficial':
    'Brak automatyzacji przeglądarki, brak odtwarzania plików cookie, brak skrobania i brak nieoficjalnych punktów końcowych publikowania. Tylko oficjalne interfejsy API platformy.',
  'web.home.honest.noPromises':
    'Nie obiecujemy zasięgu, rankingu ani zaangażowania. Przekaźnik może powiedzieć, co się stało i co dalej przetestować. Nie może powiedzieć, co zrobi publiczność.',
  'web.home.honest.noUnattendedPublishing':
    'Domyślnie brak publikowania bez nadzoru. Agent może sporządzać, zatwierdzać i żądać zatwierdzenia. Decyzję podejmuje człowiek, zanim cokolwiek stanie się publiczne, chyba że celowo zrezygnujesz z określonej polityki.',

  'web.home.surfaces.title': 'Pięć powierzchni, jeden backend',
  'web.home.surfaces.body':
    'Te same przypadki użycia, te same kontrole najmu, te same walidatory i te same przepływy pracy przy publikowaniu. Powierzchnia to droga do środka, a nie droga na skróty.',
  'web.home.surfaces.web': 'Aplikacja internetowa',
  'web.home.surfaces.webBody':
    'Kompozytor, kalendarz, zatwierdzenia, analizy, połączenia i ustawienia.',
  'web.home.surfaces.api': 'API REST',
  'web.home.surfaces.apiBody':
    'Klawisze o określonym zakresie, klucze idempotencji przy każdym zapisie, paginacja kursora, błędy wpisane.',
  'web.home.surfaces.mcp': 'Zdalny serwer MCP',
  'web.home.surfaces.mcpBody':
    'Przesyłanie strumieniowe HTTP, OAuth, na zakresy narzędzi i podgląd przed każdym wywołaniem.',
  'web.home.surfaces.cli': 'CLI',
  'web.home.surfaces.cliBody':
    'Stabilne dane wyjściowe do odczytu maszynowego dla skryptów i ciągłej integracji.',
  'web.home.surfaces.webhooks': 'Podpisane webhooki',
  'web.home.surfaces.webhooksBody':
    'Opublikuj wyniki, decyzje o zatwierdzeniu i stan połączenia z ponownym dostarczeniem.',

  'web.home.closing.title': 'Zacznij od jednego konta i jednego posta',
  'web.home.closing.body':
    'Połącz jedno konto, przygotuj jeden post, obejrzyj przebieg weryfikacji, zaplanuj go i przeczytaj potwierdzenie. To cały produkt w około dziesięć minut.',

  /* ---------------------------------------------------------------------- */
  /* Product                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.product.title': 'Biuro wydawnicze',
  'web.product.lede':
    'Na każdym kroku należy odpowiedzieć na siedem pytań bez klikania czegokolwiek: co jest publikowane, gdzie i jaką wersję otrzymuje każde konto, kiedy i w jakiej strefie czasowej, kto ją zatwierdził, ile może to kosztować i co się stało.',

  'web.product.step.source.title': 'Źródło',
  'web.product.step.source.body':
    'Rozpocznij od briefu, pliku, który już masz, elementu RSS lub prośby od agenta. Zaimportowane multimedia zachowują podane przez Ciebie pochodzenie, w tym informacje o tym, skąd pochodzą i kto posiada prawa.',
  'web.product.step.compose.title': 'Utwórz raz, a następnie zastąp',
  'web.product.step.compose.body':
    'Wersja główna steruje każdym celem. Wybranie jednego konta powoduje otwarcie zastąpienia tylko dla tego konta: jego własny tekst, własne przycięcie multimediów, własne ustawienia, własny licznik limitów na żywo i własny podgląd. Zresetowanie zastąpienia przywraca urządzenie główne w jednej akcji i najpierw pokazuje różnicę.',
  'web.product.step.validate.title': 'Weryfikuj, zanim cokolwiek zostanie umieszczone w kolejce',
  'web.product.step.validate.body':
    'Weryfikacja jest deterministyczna i działa na serwerze. Sprawdza ograniczenia platformy na podstawie migawki możliwości wersjonowanych, typu konta, tekstu alternatywnego, praw do multimediów, reguł duplikacji i rytmu, rozdzielczości wzmianek i miejsc docelowych oraz szacowanego kosztu użytkowania platformy. Każdy problem określa cel, do którego należy, i podaje sposób jego rozwiązania.',
  'web.product.step.approve.title': 'Zatwierdź raz',
  'web.product.step.approve.body':
    'Zatwierdzanie to polityka dotycząca obszaru roboczego, a nie nawyk. Recenzent widzi każdy cel, każdy wariant, strefę czasową, stan prywatności i szacowany koszt na jednym ekranie, a to działa na telefonie. Treść zmieniona po zatwierdzeniu wymaga ponownego zatwierdzenia.',
  'web.product.step.schedule.title': 'Harmonogram w strefie czasu rzeczywistego',
  'web.product.step.schedule.body':
    'Każdy zaplanowany post przechowuje godzinę i strefę czasową IANA, nigdy naiwny czas lokalny. Zmiany czasu letniego są wyświetlane przed potwierdzeniem, a nie wykrywane później.',
  'web.product.step.publish.title': 'Opublikuj i zachowaj paragon',
  'web.product.step.publish.body':
    'Każdy cel jest wysyłany z kluczem idempotencji. Cel, który się nie powiedzie, nie wycofuje celu, któremu się udało, a ten stan ma swoją własną nazwę: częściowo opublikowany. Każdy wynik generuje niezmienne potwierdzenie z zewnętrznym identyfikatorem poczty, identyfikatorem żądania, historią prób i dokładnym błędem, jeśli taki wystąpił.',
  'web.product.step.learn.title': 'Dowiedz się',
  'web.product.step.learn.body':
    'Metryki są normalizowane, nazywane, przypisywane platformie, która je zgłosiła i oznaczane czasem aktualności. Wskaźnik, którego platforma nie raportuje, jest oznaczony jako niedostępny i podany jest powód. Nigdy nie jest renderowana jako zero.',

  'web.product.shot.caption':
    'Zrzuty ekranu na tej stronie pochodzą z działającego produktu. Dopóki powierzchnia nie jest na tyle kompletna, że można ją uczciwie sfotografować, opisujemy ją słowami, zamiast rysować.',
  'web.product.shot.pending': 'Zrzut ekranu oczekujący na przechwycenie',
  'web.product.shot.pendingReason':
    'Ta nawierzchnia jest wciąż w budowie. Opublikujemy raczej rzeczywiste ujęcie niż ilustrację.',

  'web.product.states.title': 'Stany, których nikt nie lubi projektować',
  'web.product.states.body':
    'Narzędzie do publikowania ocenia się na podstawie złego dnia, a nie dobrego. Każdy z nich ma zaprojektowany ekran, proste zdanie i następną akcję.',
  'web.product.states.partial':
    'Częściowo opublikowane: które cele są aktywne, które zawiodły i dlaczego.',
  'web.product.states.revoked':
    'W momencie wysyłki znaleziono unieważniony token ze ścieżką ponownego połączenia.',
  'web.product.states.rateLimited':
    'Limit przepustowości platformy, czas resetowania i zawartość kolejki za nim.',
  'web.product.states.duplicate':
    'Duplikat lub blok kadencji z regułą, która została uruchomiona, i ścieżką odwołania.',
  'web.product.states.offline':
    'Offline podczas tworzenia: nic, co napisałeś, nie zostanie utracone.',
  'web.product.states.permission':
    'Działanie, na które nie pozwala Twoja rola, podaj nazwę roli, która to umożliwia.',

  /* ---------------------------------------------------------------------- */
  /* Integrations and capability matrix                                      */
  /* ---------------------------------------------------------------------- */

  'web.integrations.title': 'Platformy',
  'web.integrations.lede':
    'Przekaźnik łączy się za pośrednictwem oficjalnych interfejsów API platformy. Każdy łącznik ma nazwanego właściciela, zarejestrowany adres URL zasad i datę przeglądu. Złącze nie jest wymienione jako obsługiwane, dopóki nie przejdzie definicji łącznika jako gotowe.',
  'web.integrations.reviewNotice.title':
    'Żadne złącze nie jest opisane jako oficjalne przed zatwierdzeniem go przez platformę',
  'web.integrations.reviewNotice.body':
    'Kilka platform wymaga sprawdzenia aplikacji, zanim będzie można ją opublikować w imieniu klienta. Jeśli ocena jest nierozstrzygnięta, łącznik to stwierdza i dokładnie opisuje, co jest ograniczone do czasu pozytywnej oceny.',
  'web.integrations.accountTypes': 'Typy kont, na których ten łącznik może publikować',
  'web.integrations.restriction': 'Ograniczenia, które powinieneś znać przed połączeniem',
  'web.integrations.cost': 'Koszt użytkowania platformy',
  'web.integrations.viewMatrix': 'Zobacz wszystkie możliwości tej platformy',

  'web.capabilities.title': 'Macierz możliwości złączy',
  'web.capabilities.lede':
    'Wygenerowano na podstawie tych samych definicji złączy, które czyta produkt, a następnie sprawdzono przez osobę przed publikacją. Marketing nie może obiecać czegoś, czego nie może zrobić adapter.',
  'web.capabilities.legend.title': 'Jak czytać tę tabelę',
  'web.capabilities.legend.body':
    'Cztery stany i różnica między dwoma środkowymi ma znaczenie. Jeszcze nie zbudowane to nasze zaległości. Brak oferty na platformie to fakt dotyczący platformy, którego nie da się obejść żadnym narzędziem.',
  'web.capabilities.tableCaption':
    'Możliwości według platformy. Każda komórka nazywa swój stan słownie i kolorem.',
  'web.capabilities.snapshot': 'Wersja definicji złączy {version}, zrecenzowano {date}',
  'web.capabilities.sourceNote':
    'Każde twierdzenie dotyczące platformy w tej tabeli zawiera linki do oficjalnej dokumentacji, z której pochodzi, oraz do daty, w której ostatni raz je czytaliśmy.',

  /* ---------------------------------------------------------------------- */
  /* Audience pages                                                          */
  /* ---------------------------------------------------------------------- */

  'web.creators.title': 'Dla twórców',
  'web.creators.lede':
    'Publikujesz ten sam pomysł w kilku formatach, czasem w więcej niż jednym języku i stanowisz cały zespół. Praca, jaką wykonuje Post Array, to przepisywanie, ponowne kadrowanie i sprawdzanie.',
  'web.creators.job.adapt.title': 'Napisz raz, wyślij pięć wersji natywnych',
  'web.creators.job.adapt.body':
    'Wersja główna niesie ze sobą tę ideę. Każde konto ma długość, kadrowanie, ustawienia i ton, jakich oczekuje platforma, a przed zatwierdzeniem możesz zobaczyć je wszystkie obok siebie.',
  'web.creators.job.languages.title': 'Opublikuj w innym języku bez zgadywania',
  'web.creators.job.languages.body':
    'Transkreacja zachowuje intencję, a nie słowa, korzysta ze słownika Twojego projektu i zaznacza, czy przeczytał go natywny recenzent. Nic nie jest publikowane w języku, za który nie możesz ręczyć, chyba że tak powiesz.',
  'web.creators.job.rights.title': 'Przechowuj dokumentację swoich praw w pliku',
  'web.creators.job.rights.body':
    'Media niosą ze sobą informację, skąd pochodzą, kto ma prawa i czy zostały utworzone za pomocą narzędzia generatywnego. Platformy coraz częściej pytają. Przekaźnik przechowuje Twoją odpowiedź w zasobie, zamiast pytać Cię ponownie.',
  'web.creators.job.cost.title': 'Poznaj koszt, zanim opublikujesz',
  'web.creators.job.cost.body':
    'X opłaty za operację i opłaty wyższe za post zawierający adres URL. Post Array szacuje, że zanim to potwierdzisz, więc tydzień z ciężkim łączem to decyzja, a nie niespodzianka na fakturze.',
  'web.creators.notFor.title': 'Czego to nie jest',
  'web.creators.notFor.body':
    'Przekaźnik nie generuje obrazów ani filmów, nie uruchamia automatyzacji zaangażowania i nie przewiduje, jak post będzie działać. Jeśli to są narzędzia, których potrzebujesz, inne produkty je obsługują i wolimy, abyś wiedział teraz.',

  'web.agencies.title': 'Dla agencji',
  'web.agencies.lede':
    'Publikujesz w imieniu innych osób, co oznacza, że uznanie autorstwa, zatwierdzenie i udokumentowanie to część pracy, a nie drobiazg.',
  'web.agencies.job.separation.title': 'Oddzielenie klientów, które wytrzymuje',
  'web.agencies.job.separation.body':
    'Każdy obszar roboczy jest izolowany na poziomie bazy danych, jak i w aplikacji. Zapytanie przekraczające granicę obszaru roboczego kończy się niepowodzeniem w Postgresie, nie tylko w ścieżce kodu, którą ktoś mógłby zapomnieć.',
  'web.agencies.job.approval.title': 'Zatwierdzenia, z których klient może faktycznie skorzystać',
  'web.agencies.job.approval.body':
    'Recenzent widzi każdy cel, każdy wariant, harmonogram z jego strefą czasową i szacunkowym kosztem na jednym ekranie, a ekran działa na telefonie. Decyzje o zatwierdzeniu są rejestrowane, kto, kiedy i co widział.',
  'web.agencies.job.receipts.title': 'Dowody niezręcznej rozmowy',
  'web.agencies.job.receipts.body':
    'Każda publikacja generuje niezmienne potwierdzenie z zewnętrznym identyfikatorem poczty i pełną historią prób. Gdy klient pyta, czy coś poszło nie tak o dziewiątej, odpowiedź zawiera znacznik czasu i identyfikator platformy.',
  'web.agencies.job.roles.title': 'Role odpowiadające sposobowi podziału pracy',
  'web.agencies.job.roles.body':
    'Właściciel, administrator, menedżer, redaktor, osoba zatwierdzająca, analityk i przeglądający, w zakresie według projektu i konta. Nieograniczona liczba członków zespołu, ponieważ pobieranie opłat za miejsce powoduje, że agencje dzielą się loginami, co stanowi problem bezpieczeństwa.',
  'web.agencies.limits.title': 'Granica wyraźnie określona',
  'web.agencies.limits.body':
    'Jeden plan obejmuje 30 aktywnych kanałów społecznościowych. Kanał to jedno konto społecznościowe, strona, profil, grupa lub połączenie z publikacją. Jeśli potrzebujesz więcej niż 30, powiedz nam, czego potrzebujesz, a my damy Ci prostą odpowiedź, a nie ukryty poziom.',

  'web.developers.title': 'Dla programistów',
  'web.developers.lede':
    'Publikowanie to część przepływu pracy, w której błąd jest publiczny i trwały. Post Array zapewnia jeden backend, błędy typowania, idempotencję przy każdym zapisie i model zatwierdzania, którego agent nie może obejść.',
  'web.developers.surface.api.title': 'API REST',
  'web.developers.surface.api.body':
    'Klucze API o ograniczonym zakresie, klucz idempotencji wymagany przy każdym zapisie, paginacja kursora i wpisana koperta błędu zawierająca stabilny kod, klucz wiadomości i oczyszczone szczegóły. Żaden ładunek dostawcy nigdy nie jest zwracany do Ciebie w stanie surowym.',
  'web.developers.surface.mcp.title': 'Zdalny serwer MCP',
  'web.developers.surface.mcp.body':
    'Streaming HTTP z OAuth. Narzędzia są szczegółowe i każdy z nich deklaruje swoje skutki uboczne. Czytanie, pisanie, prośba o zatwierdzenie, planowanie i publikowanie to odrębne zakresy, więc model, który może tworzyć wersję roboczą, nie może być publikowany.',
  'web.developers.surface.cli.title': 'CLI',
  'web.developers.surface.cli.body':
    'Każde polecenie obsługuje dane wyjściowe czytelne maszynowo o stabilnym kształcie, więc skrypt może je przeanalizować, a zadanie ciągłej integracji może się nie powieść.',
  'web.developers.surface.webhooks.title': 'Podpisane webhooki',
  'web.developers.surface.webhooks.body':
    'Opublikuj wyniki, decyzje o zatwierdzeniu, stan połączenia i wyniki walidacji, podpisane, odporne na powtarzanie i możliwe do ponownego dostarczenia z pulpitu nawigacyjnego.',
  'web.developers.safety.title': 'Model bezpieczeństwa agenta',
  'web.developers.safety.body':
    'Poświadczenia agenta to konto usługi o określonym zakresie, a nie kopia sesji osoby. Zawiera ograniczenia według marki, konta, lokalizacji, domeny, rytmu i przewidywania, a serwer ponownie autoryzuje każde połączenie, zamiast ufać hostowi agenta.',
  'web.developers.safety.injection':
    'Strony internetowe, kanały, komentarze i odpowiedzi platform są traktowane jako niezaufane dane. Dane wyjściowe modelu są ponownie sprawdzane deterministycznie, ponieważ model stwierdzający, że post jest w porządku, nie jest decyzją dotyczącą bezpieczeństwa.',
  'web.developers.safety.killSwitch':
    'Każdy agent i każdy obszar roboczy ma wyłącznik awaryjny, który zatrzymuje oczekujące prace bez usuwania go.',
  'web.developers.openSource.title': 'Otwarte elementy',
  'web.developers.openSource.body':
    'Kontrakt łącznika, interfejs CLI, przykłady schematów, definicje narzędzi MCP i symulator dostawcy to części, które musisz zbudować w oparciu o Post Array bez konta piaskownicy. Jeżeli repozytorium nie zostało jeszcze opublikowane, ta strona informuje o tym, a nie prowadzi do niczego.',

  /* ---------------------------------------------------------------------- */
  /* Pricing                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.pricing.title': 'Jeden plan',
  'web.pricing.intervalHeading': 'Wybierz sposób płatności',
  'web.pricing.monthlyLabel': 'Rozliczane co miesiąc',
  'web.pricing.annualLabel': 'Rozliczane co roku',
  'web.pricing.annualDetail': '300 USD pobierane raz w roku.',
  'web.pricing.monthlyDetail': '29 USD pobierane co miesiąc.',
  'web.pricing.perMonthNote':
    'Ceny podane są w dolarach amerykańskich. Polar dolicza wszelkie podatki od sprzedaży lub VAT obowiązujące w miejscu, w którym się znajdujesz.',

  'web.pricing.beside.title': 'Na co się zgadzasz',
  'web.pricing.beside.channels':
    '30 aktywnych kanałów społecznościowych. Kanał to jedno konto społecznościowe, strona, profil, grupa lub połączenie z publikacją.',
  'web.pricing.beside.members':
    'Nieograniczona liczba członków zespołu, obszarów roboczych i grup marek. Nie ma opłaty za miejsce.',
  'web.pricing.beside.fairUse':
    'Nieograniczona liczba wersji roboczych, zaplanowanych postów i przechowywanych potwierdzeń zgodnie z opublikowanymi zasadami dozwolonego użytku i polityką antyspamową. Te mechanizmy kontroli mają chronić Twoje połączone konta i obowiązują w identyczny sposób w przypadku każdego subskrybenta.',
  'web.pricing.beside.metered':
    'X opłaty za operację API i wyższe opłaty za post zawierający adres URL. Post Array przekazuje to po kosztach, szacuje to przed potwierdzeniem działania i pokazuje to w użyciu. Inne opłaty za platformę są przekazywane tylko wtedy, gdy zostaną ujawnione przed akcją.',
  'web.pricing.beside.noMedia':
    'Generowanie obrazów AI i generowanie wideo AI nie są uwzględnione i nie są sprzedawane. Nie ma napisów końcowych, ponieważ Post Array nie generuje multimediów.',
  'web.pricing.beside.data':
    'Po zakończeniu subskrypcji nic nie jest usuwane. Możesz wyeksportować swoje treści, rachunki i statystyki, a także możesz je samodzielnie usunąć.',

  'web.pricing.included.title': 'Uwzględnione w obu przedziałach',
  'web.pricing.compare.title': 'Dlaczego nie ma tutaj tabeli porównawczej',
  'web.pricing.compare.body':
    'Istnieje tabela porównawcza pokazująca, co traci tańszy plan. Plan jest jeden, więc tabela będzie miała jedną kolumnę. Jeśli kiedykolwiek dodamy poziom, poinformujemy, co się przeniosło i dlaczego w dzienniku zmian, zanim zmieni się strona z cenami.',

  'web.pricing.testimonials.title': 'Na tej stronie nie ma jeszcze żadnych ofert klientów',
  'web.pricing.testimonials.body':
    'Cena pojawia się dopiero wtedy, gdy klient ją napisał, wyraził na to pisemną zgodę, a my możemy wskazać pracę, którą opisuje. Do tego czasu pusta przestrzeń jest bardziej szczera niż ściana wymyślonych pochwał.',

  'web.pricing.faq.title': 'Pytania, które ludzie zadają przed zapłaceniem',
  'web.pricing.faq.channels.q': 'Co się stanie, jeśli przejdę ponad 30 kanałów',
  'web.pricing.faq.channels.a':
    'Nic nie jest odłączane i nic nie jest usuwane. Kanały przekraczające limit stają się tylko do odczytu. Ty wybierasz, które z nich pozostaną aktywne, a my poinformujemy Cię, zanim to nastąpi.',
  'web.pricing.faq.refund.q': 'Czy zwracasz pieniądze',
  'web.pricing.faq.refund.a':
    'Tak, zgodnie z opublikowanymi zasadami zwrotów i anulowania rezerwacji oraz zawsze, gdy wymaga tego prawo konsumenckie. Rozliczeniami zajmuje się firma Polar, która jest zarejestrowanym sprzedawcą, a zwroty środków są dokonywane za pośrednictwem firmy Polar.',
  'web.pricing.faq.selfHost.q': 'Czy mogę to uruchomić samodzielnie',
  'web.pricing.faq.selfHost.a':
    'Nie dzisiaj. Decyzja, czy będzie dostępna edycja hostowana samodzielnie i na jakiej licencji, jest kwestią otwartą. Opublikujemy odpowiedź, zamiast ją sugerować.',
  'web.pricing.faq.xCost.q': 'Ile będzie mnie faktycznie kosztować X',
  'web.pricing.faq.xCost.a':
    'To zależy od tego, ile postów publikujesz i ile z nich zawiera adres URL, ponieważ X różnie je wycenia. Post Array szacuje każde działanie przed jego potwierdzeniem i sumuje je w widoku użycia. Nie zaznaczamy tego.',

  /* ---------------------------------------------------------------------- */
  /* Resources index                                                         */
  /* ---------------------------------------------------------------------- */

  'web.resources.title': 'Zasoby',
  'web.resources.lede':
    'Prawda operacyjna o produkcie i badania leżące u podstaw wszystkiego, co twierdzimy na temat platformy.',
  'web.resources.status.body':
    'Aktualny stan każdej powierzchni i każdego złącza, z historią incydentów.',
  'web.resources.changelog.body': 'Co dostarczono, co zmieniono w złączu i co poprawiliśmy.',
  'web.resources.docs.body': 'Dokumentacja API REST, MCP, CLI i webhooka.',
  'web.resources.methodology.body':
    'Jak badamy, datujemy, pozyskujemy i korygujemy każde twierdzenie dotyczące platformy.',
  'web.resources.compare.body': 'Datane porównania z innymi narzędziami, w tym dla każdego z nich.',
  'web.resources.capabilities.body':
    'Na platformę, na możliwości, wygenerowane na podstawie definicji łączników.',
  'web.resources.toolRadar.body':
    'Specjalistyczne narzędzia kreatywne, przestarzałe, z ograniczeniami i ujawnieniami.',
  'web.resources.opportunities.body':
    'Wybrane miejsca, w których można uruchamiać, tworzyć listy lub wnosić wkład, z regułami każdego miejsca docelowego.',
  'web.resources.legal.body':
    'Warunki, prywatność, dopuszczalne użytkowanie, wykorzystanie sztucznej inteligencji, bezpieczeństwo i pozostała część zestawu zasad.',
  'web.resources.guides.title': 'Przewodniki i przepływy pracy',
  'web.resources.guides.empty': 'Żaden przewodnik nie został jeszcze opublikowany',
  'web.resources.guides.emptyBody':
    'Standard redakcyjny wymaga oryginalnych danych produktów, powtarzalnego przepływu pracy, głównych źródeł platformy z datą weryfikacji i wyznaczonego redaktora. Pierwsze przewodniki publikują, gdy je spotkają.',

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.status.title': 'Stan',
  'web.status.lede':
    'Stan każdej powierzchni przekaźnika i każdego złącza. Stan złącza obejmuje nasz adapter i interfejs API platformy, od którego jest zależny.',
  'web.status.updated': 'Statusy ustawiamy ręcznie. Ostatnia aktualizacja {time}.',
  'web.status.surfaces.title': 'Powierzchnie',
  'web.status.connectors.title': 'Złącza',
  'web.status.level.operational': 'Działa normalnie',
  'web.status.level.degraded': 'Zdegradowany',
  'web.status.level.partial': 'Częściowa awaria',
  'web.status.level.outage': 'Awaria',
  'web.status.level.maintenance': 'Planowana konserwacja',
  'web.status.level.notLive': 'Jeszcze nie na żywo',
  'web.status.notLiveBody':
    'To złącze jest zbudowane, ale nie obsługuje jeszcze ruchu klientów, więc nie ma o czym pisać.',
  'web.status.incidents.title': 'Historia incydentów',
  'web.status.incidents.empty': 'Nie zarejestrowano żadnego zdarzenia',
  'web.status.incidents.emptyBody':
    'Ta strona celowo zaczyna być pusta. Publikujemy wszystkie zdarzenia, które miały wpływ na publikację, w tym te spowodowane przez nasze własne błędy, wraz z harmonogramem i zmianami późniejszymi.',
  'web.status.incident.started': 'Rozpoczęto {time}',
  'web.status.incident.resolved': 'Rozwiązano {time}',
  'web.status.incident.impact': 'Wpływ',
  'web.status.incident.cause': 'Przyczyna',
  'web.status.incident.followUp': 'Co się później zmieniło',
  'web.status.subscribe.title': 'Otrzymaj informację, gdy coś się zepsuje',
  'web.status.subscribe.body':
    'Kondycja połączenia, błędy publikowania i zdarzenia na platformie są dostarczane jako podpisane webhooki do Twojego własnego punktu końcowego. Nie ma jeszcze osobnej listy mailingowej statusu.',

  /* ---------------------------------------------------------------------- */
  /* Changelog                                                               */
  /* ---------------------------------------------------------------------- */

  'web.changelog.title': 'Dziennik zmian',
  'web.changelog.lede':
    'Zmiany produktu, zmiany złączy i poprawki. Zmiana możliwości mająca wpływ na to, co możesz publikować, pojawia się tutaj, zanim pojawi się gdziekolwiek indziej w tej witrynie.',
  'web.changelog.kind.shipped': 'Wysłano',
  'web.changelog.kind.changed': 'Zmieniono',
  'web.changelog.kind.fixed': 'Naprawiono',
  'web.changelog.kind.connector': 'Złącze',
  'web.changelog.kind.correction': 'Korekta',
  'web.changelog.kind.security': 'Bezpieczeństwo',
  'web.changelog.empty': 'Nic nie zostało jeszcze wysłane publicznie',
  'web.changelog.emptyBody':
    'Przekaźnik jest w budowie. Pierwszy wpis tutaj jest pierwszą rzeczą, z której może skorzystać klient, a nie kamieniem milowym na temat nas samych.',

  /* ---------------------------------------------------------------------- */
  /* Docs shell                                                              */
  /* ---------------------------------------------------------------------- */

  'web.docs.title': 'Dokumentacja',
  'web.docs.lede':
    'Jeden backend, cztery sposoby. Każda sekcja dokumentuje te same przypadki użycia, więc koncepcja, której nauczysz się w REST API, jest tą samą koncepcją w MCP i CLI.',
  'web.docs.section.start.title': 'Pierwsze kroki',
  'web.docs.section.start.body':
    'Uwierzytelnianie, obszary robocze, projekty i Twój pierwszy opublikowany post.',
  'web.docs.section.api.title': 'API REST',
  'web.docs.section.api.body': 'Zasoby, paginacja, idempotencja, kody błędów i limity szybkości.',
  'web.docs.section.mcp.title': 'Serwer MCP',
  'web.docs.section.mcp.body':
    'Transport, OAuth, katalog narzędzi, zakresy i uzgadnianie zatwierdzenia.',
  'web.docs.section.cli.title': 'CLI',
  'web.docs.section.cli.body':
    'Zainstaluj, uwierzytelnij i wygeneruj kontrakt wyjściowy do odczytu maszynowego.',
  'web.docs.section.webhooks.title': 'Webhooki',
  'web.docs.section.webhooks.body':
    'Katalog zdarzeń, weryfikacja podpisu, ponowne próby i ponowne dostarczenie.',
  'web.docs.section.connectors.title': 'Złącza',
  'web.docs.section.connectors.body':
    'Według wymagań platformy, typów kont, limitów i znanych ograniczeń.',
  'web.docs.section.errors.title': 'Odniesienie do błędu',
  'web.docs.section.errors.body': 'Każdy kod błędu, jego przyczyna i co z tym zrobić.',
  'web.docs.pending': 'Jeszcze nieopublikowane',
  'web.docs.pendingBody':
    'Ta sekcja została napisana w oparciu o dostarczony interfejs API i publikowana wraz z nim. Wolelibyśmy nie pokazywać niczego poza dokumentacją punktu końcowego, który może ulec zmianie.',
  'web.docs.principles.title': 'Na czym możesz polegać',
  'web.docs.principles.idempotency':
    'Każdy zapis wymaga klucza idempotencji. Ponowne odtworzenie żądania z tym samym kluczem zwraca oryginalny wynik, zamiast tworzyć drugi post.',
  'web.docs.principles.errors':
    'Każdy błąd zawiera stabilny kod, klucz wiadomości i oczyszczone szczegóły. Kody nie zmieniają znaczenia pomiędzy wersjami.',
  'web.docs.principles.versioning':
    'Przełomowe zmiany otrzymują nową wersję i ogłoszony okres wycofania. Zmiany addytywne nie.',
  'web.docs.principles.scopes':
    'Czytanie, redagowanie, prośba o zatwierdzenie, planowanie i publikowanie to odrębne zakresy. Poświadczenie pobiera najmniejszy zestaw, który spełnia swoje zadanie.',

  /* ---------------------------------------------------------------------- */
  /* Methodology                                                             */
  /* ---------------------------------------------------------------------- */

  'web.methodology.title': 'Metodologia',
  'web.methodology.lede':
    'Jak cokolwiek na tej stronie można nazwać prawdą i co się dzieje, gdy okazuje się, że tak nie jest.',
  'web.methodology.claims.title': 'Roszczenia platformy',
  'web.methodology.claims.body':
    'Każde twierdzenie dotyczące tego, na co pozwala platforma, pochodzi z dokumentacji lub strony z zasadami danej platformy. Rejestrujemy adres URL, datę jego odczytania, wersję API, w przypadku której ma ona zastosowanie, oraz osobę, która jest jej właścicielem, aby ją ponownie sprawdzić. Roszczenie bez tych czterech rzeczy nie trafia do serwisu.',
  'web.methodology.recheck.title': 'Kiedy ponownie sprawdzimy',
  'web.methodology.recheck.beforeConnector':
    'Przed uruchomieniem konektora i ponownie, zanim przeniesie ruch klientów.',
  'web.methodology.recheck.monthly':
    'Co miesiąc informacje o zmianach platformy i cenach dostawców.',
  'web.methodology.recheck.quarterly':
    'Co kwartał w przypadku planów konkurencji, zasad społeczności i dokumentów prawnych.',
  'web.methodology.recheck.immediate':
    'Natychmiast po odrzuceniu platformy, powiadomieniu o egzekwowaniu prawa, wycofaniu lub niewyjaśnionej zmianie w zachowaniu w zakresie publikowania lub analiz.',
  'web.methodology.comparison.title': 'Porównania',
  'web.methodology.comparison.bestFor':
    'Każde porównanie określa, dla kogo dany produkt jest najlepszy, nawet jeśli nie jest to dla nas.',
  'web.methodology.comparison.dated':
    'Każde porównanie zawiera datę badania i łączy główne źródła cen i możliwości.',
  'web.methodology.comparison.distinction':
    'Brakująca funkcja jest oznaczona jako coś, czego nie zbudowaliśmy, lub jako coś, na co platforma nie pozwala. To są różne zdania i nigdy ich nie łączymy.',
  'web.methodology.comparison.noLogos':
    'Nie używamy logo klientów innej firmy, cytatów ani zrzutów ekranu interfejsów i nie rościmy sobie prawa do poparcia, którego nie mamy.',
  'web.methodology.benchmarks.title': 'Tematyki i dane produktów',
  'web.methodology.benchmarks.body':
    'Każda liczba pobrana z aktywności klienta określa próbkę, wykluczenia, definicję metryki i próg prywatności i jest sumowana, dzięki czemu nie można zidentyfikować żadnego obszaru roboczego. Jeśli próbka jest zbyt mała, aby ją bezpiecznie opublikować, mówimy to, zamiast ją mimo to publikować.',
  'web.methodology.ai.title': 'Sztuczna inteligencja w naszych własnych treściach',
  'web.methodology.ai.body':
    'Model może badać, szkicować, tłumaczyć, sprawdzać i formatować. Wyznaczona osoba jest właścicielem każdego roszczenia, edytuje artykuł i aktualizuje go. Nie publikujemy nierecenzowanych, wygenerowanych artykułów i nie generujemy zrzutów ekranu.',
  'web.methodology.corrections.title': 'Poprawki',
  'web.methodology.corrections.body':
    'Gdy strona jest błędna, poprawiamy ją na miejscu, dodajemy datowaną notatkę korygującą i umieszczamy poprawkę w dzienniku zmian. Kiedy strona jest zbyt nieaktualna, aby ją naprawić, wycofujemy ją, zamiast ją zostawiać.',

  /* ---------------------------------------------------------------------- */
  /* Compare                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.compare.title': 'Porównania',
  'web.compare.lede':
    'Te strony są przydatne, nawet jeśli wybierzesz inny produkt. To jest standard, który muszą spełnić, zanim opublikują.',
  'web.compare.rules.title': 'Zasady, którymi kierują się te strony',
  'web.compare.rules.bestFor':
    'Każda strona określa, dla kogo jest najlepszy drugi produkt, najpierw w osobnej sekcji.',
  'web.compare.rules.dated':
    'Każde twierdzenie jest datowane i zawiera odnośnik do głównego źródła, z którego pochodzi.',
  'web.compare.rules.distinction':
    'Oddzielamy to, czego nie zbudowaliśmy, od tego, na co nie pozwala platforma.',
  'web.compare.rules.axes':
    'Na każdej stronie porównywane są te same rzeczy: limit konta, limity publikowania, zespół i zatwierdzanie, dostęp do API, MCP i CLI, języki treści, analityka, obsługa wideo, korzystanie z wbudowanych funkcji, własny hosting, wsparcie i koszt API platformy, który płacisz dodatkowo.',
  'web.compare.rules.correction':
    'Na każdej stronie znajduje się kontakt w sprawie korekty i data recenzji.',
  'web.compare.planned.title': 'Planowane strony',
  'web.compare.planned.body':
    'Są one publikowane po zakończeniu bieżącego sprawdzania cen i możliwości. Porównanie zapisane z pamięci jest gorsze niż brak porównania.',
  'web.compare.empty': 'Nie opublikowano jeszcze żadnego porównania',
  'web.compare.emptyBody':
    'Każda strona wymaga świeżego sprawdzenia faktów w porównaniu z cenami i dokumentacją innego produktu. Publikują pojedynczo po zakończeniu prac.',

  /* ---------------------------------------------------------------------- */
  /* Tool radar                                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.title': 'Radar narzędzi kreatywnych',
  'web.toolRadar.lede':
    'Przekaźnik nie generuje obrazów ani wideo. Pomaga Ci zdecydować, którego specjalistycznego narzędzia użyć i dostarczyć gotowy zasób z nienaruszonym zapisem praw.',
  'web.toolRadar.record.title': 'Co musi zawierać każdy rekord',
  'web.toolRadar.record.url': 'Oficjalny adres URL i organizacja będąca właścicielem produktu.',
  'web.toolRadar.record.useCase':
    'Przepływ pracy, do którego jest zalecany, i jego udokumentowane ograniczenia.',
  'web.toolRadar.record.pricing': 'Model cenowy i data, kiedy go sprawdziliśmy.',
  'web.toolRadar.record.rights':
    'Jego prawa, licencje, przechowywanie i zastrzeżenia dotyczące prywatności, według własnych słów dostawcy.',
  'web.toolRadar.record.disclosure':
    'Czy mamy z nim jakiekolwiek powiązania handlowe. Ranking nigdy od tego nie zależy.',
  'web.toolRadar.record.verified':
    'Ostatnia zweryfikowana data i widoczne ostrzeżenie, gdy rekord minie okno przeglądu.',
  'web.toolRadar.category.title': 'Kategorie',
  'web.toolRadar.empty': 'Katalog nie jest jeszcze zapełniony',
  'web.toolRadar.emptyBody':
    'Rekordy są pisane przez osobę z dokumentacji własnej dostawcy. Nie będziemy wypełniać tej strony linkami wygenerowanymi przez model, które wyglądają wiarygodnie.',
  'web.toolRadar.noAffiliateYet':
    'Dzisiaj nie ma żadnego związku partnerskiego z żadnym narzędziem wymienionym tutaj.',

  /* ---------------------------------------------------------------------- */
  /* Opportunities                                                           */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.title': 'Możliwości promocji',
  'web.opportunities.lede':
    'Wybrany katalog miejsc, w których można wprowadzić produkt na rynek, umieścić w nim listę, omówić go lub wnieść swój wkład, wraz z zasadami, które każde miejsce docelowe ustala dla siebie.',
  'web.opportunities.rules.title': 'Jak zachowuje się ten katalog',
  'web.opportunities.rules.curated':
    'Każdy wpis jest sprawdzonym rekordem z oficjalnym adresem URL, aktualnymi zasadami przesyłania i datą weryfikacji. Model niczego nie odkrywa i nie przedstawia jako zweryfikowanego.',
  'web.opportunities.rules.noAutomation':
    'Przekaźnik nigdy nie przesyła formularza, nie usuwa kontaktu, nie wysyła masowo e-maili ani postów do społeczności w Twoim imieniu. Ty dokonujesz zgłoszenia.',
  'web.opportunities.rules.noGuarantee':
    'Lista nie jest obietnicą rankingu, a link nie jest strategią rozwoju. Pokazujemy wymagania dotyczące dopasowania, odbiorców, wysiłku, kosztów i ujawniania informacji, dzięki czemu możesz zdecydować, czy warto spędzić popołudnie.',
  'web.opportunities.rules.stale':
    'Rekord po dacie sprawdzenia jest oznaczony etykietą lub ukryty, a nie pokazywany jako aktualny.',
  'web.opportunities.category.title': 'Kategorie',
  'web.opportunities.empty': 'Katalog nie jest jeszcze zapełniony',
  'web.opportunities.emptyBody':
    'Zasady każdego miejsca docelowego muszą zostać przeczytane i zapisane przez osobę, zanim będzie można je polecić. Kategorie są wymienione powyżej, dzięki czemu możesz zobaczyć kształt tego, co nadchodzi.',

  /* ---------------------------------------------------------------------- */
  /* Legal, shared                                                           */
  /* ---------------------------------------------------------------------- */

  'web.legal.title': 'Prawo i zasady',
  'web.legal.lede':
    'Dokumenty regulujące korzystanie z Post Array. Jeżeli sformułowanie musi zostać sporządzone przez prawnika zajmującego się konkretną firmą i jurysdykcją, strona mówi o tym, zamiast udawać.',
  'web.legal.counselPending.title': 'Oczekuje na sprawdzenie przez prawnika przed uruchomieniem',
  'web.legal.counselPending.body':
    'Treść na tej stronie odzwierciedla faktyczne zachowanie produktu i jest dokładna na dzień dzisiejszy. Wiążące brzmienie prawne, obowiązująca jurysdykcja i warunki odpowiedzialności są opracowywane z wykwalifikowanym doradcą i zastąpią ten tekst, zanim Post Array będzie ogólnie dostępny. Ta strona nie stanowi porady prawnej i nie jest jeszcze umową.',
  'web.legal.contact.title': 'Kontakt',
  'web.legal.contact.privacy': 'prywatność@przekaźnik.przykład',
  'web.legal.contact.legal': 'legal@postarray.com',
  'web.legal.contact.security': 'bezpieczeństwo@przekaźnik.przykład',
  'web.legal.contact.abuse': 'nadużycie@przekaźnik.przykład',
  'web.legal.contact.copyright': 'prawa autorskie@przekaźnik.przykład',
  'web.legal.contact.affiliates': 'towarzysze@przekaźnik.example',
  'web.legal.contact.accessibility': 'dostępność@przekaźnik.przykład',
  'web.legal.entity.pending':
    'Podmiot zamawiający, jego zarejestrowany adres i właściwa jurysdykcja są kwestią otwartą i zostaną wymienione w tym miejscu przed uruchomieniem.',
  'web.legal.index.updated': 'Zaktualizowano {date}',

  /* Terms ---------------------------------------------------------------- */
  'web.legal.terms.title': 'Warunki korzystania z usługi',
  'web.legal.terms.summary':
    'Co Post Array zobowiązuje się zapewnić, na co zgadzasz się zrobić i co się stanie, gdy którakolwiek ze stron się zatrzyma.',
  'web.legal.terms.service.title': 'Co to jest usługa',
  'web.legal.terms.service.body':
    'Post Array to hostowana usługa służąca do tworzenia, zatwierdzania, planowania i publikowania treści na platformach społecznościowych za pośrednictwem oficjalnych interfejsów API tych platform, wraz z wynikami wpływów, analiz i zapisów audytu. To nie jest platforma społecznościowa i nie kontroluje tego, co jakakolwiek platforma robi z postem po jego opublikowaniu.',
  'web.legal.terms.content.title': 'Twoje treści pozostają Twoje',
  'web.legal.terms.content.body':
    'Zachowujesz własność wszystkiego, co przesyłasz, piszesz lub importujesz. Udzielasz Post Array jedynie licencji potrzebnej do jego przechowywania, przetwarzania, dostosowywania do żądanych przez Ciebie wariantów i przesyłania na wybrane przez Ciebie konta. Licencja ta wygasa w momencie usunięcia treści, z wyjątkiem zapisów, które jesteśmy zobowiązani przechowywać.',
  'web.legal.terms.warranties.title': 'Co potwierdzasz publikując',
  'web.legal.terms.warranties.body':
    'Że masz uprawnienia do publikowania na połączonych kontach, że posiadasz prawa do treści i mediów, że posiadasz zgodę wymaganą dla każdej osoby, która się w nich pojawia, oraz że ich publikacja nie narusza zasad platformy docelowej.',
  'web.legal.terms.platforms.title': 'Zależność od platformy',
  'web.legal.terms.platforms.body':
    'Konektory zależą od interfejsów API innych firm kontrolowanych przez te firmy. Platforma może zmienić swoje API, ograniczyć uprawnienia, odwołać aplikację lub zamknąć dostęp z krótkim wyprzedzeniem. Firma Post Array nie może zagwarantować, że jakiekolwiek złącze pozostanie dostępne, a niedostępność złącza nie oznacza naruszenia niniejszej umowy. Kiedy to nastąpi, poinformujemy Cię o tym na stronie statusu i w dzienniku zmian.',
  'web.legal.terms.ai.title': 'Wyjście AI',
  'web.legal.terms.ai.body':
    'Funkcje pomocy tekstowej, tłumaczenia, transkreacji i planowania generują sugestie. Mogą być błędne, nieaktualne lub nieodpowiednie. Jesteś odpowiedzialny za sprawdzenie wszystkiego, co publikujesz. Przekaźnik nie generuje obrazów ani wideo.',
  'web.legal.terms.billing.title': 'Płatność',
  'web.legal.terms.billing.body':
    'Polar jest rekordowym sprzedawcą. Polar obsługuje płatności, podatki, faktury i zwroty pieniędzy. Subskrypcje odnawiają się automatycznie w wybranych przez Ciebie odstępach czasu, aż do momentu ich anulowania. Korzystanie z platformy pobierane przez dostawcę za operację jest rozliczane osobno według kosztów i ujawniane przed działaniem, które się z tym wiąże.',
  'web.legal.terms.suspension.title': 'Zawieszenie i zaplanowane posty',
  'web.legal.terms.suspension.body':
    'Jeśli subskrypcja wygaśnie lub obszar roboczy zostanie zawieszony, zaplanowane posty zostaną zatrzymane, zamiast być publikowane w trybie cichym, a obszar roboczy stanie się tylko do odczytu. Twoje treści, rachunki i połączenia zostaną zachowane i będzie można je eksportować.',
  'web.legal.terms.aup.title': 'Dopuszczalne użycie',
  'web.legal.terms.aup.body':
    'Zasady dopuszczalnego użytkowania stanowią część niniejszych warunków. Możemy ocenić ograniczenie, wstrzymać, zażądać weryfikacji, cofnąć dostęp agenta lub API, zawiesić lub zakończyć w przypadku naruszenia tych ograniczeń, a Ty możesz odwołać się od każdej z tych decyzji do konkretnej osoby.',
  'web.legal.terms.termination.title': 'Zakończenie umowy',
  'web.legal.terms.termination.body':
    'Możesz anulować w dowolnym momencie w Ustawieniach. Po rozwiązaniu umowy zachowujesz okno eksportu przed usunięciem, a usunięcie nigdy nie jest uzależnione od opłacenia zaległej faktury, z wyjątkiem zapisów rozliczeniowych, które jesteśmy prawnie zobowiązani zachować.',
  'web.legal.terms.developer.title': 'API, MCP i konta usługowe',
  'web.legal.terms.developer.body':
    'Dostęp programowy regulują dodatkowo Warunki API i MCP, w tym limity szybkości, wymagania dotyczące zakresu i zasada, że konto usługi nigdy nie dziedziczy pełnych uprawnień człowieka.',

  /* Privacy -------------------------------------------------------------- */
  'web.legal.privacy.title': 'Polityka prywatności',
  'web.legal.privacy.summary':
    'Co zbiera Post Array, dlaczego, kto je przetwarza, jak długo są przechowywane i jak je usunąć lub usunąć.',
  'web.legal.privacy.collect.title': 'Co posiadamy',
  'web.legal.privacy.collect.account':
    'Konto i profil: Twoje imię i nazwisko, adres e-mail, członkostwo w obszarze roboczym i rola.',
  'web.legal.privacy.collect.connections':
    'Połączenia społecznościowe: identyfikator konta platformy, jego nazwa wyświetlana, jego typ, przyznane zakresy i zaszyfrowany token dostępu. Tokeny są przechowywane z szyfrowaniem kopertowym i nigdy nie są zapisywane w dzienniku.',
  'web.legal.privacy.collect.content':
    'Treści i multimedia, które tworzysz, przesyłasz lub importujesz, w tym prawa i pochodzenie, które za ich pomocą rejestrujesz.',
  'web.legal.privacy.collect.schedules':
    'Harmonogramy, decyzje o zatwierdzeniu, potwierdzenia publikacji i zdarzenia audytowe.',
  'web.legal.privacy.collect.analytics':
    'Dane pobrane z platform dotyczące postów opublikowanych przez Ciebie za pośrednictwem Post Array.',
  'web.legal.privacy.collect.billing':
    'Numery rozliczeniowe przechowywane przez firmę Polar. Przekaźnik nie przechowuje danych Twojej karty.',
  'web.legal.privacy.collect.technical':
    'Dane urządzenia i dziennika potrzebne do obsługi i zabezpieczenia usługi, domyślnie zredagowane.',
  'web.legal.privacy.collect.agent':
    'Aktywność agenta i interfejsu API: które dane uwierzytelniające wykonały jaką akcję, z wejściowym skrótem, a nie danymi wejściowymi.',
  'web.legal.privacy.minimization.title': 'Czego świadomie nie robimy',
  'web.legal.privacy.minimization.scopes':
    'Prosimy tylko o zakresy platformy, których włączone funkcje rzeczywiście są potrzebne.',
  'web.legal.privacy.minimization.history':
    'Nie analizujemy całej Twojej historii społecznościowej w celu narysowania wykresu.',
  'web.legal.privacy.minimization.logs':
    'Treść wpisu została usunięta z dzienników ogólnych i narzędzi pomocy technicznej.',
  'web.legal.privacy.minimization.training':
    'Twoja treść nie jest domyślnie używana do uczenia naszych modeli ani innych modeli.',
  'web.legal.privacy.subprocessors.title': 'Kto jeszcze to przetwarza',
  'web.legal.privacy.subprocessors.body':
    'Aktualna lista podprocesorów jest publikowana osobno, a zmiany są tam ogłaszane, zanim zaczną obowiązywać.',
  'web.legal.privacy.retention.title': 'Jak długo to przechowujemy',
  'web.legal.privacy.rights.title': 'Twoje sterowanie',
  'web.legal.privacy.rights.export':
    'Pobierz swoje treści, rachunki i statystyki w formacie JSON i CSV wraz z archiwum multimediów.',
  'web.legal.privacy.rights.revoke':
    'Odłącz jedno konto społecznościowe bez usuwania obszaru roboczego. Tokeny są unieważniane na platformie i usuwane tutaj.',
  'web.legal.privacy.rights.delete':
    'Usuń markę, fragment treści, plik multimedialny lub całe konto.',
  'web.legal.privacy.rights.cancelJobs':
    'Anuluj zaplanowane zadania przed usunięciem czegokolwiek, aby nic nie zostało opublikowane po wyjściu.',
  'web.legal.privacy.rights.sessions':
    'Przeglądaj i unieważniaj aktywne sesje, klucze API, dane uwierzytelniające agenta, webhooki i uprawnienia platformy.',
  'web.legal.privacy.rights.consent':
    'Preferencje dotyczące zgody są podzielone na wersje i podlegają kontroli, dzięki czemu możesz zobaczyć, na co się zgodziłeś i kiedy.',
  'web.legal.privacy.deletion.title': 'Usuwanie danych przechowywanych na platformie',
  'web.legal.privacy.deletion.body':
    'Odłączenie konta w Post Array unieważnia token na platformie i usuwa tutaj dane uwierzytelniające. Treści już opublikowane na platformie podlegają tej platformie i muszą zostać tam usunięte. Jeżeli platforma wymaga usunięcia danych pochodnych w określonym terminie po odwołaniu, dotrzymujemy tego terminu. W przypadku danych Google i YouTube okres ten wynosi obecnie 30 dni.',
  'web.legal.privacy.transfers.title': 'Przelewy międzynarodowe',
  'web.legal.privacy.transfers.body':
    'Regiony przyjmujące i mechanizm transferu są finalizowane z doradcą i zostaną wymienione tutaj wraz z obowiązującymi zabezpieczeniami przed uruchomieniem.',

  /* Acceptable use ------------------------------------------------------- */
  'web.legal.aup.title': 'Zasady dopuszczalnego użytkowania',
  'web.legal.aup.summary':
    'Przekaźnik pomaga publikować treści, do których publikacji masz uprawnienia. Nie został stworzony, aby pomóc komukolwiek ominąć ograniczenia platformy, sfałszować poparcie lub wysyłać niechciane wiadomości.',
  'web.legal.aup.prohibited.title': 'Niedozwolone',
  'web.legal.aup.prohibited.spam':
    'Spam, niechciane wiadomości masowe, odpowiedzi lub wzmianki, przynęta na zaangażowanie i powtarzające się niechciane treści.',
  'web.legal.aup.prohibited.linkSchemes':
    'Zautomatyzowane przesyłanie katalogów lub formularzy, masowy zasięg, schematy linków, płatne lub wzajemne linki mające na celu manipulowanie rankingiem wyszukiwania oraz promocja społeczności, która łamie zasady miejsca docelowego.',
  'web.legal.aup.prohibited.inauthentic':
    'Skoordynowane nieautentyczne zachowanie, wzmocnienie wielu kont przedstawiane jako niezależne, bloki zaangażowania, fałszywe recenzje, oceny lub liczba instalacji, automatyczne polubienia i obserwowanie oraz manipulacja trendami.',
  'web.legal.aup.prohibited.duplicate':
    'Publikowanie zduplikowanych lub zasadniczo podobnych treści na wielu kontach, jeśli platforma tego zabrania.',
  'web.legal.aup.prohibited.impersonation':
    'Podszywanie się pod inne osoby, wyłudzanie informacji, oszustwa, oszustwa, złośliwe oprogramowanie, kradzież danych uwierzytelniających i zwodnicza instalacja.',
  'web.legal.aup.prohibited.harm':
    'Nękanie, doxxing, wykorzystywanie seksualne, intymne media za zgodą użytkownika, treści szerzące nienawiść lub brutalny ekstremizm oraz nielegalne towary lub usługi.',
  'web.legal.aup.prohibited.political':
    'Manipulacja polityczna i zautomatyzowana perswazja polityczna tam, gdzie jest to zabronione. Treści polityczne, jeśli są w ogóle dozwolone, podlegają wzmocnionej kontroli.',
  'web.legal.aup.prohibited.rights':
    'Naruszenia praw autorskich, znaków towarowych i reklamy, nielicencjonowana muzyka lub media, syntetyczne podobizny bez praw i ujawnień oraz nieujawnione płatne rekomendacje.',
  'web.legal.aup.prohibited.circumvention':
    'Omijanie oficjalnych interfejsów API, limitów szybkości, audytów, kontroli kont lub egzekwowania zasad platformy za pomocą automatyzacji przeglądarki, odtwarzania plików cookie lub skrobania.',
  'web.legal.aup.prohibited.restrictedStores':
    'Automatyczne przesyłanie do sklepów z aplikacjami, Chrome Web Store lub innych systemów przesyłania objętych ograniczeniami za pośrednictwem nieautoryzowanych interfejsów.',
  'web.legal.aup.prohibited.banEvasion':
    'Unikanie blokady konta lub prowadzenie skoordynowanych farm kont.',
  'web.legal.aup.prohibited.training':
    'Szkolenie lub ocena modeli w treściach stron trzecich lub innych klientów bez autoryzacji.',
  'web.legal.aup.controls.title': 'Kontrole, które to wymuszają',
  'web.legal.aup.controls.duplicate':
    'Dokładne i prawie zduplikowane odciski palców według obszaru roboczego, konta, platformy i okna czasowego, z kontrolą podobieństwa między kontami.',
  'web.legal.aup.controls.cadence':
    'Budżety kadencji na poziomie konta i obszaru roboczego, a także weryfikacja wzmianek, hashtagów, adresów URL i liczby domen.',
  'web.legal.aup.controls.escalation':
    'Nowe konto, nowa domena i eskalacja działań zbiorczych oraz maksymalna liczba powtórzeń dla każdej powtarzającej się kampanii.',
  'web.legal.aup.controls.linkSafety':
    'Skanowanie miejsc docelowych na krótkich łączach, z wyłączeniem awaryjnym i kanałem zgłaszania nadużyć.',
  'web.legal.aup.controls.workspaceCaps':
    'Właściciel obszaru roboczego może ustawić bardziej rygorystyczne limity, niż pozwala na to plan. Nie można poluzować kontroli ryzyka, płacąc więcej.',
  'web.legal.aup.enforcement.title': 'Egzekucja i odwołanie',
  'web.legal.aup.enforcement.body':
    'Gdzie możemy, blokujemy przed akcją zewnętrzną, a nie po niej i odnotowujemy przyczynę, wersję reguły i ścieżkę odwołania. Powtarzające się lub poważne zachowanie podlega kontroli zaufania przez daną osobę. Zostaniesz poinformowany, co się stało, bez poziomu szczegółów, który pomógłby komuś uniknąć kontroli. Od każdej decyzji można się odwołać i cofnąć.',
  'web.legal.aup.report.title': 'Zgłaszanie nadużycia',
  'web.legal.aup.report.body':
    'Jeśli treść opublikowana za pośrednictwem Post Array łamie te zasady, poinformuj nas o tym. Dołącz adres URL posta i napisz, co jest w nim nie tak.',

  /* AI policy ------------------------------------------------------------ */
  'web.legal.ai.title':
    'Polityka dotycząca wykorzystania sztucznej inteligencji i treści generowanych',
  'web.legal.ai.summary':
    'Które funkcje korzystają z modelu, co jest wysyłane, co jest przechowywane, za co odpowiadasz i dlaczego Post Array nie generuje multimediów.',
  'web.legal.ai.features.title': 'Gdzie używany jest model',
  'web.legal.ai.features.text':
    'Pomoc tekstowa w kompozytorze: przepisanie, skrócenie i dostosowanie do platformy.',
  'web.legal.ai.features.translation':
    'Tłumaczenie i transkreacja na języki treści w odniesieniu do glosariusza Twojej marki.',
  'web.legal.ai.features.feedback': 'Opinie dotyczące treści i czterotygodniowy plan rozwoju.',
  'web.legal.ai.features.provider':
    'Te funkcje wywołują funkcję DeepSeek. Aktualnie używane identyfikatory modeli są publikowane w dokumentacji, a wszelkie zmiany są wymienione w dzienniku zmian.',
  'web.legal.ai.data.title': 'Co jest wysyłane i co się z tym dzieje',
  'web.legal.ai.data.sent':
    'Tylko tekst, nad którym nas poprosiłeś, instrukcja i wybrany przez Ciebie kontekst marki. Dane uwierzytelniające, tokeny i inne treści klientów nigdy nie znajdują się w kontekście modelu.',
  'web.legal.ai.data.training':
    'Twoje treści nie są wykorzystywane do uczenia naszych modeli. Konfigurujemy dostawców tak, aby nie byli oni wykorzystywani do szkolenia ich.',
  'web.legal.ai.data.optOut':
    'Opcjonalne funkcje AI można wyłączyć w każdym obszarze roboczym. Publikowanie, planowanie, zatwierdzanie i analizy nie zależą od nich.',
  'web.legal.ai.responsibility.title': 'Co pozostaje Twoje',
  'web.legal.ai.responsibility.body':
    'Model może z całą pewnością być błędny. Jesteś odpowiedzialny za sprawdzenie faktów, twierdzeń, nazwisk, liczb i tonu przed publikacją, a także za wszelkie ujawnienia wymagane przez platformę. Żadna funkcja sztucznej inteligencji nie gwarantuje zasięgu, zaangażowania ani rankingu i żadna nie jest oferowana jako jedna.',
  'web.legal.ai.disclosure.title': 'Ujawnienie i pochodzenie',
  'web.legal.ai.disclosure.body':
    'Przekaźnik rejestruje w swojej wewnętrznej historii, czy treść była wspierana przez sztuczną inteligencję, przypomina Ci, gdzie platforma wymaga ujawnienia w mediach zmienionych lub syntetycznych, i przechowuje podane przez Ciebie pochodzenie importowanego zasobu. Jeśli platforma oferuje pole do ujawnienia, Post Array ustawia je na podstawie Twojej deklaracji, zamiast zgadywać.',
  'web.legal.ai.blocks.title': 'Czego odmawiają funkcje AI',
  'web.legal.ai.blocks.impersonation': 'Podszywanie się pod prawdziwą osobę lub osobę publiczną.',
  'web.legal.ai.blocks.ncii': 'Intymne zdjęcia bez zgody, w dowolnej formie.',
  'web.legal.ai.blocks.fabrication':
    'Sfabrykowane referencje, wymyśleni klienci i wymyślone dane dotyczące wydajności.',
  'web.legal.ai.blocks.unverified':
    'Prezentacja adresu URL wygenerowanego przez model jako zweryfikowanej możliwości. Rekomendacje dotyczące możliwości i narzędzi pochodzą wyłącznie z wybranego katalogu.',
  'web.legal.ai.noMedia.title': 'Dlaczego nie ma generowania obrazu ani wideo',
  'web.legal.ai.noMedia.body':
    'Przekaźnik nie zebrał zweryfikowanego systemu wizualnego, szczegółów produktu, praw do aktywów, pozwoleń na podobieństwo i kontekstu kampanii, których wymagałby produkt gotowy dla marki, a przy generowaniu aplikacji wymagałby własnej zgody, pochodzenia, oceny bezpieczeństwa i kontroli kosztów. Możliwości modelu multimediów, licencjonowanie, ceny i przechowywanie również szybko się zmieniają, dlatego nasze rekomendacje dotyczące narzędzi są opatrzone datą. Zachowasz kontrolę nad kreacją, wybierając specjalistyczne narzędzie i importując zatwierdzony zasób. Przekaźnik obsługuje adaptację, zatwierdzanie, publikację i pomiary.',
  'web.legal.ai.noMedia.caveat':
    'Narzędzie pojawiające się na naszym radarze nie stanowi oświadczenia, że jego dane wyjściowe są bezpieczne lub że prawa do niego zostały potwierdzone. Pokazane są w nim udokumentowane zastrzeżenia, a Twoja zwykła deklaracja praw nadal obowiązuje.',

  /* Cookies -------------------------------------------------------------- */
  'web.legal.cookies.title': 'Polityka dotycząca plików cookie',
  'web.legal.cookies.summary':
    'Co jest przechowywane w Twojej przeglądarce, dlaczego i co się stanie, jeśli odrzucisz opcjonalne części.',
  'web.legal.cookies.essential.title': 'Ściśle konieczne',
  'web.legal.cookies.essential.body':
    'Plik cookie sesji, który utrzymuje Cię jako zalogowanego, token fałszowania żądań między witrynami oraz plik cookie preferencji przechowujący wybrany motyw i strefę czasową. Nie można ich wyłączyć bez przerywania logowania i nie są wykorzystywane do celów reklamowych.',
  'web.legal.cookies.analytics.title': 'Analiza produktu',
  'web.legal.cookies.analytics.body':
    'Zbiorczy, własny pomiar tego, które ekrany są używane, abyśmy mogli naprawić te, które nie działają. Jest to opcjonalne, jest wyłączone, dopóki na to nie pozwolisz, a odmowa nie zmienia niczego w produkcie.',
  'web.legal.cookies.marketing.title': 'Reklama',
  'web.legal.cookies.marketing.body':
    'Nie używamy reklamowych plików cookie, nie osadzamy pikseli reklamowych stron trzecich i nie sprzedajemy ani nie udostępniamy danych osobowych na potrzeby wielokontekstowej reklamy behawioralnej.',
  'web.legal.cookies.shortLinks.title': 'Śledzone krótkie linki',
  'web.legal.cookies.shortLinks.body':
    'Krótkie kliknięcie linku powoduje utworzenie własnych analiz dla obszaru roboczego, do którego należy link. Dane dotyczące lokalizacji i urządzenia są minimalizowane, ruch botów jest klasyfikowany, adresy IP są obcinane lub natychmiast odrzucane, a obszar roboczy może wyłączyć śledzenie lub skrócić czas przechowywania. Nic wrażliwego nie jest nigdy umieszczane w ślimaku lub parametrze zapytania.',
  'web.legal.cookies.control.title': 'Zmieniasz zdanie',
  'web.legal.cookies.control.body':
    'Wybór zgody jest przechowywany z wersją i można go w każdej chwili zmienić w Ustawieniach, w obszarze kontroli danych. Wycofanie zgody ma skutek natychmiastowy.',

  /* Subprocessors -------------------------------------------------------- */
  'web.legal.subprocessors.title': 'Podprocesory',
  'web.legal.subprocessors.summary':
    'Firmy przetwarzające dane klientów w naszym imieniu, czym się zajmują i gdzie.',
  'web.legal.subprocessors.notice.title': 'Powiadomienie o zmianie',
  'web.legal.subprocessors.notice.body':
    'Nowy podwykonawca przetwarzania jest publikowany tutaj, zanim rozpocznie przetwarzanie danych klienta, z co najmniej 30-dniowym wyprzedzeniem w przypadku zmiany mającej istotny wpływ na przetwarzanie. Klienci posiadający załącznik dotyczący przetwarzania danych mogą w tym okresie wyrazić sprzeciw.',
  'web.legal.subprocessors.column.name': 'Podprocesor',
  'web.legal.subprocessors.column.purpose': 'Co dla nas przetwarza',
  'web.legal.subprocessors.column.data': 'Kategorie danych',
  'web.legal.subprocessors.column.region': 'Region przetwarzania',
  'web.legal.subprocessors.platforms.title': 'Platformy społecznościowe nie są podprocesorami',
  'web.legal.subprocessors.platforms.body':
    'Kiedy publikujesz, Post Array przesyła Twoją zawartość na wybrane konto platformy, zgodnie z Twoimi instrukcjami. Platformy te są niezależnymi kontrolerami tego, co otrzymują i regulują to ich własne warunki.',

  /* Refunds -------------------------------------------------------------- */
  'web.legal.refunds.title': 'Zasady zwrotów i anulowania',
  'web.legal.refunds.summary':
    'Jak anulować, co stanie się z Twoimi danymi i kiedy otrzymasz zwrot pieniędzy.',
  'web.legal.refunds.cancel.title': 'Anulowanie',
  'web.legal.refunds.refund.title': 'Zwroty pieniędzy',
  'web.legal.refunds.refund.body':
    'Jeśli usługa nie działała zgodnie z opisem, skontaktuj się z pomocą techniczną, a my zwrócimy pieniądze za okres, którego to dotyczy. Obowiązkowe prawa konsumenta do odstąpienia od umowy, w tym ustawowy okres odstąpienia od umowy, jeśli ma on zastosowanie do Ciebie, są w pełni honorowane i nie są ograniczone niczym na tej stronie. Zwroty środków są dokonywane przez firmę Polar, naszego sprawdzonego sprzedawcę, na pierwotną metodę płatności.',
  'web.legal.refunds.usage.title': 'Opłaty za korzystanie z platformy',
  'web.legal.refunds.usage.body':
    'Wykorzystanie przekazywane z platformy, np. cena X za operację, obejmuje koszt, który już zapłaciliśmy w Twoim imieniu za potwierdzone przez Ciebie działanie. Kwota podlega zwrotowi, jeśli obciążenie wynika z naszego błędu, np. zduplikowanej wysyłki spowodowanej wadą po naszej stronie.',
  'web.legal.refunds.data.title': 'Co stanie się z Twoimi danymi',
  'web.legal.refunds.data.body':
    'W przypadku anulowania nic nie jest usuwane. Obszar roboczy staje się tylko do odczytu, zaplanowane posty są zatrzymywane, a nie publikowane, a przed usunięciem pozostaje okno eksportu. Usunięcie nigdy nie jest uzależnione od opłacenia faktury, z wyjątkiem zapisów rozliczeniowych, które musimy prowadzić zgodnie z prawem.',
  'web.legal.refunds.failed.title': 'Nieudana płatność',
  'web.legal.refunds.failed.body':
    'Polar ponownie spróbuje i wyśle ​​Ci e-mail. W okresie karencji publikowanie jest kontynuowane. Po tym obszar roboczy stanie się tylko do odczytu, a zaplanowane posty zostaną zatrzymane. Nic nie jest odłączane i nic nie jest usuwane.',

  /* DMCA ----------------------------------------------------------------- */
  'web.legal.dmca.title': 'Prawa autorskie i usunięcie',
  'web.legal.dmca.summary':
    'Jak zgłosić treści hostowane przez Post Array, które naruszają Twoje prawa i jak zareagować, jeśli Twoje zostały usunięte.',
  'web.legal.dmca.scope.title': 'Na czym możemy działać',
  'web.legal.dmca.scope.body':
    'Przekaźnik może usunąć materiały przechowywane w naszych systemach, takie jak plik multimedialny lub wersję roboczą. Treści już opublikowane na platformie społecznościowej znajdują się na tej platformie i należy ją zgłosić, ponieważ nie możemy usunąć postu, którego nie hostujemy. Powiemy Ci, który z nich dotyczy Twojego raportu.',
  'web.legal.dmca.notice.title': 'Wysyłanie powiadomienia',
  'web.legal.dmca.notice.identify':
    'Wskaż dzieło chronione prawem autorskim i materiał, który według Ciebie narusza, podając adres URL, do którego możemy dotrzeć.',
  'web.legal.dmca.notice.contact': 'Podaj swoje imię i nazwisko, adres, numer telefonu i e-mail.',
  'web.legal.dmca.notice.goodFaith':
    'Oświadcz, że w dobrej wierze wierzysz, że użycie nie jest autoryzowane przez posiadacza praw, jego agenta lub przez prawo.',
  'web.legal.dmca.notice.accuracy':
    'Oświadcz, że informacje są dokładne i pod rygorem odpowiedzialności za składanie fałszywych zeznań, że jesteś upoważniony do działania w imieniu posiadacza praw.',
  'web.legal.dmca.notice.signature': 'Podpisz fizycznie lub elektronicznie.',
  'web.legal.dmca.counter.title': 'Roszczenie wzajemne',
  'web.legal.dmca.counter.body':
    'Jeśli Twój materiał został usunięty i uważasz, że była to pomyłka lub błędna identyfikacja, możesz wysłać roszczenie wzajemne, podając te same dane kontaktowe, określając materiał i jego lokalizację oraz wyrażając zgodę na jurysdykcję, która zostanie tutaj wymieniona. Przekażemy to osobie, która złożyła skargę.',
  'web.legal.dmca.repeat.title': 'Powtórni sprawcy naruszenia',
  'web.legal.dmca.repeat.body':
    'Konta, które wielokrotnie naruszają zasady, są zawieszane, a następnie zamykane. Powiadomienia w złej wierze, służące do usunięcia treści konkurencji, również stanowią podstawę do rozwiązania umowy.',

  /* Security ------------------------------------------------------------- */
  'web.legal.security.title': 'Bezpieczeństwo i odpowiedzialne ujawnianie informacji',
  'web.legal.security.summary':
    'Jak Post Array chroni dane uwierzytelniające, którym ufasz, i jak zgłosić znaleziony problem.',
  'web.legal.security.tokens.title': 'Poświadczenia społecznościowe',
  'web.legal.security.tokens.body':
    'Tokeny platformy są szyfrowane za pomocą szyfrowania kopertowego pod zarządzanym kluczem, obracane, przechowywane oddzielnie od treści i danych rozliczeniowych oraz usuwane z każdego dziennika. Token nigdy nie jest wysyłany do przeglądarki, nigdy nie jest umieszczany w kontekście modelu i nigdy nie jest dołączany do komunikatu o błędzie.',
  'web.legal.security.tenancy.title': 'Dzierżawa',
  'web.legal.security.tenancy.body':
    'Izolacja jest wymuszana trzykrotnie: na brzegu sieci podczas uwierzytelniania, w usłudze aplikacji podczas autoryzacji akcji oraz w PostgreSQL poprzez zabezpieczenia na poziomie wiersza. Zalogowanie się nigdy nie jest traktowane jako pozwolenie. Próby dostępu między obszarami roboczymi są testowane w ramach ciągłej integracji i muszą zakończyć się niepowodzeniem.',
  'web.legal.security.publishing.title': 'Integralność publikowania',
  'web.legal.security.publishing.body':
    'Każdy zapis zewnętrzny zawiera klucz idempotencji i generuje niezmienny paragon. Zduplikowana publikacja jest traktowana jako defekt z wartością docelową równą zero, a zestaw testów obejmuje awarie procesów roboczych po akceptacji platformy, przekroczenia limitu czasu platformy, zduplikowane webhooki, unieważnione tokeny przy wysyłce i przejście na czas letni.',
  'web.legal.security.program.title': 'Program',
  'web.legal.security.program.threatModel':
    'Pisany model zagrożeń obejmujący OAuth, dzierżawę, publikowanie, MCP, media, rozliczenia i analitykę.',
  'web.legal.security.program.pentest':
    'Niezależna ocena bezpieczeństwa skupiająca się na wycieku tokenów i dostępie między dzierżawcami przed płatną premierą.',
  'web.legal.security.program.access':
    'Dostęp produkcyjny z najniższymi uprawnieniami, uwierzytelnianie wieloskładnikowe oraz inwentaryzacja urządzeń i sesji.',
  'web.legal.security.program.supplyChain':
    'Skanowanie zależności i kontenerów z poziomami usług poprawek oraz podpisanym pochodzeniem kompilacji, tam gdzie jest to praktyczne.',
  'web.legal.security.program.logging':
    'Scentralizowane rejestrowanie, które domyślnie redaguje, z alertami o anomaliach.',
  'web.legal.security.program.backups':
    'Zaszyfrowane kopie zapasowe z przetestowanym przywracaniem i udokumentowaną rotacją.',
  'web.legal.security.disclosure.title': 'Zgłaszanie luki w zabezpieczeniach',
  'web.legal.security.disclosure.body':
    'Wyślij do nas e-mail z wystarczającą ilością szczegółów, aby odtworzyć problem. Potwierdzimy to w ciągu dwóch dni roboczych, będziemy Cię na bieżąco informować i przyznamy Ci kredyt, kiedy będziesz go potrzebować. Proszę nie uzyskiwać dostępu do danych innego klienta, nie pogarszać jakości usług ani nie uruchamiać automatycznego skanowania w odniesieniu do produkcji. Przetestuj w swoim własnym obszarze roboczym.',
  'web.legal.security.disclosure.safeHarbor':
    'Nie będziemy podejmować działań prawnych w związku z badaniami w dobrej wierze zgodnymi z tą polityką. Dokładne sformułowanie dotyczące „bezpiecznej przystani” można uzyskać u prawnika.',
  'web.legal.security.incidents.title': 'Jeśli coś pójdzie nie tak',
  'web.legal.security.incidents.body':
    'Mamy plan reagowania na incydenty z wyznaczonymi decydentami, poziomami ważności, zachowaniem dowodów i obowiązkami powiadamiania. Zdarzenia, które miały wpływ na publikację, są publikowane na stronie stanu z osią czasu i informacjami o zmianach, które nastąpiły później, łącznie z tymi, które spowodowaliśmy.',

  /* Accessibility -------------------------------------------------------- */
  'web.legal.accessibility.title': 'Oświadczenie o dostępności',
  'web.legal.accessibility.summary':
    'Standardowy przekaźnik jest zbudowany zgodnie z tym, co zweryfikowaliśmy, co wiemy, że jest jeszcze nieprawidłowe i jak nam to powiedzieć.',
  'web.legal.accessibility.standard.title': 'Standard',
  'web.legal.accessibility.standard.body':
    'Post Array kieruje uwagę na poziom AA WCAG 2.2 w całym produkcie i tej witrynie. Dostępność jest tutaj wymogiem scalania, a nie późniejszym biletem, a ekran, który się nie powiedzie, nie zostanie wysłany.',
  'web.legal.accessibility.measures.title': 'Co to oznacza w praktyce',
  'web.legal.accessibility.measures.keyboard':
    'Wszystkiem można sterować za pomocą klawiatury, z widocznym pierścieniem ostrości i logiczną kolejnością ustawiania ostrości. Nie ma nigdzie interakcji polegającej wyłącznie na przeciąganiu.',
  'web.legal.accessibility.measures.contrast':
    'W automatycznym teście każda para kolorów w systemie projektowania ma współczynnik 4,5 do 1 dla tekstu podstawowego i 3 do 1 dla dużego tekstu i krawędzi kontrolnych, zarówno w jasnym, jak i ciemnym motywie.',
  'web.legal.accessibility.measures.colour':
    'Status, możliwości i świeżość zawsze niosą ze sobą ikonę, słowo i kolor.',
  'web.legal.accessibility.measures.announcements':
    'Zapis stanu, zmiany weryfikacyjne, postęp przesyłania, potwierdzenie harmonogramu i wyniki publikowania są ogłaszane czytnikom ekranu.',
  'web.legal.accessibility.measures.zoom':
    'Układy działają przy szerokości 320 pikseli i 200% powiększeniu bez poziomego przewijania strony. Szerokie tabele przewijają się w osobnym kontenerze.',
  'web.legal.accessibility.measures.motion':
    'Zmniejszona preferencja ruchu usuwa każde niepotrzebne przejście.',
  'web.legal.accessibility.measures.targets':
    'Cele dotykowe mają co najmniej 44 piksele na grubym wskaźniku.',
  'web.legal.accessibility.known.title': 'Znane luki',
  'web.legal.accessibility.known.body':
    'Będziemy tutaj wymieniać konkretne znane problemy z datą ich rozwiązania, zamiast twierdzić, że są one w pełni zgodne. Przed powszechnym udostępnieniem planowany jest niezależny audyt, a jego ustalenia zostaną opublikowane tutaj.',
  'web.legal.accessibility.feedback.title': 'Opowiedz nam o barierze',
  'web.legal.accessibility.feedback.body':
    'Opisz, co próbowałeś zrobić, stronę i technologię wspomagającą, której używasz. Odpowiemy w ciągu pięciu dni roboczych i zaproponujemy inny sposób wykonania zadania, zanim je naprawimy.',

  /* API and MCP terms ---------------------------------------------------- */
  'web.legal.apiTerms.title': 'Warunki dotyczące interfejsów API i MCP',
  'web.legal.apiTerms.summary':
    'Dodatkowe warunki dostępu programowego, w tym dane uwierzytelniające agenta, limity stawek i to, czego konto usługi nigdy nie może zrobić.',
  'web.legal.apiTerms.credentials.title': 'Poświadczenia',
  'web.legal.apiTerms.credentials.body':
    'Klucz API lub dane uwierzytelniające agenta identyfikują konto usługi o określonym zakresie. Nie jest to kopia konta osoby i nigdy nie dziedziczy jej pełnych uprawnień. Klucze są wyświetlane raz, można je odwołać w dowolnym momencie i nie można ich osadzać w aplikacji klienckiej ani w publicznym repozytorium.',
  'web.legal.apiTerms.scopes.title': 'Zakresy',
  'web.legal.apiTerms.scopes.body':
    'Czytanie, redagowanie, prośba o zatwierdzenie, planowanie, natychmiastowa publikacja, anulowanie, analityka i fakturowanie to odrębne zakresy. Zapytaj o najmniejszy zestaw potrzebny do integracji. Natychmiastowe publikowanie i inne działania wysokiego ryzyka wymagają domyślnie wyraźnego potwierdzenia przez człowieka i to ustawienie domyślne jest ustawiane dla każdego obszaru roboczego, a nie dla poświadczeń.',
  'web.legal.apiTerms.limits.title': 'Limity szybkości i idempotencja',
  'web.legal.apiTerms.limits.body':
    'Każdy zapis wymaga klucza idempotencji. Ponowne odtworzenie żądania z tym samym kluczem zwraca oryginalny wynik. Limity szybkości są publikowane w dokumentacji i zwracane w nagłówkach odpowiedzi, a odpowiedź dotycząca limitu informuje, kiedy zostanie zresetowana.',
  'web.legal.apiTerms.agents.title': 'Zachowanie agenta',
  'web.legal.apiTerms.agents.body':
    'Pojedyncze połączenie nie może zostać dyskretnie opublikowane na każdym połączonym koncie. Działania zbiorcze, nowa domena, nowe konto, kategoria wrażliwa, płatne poparcie, zmiana prywatności lub treść zmieniona po zatwierdzeniu zawsze wiążą się z decyzją człowieka. Każdy agent i każdy obszar roboczy ma wyłącznik awaryjny.',
  'web.legal.apiTerms.prohibited.title': 'Niedozwolone przez API',
  'web.legal.apiTerms.prohibited.body':
    'Odsprzedaż dostępu bez pisemnej umowy, używanie Post Array jako przekaźnika treści, do publikowania których nie masz autoryzacji, obchodzenie zasad zatwierdzania i każde użycie naruszające Zasady dopuszczalnego użytkowania. Dostęp programowy podlega tym samym kontrolom antyspamowym, co aplikacja internetowa.',
  'web.legal.apiTerms.changes.title': 'Zmień zasady',
  'web.legal.apiTerms.changes.body':
    'Zmiany dodatków są wysyłane bez powiadomienia. Najważniejsze zmiany otrzymują nową wersję, ogłoszone okno wycofania i notatkę o migracji w dzienniku zmian. Kody błędów nie zmieniają znaczenia w ramach wersji.',

  /* Affiliate terms ------------------------------------------------------ */
  'web.legal.affiliate.title': 'Warunki dla partnerów i twórców',
  'web.legal.affiliate.summary': 'Za co płacimy, czego wymagamy i co spowoduje zamknięcie konta.',
  'web.legal.affiliate.commission.title': 'Prowizja',
  'web.legal.affiliate.commission.body':
    'Pierwotna prowizja od poleconych subskrypcji przez okres do dwunastu miesięcy, z zastrzeżeniem sprawdzenia pod kątem oszustwa. Prowizja jest wstrzymywana do zamknięcia okna zwrotu i zostaje cofnięta, jeśli klient dokona zwrotu. Wypłaty realizowane są za pośrednictwem Polar.',
  'web.legal.affiliate.disclosure.title': 'Ujawnienie informacji nie jest opcjonalne',
  'web.legal.affiliate.disclosure.body':
    'Każde miejsce, w którym udostępniasz link polecający, musi jasno i blisko linku ujawniać relację handlową, w języku odbiorców. Dotyczy to zarówno filmów, postów, biuletynów, artykułów, jak i odpowiedzi społeczności.',
  'web.legal.affiliate.honesty.title': 'Płacenie za pracę, a nie za pochwały',
  'web.legal.affiliate.honesty.body':
    'Kontrakt na sponsorowany tutorial nigdy nie wymaga pozytywnego zakończenia. Możesz publikować krytykę i nadal otrzymywać wynagrodzenie. Nie kupujemy recenzji, głosów, ocen ani instalacji i nie oferujemy premii uzależnionej od pozytywnej recenzji.',
  'web.legal.affiliate.prohibited.title': 'Podstawy zamknięcia konta partnerskiego',
  'web.legal.affiliate.prohibited.brandBidding':
    'Określanie warunków naszej marki w płatnym wyszukiwaniu lub wyświetlanie reklam sugerujących, że to Ty.',
  'web.legal.affiliate.prohibited.spam':
    'Niechciane e-maile, masowe posty w społeczności lub wypadanie linków w wątkach, w których nie było pytania.',
  'web.legal.affiliate.prohibited.cookieStuffing':
    'Wypychanie plików cookie, wymuszone kliknięcia, samodzielne polecanie i kucanie kuponów.',
  'web.legal.affiliate.prohibited.claims':
    'Wymyślanie wyników klientów, sfabrykowanie opinii lub twierdzenie, że Post Array robi coś, czego nie robi, w tym cokolwiek na temat generowania mediów AI.',
  'web.legal.affiliate.prohibited.trademark':
    'Rejestrowanie domeny, uchwytu lub listy aplikacji, która wykorzystuje naszą nazwę w sposób sugerujący, że jesteś firmą.',

  /* ---------------------------------------------------------------------- */
  /* Platform names and per platform facts                                   */
  /* ---------------------------------------------------------------------- */

  'web.marketing.provider.x.label': 'X',
  'web.marketing.provider.linkedin.label': 'LinkedIn',
  'web.marketing.provider.instagram.label': 'Instagram',
  'web.marketing.provider.facebook.label': 'Facebook',
  'web.marketing.provider.youtube.label': 'YouTube',
  'web.marketing.provider.tiktok.label': 'TikTok',
  'web.marketing.provider.threads.label': 'Wątki',
  'web.marketing.provider.bluesky.label': 'Błękitne niebo',

  'web.marketing.provider.x.accountTypes': 'Osobiste lub firmowe konto X, które kontrolujesz.',
  'web.marketing.provider.x.restriction':
    'Automatyczne księgowanie wymaga wyraźnej zgody posiadacza konta, która jest rejestrowana przez Post Array. Zduplikowane lub zasadniczo podobne posty na różnych kontach są niedozwolone i nie są tworzone niechciane automatyczne odpowiedzi.',
  'web.marketing.provider.x.cost':
    'X opłaty za każdą operację API i wyższe opłaty za post zawierający adres URL. Post Array szacuje koszt przed potwierdzeniem i przekazuje go bez znaczników.',

  'web.marketing.provider.linkedin.accountTypes':
    'Profil członka lub strona organizacji, w której pełnisz odpowiednią rolę.',
  'web.marketing.provider.linkedin.restriction':
    'Publikowanie w imieniu organizacji wymaga zatwierdzonego produktu do zarządzania społecznością i zweryfikowanej tożsamości biznesowej. Analityka postów członków zależy od pozwolenia na odczyt. LinkedIn zamknął nowe aplikacje, więc Post Array nie będzie ich oferować.',
  'web.marketing.provider.linkedin.cost':
    'Brak opłat za operację. Obowiązują dzienne limity aplikacji i członków.',

  'web.marketing.provider.instagram.accountTypes':
    'Profesjonalne konto na Instagramie, firma lub twórca.',
  'web.marketing.provider.instagram.restriction':
    'Publikowanie treści na Instagramie jest dostępne tylko dla kont profesjonalnych. Konto konsumenta nie może zostać opublikowane przez żadną aplikację, łącznie z tą. Publikowanie wykorzystuje oficjalny kontener i sekwencję publikowania, a Post Array potwierdza stan końcowy, zamiast zgłaszać pomyślne przesłanie.',
  'web.marketing.provider.instagram.cost':
    'Brak opłat za operację. Wymagana jest recenzja metaaplikacji i weryfikacja firmy.',

  'web.marketing.provider.facebook.accountTypes': 'Strona na Facebooku, którą administrujesz.',
  'web.marketing.provider.facebook.restriction':
    'Celem publikacji jest strona. Automatyzacja profilu osobistego nie jest oferowana przez API i Post Array nie podejmuje takiej próby.',
  'web.marketing.provider.facebook.cost':
    'Brak opłat za operację. Wymagana jest recenzja metaaplikacji i weryfikacja firmy.',

  'web.marketing.provider.youtube.accountTypes':
    'Kanał YouTube połączony za pośrednictwem Twojego konta Google.',
  'web.marketing.provider.youtube.restriction':
    'Projekt, który nie przeszedł audytu zgodności Google API, można przesłać tylko jako prywatny. Przekaźnik nie uzna przesyłania publicznego za dostępne, dopóki audyt nie przejdzie, a na ekranie połączenia pojawi się informacja, w jakim stanie zostaną przesłane pliki.',
  'web.marketing.provider.youtube.cost':
    'Brak opłat za operację. Obowiązuje limit dzienny, którego nie można dzielić między projektami.',

  'web.marketing.provider.tiktok.accountTypes': 'Konto TikTok z autoryzacją Direct Post.',
  'web.marketing.provider.tiktok.restriction':
    'Dopóki audyt API publikowania treści nie przejdzie pomyślnie, posty są prywatne i obowiązują limity na konto. W momencie publikacji Post Array pobiera aktualne informacje o twórcy, wyświetla dostępne opcje prywatności bez wstępnego wybierania jednej i prosi o komentarz, ustawienia duetu i ściegu oraz deklarację dotyczącą treści komercyjnych.',
  'web.marketing.provider.tiktok.cost':
    'Brak opłat za operację. W trybie niezbadanym obowiązują dzienne limity publikowania.',

  'web.marketing.provider.threads.accountTypes':
    'Profil Threads powiązany z profesjonalnym kontem na Instagramie.',
  'web.marketing.provider.threads.restriction':
    'Publikowanie odbywa się zgodnie z kontenerem Meta i sekwencją publikowania. Możliwości są weryfikowane w oparciu o oficjalną kolekcję, zanim cokolwiek zostanie tutaj nazwane obsługiwanym.',
  'web.marketing.provider.threads.cost': 'Brak opłat za operację.',

  'web.marketing.provider.bluesky.accountTypes':
    'Konto Bluesky u dowolnego dostawcy usług hostingowych.',
  'web.marketing.provider.bluesky.restriction':
    'Otwarty protokół bez etapu przeglądu aplikacji. Limity szybkości i wielkości rekordów nadal obowiązują i są egzekwowane przed wysyłką.',
  'web.marketing.provider.bluesky.cost': 'Brak opłat za operację.',
  'web.marketing.provider.mastodon.label': 'Mastodon',
  'web.marketing.provider.mastodon.accountTypes': 'Konto Mastodon na dowolnej instancji.',
  'web.marketing.provider.mastodon.restriction':
    'Otwarty protokół bez etapu przeglądu aplikacji. Limit znaków ustala każda instancja, a jej limity częstotliwości są respektowane.',
  'web.marketing.provider.mastodon.cost': 'Brak opłaty za operację.',
  'web.marketing.provider.telegram.label': 'Telegram',
  'web.marketing.provider.telegram.accountTypes':
    'Bot Telegrama, którym zarządzasz, publikujący na kanale lub w grupie.',
  'web.marketing.provider.telegram.restriction':
    'Bot publikuje tylko tam, gdzie został dodany. Token to poświadczenie aplikacji, a docelowy czat wybiera się dla połączenia.',
  'web.marketing.provider.telegram.cost': 'Brak opłaty za operację.',
  'web.marketing.provider.reddit.label': 'Reddit',
  'web.marketing.provider.reddit.accountTypes': 'Konto Reddit uprawnione do publikowania.',
  'web.marketing.provider.reddit.restriction':
    'Pisanie na Reddicie wymaga zatwierdzonej aplikacji. Publikacje to posty tekstowe lub linki w dozwolonych subredditach; brak automatycznych komentarzy i głosów.',
  'web.marketing.provider.reddit.cost': 'Brak opłaty za operację.',
  'web.marketing.provider.wordpress.label': 'WordPress',
  'web.marketing.provider.wordpress.accountTypes': 'Witryna WordPress z hasłem aplikacji.',
  'web.marketing.provider.wordpress.restriction':
    'Posty wychodzą przez REST API witryny jako połączony użytkownik. Przesyłanie obrazów i filmów nie jest jeszcze zbudowane.',
  'web.marketing.provider.wordpress.cost': 'Brak opłaty za operację.',
  'web.marketing.provider.medium.label': 'Medium',
  'web.marketing.provider.medium.accountTypes': 'Profil autora Medium połączony przez OAuth.',
  'web.marketing.provider.medium.restriction':
    'Posty wychodzą jako publiczne historie w Markdown. API integracji nie ma usuwania, więc nie jest ono oferowane.',
  'web.marketing.provider.medium.cost': 'Brak opłaty za operację.',
  'web.marketing.provider.devto.label': 'Dev.to',
  'web.marketing.provider.devto.accountTypes': 'Profil Dev.to połączony jego kluczem API.',
  'web.marketing.provider.devto.restriction':
    'Artykuły wychodzą jako publiczne posty Markdown. Przesyłanie obrazów i analityka nie są jeszcze zbudowane.',
  'web.marketing.provider.devto.cost': 'Brak opłaty za operację.',
  'web.marketing.provider.pinterest.label': 'Pinterest',
  'web.marketing.provider.pinterest.accountTypes':
    'Konto biznesowe Pinterest połączone przez OAuth.',
  'web.marketing.provider.pinterest.restriction':
    'Pin wymaga obrazu i własnej tablicy. Pisanie wymaga przeglądu aplikacji; tablice są odczytywane przy połączeniu.',
  'web.marketing.provider.pinterest.cost': 'Brak opłaty za operację.',
  'web.marketing.provider.discord.label': 'Discord',
  'web.marketing.provider.discord.accountTypes':
    'Bot Discord, którym zarządzasz, publikujący na kanałach tekstowych.',
  'web.marketing.provider.discord.restriction':
    'Bot publikuje tylko na kanałach, które widzi. Wiadomości tekstowe są obsługiwane; załączniki jeszcze nie.',
  'web.marketing.provider.discord.cost': 'Brak opłaty za operację.',
  'web.marketing.provider.slack.label': 'Slack',
  'web.marketing.provider.slack.accountTypes': 'Obszar Slack połączony przez aplikację OAuth.',
  'web.marketing.provider.slack.restriction':
    'Wiadomości trafiają na publiczne i prywatne kanały, na których jest aplikacja. Przesyłanie plików i analityka nie są jeszcze zbudowane.',
  'web.marketing.provider.slack.cost': 'Brak opłaty za operację.',

  /* ---------------------------------------------------------------------- */
  /* Capability matrix notes                                                 */
  /* ---------------------------------------------------------------------- */

  'web.capabilities.short.supported': 'Obsługiwane',
  'web.capabilities.short.unsupported': 'Platforma tego nie oferuje',
  'web.capabilities.short.not_implemented': 'Jeszcze nie zbudowano',
  'web.capabilities.short.requires_review': 'Wymaga przeglądu platformy',
  'web.capabilities.notesTitle': 'Notatki i źródła',
  'web.capabilities.noteRef': 'Uwaga {number}',
  'web.capabilities.summary':
    '{supported, plural, one {# obsługiwane możliwości} other {# obsługiwane możliwości} few {# obsługiwane możliwości} many {# obsługiwane możliwości}}, {requiresReview, plural, one {# czekam na recenzję platformy} other {# czekam na recenzję platformy} few {# czekam na recenzję platformy} many {# czekam na recenzję platformy}}, {notImplemented, plural, one {# jeszcze nie zbudowano} other {# jeszcze nie zbudowano} few {# jeszcze nie zbudowano} many {# jeszcze nie zbudowano}}, {unsupported, plural, one {# platforma nie oferuje} other {# platforma nie oferuje} few {# platforma nie oferuje} many {# platforma nie oferuje}}.',
  'web.capabilities.buildState.title': 'Żaden łącznik nie obsługuje jeszcze ruchu klientów',
  'web.capabilities.buildState.body':
    'Przekaźnik jest w budowie. Ta tabela odzwierciedla dzisiejsze definicje złączy, dlatego większość komórek jest odczytywana jako jeszcze nie zbudowane. Komórka zostaje obsługiwana dopiero wtedy, gdy złącze spełnia definicję ukończenia, włączając w to testy kontraktowe względem zarejestrowanych urządzeń platformy. Komórki, które mówią, że platforma czegoś nie oferuje lub zamykają ją za recenzją, stanowią fakty dotyczące platformy i są już ostateczne.',
  'web.capabilities.note.instagramProfessional':
    'Tylko konta profesjonalne. Żadna aplikacja nie może opublikować konta klienta.',
  'web.capabilities.note.facebookPagesOnly':
    'Tylko strony. Interfejs API nie publikuje w profilu osobistym.',
  'web.capabilities.note.youtubeAudit':
    'Dopóki audyt zgodności Google API nie przejdzie pomyślnie, przesłane pliki będą traktowane jako prywatne.',
  'web.capabilities.note.tiktokAudit':
    'Dopóki audyt API publikowania treści nie przejdzie pomyślnie, posty będą prywatne i ograniczone.',
  'web.capabilities.note.tiktokPrivacy':
    'Opcja prywatności jest pobierana w momencie publikacji i musi zostać wybrana przez osobę.',
  'web.capabilities.note.linkedinMemberAnalytics':
    'Analiza postów członków wymaga pozwolenia na odczyt LinkedIn zamknął dla nowych aplikacji.',
  'web.capabilities.note.linkedinOrgAccess':
    'Wymaga zatwierdzonego produktu do zarządzania społecznością i zweryfikowanej firmy.',
  'web.capabilities.note.linkedinDocuments':
    'LinkedIn to jedyna połączona platforma z typem poczty dokumentowej.',
  'web.capabilities.note.metaReview': 'Wymaga przeglądu aplikacji Meta i weryfikacji biznesowej.',
  'web.capabilities.note.xConsent':
    'Wymaga zarejestrowanej zgody właściciela konta na automatyczne księgowanie.',
  'web.capabilities.note.xDisclosure':
    'Platforma udostępnia pole wykonane za pomocą AI, które Post Array ustawia na podstawie Twojej deklaracji.',
  'web.capabilities.note.noDestinations':
    'Ta platforma nie ma koncepcji miejsca docelowego, takiego jak strona, tablica czy społeczność.',
  'web.capabilities.note.noThreads': 'Ta platforma nie ma natywnej sekwencji wielu postów.',
  'web.capabilities.note.noDocuments': 'Na tej platformie nie ma typu publikacji dokumentów.',
  'web.capabilities.note.videoOnly': 'Ta platforma akceptuje wyłącznie przesyłanie plików wideo.',
  'web.capabilities.note.noAltText':
    'Ta platforma nie akceptuje tekstu alternatywnego za pośrednictwem interfejsu API publikowania.',
  'web.capabilities.note.noPrivacyChoice':
    'Ta platforma nie oferuje opcji prywatności poszczególnych postów za pośrednictwem interfejsu API.',
  'web.capabilities.note.noThumbnail':
    'Ta platforma nie akceptuje niestandardowej miniatury za pośrednictwem interfejsu API.',
  'web.capabilities.note.inBuild': 'Platforma to oferuje. Przekaźnik jeszcze go nie wysłał.',
  'web.capabilities.note.noCarousel': 'Platforma nie oferuje przesuwanego karuzela.',
  'web.capabilities.note.noDisclosure':
    'Platforma nie ma pola ujawnienia treści AI lub komercyjnych.',
  'web.capabilities.note.noAnalytics':
    'Platforma nie udostępnia metryk zaangażowania przez oficjalne API.',
  'web.capabilities.note.redditReview':
    'Pisanie na Reddicie wymaga zatwierdzonej aplikacji data API.',
  'web.capabilities.note.redditMedia':
    'Posty z obrazami i wideo nie są jeszcze zbudowane dla Reddita.',
  'web.capabilities.note.mediumImages': 'API integracji nie przyjmuje załączników obrazów.',
  'web.capabilities.note.mediumNoDelete': 'API integracji nie ma punktu końcowego usuwania.',
  'web.capabilities.note.devtoImages':
    'API przyjmuje tylko treść artykułu; przesyłanie obrazów nie jest jeszcze zbudowane.',
  'web.capabilities.note.pinterestNeedsImage':
    'Pin wymaga obrazu; piny tylko tekstowe nie istnieją.',
  'web.capabilities.note.pinterestReview':
    'Pisanie na Pintereście wymaga zatwierdzonego dostępu aplikacji.',

  /* ---------------------------------------------------------------------- */
  /* Status page surfaces                                                    */
  /* ---------------------------------------------------------------------- */

  'web.status.surface.web': 'Aplikacja internetowa',
  'web.status.surface.api': 'API REST',
  'web.status.surface.mcp': 'Serwer MCP',
  'web.status.surface.cli': 'CLI',
  'web.status.surface.webhooks': 'Dostawa webhooka',
  'web.status.surface.publishing': 'Pracownicy wydawnictwa',
  'web.status.surface.media': 'Przetwarzanie multimediów',
  'web.status.surface.analytics': 'Zbiór danych analitycznych',
  'web.status.surface.links': 'Krótkie linki przekierowują',
  'web.status.surface.checkout': 'Zamówienie i rozliczenia',
  'web.status.preLaunch.title': 'Przekaźnik nie jest jeszcze ogólnie dostępny',
  'web.status.preLaunch.body':
    'Ta strona jest aktywna przed produktem, więc nawyk raportowania istnieje już od pierwszego klienta, a nie jest dodawany po pierwszej awarii. Powierzchnie wciąż w budowie są oznaczone jako takie, a nie wyświetlane jako sprawne.',

  /* ---------------------------------------------------------------------- */
  /* Comparison targets                                                      */
  /* ---------------------------------------------------------------------- */

  'web.compare.product.postiz': 'Postiz',
  'web.compare.product.buffer': 'Bufor',
  'web.compare.product.hootsuite': 'Hootsuite',
  'web.compare.product.later': 'Później',
  'web.compare.product.metricool': 'Metricool',
  'web.compare.product.publer': 'Wydawca',
  'web.compare.product.socialbee': 'SocialBee',
  'web.compare.product.typefully': 'Typowo',
  'web.compare.product.publishingApis': 'Interfejsy API publikowania dla programistów',
  'web.compare.state.factCheckPending': 'Weryfikacja faktów w toku',

  /* ---------------------------------------------------------------------- */
  /* Tool radar categories                                                   */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.category.video': 'Generowanie i edycja wideo',
  'web.toolRadar.category.image': 'Generowanie i edycja obrazów',
  'web.toolRadar.category.audio': 'Dźwięk, głos i muzyka',
  'web.toolRadar.category.ugc': 'Film w stylu awatara i twórcy',
  'web.toolRadar.category.clipping': 'Długie wideo do krótkich klipów',
  'web.toolRadar.category.design': 'Projekt i układ',
  'web.toolRadar.category.research': 'Badania i gromadzenie źródeł',
  'web.toolRadar.category.workflow': 'Automatyzacja przepływu pracy',

  /* ---------------------------------------------------------------------- */
  /* Opportunity categories                                                  */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.category.launch': 'Katalogi dotyczące premier i startów produktów',
  'web.opportunities.category.review': 'Katalogi oprogramowania i recenzji',
  'web.opportunities.category.marketplace': 'Rynki integracji i automatyzacji',
  'web.opportunities.category.community':
    'Wątki prezentujące społeczność umożliwiające przesyłanie zgłoszeń',
  'web.opportunities.category.partner': 'Ekosystemy partnerów i katalogi integracyjne',
  'web.opportunities.category.editorial': 'Poradniki gościnne, podcasty i biuletyny',
  'web.opportunities.category.openSource': 'Listy open source i zasoby dokumentacji',

  /* ---------------------------------------------------------------------- */
  /* Subprocessors and retention                                             */
  /* ---------------------------------------------------------------------- */

  'web.legal.subprocessors.neon.label': 'Neon',
  'web.legal.subprocessors.neon.purpose':
    'Zarządzany PostgreSQL, uwierzytelnianie i przechowywanie obiektów.',
  'web.legal.subprocessors.neon.data':
    'Zapisy konta, treść, multimedia, harmonogramy, rachunki i zdarzenia audytu.',
  'web.legal.subprocessors.temporal.label': 'Chmura tymczasowa',
  'web.legal.subprocessors.temporal.purpose':
    'Trwałe wykonywanie przepływów pracy związanych z publikowaniem, ponawianiem prób i planowaniem.',
  'web.legal.subprocessors.temporal.data':
    'Wejście przepływu pracy ograniczone do identyfikatorów i zminimalizowanych ładunków.',
  'web.legal.subprocessors.polar.label': 'Polarny',
  'web.legal.subprocessors.polar.purpose':
    'Rekordowy sprzedawca: realizacja transakcji, subskrypcje, podatki, faktury i zwroty pieniędzy.',
  'web.legal.subprocessors.polar.data':
    'Imię i nazwisko, adres e-mail, adres rozliczeniowy, metoda płatności oferowana przez Polar i stan subskrypcji.',
  'web.legal.subprocessors.deepseek.label': 'DeepSeek',
  'web.legal.subprocessors.deepseek.purpose':
    'Pomoc tekstowa, tłumaczenie i transkreacja oraz sugestie dotyczące planowania.',
  'web.legal.subprocessors.deepseek.data':
    'Tylko tekst, który przesyłasz do funkcji AI, i dołączony do niego kontekst marki.',
  'web.legal.subprocessors.hosting.label': 'Hosting aplikacji i dostarczanie treści',
  'web.legal.subprocessors.hosting.purpose':
    'Obsługa aplikacji internetowej, interfejsu API i usługi krótkich linków.',
  'web.legal.subprocessors.hosting.data': 'Poproś o metadane i zredagowane logi.',
  'web.legal.subprocessors.email.label': 'Dostarczanie transakcyjnych e-maili',
  'web.legal.subprocessors.email.data': 'Imię i nazwisko, adres e-mail i treść wiadomości.',
  'web.legal.subprocessors.monitoring.label': 'Monitorowanie błędów i wydajności',
  'web.legal.subprocessors.monitoring.purpose':
    'Diagnozowanie błędów w publikowaniu i interfejsie.',
  'web.legal.subprocessors.monitoring.data':
    'Zredagowano ślady stosu, identyfikatory żądań i identyfikatory obszaru roboczego. Treść posta została usunięta.',
  'web.legal.subprocessors.region.pending': 'Region w trakcie potwierdzania',
  'web.legal.subprocessors.vendorPending': 'Wybierany jest dostawca',

  'web.legal.retention.column.data': 'Dane',
  'web.legal.retention.column.period': 'Jak długo jest przechowywany',
  'web.legal.retention.credentials.label': 'Aktywne dane uwierzytelniające platformy',
  'web.legal.retention.credentials.period':
    'Zaszyfrowane, gdy połączenie jest aktywne. Unieważnione na platformie i usunięte tutaj zaraz po rozłączeniu.',
  'web.legal.retention.oauthState.label': 'Stan transakcji OAuth',
  'web.legal.retention.oauthState.period': 'Minuty, następnie usunięte.',
  'web.legal.retention.drafts.label': 'Wersje robocze i media',
  'web.legal.retention.drafts.period':
    'Dopóki konto jest aktywne lub według własnych ustawień przechowywania, z okresem karencji na usunięcie.',
  'web.legal.retention.receipts.label': 'Potwierdzenia publikacji i zdarzenia kontrolne',
  'web.legal.retention.receipts.period':
    'Przechowywane przez okres obowiązywania planu i zgodny z prawem, zminimalizowane i możliwe do eksportu w dowolnym momencie.',
  'web.legal.retention.rawProvider.label': 'Surowe odpowiedzi platformy',
  'web.legal.retention.rawProvider.period':
    'Najkrótszy okres potrzebny do debugowania i zapewnienia zgodności, następnie minimalizowany lub usuwany.',
  'web.legal.retention.metrics.label': 'Obserwacje analityczne',
  'web.legal.retention.metrics.period':
    'Okres przechowywania planu w granicach dozwolonych w warunkach platformy.',
  'web.legal.retention.securityLogs.label': 'Dzienniki bezpieczeństwa',
  'web.legal.retention.securityLogs.period':
    'Stałe okno od 30 do 180 dni w zależności od ryzyka zdarzenia.',
  'web.legal.retention.billing.label': 'Rekordy rozliczeniowe',
  'web.legal.retention.billing.period':
    'Ustawowy okres przechowywania danych księgowych przysługujący firmie Polar i nam.',
  'web.legal.retention.deletedAccount.label': 'Usunięte konto',
  'web.legal.retention.deletedAccount.period':
    'Poświadczenia zostały unieważnione, a zaplanowana praca natychmiast anulowana. Pełne usunięcie zostanie zakończone w opublikowanym oknie, z wyjątkiem zgodnych z prawem zapisów rozliczeniowych.',
  'web.legal.retention.backups.label': 'Kopie zapasowe',
  'web.legal.retention.backups.period':
    'Zaszyfrowane i kontrolowane przez dostęp, wygasające w udokumentowanej rotacji. Usunięcie rozprzestrzenia się w procesie przywracania.',

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.footer.product': 'Produkt',
  'web.footer.company': 'Firma',
  'web.footer.resources': 'Zasoby',
  'web.footer.legal': 'Prawne',
  'web.footer.developers': 'Programiści',
  'web.footer.statement':
    'Post Array publikuje wyłącznie za pośrednictwem oficjalnych interfejsów API platformy. Dostępność łącznika zależy od zatwierdzeń kontrolowanych przez platformy, a każde twierdzenie o możliwościach w tej witrynie jest datowane i ma źródło.',
  'web.footer.noAffiliation':
    'Nazwy i znaki platform należą do ich właścicieli. Ich użycie tutaj wskazuje na łącznik i nie oznacza poparcia ani partnerstwa.',
  'web.footer.copyright': 'Przekaźnik {year}',
} as const;
