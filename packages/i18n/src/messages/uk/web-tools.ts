/**
 * The free tools on the public site. See `en/web-tools.ts`: every number
 * comes from the generated connector dataset, every calculation runs in the
 * reader's browser, and a missing limit is stated as unavailable, never a
 * guess.
 */
export const webToolsMessages = {
  'web.meta.tools.title': 'Безкоштовні інструменти для публікації',
  'web.meta.tools.description':
    'Невеликі приватні інструменти для тих, хто публікує на кількох платформах: перевірка обмежень для кожної платформи, конструктор UTM, перевірка довжини заголовка YouTube і планувальник часових поясів.',
  'web.meta.tools.preflight.title': 'Попередня перевірка публікації',
  'web.meta.tools.preflight.description':
    'Перевірте одну чернетку за опублікованими обмеженнями тексту й медіа десяти платформ, із джерелом і датою, коли кожне обмеження було прочитано.',
  'web.meta.tools.utm.title': 'Конструктор UTM-посилань',
  'web.meta.tools.utm.description':
    'Складіть позначений URL кампанії та подивіться, що означає кожен параметр UTM. Працює повністю у вашому браузері.',
  'web.meta.tools.youtubeTitle.title': 'Перевірка довжини заголовка YouTube',
  'web.meta.tools.youtubeTitle.description':
    'Виміряйте заголовок YouTube за задокументованою стелею, порахованою так, як рахує людина.',
  'web.meta.tools.timeZone.title': 'Планувальник часових поясів і переходу на літній час',
  'web.meta.tools.timeZone.description':
    'Подивіться на один час публікації в кількох поясах аудиторії та знайдіть тижні, коли перехід на літній час зсуває місцевий час.',
  'web.meta.tools.engagementRate.title': 'Калькулятор рівня залученості',
  'web.meta.tools.engagementRate.description':
    'Поділіть взаємодії на охоплення, підписників або покази. Три прості обчислення, без вигаданого еталона.',

  'web.tools.index.title': 'Безкоштовні інструменти',
  'web.tools.index.summary':
    'Невеликі калькулятори, побудовані на тих самих даних про обмеження платформ, які читають наші конектори.',
  'web.tools.index.lede':
    'Чотири невеликі інструменти, побудовані на тих самих даних про обмеження платформ, які використовують наші конектори. Без облікового запису, без завантаження, без відстеження того, що ви друкуєте.',
  'web.tools.index.dataTitle': 'Звідки беруться числа',
  'web.tools.index.dataBody':
    'Кожне обмеження генерується з коду можливостей конектора в цьому репозиторії, і кожен рядок платформи несе офіційну сторінку документації, з якої воно взяте, і дату, коли її прочитала людина.',
  'web.tools.index.honesty':
    'Ці інструменти нічого не публікують. Жоден конектор ще не завершив перевірку постачальника, тому тут ніщо не підключає обліковий запис.',
  'web.tools.shared.privacyTitle': 'Це працює у вашому браузері',
  'web.tools.shared.privacyBody':
    'Усе, що ви вводите, залишається на цій сторінці. Немає запиту до сервера, немає збереження і немає події аналітики, що несе ваш текст.',
  'web.tools.shared.sourceLink': 'Документація платформи',
  'web.tools.shared.sourceRead': 'Прочитано {date}',
  'web.tools.shared.unavailable': 'недоступно',
  'web.tools.shared.unavailableWhy':
    'Ми ще не постачаємо конектор для цієї платформи, тому в нас немає перевіреного обмеження, щоб його показати. Ми краще нічого не скажемо, ніж будемо вгадувати.',
  'web.tools.shared.copy': 'Копіювати',
  'web.tools.shared.copied': 'Скопійовано',
  'web.tools.shared.copyFailed':
    'Ваш браузер заблокував копіювання. Виділіть текст і скопіюйте його.',
  'web.tools.shared.faqTitle': 'Питання',
  'web.tools.shared.baselineTitle': 'Який обліковий запис описують ці числа',
  'web.tools.shared.baselineBody':
    'Консервативний випадок: щойно підключений обліковий запис без підвищеної придатності. Деякі платформи піднімають стелю, щойно канал або бізнес перевірено, і там, де це відбувається, сторінка вказує це.',
  'web.tools.shared.otherTools': 'Інші інструменти',

  'web.tools.preflight.name': 'Попередня перевірка публікації',
  'web.tools.preflight.summary':
    'Одна чернетка, перевірена за обмеженнями тексту й медіа десяти платформ одночасно.',
  'web.tools.utm.name': 'Конструктор UTM-посилань',
  'web.tools.utm.summary':
    'Побудуйте позначений URL кампанії, не зіпсувавши вже наявний рядок запиту.',
  'web.tools.youtubeTitle.name': 'Перевірка довжини заголовка YouTube',
  'web.tools.youtubeTitle.summary': 'Виміряйте заголовок так, як людина рахує символи.',
  'web.tools.timeZone.name': 'Планувальник часових поясів і переходу на літній час',
  'web.tools.timeZone.summary':
    'Один час публікації в кількох поясах аудиторії, з позначеними переходами на літній час.',
  'web.tools.engagementRate.name': 'Калькулятор рівня залученості',
  'web.tools.engagementRate.summary':
    'Взаємодії, поділені на охоплення, підписників або покази. Нічого не шукається, нічого не порівнюється з еталоном.',

  'web.tools.preflight.title': 'Попередня перевірка публікації',
  'web.tools.preflight.lede':
    'Вставте чернетку, виберіть платформи, на яких публікуєтеся, і подивіться, які з них відхилять її, перш ніж ви дізнаєтеся про це з помилки API.',
  'web.tools.preflight.explainer.title': 'Чому лічильника символів недостатньо',
  'web.tools.preflight.explainer.body':
    'Платформи розходяться в думці про те, що таке символ. Деякі рахують одиниці коду, тому одне емодзі коштує два. Деякі рахують графеми, тому прапор або сімейне емодзі коштує один. Деякі переписують кожне посилання до фіксованої ширини, тому URL із 200 символів коштує стільки ж, скільки з 20. Цей інструмент застосовує кожне правило платформи окремо.',
  'web.tools.preflight.explainer.counting':
    'Чернетка вимірюється за допомогою сегментатора Intl браузера, який ділить текст на одиниці, які читач назвав би символами, а потім коригується за правилом платформи.',
  'web.tools.preflight.field.draft.label': 'Ваша чернетка',
  'web.tools.preflight.field.draft.help':
    'Вставте текст публікації. Посилання визначаються автоматично, щоб їхню вартість можна було застосувати для кожної платформи.',
  'web.tools.preflight.field.platforms.label': 'Платформи для перевірки',
  'web.tools.preflight.field.platforms.help': 'Виберіть стільки, на скількох публікуєтеся.',
  'web.tools.preflight.field.mediaKind.label': 'Прикріплене медіа',
  'web.tools.preflight.field.mediaKind.none': 'Без медіа',
  'web.tools.preflight.field.mediaKind.image': 'Зображення',
  'web.tools.preflight.field.mediaKind.video': 'Одне відео',
  'web.tools.preflight.field.mediaCount.label': 'Скільки зображень',
  'web.tools.preflight.field.byteSize.label': 'Розмір файлу в мегабайтах',
  'web.tools.preflight.field.byteSize.help':
    'Найбільший окремий файл. Залиште порожнім, щоб пропустити.',
  'web.tools.preflight.field.duration.label': 'Довжина відео в секундах',
  'web.tools.preflight.field.duration.help':
    'Залиште порожнім, щоб пропустити перевірку тривалості.',
  'web.tools.preflight.field.width.label': 'Ширина медіа в пікселях',
  'web.tools.preflight.field.height.label': 'Висота медіа в пікселях',
  'web.tools.preflight.field.dimensions.help':
    'Необовʼязково. Використовується лише для показу співвідношення сторін, яке ви публікуватимете.',
  'web.tools.preflight.results.title': 'Результат за платформою',
  'web.tools.preflight.results.empty':
    'Виберіть щонайменше одну платформу, щоб побачити результат.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Нічого не блокує} other {# не пройде}}, {warning, plural, =0 {без попереджень} other {# варто перевірити}}.',
  'web.tools.preflight.status.pass': 'Вміщується',
  'web.tools.preflight.status.warning': 'Варто перевірити',
  'web.tools.preflight.status.fail': 'Не пройде',
  'web.tools.preflight.status.unavailable': 'Недоступно',
  'web.tools.preflight.count.label':
    '{count} / {limit} {unit, select, grapheme {символів} utf16 {одиниць коду} weighted {зважених символів} other {символів}}',
  'web.tools.preflight.finding.textOver':
    'Перевищує межу на {over, plural, one {# символ} few {# символи} many {# символів} other {# символа}}.',
  'web.tools.preflight.finding.textNear': 'До межі залишилося {remaining} символів.',
  'web.tools.preflight.finding.textFits': 'Текст вміщується.',
  'web.tools.preflight.finding.linkFixed':
    'Кожне посилання переписується до фіксованої ширини, тому кожне коштує {cost} символів незалежно від його реальної довжини.',
  'web.tools.preflight.finding.linkActual': 'Посилання рахуються як символи, які вони займають.',
  'web.tools.preflight.finding.imagesOver':
    'Ця платформа приймає {limit, plural, =0 {нуль зображень} one {# зображення} few {# зображення} many {# зображень} other {# зображення}} в одній публікації.',
  'web.tools.preflight.finding.videosOver':
    'Ця платформа приймає {limit, plural, =0 {нуль відео} one {# відео} few {# відео} many {# відео} other {# відео}} в одній публікації.',
  'web.tools.preflight.finding.bytesOver': 'Файл більший за стелю {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    'Для цього виду медіа немає опублікованої стелі за байтами, тому розмір не перевірявся.',
  'web.tools.preflight.finding.durationOver': 'Довше за стелю {limit} секунд.',
  'web.tools.preflight.finding.durationUnder': 'Коротше за мінімум {limit} секунд.',
  'web.tools.preflight.finding.durationUnknown':
    'Немає опублікованої стелі за тривалістю, тому довжина не перевірялася.',
  'web.tools.preflight.finding.altText':
    'Альтернативний текст приймається до {limit} символів, варто використати.',
  'web.tools.preflight.finding.ratio': 'Ви б публікували приблизно у співвідношенні {ratio} до 1.',
  'web.tools.preflight.faq.counting.q': 'Як ви рахуєте символи?',
  'web.tools.preflight.faq.counting.a':
    'За графемами, використовуючи сегментатор Intl браузера, це одиниця, яку читач має на увазі під символом. Там, де платформа документує інше правило, наприклад підрахунок за одиницями коду або фіксовану вартість за посилання, це правило застосовується поверх.',
  'web.tools.preflight.faq.accuracy.q': 'Наскільки актуальні ці обмеження?',
  'web.tools.preflight.faq.accuracy.a':
    'Кожне обмеження генерується з коду конектора в нашому репозиторії, а не набирається на сторінці вручну, і кожен рядок платформи показує офіційний документ, з якого воно взяте, і дату, коли його прочитала людина. Якщо платформа змінює число, виправлення це одна зміна коду, і кожен інструмент тут іде за нею.',
  'web.tools.preflight.faq.privacy.q': 'Чи завантажується моя чернетка?',
  'web.tools.preflight.faq.privacy.a':
    'Ні. Перевірка виконується у вашому браузері. Немає запиту, що несе ваш текст, нічого не зберігається, і закриття вкладки достатньо, щоб видалити його.',
  'web.tools.preflight.faq.publish.q': 'Чи може цей інструмент опублікувати за мене?',
  'web.tools.preflight.faq.publish.a':
    'Поки що ні. Жоден конектор не завершив перевірку постачальника, тому ніщо на цьому сайті поки що не публікує на платформу. Ця сторінка це перевірка обмежень, а не редактор публікації.',

  'web.tools.utm.title': 'Конструктор UTM-посилань',
  'web.tools.utm.lede':
    'Додайте параметри кампанії до URL, не втративши вже наявний рядок запиту і не вгадуючи, що означає який параметр.',
  'web.tools.utm.explainer.title': 'Для чого кожен параметр',
  'web.tools.utm.explainer.body':
    'Параметри UTM читаються інструментами аналітики, а не платформою, на якій ви публікуєтеся. Вони подорожують у URL, тому їх бачить кожен, хто бачить посилання. Тримайте їх короткими, у нижньому регістрі та послідовними, тому що два написання однієї кампанії стають двома рядками у звіті.',
  'web.tools.utm.field.url.label': 'URL призначення',
  'web.tools.utm.field.url.help': 'Сторінка, на яку ви хочете привести людей, включно з https.',
  'web.tools.utm.field.url.invalid': 'Це не розпізнається як URL http або https.',
  'web.tools.utm.field.source.label': 'Джерело кампанії',
  'web.tools.utm.field.source.help': 'Звідки прийшов клік. Наприклад, назва платформи.',
  'web.tools.utm.field.medium.label': 'Канал кампанії',
  'web.tools.utm.field.medium.help': 'Вид посилання. Наприклад, соцмережі, email або реферал.',
  'web.tools.utm.field.campaign.label': 'Назва кампанії',
  'web.tools.utm.field.campaign.help':
    'Запуск, промоакція або тема, до якої належить це посилання.',
  'web.tools.utm.field.term.label': 'Термін кампанії',
  'web.tools.utm.field.term.help': 'Необовʼязково. Традиційно платне ключове слово.',
  'web.tools.utm.field.content.label': 'Вміст кампанії',
  'web.tools.utm.field.content.help':
    'Необовʼязково. Розділяє два посилання на ту саму сторінку, наприклад дві версії публікації.',
  'web.tools.utm.result.title': 'Ваш позначений URL',
  'web.tools.utm.result.empty': 'Введіть URL призначення, щоб побачити результат.',
  'web.tools.utm.result.label': 'Складений URL',
  'web.tools.utm.result.preserved':
    'Рядок запиту, який уже був у вашому URL, зберігається точно так, як ви його ввели.',
  'web.tools.utm.result.replaced':
    'Ваш URL уже мав один із цих параметрів. Значення, яке ви ввели тут, замінює його.',
  'web.tools.utm.faq.encoding.q': 'Що відбувається з пробілами та акцентами?',
  'web.tools.utm.faq.encoding.a':
    'Вони кодуються у відсотковому форматі, це те, що допомагає посиланню вижити при вставці в публікацію. Пробіл стає знаком плюс, а літера з акцентом стає своєю закодованою формою, і інструменти аналітики декодують обидва назад.',
  'web.tools.utm.faq.existing.q': 'Чи зламає це URL, у якого вже є параметри?',
  'web.tools.utm.faq.existing.a':
    'Ні. Наявні параметри зберігаються в початковому порядку, і додається або замінюється лише заповнений вами параметр UTM. Фрагмент наприкінці URL залишається наприкінці.',
  'web.tools.utm.faq.privacy.q': 'Чи надсилається мій URL кудись?',
  'web.tools.utm.faq.privacy.a':
    'Ні. URL складається у вашому браузері і ніколи не залишає цю сторінку.',

  'web.tools.youtubeTitle.title': 'Перевірка довжини заголовка YouTube',
  'web.tools.youtubeTitle.lede':
    'Заголовок, який довший рівно на один символ, відхиляється під час завантаження. Заголовок, який просто довгий, обрізається там, де ви не вибирали.',
  'web.tools.youtubeTitle.explainer.title': 'Два різні обмеження',
  'web.tools.youtubeTitle.explainer.body':
    'Тверда стеля це те, що приймає кінцева точка завантаження. Де показується заголовок це окреме питання: результат пошуку, бічна панель і телефон обрізають заголовок у різних місцях, і жодна з цих точок обрізки не публікується. Цей інструмент вказує задокументовану стелю і показує вам форму вашого заголовка, не вигадуючи число обрізки.',
  'web.tools.youtubeTitle.field.title.label': 'Назва відео',
  'web.tools.youtubeTitle.field.title.help': 'Рахується за графемами, тому емодзі коштує один.',
  'web.tools.youtubeTitle.result.count': '{count} із {limit} символів',
  'web.tools.youtubeTitle.result.over':
    'Перевищення на {over, plural, one {# символ} few {# символи} many {# символів} other {# символа}}. Завантаження було б відхилено.',
  'web.tools.youtubeTitle.result.fits': 'У межах задокументованої стелі.',
  'web.tools.youtubeTitle.result.front':
    'Перші {count} символів несуть найбільшу вагу, тому що це приблизно те, на що вистачає місця у вузькому макеті. Ваш починається так: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'Обмеження заголовка недоступне в цій збірці, тому тут нічого не перевіряється.',
  'web.tools.youtubeTitle.faq.limit.q': 'Звідки береться обмеження?',
  'web.tools.youtubeTitle.faq.limit.a':
    'З офіційного довідника videos insert, згенерованого на цю сторінку з того самого коду конектора, який використовував би наш завантажувач. Дата, коли людина востаннє читала цю сторінку, показана поруч із числом.',
  'web.tools.youtubeTitle.faq.truncation.q': 'Де саме YouTube обрізає заголовок?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'Це залежить від поверхні та області перегляду, і YouTube не публікує для цього кількість символів. Ми показуємо стелю, яка задокументована, і не друкуємо число обрізки, яке було б здогадкою.',
  'web.tools.youtubeTitle.faq.emoji.q': 'Чи рахується емодзі одним символом?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'У цьому лічильнику так, тому що ми рахуємо графеми. Платформа, яка всередині рахує одиниці коду, може стягувати більше за те саме емодзі, тому інструмент попередньої перевірки застосовує кожне правило платформи окремо.',

  'web.tools.timeZone.title': 'Планувальник часових поясів і переходу на літній час',
  'web.tools.timeZone.lede':
    'Щотижневий слот, який виглядає стабільним у вашому календарі, зсувається для половини вашої аудиторії двічі на рік. Це показує де і коли.',
  'web.tools.timeZone.explainer.title': 'Чому фіксований місцевий час не є фіксованим часом',
  'web.tools.timeZone.explainer.body':
    'Час має сенс лише з прикріпленим поясом. Пояси змінюють своє зміщення в дати, які різняться за країнами, і два регіони, які в січні розділені пʼятьма годинами, у квітні можуть бути розділені чотирма. Розклад, збережений як момент плюс пояс, переживає це. Розклад, збережений як місцева година, ні.',
  'web.tools.timeZone.field.date.label': 'Дата',
  'web.tools.timeZone.field.time.label': 'Час',
  'web.tools.timeZone.field.zone.label': 'Ваш пояс',
  'web.tools.timeZone.field.audience.label': 'Пояси аудиторії',
  'web.tools.timeZone.field.audience.help':
    'Виберіть пояси, у яких справді перебувають ваші читачі.',
  'web.tools.timeZone.result.title': 'Той самий момент, усюди, де ви вибрали',
  'web.tools.timeZone.result.empty': 'Виберіть щонайменше один пояс аудиторії.',
  'web.tools.timeZone.result.shift':
    'Перехід на літній час припадає між цією датою і тим самим днем тижня через чотири тижні, тому місцева година зсувається.',
  'web.tools.timeZone.result.stable': 'Немає зміни зміщення протягом наступних чотирьох тижнів.',
  'web.tools.timeZone.result.later': 'Через чотири тижні, {time}.',
  'web.tools.timeZone.result.invalidDate': 'Введіть дату й час, щоб побачити порівняння.',
  'web.tools.timeZone.faq.dst.q': 'У який бік зсувається година?',
  'web.tools.timeZone.faq.dst.a':
    'Це залежить від поясу і напрямку зміни, тому таблиця показує фактичний місцевий час через чотири тижні, а не описує правило. Зміщення для кожного поясу читається з бази даних часових поясів вашого браузера.',
  'web.tools.timeZone.faq.storage.q': 'Як запланована публікація має зберігати свій час?',
  'web.tools.timeZone.faq.storage.a':
    'Як момент плюс обраний людиною пояс IANA, ніколи як наївний місцевий час. Саме так ми робимо всередині, і саме тому публікація, запланована до переведення годинників, усе одно виходить у задуману місцеву годину.',

  'web.tools.engagementRate.title': 'Калькулятор рівня залученості',
  'web.tools.engagementRate.lede':
    'Введіть числа, які вже показує ваша власна панель. Це ділить їх трьома способами і на цьому зупиняється: без еталона, без порогу «добре», нічого, чого в нас насправді немає.',
  'web.tools.engagementRate.explainer.title': 'Чому три знаменники, а не один',
  'web.tools.engagementRate.explainer.body':
    'Охоплення, підписники та покази відповідають на різні питання. Показник за охопленням каже, як відреагували ті, хто справді побачив публікацію. Показник за підписниками каже, яка частка вашої аудиторії залучилася, незалежно від того, чи охопила публікація всіх. Показник за показами рахує кожен перегляд, включно з повторними. Порівняння показника, порахованого одним способом, із показником, порахованим іншим способом, поширене джерело числа залученості, яке виглядає неправильним.',
  'web.tools.engagementRate.field.interactions.label': 'Взаємодії',
  'web.tools.engagementRate.field.interactions.help':
    'Лайки, коментарі, поширення та збереження, додані разом, із публікації, яку ви вимірюєте.',
  'web.tools.engagementRate.field.reach.label': 'Охоплення',
  'web.tools.engagementRate.field.reach.help':
    'Облікові записи, що побачили публікацію принаймні один раз.',
  'web.tools.engagementRate.field.followers.label': 'Підписники',
  'web.tools.engagementRate.field.followers.help': 'Розмір облікового запису на момент публікації.',
  'web.tools.engagementRate.field.impressions.label': 'Покази',
  'web.tools.engagementRate.field.impressions.help':
    'Загальна кількість переглядів, включно з людиною, яка побачила двічі.',
  'web.tools.engagementRate.result.title': 'Рівень залученості, трьома способами',
  'web.tools.engagementRate.result.empty': 'недоступно',
  'web.tools.engagementRate.result.note':
    'Немає універсального доброго показника для порівняння. Він залежить від платформи, формату, розміру аудиторії та галузі, і будь-яке єдине число, запропоноване як еталон, це здогадка, вбрана в дані.',
  'web.tools.engagementRate.basis.reach': 'За охопленням',
  'web.tools.engagementRate.basis.followers': 'За підписниками',
  'web.tools.engagementRate.basis.impressions': 'За показами',
  'web.tools.engagementRate.faq.formula.q': 'Яка фактична формула?',
  'web.tools.engagementRate.faq.formula.a':
    'Взаємодії, поділені на обраний вами знаменник, показані у відсотках. Взаємодії тут означають лайки, коментарі, поширення та збереження, додані разом; деякі платформи повідомляють їх окремо, у такому разі додайте їх самі перед тим, як ввести суму.',
  'web.tools.engagementRate.faq.basis.q': 'Який знаменник мені використовувати?',
  'web.tools.engagementRate.faq.basis.a':
    'Той, який ваша платформа повідомляє разом із публікацією, щоб обидва числа були з одного вікна вимірювання. Порівняння показника за охопленням на одній публікації з показником за підписниками на іншій не є чесним порівнянням, навіть якщо обидва називаються рівнем залученості.',
} as const;
