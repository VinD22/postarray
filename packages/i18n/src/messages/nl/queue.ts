/**
 * Queue rules and slot reservations.
 *
 * The reason keys are the ones the slot finder emits. They are the sentences a
 * person reads before they accept a proposed time, and the sentences an audit
 * reads back years later, so they say what actually happened rather than
 * congratulating anyone.
 */
export const queueMessages = {
  'queue.title': 'Publicatiewachtrij',
  'queue.subtitle':
    'Wanneer dit merk mag publiceren, en met hoeveel tussenruimte. Niets wordt gepubliceerd zonder dat iemand het tijdstip accepteert.',

  'queue.rules.heading': 'Wachtrijregels',
  'queue.rules.empty':
    'Nog geen wachtrijregels. Tot je er een toevoegt, is het volgende tijdstip gewoon het eerste vrije uur.',
  'queue.rules.create': 'Nieuwe wachtrijregel',
  'queue.rules.count': '{count, plural, =0 {Geen regels} one {# regel} other {# regels}}',
  'queue.rules.enabled': 'In gebruik',
  'queue.rules.disabled': 'Gepauzeerd',
  'queue.rules.archived': 'Gearchiveerd',
  'queue.rules.edit': 'Regel bewerken',
  'queue.rules.archive': 'Regel archiveren',
  'queue.rules.archiveHelp':
    'Archiveren stopt toekomstige voorstellen. Al gereserveerde tijdstippen behouden hun tijd en hun reden.',

  'queue.field.name': 'Regelnaam',
  'queue.field.nameHelp': 'Een naam die je later herkent, bijvoorbeeld Doordeweekse ochtenden.',
  'queue.field.timeZone': 'Tijdzone',
  'queue.field.timeZoneHelp':
    'Vensters, het dagelijkse aantal en blackout-data worden allemaal gelezen in deze zone.',
  'queue.field.minimumGap': 'Minimale tussenruimte',
  'queue.field.minimumGapHelp': 'Minuten tussen twee berichten. Nul betekent geen afstandsregel.',
  'queue.field.maximumPerDay': 'Maximum per dag',
  'queue.field.maximumPerDayHelp':
    'Laat leeg voor geen dagelijkse limiet. Nul betekent dat deze regel niets voorstelt.',
  'queue.field.maximumPerDayUnlimited': 'Geen dagelijkse limiet',
  'queue.field.priority': 'Prioriteit',
  'queue.field.priorityHelp':
    'De regel met de hoogste prioriteit die een tijdstip kan aanbieden, wordt gebruikt.',
  'queue.field.enabled': 'Gebruik deze regel',

  'queue.windows.heading': 'Wekelijkse vensters',
  'queue.windows.help':
    'Kies de lokale uren waarin dit merk mag publiceren. Gebruik de dag- en tijdvelden, of de knoppen op het rooster.',
  'queue.windows.empty':
    'Nog geen vensters. Een regel zonder venster kan nooit een tijdstip aanbieden.',
  'queue.windows.add': 'Venster toevoegen',
  'queue.windows.remove': 'Venster verwijderen',
  'queue.windows.entry': '{weekday}, van {start} tot {end}',
  'queue.windows.start': 'Van',
  'queue.windows.end': 'Tot',
  'queue.windows.weekday': 'Dag',
  'queue.windows.toggleCell': '{weekday} om {hour}',
  'queue.windows.gridLabel': 'Wekelijkse beschikbaarheid, een knop per dag en uur',

  'queue.weekday.1': 'Maandag',
  'queue.weekday.2': 'Dinsdag',
  'queue.weekday.3': 'Woensdag',
  'queue.weekday.4': 'Donderdag',
  'queue.weekday.5': 'Vrijdag',
  'queue.weekday.6': 'Zaterdag',
  'queue.weekday.7': 'Zondag',

  'queue.blackouts.heading': 'Blackout-data',
  'queue.blackouts.help':
    'Data waarop dit merk niet zal publiceren, gelezen in de tijdzone van de regel.',
  'queue.blackouts.empty': 'Geen blackout-data.',
  'queue.blackouts.add': 'Blackout toevoegen',
  'queue.blackouts.remove': 'Blackout verwijderen',
  'queue.blackouts.from': 'Eerste dag',
  'queue.blackouts.to': 'Laatste dag',
  'queue.blackouts.entry': '{from} tot {to}',

  'queue.connections.heading': 'Accounts',
  'queue.connections.all': 'Elk account in dit merk',
  'queue.connections.scoped':
    '{count, plural, one {# account} other {# accounts}} waarop deze regel van toepassing is',

  'queue.slot.heading': 'Volgend wachtrijtijdstip',
  'queue.slot.action': 'Gebruik het volgende wachtrijtijdstip',
  'queue.slot.proposed': '{local} in {timeZone}',
  'queue.slot.utc': 'Dat is {utc} in UTC.',
  'queue.slot.why': 'Waarom dit tijdstip',
  'queue.slot.accept': 'Gebruik dit tijdstip',
  'queue.slot.release': 'Kies een ander tijdstip',
  'queue.slot.expires': 'Dit voorstel blijft geldig tot {expires}.',
  'queue.slot.unavailable': 'Er is nu geen wachtrijtijdstip beschikbaar.',
  'queue.slot.pending': 'Het volgende tijdstip wordt gezocht.',
  'queue.slot.accepted': 'Gepland voor {local} in {timeZone}.',
  'queue.slot.notAutomatic': 'Er wordt niets gepland totdat je dit tijdstip kiest.',

  'queue.reason.noRulesConfigured':
    'Dit merk heeft geen wachtrijregels ingesteld, dus is er geen venster toegepast.',
  'queue.reason.fallbackFirstFreeHour':
    'In plaats daarvan is het eerste vrije uur vanaf nu gebruikt.',
  'queue.reason.matchedRule': 'Regel {name} heeft dit tijdstip gekozen, in {zone}.',
  'queue.reason.matchedWindow': 'Het valt binnen het venster van {start} tot {end} in {zone}.',
  'queue.reason.minimumGap': 'Het ligt minstens {minutes} minuten van elk ander bericht.',
  'queue.reason.noMinimumGap': 'Deze regel stelt geen minimale tussenruimte tussen berichten in.',
  'queue.reason.dailyCap': 'Die dag bevat hoogstens {limit} berichten, en is niet vol.',
  'queue.reason.dailyCapUnlimited': 'Deze regel stelt geen dagelijkse limiet in.',
  'queue.reason.blackoutSkipped':
    '{days, plural, one {# blackout-dag werd} other {# blackout-dagen werden}} overgeslagen om dit te bereiken.',
  'queue.reason.dstNonexistentSkipped':
    'De eerste tijd in het venster bestaat niet op die datum in {zone}, dus is de eerstvolgende die wel bestaat gebruikt.',
  'queue.reason.dstAmbiguousFirst':
    'Dat lokale tijdstip komt die datum twee keer voor in {zone}. Het eerste moment is gebruikt.',
  'queue.reason.priorityChosen':
    'Deze regel heeft prioriteit {priority}, de hoogste die kon aanbieden.',
  'queue.reason.connectionScoped':
    'Deze regel geldt voor {count, plural, one {# account} other {# accounts}}.',
  'queue.reason.horizonExhausted': 'Binnen {days} dagen was geen venster vrij.',
} as const;
