/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Sign in',
  'auth.signIn.subtitle': 'Publish, approve and see exactly what happened.',
  'auth.signUp.title': 'Create your account',
  'auth.signUp.subtitle': 'Seven days with every feature. $0 due today.',
  'auth.continueWithGoogle': 'Continue with Google',
  'auth.continueWithFacebook': 'Continue with Facebook',
  'auth.orUseEmail': 'Or use your email',
  'auth.email.label': 'Email',
  'auth.email.placeholder': 'you@company.com',
  'auth.password.label': 'Password',
  'auth.password.show': 'Show password',
  'auth.password.hide': 'Hide password',
  'auth.password.strength.weak': 'Too easy to guess',
  'auth.password.strength.fair': 'Could be stronger',
  'auth.password.strength.strong': 'Strong',
  'auth.password.breached':
    'This password has appeared in a public breach. Choose a different one.',
  'auth.password.requirements': 'At least 12 characters. Length matters more than symbols.',
  'auth.username.label': 'Username',
  'auth.username.help':
    'A username signs you in to your existing email account. It never replaces your password.',
  'auth.magicLink.send': 'Email me a sign in link',
  'auth.magicLink.sent':
    'If that address has an account, a sign in link is on its way. The link works once and expires in {minutes, plural, one {# minute} other {# minutes}}.',
  'auth.magicLink.checkEmail': 'Check your email',
  'auth.magicLink.resend': 'Send another link',
  'auth.magicLink.resendIn':
    'You can send another link in {seconds, plural, one {# second} other {# seconds}}.',
  'auth.forgotPassword': 'Forgot your password?',
  'auth.resetPassword.title': 'Choose a new password',
  'auth.resetPassword.sent': 'If that address has an account, reset instructions are on their way.',
  'auth.resetPassword.done': 'Your password is updated. Sign in with it.',
  'auth.noAccount': 'No account yet?',
  'auth.haveAccount': 'Already have an account?',
  'auth.terms.accept':
    'By continuing you accept the Terms and the Privacy Notice, version {version}.',
  'auth.terms.updated':
    'The Terms changed on {date}. Read the summary of what changed, then accept to continue.',

  'auth.mfa.title': 'Two factor authentication',
  'auth.mfa.enterCode': 'Enter the six digit code from your authenticator app',
  'auth.mfa.recoveryCode': 'Use a recovery code',
  'auth.mfa.setupTitle': 'Set up two factor authentication',
  'auth.mfa.setupScan': 'Scan this code with your authenticator app.',
  'auth.mfa.setupManual': 'Or enter this key manually',
  'auth.mfa.recoveryCodes': 'Recovery codes',
  'auth.mfa.recoveryCodesHelp':
    'Store these somewhere safe. Each one works once if you lose your device.',
  'auth.mfa.requiredForAction': 'Confirm with two factor authentication to continue.',

  'auth.passkey.title': 'Passkeys',
  'auth.passkey.add': 'Add a passkey',
  'auth.passkey.signIn': 'Sign in with a passkey',
  'auth.passkey.added': 'Passkey added {date}',

  'auth.session.expired': 'Your session expired. Sign in again to continue.',
  'auth.session.signedOut': 'You are signed out.',
  'auth.session.otherDevice': 'You signed in on another device.',

  'auth.invite.title': '{inviter} invited you to {workspace}',
  'auth.invite.accept': 'Accept invitation',
  'auth.invite.declined': 'Invitation declined.',
  'auth.invite.expired': 'This invitation expired. Ask {inviter} to send another one.',
  'auth.invite.roleNote': 'You will join as {role}.',

  'auth.verifyEmail.title': 'Confirm your email',
  'auth.verifyEmail.body': 'We sent a confirmation link to {email}.',
  'auth.verifyEmail.done': 'Your email is confirmed.',

  'auth.rateLimited':
    'Too many attempts. Try again in {minutes, plural, one {# minute} other {# minutes}}.',
  'auth.genericFailure': 'That did not work. Check the details and try again.',
} as const;
