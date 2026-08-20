/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
  'composerWeb.pane.targets': 'Konta docelowe i zestawy',
  'composerWeb.pane.master': 'Wersja główna i ustawienia udostępnione',
  'composerWeb.pane.variant': 'Wersja dla otwartego celu',
  'composerWeb.pane.review': 'Podgląd, weryfikacja, koszt i zatwierdzenie',
  'composerWeb.pane.showPreview': 'Pokaż podgląd',
  'composerWeb.pane.hidePreview': 'Ukryj podgląd',
  'composerWeb.pane.previewCollapsed':
    'Panel podglądu jest ukryty. Otwórz go, aby sprawdzić ostatni post.',

  'composerWeb.step.targets': 'Cele',
  'composerWeb.step.write': 'Napisz',
  'composerWeb.step.perTarget': 'Na cel',
  'composerWeb.step.review': 'Recenzja',
  'composerWeb.step.progress': 'Krok {current} z {total}',
  'composerWeb.step.legend': 'Kroki kompozytora',

  'composerWeb.summary.label': 'Wersja podsumowania',
  'composerWeb.summary.targets':
    '{count, plural, =0 {Brak celów} one {# cel} other {# cele} few {# cele} many {# cele}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {Brak problemów} one {# problem} other {# problemy} few {# problemy} many {# problemy}}',
  'composerWeb.summary.notScheduled': 'Nie wybrano czasu',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Koszt nie został jeszcze wyceniony',
  'composerWeb.summary.openReview': 'Otwórz recenzję',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Wersja główna',
  'composerWeb.rail.masterHint':
    'Edytuj tutaj, aby dotrzeć do każdego celu, który nadal dziedziczy.',
  'composerWeb.rail.accountsHeading': 'Konta docelowe',
  'composerWeb.rail.setsHeading': 'Zbiory i grupy',
  'composerWeb.rail.setsHelp':
    'Zestaw to zapisana grupa kont i wartości domyślnych. Zastosowanie jednego kopiuje jego wartości do tej wersji roboczej. Późniejsze zmiany w zestawie nie zmieniają tej wersji roboczej.',
  'composerWeb.rail.openTarget': 'Otwórz wersję dla {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Limit nieznany',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {brak multimediów} one {# plik multimedialny} other {# pliki multimedialne} few {# pliki multimedialne} many {# pliki multimedialne}}',
  'composerWeb.rail.paused': 'Wstrzymano. Nie zostanie opublikowany, dopóki go nie wznowisz.',
  'composerWeb.rail.state.notBuilt': 'Jeszcze nie zbudowano',
  'composerWeb.rail.state.unsupported': 'Dostawca nie obsługuje',
  'composerWeb.rail.empty': 'Nie wybrano jeszcze żadnych kont.',
  'composerWeb.rail.emptyHelp':
    'Wybierz konta, do których powinien dotrzeć ten post. Możesz dodać więcej później.',
  'composerWeb.rail.divergenceHint':
    'Otwórz cel, aby zobaczyć jego własną wersję. Główna wersja robocza pozostaje niezmieniona.',
  'composerWeb.rail.searchLabel': 'Filtruj konta',
  'composerWeb.rail.removeTarget': 'Usuń {account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Edycja globalna',
  'composerWeb.globalEdit.title': 'Zastosuj tę zmianę do każdego wybranego celu',
  'composerWeb.globalEdit.description':
    'Wersja robocza zawsze się zmienia. Cele, które nadal dziedziczą to pole, podążają za nim. Cele posiadające własną wersję zachowują to.',
  'composerWeb.globalEdit.fieldLabel': 'Pole',
  'composerWeb.globalEdit.compatibleHeading': 'Te cele przyjmują zmianę',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Te cele zachowują swoją własną wersję',
  'composerWeb.globalEdit.incompatibleHeading': 'Te cele nie mogą przyjąć zmiany',
  'composerWeb.globalEdit.incompatibleHelp':
    'Nic nie zostanie porzucone bez powiadomienia. Każde konto poniżej otrzymuje wyraźną wersję z dostosowaną zmianą, którą możesz później edytować.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} pozwala {limit} znaków. Ten tekst to {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} nie akceptuje linku w tym polu. Link pozostaje w głównej wersji roboczej i w celach, które na to pozwalają.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} akceptuje {limit, plural, one {# plik} other {# pliki} few {# pliki} many {# pliki}}. Ta wersja robocza zawiera {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported': '{account} nie akceptuje {mimeType} pliki.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} nie obsługuje elementów uzupełniających, więc sekwencja pozostaje w wersji roboczej głównej.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} publikuje zwykły tekst. Znaki formatowania będą wyświetlane jako znaki.',
  'composerWeb.globalEdit.adaptedPreview': 'Co {account} zamiast tego otrzymuje',
  'composerWeb.globalEdit.confirm': 'Zastosuj i utwórz wersje',
  'composerWeb.globalEdit.nothingToApply':
    'Nic się nie zmienia. Wersja robocza główna ma już tę wartość.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Zmiana zastosowana do # cel} other {Zmiana zastosowana do # cele} few {Zmiana zastosowana do # cele} many {Zmiana zastosowana do # cele}}. {adapted, plural, =0 {Żaden cel nie potrzebował dostosowanej wersji} one {# cel otrzymał dostosowaną wersję} other {# cele mają dostosowane wersje} few {# cele mają dostosowane wersje} many {# cele mają dostosowane wersje}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'Ten cel ma swoją własną wersję',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# różni się od wersji roboczej } other {# pola różnią się od wersji roboczej } few {# pola różnią się od wersji roboczej } many {# pola różnią się od wersji roboczej }}',
  'composerWeb.override.field.body': 'Tekst wpisu',
  'composerWeb.override.field.contentKind': 'Typ wpisu',
  'composerWeb.override.field.locale': 'Język treści',
  'composerWeb.override.field.mediaIds': 'Media',
  'composerWeb.override.field.links': 'Linki',
  'composerWeb.override.field.signature': 'Podpis',
  'composerWeb.override.field.threadItems': 'Komentarze i wątek',
  'composerWeb.override.field.schedule': 'Harmonogram',
  'composerWeb.override.resetField': 'Resetuj {field} opanować',
  'composerWeb.override.resetFieldTitle': 'Resetuj {field} dla {account}?',
  'composerWeb.override.resetFieldBody':
    'Wersja {field} napisane dla {account} zostaje odrzucony i ponownie używana jest wersja główna. Żadnych innych zmian celów.',
  'composerWeb.override.resetAll': 'Zresetuj każde pole do stanu głównego',
  'composerWeb.override.inheritNotice':
    'Ten cel jest zgodny z wersją roboczą. Edytowanie czegokolwiek tutaj powoduje utworzenie tylko wersji {account} odbiera.',
  'composerWeb.override.created': '{account} ma teraz swój własny {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Limity dla {account}',
  'composerWeb.limits.text': 'Wysłać SMS-a do {limit} znaki',
  'composerWeb.limits.linkCost':
    'Link liczy się jako {count, plural, one {# znak} other {# znaki} few {# znaki} many {# znaki}} niezależnie od długości.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Brak obrazów} one {# obraz} other {do # obrazy} few {do # obrazy} many {do # obrazy}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {Brak wideo} one {# wideo} other {do # filmy} few {do # filmy} many {do # filmy}}',
  'composerWeb.limits.duration': 'Wideo do {duration}',
  'composerWeb.limits.aspect': 'Proporcje pomiędzy {min} i {max}',
  'composerWeb.limits.fileSize': 'Pliki do {size}',
  'composerWeb.limits.mimeTypes': 'Akceptowane typy plików: {types}',
  'composerWeb.limits.source': 'Z migawki możliwości {version}, przeczytaj {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'Wymagana jest miniatura.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider} ustawienia',
  'composerWeb.native.privacy': 'Kto może to zobaczyć',
  'composerWeb.native.privacyChoose': 'Wybierz odbiorców',
  'composerWeb.native.privacyExplicit':
    '{provider} nie pozwala na wcześniej wybraną grupę odbiorców. Wybierz jeden, zanim będzie można to zaplanować.',
  'composerWeb.native.community': 'Społeczność',
  'composerWeb.native.board': 'Płyta',
  'composerWeb.native.group': 'Grupa lub strona',
  'composerWeb.native.organization': 'Organizacja',
  'composerWeb.native.channel': 'Kanał',
  'composerWeb.native.publication': 'Publikacja',
  'composerWeb.native.disclosureHeading': 'Ujawnienie',
  'composerWeb.native.disclosureCommercial': 'Ten post promuje produkt lub usługę',
  'composerWeb.native.disclosureBranded': 'Ten post zawiera treści związane z marką innej firmy',
  'composerWeb.native.disclosureAi': 'Część tej treści została utworzona za pomocą narzędzia AI',
  'composerWeb.native.disclosureUnsupported':
    '{provider} nie udostępnia tego ujawnienia za pośrednictwem swojego interfejsu API. Zamiast tego dodaj to do tekstu.',
  'composerWeb.native.none': 'Nie {provider} dotyczą tego typu postu.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Rozwiązano w dniu {provider}',
  'composerWeb.entity.resolvedId': 'Identyfikator konta {externalId}',
  'composerWeb.entity.plainTextWarning':
    'Nie dopasowano. Zostanie opublikowany jako zwykły tekst, który nie jest tagiem natywnym w {provider}.',
  'composerWeb.entity.removeMention': 'Usuń wzmiankę o {label}',
  'composerWeb.entity.addMention': 'Dodaj wzmiankę',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Brak wzmianek} one {# wzmianka} other {# wspomina} few {# wspomina} many {# wspomina}}, {resolved} dopasowane do konta rzeczywistego',
  'composerWeb.entity.lookupUnsupported':
    '{provider} nie oferuje wyszukiwania jednostek dla tego typu konta.',
  'composerWeb.entity.lookupNotBuilt':
    'Przekaźnik nie zbudował wyszukiwania jednostek dla {provider} jeszcze. W międzyczasie nic nie jest zgadywane.',
  'composerWeb.entity.searchHint': 'Wpisz co najmniej dwa znaki, a następnie wybierz wynik.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {Brak dopasowań} one {# dopasowanie} other {# pasuje} few {# pasuje} many {# pasuje}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Linki',
  'composerWeb.links.detected':
    '{count, plural, one {# link znaleziony w tej wersji roboczej} other {# linki znalezione w tej wersji roboczej} few {# linki znalezione w tej wersji roboczej} many {# linki znalezione w tej wersji roboczej}}',
  'composerWeb.links.noneDetected': 'Brak jeszcze linków w tej wersji roboczej.',
  'composerWeb.links.modeLabel': 'Jak ten link publikuje',
  'composerWeb.links.original': 'Oryginalny adres URL',
  'composerWeb.links.utmSource': 'Źródło',
  'composerWeb.links.utmMedium': 'Średni',
  'composerWeb.links.utmCampaign': 'Kampania',
  'composerWeb.links.utmTerm': 'Termin',
  'composerWeb.links.utmContent': 'Treść',
  'composerWeb.links.domainVerified': '{domain}, zweryfikowano dla tego obszaru roboczego',
  'composerWeb.links.domainDefault': 'Domyślna domena przekaźnika',
  'composerWeb.links.domainNone': 'Żadna markowa domena nie została jeszcze zweryfikowana.',
  'composerWeb.links.notAllowedHere': '{account} nie pozwala na umieszczenie tutaj linku.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Komentarz',
  'composerWeb.sequence.kindThread': 'Część gwintu',
  'composerWeb.sequence.kindLabel': 'Typ przedmiotu',
  'composerWeb.sequence.moveUp': 'Przenieś ten element wcześniej',
  'composerWeb.sequence.moveDown': 'Przenieś ten element później',
  'composerWeb.sequence.remove': 'Usuń ten element',
  'composerWeb.sequence.absoluteTime': 'Uruchamia się o {time}, czyli {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'Jeśli element się nie powiedzie, już opublikowany post pozostanie opublikowany, a elementy następujące po nim nie zostaną uruchomione. Otrzymujesz przedmiot akcji.',
  'composerWeb.sequence.maxReached':
    '{account} akceptuje {limit, plural, one {# element uzupełniający} other {# elementy uzupełniające} few {# elementy uzupełniające} many {# elementy uzupełniające}}.',
  'composerWeb.sequence.minDelay':
    'Najkrótsze opóźnienie {provider} pozwala tutaj jest {duration}.',
  'composerWeb.sequence.inheritAuthor': 'To samo konto co post',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Brak problemów} one {# problem} other {# problemy} few {# problemy} many {# problemy}} na ten przedmiot',
  'composerWeb.sequence.customMinutes': 'Minuty po poprzednim elemencie',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Powtórz ten post',
  'composerWeb.repeat.cadenceLabel': 'Jak często',
  'composerWeb.repeat.maximum':
    'Powtarzający się post może zostać wyświetlony maksymalnie {limit} razy.',
  'composerWeb.repeat.occurrenceLabel': 'Liczba postów',
  'composerWeb.repeat.duplicateCheck':
    'Każde wystąpienie przed opublikowaniem jest sprawdzane pod kątem duplikatów treści. Zdarzenie, które nie przejdzie kontroli, zamiast zostać opublikowane, staje się elementem działania.',
  'composerWeb.repeat.occurrenceList': 'Pierwsze wystąpienia',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {i # więcej wystąpień} other {i # więcej wystąpień} few {i # więcej wystąpień} many {i # więcej wystąpień}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Zestawy i podpis',
  'composerWeb.set.pickerTitle': 'Zacznij od zestawu',
  'composerWeb.set.pickerDescription':
    'Zestaw wypełnia cele, tekst i ustawienia. Tworzona przez niego wersja robocza jest niezależna, więc późniejsza edycja Zestawu nigdy nie powoduje zmiany zatwierdzonego lub zaplanowanego postu.',
  'composerWeb.set.accountCount':
    '{count, plural, one {# konto} other {# konta} few {# konta} many {# konta}}',
  'composerWeb.set.apply': 'Użyj tego zestawu',
  'composerWeb.set.none': 'Nie zapisano jeszcze żadnych zestawów.',
  'composerWeb.signature.pickerLabel': 'Podpis',
  'composerWeb.signature.scope': 'Dla {project} na {provider} w {language}',
  'composerWeb.signature.previewHeading': 'Jak kończy się post',
  'composerWeb.signature.notMatching':
    'Ten podpis jest ograniczony do innej marki, platformy lub języka, więc nie jest tutaj oferowany.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Pomóż z tym tekstem',
  'composerWeb.assist.unavailableTitle': 'Pomoc tekstowa nie jest skonfigurowana',
  'composerWeb.assist.unavailableBody':
    'Dla tego obszaru roboczego nie skonfigurowano żadnej bramy AI, więc działania wspomagające są wyłączone. Wszystko inne w kompozytorze działa normalnie.',
  'composerWeb.assist.targetLabel': 'Dotyczy',
  'composerWeb.assist.targetMaster': 'Wersja robocza',
  'composerWeb.assist.targetVariant': 'Wersja dla {account}',
  'composerWeb.assist.beforeLabel': 'Aktualny tekst',
  'composerWeb.assist.afterLabel': 'Proponowany tekst',
  'composerWeb.assist.regionLabel': 'Proponowana zmiana tekstu, jeszcze nie zastosowana',
  'composerWeb.assist.added': 'dodano',
  'composerWeb.assist.removed': 'usunięto',
  'composerWeb.assist.evidence': 'Dowody i źródła',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Nie znaleziono źródła tego twierdzenia. Sprawdź to przed publikacją.',
  'composerWeb.assist.failed':
    'Prośba o pomoc nie została ukończona. Twój tekst pozostaje niezmieniony.',
  'composerWeb.assist.noMediaGeneration':
    'Przekaźnik nie tworzy obrazów ani wideo. Przenieś gotowe pliki do biblioteki i opublikuj je tutaj.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'To jest zatwierdzona wersja. Edycja tworzy nową wersję i kasuje zatwierdzenie.',
  'composerWeb.autosave.pinnedAcknowledge': 'Edytuj i wyczyść zatwierdzenie',
  'composerWeb.autosave.conflictTitle': 'Dwie wersje tej wersji roboczej',
  'composerWeb.autosave.conflictKeepMine': 'Zachowaj to, co napisałem',
  'composerWeb.autosave.conflictKeepTheirs': 'Użyj wersji z {name}',
  'composerWeb.autosave.conflictHelp':
    'Nic nie jest łączone automatycznie. Wybierz według pola, a następnie zapisz.',
  'composerWeb.autosave.retry': 'Spróbuj zapisać ponownie',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Skróty kompozytora',
  'composerWeb.shortcuts.nextTarget': 'Następny cel',
  'composerWeb.shortcuts.previousTarget': 'Poprzedni cel',
  'composerWeb.shortcuts.nextIssue': 'Następny numer',
  'composerWeb.shortcuts.previousIssue': 'Poprzedni numer',
  'composerWeb.shortcuts.save': 'Zapisz wersję roboczą teraz',
  'composerWeb.shortcuts.openSchedule': 'Otwórz arkusz harmonogramu',
  'composerWeb.shortcuts.open': 'Pokaż skróty',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'Recenzja',
  'composerWeb.review.contentVersion': 'Wersja treści {checksum}',
  'composerWeb.review.approvalPolicy': 'Zasady: {policy}',
  'composerWeb.review.approverPending': 'Czekam na decyzję od {approver}.',
  'composerWeb.review.approverNone': 'W przypadku tych celów nie jest wymagana żadna zgoda.',
  'composerWeb.review.perTargetHeading': 'Co otrzymuje każde konto',
  'composerWeb.review.finalUrl': 'Opublikowany link',
  'composerWeb.review.privacyState': 'Odbiorcy: {value}',
  'composerWeb.review.disclosureState': 'Ujawnienie: {value}',
  'composerWeb.review.disclosureNone': 'Brak zestawu ujawnień',
  'composerWeb.review.mediaVersion': '{name}, wersja {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# celu nie można jeszcze zaplanować} other {# celów nie można jeszcze zaplanować} few {# celów nie można jeszcze zaplanować} many {# celów nie można jeszcze zaplanować}}',
  'composerWeb.review.offlineBlocked':
    'Planowanie i publikowanie wymagają połączenia. Twoja wersja robocza jest bezpieczna na tym urządzeniu.',
  'composerWeb.review.publishConfirm':
    'To publikuje w {count, plural, one {# konto} other {# konta} few {# konta} many {# konta}} natychmiast. Stąd nie można tego cofnąć.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Nowa wersja robocza',
  'composerWeb.page.loading': 'Ładowanie wersji roboczej, jej celów i limitów',
  'composerWeb.page.errorTitle': 'Nie można otworzyć tej wersji roboczej',
  'composerWeb.page.errorBody':
    'Nic nie zginęło. Spróbuj ponownie, a jeśli nadal się nie powiedzie, poniższy odnośnik pomoże zespołowi pomocy znaleźć żądanie.',
  'composerWeb.page.noConnectionsTitle': 'Połącz konto przed tworzeniem',
  'composerWeb.page.noConnectionsBody':
    'Wersja robocza wymaga co najmniej jednego połączonego konta, aby Relay znał limity, podgląd i ustawienia do wyświetlenia.',
  'composerWeb.page.noConnectionsExample':
    'Przykład: po połączeniu X i LinkedIn jedna wersja robocza staje się dwiema wersjami natywnymi z własnymi licznikami.',
  'composerWeb.page.permissionTitle': 'Nie możesz tworzyć postów w tym obszarze roboczym',
  'composerWeb.page.permissionBody':
    'Tworzenie wymaga roli redaktora lub wyższej. Właściciel lub administrator może zmienić Twoją rolę.',
  'composerWeb.page.rateLimitTitle': 'Zbyt wiele zapisów wersji roboczej w krótkim czasie',
  'composerWeb.page.rateLimitCause':
    'W tym obszarze roboczym osiągnięto limit zapisu dla bieżącego okna. Tymczasem Twój SMS jest przechowywany na tym urządzeniu.',
  'composerWeb.page.rateLimitAlternative':
    'Pisz dalej. Zapisywanie zostanie wznowione automatycznie po zresetowaniu okna.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Siatka',
  'mediaLib.view.list': 'Lista',
  'mediaLib.view.label': 'Układ',
  'mediaLib.sort.label': 'Sortuj',
  'mediaLib.sort.newest': 'Najpierw najnowsze',
  'mediaLib.sort.name': 'Nazwa',
  'mediaLib.sort.size': 'Najpierw największy',
  'mediaLib.select': 'Wybierz {name}',
  'mediaLib.column.file': 'Plik',
  'mediaLib.column.type': 'Typ',
  'mediaLib.column.size': 'Rozmiar',
  'mediaLib.column.altText': 'Tekst alternatywny',
  'mediaLib.column.rights': 'Prawa',
  'mediaLib.column.added': 'Dodano',
  'mediaLib.openDetail': 'Otwórz {name}',

  'mediaLib.empty.title': 'Brak jeszcze multimediów',
  'mediaLib.empty.body':
    'Prześlij obrazy i filmy, które już masz, lub zaimportuj plik z adresu URL. Przekaźnik sprawdza typ i rozmiar na każdym koncie, na którym publikujesz.',
  'mediaLib.empty.example':
    'Przykład: launch_hero.jpg, 1600 na 900, zestaw tekstu alternatywnego, użyty w 2 postach.',
  'mediaLib.error.title': 'Nie można załadować biblioteki',
  'mediaLib.error.body': 'Twoje pliki są bezpieczne. Ta awaria nic nie zmieniła.',
  'mediaLib.offline.title': 'Biblioteka jest niedostępna offline',
  'mediaLib.offline.body':
    'Nie możemy odświeżyć biblioteki bez połączenia. Pliki już widoczne na tym ekranie są niezmienione. Połącz się ponownie, a potem spróbuj jeszcze raz.',
  'mediaLib.rateLimited.title': 'Biblioteka potrzebuje krótkiej przerwy',
  'mediaLib.rateLimited.cause':
    'API poprosiło nas o zwolnienie podczas wczytywania Twoich plików. Twoje przechowywane media są bezpieczne.',
  'mediaLib.rateLimited.resetLabel': 'Spróbuj ponownie po',
  'mediaLib.rateLimited.alternative':
    'Możesz nadal tworzyć szkice lokalnie, ale przesyłanie i zmiany w bibliotece czekają, aż limit się zresetuje.',
  'mediaLib.loading': 'Ładowanie biblioteki multimediów',
  'mediaLib.permission.title': 'Nie widzisz tej biblioteki obszaru roboczego',
  'mediaLib.permission.body':
    'Oglądanie multimediów wymaga w przypadku tej marki roli widza lub wyższej. Może to przyznać właściciel lub administrator.',

  'mediaLib.upload.heading': 'Dodaj multimedia',
  'mediaLib.upload.browse': 'Wybierz pliki',
  'mediaLib.upload.dropHint':
    'Przeciągnij tutaj pliki lub wybierz je. Przesyłanie zostaje wznowione w przypadku zerwania połączenia.',
  'mediaLib.upload.queueHeading': 'Przesłane pliki',
  'mediaLib.upload.progress': '{name}, {percent} z {size} wysłane',
  'mediaLib.upload.paused': 'Wstrzymano. {sent} z {size} jest już zapisany.',
  'mediaLib.upload.resume': 'Wznów przesyłanie',
  'mediaLib.upload.pause': 'Wstrzymaj przesyłanie',
  'mediaLib.upload.cancel': 'Anuluj przesyłanie',
  'mediaLib.upload.retry': 'Spróbuj przesłać ponownie',
  'mediaLib.upload.finalizing': 'Wykończenie {name}',
  'mediaLib.upload.done': '{name} znajduje się w Twojej bibliotece',
  'mediaLib.upload.failed': '{name} nie zakończył się. {reason}',
  'mediaLib.upload.offline':
    'Offline. Przesyłanie będzie kontynuowane od miejsca, w którym zostało zatrzymane, po ponownym połączeniu.',
  'mediaLib.upload.rejectedType':
    '{name} to {mimeType}, którego żadne z wybranych kont nie akceptuje.',
  'mediaLib.upload.rejectedSize': '{name} to {size}. Najniższy limit na Twoich kontach to {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Zaakceptowane przez # twoich kont} other {Zaakceptowane przez # twoich kont} few {Zaakceptowane przez # twoich kont} many {Zaakceptowane przez # twoich kont}}',
  'mediaLib.upload.rejectedBy': 'Nie zaakceptowane przez {accounts}',
  'mediaLib.upload.checkedAgainst':
    'Sprawdziliśmy w odniesieniu do rachunków wybranych w tej wersji roboczej.',
  'mediaLib.upload.noTargets':
    'Nie wybrano żadnych kont, więc plik jest sprawdzany tylko pod kątem ustawień domyślnych obszaru roboczego.',
  'mediaLib.import.urlLabel': 'Publiczny URL pliku',
  'mediaLib.import.urlPlaceholder': 'https://cdn.example.com/launch-video.mp4',
  'mediaLib.import.importing': 'Importowanie mediów',
  'mediaLib.import.succeeded': 'Plik jest w Twojej bibliotece',
  'mediaLib.import.scanPending':
    'Relay zapisał jego źródło. Publikacja czeka na zakończenie kontroli bezpieczeństwa.',
  'mediaLib.import.failed': 'Nie udało się zaimportować pliku',
  'mediaLib.import.failedHelp':
    'Sprawdź, czy link jest publiczny i prowadzi bezpośrednio do obsługiwanego pliku multimedialnego, a potem spróbuj ponownie.',
  'mediaLib.import.readOnly': 'Połącz API, aby importować pliki w tym środowisku.',
  'mediaLib.import.offline': 'Połącz się ponownie przed zaimportowaniem pliku.',
  'mediaLib.import.issue.invalid': 'Wprowadź pełny adres URL.',
  'mediaLib.import.issue.scheme': 'Użyj linku HTTP lub HTTPS.',
  'mediaLib.import.issue.credentials': 'Użyj linku bez nazwy użytkownika ani hasła.',
  'mediaLib.retention.title': 'Przechowywane pliki są zachowywane przez 30 dni po utworzeniu posta',
  'mediaLib.retention.body':
    'Gdy plik zostanie dołączony do posta, trwale usuwamy go z przechowywania Relay 30 dni po utworzeniu tego posta. Pliki oczekujące na dołączenie używają daty przesłania jako rezerwowej daty czyszczenia. Tekst posta, potwierdzenia publikacji i historia audytu pozostają dostępne dłużej. Opublikowany post na platformie społecznościowej nie jest usuwany, gdy jego przechowywany plik wygasa.',
  'mediaLib.retention.limits':
    'Obrazy, dźwięk i pliki PDF mogą mieć do {imageSize}. Filmy mogą mieć do {videoSize}.',
  'mediaLib.retention.expiresLabel': 'Data usunięcia pliku',
  'mediaLib.retention.deleted': 'Trwale usunięty',
  'mediaLib.retention.deletedTitle': 'Ten przechowywany plik został usunięty',
  'mediaLib.retention.deletedBody':
    '30-dniowy okres przechowywania zakończył się. Tekst posta, potwierdzenia publikacji i historia audytu pozostają.',
  'mediaLib.processing.unavailableTitle': 'Ten plik nie jest gotowy do publikacji',
  'mediaLib.processing.unavailableBody':
    'Przetwarzanie lub kontrola bezpieczeństwa nadal oczekują albo się nie powiodły. Prześlij plik ponownie, jeśli ten stan się nie wyjaśni.',
  'mediaLib.processing.pendingTitle': 'Skanowanie bezpieczeństwa jest niedostępne przed uruchomieniem',
  'mediaLib.processing.pendingBody':
    'Plik jest przechowywany przez 30 dni, ale nie można go dołączyć do opublikowanego posta, dopóki skanowanie bezpieczeństwa nie zostanie włączone.',
  'mediaLib.processing.blockedTitle': 'Ten plik nie może zostać opublikowany',
  'mediaLib.processing.blockedBody':
    'Plik nie przeszedł przetwarzania ani kontroli bezpieczeństwa. Prześlij inny plik.',

  'mediaLib.alt.heading': 'Tekst alternatywny',
  'mediaLib.alt.help':
    'Opisz, co jest ważne na obrazie dla kogoś, kto tego nie widzi. Zwykle wystarczy jedno lub dwa zdania.',
  'mediaLib.alt.count': '{used} z {limit} znaki',
  'mediaLib.alt.requiredBy': 'Wymagane przez {accounts}',
  'mediaLib.alt.waive': 'Ten obraz nie zawiera żadnych informacji',
  'mediaLib.alt.waiveReason': 'Dlaczego nie trzeba tego opisywać',
  'mediaLib.alt.waiveHelp':
    'Użyj tego tylko do dekoracji. Obraz, którego zrezygnowano, jest publikowany z pustym opisem, jeśli platforma na to pozwala.',
  'mediaLib.alt.waived': 'Odstąpienie od {name} na {date}. Powód: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} nie akceptuje tekstu alternatywnego za pośrednictwem interfejsu API dla tego konta.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# plik nie zawiera tekstu alternatywnego} other {# pliki nie mają tekstu alternatywnego} few {# pliki nie mają tekstu alternatywnego} many {# pliki nie mają tekstu alternatywnego}}',

  'mediaLib.rights.heading': 'Prawa i zgoda',
  'mediaLib.rights.declared': 'Zadeklarowane przez {name} na {date}',
  'mediaLib.rights.undeclared':
    'Jeszcze nie zadeklarowano. Zadeklaruj to przed publikacją tego pliku.',
  'mediaLib.rights.ownerLabel': 'Kto jest właścicielem tego pliku',
  'mediaLib.rights.ownerSelf': 'Ten obszar roboczy',
  'mediaLib.rights.ownerLicensed': 'Licencja od kogoś innego',
  'mediaLib.rights.ownerUgc': 'Klient lub twórca udzielił pozwolenia',
  'mediaLib.rights.licenseLabel': 'Odniesienie do licencji lub pozwolenia',
  'mediaLib.rights.peopleLabel': 'W tym pliku pojawiają się osoby',
  'mediaLib.rights.peopleConsent': 'Wszyscy pokazani wyrazili zgodę na publikację',
  'mediaLib.rights.musicLabel': 'Ten plik zawiera muzykę lub ścieżkę dźwiękową',
  'mediaLib.rights.confirm':
    'Mam prawa do opublikowania tego pliku, łącznie z zawartymi w nim osobami, muzyką, logo i markami.',
  'mediaLib.rights.blocking':
    'Nie można zaplanować tego pliku, dopóki nie zostaną zadeklarowane prawa.',

  'mediaLib.editor.heading': 'Edytuj zdjęcie',
  'mediaLib.editor.description':
    'Każda zmiana jest zapisywana jako nowa wersja. Oryginalny plik zostanie zachowany i można go przywrócić.',
  'mediaLib.editor.tab.crop': 'Przytnij',
  'mediaLib.editor.tab.transform': 'Zmień rozmiar i obróć',
  'mediaLib.editor.tab.canvas': 'Płótno',
  'mediaLib.editor.tab.output': 'Format i rozmiar',
  'mediaLib.editor.tab.thumbnail': 'Miniatura',
  'mediaLib.editor.presetLabel': 'Ustawione proporcje',
  'mediaLib.editor.presetFree': 'Bezpłatny',
  'mediaLib.editor.presetFor': '{ratio}, używany przez {accounts}',
  'mediaLib.editor.cropX': 'Przytnij od krawędzi początkowej',
  'mediaLib.editor.cropY': 'Przytnij od góry',
  'mediaLib.editor.cropWidth': 'Szerokość kadru',
  'mediaLib.editor.cropHeight': 'Wysokość uprawy',
  'mediaLib.editor.cropKeyboardHint':
    'Pole przycinania jest ustawione z polami liczbowymi, więc działa w pełni z klawiatury.',
  'mediaLib.editor.widthLabel': 'Szerokość w pikselach',
  'mediaLib.editor.heightLabel': 'Wysokość w pikselach',
  'mediaLib.editor.lockRatio': 'Zachowaj obecne proporcje',
  'mediaLib.editor.rotateLabel': 'Obrót',
  'mediaLib.editor.rotateDegrees': '{degrees} stopnie',
  'mediaLib.editor.flipHorizontal': 'Odwróć się wzdłuż osi pionowej',
  'mediaLib.editor.flipVertical': 'Odwróć się wzdłuż osi poziomej',
  'mediaLib.editor.canvasColor': 'Kolor tła',
  'mediaLib.editor.canvasFit': 'Jak obraz układa się na płótnie',
  'mediaLib.editor.canvasFitCover': 'Wypełnij płótno i przytnij nadmiar',
  'mediaLib.editor.canvasFitContain': 'Dopasuj cały obraz i uzupełnij resztę',
  'mediaLib.editor.formatLabel': 'Format wyjściowy',
  'mediaLib.editor.qualityLabel': 'Jakość kompresji',
  'mediaLib.editor.qualityValue': '{value} ze 100',
  'mediaLib.editor.estimatedSize': 'Szacowana produkcja {size}, z {original}',
  'mediaLib.editor.estimatedSizeUnknown':
    'Rozmiar wyjściowy jest znany dopiero po przetworzeniu pliku.',
  'mediaLib.editor.thumbnailHelp':
    'Wybierz klatkę lub plik używany jako miniatura wideo, jeśli platforma ją akceptuje.',
  'mediaLib.editor.thumbnailFrame': 'Klatka w {time}',
  'mediaLib.editor.save': 'Zapisz jako nową wersję',
  'mediaLib.editor.saving': 'Zapisywanie wersji {version}',
  'mediaLib.editor.saved': 'Wersja {version} zapisano. Oryginał wciąż tu jest.',
  'mediaLib.editor.discard': 'Odrzuć te zmiany',
  'mediaLib.editor.noChanges': 'Nie ma jeszcze zmian do zapisania.',
  'mediaLib.editor.revalidate':
    'Zapisanie powoduje ponowne sprawdzenie tego pliku pod kątem każdego konta w wersjach roboczych, które go używają.',
  'mediaLib.editor.noGeneration': 'Ten edytor zmienia przesłany plik. Nie tworzy nowych obrazów.',

  'mediaLib.versions.heading': 'Wersje',
  'mediaLib.versions.original': 'Oryginalny plik przesłany',
  'mediaLib.versions.current': 'Aktualna wersja',
  'mediaLib.versions.restore': 'Przywróć wersję {version}',
  'mediaLib.versions.item': 'Wersja {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'Skąd pochodzi ten plik',
  'mediaLib.provenance.sourceUrl': 'Źródłowy adres URL',
  'mediaLib.provenance.fetchedAt': 'Pobrano {date}',
  'mediaLib.provenance.declaredAuthor': 'Podany autor',
  'mediaLib.provenance.declaredLicense': 'Licencja podana',
  'mediaLib.provenance.contentCredentials': 'Wbudowane dane uwierzytelniające treści',
  'mediaLib.provenance.contentCredentialsNone':
    'Ten plik nie zawiera żadnych danych uwierzytelniających osadzonych treści. Jest to powszechne i nie oznacza, że coś jest nie tak.',
  'mediaLib.provenance.unverified':
    'Te szczegóły pochodzą ze źródła, a nie z Relay. Sprawdź je, zanim na nich zaczniesz polegać.',

  'mediaLib.picker.title': 'Wybierz multimedia',
  'mediaLib.picker.description': 'Pliki są sprawdzane z kontami wybranymi w tej wersji roboczej.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Wybierz pliki} one {Dodaj # plik} other {Dodaj # pliki} few {Dodaj # pliki} many {Dodaj # pliki}}',
  'mediaLib.picker.forMaster': 'Dodawanie do wersji roboczej',
  'mediaLib.picker.forVariant': 'Dodanie do wersji dla {account} tylko',
} as const;
