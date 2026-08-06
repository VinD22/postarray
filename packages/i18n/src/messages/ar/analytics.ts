/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'التحليلات',
  'analytics.subtitle': 'ما حدث، وما مدى حداثته، وما الذي يستحق الاختبار بعد ذلك.',
  'analytics.range.7d': 'آخر 7 أيام',
  'analytics.range.30d': 'آخر 30 يومًا',
  'analytics.range.90d': 'آخر 90 يومًا',
  'analytics.range.custom': 'نطاق مخصص',
  'analytics.range.limitedByProvider':
    '{provider} يعود على الأكثر {days, plural, one {# يوم} zero {# يوم} two {# يوم} few {# يوم} many {# يوم} other {# يوم}} التاريخ لهذا الحساب.',
  'analytics.account.select': 'اختر حسابًا',
  'analytics.compareTo': 'مقارنة بـ {baseline}',
  'analytics.baseline.trailingMedian':
    'الوسيط الخاص بك من السابق {count, plural, one {# مشاركة قابلة للمقارنة} zero {# مشاركات قابلة للمقارنة} two {# مشاركات قابلة للمقارنة} few {# مشاركات قابلة للمقارنة} many {# مشاركات قابلة للمقارنة} other {# مشاركات قابلة للمقارنة}}',

  'analytics.metric.followers': 'المتابعون',
  'analytics.metric.subscribers': 'المشتركين',
  'analytics.metric.profileViews': 'مشاهدات الملف الشخصي',
  'analytics.metric.impressions': 'الانطباعات',
  'analytics.metric.reach': 'الوصول',
  'analytics.metric.views': 'وجهات النظر',
  'analytics.metric.videoViews': 'مشاهدات الفيديو',
  'analytics.metric.watchTime': 'شاهد الوقت',
  'analytics.metric.averageViewDuration': 'متوسط مدة المشاهدة',
  'analytics.metric.averageViewPercentage': 'متوسط النسبة المئوية للمشاهدة',
  'analytics.metric.likes': 'الإعجابات وردود الفعل',
  'analytics.metric.comments': 'التعليقات والردود',
  'analytics.metric.shares': 'المشاركات وإعادة النشر والاقتباسات',
  'analytics.metric.saves': 'يحفظ والإشارات المرجعية',
  'analytics.metric.linkClicks': 'نقرات الارتباط',
  'analytics.metric.clickThroughRate': 'نسبة النقر إلى الظهور',
  'analytics.metric.engagementRate': 'معدل المشاركة',
  'analytics.metric.publishedCount': 'المشاركات المنشورة',
  'analytics.metric.followerChange': 'تغيير المتابعين',

  'analytics.definition.title': 'كيف يتم تعريف {metric}',
  'analytics.definition.provider': 'تم الإبلاغ عنها بواسطة {provider} كـ {providerField}.',
  'analytics.definition.denominator.label': 'المقام: {denominator}.',
  'analytics.definition.unit': 'الوحدة: {unit}.',
  'analytics.definition.normalized': 'تطبيع من قيمة الموفر. يتم الاحتفاظ بالقيمة الخام ومتاحة.',
  'analytics.definition.notComparable':
    '{provider} و {otherProvider} يحددان ذلك بشكل مختلف. قارنها بعناية.',

  'analytics.value.unavailable': 'غير متاح',
  'analytics.value.unavailableReason.permission': 'لم يمنح هذا الحساب الإذن اللازم لهذا المقياس.',
  'analytics.value.unavailableReason.unsupported': '{provider} لا يُبلغ عن هذا المقياس.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} ينشر هذا المقياس لاحقًا. تحقق مرة أخرى بعد {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'فشلت المزامنة الأخيرة. نحن نحاول إعادة المحاولة ولن نعرض رقمًا متوقعًا.',
  'analytics.freshness.synced': 'تمت المزامنة {relativeTime}',
  'analytics.freshness.stale': 'آخر مزامنة ناجحة {relativeTime}. قد يكون هذا قديما.',
  'analytics.freshness.coverage':
    '{covered} من {total} منشورات في هذا النطاق تحتوي على بيانات حالية.',

  'analytics.feedback.title': 'ماذا يوحي هذا',
  'analytics.feedback.aboveBaseline': 'تلقى هذا المنشور {percent} أكثر {metric} من {baseline}.',
  'analytics.feedback.belowBaseline': 'تلقى هذا المنشور {percent} أقل من {metric} من {baseline}.',
  'analytics.feedback.notComparableFormats':
    'لا يمكن مقارنة منشورات الصور ومنشورات الفيديو بشكل مباشر هنا.',
  'analytics.feedback.smallSample': 'العينة صغيرة. اختبر نفس الخطاف مرة أخرى قبل استخلاص النتيجة.',
  'analytics.feedback.association':
    'زادت التعليقات بعد تغيير تأخير التعليق الأول من {before} إلى {after}. هذه جمعية وليست دليلاً على السبب.',
  'analytics.feedback.nextTest': 'ما يجب اختباره بعد ذلك',
  'analytics.feedback.doNotInfer': 'ما لا يظهر هذا',
  'analytics.feedback.noScore': 'لا توجد نقاط مشتركة واحدة هنا. اختر مقياسًا بتعريف تثق به.',

  'analytics.experiment.title': 'التجارب',
  'analytics.experiment.hypothesis': 'الفرضية',
  'analytics.experiment.variants': 'المتغيرات',
  'analytics.experiment.successMetric': 'مقياس النجاح',
  'analytics.experiment.window': 'نافذة القياس',
  'analytics.experiment.status.running': 'مستمر حتى {date}',
  'analytics.experiment.status.complete': 'كامل',
  'analytics.experiment.tagBeforePublishing':
    'ضع علامة على التجربة قبل النشر حتى لا تتم المقارنة بعد حدوثها.',
  'analytics.experiment.caveats': 'المحاذير',

  'analytics.export.title': 'تصدير',
  'analytics.export.csv': 'قم بتنزيل ملف CSV',
  'analytics.export.json': 'تحميل جيسون',
  'analytics.export.providerRestriction':
    '{provider} يقيد كيفية دمج بياناته أو تخزينها. لم يتم تضمين بعض الحقول.',

  'analytics.links.title': 'الروابط المتعقبة',
  'analytics.links.subtitle':
    'قياسات إعادة توجيه الطرف الأول. هذه عبارة عن سلسلة منفصلة من نقرات الارتباط لتقارير النظام الأساسي.',
  'analytics.links.destination': 'الوجهة',
  'analytics.links.shortUrl': 'عنوان URL قصير',
  'analytics.links.totalRequests': 'إجمالي الطلبات',
  'analytics.links.humanClicks': 'النقرات المكررة',
  'analytics.links.suspectedBots': 'الروبوتات المشتبه بها',
  'analytics.links.referrerClass': 'المُحيل',
  'analytics.links.deviceClass': 'الجهاز',
  'analytics.links.country': 'البلد',
  'analytics.links.lastEvent': 'النقرة الأخيرة {relativeTime}',
  'analytics.links.privacyNote':
    'نحن نحتفظ بالموقع التقريبي وفئة الجهاز فقط. يتم الاحتفاظ بعناوين IP الأولية لفترة وجيزة لإساءة الاستخدام والكشف عن التكرارات، ثم يتم التخلص منها.',
  'analytics.links.separateSources':
    'لا تقم بإضافة هذه النقرات إلى رقم النظام الأساسي الذي تم الإبلاغ عنه. يحسبون أشياء مختلفة.',
} as const;
