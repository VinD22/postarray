/**
 * Media derivatives: the non-generative editor and the refusals it can hit.
 * See `en/media.ts` for the vocabulary rule this file follows: never
 * "generate", "enhance", "upscale", "restore" or "fix", only "version".
 */
export const mediaMessages = {
  'mediaLib.derivative.heading': 'Отредактировать это изображение',
  'mediaLib.derivative.description':
    'Обрежьте, поверните, измените размер, формат или сожмите. Каждое изменение работает с пикселями, уже имеющимися в вашем файле. Ничего из того, чего не было, не добавляется.',
  'mediaLib.derivative.originalKept':
    'Оригинал никогда не заменяется. Каждое редактирование сохраняется как отдельная версия, которую вы можете выбрать при создании публикации.',
  'mediaLib.derivative.apply': 'Сохранить эту версию',
  'mediaLib.derivative.applying': 'Сохранение этой версии',
  'mediaLib.derivative.discard': 'Отменить изменения',
  'mediaLib.derivative.noChanges': 'Пока нечего сохранять. Измените значение выше.',

  'mediaLib.derivative.tab.crop': 'Обрезка',
  'mediaLib.derivative.tab.transform': 'Поворот и изменение размера',
  'mediaLib.derivative.tab.output': 'Формат',

  'mediaLib.derivative.cropHint':
    'Введите числа или используйте клавиши со стрелками в любом поле. Здесь нет ни одного шага, для которого нужна мышь.',
  'mediaLib.derivative.cropX': 'Левый край, в пикселях',
  'mediaLib.derivative.cropY': 'Верхний край, в пикселях',
  'mediaLib.derivative.cropWidth': 'Ширина обрезки, в пикселях',
  'mediaLib.derivative.cropHeight': 'Высота обрезки, в пикселях',
  'mediaLib.derivative.rotate': 'Повернуть',
  'mediaLib.derivative.rotateNone': 'Без поворота',
  'mediaLib.derivative.rotateDegrees': '{degrees}° по часовой стрелке',
  'mediaLib.derivative.resizeWidth': 'Новая ширина, в пикселях',
  'mediaLib.derivative.resizeHeight': 'Новая высота, в пикселях',
  'mediaLib.derivative.lockRatio': 'Сохранять форму при изменении одной стороны',
  'mediaLib.derivative.format': 'Сохранить как',
  'mediaLib.derivative.formatSame': 'Сохранить текущий формат',
  'mediaLib.derivative.quality': 'Качество',
  'mediaLib.derivative.qualityHint':
    'Более низкое качество уменьшает размер файла. Применяется к JPEG и WebP. PNG работает без потерь и игнорирует этот параметр.',
  'mediaLib.derivative.projected': 'Эта версия будет иметь размер {width} × {height} пикселей.',
  'mediaLib.derivative.projectedUnavailable':
    'Размер этой версии недоступен, пока она не создана.',

  'mediaLib.derivative.listHeading': 'Версии',
  'mediaLib.derivative.original': 'Оригинал',
  'mediaLib.derivative.originalHint': 'Всегда сохраняется. Никогда не перезаписывается.',
  'mediaLib.derivative.item': '{width} × {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Отредактированных версий пока нет. Здесь есть только оригинал.',
  'mediaLib.derivative.select': 'Использовать эту версию',
  'mediaLib.derivative.selected': 'Используется для этой публикации',
  'mediaLib.derivative.useOriginal': 'Использовать оригинал',
  'mediaLib.derivative.processing':
    'Эта версия создаётся. Она появится здесь, когда будет готова.',
  'mediaLib.derivative.alreadyExists':
    'Вы уже делали точно такое же редактирование раньше, поэтому мы повторно использовали ту версию вместо создания второй.',
  'mediaLib.derivative.failedTitle': 'Эту версию не удалось создать',
  'mediaLib.derivative.failedBody':
    'Ничего не было сохранено, и ваш оригинал не тронут. Измените значения и попробуйте снова.',
  'mediaLib.derivative.openEditor': 'Редактировать {name}',

  'mediaLib.derivative.unsupportedTitle': 'Редактирование работает только с изображениями',
  'mediaLib.derivative.unsupportedBody':
    'Видео, аудио и документы здесь редактировать нельзя. Подготовьте файл перед загрузкой. Ваш исходный загруженный файл в любом случае никогда не меняется.',

  'mediaLib.derivative.nonGenerative':
    'Relay не создаёт изображения или видео. Этот редактор только обрезает, поворачивает, изменяет размер, конвертирует и сжимает то, что вы загрузили.',

  'error.media_derivative_no_operations.message':
    'Выберите хотя бы одно изменение, прежде чем сохранить версию.',
  'error.media_derivative_duplicate_operation.message':
    'Каждый вид изменения может встречаться только один раз. Удалите второй {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Эта область обрезки выходит за край изображения, размер которого {sourceWidth} × {sourceHeight} пикселей. Переместите её или сделайте меньше.',
  'error.media_derivative_upscale_rejected.message':
    'Этот редактор никогда не увеличивает изображение, потому что лишние пиксели были бы придуманы, а не вашими. Наибольший возможный размер этой версии: {availableWidth} × {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'Редактирование работает с изображениями JPEG, PNG, WebP и GIF. Этот файл имеет тип {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Мы пока не знаем размер этого изображения, поэтому не можем проверить по нему изменение. Попробуйте снова, когда обработка завершится.',
  'error.media_derivative_format_required.message':
    'Выберите формат для сохранения. Файл {sourceMimeType} нельзя сохранить здесь обратно в том же формате.',
  'error.media_derivative_quality_unsupported.message':
    'PNG работает без потерь, поэтому настройка качества ничего не изменит. Уберите её или сохраните как JPEG либо WebP.',
  'error.media_derivative_no_change.message': 'Это формат, который этот файл уже использует.',
  'error.media_derivative_source_unavailable.message':
    'Файла, из которого должна была получиться эта версия, больше нет в хранилище.',
  'error.media_derivative_preset_mismatch.message':
    'Этот запрос на редактирование не соответствует изменениям, которые он описывает. Ничего не было создано. Попробуйте снова из редактора.',
  'error.media_derivative_empty_result.message':
    'Редактирование не дало изображения, поэтому ничего не сохранено. Ваш оригинал не тронут.',
  'error.media_derivative_transform_failed.message':
    'Это изображение не удалось прочитать или записать. Ничего не сохранено, и ваш оригинал не тронут.',
  'error.media_derivative_write_failed.message':
    'Эту версию не удалось записать. Ничего не сохранено, и ваш оригинал не тронут.',
} as const;
