/**
 * Queue rules and slot reservations. See `en/queue.ts`: the `queue.reason.*`
 * keys are read back by a person and, years later, by an audit, so they
 * report exactly what happened, including the daylight-saving cases.
 */
export const queueMessages = {
  'queue.title': 'Очередь публикаций',
  'queue.subtitle':
    'Когда этот проект готов публиковать и с каким интервалом. Ничего не публикуется, пока человек не примет время.',

  'queue.rules.heading': 'Правила очереди',
  'queue.rules.empty':
    'Правил очереди пока нет. Пока вы не добавите правило, следующий слот это просто первый свободный час.',
  'queue.rules.create': 'Новое правило очереди',
  'queue.rules.count':
    '{count, plural, =0 {Нет правил} one {# правило} few {# правила} many {# правил} other {# правила}}',
  'queue.rules.enabled': 'Используется',
  'queue.rules.disabled': 'Приостановлено',
  'queue.rules.archived': 'В архиве',
  'queue.rules.edit': 'Редактировать правило',
  'queue.rules.archive': 'Архивировать правило',
  'queue.rules.archiveHelp':
    'Архивирование останавливает будущие предложения. Уже зарезервированные слоты сохраняют своё время и свою причину.',

  'queue.field.name': 'Название правила',
  'queue.field.nameHelp': 'Название, которое вы узнаете позже, например Будние утра.',
  'queue.field.timeZone': 'Часовой пояс',
  'queue.field.timeZoneHelp': 'Окна, дневной лимит и запретные даты все читаются в этом поясе.',
  'queue.field.minimumGap': 'Минимальный интервал',
  'queue.field.minimumGapHelp':
    'Минуты между двумя публикациями. Ноль означает отсутствие правила интервала.',
  'queue.field.maximumPerDay': 'Максимум в день',
  'queue.field.maximumPerDayHelp':
    'Оставьте пустым для отсутствия дневного лимита. Ноль означает, что это правило ничего не предлагает.',
  'queue.field.maximumPerDayUnlimited': 'Без дневного лимита',
  'queue.field.priority': 'Приоритет',
  'queue.field.priorityHelp':
    'Используется правило с самым высоким приоритетом, способное предложить слот.',
  'queue.field.enabled': 'Использовать это правило',

  'queue.windows.heading': 'Еженедельные окна',
  'queue.windows.help':
    'Выберите местные часы, в которые этот проект может публиковать. Используйте поля дня и времени или кнопки на сетке.',
  'queue.windows.empty': 'Окон пока нет. Правило без окна никогда не сможет предложить слот.',
  'queue.windows.add': 'Добавить окно',
  'queue.windows.remove': 'Удалить окно',
  'queue.windows.entry': '{weekday}, с {start} до {end}',
  'queue.windows.start': 'С',
  'queue.windows.end': 'До',
  'queue.windows.weekday': 'День',
  'queue.windows.toggleCell': '{weekday}, {hour}',
  'queue.windows.gridLabel': 'Еженедельная доступность, одна кнопка на день и час',

  'queue.weekday.1': 'Понедельник',
  'queue.weekday.2': 'Вторник',
  'queue.weekday.3': 'Среда',
  'queue.weekday.4': 'Четверг',
  'queue.weekday.5': 'Пятница',
  'queue.weekday.6': 'Суббота',
  'queue.weekday.7': 'Воскресенье',

  'queue.blackouts.heading': 'Запретные даты',
  'queue.blackouts.help':
    'Даты, в которые этот проект не будет публиковать, читаются в часовом поясе правила.',
  'queue.blackouts.empty': 'Запретных дат нет.',
  'queue.blackouts.add': 'Добавить запретную дату',
  'queue.blackouts.remove': 'Удалить запретную дату',
  'queue.blackouts.from': 'Первый день',
  'queue.blackouts.to': 'Последний день',
  'queue.blackouts.entry': 'с {from} по {to}',

  'queue.connections.heading': 'Аккаунты',
  'queue.connections.all': 'Каждый аккаунт в этом проекте',
  'queue.connections.scoped':
    '{count, plural, one {# аккаунт} few {# аккаунта} many {# аккаунтов} other {# аккаунта}}, к которым применяется это правило',

  'queue.slot.heading': 'Следующий слот очереди',
  'queue.slot.action': 'Использовать следующий слот очереди',
  'queue.slot.proposed': '{local} в часовом поясе {timeZone}',
  'queue.slot.utc': 'Это {utc} по UTC.',
  'queue.slot.why': 'Почему это время',
  'queue.slot.accept': 'Использовать это время',
  'queue.slot.release': 'Выбрать другое время',
  'queue.slot.expires': 'Это предложение удерживается до {expires}.',
  'queue.slot.unavailable': 'Слот очереди сейчас недоступен.',
  'queue.slot.pending': 'Поиск следующего слота.',
  'queue.slot.accepted': 'Запланировано на {local} в часовом поясе {timeZone}.',
  'queue.slot.notAutomatic': 'Ничего не запланировано, пока вы не выберете это время.',

  'queue.reason.noRulesConfigured':
    'В этом проекте не настроено ни одного правила очереди, поэтому окно не применялось.',
  'queue.reason.fallbackFirstFreeHour':
    'Вместо этого был использован первый свободный час после текущего момента.',
  'queue.reason.matchedRule': 'Правило {name} выбрало это время в часовом поясе {zone}.',
  'queue.reason.matchedWindow': 'Оно попадает в окно с {start} до {end} в часовом поясе {zone}.',
  'queue.reason.minimumGap':
    'Оно отстоит как минимум на {minutes} минут от каждой другой публикации.',
  'queue.reason.noMinimumGap': 'Это правило не задаёт минимальный интервал между публикациями.',
  'queue.reason.dailyCap':
    'В этот день вмещается не более {limit} публикаций, и он ещё не заполнен.',
  'queue.reason.dailyCapUnlimited': 'Это правило не задаёт дневной лимит.',
  'queue.reason.blackoutSkipped':
    'Чтобы дойти до него, было пропущено {days, plural, one {# запретный день} few {# запретных дня} many {# запретных дней} other {# запретного дня}}.',
  'queue.reason.dstNonexistentSkipped':
    'Первое время в окне не существует в эту дату в часовом поясе {zone}, поэтому было использовано следующее существующее время.',
  'queue.reason.dstAmbiguousFirst':
    'Это местное время наступает дважды в часовом поясе {zone} в эту дату. Было использовано первое наступление.',
  'queue.reason.priorityChosen':
    'У этого правила приоритет {priority}, самый высокий из тех, что могли предложить слот.',
  'queue.reason.connectionScoped':
    'Это правило охватывает {count, plural, one {# аккаунт} few {# аккаунта} many {# аккаунтов} other {# аккаунта}}.',
  'queue.reason.horizonExhausted': 'В течение {days} дней не нашлось свободного окна.',
} as const;
