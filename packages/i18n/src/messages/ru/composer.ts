/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Сочинить',
  'composer.titleWithProject': 'Напишите для {project}',
  'composer.master.label': 'Главный черновик',
  'composer.master.description':
    'Напишите один раз сюда. Совместимые изменения достигают каждой выбранной цели. Откройте цель, чтобы написать версию, которую получит только эта учетная запись.',
  'composer.master.globalEdit': 'Глобальное редактирование',
  'composer.master.placeholder': 'Что вы хотите опубликовать?',
  'composer.brief.label': 'Краткое описание',
  'composer.brief.placeholder': 'Опишите идею, аудиторию и желаемый результат.',
  'composer.sources.label': 'Ссылки на источники',
  'composer.sources.empty': 'Источники не прикреплены.',
  'composer.campaign.label': 'Кампания',
  'composer.campaign.none': 'Нет кампании',
  'composer.contentLocale.label': 'Язык контента',
  'composer.contentLocale.help': 'Язык поста. Это отдельный от вашего языка интерфейса.',
  'composer.market.label': 'Рынок аудитории',

  'composer.targets.title': 'Цели',
  'composer.targets.count':
    '{count, plural, =0 {Аккаунты не выбраны} one {# аккаунта} few {# аккаунта} many {# аккаунта} other {# аккаунта}}',
  'composer.targets.publishSummary':
    '{count, plural, one {Это будет опубликовано в # аккаунте} few {Это будет опубликовано в # аккаунтах} many {Это будет опубликовано в # аккаунтах} other {Это будет опубликовано в # аккаунтах}} {when, select, сейчас {now} запланировано {в запланированное время} other {}}',
  'composer.targets.add': 'Добавить аккаунты',
  'composer.targets.empty': 'Выберите хотя бы одну учетную запись для публикации.',
  'composer.targets.state.ready': 'Готово',
  'composer.targets.state.inherited': 'Унаследовано от мастера',
  'composer.targets.state.overridden': 'Переопределено',
  'composer.targets.state.warning': 'Проверьте перед публикацией',
  'composer.targets.state.error': 'Требуется исправление',
  'composer.targets.state.approvalNeeded': 'Требуется одобрение',
  'composer.targets.overrideBadge': 'Переопределить',
  'composer.targets.resetConfirm.title': 'Сбросить эту цель до основного черновика?',
  'composer.targets.resetConfirm.body':
    'Копия, носитель и настройки, которые вы изменили для {account}, будут заменены основным черновиком. Другие цели не затрагиваются.',
  'composer.targets.divergence':
    '{count, plural, one {# цель отличается от основного проекта} few {# цель отличается от основного проекта} many {# цель отличается от основного проекта} other {# цель отличается от основного проекта}}',

  'composer.applyToAll.title': 'Применить ко всем целям',
  'composer.applyToAll.compatible':
    '{count, plural, one {# поле совместимо с каждой выбранной целью} few {# поля совместимо с каждой выбранной целью} many {# поля совместимо с каждой выбранной целью} other {# поля совместимо с каждой выбранной целью}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# поле не может быть применено и остается для цели} few {# поля не может быть применено и остается для цели} many {# поля не может быть применено и остается для цели} other {# поля не может быть применено и остается для цели}}',
  'composer.applyToAll.creates': 'При применении создается явная версия для каждой цели.',

  'composer.editor.label': 'Текст публикации',
  'composer.editor.characterCount': '{used} из символов {limit}',
  'composer.editor.characterCountOver': 'Символов {over}, превышающих лимит символов {limit}.',
  'composer.editor.characterCountUnknown':
    'Ограничение на количество символов недоступно для этого аккаунта',
  'composer.editor.remaining':
    '{count, plural, one {осталось # символа} few {осталось # символа} many {осталось # символа} other {осталось # символа}}',
  'composer.editor.hashtagCount':
    '{count, plural, one {# хэштег} few {# хэштегов} many {# хэштегов} other {# хэштегов}}',
  'composer.editor.formatting': 'Форматирование',
  'composer.editor.emoji': 'Эмодзи',
  'composer.editor.mention': 'Упоминание',
  'composer.editor.link': 'Ссылка',

  'composer.mentions.search': 'Поиск людей, страниц и компаний',
  'composer.mentions.searching': 'Поиск {provider}',
  'composer.mentions.resolved': 'Помечено {label} на {provider}',
  'composer.mentions.unresolved':
    'Это упоминание еще не сопоставлено с учетной записью {provider}. Он будет публиковаться в виде обычного текста, пока вы не выберете результат.',
  'composer.mentions.noResults': 'На {provider} нет подходящих аккаунтов.',
  'composer.mentions.unsupported': 'Для этого аккаунта недоступна собственная пометка.',

  'composer.destination.label': 'Пункт назначения',
  'composer.destination.placeholder': 'Выберите, где это будет опубликовано',
  'composer.destination.community': 'Сообщество',
  'composer.destination.board': 'Совет',
  'composer.destination.group': 'Группа',
  'composer.destination.page': 'Страница',
  'composer.destination.organization': 'Организация',
  'composer.destination.channel': 'Канал',
  'composer.destination.refresh': 'Обновить направления',
  'composer.destination.lastRefreshed': 'Направления обновлены {relativeTime}',

  'composer.media.title': 'СМИ',
  'composer.media.count':
    '{count, plural, one {# файла} few {# файлов} many {# файлов} other {# файлов}}',
  'composer.media.dropHint': 'Перетащите файлы сюда или просмотрите свою библиотеку.',
  'composer.media.inheritFromMaster': 'Использование основного носителя',
  'composer.media.overridden': 'Эта цель использует свои собственные носители',
  'composer.media.altText.label': 'Альтернативный текст',
  'composer.media.altText.placeholder':
    'Опишите изображение для людей, использующих программу чтения с экрана.',
  'composer.media.altText.missing': 'Альтернативный текст отсутствует.',
  'composer.media.altText.waive': 'Этому изображению не нужен замещающий текст',
  'composer.media.altText.generate': 'Напишите альтернативный текст',
  'composer.media.crop': 'Обрезка',
  'composer.media.resize': 'Изменить размер',
  'composer.media.rotate': 'Поворот',
  'composer.media.compress': 'Сжать',
  'composer.media.convertFormat': 'Конвертировать формат',
  'composer.media.thumbnail': 'Миниатюра',
  'composer.media.aspectPreset': 'Предустановка платформы',
  'composer.media.original': 'Оригинал',
  'composer.media.originalPreserved': 'Исходный файл сохраняется. Изменения создают новую версию.',
  'composer.media.uploading': 'Загрузка {name}',
  'composer.media.processing': 'Подготовка {name}',
  'composer.media.rights.label': 'Права и согласие',
  'composer.media.rights.confirm':
    'У меня есть права на публикацию этого носителя, включая любых людей, музыку, логотипы и бренды в нем.',

  'composer.sequence.title': 'Комментарии и тема',
  'composer.sequence.root': 'Основной пост',
  'composer.sequence.item': 'Товар {position}',
  'composer.sequence.add': 'Добавить комментарий или элемент темы',
  'composer.sequence.delayLabel': 'Задержка после предыдущего пункта',
  'composer.sequence.delayImmediate': 'Немедленно',
  'composer.sequence.delayMinutes':
    '{count, plural, one {# минута} few {# минут} many {# минут} other {# минут}}',
  'composer.sequence.delayCustom': 'Пользовательская задержка',
  'composer.sequence.accountLabel': 'Опубликовать этот элемент как',
  'composer.sequence.unsupported':
    'Эта учетная запись не поддерживает запланированные последующие элементы.',

  'composer.repeat.title': 'Повторить',
  'composer.repeat.off': 'Не повторяйте',
  'composer.repeat.everyDays':
    '{count, plural, one {Каждый день} few {Каждые # дня} many {Каждые # дня} other {Каждые # дня}}',
  'composer.repeat.endLabel': 'Хватит повторять',
  'composer.repeat.endOnDate': 'На свидании',
  'composer.repeat.endAfterCount': 'После ряда постов',
  'composer.repeat.endRequired': 'Выберите дату окончания или количество повторов.',
  'composer.repeat.summary':
    'Повторяет {cadence} до {end}. Каждое событие получает свое одобрение и признание.',

  'composer.links.title': 'Ссылки',
  'composer.links.keepOriginal': 'Сохраните исходный URL-адрес',
  'composer.links.track': 'Заменить отслеживаемой короткой ссылкой',
  'composer.links.utm': 'UTM-параметры',
  'composer.links.domain': 'Связать домен',
  'composer.links.finalUrl': 'Это будет опубликовано как {url}.',
  'composer.links.frozenAtApproval':
    'Точный короткий URL-адрес и пункт назначения сохраняются в утвержденной версии.',

  'composer.signature.title': 'Подпись',
  'composer.signature.none': 'Нет подписи',
  'composer.signature.autoApplied':
    'Подпись {name} была добавлена автоматически. Вы можете изменить это.',

  'composer.set.title': 'Наборы',
  'composer.set.startFrom': 'Начать с набора',
  'composer.set.continueWithout': 'Продолжить без набора',
  'composer.set.applied': 'Применен Набор {name}. Этот черновик теперь независим от Набора.',

  'composer.validation.title': 'Валидация',
  'composer.validation.clean': 'Для выбранных целей проблем не обнаружено.',
  'composer.validation.issueCount':
    '{count, plural, one {# проблема} few {# проблем} many {# проблем} other {# проблем}} в {targets, plural, one {# цель} few {# цели} many {# цели} other {# цели}}',
  'composer.validation.blocking': 'Это необходимо исправить перед планированием.',
  'composer.validation.warning': 'Проверьте это перед публикацией.',
  'composer.validation.revalidated':
    'Перепроверено на соответствие текущим ограничениям платформы {relativeTime}.',

  'composer.preview.title': 'Предварительный просмотр',
  'composer.preview.forAccount': 'Предварительный просмотр {account} на {provider}',
  'composer.preview.approximate':
    'В этой предварительной версии используются записанные нами правила платформы. Опубликованный пост может отличаться в случае изменения платформы.',
  'composer.preview.unavailable':
    'Настоящая предварительная версия для этой учетной записи пока недоступна.',

  'composer.cost.title': 'Ориентировочная стоимость провайдера',
  'composer.cost.estimate': '{provider} оценивает {amount} использование API для этого сообщения.',
  'composer.cost.linkSurcharge':
    '{provider} взимает дополнительную плату за сообщения, содержащие URL-адрес. Удаление ссылки снижает оценку.',
  'composer.cost.bulkWarning':
    '{count, plural, one {# публикации} few {# публикации} many {# публикации} other {# публикации}} за одно действие. Прежде чем продолжить, просмотрите оценку.',
  'composer.cost.reconciled': 'Фактическое использование сверяется после публикации.',
  'composer.cost.none': 'Для этого сообщения не взимается плата за провайдера.',

  'composer.autosave.saving': 'Сохранение',
  'composer.autosave.saved': 'Сохранено {relativeTime}',
  'composer.autosave.offline':
    'Оффлайн. Ваш черновик сохранится на этом устройстве и будет синхронизирован.',
  'composer.autosave.conflict':
    '{name} редактировал этот черновик, пока вы писали. Просмотрите обе версии перед сохранением.',
  'composer.autosave.failed': 'Не удалось сохранить. Ваш текст все еще здесь. Повторная попытка.',

  'composer.ai.title': 'Помощь',
  'composer.ai.makeConcise': 'Сделайте более кратким',
  'composer.ai.adaptForPlatform': 'Адаптироваться для {provider}',
  'composer.ai.transcreate': 'Пересоздать в {language}',
  'composer.ai.checkClaims': 'Проверить претензии',
  'composer.ai.writeAltText': 'Напишите альтернативный текст',
  'composer.ai.suggestHooks': 'Предложить крючки',
  'composer.ai.suggestCta': 'Предложите призыв к действию',
  'composer.ai.diffTitle': 'Предлагаемое изменение',
  'composer.ai.diffHelp': 'Ничего не изменится, пока вы это не примете.',
  'composer.ai.working': 'Работаю над этим',
  'composer.ai.sources':
    'На основе {count, plural, one {# источника} few {# источника} many {# источника} other {# источника}}, который вы одобрили',
  'composer.ai.uncertain':
    'Эта фраза не имеет чистого эквивалента в {language}. Перед публикацией просмотрите его с носителем языка.',

  'composer.schedule.title': 'Расписание',
  'composer.schedule.dateLabel': 'Дата',
  'composer.schedule.timeLabel': 'Время',
  'composer.schedule.timeZoneLabel': 'Часовой пояс',
  'composer.schedule.nextFreeSlot': 'Следующий свободный слот',
  'composer.schedule.localAndUtc': '{local} в {timeZone}. {utc} UTC.',
  'composer.schedule.dstWarning':
    'В этот день часы перейдут на {timeZone}. Этот пост работает по адресу {local}, то есть {utc} UTC.',
  'composer.schedule.pastWarning': 'Это время прошло. Выберите более позднее время.',
  'composer.schedule.confirmTitle': 'Подтвердите перед планированием',
  'composer.schedule.confirmPublishNow': 'Подтвердите перед публикацией сейчас',
  'composer.schedule.approverLabel': 'утверждающий',
  'composer.schedule.policyLabel': 'Политика одобрения',
  'composer.schedule.duplicateWarning':
    'Аналогичный контент был опубликован для {account} {relativeTime}. Повторная публикация может нарушить правила платформы в отношении дублированного контента.',
  'composer.schedule.cadenceWarning':
    'На этот день у {account} уже запланировано {count, plural, one {# сообщений} few {# сообщений} many {# сообщений} other {# сообщений}}.',
} as const;
