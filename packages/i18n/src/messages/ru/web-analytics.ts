/**
 * Web surface strings for Analytics, Automation Rules, RSS autopost and
 * tracked links.
 *
 * `analytics.ts` and `automation.ts` hold the domain vocabulary shared by every
 * surface (metric names, trigger sentences, provider caveats). This file holds
 * what only the web screens need: column headings, filter labels, wizard steps,
 * the sentence builder chrome and the per screen empty, error, offline,
 * permission and rate limit copy.
 *
 * Every leaf name here is new. Nothing in this file overwrites a key defined in
 * `analytics.ts` or `automation.ts`, which is asserted by `lint.test.ts`.
 */
export const webAnalyticsMessages = {
  /* ======================================================================
     Analytics shell
     ====================================================================== */
  'analytics.chart.legend': 'Серия, показанная на этой диаграмме',
  'analytics.tab.overview': 'Обзор',
  'analytics.tab.experiments': 'Эксперименты',
  'analytics.tab.links': 'Отслеживаемые ссылки',
  'analytics.tab.label': 'Разделы аналитики',

  'analytics.question.baseline': 'Какие посты отошли от вашего базового уровня?',
  'analytics.question.baselineHelp':
    'Каждое сообщение сравнивается с вашими недавними сообщениями в том же аккаунте и в том же формате. Ничто здесь не сравнивает вас с другим рабочим местом или другой компанией.',
  'analytics.question.accounts': 'Какие аккаунты требуют внимания?',
  'analytics.question.next': 'Что стоит протестировать дальше?',

  'analytics.filter.brand': 'Brand',
  'analytics.filter.accounts': 'Счета',
  'analytics.filter.allAccounts': 'Все подключенные аккаунты',
  'analytics.filter.range': 'Диапазон дат',
  'analytics.filter.format': 'Формат контента',
  'analytics.filter.allFormats': 'Все форматы',
  'analytics.filter.comparePrevious': 'Сравните с предыдущим периодом',
  'analytics.filter.applied':
    '{count, plural, =0 {Фильтры отсутствуют} one {# фильтр} few {# фильтров} many {# фильтров} other {# фильтров}} применено. {results, plural, =0 {Нет совпадений сообщений} one {# совпадений сообщений} few {# совпадений сообщений} many {# совпадений сообщений} other {# совпадений сообщений}}.',

  'analytics.rankMetric.label': 'Ранжируйте публикации по',
  'analytics.rankMetric.help':
    'В Relay нет общего результата. Выберите одну метрику, определению которой вы доверяете, и таблица будет упорядочена только по этой метрике.',
  'analytics.rankMetric.chosen': 'Рейтинг {metric} по данным каждого поставщика учетных записей.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Осведомленность',
  'analytics.outcome.awarenessHelp':
    'Сколько раз сообщение было доставлено или просмотрено. Поставщики рассчитывают это по-разному, поэтому значение сравнимо только с самим собой с течением времени.',
  'analytics.outcome.consumption': 'Потребление',
  'analytics.outcome.consumptionHelp':
    'Сколько постов люди на самом деле посмотрели или прочитали.',
  'analytics.outcome.interaction': 'Взаимодействие',
  'analytics.outcome.interactionHelp':
    'Что люди делали на платформе: лайки, комментарии, репосты и сохранения.',
  'analytics.outcome.conversion': 'Конверсия',
  'analytics.outcome.conversionHelp':
    'Что люди сделали после того, как покинули платформу. На этот вопрос могут ответить только отслеживаемые ссылки, и только для тех ссылок, которые вы выбрали для отслеживания.',
  'analytics.outcome.separateNote':
    'Эти четыре группы учитываются отдельно. Если сложить их вместе, одно и то же лицо будет засчитано более одного раза.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Сообщения, опубликованные в выбранном диапазоне, каждая из которых сравнивается с вашим недавним базовым показателем.',
  'analytics.table.post': 'Сообщение',
  'analytics.table.account': 'Аккаунт',
  'analytics.table.format': 'Формат',
  'analytics.table.published': 'Опубликовано',
  'analytics.table.value': 'Значение',
  'analytics.table.delta': 'Относительно базового уровня',
  'analytics.table.sample': 'Образец',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Доказательства',
  'analytics.table.openEvidence': 'Покажите доказательства {post}.',
  'analytics.table.rowActions': 'Действия для {post}',
  'analytics.table.openPost': 'Показатели открытых публикаций',
  'analytics.table.openReceipt': 'Открыть квитанцию о публикации',
  'analytics.table.noBaseline': 'Базового уровня пока нет',
  'analytics.table.noBaselineReason':
    'В этом аккаунте существует меньше постов, сопоставимых с {required}. Сравнение будет шумовым, поэтому ничего не показано.',
  'analytics.table.sortBy': 'Сортировать по {column}',
  'analytics.table.detailToggle': 'Подробности',

  'analytics.delta.above': '{percent} выше базового уровня',
  'analytics.delta.below': '{percent} ниже базового уровня',
  'analytics.delta.level': 'В соответствии с базовым уровнем',
  'analytics.delta.unavailable': 'Нет сравнения',

  'analytics.evidence.title': 'Как проводилось это сравнение',
  'analytics.evidence.baseline':
    'Базовый показатель: медианное значение {metric} предыдущего {count, plural, one {# сопоставимого сообщения} few {# сопоставимого сообщения} many {# сопоставимого сообщения} other {# сопоставимого сообщения}} на {account}.',
  'analytics.evidence.comparableBy':
    '«Сравнимое» означает одну и ту же учетную запись, один и тот же формат контента ({format}) и время публикации в один и тот же период.',
  'analytics.evidence.postsUsed': 'Сообщения, используемые для базового уровня',
  'analytics.evidence.excluded':
    '{count, plural, =0 {Ни одно сообщение не было исключено} one {# сообщение было исключено} few {# сообщение было исключено} many {# сообщение было исключено} other {# сообщение было исключено}}, поскольку метрика для них была недоступна.',
  'analytics.evidence.smallSample':
    'Учитывая, что {count, plural, one {# сообщений} few {# сообщений} many {# сообщений} other {# сообщений}} в базовой линии, одна необычная публикация значительно перемещает медиану. Отнеситесь к этому как к сигналу к повторному тестированию, а не как к результату.',
  'analytics.evidence.confounders': 'Что это не учитывает',
  'analytics.evidence.confounder.time': 'Время публикации базовых публикаций различалось.',
  'analytics.evidence.confounder.format':
    'Публикации с изображениями и видеопосты здесь не сопоставимы напрямую.',
  'analytics.evidence.confounder.followers':
    'За этот период количество подписчиков на {account} изменилось на {percent}.',
  'analytics.evidence.confounder.paid':
    'Relay не может сказать, получило ли какое-либо из этих сообщений платное распространение.',
  'analytics.evidence.confounder.provider':
    '{provider} изменил способ сообщения {metric} в этот период.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'Что означает {metric}',
  'analytics.definition.inlineHeading': 'Определение',
  'analytics.definition.observedAt': 'Замечено {dateTime}.',
  'analytics.definition.sourceLink': 'Документация поставщика',
  'analytics.definition.verifiedOn': 'Проверено по документации поставщика на {date}.',
  'analytics.definition.panelTitle': 'Определения показателей в этом представлении',
  'analytics.definition.panelIntro':
    'Каждое число на этом экране взято из одного именованного поля поставщика. Определения, приведенные ниже, также повторяются рядом с каждым значением, поэтому ничего важного не остается только во всплывающей подсказке.',
  'analytics.definition.aggregation.sum': 'Агрегировано путем добавления каждого наблюдения.',
  'analytics.definition.aggregation.average': 'Агрегировано как среднее.',
  'analytics.definition.aggregation.median': 'Агрегировано как медиана.',
  'analytics.definition.aggregation.last': 'Самое последнее наблюдение.',
  'analytics.definition.aggregation.delta': 'Разница между первым и последним наблюдением.',
  'analytics.definition.aggregation.none': 'Сообщается как единичное наблюдение.',
  'analytics.definition.denominator.none': 'Это счет, а не ставка.',
  'analytics.definition.historyWindow':
    '{provider} сохраняет {days, plural, one {# день} few {# дней} many {# дней} other {# дней}} истории для этого поля.',
  'analytics.definition.historyWindowNone':
    '{provider} не указывает ограничение истории для этого поля.',

  'analytics.definition.term.providerField': 'Поле поставщика',
  'analytics.definition.term.unit': 'Единица',
  'analytics.definition.term.denominator': 'Знаменатель',
  'analytics.definition.term.aggregation': 'Как это агрегируется',
  'analytics.definition.term.history': 'История, которую хранит провайдер',
  'analytics.definition.term.definition': 'Что говорит провайдер',

  'analytics.unit.count': 'Количество событий',
  'analytics.unit.seconds': 'Секунды',
  'analytics.unit.percent': 'Процент, который уже рассчитан поставщиком',
  'analytics.unit.ratio': 'Коэффициент Relay, рассчитанный на основе двух полей поставщика.',
  'analytics.unit.currency_minor': 'Денежная сумма в мелких единицах',

  'analytics.denominator.none': 'Это счет, а не ставка. У него нет знаменателя.',
  'analytics.denominator.impressions': 'Разделено по впечатлениям',
  'analytics.denominator.reach': 'Разделено по охвату',
  'analytics.denominator.views': 'Разделено по просмотрам',
  'analytics.denominator.followers': 'Делится на количество подписчиков на момент наблюдения.',
  'analytics.denominator.sessions': 'Разделено по сессиям',

  'analytics.format.text': 'Текст',
  'analytics.format.image': 'Изображение',
  'analytics.format.carousel': 'Карусель',
  'analytics.format.video': 'Видео',
  'analytics.format.short_video': 'Короткое видео',
  'analytics.format.long_video': 'Длинное видео',
  'analytics.format.document': 'Документ',
  'analytics.format.thread': 'Тема',

  'analytics.value.unavailableReason.notImplemented':
    'Relay еще не создал сопоставление для этой метрики в {provider}.',
  'analytics.value.estimated': 'Предполагаемый',
  'analytics.value.estimatedMethod': 'Метод: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'Откуда взялись эти цифры',
  'analytics.freshness.intro':
    'Провайдеры объединяются по собственному графику. На этом экране нет ничего живого.',
  'analytics.freshness.accountRow': '{account} на {provider}',
  'analytics.freshness.never': 'Никогда не синхронизировалось',
  'analytics.freshness.nextAttempt': 'Следующая попытка синхронизации {relativeTime}.',
  'analytics.freshness.openStatus': 'Статус провайдера',

  'analytics.accounts.title': 'Аккаунты, требующие внимания',
  'analytics.accounts.empty':
    'За этот период каждая подключенная учетная запись вернула данные. Ты здесь никому не нужен.',
  'analytics.accounts.reason.permission':
    'Разрешение на аналитику не было предоставлено при подключении этой учетной записи.',
  'analytics.accounts.reason.expired':
    'Срок доступа истек, поэтому с момента {date} сбор показателей не производился.',
  'analytics.accounts.reason.stale': 'Последняя успешная синхронизация была {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# попытка синхронизации} few {# попытка синхронизации} many {# попытка синхронизации} other {# попытка синхронизации}} не удалась подряд. Записанной причиной была {reason}.',
  'analytics.accounts.reason.noPosts':
    'Для этого аккаунта в выбранном диапазоне ничего не публиковалось.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Наблюдения',
  'analytics.observations.intro':
    'Это описания того, что показывают цифры. Это не предсказания и они не устанавливают причину.',
  'analytics.observations.empty':
    'Пока еще недостаточно опубликованных исторических данных, чтобы описать закономерность. Опубликуйте еще несколько постов в том же аккаунте и формате.',
  'analytics.observations.citedPosts': 'На основе',
  'analytics.observations.citedPeriod': 'Период: от {start} до {end}.',
  'analytics.observations.nextTestTitle': 'Тест, который вы могли бы провести следующим',
  'analytics.observations.nextTestBody':
    'Опубликуйте {count, plural, one {еще # сообщений} few {еще # сообщений} many {еще # сообщений} other {еще # сообщений}} на {account}, изменив только {variable}, а затем сравните ту же метрику. Перед публикацией пометьте его как эксперимент, чтобы сравнение было запланировано, а не найдено впоследствии.',
  'analytics.observations.tagFirst': 'Отметить эксперимент',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} с течением времени',
  'analytics.chart.summary':
    '{metric} на {account}, {count, plural, one {# балла} few {# балла} many {# балла} other {# балла}} с {start} на {end}.',
  'analytics.chart.showTable': 'Показать в виде таблицы',
  'analytics.chart.hideTable': 'Скрыть таблицу',
  'analytics.chart.tableCaption': 'Из той же серии, что и стол.',
  'analytics.chart.columnPeriod': 'Период',
  'analytics.chart.columnValue': 'Значение',
  'analytics.chart.gapLabel': 'Данные не собираются',
  'analytics.chart.gapExplained':
    'Разрыв в строке означает, что за этот период наблюдения не проводились. Это не означает ноль.',
  'analytics.chart.annotation': 'Аннотация',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'В этом диапазоне наблюдений не было.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Спланируйте эксперимент',
  'analytics.experiment.empty':
    'Экспериментов пока нет. Эксперимент, это сравнение, которое вы решаете перед публикацией, и это единственный вид сравнения, который может ответить на вопрос.',
  'analytics.experiment.emptyExample':
    'Пример: опубликуйте одно и то же объявление на X дважды: один раз со ссылкой в сообщении и один раз со ссылкой в первом комментарии, а затем сравните количество кликов по ссылке за 72 часа.',
  'analytics.experiment.name': 'Что вы тестируете',
  'analytics.experiment.namePlaceholder': 'Первый комментарий через 5 минут против 30 минут',
  'analytics.experiment.hypothesisPlaceholder':
    'Более короткая задержка перед тем, как первый комментарий получит больше ответов на X.',
  'analytics.experiment.variantLabel': 'Вариант {index}',
  'analytics.experiment.variantDescription': 'Чем отличается этот вариант',
  'analytics.experiment.addVariant': 'Добавить вариант',
  'analytics.experiment.removeVariant': 'Удалить вариант {index}',
  'analytics.experiment.accounts': 'Аккаунты включены',
  'analytics.experiment.windowHelp':
    'Показатели продолжают меняться после публикации публикации. Исправьте окно сейчас, чтобы сравнение не производилось в тот момент, когда подходит один вариант.',
  'analytics.experiment.windowDays':
    'Измеряйте результаты в течение {count, plural, one {# дня} few {# дней} many {# дней} other {# дня}} после публикации каждого поста.',
  'analytics.experiment.minSample': 'Минимум постов на вариант',
  'analytics.experiment.minSampleHelp':
    'Ниже этого значения результат отображается как безрезультатный, а не как победный.',
  'analytics.experiment.status.planned': 'Планируется',
  'analytics.experiment.status.collecting': 'Сбор. Опубликовано {published} из {target} сообщений.',
  'analytics.experiment.status.inconclusive': 'Полный, без явной разницы',
  'analytics.experiment.result.difference':
    '{variant} записал {percent} больше {metric}, чем {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'Эти два варианта находятся в пределах {percent} друг от друга на {metric}. В любом случае, это находится в пределах диапазона, в котором эти сообщения различаются.',
  'analytics.experiment.result.association':
    'Эта ассоциация измерена на {count, plural, one {# сообщений} few {# сообщений} many {# сообщений} other {# сообщений}}. Это не доказывает, что изменение вызвало разницу.',
  'analytics.experiment.result.unavailable':
    '{metric} был недоступен для {count, plural, one {# сообщений} few {# сообщений} many {# сообщений} other {# сообщений}} в этом эксперименте, поэтому эти сообщения исключаются, а не засчитываются как ноль.',
  'analytics.experiment.result.title': 'Результат',
  'analytics.experiment.completeNow': 'Закрыть этот эксперимент',
  'analytics.experiment.completeConfirm':
    'Закрытие останавливает сбор. Сообщения остаются опубликованными, а номера остаются доступными.',
  'analytics.experiment.postsTitle': 'Сообщения в этом эксперименте',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Загрузка аналитики по выбранным аккаунтам',
  'analytics.state.loadingProvider': 'Получение аналитики {provider}',
  'analytics.state.empty': 'В этом диапазоне ничего не опубликовано',
  'analytics.state.emptyBody':
    'Аналитика описывает посты, которые уже вышли. Опубликуйте что-нибудь или расширьте диапазон дат.',
  'analytics.state.emptyExample':
    'Как только сообщение станет опубликованным, вы увидите строку типа: X @acme, «Запустить ветку», 12 400 показов, что на 58 процентов выше медианы предыдущих 10.',
  'analytics.state.errorTitle': 'Не удалось загрузить аналитику.',
  'analytics.state.errorBody':
    'Число не отображается, а только угаданное. Ваши сообщения и квитанции не будут затронуты.',
  'analytics.state.partialTitle': '{loaded} из аккаунтов {total} вернул данные',
  'analytics.state.partialBody':
    'Ответившие аккаунты показаны в своей свежести. Остальные перечислены с указанием причины, по которой они этого не сделали.',
  'analytics.state.partialSucceeded': 'Возвращенные данные',
  'analytics.state.partialFailed': 'Не вернул данные',
  'analytics.state.offlineTitle': 'Вы оффлайн',
  'analytics.state.offlineBody':
    'Приведенные ниже рисунки были загружены до разрыва соединения, поэтому они старше, чем предполагают метки актуальности.',
  'analytics.state.permissionTitle': 'Вы не можете видеть аналитику в этой рабочей области.',
  'analytics.state.permissionBody':
    'Аналитикам нужна роль аналитика или выше. Предоставить его может владелец или администратор этой рабочей области.',
  'analytics.state.rateLimitTitle': '{provider}, это ограничение скорости аналитических запросов.',
  'analytics.state.rateLimitCause':
    'Для этого окна учетная запись использовала свою долю квоты провайдера. Relay не повторяет повторную попытку, поскольку это приведет к задержке публикации.',
  'analytics.state.rateLimitAlternative':
    'Сузьте диапазон дат или фильтр учетных записей, который требует от провайдера меньше.',
  'analytics.state.rateLimitReset': 'Запросить резюме',
  'analytics.state.reference': 'Диагностический справочник',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Создать отслеживаемую ссылку',
  'analytics.links.empty': 'Отслеживаемых ссылок пока нет',
  'analytics.links.emptyBody':
    'Отслеживаемая ссылка, это короткий URL-адрес, через который перенаправляется Relay, поэтому вы можете видеть клики, даже если платформа не сообщает об их отсутствии. Исходное место назначения никогда не меняется без записи аудита.',
  'analytics.links.emptyExample':
    'Пример: redirect.to/a7Kq2 перенаправляет на acme.com/blog/launch с запуском кампании q3.',
  'analytics.links.table.caption':
    'Отслеживаемые ссылки в этой рабочей области и подсчет их первых кликов.',
  'analytics.links.campaign': 'Кампания',
  'analytics.links.created': 'Создано',
  'analytics.links.usedIn':
    '{count, plural, =0 {Пока не используется в сообщении} one {Используется в # сообщении} few {Используется в # сообщениях} many {Используется в # сообщениях} other {Используется в # сообщениях}}',
  'analytics.links.state.active': 'Активный',
  'analytics.links.state.expired': 'Срок действия истёк {date}',
  'analytics.links.state.disabled': 'Отключено',
  'analytics.links.state.disabledReason': 'Отключено {actor} на {date}. Причина записи: {reason}.',
  'analytics.links.detailTitle': 'Отслеживаемая ссылка {slug}',
  'analytics.links.exactRedirect': 'Точное перенаправление',
  'analytics.links.exactRedirectHelp':
    'Это пункт назначения, которого посетитель достигает прямо сейчас, включая все параметры UTM, показанные полностью, а не сокращенно.',
  'analytics.links.editDestination': 'Изменить пункт назначения',
  'analytics.links.editDestinationWarning':
    'Изменение места назначения влияет на все места, где эта ссылка уже была опубликована. В отчетах за периоды до изменения сохраняется пункт назначения, который был активен на тот момент.',
  'analytics.links.editDestinationAudit':
    'Изменение записывается в журнал аудита с указанием вашего имени, старого пункта назначения и нового.',
  'analytics.links.destinationHistory': 'История назначения',
  'analytics.links.destinationHistoryRow': '{destination}, активен с {start} по {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, активен с {start}',
  'analytics.links.domainLabel': 'Короткий домен',
  'analytics.links.domainDefault': 'Relay домен по умолчанию',
  'analytics.links.domainVerified': 'Проверено DNS на {date}',
  'analytics.links.domainPending': 'Ожидание записи DNS',
  'analytics.links.domainPendingHelp':
    'Добавьте запись TXT ниже в {domain}, затем проверьте еще раз. Пока он не проверит, этот домен нельзя выбрать для новой ссылки.',
  'analytics.links.domainFailed': 'DNS-запись не совпадает на {date}.',
  'analytics.links.domainCheck': 'Проверьте DNS еще раз',
  'analytics.links.expiry': 'Срок действия',
  'analytics.links.expiryNone': 'Срок действия не установлен',
  'analytics.links.expiryHelp':
    'По истечении срока действия ссылка возвращает простую страницу с сообщением о том, что она закончилась. Его никогда молча не указывают куда-то еще.',
  'analytics.links.disable': 'Отключите эту ссылку сейчас',
  'analytics.links.disableTitle': 'Отключить {slug}?',
  'analytics.links.disableBody':
    'Посетители попадают на страницу, сообщающую, что ссылка больше не доступна. Опубликованные сообщения по-прежнему содержат короткий URL-адрес, поэтому он виден всем, кто нажмет на ссылку.',
  'analytics.links.disableReason': 'Причина отключения',
  'analytics.links.enable': 'Включите эту ссылку еще раз',
  'analytics.links.abuseTitle': 'Сообщить о злоупотреблении этой ссылкой',
  'analytics.links.abuseBody':
    'Если этот короткий URL-адрес используется для чего-то, чего вы не планировали, сообщите об этом, и перенаправление будет приостановлено на время его проверки.',
  'analytics.links.abuseAction': 'Пожаловаться на эту ссылку',
  'analytics.links.measurementLabel': 'Собственное измерение перенаправления',
  'analytics.links.measurementExplained':
    'Relay учитывает запрос, когда служба перенаправления запрашивает этот URL-адрес. Дедуплицированный щелчок удаляет повторные запросы от одного и того же посетителя в течение короткого окна, а запросы, соответствующие известным шаблонам сканирования, исключаются, а не удаляются.',
  'analytics.links.botsNote':
    '{count, plural, one {# запроса} few {# запроса} many {# запроса} other {# запроса}} были классифицированы как автоматизированные и исключены из дедуплицированного подсчета.',
  'analytics.links.series.title': 'Запросы и дедуплицированные клики с течением времени',
  'analytics.links.series.requests': 'Всего запросов',
  'analytics.links.series.clicks': 'Дедуплицированные клики',
  'analytics.links.breakdownTitle': 'Откуда были клики',
  'analytics.links.breakdown.share': '{percent} дедуплицированных кликов',
  'analytics.links.referrer.direct': 'Реферер не отправлен',
  'analytics.links.referrer.social': 'Социальная платформа',
  'analytics.links.referrer.search': 'Поисковая система',
  'analytics.links.referrer.email': 'Почтовый клиент',
  'analytics.links.referrer.other': 'Другой сайт',
  'analytics.links.device.mobile': 'мобильный',
  'analytics.links.device.desktop': 'Рабочий стол',
  'analytics.links.device.tablet': 'Таблетка',
  'analytics.links.device.unknown': 'Не определено',
  'analytics.links.countryUnknown': 'Страна не определена',
  'analytics.links.lastEventLabel': 'Последний клик',
  'analytics.links.noEvents': 'Клики пока не зафиксированы',
  'analytics.links.noEventsBody':
    'Эта ссылка не запрашивалась с момента ее создания. Это настоящий ноль, измеренный нашей собственной службой перенаправления.',
  'analytics.links.compareWarning':
    '{provider} сообщает, что {providerValue} нажал ссылку на этот пост. Relay записал дедуплицированные клики {relayValue}. Они учитывают разные события, и ни одно из них не заменяет другое.',
  'analytics.links.errorTitle': 'Не удалось загрузить статистику ссылок.',
  'analytics.links.errorBody':
    'Служба перенаправления все еще работает, поэтому ссылка продолжает отправлять посетителей по назначению. Затрагивается только отчетность.',
  'analytics.links.createDestination': 'Целевой URL',
  'analytics.links.createDestinationHelp':
    'Должен быть общедоступный https-адрес. Адреса частных сетей и цепочки перенаправления отклоняются службой перенаправления.',
  'analytics.links.createCampaign': 'Название кампании',
  'analytics.links.createSlug': 'Пользовательский финал',
  'analytics.links.createSlugHelp':
    'Оставьте это поле пустым, и Relay сгенерирует короткий случайный финал.',
  'analytics.links.createUtm': 'UTM-параметры',
  'analytics.links.blockedScheme': 'Принимаются только направления https.',
  'analytics.links.blockedPrivate':
    'Этот адрес находится в частной сети, поэтому служба перенаправления его не примет.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Правила',
  'automation.tab.feeds': 'RSS-каналы',
  'automation.tab.label': 'Разделы автоматизации',

  'automation.rules.table.caption': 'Правила автоматизации в этой рабочей области.',
  'automation.rules.table.rule': 'Правило',
  'automation.rules.table.state': 'Государство',
  'automation.rules.table.accounts': 'Счета',
  'automation.rules.table.lastRun': 'Последний запуск',
  'automation.rules.table.nextCheck': 'Следующая проверка',
  'automation.rules.neverRun': 'Еще не запущен',
  'automation.rules.emptyExample':
    'Пример: когда в ленте блога Acme появляется новый элемент, если язык английский, создайте черновик из шаблона объявления в блоге и запросите одобрение.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {Аккаунты не выбраны} one {# аккаунта} few {# аккаунта} many {# аккаунта} other {# аккаунта}}',
  'automation.rules.openRule': 'Открыть {name}',
  'automation.rules.duplicateRule': 'Дубликат {name}',
  'automation.rules.deleteTitle': 'Удалить {name}?',
  'automation.rules.deleteBody':
    'Правило немедленно останавливается, и история его выполнения сохраняется в журнале аудита. Уже созданные сообщения не затрагиваются.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'запланированный комментарий или элемент темы не выполнен',

  'automation.condition.timeWindow': 'время находится между {start} и {end} в {timeZone}',
  'automation.condition.domainPresent': 'текст ссылается на {domain}',
  'automation.condition.hashtagPresent': 'в тексте присутствует хештег {hashtag}',
  'automation.condition.providerCapability':
    'учетная запись действительно может выполнять {capability}',
  'automation.condition.planStatus': 'подписка активна',

  'automation.action.continueSequence':
    'продолжить подготовленную тему или последовательность комментариев',
  'automation.action.notifyEmail': 'отправить электронное письмо на адрес {target}',
  'automation.action.notifyWebhook': 'отправить вебхук на {target}',
  'automation.action.pauseConnection': 'приостановить затронутый аккаунт',
  'automation.action.quotePost': 'процитируйте исходное сообщение один раз',
  'automation.action.followUpComment': 'добавить подготовленный комментарий к исходному сообщению',

  'automation.param.feed': 'Кормить',
  'automation.param.template': 'Шаблон',
  'automation.param.signature': 'Подпись',
  'automation.param.disclosure': 'Раскрытие информации',
  'automation.param.locale': 'Язык',
  'automation.param.brand': 'Brand',
  'automation.param.campaign': 'Кампания',
  'automation.param.account': 'Аккаунт',
  'automation.param.platform': 'Платформа',
  'automation.param.contentType': 'Тип контента',
  'automation.param.keyword': 'Ключевое слово',
  'automation.param.hashtag': 'Хэштег',
  'automation.param.domain': 'Домен',
  'automation.param.capability': 'Возможность',
  'automation.param.timeZone': 'Часовой пояс',
  'automation.param.startTime': 'От',
  'automation.param.endTime': 'Чтобы',
  'automation.param.duration': 'Продолжительность',
  'automation.param.metric': 'Метрика',
  'automation.param.value': 'Значение',
  'automation.param.target': 'Отправить',
  'automation.param.time': 'Время',
  'automation.param.cadence': 'Как часто',
  'automation.param.notSet': 'не установлено',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Название правила',
  'automation.editor.namePlaceholder': 'Блог в соц.',
  'automation.editor.when': 'Когда',
  'automation.editor.if': 'Если',
  'automation.editor.then': 'Тогда',
  'automation.editor.after': 'После',
  'automation.editor.until': 'До тех пор, пока',
  'automation.editor.sentenceLabel': 'Правило предложения',
  'automation.editor.readBack':
    'Прочтите предложение еще раз, прежде чем включить это. Это целое правило.',
  'automation.editor.chooseTrigger': 'Выберите, с чего начинается это правило',
  'automation.editor.addCondition': 'Добавить условие',
  'automation.editor.addAction': 'Добавить действие',
  'automation.editor.removeCondition': 'Удалить условие {label}',
  'automation.editor.removeAction': 'Удалить действие {label}',
  'automation.editor.moveActionUp': 'Переместить {label} ранее',
  'automation.editor.moveActionDown': 'Переместить {label} позже',
  'automation.editor.actionOrder': 'Действия выполняются в таком порядке, сверху вниз.',
  'automation.editor.noConditions':
    'Никаких условий. Правило выполняется каждый раз, когда оно срабатывает.',
  'automation.editor.noActions':
    'Никаких действий пока нет. Правило без действия не может быть сохранено.',
  'automation.editor.delayNone': 'без задержки',
  'automation.editor.delayLabel': 'Задержка перед запуском действий',
  'automation.editor.endLabel': 'Когда это правило перестанет действовать',
  'automation.editor.end.manual': 'я выключаю это',
  'automation.editor.end.date': 'дату, которую я выбираю',
  'automation.editor.end.count':
    'он выполнил {count, plural, one {# раз} few {# раз} many {# раз} other {# раз}}',
  'automation.editor.end.dateValue': 'Остановись',
  'automation.editor.end.countValue': 'Остановитесь после такого количества пробежек',
  'automation.editor.parameterFor': 'Настройки для {label}',
  'automation.editor.saveDraft': 'Сохранить как черновик',
  'automation.editor.savedAt': 'Сохранено {time}',
  'automation.editor.unsaved': 'Несохраненные изменения',

  'automation.editor.view.sentence': 'Приговор',
  'automation.editor.view.structured': 'Структурированный',
  'automation.editor.view.api': 'Представление API',
  'automation.editor.view.label': 'Вид редактора',
  'automation.editor.apiHelp':
    'Именно это отправляют REST API, CLI и сервер MCP. Редактирование здесь и возврат к предложению сохраняет все поля.',
  'automation.editor.apiInvalid':
    'Это недопустимое правило JSON, поэтому оно не было применено: {reason}.',
  'automation.editor.apiApply': 'Примените этот JSON',
  'automation.editor.structuredHelp':
    'То же правило, что и для полей. Используйте это, когда правило имеет много условий и предложение получается длинным.',

  'automation.editor.error.noAction': 'Прежде чем сохранить, добавьте хотя бы одно действие.',
  'automation.editor.error.noTrigger': 'Перед сохранением выберите триггер.',
  'automation.editor.error.noAccounts':
    'Выберите хотя бы одну учетную запись, на которую может распространяться это правило.',
  'automation.editor.error.missingParameter': '{label} требуется значение.',
  'automation.editor.error.summary':
    '{count, plural, one {# вещь требует вашего внимания} few {# вещь требует вашего внимания} many {# вещь требует вашего внимания} other {# вещь требует вашего внимания}}, прежде чем это правило можно будет сохранить.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'С чего начинается это правило',
  'automation.picker.conditionTitle': 'Добавить условие',
  'automation.picker.actionTitle': 'Добавить действие',
  'automation.picker.search': 'Фильтровать этот список',
  'automation.picker.noResults': 'Ничто в этом списке не соответствует тому, что вы набрали.',
  'automation.picker.groupContent': 'Содержание',
  'automation.picker.groupPublishing': 'Публикация',
  'automation.picker.groupNotify': 'Люди и системы',
  'automation.picker.groupControl': 'Контроль правил',
  'automation.picker.groupSchedule': 'Время',
  'automation.picker.groupExternal': 'Внешние события',
  'automation.picker.groupMeasurement': 'Измерение',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# действие} few {# действий} many {# действий} other {# действий}} не указано, поскольку выбранные учетные записи не могут их выполнить.',
  'automation.picker.hiddenDetail': '{action} недоступен для {provider}. {reason}',
  'automation.picker.consequential': 'Создает что-то на платформе',
  'automation.picker.internalOnly': 'Остается внутри Relay',

  'automation.accounts.label': 'Аккаунты, на которые может распространяться это правило',
  'automation.accounts.help':
    'Правило никогда не может касаться учетной записи, которая не указана здесь, какие бы условия ни были указаны в нем.',
  'automation.accounts.none': 'Аккаунты еще не выбраны',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Правила измерения для этого триггера',
  'automation.threshold.intro':
    'Правило, реагирующее на число, должно знать, какое число, измеренное в течение какого периода, и как часто оно может действовать.',
  'automation.threshold.metric': 'Метрика, за которой стоит следить',
  'automation.threshold.value': 'Пороговое значение',
  'automation.threshold.window': 'Окно измерений',
  'automation.threshold.windowHelp':
    'Отсчитывается с момента публикации исходного поста. За пределами этого окна правило прекращает просмотр публикации.',
  'automation.threshold.expiry': 'Перестаньте смотреть пост после',
  'automation.threshold.cooldown': 'Перезарядка между казнями',
  'automation.threshold.cooldownHelp':
    'Наименьшее время, допустимое между двумя запусками одного и того же исходного сообщения.',
  'automation.threshold.maxPerPost': 'Максимальное количество исполнений на исходную публикацию',
  'automation.threshold.defaultsTitle':
    'Значения по умолчанию, которые остаются активными, пока вы их не измените.',
  'automation.threshold.defaultOncePerPost': 'Запускайте один раз для каждого исходного сообщения.',
  'automation.threshold.defaultStale':
    'Не выполнять, если метрика недоступна или устарела. Используемый предел актуальности, {duration}.',
  'automation.threshold.staleLimit': 'Считать метрику устаревшей после',
  'automation.threshold.providerNote':
    '{provider} сообщает {metric} о задержке, поэтому это правило может действовать только после того, как провайдер опубликует номер.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Продолжение с другого аккаунта',
  'automation.crossAccount.off': 'Выкл. Это правило действует только для исходной учетной записи.',
  'automation.crossAccount.enable': 'Разрешить отслеживание из другого аккаунта',
  'automation.crossAccount.body':
    'Обе учетные записи должны быть подключены к этой рабочей области, и обе должны быть названы здесь. Последующий пост, это подготовленный пост, который вы пишете заранее, и он проходит ту же политику одобрения, что и все остальное.',
  'automation.crossAccount.sourceAccount': 'Исходный аккаунт',
  'automation.crossAccount.followUpAccount': 'Аккаунт, который публикует продолжение',
  'automation.crossAccount.preauthorize':
    'Я подтверждаю, что это рабочее пространство контролирует как {sourceAccount}, так и {followUpAccount}, и что последующие действия не представляются как независимое одобрение.',
  'automation.crossAccount.preauthorizeRequired':
    'Подтвердите предварительную авторизацию, прежде чем это правило можно будет сохранить.',
  'automation.crossAccount.duplicateCheck':
    'Проверка дубликатов и каденции между учетными записями выполняется перед последующим действием, и она пропускается, а не задерживается, если повторяется исходное сообщение.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro':
    'Все, что может сделать это правило, прежде чем оно сможет что-либо сделать.',
  'automation.preflight.accountsLabel': 'Счета, с которыми он может действовать',
  'automation.preflight.maxActionsLabel': 'Наибольшее количество внешних действий за прогон',
  'automation.preflight.maxActionsPeriod':
    'Не более {count, plural, one {# внешнего действия} few {# внешнего действия} many {# внешнего действия} other {# внешнего действия}} в {period}.',
  'automation.preflight.approvalLabel': 'Одобрение',
  'automation.preflight.approvalNone':
    'Никакие действия в этом правиле ничего не создают на платформе, поэтому одобрение не применяется.',
  'automation.preflight.providerLabel': 'Ограничения провайдера',
  'automation.preflight.providerNone': 'Ничто не применимо к действиям в этом правиле.',
  'automation.preflight.costLabel': 'Ориентировочная стоимость учета',
  'automation.preflight.costUnknown':
    'Стоимость этих действий невозможно оценить, пока не станет известна цена поставщика.',
  'automation.preflight.costMethod':
    'Ориентировочно из прайс-листа провайдера на {date}. В квитанции указывается, какая сумма была фактически списана.',
  'automation.preflight.cadenceLabel': 'Каденция и дубликаты',
  'automation.preflight.cadenceBody':
    'Проверка дубликатов и каденции выполняется перед каждым действием. Действие, которое может превысить бюджет каденции для учетной записи, пропускается и записывается, а не ставится в очередь.',
  'automation.preflight.failureLabel': 'Если запуск не удался',
  'automation.preflight.failure.pauseAfter':
    'Правило приостанавливается после {count, plural, one {# последовательных ошибок} few {# последовательных ошибок} many {# последовательных ошибок} other {# последовательных ошибок}} и сохраняет элемент действия.',
  'automation.preflight.failure.continue':
    'Правило продолжает работать, и каждый сбой записывается в журнал выполнения.',
  'automation.preflight.exampleLabel': 'Пример запуска',
  'automation.preflight.exampleIntro':
    'При использовании самого последнего события этот триггер совпадал бы.',
  'automation.preflight.exampleNone':
    'Соответствующего события еще не произошло, поэтому пример показать невозможно. Вместо этого запустите тестовое событие.',
  'automation.preflight.activate': 'Включите это правило',
  'automation.preflight.activateConfirmTitle': 'Включить {name}?',
  'automation.preflight.activateConfirmBody':
    'Отныне это правило действует без вашего предварительного запроса, в пределах, перечисленных выше.',
  'automation.preflight.blocked':
    'Это правило пока невозможно включить. {count, plural, one {# элемент} few {# элемент} many {# элемент} other {# элемент}}, указанный выше, требует принятия решения.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Тестовое мероприятие',
  'automation.test.body':
    'Тестовый запуск оценивает все предложение и показывает, что оно будет делать. Он никогда не публикует, никогда не публикует комментарии и никогда не отправляет вебхук в реальную конечную точку.',
  'automation.test.useLastEvent': 'Использовать самое последнее соответствующее событие',
  'automation.test.usePayload': 'Вставка полезных данных события',
  'automation.test.run': 'Запустить тест',
  'automation.test.running': 'Запуск теста',
  'automation.test.resultTitle': 'Что дал тест',
  'automation.test.conditionPassed': '{condition} пройдено',
  'automation.test.conditionFailed': '{condition} не прошел, поэтому правило на этом остановилось',
  'automation.test.actionSimulated': '{action} будет работать',
  'automation.test.actionSkipped': '{action} будет пропущен: {reason}.',
  'automation.test.noExternalEffect': 'Во время этого теста ничего не осталось Relay.',
  'automation.test.failed': 'Не удалось завершить тест: {reason}.',

  'automation.runs.table.caption': 'Недавние запуски этого правила.',
  'automation.runs.startedAt': 'Началось',
  'automation.runs.outcome.label': 'Результат',
  'automation.runs.actionsTaken': 'Действия',
  'automation.runs.trigger': 'По инициативе',
  'automation.runs.outcome.completed': 'Завершено',
  'automation.runs.outcome.skipped': 'Пропущено',
  'automation.runs.outcome.failed': 'Не удалось',
  'automation.runs.outcome.testMode': 'Тестовый режим',
  'automation.runs.actionCount':
    '{count, plural, =0 {Нет внешнего действия} one {# внешнего действия} few {# внешнего действия} many {# внешнего действия} other {# внешнего действия}}',
  'automation.runs.skippedReason': 'Пропущено, поскольку {reason}',
  'automation.runs.openDetail': 'Откройте пробег от {time}',
  'automation.runs.createdItems': 'Создано',

  'automation.versions.caption': 'Каждая сохраненная версия этого правила.',
  'automation.versions.current': 'Текущий',
  'automation.versions.savedBy': 'Сохранено пользователем {actor} на {date}',
  'automation.versions.compare': 'Сравнить с текущей версией',
  'automation.versions.restore': 'Восстановить эту версию',
  'automation.versions.restoreConfirm':
    'При восстановлении создается новая версия. Ничего не перезаписывается, и правило остается в текущем состоянии, пока вы его не включите.',
  'automation.versions.diffTitle': 'Версия {from} по сравнению с версией {to}',

  'automation.kill.title': 'Остановите {name} прямо сейчас',
  'automation.kill.body':
    'Правило прекращается немедленно, в середине забега, если таковой происходит. Все, что уже отправлено на платформу, остается опубликованным, поскольку внешняя публикация никогда не откатывается.',
  'automation.kill.confirmPhrase': 'СТОП',
  'automation.kill.confirmLabel': 'Введите STOP для подтверждения.',
  'automation.kill.stopped':
    'Это правило было остановлено {actor} на {date}. Он не сможет снова запуститься, пока вы не включите его снова.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Загрузка правил автоматизации',
  'automation.state.loadingRule': 'Загрузка правила и его последних запусков',
  'automation.state.errorTitle': 'Не удалось загрузить правила.',
  'automation.state.errorBody':
    'На уже запущенные правила это не влияет. Только этот экран не удался.',
  'automation.state.offlineTitle': 'Вы оффлайн',
  'automation.state.offlineBody':
    'Вы можете прочитать правило и отредактировать черновик, и он останется на этом устройстве. Для сохранения, тестирования и включения правила требуется подключение.',
  'automation.state.permissionTitle': 'Вы не можете изменить правила автоматизации.',
  'automation.state.permissionBody':
    'Правила действуют для подключенных учетных записей, поэтому для изменения одного из них требуется роль менеджера или выше. Вы по-прежнему можете прочитать каждое правило и историю его выполнения.',
  'automation.state.rateLimitTitle': 'Выполнение правил замедляется',
  'automation.state.rateLimitCause':
    'Это рабочее пространство достигло предела автоматизации для текущего окна. Запланированные публикации и публикация вручную не затронуты.',
  'automation.state.rateLimitAlternative':
    'Правилам с каденцией можно задать более длинный интервал, при котором используется меньшее количество прогонов.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Превратите ленту в черновики или запланированные публикации с такой же проверкой и одобрением, как и все, что вы пишете сами.',
  'automation.rss.empty': 'Пока нет каналов',
  'automation.rss.emptyBody':
    'Добавьте канал, и Relay проверит его по расписанию. Каждый новый элемент становится черновиком, запланированной публикацией или запросом на утверждение, в зависимости от того, что вы выберете.',
  'automation.rss.emptyExample':
    'Пример: канал блога Acme создает черновик для X и LinkedIn каждый раз при публикации статьи и ожидает утверждения.',
  'automation.rss.table.caption': 'Подает опросы в этой рабочей области.',
  'automation.rss.table.feed': 'Кормить',
  'automation.rss.table.policy': 'Что происходит с новым предметом',
  'automation.rss.table.health': 'Здоровье',

  'automation.rss.step.url': 'Адрес фида',
  'automation.rss.step.preview': 'Проверьте ленту',
  'automation.rss.step.seen': 'Начальная точка',
  'automation.rss.step.targets': 'Куда это идет',
  'automation.rss.step.template': 'О чем говорится в посте',
  'automation.rss.step.policy': 'Как оно публикуется',
  'automation.rss.stepOf': 'Шаг {current} из {total}',

  'automation.rss.urlHelp':
    'Relay получает канал с наших серверов, а не из вашего браузера. Адреса частных сетей отклоняются.',
  'automation.rss.validateAction': 'Проверьте этот канал',
  'automation.rss.validateFailed': 'Этот адрес не вернул читаемый канал.',
  'automation.rss.validateFailedReason': 'Что мы получили в ответ: {reason}',
  'automation.rss.validateBlocked':
    'Этот адрес указывает на частную сеть, поэтому он не был получен.',
  'automation.rss.previewTitle': 'Предварительный просмотр ленты',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# элемент} few {# элементов} many {# элементов} other {# элементов}} возвращено, сначала самые новые.',
  'automation.rss.previewItemPublished': 'Опубликовано {dateTime}',
  'automation.rss.previewNoImage': 'В этом товаре нет изображения',
  'automation.rss.previewImageAlt': 'Изображение из элемента фида {title}',
  'automation.rss.previewNoDate':
    'У этого элемента нет временной метки, поэтому Relay использует время, когда он впервые его увидел.',
  'automation.rss.previewFieldsTitle': 'Поля, которые предоставляет этот фид',
  'automation.rss.previewFieldMissing': 'Нет в этом фиде',

  'automation.rss.seenTitle': 'Что считается уже замеченным',
  'automation.rss.seenLatest':
    'Рассматривайте все, что в данный момент находится в ленте, как видно. Публикуются только будущие элементы.',
  'automation.rss.seenAll':
    'Рассматривайте новейший элемент как новый и учитывайте его при следующей проверке.',
  'automation.rss.seenHelp':
    'Большинство каналов содержат старые статьи. Выбор первого варианта позволяет избежать публикации отставания.',

  'automation.rss.targetsHelp':
    'Выберите учетные записи или сохраненную группу. Каждая цель по-прежнему проходит собственную проверку, прежде чем что-либо будет запланировано.',
  'automation.rss.targetGroup': 'Сохраненная группа',
  'automation.rss.targetIndividual': 'Индивидуальные счета',

  'automation.rss.templateFields': 'Доступные поля',
  'automation.rss.templateInsert': 'Вставьте {field}',
  'automation.rss.templateField.title': 'Название товара',
  'automation.rss.templateField.summary': 'Краткое описание товара',
  'automation.rss.templateField.link': 'Ссылка на товар',
  'automation.rss.templateField.author': 'Автор объекта',
  'automation.rss.templateField.published': 'Дата публикации',
  'automation.rss.templateField.categories': 'Категории',
  'automation.rss.templatePreview': 'Предварительный просмотр новейшего товара',
  'automation.rss.adaptWithAi': 'Адаптируйте текст для каждой цели',
  'automation.rss.adaptHelp':
    'Формулировка переписана, чтобы соответствовать каждой платформе, и отображается в виде разницы, которую вы принимаете или отклоняете. Медиафайлы поступают из элемента фида. Relay не генерирует изображения.',
  'automation.rss.noImageGeneration':
    'Если элемент ленты не имеет изображения, сообщение будет опубликовано без него.',
  'automation.rss.imageFromFeed': 'Используйте изображение из элемента фида, если оно есть.',

  'automation.rss.policyHelp':
    'Элемент фида не является чем-то особенным. Он следует той же политике одобрения, что и пост, который вы пишете самостоятельно.',
  'automation.rss.cadenceInterval': 'Максимум один предмет каждый',
  'automation.rss.cadenceHelp':
    'Дополнительные элементы ждут в очереди, а не публикуются вместе, поэтому канал, публикующий десять статей одновременно, не переполняет учетную запись.',
  'automation.rss.immediateWarning':
    'Немедленная публикация отправляет сообщение на платформу без предварительного прочтения человеком. Оно доступно только в том случае, если это разрешено политикой утверждения для этих учетных записей.',

  'automation.rss.healthTitle': 'Здоровье корма',
  'automation.rss.healthOk': 'Работаю',
  'automation.rss.healthStalled': 'Для {duration} нет новых товаров.',
  'automation.rss.healthFailing':
    'Последняя {count, plural, one {проверка} few {# проверки} many {# проверок} other {# проверки}} завершилась с ошибкой.',
  'automation.rss.health.nextPoll': 'Следующая проверка {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Пока ни один элемент не обработан} one {# элемент обработан} few {# элемент обработано} many {# элемент обработано} other {# элемент обработано}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {Дубликаты не пропущены} one {# дубликатов пропущено} few {# дубликатов пропущено} many {# дубликатов пропущено} other {# дубликатов пропущено}}',
  'automation.rss.health.lastPollLabel': 'Последняя проверка',
  'automation.rss.health.lastItemLabel': 'Последняя новинка в ленте',
  'automation.rss.health.lastPostLabel': 'Последний созданный черновик или сообщение',
  'automation.rss.health.processedLabel': 'Обработанные элементы',
  'automation.rss.recentItems': 'Недавние элементы',
  'automation.rss.itemOutcome.draft': 'Черновик создан',
  'automation.rss.itemOutcome.scheduled': 'Запланировано на {time}',
  'automation.rss.itemOutcome.published': 'Опубликовано',
  'automation.rss.itemOutcome.awaitingApproval': 'Ожидание одобрения',
  'automation.rss.itemOutcome.duplicate': 'Пропущено, уже просмотрено',
  'automation.rss.itemOutcome.failed': 'Ошибка: {reason}.',
  'automation.rss.pauseFeed': 'Приостановить этот канал',
  'automation.rss.resumeFeed': 'Возобновить этот канал',
  'automation.rss.deleteTitle': 'Удалить {title}?',
  'automation.rss.deleteBody':
    'Relay прекращает проверку этого канала. Уже созданные черновики и публикации остаются такими же, какие они есть.',
  'automation.rss.errorTitle': 'Этот канал не может быть прочитан',
  'automation.rss.errorBody':
    'Relay продолжает проверять по обычному расписанию. Из частичного ответа ничего не было опубликовано.',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'Недоступно ни в одном правиле.',
  'automation.refuse.body':
    'Автоматические лайки и подписки, группы взаимодействия, нежелательные ответы и сообщения, а также публикация одного и того же контента из нескольких учетных записей, чтобы он выглядел популярным, здесь не являются вариантами. Платформы запрещают их и наносят ущерб учетным записям, которые их используют.',
  'automation.refuse.readPolicy': 'Ознакомьтесь с политикой допустимого использования',
} as const;
