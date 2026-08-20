/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Настройте Relay',
  'onboarding.progress': 'Шаг {current} из {total}',
  'onboarding.skipForNow': 'Пропустить сейчас',
  'onboarding.goal': 'Подтвержденная запланированная публикация менее чем за десять минут.',

  'onboarding.plan.title': 'Выберите способ оплаты',
  'onboarding.plan.help': 'Один план, все функции. Измените интервал, когда захотите.',

  'onboarding.workspace.title': 'Назовите свое рабочее пространство',
  'onboarding.workspace.namePlaceholder': 'Название вашей компании или клиента',
  'onboarding.workspace.timeZone': 'Часовой пояс для планирования',
  'onboarding.workspace.timeZoneHelp':
    'Каждое запланированное время сохраняется в этой зоне, поэтому изменение часов никогда не приведет к случайному перемещению вашего сообщения.',
  'onboarding.workspace.locale': 'Язык интерфейса',

  'onboarding.role.title': 'Что характеризует вас лучше всего?',
  'onboarding.role.creator': 'Создатель',
  'onboarding.role.team': 'Внутренняя команда',
  'onboarding.role.agency': 'Агентство',
  'onboarding.role.developer': 'Разработчик или создатель агента',
  'onboarding.role.help':
    'Это изменяет предлагаемые нами значения по умолчанию. Вы можете изменить все позже.',

  'onboarding.connect.title': 'Подключите свою первую учетную запись',
  'onboarding.connect.help':
    'Мы покажем вам, какие именно разрешения запрашиваются для каждой платформы, прежде чем вы что-либо одобрите.',
  'onboarding.connect.skipNote':
    'Сначала вы можете изучить образец аккаунта. Из него ничего не публикуется.',
  'onboarding.connect.success': '{account} подключен.',

  'onboarding.content.title': 'Начните с того, что у вас уже есть',
  'onboarding.content.useAsset': 'Используйте изображение или видео',
  'onboarding.content.useBrief': 'Начните с краткого описания',
  'onboarding.content.useText': 'Напиши это сам',

  'onboarding.preview.title': 'Вот что будет опубликовано',
  'onboarding.preview.help': 'Настоящее превью из правил платформы для этого аккаунта.',

  'onboarding.schedule.title': 'Выберите, когда оно погаснет',
  'onboarding.schedule.help':
    'Просмотрите время, настройки конфиденциальности, раскрытие информации и ориентировочную стоимость поставщика услуг.',

  'onboarding.done.title': 'Запланировано',
  'onboarding.done.body': 'Ваша публикация запланирована на {time} в {timeZone}.',
  'onboarding.done.nextStep.title': 'Что делать дальше',
  'onboarding.done.nextStep.connectMore': 'Подключить другую учетную запись',
  'onboarding.done.nextStep.inviteTeam': 'Пригласить товарища по команде',
  'onboarding.done.nextStep.setApproval': 'Установите политику одобрения',
  'onboarding.done.nextStep.exploreApi': 'Изучите API и сервер MCP',

  'onboarding.checklist.title': 'Начало работы',
  'onboarding.checklist.connectAccount': 'Подключить аккаунт',
  'onboarding.checklist.firstPost': 'Опубликовать или запланировать публикацию',
  'onboarding.checklist.inviteTeammate': 'Пригласить товарища по команде',
  'onboarding.checklist.setProjectVoice': 'Опишите голос вашего бренда',
  'onboarding.checklist.tryAutomation': 'Попробуйте правило автоматизации',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Все готово} one {# шаг осталось} few {# шагов осталось} many {# шагов осталось} other {# шагов осталось}}',
} as const;
