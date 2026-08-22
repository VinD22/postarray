/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'الفيسبوك',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Threads',
  'web.provider.bluesky': 'Bluesky',
  'web.provider.mastodon': 'Mastodon',
  'web.provider.telegram': 'Telegram',
  'web.provider.reddit': 'Reddit',
  'web.provider.wordpress': 'WordPress',
  'web.provider.medium': 'Medium',
  'web.provider.devto': 'Dev.to',
  'web.provider.pinterest': 'Pinterest',
  'web.provider.discord': 'Discord',
  'web.provider.slack': 'Slack',
  'web.connection.requirement.mastodon':
    'يتصل ماستودون برمز وصول تنشئه على خادمك الخاص، وليس بكلمة مرورك.',
  'web.connection.requirement.telegram':
    'ينشر Relay كبوت. أضف البوت إلى القناة أو المجموعة التي تريد النشر فيها.',
  'web.connection.requirement.reddit':
    'الكتابة في ريديت تتطلب تطبيقاً معتمداً، وكل منشور يحتاج عنواناً ومجتمعاً.',
  'web.connection.requirement.wordpress':
    'ينشر Relay عبر واجهة REST للموقع بكلمة مرور تطبيق تنشئها في ووردبريس.',
  'web.connection.requirement.medium':
    'يتصل ميديوم عبر OAuth وينشر Relay قصصاً عامة بصيغة ماركداون.',
  'web.connection.requirement.devto': 'يتصل ديف تو بمفتاح واجهة تنشئه في إعدادات ديف تو.',
  'web.connection.requirement.pinterest':
    'الكتابة في بينترست تتطلب وصول تطبيق معتمداً، والدبوس يحتاج صورة ولوحة خاصة بك.',
  'web.connection.requirement.discord':
    'ينشر Relay كبوت. أضف البوت إلى الخوادم والقنوات التي تريد النشر فيها.',
  'web.connection.requirement.slack':
    'ينشر Relay كتطبيق. أضف التطبيق إلى القنوات التي تريد النشر فيها.',
  'web.provider.fake': 'موصل الاختبار',

  'web.accountType.personal_profile': 'الملف الشخصي',
  'web.accountType.creator_profile': 'حساب الخالق',
  'web.accountType.business_profile': 'حساب الأعمال',
  'web.accountType.page': 'الصفحة',
  'web.accountType.organization': 'التنظيم',
  'web.accountType.channel': 'قناة',
  'web.accountType.group': 'المجموعة',
  'web.accountType.board': 'مجلس',
  'web.accountType.community': 'المجتمع',
  'web.accountType.publication': 'النشر',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description': 'كل شيء مجدول، في انتظار الموافقة، منشور أو محظور، في مكان واحد.',
  'web.calendar.view.agenda': 'جدول الأعمال',
  'web.calendar.view.table': 'الجدول',
  'web.calendar.view.switchLabel': 'اختر كيفية وضع الجدول الزمني',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} إلى {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'عرض {range} في {timeZone}',
  'web.calendar.timeZone.workspace': 'Workspace المنطقة الزمنية: {timeZone}',
  'web.calendar.timeZone.change': 'التغيير في إعدادات مساحة العمل',
  'web.calendar.jumpToDate': 'اذهب إلى موعد',
  'web.calendar.nowLabel': 'الآن',
  'web.calendar.allDayHeading': 'لا يوجد وقت محدد بعد',

  'web.calendar.filter.group': 'مجموعة العملاء',
  'web.calendar.filter.anyProject': 'أي مشروع',
  'web.calendar.filter.anyAccount': 'أي حساب',
  'web.calendar.filter.anyPlatform': 'أي منصة',
  'web.calendar.filter.anyStatus': 'أي حالة',
  'web.calendar.filter.anyLocale': 'أي لغة المحتوى',
  'web.calendar.filter.anyCampaign': 'أي حملة',
  'web.calendar.filter.anyGroup': 'كل مجموعة',
  'web.calendar.filter.regionLabel': 'تصفية الجدول الزمني',
  'web.calendar.bucket.scheduled': 'المقرر',
  'web.calendar.bucket.draft': 'المسودات والموافقات',
  'web.calendar.bucket.published': 'تم النشر',
  'web.calendar.bucket.failed': 'يحتاج إلى اهتمام',
  'web.calendar.filter.summary':
    '{count, plural, =0 {لا مرشحات} one {#مرشح} zero {#مرشحات} two {#مرشحات} few {#مرشحات} many {#مرشحات} other {#مرشحات}}, {results, plural, =0 {لا توجد مشاركات} one {# مشاركة} zero {# مشاركات} two {# مشاركات} few {# مشاركات} many {# مشاركات} other {# مشاركات}}',

  'web.calendar.grid.label': 'شبكة الجدول الزمني لـ {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'لا شيء في {time} على {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {عرض مشاركة واحدة أخرى} zero {عرض # مشاركات أخرى} two {عرض # مشاركات أخرى} few {عرض # مشاركات أخرى} many {عرض # مشاركات أخرى} other {عرض # مشاركات أخرى}}',
  'web.calendar.month.label': 'شبكة الشهر لـ {month}',
  'web.calendar.agenda.label': 'جدول أعمال {range}',
  'web.calendar.agenda.dayHeading': '{weekday}، {date}',
  'web.calendar.agenda.emptyDay': 'لا شيء مقرر',

  'web.calendar.table.caption': 'كل مشاركة في {range}، مرتبة حسب وقت النشر.',
  'web.calendar.table.column.time': 'الوقت',
  'web.calendar.table.column.account': 'الحساب',
  'web.calendar.table.column.content': 'المحتوى',
  'web.calendar.table.column.language': 'اللغة',
  'web.calendar.table.column.media': 'وسائل الإعلام',
  'web.calendar.table.column.status': 'الحالة',
  'web.calendar.table.column.approver': 'الموافق',
  'web.calendar.table.column.campaign': 'حملة',
  'web.calendar.table.column.actions': 'الإجراءات',
  'web.calendar.table.rowMenu': 'إجراءات لـ {title}',
  'web.calendar.table.noApprover': 'لا حاجة للموافقة',
  'web.calendar.table.noCampaign': 'لا توجد حملة',

  'web.calendar.entry.untitled': 'مسودة بلا عنوان',
  'web.calendar.entry.language': 'اللغة {locale}',
  'web.calendar.entry.openDetail': 'مفتوح {title}',
  'web.calendar.entry.selected': '{title} تم التحديد. {hint}',
  'web.calendar.detail.title': 'مشاركة مجدولة',
  'web.calendar.detail.close': 'أغلق هذه المشاركة',

  'web.calendar.keyboard.title': 'نقل منشور باستخدام لوحة المفاتيح',
  'web.calendar.keyboard.body':
    'ركز على منشور واضغط على Enter لفتحه. اضغط على M لالتقاط منشور، ثم استخدم مفاتيح الأسهم لتحريكه بمقدار فتحة واحدة ثم اضغط على Enter للتأكيد. اضغط على Escape لإعادته.',
  'web.calendar.keyboard.pickUp': 'نقل هذه المشاركة',
  'web.calendar.keyboard.grabbed':
    '{title} تم الاستلام من {from}. مفاتيح الأسهم تحركها. أدخل يؤكد. الهروب يلغي.',
  'web.calendar.keyboard.moved': 'الوقت المقترح {to}. أدخل يؤكد.',
  'web.calendar.keyboard.released': '{title} أعيده إلى {from}.',
  'web.calendar.keyboard.stepMinutes': 'كل خطوة تستغرق {minutes} دقيقة.',

  'web.calendar.reschedule.title': 'هل تريد نقل هذه المشاركة؟',
  'web.calendar.reschedule.subject': '{account} على {provider}',
  'web.calendar.reschedule.from': 'من {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'إلى {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'نقل آخر',
  'web.calendar.reschedule.dstTitle': 'وتتغير الساعات بين هذين الوقتين',
  'web.calendar.reschedule.dstBody':
    'الإزاحة في {timeZone} هي {fromOffset} في الوقت القديم و{toOffset} في الوقت الجديد. يتم الاحتفاظ بالساعة المحلية التي اخترتها، وبالتالي تتغير لحظة التوقيت العالمي المنسق (UTC).',
  'web.calendar.reschedule.conflictTitle': 'المشاركات الأخرى قريبة من هذا الوقت',
  'web.calendar.reschedule.conflictBody':
    '{account} موجود بالفعل {count, plural, one {# مشاركة} zero {# مشاركات} two {# مشاركات} few {# مشاركات} many {# مشاركات} other {# مشاركات}} خلال {window} من الوقت الجديد.',
  'web.calendar.reschedule.campaignTitle': 'صراع الحملة',
  'web.calendar.reschedule.campaignBody':
    'تبدأ الحملة {campaign} من {start} إلى {end}. الوقت الجديد خارج تلك النافذة.',
  'web.calendar.reschedule.leadTimeTitle': 'هذا قريبا جدا',
  'web.calendar.reschedule.leadTimeBody':
    'الوقت الجديد هو {duration} من الآن. {provider} يحتاج {required} لإعداد الوسائط لهذا النوع من المنشورات.',
  'web.calendar.reschedule.pastTitle': 'لقد مر ذلك الوقت',
  'web.calendar.reschedule.pastBody': 'اختر وقتًا في المستقبل، أو انشر الآن بدلاً من ذلك.',

  'web.calendar.published.title': 'تم نشر هذه التدوينة بالفعل',
  'web.calendar.published.body':
    'يوجد منشور على {provider} على {permalinkLabel}. لا يؤدي نقل الإدخال في Relay إلى نقل المنشور على المنصة. اختر ما تريد أن يحدث.',
  'web.calendar.published.optionLocal': 'تحديث السجل المحلي فقط',
  'web.calendar.published.optionLocalHint':
    'يحافظ الإيصال على وقت النشر الحقيقي. يتم نقل إدخال التخطيط فقط، بحيث يتطابق التقويم الخاص بك مع خطتك.',
  'web.calendar.published.optionNew': 'جدولة منشور جديد في الوقت الجديد',
  'web.calendar.published.optionNewHint':
    'يؤدي هذا إلى إنشاء مشاركة خارجية ثانية منفصلة. الشخص الموجود بالفعل على {provider} يظل متصلاً بالإنترنت.',
  'web.calendar.published.optionLabel': 'ماذا يجب أن يحدث',

  'web.calendar.attention.title':
    '{count, plural, one {#منشور يحتاج إلى قرار أو إصلاح} zero {# منشورات تحتاج إلى قرار أو إصلاح} two {# منشورات تحتاج إلى قرار أو إصلاح} few {# منشورات تحتاج إلى قرار أو إصلاح} many {# منشورات تحتاج إلى قرار أو إصلاح} other {# منشورات تحتاج إلى قرار أو إصلاح}}',
  'web.calendar.attention.body': 'ويبقون هنا وفي مركز العمل حتى يتم حلها.',
  'web.calendar.attention.open': 'افتح مركز العمل',
  'web.calendar.attention.showOnly': 'إظهار هذه فقط',

  'web.calendar.loading': 'جارٍ تحميل الجدول الزمني',
  'web.calendar.error.title': 'لا يمكن تحميل الجدول الزمني',
  'web.calendar.error.body': 'لم يتغير شيء المقرر. لا تزال مشاركاتك تنشر في الأوقات المخطط لها.',
  'web.calendar.error.retry': 'حاول مرة أخرى',
  'web.calendar.empty.example':
    '09:30 أوروبا/برلين، X @acme، "التعليقات الأولى المجدولة مباشرة"، مجدولة، صورة واحدة',
  'web.calendar.emptyFiltered.body':
    'لا توجد مشاركة في {range} تتطابق مع هذه المرشحات. قم بتوسيع النطاق أو مسح عامل التصفية.',
  'web.calendar.offline.title': 'أنت غير متصل',
  'web.calendar.offline.body':
    'الجدول أدناه هو آخر نسخة تم تحميلها على هذا الجهاز. لا تتوفر إمكانية إعادة الجدولة والنشر حتى يعود الاتصال.',
  'web.calendar.rateLimited.cause':
    'تقوم مساحة العمل هذه بقراءة التقويم مرات أكثر مما تسمح به النافذة الحالية.',
  'web.calendar.rateLimited.resetLabel': 'يمكنك المحاولة مرة أخرى في',
  'web.calendar.rateLimited.resetUnknown': '{provider} لم يذكر متى تتم إعادة التعيين.',
  'web.calendar.permission.requirementsLabel': 'النطاق المطلوب',
  'web.calendar.permission.title': 'لا يمكنك رؤية هذا التقويم',
  'web.calendar.permission.body':
    'يتم منح الوصول إلى التقويم لكل مشروع. حسابك ليس ضمن المشاريع في هذا العرض.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'التقويم',
  'web.receipt.breadcrumb.post': 'مشاركة',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'تحميل إيصال النشر',
  'web.receipt.notFound.title': 'لا يوجد إيصال مع هذا المرجع',
  'web.receipt.notFound.body':
    'يوجد إيصال بمجرد إرسال رسالة. تحقق من المرجع، أو افتح المنشور من التقويم.',
  'web.receipt.error.title': 'لا يمكن تحميل الإيصال',
  'web.receipt.error.body': 'الإيصال غير قابل للتغيير ولا يتأثر بهذا. لم يتم إعادة نشر أي شيء.',

  'web.receipt.section.summary': 'ماذا حدث',
  'web.receipt.section.timeline': 'الجدول الزمني للحدث',
  'web.receipt.section.items': 'مشاركة الجذر ومتابعة العناصر',
  'web.receipt.section.attempts': 'محاولات',
  'web.receipt.section.provenance': 'المصدر',
  'web.receipt.section.cost': 'استخدام المزود',
  'web.receipt.section.analytics': 'مزامنة التحليلات',
  'web.receipt.section.targets': 'الأهداف في هذه الحملة',

  'web.receipt.item.root': 'مشاركة الجذر',
  'web.receipt.item.comment': 'تعليق {position}',
  'web.receipt.item.thread': 'جزء الموضوع {position}',
  'web.receipt.item.delay': 'يتم تشغيل {delay} بعد منشور الجذر',
  'web.receipt.item.noDelay': 'يعمل مع آخر الجذر',
  'web.receipt.item.pending': 'لم تبدأ بعد',
  'web.receipt.item.rootUnaffected':
    'المنشور الجذر مباشر. عنصر المتابعة الذي يفشل لا يغير ذلك أبدًا.',

  'web.receipt.attempt.heading': 'محاولة {number}',
  'web.receipt.attempt.startedAt': 'بدأت {time}',
  'web.receipt.attempt.startedLabel': 'بدأت',
  'web.receipt.attempt.responseSummary': 'استجابة مقدم الخدمة المعقمة',
  'web.receipt.attempt.duration': 'استغرق {duration}',
  'web.receipt.attempt.httpStatus': 'حالة HTTP',
  'web.receipt.attempt.providerRequestId': 'مرجع طلب المزود',
  'web.receipt.attempt.retryable': 'تمت إعادة المحاولة تلقائيًا',
  'web.receipt.attempt.notRetryable': 'لم تتم إعادة المحاولة تلقائيًا',
  'web.receipt.attempt.nextRetry': 'المحاولة التالية في {time}',
  'web.receipt.attempt.nextRetryLabel': 'المحاولة التالية',
  'web.receipt.attempt.showResponse': 'إظهار استجابة المزود المعقمة',
  'web.receipt.attempt.hideResponse': 'إخفاء استجابة المزود المعقمة',
  'web.receipt.attempt.none': 'محاولة واحدة، لا يوجد فشل.',

  'web.receipt.provenance.capabilityVersion': 'لقطة القدرة',
  'web.receipt.provenance.capabilityHint':
    'اللقطة المستخدمة عند الموافقة وإعادة فحصها قبل الإرسال.',
  'web.receipt.provenance.accountType': 'نوع الحساب',
  'web.receipt.provenance.externalAccount': 'مرجع الحساب الخارجي',
  'web.receipt.provenance.workflow': 'مرجع سير العمل',
  'web.receipt.provenance.createdAt': 'الإيصال مكتوب {time}',

  'web.receipt.approval.notRequired': 'لم تكن هناك حاجة إلى موافقة لهذا الهدف.',
  'web.receipt.approval.policy': 'سياسة {policy}',
  'web.receipt.approval.unknownPolicy': 'لم يتم تسجيل مرجع السياسة',

  'web.receipt.cost.currency': 'مشحونة بـ {currency}',
  'web.receipt.cost.estimatedLabel': 'يقدر قبل النشر',
  'web.receipt.cost.actualLabel': 'الفعلية المتصالحة',
  'web.receipt.provenance.writtenLabel': 'الإيصال مكتوب',
  'web.receipt.cost.reconciledAt': 'تصالح {time}',
  'web.receipt.cost.notMetered': '{provider} لا يتم فرض رسوم على كل عملية لهذا النوع من المنشورات.',

  'web.receipt.analytics.never': 'لم تتم مزامنة التحليلات لهذه المشاركة بعد.',
  'web.receipt.analytics.explain':
    'يتم تجميع مقدمي الخدمة وفقًا لجداولهم الخاصة. الوقت أدناه هو آخر مرة قرأ فيها Relay هذه الأرقام، وليس عندما كانت الأرقام صحيحة.',

  'web.receipt.export.download': 'قم بتنزيل الإيصال',
  'web.receipt.export.copyReference': 'انسخ مرجع الإيصال',
  'web.receipt.export.denied':
    'تحتاج مشاركة الإيصال إلى دور المالك أو المسؤول أو المعتمد. أنت {role}.',

  'web.receipt.partial.retryFailedOnly': 'أعد محاولة الأهداف التي فشلت فقط',
  'web.receipt.partial.retryHint':
    'لا تمس إعادة المحاولة مطلقًا الهدف الذي أنتج بالفعل منشورًا خارجيًا.',

  'web.receipt.remediation.user_action_required':
    'يحتاج هذا إلى تغيير في Relay أو في {provider} قبل أن يتمكن من التشغيل مرة أخرى.',
  'web.receipt.remediation.content_invalid':
    'قم بتحرير المحتوى حتى يجتاز التحقق من صحة {provider}، ثم قم بجدولته مرة أخرى.',
  'web.receipt.remediation.transient_provider':
    '{provider} أرجع خطأً مؤقتًا. Relay تمت إعادة المحاولة وفقًا لجدوله الخاص.',
  'web.receipt.remediation.permanent_provider':
    '{provider} رفض هذا نهائيًا. لن تؤدي إعادة محاولة نفس المحتوى إلى تغيير الإجابة.',
  'web.receipt.remediation.internal': 'وكان هذا خطأ من جانبنا. يتم تسجيله مع المرجع أدناه.',
  'web.receipt.remediation.unknown': '{provider} أعاد شيئًا ليس لدينا قاعدة له. الرد المعقم أدناه.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'الحسابات',
  'web.connection.tab.capabilities': 'مصفوفة القدرة',
  'web.connection.tab.groups': 'مجموعات العملاء',
  'web.connection.loading': 'تحميل الحسابات المتصلة',
  'web.connection.error.title': 'لا يمكن تحميل الحسابات المتصلة',
  'web.connection.error.body': 'النشر لا يتأثر. لا تزال المشاركات المجدولة تعمل ضد الوصول المخزن.',
  'web.connection.list.label': 'الحسابات المتصلة',
  'web.connection.empty.example':
    'X، @acme، ملف شخصي، متصل في 12 يونيو بواسطة آنا رويز، النشر والمقاييس، تم نشره آخر مرة في 6 أغسطس',
  'web.connection.filter.provider': 'منصة',
  'web.connection.filter.health': 'الصحة',
  'web.connection.filter.group': 'مجموعة العملاء',
  'web.connection.filter.anyHealth': 'أي الصحة',
  'web.connection.healthFilter.healthy': 'العمل',
  'web.connection.healthFilter.expiring_soon': 'تنتهي قريبا',
  'web.connection.healthFilter.expired': 'انتهت صلاحية الوصول',
  'web.connection.healthFilter.revoked': 'تم إبطال الوصول',
  'web.connection.healthFilter.permission_missing': 'إذن مفقود',
  'web.connection.healthFilter.review_pending': 'في انتظار مراجعة المنصة',
  'web.connection.healthFilter.paused': 'متوقف مؤقتًا',
  'web.connection.healthFilter.unknown': 'الصحة غير متوفرة',

  'web.connection.row.summaryLabel': 'ما يمكن أن يفعله هذا الحساب',
  'web.connection.row.expand': 'عرض الملخص الكامل لـ {account}',
  'web.connection.row.collapse': 'إخفاء الملخص الكامل لـ {account}',
  'web.connection.row.metered': 'يتم قياسها لكل عملية. يقدر {amount} لكل مشاركة يتم إنشاؤها.',
  'web.connection.row.limitationHeading': 'القيود المفروضة على هذا الحساب',
  'web.connection.row.noLimitations':
    'لا توجد قيود على الإنتاج أو الإصدار التجريبي على هذا الحساب.',
  'web.connection.row.beta': 'موصل بيتا',
  'web.connection.row.betaBody':
    'يعمل هذا الرابط بحدود لم ننته بعد من التحقق منها. راجع المنشور المنشور قبل أن تعتمد عليه.',

  'web.connection.detail.expiryLabel': 'تنتهي صلاحية الوصول',
  'web.connection.health.expiresIn': 'تنتهي صلاحية الوصول {relativeTime}، في {date}',
  'web.connection.health.noExpiry':
    'لا تنتهي صلاحية هذا الوصول وفقًا للجدول الزمني {provider} الذي يخبرنا به.',
  'web.connection.health.checkedAt': 'تم فحص الصحة {relativeTime}',

  'web.connection.action.inspect': 'فحص الأذونات',
  'web.connection.action.viewCapabilities': 'انظر ما الذي يدعمه',
  'web.connection.action.moveGroup': 'الانتقال إلى مجموعة أخرى',
  'web.connection.action.menu': 'المزيد من الإجراءات لـ {account}',

  'web.connection.pause.title': 'وقفة {account}؟',
  'web.connection.resume.title': 'استئناف {account}؟',
  'web.connection.resume.body':
    'تبدأ المنشورات المجدولة لهذا الحساب في النشر مرة أخرى في أوقاتها المخططة. المشاركات التي انقضى وقتها بالفعل لا يتم إطلاقها بأثر رجعي.',
  'web.connection.disconnect.confirmWord': 'قطع الاتصال',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# مشاركة مجدولة} zero {# منشورات مجدولة} two {# منشورات مجدولة} few {# منشورات مجدولة} many {# منشورات مجدولة} other {# منشورات مجدولة}} لهذا الحساب لن ينشر.',
  'web.connection.disconnect.consequence.published':
    'المنشورات المنشورة بالفعل تبقى على {provider}. Relay لا يحذفها.',
  'web.connection.disconnect.consequence.analytics':
    'تبقى المقاييس التي تم جمعها بالفعل في مساحة العمل هذه وتتوقف عن التحديث.',

  'web.connection.connect.title': 'ربط حساب',
  'web.connection.connect.chooseProvider': 'أي منصة',
  'web.connection.connect.permissionHeading': 'ما الذي سيطلبه Relay من {provider}',
  'web.connection.connect.requirementHeading': 'قبل المتابعة',
  'web.connection.connect.continue': 'المتابعة إلى {provider}',
  'web.connection.connect.handoffNote':
    'الشاشة التالية هي {provider}، وليس Relay. Relay لا يرى كلمة المرور الخاصة بك أبدًا.',
  'web.connection.connect.noWriteWithoutApproval':
    'ربط الحساب لا ينشر أي شيء. لا تزال كل مشاركة تتبع سياسة الموافقة على مساحة العمل هذه.',

  'web.connection.requirement.instagram':
    'يحتاج نشر Instagram إلى حساب احترافي، مما يعني حساب عمل أو منشئ مرتبط بصفحة فيسبوك.',
  'web.connection.requirement.facebook':
    'Relay ينشر على Facebook Pages. لا يمكن أن يكون الملف الشخصي هدفًا للنشر.',
  'web.connection.requirement.linkedin':
    'للنشر لمؤسسة، تحتاج إلى دور مسؤول المحتوى في صفحة LinkedIn تلك.',
  'web.connection.requirement.youtube':
    'وإلى أن تكمل Google تدقيق التطبيق، يتم نشر التحميلات من هذا المشروع على أنها خاصة. يمكنك تغيير الرؤية على YouTube بعد ذلك.',
  'web.connection.requirement.tiktok':
    'TikTok يتطلب منك اختيار الجمهور لكل منشور بنفسك. Relay لا يمكنه تحديد واحد لك مسبقًا.',
  'web.connection.requirement.x':
    'رسوم X لكل عملية. يكلف المنشور الذي يحتوي على عنوان URL أكثر من منشور النص العادي، ويتم عرض التقدير قبل الجدولة.',
  'web.connection.requirement.threads':
    'يستخدم نشر Threads الحساب المرتبط بحسابك الاحترافي Instagram.',
  'web.connection.requirement.bluesky':
    'يتصل Bluesky بكلمة مرور التطبيق التي تم إنشاؤها في إعدادات Bluesky، وليس بكلمة مرور حسابك.',
  'web.connection.requirement.generic':
    'تحتاج إلى إذن للنشر على هذا الحساب من المنصة نفسها. Relay لا يمكنه منحها.',

  'web.connection.purpose.publish': 'نشر المنشورات التي قمت بجدولتها في Relay.',
  'web.connection.purpose.readPosts':
    'إعادة قراءة منشور Relay المنشور، حتى يتمكن الإيصال من إثبات أنه مباشر.',
  'web.connection.purpose.identity':
    'إظهار اسم الحساب الدقيق في Relay، حتى لا تنشر أبدًا إلى الحساب الخطأ.',
  'web.connection.purpose.analytics':
    'قراءة المقاييس التي يبلغ عنها هذا النظام الأساسي لمشاركاتك الخاصة.',
  'web.connection.purpose.refresh':
    'الحفاظ على الوصول حيًا حتى لا يفشل المنشور المجدول بين عشية وضحاها.',
  'web.connection.purpose.chooseDestination':
    'قم بإدراج الصفحات والقنوات التي يمكنك اختيارها كهدف للنشر.',

  'web.connection.permissions.title': 'الأذونات على {account}',
  'web.connection.permissions.scopeColumn': 'إذن',
  'web.connection.permissions.stateColumn': 'الدولة',
  'web.connection.permissions.purposeColumn': 'فيما يستخدمه Relay',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {#الإذن مفقود} zero {# إذن مفقود} two {# إذن مفقود} few {# إذن مفقود} many {# إذن مفقود} other {# إذن مفقود}}. أعد الاتصال واقبله لاستعادة الميزات أدناه.',
  'web.connection.permissions.snapshot': 'اقرأ من {provider} {relativeTime}',

  'web.connection.capability.title': 'مصفوفة القدرة',
  'web.connection.capability.subtitle':
    'تم إنشاؤها من تعريفات الموصل التي تم إصدارها في هذا الإصدار، ثم تمت مراجعتها يدويًا. إنها نفس البيانات التي يستخدمها الملحن وصفحة الإمكانات العامة.',
  'web.connection.capability.tableLabel': 'القدرات حسب المنصة',
  'web.connection.capability.featureColumn': 'القدرة',
  'web.connection.capability.legendTitle': 'كيف تقرأ هذا',
  'web.connection.capability.legend.supported':
    'Relay يمكنه القيام بذلك اليوم للحصول على حساب متصل من النوع الصحيح.',
  'web.connection.capability.legend.not_implemented':
    'تقدم المنصة هذا ولم تقم Relay ببنائه بعد. إنه موجود على خريطة طريق الموصل.',
  'web.connection.capability.legend.unsupported':
    'لا تقدم المنصة هذا من خلال واجهة برمجة التطبيقات (API) الرسمية الخاصة بها، لذلك لا توجد أداة يمكنها القيام بذلك بأمان.',
  'web.connection.capability.legend.requires_review':
    'تم إنشاؤه، ولا تمنحه المنصة إلا بعد مراجعة التطبيق أو الحساب.',
  'web.connection.capability.versionLabel': 'تعريفات الموصل',
  'web.connection.capability.version': 'إصدار تعريفات الموصل {version}',
  'web.connection.capability.observedAt': 'قراءة اللقطة {relativeTime}',
  'web.connection.capability.forAccount': 'معروض لـ {account}',
  'web.connection.capability.noSnapshot':
    'لا توجد لقطة لقدرات هذا الحساب حتى الآن. أعد الاتصال لقراءة واحدة.',
  'web.connection.capability.cellLabel': '{feature} على {provider}: {state}',

  'web.connection.group.title': 'مجموعات العملاء',
  'web.connection.group.listLabel': 'مجموعات العملاء',
  'web.connection.group.accountCount':
    '{count, plural, =0 {لا حسابات} one {# حساب} zero {#حسابات} two {#حسابات} few {#حسابات} many {#حسابات} other {#حسابات}}',
  'web.connection.group.create': 'إنشاء مجموعة',
  'web.connection.group.nameLabel': 'اسم المجموعة',
  'web.connection.group.namePlaceholder': 'ذروة الاتحاد الأوروبي',
  'web.connection.group.moveTitle': 'تحرك {account}',
  'web.connection.group.moveLabel': 'انتقل الى',
  'web.connection.group.moveConfirm': 'نقل الحساب',
  'web.connection.group.movedAnnouncement': '{account} انتقل إلى {group}',
  'web.connection.group.filterCalendarHint':
    'تقوم المجموعة بتصفية التقويم والتحليلات. يؤدي نقل الحساب إلى الاحتفاظ بكل منشور وإيصال ومقياس موجود بالفعل.',
  'web.connection.group.empty.title': 'لا توجد مجموعات العملاء حتى الآن',
  'web.connection.group.empty.body':
    'المجموعة هي عميل أو مشروع. قم بتجميع الحسابات لتصفية التقويم والتحليلات حسب العميل.',

  'web.connection.incident.title': 'هذا الحساب يحتاج إلى الاهتمام',
  'web.connection.incident.remediationHeading': 'ما يجب القيام به',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {تم تعليق مشاركة واحدة مجدولة} zero {هناك # منشورات مجدولة معلّقة} two {هناك # منشورات مجدولة معلّقة} few {هناك # منشورات مجدولة معلّقة} many {هناك # منشورات مجدولة معلّقة} other {هناك # منشورات مجدولة معلّقة}} لهذا الحساب.',
  'web.connection.incident.nothingLost': 'لا شيء يضيع ولا شيء يتكرر.',
} as const;
