/**
 * The three project-led use case pages. See `en/web-use-cases.ts`: these
 * describe workflows and what is actually built, never a live publishing
 * claim.
 */
export const webUseCaseMessages = {
  'web.meta.useCases.title': 'Kullanım örnekleri',
  'web.meta.useCases.description':
    'Bu ürünün etrafında inşa edildiği üç iş akışı: birden çok müşteriyi tek bir yerden yönetmek, bir işi yayınlanmadan önce onaylatmak ve tek bir fikri yeniden yazmadan birden çok platforma taşımak.',
  'web.meta.useCase.clients.title': 'Birden çok müşteriyi yönetme',
  'web.meta.useCase.clients.description':
    'Başkaları adına yayın yapan ekipler için ayrı projeler, ayrı bağlı hesaplar, ayrı onaylar ve ayrı raporlama.',
  'web.meta.useCase.approvals.title': 'Onay iş akışları',
  'web.meta.useCase.approvals.description':
    'Bir taslak nasıl onaylanmış bir gönderiye dönüşür: kimin incelediği, neyin bir onayı geçersiz kıldığı ve aynı kuralın her yüzeyde neden geçerli olduğu.',
  'web.meta.useCase.crossPlatform.title': 'Platformlar arası yayınlama',
  'web.meta.useCase.crossPlatform.description':
    'Bir ana taslak, platform başına bir uyarlanmış sürüm, herhangi bir şey planlanmadan önce her platformun kayıtlı sınırlarına göre doğrulanır.',

  'web.useCases.index.title': 'Kullanım örnekleri',
  'web.useCases.index.lede':
    'Bu ürünün etrafında inşa edildiği üç iş akışı. Her sayfa, iş akışının bugün bir ekibe neye mal olduğunu, ürünün bunu nasıl ele alacak şekilde tasarlandığını ve hangi kısımların gerçekten inşa edildiğini söyler.',
  'web.useCases.index.listLabel': 'Kullanım örnekleri',

  'web.useCases.notice.title': 'Bu bir tasarımı anlatır, çalışan bir hizmeti değil',
  'web.useCases.notice.body':
    'Üretimde doğrulanmış hiçbir bağlayıcı yok, bu yüzden bu sayfadaki hiçbir şey henüz hiçbir yere yayınlanmıyor. İş akışının bir parçası inşa edildiyse bu belirtilir. İnşa edilmediyse o da belirtilir.',

  'web.useCases.section.problem': 'Sorun',
  'web.useCases.section.approach': 'Ürün nasıl tasarlandı',
  'web.useCases.section.today': 'Gerçekte ne inşa edildi',
  'web.useCases.section.related': 'İlgili',

  'web.useCases.clients.title': 'Birden çok müşteriyi yönetme',
  'web.useCases.clients.lede':
    'Bir müşteri için yapılan iş, asla yanlış bir tıklamayla başka bir müşterinin kitlesine bir adım uzaklıkta olmamalıdır.',
  'web.useCases.clients.problem':
    'Çoğu ekip, müşterileri dikkatli olarak ayırır. Tek bir paylaşılan hesap her bağlı sayfayı tutar, tek bir takvim her planı tutar ve bir müşteri taslağı ile yanlış kitle arasında duran tek şey, akşam 6’da ekrana bakan kişidir. Biri ekipten ayrıldığında, ayrım da o alışkanlıkla birlikte gider.',
  'web.useCases.clients.approach1':
    'Bir proje, ayrımın birimidir. Bağlı hesaplar, taslaklar, kuyruklar, medya ve alındılar bir projeye aittir ve bir üye yalnızca eklendiği projeleri görür.',
  'web.useCases.clients.approach2':
    'Ayrım üç kez uygulanır: kimlik doğrulamada, eylemi yetkilendiren uygulama hizmetinde ve satır düzeyinde güvenlik aracılığıyla veritabanının kendisinde. Oturum açmış olmak asla izin olarak kabul edilmez.',
  'web.useCases.clients.approach3':
    'Raporlama aynı sınırı takip eder, bu yüzden müşteri başına bir rapor, birinin elle bir araya getirdiği bir e-tablo yerine varsayılan şekildir.',
  'web.useCases.clients.today':
    'Projeler, proje kapsamlı üyelik ve arkalarındaki satır düzeyinde güvenlik politikaları inşa edilmiş ve test edilmiştir, projeler arası okuma denemesi yapıp başarısız olduğunu doğrulayan testler de dahil. Planlar, bir ekibin ihtiyaç duyduğu proje sayısına göre boyutlandırılır. Henüz hiçbir projeden bir platforma hiçbir şey yayınlanmıyor.',

  'web.useCases.approvals.title': 'Onay iş akışları',
  'web.useCases.approvals.lede':
    'Bir onay, yalnızca onaylanan şey gerçekten yayınlanan şeyse bir değer taşır.',
  'web.useCases.approvals.problem':
    'Onaylar genellikle yayınlayan aracın dışında yaşar. Bir ekran görüntüsü müşteriye gider, müşteri evet der ve sonra metin değişir. Onay artık kimsenin sahip olmadığı bir taslağa atıfta bulunur ve aracın haberi olmaz, bu yüzden son verilen her neyse onu yayınlar.',
  'web.useCases.approvals.approach1':
    'Bir onay, incelenen tam içeriğe eklenir. Onaylanmış bir taslağı düzenlemek onayı geçersiz kılar ve eski kararı sessizce taşımak yerine hangi alanın değiştiğini söyler.',
  'web.useCases.approvals.approach2':
    'Bir inceleyen onaylayabilir, değişiklik isteyebilir veya reddedebilir ve onay dışındaki her şey için bir yorum gerekir, bu yüzden yazar neyi düzelteceğini asla tahmin etmek zorunda kalmaz.',
  'web.useCases.approvals.approach3':
    'Kural, paylaşılan uygulama katmanında yaşar, bu yüzden web uygulaması, REST API, MCP sunucusu, CLI ve web kancalarının hepsi ona uyar. Hiçbir yüzeyin inceleme etrafında bir kısayolu yoktur.',
  'web.useCases.approvals.today':
    'Onay durumları, inceleme yüzeyi, yeniden onay kuralları ve arkalarındaki denetim olayları inşa edilmiştir. İnşa edilmeyen son adımdır, çünkü hiçbir bağlayıcı tamamlanma tanımını geçmemiştir, bu yüzden onaylanmış bir gönderinin henüz gidecek bir yeri yoktur.',

  'web.useCases.crossPlatform.title': 'Platformlar arası yayınlama',
  'web.useCases.crossPlatform.lede':
    'Bir fikir, bir düzenleme ve o platformun gerçekte kabul ettiğine saygı duyan platform başına bir sürüm.',
  'web.useCases.crossPlatform.problem':
    'Aynı metni her yerde paylaşmak, bir platformda kesilen, bir başkasında gerekli bir başlığı eksik olan ve üçüncüsünün sessizce çıkardığı bir bağlantı taşıyan bir sürüm üretir. Alternatif olan, beş kez elle yeniden yazmak, işin gerçekte gittiği yerdir.',
  'web.useCases.crossPlatform.approach1':
    'Bir ana taslak fikri tutar. Seçilen her hesap kendi sürümünü alır ve ana taslaktaki bir düzenleme yalnızca uyduğu yerde uygulanır, hangi hedeflerin bunu alamadığını ve nedenini açıkça söyler.',
  'web.useCases.crossPlatform.approach2':
    'Doğrulama, her platform için kayıtlı sınırlara karşı, o platformun saydığı şekilde çalışır, bu yüzden bir karakter tavanı, platformun grafem kullandığı yerde grafemlerde ve ağırlıklı birim kullandığı yerde ağırlıklı birimlerde kontrol edilir.',
  'web.useCases.crossPlatform.approach3':
    'Bu sitede herhangi bir yerde gösterilen her platform sınırı, bağlayıcı kayıt defterinden oluşturulur ve geldiği belgeyi ve birinin onu okuduğu tarihi taşır.',
  'web.useCases.crossPlatform.today':
    'Kompozisyon aracı, hedef başına sürümler, doğrulama kuralları ve oluşturulan sınırlar veri kümesi inşa edilmiştir. Yayınlama adımı inşa edilmemiştir: üretimde hiçbir bağlayıcı doğrulanmamıştır, bu yüzden doğrulanmış bir taslak dahili olarak planlanabilir ama bir platforma ulaşamaz.',
} as const;
