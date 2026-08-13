export const emailMessages = {
  'email.invitation.subject': '{workspaceName}に招待されました',
  'email.invitation.body':
    '{workspaceName}に{role}の役割で招待されました。こちらから招待を承認してください: {invitationUrl}。このリンクは{expiresAt}に期限切れになります。',
  'email.oauth_redirect_changed.subject': '{appName}のサインイン設定が変更されました',
  'email.oauth_redirect_changed.body':
    '{appName}の承認済みリダイレクトアドレスが変更されました。心当たりがない場合は、ワークスペース設定でアプリケーションを確認してください。',
} as const;
