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

  'settings.ui.subtitle':
    'Все, что настраивает это рабочее пространство. Здесь ничего не публикуется.',
  'settings.ui.nav.label': 'Разделы настроек',
  'settings.ui.index.help':
    'Выберите раздел. Каждое изменение приписывается вам и отображается в журнале аудита.',

  'settings.ui.section.members': 'Участники и роли',
  'settings.ui.section.membersSummary':
    'Кто находится в этом рабочем пространстве и что может делать каждый человек.',
  'settings.ui.section.projects': 'Проекты',
  'settings.ui.section.projectsSummary':
    'Голос, аудитория, одобренные заявки, заблокированные термины, региональные правила, домены и глоссарий.',
  'settings.ui.section.agents': 'Агенты и API',
  'settings.ui.section.agentsSummary':
    'Учетные записи служб, области действия, ограничения, учетные данные, активность и тестовая площадка.',
  'settings.ui.section.apps': 'Приложения для разработчиков',
  'settings.ui.section.appsSummary':
    'Сторонние приложения OAuth, списки разрешенных перенаправлений, согласие и разрешения.',
  'settings.ui.section.webhooks': 'Вебхуки',
  'settings.ui.section.webhooksSummary':
    'Подписанные исходящие события, журналы доставки, повторная доставка и секретная ротация.',
  'settings.ui.section.billing': 'Биллинг',
  'settings.ui.section.billingSummary':
    'План, пробная версия, интервал, дозированное использование поставщика, счета и отмена.',
  'settings.ui.section.referrals': 'Рефералы и партнерские отношения',
  'settings.ui.section.referralsSummary':
    'Ваша раскрытая реферальная ссылка, зарегистрированные регистрации и статус комиссии.',
  'settings.ui.section.localization': 'Локализация',
  'settings.ui.section.localizationSummary':
    'Язык интерфейса, языки контента, рынки, часовой пояс и формат времени.',
  'settings.ui.section.security': 'Безопасность',
  'settings.ui.section.securitySummary':
    'Сеансы, двухфакторная аутентификация, учетные данные, агенты, веб-перехватчики и разрешения приложений.',
  'settings.ui.section.data': 'Элементы управления данными',
  'settings.ui.section.dataSummary':
    'Экспортируйте, отмените соединение, удалите проект, удалите контент или закройте учетную запись.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Загрузка {section}',
  'settings.ui.state.errorTitle': 'Не удалось загрузить {section}.',
  'settings.ui.state.errorRetry': 'Попробуйте еще раз',
  'settings.ui.state.savingAnnouncement': 'Сохранение {section}',
  'settings.ui.state.savedAnnouncement': '{section} сохранено',
  'settings.ui.state.saveFailedAnnouncement': '{section} не сохранен. Ваш вклад все еще здесь.',
  'settings.ui.state.offlineTitle': 'Вы оффлайн',
  'settings.ui.state.offlineBody':
    'Вы можете прочитать эту страницу. Изменения не могут быть сохранены, пока соединение не восстановится.',
  'settings.ui.state.permissionTitle': 'У вас нет доступа к {section}.',
  'settings.ui.state.permissionBody':
    'В этом разделе изменяется поведение рабочей области, поэтому оно ограничено ролью.',
  'settings.ui.state.permissionRequirements': 'Что вам нужно',
  'settings.ui.state.permissionContact':
    'Предоставить его может владелец или администратор этой рабочей области. Они перечислены в разделе Участники и роли.',
  'settings.ui.state.rateLimitTitle': 'Слишком много изменений за короткое время',
  'settings.ui.state.rateLimitCause':
    'В этой рабочей области достигнут предел записи для изменений настроек.',
  'settings.ui.state.rateLimitReset': 'Сброс лимитов',
  'settings.ui.state.rateLimitAlternative':
    'Ничего из того, что вы сохранили, не потерялось. Действия только для чтения продолжают работать, пока вы ждете.',
  'settings.ui.state.rateLimitUsage': 'Настройки пишет этот час',
  'settings.ui.state.rateLimitUsageText': '{used} из {limit} использованный',
  'settings.ui.state.unsavedTitle': 'У вас есть несохраненные изменения',
  'settings.ui.state.unsavedBody': 'Сохраните их, прежде чем покинуть этот раздел.',
  'settings.ui.state.readOnlyTitle': 'Это рабочее пространство доступно только для чтения',
  'settings.ui.state.readOnlyBody':
    'Оплата просрочена. Ваш контент, квитанции и соединения нетронуты. Настройки можно прочитать, но нельзя изменить.',

  'settings.ui.state.referenceLabel': 'Справочная информация о поддержке',

  'settings.ui.attribution': 'Изменено {name} {relativeTime}',
  'settings.ui.attributionNever': 'Не менялся с момента создания',
  'settings.ui.copyFailed':
    'Ваш браузер заблокировал копию. Выделите текст и скопируйте его вручную.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'Каждое приглашение, смена и удаление роли записывается с указанием вашего имени и времени.',
  'settings.ui.members.tableCaption': 'Люди в этом рабочем пространстве с их ролью и объемом',
  'settings.ui.members.column.person': 'Человек',
  'settings.ui.members.column.role': 'Роль',
  'settings.ui.members.column.scope': 'Область применения',
  'settings.ui.members.column.approvals': 'Разрешения',
  'settings.ui.members.column.lastActive': 'Последний активный',
  'settings.ui.members.column.actions': 'Действия',
  'settings.ui.members.scopeAll': 'Все проекты и аккаунты',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {# проект} few {# проекта} many {# проектов} other {# проекта}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Могу одобрить',
  'settings.ui.members.approvals.cannotApprove': 'Невозможно одобрить',
  'settings.ui.members.approvals.canApproveOwnProjects': 'Может одобрить перечисленные проекты',
  'settings.ui.members.lastActiveNever': 'Еще не авторизовался',
  'settings.ui.members.changeRole': 'Изменить роль для {name}',
  'settings.ui.members.remove': 'Удалить {name}',
  'settings.ui.members.lastOwnerTitle': 'Рабочее пространство имеет как минимум одного владельца',
  'settings.ui.members.lastOwnerBody':
    'Сначала сделайте владельцем кого-нибудь другого, и тогда это изменение станет доступным.',
  'settings.ui.members.inviteTitle': 'Пригласить кого-нибудь в это рабочее пространство',
  'settings.ui.members.inviteBody':
    'Они получают электронное письмо со ссылкой. Срок действия приглашения истекает через семь дней, и вы можете отозвать его до этого момента.',
  'settings.ui.members.inviteRole': 'Роль',
  'settings.ui.members.inviteScope': 'Проекты, в которых они могут работать',
  'settings.ui.members.inviteScopeAll': 'Каждый проект в этом рабочем пространстве',
  'settings.ui.members.inviteScopeSelected': 'Только те проекты, которые я выбираю',
  'settings.ui.members.inviteApprovals': 'Может принимать решения по запросам на одобрение',
  'settings.ui.members.inviteApprovalsHelp':
    'Это можно сделать только для ролей, которые уже включают проверку. Это отдельно от редактирования.',
  'settings.ui.members.inviteSubmit': 'Отправить приглашение',
  'settings.ui.members.invitePending': 'Приглашен {relativeTime} от {name}',
  'settings.ui.members.inviteRevoke': 'Отозвать приглашение',
  'settings.ui.members.inviteResend': 'Отправить приглашение еще раз',
  'settings.ui.members.emptyTitle': 'Ты единственный человек здесь',
  'settings.ui.members.emptyBody':
    'Пригласите людей, которые пишут, одобряют или читают результаты. Каждый получает роль и область проекта.',
  'settings.ui.members.emptyExample':
    'Общая форма: один владелец для выставления счетов, один утверждающий от каждого проекта и редакторы, которые пишут, но никогда не публикуют.',
  'settings.ui.members.roleReferenceTitle': 'Что может каждая роль',
  'settings.ui.members.roleReferenceCaption': 'Роли и действия, которые позволяет каждая из них',
  'settings.ui.members.roleColumn.role': 'Роль',
  'settings.ui.members.roleColumn.can': 'Могу сделать',
  'settings.ui.members.roleColumn.cannot': 'Не могу сделать',
  'settings.ui.members.roleCannot.owner': 'От владельца ничего не утаивается.',
  'settings.ui.members.roleCannot.admin': 'Измените платежные данные или удалите рабочую область.',
  'settings.ui.members.roleCannot.manager':
    'Измените биллинг, роли или удалите рабочее пространство.',
  'settings.ui.members.roleCannot.editor':
    'Утверждайте, планируйте, публикуйте или изменяйте соединения.',
  'settings.ui.members.roleCannot.approver': 'Изменить подключения, правила или биллинг.',
  'settings.ui.members.roleCannot.analyst':
    'Создавайте, редактируйте, одобряйте или публикуйте что угодно.',
  'settings.ui.members.roleCannot.viewer': 'Меняйте вообще что-нибудь.',
  'settings.ui.members.removeTitle': 'Удалите {name} из этой рабочей области.',
  'settings.ui.members.removeConsequence.access': 'Они теряют доступ сразу, на любой поверхности.',
  'settings.ui.members.removeConsequence.drafts':
    'Написанные ими черновики остаются в рабочей области и доступны для редактирования.',
  'settings.ui.members.removeConsequence.audit':
    'Их прошлые действия сохраняются в журнале аудита и в квитанциях.',
  'settings.ui.members.removeConsequence.approvals':
    'Ожидающие их утверждения возвращаются в очередь для другого утверждающего.',

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'В проекте действуют правила, по которым проверяется контент: о чем вы можете заявлять, о чем нельзя говорить и как пишется каждый язык.',
  'settings.ui.projects.listCaption': 'Проекты в этой рабочей области',
  'settings.ui.projects.column.project': 'Проект',
  'settings.ui.projects.column.locales': 'Языки контента',
  'settings.ui.projects.column.accounts': 'Счета',
  'settings.ui.projects.column.updated': 'Обновлено',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Нет аккаунтов} one {# аккаунта} few {# аккаунтов} many {# аккаунтов} other {# аккаунтов}}',
  'settings.ui.projects.emptyTitle': 'Проектов пока нет',
  'settings.ui.projects.emptyBody':
    'Проект группирует учетные записи, правила одобрения и языковые правила. Большинство команд начинают с одного и добавляют второй, когда клиенту или рынку нужны другие правила.',
  'settings.ui.projects.emptyExample':
    'Пример: проект «Acme EU», языки: английский и немецкий, заблокирован термин «гарантировано», раскрытие «Платное партнерство» для Instagram.',
  'settings.ui.projects.voiceHelp':
    'Как звучит этот проект. Используется, когда вы запрашиваете переписывание и когда проверяются претензии.',
  'settings.ui.projects.audienceHelp': 'Для кого предназначен контент в зависимости от рынка.',
  'settings.ui.projects.approvedClaimsHelp':
    'Заявления, одобренные рецензентом. Все, что находится за пределами этого списка, помечается до утверждения, а не после публикации.',
  'settings.ui.projects.blockedTermsHelp':
    'Слова, которые блокируют планирование для этого проекта. По одному на строку.',
  'settings.ui.projects.domainsHelp':
    'Домены, на которые этот проект может ссылаться и сокращать их. В композиторе можно выбрать только проверенные домены.',
  'settings.ui.projects.domainVerified': 'Проверено {date}',
  'settings.ui.projects.domainPending': 'DNS-запись еще не видна',
  'settings.ui.projects.domainVerificationUnavailable': 'Проверка пока не реализована',
  'settings.ui.projects.disclosureUnavailable':
    'Настройки раскрытия информации по каналам пока не реализованы. Добавляйте необходимое раскрытие прямо в публикации, пока эта функция не появится.',
  'settings.ui.projects.glossaryUnavailable':
    'Глоссарий рабочего пространства пока не реализован. Тон, аудитория, одобренные утверждения и запрещённые слова выше сохраняются и применяются.',
  'settings.ui.projects.localeRulesUnavailable':
    'Правила написания по языкам пока не реализованы. Языки и рынки рабочего пространства остаются доступными в разделе «Локализация».',
  'settings.ui.projects.disclosureHelp':
    'Применяется по умолчанию в композиторе для выбранных вами здесь платформ. Его можно изменить для каждого сообщения до утверждения.',
  'settings.ui.projects.glossaryHelp':
    'Названия продуктов, юридические термины и все, что должно сохраниться при переводе, без изменений.',
  'settings.ui.projects.glossaryCaption':
    'Защищенные термины и способы обработки каждого из них в зависимости от языка',
  'settings.ui.projects.glossaryEmpty':
    'Защищенных условий пока нет. Добавьте названия продуктов и юридические термины, которые нельзя переводить или перефразировать.',
  'settings.ui.projects.localeRulesHelp':
    'Правила для каждого языка контента. Они применяются, когда вы адаптируете или транскреируете, и показываются рецензенту.',
  'settings.ui.projects.saveProject': 'Сохранить проект',
  'settings.ui.projects.capacityTitle': 'Вместимость проектов',
  'settings.ui.projects.capacityHelp':
    'Базовый план за $29 включает 3 активных проекта. Рабочее пространство может получить право на до 20 проектов без создания другого аккаунта.',
  'settings.ui.projects.capacitySummary': '{used} из {limit}',
  'settings.ui.projects.atLimitTitle': 'Это рабочее пространство использовало все слоты проектов',
  'settings.ui.projects.atLimitBody':
    'Заархивируйте неактивный проект или измените лимит рабочего пространства, прежде чем добавлять ещё один. Текущий лимит: {limit}.',
  'settings.ui.projects.listLabel': 'Выберите проект для редактирования',
  'settings.ui.projects.detailsTitle': 'Сведения о проекте',
  'settings.ui.projects.projectMeta':
    '{accounts, plural, =0 {Нет каналов} one {# канал} few {# канала} many {# каналов} other {# канала}} · Обновлено {updated}',
  'settings.ui.projects.archiveAction': 'Архивировать проект',
  'settings.ui.projects.archiveTitle': 'Архивировать {project}?',
  'settings.ui.projects.archiveBody':
    'Этот неактивный проект покидает активное рабочее пространство и освобождает один слот проекта.',
  'settings.ui.projects.archiveChannels':
    'Его подключённые каналы перестают появляться в потоках активных проектов.',
  'settings.ui.projects.archiveHistory':
    'Черновики, опубликованные посты, квитанции и история аудита сохраняются.',
  'settings.ui.projects.archiveLastDisabled':
    'Оставьте хотя бы один активный проект в рабочем пространстве.',
  'settings.ui.projects.archiveConnectedDisabled':
    'Отключите каналы этого проекта перед архивированием.',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'Три отдельные настройки: язык этого приложения, языки, на которых вы публикуете, и рынки, для которых вы пишете. Изменение одного никогда не меняет другого.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Выберите язык интерфейса для этого приложения. Языки контента являются отдельными и уже доступны.',
  'settings.ui.localization.marketHelp':
    'Рынок меняет примеры, правовую информацию и призывы к действию. Это не меняет язык сообщения.',
  'settings.ui.localization.previewTitle': 'Как будут читаться даты и числа',
  'settings.ui.localization.previewDate': 'Дата',
  'settings.ui.localization.previewTime': 'Время',
  'settings.ui.localization.previewNumber': 'Номер',
  'settings.ui.localization.previewCurrency': 'Валюта',
  'settings.ui.localization.weekStartHelp': 'Используется в представлении календарной недели.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'Все, что может действовать в этом рабочем пространстве, в одном месте: ваши сеансы, учетные данные, агенты, веб-перехватчики и приложения, к которым вы предоставили доступ.',
  'settings.ui.security.sessionsCaption': 'Зарегистрированные сеансы для вашей учетной записи',
  'settings.ui.security.sessionColumn.device': 'Устройство и браузер',
  'settings.ui.security.sessionColumn.location': 'Примерное местоположение',
  'settings.ui.security.sessionColumn.lastSeen': 'Последнее использование',
  'settings.ui.security.sessionCurrent': 'Эта сессия',
  'settings.ui.security.sessionRevokeAll': 'Выходить из каждого второго сеанса',
  'settings.ui.security.sessionLocationUnknown': 'Местоположение не записано',
  'settings.ui.security.mfaOn': 'Двухфакторная аутентификация включена',
  'settings.ui.security.mfaOff': 'Двухфакторная аутентификация отключена',
  'settings.ui.security.mfaBody':
    'Второй фактор необходим перед изменением выставления счетов, созданием сервисной учетной записи, повторным подключением учетной записи и отзывом учетных данных.',
  'settings.ui.security.credentialsTitle': 'Ключи API',
  'settings.ui.security.credentialsBody':
    'Ключи, принадлежащие этой рабочей области. Они отделены от грантов приложений и вашего собственного сеанса.',
  'settings.ui.security.agentsTitle': 'Сервисные аккаунты',
  'settings.ui.security.webhooksTitle': 'Конечные точки вебхука',
  'settings.ui.security.grantsTitle': 'Приложения, которые вы разрешили',
  'settings.ui.security.grantsBody':
    'Отзыв приложения немедленно останавливает его токены. Ваши собственные связи и запланированные публикации не будут затронуты.',
  'settings.ui.security.grantScopes': 'Предоставленные разрешения',
  'settings.ui.security.socialPermissionsTitle': 'Разрешения для учетной записи в социальных сетях',
  'settings.ui.security.socialPermissionsBody':
    'Что каждая подключенная учетная запись позволила сделать Post Array, судя по снимку возможностей, сделанному во время подключения.',
  'settings.ui.security.viewInSection': 'Управление в {section}',
  'settings.ui.security.emptySessions': 'Вход осуществляется только в этом сеансе.',
  'settings.ui.security.emptyGrants':
    'Ни одно стороннее приложение не имеет доступа к этой рабочей области. Приложения появляются здесь после того, как вы разрешаете их использование на экране согласия.',
  'settings.ui.security.revokeGrantTitle': 'Отменить доступ для {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Его токены доступа и обновления немедленно перестают работать.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Публикации, которые уже запланированы, остаются запланированными. Отмените их отдельно, если хотите, чтобы они были остановлены.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'Приложение может снова запросить доступ, и вы можете отказаться.',

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'Удалите свои данные, удалите что-то одно или закройте учетную запись. Каждое разрушительное действие называет именно то, чего оно касается в первую очередь.',
  'settings.ui.data.exportTitle': 'Экспорт',
  'settings.ui.data.exportBody':
    'Портативный архив контента, расписаний, квитанций, событий аналитики и аудита, а также загруженных вами медиафайлов.',
  'settings.ui.data.exportJson': 'Структурированный JSON',
  'settings.ui.data.exportCsv': 'Таблица CSV',
  'settings.ui.data.exportMedia': 'Медиа-архив',
  'settings.ui.data.exportJsonHelp':
    'Один файл для каждого типа записи. Документировано и стабильно во всех версиях.',
  'settings.ui.data.exportCsvHelp':
    'Публикации, квитанции и показатели в виде плоских таблиц для электронной таблицы.',
  'settings.ui.data.exportMediaHelp':
    'Исходные файлы, которые вы загрузили или импортировали, с контрольными суммами.',
  'settings.ui.data.exportStart': 'Подготовить экспорт',
  'settings.ui.data.exportRunning':
    'Подготовка экспорта. Он продолжит работать, если вы закроете эту страницу.',
  'settings.ui.data.exportReady': 'Экспорт готов, подготовлен {date}',
  'settings.ui.data.exportDownload': 'Скачать экспорт',
  'settings.ui.data.exportExpires': 'Срок действия ссылки для скачивания истекает {date}.',
  'settings.ui.data.deleteTitle': 'Удалить',
  'settings.ui.data.deleteBody':
    'Выберите самую маленькую вещь, которая решит вашу проблему. В каждом варианте ниже указано, что выживет.',
  'settings.ui.data.deleteConnection': 'Отмените одну социальную связь',
  'settings.ui.data.deleteConnectionHelp':
    'Удаляет доступ Post Array к этой учетной записи. Рабочая область, ее содержимое и квитанции остаются.',
  'settings.ui.data.deleteProject': 'Архивировать проект',
  'settings.ui.data.deleteProjectHelp':
    'Удаляет проект, его правила и глоссарий. Контент, опубликованный под ним, сохраняет свои квитанции.',
  'settings.ui.data.deleteContent': 'Удаление контента и мультимедиа',
  'settings.ui.data.deleteContentHelp':
    'Удаляет черновики и сохраненные файлы. Он не удаляет ничего, уже опубликованное на платформе.',
  'settings.ui.data.deleteAccount': 'Закрыть это рабочее пространство',
  'settings.ui.data.deleteAccountHelp':
    'Отменяет запланированные задания, отменяет каждое соединение, удаляет сохраненные носители и закрывает рабочую область.',
  'settings.ui.data.scheduledJobsTitle':
    'Запланированные работы, которые будут отменены в первую очередь',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {Сейчас ничего не запланировано} one {# запланированное сообщение} few {# запланированное сообщение} many {# запланированное сообщение} other {# запланированное сообщение}}',
  'settings.ui.data.cancelJobsFirst': 'Отменить запланированные публикации сейчас',
  'settings.ui.data.cancelJobsDone':
    'Запланированные публикации отменены. Ничего не будет публиковаться.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'Введите имя рабочей области для подтверждения.',
  'settings.ui.data.deleteConsequence.jobs':
    'Каждая запланированная публикация отменяется до того, как что-либо будет удалено.',
  'settings.ui.data.deleteConsequence.connections':
    'У провайдера аннулируются все социальные связи.',
  'settings.ui.data.deleteConsequence.media':
    'Сохраненные носители удалены и не подлежат восстановлению.',
  'settings.ui.data.deleteConsequence.receipts':
    'Квитанции о публикации хранятся в течение срока хранения, указанного в Условиях, а затем удаляются.',
  'settings.ui.data.deleteConsequence.published':
    'Сообщения, уже размещенные на платформе, не удаляются. Уберите тех, кто находится на платформе.',
  'settings.ui.data.exportFirst': 'Экспортируйте свои данные, прежде чем удалять их.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'Поделитесь Post Array с раскрытой ссылкой. Комиссия никогда не ставит условием положительного отзыва.',
  'settings.ui.referral.linkLabel': 'Ваша реферальная ссылка',
  'settings.ui.referral.tableCaption': 'Приписанные регистрации и состояние их комиссии',
  'settings.ui.referral.column.signup': 'Регистрация',
  'settings.ui.referral.column.date': 'Дата',
  'settings.ui.referral.column.state': 'Комиссия',
  'settings.ui.referral.column.amount': 'Сумма',
  'settings.ui.referral.emptyTitle': 'Связанных подписок пока нет',
  'settings.ui.referral.emptyBody':
    'Регистрации появляются здесь, когда кто-то начинает пробную версию по вашей ссылке. Суммы остаются в ожидании до закрытия окна возврата.',
  'settings.ui.referral.emptyExample':
    'Пример строки: acme.example, пробная версия запущена 12 июня, ожидается до 12 июля, затем одобрена.',
  'settings.ui.referral.termsLink': 'Ознакомьтесь с условиями партнерства',
  'settings.ui.referral.balance': 'Утвержденная комиссия',
  'settings.ui.referral.balanceUnavailableReason':
    'Комиссионный журнал за этот период еще не сверен.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'Учетная запись службы, это именованное удостоверение для агента, сценария или рабочего процесса. Он имеет свои собственные области применения, свои ограничения и свой собственный контрольный журнал.',
  'developer.ui.agents.emptyTitle': 'Сервисных аккаунтов пока нет',
  'developer.ui.agents.emptyBody':
    'Создайте его для каждой запускаемой вами автоматизации. Отдельные учетные записи означают, что вы можете отозвать одну, не останавливая другие.',
  'developer.ui.agents.emptyExample':
    'Пример: «Контент-агент», проект Acme EU, может создавать и планировать до 6 публикаций в день с 07:00 до 22:00, но никогда не публикует немедленно.',
  'developer.ui.agents.step.identity': 'Название и цель',
  'developer.ui.agents.step.scope': 'Чего он может достичь',
  'developer.ui.agents.step.limits': 'Пределы',
  'developer.ui.agents.purpose': 'Для чего нужен этот аккаунт',
  'developer.ui.agents.purposeHelp':
    'Одно предложение. Он отображается рядом с каждым действием, выполняемым этой учетной записью, в журнале аудита.',
  'developer.ui.agents.scopeHelp':
    'Область действия предоставляет именно себя. Ничто здесь не подразумевает ничего другого.',
  'developer.ui.agents.limitsHelp':
    'Ограничения применяются API, а не агентом. Агент не может повысить свой собственный лимит.',
  'developer.ui.agents.quietHours': 'Тихие часы',
  'developer.ui.agents.quietHoursHelp':
    'Учетная запись не может планировать или публиковать публикации в эти часы в часовом поясе рабочей области.',
  'developer.ui.agents.lookAheadHelp': 'Как далеко в будущем он может разместить сообщение.',
  'developer.ui.agents.cadenceHelp': 'Максимум внешних публикаций это может вызвать за один день.',
  'developer.ui.agents.expiry': 'Срок действия учетных данных истек',
  'developer.ui.agents.expiryHelp': 'Короткая жизнь безопаснее. Вы можете вращаться в любое время.',
  'developer.ui.agents.summaryTitle': 'Прежде чем создать его',
  'developer.ui.agents.summaryAccounts': 'Аккаунты, на которые он может попасть',
  'developer.ui.agents.summaryMaxActions':
    'Не более {count, plural, one {# внешних публикаций} few {# внешних публикаций} many {# внешних публикаций} other {# внешних публикаций}} в день.',
  'developer.ui.agents.summaryApproval': 'Поведение при одобрении',
  'developer.ui.agents.summaryCreate': 'Создать учетную запись службы',
  'developer.ui.agents.detailTitle': 'Сервисный аккаунт',
  'developer.ui.agents.statusActive': 'Активный',
  'developer.ui.agents.statusStopped': 'Остановлено',
  'developer.ui.agents.statusExpired': 'Срок действия учетных данных истек',
  'developer.ui.agents.stoppedBody':
    'Этот аккаунт остановлен. Каждый вызов, который он делает, отклоняется по понятной причине. Ничего из созданного им не было удалено.',
  'developer.ui.agents.killTitle': 'Остановить {name}',
  'developer.ui.agents.killConsequence.calls':
    'Каждый вызов API, MCP и CLI из этой учетной записи сразу отклоняется.',
  'developer.ui.agents.killConsequence.scheduled':
    'Публикации, которые уже запланированы, остаются запланированными. Отмените их из календаря, если хотите, чтобы они были остановлены.',
  'developer.ui.agents.killConsequence.reversible': 'Вы можете начать его снова позже.',
  'developer.ui.agents.resume': 'Запустите этот агент еще раз',
  'developer.ui.agents.rotate': 'Поворот учетных данных',
  'developer.ui.agents.rotateTitle': 'Поменяйте учетные данные для {name}.',
  'developer.ui.agents.rotateConsequence.old':
    'Текущие учетные данные немедленно перестают работать.',
  'developer.ui.agents.rotateConsequence.new': 'Новый отображается один раз на этой странице.',
  'developer.ui.agents.rotateConsequence.clients':
    'Все, что использует старое значение, терпит неудачу, пока вы его не обновите.',
  'developer.ui.agents.credentialStored': 'Я сохранил эти учетные данные',
  'developer.ui.agents.credentialLabel': 'Учетные данные сервисного аккаунта',
  'developer.ui.agents.credentialWarning':
    'Это единственный раз, когда эти учетные данные отображаются.',
  'developer.ui.agents.credentialWarningBody':
    'Скопируйте его в свой секретный магазин прямо сейчас. Мы храним только хэш, поэтому не можем показать его снова. Вращение создает новый.',
  'developer.ui.agents.credentialConsumed':
    'Учетные данные больше не отображаются. Поверните его, если вы его не сохранили.',
  'developer.ui.agents.credentialReveal': 'Показать учетные данные',
  'developer.ui.agents.credentialHide': 'Скрыть учетные данные',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read':
    'Посмотрите свои подключенные учетные записи и возможности каждой из них.',
  'developer.ui.scope.accounts_write':
    'Переименуйте учетные записи и измените способ их группировки.',
  'developer.ui.scope.drafts_read': 'Прочтите свои черновики и их варианты',
  'developer.ui.scope.drafts_write': 'Создание и редактирование черновиков',
  'developer.ui.scope.posts_schedule': 'Запланируйте одобренный контент для своих учетных записей',
  'developer.ui.scope.posts_publish': 'Опубликуйте в своих аккаунтах немедленно',
  'developer.ui.scope.posts_cancel': 'Отменить запланированные публикации',
  'developer.ui.scope.analytics_read': 'Читайте аналитику для своих аккаунтов',
  'developer.ui.scope.media_read': 'Просматривайте файлы в вашей библиотеке',
  'developer.ui.scope.media_write': 'Загружайте и редактируйте файлы в своей библиотеке',
  'developer.ui.scope.rules_read': 'Прочтите правила автоматизации',
  'developer.ui.scope.rules_write':
    'Создавайте и изменяйте правила автоматизации, которые можно публиковать.',
  'developer.ui.scope.growth_read': 'Прочитайте свои планы роста',
  'developer.ui.scope.growth_write': 'Создавайте и редактируйте планы роста',
  'developer.ui.scope.webhooks_manage': 'Создание и изменение конечных точек веб-перехватчика',
  'developer.ui.scope.billing_read':
    'Прочтите свой план, состояние пробной версии и использование.',
  'developer.ui.scope.connections_admin': 'Подключайте и отключайте социальные аккаунты',

  'developer.ui.activity.caption':
    'Недавние вызовы инструментов, а также те, которые были отклонены',
  'developer.ui.activity.column.time': 'Время',
  'developer.ui.activity.column.tool': 'Инструмент или маршрут',
  'developer.ui.activity.column.outcome': 'Результат',
  'developer.ui.activity.column.subject': 'Тема',
  'developer.ui.activity.outcome.ok': 'Разрешено',
  'developer.ui.activity.outcome.denied': 'Отказано',
  'developer.ui.activity.outcome.failed': 'Не удалось',
  'developer.ui.activity.filterDenied': 'Показывать только отклоненные попытки',
  'developer.ui.activity.deniedExplain':
    'Отклоненная попытка, это то, как проявляет себя неправильно настроенный агент. Эти строки сохраняются, а не скрываются.',
  'developer.ui.activity.emptyTitle': 'Звонки пока не записаны',
  'developer.ui.activity.emptyBody':
    'Вызовы появляются здесь в течение нескольких секунд после совершения, включая те, в которых было отказано.',
  'developer.ui.activity.emptyExample':
    'Пример строки: 12:03, Draft_post, Разрешено, черновик для аккаунта X @acme.',

  'developer.ui.setup.help':
    'Вставьте это в клиент, к которому вы подключаетесь. Замените заполнитель учетных данных сохраненным значением.',
  'developer.ui.setup.credentialPlaceholder':
    'В фрагменте используется заполнитель. Никогда не помещайте настоящие учетные данные в репозиторий.',
  'developer.ui.setup.copySnippet': 'Скопировать фрагмент для {client}',
  'developer.ui.setup.snippetCopied': 'Фрагмент скопирован.',
  'developer.ui.setup.tabLabel': 'Фрагменты настройки клиента',

  'developer.ui.playground.help':
    'Вызовы выполняются в отношении заполненной копии этой рабочей области. Ни с одним поставщиком не связываются, и ничего не запланировано.',
  'developer.ui.playground.tool': 'Инструмент',
  'developer.ui.playground.arguments': 'Аргументы',
  'developer.ui.playground.argumentsHelp':
    'JSON. То же самое тело, которое принимает настоящий API.',
  'developer.ui.playground.result': 'Результат',
  'developer.ui.playground.resultEmpty':
    'Запустите инструмент, чтобы увидеть ответ, который он вернет.',
  'developer.ui.playground.invalidJson':
    'Это еще недействительный JSON, поэтому его нельзя отправить.',
  'developer.ui.playground.deniedByApproval':
    'Уровень утверждения {level} не разрешает этот вызов. Пробный прогон отклоняет его точно так же, как это сделал бы API.',
  'developer.ui.playground.announceResult': 'Пробный прогон закончен. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'Зарегистрируйте приложение, чтобы другие люди могли предоставить ему доступ к своей рабочей области. Каждое приложение имеет свою собственную идентификацию, собственный список разрешенных перенаправлений и собственный контрольный журнал.',
  'developer.ui.apps.emptyTitle': 'Приложения не зарегистрированы',
  'developer.ui.apps.emptyBody':
    'Зарегистрируйте приложение, когда другому продукту необходимо действовать от имени пользователя Post Array. Для собственной автоматизации используйте вместо этого сервисную учетную запись.',
  'developer.ui.apps.emptyExample':
    'Пример: «Acme Publisher», конфиденциальный клиент, перенаправление https://acme.example/oauth/callback, области действия учетные записи: чтение и черновики: запись.',
  'developer.ui.apps.typeHelp':
    'Конфиденциальный клиент работает на сервере, которым вы управляете, и может хранить секрет. Публичный клиент, это браузер или настольное приложение, использующий PKCE без секрета.',
  'developer.ui.apps.redirectAdd': 'Добавьте URI перенаправления',
  'developer.ui.apps.redirectRemove': 'Удалить {uri}',
  'developer.ui.apps.redirectInvalid':
    'Введите полный URI https без подстановочных знаков и строки запроса. Оно должно точно соответствовать значению, которое отправляет ваше приложение.',
  'developer.ui.apps.linksTitle': 'Опубликованные ссылки',
  'developer.ui.apps.linksHelp':
    'Они появляются на экране согласия. Пользователь, который не может связаться с ними, не предоставит доступ.',
  'developer.ui.apps.linkUnreachable':
    'Нам не удалось получить доступ к этому URL-адресу при последней проверке: {date}.',
  'developer.ui.apps.linkReachable': 'Доступен, проверен {date}',
  'developer.ui.apps.scopesTitle': 'Разрешения, которые может запрашивать это приложение',
  'developer.ui.apps.scopesHelp':
    'Просите минимум того, что вам нужно. Пользователь видит разрешения на чтение и последующие разрешения как две отдельные группы.',
  'developer.ui.apps.scopeGroup.read': 'Разрешения на чтение',
  'developer.ui.apps.scopeGroup.reversible': 'Изменения, которые можно отменить',
  'developer.ui.apps.scopeGroup.consequential': 'Последующие разрешения',
  'developer.ui.apps.scopeGroupHelp.read':
    'Это позволяет приложению просматривать данные. Ничего не меняется.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Это позволяет приложению создавать или редактировать элементы внутри Post Array. Ничто не достигает платформы.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Это может привести к публикации сообщения в реальной учетной записи или изменению круга лиц, имеющих доступ к вашим учетным записям. Они всегда перечислены отдельно и никогда не объединяются в пакеты.',
  'developer.ui.apps.noBundling':
    'Объединенной области доступа не существует. Администрирование биллинга и подключения всегда запрашивается по имени.',
  'developer.ui.apps.secretTitle': 'Секрет клиента',
  'developer.ui.apps.secretWarning': 'Это единственный раз, когда отображается секрет клиента.',
  'developer.ui.apps.secretWarningBody':
    'Сохраните его в секретном менеджере на стороне сервера. Мы храним только хэш. Если вы потеряете его, поверните его: нет возможности открыть его снова.',
  'developer.ui.apps.secretConsumed':
    'Секрет больше не отображается. Поверните его, если вы его не сохранили.',
  'developer.ui.apps.secretStored': 'Я сохранил этот секрет',
  'developer.ui.apps.secretPublicClient':
    'У публичного заказчика нет секрета. Он использует поток кода авторизации с PKCE.',
  'developer.ui.apps.rotateTitle': 'Поменяйте секрет клиента для {app}',
  'developer.ui.apps.rotateConsequence.old': 'Текущий секрет немедленно перестает работать.',
  'developer.ui.apps.rotateConsequence.grants':
    'Существующие пользовательские разрешения не отменяются.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Ваши серверы не смогут обновить токены, пока вы не развернете новое значение.',
  'developer.ui.apps.consentPreviewTitle': 'Предварительный просмотр экрана согласия',
  'developer.ui.apps.consentPreviewHelp':
    'Это то, что видит пользователь. Он генерируется на основе записи приложения, поэтому не может обещать больше, чем запрашивает приложение.',
  'developer.ui.apps.consentPreviewSample':
    'Только предварительный просмотр. Ничего не предоставляется и токен не выдается.',
  'developer.ui.apps.grantsCaption': 'Workspace, предоставившие доступ этому приложению.',
  'developer.ui.apps.grantColumn.workspace': 'Workspace',
  'developer.ui.apps.grantColumn.scopes': 'Области применения',
  'developer.ui.apps.grantColumn.granted': 'Предоставлено',
  'developer.ui.apps.grantColumn.lastUsed': 'Последнее использование',
  'developer.ui.apps.grantsEmpty': 'Никто еще не предоставил доступ этому приложению.',
  'developer.ui.apps.logsCaption': 'Недавние запросы с удаленными секретами и полезными данными.',
  'developer.ui.apps.logColumn.time': 'Время',
  'developer.ui.apps.logColumn.route': 'Маршрут',
  'developer.ui.apps.logColumn.status': 'Статус',
  'developer.ui.apps.logColumn.workspace': 'Workspace',
  'developer.ui.apps.logsRedacted':
    'Тела запросов и ответов сохраняются с удаленными учетными данными, токенами и пользовательским контентом.',
  'developer.ui.apps.sandboxTitle': 'Учетные данные песочницы',
  'developer.ui.apps.sandboxBody':
    'Отдельный идентификатор клиента и рабочая область с заполненными данными. Звонки, сделанные с его помощью, никогда не доходят до провайдера.',
  'developer.ui.apps.rateLimitLabel': 'Ограничение скорости',
  'developer.ui.apps.rateLimitUsage': '{used} из {limit} запрашивает этот час',
  'developer.ui.apps.disable': 'Отключить приложение',
  'developer.ui.apps.enable': 'Включить приложение',
  'developer.ui.apps.disabledBody':
    'Это приложение отключено. Существующие токены отклоняются, и новый грант не может быть запущен. Гранты сохраняются, поэтому вы можете включить их снова.',
  'developer.ui.apps.deleteTitle': 'Удалить {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Каждый грант отменяется, и каждый токен перестает работать.',
  'developer.ui.apps.deleteConsequence.logs':
    'Журналы запросов хранятся в течение периода хранения аудита.',
  'developer.ui.apps.deleteConsequence.irreversible':
    'Идентификатор клиента не может быть использован повторно.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Подписанные доставки HTTPS для выбранных вами событий. Каждая доставка регистрируется вместе с ответом, и любая доставка может быть отправлена ​​повторно.',
  'developer.ui.webhooks.emptyTitle': 'Конечных точек пока нет',
  'developer.ui.webhooks.emptyBody':
    'Добавьте конечную точку, чтобы получать результаты публикации, решения об утверждении и состояние соединения в ваших собственных системах.',
  'developer.ui.webhooks.emptyExample':
    'Пример: https://hooks.acme.example/relay, подписка на post.published, post.failed и Connection.action_required.',
  'developer.ui.webhooks.create': 'Добавить конечную точку',
  'developer.ui.webhooks.url': 'URL-адрес конечной точки',
  'developer.ui.webhooks.urlHelp':
    'Только HTTPS. Мы не следуем перенаправлениям и не повторяем попытку 2xx.',
  'developer.ui.webhooks.eventsTitle': 'События',
  'developer.ui.webhooks.eventsHelp':
    'Выберите события, которые вы обрабатываете. Отправка всего на конечную точку, которая игнорирует большую часть этого, затрудняет обнаружение сбоев.',
  'developer.ui.webhooks.eventsAll': 'Каждое событие',
  'developer.ui.webhooks.eventsSelected': 'Только те события, которые я выбираю',
  'developer.ui.webhooks.eventsCount':
    '{count, plural, one {# событие} few {# событий} many {# событий} other {# событий}}',
  'developer.ui.webhooks.eventGroup.connections': 'Соединения',
  'developer.ui.webhooks.eventGroup.content': 'Содержание и одобрение',
  'developer.ui.webhooks.eventGroup.publishing': 'Публикация',
  'developer.ui.webhooks.eventGroup.automation': 'Автоматизация и корма',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'Проекты и аккаунты',
  'developer.ui.webhooks.scopeAll': 'Каждый проект и аккаунт',
  'developer.ui.webhooks.scopeSelected': 'Только те, которые я выбираю',
  'developer.ui.webhooks.secretTitle': 'Секрет подписания',
  'developer.ui.webhooks.secretBody':
    'Проверьте заголовок подписи, прежде чем анализировать тело. Дедупликация идентификатора доставки, который стабилен при повторных попытках.',
  'developer.ui.webhooks.secretRotateTitle': 'Поворот секрета подписи',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Оба секрета принимаются в течение 24 часов, поэтому вы можете развернуть их, не отказываясь от доставки.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'После этого окна используется только новый секрет.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Отправляет одно подписанное событие-пример, помеченное как тестовое, чтобы получатель мог его безопасно игнорировать.',
  'developer.ui.webhooks.testDeliverySent':
    'Тестовая посылка отправлена. Результат появится в журнале ниже.',
  'developer.ui.webhooks.deliveriesCaption':
    'Последние поставки и ответы, полученные каждым из них',
  'developer.ui.webhooks.deliveryColumn.time': 'Запрошено',
  'developer.ui.webhooks.deliveryColumn.event': 'Событие',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Попытка',
  'developer.ui.webhooks.deliveryColumn.response': 'Ответ',
  'developer.ui.webhooks.deliveryColumn.status': 'Статус',
  'developer.ui.webhooks.deliveryStatus.pending': 'Ожидание',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Доставлено',
  'developer.ui.webhooks.deliveryStatus.failed': 'Не удалось, повторю попытку',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Не удалось, повторных попыток больше нет',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Не отправлено, конечная точка отключена',
  'developer.ui.webhooks.deliveryNoResponse': 'Ответ не получен',
  'developer.ui.webhooks.deliveryNextAttempt': 'Следующая попытка {relativeTime}',
  'developer.ui.webhooks.inspect': 'Проверить доставку',
  'developer.ui.webhooks.inspectTitle': 'Доставка {id}',
  'developer.ui.webhooks.inspectRequest': 'Тело запроса',
  'developer.ui.webhooks.inspectResponse': 'Тело ответа',
  'developer.ui.webhooks.redeliver': 'Отправить эту доставку еще раз',
  'developer.ui.webhooks.redeliverHelp':
    'Тот же идентификатор события отправляется снова с установленным флагом повторной доставки, поэтому идемпотентный получатель безопасно игнорирует его.',
  'developer.ui.webhooks.redelivered': 'В очереди на повторную доставку.',
  'developer.ui.webhooks.failureTitle': 'Эта конечная точка не работает',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# доставка подряд не удалась} few {# доставка подряд не удалась} many {# доставка подряд не удалась} other {# доставка подряд не удалась}}. После последовательных сбоев {limit} конечная точка отключается и создается элемент действия.',
  'developer.ui.webhooks.disabledTitle':
    'Эта конечная точка была отключена после неоднократных сбоев.',
  'developer.ui.webhooks.disabledBody':
    'Мы прекратили отправку на него, чтобы ваша очередь не заполнялась. Исправьте получателя, отправьте тестовую доставку, а затем включите его снова.',
  'developer.ui.webhooks.lastSuccessLabel': 'Последний успех',
  'developer.ui.webhooks.lastSuccessNever': 'Ни одна доставка никогда не увенчалась успехом',
  'developer.ui.webhooks.deleteTitle': 'Удалить эту конечную точку',
  'developer.ui.webhooks.deleteConsequence.stop':
    'На этот URL-адрес больше ничего не отправляется.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'Журналы доставки хранятся в течение периода хранения аудита.',

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'Один план, два интервала. Polar является зарегистрированным продавцом: он владеет способом оплаты, выставляет счета и осуществляет отмену заказов.',
  'billing.ui.statusHeading': 'Текущий статус',
  'billing.ui.planHeading': 'План',
  'billing.ui.intervalHeading': 'Платежный интервал',
  'billing.ui.usageHeading': 'Измеренное использование провайдера',
  'billing.ui.invoicesHeading': 'Счета-фактуры',
  'billing.ui.cancelHeading': 'Отмена',
  'billing.ui.trialDaysRemaining':
    'Пробная версия, {count, plural, =0 {заканчивается сегодня} one {осталось # дней} few {осталось # дней} many {осталось # дней} other {осталось # дней}}',
  'billing.ui.convertsOn': 'Преобразует {date} в {amount} за {interval}.',
  'billing.ui.dueToday': '0 долларов США к оплате сегодня',
  'billing.ui.conversionLabel': 'Преобразует',
  'billing.ui.channelsLabel': 'Активные каналы',
  'billing.ui.paymentMethodPolar': 'Способ оплаты, принадлежащий Polar',
  'billing.ui.paymentMethodDescriptor':
    '{project} заканчивается {last4}, срок действия истекает {expiry}',
  'billing.ui.paymentMethodMissing': 'Способ оплаты пока отсутствует.',
  'billing.ui.cancelBeforeDate': 'Отмените подписку до {date}, и с вас не будет взиматься плата.',
  'billing.ui.annualFraming':
    '25 долларов США в месяц при ежегодной оплате. Экономьте 48 долларов в год.',
  'billing.ui.monthlyOption': '29 долларов в месяц',
  'billing.ui.annualOption': '300 долларов в год',
  'billing.ui.intervalChangeHelp':
    'Изменение интервала вступит в силу при следующем продлении. Polar пропорционально рассчитывает сумму и показывает точную сумму, прежде чем вы подтвердите ее.',
  'billing.ui.intervalChangedAnnouncement': 'Интервал выставления счетов установлен на {interval}.',
  'billing.ui.allowanceChannels':
    '30 активных социальных каналов. Канал, это одна подключенная учетная запись, страница или канал.',
  'billing.ui.allowanceChannelsUsage': '{used} из {limit} активных каналов',
  'billing.ui.allowanceFairUse':
    'Добросовестное использование означает защиту от спама, контроль тарифов и затрат провайдера. Они применяются одинаково к каждому подписчику и публикуются не по усмотрению.',
  'billing.ui.allowanceMetered':
    'X и некоторые другие провайдеры взимают плату за операцию. Эти расходы учитываются по себестоимости и не являются частью стоимости плана.',
  'billing.ui.allowanceNoMedia':
    'Генерация изображений и видео не включены и не продаются. Post Array не создает медиафайлы.',
  'billing.ui.readFairUse': 'Прочтите политику добросовестного использования',
  'billing.ui.readMeteredPolicy': 'Узнайте, как выставляется счет за использование по счетчику.',
  'billing.ui.usageCaption':
    'Использование услуг провайдера по счетчику в этот период, оплата осуществляется по себестоимости.',
  'billing.ui.usageColumn.item': 'Товар',
  'billing.ui.usageColumn.quantity': 'Количество',
  'billing.ui.usageColumn.unitPrice': 'Цена за единицу',
  'billing.ui.usageColumn.amount': 'Сумма',
  'billing.ui.usageTotal': 'Всего за этот период',
  'billing.ui.usagePeriod': 'Период от {start} до {end}',
  'billing.ui.usageSource': 'Цены опубликованы поставщиком. Проверено {date}.',
  'billing.ui.usageReconciled': 'Выверено счет поставщика на {date}.',
  'billing.ui.usagePending': 'Еще не помирились. Конечная сумма может незначительно измениться.',
  'billing.ui.usageUnavailableReason':
    'Провайдер еще не вернул использование за этот период. Обычно он доступен в течение 24 часов.',
  'billing.ui.usageEmpty': 'В этот период дозированного использования не будет.',
  'billing.ui.spendAlert': 'Оповещение о расходах',
  'billing.ui.spendAlertHelp':
    'Мы отправим вам электронное письмо, когда измеренное использование превысит эту сумму за расчетный период.',
  'billing.ui.spendAlertPause':
    'Также приостанавливайте дозируемые действия при достижении оповещения.',
  'billing.ui.balanceLabel': 'Баланс использования',
  'billing.ui.balanceHelp':
    'Измеренное использование высчитывается из этого баланса и выставляется счетом Polar.',
  'billing.ui.invoicesCaption': 'Счета-фактуры, выставленные Polar',
  'billing.ui.invoiceColumn.date': 'Дата',
  'billing.ui.invoiceColumn.description': 'Описание',
  'billing.ui.invoiceColumn.amount': 'Сумма',
  'billing.ui.invoiceColumn.state': 'Государство',
  'billing.ui.invoiceState.paid': 'Платный',
  'billing.ui.invoiceState.open': 'Открыть',
  'billing.ui.invoiceState.uncollectible': 'Не собрано',
  'billing.ui.invoiceState.refunded': 'Возвращено',
  'billing.ui.invoicesEmpty': 'Счета еще нет. Первый выдается при конвертации пробной версии.',
  'billing.ui.invoicesInPortal': 'Все счета и квитанции доступны на портале Polar.',
  'billing.ui.portalHelp':
    'На портале вы можете изменить способ оплаты, загрузить счета и отменить оплату. Он открывается в новой вкладке.',
  'billing.ui.pastDueHeading': 'Платеж просрочен',
  'billing.ui.pastDueBody':
    'Последний платеж не прошел. Обновите способ оплаты на портале Polar, чтобы продолжить публикацию.',
  'billing.ui.gracePolicy':
    'Запланированные публикации продолжают публиковаться до {date}. После этого рабочая область становится доступной только для чтения: ничего не удаляется и ничего не публикуется.',
  'billing.ui.cancelBody':
    'Отмена, это одно действие, которое вступает в силу по окончании оплаченного вами периода. Не нужно звонить и заполнять форму.',
  'billing.ui.cancelStart': 'Отменить подписку',
  'billing.ui.cancelDialogTitle': 'Отменить эту подписку',
  'billing.ui.cancelConsequence.noCharge':
    'С вас не будет взиматься плата. Ни сегодня, ни на {date} ничего не снимается.',
  'billing.ui.cancelConsequence.accessUntil': 'Вы сохраняете все функции до {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Черновики, квитанции, медиа и аналитика остаются в этом рабочем пространстве.',
  'billing.ui.cancelConsequence.scheduled':
    'Сообщения, запланированные после {date}, не будут публиковаться. Отмените или перенесите их до этого.',
  'billing.ui.cancelConsequence.restart': 'Вы можете начать подписку снова в любое время.',
  'billing.ui.cancelConfirm': 'Отменить подписку',
  'billing.ui.cancelKeep': 'Сохранить подписку',
  'billing.ui.cancelConfirmedBeforeConversion': 'Отменено. С вас не будет взиматься плата.',
  'billing.ui.cancelConfirmedAfterConversion': 'Отменено. Доступ продолжается до {date}.',
  'billing.ui.cancelAnnouncement': 'Подписка отменена.',
  'billing.ui.canceledNotice': 'Эта подписка отменена.',
  'billing.ui.resume': 'Начать подписку заново',
  'billing.ui.noSubscriptionTitle': 'В этой рабочей области нет подписки',
  'billing.ui.noSubscriptionExample':
    'Ежемесячно стоит 29 долларов. Годовая плата составляет 300 долларов США, что составляет 25 долларов США в месяц при ежегодной оплате. Экономьте 48 долларов в год.',
  'billing.ui.overChannelLimitAction': 'Просмотр подключенных каналов',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'Ответьте на короткий вопрос, подтвердите, что мы поняли, и получите план, который вы можете принять по пунктам. Он предлагает работу. Он никогда не планирует и не публикует ничего самостоятельно.',
  'growth.ui.step.intake': 'Впуск',
  'growth.ui.step.confirm': 'Подтвердить',
  'growth.ui.step.plan': 'План',
  'growth.ui.stepIndicator': 'Шаг {current} из {total}: {name}',
  'growth.ui.intake.section.product': 'Продукт',
  'growth.ui.intake.section.audience': 'Аудитория и рынки',
  'growth.ui.intake.section.objective': 'Цель',
  'growth.ui.intake.section.capacity': 'Каналы и пропускная способность',
  'growth.ui.intake.section.limits': 'Что запрещено',
  'growth.ui.intake.help':
    'Здесь за вас ничего не угадано. Все, что вы оставляете пустым, помечается как отсутствующее, а не заполненное.',
  'growth.ui.intake.productNameHelp': 'Имя, которое вы используете с клиентами.',
  'growth.ui.intake.siteUrlHelp':
    'Мы читаем страницу, которую вы нам предоставляете в качестве исходного материала. Вы подтверждаете каждый факт, который мы извлекаем из него.',
  'growth.ui.intake.descriptionHelp': 'Что вы продаете и для кого, своими словами.',
  'growth.ui.intake.marketsHelp': 'Страны или регионы. По одному на строку.',
  'growth.ui.intake.localesHelp': 'Языки, на которых вы будете публиковаться.',
  'growth.ui.intake.objectiveHelp': 'Чего вы хотите больше в следующем квартале.',
  'growth.ui.intake.conversionHelp':
    'Действие, которое вы действительно можете измерить. Регистрация, демо, покупка.',
  'growth.ui.intake.proofHelp':
    'Тематические исследования, тесты, которые вы использовали, скриншоты, которые у вас есть, разрешения, которые у вас уже есть. По одному на строку.',
  'growth.ui.intake.proofNone': 'У меня еще нет утвержденного доказательства',
  'growth.ui.intake.proofNoneEffect':
    'План позволит полностью избежать претензий клиентов и претензий по результатам.',
  'growth.ui.intake.channelsHelp': 'Аккаунты, с которых вы уже публикуете.',
  'growth.ui.intake.capacityHelp':
    'Будьте честны. План, который вы не можете выполнить,, это не план.',
  'growth.ui.intake.competitorsHelp': 'Необязательно. По одному на строку.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Претензии, которые вы не можете предъявлять по юридическим или политическим причинам. По одному на строку.',
  'growth.ui.intake.prohibitedTopicsHelp':
    'Темы, от которых стоит держаться подальше. По одному на строку.',
  'growth.ui.intake.submit': 'Проанализируйте, что мы поняли',
  'growth.ui.intake.savedAnnouncement': 'Бизнес-профиль сохранен.',
  'growth.ui.intake.requiredMissing':
    'Прежде чем продолжить, заполните поля, отмеченные как обязательные.',

  'growth.ui.confirm.factsTitle': 'Факты, которые вы подтвердили',
  'growth.ui.confirm.factsHelp': 'Их можно использовать в копии.',
  'growth.ui.confirm.assumptionsTitle': 'Предположения, которые мы сделали',
  'growth.ui.confirm.assumptionsHelp':
    'Это не факты. Они формируют план, но никогда не становятся претензией в посте.',
  'growth.ui.confirm.missingTitle': 'Отсутствует',
  'growth.ui.confirm.missingHelp':
    'План учитывает каждый из этих факторов и говорит об этом там, где это важно.',
  'growth.ui.confirm.confidence.label': 'Уверенность: {level}',
  'growth.ui.confirm.confidence.low': 'низкий',
  'growth.ui.confirm.confidence.medium': 'средний',
  'growth.ui.confirm.confidence.high': 'высокий',
  'growth.ui.confirm.promote': 'Подтвердить как факт',
  'growth.ui.confirm.correct': 'Исправьте это',
  'growth.ui.confirm.correctLabel': 'Ваша поправка',
  'growth.ui.confirm.generate': 'Создать план',
  'growth.ui.confirm.announcement': 'Бизнес-профиль подтвержден.',

  'growth.ui.plan.generatingBody':
    'Это занимает несколько секунд. Вы можете покинуть эту страницу: план завершится сам.',
  'growth.ui.plan.stateDraft': 'Проект, не утвержден',
  'growth.ui.plan.stateApproved': 'Утверждено',
  'growth.ui.plan.stateSuperseded': 'Заменено более новой версией',
  'growth.ui.plan.newVersionNotice':
    'При обновлении создается версия {version}, а утвержденная версия остается нетронутой.',
  'growth.ui.plan.emptyTitle': 'Плана пока нет',
  'growth.ui.plan.emptyBody':
    'Заполните профиль бизнеса и мы построим план из подтвержденных вами фактов.',
  'growth.ui.plan.emptyExample':
    'План содержит стратегию, четыре недели брифов, одну кампанию UGC, возможности, поддерживаемые каталогом, и до пяти инструментов.',
  'growth.ui.plan.tabsLabel': 'Разделы плана',
  'growth.ui.plan.modelNote': 'Создано {model}, подсказка {promptVersion}, на {date}.',

  'growth.ui.strategy.snapshotTitle': 'Бизнес-снимок',
  'growth.ui.strategy.channelPriority': 'Приоритет {rank}',
  'growth.ui.strategy.channelFormats': 'Родные форматы',
  'growth.ui.strategy.pillarProof': 'Доказательство того, что этот столб опирается на',
  'growth.ui.strategy.pillarProofNone':
    'Нет утвержденных доказательств. Пусть этот столбец будет описательным.',
  'growth.ui.strategy.cadenceCaption': 'Постов в неделю по каналам',
  'growth.ui.strategy.cadenceColumn.channel': 'Канал',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Сообщений в неделю',
  'growth.ui.strategy.cadenceTotal': 'Всего за неделю',
  'growth.ui.strategy.capacityWarning':
    'Эта частота составляет {planned} публикаций в неделю при заявленной мощности {capacity} часов. Уменьшите ее или увеличьте мощность в профиле.',
  'growth.ui.strategy.measurementBody':
    'По сравнению с вашими собственными постами на том же канале и в том же формате. Никакие внешние тесты не используются, поскольку ни один из них не сопоставим с вашей учетной записью.',
  'growth.ui.strategy.localeAdaptations': 'Языковые примечания',

  'growth.ui.fourWeek.caption': 'Предлагаемые сводки по неделям и дням',
  'growth.ui.fourWeek.column.date': 'Дата',
  'growth.ui.fourWeek.column.channel': 'Канал',
  'growth.ui.fourWeek.column.pillar': 'Столб',
  'growth.ui.fourWeek.column.format': 'Формат',
  'growth.ui.fourWeek.column.brief': 'Краткое описание',
  'growth.ui.fourWeek.column.cta': 'Призыв к действию',
  'growth.ui.fourWeek.column.measurement': 'Метка измерения',
  'growth.ui.fourWeek.column.actions': 'Действия',
  'growth.ui.fourWeek.approvalRequired': 'Для публикации требуется одобрение',
  'growth.ui.fourWeek.approvalNotRequired': 'Для этого аккаунта одобрение не требуется',
  'growth.ui.fourWeek.noCta': 'Нет призыва к действию',
  'growth.ui.fourWeek.weekEmpty': 'На этой неделе кратких обзоров не предложено.',
  'growth.ui.fourWeek.acceptedCount': '{accepted} из записок {total} приняты как черновики',
  'growth.ui.fourWeek.acceptAnnouncement': 'Черновик создан на основе этого брифа.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Предложение календаря добавлено для {date}.',

  'growth.ui.ugc.promptAngle': 'Угол {number}',
  'growth.ui.ugc.checklistTitle': 'Права, согласие и раскрытие информации',
  'growth.ui.ugc.checklistHelp':
    'Проработайте это с каждым участником, прежде чем что-либо будет опубликовано. Согласие на появление не является согласием на рекламу.',
  'growth.ui.ugc.incentiveNone': 'Стимул не предлагается',
  'growth.ui.ugc.incentiveDisclosure':
    'Поощрение должно быть указано в каждой публикации, созданной вами и участником.',
  'growth.ui.ugc.honesty':
    'Здесь планируется кампания, которую вы проводите с реальными людьми. Post Array не находит авторов, не связывается с ними, не пишет отзывы и не создает контент для клиентов.',

  'growth.ui.opportunities.caption':
    'Проверенные возможности из каталога, ранжированные по соответствию вашему профилю',
  'growth.ui.opportunities.column.opportunity': 'Возможность',
  'growth.ui.opportunities.column.type': 'Тип',
  'growth.ui.opportunities.column.audience': 'Аудитория',
  'growth.ui.opportunities.column.fit': 'Почему это подходит',
  'growth.ui.opportunities.column.requirements': 'Требования',
  'growth.ui.opportunities.column.rules': 'Правила саморекламы',
  'growth.ui.opportunities.column.cost': 'Стоимость',
  'growth.ui.opportunities.column.effort': 'Усилие',
  'growth.ui.opportunities.column.verified': 'Последняя проверка',
  'growth.ui.opportunities.column.actions': 'Действия',
  'growth.ui.opportunities.costFree': 'Бесплатно',
  'growth.ui.opportunities.effort.low': 'Низкий',
  'growth.ui.opportunities.effort.medium': 'Средний',
  'growth.ui.opportunities.effort.high': 'Высокий',
  'growth.ui.opportunities.noRequiredAsset': 'Актив не требуется',
  'growth.ui.opportunities.prepareTitle': 'Подготовьте заявку на {name}',
  'growth.ui.opportunities.prepareRules': 'Их правила, цитируемые',
  'growth.ui.opportunities.prepareChecklist': 'Что иметь наготове',
  'growth.ui.opportunities.prepareManual':
    'Вы отправляете это сами на их сайте. Post Array не заполняет формы, не создает учетные записи и не отправляет никому электронные письма.',
  'growth.ui.opportunities.pitchTitle': 'Проект подачи',
  'growth.ui.opportunities.pitchHelp':
    'Отредактируйте его перед отправкой. Он использует только те факты, которые вы подтвердили.',
  'growth.ui.opportunities.submittedOn': 'Отправлено {date}',
  'growth.ui.opportunities.staleTitle': 'Некоторые записи требуют повторной проверки',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {Дата проверки # записи уже прошла} few {Дата проверки # записи уже прошла} many {Дата проверки # записи уже прошла} other {Дата проверки # записи уже прошла}}. Проверьте текущие правила на сайте, прежде чем полагаться на них.',
  'growth.ui.opportunities.emptyExample':
    'Строка каталога содержит официальный URL-адрес, аудиторию, правила подачи, указанные на сайте, стоимость, затраченные усилия и дату, когда человек в последний раз проверял его.',

  'growth.ui.tools.shown': 'Показан {shown} из {max}',
  'growth.ui.tools.fewerThanMax':
    'Только {count, plural, one {# инструмента соответствует} few {# инструмента соответствует} many {# инструмента соответствует} other {# инструмента соответствует}} этому рабочему процессу с текущим обзором. Мы предпочитаем показывать меньше, чем дополнять список.',
  'growth.ui.tools.emptyTitle':
    'Ни один из рассмотренных инструментов пока не подходит для этого рабочего процесса.',
  'growth.ui.tools.emptyBody':
    'Для каждой записи требуется проверенная цена, проверенные условия прав и названное ограничение, прежде чем она появится здесь.',
  'growth.ui.tools.emptyExample':
    'В записи указывается, для чего он лучше всего подходит, почему он соответствует вашему плану, чего он не может делать, какие навыки ему нужны, как выходные данные возвращаются в Post Array и когда цена проверялась в последний раз.',
  'growth.ui.tools.openSite': 'Открыть официальный сайт {name}.',
  'growth.ui.tools.stale': 'Прошла дата рассмотрения. Исключено из созданных планов.',

  'growth.ui.item.explainTitle': 'Почему это было предложено',
  'growth.ui.item.explainEvidence': 'На чем это основано',
  'growth.ui.item.explainNoEvidence':
    'Это исходило из цели и правил канала, а не из подтвержденного факта о вашем бизнесе.',
  'growth.ui.item.dismissTitle': 'Отклонить это предложение',
  'growth.ui.item.dismissBody':
    'Расскажите нам, почему. Причина сохраняется вместе с планом и формирует следующую версию.',
  'growth.ui.item.dismissReasonLabel': 'Причина',
  'growth.ui.item.dismissReason.notRelevant': 'Не имеет отношения к этому бизнесу',
  'growth.ui.item.dismissReason.noCapacity': 'У нас нет возможности',
  'growth.ui.item.dismissReason.wrongAudience': 'Неправильная аудитория',
  'growth.ui.item.dismissReason.alreadyDone': 'Мы уже делаем это',
  'growth.ui.item.dismissReason.policy': 'Против нашей политики или претензий',
  'growth.ui.item.dismissReason.other': 'Что-то еще',
  'growth.ui.item.dismissNote': 'Все, что вы хотите добавить',
  'growth.ui.item.dismissed': 'Уволен. Оно остается видимым, поэтому вы можете отменить его.',
  'growth.ui.item.undoDismiss': 'Отменить увольнение',

  'growth.ui.export.title': 'Экспортировать этот план',
  'growth.ui.export.formatLabel': 'Формат',
  'growth.ui.export.copy': 'Скопировать в буфер обмена',
  'growth.ui.export.download': 'Скачать файл',
  'growth.ui.export.copied': 'План скопирован в буфер обмена.',
  'growth.ui.export.schemaNote':
    'Все три формата основаны на одной проверенной схеме версии {version}. Структурированные представления безопасны для системы контроля версий и не содержат секретов.',
  'growth.ui.export.previewLabel': 'Экспортировать предварительный просмотр',
} as const;
