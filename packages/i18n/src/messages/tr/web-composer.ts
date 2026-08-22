/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
  'composerWeb.pane.targets': 'Hesapları ve Setleri hedefleyin',
  'composerWeb.pane.master': 'Ana taslak ve paylaşılan ayarlar',
  'composerWeb.pane.variant': 'Açık hedef için sürüm',
  'composerWeb.pane.review': 'Önizleme, doğrulama, maliyet ve onay',
  'composerWeb.pane.showPreview': 'Önizlemeyi göster',
  'composerWeb.pane.hidePreview': 'Önizlemeyi gizle',
  'composerWeb.pane.previewCollapsed':
    'Önizleme paneli gizlidir. Son gönderiyi kontrol etmek için açın.',

  'composerWeb.step.targets': 'Hedefler',
  'composerWeb.step.write': 'Yaz',
  'composerWeb.step.perTarget': 'Hedef başına',
  'composerWeb.step.review': 'İncele',
  'composerWeb.step.progress': 'Adım {current} / {total}',
  'composerWeb.step.legend': 'Besteci adımları',

  'composerWeb.summary.label': 'Taslak özeti',
  'composerWeb.summary.targets': '{count, plural, =0 {Hedef yok} one {# hedef} other {# hedef}}',
  'composerWeb.summary.issues': '{count, plural, =0 {Sorun yok} one {# sayı} other {# sayı}}',
  'composerWeb.summary.notScheduled': 'Zaman seçilmedi',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Maliyet henüz fiyatlandırılmadı',
  'composerWeb.summary.openReview': 'İncelemeyi aç',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Ana taslak',
  'composerWeb.rail.masterHint': 'Hala devralan her hedefe ulaşmak için burayı düzenleyin.',
  'composerWeb.rail.accountsHeading': 'Hesapları hedefleyin',
  'composerWeb.rail.setsHeading': 'Setler ve gruplar',
  'composerWeb.rail.setsHelp':
    'Bir Küme, kaydedilmiş bir hesaplar ve varsayılanlar grubudur. Birini uygulamak, değerlerini bu taslağa kopyalar. Sette daha sonra yapılan düzenlemeler bu taslağı değiştirmez.',
  'composerWeb.rail.openTarget': '{account} sürümünü açın',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Sınır bilinmiyor',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {medya yok} one {# medya dosyası} other {# medya dosyası}}',
  'composerWeb.rail.paused': 'Duraklatıldı. Siz devam ettirene kadar yayınlanmayacaktır.',
  'composerWeb.rail.state.notBuilt': 'Henüz inşa edilmedi',
  'composerWeb.rail.state.unsupported': 'Sağlayıcı desteklemiyor',
  'composerWeb.rail.empty': 'Henüz hesap seçilmedi.',
  'composerWeb.rail.emptyHelp':
    'Bu gönderinin ulaşacağı hesapları seçin. Daha sonra daha fazlasını ekleyebilirsiniz.',
  'composerWeb.rail.divergenceHint':
    'Kendi versiyonunu görmek için bir hedef açın. Ana taslakta değişiklik yok.',
  'composerWeb.rail.searchLabel': 'Hesapları filtrele',
  'composerWeb.rail.removeTarget': "{account}'ı kaldırın",

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Genel düzenleme',
  'composerWeb.globalEdit.title': 'Bu değişikliği seçilen her hedefe uygula',
  'composerWeb.globalEdit.description':
    'Ana taslak her zaman değişir. Hala bu alanı miras alan hedefler onu takip ediyor. Kendi versiyonlarına sahip hedefler onu korur.',
  'composerWeb.globalEdit.fieldLabel': 'Alan',
  'composerWeb.globalEdit.compatibleHeading': 'Bu hedefler değişimi alıyor',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Bu hedefler kendi versiyonlarını korur',
  'composerWeb.globalEdit.incompatibleHeading': 'Bu hedefler değişimi kaldıramaz',
  'composerWeb.globalEdit.incompatibleHelp':
    'Sana söylemeden hiçbir şey bırakılmaz. Aşağıdaki her hesap, değişikliğin uyarlandığı açık bir sürüme sahip olur ve bunu daha sonra düzenleyebilirsiniz.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} {limit} karakterlere izin verir. Bu metin {actual}’dir.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} bu alanda bağlantı kabul etmez. Bağlantı ana taslakta ve ona izin veren hedeflerde kalır.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} kabul edilir: {limit, plural, one {# dosya} other {# dosya}}. Bu taslakta {actual} var.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported':
    '{account} {mimeType} dosyalarını kabul etmez.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} takip öğelerini desteklemediğinden sıra ana taslakta kalır.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} düz metin yayınlar. Biçimlendirme işaretleri karakter olarak görünecektir.',
  'composerWeb.globalEdit.adaptedPreview': 'Bunun yerine {account} ne alır?',
  'composerWeb.globalEdit.confirm': 'Sürümleri uygulama ve oluşturma',
  'composerWeb.globalEdit.nothingToApply':
    'Hiçbir şey değişmiyor. Ana taslakta zaten bu değer var.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Değişiklik # hedefe uygulandı} other {Değişiklik # hedefe uygulandı}}. {adapted, plural, =0 {Hiçbir hedefin uyarlanmış bir sürüme ihtiyacı yok} one {# hedefin uyarlanmış bir sürümü var} other {# hedefin uyarlanmış bir sürümü var}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'Bu hedefin kendi versiyonu var',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# alan ana taslaktan farklı} other {# alan ana taslaktan farklı}}',
  'composerWeb.override.field.body': 'Mesaj metni',
  'composerWeb.override.field.contentKind': 'Gönderi türü',
  'composerWeb.override.field.locale': 'İçerik dili',
  'composerWeb.override.field.mediaIds': 'Medya',
  'composerWeb.override.field.links': 'Bağlantılar',
  'composerWeb.override.field.signature': 'İmza',
  'composerWeb.override.field.threadItems': 'Yorumlar ve konu',
  'composerWeb.override.field.schedule': 'Program',
  'composerWeb.override.resetField': "{field}'yi ana programa sıfırlayın",
  'composerWeb.override.resetFieldTitle': '{field} {account} için sıfırlansın mı?',
  'composerWeb.override.resetFieldBody':
    "{field}'ın {account} için yazılan versiyonu atılır ve ana taslak yeniden kullanılır. Başka hedef değişikliği yok.",
  'composerWeb.override.resetAll': 'Her alanı uzmanlaşmak için sıfırlayın',
  'composerWeb.override.inheritNotice':
    "Bu hedef ana taslağı takip ediyor. Burada herhangi bir şeyin düzenlenmesi yalnızca {account}'ın alacağı bir sürüm oluşturur.",
  'composerWeb.override.created': '{account} artık kendi {field} değerine sahip.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': '{account} için limitler',
  'composerWeb.limits.text': '{limit} karaktere kadar metin',
  'composerWeb.limits.linkCost':
    'Bir bağlantının uzunluğu ne olursa olsun {count, plural, one {# karakter} other {# karakter}} olarak sayılır.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Görüntü yok} one {# görüntü} other {# görüntüye kadar}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {Video yok} one {# video} other {# videoya kadar}}',
  'composerWeb.limits.duration': "{duration}'a kadar video",
  'composerWeb.limits.aspect': '{min} ve {max} arasındaki en boy oranı',
  'composerWeb.limits.fileSize': "{size}'a kadar dosyalar",
  'composerWeb.limits.mimeTypes': 'Kabul edilen dosya türleri: {types}',
  'composerWeb.limits.source': "Yetenek anlık görüntüsü {version}'den {relativeTime}'i okuyun.",
  'composerWeb.limits.thumbnailRequired': 'Küçük resim gerekli.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider} ayarlar',
  'composerWeb.native.privacy': 'Who can see this',
  'composerWeb.native.privacyChoose': 'Bir hedef kitle seçin',
  'composerWeb.native.privacyExplicit':
    '{provider} önceden seçilmiş bir izleyici kitlesine izin vermez. Bu planlanmadan önce birini seçin.',
  'composerWeb.native.community': 'Topluluk',
  'composerWeb.native.board': 'Yönetim Kurulu',
  'composerWeb.native.group': 'Grup veya Sayfa',
  'composerWeb.native.organization': 'Organizasyon',
  'composerWeb.native.channel': 'Kanal',
  'composerWeb.native.publication': 'Yayın',
  'composerWeb.native.disclosureHeading': 'Açıklama',
  'composerWeb.native.disclosureCommercial': 'Bu gönderi bir ürün veya hizmeti tanıtıyor',
  'composerWeb.native.disclosureBranded': 'Bu gönderi başka bir şirketin markalı içeriğidir',
  'composerWeb.native.disclosureAi': 'Bu içeriğin bir kısmı bir yapay zeka aracıyla oluşturuldu',
  'composerWeb.native.disclosureUnsupported':
    "{provider} bu açıklamayı kendi API'si aracılığıyla sunmamaktadır. Bunun yerine metne ekleyin.",
  'composerWeb.native.none': 'Bu gönderi türüne hiçbir {provider} ayarı uygulanmaz.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': '{provider} tarihinde çözüldü',
  'composerWeb.entity.resolvedId': 'Hesap Kimliği {externalId}',
  'composerWeb.entity.plainTextWarning':
    "Eşleşmedi. {provider}'da yerel etiket olmayan düz metin olarak yayınlanacaktır.",
  'composerWeb.entity.removeMention': '{label} ifadesini kaldırın',
  'composerWeb.entity.addMention': 'Bahsetme ekle',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Bahsetme yok} one {# bahsetme} other {# bahsetme}}, {resolved} gerçek bir hesapla eşleşti',
  'composerWeb.entity.lookupUnsupported': '{provider} bu hesap türü için varlık araması sunmaz.',
  'composerWeb.entity.lookupNotBuilt':
    'Röle henüz {provider} için varlık araması oluşturmadı. Bu arada hiçbir şey tahmin edilmiyor.',
  'composerWeb.entity.searchHint': 'En az iki karakter yazın ve ardından bir sonuç seçin.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {Eşleşme yok} one {# eşleşme} other {# eşleşme}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Bağlantılar',
  'composerWeb.links.detected':
    '{count, plural, one {Bu taslakta # bağlantı bulundu} other {Bu taslakta # bağlantı bulundu}}',
  'composerWeb.links.noneDetected': 'Bu taslakta henüz bağlantı yok.',
  'composerWeb.links.modeLabel': 'Bu bağlantı nasıl yayınlanır?',
  'composerWeb.links.original': 'Orijinal URL',
  'composerWeb.links.utmSource': 'Kaynak',
  'composerWeb.links.utmMedium': 'Orta',
  'composerWeb.links.utmCampaign': 'Kampanya',
  'composerWeb.links.utmTerm': 'Dönem',
  'composerWeb.links.utmContent': 'İçerik',
  'composerWeb.links.domainVerified': '{domain}, bu çalışma alanı için doğrulandı',
  'composerWeb.links.domainDefault': 'Geçiş varsayılan alanı',
  'composerWeb.links.domainNone': 'Henüz hiçbir markalı alan adı doğrulanmadı.',
  'composerWeb.links.notAllowedHere': '{account} burada bağlantıya izin vermiyor.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Yorum',
  'composerWeb.sequence.kindThread': 'Konu parçası',
  'composerWeb.sequence.kindLabel': 'Öğe türü',
  'composerWeb.sequence.moveUp': 'Bu öğeyi daha erken taşı',
  'composerWeb.sequence.moveDown': 'Bu öğeyi daha sonra taşı',
  'composerWeb.sequence.remove': 'Bu öğeyi kaldır',
  'composerWeb.sequence.absoluteTime': "{utc} UTC olan {time}'da çalışır.",
  'composerWeb.sequence.partialFailure':
    'Bir öğe başarısız olursa, halihazırda yayınlanmış olan gönderi yayınlanmış olarak kalır ve ondan sonraki öğeler çalıştırılmaz. Bir eylem öğesi alırsınız.',
  'composerWeb.sequence.maxReached':
    '{account} kabul edilir {limit, plural, one {# takip öğesi} other {# takip öğesi}}.',
  'composerWeb.sequence.minDelay':
    "Burada {provider}'ın izin verdiği en kısa gecikme {duration}'dir.",
  'composerWeb.sequence.inheritAuthor': 'Gönderiyle aynı hesap',
  'composerWeb.sequence.itemIssues':
    'Bu öğede {count, plural, =0 {Sorun yok} one {# sayı} other {# sayı}}',
  'composerWeb.sequence.customMinutes': 'Önceki öğeden dakikalar sonra',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Bu yazıyı tekrarla',
  'composerWeb.repeat.cadenceLabel': 'Ne sıklıkta',
  'composerWeb.repeat.maximum': 'Tekrarlanan bir gönderi en fazla {limit} kez yayınlanabilir.',
  'composerWeb.repeat.occurrenceLabel': 'Gönderi sayısı',
  'composerWeb.repeat.duplicateCheck':
    'Her oluşum, yayınlanmadan önce yinelenen içerik açısından kontrol edilir. Denetimde başarısız olan bir olay, yayınlamak yerine bir eylem öğesi haline gelir.',
  'composerWeb.repeat.occurrenceList': 'İlk oluşumlar',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {ve # tekrar daha} other {ve # tekrar daha}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Setler ve imza',
  'composerWeb.set.pickerTitle': 'Bir Setten Başlayın',
  'composerWeb.set.pickerDescription':
    'Bir Set hedefleri, metni ve ayarları doldurur. Oluşturduğu taslak bağımsızdır, dolayısıyla Seti daha sonra düzenlemek, onaylanmış veya planlanmış bir gönderiyi asla değiştirmez.',
  'composerWeb.set.accountCount': '{count, plural, one {# hesap} other {# hesap}}',
  'composerWeb.set.apply': 'Bu Seti Kullan',
  'composerWeb.set.none': 'Henüz hiçbir Set kaydedilmedi.',
  'composerWeb.signature.pickerLabel': 'İmza',
  'composerWeb.signature.scope': "{language}'de {provider}'de {project} için",
  'composerWeb.signature.previewHeading': 'Gönderi nasıl bitiyor',
  'composerWeb.signature.notMatching':
    'Bu imza farklı bir proje, platform veya dile yönelik olduğundan burada sunulmamaktadır.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Bu metinle ilgili yardım',
  'composerWeb.assist.unavailableTitle': 'Metin yardımı yapılandırılmadı',
  'composerWeb.assist.unavailableBody':
    'Bu çalışma alanı için herhangi bir AI ağ geçidi kurulmadığından destek eylemleri kapalıdır. Bestecideki diğer her şey normal şekilde çalışıyor.',
  'composerWeb.assist.targetLabel': 'Şunlar için geçerlidir:',
  'composerWeb.assist.targetMaster': 'Ana taslak',
  'composerWeb.assist.targetVariant': '{account} sürümü',
  'composerWeb.assist.beforeLabel': 'Geçerli metin',
  'composerWeb.assist.afterLabel': 'Önerilen metin',
  'composerWeb.assist.regionLabel': 'Önerilen metin değişikliği henüz uygulanmadı',
  'composerWeb.assist.added': 'eklendi',
  'composerWeb.assist.removed': 'kaldırıldı',
  'composerWeb.assist.evidence': 'Kanıt ve kaynaklar',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Bu iddiaya ilişkin kaynak bulunamadı. Yayınlamadan önce kontrol edin.',
  'composerWeb.assist.failed': 'Yardım isteği tamamlanmadı. Metniniz değişmedi.',
  'composerWeb.assist.noMediaGeneration':
    'Röle resim veya video oluşturmaz. Bitmiş dosyaları kütüphaneye getirin ve burada yayınlayın.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'Bu onaylanmış versiyondur. Düzenlemek yeni bir sürüm oluşturur ve onayı temizler.',
  'composerWeb.autosave.pinnedAcknowledge': 'Onayı düzenleyin ve temizleyin',
  'composerWeb.autosave.conflictTitle': 'Bu taslağın iki versiyonu',
  'composerWeb.autosave.conflictKeepMine': 'Yazdıklarımı sakla',
  'composerWeb.autosave.conflictKeepTheirs': '{name} ve sonraki sürümü kullanın',
  'composerWeb.autosave.conflictHelp':
    'Hiçbir şey otomatik olarak birleştirilmez. Her alana göre seçim yapın ve ardından kaydedin.',
  'composerWeb.autosave.retry': 'Tekrar kaydetmeyi deneyin',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Besteci kısayolları',
  'composerWeb.shortcuts.nextTarget': 'Sonraki hedef',
  'composerWeb.shortcuts.previousTarget': 'Önceki hedef',
  'composerWeb.shortcuts.nextIssue': 'Sonraki sayı',
  'composerWeb.shortcuts.previousIssue': 'Önceki sayı',
  'composerWeb.shortcuts.save': 'Taslağı şimdi kaydet',
  'composerWeb.shortcuts.openSchedule': 'Zamanlama sayfasını aç',
  'composerWeb.shortcuts.open': 'Kısayolları göster',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'İncele',
  'composerWeb.review.contentVersion': 'İçerik sürümü {checksum}',
  'composerWeb.review.approvalPolicy': 'Politika: {policy}',
  'composerWeb.review.approverPending': "{approver}'dan gelecek kararı bekliyorum.",
  'composerWeb.review.approverNone': 'Bu hedefler için herhangi bir onaya gerek yoktur.',
  'composerWeb.review.perTargetHeading': 'Her hesabın aldığı şey',
  'composerWeb.review.finalUrl': 'Yayınlanan bağlantı',
  'composerWeb.review.privacyState': 'Seyirci: {value}',
  'composerWeb.review.disclosureState': 'Açıklama: {value}',
  'composerWeb.review.disclosureNone': 'Açıklama seti yok',
  'composerWeb.review.mediaVersion': '{name}, sürüm {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# hedef henüz planlanamıyor} other {# hedef henüz planlanamıyor}}',
  'composerWeb.review.offlineBlocked':
    'Planlama ve yayınlamanın bir bağlantıya ihtiyacı vardır. Taslağınız bu cihazda güvende.',
  'composerWeb.review.publishConfirm':
    "Bu, {count, plural, one {# hesap} other {# hesap}}'ta hemen yayınlanır. Buradan geri alınamaz.",

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Yeni taslak',
  'composerWeb.page.loading': 'Taslak, hedefleri ve sınırları yükleniyor',
  'composerWeb.page.errorTitle': 'Bu taslak açılamadı',
  'composerWeb.page.errorBody':
    'Hiçbir şey kaybolmadı. Tekrar deneyin ve başarısız olmaya devam ederse aşağıdaki referans, desteğin isteği bulmasına yardımcı olur.',
  'composerWeb.page.noConnectionsTitle': 'Oluşturmadan önce bir hesap bağlayın',
  'composerWeb.page.noConnectionsBody':
    'Taslağın en az bir bağlı hesaba ihtiyacı vardır, böylece Relay sınırları, önizlemeyi ve gösterilecek ayarları bilir.',
  'composerWeb.page.noConnectionsExample':
    'Örnek: X ve LinkedIn bağlandığında, bir taslak kendi sayaçlarına sahip iki yerel versiyona dönüşür.',
  'composerWeb.page.permissionTitle': 'Bu çalışma alanında yayın oluşturamazsınız',
  'composerWeb.page.permissionBody':
    'Beste yapmak editör rolüne veya daha yüksek bir seviyeye ihtiyaç duyar. Bir sahip veya yönetici rolünüzü değiştirebilir.',
  'composerWeb.page.rateLimitTitle': 'Kısa sürede çok fazla taslak kaydediliyor',
  'composerWeb.page.rateLimitCause':
    'Bu çalışma alanı geçerli pencere için yazma sınırına ulaştı. Bu arada mesajınız bu cihazda tutuluyor.',
  'composerWeb.page.rateLimitAlternative':
    'Yazmaya devam et. Pencere sıfırlandığında kaydetme işlemi otomatik olarak devam eder.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Izgara',
  'mediaLib.view.list': 'Liste',
  'mediaLib.view.label': 'Düzen',
  'mediaLib.sort.label': 'Sırala',
  'mediaLib.sort.newest': 'Önce en yeni',
  'mediaLib.sort.name': 'İsim',
  'mediaLib.sort.size': 'Önce en büyüğü',
  'mediaLib.select': '{name} seçeneğini seçin',
  'mediaLib.column.file': 'Dosya',
  'mediaLib.column.type': 'Tür',
  'mediaLib.column.size': 'Boyut',
  'mediaLib.column.altText': 'Alternatif metin',
  'mediaLib.column.rights': 'Haklar',
  'mediaLib.column.added': 'Eklendi',
  'mediaLib.openDetail': '{name}’ı açın',

  'mediaLib.empty.title': 'Henüz medya yok',
  'mediaLib.empty.body':
    "Zaten sahip olduğunuz görselleri ve videoları yükleyin veya bir URL'den bir dosyayı içe aktarın. Aktarma, yayınladığınız her hesaba göre türü ve boyutu kontrol eder.",
  'mediaLib.empty.example':
    'Örnek: launch_hero.jpg, 1600 x 900, alternatif metin seti, 2 gönderide kullanıldı.',
  'mediaLib.error.title': 'Kütüphane yüklenemedi',
  'mediaLib.error.body': 'Dosyalarınız güvende. Bu başarısızlıkla hiçbir şey değişmedi.',
  'mediaLib.offline.title': 'Kitaplık çevrimdışıyken kullanılamıyor',
  'mediaLib.offline.body':
    'Bağlantı olmadan kitaplığı yenileyemiyoruz. Bu ekrandaki dosyalar değişmedi. Yeniden bağlanın, sonra tekrar deneyin.',
  'mediaLib.rateLimited.title': 'Kitaplığın kısa bir molaya ihtiyacı var',
  'mediaLib.rateLimited.cause':
    'API, dosyalarınızı yüklerken yavaşlamamızı istedi. Saklanan medyanız güvende.',
  'mediaLib.rateLimited.resetLabel': 'Şu tarihten sonra tekrar deneyin',
  'mediaLib.rateLimited.alternative':
    'Yerel olarak taslak hazırlamaya devam edebilirsiniz, ancak yüklemeler ve kitaplık değişiklikleri limit sıfırlanana kadar bekler.',
  'mediaLib.loading': 'Medya kitaplığınızı yükleme',
  'mediaLib.permission.title': 'Bu çalışma alanı kitaplığını göremezsiniz',
  'mediaLib.permission.body':
    'Medyayı görüntülemek için bu projede izleyici rolü veya daha yüksek bir rol gerekiyor. Bir sahip veya yönetici bu izni verebilir.',

  'mediaLib.upload.heading': 'Medya ekle',
  'mediaLib.upload.browse': 'Dosyaları seçin',
  'mediaLib.upload.dropHint':
    'Dosyaları buraya sürükleyin veya seçin. Bağlantı kesilirse yüklemeler devam eder.',
  'mediaLib.upload.queueHeading': 'Yüklemeler',
  'mediaLib.upload.progress': '{name}, {percent} / {size} gönderildi',
  'mediaLib.upload.paused': 'Duraklatıldı. {size} arasından {sent} zaten kayıtlı.',
  'mediaLib.upload.resume': 'Yüklemeye devam et',
  'mediaLib.upload.pause': 'Yüklemeyi duraklat',
  'mediaLib.upload.cancel': 'Bu yüklemeyi iptal et',
  'mediaLib.upload.retry': 'Bu yüklemeyi tekrar deneyin',
  'mediaLib.upload.finalizing': 'Bitirme {name}',
  'mediaLib.upload.done': '{name} kitaplığınızda',
  'mediaLib.upload.failed': '{name} bitirmedi. {reason}',
  'mediaLib.upload.offline':
    'Çevrimdışı. Yeniden bağlandığınızda yüklemeler kaldığı yerden devam eder.',
  'mediaLib.upload.rejectedType':
    "{name}, {mimeType}'dir ve seçtiğiniz hesapların hiçbiri bunu kabul etmez.",
  'mediaLib.upload.rejectedSize':
    "{name} {size}'dir. Hesaplarınız genelinde en düşük limit {limit}'dir.",
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Hesaplarınızın # tanesi tarafından kabul edildi} other {Hesaplarınızın # tanesi tarafından kabul edildi}}',
  'mediaLib.upload.rejectedBy': '{accounts} tarihine kadar kabul edilmedi',
  'mediaLib.upload.checkedAgainst':
    'Bu taslakta seçilen hesaplar karşılaştırılarak kontrol edildi.',
  'mediaLib.upload.noTargets':
    'Hiçbir hesap seçilmediğinden dosya yalnızca çalışma alanı varsayılanlarına göre kontrol edilir.',

  'mediaLib.import.urlLabel': 'Herkese açık dosya URL’si',
  'mediaLib.import.urlPlaceholder': 'https://cdn.example.com/launch-video.mp4',
  'mediaLib.import.importing': 'Medya içe aktarılıyor',
  'mediaLib.import.succeeded': 'Dosya kitaplığınızda',
  'mediaLib.import.scanPending':
    'Relay kaynağını kaydetti. Güvenlik kontrolü tamamlanana kadar yayınlama bekler.',
  'mediaLib.import.failed': 'Dosya içe aktarılamadı',
  'mediaLib.import.failedHelp':
    'Bağlantının herkese açık olduğunu ve doğrudan desteklenen bir medya dosyasına işaret ettiğini kontrol edip tekrar deneyin.',
  'mediaLib.import.readOnly': 'Bu ortamda dosya içe aktarmak için API’ye bağlanın.',
  'mediaLib.import.offline': 'Bir dosyayı içe aktarmadan önce yeniden bağlanın.',
  'mediaLib.import.issue.invalid': 'Eksiksiz bir URL girin.',
  'mediaLib.import.issue.scheme': 'HTTP veya HTTPS bağlantısı kullanın.',
  'mediaLib.import.issue.credentials': 'Kullanıcı adı veya şifre içermeyen bir bağlantı kullanın.',
  'mediaLib.retention.title':
    'Saklanan dosyalar, gönderi oluşturulduktan sonra 30 gün boyunca tutulur',
  'mediaLib.retention.body':
    'Bir dosya bir gönderiye eklendiğinde, o gönderi oluşturulduktan 30 gün sonra dosyayı Relay depolamasından kalıcı olarak sileriz. Eklenmeyi bekleyen dosyalar için yükleme tarihi temizleme yedeği olarak kullanılır. Gönderi metni, yayın alındıları ve denetim geçmişi daha uzun süre kullanılabilir kalır. Sosyal platformda yayınlanmış bir gönderi, saklanan dosyasının süresi dolduğunda kaldırılmaz.',
  'mediaLib.retention.limits':
    'Görseller, ses ve PDF dosyaları en fazla {imageSize} olabilir. Videolar en fazla {videoSize} olabilir.',
  'mediaLib.retention.expiresLabel': 'Dosya silme tarihi',
  'mediaLib.retention.deleted': 'Kalıcı olarak silindi',
  'mediaLib.retention.deletedTitle': 'Bu saklanan dosya silindi',
  'mediaLib.retention.deletedBody':
    '30 günlük saklama süresi sona erdi. Gönderi metni, yayın alındıları ve denetim geçmişi kalır.',
  'mediaLib.processing.unavailableTitle': 'Bu dosya yayınlanmaya hazır değil',
  'mediaLib.processing.unavailableBody':
    'İşleme veya güvenlik kontrolü hâlâ beklemede ya da geçemedi. Bu durum düzelmezse dosyayı tekrar yükleyin.',
  'mediaLib.processing.pendingTitle': 'Güvenlik taraması lansman öncesinde kullanılamıyor',
  'mediaLib.processing.pendingBody':
    'Dosya 30 gün boyunca saklanır, ancak güvenlik taraması etkinleştirilene kadar yayınlanan bir gönderiye eklenemez.',
  'mediaLib.processing.blockedTitle': 'Bu dosya yayınlanamaz',
  'mediaLib.processing.blockedBody':
    'Dosya işlemeyi veya güvenlik kontrolünü geçemedi. Farklı bir dosya yükleyin.',
  'mediaLib.alt.heading': 'Alternatif metin',
  'mediaLib.alt.help':
    'Göremeyen biri için resimde neyin önemli olduğunu açıklayın. Genellikle bir veya iki cümle yeterlidir.',
  'mediaLib.alt.count': '{used} / {limit} karakter',
  'mediaLib.alt.requiredBy': '{accounts} tarihine kadar gerekli',
  'mediaLib.alt.waive': 'Bu resim hiçbir bilgi içermiyor',
  'mediaLib.alt.waiveReason': 'Neden açıklamaya ihtiyacı yok',
  'mediaLib.alt.waiveHelp':
    'Bunu yalnızca dekorasyon için kullanın. Feragat edilen bir görsel, platformun izin verdiği durumlarda boş bir açıklamayla yayınlanır.',
  'mediaLib.alt.waived': '{date} tarihinde {name} tarafından feragat edildi. Sebep: {reason}',
  'mediaLib.alt.unsupported':
    "{provider} bu hesap için API'si aracılığıyla alternatif metni kabul etmez.",
  'mediaLib.alt.missingCount':
    '{count, plural, one {# dosyanın alternatif metni yok} other {# dosyanın alternatif metni yok}}',

  'mediaLib.rights.heading': 'Haklar ve rıza',
  'mediaLib.rights.declared': '{date} tarihinde {name} tarafından ilan edildi',
  'mediaLib.rights.undeclared': 'Henüz ilan edilmedi. Bu dosya yayınlanmadan önce bunu bildirin.',
  'mediaLib.rights.ownerLabel': 'Bu dosyanın sahibi kim',
  'mediaLib.rights.ownerSelf': 'Bu çalışma alanı',
  'mediaLib.rights.ownerLicensed': 'Başkasından lisanslı',
  'mediaLib.rights.ownerUgc': 'Bir müşteri veya yaratıcı izin verdi',
  'mediaLib.rights.licenseLabel': 'Lisans veya izin referansı',
  'mediaLib.rights.peopleLabel': 'Kişiler bu dosyada görünüyor',
  'mediaLib.rights.peopleConsent': 'Gösterilen herkes yayınlanmayı kabul etti',
  'mediaLib.rights.musicLabel': 'Bu dosya müzik veya film müziği içeriyor',
  'mediaLib.rights.confirm':
    'Bu dosyayı, içindeki kişiler, müzikler, logolar ve markalar dahil olmak üzere yayınlama haklarına sahibim.',
  'mediaLib.rights.blocking': 'Bu dosya, haklar beyan edilene kadar planlanamaz.',

  'mediaLib.editor.heading': 'Resmi düzenle',
  'mediaLib.editor.description':
    'Her düzenleme yeni bir sürüm olarak kaydedilir. Orijinal dosya saklanır ve geri yüklenebilir.',
  'mediaLib.editor.tab.crop': 'Kırpma',
  'mediaLib.editor.tab.transform': 'Yeniden boyutlandırın ve döndürün',
  'mediaLib.editor.tab.canvas': 'Kanvas',
  'mediaLib.editor.tab.output': 'Biçim ve boyut',
  'mediaLib.editor.tab.thumbnail': 'Küçük resim',
  'mediaLib.editor.presetLabel': 'En boy oranı ön ayarı',
  'mediaLib.editor.presetFree': 'Ücretsiz',
  'mediaLib.editor.presetFor': '{ratio}, {accounts} tarafından kullanılır',
  'mediaLib.editor.cropX': 'Başlangıç kenarından kırp',
  'mediaLib.editor.cropY': 'Üstten kırp',
  'mediaLib.editor.cropWidth': 'Kırpma genişliği',
  'mediaLib.editor.cropHeight': 'Kırpma yüksekliği',
  'mediaLib.editor.cropKeyboardHint':
    'Kırpma kutusu sayı alanlarıyla ayarlanmıştır, dolayısıyla tamamen klavyeden çalışır.',
  'mediaLib.editor.widthLabel': 'Piksel cinsinden genişlik',
  'mediaLib.editor.heightLabel': 'Piksel cinsinden yükseklik',
  'mediaLib.editor.lockRatio': 'Mevcut oranı koru',
  'mediaLib.editor.rotateLabel': 'Döndürme',
  'mediaLib.editor.rotateDegrees': '{degrees} derece',
  'mediaLib.editor.flipHorizontal': 'Dikey eksen boyunca çevir',
  'mediaLib.editor.flipVertical': 'Yatay eksen boyunca çevir',
  'mediaLib.editor.canvasColor': 'Arka plan rengi',
  'mediaLib.editor.canvasFit': 'Resim tuvalde nasıl duruyor?',
  'mediaLib.editor.canvasFitCover': 'Tuvali doldurun ve taşmayı kırpın',
  'mediaLib.editor.canvasFitContain': 'Resmin tamamını sığdırın ve geri kalanını doldurun',
  'mediaLib.editor.formatLabel': 'Çıkış formatı',
  'mediaLib.editor.qualityLabel': 'Sıkıştırma kalitesi',
  'mediaLib.editor.qualityValue': '{value} / 100',
  'mediaLib.editor.estimatedSize': "Tahmini çıktı {size}, {original}'den itibaren",
  'mediaLib.editor.estimatedSizeUnknown': 'Çıktı boyutu yalnızca dosya işlendikten sonra bilinir.',
  'mediaLib.editor.thumbnailHelp':
    'Platformun kabul ettiği video küçük resmi olarak kullanılan çerçeveyi veya dosyayı seçin.',
  'mediaLib.editor.thumbnailFrame': 'Çerçeve {time}',
  'mediaLib.editor.save': 'Yeni sürüm olarak kaydet',
  'mediaLib.editor.saving': 'Sürüm {version} kaydediliyor',
  'mediaLib.editor.saved': 'Sürüm {version} kaydedildi. Orijinali hala burada.',
  'mediaLib.editor.discard': 'Bu düzenlemeleri sil',
  'mediaLib.editor.noChanges': 'Henüz kaydedilecek değişiklik yok.',
  'mediaLib.editor.revalidate':
    'Kaydedildiğinde bu dosya, onu kullanan taslaklardaki her hesapta yeniden kontrol edilir.',
  'mediaLib.editor.noGeneration':
    'Bu düzenleyici yüklediğiniz dosyayı değiştirir. Yeni görüntüler yaratmaz.',

  'mediaLib.versions.heading': 'Sürümler',
  'mediaLib.versions.original': 'Orijinal yükleme',
  'mediaLib.versions.current': 'Güncel sürüm',
  'mediaLib.versions.restore': '{version} sürümünü geri yükle',
  'mediaLib.versions.item': 'Sürüm {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'Bu dosya nereden geldi?',
  'mediaLib.provenance.sourceUrl': "Kaynak URL'si",
  'mediaLib.provenance.fetchedAt': '{date} getirildi',
  'mediaLib.provenance.declaredAuthor': 'Belirtilen yazar',
  'mediaLib.provenance.declaredLicense': 'Belirtilen lisans',
  'mediaLib.provenance.contentCredentials': 'Gömülü içerik kimlik bilgileri',
  'mediaLib.provenance.contentCredentialsNone':
    'Bu dosya hiçbir gömülü içerik kimlik bilgisi taşımamaktadır. Bu yaygındır ve herhangi bir şeyin yanlış olduğu anlamına gelmez.',
  'mediaLib.provenance.unverified':
    "Bu ayrıntılar Relay'den değil kaynaktan geliyor. Onlara güvenmeden önce onları kontrol edin.",

  'mediaLib.picker.title': 'Medyayı seçin',
  'mediaLib.picker.description': 'Dosyalar bu taslakta seçilen hesaplara göre kontrol edilir.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Dosya seç} one {# dosya ekle} other {# dosya ekle}}',
  'mediaLib.picker.forMaster': 'Ana taslağa ekleme',
  'mediaLib.picker.forVariant': 'Yalnızca {account} sürümüne ekleme',
} as const;
