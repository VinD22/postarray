/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 * See `en/posting-sets.ts`: pausing stops work that has not happened yet and
 * never retracts a post that already went out.
 */
export const postingSetMessages = {
  'calendar.hold.action': 'Duraklat',
  'calendar.hold.resumeAction': 'Devam ettir',
  'calendar.hold.badge': 'Duraklatıldı',
  'calendar.hold.badgeBilling': 'Faturalandırma nedeniyle duraklatıldı',
  'calendar.hold.term': 'Bekletme',
  'calendar.hold.byPerson': '{date} tarihinde sizin tarafınızdan duraklatıldı.',
  'calendar.hold.byBilling':
    'Bu çalışma alanı tam erişimini kaybettiği için {date} tarihinde duraklatıldı.',
  'calendar.hold.none': 'Duraklatılmadı',

  'calendar.hold.confirmTitle': 'Bu gönderi duraklatılsın mı?',
  'calendar.hold.confirmBody':
    'Bu gönderi olduğu yerde kalacak ve {time} saatinde yayınlanmayacak. Bu zamandan önce herhangi bir noktada devam ettirebilirsiniz veya o zaman geçtiyse yeni bir zaman seçebilirsiniz.',
  'calendar.hold.confirmScope':
    'Duraklatmak, henüz gerçekleşmemiş olanı durdurur. Bir platforma zaten yayınlanmış herhangi bir şey yayınlanmış kalır ve duraklatmak onu silmez veya düzenlemez.',
  'calendar.hold.confirmNoteLabel': 'Bunu neden duraklatıyorsunuz? (isteğe bağlı)',
  'calendar.hold.confirmNoteHint':
    'Ekibiniz için denetim kaydında tutulur. Herhangi bir platforma gönderilmez.',
  'calendar.hold.confirm': 'Bu gönderiyi duraklat',
  'calendar.hold.cancel': 'Planlı kalsın',

  'calendar.hold.resumeTitle': 'Bu gönderi devam ettirilsin mi?',
  'calendar.hold.resumeBody': '{timeZone} diliminde {time} saatinde yayınlanacak.',
  'calendar.hold.resumeMissedTitle': 'O zaman geçti',
  'calendar.hold.resumeMissedBody':
    'Bu gönderi duraklatılmışken {time} saatinde yayınlanacaktı. Devam ettirdiğiniz anda yayınlanmaması için yeni bir zaman seçin.',
  'calendar.hold.resumeTimeLabel': 'Yeni yayınlama zamanı',
  'calendar.hold.resumeConfirm': 'Devam ettir',

  'calendar.hold.paused': 'Duraklatıldı. Siz devam ettirene kadar yayınlanmayacak.',
  'calendar.hold.resumed': 'Devam ettirildi. {time} saatinde yayınlanacak.',

  'calendar.hold.blocked.published':
    'Bu gönderi zaten yayınlandı. Duraklatmak onu platformdan geri alamaz.',
  'calendar.hold.blocked.inFlight':
    'Bu gönderi şu anda gönderiliyor. Duraklatmak için çok geç ve yarıda durdurmak onu yarı yayınlanmış bırakabilir.',
  'calendar.hold.blocked.finished':
    'Bu gönderi zaten tamamlandı, bu yüzden duraklatılacak bir şey yok.',
  'calendar.hold.blocked.billing':
    'Bu gönderi, çalışma alanı tam erişimini kaybettiği için bekletmede. Devam ettirmek bir planlama değil, bir faturalandırma meselesidir.',
  'calendar.hold.blocked.billingAction': 'Faturalandırmaya git',

  'set.title': 'Gönderi Setleri',
  'set.lede':
    '"Bunu kime ve nasıl gönderiyorum" sorusuna kaydedilmiş bir yanıt. Bir Seti uygulamak, ayarlarını yeni bir taslağa kopyalar.',
  'set.appliedOnce':
    'Bir Set, uyguladığınızda bir kez okunur. Onu daha sonra düzenlemek, bir sonraki gönderinin neyden başladığını değiştirir. Ondan zaten yaptığınız taslaklar ve planlanmış gönderiler tam olarak oldukları gibi kalır.',
  'set.empty.title': 'Henüz Set yok',
  'set.empty.body': 'Her gönderi için aynı hesap listesini yeniden oluşturmayı bırakmak için bir tane oluşturun.',
  'set.create': 'Yeni Set',
  'set.edit': 'Seti düzenle',
  'set.archive': 'Seti arşivle',
  'set.archived': 'Arşivlendi',
  'set.archivedNote': 'Arşivlenmiş Setler seçiciden gizlenir. Onlardan yapılan gönderiler değişmez.',
  'set.showArchived': 'Arşivlenenleri göster',
  'set.saved': 'Set kaydedildi.',
  'set.archivedToast': 'Set arşivlendi. Ondan zaten yapılmış gönderiler değişmez.',

  'set.field.name': 'Ad',
  'set.field.nameHint': 'Seçicide arayacağınız şey. Proje başına bir tane.',
  'set.field.description': 'Açıklama',
  'set.field.descriptionHint': 'İsteğe bağlı. Bu Set ne için.',
  'set.field.targets': 'Hesaplar',
  'set.field.targetsHint': 'Bu Setten yapılan bir gönderinin başladığı her hesap.',
  'set.field.targetCount': '{count, plural, =0 {Hesap yok} one {# hesap} other {# hesap}}',
  'set.field.signature': 'İmza',
  'set.field.signatureNone': 'İmza yok',
  'set.field.approval': 'Onay',
  'set.field.approvalHint': 'Bu Setten yapılan bir gönderinin yayınlanmadan önce ihtiyaç duyduğu onay.',
  'set.field.schedule': 'Ne zaman yayınlanacak',

  'set.approval.none': 'Onay gerekmiyor',
  'set.approval.single_approver': 'Adı belirtilmiş tek bir onaylayan',
  'set.approval.any_approver': 'Herhangi bir onaylayan',
  'set.approval.named_approver': 'Belirli bir onaylayan',
  'set.approval.policy_auto': 'Çalışma alanı politikasının söylediği her neyse',

  'set.slot.next_free_slot': 'Kuyruktan bir sonraki boş alan',
  'set.slot.next_free_slotHint':
    'Bir zaman sunmak için bu proje kuyruk kurallarını kullanır. Önerir; siz kabul edersiniz.',
  'set.slot.pick_time': 'Benden bir zaman iste',
  'set.slot.pick_timeHint': 'Seti uygulamak, seçmeniz için zamanı boş bırakır.',
  'set.slot.draft_only': 'Taslak olarak bırak',
  'set.slot.draft_onlyHint': 'Seti uygulamak planı hiç etkilemez.',
  'set.slot.noRules':
    'Bu projenin henüz kuyruk kuralı yok, bu yüzden kuyruk ilk boş saati sunacak ve bunu belirtecek.',
  'set.slot.rulesLink': 'Kuyruk kuralları',

  'set.defaults.title': 'Platform başına varsayılanlar',
  'set.defaults.body':
    'Her yeni gönderiye kopyalanan başlangıç değerleri. Daha sonra bunlardan herhangi birini kompozisyon aracında değiştirebilirsiniz.',
  'set.defaults.add': 'Bir platform ekle',
  'set.defaults.remove': '{platform} varsayılanlarını kaldır',
  'set.defaults.privacy': 'Gizlilik',
  'set.defaults.privacyNone': 'Platform varsayılanı',
  'set.defaults.bodyPrefix': 'Gönderiden önceki metin',
  'set.defaults.bodySuffix': 'Gönderiden sonraki metin',
  'set.defaults.requireAltText': 'Her görselde alternatif metin gerektir',
  'set.defaults.requireAltTextHint':
    'Bu Setten yapılan bir gönderi, her görselde alternatif metin olana kadar bu platforma planlanamaz.',
  'set.defaults.empty': 'Platform başına varsayılan yok. Her hesap ana gönderiden başlar.',

  'set.error.nameTaken': 'Bu projedeki başka bir Set zaten bu adı kullanıyor.',
  'set.error.archived': 'Bu Set arşivlendi. Düzenlemeden önce geri yükleyin.',
  'set.error.duplicateTarget': 'Bu hesap zaten bu Sette.',
  'set.error.duplicatePlatform': 'Bu Setin o platform için zaten varsayılanları var.',

  'targetMemory.setting.title': 'Gönderiler arasında hesapları hatırla',
  'targetMemory.setting.body':
    'Bu açıkken, kompozisyon aracı her yeni gönderiye o kişinin bu projede son seferinde seçtiği hesaplarla başlar. Siz açmadığınız sürece kapalıdır.',
  'targetMemory.setting.stored':
    'Yalnızca hesap listesi tutulur ve yalnızca onları seçen kişi için. Hiçbir başlık, zaman, gizlilik ayarı veya onay durumu saklanmaz ve projedeki başka hiç kimse listenizi göremez.',
  'targetMemory.setting.offNote': 'Bu kapalıyken hiçbir şey saklanmaz.',
  'targetMemory.setting.turnOffWarning':
    'Bunu kapatmak, bu projedeki kaydedilmiş her seçimi, herkes için siler.',
  'targetMemory.setting.enabled': 'Açık',
  'targetMemory.setting.disabled': 'Kapalı',
  'targetMemory.setting.saved': 'Ayar kaydedildi.',
  'targetMemory.setting.cleared': 'Ayar kaydedildi. Bu projedeki kaydedilmiş seçimler silindi.',

  'targetMemory.composer.restored':
    '{count, plural, one {Son seferden # hesapla başlandı.} other {Son seferden # hesapla başlandı.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {Son sefer kullandığınız # hesap, dikkat gerektirdiği için dışarıda bırakıldı.} other {Son sefer kullandığınız # hesap, dikkat gerektirdiği için dışarıda bırakıldı.}}',
  'targetMemory.composer.droppedAll':
    'Son sefer kullandığınız hesapların hiçbiri şu anda kullanılamıyor, bu yüzden hiçbiri önceden seçilmedi.',
  'targetMemory.composer.undo': 'Seçimi temizle',
  'targetMemory.composer.forget': 'Hesaplarımı hatırlamayı durdur',
  'targetMemory.composer.forgotten': 'Kaydedilmiş seçiminiz silindi.',
  'targetMemory.composer.reviewAccounts': 'Hesapları incele',
} as const;
