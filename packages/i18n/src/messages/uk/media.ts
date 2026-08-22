/**
 * Media derivatives: the non-generative editor and the refusals it can hit.
 * See `en/media.ts` for the vocabulary rule this file follows: never
 * "generate", "enhance", "upscale", "restore" or "fix", only "version".
 */
export const mediaMessages = {
  'mediaLib.derivative.heading': 'Редагувати це зображення',
  'mediaLib.derivative.description':
    'Обріжте, поверніть, змініть розмір, формат або стисніть. Кожна зміна працює з пікселями, які вже є у вашому файлі. Нічого з того, чого не було, не додається.',
  'mediaLib.derivative.originalKept':
    'Оригінал ніколи не замінюється. Кожне редагування зберігається як окрема версія, яку можна вибрати під час створення публікації.',
  'mediaLib.derivative.apply': 'Зберегти цю версію',
  'mediaLib.derivative.applying': 'Збереження цієї версії',
  'mediaLib.derivative.discard': 'Скасувати зміни',
  'mediaLib.derivative.noChanges': 'Поки що нічого зберігати. Змініть значення вище.',

  'mediaLib.derivative.tab.crop': 'Обрізка',
  'mediaLib.derivative.tab.transform': 'Поворот і зміна розміру',
  'mediaLib.derivative.tab.output': 'Формат',

  'mediaLib.derivative.cropHint':
    'Введіть числа або скористайтеся клавішами зі стрілками в будь-якому полі. Тут немає жодного кроку, для якого потрібна миша.',
  'mediaLib.derivative.cropX': 'Лівий край, у пікселях',
  'mediaLib.derivative.cropY': 'Верхній край, у пікселях',
  'mediaLib.derivative.cropWidth': 'Ширина обрізки, у пікселях',
  'mediaLib.derivative.cropHeight': 'Висота обрізки, у пікселях',
  'mediaLib.derivative.rotate': 'Повернути',
  'mediaLib.derivative.rotateNone': 'Без повороту',
  'mediaLib.derivative.rotateDegrees': '{degrees}° за годинниковою стрілкою',
  'mediaLib.derivative.resizeWidth': 'Нова ширина, у пікселях',
  'mediaLib.derivative.resizeHeight': 'Нова висота, у пікселях',
  'mediaLib.derivative.lockRatio': 'Зберігати форму при зміні однієї сторони',
  'mediaLib.derivative.format': 'Зберегти як',
  'mediaLib.derivative.formatSame': 'Зберегти поточний формат',
  'mediaLib.derivative.quality': 'Якість',
  'mediaLib.derivative.qualityHint':
    'Нижча якість зменшує розмір файлу. Застосовується до JPEG і WebP. PNG працює без втрат і ігнорує цей параметр.',
  'mediaLib.derivative.projected': 'Ця версія матиме розмір {width} × {height} пікселів.',
  'mediaLib.derivative.projectedUnavailable':
    'Розмір цієї версії недоступний, поки її не створено.',

  'mediaLib.derivative.listHeading': 'Версії',
  'mediaLib.derivative.original': 'Оригінал',
  'mediaLib.derivative.originalHint': 'Завжди зберігається. Ніколи не перезаписується.',
  'mediaLib.derivative.item': '{width} × {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Відредагованих версій ще немає. Тут є лише оригінал.',
  'mediaLib.derivative.select': 'Використати цю версію',
  'mediaLib.derivative.selected': 'Використовується для цієї публікації',
  'mediaLib.derivative.useOriginal': 'Використати оригінал',
  'mediaLib.derivative.processing': 'Ця версія створюється. Вона з’явиться тут, коли буде готова.',
  'mediaLib.derivative.alreadyExists':
    'Ви вже робили точно таке саме редагування раніше, тому ми повторно використали ту версію замість створення другої.',
  'mediaLib.derivative.failedTitle': 'Цю версію не вдалося створити',
  'mediaLib.derivative.failedBody':
    'Нічого не було збережено, і ваш оригінал не зачеплено. Змініть значення та спробуйте знову.',
  'mediaLib.derivative.openEditor': 'Редагувати {name}',

  'mediaLib.derivative.unsupportedTitle': 'Редагування працює лише із зображеннями',
  'mediaLib.derivative.unsupportedBody':
    'Відео, аудіо та документи тут редагувати не можна. Підготуйте файл перед завантаженням. Ваш вихідний завантажений файл у будь-якому разі ніколи не змінюється.',

  'mediaLib.derivative.nonGenerative':
    'Relay не створює зображення чи відео. Цей редактор лише обрізає, повертає, змінює розмір, конвертує та стискає те, що ви завантажили.',

  'error.media_derivative_no_operations.message':
    'Виберіть щонайменше одну зміну, перш ніж зберегти версію.',
  'error.media_derivative_duplicate_operation.message':
    'Кожен вид зміни може з’являтися лише один раз. Видаліть другий {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Ця область обрізки виходить за край зображення, розмір якого {sourceWidth} × {sourceHeight} пікселів. Перемістіть її або зменшіть.',
  'error.media_derivative_upscale_rejected.message':
    'Цей редактор ніколи не збільшує зображення, тому що зайві пікселі були б вигадані, а не вашими. Найбільший можливий розмір цієї версії: {availableWidth} × {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'Редагування працює із зображеннями JPEG, PNG, WebP і GIF. Цей файл має тип {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Ми ще не знаємо розмір цього зображення, тому не можемо перевірити зміну щодо нього. Спробуйте знову, коли обробка завершиться.',
  'error.media_derivative_format_required.message':
    'Виберіть формат для збереження. Файл {sourceMimeType} не можна зберегти тут назад у тому самому форматі.',
  'error.media_derivative_quality_unsupported.message':
    'PNG працює без втрат, тому налаштування якості нічого не змінить. Приберіть його або збережіть як JPEG чи WebP.',
  'error.media_derivative_no_change.message': 'Це формат, який цей файл уже використовує.',
  'error.media_derivative_source_unavailable.message':
    'Файлу, з якого мала б з’явитися ця версія, більше немає в сховищі.',
  'error.media_derivative_preset_mismatch.message':
    'Цей запит на редагування не відповідає змінам, які він описує. Нічого не було створено. Спробуйте знову з редактора.',
  'error.media_derivative_empty_result.message':
    'Редагування не дало зображення, тому нічого не збережено. Ваш оригінал не зачеплено.',
  'error.media_derivative_transform_failed.message':
    'Це зображення не вдалося прочитати або записати. Нічого не збережено, і ваш оригінал не зачеплено.',
  'error.media_derivative_write_failed.message':
    'Цю версію не вдалося записати. Нічого не збережено, і ваш оригінал не зачеплено.',
} as const;
