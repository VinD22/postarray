export const postingSetMessages = {
  'calendar.hold.action': 'إيقاف مؤقت',
  'calendar.hold.resumeAction': 'استئناف',
  'calendar.hold.badge': 'متوقف مؤقتًا',
  'calendar.hold.badgeBilling': 'متوقف بسبب الفوترة',
  'calendar.hold.term': 'إيقاف',
  'calendar.hold.byPerson': 'أوقفته أنت في {date}.',
  'calendar.hold.byBilling': 'تم الإيقاف في {date} لأن مساحة العمل هذه فقدت الوصول الكامل.',
  'calendar.hold.none': 'غير موقوف',

  'calendar.hold.confirmTitle': 'إيقاف هذا المنشور مؤقتًا؟',
  'calendar.hold.confirmBody':
    'سيبقى هذا المنشور في مكانه ولن يُنشر في {time}. يمكنك استئنافه في أي وقت قبل ذلك، أو اختيار وقت جديد إذا كان ذلك الوقت قد مرّ.',
  'calendar.hold.confirmScope':
    'الإيقاف المؤقت يوقف ما لم يحدث بعد. أي شيء نُشر بالفعل على منصة يبقى منشورًا، والإيقاف المؤقت لا يحذفه أو يعدّله.',
  'calendar.hold.confirmNoteLabel': 'لماذا توقف هذا مؤقتًا؟ (اختياري)',
  'calendar.hold.confirmNoteHint':
    'يُحفظ في سجل التدقيق لفريقك. لا يُرسل إلى أي منصة.',
  'calendar.hold.confirm': 'إيقاف هذا المنشور مؤقتًا',
  'calendar.hold.cancel': 'تركه مجدولًا',

  'calendar.hold.resumeTitle': 'استئناف هذا المنشور؟',
  'calendar.hold.resumeBody': 'سيُنشر في {time}، بتوقيت {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'ذلك الوقت قد مرّ',
  'calendar.hold.resumeMissedBody':
    'كان هذا المنشور مستحقًا في {time} أثناء إيقافه مؤقتًا. اختر وقتًا جديدًا حتى لا يُنشر لحظة استئنافه.',
  'calendar.hold.resumeTimeLabel': 'وقت النشر الجديد',
  'calendar.hold.resumeConfirm': 'استئناف',

  'calendar.hold.paused': 'موقوف مؤقتًا. لن يُنشر حتى تستأنفه.',
  'calendar.hold.resumed': 'تم الاستئناف. سيُنشر في {time}.',

  'calendar.hold.blocked.published':
    'نُشر هذا المنشور بالفعل. الإيقاف المؤقت لا يمكنه إعادته من المنصة.',
  'calendar.hold.blocked.inFlight':
    'يُرسل هذا المنشور الآن. فات الأوان لإيقافه مؤقتًا، وإيقافه في المنتصف قد يتركه منشورًا جزئيًا.',
  'calendar.hold.blocked.finished': 'انتهى هذا المنشور بالفعل، لذا لا يوجد شيء لإيقافه مؤقتًا.',
  'calendar.hold.blocked.billing':
    'هذا المنشور موقوف مؤقتًا لأن مساحة العمل فقدت الوصول الكامل. استئنافه مسألة فوترة، وليست مسألة جدولة.',
  'calendar.hold.blocked.billingAction': 'الذهاب إلى الفوترة',

  'set.title': 'مجموعات النشر',
  'set.lede':
    'إجابة محفوظة على سؤال "لمن أنشر هذا، وكيف". تطبيق مجموعة ينسخ إعداداتها إلى مسودة جديدة.',
  'set.appliedOnce':
    'تُقرأ المجموعة مرة واحدة، عند تطبيقها. تحريرها لاحقًا يغيّر ما تبدأ منه المنشورات التالية. المسودات والمنشورات المجدولة التي أنشأتها بالفعل منها تبقى كما هي تمامًا.',
  'set.empty.title': 'لا توجد مجموعات بعد',
  'set.empty.body': 'أنشئ واحدة لتتوقف عن إعادة بناء نفس قائمة الحسابات لكل منشور.',
  'set.create': 'مجموعة جديدة',
  'set.edit': 'تحرير المجموعة',
  'set.archive': 'أرشفة المجموعة',
  'set.archived': 'مؤرشفة',
  'set.archivedNote': 'المجموعات المؤرشفة مخفية من المنتقي. المنشورات المصنوعة منها لا تتغير.',
  'set.showArchived': 'إظهار المؤرشفة',
  'set.saved': 'تم حفظ المجموعة.',
  'set.archivedToast': 'تمت أرشفة المجموعة. المنشورات التي صُنعت منها بالفعل لا تتغير.',

  'set.field.name': 'الاسم',
  'set.field.nameHint': 'ما ستبحث عنه لاحقًا في المنتقي. واحدة لكل مشروع.',
  'set.field.description': 'الوصف',
  'set.field.descriptionHint': 'اختياري. الغرض من هذه المجموعة.',
  'set.field.targets': 'الحسابات',
  'set.field.targetsHint': 'كل حساب يبدأ منه منشور صُنع من هذه المجموعة.',
  'set.field.targetCount':
    '{count, plural, =0 {لا حسابات} one {حساب واحد} zero {# حساب} two {حسابان} few {# حسابات} many {# حسابًا} other {# حساب}}',
  'set.field.signature': 'التوقيع',
  'set.field.signatureNone': 'بلا توقيع',
  'set.field.approval': 'الموافقة',
  'set.field.approvalHint': 'الموافقة التي يحتاجها منشور صُنع من هذه المجموعة قبل أن يُنشر.',
  'set.field.schedule': 'متى ينشر',

  'set.approval.none': 'لا حاجة لموافقة',
  'set.approval.single_approver': 'موافق واحد محدد بالاسم',
  'set.approval.any_approver': 'أي موافق',
  'set.approval.named_approver': 'موافق معين',
  'set.approval.policy_auto': 'أيًا كانت سياسة مساحة العمل',

  'set.slot.next_free_slot': 'الفتحة الخالية التالية من قائمة الانتظار',
  'set.slot.next_free_slotHint':
    'يستخدم قواعد قائمة انتظار هذا المشروع لاقتراح وقت. هو يقترح؛ وأنت تقبل.',
  'set.slot.pick_time': 'اطلب مني اختيار وقت',
  'set.slot.pick_timeHint': 'تطبيق المجموعة يترك الوقت فارغًا لتختاره.',
  'set.slot.draft_only': 'تركه كمسودة',
  'set.slot.draft_onlyHint': 'تطبيق المجموعة لا يمس الجدول إطلاقًا.',
  'set.slot.noRules':
    'هذا المشروع لا يملك قواعد قائمة انتظار بعد، لذا ستقترح قائمة الانتظار أول ساعة خالية وتقول ذلك.',
  'set.slot.rulesLink': 'قواعد قائمة الانتظار',

  'set.defaults.title': 'الإعدادات الافتراضية لكل منصة',
  'set.defaults.body':
    'قيم أولية تُنسخ في كل منشور جديد. يمكنك تغيير أي منها لاحقًا في المؤلف.',
  'set.defaults.add': 'إضافة منصة',
  'set.defaults.remove': 'إزالة إعدادات {platform}',
  'set.defaults.privacy': 'الخصوصية',
  'set.defaults.privacyNone': 'افتراضي المنصة',
  'set.defaults.bodyPrefix': 'نص قبل المنشور',
  'set.defaults.bodySuffix': 'نص بعد المنشور',
  'set.defaults.requireAltText': 'اشتراط نص بديل على كل صورة',
  'set.defaults.requireAltTextHint':
    'لا يمكن جدولة منشور صُنع من هذه المجموعة إلى هذه المنصة حتى تحتوي كل صورة على نص بديل.',
  'set.defaults.empty': 'لا توجد إعدادات افتراضية لكل منصة. كل حساب يبدأ من المنشور الرئيسي.',

  'set.error.nameTaken': 'مجموعة أخرى في هذا المشروع تستخدم بالفعل ذلك الاسم.',
  'set.error.archived': 'هذه المجموعة مؤرشفة. استعدها قبل تحريرها.',
  'set.error.duplicateTarget': 'ذلك الحساب موجود بالفعل في هذه المجموعة.',
  'set.error.duplicatePlatform': 'هذه المجموعة لديها بالفعل إعدادات افتراضية لتلك المنصة.',

  'targetMemory.setting.title': 'تذكّر الحسابات بين المنشورات',
  'targetMemory.setting.body':
    'عندما يكون هذا مفعّلًا، يبدأ المؤلف كل منشور جديد بالحسابات التي اختارها ذلك الشخص آخر مرة في هذا المشروع. يبقى معطّلًا حتى تفعّله.',
  'targetMemory.setting.stored':
    'تُحفظ قائمة الحسابات فقط، وفقط للشخص الذي اختارها. لا يُحفظ أي وصف أو وقت أو إعداد خصوصية أو حالة موافقة، ولا يمكن لأي شخص آخر في المشروع رؤية قائمتك.',
  'targetMemory.setting.offNote': 'أثناء تعطيل هذا، لا يُحفظ شيء إطلاقًا.',
  'targetMemory.setting.turnOffWarning':
    'تعطيل هذا يحذف كل اختيار محفوظ في هذا المشروع، للجميع.',
  'targetMemory.setting.enabled': 'مفعّل',
  'targetMemory.setting.disabled': 'معطّل',
  'targetMemory.setting.saved': 'تم حفظ الإعداد.',
  'targetMemory.setting.cleared': 'تم حفظ الإعداد. حُذفت الاختيارات المحفوظة في هذا المشروع.',

  'targetMemory.composer.restored':
    '{count, plural, one {بدأ بحساب واحد من المرة السابقة.} zero {بدأ بـ # حساب من المرة السابقة.} two {بدأ بحسابين من المرة السابقة.} few {بدأ بـ # حسابات من المرة السابقة.} many {بدأ بـ # حسابًا من المرة السابقة.} other {بدأ بـ # حساب من المرة السابقة.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {تم استبعاد حساب واحد استخدمته المرة السابقة لأنه يحتاج انتباهًا.} zero {تم استبعاد # حساب استخدمته المرة السابقة لأنها تحتاج انتباهًا.} two {تم استبعاد حسابين استخدمتهما المرة السابقة لأنهما يحتاجان انتباهًا.} few {تم استبعاد # حسابات استخدمتها المرة السابقة لأنها تحتاج انتباهًا.} many {تم استبعاد # حسابًا استخدمته المرة السابقة لأنها تحتاج انتباهًا.} other {تم استبعاد # حساب استخدمته المرة السابقة لأنها تحتاج انتباهًا.}}',
  'targetMemory.composer.droppedAll':
    'لا يوجد أي من الحسابات التي استخدمتها المرة السابقة متاحًا الآن، لذا لم يُختر شيء مسبقًا.',
  'targetMemory.composer.undo': 'مسح الاختيار',
  'targetMemory.composer.forget': 'التوقف عن تذكّر حساباتي',
  'targetMemory.composer.forgotten': 'تم حذف اختيارك المحفوظ.',
  'targetMemory.composer.reviewAccounts': 'مراجعة الحسابات',
} as const;
