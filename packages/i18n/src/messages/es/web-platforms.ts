export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadatos                                                              */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'Programación, plataforma por plataforma',
  'web.meta.schedule.description':
    'Lo que exige cada plataforma del grupo de lanzamiento de una cuenta conectada, los límites que aplica su API oficial, y hasta dónde ha llegado este producto frente a ellos.',
  'web.meta.schedulePlatform.title': 'Programación para {platform}',
  'web.meta.schedulePlatform.description':
    'Lo que {platform} exige de una cuenta conectada, los límites que aplica su API oficial, y qué partes de eso ya construyó este producto.',

  /* ---------------------------------------------------------------------- */
  /* Índice                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Programación, plataforma por plataforma',
  'web.schedule.index.lede':
    'Una página por plataforma en el grupo de lanzamiento. Cada una afirma lo que la plataforma pide de una cuenta conectada, los límites que aplica su API oficial, y dónde está la construcción. Todo número trae el documento del que vino y la fecha en que una persona lo leyó.',
  'web.schedule.index.listLabel': 'Plataformas en el grupo de lanzamiento',
  'web.schedule.index.cohortNote':
    'El grupo es el conjunto de plataformas para el que se está construyendo este producto. Es un plan, no una lista de disponibilidad.',
  'web.schedule.index.limitsKnown': 'Límites registrados',
  'web.schedule.index.limitsUnknown': 'Límites aún no registrados',

  /* ---------------------------------------------------------------------- */
  /* Página de la plataforma                                                */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Programación para {platform}',
  'web.schedule.platform.lede':
    'Lo que {platform} pide de una cuenta conectada, los límites que aplica su API oficial, y contra cuáles de ellos ya construyó este producto hasta ahora.',

  'web.schedule.notice.title': 'Todavía no se publica nada en {platform}',
  'web.schedule.notice.body':
    'Ningún conector completó su definición de listo, y ninguno está verificado en producción. Esta página describe lo que exige la plataforma y lo que este producto pretende soportar. No describe un programador funcionando.',

  'web.schedule.requirements.title': 'Lo que exige {platform}',
  'web.schedule.requirements.accountTypes': 'Tipo de cuenta',
  'web.schedule.requirements.restriction': 'Restricción de la plataforma',
  'web.schedule.requirements.cost': 'Costo de la API',
  'web.schedule.requirements.unavailable.title': 'Todavía no hay registro revisado del conector',
  'web.schedule.requirements.unavailable.body':
    'Esta plataforma se unió al grupo después de la última ronda de investigación de conectores, así que no hay un registro fechado de sus requisitos de cuenta para mostrar. Aparecerá aquí en cuanto una persona lea la documentación oficial y lo registre.',
  'web.schedule.requirements.apiSource': 'Documentación oficial de la API',
  'web.schedule.requirements.policySource': 'Política de la plataforma',

  /* ---------------------------------------------------------------------- */
  /* Límites                                                                */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Límites que aplica {platform}',
  'web.schedule.limits.lede':
    'Leídos para una cuenta recién conectada sin elegibilidad elevada. Una plataforma puede subir o bajar cualquiera de estos sin avisar a nadie, y por eso cada conjunto trae la fecha en que se leyó.',
  'web.schedule.limits.unavailable.title': 'Límites no registrados para {platform}',
  'web.schedule.limits.unavailable.body':
    'Esta versión no incluye un adaptador para esta plataforma, así que no hay un tope registrado para mostrar. Un número inventado sería peor que ninguno.',
  'web.schedule.limits.sourceLabel': 'Documentación oficial de la plataforma',

  'web.schedule.limits.text': 'Texto del cuerpo',
  'web.schedule.limits.title_field': 'Campo de título',
  'web.schedule.limits.countingUnit': 'Cómo se cuentan los caracteres',
  'web.schedule.limits.links': 'Cómo se cuentan los enlaces',
  'web.schedule.limits.images': 'Imágenes por publicación',
  'web.schedule.limits.videos': 'Videos por publicación',
  'web.schedule.limits.videoDuration': 'Duración del video',
  'web.schedule.limits.imageBytes': 'Imagen más grande',
  'web.schedule.limits.gifBytes': 'Imagen animada más grande',
  'web.schedule.limits.videoBytes': 'Video más grande',
  'web.schedule.limits.documentBytes': 'Documento más grande',
  'web.schedule.limits.altText': 'Texto alternativo',
  'web.schedule.limits.mimeTypes': 'Tipos de archivo aceptados',
  'web.schedule.limits.markdown': 'Marcas de formato',

  'web.schedule.value.characters':
    '{count, plural, one {# carácter} many {# caracteres} other {# caracteres}}',
  'web.schedule.value.files':
    '{count, plural, =0 {Ninguno} one {# archivo} many {# archivos} other {# archivos}}',
  'web.schedule.value.durationRange': 'Entre {min} y {max}',
  'web.schedule.value.durationMax': 'Hasta {max}',
  'web.schedule.value.markdownYes': 'Aceptado',
  'web.schedule.value.markdownNo': 'Publicado como caracteres simples',

  'web.schedule.unit.utf16':
    'Por unidad de código UTF-16, que es lo que la mayoría de los editores reportan como conteo de caracteres.',
  'web.schedule.unit.grapheme':
    'Por grafema, así que un emoji hecho de varios puntos de código sigue costando un carácter.',
  'web.schedule.unit.weighted':
    'Por un esquema ponderado en el que la mayoría de los caracteres no latinos cuestan dos en vez de uno.',

  'web.schedule.link.none': 'Los enlaces no se cuentan contra el tope.',
  'web.schedule.link.actual': 'Un enlace cuesta exactamente los caracteres que ocupa.',
  'web.schedule.link.fixed':
    'Todo enlace se reescribe al acortador de la plataforma y cuesta {count, plural, one {# carácter} many {# caracteres} other {# caracteres}} sin importar su longitud real.',

  /* ---------------------------------------------------------------------- */
  /* Estado de las capacidades                                             */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'Qué está construido para {platform}',
  'web.schedule.capabilities.lede':
    'Generado a partir del registro de conectores, no escrito aquí. "No ofrecido por la plataforma" es un hecho sobre la plataforma y es definitivo. "Todavía no construido" es un hecho sobre este producto y es la opción honesta por defecto mientras ningún conector haya completado su definición de listo.',
  'web.schedule.capabilities.unavailable.title':
    'Todavía no hay registro de capacidad para {platform}',
  'web.schedule.capabilities.unavailable.body':
    'No hay adaptador en esta versión, así que el registro no tiene nada que reportar. La fila aparecerá en la matriz de capacidades en cuanto haya algo real que decir.',
  'web.schedule.capabilities.matrixLink': 'Leer la matriz de capacidades completa',

  'web.schedule.next.title': 'A dónde ir ahora',
  'web.schedule.next.body':
    'La matriz de capacidades trae toda plataforma y toda capacidad en una sola tabla. Las páginas de casos de uso describen los flujos de trabajo para los que se está construyendo este producto.',
} as const;
