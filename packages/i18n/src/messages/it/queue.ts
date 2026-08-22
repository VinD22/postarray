/**
 * Queue rules and slot reservations.
 *
 * The reason keys are the ones the slot finder emits. They are the sentences a
 * person reads before they accept a proposed time, and the sentences an audit
 * reads back years later, so they say what actually happened rather than
 * congratulating anyone.
 */
export const queueMessages = {
  'queue.title': 'Coda di pubblicazione',
  'queue.subtitle':
    "Quando questo progetto è disposto a pubblicare e con quale distanza. Niente viene pubblicato senza che una persona accetti l'orario.",

  'queue.rules.heading': 'Regole della coda',
  'queue.rules.empty':
    'Ancora nessuna regola della coda. Finché non ne aggiungi una, il prossimo spazio è semplicemente la prima ora libera.',
  'queue.rules.create': 'Nuova regola della coda',
  'queue.rules.count':
    '{count, plural, =0 {Nessuna regola} one {# regola} many {# regole} other {# regole}}',
  'queue.rules.enabled': 'In uso',
  'queue.rules.disabled': 'In pausa',
  'queue.rules.archived': 'Archiviata',
  'queue.rules.edit': 'Modifica regola',
  'queue.rules.archive': 'Archivia regola',
  'queue.rules.archiveHelp':
    'Archiviare interrompe le proposte future. Gli spazi già riservati mantengono il loro orario e il loro motivo.',

  'queue.field.name': 'Nome della regola',
  'queue.field.nameHelp': 'Un nome che riconoscerai in seguito, ad esempio Mattine feriali.',
  'queue.field.timeZone': 'Fuso orario',
  'queue.field.timeZoneHelp':
    'Le finestre, il conteggio giornaliero e le date di blackout sono tutti letti in questo fuso.',
  'queue.field.minimumGap': 'Intervallo minimo',
  'queue.field.minimumGapHelp':
    'Minuti tra due post. Zero significa nessuna regola di distanziamento.',
  'queue.field.maximumPerDay': 'Massimo al giorno',
  'queue.field.maximumPerDayHelp':
    'Lascia vuoto per nessun limite giornaliero. Zero significa che questa regola non propone nulla.',
  'queue.field.maximumPerDayUnlimited': 'Nessun limite giornaliero',
  'queue.field.priority': 'Priorità',
  'queue.field.priorityHelp':
    'La regola con la priorità più alta che può offrire uno spazio è quella utilizzata.',
  'queue.field.enabled': 'Usa questa regola',

  'queue.windows.heading': 'Finestre settimanali',
  'queue.windows.help':
    'Scegli le ore locali in cui questo progetto può pubblicare. Usa i campi giorno e ora, oppure i pulsanti sulla griglia.',
  'queue.windows.empty':
    'Ancora nessuna finestra. Una regola senza finestra non può mai offrire uno spazio.',
  'queue.windows.add': 'Aggiungi finestra',
  'queue.windows.remove': 'Rimuovi finestra',
  'queue.windows.entry': '{weekday}, dalle {start} alle {end}',
  'queue.windows.start': 'Da',
  'queue.windows.end': 'A',
  'queue.windows.weekday': 'Giorno',
  'queue.windows.toggleCell': '{weekday} alle {hour}',
  'queue.windows.gridLabel': 'Disponibilità settimanale, un pulsante per ogni giorno e ora',

  'queue.weekday.1': 'Lunedì',
  'queue.weekday.2': 'Martedì',
  'queue.weekday.3': 'Mercoledì',
  'queue.weekday.4': 'Giovedì',
  'queue.weekday.5': 'Venerdì',
  'queue.weekday.6': 'Sabato',
  'queue.weekday.7': 'Domenica',

  'queue.blackouts.heading': 'Date di blackout',
  'queue.blackouts.help':
    'Date in cui questo progetto non pubblicherà, lette nel fuso orario della regola.',
  'queue.blackouts.empty': 'Nessuna data di blackout.',
  'queue.blackouts.add': 'Aggiungi blackout',
  'queue.blackouts.remove': 'Rimuovi blackout',
  'queue.blackouts.from': 'Primo giorno',
  'queue.blackouts.to': 'Ultimo giorno',
  'queue.blackouts.entry': 'Da {from} a {to}',

  'queue.connections.heading': 'Account',
  'queue.connections.all': 'Ogni account in questo progetto',
  'queue.connections.scoped':
    '{count, plural, one {# account} many {# account} other {# account}} a cui si applica questa regola',

  'queue.slot.heading': 'Prossimo spazio in coda',
  'queue.slot.action': 'Usa il prossimo spazio in coda',
  'queue.slot.proposed': '{local} in {timeZone}',
  'queue.slot.utc': 'Cioè {utc} in UTC.',
  'queue.slot.why': 'Perché questo orario',
  'queue.slot.accept': 'Usa questo orario',
  'queue.slot.release': 'Scegli un altro orario',
  'queue.slot.expires': 'Questa proposta è valida fino al {expires}.',
  'queue.slot.unavailable': 'Uno spazio in coda non è disponibile in questo momento.',
  'queue.slot.pending': 'Ricerca del prossimo spazio in corso.',
  'queue.slot.accepted': 'Programmato per {local} in {timeZone}.',
  'queue.slot.notAutomatic': 'Niente viene programmato finché non scegli questo orario.',

  'queue.reason.noRulesConfigured':
    'Questo progetto non ha regole della coda configurate, quindi non è stata applicata nessuna finestra.',
  'queue.reason.fallbackFirstFreeHour': 'È stata usata invece la prima ora libera da adesso.',
  'queue.reason.matchedRule': 'La regola {name} ha scelto questo orario, in {zone}.',
  'queue.reason.matchedWindow': 'Rientra nella finestra dalle {start} alle {end} in {zone}.',
  'queue.reason.minimumGap': 'Dista almeno {minutes} minuti da ogni altro post.',
  'queue.reason.noMinimumGap': 'Questa regola non imposta un intervallo minimo tra i post.',
  'queue.reason.dailyCap': 'Quel giorno contiene al massimo {limit} post, e non è pieno.',
  'queue.reason.dailyCapUnlimited': 'Questa regola non imposta un limite giornaliero.',
  'queue.reason.blackoutSkipped':
    '{days, plural, one {È stato saltato # giorno di blackout} many {Sono stati saltati # giorni di blackout} other {Sono stati saltati # giorni di blackout}} per raggiungerlo.',
  'queue.reason.dstNonexistentSkipped':
    'Il primo orario nella finestra non esiste in quella data in {zone}, quindi è stato usato il successivo che esiste.',
  'queue.reason.dstAmbiguousFirst':
    "Quell'orario locale si verifica due volte in {zone} in quella data. È stata usata la prima occorrenza.",
  'queue.reason.priorityChosen':
    'Questa regola ha priorità {priority}, la più alta che potesse offrire.',
  'queue.reason.connectionScoped':
    'Questa regola copre {count, plural, one {# account} many {# account} other {# account}}.',
  'queue.reason.horizonExhausted': 'Nessuna finestra libera entro {days} giorni.',
} as const;
