/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Utwórz',
  'composer.titleWithProject': 'Utwórz dla {project}',
  'composer.master.label': 'Wersja główna',
  'composer.master.description':
    'Napisz tutaj raz. Kompatybilne zmiany docierają do każdego wybranego celu. Otwórz cel, aby napisać wersję, którą otrzyma tylko to konto.',
  'composer.master.globalEdit': 'Edycja globalna',
  'composer.master.placeholder': 'Co chcesz opublikować?',
  'composer.brief.label': 'Krótkie',
  'composer.brief.placeholder': 'Opisz pomysł, odbiorców i oczekiwany rezultat.',
  'composer.sources.label': 'Źródła referencyjne',
  'composer.sources.empty': 'Brak dołączonych źródeł.',
  'composer.campaign.label': 'Kampania',
  'composer.campaign.none': 'Brak kampanii',
  'composer.contentLocale.label': 'Język treści',
  'composer.contentLocale.help': 'Język postu. Jest to niezależne od języka interfejsu.',
  'composer.market.label': 'Rynek odbiorców',

  'composer.targets.title': 'Cele',
  'composer.targets.count':
    '{count, plural, =0 {Nie wybrano żadnych kont} one {# konto} other {# konta} few {# konta} many {# konta}}',
  'composer.targets.publishSummary':
    '{count, plural, one {To zostanie opublikowane w # konto} other {To zostanie opublikowane w # konta} few {To zostanie opublikowane w # konta} many {To zostanie opublikowane w # konta}} {when, select, now {teraz} scheduled {o zaplanowanej godzinie} other {}}',
  'composer.targets.add': 'Dodaj konta',
  'composer.targets.empty': 'Wybierz co najmniej jedno konto, na którym chcesz opublikować.',
  'composer.targets.state.ready': 'Gotowy',
  'composer.targets.state.inherited': 'Dziedziczone od mistrza',
  'composer.targets.state.overridden': 'Zastąpione',
  'composer.targets.state.warning': 'Sprawdź przed publikacją',
  'composer.targets.state.error': 'Wymaga poprawki',
  'composer.targets.state.approvalNeeded': 'Wymagana zgoda',
  'composer.targets.overrideBadge': 'Zastąp',
  'composer.targets.resetConfirm.title': 'Zresetować ten cel do wersji roboczej głównej?',
  'composer.targets.resetConfirm.body':
    'Kopia, multimedia i ustawienia, które zmieniłeś dla {account} zostanie zastąpiony wersją roboczą główną. Nie ma to wpływu na inne cele.',
  'composer.targets.divergence':
    '{count, plural, one {# cel różni się od wersji roboczej } other {# cele różnią się od wersji roboczej} few {# cele różnią się od wersji roboczej} many {# cele różnią się od wersji roboczej}}',

  'composer.applyToAll.title': 'Zastosuj do wszystkich celów',
  'composer.applyToAll.compatible':
    '{count, plural, one {# jest kompatybilne z każdym wybranym celem} other {# pola są kompatybilne z każdym wybranym celem} few {# pola są kompatybilne z każdym wybranym celem} many {# pola są kompatybilne z każdym wybranym celem}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# i pozostaje ono na cel} other {# pól nie można zastosować i pozostają one na cel} few {# pól nie można zastosować i pozostają one na cel} many {# pól nie można zastosować i pozostają one na cel}}',
  'composer.applyToAll.creates': 'Zastosowanie tworzy jawną wersję dla każdego celu.',

  'composer.editor.label': 'Tekst wpisu',
  'composer.editor.characterCount': '{used} z {limit} znaki',
  'composer.editor.characterCountOver': '{over} znaków nad {limit} limit znaków',
  'composer.editor.characterCountUnknown': 'Limit znaków niedostępny dla tego konta',
  'composer.editor.remaining':
    '{count, plural, one {# pozostał znak} other {# pozostało znaków} few {# pozostało znaków} many {# pozostało znaków}}',
  'composer.editor.hashtagCount':
    '{count, plural, one {# hashtag} other {# hashtagi} few {# hashtagi} many {# hashtagi}}',
  'composer.editor.formatting': 'Formatowanie',
  'composer.editor.emoji': 'Emoji',
  'composer.editor.mention': 'Wzmianka',
  'composer.editor.link': 'Link',

  'composer.mentions.search': 'Wyszukaj osoby, strony i firmy',
  'composer.mentions.searching': 'Wyszukiwanie {provider}',
  'composer.mentions.resolved': 'Otagowano {label} na {provider}',
  'composer.mentions.unresolved':
    'Ta wzmianka nie została powiązana z {provider} jeszcze konto. Będzie publikowany jako zwykły tekst, dopóki nie wybierzesz wyniku.',
  'composer.mentions.noResults': 'Brak pasujących kont w {provider}.',
  'composer.mentions.unsupported': 'Tagowanie natywne nie jest dostępne dla tego konta.',

  'composer.destination.label': 'Miejsce docelowe',
  'composer.destination.placeholder': 'Wybierz miejsce publikacji',
  'composer.destination.community': 'Społeczność',
  'composer.destination.board': 'Płyta',
  'composer.destination.group': 'Grupa',
  'composer.destination.page': 'Strona',
  'composer.destination.organization': 'Organizacja',
  'composer.destination.channel': 'Kanał',
  'composer.destination.refresh': 'Odśwież miejsca docelowe',
  'composer.destination.lastRefreshed': 'Odświeżono miejsca docelowe {relativeTime}',

  'composer.media.title': 'Media',
  'composer.media.count':
    '{count, plural, one {# plik} other {# pliki} few {# pliki} many {# pliki}}',
  'composer.media.dropHint': 'Przeciągnij pliki tutaj lub przeglądaj swoją bibliotekę.',
  'composer.media.inheritFromMaster': 'Korzystanie z nośnika głównego',
  'composer.media.overridden': 'Ten cel korzysta z własnych mediów',
  'composer.media.altText.label': 'Tekst alternatywny',
  'composer.media.altText.placeholder': 'Opisz obraz dla osób korzystających z czytnika ekranu.',
  'composer.media.altText.missing': 'Brak tekstu alternatywnego.',
  'composer.media.altText.waive': 'Ten obraz nie wymaga tekstu alternatywnego',
  'composer.media.altText.generate': 'Napisz tekst alternatywny',
  'composer.media.crop': 'Przytnij',
  'composer.media.resize': 'Zmień rozmiar',
  'composer.media.rotate': 'Obróć',
  'composer.media.compress': 'Kompresuj',
  'composer.media.convertFormat': 'Konwertuj format',
  'composer.media.thumbnail': 'Miniatura',
  'composer.media.aspectPreset': 'Wstępne ustawienia platformy',
  'composer.media.original': 'Oryginał',
  'composer.media.originalPreserved':
    'Oryginalny plik zostanie zachowany. Zmiany tworzą nową wersję.',
  'composer.media.uploading': 'Przesyłanie {name}',
  'composer.media.processing': 'Przygotowywanie {name}',
  'composer.media.rights.label': 'Prawa i zgoda',
  'composer.media.rights.confirm':
    'Mam prawa do publikacji tych multimediów, w tym wszelkich znajdujących się w nich osób, muzyki, logo i marek.',

  'composer.sequence.title': 'Komentarze i wątek',
  'composer.sequence.root': 'Główny post',
  'composer.sequence.item': 'Pozycja {position}',
  'composer.sequence.add': 'Dodaj komentarz lub element wątku',
  'composer.sequence.delayLabel': 'Opóźnienie po poprzednim elemencie',
  'composer.sequence.delayImmediate': 'Natychmiast',
  'composer.sequence.delayMinutes':
    '{count, plural, one {# minuta} other {# minuty} few {# minuty} many {# minuty}}',
  'composer.sequence.delayCustom': 'Niestandardowe opóźnienie',
  'composer.sequence.accountLabel': 'Opublikuj ten element jako',
  'composer.sequence.unsupported':
    'To konto nie obsługuje zaplanowanych elementów uzupełniających.',

  'composer.repeat.title': 'Powtórz',
  'composer.repeat.off': 'Nie powtarzaj',
  'composer.repeat.everyDays':
    '{count, plural, one {Każdego dnia} other {Co # dni} few {Co # dni} many {Co # dni}}',
  'composer.repeat.endLabel': 'Przestań powtarzać',
  'composer.repeat.endOnDate': 'Na randce',
  'composer.repeat.endAfterCount': 'Po kilku postach',
  'composer.repeat.endRequired': 'Wybierz datę zakończenia lub liczbę powtórzeń.',
  'composer.repeat.summary':
    'Powtarza {cadence} do {end}. Każde wystąpienie otrzymuje własną akceptację i potwierdzenie.',

  'composer.links.title': 'Linki',
  'composer.links.keepOriginal': 'Zachowaj oryginalny adres URL',
  'composer.links.track': 'Zastąp śledzonym krótkim linkiem',
  'composer.links.utm': 'Parametry UTM',
  'composer.links.domain': 'Połącz domenę',
  'composer.links.finalUrl': 'To zostanie opublikowane jako {url}',
  'composer.links.frozenAtApproval':
    'Dokładny krótki adres URL i miejsce docelowe zostały zamrożone w zatwierdzonej wersji.',

  'composer.signature.title': 'Podpis',
  'composer.signature.none': 'Brak podpisu',
  'composer.signature.autoApplied':
    'Podpis {name} zostało dodane automatycznie. Możesz to zmienić.',

  'composer.set.title': 'Zestawy',
  'composer.set.startFrom': 'Zacznij od zestawu',
  'composer.set.continueWithout': 'Kontynuuj bez zestawu',
  'composer.set.applied':
    'Zastosowany zestaw {name}. Ta wersja robocza jest teraz niezależna od Zestawu.',

  'composer.validation.title': 'Weryfikacja',
  'composer.validation.clean': 'Nie znaleziono problemów dla wybranych celów.',
  'composer.validation.issueCount':
    '{count, plural, one {# problem} other {# problemy} few {# problemy} many {# problemy}} przez {targets, plural, one {# cel} other {# cele} few {# cele} many {# cele}}',
  'composer.validation.blocking': 'Należy to naprawić przed ustaleniem harmonogramu.',
  'composer.validation.warning': 'Sprawdź to przed publikacją.',
  'composer.validation.revalidated':
    'Ponownie sprawdzono pod kątem bieżących limitów platformy {relativeTime}.',

  'composer.preview.title': 'Podgląd',
  'composer.preview.forAccount': 'Podgląd dla {account} na {provider}',
  'composer.preview.approximate':
    'W tym podglądzie zastosowano zarejestrowane przez nas reguły platformy. Opublikowany post może się różnić w przypadku zmiany platformy.',
  'composer.preview.unavailable': 'Prawdziwy podgląd nie jest jeszcze dostępny dla tego konta.',

  'composer.cost.title': 'Szacowany koszt dostawcy',
  'composer.cost.estimate': '{provider} szacunki {amount} wykorzystania API w tym poście.',
  'composer.cost.linkSurcharge':
    '{provider} pobiera więcej opłat za posty zawierające adres URL. Usunięcie linku obniża oszacowanie.',
  'composer.cost.bulkWarning':
    '{count, plural, one {# publikacja} other {# publikacje} few {# publikacje} many {# publikacje}} w jednej akcji. Zanim przejdziesz dalej, przejrzyj szacunkową kwotę.',
  'composer.cost.reconciled': 'Rzeczywiste wykorzystanie jest uzgadniane po opublikowaniu.',
  'composer.cost.none': 'W przypadku tego wpisu nie ma naliczanych kosztów dostawcy.',

  'composer.autosave.saving': 'Zapisywanie',
  'composer.autosave.saved': 'Zapisano {relativeTime}',
  'composer.autosave.offline':
    'Offline. Twoja wersja robocza jest przechowywana na tym urządzeniu i będzie synchronizowana.',
  'composer.autosave.conflict':
    '{name} edytował tę wersję roboczą, gdy pisałeś. Przejrzyj obie wersje przed zapisaniem.',
  'composer.autosave.failed': 'Nie można zapisać. Twój tekst nadal tu jest. Ponawiam próbę.',

  'composer.ai.title': 'Pomoc',
  'composer.ai.makeConcise': 'Spisz bardziej zwięźle',
  'composer.ai.adaptForPlatform': 'Dostosuj do {provider}',
  'composer.ai.transcreate': 'Przekształć do {language}',
  'composer.ai.checkClaims': 'Sprawdź roszczenia',
  'composer.ai.writeAltText': 'Napisz tekst alternatywny',
  'composer.ai.suggestHooks': 'Zaproponuj haki',
  'composer.ai.suggestCta': 'Zaproponuj wezwanie do działania',
  'composer.ai.diffTitle': 'Proponowana zmiana',
  'composer.ai.diffHelp': 'Nic się nie zmieni, dopóki tego nie zaakceptujesz.',
  'composer.ai.working': 'Pracuję nad tym',
  'composer.ai.sources':
    'Na podstawie {count, plural, one {# źródło} other {# źródła} few {# źródła} many {# źródła}} zatwierdziłeś',
  'composer.ai.uncertain':
    'To wyrażenie nie ma czystego odpowiednika w {language}. Przed publikacją przejrzyj go z native speakerem.',

  'composer.schedule.title': 'Harmonogram',
  'composer.schedule.dateLabel': 'Data',
  'composer.schedule.timeLabel': 'Czas',
  'composer.schedule.timeZoneLabel': 'Strefa czasowa',
  'composer.schedule.nextFreeSlot': 'Następny wolny slot',
  'composer.schedule.localAndUtc': '{local} w {timeZone}. {utc} UTC.',
  'composer.schedule.dstWarning':
    'Zegary zmieniają się w {timeZone} tego dnia. Ten post jest wyświetlany pod adresem {local}, czyli {utc} UTC.',
  'composer.schedule.pastWarning': 'Ten czas minął. Wybierz późniejszy termin.',
  'composer.schedule.confirmTitle': 'Potwierdź przed planowaniem',
  'composer.schedule.confirmPublishNow': 'Potwierdź przed publikacją teraz',
  'composer.schedule.approverLabel': 'Zatwierdzający',
  'composer.schedule.policyLabel': 'Polityka zatwierdzania',
  'composer.schedule.duplicateWarning':
    'Podobna treść została opublikowana w {account} {relativeTime}. Ponowne opublikowanie może naruszyć zasady platformy dotyczące zduplikowanych treści.',
  'composer.schedule.cadenceWarning':
    '{account} ma już {count, plural, one {# post} other {# posty} few {# posty} many {# posty}} zaplanowano na ten dzień.',
} as const;
