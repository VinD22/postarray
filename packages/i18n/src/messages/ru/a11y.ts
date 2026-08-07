/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Основная навигация',
  'a11y.region.breadcrumb': 'Навигационная цепочка',
  'a11y.region.main': 'Основное содержание',
  'a11y.region.composer': 'Composer',
  'a11y.region.preview': 'Предварительный просмотр',
  'a11y.region.validation': 'Проблемы с проверкой',
  'a11y.region.targets': 'Целевые аккаунты',
  'a11y.region.notifications': 'Уведомления',

  'a11y.announce.saved': 'Черновик сохранен.',
  'a11y.announce.saving': 'Сохранение черновика',
  'a11y.announce.saveFailed': 'Не удалось сохранить черновик. Ваш текст все еще здесь.',
  'a11y.announce.offline': 'Вы не в сети. Изменения сохраняются на этом устройстве.',
  'a11y.announce.online': 'Вернуться в онлайн',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Нет проблем с проверкой} one {# проблем с проверкой} few {# проблем с проверкой} many {# проблем с проверкой} other {# проблем с проверкой}}',
  'a11y.announce.validationCleared': 'Все проблемы с проверкой решены',
  'a11y.announce.targetSelected':
    '{account} выбран. Всего {count, plural, one {# цель} few {# цели} many {# целей} other {# цели}}.',
  'a11y.announce.targetOverridden': 'У {account} теперь есть своя версия.',
  'a11y.announce.targetReset': '{account} сброс до основного черновика',
  'a11y.announce.uploadProgress': '{name}, {percent} загружено',
  'a11y.announce.uploadComplete': '{name} загружено',
  'a11y.announce.uploadFailed': '{name} не удалось загрузить.',
  'a11y.announce.scheduled': 'Запланировано для {time} в {timeZone}',
  'a11y.announce.rescheduled': 'Перемещен в {time} в {timeZone}.',
  'a11y.announce.publishing': 'Публикация',
  'a11y.announce.published':
    '{count, plural, one {Опубликовано в # аккаунте} few {Опубликовано в # аккаунте} many {Опубликовано в # аккаунте} other {Опубликовано в # аккаунте}}',
  'a11y.announce.publishPartial':
    'Опубликовано в аккаунтах {published} из {total}. {failed, plural, one {# аккаунта требует внимания} few {# аккаунта требует внимания} many {# аккаунта требует внимания} other {# аккаунта требует внимания}}.',
  'a11y.announce.publishFailed': 'Публикация не удалась. Ваш контент сохраняется.',
  'a11y.announce.approvalRequested': 'Запрошено одобрение от {approver}.',
  'a11y.announce.approved': 'Утверждено',
  'a11y.announce.connectionAdded': '{account} подключен',
  'a11y.announce.connectionRemoved': '{account} отключен',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Фильтры очищены} one {# фильтр применен} few {# применено фильтров} many {# применено фильтров} other {# применено фильтров}}, {results, plural, one {# результат} few {# результатов} many {# результатов} other {# результатов}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Скопировано в буфер обмена',
  'a11y.announce.suggestionApplied': 'Предложение применено',
  'a11y.announce.suggestionRejected': 'Предложение отклонено',

  'a11y.label.closeDialog': 'Закрыть диалог',
  'a11y.label.openMenu': 'Открыть меню',
  'a11y.label.sortBy': 'Сортировать по {field}',
  'a11y.label.sortAscending': 'Сортировка по возрастанию',
  'a11y.label.sortDescending': 'Сортировка по убыванию',
  'a11y.label.removeTarget': 'Удалить {account} из целей',
  'a11y.label.removeMedia': 'Удалить {name}',
  'a11y.label.editAltText': 'Изменить альтернативный текст для {name}.',
  'a11y.label.mediaPreview': 'Предварительный просмотр {name}',
  'a11y.label.playVideo': 'Играть в {name}',
  'a11y.label.pauseVideo': 'Пауза {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {ничего не запланировано} one {# сообщений} few {# сообщений} many {# сообщений} other {# сообщений}}',
  'a11y.label.postSummary': '{account} на {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} из использованных символов {limit}',
  'a11y.label.requiredField': 'Требуется',
  'a11y.label.externalLink': 'Открывается в новой вкладке',
  'a11y.label.loadingRegion': 'Загрузка контента',
  'a11y.label.expandRow': 'Показать детали для {name}',
  'a11y.label.collapseRow': 'Скрыть детали для {name}',
  'a11y.languagePicker.label': 'Выберите язык интерфейса',
  'a11y.languagePicker.filterLabel': 'Фильтровать языки',
  'a11y.languagePicker.announceChanged': 'Язык интерфейса изменен на {language}.',

  'a11y.keyboard.hint.calendar':
    'Используйте клавиши со стрелками для перемещения между слотами. Нажмите Enter, чтобы открыть сообщение. Нажмите пробел, затем клавиши со стрелками, чтобы перенести встречу.',
  'a11y.keyboard.hint.composer':
    'Нажмите Control и клавиши скобок, чтобы перемещаться между целями. Нажмите Control и I, чтобы перейти к следующему выпуску.',
  'a11y.keyboard.hint.dialog': 'Нажмите Escape, чтобы закрыть.',
  'a11y.keyboard.shortcutsTitle': 'Сочетания клавиш',

  'a11y.table.alternative': 'Вид таблицы',
  'a11y.table.alternativeHint': 'Тот же график, что и сортируемая таблица.',
  'a11y.motion.reduced': 'Анимации уменьшены из-за настроек вашей системы.',
} as const;
