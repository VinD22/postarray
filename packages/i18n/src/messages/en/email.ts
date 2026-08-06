export const emailMessages = {
  'email.invitation.subject': 'You were invited to {workspaceName}',
  'email.invitation.body':
    'You were invited to {workspaceName} with the {role} role. Accept the invitation here: {invitationUrl}. This link expires at {expiresAt}.',
  'email.oauth_redirect_changed.subject': 'Sign-in settings changed for {appName}',
  'email.oauth_redirect_changed.body':
    'The approved redirect addresses for {appName} changed. Review the application in your workspace settings if you did not expect this.',
} as const;
