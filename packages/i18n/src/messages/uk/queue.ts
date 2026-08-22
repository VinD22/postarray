/**
 * Queue rules and slot reservations. See `en/queue.ts`: the `queue.reason.*`
 * keys are read back by a person and, years later, by an audit, so they
 * report exactly what happened, including the daylight-saving cases.
 */
export const queueMessages = {
  'queue.title': 'Черга публікацій',
  'queue.subtitle':
    'Коли цей проєкт готовий публікувати і з яким інтервалом. Нічого не публікується, поки людина не прийме час.',

  'queue.rules.heading': 'Правила черги',
  'queue.rules.empty':
    'Правил черги ще немає. Поки ви не додасте правило, наступний слот це просто перша вільна година.',
  'queue.rules.create': 'Нове правило черги',
  'queue.rules.count':
    '{count, plural, =0 {Немає правил} one {# правило} few {# правила} many {# правил} other {# правила}}',
  'queue.rules.enabled': 'Використовується',
  'queue.rules.disabled': 'Призупинено',
  'queue.rules.archived': 'В архіві',
  'queue.rules.edit': 'Редагувати правило',
  'queue.rules.archive': 'Заархівувати правило',
  'queue.rules.archiveHelp':
    'Архівування зупиняє майбутні пропозиції. Уже зарезервовані слоти зберігають свій час і свою причину.',

  'queue.field.name': 'Назва правила',
  'queue.field.nameHelp': 'Назва, яку ви впізнаєте пізніше, наприклад Будні ранки.',
  'queue.field.timeZone': 'Часовий пояс',
  'queue.field.timeZoneHelp': 'Вікна, денний ліміт і заборонені дати всі читаються в цьому поясі.',
  'queue.field.minimumGap': 'Мінімальний інтервал',
  'queue.field.minimumGapHelp':
    'Хвилини між двома публікаціями. Нуль означає відсутність правила інтервалу.',
  'queue.field.maximumPerDay': 'Максимум на день',
  'queue.field.maximumPerDayHelp':
    'Залиште порожнім для відсутності денного ліміту. Нуль означає, що це правило нічого не пропонує.',
  'queue.field.maximumPerDayUnlimited': 'Без денного ліміту',
  'queue.field.priority': 'Пріоритет',
  'queue.field.priorityHelp':
    'Використовується правило з найвищим пріоритетом, яке може запропонувати слот.',
  'queue.field.enabled': 'Використовувати це правило',

  'queue.windows.heading': 'Щотижневі вікна',
  'queue.windows.help':
    'Виберіть місцеві години, у які цей проєкт може публікувати. Використовуйте поля дня й часу або кнопки на сітці.',
  'queue.windows.empty': 'Вікон ще немає. Правило без вікна ніколи не зможе запропонувати слот.',
  'queue.windows.add': 'Додати вікно',
  'queue.windows.remove': 'Видалити вікно',
  'queue.windows.entry': '{weekday}, з {start} до {end}',
  'queue.windows.start': 'З',
  'queue.windows.end': 'До',
  'queue.windows.weekday': 'День',
  'queue.windows.toggleCell': '{weekday}, {hour}',
  'queue.windows.gridLabel': 'Щотижнева доступність, одна кнопка на день і годину',

  'queue.weekday.1': 'Понеділок',
  'queue.weekday.2': 'Вівторок',
  'queue.weekday.3': 'Середа',
  'queue.weekday.4': 'Четвер',
  'queue.weekday.5': 'П’ятниця',
  'queue.weekday.6': 'Субота',
  'queue.weekday.7': 'Неділя',

  'queue.blackouts.heading': 'Заборонені дати',
  'queue.blackouts.help':
    'Дати, у які цей проєкт не публікуватиме, читаються в часовому поясі правила.',
  'queue.blackouts.empty': 'Заборонених дат немає.',
  'queue.blackouts.add': 'Додати заборонену дату',
  'queue.blackouts.remove': 'Видалити заборонену дату',
  'queue.blackouts.from': 'Перший день',
  'queue.blackouts.to': 'Останній день',
  'queue.blackouts.entry': 'з {from} по {to}',

  'queue.connections.heading': 'Облікові записи',
  'queue.connections.all': 'Кожен обліковий запис у цьому проєкті',
  'queue.connections.scoped':
    '{count, plural, one {# обліковий запис} few {# облікові записи} many {# облікових записів} other {# облікового запису}}, до яких застосовується це правило',

  'queue.slot.heading': 'Наступний слот черги',
  'queue.slot.action': 'Використати наступний слот черги',
  'queue.slot.proposed': '{local} у часовому поясі {timeZone}',
  'queue.slot.utc': 'Це {utc} за UTC.',
  'queue.slot.why': 'Чому цей час',
  'queue.slot.accept': 'Використати цей час',
  'queue.slot.release': 'Вибрати інший час',
  'queue.slot.expires': 'Ця пропозиція утримується до {expires}.',
  'queue.slot.unavailable': 'Слот черги зараз недоступний.',
  'queue.slot.pending': 'Пошук наступного слоту.',
  'queue.slot.accepted': 'Заплановано на {local} у часовому поясі {timeZone}.',
  'queue.slot.notAutomatic': 'Нічого не заплановано, поки ви не виберете цей час.',

  'queue.reason.noRulesConfigured':
    'У цьому проєкті не налаштовано жодного правила черги, тому жодне вікно не застосовувалося.',
  'queue.reason.fallbackFirstFreeHour':
    'Натомість було використано першу вільну годину після поточного моменту.',
  'queue.reason.matchedRule': 'Правило {name} вибрало цей час у часовому поясі {zone}.',
  'queue.reason.matchedWindow': 'Він потрапляє у вікно з {start} до {end} у часовому поясі {zone}.',
  'queue.reason.minimumGap':
    'Він віддалений щонайменше на {minutes} хвилин від кожної іншої публікації.',
  'queue.reason.noMinimumGap': 'Це правило не встановлює мінімальний інтервал між публікаціями.',
  'queue.reason.dailyCap': 'Цей день вміщує не більше {limit} публікацій, і він ще не заповнений.',
  'queue.reason.dailyCapUnlimited': 'Це правило не встановлює денний ліміт.',
  'queue.reason.blackoutSkipped':
    'Щоб дійти до нього, було пропущено {days, plural, one {# заборонений день} few {# заборонені дні} many {# заборонених днів} other {# забороненого дня}}.',
  'queue.reason.dstNonexistentSkipped':
    'Перший час у вікні не існує в цю дату в часовому поясі {zone}, тому було використано наступний час, який існує.',
  'queue.reason.dstAmbiguousFirst':
    'Цей місцевий час настає двічі в часовому поясі {zone} у цю дату. Було використано перше настання.',
  'queue.reason.priorityChosen':
    'Це правило має пріоритет {priority}, найвищий із тих, що могли запропонувати слот.',
  'queue.reason.connectionScoped':
    'Це правило охоплює {count, plural, one {# обліковий запис} few {# облікові записи} many {# облікових записів} other {# облікового запису}}.',
  'queue.reason.horizonExhausted': 'Протягом {days} днів не знайшлося вільного вікна.',
} as const;
