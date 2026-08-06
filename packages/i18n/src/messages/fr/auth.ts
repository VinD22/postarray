/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Se connecter',
  'auth.signIn.subtitle': 'Publiez, approuvez et voyez exactement ce qui s’est passé.',
  'auth.signUp.title': 'Créez votre compte',
  'auth.signUp.subtitle': "Sept jours avec toutes les fonctionnalités. 0 $ à payer aujourd'hui.",
  'auth.continueWithGoogle': 'Continuer avec Google',
  'auth.continueWithFacebook': 'Continuer avec Facebook',
  'auth.orUseEmail': 'Ou utilisez votre email',
  'auth.email.label': 'E-mail',
  'auth.email.placeholder': 'vous@entreprise.com',
  'auth.password.label': 'Mot de passe',
  'auth.password.show': 'Afficher le mot de passe',
  'auth.password.hide': 'Masquer le mot de passe',
  'auth.password.strength.weak': 'Trop facile à deviner',
  'auth.password.strength.fair': 'Pourrait être plus fort',
  'auth.password.strength.strong': 'Fort',
  'auth.password.breached':
    "Ce mot de passe est apparu lors d'une violation publique. Choisissez-en un autre.",
  'auth.password.requirements': 'Au moins 12 caractères. La longueur compte plus que les symboles.',
  'auth.username.label': "Nom d'utilisateur",
  'auth.username.help':
    "Un nom d'utilisateur vous connecte à votre compte de messagerie existant. Il ne remplace jamais votre mot de passe.",
  'auth.magicLink.send': 'Envoyez-moi un lien de connexion par e-mail',
  'auth.magicLink.sent':
    'Si cette adresse possède un compte, un lien de connexion est en route. Le lien fonctionne une fois et expire dans {minutes, plural, one {# minute} many {# minutes} other {# minutes}}.',
  'auth.magicLink.checkEmail': 'Vérifiez votre courrier électronique',
  'auth.magicLink.resend': 'Envoyer un autre lien',
  'auth.magicLink.resendIn':
    'Vous pouvez envoyer un autre lien dans {seconds, plural, one {# deuxième} many {# secondes} other {# secondes}}.',
  'auth.forgotPassword': 'Vous avez oublié votre mot de passe ?',
  'auth.resetPassword.title': 'Choisissez un nouveau mot de passe',
  'auth.resetPassword.sent':
    'Si cette adresse possède un compte, des instructions de réinitialisation sont en cours.',
  'auth.resetPassword.done': 'Votre mot de passe est mis à jour. Connectez-vous avec.',
  'auth.noAccount': 'Pas encore de compte ?',
  'auth.haveAccount': 'Vous avez déjà un compte ?',
  'auth.terms.accept':
    "En continuant, vous acceptez les Conditions et l'Avis de confidentialité, version {version}.",
  'auth.terms.updated':
    'Les conditions ont changé le {date}. Lisez le résumé de ce qui a changé, puis acceptez de continuer.',

  'auth.mfa.title': 'Authentification à deux facteurs',
  'auth.mfa.enterCode': "Entrez le code à six chiffres de votre application d'authentification",
  'auth.mfa.recoveryCode': 'Utiliser un code de récupération',
  'auth.mfa.setupTitle': "Configurer l'authentification à deux facteurs",
  'auth.mfa.setupScan': "Scannez ce code avec votre application d'authentification.",
  'auth.mfa.setupManual': 'Ou entrez cette clé manuellement',
  'auth.mfa.recoveryCodes': 'Codes de récupération',
  'auth.mfa.recoveryCodesHelp':
    'Conservez-les dans un endroit sûr. Chacun fonctionne une fois si vous perdez votre appareil.',
  'auth.mfa.requiredForAction': "Confirmez avec l'authentification à deux facteurs pour continuer.",

  'auth.passkey.title': 'Mots-clés',
  'auth.passkey.add': 'Ajouter un mot de passe',
  'auth.passkey.signIn': 'Connectez-vous avec un mot de passe',
  'auth.passkey.added': "Clé d'accès ajoutée {date}",

  'auth.session.expired': 'Votre session a expiré. Connectez-vous à nouveau pour continuer.',
  'auth.session.signedOut': 'Vous êtes déconnecté.',
  'auth.session.otherDevice': 'Vous vous êtes connecté sur un autre appareil.',

  'auth.invite.title': '{inviter} vous a invité à {workspace}',
  'auth.invite.accept': "Accepter l'invitation",
  'auth.invite.declined': 'Invitation refusée.',
  'auth.invite.expired': 'Cette invitation a expiré. Demander {inviter} pour en envoyer un autre.',
  'auth.invite.roleNote': 'Vous rejoindrez en tant que {role}.',

  'auth.verifyEmail.title': 'Confirmez votre email',
  'auth.verifyEmail.body': 'Nous avons envoyé un lien de confirmation à {email}.',
  'auth.verifyEmail.done': 'Votre email est confirmé.',

  'auth.rateLimited':
    'Trop de tentatives. Réessayez dans {minutes, plural, one {# minute} many {# minutes} other {# minutes}}.',
  'auth.genericFailure': "Cela n'a pas fonctionné. Vérifiez les détails et réessayez.",
} as const;
