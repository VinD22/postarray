/**
 * Web catalog for settings, the developer portal, billing and the Growth
 * Advisor.
 *
 * This file only adds what the web screens need on top of the intent catalogs
 * in `settings.ts`, `developer.ts`, `billing.ts` and `growth.ts`. Everything
 * here lives under a `.ui.` segment so a key can never collide with one of
 * those files when the catalogs are merged.
 *
 * Several strings are mandated word for word and must not be softened:
 *  - `billing.ui.annualFraming` states the saving in currency, never a percent.
 *  - `billing.ui.cancelConfirmedBeforeConversion` must read
 *    "Canceled. You will not be charged."
 *  - the media generation boundary paragraph is NOT restated here. It already
 *    exists as `billing.mediaGeneration.explanation`, and the Tool Radar
 *    renders that same key so there is one sentence to review and translate.
 */
export const webSettingsMessages = {
  /* ------------------------------------------------------------------ shell */

  'settings.ui.subtitle': 'Все, що налаштовує цей робочий простір. Ніщо тут нічого не публікує.',
  'settings.ui.nav.label': 'Розділи налаштувань',
  'settings.ui.index.help':
    'Виберіть розділ. Кожна зміна приписується вам і відображається в журналі аудиту.',

  'settings.ui.section.members': 'Члени та ролі',
  'settings.ui.section.membersSummary':
    'Хто знаходиться в цьому робочому просторі та що кожна особа може робити.',
  'settings.ui.section.projects': 'Проєкти',
  'settings.ui.section.projectsSummary':
    'Голос, аудиторія, схвалені заявки, заблоковані терміни, правила мови, домени та глосарій.',
  'settings.ui.section.agents': 'Агенти та API',
  'settings.ui.section.agentsSummary':
    'Сервісні облікові записи, області дії, ліміти, облікові дані, активність і ігровий майданчик.',
  'settings.ui.section.apps': 'Програми для розробників',
  'settings.ui.section.appsSummary':
    'Сторонні програми OAuth, дозволені списки перенаправлення, згода та гранти.',
  'settings.ui.section.webhooks': 'Веб-хуки',
  'settings.ui.section.webhooksSummary':
    'Підписані вихідні події, журнали доставки, повторна доставка та секретна ротація.',
  'settings.ui.section.billing': 'Виставлення рахунків',
  'settings.ui.section.billingSummary':
    'План, пробний період, інтервал, розрахункове використання постачальника, рахунки та скасування.',
  'settings.ui.section.referrals': 'Реферал і партнер',
  'settings.ui.section.referralsSummary':
    'Ваше розкрите реферальне посилання, пов’язані реєстрації та статус комісії.',
  'settings.ui.section.localization': 'Локалізація',
  'settings.ui.section.localizationSummary':
    'Мова інтерфейсу, мови вмісту, ринки, часовий пояс і формат часу.',
  'settings.ui.section.security': 'Безпека',
  'settings.ui.section.securitySummary':
    'Сеанси, двофакторна автентифікація, облікові дані, агенти, веб-перехоплення та надання додатків.',
  'settings.ui.section.data': 'Контроль даних',
  'settings.ui.section.dataSummary':
    'Експортувати, скасувати підключення, видалити проект, видалити вміст або закрити обліковий запис.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Завантаження{section}',
  'settings.ui.state.errorTitle': 'Не відвідайте завантажити{section}',
  'settings.ui.state.errorRetry': 'Спробуйте знову',
  'settings.ui.state.savingAnnouncement': 'Збереження{section}',
  'settings.ui.state.savedAnnouncement': '{section}збережено',
  'settings.ui.state.saveFailedAnnouncement': '{section}не було збережено. Ваші дані все ще тут.',
  'settings.ui.state.offlineTitle': 'Ви офлайн',
  'settings.ui.state.offlineBody':
    'Ви можете прочитати цю сторінку. Зміни не можна зберегти, доки з’єднання не відновиться.',
  'settings.ui.state.permissionTitle': 'Ви не маєте доступу до{section}',
  'settings.ui.state.permissionBody':
    'Цей розділ змінює поведінку робочого простору, тому він обмежений роллю.',
  'settings.ui.state.permissionRequirements': 'Те, що вам потрібно',
  'settings.ui.state.permissionContact':
    'Власник або адміністратор цієї робочої області може надати це. Вони перераховані в розділі «Учасники та ролі».',
  'settings.ui.state.rateLimitTitle': 'Забагато змін за короткий час',
  'settings.ui.state.rateLimitCause':
    'У цій робочій області досягнуто ліміту запису для змін налаштувань.',
  'settings.ui.state.rateLimitReset': 'Скидання ліміту',
  'settings.ui.state.rateLimitAlternative':
    'Нічого, що ви врятували, не було втрачено. Дії лише для читання працюють, поки ви чекаєте.',
  'settings.ui.state.rateLimitUsage': 'Налаштування пише цю годину',
  'settings.ui.state.rateLimitUsageText': '{used}з {limit} використання',
  'settings.ui.state.unsavedTitle': 'У вас є незбережені зміни',
  'settings.ui.state.unsavedBody': 'Збережіть їх, перш ніж залишити цей розділ.',
  'settings.ui.state.readOnlyTitle': 'Ця робоча область доступна лише для читання',
  'settings.ui.state.readOnlyBody':
    'Оплата прострочена. Ваш вміст, квитанції та з’єднання неушкоджені. Параметри можна читати, але не змінювати.',

  'settings.ui.state.referenceLabel': 'Довідка підтримки',

  'settings.ui.attribution': 'Змінено{name} {relativeTime}',
  'settings.ui.attributionNever': 'Не змінювався з моменту створення',
  'settings.ui.copyFailed': 'Ваш браузер заблокував копію. Виділіть текст і скопіюйте його вручну.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'Кожне запрошення, зміна ролі та видалення записується з вашим іменем і часом.',
  'settings.ui.members.tableCaption': 'Люди в цьому робочому просторі з роллю та сферою діяльності',
  'settings.ui.members.column.person': 'особа',
  'settings.ui.members.column.role': 'роль',
  'settings.ui.members.column.scope': 'Область застосування',
  'settings.ui.members.column.approvals': 'Дозволи',
  'settings.ui.members.column.lastActive': 'Останній активний',
  'settings.ui.members.column.actions': 'Дії',
  'settings.ui.members.scopeAll': 'Усі проекти та облікові записи',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {# проект} few {# проекти} many {# проектів} other {# проекти}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Може схвалити',
  'settings.ui.members.approvals.cannotApprove': 'Не можу схвалити',
  'settings.ui.members.approvals.canApproveOwnProjects':
    'Можна схвалити для перерахованих проєктів',
  'settings.ui.members.lastActiveNever': 'Ще не ввійшов',
  'settings.ui.members.changeRole': 'Змінити роль для{name}',
  'settings.ui.members.remove': 'видалити{name}',
  'settings.ui.members.lastOwnerTitle': 'Робоче місце має принаймні одного власника',
  'settings.ui.members.lastOwnerBody':
    'Спочатку зробіть когось іншого власником, тоді ця зміна стане доступною.',
  'settings.ui.members.inviteTitle': 'Запросіть когось до цієї робочої області',
  'settings.ui.members.inviteBody':
    'Вони отримують електронний лист із посиланням. Термін дії запрошення закінчується через сім днів, і ви можете відкликати його до цього часу.',
  'settings.ui.members.inviteRole': 'роль',
  'settings.ui.members.inviteScope': 'Проекти, у яких вони можуть працювати',
  'settings.ui.members.inviteScopeAll': 'Кожен проект у цьому робочому просторі',
  'settings.ui.members.inviteScopeSelected': 'Тільки обрані мною проекти',
  'settings.ui.members.inviteApprovals': 'Може вирішувати запити на схвалення',
  'settings.ui.members.inviteApprovalsHelp':
    'Це можна надати лише ролям, які вже включають перегляд. Це окремо від редагування.',
  'settings.ui.members.inviteSubmit': 'Надіслати запрошення',
  'settings.ui.members.invitePending': 'Запрошений {relativeTime} за{name}',
  'settings.ui.members.inviteRevoke': 'Відкликати запрошення',
  'settings.ui.members.inviteResend': 'Надішліть запрошення ще раз',
  'settings.ui.members.emptyTitle': 'Ви тут єдина людина',
  'settings.ui.members.emptyBody':
    'Запросіть людей, які пишуть, затверджують або читають результати. Кожен отримує свою роль і сферу проекту.',
  'settings.ui.members.emptyExample':
    'Загальна форма: один власник для виставлення рахунків, один затверджувач для кожного проекту та редактори, які готують чернетки, але ніколи не публікують.',
  'settings.ui.members.roleReferenceTitle': 'Що може зробити кожна роль',
  'settings.ui.members.roleReferenceCaption': 'Ролі та дії, які дозволяє кожна з них',
  'settings.ui.members.roleColumn.role': 'роль',
  'settings.ui.members.roleColumn.can': 'Може зробити',
  'settings.ui.members.roleColumn.cannot': 'Не можу зробити',
  'settings.ui.members.roleCannot.owner': 'Від власника нічого не утримується.',
  'settings.ui.members.roleCannot.admin': 'Змініть оплату або видаліть робочу область.',
  'settings.ui.members.roleCannot.manager':
    'Зміна виставлення рахунків, ролей або видалення робочої області.',
  'settings.ui.members.roleCannot.editor':
    'Схвалюйте, плануйте, публікуйте або змінюйте підключення.',
  'settings.ui.members.roleCannot.approver': "Змініть з'єднання, правила або тарифікацію.",
  'settings.ui.members.roleCannot.analyst':
    'Створюйте, редагуйте, затверджуйте або публікуйте будь-що.',
  'settings.ui.members.roleCannot.viewer': 'Взагалі щось змінити.',
  'settings.ui.members.removeTitle': 'видалити {name} з цієї робочої області',
  'settings.ui.members.removeConsequence.access':
    'Вони втрачають доступ одразу, на кожній поверхні.',
  'settings.ui.members.removeConsequence.drafts':
    'Чернетки, які вони написали, залишаються в робочій області та залишаються доступними для редагування.',
  'settings.ui.members.removeConsequence.audit':
    'Їхні минулі дії залишаються в журналі аудиту та в квитанціях.',
  'settings.ui.members.removeConsequence.approvals':
    'Запити на схвалення, що очікують на них, повертаються в чергу для іншого схвалювача.',

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'Проект має правила, за якими контент перевіряється: що ви можете стверджувати, що ви не можете говорити, і як кожна мова написана.',
  'settings.ui.projects.listCaption': 'Проєкти у цій робочій області',
  'settings.ui.projects.column.project': 'Проєкт',
  'settings.ui.projects.column.locales': 'Мови вмісту',
  'settings.ui.projects.column.accounts': 'Облікові записи',
  'settings.ui.projects.column.updated': 'Оновлено',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Немає облікових записів} one {# рахунок} few {# облікові записи} many {# облікові записи} other {# облікові записи}}',
  'settings.ui.projects.emptyTitle': 'Проєктів ще немає',
  'settings.ui.projects.emptyBody':
    'Проект групує облікові записи, правила затвердження та правила мови. Більшість команд починають з одного й додають другий, коли клієнту чи ринку потрібні інші правила.',
  'settings.ui.projects.emptyExample':
    'Приклад: проект "Acme EU", мови англійська та німецька, заблокований термін "гарантовано", розкриття інформації "Оплачене партнерство" для Instagram.',
  'settings.ui.projects.voiceHelp':
    'Як звучить цей проєкт. Використовується, коли ви просите переписати та коли твердження перевіряються.',
  'settings.ui.projects.audienceHelp': 'Для кого призначений контент, для кожного ринку.',
  'settings.ui.projects.approvedClaimsHelp':
    'Заяви, які перевірив рецензент. Все, що виходить за межі цього списку, позначається перед схваленням, а не після публікації.',
  'settings.ui.projects.blockedTermsHelp':
    'Слова, які блокують планування для цього проєкту. По одному на рядок.',
  'settings.ui.projects.domainsHelp':
    'Домени цього проєкту можуть зв’язуватися та скорочуватися. Лише підтверджені домени можна вибрати в композиторі.',
  'settings.ui.projects.domainVerified': 'Перевірено{date}',
  'settings.ui.projects.domainPending': 'Запис DNS ще не видно',
  'settings.ui.projects.domainVerificationUnavailable': 'Перевірку ще не реалізовано',
  'settings.ui.projects.disclosureUnavailable':
    'Типові розкриття інформації для кожного каналу ще не реалізовано. Додавайте потрібне розкриття прямо в публікації, поки цієї функції немає.',
  'settings.ui.projects.glossaryUnavailable':
    'Глосарій робочої області ще не реалізовано. Тон, аудиторія, схвалені твердження та заборонені терміни вище зберігаються і застосовуються.',
  'settings.ui.projects.localeRulesUnavailable':
    'Правила написання для кожної мови ще не реалізовано. Мови та ринки робочої області залишаються доступними в розділі «Локалізація».',
  'settings.ui.projects.disclosureHelp':
    'Застосовується за умовчанням у редакторі для вибраних тут платформ. Його можна змінити для кожної публікації до затвердження.',
  'settings.ui.projects.glossaryHelp':
    'Назви продуктів, юридичні умови та все, що має залишитися без змін після перекладу.',
  'settings.ui.projects.glossaryCaption':
    'Захищені терміни та способи обробки кожного з них для кожної мови',
  'settings.ui.projects.glossaryEmpty':
    'Захищених термінів ще немає. Додайте назви продуктів і юридичні терміни, які не можна перекладати чи перефразовувати.',
  'settings.ui.projects.localeRulesHelp':
    'Правила для кожної мови контенту. Вони застосовуються під час адаптації або транскреації та показуються рецензенту.',
  'settings.ui.projects.saveProject': 'Зберегти проєкт',
  'settings.ui.projects.capacityTitle': 'Місткість проєктів',
  'settings.ui.projects.capacityHelp':
    'Базовий план за $29 включає 3 активні проєкти. Робоча область може отримати право на до 20 проєктів без створення іншого облікового запису.',
  'settings.ui.projects.capacitySummary': '{used} з {limit}',
  'settings.ui.projects.atLimitTitle': 'Ця робоча область використала всі слоти проєктів',
  'settings.ui.projects.atLimitBody':
    'Заархівуйте неактивний проєкт або змініть ліміт робочої області, перш ніж додавати ще один. Поточний ліміт: {limit}.',
  'settings.ui.projects.listLabel': 'Виберіть проєкт для редагування',
  'settings.ui.projects.detailsTitle': 'Відомості про проєкт',
  'settings.ui.projects.projectMeta':
    '{accounts, plural, =0 {Немає каналів} one {# канал} few {# канали} many {# каналів} other {# канали}} · Оновлено {updated}',
  'settings.ui.projects.archiveAction': 'Заархівувати проєкт',
  'settings.ui.projects.archiveTitle': 'Заархівувати {project}?',
  'settings.ui.projects.archiveBody':
    'Цей неактивний проєкт залишає активну робочу область і звільняє один слот проєкту.',
  'settings.ui.projects.archiveChannels':
    'Його підключені канали більше не з’являються в потоках активних проєктів.',
  'settings.ui.projects.archiveHistory':
    'Чернетки, опубліковані дописи, квитанції та історія аудиту зберігаються.',
  'settings.ui.projects.archiveLastDisabled':
    'Залиште щонайменше один активний проєкт у робочій області.',
  'settings.ui.projects.archiveConnectedDisabled':
    'Від’єднайте канали цього проєкту перед архівуванням.',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'Три окремі налаштування: мова цієї програми, мови, якими ви публікуєте, і ринки, для яких ви пишете. Зміна одного ніколи не змінює іншого.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Виберіть мову інтерфейсу для цієї програми. Мови вмісту окремі та вже доступні.',
  'settings.ui.localization.marketHelp':
    'Ринок змінює приклади, юридичні відомості та заклики до дії. Це не змінює мову публікації.',
  'settings.ui.localization.previewTitle': 'Як будуть читатися дати і числа',
  'settings.ui.localization.previewDate': 'Дата',
  'settings.ui.localization.previewTime': 'час',
  'settings.ui.localization.previewNumber': 'Номер',
  'settings.ui.localization.previewCurrency': 'Валюта',
  'settings.ui.localization.weekStartHelp': 'Використовується в режимі календарного тижня.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'Усе, що може діяти в цій робочій області, в одному місці: ваші сеанси, облікові дані, агенти, веб-хуки та програми, до яких ви надали доступ.',
  'settings.ui.security.sessionsCaption': 'Ви ввійшли в сесії для свого облікового запису',
  'settings.ui.security.sessionColumn.device': 'Пристрій і браузер',
  'settings.ui.security.sessionColumn.location': 'Приблизне розташування',
  'settings.ui.security.sessionColumn.lastSeen': 'Останнє використання',
  'settings.ui.security.sessionCurrent': 'Ця сесія',
  'settings.ui.security.sessionRevokeAll': 'Виходьте з кожного другого сеансу',
  'settings.ui.security.sessionLocationUnknown': 'Місцезнаходження не записано',
  'settings.ui.security.mfaOn': 'Увімкнено двофакторну автентифікацію',
  'settings.ui.security.mfaOff': 'Двофакторну автентифікацію вимкнено',
  'settings.ui.security.mfaBody':
    'Другий фактор необхідний перед змінами виставлення рахунків, створенням облікового запису служби, повторним підключенням облікового запису та відкликанням облікових даних.',
  'settings.ui.security.credentialsTitle': 'Ключі API',
  'settings.ui.security.credentialsBody':
    'Ключі належать цій робочій області. Вони відокремлені від грантів програми та вашого власного сеансу.',
  'settings.ui.security.agentsTitle': 'Сервісні облікові записи',
  'settings.ui.security.webhooksTitle': 'Кінцеві точки вебхуку',
  'settings.ui.security.grantsTitle': 'Програми, які ви дозволили',
  'settings.ui.security.grantsBody':
    'Відкликання програми негайно зупиняє її маркери. Це не впливає на ваші власні зв’язки та заплановані публікації.',
  'settings.ui.security.grantScopes': 'Надані дозволи',
  'settings.ui.security.socialPermissionsTitle': 'Дозволи соціального облікового запису',
  'settings.ui.security.socialPermissionsBody':
    'Те, що кожен підключений обліковий запис дозволив робити Post Array, на основі знімка можливостей, зробленого під час підключення.',
  'settings.ui.security.viewInSection': 'Керувати в{section}',
  'settings.ui.security.emptySessions': 'Ви ввійшли лише в цей сеанс.',
  'settings.ui.security.emptyGrants':
    'Жодна стороння програма не має доступу до цієї робочої області. Програми з’являються тут після того, як ви дозволите їх на екрані згоди.',
  'settings.ui.security.revokeGrantTitle': 'Скасувати доступ для{app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Його маркери доступу та оновлення негайно припиняють працювати.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Публікує це вже заплановано перебування заплановано. Скасуйте їх окремо, якщо ви хочете їх зупинити.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'Додаток може запитати доступ знову, і ви можете відмовити.',

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'Видаліть свої дані, видаліть одну річ або закрийте обліковий запис. Кожна деструктивна дія називає саме те, до чого вона торкається першою.',
  'settings.ui.data.exportTitle': 'Експорт',
  'settings.ui.data.exportBody':
    'Портативний архів вмісту, графіків, квитанцій, подій аналітики та аудиту, а також ваших завантажених медіафайлів.',
  'settings.ui.data.exportJson': 'Структурований JSON',
  'settings.ui.data.exportCsv': 'Електронна таблиця CSV',
  'settings.ui.data.exportMedia': 'Медіаархів',
  'settings.ui.data.exportJsonHelp':
    'Один файл на тип запису. Задокументований і стабільний у всіх версіях.',
  'settings.ui.data.exportCsvHelp':
    'Публікації, квитанції та показники як плоскі таблиці для електронної таблиці.',
  'settings.ui.data.exportMediaHelp':
    'Оригінальні файли, які ви завантажили або імпортували, із контрольними сумами.',
  'settings.ui.data.exportStart': 'Підготувати експорт',
  'settings.ui.data.exportRunning':
    'Підготовка вашого експорту. Він продовжує працювати, якщо ви закриєте цю сторінку.',
  'settings.ui.data.exportReady': 'Експорт готовий, підготовлений{date}',
  'settings.ui.data.exportDownload': 'Завантажити експорт',
  'settings.ui.data.exportExpires': 'Термін дії посилання для завантаження завершується {date}.',
  'settings.ui.data.deleteTitle': 'Видалити',
  'settings.ui.data.deleteBody':
    'Виберіть найменшу річ, яка вирішить вашу проблему. Кожен варіант нижче говорить про те, що виживе.',
  'settings.ui.data.deleteConnection': 'Скасувати один соціальний зв’язок',
  'settings.ui.data.deleteConnectionHelp':
    'Вилучає доступ Post Array до цього облікового запису. Робоча область, її вміст і квитанції залишаються.',
  'settings.ui.data.deleteProject': 'Заархівувати проєкт',
  'settings.ui.data.deleteProjectHelp':
    'Видаляє проєкт, його правила та глосарій. Вміст, опублікований під ним, зберігає свої квитанції.',
  'settings.ui.data.deleteContent': 'Видаліть вміст і медіа',
  'settings.ui.data.deleteContentHelp':
    'Видаляє чернетки та збережені файли. Він не видаляє нічого, що вже опубліковано на платформі.',
  'settings.ui.data.deleteAccount': 'Закрийте цю робочу область',
  'settings.ui.data.deleteAccountHelp':
    'Скасовує заплановані завдання, скасовує кожне підключення, видаляє збережені носії та закриває робочу область.',
  'settings.ui.data.scheduledJobsTitle': 'Планові роботи, які будуть скасовані першими',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {Зараз нічого не заплановано} one {# запланований пост} few {# заплановані публікації} many {# заплановані публікації} other {# заплановані публікації}}',
  'settings.ui.data.cancelJobsFirst': 'Скасувати заплановані публікації зараз',
  'settings.ui.data.cancelJobsDone': 'Заплановані публікації скасовано. Нічого не опублікують.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'Введіть назву робочої області для підтвердження',
  'settings.ui.data.deleteConsequence.jobs':
    'Кожен запланований допис скасовується до того, як щось буде видалено.',
  'settings.ui.data.deleteConsequence.connections':
    'Кожне соціальне підключення анулюється у провайдера.',
  'settings.ui.data.deleteConsequence.media':
    'Збережені медіафайли видаляються та не можуть бути відновлені.',
  'settings.ui.data.deleteConsequence.receipts':
    'Квитанції про публікацію зберігаються протягом терміну зберігання, зазначеного в Умовах, після чого видаляються.',
  'settings.ui.data.deleteConsequence.published':
    'Публікації, які вже розміщені на платформі, не видаляються. Видаліть ті, що на платформі.',
  'settings.ui.data.exportFirst': 'Експортуйте свої дані перед видаленням.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'Поділіться Post Array з розкритим посиланням. Комісія ніколи не залежить від позитивного відгуку.',
  'settings.ui.referral.linkLabel': 'Ваше реферальне посилання',
  'settings.ui.referral.tableCaption': 'Віднесені реєстрації та стан їх комісії',
  'settings.ui.referral.column.signup': 'Реєстрація',
  'settings.ui.referral.column.date': 'Дата',
  'settings.ui.referral.column.state': 'Комісія',
  'settings.ui.referral.column.amount': 'Сума',
  'settings.ui.referral.emptyTitle': 'Ще немає пов’язаних реєстрацій',
  'settings.ui.referral.emptyBody':
    'Реєстрації з’являються тут, коли хтось починає пробну версію за вашим посиланням. Суми залишаються в очікуванні, доки вікно відшкодування не закриється.',
  'settings.ui.referral.emptyExample':
    'Приклад рядка: acme.example, розпочато пробну версію 12 червня, очікує на розгляд до 12 липня, потім схвалено.',
  'settings.ui.referral.termsLink': 'Прочитайте умови партнерства',
  'settings.ui.referral.balance': 'Затверджена комісія',
  'settings.ui.referral.balanceUnavailableReason': 'Комісійна книга за цей період ще не звірена.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'Обліковий запис служби – це іменований ідентифікатор для агента, сценарію або робочого процесу. Він має власні масштаби, власні обмеження та власний контрольний слід.',
  'developer.ui.agents.emptyTitle': 'Сервісних облікових записів ще немає',
  'developer.ui.agents.emptyBody':
    'Створіть по одному для кожної автоматизації, яку ви запускаєте. Окремі облікові записи означають, що ви можете відкликати один, не зупиняючи інших.',
  'developer.ui.agents.emptyExample':
    'Приклад: «Контент-агент», проект Acme EU, може створювати та планувати до 6 публікацій на день між 07:00 і 22:00, ніколи не публікує негайно.',
  'developer.ui.agents.step.identity': 'Назва та призначення',
  'developer.ui.agents.step.scope': 'Чого він може досягти',
  'developer.ui.agents.step.limits': 'Межі',
  'developer.ui.agents.purpose': 'Для чого цей обліковий запис',
  'developer.ui.agents.purposeHelp':
    'Одне речення. Він відображається біля кожної дії, яку виконує цей обліковий запис у журналі аудиту.',
  'developer.ui.agents.scopeHelp': 'Область надає саме себе. Ніщо тут не означає щось інше.',
  'developer.ui.agents.limitsHelp':
    'Обмеження встановлюються API, а не агентом. Агент не може підвищити власний ліміт.',
  'developer.ui.agents.quietHours': 'Тихі години',
  'developer.ui.agents.quietHoursHelp':
    'Обліковий запис не може планувати чи публікувати в ці години, у часовому поясі робочої області.',
  'developer.ui.agents.lookAheadHelp': 'Як далеко в майбутньому він може розмістити пост.',
  'developer.ui.agents.cadenceHelp':
    'Найбільше зовнішніх публікацій це може викликати за один день.',
  'developer.ui.agents.expiry': 'Термін дії облікових даних закінчився',
  'developer.ui.agents.expiryHelp':
    'Коротше життя безпечніше. Ви можете чергувати в будь-який час.',
  'developer.ui.agents.summaryTitle': 'Перш ніж створити його',
  'developer.ui.agents.summaryAccounts': 'Облікові записи, які він може отримати',
  'developer.ui.agents.summaryMaxActions':
    'Щонайбільше {count, plural, one {# зовнішня публікація} few {# зовнішні видання} many {# зовнішні видання} other {# зовнішні видання}} на день.',
  'developer.ui.agents.summaryApproval': 'Поведінка схвалення',
  'developer.ui.agents.summaryCreate': 'Створити обліковий запис служби',
  'developer.ui.agents.detailTitle': 'Сервісний обліковий запис',
  'developer.ui.agents.statusActive': 'Активний',
  'developer.ui.agents.statusStopped': 'Зупинився',
  'developer.ui.agents.statusExpired': 'Термін дії облікових даних минув',
  'developer.ui.agents.stoppedBody':
    'Цей обліковий запис зупинено. Кожен дзвінок, який він робить, отримує відмову з чіткої причини. Нічого створеного не було видалено.',
  'developer.ui.agents.killTitle': 'СТІЙ{name}',
  'developer.ui.agents.killConsequence.calls':
    'Кожен виклик API, MCP і CLI з цього облікового запису відразу відхиляється.',
  'developer.ui.agents.killConsequence.scheduled':
    'Публікує це вже заплановано перебування заплановано. Скасуйте їх із календаря, якщо хочете їх зупинити.',
  'developer.ui.agents.killConsequence.reversible': 'Ви можете розпочати його знову пізніше.',
  'developer.ui.agents.resume': 'Запустіть цього агента знову',
  'developer.ui.agents.rotate': 'Повернути облікові дані',
  'developer.ui.agents.rotateTitle': 'Повідомте облікові дані для{name}',
  'developer.ui.agents.rotateConsequence.old':
    'Поточні облікові дані негайно припиняють працювати.',
  'developer.ui.agents.rotateConsequence.new': 'Новий показується один раз на цій сторінці.',
  'developer.ui.agents.rotateConsequence.clients':
    'Усе, що використовує старе значення, не працює, доки ви його не оновите.',
  'developer.ui.agents.credentialStored': 'Я зберіг ці облікові дані',
  'developer.ui.agents.credentialLabel': 'Облікові дані сервісного облікового запису',
  'developer.ui.agents.credentialWarning': 'Це єдиний раз, коли ці облікові дані показуються',
  'developer.ui.agents.credentialWarningBody':
    'Скопіюйте його зараз у свій секретний магазин. Ми зберігаємо лише хеш, тому не можемо показати його знову. Обертання створює нове.',
  'developer.ui.agents.credentialConsumed':
    'Облікові дані більше не відображаються. Поверніть його, якщо ви його не зберігали.',
  'developer.ui.agents.credentialReveal': 'Показати облікові дані',
  'developer.ui.agents.credentialHide': 'Приховати облікові дані',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read':
    'Перегляньте підключені облікові записи та можливості кожного з них',
  'developer.ui.scope.accounts_write':
    'Перейменуйте облікові записи та змініть спосіб їх групування',
  'developer.ui.scope.drafts_read': 'Прочитайте свої чернетки та їх варіанти',
  'developer.ui.scope.drafts_write': 'Створення та редагування чернеток',
  'developer.ui.scope.posts_schedule': 'Заплануйте схвалений вміст у своїх облікових записах',
  'developer.ui.scope.posts_publish': 'Негайно опублікуйте у своїх облікових записах',
  'developer.ui.scope.posts_cancel': 'Скасувати заплановані публікації',
  'developer.ui.scope.analytics_read': 'Читайте аналітику своїх облікових записів',
  'developer.ui.scope.media_read': 'Перегляньте файли у своїй бібліотеці',
  'developer.ui.scope.media_write': 'Завантажуйте та редагуйте файли у своїй бібліотеці',
  'developer.ui.scope.rules_read': 'Прочитайте свої правила автоматизації',
  'developer.ui.scope.rules_write':
    'Створюйте та змінюйте правила автоматизації, які можна публікувати',
  'developer.ui.scope.growth_read': 'Прочитайте свої плани зростання',
  'developer.ui.scope.growth_write': 'Створення та редагування планів зростання',
  'developer.ui.scope.webhooks_manage': 'Створюйте та змінюйте кінцеві точки вебхуку',
  'developer.ui.scope.billing_read': 'Прочитайте свій план, пробний стан і використання',
  'developer.ui.scope.connections_admin': 'Підключайте та відключайте соціальні акаунти',

  'developer.ui.activity.caption': 'Останні виклики інструментів, з тими, у яких було відмовлено',
  'developer.ui.activity.column.time': 'час',
  'developer.ui.activity.column.tool': 'Інструмент або маршрут',
  'developer.ui.activity.column.outcome': 'Результат',
  'developer.ui.activity.column.subject': 'Тема',
  'developer.ui.activity.outcome.ok': 'Дозволено',
  'developer.ui.activity.outcome.denied': 'Відмовлено',
  'developer.ui.activity.outcome.failed': 'Не вдалося',
  'developer.ui.activity.filterDenied': 'Показати лише відхилені спроби',
  'developer.ui.activity.deniedExplain':
    'Відмовлена спроба - це те, як показує себе неправильно налаштований агент. Ці рядки зберігаються, а не ховаються.',
  'developer.ui.activity.emptyTitle': 'Дзвінків ще не записано',
  'developer.ui.activity.emptyBody':
    'Дзвінки з’являються тут протягом кількох секунд після того, як вони сталися, включно з тими, у яких було відмовлено.',
  'developer.ui.activity.emptyExample':
    'Приклад рядка: 12:03, draft_post, дозволено, чернетка для облікового запису X @acme.',

  'developer.ui.setup.help':
    'Вставте це в клієнт, який ви підключаєте. Замініть заповнювач облікових даних на збережене значення.',
  'developer.ui.setup.credentialPlaceholder':
    'У фрагменті використовується заповнювач. Ніколи не надсилайте справжні облікові дані до сховища.',
  'developer.ui.setup.copySnippet': 'Копіювати фрагмент для{client}',
  'developer.ui.setup.snippetCopied': 'Фрагмент скопійовано',
  'developer.ui.setup.tabLabel': 'Фрагменти налаштування клієнта',

  'developer.ui.playground.help':
    'Виклики виконуються із заповненою копією цієї робочої області. Жоден постачальник не зв’язується і нічого не планується.',
  'developer.ui.playground.tool': 'Інструмент',
  'developer.ui.playground.arguments': 'Аргументи',
  'developer.ui.playground.argumentsHelp': 'JSON. Те саме тіло, яке приймає справжній API.',
  'developer.ui.playground.result': 'Результат',
  'developer.ui.playground.resultEmpty':
    'Запустіть інструмент, щоб побачити відповідь, який він поверне.',
  'developer.ui.playground.invalidJson': 'Це ще недійсний JSON, тому його не можна надіслати.',
  'developer.ui.playground.deniedByApproval':
    'Рівень затвердження {level} не дозволяє цей виклик. Сухий хід відмовляє йому точно так само, як і API.',
  'developer.ui.playground.announceResult': 'Пробіжку закінчено. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'Зареєструйте програму, щоб інші люди могли надати їй доступ до свого робочого простору. Кожен додаток має власний ідентифікатор, власний список дозволених переадресацій і власний контрольний журнал.',
  'developer.ui.apps.emptyTitle': 'Немає зареєстрованих програм',
  'developer.ui.apps.emptyBody':
    'Зареєструйте програму, коли інший продукт повинен діяти від імені користувача Post Array. Для власної автоматизації використовуйте обліковий запис служби.',
  'developer.ui.apps.emptyExample':
    'Example: "Acme Publisher", confidential client, redirect https://acme.example/oauth/callback, scopes accounts:read and drafts:write.',
  'developer.ui.apps.typeHelp':
    'Конфіденційний клієнт працює на сервері, яким ви керуєте, і може зберігати секрет. Загальнодоступним клієнтом є браузер або настільна програма, яка використовує PKCE без секрету.',
  'developer.ui.apps.redirectAdd': 'Додайте URI перенаправлення',
  'developer.ui.apps.redirectRemove': 'видалити{uri}',
  'developer.ui.apps.redirectInvalid':
    'Введіть повний https URI без символів підстановки та рядка запиту. Воно має точно відповідати значенню, яке надсилає ваша програма.',
  'developer.ui.apps.linksTitle': 'Опубліковані посилання',
  'developer.ui.apps.linksHelp':
    'Вони з’являються на екрані згоди. Користувач, який не може зв’язатися з ними, не надасть доступ.',
  'developer.ui.apps.linkUnreachable':
    'Нам не вдалося отримати доступ до цього URL під час попередньої перевірки, {date}.',
  'developer.ui.apps.linkReachable': 'Досяжний, перевірений{date}',
  'developer.ui.apps.scopesTitle': 'Дозволи, які може запитувати ця програма',
  'developer.ui.apps.scopesHelp':
    'Просіть найменше, що вам потрібно. Користувач бачить дозволи на читання та наступні дозволи як дві окремі групи.',
  'developer.ui.apps.scopeGroup.read': 'Дозволи на читання',
  'developer.ui.apps.scopeGroup.reversible': 'Зміни, які можна скасувати',
  'developer.ui.apps.scopeGroup.consequential': 'Послідовні дозволи',
  'developer.ui.apps.scopeGroupHelp.read':
    'Це дозволяє програмі переглядати дані. Нічого не змінюється.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Вони дозволяють програмі створювати або редагувати речі в Post Array. Ніщо не досягає платформи.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Це може спричинити публікацію в реальному обліковому записі або змінити тих, хто може отримати доступ до ваших облікових записів. Вони завжди перераховуються окремо й ніколи не об’єднуються.',
  'developer.ui.apps.noBundling':
    'Немає сумісної області доступу. Адміністрування виставлення рахунків і з’єднання завжди запитується на ім’я.',
  'developer.ui.apps.secretTitle': 'Секрет клієнта',
  'developer.ui.apps.secretWarning': 'Це єдиний раз, коли секрет клієнта відображається',
  'developer.ui.apps.secretWarningBody':
    'Збережіть його зараз у диспетчері секретів на стороні сервера. Ми зберігаємо лише хеш. Якщо ви втратите його, поверніть його: неможливо відкрити його знову.',
  'developer.ui.apps.secretConsumed':
    'Секрет більше не відображається. Поверніть його, якщо ви його не зберігали.',
  'developer.ui.apps.secretStored': 'Я зберіг цю таємницю',
  'developer.ui.apps.secretPublicClient':
    'У публічного клієнта немає секрету. Він використовує потік коду авторизації з PKCE.',
  'developer.ui.apps.rotateTitle': 'Повідомте секрета клієнта для{app}',
  'developer.ui.apps.rotateConsequence.old': 'Поточний секрет негайно припиняє працювати.',
  'developer.ui.apps.rotateConsequence.grants': 'Існуючі гранти користувача не скасовуються.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Ваші сервери не можуть оновити маркери, доки ви не розгорнете нове значення.',
  'developer.ui.apps.consentPreviewTitle': 'Попередній перегляд екрана згоди',
  'developer.ui.apps.consentPreviewHelp':
    'Це те, що бачить користувач. Він генерується із запису програми, тому не може обіцяти більше, ніж вимагає програма.',
  'developer.ui.apps.consentPreviewSample':
    'Тільки попередній перегляд. Нічого не надається і токен не видається.',
  'developer.ui.apps.grantsCaption': 'Workspace, які надали цьому додатку доступ',
  'developer.ui.apps.grantColumn.workspace': 'Workspace',
  'developer.ui.apps.grantColumn.scopes': 'Області застосування',
  'developer.ui.apps.grantColumn.granted': 'Зрозуміло',
  'developer.ui.apps.grantColumn.lastUsed': 'Останнє використання',
  'developer.ui.apps.grantsEmpty': 'Ще ніхто не надав цьому додатку доступ.',
  'developer.ui.apps.logsCaption':
    'Останні запити з видаленими секретами та корисними навантаженнями',
  'developer.ui.apps.logColumn.time': 'час',
  'developer.ui.apps.logColumn.route': 'Маршрут',
  'developer.ui.apps.logColumn.status': 'Статус',
  'developer.ui.apps.logColumn.workspace': 'Workspace',
  'developer.ui.apps.logsRedacted':
    'Тіла запиту та відповіді зберігаються без облікових даних, токенів і вмісту користувача.',
  'developer.ui.apps.sandboxTitle': 'Облікові дані пісочниці',
  'developer.ui.apps.sandboxBody':
    'Окремий ідентифікатор клієнта та робоча область із заповненими даними. Дзвінки, зроблені з його допомогою, ніколи не досягають постачальника.',
  'developer.ui.apps.rateLimitLabel': 'Ліміт тарифу',
  'developer.ui.apps.rateLimitUsage': '{used}з {limit} запитів цієї години',
  'developer.ui.apps.disable': 'Вимкнути додаток',
  'developer.ui.apps.enable': 'Увімкнути додаток',
  'developer.ui.apps.disabledBody':
    'Цей додаток вимкнено. Існуючі маркери відхиляються, і новий грант не може бути розпочато. Гранти зберігаються, щоб ви могли знову ввімкнути їх.',
  'developer.ui.apps.deleteTitle': 'Видалити{app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Кожен грант скасовується, і кожен маркер припиняє працювати.',
  'developer.ui.apps.deleteConsequence.logs':
    'Журнали запитів зберігаються протягом періоду зберігання аудиту.',
  'developer.ui.apps.deleteConsequence.irreversible':
    'Ідентифікатор клієнта не можна використовувати повторно.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Підписані HTTPS-доставки для вибраних вами подій. Кожна доставка реєструється разом із відповіддю, і будь-яку доставку можна надіслати повторно.',
  'developer.ui.webhooks.emptyTitle': 'Кінцевих точок ще немає',
  'developer.ui.webhooks.emptyBody':
    'Додайте кінцеву точку, щоб отримувати результати публікації, рішення про схвалення та стан з’єднання у ваших власних системах.',
  'developer.ui.webhooks.emptyExample':
    'Example: https://hooks.acme.example/relay, subscribed to post.published, post.failed and connection.action_required.',
  'developer.ui.webhooks.create': 'Додайте кінцеву точку',
  'developer.ui.webhooks.url': 'Кінцева точка URL',
  'developer.ui.webhooks.urlHelp':
    'Лише HTTPS. Ми не виконуємо жодних переадресацій і не повторюємо спробу 2xx.',
  'developer.ui.webhooks.eventsTitle': 'Події',
  'developer.ui.webhooks.eventsHelp':
    'Виберіть події, якими ви керуєте. Надсилання всього до кінцевої точки, яка ігнорує більшу частину, ускладнює виявлення збоїв.',
  'developer.ui.webhooks.eventsAll': 'Кожна подія',
  'developer.ui.webhooks.eventsSelected': 'Лише вибрані мною події',
  'developer.ui.webhooks.eventsCount':
    '{count, plural, one {#подія} few {# є} many {# є} other {# є}}',
  'developer.ui.webhooks.eventGroup.connections': "Зв'язки",
  'developer.ui.webhooks.eventGroup.content': 'Зміст і затвердження',
  'developer.ui.webhooks.eventGroup.publishing': 'Видавництво',
  'developer.ui.webhooks.eventGroup.automation': 'Автоматика і канали',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'Проекти і облікові записи',
  'developer.ui.webhooks.scopeAll': 'Кожен проект і обліковий запис',
  'developer.ui.webhooks.scopeSelected': 'Тільки ті, які я вибираю',
  'developer.ui.webhooks.secretTitle': 'Секрет підпису',
  'developer.ui.webhooks.secretBody':
    'Перевірте заголовок підпису, перш ніж аналізувати тіло. Дедуплікати ідентифікатора доставки, який є стабільним під час повторних спроб.',
  'developer.ui.webhooks.secretRotateTitle': 'Поверніть секрет підпису',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Обидва секрети приймаються протягом 24 годин, тому ви можете розгортати без втрати доставки.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Після цього вікна використовується лише новий секрет.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Надсилає один підписаний приклад події, позначений як тест, щоб ваш одержувач міг безпечно його ігнорувати.',
  'developer.ui.webhooks.testDeliverySent':
    'Тестова доставка надіслана. Результат відображається в журналі нижче.',
  'developer.ui.webhooks.deliveriesCaption': 'Останні поставки та відповідь, отримана кожною з них',
  'developer.ui.webhooks.deliveryColumn.time': 'Просив',
  'developer.ui.webhooks.deliveryColumn.event': 'Подія',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Спроба',
  'developer.ui.webhooks.deliveryColumn.response': 'Відповідь',
  'developer.ui.webhooks.deliveryColumn.status': 'Статус',
  'developer.ui.webhooks.deliveryStatus.pending': 'Очікування',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Доставлено',
  'developer.ui.webhooks.deliveryStatus.failed': 'Помилка, буде повторена спроба',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Помилка, повторних спроб більше немає',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Не надіслано, кінцева точка вимкнена',
  'developer.ui.webhooks.deliveryNoResponse': 'Відповіді не отримано',
  'developer.ui.webhooks.deliveryNextAttempt': 'Наступна спроба{relativeTime}',
  'developer.ui.webhooks.inspect': 'Огляньте доставку',
  'developer.ui.webhooks.inspectTitle': 'Доставка{id}',
  'developer.ui.webhooks.inspectRequest': 'Тіло запиту',
  'developer.ui.webhooks.inspectResponse': 'Тіло відповіді',
  'developer.ui.webhooks.redeliver': 'Надішліть цю доставку знову',
  'developer.ui.webhooks.redeliverHelp':
    'Той самий ідентифікатор події надсилається знову з установленим прапором повторної доставки, тому ідемпотентний отримувач безпечно ігнорує його.',
  'developer.ui.webhooks.redelivered': 'У черзі на повторну доставку.',
  'developer.ui.webhooks.failureTitle': 'Ця кінцева точка виходить з ладу',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {#доставка підряд не вдалася} few {# поставки підряд не вдались} many {# поставки підряд не вдались} other {# поставки підряд не вдались}}. Після {limit} наступних помилок кінцева точка вимикається, і подається запит дії.',
  'developer.ui.webhooks.disabledTitle': 'Ця кінцева точка була вимкнена після повторних збоїв',
  'developer.ui.webhooks.disabledBody':
    'Ми припинили надсилання на нього, тому ваша черга не заповнюється. Виправте приймач, надішліть тестову доставку, а потім увімкніть його знову.',
  'developer.ui.webhooks.lastSuccessLabel': 'Останній успіх',
  'developer.ui.webhooks.lastSuccessNever': 'Жодна доставка ніколи не вдавалася',
  'developer.ui.webhooks.deleteTitle': 'Видалити цю кінцеву точку',
  'developer.ui.webhooks.deleteConsequence.stop': 'На цей URL більше нічого не надсилається.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'Журнали доставки зберігаються протягом терміну зберігання аудиту.',

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'Один план, два інтервали. Polar є офіційним продавцем: він підтримує спосіб оплати, виставляє рахунки-фактури та обробляє скасування.',
  'billing.ui.statusHeading': 'Поточний стан',
  'billing.ui.planHeading': 'План',
  'billing.ui.intervalHeading': 'Платіжний інтервал',
  'billing.ui.usageHeading': 'Виміряне використання постачальника',
  'billing.ui.invoicesHeading': 'Рахунки-фактури',
  'billing.ui.cancelHeading': 'Анулювання',
  'billing.ui.trialDaysRemaining':
    'суд, {count, plural, =0 {закінчується сьогодні} one {# залишився день} few {# залишилося днів} many {# залишилося днів} other {# залишилося днів}}',
  'billing.ui.convertsOn': 'Перетворює на {date} до {amount} пер {interval}.',
  'billing.ui.dueToday': '0 доларів США до сплати сьогодні',
  'billing.ui.conversionLabel': 'Навертає',
  'billing.ui.channelsLabel': 'Активні канали',
  'billing.ui.paymentMethodPolar': 'Спосіб оплати здійснюється Polar',
  'billing.ui.paymentMethodDescriptor': '{project}закінчення {last4}, закінчується{expiry}',
  'billing.ui.paymentMethodMissing': 'Метод оплати ще не зареєстровано',
  'billing.ui.cancelBeforeDate': 'Скасувати раніше {date} і з вас не стягуватиметься плата.',
  'billing.ui.annualFraming': '$25/місяць виставляється щорічно. Економте 48 доларів на рік.',
  'billing.ui.monthlyOption': '29 доларів на місяць',
  'billing.ui.annualOption': '300 доларів на рік',
  'billing.ui.intervalChangeHelp':
    'Зміна інтервалу вступає в силу при наступному поновленні. Polar розподіляє його та показує точну суму перед тим, як ви підтвердите.',
  'billing.ui.intervalChangedAnnouncement': 'Платіжний інтервал встановлено {interval}.',
  'billing.ui.allowanceChannels':
    '30 активних соціальних каналів. Канал: це один підключений обліковий запис, сторінка або канал.',
  'billing.ui.allowanceChannelsUsage': '{used}з {limit} активні канали',
  'billing.ui.allowanceFairUse':
    'Справедливе використання означає боротьбу зі спамом, контроль тарифів і витрат постачальника. Вони однаково застосовуються до кожного підписника та публікуються, а не на власний розсуд.',
  'billing.ui.allowanceMetered':
    'X та деякі інші постачальники стягують плату за операцію. Ці витрати передаються за собівартістю та не є частиною тарифу плану.',
  'billing.ui.allowanceNoMedia':
    'Генерація зображень і відео не входить у комплект і не продається. Post Array не створює медіа.',
  'billing.ui.readFairUse': 'Прочитайте політику справедливого використання',
  'billing.ui.readMeteredPolicy': 'Прочитайте, як виставляється плата за лічильник',
  'billing.ui.usageCaption':
    'Облік використання постачальником у цей період, рахунок виставляється за собівартістю',
  'billing.ui.usageColumn.item': 'Пункт',
  'billing.ui.usageColumn.quantity': 'Кількість',
  'billing.ui.usageColumn.unitPrice': 'Ціна за одиницю',
  'billing.ui.usageColumn.amount': 'Сума',
  'billing.ui.usageTotal': 'Підсумок цього періоду',
  'billing.ui.usagePeriod': 'Крапка {start} до{end}',
  'billing.ui.usageSource': 'Ціни опублікованим провайдером. Перевірено {date}.',
  'billing.ui.usageReconciled': 'Звірено з рахунком-фактурою постачальника на {date}.',
  'billing.ui.usagePending': 'Ще не помирилися. Кінцева сума може незначно змінюватися.',
  'billing.ui.usageUnavailableReason':
    'Провайдер ще не повернув використання за цей період. Зазвичай він доступний протягом 24 годин.',
  'billing.ui.usageEmpty': 'У цей період не використовується лічильник.',
  'billing.ui.spendAlert': 'Сповіщення про витрати',
  'billing.ui.spendAlertHelp':
    'Ми надішлемо вам електронний лист, коли розрахункове використання перевищує цю суму протягом розрахункового періоду.',
  'billing.ui.spendAlertPause': 'Також призупиняйте вимірювані дії, коли досягнуто сповіщення',
  'billing.ui.balanceLabel': 'Баланс використання',
  'billing.ui.balanceHelp':
    'Виміряне використання вираховується з цього балансу та виставляється рахунком Polar.',
  'billing.ui.invoicesCaption': 'Рахунки-фактури, виставлені компанією Polar',
  'billing.ui.invoiceColumn.date': 'Дата',
  'billing.ui.invoiceColumn.description': 'опис',
  'billing.ui.invoiceColumn.amount': 'Сума',
  'billing.ui.invoiceColumn.state': 'Держава',
  'billing.ui.invoiceState.paid': 'Платний',
  'billing.ui.invoiceState.open': 'відкритий',
  'billing.ui.invoiceState.uncollectible': 'Не зібрано',
  'billing.ui.invoiceState.refunded': 'Повернено',
  'billing.ui.invoicesEmpty':
    'Ще немає рахунку. Перший видається, коли пробна версія перетворюється.',
  'billing.ui.invoicesInPortal': 'Кожен рахунок-фактура та квитанція доступні на порталі Polar.',
  'billing.ui.portalHelp':
    'На порталі можна змінити спосіб оплати, завантажити рахунки-фактури та скасувати їх. Він відкриється в новій вкладці.',
  'billing.ui.pastDueHeading': 'Прострочена оплата',
  'billing.ui.pastDueBody':
    'Останній платіж не пройшов. Оновіть спосіб оплати на порталі Polar, щоб продовжувати публікацію.',
  'billing.ui.gracePolicy':
    'Заплановані публікації продовжуватимуться до {date}. Після цього робоча область стає лише для читання: нічого не видається і нічого не публікується.',
  'billing.ui.cancelBody':
    'Скасування: це одна дія, яка набуває чинності в кінці періоду, за який ви заплатили. Немає жодних дзвінків і форми для заповнення.',
  'billing.ui.cancelStart': 'Скасувати підписку',
  'billing.ui.cancelDialogTitle': 'Скасувати цю підписку',
  'billing.ui.cancelConsequence.noCharge':
    'З вас не стягуватиметься плата. Нічого не зроблено сьогодні чи далі {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'Ви зберігаєте всі функції до {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Чернетки, квитанції, медіа та аналітика залишаються в цій робочій області.',
  'billing.ui.cancelConsequence.scheduled':
    'Публікації заплановано після {date} не опублікує. Скасуйте або перенесіть їх до цього часу.',
  'billing.ui.cancelConsequence.restart': 'Ви можете розпочати підписку знову в будь-який час.',
  'billing.ui.cancelConfirm': 'Скасувати підписку',
  'billing.ui.cancelKeep': 'Зберігайте підписку',
  'billing.ui.cancelConfirmedBeforeConversion': 'Скасовано. З вас не стягуватиметься плата.',
  'billing.ui.cancelConfirmedAfterConversion': 'Скасовано. Доступ існує до {date}.',
  'billing.ui.cancelAnnouncement': 'Підписку скасовано.',
  'billing.ui.canceledNotice': 'Цю підписку скасовано.',
  'billing.ui.resume': 'Почніть підписку знову',
  'billing.ui.noSubscriptionTitle': 'У цій робочій області немає підписки',
  'billing.ui.noSubscriptionExample':
    'Щомісячно 29 доларів. Річна плата становить 300 доларів США, що становить 25 доларів США на місяць. Економте 48 доларів на рік.',
  'billing.ui.overChannelLimitAction': 'Перегляньте підключені канали',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'Дайте коротку відповідь, підтвердьте те, що ми зрозуміли, і отримайте план, який ви можете прийняти пункт за пунктом. Пропонується робота. Він ніколи не планує та не публікує нічого самостійно.',
  'growth.ui.step.intake': 'прийом',
  'growth.ui.step.confirm': 'Підтвердити',
  'growth.ui.step.plan': 'План',
  'growth.ui.stepIndicator': 'Крок {current} з {total}:{name}',
  'growth.ui.intake.section.product': 'Продукт',
  'growth.ui.intake.section.audience': 'Аудиторія та ринки',
  'growth.ui.intake.section.objective': 'Мета',
  'growth.ui.intake.section.capacity': 'Канали і ємність',
  'growth.ui.intake.section.limits': 'Що заборонено',
  'growth.ui.intake.help':
    'Нічого тут не вгадано для вас. Усе, що ви залишаєте порожнім, позначається як відсутнє, а не як заповнене.',
  'growth.ui.intake.productNameHelp': "Ім'я, яке ви використовуєте для клієнтів.",
  'growth.ui.intake.siteUrlHelp':
    'Ми читаємо сторінку, яку ви надали нам як вихідний матеріал. Ви підтверджуєте кожен факт, який ми з нього беремо.',
  'growth.ui.intake.descriptionHelp': 'Що ви продаєте і для кого це, своїми словами.',
  'growth.ui.intake.marketsHelp': 'Країни або регіони. По одному на рядок.',
  'growth.ui.intake.localesHelp': 'Мови, якими ви будете публікувати.',
  'growth.ui.intake.objectiveHelp': 'Чого ви хочете більше в наступному кварталі.',
  'growth.ui.intake.conversionHelp':
    'Дія, яку ви можете виміряти. Реєстрація, демонстрація, покупка.',
  'growth.ui.intake.proofHelp':
    'Тематичні дослідження, тести, які ви запускали, знімки екрана, які ви маєте, дозволи, які ви вже маєте. По одному на рядок.',
  'growth.ui.intake.proofNone': 'У мене ще немає затверджених доказів',
  'growth.ui.intake.proofNoneEffect':
    'План повністю уникатиме претензій щодо результатів і результатів від клієнтів.',
  'growth.ui.intake.channelsHelp': 'Облікові записи, з яких ви вже публікуєте.',
  'growth.ui.intake.capacityHelp': 'Будь чесним. План, який ви не можете виконати, не є планом.',
  'growth.ui.intake.competitorsHelp': 'Додатково. По одному на рядок.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Претензії, які ви не можете висувати з юридичних чи політичних причин. По одному на рядок.',
  'growth.ui.intake.prohibitedTopicsHelp':
    'Теми, від яких варто триматися подалі. По одному на рядок.',
  'growth.ui.intake.submit': 'Перевірте, що ми зрозуміли',
  'growth.ui.intake.savedAnnouncement': 'Профіль підприємства збережено.',
  'growth.ui.intake.requiredMissing':
    'Перш ніж продовжити, заповніть поля, позначені обов’язковими.',

  'growth.ui.confirm.factsTitle': 'Факти, які ви підтвердили',
  'growth.ui.confirm.factsHelp': 'Їх можна використовувати в копії.',
  'growth.ui.confirm.assumptionsTitle': 'Припущення, які ми зробили',
  'growth.ui.confirm.assumptionsHelp':
    'Це не факти. Вони формують план, але ніколи не стають претензією в публікації.',
  'growth.ui.confirm.missingTitle': 'Відсутня',
  'growth.ui.confirm.missingHelp':
    'План працює навколо кожного з них і вказує, що це має значення.',
  'growth.ui.confirm.confidence.label': 'впевненість:{level}',
  'growth.ui.confirm.confidence.low': 'низький',
  'growth.ui.confirm.confidence.medium': 'середній',
  'growth.ui.confirm.confidence.high': 'висока',
  'growth.ui.confirm.promote': 'Підтвердити як факт',
  'growth.ui.confirm.correct': 'Виправте це',
  'growth.ui.confirm.correctLabel': 'Ваше виправлення',
  'growth.ui.confirm.generate': 'Згенеруйте план',
  'growth.ui.confirm.announcement': 'Профіль підприємства підтверджено.',

  'growth.ui.plan.generatingBody':
    'Це займає кілька секунд. Ви можете залишити цю сторінку: план закінчується сам собою.',
  'growth.ui.plan.stateDraft': 'Проект, не затверджений',
  'growth.ui.plan.stateApproved': 'Затверджено',
  'growth.ui.plan.stateSuperseded': 'Замінено новішою версією',
  'growth.ui.plan.newVersionNotice':
    'Оновлення створення версії {version} і залишає підтверджену версію без змін.',
  'growth.ui.plan.emptyTitle': 'Плану ще немає',
  'growth.ui.plan.emptyBody':
    'Заповніть бізнес-профіль, і ми побудуємо план із підтверджених вами фактів.',
  'growth.ui.plan.emptyExample':
    'План містить стратегію, чотиритижневі звіти, одну кампанію UGC, можливості з каталогом і до п’яти інструментів.',
  'growth.ui.plan.tabsLabel': 'План розділів',
  'growth.ui.plan.modelNote': 'Створено {model}, підказка {promptVersion}, на {date}.',

  'growth.ui.strategy.snapshotTitle': 'Знімок бізнесу',
  'growth.ui.strategy.channelPriority': 'Пріоритет{rank}',
  'growth.ui.strategy.channelFormats': 'Нативні формати',
  'growth.ui.strategy.pillarProof': 'Доказ, на який спирається цей стовп',
  'growth.ui.strategy.pillarProofNone':
    'Немає затверджених доказів. Зберігайте цей стовп описовим.',
  'growth.ui.strategy.cadenceCaption': 'Публікацій на тиждень по каналу',
  'growth.ui.strategy.cadenceColumn.channel': 'Канал',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Дописів на тиждень',
  'growth.ui.strategy.cadenceTotal': 'Всього за тиждень',
  'growth.ui.strategy.capacityWarning':
    'Ця каденція є {planned} повідомлення на тиждень проти виявленої потужності {capacity} години. Змініть його або підвищте ємність у профілі.',
  'growth.ui.strategy.measurementBody':
    'Порівняно з вашими власними кінцевими публікаціями в тому самому каналі та форматі. Зовнішній контрольний показник не використовується, оскільки жоден не можна порівняти з вашим обліковим записом.',
  'growth.ui.strategy.localeAdaptations': 'Мовні нотатки',

  'growth.ui.fourWeek.caption': 'Пропоновані брифи по тижнях і днях',
  'growth.ui.fourWeek.column.date': 'Дата',
  'growth.ui.fourWeek.column.channel': 'Канал',
  'growth.ui.fourWeek.column.pillar': 'Стовп',
  'growth.ui.fourWeek.column.format': 'Формат',
  'growth.ui.fourWeek.column.brief': 'Коротко',
  'growth.ui.fourWeek.column.cta': 'Заклик до дії',
  'growth.ui.fourWeek.column.measurement': 'Мірний бирок',
  'growth.ui.fourWeek.column.actions': 'Дії',
  'growth.ui.fourWeek.approvalRequired': 'Перед публікацією потрібне схвалення',
  'growth.ui.fourWeek.approvalNotRequired': 'Для цього облікового запису схвалення не потрібне',
  'growth.ui.fourWeek.noCta': 'Жодного заклику до дії',
  'growth.ui.fourWeek.weekEmpty': 'На цьому тижні не запропоновано жодних трусів.',
  'growth.ui.fourWeek.acceptedCount': '{accepted}з {total} записки, прийняті як чернетки',
  'growth.ui.fourWeek.acceptAnnouncement': 'Чернетка створена з цього брифа.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Додано пропозицію календаря для {date}.',

  'growth.ui.ugc.promptAngle': 'Кут{number}',
  'growth.ui.ugc.checklistTitle': 'Права, згода та розкриття',
  'growth.ui.ugc.checklistHelp':
    'Опрацюйте це з кожним учасником перед публікацією. Згода на появу не є згодою на розміщення реклами.',
  'growth.ui.ugc.incentiveNone': 'Немає стимулів',
  'growth.ui.ugc.incentiveDisclosure':
    'Заохочення має бути розкрито в кожній публікації, яка є результатом цього, як вами, так і учасником.',
  'growth.ui.ugc.honesty':
    'Це планує кампанію, яку ви проводите з реальними людьми. Post Array не знаходить творців, не зв’язується з ними, не пише відгуків і не створює контент для клієнтів.',

  'growth.ui.opportunities.caption':
    'Перевірені можливості з каталогу, упорядковані за відповідністю вашому профілю',
  'growth.ui.opportunities.column.opportunity': 'Можливість',
  'growth.ui.opportunities.column.type': 'Тип',
  'growth.ui.opportunities.column.audience': 'Аудиторія',
  'growth.ui.opportunities.column.fit': 'Чому це підходить',
  'growth.ui.opportunities.column.requirements': 'Вимоги',
  'growth.ui.opportunities.column.rules': 'Правила самореклами',
  'growth.ui.opportunities.column.cost': 'Вартість',
  'growth.ui.opportunities.column.effort': 'зусилля',
  'growth.ui.opportunities.column.verified': 'Востаннє перевірено',
  'growth.ui.opportunities.column.actions': 'Дії',
  'growth.ui.opportunities.costFree': 'безкоштовно',
  'growth.ui.opportunities.effort.low': 'Низький',
  'growth.ui.opportunities.effort.medium': 'Середній',
  'growth.ui.opportunities.effort.high': 'Високий',
  'growth.ui.opportunities.noRequiredAsset': 'Активи не потрібні',
  'growth.ui.opportunities.prepareTitle': 'Підготуйте подачу для{name}',
  'growth.ui.opportunities.prepareRules': 'Їх правила, цит',
  'growth.ui.opportunities.prepareChecklist': 'Що мати напоготові',
  'growth.ui.opportunities.prepareManual':
    'Ви надсилаєте це самостійно на їхньому сайті. Post Array не заповнює форми, не створює облікових записів і не надсилає нікому листи.',
  'growth.ui.opportunities.pitchTitle': 'Осадка кроку',
  'growth.ui.opportunities.pitchHelp':
    'Відредагуйте його, перш ніж надсилати. Він використовує лише ті факти, які ви підтвердили.',
  'growth.ui.opportunities.submittedOn': 'Надіслано{date}',
  'growth.ui.opportunities.staleTitle': 'Деякі записи потребують повторної перевірки',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {#дані перегляду запису пройшла} few {# записи пройшли дату перегляду} many {# записи пройшли дату перегляду} other {# записи пройшли дату перегляду}}. Перевірте поточні правила на сайті, перш ніж покластися на них.',
  'growth.ui.opportunities.emptyExample':
    'Рядок каталогу містить офіційний URL, аудиторію, правила подання, цитовані з сайту, вартість, зусилля та дату, коли особа востаннє перевіряла це.',

  'growth.ui.tools.shown': '{shown}з {max} показано',
  'growth.ui.tools.fewerThanMax':
    'тільки {count, plural, one {# відповідності інструменту} few {# інструменти збігаються} many {# інструменти збігаються} other {# інструменти збігаються}} цей робочий процес із поточним оглядом. Ми б краще показали менше, ніж доповнювали список.',
  'growth.ui.tools.emptyTitle':
    'Жоден перевірений інструмент ще не підходить для цього робочого процесу',
  'growth.ui.tools.emptyBody':
    'Для кожного запису потрібно перевірити ціну, перевірити умови прав і назвати обмеження, перш ніж він з’явиться тут.',
  'growth.ui.tools.emptyExample':
    'У записі вказується, для чого він найкращий, чому він відповідає вашому плану, що він не може робити, навички, які йому потрібні, як результат повертається в Post Array і коли востаннє перевірялася ціна.',
  'growth.ui.tools.openSite': 'Відкрийте офіційний сайт для{name}',
  'growth.ui.tools.stale': 'Пройшла дата перевірки. Виключено зі створених планів.',

  'growth.ui.item.explainTitle': 'Чому це було запропоновано',
  'growth.ui.item.explainEvidence': 'На чому він заснований',
  'growth.ui.item.explainNoEvidence':
    'Це випливає з мети та правил каналу, а не з підтвердженого факту про ваш бізнес.',
  'growth.ui.item.dismissTitle': 'Відхилити цю пропозицію',
  'growth.ui.item.dismissBody':
    'Розкажіть чому. Причина зберігається разом із планом і формує наступну версію.',
  'growth.ui.item.dismissReasonLabel': 'Причина',
  'growth.ui.item.dismissReason.notRelevant': 'Не стосується цього бізнесу',
  'growth.ui.item.dismissReason.noCapacity': 'У нас немає можливостей',
  'growth.ui.item.dismissReason.wrongAudience': 'Неправильна аудиторія',
  'growth.ui.item.dismissReason.alreadyDone': 'Ми вже це робимо',
  'growth.ui.item.dismissReason.policy': 'Проти нашої політики або претензій',
  'growth.ui.item.dismissReason.other': 'Щось інше',
  'growth.ui.item.dismissNote': 'Все, що ви хочете додати',
  'growth.ui.item.dismissed': 'Звільнено. Він залишається видимим, тому його можна скасувати.',
  'growth.ui.item.undoDismiss': 'Скасувати відхилення',

  'growth.ui.export.title': 'Експортуйте цей план',
  'growth.ui.export.formatLabel': 'Формат',
  'growth.ui.export.copy': 'Копіювати в буфер обміну',
  'growth.ui.export.download': 'Завантажити файл',
  'growth.ui.export.copied': 'План скопійовано в буфер обміну.',
  'growth.ui.export.schemaNote':
    'Усі три формати виходять від однієї перевіреної схеми, версії {version}. Структуровані подання безпечні для контролю джерел і не містять секретів.',
  'growth.ui.export.previewLabel': 'Попередній перегляд експорту',
} as const;
