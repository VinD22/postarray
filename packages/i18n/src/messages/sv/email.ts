export const emailMessages = {
  'email.invitation.subject': 'Du blev inbjuden till {workspaceName}',
  'email.invitation.body':
    'Du blev inbjuden till {workspaceName} med rollen {role}. Acceptera inbjudan här: {invitationUrl}. Länken slutar gälla {expiresAt}.',
  'email.oauth_redirect_changed.subject': 'Inloggningsinställningarna ändrades för {appName}',
  'email.oauth_redirect_changed.body':
    'De godkända omdirigeringsadresserna för {appName} har ändrats. Granska applikationen i dina arbetsyteinställningar om du inte väntade dig detta.',
} as const;
