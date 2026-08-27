/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'Соединения',
  'connection.subtitle':
    'Учетные записи, страницы и каналы, в которых может публиковаться это рабочее пространство.',
  'connection.add': 'Подключить аккаунт',
  'connection.count':
    '{used, plural, one {# активных каналов} few {# активных каналов} many {# активных каналов} other {# активных каналов}} из {limit}',
  'connection.limitReached':
    'В этом рабочем пространстве используются все каналы {limit}. Отключите один перед подключением другого.',

  'connection.account.label': 'Аккаунт',
  'connection.account.type.profile': 'Профиль',
  'connection.account.type.page': 'Страница',
  'connection.account.type.channel': 'Канал',
  'connection.account.type.group': 'Группа',
  'connection.account.type.organization': 'Организация',
  'connection.account.type.business': 'Бизнес-аккаунт',
  'connection.account.type.creator': 'Аккаунт создателя',
  'connection.connectedBy': 'Подключено пользователем {name} на {date}',
  'connection.lastPublished': 'Последняя публикация {relativeTime}',
  'connection.lastPublishedNever': 'С этого аккаунта пока ничего не опубликовано',
  'connection.lastAnalyticsSync': 'Аналитика синхронизирована {relativeTime}',

  'connection.status.healthy': 'Работаю',
  'connection.status.expiringSoon': 'Срок действия истекает {relativeTime}',
  'connection.status.expired': 'Срок доступа истек',
  'connection.status.revoked': 'Доступ отозван',
  'connection.status.paused': 'Приостановлено',
  'connection.status.permissionMissing': 'Отсутствует разрешение',
  'connection.status.reviewPending': 'Ожидание обзора платформы',
  'connection.status.unknown': 'Здоровье недоступно',

  'connection.token.expiresAt': 'Срок доступа истекает {date}',
  'connection.token.expiryUnknown':
    '{provider} не сообщает нам, когда истечет срок действия этого доступа.',

  'connection.permissions.title': 'Разрешения',
  'connection.permissions.granted': 'Предоставлено',
  'connection.permissions.missing': 'Не предоставлено',
  'connection.permissions.explainBeforeOAuth':
    'Post Array запросит эти разрешения у {provider}. Вы можете отключиться в любой момент.',
  'connection.permissions.whyNeeded': 'Зачем это нужно',

  'connection.reconnect.title': 'Переподключить {account}',
  'connection.reconnect.body':
    'Запланированные публикации для этого аккаунта приостановлены до тех пор, пока он не будет повторно подключен. Ничего не потеряно.',
  'connection.disconnect.title': 'Отключить {account}?',
  'connection.disconnect.body':
    'Запланированные публикации для этого аккаунта не будут публиковаться. Уже собранные квитанции и аналитика остаются в этой рабочей области.',
  'connection.pause.body':
    'Приостановленная учетная запись сохраняет свою историю и расписание, но не публикуется, пока вы не возобновите ее.',

  'connection.incident.invalidToken':
    '{provider} отклонил сохраненный доступ для {account}. Подключитесь повторно, чтобы восстановить публикацию.',
  'connection.incident.permissionLost':
    '{account} больше не дает {permission}. Переподключитесь и примите это разрешение.',
  'connection.incident.roleLost':
    'Ваш пользователь {provider} больше не имеет роли в {account}. Попросите администратора этой страницы восстановить ее.',
  'connection.incident.accountTypeInvalid':
    'Instagram нужен профессиональный аккаунт. Переключите {account} на бизнес-аккаунт или аккаунт создателя, а затем повторно подключитесь.',
  'connection.incident.reviewRestricted':
    '{provider} ограничил это приложение до рассмотрения. Сообщения от {account} публикуются конфиденциально до завершения проверки.',

  'connection.group.title': 'Группы клиентов',
  'connection.group.description':
    'Группируйте учетные записи по клиентам или проектам, чтобы фильтровать каждый экран.',
  'connection.group.assign': 'Перейти в группу',
  'connection.group.none': 'Разгруппировано',
  'connection.group.moveNote':
    'При перемещении аккаунта сохраняются его публикации, квитанции и аналитика.',

  'connection.oauth.starting': 'Открытие {provider}',
  'connection.oauth.returned': 'Завершение подключения',
  'connection.oauth.chooseAccounts': 'Выберите, какие аккаунты подключать',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'Никакие учетные записи с этим логином {provider} не могут быть подключены. {reason}',
  'connection.oauth.canceled': 'Соединение было отменено на {provider}. Ничего не изменилось.',
  'connection.oauth.alreadyConnected': '{account} уже подключен к этой рабочей области.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} подключен к другой рабочей области. Сначала отключите его там.',

  'capability.title': 'Что поддерживает этот аккаунт',
  'capability.matrix.title': 'Возможности платформы',
  'capability.matrix.subtitle':
    'Создается на основе определений разъемов, которые мы поддерживаем и проверяем вручную.',
  'capability.level.supported': 'Поддерживается',
  'capability.level.unsupported': 'Не предлагается платформой',
  'capability.level.not_implemented': 'Еще не построен',
  'capability.level.requires_review': 'Требуется проверка платформы',
  'capability.level.beta': 'Бета',
  'capability.level.unknown': 'Недоступно',
  'capability.explain.supported': 'Post Array может сделать это для этой учетной записи сегодня.',
  'capability.explain.unsupported':
    '{provider} не предлагает этого через свой официальный API, поэтому ни один инструмент не может сделать это безопасно.',
  'capability.explain.not_implemented':
    '{provider} предлагает это, но Post Array еще не создал его. Это указано в дорожной карте разъема.',
  'capability.explain.requires_review':
    '{provider} предоставляет это только после проверки приложения или учетной записи. Он останется недоступным до тех пор, пока не пройдет проверка.',
  'capability.explain.beta':
    'Это работает, но с ограничениями, которые мы еще не закончили проверять. Проверьте результат, прежде чем полагаться на него.',
  'capability.explain.unknown':
    'Нам не удалось прочитать текущие разрешения для этой учетной записи. Подключитесь повторно, чтобы обновить их.',
  'capability.lastChecked': 'Проверено {relativeTime}',
  'capability.feature.text': 'Текстовые сообщения',
  'capability.feature.image': 'Изображения',
  'capability.feature.carousel': 'Карусели',
  'capability.feature.video': 'Видео',
  'capability.feature.document': 'Документы',
  'capability.feature.firstComment': 'Запланированный первый комментарий',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'Родные упоминания',
  'capability.feature.destinations': 'Выбор пункта назначения',
  'capability.feature.privacy': 'Контроль конфиденциальности',
  'capability.feature.thumbnail': 'Пользовательский значок',
  'capability.feature.altText': 'Альтернативный текст',
  'capability.feature.analytics': 'Аналитика',
  'capability.feature.delete': 'Удаление опубликованного сообщения',
  'capability.feature.commentCount': 'Комментарии учитываются',
  'capability.feature.commentReplies': 'Чтение и ответы на комментарии',
  'capability.feature.disclosure': 'Раскрытие информации об автоматизации',
} as const;
