/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'Ще нічого не заплановано',
  'empty.calendar.body': 'Напишіть свій перший пост і виберіть час. Ви можете змінити це пізніше.',
  'empty.calendar.action': 'Створіть допис',
  'empty.drafts.title': 'Без протягів',
  'empty.drafts.body': 'Чернетки, які ви зберігаєте, відображаються тут із цілями та проблемами.',
  'empty.connections.title': 'Немає підключених облікових записів',
  'empty.connections.body':
    'Підключіть обліковий запис, щоб опублікувати в ньому. Спочатку ми покажемо вам точні дозволи.',
  'empty.connections.action': 'Підключіть обліковий запис',
  'empty.analytics.title': 'Показників ще немає',
  'empty.analytics.body':
    'Показники з’являються після того, як ваша перша публікація була опублікована достатньо довго, щоб платформа могла звітувати про неї.',
  'empty.analytics.noPermission':
    'Цей обліковий запис не має доступу до аналітики. Повторно підключіться, щоб додати його.',
  'empty.approvals.title': 'Тебе нічого не чекає',
  'empty.approvals.body': 'Тут відображаються запити на схвалення для ваших проектів.',
  'empty.library.title': 'Ваша бібліотека порожня',
  'empty.library.body': 'Завантажте зображення та відео або імпортуйте їх із URL або API.',
  'empty.library.action': 'Завантажте медіа',
  'empty.automation.title': 'Правил ще немає',
  'empty.automation.body':
    'Правило реагує на щось і пропонує дію. Кожне правило показує свої обмеження, перш ніж ви його ввімкнете.',
  'empty.webhooks.title': 'Немає кінцевих точок',
  'empty.webhooks.body':
    'Додайте кінцеву точку для отримання підписаних подій щодо публікації та підключень.',
  'empty.searchResults.title': 'Немає результатів для{query}',
  'empty.searchResults.body': 'Перевірте орфографію або очистіть фільтр.',
  'empty.filtered.title': 'Ніщо не відповідає цим фільтрам',
  'empty.filtered.action': 'Очистити фільтри',
  'empty.auditLog.title': 'Активності ще немає',
  'empty.receipts.title': 'Ще немає квитанцій',
  'empty.receipts.body':
    'Кожна публікація видає квитанцію, яку ви можете перевірити та поділитися.',

  'loading.default': 'Завантаження',
  'loading.calendar': 'Завантаження календаря',
  'loading.analytics': 'Завантаження показників',
  'loading.preview': 'Створення попереднього перегляду',
  'loading.validating': 'Перевірка поточних обмежень платформи',
  'loading.publishing': 'Публікація в{provider}',
  'loading.uploading': 'Завантаження{name}',
  'loading.uploadProgress': '{percent}завантажено',
  'loading.connecting': 'Підключення до{provider}',
  'loading.savingDraft': 'Збереження чернетки',
  'loading.generatingPlan': 'Побудова вашого плану',
  'loading.longRunning': 'Це займає більше часу, ніж зазвичай. Він все ще працює.',

  'offline.banner': 'Ви офлайн. Зміни зберігаються на цьому пристрої.',
  'offline.draftSafe': 'Ваша чернетка в безпеці. Він синхронізується, коли ви знову в мережі.',
  'offline.publishDisabled':
    'Для публікації потрібне з’єднання. Це не буде поставлено в чергу тихо.',
  'offline.scheduleQueued':
    'Цей запит на розклад поставлено в чергу на цьому пристрої та буде надіслано, коли ви знову підключитесь до мережі.',
  'offline.reconnected': 'Знову онлайн. Синхронізація ваших змін.',
  'offline.syncConflict':
    'Деякі зміни не вдалося об’єднати автоматично. Перегляньте їх перед збереженням.',

  'permission.denied.title': 'Ви не маєте до цього доступу',
  'permission.denied.role': 'Це потребує {role} роль. Ви є {currentRole}.',
  'permission.denied.scope': 'Для цих облікових даних потрібен обсяг {scope}.',
  'permission.denied.contactOwner': 'Запитуйте {owner} надати це.',
  'permission.denied.projectScope': 'Ваш доступ обмежено {projects}.',
  'permission.readOnly': 'Ця робоча область зараз доступна лише для читання.',
  'permission.mfaRequired': 'Щоб продовжити, підтвердьте двофакторну автентифікацію.',

  'rateLimit.title': 'Уповільніть на мить',
  'rateLimit.body': 'Ви зробили {count} запити в {window}. Межа є {limit}.',
  'rateLimit.resetsAt': 'Це скидається на {time}.',
  'rateLimit.cheaperAlternative':
    'Планування замість публікації тепер дозволяє уникнути цього обмеження.',
  'rateLimit.providerCost': '{provider}плата за операцію. Ця дія оцінюється в {amount}.',

  'incident.providerDegraded':
    '{provider}має проблеми. Запланована публікація постійно повторюється.',
  'incident.providerDown': '{provider}недоступний. Ніщо не втрачено і ніщо не дубується.',
  'incident.isolated': 'Інші платформи не впливають.',
  'incident.statusPage': "Актуальний статус за роз'ємом і поверхнею",
  'incident.startedAt': 'розпочато{relativeTime}',

  'translation.incomplete':
    'Будь-який текст на цьому екрані не перекладено {language} ще й показано англійською мовою.',
  'translation.beta':
    'Ця мова знаходиться в бета-версії. Повідомте про все, що читається неправильно.',

  'confirm.discardChanges.title': 'Скасувати зміни?',
  'confirm.discardChanges.body': 'Це неможливо скасувати.',
  'confirm.deleteItem.title': 'Видалити {name}?',
  'confirm.deleteItem.body': 'Це неможливо скасувати.',
  'confirm.cancelScheduled.title': 'Скасувати цю заплановану публікацію?',
  'confirm.cancelScheduled.body':
    'Він не буде опублікований. Чернетка залишається тут, щоб ви могли запланувати її знову.',
  'confirm.publishNow.title': 'Опублікувати зараз?',
  'confirm.publishNow.body':
    '{count, plural, one {Це публікує в # поточну рахунок} few {Це публікує в # рахунки повторно} many {Це публікує в # рахунки повторно} other {Це публікує в # рахунки повторно}}. Його не можна відкликати з Relay.',
  'confirm.typeToConfirm': 'Тип {word} для підтвердження.',
} as const;
