/** Filipino beta catalog namespace. */
export const emailMessages = {
  'email.invitation.subject': 'Na-invite ka sa {workspaceName}',
  'email.invitation.body':
    'Na-invite ka sa {workspaceName} bilang {role}. Tanggapin ang imbitasyon dito: {invitationUrl}. Mag-e-expire ang link na ito sa {expiresAt}.',
  'email.oauth_redirect_changed.subject':
    'Nagbago ang mga setting sa pag-sign in para sa {appName}',
  'email.oauth_redirect_changed.body':
    'Nagbago ang mga aprubadong redirect address para sa {appName}. I-review ang application sa mga setting ng iyong workspace kung hindi mo ito inaasahan.',
} as const;
