/**
 * Web surface strings for Analytics, Automation Rules, RSS autopost and
 * tracked links.
 *
 * `analytics.ts` and `automation.ts` hold the domain vocabulary shared by every
 * surface (metric names, trigger sentences, provider caveats). This file holds
 * what only the web screens need: column headings, filter labels, wizard steps,
 * the sentence builder chrome and the per screen empty, error, offline,
 * permission and rate limit copy.
 *
 * Every leaf name here is new. Nothing in this file overwrites a key defined in
 * `analytics.ts` or `automation.ts`, which is asserted by `lint.test.ts`.
 */
export const webAnalyticsMessages = {
  /* ======================================================================
     Analytics shell
     ====================================================================== */
  'analytics.chart.legend': 'Bu grafikte gösterilen seriler',
  'analytics.tab.overview': 'Genel Bakış',
  'analytics.tab.experiments': 'Deneyler',
  'analytics.tab.links': 'İzlenen bağlantılar',
  'analytics.tab.label': 'Analitik bölümleri',

  'analytics.question.baseline': 'Hangi gönderiler kendi temel çizginizden uzaklaştı?',
  'analytics.question.baselineHelp':
    'Her gönderi, aynı hesaptaki ve aynı formattaki son gönderilerinizle karşılaştırılır. Buradaki hiçbir şey sizi başka bir çalışma alanıyla veya başka bir şirketle karşılaştıramaz.',
  'analytics.question.accounts': 'Hangi hesaplara dikkat edilmesi gerekiyor?',
  'analytics.question.next': 'Bundan sonra test etmeye değer olan şey nedir?',

  'analytics.filter.project': 'Proje',
  'analytics.filter.accounts': 'Hesaplar',
  'analytics.filter.allAccounts': 'Bağlı tüm hesaplar',
  'analytics.filter.range': 'Tarih aralığı',
  'analytics.filter.format': 'İçerik formatı',
  'analytics.filter.allFormats': 'Tüm formatlar',
  'analytics.filter.comparePrevious': 'Önceki dönemle karşılaştırın',
  'analytics.filter.applied':
    '{count, plural, =0 {Filtre yok} one {# filtre} other {# filtre}} uygulandı. {results, plural, =0 {Eşleşen gönderi yok} one {# gönderi eşleşmesi} other {# gönderi eşleşiyor}}.',

  'analytics.rankMetric.label': 'Gönderileri şuna göre sırala:',
  'analytics.rankMetric.help':
    'Bayrak Yarışında birleşik puan yoktur. Tanımına güvendiğiniz bir metrik seçin ve tablo yalnızca bu metriğe göre sıralanır.',
  'analytics.rankMetric.chosen':
    'Her hesap sağlayıcının bildirdiği şekilde {metric} ile sıralanmıştır.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Farkındalık',
  'analytics.outcome.awarenessHelp':
    'Gönderinin kaç kez teslim edildiği veya görüldüğü. Sağlayıcılar bunu farklı şekilde sayar, dolayısıyla bir değer yalnızca zaman içinde kendisiyle karşılaştırılabilir.',
  'analytics.outcome.consumption': 'Tüketim',
  'analytics.outcome.consumptionHelp': 'İnsanların gönderinin ne kadarını izlediği veya okuduğu.',
  'analytics.outcome.interaction': 'Etkileşim',
  'analytics.outcome.interactionHelp':
    'İnsanların platformda yaptıkları: beğenmeler, yorumlar, paylaşımlar ve kaydetmeler.',
  'analytics.outcome.conversion': 'Dönüşüm',
  'analytics.outcome.conversionHelp':
    'İnsanların platformdan ayrıldıktan sonra yaptıkları. Yalnızca izlenen bağlantılar buna yanıt verebilir ve yalnızca izlemeyi seçtiğiniz bağlantılar için.',
  'analytics.outcome.separateNote':
    'Bu dört grup ayrı ayrı sayılır. Bunları bir araya getirmek aynı kişiyi birden fazla sayar.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Seçilen aralıkta yayınlanan gönderiler; her biri kendi güncel referansınızla karşılaştırılır.',
  'analytics.table.post': 'Gönderi',
  'analytics.table.account': 'Hesap',
  'analytics.table.format': 'Biçim',
  'analytics.table.published': 'Yayınlandı',
  'analytics.table.value': 'Değer',
  'analytics.table.delta': 'Taban çizgisine karşı',
  'analytics.table.sample': 'Örnek',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Kanıt',
  'analytics.table.openEvidence': '{post} için kanıt gösterin',
  'analytics.table.rowActions': '{post} için eylemler',
  'analytics.table.openPost': 'Gönderi metriklerini aç',
  'analytics.table.openReceipt': 'Yayın makbuzunu aç',
  'analytics.table.noBaseline': 'Henüz temel çizgi yok',
  'analytics.table.noBaselineReason':
    "Bu hesapta karşılaştırılabilir gönderilerin sayısı {required}'dan azdır. Bir karşılaştırma gürültü olacaktır, dolayısıyla hiçbiri gösterilmemiştir.",
  'analytics.table.sortBy': "{column}'a göre sırala",
  'analytics.table.detailToggle': 'Ayrıntılar',

  'analytics.delta.above': '{percent} taban çizgisinin üzerinde',
  'analytics.delta.below': '{percent} taban çizgisinin altında',
  'analytics.delta.level': 'Temel çizgiye uygun olarak',
  'analytics.delta.unavailable': 'Karşılaştırma yok',

  'analytics.evidence.title': 'Bu karşılaştırma nasıl yapıldı?',
  'analytics.evidence.baseline':
    "Temel değer: {account}'deki önceki {count, plural, one {# karşılaştırılabilir gönderi} other {# karşılaştırılabilir gönderi}} medyanı {metric}.",
  'analytics.evidence.comparableBy':
    'Karşılaştırılabilir, aynı hesap, aynı içerik formatı ({format}) ve aynı dönemde yayınlanma zamanı anlamına gelir.',
  'analytics.evidence.postsUsed': 'Temel için kullanılan gönderiler',
  'analytics.evidence.excluded':
    '{count, plural, =0 {Hiçbir gönderi hariç tutulmadı} one {# gönderi hariç tutuldu} other {# gönderi hariç tutuldu}} çünkü ölçüm onlar için mevcut değildi.',
  'analytics.evidence.smallSample':
    'Taban çizgisinde {count, plural, one {# gönderi} other {# gönderi}} ile olağandışı tek bir gönderi medyanı uzun bir mesafeye taşır. Bunu bir sonuç olarak değil, tekrar test edilecek bir sinyal olarak değerlendirin.',
  'analytics.evidence.confounders': 'Bu neyi açıklamıyor',
  'analytics.evidence.confounder.time':
    'Günün yayınlanma saati temel gönderilere göre değişiklik gösteriyordu.',
  'analytics.evidence.confounder.format':
    'Resim gönderileri ve video gönderileri burada doğrudan karşılaştırılamaz.',
  'analytics.evidence.confounder.followers':
    'Bu dönemde {account} takipçi sayısı {percent} değişti.',
  'analytics.evidence.confounder.paid':
    'Relay, bu gönderilerden herhangi birinin ücretli dağıtım alıp almadığını söyleyemez.',
  'analytics.evidence.confounder.provider':
    '{provider} bu dönemde {metric} raporlama şeklini değiştirdi.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': '{metric} ne anlama geliyor?',
  'analytics.definition.inlineHeading': 'Tanım',
  'analytics.definition.observedAt': '{dateTime} gözlemlendi.',
  'analytics.definition.sourceLink': 'Sağlayıcı belgeleri',
  'analytics.definition.verifiedOn': '{date} ile ilgili sağlayıcı belgelerine göre kontrol edildi.',
  'analytics.definition.panelTitle': 'Bu görünümdeki metrik tanımları',
  'analytics.definition.panelIntro':
    'Bu ekrandaki her numara, adlandırılmış bir sağlayıcı alanından gelir. Aşağıdaki tanımlar her değerin yanında tekrarlanmıştır, dolayısıyla önemli hiçbir şey yalnızca bir araç ipucunda yer almaz.',
  'analytics.definition.aggregation.sum': 'Her gözlem eklenerek toplanır.',
  'analytics.definition.aggregation.average': 'Ortalama olarak toplanmıştır.',
  'analytics.definition.aggregation.median': 'Medyan olarak toplanmıştır.',
  'analytics.definition.aggregation.last': 'En yeni gözlem.',
  'analytics.definition.aggregation.delta': 'İlk ve son gözlem arasındaki değişiklik.',
  'analytics.definition.aggregation.none': 'Tek bir gözlem olarak rapor edilmiştir.',
  'analytics.definition.denominator.none': 'Bu bir oran değil, bir sayımdır.',
  'analytics.definition.historyWindow':
    '{provider} bu alan için {days, plural, one {# gün} other {# gün}} geçmişi tutar.',
  'analytics.definition.historyWindowNone': '{provider} bu alan için bir geçmiş sınırı belirtmez.',

  'analytics.definition.term.providerField': 'Sağlayıcı alanı',
  'analytics.definition.term.unit': 'Birim',
  'analytics.definition.term.denominator': 'Payda',
  'analytics.definition.term.aggregation': 'Nasıl toplanır?',
  'analytics.definition.term.history': 'Sağlayıcının tuttuğu geçmiş',
  'analytics.definition.term.definition': 'Sağlayıcı bunun ne anlama geldiğini söylüyor',

  'analytics.unit.count': 'Bir dizi olay',
  'analytics.unit.seconds': 'Saniye',
  'analytics.unit.percent': 'Sağlayıcının önceden hesapladığı yüzde',
  'analytics.unit.ratio': 'İki sağlayıcı alanından hesaplanan bir oran Rölesi',
  'analytics.unit.currency_minor': 'Küçük birimler halinde bir miktar para',

  'analytics.denominator.none': 'Bu bir oran değil, bir sayımdır. Paydası yoktur.',
  'analytics.denominator.impressions': 'Gösterimlere bölünmüş',
  'analytics.denominator.reach': 'Erişime göre bölünmüş',
  'analytics.denominator.views': 'Görünümlere göre bölünmüş',
  'analytics.denominator.followers': 'Gözlem anındaki takipçi sayısına bölünür',
  'analytics.denominator.sessions': 'Oturumlara bölünmüş',

  'analytics.format.text': 'Metin',
  'analytics.format.image': 'Resim',
  'analytics.format.carousel': 'Atlıkarınca',
  'analytics.format.video': 'video',
  'analytics.format.short_video': 'Kısa video',
  'analytics.format.long_video': 'Uzun video',
  'analytics.format.document': 'Belge',
  'analytics.format.thread': 'Konu',

  'analytics.value.unavailableReason.notImplemented':
    'Röle henüz bu ölçüm için eşlemeyi {provider} üzerinde oluşturmadı.',
  'analytics.value.estimated': 'Tahmini',
  'analytics.value.estimatedMethod': 'Yöntem: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'Bu sayıların nereden geldiği',
  'analytics.freshness.intro':
    'Sağlayıcılar kendi programlarına göre toplanırlar. Bu ekrandaki hiçbir şey canlı değil.',
  'analytics.freshness.accountRow': '{account} {provider}’de',
  'analytics.freshness.never': 'Hiçbir zaman senkronize edilmedi',
  'analytics.freshness.nextAttempt': 'Sonraki senkronizasyon denemesi {relativeTime}.',
  'analytics.freshness.openStatus': 'Sağlayıcı durumu',

  'analytics.accounts.title': 'Dikkat edilmesi gereken hesaplar',
  'analytics.accounts.empty':
    'Bağlı her hesap bu dönemde veri döndürdü. Burada hiçbir şeyin sana ihtiyacı yok.',
  'analytics.accounts.reason.permission': 'Bu hesap bağlandığında analiz izni verilmedi.',
  'analytics.accounts.reason.expired':
    "Erişimin süresi dolduğu için {date}'dan bu yana hiçbir ölçüm toplanmadı.",
  'analytics.accounts.reason.stale': 'Son başarılı senkronizasyon {relativeTime} idi.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# senkronizasyon denemesi} other {# senkronizasyon denemesi}} arka arkaya başarısız oldu. Kaydedilen neden {reason} idi.',
  'analytics.accounts.reason.noPosts': 'Seçilen aralıkta bu hesapta hiçbir şey yayınlanmadı.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Gözlemler',
  'analytics.observations.intro':
    'Bunlar sayıların gösterdiği şeylerin açıklamalarıdır. Bunlar tahmin değildir ve sebep oluşturmazlar.',
  'analytics.observations.empty':
    'Henüz bir modeli tanımlamaya yetecek kadar yayınlanmış tarih yok. Aynı hesapta ve formatta birkaç gönderi daha yayınlayın.',
  'analytics.observations.citedPosts': 'dayalı',
  'analytics.observations.citedPeriod': 'Dönem: {start} ile {end} arası.',
  'analytics.observations.nextTestTitle': 'Bir sonraki adımda gerçekleştirebileceğiniz bir test',
  'analytics.observations.nextTestBody':
    "Yalnızca {variable}'yi değiştirerek {count, plural, one {# gönderi daha} other {# gönderi daha}} {account}'de yayınlayın, ardından aynı ölçümü karşılaştırın. Karşılaştırmanın sonradan bulunması yerine planlanması için yayınlamadan önce bunu bir deneme olarak etiketleyin.",
  'analytics.observations.tagFirst': 'Bir denemeyi etiketleme',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} zamanla',
  'analytics.chart.summary':
    "{metric} {account}'de, {count, plural, one {# puan} other {# puan}} {start}'den {end}'ye.",
  'analytics.chart.showTable': 'Tablo olarak göster',
  'analytics.chart.hideTable': 'Tabloyu gizle',
  'analytics.chart.tableCaption': 'Tabloyla aynı seri.',
  'analytics.chart.columnPeriod': 'Dönem',
  'analytics.chart.columnValue': 'Değer',
  'analytics.chart.gapLabel': 'Veri toplanmadı',
  'analytics.chart.gapExplained':
    'Hattaki bir kesinti, o dönem için hiçbir gözlemin toplanmadığı anlamına gelir. Sıfır anlamına gelmez.',
  'analytics.chart.annotation': 'Ek açıklama',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'Bu aralıkta hiçbir gözlem toplanmadı.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Bir deneme planlayın',
  'analytics.experiment.empty':
    'Henüz deney yok. Deneme, yayınlamadan önce karar verdiğiniz bir karşılaştırmadır ve bir soruyu yanıtlayabilecek tek türdür.',
  'analytics.experiment.emptyExample':
    "Örnek: aynı duyuruyu X'te iki kez yayınlayın; bir kez gönderideki bağlantıyla ve bir kez de ilk yorumdaki bağlantıyla birlikte, ardından 72 saat içindeki bağlantı tıklamalarını karşılaştırın.",
  'analytics.experiment.name': 'Neyi test ediyorsun',
  'analytics.experiment.namePlaceholder': 'İlk yorum 30 dakikaya karşı 5 dakika sonra',
  'analytics.experiment.hypothesisPlaceholder':
    "İlk yorumdan önce daha kısa bir gecikme X'te daha fazla yanıt alır.",
  'analytics.experiment.variantLabel': 'Varyant {index}',
  'analytics.experiment.variantDescription': 'Bu varyantta farklı olan nedir?',
  'analytics.experiment.addVariant': 'Bir varyant ekleyin',
  'analytics.experiment.removeVariant': '{index} varyantını kaldır',
  'analytics.experiment.accounts': 'Hesaplar dahil',
  'analytics.experiment.windowHelp':
    'Bir gönderi yayınlandıktan sonra ölçümler değişmeye devam eder. Karşılaştırmanın tek bir değişkene uygun bir anda yapılmaması için pencereyi şimdi düzeltin.',
  'analytics.experiment.windowDays':
    'Her gönderinin yayınlanmasından sonra {count, plural, one {# gün} other {# gün}} ölçüm yapın',
  'analytics.experiment.minSample': 'Varyant başına minimum gönderiler',
  'analytics.experiment.minSampleHelp':
    'Bu sayının altında sonuç, kazanan olarak değil, sonuçsuz olarak gösterilir.',
  'analytics.experiment.status.planned': 'Planlanan',
  'analytics.experiment.status.collecting':
    "Toplama. {target} gönderiden {published}'i yayınlandı.",
  'analytics.experiment.status.inconclusive': 'Tamamlandı, belirgin bir fark yok',
  'analytics.experiment.result.difference':
    "{variant} {otherVariant}'den {percent} daha fazla {metric} kaydetti.",
  'analytics.experiment.result.noDifference':
    'İki değişken {metric} üzerinde birbirinin {percent} yakınındadır. Bu, bu gönderilerin yine de değişiklik gösterdiği aralığın içindedir.',
  'analytics.experiment.result.association':
    'Bu, {count, plural, one {# gönderi} other {# gönderi}} üzerinden ölçülen bir ilişkidir. Değişikliğin farklılığa neden olduğunu kanıtlamaz.',
  'analytics.experiment.result.unavailable':
    '{metric} bu denemede {count, plural, one {# gönderi} other {# gönderi}} için kullanılamadığından bu gönderiler sıfır olarak sayılmak yerine hariç tutulmuştur.',
  'analytics.experiment.result.title': 'Sonuç',
  'analytics.experiment.completeNow': 'Bu denemeyi kapat',
  'analytics.experiment.completeConfirm':
    'Kapanış toplama işlemini durdurur. Gönderiler yayınlanmaya devam eder ve sayılar mevcut kalır.',
  'analytics.experiment.postsTitle': 'Bu denemedeki gönderiler',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Seçilen hesaplar için analizler yükleniyor',
  'analytics.state.loadingProvider': '{provider} analizleri getiriliyor',
  'analytics.state.empty': 'Bu aralıkta yayınlanmış hiçbir şey yok',
  'analytics.state.emptyBody':
    'Analytics, halihazırda yayınlanmış gönderileri tanımlar. Bir şeyler yayınlayın veya tarih aralığını genişletin.',
  'analytics.state.emptyExample':
    'Bir gönderi yayına girdiğinde şöyle bir satır göreceksiniz: X @acme, "Başlık başlat", 12.400 gösterim, önceki 10 ortalamanızın yüzde 58 üzerinde.',
  'analytics.state.errorTitle': 'Analiz yüklenemedi',
  'analytics.state.errorBody':
    'Tahmin edilen bir sayı yerine hiçbir sayı gösterilmiyor. Gönderileriniz ve makbuzlarınız etkilenmez.',
  'analytics.state.partialTitle': "{total} hesaptan {loaded}'i veri döndürdü",
  'analytics.state.partialBody':
    'Cevaplanan hesaplar kendi tazelikleriyle gösterilmektedir. Geri kalanlar ise yapmama nedenleri ile birlikte listelenmiştir.',
  'analytics.state.partialSucceeded': 'Döndürülen veriler',
  'analytics.state.partialFailed': 'Veri döndürmedi',
  'analytics.state.offlineTitle': 'Çevrimdışısınız',
  'analytics.state.offlineBody':
    'Aşağıdaki rakamlar bağlantı kesilmeden önce yüklenmiştir, dolayısıyla tazelik etiketlerinin önerdiğinden daha eskidirler.',
  'analytics.state.permissionTitle': 'Bu çalışma alanında analizleri göremezsiniz',
  'analytics.state.permissionBody':
    'Analytics, analist rolüne veya daha yüksek bir role ihtiyaç duyar. Bu çalışma alanının sahibi veya yöneticisi bu izni verebilir.',
  'analytics.state.rateLimitTitle': '{provider} oran sınırlayıcı analiz istekleridir',
  'analytics.state.rateLimitCause':
    'Hesap, bu pencere için sağlayıcı kotasındaki payını kullandı. Aktarma daha fazla denemez çünkü bu yayınlamayı geciktirir.',
  'analytics.state.rateLimitAlternative':
    'Sağlayıcıdan daha azını isteyen tarih aralığını veya hesap filtresini daraltın.',
  'analytics.state.rateLimitReset': 'İsteklerin devamı',
  'analytics.state.reference': 'Teşhis referansı',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'İzlenen bir bağlantı oluşturun',
  'analytics.links.empty': 'Henüz izlenen bağlantı yok',
  'analytics.links.emptyBody':
    "İzlenen bağlantı, Aktarıcının yönlendirdiği kısa bir URL'dir; böylece bir platform hiçbir tıklama bildirmediğinde bile tıklamaları görebilirsiniz. Orijinal hedef, denetim girişi olmadan asla değiştirilmez.",
  'analytics.links.emptyExample':
    'Örnek: röle.to/a7Kq2, q3-launch kampanyasıyla acme.com/blog/launch adresine yönlendirir.',
  'analytics.links.table.caption':
    'Bu çalışma alanındaki izlenen bağlantılar ve bunların birinci taraf tıklama sayıları.',
  'analytics.links.campaign': 'Kampanya',
  'analytics.links.created': 'Oluşturuldu',
  'analytics.links.usedIn':
    '{count, plural, =0 {Henüz bir gönderide kullanılmadı} one {# gönderide kullanıldı} other {# gönderide kullanıldı}}',
  'analytics.links.state.active': 'Aktif',
  'analytics.links.state.expired': 'Süresi dolmuş {date}',
  'analytics.links.state.disabled': 'Devre dışı',
  'analytics.links.state.disabledAt':
    '{date} tarihinde devre dışı bırakıldı. Bu kısa URL artık yönlendirmiyor.',
  'analytics.links.state.blocked': 'Güvenlik nedeniyle engellendi',
  'analytics.links.state.blockedBody':
    'Hedefi güvenlik kontrolünden geçemediği için bu yönlendirme kullanılamıyor. Hedefi değiştirin veya destek ekibiyle iletişime geçin.',
  'analytics.links.state.disabledReason':
    '{date} tarihinde {actor} tarafından devre dışı bırakılır. Kaydedilme nedeni: {reason}.',
  'analytics.links.detailTitle': 'Takip edilen bağlantı {slug}',
  'analytics.links.exactRedirect': 'Tam yönlendirme',
  'analytics.links.exactRedirectHelp':
    'Bu, her UTM parametresini içeren, tam olarak gösterilen ve kısaltılmamış olarak ziyaretçinin şu anda ulaştığı hedeftir.',
  'analytics.links.editDestination': 'Hedefi değiştir',
  'analytics.links.editDestinationWarning':
    'Hedefin değiştirilmesi, bu bağlantının daha önce yayınlandığı her yeri etkiler. Değişiklikten önceki dönemlere ait raporlar, o sırada etkin olan hedefi tutar.',
  'analytics.links.editDestinationAudit':
    'Değişiklik, adınız, eski hedefiniz ve yeni hedefiniz ile birlikte denetim günlüğüne kaydedilir.',
  'analytics.links.destinationHistory': 'Hedef geçmişi',
  'analytics.links.destinationHistoryRow': '{destination}, {start} ile {end} arası aktif',
  'analytics.links.destinationHistoryCurrent': '{destination}, {start} tarihinden beri aktif',
  'analytics.links.domainLabel': 'Kısa alan adı',
  'analytics.links.domainDefault': 'Geçiş varsayılan alanı',
  'analytics.links.domainVerified': 'DNS tarafından {date} tarihinde doğrulandı',
  'analytics.links.domainPending': 'DNS kaydı bekleniyor',
  'analytics.links.domainPendingHelp':
    "Aşağıdaki TXT kaydını {domain}'ye ekleyin ve tekrar kontrol edin. Doğrulanıncaya kadar bu alan adı yeni bir bağlantı için seçilemez.",
  'analytics.links.domainFailed': 'DNS kaydı {date} ile eşleşmedi',
  'analytics.links.domainCheck': "DNS'yi tekrar kontrol edin",
  'analytics.links.expiry': 'Son kullanma tarihi',
  'analytics.links.expiryNone': 'Son kullanma tarihi belirlenmedi',
  'analytics.links.expiryHelp':
    'Sürenin sona ermesinden sonra bağlantı, sona erdiğini belirten düz bir sayfa döndürür. Asla sessizce başka bir yere işaret edilmez.',
  'analytics.links.disable': 'Bu bağlantıyı şimdi devre dışı bırakın',
  'analytics.links.disableTitle': '{slug} devre dışı bırakılsın mı?',
  'analytics.links.disableBody':
    "Ziyaretçiler, bağlantının artık mevcut olmadığını söyleyen bir sayfaya ulaşıyor. Yayınlanan gönderiler hâlâ kısa URL'yi içerdiğinden, bu URL'yi tıklayan herkes görebilir.",
  'analytics.links.disableReason': 'Devre dışı bırakma nedeni',
  'analytics.links.enable': 'Bu bağlantıyı tekrar etkinleştirin',
  'analytics.links.abuseTitle': 'Bu bağlantının kötüye kullanımını bildirin',
  'analytics.links.abuseBody':
    'Bu kısa URL, istemediğiniz bir şey için kullanılıyorsa bunu bildirin ve yönlendirme, incelenirken askıya alınır.',
  'analytics.links.abuseAction': 'Bu bağlantıyı bildir',
  'analytics.links.measurementLabel': 'Birinci taraf yönlendirme ölçümü',
  'analytics.links.measurementExplained':
    'Aktarma, yönlendirme hizmetinden bu URL istendiğinde bir isteği sayar. Tekilleştirilmiş bir tıklama, aynı ziyaretçiden gelen tekrar isteklerini kısa bir pencere içinde kaldırır ve bilinen tarayıcı modelleriyle eşleşen istekler silinmek yerine hariç tutulur.',
  'analytics.links.botsNote':
    '{count, plural, one {# istek} other {# istek}} otomatik olarak sınıflandırıldı ve tekilleştirilmiş sayım dışında bırakıldı.',
  'analytics.links.series.title': 'Zaman içinde istekler ve tekilleştirilen tıklamalar',
  'analytics.links.series.requests': 'Toplam istek',
  'analytics.links.series.clicks': 'Tekilleştirilmiş tıklamalar',
  'analytics.links.breakdownTitle': 'Tıklamaların nereden geldiği',
  'analytics.links.breakdown.share': "Tekilleştirilen tıklamaların {percent}'i",
  'analytics.links.referrer.direct': 'Yönlendiren gönderilmedi',
  'analytics.links.referrer.social': 'Sosyal platform',
  'analytics.links.referrer.search': 'Arama motoru',
  'analytics.links.referrer.email': 'E-posta istemcisi',
  'analytics.links.referrer.other': 'Diğer web sitesi',
  'analytics.links.device.mobile': 'Mobil',
  'analytics.links.device.desktop': 'Masaüstü',
  'analytics.links.device.tablet': 'tablet',
  'analytics.links.device.unknown': 'Belirlenmedi',
  'analytics.links.countryUnknown': 'Ülke belirlenmedi',
  'analytics.links.lastEventLabel': 'Son tıklama',
  'analytics.links.noEvents': 'Henüz tıklama kaydedilmedi',
  'analytics.links.noEventsBody':
    'Bu bağlantı oluşturulduğundan beri talep edilmedi. Bu, kendi yönlendirme hizmetimiz tarafından ölçülen gerçek bir sıfırdır.',
  'analytics.links.compareWarning':
    '{provider} bu gönderi için {providerValue} bağlantı tıklamalarını bildirir. Aktarma {relayValue} tekilleştirilen tıklamaları kaydetti. İkisi farklı olayları sayar ve hiçbiri diğerinin yerini almaz.',
  'analytics.links.errorTitle': 'Bağlantı istatistikleri yüklenemedi',
  'analytics.links.errorBody':
    'Yönlendirme hizmeti hâlâ çalıştığından bağlantı, ziyaretçileri hedefine göndermeye devam eder. Yalnızca raporlama etkilenir.',
  'analytics.links.createDestination': 'Hedef URL',
  'analytics.links.createDestinationHelp':
    'Herkese açık bir https adresi olmalıdır. Özel ağ adresleri ve yönlendirme zincirleri, yönlendirme hizmeti tarafından reddedilir.',
  'analytics.links.createCampaign': 'Kampanya adı',
  'analytics.links.createSlug': 'Özel bitiş',
  'analytics.links.createSlugHelp': 'Bunu boş bırakın ve Relay kısa, rastgele bir son oluşturur.',
  'analytics.links.createUtm': 'UTM parametreleri',
  'analytics.links.blockedScheme': 'Yalnızca https hedefleri kabul edilir.',
  'analytics.links.blockedPrivate':
    'Bu adres özel bir ağda olduğundan yönlendirme hizmeti bunu kabul etmeyecektir.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Kurallar',
  'automation.tab.feeds': 'RSS beslemeleri',
  'automation.tab.label': 'Otomasyon bölümleri',

  'automation.rules.table.caption': 'Bu çalışma alanındaki otomasyon kuralları.',
  'automation.rules.table.rule': 'Kural',
  'automation.rules.table.state': 'Eyalet',
  'automation.rules.table.accounts': 'Hesaplar',
  'automation.rules.table.lastRun': 'Son çalıştırma',
  'automation.rules.table.nextCheck': 'Sonraki kontrol',
  'automation.rules.neverRun': 'Henüz çalıştırılmadı',
  'automation.rules.emptyExample':
    'Örnek: Acme blog akışında yeni bir öğe göründüğünde, dil İngilizce ise Blog duyuru şablonundan bir taslak oluşturun ve onay isteyin.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {Hesap seçilmedi} one {# hesap} other {# hesap}}',
  'automation.rules.openRule': '{name}’ı açın',
  'automation.rules.duplicateRule': '{name} çoğaltın',
  'automation.rules.deleteTitle': '{name} silinsin mi?',
  'automation.rules.deleteBody':
    'Kural hemen durdurulur ve çalıştırma geçmişi denetim günlüğü için tutulur. Halihazırda oluşturulmuş gönderiler etkilenmez.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'planlanmış bir yorum veya konu öğesi başarısız oluyor',

  'automation.condition.timeWindow': 'saat {timeZone}’de {start} ile {end} arasındadır',
  'automation.condition.domainPresent': 'metin {domain} ile bağlantılıdır',
  'automation.condition.hashtagPresent': 'metin {hashtag} etiketini içeriyor',
  'automation.condition.providerCapability': 'hesap aslında şunları yapabilir: {capability}',
  'automation.condition.planStatus': 'abonelik aktif',

  'automation.action.continueSequence': 'hazırlanan konuya veya yorum dizisine devam edin',
  'automation.action.notifyEmail': '{target} adresine e-posta gönderin',
  'automation.action.notifyWebhook': "{target}'e bir web kancası gönderin",
  'automation.action.pauseConnection': 'etkilenen hesabı duraklat',
  'automation.action.quotePost': 'kaynak gönderiyi bir kez alıntılayın',
  'automation.action.followUpComment': 'kaynak gönderiye hazırlanmış bir yorum ekleyin',

  'automation.param.feed': 'Besleme',
  'automation.param.template': 'Şablon',
  'automation.param.signature': 'İmza',
  'automation.param.disclosure': 'Açıklama',
  'automation.param.locale': 'Dil',
  'automation.param.project': 'Proje',
  'automation.param.campaign': 'Kampanya',
  'automation.param.account': 'Hesap',
  'automation.param.platform': 'platformu',
  'automation.param.contentType': 'İçerik türü',
  'automation.param.keyword': 'Anahtar kelime',
  'automation.param.hashtag': 'Hashtag',
  'automation.param.domain': 'Etki alanı',
  'automation.param.capability': 'Yetenek',
  'automation.param.timeZone': 'Saat dilimi',
  'automation.param.startTime': 'Gönderen',
  'automation.param.endTime': 'Kime',
  'automation.param.duration': 'Süre',
  'automation.param.metric': 'Metrik',
  'automation.param.value': 'Değer',
  'automation.param.target': 'Gönder',
  'automation.param.time': 'Zaman',
  'automation.param.cadence': 'Ne sıklıkta',
  'automation.param.notSet': 'ayarlanmamış',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Kural adı',
  'automation.editor.namePlaceholder': 'Sosyal blog',
  'automation.editor.when': 'Ne zaman',
  'automation.editor.if': 'Eğer',
  'automation.editor.then': 'sonra',
  'automation.editor.after': 'Sonra',
  'automation.editor.until': 'kadar',
  'automation.editor.sentenceLabel': 'Kural cümlesi',
  'automation.editor.readBack': 'Bunu açmadan önce cümleyi tekrar okuyun. Bütün kural budur.',
  'automation.editor.chooseTrigger': 'Bu kuralı neyin başlatacağını seçin',
  'automation.editor.addCondition': 'Koşul ekle',
  'automation.editor.addAction': 'Eylem ekle',
  'automation.editor.removeCondition': '{label} koşulunu kaldırın',
  'automation.editor.removeAction': '{label} eylemini kaldırın',
  'automation.editor.moveActionUp': "{label}'i daha erkene taşı",
  'automation.editor.moveActionDown': '{label} daha sonra taşı',
  'automation.editor.actionOrder': 'Eylemler yukarıdan aşağıya bu sırayla yürütülür.',
  'automation.editor.noConditions': 'Koşul yok. Kural her tetiklendiğinde çalışır.',
  'automation.editor.noActions':
    'Henüz herhangi bir işlem yok. Eylemi olmayan bir kural kaydedilemez.',
  'automation.editor.delayNone': 'gecikme yok',
  'automation.editor.delayLabel': 'Eylemler çalıştırılmadan önceki gecikme',
  'automation.editor.endLabel': 'Bu kural sona erdiğinde',
  'automation.editor.end.manual': 'bunu kapatıyorum',
  'automation.editor.end.date': 'seçtiğim bir tarih',
  'automation.editor.end.count': '{count, plural, one {# kez} other {# kez}} çalıştı',
  'automation.editor.end.dateValue': 'Dur',
  'automation.editor.end.countValue': 'Bu kadar koşudan sonra dur',
  'automation.editor.parameterFor': '{label} ayarları',
  'automation.editor.saveDraft': 'Taslak olarak kaydet',
  'automation.editor.savedAt': 'Kaydedildi {time}',
  'automation.editor.unsaved': 'Kaydedilmemiş değişiklikler',

  'automation.editor.view.sentence': 'Cümle',
  'automation.editor.view.structured': 'Yapılandırılmış',
  'automation.editor.view.api': 'API gösterimi',
  'automation.editor.view.label': 'Düzenleyici görünümü',
  'automation.editor.apiHelp':
    'REST API, CLI ve MCP sunucusunun gönderdiği şey tam olarak budur. Burada düzenleyip cümleye geri dönmek her alanı korur.',
  'automation.editor.apiInvalid': 'Bu geçerli bir JSON kuralı olmadığı için uygulanmadı: {reason}',
  'automation.editor.apiApply': "Bu JSON'u uygula",
  'automation.editor.structuredHelp':
    'Alanlarla aynı kural. Bir kuralın birçok koşulu varsa ve cümle uzuyorsa bunu kullanın.',

  'automation.editor.error.noAction': 'Kaydetmeden önce en az bir eylem ekleyin.',
  'automation.editor.error.noTrigger': 'Kaydetmeden önce bir tetikleyici seçin.',
  'automation.editor.error.noAccounts': 'Bu kuralın geçerli olabileceği en az bir hesap seçin.',
  'automation.editor.error.missingParameter': '{label} bir değere ihtiyaç duyar.',
  'automation.editor.error.summary':
    'Bu kuralın kaydedilebilmesi için {count, plural, one {# şeye dikkat etmeniz gerekiyor} other {# şeye dikkat etmeniz gerekiyor}}.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'Bu kuralı başlatan şey',
  'automation.picker.conditionTitle': 'Koşul ekle',
  'automation.picker.actionTitle': 'Eylem ekle',
  'automation.picker.search': 'Bu listeyi filtrele',
  'automation.picker.noResults': 'Bu listedeki hiçbir şey yazdıklarınızla eşleşmiyor.',
  'automation.picker.groupContent': 'İçerik',
  'automation.picker.groupPublishing': 'Yayınlama',
  'automation.picker.groupNotify': 'İnsanlar ve sistemler',
  'automation.picker.groupControl': 'Kural kontrolü',
  'automation.picker.groupSchedule': 'Zaman',
  'automation.picker.groupExternal': 'Dış etkinlikler',
  'automation.picker.groupMeasurement': 'Ölçüm',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# işlem} other {# işlem}} seçilen hesaplar bunları gerçekleştiremediğinden listelenmiyor.',
  'automation.picker.hiddenDetail': '{action} {provider} için mevcut değildir. {reason}',
  'automation.picker.consequential': 'Bir platformda bir şeyler yaratır',
  'automation.picker.internalOnly': "Relay'in içinde kalır",

  'automation.accounts.label': 'Bu kuralın geçerli olabileceği hesaplar',
  'automation.accounts.help':
    'Koşulları ne derse desin, bir kural burada listelenmeyen bir hesaba asla dokunamaz.',
  'automation.accounts.none': 'Henüz hesap seçilmedi',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Bu tetikleyiciye ilişkin ölçüm kuralları',
  'automation.threshold.intro':
    'Bir sayıya tepki veren bir kuralın, hangi sayının, hangi periyotta ölçüldüğünü ve ne sıklıkta etki gösterebileceğini bilmesi gerekir.',
  'automation.threshold.metric': 'İzlenecek metrik',
  'automation.threshold.value': 'Eşik değeri',
  'automation.threshold.window': 'Ölçüm penceresi',
  'automation.threshold.windowHelp':
    'Kaynak gönderinin yayınlandığı andan itibaren sayılır. Bu pencerenin dışında kural, gönderiyi izlemeyi durdurur.',
  'automation.threshold.expiry': 'Bir gönderiyi izlemeyi bıraktıktan sonra',
  'automation.threshold.cooldown': 'İnfazlar arasındaki bekleme süresi',
  'automation.threshold.cooldownHelp':
    'Aynı kaynak gönderi için iki çalıştırma arasında izin verilen en kısa süre.',
  'automation.threshold.maxPerPost': 'Kaynak gönderi başına maksimum yürütme sayısı',
  'automation.threshold.defaultsTitle': 'Siz değiştirmediğiniz sürece açık kalan varsayılanlar',
  'automation.threshold.defaultOncePerPost': 'Kaynak gönderi başına bir kez çalıştırın.',
  'automation.threshold.defaultStale':
    "Metrik kullanılamıyorsa veya eskiyse yürütmeyin. Kullanılan tazelik limiti {duration}'dir.",
  'automation.threshold.staleLimit': 'Bir ölçümü şu tarihten sonra eskimiş gibi değerlendir:',
  'automation.threshold.providerNote':
    "{provider} {metric}'e bir gecikme bildirir, bu nedenle bu kural ancak sağlayıcı numarayı yayınladıktan sonra geçerli olabilir.",

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Başka bir hesaptan takip',
  'automation.crossAccount.off': 'Kapalı. Bu kural yalnızca kaynak hesapta geçerli olur.',
  'automation.crossAccount.enable': 'Başka bir hesaptan takibe izin ver',
  'automation.crossAccount.body':
    'Her iki hesap da bu çalışma alanına bağlı olmalı ve her ikisi de burada adlandırılmalıdır. Takip, önceden yazdığınız hazırlanmış bir gönderidir ve diğer her şeyle aynı onay politikasından geçer.',
  'automation.crossAccount.sourceAccount': 'Kaynak hesap',
  'automation.crossAccount.followUpAccount': 'Takibi yayınlayan hesap',
  'automation.crossAccount.preauthorize':
    "Bu çalışma alanının hem {sourceAccount} hem de {followUpAccount}'yi kontrol ettiğini ve takibin bağımsız onay olarak sunulmadığını onaylıyorum.",
  'automation.crossAccount.preauthorizeRequired':
    'Bu kuralın kaydedilebilmesi için ön yetkilendirmeyi onaylayın.',
  'automation.crossAccount.duplicateCheck':
    'Çapraz hesap kopyalama ve ritim kontrolleri takipten önce gerçekleştirilir ve kaynak gönderiyi tekrarlayacaksa gecikmek yerine atlanır.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro': 'Bu kuralın yapabileceği her şeyi, hiçbirini yapmadan önce yapar.',
  'automation.preflight.accountsLabel': 'Üzerinde işlem yapabileceği hesaplar',
  'automation.preflight.maxActionsLabel': 'Çalıştırma başına en fazla harici eylem',
  'automation.preflight.maxActionsPeriod':
    '{period} içinde en fazla {count, plural, one {# harici eylem} other {# harici eylem}}.',
  'automation.preflight.approvalLabel': 'Onay',
  'automation.preflight.approvalNone':
    'Bu kuraldaki hiçbir eylem platformda herhangi bir şey yaratmaz, dolayısıyla hiçbir onay geçerli olmaz.',
  'automation.preflight.providerLabel': 'Sağlayıcı kısıtlamaları',
  'automation.preflight.providerNone': 'Hiçbiri bu kuraldaki eylemler için geçerli değildir.',
  'automation.preflight.costLabel': 'Tahmini ölçülen maliyet',
  'automation.preflight.costUnknown':
    'Sağlayıcının fiyatı bilinene kadar bu eylemlerin maliyeti tahmin edilemez.',
  'automation.preflight.costMethod':
    '{date} tarihli sağlayıcı fiyat listesinden tahmin edilmiştir. Makbuz gerçekte ne kadar ücretlendirildiğini kaydeder.',
  'automation.preflight.cadenceLabel': 'Ritim ve kopyalar',
  'automation.preflight.cadenceBody':
    'Her eylemden önce kopya ve ritim kontrolleri yapılır. Bir hesabın tempo bütçesini aşan bir eylem atlanır ve kaydedilir, kuyruğa alınmaz.',
  'automation.preflight.failureLabel': 'Bir çalıştırma başarısız olursa',
  'automation.preflight.failure.pauseAfter':
    'Kural {count, plural, one {# ardışık başarısızlık} other {# ardışık başarısızlık}} sonrasında duraklar ve bir eylem öğesi kaydeder.',
  'automation.preflight.failure.continue':
    'Kural çalışmaya devam eder ve her hata çalışma günlüğüne kaydedilir.',
  'automation.preflight.exampleLabel': 'Örnek çalıştırma',
  'automation.preflight.exampleIntro': 'En son olay kullanıldığında bu tetikleyici eşleşebilirdi.',
  'automation.preflight.exampleNone':
    'Henüz eşleşen bir etkinlik gerçekleşmediğinden örnek gösterilemiyor. Bunun yerine bir test etkinliği çalıştırın.',
  'automation.preflight.activate': 'Bu kuralı etkinleştirin',
  'automation.preflight.activateConfirmTitle': '{name} açılsın mı?',
  'automation.preflight.activateConfirmBody':
    'Artık bu kural size sormadan, yukarıda belirtilen sınırlar dahilinde hareket edecektir.',
  'automation.preflight.blocked':
    'Bu kural henüz etkinleştirilemiyor. Yukarıdaki {count, plural, one {# öğe} other {# öğe}} için bir karara ihtiyaç vardır.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Test etkinliği',
  'automation.test.body':
    'Bir test çalıştırması tüm cümleyi değerlendirir ve ne yapacağını gösterir. Asla yayınlamaz, asla yorum göndermez ve asla gerçek bir uç noktaya web kancası göndermez.',
  'automation.test.useLastEvent': 'En son eşleşen etkinliği kullan',
  'automation.test.usePayload': 'Bir etkinlik verisini yapıştırın',
  'automation.test.run': 'Testi çalıştırın',
  'automation.test.running': 'Testi çalıştırma',
  'automation.test.resultTitle': 'Test ne yaptı',
  'automation.test.conditionPassed': '{condition} geçti',
  'automation.test.conditionFailed': '{condition} geçemediği için kural burada kaldı',
  'automation.test.actionSimulated': '{action} çalıştırılır',
  'automation.test.actionSkipped': '{action} atlanır: {reason}',
  'automation.test.noExternalEffect': "Bu test sırasında Röle'den hiçbir şey kalmadı.",
  'automation.test.failed': 'Test tamamlanamadı: {reason}',

  'automation.runs.table.caption': 'Bu kuralın son çalıştırmaları.',
  'automation.runs.startedAt': 'Başlatıldı',
  'automation.runs.outcome.label': 'Sonuç',
  'automation.runs.actionsTaken': 'Eylemler',
  'automation.runs.trigger': 'Tarafından tetiklendi',
  'automation.runs.outcome.completed': 'Tamamlandı',
  'automation.runs.outcome.skipped': 'Atlandı',
  'automation.runs.outcome.failed': 'Başarısız',
  'automation.runs.outcome.testMode': 'Test modu',
  'automation.runs.actionCount':
    '{count, plural, =0 {Harici işlem yok} one {# harici işlem} other {# harici işlem}}',
  'automation.runs.skippedReason': 'Atlandı çünkü {reason}',
  'automation.runs.openDetail': "Çalıştırmayı {time}'dan açın",
  'automation.runs.createdItems': 'Oluşturuldu',

  'automation.versions.caption': 'Bu kuralın kayıtlı her sürümü.',
  'automation.versions.current': 'Mevcut',
  'automation.versions.savedBy': '{actor} tarafından {date} tarihinde kaydedildi',
  'automation.versions.compare': 'Mevcut sürümle karşılaştırın',
  'automation.versions.restore': 'Bu sürümü geri yükle',
  'automation.versions.restoreConfirm':
    'Geri yükleme yeni bir sürüm oluşturur. Hiçbir şeyin üzerine yazılmaz ve kural siz onu açana kadar mevcut durumunda kalır.',
  'automation.versions.diffTitle': 'Sürüm {from} ile sürüm {to} karşılaştırıldığında',

  'automation.kill.title': '{name} şimdi dur',
  'automation.kill.body':
    'Kural, bir koşunun ortasında, eğer bir koşu gerçekleşiyorsa, hemen durdurulur. Zaten bir platforma gönderilmiş olan herhangi bir şey yayınlanmış olarak kalır çünkü harici bir gönderi asla geri alınmaz.',
  'automation.kill.confirmPhrase': 'DUR',
  'automation.kill.confirmLabel': 'Onaylamak için STOP yazın',
  'automation.kill.stopped':
    'Bu kural {date} tarihinde {actor} tarafından durduruldu. Siz tekrar açana kadar tekrar çalışamaz.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Otomasyon kuralları yükleniyor',
  'automation.state.loadingRule': 'Kural ve son çalıştırmaları yükleniyor',
  'automation.state.errorTitle': 'Kurallar yüklenemedi',
  'automation.state.errorBody':
    'Halihazırda çalışmakta olan kurallar bundan etkilenmez. Yalnızca bu ekran başarısız oldu.',
  'automation.state.offlineTitle': 'Çevrimdışısınız',
  'automation.state.offlineBody':
    'Bir kuralı okuyabilir ve taslağı düzenleyebilirsiniz; taslak bu cihazda kalır. Bir bağlantıya ihtiyaç duyulduğunda bir kuralı kaydetme, test etme ve döndürme.',
  'automation.state.permissionTitle': 'Otomasyon kurallarını değiştiremezsiniz',
  'automation.state.permissionBody':
    'Kurallar bağlı hesaplar üzerinde etkili olduğundan, birini değiştirmek için yönetici rolü veya daha yüksek bir rol gerekir. Hala her kuralı ve çalışma geçmişini okuyabilirsiniz.',
  'automation.state.rateLimitTitle': 'Kural çalıştırmaları yavaşlatılıyor',
  'automation.state.rateLimitCause':
    'Bu çalışma alanı, geçerli pencere için otomasyon çalıştırma iznine ulaştı. Planlanmış gönderiler ve manuel yayınlama etkilenmez.',
  'automation.state.rateLimitAlternative':
    'Kadansa sahip kurallara daha uzun bir aralık verilebilir, bu da daha az sayıda çalıştırma gerektirir.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    "Bir feed'i, kendi yazdığınız herhangi bir şeyle aynı doğrulama ve onaya sahip olarak taslaklara veya planlanmış gönderilere dönüştürün.",
  'automation.rss.empty': 'Henüz yayın yok',
  'automation.rss.emptyBody':
    'Bir yayın eklediğinizde Röle bunu bir programa göre kontrol eder. Her yeni öğe, hangisini seçerseniz seçin, bir taslak, planlanmış bir gönderi veya bir onay isteği haline gelir.',
  'automation.rss.emptyExample':
    'Örnek: Acme blog akışı, her makale yayınlandığında X ve LinkedIn için bir taslak oluşturur ve onaylayanı bekler.',
  'automation.rss.table.caption': 'Bu çalışma alanı anketlerini besler.',
  'automation.rss.table.feed': 'Besleme',
  'automation.rss.table.policy': 'Yeni bir öğeye ne olur?',
  'automation.rss.table.health': 'Sağlık',

  'automation.rss.step.url': 'Besleme adresi',
  'automation.rss.step.preview': 'Beslemeyi kontrol edin',
  'automation.rss.step.seen': 'Başlangıç noktası',
  'automation.rss.step.targets': 'Nereye gidiyor',
  'automation.rss.step.template': 'Gönderi ne diyor?',
  'automation.rss.step.policy': 'Nasıl yayınlanır?',
  'automation.rss.stepOf': 'Adım {current} / {total}',

  'automation.rss.urlHelp':
    'Relay, yayını tarayıcınızdan değil, sunucularımızdan alır. Özel ağ adresleri reddedilir.',
  'automation.rss.validateAction': "Bu feed'i kontrol edin",
  'automation.rss.validateFailed': 'Bu adres okunabilir bir yayın döndürmedi',
  'automation.rss.validateFailedReason': 'Geri aldığımız şey: {reason}',
  'automation.rss.validateBlocked': 'Bu adres özel bir ağı işaret ettiğinden getirilemedi.',
  'automation.rss.previewTitle': 'Özet akışı önizlemesi',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# öğe} other {# öğe}} en yenisi önce olmak üzere geri döndü.',
  'automation.rss.previewItemPublished': 'Yayınlandı {dateTime}',
  'automation.rss.previewNoImage': 'Bu öğede resim yok',
  'automation.rss.previewImageAlt': 'Besleme öğesinden resim {title}',
  'automation.rss.previewNoDate':
    'Bu öğenin zaman damgası yoktur, dolayısıyla Relay onu ilk gördüğü zamanı kullanır.',
  'automation.rss.previewFieldsTitle': "Bu feed'in sağladığı alanlar",
  'automation.rss.previewFieldMissing': "Bu feed'de mevcut değil",

  'automation.rss.seenTitle': 'Daha önce görülmüş sayılanlar',
  'automation.rss.seenLatest':
    "Şu anda feed'de bulunan her şeyi görüldüğü gibi ele alın. Yalnızca gelecekteki öğeler yayınlanır.",
  'automation.rss.seenAll':
    'En yeni öğeyi yeni olarak değerlendirin ve bir sonraki çekte yayınlayın.',
  'automation.rss.seenHelp':
    'Çoğu yayın eski makaleler içerir. İlk seçeneği seçmek, bir biriktirme listesi yayınlamaktan nasıl kaçınacağınızdır.',

  'automation.rss.targetsHelp':
    'Hesapları veya kayıtlı grubu seçin. Her hedef, herhangi bir şey planlanmadan önce yine kendi doğrulamasını alır.',
  'automation.rss.targetGroup': 'Kayıtlı grup',
  'automation.rss.targetIndividual': 'Bireysel hesaplar',

  'automation.rss.templateFields': 'Mevcut alanlar',
  'automation.rss.templateInsert': '{field} ekleyin',
  'automation.rss.templateField.title': 'Öğe başlığı',
  'automation.rss.templateField.summary': 'Öğe özeti',
  'automation.rss.templateField.link': 'Öğe bağlantısı',
  'automation.rss.templateField.author': 'Öğe yazarı',
  'automation.rss.templateField.published': 'Yayınlanma tarihi',
  'automation.rss.templateField.categories': 'Kategoriler',
  'automation.rss.templatePreview': 'En yeni öğeyle önizleme',
  'automation.rss.adaptWithAi': 'Metni her hedefe göre uyarlayın',
  'automation.rss.adaptHelp':
    'İfadeler her platforma uyacak şekilde yeniden yazılır ve kabul ettiğiniz veya reddettiğiniz bir fark olarak gösterilir. Medya feed öğesinden gelir. Röle görüntü oluşturmaz.',
  'automation.rss.noImageGeneration':
    'Bir feed öğesinin resmi yoksa gönderi resimsiz olarak yayınlanır.',
  'automation.rss.imageFromFeed': 'Feed öğesindeki görseli varsa kullanın',

  'automation.rss.policyHelp':
    'Bir feed öğesi özel değildir. Kendi yazdığınız bir gönderiyle aynı onay politikasını izler.',
  'automation.rss.cadenceInterval': 'Her biri en fazla bir öğe',
  'automation.rss.cadenceHelp':
    'Fazladan öğeler birlikte yayınlamak yerine kuyrukta bekler, bu nedenle aynı anda on makale yayınlayan bir yayın, bir hesabı doldurmaz.',
  'automation.rss.immediateWarning':
    'Anında yayınlama, bir gönderinin önce kimse okumadan bir platforma gönderilmesidir. Yalnızca bu hesaplara ilişkin onay politikası buna izin veriyorsa kullanılabilir.',

  'automation.rss.healthTitle': 'Yem sağlığı',
  'automation.rss.healthOk': 'Çalışma',
  'automation.rss.healthStalled': '{duration} için yeni öğe yok',
  'automation.rss.healthFailing':
    'Son {count, plural, one {kontrol} other {# kontrol}} başarısız oldu',
  'automation.rss.health.nextPoll': 'Sonraki kontrol {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Henüz işlenen öğe yok} one {# öğe işlendi} other {# öğe işlendi}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {Atlanan kopya yok} one {# kopya atlandı} other {# kopya atlandı}}',
  'automation.rss.health.lastPollLabel': 'Son kontrol edildi',
  'automation.rss.health.lastItemLabel': "Feed'deki son yeni öğe",
  'automation.rss.health.lastPostLabel': 'Son taslak veya gönderi oluşturuldu',
  'automation.rss.health.processedLabel': 'İşlenen öğeler',
  'automation.rss.recentItems': 'Son öğeler',
  'automation.rss.itemOutcome.draft': 'Taslak oluşturuldu',
  'automation.rss.itemOutcome.scheduled': '{time} için planlandı',
  'automation.rss.itemOutcome.published': 'Yayınlandı',
  'automation.rss.itemOutcome.awaitingApproval': 'Onay bekleniyor',
  'automation.rss.itemOutcome.duplicate': 'Atlandı, zaten görüldü',
  'automation.rss.itemOutcome.failed': 'Başarısız: {reason}',
  'automation.rss.pauseFeed': 'Bu beslemeyi duraklat',
  'automation.rss.resumeFeed': "Bu feed'i devam ettir",
  'automation.rss.deleteTitle': '{title} kaldırılsın mı?',
  'automation.rss.deleteBody':
    'Röle bu beslemeyi kontrol etmeyi durdurur. Halihazırda oluşturduğu taslaklar ve gönderiler tam olarak oldukları gibi kalır.',
  'automation.rss.errorTitle': 'Bu özet akışı okunamadı',
  'automation.rss.errorBody':
    'Röle normal programda kontrol etmeye devam ediyor. Kısmi bir yanıttan hiçbir şey yayınlanmadı.',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'Hiçbir kuralda mevcut değil',
  'automation.refuse.body':
    'Otomatik beğeniler ve takipler, etkileşim grupları, istenmeyen yanıtlar ve mesajlar ve aynı içeriğin popüler görünmesi için birden fazla hesaptan yayınlanması burada seçenekler değildir. Platformlar bunları yasaklıyor ve onları kullanan hesaplara zarar veriyor.',
  'automation.refuse.readPolicy': 'Kabul edilebilir kullanım politikasını okuyun',
} as const;
