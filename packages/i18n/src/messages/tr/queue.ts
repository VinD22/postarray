/**
 * Queue rules and slot reservations. See `en/queue.ts`: the `queue.reason.*`
 * keys are read back by a person and, years later, by an audit, so they
 * report exactly what happened, including the daylight-saving cases.
 */
export const queueMessages = {
  'queue.title': 'Yayın kuyruğu',
  'queue.subtitle':
    'Bu projenin ne zaman ve hangi aralıklarla gönderi yapmaya istekli olduğu. Bir kişi zamanı kabul etmeden hiçbir şey yayınlanmaz.',

  'queue.rules.heading': 'Kuyruk kuralları',
  'queue.rules.empty':
    'Henüz kuyruk kuralı yok. Bir tane eklemeden önce sonraki alan basitçe ilk boş saattir.',
  'queue.rules.create': 'Yeni kuyruk kuralı',
  'queue.rules.count': '{count, plural, =0 {Kural yok} one {# kural} other {# kural}}',
  'queue.rules.enabled': 'Kullanımda',
  'queue.rules.disabled': 'Duraklatıldı',
  'queue.rules.archived': 'Arşivlendi',
  'queue.rules.edit': 'Kuralı düzenle',
  'queue.rules.archive': 'Kuralı arşivle',
  'queue.rules.archiveHelp':
    'Arşivleme, gelecekteki önerileri durdurur. Zaten ayrılmış alanlar zamanlarını ve nedenlerini korur.',

  'queue.field.name': 'Kural adı',
  'queue.field.nameHelp': 'Daha sonra tanıyacağınız bir ad, örneğin Hafta içi sabahları.',
  'queue.field.timeZone': 'Saat dilimi',
  'queue.field.timeZoneHelp':
    'Pencereler, günlük sayım ve kapalı tarihlerin hepsi bu dilimde okunur.',
  'queue.field.minimumGap': 'Minimum boşluk',
  'queue.field.minimumGapHelp':
    'İki gönderi arasındaki dakika. Sıfır, aralık kuralı olmadığı anlamına gelir.',
  'queue.field.maximumPerDay': 'Gün başına maksimum',
  'queue.field.maximumPerDayHelp':
    'Günlük sınır olmaması için boş bırakın. Sıfır, bu kuralın hiçbir şey önermediği anlamına gelir.',
  'queue.field.maximumPerDayUnlimited': 'Günlük sınır yok',
  'queue.field.priority': 'Öncelik',
  'queue.field.priorityHelp': 'Bir alan sunabilen en yüksek öncelikli kural kullanılır.',
  'queue.field.enabled': 'Bu kuralı kullan',

  'queue.windows.heading': 'Haftalık pencereler',
  'queue.windows.help':
    'Bu projenin gönderi yapabileceği yerel saatleri seçin. Gün ve saat alanlarını veya ızgaradaki düğmeleri kullanın.',
  'queue.windows.empty': 'Henüz pencere yok. Penceresi olmayan bir kural asla bir alan sunamaz.',
  'queue.windows.add': 'Pencere ekle',
  'queue.windows.remove': 'Pencereyi kaldır',
  'queue.windows.entry': '{weekday}, {start} - {end}',
  'queue.windows.start': 'Başlangıç',
  'queue.windows.end': 'Bitiş',
  'queue.windows.weekday': 'Gün',
  'queue.windows.toggleCell': '{weekday}, saat {hour}',
  'queue.windows.gridLabel': 'Haftalık uygunluk, her gün ve saat için bir düğme',

  'queue.weekday.1': 'Pazartesi',
  'queue.weekday.2': 'Salı',
  'queue.weekday.3': 'Çarşamba',
  'queue.weekday.4': 'Perşembe',
  'queue.weekday.5': 'Cuma',
  'queue.weekday.6': 'Cumartesi',
  'queue.weekday.7': 'Pazar',

  'queue.blackouts.heading': 'Kapalı tarihler',
  'queue.blackouts.help': 'Bu projenin gönderi yapmayacağı tarihler, kural saat diliminde okunur.',
  'queue.blackouts.empty': 'Kapalı tarih yok.',
  'queue.blackouts.add': 'Kapalı tarih ekle',
  'queue.blackouts.remove': 'Kapalı tarihi kaldır',
  'queue.blackouts.from': 'İlk gün',
  'queue.blackouts.to': 'Son gün',
  'queue.blackouts.entry': '{from} - {to}',

  'queue.connections.heading': 'Hesaplar',
  'queue.connections.all': 'Bu projedeki her hesap',
  'queue.connections.scoped':
    'Bu kuralın geçerli olduğu {count, plural, one {# hesap} other {# hesap}}',

  'queue.slot.heading': 'Sonraki kuyruk alanı',
  'queue.slot.action': 'Sonraki kuyruk alanını kullan',
  'queue.slot.proposed': '{timeZone} diliminde {local}',
  'queue.slot.utc': 'Bu, UTC’de {utc} demektir.',
  'queue.slot.why': 'Bu zaman neden',
  'queue.slot.accept': 'Bu zamanı kullan',
  'queue.slot.release': 'Başka bir zaman seç',
  'queue.slot.expires': 'Bu öneri {expires} tarihine kadar tutulur.',
  'queue.slot.unavailable': 'Şu anda bir kuyruk alanı kullanılamıyor.',
  'queue.slot.pending': 'Sonraki alan bulunuyor.',
  'queue.slot.accepted': '{timeZone} diliminde {local} için planlandı.',
  'queue.slot.notAutomatic': 'Bu zamanı seçene kadar hiçbir şey planlanmaz.',

  'queue.reason.noRulesConfigured':
    'Bu projede yapılandırılmış kuyruk kuralı yok, bu yüzden hiçbir pencere uygulanmadı.',
  'queue.reason.fallbackFirstFreeHour': 'Bunun yerine şu andan sonraki ilk boş saat kullanıldı.',
  'queue.reason.matchedRule': '{name} kuralı bu zamanı, {zone} diliminde seçti.',
  'queue.reason.matchedWindow': '{zone} diliminde {start} - {end} penceresine denk geliyor.',
  'queue.reason.minimumGap': 'Diğer her gönderiden en az {minutes} dakika uzaklıkta.',
  'queue.reason.noMinimumGap': 'Bu kural, gönderiler arasında minimum boşluk belirlemiyor.',
  'queue.reason.dailyCap': 'O gün en fazla {limit} gönderi barındırıyor ve dolu değil.',
  'queue.reason.dailyCapUnlimited': 'Bu kural günlük sınır belirlemiyor.',
  'queue.reason.blackoutSkipped':
    'Buna ulaşmak için {days, plural, one {# kapalı gün} other {# kapalı gün}} atlandı.',
  'queue.reason.dstNonexistentSkipped':
    'Penceredeki ilk zaman, {zone} diliminde o tarihte mevcut değil, bu yüzden var olan bir sonraki zaman kullanıldı.',
  'queue.reason.dstAmbiguousFirst':
    'O yerel zaman, {zone} diliminde o tarihte iki kez gerçekleşiyor. İlk oluşum kullanıldı.',
  'queue.reason.priorityChosen':
    'Bu kural, sunabilecek en yüksek öncelik olan {priority} önceliğine sahip.',
  'queue.reason.connectionScoped':
    'Bu kural {count, plural, one {# hesabı} other {# hesabı}} kapsıyor.',
  'queue.reason.horizonExhausted': '{days} gün içinde boş bir pencere bulunamadı.',
} as const;
