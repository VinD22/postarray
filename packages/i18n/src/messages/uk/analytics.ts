/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Аналітика',
  'analytics.subtitle': 'Що вийшло, наскільки він свіжий і що варто перевірити далі.',
  'analytics.range.7d': 'Останні 7 днів',
  'analytics.range.30d': 'Останні 30 днів',
  'analytics.range.90d': 'Останні 90 днів',
  'analytics.range.custom': 'Спеціальний діапазон',
  'analytics.range.limitedByProvider':
    '{provider} повертає максимум {days, plural, one {# день} few {# днів} many {# днів} other {# днів}} історії для цього значного запису.',
  'analytics.account.select': 'Виберіть обліковий запис',
  'analytics.compareTo': 'У порівнянні з {baseline}',
  'analytics.baseline.trailingMedian':
    'ваша медіана попереднього {count, plural, one {# порівнянний пост} few {# порівняльні посади} many {# порівняльні посади} other {# порівняльні посади}}',

  'analytics.metric.followers': 'Послідовники',
  'analytics.metric.subscribers': 'Підписники',
  'analytics.metric.profileViews': 'Перегляди профілю',
  'analytics.metric.impressions': 'Враження',
  'analytics.metric.reach': 'Досяжність',
  'analytics.metric.views': 'Перегляди',
  'analytics.metric.videoViews': 'Перегляди відео',
  'analytics.metric.watchTime': 'Час перегляду',
  'analytics.metric.averageViewDuration': 'Середня тривалість перегляду',
  'analytics.metric.averageViewPercentage': 'Середній відсоток переглядів',
  'analytics.metric.likes': 'Лайки та реакції',
  'analytics.metric.comments': 'Коментарі та відповіді',
  'analytics.metric.shares': 'Поширення, репости та цитування',
  'analytics.metric.saves': 'Збереження та закладки',
  'analytics.metric.linkClicks': 'Натискання посилань',
  'analytics.metric.clickThroughRate': 'Рейтинг кліків',
  'analytics.metric.engagementRate': 'Коефіцієнт залучення',
  'analytics.metric.publishedCount': 'Публікації опубліковано',
  'analytics.metric.followerChange': 'Зміна підписника',

  'analytics.definition.title': 'як {metric} наш',
  'analytics.definition.provider': 'Повідомила {provider} як {providerField}.',
  'analytics.definition.denominator.label': 'Знаменник: {denominator}.',
  'analytics.definition.unit': 'одиниця: {unit}.',
  'analytics.definition.normalized':
    'Нормовано за значенням постачальника. Необроблене значення зберігається та доступне.',
  'analytics.definition.notComparable':
    '{provider} і {otherProvider} визначте це по-різному. Порівняйте їх обережно.',

  'analytics.value.unavailable': 'Недоступний',
  'analytics.value.unavailableReason.permission':
    'Цей обліковий запис не надав дозволу, необхідного для цього показника.',
  'analytics.value.unavailableReason.unsupported': '{provider} не зазначив цей показник.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} публікує цей показник пізніше. Перевірте ще раз після {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'Помилка останньої синхронізації. Ми повторюємо спробу й не показуватимемо вгадане число.',
  'analytics.freshness.synced': 'Синхронізовано {relativeTime}',
  'analytics.freshness.stale':
    'Остання успішна синхронізація {relativeTime}. Це може бути застарілим.',
  'analytics.freshness.coverage':
    '{covered} з {total} публікації в цій частині мають поточні дані.',

  'analytics.feedback.title': 'Що це означає',
  'analytics.feedback.aboveBaseline': 'Цей пост отримав {percent} більше {metric} ніж {baseline}.',
  'analytics.feedback.belowBaseline': 'Цей пост отримав {percent} менше {metric} ніж {baseline}.',
  'analytics.feedback.notComparableFormats': 'Дописи зображень і відео не можна прямо порівнювати.',
  'analytics.feedback.smallSample':
    'Вибірка невелика. Перевірте той самий гачок ще раз, перш ніж зробити висновок.',
  'analytics.feedback.association':
    'Кількість коментарів зросла після зміни першої затримки коментаря з {before} до {after}. Це асоціація, а не доказ причини.',
  'analytics.feedback.nextTest': 'Що тестувати далі',
  'analytics.feedback.doNotInfer': 'Що це не показує',
  'analytics.feedback.noScore':
    'Тут немає єдиної міжплатформної оцінки. Виберіть показник із визначенням, якому довіряєте.',

  'analytics.experiment.title': 'Експерименти',
  'analytics.experiment.hypothesis': 'Гіпотеза',
  'analytics.experiment.variants': 'Варіанти',
  'analytics.experiment.successMetric': 'Метрика успіху',
  'analytics.experiment.window': 'Вікно вимірювання',
  'analytics.experiment.status.running': 'Біг до {date}',
  'analytics.experiment.status.complete': 'Повний',
  'analytics.experiment.tagBeforePublishing':
    'Позначте експеримент перед публікацією, щоб порівняння не проводилося постфактум.',
  'analytics.experiment.caveats': 'Застереження',

  'analytics.export.title': 'Експорт',
  'analytics.export.csv': 'Завантажити CSV',
  'analytics.export.json': 'Завантажити JSON',
  'analytics.export.providerRestriction':
    '{provider} обмежує способи об’єднання чи зберігання даних. Деякі поля не включені.',

  'analytics.links.title': 'Відстежені посилання',
  'analytics.links.subtitle':
    'Основні вимірювання перенаправлення. Це окрема серія звітів про кліки посилань на платформі.',
  'analytics.links.destination': 'Пункт призначення',
  'analytics.links.shortUrl': 'Короткий URL',
  'analytics.links.totalRequests': 'Всього запитів',
  'analytics.links.humanClicks': 'Дедупліковані кліки',
  'analytics.links.suspectedBots': 'Підозрювані боти',
  'analytics.links.referrerClass': 'реферер',
  'analytics.links.deviceClass': 'пристрій',
  'analytics.links.country': 'Країна',
  'analytics.links.lastEvent': 'Останній клік {relativeTime}',
  'analytics.links.privacyNote':
    'Ми зберігаємо лише приблизне розташування та клас пристрою. Необроблені IP-адреси ненадовго зберігаються для зловживань і виявлення дублікатів, а потім відкидаються.',
  'analytics.links.separateSources':
    'Не додавайте ці кліки до числа, яке повідомляє платформа. Вони рахують різне.',
} as const;
