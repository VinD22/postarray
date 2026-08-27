/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Logga in',
  'auth.signIn.subtitle': 'Publicera, godkänn och se exakt vad som hände.',
  'auth.signUp.title': 'Skapa ditt konto',
  'auth.continueWithGoogle': 'Fortsätt med Google',
  'auth.continueWithFacebook': 'Fortsätt med Facebook',
  'auth.orUseEmail': 'Eller använd din e-post',
  'auth.email.label': 'E-post',
  'auth.email.placeholder': 'du@företag.com',
  'auth.password.label': 'Lösenord',
  'auth.password.show': 'Visa lösenord',
  'auth.password.hide': 'Dölj lösenord',
  'auth.password.strength.weak': 'För lätt att gissa',
  'auth.password.strength.fair': 'Kunde vara starkare',
  'auth.password.strength.strong': 'Stark',
  'auth.password.breached': 'Detta lösenord har dykt upp i ett offentligt intrång. Välj en annan.',
  'auth.password.requirements': 'Minst 12 tecken. Längden är viktigare än symboler.',
  'auth.username.label': 'Användarnamn',
  'auth.username.help':
    'Ett användarnamn loggar in dig på ditt befintliga e-postkonto. Det ersätter aldrig ditt lösenord.',
  'auth.magicLink.send': 'Maila mig en inloggningslänk',
  'auth.magicLink.sent':
    'Om den adressen har ett konto är en inloggningslänk på väg. Länken fungerar en gång och upphör om {minutes, plural, one {# minut} other {# minuter}}.',
  'auth.magicLink.checkEmail': 'Kontrollera din e-post',
  'auth.magicLink.resend': 'Skicka en annan länk',
  'auth.magicLink.resendIn':
    'Du kan skicka en annan länk om {seconds, plural, one {# sekund} other {# sekunder}}.',
  'auth.forgotPassword': 'Glömt ditt lösenord?',
  'auth.resetPassword.title': 'Välj ett nytt lösenord',
  'auth.resetPassword.sent': 'Om den adressen har ett konto är återställningsinstruktioner på väg.',
  'auth.resetPassword.done': 'Ditt lösenord är uppdaterat. Logga in med den.',
  'auth.noAccount': 'Inget konto ännu?',
  'auth.haveAccount': 'Har du redan ett konto?',
  'auth.terms.accept':
    'By continuing you accept the Terms and the Privacy Notice, version {version}.',
  'auth.terms.updated':
    'The Terms changed on {date}. Read the summary of what changed, then accept to continue.',

  'auth.mfa.title': 'Tvåfaktorsautentisering',
  'auth.mfa.enterCode': 'Ange den sexsiffriga koden från din autentiseringsapp',
  'auth.mfa.recoveryCode': 'Använd en återställningskod',
  'auth.mfa.setupTitle': 'Ställ in tvåfaktorsautentisering',
  'auth.mfa.setupScan': 'Skanna den här koden med din autentiseringsapp.',
  'auth.mfa.setupManual': 'Eller skriv in denna nyckel manuellt',
  'auth.mfa.recoveryCodes': 'Återställningskoder',
  'auth.mfa.recoveryCodesHelp':
    'Förvara dessa på ett säkert ställe. Var och en fungerar en gång om du tappar bort din enhet.',
  'auth.mfa.requiredForAction': 'Bekräfta med tvåfaktorsautentisering för att fortsätta.',

  'auth.passkey.title': 'Nyckelnycklar',
  'auth.passkey.add': 'Lägg till ett lösenord',
  'auth.passkey.signIn': 'Logga in med ett lösenord',
  'auth.passkey.added': 'Nyckel har lagts till {date}',

  'auth.session.expired': 'Din session har löpt ut. Logga in igen för att fortsätta.',
  'auth.session.signedOut': 'Du är utloggad.',
  'auth.session.otherDevice': 'Du loggade in på en annan enhet.',

  'auth.invite.title': '{inviter} bjöd in dig till {workspace}',
  'auth.invite.accept': 'Acceptera inbjudan',
  'auth.invite.declined': 'Inbjudan avvisades.',
  'auth.invite.expired': 'Denna inbjudan har upphört att gälla. Be {inviter} att skicka en till.',
  'auth.invite.roleNote': 'Du går med som {role}.',

  'auth.verifyEmail.title': 'Bekräfta din e-post',
  'auth.verifyEmail.body': 'Vi skickade en bekräftelselänk till {email}.',
  'auth.verifyEmail.done': 'Din e-post är bekräftad.',

  'auth.rateLimited':
    'För många försök. Försök igen om {minutes, plural, one {# minut} other {# minuter}}.',
  'auth.genericFailure': 'Det fungerade inte. Kontrollera detaljerna och försök igen.',
} as const;
