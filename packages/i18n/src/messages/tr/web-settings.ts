/**
 * Web catalog for settings, the developer portal, billing and the Growth
 * Advisor.
 *
 * This file only adds what the web screens need on top of the intent catalogs
 * in `settings.ts`, `developer.ts`, `billing.ts` and `growth.ts`. Everything
 * here lives under a `.ui.` segment so a key can never collide with one of
 * those files when the catalogs are merged.
 *
 * Several strings are mandated word for word and must not be softened:
 *  - `billing.ui.annualFraming` states the saving in currency, never a percent.
 *  - `billing.ui.cancelConfirmedBeforeConversion` must read
 *    "Canceled. You will not be charged."
 *  - the media generation boundary paragraph is NOT restated here. It already
 *    exists as `billing.mediaGeneration.explanation`, and the Tool Radar
 *    renders that same key so there is one sentence to review and translate.
 */
export const webSettingsMessages = {
  /* ------------------------------------------------------------------ shell */

  'settings.ui.subtitle':
    'Bu çalışma alanını yapılandıran her şey. Burada hiçbir şey hiçbir şey yayınlamıyor.',
  'settings.ui.nav.label': 'Ayarlar bölümleri',
  'settings.ui.index.help':
    'Bir bölüm seçin. Her değişiklik sizinle ilişkilendirilir ve denetim günlüğünde görünür.',

  'settings.ui.section.members': 'Üyeler ve roller',
  'settings.ui.section.membersSummary':
    'Bu çalışma alanında kimler var ve her bir kişi neler yapabilir?',
  'settings.ui.section.projects': 'Projeler',
  'settings.ui.section.projectsSummary':
    'Ses, hedef kitle, onaylanmış hak talepleri, engellenen terimler, yerel ayar kuralları, alanlar ve sözlük.',
  'settings.ui.section.agents': 'Aracılar ve API',
  'settings.ui.section.agentsSummary':
    'Hizmet hesapları, kapsamlar, sınırlar, kimlik bilgileri, etkinlik ve prova oyun alanı.',
  'settings.ui.section.apps': 'Geliştirici uygulamaları',
  'settings.ui.section.appsSummary':
    'Üçüncü taraf OAuth uygulamaları, yönlendirme izin verilenler listeleri, izinler ve izinler.',
  'settings.ui.section.webhooks': 'Web kancaları',
  'settings.ui.section.webhooksSummary':
    'İmzalı giden olaylar, teslimat günlükleri, yeniden teslimat ve gizli rotasyon.',
  'settings.ui.section.billing': 'Billing',
  'settings.ui.section.billingSummary':
    'Plan, trial, interval, metered provider usage, invoices and cancellation.',
  'settings.ui.section.referrals': 'Yönlendirme ve bağlı kuruluş',
  'settings.ui.section.referralsSummary':
    'Açıklanan yönlendirme bağlantınız, atfedilen kayıtlarınız ve komisyon durumunuz.',
  'settings.ui.section.localization': 'Yerelleştirme',
  'settings.ui.section.localizationSummary':
    'Arayüz dili, içerik dilleri, pazarlar, saat dilimi ve saat formatı.',
  'settings.ui.section.security': 'Güvenlik',
  'settings.ui.section.securitySummary':
    'Oturumlar, iki faktörlü kimlik doğrulama, kimlik bilgileri, aracılar, web kancaları ve uygulama bağışları.',
  'settings.ui.section.data': 'Veri kontrolleri',
  'settings.ui.section.dataSummary':
    'Dışa aktarın, bağlantıyı iptal edin, markayı silin, içeriği silin veya hesabı kapatın.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Yükleniyor {section}',
  'settings.ui.state.errorTitle': '{section} yükleyemedik',
  'settings.ui.state.errorRetry': 'Tekrar dene',
  'settings.ui.state.savingAnnouncement': '{section} kaydediliyor',
  'settings.ui.state.savedAnnouncement': '{section} kaydedildi',
  'settings.ui.state.saveFailedAnnouncement': '{section} kaydedilmedi. Girişiniz hâlâ burada.',
  'settings.ui.state.offlineTitle': 'Çevrimdışısınız',
  'settings.ui.state.offlineBody':
    'Bu sayfayı okuyabilirsiniz. Bağlantı geri gelene kadar değişiklikler kaydedilemez.',
  'settings.ui.state.permissionTitle': '{section} erişiminiz yok',
  'settings.ui.state.permissionBody':
    'Bu bölüm çalışma alanının davranışını değiştirir, dolayısıyla rolle sınırlıdır.',
  'settings.ui.state.permissionRequirements': 'İhtiyacınız olan şey',
  'settings.ui.state.permissionContact':
    'Bu çalışma alanının sahibi veya yöneticisi bu izni verebilir. Üyeler ve roller altında listelenirler.',
  'settings.ui.state.rateLimitTitle': 'Kısa sürede çok fazla değişiklik',
  'settings.ui.state.rateLimitCause':
    'Bu çalışma alanı, ayar değişiklikleri için yazma sınırına ulaştı.',
  'settings.ui.state.rateLimitReset': 'Sınır sıfırlamaları',
  'settings.ui.state.rateLimitAlternative':
    'Kaydettiğiniz hiçbir şey kaybolmadı. Salt okunur eylemleri siz beklerken çalışmaya devam eder.',
  'settings.ui.state.rateLimitUsage': 'Ayarlar bu saati yazıyor',
  'settings.ui.state.rateLimitUsageText': '{used} / {limit} kullanıldı',
  'settings.ui.state.unsavedTitle': 'Kaydedilmemiş değişiklikleriniz var',
  'settings.ui.state.unsavedBody': 'Bu bölümden ayrılmadan önce bunları kaydedin.',
  'settings.ui.state.readOnlyTitle': 'Bu çalışma alanı salt okunurdur',
  'settings.ui.state.readOnlyBody':
    'Faturalandırmanın vadesi geçti. İçeriğiniz, faturalarınız ve bağlantılarınız sağlam. Ayarlar okunabilir ancak değiştirilemez.',

  'settings.ui.state.referenceLabel': 'Destek referansı',

  'settings.ui.attribution': '{name} {relativeTime} olarak değiştirildi',
  'settings.ui.attributionNever': 'Oluşturulduğundan bu yana değişmedi',
  'settings.ui.copyFailed':
    'Tarayıcınız kopyayı engelledi. Metni seçin ve manuel olarak kopyalayın.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'Her davet, rol değişikliği ve çıkarma, adınız ve saatiniz ile birlikte kaydedilir.',
  'settings.ui.members.tableCaption': 'Bu çalışma alanındaki rol ve kapsam sahibi kişiler',
  'settings.ui.members.column.person': 'Kişi',
  'settings.ui.members.column.role': 'Rol',
  'settings.ui.members.column.scope': 'Kapsam',
  'settings.ui.members.column.approvals': 'Onaylar',
  'settings.ui.members.column.lastActive': 'Son aktif',
  'settings.ui.members.column.actions': 'Eylemler',
  'settings.ui.members.scopeAll': 'Tüm markalar ve hesaplar',
  'settings.ui.members.scopeLimited': '{count, plural, one {# marka} other {# marka}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Onaylayabilir',
  'settings.ui.members.approvals.cannotApprove': 'Onaylanamıyor',
  'settings.ui.members.approvals.canApproveOwnProjects': 'Listelenen projeler için onay verebilir',
  'settings.ui.members.lastActiveNever': 'Henüz oturum açmadı',
  'settings.ui.members.changeRole': '{name} için rolü değiştirin',
  'settings.ui.members.remove': "{name}'ı kaldırın",
  'settings.ui.members.lastOwnerTitle': 'Bir çalışma alanının en az bir sahibi bulunur',
  'settings.ui.members.lastOwnerBody':
    'Önce başka birini sahip yapın, ardından bu değişiklik kullanılabilir hale gelir.',
  'settings.ui.members.inviteTitle': 'Bu çalışma alanına birini davet edin',
  'settings.ui.members.inviteBody':
    'Bağlantı içeren bir e-posta alırlar. Davetin süresi yedi gün sonra dolar ve bu tarihten önce iptal edebilirsiniz.',
  'settings.ui.members.inviteRole': 'Rol',
  'settings.ui.members.inviteScope': 'Çalışabilecekleri markalar',
  'settings.ui.members.inviteScopeAll': 'Bu çalışma alanındaki her marka',
  'settings.ui.members.inviteScopeSelected': 'Sadece seçtiğim markalar',
  'settings.ui.members.inviteApprovals': 'Onay isteklerine karar verebilir',
  'settings.ui.members.inviteApprovalsHelp':
    'Yalnızca halihazırda inceleme içeren rollere bu verilebilir. Düzenlemekten ayrıdır.',
  'settings.ui.members.inviteSubmit': 'Davet gönder',
  'settings.ui.members.invitePending': '{relativeTime} {name} tarafından davet edildi',
  'settings.ui.members.inviteRevoke': 'Daveti iptal et',
  'settings.ui.members.inviteResend': 'Daveti tekrar gönder',
  'settings.ui.members.emptyTitle': 'Buradaki tek kişi sensin',
  'settings.ui.members.emptyBody':
    'Sonuçları yazan, onaylayan veya okuyan kişileri davet edin. Her biri bir rol ve marka kapsamına sahip olur.',
  'settings.ui.members.emptyExample':
    'Ortak bir şekil: faturalandırma için bir sahip, marka başına bir onaylayan ve taslak hazırlayan ancak asla yayınlamayan editörler.',
  'settings.ui.members.roleReferenceTitle': 'Her rolün yapabilecekleri',
  'settings.ui.members.roleReferenceCaption': 'Roller ve her birinin izin verdiği eylemler',
  'settings.ui.members.roleColumn.role': 'Rol',
  'settings.ui.members.roleColumn.can': 'Yapabilir',
  'settings.ui.members.roleColumn.cannot': 'yapamam',
  'settings.ui.members.roleCannot.owner': 'Hiçbir şey sahibinden esirgenmez.',
  'settings.ui.members.roleCannot.admin': 'Faturalandırmayı değiştirin veya çalışma alanını silin.',
  'settings.ui.members.roleCannot.manager':
    'Faturalandırmayı, rolleri veya çalışma alanının silinmesini değiştirin.',
  'settings.ui.members.roleCannot.editor':
    'Bağlantıları onaylayın, planlayın, yayınlayın veya değiştirin.',
  'settings.ui.members.roleCannot.approver':
    'Bağlantıları, kuralları veya faturalandırmayı değiştirin.',
  'settings.ui.members.roleCannot.analyst':
    'Herhangi bir şey oluşturun, düzenleyin, onaylayın veya yayınlayın.',
  'settings.ui.members.roleCannot.viewer': 'Herhangi bir şeyi değiştirin.',
  'settings.ui.members.removeTitle': '{name} öğesini bu çalışma alanından kaldırın',
  'settings.ui.members.removeConsequence.access': 'Her yüzeyde erişimi anında kaybederler.',
  'settings.ui.members.removeConsequence.drafts':
    'Yazdıkları taslaklar çalışma alanında kalır ve düzenlenebilir kalır.',
  'settings.ui.members.removeConsequence.audit':
    'Geçmiş eylemleri denetim günlüğünde ve makbuzlarda kalır.',
  'settings.ui.members.removeConsequence.approvals':
    'Kendilerinde bekleyen onay istekleri başka bir onaylayan için kuyruğa geri döner.',

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'Bir marka, içeriğin kontrol edildiği kuralları taşır: ne iddia edebileceğiniz, ne söyleyemeyeceğiniz ve her dilin nasıl yazıldığı.',
  'settings.ui.projects.listCaption': 'Bu çalışma alanındaki projeler',
  'settings.ui.projects.column.project': 'Proje',
  'settings.ui.projects.column.locales': 'İçerik dilleri',
  'settings.ui.projects.column.accounts': 'Hesaplar',
  'settings.ui.projects.column.updated': 'Güncellendi',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Hesap yok} one {# hesap} other {# hesap}}',
  'settings.ui.projects.emptyTitle': 'Henüz proje yok',
  'settings.ui.projects.emptyBody':
    'Bir marka, hesapları, onay kurallarını ve dil kurallarını gruplandırır. Çoğu ekip bir taneyle başlar ve bir müşterinin veya pazarın farklı kurallara ihtiyacı olduğunda bir saniye ekler.',
  'settings.ui.projects.emptyExample':
    'Örnek: "Acme EU" markası, İngilizce ve Almanca dilleri, "garantili" terimi engellendi, Instagram için "Ücretli ortaklık" açıklaması.',
  'settings.ui.projects.voiceHelp':
    'Bu proje kulağa nasıl geliyor? Yeniden yazma talebinde bulunduğunuzda ve talepler kontrol edildiğinde kullanılır.',
  'settings.ui.projects.audienceHelp': 'Pazara göre içeriğin kime yönelik olduğu.',
  'settings.ui.projects.approvedClaimsHelp':
    'Bir incelemecinin onayladığı ifadeler. Bu listenin dışındaki herhangi bir şey yayınlandıktan sonra değil, onaylanmadan önce işaretlenir.',
  'settings.ui.projects.blockedTermsHelp':
    'Bu proje için planlamayı engelleyen kelimeler. Her satıra bir tane.',
  'settings.ui.projects.domainsHelp':
    'Bu projenin bağlantı verebileceği ve kısaltabileceği alan adları. Oluşturucuda yalnızca doğrulanmış alanlar seçilebilir.',
  'settings.ui.projects.domainVerified': 'Doğrulandı {date}',
  'settings.ui.projects.domainPending': 'DNS kaydı henüz görülmedi',
  'settings.ui.projects.domainVerificationUnavailable': 'Doğrulama henüz geliştirilmedi',
  'settings.ui.projects.disclosureUnavailable':
    'Kanal başına açıklama varsayılanları henüz geliştirilmedi. Bu özellik gelene kadar gerekli açıklamayı gönderiye ekleyin.',
  'settings.ui.projects.glossaryUnavailable':
    'Çalışma alanı sözlüğü henüz geliştirilmedi. Yukarıdaki ses, kitle, onaylanmış iddialar ve engellenen terimler kaydedilir ve uygulanır.',
  'settings.ui.projects.localeRulesUnavailable':
    'Dil başına yazım kuralları henüz geliştirilmedi. Çalışma alanı dilleri ve pazarları Yerelleştirme altında kullanılabilir olmaya devam ediyor.',
  'settings.ui.projects.disclosureHelp':
    'Burada seçtiğiniz platformlar için oluşturucuda varsayılan olarak uygulanır. Onaydan önce gönderi başına değiştirilebilir.',
  'settings.ui.projects.glossaryHelp':
    'Ürün adları, yasal terimler ve çeviride değişmeden kalması gereken her şey.',
  'settings.ui.projects.glossaryCaption':
    'Korunan terimler ve her birinin dil bazında nasıl ele alındığı',
  'settings.ui.projects.glossaryEmpty':
    'Henüz korumalı terim yok. Çevrilmemesi veya yeniden ifade edilmemesi gereken ürün adlarını ve yasal terimleri ekleyin.',
  'settings.ui.projects.localeRulesHelp':
    'İçerik diline göre kurallar. Uyarladığınızda veya dönüştürdüğünüzde uygulanırlar ve inceleyene gösterilirler.',
  'settings.ui.projects.saveProject': 'Projeyi kaydet',
  'settings.ui.projects.capacityTitle': 'Proje kapasitesi',
  'settings.ui.projects.capacityHelp':
    'Temel $29 plan 3 aktif proje içerir. Bir çalışma alanı, başka bir hesap oluşturmadan 20 projeye kadar hak kazanabilir.',
  'settings.ui.projects.capacitySummary': '{limit} üzerinden {used}',
  'settings.ui.projects.atLimitTitle': 'Bu çalışma alanı tüm proje kotasını kullandı',
  'settings.ui.projects.atLimitBody':
    'Başka bir tane eklemeden önce etkin olmayan bir projeyi arşivleyin veya çalışma alanı hakkını değiştirin. Mevcut limit {limit}.',
  'settings.ui.projects.listLabel': 'Düzenlemek için bir proje seçin',
  'settings.ui.projects.detailsTitle': 'Proje ayrıntıları',
  'settings.ui.projects.projectMeta':
    '{accounts, plural, =0 {Kanal yok} one {# kanal} other {# kanal}} · Güncellendi {updated}',
  'settings.ui.projects.archiveAction': 'Projeyi arşivle',
  'settings.ui.projects.archiveTitle': '{project} arşivlensin mi?',
  'settings.ui.projects.archiveBody':
    'Bu etkin olmayan proje, etkin çalışma alanından ayrılır ve bir proje kotası boşaltır.',
  'settings.ui.projects.archiveChannels':
    'Bağlı kanalları artık etkin proje akışlarında görünmez.',
  'settings.ui.projects.archiveHistory':
    'Taslaklar, yayınlanan gönderiler, alındılar ve denetim geçmişi saklanır.',
  'settings.ui.projects.archiveLastDisabled': 'Çalışma alanında en az bir etkin proje bulundurun.',
  'settings.ui.projects.archiveConnectedDisabled':
    'Arşivlemeden önce bu projenin kanallarının bağlantısını kesin.',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'Üç ayrı ayar: bu uygulamanın dili, yayınladığınız diller ve yazdığınız pazarlar. Birini değiştirmek diğerini asla değiştirmez.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Bu uygulama için bir arayüz dili seçin. İçerik dilleri ayrıdır ve halihazırda mevcuttur.',
  'settings.ui.localization.marketHelp':
    'Piyasa; örnekleri, yasal açıklamaları ve eylem çağrılarını değiştirir. Bir gönderinin dilini değiştirmez.',
  'settings.ui.localization.previewTitle': 'Tarihler ve sayılar nasıl okunacak?',
  'settings.ui.localization.previewDate': 'Tarih',
  'settings.ui.localization.previewTime': 'Zaman',
  'settings.ui.localization.previewNumber': 'Sayı',
  'settings.ui.localization.previewCurrency': 'Para birimi',
  'settings.ui.localization.weekStartHelp': 'Takvim haftası görünümü tarafından kullanılır.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'Bu çalışma alanında işlem yapabilecek her şey tek bir yerde: oturumlarınız, kimlik bilgileriniz, aracılarınız, web kancalarınız ve erişim izni verdiğiniz uygulamalar.',
  'settings.ui.security.sessionsCaption': 'Hesabınız için oturum açılan oturumlar',
  'settings.ui.security.sessionColumn.device': 'Cihaz ve tarayıcı',
  'settings.ui.security.sessionColumn.location': 'Yaklaşık konum',
  'settings.ui.security.sessionColumn.lastSeen': 'Son kullanılan',
  'settings.ui.security.sessionCurrent': 'Bu oturum',
  'settings.ui.security.sessionRevokeAll': 'Her iki oturumda bir oturumunuzu kapatın',
  'settings.ui.security.sessionLocationUnknown': 'Konum kaydedilmedi',
  'settings.ui.security.mfaOn': 'İki faktörlü kimlik doğrulama açık',
  'settings.ui.security.mfaOff': 'İki faktörlü kimlik doğrulama kapalı',
  'settings.ui.security.mfaBody':
    'Faturalandırma değişiklikleri, hizmet hesabı oluşturma, bir hesabı yeniden bağlama ve kimlik bilgilerini iptal etmeden önce ikinci bir faktör gereklidir.',
  'settings.ui.security.credentialsTitle': 'API anahtarları',
  'settings.ui.security.credentialsBody':
    'Bu çalışma alanına ait anahtarlar. Bunlar, uygulama bağışlarından ve kendi oturumunuzdan ayrıdır.',
  'settings.ui.security.agentsTitle': 'Hizmet hesapları',
  'settings.ui.security.webhooksTitle': 'Web kancası uç noktaları',
  'settings.ui.security.grantsTitle': 'İzin verdiğiniz uygulamalar',
  'settings.ui.security.grantsBody':
    'Bir uygulamayı iptal etmek, belirteçlerini anında durdurur. Kendi bağlantılarınız ve planlanmış gönderileriniz etkilenmez.',
  'settings.ui.security.grantScopes': 'Verilen izinler',
  'settings.ui.security.socialPermissionsTitle': 'Sosyal hesap izinleri',
  'settings.ui.security.socialPermissionsBody':
    "Bağlantı zamanında alınan yetenek anlık görüntüsünden, her bağlı hesabın Relay'in yapmasına izin verdiği şey.",
  'settings.ui.security.viewInSection': "{section}'da yönetin",
  'settings.ui.security.emptySessions': 'Yalnızca bu oturumda oturum açıldı.',
  'settings.ui.security.emptyGrants':
    'Hiçbir üçüncü taraf uygulamasının bu çalışma alanına erişimi yoktur. Uygulamalar, izin ekranında izin verdiğinizde burada görünür.',
  'settings.ui.security.revokeGrantTitle': '{app} için erişimi iptal edin',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Erişim ve yenileme belirteçleri hemen çalışmayı durdurur.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Zaten planlanmış kalışı planlanmış olarak yayınlar. Durdurulmasını istiyorsanız bunları ayrı ayrı iptal edin.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'Uygulama tekrar erişim isteyebilir ve siz reddedebilirsiniz.',

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'Take your data out, remove one thing, or close the account. Every destructive action names exactly what it touches first.',
  'settings.ui.data.exportTitle': 'Export',
  'settings.ui.data.exportBody':
    'A portable archive of content, schedules, receipts, analytics and audit events, plus your uploaded media.',
  'settings.ui.data.exportJson': 'Structured JSON',
  'settings.ui.data.exportCsv': 'Spreadsheet CSV',
  'settings.ui.data.exportMedia': 'Media archive',
  'settings.ui.data.exportJsonHelp':
    'One file per record type. Documented and stable across versions.',
  'settings.ui.data.exportCsvHelp': 'Posts, receipts and metrics as flat tables for a spreadsheet.',
  'settings.ui.data.exportMediaHelp':
    'The original files you uploaded or imported, with checksums.',
  'settings.ui.data.exportStart': 'Prepare export',
  'settings.ui.data.exportRunning':
    'Preparing your export. It keeps running if you close this page.',
  'settings.ui.data.exportReady': 'Export ready, prepared {date}',
  'settings.ui.data.exportDownload': 'Download export',
  'settings.ui.data.exportExpires': 'The download link expires {date}.',
  'settings.ui.data.deleteTitle': 'Delete',
  'settings.ui.data.deleteBody':
    'Choose the smallest thing that solves your problem. Each option below says what survives.',
  'settings.ui.data.deleteConnection': 'Revoke one social connection',
  'settings.ui.data.deleteConnectionHelp':
    'Removes Relay access to that account. The workspace, its content and its receipts stay.',
  'settings.ui.data.deleteProject': 'Bir projeyi arşivle',
  'settings.ui.data.deleteProjectHelp':
    'Projeyi, kurallarını ve terim sözlüğünü kaldırır. Bu proje altında yayınlanan içerik makbuzlarını korur.',
  'settings.ui.data.deleteContent': 'Delete content and media',
  'settings.ui.data.deleteContentHelp':
    'Removes drafts and stored files. It does not remove anything already published on a platform.',
  'settings.ui.data.deleteAccount': 'Close this workspace',
  'settings.ui.data.deleteAccountHelp':
    'Cancels scheduled jobs, revokes every connection, removes stored media and closes the workspace.',
  'settings.ui.data.scheduledJobsTitle': 'Scheduled work that will be canceled first',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {Nothing is scheduled right now} one {# scheduled post} other {# scheduled posts}}',
  'settings.ui.data.cancelJobsFirst': 'Cancel scheduled posts now',
  'settings.ui.data.cancelJobsDone': 'Scheduled posts canceled. Nothing will publish.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'Type the workspace name to confirm',
  'settings.ui.data.deleteConsequence.jobs':
    'Every scheduled post is canceled before anything is removed.',
  'settings.ui.data.deleteConsequence.connections':
    'Every social connection is revoked at the provider.',
  'settings.ui.data.deleteConsequence.media': 'Stored media is deleted and cannot be recovered.',
  'settings.ui.data.deleteConsequence.receipts':
    'Publication receipts are kept for the retention period stated in the Terms, then removed.',
  'settings.ui.data.deleteConsequence.published':
    'Posts already live on a platform are not deleted. Remove those on the platform.',
  'settings.ui.data.exportFirst': 'Export your data before you delete it.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'Açıklanan bir bağlantıyla Röleyi paylaşın. Komisyon hiçbir zaman olumlu bir incelemeye bağlı değildir.',
  'settings.ui.referral.linkLabel': 'Yönlendirme bağlantınız',
  'settings.ui.referral.tableCaption': 'İlişkilendirilen kayıtlar ve komisyon durumları',
  'settings.ui.referral.column.signup': 'Kayıt ol',
  'settings.ui.referral.column.date': 'Tarih',
  'settings.ui.referral.column.state': 'Komisyon',
  'settings.ui.referral.column.amount': 'Tutar',
  'settings.ui.referral.emptyTitle': 'Henüz ilişkilendirilmiş kayıt yok',
  'settings.ui.referral.emptyBody':
    'Birisi sizin bağlantınız üzerinden denemeye başladığında kayıtlar burada görünür. Geri ödeme penceresi kapanana kadar tutarlar beklemede kalır.',
  'settings.ui.referral.emptyExample':
    "Örnek satır: acme.example, 12 Haziran'da bir deneme başlattı, 12 Temmuz'a kadar beklemede, ardından onaylandı.",
  'settings.ui.referral.termsLink': 'İş ortağı şartlarını okuyun',
  'settings.ui.referral.balance': 'Onaylanmış komisyon',
  'settings.ui.referral.balanceUnavailableReason':
    'Bu döneme ilişkin komisyon defterinin mutabakatı henüz sağlanmadı.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'Hizmet hesabı, bir aracı, komut dosyası veya iş akışı için adlandırılmış bir kimliktir. Kendi kapsamlarını, kendi sınırlarını ve kendi denetim izini taşır.',
  'developer.ui.agents.emptyTitle': 'Henüz hizmet hesabı yok',
  'developer.ui.agents.emptyBody':
    'Çalıştırdığınız her otomasyon için bir tane oluşturun. Ayrı hesaplar, diğerlerini durdurmadan birini iptal edebileceğiniz anlamına gelir.',
  'developer.ui.agents.emptyExample':
    'Örnek: "İçerik aracısı", Acme EU markası, 07:00 ile 22:00 arasında günde en fazla 6 gönderi hazırlayabilir ve planlayabilir, hiçbir zaman hemen yayınlamaz.',
  'developer.ui.agents.step.identity': 'İsim ve amaç',
  'developer.ui.agents.step.scope': 'Neye ulaşabilir',
  'developer.ui.agents.step.limits': 'Sınırlar',
  'developer.ui.agents.purpose': 'Bu hesap ne işe yarıyor',
  'developer.ui.agents.purposeHelp':
    'Bir cümle. Denetim günlüğünde bu hesabın gerçekleştirdiği her eylemin yanında görünür.',
  'developer.ui.agents.scopeHelp':
    'Bir kapsam tam olarak kendisini sağlar. Buradaki hiçbir şey başka bir şeyi ima etmiyor.',
  'developer.ui.agents.limitsHelp':
    'Sınırlar aracı tarafından değil API tarafından uygulanır. Bir temsilci kendi limitini yükseltemez.',
  'developer.ui.agents.quietHours': 'Sessiz saatler',
  'developer.ui.agents.quietHoursHelp':
    'Hesap, çalışma alanı saat diliminde bu saatler içinde planlama yapamaz veya yayınlayamaz.',
  'developer.ui.agents.lookAheadHelp': 'Geleceğe ne kadar uzak bir yazı yerleştirebilir.',
  'developer.ui.agents.cadenceHelp': 'Bir günde neden olabileceği en dış yayınlar.',
  'developer.ui.agents.expiry': 'Kimlik bilgilerinin sona ermesi',
  'developer.ui.agents.expiryHelp':
    'Daha kısa bir hayat daha güvenlidir. İstediğiniz zaman döndürebilirsiniz.',
  'developer.ui.agents.summaryTitle': 'Bunu oluşturmadan önce',
  'developer.ui.agents.summaryAccounts': 'Ulaşabileceği hesaplar',
  'developer.ui.agents.summaryMaxActions':
    'Günde en fazla {count, plural, one {# harici yayın} other {# harici yayın}}.',
  'developer.ui.agents.summaryApproval': 'Onay davranışı',
  'developer.ui.agents.summaryCreate': 'Hizmet hesabı oluştur',
  'developer.ui.agents.detailTitle': 'Hizmet hesabı',
  'developer.ui.agents.statusActive': 'Aktif',
  'developer.ui.agents.statusStopped': 'Durduruldu',
  'developer.ui.agents.statusExpired': 'Kimlik bilgisinin süresi doldu',
  'developer.ui.agents.stoppedBody':
    'Bu hesap durduruldu. Yaptığı her çağrı açık bir gerekçeyle reddediliyor. Yarattığı hiçbir şey kaldırılmadı.',
  'developer.ui.agents.killTitle': 'Durdur {name}',
  'developer.ui.agents.killConsequence.calls':
    'Bu hesaptan gelen her API, MCP ve CLI çağrısı tek seferde reddedilir.',
  'developer.ui.agents.killConsequence.scheduled':
    'Zaten planlanmış kalışı planlanmış olarak yayınlar. Durdurulmasını istiyorsanız takvimden iptal edin.',
  'developer.ui.agents.killConsequence.reversible': 'Daha sonra tekrar başlatabilirsiniz.',
  'developer.ui.agents.resume': 'Bu aracıyı yeniden başlat',
  'developer.ui.agents.rotate': 'Kimlik bilgisini döndür',
  'developer.ui.agents.rotateTitle': 'Kimlik bilgisini {name} için döndürün',
  'developer.ui.agents.rotateConsequence.old':
    'Geçerli kimlik bilgisinin çalışması hemen durdurulur.',
  'developer.ui.agents.rotateConsequence.new': 'Yeni olan bu sayfada bir kez gösterilir.',
  'developer.ui.agents.rotateConsequence.clients':
    'Eski değeri kullanan herhangi bir şey, siz güncelleyene kadar başarısız olur.',
  'developer.ui.agents.credentialStored': 'Bu kimlik bilgisini sakladım',
  'developer.ui.agents.credentialLabel': 'Hizmet hesabı kimlik bilgisi',
  'developer.ui.agents.credentialWarning': 'Bu kimlik bilgisinin gösterildiği tek zaman budur',
  'developer.ui.agents.credentialWarningBody':
    'Şimdi bunu gizli mağazanıza kopyalayın. Yalnızca bir karma tutuyoruz, bu yüzden onu tekrar gösteremiyoruz. Döndürmek yeni bir tane yaratır.',
  'developer.ui.agents.credentialConsumed':
    'Kimlik bilgisi artık görüntülenmiyor. Saklamadıysanız döndürün.',
  'developer.ui.agents.credentialReveal': 'Kimlik bilgilerini göster',
  'developer.ui.agents.credentialHide': 'Kimlik bilgisini gizle',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read':
    'Bağlı hesaplarınızı ve her birinin neler yapabileceğini görün',
  'developer.ui.scope.accounts_write':
    'Hesapları yeniden adlandırın ve gruplandırılma şekillerini değiştirin',
  'developer.ui.scope.drafts_read': 'Taslaklarınızı ve varyantlarını okuyun',
  'developer.ui.scope.drafts_write': 'Taslak oluşturma ve düzenleme',
  'developer.ui.scope.posts_schedule': 'Onaylanan içeriği hesaplarınıza planlayın',
  'developer.ui.scope.posts_publish': 'Hemen hesaplarınıza yayınlayın',
  'developer.ui.scope.posts_cancel': 'Planlanmış gönderileri iptal et',
  'developer.ui.scope.analytics_read': 'Hesaplarınıza ilişkin analizleri okuyun',
  'developer.ui.scope.media_read': 'Kitaplığınızdaki dosyaları görün',
  'developer.ui.scope.media_write': 'Kitaplığınızdaki dosyaları yükleyin ve düzenleyin',
  'developer.ui.scope.rules_read': 'Otomasyon kurallarınızı okuyun',
  'developer.ui.scope.rules_write': 'Yayımlayabilecek otomasyon kuralları oluşturma ve değiştirme',
  'developer.ui.scope.growth_read': 'Büyüme planlarınızı okuyun',
  'developer.ui.scope.growth_write': 'Büyüme planları oluşturun ve düzenleyin',
  'developer.ui.scope.webhooks_manage': 'Web kancası uç noktaları oluşturma ve değiştirme',
  'developer.ui.scope.billing_read': 'Planınızı, deneme durumunuzu ve kullanımınızı okuyun',
  'developer.ui.scope.connections_admin': 'Sosyal hesapları bağlayın ve bağlantısını kesin',

  'developer.ui.activity.caption': 'Reddedilenlerle birlikte son araç çağrıları',
  'developer.ui.activity.column.time': 'Zaman',
  'developer.ui.activity.column.tool': 'Araç veya rota',
  'developer.ui.activity.column.outcome': 'Sonuç',
  'developer.ui.activity.column.subject': 'Konu',
  'developer.ui.activity.outcome.ok': 'İzin verildi',
  'developer.ui.activity.outcome.denied': 'Reddedildi',
  'developer.ui.activity.outcome.failed': 'Başarısız',
  'developer.ui.activity.filterDenied': 'Yalnızca reddedilen girişimleri göster',
  'developer.ui.activity.deniedExplain':
    'Reddedilen bir girişim, yanlış yapılandırılmış bir aracının kendisini nasıl gösterdiğidir. Bu satırlar gizlenmez, tutulur.',
  'developer.ui.activity.emptyTitle': 'Henüz kayıtlı çağrı yok',
  'developer.ui.activity.emptyBody':
    'Reddedilenler de dahil olmak üzere çağrılar, gerçekleştikten birkaç saniye sonra burada görünür.',
  'developer.ui.activity.emptyExample':
    'Örnek satır: 12:03, draft_post, İzin verildi, X hesabı @acme için taslak.',

  'developer.ui.setup.help':
    'Bunu bağlandığınız istemciye yapıştırın. Kimlik bilgileri yer tutucusunu, sakladığınız değerle değiştirin.',
  'developer.ui.setup.credentialPlaceholder':
    'Parçacıkta bir yer tutucu kullanılıyor. Gerçek kimlik bilgilerini hiçbir zaman bir depoya teslim etmeyin.',
  'developer.ui.setup.copySnippet': '{client} için pasajı kopyala',
  'developer.ui.setup.snippetCopied': 'Snippet kopyalandı',
  'developer.ui.setup.tabLabel': 'İstemci kurulum parçacıkları',

  'developer.ui.playground.help':
    'Çağrılar bu çalışma alanının tohumlanmış bir kopyasına karşı çalıştırılır. Hiçbir sağlayıcıyla iletişime geçilmiyor ve hiçbir şey planlanmıyor.',
  'developer.ui.playground.tool': 'Araç',
  'developer.ui.playground.arguments': 'Argümanlar',
  'developer.ui.playground.argumentsHelp': "JSON. Gerçek API'nin kabul ettiği gövdenin aynısı.",
  'developer.ui.playground.result': 'Sonuç',
  'developer.ui.playground.resultEmpty': 'Döndüreceği yanıtı görmek için bir araç çalıştırın.',
  'developer.ui.playground.invalidJson':
    'Bu henüz geçerli bir JSON değil, dolayısıyla gönderilemiyor.',
  'developer.ui.playground.deniedByApproval':
    "Onay seviyesi {level} bu aramaya izin vermiyor. Prova işlemi bunu tam olarak API'nin yapacağı gibi reddeder.",
  'developer.ui.playground.announceResult': 'Kuru çalışma tamamlandı. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'Başkalarının kendi çalışma alanlarına erişim izni verebilmesi için bir uygulamayı kaydedin. Her uygulamanın kendi kimliği, kendi yönlendirme izin verilenler listesi ve kendi denetim izi vardır.',
  'developer.ui.apps.emptyTitle': 'Kayıtlı uygulama yok',
  'developer.ui.apps.emptyBody':
    'Başka bir ürünün bir Aktarma kullanıcısı adına hareket etmesi gerektiğinde bir uygulamayı kaydedin. Kendi otomasyonunuz için bunun yerine bir hizmet hesabı kullanın.',
  'developer.ui.apps.emptyExample':
    'Örnek: "Acme Yayıncısı", gizli istemci, https://acme.example/oauth/callback yönlendirmesi, hesapları kapsar:okuma ve taslaklar:yazma.',
  'developer.ui.apps.typeHelp':
    "Gizli bir istemci, kontrol ettiğiniz bir sunucuda çalışır ve sır saklayabilir. Genel istemci bir tarayıcı veya masaüstü uygulamasıdır ve PKCE'yi sır olmadan kullanır.",
  'developer.ui.apps.redirectAdd': "Yönlendirme URI'si ekleyin",
  'developer.ui.apps.redirectRemove': "{uri}'ı kaldırın",
  'developer.ui.apps.redirectInvalid':
    "Joker karakter ve sorgu dizesi içermeyen tam bir https URI'si girin. Uygulamanızın gönderdiği değerle tam olarak eşleşmelidir.",
  'developer.ui.apps.linksTitle': 'Yayınlanan bağlantılar',
  'developer.ui.apps.linksHelp':
    'Bunlar izin ekranında görünür. Onlara ulaşamayan bir kullanıcı erişim izni vermeyecektir.',
  'developer.ui.apps.linkUnreachable': "En son kontrol ettiğimizde bu URL'ye ulaşamadık, {date}.",
  'developer.ui.apps.linkReachable': 'Ulaşılabilir, kontrol edildi {date}',
  'developer.ui.apps.scopesTitle': 'Bu uygulamanın isteyebileceği izinler',
  'developer.ui.apps.scopesHelp':
    'İhtiyacınız olan en az şeyi isteyin. Kullanıcı okuma izinlerini ve sonuç izinlerini iki ayrı grup olarak görür.',
  'developer.ui.apps.scopeGroup.read': 'İzinleri oku',
  'developer.ui.apps.scopeGroup.reversible': 'Geri alabileceğiniz değişiklikler',
  'developer.ui.apps.scopeGroup.consequential': 'Sonuçsal izinler',
  'developer.ui.apps.scopeGroupHelp.read':
    'Bunlar uygulamanın verilere bakmasına izin verir. Hiçbir şey değişmiyor.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Bunlar, uygulamanın Relay içinde bir şeyler oluşturmasına veya düzenlemesine olanak tanır. Hiçbir şey bir platforma ulaşmıyor.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Bunlar gerçek bir hesapta paylaşım yapılmasına neden olabilir veya hesaplarınıza kimlerin erişebileceğini değiştirebilir. Her zaman ayrı olarak listelenirler ve asla paketlenmezler.',
  'developer.ui.apps.noBundling':
    'Birleşik erişim kapsamı yoktur. Faturalandırma ve bağlantı yönetimi her zaman isimle sorulur.',
  'developer.ui.apps.secretTitle': 'İstemci sırrı',
  'developer.ui.apps.secretWarning': 'Bu, müşteri sırrının gösterildiği tek zamandır',
  'developer.ui.apps.secretWarningBody':
    'Şimdi bunu sunucu tarafı gizli yöneticinizde saklayın. Yalnızca bir karma tutuyoruz. Kaybederseniz döndürün: tekrar ortaya çıkarmanın yolu yoktur.',
  'developer.ui.apps.secretConsumed': 'Sır artık görüntülenmiyor. Saklamadıysanız döndürün.',
  'developer.ui.apps.secretStored': 'Bu sırrı sakladım',
  'developer.ui.apps.secretPublicClient':
    'Halka açık bir müşterinin sırrı yoktur. PKCE ile yetkilendirme kodu akışını kullanır.',
  'developer.ui.apps.rotateTitle': 'İstemci sırrını {app} süreyle döndürün',
  'developer.ui.apps.rotateConsequence.old': 'Geçerli gizli kod hemen çalışmayı durdurur.',
  'developer.ui.apps.rotateConsequence.grants': 'Mevcut kullanıcı yetkileri iptal edilmez.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Siz yeni değeri dağıtana kadar sunucularınız belirteçleri yenileyemez.',
  'developer.ui.apps.consentPreviewTitle': 'İzin ekranı önizlemesi',
  'developer.ui.apps.consentPreviewHelp':
    'Bir kullanıcının gördüğü şey budur. Uygulama kaydından oluşturulduğundan uygulamanın istediğinden daha fazlasını vaat edemez.',
  'developer.ui.apps.consentPreviewSample':
    'Yalnızca önizleme. Hiçbir şey verilmez ve hiçbir jeton verilmez.',
  'developer.ui.apps.grantsCaption': 'Bu uygulamaya erişim izni veren çalışma alanları',
  'developer.ui.apps.grantColumn.workspace': 'Çalışma alanı',
  'developer.ui.apps.grantColumn.scopes': 'Kapsamlar',
  'developer.ui.apps.grantColumn.granted': 'İzin verildi',
  'developer.ui.apps.grantColumn.lastUsed': 'Son kullanılan',
  'developer.ui.apps.grantsEmpty': 'Henüz hiç kimse bu uygulamaya erişim izni vermedi.',
  'developer.ui.apps.logsCaption': 'Gizli dizilerin ve yüklerin kaldırıldığı son istekler',
  'developer.ui.apps.logColumn.time': 'Zaman',
  'developer.ui.apps.logColumn.route': 'Rota',
  'developer.ui.apps.logColumn.status': 'Durum',
  'developer.ui.apps.logColumn.workspace': 'Çalışma alanı',
  'developer.ui.apps.logsRedacted':
    'İstek ve yanıt gövdeleri, kimlik bilgileri, belirteçler ve kullanıcı içeriği kaldırılmış şekilde depolanır.',
  'developer.ui.apps.sandboxTitle': 'Korumalı alan kimlik bilgileri',
  'developer.ui.apps.sandboxBody':
    'Başlangıç verileri içeren ayrı bir istemci kimliği ve çalışma alanı. Bununla yapılan aramalar asla bir sağlayıcıya ulaşmaz.',
  'developer.ui.apps.rateLimitLabel': 'Oran sınırı',
  'developer.ui.apps.rateLimitUsage': "Bu saatte {limit} istekten {used}'i",
  'developer.ui.apps.disable': 'Uygulamayı devre dışı bırak',
  'developer.ui.apps.enable': 'Uygulamayı etkinleştir',
  'developer.ui.apps.disabledBody':
    'Bu uygulama devre dışı bırakıldı. Mevcut tokenlar reddedilir ve yeni hibe başlatılamaz. Bağışlar, tekrar etkinleştirebilmeniz için saklanır.',
  'developer.ui.apps.deleteTitle': 'Sil {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Her hibe iptal edilir ve her tokenin çalışması durdurulur.',
  'developer.ui.apps.deleteConsequence.logs':
    'İstek günlükleri denetim saklama süresi boyunca saklanır.',
  'developer.ui.apps.deleteConsequence.irreversible': 'İstemci kimliği yeniden kullanılamaz.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Seçtiğiniz etkinlikler için imzalı HTTPS teslimatları. Her teslimat, yanıtıyla birlikte günlüğe kaydedilir ve herhangi bir teslimat tekrar gönderilebilir.',
  'developer.ui.webhooks.emptyTitle': 'Henüz uç nokta yok',
  'developer.ui.webhooks.emptyBody':
    'Kendi sistemlerinizde yayınlama sonuçlarını, onay kararlarını ve bağlantı durumunu almak için bir uç nokta ekleyin.',
  'developer.ui.webhooks.emptyExample':
    "Örnek: https://hooks.acme.example/relay, post.published, post.failed ve Connection.action_required'a abone olundu.",
  'developer.ui.webhooks.create': 'Uç nokta ekle',
  'developer.ui.webhooks.url': "Uç nokta URL'si",
  'developer.ui.webhooks.urlHelp':
    "Yalnızca HTTPS. Hiçbir yönlendirmeyi takip etmiyoruz ve 2xx'i yeniden denemiyoruz.",
  'developer.ui.webhooks.eventsTitle': 'Etkinlikler',
  'developer.ui.webhooks.eventsHelp':
    'Ele aldığınız olayları seçin. Her şeyi, çoğunu göz ardı eden bir uç noktaya göndermek, başarısızlıkların görülmesini zorlaştırır.',
  'developer.ui.webhooks.eventsAll': 'Her olay',
  'developer.ui.webhooks.eventsSelected': 'Yalnızca seçtiğim etkinlikler',
  'developer.ui.webhooks.eventsCount': '{count, plural, one {# etkinlik} other {# etkinlik}}',
  'developer.ui.webhooks.eventGroup.connections': 'Bağlantılar',
  'developer.ui.webhooks.eventGroup.content': 'İçerik ve onay',
  'developer.ui.webhooks.eventGroup.publishing': 'Yayınlama',
  'developer.ui.webhooks.eventGroup.automation': "Otomasyon ve feed'ler",
  'developer.ui.webhooks.eventGroup.workspace': 'Çalışma alanı',
  'developer.ui.webhooks.scopeTitle': 'Markalar ve hesaplar',
  'developer.ui.webhooks.scopeAll': 'Her marka ve hesap',
  'developer.ui.webhooks.scopeSelected': 'Sadece seçtiklerim',
  'developer.ui.webhooks.secretTitle': 'Gizli imza',
  'developer.ui.webhooks.secretBody':
    'Bir gövdeyi ayrıştırmadan önce imza başlığını doğrulayın. Yeniden denemelerde kararlı olan teslimat kimliğinde tekilleştirme.',
  'developer.ui.webhooks.secretRotateTitle': 'İmza sırrını döndür',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Her iki gizli dizi de 24 saat boyunca kabul edilir, böylece teslimatı bırakmadan konuşlandırabilirsiniz.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Bu pencereden sonra yalnızca yeni sır kullanılır.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Alıcınızın bunu güvenli bir şekilde göz ardı edebilmesi için test olarak işaretlenmiş imzalı bir örnek olay gönderir.',
  'developer.ui.webhooks.testDeliverySent':
    'Test teslimatı gönderildi. Sonuç aşağıdaki günlükte görünür.',
  'developer.ui.webhooks.deliveriesCaption': 'Son teslimatlar ve her birinin aldığı yanıt',
  'developer.ui.webhooks.deliveryColumn.time': 'İstendi',
  'developer.ui.webhooks.deliveryColumn.event': 'Etkinlik',
  'developer.ui.webhooks.deliveryColumn.attempt': 'deneme',
  'developer.ui.webhooks.deliveryColumn.response': 'Yanıt',
  'developer.ui.webhooks.deliveryColumn.status': 'Durum',
  'developer.ui.webhooks.deliveryStatus.pending': 'Bekliyor',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'teslim edildi',
  'developer.ui.webhooks.deliveryStatus.failed': 'Başarısız oldu, tekrar deneyeceğim',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Başarısız oldu, artık yeniden deneme yok',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Gönderilmedi, uç nokta devre dışı',
  'developer.ui.webhooks.deliveryNoResponse': 'Yanıt alınmadı',
  'developer.ui.webhooks.deliveryNextAttempt': 'Sonraki deneme {relativeTime}',
  'developer.ui.webhooks.inspect': 'Teslimatı inceleyin',
  'developer.ui.webhooks.inspectTitle': 'Teslimat {id}',
  'developer.ui.webhooks.inspectRequest': 'Talep gövdesi',
  'developer.ui.webhooks.inspectResponse': 'Yanıt gövdesi',
  'developer.ui.webhooks.redeliver': 'Bu teslimatı tekrar gönder',
  'developer.ui.webhooks.redeliverHelp':
    'Aynı olay kimliği, yeniden dağıtım bayrağı ayarlandığında tekrar gönderilir, böylece bağımsız bir alıcı bunu güvenli bir şekilde yok sayar.',
  'developer.ui.webhooks.redelivered': 'Yeniden teslimat için sıraya alındı.',
  'developer.ui.webhooks.failureTitle': 'Bu uç nokta başarısız oluyor',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {Arka arkaya # teslimat başarısız oldu} other {Arka arkaya # teslimat başarısız oldu}}. {limit} ardışık hatadan sonra uç nokta devre dışı bırakılır ve bir eylem öğesi açılır.',
  'developer.ui.webhooks.disabledTitle':
    'Tekrarlanan hatalardan sonra bu uç nokta devre dışı bırakıldı',
  'developer.ui.webhooks.disabledBody':
    'Sıranız dolmasın diye gönderimi durdurduk. Alıcıyı onarın, bir test teslimatı gönderin ve ardından tekrar etkinleştirin.',
  'developer.ui.webhooks.lastSuccessLabel': 'Son başarı',
  'developer.ui.webhooks.lastSuccessNever': 'Hiçbir teslimat başarılı olamadı',
  'developer.ui.webhooks.deleteTitle': 'Bu uç noktayı sil',
  'developer.ui.webhooks.deleteConsequence.stop': "Bu URL'ye başka hiçbir şey gönderilmez.",
  'developer.ui.webhooks.deleteConsequence.logs':
    'Teslimat günlükleri denetim saklama süresi boyunca saklanır.',

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'One plan, two intervals. Polar is the merchant of record: it holds the payment method, issues invoices and handles cancellation.',
  'billing.ui.statusHeading': 'Current status',
  'billing.ui.planHeading': 'Plan',
  'billing.ui.intervalHeading': 'Billing interval',
  'billing.ui.usageHeading': 'Metered provider usage',
  'billing.ui.invoicesHeading': 'Invoices',
  'billing.ui.cancelHeading': 'Cancellation',
  'billing.ui.trialDaysRemaining':
    'Trial, {count, plural, =0 {ends today} one {# day remaining} other {# days remaining}}',
  'billing.ui.convertsOn': 'Converts on {date} to {amount} per {interval}.',
  'billing.ui.dueToday': '$0 due today',
  'billing.ui.conversionLabel': 'Converts',
  'billing.ui.channelsLabel': 'Active channels',
  'billing.ui.paymentMethodPolar': 'Payment method held by Polar',
  'billing.ui.paymentMethodDescriptor': '{project} ending {last4}, expires {expiry}',
  'billing.ui.paymentMethodMissing': 'No payment method on file yet',
  'billing.ui.cancelBeforeDate': 'Cancel before {date} and you will not be charged.',
  'billing.ui.annualFraming': '$25/month billed annually. Save $48/year.',
  'billing.ui.monthlyOption': '$29 per month',
  'billing.ui.annualOption': '$300 per year',
  'billing.ui.intervalChangeHelp':
    'Changing the interval takes effect at the next renewal. Polar prorates it and shows the exact amount before you confirm.',
  'billing.ui.intervalChangedAnnouncement': 'Billing interval set to {interval}.',
  'billing.ui.allowanceChannels':
    '30 active social channels. A channel is one connected account, page or channel.',
  'billing.ui.allowanceChannelsUsage': '{used} of {limit} active channels',
  'billing.ui.allowanceFairUse':
    'Fair use means anti spam, rate and provider cost controls. They apply the same way to every subscriber and are published, not discretionary.',
  'billing.ui.allowanceMetered':
    'X and some other providers charge per operation. Those charges are passed through at cost and are not part of the plan price.',
  'billing.ui.allowanceNoMedia':
    'Image generation and video generation are not included and are not sold. Relay does not generate media.',
  'billing.ui.readFairUse': 'Read the fair use policy',
  'billing.ui.readMeteredPolicy': 'Read how metered usage is billed',
  'billing.ui.usageCaption': 'Metered provider usage this period, billed at cost',
  'billing.ui.usageColumn.item': 'Item',
  'billing.ui.usageColumn.quantity': 'Quantity',
  'billing.ui.usageColumn.unitPrice': 'Unit price',
  'billing.ui.usageColumn.amount': 'Amount',
  'billing.ui.usageTotal': 'Total this period',
  'billing.ui.usagePeriod': 'Period {start} to {end}',
  'billing.ui.usageSource': 'Prices published by the provider. Verified {date}.',
  'billing.ui.usageReconciled': 'Reconciled against the provider invoice on {date}.',
  'billing.ui.usagePending': 'Not reconciled yet. The final amount can move slightly.',
  'billing.ui.usageUnavailableReason':
    'The provider has not returned usage for this period yet. It is normally available within 24 hours.',
  'billing.ui.usageEmpty': 'No metered usage this period.',
  'billing.ui.spendAlert': 'Spend alert',
  'billing.ui.spendAlertHelp':
    'We email you when metered usage passes this amount in a billing period.',
  'billing.ui.spendAlertPause': 'Also pause metered actions when the alert is reached',
  'billing.ui.balanceLabel': 'Usage balance',
  'billing.ui.balanceHelp': 'Metered usage is drawn from this balance and invoiced by Polar.',
  'billing.ui.invoicesCaption': 'Invoices issued by Polar',
  'billing.ui.invoiceColumn.date': 'Date',
  'billing.ui.invoiceColumn.description': 'Description',
  'billing.ui.invoiceColumn.amount': 'Amount',
  'billing.ui.invoiceColumn.state': 'State',
  'billing.ui.invoiceState.paid': 'Paid',
  'billing.ui.invoiceState.open': 'Open',
  'billing.ui.invoiceState.uncollectible': 'Not collected',
  'billing.ui.invoiceState.refunded': 'Refunded',
  'billing.ui.invoicesEmpty': 'No invoice yet. The first one is issued when the trial converts.',
  'billing.ui.invoicesInPortal': 'Every invoice and receipt is available in the Polar portal.',
  'billing.ui.portalHelp':
    'The portal is where you change the payment method, download invoices and cancel. It opens in a new tab.',
  'billing.ui.pastDueHeading': 'Payment overdue',
  'billing.ui.pastDueBody':
    'The last payment did not go through. Update the payment method in the Polar portal to keep publishing.',
  'billing.ui.gracePolicy':
    'Scheduled posts keep running until {date}. After that the workspace becomes read only: nothing is deleted and nothing is published.',
  'billing.ui.cancelBody':
    'Cancelling is one action and takes effect at the end of the period you have paid for. There is no call to make and no form to fill in.',
  'billing.ui.cancelStart': 'Cancel subscription',
  'billing.ui.cancelDialogTitle': 'Cancel this subscription',
  'billing.ui.cancelConsequence.noCharge':
    'You will not be charged. Nothing is taken today or on {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'You keep every feature until {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Drafts, receipts, media and analytics stay in this workspace.',
  'billing.ui.cancelConsequence.scheduled':
    'Posts scheduled after {date} will not publish. Cancel or reschedule them before then.',
  'billing.ui.cancelConsequence.restart': 'You can start the subscription again at any time.',
  'billing.ui.cancelConfirm': 'Cancel subscription',
  'billing.ui.cancelKeep': 'Keep subscription',
  'billing.ui.cancelConfirmedBeforeConversion': 'Canceled. You will not be charged.',
  'billing.ui.cancelConfirmedAfterConversion': 'Canceled. Access continues until {date}.',
  'billing.ui.cancelAnnouncement': 'Subscription canceled.',
  'billing.ui.canceledNotice': 'This subscription is canceled.',
  'billing.ui.resume': 'Start the subscription again',
  'billing.ui.noSubscriptionTitle': 'No subscription on this workspace',
  'billing.ui.noSubscriptionBody':
    'Start the seven day trial to publish. Polar collects a payment method and charges nothing today.',
  'billing.ui.noSubscriptionExample':
    'Monthly is $29. Annual is $300, which is $25/month billed annually. Save $48/year.',
  'billing.ui.overChannelLimitAction': 'Review connected channels',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'Kısa bir girişi yanıtlayın, anladığımızı onaylayın ve madde madde kabul edebileceğiniz bir plan alın. Çalışmayı teklif ediyor. Hiçbir zaman kendi başına hiçbir şey planlamaz veya yayınlamaz.',
  'growth.ui.step.intake': 'Giriş',
  'growth.ui.step.confirm': 'Onayla',
  'growth.ui.step.plan': 'Planı',
  'growth.ui.stepIndicator': 'Adım {current}/{total}: {name}',
  'growth.ui.intake.section.product': 'Ürün',
  'growth.ui.intake.section.audience': 'Hedef kitle ve pazarlar',
  'growth.ui.intake.section.objective': 'Amaç',
  'growth.ui.intake.section.capacity': 'Kanallar ve kapasite',
  'growth.ui.intake.section.limits': 'Sınır dışı olan nedir',
  'growth.ui.intake.help':
    'Burada sizin için tahmin edilen hiçbir şey yok. Boş bıraktığınız her şey doldurulmak yerine eksik olarak işaretlenir.',
  'growth.ui.intake.productNameHelp': 'Müşterilerle kullandığınız ad.',
  'growth.ui.intake.siteUrlHelp':
    'Bize kaynak olarak verdiğiniz sayfayı okuyoruz. Ondan aldığımız her gerçeği onaylıyorsunuz.',
  'growth.ui.intake.descriptionHelp': 'Kendi sözlerinizle ne sattığınız ve kimin için sattığınız.',
  'growth.ui.intake.marketsHelp': 'Ülkeler veya bölgeler. Her satıra bir tane.',
  'growth.ui.intake.localesHelp': 'Yayınlayacağınız diller.',
  'growth.ui.intake.objectiveHelp': 'Gelecek çeyrekte daha fazlasını istediğiniz şey.',
  'growth.ui.intake.conversionHelp':
    'Gerçekten ölçebileceğiniz eylem. Bir kayıt, bir demo, bir satın alma.',
  'growth.ui.intake.proofHelp':
    'Örnek olaylar, çalıştırdığınız kıyaslamalar, sahip olduğunuz ekran görüntüleri, halihazırda sahip olduğunuz izinler. Her satıra bir tane.',
  'growth.ui.intake.proofNone': 'Henüz onaylanmış bir kanıtım yok',
  'growth.ui.intake.proofNoneEffect':
    'Plan, müşteri sonuçlarından ve sonuç taleplerinden tamamen kaçınacaktır.',
  'growth.ui.intake.channelsHelp': 'Zaten yayınladığınız hesaplar.',
  'growth.ui.intake.capacityHelp': 'Dürüst ol. Yürütemeyeceğiniz bir plan, plan değildir.',
  'growth.ui.intake.competitorsHelp': 'İsteğe bağlı. Her satıra bir tane.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Yasal veya politik nedenlerle yapamayacağınız hak talepleri. Her satıra bir tane.',
  'growth.ui.intake.prohibitedTopicsHelp': 'Uzak durulması gereken konular. Her satıra bir tane.',
  'growth.ui.intake.submit': 'Ne anladığımızı gözden geçirin',
  'growth.ui.intake.savedAnnouncement': 'İşletme profili kaydedildi.',
  'growth.ui.intake.requiredMissing':
    'Devam etmeden önce gerekli olarak işaretlenen alanları doldurun.',

  'growth.ui.confirm.factsTitle': 'Doğruladığınız gerçekler',
  'growth.ui.confirm.factsHelp': 'Bunlar kopya halinde kullanılabilir.',
  'growth.ui.confirm.assumptionsTitle': 'Yaptığımız varsayımlar',
  'growth.ui.confirm.assumptionsHelp':
    'Bunlar gerçek değil. Planı şekillendiriyorlar ama asla bir paylaşımda iddia haline gelmiyorlar.',
  'growth.ui.confirm.missingTitle': 'Eksik',
  'growth.ui.confirm.missingHelp':
    'Plan bunların her biri etrafında çalışıyor ve önemli olduğu yerde bunu söylüyor.',
  'growth.ui.confirm.confidence.label': 'Güven: {level}',
  'growth.ui.confirm.confidence.low': 'düşük',
  'growth.ui.confirm.confidence.medium': 'orta',
  'growth.ui.confirm.confidence.high': 'yüksek',
  'growth.ui.confirm.promote': 'Gerçek olarak onaylayın',
  'growth.ui.confirm.correct': 'Bunu düzelt',
  'growth.ui.confirm.correctLabel': 'Düzeltmeniz',
  'growth.ui.confirm.generate': 'Planı oluştur',
  'growth.ui.confirm.announcement': 'İşletme profili onaylandı.',

  'growth.ui.plan.generatingBody':
    'Bu birkaç saniye sürer. Bu sayfadan ayrılabilirsiniz: plan kendi kendine tamamlanır.',
  'growth.ui.plan.stateDraft': 'Taslak, onaylanmadı',
  'growth.ui.plan.stateApproved': 'Onaylandı',
  'growth.ui.plan.stateSuperseded': 'Daha yeni bir sürümle değiştirildi',
  'growth.ui.plan.newVersionNotice':
    'Yenileme {version} sürümünü oluşturur ve onaylanan sürüme dokunulmaz.',
  'growth.ui.plan.emptyTitle': 'Henüz plan yok',
  'growth.ui.plan.emptyBody':
    'İşletme profilini doldurun, onayladığınız gerçeklerden bir plan oluşturalım.',
  'growth.ui.plan.emptyExample':
    'Bir plan bir strateji, dört haftalık özet, bir UGC kampanyası, katalog destekli fırsatlar ve en fazla beş araç içerir.',
  'growth.ui.plan.tabsLabel': 'Bölümleri planla',
  'growth.ui.plan.modelNote':
    '{model} tarafından oluşturuldu, {promptVersion} istemi, {date} tarihinde.',

  'growth.ui.strategy.snapshotTitle': 'İş anlık görüntüsü',
  'growth.ui.strategy.channelPriority': 'Öncelik {rank}',
  'growth.ui.strategy.channelFormats': 'Yerel formatlar',
  'growth.ui.strategy.pillarProof': 'Bu sütunun dayandığının kanıtı',
  'growth.ui.strategy.pillarProofNone': 'Onaylanmış kanıt yok. Bu sütunu açıklayıcı tutun.',
  'growth.ui.strategy.cadenceCaption': 'Kanala göre haftalık gönderiler',
  'growth.ui.strategy.cadenceColumn.channel': 'Kanal',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Haftalık gönderiler',
  'growth.ui.strategy.cadenceTotal': 'Haftalık toplam',
  'growth.ui.strategy.capacityWarning':
    'Bu sıklık, belirtilen {capacity} saat kapasiteye karşı haftada {planned} gönderidir. Profildeki sıklığı azaltın veya kapasiteyi artırın.',
  'growth.ui.strategy.measurementBody':
    'Aynı kanal ve formattaki kendi takip eden gönderilerinizle karşılaştırılmıştır. Hiçbiri sizin hesabınızla karşılaştırılamayacağı için harici bir kıyaslama kullanılmaz.',
  'growth.ui.strategy.localeAdaptations': 'Dil notları',

  'growth.ui.fourWeek.caption': 'Hafta ve güne göre önerilen özetler',
  'growth.ui.fourWeek.column.date': 'Tarih',
  'growth.ui.fourWeek.column.channel': 'Kanal',
  'growth.ui.fourWeek.column.pillar': 'Sütun',
  'growth.ui.fourWeek.column.format': 'Biçim',
  'growth.ui.fourWeek.column.brief': 'Kısa',
  'growth.ui.fourWeek.column.cta': 'Eylem çağrısı',
  'growth.ui.fourWeek.column.measurement': 'Ölçüm etiketi',
  'growth.ui.fourWeek.column.actions': 'Eylemler',
  'growth.ui.fourWeek.approvalRequired': 'Yayınlanabilmesi için onay gerekiyor',
  'growth.ui.fourWeek.approvalNotRequired': 'Bu hesap için onay gerekmiyor',
  'growth.ui.fourWeek.noCta': 'Eylem çağrısı yok',
  'growth.ui.fourWeek.weekEmpty': 'Bu hafta için herhangi bir brifing önerilmedi.',
  'growth.ui.fourWeek.acceptedCount': "Taslak olarak kabul edilen {total} brifingden {accepted}'i",
  'growth.ui.fourWeek.acceptAnnouncement': 'Taslak bu brifingden oluşturuldu.',
  'growth.ui.fourWeek.proposeAnnouncement': '{date} için takvim teklifi eklendi.',

  'growth.ui.ugc.promptAngle': 'Açı {number}',
  'growth.ui.ugc.checklistTitle': 'Haklar, onay ve bilgilendirme',
  'growth.ui.ugc.checklistHelp':
    'Herhangi bir şey yayınlanmadan önce bunu her katılımcıyla birlikte gözden geçirin. Görünmeye onay vermek, reklam yapmaya onay vermek anlamına gelmez.',
  'growth.ui.ugc.incentiveNone': 'Herhangi bir teşvik sunulmadı',
  'growth.ui.ugc.incentiveDisclosure':
    'Bir teşvik, sizin ve katılımcının, bundan doğan her gönderide belirtilmelidir.',
  'growth.ui.ugc.honesty':
    'Bu, gerçek kişilerle yürüttüğünüz bir kampanyayı planlar. Relay içerik üreticisi bulmaz, onlarla iletişime geçmez, referans yazmaz veya müşteri içeriği oluşturmaz.',

  'growth.ui.opportunities.caption':
    'Profilinize uygun olarak sıralanmış, katalogdan doğrulanmış fırsatlar',
  'growth.ui.opportunities.column.opportunity': 'Fırsat',
  'growth.ui.opportunities.column.type': 'Tür',
  'growth.ui.opportunities.column.audience': 'Seyirci',
  'growth.ui.opportunities.column.fit': 'Bu neden uyuyor',
  'growth.ui.opportunities.column.requirements': 'Gereksinimler',
  'growth.ui.opportunities.column.rules': 'Kendini tanıtma kuralları',
  'growth.ui.opportunities.column.cost': 'Maliyet',
  'growth.ui.opportunities.column.effort': 'Çaba',
  'growth.ui.opportunities.column.verified': 'Son doğrulandı',
  'growth.ui.opportunities.column.actions': 'Eylemler',
  'growth.ui.opportunities.costFree': 'Ücretsiz',
  'growth.ui.opportunities.effort.low': 'Düşük',
  'growth.ui.opportunities.effort.medium': 'Orta',
  'growth.ui.opportunities.effort.high': 'Yüksek',
  'growth.ui.opportunities.noRequiredAsset': 'Varlık gerekmez',
  'growth.ui.opportunities.prepareTitle': '{name} için bir sunum hazırlayın',
  'growth.ui.opportunities.prepareRules': 'Alıntılanan kuralları',
  'growth.ui.opportunities.prepareChecklist': 'Neler hazır olmalı',
  'growth.ui.opportunities.prepareManual':
    'Bunu kendi sitelerine kendiniz gönderiyorsunuz. Relay form doldurmaz, hesap oluşturmaz veya kimseye e-posta göndermez.',
  'growth.ui.opportunities.pitchTitle': 'Satış konuşması taslağı',
  'growth.ui.opportunities.pitchHelp':
    'Göndermeden önce düzenleyin. Yalnızca onayladığınız gerçekleri kullanır.',
  'growth.ui.opportunities.submittedOn': 'Gönderildi {date}',
  'growth.ui.opportunities.staleTitle': 'Bazı girişlerin yeniden doğrulanması gerekiyor',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# girişin inceleme tarihi geçmiştir} other {# girişin inceleme tarihi geçmiştir}}. Onlara güvenmeden önce sitedeki mevcut kuralları kontrol edin.',
  'growth.ui.opportunities.emptyExample':
    "Bir katalog satırı resmi URL'yi, hedef kitleyi, siteden alıntılanan gönderim kurallarını, maliyeti, çabayı ve kişinin onu en son kontrol ettiği tarihi taşır.",

  'growth.ui.tools.shown': '{shown} / {max} gösteriliyor',
  'growth.ui.tools.fewerThanMax':
    'Bu iş akışı güncel bir incelemeyle yalnızca {count, plural, one {# araç eşleşiyor} other {# araç eşleşiyor}}. Listeyi doldurmak yerine daha azını göstermeyi tercih ederiz.',
  'growth.ui.tools.emptyTitle': 'Henüz incelenen hiçbir araç bu iş akışına uymuyor',
  'growth.ui.tools.emptyBody':
    'Her girişin burada görünmeden önce kontrol edilmiş bir fiyata, kontrol edilmiş hak koşullarına ve adlandırılmış bir sınırlamaya ihtiyacı vardır.',
  'growth.ui.tools.emptyExample':
    "Bir giriş, bunun ne için en iyi olduğunu, neden planınıza uyduğunu, neyi yapamayacağını, ihtiyaç duyduğu becerileri, çıktının Relay'e nasıl geri döndüğünü ve fiyatın en son ne zaman kontrol edildiğini belirtir.",
  'growth.ui.tools.openSite': '{name} için resmi siteyi açın',
  'growth.ui.tools.stale': 'İnceleme tarihi geçmiş. Oluşturulan planlardan hariç tutuldu.',

  'growth.ui.item.explainTitle': 'Bu neden önerildi?',
  'growth.ui.item.explainEvidence': 'Neye dayanıyor',
  'growth.ui.item.explainNoEvidence':
    'Bu, işletmenizle ilgili doğrulanmış bir olgudan değil, amaçtan ve kanal kurallarından kaynaklanmaktadır.',
  'growth.ui.item.dismissTitle': 'Bu öneriyi reddet',
  'growth.ui.item.dismissBody':
    'Bize nedenini söyle. Sebep planla birlikte saklanır ve bir sonraki versiyonu şekillendirir.',
  'growth.ui.item.dismissReasonLabel': 'Sebep',
  'growth.ui.item.dismissReason.notRelevant': 'Bu işletmeyle alakalı değil',
  'growth.ui.item.dismissReason.noCapacity': 'Kapasitemiz yok',
  'growth.ui.item.dismissReason.wrongAudience': 'Yanlış hedef kitle',
  'growth.ui.item.dismissReason.alreadyDone': 'Bunu zaten yapıyoruz',
  'growth.ui.item.dismissReason.policy': 'Politikamıza veya iddialarımıza aykırı',
  'growth.ui.item.dismissReason.other': 'Başka bir şey',
  'growth.ui.item.dismissNote': 'Eklemek istedikleriniz',
  'growth.ui.item.dismissed': 'Görevden alındı. Geri alabilmeniz için görünür kalır.',
  'growth.ui.item.undoDismiss': 'Reddetmeyi geri al',

  'growth.ui.export.title': 'Bu planı dışa aktar',
  'growth.ui.export.formatLabel': 'Biçim',
  'growth.ui.export.copy': 'Panoya kopyala',
  'growth.ui.export.download': 'Dosyayı indir',
  'growth.ui.export.copied': 'Plan panoya kopyalandı.',
  'growth.ui.export.schemaNote':
    'Her üç format da doğrulanmış tek bir şema olan {version} sürümünden gelir. Yapılandırılmış görünümler kaynak kontrolü açısından güvenlidir ve sır içermez.',
  'growth.ui.export.previewLabel': 'Önizlemeyi dışa aktar',
} as const;
