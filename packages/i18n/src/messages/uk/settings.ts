/** Workspace settings: members, roles, projects, localization, security, data. */
export const settingsMessages = {
  'settings.title': 'Налаштування',
  'settings.saved': 'Збережено',
  'settings.unsavedChanges': 'У вас є незбережені зміни.',

  'settings.workspace.title': 'Workspace',
  'settings.workspace.name': 'Назва Workspace',
  'settings.workspace.defaultTimeZone': 'Часовий пояс за умовчанням',
  'settings.workspace.defaultLocale': 'Мова інтерфейсу за замовчуванням',
  'settings.workspace.defaultContentLocale': 'Мова вмісту за замовчуванням',
  'settings.workspace.transferOwnership': 'Передача права власності',
  'settings.workspace.delete': 'Видалити робочу область',
  'settings.workspace.deleteWarning':
    'Видалення робочої області скасовує заплановані публікації, скасовує підключення та видаляє збережені медіафайли. Квитанції зберігаються протягом терміну зберігання, зазначеного в Умовах.',

  'settings.members.title': 'Члени та ролі',
  'settings.members.invite': 'Запросіть людей',
  'settings.members.inviteEmail': 'Адреса електронної пошти',
  'settings.members.inviteSent': 'Запрошення надіслано {email}.',
  'settings.members.pending': 'Запрошено, ще не прийнято',
  'settings.members.count':
    '{count, plural, one {#член} few {# членів} many {# членів} other {# членів}}',
  'settings.members.removeConfirm':
    'видалити {name} з цієї робочої області? Їхні минулі дії залишаються в журналі аудиту.',
  'settings.role.owner.label': 'Власник',
  'settings.role.admin.label': 'адмін',
  'settings.role.manager.label': 'Менеджер',
  'settings.role.editor.label': 'редактор',
  'settings.role.approver.label': 'Затверджувач',
  'settings.role.analyst.label': 'Аналітик',
  'settings.role.viewer.label': 'Переглядач',
  'settings.role.owner.description': 'Все, включаючи виставлення рахунків, безпеку та видалення.',
  'settings.role.admin.description': 'Усе, крім виставлення рахунків і видалення робочої області.',
  'settings.role.manager.description': 'Керуйте брендами, зв’язками, графіками та правилами.',
  'settings.role.editor.description': 'Створюйте та редагуйте вміст, запитуйте схвалення.',
  'settings.role.approver.description':
    'Схвалюйте або відхиляйте вміст і плануйте те, що буде схвалено.',
  'settings.role.analyst.description': 'Читайте аналітику та квитанції.',
  'settings.role.viewer.description': 'Тільки для читання.',
  'settings.role.scopeLabel': 'Обмеження брендами та обліковими записами',
  'settings.role.mfaRequired': 'Власники повинні використовувати двофакторну аутентифікацію.',

  'settings.projects.title': 'Projects',
  'settings.projects.add': 'Додайте бренд',
  'settings.projects.voice': 'Голос',
  'settings.projects.audience': 'Аудиторія',
  'settings.projects.approvedClaims': 'Затверджені претензії',
  'settings.projects.blockedTerms': 'Заблоковані умови',
  'settings.projects.disclosureDefaults': 'Розкриття інформації за замовчуванням',
  'settings.projects.domains': 'Домени',
  'settings.projects.glossary.title': 'Глосарій',
  'settings.projects.glossary.term': 'термін',
  'settings.projects.glossary.preferred': 'Бажаний переклад',
  'settings.projects.glossary.prohibited': 'Не перекладайте як',
  'settings.projects.glossary.context': 'Контекст',
  'settings.projects.glossary.keepUntranslated': 'Залишити без перекладу',
  'settings.projects.localeRules.title': 'Локальні правила',
  'settings.projects.localeRules.formality': 'Формальність',
  'settings.projects.localeRules.pronouns': 'Займенники та почесні слова',
  'settings.projects.localeRules.idioms': 'Ідіоми, яких слід уникати',
  'settings.projects.localeRules.emoji': 'Норми емодзі та хештегів',
  'settings.projects.localeRules.legal': 'Регіональні правові розкриття',
  'settings.projects.localeRules.cta': 'Заклик до дії за ринком',
  'settings.projects.localeRules.reviewedExamples': 'Приклади, схвалені місцевим рецензентом',

  'settings.sets.title': 'Набори',
  'settings.sets.description':
    'Багаторазова група цілей, варіантів, налаштувань, коментарів і затримок. Застосування набору створює незалежну чернетку.',
  'settings.sets.editNote':
    'Редагування набору не змінює публікації, які вже затверджені або заплановані.',
  'settings.signatures.title': 'Підписи',
  'settings.signatures.description':
    'Закриваючий текст, хеш-теги, посилання або розкриття інформації за брендом, платформою та мовою.',
  'settings.signatures.autoApply': 'Додавати автоматично, коли контекст збігається',

  'settings.localization.title': 'Локалізація',
  'settings.localization.interfaceLocale': 'Мова інтерфейсу',
  'settings.localization.interfaceLocaleHelp':
    'Мова цієї програми для вас. Це не змінює мову ваших публікацій.',
  'settings.localization.contentLocales': 'Мови вмісту',
  'settings.localization.contentLocalesHelp':
    'Мови, якими ви публікуєте. Кожен бренд може встановлювати правила та глосарій для кожної мови.',
  'settings.localization.marketLocales': 'Ринки аудиторії',
  'settings.localization.beta': 'Бета переклад',
  'settings.localization.betaHelp':
    'Ця мова підтримується машиною та ще не повністю перевірена особою. Неперекладений текст повертається англійською мовою.',
  'settings.localization.humanReviewed': 'Рецензія носієм мови',
  'settings.localization.timeZone': 'Часовий пояс',
  'settings.localization.weekStart': 'Перший день тижня',
  'settings.localization.hourCycle.label': 'Формат часу',
  'settings.localization.hourCycle.h12': '12 годин',
  'settings.localization.hourCycle.h23': '24 години',

  'settings.notifications.title': 'Сповіщення',
  'settings.notifications.email': 'Електронна пошта',
  'settings.notifications.inApp': 'У додатку',
  'settings.notifications.approvalRequests': 'Запити на схвалення',
  'settings.notifications.publishResults': 'Опублікувати результати',
  'settings.notifications.connectionHealth': 'Справність підключення',
  'settings.notifications.ruleFailures': 'Збої автоматики',
  'settings.notifications.weeklySummary': 'Тижневий підсумок',
  'settings.notifications.digestOnly': 'Згрупуйте їх в одне щоденне повідомлення',

  'settings.security.title': 'Безпека',
  'settings.security.mfa': 'Двофакторна аутентифікація',
  'settings.security.mfaEnable': 'Увімкніть двофакторну автентифікацію',
  'settings.security.mfaRequiredFor':
    'Необхідно для змін платежів, облікових записів обслуговування, повторного підключення облікового запису та відкликання облікових даних.',
  'settings.security.passkeys': 'Ключі доступу',
  'settings.security.sessions': 'Активні сесії',
  'settings.security.sessionRevoke': 'Вийти з цього сеансу',
  'settings.security.auditLog.title': 'Ревізійний журнал',
  'settings.security.auditLog.description':
    'Кожна дія, хто або що її виконав і коли. Власники та адміністратори можуть експортувати.',
  'settings.security.killSwitch': 'Аварійна зупинка',
  'settings.security.killSwitchBody':
    'Негайно зупиняє кожну заплановану публікацію та автоматизацію в цій робочій області. Нічого не видалено. Ви можете вимкнути його знову.',
  'settings.security.killSwitchActive':
    'Увімкнено аварійну зупинку. Жодна публікація не буде опублікована.',

  'settings.data.title': 'Контроль даних',
  'settings.data.export': 'Експортуйте свої дані',
  'settings.data.exportPreparing':
    'Підготовка вашого експорту. Ми надішлемо вам електронний лист, коли він буде готовий.',
  'settings.data.deletionRequest': 'Запит на видалення',
  'settings.data.deletionExplain':
    'Видалення скасовує заплановані робочі процеси, скасовує доступ постачальника, видаляє збережені медіафайли та аналітику надгробків, якщо цього вимагає постачальник.',
  'settings.data.retention': 'Збереження',
  'settings.data.consents': 'Згоди',
  'settings.data.consent.productAnalytics': 'Аналітика продукту',
  'settings.data.consent.diagnostics': 'Поділіться діагностикою зі службою підтримки',
  'settings.data.consent.aiImprovement':
    'Використовуйте мій вміст для покращення помічника. Це вимкнено, якщо ви його не ввімкнете.',
  'settings.data.consent.marketingEmail': 'Новини про товар електронною поштою',
} as const;
