/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'Facebook',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Threads',
  'web.provider.bluesky': 'Bluesky',
  'web.provider.mastodon': 'Mastodon',
  'web.provider.telegram': 'Telegram',
  'web.provider.reddit': 'Reddit',
  'web.provider.wordpress': 'WordPress',
  'web.provider.medium': 'Medium',
  'web.provider.devto': 'Dev.to',
  'web.provider.pinterest': 'Pinterest',
  'web.provider.discord': 'Discord',
  'web.provider.slack': 'Slack',
  'web.connection.requirement.mastodon':
    'Mastodon підключається за токеном доступу, створеним на вашому сервері, а не за паролем.',
  'web.connection.requirement.telegram':
    'Relay публікує від імені бота. Додайте бота в канал або групу, куди хочете публікувати.',
  'web.connection.requirement.reddit':
    'Запис у Reddit вимагає схваленого застосунку, а кожній публікації потрібні заголовок і сабредит.',
  'web.connection.requirement.wordpress':
    'Relay публікує через REST API сайту з паролем застосунку, створеним у WordPress.',
  'web.connection.requirement.medium':
    'Medium підключається через OAuth, і Relay публікує відкриті історії в Markdown.',
  'web.connection.requirement.devto':
    'Dev.to підключається за API-ключем, створеним у налаштуваннях Dev.to.',
  'web.connection.requirement.pinterest':
    'Запис у Pinterest вимагає схваленого доступу застосунку, а піну потрібні зображення і власна дошка.',
  'web.connection.requirement.discord':
    'Relay публікує від імені бота. Додайте бота на сервери й у канали, куди хочете публікувати.',
  'web.connection.requirement.slack':
    'Relay публікує від імені застосунку. Додайте застосунок у канали, куди хочете публікувати.',
  'web.provider.fake': "Тестовий роз'єм",

  'web.accountType.personal_profile': 'Особистий профіль',
  'web.accountType.creator_profile': 'Обліковий запис творця',
  'web.accountType.business_profile': 'Бізнес рахунок',
  'web.accountType.page': 'Сторінка',
  'web.accountType.organization': 'організація',
  'web.accountType.channel': 'Канал',
  'web.accountType.group': 'Група',
  'web.accountType.board': 'дошка',
  'web.accountType.community': 'Спільнота',
  'web.accountType.publication': 'Публікація',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Все, що заплановано, очікує на затвердження, опубліковано чи заблоковано, в одному місці.',
  'web.calendar.view.agenda': 'Порядок денний',
  'web.calendar.view.table': 'Таблиця',
  'web.calendar.view.switchLabel': 'Виберіть спосіб оформлення розкладу',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start}до{end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'Показ {range} в{timeZone}',
  'web.calendar.timeZone.workspace': 'Workspace часовий пояс:{timeZone}',
  'web.calendar.timeZone.change': 'Зміна налаштувань робочого середовища',
  'web.calendar.jumpToDate': 'Перейдіть до побачення',
  'web.calendar.nowLabel': 'Зараз',
  'web.calendar.allDayHeading': 'Точного часу ще немає',

  'web.calendar.filter.group': 'Група клієнтів',
  'web.calendar.filter.anyBrand': 'Будь-який бренд',
  'web.calendar.filter.anyAccount': 'Будь-який рахунок',
  'web.calendar.filter.anyPlatform': 'Будь-яка платформа',
  'web.calendar.filter.anyStatus': 'Будь-який статус',
  'web.calendar.filter.anyLocale': 'Будь-яка мова контенту',
  'web.calendar.filter.anyCampaign': 'Будь-яка кампанія',
  'web.calendar.filter.anyGroup': 'Кожна група',
  'web.calendar.filter.regionLabel': 'Фільтруйте розклад',
  'web.calendar.bucket.scheduled': 'За розкладом',
  'web.calendar.bucket.draft': 'Проекти та погодження',
  'web.calendar.bucket.published': 'Опубліковано',
  'web.calendar.bucket.failed': 'Потребує уваги',
  'web.calendar.filter.summary':
    '{count, plural, =0 {Без фільтрів} one {# фільтр} few {# фільтри} many {# фільтри} other {# фільтри}}, {results, plural, =0 {немає дописів} one {# пост} few {# пости} many {# пости} other {# пости}}',

  'web.calendar.grid.label': 'Сітка розкладу для{range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Нічого в {time} на{date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {Показати # більше публікацій} few {Показати # більше дописів} many {Показати # більше дописів} other {Показати # більше дописів}}',
  'web.calendar.month.label': 'Місячна сітка для{month}',
  'web.calendar.agenda.label': 'Порядок денний для{range}',
  'web.calendar.agenda.dayHeading': '{weekday},{date}',
  'web.calendar.agenda.emptyDay': 'Нічого не заплановано',

  'web.calendar.table.caption': 'Кожна публікація в {range}, відсортовано за часом публікації.',
  'web.calendar.table.column.time': 'час',
  'web.calendar.table.column.account': 'Обліковий запис',
  'web.calendar.table.column.content': 'Зміст',
  'web.calendar.table.column.language': 'Мова',
  'web.calendar.table.column.media': 'ЗМІ',
  'web.calendar.table.column.status': 'Статус',
  'web.calendar.table.column.approver': 'Затверджувач',
  'web.calendar.table.column.campaign': 'Кампанія',
  'web.calendar.table.column.actions': 'Дії',
  'web.calendar.table.rowMenu': 'Дії для{title}',
  'web.calendar.table.noApprover': 'Схвалення не потрібне',
  'web.calendar.table.noCampaign': 'Жодної кампанії',

  'web.calendar.entry.untitled': 'Чернетка без назви',
  'web.calendar.entry.language': 'мова{locale}',
  'web.calendar.entry.openDetail': 'ВІДЧИНЕНО{title}',
  'web.calendar.entry.selected': '{title}вибрано.{hint}',
  'web.calendar.detail.title': 'Запланований пост',
  'web.calendar.detail.close': 'Закрийте цю публікацію',

  'web.calendar.keyboard.title': 'Перемістіть публікацію за допомогою клавіатури',
  'web.calendar.keyboard.body':
    'Виберіть публікацію та натисніть Enter, щоб відкрити її. Натисніть M, щоб підняти стовп, потім використовуйте клавіші зі стрілками, щоб перемістити його на одну позицію, і Enter для підтвердження. Натисніть Escape, щоб повернути його.',
  'web.calendar.keyboard.pickUp': 'Перемістити цю публікацію',
  'web.calendar.keyboard.grabbed':
    '{title}зібрано з {from}. Клавіші зі стрілками пересувають його. Enter підтверджує. Втеча скасовується.',
  'web.calendar.keyboard.moved': 'Пропонований час {to}. Enter підтверджує.',
  'web.calendar.keyboard.released': '{title}покласти назад на {from}.',
  'web.calendar.keyboard.stepMinutes': 'Кожен крок є {minutes} хвилин.',

  'web.calendar.reschedule.title': 'Перемістити цю публікацію?',
  'web.calendar.reschedule.subject': '{account}на{provider}',
  'web.calendar.reschedule.from': 'Від {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'до {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Перемістити пост',
  'web.calendar.reschedule.dstTitle': 'Годинники перемикаються між цими двома часами',
  'web.calendar.reschedule.dstBody':
    'Зміщення в {timeZone} є {fromOffset} за старого часу і {toOffset} в новий час. Місцева година, яку ви вибрали, зберігається, тому UTC миттєво зміщується.',
  'web.calendar.reschedule.conflictTitle': 'Інші пости близькі до цього часу',
  'web.calendar.reschedule.conflictBody':
    '{account}вже має {count, plural, one {# пост} few {# пости} many {# пости} other {# пости}} в межах {window} нового часу.',
  'web.calendar.reschedule.campaignTitle': 'Конфлікт кампанії',
  'web.calendar.reschedule.campaignBody':
    'компанія {campaign} біжить від {start} до {end}. Новий час за цим вікном.',
  'web.calendar.reschedule.leadTimeTitle': 'Це дуже скоро',
  'web.calendar.reschedule.leadTimeBody':
    'Новий час є {duration} відтепер. {provider} потреби {required} готувати цей медіа для типу публікацій.',
  'web.calendar.reschedule.pastTitle': 'Той час минув',
  'web.calendar.reschedule.pastBody': 'Виберіть час у майбутньому або опублікуйте зараз.',

  'web.calendar.published.title': 'Ця публікація вже опублікована',
  'web.calendar.published.body':
    'Публікація існує на {provider} в {permalinkLabel}. Переміщення запису в Relay не переміщує публікацію на платформі. Виберіть те, що ви хочете, щоб сталося.',
  'web.calendar.published.optionLocal': 'Оновлюйте лише локальний запис',
  'web.calendar.published.optionLocalHint':
    'Квитанція зберігає реальний час публікації. Зміщується лише запис про планування, тому ваш календар відповідає вашому плану.',
  'web.calendar.published.optionNew': 'Заплануйте нову публікацію на новий час',
  'web.calendar.published.optionNewHint':
    'Це створює другу окрему зовнішню посаду. Той, який уже включений {provider} є онлайн.',
  'web.calendar.published.optionLabel': 'Що повинно статися',

  'web.calendar.attention.title':
    '{count, plural, one {#публікація потребує рішення або виправлення} few {# повідомлення потребують рішення або виправлення} many {# повідомлення потребують рішення або виправлення} other {# повідомлення потребують рішення або виправлення}}',
  'web.calendar.attention.body': 'Вони залишаються тут і в центрі дії, доки не будуть вирішені.',
  'web.calendar.attention.open': 'Відкрийте центр дій',
  'web.calendar.attention.showOnly': 'Показати лише ці',

  'web.calendar.loading': 'Завантаження розкладу',
  'web.calendar.error.title': 'Не вдалося завантажити розклад',
  'web.calendar.error.body':
    'Нічого запланованого не змінилося. Ваші публікації все ще публікуються в запланований час.',
  'web.calendar.error.retry': 'Спробуйте знову',
  'web.calendar.empty.example':
    '09:30 Європа/Берлін, X @acme, «Заплановані перші коментарі опубліковані», заплановано, 1 зображення',
  'web.calendar.emptyFiltered.body':
    'Немає публікації {range} відповідає цим фільтрам. Розширте функцію або очистіть фільтр.',
  'web.calendar.offline.title': 'Ви офлайн',
  'web.calendar.offline.body':
    'Розклад нижче є останньою копією, завантаженою цим пристроєм. Перепланування та публікація недоступні, доки з’єднання не відновиться.',
  'web.calendar.rateLimited.cause':
    'Ця робоча область читає календар більше разів, ніж дозволяє поточне вікно.',
  'web.calendar.rateLimited.resetLabel': 'Ви можете спробувати ще раз',
  'web.calendar.rateLimited.resetUnknown': '{provider}не сказав, коли це скидається.',
  'web.calendar.permission.requirementsLabel': 'Необхідний обсяг',
  'web.calendar.permission.title': 'Ви не бачите цей календар',
  'web.calendar.permission.body':
    'Доступ до календаря надається кожному бренду. Ваш обліковий запис не відображається на брендах у цьому перегляді.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Календар',
  'web.receipt.breadcrumb.post': 'Опублікувати',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Завантаження квитанції про публікацію',
  'web.receipt.notFound.title': 'Немає квитанції з таким посиланням',
  'web.receipt.notFound.body':
    'Квитанція існує після того, як повідомлення було відправлено. Перевірте посилання або відкрийте публікацію з календаря.',
  'web.receipt.error.title': 'Не вдалося завантажити квитанцію',
  'web.receipt.error.body': 'Квитанція є незмінною і на неї це не впливає. Нічого не перевидано.',

  'web.receipt.section.summary': 'Що сталося',
  'web.receipt.section.timeline': 'Хронологія подій',
  'web.receipt.section.items': 'Коренева публікація та подальші елементи',
  'web.receipt.section.attempts': 'Спроби',
  'web.receipt.section.provenance': 'Походження',
  'web.receipt.section.cost': 'Використання провайдера',
  'web.receipt.section.analytics': 'Синхронізація аналітики',
  'web.receipt.section.targets': 'Цілі цієї кампанії',

  'web.receipt.item.root': 'Кореневий пост',
  'web.receipt.item.comment': 'коментар{position}',
  'web.receipt.item.thread': 'Ниткова частина{position}',
  'web.receipt.item.delay': 'Бігає {delay} після кореневого повідомлення',
  'web.receipt.item.noDelay': 'Запускається з кореневим постом',
  'web.receipt.item.pending': 'Ще не розпочато',
  'web.receipt.item.rootUnaffected':
    'Коренева публікація активна. Подальший елемент, який не вдається, ніколи цього не змінює.',

  'web.receipt.attempt.heading': 'Спроба{number}',
  'web.receipt.attempt.startedAt': 'розпочато{time}',
  'web.receipt.attempt.startedLabel': 'розпочато',
  'web.receipt.attempt.responseSummary': 'Продезінфікована відповідь постачальника',
  'web.receipt.attempt.duration': 'Взяв{duration}',
  'web.receipt.attempt.httpStatus': 'Статус HTTP',
  'web.receipt.attempt.providerRequestId': 'Довідка про запит провайдера',
  'web.receipt.attempt.retryable': 'Повторна спроба автоматично',
  'web.receipt.attempt.notRetryable': 'Автоматична повторна спроба не виконана',
  'web.receipt.attempt.nextRetry': 'Наступна спроба{time}',
  'web.receipt.attempt.nextRetryLabel': 'Наступна спроба',
  'web.receipt.attempt.showResponse': 'Показати оброблену відповідь постачальника',
  'web.receipt.attempt.hideResponse': 'Приховати оброблену відповідь постачальника',
  'web.receipt.attempt.none': 'Одна спроба, жодної невдачі.',

  'web.receipt.provenance.capabilityVersion': 'Знімок можливостей',
  'web.receipt.provenance.capabilityHint':
    'Знімок, використаний під час затвердження та повторно перевірений перед відправленням.',
  'web.receipt.provenance.accountType': 'Тип рахунку',
  'web.receipt.provenance.externalAccount': 'Довідка про зовнішній обліковий запис',
  'web.receipt.provenance.workflow': 'Довідка про робочий процес',
  'web.receipt.provenance.createdAt': 'Розписка написана{time}',

  'web.receipt.approval.notRequired': 'Для цієї мети не було потрібно схвалення.',
  'web.receipt.approval.policy': 'політика{policy}',
  'web.receipt.approval.unknownPolicy': 'Посилання на політику не зареєстровано',

  'web.receipt.cost.currency': 'Заряджено в{currency}',
  'web.receipt.cost.estimatedLabel': 'Оцінка перед публікацією',
  'web.receipt.cost.actualLabel': 'Звірено фактично',
  'web.receipt.provenance.writtenLabel': 'Розписка написана',
  'web.receipt.cost.reconciledAt': 'Помирилися{time}',
  'web.receipt.cost.notMetered': '{provider}не стягує плату за операцію для цього типу публікації.',

  'web.receipt.analytics.never': 'Аналітику для цієї публікації ще не синхронізовано.',
  'web.receipt.analytics.explain':
    'Постачальники збираються за власним графіком. Нижче вказано час, коли Relay востаннє їх читав, а не час, коли цифри були правдивими.',

  'web.receipt.export.download': 'Завантажте квитанцію',
  'web.receipt.export.copyReference': 'Скопіюйте довідку про отримання',
  'web.receipt.export.denied':
    'Для надання доступу до квитанції потрібна роль власника, адміністратора або затверджувача. Ви є {role}.',

  'web.receipt.partial.retryFailedOnly': 'Повторіть лише ті цілі, які не вдалося виконати',
  'web.receipt.partial.retryHint':
    'Повторна спроба ніколи не торкається цілі, яка вже створила зовнішню публікацію.',

  'web.receipt.remediation.user_action_required':
    'Для цього потрібно внести зміни в Relay або на {provider} перш ніж він може запуститися знову.',
  'web.receipt.remediation.content_invalid':
    'Відредагуйте вміст, щоб він проходив {provider} перевірки, а потім знову заплануйте її.',
  'web.receipt.remediation.transient_provider':
    '{provider}тимчасову помилку. Relay повторив спробу за власним розкладом.',
  'web.receipt.remediation.permanent_provider':
    '{provider}відмовився від цього назавжди. Повторна спроба того самого вмісту не змінити відповідь.',
  'web.receipt.remediation.internal':
    'Це була помилка з нашого боку. Це записано з посиланням нижче.',
  'web.receipt.remediation.unknown':
    '{provider}повернули те, для чого ми не маємо правил. Продезінфікована відповідь наведена нижче.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Облікові записи',
  'web.connection.tab.capabilities': 'Матриця можливостей',
  'web.connection.tab.groups': 'Групи клієнтів',
  'web.connection.loading': 'Завантаження підключених облікових записів',
  'web.connection.error.title': 'Не вдалося завантажити підключені облікові записи',
  'web.connection.error.body':
    'Публікація не впливає. Заплановані дописи все ще працюють проти збереженого доступу.',
  'web.connection.list.label': 'Підключені облікові записи',
  'web.connection.empty.example':
    'X, @acme, особистий профіль, підключено 12 червня Аною Руїз, публікація та показники, востаннє опубліковано 6 серпня',
  'web.connection.filter.provider': 'Платформа',
  'web.connection.filter.health': "Здоров'я",
  'web.connection.filter.group': 'Група клієнтів',
  'web.connection.filter.anyHealth': "Будь-яке здоров'я",
  'web.connection.healthFilter.healthy': 'Працює',
  'web.connection.healthFilter.expiring_soon': 'Термін дії скоро закінчується',
  'web.connection.healthFilter.expired': 'Термін доступу минув',
  'web.connection.healthFilter.revoked': 'Доступ скасовано',
  'web.connection.healthFilter.permission_missing': 'Відсутній дозвіл',
  'web.connection.healthFilter.review_pending': 'Очікуємо на перегляд платформи',
  'web.connection.healthFilter.paused': 'Призупинено',
  'web.connection.healthFilter.unknown': "Здоров'я недоступне",

  'web.connection.row.summaryLabel': 'Що може робити цей обліковий запис',
  'web.connection.row.expand': 'Показати повне резюме для{account}',
  'web.connection.row.collapse': 'Приховати повне резюме для{account}',
  'web.connection.row.metered':
    'Вимірюється для операції. Розрахункова {amount} для створення публікації.',
  'web.connection.row.limitationHeading': 'Обмеження для цього облікового запису',
  'web.connection.row.noLimitations':
    'Для цього облікового запису немає обмежень щодо виробництва або бета-версії.',
  'web.connection.row.beta': "Бета-роз'єм",
  'web.connection.row.betaBody':
    'Цей з’єднувач працює з обмеженнями, які ми ще не перевірили. Перевірте опубліковану публікацію, перш ніж покладатися на неї.',

  'web.connection.detail.expiryLabel': 'Термін доступу закінчується',
  'web.connection.health.expiresIn': 'Термін доступу завершується {relativeTime}, на{date}',
  'web.connection.health.noExpiry':
    'Цей доступ не закінчується для розкладу {provider} розповідає нам.',
  'web.connection.health.checkedAt': "Здоров'я перевірено{relativeTime}",

  'web.connection.action.inspect': 'Перевірте дозволи',
  'web.connection.action.viewCapabilities': 'Подивіться, що він підтримує',
  'web.connection.action.moveGroup': 'Перейти до іншої групи',
  'web.connection.action.menu': 'Більше дій для{account}',

  'web.connection.pause.title': 'Пауза {account}?',
  'web.connection.resume.title': 'Резюме {account}?',
  'web.connection.resume.body':
    'Заплановані публікації для цього облікового запису знову починають публікуватися в запланований час. Дописи, час яких уже минув, не активуються заднім числом.',
  'web.connection.disconnect.confirmWord': "ВІД'ЄДНАТИ",
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {#запланований пост} few {# заплановані публікації} many {# заплановані публікації} other {# заплановані публікації}} для цього запису не буде опубліковано.',
  'web.connection.disconnect.consequence.published':
    'Вже опубліковані публікації залишаються {provider}. Relay не видає їх.',
  'web.connection.disconnect.consequence.analytics':
    'Уже зібрані показники залишаються в цій робочій області та припиняють оновлення.',

  'web.connection.connect.title': 'Підключіть обліковий запис',
  'web.connection.connect.chooseProvider': 'Яка платформа',
  'web.connection.connect.permissionHeading': 'Що запитує Relay {provider} для',
  'web.connection.connect.requirementHeading': 'Перш ніж продовжити',
  'web.connection.connect.continue': 'Продовжуйте{provider}',
  'web.connection.connect.handoffNote':
    'Наступний екран {provider}, а не Relay. Relay ніколи не бачив ваш пароль.',
  'web.connection.connect.noWriteWithoutApproval':
    'Підключення облікового запису нічого не публікує. Кожна публікація досі відповідає цій політиці схвалення робочої області.',

  'web.connection.requirement.instagram':
    'Для публікації Instagram потрібен професійний обліковий запис, який означає обліковий запис компанії або творця, пов’язаний зі сторінкою Facebook.',
  'web.connection.requirement.facebook':
    'Relay публікує на Facebook Pages. Особистий профіль не може бути метою публікації.',
  'web.connection.requirement.linkedin':
    'Щоб опублікувати для організації, вам потрібна роль адміністратора вмісту на сторінці LinkedIn.',
  'web.connection.requirement.youtube':
    'Доки Google не завершить перевірку програми, завантаження з цього проекту публікуються як приватні. Згодом ви можете змінити видимість на YouTube.',
  'web.connection.requirement.tiktok':
    'TikTok вимагає, щоб ви самі вибирали аудиторію для кожної публікації. Relay не може попередньо вибрати для вас.',
  'web.connection.requirement.x':
    'X плати за операцію. Публікація, яка містить URL, коштує дорожче, ніж публікація звичайного тексту, а кошторис показується перед заплануванням.',
  'web.connection.requirement.threads':
    'Публікація Threads використовує обліковий запис, пов’язаний із вашим професійним обліковим записом Instagram.',
  'web.connection.requirement.bluesky':
    'Bluesky підключається за допомогою пароля програми, створеного в налаштуваннях Bluesky, а не пароля облікового запису.',
  'web.connection.requirement.generic':
    'Вам потрібен дозвіл на публікацію в цьому обліковому записі від самої платформи. Relay не може надати його.',

  'web.connection.purpose.publish': 'Публікація запланованих публікацій у Relay.',
  'web.connection.purpose.readPosts':
    'Читання опублікованого допису Relay, тому квитанція може підтвердити, що він активний.',
  'web.connection.purpose.identity':
    'Показ точної назви облікового запису в Relay, щоб ви ніколи не публікували в неправильному обліковому записі.',
  'web.connection.purpose.analytics':
    'Читання показників, які звітує ця платформа для ваших власних публікацій.',
  'web.connection.purpose.refresh':
    'Підтримуйте доступ, щоб заплановане повідомлення не вийшло з ладу відразу.',
  'web.connection.purpose.chooseDestination':
    'Перелік сторінок і каналів, які ви можете вибрати як ціль публікації.',

  'web.connection.permissions.title': 'Дозволи на{account}',
  'web.connection.permissions.scopeColumn': 'Дозвіл',
  'web.connection.permissions.stateColumn': 'Держава',
  'web.connection.permissions.purposeColumn': 'Для чого його використовує Relay',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {#дозвіл відсутній} few {# відсутні дозволи} many {# відсутні дозволи} other {# відсутні дозволи}}. Повторно підключіться та прийміть його, щоб відновити наведені нижче функції.',
  'web.connection.permissions.snapshot': 'Читайте з{provider} {relativeTime}',

  'web.connection.capability.title': 'Матриця можливостей',
  'web.connection.capability.subtitle':
    'Згенеровано з визначень версії конектора в цій збірці, а потім перевірено вручну. Це ті самі дані, які використовує композитор і сторінка публічних можливостей.',
  'web.connection.capability.tableLabel': 'Можливості за платформами',
  'web.connection.capability.featureColumn': 'Можливість',
  'web.connection.capability.legendTitle': 'Як це читати',
  'web.connection.capability.legend.supported':
    'Relay може зробити це сьогодні для підключеного облікового запису потрібного типу.',
  'web.connection.capability.legend.not_implemented':
    'Платформа пропонує це, і Relay ще не створив її. Це на дорожній карті роз’єму.',
  'web.connection.capability.legend.unsupported':
    'Платформа не пропонує цього через свій офіційний API, тому жоден інструмент не може зробити це безпечно.',
  'web.connection.capability.legend.requires_review':
    'Вбудовано, і платформа надає його лише після перевірки програми чи облікового запису.',
  'web.connection.capability.versionLabel': 'Визначення сполучника',
  'web.connection.capability.version': 'Версія визначення конектора{version}',
  'web.connection.capability.observedAt': 'Читання знімка{relativeTime}',
  'web.connection.capability.forAccount': 'Показано для{account}',
  'web.connection.capability.noSnapshot':
    'Ще немає знімка можливостей для цього облікового запису. Повторно підключіться, щоб прочитати один.',
  'web.connection.capability.cellLabel': '{feature}на {provider}:{state}',

  'web.connection.group.title': 'Групи клієнтів',
  'web.connection.group.listLabel': 'Групи клієнтів',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Немає облікових записів} one {# рахунок} few {# облікові записи} many {# облікові записи} other {# облікові записи}}',
  'web.connection.group.create': 'Створіть групу',
  'web.connection.group.nameLabel': 'Назва групи',
  'web.connection.group.namePlaceholder': 'Акме ЄС',
  'web.connection.group.moveTitle': 'рухатися{account}',
  'web.connection.group.moveLabel': 'Перейти до',
  'web.connection.group.moveConfirm': 'Перемістити обліковий запис',
  'web.connection.group.movedAnnouncement': '{account}переїхав до{group}',
  'web.connection.group.filterCalendarHint':
    'Група фільтрує календар і аналітику. Переміщення облікового запису зберігає всі публікації, квитанції та показники, які в ньому вже є.',
  'web.connection.group.empty.title': 'Груп клієнтів ще немає',
  'web.connection.group.empty.body':
    'Група – це клієнт або бренд. Групуйте облікові записи, щоб фільтрувати календар і аналітику за клієнтами.',

  'web.connection.incident.title': 'Цей обліковий запис потребує уваги',
  'web.connection.incident.remediationHeading': 'Що робити',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {#заплановане повідомлення призупинено} few {# заплановані публікації призупинено} many {# заплановані публікації призупинено} other {# заплановані публікації призупинено}} для цього запису.',
  'web.connection.incident.nothingLost': 'Ніщо не втрачено і ніщо не дублюється.',
} as const;
