export const emailMessages = {
  'email.invitation.subject': 'Vous avez été invité à {workspaceName}',
  'email.invitation.body':
    "Vous avez été invité à {workspaceName} avec le rôle {role}. Acceptez l'invitation ici : {invitationUrl}. Ce lien expire le {expiresAt}.",
  'email.oauth_redirect_changed.subject': 'Les paramètres de connexion ont changé pour {appName}',
  'email.oauth_redirect_changed.body':
    "Les adresses de redirection approuvées pour {appName} ont changé. Vérifiez l'application dans les paramètres de votre workspace si vous ne vous y attendiez pas.",
} as const;
