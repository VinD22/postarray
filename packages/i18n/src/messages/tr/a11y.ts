/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Birincil gezinme',
  'a11y.region.main': 'Ana içerik',
  'a11y.region.composer': 'Besteci',
  'a11y.region.preview': 'Önizleme',
  'a11y.region.validation': 'Doğrulama sorunları',
  'a11y.region.targets': 'Hesapları hedefleyin',
  'a11y.region.notifications': 'Bildirimler',

  'a11y.announce.saved': 'Taslak kaydedildi',
  'a11y.announce.saving': 'Taslak kaydediliyor',
  'a11y.announce.saveFailed': 'Taslak kaydedilemedi. Metniniz hâlâ burada.',
  'a11y.announce.offline': 'Çevrimdışısınız. Değişiklikler bu cihazda tutuluyor.',
  'a11y.announce.online': 'Tekrar çevrimiçi',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Doğrulama sorunu yok} one {# doğrulama sorunu} other {# doğrulama sorunu}}',
  'a11y.announce.validationCleared': 'Tüm doğrulama sorunları çözüldü',
  'a11y.announce.targetSelected':
    '{account} seçildi. Toplamda {count, plural, one {# hedef} other {# hedef}}.',
  'a11y.announce.targetOverridden': '{account} artık kendi versiyonuna sahip',
  'a11y.announce.targetReset': '{account} ana taslağa sıfırla',
  'a11y.announce.uploadProgress': '{name}, {percent} yüklendi',
  'a11y.announce.uploadComplete': '{name} yüklendi',
  'a11y.announce.uploadFailed': '{name} yüklenemedi',
  'a11y.announce.scheduled': '{timeZone} içinde {time} için planlandı',
  'a11y.announce.rescheduled': "{timeZone}'de {time}'a taşındı",
  'a11y.announce.publishing': 'Yayınlama',
  'a11y.announce.published':
    '{count, plural, one {# hesaba yayınlandı} other {# hesaba yayınlandı}}',
  'a11y.announce.publishPartial':
    "{total} hesaptan {published}'inde yayınlandı. {failed, plural, one {# hesapla ilgilenilmesi gerekiyor} other {# hesapla ilgilenilmesi gerekiyor}}.",
  'a11y.announce.publishFailed': 'Yayınlama başarısız oldu. İçeriğiniz korunur.',
  'a11y.announce.approvalRequested': '{approver} tarafından onay istendi',
  'a11y.announce.approved': 'Onaylandı',
  'a11y.announce.connectionAdded': '{account} bağlı',
  'a11y.announce.connectionRemoved': '{account} bağlantısı kesildi',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Filtreler temizlendi} one {# filtre uygulandı} other {# filtre uygulandı}}, {results, plural, one {# sonuç} other {# sonuç}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Panoya kopyalandı',
  'a11y.announce.suggestionApplied': 'Öneri uygulandı',
  'a11y.announce.suggestionRejected': 'Öneri reddedildi',

  'a11y.label.closeDialog': 'İletişim kutusunu kapat',
  'a11y.label.openMenu': 'Menüyü aç',
  'a11y.label.sortBy': "{field}'a göre sırala",
  'a11y.label.sortAscending': 'Artan şekilde sıralandı',
  'a11y.label.sortDescending': 'Azalan şekilde sıralandı',
  'a11y.label.removeTarget': "Hedeflerden {account}'yi kaldırın",
  'a11y.label.removeMedia': "{name}'ı kaldırın",
  'a11y.label.editAltText': '{name} için alternatif metni düzenleyin',
  'a11y.label.mediaPreview': '{name} önizlemesi',
  'a11y.label.playVideo': 'Oynat {name}',
  'a11y.label.pauseVideo': 'Duraklat {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {planlanmış bir şey yok} one {# gönderi} other {# gönderi}}',
  'a11y.label.postSummary': '{account} açık {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} / {limit} karakter kullanıldı',
  'a11y.label.requiredField': 'Gerekli',
  'a11y.label.externalLink': 'Yeni bir sekmede açılır',
  'a11y.label.loadingRegion': 'İçerik yükleniyor',
  'a11y.label.expandRow': '{name} ayrıntılarını göster',
  'a11y.label.collapseRow': '{name} için ayrıntıları gizle',
  'a11y.languagePicker.label': 'Arayüz dilini seçin',
  'a11y.languagePicker.filterLabel': 'Dilleri filtrele',
  'a11y.languagePicker.announceChanged': 'Arayüz dili {language} olarak değiştirildi',

  'a11y.keyboard.hint.calendar':
    'Yuvalar arasında hareket etmek için ok tuşlarını kullanın. Bir gönderiyi açmak için Enter tuşuna basın. Yeniden planlamak için Space tuşuna ve ardından ok tuşlarına basın.',
  'a11y.keyboard.hint.composer':
    'Hedefler arasında geçiş yapmak için Kontrol ve köşeli parantez tuşlarına basın. Bir sonraki sayıya geçmek için Control ve I tuşlarına basın.',
  'a11y.keyboard.hint.dialog': 'Kapatmak için Escape tuşuna basın.',
  'a11y.keyboard.shortcutsTitle': 'Klavye kısayolları',

  'a11y.table.alternative': 'Tablo görünümü',
  'a11y.table.alternativeHint': 'Sıralanabilir bir tabloyla aynı program.',
  'a11y.motion.reduced': 'Sistem ayarınız nedeniyle animasyonlar azaltılmıştır.',
} as const;
