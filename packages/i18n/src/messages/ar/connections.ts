/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'اتصالات',
  'connection.subtitle': 'الحسابات والصفحات والقنوات التي يمكن لمساحة العمل هذه النشر عليها.',
  'connection.add': 'ربط حساب',
  'connection.count':
    '{used, plural, one {#قناة نشطة} zero {#قنوات نشطة} two {#قنوات نشطة} few {#قنوات نشطة} many {#قنوات نشطة} other {#قنوات نشطة}} من {limit}',
  'connection.limitReached':
    'تستخدم مساحة العمل هذه جميع قنوات {limit}. افصل أحدهما قبل توصيل الآخر.',

  'connection.account.label': 'الحساب',
  'connection.account.type.profile': 'الملف الشخصي',
  'connection.account.type.page': 'الصفحة',
  'connection.account.type.channel': 'قناة',
  'connection.account.type.group': 'المجموعة',
  'connection.account.type.organization': 'التنظيم',
  'connection.account.type.business': 'حساب الأعمال',
  'connection.account.type.creator': 'حساب الخالق',
  'connection.connectedBy': 'متصل بواسطة {name} على {date}',
  'connection.lastPublished': 'آخر نشر {relativeTime}',
  'connection.lastPublishedNever': 'لم يتم نشر أي شيء من هذا الحساب حتى الآن',
  'connection.lastAnalyticsSync': 'تمت مزامنة التحليلات {relativeTime}',

  'connection.status.healthy': 'العمل',
  'connection.status.expiringSoon': 'تنتهي الصلاحية {relativeTime}',
  'connection.status.expired': 'انتهت صلاحية الوصول',
  'connection.status.revoked': 'تم إبطال الوصول',
  'connection.status.paused': 'متوقف مؤقتًا',
  'connection.status.permissionMissing': 'إذن مفقود',
  'connection.status.reviewPending': 'في انتظار مراجعة المنصة',
  'connection.status.unknown': 'الصحة غير متوفرة',

  'connection.token.expiresAt': 'تنتهي صلاحية الوصول {date}',
  'connection.token.expiryUnknown': '{provider} لا يخبرنا بموعد انتهاء صلاحية الوصول.',

  'connection.permissions.title': 'الأذونات',
  'connection.permissions.granted': 'منح',
  'connection.permissions.missing': 'غير ممنوحة',
  'connection.permissions.explainBeforeOAuth':
    'Relay سوف يطلب {provider} لهذه الأذونات. يمكنك قطع الاتصال في أي وقت.',
  'connection.permissions.whyNeeded': 'لماذا هذا مطلوب',

  'connection.reconnect.title': 'أعد الاتصال {account}',
  'connection.reconnect.body':
    'المشاركات المجدولة لهذا الحساب معلقة حتى يتم إعادة الاتصال به. لا شيء يضيع.',
  'connection.disconnect.title': 'افصل {account}؟',
  'connection.disconnect.body':
    'لن يتم نشر المشاركات المجدولة لهذا الحساب. تبقى الإيصالات والتحليلات التي تم جمعها بالفعل في مساحة العمل هذه.',
  'connection.pause.body':
    'يحتفظ الحساب المتوقف مؤقتًا بسجله وجدوله الزمني، لكنه لا ينشر حتى تستأنفه.',

  'connection.incident.invalidToken':
    '{provider} رفض الوصول المخزن لـ {account}. أعد الاتصال لاستعادة النشر.',
  'connection.incident.permissionLost':
    '{account} لم يعد يمنح {permission}. أعد الاتصال واقبل هذا الإذن.',
  'connection.incident.roleLost':
    'لم يعد لمستخدم {provider} دور في {account}. اطلب من مسؤول تلك الصفحة استعادتها.',
  'connection.incident.accountTypeInvalid':
    'Instagram يحتاج إلى حساب احترافي. قم بتحويل {account} إلى حساب تجاري أو حساب منشئ، ثم أعد الاتصال.',
  'connection.incident.reviewRestricted':
    '{provider} قام بتقييد هذا التطبيق في انتظار المراجعة. يتم نشر المشاركات من {account} بشكل خاص حتى اكتمال المراجعة.',

  'connection.group.title': 'مجموعات العملاء',
  'connection.group.description':
    'قم بتجميع الحسابات حسب العميل أو العلامة التجارية لتصفية كل شاشة.',
  'connection.group.assign': 'الانتقال إلى المجموعة',
  'connection.group.none': 'غير مجمعة',
  'connection.group.moveNote': 'يؤدي نقل الحساب إلى الاحتفاظ بمنشوراته وإيصالاته وتحليلاته.',

  'connection.oauth.starting': 'الافتتاح {provider}',
  'connection.oauth.returned': 'الانتهاء من الاتصال',
  'connection.oauth.chooseAccounts': 'اختر الحسابات التي تريد ربطها',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'لا يمكن ربط أي حسابات في تسجيل الدخول {provider} هذا. {reason}',
  'connection.oauth.canceled': 'تم إلغاء الاتصال بتاريخ {provider}. لم يتغير شيء.',
  'connection.oauth.alreadyConnected': '{account} متصل بالفعل بمساحة العمل هذه.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} متصل بمساحة عمل أخرى. افصله هناك أولاً.',

  'capability.title': 'ما يدعمه هذا الحساب',
  'capability.matrix.title': 'قدرات المنصة',
  'capability.matrix.subtitle': 'تم إنشاؤها من تعريفات الموصل التي نحتفظ بها ونراجعها يدويًا.',
  'capability.level.supported': 'المدعومة',
  'capability.level.unsupported': 'لا تقدمها المنصة',
  'capability.level.not_implemented': 'لم يتم بناؤها بعد',
  'capability.level.requires_review': 'يحتاج إلى مراجعة المنصة',
  'capability.level.beta': 'بيتا',
  'capability.level.unknown': 'غير متاح',
  'capability.explain.supported': 'Relay يمكنه القيام بذلك لهذا الحساب اليوم.',
  'capability.explain.unsupported':
    '{provider} لا يقدم هذا من خلال واجهة برمجة التطبيقات الرسمية الخاصة به، لذلك لا توجد أداة يمكنها القيام بذلك بأمان.',
  'capability.explain.not_implemented':
    '{provider} يقدم هذا، لكن Relay لم يقم ببنائه بعد. إنه موجود على خريطة طريق الموصل.',
  'capability.explain.requires_review':
    '{provider} لا يمنح هذا إلا بعد مراجعة التطبيق أو الحساب. ويظل غير متاح حتى تتم هذه المراجعة.',
  'capability.explain.beta':
    'يعمل هذا، مع حدود لم ننتهي من التحقق منها بعد. تأكد من النتيجة قبل أن تعتمد عليها.',
  'capability.explain.unknown':
    'لم نتمكن من قراءة الأذونات الحالية لهذا الحساب. أعد الاتصال لتحديثها.',
  'capability.lastChecked': 'تم الفحص {relativeTime}',
  'capability.feature.text': 'المشاركات النصية',
  'capability.feature.image': 'الصور',
  'capability.feature.carousel': 'دائري',
  'capability.feature.video': 'فيديو',
  'capability.feature.document': 'المستندات',
  'capability.feature.firstComment': 'تمت جدولة التعليق الأول',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'يذكر الأصلي',
  'capability.feature.destinations': 'اختيار الوجهة',
  'capability.feature.privacy': 'ضوابط الخصوصية',
  'capability.feature.thumbnail': 'صورة مصغرة مخصصة',
  'capability.feature.altText': 'نص بديل',
  'capability.feature.analytics': 'التحليلات',
  'capability.feature.delete': 'حذف مشاركة منشورة',
  'capability.feature.commentCount': 'عدد التعليقات',
  'capability.feature.commentReplies': 'قراءة التعليقات والرد عليها',
  'capability.feature.disclosure': 'الكشف الآلي',
} as const;
