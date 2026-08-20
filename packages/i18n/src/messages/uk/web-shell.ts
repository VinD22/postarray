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
  'shell.documentTitle': '{page}· Relay',
  'shell.tagline': 'Видавничий стіл для людей і агентів.',
  'shell.menu.open': 'Відкрийте меню',
  'shell.menu.title': 'Меню',
  'shell.nav.more': 'більше',
  'shell.help.title': 'Довідка',
  'shell.help.documentation': 'Документація',
  'shell.help.keyboardShortcuts': 'Комбінації клавіш',
  'shell.help.platformStatus': 'Статус платформи',
  'shell.help.whatChanged': 'Що змінилося',
  'shell.help.contactSupport': 'Зверніться до служби підтримки',
  'shell.account.settings': 'Налаштування',
  'shell.account.profile': 'Ваш профіль',
  'shell.workspace.create': 'Створіть робочий простір',
  'shell.workspace.manage': 'Налаштування Workspace',
  'shell.workspace.role': 'Ви є {role} тут',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Демо дані',
  'shell.demo.title': 'Ви переглядаєте демонстраційні дані',
  'shell.demo.body':
    'Relay API недоступний із цього браузера, тому екрани заповнені робочою областю із заповненим прикладом. Тут нічого не пов’язано з реальним обліковим записом і нічого не можна публікувати.',
  'shell.demo.howToConnect':
    'Установіть NEXT_PUBLIC_RELAY_API_URL і перезапустіть програму, щоб використовувати живі дані.',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Ви офлайн',
  'shell.offline.body':
    'На цьому пристрої зберігаються чернетки. Планування та публікація відновляться, коли з’єднання відновиться.',
  'shell.offline.retry': 'Перевірте підключення',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Відкрийте панель команд',
  'palette.title': 'Палітра команд',
  'palette.description': 'Знайдіть екран, обліковий запис або дію.',
  'palette.placeholder': 'Введіть команду або псевдонім',
  'palette.empty': 'Нічого не збігається {query}.',
  'palette.group.actions': 'Дії',
  'palette.group.goTo': 'Перейти до',
  'palette.group.workspaces': 'Workspaces',
  'palette.group.settings': 'Налаштування',
  'palette.hint.navigate': 'Переміщайтеся за допомогою клавіш зі стрілками',
  'palette.hint.select': 'Відкрийте за допомогою Enter',
  'palette.hint.close': 'Закрийте за допомогою Escape',
  'palette.action.compose': 'Створіть допис',
  'palette.action.connectAccount': 'Підключіть обліковий запис',
  'palette.action.openActionCenter': 'Відкрийте Центр дій',
  'palette.action.uploadMedia': 'Завантажте медіа',
  'palette.action.createRule': 'Створіть правило автоматизації',
  'palette.action.toggleTheme': 'Змінити тему',
  'palette.action.signOut': 'Вийти',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Відкрийте Центр дій',
  'actionCenter.group.now.label': 'Зараз',
  'actionCenter.group.soon.label': 'скоро',
  'actionCenter.group.watching.label': 'Дивлячись',
  'actionCenter.group.now.hint':
    'Публікація знаходиться під загрозою, доки вони не будуть розглянуті.',
  'actionCenter.group.soon.hint': 'У них є крайній термін, який ви все ще можете вкластися.',
  'actionCenter.group.watching.hint': 'Не терміново. Варто подивитися цього тижня.',
  'actionCenter.severity.now': 'Потрібен ти зараз',
  'actionCenter.severity.soon': 'Ти скоро потрібен',
  'actionCenter.severity.watching': 'Дивлячись',
  'actionCenter.filter.all': 'все',
  'actionCenter.filter.connections': "Зв'язки",
  'actionCenter.filter.publishing': 'Видавництво',
  'actionCenter.filter.automation': 'автоматизація',
  'actionCenter.filter.billing': 'Виставлення рахунків',
  'actionCenter.snoozed': 'Відкладено',
  'actionCenter.snoozeOneDay': 'Відкласти на день',
  'actionCenter.snoozedUntil': 'Відкладено до{date}',
  'actionCenter.unsnooze': 'Поверни це назад',
  'actionCenter.resolved': 'Вирішено{relativeTime}',
  'actionCenter.emptyFiltered': 'Ніщо в цій групі не потребує уваги.',
  'actionCenter.errorTitle': 'Не вдалося завантажити Центр дій',
  'actionCenter.loading': 'Завантаження того, що потребує уваги',
  'actionCenter.affectedAccount': 'Впливає{account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Ніщо не потребує уваги} one {# пункт} few {# елементи} many {# елементи} other {# елементи}}',
  'actionCenter.action.reconnect': 'Повторне підключення',
  'actionCenter.action.openReceipt': 'Відкрийте квитанцію',
  'actionCenter.action.review': 'огляд',
  'actionCenter.action.openDraft': 'Відкрийте чернетку',
  'actionCenter.action.openCalendar': 'Відкрийте календар',
  'actionCenter.action.viewStatus': 'Переглянути статус',
  'actionCenter.action.checkFeed': 'Перевірте подачу',
  'actionCenter.action.inspectDeliveries': 'Перевірте поставки',
  'actionCenter.action.addBalance': 'Перегляньте використання',
  'actionCenter.action.fixConnection': "Виправте з'єднання",

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'додому',
  'home.subtitle': 'Що вам потрібно сьогодні, а що буде далі.',
  'home.greetingSummary':
    '{actions, plural, =0 {Ти зараз нічого не потребуєш} one {# предмет потребує вас} few {# предмети потребують вас} many {# предмети потребують вас} other {# предмети потребують вас}}. {upcoming, plural, =0 {У наступні 24 роки нічого не заплановано} one {# повідомлення виходити протягом наступних 24 годин} few {# повідомлення виходять протягом наступних 24 годин} many {# повідомлення виходять протягом наступних 24 годин} other {# повідомлення виходять протягом наступних 24 годин}}.',
  'home.needsYou.title': 'Потрібен ти зараз',
  'home.needsYou.empty': 'Ти зараз нічого не потребуєш.',
  'home.needsYou.emptyBody':
    'Справність з’єднання, схвалення та невдалі публікації з’являються тут, коли вони відбуваються.',
  'home.needsYou.viewAll': 'Відкрийте Центр дій',
  'home.needsYou.emptyQuiet':
    'Насолоджуйтесь тишею. Усе, що потребує рішення, з’являється тут одразу.',
  'home.upcoming.title': 'Наступні 24 години',
  'home.upcoming.empty': 'У наступні 24 години нічого не заплановано.',
  'home.upcoming.emptyBody': 'Напишіть пост і виберіть час. Ви можете змінити це пізніше.',
  'home.upcoming.viewAll': 'Відкрийте календар',
  'home.upcoming.timeZoneNote': 'Час показано в {timeZone}, зона робочого простору.',
  'home.upcoming.columnTime': 'час',
  'home.upcoming.columnAccount': 'Обліковий запис',
  'home.upcoming.columnContent': 'Зміст',
  'home.upcoming.columnStatus': 'Статус',
  'home.receipts.title': 'Останні надходження',
  'home.receipts.empty': 'З цієї робочої області ще не опубліковано жодної публікації.',
  'home.receipts.emptyBody':
    'Кожна публікація видає квитанцію, яку ви можете перевірити та поділитися.',
  'home.receipts.viewAll': 'Всі квитанції',
  'home.receipts.publishedTo': 'Опубліковано в{account}',
  'home.connections.title': 'Справність підключення',
  'home.connections.summary':
    '{healthy, plural, one {#обліковий запис працює} few {# облікові записи працюють} many {# облікові записи працюють} other {# облікові записи працюють}}. {attention, plural, =0 {Ніхто не потребує уваги} one {# потребує уваги} few {# потребують увагу} many {# потребують увагу} other {# потребують увагу}}.',
  'home.connections.viewAll': "Всі з'єднання",
  'home.connections.empty': 'Ще немає підключених облікових записів.',
  'home.advisor.title': 'Радник із зростання',
  'home.advisor.summary':
    'Плановий варіант {version} було підтверджено {date}. тиждень {week} з {total} має {briefs, plural, one {# резюме ще не складено} few {# записки ще не складені} many {# записки ще не складені} other {# записки ще не складені}}.',
  'home.advisor.noPlan':
    'Радник будує план на основі підтверджених вами фактів. Він пропонує роботу і ніколи не публікує самостійно.',
  'home.advisor.openPlan': 'Відкрийте план',
  'home.advisor.createDrafts': 'Створюйте чернетки з тижня{week}',
  'home.advisor.start': 'Запустіть бізнес-профіль',
  'home.trial.banner':
    'суд, {days, plural, =0 {закінчується сьогодні} one {# залишився день} few {# залишилося днів} many {# залишилося днів} other {# залишилося днів}}. Навертає {date} до {amount}.',
  'home.trial.manage': 'Керувати або скасувати',
  'home.error.title': 'Не вдалося завантажити домашню сторінку',
  'home.error.body': 'Ваше робоче місце неушкоджене. Це проблема з доступом до Relay API.',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title': 'Опублікуйте через офіційні API і подивіться, що саме сталося.',
  'auth.aside.point.receipts':
    'Кожна публікація видає квитанцію: хто її погодив, коли відправив, що платформа повернула.',
  'auth.aside.point.approvals':
    'Ніщо не потрапляє на платформу без схвалення, якого вимагає ваша політика.',
  'auth.aside.point.surfaces':
    'Той самий робочий процес із веб-програми, REST API, MCP, CLI і веб-хуків.',
  'auth.provider.title': 'Перш ніж продовжити',
  'auth.provider.google.access':
    'Google надає ваше ім’я, адресу електронної пошти та зображення профілю компанії Relay. Relay не може читати вашу пошту Gmail, Диск або Календар.',
  'auth.provider.facebook.access':
    'Facebook надає ваше ім’я, адресу електронної пошти та зображення профілю компанії Relay. Підключення сторінки для публікації є окремим кроком, який ви підтверджуєте пізніше.',
  'auth.provider.note': 'Ви ввійдете в систему. Це не пов’язує обліковий запис для публікації.',
  'auth.continueWithEmail': 'Продовжте з електронною поштою',
  'auth.method.password': 'Пароль',
  'auth.method.magicLink': 'Посилання електронною поштою',
  'auth.method.username': "Ім'я користувача",
  'auth.method.chooseLabel': 'Як ви хочете ввійти?',
  'auth.username.placeholder': "ваше ім'я користувача",
  'auth.username.aliasNote':
    'Ім’я користувача – це псевдонім електронної адреси вашого облікового запису. Пароль той самий.',
  'auth.password.placeholder': 'Ваш пароль',
  'auth.submit.signIn': 'Увійдіть',
  'auth.submit.signUp': 'Створити акаунт',
  'auth.submit.working': 'Перевірка',
  'auth.failure.credentials':
    'Ця електронна адреса та пароль не збігаються з обліковим записом. Перевірте обидва та повторіть спробу.',
  'auth.failure.usernameCredentials':
    'Це ім’я користувача та пароль не збігаються з обліковим записом. Перевірте обидва та повторіть спробу.',
  'auth.failure.noAccountLeak': 'Для вашої безпеки ми не повідомляємо, чи зареєстрована адреса.',
  'auth.failure.provider': 'Знак в с {provider} не завершили. Нічого не змінилося.',
  'auth.failure.network':
    'Нам не вдалося зв’язатися з Relay. Перевірте підключення та повторіть спробу.',
  'auth.signUp.trialNote':
    'Сім повних днів випробування. Потрібно вказати спосіб оплати. 0 доларів США до сплати сьогодні',
  'auth.signUp.emailInUseNote':
    'Якщо на цю адресу вже є обліковий запис, ми надішлемо електронною поштою посилання для входу замість створення другого.',
  'auth.legal.readTerms': 'Прочитайте Умови',
  'auth.legal.readPrivacy': 'Прочитайте Повідомлення про конфіденційність',
  'auth.switchToSignUp': 'Створіть обліковий запис',
  'auth.switchToSignIn': 'Натомість увійдіть',
  'auth.checkEmail.body': 'Ми надіслали посилання для входу {email}. Це працює один раз.',
  'auth.checkEmail.wrongAddress': 'Використовуйте іншу адресу',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Виставлення рахунків',
  'onboarding.stepName.workspace': 'Workspace',
  'onboarding.stepName.role': 'Випадок використання',
  'onboarding.stepName.connect': 'Підключитися',
  'onboarding.stepName.compose': 'Перший пост',
  'onboarding.stepName.receipt': 'Підтвердження',
  'onboarding.stepList': 'Етапи налаштування',
  'onboarding.stepComplete': 'Готово',
  'onboarding.stepCurrent': 'Поточний крок',
  'onboarding.exit': 'Закінчити пізніше',
  'onboarding.plan.intervalMonthlyLabel': '29 доларів на місяць',
  'onboarding.plan.intervalAnnualLabel': '300 доларів на рік',
  'onboarding.plan.checkoutHint':
    'Наступний екран: Polar, наш офіційний торговець. Доступ надається, коли Polar підтверджує підписку, а не коли браузер повертається.',
  'onboarding.plan.factsTitle': 'Що станеться, коли ви продовжите',
  'onboarding.workspace.help':
    'Робоча область містить ваші бренди, підключені облікові записи, чернетки та квитанції. Ви можете створити більше пізніше.',
  'onboarding.workspace.localeNote':
    'Ваша мова інтерфейсу змінює цю програму. Мови вмісту вибираються для кожної публікації та не залежать від цього налаштування.',
  'onboarding.workspace.timeZoneDetected': 'Виявлено з цього пристрою:{timeZone}',
  'onboarding.connect.permissionsTitle': 'Що {provider} запитувати',
  'onboarding.connect.permissionsFooter':
    'Relay ніколи не запитує дозвіл, який він не використовує, і ви можете будь-коли відключитися.',
  'onboarding.connect.chooseProvider': 'Виберіть платформу',
  'onboarding.connect.opensProvider': 'Відкривається продовження {provider} на цій вкладці.',
  'onboarding.compose.help':
    'Напишіть публікацію, а потім перевірте попередній перегляд і перевірку, перш ніж вибрати час.',
  'onboarding.compose.openComposer': 'Відкрийте повний композитор',
  'onboarding.receipt.title': 'Ваша перша публікація запланована',
  'onboarding.receipt.body':
    'Ось поточний рекорд. Він постійно оновлюється через відправлення, відповідь постачальника та першу синхронізацію аналітики.',
  'onboarding.receipt.goHome': 'Перейдіть на головну сторінку',
  'onboarding.blocked.title': 'Цей крок потребує попереднього',
  'onboarding.blocked.body': 'Закінчити {step} перший. Нічого, що ви ввели, не буде втрачено.',
} as const;
