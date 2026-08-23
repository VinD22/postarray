/** Weekly digest copy for the Arabic interface. */
export const digestMessages = {
  'digest.title': 'هذا الأسبوع',
  'digest.subtitle': 'ما يمكننا رؤيته من {windowStart} إلى {windowEnd}.',
  'digest.empty':
    'لا يوجد ما يمكن تلخيصه لهذا الأسبوع حتى الآن. انشر شيئًا وسيظهر هنا.',
  'digest.regenerate': 'إعادة إنشاء ملخص هذا الأسبوع',
  'digest.generating': 'جارٍ إنشاء ملخص هذا الأسبوع',
  'digest.source.deterministic':
    'كُتب من سجلات النشر والقياسات الخاصة بك، من دون مساعد الكتابة.',
  'digest.source.ai':
    'كتبه المساعد من سجلاتك الخاصة. تم التحقق من كل رقم بالرجوع إليها.',
  'digest.unavailable.aiOff':
    'مساعد الكتابة متوقف، لذلك هذه هي النسخة الأساسية. لا ينقصها شيء.',
  'digest.unavailable.rejected':
    'لم تتطابق نسخة المساعد مع بياناتك، لذلك تم تجاهلها. هذه هي النسخة الأساسية.',
  'digest.headline.published':
    '{published, plural, =0 {لم تكتمل أي منشورات} zero {لم تكتمل أي منشورات} one {اكتمل منشور واحد} two {اكتمل منشوران} few {اكتملت # منشورات} many {اكتمل # منشورًا} other {اكتمل # منشور}} بين {windowStart} و{windowEnd}.',
  'digest.headline.nothingPublished':
    'لم يتم نشر أي شيء بين {windowStart} و{windowEnd}.',
  'digest.outcome.published':
    '{count, plural, zero {لم تكتمل أي منشورات على {provider}} one {اكتمل منشور واحد على {provider}} two {اكتمل منشوران على {provider}} few {اكتملت # منشورات على {provider}} many {اكتمل # منشورًا على {provider}} other {اكتمل # منشور على {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, zero {لم يصل أي منشور إلى وجهاته على {provider}} one {وصل منشور واحد إلى بعض وجهاته على {provider} دون الوجهات الأخرى} two {وصل منشوران إلى بعض وجهاتهما على {provider} دون الوجهات الأخرى} few {وصلت # منشورات إلى بعض وجهاتها على {provider} دون الوجهات الأخرى} many {وصل # منشورًا إلى بعض وجهاته على {provider} دون الوجهات الأخرى} other {وصل # منشور إلى بعض وجهاته على {provider} دون الوجهات الأخرى}}.',
  'digest.outcome.failed':
    '{count, plural, zero {لم يفشل أي منشور على {provider}} one {لم يصل منشور واحد على {provider}} two {لم يصل منشوران على {provider}} few {لم تصل # منشورات على {provider}} many {لم يصل # منشورًا على {provider}} other {لم يصل # منشور على {provider}}}.',
  'digest.metrics.noneYet':
    'لم تصل أي قياسات هذا الأسبوع حتى الآن. هذا يعني أننا لا نعرف أداء هذه المنشورات، وليس أنها أدت أداءً سيئًا.',
  'digest.freshness.statement':
    '{label, select, fresh {تمت مزامنة القياسات آخر مرة في {lastObservedAt}.} stale {لم تتم مزامنة القياسات منذ {lastObservedAt}، لذلك قد تكون الأرقام أعلاه قديمة.} other {لم تتم مزامنة أي شيء بعد، لذلك لا توجد قياسات لما سبق.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'من المفيد أن تعرف: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'ملخص أسبوعي عبر البريد الإلكتروني',
  'digest.settings.description':
    'رسالة قصيرة كل أسبوع عمّا نُشر وما تمكنا من قياسه. مفعّل تلقائيًا.',
  'digest.settings.enabled': 'إرسال الملخص الأسبوعي',
  'email.digest.subject': 'أسبوعك في {workspaceName}',
  'email.digest.intro':
    'إليك ما يمكننا رؤيته في {workspaceName} بين {windowStart} و{windowEnd}.',
  'email.digest.noData':
    'لم نتمكن من قياس أي شيء هذا الأسبوع. عندما يغيب رقم، فذلك لأننا لم نتمكن من قراءته، وليس لأنه كان صفرًا.',
  'email.digest.footer':
    'تصلك هذه الرسالة لأن الملخص الأسبوعي مفعّل في {workspaceName}. أوقفه من إعدادات مساحة العمل.',
} as const;

