/**
 * Queue rules and slot reservations.
 *
 * The reason keys are the ones the slot finder emits. They are the sentences a
 * person reads before they accept a proposed time, and the sentences an audit
 * reads back years later, so they say what actually happened rather than
 * congratulating anyone.
 */
export const queueMessages = {
  'queue.title': 'Queue ng pag-post',
  'queue.subtitle':
    'Kailan handang mag-post ang project na ito, at gaano kalayo ang agwat. Walang na-post nang walang taong tumanggap sa oras na iyon.',

  'queue.rules.heading': 'Mga panuntunan ng queue',
  'queue.rules.empty':
    "Wala pang panuntunan ng queue. Hangga't wala kang idinaragdag, ang susunod na slot ay ang unang libreng oras lang.",
  'queue.rules.create': 'Bagong panuntunan ng queue',
  'queue.rules.count': '{count, plural, =0 {Walang panuntunan} one {# panuntunan} other {# na panuntunan}}',
  'queue.rules.enabled': 'Ginagamit',
  'queue.rules.disabled': 'Naka-pause',
  'queue.rules.archived': 'Naka-archive',
  'queue.rules.edit': 'I-edit ang panuntunan',
  'queue.rules.archive': 'I-archive ang panuntunan',
  'queue.rules.archiveHelp':
    'Ihihinto ng pag-archive ang mga susunod na alok. Pananatilihin ng mga slot na na-reserve na ang kanilang oras at dahilan.',

  'queue.field.name': 'Pangalan ng panuntunan',
  'queue.field.nameHelp': 'Isang pangalang makikilala mo sa hinaharap, halimbawa Umaga sa weekday.',
  'queue.field.timeZone': 'Time zone',
  'queue.field.timeZoneHelp':
    'Binabasa sa time zone na ito ang mga window, ang bilang bawat araw, at ang mga blackout date.',
  'queue.field.minimumGap': 'Pinakamababang agwat',
  'queue.field.minimumGapHelp': 'Bilang ng minuto sa pagitan ng dalawang post. Zero ang ibig sabihin ay walang panuntunan sa espasyo.',
  'queue.field.maximumPerDay': 'Pinakamataas bawat araw',
  'queue.field.maximumPerDayHelp':
    'Iwanang blangko kung walang limitasyon bawat araw. Zero ang ibig sabihin ay walang ino-offer ang panuntunang ito.',
  'queue.field.maximumPerDayUnlimited': 'Walang limitasyon bawat araw',
  'queue.field.priority': 'Priyoridad',
  'queue.field.priorityHelp': 'Ang panuntunang may pinakamataas na priyoridad na makapag-alok ng slot ang gagamitin.',
  'queue.field.enabled': 'Gamitin ang panuntunang ito',

  'queue.windows.heading': 'Lingguhang mga window',
  'queue.windows.help':
    'Pumili ng mga lokal na oras na puwedeng mag-post ang project na ito. Gamitin ang mga field ng araw at oras, o ang mga button sa grid.',
  'queue.windows.empty': 'Wala pang window. Hindi kailanman makakapag-alok ng slot ang panuntunang walang window.',
  'queue.windows.add': 'Magdagdag ng window',
  'queue.windows.remove': 'Alisin ang window',
  'queue.windows.entry': '{weekday}, {start} hanggang {end}',
  'queue.windows.start': 'Mula',
  'queue.windows.end': 'Hanggang',
  'queue.windows.weekday': 'Araw',
  'queue.windows.toggleCell': '{weekday} sa {hour}',
  'queue.windows.gridLabel': 'Lingguhang availability, isang button bawat araw at oras',

  'queue.weekday.1': 'Lunes',
  'queue.weekday.2': 'Martes',
  'queue.weekday.3': 'Miyerkules',
  'queue.weekday.4': 'Huwebes',
  'queue.weekday.5': 'Biyernes',
  'queue.weekday.6': 'Sabado',
  'queue.weekday.7': 'Linggo',

  'queue.blackouts.heading': 'Mga blackout date',
  'queue.blackouts.help': 'Mga araw na hindi mag-po-post ang project na ito, binabasa sa time zone ng panuntunan.',
  'queue.blackouts.empty': 'Walang blackout date.',
  'queue.blackouts.add': 'Magdagdag ng blackout',
  'queue.blackouts.remove': 'Alisin ang blackout',
  'queue.blackouts.from': 'Unang araw',
  'queue.blackouts.to': 'Huling araw',
  'queue.blackouts.entry': '{from} hanggang {to}',

  'queue.connections.heading': 'Mga account',
  'queue.connections.all': 'Lahat ng account sa project na ito',
  'queue.connections.scoped':
    '{count, plural, one {# account} other {# na account}} na sinasaklaw ng panuntunang ito',

  'queue.slot.heading': 'Susunod na slot sa queue',
  'queue.slot.action': 'Gamitin ang susunod na slot sa queue',
  'queue.slot.proposed': '{local} sa {timeZone}',
  'queue.slot.utc': 'Iyon ay {utc} sa UTC.',
  'queue.slot.why': 'Bakit ang oras na ito',
  'queue.slot.accept': 'Gamitin ang oras na ito',
  'queue.slot.release': 'Pumili ng ibang oras',
  'queue.slot.expires': 'Nakalaan ang alok na ito hanggang {expires}.',
  'queue.slot.unavailable': 'Walang available na slot sa queue sa ngayon.',
  'queue.slot.pending': 'Hinahanap ang susunod na slot.',
  'queue.slot.accepted': 'Naka-iskedyul para sa {local} sa {timeZone}.',
  'queue.slot.notAutomatic': 'Walang naka-iskedyul hanggang pumili ka ng oras na ito.',

  'queue.reason.noRulesConfigured':
    'Walang naka-configure na panuntunan ng queue ang project na ito, kaya walang naging window na inilapat.',
  'queue.reason.fallbackFirstFreeHour': 'Ginamit sa halip ang unang libreng oras simula ngayon.',
  'queue.reason.matchedRule': 'Pinili ng panuntunang {name} ang oras na ito, sa {zone}.',
  'queue.reason.matchedWindow': 'Nasa loob ito ng window na {start} hanggang {end} sa {zone}.',
  'queue.reason.minimumGap': 'Hindi bababa sa {minutes} minuto ang layo nito sa bawat ibang post.',
  'queue.reason.noMinimumGap': 'Walang pinakamababang agwat sa pagitan ng mga post ang itinakda ng panuntunang ito.',
  'queue.reason.dailyCap': 'May pinakamataas na {limit} post ang araw na iyon, at hindi pa ito puno.',
  'queue.reason.dailyCapUnlimited': 'Walang limitasyon bawat araw ang itinakda ng panuntunang ito.',
  'queue.reason.blackoutSkipped':
    '{days, plural, one {# blackout day ang} other {# na blackout day ang}} nilaktawan para marating ito.',
  'queue.reason.dstNonexistentSkipped':
    'Hindi umiiral ang unang oras sa window sa petsang iyon sa {zone}, kaya ginamit ang susunod na umiiral.',
  'queue.reason.dstAmbiguousFirst':
    'Dalawang beses nangyayari ang lokal na oras na iyon sa {zone} sa petsang iyon. Ginamit ang unang pagkakataon.',
  'queue.reason.priorityChosen': 'May priyoridad na {priority} ang panuntunang ito, ang pinakamataas na makakapag-alok.',
  'queue.reason.connectionScoped':
    'Sinasaklaw ng panuntunang ito ang {count, plural, one {# account} other {# na account}}.',
  'queue.reason.horizonExhausted': 'Walang libreng window sa loob ng {days} na araw.',
} as const;
