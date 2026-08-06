/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Аналитика',
  'analytics.subtitle': 'Что произошло, насколько это свежее и что стоит протестировать дальше.',
  'analytics.range.7d': 'Последние 7 дней',
  'analytics.range.30d': 'Последние 30 дней',
  'analytics.range.90d': 'Последние 90 дней',
  'analytics.range.custom': 'Пользовательский диапазон',
  'analytics.range.limitedByProvider':
    '{provider} возвращает не более {days, plural, one {# день} few {# дней} many {# дней} other {# дней}} истории для этого аккаунта.',
  'analytics.account.select': 'Выберите учетную запись',
  'analytics.compareTo': 'По сравнению с {baseline}',
  'analytics.baseline.trailingMedian':
    'ваша медиана предыдущего {count, plural, one {# сопоставимого сообщения} few {# сопоставимого сообщения} many {# сопоставимого сообщения} other {# сопоставимого сообщения}}',

  'analytics.metric.followers': 'Последователи',
  'analytics.metric.subscribers': 'Подписчики',
  'analytics.metric.profileViews': 'Просмотры профиля',
  'analytics.metric.impressions': 'Впечатления',
  'analytics.metric.reach': 'Достичь',
  'analytics.metric.views': 'Просмотры',
  'analytics.metric.videoViews': 'Просмотры видео',
  'analytics.metric.watchTime': 'Время просмотра',
  'analytics.metric.averageViewDuration': 'Средняя продолжительность просмотра',
  'analytics.metric.averageViewPercentage': 'Средний процент просмотров',
  'analytics.metric.likes': 'Лайки и реакции',
  'analytics.metric.comments': 'Комментарии и ответы',
  'analytics.metric.shares': 'Репосты, репосты и цитаты',
  'analytics.metric.saves': 'Сохранения и закладки',
  'analytics.metric.linkClicks': 'Клики по ссылкам',
  'analytics.metric.clickThroughRate': 'Рейтинг кликов',
  'analytics.metric.engagementRate': 'Уровень вовлеченности',
  'analytics.metric.publishedCount': 'Опубликовано сообщений',
  'analytics.metric.followerChange': 'Изменение подписчика',

  'analytics.definition.title': 'Как определяется {metric}',
  'analytics.definition.provider': 'Об этом сообщает {provider} как {providerField}.',
  'analytics.definition.denominator.label': 'Знаменатель: {denominator}.',
  'analytics.definition.unit': 'Единица измерения: {unit}.',
  'analytics.definition.normalized':
    'Нормализовано на основе значения поставщика. Исходное значение сохраняется и доступно.',
  'analytics.definition.notComparable':
    '{provider} и {otherProvider} определяют это по-разному. Сравните их с осторожностью.',

  'analytics.value.unavailable': 'Недоступно',
  'analytics.value.unavailableReason.permission':
    'Эта учетная запись не предоставила разрешение, необходимое для этой метрики.',
  'analytics.value.unavailableReason.unsupported': '{provider} не сообщает об этой метрике.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} опубликует эту метрику позже. Проверьте еще раз после {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'Последняя синхронизация не удалась. Мы повторяем попытку и не отображаем угаданное число.',
  'analytics.freshness.synced': 'Синхронизировано {relativeTime}',
  'analytics.freshness.stale':
    'Последняя успешная синхронизация {relativeTime}. Возможно, это устарело.',
  'analytics.freshness.coverage':
    'Сообщения {covered} из {total} в этом диапазоне содержат текущие данные.',

  'analytics.feedback.title': 'Что это предполагает',
  'analytics.feedback.aboveBaseline':
    'Этот пост получил {percent} больше {metric}, чем {baseline}.',
  'analytics.feedback.belowBaseline':
    'Этот пост получил {percent} меньше {metric}, чем {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Публикации с изображениями и видеопосты здесь не сопоставимы напрямую.',
  'analytics.feedback.smallSample':
    'Выборка небольшая. Прежде чем сделать вывод, проверьте тот же крючок еще раз.',
  'analytics.feedback.association':
    'Количество комментариев увеличилось после того, как задержка первого комментария изменилась с {before} на {after}. Это ассоциация, а не доказательство причины.',
  'analytics.feedback.nextTest': 'Что тестировать дальше',
  'analytics.feedback.doNotInfer': 'Чего это не показывает',
  'analytics.feedback.noScore':
    'Здесь нет единого кроссплатформенного показателя. Выберите показатель, которому вы доверяете.',

  'analytics.experiment.title': 'Эксперименты',
  'analytics.experiment.hypothesis': 'Гипотеза',
  'analytics.experiment.variants': 'Варианты',
  'analytics.experiment.successMetric': 'Метрика успеха',
  'analytics.experiment.window': 'Окно измерений',
  'analytics.experiment.status.running': 'Работает до {date}',
  'analytics.experiment.status.complete': 'Завершить',
  'analytics.experiment.tagBeforePublishing':
    'Отметьте эксперимент перед публикацией, чтобы сравнение не проводилось постфактум.',
  'analytics.experiment.caveats': 'Предостережения',

  'analytics.export.title': 'Экспорт',
  'analytics.export.csv': 'Скачать CSV-файл',
  'analytics.export.json': 'Скачать JSON',
  'analytics.export.providerRestriction':
    '{provider} ограничивает способ объединения или хранения данных. Некоторые поля не включены.',

  'analytics.links.title': 'Отслеживаемые ссылки',
  'analytics.links.subtitle':
    'Собственные измерения перенаправления. Это отдельная серия отчетов о кликах по ссылкам на платформе.',
  'analytics.links.destination': 'Пункт назначения',
  'analytics.links.shortUrl': 'Короткий URL-адрес',
  'analytics.links.totalRequests': 'Всего запросов',
  'analytics.links.humanClicks': 'Дедуплицированные клики',
  'analytics.links.suspectedBots': 'Подозреваемые боты',
  'analytics.links.referrerClass': 'реферер',
  'analytics.links.deviceClass': 'Устройство',
  'analytics.links.country': 'Страна',
  'analytics.links.lastEvent': 'Последний клик {relativeTime}',
  'analytics.links.privacyNote':
    'Мы сохраняем только приблизительное местоположение и класс устройства. Необработанные IP-адреса кратковременно сохраняются для предотвращения злоупотреблений и обнаружения дубликатов, а затем отбрасываются.',
  'analytics.links.separateSources':
    'Не добавляйте эти клики к числу, сообщаемому платформой. Они считают разные вещи.',
} as const;
