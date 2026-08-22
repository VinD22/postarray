/**
 * The public marketing site and public documentation surfaces.
 *
 * Rules that bind this file specifically, beyond the catalog rules in
 * `lint.ts`:
 *
 *  - Every claim here is either a product fact we control (price, channel
 *    allowance, surfaces) or a provider fact that carries a source link and a
 *    verification date in the page that renders it. No adjective stands in for
 *    a number.
 *  - Nothing here promises reach, ranking, engagement or "going" anywhere.
 *  - Nothing here describes AI image or AI video generation as a Relay
 *    feature, because it is not one.
 *  - No integration is called official until the provider has approved it. The
 *    connector matrix uses `capability.level.*` from `connections.ts` so the
 *    marketing site and the product cannot drift apart.
 *  - Legal wording that must be drafted by counsel is marked with
 *    `web.legal.counselPending.*` rather than guessed at here.
 */
export const webMarketingMessages = {
  /* ---------------------------------------------------------------------- */
  /* Shared marketing furniture                                              */
  /* ---------------------------------------------------------------------- */

  'web.brand.name': 'Röle',
  'web.brand.tagline': 'İnsanlar ve temsilciler için çok dilli yayıncılık kontrol düzlemi.',
  'web.skipToContent': 'Ana içeriğe atla',
  'web.nav.label': 'Sitede gezinme',
  'web.nav.openMenu': 'Menü',
  'web.nav.closeMenu': 'Menüyü kapat',
  'web.nav.footerLabel': 'Alt bilgide gezinme',

  'web.cta.startTrial': 'Start the 7 day trial',
  'web.cta.seePricing': 'See the price',
  'web.cta.seeCapabilities': 'Yetenek matrisini okuyun',
  'web.cta.readDocs': 'Belgeleri okuyun',
  'web.cta.trialFootnote':
    'Polar collects a payment method, charges $0 today, and shows the exact first charge date before you confirm.',

  'web.label.lastReviewed': 'Son incelenme tarihi: {date}',
  'web.label.nextReview': 'Sonraki inceleme {date}',
  'web.label.researchDate': 'Araştırıldı {date}',
  'web.label.officialSource': 'Resmi kaynak',
  'web.label.onThisPage': 'Bu sayfada',
  'web.label.provider': 'platformu',
  'web.label.capability': 'Yetenek',

  'web.notFound.title': 'Bu adreste sayfa yok',
  'web.notFound.body':
    'Bağlantı güncel olmayabilir veya sayfayı kullanımdan kaldırmış olabiliriz. Doğruluğu sona eren sayfalar, açıkta kalmak yerine kullanımdan kaldırılır ve bu gerçekleştiğinde değişiklik günlüğü bunu kaydeder.',
  'web.notFound.action': 'Ana sayfaya git',

  'web.correction.title': 'Bu sayfada yanlış bir şey buldum',
  'web.correction.body':
    "Platform kuralları değişiyor ve bazı şeyleri yanlış anlıyoruz. URL'yi ve hatalı olanı gönderin; sayfayı düzelteceğiz veya kullanımdan kaldıracağız.",
  'web.correction.email': 'düzeltmeler@relay.example',

  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.home.title': 'Relay, çok dilli yayıncılık kontrol düzlemi',
  'web.meta.home.description':
    "Kaynaklı bir fikri platformda yerel içeriğe dönüştürün, bir kez onaylayın, resmi platform API'leri aracılığıyla güvenilir bir şekilde yayınlayın ve bundan sonra nelerin geliştirileceğini öğrenin.",
  'web.meta.product.title': 'Röle nasıl çalışır?',
  'web.meta.product.description':
    'Yayın masasında genel bir bakış: bir kez oluşturun, platforma göre uyarlayın, gerçek sınırlara göre doğrulayın, onaylayın, planlayın, yayınlayın ve makbuzu saklayın.',
  'web.meta.integrations.title': 'Platformlar Aktarımı şu adreste yayınlanır:',
  'web.meta.integrations.description':
    "Relay'in hangi platformlara bağlandığı, her bağlantının bugün neler yapabileceği ve platformun kendisinin nelere izin vermediği.",
  'web.meta.capabilities.title': 'Bağlayıcı yeteneği matrisi',
  'web.meta.capabilities.description':
    'Bağlayıcı tanımlarımızdan oluşturulan, oluşturduklarımızı platformun sunduklarından ayıran platform başına, yetenek başına tablo.',
  'web.meta.creators.title': 'Yaratıcılar için yayın',
  'web.meta.creators.description':
    'Aynı fikri beş kez yeniden yazmaya gerek kalmadan çeşitli formatlarda ve dillerde yayınlayan solo yaratıcılar için.',
  'web.meta.agencies.title': 'Ajanslar için röle',
  'web.meta.agencies.description':
    'Başkaları adına yayın yapan ekipler için müşteri ayrımı, onaylar, paylaşılabilir inceleme bağlantıları, makbuzlar ve raporlama.',
  'web.meta.developers.title': 'Geliştiriciler için röle',
  'web.meta.developers.description':
    'Web uygulamasının arkasında bir arka uç, REST API, uzak bir MCP sunucusu, CLI ve imzalı web kancaları. Her yüzeyde aynı onay kuralları.',
  'web.meta.pricing.title': 'Pricing',
  'web.meta.pricing.description':
    'One plan. $29 a month, or $300 a year which is $25 a month billed annually. 30 active channels, unlimited team members, no feature tiers.',
  'web.meta.resources.title': 'Kaynaklar',
  'web.meta.resources.description':
    'Durum, değişiklik günlüğü, belgeler, metodoloji, karşılaştırmalar, araç radarı ve fırsat kataloğu.',
  'web.meta.status.title': 'Durum',
  'web.meta.status.description':
    'Her Röle yüzeyinin ve her konektörün mevcut durumu ve olay geçmişi.',
  'web.meta.changelog.title': 'Değişiklik günlüğü',
  'web.meta.changelog.description':
    'Neyin gönderildiği, konektörlerde nelerin değiştiği ve nelerin düzeltildiği.',
  'web.meta.docs.title': 'Dokümantasyon',
  'web.meta.docs.description':
    'Relay üzerinde derleme yapmak için REST API, MCP sunucusu, CLI ve webhook belgeleri.',
  'web.meta.methodology.title': 'Metodoloji',
  'web.meta.methodology.description':
    'Platform iddialarını nasıl araştırıyoruz, bunların tarihlerini nasıl belirliyoruz, diğer ürünleri nasıl karşılaştırıyoruz ve hataları nasıl düzeltiyoruz.',
  'web.meta.compare.title': 'Karşılaştırmalar',
  'web.meta.compare.description':
    'Her birinin kimin için en iyi olduğu da dahil olmak üzere diğer yayınlama araçlarıyla dürüst, tarihli karşılaştırmalar.',
  'web.meta.toolRadar.title': 'Yaratıcı araç radarı',
  'web.meta.toolRadar.description':
    'Sınırlamalar, hak uyarıları ve ticari açıklamalarla birlikte, uzman yaratıcı araçların tarihli, editoryal olarak gözden geçirilmiş bir kataloğu.',
  'web.meta.opportunities.title': 'Promosyon fırsatları',
  'web.meta.opportunities.description':
    'Her bir hedefin kendi gönderim kurallarına sahip, bir ürünün listelenebileceği, piyasaya sürülebileceği veya tartışılabileceği yerlerin küratörlü bir kataloğu.',
  'web.meta.legal.title': 'Legal and policies',
  'web.meta.legal.description':
    'Terms, privacy, acceptable use, AI use, cookies, subprocessors, refunds, copyright, security, accessibility, developer terms and affiliate terms.',

  /* ---------------------------------------------------------------------- */
  /* Home                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.home.promise':
    'Kaynaklı bir fikri platformda yerel içeriğe dönüştürün, bir kez onaylayın, güvenilir bir şekilde yayınlayın ve daha sonra nelerin geliştirileceğini öğrenin.',
  'web.home.lede':
    "Relay, çıkanlardan sorumlu olan kişiler için bir yayın masasıdır. Bir kez yazarsınız, platforma göre uyarlarsınız, planlamadan önce gerçek sınırları görürsünüz, ihtiyacınız olan onayı alırsınız, resmi platform API'leri aracılığıyla yayınlarsınız ve her gönderi için bir makbuz tutarsınız.",
  'web.home.summaryLine':
    'One plan at $29 a month or $300 a year. 30 active social channels, unlimited team members, no feature tiers. The seven day trial collects a payment method and charges $0 at checkout.',

  'web.home.example.title': 'Bir fikir, platforma özgü beş versiyon',
  'web.home.example.body':
    "Besteci ana versiyonla başlar. Bir hesap seçildiğinde, yalnızca o hesap için, kendi canlı limitleri ve kendi ön izlemesi olan bir geçersiz kılma işlemi açılır. LinkedIn için yazdığınız hiçbir şey X'in aldıklarını değiştirmez.",
  'web.home.example.column.account': 'Hesap',
  'web.home.example.column.variant': 'Bu hesabın aldığı şeyler',
  'web.home.example.column.check': 'Planlamadan önce kontrol edildi',
  'web.home.example.caption':
    'Açıklayıcı bir kompozisyon. Gösterilen sınırlar ve ayarlar bir tahminden değil, her platformun bağlayıcı tanımından gelir.',
  'web.home.example.x.account': 'X, @kuzey yönünde',
  'web.home.example.x.variant': 'Ana metin, kısaltılmış, artı iki mesaj dizisi',
  'web.home.example.x.check':
    'Bir bağlantı gönderisi için karakter sayısı, konu sırası, tahmini API maliyeti',
  'web.home.example.linkedin.account': 'LinkedIn, Kuzeye Yönelik Araçlar',
  'web.home.example.linkedin.variant': 'Belgenin eklendiği daha uzun ana metin',
  'web.home.example.linkedin.check': 'Organizasyon rolü, gönderi uzunluğu, belge türü',
  'web.home.example.instagram.account': 'Instagram, @northbound.tools',
  'web.home.example.instagram.variant':
    'Aynı görselin kare kesiti, yayın için başlık yeniden yazıldı',
  'web.home.example.instagram.check':
    'Profesyonel hesap türü, en boy oranı, alternatif metin mevcut',
  'web.home.example.youtube.account': 'YouTube, Kuzeye Giden',
  'web.home.example.youtube.variant': 'Kendi başlığı ve açıklamasıyla Kısa videoyla aynı klip',
  'web.home.example.youtube.check':
    'Yükleme kapsamı, denetim durumu, yüklemenin yer alacağı gizlilik',
  'web.home.example.bluesky.account': 'Bluesky, kuzeye doğru.example',
  'web.home.example.bluesky.variant': 'Bağlantı kartıyla birlikte ana metin',
  'web.home.example.bluesky.check':
    'Karakter sayısı, bağlantı kartı çözünürlüğü, alternatif metin mevcut',

  'web.home.pillars.title': 'Relay hangi konuda iyi olmak için tasarlandı?',
  'web.home.pillars.confidence.title': 'Güvenle yayınlayın',
  'web.home.pillars.confidence.body':
    'Hesap başına gerçek bir önizleme, herhangi bir şey kuyruğa alınmadan önce deterministik politika ve platform kontrolleri, çalışma alanınızın gerektirdiği onay, harici posta kimliğini içeren değişmez bir makbuz ve her bağlantı için bir sağlık durumu.',
  'web.home.pillars.confidence.proof':
    'Her harici yazma bir önemsizlik anahtarı taşır, bu nedenle platform bir gönderiyi kabul ettikten sonra çalışanın çökmesi ikinci bir gönderi oluşturmaz.',
  'web.home.pillars.adapt.title': 'Kopyalamak yerine uyarlayın',
  'web.home.pillars.adapt.body':
    'Bir proje sözlüğü ve her dil için adlandırılmış bir incelemeci ile, her seferinde bir hesabı ve birebir çeviri yerine yaratıcı çeviriyi geçersiz kılabileceğiniz platform değişkenleri başına.',
  'web.home.pillars.adapt.proof':
    'Arayüz seçilen dillerde mevcuttur. İçerik uyarlaması 30 içerik dilini kapsar ve bunların her biri yayınlanmadan önce incelenebilir.',
  'web.home.pillars.loop.title': 'Döngüyü kapat',
  'web.home.pillars.loop.body':
    'Metriği, bunu bildiren platformu, paydayı ve en son ne zaman yenilendiğini adlandıran analizler. Platformun bir şeyi raporlamadığı durumlarda Relay sıfır göstermek yerine bunu söylüyor.',
  'web.home.pillars.loop.proof':
    'Bir gönderi, kimsenin denetleyemeyeceği bir puan yerine kendi ortalama değerinizle karşılaştırılır.',
  'web.home.pillars.anywhere.title': 'Zaten bulunduğunuz yerden çalışın',
  'web.home.pillars.anywhere.body':
    'Web uygulaması, REST API, uzak MCP sunucusu, CLI ve imzalı web kancaları aynı uygulama hizmetlerini, aynı yetkilendirme kurallarını ve aynı doğrulayıcıları çağırır.',
  'web.home.pillars.anywhere.proof':
    'Politika arayüzde değil hizmette uygulandığından, aracı farklı bir yüzey kullanarak onay politikasını atlayamaz.',
  'web.home.pillars.economics.title': 'Economics you can predict',
  'web.home.pillars.economics.body':
    'One price, every shipped feature, 30 active channels and unlimited team members. Platform usage that a provider charges per operation is passed through at cost and shown before you confirm the action.',
  'web.home.pillars.economics.proof':
    'There is no image or video generation credit system, because Relay does not generate media.',

  'web.home.honest.title': 'Röle ne yapmaz',
  'web.home.honest.lede':
    'Bunlar sınırlardır, bir yol haritası teatisi değil. Bunlardan biri değişirse, önce değişiklik günlüğünde değişir.',
  'web.home.honest.noMedia':
    'No AI image generation and no AI video generation. Relay adapts, approves, publishes and measures the media you bring.',
  'web.home.honest.noAutomationOfEngagement':
    'Otomatik beğeniler, takipler, yeniden paylaşımlar, istenmeyen yanıtlar veya doğrudan mesajlar yasaktır. Nişan kapsülleri yok ve uydurma nişan yok.',
  'web.home.honest.noUnofficial':
    "Tarayıcı otomasyonu yok, çerez tekrarı yok, kazıma yok ve resmi olmayan gönderme uç noktaları yok. Yalnızca resmi platform API'leri.",
  'web.home.honest.noPromises':
    'Erişim, sıralama veya etkileşim konusunda söz yok. Röle size ne olduğunu ve bundan sonra neyi test edeceğinizi söyleyebilir. Size izleyicinin ne yapacağını söyleyemez.',
  'web.home.honest.noUnattendedPublishing':
    'Varsayılan olarak katılımsız yayınlama yoktur. Bir temsilci taslağı hazırlayabilir, doğrulayabilir ve onay isteyebilir. Belirli bir politikayı kasıtlı olarak devre dışı bırakmadığınız sürece, herhangi bir şey kamuya açıklanmadan önce bir insan karar verir.',

  'web.home.surfaces.title': 'Beş yüzey, bir arka uç',
  'web.home.surfaces.body':
    'Aynı kullanım durumları, aynı kira kontrolleri, aynı doğrulayıcılar ve aynı yayınlama iş akışları. Yüzey bir giriş yoludur, asla bir kuralı aşmanın kısayolu değildir.',
  'web.home.surfaces.web': 'Web uygulaması',
  'web.home.surfaces.webBody': 'Oluşturucu, takvim, onaylar, analizler, bağlantılar ve ayarlar.',
  'web.home.surfaces.api': "REST API'si",
  'web.home.surfaces.apiBody':
    'Kapsamlı anahtarlar, her yazma işleminde önemsizlik anahtarları, imleç sayfalandırması, yazılan hatalar.',
  'web.home.surfaces.mcp': 'Uzak MCP sunucusu',
  'web.home.surfaces.mcpBody':
    'Araç kapsamlarına göre yayınlanabilir HTTP, OAuth ve her önemli çağrıdan önce bir önizleme.',
  'web.home.surfaces.cli': 'CLI',
  'web.home.surfaces.cliBody':
    'Komut dosyaları ve sürekli entegrasyon için kararlı, makine tarafından okunabilen çıktı.',
  'web.home.surfaces.webhooks': 'İmzalı web kancaları',
  'web.home.surfaces.webhooksBody':
    'Yeniden dağıtımla sonuçları, onay kararlarını ve bağlantı durumunu yayınlayın.',

  'web.home.closing.title': 'Tek hesap ve tek gönderiyle başlayın',
  'web.home.closing.body':
    'Bir hesabı bağlayın, bir gönderi taslağı hazırlayın, doğrulama çalışmasını izleyin, planlayın ve makbuzu okuyun. Yaklaşık on dakika içinde ürünün tamamı budur.',

  /*
   * Home v2 (WP-1, loud system). Additive only: every key above this block
   * still renders somewhere on the page. B5 English-fallback exemption for
   * this whole prefix is recorded in `beta-fallbacks.ts`, matching the
   * existing precedent for `web.home.summaryLine` and
   * `web.home.pillars.economics.*` above.
   */
  'web.home.v2.heroTemplate': '{platform} için yerel, markaya özel gönderiler.',
  'web.home.v2.sticker.trial': '7 günlük deneme',
  'web.home.v2.sticker.official': "Yalnızca resmi API'ler",
  'web.home.v2.marqueeCaption': "Yalnızca resmi API'ler.",
  'web.home.v2.surfacesStat': 'Paylaşılan tek bir arka uçtaki yüzeyler',
  'web.home.v2.pricingTeaser.title': 'Maliyeti nedir',
  'web.home.v2.variantScene.masterLabel': 'Ana taslak',
  'web.home.v2.variantScene.progress': '{revealed} / {total}',

  /* ---------------------------------------------------------------------- */
  /* Product                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.product.title': 'Yayın masası',
  'web.product.lede':
    'Her adımda hiçbir şeye tıklamadan yedi sorunun yanıtlanması gerekir: ne yayınlanıyor, nerede, her hesaba hangi sürüm veriliyor, ne zaman ve hangi saat diliminde, bunu kim onayladı, maliyeti ne kadar ve ne oldu.',

  'web.product.step.source.title': 'Kaynak',
  'web.product.step.source.body':
    'Bir özetten, halihazırda sahip olduğunuz bir dosyadan, bir RSS öğesinden veya bir temsilciden gelen bir talepten başlayın. İçe aktarılan medya, nereden geldiği ve hakların kimin elinde olduğu da dahil olmak üzere, ona verdiğiniz kaynağı korur.',
  'web.product.step.compose.title': 'Bir kez oluşturun, ardından geçersiz kılın',
  'web.product.step.compose.body':
    'Bir ana sürüm her hedefi yönlendirir. Bir hesap seçildiğinde yalnızca o hesap için bir geçersiz kılma açılır: kendi metni, kendi medya kırpması, kendi ayarları, kendi canlı limit sayacı ve kendi önizlemesi. Geçersiz kılmanın sıfırlanması, ana öğeyi tek bir eylemle geri yükler ve önce farkı size gösterir.',
  'web.product.step.validate.title': 'Herhangi bir şey kuyruğa alınmadan önce doğrula',
  'web.product.step.validate.body':
    'Doğrulama deterministiktir ve sunucuda çalışır. Sürümlendirilmiş yetenek anlık görüntüsünden, hesap türünden, alternatif metinden, medya haklarından, kopya ve kadans kurallarından, bahsetme ve hedef çözümlemesinden ve tahmini platform kullanım maliyetinden platform sınırlarını kontrol eder. Her sayı, ait olduğu hedefi ve bunun nasıl düzeltileceğini belirtir.',
  'web.product.step.approve.title': 'Bir kez onayla',
  'web.product.step.approve.body':
    'Onaylama bir alışkanlık değil, bir çalışma alanı politikasıdır. İncelemeyi yapan kişi her hedefi, her değişkeni, saat dilimini, gizlilik durumunu ve tahmini maliyeti tek ekranda görür ve telefonda çalışır. Onaylandıktan sonra değiştirilen içerik yeniden onay gerektirir.',
  'web.product.step.schedule.title': 'Gerçek zaman diliminde planlama',
  'web.product.step.schedule.body':
    'Her planlanmış gönderide bir anlık bilgi ve bir IANA zaman dilimi saklanır; asla saf bir yerel saat yoktur. Yaz saati uygulaması geçişleri siz onaylamadan önce gösterilir, daha sonra keşfedilmez.',
  'web.product.step.publish.title': 'Makbuzun yayımlanması ve saklanması',
  'web.product.step.publish.body':
    'Her hedef bir idempotency anahtarıyla gönderilir. Başarısız olan bir hedef, başarılı olan hedefi geri almaz ve bu durumun kendi adı vardır: kısmen yayınlandı. Her sonuç, harici posta kimliğini, istek tanımlayıcısını, deneme geçmişini ve varsa tam hatayı içeren değişmez bir makbuz üretir.',
  'web.product.step.learn.title': 'Öğren',
  'web.product.step.learn.body':
    'Metrikler normalleştirilir, adlandırılır, onları rapor eden platforma atfedilir ve bir tazelik süresi damgalanır. Bir platformun raporlamadığı bir ölçüm, nedeni ile birlikte kullanılamaz olarak işaretlendi. Hiçbir zaman sıfır olarak işlenmez.',

  'web.product.shot.caption':
    'Bu sayfadaki ekran görüntüleri çalışan üründen alınmıştır. Bir yüzey dürüstçe fotoğraflanabilecek kadar tamamlanıncaya kadar, onun resmini çizmek yerine kelimelerle anlatırız.',
  'web.product.shot.pending': 'Ekran görüntüsü yakalanmayı bekliyor',
  'web.product.shot.pendingReason':
    'Bu yüzey halen inşa edilmektedir. Bir illüstrasyondan ziyade gerçek bir yakalamayı yayınlayacağız.',

  'web.product.states.title': 'Kimsenin tasarlamayı sevmediği eyaletler',
  'web.product.states.body':
    'Bir yayınlama aracı iyi günde değil, kötü günde değerlendirilir. Bunların her birinin tasarlanmış bir ekranı, sade bir cümlesi ve bir sonraki eylemi var.',
  'web.product.states.partial':
    'Kısmen yayınlandı: hangi hedefler yayında, hangileri başarısız oldu ve nedeni.',
  'web.product.states.revoked':
    'Gönderim sırasında yeniden bağlanma yolu ile birlikte iptal edilmiş bir jeton bulundu.',
  'web.product.states.rateLimited':
    'Ne zaman sıfırlanacağı ve arkasında nelerin sıralandığıyla birlikte bir platform hızı sınırı.',
  'web.product.states.duplicate':
    'Tetiklenen kuralı ve itiraz yolunu içeren bir kopya veya ritim bloğu.',
  'web.product.states.offline': 'Beste yaparken çevrimdışı: Yazdığınız hiçbir şey kaybolmaz.',
  'web.product.states.permission': 'Rolünüzün izin vermediği bir eylem, izin veren rolün adı.',

  /* ---------------------------------------------------------------------- */
  /* Integrations and capability matrix                                      */
  /* ---------------------------------------------------------------------- */

  'web.integrations.title': 'Platformlar',
  'web.integrations.lede':
    "Aktarma, resmi platform API'leri aracılığıyla bağlanır. Her bağlayıcının adlandırılmış bir sahibi, kayıtlı bir politika URL'si ve bir inceleme tarihi vardır. Bir bağlayıcı, tamam bağlayıcı tanımını geçene kadar desteklenen olarak listelenmez.",
  'web.integrations.reviewNotice.title':
    'Platform onaylamadan önce hiçbir bağlayıcı resmi olarak tanımlanmaz',
  'web.integrations.reviewNotice.body':
    'Birçok platform, bir uygulamanın müşteri adına yayınlanabilmesi için uygulamanın incelenmesini gerektirir. İncelemenin olağanüstü olduğu durumlarda bağlayıcı bunu belirtir ve geçinceye kadar neyin kısıtlandığını tam olarak açıklar.',
  'web.integrations.accountTypes': 'Bu bağlayıcının yayınlayabileceği hesap türleri',
  'web.integrations.restriction': 'Bağlanmadan önce bilmeniz gereken kısıtlama',
  'web.integrations.cost': 'Platform kullanım maliyeti',
  'web.integrations.viewMatrix': 'Bu platformun tüm özelliklerini görün',

  'web.capabilities.title': 'Bağlayıcı yeteneği matrisi',
  'web.capabilities.lede':
    'Ürünün okuduğu aynı konnektör tanımlarından oluşturulmuştur ve yayınlanmadan önce bir kişi tarafından incelenmektedir. Pazarlama, bir bağdaştırıcının yapamayacağı bir şeyin sözünü veremez.',
  'web.capabilities.legend.title': 'Bu tablo nasıl okunmalı?',
  'web.capabilities.legend.body':
    'Dört durum ve ortadaki iki durum arasındaki fark önemlidir. Henüz inşa edilmemiş olan birikmiş birikimimizdir. Platform tarafından sunulmayan, platform hakkında hiçbir aracın çalışamayacağı bir gerçektir.',
  'web.capabilities.tableCaption':
    'Platforma göre yetenekler. Her hücre, durumunu hem kelimelerle hem de renkle adlandırır.',
  'web.capabilities.snapshot': 'Bağlayıcı tanımları sürümü {version}, gözden geçirildi {date}',
  'web.capabilities.sourceNote':
    'Bu tablodaki her platform iddiası, geldiği resmi belgelere ve onu en son okuduğumuz tarihe bağlantı verir.',

  /* ---------------------------------------------------------------------- */
  /* Audience pages                                                          */
  /* ---------------------------------------------------------------------- */

  'web.creators.title': 'Yaratıcılar için',
  'web.creators.lede':
    "Aynı fikri çeşitli formatlarda, bazen birden fazla dilde yayınlıyorsunuz ve tüm ekip siz oluyorsunuz. Relay'in kaldırdığı iş yeniden yazma, yeniden kırpma ve kontroldür.",
  'web.creators.job.adapt.title': 'Bir kez yazın, beş yerel sürüm gönderin',
  'web.creators.job.adapt.body':
    'Ana sürüm fikri taşır. Her hesap, platformun beklediği uzunluğu, kırpmayı, ayarları ve tonu alır ve taahhütte bulunmadan önce hepsini yan yana görebilirsiniz.',
  'web.creators.job.languages.title': 'Tahmin etmeden başka bir dilde yayınlayın',
  'web.creators.job.languages.body':
    'Transcreation kelimelerden ziyade amacı korur, proje sözlüğünüzü kullanır ve yerel bir incelemecinin onu okuyup okumadığını işaretler. Siz söylemediğiniz sürece, garanti edemeyeceğiniz bir dilde hiçbir şey yayınlanmaz.',
  'web.creators.job.rights.title': 'Hak kaydınızı dosyayla birlikte saklayın',
  'web.creators.job.rights.body':
    'Medya nereden geldiğini, hakların kimde olduğunu ve üretken bir araçla yaratılıp yaratılmadığını taşır. Platformlar giderek daha fazla soruyor. Relay, size tekrar sormak yerine cevabınızı varlıkla birlikte saklar.',
  'web.creators.job.cost.title': 'Göndermeden önce maliyeti bilin',
  'web.creators.job.cost.body':
    'X, işlem başına ücret alır ve URL içeren bir gönderi için daha fazla ücret alır. Relay, siz onaylamadan önce, bağlantıların yoğun olduğu bir haftanın bir fatura sürprizinden ziyade bir karar olduğunu tahmin ediyor.',
  'web.creators.notFor.title': 'Bu ne değil',
  'web.creators.notFor.body':
    'Relay, resim veya video oluşturmaz, etkileşim otomasyonunu çalıştırmaz ve bir gönderinin nasıl performans göstereceğini tahmin etmez. İstediğiniz araçlar bunlarsa, diğer ürünler de bunları yapar ve şimdi bilmenizi tercih ederiz.',

  'web.agencies.title': 'Ajanslar için',
  'web.agencies.lede':
    'Başkaları adına yayın yapıyorsunuz, bu da atıf, onay ve kanıtın incelikten ziyade işin bir parçası olmasını sağlıyor.',
  'web.agencies.job.separation.title': 'Devam eden müşteri ayrılığı',
  'web.agencies.job.separation.body':
    "Her çalışma alanı, uygulamada olduğu gibi veritabanı düzeyinde de yalıtılmıştır. Çalışma alanı sınırını aşan bir sorgu, yalnızca birisinin unutabileceği kod yolunda değil, Postgres'te de başarısız olur.",
  'web.agencies.job.approval.title': 'Bir müşterinin gerçekten kullanabileceği onaylar',
  'web.agencies.job.approval.body':
    'İncelemeyi yapan kişi her hedefi, her değişkeni, zaman dilimini ve tahmini maliyeti tek bir ekranda görür ve ekran bir telefonda çalışır. Onay kararları kimin, ne zaman, ne gördüğü ile birlikte kayıt altına alınır.',
  'web.agencies.job.receipts.title': 'Garip konuşmanın kanıtı',
  'web.agencies.job.receipts.body':
    'Her yayın, harici posta kimliğini ve tam deneme geçmişini içeren değişmez bir makbuz üretir. Bir müşteri saat dokuzda bir şeyler olup olmadığını sorduğunda yanıta bir zaman damgası ve bir platform tanımlayıcı iliştirilmiştir.',
  'web.agencies.job.roles.title': 'İşin bölünme şekliyle eşleşen roller',
  'web.agencies.job.roles.body':
    'Proje ve hesap başına kapsam dahilinde sahip, yönetici, yönetici, editör, onaylayan, analist ve görüntüleyici. Sınırsız ekip üyesi, çünkü koltuk başına ücretlendirme ajansların oturum açma bilgilerini paylaşmasına neden olur ve bu bir güvenlik sorunudur.',
  'web.agencies.limits.title': 'Sınır açıkça ifade edildi',
  'web.agencies.limits.body':
    "Bir plan 30 aktif sosyal kanalı kapsar. Kanal, bir sosyal hesap, Sayfa, profil, grup veya yayın bağlantısıdır. 30'dan fazlasına ihtiyacınız varsa bize neye ihtiyacınız olduğunu söyleyin, size gizli bir aşama yerine doğrudan bir yanıt verelim.",

  'web.developers.title': 'Geliştiriciler için',
  'web.developers.lede':
    'Yayınlama, iş akışının bir hatanın genel ve kalıcı olduğu kısmıdır. Relay size bir arka uç, yazılan hatalar, her yazma işleminde belirsizlik ve bir aracının konuşamayacağı bir onay modeli sunar.',
  'web.developers.surface.api.title': "REST API'si",
  'web.developers.surface.api.body':
    'Kapsamlı API anahtarları, her yazma işleminde gereken bir boşluk anahtarı, imleç sayfalandırması ve kararlı bir kod taşıyan yazılı bir hata zarfı, bir mesaj anahtarı ve arındırılmış ayrıntılar. Hiçbir sağlayıcı verisi size ham olarak geri yansıtılmaz.',
  'web.developers.surface.mcp.title': 'Uzak MCP sunucusu',
  'web.developers.surface.mcp.body':
    'OAuth ile yayınlanabilir HTTP. Araçlar ayrıntılıdır ve her biri yan etkilerini beyan eder. Okuma, taslak oluşturma, onay isteme, planlama ve yayınlama ayrı kapsamlardır, dolayısıyla taslak oluşturabilen bir model yayınlanamaz.',
  'web.developers.surface.cli.title': 'CLI',
  'web.developers.surface.cli.body':
    'Her komut, sabit bir şekle sahip, makine tarafından okunabilen çıktıyı destekler, böylece bir komut dosyası onu ayrıştırabilir ve sürekli bir entegrasyon işi üzerinde başarısız olabilir.',
  'web.developers.surface.webhooks.title': 'İmzalı web kancaları',
  'web.developers.surface.webhooks.body':
    'Sonuçları, onay kararlarını, bağlantı durumunu ve doğrulama sonuçlarını imzalanmış, tekrar oynatılmaya dayanıklı ve kontrol panelinden yeniden gönderilebilir şekilde yayınlayın.',
  'web.developers.safety.title': 'Temsilci güvenlik modeli',
  'web.developers.safety.body':
    'Temsilci kimlik bilgisi, bir kişi oturumunun kopyası değil, kapsamlı bir hizmet hesabıdır. Marka başına, hesap başına, yerel ayar başına, etki alanı başına, tempo başına ve ileri bakış başına kısıtlamalar taşır ve sunucu, aracı ana bilgisayara güvenmek yerine her çağrıyı yeniden yetkilendirir.',
  'web.developers.safety.injection':
    'Web sayfaları, yayınlar, yorumlar ve platform yanıtları güvenilmeyen veriler olarak değerlendirilir. Model çıktısı deterministik olarak yeniden doğrulanır çünkü bir gönderinin iyi olduğunu söyleyen bir model bir güvenlik kararı değildir.',
  'web.developers.safety.killSwitch':
    'Her aracı ve her çalışma alanı, bekleyen işi silmeden durduran bir durdurma anahtarına sahiptir.',
  'web.developers.openSource.title': 'Açık parçalar',
  'web.developers.openSource.body':
    "Bağlayıcı sözleşmesi, CLI, şema örnekleri, MCP aracı tanımları ve sağlayıcı simülatörü, korumalı alan hesabı olmadan Relay'e karşı oluşturmanız gereken parçalardır. Bir arşivin henüz yayınlanmadığı durumlarda, hiçbir şeye bağlantı vermek yerine bu sayfa bunu söylüyor.",

  /* ---------------------------------------------------------------------- */
  /* Pricing                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.pricing.title': 'One plan',
  'web.pricing.lede':
    'There are no feature tiers, so there is no comparison table to read. Both billing intervals unlock every shipped feature.',
  'web.pricing.intervalHeading': 'Choose how you pay',
  'web.pricing.monthlyLabel': 'Billed monthly',
  'web.pricing.annualLabel': 'Billed annually',
  'web.pricing.annualDetail': '$300 charged once a year.',
  'web.pricing.monthlyDetail': '$29 charged every month.',
  'web.pricing.perMonthNote':
    'Prices are in US dollars. Polar adds any sales tax or VAT that applies where you are.',

  'web.pricing.beside.title': 'What you are agreeing to',
  'web.pricing.beside.channels':
    '30 active social channels. A channel is one social account, Page, profile, group or publication connection.',
  'web.pricing.beside.members':
    'Unlimited team members, workspaces and project groups. There is no per seat charge.',
  'web.pricing.beside.fairUse':
    'Unlimited drafts, scheduled posts and stored receipts under a published fair use and anti spam policy. Those controls exist to protect your connected accounts and they apply identically to every subscriber.',
  'web.pricing.beside.metered':
    'X charges per API operation and charges more for a post that contains a URL. Relay passes that through at cost, estimates it before you confirm the action, and shows it in your usage. Other platform fees are passed through only when they are disclosed before the action.',
  'web.pricing.beside.noMedia':
    'AI image generation and AI video generation are not included and are not sold. There are no media credits, because Relay does not generate media.',
  'web.pricing.beside.trial':
    'The trial runs for seven days with every feature. Polar collects a payment method at checkout and charges $0 today. The exact first charge amount and date are shown next to the start action before you confirm.',
  'web.pricing.beside.conversion':
    'If you do nothing, the trial converts on day seven to the interval you chose and Polar charges the amount shown at checkout. Polar emails a reminder three days before that happens.',
  'web.pricing.beside.cancel':
    'Cancel from Settings at any time without contacting support. Cancel before the trial converts and no charge is attempted. Cancel after that and you keep access until the paid period ends.',
  'web.pricing.beside.data':
    'Nothing is deleted when a subscription ends. You can export your content, receipts and analytics, and you can delete them yourself.',

  'web.pricing.included.title': 'Included, in both intervals',
  'web.pricing.compare.title': 'Why there is no comparison table here',
  'web.pricing.compare.body':
    'A comparison table exists to show what a cheaper plan takes away. There is one plan, so the table would have one column. If we ever add a tier, we will say what moved and why on the changelog before the price page changes.',

  'web.pricing.testimonials.title': 'There are no customer quotes on this page yet',
  'web.pricing.testimonials.body':
    'A quote goes up only when the customer wrote it, gave written permission for it, and we can point to the work it describes. Until then an empty space is more honest than a wall of invented praise.',

  'web.pricing.faq.title': 'Questions people ask before paying',
  'web.pricing.faq.channels.q': 'What happens if I go over 30 channels',
  'web.pricing.faq.channels.a':
    'Nothing is disconnected and nothing is deleted. Channels over the limit become read only, you choose which ones stay active, and we tell you before it happens.',
  'web.pricing.faq.refund.q': 'Do you refund',
  'web.pricing.faq.refund.a':
    'Yes, under the published refund and cancellation policy, and always where consumer law requires it. Billing is handled by Polar as merchant of record and refunds are issued through Polar.',
  'web.pricing.faq.selfHost.q': 'Can I run it myself',
  'web.pricing.faq.selfHost.a':
    'Not today. Whether there will be a self hosted edition, and under which licence, is an open decision. We will publish the answer rather than imply one.',
  'web.pricing.faq.xCost.q': 'How much will X actually cost me',
  'web.pricing.faq.xCost.a':
    'It depends on how many posts you publish and how many of them contain a URL, because X prices those differently. Relay estimates each action before you confirm it and totals it in your usage view. We do not mark it up.',
  'web.pricing.faq.trialAbuse.q': 'Can I start a second trial',
  'web.pricing.faq.trialAbuse.a':
    'Repeat trials are limited by Polar. If you have a legitimate reason, contact support and a person will look at it.',

  /* ---------------------------------------------------------------------- */
  /* Resources index                                                         */
  /* ---------------------------------------------------------------------- */

  'web.resources.title': 'Kaynaklar',
  'web.resources.lede':
    'Ürün hakkındaki operasyonel gerçekler ve bir platform hakkında iddia ettiğimiz her şeyin arkasındaki araştırma.',
  'web.resources.status.body':
    'Olay geçmişiyle birlikte her yüzeyin ve her konektörün mevcut durumu.',
  'web.resources.changelog.body':
    'Neyin gönderildiği, bir konektörde nelerin değiştiği ve neleri düzelttiğimiz.',
  'web.resources.docs.body': 'REST API, MCP, CLI ve webhook belgeleri.',
  'web.resources.methodology.body':
    'Her platform iddiasını nasıl araştırıyoruz, tarihlendiriyoruz, kaynak gösteriyoruz ve düzeltiyoruz.',
  'web.resources.compare.body':
    'Her birinin kime uygun olduğu da dahil olmak üzere diğer araçlarla tarihli karşılaştırmalar.',
  'web.resources.capabilities.body':
    'Bağlayıcı tanımlarından oluşturulan platform başına, yetenek başına.',
  'web.resources.toolRadar.body': 'Sınırlamalar ve açıklamalarla, tarihli, uzman yaratıcı araçlar.',
  'web.resources.opportunities.body':
    'Her hedef kuralıyla birlikte başlatılacak, listelenecek veya katkıda bulunulacak seçilmiş yerler.',
  'web.resources.legal.body':
    'Terms, privacy, acceptable use, AI use, security and the rest of the policy set.',
  'web.resources.guides.title': 'Kılavuzlar ve iş akışları',
  'web.resources.guides.empty': 'Henüz bir rehber yayınlanmadı',
  'web.resources.guides.emptyBody':
    'Editoryal standart, orijinal ürün verileri, tekrarlanabilir bir iş akışı, doğrulama tarihi olan birincil platform kaynakları ve adlandırılmış bir insan editör gerektirir. İlk kılavuzlar buluştuğunda yayınlanır.',

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.status.title': 'Durum',
  'web.status.lede':
    "Her Röle yüzeyinin ve her konektörün durumu. Bağlayıcı durumu, bağdaştırıcımızı ve bağlı olduğu platform API'sini kapsar.",
  'web.status.updated': 'Durumlar elle ayarlanır. Son güncelleme {time}.',
  'web.status.surfaces.title': 'Yüzeyler',
  'web.status.connectors.title': 'Konektörler',
  'web.status.level.operational': 'Normal şekilde çalışıyor',
  'web.status.level.degraded': 'Bozulmuş',
  'web.status.level.partial': 'Kısmi kesinti',
  'web.status.level.outage': 'Kesinti',
  'web.status.level.maintenance': 'Planlı bakım',
  'web.status.level.notLive': 'Henüz yayında değil',
  'web.status.notLiveBody':
    'Bu bağlayıcı oluşturuldu ancak henüz müşteri trafiğini taşımıyor, bu nedenle raporlanacak bir şey yok.',
  'web.status.incidents.title': 'Olay geçmişi',
  'web.status.incidents.empty': 'Hiçbir olay kaydedilmedi',
  'web.status.incidents.emptyBody':
    'Bu sayfa bilerek boş başlıyor. Kendi hatalarımızdan kaynaklananlar da dahil olmak üzere, yayıncılığı etkileyen her olayı, zaman çizelgesi ve sonrasında değişenlerle birlikte yayınlıyoruz.',
  'web.status.incident.started': '{time} başladı',
  'web.status.incident.resolved': 'Çözüldü {time}',
  'web.status.incident.impact': 'Etki',
  'web.status.incident.cause': 'Sebep',
  'web.status.incident.followUp': 'Daha sonra ne değişti',
  'web.status.subscribe.title': 'Bir şey bozulduğunda haber alın',
  'web.status.subscribe.body':
    'Bağlantı durumu, yayınlama hataları ve platform olayları imzalı web kancaları olarak kendi uç noktanıza iletilir. Henüz ayrı bir durum posta listesi bulunmamaktadır.',

  /* ---------------------------------------------------------------------- */
  /* Changelog                                                               */
  /* ---------------------------------------------------------------------- */

  'web.changelog.title': 'Değişiklik günlüğü',
  'web.changelog.lede':
    'Ürün değişiklikleri, konnektör değişiklikleri ve düzeltmeler. Neleri yayınlayabileceğinizi etkileyen bir yetenek değişikliği, bu sitenin başka herhangi bir yerinde görünmeden önce burada görünür.',
  'web.changelog.kind.shipped': 'Gönderildi',
  'web.changelog.kind.changed': 'Değiştirildi',
  'web.changelog.kind.fixed': 'Sabit',
  'web.changelog.kind.connector': 'Bağlayıcı',
  'web.changelog.kind.correction': 'Düzeltme',
  'web.changelog.kind.security': 'Güvenlik',
  'web.changelog.empty': 'Henüz hiçbir şey halka açık olarak gönderilmedi',
  'web.changelog.emptyBody':
    'Röle yapım aşamasındadır. Buradaki ilk giriş, kendimizle ilgili bir dönüm noktası değil, müşterinin kullanabileceği ilk şeydir.',

  /* ---------------------------------------------------------------------- */
  /* Docs shell                                                              */
  /* ---------------------------------------------------------------------- */

  'web.docs.title': 'Dokümantasyon',
  'web.docs.lede':
    "Bir arka uç, dört giriş yolu. Her bölüm aynı kullanım örneklerini belgelediğinden, REST API'de öğrendiğiniz bir kavram, MCP ve CLI'de aynı kavramdır.",
  'web.docs.section.start.title': 'Başlarken',
  'web.docs.section.start.body':
    'Kimlik doğrulama, çalışma alanları, projeler ve yayınlanan ilk gönderiniz.',
  'web.docs.section.api.title': "REST API'si",
  'web.docs.section.api.body':
    'Kaynaklar, sayfalandırma, eksiklik, hata kodları ve oran sınırları.',
  'web.docs.section.mcp.title': 'MCP sunucusu',
  'web.docs.section.mcp.body': 'Taşıma, OAuth, araç kataloğu, kapsamlar ve onay anlaşması.',
  'web.docs.section.cli.title': 'CLI',
  'web.docs.section.cli.body':
    'Sözleşmeyi yükleyin, doğrulayın ve makine tarafından okunabilir çıktı sözleşmesi yapın.',
  'web.docs.section.webhooks.title': 'Web kancaları',
  'web.docs.section.webhooks.body':
    'Etkinlik kataloğu, imza doğrulama, yeniden denemeler ve yeniden dağıtım.',
  'web.docs.section.connectors.title': 'Konektörler',
  'web.docs.section.connectors.body':
    'Platform gereksinimlerine, hesap türlerine, limitlere ve bilinen kısıtlamalara göre.',
  'web.docs.section.errors.title': 'Hata referansı',
  'web.docs.section.errors.body':
    'Her hata kodu, buna neyin sebep olduğu ve bu konuda ne yapılması gerektiği.',
  'web.docs.pending': 'Henüz yayınlanmadı',
  'web.docs.pendingBody':
    "Bu bölüm, gönderilen API'ye karşı yazılır ve onunla birlikte yayınlanır. Size değişebilecek bir uç noktaya ilişkin belgelerden başka hiçbir şey göstermemeyi tercih ederiz.",
  'web.docs.principles.title': 'Neye güvenebilirsin',
  'web.docs.principles.idempotency':
    'Her yazma bir idempotency anahtarı alır. Bir isteği aynı anahtarla tekrar yürütmek, ikinci bir gönderi oluşturmak yerine orijinal sonucu döndürür.',
  'web.docs.principles.errors':
    'Her hata sabit bir kod, bir mesaj anahtarı ve arındırılmış ayrıntılar taşır. Kodlar sürümler arasında anlam değiştirmez.',
  'web.docs.principles.versioning':
    'Son dakika değişiklikleri yeni bir sürüme ve duyurulan bir kullanımdan kaldırma penceresine sahip olur. İlave değişiklikler yapılmaz.',
  'web.docs.principles.scopes':
    'Okuma, taslak hazırlama, onay isteme, planlama ve yayınlama ayrı kapsamlardır. Bir kimlik bilgisi, işini yapan en küçük kümeyi alır.',

  /* ---------------------------------------------------------------------- */
  /* Methodology                                                             */
  /* ---------------------------------------------------------------------- */

  'web.methodology.title': 'Metodoloji',
  'web.methodology.lede':
    'Bu sitedeki herhangi bir şeye nasıl doğru denilebilir ve öyle olmadığı ortaya çıktığında ne olur?',
  'web.methodology.claims.title': 'Platform talepleri',
  'web.methodology.claims.body':
    "Bir platformun neye izin verdiğine ilişkin her iddia, o platformun kendi belgelerinden veya politika sayfasından gelir. URL'yi, okunduğu tarihi, uygulandığı API sürümünü ve sahibi olan kişinin tekrar kontrol etmesini kaydediyoruz. Bu dört şeyin olmadığı bir iddia siteye girmez.",
  'web.methodology.recheck.title': 'Tekrar kontrol ettiğimizde',
  'web.methodology.recheck.beforeConnector':
    'Bir bağlayıcı başlamadan önce ve yine müşteri trafiğini taşımadan önce.',
  'web.methodology.recheck.monthly':
    'Platform değişiklik kayıtları ve satıcı fiyatlandırması için her ay.',
  'web.methodology.recheck.quarterly':
    'Rakip planları, topluluk kuralları ve yasal belgeler için her üç ayda bir.',
  'web.methodology.recheck.immediate':
    'Herhangi bir platformun reddedilmesinden, yaptırım bildiriminden, kullanımdan kaldırılmasından veya yayınlama veya analiz davranışında açıklanamayan bir değişiklikten hemen sonra.',
  'web.methodology.comparison.title': 'Karşılaştırmalar',
  'web.methodology.comparison.bestFor':
    'Her karşılaştırma, her ürünün kimin için en iyi olduğunu belirtir; bu kişinin biz olmadığı durumlar da dahil.',
  'web.methodology.comparison.dated':
    'Her karşılaştırma araştırma tarihini taşır ve birincil fiyatlandırma ile yetenek kaynaklarını birbirine bağlar.',
  'web.methodology.comparison.distinction':
    'Eksik bir yetenek ya bizim geliştirmediğimiz bir şey ya da platformun izin vermediği bir şey olarak etiketlenir. Bunlar farklı cümlelerdir ve bunları asla birleştirmeyiz.',
  'web.methodology.comparison.noLogos':
    'Başka bir şirketin müşteri logolarını, alıntılarını veya arayüz ekran görüntülerini kullanmayız ve sahip olmadığımız bir onayı talep etmeyiz.',
  'web.methodology.benchmarks.title': 'Karşılaştırmalar ve ürün verileri',
  'web.methodology.benchmarks.body':
    'Müşteri faaliyetlerinden elde edilen herhangi bir sayı, örneğini, hariç tutulanlarını, metrik tanımını ve gizlilik eşiğini belirtir ve hiçbir çalışma alanının tanımlanamaması için toplanır. Eğer bir örnek güvenli bir şekilde yayınlanamayacak kadar küçükse yine de yayınlamak yerine bunu söylüyoruz.',
  'web.methodology.ai.title': 'Kendi içeriğimizde yapay zeka',
  'web.methodology.ai.body':
    'Bir model araştırabilir, ana hatlarını çizebilir, tercüme edebilir, kontrol edebilir ve biçimlendirebilir. Adı geçen bir kişi her iddianın sahibidir, makaleyi düzenler ve güncel tutar. İncelenmemiş oluşturulmuş makaleleri yayınlamıyoruz ve ekran görüntülerini oluşturmuyoruz.',
  'web.methodology.corrections.title': 'Düzeltmeler',
  'web.methodology.corrections.body':
    'Bir sayfa hatalı olduğunda, onu yerinde düzeltir, tarihli bir düzeltme notu ekler ve düzeltmeyi değişiklik günlüğünde listeleriz. Bir sayfa düzeltilemeyecek kadar eskiyse, onu açık bırakmak yerine kullanımdan kaldırırız.',

  /* ---------------------------------------------------------------------- */
  /* Compare                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.compare.title': 'Karşılaştırmalar',
  'web.compare.lede':
    'Bu sayfalar diğer ürünü seçseniz bile faydalıdır. Yayınlamadan önce karşılamaları gereken standart budur.',
  'web.compare.rules.title': 'Bu sayfaların uyduğu kurallar',
  'web.compare.rules.bestFor':
    'Her sayfa, kendi bölümünde ilk önce diğer ürünün kime uygun olduğunu belirtir.',
  'web.compare.rules.dated':
    'Her iddiaya tarih atılır ve geldiği birincil kaynağa bağlantı verilir.',
  'web.compare.rules.distinction':
    'Kendi inşa etmediklerimizi, platformun izin vermediği şeylerden ayırıyoruz.',
  'web.compare.rules.axes':
    'Her sayfada aynı şeyler karşılaştırılır: hesap izni, gönderim sınırları, ekip ve onay, API, MCP ve CLI erişimi, içerik dilleri, analizler, video işleme, yerleşik kullanım, kendi kendine barındırma, destek ve üstelik ödediğiniz platform API maliyeti.',
  'web.compare.rules.correction':
    'Her sayfada bir düzeltme iletişim kişisi ve bir inceleme tarihi bulunur.',
  'web.compare.planned.title': 'Planlanan sayfalar',
  'web.compare.planned.body':
    'Bunlar, mevcut fiyatlandırma ve yetenek kontrolü tamamlandıktan sonra yayınlanır. Hafızadan yazılan bir karşılaştırma, hiç karşılaştırma yapılmamasından daha kötüdür.',
  'web.compare.empty': 'Henüz bir karşılaştırma yayınlanmadı',
  'web.compare.emptyBody':
    'Her sayfanın, diğer ürünün kendi fiyatlandırması ve belgelerine göre yeni bir doğruluk kontrolüne ihtiyacı vardır. İş bitince teker teker yayınlıyorlar.',

  /* ---------------------------------------------------------------------- */
  /* Tool radar                                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.title': 'Yaratıcı araç radarı',
  'web.toolRadar.lede':
    'Röle görüntü veya video oluşturmaz. Hangi uzman aracı kullanacağınıza karar vermenize ve bitmiş varlığı hak kayıtları bozulmadan teslim etmenize yardımcı olur.',
  'web.toolRadar.record.title': 'Her kaydın taşıması gerekenler',
  'web.toolRadar.record.url': 'Resmi URL ve ürünün sahibi olan kuruluş.',
  'web.toolRadar.record.useCase': 'Tavsiye edildiği iş akışı ve belgelenen sınırlamaları.',
  'web.toolRadar.record.pricing': 'Fiyatlandırma modeli ve kontrol ettiğimiz tarih.',
  'web.toolRadar.record.rights':
    'Satıcının kendi ifadeleriyle hakları, lisanslaması, saklaması ve gizlilik uyarıları.',
  'web.toolRadar.record.disclosure':
    'Herhangi bir ticari ilişkimiz olup olmadığı. Sıralama asla buna bağlı değildir.',
  'web.toolRadar.record.verified':
    'Son doğrulanan tarih ve kayıt inceleme penceresini geçtikten sonra görünür bir uyarı.',
  'web.toolRadar.category.title': 'Kategoriler',
  'web.toolRadar.empty': 'Katalog henüz doldurulmadı',
  'web.toolRadar.emptyBody':
    'Kayıtlar satıcının kendi belgelerinden bir kişi tarafından yazılır. Bu sayfayı makul görünen, model tarafından oluşturulmuş bağlantılarla doldurmayacağız.',
  'web.toolRadar.noAffiliateYet':
    'Bugün burada listelenen hiçbir araçla herhangi bir ortaklık ilişkisi yoktur.',

  /* ---------------------------------------------------------------------- */
  /* Opportunities                                                           */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.title': 'Promosyon fırsatları',
  'web.opportunities.lede':
    'Her destinasyonun kendisi için belirlediği kurallara göre, bir ürünün piyasaya sürülebileceği, listelenebileceği, tartışılabileceği veya katkıda bulunulabileceği yerlerin seçilmiş bir kataloğu.',
  'web.opportunities.rules.title': 'Bu kataloğun davranışı',
  'web.opportunities.rules.curated':
    "Her giriş, resmi bir URL'ye, mevcut gönderim kurallarına ve doğrulama tarihine sahip, gözden geçirilmiş bir kayıttır. Hiçbir şey bir model tarafından keşfedilmez ve doğrulanmış olarak sunulmaz.",
  'web.opportunities.rules.noAutomation':
    'Relay asla sizin için bir form göndermez, bir kişiyi kaydetmez, bir topluluğa toplu e-posta veya gönderi göndermez. Sunumu siz yapın.',
  'web.opportunities.rules.noGuarantee':
    'Listeleme bir sıralama vaadi değildir ve bağlantı bir büyüme stratejisi değildir. Öğleden sonraya değip değmeyeceğine karar verebilmeniz için uygunluk, hedef kitle, çaba, maliyet ve açıklama gerekliliklerini gösteriyoruz.',
  'web.opportunities.rules.stale':
    'İnceleme tarihi geçmiş bir kayıt, güncel olarak gösterilmek yerine etiketlenir veya gizlenir.',
  'web.opportunities.category.title': 'Kategoriler',
  'web.opportunities.empty': 'Katalog henüz doldurulmadı',
  'web.opportunities.emptyBody':
    'Her destinasyon kuralının tavsiye edilmeden önce bir kişi tarafından okunması ve kaydedilmesi gerekir. Gelecek olanın şeklini görebilmeniz için kategoriler yukarıda listelenmiştir.',

  /* ---------------------------------------------------------------------- */
  /* Legal, shared                                                           */
  /* ---------------------------------------------------------------------- */

  'web.legal.title': 'Legal and policies',
  'web.legal.lede':
    'The documents that govern using Relay. Where the wording has to be drafted by a lawyer for a specific company and jurisdiction, the page says so instead of pretending.',
  'web.legal.counselPending.title': 'Pending review by counsel before launch',
  'web.legal.counselPending.body':
    'The substance on this page reflects how the product actually behaves and is accurate today. The binding legal wording, the governing jurisdiction and the liability terms are being drafted with qualified counsel and will replace this text before Relay is generally available. This page is not legal advice and it is not a contract yet.',
  'web.legal.contact.title': 'Contact',
  'web.legal.contact.privacy': 'privacy@relay.example',
  'web.legal.contact.legal': 'legal@relay.example',
  'web.legal.contact.security': 'security@relay.example',
  'web.legal.contact.abuse': 'abuse@relay.example',
  'web.legal.contact.copyright': 'copyright@relay.example',
  'web.legal.contact.affiliates': 'affiliates@relay.example',
  'web.legal.contact.accessibility': 'accessibility@relay.example',
  'web.legal.entity.pending':
    'The contracting entity, its registered address and the governing jurisdiction are an open decision and will be named here before launch.',
  'web.legal.index.updated': 'Updated {date}',

  /* Terms ---------------------------------------------------------------- */
  'web.legal.terms.title': 'Terms of Service',
  'web.legal.terms.summary':
    'What Relay agrees to provide, what you agree to do, and what happens when either side stops.',
  'web.legal.terms.service.title': 'What the service is',
  'web.legal.terms.service.body':
    'Relay is a hosted service for creating, approving, scheduling and publishing content to social platforms through those platforms official APIs, together with the receipts, analytics and audit records that result. It is not a social platform and it does not control what any platform does with a post once it is published.',
  'web.legal.terms.content.title': 'Your content stays yours',
  'web.legal.terms.content.body':
    'You keep ownership of everything you upload, write or import. You grant Relay only the licence needed to store it, process it, adapt it into the variants you ask for, and transmit it to the accounts you selected. That licence ends when you delete the content, apart from records we are required to keep.',
  'web.legal.terms.warranties.title': 'What you are confirming when you publish',
  'web.legal.terms.warranties.body':
    'That you are authorized to publish to the accounts you connected, that you hold the rights to the content and the media, that you have the consent required for any person appearing in it, and that publishing it does not breach the destination platform rules.',
  'web.legal.terms.platforms.title': 'Platform dependence',
  'web.legal.terms.platforms.body':
    'Connectors depend on third party APIs that those companies control. A platform can change its API, restrict a permission, revoke an application or close access with little notice. Relay cannot guarantee that any connector remains available, and a connector becoming unavailable is not a failure of this agreement. We will tell you on the status page and the changelog when it happens.',
  'web.legal.terms.ai.title': 'AI output',
  'web.legal.terms.ai.body':
    'Text assistance, translation, transcreation and planning features produce suggestions. They can be wrong, out of date or unsuitable. You are responsible for reviewing anything you publish. Relay does not generate images or video.',
  'web.legal.terms.billing.title': 'Payment',
  'web.legal.terms.billing.body':
    'Polar is the merchant of record. Polar handles checkout, taxes, invoices and refunds. Subscriptions renew automatically at the interval you chose until you cancel. Platform usage that a provider charges per operation is billed separately at cost and is disclosed before the action that incurs it.',
  'web.legal.terms.suspension.title': 'Suspension and scheduled posts',
  'web.legal.terms.suspension.body':
    'If a subscription lapses or a workspace is suspended, scheduled posts stop rather than publishing silently, and the workspace becomes read only. Your content, receipts and connections are preserved and remain exportable.',
  'web.legal.terms.aup.title': 'Acceptable use',
  'web.legal.terms.aup.body':
    'The Acceptable Use Policy forms part of these terms. We may rate limit, pause, require verification, revoke agent or API access, suspend or terminate for a breach of it, and you may appeal any of those decisions to a person.',
  'web.legal.terms.termination.title': 'Ending the agreement',
  'web.legal.terms.termination.body':
    'You can cancel at any time from Settings. After termination you keep an export window before deletion, and deletion is never made conditional on paying an outstanding invoice, other than the billing records we are legally required to retain.',
  'web.legal.terms.developer.title': 'API, MCP and service accounts',
  'web.legal.terms.developer.body':
    'Programmatic access is governed additionally by the API and MCP Terms, including rate limits, scope requirements and the rule that a service account never inherits a human full permissions.',

  /* Privacy -------------------------------------------------------------- */
  'web.legal.privacy.title': 'Privacy Policy',
  'web.legal.privacy.summary':
    'What Relay collects, why, who processes it, how long it is kept, and how to get it out or have it deleted.',
  'web.legal.privacy.collect.title': 'What we hold',
  'web.legal.privacy.collect.account':
    'Account and profile: your name, email, workspace membership and role.',
  'web.legal.privacy.collect.connections':
    'Social connections: the platform account identifier, its display name, its type, the granted scopes and an encrypted access token. Tokens are stored with envelope encryption and are never written to a log.',
  'web.legal.privacy.collect.content':
    'Content and media you create, upload or import, including the rights and provenance you record with it.',
  'web.legal.privacy.collect.schedules':
    'Schedules, approval decisions, publication receipts and audit events.',
  'web.legal.privacy.collect.analytics':
    'Metrics retrieved from platforms about posts you published through Relay.',
  'web.legal.privacy.collect.billing':
    'Billing references held by Polar. Relay does not store your card details.',
  'web.legal.privacy.collect.technical':
    'Device and log data needed to operate and secure the service, redacted by default.',
  'web.legal.privacy.collect.agent':
    'Agent and API activity: which credential took which action, with an input hash rather than the input.',
  'web.legal.privacy.minimization.title': 'What we deliberately do not do',
  'web.legal.privacy.minimization.scopes':
    'We request only the platform scopes the features you have enabled actually need.',
  'web.legal.privacy.minimization.history':
    'We do not ingest your entire social history in order to draw a chart.',
  'web.legal.privacy.minimization.logs':
    'Post content is redacted from general logs and from support tooling.',
  'web.legal.privacy.minimization.training':
    'Your content is not used to train our models or anyone models by default.',
  'web.legal.privacy.subprocessors.title': 'Who else processes it',
  'web.legal.privacy.subprocessors.body':
    'The current subprocessor list is published separately and changes are announced there before they take effect.',
  'web.legal.privacy.retention.title': 'How long we keep it',
  'web.legal.privacy.rights.title': 'Your controls',
  'web.legal.privacy.rights.export':
    'Download your content, receipts and analytics as JSON and CSV with a media archive.',
  'web.legal.privacy.rights.revoke':
    'Disconnect one social account without deleting the workspace. Tokens are revoked at the platform and deleted here.',
  'web.legal.privacy.rights.delete':
    'Delete a project, a piece of content, a media file or the entire account.',
  'web.legal.privacy.rights.cancelJobs':
    'Cancel scheduled jobs before deleting anything, so nothing publishes after you leave.',
  'web.legal.privacy.rights.sessions':
    'See and revoke active sessions, API keys, agent credentials, webhooks and platform permissions.',
  'web.legal.privacy.rights.consent':
    'Consent preferences are versioned and auditable, so you can see what you agreed to and when.',
  'web.legal.privacy.deletion.title': 'Deleting data held at a platform',
  'web.legal.privacy.deletion.body':
    'Disconnecting an account in Relay revokes the token at the platform and deletes the credential here. Content already published on a platform is governed by that platform and has to be deleted there. Where a platform requires deletion of derived data within a fixed period after revocation, we meet that period. For Google and YouTube data that period is currently 30 days.',
  'web.legal.privacy.transfers.title': 'International transfers',
  'web.legal.privacy.transfers.body':
    'Hosting regions and the transfer mechanism are being finalized with counsel and will be named here, together with the safeguards that apply, before launch.',

  /* Acceptable use ------------------------------------------------------- */
  'web.legal.aup.title': 'Acceptable Use Policy',
  'web.legal.aup.summary':
    'Relay helps you publish content you are authorized to publish. It is not built to help anyone evade a platform limit, fake an endorsement or send unwanted messages.',
  'web.legal.aup.prohibited.title': 'Not permitted',
  'web.legal.aup.prohibited.spam':
    'Spam, unsolicited bulk messages, replies or mentions, engagement bait, and repeated unwanted content.',
  'web.legal.aup.prohibited.linkSchemes':
    'Automated directory or form submissions, bulk outreach, link schemes, paid or reciprocal links intended to manipulate search ranking, and community promotion that breaks the destination rules.',
  'web.legal.aup.prohibited.inauthentic':
    'Coordinated inauthentic behaviour, multi account amplification presented as independent, engagement pods, fake reviews, ratings or install counts, automated likes and follows, and trend manipulation.',
  'web.legal.aup.prohibited.duplicate':
    'Publishing duplicate or substantially similar content across many accounts where the platform prohibits it.',
  'web.legal.aup.prohibited.impersonation':
    'Impersonation, phishing, fraud, scams, malware, credential theft and deceptive installation.',
  'web.legal.aup.prohibited.harm':
    'Harassment, doxxing, sexual exploitation, non consensual intimate media, hate or violent extremist content, and illegal goods or services.',
  'web.legal.aup.prohibited.political':
    'Political manipulation and automated political persuasion where it is prohibited. Political content, where permitted at all, is subject to enhanced review.',
  'web.legal.aup.prohibited.rights':
    'Copyright, trademark and publicity violations, unlicensed music or media, synthetic likenesses without rights and disclosure, and undisclosed paid endorsements.',
  'web.legal.aup.prohibited.circumvention':
    'Bypassing official APIs, rate limits, audits, account controls or platform enforcement using browser automation, cookie replay or scraping.',
  'web.legal.aup.prohibited.restrictedStores':
    'Automated submission to app stores, the Chrome Web Store or other restricted submission systems through unauthorized interfaces.',
  'web.legal.aup.prohibited.banEvasion':
    'Evading an account ban or running coordinated account farms.',
  'web.legal.aup.prohibited.training':
    'Training or evaluating models on third party or other customers content without authorization.',
  'web.legal.aup.controls.title': 'The controls that enforce this',
  'web.legal.aup.controls.duplicate':
    'Exact and near duplicate fingerprinting by workspace, account, platform and time window, with a cross account similarity check.',
  'web.legal.aup.controls.cadence':
    'Account level and workspace level cadence budgets, plus mention, hashtag, URL and domain volume checks.',
  'web.legal.aup.controls.escalation':
    'New account, new domain and bulk action escalation, and a maximum number of repetitions for any repeating campaign.',
  'web.legal.aup.controls.linkSafety':
    'Destination scanning on short links, with emergency disable and an abuse report channel.',
  'web.legal.aup.controls.workspaceCaps':
    'A workspace owner can set stricter limits than the plan allows. Risk controls cannot be loosened by paying more.',
  'web.legal.aup.enforcement.title': 'Enforcement and appeal',
  'web.legal.aup.enforcement.body':
    'Where we can, we block before the external action rather than after it, and we record the reason, the rule version and the appeal path. Repeated or serious behaviour goes to a trust review by a person. You will be told what happened, without a level of detail that would help someone evade the check. Every decision can be appealed and reversed.',
  'web.legal.aup.report.title': 'Reporting abuse',
  'web.legal.aup.report.body':
    'If content published through Relay breaks these rules, tell us. Include the post URL and what is wrong with it.',

  /* AI policy ------------------------------------------------------------ */
  'web.legal.ai.title': 'AI Use and Generated Content Policy',
  'web.legal.ai.summary':
    'Which features use a model, what is sent, what is kept, what you stay responsible for, and why Relay does not generate media.',
  'web.legal.ai.features.title': 'Where a model is used',
  'web.legal.ai.features.text':
    'Text assistance in the composer: rewriting, shortening and adapting for a platform.',
  'web.legal.ai.features.translation':
    'Translation and transcreation into your content languages, against your project glossary.',
  'web.legal.ai.features.feedback': 'Content feedback and the four week growth plan.',
  'web.legal.ai.features.provider':
    'These features call DeepSeek. The model identifiers currently in use are published in the documentation and any change is listed on the changelog.',
  'web.legal.ai.data.title': 'What is sent, and what happens to it',
  'web.legal.ai.data.sent':
    'Only the text you asked us to work on, the instruction, and the project context you chose to attach. Credentials, tokens and other customers content are never in a model context.',
  'web.legal.ai.data.training':
    'Your content is not used to train our models. We configure providers so it is not used to train theirs.',
  'web.legal.ai.data.optOut':
    'Optional AI features can be turned off per workspace. Publishing, scheduling, approvals and analytics do not depend on them.',
  'web.legal.ai.responsibility.title': 'What stays yours',
  'web.legal.ai.responsibility.body':
    'A model can be confidently wrong. You are responsible for checking facts, claims, names, numbers and tone before you publish, and for any disclosure a platform requires. No AI feature guarantees reach, engagement or ranking, and none is offered as one.',
  'web.legal.ai.disclosure.title': 'Disclosure and provenance',
  'web.legal.ai.disclosure.body':
    'Relay records whether content was AI assisted in its internal history, reminds you where a platform requires an altered or synthetic media disclosure, and stores the provenance you provide with an imported asset. Where a platform offers a disclosure field, Relay sets it from your declaration rather than guessing.',
  'web.legal.ai.blocks.title': 'What the AI features refuse',
  'web.legal.ai.blocks.impersonation': 'Impersonating a real person or a public figure.',
  'web.legal.ai.blocks.ncii': 'Non consensual intimate imagery, in any form.',
  'web.legal.ai.blocks.fabrication':
    'Fabricated testimonials, invented customers and invented performance figures.',
  'web.legal.ai.blocks.unverified':
    'Presenting a model generated URL as a verified opportunity. Opportunity and tool recommendations come only from the curated catalog.',
  'web.legal.ai.noMedia.title': 'Why there is no image or video generation',
  'web.legal.ai.noMedia.body':
    'Relay has not collected the verified visual system, product detail, asset rights, likeness permissions and campaign context that brand ready output would require, and in app generation would need its own consent, provenance, safety evaluation and cost controls. Media model capability, licensing, pricing and retention also change quickly, which is why our tool recommendations carry dates. You keep creative control by choosing a specialist tool and importing the approved asset. Relay handles adaptation, approval, publishing and measurement.',
  'web.legal.ai.noMedia.caveat':
    'A tool appearing in our radar is not a statement that its output is safe or rights cleared. Its documented caveats are shown with it and your normal rights declaration still applies.',

  /* Cookies -------------------------------------------------------------- */
  'web.legal.cookies.title': 'Cookie Policy',
  'web.legal.cookies.summary':
    'What is stored in your browser, why, and what happens if you refuse the optional parts.',
  'web.legal.cookies.essential.title': 'Strictly necessary',
  'web.legal.cookies.essential.body':
    'A session cookie that keeps you signed in, a cross site request forgery token, and a preference cookie holding your theme and time zone choice. These cannot be turned off without breaking sign in, and they are not used for advertising.',
  'web.legal.cookies.analytics.title': 'Product analytics',
  'web.legal.cookies.analytics.body':
    'Aggregate, first party measurement of which screens are used, so we can fix the ones that are not working. It is optional, it is off until you allow it, and refusing it changes nothing about the product.',
  'web.legal.cookies.marketing.title': 'Advertising',
  'web.legal.cookies.marketing.body':
    'We do not run advertising cookies, we do not embed third party advertising pixels, and we do not sell or share personal information for cross context behavioural advertising.',
  'web.legal.cookies.shortLinks.title': 'Tracked short links',
  'web.legal.cookies.shortLinks.body':
    'A short link click creates first party analytics for the workspace that owns the link. Location and device data are minimized, bot traffic is classified out, IP addresses are truncated or discarded promptly, and a workspace can turn tracking off or shorten retention. Nothing sensitive is ever put in a slug or a query parameter.',
  'web.legal.cookies.control.title': 'Changing your mind',
  'web.legal.cookies.control.body':
    'The consent choice is stored with a version and can be changed at any time in Settings, under data controls. Withdrawing consent takes effect immediately.',

  /* Subprocessors -------------------------------------------------------- */
  'web.legal.subprocessors.title': 'Subprocessors',
  'web.legal.subprocessors.summary':
    'The companies that process customer data on our behalf, what they do, and where.',
  'web.legal.subprocessors.notice.title': 'Change notice',
  'web.legal.subprocessors.notice.body':
    'A new subprocessor is published here before it starts processing customer data, with at least 30 days notice for a change that materially affects processing. Customers with a data processing addendum can object during that window.',
  'web.legal.subprocessors.column.name': 'Subprocessor',
  'web.legal.subprocessors.column.purpose': 'What it processes for us',
  'web.legal.subprocessors.column.data': 'Data categories',
  'web.legal.subprocessors.column.region': 'Processing region',
  'web.legal.subprocessors.platforms.title': 'Social platforms are not subprocessors',
  'web.legal.subprocessors.platforms.body':
    'When you publish, Relay transmits your content to the platform account you selected, at your instruction. Those platforms are independent controllers of what they receive and their own terms govern it.',

  /* Refunds -------------------------------------------------------------- */
  'web.legal.refunds.title': 'Refund and Cancellation Policy',
  'web.legal.refunds.summary':
    'How to cancel, what happens to your data, and when you get money back.',
  'web.legal.refunds.cancel.title': 'Cancelling',
  'web.legal.refunds.cancel.body':
    'Cancel from Settings without contacting support. Cancelling during the seven day trial means no charge is attempted and the cancellation screen confirms that in writing. Cancelling after the trial keeps your access until the end of the period you already paid for.',
  'web.legal.refunds.refund.title': 'Refunds',
  'web.legal.refunds.refund.body':
    'If the service did not work as described, contact support and we will refund the affected period. Mandatory consumer withdrawal rights, including the statutory cooling off period where it applies to you, are honoured in full and are not limited by anything on this page. Refunds are issued by Polar, our merchant of record, to the original payment method.',
  'web.legal.refunds.usage.title': 'Platform usage charges',
  'web.legal.refunds.usage.body':
    'Usage passed through from a platform, such as X per operation pricing, covers a cost we already paid on your behalf for an action you confirmed. It is refundable when the charge was our error, for example a duplicate dispatch caused by a defect on our side.',
  'web.legal.refunds.data.title': 'What happens to your data',
  'web.legal.refunds.data.body':
    'Nothing is deleted at cancellation. The workspace becomes read only, scheduled posts stop rather than publishing, and you keep an export window before deletion. Deletion is never made conditional on paying an invoice, apart from the billing records we must keep by law.',
  'web.legal.refunds.failed.title': 'A failed payment',
  'web.legal.refunds.failed.body':
    'Polar retries and emails you. During the grace period publishing continues. After it, the workspace becomes read only and scheduled posts stop. Nothing is disconnected and nothing is deleted.',

  /* DMCA ----------------------------------------------------------------- */
  'web.legal.dmca.title': 'Copyright and Takedown',
  'web.legal.dmca.summary':
    'How to report content hosted by Relay that infringes your rights, and how to respond if yours was removed.',
  'web.legal.dmca.scope.title': 'What we can act on',
  'web.legal.dmca.scope.body':
    'Relay can remove material stored in our systems, such as a media file or a draft. Content already published on a social platform lives on that platform and has to be reported to it, because we cannot delete a post we do not host. We will tell you which of the two applies to your report.',
  'web.legal.dmca.notice.title': 'Sending a notice',
  'web.legal.dmca.notice.identify':
    'Identify the copyrighted work and the material you say infringes it, with a URL we can reach.',
  'web.legal.dmca.notice.contact': 'Give your name, address, telephone number and email.',
  'web.legal.dmca.notice.goodFaith':
    'State that you believe in good faith that the use is not authorized by the rights holder, its agent or the law.',
  'web.legal.dmca.notice.accuracy':
    'State that the information is accurate and, under penalty of perjury, that you are authorized to act for the rights holder.',
  'web.legal.dmca.notice.signature': 'Sign it, physically or electronically.',
  'web.legal.dmca.counter.title': 'Counter notice',
  'web.legal.dmca.counter.body':
    'If your material was removed and you believe that was a mistake or a misidentification, you can send a counter notice with the same contact details, identifying the material and where it was, and consenting to the jurisdiction that will be named here. We will forward it to the person who complained.',
  'web.legal.dmca.repeat.title': 'Repeat infringers',
  'web.legal.dmca.repeat.body':
    'Accounts that repeatedly infringe are suspended and then terminated. Bad faith notices, used to remove a competitor content, are also grounds for termination.',

  /* Security ------------------------------------------------------------- */
  'web.legal.security.title': 'Security and Responsible Disclosure',
  'web.legal.security.summary':
    'How Relay protects the credentials you trust it with, and how to report a problem you find.',
  'web.legal.security.tokens.title': 'Social credentials',
  'web.legal.security.tokens.body':
    'Platform tokens are encrypted with envelope encryption under a managed key, rotated, stored apart from content and billing data, and redacted from every log. A token is never sent to a browser, never placed in a model context and never included in an error message.',
  'web.legal.security.tenancy.title': 'Tenancy',
  'web.legal.security.tenancy.body':
    'Isolation is enforced three times: at the edge when you authenticate, in the application service when it authorizes the action, and in PostgreSQL through row level security. Being signed in is never treated as permission. Cross workspace access attempts are tested in continuous integration and must fail.',
  'web.legal.security.publishing.title': 'Publishing integrity',
  'web.legal.security.publishing.body':
    'Every external write carries an idempotency key and produces an immutable receipt. Duplicate publication is treated as a defect with a target of zero, and the test suite includes worker crashes after platform acceptance, platform timeouts, duplicated webhooks, revoked tokens at dispatch and daylight saving transitions.',
  'web.legal.security.program.title': 'The programme',
  'web.legal.security.program.threatModel':
    'A written threat model covering OAuth, tenancy, publishing, MCP, media, billing and analytics.',
  'web.legal.security.program.pentest':
    'An independent security review focused on token leakage and cross tenant access before paid launch.',
  'web.legal.security.program.access':
    'Least privilege production access, multi factor authentication, and a device and session inventory.',
  'web.legal.security.program.supplyChain':
    'Dependency and container scanning with patch service levels, and signed build provenance where practical.',
  'web.legal.security.program.logging':
    'Centralized logging that redacts by default, with anomaly alerting.',
  'web.legal.security.program.backups':
    'Encrypted backups with tested restoration and a documented rotation.',
  'web.legal.security.disclosure.title': 'Reporting a vulnerability',
  'web.legal.security.disclosure.body':
    'Email us with enough detail to reproduce the issue. We acknowledge within two business days, keep you updated, and credit you when you want the credit. Please do not access another customer data, degrade the service, or run automated scanning against production. Test against your own workspace.',
  'web.legal.security.disclosure.safeHarbor':
    'We will not pursue legal action for good faith research that follows this policy. The exact safe harbour wording is with counsel.',
  'web.legal.security.incidents.title': 'If something goes wrong',
  'web.legal.security.incidents.body':
    'We have an incident response plan with named decision makers, severity levels, evidence preservation and notification duties. Incidents that affected publishing are published on the status page with a timeline and what changed afterwards, including the ones we caused.',

  /* Accessibility -------------------------------------------------------- */
  'web.legal.accessibility.title': 'Accessibility Statement',
  'web.legal.accessibility.summary':
    'The standard Relay is built to, what we have verified, what we know is not right yet, and how to tell us.',
  'web.legal.accessibility.standard.title': 'The standard',
  'web.legal.accessibility.standard.body':
    'Relay targets WCAG 2.2 level AA across the product and this site. Accessibility is a merge requirement here, not a later ticket, and a screen that fails it does not ship.',
  'web.legal.accessibility.measures.title': 'What that means in practice',
  'web.legal.accessibility.measures.keyboard':
    'Everything is operable from the keyboard, with a visible focus ring and a logical focus order. There is no drag only interaction anywhere.',
  'web.legal.accessibility.measures.contrast':
    'Every colour pair in the design system is asserted at 4.5 to 1 for body text and 3 to 1 for large text and control edges, in both the light and the dark theme, by an automated test.',
  'web.legal.accessibility.measures.colour':
    'Status, capability and freshness always carry an icon and a word as well as a colour.',
  'web.legal.accessibility.measures.announcements':
    'Save state, validation changes, upload progress, schedule confirmation and publish results are announced to screen readers.',
  'web.legal.accessibility.measures.zoom':
    'Layouts work at 320 pixels wide and at 200 percent zoom without horizontal page scrolling. Wide tables scroll inside their own container.',
  'web.legal.accessibility.measures.motion':
    'A reduced motion preference removes every non essential transition.',
  'web.legal.accessibility.measures.targets':
    'Touch targets are at least 44 pixels on a coarse pointer.',
  'web.legal.accessibility.known.title': 'Known gaps',
  'web.legal.accessibility.known.body':
    'We will list specific known issues here with a fix date as they are found, rather than claiming full conformance. An independent audit is planned before general availability and its findings will be published here.',
  'web.legal.accessibility.feedback.title': 'Tell us about a barrier',
  'web.legal.accessibility.feedback.body':
    'Describe what you were trying to do, the page, and the assistive technology you use. We reply within five business days and will offer another way to complete the task while we fix it.',

  /* API and MCP terms ---------------------------------------------------- */
  'web.legal.apiTerms.title': 'API and MCP Terms',
  'web.legal.apiTerms.summary':
    'Additional terms for programmatic access, including agent credentials, rate limits and what a service account may never do.',
  'web.legal.apiTerms.credentials.title': 'Credentials',
  'web.legal.apiTerms.credentials.body':
    'An API key or agent credential identifies a scoped service account. It is not a copy of a person account and it never inherits their full permissions. Keys are shown once, are revocable at any time, and must not be embedded in a client application or a public repository.',
  'web.legal.apiTerms.scopes.title': 'Scopes',
  'web.legal.apiTerms.scopes.body':
    'Reading, drafting, requesting approval, scheduling, publishing immediately, cancelling, analytics and billing are separate scopes. Request the smallest set the integration needs. Immediate publishing and other high risk actions require explicit human confirmation by default and that default is set per workspace, not per credential.',
  'web.legal.apiTerms.limits.title': 'Rate limits and idempotency',
  'web.legal.apiTerms.limits.body':
    'Every write requires an idempotency key. Replaying a request with the same key returns the original result. Rate limits are published in the documentation and are returned in the response headers, and a limit response tells you when it resets.',
  'web.legal.apiTerms.agents.title': 'Agent behaviour',
  'web.legal.apiTerms.agents.body':
    'A single call may not silently publish to every connected account. Bulk actions, a new domain, a new account, a sensitive category, a paid endorsement, a privacy change or content altered after approval always escalate for a human decision. Every agent and every workspace has a kill switch.',
  'web.legal.apiTerms.prohibited.title': 'Not permitted through the API',
  'web.legal.apiTerms.prohibited.body':
    'Reselling access without a written agreement, using Relay as a relay for content you are not authorized to publish, circumventing approval policy, and any use that breaks the Acceptable Use Policy. Programmatic access is subject to the same anti spam controls as the web app.',
  'web.legal.apiTerms.changes.title': 'Change policy',
  'web.legal.apiTerms.changes.body':
    'Additive changes ship without notice. Breaking changes get a new version, an announced deprecation window and a migration note on the changelog. Error codes do not change meaning within a version.',

  /* Affiliate terms ------------------------------------------------------ */
  'web.legal.affiliate.title': 'Affiliate and Creator Terms',
  'web.legal.affiliate.summary':
    'What we pay, what we require, and what will get an account closed.',
  'web.legal.affiliate.commission.title': 'Commission',
  'web.legal.affiliate.commission.body':
    'Recurring commission on referred subscriptions for up to twelve months, subject to fraud review. Commission is held until the refund window closes and is reversed if the customer refunds. Payouts run through Polar.',
  'web.legal.affiliate.disclosure.title': 'Disclosure is not optional',
  'web.legal.affiliate.disclosure.body':
    'Every place you share a referral link must disclose the commercial relationship clearly and close to the link, in the language of the audience. This applies to videos, posts, newsletters, articles and community replies alike.',
  'web.legal.affiliate.honesty.title': 'Paid for work, not for praise',
  'web.legal.affiliate.honesty.body':
    'A sponsored tutorial contract never requires a positive conclusion. You may publish criticism and still be paid. We do not buy reviews, votes, ratings or installs, and we do not offer an incentive conditional on a positive review.',
  'web.legal.affiliate.prohibited.title': 'Grounds for closing an affiliate account',
  'web.legal.affiliate.prohibited.brandBidding':
    'Bidding on our brand terms in paid search, or running ads that imply you are us.',
  'web.legal.affiliate.prohibited.spam':
    'Unsolicited email, mass community posting, or link dropping in threads that did not ask.',
  'web.legal.affiliate.prohibited.cookieStuffing':
    'Cookie stuffing, forced clicks, self referral and coupon squatting.',
  'web.legal.affiliate.prohibited.claims':
    'Inventing customer results, fabricating a testimonial, or claiming Relay does something it does not, including anything about AI media generation.',
  'web.legal.affiliate.prohibited.trademark':
    'Registering a domain, handle or app listing that uses our name in a way that suggests you are the company.',

  /* ---------------------------------------------------------------------- */
  /* Platform names and per platform facts                                   */
  /* ---------------------------------------------------------------------- */

  'web.marketing.provider.x.label': 'X',
  'web.marketing.provider.linkedin.label': 'LinkedIn',
  'web.marketing.provider.instagram.label': 'instagram',
  'web.marketing.provider.facebook.label': 'Facebook',
  'web.marketing.provider.youtube.label': 'YouTube',
  'web.marketing.provider.tiktok.label': 'Tiktok',
  'web.marketing.provider.threads.label': 'Konular',
  'web.marketing.provider.bluesky.label': 'Mavi gökyüzü',

  'web.marketing.provider.x.accountTypes': 'Kontrol ettiğiniz kişisel veya ticari X hesabı.',
  'web.marketing.provider.x.restriction':
    "Otomatik gönderim, Relay'in kaydettiği hesap sahibinin açık onayını gerektirir. Hesaplar arasında yinelenen veya büyük ölçüde benzer gönderilere izin verilmez ve istenmeyen otomatik yanıtlar oluşturulmaz.",
  'web.marketing.provider.x.cost':
    'X, her API işlemi için ücret alır ve URL içeren bir gönderi için daha fazla ücret alır. Relay, siz onaylamadan önce maliyeti tahmin eder ve bunu herhangi bir kâr marjı olmadan iletir.',

  'web.marketing.provider.linkedin.accountTypes':
    'Bir üye profili veya doğru role sahip olduğunuz bir kuruluş Sayfası.',
  'web.marketing.provider.linkedin.restriction':
    "Bir kuruluş adına yayın yapmak için onaylanmış bir Topluluk Yönetimi ürününe ve doğrulanmış bir işletme kimliğine ihtiyaç vardır. Üye gönderi analizleri, LinkedIn'in yeni uygulamalara kapattığı okuma iznine bağlı olduğundan Relay bunu sunmayacak.",
  'web.marketing.provider.linkedin.cost':
    'İşlem başına ücret yoktur. Uygulama ve üye günlük limitleri geçerlidir.',

  'web.marketing.provider.instagram.accountTypes':
    'Profesyonel bir Instagram hesabı, işletme veya yaratıcı.',
  'web.marketing.provider.instagram.restriction':
    'Instagram içerik yayınlama yalnızca profesyonel hesaplar için geçerlidir. Bir tüketici hesabı, bu uygulama da dahil olmak üzere hiçbir uygulama tarafından yayınlanamaz. Yayınlama, resmi kapsayıcıyı ve yayınlama sırasını kullanır ve Aktarma, yüklemeyi başarılı olarak bildirmek yerine son durumu onaylar.',
  'web.marketing.provider.instagram.cost':
    'İşlem başına ücret yoktur. Meta uygulama incelemesi ve işletme doğrulaması gereklidir.',

  'web.marketing.provider.facebook.accountTypes': 'Yönettiğiniz bir Facebook Sayfası.',
  'web.marketing.provider.facebook.restriction':
    'Yayınlama hedefi bir Sayfadır. Kişisel profilin otomatikleştirilmesi API tarafından sunulmaz ve Relay bunu denemez.',
  'web.marketing.provider.facebook.cost':
    'İşlem başına ücret yoktur. Meta uygulama incelemesi ve işletme doğrulaması gereklidir.',

  'web.marketing.provider.youtube.accountTypes':
    'Google hesabınız üzerinden bağlanan bir YouTube kanalı.',
  'web.marketing.provider.youtube.restriction':
    'Google API uyumluluk denetimini geçemeyen bir proje yalnızca özel olarak yüklenebilir. Geçiş, bu denetim geçinceye kadar herkese açık yüklemeyi kullanılabilir olarak tanımlamaz ve bağlantı ekranı, yüklemelerinizin hangi durumda olacağını belirtir.',
  'web.marketing.provider.youtube.cost':
    'İşlem başına ücret yoktur. Günlük kota geçerlidir ve projeler arasında paylaşılamaz.',

  'web.marketing.provider.tiktok.accountTypes':
    'Direct Post yetkilendirmesine sahip bir TikTok hesabı.',
  'web.marketing.provider.tiktok.restriction':
    'Content Posting API denetimi başarılı olana kadar gönderiler özeldir ve hesap başına sınırlar uygulanır. Yayınlama sırasında Relay, mevcut yaratıcı bilgilerini getirir, önceden seçim yapmadan mevcut gizlilik seçeneklerini gösterir ve yorum, düet ve dikiş ayarlarını ve ticari içerik beyanını ister.',
  'web.marketing.provider.tiktok.cost':
    'İşlem başına ücret yoktur. Denetlenmemiş mod, günlük gönderi sınırlamalarını uygular.',

  'web.marketing.provider.threads.accountTypes':
    'Profesyonel bir Instagram hesabına bağlı bir Threads profili.',
  'web.marketing.provider.threads.restriction':
    'Yayınlama, Meta kapsayıcısını ve yayınlama sırasını takip eder. Burada herhangi bir şeyin desteklendiği söylenmeden önce yetenekler resmi koleksiyona göre doğrulanıyor.',
  'web.marketing.provider.threads.cost': 'İşlem başına ücret yoktur.',

  'web.marketing.provider.bluesky.accountTypes':
    'Herhangi bir barındırma sağlayıcısında bir Bluesky hesabı.',
  'web.marketing.provider.bluesky.restriction':
    'Uygulama inceleme adımı olmayan açık bir protokol. Hız sınırları ve kayıt boyutu sınırları hala geçerlidir ve sevkıyattan önce uygulanır.',
  'web.marketing.provider.bluesky.cost': 'İşlem başına ücret yoktur.',
  'web.marketing.provider.mastodon.label': 'Mastodon',
  'web.marketing.provider.mastodon.accountTypes': 'Herhangi bir sunucudaki Mastodon hesabı.',
  'web.marketing.provider.mastodon.restriction':
    'Uygulama incelemesi gerektirmeyen açık bir protokol. Karakter sınırını her sunucu belirler ve hız sınırlarına uyulur.',
  'web.marketing.provider.mastodon.cost': 'İşlem başına ücret yok.',
  'web.marketing.provider.telegram.label': 'Telegram',
  'web.marketing.provider.telegram.accountTypes':
    'Kontrol ettiğiniz ve bir kanala veya gruba gönderen Telegram botu.',
  'web.marketing.provider.telegram.restriction':
    'Bir bot yalnızca eklendiği yerlere gönderim yapabilir. Token bir uygulama kimliğidir ve hedef sohbet bağlantı başına seçilir.',
  'web.marketing.provider.telegram.cost': 'İşlem başına ücret yok.',
  'web.marketing.provider.reddit.label': 'Reddit',
  'web.marketing.provider.reddit.accountTypes': 'Gönderim yapmaya yetkili bir Reddit hesabı.',
  'web.marketing.provider.reddit.restriction':
    "Reddit'e yazmak onaylı bir uygulama gerektirir. Gönderiler izin verilen subreddit'lere metin veya bağlantı olarak gider; otomatik yorum veya oy yoktur.",
  'web.marketing.provider.reddit.cost': 'İşlem başına ücret yok.',
  'web.marketing.provider.wordpress.label': 'WordPress',
  'web.marketing.provider.wordpress.accountTypes': 'Uygulama parolası olan bir WordPress sitesi.',
  'web.marketing.provider.wordpress.restriction':
    "Gönderiler sitenin REST API'si üzerinden bağlı kullanıcı olarak yayınlanır. Görsel ve video yükleme henüz geliştirilmedi.",
  'web.marketing.provider.wordpress.cost': 'İşlem başına ücret yok.',
  'web.marketing.provider.medium.label': 'Medium',
  'web.marketing.provider.medium.accountTypes': 'OAuth ile bağlanan bir Medium yazar profili.',
  'web.marketing.provider.medium.restriction':
    "Gönderiler Markdown ile herkese açık hikayeler olarak yayınlanır. Entegrasyon API'sinde silme yoktur, bu yüzden sunulmaz.",
  'web.marketing.provider.medium.cost': 'İşlem başına ücret yok.',
  'web.marketing.provider.devto.label': 'Dev.to',
  'web.marketing.provider.devto.accountTypes': 'API anahtarıyla bağlanan bir Dev.to profili.',
  'web.marketing.provider.devto.restriction':
    'Makaleler herkese açık Markdown gönderileri olarak yayınlanır. Görsel yükleme ve analitik henüz geliştirilmedi.',
  'web.marketing.provider.devto.cost': 'İşlem başına ücret yok.',
  'web.marketing.provider.pinterest.label': 'Pinterest',
  'web.marketing.provider.pinterest.accountTypes':
    'OAuth ile bağlanan bir Pinterest işletme hesabı.',
  'web.marketing.provider.pinterest.restriction':
    'Bir pin görsel ve size ait bir pano gerektirir. Gönderim uygulama incelemesi gerektirir; panolar bağlantıda okunur.',
  'web.marketing.provider.pinterest.cost': 'İşlem başına ücret yok.',
  'web.marketing.provider.discord.label': 'Discord',
  'web.marketing.provider.discord.accountTypes':
    'Kontrol ettiğiniz ve metin kanallarına gönderen Discord botu.',
  'web.marketing.provider.discord.restriction':
    'Bot yalnızca görebildiği kanallara gönderim yapabilir. Metin mesajları desteklenir; dosya ekleri henüz değil.',
  'web.marketing.provider.discord.cost': 'İşlem başına ücret yok.',
  'web.marketing.provider.slack.label': 'Slack',
  'web.marketing.provider.slack.accountTypes':
    'Bir OAuth uygulamasıyla bağlanan Slack çalışma alanı.',
  'web.marketing.provider.slack.restriction':
    'Mesajlar uygulamanın bulunduğu açık ve özel kanallara gider. Dosya yükleme ve analitik henüz geliştirilmedi.',
  'web.marketing.provider.slack.cost': 'İşlem başına ücret yok.',

  /* ---------------------------------------------------------------------- */
  /* Capability matrix notes                                                 */
  /* ---------------------------------------------------------------------- */

  'web.capabilities.short.supported': 'Destekleniyor',
  'web.capabilities.short.unsupported': 'Platform bunu sunmuyor',
  'web.capabilities.short.not_implemented': 'Henüz inşa edilmedi',
  'web.capabilities.short.requires_review': 'Platformun incelenmesi gerekiyor',
  'web.capabilities.notesTitle': 'Notlar ve kaynaklar',
  'web.capabilities.noteRef': 'Not {number}',
  'web.capabilities.summary':
    '{supported, plural, one {# desteklenen yetenek} other {# desteklenen yetenek}}, {requiresReview, plural, one {# platform incelemesi bekleniyor} other {# platform incelemesi bekleniyor}}, {notImplemented, plural, one {# henüz oluşturulmadı} other {# henüz oluşturulmadı}}, {unsupported, plural, one {# platform sunmuyor} other {# platform sunmuyor}}.',
  'web.capabilities.buildState.title': 'Henüz hiçbir bağlayıcı müşteri trafiğini taşımıyor',
  'web.capabilities.buildState.body':
    'Röle yapım aşamasındadır. Bu tablo, bağlayıcı tanımlarını bugünkü haliyle yansıtmaktadır, bu nedenle çoğu hücre henüz oluşturulmamış olarak okunmaktadır. Bir hücre ancak, kaydedilen platform donanımlarına karşı sözleşme testleri de dahil olmak üzere, konnektörün "bitti" tanımını geçmesinden sonra desteklenir. Bir platformun bir şey sunmadığını söyleyen veya onu bir incelemenin arkasına kapatan hücreler, platformla ilgili gerçeklerdir ve zaten nihaidir.',
  'web.capabilities.note.instagramProfessional':
    'Yalnızca profesyonel hesaplar. Bir tüketici hesabı hiçbir uygulama tarafından yayınlanamaz.',
  'web.capabilities.note.facebookPagesOnly':
    'Yalnızca sayfalar. API kişisel bir profile yayınlamaz.',
  'web.capabilities.note.youtubeAudit':
    'Google API uyumluluk denetimi başarılı olana kadar yüklemeler özel olarak yapılır.',
  'web.capabilities.note.tiktokAudit':
    'Content Posting API denetimi başarılı olana kadar gönderiler özeldir ve sınırlıdır.',
  'web.capabilities.note.tiktokPrivacy':
    'Gizlilik seçeneği yayınlanma sırasında getirilir ve bir kişi tarafından seçilmelidir.',
  'web.capabilities.note.linkedinMemberAnalytics':
    "Üye gönderi analizlerinin, LinkedIn'in yeni uygulamalara kapattığı okuma iznine ihtiyacı var.",
  'web.capabilities.note.linkedinOrgAccess':
    'Onaylanmış bir Topluluk Yönetimi ürünü ve doğrulanmış bir işletme gerektirir.',
  'web.capabilities.note.linkedinDocuments':
    'LinkedIn, belge gönderi türüne sahip tek bağlantılı platformdur.',
  'web.capabilities.note.metaReview': 'Meta uygulama incelemesi ve işletme doğrulaması gerektirir.',
  'web.capabilities.note.xConsent':
    'Otomatik gönderim için hesap sahibinin kayıtlı iznini gerektirir.',
  'web.capabilities.note.xDisclosure':
    "Platform, Relay'in beyanınıza göre ayarladığı, yapay zeka ile oluşturulmuş bir alan sağlar.",
  'web.capabilities.note.noDestinations':
    'Bu platformun Sayfa, pano veya topluluk gibi bir hedef konsepti yoktur.',
  'web.capabilities.note.noThreads': 'Bu platformun yerel çoklu gönderi dizisi yoktur.',
  'web.capabilities.note.noDocuments': 'Bu platformda belge gönderi türü yoktur.',
  'web.capabilities.note.videoOnly': 'Bu platform yalnızca video yüklemelerini kabul etmektedir.',
  'web.capabilities.note.noAltText':
    "Bu platform, yayınlama API'si aracılığıyla alternatif metni kabul etmez.",
  'web.capabilities.note.noPrivacyChoice':
    "Bu platform, API'si aracılığıyla gönderi başına gizlilik seçeneği sunmamaktadır.",
  'web.capabilities.note.noThumbnail':
    "Bu platform, API'si aracılığıyla özel bir küçük resmi kabul etmez.",
  'web.capabilities.note.inBuild': 'Platform bunu sunuyor. Röle henüz göndermedi.',
  'web.capabilities.note.noCarousel': 'Platform kaydırmalı bir karusel sunmuyor.',
  'web.capabilities.note.noDisclosure':
    'Platformun yapay zeka veya ticari içerik için açıklama alanı yok.',
  'web.capabilities.note.noAnalytics':
    'Platform resmi API üzerinden etkileşim metrikleri sunmuyor.',
  'web.capabilities.note.redditReview':
    "Reddit'e yazmak onaylı bir veri API uygulaması gerektirir.",
  'web.capabilities.note.redditMedia':
    'Reddit için görsel ve video gönderimleri henüz geliştirilmedi.',
  'web.capabilities.note.mediumImages': "Entegrasyon API'si görsel eki kabul etmiyor.",
  'web.capabilities.note.mediumNoDelete': "Entegrasyon API'sinde silme uç noktası yok.",
  'web.capabilities.note.devtoImages':
    'API yalnızca makale gövdesi kabul eder; görsel yükleme henüz geliştirilmedi.',
  'web.capabilities.note.pinterestNeedsImage':
    'Bir pin görsel gerektirir; yalnızca metin pinleri yoktur.',
  'web.capabilities.note.pinterestReview': "Pinterest'e yazmak onaylı uygulama erişimi gerektirir.",

  /* ---------------------------------------------------------------------- */
  /* Status page surfaces                                                    */
  /* ---------------------------------------------------------------------- */

  'web.status.surface.web': 'Web uygulaması',
  'web.status.surface.api': "REST API'si",
  'web.status.surface.mcp': 'MCP sunucusu',
  'web.status.surface.cli': 'CLI',
  'web.status.surface.webhooks': 'Web kancası teslimi',
  'web.status.surface.publishing': 'Yayıncılık çalışanları',
  'web.status.surface.media': 'Medya işleme',
  'web.status.surface.analytics': 'Analitik koleksiyonu',
  'web.status.surface.links': 'Kısa bağlantı yönlendirmeleri',
  'web.status.surface.checkout': 'Ödeme ve faturalandırma',
  'web.status.preLaunch.title': 'Röle henüz genel olarak mevcut değil',
  'web.status.preLaunch.body':
    'Bu sayfa ürün yayınlanmadan önce yayında olduğundan raporlama alışkanlığı ilk kesintiden sonra eklenmek yerine ilk müşteriden itibaren var olur. Halen inşa halinde olan yüzeyler sağlıklı olarak gösterilmek yerine bu şekilde işaretlenir.',

  /* ---------------------------------------------------------------------- */
  /* Comparison targets                                                      */
  /* ---------------------------------------------------------------------- */

  'web.compare.product.postiz': 'Postiz',
  'web.compare.product.buffer': 'Tampon',
  'web.compare.product.hootsuite': 'Hootsuite',
  'web.compare.product.later': 'Daha sonra',
  'web.compare.product.metricool': 'Metricool',
  'web.compare.product.publer': 'Yayıncı',
  'web.compare.product.socialbee': 'SosyalArı',
  'web.compare.product.typefully': 'Tipik olarak',
  'web.compare.product.publishingApis': "Geliştirici yayınlama API'leri",
  'web.compare.state.factCheckPending': 'Doğruluk kontrolü sürüyor',

  /* ---------------------------------------------------------------------- */
  /* Tool radar categories                                                   */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.category.video': 'Video oluşturma ve düzenleme',
  'web.toolRadar.category.image': 'Görüntü oluşturma ve düzenleme',
  'web.toolRadar.category.audio': 'Ses, ses ve müzik',
  'web.toolRadar.category.ugc': 'Avatar ve yaratıcı tarzı video',
  'web.toolRadar.category.clipping': 'Uzun videodan kısa kliplere',
  'web.toolRadar.category.design': 'Tasarım ve düzen',
  'web.toolRadar.category.research': 'Araştırma ve kaynak toplama',
  'web.toolRadar.category.workflow': 'İş akışı otomasyonu',

  /* ---------------------------------------------------------------------- */
  /* Opportunity categories                                                  */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.category.launch': 'Ürün lansmanı ve başlangıç dizinleri',
  'web.opportunities.category.review': 'Yazılım ve inceleme dizinleri',
  'web.opportunities.category.marketplace': 'Entegrasyon ve otomasyon pazarları',
  'web.opportunities.category.community': 'Gönderimlere izin veren topluluk vitrin konuları',
  'web.opportunities.category.partner': 'İş ortağı ekosistemleri ve entegrasyon dizinleri',
  'web.opportunities.category.editorial': "Konuk eğitimleri, podcast'ler ve haber bültenleri",
  'web.opportunities.category.openSource': 'Açık kaynak listeleri ve dokümantasyon kaynakları',

  /* ---------------------------------------------------------------------- */
  /* Subprocessors and retention                                             */
  /* ---------------------------------------------------------------------- */

  'web.legal.subprocessors.neon.label': 'Neon',
  'web.legal.subprocessors.neon.purpose': 'Managed PostgreSQL, authentication and object storage.',
  'web.legal.subprocessors.neon.data':
    'Account records, content, media, schedules, receipts and audit events.',
  'web.legal.subprocessors.temporal.label': 'Temporal Cloud',
  'web.legal.subprocessors.temporal.purpose':
    'Durable execution of publishing, retry and scheduling workflows.',
  'web.legal.subprocessors.temporal.data':
    'Workflow inputs limited to identifiers and minimized payloads.',
  'web.legal.subprocessors.polar.label': 'Polar',
  'web.legal.subprocessors.polar.purpose':
    'Merchant of record: checkout, subscriptions, taxes, invoices and refunds.',
  'web.legal.subprocessors.polar.data':
    'Name, email, billing address, payment method held by Polar, and subscription state.',
  'web.legal.subprocessors.deepseek.label': 'DeepSeek',
  'web.legal.subprocessors.deepseek.purpose':
    'Text assistance, translation and transcreation, and planning suggestions.',
  'web.legal.subprocessors.deepseek.data':
    'Only the text you submit to an AI feature and the project context you attached to it.',
  'web.legal.subprocessors.hosting.label': 'Application hosting and content delivery',
  'web.legal.subprocessors.hosting.purpose':
    'Serving the web app, the API and the short link service.',
  'web.legal.subprocessors.hosting.data': 'Request metadata and redacted logs.',
  'web.legal.subprocessors.email.label': 'Transactional email delivery',
  'web.legal.subprocessors.email.purpose':
    'Sign in links, approval requests, publish result notifications and trial reminders.',
  'web.legal.subprocessors.email.data': 'Name, email address and the message content.',
  'web.legal.subprocessors.monitoring.label': 'Error and performance monitoring',
  'web.legal.subprocessors.monitoring.purpose':
    'Diagnosing failures in publishing and in the interface.',
  'web.legal.subprocessors.monitoring.data':
    'Redacted stack traces, request identifiers and workspace identifiers. Post content is stripped.',
  'web.legal.subprocessors.region.pending': 'Region being confirmed',
  'web.legal.subprocessors.vendorPending': 'Vendor being selected',

  'web.legal.retention.column.data': 'Data',
  'web.legal.retention.column.period': 'How long it is kept',
  'web.legal.retention.credentials.label': 'Active platform credentials',
  'web.legal.retention.credentials.period':
    'Encrypted while the connection is active. Revoked at the platform and deleted here as soon as you disconnect.',
  'web.legal.retention.oauthState.label': 'OAuth transaction state',
  'web.legal.retention.oauthState.period': 'Minutes, then deleted.',
  'web.legal.retention.drafts.label': 'Drafts and media',
  'web.legal.retention.drafts.period':
    'While the account is active, or your own retention setting, with a trash grace period.',
  'web.legal.retention.receipts.label': 'Publication receipts and audit events',
  'web.legal.retention.receipts.period':
    'Kept for the plan and legal retention period, minimized, and exportable at any time.',
  'web.legal.retention.rawProvider.label': 'Raw platform responses',
  'web.legal.retention.rawProvider.period':
    'The shortest period needed for debugging and compliance, then minimized or deleted.',
  'web.legal.retention.metrics.label': 'Analytics observations',
  'web.legal.retention.metrics.period':
    'The plan retention period, within what the platform terms allow.',
  'web.legal.retention.securityLogs.label': 'Security logs',
  'web.legal.retention.securityLogs.period':
    'A fixed window between 30 and 180 days depending on the risk of the event.',
  'web.legal.retention.billing.label': 'Billing records',
  'web.legal.retention.billing.period':
    'The statutory accounting retention period, held by Polar and by us.',
  'web.legal.retention.deletedAccount.label': 'A deleted account',
  'web.legal.retention.deletedAccount.period':
    'Credentials revoked and scheduled work cancelled immediately. Full deletion completes within the published window, apart from lawful billing records.',
  'web.legal.retention.backups.label': 'Backups',
  'web.legal.retention.backups.period':
    'Encrypted and access controlled, expiring on a documented rotation. A deletion propagates through the restore process.',

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.footer.product': 'Ürün',
  'web.footer.company': 'Şirket',
  'web.footer.resources': 'Kaynaklar',
  'web.footer.legal': 'Yasal',
  'web.footer.developers': 'Geliştiriciler',
  'web.footer.statement':
    "Relay yalnızca resmi platform API'leri aracılığıyla yayın yapar. Konektörün kullanılabilirliği, platformların kontrol ettiği onaylara bağlıdır ve bu sitedeki her yetenek iddiasının tarihi ve kaynağı vardır.",
  'web.footer.noAffiliation':
    'Platform adları ve markaları sahiplerine aittir. Buradaki kullanımları bir bağlayıcıyı tanımlar ve onay veya ortaklık anlamına gelmez.',
  'web.footer.copyright': 'Röle {year}',
} as const;
