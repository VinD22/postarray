export const queueMessages = {
  'queue.title': 'Veröffentlichungswarteschlange',
  'queue.subtitle':
    'Wann dieses Projekt veröffentlichen darf, und in welchem Abstand. Nichts wird veröffentlicht, ohne dass eine Person die Uhrzeit bestätigt.',

  'queue.rules.heading': 'Warteschlangenregeln',
  'queue.rules.empty':
    'Noch keine Warteschlangenregeln. Bis du eine hinzufügst, ist der nächste Slot einfach die erste freie Stunde.',
  'queue.rules.create': 'Neue Warteschlangenregel',
  'queue.rules.count': '{count, plural, =0 {Keine Regeln} one {# Regel} other {# Regeln}}',
  'queue.rules.enabled': 'In Verwendung',
  'queue.rules.disabled': 'Pausiert',
  'queue.rules.archived': 'Archiviert',
  'queue.rules.edit': 'Regel bearbeiten',
  'queue.rules.archive': 'Regel archivieren',
  'queue.rules.archiveHelp':
    'Archivieren stoppt zukünftige Vorschläge. Bereits reservierte Slots behalten ihre Uhrzeit und ihren Grund.',

  'queue.field.name': 'Regelname',
  'queue.field.nameHelp': 'Ein Name, den du später wiedererkennst, zum Beispiel Werktags morgens.',
  'queue.field.timeZone': 'Zeitzone',
  'queue.field.timeZoneHelp':
    'Zeitfenster, die tägliche Zählung und Sperrtermine werden alle in dieser Zone gelesen.',
  'queue.field.minimumGap': 'Mindestabstand',
  'queue.field.minimumGapHelp':
    'Minuten zwischen zwei Beiträgen. Null bedeutet keine Abstandsregel.',
  'queue.field.maximumPerDay': 'Maximum pro Tag',
  'queue.field.maximumPerDayHelp':
    'Leer lassen für kein Tageslimit. Null bedeutet, diese Regel schlägt nichts vor.',
  'queue.field.maximumPerDayUnlimited': 'Kein Tageslimit',
  'queue.field.priority': 'Priorität',
  'queue.field.priorityHelp':
    'Die Regel mit der höchsten Priorität, die einen Slot anbieten kann, wird verwendet.',
  'queue.field.enabled': 'Diese Regel verwenden',

  'queue.windows.heading': 'Wöchentliche Zeitfenster',
  'queue.windows.help':
    'Wähle die lokalen Stunden, in denen dieses Projekt veröffentlichen darf. Nutze die Tages- und Zeitfelder oder die Schaltflächen im Raster.',
  'queue.windows.empty':
    'Noch keine Zeitfenster. Eine Regel ohne Zeitfenster kann nie einen Slot anbieten.',
  'queue.windows.add': 'Zeitfenster hinzufügen',
  'queue.windows.remove': 'Zeitfenster entfernen',
  'queue.windows.entry': '{weekday}, {start} bis {end}',
  'queue.windows.start': 'Von',
  'queue.windows.end': 'Bis',
  'queue.windows.weekday': 'Tag',
  'queue.windows.toggleCell': '{weekday} um {hour}',
  'queue.windows.gridLabel': 'Wöchentliche Verfügbarkeit, eine Schaltfläche pro Tag und Stunde',

  'queue.weekday.1': 'Montag',
  'queue.weekday.2': 'Dienstag',
  'queue.weekday.3': 'Mittwoch',
  'queue.weekday.4': 'Donnerstag',
  'queue.weekday.5': 'Freitag',
  'queue.weekday.6': 'Samstag',
  'queue.weekday.7': 'Sonntag',

  'queue.blackouts.heading': 'Sperrtermine',
  'queue.blackouts.help':
    'Termine, an denen dieses Projekt nicht veröffentlicht, gelesen in der Zeitzone der Regel.',
  'queue.blackouts.empty': 'Keine Sperrtermine.',
  'queue.blackouts.add': 'Sperrtermin hinzufügen',
  'queue.blackouts.remove': 'Sperrtermin entfernen',
  'queue.blackouts.from': 'Erster Tag',
  'queue.blackouts.to': 'Letzter Tag',
  'queue.blackouts.entry': '{from} bis {to}',

  'queue.connections.heading': 'Konten',
  'queue.connections.all': 'Jedes Konto in diesem Projekt',
  'queue.connections.scoped':
    '{count, plural, one {# Konto} other {# Konten}}, für die diese Regel gilt',

  'queue.slot.heading': 'Nächster Warteschlangenslot',
  'queue.slot.action': 'Nächsten Warteschlangenslot verwenden',
  'queue.slot.proposed': '{local} in {timeZone}',
  'queue.slot.utc': 'Das ist {utc} in UTC.',
  'queue.slot.why': 'Warum diese Uhrzeit',
  'queue.slot.accept': 'Diese Uhrzeit verwenden',
  'queue.slot.release': 'Andere Uhrzeit wählen',
  'queue.slot.expires': 'Dieser Vorschlag wird bis {expires} freigehalten.',
  'queue.slot.unavailable': 'Ein Warteschlangenslot ist gerade nicht verfügbar.',
  'queue.slot.pending': 'Nächster Slot wird gesucht.',
  'queue.slot.accepted': 'Geplant für {local} in {timeZone}.',
  'queue.slot.notAutomatic': 'Nichts wird geplant, bis du diese Uhrzeit auswählst.',

  'queue.reason.noRulesConfigured':
    'Für dieses Projekt sind keine Warteschlangenregeln konfiguriert, also wurde kein Zeitfenster angewendet.',
  'queue.reason.fallbackFirstFreeHour': 'Es wurde die erste freie Stunde ab jetzt verwendet.',
  'queue.reason.matchedRule': 'Die Regel {name} hat diese Uhrzeit gewählt, in {zone}.',
  'queue.reason.matchedWindow': 'Sie fällt in das Zeitfenster {start} bis {end} in {zone}.',
  'queue.reason.minimumGap':
    'Sie liegt mindestens {minutes} Minuten von jedem anderen Beitrag entfernt.',
  'queue.reason.noMinimumGap': 'Diese Regel legt keinen Mindestabstand zwischen Beiträgen fest.',
  'queue.reason.dailyCap': 'Dieser Tag fasst höchstens {limit} Beiträge, und ist nicht voll.',
  'queue.reason.dailyCapUnlimited': 'Diese Regel legt kein Tageslimit fest.',
  'queue.reason.blackoutSkipped':
    '{days, plural, one {# Sperrtag wurde} other {# Sperrtage wurden}} übersprungen, um hierher zu gelangen.',
  'queue.reason.dstNonexistentSkipped':
    'Die erste Uhrzeit im Zeitfenster existiert an diesem Datum in {zone} nicht, also wurde die nächste verwendet, die es gibt.',
  'queue.reason.dstAmbiguousFirst':
    'Diese Ortszeit kommt an diesem Datum in {zone} zweimal vor. Es wurde das erste Vorkommen verwendet.',
  'queue.reason.priorityChosen':
    'Diese Regel hat Priorität {priority}, die höchste, die anbieten konnte.',
  'queue.reason.connectionScoped':
    'Diese Regel gilt für {count, plural, one {# Konto} other {# Konten}}.',
  'queue.reason.horizonExhausted': 'Innerhalb von {days} Tagen war kein Zeitfenster frei.',
} as const;
