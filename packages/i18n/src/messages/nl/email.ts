export const emailMessages = {
  'email.invitation.subject': 'Je bent uitgenodigd voor {workspaceName}',
  'email.invitation.body':
    'Je bent uitgenodigd voor {workspaceName} met de rol {role}. Accepteer de uitnodiging hier: {invitationUrl}. Deze link verloopt op {expiresAt}.',
  'email.oauth_redirect_changed.subject': 'Aanmeldinstellingen gewijzigd voor {appName}',
  'email.oauth_redirect_changed.body':
    'De goedgekeurde omleidingsadressen voor {appName} zijn gewijzigd. Controleer de toepassing in je werkruimte-instellingen als je dit niet verwachtte.',
} as const;
