/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Чернетка',
  'state.draft.description':
    'Його можуть бачити лише люди в цій робочій області. Нічого не заплановано.',
  'state.validation_needed.label': 'Потрібна перевірка',
  'state.validation_needed.description':
    'Одна або кілька цілей мають проблему, яку потрібно вирішити, перш ніж це можна буде запланувати.',
  'state.approval_requested.label': 'Запит на схвалення',
  'state.approval_requested.description': 'Очікування {approver} вирішувати.',
  'state.approved.label': 'Затверджено',
  'state.approved.description':
    'Затверджено {approver}. Тепер його можна запланувати або опублікувати.',
  'state.scheduled.label': 'За розкладом',
  'state.scheduled.description': 'Публікує {time} в {timeZone}.',
  'state.preparing_media.label': 'Підготовка медіа',
  'state.preparing_media.description': 'Завантаження та конвертація файлів для платформи.',
  'state.dispatching.label': 'Диспетчеризація',
  'state.dispatching.description': 'Надсилання до {provider} тепер.',
  'state.provider_processing.label': 'Обробка провайдера',
  'state.provider_processing.description':
    '{provider}прийняв завантаження та все ще обробляє його. Ми підтверджуємо, коли це буде в прямому ефірі.',
  'state.published.label': 'Опубліковано',
  'state.published.description': 'Живіть далі {provider} сьогодні {time}.',
  'state.partially_published.label': 'Опубліковано частково',
  'state.partially_published.description':
    '{published, plural, one {#мета опублікована} few {# цілі опубліковані} many {# цілі опубліковані} other {# цілі опубліковані}}, {failed, plural, one {# не відвід} few {# не відвід} many {# не відвід} other {# не відвід}}. Опубліковані пости діяти і не були відкочені.',
  'state.action_required.label': 'Потрібна дія',
  'state.action_required.description': 'Це не може тривати, поки ви щось не зробите.',
  'state.retry_scheduled.label': 'Повторна спроба запланована',
  'state.retry_scheduled.description':
    'Спроба {attempt} з {max} буде працювати на {time}. Нічого не дублюється.',
  'state.failed_permanently.label': 'Не вдалося',
  'state.failed_permanently.description':
    'Це не буде повторено. Ваш вміст збережено, а причина вказана на квитанції.',
  'state.canceled.label': 'Скасовано',
  'state.canceled.description': 'Скасовано {actor} на {date}. Нічого не було опубліковано.',
  'state.deleted_externally.label': 'Видалено на платформі',
  'state.deleted_externally.description':
    'Ця публікація більше не актуальна {provider}. Квітанція та метрики, зібрані до її відправлення, зберігаються.',

  'state.approval.not_required.label': 'Схвалення не потрібне',
  'state.approval.not_required.description': 'Політика щодо цих цілей не потребує затвердження.',
  'state.approval.requested.label': 'Просив',
  'state.approval.requested.description': 'Надіслано до {approver} {relativeTime}.',
  'state.approval.in_review.label': 'В огляді',
  'state.approval.in_review.description': '{approver}дивиться на це зараз.',
  'state.approval.approved.label': 'Затверджено',
  'state.approval.approved.description': 'Затверджено {approver} на {date}.',
  'state.approval.changes_requested.label': 'Запитані зміни',
  'state.approval.changes_requested.description': '{approver}попросив внести зміни на {date}.',
  'state.approval.rejected.label': 'Відхилено',
  'state.approval.rejected.description': 'Відхилено {approver} на {date}.',
  'state.approval.expired.label': 'Термін дії минув',
  'state.approval.expired.description': 'Термін дії цього запиту минув {date} без рішення.',
  'state.approval.withdrawn.label': 'Вилучено',
  'state.approval.withdrawn.description': 'Автор відкликав цей запит на {date}.',

  'state.summary.targets':
    '{ready, plural, one {#ціль готова} few {# мішені готові} many {# мішені готові} other {# мішені готові}}, {blocked, plural, =0 {жеден не заблокований} one {# заблоковано} few {# заблоковано} many {# заблоковано} other {# заблоковано}}',
  'state.changedAt': 'Змінено{relativeTime}',
} as const;
