/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Календарь',
  'calendar.view.day': 'День',
  'calendar.view.week': 'неделя',
  'calendar.view.month': 'Месяц',
  'calendar.view.list': 'Список',
  'calendar.view.label': 'Просмотр календаря',
  'calendar.today': 'Сегодня',
  'calendar.goToDate': 'Перейти на свидание',
  'calendar.previousPeriod': 'Предыдущий период',
  'calendar.nextPeriod': 'Следующий период',
  'calendar.timeZoneNote': 'Время отображается в формате {timeZone}.',
  'calendar.weekOf': 'Неделя {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount':
    '{count, plural, =0 {Ничего не запланировано} one {# сообщений} few {# сообщений} many {# сообщений} other {# сообщений}}',
  'calendar.slotOverflow': '{count, plural, one {еще #} few {еще #} many {еще #} other {еще #}}',
  'calendar.newPostAt': 'Новый пост на {time}',

  'calendar.filter.brand': 'Brand',
  'calendar.filter.account': 'Аккаунт',
  'calendar.filter.platform': 'Платформа',
  'calendar.filter.status': 'Статус',
  'calendar.filter.locale': 'Язык контента',
  'calendar.filter.campaign': 'Кампания',
  'calendar.filter.applied':
    '{count, plural, one {применено # фильтра} few {применено # фильтра} many {применено # фильтра} other {применено # фильтра}}',

  'calendar.drag.instructions':
    'Перетащите сообщение в новый слот или выберите его и переместите с помощью клавиш со стрелками.',
  'calendar.drag.confirmTitle': 'Переместить этот пост?',
  'calendar.drag.confirmBody': 'От {from} до {to} в {timeZone}.',
  'calendar.drag.dstNotice':
    'Между этими моментами часы меняются в {timeZone}. Новое время, {utc} UTC.',
  'calendar.drag.publishedNotice':
    'Этот пост уже опубликован. Перемещение меняет только локальную запись. Повторная публикация, отдельное действие.',
  'calendar.drag.conflictNotice':
    '{account} уже имеет {count, plural, one {# сообщений} few {# сообщений} many {# сообщений} other {# сообщений}} в течение часа после нового времени.',

  'calendar.queue.title': 'Очередь',
  'calendar.queue.upcoming': 'Предстоящие',
  'calendar.queue.needsApproval': 'Ожидание одобрения',
  'calendar.queue.drafts': 'Черновики',
  'calendar.queue.published': 'Опубликовано',
  'calendar.queue.failed': 'Не удалось',
  'calendar.queue.nextSlot': 'Следующий бесплатный слот, {time}.',

  'calendar.post.publishesAt': 'Публикует {time} в {timeZone}.',
  'calendar.post.publishedAt': 'Опубликовано {time}',
  'calendar.post.targetCount':
    '{count, plural, one {# аккаунта} few {# аккаунта} many {# аккаунта} other {# аккаунта}}',
  'calendar.post.mediaType.text': 'Текст',
  'calendar.post.mediaType.image': 'Изображение',
  'calendar.post.mediaType.carousel': 'Карусель',
  'calendar.post.mediaType.video': 'Видео',
  'calendar.post.mediaType.document': 'Документ',

  'actionCenter.title': 'Центр действий',
  'actionCenter.description': 'Все, что требует решения или исправления, в одной очереди.',
  'actionCenter.empty': 'Ничто сейчас не требует внимания.',
  'actionCenter.item.connectionExpiring':
    '{account} необходимо повторно подключить, прежде чем {date} или запланированные публикации не будут выполнены.',
  'actionCenter.item.connectionActionRequired':
    '{account} требует внимания к {provider}, прежде чем он сможет снова публиковаться.',
  'actionCenter.item.validationFailed':
    'Черновой вариант {account} не проходит проверку {provider}.',
  'actionCenter.item.approvalOverdue': 'Запрос на одобрение ожидает с момента {date}.',
  'actionCenter.item.scheduleConflict':
    'Публикации {account} запланированы слишком близко друг к другу на {date}.',
  'actionCenter.item.providerIncident':
    '{provider} сообщает о проблеме. Запланированные публикации будут повторены.',
  'actionCenter.item.commentFailed':
    'Основной пост опубликован, но последующий пост для {account} не выполнен.',
  'actionCenter.item.analyticsStale': 'Аналитика для {account} не обновлялась с момента {date}.',
  'actionCenter.item.rssStalled':
    'Канал {name} не возвращал действительный элемент с момента {date}.',
  'actionCenter.item.webhookFailing':
    'Доставка на адрес {endpoint} не удалась. {count, plural, one {# раз} few {# раз} many {# раз} other {# раз}} подряд.',
  'actionCenter.item.usageBalance':
    'Перед запуском дозированного действия для {provider} требуется баланс использования.',

  'approval.title': 'Разрешения',
  'approval.requestTitle': 'Запрос на одобрение',
  'approval.requestedBy': 'По запросу {name} {relativeTime}',
  'approval.requestedFrom': 'Ожидание {name}',
  'approval.policy.none': 'Для этих целей одобрение не требуется.',
  'approval.policy.anyApprover': 'Любой утверждающий может это одобрить.',
  'approval.policy.namedApprover': '{name} должен это одобрить.',
  'approval.policy.everyApprover': 'Каждый утверждающий должен это одобрить.',
  'approval.decision.approvedBy': 'Утверждено {name} на {date}',
  'approval.decision.rejectedBy': 'Отклонено {name} на {date}',
  'approval.decision.changesRequestedBy': 'Изменения, запрошенные {name} на {date}',
  'approval.comment.label': 'Примечание для автора',
  'approval.comment.placeholder': 'Скажите, что нужно изменить и почему.',
  'approval.reapproval.needed':
    'Это сообщение было изменено после одобрения. Прежде чем его можно будет опубликовать, ему необходимо еще раз получить одобрение.',
  'approval.reapproval.reason.content': 'Содержание изменилось.',
  'approval.reapproval.reason.account': 'Целевые аккаунты изменились.',
  'approval.reapproval.reason.media': 'СМИ изменились.',
  'approval.reapproval.reason.schedule': 'Время публикации изменилось.',
  'approval.reapproval.reason.privacy':
    'Настройки конфиденциальности или раскрытия информации изменились.',
  'approval.reapproval.reason.locale': 'Язык контента изменился.',
  'approval.expiresAt': 'Срок действия этого запроса истекает {date}.',
} as const;
