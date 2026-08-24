/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'Bağlantılar',
  'connection.subtitle': 'Bu çalışma alanının yayın yapabileceği hesaplar, Sayfalar ve kanallar.',
  'connection.add': 'Bir hesap bağlayın',
  'connection.count': '{used, plural, one {# aktif kanal} other {# aktif kanal}} / {limit}',
  'connection.limitReached':
    'Bu çalışma alanı tüm {limit} kanallarını kullanıyor. Diğerini bağlamadan önce birinin bağlantısını kesin.',

  'connection.account.label': 'Hesap',
  'connection.account.type.profile': 'Profil',
  'connection.account.type.page': 'Sayfa',
  'connection.account.type.channel': 'Kanal',
  'connection.account.type.group': 'Grup',
  'connection.account.type.organization': 'Organizasyon',
  'connection.account.type.business': 'İşletme hesabı',
  'connection.account.type.creator': 'Yaratıcı hesap',
  'connection.connectedBy': '{date} tarihinde {name} ile bağlanıldı',
  'connection.lastPublished': 'Son yayınlanma tarihi {relativeTime}',
  'connection.lastPublishedNever': 'Bu hesaptan henüz yayınlanmış bir şey yok',
  'connection.lastAnalyticsSync': 'Analytics senkronize edildi {relativeTime}',

  'connection.status.healthy': 'Çalışma',
  'connection.status.expiringSoon': 'Süresi {relativeTime} doluyor',
  'connection.status.expired': 'Erişimin süresi doldu',
  'connection.status.revoked': 'Erişim iptal edildi',
  'connection.status.paused': 'Duraklatıldı',
  'connection.status.permissionMissing': 'Eksik izin',
  'connection.status.reviewPending': 'Platform incelemesi bekleniyor',
  'connection.status.unknown': 'Sağlık durumu mevcut değil',

  'connection.token.expiresAt': 'Erişimin süresi {date} doluyor',
  'connection.token.expiryUnknown':
    '{provider} bu erişimin süresinin ne zaman dolacağını bize bildirmez.',

  'connection.permissions.title': 'İzinler',
  'connection.permissions.granted': 'İzin verildi',
  'connection.permissions.missing': 'İzin verilmedi',
  'connection.permissions.explainBeforeOAuth':
    'Röle bu izinler için {provider} isteyecektir. İstediğiniz zaman bağlantıyı kesebilirsiniz.',
  'connection.permissions.whyNeeded': 'Buna neden ihtiyaç var?',

  'connection.reconnect.title': 'Yeniden bağlanın {account}',
  'connection.reconnect.body':
    'Bu hesap için planlanmış gönderiler, yeniden bağlanana kadar beklemede. Hiçbir şey kaybolmadı.',
  'connection.disconnect.title': '{account} bağlantısı kesilsin mi?',
  'connection.disconnect.body':
    'Bu hesap için planlanmış gönderiler yayınlanmayacak. Halihazırda toplanmış olan makbuzlar ve analizler bu çalışma alanında kalır.',
  'connection.pause.body':
    'Duraklatılmış bir hesap, geçmişini ve programını korur ancak siz devam ettirene kadar yayınlanmaz.',

  'connection.incident.invalidToken':
    '{provider} {account} için kayıtlı erişimi reddetti. Yayınlamayı geri yüklemek için yeniden bağlanın.',
  'connection.incident.permissionLost':
    '{account} artık {permission} değerini vermiyor. Yeniden bağlanın ve bu izni kabul edin.',
  'connection.incident.roleLost':
    '{provider} kullanıcınızın artık {account} üzerinde bir rolü yoktur. Söz konusu Sayfanın yöneticisinden sayfayı geri yüklemesini isteyin.',
  'connection.incident.accountTypeInvalid':
    "Instagram'ın profesyonel bir hesaba ihtiyacı var. {account}'yı bir işletme veya yaratıcı hesabına geçirin ve ardından yeniden bağlanın.",
  'connection.incident.reviewRestricted':
    "{provider} incelenmeyi bekleyen bu uygulamayı kısıtladı. {account}'den gelen gönderiler, inceleme tamamlanana kadar özel olarak yayınlanır.",

  'connection.group.title': 'Müşteri grupları',
  'connection.group.description':
    'Her ekranı filtrelemek için hesapları müşteriye veya projeye göre gruplayın.',
  'connection.group.assign': 'Gruba taşı',
  'connection.group.none': 'Gruplandırılmamış',
  'connection.group.moveNote':
    'Bir hesabın taşınması, gönderilerini, makbuzlarını ve analizlerini korur.',

  'connection.oauth.starting': 'Açılış {provider}',
  'connection.oauth.returned': 'Bağlantıyı bitirme',
  'connection.oauth.chooseAccounts': 'Hangi hesapların bağlanacağını seçin',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'Bu {provider} girişteki hiçbir hesap bağlanamıyor. {reason}',
  'connection.oauth.canceled': 'Bağlantı {provider} tarihinde iptal edildi. Hiçbir şey değişmedi.',
  'connection.oauth.alreadyConnected': '{account} zaten bu çalışma alanına bağlı.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} başka bir çalışma alanına bağlı. Önce oradan ayırın.',

  'capability.title': 'Bu hesabın desteklediği şeyler',
  'capability.matrix.title': 'Platform yetenekleri',
  'capability.matrix.subtitle':
    'Bakımını yaptığımız ve elle incelediğimiz bağlayıcı tanımlarından oluşturulmuştur.',
  'capability.level.supported': 'Destekleniyor',
  'capability.level.unsupported': 'Platform tarafından sunulmuyor',
  'capability.level.not_implemented': 'Henüz inşa edilmedi',
  'capability.level.requires_review': 'Platformun incelenmesi gerekiyor',
  'capability.level.beta': 'beta',
  'capability.level.unknown': 'Kullanılamıyor',
  'capability.explain.supported': 'Post Array bugün bu hesap için bunu yapabilir.',
  'capability.explain.unsupported':
    "{provider} bunu resmi API'si aracılığıyla sunmadığından hiçbir araç bunu güvenli bir şekilde yapamaz.",
  'capability.explain.not_implemented':
    '{provider} bunu sunuyor ancak Post Array henüz bunu oluşturmadı. Bağlayıcı yol haritasındadır.',
  'capability.explain.requires_review':
    '{provider} bunu yalnızca uygulamayı veya hesabı inceledikten sonra verir. Bu inceleme geçilene kadar kullanılamaz durumda kalır.',
  'capability.explain.beta':
    'Bu, doğrulamayı bitirmediğimiz sınırlamalarla işe yarıyor. Güvenmeden önce sonucu kontrol edin.',
  'capability.explain.unknown':
    'Bu hesabın mevcut izinlerini okuyamadık. Bunları yenilemek için yeniden bağlanın.',
  'capability.lastChecked': 'Kontrol edildi {relativeTime}',
  'capability.feature.text': 'Metin gönderileri',
  'capability.feature.image': 'Görseller',
  'capability.feature.carousel': 'Atlıkarıncalar',
  'capability.feature.video': 'video',
  'capability.feature.document': 'Belgeler',
  'capability.feature.firstComment': 'Planlanan ilk yorum',
  'capability.feature.thread': 'Konular',
  'capability.feature.mentions': 'Yerel sözler',
  'capability.feature.destinations': 'Hedef seçimi',
  'capability.feature.privacy': 'Privacy controls',
  'capability.feature.thumbnail': 'Özel küçük resim',
  'capability.feature.altText': 'Alternatif metin',
  'capability.feature.analytics': 'Analitik',
  'capability.feature.delete': 'Yayınlanan bir yayını silme',
  'capability.feature.commentCount': 'Yorum sayıları',
  'capability.feature.commentReplies': 'Yorumları okuma ve yanıtlama',
  'capability.feature.disclosure': 'Otomasyon açıklaması',
} as const;
