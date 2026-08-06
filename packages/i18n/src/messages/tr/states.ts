/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Taslak',
  'state.draft.description':
    'Bunu yalnızca bu çalışma alanındaki kişiler görebilir. Hiçbir şey planlanmadı.',
  'state.validation_needed.label': 'Doğrulama gerekli',
  'state.validation_needed.description':
    'Bir veya daha fazla hedefte bunun planlanabilmesi için düzeltilmesi gereken bir sorun var.',
  'state.approval_requested.label': 'Onay istendi',
  'state.approval_requested.description': "{approver}'ın karar vermesini bekliyorum.",
  'state.approved.label': 'Onaylandı',
  'state.approved.description':
    '{approver} tarafından onaylandı. Artık planlanabilir veya yayınlanabilir.',
  'state.scheduled.label': 'planlanmış',
  'state.scheduled.description': "{timeZone}'de {time}'ı yayınlar.",
  'state.preparing_media.label': 'Medyanın hazırlanması',
  'state.preparing_media.description': 'Platform için dosya yükleme ve dönüştürme.',
  'state.dispatching.label': 'Gönderim',
  'state.dispatching.description': 'Şimdi {provider} adresine gönderiyorum.',
  'state.provider_processing.label': 'Sağlayıcı işleme',
  'state.provider_processing.description':
    '{provider} yüklemeyi kabul etti ve hâlâ işliyor. Canlı olduğunda onaylıyoruz.',
  'state.published.label': 'Yayınlandı',
  'state.published.description': "{time}'den bu yana {provider}'da yayınlanıyor.",
  'state.partially_published.label': 'Kısmen yayınlandı',
  'state.partially_published.description':
    '{published, plural, one {# hedef yayınlandı} other {# hedef yayınlandı}}, {failed, plural, one {# başarısız oldu} other {# başarısız oldu}}. Yayınlanan gönderiler yayındadır ve geri alınmamıştır.',
  'state.action_required.label': 'İşlem gerekli',
  'state.action_required.description': 'Siz bir şey yapana kadar bu devam edemez.',
  'state.retry_scheduled.label': 'Planlanan yeniden dene',
  'state.retry_scheduled.description':
    "{max} denemesinden {attempt} denemesi {time}'de çalışacaktır. Hiçbir şey kopyalanmaz.",
  'state.failed_permanently.label': 'Başarısız',
  'state.failed_permanently.description':
    'Bu tekrar denenmeyecek. İçeriğiniz korunur ve nedeni makbuzun üzerindedir.',
  'state.canceled.label': 'İptal edildi',
  'state.canceled.description':
    '{date} tarihinde {actor} tarafından iptal edildi. Hiçbir şey yayınlanmadı.',
  'state.deleted_externally.label': 'Platformda silindi',
  'state.deleted_externally.description':
    "Bu gönderi artık {provider}'da değil. Gitmeden önce toplanan makbuz ve metrikler saklanır.",

  'state.approval.not_required.label': 'Onaya gerek yok',
  'state.approval.not_required.description': 'Bu hedeflere yönelik politika onay gerektirmez.',
  'state.approval.requested.label': 'İstendi',
  'state.approval.requested.description': '{approver} {relativeTime} adresine gönderildi.',
  'state.approval.in_review.label': 'İnceleniyor',
  'state.approval.in_review.description': '{approver} şu anda buna bakıyor.',
  'state.approval.approved.label': 'Onaylandı',
  'state.approval.approved.description': '{approver} tarafından {date} tarihinde onaylandı.',
  'state.approval.changes_requested.label': 'Talep edilen değişiklikler',
  'state.approval.changes_requested.description':
    '{approver} {date} üzerinde değişiklik yapılmasını istedi.',
  'state.approval.rejected.label': 'Reddedildi',
  'state.approval.rejected.description': '{date} tarihinde {approver} tarafından reddedildi.',
  'state.approval.expired.label': 'Süresi dolmuş',
  'state.approval.expired.description':
    'Bu talebin süresi {date} tarihinde herhangi bir karar olmadan sona erdi.',
  'state.approval.withdrawn.label': 'Geri çekildi',
  'state.approval.withdrawn.description': 'Yazar bu talebi {date} tarihinde geri çekmiştir.',

  'state.summary.targets':
    '{ready, plural, one {# hedef hazır} other {# hedef hazır}}, {blocked, plural, =0 {hiçbiri engellenmedi} one {# engellendi} other {# engellendi}}',
  'state.changedAt': '{relativeTime} değiştirildi',
} as const;
