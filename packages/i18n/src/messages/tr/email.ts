export const emailMessages = {
  'email.invitation.subject': '{workspaceName} çalışma alanına davet edildiniz',
  'email.invitation.body':
    '{workspaceName} çalışma alanına {role} rolüyle davet edildiniz. Daveti buradan kabul edin: {invitationUrl}. Bu bağlantının süresi {expiresAt} tarihinde dolar.',
  'email.oauth_redirect_changed.subject': '{appName} için oturum açma ayarları değişti',
  'email.oauth_redirect_changed.body':
    '{appName} için onaylanmış yönlendirme adresleri değişti. Bunu beklemiyorsanız uygulamayı çalışma alanı ayarlarınızda inceleyin.',
} as const;
