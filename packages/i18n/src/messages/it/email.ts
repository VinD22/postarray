export const emailMessages = {
  'email.invitation.subject': 'Sei stato invitato a {workspaceName}',
  'email.invitation.body':
    "Sei stato invitato a {workspaceName} con il ruolo {role}. Accetta l'invito qui: {invitationUrl}. Questo link scade il {expiresAt}.",
  'email.oauth_redirect_changed.subject': 'Le impostazioni di accesso sono cambiate per {appName}',
  'email.oauth_redirect_changed.body':
    "Gli indirizzi di reindirizzamento approvati per {appName} sono cambiati. Controlla l'applicazione nelle impostazioni dell'area di lavoro se non te lo aspettavi.",
} as const;
