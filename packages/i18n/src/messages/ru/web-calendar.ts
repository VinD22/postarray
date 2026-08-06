/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'Фейсбук',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Threads',
  'web.provider.bluesky': 'Bluesky',
  'web.provider.mastodon': 'Mastodon',
  'web.provider.telegram': 'Telegram',
  'web.provider.reddit': 'Reddit',
  'web.provider.wordpress': 'WordPress',
  'web.provider.medium': 'Medium',
  'web.provider.devto': 'Dev.to',
  'web.provider.pinterest': 'Pinterest',
  'web.provider.discord': 'Discord',
  'web.provider.slack': 'Slack',
  'web.connection.requirement.mastodon':
    'Mastodon подключается по токену доступа, созданному на вашем сервере, а не по паролю.',
  'web.connection.requirement.telegram':
    'Relay публикует от имени бота. Добавьте бота в канал или группу, куда хотите публиковать.',
  'web.connection.requirement.reddit':
    'Запись в Reddit требует одобренного приложения, а каждой публикации нужны заголовок и сабреддит.',
  'web.connection.requirement.wordpress':
    'Relay публикует через REST API сайта с паролем приложения, созданным в WordPress.',
  'web.connection.requirement.medium':
    'Medium подключается через OAuth, и Relay публикует открытые истории в Markdown.',
  'web.connection.requirement.devto':
    'Dev.to подключается по API-ключу, созданному в настройках Dev.to.',
  'web.connection.requirement.pinterest':
    'Запись в Pinterest требует одобренного доступа приложения, а пину нужны изображение и собственная доска.',
  'web.connection.requirement.discord':
    'Relay публикует от имени бота. Добавьте бота на серверы и в каналы, куда хотите публиковать.',
  'web.connection.requirement.slack':
    'Relay публикует от имени приложения. Добавьте приложение в каналы, куда хотите публиковать.',
  'web.provider.fake': 'Тестовый разъем',

  'web.accountType.personal_profile': 'Личный профиль',
  'web.accountType.creator_profile': 'Аккаунт создателя',
  'web.accountType.business_profile': 'Бизнес-аккаунт',
  'web.accountType.page': 'Страница',
  'web.accountType.organization': 'Организация',
  'web.accountType.channel': 'Канал',
  'web.accountType.group': 'Группа',
  'web.accountType.board': 'Совет',
  'web.accountType.community': 'Сообщество',
  'web.accountType.publication': 'Публикация',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Все запланированное, ожидающее одобрения, опубликованное или заблокированное, в одном месте.',
  'web.calendar.view.agenda': 'Повестка дня',
  'web.calendar.view.table': 'Таблица',
  'web.calendar.view.switchLabel': 'Выберите способ составления расписания',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} на {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'Показаны {range} в {timeZone}',
  'web.calendar.timeZone.workspace': 'Часовой пояс Workspace: {timeZone}',
  'web.calendar.timeZone.change': 'Изменение настроек рабочего пространства',
  'web.calendar.jumpToDate': 'Перейти на свидание',
  'web.calendar.nowLabel': 'Сейчас',
  'web.calendar.allDayHeading': 'Точного времени пока нет',

  'web.calendar.filter.group': 'Группа клиентов',
  'web.calendar.filter.anyBrand': 'Любой бренд',
  'web.calendar.filter.anyAccount': 'Любой аккаунт',
  'web.calendar.filter.anyPlatform': 'Любая платформа',
  'web.calendar.filter.anyStatus': 'Любой статус',
  'web.calendar.filter.anyLocale': 'Любой язык контента',
  'web.calendar.filter.anyCampaign': 'Любая кампания',
  'web.calendar.filter.anyGroup': 'Каждая группа',
  'web.calendar.filter.regionLabel': 'Фильтровать расписание',
  'web.calendar.bucket.scheduled': 'Запланировано',
  'web.calendar.bucket.draft': 'Проекты и согласования',
  'web.calendar.bucket.published': 'Опубликовано',
  'web.calendar.bucket.failed': 'Требует внимания',
  'web.calendar.filter.summary':
    '{count, plural, =0 {Нет фильтров} one {# фильтр} few {# фильтров} many {# фильтров} other {# фильтров}}, {results, plural, =0 {нет сообщений} one {# сообщений} few {# сообщений} many {# сообщений} other {# сообщений}}',

  'web.calendar.grid.label': 'Сетка расписания для {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Ничего на {time} на {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {Показать ещё # сообщения} few {Показать ещё # сообщения} many {Показать ещё # сообщения} other {Показать ещё # сообщения}}',
  'web.calendar.month.label': 'Сетка месяцев для {month}',
  'web.calendar.agenda.label': 'Повестка дня {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Ничего не запланировано',

  'web.calendar.table.caption': 'Все сообщения в {range}, отсортированные по времени публикации.',
  'web.calendar.table.column.time': 'Время',
  'web.calendar.table.column.account': 'Аккаунт',
  'web.calendar.table.column.content': 'Содержание',
  'web.calendar.table.column.language': 'Язык',
  'web.calendar.table.column.media': 'СМИ',
  'web.calendar.table.column.status': 'Статус',
  'web.calendar.table.column.approver': 'утверждающий',
  'web.calendar.table.column.campaign': 'Кампания',
  'web.calendar.table.column.actions': 'Действия',
  'web.calendar.table.rowMenu': 'Действия для {title}',
  'web.calendar.table.noApprover': 'Никакого одобрения не требуется',
  'web.calendar.table.noCampaign': 'Нет кампании',

  'web.calendar.entry.untitled': 'Безымянный черновик',
  'web.calendar.entry.language': 'Язык {locale}',
  'web.calendar.entry.openDetail': 'Открыть {title}',
  'web.calendar.entry.selected': '{title} выбрано. {hint}',
  'web.calendar.detail.title': 'Запланированная публикация',
  'web.calendar.detail.close': 'Закрыть этот пост',

  'web.calendar.keyboard.title': 'Перемещение публикации с помощью клавиатуры',
  'web.calendar.keyboard.body':
    'Выделите публикацию и нажмите Enter, чтобы открыть ее. Нажмите M, чтобы подобрать сообщение, затем с помощью клавиш со стрелками переместите его на одну ячейку и нажмите Enter для подтверждения. Нажмите Escape, чтобы вернуть его обратно.',
  'web.calendar.keyboard.pickUp': 'Переместить этот пост',
  'web.calendar.keyboard.grabbed':
    '{title} взят из {from}. Клавиши со стрелками перемещают его. Ввод подтверждает. Побег отменяется.',
  'web.calendar.keyboard.moved': 'Предлагаемое время {to}. Ввод подтверждает.',
  'web.calendar.keyboard.released': '{title} возвращен на {from}.',
  'web.calendar.keyboard.stepMinutes': 'Каждый шаг составляет {minutes} минут.',

  'web.calendar.reschedule.title': 'Переместить этот пост?',
  'web.calendar.reschedule.subject': '{account} на {provider}',
  'web.calendar.reschedule.from': 'От {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'В {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Переместить публикацию',
  'web.calendar.reschedule.dstTitle': 'Часы меняются между этими двумя временами',
  'web.calendar.reschedule.dstBody':
    'Смещение в {timeZone} равно {fromOffset} в старое время и {toOffset} в новое время. Выбранный вами местный час сохраняется, поэтому UTC мгновенно смещается.',
  'web.calendar.reschedule.conflictTitle': 'Остальные публикации будут ближе к этому времени',
  'web.calendar.reschedule.conflictBody':
    'У {account} уже есть {count, plural, one {# сообщений} few {# сообщений} many {# сообщений} other {# сообщений}} в {window} нового времени.',
  'web.calendar.reschedule.campaignTitle': 'Конфликт кампании',
  'web.calendar.reschedule.campaignBody':
    'Кампания {campaign} проходит с {start} по {end}. Новое время за этим окном.',
  'web.calendar.reschedule.leadTimeTitle': 'Это очень скоро',
  'web.calendar.reschedule.leadTimeBody':
    'С этого момента новое время, {duration}. {provider} требуется {required} для подготовки носителя для публикации этого типа.',
  'web.calendar.reschedule.pastTitle': 'Это время прошло',
  'web.calendar.reschedule.pastBody': 'Выберите время в будущем или опубликуйте сейчас.',

  'web.calendar.published.title': 'Этот пост уже опубликован',
  'web.calendar.published.body':
    'Сообщение существует на {provider} по адресу {permalinkLabel}. Перемещение записи в Relay не перемещает публикацию на платформе. Выберите, что вы хотите, чтобы произошло.',
  'web.calendar.published.optionLocal': 'Обновить только локальную запись',
  'web.calendar.published.optionLocalHint':
    'В квитанции сохраняется реальное время публикации. Перемещается только запись планирования, поэтому ваш календарь соответствует вашему плану.',
  'web.calendar.published.optionNew': 'Запланируйте новую публикацию в новое время',
  'web.calendar.published.optionNewHint':
    'Это создаст вторую, отдельную внешнюю публикацию. Тот, кто уже зарегистрирован на {provider}, остается в сети.',
  'web.calendar.published.optionLabel': 'Что должно произойти',

  'web.calendar.attention.title':
    '{count, plural, one {# сообщений требуется решение или исправление} few {# сообщений требуется решение или исправление} many {# сообщений требуется решение или исправление} other {# сообщений требуется решение или исправление}}',
  'web.calendar.attention.body': 'Они остаются здесь и в центре действий, пока не будут решены.',
  'web.calendar.attention.open': 'Откройте центр действий',
  'web.calendar.attention.showOnly': 'Показать только эти',

  'web.calendar.loading': 'Загрузка расписания',
  'web.calendar.error.title': 'Не удалось загрузить расписание',
  'web.calendar.error.body':
    'Ничего из запланированного не изменилось. Ваши сообщения по-прежнему публикуются в запланированное время.',
  'web.calendar.error.retry': 'Попробуйте еще раз',
  'web.calendar.empty.example':
    '09:30 Европа/Берлин, X @acme, "Первые комментарии по расписанию", Запланировано, 1 изображение',
  'web.calendar.emptyFiltered.body':
    'Ни одно сообщение в {range} не соответствует этим фильтрам. Расширьте диапазон или очистите фильтр.',
  'web.calendar.offline.title': 'Вы оффлайн',
  'web.calendar.offline.body':
    'Расписание ниже представляет собой последнюю копию, загруженную на это устройство. Перепланирование и публикация недоступны до восстановления соединения.',
  'web.calendar.rateLimited.cause':
    'Это рабочее пространство читает календарь больше раз, чем позволяет текущее окно.',
  'web.calendar.rateLimited.resetLabel': 'Вы можете попробовать еще раз в',
  'web.calendar.rateLimited.resetUnknown': '{provider} не сказал, когда это обнулится.',
  'web.calendar.permission.requirementsLabel': 'Требуемый объем',
  'web.calendar.permission.title': 'Вы не можете видеть этот календарь',
  'web.calendar.permission.body':
    'Доступ к календарю предоставляется для каждого бренда. Ваша учетная запись не относится к брендам в этом представлении.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Календарь',
  'web.receipt.breadcrumb.post': 'Сообщение',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Загрузка квитанции о публикации',
  'web.receipt.notFound.title': 'Нет квитанции с этой ссылкой',
  'web.receipt.notFound.body':
    'Квитанция существует после отправки почты. Проверьте ссылку или откройте публикацию из календаря.',
  'web.receipt.error.title': 'Квитанция не может быть загружена',
  'web.receipt.error.body':
    'Квитанция является неизменяемой и на нее это не влияет. Ничего не переиздавалось.',

  'web.receipt.section.summary': 'Что случилось',
  'web.receipt.section.timeline': 'Хронология событий',
  'web.receipt.section.items': 'Корневой пост и последующие элементы',
  'web.receipt.section.attempts': 'Попытки',
  'web.receipt.section.provenance': 'Провенанс',
  'web.receipt.section.cost': 'Использование провайдера',
  'web.receipt.section.analytics': 'Синхронизация аналитики',
  'web.receipt.section.targets': 'Цели в этой кампании',

  'web.receipt.item.root': 'Корневой пост',
  'web.receipt.item.comment': 'Комментарий {position}',
  'web.receipt.item.thread': 'Часть резьбы {position}',
  'web.receipt.item.delay': 'Запускает {delay} после корневого сообщения.',
  'web.receipt.item.noDelay': 'Запускается с корневым сообщением',
  'web.receipt.item.pending': 'Еще не началось',
  'web.receipt.item.rootUnaffected':
    'Корневой пост активен. Последующий элемент, который потерпел неудачу, никогда этого не изменит.',

  'web.receipt.attempt.heading': 'Попытка {number}',
  'web.receipt.attempt.startedAt': 'Запущен {time}',
  'web.receipt.attempt.startedLabel': 'Началось',
  'web.receipt.attempt.responseSummary': 'Обработанный ответ поставщика',
  'web.receipt.attempt.duration': 'Взял {duration}',
  'web.receipt.attempt.httpStatus': 'Статус HTTP',
  'web.receipt.attempt.providerRequestId': 'Ссылка на запрос поставщика',
  'web.receipt.attempt.retryable': 'Повторная попытка автоматически',
  'web.receipt.attempt.notRetryable': 'Не повторяется автоматически',
  'web.receipt.attempt.nextRetry': 'Следующая попытка {time}',
  'web.receipt.attempt.nextRetryLabel': 'Следующая попытка',
  'web.receipt.attempt.showResponse': 'Показать проверенный ответ поставщика',
  'web.receipt.attempt.hideResponse': 'Скрыть проверенный ответ поставщика',
  'web.receipt.attempt.none': 'Одна попытка, ни одного провала.',

  'web.receipt.provenance.capabilityVersion': 'Снимок возможностей',
  'web.receipt.provenance.capabilityHint':
    'Снимок используется при утверждении и перепроверяется перед отправкой.',
  'web.receipt.provenance.accountType': 'Тип аккаунта',
  'web.receipt.provenance.externalAccount': 'Ссылка на внешний аккаунт',
  'web.receipt.provenance.workflow': 'Справочник по рабочему процессу',
  'web.receipt.provenance.createdAt': 'В квитанции написано {time}',

  'web.receipt.approval.notRequired': 'Для этой цели не требовалось никакого одобрения.',
  'web.receipt.approval.policy': 'Политика {policy}',
  'web.receipt.approval.unknownPolicy': 'Ссылка на политику не записана',

  'web.receipt.cost.currency': 'Списано в {currency}',
  'web.receipt.cost.estimatedLabel': 'Приблизительно перед публикацией',
  'web.receipt.cost.actualLabel': 'Согласованный фактический',
  'web.receipt.provenance.writtenLabel': 'Квитанция написана',
  'web.receipt.cost.reconciledAt': 'Согласовано {time}',
  'web.receipt.cost.notMetered':
    '{provider} не взимает плату за операцию для этого типа сообщений.',

  'web.receipt.analytics.never': 'Аналитика для этого сообщения еще не синхронизирована.',
  'web.receipt.analytics.explain':
    'Провайдеры агрегируют данные по своим собственным графикам. Ниже указано время, когда Relay последний раз их читал, а не время, когда числа были истинными.',

  'web.receipt.export.download': 'Скачать квитанцию',
  'web.receipt.export.copyReference': 'Скопируйте ссылку на квитанцию',
  'web.receipt.export.denied':
    'Для совместного использования квитанции требуется роль владельца, администратора или утверждающего. Вы {role}.',

  'web.receipt.partial.retryFailedOnly':
    'Повторите попытку только для тех целей, которые не удалось выполнить.',
  'web.receipt.partial.retryHint':
    'Повторная попытка никогда не затрагивает цель, которая уже создала внешнюю публикацию.',

  'web.receipt.remediation.user_action_required':
    'Для этого необходимо внести изменения в Relay или {provider}, прежде чем он сможет снова запуститься.',
  'web.receipt.remediation.content_invalid':
    'Отредактируйте содержимое, чтобы оно прошло проверку {provider}, а затем снова запланируйте его.',
  'web.receipt.remediation.transient_provider':
    '{provider} вернул временную ошибку. Relay повторил попытку по собственному расписанию.',
  'web.receipt.remediation.permanent_provider':
    '{provider} отказался от этого навсегда. Повторная попытка того же контента не изменит ответ.',
  'web.receipt.remediation.internal':
    'Это была ошибка с нашей стороны. Это записано со ссылкой ниже.',
  'web.receipt.remediation.unknown':
    '{provider} вернул то, для чего у нас нет правила. Уточненный ответ приведен ниже.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Счета',
  'web.connection.tab.capabilities': 'Матрица возможностей',
  'web.connection.tab.groups': 'Группы клиентов',
  'web.connection.loading': 'Загрузка подключенных аккаунтов',
  'web.connection.error.title': 'Не удалось загрузить подключенные учетные записи.',
  'web.connection.error.body':
    'Публикация не затронута. Запланированные публикации по-прежнему выполняются с сохраненным доступом.',
  'web.connection.list.label': 'Подключенные аккаунты',
  'web.connection.empty.example':
    'X, @acme, личный профиль, подключен Ана Руис 12 июня, публикации и показатели, последняя публикация 6 августа',
  'web.connection.filter.provider': 'Платформа',
  'web.connection.filter.health': 'Здоровье',
  'web.connection.filter.group': 'Группа клиентов',
  'web.connection.filter.anyHealth': 'Любое здоровье',
  'web.connection.healthFilter.healthy': 'Работаю',
  'web.connection.healthFilter.expiring_soon': 'Срок действия скоро истекает',
  'web.connection.healthFilter.expired': 'Срок доступа истек',
  'web.connection.healthFilter.revoked': 'Доступ отозван',
  'web.connection.healthFilter.permission_missing': 'Отсутствует разрешение',
  'web.connection.healthFilter.review_pending': 'Ожидание обзора платформы',
  'web.connection.healthFilter.paused': 'Приостановлено',
  'web.connection.healthFilter.unknown': 'Здоровье недоступно',

  'web.connection.row.summaryLabel': 'Что может этот аккаунт',
  'web.connection.row.expand': 'Показать полную информацию о {account}',
  'web.connection.row.collapse': 'Скрыть полное описание {account}',
  'web.connection.row.metered':
    'Измеряется за операцию. Расчетное количество {amount} на создание сообщения.',
  'web.connection.row.limitationHeading': 'Ограничения на этом аккаунте',
  'web.connection.row.noLimitations':
    'В этом аккаунте нет ограничений на производство или бета-версию.',
  'web.connection.row.beta': 'Бета-коннектор',
  'web.connection.row.betaBody':
    'Этот соединитель работает, но с ограничениями, которые мы еще не закончили проверять. Проверьте опубликованный пост, прежде чем полагаться на него.',

  'web.connection.detail.expiryLabel': 'Срок доступа истекает',
  'web.connection.health.expiresIn': 'Срок действия доступа истекает {relativeTime}, на {date}.',
  'web.connection.health.noExpiry':
    'Срок действия этого доступа не истекает по расписанию, которое сообщает нам {provider}.',
  'web.connection.health.checkedAt': 'Здоровье проверено {relativeTime}',

  'web.connection.action.inspect': 'Проверка разрешений',
  'web.connection.action.viewCapabilities': 'Посмотрите, что он поддерживает',
  'web.connection.action.moveGroup': 'Перейти в другую группу',
  'web.connection.action.menu': 'Дополнительные действия для {account}',

  'web.connection.pause.title': 'Пауза {account}?',
  'web.connection.resume.title': 'Возобновить {account}?',
  'web.connection.resume.body':
    'Запланированные публикации для этого аккаунта начнут публиковаться снова в запланированное время. Сообщения, время которых уже прошло, не активируются задним числом.',
  'web.connection.disconnect.confirmWord': 'ОТКЛЮЧИТЬ',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# запланированное сообщение} few {# запланированное сообщение} many {# запланированное сообщение} other {# запланированное сообщение}} для этого аккаунта не будет опубликовано.',
  'web.connection.disconnect.consequence.published':
    'Уже опубликованные сообщения остаются на {provider}. Relay не удаляет их.',
  'web.connection.disconnect.consequence.analytics':
    'Уже собранные метрики остаются в этой рабочей области и перестают обновляться.',

  'web.connection.connect.title': 'Подключить аккаунт',
  'web.connection.connect.chooseProvider': 'Какая платформа',
  'web.connection.connect.permissionHeading': 'Что Relay попросит у {provider}',
  'web.connection.connect.requirementHeading': 'Прежде чем продолжить',
  'web.connection.connect.continue': 'Продолжить {provider}',
  'web.connection.connect.handoffNote':
    'Следующий экран, {provider}, а не Relay. Relay никогда не видит ваш пароль.',
  'web.connection.connect.noWriteWithoutApproval':
    'Подключение аккаунта ничего не публикует. Каждое сообщение по-прежнему соответствует этой политике одобрения рабочей области.',

  'web.connection.requirement.instagram':
    'Для публикации Instagram требуется профессиональная учетная запись, то есть учетная запись компании или автора, связанная со страницей Facebook.',
  'web.connection.requirement.facebook':
    'Relay публикует данные в Facebook Pages. Личный профиль не может быть целью публикации.',
  'web.connection.requirement.linkedin':
    'Чтобы публиковать материалы для организации, вам нужна роль администратора контента на этой странице LinkedIn.',
  'web.connection.requirement.youtube':
    'Пока Google не завершит аудит приложения, загрузки из этого проекта публикуются как частные. Впоследствии вы можете изменить видимость на YouTube.',
  'web.connection.requirement.tiktok':
    'TikTok требует, чтобы вы самостоятельно выбирали аудиторию для каждого поста. Relay не может заранее выбрать один из них.',
  'web.connection.requirement.x':
    'X взимает плату за операцию. Публикация, содержащая URL-адрес, стоит дороже, чем обычная текстовая публикация, и ее оценка отображается перед планированием.',
  'web.connection.requirement.threads':
    'Публикация Threads использует учетную запись, связанную с вашей профессиональной учетной записью Instagram.',
  'web.connection.requirement.bluesky':
    'Bluesky подключается с помощью пароля приложения, созданного в настройках Bluesky, а не пароля вашей учетной записи.',
  'web.connection.requirement.generic':
    'Вам необходимо разрешение на публикацию сообщений в этом аккаунте с самой платформы. Relay не может его предоставить.',

  'web.connection.purpose.publish': 'Публикация запланированных вами публикаций в Relay.',
  'web.connection.purpose.readPosts':
    'Перечитывая опубликованное сообщение Relay, можно подтвердить, что квитанция существует.',
  'web.connection.purpose.identity':
    'Отображение точного имени учетной записи в Relay, чтобы вы никогда не публиковали неправильный аккаунт.',
  'web.connection.purpose.analytics':
    'Чтение показателей, которые эта платформа сообщает для ваших собственных публикаций.',
  'web.connection.purpose.refresh':
    'Поддержание доступа, чтобы запланированная публикация не вышла из строя в одночасье.',
  'web.connection.purpose.chooseDestination':
    'Перечисление страниц и каналов, которые вы можете выбрать в качестве цели публикации.',

  'web.connection.permissions.title': 'Разрешения на {account}',
  'web.connection.permissions.scopeColumn': 'Разрешение',
  'web.connection.permissions.stateColumn': 'Государство',
  'web.connection.permissions.purposeColumn': 'Для чего Relay его использует',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {отсутствует # разрешения} few {отсутствует # разрешения} many {отсутствует # разрешения} other {отсутствует # разрешения}}. Повторно подключитесь и примите его, чтобы восстановить функции, указанные ниже.',
  'web.connection.permissions.snapshot': 'Чтение из {provider} {relativeTime}',

  'web.connection.capability.title': 'Матрица возможностей',
  'web.connection.capability.subtitle':
    'Создано на основе определений соединителей с поддержкой версий в этой сборке, а затем проверяется вручную. Это те же данные, которые используют композитор и страница общедоступных возможностей.',
  'web.connection.capability.tableLabel': 'Возможности по платформам',
  'web.connection.capability.featureColumn': 'Возможность',
  'web.connection.capability.legendTitle': 'Как это прочитать',
  'web.connection.capability.legend.supported':
    'Relay может сделать это сегодня для подключенной учетной записи нужного типа.',
  'web.connection.capability.legend.not_implemented':
    'Платформа предлагает это, но Relay еще не создала ее. Это указано в дорожной карте разъема.',
  'web.connection.capability.legend.unsupported':
    'Платформа не предлагает этого через свой официальный API, поэтому ни один инструмент не может сделать это безопасно.',
  'web.connection.capability.legend.requires_review':
    'Встроено, и платформа предоставляет его только после проверки приложения или учетной записи.',
  'web.connection.capability.versionLabel': 'Определения соединителей',
  'web.connection.capability.version': 'Версия определений разъема {version}',
  'web.connection.capability.observedAt': 'Чтение снимка {relativeTime}',
  'web.connection.capability.forAccount': 'Показано для {account}',
  'web.connection.capability.noSnapshot':
    'Для этого аккаунта пока нет снимка возможностей. Подключитесь повторно, чтобы прочитать его.',
  'web.connection.capability.cellLabel': '{feature} на {provider}: {state}',

  'web.connection.group.title': 'Группы клиентов',
  'web.connection.group.listLabel': 'Группы клиентов',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Нет аккаунтов} one {# аккаунта} few {# аккаунтов} many {# аккаунтов} other {# аккаунтов}}',
  'web.connection.group.create': 'Создать группу',
  'web.connection.group.nameLabel': 'Название группы',
  'web.connection.group.namePlaceholder': 'Акме ЕС',
  'web.connection.group.moveTitle': 'Переместить {account}',
  'web.connection.group.moveLabel': 'Перейти к',
  'web.connection.group.moveConfirm': 'Переместить аккаунт',
  'web.connection.group.movedAnnouncement': '{account} перемещен в {group}.',
  'web.connection.group.filterCalendarHint':
    'Группа фильтрует календарь и аналитику. При перемещении учетной записи сохраняются все сообщения, квитанции и показатели, которые у нее уже есть.',
  'web.connection.group.empty.title': 'Пока нет групп клиентов',
  'web.connection.group.empty.body':
    'Группа, это клиент или бренд. Группируйте учетные записи для фильтрации календаря и аналитики по клиентам.',

  'web.connection.incident.title': 'Этот аккаунт требует внимания',
  'web.connection.incident.remediationHeading': 'Что делать?',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# запланированное сообщение приостановлено} few {# запланированное сообщение приостановлено} many {# запланированное сообщение приостановлено} other {# запланированное сообщение приостановлено}} для этого аккаунта.',
  'web.connection.incident.nothingLost': 'Ничего не потеряно и ничего не дублируется.',
} as const;
