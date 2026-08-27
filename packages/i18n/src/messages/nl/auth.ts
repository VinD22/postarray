/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Log in',
  'auth.signIn.subtitle': 'Publiceer, keur het goed en zie precies wat er is gebeurd.',
  'auth.signUp.title': 'Maak uw account aan',
  'auth.continueWithGoogle': 'Ga verder met Google',
  'auth.continueWithFacebook': 'Ga verder met Facebook',
  'auth.orUseEmail': 'Of gebruik uw e-mailadres',
  'auth.email.label': 'E-mail',
  'auth.email.placeholder': 'jij@bedrijf.com',
  'auth.password.label': 'Wachtwoord',
  'auth.password.show': 'Wachtwoord tonen',
  'auth.password.hide': 'Wachtwoord verbergen',
  'auth.password.strength.weak': 'Te gemakkelijk te raden',
  'auth.password.strength.fair': 'Kan sterker zijn',
  'auth.password.strength.strong': 'Sterk',
  'auth.password.breached':
    'Dit wachtwoord is verschenen bij een openbare inbreuk. Kies een andere.',
  'auth.password.requirements': 'Minimaal 12 tekens. Lengte is belangrijker dan symbolen.',
  'auth.username.label': 'Gebruikersnaam',
  'auth.username.help':
    'Met een gebruikersnaam logt u in op uw bestaande e-mailaccount. Het vervangt nooit uw wachtwoord.',
  'auth.magicLink.send': 'E-mail mij een inloglink',
  'auth.magicLink.sent':
    'Als dat adres een account heeft, wordt er een inloglink verzonden. De link werkt eenmalig en vervalt over {minutes, plural, one {# minuut} other {# minuten}}.',
  'auth.magicLink.checkEmail': 'Controleer uw e-mail',
  'auth.magicLink.resend': 'Stuur nog een link',
  'auth.magicLink.resendIn':
    'Je kunt nog een link sturen in {seconds, plural, one {# seconde} other {# seconden}}.',
  'auth.forgotPassword': 'Wachtwoord vergeten?',
  'auth.resetPassword.title': 'Kies een nieuw wachtwoord',
  'auth.resetPassword.sent': 'Als dat adres een account heeft, zijn er reset-instructies onderweg.',
  'auth.resetPassword.done': 'Uw wachtwoord is bijgewerkt. Log ermee in.',
  'auth.noAccount': 'Nog geen account?',
  'auth.haveAccount': 'Heeft u al een account?',
  'auth.terms.accept':
    'Als u doorgaat, accepteert u de voorwaarden en de privacyverklaring, versie {version}.',
  'auth.terms.updated':
    'De voorwaarden zijn gewijzigd op {date}. Lees de samenvatting van wat er is gewijzigd en accepteer vervolgens om door te gaan.',

  'auth.mfa.title': 'Tweefactorauthenticatie',
  'auth.mfa.enterCode': 'Voer de zescijferige code van uw authenticator-app in',
  'auth.mfa.recoveryCode': 'Gebruik een herstelcode',
  'auth.mfa.setupTitle': 'Stel tweefactorauthenticatie in',
  'auth.mfa.setupScan': 'Scan deze code met uw authenticator-app.',
  'auth.mfa.setupManual': 'Of voer deze sleutel handmatig in',
  'auth.mfa.recoveryCodes': 'Herstelcodes',
  'auth.mfa.recoveryCodesHelp':
    'Bewaar deze op een veilige plek. Ze werken allemaal één keer als u uw apparaat kwijtraakt.',
  'auth.mfa.requiredForAction': 'Bevestig met tweefactorauthenticatie om door te gaan.',

  'auth.passkey.title': 'Wachtwoorden',
  'auth.passkey.add': 'Voeg een toegangssleutel toe',
  'auth.passkey.signIn': 'Meld u aan met een toegangssleutel',
  'auth.passkey.added': 'Wachtwoord toegevoegd {date}',

  'auth.session.expired': 'Uw sessie is verlopen. Meld u opnieuw aan om door te gaan.',
  'auth.session.signedOut': 'U bent afgemeld.',
  'auth.session.otherDevice': 'Je hebt ingelogd op een ander apparaat.',

  'auth.invite.title': '{inviter} heeft je uitgenodigd voor {workspace}',
  'auth.invite.accept': 'Accepteer de uitnodiging',
  'auth.invite.declined': 'Uitnodiging afgewezen.',
  'auth.invite.expired': 'Deze uitnodiging is verlopen. Vraag {inviter} om er nog een te sturen.',
  'auth.invite.roleNote': 'Je wordt lid als {role}.',

  'auth.verifyEmail.title': 'Bevestig uw e-mail',
  'auth.verifyEmail.body': 'We hebben een bevestigingslink naar {email} gestuurd.',
  'auth.verifyEmail.done': 'Uw e-mailadres is bevestigd.',

  'auth.rateLimited':
    'Te veel pogingen. Probeer het opnieuw over {minutes, plural, one {# minuut} other {# minuten}}.',
  'auth.genericFailure': 'Dat werkte niet. Controleer de details en probeer het opnieuw.',
} as const;
