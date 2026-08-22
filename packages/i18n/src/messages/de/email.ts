export const emailMessages = {
  'email.invitation.subject': 'Du wurdest zu {workspaceName} eingeladen',
  'email.invitation.body':
    'Du wurdest zu {workspaceName} mit der Rolle {role} eingeladen. Nimm die Einladung hier an: {invitationUrl}. Dieser Link läuft am {expiresAt} ab.',
  'email.oauth_redirect_changed.subject':
    'Die Anmeldeeinstellungen für {appName} haben sich geändert',
  'email.oauth_redirect_changed.body':
    'Die genehmigten Weiterleitungsadressen für {appName} haben sich geändert. Überprüfe die Anwendung in deinen Workspace-Einstellungen, falls du das nicht erwartet hast.',
} as const;
