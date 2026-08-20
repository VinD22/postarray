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
  'composerWeb.pane.targets': 'Цільові облікові записи та набори',
  'composerWeb.pane.master': 'Головна чернетка та спільні налаштування',
  'composerWeb.pane.variant': 'Версія для відкритої мішені',
  'composerWeb.pane.review': 'Попередній перегляд, перевірка, вартість і затвердження',
  'composerWeb.pane.showPreview': 'Показати попередній перегляд',
  'composerWeb.pane.hidePreview': 'Приховати попередній перегляд',
  'composerWeb.pane.previewCollapsed':
    'Панель попереднього перегляду прихована. Відкрийте його, щоб перевірити остаточний допис.',

  'composerWeb.step.targets': 'Цілі',
  'composerWeb.step.write': 'Напишіть',
  'composerWeb.step.perTarget': 'За ціль',
  'composerWeb.step.review': 'огляд',
  'composerWeb.step.progress': 'Крок {current} з{total}',
  'composerWeb.step.legend': 'Composer кроки',

  'composerWeb.summary.label': 'Проект резюме',
  'composerWeb.summary.targets':
    '{count, plural, =0 {Немає цілей} one {# мета} few {# цілі} many {# цілі} other {# цілі}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {Жодних питань} one {# питання} few {# питань} many {# питань} other {# питань}}',
  'composerWeb.summary.notScheduled': 'Час не вибрано',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Вартість ще не визначена',
  'composerWeb.summary.openReview': 'Відкритий огляд',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Головний проект',
  'composerWeb.rail.masterHint':
    'Відредагуйте тут, щоб досягти кожної цілі, яка все ще успадковує.',
  'composerWeb.rail.accountsHeading': 'Цільові облікові записи',
  'composerWeb.rail.setsHeading': 'Набори та групи',
  'composerWeb.rail.setsHelp':
    'Набір: це збережена група облікових записів і параметрів за замовчуванням. Застосування одного копіює його значення в цю чернетку. Пізніші редагування набору не змінюють цю чернетку.',
  'composerWeb.rail.openTarget': 'Відкрийте версію для{account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Межа невідома',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {немає медіа} one {# медіафайл} few {# мультимедійні файли} many {# мультимедійні файли} other {# мультимедійні файли}}',
  'composerWeb.rail.paused': 'Призупинено. Він не буде опублікований, доки ви не відновите його.',
  'composerWeb.rail.state.notBuilt': 'Ще не побудований',
  'composerWeb.rail.state.unsupported': 'Провайдер не підтримує',
  'composerWeb.rail.empty': 'Облікові записи ще не вибрано.',
  'composerWeb.rail.emptyHelp':
    'Виберіть облікові записи, які має охопити ця публікація. Ви можете додати більше пізніше.',
  'composerWeb.rail.divergenceHint':
    'Відкрийте ціль, щоб побачити її власну версію. Основний проект не змінений.',
  'composerWeb.rail.searchLabel': 'Фільтрувати облікові записи',
  'composerWeb.rail.removeTarget': 'видалити{account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Глобальне редагування',
  'composerWeb.globalEdit.title': 'Застосуйте цю зміну до кожної вибраної цілі',
  'composerWeb.globalEdit.description':
    'Основний проект завжди змінюється. Цілі, які все ще успадковують це поле, слідують за ним. Цілі з власною версією зберігають її.',
  'composerWeb.globalEdit.fieldLabel': 'Поле',
  'composerWeb.globalEdit.compatibleHeading': 'Ці цілі приймають зміни',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Ці цілі зберігають власну версію',
  'composerWeb.globalEdit.incompatibleHeading': 'Ці цілі не можуть прийняти зміни',
  'composerWeb.globalEdit.incompatibleHelp':
    'Нічого не втрачають, не сказавши вам. Кожен обліковий запис нижче отримує явну версію з адаптованою зміною, і ви можете редагувати її згодом.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account}дозволяє {limit} персонажів. Цей текст є {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account}не використовує посилання в цьому полі. Посилання залишається в основній чернетці та в цілях, які це втратили.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account}будь {limit, plural, one {# файл} few {# файли} many {# файли} other {# файли}}. Цей проект має {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported': '{account}не слід {mimeType} файли.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account}не підтримує наступні елементи, тому послідовність залишається на основній чернетці.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account}публікує звичайний текст. Позначки форматування відображаються як символи.',
  'composerWeb.globalEdit.adaptedPreview': 'Що {account} отримує натомість',
  'composerWeb.globalEdit.confirm': 'Застосовуйте та створюйте версії',
  'composerWeb.globalEdit.nothingToApply':
    'Нічого не змінюється. Основна чернетка вже має це значення.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Зміна застосована до # мета} few {Зміна застосована до # цілі} many {Зміна застосована до # цілі} other {Зміна застосована до # цілі}}. {adapted, plural, =0 {Жодна мета не потребувала адаптованої версії} one {# target отримав адаптовану версію} few {# цілі отримали адаптовані версії} many {# цілі отримали адаптовані версії} other {# цілі отримали адаптовані версії}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'Ця мета має свою версію',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {#поле від основного чернетки} few {# поля відрізняються від основної чернетки} many {# поля відрізняються від основної чернетки} other {# поля відрізняються від основної чернетки}}',
  'composerWeb.override.field.body': 'Текст публікації',
  'composerWeb.override.field.contentKind': 'Тип публікації',
  'composerWeb.override.field.locale': 'Мова змісту',
  'composerWeb.override.field.mediaIds': 'ЗМІ',
  'composerWeb.override.field.links': 'Посилання',
  'composerWeb.override.field.signature': 'Підпис',
  'composerWeb.override.field.threadItems': 'Коментарі та ланцюжок',
  'composerWeb.override.field.schedule': 'розклад',
  'composerWeb.override.resetField': 'Скинути {field} освоїти',
  'composerWeb.override.resetFieldTitle': 'Скинути {field} для {account}?',
  'composerWeb.override.resetFieldBody':
    'Версія {field} написаний для {account} відкидається, а головна чернетка використовується знову. Інших цільових змін немає.',
  'composerWeb.override.resetAll': 'Скинути кожне поле до основного',
  'composerWeb.override.inheritNotice':
    'Ця мета відповідає головному проекту. Редагування будь-чого тут створює лише версію {account} отримує.',
  'composerWeb.override.created': '{account}тепер має свій {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Обмеження для{account}',
  'composerWeb.limits.text': 'Текст до {limit} персонажів',
  'composerWeb.limits.linkCost':
    'Посилення впевнено {count, plural, one {# характер} few {# персонажів} many {# персонажів} other {# персонажів}} незалежно від його довжини.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Немає зображення} one {# зображення} few {до # зображення} many {до # зображення} other {до # зображення}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {Немає відео} one {# відео} few {до # відео} many {до # відео} other {до # відео}}',
  'composerWeb.limits.duration': 'Відео до{duration}',
  'composerWeb.limits.aspect': 'Співвідношення сторінок між {min} і{max}',
  'composerWeb.limits.fileSize': 'Файли до{size}',
  'composerWeb.limits.mimeTypes': 'Прийнятні типи файлів:{types}',
  'composerWeb.limits.source':
    'З моментального знімка можливостей {version}, прочитати {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'Потрібен ескіз.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider}налаштування',
  'composerWeb.native.privacy': 'Хто може це побачити',
  'composerWeb.native.privacyChoose': 'Виберіть аудиторію',
  'composerWeb.native.privacyExplicit':
    '{provider}не дозволяє попередній вибір аудиторії. Виберіть один, перш ніж це можна буде запланувати.',
  'composerWeb.native.community': 'Спільнота',
  'composerWeb.native.board': 'дошка',
  'composerWeb.native.group': 'Група або сторінка',
  'composerWeb.native.organization': 'організація',
  'composerWeb.native.channel': 'Канал',
  'composerWeb.native.publication': 'Публікація',
  'composerWeb.native.disclosureHeading': 'Розкриття',
  'composerWeb.native.disclosureCommercial': 'Ця публікація рекламує продукт або послугу',
  'composerWeb.native.disclosureBranded': 'Ця публікація є фірмовим контентом іншої компанії',
  'composerWeb.native.disclosureAi':
    'Частину цього вмісту створено за допомогою інструменту штучного інтелекту',
  'composerWeb.native.disclosureUnsupported':
    '{provider}не пропонує це розкриття через свій API. Натомість додайте його в текст.',
  'composerWeb.native.none':
    'немає {provider} налаштування використовується до цього типу публікацій.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Вирішено на{provider}',
  'composerWeb.entity.resolvedId': 'ID запису{externalId}',
  'composerWeb.entity.plainTextWarning':
    'Не збігається. Він буде опублікований як звичний текст, який не є рідним тегом {provider}.',
  'composerWeb.entity.removeMention': 'Видалити назву про{label}',
  'composerWeb.entity.addMention': 'Додайте згадку',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Жодних назв} one {# згадка} few {# згадки} many {# згадки} other {# згадки}}, {resolved} збігається з реальним обліковим записом',
  'composerWeb.entity.lookupUnsupported':
    '{provider}не пропонує пошук об’єктів для цього типу цифрового запису.',
  'composerWeb.entity.lookupNotBuilt':
    'Relay не створив пошук сутностей для {provider} ще. Тим часом ні про що не догадується.',
  'composerWeb.entity.searchHint': 'Введіть принаймні два символи, а потім виберіть результат.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {Немає збігів} one {# матч} few {# сірники} many {# сірники} other {# сірники}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Посилання',
  'composerWeb.links.detected':
    '{count, plural, one {#посилання знайдено в цій чернетці} few {# посилання, знайдені в цій чернетці} many {# посилання, знайдені в цій чернетці} other {# посилання, знайдені в цій чернетці}}',
  'composerWeb.links.noneDetected': 'У цій чернетці ще немає посилань.',
  'composerWeb.links.modeLabel': 'Як публікується це посилання',
  'composerWeb.links.original': 'Оригінал URL',
  'composerWeb.links.utmSource': 'Джерело',
  'composerWeb.links.utmMedium': 'Середній',
  'composerWeb.links.utmCampaign': 'Кампанія',
  'composerWeb.links.utmTerm': 'термін',
  'composerWeb.links.utmContent': 'Зміст',
  'composerWeb.links.domainVerified': '{domain}, підтверджено для цієї робочої області',
  'composerWeb.links.domainDefault': 'Домен за замовчуванням Relay',
  'composerWeb.links.domainNone': 'Жоден фірмовий домен ще не підтверджено.',
  'composerWeb.links.notAllowedHere': '{account}не дозволено посилання тут.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'коментар',
  'composerWeb.sequence.kindThread': 'Ниткова частина',
  'composerWeb.sequence.kindLabel': 'Тип предмета',
  'composerWeb.sequence.moveUp': 'Перемістіть цей елемент раніше',
  'composerWeb.sequence.moveDown': 'Перемістіть цей елемент пізніше',
  'composerWeb.sequence.remove': 'Видаліть цей предмет',
  'composerWeb.sequence.absoluteTime': 'Бігає на {time}, який є {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'Якщо елемент не вдається, уже опублікована публікація залишається опублікованою, а елементи після неї не запускаються. Ви отримуєте предмет дії.',
  'composerWeb.sequence.maxReached':
    '{account}будь {limit, plural, one {# наступний пункт} few {# подальші елементи} many {# подальші елементи} other {# подальші елементи}}.',
  'composerWeb.sequence.minDelay': 'Найкоротша затримка {provider} дозволяє ось {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Той самий обліковий запис, що й публікація',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Жодних питань} one {# питання} few {# питань} many {# питань} other {# питань}} на цьому предметі',
  'composerWeb.sequence.customMinutes': 'Хвилин після попереднього елемента',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Повторіть цей пост',
  'composerWeb.repeat.cadenceLabel': 'Як часто',
  'composerWeb.repeat.maximum':
    'Допис, що повторюється, може публікуватися щонайбільше {limit} разів.',
  'composerWeb.repeat.occurrenceLabel': 'Кількість постів',
  'composerWeb.repeat.duplicateCheck':
    'Кожен випадок перевіряється на наявність дублікатів перед публікацією. Випадок, який не пройшов перевірку, замість публікації стає елементом дії.',
  'composerWeb.repeat.occurrenceList': 'Перші випадки',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {і # більше всього} few {і # більше всього} many {і # більше всього} other {і # більше всього}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Набори і підпис',
  'composerWeb.set.pickerTitle': 'Почніть із набору',
  'composerWeb.set.pickerDescription':
    'Набір заповнює цілі, текст і налаштування. Чернетка, яку він створює, є незалежною, тому редагування набору пізніше ніколи не змінює затверджену чи заплановану публікацію.',
  'composerWeb.set.accountCount':
    '{count, plural, one {#рахунок} few {# облікові записи} many {# облікові записи} other {# облікові записи}}',
  'composerWeb.set.apply': 'Використовуйте цей набір',
  'composerWeb.set.none': 'Ще немає збережених наборів.',
  'composerWeb.signature.pickerLabel': 'Підпис',
  'composerWeb.signature.scope': 'для {project} на {provider} в{language}',
  'composerWeb.signature.previewHeading': 'Як закінчується пост',
  'composerWeb.signature.notMatching':
    'Цей підпис стосується іншого бренду, платформи чи мови, тому він тут не пропонується.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Допоможіть із цим текстом',
  'composerWeb.assist.unavailableTitle': 'Текстову допомогу не налаштовано',
  'composerWeb.assist.unavailableBody':
    'Штучний шлюз не налаштовано для цього робочого простору, тому допоміжні дії вимкнено. Все інше в композиторі працює нормально.',
  'composerWeb.assist.targetLabel': 'Застосовується до',
  'composerWeb.assist.targetMaster': 'Головний проект',
  'composerWeb.assist.targetVariant': 'Версія для{account}',
  'composerWeb.assist.beforeLabel': 'Актуальний текст',
  'composerWeb.assist.afterLabel': 'Пропонований текст',
  'composerWeb.assist.regionLabel': 'Запропонована зміна тексту, ще не застосована',
  'composerWeb.assist.added': 'додано',
  'composerWeb.assist.removed': 'видалено',
  'composerWeb.assist.evidence': 'Свідоцтва та джерела',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Для цього твердження не знайдено жодного джерела. Перевірте перед публікацією.',
  'composerWeb.assist.failed': 'Запит на допомогу не виконано. Ваш текст залишився без змін.',
  'composerWeb.assist.noMediaGeneration':
    'Relay не створює зображень або відео. Занесіть готові файли в бібліотеку та опублікуйте їх тут.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'Це затверджена версія. Його редагування створює нову версію та скасує схвалення.',
  'composerWeb.autosave.pinnedAcknowledge': 'Відредагуйте та очистіть схвалення',
  'composerWeb.autosave.conflictTitle': 'Два варіанти цього проекту',
  'composerWeb.autosave.conflictKeepMine': 'Тримайте те, що я написав',
  'composerWeb.autosave.conflictKeepTheirs': 'Використовуйте версію з{name}',
  'composerWeb.autosave.conflictHelp':
    "Нічого не об'єднується автоматично. Виберіть поле й збережіть.",
  'composerWeb.autosave.retry': 'Спробуйте зберегти ще раз',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Комбінації клавіш Composer',
  'composerWeb.shortcuts.nextTarget': 'Наступна мета',
  'composerWeb.shortcuts.previousTarget': 'Попередня мета',
  'composerWeb.shortcuts.nextIssue': 'Наступний номер',
  'composerWeb.shortcuts.previousIssue': 'Попередній випуск',
  'composerWeb.shortcuts.save': 'Зберегти чернетку зараз',
  'composerWeb.shortcuts.openSchedule': 'Відкрийте аркуш розкладу',
  'composerWeb.shortcuts.open': 'Показати ярлики',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'огляд',
  'composerWeb.review.contentVersion': 'Контентна версія{checksum}',
  'composerWeb.review.approvalPolicy': 'Політика:{policy}',
  'composerWeb.review.approverPending': 'Очікування рішення від {approver}.',
  'composerWeb.review.approverNone': 'Для цих цілей схвалення не потрібне.',
  'composerWeb.review.perTargetHeading': 'Що отримує кожен обліковий запис',
  'composerWeb.review.finalUrl': 'Опубліковано посилання',
  'composerWeb.review.privacyState': 'аудиторія:{value}',
  'composerWeb.review.disclosureState': 'Розкриття інформації:{value}',
  'composerWeb.review.disclosureNone': 'Не встановлено розголошення',
  'composerWeb.review.mediaVersion': '{name}, версія{version}',
  'composerWeb.review.blocked':
    '{count, plural, one {#ціль ще не можна запланувати} few {# ціли ще не можна запланувати} many {# ціли ще не можна запланувати} other {# ціли ще не можна запланувати}}',
  'composerWeb.review.offlineBlocked':
    'Для планування та публікації потрібне з’єднання. Ваша чернетка безпечна на цьому пристрої.',
  'composerWeb.review.publishConfirm':
    'Це публікує в {count, plural, one {# рахунок} few {# облікові записи} many {# облікові записи} other {# облікові записи}} всього. Це не можна скасувати звiдси.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Новий проект',
  'composerWeb.page.loading': 'Завантаження чернетки, її цілі та їх межі',
  'composerWeb.page.errorTitle': 'Не вдалося відкрити цю чернетку',
  'composerWeb.page.errorBody':
    'Нічого не було втрачено. Спробуйте ще раз, і якщо помилка продовжується, посилання нижче допоможе службі підтримки знайти запит.',
  'composerWeb.page.noConnectionsTitle': 'Підключіть обліковий запис перед створенням',
  'composerWeb.page.noConnectionsBody':
    'Чернетка потребує принаймні одного підключеного облікового запису, щоб Relay знав обмеження, попередній перегляд і налаштування для показу.',
  'composerWeb.page.noConnectionsExample':
    'Приклад: якщо X і LinkedIn підключено, одна чернетка стає двома рідними версіями з власними лічильниками.',
  'composerWeb.page.permissionTitle': 'Ви не можете створювати публікації в цій робочій області',
  'composerWeb.page.permissionBody':
    'Компонент потребує ролі редактора або вище. Власник або адміністратор може змінити вашу роль.',
  'composerWeb.page.rateLimitTitle': 'Забагато збережень чернеток за короткий час',
  'composerWeb.page.rateLimitCause':
    'У цій робочій області досягнуто ліміту запису для поточного вікна. Ваш текст тим часом зберігається на цьому пристрої.',
  'composerWeb.page.rateLimitAlternative':
    'Продовжуйте писати. Збереження відновлюється автоматично після скидання вікна.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Сітка',
  'mediaLib.view.list': 'Список',
  'mediaLib.view.label': 'Макет',
  'mediaLib.sort.label': 'Сортувати',
  'mediaLib.sort.newest': 'Спочатку найновіші',
  'mediaLib.sort.name': "Ім'я",
  'mediaLib.sort.size': 'Перший найбільший',
  'mediaLib.select': 'Виберіть{name}',
  'mediaLib.column.file': 'Файл',
  'mediaLib.column.type': 'Тип',
  'mediaLib.column.size': 'Розмір',
  'mediaLib.column.altText': 'Альтернативний текст',
  'mediaLib.column.rights': 'права',
  'mediaLib.column.added': 'Додано',
  'mediaLib.openDetail': 'ВІДЧИНЕНО{name}',

  'mediaLib.empty.title': 'Медіа ще немає',
  'mediaLib.empty.body':
    'Завантажте зображення та відео, які вже є, або імпортуйте файл із URL. Relay перевіряє тип і розмір кожного облікового запису, у якому ви публікуєте.',
  'mediaLib.empty.example':
    'Приклад: launch_hero.jpg, 1600 на 900, набір альтернативного тексту, використано у 2 публікаціях.',
  'mediaLib.error.title': 'Не вдалося завантажити бібліотеку',
  'mediaLib.error.body': 'Ваші файли в безпеці. Ця невдача нічого не змінила.',
  'mediaLib.offline.title': 'Бібліотека недоступна офлайн',
  'mediaLib.offline.body':
    'Ми не можемо оновити бібліотеку без підключення. Файли, які вже показані на цьому екрані, не змінилися. Підключіться знову і спробуйте ще раз.',
  'mediaLib.rateLimited.title': 'Бібліотеці потрібна коротка пауза',
  'mediaLib.rateLimited.cause':
    'API попросив нас сповільнитися під час завантаження ваших файлів. Ваші збережені медіафайли в безпеці.',
  'mediaLib.rateLimited.resetLabel': 'Спробуйте знову після',
  'mediaLib.rateLimited.alternative':
    'Ви можете продовжувати створювати чернетку локально, але завантаження та зміни бібліотеки чекають, поки ліміт не скинеться.',
  'mediaLib.loading': 'Завантаження медіатеки',
  'mediaLib.permission.title': 'Ви не бачите цю бібліотеку робочої області',
  'mediaLib.permission.body':
    'Для перегляду медіа-файлів потрібна роль глядача або вище на цьому бренді. Власник або адміністратор може надати це.',

  'mediaLib.upload.heading': 'Додайте медіа',
  'mediaLib.upload.browse': 'Виберіть файли',
  'mediaLib.upload.dropHint':
    'Перетягніть файли сюди або виберіть їх. Завантаження відновлюються, якщо з’єднання розривається.',
  'mediaLib.upload.queueHeading': 'Завантаження',
  'mediaLib.upload.progress': '{name}, {percent} з {size} надіслано',
  'mediaLib.upload.paused': 'Призупинено. {sent} з {size} вже зберігається.',
  'mediaLib.upload.resume': 'Відновити завантаження',
  'mediaLib.upload.pause': 'Призупинити завантаження',
  'mediaLib.upload.cancel': 'Скасувати це завантаження',
  'mediaLib.upload.retry': 'Спробуйте завантажити ще раз',
  'mediaLib.upload.finalizing': 'Оздоблення{name}',
  'mediaLib.upload.done': '{name}є у вашій бібліотеці',
  'mediaLib.upload.failed': '{name}не закінчив.{reason}',
  'mediaLib.upload.offline':
    'Офлайн. Завантаження продовжуються з того місця, де вони зупинилися після повторного підключення.',
  'mediaLib.upload.rejectedType':
    '{name}є {mimeType}, які не потребують жоден із вибраних облікових записів.',
  'mediaLib.upload.rejectedSize':
    '{name}є {size}. Встановлюється найнижчий ліміт для ваших облікових записів {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Прийнято # ваших облікових записів} few {Прийнято # ваших облікових записів} many {Прийнято # ваших облікових записів} other {Прийнято # ваших облікових записів}}',
  'mediaLib.upload.rejectedBy': 'Не прийнято{accounts}',
  'mediaLib.upload.checkedAgainst': 'Перевірено облікові записи, вибрані в цій чернетці.',
  'mediaLib.upload.noTargets':
    'Облікові записи не вибрано, тому файл перевіряється лише на відповідність стандартним параметрам робочої області.',

  'mediaLib.import.urlLabel': 'Публічний URL файлу',
  'mediaLib.import.urlPlaceholder': 'https://cdn.example.com/launch-video.mp4',
  'mediaLib.import.importing': 'Імпортування медіа',
  'mediaLib.import.succeeded': 'Файл у вашій бібліотеці',
  'mediaLib.import.scanPending':
    'Relay записав джерело файлу. Публікація чекає завершення перевірки безпеки.',
  'mediaLib.import.failed': 'Файл не вдалося імпортувати',
  'mediaLib.import.failedHelp':
    'Перевірте, що посилання публічне та веде безпосередньо на підтримуваний медіафайл, потім спробуйте знову.',
  'mediaLib.import.readOnly': 'Підключіть API, щоб імпортувати файли в цьому середовищі.',
  'mediaLib.import.offline': 'Підключіться знову перед імпортуванням файлу.',
  'mediaLib.import.issue.invalid': 'Введіть повний URL.',
  'mediaLib.import.issue.scheme': 'Використовуйте посилання HTTP або HTTPS.',
  'mediaLib.import.issue.credentials': 'Використовуйте посилання без імені користувача чи пароля.',
  'mediaLib.retention.title': 'Збережені файли зберігаються 30 днів після створення публікації',
  'mediaLib.retention.body':
    'Щойно файл прикріплено до публікації, ми остаточно видаляємо його зі сховища Relay через 30 днів після створення цієї публікації. Для файлів, що очікують на прикріплення, датою очищення за замовчуванням є дата завантаження. Текст публікації, квитанції про публікацію та історія аудиту залишаються доступними довше. Публікація, яка вже вийшла на соціальній платформі, не видаляється, коли термін зберігання її файлу минає.',
  'mediaLib.retention.limits':
    'Зображення, аудіо та PDF-файли можуть бути розміром до {imageSize}. Відео можуть бути розміром до {videoSize}.',
  'mediaLib.retention.expiresLabel': 'Дата видалення файлу',
  'mediaLib.retention.deleted': 'Видалено назавжди',
  'mediaLib.retention.deletedTitle': 'Цей збережений файл видалено',
  'mediaLib.retention.deletedBody':
    '30-денний період зберігання завершився. Текст публікації, квитанції про публікацію та історія аудиту залишаються.',
  'mediaLib.processing.unavailableTitle': 'Цей файл ще не готовий до публікації',
  'mediaLib.processing.unavailableBody':
    'Обробка або перевірка безпеки все ще триває або не була пройдена. Завантажте файл знову, якщо цей стан не зникає.',
  'mediaLib.processing.pendingTitle': 'Перевірка безпеки поки недоступна до запуску',
  'mediaLib.processing.pendingBody':
    'Файл зберігається 30 днів, але його не можна прикріпити до опублікованого допису, поки не увімкнено перевірку безпеки.',
  'mediaLib.processing.blockedTitle': 'Цей файл не можна опублікувати',
  'mediaLib.processing.blockedBody':
    'Файл не пройшов обробку або перевірку безпеки. Завантажте інший файл.',
  'mediaLib.alt.heading': 'Альтернативний текст',
  'mediaLib.alt.help':
    'Опишіть, що важливо на зображенні для того, хто не бачить його. Зазвичай достатньо одного-двох речень.',
  'mediaLib.alt.count': '{used}з {limit} персонажів',
  'mediaLib.alt.requiredBy': 'Потрібний до{accounts}',
  'mediaLib.alt.waive': 'Це зображення не несе інформації',
  'mediaLib.alt.waiveReason': 'Чому не потребує опису',
  'mediaLib.alt.waiveHelp':
    'Використовуйте це лише для прикраси. Відмінене зображення публікується з порожнім описом, якщо це дозволяє платформа.',
  'mediaLib.alt.waived': 'Відмовився від {name} на {date}. Причина:{reason}',
  'mediaLib.alt.unsupported': '{provider}не інший альтернативний текст через API для цього запису.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {#файл не містить альтернативного тексту} few {# файли не мають альтернативного тексту} many {# файли не мають альтернативного тексту} other {# файли не мають альтернативного тексту}}',

  'mediaLib.rights.heading': 'Права та згода',
  'mediaLib.rights.declared': 'Оголошено {name} на{date}',
  'mediaLib.rights.undeclared': 'Ще не оголошено. Оголошіть це перед публікацією цього файлу.',
  'mediaLib.rights.ownerLabel': 'Кому належить цей файл',
  'mediaLib.rights.ownerSelf': 'Цей робочий простір',
  'mediaLib.rights.ownerLicensed': 'Ліцензія від когось іншого',
  'mediaLib.rights.ownerUgc': 'Клієнт або автор дав дозвіл',
  'mediaLib.rights.licenseLabel': 'Посилання на ліцензію або дозвіл',
  'mediaLib.rights.peopleLabel': "Люди з'являються в цьому файлі",
  'mediaLib.rights.peopleConsent': 'Усі показані дали згоду на публікацію',
  'mediaLib.rights.musicLabel': 'Цей файл містить музику або саундтрек',
  'mediaLib.rights.confirm':
    'Я маю право публікувати цей файл, включаючи будь-яких людей, музику, логотипи та бренди в ньому.',
  'mediaLib.rights.blocking': 'Цей файл не можна запланувати, доки не буде заявлено права.',

  'mediaLib.editor.heading': 'Редагувати малюнок',
  'mediaLib.editor.description':
    'Кожне редагування зберігається як нова версія. Оригінальний файл зберігається та може бути відновлений.',
  'mediaLib.editor.tab.crop': 'кадрування',
  'mediaLib.editor.tab.transform': 'Змінити розмір і повернути',
  'mediaLib.editor.tab.canvas': 'Полотно',
  'mediaLib.editor.tab.output': 'Формат і розмір',
  'mediaLib.editor.tab.thumbnail': 'Мініатюра',
  'mediaLib.editor.presetLabel': 'Попереднє налаштування формату',
  'mediaLib.editor.presetFree': 'безкоштовно',
  'mediaLib.editor.presetFor': '{ratio}, використання{accounts}',
  'mediaLib.editor.cropX': 'Обрізати з початкового краю',
  'mediaLib.editor.cropY': 'Обрізати зверху',
  'mediaLib.editor.cropWidth': 'Ширина посіву',
  'mediaLib.editor.cropHeight': 'Висота культури',
  'mediaLib.editor.cropKeyboardHint':
    'Поле обрізання налаштовано з числовими полями, тому воно повністю працює з клавіатури.',
  'mediaLib.editor.widthLabel': 'Ширина в пікселях',
  'mediaLib.editor.heightLabel': 'Висота в пікселях',
  'mediaLib.editor.lockRatio': 'Зберігати поточне співвідношення',
  'mediaLib.editor.rotateLabel': 'Обертання',
  'mediaLib.editor.rotateDegrees': '{degrees}ступенів',
  'mediaLib.editor.flipHorizontal': 'Переворот поперек вертикальної осі',
  'mediaLib.editor.flipVertical': 'Перевернути впоперек горизонтальної осі',
  'mediaLib.editor.canvasColor': 'Колір фону',
  'mediaLib.editor.canvasFit': 'Як картина сидить на полотні',
  'mediaLib.editor.canvasFitCover': 'Заповніть полотно та обріжте перелив',
  'mediaLib.editor.canvasFitContain': 'Встановіть всю картинку та підкладіть решту',
  'mediaLib.editor.formatLabel': 'Вихідний формат',
  'mediaLib.editor.qualityLabel': 'Якість стиснення',
  'mediaLib.editor.qualityValue': '{value}зі 100',
  'mediaLib.editor.estimatedSize': 'Розрахунковий вихід {size}, від{original}',
  'mediaLib.editor.estimatedSizeUnknown': 'Вихідний розмір відомий лише після обробки файлу.',
  'mediaLib.editor.thumbnailHelp':
    'Виберіть кадр або файл, який використовується як ескіз відео, якщо платформа приймає такий.',
  'mediaLib.editor.thumbnailFrame': 'Рамка при{time}',
  'mediaLib.editor.save': 'Зберегти як нову версію',
  'mediaLib.editor.saving': 'Збереження версії{version}',
  'mediaLib.editor.saved': 'Версія {version} збережено. Оригінал все ще тут.',
  'mediaLib.editor.discard': 'Скасувати ці зміни',
  'mediaLib.editor.noChanges': 'Ще немає змін для збереження.',
  'mediaLib.editor.revalidate':
    'Під час збереження цей файл перевіряється з кожним обліковим записом у чернетках, які його використовують.',
  'mediaLib.editor.noGeneration':
    'Цей редактор змінює файл, який ви завантажили. Це не створює нових образів.',

  'mediaLib.versions.heading': 'Версії',
  'mediaLib.versions.original': 'Оригінальне завантаження',
  'mediaLib.versions.current': 'Актуальна версія',
  'mediaLib.versions.restore': 'Відновити версію{version}',
  'mediaLib.versions.item': 'Версія {version}, {dimensions}, {size},{date}',

  'mediaLib.provenance.heading': 'Звідки цей файл',
  'mediaLib.provenance.sourceUrl': 'Джерело URL',
  'mediaLib.provenance.fetchedAt': 'Принесено{date}',
  'mediaLib.provenance.declaredAuthor': 'Зазначений автор',
  'mediaLib.provenance.declaredLicense': 'Заявлена ліцензія',
  'mediaLib.provenance.contentCredentials': 'Облікові дані вбудованого вмісту',
  'mediaLib.provenance.contentCredentialsNone':
    'Цей файл не містить облікових даних для вбудованого вмісту. Це поширене явище і не означає, що щось не так.',
  'mediaLib.provenance.unverified':
    'Ці подробиці надійшли з джерела, а не з Relay. Перевірте їх, перш ніж покладатися на них.',

  'mediaLib.picker.title': 'Виберіть медіа',
  'mediaLib.picker.description':
    'Файли перевіряються за обліковими записами, вибраними в цій чернетці.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Виберіть файли} one {додати # файл} few {додати # файли} many {додати # файли} other {додати # файли}}',
  'mediaLib.picker.forMaster': 'Додавання до основної чернетки',
  'mediaLib.picker.forVariant': 'Додавання до версії для {account} тільки',
} as const;
