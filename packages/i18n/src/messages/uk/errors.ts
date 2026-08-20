/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'Щось пішло не так, і ми не змогли це класифікувати.',
  'error.unknown.action': 'Спробуйте знову. Якщо це повторюється, надішліть нам посилання нижче.',
  'error.internal.message': 'Це проблема з нашого боку, а не з вашим вмістом.',
  'error.internal.action':
    'Ваша робота збережена. Нас попереджено. Повторіть спробу через кілька хвилин.',
  'error.not_implemented.message': 'Relay ще не створив цього.',
  'error.not_implemented.action': 'Слідкуйте за журналом змін, коли він надійде.',
  'error.offline.message': 'Ви офлайн.',
  'error.offline.action':
    'Ваша чернетка зберігається на цьому пристрої. Публікація та планування відновляться, коли з’єднання відновиться.',
  'error.network_unreachable.message': 'Не вдалося підключитися до сервера.',
  'error.network_unreachable.action':
    'Перевірте підключення та повторіть спробу. Нічого не було втрачено.',
  'error.request_invalid.message': 'Запит був не в тій формі, яку ми можемо прийняти.',
  'error.request_invalid.action': 'Перевірте поля, наведені нижче, і надішліть його ще раз.',
  'error.validation_failed.message':
    'Деякі поля потрібно змінити, перш ніж це можна буде зберегти.',
  'error.validation_failed.action': 'Виправити виділені поля.',
  'error.unauthenticated.message': 'Для цього вам потрібно ввійти в систему.',
  'error.unauthenticated.action': 'Увійдіть, і ми повернемо вас сюди.',
  'error.session_expired.message': 'Ваш сеанс закінчився.',
  'error.session_expired.action': 'Увійдіть знову. Ваша чернетка збережена.',
  'error.mfa_required.message': 'Ця дія потребує двофакторного підтвердження.',
  'error.mfa_required.action': 'Щоб продовжити, підтвердьте програму автентифікації.',
  'error.forbidden.message': 'Ваша роль не дозволяє цю дію.',
  'error.forbidden.action':
    'Попросіть власника або адміністратора цієї робочої області отримати доступ.',
  'error.insufficient_scope.message': 'Ці облікові дані не мають області дії {scope}.',
  'error.insufficient_scope.action':
    'Надайте цю область або використовуйте облікові дані, у яких вона вже є.',
  'error.workspace_not_found.message': 'Ця робоча область не існує, або ви не є учасником.',
  'error.workspace_not_found.action': 'Виберіть робоче місце, до якого ви належите.',
  'error.workspace_suspended.message': 'Цю робочу область призупинено.',
  'error.workspace_suspended.action':
    'Щоб вирішити проблему, зверніться до служби підтримки. Ваші дані недоторкані.',
  'error.not_found.message': 'Цей елемент більше не існує.',
  'error.not_found.action': 'Можливо, його було видалено. Поверніться та оновіть список.',
  'error.conflict.message': 'Хтось змінив це, поки ви над цим працювали.',
  'error.conflict.action': 'Перегляньте обидві версії, потім збережіть їх знову.',
  'error.idempotency_key_reused.message':
    'Цей ключ ідемпотентності вже використовувався для іншого запиту.',
  'error.idempotency_key_reused.action':
    'Використовуйте новий ключ або повторіть оригінальний запит.',
  'error.rate_limited.message': 'Забагато запитів.',
  'error.rate_limited.action': 'Спробуйте знову після {time}.',
  'error.quota_exceeded.message': 'Ця дія перевищує ліміт на поточний період.',
  'error.quota_exceeded.action': 'Ліміт скидається {relativeTime}.',
  'error.payment_required.message': 'Ця робоча область не має активної підписки.',
  'error.payment_required.action':
    'Розпочніть підписку, щоб знову опублікувати. Нічого не видалено.',
  'error.subscription_past_due.message': 'Останній платіж не пройшов.',
  'error.subscription_past_due.action': 'Оновіть спосіб оплати на порталі Polar.',
  'error.trial_expired.message': 'Суд закінчився {date}.',
  'error.trial_expired.action': 'Розпочніть підписку, щоб продовжити публікацію.',
  'error.entitlement_missing.message': 'Ця робоча область не має доступу до цієї функції.',
  'error.entitlement_missing.action':
    'Перевірте налаштування платежів або зверніться до служби підтримки.',
  'error.channel_limit_reached.message':
    'Ця робоча область вже використовує всі {limit} активні канали.',
  'error.channel_limit_reached.action': 'Від’єднайте канал перед підключенням іншого.',
  'error.project_limit_reached.message':
    'Ця робоча область вже використовує всі {limit} активні проєкти.',
  'error.project_limit_reached.action':
    'Заархівуйте неактивний проєкт або змініть ліміт проєктів для робочої області.',
  'error.project_has_connections.message':
    'Цей проєкт усе ще має {connected, plural, one {# підключений канал} few {# підключені канали} many {# підключених каналів} other {# підключені канали}}.',
  'error.project_has_connections.action':
    'Від’єднайте всі канали в цьому проєкті перед архівуванням.',
  'error.project_last_active.message':
    'У робочій області має залишатися щонайменше один активний проєкт.',
  'error.project_last_active.action': 'Створіть інший проєкт, перш ніж архівувати цей.',
  'error.connection_not_found.message': 'Цього з’єднання більше немає в цій робочій області.',
  'error.connection_not_found.action':
    'Знову підключіть обліковий запис, щоб продовжити публікацію в ньому.',
  'error.connection_revoked.message': '{account}скасовано доступ на {provider}.',
  'error.connection_revoked.action':
    'Повторно підключіть обліковий запис. Після цього заплановані публікації відновлюються.',
  'error.connection_expired.message': 'Доступ для {account} закінчився.',
  'error.connection_expired.action':
    'Повторно підключіть обліковий запис, щоб відновити публікацію та аналітику.',
  'error.connection_paused.message': '{account}призупинено.',
  'error.connection_paused.action': 'Відновіть його з підключень, коли будете готові.',
  'error.connection_permission_missing.message':
    '{account}не надав дозволу, необхідного для цього.',
  'error.connection_permission_missing.action':
    'Повторно підключитися та прийняти {permission} на екрані згоди.',
  'error.connection_account_type_invalid.message':
    'Instagram потребує професійного професійного запису. {account} це особистий рахунок.',
  'error.connection_account_type_invalid.action':
    'Переключіть його на обліковий запис компанії або автора в додатку Instagram, а потім знову підключіться.',
  'error.connection_review_pending.message': '{provider}все ще переглядає цю програму {account}.',
  'error.connection_review_pending.action':
    'Дописи публікуються приватно, доки перевірка не пройде. Ми оновлюємо цю сторінку, коли вона змінюється.',
  'error.capability_unsupported.message': '{provider}не пропонує цей свій офіційний API.',
  'error.capability_unsupported.action':
    'Використовуйте формат, який підтримує цей обліковий запис.',
  'error.capability_not_implemented.message': 'Relay не створив це для {provider} ще.',
  'error.capability_not_implemented.action':
    'На сторінці можливостей перелічено, що кожен конектор може робити сьогодні.',
  'error.capability_requires_review.message':
    '{provider}надає це лише після перевірки програми чи професійного запису.',
  'error.capability_requires_review.action':
    'Він залишається недоступним, доки перевірка не пройде.',
  'error.content_invalid.message': '{provider}не приймайте цей вміст для {account}.',
  'error.content_invalid.action': 'Проблеми перераховані на цілі. Виправте їх і повторіть спробу.',
  'error.content_changed_after_approval.message': 'Ця публікація змінилася після її затвердження.',
  'error.content_changed_after_approval.action':
    'Ще раз подайте запит на схвалення перед публікацією.',
  'error.duplicate_content.message':
    'Було опубліковано дуже схожий вміст {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Змініть текст або опублікуйте пізніше. Платформи обмежують повторювані публікації.',
  'error.cadence_limit_reached.message':
    '{account}досягла частоти публікацій, встановлених для цієї робочої області.',
  'error.cadence_limit_reached.action':
    'Заплануйте це на наступний слот або підвищте обмеження частоти обертання.',
  'error.media_invalid.message': 'Цей файл не можна опублікувати в {provider}.',
  'error.media_invalid.action': 'Точне обмеження показано поруч із файлом.',
  'error.media_too_large.message': 'Цей файл більший ніж {provider} будь.',
  'error.media_too_large.action':
    'Стисніть його або завантажте зменшену версію. Оригінал зберігається.',
  'error.media_processing_failed.message': 'Ми не можемо підготувати цей файл для {provider}.',
  'error.media_processing_failed.action':
    'Спробуйте завантажити його ще раз або скористайтеся іншим форматом.',
  'error.media_rights_undeclared.message': 'Цей медіа не має декларації прав.',
  'error.media_rights_undeclared.action':
    'Підтвердьте, що ви маєте право опублікувати його, включно з будь-якими людьми в ньому.',
  'error.alt_text_required.message':
    'Для цього зображення потрібен альтернативний текст {provider}.',
  'error.alt_text_required.action': 'Опишіть зображення або позначте його як декоративне.',
  'error.approval_required.message': 'Цю робочу область потрібно схвалити перед публікацією.',
  'error.approval_required.action': 'Запит на схвалення від {approver}.',
  'error.approval_expired.message': 'Термін дії схвалення цієї посади закінчився {date}.',
  'error.approval_expired.action': 'Знову надіслати запит на схвалення.',
  'error.schedule_in_past.message': 'Той час уже минув {timeZone}.',
  'error.schedule_in_past.action': 'Виберіть пізніший час або опублікуйте зараз.',
  'error.schedule_conflict.message': '{account}вже має публікацію в {duration} цього часу.',
  'error.schedule_conflict.action': 'Перемістіть один із них або продовжте, якщо це передбачено.',
  'error.time_zone_invalid.message': 'Ми не розпізнаємо часовий пояс {timeZone}.',
  'error.time_zone_invalid.action': 'Виберіть зону зі списку.',
  'error.destination_unavailable.message':
    'Пункт призначення {destination} більше не доступний на {provider}.',
  'error.destination_unavailable.action': 'Оновіть список адресатів і виберіть інший.',
  'error.mention_unresolved.message': 'Згадку не було зіставлено з реальною {provider} рахунок.',
  'error.mention_unresolved.action':
    'Знайдіть і виберіть обліковий запис або видаліть згадку. Ми ніколи не публікуємо підроблені нативні теги.',
  'error.provider_transient.message': '{provider}не вдалося обробити це прямо зараз.',
  'error.provider_transient.action': 'Ми повторимо спробу автоматично. Нічого не дублюється.',
  'error.provider_permanent.message': '{provider}відхилив це та не прийме повторну спробу.',
  'error.provider_permanent.action': 'Продезінфікована відповідь знаходиться на квитанції.',
  'error.provider_rate_limited.message': '{provider}швидкість обмежила цей робочий простір.',
  'error.provider_rate_limited.action': 'Ми повторимо спробу пізніше {time}.',
  'error.provider_unavailable.message': '{provider}не відповідає.',
  'error.provider_unavailable.action':
    'Перевірте сторінку статусу. Заплановані публікації постійно повторюються.',
  'error.provider_content_rejected.message':
    '{provider}відмовив цей вміст відповідно до власної політики.',
  'error.provider_content_rejected.action':
    'Причина вказана в квітації. Відредагуйте вміст або зверніться за допомогою {provider}.',
  'error.user_action_required.message': '{account}потрібно щось від вас, перш ніж опублікувати.',
  'error.user_action_required.action': 'Відкрийте підключення, щоб побачити, чого не вистачає.',
  'error.short_link_destination_blocked.message': 'Цей пункт призначення не можна скоротити.',
  'error.short_link_destination_blocked.action':
    'Приватні мережі, небезпечні схеми та відомі зловмисники блокуються.',
  'error.short_link_domain_unverified.message': 'Домен {domain} ще не перевірено.',
  'error.short_link_domain_unverified.action':
    'Додайте запис DNS, показаний у налаштуваннях, а потім перевірте.',
  'error.rss_feed_invalid.message': 'Цей URL не повернув дійсний канал RSS або Atom.',
  'error.rss_feed_invalid.action':
    'Перевірте адресу. Ми отримуємо його безпечно та не використовуємо жодних приватних переадресацій.',
  'error.webhook_signature_invalid.message': 'Підпис на цьому вебхуку не перевірено.',
  'error.webhook_signature_invalid.action':
    'Переконайтеся, що відправник використовує поточний секрет підпису. Корисне навантаження не оброблено.',
  'error.webhook_delivery_failed.message': 'Доставка до {endpoint} не відвід.',
  'error.webhook_delivery_failed.action':
    'Ми повторюємо спробу з відстрочкою. У журналі доставки є відповідь.',
  'error.automation_rule_not_permitted.message':
    'Це правило порушить правило платформи, тому його неможливо створити.',
  'error.automation_rule_not_permitted.action':
    'Автоматичні лайки, підписки, небажані відповіді та повторні масові публікації ніколи не доступні.',
  'error.ai_unavailable.message': 'Помічник з написання зараз недоступний.',
  'error.ai_unavailable.action': 'Ваш текст залишився недоторканим. Повторіть спробу незабаром.',
  'error.ai_output_invalid.message': 'Помічник повернув щось, що ми не змогли перевірити.',
  'error.ai_output_invalid.action': 'До вашої чернетки нічого не застосовано. Спробуйте знову.',
  'error.ai_budget_exceeded.message':
    'У цій робочій області наразі досягнуто обмеження кількості помічників.',
  'error.ai_budget_exceeded.action':
    'Ліміт скидається {relativeTime}. Писати від рук все ще працює.',
  'error.storage_unavailable.message': 'Не вдалося отримати доступ до медіа-сховища.',
  'error.storage_unavailable.action':
    'Ваш текст збережено. Спробуйте завантажити знову через мить.',
  'error.export_unavailable.message': 'Такий експорт не вдалося виробити.',
  'error.export_unavailable.action':
    'Спробуйте менший діапазон або зверніться до служби підтримки з посиланням.',

  'error.reference': 'довідка{correlationId}',
  'error.reportToSupport': 'Надішліть це в службу підтримки',
  'error.contentPreserved': 'Ваш вміст збережено. Нічого не було опубліковано.',
} as const;
