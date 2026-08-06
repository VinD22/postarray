/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Скласти',
  'composer.titleWithBrand': 'Складіть для {brand}',
  'composer.master.label': 'Головний проект',
  'composer.master.description':
    'Напишіть один раз тут. Сумісні зміни досягають кожної вибраної цілі. Відкрийте ціль, щоб написати версію, яку отримає лише цей обліковий запис.',
  'composer.master.globalEdit': 'Глобальне редагування',
  'composer.master.placeholder': 'Що ви хочете опублікувати?',
  'composer.brief.label': 'Коротко',
  'composer.brief.placeholder': 'Опишіть ідею, аудиторію та бажаний результат.',
  'composer.sources.label': 'Посилання на джерела',
  'composer.sources.empty': 'Джерела не додаються.',
  'composer.campaign.label': 'Кампанія',
  'composer.campaign.none': 'Жодної кампанії',
  'composer.contentLocale.label': 'Мова змісту',
  'composer.contentLocale.help': 'Мова повідомлення. Це окремо від вашої мови інтерфейсу.',
  'composer.market.label': 'Ринок аудиторії',

  'composer.targets.title': 'Цілі',
  'composer.targets.count':
    '{count, plural, =0 {Облікові записи не вибрано} one {# рахунок} few {# облікові записи} many {# облікові записи} other {# облікові записи}}',
  'composer.targets.publishSummary':
    '{count, plural, one {Це буде опубліковано в # рахунок} few {Це буде опубліковано в # облікові записи} many {Це буде опубліковано в # облікові записи} other {Це буде опубліковано в # облікові записи}} {when, select, now {зараз} scheduled {в запланований час} other {}}',
  'composer.targets.add': 'Додати облікові записи',
  'composer.targets.empty': 'Виберіть принаймні один обліковий запис для публікації.',
  'composer.targets.state.ready': 'Готовий',
  'composer.targets.state.inherited': 'У спадок від господаря',
  'composer.targets.state.overridden': 'Перевизначено',
  'composer.targets.state.warning': 'Перевірте перед публікацією',
  'composer.targets.state.error': 'Потребує виправлення',
  'composer.targets.state.approvalNeeded': 'Потрібне схвалення',
  'composer.targets.overrideBadge': 'Перевизначити',
  'composer.targets.resetConfirm.title': 'Скинути цю ціль до основної чернетки?',
  'composer.targets.resetConfirm.body':
    'Копія, медіа та налаштування, які ви змінили {account} буде замінено основним проектом. Інші цілі не зачіпаються.',
  'composer.targets.divergence':
    '{count, plural, one {# ціль інший від основного проекту} few {# цілі відрізняються від основного проекту} many {# цілі відрізняються від основного проекту} other {# цілі відрізняються від основного проекту}}',

  'composer.applyToAll.title': 'Застосувати до всіх цілей',
  'composer.applyToAll.compatible':
    '{count, plural, one {# поле сумісне з шкірною обраною настановою} few {# поля сумісні з шкірною обраною платою} many {# поля сумісні з шкірною обраною платою} other {# поля сумісні з шкірною обраною платою}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# поле не може бути застосоване та залишається для цілі} few {# поля не можна використовувати та залишити для кліток} many {# поля не можна використовувати та залишити для кліток} other {# поля не можна використовувати та залишити для кліток}}',
  'composer.applyToAll.creates': 'Застосування створює явну версію для кожної цілі.',

  'composer.editor.label': 'Текст публікації',
  'composer.editor.characterCount': '{used} з {limit} персонажів',
  'composer.editor.characterCountOver': '{over} символів над {limit} обмеження символів',
  'composer.editor.characterCountUnknown':
    'Для цього облікового запису обмеження кількості символів недоступне',
  'composer.editor.remaining':
    '{count, plural, one {# залишився символ} few {# залишилося символів} many {# залишилося символів} other {# залишилося символів}}',
  'composer.editor.hashtagCount':
    '{count, plural, one {# хештег} few {# хештеги} many {# хештеги} other {# хештеги}}',
  'composer.editor.formatting': 'Форматування',
  'composer.editor.emoji': 'Емодзі',
  'composer.editor.mention': 'Згадка',
  'composer.editor.link': 'Посилання',

  'composer.mentions.search': 'Шукайте людей, сторінки та компанії',
  'composer.mentions.searching': 'Пошук {provider}',
  'composer.mentions.resolved': 'Позначений тегами {label} на {provider}',
  'composer.mentions.unresolved':
    'Цяка згадка не була зіставлена з a {provider} рахунок ще. Він опублікуватиметься як звичний текст, доки ви не виберете результат.',
  'composer.mentions.noResults': 'Немає відповідних облікових записів {provider}.',
  'composer.mentions.unsupported': 'Нативне тегування недоступне для цього облікового запису.',

  'composer.destination.label': 'Пункт призначення',
  'composer.destination.placeholder': 'Виберіть місце публікації',
  'composer.destination.community': 'Спільнота',
  'composer.destination.board': 'дошка',
  'composer.destination.group': 'Група',
  'composer.destination.page': 'Сторінка',
  'composer.destination.organization': 'організація',
  'composer.destination.channel': 'Канал',
  'composer.destination.refresh': 'Оновити пункти призначення',
  'composer.destination.lastRefreshed': 'Напрямки оновлено {relativeTime}',

  'composer.media.title': 'ЗМІ',
  'composer.media.count':
    '{count, plural, one {# файл} few {# файли} many {# файли} other {# файли}}',
  'composer.media.dropHint': 'Перетягніть файли сюди або перегляньте свою бібліотеку.',
  'composer.media.inheritFromMaster': 'Використання головного носія',
  'composer.media.overridden': 'Ця мета використовує власні медіа',
  'composer.media.altText.label': 'Альтернативний текст',
  'composer.media.altText.placeholder':
    'Опишіть зображення для людей, які використовують програму зчитування з екрана.',
  'composer.media.altText.missing': 'Альтернативний текст відсутній.',
  'composer.media.altText.waive': 'Це зображення не потребує альтернативного тексту',
  'composer.media.altText.generate': 'Напишіть альтернативний текст',
  'composer.media.crop': 'кадрування',
  'composer.media.resize': 'Змінити розмір',
  'composer.media.rotate': 'Обертати',
  'composer.media.compress': 'Компрес',
  'composer.media.convertFormat': 'Перетворити формат',
  'composer.media.thumbnail': 'Мініатюра',
  'composer.media.aspectPreset': 'Попереднє налаштування платформи',
  'composer.media.original': 'Оригінал',
  'composer.media.originalPreserved':
    'Оригінальний файл зберігається. Редагування створює нову версію.',
  'composer.media.uploading': 'Завантаження {name}',
  'composer.media.processing': 'Готується {name}',
  'composer.media.rights.label': 'Права та згода',
  'composer.media.rights.confirm':
    'Я маю право публікувати цей медіа, включаючи будь-яких людей, музику, логотипи та бренди в ньому.',

  'composer.sequence.title': 'Коментарі та ланцюжок',
  'composer.sequence.root': 'Головний пост',
  'composer.sequence.item': 'Пункт {position}',
  'composer.sequence.add': 'Додайте коментар або елемент ланцюжка',
  'composer.sequence.delayLabel': 'Затримка після попереднього пункту',
  'composer.sequence.delayImmediate': 'Негайно',
  'composer.sequence.delayMinutes':
    '{count, plural, one {# хвилина} few {# хвилин} many {# хвилин} other {# хвилин}}',
  'composer.sequence.delayCustom': 'Спеціальна затримка',
  'composer.sequence.accountLabel': 'Опублікувати цей елемент як',
  'composer.sequence.unsupported': 'Цей обліковий запис не підтримує заплановані подальші дії.',

  'composer.repeat.title': 'Повторіть',
  'composer.repeat.off': 'Не повторювати',
  'composer.repeat.everyDays':
    '{count, plural, one {Кожен день} few {кожен # днів} many {кожен # днів} other {кожен # днів}}',
  'composer.repeat.endLabel': 'Припиніть повторювати',
  'composer.repeat.endOnDate': 'На побаченні',
  'composer.repeat.endAfterCount': 'Після ряду постів',
  'composer.repeat.endRequired': 'Виберіть дату завершення або кількість повторень.',
  'composer.repeat.summary':
    'Повтори {cadence} поки {end}. Кожен випадок отримує власне схвалення та квітання.',

  'composer.links.title': 'Посилання',
  'composer.links.keepOriginal': 'Зберігайте оригінал URL',
  'composer.links.track': 'Замініть відстежуваним коротким посиланням',
  'composer.links.utm': 'Параметри UTM',
  'composer.links.domain': 'Домен посилання',
  'composer.links.finalUrl': 'Це буде опубліковано як {url}',
  'composer.links.frozenAtApproval':
    'Точний короткий URL і пункт призначення заморожено в затвердженій версії.',

  'composer.signature.title': 'Підпис',
  'composer.signature.none': 'Без підпису',
  'composer.signature.autoApplied': 'Підпис {name} було додано автоматично. Ви можете це змінити.',

  'composer.set.title': 'Набори',
  'composer.set.startFrom': 'Почніть із набору',
  'composer.set.continueWithout': 'Продовжити без набору',
  'composer.set.applied': 'Прикладний набір {name}. Ця чернетка тепер не залежить від набору.',

  'composer.validation.title': 'Перевірка',
  'composer.validation.clean': 'Не знайдено проблем для вибраних цілей.',
  'composer.validation.issueCount':
    '{count, plural, one {# питання} few {# питань} many {# питань} other {# питань}} поперек {targets, plural, one {# мета} few {# цілі} many {# цілі} other {# цілі}}',
  'composer.validation.blocking': 'Це потрібно виправити перед плануванням.',
  'composer.validation.warning': 'Перевірте це перед публікацією.',
  'composer.validation.revalidated': 'Перевірено на поточні обмеження платформи {relativeTime}.',

  'composer.preview.title': 'Попередній перегляд',
  'composer.preview.forAccount': 'Попередній для перегляду {account} на {provider}',
  'composer.preview.approximate':
    'Цей попередній перегляд використовує правила платформи, які ми записали. Опублікована публікація може відрізнятися, якщо платформа змінюється.',
  'composer.preview.unavailable':
    'Справжній попередній перегляд для цього облікового запису ще не доступний.',

  'composer.cost.title': 'Орієнтовна вартість провайдера',
  'composer.cost.estimate': '{provider} оцінки {amount} використання API для цієї публікації.',
  'composer.cost.linkSurcharge':
    '{provider} стягує більшу плату для публікації, яка складається URL. Видача посилання знижує оцінку.',
  'composer.cost.bulkWarning':
    '{count, plural, one {# публікація} few {# публікацій} many {# публікацій} other {# публікацій}} в одній дії. Перш ніж продовжити, перегляньте оцінку.',
  'composer.cost.reconciled': 'Фактичне використання звіряється після публікації.',
  'composer.cost.none': 'Для цієї посади немає тарифів постачальника.',

  'composer.autosave.saving': 'Збереження',
  'composer.autosave.saved': 'Збережено {relativeTime}',
  'composer.autosave.offline':
    'Офлайн. Ваша чернетка зберігається на цьому пристрої та синхронізується.',
  'composer.autosave.conflict':
    '{name} редагував цю чернетку, поки ви писали. Перегляньте обидві версії перед збереженням.',
  'composer.autosave.failed': 'Не вдалося зберегти. Ваш текст все ще тут. Повторна спроба.',

  'composer.ai.title': 'асист',
  'composer.ai.makeConcise': 'Зробіть більш лаконічним',
  'composer.ai.adaptForPlatform': 'Адаптувати для {provider}',
  'composer.ai.transcreate': 'Перетворити на {language}',
  'composer.ai.checkClaims': 'Перевірити претензії',
  'composer.ai.writeAltText': 'Напишіть альтернативний текст',
  'composer.ai.suggestHooks': 'Запропонуйте гачки',
  'composer.ai.suggestCta': 'Запропонуйте заклик до дії',
  'composer.ai.diffTitle': 'Запропонована зміна',
  'composer.ai.diffHelp': 'Ніщо не зміниться, поки ви не приймете це.',
  'composer.ai.working': 'Працюю над цим',
  'composer.ai.sources':
    'На основі {count, plural, one {# джерело} few {# джерела} many {# джерела} other {# джерела}} ви схвалили',
  'composer.ai.uncertain':
    'Ця фраза не має чистого еквівалента в {language}. Перегляньте його з носієм мови перед публікацією.',

  'composer.schedule.title': 'розклад',
  'composer.schedule.dateLabel': 'Дата',
  'composer.schedule.timeLabel': 'час',
  'composer.schedule.timeZoneLabel': 'Часовий пояс',
  'composer.schedule.nextFreeSlot': 'Наступний вільний слот',
  'composer.schedule.localAndUtc': '{local} в {timeZone}. {utc} UTC.',
  'composer.schedule.dstWarning':
    'Переводять годинники {timeZone} на цю дату. Ця публікація працює на {local}, який є {utc} UTC.',
  'composer.schedule.pastWarning': 'Той час минув. Виберіть пізніший час.',
  'composer.schedule.confirmTitle': 'Підтвердьте перед плануванням',
  'composer.schedule.confirmPublishNow': 'Підтвердьте перед публікацією зараз',
  'composer.schedule.approverLabel': 'Затверджувач',
  'composer.schedule.policyLabel': 'Політика затвердження',
  'composer.schedule.duplicateWarning':
    'Подібний вміст було опубліковано в {account} {relativeTime}. Повторна публікація може порушити правила платформи щодо повторюваного вмісту.',
  'composer.schedule.cadenceWarning':
    '{account} вже має {count, plural, one {# пост} few {# пости} many {# пости} other {# пости}} заплановано на цей день.',
} as const;
