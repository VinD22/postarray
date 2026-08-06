/** Workspace settings: members, roles, brands, localization, security, data. */
export const settingsMessages = {
  'settings.title': 'الإعدادات',
  'settings.saved': 'تم الحفظ',
  'settings.unsavedChanges': 'لديك تغييرات غير محفوظة.',

  'settings.workspace.title': 'Workspace',
  'settings.workspace.name': 'Workspace الاسم',
  'settings.workspace.defaultTimeZone': 'المنطقة الزمنية الافتراضية',
  'settings.workspace.defaultLocale': 'لغة الواجهة الافتراضية',
  'settings.workspace.defaultContentLocale': 'لغة المحتوى الافتراضية',
  'settings.workspace.transferOwnership': 'نقل الملكية',
  'settings.workspace.delete': 'حذف مساحة العمل',
  'settings.workspace.deleteWarning':
    'يؤدي حذف مساحة العمل إلى إلغاء المشاركات المجدولة، وإلغاء الاتصالات، وإزالة الوسائط المخزنة. يتم الاحتفاظ بالإيصالات لفترة الاحتفاظ المنصوص عليها في الشروط.',

  'settings.members.title': 'الأعضاء والأدوار',
  'settings.members.invite': 'دعوة الناس',
  'settings.members.inviteEmail': 'عنوان البريد الإلكتروني',
  'settings.members.inviteSent': 'تم إرسال الدعوة إلى {email}.',
  'settings.members.pending': 'تمت دعوته، ولم يتم قبوله بعد',
  'settings.members.count':
    '{count, plural, one {#عضو} zero {#أعضاء} two {#أعضاء} few {#أعضاء} many {#أعضاء} other {#أعضاء}}',
  'settings.members.removeConfirm':
    'هل تريد إزالة {name} من مساحة العمل هذه؟ تظل إجراءاتهم السابقة في سجل التدقيق.',
  'settings.role.owner.label': 'مالك',
  'settings.role.admin.label': 'المشرف',
  'settings.role.manager.label': 'مدير',
  'settings.role.editor.label': 'محرر',
  'settings.role.approver.label': 'الموافق',
  'settings.role.analyst.label': 'محلل',
  'settings.role.viewer.label': 'عارض',
  'settings.role.owner.description': 'كل شيء، بما في ذلك الفوترة والأمن والحذف.',
  'settings.role.admin.description': 'كل شيء باستثناء الفوترة وحذف مساحة العمل.',
  'settings.role.manager.description':
    'إدارة العلامات التجارية والاتصالات والجداول الزمنية والقواعد.',
  'settings.role.editor.description': 'إنشاء وتحرير المحتوى وطلب الموافقة.',
  'settings.role.approver.description':
    'الموافقة على المحتوى أو رفضه، وجدولة ما سيتم الموافقة عليه.',
  'settings.role.analyst.description': 'قراءة التحليلات والإيصالات.',
  'settings.role.viewer.description': 'اقرأ فقط.',
  'settings.role.scopeLabel': 'يقتصر على العلامات التجارية والحسابات',
  'settings.role.mfaRequired': 'يجب على المالكين استخدام المصادقة الثنائية.',

  'settings.brands.title': 'Brands',
  'settings.brands.add': 'أضف علامة تجارية',
  'settings.brands.voice': 'صوت',
  'settings.brands.audience': 'الجمهور',
  'settings.brands.approvedClaims': 'المطالبات المعتمدة',
  'settings.brands.blockedTerms': 'المصطلحات المحظورة',
  'settings.brands.disclosureDefaults': 'افتراضيات الإفصاح',
  'settings.brands.domains': 'المجالات',
  'settings.brands.glossary.title': 'مسرد',
  'settings.brands.glossary.term': 'مصطلح',
  'settings.brands.glossary.preferred': 'الترجمة المفضلة',
  'settings.brands.glossary.prohibited': 'لا تترجم كما',
  'settings.brands.glossary.context': 'السياق',
  'settings.brands.glossary.keepUntranslated': 'تبقى غير مترجمة',
  'settings.brands.localeRules.title': 'القواعد المحلية',
  'settings.brands.localeRules.formality': 'شكليات',
  'settings.brands.localeRules.pronouns': 'الضمائر والتكريمات',
  'settings.brands.localeRules.idioms': 'التعابير لتجنب',
  'settings.brands.localeRules.emoji': 'معايير الرموز التعبيرية والهاشتاج',
  'settings.brands.localeRules.legal': 'الإفصاحات القانونية الإقليمية',
  'settings.brands.localeRules.cta': 'دعوة للعمل من قبل السوق',
  'settings.brands.localeRules.reviewedExamples': 'أمثلة معتمدة من قبل مراجع محلي',

  'settings.sets.title': 'مجموعات',
  'settings.sets.description':
    'مجموعة قابلة لإعادة الاستخدام من الأهداف والمتغيرات والإعدادات والتعليقات والتأخيرات. يؤدي تطبيق مجموعة إلى إنشاء مسودة مستقلة.',
  'settings.sets.editNote':
    'لا يؤدي تحرير المجموعة إلى تغيير المنشورات التي تمت الموافقة عليها أو جدولتها بالفعل.',
  'settings.signatures.title': 'التوقيعات',
  'settings.signatures.description':
    'إغلاق النص أو علامات التصنيف أو الروابط أو الإفصاحات، ويتم تحديد نطاقها حسب العلامة التجارية والنظام الأساسي واللغة.',
  'settings.signatures.autoApply': 'أضف تلقائيًا عندما يتطابق السياق',

  'settings.localization.title': 'التعريب',
  'settings.localization.interfaceLocale': 'لغة الواجهة',
  'settings.localization.interfaceLocaleHelp': 'لغة هذا التطبيق بالنسبة لك. لا يغير لغة مشاركاتك.',
  'settings.localization.contentLocales': 'لغات المحتوى',
  'settings.localization.contentLocalesHelp':
    'اللغات التي تنشر بها. يمكن لكل علامة تجارية وضع قواعد ومسرد لكل لغة.',
  'settings.localization.marketLocales': 'أسواق الجمهور',
  'settings.localization.beta': 'ترجمة بيتا',
  'settings.localization.betaHelp':
    'هذه اللغة مدعومة آليًا ولم تتم مراجعتها بشكل كامل من قبل أي شخص حتى الآن. يعود النص غير المترجم إلى اللغة الإنجليزية.',
  'settings.localization.humanReviewed': 'تمت المراجعة من قبل متحدث أصلي',
  'settings.localization.timeZone': 'المنطقة الزمنية',
  'settings.localization.weekStart': 'اليوم الأول من الأسبوع',
  'settings.localization.hourCycle.label': 'تنسيق الوقت',
  'settings.localization.hourCycle.h12': '12 ساعة',
  'settings.localization.hourCycle.h23': '24 ساعة',

  'settings.notifications.title': 'الإخطارات',
  'settings.notifications.email': 'البريد الإلكتروني',
  'settings.notifications.inApp': 'في التطبيق',
  'settings.notifications.approvalRequests': 'طلبات الموافقة',
  'settings.notifications.publishResults': 'نشر النتائج',
  'settings.notifications.connectionHealth': 'صحة الاتصال',
  'settings.notifications.ruleFailures': 'فشل الأتمتة',
  'settings.notifications.weeklySummary': 'ملخص أسبوعي',
  'settings.notifications.digestOnly': 'اجمعها في رسالة يومية واحدة',

  'settings.security.title': 'الأمن',
  'settings.security.mfa': 'المصادقة الثنائية',
  'settings.security.mfaEnable': 'قم بتشغيل المصادقة الثنائية',
  'settings.security.mfaRequiredFor':
    'مطلوب لتغييرات الفواتير وحسابات الخدمة وإعادة توصيل الحساب وإلغاء بيانات الاعتماد.',
  'settings.security.passkeys': 'مفاتيح المرور',
  'settings.security.sessions': 'جلسات نشطة',
  'settings.security.sessionRevoke': 'تسجيل الخروج من هذه الجلسة',
  'settings.security.auditLog.title': 'سجل التدقيق',
  'settings.security.auditLog.description':
    'كل عمل، من أو ماذا قام به، ومتى. قابلة للتصدير من قبل المالكين والمشرفين.',
  'settings.security.killSwitch': 'توقف اضطراري',
  'settings.security.killSwitchBody':
    'يوقف كل عملية نشر وأتمتة مجدولة في مساحة العمل هذه على الفور. لا يتم حذف أي شيء. يمكنك إيقاف تشغيله مرة أخرى.',
  'settings.security.killSwitchActive': 'توقف الطوارئ قيد التشغيل. لن يتم نشر أي مشاركة.',

  'settings.data.title': 'ضوابط البيانات',
  'settings.data.export': 'تصدير البيانات الخاصة بك',
  'settings.data.exportPreparing':
    'إعداد التصدير الخاص بك. سنرسل إليك بريدًا إلكترونيًا عندما يكون جاهزًا.',
  'settings.data.deletionRequest': 'طلب الحذف',
  'settings.data.deletionExplain':
    'يؤدي الحذف إلى إلغاء سير العمل المقرر، وإلغاء وصول الموفر، وإزالة الوسائط المخزنة وتحليلات شواهد القبور حيث يطلبها الموفر.',
  'settings.data.retention': 'الاحتفاظ',
  'settings.data.consents': 'الموافقات',
  'settings.data.consent.productAnalytics': 'تحليلات المنتج',
  'settings.data.consent.diagnostics': 'مشاركة التشخيص مع الدعم',
  'settings.data.consent.aiImprovement':
    'استخدم المحتوى الخاص بي لتحسين المساعد. يتم إيقاف هذا إلا إذا قمت بتشغيله.',
  'settings.data.consent.marketingEmail': 'أخبار المنتج عن طريق البريد الإلكتروني',
} as const;
