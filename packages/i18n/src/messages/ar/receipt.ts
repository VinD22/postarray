/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'إيصال النشر',
  'receipt.subtitle': 'بالضبط ما تم نشره وأين ومتى وعلى موافقة من.',
  'receipt.target': '{account} على {provider}',
  'receipt.externalId': 'معرف المشاركة الخارجية',
  'receipt.permalink': 'الرابط الثابت',
  'receipt.permalinkUnavailable': '{provider} لا يُرجع رابطًا ثابتًا لهذا النوع من المنشورات.',
  'receipt.contentVersion': 'إصدار المحتوى',
  'receipt.contentHash': 'المجموع الاختباري للمحتوى',
  'receipt.mediaVersion': 'نسخة الوسائط',
  'receipt.idempotencyKey': 'مرجع العجز',
  'receipt.correlationId': 'مرجع الارتباط',

  'receipt.surface.label': 'تم إنشاؤها من',
  'receipt.surface.web': 'تطبيق الويب',
  'receipt.surface.api': 'واجهة برمجة تطبيقات REST',
  'receipt.surface.mcp': 'خادم MCP',
  'receipt.surface.cli': 'سطر الأوامر',
  'receipt.surface.rss': 'النشر التلقائي لآر إس إس',
  'receipt.surface.automation': 'حكم الأتمتة',
  'receipt.surface.webhook': 'خطاف الويب الوارد',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'حساب الخدمة {name}',
  'receipt.actor.oauthApp': '{app} يمثل {name}',
  'receipt.actor.system': 'Relay',

  'receipt.timeline.title': 'الجدول الزمني',
  'receipt.timeline.created': 'مسودة تم إنشاؤها بواسطة {actor}',
  'receipt.timeline.approvalRequested': 'الموافقة مطلوبة من {approver}',
  'receipt.timeline.approved': 'تمت الموافقة عليه بواسطة {actor} بموجب السياسة {policy}',
  'receipt.timeline.scheduled': 'تمت جدولته لـ {local} في {timeZone}',
  'receipt.timeline.revalidated': 'تمت إعادة فحص بيانات الاعتماد وحدود النظام الأساسي',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {#ملف معد للمنصة} zero {#ملفات معدة للمنصة} two {#ملفات معدة للمنصة} few {#ملفات معدة للمنصة} many {#ملفات معدة للمنصة} other {#ملفات معدة للمنصة}}',
  'receipt.timeline.dispatched': 'تم الإرسال إلى {provider}',
  'receipt.timeline.providerAccepted': '{provider} قبل هذا المنشور',
  'receipt.timeline.providerProcessing': '{provider} لا يزال يعالج الوسائط',
  'receipt.timeline.published': 'تم النشر باسم {externalId}',
  'receipt.timeline.commentPublished': 'تم نشر عنصر المتابعة {position}',
  'receipt.timeline.retryScheduled': 'أعد المحاولة {attempt} المقررة في {time}',
  'receipt.timeline.failed': 'فشلت المحاولة {attempt}',
  'receipt.timeline.canceled': 'تم الإلغاء بواسطة {actor}',
  'receipt.timeline.analyticsSynced': 'تمت مزامنة التحليلات',
  'receipt.timeline.deletedExternally': 'المنشور لم يعد موجود على {provider}',

  'receipt.times.scheduled': 'الوقت المقرر',
  'receipt.times.dispatched': 'وقت الإرسال',
  'receipt.times.published': 'وقت النشر',
  'receipt.times.latency': 'تم إرسال {duration} بعد الوقت المحدد.',

  'receipt.attempts.title': 'محاولات',
  'receipt.attempts.count':
    '{count, plural, one {#محاولة} zero {# محاولات} two {# محاولات} few {# محاولات} many {# محاولات} other {# محاولات}}',
  'receipt.attempts.classification': 'التصنيف',
  'receipt.attempts.providerResponse': 'استجابة المزود',
  'receipt.attempts.responseRedacted':
    'يتم تخزين استجابة الموفر مع إزالة الرموز المميزة والبيانات الشخصية.',
  'receipt.attempts.remediation': 'ماذا تفعل بعد ذلك',

  'receipt.cost.estimated': 'يقدر {amount}',
  'receipt.cost.actual': 'تصالح {amount}',
  'receipt.cost.pending': 'لم تتم تسوية الاستخدام الفعلي بعد.',

  'receipt.partial.title': 'نشرت جزئيا',
  'receipt.partial.body':
    '{published, plural, one {تم نشر #هدف} zero {تم نشر # هدفًا} two {تم نشر # هدفًا} few {تم نشر # هدفًا} many {تم نشر # هدفًا} other {تم نشر # هدفًا}}. {failed, plural, one {#فشل الهدف} zero {فشل # هدفًا} two {فشل # هدفًا} few {فشل # هدفًا} many {فشل # هدفًا} other {فشل # هدفًا}}. المنشورات المنشورة لا تزال موجودة على المنصة.',
  'receipt.partial.doNotRollback':
    'نحن لا نحذف منشورًا تم نشره بالفعل. احذفه من المنصة إذا كان هذا هو ما تريده.',

  'receipt.export.title': 'شارك هذا الإيصال',
  'receipt.export.pdf': 'تحميل بصيغة PDF',
  'receipt.export.json': 'قم بالتنزيل بتنسيق JSON',
  'receipt.export.permissionNote': 'يمكن للمالكين والمسؤولين والمعتمدين فقط مشاركة الإيصال.',

  'receipt.analytics.lastSync': 'آخر مزامنة للتحليلات {relativeTime}.',
  'receipt.analytics.nextSync': 'المزامنة التالية حول {time}.',
} as const;
