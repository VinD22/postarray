export const emailMessages = {
  'email.invitation.subject': 'Вас пригласили в {workspaceName}',
  'email.invitation.body':
    'Вас пригласили в {workspaceName} с ролью {role}. Примите приглашение здесь: {invitationUrl}. Срок действия этой ссылки истекает {expiresAt}.',
  'email.oauth_redirect_changed.subject': 'Настройки входа для {appName} изменились',
  'email.oauth_redirect_changed.body':
    'Одобренные адреса переадресации для {appName} изменились. Проверьте приложение в настройках вашего рабочего пространства, если вы этого не ожидали.',
} as const;
