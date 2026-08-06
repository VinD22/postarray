/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'يؤلف',
  'composer.titleWithBrand': 'يؤلف لـ {brand}',
  'composer.master.label': 'مسودة رئيسية',
  'composer.master.description':
    'أكتب مرة واحدة هنا. تصل التغييرات المتوافقة إلى كل هدف محدد. افتح هدفًا لكتابة إصدار سيتلقاه هذا الحساب فقط.',
  'composer.master.globalEdit': 'التحرير العالمي',
  'composer.master.placeholder': 'ماذا تريد أن تنشر؟',
  'composer.brief.label': 'موجز',
  'composer.brief.placeholder': 'صف الفكرة والجمهور والنتيجة التي تريدها.',
  'composer.sources.label': 'مراجع المصدر',
  'composer.sources.empty': 'لم يتم إرفاق أي مصادر.',
  'composer.campaign.label': 'حملة',
  'composer.campaign.none': 'لا توجد حملة',
  'composer.contentLocale.label': 'لغة المحتوى',
  'composer.contentLocale.help': 'لغة المنشور. وهذا منفصل عن لغة الواجهة الخاصة بك.',
  'composer.market.label': 'سوق الجمهور',

  'composer.targets.title': 'الأهداف',
  'composer.targets.count':
    '{count, plural, =0 {لم يتم اختيار أي حسابات} one {# حساب} zero {#حسابات} two {#حسابات} few {#حسابات} many {#حسابات} other {#حسابات}}',
  'composer.targets.publishSummary':
    '{count, plural, one {سيتم نشر هذا في حساب واحد} zero {سيتم نشر هذا في # حسابًا} two {سيتم نشر هذا في # حسابًا} few {سيتم نشر هذا في # حسابًا} many {سيتم نشر هذا في # حسابًا} other {سيتم نشر هذا في # حسابًا}} {when, select, now {الآن} scheduled {في الوقت المحدد} other {}}',
  'composer.targets.add': 'إضافة حسابات',
  'composer.targets.empty': 'حدد حسابًا واحدًا على الأقل للنشر إليه.',
  'composer.targets.state.ready': 'جاهز',
  'composer.targets.state.inherited': 'ورثت من السيد',
  'composer.targets.state.overridden': 'تم تجاوزه',
  'composer.targets.state.warning': 'تأكد قبل النشر',
  'composer.targets.state.error': 'يحتاج إلى الإصلاح',
  'composer.targets.state.approvalNeeded': 'الموافقة مطلوبة',
  'composer.targets.overrideBadge': 'تجاوز',
  'composer.targets.resetConfirm.title': 'هل تريد إعادة تعيين هذا الهدف إلى المسودة الرئيسية؟',
  'composer.targets.resetConfirm.body':
    'سيتم استبدال النسخة والوسائط والإعدادات التي قمت بتغييرها لـ {account} بالمسودة الرئيسية. ولا تتأثر الأهداف الأخرى.',
  'composer.targets.divergence':
    '{count, plural, one {# الهدف يختلف عن المسودة الرئيسية} zero {# أهداف تختلف عن المسودة الرئيسية} two {# أهداف تختلف عن المسودة الرئيسية} few {# أهداف تختلف عن المسودة الرئيسية} many {# أهداف تختلف عن المسودة الرئيسية} other {# أهداف تختلف عن المسودة الرئيسية}}',

  'composer.applyToAll.title': 'تنطبق على جميع الأهداف',
  'composer.applyToAll.compatible':
    '{count, plural, one {# الحقل متوافق مع كل هدف محدد} zero {# الحقول متوافقة مع كل هدف محدد} two {# الحقول متوافقة مع كل هدف محدد} few {# الحقول متوافقة مع كل هدف محدد} many {# الحقول متوافقة مع كل هدف محدد} other {# الحقول متوافقة مع كل هدف محدد}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {لا يمكن تطبيق حقل واحد ويظل لكل هدف} zero {لا يمكن تطبيق # حقول وتظل لكل هدف} two {لا يمكن تطبيق # حقول وتظل لكل هدف} few {لا يمكن تطبيق # حقول وتظل لكل هدف} many {لا يمكن تطبيق # حقول وتظل لكل هدف} other {لا يمكن تطبيق # حقول وتظل لكل هدف}}',
  'composer.applyToAll.creates': 'يؤدي التطبيق إلى إنشاء نسخة صريحة لكل هدف.',

  'composer.editor.label': 'نشر النص',
  'composer.editor.characterCount': '{used} من {limit} حرفًا',
  'composer.editor.characterCountOver': '{over} حرفًا يتجاوز الحد الأقصى لعدد الأحرف {limit}',
  'composer.editor.characterCountUnknown': 'عدد الأحرف المسموح به غير متاح لهذا الحساب',
  'composer.editor.remaining':
    '{count, plural, one {بقي #حرف} zero {بقي # حرفًا} two {بقي # حرفًا} few {بقي # حرفًا} many {بقي # حرفًا} other {بقي # حرفًا}}',
  'composer.editor.hashtagCount':
    '{count, plural, one {#هاشتاج} zero {# الهاشتاج} two {# الهاشتاج} few {# الهاشتاج} many {# الهاشتاج} other {# الهاشتاج}}',
  'composer.editor.formatting': 'التنسيق',
  'composer.editor.emoji': 'الرموز التعبيرية',
  'composer.editor.mention': 'أذكر',
  'composer.editor.link': 'رابط',

  'composer.mentions.search': 'البحث عن الأشخاص والصفحات والشركات',
  'composer.mentions.searching': 'البحث {provider}',
  'composer.mentions.resolved': 'تم وضع علامة {label} على {provider}',
  'composer.mentions.unresolved':
    'لم تتم مطابقة هذا الإشارة مع حساب {provider} حتى الآن. سيتم نشره كنص عادي حتى تقوم بتحديد نتيجة.',
  'composer.mentions.noResults': 'لا توجد حسابات مطابقة على {provider}.',
  'composer.mentions.unsupported': 'العلامات الأصلية غير متاحة لهذا الحساب.',

  'composer.destination.label': 'الوجهة',
  'composer.destination.placeholder': 'اختر مكان نشر هذا',
  'composer.destination.community': 'المجتمع',
  'composer.destination.board': 'مجلس',
  'composer.destination.group': 'المجموعة',
  'composer.destination.page': 'الصفحة',
  'composer.destination.organization': 'التنظيم',
  'composer.destination.channel': 'قناة',
  'composer.destination.refresh': 'تحديث الوجهات',
  'composer.destination.lastRefreshed': 'تم تحديث الوجهات {relativeTime}',

  'composer.media.title': 'وسائل الإعلام',
  'composer.media.count':
    '{count, plural, one {# ملف} zero {# ملفات} two {# ملفات} few {# ملفات} many {# ملفات} other {# ملفات}}',
  'composer.media.dropHint': 'اسحب الملفات هنا أو تصفح مكتبتك.',
  'composer.media.inheritFromMaster': 'استخدام الوسائط الرئيسية',
  'composer.media.overridden': 'يستخدم هذا الهدف الوسائط الخاصة به',
  'composer.media.altText.label': 'نص بديل',
  'composer.media.altText.placeholder': 'قم بوصف الصورة للأشخاص الذين يستخدمون قارئ الشاشة.',
  'composer.media.altText.missing': 'النص البديل مفقود.',
  'composer.media.altText.waive': 'هذه الصورة لا تحتاج إلى نص بديل',
  'composer.media.altText.generate': 'اكتب النص البديل',
  'composer.media.crop': 'المحاصيل',
  'composer.media.resize': 'تغيير الحجم',
  'composer.media.rotate': 'تدوير',
  'composer.media.compress': 'ضغط',
  'composer.media.convertFormat': 'تحويل التنسيق',
  'composer.media.thumbnail': 'صورة مصغرة',
  'composer.media.aspectPreset': 'منصة مسبقة الصنع',
  'composer.media.original': 'أصلي',
  'composer.media.originalPreserved': 'يتم الاحتفاظ بالملف الأصلي. التعديلات إنشاء نسخة جديدة.',
  'composer.media.uploading': 'تحميل {name}',
  'composer.media.processing': 'تحضير {name}',
  'composer.media.rights.label': 'الحقوق والموافقة',
  'composer.media.rights.confirm':
    'لدي الحق في نشر هذه الوسائط، بما في ذلك أي أشخاص وموسيقى وشعارات وعلامات تجارية موجودة فيها.',

  'composer.sequence.title': 'التعليقات والموضوع',
  'composer.sequence.root': 'الوظيفة الرئيسية',
  'composer.sequence.item': 'العنصر {position}',
  'composer.sequence.add': 'إضافة تعليق أو عنصر الموضوع',
  'composer.sequence.delayLabel': 'تأخير بعد البند السابق',
  'composer.sequence.delayImmediate': 'على الفور',
  'composer.sequence.delayMinutes':
    '{count, plural, one {# دقيقة} zero {# دقيقة} two {# دقيقة} few {# دقيقة} many {# دقيقة} other {# دقيقة}}',
  'composer.sequence.delayCustom': 'تأخير مخصص',
  'composer.sequence.accountLabel': 'نشر هذا العنصر باسم',
  'composer.sequence.unsupported': 'هذا الحساب لا يدعم عناصر المتابعة المجدولة.',

  'composer.repeat.title': 'كرر',
  'composer.repeat.off': 'لا تكرر',
  'composer.repeat.everyDays':
    '{count, plural, one {كل يوم} zero {كل # يوم} two {كل # يوم} few {كل # يوم} many {كل # يوم} other {كل # يوم}}',
  'composer.repeat.endLabel': 'توقف عن التكرار',
  'composer.repeat.endOnDate': 'في موعد',
  'composer.repeat.endAfterCount': 'بعد عدد من المشاركات',
  'composer.repeat.endRequired': 'اختر تاريخ الانتهاء أو عدد التكرارات.',
  'composer.repeat.summary':
    'يكرر {cadence} حتى {end}. يحصل كل حدث على الموافقة والإيصال الخاص به.',

  'composer.links.title': 'روابط',
  'composer.links.keepOriginal': 'احتفظ بعنوان URL الأصلي',
  'composer.links.track': 'استبدله برابط قصير يتم تتبعه',
  'composer.links.utm': 'معلمات UTM',
  'composer.links.domain': 'مجال الارتباط',
  'composer.links.finalUrl': 'سيتم نشر هذا باسم {url}',
  'composer.links.frozenAtApproval': 'يتم تجميد عنوان URL المختصر والوجهة في النسخة المعتمدة.',

  'composer.signature.title': 'التوقيع',
  'composer.signature.none': 'لا يوجد توقيع',
  'composer.signature.autoApplied': 'تمت إضافة التوقيع {name} تلقائيًا. يمكنك تغييره.',

  'composer.set.title': 'مجموعات',
  'composer.set.startFrom': 'ابدأ من مجموعة',
  'composer.set.continueWithout': 'الاستمرار بدون مجموعة',
  'composer.set.applied': 'المجموعة التطبيقية {name}. هذه المسودة أصبحت الآن مستقلة عن المجموعة.',

  'composer.validation.title': 'التحقق من الصحة',
  'composer.validation.clean': 'لم يتم العثور على مشكلات للأهداف المحددة.',
  'composer.validation.issueCount':
    '{count, plural, one {# قضية} zero {# قضايا} two {# قضايا} few {# قضايا} many {# قضايا} other {# قضايا}} عبر {targets, plural, one {#الهدف} zero {#أهداف} two {#أهداف} few {#أهداف} many {#أهداف} other {#أهداف}}',
  'composer.validation.blocking': 'يجب إصلاح هذا قبل الجدولة.',
  'composer.validation.warning': 'تأكد من ذلك قبل النشر.',
  'composer.validation.revalidated':
    'تمت إعادة فحصه وفقًا لحدود النظام الأساسي الحالية {relativeTime}.',

  'composer.preview.title': 'معاينة',
  'composer.preview.forAccount': 'معاينة لـ {account} على {provider}',
  'composer.preview.approximate':
    'تستخدم هذه المعاينة قواعد النظام الأساسي التي سجلناها. يمكن أن يختلف المنشور المنشور إذا تغير النظام الأساسي.',
  'composer.preview.unavailable': 'المعاينة الحقيقية غير متاحة لهذا الحساب حتى الآن.',

  'composer.cost.title': 'التكلفة المقدرة للمزود',
  'composer.cost.estimate':
    '{provider} يقدر {amount} لاستخدام واجهة برمجة التطبيقات (API) لهذا المنشور.',
  'composer.cost.linkSurcharge':
    '{provider} يتقاضى رسومًا أكبر مقابل المشاركات التي تحتوي على عنوان URL. تؤدي إزالة الارتباط إلى خفض التقدير.',
  'composer.cost.bulkWarning':
    '{count, plural, one {#النشر} zero {#المنشورات} two {#المنشورات} few {#المنشورات} many {#المنشورات} other {#المنشورات}} في عمل واحد. قم بمراجعة التقدير قبل المتابعة.',
  'composer.cost.reconciled': 'تتم تسوية الاستخدام الفعلي بعد النشر.',
  'composer.cost.none': 'لا توجد تكلفة مزود المقاسة لهذا المنصب.',

  'composer.autosave.saving': 'الادخار',
  'composer.autosave.saved': 'تم الحفظ {relativeTime}',
  'composer.autosave.offline': 'غير متصل. يتم الاحتفاظ بمسودتك على هذا الجهاز وستتم مزامنتها.',
  'composer.autosave.conflict':
    '{name} قام بتحرير هذه المسودة أثناء كتابتك. قم بمراجعة كلا الإصدارين قبل الحفظ.',
  'composer.autosave.failed': 'لا يمكن الحفظ. النص الخاص بك لا يزال هنا. إعادة المحاولة.',

  'composer.ai.title': 'مساعدة',
  'composer.ai.makeConcise': 'جعل أكثر إيجازا',
  'composer.ai.adaptForPlatform': 'التكيف مع {provider}',
  'composer.ai.transcreate': 'تحويل إلى {language}',
  'composer.ai.checkClaims': 'التحقق من المطالبات',
  'composer.ai.writeAltText': 'اكتب النص البديل',
  'composer.ai.suggestHooks': 'أقترح السنانير',
  'composer.ai.suggestCta': 'اقترح عبارة تحث المستخدم على اتخاذ إجراء',
  'composer.ai.diffTitle': 'التغيير المقترح',
  'composer.ai.diffHelp': 'لا شيء يتغير حتى تقبله.',
  'composer.ai.working': 'العمل على ذلك',
  'composer.ai.sources':
    'بناء على {count, plural, one {#مصدر} zero {#مصادر} two {#مصادر} few {#مصادر} many {#مصادر} other {#مصادر}} لقد وافقت',
  'composer.ai.uncertain':
    'هذه العبارة ليس لها معادل نظيف في {language}. قم بمراجعتها مع متحدث أصلي قبل النشر.',

  'composer.schedule.title': 'الجدول الزمني',
  'composer.schedule.dateLabel': 'التاريخ',
  'composer.schedule.timeLabel': 'الوقت',
  'composer.schedule.timeZoneLabel': 'المنطقة الزمنية',
  'composer.schedule.nextFreeSlot': 'الفتحة المجانية التالية',
  'composer.schedule.localAndUtc': '{local} في {timeZone}. {utc} بالتوقيت العالمي.',
  'composer.schedule.dstWarning':
    'تتغير الساعات في {timeZone} في هذا التاريخ. يتم تشغيل هذا المنشور في {local}، وهو {utc} UTC.',
  'composer.schedule.pastWarning': 'لقد مر ذلك الوقت. اختر وقتاً لاحقاً.',
  'composer.schedule.confirmTitle': 'التأكيد قبل الجدولة',
  'composer.schedule.confirmPublishNow': 'تأكد قبل النشر الآن',
  'composer.schedule.approverLabel': 'الموافق',
  'composer.schedule.policyLabel': 'سياسة الموافقة',
  'composer.schedule.duplicateWarning':
    'تم نشر محتوى مشابه على {account} {relativeTime}. قد يؤدي نشره مرة أخرى إلى انتهاك قواعد النظام الأساسي فيما يتعلق بالمحتوى المكرر.',
  'composer.schedule.cadenceWarning':
    '{account} موجود بالفعل {count, plural, one {# مشاركة} zero {# مشاركات} two {# مشاركات} few {# مشاركات} many {# مشاركات} other {# مشاركات}} المقرر في ذلك اليوم.',
} as const;
