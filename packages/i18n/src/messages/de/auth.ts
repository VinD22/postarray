/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'anmelden',
  'auth.signIn.subtitle':
    'Veröffentlichen Sie, genehmigen Sie und sehen Sie genau, was passiert ist.',
  'auth.signUp.title': 'Erstellen Sie Ihr Konto',
  'auth.signUp.subtitle': 'Sieben Tage mit allen Features. 0 $ heute fällig.',
  'auth.continueWithGoogle': 'Weiter mit Google',
  'auth.continueWithFacebook': 'Weiter mit Facebook',
  'auth.orUseEmail': 'Oder nutzen Sie Ihre E-Mail',
  'auth.email.label': 'E-Mail',
  'auth.email.placeholder': 'you@company.com',
  'auth.password.label': 'Passwort',
  'auth.password.show': 'Passwort anzeigen',
  'auth.password.hide': 'Passwort verbergen',
  'auth.password.strength.weak': 'Zu leicht zu erraten',
  'auth.password.strength.fair': 'Könnte stärker sein',
  'auth.password.strength.strong': 'Stark',
  'auth.password.breached':
    'Dieses Passwort ist bei einem öffentlichen Verstoß aufgetaucht. Wählen Sie ein anderes.',
  'auth.password.requirements': 'Mindestens 12 Zeichen. Länge ist wichtiger als Symbole.',
  'auth.username.label': 'Benutzername',
  'auth.username.help':
    'Mit einem Benutzernamen werden Sie bei Ihrem bestehenden E-Mail-Konto angemeldet. Es ersetzt niemals Ihr Passwort.',
  'auth.magicLink.send': 'Schicken Sie mir einen Anmeldelink per E-Mail',
  'auth.magicLink.sent':
    'Wenn diese Adresse über ein Konto verfügt, ist ein Anmeldelink unterwegs. Der Link funktioniert einmal und läuft in {minutes, plural, one {# Minute} other {# Minuten}} ab.',
  'auth.magicLink.checkEmail': 'Überprüfen Sie Ihre E-Mails',
  'auth.magicLink.resend': 'Senden Sie einen weiteren Link',
  'auth.magicLink.resendIn':
    'Sie können einen weiteren Link in {seconds, plural, one {# Sekunde} other {# Sekunden}} senden.',
  'auth.forgotPassword': 'Passwort vergessen?',
  'auth.resetPassword.title': 'Wählen Sie ein neues Passwort',
  'auth.resetPassword.sent':
    'Wenn diese Adresse über ein Konto verfügt, sind Anweisungen zum Zurücksetzen unterwegs.',
  'auth.resetPassword.done': 'Ihr Passwort wurde aktualisiert. Melden Sie sich damit an.',
  'auth.noAccount': 'Noch kein Konto?',
  'auth.haveAccount': 'Sie haben bereits ein Konto?',
  'auth.terms.accept':
    'Indem Sie fortfahren, akzeptieren Sie die Bedingungen und die Datenschutzerklärung, Version {version}.',
  'auth.terms.updated':
    'Die Bedingungen wurden am {date} geändert. Lesen Sie die Zusammenfassung der Änderungen und akzeptieren Sie dann, um fortzufahren.',

  'auth.mfa.title': 'Zwei-Faktor-Authentifizierung',
  'auth.mfa.enterCode': 'Geben Sie den sechsstelligen Code aus Ihrer Authentifizierungs-App ein',
  'auth.mfa.recoveryCode': 'Verwenden Sie einen Wiederherstellungscode',
  'auth.mfa.setupTitle': 'Richten Sie eine Zwei-Faktor-Authentifizierung ein',
  'auth.mfa.setupScan': 'Scannen Sie diesen Code mit Ihrer Authentifizierungs-App.',
  'auth.mfa.setupManual': 'Oder geben Sie diesen Schlüssel manuell ein',
  'auth.mfa.recoveryCodes': 'Wiederherstellungscodes',
  'auth.mfa.recoveryCodesHelp':
    'Bewahren Sie diese an einem sicheren Ort auf. Jeder funktioniert einmal, wenn Sie Ihr Gerät verlieren.',
  'auth.mfa.requiredForAction':
    'Bestätigen Sie mit der Zwei-Faktor-Authentifizierung, um fortzufahren.',

  'auth.passkey.title': 'Passschlüssel',
  'auth.passkey.add': 'Fügen Sie einen Passkey hinzu',
  'auth.passkey.signIn': 'Melden Sie sich mit einem Passkey an',
  'auth.passkey.added': 'Passkey hinzugefügt {date}',

  'auth.session.expired':
    'Ihre Sitzung ist abgelaufen. Melden Sie sich erneut an, um fortzufahren.',
  'auth.session.signedOut': 'Sie sind abgemeldet.',
  'auth.session.otherDevice': 'Sie haben sich auf einem anderen Gerät angemeldet.',

  'auth.invite.title': '{inviter} hat Sie eingeladen zu {workspace}',
  'auth.invite.accept': 'Einladung annehmen',
  'auth.invite.declined': 'Einladung abgelehnt.',
  'auth.invite.expired':
    'Diese Einladung ist abgelaufen. Bitten Sie {inviter}, ein weiteres zu senden.',
  'auth.invite.roleNote': 'Sie werden als {role} beitreten.',

  'auth.verifyEmail.title': 'Bestätigen Sie Ihre E-Mail',
  'auth.verifyEmail.body': 'Wir haben einen Bestätigungslink an {email} gesendet.',
  'auth.verifyEmail.done': 'Ihre E-Mail wurde bestätigt.',

  'auth.rateLimited':
    'Zu viele Versuche. Versuchen Sie es erneut in {minutes, plural, one {# Minute} other {# Minuten}}.',
  'auth.genericFailure':
    'Das hat nicht funktioniert. Überprüfen Sie die Details und versuchen Sie es erneut.',
} as const;
