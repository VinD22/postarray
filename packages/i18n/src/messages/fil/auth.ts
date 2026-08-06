/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Mag-sign in',
  'auth.signIn.subtitle': 'I-publish, aprubahan at tingnan kung ano mismo ang nangyari.',
  'auth.signUp.title': 'Lumikha ng iyong account',
  'auth.signUp.subtitle': 'Pitong araw sa bawat tampok. $0 na dapat bayaran ngayon.',
  'auth.continueWithGoogle': 'Magpatuloy sa Google',
  'auth.continueWithFacebook': 'Magpatuloy sa Facebook',
  'auth.orUseEmail': 'O gamitin ang iyong email',
  'auth.email.label': 'Email',
  'auth.email.placeholder': 'you@company.com',
  'auth.password.label': 'Password',
  'auth.password.show': 'Ipakita ang password',
  'auth.password.hide': 'Itago ang password',
  'auth.password.strength.weak': 'Masyadong madaling hulaan',
  'auth.password.strength.fair': 'Maaaring mas malakas',
  'auth.password.strength.strong': 'Malakas',
  'auth.password.breached':
    'Ang password na ito ay lumitaw sa isang pampublikong paglabag. Pumili ng iba.',
  'auth.password.requirements':
    'Hindi bababa sa 12 character. Ang haba ay mas mahalaga kaysa sa mga simbolo.',
  'auth.username.label': 'Username',
  'auth.username.help':
    'Sina-sign in ka ng isang username sa iyong umiiral nang email account. Hindi nito pinapalitan ang iyong password.',
  'auth.magicLink.send': 'Mag-email sa akin ng link sa pag-sign in',
  'auth.magicLink.sent':
    'Kung may account ang address na iyon, may paparating na link sa pag-sign in. Gumagana ang link nang isang beses at mag-e-expire sa {minutes, plural, one {# minuto} other {# minuto}}.',
  'auth.magicLink.checkEmail': 'Suriin ang iyong email',
  'auth.magicLink.resend': 'Magpadala ng isa pang link',
  'auth.magicLink.resendIn':
    'Maaari kang magpadala ng isa pang link {seconds, plural, one {# pangalawa} other {# segundo}}.',
  'auth.forgotPassword': 'Nakalimutan ang iyong password?',
  'auth.resetPassword.title': 'Pumili ng bagong password',
  'auth.resetPassword.sent':
    'Kung may account ang address na iyon, paparating na ang mga tagubilin sa pag-reset.',
  'auth.resetPassword.done': 'Ang iyong password ay na-update. Mag-sign in gamit ito.',
  'auth.noAccount': 'Wala pang account?',
  'auth.haveAccount': 'Mayroon ka nang account?',
  'auth.terms.accept':
    'By continuing you accept the Terms and the Privacy Notice, version {version}.',
  'auth.terms.updated':
    'The Terms changed on {date}. Read the summary of what changed, then accept to continue.',

  'auth.mfa.title': 'Dalawang kadahilanan na pagpapatunay',
  'auth.mfa.enterCode': 'Ilagay ang anim na digit na code mula sa iyong authenticator app',
  'auth.mfa.recoveryCode': 'Gumamit ng recovery code',
  'auth.mfa.setupTitle': 'I-set up ang two-factor na pagpapatotoo',
  'auth.mfa.setupScan': 'I-scan ang code na ito gamit ang iyong authenticator app.',
  'auth.mfa.setupManual': 'O ipasok ang key na ito nang manu-mano',
  'auth.mfa.recoveryCodes': 'Mga code sa pagbawi',
  'auth.mfa.recoveryCodesHelp':
    'Itabi ang mga ito sa isang lugar na ligtas. Gumagana ang bawat isa nang isang beses kung mawala mo ang iyong device.',
  'auth.mfa.requiredForAction':
    'Kumpirmahin gamit ang dalawang salik na pagpapatotoo upang magpatuloy.',

  'auth.passkey.title': 'Mga passkey',
  'auth.passkey.add': 'Magdagdag ng passkey',
  'auth.passkey.signIn': 'Mag-sign in gamit ang isang passkey',
  'auth.passkey.added': 'Idinagdag ang passkey {date}',

  'auth.session.expired': 'Nag-expire ang iyong session. Mag-sign in muli upang magpatuloy.',
  'auth.session.signedOut': 'Naka-sign out ka.',
  'auth.session.otherDevice': 'Nag-sign in ka sa ibang device.',

  'auth.invite.title': '{inviter} iniimbitahan ka {workspace}',
  'auth.invite.accept': 'Tanggapin ang imbitasyon',
  'auth.invite.declined': 'Tinanggihan ang imbitasyon.',
  'auth.invite.expired':
    'Nag-expire ang imbitasyong ito. Magtanong {inviter} para magpadala ng isa pa.',
  'auth.invite.roleNote': 'Sasali ka bilang {role}.',

  'auth.verifyEmail.title': 'Kumpirmahin ang iyong email',
  'auth.verifyEmail.body': 'Nagpadala kami ng link ng kumpirmasyon sa {email}.',
  'auth.verifyEmail.done': 'Nakumpirma ang iyong email.',

  'auth.rateLimited':
    'Masyadong maraming pagtatangka. Subukan muli sa {minutes, plural, one {# minuto} other {# minuto}}.',
  'auth.genericFailure': 'Hindi iyon gumana. Suriin ang mga detalye at subukang muli.',
} as const;
