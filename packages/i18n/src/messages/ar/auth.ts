/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'تسجيل الدخول',
  'auth.signIn.subtitle': 'قم بالنشر والموافقة وانظر بالضبط ما حدث.',
  'auth.signUp.title': 'أنشئ حسابك',
  'auth.continueWithGoogle': 'تواصل مع جوجل',
  'auth.continueWithFacebook': 'تواصل مع الفيسبوك',
  'auth.orUseEmail': 'أو استخدم بريدك الإلكتروني',
  'auth.email.label': 'البريد الإلكتروني',
  'auth.email.placeholder': 'you@company.com',
  'auth.password.label': 'كلمة المرور',
  'auth.password.show': 'إظهار كلمة المرور',
  'auth.password.hide': 'إخفاء كلمة المرور',
  'auth.password.strength.weak': 'من السهل جدًا تخمين ذلك',
  'auth.password.strength.fair': 'يمكن أن يكون أقوى',
  'auth.password.strength.strong': 'قوي',
  'auth.password.breached': 'لقد ظهرت كلمة المرور هذه في خرق عام. اختر واحدة مختلفة.',
  'auth.password.requirements': 'ما لا يقل عن 12 حرفا. الطول يهم أكثر من الرموز.',
  'auth.username.label': 'اسم المستخدم',
  'auth.username.help':
    'يقوم اسم المستخدم بتسجيل دخولك إلى حساب بريدك الإلكتروني الحالي. لا يحل محل كلمة المرور الخاصة بك أبدًا.',
  'auth.magicLink.send': 'أرسل لي رابط تسجيل الدخول',
  'auth.magicLink.sent':
    'إذا كان لهذا العنوان حساب، فسيكون هناك رابط تسجيل دخول في الطريق. الرابط يعمل مرة واحدة وينتهي في {minutes, plural, one {# دقيقة} zero {# دقيقة} two {# دقيقة} few {# دقيقة} many {# دقيقة} other {# دقيقة}}.',
  'auth.magicLink.checkEmail': 'تحقق من بريدك الإلكتروني',
  'auth.magicLink.resend': 'إرسال رابط آخر',
  'auth.magicLink.resendIn':
    'يمكنك إرسال رابط آخر في {seconds, plural, one {# ثانية} zero {# ثانية} two {# ثانية} few {# ثانية} many {# ثانية} other {# ثانية}}.',
  'auth.forgotPassword': 'هل نسيت كلمة المرور؟',
  'auth.resetPassword.title': 'اختر كلمة مرور جديدة',
  'auth.resetPassword.sent':
    'إذا كان لهذا العنوان حساب، فستكون تعليمات إعادة التعيين في طريقها إليه.',
  'auth.resetPassword.done': 'تم تحديث كلمة المرور الخاصة بك. تسجيل الدخول معها.',
  'auth.noAccount': 'ليس لديك حساب بعد؟',
  'auth.haveAccount': 'هل لديك حساب بالفعل؟',
  'auth.terms.accept':
    'من خلال المتابعة، فإنك توافق على الشروط وإشعار الخصوصية، الإصدار {version}.',
  'auth.terms.updated': 'تغيرت الشروط في {date}. اقرأ ملخص ما تغير، ثم قم بالقبول للمتابعة.',

  'auth.mfa.title': 'المصادقة الثنائية',
  'auth.mfa.enterCode': 'أدخل الرمز المكون من ستة أرقام من تطبيق المصادقة الخاص بك',
  'auth.mfa.recoveryCode': 'استخدم رمز الاسترداد',
  'auth.mfa.setupTitle': 'قم بإعداد المصادقة الثنائية',
  'auth.mfa.setupScan': 'امسح هذا الرمز ضوئيًا باستخدام تطبيق المصادقة الخاص بك.',
  'auth.mfa.setupManual': 'أو أدخل هذا المفتاح يدويًا',
  'auth.mfa.recoveryCodes': 'رموز الاسترداد',
  'auth.mfa.recoveryCodesHelp': 'تخزين هذه في مكان آمن. كل واحد يعمل مرة واحدة إذا فقدت جهازك.',
  'auth.mfa.requiredForAction': 'قم بالتأكيد باستخدام المصادقة الثنائية للمتابعة.',

  'auth.passkey.title': 'مفاتيح المرور',
  'auth.passkey.add': 'أضف مفتاح مرور',
  'auth.passkey.signIn': 'قم بتسجيل الدخول باستخدام مفتاح المرور',
  'auth.passkey.added': 'تمت إضافة مفتاح المرور {date}',

  'auth.session.expired': 'انتهت جلستك. قم بتسجيل الدخول مرة أخرى للمتابعة.',
  'auth.session.signedOut': 'لقد قمت بتسجيل الخروج.',
  'auth.session.otherDevice': 'لقد قمت بتسجيل الدخول على جهاز آخر.',

  'auth.invite.title': '{inviter} دعاك إلى {workspace}',
  'auth.invite.accept': 'قبول الدعوة',
  'auth.invite.declined': 'تم رفض الدعوة.',
  'auth.invite.expired': 'انتهت صلاحية هذه الدعوة. اطلب من {inviter} إرسال واحدة أخرى.',
  'auth.invite.roleNote': 'سوف تنضم باسم {role}.',

  'auth.verifyEmail.title': 'قم بتأكيد بريدك الإلكتروني',
  'auth.verifyEmail.body': 'لقد أرسلنا رابط التأكيد إلى {email}.',
  'auth.verifyEmail.done': 'تم تأكيد بريدك الإلكتروني.',

  'auth.rateLimited':
    'محاولات كثيرة جدًا. حاول مرة أخرى في {minutes, plural, one {# دقيقة} zero {# دقيقة} two {# دقيقة} few {# دقيقة} many {# دقيقة} other {# دقيقة}}.',
  'auth.genericFailure': 'هذا لم ينجح. تحقق من التفاصيل وحاول مرة أخرى.',
} as const;
