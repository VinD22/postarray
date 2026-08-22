/**
 * Bulk CSV import. See `en/import.ts`: this says drafts wherever drafts are
 * what happens, and schedule only on the step where a person chooses it.
 */
export const importMessages = {
  'import.title': 'Імпорт публікацій з CSV',
  'import.subtitle':
    'Завантажте таблицю, прочитайте, що вона зробить, потім вирішіть. Завантаження перевіряє файл. Воно нічого не створює.',

  'import.step.upload': 'Завантаження',
  'import.step.columns': 'Стовпці',
  'import.step.review': 'Перевірка',
  'import.step.apply': 'Застосування',
  'import.step.results': 'Результати',
  'import.step.position': 'Крок {current} з {total}',

  'import.upload.heading': 'Виберіть файл CSV',
  'import.upload.help':
    'Лише CSV. Файли таблиць, такі як .xlsx, не читаються. Спочатку експортуйте вашу таблицю як CSV.',
  'import.upload.field': 'Файл CSV',
  'import.upload.fieldHelp': 'Виберіть файл або вставте рядки в поле нижче.',
  'import.upload.paste': 'Або вставте текст CSV',
  'import.upload.pasteHelp':
    'Включіть рядок заголовка. Усе перевіряється перш ніж щось буде створено.',
  'import.upload.project': 'Проєкт',
  'import.upload.projectHelp': 'Кожен рядок в одному файлі належить цьому проєкту.',
  'import.upload.submit': 'Перевірити цей файл',
  'import.upload.submitting': 'Читання файлу',
  'import.upload.allowPast': 'Дозволити час, що вже минув',
  'import.upload.allowPastHelp':
    'За замовчуванням вимкнено. Рядок із датою в минулому повідомляється, щоб ви могли його виправити, а не переноситься за вас.',
  'import.upload.tooLarge':
    'Цей файл більший за {limit} символів. Розділіть його і спробуйте знову.',
  'import.upload.duplicate':
    'Це той самий файл, який ви завантажували раніше, тому ви дивитеся на той імпорт, а не на його другу копію.',

  'import.template.heading': 'Що означають стовпці',
  'import.template.download': 'Завантажити шаблон CSV',
  'import.template.required': 'Обовʼязкові стовпці',
  'import.template.optional': 'Необовʼязкові стовпці',
  'import.column.external_row_id':
    'Ваш власний ідентифікатор рядка. Має бути унікальним усередині файлу.',
  'import.column.project': 'Назва або ідентифікатор проєкту, якому належить рядок.',
  'import.column.targets':
    'Або set: і далі ідентифікатор набору цілей, або ідентифікатори облікових записів, розділені вертикальною рискою.',
  'import.column.caption': 'Текст публікації.',
  'import.column.scheduled_local_time': 'Місцеві дата й час, записані як 2026-09-01T10:00.',
  'import.column.time_zone': 'Пояс IANA, у якому читається місцевий час, наприклад Europe/Berlin.',
  'import.column.media':
    'Ідентифікатор медіа, sha256: і далі контрольна сума медіа, яке у вас уже є, або адреса https для завантаження сервером.',
  'import.column.title': 'Заголовок, там, де призначення його використовує.',
  'import.column.destination': 'Сторінка, дошка або канал усередині облікового запису.',
  'import.column.privacy': 'Значення приватності, яке очікує призначення.',
  'import.column.first_comment': 'Текст, опублікований як перший коментар після публікації.',
  'import.column.approval_policy': 'Політика схвалення, яку прикріпити до кожної чернетки.',
  'import.column.perPlatform':
    'Стовпець caption_ або title_, названий іменем платформи, перевизначає лише цю платформу, наприклад caption_instagram.',

  'import.columns.heading': 'Перевірка стовпців',
  'import.columns.ok': 'Присутній кожен обовʼязковий стовпець.',
  'import.columns.missing':
    '{count, plural, one {відсутній # обовʼязковий стовпець} few {відсутні # обовʼязкові стовпці} many {відсутні # обовʼязкових стовпців} other {відсутні # обовʼязкового стовпця}}',
  'import.columns.unknown':
    '{count, plural, one {# стовпець не розпізнано, і його ігноровано} few {# стовпці не розпізнано, і їх ігноровано} many {# стовпців не розпізнано, і їх ігноровано} other {# стовпця не розпізнано, і їх ігноровано}}',
  'import.columns.present': 'Знайдені стовпці',

  'import.review.heading': 'Що зробить цей файл',
  'import.review.counts':
    '{valid, plural, =0 {Немає готових рядків} one {# рядок готовий} few {# рядки готові} many {# рядків готові} other {# рядка готові}}, {invalid, plural, =0 {жоден не потребує уваги} one {# потребує уваги} few {# потребують уваги} many {# потребують уваги} other {# потребують уваги}}.',
  'import.review.empty': 'З цього файлу не було прочитано жодного рядка.',
  'import.review.rowsHeading': 'Рядки',
  'import.review.filterAll': 'Усі рядки',
  'import.review.filterValid': 'Готові',
  'import.review.filterInvalid': 'Потребують уваги',
  'import.review.filterFailed': 'Не вдалося',
  'import.review.downloadErrors': 'Завантажити проблеми як CSV',
  'import.review.parsedWith': 'Прочитано парсером {version}',

  'import.table.row': 'Ідентифікатор рядка',
  'import.table.line': 'Рядок',
  'import.table.state': 'Стан',
  'import.table.caption': 'Текст',
  'import.table.time': 'Заплановано',
  'import.table.problems': 'Проблеми',
  'import.table.draft': 'Чернетка',
  'import.table.noProblems': 'Немає',

  'import.state.pending': 'Не перевірено',
  'import.state.valid': 'Готово',
  'import.state.invalid': 'Потребує уваги',
  'import.state.applied': 'Чернетку створено',
  'import.state.skipped': 'Уже зроблено',
  'import.state.failed': 'Не вдалося',

  'import.job.state.uploaded': 'Завантажено',
  'import.job.state.validating': 'Перевіряється',
  'import.job.state.validated': 'Перевірено',
  'import.job.state.applying': 'Застосовується',
  'import.job.state.applied': 'Застосовано',
  'import.job.state.failed': 'Не вдалося прочитати',

  'import.apply.heading': 'Що має статися з готовими рядками?',
  'import.apply.drafts': 'Створити чернетки',
  'import.apply.draftsHelp':
    'За замовчуванням. Кожен готовий рядок стає чернеткою, яку ви можете відкрити, редагувати і схвалити. Нічого не заплановано.',
  'import.apply.scheduled': 'Створити чернетки і запланувати їх',
  'import.apply.scheduledHelp':
    'Кожен готовий рядок стає чернеткою і бере час, записаний у файлі. Обирайте це, лише якщо час правильний.',
  'import.apply.confirm':
    'Застосувати {count, plural, one {# рядок} few {# рядки} many {# рядків} other {# рядка}}',
  'import.apply.confirmScheduled':
    'Створити і запланувати {count, plural, one {# рядок} few {# рядки} many {# рядків} other {# рядка}}',
  'import.apply.running': 'Застосування рядків',
  'import.apply.safeToRepeat':
    'Застосовувати двічі безпечно. Рядок, який уже створив чернетку, залишається недоторканим.',

  'import.results.heading': 'Результати',
  'import.results.applied':
    '{count, plural, one {створено # чернетку} few {створено # чернетки} many {створено # чернеток} other {створено # чернетки}}',
  'import.results.skipped':
    '{count, plural, one {# рядок уже було зроблено} few {# рядки вже було зроблено} many {# рядків уже було зроблено} other {# рядка вже було зроблено}}',
  'import.results.failed':
    '{count, plural, one {# рядок не вдався} few {# рядки не вдалися} many {# рядків не вдалися} other {# рядка не вдалися}}',
  'import.results.retry': 'Застосувати решту рядків знову',
  'import.results.openDrafts': 'Відкрити чернетки',
  'import.results.unavailable': 'недоступно',

  'import.history.heading': 'Попередні імпорти',
  'import.history.empty': 'Імпортів ще немає.',
  'import.history.open': 'Відкрити',

  'import.a11y.rowsTable': 'Рядки маніфесту та їхні проблеми',
  'import.a11y.stepList': 'Кроки імпорту',
  'import.a11y.uploadedFile': 'Вибраний файл: {filename}',

  'import.error.emptyFile': 'У цьому файлі немає рядків.',
  'import.error.missingColumn': 'Стовпець {column} відсутній.',
  'import.error.unknownColumn': 'Стовпець {column} не розпізнано, тому його ігноровано.',
  'import.error.duplicateRowId':
    'Ідентифікатор рядка {value} використовується в цьому файлі більше одного разу.',
  'import.error.required': 'Ця клітинка не може бути порожньою.',
  'import.error.invalidCell': 'Ця клітинка не в форматі, який ми можемо прочитати.',
  'import.error.rowShape': 'У цьому рядку {actual} клітинок, а в заголовку {expected}.',
  'import.error.invalidLocalTime':
    'Час {value} не є місцевими датою й часом, наприклад 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'Пояс {value} не є назвою часового поясу IANA.',
  'import.error.nonexistentLocalTime':
    'Час {value} не існує в {zone}. Годинники перестрибують через нього.',
  'import.error.ambiguousLocalTime':
    'Час {value} настає двічі в {zone} того дня. Виберіть інший час.',
  'import.error.scheduleInPast': 'Час {value} у {zone} уже минув.',
  'import.error.invalidTargets':
    'Значення {value} не є збереженим набором цілей або списком ідентифікаторів облікових записів.',
  'import.error.invalidMedia':
    'Значення {value} не є ідентифікатором медіа, контрольною сумою sha256 або адресою https.',
  'import.error.mediaNotFound': 'У цій робочій області немає медіа, що відповідає {value}.',
  'import.error.mediaImportStarted':
    'Медіа за адресою {value} завантажується. Застосуйте цей файл знову, щойно воно опиниться в бібліотеці.',
  'import.error.unknownVariantTarget':
    'У цьому рядку немає облікового запису {provider}, тому текст для {provider} не було використано.',
  'import.error.applyFailed': 'Цей рядок не вдалося застосувати. Код: {code}.',
  'import.error.alreadyApplied': 'Цей рядок уже створив чернетку, тому його залишили недоторканим.',
  'import.error.tooManyRows': 'З файлу читаються лише перші {limit} рядків.',
} as const;
