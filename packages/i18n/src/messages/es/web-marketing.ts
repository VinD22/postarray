/**
 * The public marketing site and public documentation surfaces.
 *
 * Rules that bind this file specifically, beyond the catalog rules in
 * `lint.ts`:
 *
 *  - Every claim here is either a product fact we control (price, channel
 *    allowance, surfaces) or a provider fact that carries a source link and a
 *    verification date in the page that renders it. No adjective stands in for
 *    a number.
 *  - Nothing here promises reach, ranking, engagement or "going" anywhere.
 *  - Nothing here describes AI image or AI video generation as a Relay
 *    feature, because it is not one.
 *  - No integration is called official until the provider has approved it. The
 *    connector matrix uses `capability.level.*` from `connections.ts` so the
 *    marketing site and the product cannot drift apart.
 *  - Legal wording that must be drafted by counsel is marked with
 *    `web.legal.counselPending.*` rather than guessed at here.
 */
export const webMarketingMessages = {
  /* ---------------------------------------------------------------------- */
  /* Shared marketing furniture                                              */
  /* ---------------------------------------------------------------------- */

  'web.brand.name': 'Relay',
  'web.brand.tagline': 'El plano de control editorial multilingüe para personas y agentes.',
  'web.skipToContent': 'Saltar al contenido principal',
  'web.nav.label': 'Navegación del sitio',
  'web.nav.openMenu': 'Menú',
  'web.nav.closeMenu': 'Cerrar el menú',
  'web.nav.footerLabel': 'Navegación de pie de página',

  'web.cta.startTrial': 'Comienza la prueba de 7 días',
  'web.cta.seePricing': 'ver el precio',
  'web.cta.seeCapabilities': 'Leer la matriz de capacidades',
  'web.cta.readDocs': 'Leer la documentación',
  'web.cta.trialFootnote':
    'Polar collects a payment method, charges $0 today, and shows the exact first charge date before you confirm.',

  'web.label.lastReviewed': 'Último reviewed {date}',
  'web.label.nextReview': 'Siguiente review {date}',
  'web.label.researchDate': 'Researched {date}',
  'web.label.officialSource': 'fuente oficial',
  'web.label.onThisPage': 'En esta pagina',
  'web.label.provider': 'Plataforma',
  'web.label.capability': 'Capacidad',

  'web.notFound.title': 'No hay ninguna página en esta dirección.',
  'web.notFound.body':
    'Es posible que el enlace esté desactualizado o que hayamos retirado la página. Las páginas que dejan de ser precisas se retiran en lugar de dejarse, y el registro de cambios lo registra cuando eso sucede.',
  'web.notFound.action': 'Ir a la página de inicio',

  'web.correction.title': 'Encontré algo mal en esta página',
  'web.correction.body':
    'Las reglas de la plataforma cambian y nos equivocamos. Envíe la URL y lo que es incorrecto y corregiremos la página o la retiraremos.',
  'web.correction.email': 'correcciones@relay.ejemplo',

  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.home.title': 'Relay, el plano de control editorial multilingüe',
  'web.meta.home.description':
    'Convierta una idea en contenido nativo de la plataforma, aprovéchela una vez, publíquela de manera confiable a través de las API oficiales de la plataforma y aprenda qué mejorar a continuación.',
  'web.meta.product.title': 'Cómo funciona Relay',
  'web.meta.product.description':
    'Un recorrido por el escritorio de publicación: redacte una vez, adapte por plataforma, valide con los límites reales, apruebe, programe, publique y conserve el recibo.',
  'web.meta.integrations.title': 'Plataformas Relay publica en',
  'web.meta.integrations.description':
    'A qué plataformas se conecta Relay, qué puede hacer cada conexión hoy en día y qué no permite la propia plataforma.',
  'web.meta.capabilities.title': 'Matriz de capacidades del conector',
  'web.meta.capabilities.description':
    'Una tabla por plataforma y por capacidad generada a partir de nuestras definiciones de conectores, que separa lo que hemos creado de lo que la plataforma no ofrece.',
  'web.meta.creators.title': 'Relay para creadores',
  'web.meta.creators.description':
    'Para creadores en solitario que publican la misma idea en varios formatos e idiomas sin reescribirla cinco veces.',
  'web.meta.agencies.title': 'Relay para agencias',
  'web.meta.agencies.description':
    'Separación de clientes, aprobaciones, enlaces de revisión para compartir, recibos e informes para equipos que publican en nombre de otras personas.',
  'web.meta.developers.title': 'Relay para desarrolladores',
  'web.meta.developers.description':
    'Un backend detrás de la aplicación web, la API REST, un servidor MCP remoto, la CLI y webhooks firmados. Mismas reglas de aprobación en todas las superficies.',
  'web.meta.pricing.title': 'Pricing',
  'web.meta.pricing.description':
    'One plan. $29 a month, or $300 a year which is $25 a month billed annually. 30 active channels, unlimited team members, no feature tiers.',
  'web.meta.resources.title': 'Recursos',
  'web.meta.resources.description':
    'Estado, registro de cambios, documentación, metodología, comparativas, el radar de herramientas y el catálogo de oportunidades.',
  'web.meta.status.title': 'Estado',
  'web.meta.status.description':
    'Estado actual de cada superficie Relay y de cada conector, más el historial de incidencias.',
  'web.meta.changelog.title': 'Registro de cambios',
  'web.meta.changelog.description': 'Qué se envió, qué cambió en los conectores y qué se corrigió.',
  'web.meta.docs.title': 'Documentación',
  'web.meta.docs.description':
    'API REST, servidor MCP, CLI y documentación de webhook para desarrollar en Relay.',
  'web.meta.methodology.title': 'Metodología',
  'web.meta.methodology.description':
    'Cómo investigamos las afirmaciones de las plataformas, cómo las fechamos, cómo comparamos otros productos y cómo corregimos los errores.',
  'web.meta.compare.title': 'Comparaciones',
  'web.meta.compare.description':
    'Comparaciones honestas y anticuadas con otras herramientas de publicación, incluido para quién es mejor cada una.',
  'web.meta.toolRadar.title': 'Radar de herramientas creativas',
  'web.meta.toolRadar.description':
    'Un catálogo fechado y revisado editorialmente de herramientas creativas especializadas, con limitaciones, advertencias de derechos y divulgación comercial.',
  'web.meta.opportunities.title': 'Oportunidades de promoción',
  'web.meta.opportunities.description':
    'Un catálogo seleccionado de lugares donde se puede enumerar, lanzar o discutir un producto, con reglas de envío propias para cada destino.',
  'web.meta.legal.title': 'Legales y políticas',
  'web.meta.legal.description':
    'Términos, privacidad, uso aceptable, uso de IA, cookies, subprocesadores, reembolsos, derechos de autor, seguridad, accesibilidad, términos de desarrollador y términos de afiliados.',

  /* ---------------------------------------------------------------------- */
  /* Home                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.home.promise':
    'Convierta una idea en contenido nativo de la plataforma, aprovéchela una vez, publíquela de manera confiable y aprenda qué mejorar a continuación.',
  'web.home.lede':
    'Relay es una editorial para personas responsables de lo que se publica. Escribe una vez, se adapta por plataforma, ve los límites reales antes de programar, obtiene la aprobación que necesita, publica a través de las API oficiales de la plataforma y guarda un recibo por cada publicación.',
  'web.home.summaryLine':
    'One plan at $29 a month or $300 a year. 30 active social channels, unlimited team members, no feature tiers. The seven day trial collects a payment method and charges $0 at checkout.',

  'web.home.example.title': 'Una idea, cinco versiones nativas de la plataforma',
  'web.home.example.body':
    'El compositor comienza con una versión maestra. Al seleccionar una cuenta, se abre una anulación solo para esa cuenta, con sus propios límites activos y su propia vista previa. Nada de lo que escribas por LinkedIn cambia lo que X recibe.',
  'web.home.example.column.account': 'cuenta',
  'web.home.example.column.variant': 'Lo que recibe esta cuenta',
  'web.home.example.column.check': 'Comprobado antes de programar',
  'web.home.example.caption':
    'Una composición ilustrativa. Los límites y configuraciones que se muestran provienen de la definición del conector para cada plataforma, no de una estimación.',
  'web.home.example.x.account': 'X, @en dirección norte',
  'web.home.example.x.variant': 'Texto maestro, abreviado, más un hilo de dos publicaciones.',
  'web.home.example.x.check':
    'Recuento de caracteres, orden de los hilos, costo API estimado para una publicación de enlace',
  'web.home.example.linkedin.account': 'LinkedIn, Herramientas en dirección norte',
  'web.home.example.linkedin.variant': 'Texto maestro más largo con el documento adjunto.',
  'web.home.example.linkedin.check':
    'Rol de la organización, duración de la publicación, tipo de documento',
  'web.home.example.instagram.account': 'Instagram, @northbound.tools',
  'web.home.example.instagram.variant':
    'Recorte cuadrado de la misma imagen, título reescrito para el feed',
  'web.home.example.instagram.check':
    'Tipo de cuenta profesional, relación de aspecto, texto alternativo presente',
  'web.home.example.youtube.account': 'YouTube, en dirección norte',
  'web.home.example.youtube.variant':
    'El mismo clip que un Corto, con título y descripción propios',
  'web.home.example.youtube.check':
    'Alcance de la carga, estado de la auditoría y privacidad en la que se realizará la carga',
  'web.home.example.bluesky.account': 'Bluesky, dirección norte.ejemplo',
  'web.home.example.bluesky.variant': 'Texto maestro con la tarjeta de enlace',
  'web.home.example.bluesky.check':
    'Recuento de caracteres, resolución de tarjeta de enlace, texto alternativo presente',

  'web.home.pillars.title': 'Para qué está diseñado Relay',
  'web.home.pillars.confidence.title': 'Publica con confianza',
  'web.home.pillars.confidence.body':
    'Una vista previa real por cuenta, políticas deterministas y verificaciones de plataforma antes de que algo se ponga en cola, la aprobación que requiere su espacio de trabajo, un recibo inmutable con la identificación de la publicación externa y un estado de salud para cada conexión.',
  'web.home.pillars.confidence.proof':
    'Cada escritura externa lleva una clave de idempotencia, por lo que una falla del trabajador después de que la plataforma aceptó una publicación no crea una segunda.',
  'web.home.pillars.adapt.title': 'Adaptar en lugar de duplicar',
  'web.home.pillars.adapt.body':
    'Variantes por plataforma que puede anular una cuenta a la vez y transcreación en lugar de traducción literal, con un glosario de marca y un revisor designado por idioma.',
  'web.home.pillars.adapt.proof':
    'La interfaz está disponible en idiomas seleccionados. La adaptación de contenido cubre 30 idiomas de contenido y cada uno de ellos es revisable antes de su publicación.',
  'web.home.pillars.loop.title': 'cerrar el ciclo',
  'web.home.pillars.loop.body':
    'Análisis que nombran la métrica, la plataforma que la informó, el denominador y cuándo se actualizó por última vez. Cuando una plataforma no reporta algo, Relay lo dice en lugar de mostrar un cero.',
  'web.home.pillars.loop.proof':
    'Una publicación se compara con su propia mediana en lugar de con una puntuación que nadie puede auditar.',
  'web.home.pillars.anywhere.title': 'Trabaja desde donde ya estás',
  'web.home.pillars.anywhere.body':
    'La aplicación web, una API REST, un servidor MCP remoto, una CLI y webhooks firmados llaman a los mismos servicios de aplicación, las mismas reglas de autorización y los mismos validadores.',
  'web.home.pillars.anywhere.proof':
    'Un agente no puede eludir una política de aprobación utilizando una superficie diferente, porque la política se aplica en el servicio, no en la interfaz.',
  'web.home.pillars.economics.title': 'Economics you can predict',
  'web.home.pillars.economics.body':
    'One price, every shipped feature, 30 active channels and unlimited team members. Platform usage that a provider charges per operation is passed through at cost and shown before you confirm the action.',
  'web.home.pillars.economics.proof':
    'There is no image or video generation credit system, because Relay does not generate media.',

  'web.home.honest.title': 'Lo que Relay no hace',
  'web.home.honest.lede':
    'Estos son límites, no una hoja de ruta. Si uno de ellos cambia, cambia primero en el registro de cambios.',
  'web.home.honest.noMedia':
    'Sin generación de imágenes con IA ni generación de videos con IA. Relay adapta, aprueba, publica y mide los medios que traes.',
  'web.home.honest.noAutomationOfEngagement':
    'No se permiten me gusta, seguimientos, publicaciones, respuestas no solicitadas ni mensajes directos automáticos. Sin grupos de interacción ni compromisos inventados.',
  'web.home.honest.noUnofficial':
    'Sin automatización del navegador, sin reproducción de cookies, sin raspado ni puntos finales de publicación no oficiales. Solo API de plataforma oficial.',
  'web.home.honest.noPromises':
    'No hay promesas sobre alcance, clasificación o participación. Relay puede decirle qué sucedió y qué probar a continuación. No puede decirle qué hará una audiencia.',
  'web.home.honest.noUnattendedPublishing':
    'No se permiten publicaciones desatendidas de forma predeterminada. Un agente puede redactar, validar y solicitar aprobación. Un ser humano decide antes de que algo se haga público, a menos que usted opte deliberadamente por excluirse de una política específica.',

  'web.home.surfaces.title': 'Cinco superficies, un backend',
  'web.home.surfaces.body':
    'Los mismos casos de uso, las mismas comprobaciones de arrendamiento, los mismos validadores y los mismos flujos de trabajo de publicación. Una superficie es una vía de entrada, nunca un atajo para pasar una regla.',
  'web.home.surfaces.web': 'aplicación web',
  'web.home.surfaces.webBody':
    'Composer, calendario, aprobaciones, análisis, conexiones y configuraciones.',
  'web.home.surfaces.api': 'API DESCANSO',
  'web.home.surfaces.apiBody':
    'Claves de alcance, claves de idempotencia en cada escritura, paginación del cursor, errores tipográficos.',
  'web.home.surfaces.mcp': 'Servidor MCP remoto',
  'web.home.surfaces.mcpBody':
    'HTTP transmisible, OAuth, por alcance de herramienta y una vista previa antes de cada llamada consiguiente.',
  'web.home.surfaces.cli': 'CLI',
  'web.home.surfaces.cliBody':
    'Salida estable legible por máquina para scripts e integración continua.',
  'web.home.surfaces.webhooks': 'Webhooks firmados',
  'web.home.surfaces.webhooksBody':
    'Publicar resultados, decisiones de aprobación y estado de la conexión, con reenvío.',

  'web.home.closing.title': 'Comience con una cuenta y una publicación',
  'web.home.closing.body':
    'Conecte una cuenta, redacte una publicación, observe la ejecución de la validación, prográmela y lea el recibo. Ese es el producto completo en unos diez minutos.',

  /* ---------------------------------------------------------------------- */
  /* Product                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.product.title': 'La mesa editorial',
  'web.product.lede':
    'Se deben responder siete preguntas en cada paso sin hacer clic en nada: qué se publica, dónde, qué versión recibe cada cuenta, cuándo y en qué zona horaria, quién lo aprobó, cuánto puede costar y qué pasó.',

  'web.product.step.source.title': 'Fuente',
  'web.product.step.source.body':
    'Comience a partir de un resumen, un archivo que ya tenga, un elemento RSS o una solicitud de un agente. Los medios importados conservan la procedencia que usted les proporcionó, incluido su origen y quién posee los derechos.',
  'web.product.step.compose.title': 'Redactar una vez y luego anular',
  'web.product.step.compose.body':
    'Una versión maestra impulsa cada objetivo. Al seleccionar una cuenta, se abre una anulación solo para esa cuenta: su propio texto, su propio recorte de medios, su propia configuración, su propio contador de límite en vivo y su propia vista previa. Restablecer una anulación restaura el maestro en una sola acción y le muestra la diferencia primero.',
  'web.product.step.validate.title': 'Validar antes de que algo se ponga en cola',
  'web.product.step.validate.body':
    'La validación es determinista y se ejecuta en el servidor. Comprueba los límites de la plataforma a partir de la instantánea de capacidad versionada, el tipo de cuenta, el texto alternativo, los derechos de medios, las reglas de duplicación y cadencia, la resolución de menciones y destinos y el costo estimado de uso de la plataforma. Cada problema nombra el objetivo al que pertenece y cómo solucionarlo.',
  'web.product.step.approve.title': 'Aprobar una vez',
  'web.product.step.approve.body':
    'La aprobación es una política del espacio de trabajo, no un hábito. Un revisor ve cada objetivo, cada variante, la zona horaria, el estado de privacidad y el costo estimado en una pantalla, y funciona en un teléfono. El contenido modificado después de la aprobación requiere aprobación nuevamente.',
  'web.product.step.schedule.title': 'Agendar en zona de tiempo real',
  'web.product.step.schedule.body':
    'Cada publicación programada almacena un instante y una zona horaria de la IANA, nunca una hora local ingenua. Las transiciones de horario de verano se muestran antes de que usted confirme, no se descubren después.',
  'web.product.step.publish.title': 'Publicar y conservar el recibo',
  'web.product.step.publish.body':
    'Cada objetivo se envía con una clave de idempotencia. Un objetivo que falla no revierte un objetivo que tuvo éxito y ese estado tiene su propio nombre: parcialmente publicado. Cada resultado produce un recibo inmutable con el ID de la publicación externa, el identificador de la solicitud, el historial de intentos y el error exacto, si lo hubo.',
  'web.product.step.learn.title': 'aprender',
  'web.product.step.learn.body':
    'Las métricas se normalizan, se nombran, se atribuyen a la plataforma que las informó y se marcan con un tiempo de actualización. Una métrica que una plataforma no informa se marca como no disponible con el motivo. Nunca se representa como un cero.',

  'web.product.shot.caption':
    'Las capturas de pantalla de esta página se capturan del producto en ejecución. Hasta que una superficie esté lo suficientemente completa como para fotografiarla honestamente, la describimos con palabras en lugar de hacer un dibujo de ella.',
  'web.product.shot.pending': 'Captura de pantalla pendiente de captura',
  'web.product.shot.pendingReason':
    'Esta superficie aún está en construcción. Publicaremos una captura real más que una ilustración.',

  'web.product.states.title': 'Los estados que a nadie le gusta diseñar',
  'web.product.states.body':
    'Una herramienta de publicación se juzga por el mal día, no por el bueno. Cada uno de ellos tiene una pantalla diseñada, una frase sencilla y una siguiente acción.',
  'web.product.states.partial':
    'Publicado parcialmente: qué objetivos están activos, cuáles fallaron y por qué.',
  'web.product.states.revoked':
    'Un token revocado encontrado en el momento del envío, con la ruta de reconexión.',
  'web.product.states.rateLimited':
    'Un límite de velocidad de la plataforma, con cuándo se reinicia y qué hay en cola detrás de él.',
  'web.product.states.duplicate':
    'Un bloque duplicado o de cadencia, con la regla que disparó y la ruta de apelación.',
  'web.product.states.offline':
    'Sin conexión mientras redactas: nada de lo que escribiste se pierde.',
  'web.product.states.permission':
    'Una acción que tu rol no permite, nombrando el rol que sí lo permite.',

  /* ---------------------------------------------------------------------- */
  /* Integrations and capability matrix                                      */
  /* ---------------------------------------------------------------------- */

  'web.integrations.title': 'Plataformas',
  'web.integrations.lede':
    'Relay se conecta a través de las API de la plataforma oficial. Cada conector tiene un propietario designado, una URL de política registrada y una fecha de revisión. Un conector no aparece como compatible hasta que pasa la definición de conector de listo.',
  'web.integrations.reviewNotice.title':
    'Ningún conector se califica como oficial antes de que la plataforma lo apruebe',
  'web.integrations.reviewNotice.body':
    'Varias plataformas requieren una revisión de la aplicación antes de que ésta pueda publicarse en nombre de un cliente. Cuando esa revisión es sobresaliente, el conector lo dice y describe exactamente lo que está restringido hasta que se apruebe.',
  'web.integrations.accountTypes': 'Tipos de cuentas en las que este conector puede publicar',
  'web.integrations.restriction': 'Restricción que debes conocer antes de conectarte',
  'web.integrations.cost': 'Costo de uso de la plataforma',
  'web.integrations.viewMatrix': 'Vea todas las capacidades de esta plataforma',

  'web.capabilities.title': 'Matriz de capacidades del conector',
  'web.capabilities.lede':
    'Generado a partir de las mismas definiciones de conectores que lee el producto y luego revisado por una persona antes de su publicación. El marketing no puede prometer algo que un adaptador no puede hacer.',
  'web.capabilities.legend.title': 'Cómo leer esta tabla',
  'web.capabilities.legend.body':
    'Cuatro estados, y la diferencia entre los dos del medio importa. Nuestro trabajo pendiente aún no está construido. Lo que la plataforma no ofrece es un hecho sobre la plataforma que ninguna herramienta puede solucionar.',
  'web.capabilities.tableCaption':
    'Capacidades por plataforma. Cada celda nombra su estado en palabras y también por color.',
  'web.capabilities.snapshot': 'Definiciones de conectores version {version}, reviewed {date}',
  'web.capabilities.sourceNote':
    'Cada afirmación de plataforma en esta tabla enlaza con la documentación oficial de la que proviene y la fecha en que la leímos por última vez.',

  /* ---------------------------------------------------------------------- */
  /* Audience pages                                                          */
  /* ---------------------------------------------------------------------- */

  'web.creators.title': 'Para creadores',
  'web.creators.lede':
    'Publicas la misma idea en varios formatos, a veces en más de un idioma, y sois todo el equipo. El trabajo que elimina Relay es volver a escribir, volver a recortar y comprobar.',
  'web.creators.job.adapt.title': 'Escríbalo una vez, envíe cinco versiones nativas',
  'web.creators.job.adapt.body':
    'La versión maestra lleva la idea. Cada cuenta obtiene la longitud, el recorte, la configuración y el tono que espera la plataforma, y ​​puedes verlos todos uno al lado del otro antes de comprometerte.',
  'web.creators.job.languages.title': 'Publicar en otro idioma sin adivinar',
  'web.creators.job.languages.body':
    'La transcreación mantiene la intención en lugar de las palabras, utiliza el glosario de su marca y marca si un revisor nativo lo ha leído. Nada se publica en un idioma que no puedas garantizar a menos que tú lo digas.',
  'web.creators.job.rights.title': 'Mantenga su registro de derechos con el expediente.',
  'web.creators.job.rights.body':
    'Los medios transmiten de dónde vinieron, quién posee los derechos y si fueron creados con una herramienta generativa. Las plataformas cada vez preguntan más. Relay almacena su respuesta con el recurso en lugar de volver a preguntarle.',
  'web.creators.job.cost.title': 'Conozca el costo antes de publicar',
  'web.creators.job.cost.body':
    'X cobra por operación y cobra más por una publicación que contiene una URL. Relay estima eso antes de confirmar, por lo que una semana con muchos enlaces es una decisión más que una factura sorpresa.',
  'web.creators.notFor.title': 'que esto no es',
  'web.creators.notFor.body':
    'Relay no genera imágenes ni videos, no ejecuta la automatización de la participación y no predice el rendimiento de una publicación. Si esas son las herramientas que desea, otros productos las hacen y preferimos que lo sepa ahora.',

  'web.agencies.title': 'Para agencias',
  'web.agencies.lede':
    'Publicas en nombre de otras personas, lo que hace que la atribución, la aprobación y la evidencia sean parte del trabajo en lugar de una delicadeza.',
  'web.agencies.job.separation.title': 'Separación de clientes que se mantiene',
  'web.agencies.job.separation.body':
    'Cada espacio de trabajo está aislado tanto a nivel de la base de datos como de la aplicación. Una consulta que cruza los límites de un espacio de trabajo falla en Postgres, no solo en una ruta de código que alguien podría olvidar.',
  'web.agencies.job.approval.title': 'Aprobaciones que un cliente realmente puede utilizar',
  'web.agencies.job.approval.body':
    'Un revisor ve cada objetivo, cada variante, el cronograma con su zona horaria y el costo estimado en una sola pantalla, y la pantalla funciona en un teléfono. Las decisiones de aprobación se registran con quién, cuándo y qué vieron.',
  'web.agencies.job.receipts.title': 'Evidencias de la incómoda conversación',
  'web.agencies.job.receipts.body':
    'Cada publicación genera un recibo inmutable con el ID de la publicación externa y el historial completo de intentos. Cuando un cliente pregunta si algo salió a las nueve, la respuesta tiene adjunta una marca de tiempo y un identificador de plataforma.',
  'web.agencies.job.roles.title': 'Roles que coinciden con cómo se divide el trabajo.',
  'web.agencies.job.roles.body':
    'Propietario, administrador, gerente, editor, aprobador, analista y espectador, con alcance por marca y por cuenta. Miembros del equipo ilimitados, porque el cobro por asiento hace que las agencias compartan inicios de sesión y eso es un problema de seguridad.',
  'web.agencies.limits.title': 'El límite, expresado claramente',
  'web.agencies.limits.body':
    'Un plan cubre 30 canales sociales activos. Un canal es una cuenta social, página, perfil, grupo o conexión de publicación. Si necesita más de 30, díganos qué necesita y le daremos una respuesta directa en lugar de un nivel oculto.',

  'web.developers.title': 'Para desarrolladores',
  'web.developers.lede':
    'La publicación es la parte de un flujo de trabajo donde un error es público y permanente. Relay le brinda un backend, errores tipográficos, idempotencia en cada escritura y un modelo de aprobación que un agente no puede eludir.',
  'web.developers.surface.api.title': 'API DESCANSO',
  'web.developers.surface.api.body':
    'Claves API con alcance, una clave de idempotencia requerida en cada escritura, paginación del cursor y un sobre de error escrito que contiene un código estable, una clave de mensaje y detalles desinfectados. Ninguna carga útil del proveedor se refleja en usted sin procesar.',
  'web.developers.surface.mcp.title': 'Servidor MCP remoto',
  'web.developers.surface.mcp.body':
    'HTTP transmitible con OAuth. Las herramientas son granulares y cada una declara sus efectos secundarios. Leer, redactar, solicitar aprobación, programar y publicar son ámbitos separados, por lo que un modelo que puede redactar no puede publicar.',
  'web.developers.surface.cli.title': 'CLI',
  'web.developers.surface.cli.body':
    'Cada comando admite una salida legible por máquina con una forma estable, por lo que un script puede analizarlo y un trabajo de integración continua puede fallar.',
  'web.developers.surface.webhooks.title': 'Webhooks firmados',
  'web.developers.surface.webhooks.body':
    'Publique resultados, decisiones de aprobación, estado de la conexión y resultados de validación, firmados, resistentes a la reproducción y reenviables desde el panel.',
  'web.developers.safety.title': 'El modelo de seguridad del agente.',
  'web.developers.safety.body':
    'Una credencial de agente es una cuenta de servicio con alcance, no una copia de una sesión personal. Incluye restricciones por marca, por cuenta, por ubicación, por dominio, por cadencia y por anticipación, y el servidor reautoriza cada llamada en lugar de confiar en el host del agente.',
  'web.developers.safety.injection':
    'Las páginas web, los feeds, los comentarios y las respuestas de la plataforma se tratan como datos no confiables. La salida del modelo se revalida de forma determinista, porque un modelo que dice que una publicación está bien no es una decisión de seguridad.',
  'web.developers.safety.killSwitch':
    'Cada agente y cada espacio de trabajo tiene un interruptor de apagado que detiene el trabajo pendiente sin eliminarlo.',
  'web.developers.openSource.title': 'Piezas abiertas',
  'web.developers.openSource.body':
    'El contrato del conector, la CLI, los ejemplos de esquema, las definiciones de la herramienta MCP y el simulador de proveedor son las partes que necesita para construir en Relay sin una cuenta de espacio aislado. Cuando un repositorio aún no está publicado, esta página lo indica en lugar de vincular a nada.',

  /* ---------------------------------------------------------------------- */
  /* Pricing                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.pricing.title': 'One plan',
  'web.pricing.lede':
    'There are no feature tiers, so there is no comparison table to read. Both billing intervals unlock every shipped feature.',
  'web.pricing.intervalHeading': 'Choose how you pay',
  'web.pricing.monthlyLabel': 'Billed monthly',
  'web.pricing.annualLabel': 'Billed annually',
  'web.pricing.annualDetail': '$300 charged once a year.',
  'web.pricing.monthlyDetail': '$29 charged every month.',
  'web.pricing.perMonthNote':
    'Prices are in US dollars. Polar adds any sales tax or VAT that applies where you are.',

  'web.pricing.beside.title': 'What you are agreeing to',
  'web.pricing.beside.channels':
    '30 active social channels. A channel is one social account, Page, profile, group or publication connection.',
  'web.pricing.beside.members':
    'Unlimited team members, workspaces and brand groups. There is no per seat charge.',
  'web.pricing.beside.fairUse':
    'Unlimited drafts, scheduled posts and stored receipts under a published fair use and anti spam policy. Those controls exist to protect your connected accounts and they apply identically to every subscriber.',
  'web.pricing.beside.metered':
    'X charges per API operation and charges more for a post that contains a URL. Relay passes that through at cost, estimates it before you confirm the action, and shows it in your usage. Other platform fees are passed through only when they are disclosed before the action.',
  'web.pricing.beside.noMedia':
    'AI image generation and AI video generation are not included and are not sold. There are no media credits, because Relay does not generate media.',
  'web.pricing.beside.trial':
    'The trial runs for seven days with every feature. Polar collects a payment method at checkout and charges $0 today. The exact first charge amount and date are shown next to the start action before you confirm.',
  'web.pricing.beside.conversion':
    'If you do nothing, the trial converts on day seven to the interval you chose and Polar charges the amount shown at checkout. Polar emails a reminder three days before that happens.',
  'web.pricing.beside.cancel':
    'Cancel from Settings at any time without contacting support. Cancel before the trial converts and no charge is attempted. Cancel after that and you keep access until the paid period ends.',
  'web.pricing.beside.data':
    'Nothing is deleted when a subscription ends. You can export your content, receipts and analytics, and you can delete them yourself.',

  'web.pricing.included.title': 'Included, in both intervals',
  'web.pricing.compare.title': 'Why there is no comparison table here',
  'web.pricing.compare.body':
    'A comparison table exists to show what a cheaper plan takes away. There is one plan, so the table would have one column. If we ever add a tier, we will say what moved and why on the changelog before the price page changes.',

  'web.pricing.testimonials.title': 'There are no customer quotes on this page yet',
  'web.pricing.testimonials.body':
    'A quote goes up only when the customer wrote it, gave written permission for it, and we can point to the work it describes. Until then an empty space is more honest than a wall of invented praise.',

  'web.pricing.faq.title': 'Questions people ask before paying',
  'web.pricing.faq.channels.q': 'What happens if I go over 30 channels',
  'web.pricing.faq.channels.a':
    'Nothing is disconnected and nothing is deleted. Channels over the limit become read only, you choose which ones stay active, and we tell you before it happens.',
  'web.pricing.faq.refund.q': 'Do you refund',
  'web.pricing.faq.refund.a':
    'Yes, under the published refund and cancellation policy, and always where consumer law requires it. Billing is handled by Polar as merchant of record and refunds are issued through Polar.',
  'web.pricing.faq.selfHost.q': 'Can I run it myself',
  'web.pricing.faq.selfHost.a':
    'Not today. Whether there will be a self hosted edition, and under which licence, is an open decision. We will publish the answer rather than imply one.',
  'web.pricing.faq.xCost.q': 'How much will X actually cost me',
  'web.pricing.faq.xCost.a':
    'It depends on how many posts you publish and how many of them contain a URL, because X prices those differently. Relay estimates each action before you confirm it and totals it in your usage view. We do not mark it up.',
  'web.pricing.faq.trialAbuse.q': 'Can I start a second trial',
  'web.pricing.faq.trialAbuse.a':
    'Repeat trials are limited by Polar. If you have a legitimate reason, contact support and a person will look at it.',

  /* ---------------------------------------------------------------------- */
  /* Resources index                                                         */
  /* ---------------------------------------------------------------------- */

  'web.resources.title': 'Recursos',
  'web.resources.lede':
    'La verdad operativa sobre el producto y la investigación detrás de todo lo que afirmamos sobre una plataforma.',
  'web.resources.status.body':
    'Estado actual de cada superficie y de cada conector, con historial de incidencias.',
  'web.resources.changelog.body': 'Qué se envió, qué cambió para un conector y qué corregimos.',
  'web.resources.docs.body': 'API REST, MCP, CLI y documentación de webhook.',
  'web.resources.methodology.body':
    'Cómo investigamos, fechamos, obtenemos y corregimos cada reclamo de la plataforma.',
  'web.resources.compare.body':
    'Comparaciones anticuadas con otras herramientas, incluido a quién le conviene cada una.',
  'web.resources.capabilities.body':
    'Por plataforma, por capacidad, generado a partir de las definiciones del conector.',
  'web.resources.toolRadar.body':
    'Herramientas creativas especializadas, anticuadas, con limitaciones y divulgación.',
  'web.resources.opportunities.body':
    'Lugares seleccionados para lanzar, listar o contribuir, con las reglas de cada destino.',
  'web.resources.legal.body':
    'Terms, privacy, acceptable use, AI use, security and the rest of the policy set.',
  'web.resources.guides.title': 'Guías y flujos de trabajo',
  'web.resources.guides.empty': 'Aún no se ha publicado ninguna guía.',
  'web.resources.guides.emptyBody':
    'El estándar editorial requiere datos originales del producto, un flujo de trabajo reproducible, fuentes de plataforma primarias con una fecha de verificación y un editor humano designado. Los primeros guías publican cuando lo encuentran.',

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.status.title': 'Estado',
  'web.status.lede':
    'El estado de cada superficie Relay y de cada conector. El estado del conector cubre nuestro adaptador y la API de plataforma de la que depende.',
  'web.status.updated': 'Checked {time}',
  'web.status.surfaces.title': 'Superficies',
  'web.status.connectors.title': 'Conectores',
  'web.status.level.operational': 'Operando normalmente',
  'web.status.level.degraded': 'degradado',
  'web.status.level.partial': 'Corte parcial',
  'web.status.level.outage': 'Corte',
  'web.status.level.maintenance': 'Mantenimiento planificado',
  'web.status.level.notLive': 'Aún no vivo',
  'web.status.notLiveBody':
    'Este conector está construido pero aún no recibe tráfico de clientes, por lo que no hay nada sobre lo que informar.',
  'web.status.incidents.title': 'Historial de incidentes',
  'web.status.incidents.empty': 'No se ha registrado ningún incidente',
  'web.status.incidents.emptyBody':
    'Esta página comienza vacía a propósito. Publicamos todos los incidentes que afectaron la publicación, incluidos los causados ​​por nuestros propios errores, con el cronograma y lo que cambió después.',
  'web.status.incident.started': 'Started {time}',
  'web.status.incident.resolved': 'Resolved {time}',
  'web.status.incident.impact': 'Impacto',
  'web.status.incident.cause': 'causa',
  'web.status.incident.followUp': '¿Qué cambió después?',
  'web.status.subscribe.title': 'Recibe un aviso cuando algo se rompa',
  'web.status.subscribe.body':
    'El estado de la conexión, los errores de publicación y los incidentes de la plataforma se envían como webhooks firmados a su propio punto final. Aún no existe una lista de correo de estado separada.',

  /* ---------------------------------------------------------------------- */
  /* Changelog                                                               */
  /* ---------------------------------------------------------------------- */

  'web.changelog.title': 'Registro de cambios',
  'web.changelog.lede':
    'Cambios de producto, cambios de conector y correcciones. Un cambio de capacidad que afecta lo que puede publicar aparece aquí antes de que aparezca en cualquier otro lugar de este sitio.',
  'web.changelog.kind.shipped': 'Enviado',
  'web.changelog.kind.changed': 'cambiado',
  'web.changelog.kind.fixed': 'Fijo',
  'web.changelog.kind.connector': 'Conector',
  'web.changelog.kind.correction': 'Corrección',
  'web.changelog.kind.security': 'Seguridad',
  'web.changelog.empty': 'Aún no se ha enviado nada públicamente',
  'web.changelog.emptyBody':
    'Relay está en construcción. La primera entrada aquí es lo primero que un cliente puede usar, no un hito sobre nosotros mismos.',

  /* ---------------------------------------------------------------------- */
  /* Docs shell                                                              */
  /* ---------------------------------------------------------------------- */

  'web.docs.title': 'Documentación',
  'web.docs.lede':
    'Un backend, cuatro entradas. Cada sección documenta los mismos casos de uso, por lo que un concepto que aprende en la API REST es el mismo concepto en MCP y en la CLI.',
  'web.docs.section.start.title': 'Empezando',
  'web.docs.section.start.body':
    'Autenticación, espacios de trabajo, marcas y tu primera publicación publicada.',
  'web.docs.section.api.title': 'API DESCANSO',
  'web.docs.section.api.body':
    'Recursos, paginación, idempotencia, códigos de error y límites de tarifas.',
  'web.docs.section.mcp.title': 'servidor MCP',
  'web.docs.section.mcp.body':
    'Transporte, OAuth, catálogo de herramientas, alcances y protocolo de enlace de aprobación.',
  'web.docs.section.cli.title': 'CLI',
  'web.docs.section.cli.body': 'Instalar, autenticar y el contrato de salida legible por máquina.',
  'web.docs.section.webhooks.title': 'Ganchos web',
  'web.docs.section.webhooks.body':
    'Catálogo de eventos, verificación de firmas, reintentos y reenvío.',
  'web.docs.section.connectors.title': 'Conectores',
  'web.docs.section.connectors.body':
    'Según los requisitos de la plataforma, tipos de cuenta, límites y restricciones conocidas.',
  'web.docs.section.errors.title': 'Referencia de error',
  'web.docs.section.errors.body': 'Cada código de error, qué lo causa y qué hacer al respecto.',
  'web.docs.pending': 'Aún no publicado',
  'web.docs.pendingBody':
    'Esta sección está escrita en base a la API enviada y se publica con ella. Preferimos mostrarle nada más que documentación de un punto final que podría cambiar.',
  'web.docs.principles.title': 'En qué puedes confiar',
  'web.docs.principles.idempotency':
    'Cada escritura requiere una clave de idempotencia. Reproducir una solicitud con la misma clave devuelve el resultado original en lugar de crear una segunda publicación.',
  'web.docs.principles.errors':
    'Cada error lleva un código estable, una clave de mensaje y detalles desinfectados. Los códigos no cambian de significado entre versiones.',
  'web.docs.principles.versioning':
    'Los cambios importantes obtienen una nueva versión y una ventana de obsolescencia anunciada. Los cambios aditivos no.',
  'web.docs.principles.scopes':
    'Leer, redactar, solicitar aprobación, programar y publicar son ámbitos separados. Una credencial obtiene el conjunto más pequeño que hace su trabajo.',

  /* ---------------------------------------------------------------------- */
  /* Methodology                                                             */
  /* ---------------------------------------------------------------------- */

  'web.methodology.title': 'Metodología',
  'web.methodology.lede':
    'Cómo se llega a considerar cierto algo en este sitio y qué sucede cuando resulta que no lo es.',
  'web.methodology.claims.title': 'Reclamaciones de plataforma',
  'web.methodology.claims.body':
    'Cada afirmación sobre lo que permite una plataforma proviene de la documentación o página de políticas de esa plataforma. Registramos la URL, la fecha en que se leyó, la versión de API donde se aplica y la persona propietaria que la vuelve a verificar. Un reclamo sin esas cuatro cosas no aparece en el sitio.',
  'web.methodology.recheck.title': 'Cuando volvemos a comprobar',
  'web.methodology.recheck.beforeConnector':
    'Antes de que se inicie un conector y nuevamente antes de que transporte tráfico de clientes.',
  'web.methodology.recheck.monthly':
    'Todos los meses para registros de cambios de plataforma y precios de proveedores.',
  'web.methodology.recheck.quarterly':
    'Cada trimestre para planes de la competencia, reglas comunitarias y documentos legales.',
  'web.methodology.recheck.immediate':
    'Inmediatamente después de cualquier rechazo de plataforma, aviso de cumplimiento, obsolescencia o un cambio inexplicable en el comportamiento de publicación o análisis.',
  'web.methodology.comparison.title': 'Comparaciones',
  'web.methodology.comparison.bestFor':
    'Cada comparación indica para quién es mejor cada producto, incluso cuando no somos nosotros.',
  'web.methodology.comparison.dated':
    'Cada comparación lleva la fecha de la investigación y vincula las principales fuentes de precios y capacidades.',
  'web.methodology.comparison.distinction':
    'Una capacidad faltante se etiqueta como algo que no hemos creado o como algo que la plataforma no permite. Estas son oraciones diferentes y nunca las fusionamos.',
  'web.methodology.comparison.noLogos':
    'No utilizamos logotipos, citas o capturas de pantalla de la interfaz de clientes de otras empresas, y no reclamamos un respaldo que no tengamos.',
  'web.methodology.benchmarks.title': 'Puntos de referencia y datos de productos',
  'web.methodology.benchmarks.body':
    'Cualquier número extraído de la actividad del cliente indica su muestra, sus exclusiones, su definición de métrica y su umbral de privacidad, y se agrega para que no se pueda identificar ningún espacio de trabajo. Si una muestra es demasiado pequeña para publicarla de forma segura, lo decimos en lugar de publicarla de todos modos.',
  'web.methodology.ai.title': 'IA en nuestro propio contenido',
  'web.methodology.ai.body':
    'Un modelo puede investigar, delinear, traducir, verificar y formatear. Una persona nombrada es propietaria de cada reclamo, edita el artículo y lo mantiene actualizado. No publicamos artículos generados no revisados ​​y no generamos capturas de pantalla.',
  'web.methodology.corrections.title': 'Correcciones',
  'web.methodology.corrections.body':
    'Cuando una página es incorrecta, la corregimos en su lugar, agregamos una nota de corrección con fecha y enumeramos la corrección en el registro de cambios. Cuando una página está demasiado obsoleta para arreglarla, la retiramos en lugar de dejarla activa.',

  /* ---------------------------------------------------------------------- */
  /* Compare                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.compare.title': 'Comparaciones',
  'web.compare.lede':
    'Estas páginas son útiles incluso si eliges el otro producto. Ese es el estándar que deben cumplir antes de publicar.',
  'web.compare.rules.title': 'Las reglas que siguen estas páginas.',
  'web.compare.rules.bestFor':
    'Cada página indica para quién es mejor el otro producto, en su propia sección, primero.',
  'web.compare.rules.dated':
    'Cada reclamo está fechado y vincula la fuente principal de donde proviene.',
  'web.compare.rules.distinction':
    'Separamos lo que no hemos construido de lo que una plataforma no permite.',
  'web.compare.rules.axes':
    'Cada página compara los mismos aspectos: asignación de cuenta, límites de publicación, equipo y aprobación, acceso a API, MCP y CLI, idiomas de contenido, análisis, manejo de videos, uso integrado, alojamiento propio, soporte y el costo de API de la plataforma que usted paga además.',
  'web.compare.rules.correction':
    'Cada página lleva un contacto de corrección y una fecha de revisión.',
  'web.compare.planned.title': 'Páginas planificadas',
  'web.compare.planned.body':
    'Estos se publican una vez que se completa la verificación de capacidad y precios actuales. Una comparación escrita de memoria es peor que ninguna comparación.',
  'web.compare.empty': 'Aún no se ha publicado ninguna comparación.',
  'web.compare.emptyBody':
    'Cada página necesita una nueva verificación de datos con respecto a los precios y la documentación del otro producto. Publican uno a la vez a medida que finaliza el trabajo.',

  /* ---------------------------------------------------------------------- */
  /* Tool radar                                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.title': 'Radar de herramientas creativas',
  'web.toolRadar.lede':
    'Relay no genera imágenes ni vídeos. Le ayuda a decidir qué herramienta especializada utilizar y a traer el activo terminado con su registro de derechos intacto.',
  'web.toolRadar.record.title': 'Lo que cada disco tiene que llevar',
  'web.toolRadar.record.url': 'La URL oficial y la organización propietaria del producto.',
  'web.toolRadar.record.useCase':
    'El flujo de trabajo para el que se recomienda y sus limitaciones documentadas.',
  'web.toolRadar.record.pricing': 'Su modelo de precios y la fecha en que lo comprobamos.',
  'web.toolRadar.record.rights':
    'Sus derechos, licencias, retención y advertencias de privacidad, en palabras del propio proveedor.',
  'web.toolRadar.record.disclosure':
    'Si tenemos alguna relación comercial con ella. La clasificación nunca depende de eso.',
  'web.toolRadar.record.verified':
    'Una última fecha de verificación y una advertencia visible una vez que un registro pasa su ventana de revisión.',
  'web.toolRadar.category.title': 'Categorías',
  'web.toolRadar.empty': 'El catálogo aún no está completo.',
  'web.toolRadar.emptyBody':
    'Los registros los redacta una persona a partir de la documentación propia del proveedor. No llenaremos esta página con enlaces generados por modelos que parezcan plausibles.',
  'web.toolRadar.noAffiliateYet':
    'No existe ninguna relación de afiliación con ninguna de las herramientas enumeradas aquí hoy.',

  /* ---------------------------------------------------------------------- */
  /* Opportunities                                                           */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.title': 'Oportunidades de promoción',
  'web.opportunities.lede':
    'Un catálogo seleccionado de lugares donde se puede lanzar, enumerar, discutir o contribuir un producto, con las reglas que cada destino se establece.',
  'web.opportunities.rules.title': 'Cómo se comporta este catálogo',
  'web.opportunities.rules.curated':
    'Cada entrada es un registro revisado con una URL oficial, las reglas de envío actuales y una fecha de verificación. Un modelo no descubre nada y lo presenta como verificado.',
  'web.opportunities.rules.noAutomation':
    'Relay nunca envía un formulario, elimina un contacto, envía correos electrónicos masivos o publica publicaciones en una comunidad por usted. Tú haces la presentación.',
  'web.opportunities.rules.noGuarantee':
    'Un listado no es una promesa de clasificación y un enlace no es una estrategia de crecimiento. Mostramos requisitos de idoneidad, audiencia, esfuerzo, costo y divulgación para que usted pueda decidir si vale la pena pasar la tarde.',
  'web.opportunities.rules.stale':
    'Un registro que ha pasado su fecha de revisión se etiqueta u oculta en lugar de mostrarse como actual.',
  'web.opportunities.category.title': 'Categorías',
  'web.opportunities.empty': 'El catálogo aún no está completo.',
  'web.opportunities.emptyBody':
    'Las reglas de cada destino deben ser leídas y registradas por una persona antes de poder recomendarlas. Las categorías se enumeran arriba para que pueda ver la forma de lo que está por venir.',

  /* ---------------------------------------------------------------------- */
  /* Legal, shared                                                           */
  /* ---------------------------------------------------------------------- */

  'web.legal.title': 'Legal and policies',
  'web.legal.lede':
    'The documents that govern using Relay. Where the wording has to be drafted by a lawyer for a specific company and jurisdiction, the page says so instead of pretending.',
  'web.legal.counselPending.title': 'Pending review by counsel before launch',
  'web.legal.counselPending.body':
    'The substance on this page reflects how the product actually behaves and is accurate today. The binding legal wording, the governing jurisdiction and the liability terms are being drafted with qualified counsel and will replace this text before Relay is generally available. This page is not legal advice and it is not a contract yet.',
  'web.legal.contact.title': 'Contact',
  'web.legal.contact.privacy': 'privacy@relay.example',
  'web.legal.contact.legal': 'legal@relay.example',
  'web.legal.contact.security': 'security@relay.example',
  'web.legal.contact.abuse': 'abuse@relay.example',
  'web.legal.contact.copyright': 'copyright@relay.example',
  'web.legal.contact.affiliates': 'affiliates@relay.example',
  'web.legal.contact.accessibility': 'accessibility@relay.example',
  'web.legal.entity.pending':
    'The contracting entity, its registered address and the governing jurisdiction are an open decision and will be named here before launch.',
  'web.legal.index.updated': 'Updated {date}',

  /* Terms ---------------------------------------------------------------- */
  'web.legal.terms.title': 'Terms of Service',
  'web.legal.terms.summary':
    'What Relay agrees to provide, what you agree to do, and what happens when either side stops.',
  'web.legal.terms.service.title': 'What the service is',
  'web.legal.terms.service.body':
    'Relay is a hosted service for creating, approving, scheduling and publishing content to social platforms through those platforms official APIs, together with the receipts, analytics and audit records that result. It is not a social platform and it does not control what any platform does with a post once it is published.',
  'web.legal.terms.content.title': 'Your content stays yours',
  'web.legal.terms.content.body':
    'You keep ownership of everything you upload, write or import. You grant Relay only the licence needed to store it, process it, adapt it into the variants you ask for, and transmit it to the accounts you selected. That licence ends when you delete the content, apart from records we are required to keep.',
  'web.legal.terms.warranties.title': 'What you are confirming when you publish',
  'web.legal.terms.warranties.body':
    'That you are authorized to publish to the accounts you connected, that you hold the rights to the content and the media, that you have the consent required for any person appearing in it, and that publishing it does not breach the destination platform rules.',
  'web.legal.terms.platforms.title': 'Platform dependence',
  'web.legal.terms.platforms.body':
    'Connectors depend on third party APIs that those companies control. A platform can change its API, restrict a permission, revoke an application or close access with little notice. Relay cannot guarantee that any connector remains available, and a connector becoming unavailable is not a failure of this agreement. We will tell you on the status page and the changelog when it happens.',
  'web.legal.terms.ai.title': 'AI output',
  'web.legal.terms.ai.body':
    'Text assistance, translation, transcreation and planning features produce suggestions. They can be wrong, out of date or unsuitable. You are responsible for reviewing anything you publish. Relay does not generate images or video.',
  'web.legal.terms.billing.title': 'Payment',
  'web.legal.terms.billing.body':
    'Polar is the merchant of record. Polar handles checkout, taxes, invoices and refunds. Subscriptions renew automatically at the interval you chose until you cancel. Platform usage that a provider charges per operation is billed separately at cost and is disclosed before the action that incurs it.',
  'web.legal.terms.suspension.title': 'Suspension and scheduled posts',
  'web.legal.terms.suspension.body':
    'If a subscription lapses or a workspace is suspended, scheduled posts stop rather than publishing silently, and the workspace becomes read only. Your content, receipts and connections are preserved and remain exportable.',
  'web.legal.terms.aup.title': 'Acceptable use',
  'web.legal.terms.aup.body':
    'The Acceptable Use Policy forms part of these terms. We may rate limit, pause, require verification, revoke agent or API access, suspend or terminate for a breach of it, and you may appeal any of those decisions to a person.',
  'web.legal.terms.termination.title': 'Ending the agreement',
  'web.legal.terms.termination.body':
    'You can cancel at any time from Settings. After termination you keep an export window before deletion, and deletion is never made conditional on paying an outstanding invoice, other than the billing records we are legally required to retain.',
  'web.legal.terms.developer.title': 'API, MCP and service accounts',
  'web.legal.terms.developer.body':
    'Programmatic access is governed additionally by the API and MCP Terms, including rate limits, scope requirements and the rule that a service account never inherits a human full permissions.',

  /* Privacy -------------------------------------------------------------- */
  'web.legal.privacy.title': 'Privacy Policy',
  'web.legal.privacy.summary':
    'What Relay collects, why, who processes it, how long it is kept, and how to get it out or have it deleted.',
  'web.legal.privacy.collect.title': 'What we hold',
  'web.legal.privacy.collect.account':
    'Account and profile: your name, email, workspace membership and role.',
  'web.legal.privacy.collect.connections':
    'Social connections: the platform account identifier, its display name, its type, the granted scopes and an encrypted access token. Tokens are stored with envelope encryption and are never written to a log.',
  'web.legal.privacy.collect.content':
    'Content and media you create, upload or import, including the rights and provenance you record with it.',
  'web.legal.privacy.collect.schedules':
    'Schedules, approval decisions, publication receipts and audit events.',
  'web.legal.privacy.collect.analytics':
    'Metrics retrieved from platforms about posts you published through Relay.',
  'web.legal.privacy.collect.billing':
    'Billing references held by Polar. Relay does not store your card details.',
  'web.legal.privacy.collect.technical':
    'Device and log data needed to operate and secure the service, redacted by default.',
  'web.legal.privacy.collect.agent':
    'Agent and API activity: which credential took which action, with an input hash rather than the input.',
  'web.legal.privacy.minimization.title': 'What we deliberately do not do',
  'web.legal.privacy.minimization.scopes':
    'We request only the platform scopes the features you have enabled actually need.',
  'web.legal.privacy.minimization.history':
    'We do not ingest your entire social history in order to draw a chart.',
  'web.legal.privacy.minimization.logs':
    'Post content is redacted from general logs and from support tooling.',
  'web.legal.privacy.minimization.training':
    'Your content is not used to train our models or anyone models by default.',
  'web.legal.privacy.subprocessors.title': 'Who else processes it',
  'web.legal.privacy.subprocessors.body':
    'The current subprocessor list is published separately and changes are announced there before they take effect.',
  'web.legal.privacy.retention.title': 'How long we keep it',
  'web.legal.privacy.rights.title': 'Your controls',
  'web.legal.privacy.rights.export':
    'Download your content, receipts and analytics as JSON and CSV with a media archive.',
  'web.legal.privacy.rights.revoke':
    'Disconnect one social account without deleting the workspace. Tokens are revoked at the platform and deleted here.',
  'web.legal.privacy.rights.delete':
    'Delete a brand, a piece of content, a media file or the entire account.',
  'web.legal.privacy.rights.cancelJobs':
    'Cancel scheduled jobs before deleting anything, so nothing publishes after you leave.',
  'web.legal.privacy.rights.sessions':
    'See and revoke active sessions, API keys, agent credentials, webhooks and platform permissions.',
  'web.legal.privacy.rights.consent':
    'Consent preferences are versioned and auditable, so you can see what you agreed to and when.',
  'web.legal.privacy.deletion.title': 'Deleting data held at a platform',
  'web.legal.privacy.deletion.body':
    'Disconnecting an account in Relay revokes the token at the platform and deletes the credential here. Content already published on a platform is governed by that platform and has to be deleted there. Where a platform requires deletion of derived data within a fixed period after revocation, we meet that period. For Google and YouTube data that period is currently 30 days.',
  'web.legal.privacy.transfers.title': 'International transfers',
  'web.legal.privacy.transfers.body':
    'Hosting regions and the transfer mechanism are being finalized with counsel and will be named here, together with the safeguards that apply, before launch.',

  /* Acceptable use ------------------------------------------------------- */
  'web.legal.aup.title': 'Acceptable Use Policy',
  'web.legal.aup.summary':
    'Relay helps you publish content you are authorized to publish. It is not built to help anyone evade a platform limit, fake an endorsement or send unwanted messages.',
  'web.legal.aup.prohibited.title': 'Not permitted',
  'web.legal.aup.prohibited.spam':
    'Spam, unsolicited bulk messages, replies or mentions, engagement bait, and repeated unwanted content.',
  'web.legal.aup.prohibited.linkSchemes':
    'Automated directory or form submissions, bulk outreach, link schemes, paid or reciprocal links intended to manipulate search ranking, and community promotion that breaks the destination rules.',
  'web.legal.aup.prohibited.inauthentic':
    'Coordinated inauthentic behaviour, multi account amplification presented as independent, engagement pods, fake reviews, ratings or install counts, automated likes and follows, and trend manipulation.',
  'web.legal.aup.prohibited.duplicate':
    'Publishing duplicate or substantially similar content across many accounts where the platform prohibits it.',
  'web.legal.aup.prohibited.impersonation':
    'Impersonation, phishing, fraud, scams, malware, credential theft and deceptive installation.',
  'web.legal.aup.prohibited.harm':
    'Harassment, doxxing, sexual exploitation, non consensual intimate media, hate or violent extremist content, and illegal goods or services.',
  'web.legal.aup.prohibited.political':
    'Political manipulation and automated political persuasion where it is prohibited. Political content, where permitted at all, is subject to enhanced review.',
  'web.legal.aup.prohibited.rights':
    'Copyright, trademark and publicity violations, unlicensed music or media, synthetic likenesses without rights and disclosure, and undisclosed paid endorsements.',
  'web.legal.aup.prohibited.circumvention':
    'Bypassing official APIs, rate limits, audits, account controls or platform enforcement using browser automation, cookie replay or scraping.',
  'web.legal.aup.prohibited.restrictedStores':
    'Automated submission to app stores, the Chrome Web Store or other restricted submission systems through unauthorized interfaces.',
  'web.legal.aup.prohibited.banEvasion':
    'Evading an account ban or running coordinated account farms.',
  'web.legal.aup.prohibited.training':
    'Training or evaluating models on third party or other customers content without authorization.',
  'web.legal.aup.controls.title': 'The controls that enforce this',
  'web.legal.aup.controls.duplicate':
    'Exact and near duplicate fingerprinting by workspace, account, platform and time window, with a cross account similarity check.',
  'web.legal.aup.controls.cadence':
    'Account level and workspace level cadence budgets, plus mention, hashtag, URL and domain volume checks.',
  'web.legal.aup.controls.escalation':
    'New account, new domain and bulk action escalation, and a maximum number of repetitions for any repeating campaign.',
  'web.legal.aup.controls.linkSafety':
    'Destination scanning on short links, with emergency disable and an abuse report channel.',
  'web.legal.aup.controls.workspaceCaps':
    'A workspace owner can set stricter limits than the plan allows. Risk controls cannot be loosened by paying more.',
  'web.legal.aup.enforcement.title': 'Enforcement and appeal',
  'web.legal.aup.enforcement.body':
    'Where we can, we block before the external action rather than after it, and we record the reason, the rule version and the appeal path. Repeated or serious behaviour goes to a trust review by a person. You will be told what happened, without a level of detail that would help someone evade the check. Every decision can be appealed and reversed.',
  'web.legal.aup.report.title': 'Reporting abuse',
  'web.legal.aup.report.body':
    'If content published through Relay breaks these rules, tell us. Include the post URL and what is wrong with it.',

  /* AI policy ------------------------------------------------------------ */
  'web.legal.ai.title': 'AI Use and Generated Content Policy',
  'web.legal.ai.summary':
    'Which features use a model, what is sent, what is kept, what you stay responsible for, and why Relay does not generate media.',
  'web.legal.ai.features.title': 'Where a model is used',
  'web.legal.ai.features.text':
    'Text assistance in the composer: rewriting, shortening and adapting for a platform.',
  'web.legal.ai.features.translation':
    'Translation and transcreation into your content languages, against your brand glossary.',
  'web.legal.ai.features.feedback': 'Content feedback and the four week growth plan.',
  'web.legal.ai.features.provider':
    'These features call DeepSeek. The model identifiers currently in use are published in the documentation and any change is listed on the changelog.',
  'web.legal.ai.data.title': 'What is sent, and what happens to it',
  'web.legal.ai.data.sent':
    'Only the text you asked us to work on, the instruction, and the brand context you chose to attach. Credentials, tokens and other customers content are never in a model context.',
  'web.legal.ai.data.training':
    'Your content is not used to train our models. We configure providers so it is not used to train theirs.',
  'web.legal.ai.data.optOut':
    'Optional AI features can be turned off per workspace. Publishing, scheduling, approvals and analytics do not depend on them.',
  'web.legal.ai.responsibility.title': 'What stays yours',
  'web.legal.ai.responsibility.body':
    'A model can be confidently wrong. You are responsible for checking facts, claims, names, numbers and tone before you publish, and for any disclosure a platform requires. No AI feature guarantees reach, engagement or ranking, and none is offered as one.',
  'web.legal.ai.disclosure.title': 'Disclosure and provenance',
  'web.legal.ai.disclosure.body':
    'Relay records whether content was AI assisted in its internal history, reminds you where a platform requires an altered or synthetic media disclosure, and stores the provenance you provide with an imported asset. Where a platform offers a disclosure field, Relay sets it from your declaration rather than guessing.',
  'web.legal.ai.blocks.title': 'What the AI features refuse',
  'web.legal.ai.blocks.impersonation': 'Impersonating a real person or a public figure.',
  'web.legal.ai.blocks.ncii': 'Non consensual intimate imagery, in any form.',
  'web.legal.ai.blocks.fabrication':
    'Fabricated testimonials, invented customers and invented performance figures.',
  'web.legal.ai.blocks.unverified':
    'Presenting a model generated URL as a verified opportunity. Opportunity and tool recommendations come only from the curated catalog.',
  'web.legal.ai.noMedia.title': 'Why there is no image or video generation',
  'web.legal.ai.noMedia.body':
    'Relay has not collected the verified visual system, product detail, asset rights, likeness permissions and campaign context that brand ready output would require, and in app generation would need its own consent, provenance, safety evaluation and cost controls. Media model capability, licensing, pricing and retention also change quickly, which is why our tool recommendations carry dates. You keep creative control by choosing a specialist tool and importing the approved asset. Relay handles adaptation, approval, publishing and measurement.',
  'web.legal.ai.noMedia.caveat':
    'A tool appearing in our radar is not a statement that its output is safe or rights cleared. Its documented caveats are shown with it and your normal rights declaration still applies.',

  /* Cookies -------------------------------------------------------------- */
  'web.legal.cookies.title': 'Cookie Policy',
  'web.legal.cookies.summary':
    'What is stored in your browser, why, and what happens if you refuse the optional parts.',
  'web.legal.cookies.essential.title': 'Strictly necessary',
  'web.legal.cookies.essential.body':
    'A session cookie that keeps you signed in, a cross site request forgery token, and a preference cookie holding your theme and time zone choice. These cannot be turned off without breaking sign in, and they are not used for advertising.',
  'web.legal.cookies.analytics.title': 'Product analytics',
  'web.legal.cookies.analytics.body':
    'Aggregate, first party measurement of which screens are used, so we can fix the ones that are not working. It is optional, it is off until you allow it, and refusing it changes nothing about the product.',
  'web.legal.cookies.marketing.title': 'Advertising',
  'web.legal.cookies.marketing.body':
    'We do not run advertising cookies, we do not embed third party advertising pixels, and we do not sell or share personal information for cross context behavioural advertising.',
  'web.legal.cookies.shortLinks.title': 'Tracked short links',
  'web.legal.cookies.shortLinks.body':
    'A short link click creates first party analytics for the workspace that owns the link. Location and device data are minimized, bot traffic is classified out, IP addresses are truncated or discarded promptly, and a workspace can turn tracking off or shorten retention. Nothing sensitive is ever put in a slug or a query parameter.',
  'web.legal.cookies.control.title': 'Changing your mind',
  'web.legal.cookies.control.body':
    'The consent choice is stored with a version and can be changed at any time in Settings, under data controls. Withdrawing consent takes effect immediately.',

  /* Subprocessors -------------------------------------------------------- */
  'web.legal.subprocessors.title': 'Subprocessors',
  'web.legal.subprocessors.summary':
    'The companies that process customer data on our behalf, what they do, and where.',
  'web.legal.subprocessors.notice.title': 'Change notice',
  'web.legal.subprocessors.notice.body':
    'A new subprocessor is published here before it starts processing customer data, with at least 30 days notice for a change that materially affects processing. Customers with a data processing addendum can object during that window.',
  'web.legal.subprocessors.column.name': 'Subprocessor',
  'web.legal.subprocessors.column.purpose': 'What it processes for us',
  'web.legal.subprocessors.column.data': 'Data categories',
  'web.legal.subprocessors.column.region': 'Processing region',
  'web.legal.subprocessors.platforms.title': 'Social platforms are not subprocessors',
  'web.legal.subprocessors.platforms.body':
    'When you publish, Relay transmits your content to the platform account you selected, at your instruction. Those platforms are independent controllers of what they receive and their own terms govern it.',

  /* Refunds -------------------------------------------------------------- */
  'web.legal.refunds.title': 'Refund and Cancellation Policy',
  'web.legal.refunds.summary':
    'How to cancel, what happens to your data, and when you get money back.',
  'web.legal.refunds.cancel.title': 'Cancelling',
  'web.legal.refunds.cancel.body':
    'Cancel from Settings without contacting support. Cancelling during the seven day trial means no charge is attempted and the cancellation screen confirms that in writing. Cancelling after the trial keeps your access until the end of the period you already paid for.',
  'web.legal.refunds.refund.title': 'Refunds',
  'web.legal.refunds.refund.body':
    'If the service did not work as described, contact support and we will refund the affected period. Mandatory consumer withdrawal rights, including the statutory cooling off period where it applies to you, are honoured in full and are not limited by anything on this page. Refunds are issued by Polar, our merchant of record, to the original payment method.',
  'web.legal.refunds.usage.title': 'Platform usage charges',
  'web.legal.refunds.usage.body':
    'Usage passed through from a platform, such as X per operation pricing, covers a cost we already paid on your behalf for an action you confirmed. It is refundable when the charge was our error, for example a duplicate dispatch caused by a defect on our side.',
  'web.legal.refunds.data.title': 'What happens to your data',
  'web.legal.refunds.data.body':
    'Nothing is deleted at cancellation. The workspace becomes read only, scheduled posts stop rather than publishing, and you keep an export window before deletion. Deletion is never made conditional on paying an invoice, apart from the billing records we must keep by law.',
  'web.legal.refunds.failed.title': 'A failed payment',
  'web.legal.refunds.failed.body':
    'Polar retries and emails you. During the grace period publishing continues. After it, the workspace becomes read only and scheduled posts stop. Nothing is disconnected and nothing is deleted.',

  /* DMCA ----------------------------------------------------------------- */
  'web.legal.dmca.title': 'Copyright and Takedown',
  'web.legal.dmca.summary':
    'How to report content hosted by Relay that infringes your rights, and how to respond if yours was removed.',
  'web.legal.dmca.scope.title': 'What we can act on',
  'web.legal.dmca.scope.body':
    'Relay can remove material stored in our systems, such as a media file or a draft. Content already published on a social platform lives on that platform and has to be reported to it, because we cannot delete a post we do not host. We will tell you which of the two applies to your report.',
  'web.legal.dmca.notice.title': 'Sending a notice',
  'web.legal.dmca.notice.identify':
    'Identify the copyrighted work and the material you say infringes it, with a URL we can reach.',
  'web.legal.dmca.notice.contact': 'Give your name, address, telephone number and email.',
  'web.legal.dmca.notice.goodFaith':
    'State that you believe in good faith that the use is not authorized by the rights holder, its agent or the law.',
  'web.legal.dmca.notice.accuracy':
    'State that the information is accurate and, under penalty of perjury, that you are authorized to act for the rights holder.',
  'web.legal.dmca.notice.signature': 'Sign it, physically or electronically.',
  'web.legal.dmca.counter.title': 'Counter notice',
  'web.legal.dmca.counter.body':
    'If your material was removed and you believe that was a mistake or a misidentification, you can send a counter notice with the same contact details, identifying the material and where it was, and consenting to the jurisdiction that will be named here. We will forward it to the person who complained.',
  'web.legal.dmca.repeat.title': 'Repeat infringers',
  'web.legal.dmca.repeat.body':
    'Accounts that repeatedly infringe are suspended and then terminated. Bad faith notices, used to remove a competitor content, are also grounds for termination.',

  /* Security ------------------------------------------------------------- */
  'web.legal.security.title': 'Security and Responsible Disclosure',
  'web.legal.security.summary':
    'How Relay protects the credentials you trust it with, and how to report a problem you find.',
  'web.legal.security.tokens.title': 'Social credentials',
  'web.legal.security.tokens.body':
    'Platform tokens are encrypted with envelope encryption under a managed key, rotated, stored apart from content and billing data, and redacted from every log. A token is never sent to a browser, never placed in a model context and never included in an error message.',
  'web.legal.security.tenancy.title': 'Tenancy',
  'web.legal.security.tenancy.body':
    'Isolation is enforced three times: at the edge when you authenticate, in the application service when it authorizes the action, and in PostgreSQL through row level security. Being signed in is never treated as permission. Cross workspace access attempts are tested in continuous integration and must fail.',
  'web.legal.security.publishing.title': 'Publishing integrity',
  'web.legal.security.publishing.body':
    'Every external write carries an idempotency key and produces an immutable receipt. Duplicate publication is treated as a defect with a target of zero, and the test suite includes worker crashes after platform acceptance, platform timeouts, duplicated webhooks, revoked tokens at dispatch and daylight saving transitions.',
  'web.legal.security.program.title': 'The programme',
  'web.legal.security.program.threatModel':
    'A written threat model covering OAuth, tenancy, publishing, MCP, media, billing and analytics.',
  'web.legal.security.program.pentest':
    'An independent security review focused on token leakage and cross tenant access before paid launch.',
  'web.legal.security.program.access':
    'Least privilege production access, multi factor authentication, and a device and session inventory.',
  'web.legal.security.program.supplyChain':
    'Dependency and container scanning with patch service levels, and signed build provenance where practical.',
  'web.legal.security.program.logging':
    'Centralized logging that redacts by default, with anomaly alerting.',
  'web.legal.security.program.backups':
    'Encrypted backups with tested restoration and a documented rotation.',
  'web.legal.security.disclosure.title': 'Reporting a vulnerability',
  'web.legal.security.disclosure.body':
    'Email us with enough detail to reproduce the issue. We acknowledge within two business days, keep you updated, and credit you when you want the credit. Please do not access another customer data, degrade the service, or run automated scanning against production. Test against your own workspace.',
  'web.legal.security.disclosure.safeHarbor':
    'We will not pursue legal action for good faith research that follows this policy. The exact safe harbour wording is with counsel.',
  'web.legal.security.incidents.title': 'If something goes wrong',
  'web.legal.security.incidents.body':
    'We have an incident response plan with named decision makers, severity levels, evidence preservation and notification duties. Incidents that affected publishing are published on the status page with a timeline and what changed afterwards, including the ones we caused.',

  /* Accessibility -------------------------------------------------------- */
  'web.legal.accessibility.title': 'Accessibility Statement',
  'web.legal.accessibility.summary':
    'The standard Relay is built to, what we have verified, what we know is not right yet, and how to tell us.',
  'web.legal.accessibility.standard.title': 'The standard',
  'web.legal.accessibility.standard.body':
    'Relay targets WCAG 2.2 level AA across the product and this site. Accessibility is a merge requirement here, not a later ticket, and a screen that fails it does not ship.',
  'web.legal.accessibility.measures.title': 'What that means in practice',
  'web.legal.accessibility.measures.keyboard':
    'Everything is operable from the keyboard, with a visible focus ring and a logical focus order. There is no drag only interaction anywhere.',
  'web.legal.accessibility.measures.contrast':
    'Every colour pair in the design system is asserted at 4.5 to 1 for body text and 3 to 1 for large text and control edges, in both the light and the dark theme, by an automated test.',
  'web.legal.accessibility.measures.colour':
    'Status, capability and freshness always carry an icon and a word as well as a colour.',
  'web.legal.accessibility.measures.announcements':
    'Save state, validation changes, upload progress, schedule confirmation and publish results are announced to screen readers.',
  'web.legal.accessibility.measures.zoom':
    'Layouts work at 320 pixels wide and at 200 percent zoom without horizontal page scrolling. Wide tables scroll inside their own container.',
  'web.legal.accessibility.measures.motion':
    'A reduced motion preference removes every non essential transition.',
  'web.legal.accessibility.measures.targets':
    'Touch targets are at least 44 pixels on a coarse pointer.',
  'web.legal.accessibility.known.title': 'Known gaps',
  'web.legal.accessibility.known.body':
    'We will list specific known issues here with a fix date as they are found, rather than claiming full conformance. An independent audit is planned before general availability and its findings will be published here.',
  'web.legal.accessibility.feedback.title': 'Tell us about a barrier',
  'web.legal.accessibility.feedback.body':
    'Describe what you were trying to do, the page, and the assistive technology you use. We reply within five business days and will offer another way to complete the task while we fix it.',

  /* API and MCP terms ---------------------------------------------------- */
  'web.legal.apiTerms.title': 'API and MCP Terms',
  'web.legal.apiTerms.summary':
    'Additional terms for programmatic access, including agent credentials, rate limits and what a service account may never do.',
  'web.legal.apiTerms.credentials.title': 'Credentials',
  'web.legal.apiTerms.credentials.body':
    'An API key or agent credential identifies a scoped service account. It is not a copy of a person account and it never inherits their full permissions. Keys are shown once, are revocable at any time, and must not be embedded in a client application or a public repository.',
  'web.legal.apiTerms.scopes.title': 'Scopes',
  'web.legal.apiTerms.scopes.body':
    'Reading, drafting, requesting approval, scheduling, publishing immediately, cancelling, analytics and billing are separate scopes. Request the smallest set the integration needs. Immediate publishing and other high risk actions require explicit human confirmation by default and that default is set per workspace, not per credential.',
  'web.legal.apiTerms.limits.title': 'Rate limits and idempotency',
  'web.legal.apiTerms.limits.body':
    'Every write requires an idempotency key. Replaying a request with the same key returns the original result. Rate limits are published in the documentation and are returned in the response headers, and a limit response tells you when it resets.',
  'web.legal.apiTerms.agents.title': 'Agent behaviour',
  'web.legal.apiTerms.agents.body':
    'A single call may not silently publish to every connected account. Bulk actions, a new domain, a new account, a sensitive category, a paid endorsement, a privacy change or content altered after approval always escalate for a human decision. Every agent and every workspace has a kill switch.',
  'web.legal.apiTerms.prohibited.title': 'Not permitted through the API',
  'web.legal.apiTerms.prohibited.body':
    'Reselling access without a written agreement, using Relay as a relay for content you are not authorized to publish, circumventing approval policy, and any use that breaks the Acceptable Use Policy. Programmatic access is subject to the same anti spam controls as the web app.',
  'web.legal.apiTerms.changes.title': 'Change policy',
  'web.legal.apiTerms.changes.body':
    'Additive changes ship without notice. Breaking changes get a new version, an announced deprecation window and a migration note on the changelog. Error codes do not change meaning within a version.',

  /* Affiliate terms ------------------------------------------------------ */
  'web.legal.affiliate.title': 'Affiliate and Creator Terms',
  'web.legal.affiliate.summary':
    'What we pay, what we require, and what will get an account closed.',
  'web.legal.affiliate.commission.title': 'Commission',
  'web.legal.affiliate.commission.body':
    'Recurring commission on referred subscriptions for up to twelve months, subject to fraud review. Commission is held until the refund window closes and is reversed if the customer refunds. Payouts run through Polar.',
  'web.legal.affiliate.disclosure.title': 'Disclosure is not optional',
  'web.legal.affiliate.disclosure.body':
    'Every place you share a referral link must disclose the commercial relationship clearly and close to the link, in the language of the audience. This applies to videos, posts, newsletters, articles and community replies alike.',
  'web.legal.affiliate.honesty.title': 'Paid for work, not for praise',
  'web.legal.affiliate.honesty.body':
    'A sponsored tutorial contract never requires a positive conclusion. You may publish criticism and still be paid. We do not buy reviews, votes, ratings or installs, and we do not offer an incentive conditional on a positive review.',
  'web.legal.affiliate.prohibited.title': 'Grounds for closing an affiliate account',
  'web.legal.affiliate.prohibited.brandBidding':
    'Bidding on our brand terms in paid search, or running ads that imply you are us.',
  'web.legal.affiliate.prohibited.spam':
    'Unsolicited email, mass community posting, or link dropping in threads that did not ask.',
  'web.legal.affiliate.prohibited.cookieStuffing':
    'Cookie stuffing, forced clicks, self referral and coupon squatting.',
  'web.legal.affiliate.prohibited.claims':
    'Inventing customer results, fabricating a testimonial, or claiming Relay does something it does not, including anything about AI media generation.',
  'web.legal.affiliate.prohibited.trademark':
    'Registering a domain, handle or app listing that uses our name in a way that suggests you are the company.',

  /* ---------------------------------------------------------------------- */
  /* Platform names and per platform facts                                   */
  /* ---------------------------------------------------------------------- */

  'web.marketing.provider.x.label': 'x',
  'web.marketing.provider.linkedin.label': 'LinkedIn',
  'web.marketing.provider.instagram.label': 'Instagram',
  'web.marketing.provider.facebook.label': 'facebook',
  'web.marketing.provider.youtube.label': 'YouTube',
  'web.marketing.provider.tiktok.label': 'TikTok',
  'web.marketing.provider.threads.label': 'Threads',
  'web.marketing.provider.bluesky.label': 'Bluesky',

  'web.marketing.provider.x.accountTypes':
    'Una cuenta X personal o empresarial que usted controle.',
  'web.marketing.provider.x.restriction':
    'La publicación automatizada requiere el consentimiento expreso del titular de la cuenta, que Relay registra. No se permiten publicaciones duplicadas o sustancialmente similares entre cuentas, y no se crean respuestas automáticas no solicitadas.',
  'web.marketing.provider.x.cost':
    'X cobra por cada operación de API y cobra más por una publicación que contiene una URL. Relay estima el costo antes de que usted lo confirme y lo transfiere sin recargo.',

  'web.marketing.provider.linkedin.accountTypes':
    'Un perfil de miembro o una página de organización en la que desempeña el rol adecuado.',
  'web.marketing.provider.linkedin.restriction':
    'La publicación en nombre de una organización necesita un producto de gestión comunitaria aprobado y una identidad comercial verificada. Los análisis de publicaciones de miembros dependen de un permiso de lectura que LinkedIn ha cerrado a nuevas aplicaciones, por lo que Relay no lo ofrecerá.',
  'web.marketing.provider.linkedin.cost':
    'Sin cargo por operación. Se aplican límites diarios de solicitud y de miembros.',

  'web.marketing.provider.instagram.accountTypes':
    'Una cuenta profesional Instagram, empresa o creador.',
  'web.marketing.provider.instagram.restriction':
    'La publicación de contenido Instagram está disponible solo para cuentas profesionales. Ninguna aplicación, incluida esta, puede publicar una cuenta de consumidor. La publicación utiliza el contenedor oficial y la secuencia de publicación, y Relay confirma el estado final en lugar de informar que la carga fue exitosa.',
  'web.marketing.provider.instagram.cost':
    'Sin cargo por operación. Se requiere revisión de la metaaplicación y verificación comercial.',

  'web.marketing.provider.facebook.accountTypes': 'Una página de Facebook que usted administra.',
  'web.marketing.provider.facebook.restriction':
    'El destino de publicación es una página. La API no ofrece la automatización de un perfil personal y Relay no lo intenta.',
  'web.marketing.provider.facebook.cost':
    'Sin cargo por operación. Se requiere revisión de la metaaplicación y verificación comercial.',

  'web.marketing.provider.youtube.accountTypes':
    'Un canal YouTube conectado a través de tu cuenta de Google.',
  'web.marketing.provider.youtube.restriction':
    'Un proyecto que no haya pasado la auditoría de cumplimiento de la API de Google solo puede cargarse como privado. Relay no describirá la carga pública como disponible hasta que pase la auditoría y la pantalla de conexión indique en qué estado llegarán sus cargas.',
  'web.marketing.provider.youtube.cost':
    'Sin cargo por operación. Se aplica una cuota diaria y no se puede compartir entre proyectos.',

  'web.marketing.provider.tiktok.accountTypes':
    'Una cuenta de TikTok con autorización de Publicación Directa.',
  'web.marketing.provider.tiktok.restriction':
    'Hasta que pase la auditoría de la API de publicación de contenido, las publicaciones son privadas y se aplican límites por cuenta. En el momento de la publicación, Relay recupera la información del creador actual, muestra las opciones de privacidad disponibles sin preseleccionar una y solicita la configuración de comentarios, dúo y puntada y la declaración de contenido comercial.',
  'web.marketing.provider.tiktok.cost':
    'Sin cargo por operación. El modo no auditado aplica límites de publicación diaria.',

  'web.marketing.provider.threads.accountTypes':
    'Un perfil de Threads vinculado a una cuenta profesional de Instagram.',
  'web.marketing.provider.threads.restriction':
    'La publicación sigue el contenedor Meta y la secuencia de publicación. Las capacidades se verifican con la colección oficial antes de que algo aquí se considere compatible.',
  'web.marketing.provider.threads.cost': 'Sin cargo por operación.',

  'web.marketing.provider.bluesky.accountTypes':
    'Una cuenta de Bluesky en cualquier proveedor de hosting.',
  'web.marketing.provider.bluesky.restriction':
    'Un protocolo abierto sin paso de revisión de la solicitud. Los límites de tarifas y de tamaño de registros aún se aplican y se aplican antes del envío.',
  'web.marketing.provider.bluesky.cost': 'Sin cargo por operación.',
  'web.marketing.provider.mastodon.label': 'Mastodon',
  'web.marketing.provider.mastodon.accountTypes': 'Una cuenta de Mastodon en cualquier instancia.',
  'web.marketing.provider.mastodon.restriction':
    'Un protocolo abierto sin paso de revisión de aplicación. El límite de caracteres lo fija cada instancia y se respetan sus límites de ritmo.',
  'web.marketing.provider.mastodon.cost': 'Sin cargo por operación.',
  'web.marketing.provider.telegram.label': 'Telegram',
  'web.marketing.provider.telegram.accountTypes':
    'Un bot de Telegram que controlas, publicando en un canal o grupo.',
  'web.marketing.provider.telegram.restriction':
    'Un bot solo puede publicar donde se le ha añadido. El token del bot es una credencial de aplicación y el chat destino se elige por conexión.',
  'web.marketing.provider.telegram.cost': 'Sin cargo por operación.',
  'web.marketing.provider.reddit.label': 'Reddit',
  'web.marketing.provider.reddit.accountTypes': 'Una cuenta de Reddit autorizada para publicar.',
  'web.marketing.provider.reddit.restriction':
    'Escribir en Reddit requiere una aplicación aprobada. Las publicaciones son de texto o enlace en subreddits donde puedes publicar; no hay comentarios ni votos automáticos.',
  'web.marketing.provider.reddit.cost': 'Sin cargo por operación.',
  'web.marketing.provider.wordpress.label': 'WordPress',
  'web.marketing.provider.wordpress.accountTypes':
    'Un sitio WordPress con contraseña de aplicación.',
  'web.marketing.provider.wordpress.restriction':
    'Las publicaciones salen por la API REST del sitio como el usuario conectado. La subida de imágenes y vídeos aún no está construida.',
  'web.marketing.provider.wordpress.cost': 'Sin cargo por operación.',
  'web.marketing.provider.medium.label': 'Medium',
  'web.marketing.provider.medium.accountTypes': 'Un perfil de autor de Medium conectado por OAuth.',
  'web.marketing.provider.medium.restriction':
    'Las publicaciones salen como historias públicas en Markdown. La API de integración no tiene borrado, así que no se ofrece.',
  'web.marketing.provider.medium.cost': 'Sin cargo por operación.',
  'web.marketing.provider.devto.label': 'Dev.to',
  'web.marketing.provider.devto.accountTypes': 'Un perfil de Dev.to conectado con su clave API.',
  'web.marketing.provider.devto.restriction':
    'Los artículos salen como publicaciones Markdown públicas. La subida de imágenes y las analíticas aún no están construidas.',
  'web.marketing.provider.devto.cost': 'Sin cargo por operación.',
  'web.marketing.provider.pinterest.label': 'Pinterest',
  'web.marketing.provider.pinterest.accountTypes':
    'Una cuenta empresarial de Pinterest conectada por OAuth.',
  'web.marketing.provider.pinterest.restriction':
    'Un pin requiere una imagen y un tablero propio. Escribir requiere revisión de la aplicación y los tableros se leen al conectar.',
  'web.marketing.provider.pinterest.cost': 'Sin cargo por operación.',
  'web.marketing.provider.discord.label': 'Discord',
  'web.marketing.provider.discord.accountTypes':
    'Un bot de Discord que controlas, publicando en canales de texto.',
  'web.marketing.provider.discord.restriction':
    'El bot solo puede publicar en los canales que ve. Los mensajes de texto están soportados; los archivos aún no.',
  'web.marketing.provider.discord.cost': 'Sin cargo por operación.',
  'web.marketing.provider.slack.label': 'Slack',
  'web.marketing.provider.slack.accountTypes':
    'Un espacio de Slack conectado mediante una app OAuth.',
  'web.marketing.provider.slack.restriction':
    'Los mensajes salen a canales públicos y privados donde está la app. La subida de archivos y las analíticas aún no están construidas.',
  'web.marketing.provider.slack.cost': 'Sin cargo por operación.',

  /* ---------------------------------------------------------------------- */
  /* Capability matrix notes                                                 */
  /* ---------------------------------------------------------------------- */

  'web.capabilities.short.supported': 'Apoyado',
  'web.capabilities.short.unsupported': 'La plataforma no lo ofrece.',
  'web.capabilities.short.not_implemented': 'Aún no construido',
  'web.capabilities.short.requires_review': 'Necesita revisión de plataforma',
  'web.capabilities.notesTitle': 'Notas y fuentes',
  'web.capabilities.noteRef': 'Note {number}',
  'web.capabilities.summary':
    '{supported, plural, one {# capacidades admitidas} many {# capacidades admitidas} other {# capacidades admitidas}}, {requiresReview, plural, one {# esperando una revisión de la plataforma} many {# esperando una revisión de la plataforma} other {# esperando una revisión de la plataforma}}, {notImplemented, plural, one {# aún no construido} many {# aún no construido} other {# aún no construido}}, {unsupported, plural, one {# la plataforma no oferta} many {# la plataforma no ofrece} other {# la plataforma no ofrece}}.',
  'web.capabilities.buildState.title': 'Ningún conector transporta tráfico de clientes todavía',
  'web.capabilities.buildState.body':
    'Relay está en construcción. Esta tabla refleja las definiciones de los conectores tal como están hoy en día, razón por la cual la mayoría de las celdas se leen como aún no construidas. Una celda solo recibe soporte después de que ese conector pasa su definición de terminado, incluidas las pruebas de contrato contra los accesorios de plataforma registrados. Las celdas que dicen que una plataforma no ofrece algo, o que la ocultan tras una reseña, son datos sobre la plataforma y ya son definitivos.',
  'web.capabilities.note.instagramProfessional':
    'Solo cuentas profesionales. Ninguna aplicación puede publicar una cuenta de consumidor.',
  'web.capabilities.note.facebookPagesOnly':
    'Sólo páginas. La API no publica en un perfil personal.',
  'web.capabilities.note.youtubeAudit':
    'Hasta que pase la auditoría de cumplimiento de la API de Google, las cargas se consideran privadas.',
  'web.capabilities.note.tiktokAudit':
    'Hasta que pase la auditoría de la API de publicación de contenido, las publicaciones son privadas y están limitadas.',
  'web.capabilities.note.tiktokPrivacy':
    'La opción de privacidad se obtiene en el momento de la publicación y debe ser elegida por una persona.',
  'web.capabilities.note.linkedinMemberAnalytics':
    'El análisis de publicaciones de miembros necesita un permiso de lectura. LinkedIn se ha cerrado a nuevas aplicaciones.',
  'web.capabilities.note.linkedinOrgAccess':
    'Requiere un producto de Community Management aprobado y un negocio verificado.',
  'web.capabilities.note.linkedinDocuments':
    'LinkedIn es la única plataforma conectada con un tipo de publicación de documentos.',
  'web.capabilities.note.metaReview':
    'Requiere revisión de la meta aplicación y verificación comercial.',
  'web.capabilities.note.xConsent':
    'Requiere el consentimiento registrado del titular de la cuenta para la publicación automática.',
  'web.capabilities.note.xDisclosure':
    'La plataforma proporciona un campo hecho con IA, que Relay establece a partir de su declaración.',
  'web.capabilities.note.noDestinations':
    'Esta plataforma no tiene ningún concepto de destino como página, tablero o comunidad.',
  'web.capabilities.note.noThreads':
    'Esta plataforma no tiene una secuencia nativa de publicaciones múltiples.',
  'web.capabilities.note.noDocuments':
    'Esta plataforma no tiene ningún tipo de publicación de documentos.',
  'web.capabilities.note.videoOnly': 'Esta plataforma solo acepta cargas de videos.',
  'web.capabilities.note.noAltText':
    'Esta plataforma no acepta texto alternativo a través de su API de publicación.',
  'web.capabilities.note.noPrivacyChoice':
    'Esta plataforma no ofrece una opción de privacidad por publicación a través de su API.',
  'web.capabilities.note.noThumbnail':
    'Esta plataforma no acepta una miniatura personalizada a través de su API.',
  'web.capabilities.note.inBuild': 'La plataforma ofrece esto. Relay aún no lo ha enviado.',
  'web.capabilities.note.noCarousel': 'La plataforma no ofrece un carrusel deslizable.',
  'web.capabilities.note.noDisclosure':
    'La plataforma no tiene campo de divulgación para contenido IA o comercial.',
  'web.capabilities.note.noAnalytics':
    'La plataforma no expone métricas de interacción por su API oficial.',
  'web.capabilities.note.redditReview':
    'Escribir en Reddit requiere una aplicación aprobada para la API de datos.',
  'web.capabilities.note.redditMedia':
    'Las publicaciones con imagen y vídeo aún no están construidas para Reddit.',
  'web.capabilities.note.mediumImages': 'La API de integración no acepta adjuntos de imagen.',
  'web.capabilities.note.mediumNoDelete': 'La API de integración no tiene endpoint de borrado.',
  'web.capabilities.note.devtoImages':
    'La API acepta solo cuerpos de artículo; la subida de imágenes aún no está construida.',
  'web.capabilities.note.pinterestNeedsImage':
    'Un pin requiere una imagen; no existen pines solo de texto.',
  'web.capabilities.note.pinterestReview':
    'Escribir en Pinterest requiere acceso de aplicación aprobado.',

  /* ---------------------------------------------------------------------- */
  /* Status page surfaces                                                    */
  /* ---------------------------------------------------------------------- */

  'web.status.surface.web': 'aplicación web',
  'web.status.surface.api': 'API DESCANSO',
  'web.status.surface.mcp': 'servidor MCP',
  'web.status.surface.cli': 'CLI',
  'web.status.surface.webhooks': 'Entrega de webhook',
  'web.status.surface.publishing': 'Trabajadores editoriales',
  'web.status.surface.media': 'Procesamiento de medios',
  'web.status.surface.analytics': 'Colección de análisis',
  'web.status.surface.links': 'Redirecciones de enlaces cortos',
  'web.status.surface.checkout': 'Pago y facturación',
  'web.status.preLaunch.title': 'Relay aún no está disponible de forma generalizada',
  'web.status.preLaunch.body':
    'Esta página está activa antes que el producto, por lo que el hábito de informar existe desde el primer cliente en lugar de agregarse después de la primera interrupción. Las superficies que aún están en construcción se marcan como tales en lugar de mostrarse como en buen estado.',

  /* ---------------------------------------------------------------------- */
  /* Comparison targets                                                      */
  /* ---------------------------------------------------------------------- */

  'web.compare.product.postiz': 'Postiz',
  'web.compare.product.buffer': 'búfer',
  'web.compare.product.hootsuite': 'hootsuite',
  'web.compare.product.later': 'Más tarde',
  'web.compare.product.metricool': 'Metricool',
  'web.compare.product.publer': 'publicador',
  'web.compare.product.socialbee': 'Abeja social',
  'web.compare.product.typefully': 'tipográficamente',
  'web.compare.product.publishingApis': 'API de publicación para desarrolladores',
  'web.compare.state.factCheckPending': 'Verificación de hechos en progreso',

  /* ---------------------------------------------------------------------- */
  /* Tool radar categories                                                   */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.category.video': 'Generación y edición de videos.',
  'web.toolRadar.category.image': 'Generación y edición de imágenes.',
  'web.toolRadar.category.audio': 'Audio, voz y música.',
  'web.toolRadar.category.ugc': 'Vídeo de estilo de avatar y creador.',
  'web.toolRadar.category.clipping': 'Vídeo largo a clips cortos',
  'web.toolRadar.category.design': 'Diseño y maquetación',
  'web.toolRadar.category.research': 'Investigación y recopilación de fuentes.',
  'web.toolRadar.category.workflow': 'Automatización del flujo de trabajo',

  /* ---------------------------------------------------------------------- */
  /* Opportunity categories                                                  */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.category.launch': 'Directorios de lanzamiento y puesta en marcha de productos',
  'web.opportunities.category.review': 'Directorios de software y reseñas',
  'web.opportunities.category.marketplace': 'Mercados de integración y automatización',
  'web.opportunities.category.community': 'Hilos de exhibición de la comunidad que permiten envíos',
  'web.opportunities.category.partner': 'Ecosistemas de socios y directorios de integración',
  'web.opportunities.category.editorial': 'Tutoriales para invitados, podcasts y boletines',
  'web.opportunities.category.openSource': 'Listas de código abierto y recursos de documentación',

  /* ---------------------------------------------------------------------- */
  /* Subprocessors and retention                                             */
  /* ---------------------------------------------------------------------- */

  'web.legal.subprocessors.neon.label': 'Neon',
  'web.legal.subprocessors.neon.purpose': 'Managed PostgreSQL, authentication and object storage.',
  'web.legal.subprocessors.neon.data':
    'Account records, content, media, schedules, receipts and audit events.',
  'web.legal.subprocessors.temporal.label': 'Temporal Cloud',
  'web.legal.subprocessors.temporal.purpose':
    'Durable execution of publishing, retry and scheduling workflows.',
  'web.legal.subprocessors.temporal.data':
    'Workflow inputs limited to identifiers and minimized payloads.',
  'web.legal.subprocessors.polar.label': 'Polar',
  'web.legal.subprocessors.polar.purpose':
    'Merchant of record: checkout, subscriptions, taxes, invoices and refunds.',
  'web.legal.subprocessors.polar.data':
    'Name, email, billing address, payment method held by Polar, and subscription state.',
  'web.legal.subprocessors.deepseek.label': 'DeepSeek',
  'web.legal.subprocessors.deepseek.purpose':
    'Text assistance, translation and transcreation, and planning suggestions.',
  'web.legal.subprocessors.deepseek.data':
    'Only the text you submit to an AI feature and the brand context you attached to it.',
  'web.legal.subprocessors.hosting.label': 'Application hosting and content delivery',
  'web.legal.subprocessors.hosting.purpose':
    'Serving the web app, the API and the short link service.',
  'web.legal.subprocessors.hosting.data': 'Request metadata and redacted logs.',
  'web.legal.subprocessors.email.label': 'Transactional email delivery',
  'web.legal.subprocessors.email.purpose':
    'Sign in links, approval requests, publish result notifications and trial reminders.',
  'web.legal.subprocessors.email.data': 'Name, email address and the message content.',
  'web.legal.subprocessors.monitoring.label': 'Error and performance monitoring',
  'web.legal.subprocessors.monitoring.purpose':
    'Diagnosing failures in publishing and in the interface.',
  'web.legal.subprocessors.monitoring.data':
    'Redacted stack traces, request identifiers and workspace identifiers. Post content is stripped.',
  'web.legal.subprocessors.region.pending': 'Region being confirmed',
  'web.legal.subprocessors.vendorPending': 'Vendor being selected',

  'web.legal.retention.column.data': 'Data',
  'web.legal.retention.column.period': 'How long it is kept',
  'web.legal.retention.credentials.label': 'Active platform credentials',
  'web.legal.retention.credentials.period':
    'Encrypted while the connection is active. Revoked at the platform and deleted here as soon as you disconnect.',
  'web.legal.retention.oauthState.label': 'OAuth transaction state',
  'web.legal.retention.oauthState.period': 'Minutes, then deleted.',
  'web.legal.retention.drafts.label': 'Drafts and media',
  'web.legal.retention.drafts.period':
    'While the account is active, or your own retention setting, with a trash grace period.',
  'web.legal.retention.receipts.label': 'Publication receipts and audit events',
  'web.legal.retention.receipts.period':
    'Kept for the plan and legal retention period, minimized, and exportable at any time.',
  'web.legal.retention.rawProvider.label': 'Raw platform responses',
  'web.legal.retention.rawProvider.period':
    'The shortest period needed for debugging and compliance, then minimized or deleted.',
  'web.legal.retention.metrics.label': 'Analytics observations',
  'web.legal.retention.metrics.period':
    'The plan retention period, within what the platform terms allow.',
  'web.legal.retention.securityLogs.label': 'Security logs',
  'web.legal.retention.securityLogs.period':
    'A fixed window between 30 and 180 days depending on the risk of the event.',
  'web.legal.retention.billing.label': 'Billing records',
  'web.legal.retention.billing.period':
    'The statutory accounting retention period, held by Polar and by us.',
  'web.legal.retention.deletedAccount.label': 'A deleted account',
  'web.legal.retention.deletedAccount.period':
    'Credentials revoked and scheduled work cancelled immediately. Full deletion completes within the published window, apart from lawful billing records.',
  'web.legal.retention.backups.label': 'Backups',
  'web.legal.retention.backups.period':
    'Encrypted and access controlled, expiring on a documented rotation. A deletion propagates through the restore process.',

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.footer.product': 'Producto',
  'web.footer.company': 'Empresa',
  'web.footer.resources': 'Recursos',
  'web.footer.legal': 'Legales',
  'web.footer.developers': 'Desarrolladores',
  'web.footer.statement':
    'Relay publica únicamente a través de las API de la plataforma oficial. La disponibilidad del conector depende de las aprobaciones que controlan las plataformas, y cada afirmación de capacidad en este sitio tiene fecha y origen.',
  'web.footer.noAffiliation':
    'Los nombres y marcas de las plataformas pertenecen a sus propietarios. Su uso aquí identifica un conector y no implica respaldo ni asociación.',
  'web.footer.copyright': 'Relay {year}',
} as const;
