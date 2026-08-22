/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Агенти та API',
  'developer.subtitle':
    'Сервер API, MCP і CLI використовують ті самі дозволи, політику затвердження та квитанції, що й програма.',

  'developer.serviceAccount.title': 'Сервісні облікові записи',
  'developer.serviceAccount.create': 'Створіть обліковий запис служби',
  'developer.serviceAccount.name': "Ім'я",
  'developer.serviceAccount.scopeProjects':
    'Проекти та облікові записи, які він може використовувати',
  'developer.serviceAccount.scopePlatforms': 'Платформи',
  'developer.serviceAccount.scopeLocales': 'Мови вмісту',
  'developer.serviceAccount.scopeDomains': 'Дозволені домени посилань',
  'developer.serviceAccount.scopeHours': 'Дозволені години',
  'developer.serviceAccount.scopeCadence': 'Максимальна кількість публікацій на день',
  'developer.serviceAccount.scopeLookAhead': 'Як далеко вперед це може бути заплановано',
  'developer.serviceAccount.approvalLevel': 'Рівень затвердження',
  'developer.serviceAccount.killSwitch': 'Зупиніть цього агента',

  'developer.approvalLevel.0': 'Тільки читати та перевіряти',
  'developer.approvalLevel.1': 'Створення та редагування чернеток',
  'developer.approvalLevel.2': 'Розклад у межах, встановлених вище',
  'developer.approvalLevel.3': 'Запитайте людину перед публікацією',
  'developer.approvalLevel.description.0':
    'Агент може переглядати облікові записи, можливості, календарі та аналітику. Це нічого не змінює.',
  'developer.approvalLevel.description.1':
    'Агент може писати чернетки. Людина все одно планує та публікує.',
  'developer.approvalLevel.description.2':
    'Агент може планувати в межах установлених облікових записів, годин, частоти, мов, доменів і прогнозувати наперед. Все, що виходить за ці межі, потребує людини.',
  'developer.approvalLevel.description.3':
    'Негайна публікація, новий обліковий запис або домен, масова дія, конфіденційний вміст або зміна налаштувань конфіденційності завжди потребують чіткого підтвердження від особи.',
  'developer.bulkThreshold':
    'Насип означає більше ніж {publications, plural, one {# зовнішня публікація} few {# зовнішні видання} many {# зовнішні видання} other {# зовнішні видання}} в одному запиті, або той самий вміст для більш ніж {accounts, plural, one {# рахунок} few {# облікові записи} many {# облікові записи} other {# облікові записи}}.',

  'developer.credential.title': 'Облікові дані',
  'developer.credential.create': 'Створіть ключ API',
  'developer.credential.shownOnce':
    'Цей обліковий запис відображається один раз. Скопіюйте зараз. Ми зберігаємо лише його хеш.',
  'developer.credential.prefix': 'Префікс',
  'developer.credential.created': 'Створено {date} за{name}',
  'developer.credential.lastUsed': 'Останнє використання{relativeTime}',
  'developer.credential.neverUsed': 'Ніколи не використовувався',
  'developer.credential.expires': 'Термін дії завершується{date}',
  'developer.credential.revokeConfirm':
    'Відкликати ці облікові дані? Все, що використовує його, негайно перестає працювати.',

  'developer.scope.title': 'Області застосування',
  'developer.scope.accountsRead': 'Читайте підключені облікові записи та їхні можливості',
  'developer.scope.draftsWrite': 'Створення та редагування чернеток',
  'developer.scope.postsSchedule': 'Заплануйте схвалений вміст',
  'developer.scope.postsPublish': 'Опублікувати негайно',
  'developer.scope.analyticsRead': 'Читайте аналітику',
  'developer.scope.receiptsRead': 'Читайте квитанції про публікацію',
  'developer.scope.webhooksWrite': 'Керуйте веб-хуками',
  'developer.scope.connectionsAdmin': 'Підключення та відключення облікових записів',
  'developer.scope.billingRead': 'Прочитати платіжний стан',
  'developer.scope.consequential': 'Наслідковий',
  'developer.scope.readOnly': 'Тільки для читання',

  'developer.setup.title': 'Підключіть клієнта',
  'developer.setup.claudeCode': 'Клод Код',
  'developer.setup.codex': 'Кодекс',
  'developer.setup.hermes': 'Гермес',
  'developer.setup.buzz': 'Робочий процес Buzz',
  'developer.setup.cli': 'CLI',
  'developer.setup.genericMcp': 'Будь-який клієнт MCP',
  'developer.setup.copyConfig': 'Копіювати конфігурацію',
  'developer.setup.mcpEndpoint': 'Кінцева точка MCP',
  'developer.setup.apiBaseUrl': 'API основа URL',

  'developer.playground.title': 'Сухий хід',
  'developer.playground.description':
    'Запуск інструментів із заповненими даними. Ніщо не досягає реальної платформи.',
  'developer.playground.run': 'бігти',
  'developer.playground.sandboxBadge': 'Пісочниця',

  'developer.activity.title': 'Остання діяльність',
  'developer.activity.toolCall': '{tool}викликав{actor} {relativeTime}',
  'developer.activity.denied': 'Відмовлено:{reason}',
  'developer.activity.empty': 'Дзвінків ще немає.',
  'developer.activity.redacted': 'Тіла запиту та відповіді зберігаються без секретів.',

  'developer.apps.title': 'Програми для розробників',
  'developer.apps.subtitle':
    'Дозвольте іншому продукту працювати через Relay із дозволами, які йому надає користувач.',
  'developer.apps.create': 'Зареєструйте додаток',
  'developer.apps.name': 'Назва програми',
  'developer.apps.type.label': 'Тип клієнта',
  'developer.apps.type.public': 'Публічний, не може зберігати таємницю',
  'developer.apps.type.confidential': 'Конфіденційно, працює на сервері',
  'developer.apps.homepage': 'Домашня сторінка URL',
  'developer.apps.privacyUrl': 'Політика конфіденційності URL',
  'developer.apps.termsUrl': 'Умови URL',
  'developer.apps.logo': 'логотип',
  'developer.apps.redirectUris': 'URI перенаправлення',
  'developer.apps.redirectUrisHelp':
    'Тільки точні збіги. Символи підстановки та часткові шляхи відхиляються.',
  'developer.apps.clientId': 'ID клієнта',
  'developer.apps.clientSecret': 'Секрет клієнта',
  'developer.apps.secretShownOnce':
    'Секрет показують один раз. Поверніть його, якщо втратите. Більше показувати не будемо.',
  'developer.apps.status.draft': 'Чернетка',
  'developer.apps.status.active': 'Активний',
  'developer.apps.status.disabled': 'Вимкнено',
  'developer.apps.consentPreview': 'Попередній перегляд екрана згоди',
  'developer.apps.grants.title': 'Активні гранти',
  'developer.apps.grants.count':
    '{count, plural, one {#грант} few {# гранти} many {# гранти} other {# гранти}}',
  'developer.apps.deleteConfirm':
    'Видалити цю програму? Кожен грант скасовується, а його маркери перестають працювати.',

  'developer.consent.title': '{app}хоче отримати доступ до свого робочого простору',
  'developer.consent.workspace': 'Workspace',
  'developer.consent.projects': 'Проекти і облікові записи',
  'developer.consent.willBeAbleTo': '{app}можете',
  'developer.consent.willNotBeAbleTo': '{app}не можете',
  'developer.consent.approvalStillApplies':
    'Ваша політика затвердження все ще діє. Цей додаток не може публікувати навколо нього.',
  'developer.consent.revokeAnyTime': 'Ви можете будь-коли скасувати це в налаштуваннях.',
  'developer.consent.allow': 'Дозволити доступ',
  'developer.consent.deny': 'Не допускати',
  'developer.consent.developerIdentity': 'Опубліковано{developer}',

  'developer.grants.title': 'Програми з доступом',
  'developer.grants.grantedOn': 'Зрозуміло{date}',
  'developer.grants.lastUsed': 'Останнє використання{relativeTime}',
  'developer.grants.revoke': 'Скасувати доступ',
  'developer.grants.revoked':
    'Доступ скасовано. Це не впливає на ваші власні зв’язки та заплановані публікації.',

  'developer.docs.openapi': 'OpenAPI документ',
  'developer.docs.clients': 'Згенеровані клієнти',
  'developer.docs.idempotency':
    'Надсилайте ключ ідемпотентності з кожним запитом на створення, планування та публікацію. Повторення запиту з тим самим ключем повертає вихідний результат замість того, щоб публікувати двічі.',
  'developer.docs.pagination':
    'Результати розбиті курсором на сторінки. Час є чітким і включає зону.',
  'developer.docs.rateLimits':
    'Обмеження швидкості застосовуються до робочої області, облікових даних, маршруту та з’єднувача.',
} as const;
