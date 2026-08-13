export const emailMessages = {
  'email.invitation.subject': '您已受邀加入 {workspaceName}',
  'email.invitation.body':
    '您已受邀以{role}角色加入 {workspaceName}。请在此接受邀请：{invitationUrl}。此链接将于 {expiresAt} 过期。',
  'email.oauth_redirect_changed.subject': '{appName} 的登录设置已更改',
  'email.oauth_redirect_changed.body':
    '{appName} 已批准的重定向地址已更改。如果这并非您所预期，请在工作区设置中查看该应用。',
} as const;
