/** Workspace settings: members, roles, brands, localization, security, data. */
export const settingsMessages = {
  'settings.title': 'Настройки',
  'settings.saved': 'Сохранено',
  'settings.unsavedChanges': 'У вас есть несохраненные изменения.',

  'settings.workspace.title': 'Workspace',
  'settings.workspace.name': 'Workspace имя',
  'settings.workspace.defaultTimeZone': 'Часовой пояс по умолчанию',
  'settings.workspace.defaultLocale': 'Язык интерфейса по умолчанию',
  'settings.workspace.defaultContentLocale': 'Язык контента по умолчанию',
  'settings.workspace.transferOwnership': 'Передача права собственности',
  'settings.workspace.delete': 'Удалить рабочую область',
  'settings.workspace.deleteWarning':
    'Удаление рабочей области отменяет запланированные публикации, разрывает соединения и удаляет сохраненные медиафайлы. Квитанции хранятся в течение срока хранения, указанного в Условиях.',

  'settings.members.title': 'Участники и роли',
  'settings.members.invite': 'Пригласить людей',
  'settings.members.inviteEmail': 'Адрес электронной почты',
  'settings.members.inviteSent': 'Приглашение отправлено на адрес {email}.',
  'settings.members.pending': 'Приглашен, еще не принят',
  'settings.members.count':
    '{count, plural, one {# участников} few {# участников} many {# участников} other {# участников}}',
  'settings.members.removeConfirm':
    'Удалить {name} из этой рабочей области? Их прошлые действия остаются в журнале аудита.',
  'settings.role.owner.label': 'Владелец',
  'settings.role.admin.label': 'Админ',
  'settings.role.manager.label': 'Менеджер',
  'settings.role.editor.label': 'Редактор',
  'settings.role.approver.label': 'утверждающий',
  'settings.role.analyst.label': 'Аналитик',
  'settings.role.viewer.label': 'Зритель',
  'settings.role.owner.description': 'Все, включая выставление счетов, безопасность и удаление.',
  'settings.role.admin.description': 'Все, кроме выставления счетов и удаления рабочей области.',
  'settings.role.manager.description': 'Управляйте брендами, связями, расписаниями и правилами.',
  'settings.role.editor.description': 'Создавайте и редактируйте контент, запрашивайте одобрение.',
  'settings.role.approver.description': 'Утвердите или отклоните контент и запланируйте одобрение.',
  'settings.role.analyst.description': 'Читайте аналитику и чеки.',
  'settings.role.viewer.description': 'Только чтение.',
  'settings.role.scopeLabel': 'Ограничение по брендам и аккаунтам',
  'settings.role.mfaRequired': 'Владельцы должны использовать двухфакторную аутентификацию.',

  'settings.brands.title': 'Brands',
  'settings.brands.add': 'Добавить бренд',
  'settings.brands.voice': 'Голос',
  'settings.brands.audience': 'Аудитория',
  'settings.brands.approvedClaims': 'Одобренные претензии',
  'settings.brands.blockedTerms': 'Заблокированные термины',
  'settings.brands.disclosureDefaults': 'Настройки раскрытия информации по умолчанию',
  'settings.brands.domains': 'Домены',
  'settings.brands.glossary.title': 'Глоссарий',
  'settings.brands.glossary.term': 'Срок',
  'settings.brands.glossary.preferred': 'Предпочтительный перевод',
  'settings.brands.glossary.prohibited': 'Не переводите как',
  'settings.brands.glossary.context': 'Контекст',
  'settings.brands.glossary.keepUntranslated': 'Оставить без перевода',
  'settings.brands.localeRules.title': 'Правила локали',
  'settings.brands.localeRules.formality': 'Формальность',
  'settings.brands.localeRules.pronouns': 'Местоимения и почетные знаки',
  'settings.brands.localeRules.idioms': 'Идиомы, которых следует избегать',
  'settings.brands.localeRules.emoji': 'Нормы смайлов и хэштегов',
  'settings.brands.localeRules.legal': 'Региональная юридическая информация',
  'settings.brands.localeRules.cta': 'Призыв к действию по рынку',
  'settings.brands.localeRules.reviewedExamples': 'Примеры, одобренные местным рецензентом',

  'settings.sets.title': 'Наборы',
  'settings.sets.description':
    'Многоразовая группа целей, вариантов, настроек, комментариев и задержек. Применение набора создает независимый черновик.',
  'settings.sets.editNote':
    'Редактирование набора не меняет публикации, которые уже одобрены или запланированы.',
  'settings.signatures.title': 'Подписи',
  'settings.signatures.description':
    'Заключительный текст, хэштеги, ссылки или раскрытия информации в зависимости от бренда, платформы и языка.',
  'settings.signatures.autoApply': 'Добавлять автоматически при совпадении контекста',

  'settings.localization.title': 'Локализация',
  'settings.localization.interfaceLocale': 'Язык интерфейса',
  'settings.localization.interfaceLocaleHelp':
    'Язык этого приложения для вас. Это не меняет язык ваших сообщений.',
  'settings.localization.contentLocales': 'Языки контента',
  'settings.localization.contentLocalesHelp':
    'Языки, на которых вы публикуете. Каждый бренд может устанавливать правила и глоссарий для каждого языка.',
  'settings.localization.marketLocales': 'Рынки аудитории',
  'settings.localization.beta': 'Бета-перевод',
  'settings.localization.betaHelp':
    'Этот язык создан с помощью компьютера и еще не полностью проверен человеком. Непереведенный текст возвращается на английский язык.',
  'settings.localization.humanReviewed': 'Отзыв от носителя языка',
  'settings.localization.timeZone': 'Часовой пояс',
  'settings.localization.weekStart': 'Первый день недели',
  'settings.localization.hourCycle.label': 'Формат времени',
  'settings.localization.hourCycle.h12': '12 часов',
  'settings.localization.hourCycle.h23': '24 часа',

  'settings.notifications.title': 'Уведомления',
  'settings.notifications.email': 'электронная почта',
  'settings.notifications.inApp': 'В приложении',
  'settings.notifications.approvalRequests': 'Запросы на одобрение',
  'settings.notifications.publishResults': 'Опубликовать результаты',
  'settings.notifications.connectionHealth': 'Состояние соединения',
  'settings.notifications.ruleFailures': 'Сбои автоматизации',
  'settings.notifications.weeklySummary': 'Еженедельный обзор',
  'settings.notifications.digestOnly': 'Сгруппируйте их в одно ежедневное сообщение.',

  'settings.security.title': 'Безопасность',
  'settings.security.mfa': 'Двухфакторная аутентификация',
  'settings.security.mfaEnable': 'Включите двухфакторную аутентификацию',
  'settings.security.mfaRequiredFor':
    'Требуется для изменения счетов, сервисных учетных записей, повторного подключения учетной записи и отзыва учетных данных.',
  'settings.security.passkeys': 'Ключи доступа',
  'settings.security.sessions': 'Активные сессии',
  'settings.security.sessionRevoke': 'Выйти из этого сеанса',
  'settings.security.auditLog.title': 'Журнал аудита',
  'settings.security.auditLog.description':
    'Каждое действие, кто или что его совершил и когда. Экспортируется владельцами и администраторами.',
  'settings.security.killSwitch': 'Аварийная остановка',
  'settings.security.killSwitchBody':
    'Немедленно останавливает каждую запланированную публикацию и автоматизацию в этой рабочей области. Ничего не удаляется. Вы можете отключить его снова.',
  'settings.security.killSwitchActive':
    'Аварийная остановка включена. Ни один пост не будет опубликован.',

  'settings.data.title': 'Элементы управления данными',
  'settings.data.export': 'Экспортируйте свои данные',
  'settings.data.exportPreparing':
    'Подготовка экспорта. Мы сообщим вам по электронной почте, когда он будет готов.',
  'settings.data.deletionRequest': 'Запросить удаление',
  'settings.data.deletionExplain':
    'Удаление отменяет запланированные рабочие процессы, отзывает доступ провайдера, удаляет сохраненные медиафайлы и аналитику захоронения там, где этого требует провайдер.',
  'settings.data.retention': 'Удержание',
  'settings.data.consents': 'Согласия',
  'settings.data.consent.productAnalytics': 'Аналитика продукта',
  'settings.data.consent.diagnostics': 'Поделитесь диагностикой со службой поддержки',
  'settings.data.consent.aiImprovement':
    'Используйте мой контент для улучшения помощника. Это отключено, если вы не включите его.',
  'settings.data.consent.marketingEmail': 'Новости о продуктах по электронной почте',
} as const;
