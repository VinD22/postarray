export const emailMessages = {
  'email.invitation.subject': 'Вас запросили до {workspaceName}',
  'email.invitation.body':
    'Вас запросили до {workspaceName} з роллю {role}. Прийміть запрошення тут: {invitationUrl}. Термін дії цього посилання закінчується {expiresAt}.',
  'email.oauth_redirect_changed.subject': 'Налаштування входу для {appName} змінилися',
  'email.oauth_redirect_changed.body':
    'Схвалені адреси переспрямування для {appName} змінилися. Перевірте застосунок у налаштуваннях вашої робочої області, якщо ви цього не очікували.',
} as const;
