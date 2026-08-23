/** Ukrainian beta translations for the weekly digest and its email. */
export const digestMessages = {
  'digest.title': 'Цей тиждень',
  'digest.subtitle': 'Ось що ми можемо побачити з {windowStart} по {windowEnd}.',
  'digest.empty': 'Цього тижня поки немає чого підсумовувати. Опублікуйте щось, і це з’явиться тут.',
  'digest.regenerate': 'Перебудувати цей тиждень',
  'digest.generating': 'Створюємо підсумок цього тижня',
  'digest.source.deterministic': 'Створено на основі ваших записів про публікації та власних вимірювань, без помічника написання.',
  'digest.source.ai': 'Створено помічником на основі ваших записів. Кожне число перевірено за ними.',
  'digest.unavailable.aiOff': 'Помічник написання вимкнений, тому це звичайна версія. Нічого не пропущено.',
  'digest.unavailable.rejected': 'Версія помічника не відповідала вашим даним, тому її відхилено. Це звичайна версія.',
  'digest.headline.published':
    '{published, plural, =0 {Не завершено жодної публікації} one {Завершено # публікацію} few {Завершено # публікації} many {Завершено # публікацій} other {Завершено # публікації}} з {windowStart} по {windowEnd}.',
  'digest.headline.nothingPublished': 'З {windowStart} по {windowEnd} нічого не було опубліковано.',
  'digest.outcome.published':
    '{count, plural, one {На платформі {provider} завершено # публікацію} few {На платформі {provider} завершено # публікації} many {На платформі {provider} завершено # публікацій} other {На платформі {provider} завершено # публікації}}.',
  'digest.outcome.partial':
    '{count, plural, one {На платформі {provider} # публікація досягла частини місць призначення, але не інших} few {На платформі {provider} # публікації досягли частини місць призначення, але не інших} many {На платформі {provider} # публікацій досягли частини місць призначення, але не інших} other {На платформі {provider} # публікації досягли частини місць призначення, але не інших}}.',
  'digest.outcome.failed':
    '{count, plural, one {На платформі {provider} не вийшла # публікація} few {На платформі {provider} не вийшли # публікації} many {На платформі {provider} не вийшло # публікацій} other {На платформі {provider} не вийшло # публікації}}.',
  'digest.metrics.noneYet': 'Вимірювання за цей тиждень ще не надійшли. Це означає, що ми не знаємо, як виступили публікації, а не те, що вони виступили погано.',
  'digest.freshness.statement':
    '{label, select, fresh {Вимірювання востаннє синхронізовано о {lastObservedAt}.} stale {Вимірювання не синхронізувалися з {lastObservedAt}, тому наведені вище числа можуть бути застарілими.} other {Ще нічого не синхронізовано, тому вище немає виміряних даних.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Варто знати: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Щотижневий підсумок електронною поштою',
  'digest.settings.description': 'Короткий щотижневий лист про те, що вийшло і що ми змогли виміряти. Увімкнено за замовчуванням.',
  'digest.settings.enabled': 'Надсилати щотижневий підсумок',
  'email.digest.subject': 'Ваш тиждень у {workspaceName}',
  'email.digest.intro':
    'Ось що ми можемо побачити для {workspaceName} з {windowStart} по {windowEnd}.',
  'email.digest.noData':
    'Цього тижня ми нічого не змогли виміряти. Якщо число відсутнє, це тому, що ми не змогли його прочитати, а не тому, що воно дорівнювало нулю.',
  'email.digest.footer':
    'Ви отримуєте цей лист, бо для {workspaceName} увімкнено щотижневий підсумок. Вимкніть його в налаштуваннях робочої області.',
} as const;
