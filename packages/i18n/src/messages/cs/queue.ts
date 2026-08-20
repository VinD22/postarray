/**
 * Queue rules and slot reservations.
 *
 * The reason keys are the ones the slot finder emits. They are the sentences a
 * person reads before they accept a proposed time, and the sentences an audit
 * reads back years later, so they say what actually happened rather than
 * congratulating anyone.
 */
export const queueMessages = {
  'queue.title': 'Fronta publikování',
  'queue.subtitle':
    'Kdy je tato značka ochotná publikovat a s jakým odstupem. Nic se nepublikuje, dokud to v daném čase někdo neschválí.',

  'queue.rules.heading': 'Pravidla fronty',
  'queue.rules.empty':
    'Zatím žádná pravidla fronty. Dokud žádné nepřidáte, dalším termínem je jednoduše první volná hodina.',
  'queue.rules.create': 'Nové pravidlo fronty',
  'queue.rules.count':
    '{count, plural, =0 {Žádná pravidla} one {# pravidlo} few {# pravidla} many {# pravidla} other {# pravidel}}',
  'queue.rules.enabled': 'Používá se',
  'queue.rules.disabled': 'Pozastaveno',
  'queue.rules.archived': 'Archivováno',
  'queue.rules.edit': 'Upravit pravidlo',
  'queue.rules.archive': 'Archivovat pravidlo',
  'queue.rules.archiveHelp':
    'Archivace zastaví budoucí návrhy. Již rezervované termíny si zachovají svůj čas i důvod.',

  'queue.field.name': 'Název pravidla',
  'queue.field.nameHelp': 'Název, který později poznáte, například Ranní všední dny.',
  'queue.field.timeZone': 'Časové pásmo',
  'queue.field.timeZoneHelp': 'Okna, denní počet a data blackoutu se čtou v tomto pásmu.',
  'queue.field.minimumGap': 'Minimální rozestup',
  'queue.field.minimumGapHelp': 'Minuty mezi dvěma příspěvky. Nula znamená žádné pravidlo rozestupu.',
  'queue.field.maximumPerDay': 'Maximum za den',
  'queue.field.maximumPerDayHelp':
    'Ponechte prázdné pro žádný denní limit. Nula znamená, že toto pravidlo nic nenavrhuje.',
  'queue.field.maximumPerDayUnlimited': 'Žádný denní limit',
  'queue.field.priority': 'Priorita',
  'queue.field.priorityHelp': 'Použije se pravidlo s nejvyšší prioritou, které může nabídnout termín.',
  'queue.field.enabled': 'Použít toto pravidlo',

  'queue.windows.heading': 'Týdenní okna',
  'queue.windows.help':
    'Vyberte místní hodiny, ve kterých tato značka smí publikovat. Použijte pole dne a času, nebo tlačítka v mřížce.',
  'queue.windows.empty': 'Zatím žádná okna. Pravidlo bez okna nikdy nemůže nabídnout termín.',
  'queue.windows.add': 'Přidat okno',
  'queue.windows.remove': 'Odebrat okno',
  'queue.windows.entry': '{weekday}, od {start} do {end}',
  'queue.windows.start': 'Od',
  'queue.windows.end': 'Do',
  'queue.windows.weekday': 'Den',
  'queue.windows.toggleCell': '{weekday} v {hour}',
  'queue.windows.gridLabel': 'Týdenní dostupnost, jedno tlačítko na den a hodinu',

  'queue.weekday.1': 'Pondělí',
  'queue.weekday.2': 'Úterý',
  'queue.weekday.3': 'Středa',
  'queue.weekday.4': 'Čtvrtek',
  'queue.weekday.5': 'Pátek',
  'queue.weekday.6': 'Sobota',
  'queue.weekday.7': 'Neděle',

  'queue.blackouts.heading': 'Data blackoutu',
  'queue.blackouts.help': 'Data, kdy tato značka nebude publikovat, čtená v časovém pásmu pravidla.',
  'queue.blackouts.empty': 'Žádná data blackoutu.',
  'queue.blackouts.add': 'Přidat blackout',
  'queue.blackouts.remove': 'Odebrat blackout',
  'queue.blackouts.from': 'První den',
  'queue.blackouts.to': 'Poslední den',
  'queue.blackouts.entry': 'Od {from} do {to}',

  'queue.connections.heading': 'Účty',
  'queue.connections.all': 'Každý účet v této značce',
  'queue.connections.scoped':
    '{count, plural, one {# účet} few {# účty} many {# účtu} other {# účtů}}, na které se toto pravidlo vztahuje',

  'queue.slot.heading': 'Další termín ve frontě',
  'queue.slot.action': 'Použít další termín ve frontě',
  'queue.slot.proposed': '{local} v pásmu {timeZone}',
  'queue.slot.utc': 'To je {utc} v UTC.',
  'queue.slot.why': 'Proč tento čas',
  'queue.slot.accept': 'Použít tento čas',
  'queue.slot.release': 'Vybrat jiný čas',
  'queue.slot.expires': 'Tento návrh platí do {expires}.',
  'queue.slot.unavailable': 'Termín ve frontě je nyní nedostupný.',
  'queue.slot.pending': 'Hledá se další termín.',
  'queue.slot.accepted': 'Naplánováno na {local} v pásmu {timeZone}.',
  'queue.slot.notAutomatic': 'Nic není naplánováno, dokud tento čas nevyberete.',

  'queue.reason.noRulesConfigured':
    'Tato značka nemá nastavená žádná pravidla fronty, takže nebylo použito žádné okno.',
  'queue.reason.fallbackFirstFreeHour': 'Místo toho byla použita první volná hodina od teď.',
  'queue.reason.matchedRule': 'Pravidlo {name} vybralo tento čas, v pásmu {zone}.',
  'queue.reason.matchedWindow': 'Spadá do okna od {start} do {end} v pásmu {zone}.',
  'queue.reason.minimumGap': 'Je vzdálen alespoň {minutes} minut od každého jiného příspěvku.',
  'queue.reason.noMinimumGap': 'Toto pravidlo nenastavuje minimální rozestup mezi příspěvky.',
  'queue.reason.dailyCap': 'Ten den obsahuje nejvýše {limit} příspěvků a není plný.',
  'queue.reason.dailyCapUnlimited': 'Toto pravidlo nenastavuje denní limit.',
  'queue.reason.blackoutSkipped':
    '{days, plural, one {Byl přeskočen # den blackoutu} few {Byly přeskočeny # dny blackoutu} many {Bylo přeskočeno # dne blackoutu} other {Bylo přeskočeno # dní blackoutu}}, aby ho bylo dosaženo.',
  'queue.reason.dstNonexistentSkipped':
    'První čas v okně v tomto datu v pásmu {zone} neexistuje, proto byl použit nejbližší další, který existuje.',
  'queue.reason.dstAmbiguousFirst':
    'Tento místní čas nastává v pásmu {zone} v daném datu dvakrát. Byl použit první výskyt.',
  'queue.reason.priorityChosen': 'Toto pravidlo má prioritu {priority}, nejvyšší, jakou mohlo nabídnout.',
  'queue.reason.connectionScoped':
    'Toto pravidlo pokrývá {count, plural, one {# účet} few {# účty} many {# účtu} other {# účtů}}.',
  'queue.reason.horizonExhausted': 'Do {days} dní nebylo žádné okno volné.',
} as const;
