/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message':
    '{provider} bu gönderi türü için biraz metne ihtiyaç duyuyor.',
  'validation.text_too_long.message':
    '{over, plural, one {# karakter {account} için limitin üzerinde} other {# karakter {account} için limitin üzerinde}}',
  'validation.text_too_long.hint': '{provider} bu hesap için {limit} karaktere izin verir.',
  'validation.text_too_short.message': '{provider} burada en az {min} karaktere ihtiyaç duyar.',
  'validation.title_required.message': "{provider}'ın bir başlığa ihtiyacı var.",
  'validation.title_too_long.message': 'Başlık {limit} karakter sınırlamasını aşıyor.',
  'validation.description_too_long.message': 'Açıklama {limit} karakter sınırının üzerinde.',
  'validation.media_required.message':
    '{provider} bu gönderi türü için en az bir resim veya videoya ihtiyaç duyuyor.',
  'validation.media_count_exceeded.message':
    '{provider} burada en fazla {limit, plural, one {# dosya} other {# dosya}} kabul edilir. Bu gönderide {count} var.',
  'validation.media_type_unsupported.message': '{provider} {mimeType} dosyalarını kabul etmez.',
  'validation.media_aspect_ratio_unsupported.message':
    "Bu dosya {actual}'dır. {provider} için {min} ile {max} arasında bir oran gerekir.",
  'validation.media_aspect_ratio_unsupported.hint':
    'Bunu düzeltmek için platform ön ayarıyla kırpın.',
  'validation.media_resolution_too_low.message':
    "Bu dosya {actual}'dır. {provider} en az {required}'ye ihtiyaç duyar.",
  'validation.media_duration_too_long.message':
    "Bu video {actual}. {provider} bu hesap için {limit}'ye kadar kabul eder.",
  'validation.media_duration_too_short.message':
    "Bu video {actual}. {provider} en az {limit}'ye ihtiyaç duyar.",
  'validation.media_file_too_large.message':
    "Bu dosya {actual}'dır. {provider} {limit}’ye kadar kabul eder.",
  'validation.media_mixed_types_unsupported.message':
    '{provider} görselleri ve videoyu aynı gönderide yayınlayamaz.',
  'validation.media_unavailable.message':
    'Eklenen bir dosya artık kullanılabilir değil. Gönderiden kaldırın veya yeniden yükleyin.',
  'validation.alt_text_missing.message':
    '{count, plural, one {# resim} other {# resim}} üzerinde alternatif metin eksik.',
  'validation.alt_text_missing.hint': 'Resmi tanımlayın veya dekoratif olarak işaretleyin.',
  'validation.thumbnail_unsupported.message': '{provider} burada özel küçük resim kabul edilmez.',
  'validation.destination_required.message': "Bunun {provider}'da nerede yayınlanacağını seçin.",
  'validation.destination_unsupported.message':
    "{destination} {provider}'de bu gönderi türünü kabul etmiyor.",
  'validation.mention_unresolved.message':
    '{count, plural, one {# bahis gerçek bir hesapla eşleştirilmemiş} other {# bahis gerçek hesaplarla eşleştirilmemiş}}.',
  'validation.mention_unresolved.hint':
    'Arama sonuçlarından hesabı seçin veya bahsi kaldırın. Düz metin hiçbir zaman yerel etiket olarak yayınlanmaz.',
  'validation.hashtag_count_exceeded.message':
    "{count} hashtag'leri. {provider} {limit}'den fazlasını spam olarak sayar.",
  'validation.link_not_allowed.message': '{provider} bu alanda bağlantılara izin vermiyor.',
  'validation.link_destination_unverified.message':
    '{domain} bağlantı alanı bu çalışma alanı için doğrulanmadı.',
  'validation.privacy_setting_required.message':
    '{provider} yayınlamadan önce açık bir gizlilik seçimi gerektirir.',
  'validation.privacy_setting_required.hint':
    'Varsayılan yoktur. Bu gönderiyi kimlerin görebileceğini seçin.',
  'validation.disclosure_required.message':
    'Bu gönderinin {market} proje kuralları kapsamında açıklanması gerekiyor.',
  'validation.first_comment_unsupported.message':
    '{provider} bu hesap için planlanmış bir ilk yorumu desteklemiyor.',
  'validation.thread_unsupported.message':
    '{provider} bu hesap için ileti dizilerini desteklemiyor.',
  'validation.repeat_end_required.message':
    'Tekrarlanan bir gönderinin bitiş tarihi veya bir dizi tekrarı olması gerekir.',
  'validation.schedule_in_past.message': 'Bu süre {timeZone} yılında geçti.',
  'validation.schedule_too_far_ahead.message':
    'Gönderiler en fazla {limit} öncesine kadar planlanabilir; yüklenen medya da bu süre boyunca saklanır.',
  'validation.schedule_outside_quiet_hours.message':
    'Bu, {project} için ayarlanan sessiz saatlerin içindedir.',
  'validation.duplicate_within_window.message':
    'Çok benzer içerik zaten {window} içinde {account} için planlanmış veya yayınlanmış.',
  'validation.blocked_term_present.message': 'Metin {project} için engellenmiş bir terim içeriyor.',
  'validation.unsupported_claim.message':
    'Bu iddia {project} için onaylanmış talepler arasında yer almıyor.',
  'validation.unsupported_claim.hint':
    'Kanıtlarla birlikte onaylanmış iddialara ekleyin veya cümleyi yeniden ifade edin.',
  'validation.cadence_exceeded.message':
    '{account} o gün {limit} sınırının üzerinde {count, plural, one {# kez} other {# kez}} yayınlayacaktır.',
  'validation.connection_paused.message': '{account} duraklatıldı ve yayınlanmayacak.',
  'validation.account_type_invalid.message':
    "{account} bu gönderi türü için {provider}'in gerektirdiği hesap türü değildir.",

  'validation.severity.error': 'Düzeltilmesi gerekiyor',
  'validation.severity.warning': 'Bunu kontrol et',
  'validation.severity.info': 'bilginiz için',
  'validation.field.required': 'Bu alan gereklidir.',
  'validation.field.tooShort': 'En az {min, plural, one {# karakter} other {# karakter}} kullanın.',
  'validation.field.tooLong':
    'En fazla {max, plural, one {# karakter} other {# karakter}} kullanın.',
  'validation.field.invalidEmail': 'Geçerli bir e-posta adresi girin.',
  'validation.field.invalidUrl': "https dahil tam URL'yi girin.",
  'validation.field.invalidDate': 'Geçerli bir tarih girin.',
  'validation.field.invalidTime': 'Geçerli bir zaman girin.',
  'validation.field.invalidNumber': 'Bir sayı girin.',
  'validation.field.outOfRange': '{min} ile {max} arasında bir değer girin.',
  'validation.field.mustMatch': 'Bu iki değerin eşleşmesi gerekir.',
  'validation.field.alreadyTaken': 'Bu zaten kullanılıyor.',
  'validation.field.unsafeValue': 'Bu değere burada izin verilmiyor.',
} as const;
