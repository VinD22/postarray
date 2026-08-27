/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Квитанція про публікацію',
  'receipt.subtitle': 'Що саме було опубліковано, де, коли та з чиєї згоди.',
  'receipt.target': '{account}на{provider}',
  'receipt.externalId': 'Ідентифікатор зовнішньої публікації',
  'receipt.permalink': 'Постійне посилання',
  'receipt.permalinkUnavailable': '{provider}не повертає постійні посилання для цього типу допису.',
  'receipt.contentVersion': 'Контентна версія',
  'receipt.contentHash': 'Контрольна сума вмісту',
  'receipt.mediaVersion': 'Медіаверсія',
  'receipt.idempotencyKey': 'Посилання на ідемпотентність',
  'receipt.correlationId': 'Кореляційне посилання',

  'receipt.surface.label': 'Створено з',
  'receipt.surface.web': 'Веб-додаток',
  'receipt.surface.api': 'REST API',
  'receipt.surface.mcp': 'Сервер MCP',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'Автопост RSS',
  'receipt.surface.automation': 'Правило автоматизації',
  'receipt.surface.webhook': 'Вхідний вебхук',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Сервісний обліковий запис{name}',
  'receipt.actor.oauthApp': '{app}виступаючи за{name}',
  'receipt.actor.system': 'Post Array',

  'receipt.timeline.title': 'Хронологія',
  'receipt.timeline.created': 'Чернетку створив{actor}',
  'receipt.timeline.approvalRequested': 'Запит на схвалення від{approver}',
  'receipt.timeline.approved': 'Затверджено {actor} під полісом{policy}',
  'receipt.timeline.scheduled': 'Заплановано на {local} в{timeZone}',
  'receipt.timeline.revalidated': 'Перевірено облікові дані та обмеження платформи',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {#файл, підготовлений для платформи} few {# файли, підготовлені для платформи} many {# файли, підготовлені для платформи} other {# файли, підготовлені для платформи}}',
  'receipt.timeline.dispatched': 'Надіслано до{provider}',
  'receipt.timeline.providerAccepted': '{provider}прийняв пост',
  'receipt.timeline.providerProcessing': '{provider}все ще обробляє медіа',
  'receipt.timeline.published': 'Опубліковано як{externalId}',
  'receipt.timeline.commentPublished': 'Подальший елемент {position} опубліковано',
  'receipt.timeline.retryScheduled': 'Повторіть спробу {attempt} заплановано на{time}',
  'receipt.timeline.failed': 'Спроба {attempt} не відвід',
  'receipt.timeline.canceled': 'Скасовано{actor}',
  'receipt.timeline.analyticsSynced': 'Аналітику синхронізовано',
  'receipt.timeline.deletedExternally': 'Публікація більше не актуальна{provider}',

  'receipt.times.scheduled': 'Запланований час',
  'receipt.times.dispatched': 'Час відправлення',
  'receipt.times.published': 'Час публікації',
  'receipt.times.latency': 'Відправлено {duration} після запланованого часу.',

  'receipt.attempts.title': 'Спроби',
  'receipt.attempts.count':
    '{count, plural, one {#спроба} few {# спроби} many {# спроби} other {# спроби}}',
  'receipt.attempts.classification': 'Класифікація',
  'receipt.attempts.providerResponse': 'Відповідь провайдера',
  'receipt.attempts.responseRedacted':
    'Відповідь постачальника зберігається з вилученими маркерами та особистими даними.',
  'receipt.attempts.remediation': 'Що робити далі',

  'receipt.cost.estimated': 'Розрахункова{amount}',
  'receipt.cost.actual': 'Помирилися{amount}',
  'receipt.cost.pending': 'Фактичне використання ще не узгоджено.',

  'receipt.partial.title': 'Опубліковано частково',
  'receipt.partial.body':
    '{published, plural, one {#мета опублікована} few {# цілі опубліковані} many {# цілі опубліковані} other {# цілі опубліковані}}. {failed, plural, one {# ціль не вдалася} few {# ціли невстигли} many {# ціли невстигли} other {# ціли невстигли}}. Опубліковані публікації все ще стосується на платформі.',
  'receipt.partial.doNotRollback':
    'Ми не видаляємо вже опубліковану публікацію. Видаліть його на платформі, якщо цього хочете.',

  'receipt.export.title': 'Поділіться цією квитанцією',
  'receipt.export.pdf': 'Завантажити як PDF',
  'receipt.export.json': 'Завантажити як JSON',
  'receipt.export.permissionNote':
    'Лише власники, адміністратори та ті, хто затверджує, можуть поділитися квитанцією.',

  'receipt.analytics.lastSync': 'Analytics востаннє синхронізовано {relativeTime}.',
  'receipt.analytics.nextSync': 'Наступна синхронізація {time}.',
} as const;
