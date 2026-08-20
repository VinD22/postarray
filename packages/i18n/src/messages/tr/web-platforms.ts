/**
 * The per platform scheduler pages. Only the `web.schedule.*`,
 * `web.meta.schedule.*` and `web.meta.schedulePlatform.*` keys are
 * translated here; the `/specs` cluster (`web.specs.*`, `web.meta.specs.*`,
 * `web.meta.specsPlatform.*`) in `en/web-platforms.ts` is out of this
 * locale's current coverage and falls back to English. See `en/web-platforms.ts`
 * for the rule this file follows: no string here may name a platform, a
 * character ceiling, a file size or a capability; those come only from the
 * generated dataset the page reads.
 */
export const webPlatformsMessages = {
  'web.meta.schedule.title': 'Platform bazında planlama',
  'web.meta.schedule.description':
    'Lansman kohortundaki her platformun bağlı bir hesaptan ne istediği, resmi API’sinin uyguladığı sınırlar ve bu ürünün bunlara karşı ne kadar ilerlediği.',
  'web.meta.schedulePlatform.title': '{platform} için planlama',
  'web.meta.schedulePlatform.description':
    '{platform}’ın bağlı bir hesaptan ne istediği, resmi API’sinin uyguladığı sınırlar ve bu ürünün bunun hangi kısımlarını inşa ettiği.',

  'web.schedule.index.title': 'Platform bazında planlama',
  'web.schedule.index.lede':
    'Lansman kohortundaki her platform için bir sayfa. Her biri platformun bağlı bir hesaptan ne istediğini, resmi API’sinin uyguladığı sınırları ve inşanın nerede olduğunu belirtir. Her sayı, geldiği belgeyi ve birinin onu okuduğu tarihi taşır.',
  'web.schedule.index.listLabel': 'Lansman kohortundaki platformlar',
  'web.schedule.index.cohortNote':
    'Kohort, bu ürünün üzerine inşa edildiği platformlar kümesidir. Bu bir kullanılabilirlik listesi değil, bir plandır.',
  'web.schedule.index.limitsKnown': 'Sınırlar kaydedildi',
  'web.schedule.index.limitsUnknown': 'Sınırlar henüz kaydedilmedi',

  'web.schedule.platform.title': '{platform} için planlama',
  'web.schedule.platform.lede':
    '{platform}’ın bağlı bir hesaptan istediği, resmi API’sinin uyguladığı sınırlar ve bu ürünün şimdiye kadar bunlardan hangilerine karşı inşa edildiği.',

  'web.schedule.notice.title': '{platform}’a henüz hiçbir şey yayınlanmıyor',
  'web.schedule.notice.body':
    'Hiçbir bağlayıcı tamamlanma tanımını geçmedi ve hiçbiri üretimde doğrulanmadı. Bu sayfa, platformun ne istediğini ve bu ürünün neyi desteklemeyi amaçladığını açıklar. Çalışan bir planlayıcıyı açıklamaz.',

  'web.schedule.requirements.title': '{platform}’ın istedikleri',
  'web.schedule.requirements.accountTypes': 'Hesap türü',
  'web.schedule.requirements.restriction': 'Platform kısıtlaması',
  'web.schedule.requirements.cost': 'API maliyeti',
  'web.schedule.requirements.unavailable.title': 'Henüz incelenmiş bağlayıcı kaydı yok',
  'web.schedule.requirements.unavailable.body':
    'Bu platform, son bağlayıcı araştırma turundan sonra kohorta katıldı, bu yüzden gösterilecek tarihli bir hesap gereksinimleri kaydı yok. Biri resmi belgeleri okuyup kaydettiğinde burada görünecek.',
  'web.schedule.requirements.apiSource': 'Resmi API belgeleri',
  'web.schedule.requirements.policySource': 'Platform politikası',

  'web.schedule.limits.title': '{platform}’ın uyguladığı sınırlar',
  'web.schedule.limits.lede':
    'Yükseltilmiş uygunluğu olmayan, yeni bağlanmış bir hesap için okunmuştur. Bir platform bunlardan herhangi birini kimseye söylemeden yükseltebilir veya düşürebilir, bu yüzden her küme okunduğu tarihi taşır.',
  'web.schedule.limits.unavailable.title': '{platform} için sınırlar kaydedilmedi',
  'web.schedule.limits.unavailable.body':
    'Bu sürüm bu platform için bir adaptör içermiyor, bu yüzden gösterilecek kayıtlı bir tavan yok. Uydurulmuş bir sayı, hiç olmamasından daha kötü olurdu.',
  'web.schedule.limits.sourceLabel': 'Resmi platform belgeleri',

  'web.schedule.limits.text': 'Gövde metni',
  'web.schedule.limits.title_field': 'Başlık alanı',
  'web.schedule.limits.countingUnit': 'Karakterler nasıl sayılır',
  'web.schedule.limits.links': 'Bağlantılar nasıl sayılır',
  'web.schedule.limits.images': 'Gönderi başına görsel',
  'web.schedule.limits.videos': 'Gönderi başına video',
  'web.schedule.limits.videoDuration': 'Video uzunluğu',
  'web.schedule.limits.imageBytes': 'En büyük görsel',
  'web.schedule.limits.gifBytes': 'En büyük animasyonlu görsel',
  'web.schedule.limits.videoBytes': 'En büyük video',
  'web.schedule.limits.documentBytes': 'En büyük belge',
  'web.schedule.limits.altText': 'Alternatif metin',
  'web.schedule.limits.mimeTypes': 'Kabul edilen dosya türleri',
  'web.schedule.limits.markdown': 'Biçimlendirme işaretleri',

  'web.schedule.value.characters': '{count, plural, one {# karakter} other {# karakter}}',
  'web.schedule.value.files': '{count, plural, =0 {Yok} one {# dosya} other {# dosya}}',
  'web.schedule.value.durationRange': '{min} ile {max} arası',
  'web.schedule.value.durationMax': '{max} kadar',
  'web.schedule.value.markdownYes': 'Kabul edilir',
  'web.schedule.value.markdownNo': 'Düz karakterler olarak yayınlanır',

  'web.schedule.unit.utf16':
    'UTF-16 kod birimine göre, çoğu editörün karakter sayısı olarak bildirdiği şey budur.',
  'web.schedule.unit.grapheme':
    'Grafeme göre, bu yüzden birkaç kod noktasından oluşan bir emoji hâlâ tek karakter olarak sayılır.',
  'web.schedule.unit.weighted':
    'Çoğu Latin olmayan karakterin bir yerine iki maliyeti olduğu ağırlıklı bir şemaya göre.',

  'web.schedule.link.none': 'Bağlantılar tavana karşı sayılmaz.',
  'web.schedule.link.actual': 'Bir bağlantı, kapladığı karakterler kadar maliyete sahiptir.',
  'web.schedule.link.fixed':
    'Her bağlantı platformun kısaltıcısına yeniden yazılır ve gerçek uzunluğundan bağımsız olarak {count, plural, one {# karakter} other {# karakter}} maliyete sahiptir.',

  'web.schedule.capabilities.title': '{platform} için ne inşa edildi',
  'web.schedule.capabilities.lede':
    '"Platform tarafından sunulmuyor" platform hakkında bir gerçektir ve kesindir. "Henüz inşa edilmedi" bu ürün hakkında bir gerçektir ve hiçbir bağlayıcı tamamlanma tanımını geçmediği sürece dürüst varsayılandır. Burada elle yazılmaz, bağlayıcı kayıt defterinden oluşturulur.',
  'web.schedule.capabilities.unavailable.title': '{platform} için henüz yetenek kaydı yok',
  'web.schedule.capabilities.unavailable.body':
    'Bu sürümde bir adaptör yok, bu yüzden kayıt defterinin bildirecek bir şeyi yok. Söylenecek gerçek bir şey olur olmaz satır yetenek matrisinde görünecek.',
  'web.schedule.capabilities.matrixLink': 'Tam yetenek matrisini oku',

  'web.schedule.next.title': 'Sırada ne var',
  'web.schedule.next.body':
    'Yetenek matrisi, her platformu ve her yeteneği tek bir tabloda taşır. Kullanım örneği sayfaları, bu ürünün etrafında inşa edildiği iş akışlarını açıklar.',
} as const;
