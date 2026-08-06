/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
  'composerWeb.pane.targets': 'Целевые аккаунты и наборы',
  'composerWeb.pane.master': 'Главный черновик и общие настройки',
  'composerWeb.pane.variant': 'Версия для открытой цели',
  'composerWeb.pane.review': 'Предварительный просмотр, проверка, стоимость и утверждение',
  'composerWeb.pane.showPreview': 'Показать предварительный просмотр',
  'composerWeb.pane.hidePreview': 'Скрыть предварительный просмотр',
  'composerWeb.pane.previewCollapsed':
    'Панель предварительного просмотра скрыта. Откройте его, чтобы проверить последний пост.',

  'composerWeb.step.targets': 'Цели',
  'composerWeb.step.write': 'Написать',
  'composerWeb.step.perTarget': 'По цели',
  'composerWeb.step.review': 'Обзор',
  'composerWeb.step.progress': 'Шаг {current} из {total}',
  'composerWeb.step.legend': 'Composer шагов',

  'composerWeb.summary.label': 'Черновое резюме',
  'composerWeb.summary.targets':
    '{count, plural, =0 {Целей нет} one {# цели} few {# целей} many {# целей} other {# целей}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {Нет проблем} one {# проблем} few {# проблем} many {# проблем} other {# проблем}}',
  'composerWeb.summary.notScheduled': 'Время не выбрано',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Стоимость пока не указана',
  'composerWeb.summary.openReview': 'Открыть обзор',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Главный черновик',
  'composerWeb.rail.masterHint':
    'Отредактируйте здесь, чтобы достичь каждой цели, которая все еще наследуется.',
  'composerWeb.rail.accountsHeading': 'Целевые аккаунты',
  'composerWeb.rail.setsHeading': 'Наборы и группы',
  'composerWeb.rail.setsHelp':
    'Набор, это сохраненная группа учетных записей и настроек по умолчанию. При применении одного из них копируются его значения в этот черновик. Более поздние изменения в Наборе не меняют этот черновик.',
  'composerWeb.rail.openTarget': 'Откройте версию для {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Лимит неизвестен',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {нет медиафайлов} one {#медиафайл} few {#медиафайлов} many {#медиафайлов} other {#медиафайлов}}',
  'composerWeb.rail.paused': 'Пауза. Он не будет опубликован, пока вы не возобновите его.',
  'composerWeb.rail.state.notBuilt': 'Еще не построен',
  'composerWeb.rail.state.unsupported': 'Провайдер не поддерживает',
  'composerWeb.rail.empty': 'Аккаунты пока не выбраны.',
  'composerWeb.rail.emptyHelp':
    'Выберите аккаунты, на которые должен попасть этот пост. Вы можете добавить больше позже.',
  'composerWeb.rail.divergenceHint':
    'Откройте цель, чтобы увидеть ее собственную версию. Основной проект не изменяется.',
  'composerWeb.rail.searchLabel': 'Фильтровать аккаунты',
  'composerWeb.rail.removeTarget': 'Удалить {account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Глобальное редактирование',
  'composerWeb.globalEdit.title': 'Примените это изменение к каждой выбранной цели',
  'composerWeb.globalEdit.description':
    'Главный проект всегда меняется. Цели, которые все еще наследуют это поле, следуют за ним. Цели со своей версией сохраняют ее.',
  'composerWeb.globalEdit.fieldLabel': 'Поле',
  'composerWeb.globalEdit.compatibleHeading': 'Эти цели вносят изменения',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Эти цели сохраняют свою собственную версию',
  'composerWeb.globalEdit.incompatibleHeading': 'Эти цели не могут принять изменения',
  'composerWeb.globalEdit.incompatibleHelp':
    'Ничто не падает без вашего ведома. Каждая учетная запись ниже получает явную версию с адаптированными изменениями, которую вы можете впоследствии отредактировать.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} позволяет использовать символы {limit}. Этот текст {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} не принимает ссылку в этом поле. Ссылка остается в основном черновике и в тех целях, которые это позволяют.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} принимает {limit, plural, one {# файла} few {# файлов} many {# файлов} other {# файлов}}. Этот проект имеет {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported': '{account} не принимает файлы {mimeType}.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} не поддерживает последующие элементы, поэтому последовательность остается в основном черновике.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} публикует простой текст. Знаки форматирования будут отображаться в виде символов.',
  'composerWeb.globalEdit.adaptedPreview': 'Что вместо этого получает {account}',
  'composerWeb.globalEdit.confirm': 'Применить и создать версии',
  'composerWeb.globalEdit.nothingToApply':
    'Ничего не меняется. В основном проекте уже есть это значение.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Изменение применено к # цели} few {Изменение применено к # цели} many {Изменение применено к # цели} other {Изменение применено к # цели}}. {adapted, plural, =0 {Ни одна цель не нуждается в адаптированной версии} one {# цель получила адаптированную версию} few {# цели получили адаптированные версии} many {# цели получили адаптированные версии} other {# цели получили адаптированные версии}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'У этой цели есть своя версия',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# поле отличается от основного черновика} few {# поля отличается от основного черновика} many {# поля отличается от основного черновика} other {# поля отличается от основного черновика}}',
  'composerWeb.override.field.body': 'Текст публикации',
  'composerWeb.override.field.contentKind': 'Тип сообщения',
  'composerWeb.override.field.locale': 'Язык контента',
  'composerWeb.override.field.mediaIds': 'СМИ',
  'composerWeb.override.field.links': 'Ссылки',
  'composerWeb.override.field.signature': 'Подпись',
  'composerWeb.override.field.threadItems': 'Комментарии и тема',
  'composerWeb.override.field.schedule': 'Расписание',
  'composerWeb.override.resetField': 'Сбросьте {field} на главный',
  'composerWeb.override.resetFieldTitle': 'Сбросить {field} для {account}?',
  'composerWeb.override.resetFieldBody':
    'Версия {field}, написанная для {account}, отбрасывается, и снова используется основной черновик. Других целевых изменений нет.',
  'composerWeb.override.resetAll': 'Сбросить каждое поле для основного',
  'composerWeb.override.inheritNotice':
    'Эта цель соответствует основному проекту. Редактирование чего-либо здесь создает версию, которую получает только {account}.',
  'composerWeb.override.created': 'У {account} теперь есть собственный {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Лимиты для {account}',
  'composerWeb.limits.text': 'Текст длиной до символов {limit}.',
  'composerWeb.limits.linkCost':
    'Ссылка считается {count, plural, one {# символа} few {# символов} many {# символов} other {# символов}} независимо от ее длины.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Нет изображений} one {# изображения} few {до # изображений} many {до # изображений} other {до # изображений}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {Нет видео} one {# видео} few {до # видео} many {до # видео} other {до # видео}}',
  'composerWeb.limits.duration': 'Видео до {duration}',
  'composerWeb.limits.aspect': 'Соотношение сторон между {min} и {max}',
  'composerWeb.limits.fileSize': 'Файлы до {size}',
  'composerWeb.limits.mimeTypes': 'Принимаемые типы файлов: {types}.',
  'composerWeb.limits.source': 'В снимке возможностей {version} прочитайте {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'Требуется миниатюра.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': 'Настройки {provider}',
  'composerWeb.native.privacy': 'Кто может это увидеть',
  'composerWeb.native.privacyChoose': 'Выберите аудиторию',
  'composerWeb.native.privacyExplicit':
    '{provider} не допускает предварительно выбранную аудиторию. Выберите один, прежде чем это можно будет запланировать.',
  'composerWeb.native.community': 'Сообщество',
  'composerWeb.native.board': 'Совет',
  'composerWeb.native.group': 'Группа или Страница',
  'composerWeb.native.organization': 'Организация',
  'composerWeb.native.channel': 'Канал',
  'composerWeb.native.publication': 'Публикация',
  'composerWeb.native.disclosureHeading': 'Раскрытие информации',
  'composerWeb.native.disclosureCommercial': 'Этот пост рекламирует продукт или услугу',
  'composerWeb.native.disclosureBranded': 'Этот пост является фирменным контентом другой компании.',
  'composerWeb.native.disclosureAi':
    'Часть этого контента была создана с помощью инструмента искусственного интеллекта.',
  'composerWeb.native.disclosureUnsupported':
    '{provider} не предлагает раскрытие информации через свой API. Вместо этого добавьте его в текст.',
  'composerWeb.native.none': 'К этому типу сообщений не применяются настройки {provider}.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Решено на {provider}',
  'composerWeb.entity.resolvedId': 'Идентификатор аккаунта {externalId}',
  'composerWeb.entity.plainTextWarning':
    'Не совпадает. Он будет опубликован в виде обычного текста, который не является собственным тегом {provider}.',
  'composerWeb.entity.removeMention': 'Удалить упоминание {label}.',
  'composerWeb.entity.addMention': 'Добавить упоминание',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Нет упоминаний} one {# упоминаний} few {# упоминаний} many {# упоминаний} other {# упоминаний}}, {resolved} соответствует реальному аккаунту',
  'composerWeb.entity.lookupUnsupported':
    '{provider} не предлагает поиск объектов для этого типа учетной записи.',
  'composerWeb.entity.lookupNotBuilt':
    'Relay еще не создал поиск объектов для {provider}. Пока ничего не предполагается.',
  'composerWeb.entity.searchHint': 'Введите не менее двух символов, затем выберите результат.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {Нет совпадений} one {# совпадений} few {# совпадений} many {# совпадений} other {# совпадений}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Ссылки',
  'composerWeb.links.detected':
    '{count, plural, one {# ссылка найдена в этом черновике} few {# ссылка найдена в этом черновике} many {# ссылка найдена в этом черновике} other {# ссылка найдена в этом черновике}}',
  'composerWeb.links.noneDetected': 'В этом проекте пока нет ссылок.',
  'composerWeb.links.modeLabel': 'Как публикуется эта ссылка',
  'composerWeb.links.original': 'Исходный URL-адрес',
  'composerWeb.links.utmSource': 'Источник',
  'composerWeb.links.utmMedium': 'Средний',
  'composerWeb.links.utmCampaign': 'Кампания',
  'composerWeb.links.utmTerm': 'Срок',
  'composerWeb.links.utmContent': 'Содержание',
  'composerWeb.links.domainVerified': '{domain}, проверено для этой рабочей области.',
  'composerWeb.links.domainDefault': 'Relay домен по умолчанию',
  'composerWeb.links.domainNone': 'Ни один фирменный домен еще не подтвержден.',
  'composerWeb.links.notAllowedHere': '{account} не разрешает ссылку здесь.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Комментарий',
  'composerWeb.sequence.kindThread': 'Часть резьбы',
  'composerWeb.sequence.kindLabel': 'Тип элемента',
  'composerWeb.sequence.moveUp': 'Переместить этот элемент раньше',
  'composerWeb.sequence.moveDown': 'Переместить этот объект позже',
  'composerWeb.sequence.remove': 'Удалить этот элемент',
  'composerWeb.sequence.absoluteTime': 'Запускается по адресу {time}, то есть {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'В случае сбоя элемента уже опубликованное сообщение остается опубликованным, а элементы после него не запускаются. Вы получаете предмет действия.',
  'composerWeb.sequence.maxReached':
    '{account} принимает {limit, plural, one {# следующего элемента} few {# следующего элемента} many {# следующего элемента} other {# следующего элемента}}.',
  'composerWeb.sequence.minDelay':
    'Самая короткая задержка, которую допускает {provider},, это {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Тот же аккаунт, что и сообщение',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Нет проблем} one {# проблем} few {# проблем} many {# проблем} other {# проблем}} по этому элементу',
  'composerWeb.sequence.customMinutes': 'Через несколько минут после предыдущего элемента',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Повторите этот пост',
  'composerWeb.repeat.cadenceLabel': 'Как часто',
  'composerWeb.repeat.maximum': 'Повторяющееся сообщение может повторяться не более {limit} раз.',
  'composerWeb.repeat.occurrenceLabel': 'Количество сообщений',
  'composerWeb.repeat.duplicateCheck':
    'Перед публикацией каждое вхождение проверяется на наличие дублированного контента. Происшествие, не прошедшее проверку, вместо публикации становится элементом действия.',
  'composerWeb.repeat.occurrenceList': 'Первые появления',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {и ещё # вхождений} few {и ещё # вхождений} many {и ещё # вхождений} other {и ещё # вхождений}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Наборы и подпись',
  'composerWeb.set.pickerTitle': 'Начать с набора',
  'composerWeb.set.pickerDescription':
    'Набор заполняет цели, текст и настройки. Создаваемый им черновик независим, поэтому последующее редактирование набора никогда не меняет утвержденную или запланированную публикацию.',
  'composerWeb.set.accountCount':
    '{count, plural, one {# аккаунта} few {# аккаунта} many {# аккаунта} other {# аккаунта}}',
  'composerWeb.set.apply': 'Используйте этот набор',
  'composerWeb.set.none': 'Наборы еще не сохранены.',
  'composerWeb.signature.pickerLabel': 'Подпись',
  'composerWeb.signature.scope': 'Для {brand} на {provider} в {language}',
  'composerWeb.signature.previewHeading': 'Чем заканчивается пост',
  'composerWeb.signature.notMatching':
    'Эта подпись привязана к другому бренду, платформе или языку, поэтому здесь она не предлагается.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Помогите с этим текстом',
  'composerWeb.assist.unavailableTitle': 'Текстовая помощь не настроена',
  'composerWeb.assist.unavailableBody':
    'Для этой рабочей области не настроен шлюз AI, поэтому вспомогательные действия отключены. Все остальное в композиторе работает нормально.',
  'composerWeb.assist.targetLabel': 'Применяется к',
  'composerWeb.assist.targetMaster': 'Основной проект',
  'composerWeb.assist.targetVariant': 'Версия для {account}',
  'composerWeb.assist.beforeLabel': 'Текущий текст',
  'composerWeb.assist.afterLabel': 'Предлагаемый текст',
  'composerWeb.assist.regionLabel': 'Предлагаемое изменение текста еще не применено.',
  'composerWeb.assist.added': 'добавлено',
  'composerWeb.assist.removed': 'удалено',
  'composerWeb.assist.evidence': 'Доказательства и источники',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Источник этого утверждения не найден. Проверьте это перед публикацией.',
  'composerWeb.assist.failed': 'Запрос на помощь не был выполнен. Ваш текст не изменился.',
  'composerWeb.assist.noMediaGeneration':
    'Relay не создает изображения или видео. Готовые файлы переносите в библиотеку и публикуйте здесь.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'Это утвержденная версия. При его редактировании создается новая версия и отменяется утверждение.',
  'composerWeb.autosave.pinnedAcknowledge': 'Изменить и отменить утверждение',
  'composerWeb.autosave.conflictTitle': 'Две версии этого проекта',
  'composerWeb.autosave.conflictKeepMine': 'Держите то, что я написал',
  'composerWeb.autosave.conflictKeepTheirs': 'Используйте версию от {name}',
  'composerWeb.autosave.conflictHelp':
    'Ничего не объединяется автоматически. Выберите для каждого поля, затем сохраните.',
  'composerWeb.autosave.retry': 'Попробуйте сохранить еще раз',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Composer ярлыки',
  'composerWeb.shortcuts.nextTarget': 'Следующая цель',
  'composerWeb.shortcuts.previousTarget': 'Предыдущая цель',
  'composerWeb.shortcuts.nextIssue': 'Следующий выпуск',
  'composerWeb.shortcuts.previousIssue': 'Предыдущий выпуск',
  'composerWeb.shortcuts.save': 'Сохранить черновик сейчас',
  'composerWeb.shortcuts.openSchedule': 'Откройте лист расписания',
  'composerWeb.shortcuts.open': 'Показать ярлыки',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'Обзор',
  'composerWeb.review.contentVersion': 'Версия контента {checksum}',
  'composerWeb.review.approvalPolicy': 'Политика: {policy}',
  'composerWeb.review.approverPending': 'Ждем решения от {approver}.',
  'composerWeb.review.approverNone': 'Для этих целей одобрение не требуется.',
  'composerWeb.review.perTargetHeading': 'Что получает каждый аккаунт',
  'composerWeb.review.finalUrl': 'Опубликованная ссылка',
  'composerWeb.review.privacyState': 'Аудитория: {value}',
  'composerWeb.review.disclosureState': 'Раскрытие информации: {value}',
  'composerWeb.review.disclosureNone': 'Раскрытие информации не установлено',
  'composerWeb.review.mediaVersion': '{name}, версия {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# цель пока не может быть запланирована} few {# цель пока не может быть запланирована} many {# цель пока не может быть запланирована} other {# цель пока не может быть запланирована}}',
  'composerWeb.review.offlineBlocked':
    'Планирование и публикация требуют связи. Ваш черновик будет в безопасности на этом устройстве.',
  'composerWeb.review.publishConfirm':
    'Это немедленно публикуется в {count, plural, one {# аккаунта} few {# аккаунта} many {# аккаунта} other {# аккаунта}}. Это нельзя отменить отсюда.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Новый проект',
  'composerWeb.page.loading': 'Загрузка проекта, его целей и их ограничений',
  'composerWeb.page.errorTitle': 'Этот черновик не удалось открыть',
  'composerWeb.page.errorBody':
    'Ничего не потерялось. Попробуйте еще раз, и если ошибка продолжится, ссылка ниже поможет службе поддержки найти запрос.',
  'composerWeb.page.noConnectionsTitle': 'Подключите учетную запись перед созданием',
  'composerWeb.page.noConnectionsBody':
    'Для черновика требуется хотя бы одна подключенная учетная запись, чтобы Relay знал ограничения, предварительный просмотр и настройки для отображения.',
  'composerWeb.page.noConnectionsExample':
    'Пример: при подключении X и LinkedIn один черновик становится двумя собственными версиями со своими счетчиками.',
  'composerWeb.page.permissionTitle': 'Вы не можете создавать публикации в этой рабочей области.',
  'composerWeb.page.permissionBody':
    'Для написания требуется должность редактора или выше. Владелец или администратор может изменить вашу роль.',
  'composerWeb.page.rateLimitTitle': 'Слишком много сохранений черновиков за короткое время',
  'composerWeb.page.rateLimitCause':
    'В этой рабочей области достигнут предел записи для текущего окна. При этом ваш текст сохраняется на этом устройстве.',
  'composerWeb.page.rateLimitAlternative':
    'Продолжайте писать. Сохранение возобновляется автоматически после перезагрузки окна.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Сетка',
  'mediaLib.view.list': 'Список',
  'mediaLib.view.label': 'Макет',
  'mediaLib.sort.label': 'Сортировать',
  'mediaLib.sort.newest': 'Сначала самые новые',
  'mediaLib.sort.name': 'Имя',
  'mediaLib.sort.size': 'Самый большой первый',
  'mediaLib.select': 'Выберите {name}.',
  'mediaLib.column.file': 'Файл',
  'mediaLib.column.type': 'Тип',
  'mediaLib.column.size': 'Размер',
  'mediaLib.column.altText': 'Альтернативный текст',
  'mediaLib.column.rights': 'Права',
  'mediaLib.column.added': 'Добавлено',
  'mediaLib.openDetail': 'Открыть {name}',

  'mediaLib.empty.title': 'Медиа пока нет',
  'mediaLib.empty.body':
    'Загрузите изображения и видео, которые у вас уже есть, или импортируйте файл по URL-адресу. Relay проверяет тип и размер каждой учетной записи, в которой вы публикуете.',
  'mediaLib.empty.example':
    'Пример: launch_hero.jpg, 1600 на 900, набор замещающего текста, использован в 2 постах.',
  'mediaLib.error.title': 'Не удалось загрузить библиотеку',
  'mediaLib.error.body': 'Ваши файлы в безопасности. Эта неудача ничего не изменила.',
  'mediaLib.loading': 'Загрузка вашей медиатеки',
  'mediaLib.permission.title': 'Вы не можете видеть эту библиотеку рабочей области.',
  'mediaLib.permission.body':
    'Для просмотра медиа требуется роль зрителя или выше в этом бренде. Владелец или администратор может предоставить его.',

  'mediaLib.upload.heading': 'Добавить медиа',
  'mediaLib.upload.browse': 'Выберите файлы',
  'mediaLib.upload.dropHint':
    'Перетащите файлы сюда или выберите их. Загрузка возобновляется, если соединение обрывается.',
  'mediaLib.upload.queueHeading': 'Загрузки',
  'mediaLib.upload.progress': '{name}, {percent} из {size} отправлено',
  'mediaLib.upload.paused': 'Пауза. {sent} из {size} уже сохранен.',
  'mediaLib.upload.resume': 'Возобновить загрузку',
  'mediaLib.upload.pause': 'Приостановить загрузку',
  'mediaLib.upload.cancel': 'Отменить эту загрузку',
  'mediaLib.upload.retry': 'Попробуйте загрузить еще раз',
  'mediaLib.upload.finalizing': 'Завершение {name}',
  'mediaLib.upload.done': '{name} в вашей библиотеке.',
  'mediaLib.upload.failed': '{name} не завершился. {reason}',
  'mediaLib.upload.offline':
    'Оффлайн. Загрузка продолжится с того места, где она была остановлена, при повторном подключении.',
  'mediaLib.upload.rejectedType':
    '{name}, это {mimeType}, который не принимает ни одна из выбранных вами учетных записей.',
  'mediaLib.upload.rejectedSize':
    '{name}, это {size}. Самый низкий лимит для ваших учетных записей, {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Принято # из ваших аккаунтов} few {Принято # из ваших аккаунтов} many {Принято # из ваших аккаунтов} other {Принято # из ваших аккаунтов}}',
  'mediaLib.upload.rejectedBy': 'Не принимается {accounts}',
  'mediaLib.upload.checkedAgainst': 'Проверено по аккаунтам, выбранным в этом проекте.',
  'mediaLib.upload.noTargets':
    'Никакие учетные записи не выбраны, поэтому файл проверяется только на соответствие значениям по умолчанию в рабочей области.',

  'mediaLib.alt.heading': 'Альтернативный текст',
  'mediaLib.alt.help':
    'Опишите, что важно в изображении для того, кто этого не видит. Обычно одного-двух предложений бывает достаточно.',
  'mediaLib.alt.count': '{used} из символов {limit}',
  'mediaLib.alt.requiredBy': 'Требуется {accounts}',
  'mediaLib.alt.waive': 'Это изображение не несет никакой информации',
  'mediaLib.alt.waiveReason': 'Почему не нуждается в описании',
  'mediaLib.alt.waiveHelp':
    'Используйте это только для украшения. Отклоненное изображение публикуется с пустым описанием, если платформа это позволяет.',
  'mediaLib.alt.waived': 'Отказано {name} на {date}. Причина: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} не принимает замещающий текст через свой API для этой учетной записи.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# файл не имеет замещающего текста} few {# файлов не имеет замещающего текста} many {# файлов не имеет замещающего текста} other {# файлов не имеет замещающего текста}}',

  'mediaLib.rights.heading': 'Права и согласие',
  'mediaLib.rights.declared': 'Заявлен {name} на {date}',
  'mediaLib.rights.undeclared': 'Еще не заявлено. Объявите об этом до публикации файла.',
  'mediaLib.rights.ownerLabel': 'Кому принадлежит этот файл',
  'mediaLib.rights.ownerSelf': 'Это рабочее пространство',
  'mediaLib.rights.ownerLicensed': 'Лицензия от кого-то другого',
  'mediaLib.rights.ownerUgc': 'Клиент или создатель дал разрешение',
  'mediaLib.rights.licenseLabel': 'Ссылка на лицензию или разрешение',
  'mediaLib.rights.peopleLabel': 'В этом файле появляются люди',
  'mediaLib.rights.peopleConsent': 'Все показанные согласились на публикацию',
  'mediaLib.rights.musicLabel': 'Этот файл содержит музыку или саундтрек',
  'mediaLib.rights.confirm':
    'У меня есть права на публикацию этого файла, включая любых людей, музыку, логотипы и бренды в нем.',
  'mediaLib.rights.blocking': 'Этот файл нельзя запланировать, пока не будут объявлены права.',

  'mediaLib.editor.heading': 'Редактировать изображение',
  'mediaLib.editor.description':
    'Каждое редактирование сохраняется как новая версия. Исходный файл сохраняется и может быть восстановлен.',
  'mediaLib.editor.tab.crop': 'Обрезка',
  'mediaLib.editor.tab.transform': 'Изменение размера и поворот',
  'mediaLib.editor.tab.canvas': 'Холст',
  'mediaLib.editor.tab.output': 'Формат и размер',
  'mediaLib.editor.tab.thumbnail': 'Миниатюра',
  'mediaLib.editor.presetLabel': 'Предварительная настройка формата',
  'mediaLib.editor.presetFree': 'Бесплатно',
  'mediaLib.editor.presetFor': '{ratio}, используется {accounts}',
  'mediaLib.editor.cropX': 'Обрезать от начального края',
  'mediaLib.editor.cropY': 'Обрезать сверху',
  'mediaLib.editor.cropWidth': 'Ширина обрезки',
  'mediaLib.editor.cropHeight': 'Высота урожая',
  'mediaLib.editor.cropKeyboardHint':
    'Поле обрезки содержит числовые поля, поэтому оно полностью работает с клавиатуры.',
  'mediaLib.editor.widthLabel': 'Ширина в пикселях',
  'mediaLib.editor.heightLabel': 'Высота в пикселях',
  'mediaLib.editor.lockRatio': 'Сохранить текущее соотношение',
  'mediaLib.editor.rotateLabel': 'Вращение',
  'mediaLib.editor.rotateDegrees': '{degrees} градусов',
  'mediaLib.editor.flipHorizontal': 'Перевернуть по вертикальной оси',
  'mediaLib.editor.flipVertical': 'Перевернуть по горизонтальной оси',
  'mediaLib.editor.canvasColor': 'Цвет фона',
  'mediaLib.editor.canvasFit': 'Как картина сидит на холсте',
  'mediaLib.editor.canvasFitCover': 'Заполните холст и обрежьте переполнение',
  'mediaLib.editor.canvasFitContain': 'Подогнать всю картинку и дополнить остальное',
  'mediaLib.editor.formatLabel': 'Выходной формат',
  'mediaLib.editor.qualityLabel': 'Качество сжатия',
  'mediaLib.editor.qualityValue': '{value} из 100',
  'mediaLib.editor.estimatedSize': 'Предполагаемый выход {size} от {original}',
  'mediaLib.editor.estimatedSizeUnknown': 'Выходной размер известен только после обработки файла.',
  'mediaLib.editor.thumbnailHelp':
    'Выберите кадр или файл, используемый в качестве миниатюры видео, если платформа его принимает.',
  'mediaLib.editor.thumbnailFrame': 'Рамка на {time}',
  'mediaLib.editor.save': 'Сохранить как новую версию',
  'mediaLib.editor.saving': 'Сохраняем версию {version}',
  'mediaLib.editor.saved': 'Версия {version} сохранена. Оригинал все еще здесь.',
  'mediaLib.editor.discard': 'Отменить эти изменения',
  'mediaLib.editor.noChanges': 'Пока нет изменений для сохранения.',
  'mediaLib.editor.revalidate':
    'При сохранении этот файл перепроверяется для всех учетных записей в черновиках, которые его используют.',
  'mediaLib.editor.noGeneration':
    'Этот редактор изменяет загруженный вами файл. Он не создает новых образов.',

  'mediaLib.versions.heading': 'Версии',
  'mediaLib.versions.original': 'Исходная загрузка',
  'mediaLib.versions.current': 'Текущая версия',
  'mediaLib.versions.restore': 'Восстановить версию {version}',
  'mediaLib.versions.item': 'Версия {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'Откуда взялся этот файл',
  'mediaLib.provenance.sourceUrl': 'URL-адрес источника',
  'mediaLib.provenance.fetchedAt': 'Получено {date}.',
  'mediaLib.provenance.declaredAuthor': 'Заявленный автор',
  'mediaLib.provenance.declaredLicense': 'Заявленная лицензия',
  'mediaLib.provenance.contentCredentials': 'Учетные данные встроенного контента',
  'mediaLib.provenance.contentCredentialsNone':
    'Этот файл не содержит учетных данных встроенного контента. Это обычное явление и не означает, что что-то не так.',
  'mediaLib.provenance.unverified':
    'Эти сведения взяты из источника, а не из Relay. Проверьте их, прежде чем полагаться на них.',

  'mediaLib.picker.title': 'Выберите медиа',
  'mediaLib.picker.description': 'Файлы проверяются по учетным записям, выбранным в этом проекте.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Выберите файлы} one {Добавить # файл} few {Добавить # файлов} many {Добавить # файлов} other {Добавить # файлов}}',
  'mediaLib.picker.forMaster': 'Добавление к основному черновику',
  'mediaLib.picker.forVariant': 'Добавление в версию только для {account}',
} as const;
