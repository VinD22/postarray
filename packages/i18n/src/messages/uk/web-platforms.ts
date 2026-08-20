/**
 * The per platform scheduler pages. Only the `web.schedule.*`,
 * `web.meta.schedule.*` and `web.meta.schedulePlatform.*` keys are
 * translated here; the `/specs` cluster (`web.specs.*`, `web.meta.specs.*`,
 * `web.meta.specsPlatform.*`) in `en/web-platforms.ts` is out of this
 * locale's current coverage and falls back to English. See `en/web-platforms.ts`
 * for the rule this file follows: no string here may name a platform, a
 * character ceiling, a file size or a capability; those come only from the
 * generated dataset the page reads.
 */
export const webPlatformsMessages = {
  'web.meta.schedule.title': 'Планування за кожною платформою',
  'web.meta.schedule.description':
    'Що кожна платформа в когорті запуску вимагає від підключеного облікового запису, обмеження, які застосовує її офіційний API, і наскільки далеко цей продукт просунувся в їх виконанні.',
  'web.meta.schedulePlatform.title': 'Планування для {platform}',
  'web.meta.schedulePlatform.description':
    'Що {platform} вимагає від підключеного облікового запису, обмеження, які застосовує її офіційний API, і які частини цього побудував цей продукт.',

  'web.schedule.index.title': 'Планування за кожною платформою',
  'web.schedule.index.lede':
    'По одній сторінці на кожну платформу в когорті запуску. Кожна вказує, що платформа вимагає від підключеного облікового запису, обмеження, які застосовує її офіційний API, і на якому етапі перебуває розробка. Кожне число несе документ, з якого воно взяте, і дату, коли його прочитала людина.',
  'web.schedule.index.listLabel': 'Платформи в когорті запуску',
  'web.schedule.index.cohortNote':
    'Когорта це набір платформ, для яких будується цей продукт. Це план, а не список доступності.',
  'web.schedule.index.limitsKnown': 'Обмеження зафіксовано',
  'web.schedule.index.limitsUnknown': 'Обмеження ще не зафіксовано',

  'web.schedule.platform.title': 'Планування для {platform}',
  'web.schedule.platform.lede':
    'Що {platform} вимагає від підключеного облікового запису, обмеження, які застосовує її офіційний API, і які з них цей продукт уже побудував на цей момент.',

  'web.schedule.notice.title': 'На {platform} поки нічого не публікується',
  'web.schedule.notice.body':
    'Жоден конектор не пройшов визначення готовності, і жоден не перевірено в продакшені. Ця сторінка описує те, що вимагає платформа, і те, що цей продукт має намір підтримувати. Вона не описує працюючий планувальник.',

  'web.schedule.requirements.title': 'Що вимагає {platform}',
  'web.schedule.requirements.accountTypes': 'Тип облікового запису',
  'web.schedule.requirements.restriction': 'Обмеження платформи',
  'web.schedule.requirements.cost': 'Вартість API',
  'web.schedule.requirements.unavailable.title': 'Поки немає перевіреного запису про конектор',
  'web.schedule.requirements.unavailable.body':
    'Ця платформа приєдналася до когорти після останнього етапу дослідження конекторів, тому немає датованого запису про її вимоги до облікового запису, який можна показати. Вона зʼявиться тут, щойно хтось прочитає офіційну документацію і зафіксує її.',
  'web.schedule.requirements.apiSource': 'Офіційна документація API',
  'web.schedule.requirements.policySource': 'Політика платформи',

  'web.schedule.limits.title': 'Обмеження, які застосовує {platform}',
  'web.schedule.limits.lede':
    'Зчитано для щойно підключеного облікового запису без підвищеної придатності. Платформа може підвищити або знизити будь-яке з цих значень, нікого не попередивши, тому кожен набір несе дату, коли його було прочитано.',
  'web.schedule.limits.unavailable.title': 'Обмеження для {platform} не зафіксовано',
  'web.schedule.limits.unavailable.body':
    'У цій збірці немає адаптера для цієї платформи, тому немає зафіксованої стелі, яку можна показати. Вигадане число було б гіршим, ніж його відсутність.',
  'web.schedule.limits.sourceLabel': 'Офіційна документація платформи',

  'web.schedule.limits.text': 'Текст повідомлення',
  'web.schedule.limits.title_field': 'Поле заголовка',
  'web.schedule.limits.countingUnit': 'Як рахуються символи',
  'web.schedule.limits.links': 'Як рахуються посилання',
  'web.schedule.limits.images': 'Зображень на публікацію',
  'web.schedule.limits.videos': 'Відео на публікацію',
  'web.schedule.limits.videoDuration': 'Тривалість відео',
  'web.schedule.limits.imageBytes': 'Найбільше зображення',
  'web.schedule.limits.gifBytes': 'Найбільше анімоване зображення',
  'web.schedule.limits.videoBytes': 'Найбільше відео',
  'web.schedule.limits.documentBytes': 'Найбільший документ',
  'web.schedule.limits.altText': 'Альтернативний текст',
  'web.schedule.limits.mimeTypes': 'Прийняті типи файлів',
  'web.schedule.limits.markdown': 'Знаки форматування',

  'web.schedule.value.characters':
    '{count, plural, one {# символ} few {# символи} many {# символів} other {# символа}}',
  'web.schedule.value.files':
    '{count, plural, =0 {Немає} one {# файл} few {# файли} many {# файлів} other {# файла}}',
  'web.schedule.value.durationRange': 'Від {min} до {max}',
  'web.schedule.value.durationMax': 'До {max}',
  'web.schedule.value.markdownYes': 'Приймається',
  'web.schedule.value.markdownNo': 'Публікується як звичайні символи',

  'web.schedule.unit.utf16':
    'За одиницями коду UTF-16, це те, що більшість редакторів повідомляють як кількість символів.',
  'web.schedule.unit.grapheme':
    'За графемами, тому емодзі з кількох кодових точок все одно рахується одним символом.',
  'web.schedule.unit.weighted':
    'За зваженою схемою, де більшість не латинських символів коштують два замість одного.',

  'web.schedule.link.none': 'Посилання не враховуються в стелі.',
  'web.schedule.link.actual': 'Посилання коштує рівно стільки символів, скільки займає.',
  'web.schedule.link.fixed':
    'Кожне посилання переписується на скорочувач платформи і коштує {count, plural, one {# символ} few {# символи} many {# символів} other {# символа}} незалежно від його реальної довжини.',

  'web.schedule.capabilities.title': 'Що побудовано для {platform}',
  'web.schedule.capabilities.lede':
    '«Не пропонується платформою» це факт про платформу, і він остаточний. «Ще не побудовано» це факт про цей продукт і чесне значення за замовчуванням, поки жоден конектор не пройшов визначення готовності. Це генерується з реєстру конекторів, а не пишеться тут вручну.',
  'web.schedule.capabilities.unavailable.title': 'Поки немає запису про можливості для {platform}',
  'web.schedule.capabilities.unavailable.body':
    'У цій збірці немає адаптера, тому реєстру нічого повідомити. Рядок зʼявиться в матриці можливостей, щойно з’явиться щось реальне, що можна сказати.',
  'web.schedule.capabilities.matrixLink': 'Прочитати повну матрицю можливостей',

  'web.schedule.next.title': 'Куди рухатися далі',
  'web.schedule.next.body':
    'Матриця можливостей несе кожну платформу і кожну можливість в одній таблиці. Сторінки прикладів використання описують робочі процеси, навколо яких будується цей продукт.',
} as const;
