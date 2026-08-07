/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'التنقل الأساسي',
  'a11y.region.breadcrumb': 'مسار التنقل',
  'a11y.region.main': 'المحتوى الرئيسي',
  'a11y.region.composer': 'Composer',
  'a11y.region.preview': 'معاينة',
  'a11y.region.validation': 'قضايا التحقق من الصحة',
  'a11y.region.targets': 'الحسابات المستهدفة',
  'a11y.region.notifications': 'الإخطارات',

  'a11y.announce.saved': 'تم حفظ المسودة',
  'a11y.announce.saving': 'حفظ المسودة',
  'a11y.announce.saveFailed': 'لا يمكن حفظ المسودة. النص الخاص بك لا يزال هنا.',
  'a11y.announce.offline': 'أنت غير متصل. يتم الاحتفاظ بالتغييرات على هذا الجهاز.',
  'a11y.announce.online': 'العودة على الانترنت',
  'a11y.announce.validationCount':
    '{count, plural, =0 {لا توجد قضايا التحقق من الصحة} one {# مشكلة التحقق} zero {# مشاكل التحقق من الصحة} two {# مشاكل التحقق من الصحة} few {# مشاكل التحقق من الصحة} many {# مشاكل التحقق من الصحة} other {# مشاكل التحقق من الصحة}}',
  'a11y.announce.validationCleared': 'تم حل جميع مشكلات التحقق من الصحة',
  'a11y.announce.targetSelected':
    '{account} تم التحديد. {count, plural, one {#الهدف} zero {#أهداف} two {#أهداف} few {#أهداف} many {#أهداف} other {#أهداف}} في المجموع.',
  'a11y.announce.targetOverridden': '{account} الآن لديه نسخته الخاصة',
  'a11y.announce.targetReset': '{account} إعادة التعيين إلى المسودة الرئيسية',
  'a11y.announce.uploadProgress': '{name}، {percent} تم الرفع',
  'a11y.announce.uploadComplete': 'تم تحميل {name}',
  'a11y.announce.uploadFailed': 'فشل تحميل {name}',
  'a11y.announce.scheduled': 'تمت جدولته لـ {time} في {timeZone}',
  'a11y.announce.rescheduled': 'تم النقل إلى {time} في {timeZone}',
  'a11y.announce.publishing': 'النشر',
  'a11y.announce.published':
    '{count, plural, one {تم النشر في حساب واحد} zero {تم النشر في # حسابًا} two {تم النشر في # حسابًا} few {تم النشر في # حسابًا} many {تم النشر في # حسابًا} other {تم النشر في # حسابًا}}',
  'a11y.announce.publishPartial':
    'تم النشر في {published} من حسابات {total}. {failed, plural, one {#حساب يحتاج إلى الاهتمام} zero {# حسابات بحاجة إلى الاهتمام} two {# حسابات بحاجة إلى الاهتمام} few {# حسابات بحاجة إلى الاهتمام} many {# حسابات بحاجة إلى الاهتمام} other {# حسابات بحاجة إلى الاهتمام}}.',
  'a11y.announce.publishFailed': 'فشل النشر. يتم الحفاظ على المحتوى الخاص بك.',
  'a11y.announce.approvalRequested': 'الموافقة مطلوبة من {approver}',
  'a11y.announce.approved': 'تمت الموافقة عليه',
  'a11y.announce.connectionAdded': '{account} متصل',
  'a11y.announce.connectionRemoved': '{account} غير متصل',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {تم مسح عوامل التصفية} one {تم تطبيق #فلتر} zero {تم تطبيق # مرشحات} two {تم تطبيق # مرشحات} few {تم تطبيق # مرشحات} many {تم تطبيق # مرشحات} other {تم تطبيق # مرشحات}}, {results, plural, one {# نتيجة} zero {# النتائج} two {# النتائج} few {# النتائج} many {# النتائج} other {# النتائج}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'تم النسخ إلى الحافظة',
  'a11y.announce.suggestionApplied': 'تم تطبيق الاقتراح',
  'a11y.announce.suggestionRejected': 'تم رفض الاقتراح',

  'a11y.label.closeDialog': 'إغلاق مربع الحوار',
  'a11y.label.openMenu': 'فتح القائمة',
  'a11y.label.sortBy': 'الترتيب حسب {field}',
  'a11y.label.sortAscending': 'مرتبة تصاعديا',
  'a11y.label.sortDescending': 'مرتبة تنازليا',
  'a11y.label.removeTarget': 'قم بإزالة {account} من الأهداف',
  'a11y.label.removeMedia': 'إزالة {name}',
  'a11y.label.editAltText': 'تحرير النص البديل لـ {name}',
  'a11y.label.mediaPreview': 'معاينة {name}',
  'a11y.label.playVideo': 'لعب {name}',
  'a11y.label.pauseVideo': 'وقفة {name}',
  'a11y.label.calendarCell':
    '{date}، {count, plural, =0 {لا شيء مقرر} one {# مشاركة} zero {# مشاركات} two {# مشاركات} few {# مشاركات} many {# مشاركات} other {# مشاركات}}',
  'a11y.label.postSummary': '{account} على {provider}، {state}، {time}',
  'a11y.label.characterCount': '{used} من {limit} الحروف المستخدمة',
  'a11y.label.requiredField': 'مطلوب',
  'a11y.label.externalLink': 'يفتح في علامة تبويب جديدة',
  'a11y.label.loadingRegion': 'جارٍ تحميل المحتوى',
  'a11y.label.expandRow': 'أظهر التفاصيل لـ {name}',
  'a11y.label.collapseRow': 'إخفاء التفاصيل ل {name}',
  'a11y.languagePicker.label': 'اختر لغة الواجهة',
  'a11y.languagePicker.filterLabel': 'تصفية اللغات',
  'a11y.languagePicker.announceChanged': 'تغيرت لغة الواجهة إلى {language}',

  'a11y.keyboard.hint.calendar':
    'استخدم مفاتيح الأسهم للتنقل بين الفتحات. اضغط على Enter لفتح مشاركة. اضغط على مسافة ثم مفاتيح الأسهم لإعادة الجدولة.',
  'a11y.keyboard.hint.composer':
    'اضغط على Control ومفاتيح الأقواس للتنقل بين الأهداف. اضغط على Control وI للانتقال إلى الإصدار التالي.',
  'a11y.keyboard.hint.dialog': 'اضغط على Escape للإغلاق.',
  'a11y.keyboard.shortcutsTitle': 'اختصارات لوحة المفاتيح',

  'a11y.table.alternative': 'عرض الجدول',
  'a11y.table.alternativeHint': 'نفس الجدول الزمني كجدول قابل للفرز.',
  'a11y.motion.reduced': 'يتم تقليل الرسوم المتحركة بسبب إعدادات النظام لديك.',
} as const;
