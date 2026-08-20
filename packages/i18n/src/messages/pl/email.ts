export const emailMessages = {
  'email.invitation.subject': 'Zaproszono Cię do {workspaceName}',
  'email.invitation.body':
    'Zaproszono Cię do {workspaceName} z rolą {role}. Zaakceptuj zaproszenie tutaj: {invitationUrl}. Ten link wygasa {expiresAt}.',
  'email.oauth_redirect_changed.subject': 'Zmieniono ustawienia logowania dla {appName}',
  'email.oauth_redirect_changed.body':
    'Zatwierdzone adresy przekierowania dla {appName} zostały zmienione. Jeśli się tego nie spodziewałeś, sprawdź aplikację w ustawieniach obszaru roboczego.',
} as const;
