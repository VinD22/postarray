/**
 * Web surface strings for Analytics, Automation Rules, RSS autopost and
 * tracked links.
 *
 * `analytics.ts` and `automation.ts` hold the domain vocabulary shared by every
 * surface (metric names, trigger sentences, provider caveats). This file holds
 * what only the web screens need: column headings, filter labels, wizard steps,
 * the sentence builder chrome and the per screen empty, error, offline,
 * permission and rate limit copy.
 *
 * Every leaf name here is new. Nothing in this file overwrites a key defined in
 * `analytics.ts` or `automation.ts`, which is asserted by `lint.test.ts`.
 */
export const webAnalyticsMessages = {
  /* ======================================================================
     Analytics shell
     ====================================================================== */
  'analytics.chart.legend': 'السلسلة المعروضة في هذا الرسم البياني',
  'analytics.tab.overview': 'نظرة عامة',
  'analytics.tab.experiments': 'التجارب',
  'analytics.tab.links': 'الروابط المتعقبة',
  'analytics.tab.label': 'أقسام التحليلات',

  'analytics.question.baseline': 'ما هي المشاركات التي ابتعدت عن خط الأساس الخاص بك؟',
  'analytics.question.baselineHelp':
    'تتم مقارنة كل مشاركة بمشاركاتك الأخيرة على نفس الحساب وبنفس التنسيق. لا شيء هنا يقارنك بمساحة عمل أخرى أو شركة أخرى.',
  'analytics.question.accounts': 'ما هي الحسابات التي تحتاج إلى الاهتمام؟',
  'analytics.question.next': 'ما الذي يستحق الاختبار بعد ذلك؟',

  'analytics.filter.brand': 'Brand',
  'analytics.filter.accounts': 'الحسابات',
  'analytics.filter.allAccounts': 'جميع الحسابات المرتبطة',
  'analytics.filter.range': 'النطاق الزمني',
  'analytics.filter.format': 'تنسيق المحتوى',
  'analytics.filter.allFormats': 'جميع الصيغ',
  'analytics.filter.comparePrevious': 'قارن مع الفترة السابقة',
  'analytics.filter.applied':
    '{count, plural, =0 {لا مرشحات} one {#مرشح} zero {#مرشحات} two {#مرشحات} few {#مرشحات} many {#مرشحات} other {#مرشحات}} تطبيق. {results, plural, =0 {لا توجد مشاركات متطابقة} one {#نشر التطابقات} zero {# مشاركات متطابقة} two {# مشاركات متطابقة} few {# مشاركات متطابقة} many {# مشاركات متطابقة} other {# مشاركات متطابقة}}.',

  'analytics.rankMetric.label': 'ترتيب المشاركات حسب',
  'analytics.rankMetric.help':
    'لا توجد نتيجة مجمعة في Relay. اختر مقياسًا واحدًا تثق في تعريفه وسيتم ترتيب الجدول حسب هذا المقياس وحده.',
  'analytics.rankMetric.chosen': 'تم تصنيفها حسب {metric}، وفقًا لما أفاد به كل مزود حساب.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'الوعي',
  'analytics.outcome.awarenessHelp':
    'كم مرة تم تسليم المنشور أو مشاهدته. يحسب مقدمو الخدمة ذلك بشكل مختلف، لذا فإن القيمة لا يمكن مقارنتها إلا بنفسها بمرور الوقت.',
  'analytics.outcome.consumption': 'الاستهلاك',
  'analytics.outcome.consumptionHelp': 'مقدار المنشور الذي شاهده الأشخاص أو قرأوه بالفعل.',
  'analytics.outcome.interaction': 'التفاعل',
  'analytics.outcome.interactionHelp':
    'ما فعله الأشخاص على المنصة: الإعجابات والتعليقات والمشاركات والحفظ.',
  'analytics.outcome.conversion': 'التحويل',
  'analytics.outcome.conversionHelp':
    'ماذا فعل الناس بعد مغادرة المنصة. يمكن للروابط المتعقبة فقط الإجابة على هذا السؤال، وفقط للروابط التي اخترت تتبعها.',
  'analytics.outcome.separateNote':
    'يتم حساب هذه المجموعات الأربع بشكل منفصل. إن جمعهم معًا سيؤدي إلى حساب نفس الشخص أكثر من مرة.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'المنشورات المنشورة في النطاق المحدد، مع مقارنة كل واحدة منها بخط الأساس الأخير الخاص بك.',
  'analytics.table.post': 'مشاركة',
  'analytics.table.account': 'الحساب',
  'analytics.table.format': 'التنسيق',
  'analytics.table.published': 'تم النشر',
  'analytics.table.value': 'القيمة',
  'analytics.table.delta': 'ضد خط الأساس',
  'analytics.table.sample': 'عينة',
  'analytics.table.sampleSize': 'ن = {count}',
  'analytics.table.evidence': 'الأدلة',
  'analytics.table.openEvidence': 'أظهر الدليل على {post}',
  'analytics.table.rowActions': 'إجراءات لـ {post}',
  'analytics.table.openPost': 'فتح مقاييس النشر',
  'analytics.table.openReceipt': 'فتح إيصال النشر',
  'analytics.table.noBaseline': 'لا يوجد خط أساس حتى الآن',
  'analytics.table.noBaselineReason':
    'يوجد أقل من {required} منشورات قابلة للمقارنة على هذا الحساب. ستكون المقارنة ضوضاء، لذلك لا يظهر أي شيء.',
  'analytics.table.sortBy': 'الترتيب حسب {column}',
  'analytics.table.detailToggle': 'التفاصيل',

  'analytics.delta.above': '{percent} فوق خط الأساس',
  'analytics.delta.below': '{percent} تحت خط الأساس',
  'analytics.delta.level': 'تمشيا مع خط الأساس',
  'analytics.delta.unavailable': 'لا مقارنة',

  'analytics.evidence.title': 'كيف تمت هذه المقارنة',
  'analytics.evidence.baseline':
    'خط الأساس: الوسيط {metric} للسابق {count, plural, one {# مشاركة قابلة للمقارنة} zero {# مشاركات قابلة للمقارنة} two {# مشاركات قابلة للمقارنة} few {# مشاركات قابلة للمقارنة} many {# مشاركات قابلة للمقارنة} other {# مشاركات قابلة للمقارنة}} على {account}.',
  'analytics.evidence.comparableBy':
    '"قابل للمقارنة" يعني نفس الحساب ونفس تنسيق المحتوى ({format}) ووقت النشر خلال نفس الفترة.',
  'analytics.evidence.postsUsed': 'المشاركات المستخدمة لخط الأساس',
  'analytics.evidence.excluded':
    '{count, plural, =0 {لم يتم استبعاد أية مشاركات} one {تم استبعاد مشاركة واحدة} zero {تم استبعاد # من المشاركات} two {تم استبعاد # من المشاركات} few {تم استبعاد # من المشاركات} many {تم استبعاد # من المشاركات} other {تم استبعاد # من المشاركات}} لأن المقياس لم يكن متاحا لهم.',
  'analytics.evidence.smallSample':
    'مع{count, plural, one {# مشاركة} zero {# مشاركات} two {# مشاركات} few {# مشاركات} many {# مشاركات} other {# مشاركات}}في خط الأساس، منشور واحد غير عادي يحرك الوسيط مسافة طويلة. تعامل مع هذا كإشارة للاختبار مرة أخرى، وليس كنتيجة.',
  'analytics.evidence.confounders': 'ما هذا لا حساب ل',
  'analytics.evidence.confounder.time': 'يتنوع وقت النشر من اليوم عبر المشاركات الأساسية.',
  'analytics.evidence.confounder.format':
    'لا يمكن مقارنة منشورات الصور ومنشورات الفيديو بشكل مباشر هنا.',
  'analytics.evidence.confounder.followers':
    'تم تغيير عدد المتابعين على {account} بـ {percent} خلال هذه الفترة.',
  'analytics.evidence.confounder.paid':
    'Relay لا يمكنه معرفة ما إذا كان أي من هذه المنشورات قد تلقى توزيعًا مدفوع الأجر.',
  'analytics.evidence.confounder.provider':
    '{provider} غيّر طريقة الإبلاغ عن {metric} خلال هذه الفترة.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'ماذا يعني {metric}',
  'analytics.definition.inlineHeading': 'التعريف',
  'analytics.definition.observedAt': 'تمت الملاحظة {dateTime}.',
  'analytics.definition.sourceLink': 'وثائق المزود',
  'analytics.definition.verifiedOn': 'تم التحقق من وثائق المزود على {date}.',
  'analytics.definition.panelTitle': 'تعريفات مترية في طريقة العرض هذه',
  'analytics.definition.panelIntro':
    'يأتي كل رقم على هذه الشاشة من حقل موفر واحد مسمى. تتكرر التعريفات أدناه أيضًا بجانب كل قيمة، لذلك لا يوجد أي شيء مهم موجود فقط في تلميح الأداة.',
  'analytics.definition.aggregation.sum': 'يتم تجميعها عن طريق إضافة كل ملاحظة.',
  'analytics.definition.aggregation.average': 'مجمعة كوسيلة.',
  'analytics.definition.aggregation.median': 'مجمعة كوسيط.',
  'analytics.definition.aggregation.last': 'أحدث الملاحظة.',
  'analytics.definition.aggregation.delta': 'التغيير بين الملاحظة الأولى والأخيرة.',
  'analytics.definition.aggregation.none': 'ذكرت كملاحظة واحدة.',
  'analytics.definition.denominator.none': 'وهذا إحصاء وليس معدل.',
  'analytics.definition.historyWindow':
    '{provider} يبقي {days, plural, one {# يوم} zero {# يوم} two {# يوم} few {# يوم} many {# يوم} other {# يوم}} التاريخ لهذا المجال.',
  'analytics.definition.historyWindowNone': '{provider} لا ينص على حد تاريخي لهذا الحقل.',

  'analytics.definition.term.providerField': 'مجال المزود',
  'analytics.definition.term.unit': 'وحدة',
  'analytics.definition.term.denominator': 'القاسم',
  'analytics.definition.term.aggregation': 'كيف يتم تجميعها',
  'analytics.definition.term.history': 'التاريخ الذي يحتفظ به المزود',
  'analytics.definition.term.definition': 'ما يقوله المزود يعني',

  'analytics.unit.count': 'عدد من الأحداث',
  'analytics.unit.seconds': 'ثواني',
  'analytics.unit.percent': 'النسبة المئوية التي قام الموفر باحتسابها بالفعل',
  'analytics.unit.ratio': 'نسبة Relay محسوبة من حقلين للموفرين',
  'analytics.unit.currency_minor': 'مبلغ من المال في وحدات صغيرة',

  'analytics.denominator.none': 'وهذا إحصاء وليس معدل. ليس لها قاسم.',
  'analytics.denominator.impressions': 'مقسمة على الانطباعات',
  'analytics.denominator.reach': 'مقسمة على الوصول',
  'analytics.denominator.views': 'مقسمة على وجهات النظر',
  'analytics.denominator.followers': 'مقسومًا على عدد المتابعين وقت الملاحظة',
  'analytics.denominator.sessions': 'مقسمة على الجلسات',

  'analytics.format.text': 'نص',
  'analytics.format.image': 'صورة',
  'analytics.format.carousel': 'دائري',
  'analytics.format.video': 'فيديو',
  'analytics.format.short_video': 'فيديو قصير',
  'analytics.format.long_video': 'فيديو طويل',
  'analytics.format.document': 'وثيقة',
  'analytics.format.thread': 'الموضوع',

  'analytics.value.unavailableReason.notImplemented':
    'لم يقم Relay ببناء التعيين لهذا المقياس على {provider} حتى الآن.',
  'analytics.value.estimated': 'يقدر',
  'analytics.value.estimatedMethod': 'الطريقة: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'من أين جاءت هذه الأرقام',
  'analytics.freshness.intro':
    'يتم تجميع مقدمي الخدمة وفقًا لجدولهم الزمني الخاص. لا يوجد شيء مباشر على هذه الشاشة.',
  'analytics.freshness.accountRow': '{account} على {provider}',
  'analytics.freshness.never': 'لم تتم مزامنتها مطلقًا',
  'analytics.freshness.nextAttempt': 'محاولة المزامنة التالية {relativeTime}.',
  'analytics.freshness.openStatus': 'حالة المزود',

  'analytics.accounts.title': 'الحسابات التي تحتاج إلى الاهتمام',
  'analytics.accounts.empty': 'قام كل حساب متصل بإرجاع البيانات في هذه الفترة. لا شيء يحتاجك هنا.',
  'analytics.accounts.reason.permission': 'لم يتم منح إذن التحليلات عندما كان هذا الحساب متصلاً.',
  'analytics.accounts.reason.expired': 'انتهت صلاحية الوصول، لذلك لم يتم جمع أي مقياس منذ {date}.',
  'analytics.accounts.reason.stale': 'آخر مزامنة ناجحة كانت {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {#محاولة المزامنة} zero {# محاولات المزامنة} two {# محاولات المزامنة} few {# محاولات المزامنة} many {# محاولات المزامنة} other {# محاولات المزامنة}} فشل على التوالي. السبب المسجل كان {reason}.',
  'analytics.accounts.reason.noPosts': 'لم يتم نشر أي شيء على هذا الحساب في النطاق المحدد.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'الملاحظات',
  'analytics.observations.intro': 'هذه أوصاف لما تظهره الأرقام. إنها ليست تنبؤات ولا تحدد السبب.',
  'analytics.observations.empty':
    'لا يوجد ما يكفي من التاريخ المنشور حتى الآن لوصف هذا النمط. انشر المزيد من المشاركات على نفس الحساب والتنسيق.',
  'analytics.observations.citedPosts': 'بناء على',
  'analytics.observations.citedPeriod': 'الفترة: {start} إلى {end}.',
  'analytics.observations.nextTestTitle': 'اختبار يمكنك إجراؤه بعد ذلك',
  'analytics.observations.nextTestBody':
    'نشر {count, plural, one {# مشاركة أخرى} zero {# مشاركات أخرى} two {# مشاركات أخرى} few {# مشاركات أخرى} many {# مشاركات أخرى} other {# مشاركات أخرى}} على {account} تغيير {variable} فقط، ثم قارن نفس المقياس. ضع علامة عليها كتجربة قبل النشر حتى يتم التخطيط للمقارنة بدلاً من العثور عليها بعد ذلك.',
  'analytics.observations.tagFirst': 'ضع علامة على تجربة',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} بمرور الوقت',
  'analytics.chart.summary':
    '{metric} على {account}، {count, plural, one {#نقطة} zero {# نقطة} two {# نقطة} few {# نقطة} many {# نقطة} other {# نقطة}} من {start} إلى {end}.',
  'analytics.chart.showTable': 'تظهر كجدول',
  'analytics.chart.hideTable': 'إخفاء الجدول',
  'analytics.chart.tableCaption': 'نفس السلسلة كجدول.',
  'analytics.chart.columnPeriod': 'الفترة',
  'analytics.chart.columnValue': 'القيمة',
  'analytics.chart.gapLabel': 'لم يتم جمع أي بيانات',
  'analytics.chart.gapExplained':
    'ويعني وجود فاصل في السطر أنه لم يتم جمع أي ملاحظة لتلك الفترة. ولا يعني الصفر.',
  'analytics.chart.annotation': 'تعليق توضيحي',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'لم يتم جمع الملاحظات في هذا النطاق.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'خطط للتجربة',
  'analytics.experiment.empty':
    'لا توجد تجارب بعد. التجربة هي مقارنة تقررها قبل النشر، وهي النوع الوحيد الذي يمكنه الإجابة على سؤال.',
  'analytics.experiment.emptyExample':
    'مثال: انشر نفس الإعلان على X مرتين، مرة بالرابط الموجود في المنشور ومرة بالرابط الموجود في التعليق الأول، ثم قارن النقرات على الرابط على مدار 72 ساعة.',
  'analytics.experiment.name': 'ماذا تختبر',
  'analytics.experiment.namePlaceholder': 'أول تعليق في 5 دقائق مقابل 30 دقيقة',
  'analytics.experiment.hypothesisPlaceholder':
    'تأخير أقصر قبل أن يحصل التعليق الأول على المزيد من الردود على X.',
  'analytics.experiment.variantLabel': 'البديل {index}',
  'analytics.experiment.variantDescription': 'ما هو مختلف في هذا البديل',
  'analytics.experiment.addVariant': 'إضافة البديل',
  'analytics.experiment.removeVariant': 'إزالة البديل {index}',
  'analytics.experiment.accounts': 'الحسابات متضمنة',
  'analytics.experiment.windowHelp':
    'تستمر المقاييس في التحرك بعد نشر المنشور. قم بإصلاح النافذة الآن حتى لا يتم إجراء المقارنة في لحظة تناسب متغيرًا واحدًا.',
  'analytics.experiment.windowDays':
    'قياس ل {count, plural, one {# يوم} zero {# يوم} two {# يوم} few {# يوم} many {# يوم} other {# يوم}} بعد نشر كل مشاركة',
  'analytics.experiment.minSample': 'الحد الأدنى من المشاركات لكل متغير',
  'analytics.experiment.minSampleHelp':
    'أسفل هذا العدد تظهر النتيجة على أنها غير حاسمة وليست فائزة.',
  'analytics.experiment.status.planned': 'المخطط لها',
  'analytics.experiment.status.collecting': 'جمع. {published} من {target} تم نشر المشاركات.',
  'analytics.experiment.status.inconclusive': 'كامل، لا يوجد فرق واضح',
  'analytics.experiment.result.difference':
    '{variant} سجل {percent} أكثر {metric} من {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'المتغيران موجودان ضمن {percent} من بعضهما البعض على {metric}. وهذا داخل النطاق الذي تختلف فيه هذه المشاركات على أي حال.',
  'analytics.experiment.result.association':
    'هذا هو الارتباط الذي يقاس عليه {count, plural, one {# مشاركة} zero {# مشاركات} two {# مشاركات} few {# مشاركات} many {# مشاركات} other {# مشاركات}}. ولا يثبت أن التغيير سبب الفرق.',
  'analytics.experiment.result.unavailable':
    '{metric} لم يكن متاحًا لـ {count, plural, one {# مشاركة} zero {# مشاركات} two {# مشاركات} few {# مشاركات} many {# مشاركات} other {# مشاركات}} في هذه التجربة، لذلك يتم استبعاد هذه المشاركات بدلاً من اعتبارها صفرًا.',
  'analytics.experiment.result.title': 'النتيجة',
  'analytics.experiment.completeNow': 'أغلق هذه التجربة',
  'analytics.experiment.completeConfirm':
    'إغلاق جمع توقف. تظل المنشورات منشورة وتبقى الأرقام متاحة.',
  'analytics.experiment.postsTitle': 'المشاركات في هذه التجربة',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'جارٍ تحميل التحليلات للحسابات المحددة',
  'analytics.state.loadingProvider': 'جلب تحليلات {provider}',
  'analytics.state.empty': 'لم يتم نشر أي شيء في هذا النطاق',
  'analytics.state.emptyBody':
    'تصف التحليلات المشاركات التي تم نشرها بالفعل. انشر شيئًا ما، أو قم بتوسيع النطاق الزمني.',
  'analytics.state.emptyExample':
    'بمجرد نشر المنشور، ستشاهد صفًا مثل: X @acme، "Launch thread"، 12400 ظهور، أي 58 بالمائة أعلى من متوسط العشرة السابقة.',
  'analytics.state.errorTitle': 'تعذر تحميل التحليلات',
  'analytics.state.errorBody':
    'لا يتم عرض أي رقم بدلاً من الرقم الذي تم تخمينه. مشاركاتك وإيصالاتك لن تتأثر.',
  'analytics.state.partialTitle': '{loaded} من حسابات {total} أعادت البيانات',
  'analytics.state.partialBody':
    'الحسابات التي أجابت تظهر مع نضارتها. أما البقية فقد تم سردهم مع سبب عدم قيامهم بذلك.',
  'analytics.state.partialSucceeded': 'البيانات التي تم إرجاعها',
  'analytics.state.partialFailed': 'لم يرجع البيانات',
  'analytics.state.offlineTitle': 'أنت غير متصل',
  'analytics.state.offlineBody':
    'تم تحميل الأشكال أدناه قبل انقطاع الاتصال، لذا فهي أقدم مما تشير إليه ملصقات الحداثة.',
  'analytics.state.permissionTitle': 'لا يمكنك رؤية التحليلات في مساحة العمل هذه',
  'analytics.state.permissionBody':
    'تحتاج التحليلات إلى دور المحلل أو أعلى. يمكن لمالك مساحة العمل هذه أو مسؤولها منحها.',
  'analytics.state.rateLimitTitle': '{provider} هو معدل تحديد طلبات التحليلات',
  'analytics.state.rateLimitCause':
    'لقد استخدم الحساب حصته من حصة الموفر لهذه النافذة. Relay لا يعيد المحاولة بجهد أكبر، لأن ذلك قد يؤخر النشر.',
  'analytics.state.rateLimitAlternative':
    'قم بتضييق النطاق الزمني أو مرشح الحساب، الذي يطلب من الموفر مبلغًا أقل.',
  'analytics.state.rateLimitReset': 'استئناف الطلبات',
  'analytics.state.reference': 'المرجع التشخيصي',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'قم بإنشاء رابط متعقب',
  'analytics.links.empty': 'لا توجد روابط متعقبة حتى الآن',
  'analytics.links.emptyBody':
    'الرابط الذي يتم تتبعه هو عنوان URL قصير يقوم Relay بإعادة التوجيه من خلاله، حتى تتمكن من رؤية النقرات حتى عندما لا يبلغ النظام الأساسي عن أي نقرات. ولا يتم تغيير الوجهة الأصلية أبدًا بدون إدخال التدقيق.',
  'analytics.links.emptyExample':
    'مثال: يعيد Relay.to/a7Kq2 التوجيه إلى acme.com/blog/launch مع الحملة q3-launch.',
  'analytics.links.table.caption': 'الارتباطات المتعقبة في مساحة العمل هذه وعدد نقرات الطرف الأول.',
  'analytics.links.campaign': 'حملة',
  'analytics.links.created': 'تم إنشاؤها',
  'analytics.links.usedIn':
    '{count, plural, =0 {لم تستخدم في وظيفة بعد} one {مُستخدَم في مشاركة واحدة} zero {مستخدم في # مشاركات} two {مستخدم في # مشاركات} few {مستخدم في # مشاركات} many {مستخدم في # مشاركات} other {مستخدم في # مشاركات}}',
  'analytics.links.state.active': 'نشط',
  'analytics.links.state.expired': 'انتهت الصلاحية {date}',
  'analytics.links.state.disabled': 'معطل',
  'analytics.links.state.disabledReason':
    'تم التعطيل بواسطة {actor} على {date}. سبب التسجيل: {reason}.',
  'analytics.links.detailTitle': 'رابط تتبع {slug}',
  'analytics.links.exactRedirect': 'إعادة التوجيه بالضبط',
  'analytics.links.exactRedirectHelp':
    'هذه هي الوجهة التي يصل إليها الزائر الآن، بما في ذلك كل معلمات UTM، موضحة بالكامل وغير مختصرة.',
  'analytics.links.editDestination': 'تغيير الوجهة',
  'analytics.links.editDestinationWarning':
    'يؤثر تغيير الوجهة على كل مكان تم نشر هذا الرابط فيه بالفعل. تحافظ التقارير الخاصة بالفترات التي سبقت التغيير على الوجهة التي كانت نشطة في ذلك الوقت.',
  'analytics.links.editDestinationAudit':
    'يتم تسجيل التغيير في سجل التدقيق باسمك والوجهة القديمة والوجهة الجديدة.',
  'analytics.links.destinationHistory': 'تاريخ الوجهة',
  'analytics.links.destinationHistoryRow': '{destination}، نشط من {start} إلى {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}، نشط منذ {start}',
  'analytics.links.domainLabel': 'مجال قصير',
  'analytics.links.domainDefault': 'Relay المجال الافتراضي',
  'analytics.links.domainVerified': 'تم التحقق منه بواسطة DNS على {date}',
  'analytics.links.domainPending': 'في انتظار سجل DNS',
  'analytics.links.domainPendingHelp':
    'أضف سجل TXT أدناه على {domain}، ثم تحقق مرة أخرى. وإلى أن يتم التحقق، لا يمكن تحديد هذا المجال لرابط جديد.',
  'analytics.links.domainFailed': 'سجل DNS غير متطابق في {date}',
  'analytics.links.domainCheck': 'تحقق من DNS مرة أخرى',
  'analytics.links.expiry': 'انتهاء الصلاحية',
  'analytics.links.expiryNone': 'لا توجد مجموعة انتهاء الصلاحية',
  'analytics.links.expiryHelp':
    'بعد انتهاء الصلاحية، يقوم الرابط بإرجاع صفحة عادية تفيد بأنه قد انتهى. لم يتم الإشارة إليه بصمت في مكان آخر.',
  'analytics.links.disable': 'قم بتعطيل هذا الرابط الآن',
  'analytics.links.disableTitle': 'تعطيل {slug}؟',
  'analytics.links.disableBody':
    'يصل الزائرون إلى صفحة تفيد بأن الرابط لم يعد متاحًا. لا تزال المشاركات المنشورة تحتوي على عنوان URL القصير، لذا يكون هذا مرئيًا لأي شخص ينقر عليه.',
  'analytics.links.disableReason': 'سبب التعطيل',
  'analytics.links.enable': 'قم بتفعيل هذا الرابط مرة أخرى',
  'analytics.links.abuseTitle': 'الإبلاغ عن إساءة استخدام هذا الرابط',
  'analytics.links.abuseBody':
    'إذا تم استخدام عنوان URL القصير هذا لشيء لم تكن تقصده، فأبلغ عنه وسيتم تعليق إعادة التوجيه أثناء مراجعته.',
  'analytics.links.abuseAction': 'الإبلاغ عن هذا الرابط',
  'analytics.links.measurementLabel': 'قياس إعادة توجيه الطرف الأول',
  'analytics.links.measurementExplained':
    'يحسب Relay طلبًا عندما يُطلب من خدمة إعادة التوجيه الحصول على عنوان URL هذا. تؤدي النقرة المكررة إلى إزالة الطلبات المتكررة من نفس الزائر داخل نافذة قصيرة، ويتم استبعاد الطلبات المطابقة لأنماط الزاحف المعروفة بدلاً من حذفها.',
  'analytics.links.botsNote':
    '{count, plural, one {#طلب} zero {#طلبات} two {#طلبات} few {#طلبات} many {#طلبات} other {#طلبات}} تم تصنيفها على أنها تلقائية وتم استبعادها من العدد المكرر.',
  'analytics.links.series.title': 'الطلبات والنقرات المكررة بمرور الوقت',
  'analytics.links.series.requests': 'إجمالي الطلبات',
  'analytics.links.series.clicks': 'النقرات المكررة',
  'analytics.links.breakdownTitle': 'من أين أتت النقرات؟',
  'analytics.links.breakdown.share': '{percent} من النقرات المكررة',
  'analytics.links.referrer.direct': 'لم يتم إرسال أي مُحيل',
  'analytics.links.referrer.social': 'منصة اجتماعية',
  'analytics.links.referrer.search': 'محرك البحث',
  'analytics.links.referrer.email': 'عميل البريد الإلكتروني',
  'analytics.links.referrer.other': 'موقع آخر',
  'analytics.links.device.mobile': 'الجوال',
  'analytics.links.device.desktop': 'سطح المكتب',
  'analytics.links.device.tablet': 'قرص',
  'analytics.links.device.unknown': 'لم يتم تحديدها',
  'analytics.links.countryUnknown': 'لم يتم تحديد البلد',
  'analytics.links.lastEventLabel': 'النقرة الأخيرة',
  'analytics.links.noEvents': 'لم يتم تسجيل أي نقرات حتى الآن',
  'analytics.links.noEventsBody':
    'لم يتم طلب هذا الارتباط منذ إنشائه. وهذا هو الصفر الحقيقي، الذي يتم قياسه بواسطة خدمة إعادة التوجيه الخاصة بنا.',
  'analytics.links.compareWarning':
    '{provider} تقارير {providerValue} نقرات الرابط لهذا المنشور. Relay تم تسجيل {relayValue} نقرات مكررة. الاثنان يحسبان أحداثًا مختلفة ولا يحل أي منهما محل الآخر.',
  'analytics.links.errorTitle': 'تعذر تحميل إحصائيات الارتباط',
  'analytics.links.errorBody':
    'لا تزال خدمة إعادة التوجيه تعمل، لذا يستمر الرابط في إرسال الزوار إلى وجهتهم. يتأثر التقارير فقط.',
  'analytics.links.createDestination': 'عنوان URL المقصود',
  'analytics.links.createDestinationHelp':
    'يجب أن يكون عنوان https عامًا. يتم رفض عناوين الشبكة الخاصة وسلاسل إعادة التوجيه بواسطة خدمة إعادة التوجيه.',
  'analytics.links.createCampaign': 'اسم الحملة',
  'analytics.links.createSlug': 'نهاية مخصصة',
  'analytics.links.createSlugHelp': 'اترك هذا فارغًا وسينشئ Relay نهاية عشوائية قصيرة.',
  'analytics.links.createUtm': 'معلمات UTM',
  'analytics.links.blockedScheme': 'يتم قبول وجهات https فقط.',
  'analytics.links.blockedPrivate':
    'هذا العنوان موجود على شبكة خاصة، لذا لن تقبله خدمة إعادة التوجيه.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'القواعد',
  'automation.tab.feeds': 'خلاصات RSS',
  'automation.tab.label': 'أقسام الأتمتة',

  'automation.rules.table.caption': 'قواعد الأتمتة في مساحة العمل هذه.',
  'automation.rules.table.rule': 'القاعدة',
  'automation.rules.table.state': 'الدولة',
  'automation.rules.table.accounts': 'الحسابات',
  'automation.rules.table.lastRun': 'التشغيل الأخير',
  'automation.rules.table.nextCheck': 'الاختيار التالي',
  'automation.rules.neverRun': 'لم يتم تشغيله بعد',
  'automation.rules.emptyExample':
    'مثال: عندما يظهر عنصر جديد في موجز مدونة Acme، إذا كانت اللغة الإنجليزية، فقم بإنشاء مسودة من قالب إعلان المدونة واطلب الموافقة.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {لم يتم اختيار أي حسابات} one {# حساب} zero {#حسابات} two {#حسابات} few {#حسابات} many {#حسابات} other {#حسابات}}',
  'automation.rules.openRule': 'مفتوح {name}',
  'automation.rules.duplicateRule': 'مكررة {name}',
  'automation.rules.deleteTitle': 'حذف {name}؟',
  'automation.rules.deleteBody':
    'تتوقف القاعدة فورًا ويتم الاحتفاظ بسجل تشغيلها لسجل التدقيق. المشاركات التي تم إنشاؤها بالفعل لا تتأثر.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'فشل التعليق المجدول أو عنصر الموضوع',

  'automation.condition.timeWindow': 'الوقت بين {start} و {end} في {timeZone}',
  'automation.condition.domainPresent': 'روابط النص إلى {domain}',
  'automation.condition.hashtagPresent': 'يحتوي النص على الهاشتاج {hashtag}',
  'automation.condition.providerCapability': 'يمكن للحساب أن يفعل بالفعل {capability}',
  'automation.condition.planStatus': 'الاشتراك نشط',

  'automation.action.continueSequence': 'تابع الموضوع المُجهز أو تسلسل التعليق',
  'automation.action.notifyEmail': 'إرسال بريد إلكتروني إلى {target}',
  'automation.action.notifyWebhook': 'أرسل خطافًا عبر الويب إلى {target}',
  'automation.action.pauseConnection': 'إيقاف الحساب المتأثر مؤقتًا',
  'automation.action.quotePost': 'اقتبس منشور المصدر مرة واحدة',
  'automation.action.followUpComment': 'إضافة تعليق معد على المنشور المصدر',

  'automation.param.feed': 'تغذية',
  'automation.param.template': 'القالب',
  'automation.param.signature': 'التوقيع',
  'automation.param.disclosure': 'الإفصاح',
  'automation.param.locale': 'اللغة',
  'automation.param.brand': 'Brand',
  'automation.param.campaign': 'حملة',
  'automation.param.account': 'الحساب',
  'automation.param.platform': 'منصة',
  'automation.param.contentType': 'نوع المحتوى',
  'automation.param.keyword': 'الكلمة الرئيسية',
  'automation.param.hashtag': 'هاشتاج',
  'automation.param.domain': 'المجال',
  'automation.param.capability': 'القدرة',
  'automation.param.timeZone': 'المنطقة الزمنية',
  'automation.param.startTime': 'من',
  'automation.param.endTime': 'ل',
  'automation.param.duration': 'المدة',
  'automation.param.metric': 'متري',
  'automation.param.value': 'القيمة',
  'automation.param.target': 'أرسل إلى',
  'automation.param.time': 'الوقت',
  'automation.param.cadence': 'كم مرة',
  'automation.param.notSet': 'لم يتم ضبطه',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'اسم القاعدة',
  'automation.editor.namePlaceholder': 'بلوق إلى الاجتماعية',
  'automation.editor.when': 'متى',
  'automation.editor.if': 'إذا',
  'automation.editor.then': 'ثم',
  'automation.editor.after': 'بعد',
  'automation.editor.until': 'حتى',
  'automation.editor.sentenceLabel': 'جملة القاعدة',
  'automation.editor.readBack': 'اقرأ الجملة مرة أخرى قبل تشغيل هذا. إنها القاعدة بأكملها.',
  'automation.editor.chooseTrigger': 'اختر ما يبدأ هذه القاعدة',
  'automation.editor.addCondition': 'أضف شرطا',
  'automation.editor.addAction': 'أضف إجراءً',
  'automation.editor.removeCondition': 'احذف الشرط {label}',
  'automation.editor.removeAction': 'إزالة الإجراء {label}',
  'automation.editor.moveActionUp': 'حرك {label} مبكرًا',
  'automation.editor.moveActionDown': 'انقل {label} لاحقًا',
  'automation.editor.actionOrder': 'يتم تنفيذ الإجراءات بهذا الترتيب، من الأعلى إلى الأسفل.',
  'automation.editor.noConditions': 'لا توجد شروط. يتم تشغيل القاعدة في كل مرة يتم تشغيلها.',
  'automation.editor.noActions':
    'لا توجد إجراءات حتى الآن. لا يمكن حفظ القاعدة التي لا تحتوي على أي إجراء.',
  'automation.editor.delayNone': 'لا تأخير',
  'automation.editor.delayLabel': 'التأخير قبل تشغيل الإجراءات',
  'automation.editor.endLabel': 'عندما تتوقف هذه القاعدة',
  'automation.editor.end.manual': 'أقوم بإيقاف تشغيل هذا',
  'automation.editor.end.date': 'التاريخ الذي اخترته',
  'automation.editor.end.count':
    'لقد تم تشغيله {count, plural, one {# الوقت} zero {# مرات} two {# مرات} few {# مرات} many {# مرات} other {# مرات}}',
  'automation.editor.end.dateValue': 'توقف',
  'automation.editor.end.countValue': 'توقف بعد هذا العديد من الأشواط',
  'automation.editor.parameterFor': 'إعدادات {label}',
  'automation.editor.saveDraft': 'حفظ كمسودة',
  'automation.editor.savedAt': 'تم الحفظ {time}',
  'automation.editor.unsaved': 'التغييرات غير المحفوظة',

  'automation.editor.view.sentence': 'الجملة',
  'automation.editor.view.structured': 'منظم',
  'automation.editor.view.api': 'تمثيل واجهة برمجة التطبيقات',
  'automation.editor.view.label': 'عرض المحرر',
  'automation.editor.apiHelp':
    'هذا هو بالضبط ما ترسله REST API وCLI وخادم MCP. تحريره هنا والعودة إلى الجملة يحافظ على كل حقل.',
  'automation.editor.apiInvalid': 'هذه ليست قاعدة JSON صالحة، لذلك لم يتم تطبيقها: {reason}',
  'automation.editor.apiApply': 'قم بتطبيق JSON هذا',
  'automation.editor.structuredHelp':
    'نفس القاعدة مثل الحقول. استخدم هذا عندما تحتوي القاعدة على العديد من الشروط وتكون الجملة طويلة.',

  'automation.editor.error.noAction': 'أضف إجراءً واحدًا على الأقل قبل الحفظ.',
  'automation.editor.error.noTrigger': 'اختر مشغلاً قبل الحفظ.',
  'automation.editor.error.noAccounts':
    'اختر حسابًا واحدًا على الأقل يمكن أن تعمل عليه هذه القاعدة.',
  'automation.editor.error.missingParameter': '{label} يحتاج إلى قيمة.',
  'automation.editor.error.summary':
    '{count, plural, one {#شيء يحتاج إلى اهتمامك} zero {#أشياء تحتاج إلى اهتمامك} two {#أشياء تحتاج إلى اهتمامك} few {#أشياء تحتاج إلى اهتمامك} many {#أشياء تحتاج إلى اهتمامك} other {#أشياء تحتاج إلى اهتمامك}} قبل أن يتم حفظ هذه القاعدة.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'ما الذي يبدأ هذه القاعدة',
  'automation.picker.conditionTitle': 'أضف شرطا',
  'automation.picker.actionTitle': 'أضف إجراءً',
  'automation.picker.search': 'تصفية هذه القائمة',
  'automation.picker.noResults': 'لا يوجد شيء في هذه القائمة يطابق ما كتبته.',
  'automation.picker.groupContent': 'المحتوى',
  'automation.picker.groupPublishing': 'النشر',
  'automation.picker.groupNotify': 'الناس والأنظمة',
  'automation.picker.groupControl': 'السيطرة على القاعدة',
  'automation.picker.groupSchedule': 'الوقت',
  'automation.picker.groupExternal': 'الأحداث الخارجية',
  'automation.picker.groupMeasurement': 'القياس',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {#الفعل هو} zero {#الافعال هي} two {#الافعال هي} few {#الافعال هي} many {#الافعال هي} other {#الافعال هي}} غير مدرج لأن الحسابات المحددة لا يمكنها تنفيذها.',
  'automation.picker.hiddenDetail': '{action} غير متاح لـ {provider}. {reason}',
  'automation.picker.consequential': 'يخلق شيئا على منصة',
  'automation.picker.internalOnly': 'يبقى في الداخل Relay',

  'automation.accounts.label': 'الحسابات التي قد تعمل عليها هذه القاعدة',
  'automation.accounts.help': 'لا يمكن للقاعدة أبدًا أن تمس حسابًا غير مدرج هنا، مهما كانت شروطه.',
  'automation.accounts.none': 'لم يتم تحديد أي حسابات حتى الآن',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'قواعد القياس لهذا الزناد',
  'automation.threshold.intro':
    'القاعدة التي تتفاعل مع رقم ما تحتاج إلى معرفة أي رقم، يتم قياسه خلال أي فترة، وعدد المرات التي يمكن أن يتصرف فيها.',
  'automation.threshold.metric': 'متري للمشاهدة',
  'automation.threshold.value': 'قيمة العتبة',
  'automation.threshold.window': 'نافذة القياس',
  'automation.threshold.windowHelp':
    'يتم حسابها من لحظة نشر مشاركة المصدر. خارج هذه النافذة تتوقف القاعدة عن مشاهدة المنشور.',
  'automation.threshold.expiry': 'توقف عن مشاهدة المنشور بعد ذلك',
  'automation.threshold.cooldown': 'التهدئة بين عمليات الإعدام',
  'automation.threshold.cooldownHelp': 'أقصر وقت مسموح به بين عمليتي تشغيل لنفس المنشور المصدر.',
  'automation.threshold.maxPerPost': 'الحد الأقصى لعدد عمليات الإعدام لكل منشور مصدر',
  'automation.threshold.defaultsTitle': 'الإعدادات الافتراضية التي تظل قائمة ما لم تقم بتغييرها',
  'automation.threshold.defaultOncePerPost': 'تشغيل مرة واحدة لكل مشاركة المصدر.',
  'automation.threshold.defaultStale':
    'لا تنفذ إذا كان المقياس غير متاح أو قديم. حد النضارة المستخدم هو {duration}.',
  'automation.threshold.staleLimit': 'تعامل مع المقياس على أنه قديم بعد ذلك',
  'automation.threshold.providerNote':
    '{provider} يُبلغ {metric} بالتأخير، لذلك لا يمكن تفعيل هذه القاعدة إلا بعد أن ينشر الموفر الرقم.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'المتابعة من حساب آخر',
  'automation.crossAccount.off': 'إيقاف. تعمل هذه القاعدة فقط على الحساب المصدر.',
  'automation.crossAccount.enable': 'السماح بالمتابعة من حساب آخر',
  'automation.crossAccount.body':
    'يجب أن يكون كلا الحسابين متصلين بمساحة العمل هذه ويجب تسمية كليهما هنا. المتابعة عبارة عن منشور مُجهز تكتبه مسبقًا، ويخضع لنفس سياسة الموافقة مثل أي شيء آخر.',
  'automation.crossAccount.sourceAccount': 'حساب المصدر',
  'automation.crossAccount.followUpAccount': 'الحساب الذي ينشر المتابعة',
  'automation.crossAccount.preauthorize':
    'أؤكد أن مساحة العمل هذه تتحكم في كل من {sourceAccount} و{followUpAccount}، وأن المتابعة لا يتم تقديمها كمصادقة مستقلة.',
  'automation.crossAccount.preauthorizeRequired':
    'قم بتأكيد التفويض المسبق قبل أن تتمكن من حفظ هذه القاعدة.',
  'automation.crossAccount.duplicateCheck':
    'يتم تشغيل عمليات التحقق من التكرارات والإيقاع عبر الحسابات قبل المتابعة، ويتم تخطيها بدلاً من تأخيرها إذا كانت ستكرر المنشور المصدر.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro':
    'كل ما تستطيع هذه القاعدة أن تفعله، قبل أن تتمكن من فعل أي شيء منه.',
  'automation.preflight.accountsLabel': 'الحسابات التي يمكن التصرف عليها',
  'automation.preflight.maxActionsLabel': 'معظم الإجراءات الخارجية لكل تشغيل',
  'automation.preflight.maxActionsPeriod':
    'على الأكثر {count, plural, one {#عمل خارجي} zero {#إجراءات خارجية} two {#إجراءات خارجية} few {#إجراءات خارجية} many {#إجراءات خارجية} other {#إجراءات خارجية}} في {period}.',
  'automation.preflight.approvalLabel': 'موافقة',
  'automation.preflight.approvalNone':
    'لا يؤدي أي إجراء في هذه القاعدة إلى إنشاء أي شيء على النظام الأساسي، لذلك لا تنطبق أي موافقة.',
  'automation.preflight.providerLabel': 'قيود المزود',
  'automation.preflight.providerNone': 'لا شيء ينطبق على الإجراءات في هذه القاعدة.',
  'automation.preflight.costLabel': 'التكلفة المقدرة المقدرة',
  'automation.preflight.costUnknown':
    'لا يمكن تقدير التكلفة لهذه الإجراءات حتى يتم معرفة سعر المزود.',
  'automation.preflight.costMethod':
    'تم تقديرها من قائمة أسعار المزودين على {date}. يسجل الإيصال ما تم تحصيله بالفعل.',
  'automation.preflight.cadenceLabel': 'الإيقاع والتكرارات',
  'automation.preflight.cadenceBody':
    'يتم إجراء عمليات التحقق من التكرارات والإيقاع قبل كل إجراء. يتم تخطي الإجراء الذي قد يتجاوز ميزانية الإيقاع الخاصة بالحساب وتسجيله، ولا يتم وضعه في قائمة الانتظار.',
  'automation.preflight.failureLabel': 'إذا فشل التشغيل',
  'automation.preflight.failure.pauseAfter':
    'تتوقف القاعدة مؤقتًا بعد ذلك {count, plural, one {#فشل متتالي} zero {#إخفاقات متتالية} two {#إخفاقات متتالية} few {#إخفاقات متتالية} many {#إخفاقات متتالية} other {#إخفاقات متتالية}} وملفات بند العمل.',
  'automation.preflight.failure.continue': 'يستمر تشغيل القاعدة ويتم تسجيل كل فشل في سجل التشغيل.',
  'automation.preflight.exampleLabel': 'تشغيل المثال',
  'automation.preflight.exampleIntro':
    'باستخدام الحدث الأخير الذي كان من الممكن أن يطابقه هذا المشغل.',
  'automation.preflight.exampleNone':
    'لم يحدث أي حدث مطابق حتى الآن، لذلك لا يمكن عرض أي مثال. تشغيل حدث اختبار بدلاً من ذلك.',
  'automation.preflight.activate': 'قم بتشغيل هذه القاعدة',
  'automation.preflight.activateConfirmTitle': 'قم بتشغيل {name}؟',
  'automation.preflight.activateConfirmBody':
    'من الآن فصاعدا، تعمل هذه القاعدة دون أن تطلب منك ذلك أولا، ضمن الحدود المذكورة أعلاه.',
  'automation.preflight.blocked':
    'لا يمكن تفعيل هذه القاعدة بعد. {count, plural, one {#عنصر} zero {# العناصر} two {# العناصر} few {# العناصر} many {# العناصر} other {# العناصر}} أعلاه يحتاج إلى قرار.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'حدث الاختبار',
  'automation.test.body':
    'يقوم الاختبار التجريبي بتقييم الجملة بأكملها ويظهر ما ستفعله. لا ينشر أبدًا، ولا ينشر تعليقًا أبدًا، ولا يرسل أبدًا خطافًا على الويب إلى نقطة نهاية حقيقية.',
  'automation.test.useLastEvent': 'استخدم أحدث حدث مطابق',
  'automation.test.usePayload': 'لصق حمولة الحدث',
  'automation.test.run': 'قم بإجراء الاختبار',
  'automation.test.running': 'تشغيل الاختبار',
  'automation.test.resultTitle': 'ماذا فعل الاختبار',
  'automation.test.conditionPassed': '{condition} مرت',
  'automation.test.conditionFailed': '{condition} لم يمر، فتوقفت القاعدة هنا',
  'automation.test.actionSimulated': 'سيتم تشغيل {action}',
  'automation.test.actionSkipped': 'سيتم تخطي {action}: {reason}',
  'automation.test.noExternalEffect': 'لم يتبق شيء Relay خلال هذا الاختبار.',
  'automation.test.failed': 'لا يمكن إكمال الاختبار: {reason}',

  'automation.runs.table.caption': 'أحدث تشغيل لهذه القاعدة.',
  'automation.runs.startedAt': 'بدأت',
  'automation.runs.outcome.label': 'النتيجة',
  'automation.runs.actionsTaken': 'الإجراءات',
  'automation.runs.trigger': 'أثار بواسطة',
  'automation.runs.outcome.completed': 'مكتمل',
  'automation.runs.outcome.skipped': 'تم تخطيه',
  'automation.runs.outcome.failed': 'فشل',
  'automation.runs.outcome.testMode': 'وضع الاختبار',
  'automation.runs.actionCount':
    '{count, plural, =0 {لا يوجد عمل خارجي} one {#عمل خارجي} zero {#إجراءات خارجية} two {#إجراءات خارجية} few {#إجراءات خارجية} many {#إجراءات خارجية} other {#إجراءات خارجية}}',
  'automation.runs.skippedReason': 'تم التخطي بسبب {reason}',
  'automation.runs.openDetail': 'افتح المدى من {time}',
  'automation.runs.createdItems': 'تم إنشاؤها',

  'automation.versions.caption': 'كل نسخة محفوظة من هذه القاعدة.',
  'automation.versions.current': 'الحالي',
  'automation.versions.savedBy': 'تم الحفظ بواسطة {actor} على {date}',
  'automation.versions.compare': 'مقارنة مع الإصدار الحالي',
  'automation.versions.restore': 'استعادة هذا الإصدار',
  'automation.versions.restoreConfirm':
    'تؤدي الاستعادة إلى إنشاء إصدار جديد. لا تتم الكتابة فوق أي شيء وتظل القاعدة في حالتها الحالية حتى تقوم بتشغيلها.',
  'automation.versions.diffTitle': 'الإصدار {from} مقارنة بالإصدار {to}',

  'automation.kill.title': 'توقف عن {name} الآن',
  'automation.kill.body':
    'تتوقف القاعدة فورًا، في منتصف الجولة في حالة حدوثها. أي شيء تم إرساله بالفعل إلى النظام الأساسي يظل منشورًا، لأنه لا يتم التراجع عن أي مشاركة خارجية أبدًا.',
  'automation.kill.confirmPhrase': 'توقف',
  'automation.kill.confirmLabel': 'اكتب إيقاف للتأكيد',
  'automation.kill.stopped':
    'تم إيقاف هذه القاعدة بواسطة {actor} على {date}. ولا يمكن تشغيله مرة أخرى حتى تقوم بتشغيله مرة أخرى.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'تحميل قواعد الأتمتة',
  'automation.state.loadingRule': 'تحميل القاعدة وأشواطها الأخيرة',
  'automation.state.errorTitle': 'لا يمكن تحميل القواعد',
  'automation.state.errorBody':
    'القواعد التي هي قيد التشغيل بالفعل لا تتأثر بهذا. فشلت هذه الشاشة فقط.',
  'automation.state.offlineTitle': 'أنت غير متصل',
  'automation.state.offlineBody':
    'يمكنك قراءة قاعدة وتحرير المسودة، وتبقى على هذا الجهاز. يحتاج حفظ القاعدة واختبارها وتشغيلها إلى اتصال.',
  'automation.state.permissionTitle': 'لا يمكنك تغيير قواعد الأتمتة',
  'automation.state.permissionBody':
    'تعمل القواعد على الحسابات المتصلة، لذا فإن تغيير أحد الحسابات يحتاج إلى دور المدير أو دور أعلى. لا يزال بإمكانك قراءة كل قاعدة وتاريخ تشغيلها.',
  'automation.state.rateLimitTitle': 'يتم إبطاء تشغيل القواعد',
  'automation.state.rateLimitCause':
    'وصلت مساحة العمل هذه إلى الحد المسموح به لتشغيل الأتمتة للنافذة الحالية. لا تتأثر المنشورات المجدولة والنشر اليدوي.',
  'automation.state.rateLimitAlternative':
    'يمكن إعطاء القواعد ذات الإيقاع فاصلًا زمنيًا أطول، والذي يستخدم عمليات تشغيل أقل.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'قم بتحويل الموجز إلى مسودات أو منشورات مجدولة، بنفس التحقق والموافقة مثل أي شيء تكتبه بنفسك.',
  'automation.rss.empty': 'لا توجد خلاصات حتى الآن',
  'automation.rss.emptyBody':
    'أضف خلاصة وRelay يتحقق منها وفقًا لجدول زمني. يصبح كل عنصر جديد مسودة أو منشورًا مجدولاً أو طلب موافقة، أيًا كان اختيارك.',
  'automation.rss.emptyExample':
    'مثال: تقوم خلاصة مدونة Acme بإنشاء مسودة لـ X وLinkedIn في كل مرة يتم فيها نشر مقال، وتنتظر الموافقة.',
  'automation.rss.table.caption': 'يغذي استطلاعات مساحة العمل هذه.',
  'automation.rss.table.feed': 'تغذية',
  'automation.rss.table.policy': 'ماذا يحدث لعنصر جديد',
  'automation.rss.table.health': 'الصحة',

  'automation.rss.step.url': 'عنوان الخلاصة',
  'automation.rss.step.preview': 'تحقق من التغذية',
  'automation.rss.step.seen': 'نقطة البداية',
  'automation.rss.step.targets': 'أين تذهب',
  'automation.rss.step.template': 'ماذا يقول هذا المنصب',
  'automation.rss.step.policy': 'كيف يتم نشره',
  'automation.rss.stepOf': 'الخطوة {current} من {total}',

  'automation.rss.urlHelp':
    'Relay يجلب الخلاصة من خوادمنا، وليس من متصفحك. تم رفض عناوين الشبكة الخاصة.',
  'automation.rss.validateAction': 'تحقق من هذه التغذية',
  'automation.rss.validateFailed': 'لم يُرجع هذا العنوان خلاصة قابلة للقراءة',
  'automation.rss.validateFailedReason': 'ما حصلنا عليه: {reason}',
  'automation.rss.validateBlocked': 'يشير هذا العنوان إلى شبكة خاصة، لذلك لم يتم جلبه.',
  'automation.rss.previewTitle': 'معاينة الخلاصة',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {#عنصر} zero {# العناصر} two {# العناصر} few {# العناصر} many {# العناصر} other {# العناصر}} عاد، الأحدث أولا.',
  'automation.rss.previewItemPublished': 'تم النشر {dateTime}',
  'automation.rss.previewNoImage': 'لا توجد صورة في هذا البند',
  'automation.rss.previewImageAlt': 'صورة من عنصر الخلاصة {title}',
  'automation.rss.previewNoDate':
    'لا يحتوي هذا العنصر على طابع زمني، لذا يستخدم Relay الوقت الذي رآه فيه لأول مرة.',
  'automation.rss.previewFieldsTitle': 'الحقول التي توفرها هذه الخلاصة',
  'automation.rss.previewFieldMissing': 'غير موجود في هذه الخلاصة',

  'automation.rss.seenTitle': 'ما يعتبر كما رأينا بالفعل',
  'automation.rss.seenLatest':
    'تعامل مع كل شيء موجود حاليًا في الخلاصة كما رأينا. يتم ترحيل العناصر المستقبلية فقط.',
  'automation.rss.seenAll': 'تعامل مع العنصر الأحدث على أنه جديد وقم بنشره في الشيك التالي.',
  'automation.rss.seenHelp':
    'تحتوي معظم الخلاصات على مقالات قديمة. إن اختيار الخيار الأول هو كيفية تجنب نشر الأعمال المتراكمة.',

  'automation.rss.targetsHelp':
    'اختر الحسابات أو المجموعة المحفوظة. لا يزال كل هدف يحصل على التحقق الخاص به قبل جدولة أي شيء.',
  'automation.rss.targetGroup': 'المجموعة المحفوظة',
  'automation.rss.targetIndividual': 'الحسابات الفردية',

  'automation.rss.templateFields': 'الحقول المتاحة',
  'automation.rss.templateInsert': 'أدخل {field}',
  'automation.rss.templateField.title': 'عنوان السلعة',
  'automation.rss.templateField.summary': 'ملخص البند',
  'automation.rss.templateField.link': 'رابط السلعة',
  'automation.rss.templateField.author': 'مؤلف المادة',
  'automation.rss.templateField.published': 'تاريخ النشر',
  'automation.rss.templateField.categories': 'الفئات',
  'automation.rss.templatePreview': 'معاينة مع العنصر الأحدث',
  'automation.rss.adaptWithAi': 'قم بتكييف النص لكل هدف',
  'automation.rss.adaptHelp':
    'تتم إعادة كتابة الصياغة لتناسب كل منصة وتظهر على أنها اختلاف بين قبولك أو رفضك. تأتي الوسائط من عنصر الخلاصة. Relay لا يقوم بإنشاء صور.',
  'automation.rss.noImageGeneration': 'إذا لم يكن لعنصر الموجز صورة، فسيخرج المنشور بدون صورة.',
  'automation.rss.imageFromFeed': 'استخدم الصورة من عنصر الخلاصة عندما تحتوي على صورة',

  'automation.rss.policyHelp':
    'عنصر الخلاصة ليس خاصًا. إنها تتبع نفس سياسة الموافقة مثل المنشور الذي تكتبه بنفسك.',
  'automation.rss.cadenceInterval': 'عنصر واحد على الأكثر كل',
  'automation.rss.cadenceHelp':
    'تنتظر العناصر الإضافية في قائمة الانتظار بدلاً من النشر معًا، وبالتالي فإن الموجز الذي ينشر عشر مقالات في وقت واحد لا يؤدي إلى إغراق الحساب.',
  'automation.rss.immediateWarning':
    'النشر الفوري يرسل منشورًا إلى منصة دون أن يقرأه الشخص أولاً. وهو متاح فقط إذا كانت سياسة الموافقة لهذه الحسابات تسمح بذلك.',

  'automation.rss.healthTitle': 'صحة التغذية',
  'automation.rss.healthOk': 'العمل',
  'automation.rss.healthStalled': 'لا يوجد عنصر جديد لـ {duration}',
  'automation.rss.healthFailing':
    'الأخير {count, plural, one {تحقق} zero {# الشيكات} two {# الشيكات} few {# الشيكات} many {# الشيكات} other {# الشيكات}} فشل',
  'automation.rss.health.nextPoll': 'الفحص التالي {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {لم تتم معالجة أي عناصر حتى الآن} one {تمت معالجة عنصر واحد} zero {تمت معالجة # عنصرًا} two {تمت معالجة # عنصرًا} few {تمت معالجة # عنصرًا} many {تمت معالجة # عنصرًا} other {تمت معالجة # عنصرًا}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {لم يتم تخطي أي تكرارات} one {تم تخطي # نسخة مكررة} zero {تم تخطي # نسخة مكررة} two {تم تخطي # نسخة مكررة} few {تم تخطي # نسخة مكررة} many {تم تخطي # نسخة مكررة} other {تم تخطي # نسخة مكررة}}',
  'automation.rss.health.lastPollLabel': 'آخر فحص',
  'automation.rss.health.lastItemLabel': 'آخر عنصر جديد في الخلاصة',
  'automation.rss.health.lastPostLabel': 'آخر مسودة أو مشاركة تم إنشاؤها',
  'automation.rss.health.processedLabel': 'العناصر التي تمت معالجتها',
  'automation.rss.recentItems': 'العناصر الأخيرة',
  'automation.rss.itemOutcome.draft': 'تم إنشاء المسودة',
  'automation.rss.itemOutcome.scheduled': 'المقرر ل {time}',
  'automation.rss.itemOutcome.published': 'تم النشر',
  'automation.rss.itemOutcome.awaitingApproval': 'في انتظار الموافقة',
  'automation.rss.itemOutcome.duplicate': 'تخطي، رأيت بالفعل',
  'automation.rss.itemOutcome.failed': 'فشل: {reason}',
  'automation.rss.pauseFeed': 'قم بإيقاف هذه التغذية مؤقتًا',
  'automation.rss.resumeFeed': 'استئناف هذه الخلاصة',
  'automation.rss.deleteTitle': 'إزالة {title}؟',
  'automation.rss.deleteBody':
    'Relay يتوقف عن التحقق من هذه الخلاصة. تظل المسودات والمشاركات التي تم إنشاؤها بالفعل كما هي تمامًا.',
  'automation.rss.errorTitle': 'لا يمكن قراءة هذه الخلاصة',
  'automation.rss.errorBody':
    'Relay يستمر في التحقق من الجدول الزمني العادي. لم يتم نشر أي شيء من الرد الجزئي.',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'غير متوفر في أي قاعدة',
  'automation.refuse.body':
    'الإعجابات والمتابعات التلقائية، ومجموعات المشاركة، والردود والرسائل غير المرغوب فيها، ونشر نفس المحتوى من عدة حسابات لجعله يبدو شائعًا ليست خيارات هنا. تحظرها المنصات وتلحق الضرر بالحسابات التي تستخدمها.',
  'automation.refuse.readPolicy': 'اقرأ سياسة الاستخدام المقبول',
} as const;
