/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Yayın alındısı',
  'receipt.subtitle': 'Tam olarak neyin, nerede, ne zaman ve kimin onayıyla yayımlandığı.',
  'receipt.target': '{account} {provider}’de',
  'receipt.externalId': 'Harici gönderi kimliği',
  'receipt.permalink': 'Kalıcı bağlantı',
  'receipt.permalinkUnavailable': '{provider} bu gönderi türü için kalıcı bağlantı döndürmez.',
  'receipt.contentVersion': 'İçerik sürümü',
  'receipt.contentHash': 'İçerik sağlama toplamı',
  'receipt.mediaVersion': 'Medya sürümü',
  'receipt.idempotencyKey': 'Idempotency referansı',
  'receipt.correlationId': 'Korelasyon referansı',

  'receipt.surface.label': 'Oluşturuldu:',
  'receipt.surface.web': 'Web uygulaması',
  'receipt.surface.api': "REST API'si",
  'receipt.surface.mcp': 'MCP sunucusu',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'RSS otomatik gönderimi',
  'receipt.surface.automation': 'Otomasyon kuralı',
  'receipt.surface.webhook': 'Gelen web kancası',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Hizmet hesabı {name}',
  'receipt.actor.oauthApp': '{app} {name} adına hareket ediyor',
  'receipt.actor.system': 'Röle',

  'receipt.timeline.title': 'Zaman çizelgesi',
  'receipt.timeline.created': 'Taslak {actor} tarafından oluşturuldu',
  'receipt.timeline.approvalRequested': '{approver} tarafından onay istendi',
  'receipt.timeline.approved': '{actor} tarafından {policy} politikası kapsamında onaylandı',
  'receipt.timeline.scheduled': '{timeZone} içinde {local} için planlandı',
  'receipt.timeline.revalidated': 'Kimlik bilgileri ve platform sınırları yeniden kontrol edildi',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# platform için hazırlanmış dosya} other {# platform için hazırlanmış dosya}}',
  'receipt.timeline.dispatched': '{provider} adresine gönderildi',
  'receipt.timeline.providerAccepted': '{provider} görevi kabul etti',
  'receipt.timeline.providerProcessing': '{provider} hâlâ medyayı işliyor',
  'receipt.timeline.published': '{externalId} olarak yayınlandı',
  'receipt.timeline.commentPublished': 'Takip öğesi {position} yayınlandı',
  'receipt.timeline.retryScheduled': '{time} için programlanan {attempt} yeniden deneyin',
  'receipt.timeline.failed': '{attempt} denemesi başarısız oldu',
  'receipt.timeline.canceled': '{actor} tarafından iptal edildi',
  'receipt.timeline.analyticsSynced': 'Analytics senkronize edildi',
  'receipt.timeline.deletedExternally': "Gönderi artık {provider}'da değil",

  'receipt.times.scheduled': 'Planlanan zaman',
  'receipt.times.dispatched': 'Gönderim zamanı',
  'receipt.times.published': 'Yayınlanma zamanı',
  'receipt.times.latency': 'Planlanan saatten {duration} sonra gönderildi.',

  'receipt.attempts.title': 'denemeler',
  'receipt.attempts.count': '{count, plural, one {# deneme} other {# deneme}}',
  'receipt.attempts.classification': 'sınıflandırma',
  'receipt.attempts.providerResponse': 'Sağlayıcı yanıtı',
  'receipt.attempts.responseRedacted':
    'Sağlayıcının yanıtı, belirteçler ve kişisel veriler kaldırılarak saklanır.',
  'receipt.attempts.remediation': 'Bundan sonra ne yapmalı',

  'receipt.cost.estimated': 'Tahmini {amount}',
  'receipt.cost.actual': 'Mutabık kılınan {amount}',
  'receipt.cost.pending': 'Gerçek kullanım henüz mutabakata varılmadı.',

  'receipt.partial.title': 'Kısmen yayınlandı',
  'receipt.partial.body':
    '{published, plural, one {# hedef yayınlandı} other {# hedef yayınlandı}}. {failed, plural, one {# hedef başarısız oldu} other {# hedef başarısız oldu}}. Yayınlanan gönderiler hâlâ platformda yer alıyor.',
  'receipt.partial.doNotRollback':
    'Daha önce yayınlanmış bir gönderiyi silmiyoruz. İstediğiniz buysa platformdan silin.',

  'receipt.export.title': 'Bu makbuzu paylaş',
  'receipt.export.pdf': 'PDF olarak indir',
  'receipt.export.json': 'JSON olarak indir',
  'receipt.export.permissionNote':
    'Yalnızca sahipler, yöneticiler ve onaylayanlar makbuz paylaşabilir.',

  'receipt.analytics.lastSync': 'Analytics en son {relativeTime} ile senkronize edildi.',
  'receipt.analytics.nextSync': 'Sonraki senkronizasyon {time} civarında.',
} as const;
