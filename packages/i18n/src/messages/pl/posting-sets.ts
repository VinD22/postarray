/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 *
 * Three features that all answer "who is this going to, and when", grouped in
 * one namespace so their vocabulary stays consistent. The hold copy is the part
 * most worth reading twice: pausing stops work that has not happened, and every
 * sentence here has to say that plainly rather than implying a post can be
 * pulled back off a platform.
 */
export const postingSetMessages = {
  /* ------------------------------------------------------------- the hold */
  'calendar.hold.action': 'Wstrzymaj',
  'calendar.hold.resumeAction': 'Wznów',
  'calendar.hold.badge': 'Wstrzymane',
  'calendar.hold.badgeBilling': 'Wstrzymane z powodu rozliczeń',
  'calendar.hold.term': 'Wstrzymanie',
  'calendar.hold.byPerson': 'Wstrzymane przez Ciebie {date}.',
  'calendar.hold.byBilling': 'Wstrzymane {date}, ponieważ ten obszar roboczy stracił pełny dostęp.',
  'calendar.hold.none': 'Niewstrzymane',

  'calendar.hold.confirmTitle': 'Wstrzymać ten post?',
  'calendar.hold.confirmBody':
    'Ten post pozostanie tam, gdzie jest, i nie zostanie opublikowany o {time}. Możesz go wznowić w dowolnym momencie przed tym czasem albo wybrać nowy termin, jeśli ten już minął.',
  'calendar.hold.confirmScope':
    'Wstrzymanie zatrzymuje to, co jeszcze się nie wydarzyło. Wszystko, co zostało już opublikowane na platformie, pozostaje opublikowane, a wstrzymanie tego nie usuwa ani nie edytuje.',
  'calendar.hold.confirmNoteLabel': 'Dlaczego wstrzymujesz ten post? (opcjonalnie)',
  'calendar.hold.confirmNoteHint':
    'Zapisywane w dzienniku audytu dla Twojego zespołu. Nie jest wysyłane na żadną platformę.',
  'calendar.hold.confirm': 'Wstrzymaj ten post',
  'calendar.hold.cancel': 'Zostaw zaplanowany',

  'calendar.hold.resumeTitle': 'Wznowić ten post?',
  'calendar.hold.resumeBody': 'Zostanie opublikowany o {time}, w strefie {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'Ten termin już minął',
  'calendar.hold.resumeMissedBody':
    'Ten post miał zostać opublikowany o {time}, gdy był wstrzymany. Wybierz nowy termin, aby nie został opublikowany w chwili wznowienia.',
  'calendar.hold.resumeTimeLabel': 'Nowy termin publikacji',
  'calendar.hold.resumeConfirm': 'Wznów',

  'calendar.hold.paused': 'Wstrzymane. Nie zostanie opublikowane, dopóki go nie wznowisz.',
  'calendar.hold.resumed': 'Wznowione. Zostanie opublikowane o {time}.',

  'calendar.hold.blocked.published':
    'Ten post został już opublikowany. Wstrzymanie nie może go wycofać z platformy.',
  'calendar.hold.blocked.inFlight':
    'Ten post jest właśnie wysyłany. Jest za późno, aby go wstrzymać, a zatrzymanie w połowie mogłoby zostawić go opublikowanym tylko częściowo.',
  'calendar.hold.blocked.finished': 'Ten post jest już zakończony, więc nie ma czego wstrzymywać.',
  'calendar.hold.blocked.billing':
    'Ten post jest wstrzymany, ponieważ ten obszar roboczy stracił pełny dostęp. Wznowienie go to kwestia rozliczeń, a nie harmonogramu.',
  'calendar.hold.blocked.billingAction': 'Przejdź do rozliczeń',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Zestawy publikacji',
  'set.lede':
    'Zapisana odpowiedź na pytanie „do kogo to publikuję i jak”. Zastosowanie Zestawu kopiuje jego ustawienia do nowego szkicu.',
  'set.appliedOnce':
    'Zestaw jest odczytywany tylko raz, w momencie jego zastosowania. Edycja go później zmienia to, od czego zaczyna się kolejny post. Szkice i zaplanowane posty, które już z niego utworzyłeś, pozostają dokładnie takie, jakie są.',
  'set.empty.title': 'Brak jeszcze Zestawów',
  'set.empty.body': 'Utwórz jeden, aby przestać odbudowywać tę samą listę kont dla każdego postu.',
  'set.create': 'Nowy Zestaw',
  'set.edit': 'Edytuj Zestaw',
  'set.archive': 'Archiwizuj Zestaw',
  'set.archived': 'Zarchiwizowany',
  'set.archivedNote':
    'Zarchiwizowane Zestawy są ukryte w selektorze. Posty z nich utworzone pozostają bez zmian.',
  'set.showArchived': 'Pokaż zarchiwizowane',
  'set.saved': 'Zestaw zapisany.',
  'set.archivedToast': 'Zestaw zarchiwizowany. Posty już z niego utworzone pozostają bez zmian.',

  'set.field.name': 'Nazwa',
  'set.field.nameHint': 'To, czego będziesz szukać później w selektorze. Jedna na markę.',
  'set.field.description': 'Opis',
  'set.field.descriptionHint': 'Opcjonalnie. Do czego służy ten Zestaw.',
  'set.field.targets': 'Konta',
  'set.field.targetsHint': 'Każde konto, od którego zaczyna się post utworzony z tego Zestawu.',
  'set.field.targetCount':
    '{count, plural, =0 {Brak kont} one {# konto} few {# konta} many {# kont} other {# konta}}',
  'set.field.signature': 'Podpis',
  'set.field.signatureNone': 'Brak podpisu',
  'set.field.approval': 'Zatwierdzenie',
  'set.field.approvalHint':
    'Zatwierdzenie, którego potrzebuje post utworzony z tego Zestawu, zanim będzie mógł zostać opublikowany.',
  'set.field.schedule': 'Kiedy publikować',

  'set.approval.none': 'Zatwierdzenie niepotrzebne',
  'set.approval.single_approver': 'Jeden wyznaczony zatwierdzający',
  'set.approval.any_approver': 'Dowolny zatwierdzający',
  'set.approval.named_approver': 'Konkretny zatwierdzający',
  'set.approval.policy_auto': 'To, co mówi zasada obszaru roboczego',

  'set.slot.next_free_slot': 'Następny wolny termin z kolejki',
  'set.slot.next_free_slotHint':
    'Wykorzystuje reguły kolejki tej marki do zaproponowania terminu. Proponuje; Ty akceptujesz.',
  'set.slot.pick_time': 'Zapytaj mnie o termin',
  'set.slot.pick_timeHint': 'Zastosowanie Zestawu pozostawia termin pusty, abyś go wybrał.',
  'set.slot.draft_only': 'Zostaw jako szkic',
  'set.slot.draft_onlyHint': 'Zastosowanie Zestawu w ogóle nie dotyka harmonogramu.',
  'set.slot.noRules':
    'Ta marka nie ma jeszcze reguł kolejki, więc kolejka zaproponuje pierwszą wolną godzinę i to powie.',
  'set.slot.rulesLink': 'Reguły kolejki',

  'set.defaults.title': 'Wartości domyślne dla platformy',
  'set.defaults.body':
    'Wartości początkowe kopiowane do każdego nowego postu. Możesz je później dowolnie zmienić w kompozytorze.',
  'set.defaults.add': 'Dodaj platformę',
  'set.defaults.remove': 'Usuń wartości domyślne dla {platform}',
  'set.defaults.privacy': 'Prywatność',
  'set.defaults.privacyNone': 'Domyślne dla platformy',
  'set.defaults.bodyPrefix': 'Tekst przed postem',
  'set.defaults.bodySuffix': 'Tekst po poście',
  'set.defaults.requireAltText': 'Wymagaj tekstu alternatywnego dla każdego obrazu',
  'set.defaults.requireAltTextHint':
    'Post utworzony z tego Zestawu nie może zostać zaplanowany na tej platformie, dopóki każdy obraz nie ma tekstu alternatywnego.',
  'set.defaults.empty':
    'Brak wartości domyślnych dla platform. Każde konto zaczyna od postu głównego.',

  'set.error.nameTaken': 'Inny Zestaw w tej marce już używa tej nazwy.',
  'set.error.archived': 'Ten Zestaw jest zarchiwizowany. Przywróć go przed edycją.',
  'set.error.duplicateTarget': 'To konto jest już w tym Zestawie.',
  'set.error.duplicatePlatform': 'Ten Zestaw ma już wartości domyślne dla tej platformy.',

  /* --------------------------------------------------- remembered targets */
  'targetMemory.setting.title': 'Zapamiętuj konta między postami',
  'targetMemory.setting.body':
    'Gdy ta opcja jest włączona, kompozytor rozpoczyna każdy nowy post od kont, które ta osoba wybrała ostatnim razem w tej marce. Jest wyłączona, dopóki jej nie włączysz.',
  'targetMemory.setting.stored':
    'Przechowywana jest tylko lista kont, i tylko dla osoby, która je wybrała. Nie jest przechowywany żaden podpis, godzina, ustawienie prywatności ani stan zatwierdzenia, a nikt inny w marce nie widzi Twojej listy.',
  'targetMemory.setting.offNote': 'Dopóki ta opcja jest wyłączona, nic nie jest przechowywane.',
  'targetMemory.setting.turnOffWarning':
    'Wyłączenie tego usuwa każdy zapisany wybór w tej marce, dla wszystkich.',
  'targetMemory.setting.enabled': 'Włączone',
  'targetMemory.setting.disabled': 'Wyłączone',
  'targetMemory.setting.saved': 'Ustawienie zapisane.',
  'targetMemory.setting.cleared':
    'Ustawienie zapisane. Zapisane wybory w tej marce zostały usunięte.',

  'targetMemory.composer.restored':
    '{count, plural, one {Rozpoczęto z # kontem z ostatniego razu.} few {Rozpoczęto z # kontami z ostatniego razu.} many {Rozpoczęto z # kontami z ostatniego razu.} other {Rozpoczęto z # konta z ostatniego razu.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {# konto, którego użyłeś ostatnim razem, zostało pominięte, ponieważ wymaga uwagi.} few {# konta, których użyłeś ostatnim razem, zostały pominięte, ponieważ wymagają uwagi.} many {# kont, których użyłeś ostatnim razem, zostało pominiętych, ponieważ wymagają uwagi.} other {# konta, którego użyłeś ostatnim razem, zostało pominięte, ponieważ wymaga uwagi.}}',
  'targetMemory.composer.droppedAll':
    'Żadne z kont, których użyłeś ostatnim razem, nie jest teraz dostępne, więc nic nie zostało wstępnie wybrane.',
  'targetMemory.composer.undo': 'Wyczyść wybór',
  'targetMemory.composer.forget': 'Przestań zapamiętywać moje konta',
  'targetMemory.composer.forgotten': 'Twój zapisany wybór został usunięty.',
  'targetMemory.composer.reviewAccounts': 'Przejrzyj konta',
} as const;
