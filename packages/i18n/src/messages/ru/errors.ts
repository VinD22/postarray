/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'Что-то пошло не так, и мы не смогли это классифицировать.',
  'error.unknown.action': 'Попробуйте еще раз. Если это продолжится, отправьте нам ссылку ниже.',
  'error.internal.message': 'Это проблема с нашей стороны, а не с вашим контентом.',
  'error.internal.action':
    'Ваша работа сохранена. Мы были предупреждены. Повторите попытку через несколько минут.',
  'error.not_implemented.message': 'Relay еще не создал это.',
  'error.not_implemented.action': 'Следите за журналом изменений, чтобы узнать, когда он выйдет.',
  'error.offline.message': 'Вы не в сети.',
  'error.offline.action':
    'Ваш черновик хранится на этом устройстве. Публикация и планирование возобновляются после восстановления соединения.',
  'error.network_unreachable.message': 'Мы не смогли связаться с сервером.',
  'error.network_unreachable.action':
    'Проверьте подключение и повторите попытку. Ничего не потерялось.',
  'error.request_invalid.message': 'Запрос был не в той форме, которую мы можем принять.',
  'error.request_invalid.action': 'Проверьте поля, перечисленные ниже, и отправьте его еще раз.',
  'error.validation_failed.message':
    'Некоторые поля необходимо изменить, прежде чем их можно будет сохранить.',
  'error.validation_failed.action': 'Исправьте выделенные поля.',
  'error.unauthenticated.message': 'Чтобы сделать это, вам необходимо войти в систему.',
  'error.unauthenticated.action': 'Войдите, и мы вернем вас сюда.',
  'error.session_expired.message': 'Срок действия вашей сессии истек.',
  'error.session_expired.action': 'Войдите снова. Ваш черновик сохранен.',
  'error.mfa_required.message': 'Это действие требует двухфакторного подтверждения.',
  'error.mfa_required.action':
    'Подтвердите действие с помощью приложения для аутентификации, чтобы продолжить.',
  'error.forbidden.message': 'Ваша роль не позволяет выполнить это действие.',
  'error.forbidden.action':
    'Попросите владельца или администратора этой рабочей области предоставить вам доступ.',
  'error.insufficient_scope.message': 'Эти учетные данные не имеют области действия {scope}.',
  'error.insufficient_scope.action':
    'Предоставьте эту область или используйте учетные данные, у которых она уже есть.',
  'error.workspace_not_found.message':
    'Это рабочее пространство не существует, или вы не являетесь его участником.',
  'error.workspace_not_found.action': 'Выберите рабочее пространство, к которому вы принадлежите.',
  'error.workspace_suspended.message': 'Эта рабочая область приостановлена.',
  'error.workspace_suspended.action':
    'Свяжитесь со службой поддержки, чтобы решить эту проблему. Ваши данные нетронуты.',
  'error.not_found.message': 'Этот предмет больше не существует.',
  'error.not_found.action': 'Возможно, оно было удалено. Вернитесь и обновите список.',
  'error.conflict.message': 'Кто-то другой изменил это, пока вы над этим работали.',
  'error.conflict.action': 'Просмотрите обе версии, затем сохраните их еще раз.',
  'error.idempotency_key_reused.message':
    'Этот ключ идемпотентности уже использовался для другого запроса.',
  'error.idempotency_key_reused.action':
    'Используйте новый ключ или повторите в точности исходный запрос.',
  'error.rate_limited.message': 'Слишком много запросов.',
  'error.rate_limited.action': 'Попробуйте еще раз после {time}.',
  'error.quota_exceeded.message': 'Это действие превышает лимит текущего периода.',
  'error.quota_exceeded.action': 'Предел сбрасывается {relativeTime}.',
  'error.payment_required.message': 'У этой рабочей области нет активной подписки.',
  'error.payment_required.action':
    'Запустите подписку, чтобы опубликовать снова. Ничего не удаляется.',
  'error.subscription_past_due.message': 'Последний платеж не прошел.',
  'error.subscription_past_due.action': 'Обновите способ оплаты на портале Polar.',
  'error.trial_expired.message': 'Суд завершился на {date}.',
  'error.trial_expired.action': 'Запустите подписку, чтобы продолжить публикацию.',
  'error.entitlement_missing.message': 'Это рабочее пространство не имеет доступа к этой функции.',
  'error.entitlement_missing.action':
    'Проверьте настройки выставления счетов или обратитесь в службу поддержки.',
  'error.channel_limit_reached.message':
    'В этом рабочем пространстве уже используются все активные каналы {limit}.',
  'error.channel_limit_reached.action': 'Отключите канал перед подключением другого.',
  'error.connection_not_found.message': 'Этого соединения больше нет в этой рабочей области.',
  'error.connection_not_found.action':
    'Подключите учетную запись еще раз, чтобы продолжить публикацию в ней.',
  'error.connection_revoked.message': '{account} отозвал доступ к {provider}.',
  'error.connection_revoked.action':
    'Переподключите учетную запись. После этого запланированные публикации возобновляются.',
  'error.connection_expired.message': 'Срок доступа для {account} истек.',
  'error.connection_expired.action':
    'Повторно подключите учетную запись, чтобы восстановить публикацию и аналитику.',
  'error.connection_paused.message': '{account} приостановлен.',
  'error.connection_paused.action': 'Возобновите его из Connections, когда будете готовы.',
  'error.connection_permission_missing.message':
    '{account} не предоставил необходимое для этого разрешение.',
  'error.connection_permission_missing.action':
    'Переподключитесь и примите {permission} на экране согласия.',
  'error.connection_account_type_invalid.message':
    'Instagram нужен профессиональный аккаунт. {account}, это личный аккаунт.',
  'error.connection_account_type_invalid.action':
    'Переключите его на бизнес-аккаунт или аккаунт создателя в приложении Instagram, а затем повторно подключитесь.',
  'error.connection_review_pending.message':
    '{provider} все еще рассматривает это приложение для {account}.',
  'error.connection_review_pending.action':
    'Посты публикуются приватно до прохождения проверки. Мы обновляем эту страницу, когда она меняется.',
  'error.capability_unsupported.message':
    '{provider} не предлагает этого через свой официальный API.',
  'error.capability_unsupported.action': 'Используйте формат, поддерживаемый этой учетной записью.',
  'error.capability_not_implemented.message': 'Relay еще не создал это для {provider}.',
  'error.capability_not_implemented.action':
    'На странице возможностей указано, что сегодня может делать каждый соединитель.',
  'error.capability_requires_review.message':
    '{provider} предоставляет это только после проверки приложения или учетной записи.',
  'error.capability_requires_review.action':
    'Он останется недоступным до тех пор, пока не пройдет проверка.',
  'error.content_invalid.message': '{provider} не принимает этот контент для {account}.',
  'error.content_invalid.action': 'Проблемы перечислены в цели. Исправьте их и повторите попытку.',
  'error.content_changed_after_approval.message':
    'Это сообщение было изменено после того, как оно было одобрено.',
  'error.content_changed_after_approval.action':
    'Запросите одобрение еще раз, прежде чем его можно будет опубликовать.',
  'error.duplicate_content.message':
    'Очень похожий контент был опубликован для {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Измените текст или опубликуйте его позже. Платформы ограничивают дублирование публикаций.',
  'error.cadence_limit_reached.message':
    '{account} достиг частоты публикаций, установленной для этой рабочей области.',
  'error.cadence_limit_reached.action':
    'Запланируйте это на более поздний интервал или увеличьте предел частоты вращения педалей.',
  'error.media_invalid.message': 'Этот файл нельзя опубликовать в {provider}.',
  'error.media_invalid.action': 'Точный лимит указан рядом с файлом.',
  'error.media_too_large.message': 'Этот файл больше, чем принимает {provider}.',
  'error.media_too_large.action':
    'Сожмите его или загрузите уменьшенную версию. Оригинал сохраняется.',
  'error.media_processing_failed.message': 'Нам не удалось подготовить этот файл для {provider}.',
  'error.media_processing_failed.action':
    'Попробуйте загрузить его еще раз или используйте другой формат.',
  'error.media_rights_undeclared.message': 'У этого СМИ нет декларации о правах.',
  'error.media_rights_undeclared.action':
    'Подтвердите, что у вас есть права на его публикацию, включая всех участников.',
  'error.alt_text_required.message': 'Этому изображению нужен замещающий текст для {provider}.',
  'error.alt_text_required.action': 'Опишите изображение или отметьте его как декоративное.',
  'error.approval_required.message':
    'Это рабочее пространство требует одобрения перед публикацией.',
  'error.approval_required.action': 'Запросите одобрение у {approver}.',
  'error.approval_expired.message': 'Срок действия этого поста истек {date}.',
  'error.approval_expired.action': 'Запросите одобрение еще раз.',
  'error.schedule_in_past.message': 'В {timeZone} это время уже прошло.',
  'error.schedule_in_past.action': 'Выберите более позднее время или опубликуйте сейчас.',
  'error.schedule_conflict.message': 'На этот раз у {account} уже есть сообщение в {duration}.',
  'error.schedule_conflict.action':
    'Переместите один из них или продолжайте, если такое расстояние предусмотрено.',
  'error.time_zone_invalid.message': 'Мы не распознаем часовой пояс {timeZone}.',
  'error.time_zone_invalid.action': 'Выберите зону из списка.',
  'error.destination_unavailable.message':
    'Пункт назначения {destination} больше не доступен на {provider}.',
  'error.destination_unavailable.action': 'Обновите список пунктов назначения и выберите другой.',
  'error.mention_unresolved.message': 'Упоминание не сопоставлено с реальным аккаунтом {provider}.',
  'error.mention_unresolved.action':
    'Найдите и выберите учетную запись или удалите упоминание. Мы никогда не публикуем поддельные нативные теги.',
  'error.provider_transient.message': '{provider} не удалось обработать это прямо сейчас.',
  'error.provider_transient.action': 'Мы повторим попытку автоматически. Ничего не дублируется.',
  'error.provider_permanent.message': '{provider} отклонил это и не примет повторную попытку.',
  'error.provider_permanent.action': 'Обработанный ответ находится в квитанции.',
  'error.provider_rate_limited.message':
    'Скорость {provider} ограничивает это рабочее пространство.',
  'error.provider_rate_limited.action': 'Мы повторим попытку после {time}.',
  'error.provider_unavailable.message': '{provider} не отвечает.',
  'error.provider_unavailable.action':
    'Проверьте страницу статуса. Запланированные публикации продолжают повторяться.',
  'error.provider_content_rejected.message':
    '{provider} отклонил этот контент в соответствии со своими правилами.',
  'error.provider_content_rejected.action':
    'Причина указана в квитанции. Отредактируйте контент или подайте апелляцию с помощью {provider}.',
  'error.user_action_required.message':
    '{account} нужно что-то от вас, прежде чем он сможет опубликовать.',
  'error.user_action_required.action': 'Откройте соединение, чтобы увидеть, чего не хватает.',
  'error.short_link_destination_blocked.message': 'Этот пункт назначения не может быть сокращен.',
  'error.short_link_destination_blocked.action':
    'Частные сети, небезопасные схемы и известные злоупотребления направлениями блокируются.',
  'error.short_link_domain_unverified.message': 'Домен {domain} еще не подтвержден.',
  'error.short_link_domain_unverified.action':
    'Добавьте запись DNS, показанную в настройках, затем подтвердите.',
  'error.rss_feed_invalid.message': 'Этот URL-адрес не вернул действительный канал RSS или Atom.',
  'error.rss_feed_invalid.action':
    'Проверьте адрес. Мы получаем его безопасно и не следуем частным перенаправлениям.',
  'error.webhook_signature_invalid.message': 'Подпись на этом веб-перехватчике не прошла проверку.',
  'error.webhook_signature_invalid.action':
    'Убедитесь, что отправитель использует текущий секрет подписи. Полезная нагрузка не была обработана.',
  'error.webhook_delivery_failed.message': 'Доставка на адрес {endpoint} не удалась.',
  'error.webhook_delivery_failed.action':
    'Мы повторяем попытку с отсрочкой. В журнале доставки есть ответ.',
  'error.automation_rule_not_permitted.message':
    'Это правило нарушает правила платформы, поэтому его нельзя создать.',
  'error.automation_rule_not_permitted.action':
    'Автоматические лайки, подписки, нежелательные ответы и дублированные массовые публикации никогда не доступны.',
  'error.ai_unavailable.message': 'Помощник по написанию сейчас недоступен.',
  'error.ai_unavailable.action': 'Ваш текст нетронут. Повторите попытку через некоторое время.',
  'error.ai_output_invalid.message': 'Помощник вернул что-то, что мы не смогли проверить.',
  'error.ai_output_invalid.action':
    'К вашему черновику ничего не было применено. Попробуйте еще раз.',
  'error.ai_budget_exceeded.message':
    'На данный момент это рабочее пространство достигло предела своего помощника.',
  'error.ai_budget_exceeded.action':
    'Предел сбрасывается {relativeTime}. Написание от руки все еще работает.',
  'error.storage_unavailable.message': 'Нам не удалось добраться до хранилища мультимедиа.',
  'error.storage_unavailable.action':
    'Ваш текст сохранен. Попробуйте загрузить еще раз через минуту.',
  'error.export_unavailable.message': 'Этот экспорт не мог быть произведен.',
  'error.export_unavailable.action':
    'Попробуйте меньший диапазон или обратитесь в службу поддержки, предоставив ссылку.',

  'error.reference': 'Ссылка {correlationId}',
  'error.reportToSupport': 'Отправьте это в поддержку',
  'error.contentPreserved': 'Ваш контент сохраняется. Ничего не было опубликовано.',
} as const;
