/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Календар',
  'calendar.view.day': 'День',
  'calendar.view.week': 'тиждень',
  'calendar.view.month': 'місяць',
  'calendar.view.list': 'Список',
  'calendar.view.label': 'Перегляд календаря',
  'calendar.today': 'Сьогодні',
  'calendar.goToDate': 'Переходьте на побачення',
  'calendar.previousPeriod': 'Попередній період',
  'calendar.nextPeriod': 'Наступний період',
  'calendar.timeZoneNote': 'Час показано в {timeZone}.',
  'calendar.weekOf': 'Тиждень {date}',
  'calendar.dayHeading': '{weekday},{date}',
  'calendar.slotCount':
    '{count, plural, =0 {Нічого не заплановано} one {# пост} few {# пости} many {# пости} other {# пости}}',
  'calendar.slotOverflow':
    '{count, plural, one {# більше} few {# більше} many {# більше} other {# більше}}',
  'calendar.newPostAt': 'Нова публікація на {time}',

  'calendar.filter.project': 'Project',
  'calendar.filter.account': 'Обліковий запис',
  'calendar.filter.platform': 'Платформа',
  'calendar.filter.status': 'Статус',
  'calendar.filter.locale': 'Мова змісту',
  'calendar.filter.campaign': 'Кампанія',
  'calendar.filter.applied':
    '{count, plural, one {# застосовано фільтр} few {# застосованих фільтрів} many {# застосованих фільтрів} other {# застосованих фільтрів}}',

  'calendar.drag.instructions':
    'Перетягніть публікацію в новий слот або виберіть її та перемістіть за допомогою клавіш зі стрілками.',
  'calendar.drag.confirmTitle': 'Перемістити цю публікацію?',
  'calendar.drag.confirmBody': 'Від {from} до {to} в {timeZone}.',
  'calendar.drag.dstNotice':
    'Годинники переходять між цими часами в {timeZone}. Новий час є {utc} UTC.',
  'calendar.drag.publishedNotice':
    'Ця публікація вже опублікована. Переміщення змінює лише локальний запис. Повторна публікація – окрема дія.',
  'calendar.drag.conflictNotice':
    '{account} вже має {count, plural, one {# пост} few {# пости} many {# пости} other {# пости}} протягом години після нового часу.',

  'calendar.queue.title': 'Черга',
  'calendar.queue.upcoming': 'Майбутні',
  'calendar.queue.needsApproval': 'Очікування затвердження',
  'calendar.queue.drafts': 'Чернетки',
  'calendar.queue.published': 'Опубліковано',
  'calendar.queue.failed': 'Не вдалося',
  'calendar.queue.nextSlot': 'Наступний вільний слот {time}.',

  'calendar.post.publishesAt': 'Публікує {time} в {timeZone}',
  'calendar.post.publishedAt': 'Опубліковано {time}',
  'calendar.post.targetCount':
    '{count, plural, one {# рахунок} few {# облікові записи} many {# облікові записи} other {# облікові записи}}',
  'calendar.post.mediaType.text': 'текст',
  'calendar.post.mediaType.image': 'Зображення',
  'calendar.post.mediaType.carousel': 'Карусель',
  'calendar.post.mediaType.video': 'відео',
  'calendar.post.mediaType.document': 'документ',

  'actionCenter.title': 'Центр дій',
  'actionCenter.description': 'Все, що потребує рішення або виправлення, в одній черзі.',
  'actionCenter.empty': 'Зараз нічого не потребує уваги.',
  'actionCenter.item.connectionExpiring':
    '{account} потрібно повторно підключити раніше {date} або заплановані публікації не вдасться.',
  'actionCenter.item.connectionActionRequired':
    '{account} потребує уваги {provider} перш ніж можна його буде опублікувати знову.',
  'actionCenter.item.validationFailed': 'Чернетка для {account} не проходить {provider} перевірка.',
  'actionCenter.item.approvalOverdue': 'Відтодікується очікується запит на схвалення {date}.',
  'actionCenter.item.scheduleConflict': '{account} має публікації, заплановані поруч {date}.',
  'actionCenter.item.providerIncident':
    '{provider} повідомте про проблему. Запланована публікація буде повторено.',
  'actionCenter.item.commentFailed':
    'Основний допис опубліковано, але додатковий пункт для {account} не відвід.',
  'actionCenter.item.analyticsStale': 'Аналітика для {account} не оновлювався з тих пір {date}.',
  'actionCenter.item.rssStalled': 'Корм {name} з тих пір не повертається дійсний товар {date}.',
  'actionCenter.item.webhookFailing':
    'Поставки до {endpoint} зазнали невдачі {count, plural, one {# час} few {# разів} many {# разів} other {# разів}} підряд.',
  'actionCenter.item.usageBalance':
    'Дозована дія для {provider} перед запуском потрібен баланс використання.',

  'approval.title': 'Дозволи',
  'approval.requestTitle': 'Запит на схвалення',
  'approval.requestedBy': 'Запит від {name} {relativeTime}',
  'approval.requestedFrom': 'Очікування {name}',
  'approval.policy.none': 'Для цих цілей схвалення не потрібне.',
  'approval.policy.anyApprover': 'Будь-хто, хто затверджує, може це схвалити.',
  'approval.policy.namedApprover': '{name} має схвалити це.',
  'approval.policy.everyApprover': 'Кожен затверджувач повинен це схвалити.',
  'approval.decision.approvedBy': 'Затверджено {name} на {date}',
  'approval.decision.rejectedBy': 'Відхилено {name} на {date}',
  'approval.decision.changesRequestedBy': 'Зміни запитує {name} на {date}',
  'approval.comment.label': 'Примітка для автора',
  'approval.comment.placeholder': 'Скажіть, що потрібно змінити і чому.',
  'approval.reapproval.needed':
    'Ця публікація змінилася після затвердження. Перш ніж його можна буде опублікувати, його потрібно повторно схвалити.',
  'approval.reapproval.reason.content': 'Зміст змінився.',
  'approval.reapproval.reason.account': 'Цільові облікові записи змінено.',
  'approval.reapproval.reason.media': 'ЗМІ змінилися.',
  'approval.reapproval.reason.schedule': 'Змінено час публікації.',
  'approval.reapproval.reason.privacy':
    'Налаштування конфіденційності або розкриття інформації змінено.',
  'approval.reapproval.reason.locale': 'Змінено мову контенту.',
  'approval.expiresAt': 'Термін дії цього запиту завершується {date}.',
} as const;
