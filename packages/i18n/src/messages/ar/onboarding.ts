/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'إعداد Post Array',
  'onboarding.progress': 'الخطوة {current} من {total}',
  'onboarding.skipForNow': 'تخطي الآن',
  'onboarding.goal': 'تم التحقق من مشاركة مجدولة في أقل من عشر دقائق.',

  'onboarding.plan.title': 'اختر الطريقة التي تريد الدفع بها',
  'onboarding.plan.help': 'خطة واحدة، كل ميزة. قم بتغيير الفاصل الزمني وقتما تشاء.',

  'onboarding.workspace.title': 'قم بتسمية مساحة العمل الخاصة بك',
  'onboarding.workspace.namePlaceholder': 'اسم شركتك أو عميلك',
  'onboarding.workspace.timeZone': 'المنطقة الزمنية للجدولة',
  'onboarding.workspace.timeZoneHelp':
    'يتم تخزين كل وقت مجدول في هذه المنطقة، لذا فإن تغيير الساعة لا يؤدي أبدًا إلى نقل مشاركتك عن طريق الصدفة.',
  'onboarding.workspace.locale': 'لغة الواجهة',

  'onboarding.role.title': 'ما الذي يصفك بشكل أفضل؟',
  'onboarding.role.creator': 'الخالق',
  'onboarding.role.team': 'في فريق المنزل',
  'onboarding.role.agency': 'وكالة',
  'onboarding.role.developer': 'المطور أو وكيل البناء',
  'onboarding.role.help': 'وهذا يغير الإعدادات الافتراضية التي نقترحها. يمكنك تغيير كل شيء لاحقًا.',

  'onboarding.connect.title': 'قم بتوصيل حسابك الأول',
  'onboarding.connect.help':
    'سنوضح لك بالضبط الأذونات التي يطلبها كل نظام أساسي قبل الموافقة على أي شيء.',
  'onboarding.connect.skipNote': 'يمكنك الاستكشاف باستخدام نموذج الحساب أولاً. لا شيء ينشر منه.',
  'onboarding.connect.success': '{account} متصل.',

  'onboarding.content.title': 'ابدأ بشيء لديك بالفعل',
  'onboarding.content.useAsset': 'استخدم صورة أو فيديو',
  'onboarding.content.useBrief': 'ابدأ بملخص قصير',
  'onboarding.content.useText': 'اكتبها بنفسك',

  'onboarding.preview.title': 'وهذا ما سيتم نشره',
  'onboarding.preview.help': 'معاينة حقيقية لقواعد النظام الأساسي لهذا الحساب.',

  'onboarding.schedule.title': 'اختر متى يخرج',
  'onboarding.schedule.help':
    'قم بمراجعة الوقت وإعدادات الخصوصية والإفصاح والتكلفة المقدرة للمزود.',

  'onboarding.done.title': 'المقرر',
  'onboarding.done.body': 'تمت جدولة منشورك لـ {time} في {timeZone}.',
  'onboarding.done.nextStep.title': 'ماذا تفعل بعد ذلك',
  'onboarding.done.nextStep.connectMore': 'ربط حساب آخر',
  'onboarding.done.nextStep.inviteTeam': 'قم بدعوة زميل في الفريق',
  'onboarding.done.nextStep.setApproval': 'قم بتعيين سياسة الموافقة',
  'onboarding.done.nextStep.exploreApi': 'استكشف خادم API وMCP',

  'onboarding.checklist.title': 'البدء',
  'onboarding.checklist.connectAccount': 'ربط حساب',
  'onboarding.checklist.firstPost': 'نشر أو جدولة منشور',
  'onboarding.checklist.inviteTeammate': 'قم بدعوة زميل في الفريق',
  'onboarding.checklist.setProjectVoice': 'صف صوت علامتك التجارية',
  'onboarding.checklist.tryAutomation': 'جرب قاعدة الأتمتة',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {تم كل شيء} one {#خطوة لليسار} zero {متبقي # خطوة} two {متبقي # خطوة} few {متبقي # خطوة} many {متبقي # خطوة} other {متبقي # خطوة}}',
} as const;
