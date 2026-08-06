/** Workspace settings: members, roles, brands, localization, security, data. */
export const settingsMessages = {
  'settings.title': 'Ayarlar',
  'settings.saved': 'Kaydedildi',
  'settings.unsavedChanges': 'Kaydedilmemiş değişiklikleriniz var.',

  'settings.workspace.title': 'Çalışma alanı',
  'settings.workspace.name': 'Çalışma alanı adı',
  'settings.workspace.defaultTimeZone': 'Varsayılan saat dilimi',
  'settings.workspace.defaultLocale': 'Varsayılan arayüz dili',
  'settings.workspace.defaultContentLocale': 'Varsayılan içerik dili',
  'settings.workspace.transferOwnership': 'Sahipliği aktar',
  'settings.workspace.delete': 'Çalışma alanını sil',
  'settings.workspace.deleteWarning':
    'Bir çalışma alanının silinmesi planlanmış gönderileri iptal eder, bağlantıları iptal eder ve depolanan medyayı kaldırır. Makbuzlar, Şartlarda belirtilen saklama süresi boyunca saklanır.',

  'settings.members.title': 'Üyeler ve roller',
  'settings.members.invite': 'İnsanları davet et',
  'settings.members.inviteEmail': 'E-posta adresi',
  'settings.members.inviteSent': "Davetiye {email}'a gönderildi.",
  'settings.members.pending': 'Davet edildi, henüz kabul edilmedi',
  'settings.members.count': '{count, plural, one {# üye} other {# üye}}',
  'settings.members.removeConfirm':
    '{name} bu çalışma alanından kaldırılsın mı? Geçmiş eylemleri denetim günlüğünde kalır.',
  'settings.role.owner.label': 'Sahip',
  'settings.role.admin.label': 'Yönetici',
  'settings.role.manager.label': 'Yönetici',
  'settings.role.editor.label': 'Editör',
  'settings.role.approver.label': 'Onaylayan',
  'settings.role.analyst.label': 'Analist',
  'settings.role.viewer.label': 'Görüntüleyici',
  'settings.role.owner.description': 'Faturalandırma, güvenlik ve silme dahil her şey.',
  'settings.role.admin.description':
    'Faturalandırma ve çalışma alanının silinmesi dışında her şey.',
  'settings.role.manager.description': 'Markaları, bağlantıları, programları ve kuralları yönetin.',
  'settings.role.editor.description': 'İçerik oluşturun ve düzenleyin, onay isteyin.',
  'settings.role.approver.description':
    'İçeriği onaylayın veya reddedin ve neyin onaylanacağını planlayın.',
  'settings.role.analyst.description': 'Analizleri ve makbuzları okuyun.',
  'settings.role.viewer.description': 'Salt okunur.',
  'settings.role.scopeLabel': 'Markalar ve hesaplarla sınırlayın',
  'settings.role.mfaRequired': 'Sahiplerin iki faktörlü kimlik doğrulama kullanması gerekir.',

  'settings.brands.title': 'Markalar',
  'settings.brands.add': 'Marka ekle',
  'settings.brands.voice': 'Ses',
  'settings.brands.audience': 'Seyirci',
  'settings.brands.approvedClaims': 'Onaylanmış hak talepleri',
  'settings.brands.blockedTerms': 'Engellenen terimler',
  'settings.brands.disclosureDefaults': 'Disclosure defaults',
  'settings.brands.domains': 'Alanlar',
  'settings.brands.glossary.title': 'Sözlük',
  'settings.brands.glossary.term': 'Dönem',
  'settings.brands.glossary.preferred': 'Tercih edilen çeviri',
  'settings.brands.glossary.prohibited': 'Olarak tercüme etmeyin',
  'settings.brands.glossary.context': 'Bağlam',
  'settings.brands.glossary.keepUntranslated': 'Çevrilmemiş halde tut',
  'settings.brands.localeRules.title': 'Yerel kurallar',
  'settings.brands.localeRules.formality': 'Formalite',
  'settings.brands.localeRules.pronouns': 'Zamirler ve saygı sıfatları',
  'settings.brands.localeRules.idioms': 'Kaçınılması gereken deyimler',
  'settings.brands.localeRules.emoji': 'Emoji ve hashtag normları',
  'settings.brands.localeRules.legal': 'Regional legal disclosures',
  'settings.brands.localeRules.cta': 'Pazara göre eylem çağrısı',
  'settings.brands.localeRules.reviewedExamples':
    'Yerel bir incelemeci tarafından onaylanan örnekler',

  'settings.sets.title': 'Setler',
  'settings.sets.description':
    'Yeniden kullanılabilir bir hedef, değişken, ayar, yorum ve gecikme grubu. Bir Kümenin uygulanması bağımsız bir taslak oluşturur.',
  'settings.sets.editNote':
    'Bir Seti düzenlemek, halihazırda onaylanmış veya planlanmış gönderileri değiştirmez.',
  'settings.signatures.title': 'İmzalar',
  'settings.signatures.description':
    "Markaya, platforma ve dile göre kapsamı belirlenen kapanış metni, hashtag'ler, bağlantılar veya açıklamalar.",
  'settings.signatures.autoApply': 'Bağlam eşleştiğinde otomatik olarak ekle',

  'settings.localization.title': 'Yerelleştirme',
  'settings.localization.interfaceLocale': 'Arayüz dili',
  'settings.localization.interfaceLocaleHelp':
    'Bu uygulamanın dili sizin için. Gönderilerinizin dilini değiştirmez.',
  'settings.localization.contentLocales': 'İçerik dilleri',
  'settings.localization.contentLocalesHelp':
    'Yayınladığınız diller. Her marka, dillere göre kurallar ve sözlükler belirleyebilir.',
  'settings.localization.marketLocales': 'İzleyici pazarları',
  'settings.localization.beta': 'Beta çevirisi',
  'settings.localization.betaHelp':
    'Bu dil makine desteklidir ve henüz bir kişi tarafından tam olarak incelenmemiştir. Çevrilmemiş metin İngilizceye geri döner.',
  'settings.localization.humanReviewed': 'Anadili İngilizce olan biri tarafından incelendi',
  'settings.localization.timeZone': 'Saat dilimi',
  'settings.localization.weekStart': 'Haftanın ilk günü',
  'settings.localization.hourCycle.label': 'Zaman formatı',
  'settings.localization.hourCycle.h12': '12 saat',
  'settings.localization.hourCycle.h23': '24 saat',

  'settings.notifications.title': 'Bildirimler',
  'settings.notifications.email': 'E-posta',
  'settings.notifications.inApp': 'Uygulamada',
  'settings.notifications.approvalRequests': 'Onay istekleri',
  'settings.notifications.publishResults': 'Sonuçları yayınla',
  'settings.notifications.connectionHealth': 'Bağlantı durumu',
  'settings.notifications.ruleFailures': 'Otomasyon hataları',
  'settings.notifications.weeklySummary': 'Haftalık özet',
  'settings.notifications.digestOnly': 'Bunları tek bir günlük mesajda gruplandırın',

  'settings.security.title': 'Güvenlik',
  'settings.security.mfa': 'İki faktörlü kimlik doğrulama',
  'settings.security.mfaEnable': 'İki faktörlü kimlik doğrulamayı açın',
  'settings.security.mfaRequiredFor':
    'Faturalandırma değişiklikleri, hizmet hesapları, bir hesabın yeniden bağlanması ve kimlik bilgilerinin iptal edilmesi için gereklidir.',
  'settings.security.passkeys': 'Geçiş anahtarları',
  'settings.security.sessions': 'Aktif oturumlar',
  'settings.security.sessionRevoke': 'Bu oturumu kapat',
  'settings.security.auditLog.title': 'Denetim günlüğü',
  'settings.security.auditLog.description':
    'Her eylem, onu kim ya da ne gerçekleştirdi ve ne zaman. Sahipler ve yöneticiler tarafından dışa aktarılabilir.',
  'settings.security.killSwitch': 'Acil durdurma',
  'settings.security.killSwitchBody':
    'Bu çalışma alanındaki tüm planlanmış yayınları ve otomasyonu anında durdurur. Hiçbir şey silinmez. Tekrar kapatabilirsiniz.',
  'settings.security.killSwitchActive': 'Acil durdurma açık. Hiçbir yazı yayınlanmayacak.',

  'settings.data.title': 'Data controls',
  'settings.data.export': 'Export your data',
  'settings.data.exportPreparing': 'Preparing your export. We will email you when it is ready.',
  'settings.data.deletionRequest': 'Request deletion',
  'settings.data.deletionExplain':
    'Deletion cancels scheduled workflows, revokes provider access, removes stored media and tombstones analytics where the provider requires it.',
  'settings.data.retention': 'Retention',
  'settings.data.consents': 'Consents',
  'settings.data.consent.productAnalytics': 'Product analytics',
  'settings.data.consent.diagnostics': 'Share diagnostics with support',
  'settings.data.consent.aiImprovement':
    'Use my content to improve the assistant. This is off unless you turn it on.',
  'settings.data.consent.marketingEmail': 'Product news by email',
} as const;
