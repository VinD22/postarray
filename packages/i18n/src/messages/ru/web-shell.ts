/**
 * The web application shell: Home, the command palette, the Action center
 * queue chrome, the demo data notice, and the parts of sign in and onboarding
 * that the shared `auth`, `onboarding` and `billing` catalogs do not cover.
 *
 * Owned by the web shell. Screen catalogs (composer, calendar, analytics)
 * belong to their own files.
 */
export const webShellMessages = {
  /* -- Document and shell chrome ----------------------------------------- */
  'shell.appName': 'Relay',
  'shell.documentTitle': '{page} · Relay',
  'shell.tagline': 'Издательский отдел для людей и агентов.',
  'shell.menu.open': 'Открыть меню',
  'shell.menu.title': 'Меню',
  'shell.nav.more': 'Подробнее',
  'shell.help.title': 'Помощь',
  'shell.help.documentation': 'Документация',
  'shell.help.keyboardShortcuts': 'Сочетания клавиш',
  'shell.help.platformStatus': 'Статус платформы',
  'shell.help.whatChanged': 'Что изменилось',
  'shell.help.contactSupport': 'Связаться со службой поддержки',
  'shell.account.settings': 'Настройки',
  'shell.account.profile': 'Ваш профиль',
  'shell.workspace.create': 'Создайте рабочее пространство',
  'shell.workspace.manage': 'Настройки Workspace',
  'shell.workspace.role': 'Вы {role} здесь',
  'shell.brand.filterHint': 'Фильтрация «Домой», «Календаря» и «Аналитики» по этому бренду.',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Демонстрационные данные',
  'shell.demo.title': 'Вы смотрите демо-данные',
  'shell.demo.body':
    'API Relay недоступен из этого браузера, поэтому экраны заполнены заполненным примером рабочей области. Здесь ничего не связано с реальным аккаунтом и ничего нельзя публиковать.',
  'shell.demo.howToConnect':
    'Установите NEXT_PUBLIC_RELAY_API_URL и перезапустите приложение, чтобы использовать текущие данные.',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Вы оффлайн',
  'shell.offline.body':
    'Черновики сохраняются на этом устройстве. Планирование и публикация возобновляются после восстановления соединения.',
  'shell.offline.retry': 'Проверьте соединение',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Откройте палитру команд',
  'palette.title': 'Палитра команд',
  'palette.description': 'Найдите экран, учетную запись или действие.',
  'palette.placeholder': 'Введите команду или отображаемое имя',
  'palette.empty': 'Ничего не соответствует {query}.',
  'palette.group.actions': 'Действия',
  'palette.group.goTo': 'Перейти к',
  'palette.group.workspaces': 'Workspaces',
  'palette.group.settings': 'Настройки',
  'palette.hint.navigate': 'Двигайтесь с помощью клавиш со стрелками',
  'palette.hint.select': 'Открыть с помощью Enter',
  'palette.hint.close': 'Закрыть с помощью Escape',
  'palette.action.compose': 'Написать сообщение',
  'palette.action.connectAccount': 'Подключить аккаунт',
  'palette.action.openActionCenter': 'Откройте Центр действий',
  'palette.action.uploadMedia': 'Загрузить медиа',
  'palette.action.createRule': 'Создайте правило автоматизации',
  'palette.action.toggleTheme': 'Переключить тему',
  'palette.action.signOut': 'Выйти',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Откройте Центр действий',
  'actionCenter.group.now.label': 'Сейчас',
  'actionCenter.group.soon.label': 'Скоро',
  'actionCenter.group.watching.label': 'Смотрю',
  'actionCenter.group.now.hint': 'Публикация находится под угрозой, пока они не будут обработаны.',
  'actionCenter.group.soon.hint': 'У них есть крайний срок, который вы еще можете уложиться.',
  'actionCenter.group.watching.hint': 'Не срочно. Стоит посмотреть на этой неделе.',
  'actionCenter.severity.now': 'Ты нужен сейчас',
  'actionCenter.severity.soon': 'Ты скоро понадобишься',
  'actionCenter.severity.watching': 'Смотрю',
  'actionCenter.filter.all': 'Все',
  'actionCenter.filter.connections': 'Соединения',
  'actionCenter.filter.publishing': 'Публикация',
  'actionCenter.filter.automation': 'Автоматизация',
  'actionCenter.filter.billing': 'Биллинг',
  'actionCenter.snoozed': 'Отложено',
  'actionCenter.snoozeOneDay': 'Отложить на день',
  'actionCenter.snoozedUntil': 'Отложено до {date}',
  'actionCenter.unsnooze': 'Верни это обратно',
  'actionCenter.resolved': 'Решено {relativeTime}',
  'actionCenter.emptyFiltered': 'Ничто в этой группе не требует внимания.',
  'actionCenter.errorTitle': 'Не удалось загрузить Центр действий.',
  'actionCenter.loading': 'Загрузка того, что требует внимания',
  'actionCenter.affectedAccount': 'Влияет на {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Ничего не требует внимания} one {# элемент} few {# элемента} many {# элемента} other {# элемента}}',
  'actionCenter.action.reconnect': 'Восстановить соединение',
  'actionCenter.action.openReceipt': 'Откройте квитанцию',
  'actionCenter.action.review': 'Обзор',
  'actionCenter.action.openDraft': 'Открыть черновик',
  'actionCenter.action.openCalendar': 'Открыть календарь',
  'actionCenter.action.viewStatus': 'Посмотреть статус',
  'actionCenter.action.checkFeed': 'Проверьте ленту',
  'actionCenter.action.inspectDeliveries': 'Проверка поставок',
  'actionCenter.action.addBalance': 'Просмотрите использование',
  'actionCenter.action.fixConnection': 'Исправить соединение',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Главная',
  'home.subtitle': 'Что вам нужно сегодня и что будет дальше.',
  'home.greetingSummary':
    '{actions, plural, =0 {Вы сейчас ничему не нужны} one {Вы нужны # предмету} few {Вы нужны # предмету} many {Вы нужны # предмету} other {Вы нужны # предмету}}. {upcoming, plural, =0 {В ближайшие 24 часа ничего не запланировано} one {# сообщение будет опубликовано в ближайшие 24 часа} few {# сообщение будет опубликовано в ближайшие 24 часа} many {# сообщение будет опубликовано в ближайшие 24 часа} other {# сообщение будет опубликовано в ближайшие 24 часа}}.',
  'home.needsYou.title': 'Ты нужен сейчас',
  'home.needsYou.empty': 'Ничего тебе сейчас не нужно.',
  'home.needsYou.emptyBody':
    'Состояние подключения, утверждения и неудачные публикации отображаются здесь в тот момент, когда они происходят.',
  'home.needsYou.viewAll': 'Откройте Центр действий',
  'home.needsYou.emptyQuiet':
    'Наслаждайтесь тишиной. Все, что требует решения, появляется здесь в тот момент, когда оно требуется.',
  'home.upcoming.title': 'Следующие 24 часа',
  'home.upcoming.empty': 'В ближайшие 24 часа ничего не запланировано.',
  'home.upcoming.emptyBody': 'Напишите пост и выберите время. Вы можете изменить его позже.',
  'home.upcoming.viewAll': 'Открыть календарь',
  'home.upcoming.timeZoneNote': 'Время отображается в {timeZone}, рабочей зоне.',
  'home.upcoming.columnTime': 'Время',
  'home.upcoming.columnAccount': 'Аккаунт',
  'home.upcoming.columnContent': 'Содержание',
  'home.upcoming.columnStatus': 'Статус',
  'home.receipts.title': 'Последние поступления',
  'home.receipts.empty': 'Из этой рабочей области пока не опубликовано ни одного сообщения.',
  'home.receipts.emptyBody':
    'Каждая публикация содержит квитанцию, которую вы можете просмотреть и поделиться.',
  'home.receipts.viewAll': 'Все поступления',
  'home.receipts.publishedTo': 'Опубликовано на {account}',
  'home.connections.title': 'Состояние соединения',
  'home.connections.summary':
    '{healthy, plural, one {# аккаунт работает} few {# аккаунт работает} many {# аккаунт работает} other {# аккаунт работает}}. {attention, plural, =0 {Ни один не требует внимания} one {# требует внимания} few {# требует внимания} many {# требует внимания} other {# требует внимания}}.',
  'home.connections.viewAll': 'Все соединения',
  'home.connections.empty': 'Аккаунты пока не подключены.',
  'home.advisor.title': 'Советник по росту',
  'home.advisor.summary':
    'Утверждена плановая версия {version} {date}. На неделе {week} из {total} есть {briefs, plural, one {# брифов еще не составлено} few {# брифов еще не составлено} many {# брифов еще не составлено} other {# брифов еще не составлено}}.',
  'home.advisor.noPlan':
    'Советник строит план на основе подтвержденных вами фактов. Он предлагает работу и никогда не публикуется самостоятельно.',
  'home.advisor.openPlan': 'Открыть план',
  'home.advisor.createDrafts': 'Создание черновиков за неделю {week}',
  'home.advisor.start': 'Начать бизнес-профиль',
  'home.trial.banner':
    'Пробная версия, {days, plural, =0 {заканчивается сегодня} one {остался # день} few {осталось # дней} many {осталось # дней} other {осталось # дней}}. Преобразует {date} в {amount}.',
  'home.trial.manage': 'Управлять или отменить',
  'home.error.title': 'Не удалось загрузить главную страницу.',
  'home.error.body': 'Ваше рабочее место не повреждено. Это проблема с доступом к API Relay.',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title': 'Опубликуйте через официальные API и посмотрите, что именно произошло.',
  'auth.aside.point.receipts':
    'Каждая публикация выдает квитанцию: кто ее одобрил, когда она была отправлена, что вернула платформа.',
  'auth.aside.point.approvals':
    'Ничто не попадает на платформу без одобрения, которого требует ваша политика.',
  'auth.aside.point.surfaces':
    'Тот же рабочий процесс из веб-приложения, REST API, MCP, CLI и веб-перехватчиков.',
  'auth.provider.title': 'Прежде чем продолжить',
  'auth.provider.google.access':
    'Google передает ваше имя, адрес электронной почты и изображение профиля Relay. Relay не может прочитать вашу почту Gmail, Диск или Календарь.',
  'auth.provider.facebook.access':
    'Facebook передает ваше имя, адрес электронной почты и изображение профиля Relay. Подключение Страницы для публикации, это отдельный шаг, который вы утверждаете позже.',
  'auth.provider.note':
    'При этом вы входите в систему. При этом учетная запись для публикации не подключается.',
  'auth.continueWithEmail': 'Продолжить по электронной почте',
  'auth.method.password': 'Пароль',
  'auth.method.magicLink': 'Ссылка на электронную почту',
  'auth.method.username': 'Имя пользователя',
  'auth.method.chooseLabel': 'Как вы хотите войти в систему?',
  'auth.username.placeholder': 'ваше имя пользователя',
  'auth.username.aliasNote':
    'Имя пользователя, это псевдоним адреса электронной почты в вашей учетной записи. Пароль тот же.',
  'auth.password.placeholder': 'Ваш пароль',
  'auth.submit.signIn': 'Войти',
  'auth.submit.signUp': 'Создать учетную запись',
  'auth.submit.working': 'Проверка',
  'auth.failure.credentials':
    'Этот адрес электронной почты и пароль не соответствуют учетной записи. Проверьте оба и повторите попытку.',
  'auth.failure.usernameCredentials':
    'Это имя пользователя и пароль не соответствуют учетной записи. Проверьте оба и повторите попытку.',
  'auth.failure.noAccountLeak':
    'В целях вашей безопасности мы не сообщаем, зарегистрирован ли адрес.',
  'auth.failure.provider': 'Вход с помощью {provider} не завершен. Ничего не изменилось.',
  'auth.failure.network':
    'Нам не удалось связаться с Relay. Проверьте подключение и повторите попытку.',
  'auth.signUp.trialNote':
    'Семь полных пробных дней. Укажите способ оплаты. 0 долларов США к оплате сегодня.',
  'auth.signUp.emailInUseNote':
    'Если на этом адресе уже есть учетная запись, мы отправим ссылку для входа по электронной почте вместо создания второй.',
  'auth.legal.readTerms': 'Прочтите Условия',
  'auth.legal.readPrivacy': 'Прочтите уведомление о конфиденциальности',
  'auth.switchToSignUp': 'Создать учетную запись',
  'auth.switchToSignIn': 'Вместо этого войдите в систему',
  'auth.checkEmail.body': 'Мы отправили ссылку для входа на {email}. Это работает один раз.',
  'auth.checkEmail.wrongAddress': 'Использовать другой адрес',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Биллинг',
  'onboarding.stepName.workspace': 'Workspace',
  'onboarding.stepName.role': 'Вариант использования',
  'onboarding.stepName.connect': 'Подключиться',
  'onboarding.stepName.compose': 'Первый пост',
  'onboarding.stepName.receipt': 'Подтверждение',
  'onboarding.stepList': 'Шаги настройки',
  'onboarding.stepComplete': 'Готово',
  'onboarding.stepCurrent': 'Текущий шаг',
  'onboarding.exit': 'Закончить позже',
  'onboarding.plan.intervalMonthlyLabel': '29 долларов в месяц',
  'onboarding.plan.intervalAnnualLabel': '300 долларов в год',
  'onboarding.plan.checkoutHint':
    'Следующий экран, Polar, наш зарегистрированный торговец. Доступ предоставляется, когда Polar подтверждает подписку, а не когда браузер возвращается.',
  'onboarding.plan.factsTitle': 'Что произойдет, если вы продолжите',
  'onboarding.workspace.help':
    'В рабочей области хранятся ваши бренды, подключенные учетные записи, черновики и квитанции. Вы можете создать больше позже.',
  'onboarding.workspace.localeNote':
    'Ваш язык интерфейса меняет это приложение. Языки контента выбираются для каждого сообщения и не зависят от этого параметра.',
  'onboarding.workspace.timeZoneDetected': 'Обнаружено с этого устройства: {timeZone}',
  'onboarding.connect.permissionsTitle': 'Что будет запрошено {provider}',
  'onboarding.connect.permissionsFooter':
    'Relay никогда не запрашивает разрешения, которые он не использует, и вы можете отключиться в любой момент.',
  'onboarding.connect.chooseProvider': 'Выберите платформу',
  'onboarding.connect.opensProvider': 'Продолжение открывает {provider} в этой вкладке.',
  'onboarding.compose.help':
    'Напишите сообщение, затем проверьте предварительный просмотр и проверку, прежде чем выбрать время.',
  'onboarding.compose.openComposer': 'Откройте полную версию композитора',
  'onboarding.receipt.title': 'Ваш первый пост запланирован',
  'onboarding.receipt.body':
    'Вот рекорд на данный момент. Он продолжает обновляться посредством отправки, ответа поставщика и первой синхронизации аналитики.',
  'onboarding.receipt.goHome': 'Перейти домой',
  'onboarding.blocked.title': 'Этот шаг требует предыдущего',
  'onboarding.blocked.body': 'Сначала завершите {step}. Ничего из того, что вы ввели, не потеряно.',
} as const;
