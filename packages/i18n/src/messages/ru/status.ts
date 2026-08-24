/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'Пока ничего не запланировано',
  'empty.calendar.body':
    'Напишите свой первый пост и выберите время. Вы можете изменить его позже.',
  'empty.calendar.action': 'Написать сообщение',
  'empty.drafts.title': 'Нет черновиков',
  'empty.drafts.body':
    'Здесь отображаются сохраненные вами черновики с указанием их целей и проблем.',
  'empty.connections.title': 'Нет подключенных аккаунтов',
  'empty.connections.body':
    'Подключите учетную запись для публикации в ней. Сначала мы покажем вам точные разрешения.',
  'empty.connections.action': 'Подключить аккаунт',
  'empty.analytics.title': 'Показателей пока нет',
  'empty.analytics.body':
    'Метрики появляются после того, как ваша первая публикация просуществовала достаточно долго, чтобы платформа успела отчитаться о ней.',
  'empty.analytics.noPermission':
    'Этой учетной записи не предоставлен доступ к аналитике. Подключитесь повторно, чтобы добавить его.',
  'empty.approvals.title': 'Ничего не ждет тебя',
  'empty.approvals.body': 'Здесь отображаются запросы на одобрение ваших проектов.',
  'empty.library.title': 'Ваша библиотека пуста',
  'empty.library.body':
    'Загрузите изображения и видео или импортируйте их по URL-адресу или через API.',
  'empty.library.action': 'Загрузить медиа',
  'empty.automation.title': 'Правил пока нет',
  'empty.automation.body':
    'Правило реагирует на что-то и предлагает действие. Каждое правило показывает свои пределы еще до того, как вы его включите.',
  'empty.webhooks.title': 'Нет конечных точек',
  'empty.webhooks.body':
    'Добавьте конечную точку для получения подписанных событий о публикации и подключениях.',
  'empty.searchResults.title': 'Нет результатов по запросу {query}',
  'empty.searchResults.body': 'Проверьте правильность написания или очистите фильтр.',
  'empty.filtered.title': 'Ничего не соответствует этим фильтрам',
  'empty.filtered.action': 'Очистить фильтры',
  'empty.auditLog.title': 'Пока нет активности',
  'empty.receipts.title': 'Чеков пока нет',
  'empty.receipts.body':
    'Каждая публикация содержит квитанцию, которую вы можете просмотреть и поделиться.',

  'loading.default': 'Загрузка',
  'loading.calendar': 'Загрузка календаря',
  'loading.analytics': 'Загрузка показателей',
  'loading.preview': 'Создание предварительного просмотра',
  'loading.validating': 'Проверка текущих ограничений платформы',
  'loading.publishing': 'Публикация в {provider}',
  'loading.uploading': 'Загрузка {name}',
  'loading.uploadProgress': '{percent} загружено',
  'loading.connecting': 'Подключение к {provider}',
  'loading.savingDraft': 'Сохраняем черновик',
  'loading.generatingPlan': 'Строим свой план',
  'loading.longRunning': 'Это занимает больше времени, чем обычно. Он все еще работает.',

  'offline.banner': 'Вы не в сети. Изменения сохраняются на этом устройстве.',
  'offline.draftSafe': 'Ваш черновик в безопасности. Он синхронизируется, когда вы снова в сети.',
  'offline.publishDisabled':
    'Издательство нуждается в связи. Это не будет поставлено в очередь молча.',
  'offline.scheduleQueued':
    'Этот запрос расписания поставлен в очередь на этом устройстве и будет отправлен, когда вы вернетесь в Интернет.',
  'offline.reconnected': 'Вернитесь в онлайн. Синхронизация ваших изменений.',
  'offline.syncConflict':
    'Некоторые изменения не удалось объединить автоматически. Просмотрите их перед сохранением.',

  'permission.denied.title': 'У вас нет доступа к этому',
  'permission.denied.role': 'Для этого нужна роль {role}. Вы {currentRole}.',
  'permission.denied.scope': 'Для этих учетных данных требуется область действия {scope}.',
  'permission.denied.contactOwner': 'Попросите {owner} предоставить его.',
  'permission.denied.projectScope': 'Ваш доступ ограничен {projects}.',
  'permission.readOnly': 'Эта рабочая область сейчас доступна только для чтения.',
  'permission.mfaRequired': 'Подтвердите двухфакторную аутентификацию, чтобы продолжить.',

  'rateLimit.title': 'Замедлиться на мгновение',
  'rateLimit.body': 'Вы сделали запросы {count} в {window}. Предел, {limit}.',
  'rateLimit.resetsAt': 'Это сбрасывается на {time}.',
  'rateLimit.cheaperAlternative':
    'Планирование вместо публикации теперь позволяет избежать этого ограничения.',
  'rateLimit.providerCost':
    '{provider} взимает плату за операцию. Это действие оценивается в {amount}.',

  'incident.providerDegraded':
    'У {provider} возникли проблемы. Запланированные публикации продолжают повторяться.',
  'incident.providerDown': '{provider} недоступен. Ничего не потеряно и ничего не дублируется.',
  'incident.isolated': 'Другие платформы не затронуты.',
  'incident.statusPage': 'Статус в реальном времени по разъему и поверхности',
  'incident.startedAt': 'Запущен {relativeTime}',

  'translation.incomplete':
    'Некоторый текст на этом экране еще не переведен на {language} и отображается на английском языке.',
  'translation.beta':
    'Этот язык находится в стадии бета-тестирования. Сообщайте обо всем, что читается неправильно.',

  'confirm.discardChanges.title': 'Отменить изменения?',
  'confirm.discardChanges.body': 'Это невозможно отменить.',
  'confirm.deleteItem.title': 'Удалить {name}?',
  'confirm.deleteItem.body': 'Это невозможно отменить.',
  'confirm.cancelScheduled.title': 'Отменить запланированную публикацию?',
  'confirm.cancelScheduled.body':
    'Оно не будет публиковаться. Черновик останется здесь, и вы сможете запланировать его снова.',
  'confirm.publishNow.title': 'Опубликовать сейчас?',
  'confirm.publishNow.body':
    '{count, plural, one {Это немедленно публикуется в # аккаунте} few {Это немедленно публикуется в # аккаунте} many {Это немедленно публикуется в # аккаунте} other {Это немедленно публикуется в # аккаунте}}. Его невозможно отозвать из Post Array.',
  'confirm.typeToConfirm': 'Введите {word} для подтверждения.',
} as const;
