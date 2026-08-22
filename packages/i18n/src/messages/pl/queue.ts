/**
 * Queue rules and slot reservations.
 *
 * The reason keys are the ones the slot finder emits. They are the sentences a
 * person reads before they accept a proposed time, and the sentences an audit
 * reads back years later, so they say what actually happened rather than
 * congratulating anyone.
 */
export const queueMessages = {
  'queue.title': 'Kolejka publikacji',
  'queue.subtitle':
    'Kiedy ten projekt może publikować i w jakich odstępach. Nic nie zostaje opublikowane, dopóki ktoś nie zaakceptuje godziny.',

  'queue.rules.heading': 'Reguły kolejki',
  'queue.rules.empty':
    'Brak jeszcze reguł kolejki. Dopóki nie dodasz żadnej, następny termin to po prostu pierwsza wolna godzina.',
  'queue.rules.create': 'Nowa reguła kolejki',
  'queue.rules.count':
    '{count, plural, =0 {Brak reguł} one {# reguła} few {# reguły} many {# reguł} other {# reguły}}',
  'queue.rules.enabled': 'W użyciu',
  'queue.rules.disabled': 'Wstrzymana',
  'queue.rules.archived': 'Zarchiwizowana',
  'queue.rules.edit': 'Edytuj regułę',
  'queue.rules.archive': 'Archiwizuj regułę',
  'queue.rules.archiveHelp':
    'Archiwizacja zatrzymuje przyszłe propozycje. Już zarezerwowane terminy zachowują swój czas i powód.',

  'queue.field.name': 'Nazwa reguły',
  'queue.field.nameHelp': 'Nazwa, którą rozpoznasz później, na przykład Poranki w dni robocze.',
  'queue.field.timeZone': 'Strefa czasowa',
  'queue.field.timeZoneHelp': 'Okna, dzienny limit i daty wykluczeń są odczytywane w tej strefie.',
  'queue.field.minimumGap': 'Minimalny odstęp',
  'queue.field.minimumGapHelp': 'Minuty między dwoma postami. Zero oznacza brak reguły odstępu.',
  'queue.field.maximumPerDay': 'Maksimum dziennie',
  'queue.field.maximumPerDayHelp':
    'Pozostaw puste, aby nie ustawiać dziennego limitu. Zero oznacza, że ta reguła niczego nie proponuje.',
  'queue.field.maximumPerDayUnlimited': 'Brak dziennego limitu',
  'queue.field.priority': 'Priorytet',
  'queue.field.priorityHelp':
    'Używana jest reguła o najwyższym priorytecie, która może zaproponować termin.',
  'queue.field.enabled': 'Użyj tej reguły',

  'queue.windows.heading': 'Okna tygodniowe',
  'queue.windows.help':
    'Wybierz lokalne godziny, w których ten projekt może publikować. Użyj pól dnia i godziny albo przycisków na siatce.',
  'queue.windows.empty': 'Brak jeszcze okien. Reguła bez okna nigdy nie może zaproponować terminu.',
  'queue.windows.add': 'Dodaj okno',
  'queue.windows.remove': 'Usuń okno',
  'queue.windows.entry': '{weekday}, od {start} do {end}',
  'queue.windows.start': 'Od',
  'queue.windows.end': 'Do',
  'queue.windows.weekday': 'Dzień',
  'queue.windows.toggleCell': '{weekday} o {hour}',
  'queue.windows.gridLabel': 'Dostępność tygodniowa, jeden przycisk na dzień i godzinę',

  'queue.weekday.1': 'Poniedziałek',
  'queue.weekday.2': 'Wtorek',
  'queue.weekday.3': 'Środa',
  'queue.weekday.4': 'Czwartek',
  'queue.weekday.5': 'Piątek',
  'queue.weekday.6': 'Sobota',
  'queue.weekday.7': 'Niedziela',

  'queue.blackouts.heading': 'Daty wykluczeń',
  'queue.blackouts.help':
    'Daty, w które ten projekt nie będzie publikować, odczytywane w strefie czasowej reguły.',
  'queue.blackouts.empty': 'Brak dat wykluczeń.',
  'queue.blackouts.add': 'Dodaj wykluczenie',
  'queue.blackouts.remove': 'Usuń wykluczenie',
  'queue.blackouts.from': 'Pierwszy dzień',
  'queue.blackouts.to': 'Ostatni dzień',
  'queue.blackouts.entry': 'Od {from} do {to}',

  'queue.connections.heading': 'Konta',
  'queue.connections.all': 'Każde konto w tej marce',
  'queue.connections.scoped':
    '{count, plural, one {# konto} few {# konta} many {# kont} other {# konta}}, do których stosuje się ta reguła',

  'queue.slot.heading': 'Następny termin w kolejce',
  'queue.slot.action': 'Użyj następnego terminu w kolejce',
  'queue.slot.proposed': '{local} w strefie {timeZone}',
  'queue.slot.utc': 'To jest {utc} w UTC.',
  'queue.slot.why': 'Dlaczego ten termin',
  'queue.slot.accept': 'Użyj tego terminu',
  'queue.slot.release': 'Wybierz inny termin',
  'queue.slot.expires': 'Ta propozycja jest ważna do {expires}.',
  'queue.slot.unavailable': 'Termin w kolejce jest teraz niedostępny.',
  'queue.slot.pending': 'Trwa szukanie następnego terminu.',
  'queue.slot.accepted': 'Zaplanowano na {local} w strefie {timeZone}.',
  'queue.slot.notAutomatic': 'Nic nie zostanie zaplanowane, dopóki nie wybierzesz tego terminu.',

  'queue.reason.noRulesConfigured':
    'Ten projekt nie ma skonfigurowanych reguł kolejki, więc nie zastosowano żadnego okna.',
  'queue.reason.fallbackFirstFreeHour': 'Zamiast tego użyto pierwszej wolnej godziny od teraz.',
  'queue.reason.matchedRule': 'Reguła {name} wybrała ten termin, w strefie {zone}.',
  'queue.reason.matchedWindow': 'Mieści się w oknie od {start} do {end} w strefie {zone}.',
  'queue.reason.minimumGap': 'Dzieli go co najmniej {minutes} minut od każdego innego postu.',
  'queue.reason.noMinimumGap': 'Ta reguła nie ustawia minimalnego odstępu między postami.',
  'queue.reason.dailyCap': 'Ten dzień zawiera co najwyżej {limit} postów i nie jest pełny.',
  'queue.reason.dailyCapUnlimited': 'Ta reguła nie ustawia dziennego limitu.',
  'queue.reason.blackoutSkipped':
    '{days, plural, one {Pominięto # dzień wykluczenia} few {Pominięto # dni wykluczenia} many {Pominięto # dni wykluczenia} other {Pominięto # dni wykluczenia}}, aby go osiągnąć.',
  'queue.reason.dstNonexistentSkipped':
    'Pierwsza godzina w oknie nie istnieje tego dnia w strefie {zone}, więc użyto najbliższej kolejnej, która istnieje.',
  'queue.reason.dstAmbiguousFirst':
    'Ta lokalna godzina występuje tego dnia dwukrotnie w strefie {zone}. Użyto pierwszego wystąpienia.',
  'queue.reason.priorityChosen':
    'Ta reguła ma priorytet {priority}, najwyższy, jaki mógł zaoferować.',
  'queue.reason.connectionScoped':
    'Ta reguła obejmuje {count, plural, one {# konto} few {# konta} many {# kont} other {# konta}}.',
  'queue.reason.horizonExhausted': 'W ciągu {days} dni nie było wolnego okna.',
} as const;
