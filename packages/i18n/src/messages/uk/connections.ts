/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': "Зв'язки",
  'connection.subtitle':
    'Облікові записи, сторінки та канали, у яких ця робоча область може публікувати.',
  'connection.add': 'Підключіть обліковий запис',
  'connection.count':
    '{used, plural, one {# активний канал} few {# активні канали} many {# активні канали} other {# активні канали}} з {limit}',
  'connection.limitReached':
    "Ця робоча область використовує всі {limit} канали. З'єднайте один перед підключенням іншого.",

  'connection.account.label': 'Обліковий запис',
  'connection.account.type.profile': 'Профіль',
  'connection.account.type.page': 'Сторінка',
  'connection.account.type.channel': 'Канал',
  'connection.account.type.group': 'Група',
  'connection.account.type.organization': 'організація',
  'connection.account.type.business': 'Бізнес рахунок',
  'connection.account.type.creator': 'Обліковий запис творця',
  'connection.connectedBy': 'Підключено через {name} на {date}',
  'connection.lastPublished': 'Востаннє опубліковано {relativeTime}',
  'connection.lastPublishedNever': 'З цього облікового запису ще нічого не опубліковано',
  'connection.lastAnalyticsSync': 'Аналітику синхронізовано {relativeTime}',

  'connection.status.healthy': 'Працює',
  'connection.status.expiringSoon': 'Термін дії завершується {relativeTime}',
  'connection.status.expired': 'Термін доступу минув',
  'connection.status.revoked': 'Доступ скасовано',
  'connection.status.paused': 'Призупинено',
  'connection.status.permissionMissing': 'Відсутній дозвіл',
  'connection.status.reviewPending': 'Очікуємо на перегляд платформи',
  'connection.status.unknown': "Здоров'я недоступне",

  'connection.token.expiresAt': 'Термін доступу завершується {date}',
  'connection.token.expiryUnknown': '{provider} не повідомимо нам, коли закінчиться цей доступ.',

  'connection.permissions.title': 'Дозволи',
  'connection.permissions.granted': 'Зрозуміло',
  'connection.permissions.missing': 'Не надано',
  'connection.permissions.explainBeforeOAuth':
    'Post Array запитує {provider} для цих дозволів. Ви можете будь-коли відключитися.',
  'connection.permissions.whyNeeded': 'Навіщо це потрібно',

  'connection.reconnect.title': 'Повторне підключення {account}',
  'connection.reconnect.body':
    'Заплановані публікації для цього облікового запису призупинено, доки його не буде повторно підключено. Нічого не втрачено.',
  'connection.disconnect.title': 'Відключити {account}?',
  'connection.disconnect.body':
    'Заплановані публікації для цього облікового запису не публікуватимуться. У цій робочій області залишаються вже зібрані квитанції та аналітика.',
  'connection.pause.body':
    'Призупинений обліковий запис зберігає свою історію та розклад, але не публікується, доки ви не відновите його.',

  'connection.incident.invalidToken':
    '{provider} відхилено збережений доступ для {account}. Повторно підключіться, щоб відновити публікацію.',
  'connection.incident.permissionLost':
    '{account} більше не гранти {permission}. Повторно підключіться та прийміть цей дозвіл.',
  'connection.incident.roleLost':
    'ваш {provider} користувач більше не має ролі {account}. Попросіть адміністратора цієї сторінки відкрити її.',
  'connection.incident.accountTypeInvalid':
    'Instagram потребує професійного професійного запису. Перемикач {account} до електронного запису компанії або творця, а потім знову підключитися.',
  'connection.incident.reviewRestricted':
    '{provider} обмежив цю програму, очікуючи на перевірку. Дописи від {account} публікувати приватно до завершення перевірки.',

  'connection.group.title': 'Групи клієнтів',
  'connection.group.description':
    'Групуйте облікові записи за клієнтом або проектом, щоб фільтрувати кожен екран.',
  'connection.group.assign': 'Перейти до групи',
  'connection.group.none': 'Розгрупований',
  'connection.group.moveNote':
    'Переміщення облікового запису зберігає його публікації, квитанції та аналітику.',

  'connection.oauth.starting': 'що {provider}',
  'connection.oauth.returned': 'Завершення підключення',
  'connection.oauth.chooseAccounts': 'Виберіть, які облікові записи підключити',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'На це немає облікових записів {provider} логін можна підключити.{reason}',
  'connection.oauth.canceled': 'З’єднання було скасовано {provider}. Нічого не змінилося.',
  'connection.oauth.alreadyConnected': '{account} вже підключено до цієї робочої області.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} підключено до іншої робочої області. Спочатку відключіть його там.',

  'capability.title': 'Що підтримує цей обліковий запис',
  'capability.matrix.title': 'Можливості платформи',
  'capability.matrix.subtitle':
    'Створено з визначень конекторів, які ми підтримуємо та переглядаємо вручну.',
  'capability.level.supported': 'Підтримується',
  'capability.level.unsupported': 'Платформа не пропонує',
  'capability.level.not_implemented': 'Ще не побудований',
  'capability.level.requires_review': 'Потребує перегляду платформи',
  'capability.level.beta': 'Бета',
  'capability.level.unknown': 'Недоступний',
  'capability.explain.supported': 'Post Array може зробити це для цього облікового запису сьогодні.',
  'capability.explain.unsupported':
    '{provider} не пропонує цей свій офіційний API, тому жодний інструмент не може зробити це безпечно.',
  'capability.explain.not_implemented':
    '{provider} пропонує це, але Post Array ще не створив. Це на дорожній карті роз’єму.',
  'capability.explain.requires_review':
    '{provider} надає це лише після перевірки програми або професійного запису. Він залишається недоступним, доки перевірка не пройде.',
  'capability.explain.beta':
    'Це працює з обмеженнями, які ми ще не перевірили. Перевірте результат, перш ніж покладатися на нього.',
  'capability.explain.unknown':
    'Нам не вдалося прочитати поточні дозволи для цього облікового запису. Повторно підключіться, щоб оновити їх.',
  'capability.lastChecked': 'Перевірено {relativeTime}',
  'capability.feature.text': 'Текстові повідомлення',
  'capability.feature.image': 'Зображення',
  'capability.feature.carousel': 'Каруселі',
  'capability.feature.video': 'відео',
  'capability.feature.document': 'Документи',
  'capability.feature.firstComment': 'Запланований перший коментар',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'Рідні згадки',
  'capability.feature.destinations': 'Вибір пункту призначення',
  'capability.feature.privacy': 'Елементи керування конфіденційністю',
  'capability.feature.thumbnail': 'Спеціальна мініатюра',
  'capability.feature.altText': 'Альтернативний текст',
  'capability.feature.analytics': 'Аналітика',
  'capability.feature.delete': 'Видалити опубліковану публікацію',
  'capability.feature.commentCount': 'Коментар має значення',
  'capability.feature.commentReplies': 'Читання та відповідь на коментарі',
  'capability.feature.disclosure': 'Автоматизація розкриття',
} as const;
