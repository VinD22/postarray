/** Weekly digest copy for the Spanish interface. */
export const digestMessages = {
  'digest.title': 'Esta semana',
  'digest.subtitle': 'Lo que podemos ver del {windowStart} al {windowEnd}.',
  'digest.empty':
    'Todavía no hay nada que resumir esta semana. Publica algo y aparecerá aquí.',
  'digest.regenerate': 'Reconstruir el resumen de esta semana',
  'digest.generating': 'Creando el resumen de esta semana',
  'digest.source.deterministic':
    'Escrito a partir de tus registros de publicación y tus propias mediciones, sin el asistente de escritura.',
  'digest.source.ai':
    'Escrito por el asistente a partir de tus propios registros. Cada número se comprobó con ellos.',
  'digest.unavailable.aiOff':
    'El asistente de escritura está desactivado, así que esta es la versión básica. No falta nada.',
  'digest.unavailable.rejected':
    'La versión del asistente no coincidía con tus datos y se descartó. Esta es la versión básica.',
  'digest.headline.published':
    '{published, plural, =0 {No se completaron publicaciones} one {Se completó # publicación} other {Se completaron # publicaciones}} entre {windowStart} y {windowEnd}.',
  'digest.headline.nothingPublished':
    'No se publicó nada entre {windowStart} y {windowEnd}.',
  'digest.outcome.published':
    '{count, plural, one {# publicación se completó en {provider}} many {# publicaciones se completaron en {provider}} other {# publicaciones se completaron en {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {# publicación llegó a algunos de sus destinos en {provider}, pero no a otros} many {# publicaciones llegaron a algunos de sus destinos en {provider}, pero no a otros} other {# publicaciones llegaron a algunos de sus destinos en {provider}, pero no a otros}}.',
  'digest.outcome.failed':
    '{count, plural, one {# publicación no se envió en {provider}} many {# publicaciones no se enviaron en {provider}} other {# publicaciones no se enviaron en {provider}}}.',
  'digest.metrics.noneYet':
    'Esta semana todavía no han llegado mediciones. Eso significa que no sabemos cómo funcionaron estas publicaciones, no que funcionaran mal.',
  'digest.freshness.statement':
    '{label, select, fresh {Las mediciones se sincronizaron por última vez a las {lastObservedAt}.} stale {Las mediciones no se sincronizan desde {lastObservedAt}, así que los números anteriores pueden estar desactualizados.} other {Todavía no se ha sincronizado nada, así que nada de lo anterior está medido.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Conviene saberlo: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Resumen semanal por correo',
  'digest.settings.description':
    'Un correo breve cada semana con lo que se publicó y lo que pudimos medir. Activado de forma predeterminada.',
  'digest.settings.enabled': 'Enviar el resumen semanal',
  'email.digest.subject': 'Tu semana en {workspaceName}',
  'email.digest.intro':
    'Esto es lo que podemos ver para {workspaceName} entre {windowStart} y {windowEnd}.',
  'email.digest.noData':
    'Esta semana no pudimos medir nada. Cuando falta un número, es porque no pudimos leerlo, no porque fuera cero.',
  'email.digest.footer':
    'Recibes esto porque el resumen semanal está activado para {workspaceName}. Desactívalo en la configuración del espacio de trabajo.',
} as const;
