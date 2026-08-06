/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Основна навігація',
  'a11y.region.main': 'Основний зміст',
  'a11y.region.composer': 'Composer',
  'a11y.region.preview': 'Попередній перегляд',
  'a11y.region.validation': 'Проблеми перевірки',
  'a11y.region.targets': 'Цільові облікові записи',
  'a11y.region.notifications': 'Сповіщення',

  'a11y.announce.saved': 'Чернетку збережено',
  'a11y.announce.saving': 'Збереження чернетки',
  'a11y.announce.saveFailed': 'Не вдалося зберегти чернетку. Ваш текст все ще тут.',
  'a11y.announce.offline': 'Ви офлайн. Зміни зберігаються на цьому пристрої.',
  'a11y.announce.online': 'Знову онлайн',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Немає проблем з перевіркою} one {# питання перевірки} few {# питання перевірки} many {# питання перевірки} other {# питання перевірки}}',
  'a11y.announce.validationCleared': 'Усі проблеми перевірки вирішено',
  'a11y.announce.targetSelected':
    '{account} вибрано. {count, plural, one {# мета} few {# цілі} many {# цілі} other {# цілі}} в цілому.',
  'a11y.announce.targetOverridden': '{account} тепер маєте свою версію',
  'a11y.announce.targetReset': '{account} скинути до основної чернетки',
  'a11y.announce.uploadProgress': '{name}, {percent} завантажено',
  'a11y.announce.uploadComplete': '{name} завантажено',
  'a11y.announce.uploadFailed': '{name} не відвідайте завантажити',
  'a11y.announce.scheduled': 'Заплановано на {time} в {timeZone}',
  'a11y.announce.rescheduled': 'Переїхав до {time} в {timeZone}',
  'a11y.announce.publishing': 'Видавництво',
  'a11y.announce.published':
    '{count, plural, one {Опубліковано в # рахунок} few {Опубліковано в # облікові записи} many {Опубліковано в # облікові записи} other {Опубліковано в # облікові записи}}',
  'a11y.announce.publishPartial':
    'Опубліковано в {published} з {total} облікові записи. {failed, plural, one {# обліковий запис потребує уваги} few {# облікові записи потребують уваги} many {# облікові записи потребують уваги} other {# облікові записи потребують уваги}}.',
  'a11y.announce.publishFailed': 'Помилка публікації. Ваш вміст збережено.',
  'a11y.announce.approvalRequested': 'Запит на схвалення від {approver}',
  'a11y.announce.approved': 'Затверджено',
  'a11y.announce.connectionAdded': '{account} підключений',
  'a11y.announce.connectionRemoved': '{account} відключений',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Фільтри очищені} one {# застосовано фільтр} few {# застосованих фільтрів} many {# застосованих фільтрів} other {# застосованих фільтрів}}, {results, plural, one {# результат} few {# результати} many {# результати} other {# результати}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Скопійовано в буфер обміну',
  'a11y.announce.suggestionApplied': 'Пропозицію застосовано',
  'a11y.announce.suggestionRejected': 'Пропозицію відхилено',

  'a11y.label.closeDialog': 'Закрити діалогове вікно',
  'a11y.label.openMenu': 'Відкрити меню',
  'a11y.label.sortBy': 'Сортувати за {field}',
  'a11y.label.sortAscending': 'Відсортовано за зростанням',
  'a11y.label.sortDescending': 'Відсортовано за спаданням',
  'a11y.label.removeTarget': 'видалити {account} від цілей',
  'a11y.label.removeMedia': 'видалити {name}',
  'a11y.label.editAltText': 'Редагувати альтернативний текст для {name}',
  'a11y.label.mediaPreview': 'Попередній перегляд {name}',
  'a11y.label.playVideo': 'грати {name}',
  'a11y.label.pauseVideo': 'Пауза {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {нічого не заплановано} one {# пост} few {# пости} many {# пости} other {# пости}}',
  'a11y.label.postSummary': '{account} на {provider}, {state},{time}',
  'a11y.label.characterCount': '{used} з {limit} використаних символів',
  'a11y.label.requiredField': "Обов'язковий",
  'a11y.label.externalLink': 'Відкривається в новій вкладці',
  'a11y.label.loadingRegion': 'Завантаження вмісту',
  'a11y.label.expandRow': 'Показати деталі для {name}',
  'a11y.label.collapseRow': 'Приховати деталі для {name}',
  'a11y.languagePicker.label': 'Виберіть мову інтерфейсу',
  'a11y.languagePicker.filterLabel': 'Фільтрувати мови',
  'a11y.languagePicker.announceChanged': 'Мову інтерфейсу змінено на {language}',

  'a11y.keyboard.hint.calendar':
    'Для переміщення між слотами використовуйте клавіші зі стрілками. Натисніть Enter, щоб відкрити публікацію. Натисніть пробіл, а потім клавіші зі стрілками, щоб змінити розклад.',
  'a11y.keyboard.hint.composer':
    'Щоб переміщатися між цілями, натискайте клавіші Control і дужки. Натисніть Control і I, щоб перейти до наступного випуску.',
  'a11y.keyboard.hint.dialog': 'Натисніть Escape, щоб закрити.',
  'a11y.keyboard.shortcutsTitle': 'Комбінації клавіш',

  'a11y.table.alternative': 'Вид таблиці',
  'a11y.table.alternativeHint': 'Той самий розклад, що й таблиця з можливістю сортування.',
  'a11y.motion.reduced': 'Анімації зменшено через налаштування вашої системи.',
} as const;
