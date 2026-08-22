/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Takvim',
  'calendar.view.day': 'Gün',
  'calendar.view.week': 'Hafta',
  'calendar.view.month': 'Ay',
  'calendar.view.list': 'Liste',
  'calendar.view.label': 'Takvim görünümü',
  'calendar.today': 'Bugün',
  'calendar.goToDate': 'Tarihe git',
  'calendar.previousPeriod': 'Önceki dönem',
  'calendar.nextPeriod': 'Sonraki dönem',
  'calendar.timeZoneNote': 'Zamanlar {timeZone} olarak gösterilir.',
  'calendar.weekOf': '{date} Haftası',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount':
    '{count, plural, =0 {Planlanmış bir şey yok} one {# gönderi} other {# gönderi}}',
  'calendar.slotOverflow': '{count, plural, one {# daha fazla} other {# daha fazla}}',
  'calendar.newPostAt': "{time}'da yeni gönderi",

  'calendar.filter.project': 'Proje',
  'calendar.filter.account': 'Hesap',
  'calendar.filter.platform': 'platformu',
  'calendar.filter.status': 'Durum',
  'calendar.filter.locale': 'İçerik dili',
  'calendar.filter.campaign': 'Kampanya',
  'calendar.filter.applied': '{count, plural, one {# filtre uygulandı} other {# filtre uygulandı}}',

  'calendar.drag.instructions':
    'Bir gönderiyi yeni bir alana sürükleyin veya gönderiyi seçip taşımak için ok tuşlarını kullanın.',
  'calendar.drag.confirmTitle': 'Bu yayın taşınsın mı?',
  'calendar.drag.confirmBody': "{timeZone}'de {from}'den {to}'e.",
  'calendar.drag.dstNotice':
    'Saatler bu saatler arasında {timeZone} olarak değişmektedir. Yeni saat {utc} UTC.',
  'calendar.drag.publishedNotice':
    'Bu yazı zaten yayınlandı. Hareket ettirmek yalnızca yerel kaydı değiştirir. Tekrar yayınlamak ayrı bir işlemdir.',
  'calendar.drag.conflictNotice':
    '{account} yeni saatten sonraki bir saat içinde zaten {count, plural, one {# gönderi} other {# gönderi}} içeriyor.',

  'calendar.queue.title': 'Sıra',
  'calendar.queue.upcoming': 'Yaklaşan',
  'calendar.queue.needsApproval': 'Onay bekleniyor',
  'calendar.queue.drafts': 'Taslaklar',
  'calendar.queue.published': 'Yayınlandı',
  'calendar.queue.failed': 'Başarısız',
  'calendar.queue.nextSlot': 'Bir sonraki boş slot {time}.',

  'calendar.post.publishesAt': "{time}'yi {timeZone}'de yayınlar",
  'calendar.post.publishedAt': 'Yayınlandı {time}',
  'calendar.post.targetCount': '{count, plural, one {# hesap} other {# hesap}}',
  'calendar.post.mediaType.text': 'Metin',
  'calendar.post.mediaType.image': 'Resim',
  'calendar.post.mediaType.carousel': 'Atlıkarınca',
  'calendar.post.mediaType.video': 'video',
  'calendar.post.mediaType.document': 'Belge',

  'actionCenter.title': 'Eylem merkezi',
  'actionCenter.description': 'Bir karara veya düzeltmeye ihtiyaç duyan her şey tek bir kuyrukta.',
  'actionCenter.empty': 'Şu anda dikkat edilmesi gereken hiçbir şey yok.',
  'actionCenter.item.connectionExpiring':
    "{account}'nın {date}'den önce yeniden bağlanması gerekir, aksi takdirde planlanmış gönderiler başarısız olur.",
  'actionCenter.item.connectionActionRequired':
    '{account} tekrar yayınlanmadan önce {provider} ile ilgilenilmesi gerekiyor.',
  'actionCenter.item.validationFailed': '{account} taslağı {provider} doğrulamasını geçemez.',
  'actionCenter.item.approvalOverdue': '{date} tarihinden bu yana onay talebi bekleniyor.',
  'actionCenter.item.scheduleConflict':
    "{account}'da {date}'de birbirine yakın planlanmış gönderiler var.",
  'actionCenter.item.providerIncident':
    '{provider} bir sorun bildiriyor. Planlanmış gönderiler yeniden denenecek.',
  'actionCenter.item.commentFailed':
    'Ana gönderi yayınlandı ancak {account} için takip öğesi başarısız oldu.',
  'actionCenter.item.analyticsStale': "{account} için analizler {date}'den bu yana güncellenmedi.",
  'actionCenter.item.rssStalled': "{name} akışı {date}'den bu yana geçerli bir öğe döndürmedi.",
  'actionCenter.item.webhookFailing':
    '{endpoint} adresine yapılan teslimatlar art arda {count, plural, one {# kez} other {# kez}} başarısız oldu.',
  'actionCenter.item.usageBalance':
    '{provider} için ölçülü bir eylemin çalıştırılabilmesi için kullanım bakiyesine ihtiyacı vardır.',

  'approval.title': 'Onaylar',
  'approval.requestTitle': 'Onay talebi',
  'approval.requestedBy': '{name} {relativeTime} tarafından talep edildi',
  'approval.requestedFrom': '{name} bekleniyor',
  'approval.policy.none': 'Bu hedefler için onaya gerek yoktur.',
  'approval.policy.anyApprover': 'Herhangi bir onaylayan bunu onaylayabilir.',
  'approval.policy.namedApprover': '{name} bunu onaylamalıdır.',
  'approval.policy.everyApprover': 'Her onaylayanın bunu onaylaması gerekir.',
  'approval.decision.approvedBy': '{name} tarafından {date} tarihinde onaylandı',
  'approval.decision.rejectedBy': '{date} tarihinde {name} tarafından reddedildi',
  'approval.decision.changesRequestedBy':
    '{name} tarafından {date} tarihinde talep edilen değişiklikler',
  'approval.comment.label': 'Yazar için not',
  'approval.comment.placeholder': 'Neyin değişmesi gerektiğini ve nedenini söyleyin.',
  'approval.reapproval.needed':
    'Bu yazı onaylandıktan sonra değişti. Yayınlanmadan önce tekrar onaylanması gerekiyor.',
  'approval.reapproval.reason.content': 'İçerik değişti.',
  'approval.reapproval.reason.account': 'Hedef hesaplar değişti.',
  'approval.reapproval.reason.media': 'Medya değişti.',
  'approval.reapproval.reason.schedule': 'Yayınlanma zamanı değişti.',
  'approval.reapproval.reason.privacy': 'The privacy or disclosure settings changed.',
  'approval.reapproval.reason.locale': 'İçerik dili değişti.',
  'approval.expiresAt': 'Bu isteğin süresi {date} tarihinde dolacaktır.',
} as const;
