/**
 * Bulk CSV import. See `en/import.ts`: this says drafts wherever drafts are
 * what happens, and schedule only on the step where a person chooses it.
 */
export const importMessages = {
  'import.title': 'Импорт публикаций из CSV',
  'import.subtitle':
    'Загрузите таблицу, прочитайте, что она сделает, затем решите. Загрузка проверяет файл. Она ничего не создаёт.',

  'import.step.upload': 'Загрузка',
  'import.step.columns': 'Столбцы',
  'import.step.review': 'Проверка',
  'import.step.apply': 'Применение',
  'import.step.results': 'Результаты',
  'import.step.position': 'Шаг {current} из {total}',

  'import.upload.heading': 'Выберите файл CSV',
  'import.upload.help':
    'Только CSV. Файлы таблиц, такие как .xlsx, не читаются. Сначала экспортируйте вашу таблицу как CSV.',
  'import.upload.field': 'Файл CSV',
  'import.upload.fieldHelp': 'Выберите файл или вставьте строки в поле ниже.',
  'import.upload.paste': 'Или вставьте текст CSV',
  'import.upload.pasteHelp': 'Включите строку заголовка. Всё проверяется прежде, чем что-либо создаётся.',
  'import.upload.project': 'Проект',
  'import.upload.projectHelp': 'Каждая строка в одном файле принадлежит этому проекту.',
  'import.upload.submit': 'Проверить этот файл',
  'import.upload.submitting': 'Чтение файла',
  'import.upload.allowPast': 'Разрешить уже прошедшее время',
  'import.upload.allowPastHelp':
    'По умолчанию выключено. Строка с датой в прошлом сообщается, чтобы вы могли её исправить, а не переносится за вас.',
  'import.upload.tooLarge': 'Этот файл больше {limit} символов. Разделите его и попробуйте снова.',
  'import.upload.duplicate':
    'Это тот же файл, который вы загружали раньше, поэтому вы смотрите на тот импорт, а не на его вторую копию.',

  'import.template.heading': 'Что означают столбцы',
  'import.template.download': 'Скачать шаблон CSV',
  'import.template.required': 'Обязательные столбцы',
  'import.template.optional': 'Необязательные столбцы',
  'import.column.external_row_id': 'Ваш собственный идентификатор строки. Должен быть уникальным внутри файла.',
  'import.column.project': 'Название или идентификатор проекта, которому принадлежит строка.',
  'import.column.targets':
    'Либо set: и затем идентификатор набора целей, либо идентификаторы аккаунтов, разделённые вертикальной чертой.',
  'import.column.caption': 'Текст публикации.',
  'import.column.scheduled_local_time': 'Локальные дата и время, записанные как 2026-09-01T10:00.',
  'import.column.time_zone': 'Пояс IANA, в котором читается локальное время, например Europe/Berlin.',
  'import.column.media':
    'Идентификатор медиафайла, sha256: и затем контрольная сумма уже имеющегося у вас медиафайла, или адрес https для загрузки сервером.',
  'import.column.title': 'Заголовок, там, где место назначения его использует.',
  'import.column.destination': 'Страница, доска или канал внутри аккаунта.',
  'import.column.privacy': 'Значение приватности, которое ожидает место назначения.',
  'import.column.first_comment': 'Текст, публикуемый как первый комментарий после публикации.',
  'import.column.approval_policy': 'Политика одобрения, прикрепляемая к каждому черновику.',
  'import.column.perPlatform':
    'Столбец caption_ или title_, названный по имени платформы, переопределяет только эту платформу, например caption_instagram.',

  'import.columns.heading': 'Проверка столбцов',
  'import.columns.ok': 'Присутствует каждый обязательный столбец.',
  'import.columns.missing':
    '{count, plural, one {отсутствует # обязательный столбец} few {отсутствует # обязательных столбца} many {отсутствует # обязательных столбцов} other {отсутствует # обязательного столбца}}',
  'import.columns.unknown':
    '{count, plural, one {# столбец не распознан и игнорируется} few {# столбца не распознаны и игнорируются} many {# столбцов не распознаны и игнорируются} other {# столбца не распознаны и игнорируются}}',
  'import.columns.present': 'Найденные столбцы',

  'import.review.heading': 'Что сделает этот файл',
  'import.review.counts':
    '{valid, plural, =0 {Нет готовых строк} one {# строка готова} few {# строки готовы} many {# строк готовы} other {# строки готовы}}, {invalid, plural, =0 {ни одна не требует внимания} one {# требует внимания} few {# требуют внимания} many {# требуют внимания} other {# требуют внимания}}.',
  'import.review.empty': 'Из этого файла не было прочитано ни одной строки.',
  'import.review.rowsHeading': 'Строки',
  'import.review.filterAll': 'Все строки',
  'import.review.filterValid': 'Готовы',
  'import.review.filterInvalid': 'Требуют внимания',
  'import.review.filterFailed': 'Не удались',
  'import.review.downloadErrors': 'Скачать проблемы как CSV',
  'import.review.parsedWith': 'Прочитано парсером {version}',

  'import.table.row': 'Идентификатор строки',
  'import.table.line': 'Строка',
  'import.table.state': 'Состояние',
  'import.table.caption': 'Текст',
  'import.table.time': 'Запланировано',
  'import.table.problems': 'Проблемы',
  'import.table.draft': 'Черновик',
  'import.table.noProblems': 'Нет',

  'import.state.pending': 'Не проверено',
  'import.state.valid': 'Готово',
  'import.state.invalid': 'Требует внимания',
  'import.state.applied': 'Черновик создан',
  'import.state.skipped': 'Уже сделано',
  'import.state.failed': 'Не удалось',

  'import.job.state.uploaded': 'Загружено',
  'import.job.state.validating': 'Проверяется',
  'import.job.state.validated': 'Проверено',
  'import.job.state.applying': 'Применяется',
  'import.job.state.applied': 'Применено',
  'import.job.state.failed': 'Не удалось прочитать',

  'import.apply.heading': 'Что должно произойти с готовыми строками?',
  'import.apply.drafts': 'Создать черновики',
  'import.apply.draftsHelp':
    'По умолчанию. Каждая готовая строка становится черновиком, который вы можете открыть, отредактировать и одобрить. Ничего не планируется.',
  'import.apply.scheduled': 'Создать черновики и запланировать их',
  'import.apply.scheduledHelp':
    'Каждая готовая строка становится черновиком и берёт время, записанное в файле. Выбирайте это, только если времена верны.',
  'import.apply.confirm':
    'Применить {count, plural, one {# строку} few {# строки} many {# строк} other {# строки}}',
  'import.apply.confirmScheduled':
    'Создать и запланировать {count, plural, one {# строку} few {# строки} many {# строк} other {# строки}}',
  'import.apply.running': 'Применение строк',
  'import.apply.safeToRepeat':
    'Применять дважды безопасно. Строка, которая уже создала черновик, остаётся нетронутой.',

  'import.results.heading': 'Результаты',
  'import.results.applied':
    '{count, plural, one {создан # черновик} few {создано # черновика} many {создано # черновиков} other {создано # черновика}}',
  'import.results.skipped':
    '{count, plural, one {# строка уже была сделана} few {# строки уже были сделаны} many {# строк уже были сделаны} other {# строки уже были сделаны}}',
  'import.results.failed':
    '{count, plural, one {# строка не удалась} few {# строки не удались} many {# строк не удались} other {# строки не удались}}',
  'import.results.retry': 'Применить оставшиеся строки снова',
  'import.results.openDrafts': 'Открыть черновики',
  'import.results.unavailable': 'недоступно',

  'import.history.heading': 'Предыдущие импорты',
  'import.history.empty': 'Импортов пока нет.',
  'import.history.open': 'Открыть',

  'import.a11y.rowsTable': 'Строки манифеста и их проблемы',
  'import.a11y.stepList': 'Шаги импорта',
  'import.a11y.uploadedFile': 'Выбранный файл: {filename}',

  'import.error.emptyFile': 'В этом файле нет строк.',
  'import.error.missingColumn': 'Столбец {column} отсутствует.',
  'import.error.unknownColumn': 'Столбец {column} не распознан, поэтому он игнорируется.',
  'import.error.duplicateRowId': 'Идентификатор строки {value} используется в этом файле более одного раза.',
  'import.error.required': 'Эта ячейка не может быть пустой.',
  'import.error.invalidCell': 'Эта ячейка не в формате, который мы можем прочитать.',
  'import.error.rowShape': 'В этой строке {actual} ячеек, а в заголовке {expected}.',
  'import.error.invalidLocalTime':
    'Время {value} не является локальной датой и временем, например 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'Пояс {value} не является названием часового пояса IANA.',
  'import.error.nonexistentLocalTime':
    'Время {value} не существует в {zone}. Часы перескакивают через него.',
  'import.error.ambiguousLocalTime':
    'Время {value} наступает дважды в {zone} в этот день. Выберите другое время.',
  'import.error.scheduleInPast': 'Время {value} в {zone} уже прошло.',
  'import.error.invalidTargets':
    'Значение {value} не является сохранённым набором целей или списком идентификаторов аккаунтов.',
  'import.error.invalidMedia':
    'Значение {value} не является идентификатором медиафайла, контрольной суммой sha256 или адресом https.',
  'import.error.mediaNotFound': 'В этом рабочем пространстве нет медиафайла, соответствующего {value}.',
  'import.error.mediaImportStarted':
    'Медиафайл по адресу {value} загружается. Примените этот файл снова, как только он окажется в библиотеке.',
  'import.error.unknownVariantTarget':
    'В этой строке нет аккаунта {provider}, поэтому текст для {provider} не был использован.',
  'import.error.applyFailed': 'Эту строку не удалось применить. Код: {code}.',
  'import.error.alreadyApplied': 'Эта строка уже создала черновик, поэтому она осталась нетронутой.',
  'import.error.tooManyRows': 'Из файла читаются только первые {limit} строк.',
} as const;
