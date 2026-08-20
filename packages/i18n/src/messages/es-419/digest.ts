/**
 * The weekly digest email. Only the `email.digest.*` keys are translated here
 * (the `digest.*` in-app keys are outside this locale's current coverage and
 * fall back to English).
 */
export const digestMessages = {
  'email.digest.subject': 'Tu semana en {workspaceName}',
  'email.digest.intro':
    'Esto es lo que podemos ver para {workspaceName} entre el {windowStart} y el {windowEnd}.',
  'email.digest.noData':
    'No pudimos medir nada esta semana. Cuando falta un número, es porque no pudimos leerlo, no porque fuera cero.',
  'email.digest.footer':
    'Recibes esto porque el resumen semanal está activado para {workspaceName}. Desactívalo en la configuración del espacio de trabajo.',
} as const;
