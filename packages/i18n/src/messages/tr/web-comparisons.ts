/**
 * The comparison pages' chrome. See `en/web-comparisons.ts` for what belongs
 * here versus the claims themselves, which are not translated in this file.
 */
export const webComparisonMessages = {
  'web.comparison.eyebrow': 'Karşılaştırma',

  'web.comparison.state.yes': 'Evet',
  'web.comparison.state.no': 'Hayır',
  'web.comparison.state.partial': 'Kısmen',
  'web.comparison.state.notVerified': 'Doğrulanmadı',

  'web.comparison.label.claim': 'İddia',
  'web.comparison.label.sourceRead': '{date} tarihinde okundu',
  'web.comparison.label.checked': 'Her satır {date} tarihinde kontrol edildi',
  'web.comparison.label.nextReview': 'Sonraki kontrol {date} tarihinde',
  'web.comparison.label.backToIndex': 'Tüm karşılaştırmalar',

  'web.comparison.table.title': 'Her seçenek ne yapar',
  'web.comparison.table.caption':
    'Her yanıtın arkasındaki kaynakla birlikte, satır başına bir iddia',

  'web.comparison.bestFor.title': 'Hangisi uyuyor',
  'web.comparison.bestFor.ours': 'Şu durumda bu ürünü seçin',
  'web.comparison.bestFor.alternative': 'Şu durumda {name} seçin',

  'web.comparison.notDo.title': 'Bu ürünün yapmadığı şeyler',
  'web.comparison.notDo.body':
    'Bu cümleler, onları belirleyen koddan okunur, elle yazılmaz, bu yüzden bu bölüm bugün ürünün gerçekte ne olduğundan sapamaz.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {Hiçbir bağlayıcı sağlayıcı doğrulamasını tamamlamadı, bu yüzden bugün bu ürün üzerinden hiçbir platforma hiçbir şey yayınlanmıyor.} one {# bağlayıcı sağlayıcı doğrulamasını tamamladı. Kohorttaki diğer her platform hâlâ niyet aşamasında.} other {# bağlayıcı sağlayıcı doğrulamasını tamamladı. Kohorttaki diğer her platform hâlâ niyet aşamasında.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {Hiçbir dil insan incelemesini tamamlamadı, bu yüzden arayüzdeki her dil beta olarak etiketlenmiştir.} one {# dil insan incelemesini tamamladı. Diğer her dil beta olarak etiketlenmiştir.} other {# dil insan incelemesini tamamladı. Diğer her dil beta olarak etiketlenmiştir.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Her fiyatlandırma katmanına karar verildi ve gerçek bir fiyat taşıyor.} one {# fiyatlandırma katmanı hâlâ kararlaştırılmamış bir yer tutucu ve satın alınamaz.} other {# fiyatlandırma katmanı hâlâ kararlaştırılmamış birer yer tutucu ve satın alınamaz.}}',

  'web.comparison.notVerified.title': 'Doğrulanmadı ne anlama gelir',
  'web.comparison.notVerified.body':
    'Bir hücre, gerçek diğer seçeneğin resmi genel belgelerinde kontrol günü okunamadığında doğrulanmadı der. Asla hafızadan doldurulmaz ve asla başkasının yazdığı bir özetten kopyalanmaz.',

  'web.comparison.method.title': 'Bu sayfa nasıl hazırlanır',
  'web.comparison.method.body':
    'Her satır tek bir iddiadır, geldiği belge ve birinin onu okuduğu tarihle birlikte. Rakip ekran görüntüsü yok, kopyalanmış özellik ifadesi yok ve uydurulmuş zayıflık yok.',
  'web.comparison.method.cadence':
    'Her karşılaştırma en az 90 günde bir yeniden kontrol edilir ve bir platform veya seçenek bir satırın belirttiği bir şeyi değiştirdiğinde hemen kontrol edilir.',

  'web.comparison.questions.title': 'Sorular',
  'web.comparison.sources.title': 'Bu sayfada belirtilen kaynaklar',

  'web.comparison.index.title': 'Yayınlanan karşılaştırmalar',
  'web.comparison.index.body':
    'Her sayfa bu ürünü, gerçekleri resmi belgelerden okunabilen bir alternatif kategorisiyle karşılaştırır. Adlandırılmış bir ürün, güncel gerçekleri kendi genel sayfalarından okunabildiğinde bir sayfa alır, öncesinde değil.',
  'web.comparison.index.checked': '{date} tarihinde kontrol edildi',
} as const;
