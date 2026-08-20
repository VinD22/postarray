/**
 * The web application shell: Home, the command palette, the Action center
 * queue chrome, the demo data notice, and the parts of sign in and onboarding
 * that the shared `auth`, `onboarding` and `billing` catalogs do not cover.
 *
 * Owned by the web shell. Screen catalogs (composer, calendar, analytics)
 * belong to their own files.
 */
export const webShellMessages = {
  /* -- Document and shell chrome ----------------------------------------- */
  'shell.appName': 'Relay',
  'shell.documentTitle': '{page} · Relay',
  'shell.tagline': 'مكتب نشر للأشخاص والوكلاء.',
  'shell.menu.open': 'افتح القائمة',
  'shell.menu.title': 'القائمة',
  'shell.nav.more': 'المزيد',
  'shell.help.title': 'مساعدة',
  'shell.help.documentation': 'التوثيق',
  'shell.help.keyboardShortcuts': 'اختصارات لوحة المفاتيح',
  'shell.help.platformStatus': 'حالة المنصة',
  'shell.help.whatChanged': 'ما تغير',
  'shell.help.contactSupport': 'اتصل بالدعم',
  'shell.account.settings': 'الإعدادات',
  'shell.account.profile': 'ملفك الشخصي',
  'shell.workspace.create': 'إنشاء مساحة عمل',
  'shell.workspace.manage': 'إعدادات Workspace',
  'shell.workspace.role': 'أنت {role} هنا',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'البيانات التجريبية',
  'shell.demo.title': 'أنت تنظر إلى البيانات التجريبية',
  'shell.demo.body':
    'لا يمكن الوصول إلى واجهة برمجة التطبيقات Relay من هذا المتصفح، لذا تمتلئ الشاشات بمساحة عمل نموذجية. لا يوجد شيء هنا مرتبط بحساب حقيقي ولا يمكن نشر أي شيء.',
  'shell.demo.howToConnect':
    'قم بتعيين NEXT_PUBLIC_RELAY_API_URL وأعد تشغيل التطبيق لاستخدام البيانات المباشرة.',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'أنت غير متصل',
  'shell.offline.body':
    'يتم الاحتفاظ بالمسودات على هذا الجهاز. يتم استئناف الجدولة والنشر عند عودة الاتصال.',
  'shell.offline.retry': 'تحقق من الاتصال',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'افتح لوحة الأوامر',
  'palette.title': 'لوحة الأوامر',
  'palette.description': 'ابحث عن شاشة أو حساب أو إجراء.',
  'palette.placeholder': 'اكتب أمرًا أو اسمًا للشاشة',
  'palette.empty': 'لا شيء يطابق {query}.',
  'palette.group.actions': 'الإجراءات',
  'palette.group.goTo': 'اذهب الى',
  'palette.group.workspaces': 'Workspaces',
  'palette.group.settings': 'الإعدادات',
  'palette.hint.navigate': 'التحرك باستخدام مفاتيح الأسهم',
  'palette.hint.select': 'فتح مع أدخل',
  'palette.hint.close': 'إغلاق مع الهروب',
  'palette.action.compose': 'إنشاء مشاركة',
  'palette.action.connectAccount': 'ربط حساب',
  'palette.action.openActionCenter': 'افتح مركز العمل',
  'palette.action.uploadMedia': 'تحميل الوسائط',
  'palette.action.createRule': 'إنشاء قاعدة الأتمتة',
  'palette.action.toggleTheme': 'تبديل الموضوع',
  'palette.action.signOut': 'تسجيل الخروج',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'افتح مركز العمل',
  'actionCenter.group.now.label': 'الآن',
  'actionCenter.group.soon.label': 'قريبا',
  'actionCenter.group.watching.label': 'مشاهدة',
  'actionCenter.group.now.hint': 'النشر في خطر حتى يتم التعامل معها.',
  'actionCenter.group.soon.hint': 'هذه لها موعد نهائي لا يزال بإمكانك الوفاء به.',
  'actionCenter.group.watching.hint': 'ليست عاجلة. يستحق نظرة هذا الأسبوع.',
  'actionCenter.severity.now': 'يحتاجك الآن',
  'actionCenter.severity.soon': 'يحتاجك قريبا',
  'actionCenter.severity.watching': 'مشاهدة',
  'actionCenter.filter.all': 'الكل',
  'actionCenter.filter.connections': 'اتصالات',
  'actionCenter.filter.publishing': 'النشر',
  'actionCenter.filter.automation': 'الأتمتة',
  'actionCenter.filter.billing': 'الفواتير',
  'actionCenter.snoozed': 'تم التأجيل',
  'actionCenter.snoozeOneDay': 'قيلولة بعد الظهر لمدة يوم',
  'actionCenter.snoozedUntil': 'تم التأجيل حتى {date}',
  'actionCenter.unsnooze': 'أعد هذا',
  'actionCenter.resolved': 'تم الحل {relativeTime}',
  'actionCenter.emptyFiltered': 'لا شيء في هذه المجموعة يحتاج إلى الاهتمام.',
  'actionCenter.errorTitle': 'تعذر تحميل مركز العمل',
  'actionCenter.loading': 'جارٍ تحميل ما يحتاج إلى اهتمام',
  'actionCenter.affectedAccount': 'يؤثر {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {لا شيء يحتاج إلى الاهتمام} one {#عنصر} zero {# العناصر} two {# العناصر} few {# العناصر} many {# العناصر} other {# العناصر}}',
  'actionCenter.action.reconnect': 'أعد الاتصال',
  'actionCenter.action.openReceipt': 'افتح الإيصال',
  'actionCenter.action.review': 'مراجعة',
  'actionCenter.action.openDraft': 'افتح المسودة',
  'actionCenter.action.openCalendar': 'افتح التقويم',
  'actionCenter.action.viewStatus': 'عرض الحالة',
  'actionCenter.action.checkFeed': 'تحقق من التغذية',
  'actionCenter.action.inspectDeliveries': 'فحص عمليات التسليم',
  'actionCenter.action.addBalance': 'مراجعة الاستخدام',
  'actionCenter.action.fixConnection': 'أصلح الاتصال',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'الصفحة الرئيسية',
  'home.subtitle': 'ما يحتاجك اليوم، وماذا يخرج بعد ذلك.',
  'home.greetingSummary':
    '{actions, plural, =0 {لا شيء يحتاجك الآن} one {#عنصر يحتاج إليك} zero {# العناصر تحتاج إليك} two {# العناصر تحتاج إليك} few {# العناصر تحتاج إليك} many {# العناصر تحتاج إليك} other {# العناصر تحتاج إليك}}. {upcoming, plural, =0 {لا يوجد شيء مقرر خلال الـ 24 ساعة القادمة} one {سيتم نشر مشاركة واحدة خلال الـ 24 ساعة القادمة} zero {سيتم نشر # منشورًا خلال الـ 24 ساعة القادمة} two {سيتم نشر # منشورًا خلال الـ 24 ساعة القادمة} few {سيتم نشر # منشورًا خلال الـ 24 ساعة القادمة} many {سيتم نشر # منشورًا خلال الـ 24 ساعة القادمة} other {سيتم نشر # منشورًا خلال الـ 24 ساعة القادمة}}.',
  'home.needsYou.title': 'يحتاجك الآن',
  'home.needsYou.empty': 'لا شيء يحتاجك الآن.',
  'home.needsYou.emptyBody': 'تظهر هنا حالة الاتصال والموافقات وعمليات النشر الفاشلة لحظة حدوثها.',
  'home.needsYou.viewAll': 'افتح مركز العمل',
  'home.needsYou.emptyQuiet': 'استمتع بالهدوء. أي شيء يحتاج إلى قرار يظهر هنا لحظة حدوثه.',
  'home.upcoming.title': 'الـ 24 ساعة القادمة',
  'home.upcoming.empty': 'لا يوجد شيء مقرر خلال الـ 24 ساعة القادمة.',
  'home.upcoming.emptyBody': 'اكتب منشورًا واختر وقتًا. يمكنك تغييره لاحقا.',
  'home.upcoming.viewAll': 'افتح التقويم',
  'home.upcoming.timeZoneNote': 'يتم عرض الأوقات في {timeZone}، منطقة مساحة العمل.',
  'home.upcoming.columnTime': 'الوقت',
  'home.upcoming.columnAccount': 'الحساب',
  'home.upcoming.columnContent': 'المحتوى',
  'home.upcoming.columnStatus': 'الحالة',
  'home.receipts.title': 'الإيصالات الأخيرة',
  'home.receipts.empty': 'لم يتم نشر أية مشاركات من مساحة العمل هذه حتى الآن.',
  'home.receipts.emptyBody': 'يُنتج كل منشور إيصالًا يمكنك فحصه ومشاركته.',
  'home.receipts.viewAll': 'جميع الإيصالات',
  'home.receipts.publishedTo': 'تم النشر في {account}',
  'home.connections.title': 'صحة الاتصال',
  'home.connections.summary':
    '{healthy, plural, one {# الحساب يعمل} zero {# حسابات تعمل} two {# حسابات تعمل} few {# حسابات تعمل} many {# حسابات تعمل} other {# حسابات تعمل}}. {attention, plural, =0 {لا شيء يحتاج إلى الاهتمام} one {#يحتاج إلى اهتمام} zero {#تحتاج إلى اهتمام} two {#تحتاج إلى اهتمام} few {#تحتاج إلى اهتمام} many {#تحتاج إلى اهتمام} other {#تحتاج إلى اهتمام}}.',
  'home.connections.viewAll': 'جميع الاتصالات',
  'home.connections.empty': 'لا توجد حسابات متصلة حتى الآن.',
  'home.advisor.title': 'مستشار النمو',
  'home.advisor.summary':
    'تمت الموافقة على إصدار الخطة {version} {date}. الأسبوع {week} من {total} قد {briefs, plural, one {#ملخص لم تتم صياغته بعد} zero {# ملخصات لم تتم صياغتها بعد} two {# ملخصات لم تتم صياغتها بعد} few {# ملخصات لم تتم صياغتها بعد} many {# ملخصات لم تتم صياغتها بعد} other {# ملخصات لم تتم صياغتها بعد}}.',
  'home.advisor.noPlan':
    'يقوم المستشار ببناء خطة من الحقائق التي تؤكدها. يقترح العمل ولا ينشر أبدًا من تلقاء نفسه.',
  'home.advisor.openPlan': 'افتح الخطة',
  'home.advisor.createDrafts': 'إنشاء مسودات من الأسبوع {week}',
  'home.advisor.start': 'ابدأ الملف التعريفي للأعمال',
  'home.trial.banner':
    'محاكمة، {days, plural, =0 {ينتهي اليوم} one {بقي #يوم} zero {متبقي # يوم} two {متبقي # يوم} few {متبقي # يوم} many {متبقي # يوم} other {متبقي # يوم}}. يحول {date} إلى {amount}.',
  'home.trial.manage': 'إدارة أو إلغاء',
  'home.error.title': 'تعذر تحميل المنزل',
  'home.error.body': 'مساحة العمل الخاصة بك سليمة. هذه مشكلة في الوصول إلى Relay API.',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title': 'انشر من خلال واجهات برمجة التطبيقات الرسمية وشاهد ما حدث بالضبط.',
  'auth.aside.point.receipts':
    'يُنتج كل منشور إيصالًا: من وافق عليه، ومتى تم إرساله، وما الذي أعادته المنصة.',
  'auth.aside.point.approvals':
    'لا شيء يصل إلى النظام الأساسي دون الحصول على الموافقة التي تتطلبها سياستك.',
  'auth.aside.point.surfaces': 'نفس سير العمل من تطبيق الويب وREST API وMCP وCLI وخطافات الويب.',
  'auth.provider.title': 'قبل المتابعة',
  'auth.provider.google.access':
    'تشارك Google اسمك وعنوان بريدك الإلكتروني وصورة ملفك الشخصي مع Relay. لا يستطيع Relay قراءة Gmail أو Drive أو التقويم.',
  'auth.provider.facebook.access':
    'يشارك Facebook اسمك وعنوان بريدك الإلكتروني وصورة ملفك الشخصي مع Relay. يعد ربط الصفحة للنشر بها خطوة منفصلة توافق عليها لاحقًا.',
  'auth.provider.note': 'يؤدي هذا إلى تسجيل دخولك. ولا يربط حسابًا للنشر فيه.',
  'auth.continueWithEmail': 'تواصل مع البريد الإلكتروني',
  'auth.method.password': 'كلمة المرور',
  'auth.method.magicLink': 'رابط البريد الإلكتروني',
  'auth.method.username': 'اسم المستخدم',
  'auth.method.chooseLabel': 'كيف تريد تسجيل الدخول؟',
  'auth.username.placeholder': 'اسم المستخدم الخاص بك',
  'auth.username.aliasNote':
    'اسم المستخدم هو اسم مستعار لعنوان البريد الإلكتروني الموجود في حسابك. كلمة المرور هي نفسها.',
  'auth.password.placeholder': 'كلمة المرور الخاصة بك',
  'auth.submit.signIn': 'تسجيل الدخول',
  'auth.submit.signUp': 'إنشاء حساب',
  'auth.submit.working': 'التحقق',
  'auth.failure.credentials':
    'عنوان البريد الإلكتروني وكلمة المرور لا يتطابقان مع الحساب. تحقق من كليهما وحاول مرة أخرى.',
  'auth.failure.usernameCredentials':
    'اسم المستخدم وكلمة المرور لا يتطابقان مع الحساب. تحقق من كليهما وحاول مرة أخرى.',
  'auth.failure.noAccountLeak': 'من أجل سلامتك، لا نذكر ما إذا كان العنوان مسجلاً أم لا.',
  'auth.failure.provider': 'تسجيل الدخول بـ {provider} لم يكتمل. لم يتغير شيء.',
  'auth.failure.network': 'لم نتمكن من الوصول إلى Relay. تحقق من اتصالك وحاول مرة أخرى.',
  'auth.signUp.trialNote': 'سبعة أيام تجريبية كاملة. مطلوب طريقة الدفع. 0 دولار مستحقة اليوم.',
  'auth.signUp.emailInUseNote':
    'إذا كان لهذا العنوان حساب بالفعل، فسنرسل إليك رابط تسجيل الدخول عبر البريد الإلكتروني بدلاً من إنشاء رابط ثانٍ.',
  'auth.legal.readTerms': 'اقرأ الشروط',
  'auth.legal.readPrivacy': 'اقرأ إشعار الخصوصية',
  'auth.switchToSignUp': 'إنشاء حساب',
  'auth.switchToSignIn': 'تسجيل الدخول بدلا من ذلك',
  'auth.checkEmail.body': 'لقد أرسلنا رابط تسجيل الدخول إلى {email}. يعمل مرة واحدة.',
  'auth.checkEmail.wrongAddress': 'استخدم عنوانًا مختلفًا',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'الفواتير',
  'onboarding.stepName.workspace': 'Workspace',
  'onboarding.stepName.role': 'حالة الاستخدام',
  'onboarding.stepName.connect': 'الاتصال',
  'onboarding.stepName.compose': 'المشاركة الأولى',
  'onboarding.stepName.receipt': 'تأكيد',
  'onboarding.stepList': 'خطوات الإعداد',
  'onboarding.stepComplete': 'تم',
  'onboarding.stepCurrent': 'الخطوة الحالية',
  'onboarding.exit': 'أكمل لاحقًا',
  'onboarding.plan.intervalMonthlyLabel': '29 دولارًا شهريًا',
  'onboarding.plan.intervalAnnualLabel': '300 دولار سنويا',
  'onboarding.plan.checkoutHint':
    'الشاشة التالية هي Polar، تاجر التسجيلات لدينا. يتم منح الوصول عندما يؤكد Polar الاشتراك، وليس عندما يعود المتصفح.',
  'onboarding.plan.factsTitle': 'ماذا يحدث عند الاستمرار',
  'onboarding.workspace.help':
    'تحتوي مساحة العمل على علاماتك التجارية وحساباتك المتصلة والمسودات والإيصالات. يمكنك إنشاء المزيد لاحقًا.',
  'onboarding.workspace.localeNote':
    'لغة الواجهة الخاصة بك تغير هذا التطبيق. يتم اختيار لغات المحتوى لكل مشاركة وتكون منفصلة عن هذا الإعداد.',
  'onboarding.workspace.timeZoneDetected': 'تم اكتشافه من هذا الجهاز: {timeZone}',
  'onboarding.connect.permissionsTitle': 'ما الذي سيتم طلبه من {provider}',
  'onboarding.connect.permissionsFooter':
    'Relay لا يطلب أبدًا إذنًا لا يستخدمه، ويمكنك قطع الاتصال في أي وقت.',
  'onboarding.connect.chooseProvider': 'اختر منصة',
  'onboarding.connect.opensProvider': 'الاستمرار يفتح {provider} في علامة التبويب هذه.',
  'onboarding.compose.help': 'اكتب المنشور، ثم تحقق من المعاينة والتحقق قبل اختيار الوقت.',
  'onboarding.compose.openComposer': 'افتح الملحن الكامل',
  'onboarding.receipt.title': 'تمت جدولة مشاركتك الأولى',
  'onboarding.receipt.body':
    'وهنا هو السجل حتى الآن. ويستمر في التحديث من خلال الإرسال واستجابة الموفر ومزامنة التحليلات الأولى.',
  'onboarding.receipt.goHome': 'اذهب إلى الصفحة الرئيسية',
  'onboarding.blocked.title': 'هذه الخطوة تحتاج إلى الخطوة السابقة',
  'onboarding.blocked.body': 'قم بإنهاء {step} أولاً. لن يتم فقدان أي شيء قمت بإدخاله.',
} as const;
