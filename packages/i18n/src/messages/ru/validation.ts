/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message': '{provider} нужен текст для этого типа сообщения.',
  'validation.text_too_long.message':
    '{over, plural, one {# символов превышает лимит для {account}} few {# символов превышает лимит для {account}} many {# символов превышает лимит для {account}} other {# символов превышает лимит для {account}}}',
  'validation.text_too_long.hint':
    '{provider} позволяет использовать символы {limit} для этой учетной записи.',
  'validation.text_too_short.message': 'Для {provider} здесь требуется как минимум символов {min}.',
  'validation.title_required.message': '{provider} нужен заголовок.',
  'validation.title_too_long.message':
    'В заголовке превышено ограничение на количество символов {limit}.',
  'validation.description_too_long.message':
    'В описании превышено ограничение на количество символов {limit}.',
  'validation.media_required.message':
    '{provider} необходимо хотя бы одно изображение или видео для публикации этого типа.',
  'validation.media_count_exceeded.message':
    '{provider} принимает не более {limit, plural, one {# файла} few {# файлов} many {# файлов} other {# файлов}} здесь. В этом посте есть {count}.',
  'validation.media_type_unsupported.message': '{provider} не принимает файлы {mimeType}.',
  'validation.media_aspect_ratio_unsupported.message':
    'Это файл {actual}. Для {provider} требуется соотношение между {min} и {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Чтобы исправить это, обрежьте его с помощью предустановленной платформы.',
  'validation.media_resolution_too_low.message':
    'Это файл {actual}. Для {provider} требуется как минимум {required}.',
  'validation.media_duration_too_long.message':
    'Это видео {actual}. {provider} принимает до {limit} для этой учетной записи.',
  'validation.media_duration_too_short.message':
    'Это видео {actual}. Для {provider} требуется как минимум {limit}.',
  'validation.media_file_too_large.message': 'Это файл {actual}. {provider} принимает до {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} не может публиковать изображения и видео в одном сообщении.',
  'validation.media_unavailable.message':
    'Прикреплённый файл больше недоступен. Удалите его из публикации или загрузите заново.',
  'validation.alt_text_missing.message':
    'На {count, plural, one {# изображения} few {# изображения} many {# изображения} other {# изображения}} отсутствует альтернативный текст.',
  'validation.alt_text_missing.hint': 'Опишите изображение или отметьте его как декоративное.',
  'validation.thumbnail_unsupported.message':
    '{provider} не принимает здесь пользовательскую миниатюру.',
  'validation.destination_required.message': 'Выберите, где это будет опубликовано на {provider}.',
  'validation.destination_unsupported.message':
    '{destination} не принимает сообщения этого типа на {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# упоминание не сопоставлено с реальным аккаунтом} few {# упоминание не сопоставлено с реальными аккаунтами} many {# упоминание не сопоставлено с реальными аккаунтами} other {# упоминание не сопоставлено с реальными аккаунтами}}.',
  'validation.mention_unresolved.hint':
    'Выберите аккаунт из результатов поиска или удалите упоминание. Обычный текст никогда не публикуется как собственный тег.',
  'validation.hashtag_count_exceeded.message':
    'Хэштеги {count}. {provider} считает спамом больше, чем {limit}.',
  'validation.link_not_allowed.message': '{provider} не разрешает ссылки в этом поле.',
  'validation.link_destination_unverified.message':
    'Домен ссылки {domain} не проверен для этой рабочей области.',
  'validation.privacy_setting_required.message':
    '{provider} требует явного выбора конфиденциальности перед публикацией.',
  'validation.privacy_setting_required.hint':
    'По умолчанию нет. Выберите, кто сможет видеть эту публикацию.',
  'validation.disclosure_required.message':
    'Этот пост требует раскрытия информации в соответствии с правилами проекта {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} не поддерживает запланированный первый комментарий для этой учетной записи.',
  'validation.thread_unsupported.message':
    '{provider} не поддерживает темы для этой учетной записи.',
  'validation.repeat_end_required.message':
    'Для повторяющегося сообщения должна быть указана дата окончания или количество повторов.',
  'validation.schedule_in_past.message': 'Это время прошло в {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'Публикации можно планировать не более чем на {limit} вперёд; столько же хранятся загруженные файлы.',
  'validation.schedule_outside_quiet_hours.message':
    'Это соответствует тихим часам, установленным для {project}.',
  'validation.duplicate_within_window.message':
    'Очень похожий контент уже запланирован или опубликован для {account} в {window}.',
  'validation.blocked_term_present.message': 'Текст содержит заблокированный термин для {project}.',
  'validation.unsupported_claim.message':
    'Эта претензия не входит в число одобренных претензий для {project}.',
  'validation.unsupported_claim.hint':
    'Добавьте его к утвержденным утверждениям с доказательствами или переформулируйте предложение.',
  'validation.cadence_exceeded.message':
    '{account} опубликует {count, plural, one {# раз} few {# раз} many {# раз} other {# раз}} в тот день, превысив лимит {limit}.',
  'validation.connection_paused.message': '{account} приостановлен и не будет публиковаться.',
  'validation.account_type_invalid.message':
    '{account}, это не тот тип учетной записи, который {provider} требует для этого типа сообщений.',

  'validation.severity.error': 'Необходимо исправить',
  'validation.severity.warning': 'Проверьте это',
  'validation.severity.info': 'Для вашей информации',
  'validation.field.required': 'Это поле является обязательным.',
  'validation.field.tooShort':
    'Используйте не менее {min, plural, one {# символов} few {# символов} many {# символов} other {# символов}}.',
  'validation.field.tooLong':
    'Используйте не более {max, plural, one {# символов} few {# символов} many {# символов} other {# символов}}.',
  'validation.field.invalidEmail': 'Введите действительный адрес электронной почты.',
  'validation.field.invalidUrl': 'Введите полный URL-адрес, включая https.',
  'validation.field.invalidDate': 'Введите действительную дату.',
  'validation.field.invalidTime': 'Введите допустимое время.',
  'validation.field.invalidNumber': 'Введите номер.',
  'validation.field.outOfRange': 'Введите значение между {min} и {max}.',
  'validation.field.mustMatch': 'Эти два значения должны совпадать.',
  'validation.field.alreadyTaken': 'Это уже используется.',
  'validation.field.unsafeValue': 'Это значение здесь недопустимо.',
} as const;
