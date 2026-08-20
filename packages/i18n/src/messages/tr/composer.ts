/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Oluştur',
  'composer.titleWithProject': '{project} için oluşturun',
  'composer.master.label': 'Ana taslak',
  'composer.master.description':
    'Buraya bir kere yaz. Uyumlu değişiklikler seçilen her hedefe ulaşır. Yalnızca hesabın alacağı sürümü yazmak için bir hedef açın.',
  'composer.master.globalEdit': 'Genel düzenleme',
  'composer.master.placeholder': 'Ne yayınlamak istiyorsunuz?',
  'composer.brief.label': 'Kısa',
  'composer.brief.placeholder': 'Fikri, hedef kitleyi ve istediğiniz sonucu açıklayın.',
  'composer.sources.label': 'Kaynak referansları',
  'composer.sources.empty': 'Kaynak eklenmemiş.',
  'composer.campaign.label': 'Kampanya',
  'composer.campaign.none': 'Kampanya yok',
  'composer.contentLocale.label': 'İçerik dili',
  'composer.contentLocale.help': 'Gönderinin dili. Bu, arayüz dilinizden ayrıdır.',
  'composer.market.label': 'İzleyici pazarı',

  'composer.targets.title': 'Hedefler',
  'composer.targets.count': '{count, plural, =0 {Hesap seçilmedi} one {# hesap} other {# hesap}}',
  'composer.targets.publishSummary':
    '{count, plural, one {Bu # hesaba yayınlanacak} other {Bu # hesaba yayınlanacak}} {when, select, şimdi {now} planlanmış {planlanan zamanda} other {}}',
  'composer.targets.add': 'Hesap ekle',
  'composer.targets.empty': 'Yayınlamak için en az bir hesap seçin.',
  'composer.targets.state.ready': 'Hazır',
  'composer.targets.state.inherited': 'Ustadan devralındı',
  'composer.targets.state.overridden': 'Geçersiz kılındı',
  'composer.targets.state.warning': 'Yayınlamadan önce kontrol edin',
  'composer.targets.state.error': 'Düzeltilmesi gerekiyor',
  'composer.targets.state.approvalNeeded': 'Onay gerekiyor',
  'composer.targets.overrideBadge': 'Geçersiz kıl',
  'composer.targets.resetConfirm.title': 'Bu hedef ana taslağa sıfırlansın mı?',
  'composer.targets.resetConfirm.body':
    '{account} için değiştirdiğiniz kopya, ortam ve ayarların yerini ana taslak alacaktır. Diğer hedefler etkilenmez.',
  'composer.targets.divergence':
    '{count, plural, one {# hedef ana taslaktan farklı} other {# hedef ana taslaktan farklı}}',

  'composer.applyToAll.title': 'Tüm hedeflere uygula',
  'composer.applyToAll.compatible':
    '{count, plural, one {# alan seçilen her hedefle uyumludur} other {# alan seçilen her hedefle uyumludur}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# alan uygulanamıyor ve hedef başına kalıyor} other {# alan uygulanamıyor ve hedef başına kalıyor}}',
  'composer.applyToAll.creates': 'Uygulama her hedef için açık bir sürüm oluşturur.',

  'composer.editor.label': 'Mesaj metni',
  'composer.editor.characterCount': '{used} / {limit} karakter',
  'composer.editor.characterCountOver': '{limit} karakter sınırının üzerinde {over} karakter',
  'composer.editor.characterCountUnknown': 'Bu hesap için karakter sınırı mevcut değil',
  'composer.editor.remaining': '{count, plural, one {# karakter kaldı} other {# karakter kaldı}}',
  'composer.editor.hashtagCount': '{count, plural, one {# hashtag} other {# hashtag}}',
  'composer.editor.formatting': 'Biçimlendirme',
  'composer.editor.emoji': 'Emoji',
  'composer.editor.mention': 'Mansiyon',
  'composer.editor.link': 'Bağlantı',

  'composer.mentions.search': 'Kişileri, sayfaları ve şirketleri arayın',
  'composer.mentions.searching': '{provider} aranıyor',
  'composer.mentions.resolved': '{provider} üzerinde {label} etiketlendi',
  'composer.mentions.unresolved':
    'Bu söz henüz bir {provider} hesabıyla eşleştirilmedi. Siz bir sonuç seçene kadar düz metin olarak yayınlanacaktır.',
  'composer.mentions.noResults': '{provider} üzerinde eşleşen hesap yok.',
  'composer.mentions.unsupported': 'Bu hesap için yerel etiketleme kullanılamıyor.',

  'composer.destination.label': 'Hedef',
  'composer.destination.placeholder': 'Bunun nerede yayınlanacağını seçin',
  'composer.destination.community': 'Topluluk',
  'composer.destination.board': 'Yönetim Kurulu',
  'composer.destination.group': 'Grup',
  'composer.destination.page': 'Sayfa',
  'composer.destination.organization': 'Organizasyon',
  'composer.destination.channel': 'Kanal',
  'composer.destination.refresh': 'Hedefleri yenile',
  'composer.destination.lastRefreshed': 'Destinasyonlar yenilendi {relativeTime}',

  'composer.media.title': 'Medya',
  'composer.media.count': '{count, plural, one {# dosya} other {# dosya}}',
  'composer.media.dropHint': 'Dosyaları buraya sürükleyin veya kitaplığınıza göz atın.',
  'composer.media.inheritFromMaster': 'Ana medyayı kullanma',
  'composer.media.overridden': 'Bu hedef kendi medyasını kullanıyor',
  'composer.media.altText.label': 'Alternatif metin',
  'composer.media.altText.placeholder': 'Ekran okuyucu kullanan kişiler için resmi açıklayın.',
  'composer.media.altText.missing': 'Alternatif metin eksik.',
  'composer.media.altText.waive': 'Bu görselin alternatif metne ihtiyacı yok',
  'composer.media.altText.generate': 'Alternatif metin yaz',
  'composer.media.crop': 'Kırpma',
  'composer.media.resize': 'Yeniden boyutlandır',
  'composer.media.rotate': 'Döndür',
  'composer.media.compress': 'Sıkıştır',
  'composer.media.convertFormat': 'Formatı dönüştür',
  'composer.media.thumbnail': 'Küçük resim',
  'composer.media.aspectPreset': 'Platform ön ayarı',
  'composer.media.original': 'Orijinal',
  'composer.media.originalPreserved':
    'Orijinal dosya saklanır. Düzenlemeler yeni bir sürüm oluşturur.',
  'composer.media.uploading': '{name} yükleniyor',
  'composer.media.processing': '{name} hazırlanıyor',
  'composer.media.rights.label': 'Haklar ve rıza',
  'composer.media.rights.confirm':
    'Bu medyayı, içindeki her türlü kişi, müzik, logo ve marka dahil olmak üzere yayınlama haklarına sahibim.',

  'composer.sequence.title': 'Yorumlar ve konu',
  'composer.sequence.root': 'Ana gönderi',
  'composer.sequence.item': 'Öğe {position}',
  'composer.sequence.add': 'Yorum veya konu öğesi ekle',
  'composer.sequence.delayLabel': 'Önceki öğeden sonraki gecikme',
  'composer.sequence.delayImmediate': 'Hemen',
  'composer.sequence.delayMinutes': '{count, plural, one {# dakika} other {# dakika}}',
  'composer.sequence.delayCustom': 'Özel gecikme',
  'composer.sequence.accountLabel': 'Bu öğeyi şu şekilde yayınla:',
  'composer.sequence.unsupported': 'Bu hesap, planlanmış takip öğelerini desteklemiyor.',

  'composer.repeat.title': 'Tekrarla',
  'composer.repeat.off': 'Tekrarlama',
  'composer.repeat.everyDays': '{count, plural, one {Her gün} other {Her # günde bir}}',
  'composer.repeat.endLabel': 'Tekrarlamayı bırak',
  'composer.repeat.endOnDate': 'Bir randevuda',
  'composer.repeat.endAfterCount': 'Bir dizi mesajın ardından',
  'composer.repeat.endRequired': 'Bir bitiş tarihi veya tekrar sayısı seçin.',
  'composer.repeat.summary':
    "{cadence}'yı {end}'e kadar tekrarlar. Her olay kendi onayını ve onayını alır.",

  'composer.links.title': 'Bağlantılar',
  'composer.links.keepOriginal': "Orijinal URL'yi koruyun",
  'composer.links.track': 'İzlenen kısa bağlantıyla değiştirin',
  'composer.links.utm': 'UTM parametreleri',
  'composer.links.domain': 'Bağlantı alanı',
  'composer.links.finalUrl': 'Bu {url} olarak yayınlanacak',
  'composer.links.frozenAtApproval': 'Tam kısa URL ve hedef, onaylanan sürümde dondurulur.',

  'composer.signature.title': 'İmza',
  'composer.signature.none': 'İmza yok',
  'composer.signature.autoApplied': 'İmza {name} otomatik olarak eklendi. Değiştirebilirsin.',

  'composer.set.title': 'Setler',
  'composer.set.startFrom': 'Bir Setten Başlayın',
  'composer.set.continueWithout': 'Setsiz Devam Et',
  'composer.set.applied': 'Uygulanan Ayar {name}. Bu taslak artık Setten bağımsızdır.',

  'composer.validation.title': 'Doğrulama',
  'composer.validation.clean': 'Seçilen hedefler için sorun bulunamadı.',
  'composer.validation.issueCount':
    '{count, plural, one {# sayı} other {# sayı}} genelinde {targets, plural, one {# hedef} other {# hedef}}',
  'composer.validation.blocking': 'Bu durum planlamadan önce düzeltilmelidir.',
  'composer.validation.warning': 'Yayınlamadan önce bunu kontrol edin.',
  'composer.validation.revalidated':
    'Mevcut platform limitlerine göre yeniden kontrol edildi {relativeTime}.',

  'composer.preview.title': 'Önizleme',
  'composer.preview.forAccount': "{provider}'de {account} için önizleme",
  'composer.preview.approximate':
    'Bu önizleme kaydettiğimiz platform kurallarını kullanır. Platform değişirse yayınlanan gönderi farklılık gösterebilir.',
  'composer.preview.unavailable': 'Bu hesap için henüz gerçek bir önizleme mevcut değil.',

  'composer.cost.title': 'Tahmini sağlayıcı maliyeti',
  'composer.cost.estimate':
    '{provider} bu gönderi için API kullanımının {amount} olacağını tahmin ediyor.',
  'composer.cost.linkSurcharge':
    '{provider} URL içeren gönderiler için daha fazla ücret alınır. Bağlantının kaldırılması tahmini düşürür.',
  'composer.cost.bulkWarning':
    '{count, plural, one {# yayın} other {# yayın}} tek işlemde. Devam etmeden önce tahmini inceleyin.',
  'composer.cost.reconciled': 'Gerçek kullanım yayınlandıktan sonra mutabakata varılır.',
  'composer.cost.none': 'Bu gönderi için ölçülü sağlayıcı maliyeti yok.',

  'composer.autosave.saving': 'Kaydediliyor',
  'composer.autosave.saved': 'Kaydedildi {relativeTime}',
  'composer.autosave.offline':
    'Çevrimdışı. Taslağınız bu cihazda saklanıyor ve senkronize edilecek.',
  'composer.autosave.conflict':
    '{name} siz yazarken bu taslağı düzenledim. Kaydetmeden önce her iki sürümü de inceleyin.',
  'composer.autosave.failed': 'Kaydedilemedi. Metniniz hâlâ burada. Yeniden deneniyor.',

  'composer.ai.title': 'Yardım',
  'composer.ai.makeConcise': 'Daha kısa ve öz hale getirin',
  'composer.ai.adaptForPlatform': '{provider} için uyarlayın',
  'composer.ai.transcreate': "{language}'ye dönüştürme",
  'composer.ai.checkClaims': 'Hak taleplerini kontrol edin',
  'composer.ai.writeAltText': 'Alternatif metin yaz',
  'composer.ai.suggestHooks': 'Kanca öner',
  'composer.ai.suggestCta': 'Bir eylem çağrısı önerin',
  'composer.ai.diffTitle': 'Önerilen değişiklik',
  'composer.ai.diffHelp': 'Siz kabul edene kadar hiçbir şey değişmez.',
  'composer.ai.working': 'Üzerinde çalışıyorum',
  'composer.ai.sources':
    'Onayladığınız {count, plural, one {# kaynak} other {# kaynak}} temel alınmıştır',
  'composer.ai.uncertain':
    'Bu ifadenin {language} dilinde temiz bir karşılığı yoktur. Yayınlamadan önce anadili İngilizce olan biriyle gözden geçirin.',

  'composer.schedule.title': 'Program',
  'composer.schedule.dateLabel': 'Tarih',
  'composer.schedule.timeLabel': 'Zaman',
  'composer.schedule.timeZoneLabel': 'Saat dilimi',
  'composer.schedule.nextFreeSlot': 'Sonraki ücretsiz slot',
  'composer.schedule.localAndUtc': '{timeZone} içinde {local}. {utc} UTC.',
  'composer.schedule.dstWarning':
    "Bu tarihte saatler {timeZone} olarak değişiyor. Bu gönderi {local}'de, yani {utc} UTC'de yayınlanır.",
  'composer.schedule.pastWarning': 'O zaman geçti. Daha sonraki bir zamanı seçin.',
  'composer.schedule.confirmTitle': 'Planlamadan önce onaylayın',
  'composer.schedule.confirmPublishNow': 'Şimdi yayınlamadan önce onaylayın',
  'composer.schedule.approverLabel': 'Onaylayan',
  'composer.schedule.policyLabel': 'Onay politikası',
  'composer.schedule.duplicateWarning':
    "Benzer içerik {account} {relativeTime}'de de yayınlandı. Tekrar yayınlamak, yinelenen içerikle ilgili platform kurallarını ihlal edebilir.",
  'composer.schedule.cadenceWarning':
    '{account} zaten o gün için {count, plural, one {# gönderi} other {# gönderi}} planlanmış.',
} as const;
