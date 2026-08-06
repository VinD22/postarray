/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Aracılar ve API',
  'developer.subtitle':
    'API, MCP sunucusu ve CLI, uygulamayla aynı izinleri, onay politikasını ve makbuzları kullanır.',

  'developer.serviceAccount.title': 'Hizmet hesapları',
  'developer.serviceAccount.create': 'Hizmet hesabı oluşturun',
  'developer.serviceAccount.name': 'İsim',
  'developer.serviceAccount.scopeBrands': 'Kullanabileceği markalar ve hesaplar',
  'developer.serviceAccount.scopePlatforms': 'Platformlar',
  'developer.serviceAccount.scopeLocales': 'İçerik dilleri',
  'developer.serviceAccount.scopeDomains': 'İzin verilen bağlantı alanları',
  'developer.serviceAccount.scopeHours': 'İzin verilen saatler',
  'developer.serviceAccount.scopeCadence': 'Günlük maksimum gönderi',
  'developer.serviceAccount.scopeLookAhead': 'Ne kadar ileriyi planlayabilir?',
  'developer.serviceAccount.approvalLevel': 'Onay düzeyi',
  'developer.serviceAccount.killSwitch': 'Bu temsilciyi durdur',

  'developer.approvalLevel.0': 'Yalnızca oku ve doğrula',
  'developer.approvalLevel.1': 'Taslak oluşturma ve düzenleme',
  'developer.approvalLevel.2': 'Yukarıda belirlenen sınırlar dahilinde planlama yapın',
  'developer.approvalLevel.3': 'Yayınlamadan önce bir kişiye sorun',
  'developer.approvalLevel.description.0':
    'Temsilci hesaplara, yeteneklere, takvimlere ve analizlere bakabilir. Hiçbir şeyi değiştirmez.',
  'developer.approvalLevel.description.1':
    'Temsilci taslak yazabilir. Bir kişi hâlâ planlama yapıyor ve yayınlıyor.',
  'developer.approvalLevel.description.2':
    'Temsilci, belirlediğiniz hesaplar, saatler, tempo, diller, alanlar dahilinde planlama yapabilir ve ileriye bakabilir. Bu sınırların dışındaki her şeyin bir insana ihtiyacı vardır.',
  'developer.approvalLevel.description.3':
    'Anında yayınlama, yeni bir hesap veya etki alanı, toplu işlem, hassas içerik veya değiştirilmiş gizlilik ayarı her zaman bir kişinin açık onayını gerektirir.',
  'developer.bulkThreshold':
    "Toplu, bir istekte {publications, plural, one {# harici yayın} other {# harici yayın}}'dan fazla veya aynı içeriğin {accounts, plural, one {# hesap} other {# hesap}}'tan fazla olması anlamına gelir.",

  'developer.credential.title': 'Kimlik bilgileri',
  'developer.credential.create': 'API anahtarı oluşturun',
  'developer.credential.shownOnce':
    'Bu kimlik bilgisi bir kez gösterilir. Şimdi kopyalayın. Bunun yalnızca bir karmasını saklıyoruz.',
  'developer.credential.prefix': 'Önek',
  'developer.credential.created': '{date} {name} tarafından oluşturuldu',
  'developer.credential.lastUsed': 'Son kullanılan {relativeTime}',
  'developer.credential.neverUsed': 'Hiç kullanılmadı',
  'developer.credential.expires': 'Süresi {date} doluyor',
  'developer.credential.revokeConfirm':
    'Bu kimlik bilgisi iptal edilsin mi? Bunu kullanan herhangi bir şey anında çalışmayı durdurur.',

  'developer.scope.title': 'Kapsamlar',
  'developer.scope.accountsRead': 'Bağlı hesapları ve yeteneklerini okuyun',
  'developer.scope.draftsWrite': 'Taslak oluşturma ve düzenleme',
  'developer.scope.postsSchedule': 'Onaylanan içeriği planlayın',
  'developer.scope.postsPublish': 'Hemen yayınlayın',
  'developer.scope.analyticsRead': 'Analizleri okuyun',
  'developer.scope.receiptsRead': 'Yayın alındılarını okuyun',
  'developer.scope.webhooksWrite': 'Web kancalarını yönet',
  'developer.scope.connectionsAdmin': 'Hesapları bağlama ve bağlantısını kesme',
  'developer.scope.billingRead': 'Faturalandırma durumunu oku',
  'developer.scope.consequential': 'Sonuçsal',
  'developer.scope.readOnly': 'Salt okunur',

  'developer.setup.title': 'Bir istemciyi bağlayın',
  'developer.setup.claudeCode': 'Claude Kodu',
  'developer.setup.codex': 'Kodeks',
  'developer.setup.hermes': 'Hermes',
  'developer.setup.buzz': 'Buzz iş akışı',
  'developer.setup.cli': 'CLI',
  'developer.setup.genericMcp': 'Herhangi bir MCP istemcisi',
  'developer.setup.copyConfig': 'Yapılandırmayı kopyala',
  'developer.setup.mcpEndpoint': 'MCP uç noktası',
  'developer.setup.apiBaseUrl': "API temel URL'si",

  'developer.playground.title': 'Deneme sürüşü',
  'developer.playground.description':
    'Araçları tohumlanmış verilere karşı çalıştırın. Hiçbir şey gerçek bir platforma ulaşmıyor.',
  'developer.playground.run': 'Çalıştır',
  'developer.playground.sandboxBadge': 'Korumalı alan',

  'developer.activity.title': 'Son etkinlik',
  'developer.activity.toolCall': '{tool} {actor} {relativeTime} tarafından aranır',
  'developer.activity.denied': 'Reddedildi: {reason}',
  'developer.activity.empty': 'Henüz arama yok.',
  'developer.activity.redacted': 'İstek ve yanıt gövdeleri sırlar kaldırılmış şekilde depolanır.',

  'developer.apps.title': 'Geliştirici uygulamaları',
  'developer.apps.subtitle':
    'Başka bir ürünün, kullanıcının verdiği izinlerle Aktarma yoluyla hareket etmesine izin verin.',
  'developer.apps.create': 'Bir uygulamayı kaydedin',
  'developer.apps.name': 'Uygulama adı',
  'developer.apps.type.label': 'Müşteri türü',
  'developer.apps.type.public': 'Kamuya açık, sır tutulamaz',
  'developer.apps.type.confidential': 'Gizlidir, bir sunucuda çalışır',
  'developer.apps.homepage': "Ana sayfa URL'si",
  'developer.apps.privacyUrl': "Gizlilik politikası URL'si",
  'developer.apps.termsUrl': "Şartlar URL'si",
  'developer.apps.logo': 'logosu',
  'developer.apps.redirectUris': "URI'leri yönlendir",
  'developer.apps.redirectUrisHelp':
    'Yalnızca tam eşleşmeler. Joker karakterler ve kısmi yollar reddedilir.',
  'developer.apps.clientId': 'Müşteri Kimliği',
  'developer.apps.clientSecret': 'İstemci sırrı',
  'developer.apps.secretShownOnce':
    'Sır bir kez gösterilir. Kaybederseniz döndürün. Bir daha göstermeyeceğiz.',
  'developer.apps.status.draft': 'Taslak',
  'developer.apps.status.active': 'Aktif',
  'developer.apps.status.disabled': 'Devre dışı',
  'developer.apps.consentPreview': 'İzin ekranı önizlemesi',
  'developer.apps.grants.title': 'Aktif hibeler',
  'developer.apps.grants.count': '{count, plural, one {# hibe} other {# hibe}}',
  'developer.apps.deleteConfirm':
    'Bu uygulama silinsin mi? Her hibe iptal edilir ve belirteçleri çalışmayı durdurur.',

  'developer.consent.title': '{app} wants access to your workspace',
  'developer.consent.workspace': 'Workspace',
  'developer.consent.brands': 'Brands and accounts',
  'developer.consent.willBeAbleTo': '{app} will be able to',
  'developer.consent.willNotBeAbleTo': '{app} will not be able to',
  'developer.consent.approvalStillApplies':
    'Your approval policy still applies. This app cannot publish around it.',
  'developer.consent.revokeAnyTime': 'You can revoke this from Settings at any time.',
  'developer.consent.allow': 'Allow access',
  'developer.consent.deny': 'Do not allow',
  'developer.consent.developerIdentity': 'Published by {developer}',

  'developer.grants.title': 'Erişimi olan uygulamalar',
  'developer.grants.grantedOn': '{date} verildi',
  'developer.grants.lastUsed': 'Son kullanılan {relativeTime}',
  'developer.grants.revoke': 'Erişimi iptal et',
  'developer.grants.revoked':
    'Erişim iptal edildi. Kendi bağlantılarınız ve planlanmış gönderileriniz etkilenmez.',

  'developer.docs.openapi': 'OpenAPI belgesi',
  'developer.docs.clients': 'Oluşturulan istemciler',
  'developer.docs.idempotency':
    'Her oluşturma, planlama ve yayınlama isteğiyle birlikte bir idempotency anahtarı gönderin. Bir isteğin aynı anahtarla tekrarlanması, iki kez yayınlamak yerine orijinal sonucu döndürür.',
  'developer.docs.pagination':
    'Sonuçlar imleçle sayfalandırılmıştır. Zamanlar açıktır ve bir bölge içerir.',
  'developer.docs.rateLimits':
    'Hız sınırları çalışma alanı, kimlik bilgisi, rota ve bağlayıcı başına geçerlidir.',
} as const;
