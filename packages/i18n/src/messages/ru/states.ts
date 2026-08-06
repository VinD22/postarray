/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Черновик',
  'state.draft.description':
    'Его могут видеть только люди в этой рабочей области. Ничего не запланировано.',
  'state.validation_needed.label': 'Требуется проверка',
  'state.validation_needed.description':
    'У одной или нескольких целей есть проблема, которую необходимо устранить, прежде чем ее можно будет запланировать.',
  'state.approval_requested.label': 'Запрошено одобрение',
  'state.approval_requested.description': 'Ждем решения {approver}.',
  'state.approved.label': 'Утверждено',
  'state.approved.description':
    'Одобрено {approver}. Теперь его можно запланировать или опубликовать.',
  'state.scheduled.label': 'Запланировано',
  'state.scheduled.description': 'Публикует {time} в {timeZone}.',
  'state.preparing_media.label': 'Подготовка СМИ',
  'state.preparing_media.description': 'Загрузка и конвертация файлов для платформы.',
  'state.dispatching.label': 'Диспетчеризация',
  'state.dispatching.description': 'Отправляю на {provider} сейчас.',
  'state.provider_processing.label': 'Обработка поставщика',
  'state.provider_processing.description':
    '{provider} принял загрузку и все еще обрабатывает ее. Мы подтверждаем, когда он будет доступен.',
  'state.published.label': 'Опубликовано',
  'state.published.description': 'Прямой эфир на {provider} с момента {time}.',
  'state.partially_published.label': 'Частично опубликовано',
  'state.partially_published.description':
    '{published, plural, one {# опубликовано целевого объекта} few {# опубликовано # целевого объекта} many {# опубликовано # целевого объекта} other {# опубликовано # целевого объекта}}, {failed, plural, one {# не выполнено} few {# не выполнено} many {# не выполнено} other {# не выполнено}}. Опубликованные сообщения активны и не были отменены.',
  'state.action_required.label': 'Требуется действие',
  'state.action_required.description': 'Это не может продолжаться, пока вы что-нибудь не сделаете.',
  'state.retry_scheduled.label': 'Повтор запланирован',
  'state.retry_scheduled.description':
    'Попытка {attempt} для {max} будет выполнена по адресу {time}. Ничего не дублируется.',
  'state.failed_permanently.label': 'Не удалось',
  'state.failed_permanently.description':
    'Повторная попытка не будет выполнена. Ваш контент сохранен, а причина указана в квитанции.',
  'state.canceled.label': 'Отменено',
  'state.canceled.description': 'Отменено {actor} на {date}. Ничего не было опубликовано.',
  'state.deleted_externally.label': 'Удален на платформе',
  'state.deleted_externally.description':
    'Этого поста больше нет на {provider}. Квитанция и метрики, собранные до ее отправки, сохраняются.',

  'state.approval.not_required.label': 'Никакого одобрения не требуется',
  'state.approval.not_required.description':
    'Политика в отношении этих целей не требует утверждения.',
  'state.approval.requested.label': 'Запрошено',
  'state.approval.requested.description': 'Отправлено на {approver} {relativeTime}.',
  'state.approval.in_review.label': 'На рассмотрении',
  'state.approval.in_review.description': '{approver} сейчас смотрит на это.',
  'state.approval.approved.label': 'Утверждено',
  'state.approval.approved.description': 'Утверждено {approver} на {date}.',
  'state.approval.changes_requested.label': 'Запрошены изменения',
  'state.approval.changes_requested.description': '{approver} запросил изменения в {date}.',
  'state.approval.rejected.label': 'Отклонено',
  'state.approval.rejected.description': 'Отклонено {approver} на {date}.',
  'state.approval.expired.label': 'Срок действия истек',
  'state.approval.expired.description':
    'Срок действия этого запроса истек {date} без принятия решения.',
  'state.approval.withdrawn.label': 'снято',
  'state.approval.withdrawn.description': 'Автор отозвал этот запрос на {date}.',

  'state.summary.targets':
    '{ready, plural, one {# цель готова} few {# цели готовы} many {# цели готовы} other {# цели готовы}}, {blocked, plural, =0 {ничего не заблокировано} one {# заблокировано} few {# заблокировано} many {# заблокировано} other {# заблокировано}}',
  'state.changedAt': 'Изменен {relativeTime}',
} as const;
