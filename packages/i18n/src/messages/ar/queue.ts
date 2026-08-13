export const queueMessages = {
  'queue.title': 'قائمة انتظار النشر',
  'queue.subtitle':
    'متى يكون هذا المشروع مستعدًا للنشر، وعلى أي مسافة. لا شيء يُنشر دون أن يقبل شخص ما الوقت.',

  'queue.rules.heading': 'قواعد قائمة الانتظار',
  'queue.rules.empty':
    'لا توجد قواعد قائمة انتظار بعد. حتى تضيف واحدة، الفتحة التالية هي ببساطة أول ساعة خالية.',
  'queue.rules.create': 'قاعدة قائمة انتظار جديدة',
  'queue.rules.count':
    '{count, plural, =0 {لا توجد قواعد} one {قاعدة واحدة} zero {# قاعدة} two {قاعدتان} few {# قواعد} many {# قاعدة} other {# قاعدة}}',
  'queue.rules.enabled': 'قيد الاستخدام',
  'queue.rules.disabled': 'موقوفة',
  'queue.rules.archived': 'مؤرشفة',
  'queue.rules.edit': 'تحرير القاعدة',
  'queue.rules.archive': 'أرشفة القاعدة',
  'queue.rules.archiveHelp':
    'الأرشفة توقف الاقتراحات المستقبلية. الفتحات المحجوزة بالفعل تحتفظ بوقتها وسببها.',

  'queue.field.name': 'اسم القاعدة',
  'queue.field.nameHelp': 'اسم ستتعرّف عليه لاحقًا، مثل صباحات أيام الأسبوع.',
  'queue.field.timeZone': 'المنطقة الزمنية',
  'queue.field.timeZoneHelp':
    'تُقرأ النوافذ والعدد اليومي وتواريخ الحظر كلها في هذه المنطقة.',
  'queue.field.minimumGap': 'الحد الأدنى للفاصل',
  'queue.field.minimumGapHelp': 'دقائق بين منشورين. الصفر يعني عدم وجود قاعدة تباعد.',
  'queue.field.maximumPerDay': 'الحد الأقصى يوميًا',
  'queue.field.maximumPerDayHelp':
    'اتركه فارغًا لعدم وجود حد يومي. الصفر يعني أن هذه القاعدة لا تقترح شيئًا.',
  'queue.field.maximumPerDayUnlimited': 'بلا حد يومي',
  'queue.field.priority': 'الأولوية',
  'queue.field.priorityHelp': 'القاعدة ذات الأولوية الأعلى التي يمكنها عرض فتحة هي المستخدمة.',
  'queue.field.enabled': 'استخدام هذه القاعدة',

  'queue.windows.heading': 'النوافذ الأسبوعية',
  'queue.windows.help':
    'اختر الساعات المحلية التي يمكن لهذا المشروع النشر فيها. استخدم حقلي اليوم والوقت، أو الأزرار على الشبكة.',
  'queue.windows.empty': 'لا توجد نوافذ بعد. القاعدة بلا نافذة لا يمكنها أبدًا عرض فتحة.',
  'queue.windows.add': 'إضافة نافذة',
  'queue.windows.remove': 'إزالة نافذة',
  'queue.windows.entry': '{weekday}، من {start} إلى {end}',
  'queue.windows.start': 'من',
  'queue.windows.end': 'إلى',
  'queue.windows.weekday': 'اليوم',
  'queue.windows.toggleCell': '{weekday} الساعة {hour}',
  'queue.windows.gridLabel': 'التوفر الأسبوعي، زر واحد لكل يوم وساعة',

  'queue.weekday.1': 'الإثنين',
  'queue.weekday.2': 'الثلاثاء',
  'queue.weekday.3': 'الأربعاء',
  'queue.weekday.4': 'الخميس',
  'queue.weekday.5': 'الجمعة',
  'queue.weekday.6': 'السبت',
  'queue.weekday.7': 'الأحد',

  'queue.blackouts.heading': 'تواريخ الحظر',
  'queue.blackouts.help': 'التواريخ التي لن ينشر فيها هذا المشروع، تُقرأ في المنطقة الزمنية للقاعدة.',
  'queue.blackouts.empty': 'لا توجد تواريخ حظر.',
  'queue.blackouts.add': 'إضافة حظر',
  'queue.blackouts.remove': 'إزالة حظر',
  'queue.blackouts.from': 'اليوم الأول',
  'queue.blackouts.to': 'اليوم الأخير',
  'queue.blackouts.entry': 'من {from} إلى {to}',

  'queue.connections.heading': 'الحسابات',
  'queue.connections.all': 'كل حساب في هذا المشروع',
  'queue.connections.scoped':
    '{count, plural, one {حساب واحد} zero {# حساب} two {حسابان} few {# حسابات} many {# حسابًا} other {# حساب}} تنطبق عليها هذه القاعدة',

  'queue.slot.heading': 'فتحة قائمة الانتظار التالية',
  'queue.slot.action': 'استخدام فتحة قائمة الانتظار التالية',
  'queue.slot.proposed': '{local} في {timeZone}',
  'queue.slot.utc': 'هذا يعادل {utc} بتوقيت UTC.',
  'queue.slot.why': 'لماذا هذا الوقت',
  'queue.slot.accept': 'استخدام هذا الوقت',
  'queue.slot.release': 'اختيار وقت آخر',
  'queue.slot.expires': 'هذا الاقتراح محجوز حتى {expires}.',
  'queue.slot.unavailable': 'فتحة قائمة الانتظار غير متاحة الآن.',
  'queue.slot.pending': 'جارٍ البحث عن الفتحة التالية.',
  'queue.slot.accepted': 'مجدول لـ {local} في {timeZone}.',
  'queue.slot.notAutomatic': 'لا شيء مجدول حتى تختار هذا الوقت.',

  'queue.reason.noRulesConfigured':
    'لا توجد قواعد قائمة انتظار مهيّأة لهذا المشروع، لذا لم تُطبَّق أي نافذة.',
  'queue.reason.fallbackFirstFreeHour': 'استُخدمت أول ساعة خالية بعد الآن بدلًا من ذلك.',
  'queue.reason.matchedRule': 'القاعدة {name} اختارت هذا الوقت، في {zone}.',
  'queue.reason.matchedWindow': 'يقع هذا ضمن النافذة من {start} إلى {end} في {zone}.',
  'queue.reason.minimumGap': 'هذا على بعد {minutes} دقيقة على الأقل من كل منشور آخر.',
  'queue.reason.noMinimumGap': 'هذه القاعدة لا تحدد فاصلًا أدنى بين المنشورات.',
  'queue.reason.dailyCap': 'ذلك اليوم يستوعب {limit} منشورًا كحد أقصى، وهو غير ممتلئ.',
  'queue.reason.dailyCapUnlimited': 'هذه القاعدة لا تحدد حدًا يوميًا.',
  'queue.reason.blackoutSkipped':
    'تم تخطي {days, plural, one {يوم حظر واحد} zero {# يوم حظر} two {يومي حظر} few {# أيام حظر} many {# يوم حظر} other {# يوم حظر}} للوصول إليه.',
  'queue.reason.dstNonexistentSkipped':
    'أول وقت في النافذة غير موجود في ذلك التاريخ في {zone}، لذا استُخدم الوقت التالي الموجود.',
  'queue.reason.dstAmbiguousFirst':
    'ذلك الوقت المحلي يحدث مرتين في {zone} في ذلك التاريخ. استُخدمت الحالة الأولى.',
  'queue.reason.priorityChosen': 'هذه القاعدة لها الأولوية {priority}، وهي الأعلى التي يمكنها العرض.',
  'queue.reason.connectionScoped':
    'تغطي هذه القاعدة {count, plural, one {حسابًا واحدًا} zero {# حساب} two {حسابين} few {# حسابات} many {# حسابًا} other {# حساب}}.',
  'queue.reason.horizonExhausted': 'لم تكن أي نافذة خالية خلال {days} يوم.',
} as const;
