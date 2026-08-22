/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'التقويم',
  'calendar.view.day': 'يوم',
  'calendar.view.week': 'الأسبوع',
  'calendar.view.month': 'شهر',
  'calendar.view.list': 'قائمة',
  'calendar.view.label': 'عرض التقويم',
  'calendar.today': 'اليوم',
  'calendar.goToDate': 'اذهب إلى التاريخ',
  'calendar.previousPeriod': 'الفترة السابقة',
  'calendar.nextPeriod': 'الفترة القادمة',
  'calendar.timeZoneNote': 'تظهر الأوقات في {timeZone}.',
  'calendar.weekOf': 'أسبوع {date}',
  'calendar.dayHeading': '{weekday}، {date}',
  'calendar.slotCount':
    '{count, plural, =0 {لا شيء مقرر} one {# مشاركة} zero {# مشاركات} two {# مشاركات} few {# مشاركات} many {# مشاركات} other {# مشاركات}}',
  'calendar.slotOverflow':
    '{count, plural, one {# أكثر} zero {# أكثر} two {# أكثر} few {# أكثر} many {# أكثر} other {# أكثر}}',
  'calendar.newPostAt': 'مشاركة جديدة في {time}',

  'calendar.filter.project': 'المشروع',
  'calendar.filter.account': 'الحساب',
  'calendar.filter.platform': 'منصة',
  'calendar.filter.status': 'الحالة',
  'calendar.filter.locale': 'لغة المحتوى',
  'calendar.filter.campaign': 'حملة',
  'calendar.filter.applied':
    '{count, plural, one {تم تطبيق #فلتر} zero {تم تطبيق # مرشحات} two {تم تطبيق # مرشحات} few {تم تطبيق # مرشحات} many {تم تطبيق # مرشحات} other {تم تطبيق # مرشحات}}',

  'calendar.drag.instructions': 'اسحب منشورًا إلى فتحة جديدة، أو حدده واستخدم مفاتيح الأسهم لنقله.',
  'calendar.drag.confirmTitle': 'هل تريد نقل هذه المشاركة؟',
  'calendar.drag.confirmBody': 'من {from} إلى {to} في {timeZone}.',
  'calendar.drag.dstNotice':
    'تتغير الساعات بين هذه الأوقات في {timeZone}. الوقت الجديد هو {utc} UTC.',
  'calendar.drag.publishedNotice':
    'تم نشر هذه التدوينة بالفعل. يؤدي نقله إلى تغيير السجل المحلي فقط. نشره مرة أخرى هو إجراء منفصل.',
  'calendar.drag.conflictNotice':
    '{account} موجود بالفعل {count, plural, one {# مشاركة} zero {# مشاركات} two {# مشاركات} few {# مشاركات} many {# مشاركات} other {# مشاركات}} خلال ساعة من التوقيت الجديد.',

  'calendar.queue.title': 'قائمة الانتظار',
  'calendar.queue.upcoming': 'القادمة',
  'calendar.queue.needsApproval': 'في انتظار الموافقة',
  'calendar.queue.drafts': 'المسودات',
  'calendar.queue.published': 'تم النشر',
  'calendar.queue.failed': 'فشل',
  'calendar.queue.nextSlot': 'الفتحة المجانية التالية هي {time}.',

  'calendar.post.publishesAt': 'ينشر {time} في {timeZone}',
  'calendar.post.publishedAt': 'تم النشر {time}',
  'calendar.post.targetCount':
    '{count, plural, one {# حساب} zero {#حسابات} two {#حسابات} few {#حسابات} many {#حسابات} other {#حسابات}}',
  'calendar.post.mediaType.text': 'نص',
  'calendar.post.mediaType.image': 'صورة',
  'calendar.post.mediaType.carousel': 'دائري',
  'calendar.post.mediaType.video': 'فيديو',
  'calendar.post.mediaType.document': 'وثيقة',

  'actionCenter.title': 'مركز العمل',
  'actionCenter.description': 'كل ما يحتاج إلى قرار أو إصلاح، في طابور واحد.',
  'actionCenter.empty': 'لا شيء يحتاج إلى الاهتمام في الوقت الحالي.',
  'actionCenter.item.connectionExpiring':
    'يجب إعادة الاتصال بـ {account} قبل {date} وإلا ستفشل المشاركات المجدولة.',
  'actionCenter.item.connectionActionRequired':
    '{account} يحتاج إلى الاهتمام بـ {provider} قبل أن يتمكن من النشر مرة أخرى.',
  'actionCenter.item.validationFailed': 'مسودة {account} لا تمر بمصادقة {provider}.',
  'actionCenter.item.approvalOverdue': 'طلب الموافقة ينتظر منذ {date}.',
  'actionCenter.item.scheduleConflict':
    '{account} لديه منشورات مجدولة بالقرب من بعضها البعض على {date}.',
  'actionCenter.item.providerIncident':
    '{provider} يتم الإبلاغ عن مشكلة. ستتم إعادة محاولة المشاركات المجدولة.',
  'actionCenter.item.commentFailed': 'تم نشر المنشور الرئيسي، ولكن فشل عنصر المتابعة لـ {account}.',
  'actionCenter.item.analyticsStale': 'لم يتم تحديث تحليلات {account} منذ {date}.',
  'actionCenter.item.rssStalled': 'لم تقم الخلاصة {name} بإرجاع عنصر صالح منذ {date}.',
  'actionCenter.item.webhookFailing':
    'فشلت عمليات التسليم إلى {endpoint} {count, plural, one {# الوقت} zero {# مرات} two {# مرات} few {# مرات} many {# مرات} other {# مرات}} على التوالي.',
  'actionCenter.item.usageBalance':
    'يحتاج الإجراء المقنن لـ {provider} إلى رصيد استخدام قبل أن يتم تشغيله.',

  'approval.title': 'الموافقات',
  'approval.requestTitle': 'طلب الموافقة',
  'approval.requestedBy': 'تم الطلب بواسطة {name} {relativeTime}',
  'approval.requestedFrom': 'في انتظار {name}',
  'approval.policy.none': 'لا توجد موافقة مطلوبة لهذه الأهداف.',
  'approval.policy.anyApprover': 'يمكن لأي موافق الموافقة على هذا.',
  'approval.policy.namedApprover': '{name} يجب أن يوافق على ذلك.',
  'approval.policy.everyApprover': 'ويجب على كل موافق أن يوافق على ذلك.',
  'approval.decision.approvedBy': 'تمت الموافقة عليه بواسطة {name} على {date}',
  'approval.decision.rejectedBy': 'تم الرفض بواسطة {name} على {date}',
  'approval.decision.changesRequestedBy': 'التغييرات التي طلبها {name} على {date}',
  'approval.comment.label': 'ملاحظة للمؤلف',
  'approval.comment.placeholder': 'قل ما الذي يجب تغييره ولماذا.',
  'approval.reapproval.needed':
    'تم تغيير هذه المشاركة بعد الموافقة عليها. ويحتاج إلى موافقة مرة أخرى قبل أن يتمكن من النشر.',
  'approval.reapproval.reason.content': 'تغير المحتوى.',
  'approval.reapproval.reason.account': 'تغيرت الحسابات المستهدفة.',
  'approval.reapproval.reason.media': 'تغيرت وسائل الإعلام.',
  'approval.reapproval.reason.schedule': 'لقد تغير وقت النشر.',
  'approval.reapproval.reason.privacy': 'تم تغيير إعدادات الخصوصية أو الكشف.',
  'approval.reapproval.reason.locale': 'تغيرت لغة المحتوى.',
  'approval.expiresAt': 'تنتهي صلاحية هذا الطلب في {date}.',
} as const;
