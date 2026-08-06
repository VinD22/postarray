/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Analitik',
  'analytics.subtitle': 'Ne oldu, ne kadar taze ve bundan sonra neyin test edilmeye değer olduğu.',
  'analytics.range.7d': 'Son 7 gün',
  'analytics.range.30d': 'Son 30 gün',
  'analytics.range.90d': 'Son 90 gün',
  'analytics.range.custom': 'Özel aralık',
  'analytics.range.limitedByProvider':
    '{provider} bu hesap için en fazla {days, plural, one {# gün} other {# gün}} geçmişini döndürür.',
  'analytics.account.select': 'Bir hesap seçin',
  'analytics.compareTo': '{baseline} ile karşılaştırıldığında',
  'analytics.baseline.trailingMedian':
    'öncekinin medyanı {count, plural, one {# karşılaştırılabilir gönderi} other {# karşılaştırılabilir gönderi}}',

  'analytics.metric.followers': 'Takipçiler',
  'analytics.metric.subscribers': 'Aboneler',
  'analytics.metric.profileViews': 'Profil görünümleri',
  'analytics.metric.impressions': 'Gösterimler',
  'analytics.metric.reach': 'Erişim',
  'analytics.metric.views': 'Görünümler',
  'analytics.metric.videoViews': 'Video görüntülemeleri',
  'analytics.metric.watchTime': 'İzlenme süresi',
  'analytics.metric.averageViewDuration': 'Ortalama görüntüleme süresi',
  'analytics.metric.averageViewPercentage': 'Görüntülenen ortalama yüzde',
  'analytics.metric.likes': 'Beğeniler ve tepkiler',
  'analytics.metric.comments': 'Yorumlar ve yanıtlar',
  'analytics.metric.shares': 'Paylaşımlar, yeniden gönderiler ve alıntılar',
  'analytics.metric.saves': 'Kaydetmeler ve yer imleri',
  'analytics.metric.linkClicks': 'Bağlantı tıklamaları',
  'analytics.metric.clickThroughRate': 'Tıklama oranı',
  'analytics.metric.engagementRate': 'Etkileşim oranı',
  'analytics.metric.publishedCount': 'Yayınlanan yayınlar',
  'analytics.metric.followerChange': 'Takipçi değişikliği',

  'analytics.definition.title': '{metric} nasıl tanımlanır?',
  'analytics.definition.provider': '{provider} tarafından {providerField} olarak rapor edilir.',
  'analytics.definition.denominator.label': 'Payda: {denominator}.',
  'analytics.definition.unit': 'Birim: {unit}.',
  'analytics.definition.normalized':
    'Sağlayıcı değerinden normalleştirildi. Ham değer tutulur ve kullanılabilir.',
  'analytics.definition.notComparable':
    '{provider} ve {otherProvider} bunu farklı şekilde tanımlamaktadır. Bunları dikkatle karşılaştırın.',

  'analytics.value.unavailable': 'Kullanılamıyor',
  'analytics.value.unavailableReason.permission': 'Bu hesap, bu metrik için gereken izni vermedi.',
  'analytics.value.unavailableReason.unsupported': '{provider} bu ölçümü raporlamaz.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} bu ölçümü daha sonra yayınlar. {time} sonrasında tekrar kontrol edin.',
  'analytics.value.unavailableReason.syncFailed':
    'Son senkronizasyon başarısız oldu. Yeniden deniyoruz ve tahmin edilen bir sayı göstermeyeceğiz.',
  'analytics.freshness.synced': 'Senkronize edildi {relativeTime}',
  'analytics.freshness.stale':
    'Son başarılı senkronizasyon {relativeTime}. Bu güncelliğini kaybetmiş olabilir.',
  'analytics.freshness.coverage':
    "Bu aralıktaki {total} gönderinin {covered}'i güncel verilere sahiptir.",

  'analytics.feedback.title': 'Bu ne anlama geliyor?',
  'analytics.feedback.aboveBaseline':
    "Bu gönderi {baseline}'den {percent} daha fazla {metric} aldı.",
  'analytics.feedback.belowBaseline': "Bu gönderi {baseline}'den {percent} daha az {metric} aldı.",
  'analytics.feedback.notComparableFormats':
    'Resim gönderileri ve video gönderileri burada doğrudan karşılaştırılamaz.',
  'analytics.feedback.smallSample':
    'Örnek küçük. Bir sonuca varmadan önce aynı kancayı tekrar test edin.',
  'analytics.feedback.association':
    "İlk yorum gecikmesi {before}'den {after}'e değiştikten sonra yorumlar arttı. Bu bir dernektir, nedenin kanıtı değil.",
  'analytics.feedback.nextTest': 'Bundan sonra ne test edilecek?',
  'analytics.feedback.doNotInfer': 'Bu neyi göstermiyor',
  'analytics.feedback.noScore':
    'Burada tek bir çapraz platform puanı yok. Güvendiğiniz bir tanıma sahip bir metrik seçin.',

  'analytics.experiment.title': 'Deneyler',
  'analytics.experiment.hypothesis': 'Hipotez',
  'analytics.experiment.variants': 'Varyantlar',
  'analytics.experiment.successMetric': 'Başarı metriği',
  'analytics.experiment.window': 'Ölçüm penceresi',
  'analytics.experiment.status.running': '{date}’a kadar çalışıyor',
  'analytics.experiment.status.complete': 'Tamamlandı',
  'analytics.experiment.tagBeforePublishing':
    'Bir denemeyi yayınlamadan önce etiketleyin, böylece karşılaştırma daha sonra yapılmaz.',
  'analytics.experiment.caveats': 'Uyarılar',

  'analytics.export.title': 'İhracat',
  'analytics.export.csv': "CSV'yi indirin",
  'analytics.export.json': "JSON'u indirin",
  'analytics.export.providerRestriction':
    '{provider} verilerinin nasıl birleştirilebileceğini veya saklanabileceğini kısıtlar. Bazı alanlar dahil değildir.',

  'analytics.links.title': 'İzlenen bağlantılar',
  'analytics.links.subtitle':
    'Birinci taraf yönlendirme ölçümleri. Bunlar bağlantı tıklamalarından ayrı bir dizi platform raporudur.',
  'analytics.links.destination': 'Hedef',
  'analytics.links.shortUrl': 'Kısa URL',
  'analytics.links.totalRequests': 'Toplam istek',
  'analytics.links.humanClicks': 'Tekilleştirilmiş tıklamalar',
  'analytics.links.suspectedBots': 'Şüpheli botlar',
  'analytics.links.referrerClass': 'Yönlendiren',
  'analytics.links.deviceClass': 'Cihaz',
  'analytics.links.country': 'Ülke',
  'analytics.links.lastEvent': 'Son tıklama {relativeTime}',
  'analytics.links.privacyNote':
    'Yalnızca kaba konumu ve cihaz sınıfını koruyoruz. Ham IP adresleri, kötüye kullanım ve kopya tespiti amacıyla kısa süreliğine tutulur, ardından atılır.',
  'analytics.links.separateSources':
    'Bu tıklamaları platformun bildirdiği bir sayıya eklemeyin. Farklı şeyleri sayıyorlar.',
} as const;
