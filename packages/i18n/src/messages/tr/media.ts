/**
 * Media derivatives: the non-generative editor and the refusals it can hit.
 * See `en/media.ts` for the vocabulary rule this file follows: never
 * "generate", "enhance", "upscale", "restore" or "fix", only "version".
 */
export const mediaMessages = {
  'mediaLib.derivative.heading': 'Bu resmi düzenle',
  'mediaLib.derivative.description':
    'Kırpın, döndürün, yeniden boyutlandırın, biçimi değiştirin veya sıkıştırın. Her değişiklik, dosyanızda zaten olan pikseller üzerinde çalışır. Orada olmayan hiçbir şey eklenmez.',
  'mediaLib.derivative.originalKept':
    'Orijinal asla değiştirilmez. Her düzenleme, oluştururken seçebileceğiniz ayrı bir sürüm olarak kaydedilir.',
  'mediaLib.derivative.apply': 'Bu sürümü kaydet',
  'mediaLib.derivative.applying': 'Bu sürüm kaydediliyor',
  'mediaLib.derivative.discard': 'Değişiklikleri at',
  'mediaLib.derivative.noChanges': 'Henüz kaydedilecek bir şey yok. Yukarıdaki bir değeri değiştirin.',

  'mediaLib.derivative.tab.crop': 'Kırp',
  'mediaLib.derivative.tab.transform': 'Döndür ve yeniden boyutlandır',
  'mediaLib.derivative.tab.output': 'Biçim',

  'mediaLib.derivative.cropHint':
    'Sayıları yazın veya herhangi bir alanda ok tuşlarını kullanın. Burada fareye ihtiyaç duyan bir adım yok.',
  'mediaLib.derivative.cropX': 'Sol kenar, piksel cinsinden',
  'mediaLib.derivative.cropY': 'Üst kenar, piksel cinsinden',
  'mediaLib.derivative.cropWidth': 'Kırpma genişliği, piksel cinsinden',
  'mediaLib.derivative.cropHeight': 'Kırpma yüksekliği, piksel cinsinden',
  'mediaLib.derivative.rotate': 'Döndür',
  'mediaLib.derivative.rotateNone': 'Döndürme yok',
  'mediaLib.derivative.rotateDegrees': 'Saat yönünde {degrees} derece',
  'mediaLib.derivative.resizeWidth': 'Yeni genişlik, piksel cinsinden',
  'mediaLib.derivative.resizeHeight': 'Yeni yükseklik, piksel cinsinden',
  'mediaLib.derivative.lockRatio': 'Bir kenarı değiştirdiğimde şekli koru',
  'mediaLib.derivative.format': 'Farklı kaydet',
  'mediaLib.derivative.formatSame': 'Mevcut biçimi koru',
  'mediaLib.derivative.quality': 'Kalite',
  'mediaLib.derivative.qualityHint':
    'Düşük kalite daha küçük bir dosya oluşturur. JPEG ve WebP için geçerlidir. PNG kayıpsızdır ve bunu yok sayar.',
  'mediaLib.derivative.projected': 'Bu sürüm {width} x {height} piksel olacak.',
  'mediaLib.derivative.projectedUnavailable':
    'Bu sürümün boyutu, oluşturulana kadar kullanılamaz.',

  'mediaLib.derivative.listHeading': 'Sürümler',
  'mediaLib.derivative.original': 'Orijinal',
  'mediaLib.derivative.originalHint': 'Her zaman saklanır. Asla üzerine yazılmaz.',
  'mediaLib.derivative.item': '{width} x {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Henüz düzenlenmiş sürüm yok. Buradaki tek dosya orijinal.',
  'mediaLib.derivative.select': 'Bu sürümü kullan',
  'mediaLib.derivative.selected': 'Bu gönderi için kullanılıyor',
  'mediaLib.derivative.useOriginal': 'Orijinali kullan',
  'mediaLib.derivative.processing': 'Bu sürüm oluşturuluyor. Hazır olduğunda burada görünür.',
  'mediaLib.derivative.alreadyExists':
    'Bu tam düzenlemeyi daha önce yapmıştınız, bu yüzden ikinci bir tane oluşturmak yerine o sürümü yeniden kullandık.',
  'mediaLib.derivative.failedTitle': 'Bu sürüm oluşturulamadı',
  'mediaLib.derivative.failedBody':
    'Hiçbir şey kaydedilmedi ve orijinaliniz değişmedi. Değerleri değiştirip tekrar deneyin.',
  'mediaLib.derivative.openEditor': '{name} düzenle',

  'mediaLib.derivative.unsupportedTitle': 'Düzenleme yalnızca resimlerde çalışır',
  'mediaLib.derivative.unsupportedBody':
    'Video, ses ve belgeler burada düzenlenemez. Dosyayı yüklemeden önce hazırlayın. Orijinal yüklemeniz her iki durumda da asla değişmez.',

  'mediaLib.derivative.nonGenerative':
    'Relay resim veya video üretmez. Bu düzenleyici yalnızca yüklediğinizi kırpar, döndürür, yeniden boyutlandırır, dönüştürür ve sıkıştırır.',

  'error.media_derivative_no_operations.message':
    'Bir sürüm kaydetmeden önce en az bir değişiklik seçin.',
  'error.media_derivative_duplicate_operation.message':
    'Her değişiklik türü yalnızca bir kez görünebilir. İkinci {operation} öğesini kaldırın.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Bu kırpma, {sourceWidth} x {sourceHeight} piksel olan resmin kenarının ötesine geçiyor. Taşıyın veya küçültün.',
  'error.media_derivative_upscale_rejected.message':
    'Bu düzenleyici bir resmi asla büyütmez, çünkü ekstra pikseller sizinki yerine uydurulmuş olur. Bu sürümün olabileceği en büyük boyut {availableWidth} x {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'Düzenleme JPEG, PNG, WebP ve GIF resimlerinde çalışır. Bu dosya {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Bu resmin boyutunu henüz bilmiyoruz, bu yüzden değişikliği ona göre kontrol edemeyiz. İşleme bittiğinde tekrar deneyin.',
  'error.media_derivative_format_required.message':
    'Farklı kaydetmek için bir biçim seçin. Bir {sourceMimeType} dosyası burada kendisi olarak geri kaydedilemez.',
  'error.media_derivative_quality_unsupported.message':
    'PNG kayıpsızdır, bu yüzden bir kalite ayarı hiçbir şey yapmaz. Kaldırın veya JPEG ya da WebP olarak kaydedin.',
  'error.media_derivative_no_change.message': 'Bu dosyanın zaten kullandığı biçim bu.',
  'error.media_derivative_source_unavailable.message':
    'Bu sürümün geleceği dosya artık depoda değil.',
  'error.media_derivative_preset_mismatch.message':
    'Bu düzenleme isteği, tanımladığı değişikliklerle eşleşmiyor. Hiçbir şey oluşturulmadı. Düzenleyiciden tekrar deneyin.',
  'error.media_derivative_empty_result.message':
    'Düzenleme herhangi bir resim üretmedi, bu yüzden hiçbir şey kaydedilmedi. Orijinaliniz değişmedi.',
  'error.media_derivative_transform_failed.message':
    'Bu resim okunamadı veya yazılamadı. Hiçbir şey kaydedilmedi ve orijinaliniz değişmedi.',
  'error.media_derivative_write_failed.message':
    'Bu sürüm kaydedilemedi. Hiçbir şey kaydedilmedi ve orijinaliniz değişmedi.',
} as const;
