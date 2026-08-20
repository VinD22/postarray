/** Spanish (Latin America) beta catalog. B5 legal, billing and consent messages deliberately use English fallback. */
export const emailMessages = {
  'email.invitation.subject': 'Fuiste invitado a {workspaceName}',
  'email.invitation.body':
    'Fuiste invitado a {workspaceName} con el rol de {role}. Acepta la invitación aquí: {invitationUrl}. Este enlace vence el {expiresAt}.',
  'email.oauth_redirect_changed.subject': 'Cambiaron los ajustes de inicio de sesión de {appName}',
  'email.oauth_redirect_changed.body':
    'Las direcciones de redirección aprobadas para {appName} cambiaron. Revisa la aplicación en la configuración de tu espacio de trabajo si no esperabas este cambio.',
} as const;
