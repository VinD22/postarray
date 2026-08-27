export const webDemoMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadatos y navegación                                                 */
  /* ---------------------------------------------------------------------- */

  'web.meta.demo.title': 'Mira cómo funciona',
  'web.meta.demo.description':
    'Un recorrido guiado por el flujo de publicación, desde un proyecto nuevo hasta el recibo, mostrado en la interfaz real con contenido de ejemplo. Nada se publica todavía, y el recorrido dice dónde está ese límite.',

  'web.demo.nav.label': 'Míralo funcionar',
  'web.demo.nav.summary':
    'Un recorrido guiado por el producto en el orden en que lo vas descubriendo, construido a partir de la interfaz real con contenido de ejemplo.',

  /* ---------------------------------------------------------------------- */
  /* El marco en el que se ubica cada panel de la demostración             */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': 'Demostración',
  'web.demo.frame.sample':
    'Una demostración construida a partir de la interfaz real, llena de contenido de ejemplo de una empresa que no existe. No es una cuenta real. Nada aquí envía nada.',

  'web.demo.control.pause': 'Pausar la demostración',
  'web.demo.control.play': 'Reproducir la demostración',
  'web.demo.control.replay': 'Reproducir de nuevo la demostración',

  /* ---------------------------------------------------------------------- */
  /* La demostración destacada en la página de inicio                      */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.viewCta': 'Ver la demo',
  'web.demo.hero.projectsLine':
    'Una cuenta gestiona varios negocios. Cada proyecto es su propio negocio, con sus propias cuentas conectadas, su propio calendario y sus propias aprobaciones, y cambias entre ellos desde un solo menú, como cambias de propiedad en una consola de búsqueda.',
  'web.demo.hero.projectsChip': '{count, plural, one {# cuenta} many {# cuentas} other {# cuentas}}',
  'web.demo.hero.caption':
    'Un borrador se convierte en una versión por plataforma, recibe un horario y llega a la semana. Contenido de ejemplo, no es una cuenta real.',
  'web.demo.hero.more': 'Recorre todo el flujo de trabajo',

  /* ---------------------------------------------------------------------- */
  /* La página del recorrido                                                */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': 'Cómo funciona, en el orden en que lo vas descubriendo',
  'web.demo.lede':
    'Nueve pasos, desde un workspace vacío hasta el registro de lo que ocurrió. Cada uno muestra la superficie que realmente estarías viendo, con contenido de ejemplo en ella.',
  'web.demo.notice.title': 'Esto es una demostración, no una cuenta real',
  'web.demo.notice.body':
    'Cada panel aquí es la interfaz del producto con contenido de ejemplo. Ningún conector completó la verificación del proveedor, así que no se publica nada en ninguna plataforma a través de este producto hoy. Donde el flujo de trabajo se detiene, la página lo dice en lugar de dibujar el resto.',
  'web.demo.contents.title': 'Los nueve pasos',
  'web.demo.stepLabel': 'Paso {position} de {total}',
  'web.demo.next': 'Siguiente: {step}',
  'web.demo.closing.pricing': 'Mira cuánto cuesta',
  'web.demo.closing.title': 'Ese es todo el ciclo',
  'web.demo.closing.body':
    'Nada de lo anterior es una maqueta de un producto que esperamos construir. Es la interfaz tal como está, con la mitad de la publicación marcada honestamente como inconclusa.',

  /* ---------------------------------------------------------------------- */
  /* Los nueve pasos                                                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': 'Crear un proyecto',
  'web.demo.step.project.body':
    'Un proyecto guarda cuentas, borradores, aprobaciones y una zona horaria. Toda consulta en el producto está restringida a uno de ellos, en el servicio de aplicación y de nuevo en la base de datos, así que un cliente no puede ver a otro por accidente.',

  'web.demo.step.connect.title': 'Conectar una cuenta',
  'web.demo.step.connect.body':
    'Conectar pasa únicamente por las API oficiales de la plataforma, y te dice qué exige la plataforma de la cuenta antes de empezar. Hoy todo conector se detiene en la verificación, y por eso cada fila de abajo lo dice en lugar de mostrar una marca verde.',

  'web.demo.step.compose.title': 'Escríbelo una vez, adáptalo por plataforma',
  'web.demo.step.compose.body':
    'Escribes un borrador maestro. Seleccionar una cuenta abre una anulación solo para esa cuenta, con sus propios límites y su propia vista previa. Nada que escribas para LinkedIn cambia lo que recibe X, y las verificaciones de cada versión se ejecutan antes de que algo se programe.',
  'web.demo.step.variants.title': 'Mira lo que recibe realmente cada cuenta',
  'web.demo.step.variants.body':
    'Un borrador se convierte en una versión por cuenta, cada una escrita para la plataforma a la que va: una línea más corta para X, la nota de lanzamiento completa para LinkedIn, una leyenda y texto alternativo para Instagram. Editas cualquiera de ellas sin tocar las otras, y cada versión lleva la verificación que le corresponde.',

  'web.demo.step.schedule.title': 'Dale un horario, o entrégalo a la cola',
  'web.demo.step.schedule.body':
    'Un horario se guarda como un instante más la zona horaria del proyecto, nunca como una hora local simple, así que un cambio de horario de verano no mueve nada bajo tus pies. La cola es la otra ruta: toma el próximo horario que permiten las reglas que definiste.',

  'web.demo.step.calendar.title': 'Observa el calendario',
  'web.demo.step.calendar.body':
    'La semana muestra la plataforma, la cuenta, el estado y el horario de cada publicación. Mover una es tanto un botón como un arrastre, así que el calendario es totalmente usable desde el teclado.',

  'web.demo.step.receipt.title': 'Lee el recibo después',
  'web.demo.step.receipt.body':
    'Todo intento escribe un recibo inmutable: quién lo escribió, quién lo aprobó, bajo qué política, en qué instante. La mitad de publicación de ese registro la escribe la ejecución de publicación, que es la parte que todavía no existe.',

  /* ---------------------------------------------------------------------- */
  /* Etiquetas de los paneles                                              */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': 'Proyecto',
  'web.demo.project.zone': 'Zona horaria: {zone}',
  'web.demo.project.scope':
    'Los borradores, cuentas, aprobaciones y recibos pertenecen a este proyecto y a ningún otro lugar.',

  'web.demo.accounts.label': 'Cuentas en este proyecto',
  'web.demo.accounts.state': 'Verificación no completada',
  'web.demo.accounts.note':
    'Cada fila mostraría la salud del token, los permisos otorgados y la última publicación enviada con éxito. Ninguna puede publicar hoy.',

  'web.demo.master.label': 'Borrador maestro',
  'web.demo.master.project': 'En el proyecto {project}',

  'web.demo.variants.label': 'Lo que recibe cada cuenta',

  'web.demo.schedule.label': 'Programado',
  'web.demo.schedule.value': '{when} en {zone}',
  'web.demo.schedule.approval': 'Se necesita una aprobación antes de que se pueda enviar algo.',
  'web.demo.schedule.queue':
    'La cola es la otra ruta: elige el próximo horario que permiten tus reglas, en esta zona horaria.',

  'web.demo.week.label': 'La semana',
  'web.demo.week.caption':
    'Las mismas tres publicaciones en el calendario, leídas en la zona horaria del proyecto.',
  'web.demo.week.empty': 'Nada programado',

  'web.demo.receipt.label': 'Recibo hasta ahora',
  'web.demo.receipt.pending':
    'Lo que se envió, lo que respondió la plataforma, el ID externo de la publicación y el enlace permanente los escribe la ejecución de publicación. Permanecen no disponibles hasta que un conector complete la verificación del proveedor.',
  'web.demo.receipt.field.externalId': 'ID externo de la publicación',
  'web.demo.receipt.field.permalink': 'Enlace permanente',

  /* ---------------------------------------------------------------------- */
  /* Contenido de ejemplo                                                   */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools (ejemplo)',
  'web.demo.sample.actor': 'Ada, compañera de ejemplo',
  'web.demo.sample.approver': 'Ravi, revisor de ejemplo',
  'web.demo.sample.policy': 'Una aprobación antes de enviar',
  'web.demo.sample.master':
    'Northbound 2.4 ya salió hoy. Las importaciones son más rápidas, la búsqueda tiene un atajo de teclado, y el error de exportación que dos de ustedes reportaron está corregido.',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'Northbound 2.4 ya salió. Importaciones más rápidas, búsqueda por teclado, y ese error de exportación está corregido.',
  'web.demo.sample.x.check': 'Conteo de caracteres y orden del hilo',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    'Northbound 2.4 ya salió hoy. La nota de lanzamiento explica en detalle los cambios de importación y la corrección de exportación.',
  'web.demo.sample.linkedin.check': 'Rol en la organización y longitud de la publicación',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    'La misma foto del lanzamiento, con una leyenda escrita para el feed y texto alternativo escrito por una persona.',
  'web.demo.sample.instagram.check': 'Tipo de cuenta, proporción y texto alternativo',

  /* ---------------------------------------------------------------------- */
  /* El recorrido de nueve escenas                                         */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': 'Pasos del recorrido',
  'web.demo.tour.jump': 'Mostrar paso {position}: {step}',
  'web.demo.tour.step.project': 'Crear un proyecto',
  'web.demo.tour.step.connect': 'Conectar cuentas',
  'web.demo.tour.step.compose': 'Componer una vez',
  'web.demo.tour.step.variants': 'Adaptar por plataforma',
  'web.demo.tour.step.validate': 'Verificarlo',
  'web.demo.tour.step.schedule': 'Darle un horario',
  'web.demo.tour.step.week': 'Ver la semana',
  'web.demo.tour.step.publish': 'Publicar y registrar',
  'web.demo.tour.step.digest': 'Leer el resumen',

  /* ---------------------------------------------------------------------- */
  /* Verificaciones (paso 5)                                                */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': 'Verificaciones antes de programar',
  'web.demo.validate.check.length': 'Límite de caracteres, por cuenta',
  'web.demo.validate.check.lengthDetail':
    'Cada versión se mide contra el límite que la plataforma le da a esa cuenta.',
  'web.demo.validate.check.altText': 'Texto alternativo en toda imagen',
  'web.demo.validate.check.altTextDetail':
    'Una imagen sin descripción, o sin marcarla como decorativa, detiene la programación.',
  'web.demo.validate.check.firstComment': 'Primer comentario permitido aquí',
  'web.demo.validate.check.firstCommentDetail':
    'Un primer comentario solo se ofrece en cuentas cuya plataforma lo admite.',
  'web.demo.validate.note':
    'Esto se ejecuta en el compositor antes de que algo se programe, y de nuevo antes de que se envíe.',

  /* ---------------------------------------------------------------------- */
  /* Publicación y recibo (paso 8)                                         */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': 'Publicación y el registro de ella',
  'web.demo.live.step.approved': 'Aprobado por {approver}',
  'web.demo.live.step.queued': 'En la cola para su horario',
  'web.demo.live.step.sent': 'Enviado a la plataforma',
  'web.demo.live.step.confirmed': 'Confirmado por la plataforma',
  'web.demo.live.badge.pending': 'No publicado',
  'web.demo.live.badge.live': 'En vivo',
  'web.demo.live.pending':
    'Los dos últimos pasos los escribe la ejecución de publicación. Ningún conector completó la verificación del proveedor todavía, así que permanecen pendientes y el ID externo de la publicación y el enlace permanente permanecen no disponibles.',

  /* ---------------------------------------------------------------------- */
  /* El resumen semanal (paso 9)                                           */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': 'Tu semana, en frases',
  'web.demo.digest.sample': 'Ejemplo',
  'web.demo.digest.line.variants':
    'Tres versiones nativas de plataforma salieron de un borrador esta semana.',
  'web.demo.digest.line.earliest': 'La mañana del martes fue tu horario más temprano.',
  'web.demo.digest.line.approval': 'Toda versión se aprobó antes de entrar en la cola.',
  'web.demo.digest.line.alt': 'Toda imagen tenía texto alternativo escrito por una persona.',
  'web.demo.digest.footer':
    'Los análisis en vivo aparecen aquí a medida que se publican tus contenidos.',

  /* ---------------------------------------------------------------------- */
  /* Los tres pasos añadidos al recorrido                                  */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': 'Verifícalo antes de programarlo',
  'web.demo.step.validate.body':
    'El compositor mide cada versión contra la cuenta para la que fue escrita: el límite de caracteres que esa cuenta realmente tiene, texto alternativo en toda imagen, y si la plataforma ofrece un primer comentario. Una versión que falla una verificación no se puede programar.',

  'web.demo.step.publish.title': 'Publica, y mantén el registro',
  'web.demo.step.publish.body':
    'Una ejecución de publicación envía cada versión en su instante, registra lo que respondió la plataforma, y escribe un recibo inmutable. Esa ejecución es la parte que todavía no existe, así que los dos últimos pasos de abajo aparecen pendientes en lugar de dibujados como terminados.',

  'web.demo.step.digest.title': 'Lee el resumen semanal',
  'web.demo.step.digest.body':
    'El resumen describe lo que hizo el producto en frases: cuántas versiones salieron de un borrador, cuál horario fue el más temprano, qué se aprobó. No trae ninguna cifra de interacción, porque los análisis vienen de las plataformas después de que se publica algo, y nada se publica todavía.',
} as const;
