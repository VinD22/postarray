/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'instagram',
  'web.provider.facebook': 'Facebook',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'Tiktok',
  'web.provider.threads': 'Konular',
  'web.provider.bluesky': 'Mavi gökyüzü',
  'web.provider.mastodon': 'Mastodon',
  'web.provider.telegram': 'Telegram',
  'web.provider.reddit': 'Reddit',
  'web.provider.wordpress': 'WordPress',
  'web.provider.medium': 'Medium',
  'web.provider.devto': 'Dev.to',
  'web.provider.pinterest': 'Pinterest',
  'web.provider.discord': 'Discord',
  'web.provider.slack': 'Slack',
  'web.connection.requirement.mastodon':
    'Mastodon, kendi sunucunuzda oluşturduğunuz erişim belirteciyle bağlanır, şifrenizle değil.',
  'web.connection.requirement.telegram':
    'Relay bir bot olarak yayınlar. Gönderim yapmak istediğiniz kanala veya gruba botu ekleyin.',
  'web.connection.requirement.reddit':
    "Reddit'e yazmak onaylı bir uygulama gerektirir ve her gönderinin bir başlığa ve subreddit'e ihtiyacı vardır.",
  'web.connection.requirement.wordpress':
    "Relay, WordPress'te oluşturduğunuz bir uygulama parolasıyla sitenin REST API'si üzerinden yayınlar.",
  'web.connection.requirement.medium':
    'Medium OAuth ile bağlanır ve Relay Markdown ile herkese açık hikayeler yayınlar.',
  'web.connection.requirement.devto':
    'Dev.to, Dev.to ayarlarınızda oluşturulan bir API anahtarıyla bağlanır.',
  'web.connection.requirement.pinterest':
    "Pinterest'e yazmak onaylı uygulama erişimi gerektirir ve bir pin görsel ve size ait bir pano gerektirir.",
  'web.connection.requirement.discord':
    'Relay bir bot olarak yayınlar. Gönderim yapmak istediğiniz sunuculara ve kanallara botu ekleyin.',
  'web.connection.requirement.slack':
    'Relay bir uygulama olarak yayınlar. Gönderim yapmak istediğiniz kanallara uygulamayı ekleyin.',
  'web.provider.fake': 'Test konektörü',

  'web.accountType.personal_profile': 'Kişisel profil',
  'web.accountType.creator_profile': 'Yaratıcı hesap',
  'web.accountType.business_profile': 'İşletme hesabı',
  'web.accountType.page': 'Sayfa',
  'web.accountType.organization': 'Organizasyon',
  'web.accountType.channel': 'Kanal',
  'web.accountType.group': 'Grup',
  'web.accountType.board': 'Yönetim Kurulu',
  'web.accountType.community': 'Topluluk',
  'web.accountType.publication': 'Yayın',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Planlanan, onay bekleyen, yayınlanan veya engellenen her şey tek bir yerde.',
  'web.calendar.view.agenda': 'Gündem',
  'web.calendar.view.table': 'Tablo',
  'web.calendar.view.switchLabel': 'Programın nasıl düzenleneceğini seçin',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} ile {end} arası',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': '{timeZone} içinde {range} gösteriliyor',
  'web.calendar.timeZone.workspace': 'Çalışma alanı saat dilimi: {timeZone}',
  'web.calendar.timeZone.change': 'Çalışma alanı ayarlarında değişiklik',
  'web.calendar.jumpToDate': 'Bir tarihe atla',
  'web.calendar.nowLabel': 'Şimdi',
  'web.calendar.allDayHeading': 'Henüz kesin bir zaman yok',

  'web.calendar.filter.group': 'Müşteri grubu',
  'web.calendar.filter.anyProject': 'Herhangi bir proje',
  'web.calendar.filter.anyAccount': 'Herhangi bir hesap',
  'web.calendar.filter.anyPlatform': 'Herhangi bir platform',
  'web.calendar.filter.anyStatus': 'Herhangi bir durum',
  'web.calendar.filter.anyLocale': 'Herhangi bir içerik dili',
  'web.calendar.filter.anyCampaign': 'Herhangi bir kampanya',
  'web.calendar.filter.anyGroup': 'Her grup',
  'web.calendar.filter.regionLabel': 'Programı filtrele',
  'web.calendar.bucket.scheduled': 'planlanmış',
  'web.calendar.bucket.draft': 'Taslaklar ve onaylar',
  'web.calendar.bucket.published': 'Yayınlandı',
  'web.calendar.bucket.failed': 'Dikkat edilmesi gerekiyor',
  'web.calendar.filter.summary':
    '{count, plural, =0 {Filtre yok} one {# filtre} other {# filtre}}, {results, plural, =0 {gönderim yok} one {# gönderi} other {# gönderi}}',

  'web.calendar.grid.label': '{range} için tabloyu programlayın',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': "{date}'de {time}'da hiçbir şey yok",
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {# gönderi daha göster} other {# gönderi daha göster}}',
  'web.calendar.month.label': '{month} için ay tablosu',
  'web.calendar.agenda.label': '{range} Gündemi',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Planlanmış bir şey yok',

  'web.calendar.table.caption': "{range}'daki her gönderi yayınlanma zamanına göre sıralanmıştır.",
  'web.calendar.table.column.time': 'Zaman',
  'web.calendar.table.column.account': 'Hesap',
  'web.calendar.table.column.content': 'İçerik',
  'web.calendar.table.column.language': 'Dil',
  'web.calendar.table.column.media': 'Medya',
  'web.calendar.table.column.status': 'Durum',
  'web.calendar.table.column.approver': 'Onaylayan',
  'web.calendar.table.column.campaign': 'Kampanya',
  'web.calendar.table.column.actions': 'Eylemler',
  'web.calendar.table.rowMenu': '{title} için eylemler',
  'web.calendar.table.noApprover': 'Onaya gerek yok',
  'web.calendar.table.noCampaign': 'Kampanya yok',

  'web.calendar.entry.untitled': 'Başlıksız taslak',
  'web.calendar.entry.language': 'Dil {locale}',
  'web.calendar.entry.openDetail': '{title}’ı açın',
  'web.calendar.entry.selected': '{title} seçildi. {hint}',
  'web.calendar.detail.title': 'Planlanmış gönderi',
  'web.calendar.detail.close': 'Bu yayını kapat',

  'web.calendar.keyboard.title': 'Bir gönderiyi klavyeyle taşıma',
  'web.calendar.keyboard.body':
    "Bir gönderiye odaklanın ve onu açmak için Enter tuşuna basın. Bir gönderiyi almak için M tuşuna basın, ardından gönderiyi bir yuva ilerletmek için ok tuşlarını kullanın ve onaylamak için Enter'a basın. Geri koymak için Escape tuşuna basın.",
  'web.calendar.keyboard.pickUp': 'Bu yayını taşı',
  'web.calendar.keyboard.grabbed':
    "{title} {from}'den alınmıştır. Ok tuşları onu hareket ettirir. Enter onaylıyor. Kaçış iptal olur.",
  'web.calendar.keyboard.moved': 'Önerilen süre {to}. Enter onaylıyor.',
  'web.calendar.keyboard.released': "{title} tekrar {from}'e getirin.",
  'web.calendar.keyboard.stepMinutes': 'Her adım {minutes} dakikadır.',

  'web.calendar.reschedule.title': 'Bu yayın taşınsın mı?',
  'web.calendar.reschedule.subject': '{account} {provider}’de',
  'web.calendar.reschedule.from': '{local} ({utc} UTC) tarihinden itibaren',
  'web.calendar.reschedule.to': '{local} ({utc} UTC)’ye',
  'web.calendar.reschedule.confirm': 'Gönderiyi taşı',
  'web.calendar.reschedule.dstTitle': 'Saatler bu iki saat arasında değişiyor',
  'web.calendar.reschedule.dstBody':
    "{timeZone}'deki sapma eski saatte {fromOffset} ve yeni saatte {toOffset}'dir. Seçtiğiniz yerel saat korunur, dolayısıyla UTC anında değişir.",
  'web.calendar.reschedule.conflictTitle': 'Diğer yazılar bu sefere yakın',
  'web.calendar.reschedule.conflictBody':
    '{account} zaten yeni zamana göre {window} içinde {count, plural, one {# gönderi} other {# gönderi}} içeriyor.',
  'web.calendar.reschedule.campaignTitle': 'Kampanya çakışması',
  'web.calendar.reschedule.campaignBody':
    'Kampanya {campaign} {start} ile {end} arasında geçerlidir. Yeni zaman o pencerenin dışında.',
  'web.calendar.reschedule.leadTimeTitle': 'Bu çok yakında',
  'web.calendar.reschedule.leadTimeBody':
    "Yeni saat şu andan itibaren {duration}. {provider}'in bu gönderi türüne ortam hazırlamak için {required}'ye ihtiyacı vardır.",
  'web.calendar.reschedule.pastTitle': 'O zaman geçti',
  'web.calendar.reschedule.pastBody':
    'Gelecekte bir zaman seçin veya bunun yerine şimdi yayınlayın.',

  'web.calendar.published.title': 'Bu yazı zaten yayınlandı',
  'web.calendar.published.body':
    "{provider} saat {permalinkLabel}'de bir gönderi var. Relay'deki girişin taşınması, platformdaki gönderiyi taşımaz. Ne olmasını istediğinizi seçin.",
  'web.calendar.published.optionLocal': 'Yalnızca yerel kaydı güncelle',
  'web.calendar.published.optionLocalHint':
    'Makbuz gerçek yayın süresini korur. Yalnızca planlama girişi taşınır, böylece takviminiz planınızla eşleşir.',
  'web.calendar.published.optionNew': 'Yeni zamanda yeni bir gönderi planlayın',
  'web.calendar.published.optionNewHint':
    'Bu, ikinci, ayrı bir harici gönderi oluşturur. Halihazırda {provider} açık olan çevrimiçi kalır.',
  'web.calendar.published.optionLabel': 'Ne olmalı',

  'web.calendar.attention.title':
    '{count, plural, one {# gönderinin bir karara veya düzeltmeye ihtiyacı var} other {# gönderinin bir karara veya düzeltmeye ihtiyacı var}}',
  'web.calendar.attention.body': 'Sorun çözülene kadar burada ve eylem merkezinde kalıyorlar.',
  'web.calendar.attention.open': 'Eylem merkezini aç',
  'web.calendar.attention.showOnly': 'Yalnızca bunları göster',

  'web.calendar.loading': 'Program yükleniyor',
  'web.calendar.error.title': 'Program yüklenemedi',
  'web.calendar.error.body':
    'Planlanan hiçbir şey değişmedi. Gönderileriniz hâlâ planlanan zamanlarda yayınlanıyor.',
  'web.calendar.error.retry': 'Tekrar dene',
  'web.calendar.empty.example':
    '09:30 Avrupa/Berlin, X @acme, "Planlanan ilk yorumlar yayında", Planlanmış, 1 resim',
  'web.calendar.emptyFiltered.body':
    '{range} içindeki hiçbir gönderi bu filtrelerle eşleşmiyor. Aralığı genişletin veya bir filtreyi temizleyin.',
  'web.calendar.offline.title': 'Çevrimdışısınız',
  'web.calendar.offline.body':
    'Aşağıdaki program bu cihaza yüklenen son kopyadır. Bağlantı yeniden sağlanana kadar yeniden planlama ve yayınlama kullanılamaz.',
  'web.calendar.rateLimited.cause':
    'Bu çalışma alanı takvimi geçerli pencerenin izin verdiğinden daha fazla okur.',
  'web.calendar.rateLimited.resetLabel': 'Tekrar deneyebilirsiniz',
  'web.calendar.rateLimited.resetUnknown': '{provider} bunun ne zaman sıfırlanacağını söylemedi.',
  'web.calendar.permission.requirementsLabel': 'Gerekli kapsam',
  'web.calendar.permission.title': 'Bu takvimi göremezsiniz',
  'web.calendar.permission.body':
    'Proje başına takvim erişimi verilir. Hesabınız bu görünümdeki projelerde yer almıyor.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Takvim',
  'web.receipt.breadcrumb.post': 'Gönderi',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Yayın alındısı yükleniyor',
  'web.receipt.notFound.title': 'Bu referansı içeren makbuz yok',
  'web.receipt.notFound.body':
    'Bir gönderi gönderildikten sonra bir makbuz mevcuttur. Referansı kontrol edin veya gönderiyi takvimden açın.',
  'web.receipt.error.title': 'Makbuz yüklenemedi',
  'web.receipt.error.body':
    'Makbuz değişmezdir ve bundan etkilenmez. Hiçbir şey yeniden yayınlanmadı.',

  'web.receipt.section.summary': 'Ne oldu?',
  'web.receipt.section.timeline': 'Etkinlik zaman çizelgesi',
  'web.receipt.section.items': 'Kök gönderi ve takip öğeleri',
  'web.receipt.section.attempts': 'denemeler',
  'web.receipt.section.provenance': 'Kaynak',
  'web.receipt.section.cost': 'Sağlayıcı kullanımı',
  'web.receipt.section.analytics': 'Analitik senkronizasyonu',
  'web.receipt.section.targets': 'Bu kampanyadaki hedefler',

  'web.receipt.item.root': 'Kök gönderi',
  'web.receipt.item.comment': 'Yorum {position}',
  'web.receipt.item.thread': 'Konu parçası {position}',
  'web.receipt.item.delay': 'Kök gönderiden sonra {delay} komutunu çalıştırır',
  'web.receipt.item.noDelay': 'Kök gönderiyle çalışır',
  'web.receipt.item.pending': 'Henüz başlamadı',
  'web.receipt.item.rootUnaffected':
    'Kök gönderi yayında. Başarısız olan bir takip öğesi bunu asla değiştirmez.',

  'web.receipt.attempt.heading': '{number} deneyin',
  'web.receipt.attempt.startedAt': '{time} başladı',
  'web.receipt.attempt.startedLabel': 'Başlatıldı',
  'web.receipt.attempt.responseSummary': 'Sterilize edilmiş sağlayıcı yanıtı',
  'web.receipt.attempt.duration': '{duration} aldı',
  'web.receipt.attempt.httpStatus': 'HTTP durumu',
  'web.receipt.attempt.providerRequestId': 'Sağlayıcı istek referansı',
  'web.receipt.attempt.retryable': 'Otomatik olarak yeniden denendi',
  'web.receipt.attempt.notRetryable': 'Otomatik olarak yeniden denenmedi',
  'web.receipt.attempt.nextRetry': 'Bir sonraki deneme: {time}',
  'web.receipt.attempt.nextRetryLabel': 'Sonraki deneme',
  'web.receipt.attempt.showResponse': 'Temizlenmiş sağlayıcı yanıtını göster',
  'web.receipt.attempt.hideResponse': 'Temizlenmiş sağlayıcı yanıtını gizle',
  'web.receipt.attempt.none': 'Tek deneme, başarısızlık yok.',

  'web.receipt.provenance.capabilityVersion': 'Yetenek anlık görüntüsü',
  'web.receipt.provenance.capabilityHint':
    'Anlık görüntü onay sırasında kullanıldı ve gönderilmeden önce yeniden kontrol edildi.',
  'web.receipt.provenance.accountType': 'Hesap türü',
  'web.receipt.provenance.externalAccount': 'Harici hesap referansı',
  'web.receipt.provenance.workflow': 'İş akışı referansı',
  'web.receipt.provenance.createdAt': 'Makbuz yazılı {time}',

  'web.receipt.approval.notRequired': 'Bu hedef için onaya gerek yoktu.',
  'web.receipt.approval.policy': 'Politika {policy}',
  'web.receipt.approval.unknownPolicy': 'Politika referansı kaydedilmedi',

  'web.receipt.cost.currency': '{currency} içinde şarj edildi',
  'web.receipt.cost.estimatedLabel': 'Yayınlanmadan önce tahmin edilir',
  'web.receipt.cost.actualLabel': 'Mutabık kılınan fiili',
  'web.receipt.provenance.writtenLabel': 'Makbuz yazılı',
  'web.receipt.cost.reconciledAt': 'Mutabık kılındı {time}',
  'web.receipt.cost.notMetered': '{provider} bu gönderi türü için işlem başına ücret almaz.',

  'web.receipt.analytics.never': 'Analytics bu gönderi için henüz senkronize edilmedi.',
  'web.receipt.analytics.explain':
    "Sağlayıcılar kendi programlarına göre toplanırlar. Aşağıdaki zaman, sayıların doğru olduğu zaman değil, Relay'in bunları en son okuduğu zamandır.",

  'web.receipt.export.download': 'Makbuzu indirin',
  'web.receipt.export.copyReference': 'Makbuz referansını kopyalayın',
  'web.receipt.export.denied':
    'Makbuzun paylaşılması için sahip, yönetici veya onaylayan rolü gerekir. Siz {role}sınız.',

  'web.receipt.partial.retryFailedOnly': 'Yalnızca başarısız olan hedefleri yeniden deneyin',
  'web.receipt.partial.retryHint':
    'Yeniden deneme, zaten harici bir gönderi oluşturmuş olan bir hedefe asla dokunmaz.',

  'web.receipt.remediation.user_action_required':
    'Bunun tekrar çalışabilmesi için Rölede veya {provider} üzerinde bir değişiklik yapılması gerekir.',
  'web.receipt.remediation.content_invalid':
    'İçeriği {provider} doğrulamayı geçecek şekilde düzenleyin ve ardından yeniden planlayın.',
  'web.receipt.remediation.transient_provider':
    '{provider} geçici bir hata döndürdü. Aktarım kendi zamanlamasına göre yeniden denendi.',
  'web.receipt.remediation.permanent_provider':
    '{provider} bunu kalıcı olarak reddetti. Aynı içeriği yeniden denemek cevabı değiştirmez.',
  'web.receipt.remediation.internal': 'Bu bizim hatamızdı. Aşağıdaki referansla kaydedilmiştir.',
  'web.receipt.remediation.unknown':
    '{provider} kuralımızın olmadığı bir şeyi döndürdü. Temizlenmiş yanıt aşağıdadır.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Hesaplar',
  'web.connection.tab.capabilities': 'Yetenek matrisi',
  'web.connection.tab.groups': 'Müşteri grupları',
  'web.connection.loading': 'Bağlı hesaplar yükleniyor',
  'web.connection.error.title': 'Bağlı hesaplar yüklenemedi',
  'web.connection.error.body':
    'Yayınlama etkilenmez. Zamanlanmış gönderiler hâlâ depolanan erişime karşı çalışır.',
  'web.connection.list.label': 'Bağlı hesaplar',
  'web.connection.empty.example':
    "X, @acme, kişisel profil, 12 Haziran'da Ana Ruiz tarafından bağlandı, yayınlama ve ölçümler, en son 6 Ağustos'ta yayınlandı",
  'web.connection.filter.provider': 'platformu',
  'web.connection.filter.health': 'Sağlık',
  'web.connection.filter.group': 'Müşteri grubu',
  'web.connection.filter.anyHealth': 'Herhangi bir sağlık',
  'web.connection.healthFilter.healthy': 'Çalışma',
  'web.connection.healthFilter.expiring_soon': 'Süresi yakında doluyor',
  'web.connection.healthFilter.expired': 'Erişimin süresi doldu',
  'web.connection.healthFilter.revoked': 'Erişim iptal edildi',
  'web.connection.healthFilter.permission_missing': 'Eksik izin',
  'web.connection.healthFilter.review_pending': 'Platform incelemesi bekleniyor',
  'web.connection.healthFilter.paused': 'Duraklatıldı',
  'web.connection.healthFilter.unknown': 'Sağlık durumu mevcut değil',

  'web.connection.row.summaryLabel': 'Bu hesabın yapabilecekleri',
  'web.connection.row.expand': '{account} için tam özeti göster',
  'web.connection.row.collapse': '{account} için tam özeti gizle',
  'web.connection.row.metered': 'İşlem başına ölçülür. Gönderi oluşturma başına tahmini {amount}.',
  'web.connection.row.limitationHeading': 'Bu hesaptaki sınırlamalar',
  'web.connection.row.noLimitations': 'Bu hesapta üretim veya beta sınırlaması yoktur.',
  'web.connection.row.beta': 'Beta bağlayıcı',
  'web.connection.row.betaBody':
    'Bu bağlayıcı, doğrulamayı henüz bitirmediğimiz sınırlarla çalışıyor. Güvenmeden önce yayınlanan gönderiyi kontrol edin.',

  'web.connection.detail.expiryLabel': 'Erişimin süresi doluyor',
  'web.connection.health.expiresIn':
    'Erişimin süresi {relativeTime} tarihinde {date} tarihinde dolacaktır',
  'web.connection.health.noExpiry':
    "Bu erişimin süresi {provider}'ın bize bildirdiği bir programa göre sona ermez.",
  'web.connection.health.checkedAt': 'Sağlık kontrolü yapıldı {relativeTime}',

  'web.connection.action.inspect': 'İzinleri inceleyin',
  'web.connection.action.viewCapabilities': 'Neleri desteklediğini görün',
  'web.connection.action.moveGroup': 'Başka bir gruba taşı',
  'web.connection.action.menu': '{account} için daha fazla işlem',

  'web.connection.pause.title': '{account} duraklatılsın mı?',
  'web.connection.resume.title': '{account} devam ettirilsin mi?',
  'web.connection.resume.body':
    'Bu hesaba ilişkin planlanmış gönderiler, planlanan zamanlarda tekrar yayınlanmaya başlar. Süresi geçmiş olan gönderiler geriye dönük olarak tetiklenmez.',
  'web.connection.disconnect.confirmWord': 'BAĞLANTIYI KES',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# planlanmış gönderi} other {# planlanmış gönderi}} bu hesap için yayınlanmayacak.',
  'web.connection.disconnect.consequence.published':
    "Zaten yayınlanmış gönderiler {provider}'da kalır. Röle bunları silmez.",
  'web.connection.disconnect.consequence.analytics':
    'Halihazırda toplanan ölçümler bu çalışma alanında kalır ve güncellenmeyi durdurur.',

  'web.connection.connect.title': 'Bir hesap bağlayın',
  'web.connection.connect.chooseProvider': 'Hangi platform',
  'web.connection.connect.permissionHeading': "Röle {provider}'dan ne isteyecek?",
  'web.connection.connect.requirementHeading': 'Devam etmeden önce',
  'web.connection.connect.continue': '{provider} ile devam edin',
  'web.connection.connect.handoffNote':
    "Bir sonraki ekran Röle değil {provider}'dır. Röle şifrenizi asla görmez.",
  'web.connection.connect.noWriteWithoutApproval':
    'Bir hesabın bağlanması hiçbir şey yayınlamaz. Her gönderi hâlâ bu çalışma alanı onay politikasını takip ediyor.',

  'web.connection.projectScope.title': '{project} için kanallar gösteriliyor',
  'web.connection.projectScope.body':
    'Yeni kanallar bu projeye bağlanır. Başka bir seti yönetmek için üst çubuktan proje değiştirin.',
  'web.connection.projectMissing.title': 'Bir kanal bağlamadan önce bir proje oluşturun',
  'web.connection.projectMissing.body':
    'Projeler, farklı ürün veya müşterilere ait kanalları, medyayı, taslakları ve planları ayrı tutar.',

  'web.connection.requirement.instagram':
    'Instagram yayıncılığının profesyonel bir hesaba ihtiyacı vardır; bu, bir Facebook Sayfasına bağlı bir işletme veya yaratıcı hesabı anlamına gelir.',
  'web.connection.requirement.facebook':
    'Relay, Facebook Sayfalarında yayın yapar. Kişisel profil yayınlama hedefi olamaz.',
  'web.connection.requirement.linkedin':
    'Bir kuruluş için içerik yayınlamak için söz konusu LinkedIn Sayfasında içerik yöneticisi rolüne ihtiyacınız vardır.',
  'web.connection.requirement.youtube':
    "Google, uygulama denetimini tamamlayana kadar bu projedeki yüklemeler gizli olarak yayınlanır. Daha sonra YouTube'daki görünürlüğü değiştirebilirsiniz.",
  'web.connection.requirement.tiktok':
    'TikTok, her gönderinin hedef kitlesini kendinizin seçmenizi gerektirir. Röle sizin için bir tanesini önceden seçemez.',
  'web.connection.requirement.x':
    'İşlem başına X ücret. URL içeren bir gönderinin maliyeti düz metin gönderisinden daha fazladır ve tahmin, siz planlamadan önce gösterilir.',
  'web.connection.requirement.threads':
    'Konu yayınlama, Instagram profesyonel hesabınıza bağlı hesabı kullanır.',
  'web.connection.requirement.bluesky':
    'Bluesky, hesap şifrenizle değil, Bluesky ayarlarınızda oluşturulan bir uygulama şifresiyle bağlanır.',
  'web.connection.requirement.generic':
    'Platformun kendisinden bu hesaba paylaşım yapmak için izne ihtiyacınız var. Röle bunu kabul edemez.',

  'web.connection.purpose.publish': "Planladığınız gönderileri Relay'de yayınlamak.",
  'web.connection.purpose.readPosts':
    'Yayınlanan bir yayının tekrar okunması, böylece makbuzun yayında olduğunu kanıtlayabilir.',
  'web.connection.purpose.identity':
    "Relay'de tam hesap adı gösteriliyor, böylece hiçbir zaman yanlış hesapta yayınlamazsınız.",
  'web.connection.purpose.analytics':
    'Bu platformun kendi gönderileriniz için raporladığı ölçümleri okumak.',
  'web.connection.purpose.refresh':
    'Planlanmış bir gönderinin bir gecede başarısız olmaması için erişimi canlı tutmak.',
  'web.connection.purpose.chooseDestination':
    'Yayınlama hedefi olarak seçebileceğiniz Sayfaları ve kanalları listeleme.',

  'web.connection.permissions.title': '{account} ile ilgili izinler',
  'web.connection.permissions.scopeColumn': 'İzin',
  'web.connection.permissions.stateColumn': 'Eyalet',
  'web.connection.permissions.purposeColumn': 'Relay bunu ne için kullanıyor?',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {# izin eksik} other {# izin eksik}}. Aşağıdaki özellikleri geri yüklemek için yeniden bağlanın ve kabul edin.',
  'web.connection.permissions.snapshot': '{provider} {relativeTime} arası okuyun',

  'web.connection.capability.title': 'Yetenek matrisi',
  'web.connection.capability.subtitle':
    'Bu yapıdaki sürümlendirilmiş bağlayıcı tanımlarından oluşturuldu ve ardından elle incelendi. Bu, bestecinin ve genel yetenek sayfasının kullandığı verilerle aynıdır.',
  'web.connection.capability.tableLabel': 'Platforma göre yetenekler',
  'web.connection.capability.featureColumn': 'Yetenek',
  'web.connection.capability.legendTitle': 'Bunu nasıl okuyabilirim',
  'web.connection.capability.legend.supported':
    'Röle, doğru türde bağlı bir hesap için bunu bugün yapabilir.',
  'web.connection.capability.legend.not_implemented':
    'Platform bunu sunuyor ve Relay bunu henüz oluşturmadı. Bağlayıcı yol haritasındadır.',
  'web.connection.capability.legend.unsupported':
    "Platform bunu resmi API'si aracılığıyla sunmuyor, dolayısıyla hiçbir araç bunu güvenli bir şekilde yapamaz.",
  'web.connection.capability.legend.requires_review':
    'Oluşturuldu ve platform bunu yalnızca uygulamayı veya hesabı inceledikten sonra veriyor.',
  'web.connection.capability.versionLabel': 'Bağlayıcı tanımları',
  'web.connection.capability.version': 'Bağlayıcı tanımları sürümü {version}',
  'web.connection.capability.observedAt': 'Anlık görüntü okuması {relativeTime}',
  'web.connection.capability.forAccount': '{account} için gösterilmiştir',
  'web.connection.capability.noSnapshot':
    'Bu hesap için henüz yetenek anlık görüntüsü yok. Birini okumak için yeniden bağlanın.',
  'web.connection.capability.cellLabel': '{feature} {provider}’de: {state}',

  'web.connection.group.title': 'Müşteri grupları',
  'web.connection.group.listLabel': 'Müşteri grupları',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Hesap yok} one {# hesap} other {# hesap}}',
  'web.connection.group.create': 'Grup oluştur',
  'web.connection.group.nameLabel': 'Grup adı',
  'web.connection.group.namePlaceholder': 'Acme AB',
  'web.connection.group.moveTitle': '{account} taşı',
  'web.connection.group.moveLabel': 'Şuraya taşı:',
  'web.connection.group.moveConfirm': 'Hesabı taşı',
  'web.connection.group.movedAnnouncement': "{account} {group}'e taşındı",
  'web.connection.group.filterCalendarHint':
    'Bir grup takvimi ve analizleri filtreler. Bir hesabın taşınması, halihazırda sahip olduğu tüm gönderileri, makbuzları ve ölçümleri korur.',
  'web.connection.group.empty.title': 'Henüz müşteri grubu yok',
  'web.connection.group.empty.body':
    'Grup bir müşteri veya projedir. Takvimi ve analizleri müşteriye göre filtrelemek için hesapları gruplayın.',

  'web.connection.incident.title': 'Bu hesaba dikkat edilmesi gerekiyor',
  'web.connection.incident.remediationHeading': 'Ne yapmalı',
  'web.connection.incident.scheduledOnHold':
    'Bu hesap için {count, plural, one {# planlanmış gönderi beklemeye alındı} other {# planlanmış gönderi beklemeye alındı}}.',
  'web.connection.incident.nothingLost': 'Hiçbir şey kaybolmaz ve hiçbir şey kopyalanmaz.',
} as const;
