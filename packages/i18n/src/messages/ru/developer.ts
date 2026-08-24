/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Агенты и API',
  'developer.subtitle':
    'API, сервер MCP и интерфейс командной строки используют те же разрешения, политику утверждения и квитанции, что и приложение.',

  'developer.serviceAccount.title': 'Сервисные аккаунты',
  'developer.serviceAccount.create': 'Создать учетную запись службы',
  'developer.serviceAccount.name': 'Имя',
  'developer.serviceAccount.scopeProjects':
    'Проекты и учетные записи, которые он может использовать',
  'developer.serviceAccount.scopePlatforms': 'Платформы',
  'developer.serviceAccount.scopeLocales': 'Языки контента',
  'developer.serviceAccount.scopeDomains': 'Разрешенные домены ссылок',
  'developer.serviceAccount.scopeHours': 'Разрешенные часы',
  'developer.serviceAccount.scopeCadence': 'Максимальное количество постов в день',
  'developer.serviceAccount.scopeLookAhead': 'Насколько далеко вперед он может запланировать',
  'developer.serviceAccount.approvalLevel': 'Уровень одобрения',
  'developer.serviceAccount.killSwitch': 'Остановите этого агента',

  'developer.approvalLevel.0': 'Только читать и проверять',
  'developer.approvalLevel.1': 'Создание и редактирование черновиков',
  'developer.approvalLevel.2': 'Расписание в пределах, установленных выше',
  'developer.approvalLevel.3': 'Спросите человека перед публикацией',
  'developer.approvalLevel.description.0':
    'Агент может просматривать учетные записи, возможности, календари и аналитику. Это ничего не меняет.',
  'developer.approvalLevel.description.1':
    'Агент может писать черновики. Человек все еще планирует и публикует.',
  'developer.approvalLevel.description.2':
    'Агент может планировать работу в соответствии с заданными вами учетными записями, часами, частотой кадров, языками, доменами и прогнозировать заранее. Все, что выходит за эти пределы, нуждается в человеке.',
  'developer.approvalLevel.description.3':
    'Немедленная публикация, новая учетная запись или домен, массовое действие, конфиденциальный контент или изменение настроек конфиденциальности всегда требуют явного подтверждения от человека.',
  'developer.bulkThreshold':
    'Массовая рассылка означает более чем {publications, plural, one {# внешней публикации} few {# внешних публикаций} many {# внешних публикаций} other {# внешних публикаций}} в одном запросе или один и тот же контент для более чем {accounts, plural, one {# аккаунта} few {# аккаунтов} many {# аккаунтов} other {# аккаунтов}}.',

  'developer.credential.title': 'Полномочия',
  'developer.credential.create': 'Создайте ключ API',
  'developer.credential.shownOnce':
    'Эти учетные данные отображаются один раз. Скопируйте его сейчас. Мы храним только его хэш.',
  'developer.credential.prefix': 'Префикс',
  'developer.credential.created': 'Создано {date} пользователем {name}',
  'developer.credential.lastUsed': 'Последнее использование {relativeTime}',
  'developer.credential.neverUsed': 'Никогда не использовался',
  'developer.credential.expires': 'Срок действия истекает {date}',
  'developer.credential.revokeConfirm':
    'Отозвать эти учетные данные? Все, что его использует, немедленно перестает работать.',

  'developer.scope.title': 'Области применения',
  'developer.scope.accountsRead':
    'Ознакомьтесь с подключенными учетными записями и их возможностями.',
  'developer.scope.draftsWrite': 'Создание и редактирование черновиков',
  'developer.scope.postsSchedule': 'Запланировать одобренный контент',
  'developer.scope.postsPublish': 'Опубликовать немедленно',
  'developer.scope.analyticsRead': 'Читать аналитику',
  'developer.scope.receiptsRead': 'Читать квитанции о публикациях',
  'developer.scope.webhooksWrite': 'Управление веб-перехватчиками',
  'developer.scope.connectionsAdmin': 'Подключать и отключать учетные записи',
  'developer.scope.billingRead': 'Чтение состояния выставления счетов',
  'developer.scope.consequential': 'Последовательный',
  'developer.scope.readOnly': 'Только чтение',

  'developer.setup.title': 'Подключить клиента',
  'developer.setup.claudeCode': 'Клод Код',
  'developer.setup.codex': 'Кодекс',
  'developer.setup.hermes': 'Гермес',
  'developer.setup.buzz': 'Рабочий процесс Живой ленты',
  'developer.setup.cli': 'интерфейс командной строки',
  'developer.setup.genericMcp': 'Любой клиент MCP',
  'developer.setup.copyConfig': 'Копировать конфигурацию',
  'developer.setup.mcpEndpoint': 'Конечная точка MCP',
  'developer.setup.apiBaseUrl': 'Базовый URL API',

  'developer.playground.title': 'Сухой пробег',
  'developer.playground.description':
    'Запускайте инструменты на основе исходных данных. Ничто не достигает реальной платформы.',
  'developer.playground.run': 'Беги',
  'developer.playground.sandboxBadge': 'Песочница',

  'developer.activity.title': 'Недавняя активность',
  'developer.activity.toolCall': '{tool} вызывает {actor} {relativeTime}',
  'developer.activity.denied': 'Отказано: {reason}',
  'developer.activity.empty': 'Звонков пока нет.',
  'developer.activity.redacted': 'Тела запросов и ответов сохраняются с удаленными секретами.',

  'developer.apps.title': 'Приложения для разработчиков',
  'developer.apps.subtitle':
    'Позвольте другому продукту действовать через Post Array с разрешениями, предоставленными ему пользователем.',
  'developer.apps.create': 'Зарегистрировать приложение',
  'developer.apps.name': 'Название приложения',
  'developer.apps.type.label': 'Тип клиента',
  'developer.apps.type.public': 'Публичный, не может хранить тайну',
  'developer.apps.type.confidential': 'Конфиденциально, работает на сервере',
  'developer.apps.homepage': 'URL-адрес домашней страницы',
  'developer.apps.privacyUrl': 'URL-адрес политики конфиденциальности',
  'developer.apps.termsUrl': 'URL-адрес Условия использования',
  'developer.apps.logo': 'Логотип',
  'developer.apps.redirectUris': 'URI перенаправления',
  'developer.apps.redirectUrisHelp':
    'Только точные совпадения. Подстановочные знаки и частичные пути отклоняются.',
  'developer.apps.clientId': 'Идентификатор клиента',
  'developer.apps.clientSecret': 'Секрет клиента',
  'developer.apps.secretShownOnce':
    'Секрет раскрывается один раз. Поверните его, если потеряете. Больше мы его показывать не будем.',
  'developer.apps.status.draft': 'Черновик',
  'developer.apps.status.active': 'Активный',
  'developer.apps.status.disabled': 'Отключено',
  'developer.apps.consentPreview': 'Предварительный просмотр экрана согласия',
  'developer.apps.grants.title': 'Активные гранты',
  'developer.apps.grants.count':
    '{count, plural, one {# гранта} few {# гранта} many {# гранта} other {# гранта}}',
  'developer.apps.deleteConfirm':
    'Удалить это приложение? Каждый грант аннулируется, а его токены перестают работать.',

  'developer.consent.title': '{app} хочет получить доступ к вашему рабочему пространству',
  'developer.consent.workspace': 'Workspace',
  'developer.consent.projects': 'Проекты и аккаунты',
  'developer.consent.willBeAbleTo': '{app} сможет',
  'developer.consent.willNotBeAbleTo': '{app} не сможет',
  'developer.consent.approvalStillApplies':
    'Ваша политика одобрения по-прежнему применяется. Это приложение не может публиковать информацию вокруг него.',
  'developer.consent.revokeAnyTime': 'Вы можете отменить это действие в настройках в любое время.',
  'developer.consent.allow': 'Разрешить доступ',
  'developer.consent.deny': 'Не разрешать',
  'developer.consent.developerIdentity': 'Опубликовано {developer}',

  'developer.grants.title': 'Приложения с доступом',
  'developer.grants.grantedOn': 'Разрешено {date}',
  'developer.grants.lastUsed': 'Последнее использование {relativeTime}',
  'developer.grants.revoke': 'Отозвать доступ',
  'developer.grants.revoked':
    'Доступ отозван. Ваши собственные связи и запланированные публикации не будут затронуты.',

  'developer.docs.openapi': 'документ OpenAPI',
  'developer.docs.clients': 'Сгенерированные клиенты',
  'developer.docs.idempotency':
    'Отправляйте ключ идемпотентности с каждым запросом на создание, планирование и публикацию. Повторение запроса с тем же ключом возвращает исходный результат вместо двойной публикации.',
  'developer.docs.pagination':
    'Результаты разбиты на страницы курсором. Время указано явно и включает зону.',
  'developer.docs.rateLimits':
    'Ограничения скорости применяются к каждому рабочему пространству, учетным данным, маршруту и соединителю.',
} as const;
