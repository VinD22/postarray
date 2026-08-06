/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'الوكلاء وواجهة برمجة التطبيقات',
  'developer.subtitle':
    'تستخدم واجهة برمجة التطبيقات وخادم MCP وCLI نفس الأذونات وسياسة الموافقة والإيصالات مثل التطبيق.',

  'developer.serviceAccount.title': 'حسابات الخدمة',
  'developer.serviceAccount.create': 'إنشاء حساب الخدمة',
  'developer.serviceAccount.name': 'الاسم',
  'developer.serviceAccount.scopeBrands': 'Brands والحسابات التي يمكنه استخدامها',
  'developer.serviceAccount.scopePlatforms': 'المنصات',
  'developer.serviceAccount.scopeLocales': 'لغات المحتوى',
  'developer.serviceAccount.scopeDomains': 'مجالات الارتباط المسموح بها',
  'developer.serviceAccount.scopeHours': 'الساعات المسموح بها',
  'developer.serviceAccount.scopeCadence': 'الحد الأقصى للمشاركات في اليوم الواحد',
  'developer.serviceAccount.scopeLookAhead': 'إلى أي مدى قد يكون جدولا زمنيا',
  'developer.serviceAccount.approvalLevel': 'مستوى الموافقة',
  'developer.serviceAccount.killSwitch': 'أوقفوا هذا الوكيل',

  'developer.approvalLevel.0': 'القراءة والتحقق فقط',
  'developer.approvalLevel.1': 'إنشاء وتحرير المسودات',
  'developer.approvalLevel.2': 'الجدول الزمني داخل الحدود المبينة أعلاه',
  'developer.approvalLevel.3': 'اسأل الشخص قبل النشر',
  'developer.approvalLevel.description.0':
    'يمكن للوكيل الاطلاع على الحسابات والإمكانيات والتقويمات والتحليلات. لا يغير شيئا.',
  'developer.approvalLevel.description.1':
    'يمكن للوكيل كتابة المسودات. لا يزال الشخص يقوم بالجدولة والنشر.',
  'developer.approvalLevel.description.2':
    'يمكن للوكيل جدولة الحسابات والساعات والإيقاع واللغات والمجالات والتطلع إلى المستقبل الذي تحدده. وأي شيء خارج تلك الحدود يحتاج إلى إنسان.',
  'developer.approvalLevel.description.3':
    'النشر الفوري، أو حساب أو مجال جديد، أو إجراء مجمع، أو محتوى حساس، أو تغيير إعداد الخصوصية يحتاج دائمًا إلى تأكيد صريح من الشخص.',
  'developer.bulkThreshold':
    'السائبة تعني أكثر من {publications, plural, one {#النشر الخارجي} zero {# منشورات خارجية} two {# منشورات خارجية} few {# منشورات خارجية} many {# منشورات خارجية} other {# منشورات خارجية}} في طلب واحد، أو نفس المحتوى لأكثر من {accounts, plural, one {# حساب} zero {#حسابات} two {#حسابات} few {#حسابات} many {#حسابات} other {#حسابات}}.',

  'developer.credential.title': 'أوراق الاعتماد',
  'developer.credential.create': 'قم بإنشاء مفتاح API',
  'developer.credential.shownOnce':
    'يتم عرض بيانات الاعتماد هذه مرة واحدة. انسخه الآن. نقوم بتخزين تجزئة منه فقط.',
  'developer.credential.prefix': 'بادئة',
  'developer.credential.created': 'تم الإنشاء {date} بواسطة {name}',
  'developer.credential.lastUsed': 'آخر استخدام {relativeTime}',
  'developer.credential.neverUsed': 'لم تستخدم قط',
  'developer.credential.expires': 'تنتهي الصلاحية {date}',
  'developer.credential.revokeConfirm':
    'هل تريد إلغاء بيانات الاعتماد هذه؟ أي شيء يستخدمه يتوقف عن العمل على الفور.',

  'developer.scope.title': 'النطاقات',
  'developer.scope.accountsRead': 'قراءة الحسابات المتصلة وإمكانياتها',
  'developer.scope.draftsWrite': 'إنشاء وتحرير المسودات',
  'developer.scope.postsSchedule': 'جدولة المحتوى المعتمد',
  'developer.scope.postsPublish': 'انشر على الفور',
  'developer.scope.analyticsRead': 'قراءة التحليلات',
  'developer.scope.receiptsRead': 'قراءة إيصالات النشر',
  'developer.scope.webhooksWrite': 'إدارة خطافات الويب',
  'developer.scope.connectionsAdmin': 'ربط وفصل الحسابات',
  'developer.scope.billingRead': 'قراءة حالة الفواتير',
  'developer.scope.consequential': 'تبعية',
  'developer.scope.readOnly': 'اقرأ فقط',

  'developer.setup.title': 'ربط العميل',
  'developer.setup.claudeCode': 'كلود كود',
  'developer.setup.codex': 'الدستور الغذائي',
  'developer.setup.hermes': 'هيرميس',
  'developer.setup.buzz': 'سير عمل الطنانة',
  'developer.setup.cli': 'سطر الأوامر',
  'developer.setup.genericMcp': 'أي عميل MCP',
  'developer.setup.copyConfig': 'نسخ التكوين',
  'developer.setup.mcpEndpoint': 'نقطة النهاية MCP',
  'developer.setup.apiBaseUrl': 'عنوان URL الأساسي لواجهة برمجة التطبيقات',

  'developer.playground.title': 'التشغيل الجاف',
  'developer.playground.description':
    'تشغيل الأدوات ضد البيانات المصنفة. لا شيء يصل إلى منصة حقيقية.',
  'developer.playground.run': 'تشغيل',
  'developer.playground.sandboxBadge': 'رمل',

  'developer.activity.title': 'النشاط الأخير',
  'developer.activity.toolCall': '{tool} تم الاتصال به بواسطة {actor} {relativeTime}',
  'developer.activity.denied': 'تم الرفض: {reason}',
  'developer.activity.empty': 'لا توجد مكالمات حتى الآن.',
  'developer.activity.redacted': 'يتم تخزين أجسام الطلب والاستجابة مع إزالة الأسرار.',

  'developer.apps.title': 'تطبيقات المطورين',
  'developer.apps.subtitle':
    'اسمح لمنتج آخر بالتصرف من خلال Relay بالأذونات التي يمنحها المستخدم له.',
  'developer.apps.create': 'قم بتسجيل تطبيق',
  'developer.apps.name': 'اسم التطبيق',
  'developer.apps.type.label': 'نوع العميل',
  'developer.apps.type.public': 'العامة، لا يمكن أن تبقي سرا',
  'developer.apps.type.confidential': 'سري، ويعمل على الخادم',
  'developer.apps.homepage': 'عنوان URL للصفحة الرئيسية',
  'developer.apps.privacyUrl': 'عنوان URL لسياسة الخصوصية',
  'developer.apps.termsUrl': 'عنوان URL للشروط',
  'developer.apps.logo': 'الشعار',
  'developer.apps.redirectUris': 'إعادة توجيه عناوين URI',
  'developer.apps.redirectUrisHelp': 'المطابقات الدقيقة فقط. يتم رفض أحرف البدل والمسارات الجزئية.',
  'developer.apps.clientId': 'معرف العميل',
  'developer.apps.clientSecret': 'سر العميل',
  'developer.apps.secretShownOnce':
    'يظهر السر مرة واحدة. قم بتدويرها إذا فقدتها. لن نظهر ذلك مرة أخرى.',
  'developer.apps.status.draft': 'مسودة',
  'developer.apps.status.active': 'نشط',
  'developer.apps.status.disabled': 'معطل',
  'developer.apps.consentPreview': 'معاينة شاشة الموافقة',
  'developer.apps.grants.title': 'المنح النشطة',
  'developer.apps.grants.count':
    '{count, plural, one {#منحة} zero {#المنح} two {#المنح} few {#المنح} many {#المنح} other {#المنح}}',
  'developer.apps.deleteConfirm':
    'هل تريد حذف هذا التطبيق؟ يتم إلغاء كل منحة وتتوقف رموزها عن العمل.',

  'developer.consent.title': '{app} يريد الوصول إلى مساحة العمل الخاصة بك',
  'developer.consent.workspace': 'Workspace',
  'developer.consent.brands': 'Brands والحسابات',
  'developer.consent.willBeAbleTo': '{app} سيكون قادرًا على ذلك',
  'developer.consent.willNotBeAbleTo': '{app} لن يتمكن من ذلك',
  'developer.consent.approvalStillApplies':
    'سياسة الموافقة الخاصة بك لا تزال سارية. لا يمكن لهذا التطبيق النشر حوله.',
  'developer.consent.revokeAnyTime': 'يمكنك إلغاء هذا من الإعدادات في أي وقت.',
  'developer.consent.allow': 'السماح بالوصول',
  'developer.consent.deny': 'لا تسمح',
  'developer.consent.developerIdentity': 'تم النشر بواسطة {developer}',

  'developer.grants.title': 'التطبيقات التي لديها إمكانية الوصول',
  'developer.grants.grantedOn': 'منحت {date}',
  'developer.grants.lastUsed': 'آخر استخدام {relativeTime}',
  'developer.grants.revoke': 'إبطال الوصول',
  'developer.grants.revoked': 'تم إبطال الوصول. لن تتأثر اتصالاتك الخاصة والمشاركات المجدولة.',

  'developer.docs.openapi': 'مستند OpenAPI',
  'developer.docs.clients': 'العملاء الذين تم إنشاؤهم',
  'developer.docs.idempotency':
    'أرسل مفتاح عدم الكفاءة مع كل طلب إنشاء وجدولة ونشر. يؤدي تكرار الطلب بنفس المفتاح إلى إرجاع النتيجة الأصلية بدلاً من النشر مرتين.',
  'developer.docs.pagination': 'يتم ترقيم النتائج بالمؤشر. الأوقات صريحة وتتضمن منطقة.',
  'developer.docs.rateLimits': 'يتم تطبيق حدود المعدل لكل مساحة عمل وبيانات اعتماد ومسار وموصل.',
} as const;
