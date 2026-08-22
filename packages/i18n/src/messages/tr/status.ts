/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'Henüz planlanmış bir şey yok',
  'empty.calendar.body':
    'İlk gönderinizi yazın ve bir zaman seçin. Daha sonra değiştirebilirsiniz.',
  'empty.calendar.action': 'Gönderi oluştur',
  'empty.drafts.title': 'Taslak yok',
  'empty.drafts.body':
    'Kaydettiğiniz taslaklar, hedefleri ve sorunlarıyla birlikte burada görünür.',
  'empty.connections.title': 'Hiçbir hesap bağlı değil',
  'empty.connections.body':
    'Yayınlamak için bir hesap bağlayın. İlk önce size tam izinleri gösteriyoruz.',
  'empty.connections.action': 'Bir hesap bağlayın',
  'empty.analytics.title': 'Henüz ölçüm yok',
  'empty.analytics.body':
    'Metrikler, ilk yayınınız platformun bunun hakkında rapor oluşturmasına yetecek kadar uzun süre yayında kaldıktan sonra görünür.',
  'empty.analytics.noPermission':
    'Bu hesaba analiz erişimi izni verilmedi. Eklemek için yeniden bağlanın.',
  'empty.approvals.title': 'Seni bekleyen hiçbir şey yok',
  'empty.approvals.body': 'Projelerinize ilişkin onay talepleri burada görünür.',
  'empty.library.title': 'Kitaplığınız boş',
  'empty.library.body':
    "Görüntüleri ve videoları yükleyin veya bunları bir URL'den veya API'den içe aktarın.",
  'empty.library.action': 'Medya yükle',
  'empty.automation.title': 'Henüz kural yok',
  'empty.automation.body':
    'Kural bir şeye tepki verir ve bir eylem önerir. Her kural, siz onu açmadan önce sınırlarını gösterir.',
  'empty.webhooks.title': 'Uç nokta yok',
  'empty.webhooks.body':
    'Yayımlama ve bağlantılarla ilgili imzalı etkinlikleri almak için bir uç nokta ekleyin.',
  'empty.searchResults.title': '{query} için sonuç yok',
  'empty.searchResults.body': 'Yazımı kontrol edin veya bir filtreyi temizleyin.',
  'empty.filtered.title': 'Bu filtrelerle eşleşen hiçbir şey yok',
  'empty.filtered.action': 'Filtreleri temizle',
  'empty.auditLog.title': 'Henüz etkinlik yok',
  'empty.receipts.title': 'Henüz makbuz yok',
  'empty.receipts.body': 'Her yayın, inceleyip paylaşabileceğiniz bir makbuz üretir.',

  'loading.default': 'Yükleniyor',
  'loading.calendar': 'Takviminiz yükleniyor',
  'loading.analytics': 'Metrikler yükleniyor',
  'loading.preview': 'Önizlemeyi oluşturma',
  'loading.validating': 'Mevcut platform sınırlarına göre kontrol etme',
  'loading.publishing': "{provider}'da yayınlanıyor",
  'loading.uploading': '{name} yükleniyor',
  'loading.uploadProgress': '{percent} yüklendi',
  'loading.connecting': "{provider}'e bağlanılıyor",
  'loading.savingDraft': 'Taslağınız kaydediliyor',
  'loading.generatingPlan': 'Planınızı oluşturma',
  'loading.longRunning': 'Bu normalden daha uzun sürüyor. Hala çalışıyor.',

  'offline.banner': 'Çevrimdışısınız. Değişiklikler bu cihazda tutuluyor.',
  'offline.draftSafe': 'Taslağınız güvende. Tekrar çevrimiçi olduğunuzda senkronize edilir.',
  'offline.publishDisabled':
    'Yayıncılığın bir bağlantıya ihtiyacı var. Bu sessizce sıraya alınmayacak.',
  'offline.scheduleQueued':
    'Bu planlama isteği bu cihazda kuyruğa alındı ​​ve tekrar çevrimiçi olduğunuzda gönderilecektir.',
  'offline.reconnected': 'Tekrar çevrimiçi olun. Değişiklikleriniz senkronize ediliyor.',
  'offline.syncConflict':
    'Bazı değişiklikler otomatik olarak birleştirilemedi. Kaydetmeden önce bunları inceleyin.',

  'permission.denied.title': 'Buna erişiminiz yok',
  'permission.denied.role': 'Bunun {role} rolüne ihtiyacı var. Sen {currentRole}’sin.',
  'permission.denied.scope': 'Bu kimlik bilgisinin kapsamı {scope} olmalıdır.',
  'permission.denied.contactOwner': "{owner}'dan bunu kabul etmesini isteyin.",
  'permission.denied.projectScope': 'Erişiminiz {projects} ile sınırlıdır.',
  'permission.readOnly': 'Bu çalışma alanı şu anda salt okunur.',
  'permission.mfaRequired': 'Devam etmek için iki faktörlü kimlik doğrulamayla onaylayın.',

  'rateLimit.title': 'Bir anlığına yavaşla',
  'rateLimit.body': "{window}'de {count} istekte bulundunuz. Sınır {limit}'dir.",
  'rateLimit.resetsAt': "Bu {time}'da sıfırlanır.",
  'rateLimit.cheaperAlternative':
    'Artık yayınlamak yerine planlama yapmak bu sınırı ortadan kaldırıyor.',
  'rateLimit.providerCost':
    '{provider} işlem başına ücret alınır. Bu eylemin {amount} olduğu tahmin ediliyor.',

  'incident.providerDegraded':
    '{provider} sorunlar yaşıyor. Planlanmış gönderiler yeniden denenmeye devam ediyor.',
  'incident.providerDown':
    '{provider} kullanılamıyor. Hiçbir şey kaybolmaz ve hiçbir şey kopyalanmaz.',
  'incident.isolated': 'Diğer platformlar etkilenmez.',
  'incident.statusPage': 'Konektör ve yüzeye göre canlı durum',
  'incident.startedAt': '{relativeTime} başladı',

  'translation.incomplete':
    'Bu ekrandaki bazı metinler henüz {language} diline çevrilmemiştir ve İngilizce olarak gösterilmektedir.',
  'translation.beta': 'Bu dil beta aşamasındadır. Yanlış okunan her şeyi bildirin.',

  'confirm.discardChanges.title': 'Değişiklikleriniz silinsin mi?',
  'confirm.discardChanges.body': 'Bu geri alınamaz.',
  'confirm.deleteItem.title': '{name} silinsin mi?',
  'confirm.deleteItem.body': 'Bu geri alınamaz.',
  'confirm.cancelScheduled.title': 'Bu planlanmış gönderi iptal edilsin mi?',
  'confirm.cancelScheduled.body':
    'Yayınlanmayacak. Taslak burada kalır, böylece yeniden planlayabilirsiniz.',
  'confirm.publishNow.title': 'Şimdi yayınlansın mı?',
  'confirm.publishNow.body':
    "{count, plural, one {Bu hemen # hesaba yayınlanır} other {Bu hemen # hesaba yayınlanır}}. Relay'den geri çağrılamaz.",
  'confirm.typeToConfirm': 'Onaylamak için {word} yazın.',
} as const;
