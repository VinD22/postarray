/**
 * The web application shell: Home, the command palette, the Action center
 * queue chrome, the demo data notice, and the parts of sign in and onboarding
 * that the shared `auth`, `onboarding` and `billing` catalogs do not cover.
 *
 * Owned by the web shell. Screen catalogs (composer, calendar, analytics)
 * belong to their own files.
 */
export const webShellMessages = {
  /* -- Document and shell chrome ----------------------------------------- */
  'shell.appName': 'Röle',
  'shell.documentTitle': '{page} · Röle',
  'shell.tagline': 'İnsanlar ve temsilciler için bir yayın masası.',
  'shell.menu.open': 'Menüyü aç',
  'shell.menu.title': 'Menü',
  'shell.nav.more': 'Daha Fazla',
  'shell.help.title': 'Yardım',
  'shell.help.documentation': 'Dokümantasyon',
  'shell.help.keyboardShortcuts': 'Klavye kısayolları',
  'shell.help.platformStatus': 'Platform durumu',
  'shell.help.whatChanged': 'Ne değişti',
  'shell.help.contactSupport': 'Desteğe başvurun',
  'shell.account.settings': 'Ayarlar',
  'shell.account.profile': 'Profiliniz',
  'shell.workspace.create': 'Bir çalışma alanı oluşturun',
  'shell.workspace.manage': 'Çalışma alanı ayarları',
  'shell.workspace.role': 'Burada {role} rolündesiniz',
  'shell.brand.filterHint': 'Ana Sayfa, Takvim ve Analytics bu markaya göre filtreleniyor.',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Demo verileri',
  'shell.demo.title': 'Demo verilerine bakıyorsunuz',
  'shell.demo.body':
    "Relay API'ye bu tarayıcıdan erişilemediği için ekranlar, yerleşik bir örnek çalışma alanıyla doldurulur. Buradaki hiçbir şey gerçek bir hesaba bağlı değildir ve hiçbir şey yayınlanamaz.",
  'shell.demo.howToConnect':
    "NEXT_PUBLIC_RELAY_API_URL'yi ayarlayın ve canlı verileri kullanmak için uygulamayı yeniden başlatın.",

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Çevrimdışısınız',
  'shell.offline.body':
    'Taslaklar bu cihazda tutulur. Bağlantı geri döndüğünde planlama ve yayınlama devam eder.',
  'shell.offline.retry': 'Bağlantıyı kontrol edin',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Komut paletini açın',
  'palette.title': 'Komut paleti',
  'palette.description': 'Bir ekran, hesap veya eylem arayın.',
  'palette.placeholder': 'Bir komut veya ekran adı yazın',
  'palette.empty': 'Hiçbir şey {query} ile eşleşmiyor.',
  'palette.group.actions': 'Eylemler',
  'palette.group.goTo': 'Git',
  'palette.group.workspaces': 'Çalışma alanları',
  'palette.group.settings': 'Ayarlar',
  'palette.hint.navigate': 'Ok tuşlarıyla hareket edin',
  'palette.hint.select': 'Enter ile aç',
  'palette.hint.close': 'Kaçış ile kapat',
  'palette.action.compose': 'Gönderi oluştur',
  'palette.action.connectAccount': 'Bir hesap bağlayın',
  'palette.action.openActionCenter': 'Eylem merkezini açın',
  'palette.action.uploadMedia': 'Medya yükle',
  'palette.action.createRule': 'Otomasyon kuralı oluşturma',
  'palette.action.toggleTheme': 'Temayı değiştir',
  'palette.action.signOut': 'Oturumu kapat',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Eylem merkezini açın',
  'actionCenter.group.now.label': 'Şimdi',
  'actionCenter.group.soon.label': 'yakında',
  'actionCenter.group.watching.label': 'izliyorum',
  'actionCenter.group.now.hint': 'Bunlar halledilene kadar yayıncılık risk altındadır.',
  'actionCenter.group.soon.hint': 'Bunların hala karşılayabileceğiniz bir son tarihi var.',
  'actionCenter.group.watching.hint': 'Acil değil. Bu hafta göz atmaya değer.',
  'actionCenter.severity.now': 'şimdi sana ihtiyacı var',
  'actionCenter.severity.soon': 'yakında sana ihtiyacı var',
  'actionCenter.severity.watching': 'izliyorum',
  'actionCenter.filter.all': 'Hepsi',
  'actionCenter.filter.connections': 'Bağlantılar',
  'actionCenter.filter.publishing': 'Yayınlama',
  'actionCenter.filter.automation': 'Otomasyon',
  'actionCenter.filter.billing': 'Billing',
  'actionCenter.snoozed': 'Ertelendi',
  'actionCenter.snoozeOneDay': 'Bir gün ertele',
  'actionCenter.snoozedUntil': "{date}'a kadar ertelendi",
  'actionCenter.unsnooze': 'Bunu geri getir',
  'actionCenter.resolved': 'Çözüldü {relativeTime}',
  'actionCenter.emptyFiltered': 'Bu gruptaki hiçbir şeyin ilgiye ihtiyacı yok.',
  'actionCenter.errorTitle': 'Eylem merkezi yüklenemedi',
  'actionCenter.loading': 'Dikkat edilmesi gerekenler yükleniyor',
  'actionCenter.affectedAccount': 'Etkiler {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Hiçbir şeye dikkat edilmesi gerekmez} one {# öğe} other {# öğe}}',
  'actionCenter.action.reconnect': 'Yeniden bağlan',
  'actionCenter.action.openReceipt': 'Makbuzu aç',
  'actionCenter.action.review': 'İncele',
  'actionCenter.action.openDraft': 'Taslağı aç',
  'actionCenter.action.openCalendar': 'Takvimi aç',
  'actionCenter.action.viewStatus': 'Durumu görüntüle',
  'actionCenter.action.checkFeed': 'Beslemeyi kontrol edin',
  'actionCenter.action.inspectDeliveries': 'Teslimatları inceleyin',
  'actionCenter.action.addBalance': 'Kullanımı inceleyin',
  'actionCenter.action.fixConnection': 'Bağlantıyı düzeltin',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Ana Sayfa',
  'home.subtitle': 'Bugün size neyin ihtiyacı var ve bundan sonra ne olacak?',
  'home.greetingSummary':
    '{actions, plural, =0 {Şu anda hiçbir şeyin size ihtiyacı yok} one {# öğenin size ihtiyacı var} other {# öğenin size ihtiyacı var}}. {upcoming, plural, =0 {Önümüzdeki 24 saat içinde hiçbir şey planlanmadı} one {# gönderi önümüzdeki 24 saat içinde yayınlanacak} other {# gönderi önümüzdeki 24 saat içinde yayınlanacak}}.',
  'home.needsYou.title': 'şimdi sana ihtiyacı var',
  'home.needsYou.empty': 'Şu anda hiçbir şeyin sana ihtiyacı yok.',
  'home.needsYou.emptyBody':
    'Bağlantı durumu, onaylar ve başarısız yayınlamalar gerçekleştiği anda burada görünür.',
  'home.needsYou.viewAll': 'Eylem merkezini açın',
  'home.needsYou.emptyQuiet':
    'Sessizliğin tadını çıkarın. Karar verilmesi gereken her şey, gerçekleştiği anda burada ortaya çıkar.',
  'home.upcoming.title': 'Sonraki 24 saat',
  'home.upcoming.empty': 'Önümüzdeki 24 saat içinde hiçbir şey planlanmadı.',
  'home.upcoming.emptyBody':
    'Bir gönderi yazın ve bir zaman seçin. Daha sonra değiştirebilirsiniz.',
  'home.upcoming.viewAll': 'Takvimi aç',
  'home.upcoming.timeZoneNote': 'Zamanlar çalışma alanı bölgesi olan {timeZone} ile gösterilir.',
  'home.upcoming.columnTime': 'Zaman',
  'home.upcoming.columnAccount': 'Hesap',
  'home.upcoming.columnContent': 'İçerik',
  'home.upcoming.columnStatus': 'Durum',
  'home.receipts.title': 'Son makbuzlar',
  'home.receipts.empty': 'Bu çalışma alanından henüz yayınlanmadı.',
  'home.receipts.emptyBody': 'Her yayın, inceleyip paylaşabileceğiniz bir makbuz üretir.',
  'home.receipts.viewAll': 'Tüm makbuzlar',
  'home.receipts.publishedTo': '{account}’da yayınlandı',
  'home.connections.title': 'Bağlantı durumu',
  'home.connections.summary':
    '{healthy, plural, one {# hesap çalışıyor} other {# hesap çalışıyor}}. {attention, plural, =0 {Hiçbirinin ilgiye ihtiyacı yok} one {# ilgiye ihtiyaç duyuyor} other {# ilgiye ihtiyaç duyuyor}}.',
  'home.connections.viewAll': 'Tüm bağlantılar',
  'home.connections.empty': 'Henüz bağlı hesap yok.',
  'home.advisor.title': 'Büyüme danışmanı',
  'home.advisor.summary':
    "Planın {version} sürümü {date} onaylandı. {total}'ün {week}. haftasında {briefs, plural, one {# özet henüz hazırlanmadı} other {# özet henüz hazırlanmadı}}.",
  'home.advisor.noPlan':
    'Danışman, onayladığınız gerçeklerden bir plan oluşturur. Çalışma önerir ve asla kendi başına yayınlamaz.',
  'home.advisor.openPlan': 'Planı aç',
  'home.advisor.createDrafts': '{week}. haftadan itibaren taslaklar oluşturun',
  'home.advisor.start': 'İşletme profilini başlatın',
  'home.trial.banner':
    'Trial, {days, plural, =0 {ends today} one {# day left} other {# days left}}. Converts {date} to {amount}.',
  'home.trial.manage': 'Manage or cancel',
  'home.error.title': 'Ev yüklenemedi',
  'home.error.body': "Çalışma alanınız sağlam. Bu, Aktarma API'sine ulaşmada bir sorundur.",

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title': "Resmi API'ler aracılığıyla yayınlayın ve tam olarak ne olduğunu görün.",
  'auth.aside.point.receipts':
    'Her yayın bir makbuz üretir: Kimin onayladığı, ne zaman gönderildiği, platformun ne getirdiği.',
  'auth.aside.point.approvals':
    'Politikanızın gerektirdiği onay olmadan hiçbir şey platforma ulaşmaz.',
  'auth.aside.point.surfaces':
    'Web uygulaması, REST API, MCP, CLI ve web kancalarından aynı iş akışı.',
  'auth.provider.title': 'Devam etmeden önce',
  'auth.provider.google.access':
    "Google adınızı, e-posta adresinizi ve profil resminizi Relay ile paylaşır. Geçiş Gmail'inizi, Drive'ınızı veya Takviminizi okuyamıyor.",
  'auth.provider.facebook.access':
    'Facebook adınızı, e-posta adresinizi ve profil resminizi Relay ile paylaşır. Yayınlanacak bir Sayfayı bağlamak, daha sonra onaylayacağınız ayrı bir adımdır.',
  'auth.provider.note': 'Bu oturum açmanızı sağlar. Yayınlanacak bir hesaba bağlanmaz.',
  'auth.continueWithEmail': 'E-postayla devam et',
  'auth.method.password': 'Şifre',
  'auth.method.magicLink': 'E-posta bağlantısı',
  'auth.method.username': 'Kullanıcı adı',
  'auth.method.chooseLabel': 'Nasıl oturum açmak istiyorsunuz?',
  'auth.username.placeholder': 'kullanıcı adınız',
  'auth.username.aliasNote':
    'Kullanıcı adı, hesabınızdaki e-posta adresinin takma adıdır. Şifre aynı.',
  'auth.password.placeholder': 'Şifreniz',
  'auth.submit.signIn': 'Oturum aç',
  'auth.submit.signUp': 'Hesap oluştur',
  'auth.submit.working': 'Kontrol ediliyor',
  'auth.failure.credentials':
    'Bu e-posta adresi ve şifre bir hesapla eşleşmiyor. Her ikisini de kontrol edip tekrar deneyin.',
  'auth.failure.usernameCredentials':
    'Bu kullanıcı adı ve şifre bir hesapla eşleşmiyor. Her ikisini de kontrol edip tekrar deneyin.',
  'auth.failure.noAccountLeak':
    'Güvenliğiniz için bir adresin kayıtlı olup olmadığını söylemiyoruz.',
  'auth.failure.provider': '{provider} ile oturum açma işlemi tamamlanmadı. Hiçbir şey değişmedi.',
  'auth.failure.network': "Relay'e ulaşamadık. Bağlantınızı kontrol edip tekrar deneyin.",
  'auth.signUp.trialNote':
    'Yedi tam deneme günü. Bir ödeme yöntemi gereklidir. Bugün ödenmesi gereken 0$.',
  'auth.signUp.emailInUseNote':
    'Bu adresin zaten bir hesabı varsa ikinci bir oturum açma bağlantısı oluşturmak yerine e-postayla bir oturum açma bağlantısı göndeririz.',
  'auth.legal.readTerms': 'Şartları Okuyun',
  'auth.legal.readPrivacy': 'Gizlilik Bildirimini Okuyun',
  'auth.switchToSignUp': 'Hesap oluştur',
  'auth.switchToSignIn': 'Bunun yerine oturum açın',
  'auth.checkEmail.body': '{email} adresine bir oturum açma bağlantısı gönderdik. Bir kez çalışır.',
  'auth.checkEmail.wrongAddress': 'Farklı bir adres kullan',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Faturalandırma',
  'onboarding.stepName.workspace': 'Çalışma alanı',
  'onboarding.stepName.role': 'Kullanım örneği',
  'onboarding.stepName.connect': 'Bağlan',
  'onboarding.stepName.compose': 'İlk gönderi',
  'onboarding.stepName.receipt': 'Onay',
  'onboarding.stepList': 'Kurulum adımları',
  'onboarding.stepComplete': 'Bitti',
  'onboarding.stepCurrent': 'Geçerli adım',
  'onboarding.exit': 'Daha sonra bitir',
  'onboarding.plan.intervalMonthlyLabel': 'Aylık 29$',
  'onboarding.plan.intervalAnnualLabel': 'Yıllık 300$',
  'onboarding.plan.checkoutHint':
    "Bir sonraki ekran kayıtlı satıcımız Polar'dır. Erişim, tarayıcı geri geldiğinde değil, Polar aboneliği onayladığında verilir.",
  'onboarding.plan.factsTitle': 'Devam ettiğinizde ne olur?',
  'onboarding.workspace.help':
    'Bir çalışma alanı markalarınızı, bağlı hesaplarınızı, taslaklarınızı ve makbuzlarınızı barındırır. Daha sonra daha fazlasını oluşturabilirsiniz.',
  'onboarding.workspace.localeNote':
    'Arayüz diliniz bu uygulamayı değiştiriyor. İçerik dilleri gönderi başına seçilir ve bu ayardan ayrıdır.',
  'onboarding.workspace.timeZoneDetected': 'Bu cihazdan algılandı: {timeZone}',
  'onboarding.connect.permissionsTitle': '{provider} ne istenecek?',
  'onboarding.connect.permissionsFooter':
    'Relay asla kullanmadığı bir izin istemez ve istediğiniz zaman bağlantıyı kesebilirsiniz.',
  'onboarding.connect.chooseProvider': 'Bir platform seçin',
  'onboarding.connect.opensProvider': 'Devam bu sekmede {provider} öğesini açar.',
  'onboarding.compose.help':
    'Gönderiyi yazın, ardından bir zaman seçmeden önce önizlemeyi ve doğrulamayı kontrol edin.',
  'onboarding.compose.openComposer': 'Bestecinin tamamını aç',
  'onboarding.receipt.title': 'İlk gönderiniz planlandı',
  'onboarding.receipt.body':
    'Şu ana kadarki rekor burada. Gönderim, sağlayıcı yanıtı ve ilk analiz senkronizasyonu yoluyla güncellenmeye devam eder.',
  'onboarding.receipt.goHome': 'Ana Sayfaya Git',
  'onboarding.blocked.title': 'Bu adımın bir öncekine ihtiyacı var',
  'onboarding.blocked.body': "Önce {step}'ı bitirin. Girdiğiniz hiçbir şey kaybolmaz.",
} as const;
