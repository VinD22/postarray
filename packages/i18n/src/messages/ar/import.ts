export const importMessages = {
  'import.title': 'استيراد المنشورات من CSV',
  'import.subtitle':
    'ارفع جدول بيانات، اقرأ ما سيفعله، ثم قرّر. الرفع يتحقق من الملف فقط. لا يُنشئ شيئًا.',

  'import.step.upload': 'رفع',
  'import.step.columns': 'الأعمدة',
  'import.step.review': 'مراجعة',
  'import.step.apply': 'تطبيق',
  'import.step.results': 'النتائج',
  'import.step.position': 'الخطوة {current} من {total}',

  'import.upload.heading': 'اختر ملف CSV',
  'import.upload.help':
    'CSV فقط. لا تُقرأ ملفات جداول البيانات مثل .xlsx. صدّر ورقتك كملف CSV أولًا.',
  'import.upload.field': 'ملف CSV',
  'import.upload.fieldHelp': 'اختر ملفًا، أو الصق الصفوف في المربع أدناه.',
  'import.upload.paste': 'أو الصق نص CSV',
  'import.upload.pasteHelp': 'أدرج صف العناوين. يتم التحقق من كل شيء قبل إنشاء أي شيء.',
  'import.upload.project': 'المشروع',
  'import.upload.projectHelp': 'كل صف في ملف واحد ينتمي إلى هذا المشروع.',
  'import.upload.submit': 'تحقق من هذا الملف',
  'import.upload.submitting': 'جارٍ قراءة الملف',
  'import.upload.allowPast': 'السماح بالأوقات التي مرّت بالفعل',
  'import.upload.allowPastHelp':
    'معطّل افتراضيًا. يُبلَّغ عن الصف المؤرَّخ في الماضي كي تصححه بنفسك، بدلًا من نقله تلقائيًا.',
  'import.upload.tooLarge': 'هذا الملف أكبر من {limit} حرفًا. قسّمه وحاول مجددًا.',
  'import.upload.duplicate':
    'هذا هو نفس الملف الذي رفعته سابقًا، لذا أنت تشاهد ذلك الاستيراد وليس نسخة ثانية منه.',

  'import.template.heading': 'معنى الأعمدة',
  'import.template.download': 'تنزيل نموذج CSV',
  'import.template.required': 'الأعمدة المطلوبة',
  'import.template.optional': 'الأعمدة الاختيارية',
  'import.column.external_row_id': 'معرّفك الخاص لهذا الصف. يجب أن يكون فريدًا داخل الملف.',
  'import.column.project': 'اسم المشروع أو معرّفه الذي ينتمي إليه هذا الصف.',
  'import.column.targets':
    'أحد الأمرين: يبدأ بمعرّف مجموعة أهداف، أو معرّفات حسابات مفصولة بشرطة عمودية.',
  'import.column.caption': 'نص المنشور.',
  'import.column.scheduled_local_time': 'التاريخ والوقت المحلي، مكتوبًا كـ 2026-09-01T10:00.',
  'import.column.time_zone':
    'المنطقة الزمنية من IANA التي يُقرأ فيها الوقت المحلي، مثل Europe/Berlin.',
  'import.column.media':
    'معرّف وسائط، أو sha256: متبوعًا بمجموع تحقق لوسائط تملكها بالفعل، أو عنوان https يجلبه الخادم.',
  'import.column.title': 'عنوان، حيث تستخدمه الوجهة.',
  'import.column.destination': 'الصفحة أو اللوحة أو القناة داخل الحساب.',
  'import.column.privacy': 'قيمة الخصوصية التي تتوقعها الوجهة.',
  'import.column.first_comment': 'النص المنشور كأول تعليق بعد المنشور.',
  'import.column.approval_policy': 'سياسة الموافقة المرفقة بكل مسودة.',
  'import.column.perPlatform':
    'عمود caption_ أو title_ مسمّى باسم منصة يتجاوز تلك المنصة فقط، مثل caption_instagram.',

  'import.columns.heading': 'فحص الأعمدة',
  'import.columns.ok': 'كل عمود مطلوب موجود.',
  'import.columns.missing':
    '{count, plural, one {عمود مطلوب واحد مفقود} zero {# عمود مطلوب مفقود} two {عمودان مطلوبان مفقودان} few {# أعمدة مطلوبة مفقودة} many {# عمودًا مطلوبًا مفقودًا} other {# عمود مطلوب مفقود}}',
  'import.columns.unknown':
    '{count, plural, one {لم يُتعرّف على عمود واحد وتم تجاهله} zero {لم يُتعرّف على # عمود وتم تجاهله} two {لم يُتعرّف على عمودين وتم تجاهلهما} few {لم يُتعرّف على # أعمدة وتم تجاهلها} many {لم يُتعرّف على # عمودًا وتم تجاهلها} other {لم يُتعرّف على # عمود وتم تجاهلها}}',
  'import.columns.present': 'الأعمدة الموجودة',

  'import.review.heading': 'ماذا سيفعل هذا الملف',
  'import.review.counts':
    '{valid, plural, =0 {لا توجد صفوف جاهزة} one {صف واحد جاهز} zero {# صف جاهز} two {صفان جاهزان} few {# صفوف جاهزة} many {# صفًا جاهزًا} other {# صف جاهز}}، {invalid, plural, =0 {لا شيء يحتاج إلى انتباه} one {واحد يحتاج إلى انتباه} zero {# يحتاج إلى انتباه} two {اثنان يحتاجان إلى انتباه} few {# تحتاج إلى انتباه} many {# يحتاج إلى انتباه} other {# يحتاج إلى انتباه}}.',
  'import.review.empty': 'لم تُقرأ أي صفوف من هذا الملف.',
  'import.review.rowsHeading': 'الصفوف',
  'import.review.filterAll': 'كل الصفوف',
  'import.review.filterValid': 'جاهز',
  'import.review.filterInvalid': 'يحتاج انتباهًا',
  'import.review.filterFailed': 'فشل',
  'import.review.downloadErrors': 'تنزيل المشكلات كملف CSV',
  'import.review.parsedWith': 'قُرئ بواسطة المحلل {version}',

  'import.table.row': 'معرّف الصف',
  'import.table.line': 'السطر',
  'import.table.state': 'الحالة',
  'import.table.caption': 'الوصف',
  'import.table.time': 'مجدول',
  'import.table.problems': 'المشكلات',
  'import.table.draft': 'مسودة',
  'import.table.noProblems': 'لا شيء',

  'import.state.pending': 'لم يُفحص',
  'import.state.valid': 'جاهز',
  'import.state.invalid': 'يحتاج انتباهًا',
  'import.state.applied': 'تم إنشاء المسودة',
  'import.state.skipped': 'تم بالفعل',
  'import.state.failed': 'فشل',

  'import.job.state.uploaded': 'تم الرفع',
  'import.job.state.validating': 'جارٍ الفحص',
  'import.job.state.validated': 'تم الفحص',
  'import.job.state.applying': 'جارٍ التطبيق',
  'import.job.state.applied': 'تم التطبيق',
  'import.job.state.failed': 'تعذّرت القراءة',

  'import.apply.heading': 'ماذا يجب أن يحدث للصفوف الجاهزة؟',
  'import.apply.drafts': 'إنشاء مسودات',
  'import.apply.draftsHelp':
    'الخيار الافتراضي. يصبح كل صف جاهز مسودة يمكنك فتحها وتحريرها والموافقة عليها. لا شيء مجدول.',
  'import.apply.scheduled': 'إنشاء المسودات وجدولتها',
  'import.apply.scheduledHelp':
    'يصبح كل صف جاهز مسودة ويأخذ الوقت المكتوب في الملف. اختر هذا فقط إذا كانت الأوقات صحيحة.',
  'import.apply.confirm':
    'تطبيق {count, plural, one {صف واحد} zero {# صف} two {صفين} few {# صفوف} many {# صفًا} other {# صف}}',
  'import.apply.confirmScheduled':
    'إنشاء وجدولة {count, plural, one {صف واحد} zero {# صف} two {صفين} few {# صفوف} many {# صفًا} other {# صف}}',
  'import.apply.running': 'جارٍ تطبيق الصفوف',
  'import.apply.safeToRepeat': 'التطبيق مرتين آمن. الصف الذي أنشأ مسودة بالفعل يُترك دون تغيير.',

  'import.results.heading': 'النتائج',
  'import.results.applied':
    '{count, plural, one {تم إنشاء مسودة واحدة} zero {تم إنشاء # مسودة} two {تم إنشاء مسودتين} few {تم إنشاء # مسودات} many {تم إنشاء # مسودة} other {تم إنشاء # مسودة}}',
  'import.results.skipped':
    '{count, plural, one {صف واحد كان قد تم بالفعل} zero {# صف كان قد تم بالفعل} two {صفان كانا قد تمّا بالفعل} few {# صفوف كانت قد تمت بالفعل} many {# صفًا كان قد تم بالفعل} other {# صف كان قد تم بالفعل}}',
  'import.results.failed':
    '{count, plural, one {فشل صف واحد} zero {فشل # صف} two {فشل صفان} few {فشلت # صفوف} many {فشل # صفًا} other {فشل # صف}}',
  'import.results.retry': 'إعادة تطبيق الصفوف المتبقية',
  'import.results.openDrafts': 'فتح المسودات',
  'import.results.unavailable': 'غير متاح',

  'import.history.heading': 'الاستيرادات السابقة',
  'import.history.empty': 'لا توجد استيرادات بعد.',
  'import.history.open': 'فتح',

  'import.a11y.rowsTable': 'صفوف الظاهرة ومشكلاتها',
  'import.a11y.stepList': 'خطوات الاستيراد',
  'import.a11y.uploadedFile': 'الملف المحدد: {filename}',

  'import.error.emptyFile': 'ذلك الملف لا يحتوي على صفوف.',
  'import.error.missingColumn': 'العمود {column} مفقود.',
  'import.error.unknownColumn': 'لم يُتعرّف على العمود {column}، لذا تم تجاهله.',
  'import.error.duplicateRowId': 'معرّف الصف {value} مستخدم أكثر من مرة في هذا الملف.',
  'import.error.required': 'لا يمكن أن تكون هذه الخلية فارغة.',
  'import.error.invalidCell': 'هذه الخلية ليست بالشكل الذي يمكننا قراءته.',
  'import.error.rowShape': 'هذا السطر يحتوي على {actual} خلية بينما العناوين تحتوي على {expected}.',
  'import.error.invalidLocalTime': 'الوقت {value} ليس تاريخًا ووقتًا محليين مثل 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'المنطقة {value} ليست اسم منطقة زمنية من IANA.',
  'import.error.nonexistentLocalTime': 'الوقت {value} غير موجود في {zone}. الساعات تتخطاه.',
  'import.error.ambiguousLocalTime':
    'الوقت {value} يحدث مرتين في {zone} في ذلك اليوم. اختر وقتًا مختلفًا.',
  'import.error.scheduleInPast': 'الوقت {value} في {zone} قد مرّ بالفعل.',
  'import.error.invalidTargets':
    'القيمة {value} ليست مجموعة أهداف محفوظة ولا قائمة معرّفات حسابات.',
  'import.error.invalidMedia':
    'القيمة {value} ليست معرّف وسائط ولا مجموع تحقق sha256 ولا عنوان https.',
  'import.error.mediaNotFound': 'لا توجد وسائط في مساحة العمل هذه تطابق {value}.',
  'import.error.mediaImportStarted':
    'يتم جلب الوسائط في {value}. طبّق هذا الملف مجددًا بعد وصولها إلى المكتبة.',
  'import.error.unknownVariantTarget':
    'هذا الصف لا يملك حساب {provider}، لذا لم يُستخدم وصف {provider}.',
  'import.error.applyFailed': 'تعذّر تطبيق هذا الصف. المرجع: {code}.',
  'import.error.alreadyApplied': 'أنشأ هذا الصف مسودة بالفعل، لذا تُرك دون تغيير.',
  'import.error.tooManyRows': 'تُقرأ فقط أول {limit} صف من الملف.',
} as const;
