/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
  'composerWeb.pane.targets': 'الحسابات المستهدفة والمجموعات',
  'composerWeb.pane.master': 'المسودة الرئيسية والإعدادات المشتركة',
  'composerWeb.pane.variant': 'نسخة للهدف المفتوح',
  'composerWeb.pane.review': 'المعاينة والتحقق والتكلفة والموافقة',
  'composerWeb.pane.showPreview': 'إظهار المعاينة',
  'composerWeb.pane.hidePreview': 'إخفاء المعاينة',
  'composerWeb.pane.previewCollapsed': 'لوحة المعاينة مخفية. افتحه للتحقق من المشاركة النهائية.',

  'composerWeb.step.targets': 'الأهداف',
  'composerWeb.step.write': 'اكتب',
  'composerWeb.step.perTarget': 'لكل هدف',
  'composerWeb.step.review': 'مراجعة',
  'composerWeb.step.progress': 'الخطوة {current} من {total}',
  'composerWeb.step.legend': 'Composer الخطوات',

  'composerWeb.summary.label': 'مسودة ملخص',
  'composerWeb.summary.targets':
    '{count, plural, =0 {لا أهداف} one {#الهدف} zero {#أهداف} two {#أهداف} few {#أهداف} many {#أهداف} other {#أهداف}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {لا توجد قضايا} one {# قضية} zero {# قضايا} two {# قضايا} few {# قضايا} many {# قضايا} other {# قضايا}}',
  'composerWeb.summary.notScheduled': 'لم يتم اختيار الوقت',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'التكلفة لم يتم تسعيرها بعد',
  'composerWeb.summary.openReview': 'مراجعة مفتوحة',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'مسودة رئيسية',
  'composerWeb.rail.masterHint': 'قم بالتحرير هنا للوصول إلى كل هدف لا يزال يرث.',
  'composerWeb.rail.accountsHeading': 'الحسابات المستهدفة',
  'composerWeb.rail.setsHeading': 'مجموعات ومجموعات',
  'composerWeb.rail.setsHelp':
    'المجموعة عبارة عن مجموعة محفوظة من الحسابات والإعدادات الافتراضية. تطبيق واحد ينسخ قيمه في هذه المسودة. التعديلات اللاحقة على المجموعة لا تغير هذه المسودة.',
  'composerWeb.rail.openTarget': 'افتح الإصدار لـ {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'الحد غير معروف',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {لا وسائل الإعلام} one {#ملف الوسائط} zero {#ملفات الوسائط} two {#ملفات الوسائط} few {#ملفات الوسائط} many {#ملفات الوسائط} other {#ملفات الوسائط}}',
  'composerWeb.rail.paused': 'متوقف مؤقتًا. ولن يتم النشر حتى تستأنفه.',
  'composerWeb.rail.state.notBuilt': 'لم يتم بناؤها بعد',
  'composerWeb.rail.state.unsupported': 'لا يدعم المزود',
  'composerWeb.rail.empty': 'لم يتم تحديد أي حسابات حتى الآن.',
  'composerWeb.rail.emptyHelp':
    'اختر الحسابات التي يجب أن تصل إليها هذه المشاركة. يمكنك إضافة المزيد لاحقا.',
  'composerWeb.rail.divergenceHint': 'افتح هدفًا لرؤية نسخته الخاصة. المسودة الرئيسية لم تتغير.',
  'composerWeb.rail.searchLabel': 'تصفية الحسابات',
  'composerWeb.rail.removeTarget': 'إزالة {account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'التحرير العالمي',
  'composerWeb.globalEdit.title': 'قم بتطبيق هذا التغيير على كل هدف محدد',
  'composerWeb.globalEdit.description':
    'تتغير المسودة الرئيسية دائمًا. الأهداف التي لا تزال ترث هذا المجال تتبعه. الأهداف مع نسختها الخاصة تحافظ عليها.',
  'composerWeb.globalEdit.fieldLabel': 'الميدان',
  'composerWeb.globalEdit.compatibleHeading': 'هذه الأهداف تأخذ التغيير',
  'composerWeb.globalEdit.keepsOverrideHeading': 'تحتفظ هذه الأهداف بنسختها الخاصة',
  'composerWeb.globalEdit.incompatibleHeading': 'ولا يمكن لهذه الأهداف أن تتحمل التغيير',
  'composerWeb.globalEdit.incompatibleHelp':
    'لا يتم إسقاط أي شيء دون إخبارك. يحصل كل حساب أدناه على نسخة صريحة مع التغيير المعدل، ويمكنك تعديله بعد ذلك.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} يسمح بـ {limit} حرفًا. هذا النص هو {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} لا يقبل رابط في هذا المجال. يبقى الارتباط في المسودة الرئيسية وفي الأهداف التي تسمح بذلك.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} يقبل {limit, plural, one {# ملف} zero {# ملفات} two {# ملفات} few {# ملفات} many {# ملفات} other {# ملفات}}. تحتوي هذه المسودة على {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported': '{account} لا يقبل ملفات {mimeType}.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} لا يدعم عناصر المتابعة، لذلك يبقى التسلسل في المسودة الرئيسية.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} ينشر نصًا عاديًا. ستظهر علامات التنسيق كأحرف.',
  'composerWeb.globalEdit.adaptedPreview': 'ما الذي يحصل عليه {account} بدلاً من ذلك',
  'composerWeb.globalEdit.confirm': 'تطبيق وإنشاء الإصدارات',
  'composerWeb.globalEdit.nothingToApply':
    'لا شيء يتغير. المسودة الرئيسية لديها هذه القيمة بالفعل.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {تم تطبيق التغيير على هدف واحد} zero {تم تطبيق التغيير على # هدفًا} two {تم تطبيق التغيير على # هدفًا} few {تم تطبيق التغيير على # هدفًا} many {تم تطبيق التغيير على # هدفًا} other {تم تطبيق التغيير على # هدفًا}}. {adapted, plural, =0 {لا يوجد هدف يحتاج إلى نسخة معدلة} one {# الهدف حصل على نسخة معدلة} zero {حصل # هدف على نسخ معدلة} two {حصل # هدف على نسخ معدلة} few {حصل # هدف على نسخ معدلة} many {حصل # هدف على نسخ معدلة} other {حصل # هدف على نسخ معدلة}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'هذا الهدف له نسخته الخاصة',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# يختلف الحقل عن المسودة الرئيسية} zero {# الحقول تختلف عن المسودة الرئيسية} two {# الحقول تختلف عن المسودة الرئيسية} few {# الحقول تختلف عن المسودة الرئيسية} many {# الحقول تختلف عن المسودة الرئيسية} other {# الحقول تختلف عن المسودة الرئيسية}}',
  'composerWeb.override.field.body': 'نشر النص',
  'composerWeb.override.field.contentKind': 'نوع المشاركة',
  'composerWeb.override.field.locale': 'لغة المحتوى',
  'composerWeb.override.field.mediaIds': 'وسائل الإعلام',
  'composerWeb.override.field.links': 'روابط',
  'composerWeb.override.field.signature': 'التوقيع',
  'composerWeb.override.field.threadItems': 'التعليقات والموضوع',
  'composerWeb.override.field.schedule': 'الجدول الزمني',
  'composerWeb.override.resetField': 'إعادة تعيين {field} للإتقان',
  'composerWeb.override.resetFieldTitle': 'إعادة تعيين {field} إلى {account}؟',
  'composerWeb.override.resetFieldBody':
    'تم تجاهل إصدار {field} المكتوب لـ {account} واستخدام المسودة الرئيسية مرة أخرى. لا توجد تغييرات أخرى في الهدف.',
  'composerWeb.override.resetAll': 'إعادة تعيين كل حقل لإتقانه',
  'composerWeb.override.inheritNotice':
    'هذا الهدف يتبع المسودة الرئيسية. يؤدي تحرير أي شيء هنا إلى إنشاء إصدار يتلقاه {account} فقط.',
  'composerWeb.override.created': '{account} الآن لديه {field} خاص به.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'حدود {account}',
  'composerWeb.limits.text': 'أرسل ما يصل إلى {limit} حرفًا',
  'composerWeb.limits.linkCost':
    'الرابط يعتبر {count, plural, one {# حرف} zero {# أحرف} two {# أحرف} few {# أحرف} many {# أحرف} other {# أحرف}} مهما كان طوله.',
  'composerWeb.limits.images':
    '{count, plural, =0 {لا توجد صور} one {# صورة} zero {ما يصل إلى # صورة} two {ما يصل إلى # صورة} few {ما يصل إلى # صورة} many {ما يصل إلى # صورة} other {ما يصل إلى # صورة}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {لا يوجد فيديو} one {#فيديو} zero {ما يصل إلى # مقطع فيديو} two {ما يصل إلى # مقطع فيديو} few {ما يصل إلى # مقطع فيديو} many {ما يصل إلى # مقطع فيديو} other {ما يصل إلى # مقطع فيديو}}',
  'composerWeb.limits.duration': 'فيديو يصل إلى {duration}',
  'composerWeb.limits.aspect': 'نسبة العرض إلى الارتفاع بين {min} و{max}',
  'composerWeb.limits.fileSize': 'ملفات تصل إلى {size}',
  'composerWeb.limits.mimeTypes': 'أنواع الملفات المقبولة: {types}',
  'composerWeb.limits.source': 'من لقطة القدرة {version}، اقرأ {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'مطلوب صورة مصغرة.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': 'إعدادات {provider}',
  'composerWeb.native.privacy': 'من يستطيع رؤية هذا',
  'composerWeb.native.privacyChoose': 'اختر جمهورًا',
  'composerWeb.native.privacyExplicit':
    '{provider} لا يسمح بجمهور محدد مسبقًا. اختر واحدة قبل أن تتمكن من جدولة ذلك.',
  'composerWeb.native.community': 'المجتمع',
  'composerWeb.native.board': 'مجلس',
  'composerWeb.native.group': 'المجموعة أو الصفحة',
  'composerWeb.native.organization': 'التنظيم',
  'composerWeb.native.channel': 'قناة',
  'composerWeb.native.publication': 'النشر',
  'composerWeb.native.disclosureHeading': 'الإفصاح',
  'composerWeb.native.disclosureCommercial': 'هذا المنشور يروج لمنتج أو خدمة',
  'composerWeb.native.disclosureBranded': 'هذا المنشور عبارة عن محتوى ذو علامة تجارية لشركة أخرى',
  'composerWeb.native.disclosureAi': 'تم إنشاء بعض هذا المحتوى باستخدام أداة الذكاء الاصطناعي',
  'composerWeb.native.disclosureUnsupported':
    '{provider} لا يقدم هذا الكشف من خلال واجهة برمجة التطبيقات (API) الخاصة به. قم بإضافته في النص بدلاً من ذلك.',
  'composerWeb.native.none': 'لا تنطبق إعدادات {provider} على نوع المنشور هذا.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'تم الحل في {provider}',
  'composerWeb.entity.resolvedId': 'معرف الحساب {externalId}',
  'composerWeb.entity.plainTextWarning':
    'غير متطابق. سيتم نشره كنص عادي، وهو ليس علامة أصلية على {provider}.',
  'composerWeb.entity.removeMention': 'احذف ذكر {label}',
  'composerWeb.entity.addMention': 'أضف إشارة',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {لا يذكر} one {#ذكر} zero {# يذكر} two {# يذكر} few {# يذكر} many {# يذكر} other {# يذكر}}‎{resolved} متطابق مع حساب حقيقي',
  'composerWeb.entity.lookupUnsupported':
    '{provider} لا يقدم بحثًا عن الكيانات لهذا النوع من الحساب.',
  'composerWeb.entity.lookupNotBuilt':
    'Relay لم ينشئ بحثًا عن الكيان لـ {provider} حتى الآن. لا شيء يخمن في هذه الأثناء.',
  'composerWeb.entity.searchHint': 'اكتب حرفين على الأقل، ثم اختر نتيجة.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {لا توجد مباريات} one {#مباراة} zero {# مباريات} two {# مباريات} few {# مباريات} many {# مباريات} other {# مباريات}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'روابط',
  'composerWeb.links.detected':
    '{count, plural, one {تم العثور على رابط واحد في هذه المسودة} zero {تم العثور على # رابط في هذه المسودة} two {تم العثور على # رابط في هذه المسودة} few {تم العثور على # رابط في هذه المسودة} many {تم العثور على # رابط في هذه المسودة} other {تم العثور على # رابط في هذه المسودة}}',
  'composerWeb.links.noneDetected': 'لا توجد روابط في هذه المسودة حتى الآن.',
  'composerWeb.links.modeLabel': 'كيف ينشر هذا الرابط',
  'composerWeb.links.original': 'عنوان URL الأصلي',
  'composerWeb.links.utmSource': 'المصدر',
  'composerWeb.links.utmMedium': 'متوسط',
  'composerWeb.links.utmCampaign': 'حملة',
  'composerWeb.links.utmTerm': 'مصطلح',
  'composerWeb.links.utmContent': 'المحتوى',
  'composerWeb.links.domainVerified': '{domain}، تم التحقق منه لمساحة العمل هذه',
  'composerWeb.links.domainDefault': 'Relay المجال الافتراضي',
  'composerWeb.links.domainNone': 'لم يتم التحقق من نطاق العلامة التجارية حتى الآن.',
  'composerWeb.links.notAllowedHere': '{account} لا يسمح بالارتباط هنا.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'التعليق',
  'composerWeb.sequence.kindThread': 'جزء الخيط',
  'composerWeb.sequence.kindLabel': 'نوع العنصر',
  'composerWeb.sequence.moveUp': 'نقل هذا العنصر في وقت سابق',
  'composerWeb.sequence.moveDown': 'انقل هذا العنصر لاحقًا',
  'composerWeb.sequence.remove': 'قم بإزالة هذا العنصر',
  'composerWeb.sequence.absoluteTime': 'يعمل في {time}، وهو {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'إذا فشل أحد العناصر، فسيظل المنشور الذي تم نشره بالفعل منشورًا ولا يتم تشغيل العناصر بعده. تحصل على بند عمل.',
  'composerWeb.sequence.maxReached':
    '{account} يقبل {limit, plural, one {# متابعة المادة} zero {# متابعة العناصر} two {# متابعة العناصر} few {# متابعة العناصر} many {# متابعة العناصر} other {# متابعة العناصر}}.',
  'composerWeb.sequence.minDelay': 'أقصر تأخير يسمح به {provider} هنا هو {duration}.',
  'composerWeb.sequence.inheritAuthor': 'نفس الحساب المنشور',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {لا توجد قضايا} one {# قضية} zero {# قضايا} two {# قضايا} few {# قضايا} many {# قضايا} other {# قضايا}} على هذا البند',
  'composerWeb.sequence.customMinutes': 'بعد دقائق من البند السابق',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'كرر هذا المنصب',
  'composerWeb.repeat.cadenceLabel': 'كم مرة',
  'composerWeb.repeat.maximum': 'يمكن تشغيل المنشور المتكرر بحد أقصى {limit} مرة.',
  'composerWeb.repeat.occurrenceLabel': 'عدد المشاركات',
  'composerWeb.repeat.duplicateCheck':
    'يتم التحقق من كل تكرار للتأكد من عدم وجود محتوى مكرر قبل نشره. يصبح التكرار الذي يفشل في التحقق عنصر إجراء بدلاً من النشر.',
  'composerWeb.repeat.occurrenceList': 'الأحداث الأولى',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {و# حدوثًا آخر} zero {و # مرات أخرى} two {و # مرات أخرى} few {و # مرات أخرى} many {و # مرات أخرى} other {و # مرات أخرى}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'مجموعات والتوقيع',
  'composerWeb.set.pickerTitle': 'ابدأ من مجموعة',
  'composerWeb.set.pickerDescription':
    'مجموعة تملأ الأهداف والنص والإعدادات. تكون المسودة التي تنشئها مستقلة، لذا فإن تحرير المجموعة لاحقًا لا يؤدي أبدًا إلى تغيير المنشور المعتمد أو المجدول.',
  'composerWeb.set.accountCount':
    '{count, plural, one {# حساب} zero {#حسابات} two {#حسابات} few {#حسابات} many {#حسابات} other {#حسابات}}',
  'composerWeb.set.apply': 'استخدم هذه المجموعة',
  'composerWeb.set.none': 'لم يتم حفظ أي مجموعات حتى الآن.',
  'composerWeb.signature.pickerLabel': 'التوقيع',
  'composerWeb.signature.scope': 'لـ {brand} على {provider} في {language}',
  'composerWeb.signature.previewHeading': 'كيف ينتهي هذا المنصب',
  'composerWeb.signature.notMatching':
    'هذا التوقيع مخصص لعلامة تجارية أو منصة أو لغة مختلفة، لذلك لا يتم تقديمه هنا.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'مساعدة في هذا النص',
  'composerWeb.assist.unavailableTitle': 'لم يتم تكوين المساعدة النصية',
  'composerWeb.assist.unavailableBody':
    'لم يتم إعداد بوابة AI لمساحة العمل هذه، لذا تم إيقاف إجراءات المساعدة. كل شيء آخر في الملحن يعمل بشكل طبيعي.',
  'composerWeb.assist.targetLabel': 'ينطبق على',
  'composerWeb.assist.targetMaster': 'المسودة الرئيسية',
  'composerWeb.assist.targetVariant': 'نسخة {account}',
  'composerWeb.assist.beforeLabel': 'النص الحالي',
  'composerWeb.assist.afterLabel': 'النص المقترح',
  'composerWeb.assist.regionLabel': 'تغيير النص المقترح، لم يتم تطبيقه بعد',
  'composerWeb.assist.added': 'وأضاف',
  'composerWeb.assist.removed': 'تمت إزالته',
  'composerWeb.assist.evidence': 'الأدلة والمصادر',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'لم يتم العثور على مصدر لهذا الادعاء. التحقق من ذلك قبل النشر.',
  'composerWeb.assist.failed': 'لم يكتمل طلب المساعدة. النص الخاص بك لم يتغير.',
  'composerWeb.assist.noMediaGeneration':
    'Relay لا يقوم بإنشاء صور أو مقاطع فيديو. أحضر الملفات النهائية إلى المكتبة وانشرها هنا.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'هذه هي النسخة المعتمدة. يؤدي تحريره إلى إنشاء إصدار جديد ومسح الموافقة.',
  'composerWeb.autosave.pinnedAcknowledge': 'تحرير ومسح الموافقة',
  'composerWeb.autosave.conflictTitle': 'نسختان من هذه المسودة',
  'composerWeb.autosave.conflictKeepMine': 'احتفظ بما كتبته',
  'composerWeb.autosave.conflictKeepTheirs': 'استخدم الإصدار من {name}',
  'composerWeb.autosave.conflictHelp': 'لا يتم دمج أي شيء تلقائيًا. اختر لكل حقل، ثم احفظ.',
  'composerWeb.autosave.retry': 'حاول الحفظ مرة أخرى',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Composer الاختصارات',
  'composerWeb.shortcuts.nextTarget': 'الهدف التالي',
  'composerWeb.shortcuts.previousTarget': 'الهدف السابق',
  'composerWeb.shortcuts.nextIssue': 'العدد القادم',
  'composerWeb.shortcuts.previousIssue': 'العدد السابق',
  'composerWeb.shortcuts.save': 'احفظ المسودة الآن',
  'composerWeb.shortcuts.openSchedule': 'افتح ورقة الجدول الزمني',
  'composerWeb.shortcuts.open': 'إظهار الاختصارات',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'مراجعة',
  'composerWeb.review.contentVersion': 'إصدار المحتوى {checksum}',
  'composerWeb.review.approvalPolicy': 'السياسة: {policy}',
  'composerWeb.review.approverPending': 'في انتظار القرار من {approver}.',
  'composerWeb.review.approverNone': 'لا يلزم الحصول على موافقة لهذه الأهداف.',
  'composerWeb.review.perTargetHeading': 'ما يحصل عليه كل حساب',
  'composerWeb.review.finalUrl': 'الرابط المنشور',
  'composerWeb.review.privacyState': 'الجمهور: {value}',
  'composerWeb.review.disclosureState': 'الإفصاح: {value}',
  'composerWeb.review.disclosureNone': 'لم يتم تحديد مجموعة الإفصاح',
  'composerWeb.review.mediaVersion': '{name}، الإصدار {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {لا يمكن جدولة هدف واحد بعد} zero {لا يمكن جدولة # أهداف حتى الآن} two {لا يمكن جدولة # أهداف حتى الآن} few {لا يمكن جدولة # أهداف حتى الآن} many {لا يمكن جدولة # أهداف حتى الآن} other {لا يمكن جدولة # أهداف حتى الآن}}',
  'composerWeb.review.offlineBlocked':
    'الجدولة والنشر بحاجة إلى اتصال. مسودتك آمنة على هذا الجهاز.',
  'composerWeb.review.publishConfirm':
    'هذا ينشر ل {count, plural, one {# حساب} zero {#حسابات} two {#حسابات} few {#حسابات} many {#حسابات} other {#حسابات}} على الفور. ولا يمكن التراجع عن ذلك من هنا.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'مسودة جديدة',
  'composerWeb.page.loading': 'تحميل المسودة وأهدافها وحدودها',
  'composerWeb.page.errorTitle': 'لا يمكن فتح هذه المسودة',
  'composerWeb.page.errorBody':
    'لم يضيع شيء. حاول مرة أخرى، وإذا استمر الفشل، فإن المرجع أدناه يساعد فريق الدعم في العثور على الطلب.',
  'composerWeb.page.noConnectionsTitle': 'قم بتوصيل حساب قبل التأليف',
  'composerWeb.page.noConnectionsBody':
    'تحتاج المسودة إلى حساب متصل واحد على الأقل حتى يعرف Relay الحدود والمعاينة والإعدادات المراد عرضها.',
  'composerWeb.page.noConnectionsExample':
    'مثال: مع اتصال X وLinkedIn، تصبح المسودة الواحدة نسختين أصليتين مع عدادات خاصة بهما.',
  'composerWeb.page.permissionTitle': 'لا يمكنك إنشاء مشاركات في مساحة العمل هذه',
  'composerWeb.page.permissionBody':
    'يحتاج التأليف إلى دور المحرر أو أعلى. يمكن للمالك أو المسؤول تغيير دورك.',
  'composerWeb.page.rateLimitTitle': 'تم حفظ عدد كبير جدًا من المسودة في وقت قصير',
  'composerWeb.page.rateLimitCause':
    'وصلت مساحة العمل هذه إلى حد الكتابة الخاص بالنافذة الحالية. يتم الاحتفاظ بالنص الخاص بك على هذا الجهاز في هذه الأثناء.',
  'composerWeb.page.rateLimitAlternative':
    'استمر في الكتابة. يتم استئناف الحفظ تلقائيًا عند إعادة ضبط النافذة.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'الشبكة',
  'mediaLib.view.list': 'قائمة',
  'mediaLib.view.label': 'التخطيط',
  'mediaLib.sort.label': 'فرز',
  'mediaLib.sort.newest': 'الأحدث أولاً',
  'mediaLib.sort.name': 'الاسم',
  'mediaLib.sort.size': 'الأكبر أولاً',
  'mediaLib.select': 'اختر {name}',
  'mediaLib.column.file': 'ملف',
  'mediaLib.column.type': 'اكتب',
  'mediaLib.column.size': 'الحجم',
  'mediaLib.column.altText': 'نص بديل',
  'mediaLib.column.rights': 'الحقوق',
  'mediaLib.column.added': 'تمت الإضافة',
  'mediaLib.openDetail': 'مفتوح {name}',

  'mediaLib.empty.title': 'لا توجد وسائل الإعلام بعد',
  'mediaLib.empty.body':
    'قم بتحميل الصور ومقاطع الفيديو الموجودة لديك بالفعل، أو قم باستيراد ملف من عنوان URL. Relay يتحقق من النوع والحجم مقابل كل حساب تنشره.',
  'mediaLib.empty.example':
    'مثال: Launch_hero.jpg، 1600 × 900، مجموعة نص بديل، مستخدمة في منشورين.',
  'mediaLib.error.title': 'لا يمكن تحميل المكتبة',
  'mediaLib.error.body': 'ملفاتك آمنة. ولم يتغير شيء بهذا الفشل.',
  'mediaLib.loading': 'تحميل مكتبة الوسائط الخاصة بك',
  'mediaLib.permission.title': 'لا يمكنك رؤية مكتبة مساحة العمل هذه',
  'mediaLib.permission.body':
    'يتطلب عرض الوسائط دور المشاهد أو أعلى في هذه العلامة التجارية. يمكن للمالك أو المسؤول منحها.',

  'mediaLib.upload.heading': 'أضف الوسائط',
  'mediaLib.upload.browse': 'اختر الملفات',
  'mediaLib.upload.dropHint':
    'اسحب الملفات هنا، أو اخترها. يتم استئناف التحميلات في حالة انقطاع الاتصال.',
  'mediaLib.upload.queueHeading': 'التحميلات',
  'mediaLib.upload.progress': '{name}، {percent} من {size} تم إرساله',
  'mediaLib.upload.paused': 'متوقف مؤقتًا. {sent} من {size} مخزنة بالفعل.',
  'mediaLib.upload.resume': 'استئناف التحميل',
  'mediaLib.upload.pause': 'إيقاف التحميل مؤقتًا',
  'mediaLib.upload.cancel': 'إلغاء هذا التحميل',
  'mediaLib.upload.retry': 'حاول هذا التحميل مرة أخرى',
  'mediaLib.upload.finalizing': 'التشطيب {name}',
  'mediaLib.upload.done': '{name} موجود في مكتبتك',
  'mediaLib.upload.failed': '{name} لم ينته. {reason}',
  'mediaLib.upload.offline': 'غير متصل. تستمر التحميلات من حيث توقفت عند إعادة الاتصال.',
  'mediaLib.upload.rejectedType': '{name} هو {mimeType}، والذي لا يقبله أي من حساباتك المحددة.',
  'mediaLib.upload.rejectedSize': '{name} هو {size}. الحد الأدنى عبر حساباتك هو {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {تم قبولها بواسطة # من حساباتك} zero {تم قبولها بواسطة # من حساباتك} two {تم قبولها بواسطة # من حساباتك} few {تم قبولها بواسطة # من حساباتك} many {تم قبولها بواسطة # من حساباتك} other {تم قبولها بواسطة # من حساباتك}}',
  'mediaLib.upload.rejectedBy': 'غير مقبول بواسطة {accounts}',
  'mediaLib.upload.checkedAgainst': 'تم فحصها مقابل الحسابات المحددة في هذه المسودة.',
  'mediaLib.upload.noTargets':
    'لم يتم تحديد أي حسابات، لذلك يتم فحص الملف مقابل الإعدادات الافتراضية لمساحة العمل فقط.',

  'mediaLib.alt.heading': 'نص بديل',
  'mediaLib.alt.help':
    'صف ما يهم في الصورة لشخص لا يستطيع رؤيته. عادة ما تكون جملة أو جملتين كافية.',
  'mediaLib.alt.count': '{used} من {limit} حرفًا',
  'mediaLib.alt.requiredBy': 'مطلوب بواسطة {accounts}',
  'mediaLib.alt.waive': 'هذه الصورة لا تحمل أي معلومات',
  'mediaLib.alt.waiveReason': 'لماذا لا يحتاج إلى وصف',
  'mediaLib.alt.waiveHelp':
    'استخدم هذا فقط للزينة. يتم نشر الصورة التي تم التنازل عنها مع وصف فارغ حيث يسمح النظام الأساسي بذلك.',
  'mediaLib.alt.waived': 'تم التنازل عنه بواسطة {name} على {date}. السبب: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} لا يقبل النص البديل من خلال واجهة برمجة التطبيقات الخاصة به لهذا الحساب.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# الملف لا يحتوي على نص بديل} zero {# ملفًا لا يحتوي على نص بديل} two {# ملفًا لا يحتوي على نص بديل} few {# ملفًا لا يحتوي على نص بديل} many {# ملفًا لا يحتوي على نص بديل} other {# ملفًا لا يحتوي على نص بديل}}',

  'mediaLib.rights.heading': 'الحقوق والموافقة',
  'mediaLib.rights.declared': 'تم الإعلان عنه بواسطة {name} على {date}',
  'mediaLib.rights.undeclared': 'لم يعلن بعد. أعلن ذلك قبل نشر هذا الملف.',
  'mediaLib.rights.ownerLabel': 'من يملك هذا الملف',
  'mediaLib.rights.ownerSelf': 'مساحة العمل هذه',
  'mediaLib.rights.ownerLicensed': 'مرخص من شخص آخر',
  'mediaLib.rights.ownerUgc': 'أعطى العميل أو المنشئ الإذن',
  'mediaLib.rights.licenseLabel': 'مرجع الترخيص أو الإذن',
  'mediaLib.rights.peopleLabel': 'يظهر الأشخاص في هذا الملف',
  'mediaLib.rights.peopleConsent': 'لقد وافق جميع من ظهروا على النشر',
  'mediaLib.rights.musicLabel': 'يحتوي هذا الملف على موسيقى أو مقطع صوتي',
  'mediaLib.rights.confirm':
    'لدي الحق في نشر هذا الملف، بما في ذلك أي أشخاص وموسيقى وشعارات وعلامات تجارية موجودة فيه.',
  'mediaLib.rights.blocking': 'لا يمكن جدولة هذا الملف حتى يتم الإعلان عن الحقوق.',

  'mediaLib.editor.heading': 'تحرير الصورة',
  'mediaLib.editor.description':
    'يتم حفظ كل تعديل كإصدار جديد. يتم الاحتفاظ بالملف الأصلي ويمكن استعادته.',
  'mediaLib.editor.tab.crop': 'المحاصيل',
  'mediaLib.editor.tab.transform': 'تغيير الحجم والتدوير',
  'mediaLib.editor.tab.canvas': 'قماش',
  'mediaLib.editor.tab.output': 'الشكل والحجم',
  'mediaLib.editor.tab.thumbnail': 'صورة مصغرة',
  'mediaLib.editor.presetLabel': 'إعداد مسبق للجانب',
  'mediaLib.editor.presetFree': 'مجاني',
  'mediaLib.editor.presetFor': '{ratio}، يستخدم بواسطة {accounts}',
  'mediaLib.editor.cropX': 'اقتصاص من حافة البداية',
  'mediaLib.editor.cropY': 'المحاصيل من الأعلى',
  'mediaLib.editor.cropWidth': 'عرض المحاصيل',
  'mediaLib.editor.cropHeight': 'ارتفاع المحاصيل',
  'mediaLib.editor.cropKeyboardHint':
    'تم تعيين مربع الاقتصاص بحقول رقمية، لذا فهو يعمل بشكل كامل من لوحة المفاتيح.',
  'mediaLib.editor.widthLabel': 'العرض بالبكسل',
  'mediaLib.editor.heightLabel': 'الارتفاع بالبكسل',
  'mediaLib.editor.lockRatio': 'الحفاظ على النسبة الحالية',
  'mediaLib.editor.rotateLabel': 'دوران',
  'mediaLib.editor.rotateDegrees': '{degrees} درجة',
  'mediaLib.editor.flipHorizontal': 'اقلب عبر المحور الرأسي',
  'mediaLib.editor.flipVertical': 'الوجه عبر المحور الأفقي',
  'mediaLib.editor.canvasColor': 'لون الخلفية',
  'mediaLib.editor.canvasFit': 'كيف تجلس الصورة على القماش',
  'mediaLib.editor.canvasFitCover': 'املأ اللوحة القماشية واقطع الفائض',
  'mediaLib.editor.canvasFitContain': 'تناسب الصورة بأكملها وحشو الباقي',
  'mediaLib.editor.formatLabel': 'تنسيق الإخراج',
  'mediaLib.editor.qualityLabel': 'جودة الضغط',
  'mediaLib.editor.qualityValue': '{value} من 100',
  'mediaLib.editor.estimatedSize': 'الناتج المقدر {size}، من {original}',
  'mediaLib.editor.estimatedSizeUnknown': 'لا يُعرف حجم الإخراج إلا بعد معالجة الملف.',
  'mediaLib.editor.thumbnailHelp':
    'اختر الإطار أو الملف المستخدم كصورة مصغرة للفيديو حيث يقبل النظام الأساسي واحدًا.',
  'mediaLib.editor.thumbnailFrame': 'الإطار في {time}',
  'mediaLib.editor.save': 'حفظ كنسخة جديدة',
  'mediaLib.editor.saving': 'حفظ النسخة {version}',
  'mediaLib.editor.saved': 'تم حفظ الإصدار {version}. الأصلي لا يزال هنا.',
  'mediaLib.editor.discard': 'تجاهل هذه التعديلات',
  'mediaLib.editor.noChanges': 'لا توجد تغييرات لحفظها بعد.',
  'mediaLib.editor.revalidate':
    'يؤدي الحفظ إلى إعادة فحص هذا الملف مقابل كل حساب في المسودات التي تستخدمه.',
  'mediaLib.editor.noGeneration':
    'يقوم هذا المحرر بتغيير الملف الذي قمت بتحميله. ولا يخلق صورًا جديدة.',

  'mediaLib.versions.heading': 'الإصدارات',
  'mediaLib.versions.original': 'التحميل الأصلي',
  'mediaLib.versions.current': 'الإصدار الحالي',
  'mediaLib.versions.restore': 'استعادة الإصدار {version}',
  'mediaLib.versions.item': 'الإصدار {version}، {dimensions}، {size}، {date}',

  'mediaLib.provenance.heading': 'من أين جاء هذا الملف',
  'mediaLib.provenance.sourceUrl': 'عنوان URL المصدر',
  'mediaLib.provenance.fetchedAt': 'تم الجلب {date}',
  'mediaLib.provenance.declaredAuthor': 'ذكر المؤلف',
  'mediaLib.provenance.declaredLicense': 'الترخيص المذكور',
  'mediaLib.provenance.contentCredentials': 'بيانات اعتماد المحتوى المضمن',
  'mediaLib.provenance.contentCredentialsNone':
    'لا يحمل هذا الملف أي بيانات اعتماد محتوى مضمنة. وهذا أمر شائع ولا يعني أن هناك أي خطأ.',
  'mediaLib.provenance.unverified':
    'هذه التفاصيل من المصدر وليس من Relay. تأكد منها قبل أن تعتمد عليها.',

  'mediaLib.picker.title': 'اختر الوسائط',
  'mediaLib.picker.description': 'يتم فحص الملفات مقابل الحسابات المحددة في هذه المسودة.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {اختر الملفات} one {إضافة #ملف} zero {أضف # ملفًا} two {أضف # ملفًا} few {أضف # ملفًا} many {أضف # ملفًا} other {أضف # ملفًا}}',
  'mediaLib.picker.forMaster': 'إضافة إلى المسودة الرئيسية',
  'mediaLib.picker.forVariant': 'الإضافة إلى الإصدار {account} فقط',
} as const;
