export const emailMessages = {
  'email.invitation.subject': 'Byli jste pozváni do {workspaceName}',
  'email.invitation.body':
    'Byli jste pozváni do {workspaceName} s rolí {role}. Přijměte pozvání zde: {invitationUrl}. Platnost tohoto odkazu vyprší {expiresAt}.',
  'email.oauth_redirect_changed.subject': 'Nastavení přihlášení se změnilo pro {appName}',
  'email.oauth_redirect_changed.body':
    'Schválené přesměrovací adresy pro {appName} se změnily. Pokud jste to neočekávali, zkontrolujte aplikaci v nastavení pracovního prostoru.',
} as const;
