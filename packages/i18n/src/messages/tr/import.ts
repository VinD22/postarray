/**
 * Bulk CSV import. See `en/import.ts`: this says drafts wherever drafts are
 * what happens, and schedule only on the step where a person chooses it.
 */
export const importMessages = {
  'import.title': 'CSV’den gönderi içe aktar',
  'import.subtitle':
    'Bir e-tablo yükleyin, ne yapacağını okuyun, sonra karar verin. Yükleme dosyayı kontrol eder. Hiçbir şey oluşturmaz.',

  'import.step.upload': 'Yükle',
  'import.step.columns': 'Sütunlar',
  'import.step.review': 'İncele',
  'import.step.apply': 'Uygula',
  'import.step.results': 'Sonuçlar',
  'import.step.position': 'Adım {current} / {total}',

  'import.upload.heading': 'Bir CSV dosyası seçin',
  'import.upload.help':
    'Yalnızca CSV. .xlsx gibi e-tablo dosyaları okunmaz. Önce sayfanızı CSV olarak dışa aktarın.',
  'import.upload.field': 'CSV dosyası',
  'import.upload.fieldHelp': 'Bir dosya seçin veya satırları aşağıdaki kutuya yapıştırın.',
  'import.upload.paste': 'Veya CSV metnini yapıştırın',
  'import.upload.pasteHelp':
    'Başlık satırını dahil edin. Herhangi bir şey oluşturulmadan önce her şey kontrol edilir.',
  'import.upload.project': 'Proje',
  'import.upload.projectHelp': 'Bir dosyadaki her satır bu projeye aittir.',
  'import.upload.submit': 'Bu dosyayı kontrol et',
  'import.upload.submitting': 'Dosya okunuyor',
  'import.upload.allowPast': 'Zaten geçmiş zamanlara izin ver',
  'import.upload.allowPastHelp':
    'Varsayılan olarak kapalı. Geçmişte tarihlenmiş bir satır, sizin için taşınmak yerine düzeltebilmeniz için bildirilir.',
  'import.upload.tooLarge': 'Bu dosya {limit} karakterden büyük. Bölün ve tekrar deneyin.',
  'import.upload.duplicate':
    'Bu, daha önce yüklediğiniz dosyayla aynı, bu yüzden onun ikinci bir kopyasına değil, o içe aktarmaya bakıyorsunuz.',

  'import.template.heading': 'Sütunlar ne anlama gelir',
  'import.template.download': 'Şablon CSV indir',
  'import.template.required': 'Zorunlu sütunlar',
  'import.template.optional': 'İsteğe bağlı sütunlar',
  'import.column.external_row_id': 'Satır için kendi kimliğiniz. Dosya içinde benzersiz olmalıdır.',
  'import.column.project': 'Satırın ait olduğu proje adı veya kimliği.',
  'import.column.targets':
    'Ya set: ardından bir hedef set kimliği, ya da dikey çubukla ayrılmış hesap kimlikleri.',
  'import.column.caption': 'Gönderi metni.',
  'import.column.scheduled_local_time': '2026-09-01T10:00 şeklinde yazılmış yerel tarih ve saat.',
  'import.column.time_zone': 'Yerel saatin okunduğu IANA dilimi, örneğin Europe/Berlin.',
  'import.column.media':
    'Bir medya kimliği, zaten sahip olduğunuz medyanın sağlama toplamını takip eden sha256: veya sunucunun getirmesi için bir https adresi.',
  'import.column.title': 'Hedefin bir başlık kullandığı yerde bir başlık.',
  'import.column.destination': 'Hesap içindeki sayfa, pano veya kanal.',
  'import.column.privacy': 'Hedefin beklediği gizlilik değeri.',
  'import.column.first_comment': 'Gönderiden sonra ilk yorum olarak paylaşılan metin.',
  'import.column.approval_policy': 'Her taslağa eklenecek onay politikası.',
  'import.column.perPlatform':
    'Bir platformun adıyla adlandırılmış bir caption_ veya title_ sütunu yalnızca o platformu geçersiz kılar, örneğin caption_instagram.',

  'import.columns.heading': 'Sütun kontrolü',
  'import.columns.ok': 'Gerekli her sütun mevcut.',
  'import.columns.missing': '{count, plural, one {# zorunlu sütun eksik} other {# zorunlu sütun eksik}}',
  'import.columns.unknown':
    '{count, plural, one {# sütun tanınmadı ve yok sayılıyor} other {# sütun tanınmadı ve yok sayılıyor}}',
  'import.columns.present': 'Bulunan sütunlar',

  'import.review.heading': 'Bu dosya ne yapacak',
  'import.review.counts':
    '{valid, plural, =0 {Hazır satır yok} one {# satır hazır} other {# satır hazır}}, {invalid, plural, =0 {hiçbiri dikkat gerektirmiyor} one {# dikkat gerektiriyor} other {# dikkat gerektiriyor}}.',
  'import.review.empty': 'Bu dosyadan hiçbir satır okunmadı.',
  'import.review.rowsHeading': 'Satırlar',
  'import.review.filterAll': 'Tüm satırlar',
  'import.review.filterValid': 'Hazır',
  'import.review.filterInvalid': 'Dikkat gerektiriyor',
  'import.review.filterFailed': 'Başarısız',
  'import.review.downloadErrors': 'Sorunları CSV olarak indir',
  'import.review.parsedWith': '{version} ayrıştırıcısıyla okundu',

  'import.table.row': 'Satır kimliği',
  'import.table.line': 'Satır',
  'import.table.state': 'Durum',
  'import.table.caption': 'Başlık',
  'import.table.time': 'Planlandı',
  'import.table.problems': 'Sorunlar',
  'import.table.draft': 'Taslak',
  'import.table.noProblems': 'Yok',

  'import.state.pending': 'Kontrol edilmedi',
  'import.state.valid': 'Hazır',
  'import.state.invalid': 'Dikkat gerektiriyor',
  'import.state.applied': 'Taslak oluşturuldu',
  'import.state.skipped': 'Zaten yapıldı',
  'import.state.failed': 'Başarısız',

  'import.job.state.uploaded': 'Yüklendi',
  'import.job.state.validating': 'Kontrol ediliyor',
  'import.job.state.validated': 'Kontrol edildi',
  'import.job.state.applying': 'Uygulanıyor',
  'import.job.state.applied': 'Uygulandı',
  'import.job.state.failed': 'Okunamadı',

  'import.apply.heading': 'Hazır satırlara ne olmalı?',
  'import.apply.drafts': 'Taslak oluştur',
  'import.apply.draftsHelp':
    'Varsayılan. Her hazır satır, açabileceğiniz, düzenleyebileceğiniz ve onaylayabileceğiniz bir taslak olur. Hiçbir şey planlanmaz.',
  'import.apply.scheduled': 'Taslak oluştur ve planla',
  'import.apply.scheduledHelp':
    'Her hazır satır bir taslak olur ve dosyada yazılı zamanı alır. Bunu yalnızca zamanlar doğruysa seçin.',
  'import.apply.confirm': '{count, plural, one {# satırı} other {# satırı}} uygula',
  'import.apply.confirmScheduled': '{count, plural, one {# satırı} other {# satırı}} oluştur ve planla',
  'import.apply.running': 'Satırlar uygulanıyor',
  'import.apply.safeToRepeat':
    'İki kez uygulamak güvenlidir. Zaten bir taslak oluşturmuş bir satır olduğu gibi bırakılır.',

  'import.results.heading': 'Sonuçlar',
  'import.results.applied': '{count, plural, one {# taslak oluşturuldu} other {# taslak oluşturuldu}}',
  'import.results.skipped':
    '{count, plural, one {# satır zaten yapılmıştı} other {# satır zaten yapılmıştı}}',
  'import.results.failed': '{count, plural, one {# satır başarısız oldu} other {# satır başarısız oldu}}',
  'import.results.retry': 'Kalan satırları tekrar uygula',
  'import.results.openDrafts': 'Taslakları aç',
  'import.results.unavailable': 'kullanılamıyor',

  'import.history.heading': 'Önceki içe aktarmalar',
  'import.history.empty': 'Henüz içe aktarma yok.',
  'import.history.open': 'Aç',

  'import.a11y.rowsTable': 'Manifest satırları ve sorunları',
  'import.a11y.stepList': 'İçe aktarma adımları',
  'import.a11y.uploadedFile': 'Seçilen dosya: {filename}',

  'import.error.emptyFile': 'Bu dosyada hiç satır yok.',
  'import.error.missingColumn': '{column} sütunu eksik.',
  'import.error.unknownColumn': '{column} sütunu tanınmadı, bu yüzden yok sayılıyor.',
  'import.error.duplicateRowId': '{value} satır kimliği bu dosyada birden fazla kez kullanılıyor.',
  'import.error.required': 'Bu hücre boş olamaz.',
  'import.error.invalidCell': 'Bu hücre okuyabileceğimiz bir biçimde değil.',
  'import.error.rowShape': 'Bu satırda {actual} hücre var ama başlıkta {expected} var.',
  'import.error.invalidLocalTime':
    '{value} zamanı, 2026-09-01T10:00 gibi bir yerel tarih ve saat değil.',
  'import.error.invalidTimeZone': '{value} dilimi bir IANA saat dilimi adı değil.',
  'import.error.nonexistentLocalTime':
    '{value} zamanı {zone} içinde mevcut değil. Saatler onun üzerinden atlıyor.',
  'import.error.ambiguousLocalTime':
    '{value} zamanı, o gün {zone} içinde iki kez gerçekleşiyor. Farklı bir zaman seçin.',
  'import.error.scheduleInPast': '{zone} içindeki {value} zamanı zaten geçti.',
  'import.error.invalidTargets':
    '{value} değeri kaydedilmiş bir hedef seti veya hesap kimlikleri listesi değil.',
  'import.error.invalidMedia':
    '{value} değeri bir medya kimliği, sha256 sağlama toplamı veya https adresi değil.',
  'import.error.mediaNotFound': 'Bu çalışma alanında {value} ile eşleşen medya yok.',
  'import.error.mediaImportStarted':
    '{value} konumundaki medya getiriliyor. Kitaplığa girdiğinde bu dosyayı tekrar uygulayın.',
  'import.error.unknownVariantTarget':
    'Bu satırda bir {provider} hesabı yok, bu yüzden {provider} başlığı kullanılmadı.',
  'import.error.applyFailed': 'Bu satır uygulanamadı. Referans: {code}.',
  'import.error.alreadyApplied': 'Bu satır zaten bir taslak oluşturdu, bu yüzden olduğu gibi bırakıldı.',
  'import.error.tooManyRows': 'Bir dosyanın yalnızca ilk {limit} satırı okunur.',
} as const;
