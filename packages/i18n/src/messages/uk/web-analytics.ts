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
  'analytics.chart.legend': 'Серія показана на цій діаграмі',
  'analytics.tab.overview': 'Огляд',
  'analytics.tab.experiments': 'Експерименти',
  'analytics.tab.links': 'Відстежені посилання',
  'analytics.tab.label': 'Розділи аналітики',

  'analytics.question.baseline': 'Які публікації відійшли від вашої базової лінії?',
  'analytics.question.baselineHelp':
    'Кожна публікація порівнюється з вашими останніми публікаціями в тому самому обліковому записі та в тому самому форматі. Ніщо тут не порівнює вас з іншим робочим місцем чи іншою компанією.',
  'analytics.question.accounts': 'Які облікові записи потребують уваги?',
  'analytics.question.next': 'Що варто тестувати далі?',

  'analytics.filter.project': 'Project',
  'analytics.filter.accounts': 'Облікові записи',
  'analytics.filter.allAccounts': 'Усі підключені облікові записи',
  'analytics.filter.range': 'Діапазон дат',
  'analytics.filter.format': 'Формат вмісту',
  'analytics.filter.allFormats': 'Всі формати',
  'analytics.filter.comparePrevious': 'Порівняти з попереднім періодом',
  'analytics.filter.applied':
    '{count, plural, =0 {Без фільтрів} one {# фільтр} few {# фільтри} many {# фільтри} other {# фільтри}} також. {results, plural, =0 {Немає відповідних публікацій} one {# після матчів} few {# дописи збігаються} many {# дописи збігаються} other {# дописи збігаються}}.',

  'analytics.rankMetric.label': 'Ранжувати публікації за',
  'analytics.rankMetric.help':
    'У Relay немає комбінованої оцінки. Виберіть один показник, визначенню якого ви довіряєте, і таблицю буде впорядковано лише за цим показником.',
  'analytics.rankMetric.chosen':
    'Рейтинг за {metric}, як повідомляю кожного постачальника облікових записів.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'обізнаність',
  'analytics.outcome.awarenessHelp':
    'Скільки разів повідомлення було доставлено або переглянуто. Постачальники розраховують це по-різному, тому значення можна порівняти лише з самим собою з часом.',
  'analytics.outcome.consumption': 'Споживання',
  'analytics.outcome.consumptionHelp': 'Скільки публікації люди переглянули або прочитали.',
  'analytics.outcome.interaction': 'Взаємодія',
  'analytics.outcome.interactionHelp':
    'Що люди робили на платформі: лайки, коментарі, поширення та збереження.',
  'analytics.outcome.conversion': 'Перетворення',
  'analytics.outcome.conversionHelp':
    'Що люди робили після виходу з платформи. Лише відстежувані посилання можуть відповісти на це питання, і лише для посилань, які ви вибрали для відстеження.',
  'analytics.outcome.separateNote':
    'Ці чотири групи враховуються окремо. Якщо додати їх разом, ту саму особу враховуватимуть більше одного разу.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Публікації, опубліковані у вибраному діапазоні, кожну з них порівнюють із вашим останнім базовим рівнем.',
  'analytics.table.post': 'Опублікувати',
  'analytics.table.account': 'Обліковий запис',
  'analytics.table.format': 'Формат',
  'analytics.table.published': 'Опубліковано',
  'analytics.table.value': 'Значення',
  'analytics.table.delta': 'Проти базової лінії',
  'analytics.table.sample': 'Зразок',
  'analytics.table.sampleSize': 'n ={count}',
  'analytics.table.evidence': 'Докази',
  'analytics.table.openEvidence': 'Покажіть докази для{post}',
  'analytics.table.rowActions': 'Дії для{post}',
  'analytics.table.openPost': 'Показники відкритої публікації',
  'analytics.table.openReceipt': 'Квитанція про відкриту публікацію',
  'analytics.table.noBaseline': 'Базового рівня ще немає',
  'analytics.table.noBaselineReason':
    'Менше ніж {required} у цьому обліковому записі є подібні публікації. Порівняння було б шумом, тому жодного не показано.',
  'analytics.table.sortBy': 'Сортувати за{column}',
  'analytics.table.detailToggle': 'Подробиці',

  'analytics.delta.above': '{percent}вище базової лінії',
  'analytics.delta.below': '{percent}нижче базової лінії',
  'analytics.delta.level': 'Відповідно до базової лінії',
  'analytics.delta.unavailable': 'Без порівняння',

  'analytics.evidence.title': 'Як було зроблено це порівняння',
  'analytics.evidence.baseline':
    'Базова лінія: медіана {metric} попереднього {count, plural, one {# порівнянний пост} few {# порівняльні посади} many {# порівняльні посади} other {# порівняльні посади}} на {account}.',
  'analytics.evidence.comparableBy':
    'Порівняння означає той самий обліковий запис, той самий формат вмісту ({format}) і час публікації в межах того самого періоду.',
  'analytics.evidence.postsUsed': 'Стовпи, які використовуються для базової лінії',
  'analytics.evidence.excluded':
    '{count, plural, =0 {Жодна публікація не була виключена} one {# пост було виключено} few {# постів було виключено} many {# постів було виключено} other {# постів було виключено}} остання метрика була недоступна.',
  'analytics.evidence.smallSample':
    'с {count, plural, one {# пост} few {# пости} many {# пости} other {# пости}} у базовій лінії одна незвичайна публікація пересуває медіану на довгий шлях. Сприймайте це як сигнал до повторного тестування, а не як результат.',
  'analytics.evidence.confounders': 'Що це не враховує',
  'analytics.evidence.confounder.time': 'Час публікації різний для базових публікацій.',
  'analytics.evidence.confounder.format': 'Дописи зображень і відео не можна прямо порівнювати.',
  'analytics.evidence.confounder.followers':
    'Послідовник розраховує на {account} змінено на {percent} протягом цього періоду.',
  'analytics.evidence.confounder.paid':
    'Relay не може сказати, чи було якесь із цих дописів платне розповсюдження.',
  'analytics.evidence.confounder.provider':
    '{provider}змінив спосіб звітування {metric} всередині цього періоду.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'Що {metric} засоби',
  'analytics.definition.inlineHeading': 'Визначення',
  'analytics.definition.observedAt': 'Споживається {dateTime}.',
  'analytics.definition.sourceLink': 'Документація провайдера',
  'analytics.definition.verifiedOn': 'Перевірено відповідно до документації постачальника {date}.',
  'analytics.definition.panelTitle': 'Визначення показників у цьому поданні',
  'analytics.definition.panelIntro':
    'Кожен номер на цьому екрані походить з одного названого поля постачальника. Наведені нижче визначення також повторюються поруч із кожним значенням, тому нічого важливого не міститься лише в підказці.',
  'analytics.definition.aggregation.sum': 'Зведено шляхом додавання кожного спостереження.',
  'analytics.definition.aggregation.average': 'Агрегований як середнє.',
  'analytics.definition.aggregation.median': 'Агреговано як медіана.',
  'analytics.definition.aggregation.last': 'Останнє спостереження.',
  'analytics.definition.aggregation.delta': 'Зміна між першим і останнім спостереженням.',
  'analytics.definition.aggregation.none': 'Повідомлено як одне спостереження.',
  'analytics.definition.denominator.none': 'Це підрахунок, а не ставка.',
  'analytics.definition.historyWindow':
    '{provider}зберігає {days, plural, one {# день} few {# днів} many {# днів} other {# днів}} історії цієї галузі.',
  'analytics.definition.historyWindowNone': '{provider}не вказує обмеження історії для цього поля.',

  'analytics.definition.term.providerField': 'Поле постачальника',
  'analytics.definition.term.unit': 'одиниця',
  'analytics.definition.term.denominator': 'Знаменник',
  'analytics.definition.term.aggregation': 'Як це агрегується',
  'analytics.definition.term.history': 'Історію зберігає провайдер',
  'analytics.definition.term.definition': 'Що означає провайдер',

  'analytics.unit.count': 'Підрахунок подій',
  'analytics.unit.seconds': 'секунд',
  'analytics.unit.percent': 'Відсоток, який провайдер уже розрахував',
  'analytics.unit.ratio': 'Коефіцієнт Relay, розрахований на основі двох полів постачальника',
  'analytics.unit.currency_minor': 'Сума грошей у другорядних одиницях',

  'analytics.denominator.none': 'Це підрахунок, а не ставка. Він не має знаменника.',
  'analytics.denominator.impressions': 'Поділили за враженнями',
  'analytics.denominator.reach': 'Поділяється за охопленням',
  'analytics.denominator.views': 'Розділені за переглядами',
  'analytics.denominator.followers': 'Поділено на кількість підписників на момент спостереження',
  'analytics.denominator.sessions': 'Розділені по сесіях',

  'analytics.format.text': 'текст',
  'analytics.format.image': 'Зображення',
  'analytics.format.carousel': 'Карусель',
  'analytics.format.video': 'відео',
  'analytics.format.short_video': 'Коротке відео',
  'analytics.format.long_video': 'Довге відео',
  'analytics.format.document': 'документ',
  'analytics.format.thread': 'Нитка',

  'analytics.value.unavailableReason.notImplemented':
    'Relay не створив зіставлення для цього показника {provider} ще.',
  'analytics.value.estimated': 'Розрахункова',
  'analytics.value.estimatedMethod': 'Метод: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'Звідки ці цифри',
  'analytics.freshness.intro':
    'Постачальники збираються за власним графіком. На цьому екрані немає нічого в прямому ефірі.',
  'analytics.freshness.accountRow': '{account}на{provider}',
  'analytics.freshness.never': 'Ніколи не синхронізовано',
  'analytics.freshness.nextAttempt': 'Наступна спроба синхронізації {relativeTime}.',
  'analytics.freshness.openStatus': 'Статус провайдера',

  'analytics.accounts.title': 'Облікові записи, які потребують уваги',
  'analytics.accounts.empty':
    'Кожен підключений обліковий запис повернув дані за цей період. Ти тут нічого не потребуєш.',
  'analytics.accounts.reason.permission':
    'Дозвіл на аналітику не було надано під час підключення цього облікового запису.',
  'analytics.accounts.reason.expired':
    'Термін дії доступу припинився, тому жодних показників не було зібрано {date}.',
  'analytics.accounts.reason.stale': 'Остання успішна синхронізація була {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {#спроба синхронізації} few {# спроби синхронізації} many {# спроби синхронізації} other {# спроби синхронізації}} провалилися підряд. Причина записана була {reason}.',
  'analytics.accounts.reason.noPosts':
    'Для цього облікового запису нічого не було опубліковано у вибраному діапазоні.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Спостереження',
  'analytics.observations.intro':
    'Це опис того, що показують цифри. Вони не є передбаченнями і не встановлюють причину.',
  'analytics.observations.empty':
    'Ще недостатньо опублікованої історії, щоб описати закономірність. Опублікуйте ще кілька публікацій у тому ж обліковому записі та форматі.',
  'analytics.observations.citedPosts': 'На основі',
  'analytics.observations.citedPeriod': 'Період: {start} до {end}.',
  'analytics.observations.nextTestTitle': 'Тест, який ви можете виконати наступним',
  'analytics.observations.nextTestBody':
    'Опублікувати {count, plural, one {# більше публікацій} few {# більше дописів} many {# більше дописів} other {# більше дописів}} на {account} змінюється тільки {variable}, а потім порівняйте той самий показник. Позначте це як експеримент перед публікацією, щоб порівняння було заплановано, а пізніше не знайдено.',
  'analytics.observations.tagFirst': 'Позначити експеримент тегом',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric}з часом',
  'analytics.chart.summary':
    '{metric}на {account}, {count, plural, one {# точка} few {# балів} many {# балів} other {# балів}} від {start} до {end}.',
  'analytics.chart.showTable': 'Показати у вигляді таблиці',
  'analytics.chart.hideTable': 'Сховайте таблицю',
  'analytics.chart.tableCaption': 'Така ж серія, що і стіл.',
  'analytics.chart.columnPeriod': 'Крапка',
  'analytics.chart.columnValue': 'Значення',
  'analytics.chart.gapLabel': 'Дані не збираються',
  'analytics.chart.gapExplained':
    'Розрив у рядку означає відсутність спостережень за цей період. Це не означає нуль.',
  'analytics.chart.annotation': 'Анотація',
  'analytics.chart.pointLabel': '{period}:{value}',
  'analytics.chart.empty': 'Жодних спостережень у цьому діапазоні не проводилося.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Сплануйте експеримент',
  'analytics.experiment.empty':
    'Експериментів поки немає. Експеримент: це порівняння, яке ви вибираєте перед публікацією, і це єдиний вид, який може відповісти на запитання.',
  'analytics.experiment.emptyExample':
    'Приклад: опублікуйте те саме оголошення на X двічі, один раз із посиланням у дописі та один раз із посиланням у першому коментарі, а потім порівняйте кліки посилань протягом 72 годин.',
  'analytics.experiment.name': 'Що ви тестуєте',
  'analytics.experiment.namePlaceholder': 'Перший коментар на 5 хвилині проти 30 хвилини',
  'analytics.experiment.hypothesisPlaceholder':
    'Менша затримка, перш ніж перший коментар отримає більше відповідей на X.',
  'analytics.experiment.variantLabel': 'Варіант{index}',
  'analytics.experiment.variantDescription': 'Чим відрізняється цей варіант',
  'analytics.experiment.addVariant': 'Додайте варіант',
  'analytics.experiment.removeVariant': 'Видалити варіант{index}',
  'analytics.experiment.accounts': 'Облікові записи включені',
  'analytics.experiment.windowHelp':
    'Показники продовжують змінюватися після публікації публікації. Виправте вікно зараз, щоб порівняння не проводилося в момент, який відповідає одному варіанту.',
  'analytics.experiment.windowDays':
    'Міра для {count, plural, one {# день} few {# днів} many {# днів} other {# днів}} після публікації кожного посту',
  'analytics.experiment.minSample': 'Мінімальна кількість постів на варіант',
  'analytics.experiment.minSampleHelp':
    'Нижче цієї кількості результат відображається як непереконливий, а не як переможець.',
  'analytics.experiment.status.planned': 'Планується',
  'analytics.experiment.status.collecting':
    'Колекціонування. {published} з {target} опублікованих дописів.',
  'analytics.experiment.status.inconclusive': 'Повний, без явної різниці',
  'analytics.experiment.result.difference':
    '{variant}записані {percent} більше {metric} ніж {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'Два варіанти в середині {percent} один одного на {metric}. Це в межах діапазону, яким ці публікації в будь-якому випадку відрізняються.',
  'analytics.experiment.result.association':
    'Це асоціація, яка вимірюється {count, plural, one {# пост} few {# пости} many {# пости} other {# пости}}. Це не доводить, що зміна спричинила різницю.',
  'analytics.experiment.result.unavailable':
    '{metric}був недоступний для {count, plural, one {# пост} few {# пости} many {# пости} other {# пости}} в цьому експерименті, тому ці публікації виключаються, а не зараховуються як нуль.',
  'analytics.experiment.result.title': 'Результат',
  'analytics.experiment.completeNow': 'Закрийте цей експеримент',
  'analytics.experiment.completeConfirm':
    'Закриття зупиняє збір. Пости залишаються опублікованими, а номери залишаються доступними.',
  'analytics.experiment.postsTitle': 'Публікації в цьому експерименті',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Завантаження аналітики для вибраних облікових записів',
  'analytics.state.loadingProvider': 'Отримання {provider} аналітика',
  'analytics.state.empty': 'У цьому діапазоні нічого не опубліковано',
  'analytics.state.emptyBody':
    'Аналітика описує публікації, які вже вийшли. Опублікуйте щось або розширте діапазон дат.',
  'analytics.state.emptyExample':
    'Щойно публікація опублікована, ви побачите такий рядок: X @acme, «Запуск ланцюжка», 12 400 показів, що на 58 відсотків вище медіани попередніх 10.',
  'analytics.state.errorTitle': 'Не вдалося завантажити аналітику',
  'analytics.state.errorBody':
    'Число не відображається, а вгадане. Ваші публікації та квитанції не впливають.',
  'analytics.state.partialTitle': '{loaded}з {total} дані облікових записів повернуто',
  'analytics.state.partialBody':
    'Облікові записи, які відповіли, показані з їх власною свіжістю. Решта перераховані з причиною, чому вони цього не зробили.',
  'analytics.state.partialSucceeded': 'Повернені дані',
  'analytics.state.partialFailed': 'Не повернув дані',
  'analytics.state.offlineTitle': 'Ви офлайн',
  'analytics.state.offlineBody':
    'Наведені нижче малюнки було завантажено до того, як з’єднання було розірвано, тому вони старіші, ніж вказано на мітках актуальності.',
  'analytics.state.permissionTitle': 'Ви не можете бачити аналітику в цій робочій області',
  'analytics.state.permissionBody':
    'Analytics потрібна роль аналітика або вище. Власник або адміністратор цієї робочої області може надати її.',
  'analytics.state.rateLimitTitle': '{provider}обмежує швидкість аналітичних запитів',
  'analytics.state.rateLimitCause':
    'Обліковий запис використав свою частку квоти постачальника для цього вікна. Relay не повторює ще більше, оскільки це призведе до затримки публікації.',
  'analytics.state.rateLimitAlternative':
    'Звужте діапазон дат або фільтр облікового запису, який вимагає від постачальника менше.',
  'analytics.state.rateLimitReset': 'Прохання резюме',
  'analytics.state.reference': 'Діагностична довідка',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Створіть відстежене посилання',
  'analytics.links.empty': 'Поки немає відстежених посилань',
  'analytics.links.emptyBody':
    'Відстежуване посилання: це коротке переспрямування URL Relay, тож ви можете бачити кліки, навіть якщо платформа не повідомляє про них. Початкове призначення ніколи не змінюється без запису аудиту.',
  'analytics.links.emptyExample':
    'Приклад: relay.to/a7Kq2 переспрямовує на acme.com/blog/launch із кампанією q3-launch.',
  'analytics.links.table.caption':
    'Враховуються відстежувані посилання в цій робочій області та їхні перші кліки.',
  'analytics.links.campaign': 'Кампанія',
  'analytics.links.created': 'Створено',
  'analytics.links.usedIn':
    '{count, plural, =0 {У публікації ще не використано} one {Використовується в # пост} few {Використовується в # пости} many {Використовується в # пости} other {Використовується в # пости}}',
  'analytics.links.state.active': 'Активний',
  'analytics.links.state.expired': 'Термін дії минув{date}',
  'analytics.links.state.disabled': 'Вимкнено',
  'analytics.links.state.disabledAt':
    'Вимкнено {date}. Це коротке посилання більше не переспрямовує.',
  'analytics.links.state.blocked': 'Заблоковано з міркувань безпеки',
  'analytics.links.state.blockedBody':
    'Переспрямування недоступне, оскільки адреса призначення не пройшла перевірку безпеки. Змініть адресу або зверніться до підтримки.',
  'analytics.links.state.disabledReason': 'Вимкнено {actor} на {date}. Записано причину: {reason}.',
  'analytics.links.detailTitle': 'Відстежене посилання{slug}',
  'analytics.links.exactRedirect': 'Точне перенаправлення',
  'analytics.links.exactRedirectHelp':
    'Це місце призначення, до якого відвідувач досягає прямо зараз, включаючи всі параметри UTM, які відображаються повністю, а не скорочуються.',
  'analytics.links.editDestination': 'Змініть пункт призначення',
  'analytics.links.editDestinationWarning':
    'Зміна пункту призначення впливає на всі місця, де вже було опубліковано це посилання. У звітах за періоди до зміни зберігається адресат, який був активним на той момент.',
  'analytics.links.editDestinationAudit':
    'Зміна реєструється в журналі аудиту з вашим іменем, старим і новим призначенням.',
  'analytics.links.destinationHistory': 'Історія призначення',
  'analytics.links.destinationHistoryRow': '{destination}, активний з {start} до{end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, активний з{start}',
  'analytics.links.domainLabel': 'Короткий домен',
  'analytics.links.domainDefault': 'Домен за замовчуванням Relay',
  'analytics.links.domainVerified': 'Перевірено DNS увімкнено{date}',
  'analytics.links.domainPending': 'Очікування запису DNS',
  'analytics.links.domainPendingHelp':
    'Додайте запис TXT нижче за адресою {domain}, потім перевірте ще раз. Поки він не перевірився, цей домен не можна вибрати для нового посилання.',
  'analytics.links.domainFailed': 'Запис DNS не збігається{date}',
  'analytics.links.domainCheck': 'Ще раз перевірте DNS',
  'analytics.links.expiry': 'Термін дії',
  'analytics.links.expiryNone': 'Термін дії не встановлено',
  'analytics.links.expiryHelp':
    'Після закінчення терміну дії посилання повертає звичайну сторінку, яка повідомляє, що воно закінчилося. Він ніколи не мовчки спрямований кудись ще.',
  'analytics.links.disable': 'Відключити це посилання зараз',
  'analytics.links.disableTitle': 'Вимкнути {slug}?',
  'analytics.links.disableBody':
    'Відвідувачі переходять на сторінку, повідомляючи, що посилання більше не доступне. Опубліковані дописи все ще містять короткий URL, тому його бачать усі, хто натискає.',
  'analytics.links.disableReason': 'Причина відключення',
  'analytics.links.enable': 'Увімкніть це посилання знову',
  'analytics.links.abuseTitle': 'Повідомити про порушення цього посилання',
  'analytics.links.abuseBody':
    'Якщо цей короткий URL використовується для чогось, чого ви не мали на меті, повідомте про це, і переспрямування буде призупинено на час його перевірки.',
  'analytics.links.abuseAction': 'Повідомити про це посилання',
  'analytics.links.measurementLabel': 'Перше вимірювання перенаправлення',
  'analytics.links.measurementExplained':
    'Relay зараховує запит, коли служба переадресації запитується для цього URL. Дедуплікований клік видаляє повторні запити від того самого відвідувача всередині короткого вікна, а запити, які відповідають відомим шаблонам сканера, виключаються, а не видаляються.',
  'analytics.links.botsNote':
    '{count, plural, one {#запит} few {# запити} many {# запити} other {# запити}} були класифіковані як автоматизовані та виключені з дедуплікованого підрахунку.',
  'analytics.links.series.title': 'Запити та дедупліковані кліки з часом',
  'analytics.links.series.requests': 'Всього запитів',
  'analytics.links.series.clicks': 'Дедупліковані кліки',
  'analytics.links.breakdownTitle': 'Звідки взялися клацання',
  'analytics.links.breakdown.share': '{percent}дедуплікованих кліків',
  'analytics.links.referrer.direct': 'Реферер не надіслано',
  'analytics.links.referrer.social': 'Соціальна платформа',
  'analytics.links.referrer.search': 'Пошукова система',
  'analytics.links.referrer.email': 'Поштовий клієнт',
  'analytics.links.referrer.other': 'Інший сайт',
  'analytics.links.device.mobile': 'Мобільний',
  'analytics.links.device.desktop': 'Робочий стіл',
  'analytics.links.device.tablet': 'планшет',
  'analytics.links.device.unknown': 'Не визначено',
  'analytics.links.countryUnknown': 'Країна не визначена',
  'analytics.links.lastEventLabel': 'Останній клік',
  'analytics.links.noEvents': 'Ще не зафіксовано кліків',
  'analytics.links.noEventsBody':
    'Це посилання не запитувалося з моменту його створення. Це справжній нуль, виміряний нашою власною службою переадресації.',
  'analytics.links.compareWarning':
    '{provider}звіти {providerValue} кліків посилань для цієї публікації. Relay записано {relayValue} дедуплікованих кліків. Ці дві враховують різні події, і жодна не замінює інше.',
  'analytics.links.errorTitle': 'Не вдалося завантажити статистику посилання',
  'analytics.links.errorBody':
    'Служба перенаправлення все ще працює, тому посилання продовжує надсилати відвідувачів до місця призначення. Впливає лише на звітність.',
  'analytics.links.createDestination': 'Пункт призначення URL',
  'analytics.links.createDestinationHelp':
    'Це має бути загальнодоступна адреса https. Адреси приватних мереж і ланцюжки перенаправлення відхиляються службою перенаправлення.',
  'analytics.links.createCampaign': 'Назва кампанії',
  'analytics.links.createSlug': 'Нестандартне закінчення',
  'analytics.links.createSlugHelp':
    'Залиште це поле пустим, і Relay згенерує коротку випадкову кінцівку.',
  'analytics.links.createUtm': 'Параметри UTM',
  'analytics.links.blockedScheme': 'Приймаються лише адреси https.',
  'analytics.links.blockedPrivate':
    'Ця адреса знаходиться в приватній мережі, тому служба перенаправлення її не прийме.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'правила',
  'automation.tab.feeds': 'RSS-канали',
  'automation.tab.label': 'Розділи автоматизації',

  'automation.rules.table.caption': 'Правила автоматизації в цій робочій області.',
  'automation.rules.table.rule': 'правило',
  'automation.rules.table.state': 'Держава',
  'automation.rules.table.accounts': 'Облікові записи',
  'automation.rules.table.lastRun': 'Останній запуск',
  'automation.rules.table.nextCheck': 'Наступна перевірка',
  'automation.rules.neverRun': 'Ще не запускається',
  'automation.rules.emptyExample':
    'Приклад: коли в каналі блогу Acme з’являється новий елемент, якщо мова англійська, створіть чернетку з шаблону оголошення блогу та подайте запит на схвалення.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {Облікові записи не вибрано} one {# рахунок} few {# облікові записи} many {# облікові записи} other {# облікові записи}}',
  'automation.rules.openRule': 'ВІДЧИНЕНО{name}',
  'automation.rules.duplicateRule': 'дублікат{name}',
  'automation.rules.deleteTitle': 'Видалити {name}?',
  'automation.rules.deleteBody':
    'Правило негайно зупиняється, а історія його виконання зберігається для журналу аудиту. Це не впливає на вже створені дописи.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed':
    'не вдається виконати запланований коментар або елемент ланцюжка',

  'automation.condition.timeWindow': 'час між {start} і {end} в{timeZone}',
  'automation.condition.domainPresent': 'текст посилається на{domain}',
  'automation.condition.hashtagPresent': 'текст містить хештег{hashtag}',
  'automation.condition.providerCapability': 'обліковий запис дійсно можна зробити{capability}',
  'automation.condition.planStatus': 'підписка активна',

  'automation.action.continueSequence': 'продовжити підготовлену тему або послідовність коментарів',
  'automation.action.notifyEmail': 'надіслати електронний лист на адресу{target}',
  'automation.action.notifyWebhook': 'надіслати вебхук до{target}',
  'automation.action.pauseConnection': 'призупинити відповідний обліковий запис',
  'automation.action.quotePost': 'один раз процитуйте вихідний пост',
  'automation.action.followUpComment': 'додати готовий коментар до вихідного допису',

  'automation.param.feed': 'годувати',
  'automation.param.template': 'Шаблон',
  'automation.param.signature': 'Підпис',
  'automation.param.disclosure': 'Розкриття',
  'automation.param.locale': 'Мова',
  'automation.param.project': 'Project',
  'automation.param.campaign': 'Кампанія',
  'automation.param.account': 'Обліковий запис',
  'automation.param.platform': 'Платформа',
  'automation.param.contentType': 'Тип вмісту',
  'automation.param.keyword': 'Ключове слово',
  'automation.param.hashtag': 'Хештег',
  'automation.param.domain': 'Домен',
  'automation.param.capability': 'Можливість',
  'automation.param.timeZone': 'Часовий пояс',
  'automation.param.startTime': 'Від',
  'automation.param.endTime': 'до',
  'automation.param.duration': 'Тривалість',
  'automation.param.metric': 'Метрика',
  'automation.param.value': 'Значення',
  'automation.param.target': 'Надіслати до',
  'automation.param.time': 'час',
  'automation.param.cadence': 'Як часто',
  'automation.param.notSet': 'не встановлено',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Назва правила',
  'automation.editor.namePlaceholder': 'Блог до соціальних мереж',
  'automation.editor.when': 'Коли',
  'automation.editor.if': 'Якщо',
  'automation.editor.then': 'Потім',
  'automation.editor.after': 'Після',
  'automation.editor.until': 'Поки',
  'automation.editor.sentenceLabel': 'Правило речення',
  'automation.editor.readBack': 'Прочитайте речення, перш ніж увімкнути це. Це все правило.',
  'automation.editor.chooseTrigger': 'Виберіть, з чого починається це правило',
  'automation.editor.addCondition': 'Додайте умову',
  'automation.editor.addAction': 'Додайте дію',
  'automation.editor.removeCondition': 'Видалити умову{label}',
  'automation.editor.removeAction': 'Видалити дію{label}',
  'automation.editor.moveActionUp': 'рухатися {label} раніше...',
  'automation.editor.moveActionDown': 'рухатися {label} пізніше',
  'automation.editor.actionOrder': 'Дії виконуються в такому порядку, зверху вниз.',
  'automation.editor.noConditions':
    'Жодних умов. Правило виконується кожного разу, коли воно запускається.',
  'automation.editor.noActions': 'Поки що жодних дій. Правило без дії неможливо зберегти.',
  'automation.editor.delayNone': 'без затримки',
  'automation.editor.delayLabel': 'Затримка перед виконанням дій',
  'automation.editor.endLabel': 'Коли це правило припиняється',
  'automation.editor.end.manual': 'Я вимикаю це',
  'automation.editor.end.date': 'дата, яку я вибираю',
  'automation.editor.end.count':
    'воно побігло {count, plural, one {# час} few {# разів} many {# разів} other {# разів}}',
  'automation.editor.end.dateValue': 'Зупиніться',
  'automation.editor.end.countValue': 'Зупиніться після такої кількості пробіжок',
  'automation.editor.parameterFor': 'Налаштування для{label}',
  'automation.editor.saveDraft': 'Зберегти як чернетку',
  'automation.editor.savedAt': 'Збережено{time}',
  'automation.editor.unsaved': 'Незбережені зміни',

  'automation.editor.view.sentence': 'Речення',
  'automation.editor.view.structured': 'Структурований',
  'automation.editor.view.api': 'Представлення API',
  'automation.editor.view.label': 'Вид редактора',
  'automation.editor.apiHelp':
    'Це саме те, що надсилають сервери REST API, CLI і MCP. Редагування тут і повернення до речення зберігає кожне поле.',
  'automation.editor.apiInvalid':
    'Це недійсне правило JSON, тому його не було застосовано:{reason}',
  'automation.editor.apiApply': 'Застосуйте цей JSON',
  'automation.editor.structuredHelp':
    'Те саме правило, що й поля. Використовуйте це, коли правило має багато умов і речення стає довгим.',

  'automation.editor.error.noAction': 'Додайте принаймні одну дію перед збереженням.',
  'automation.editor.error.noTrigger': 'Виберіть тригер перед збереженням.',
  'automation.editor.error.noAccounts':
    'Виберіть принаймні один обліковий запис, на який може діяти це правило.',
  'automation.editor.error.missingParameter': '{label}потребує значення.',
  'automation.editor.error.summary':
    '{count, plural, one {#річ потребує вашої уваги} few {# речі потребують вашої уваги} many {# речі потребують вашої уваги} other {# речі потребують вашої уваги}} перш ніж це правило можна зберегти.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'З чого починається це правило',
  'automation.picker.conditionTitle': 'Додайте умову',
  'automation.picker.actionTitle': 'Додайте дію',
  'automation.picker.search': 'Відфільтрувати цей список',
  'automation.picker.noResults': 'Ніщо в цьому списку не відповідає тому, що ви ввели.',
  'automation.picker.groupContent': 'Зміст',
  'automation.picker.groupPublishing': 'Видавництво',
  'automation.picker.groupNotify': 'Люди і системи',
  'automation.picker.groupControl': 'Контроль правил',
  'automation.picker.groupSchedule': 'час',
  'automation.picker.groupExternal': 'Зовнішні події',
  'automation.picker.groupMeasurement': 'Вимірювання',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {#дія є} few {# дії є} many {# дії є} other {# дії є}} немає в списку, після вибраних облікових записів не можна їх виконати.',
  'automation.picker.hiddenDetail': '{action}недоступний для {provider}.{reason}',
  'automation.picker.consequential': 'Створює щось на платформі',
  'automation.picker.internalOnly': 'Залишається всередині Relay',

  'automation.accounts.label': 'Облікові записи, на які може діяти це правило',
  'automation.accounts.help':
    'Правило ніколи не може стосуватися облікового запису, якого тут не зазначено, незалежно від його умов.',
  'automation.accounts.none': 'Облікові записи ще не вибрано',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Правила вимірювання для цього тригера',
  'automation.threshold.intro':
    'Правило, яке реагує на число, має знати, яке число, виміряне протягом якого періоду, і як часто воно може діяти.',
  'automation.threshold.metric': 'Показник для перегляду',
  'automation.threshold.value': 'Порогове значення',
  'automation.threshold.window': 'Вікно вимірювання',
  'automation.threshold.windowHelp':
    'Враховується з моменту публікації вихідного допису. За межами цього вікна правило припиняє перегляд публікації.',
  'automation.threshold.expiry': 'Припиніть перегляд публікації після',
  'automation.threshold.cooldown': 'Перезарядка між виконаннями',
  'automation.threshold.cooldownHelp':
    'Найкоротший час, дозволений між двома запусками для однієї публікації джерела.',
  'automation.threshold.maxPerPost': 'Максимальна кількість виконань на вихідний пост',
  'automation.threshold.defaultsTitle':
    'Значення за замовчуванням залишаються активними, доки ви їх не зміните',
  'automation.threshold.defaultOncePerPost': 'Запускати один раз на вихідне повідомлення.',
  'automation.threshold.defaultStale':
    'Не виконуйте, якщо метрика відсутня або застаріла. Використовується межа свіжості {duration}.',
  'automation.threshold.staleLimit': 'Лікувати метрику як застарілу після',
  'automation.threshold.providerNote':
    '{provider}звіти {metric} із затримкою, тому це правило може діяти лише після того, як постачальник публікує номер.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Подальші дії з іншого облікового запису',
  'automation.crossAccount.off': 'Вимкнено. Це правило діє лише для вихідного облікового запису.',
  'automation.crossAccount.enable': 'Дозволити продовження з іншого облікового запису',
  'automation.crossAccount.body':
    'Обидва облікові записи мають бути підключені до цієї робочої області, і обидва мають бути названі тут. Подальше повідомлення: це підготовлена ​​публікація, яку ви пишете заздалегідь, і вона проходить ту саму політику схвалення, що й будь-яке інше.',
  'automation.crossAccount.sourceAccount': 'Вихідний рахунок',
  'automation.crossAccount.followUpAccount': 'Обліковий запис, який публікує додаткову інформацію',
  'automation.crossAccount.preauthorize':
    'Я підтверджую, що ця робоча область керує обома {sourceAccount} і {followUpAccount}, а подальші дії не представлені як незалежне схвалення.',
  'automation.crossAccount.preauthorizeRequired':
    'Підтвердьте попередню авторизацію, перш ніж це правило можна буде зберегти.',
  'automation.crossAccount.duplicateCheck':
    'Перевірка повторюваних облікових записів і каденції виконується перед подальшою обробкою, і вона пропускається, а не відкладається, якщо повторюється вихідна публікація.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro':
    'Все, що це правило може зробити, перш ніж воно зможе зробити будь-що з цього.',
  'automation.preflight.accountsLabel': 'Облікові записи, на які він може діяти',
  'automation.preflight.maxActionsLabel': 'Більшість зовнішніх дій за прогін',
  'automation.preflight.maxActionsPeriod':
    'Щонайбільше {count, plural, one {# зовнішня дія} few {# зовнішні дії} many {# зовнішні дії} other {# зовнішні дії}} в {period}.',
  'automation.preflight.approvalLabel': 'Затвердження',
  'automation.preflight.approvalNone':
    'Жодна дія в цьому правилі не створює нічого на платформі, тому схвалення не застосовується.',
  'automation.preflight.providerLabel': 'Обмеження провайдера',
  'automation.preflight.providerNone': 'Жодне не застосовується до дій у цьому правилі.',
  'automation.preflight.costLabel': 'Орієнтовна вимірна вартість',
  'automation.preflight.costUnknown':
    'Неможливо оцінити вартість цих дій, поки не буде відома ціна постачальника.',
  'automation.preflight.costMethod':
    'Приблизно з прайс-листа постачальника на {date}. У квітації зазначається, що фактично нараховано.',
  'automation.preflight.cadenceLabel': 'Каденція та дублікати',
  'automation.preflight.cadenceBody':
    'Перевірка дублікатів і каденції запускається перед кожною дією. Дія, яка перевищить бюджет частоти для облікового запису, пропускається та записується, а не ставиться в чергу.',
  'automation.preflight.failureLabel': 'Якщо запуск не вдається',
  'automation.preflight.failure.pauseAfter':
    'Правило призупиняється після {count, plural, one {# послідова невдача} few {# наступні невдачі} many {# наступні невдачі} other {# наступні невдачі}} і дає завдання.',
  'automation.preflight.failure.continue':
    'Правило продовжує працювати, і кожна помилка реєструється в журналі виконання.',
  'automation.preflight.exampleLabel': 'Приклад запуску',
  'automation.preflight.exampleIntro': 'Використовуючи останню подію, цей тригер збігався б.',
  'automation.preflight.exampleNone':
    'Жодної відповідної події ще не відбулося, тому не можна показати приклад. Натомість запустіть тестову подію.',
  'automation.preflight.activate': 'Увімкніть це правило',
  'automation.preflight.activateConfirmTitle': 'Увімкніть {name}?',
  'automation.preflight.activateConfirmBody':
    'Відтепер це правило діє без попереднього запиту у вас у межах, зазначених вище.',
  'automation.preflight.blocked':
    'Це правило ще не можна вимкнути. {count, plural, one {# пункт} few {# елементи} many {# елементи} other {# елементи}} вище потребує рішення.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Тестовий захід',
  'automation.test.body':
    'Тестовий запуск оцінює все речення та показує, що воно буде робити. Він ніколи не публікує, ніколи не публікує коментарі та ніколи не надсилає вебхук до реальної кінцевої точки.',
  'automation.test.useLastEvent': 'Використовуйте останню відповідну подію',
  'automation.test.usePayload': 'Вставте корисне навантаження події',
  'automation.test.run': 'Запустіть тест',
  'automation.test.running': 'Виконання тесту',
  'automation.test.resultTitle': 'Що зробив тест',
  'automation.test.conditionPassed': '{condition}пройшли',
  'automation.test.conditionFailed': '{condition}не пройшов, тому правило тут зупинилося',
  'automation.test.actionSimulated': '{action}біг би',
  'automation.test.actionSkipped': '{action}буде пропущено:{reason}',
  'automation.test.noExternalEffect': 'Під час цього тесту Relay нічого не залишилося.',
  'automation.test.failed': 'Тест не виконується:{reason}',

  'automation.runs.table.caption': 'Останні запуски цього правила.',
  'automation.runs.startedAt': 'розпочато',
  'automation.runs.outcome.label': 'Результат',
  'automation.runs.actionsTaken': 'Дії',
  'automation.runs.trigger': 'Спровоковано',
  'automation.runs.outcome.completed': 'Виконано',
  'automation.runs.outcome.skipped': 'Пропущено',
  'automation.runs.outcome.failed': 'Не вдалося',
  'automation.runs.outcome.testMode': 'Тестовий режим',
  'automation.runs.actionCount':
    '{count, plural, =0 {Без зовнішніх дій} one {# зовнішня дія} few {# зовнішні дії} many {# зовнішні дії} other {# зовнішні дії}}',
  'automation.runs.skippedReason': 'Пропущено, тому що{reason}',
  'automation.runs.openDetail': 'Відкрити біг від{time}',
  'automation.runs.createdItems': 'Створено',

  'automation.versions.caption': 'Кожна збережена версія цього правила.',
  'automation.versions.current': 'поточний',
  'automation.versions.savedBy': 'Збережено {actor} на{date}',
  'automation.versions.compare': 'Порівняти з поточною версією',
  'automation.versions.restore': 'Відновити цю версію',
  'automation.versions.restoreConfirm':
    'Відновлення створює нову версію. Ніщо не перезаписується, і правило залишається в поточному стані, доки ви його не ввімкнете.',
  'automation.versions.diffTitle': 'Версія {from} такими з версією{to}',

  'automation.kill.title': 'Стоп {name} зараз',
  'automation.kill.body':
    'Правило припиняється негайно, посеред пробіжки, якщо таке відбувається. Усе, що вже було надіслано на платформу, залишається опублікованим, оскільки зовнішня публікація ніколи не відкочується.',
  'automation.kill.confirmPhrase': 'СТОП',
  'automation.kill.confirmLabel': 'Введіть STOP для підтвердження',
  'automation.kill.stopped':
    'Це правило було зупинено {actor} на {date}. Він не може запуститися знову, доки ви його не ввімкнете.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Правила автоматизації завантаження',
  'automation.state.loadingRule': 'Завантаження правила та його останніх запусків',
  'automation.state.errorTitle': 'Не вдалося завантажити правила',
  'automation.state.errorBody':
    'Це не впливає на правила, які вже виконуються. Тільки цей екран вийшов з ладу.',
  'automation.state.offlineTitle': 'Ви офлайн',
  'automation.state.offlineBody':
    'Ви можете читати правило та редагувати чернетку, і воно залишається на цьому пристрої. Для збереження, перевірки та ввімкнення правила потрібне підключення.',
  'automation.state.permissionTitle': 'Ви не можете змінити правила автоматизації',
  'automation.state.permissionBody':
    'Правила діють на підключених облікових записах, тому для зміни одного потрібна роль менеджера або вище. Ви все ще можете читати кожне правило та історію його виконання.',
  'automation.state.rateLimitTitle': 'Виконання правил сповільнюється',
  'automation.state.rateLimitCause':
    'Ця робоча область досягла дозволу на автоматизований запуск для поточного вікна. Це не впливає на заплановані публікації та ручну публікацію.',
  'automation.state.rateLimitAlternative':
    'Правила з каденцією можуть мати довший інтервал, що передбачає менше пробіжок.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Перетворіть канал на чернетки або заплановані публікації з такою ж перевіркою та схваленням, як і будь-що, що ви пишете самі.',
  'automation.rss.empty': 'Ще немає каналів',
  'automation.rss.emptyBody':
    'Додайте канал, і Relay перевірить його за розкладом. Кожен новий елемент стає чернеткою, запланованим дописом або запитом на схвалення, залежно від того, що ви виберете.',
  'automation.rss.emptyExample':
    'Приклад: канал блогу Acme створює чернетку для X і LinkedIn щоразу, коли публікується стаття, і чекає на схвалення.',
  'automation.rss.table.caption': 'Подає опитування цієї робочої області.',
  'automation.rss.table.feed': 'годувати',
  'automation.rss.table.policy': 'Що відбувається з новим предметом',
  'automation.rss.table.health': "Здоров'я",

  'automation.rss.step.url': 'Адреса каналу',
  'automation.rss.step.preview': 'Перевірте подачу',
  'automation.rss.step.seen': 'Відправна точка',
  'automation.rss.step.targets': 'Куди воно йде',
  'automation.rss.step.template': 'Що сказано в дописі',
  'automation.rss.step.policy': 'Як це видається',
  'automation.rss.stepOf': 'Крок {current} з{total}',

  'automation.rss.urlHelp':
    'Relay отримує канал з наших серверів, а не з вашого браузера. Приватні мережеві адреси не надаються.',
  'automation.rss.validateAction': 'Перевірте цей канал',
  'automation.rss.validateFailed': 'Ця адреса не повернула читабельний канал',
  'automation.rss.validateFailedReason': 'Що я отримав назад:{reason}',
  'automation.rss.validateBlocked':
    'Ця адреса вказує на приватну мережу, тому її не було отримано.',
  'automation.rss.previewTitle': 'Попередній перегляд каналу',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# пункт} few {# елементи} many {# елементи} other {# елементи}} повернуто, спочатку найновіші.',
  'automation.rss.previewItemPublished': 'Опубліковано{dateTime}',
  'automation.rss.previewNoImage': 'У цьому елементі немає зображення',
  'automation.rss.previewImageAlt': 'Зображення з елемента каналу{title}',
  'automation.rss.previewNoDate':
    'Цей елемент не має позначки часу, тому Relay використовує час, коли його вперше побачив.',
  'automation.rss.previewFieldsTitle': 'Поля, які надає цей канал',
  'automation.rss.previewFieldMissing': 'Немає в цій стрічці',

  'automation.rss.seenTitle': 'Те, що вважається вже побаченим',
  'automation.rss.seenLatest':
    'Розглядайте все, що зараз є в каналі, як видно. Публікуються лише майбутні елементи.',
  'automation.rss.seenAll':
    'Розглядайте найновіший товар як новий і опублікуйте його під час наступної перевірки.',
  'automation.rss.seenHelp':
    'Більшість каналів містять старі статті. Вибравши перший варіант, ви зможете уникнути публікації резерву.',

  'automation.rss.targetsHelp':
    'Виберіть облікові записи або збережену групу. Кожна ціль все одно отримує власну перевірку перед тим, як щось буде заплановано.',
  'automation.rss.targetGroup': 'Збережена група',
  'automation.rss.targetIndividual': 'Індивідуальні рахунки',

  'automation.rss.templateFields': 'Доступні поля',
  'automation.rss.templateInsert': 'Вставка{field}',
  'automation.rss.templateField.title': 'Назва предмета',
  'automation.rss.templateField.summary': 'Резюме предмета',
  'automation.rss.templateField.link': 'Посилання на товар',
  'automation.rss.templateField.author': 'Автор предмета',
  'automation.rss.templateField.published': 'Дата публікації',
  'automation.rss.templateField.categories': 'Категорії',
  'automation.rss.templatePreview': 'Попередній перегляд із найновішим елементом',
  'automation.rss.adaptWithAi': 'Адаптуйте текст для кожної цілі',
  'automation.rss.adaptHelp':
    'Формулювання переписується відповідно до кожної платформи та відображається як відмінність, яку ви приймаєте або відхиляєте. Медіафайли надходять із елемента каналу. Relay не створює зображень.',
  'automation.rss.noImageGeneration':
    'Якщо елемент каналу не має зображення, публікація виходить без нього.',
  'automation.rss.imageFromFeed': 'Використовуйте зображення з елемента каналу, якщо воно є',

  'automation.rss.policyHelp':
    'Пункт корму не є особливим. Він дотримується тієї ж політики схвалення, що й публікація, яку ви пишете самі.',
  'automation.rss.cadenceInterval': 'Щонайбільше один товар',
  'automation.rss.cadenceHelp':
    'Додаткові елементи чекають у черзі, а не публікуються разом, тому стрічка, яка публікує десять статей одночасно, не заповнює обліковий запис.',
  'automation.rss.immediateWarning':
    'Негайна публікація надсилає допис на платформу без попереднього читання. Він доступний, лише якщо це дозволяє політика затвердження для цих облікових записів.',

  'automation.rss.healthTitle': "Нагодуй здоров'я",
  'automation.rss.healthOk': 'Працює',
  'automation.rss.healthStalled': 'Немає нового товару для{duration}',
  'automation.rss.healthFailing':
    'Останній {count, plural, one {перевірити} few {# чеки} many {# чеки} other {# чеки}} не відвід',
  'automation.rss.health.nextPoll': 'Наступна перевірка{relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Ще немає оброблених елементів} one {# елемент оброблено} few {# оброблено елементів} many {# оброблено елементів} other {# оброблено елементів}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {Дублікатів не пропущено} one {# дублікат пропущено} few {# дублікатів пропущено} many {# дублікатів пропущено} other {# дублікатів пропущено}}',
  'automation.rss.health.lastPollLabel': 'Востаннє перевірено',
  'automation.rss.health.lastItemLabel': 'Останній новий елемент у стрічці',
  'automation.rss.health.lastPostLabel': 'Остання створена чернетка або публікація',
  'automation.rss.health.processedLabel': 'Предмети оброблено',
  'automation.rss.recentItems': 'Останні предмети',
  'automation.rss.itemOutcome.draft': 'Чернетку створено',
  'automation.rss.itemOutcome.scheduled': 'Заплановано на{time}',
  'automation.rss.itemOutcome.published': 'Опубліковано',
  'automation.rss.itemOutcome.awaitingApproval': 'Очікування затвердження',
  'automation.rss.itemOutcome.duplicate': 'Проскочив, вже бачив',
  'automation.rss.itemOutcome.failed': 'Помилка:{reason}',
  'automation.rss.pauseFeed': 'Призупинити цей канал',
  'automation.rss.resumeFeed': 'Відновити цей канал',
  'automation.rss.deleteTitle': 'видалити {title}?',
  'automation.rss.deleteBody':
    'Relay припиняє перевірку цього каналу. Чернетки та публікації, створені ним, залишаються такими, як вони є.',
  'automation.rss.errorTitle': 'Не вдалося прочитати цей канал',
  'automation.rss.errorBody':
    'Relay продовжує перевірку за звичайним графіком. З часткової відповіді нічого не було опубліковано.',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'Недоступно в жодному правилі',
  'automation.refuse.body':
    'Автоматичні лайки та підписки, групи взаємодії, небажані відповіді та повідомлення, а також публікація того самого вмісту з кількох облікових записів, щоб зробити його популярним, тут не є варіантами. Платформи забороняють їх, і вони завдають шкоди обліковим записам, які їх використовують.',
  'automation.refuse.readPolicy': 'Прочитайте політику прийнятного використання',
} as const;
