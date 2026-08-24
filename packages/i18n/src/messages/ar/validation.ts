/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message': '{provider} يحتاج إلى بعض النصوص لهذا النوع من المنشور.',
  'validation.text_too_long.message':
    '{over, plural, one {# حرف يتجاوز الحد المسموح به لـ {account}} zero {# حرفًا يتجاوز الحد الأقصى لـ {account}} two {# حرفًا يتجاوز الحد الأقصى لـ {account}} few {# حرفًا يتجاوز الحد الأقصى لـ {account}} many {# حرفًا يتجاوز الحد الأقصى لـ {account}} other {# حرفًا يتجاوز الحد الأقصى لـ {account}}}',
  'validation.text_too_long.hint': '{provider} يسمح بـ {limit} حرفًا لهذا الحساب.',
  'validation.text_too_short.message': '{provider} يحتاج على الأقل إلى {min} حرفًا هنا.',
  'validation.title_required.message': '{provider} يحتاج إلى عنوان.',
  'validation.title_too_long.message': 'يتجاوز العنوان عدد الأحرف المسموح به وهو {limit}.',
  'validation.description_too_long.message': 'يتجاوز الوصف عدد الأحرف المسموح به وهو {limit}.',
  'validation.media_required.message':
    '{provider} يحتاج إلى صورة أو مقطع فيديو واحد على الأقل لهذا النوع من المنشورات.',
  'validation.media_count_exceeded.message':
    '{provider} يقبل على الأكثر {limit, plural, one {# ملف} zero {# ملفات} two {# ملفات} few {# ملفات} many {# ملفات} other {# ملفات}} هنا. هذا المنشور يحتوي على {count}.',
  'validation.media_type_unsupported.message': '{provider} لا يقبل ملفات {mimeType}.',
  'validation.media_aspect_ratio_unsupported.message':
    'هذا الملف هو {actual}. {provider} يحتاج إلى نسبة بين {min} و{max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'قم بقصها باستخدام النظام الأساسي المُعد مسبقًا لإصلاح ذلك.',
  'validation.media_resolution_too_low.message':
    'هذا الملف هو {actual}. {provider} يحتاج إلى {required} على الأقل.',
  'validation.media_duration_too_long.message':
    'هذا الفيديو هو {actual}. {provider} يقبل ما يصل إلى {limit} لهذا الحساب.',
  'validation.media_duration_too_short.message':
    'هذا الفيديو هو {actual}. {provider} يحتاج إلى {limit} على الأقل.',
  'validation.media_file_too_large.message':
    'هذا الملف هو {actual}. {provider} يقبل ما يصل إلى {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} لا يمكنه نشر الصور والفيديو في نفس المنشور.',
  'validation.alt_text_missing.message':
    'النص البديل مفقود {count, plural, one {# صورة} zero {# صور} two {# صور} few {# صور} many {# صور} other {# صور}}.',
  'validation.alt_text_missing.hint': 'قم بوصف الصورة، أو وضع علامة عليها على أنها زخرفية.',
  'validation.thumbnail_unsupported.message': '{provider} لا يقبل صورة مصغرة مخصصة هنا.',
  'validation.destination_required.message': 'اختر مكان نشر هذا على {provider}.',
  'validation.destination_unsupported.message':
    '{destination} لا يقبل هذا النوع من المنشورات على {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {لم تتم مطابقة # الإشارة إلى حساب حقيقي} zero {لم تتم مطابقة # الإشارات مع الحسابات الحقيقية} two {لم تتم مطابقة # الإشارات مع الحسابات الحقيقية} few {لم تتم مطابقة # الإشارات مع الحسابات الحقيقية} many {لم تتم مطابقة # الإشارات مع الحسابات الحقيقية} other {لم تتم مطابقة # الإشارات مع الحسابات الحقيقية}}.',
  'validation.mention_unresolved.hint':
    'حدد الحساب من نتائج البحث، أو قم بإزالة الإشارة. لا يتم نشر النص العادي أبدًا كعلامة أصلية.',
  'validation.hashtag_count_exceeded.message':
    '{count} الهاشتاجات. {provider} يعد أكثر من {limit} كرسائل غير مرغوب فيها.',
  'validation.link_not_allowed.message': '{provider} لا يسمح بالروابط في هذا المجال.',
  'validation.link_destination_unverified.message':
    'لم يتم التحقق من مجال الارتباط {domain} لمساحة العمل هذه.',
  'validation.privacy_setting_required.message':
    'يتطلب {provider} خيارًا صريحًا للخصوصية قبل النشر.',
  'validation.privacy_setting_required.hint': 'لا يوجد افتراضي. اختر من يمكنه رؤية هذه المشاركة.',
  'validation.disclosure_required.message':
    'يحتاج هذا المنشور إلى إفصاح بموجب قواعد المشروع لـ {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} لا يدعم التعليق الأول المجدول لهذا الحساب.',
  'validation.thread_unsupported.message': '{provider} لا يدعم المواضيع لهذا الحساب.',
  'validation.repeat_end_required.message':
    'يحتاج المنشور المتكرر إلى تاريخ انتهاء أو عدد من التكرارات.',
  'validation.schedule_in_past.message': 'لقد مر ذلك الوقت في {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'يمكن جدولة المنشورات حتى {limit} مقدمًا، وهي أيضًا مدة الاحتفاظ بالوسائط المرفوعة.',
  'validation.schedule_outside_quiet_hours.message':
    'يقع هذا ضمن ساعات الهدوء المحددة لـ {project}.',
  'validation.duplicate_within_window.message':
    'تمت جدولة محتوى مشابه جدًا أو نشره بالفعل لـ {account} داخل {window}.',
  'validation.blocked_term_present.message': 'يحتوي النص على مصطلح محظور لـ {project}.',
  'validation.unsupported_claim.message': 'هذه المطالبة ليست ضمن المطالبات المعتمدة لـ {project}.',
  'validation.unsupported_claim.hint':
    'إضافتها إلى الدعاوى المعتمدة مع الأدلة، أو إعادة صياغة الجملة.',
  'validation.cadence_exceeded.message':
    '{account} سيتم نشره {count, plural, one {# الوقت} zero {# مرات} two {# مرات} few {# مرات} many {# مرات} other {# مرات}} في ذلك اليوم، تجاوز الحد {limit}.',
  'validation.connection_paused.message': '{account} متوقف مؤقتًا ولن يتم نشره.',
  'validation.account_type_invalid.message':
    '{account} ليس نوع الحساب {provider} الذي يتطلبه هذا النوع من المنشورات.',

  'validation.severity.error': 'يجب إصلاح',
  'validation.severity.warning': 'تحقق من هذا',
  'validation.severity.info': 'لمعلوماتك',
  'validation.field.required': 'هذا الحقل مطلوب.',
  'validation.field.tooShort':
    'استخدم على الأقل {min, plural, one {# حرف} zero {# أحرف} two {# أحرف} few {# أحرف} many {# أحرف} other {# أحرف}}.',
  'validation.field.tooLong':
    'استخدم على الأكثر {max, plural, one {# حرف} zero {# أحرف} two {# أحرف} few {# أحرف} many {# أحرف} other {# أحرف}}.',
  'validation.field.invalidEmail': 'أدخل عنوان بريد إلكتروني صالحًا.',
  'validation.field.invalidUrl': 'أدخل عنوان URL كاملاً، بما في ذلك https.',
  'validation.field.invalidDate': 'أدخل تاريخًا صالحًا.',
  'validation.field.invalidTime': 'أدخل وقتًا صالحًا.',
  'validation.field.invalidNumber': 'أدخل رقما.',
  'validation.field.outOfRange': 'أدخل قيمة بين {min} و{max}.',
  'validation.field.mustMatch': 'يجب أن تتطابق هاتين القيمتين.',
  'validation.field.alreadyTaken': 'وهذا قيد الاستخدام بالفعل.',
  'validation.field.unsafeValue': 'هذه القيمة غير مسموح بها هنا.',
} as const;
