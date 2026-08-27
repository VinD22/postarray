/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Přihlásit se',
  'auth.signIn.subtitle': 'Publikujte, schvalujte a sledujte, co se přesně stalo.',
  'auth.signUp.title': 'Vytvořte si účet',
  'auth.continueWithGoogle': 'Pokračovat s Google',
  'auth.continueWithFacebook': 'Pokračovat na Facebooku',
  'auth.orUseEmail': 'Nebo použijte svůj e-mail',
  'auth.email.label': 'E-mail',
  'auth.email.placeholder': 'vy@společnost.com',
  'auth.password.label': 'Heslo',
  'auth.password.show': 'Zobrazit heslo',
  'auth.password.hide': 'Skrýt heslo',
  'auth.password.strength.weak': 'Příliš snadné uhodnout',
  'auth.password.strength.fair': 'Mohl by být silnější',
  'auth.password.strength.strong': 'Silný',
  'auth.password.breached': 'Toto heslo se objevilo při veřejném porušení. Vyberte si jiný.',
  'auth.password.requirements': 'Minimálně 12 znaků. Na délce záleží víc než na symbolech.',
  'auth.username.label': 'Uživatelské jméno',
  'auth.username.help':
    'Uživatelské jméno vás přihlásí k vašemu stávajícímu e-mailovému účtu. Nikdy nenahradí vaše heslo.',
  'auth.magicLink.send': 'Pošlete mi e-mailem odkaz na přihlášení',
  'auth.magicLink.sent':
    'Pokud má tato adresa účet, je na cestě odkaz pro přihlášení. Odkaz funguje jednou a jeho platnost vyprší za {minutes, plural, one {# minuta} other {# minuty} few {# minuty} many {# minuty}}.',
  'auth.magicLink.checkEmail': 'Zkontrolujte svůj e-mail',
  'auth.magicLink.resend': 'Poslat další odkaz',
  'auth.magicLink.resendIn':
    'Další odkaz můžete poslat v {seconds, plural, one {# sekunda} other {# sekund} few {# sekund} many {# sekund}}.',
  'auth.forgotPassword': 'Zapomněli jste heslo?',
  'auth.resetPassword.title': 'Zvolte nové heslo',
  'auth.resetPassword.sent': 'Pokud má tato adresa účet, pokyny k resetování jsou na cestě.',
  'auth.resetPassword.done': 'Vaše heslo je aktualizováno. Přihlaste se s ním.',
  'auth.noAccount': 'Zatím nemáte účet?',
  'auth.haveAccount': 'Už máte účet?',
  'auth.terms.accept':
    'Pokračováním přijímáte podmínky a oznámení o ochraně osobních údajů, verze {version}.',
  'auth.terms.updated':
    'Podmínky se změnily dne {date}. Přečtěte si shrnutí toho, co se změnilo, a poté pokračujte v přijímání.',

  'auth.mfa.title': 'Dvoufaktorové ověření',
  'auth.mfa.enterCode': 'Zadejte šestimístný kód z vaší ověřovací aplikace',
  'auth.mfa.recoveryCode': 'Použijte kód pro obnovení',
  'auth.mfa.setupTitle': 'Nastavte dvoufaktorové ověřování',
  'auth.mfa.setupScan': 'Naskenujte tento kód pomocí vaší ověřovací aplikace.',
  'auth.mfa.setupManual': 'Nebo zadejte tento klíč ručně',
  'auth.mfa.recoveryCodes': 'Kódy pro obnovení',
  'auth.mfa.recoveryCodesHelp':
    'Uložte je na bezpečném místě. Každý z nich funguje jednou, pokud ztratíte zařízení.',
  'auth.mfa.requiredForAction': 'Pro pokračování potvrďte dvoufaktorovou autentizací.',

  'auth.passkey.title': 'Heslové klíče',
  'auth.passkey.add': 'Přidat přístupový klíč',
  'auth.passkey.signIn': 'Přihlaste se pomocí přístupového klíče',
  'auth.passkey.added': 'Byl přidán přístupový klíč {date}',

  'auth.session.expired': 'Platnost vaší relace vypršela. Pro pokračování se znovu přihlaste.',
  'auth.session.signedOut': 'Jste odhlášeni.',
  'auth.session.otherDevice': 'Přihlásili jste se na jiném zařízení.',

  'auth.invite.title': '{inviter} vás pozval na {workspace}',
  'auth.invite.accept': 'Přijmout pozvání',
  'auth.invite.declined': 'Pozvánka odmítnuta.',
  'auth.invite.expired': 'Platnost této pozvánky vypršela. Zeptejte se {inviter} poslat další.',
  'auth.invite.roleNote': 'Připojíte se jako {role}.',

  'auth.verifyEmail.title': 'Potvrďte svůj e-mail',
  'auth.verifyEmail.body': 'Poslali jsme potvrzovací odkaz na {email}.',
  'auth.verifyEmail.done': 'Váš e-mail je potvrzen.',

  'auth.rateLimited':
    'Příliš mnoho pokusů. Zkuste to znovu v {minutes, plural, one {# minuta} other {# minuty} few {# minuty} many {# minuty}}.',
  'auth.genericFailure': 'To nefungovalo. Zkontrolujte podrobnosti a zkuste to znovu.',
} as const;
