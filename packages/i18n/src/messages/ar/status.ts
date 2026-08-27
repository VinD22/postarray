/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'لا شيء مقرر بعد',
  'empty.calendar.body': 'اكتب مشاركتك الأولى واختر الوقت. يمكنك تغييره لاحقا.',
  'empty.calendar.action': 'إنشاء مشاركة',
  'empty.drafts.title': 'لا مسودات',
  'empty.drafts.body': 'تظهر هنا المسودات التي تحفظها مع أهدافها ومشاكلها.',
  'empty.connections.title': 'لا توجد حسابات متصلة',
  'empty.connections.body': 'قم بتوصيل حساب للنشر عليه. نعرض لك الأذونات الدقيقة أولاً.',
  'empty.connections.action': 'ربط حساب',
  'empty.analytics.title': 'لا توجد مقاييس حتى الآن',
  'empty.analytics.body':
    'تظهر المقاييس بعد أن يتم نشر منشورك الأول لفترة كافية حتى يتمكن النظام الأساسي من الإبلاغ عنه.',
  'empty.analytics.noPermission':
    'لم يمنح هذا الحساب حق الوصول إلى التحليلات. أعد الاتصال لإضافته.',
  'empty.approvals.title': 'لا شيء في انتظارك',
  'empty.approvals.body': 'تظهر طلبات الموافقة على مشاريعك هنا.',
  'empty.library.title': 'مكتبتك فارغة',
  'empty.library.body':
    'قم بتحميل الصور ومقاطع الفيديو، أو قم باستيرادها من عنوان URL أو واجهة برمجة التطبيقات.',
  'empty.library.action': 'تحميل الوسائط',
  'empty.automation.title': 'لا توجد قواعد حتى الآن',
  'empty.automation.body':
    'تتفاعل القاعدة مع شيء ما وتقترح إجراءً ما. تظهر كل قاعدة حدودها قبل تشغيلها.',
  'empty.webhooks.title': 'لا نقاط النهاية',
  'empty.webhooks.body': 'قم بإضافة نقطة نهاية لتلقي الأحداث الموقعة حول النشر والاتصالات.',
  'empty.searchResults.title': 'لا توجد نتائج لـ {query}',
  'empty.searchResults.body': 'قم بالتدقيق الإملائي، أو امسح عامل التصفية.',
  'empty.filtered.title': 'لا شيء يطابق هذه المرشحات',
  'empty.filtered.action': 'مسح المرشحات',
  'empty.auditLog.title': 'لا يوجد نشاط بعد',
  'empty.receipts.title': 'لا إيصالات حتى الآن',
  'empty.receipts.body': 'يُنتج كل منشور إيصالًا يمكنك فحصه ومشاركته.',

  'loading.default': 'جاري التحميل',
  'loading.calendar': 'جارٍ تحميل التقويم الخاص بك',
  'loading.analytics': 'جارٍ تحميل المقاييس',
  'loading.preview': 'بناء المعاينة',
  'loading.validating': 'التحقق من حدود النظام الأساسي الحالية',
  'loading.publishing': 'النشر إلى {provider}',
  'loading.uploading': 'تحميل {name}',
  'loading.uploadProgress': 'تم تحميل {percent}',
  'loading.connecting': 'الاتصال بـ {provider}',
  'loading.savingDraft': 'حفظ المسودة الخاصة بك',
  'loading.generatingPlan': 'بناء خطتك',
  'loading.longRunning': 'وهذا يستغرق وقتا أطول من المعتاد. لا يزال قيد التشغيل.',

  'offline.banner': 'أنت غير متصل. يتم الاحتفاظ بالتغييرات على هذا الجهاز.',
  'offline.draftSafe': 'مسودتك آمنة. تتم مزامنته عند معاودة الاتصال بالإنترنت.',
  'offline.publishDisabled': 'النشر يحتاج إلى اتصال. لن يتم وضع هذا في قائمة الانتظار بصمت.',
  'offline.scheduleQueued':
    'تم وضع طلب الجدول الزمني هذا في قائمة الانتظار على هذا الجهاز وسيتم إرساله عند معاودة الاتصال بالإنترنت.',
  'offline.reconnected': 'العودة على الانترنت. مزامنة التغييرات الخاصة بك.',
  'offline.syncConflict': 'لا يمكن دمج بعض التغييرات تلقائيًا. قم بمراجعتها قبل الحفظ.',

  'permission.denied.title': 'ليس لديك حق الوصول إلى هذا',
  'permission.denied.role': 'هذا يحتاج إلى دور {role}. أنت {currentRole}.',
  'permission.denied.scope': 'يحتاج بيانات الاعتماد هذه إلى النطاق {scope}.',
  'permission.denied.contactOwner': 'اطلب {owner} لمنحها.',
  'permission.denied.projectScope': 'وصولك يقتصر على {projects}.',
  'permission.readOnly': 'تتم قراءة مساحة العمل هذه الآن فقط.',
  'permission.mfaRequired': 'قم بالتأكيد باستخدام المصادقة الثنائية للمتابعة.',

  'rateLimit.title': 'تباطأ للحظة',
  'rateLimit.body': 'لقد قمت بتقديم طلبات {count} في {window}. الحد هو {limit}.',
  'rateLimit.resetsAt': 'تتم إعادة التعيين في {time}.',
  'rateLimit.cheaperAlternative': 'الجدولة بدلاً من النشر الآن تتجنب هذا الحد.',
  'rateLimit.providerCost': '{provider} الرسوم لكل عملية. يقدر هذا الإجراء بـ {amount}.',

  'incident.providerDegraded':
    '{provider} يواجه مشاكل. تستمر المشاركات المجدولة في إعادة المحاولة.',
  'incident.providerDown': '{provider} غير متوفر. لا شيء يضيع ولا شيء يتكرر.',
  'incident.isolated': 'منصات أخرى لا تتأثر.',
  'incident.statusPage': 'الحالة المباشرة عن طريق الموصل والسطح',
  'incident.startedAt': 'بدأت {relativeTime}',

  'translation.incomplete':
    'بعض النصوص الموجودة على هذه الشاشة لم تتم ترجمتها إلى {language} بعد ويتم عرضها باللغة الإنجليزية.',
  'translation.beta': 'هذه اللغة في مرحلة تجريبية. الإبلاغ عن أي شيء يقرأ خطأ.',

  'confirm.discardChanges.title': 'هل تريد تجاهل تغييراتك؟',
  'confirm.discardChanges.body': 'لا يمكن التراجع عن هذا.',
  'confirm.deleteItem.title': 'حذف {name}؟',
  'confirm.deleteItem.body': 'لا يمكن التراجع عن هذا.',
  'confirm.cancelScheduled.title': 'هل تريد إلغاء هذه المشاركة المجدولة؟',
  'confirm.cancelScheduled.body': 'لن ينشر. تبقى المسودة هنا حتى تتمكن من جدولتها مرة أخرى.',
  'confirm.publishNow.title': 'أنشر الآن؟',
  'confirm.publishNow.body':
    '{count, plural, one {يتم النشر في حساب واحد على الفور} zero {سيتم نشر هذا في # حسابًا على الفور} two {سيتم نشر هذا في # حسابًا على الفور} few {سيتم نشر هذا في # حسابًا على الفور} many {سيتم نشر هذا في # حسابًا على الفور} other {سيتم نشر هذا في # حسابًا على الفور}}. لا يمكن استرجاعه من Post Array.',
  'confirm.typeToConfirm': 'اكتب {word} للتأكيد.',
} as const;
