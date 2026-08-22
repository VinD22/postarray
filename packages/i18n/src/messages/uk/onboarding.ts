/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Налаштуйте Relay',
  'onboarding.progress': 'Крок {current} з{total}',
  'onboarding.skipForNow': 'Пропустити поки що',
  'onboarding.goal': 'Перевірений запланований пост менш ніж за десять хвилин.',

  'onboarding.plan.title': 'Виберіть спосіб оплати',
  'onboarding.plan.help': 'Один план, кожна функція. Змінюйте інтервал коли завгодно.',

  'onboarding.workspace.title': 'Назвіть свою робочу область',
  'onboarding.workspace.namePlaceholder': 'Назва вашої компанії або клієнта',
  'onboarding.workspace.timeZone': 'Часовий пояс для планування',
  'onboarding.workspace.timeZoneHelp':
    'Кожен запланований час зберігається в цій зоні, тому зміна годинника ніколи випадково не пересуне ваш пост.',
  'onboarding.workspace.locale': 'Мова інтерфейсу',

  'onboarding.role.title': 'Що найкраще описує вас?',
  'onboarding.role.creator': 'Творець',
  'onboarding.role.team': 'Домашня команда',
  'onboarding.role.agency': 'Агентство',
  'onboarding.role.developer': 'Розробник або конструктор агентів',
  'onboarding.role.help':
    'Це змінює запропоновані нами параметри за умовчанням. Ви можете змінити все пізніше.',

  'onboarding.connect.title': 'Підключіть свій перший обліковий запис',
  'onboarding.connect.help':
    'Ми покажемо вам, які саме дозволи запитує кожна платформа, перш ніж ви щось схвалите.',
  'onboarding.connect.skipNote':
    'Ви можете спочатку дослідити за допомогою зразка облікового запису. З нього нічого не публікується.',
  'onboarding.connect.success': '{account}підключено.',

  'onboarding.content.title': 'Почніть з того, що у вас вже є',
  'onboarding.content.useAsset': 'Використовуйте зображення або відео',
  'onboarding.content.useBrief': 'Почніть із короткого брифу',
  'onboarding.content.useText': 'Напишіть самі',

  'onboarding.preview.title': 'Ось що опублікують',
  'onboarding.preview.help':
    'Реальний попередній перегляд правил платформи для цього облікового запису.',

  'onboarding.schedule.title': 'Виберіть, коли він згасне',
  'onboarding.schedule.help':
    'Перегляньте час, налаштування конфіденційності, розкриття інформації та приблизну вартість постачальника.',

  'onboarding.done.title': 'За розкладом',
  'onboarding.done.body': 'Ваша публікація запланована на {time} в {timeZone}.',
  'onboarding.done.nextStep.title': 'Що робити далі',
  'onboarding.done.nextStep.connectMore': 'Підключіть інший обліковий запис',
  'onboarding.done.nextStep.inviteTeam': 'Запросіть напарника',
  'onboarding.done.nextStep.setApproval': 'Встановіть політику затвердження',
  'onboarding.done.nextStep.exploreApi': 'Дослідіть сервер API і MCP',

  'onboarding.checklist.title': 'Початок роботи',
  'onboarding.checklist.connectAccount': 'Підключіть обліковий запис',
  'onboarding.checklist.firstPost': 'Опублікуйте або заплануйте публікацію',
  'onboarding.checklist.inviteTeammate': 'Запросіть напарника',
  'onboarding.checklist.setProjectVoice': 'Опишіть голос свого проекту',
  'onboarding.checklist.tryAutomation': 'Спробуйте правило автоматизації',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Все зроблено} one {# крок вліво} few {# кроків ліворуч} many {# кроків ліворуч} other {# кроків ліворуч}}',
} as const;
