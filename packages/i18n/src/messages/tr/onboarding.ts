/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Röleyi Ayarla',
  'onboarding.progress': 'Adım {current} / {total}',
  'onboarding.skipForNow': 'Şimdilik atla',
  'onboarding.goal': 'On dakikadan kısa sürede doğrulanmış, planlanmış bir gönderi.',

  'onboarding.plan.title': 'Nasıl ödeme yapmak istediğinizi seçin',
  'onboarding.plan.help': 'Tek plan, her özellik. Aralığı istediğiniz zaman değiştirin.',

  'onboarding.workspace.title': 'Çalışma alanınıza ad verin',
  'onboarding.workspace.namePlaceholder': 'Şirketinizin veya müşterinizin adı',
  'onboarding.workspace.timeZone': 'Planlama için saat dilimi',
  'onboarding.workspace.timeZoneHelp':
    'Planlanan her zaman bu bölgede saklanır, bu nedenle saat değişikliği hiçbir zaman gönderinizi kazara hareket ettirmez.',
  'onboarding.workspace.locale': 'Arayüz dili',

  'onboarding.role.title': 'Seni en iyi ne tanımlar?',
  'onboarding.role.creator': 'Yaratıcı',
  'onboarding.role.team': 'Ev ekibi',
  'onboarding.role.agency': 'Ajans',
  'onboarding.role.developer': 'Geliştirici veya temsilci oluşturucu',
  'onboarding.role.help':
    'Bu, önerdiğimiz varsayılanları değiştirir. Her şeyi daha sonra değiştirebilirsiniz.',

  'onboarding.connect.title': 'İlk hesabınızı bağlayın',
  'onboarding.connect.help':
    'Herhangi bir şeyi onaylamadan önce size her platform için tam olarak hangi izinlerin istendiğini göstereceğiz.',
  'onboarding.connect.skipNote':
    'Önce örnek hesapla keşfedebilirsiniz. Ondan hiçbir şey yayınlanmaz.',
  'onboarding.connect.success': '{account} bağlandı.',

  'onboarding.content.title': 'Zaten sahip olduğunuz bir şeyle başlayın',
  'onboarding.content.useAsset': 'Bir resim veya video kullanın',
  'onboarding.content.useBrief': 'Kısa bir özetten başlayın',
  'onboarding.content.useText': 'Kendin yaz',

  'onboarding.preview.title': 'Yayınlanacak şey bu',
  'onboarding.preview.help': 'Bu hesaba ilişkin platform kurallarından gerçek bir önizleme.',

  'onboarding.schedule.title': 'Ne zaman çıkacağını seçin',
  'onboarding.schedule.help':
    'Süreyi, gizlilik ayarını, açıklamayı ve tahmini sağlayıcı maliyetini inceleyin.',

  'onboarding.done.title': 'planlanmış',
  'onboarding.done.body': 'Gönderiniz {timeZone} içinde {time} için planlandı.',
  'onboarding.done.nextStep.title': 'Bundan sonra ne yapmalı',
  'onboarding.done.nextStep.connectMore': 'Başka bir hesaba bağlan',
  'onboarding.done.nextStep.inviteTeam': 'Bir takım arkadaşını davet et',
  'onboarding.done.nextStep.setApproval': 'Onay politikası belirleyin',
  'onboarding.done.nextStep.exploreApi': 'API ve MCP sunucusunu keşfedin',

  'onboarding.checklist.title': 'Başlarken',
  'onboarding.checklist.connectAccount': 'Bir hesap bağlayın',
  'onboarding.checklist.firstPost': 'Gönderi yayınlama veya planlama',
  'onboarding.checklist.inviteTeammate': 'Bir takım arkadaşını davet et',
  'onboarding.checklist.setBrandVoice': 'Marka sesinizi tanımlayın',
  'onboarding.checklist.tryAutomation': 'Bir otomasyon kuralını deneyin',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Hepsi tamamlandı} one {# adım sola} other {# adım kaldı}}',
} as const;
