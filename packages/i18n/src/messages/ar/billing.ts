/**
 * Billing, trial and plan copy.
 *
 * Several strings here are mandated word for word by the research and by the
 * launch acceptance checklist. Do not soften or restyle them:
 *  - `billing.trial.dueToday` must read "$0 due today".
 *  - `billing.plan.annualFraming` must state the saving in currency, never a
 *    percentage discount.
 *  - `billing.mediaGeneration.explanation` is the approved boundary paragraph.
 *    Tool Radar and the pricing page use this same key.
 */
export const billingMessages = {
  'billing.title': 'الفواتير',
  'billing.plan.name': 'Post Array',
  'billing.plan.single': 'خطة واحدة. كل ميزة. لا طبقات.',
  'billing.plan.monthlyPrice': '29 دولارًا شهريًا',
  'billing.plan.annualPrice': '300 دولار في السنة',
  'billing.plan.annualFraming':
    '25 دولارًا شهريًا يتم إصدار فاتورة بها سنويًا. وفر 48 دولارًا سنويًا.',
  'billing.plan.interval.monthly': 'شهريا',
  'billing.plan.interval.annual': 'سنوي',
  'billing.plan.selectInterval': 'اختر فترة زمنية للفوترة',
  'billing.plan.includes.title': 'ما هو مدرج',
  'billing.plan.includes.channels': 'ما يصل إلى 30 قناة اجتماعية نشطة',
  'billing.plan.includes.members': 'عدد غير محدود من أعضاء الفريق',
  'billing.plan.includes.posts': 'مسودات غير محدودة ومنشورات مجدولة بموجب الاستخدام العادل',
  'billing.plan.includes.connectors': 'كل موصل معتمد',
  'billing.plan.includes.analytics': 'يتم الاحتفاظ بالتحليلات من اليوم الذي قمت فيه بتوصيل الحساب',
  'billing.plan.includes.api': 'REST API وخادم MCP البعيد وCLI وخطافات الويب',
  'billing.plan.includes.automation': 'قواعد الأتمتة والنشر التلقائي لـ RSS والروابط المتعقبة',
  'billing.plan.includes.ai': 'المساعدة النصية DeepSeek في ظل إساءة الاستخدام وحدود التكلفة',
  'billing.plan.includes.support': 'دعم البريد الإلكتروني وفي التطبيق',
  'billing.plan.fairUse':
    'الاستخدام العادل يعني مكافحة البريد العشوائي، وضبط الأسعار وتكلفة مقدم الخدمة الذي يحمي حساباتك. إنهم يعملون بنفس الطريقة لكل مشترك.',

  'billing.trial.dueToday': '0 دولار مستحقة اليوم',
  'billing.trial.paymentMethodRequired': 'تجمع Polar طريقة الدفع الآن ولا تفرض أي رسوم اليوم.',
  'billing.trial.firstCharge': 'الشحنة الأولى {amount} على {date}',
  'billing.trial.renewal': 'يجدد {amount} كل {interval} بعد ذلك',
  'billing.trial.cancelBefore': 'قم بالإلغاء في الإعدادات قبل هذا التاريخ ولن يتم تحصيل رسوم منك.',
  'billing.trial.reminder':
    'يرسل لك Polar بريدًا إلكترونيًا قبل ثلاثة أيام من تحويل النسخة التجريبية.',
  'billing.trial.daysRemaining':
    '{count, plural, =0 {تنتهي المحاكمة اليوم} one {الفترة التجريبية، متبقي يوم واحد} zero {الفترة التجريبية، متبقي # يوم} two {الفترة التجريبية، متبقي # يوم} few {الفترة التجريبية، متبقي # يوم} many {الفترة التجريبية، متبقي # يوم} other {الفترة التجريبية، متبقي # يوم}}',
  'billing.trial.converted': 'تم تحويل نسختك التجريبية في {date}.',
  'billing.trial.canceled': 'تم إلغاء النسخة التجريبية الخاصة بك. لن يتم محاسبتك.',
  'billing.trial.abusePrevention':
    'تكرار المحاكمات محدودة. إذا لم تكن النسخة التجريبية متاحة لهذا الحساب، فاتصل بالدعم.',

  'billing.checkout.open': 'الاستمرار في الخروج',
  'billing.checkout.hostedBy':
    'يتم التعامل مع عملية الدفع والفواتير بواسطة Polar، التاجر المسجل لدينا.',
  'billing.checkout.taxNote':
    'تقوم Polar بجمع وتحويل أي ضريبة مبيعات أو ضريبة القيمة المضافة المطبقة.',
  'billing.checkout.notEntitledYet':
    'نمنح حق الوصول بعد تأكيد Polar للاشتراك، وليس من إعادة توجيه المتصفح. يستغرق هذا عادةً بضع ثوانٍ.',
  'billing.checkout.returning': 'تأكيد اشتراكك مع Polar',

  'billing.subscription.status.trialing': 'محاكمة',
  'billing.subscription.status.active': 'نشط',
  'billing.subscription.status.pastDue': 'تأخر السداد',
  'billing.subscription.status.canceled': 'تم الإلغاء',
  'billing.subscription.status.unpaid': 'غير مدفوعة الأجر',
  'billing.subscription.status.none': 'لا يوجد اشتراك',
  'billing.subscription.renewsOn': 'تجديد {amount} على {date}',
  'billing.subscription.endsOn': 'يستمر الوصول حتى {date}',
  'billing.subscription.pastDueBody':
    'لم تتم الدفعة الأخيرة. قم بتحديث طريقة الدفع لمواصلة النشر. بعد فترة السماح، تصبح مساحة العمل للقراءة فقط وتتوقف المشاركات المجدولة.',
  'billing.subscription.readOnly':
    'مساحة العمل هذه للقراءة فقط. المحتوى الخاص بك والإيصالات والاتصالات سليمة.',
  'billing.subscription.portal': 'افتح بوابة العملاء القطبية',
  'billing.subscription.invoices': 'الفواتير',
  'billing.subscription.paymentMethod': 'طريقة الدفع',
  'billing.subscription.managedByPolar': 'تحت إدارة القطبية',

  'billing.cancel.title': 'قم بإلغاء اشتراكك',
  'billing.cancel.beforeTrialEnd':
    'قم بالإلغاء الآن ولن يتم تحصيل أي رسوم منك. يمكنك الاحتفاظ بكل ميزة حتى {date}.',
  'billing.cancel.afterTrial': 'يمكنك الاحتفاظ بالوصول حتى {date}. لا يتم حذف أي شيء عندما ينتهي.',
  'billing.cancel.confirm': 'إلغاء الاشتراك',
  'billing.cancel.confirmed': 'تم الإلغاء. لن يتم محاسبتك.',
  'billing.cancel.keepData': 'تبقى المسودات والإيصالات والتحليلات الخاصة بك في مساحة العمل هذه.',

  'billing.usage.title': 'الاستخدام',
  'billing.usage.meteredNote':
    'يتم تمرير بعض تكاليف الموفر بالتكلفة لأن الموفر يتقاضى رسومًا لكل عملية.',
  'billing.usage.xCharges':
    'X رسوم لكل مشاركة. تكلف المشاركات التي تحتوي على عنوان URL أكثر من النص العادي.',
  'billing.usage.balance': 'رصيد الاستخدام {amount}',
  'billing.usage.estimatedBeforeAction': 'يقدر هذا الإجراء بـ {amount}.',
  'billing.usage.periodTotal': '{amount} مستخدم منذ {date}',
  'billing.usage.noMediaCredits':
    'لا توجد أرصدة لإنشاء الصور أو الفيديو، لأن Post Array لا يقوم بإنشاء الوسائط.',

  'billing.downgrade.overLimit':
    'مساحة العمل هذه لديها {count, plural, one {#قناة} zero {#قنوات} two {#قنوات} few {#قنوات} many {#قنوات} other {#قنوات}} فوق الحد. يتم حظر الإجراءات الجديدة على تلك القنوات. لم يتم قطع أي شيء بالنسبة لك.',

  'billing.mediaGeneration.title': 'لماذا لا نقوم بإنشاء الصور أو الفيديو',
  'billing.mediaGeneration.explanation':
    'نحن نركز على مساعدتك في التخطيط والموافقة والنشر والتعلم. نحن لا نقوم بإنشاء صور أو مقاطع فيديو في الإصدار الأول لأن الوسائط الجاهزة للعلامة التجارية تحتاج إلى أكثر من مجرد مطالبة قصيرة: فهي تحتاج إلى نظامك المرئي الكامل، وتفاصيل المنتج الدقيقة، والأصول المرخصة، والأشخاص، وأذونات الاستخدام، والمراجعة الدقيقة. النماذج الإبداعية تتغير أيضًا بسرعة. نوصي بالأدوات المتخصصة التي تم التحقق منها حاليًا ونجعل من السهل إدخال عملها النهائي في حملاتك مع الحفاظ على التحكم الإبداعي.',

  'billing.referral.title': 'الإحالات',
  'billing.referral.disclosure':
    'يجب الكشف عن روابط الإحالة أينما قمت بمشاركتها. اللجنة ليست مشروطة أبدًا بمراجعة إيجابية.',
  'billing.referral.link': 'رابط الإحالة الخاص بك',
  'billing.referral.attributed':
    '{count, plural, one {# الاشتراك المنسوب} zero {# الاشتراكات المنسوبة} two {# الاشتراكات المنسوبة} few {# الاشتراكات المنسوبة} many {# الاشتراكات المنسوبة} other {# الاشتراكات المنسوبة}}',
  'billing.referral.commissionPending': 'معلق، يتم تعليقه حتى يتم إغلاق نافذة استرداد الأموال',
  'billing.referral.commissionApproved': 'تمت الموافقة عليه',
  'billing.referral.commissionReversed': 'عكس بعد استرداد',
  'billing.referral.payout': 'يتم تشغيل الدفعات {schedule}.',
} as const;
