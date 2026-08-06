/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'مسودة',
  'state.draft.description': 'يمكن فقط للأشخاص الموجودين في مساحة العمل هذه رؤيته. لا شيء مقرر.',
  'state.validation_needed.label': 'التحقق من الصحة مطلوب',
  'state.validation_needed.description':
    'هناك هدف واحد أو أكثر به مشكلة يجب إصلاحها قبل جدولة ذلك.',
  'state.approval_requested.label': 'تم طلب الموافقة',
  'state.approval_requested.description': 'في انتظار {approver} لاتخاذ القرار.',
  'state.approved.label': 'تمت الموافقة عليه',
  'state.approved.description': 'تمت الموافقة عليه بواسطة {approver}. ويمكن الآن جدولته أو نشره.',
  'state.scheduled.label': 'المقرر',
  'state.scheduled.description': 'ينشر {time} في {timeZone}.',
  'state.preparing_media.label': 'تحضير الوسائط',
  'state.preparing_media.description': 'تحميل وتحويل الملفات للمنصة.',
  'state.dispatching.label': 'إيفاد',
  'state.dispatching.description': 'يتم الإرسال إلى {provider} الآن.',
  'state.provider_processing.label': 'معالجة المزود',
  'state.provider_processing.description':
    '{provider} قبل التحميل ولا يزال قيد المعالجة. نؤكد عندما يكون مباشرا.',
  'state.published.label': 'تم النشر',
  'state.published.description': 'مباشر على {provider} منذ {time}.',
  'state.partially_published.label': 'نشرت جزئيا',
  'state.partially_published.description':
    '{published, plural, one {تم نشر #هدف} zero {تم نشر # هدفًا} two {تم نشر # هدفًا} few {تم نشر # هدفًا} many {تم نشر # هدفًا} other {تم نشر # هدفًا}}, {failed, plural, one {#فشل} zero {#فشل} two {#فشل} few {#فشل} many {#فشل} other {#فشل}}. المنشورات المنشورة مباشرة ولم يتم التراجع عنها.',
  'state.action_required.label': 'الإجراء مطلوب',
  'state.action_required.description': 'لا يمكن أن يستمر هذا حتى تفعل شيئًا ما.',
  'state.retry_scheduled.label': 'إعادة المحاولة مجدولة',
  'state.retry_scheduled.description':
    'سيتم تشغيل محاولة {attempt} من {max} عند {time}. لا شيء مكرر.',
  'state.failed_permanently.label': 'فشل',
  'state.failed_permanently.description':
    'لن تتم إعادة المحاولة. المحتوى الخاص بك محفوظ والسبب موجود في الإيصال.',
  'state.canceled.label': 'تم الإلغاء',
  'state.canceled.description': 'تم الإلغاء بواسطة {actor} على {date}. لم يتم نشر أي شيء.',
  'state.deleted_externally.label': 'تم حذفه على المنصة',
  'state.deleted_externally.description':
    'لم يعد هذا المنشور موجودًا على {provider}. يتم الاحتفاظ بالإيصال والمقاييس التي تم جمعها قبل إرسالها.',

  'state.approval.not_required.label': 'لا حاجة للموافقة',
  'state.approval.not_required.description': 'ولا تتطلب سياسة هذه الأهداف الموافقة.',
  'state.approval.requested.label': 'مطلوب',
  'state.approval.requested.description': 'تم الإرسال إلى {approver} {relativeTime}.',
  'state.approval.in_review.label': 'قيد المراجعة',
  'state.approval.in_review.description': '{approver} ينظر إلى هذا الآن.',
  'state.approval.approved.label': 'تمت الموافقة عليه',
  'state.approval.approved.description': 'تمت الموافقة عليه بواسطة {approver} على {date}.',
  'state.approval.changes_requested.label': 'التغييرات المطلوبة',
  'state.approval.changes_requested.description': '{approver} طلب إجراء تغييرات على {date}.',
  'state.approval.rejected.label': 'مرفوض',
  'state.approval.rejected.description': 'تم الرفض بواسطة {approver} على {date}.',
  'state.approval.expired.label': 'انتهت صلاحيتها',
  'state.approval.expired.description': 'انتهت صلاحية هذا الطلب في {date} دون اتخاذ قرار.',
  'state.approval.withdrawn.label': 'انسحبت',
  'state.approval.withdrawn.description': 'سحب المؤلف هذا الطلب في {date}.',

  'state.summary.targets':
    '{ready, plural, one {#الهدف جاهز} zero {#أهداف جاهزة} two {#أهداف جاهزة} few {#أهداف جاهزة} many {#أهداف جاهزة} other {#أهداف جاهزة}}, {blocked, plural, =0 {لا شيء محظور} one {#محظور} zero {#محظور} two {#محظور} few {#محظور} many {#محظور} other {#محظور}}',
  'state.changedAt': 'تم التغيير {relativeTime}',
} as const;
