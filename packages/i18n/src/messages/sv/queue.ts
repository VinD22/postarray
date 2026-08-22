/**
 * Queue rules and slot reservations.
 *
 * The reason keys are the ones the slot finder emits. They are the sentences a
 * person reads before they accept a proposed time, and the sentences an audit
 * reads back years later, so they say what actually happened rather than
 * congratulating anyone.
 */
export const queueMessages = {
  'queue.title': 'Publiceringskö',
  'queue.subtitle':
    'När detta varumärke får publicera, och med hur stort mellanrum. Inget publiceras utan att en person accepterar tidpunkten.',

  'queue.rules.heading': 'Köregler',
  'queue.rules.empty':
    'Inga köregler än. Tills du lägger till en är nästa lucka helt enkelt den första lediga timmen.',
  'queue.rules.create': 'Ny köregel',
  'queue.rules.count': '{count, plural, =0 {Inga regler} one {# regel} other {# regler}}',
  'queue.rules.enabled': 'Används',
  'queue.rules.disabled': 'Pausad',
  'queue.rules.archived': 'Arkiverad',
  'queue.rules.edit': 'Redigera regel',
  'queue.rules.archive': 'Arkivera regel',
  'queue.rules.archiveHelp':
    'Arkivering stoppar framtida förslag. Redan reserverade luckor behåller sin tid och sin anledning.',

  'queue.field.name': 'Regelnamn',
  'queue.field.nameHelp': 'Ett namn du känner igen senare, till exempel Vardagsmorgnar.',
  'queue.field.timeZone': 'Tidszon',
  'queue.field.timeZoneHelp':
    'Fönster, det dagliga antalet och blackout-datum läses alla i denna zon.',
  'queue.field.minimumGap': 'Minsta mellanrum',
  'queue.field.minimumGapHelp': 'Minuter mellan två inlägg. Noll betyder ingen avståndsregel.',
  'queue.field.maximumPerDay': 'Max per dag',
  'queue.field.maximumPerDayHelp':
    'Lämna tomt för ingen daglig gräns. Noll betyder att denna regel inte föreslår något.',
  'queue.field.maximumPerDayUnlimited': 'Ingen daglig gräns',
  'queue.field.priority': 'Prioritet',
  'queue.field.priorityHelp': 'Regeln med högst prioritet som kan erbjuda en lucka används.',
  'queue.field.enabled': 'Använd denna regel',

  'queue.windows.heading': 'Veckofönster',
  'queue.windows.help':
    'Välj de lokala timmar då detta varumärke får publicera. Använd dag- och tidsfälten, eller knapparna i rutnätet.',
  'queue.windows.empty': 'Inga fönster än. En regel utan fönster kan aldrig erbjuda en lucka.',
  'queue.windows.add': 'Lägg till fönster',
  'queue.windows.remove': 'Ta bort fönster',
  'queue.windows.entry': '{weekday}, {start} till {end}',
  'queue.windows.start': 'Från',
  'queue.windows.end': 'Till',
  'queue.windows.weekday': 'Dag',
  'queue.windows.toggleCell': '{weekday} klockan {hour}',
  'queue.windows.gridLabel': 'Veckovis tillgänglighet, en knapp per dag och timme',

  'queue.weekday.1': 'Måndag',
  'queue.weekday.2': 'Tisdag',
  'queue.weekday.3': 'Onsdag',
  'queue.weekday.4': 'Torsdag',
  'queue.weekday.5': 'Fredag',
  'queue.weekday.6': 'Lördag',
  'queue.weekday.7': 'Söndag',

  'queue.blackouts.heading': 'Blackout-datum',
  'queue.blackouts.help': 'Datum då detta varumärke inte publicerar, lästa i regelns tidszon.',
  'queue.blackouts.empty': 'Inga blackout-datum.',
  'queue.blackouts.add': 'Lägg till blackout',
  'queue.blackouts.remove': 'Ta bort blackout',
  'queue.blackouts.from': 'Första dagen',
  'queue.blackouts.to': 'Sista dagen',
  'queue.blackouts.entry': '{from} till {to}',

  'queue.connections.heading': 'Konton',
  'queue.connections.all': 'Alla konton i detta varumärke',
  'queue.connections.scoped':
    '{count, plural, one {# konto} other {# konton}} som denna regel gäller för',

  'queue.slot.heading': 'Nästa köplats',
  'queue.slot.action': 'Använd nästa köplats',
  'queue.slot.proposed': '{local} i {timeZone}',
  'queue.slot.utc': 'Det är {utc} i UTC.',
  'queue.slot.why': 'Varför denna tid',
  'queue.slot.accept': 'Använd denna tid',
  'queue.slot.release': 'Välj en annan tid',
  'queue.slot.expires': 'Detta förslag hålls till {expires}.',
  'queue.slot.unavailable': 'En köplats är inte tillgänglig just nu.',
  'queue.slot.pending': 'Söker nästa plats.',
  'queue.slot.accepted': 'Schemalagd för {local} i {timeZone}.',
  'queue.slot.notAutomatic': 'Inget schemaläggs förrän du väljer denna tid.',

  'queue.reason.noRulesConfigured':
    'Detta varumärke har inga köregler konfigurerade, så inget fönster tillämpades.',
  'queue.reason.fallbackFirstFreeHour':
    'Den första lediga timmen från och med nu användes istället.',
  'queue.reason.matchedRule': 'Regeln {name} valde denna tid, i {zone}.',
  'queue.reason.matchedWindow': 'Den faller inom fönstret {start} till {end} i {zone}.',
  'queue.reason.minimumGap': 'Den ligger minst {minutes} minuter från varje annat inlägg.',
  'queue.reason.noMinimumGap': 'Denna regel anger inget minsta mellanrum mellan inlägg.',
  'queue.reason.dailyCap': 'Den dagen rymmer högst {limit} inlägg, och är inte full.',
  'queue.reason.dailyCapUnlimited': 'Denna regel anger ingen daglig gräns.',
  'queue.reason.blackoutSkipped':
    '{days, plural, one {# blackout-dag hoppades} other {# blackout-dagar hoppades}} över för att nå den.',
  'queue.reason.dstNonexistentSkipped':
    'Den första tiden i fönstret finns inte det datumet i {zone}, så nästa som finns användes istället.',
  'queue.reason.dstAmbiguousFirst':
    'Den lokala tiden inträffar två gånger i {zone} det datumet. Den första förekomsten användes.',
  'queue.reason.priorityChosen':
    'Denna regel har prioritet {priority}, den högsta som kunde erbjuda.',
  'queue.reason.connectionScoped':
    'Denna regel omfattar {count, plural, one {# konto} other {# konton}}.',
  'queue.reason.horizonExhausted': 'Inget fönster var ledigt inom {days} dagar.',
} as const;
