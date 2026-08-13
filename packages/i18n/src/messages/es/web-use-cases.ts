export const webUseCaseMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadatos                                                              */
  /* ---------------------------------------------------------------------- */

  'web.meta.useCases.title': 'Casos de uso',
  'web.meta.useCases.description':
    'Tres flujos de trabajo para los que se está construyendo este producto: gestionar varios clientes en un solo lugar, conseguir que el trabajo se apruebe antes de salir, y llevar una idea a varias plataformas sin reescribirla.',
  'web.meta.useCase.clients.title': 'Gestión de múltiples clientes',
  'web.meta.useCase.clients.description':
    'Proyectos separados, cuentas conectadas separadas, aprobaciones separadas e informes separados, para equipos que publican en nombre de otras personas.',
  'web.meta.useCase.approvals.title': 'Flujos de aprobación',
  'web.meta.useCase.approvals.description':
    'Cómo un borrador se convierte en una publicación aprobada: quién la revisa, qué invalida una aprobación, y por qué la misma regla se aplica en toda superficie.',
  'web.meta.useCase.crossPlatform.title': 'Publicación entre plataformas',
  'web.meta.useCase.crossPlatform.description':
    'Un borrador maestro, una versión adaptada por plataforma, validada contra los límites registrados de cada plataforma antes de que algo se programe.',

  /* ---------------------------------------------------------------------- */
  /* Elementos compartidos                                                  */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': 'Casos de uso',
  'web.useCases.index.lede':
    'Tres flujos de trabajo para los que se está construyendo este producto. Cada página dice lo que le cuesta a un equipo hoy ese flujo, cómo está diseñado el producto para manejarlo, y qué partes ya están construidas de verdad.',
  'web.useCases.index.listLabel': 'Casos de uso',

  'web.useCases.notice.title': 'Esto describe un diseño, no un servicio en funcionamiento',
  'web.useCases.notice.body':
    'Ningún conector está verificado en producción, así que nada en esta página publica en ningún lugar todavía. Donde una parte del flujo ya está construida, la página lo dice. Donde no lo está, también lo dice.',

  'web.useCases.section.problem': 'El problema',
  'web.useCases.section.approach': 'Cómo está diseñado el producto',
  'web.useCases.section.today': 'Lo que ya está construido de verdad',
  'web.useCases.section.related': 'Relacionados',

  /* ---------------------------------------------------------------------- */
  /* Gestión de múltiples clientes                                          */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': 'Gestión de múltiples clientes',
  'web.useCases.clients.lede':
    'El trabajo de un cliente nunca debería estar a un clic equivocado de distancia de la audiencia de otro cliente.',
  'web.useCases.clients.problem':
    'La mayoría de los equipos separan a los clientes con cuidado. Una cuenta compartida guarda toda página conectada, un calendario guarda toda programación, y lo único que separa un borrador de un cliente de la audiencia equivocada es la persona mirando la pantalla a las 6 de la tarde. Cuando alguien deja el equipo, la separación se va con el hábito.',
  'web.useCases.clients.approach1':
    'Un proyecto es la unidad de separación. Las cuentas conectadas, borradores, colas, medios y recibos pertenecen a un proyecto, y un miembro solo ve los proyectos a los que fue agregado.',
  'web.useCases.clients.approach2':
    'La separación se refuerza tres veces: en la autenticación, en el servicio de aplicación que autoriza la acción, y en la propia base de datos mediante seguridad a nivel de fila. Estar autenticado nunca se trata como permiso.',
  'web.useCases.clients.approach3':
    'Los informes siguen la misma frontera, así que un informe por cliente es el formato predeterminado en lugar de una hoja de cálculo que alguien arma a mano.',
  'web.useCases.clients.today':
    'Los proyectos, la membresía restringida a proyecto y las políticas de seguridad a nivel de fila detrás de ellas están construidas y probadas, incluyendo pruebas que intentan lecturas entre proyectos y verifican que fallen. Los planes se dimensionan según cuántos proyectos necesita un equipo. Todavía no se publica nada en ninguna plataforma desde ningún proyecto.',

  /* ---------------------------------------------------------------------- */
  /* Flujos de aprobación                                                   */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': 'Flujos de aprobación',
  'web.useCases.approvals.lede':
    'Una aprobación solo vale algo si lo aprobado es lo que sale.',
  'web.useCases.approvals.problem':
    'Las aprobaciones suelen vivir fuera de la herramienta que publica. Una captura de pantalla va a un cliente, el cliente responde que sí, y entonces el texto cambia. La aprobación ahora se refiere a un borrador que nadie tiene, y la herramienta no lo sabe, así que publica lo último que se le entregó.',
  'web.useCases.approvals.approach1':
    'Una aprobación queda adjunta exactamente al contenido que se revisó. Editar un borrador aprobado invalida la aprobación y dice qué campo cambió, en lugar de simplemente llevar la decisión anterior hacia adelante en silencio.',
  'web.useCases.approvals.approach2':
    'Un revisor puede aprobar, pedir cambios o rechazar, y un comentario es obligatorio para cualquier cosa que no sea aprobar, así que el autor nunca queda sin saber qué corregir.',
  'web.useCases.approvals.approach3':
    'La regla vive en la capa de aplicación compartida, así que la app web, la API REST, el servidor MCP, la CLI y los webhooks la obedecen todos. Ninguna superficie tiene un atajo para saltarse la revisión.',
  'web.useCases.approvals.today':
    'Los estados de aprobación, la superficie de revisión, las reglas de reaprobación y los eventos de auditoría detrás de ellos están construidos. Lo que no está construido es el último paso, porque ningún conector completó su definición de listo, así que una publicación aprobada todavía no tiene a dónde ir.',

  /* ---------------------------------------------------------------------- */
  /* Publicación entre plataformas                                         */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': 'Publicación entre plataformas',
  'web.useCases.crossPlatform.lede':
    'Una idea, una edición, y una versión por plataforma que respeta lo que esa plataforma realmente acepta.',
  'web.useCases.crossPlatform.problem':
    'Publicar el mismo texto en todas partes produce una versión que se trunca en una plataforma, sin un título obligatorio en otra, y con un enlace que una tercera elimina en silencio. La alternativa, reescribir a mano cinco veces, es a donde realmente va el trabajo.',
  'web.useCases.crossPlatform.approach1':
    'Un borrador maestro guarda la idea. Cada cuenta seleccionada obtiene su propia versión, y una edición al maestro se aplica solo donde cabe, diciendo claramente qué destinos no pudieron recibirla y por qué.',
  'web.useCases.crossPlatform.approach2':
    'La validación se ejecuta contra los límites registrados de cada plataforma, contados como esa plataforma cuenta, así que un tope de caracteres se verifica en grafemas donde la plataforma usa grafemas y en unidades ponderadas donde usa esas.',
  'web.useCases.crossPlatform.approach3':
    'Todo límite de plataforma mostrado en cualquier lugar de este sitio se genera a partir del registro de conectores y trae el documento del que vino y la fecha en que una persona lo leyó.',
  'web.useCases.crossPlatform.today':
    'El compositor, las versiones por destino, las reglas de validación y el conjunto de datos de límites generado están construidos. El paso de publicación no lo está: ningún conector está verificado en producción, así que un borrador validado se puede programar internamente y no puede llegar a una plataforma.',
} as const;
