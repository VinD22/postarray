/**
 * The blog's page chrome. See `en/web-blog.ts` for what belongs here versus
 * article prose, which is not translated in this file.
 */
export const webBlogMessages = {
  'web.blog.meta.title': 'Yayıncılık operasyonları üzerine yazılar',
  'web.blog.meta.description':
    'Gönderi sıklığı, planlama modelleri, saat dilimleri, platforma özgü uyarlama ve müşteri işini ayrı projeler olarak yürütme üzerine yazılar.',

  'web.blog.title': 'Yazılar',
  'web.blog.lede':
    'Yayıncılık işinin işleyişi üzerine notlar: bir planın nasıl boyutlandırıldığı, bir hafta kaydığında kuyruğun nasıl davrandığı, platformlar arasında gerçekte ne değiştiği ve müşteri işinin nasıl ayrı tutulduğu.',

  'web.blog.notice.prelaunch.title':
    'Bu yazılar sorunla ilgili, henüz kullanabileceğiniz bir ürünle ilgili değil',
  'web.blog.notice.prelaunch.body':
    'Buradaki hiçbir bağlayıcı sağlayıcı doğrulamasını tamamlamadı, bu yüzden bugün bu ürün üzerinden hiçbir platforma hiçbir şey yayınlanmıyor. Aşağıdaki her platform kuralı, geldiği resmi belgeyi ve birinin onu okuduğu tarihi taşır.',

  'web.blog.cluster.cadence': 'Sıklık',
  'web.blog.cluster.scheduling': 'Planlama',
  'web.blog.cluster.adaptation': 'Platforma özgü uyarlama',
  'web.blog.cluster.operations': 'Ajans operasyonları',
  'web.blog.cluster.developers': 'API üzerinden entegrasyon',

  'web.blog.label.published': '{date} tarihinde yayınlandı',
  'web.blog.label.updated': '{date} tarihinde güncellendi',
  'web.blog.label.writtenBy': 'Yazan: {name}',
  'web.blog.label.reviewedBy': 'İnceleyen: {name}',
  'web.blog.label.sources': 'Kaynaklar',
  'web.blog.label.sourceRead': '{date} tarihinde okundu',
  'web.blog.label.cluster': 'Konu',
  'web.blog.label.articleList': 'Yazılar',
  'web.blog.label.backToIndex': 'Tüm yazılar',
  'web.blog.label.count': '{count, plural, =0 {Henüz yazı yok} one {# yazı} other {# yazı}}',

  'web.blog.byline.editorial.name': 'Yayıncılık araştırma masası',
  'web.blog.byline.editorial.role': 'Bu yazıları yazar ve günceller',
  'web.blog.byline.platform.name': 'Platform belgeleri masası',
  'web.blog.byline.platform.role': 'Her platform cümlesini resmi kaynağına göre kontrol eder',

  'web.blog.feed.title': 'Yayıncılık operasyonları üzerine yazılar',
  'web.blog.feed.description':
    'Gönderi sıklığı, planlama modelleri, saat dilimleri, platforma özgü uyarlama ve ajans operasyonları üzerine yeni yazılar.',
  'web.blog.feed.label': 'RSS beslemesi',

  'web.blog.empty.title': 'Burada henüz yayınlanmış bir şey yok',
  'web.blog.empty.body': 'İlk yazılar yazılıyor. Yayınlandıklarında besleme onları taşıyacak.',

  'web.blog.label.language': 'Bunu şu dilde oku',
  'web.blog.label.notTranslated':
    'Bu yazı henüz dilinizde yazılmadı. İngilizce sürüm gösteriliyor.',
  'web.blog.label.languageCount': '{count, plural, one {# dil} other {# dil}}',
} as const;
