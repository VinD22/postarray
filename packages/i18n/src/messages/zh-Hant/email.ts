export const emailMessages = {
  'email.invitation.subject': '你已受邀加入 {workspaceName}',
  'email.invitation.body':
    '你已受邀以「{role}」角色加入 {workspaceName}。請於此處接受邀請：{invitationUrl}。此連結將於 {expiresAt} 到期。',
  'email.oauth_redirect_changed.subject': '{appName} 的登入設定已變更',
  'email.oauth_redirect_changed.body':
    '{appName} 的核准重新導向位址已變更。如果這並非你預期的變更，請在你的工作區設定中檢查此應用程式。',
} as const;
