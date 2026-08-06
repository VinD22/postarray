/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message': '{provider}потрібен текст для цього типу публікації.',
  'validation.text_too_long.message':
    '{over, plural, one {#символ понад ліміт для {account}} few {# символів обмеження для {account}} many {# символів обмеження для {account}} other {# символів обмеження для{account}}}',
  'validation.text_too_long.hint': '{provider}дозволяє {limit} символів для цього легкого запису.',
  'validation.text_too_short.message': '{provider}потребує принаймні {min} персонажів тут.',
  'validation.title_required.message': '{provider}потребує заголовка.',
  'validation.title_too_long.message': 'Назва над {limit} обмеження символів.',
  'validation.description_too_long.message': 'Опис закінчено {limit} обмеження символів.',
  'validation.media_required.message':
    '{provider}потрібно принаймні одне зображення або відео для цього типу публікації.',
  'validation.media_count_exceeded.message':
    '{provider}максимально максимум {limit, plural, one {# файл} few {# файли} many {# файли} other {# файли}} тут. Ця публікація має {count}.',
  'validation.media_type_unsupported.message': '{provider}не слід {mimeType} файли.',
  'validation.media_aspect_ratio_unsupported.message':
    'Цей файл {actual}. {provider} потребує сукупність між {min} і {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Щоб виправити це, обріжте його за допомогою попереднього налаштування платформи.',
  'validation.media_resolution_too_low.message':
    'Цей файл {actual}. {provider} потребує принаймні {required}.',
  'validation.media_duration_too_long.message':
    'Це відео {actual}. {provider} необхідно до {limit} для цього запису.',
  'validation.media_duration_too_short.message':
    'Це відео {actual}. {provider} потребує принаймні {limit}.',
  'validation.media_file_too_large.message': 'Цей файл {actual}. {provider} необхідно до {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider}не можна опублікувати зображення та відео в одній публікації.',
  'validation.alt_text_missing.message':
    'Альтернативний текст відсутній {count, plural, one {# зображення} few {# зображення} many {# зображення} other {# зображення}}.',
  'validation.alt_text_missing.hint': 'Опишіть зображення або позначте його як декоративне.',
  'validation.thumbnail_unsupported.message': '{provider}не після використання мініатюри тут.',
  'validation.destination_required.message': 'Виберіть місце публікації {provider}.',
  'validation.destination_unsupported.message':
    '{destination}не слід цей тип публікації на {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {#згадка не була зіставлена з реальним обліковим записом} few {# ки не були зіставлені з реальними обліковими записами} many {# ки не були зіставлені з реальними обліковими записами} other {# ки не були зіставлені з реальними обліковими записами}}.',
  'validation.mention_unresolved.hint':
    'Виберіть обліковий запис із результатів пошуку або видаліть згадку. Звичайний текст ніколи не публікується як нативний тег.',
  'validation.hashtag_count_exceeded.message':
    '{count}хештеги. {provider} нараховує більше ніж {limit} як спам.',
  'validation.link_not_allowed.message': '{provider}не допускає посилань у цьому полі.',
  'validation.link_destination_unverified.message':
    'Домен посилання {domain} не перевірено для цієї робочої області.',
  'validation.privacy_setting_required.message':
    '{provider}вимагає чіткого вибору конфіденційності перед публікацією.',
  'validation.privacy_setting_required.hint':
    'Немає замовчування. Виберіть, хто може бачити цю публікацію.',
  'validation.disclosure_required.message':
    'Ця публікація потребує розкриття інформації відповідно до правил бренду {market}.',
  'validation.first_comment_unsupported.message':
    '{provider}не підтримується запланований перший коментар для цього запису.',
  'validation.thread_unsupported.message':
    '{provider}не підтримує потоки для цього легкого запису.',
  'validation.repeat_end_required.message':
    'Повторювана публікація потребує дати завершення або кількості повторів.',
  'validation.schedule_in_past.message': 'той час минув {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'Це далі попереду, ніж {limit} подивіться вперед для цих облікових даних.',
  'validation.schedule_outside_quiet_hours.message':
    'Це відбувається у встановлені години тиші {brand}.',
  'validation.duplicate_within_window.message':
    'Дуже подібний вміст уже заплановано або опубліковано {account} в межах {window}.',
  'validation.blocked_term_present.message': 'Текст містить заблокований термін для {brand}.',
  'validation.unsupported_claim.message':
    'Ця претензія не входить до підтвердженої формули {brand}.',
  'validation.unsupported_claim.hint':
    'Додайте його до підтверджених тверджень із доказами або переформулюйте речення.',
  'validation.cadence_exceeded.message':
    '{account}опублікував би {count, plural, one {# час} few {# разів} many {# разів} other {# разів}} того дня понад ліміт {limit}.',
  'validation.connection_paused.message': '{account}призупинено та не буде опубліковано.',
  'validation.account_type_invalid.message':
    '{account}не є типом запису {provider} потрібно для цього типу посади.',

  'validation.severity.error': 'Треба виправити',
  'validation.severity.warning': 'Перевір це',
  'validation.severity.info': 'Для вашого відома',
  'validation.field.required': "Це поле є обов'язковим для заповнення.",
  'validation.field.tooShort':
    'Використовуйте хоча б {min, plural, one {# характер} few {# персонажів} many {# персонажів} other {# персонажів}}.',
  'validation.field.tooLong':
    'Використовуйте максимум {max, plural, one {# характер} few {# персонажів} many {# персонажів} other {# персонажів}}.',
  'validation.field.invalidEmail': 'Введіть дійсну адресу електронної пошти.',
  'validation.field.invalidUrl': 'Введіть повний URL, включаючи https.',
  'validation.field.invalidDate': 'Введіть дійсну дату.',
  'validation.field.invalidTime': 'Введіть дійсний час.',
  'validation.field.invalidNumber': 'Введіть число.',
  'validation.field.outOfRange': 'Введіть значення між {min} і {max}.',
  'validation.field.mustMatch': 'Ці два значення повинні збігатися.',
  'validation.field.alreadyTaken': 'Це вже використовується.',
  'validation.field.unsafeValue': 'Це значення тут не допускається.',
} as const;
