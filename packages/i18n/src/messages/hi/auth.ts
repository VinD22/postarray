/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'साइन इन करें',
  'auth.signIn.subtitle': 'प्रकाशित करें, अनुमोदन करें और देखें कि वास्तव में क्या हुआ।',
  'auth.signUp.title': 'अपना खाता बनाएं',
  'auth.signUp.subtitle': 'हर सुविधा के साथ सात दिन। $0 आज देय है.',
  'auth.continueWithGoogle': 'Google के साथ जारी रखें',
  'auth.continueWithFacebook': 'फेसबुक के साथ जारी रखें',
  'auth.orUseEmail': 'या अपने ईमेल का उपयोग करें',
  'auth.email.label': 'ईमेल',
  'auth.email.placeholder': 'you@company.com',
  'auth.password.label': 'पासवर्ड',
  'auth.password.show': 'पासवर्ड दिखाएँ',
  'auth.password.hide': 'पासवर्ड छिपाएँ',
  'auth.password.strength.weak': 'अनुमान लगाना बहुत आसान है',
  'auth.password.strength.fair': 'मजबूत हो सकता है',
  'auth.password.strength.strong': 'मजबूत',
  'auth.password.breached': 'यह पासवर्ड सार्वजनिक उल्लंघन में सामने आया है. कोई भिन्न चुनें.',
  'auth.password.requirements': 'कम से कम 12 अक्षर. लंबाई प्रतीकों से अधिक मायने रखती है।',
  'auth.username.label': 'उपयोगकर्ता नाम',
  'auth.username.help':
    'एक उपयोगकर्ता नाम आपको आपके मौजूदा ईमेल खाते में प्रवेश कराता है। यह कभी भी आपका पासवर्ड नहीं बदलता.',
  'auth.magicLink.send': 'मुझे एक साइन इन लिंक ईमेल करें',
  'auth.magicLink.sent':
    'यदि उस पते पर कोई खाता है, तो एक साइन इन लिंक भेजा जा रहा है। लिंक एक बार काम करता है और समाप्त हो जाता है {minutes, plural, one {# मिनट} other {# मिनट}}.',
  'auth.magicLink.checkEmail': 'अपना ईमेल जांचें',
  'auth.magicLink.resend': 'दूसरा लिंक भेजें',
  'auth.magicLink.resendIn':
    'आप दूसरा लिंक भेज सकते हैं {seconds, plural, one {# दूसरा} other {# सेकंड}}.',
  'auth.forgotPassword': 'अपना पासवर्ड भूल गए?',
  'auth.resetPassword.title': 'नया पासवर्ड चुनें',
  'auth.resetPassword.sent': 'यदि उस पते पर कोई खाता है, तो रीसेट निर्देश उनके रास्ते में हैं।',
  'auth.resetPassword.done': 'आपका पासवर्ड अपडेट हो गया है. इसके साथ साइन इन करें.',
  'auth.noAccount': 'अभी तक कोई खाता नहीं?',
  'auth.haveAccount': 'क्या आपके पास पहले से ही एक खाता है?',
  'auth.terms.accept':
    'जारी रखकर आप शर्तों और गोपनीयता नोटिस, संस्करण को स्वीकार करते हैं {version}.',
  'auth.terms.updated':
    'शर्तें बदल गईं {date}. जो परिवर्तन हुआ उसका सारांश पढ़ें, फिर जारी रखना स्वीकार करें।',

  'auth.mfa.title': 'दो कारक प्रमाणीकरण',
  'auth.mfa.enterCode': 'अपने प्रमाणक ऐप से छह अंकों का कोड दर्ज करें',
  'auth.mfa.recoveryCode': 'पुनर्प्राप्ति कोड का उपयोग करें',
  'auth.mfa.setupTitle': 'दो कारक प्रमाणीकरण सेट करें',
  'auth.mfa.setupScan': 'इस कोड को अपने प्रमाणक ऐप से स्कैन करें।',
  'auth.mfa.setupManual': 'या इस कुंजी को मैन्युअल रूप से दर्ज करें',
  'auth.mfa.recoveryCodes': 'पुनर्प्राप्ति कोड',
  'auth.mfa.recoveryCodesHelp':
    'इन्हें कहीं सुरक्षित रखें। यदि आप अपना उपकरण खो देते हैं तो प्रत्येक एक बार काम करता है।',
  'auth.mfa.requiredForAction': 'जारी रखने के लिए दो कारक प्रमाणीकरण की पुष्टि करें।',

  'auth.passkey.title': 'पासकीज़',
  'auth.passkey.add': 'एक पासकी जोड़ें',
  'auth.passkey.signIn': 'पासकी से साइन इन करें',
  'auth.passkey.added': 'पासकी ने जोड़ा {date}',

  'auth.session.expired': 'आपका सत्र समाप्त हो गया. जारी रखने के लिए फिर से साइन इन करें.',
  'auth.session.signedOut': 'आप साइन आउट हो गए हैं.',
  'auth.session.otherDevice': 'आपने किसी अन्य डिवाइस पर साइन इन किया है.',

  'auth.invite.title': '{inviter} तुम्हें आमंत्रित किया {workspace}',
  'auth.invite.accept': 'निमंत्रण स्वीकार करें',
  'auth.invite.declined': 'निमंत्रण अस्वीकार कर दिया गया.',
  'auth.invite.expired': 'यह आमंत्रण समाप्त हो गया. पूछो {inviter} एक और भेजने के लिए.',
  'auth.invite.roleNote': 'आप के रूप में शामिल होंगे {role}.',

  'auth.verifyEmail.title': 'अपने ईमेल की पुष्टि करें',
  'auth.verifyEmail.body': 'हमने एक पुष्टिकरण लिंक भेजा {email}.',
  'auth.verifyEmail.done': 'आपके ईमेल की पुष्टि हो गई है.',

  'auth.rateLimited':
    'बहुत अधिक प्रयास. पुनः प्रयास करें {minutes, plural, one {# मिनट} other {# मिनट}}.',
  'auth.genericFailure': 'वह काम नहीं आया. विवरण जांचें और पुनः प्रयास करें।',
} as const;
