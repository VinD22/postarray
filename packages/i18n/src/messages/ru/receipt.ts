/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Квитанция о публикации',
  'receipt.subtitle': 'Что именно было опубликовано, где, когда и с чьего одобрения.',
  'receipt.target': '{account} на {provider}',
  'receipt.externalId': 'Внешний идентификатор сообщения',
  'receipt.permalink': 'Постоянная ссылка',
  'receipt.permalinkUnavailable':
    '{provider} не возвращает постоянную ссылку для этого типа сообщения.',
  'receipt.contentVersion': 'Версия контента',
  'receipt.contentHash': 'Контрольная сумма содержимого',
  'receipt.mediaVersion': 'Медиа-версия',
  'receipt.idempotencyKey': 'Ссылка на идемпотентность',
  'receipt.correlationId': 'Ссылка на корреляцию',

  'receipt.surface.label': 'Создано из',
  'receipt.surface.web': 'Веб-приложение',
  'receipt.surface.api': 'ОТДЫХ API',
  'receipt.surface.mcp': 'MCP-сервер',
  'receipt.surface.cli': 'интерфейс командной строки',
  'receipt.surface.rss': 'RSS-автопост',
  'receipt.surface.automation': 'Правило автоматизации',
  'receipt.surface.webhook': 'Входящий вебхук',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Сервисный аккаунт {name}',
  'receipt.actor.oauthApp': '{app} действует от имени {name}',
  'receipt.actor.system': 'Post Array',

  'receipt.timeline.title': 'Хронология',
  'receipt.timeline.created': 'Черновик создан {actor}',
  'receipt.timeline.approvalRequested': 'Запрошено одобрение от {approver}.',
  'receipt.timeline.approved': 'Утверждено {actor} в соответствии с политикой {policy}.',
  'receipt.timeline.scheduled': 'Запланировано для {local} в {timeZone}',
  'receipt.timeline.revalidated': 'Учетные данные и ограничения платформы перепроверены.',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# файла, подготовленного для платформы} few {# файлов, подготовленного для платформы} many {# файлов, подготовленного для платформы} other {# файлов, подготовленного для платформы}}',
  'receipt.timeline.dispatched': 'Отправлено на {provider}',
  'receipt.timeline.providerAccepted': '{provider} принял сообщение',
  'receipt.timeline.providerProcessing': '{provider} все еще обрабатывает медиафайлы.',
  'receipt.timeline.published': 'Опубликовано как {externalId}',
  'receipt.timeline.commentPublished': 'Опубликован следующий элемент {position}.',
  'receipt.timeline.retryScheduled': 'Повторить попытку {attempt} запланировано на {time}.',
  'receipt.timeline.failed': 'Попытка {attempt} не удалась.',
  'receipt.timeline.canceled': 'Отменено {actor}',
  'receipt.timeline.analyticsSynced': 'Аналитика синхронизирована',
  'receipt.timeline.deletedExternally': 'Поста больше нет на {provider}.',

  'receipt.times.scheduled': 'Запланированное время',
  'receipt.times.dispatched': 'Время отправки',
  'receipt.times.published': 'Время публикации',
  'receipt.times.latency': 'Отправлено {duration} после запланированного времени.',

  'receipt.attempts.title': 'Попытки',
  'receipt.attempts.count':
    '{count, plural, one {# попытка} few {# попытка} many {# попытка} other {# попытка}}',
  'receipt.attempts.classification': 'Классификация',
  'receipt.attempts.providerResponse': 'Ответ поставщика',
  'receipt.attempts.responseRedacted':
    'Ответ провайдера сохраняется с удалением токенов и личных данных.',
  'receipt.attempts.remediation': 'Что делать дальше',

  'receipt.cost.estimated': 'Расчетное {amount}',
  'receipt.cost.actual': 'Согласовано {amount}',
  'receipt.cost.pending': 'Фактическое использование еще не согласовано.',

  'receipt.partial.title': 'Частично опубликовано',
  'receipt.partial.body':
    '{published, plural, one {# опубликовано целевого объекта} few {# опубликовано целевого объекта} many {# опубликовано целевого объекта} other {# опубликовано целевого объекта}}. {failed, plural, one {# цель не удалось} few {# цель не удалось} many {# цель не удалось} other {# цель не удалось}}. Опубликованные посты все еще существуют на платформе.',
  'receipt.partial.doNotRollback':
    'Мы не удаляем уже опубликованный пост. Удалите его на платформе, если вы этого хотите.',

  'receipt.export.title': 'Поделиться этим чеком',
  'receipt.export.pdf': 'Скачать в формате PDF',
  'receipt.export.json': 'Скачать в формате JSON',
  'receipt.export.permissionNote':
    'Делиться квитанцией могут только владельцы, администраторы и утверждающие.',

  'receipt.analytics.lastSync': 'Последняя синхронизация аналитики {relativeTime}.',
  'receipt.analytics.nextSync': 'Следующая синхронизация вокруг {time}.',
} as const;
