export const emailMessages = {
  'email.invitation.subject': 'Te invitaron a {workspaceName}',
  'email.invitation.body':
    'Te invitaron a {workspaceName} con el rol de {role}. Acepta la invitación aquí: {invitationUrl}. Este enlace caduca el {expiresAt}.',
  'email.oauth_redirect_changed.subject': 'La configuración de inicio de sesión cambió para {appName}',
  'email.oauth_redirect_changed.body':
    'Las direcciones de redirección aprobadas para {appName} cambiaron. Revisa la aplicación en la configuración de tu workspace si no esperabas este cambio.',
} as const;
