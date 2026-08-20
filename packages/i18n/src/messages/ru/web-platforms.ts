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
  'web.meta.schedule.title': 'Планирование по каждой платформе',
  'web.meta.schedule.description':
    'Что каждая платформа в когорте запуска требует от подключённого аккаунта, ограничения, которые применяет её официальный API, и насколько далеко этот продукт продвинулся в их выполнении.',
  'web.meta.schedulePlatform.title': 'Планирование для {platform}',
  'web.meta.schedulePlatform.description':
    'Что {platform} требует от подключённого аккаунта, ограничения, которые применяет её официальный API, и какие части этого построил этот продукт.',

  'web.schedule.index.title': 'Планирование по каждой платформе',
  'web.schedule.index.lede':
    'По одной странице на каждую платформу в когорте запуска. Каждая указывает, что платформа требует от подключённого аккаунта, ограничения, которые применяет её официальный API, и на каком этапе находится разработка. Каждое число несёт документ, из которого оно взято, и дату, когда его прочитал человек.',
  'web.schedule.index.listLabel': 'Платформы в когорте запуска',
  'web.schedule.index.cohortNote':
    'Когорта это набор платформ, для которых строится этот продукт. Это план, а не список доступности.',
  'web.schedule.index.limitsKnown': 'Ограничения зафиксированы',
  'web.schedule.index.limitsUnknown': 'Ограничения пока не зафиксированы',

  'web.schedule.platform.title': 'Планирование для {platform}',
  'web.schedule.platform.lede':
    'Что {platform} требует от подключённого аккаунта, ограничения, которые применяет её официальный API, и какие из них этот продукт уже построил на данный момент.',

  'web.schedule.notice.title': 'На {platform} пока ничего не публикуется',
  'web.schedule.notice.body':
    'Ни один коннектор не прошёл определение готовности, и ни один не проверен в продакшене. Эта страница описывает то, что требует платформа, и то, что этот продукт намерен поддерживать. Она не описывает работающий планировщик.',

  'web.schedule.requirements.title': 'Что требует {platform}',
  'web.schedule.requirements.accountTypes': 'Тип аккаунта',
  'web.schedule.requirements.restriction': 'Ограничение платформы',
  'web.schedule.requirements.cost': 'Стоимость API',
  'web.schedule.requirements.unavailable.title': 'Пока нет проверенной записи о коннекторе',
  'web.schedule.requirements.unavailable.body':
    'Эта платформа присоединилась к когорте после последнего этапа исследования коннекторов, поэтому нет датированной записи о её требованиях к аккаунту, которую можно показать. Она появится здесь, как только кто-то прочитает официальную документацию и зафиксирует её.',
  'web.schedule.requirements.apiSource': 'Официальная документация API',
  'web.schedule.requirements.policySource': 'Политика платформы',

  'web.schedule.limits.title': 'Ограничения, которые применяет {platform}',
  'web.schedule.limits.lede':
    'Считано для только что подключённого аккаунта без повышенной пригодности. Платформа может поднять или снизить любое из этих значений, никого не предупредив, поэтому каждый набор несёт дату, когда он был прочитан.',
  'web.schedule.limits.unavailable.title': 'Ограничения для {platform} не зафиксированы',
  'web.schedule.limits.unavailable.body':
    'В этой сборке нет адаптера для этой платформы, поэтому нет зафиксированного потолка, который можно показать. Придуманное число было бы хуже, чем его отсутствие.',
  'web.schedule.limits.sourceLabel': 'Официальная документация платформы',

  'web.schedule.limits.text': 'Текст сообщения',
  'web.schedule.limits.title_field': 'Поле заголовка',
  'web.schedule.limits.countingUnit': 'Как считаются символы',
  'web.schedule.limits.links': 'Как считаются ссылки',
  'web.schedule.limits.images': 'Изображений на публикацию',
  'web.schedule.limits.videos': 'Видео на публикацию',
  'web.schedule.limits.videoDuration': 'Длительность видео',
  'web.schedule.limits.imageBytes': 'Самое большое изображение',
  'web.schedule.limits.gifBytes': 'Самое большое анимированное изображение',
  'web.schedule.limits.videoBytes': 'Самое большое видео',
  'web.schedule.limits.documentBytes': 'Самый большой документ',
  'web.schedule.limits.altText': 'Альтернативный текст',
  'web.schedule.limits.mimeTypes': 'Принимаемые типы файлов',
  'web.schedule.limits.markdown': 'Знаки форматирования',

  'web.schedule.value.characters':
    '{count, plural, one {# символ} few {# символа} many {# символов} other {# символа}}',
  'web.schedule.value.files':
    '{count, plural, =0 {Нет} one {# файл} few {# файла} many {# файлов} other {# файла}}',
  'web.schedule.value.durationRange': 'От {min} до {max}',
  'web.schedule.value.durationMax': 'До {max}',
  'web.schedule.value.markdownYes': 'Принимается',
  'web.schedule.value.markdownNo': 'Публикуется как обычные символы',

  'web.schedule.unit.utf16':
    'По единицам кода UTF-16, это то, что большинство редакторов сообщают как количество символов.',
  'web.schedule.unit.grapheme':
    'По графемам, поэтому эмодзи из нескольких кодовых точек всё равно считается одним символом.',
  'web.schedule.unit.weighted':
    'По взвешенной схеме, где большинство не латинских символов стоят два вместо одного.',

  'web.schedule.link.none': 'Ссылки не учитываются в потолке.',
  'web.schedule.link.actual': 'Ссылка стоит ровно столько символов, сколько занимает.',
  'web.schedule.link.fixed':
    'Каждая ссылка переписывается на сокращатель платформы и стоит {count, plural, one {# символ} few {# символа} many {# символов} other {# символа}} независимо от её реальной длины.',

  'web.schedule.capabilities.title': 'Что построено для {platform}',
  'web.schedule.capabilities.lede':
    '«Не предлагается платформой» это факт о платформе, и он окончателен. «Ещё не построено» это факт об этом продукте и честное значение по умолчанию, пока ни один коннектор не прошёл определение готовности. Это генерируется из реестра коннекторов, а не пишется здесь вручную.',
  'web.schedule.capabilities.unavailable.title': 'Пока нет записи о возможностях для {platform}',
  'web.schedule.capabilities.unavailable.body':
    'В этой сборке нет адаптера, поэтому реестру нечего сообщить. Строка появится в матрице возможностей, как только появится что-то реальное сообщить.',
  'web.schedule.capabilities.matrixLink': 'Прочитать полную матрицу возможностей',

  'web.schedule.next.title': 'Куда двигаться дальше',
  'web.schedule.next.body':
    'Матрица возможностей несёт каждую платформу и каждую возможность в одной таблице. Страницы примеров использования описывают рабочие процессы, вокруг которых строится этот продукт.',
} as const;
