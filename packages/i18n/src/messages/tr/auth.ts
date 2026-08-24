/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Oturum aç',
  'auth.signIn.subtitle': 'Yayınlayın, onaylayın ve tam olarak ne olduğunu görün.',
  'auth.signUp.title': 'Hesabınızı oluşturun',
  'auth.continueWithGoogle': 'Google ile devam et',
  'auth.continueWithFacebook': "Facebook'la devam et",
  'auth.orUseEmail': 'Veya e-postanızı kullanın',
  'auth.email.label': 'E-posta',
  'auth.email.placeholder': 'sen@şirket.com',
  'auth.password.label': 'Şifre',
  'auth.password.show': 'Şifreyi göster',
  'auth.password.hide': 'Şifreyi gizle',
  'auth.password.strength.weak': 'Tahmin etmek çok kolay',
  'auth.password.strength.fair': 'Daha güçlü olabilir',
  'auth.password.strength.strong': 'Güçlü',
  'auth.password.breached': 'Bu şifre genel bir ihlalde ortaya çıktı. Farklı bir tane seçin.',
  'auth.password.requirements': 'En az 12 karakter. Uzunluk sembollerden daha önemlidir.',
  'auth.username.label': 'Kullanıcı adı',
  'auth.username.help':
    'Kullanıcı adı, mevcut e-posta hesabınızda oturum açmanızı sağlar. Hiçbir zaman şifrenizin yerine geçmez.',
  'auth.magicLink.send': 'Bana bir oturum açma bağlantısını e-postayla gönder',
  'auth.magicLink.sent':
    'Bu adresin bir hesabı varsa oturum açma bağlantısı yoldadır. Bağlantı bir kez çalışır ve süresi {minutes, plural, one {# dakika} other {# dakika}} içinde dolar.',
  'auth.magicLink.checkEmail': 'E-postanızı kontrol edin',
  'auth.magicLink.resend': 'Başka bir bağlantı gönder',
  'auth.magicLink.resendIn':
    '{seconds, plural, one {# saniye} other {# saniye}} içinde başka bir bağlantı gönderebilirsiniz.',
  'auth.forgotPassword': 'Şifrenizi mi unuttunuz?',
  'auth.resetPassword.title': 'Yeni bir şifre seçin',
  'auth.resetPassword.sent': 'Bu adresin bir hesabı varsa sıfırlama talimatları yoldadır.',
  'auth.resetPassword.done': 'Şifreniz güncellendi. Onunla oturum açın.',
  'auth.noAccount': 'Henüz hesabınız yok mu?',
  'auth.haveAccount': 'Zaten bir hesabınız var mı?',
  'auth.terms.accept':
    'By continuing you accept the Terms and the Privacy Notice, version {version}.',
  'auth.terms.updated':
    'The Terms changed on {date}. Read the summary of what changed, then accept to continue.',

  'auth.mfa.title': 'İki faktörlü kimlik doğrulama',
  'auth.mfa.enterCode': 'Kimlik doğrulayıcı uygulamanızdan altı haneli kodu girin',
  'auth.mfa.recoveryCode': 'Kurtarma kodu kullanın',
  'auth.mfa.setupTitle': 'İki faktörlü kimlik doğrulamayı ayarlayın',
  'auth.mfa.setupScan': 'Bu kodu kimlik doğrulayıcı uygulamanızla tarayın.',
  'auth.mfa.setupManual': 'Veya bu anahtarı manuel olarak girin',
  'auth.mfa.recoveryCodes': 'Kurtarma kodları',
  'auth.mfa.recoveryCodesHelp':
    'Bunları güvenli bir yerde saklayın. Cihazınızı kaybederseniz her biri bir kez çalışır.',
  'auth.mfa.requiredForAction': 'Devam etmek için iki faktörlü kimlik doğrulamayla onaylayın.',

  'auth.passkey.title': 'Geçiş anahtarları',
  'auth.passkey.add': 'Bir şifre anahtarı ekleyin',
  'auth.passkey.signIn': 'Şifre anahtarıyla oturum açın',
  'auth.passkey.added': 'Şifre eklendi {date}',

  'auth.session.expired': 'Oturumunuzun süresi doldu. Devam etmek için tekrar oturum açın.',
  'auth.session.signedOut': 'Oturumunuz kapatıldı.',
  'auth.session.otherDevice': 'Başka bir cihazda oturum açtınız.',

  'auth.invite.title': "{inviter} sizi {workspace}'e davet etti",
  'auth.invite.accept': 'Daveti kabul et',
  'auth.invite.declined': 'Davet reddedildi.',
  'auth.invite.expired':
    "Bu davetiyenin süresi doldu. {inviter}'dan bir tane daha göndermesini isteyin.",
  'auth.invite.roleNote': '{role} olarak katılacaksınız.',

  'auth.verifyEmail.title': 'E-postanızı onaylayın',
  'auth.verifyEmail.body': "{email}'a onay linki gönderdik.",
  'auth.verifyEmail.done': 'E-postanız onaylandı.',

  'auth.rateLimited':
    'Çok fazla deneme. {minutes, plural, one {# dakika} other {# dakika}} sonra tekrar deneyin.',
  'auth.genericFailure': 'Bu işe yaramadı. Ayrıntıları kontrol edip tekrar deneyin.',
} as const;
