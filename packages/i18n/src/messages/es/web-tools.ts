export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadatos                                                              */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': 'Herramientas de publicación gratuitas',
  'web.meta.tools.description':
    'Pequeñas herramientas privadas para quienes publican en varias plataformas: una verificación de límite por plataforma, un constructor de UTM, una verificación de longitud de título de YouTube y un planificador de zona horaria.',
  'web.meta.tools.preflight.title': 'Verificador de publicación previo',
  'web.meta.tools.preflight.description':
    'Verifica un borrador contra los límites de texto y medios publicados de diez plataformas, con la fuente y la fecha en que se leyó cada límite.',
  'web.meta.tools.utm.title': 'Constructor de enlaces UTM',
  'web.meta.tools.utm.description':
    'Compón una URL de campaña etiquetada y mira qué significa cada parámetro UTM. Funciona completamente en tu navegador.',
  'web.meta.tools.youtubeTitle.title': 'Verificador de longitud de título de YouTube',
  'web.meta.tools.youtubeTitle.description':
    'Mide un título de YouTube contra el tope documentado, contado como una persona cuenta los caracteres.',
  'web.meta.tools.timeZone.title': 'Planificador de zona horaria y horario de verano',
  'web.meta.tools.timeZone.description':
    'Mira un horario de publicación en varias zonas de audiencia y encuentra las semanas en las que un cambio de horario de verano desplaza la hora local.',
  'web.meta.tools.engagementRate.title': 'Calculadora de tasa de interacción',
  'web.meta.tools.engagementRate.description':
    'Divide interacciones por alcance, seguidores o impresiones. Tres cálculos simples, sin referencia inventada.',

  /* ---------------------------------------------------------------------- */
  /* Elementos compartidos entre herramientas                              */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'Herramientas gratuitas',
  'web.tools.index.summary':
    'Pequeñas calculadoras construidas sobre los mismos datos de límite de plataforma que leen nuestros conectores.',
  'web.tools.index.lede':
    'Cuatro pequeñas herramientas, construidas sobre los mismos datos de límite de plataforma que usan nuestros conectores. Sin cuenta, sin subir archivos, sin rastrear lo que escribes.',
  'web.tools.index.dataTitle': 'De dónde vienen los números',
  'web.tools.index.dataBody':
    'Cada límite se genera a partir del código de capacidad de conectores de este repositorio, y cada fila de plataforma trae la página de documentación oficial de la que vino y la fecha en que una persona leyó esa página.',
  'web.tools.index.honesty':
    'Estas herramientas no publican nada. Ningún conector completó la verificación del proveedor todavía, así que nada aquí conecta una cuenta.',
  'web.tools.shared.privacyTitle': 'Esto funciona en tu navegador',
  'web.tools.shared.privacyBody':
    'Todo lo que escribes se queda en esta página. No hay solicitud a un servidor, ningún almacenamiento y ningún evento de análisis que lleve tu texto.',
  'web.tools.shared.sourceLink': 'Documentación de la plataforma',
  'web.tools.shared.sourceRead': 'Leído el {date}',
  'web.tools.shared.unavailable': 'no disponible',
  'web.tools.shared.unavailableWhy':
    'Todavía no tenemos un conector para esta plataforma, así que no tenemos un límite verificado para mostrar. Preferimos no decir nada a adivinar.',
  'web.tools.shared.copy': 'Copiar',
  'web.tools.shared.copied': 'Copiado',
  'web.tools.shared.copyFailed': 'Tu navegador bloqueó la copia. Selecciona el texto y cópialo.',
  'web.tools.shared.faqTitle': 'Preguntas',
  'web.tools.shared.baselineTitle': 'Qué cuenta describen estos números',
  'web.tools.shared.baselineBody':
    'El caso conservador: una cuenta recién conectada sin elegibilidad elevada. Algunas plataformas suben un tope en cuanto se verifica un canal o un negocio, y donde eso pasa, la página lo dice.',
  'web.tools.shared.otherTools': 'Otras herramientas',

  /* ---------------------------------------------------------------------- */
  /* Nombres de herramientas y resúmenes de una línea                      */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'Verificador de publicación previo',
  'web.tools.preflight.summary':
    'Un borrador, verificado contra los límites de texto y medios de diez plataformas a la vez.',
  'web.tools.utm.name': 'Constructor de enlaces UTM',
  'web.tools.utm.summary': 'Compón una URL de campaña etiquetada sin estropear la query string que ya tenía.',
  'web.tools.youtubeTitle.name': 'Verificador de longitud de título de YouTube',
  'web.tools.youtubeTitle.summary': 'Mide un título como lo cuenta una persona.',
  'web.tools.timeZone.name': 'Planificador de zona horaria y horario de verano',
  'web.tools.timeZone.summary':
    'Un horario de publicación en varias zonas de audiencia, con los cambios de horario de verano marcados.',
  'web.tools.engagementRate.name': 'Calculadora de tasa de interacción',
  'web.tools.engagementRate.summary':
    'Interacciones divididas por alcance, seguidores o impresiones. Nada se consulta, nada se usa como referencia.',

  /* ---------------------------------------------------------------------- */
  /* Verificador de publicación previo                                     */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'Verificador de publicación previo',
  'web.tools.preflight.lede':
    'Pega un borrador, elige las plataformas en las que publicas, y mira cuáles lo rechazarían antes de que te enteres por un error de la API.',
  'web.tools.preflight.explainer.title': 'Por qué un contador de caracteres no basta',
  'web.tools.preflight.explainer.body':
    'Las plataformas no se ponen de acuerdo sobre qué es un carácter. Algunas cuentan unidades de código, así que un emoji cuesta dos. Algunas cuentan grafemas, así que una bandera o un emoji de familia cuesta uno. Algunas reescriben todo enlace a un ancho fijo, así que una URL de 200 caracteres cuesta lo mismo que una de 20. Esta herramienta aplica la regla de cada plataforma por separado.',
  'web.tools.preflight.explainer.counting':
    'El borrador se mide con el segmentador Intl del navegador, que divide el texto en las unidades que un lector llamaría caracteres, y luego se ajusta según la regla de la plataforma.',
  'web.tools.preflight.field.draft.label': 'Tu borrador',
  'web.tools.preflight.field.draft.help':
    'Pega el cuerpo de la publicación. Los enlaces se detectan automáticamente para que su costo se pueda aplicar por plataforma.',
  'web.tools.preflight.field.platforms.label': 'Plataformas a verificar',
  'web.tools.preflight.field.platforms.help': 'Elige tantas como publiques.',
  'web.tools.preflight.field.mediaKind.label': 'Medios adjuntos',
  'web.tools.preflight.field.mediaKind.none': 'Sin medios',
  'web.tools.preflight.field.mediaKind.image': 'Imágenes',
  'web.tools.preflight.field.mediaKind.video': 'Un video',
  'web.tools.preflight.field.mediaCount.label': 'Cuántas imágenes',
  'web.tools.preflight.field.byteSize.label': 'Tamaño del archivo en megabytes',
  'web.tools.preflight.field.byteSize.help': 'El archivo único más grande. Déjalo vacío para saltarlo.',
  'web.tools.preflight.field.duration.label': 'Duración del video en segundos',
  'web.tools.preflight.field.duration.help': 'Déjalo vacío para saltar la verificación de duración.',
  'web.tools.preflight.field.width.label': 'Ancho del medio en píxeles',
  'web.tools.preflight.field.height.label': 'Alto del medio en píxeles',
  'web.tools.preflight.field.dimensions.help':
    'Opcional. Se usa solo para mostrar la proporción que estarías publicando.',
  'web.tools.preflight.results.title': 'Resultado por plataforma',
  'web.tools.preflight.results.empty': 'Elige al menos una plataforma para ver un resultado.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Nada bloqueando} other {# fallarían}}, {warning, plural, =0 {sin avisos} other {# para revisar}}.',
  'web.tools.preflight.status.pass': 'Cabe',
  'web.tools.preflight.status.warning': 'Vale la pena revisar',
  'web.tools.preflight.status.fail': 'Fallaría',
  'web.tools.preflight.status.unavailable': 'No disponible',
  'web.tools.preflight.count.label':
    '{count} de {limit} {unit, select, grapheme {caracteres} utf16 {unidades de código} weighted {caracteres ponderados} other {caracteres}}',
  'web.tools.preflight.finding.textOver':
    'Por encima del límite en {over, plural, one {# carácter} many {# caracteres} other {# caracteres}}.',
  'web.tools.preflight.finding.textNear': 'A {remaining} caracteres del límite.',
  'web.tools.preflight.finding.textFits': 'El cuerpo cabe.',
  'web.tools.preflight.finding.linkFixed':
    'Todo enlace se reescribe a un ancho fijo, así que cada uno cuesta {cost} caracteres sin importar su longitud real.',
  'web.tools.preflight.finding.linkActual': 'Los enlaces cuentan por los caracteres que ocupan.',
  'web.tools.preflight.finding.imagesOver':
    'Esta plataforma acepta {limit, plural, =0 {ninguna imagen} one {# imagen} other {# imágenes}} en una publicación.',
  'web.tools.preflight.finding.videosOver':
    'Esta plataforma acepta {limit, plural, =0 {ningún video} one {# video} other {# videos}} en una publicación.',
  'web.tools.preflight.finding.bytesOver': 'El archivo es más grande que el tope de {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    'No hay tope de bytes publicado para este tipo de medio, así que no se verificó el tamaño.',
  'web.tools.preflight.finding.durationOver': 'Más largo que el tope de {limit} segundos.',
  'web.tools.preflight.finding.durationUnder': 'Más corto que el mínimo de {limit} segundos.',
  'web.tools.preflight.finding.durationUnknown':
    'No hay tope de duración publicado, así que no se verificó la longitud.',
  'web.tools.preflight.finding.altText':
    'El texto alternativo se acepta hasta {limit} caracteres, lo cual vale la pena usar.',
  'web.tools.preflight.finding.ratio': 'Estarías publicando en aproximadamente {ratio} a 1.',
  'web.tools.preflight.faq.counting.q': '¿Cómo cuentan los caracteres?',
  'web.tools.preflight.faq.counting.a':
    'Por grafema, usando el segmentador Intl del navegador, que es la unidad que un lector entiende por carácter. Donde una plataforma documenta una regla diferente, como contar unidades de código o cobrar un ancho fijo por enlace, esa regla se aplica encima.',
  'web.tools.preflight.faq.accuracy.q': '¿Qué tan actuales son estos límites?',
  'web.tools.preflight.faq.accuracy.a':
    'Cada límite se genera a partir del código de conectores de nuestro repositorio en lugar de escribirse en una página, y cada fila de plataforma muestra el documento oficial del que vino y la fecha en que una persona lo leyó. Si una plataforma cambia un número, la corrección es un cambio de código y toda herramienta aquí lo sigue.',
  'web.tools.preflight.faq.privacy.q': '¿Se sube mi borrador a algún lugar?',
  'web.tools.preflight.faq.privacy.a':
    'No. La verificación se ejecuta en tu navegador. No hay solicitud que lleve tu texto, nada se guarda, y cerrar la pestaña es suficiente para descartarlo.',
  'web.tools.preflight.faq.publish.q': '¿Esta herramienta puede publicar por mí?',
  'web.tools.preflight.faq.publish.a':
    'Todavía no. Ningún conector completó la verificación del proveedor, así que nada en este sitio publica en una plataforma todavía. Esta página es una verificación de límite, no un compositor.',

  /* ---------------------------------------------------------------------- */
  /* Constructor de UTM                                                    */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'Constructor de enlaces UTM',
  'web.tools.utm.lede':
    'Agrega parámetros de campaña a una URL sin perder la query string que ya tenía, y sin adivinar qué significa cada parámetro.',
  'web.tools.utm.explainer.title': 'Para qué sirve cada parámetro',
  'web.tools.utm.explainer.body':
    'Los parámetros UTM los leen las herramientas de análisis, no la plataforma en la que publicas. Viajan en la URL, así que cualquiera que vea el enlace los ve. Mantenlos cortos, en minúsculas y consistentes, porque dos formas de escribir la misma campaña se convierten en dos filas en un informe.',
  'web.tools.utm.field.url.label': 'URL de destino',
  'web.tools.utm.field.url.help': 'La página a la que quieres que llegue la gente, incluyendo https.',
  'web.tools.utm.field.url.invalid': 'Eso no se interpreta como una URL http o https.',
  'web.tools.utm.field.source.label': 'Origen de la campaña',
  'web.tools.utm.field.source.help': 'De dónde vino el clic. Por ejemplo el nombre de una plataforma.',
  'web.tools.utm.field.medium.label': 'Medio de la campaña',
  'web.tools.utm.field.medium.help': 'El tipo de enlace. Por ejemplo social, email o referido.',
  'web.tools.utm.field.campaign.label': 'Nombre de la campaña',
  'web.tools.utm.field.campaign.help': 'El lanzamiento, promoción o tema al que pertenece este enlace.',
  'web.tools.utm.field.term.label': 'Término de la campaña',
  'web.tools.utm.field.term.help': 'Opcional. Tradicionalmente la palabra clave pagada.',
  'web.tools.utm.field.content.label': 'Contenido de la campaña',
  'web.tools.utm.field.content.help':
    'Opcional. Separa dos enlaces a la misma página, por ejemplo dos versiones de una publicación.',
  'web.tools.utm.result.title': 'Tu URL etiquetada',
  'web.tools.utm.result.empty': 'Escribe una URL de destino para ver el resultado.',
  'web.tools.utm.result.label': 'URL compuesta',
  'web.tools.utm.result.preserved':
    'La query string que ya tenía tu URL se mantiene exactamente como la escribiste.',
  'web.tools.utm.result.replaced':
    'Tu URL ya traía uno de estos parámetros. El valor que escribiste aquí lo reemplaza.',
  'web.tools.utm.faq.encoding.q': '¿Qué pasa con los espacios y los acentos?',
  'web.tools.utm.faq.encoding.a':
    'Se codifican en porcentaje, que es lo que hace que un enlace sobreviva al pegarlo en una publicación. Un espacio se convierte en un signo más y una letra acentuada se convierte en su forma codificada, y las herramientas de análisis decodifican ambas de vuelta.',
  'web.tools.utm.faq.existing.q': '¿Va a romper una URL que ya tiene parámetros?',
  'web.tools.utm.faq.existing.a':
    'No. Los parámetros existentes se conservan en su orden original, y solo se agrega o reemplaza un parámetro UTM que hayas completado. Un fragmento al final de la URL se queda al final.',
  'web.tools.utm.faq.privacy.q': '¿Se envía mi URL a algún lugar?',
  'web.tools.utm.faq.privacy.a':
    'No. La URL se compone en tu navegador y nunca sale de esta página.',

  /* ---------------------------------------------------------------------- */
  /* Verificador de longitud de título de YouTube                          */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'Verificador de longitud de título de YouTube',
  'web.tools.youtubeTitle.lede':
    'Un título con un carácter de más se rechaza al subirlo. Un título simplemente largo se corta en un punto que tú no elegiste.',
  'web.tools.youtubeTitle.explainer.title': 'Dos límites diferentes',
  'web.tools.youtubeTitle.explainer.body':
    'El tope duro es lo que acepta el punto de subida. Dónde se muestra un título es una pregunta aparte: un resultado de búsqueda, una barra lateral y un teléfono cortan un título en un punto diferente, y ninguno de esos puntos de corte se publica. Esta herramienta afirma el tope documentado y muestra la forma de tu título, y no inventa un número de corte.',
  'web.tools.youtubeTitle.field.title.label': 'Título del video',
  'web.tools.youtubeTitle.field.title.help': 'Contado por grafema, así que un emoji cuesta uno.',
  'web.tools.youtubeTitle.result.count': '{count} de {limit} caracteres',
  'web.tools.youtubeTitle.result.over':
    'Por encima en {over, plural, one {# carácter} many {# caracteres} other {# caracteres}}. La subida se rechazaría.',
  'web.tools.youtubeTitle.result.fits': 'Dentro del tope documentado.',
  'web.tools.youtubeTitle.result.front':
    'Los primeros {count} caracteres tienen más peso, porque es aproximadamente lo que cabe en un diseño estrecho. El tuyo empieza así: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'El límite de título no está disponible en esta versión, así que no se verifica nada aquí.',
  'web.tools.youtubeTitle.faq.limit.q': '¿De dónde viene el límite?',
  'web.tools.youtubeTitle.faq.limit.a':
    'De la referencia oficial de inserción de videos, generada en esta página a partir del mismo código de conector que usaría nuestra subida. La fecha en que una persona leyó esa página por última vez aparece junto al número.',
  'web.tools.youtubeTitle.faq.truncation.q': '¿Dónde exactamente corta YouTube un título?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'Depende de la superficie y el viewport, y YouTube no publica un conteo de caracteres para eso. Mostramos el tope, que está documentado, y no imprimimos un número de corte que sería una suposición.',
  'web.tools.youtubeTitle.faq.emoji.q': '¿Un emoji cuenta como un carácter?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'En este contador sí, porque contamos grafemas. Una plataforma que cuenta unidades de código internamente puede cobrar más por el mismo emoji, y por eso el verificador de publicación aplica la regla de cada plataforma por separado.',

  /* ---------------------------------------------------------------------- */
  /* Planificador de zona horaria y horario de verano                     */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'Planificador de zona horaria y horario de verano',
  'web.tools.timeZone.lede':
    'Un horario semanal que parece estable en tu calendario se mueve para la mitad de tu audiencia dos veces al año. Esto muestra dónde y cuándo.',
  'web.tools.timeZone.explainer.title': 'Por qué una hora local fija no es una hora fija',
  'web.tools.timeZone.explainer.body':
    'Una hora solo significa algo con una zona adjunta. Las zonas cambian su desplazamiento en fechas que varían según el país, y dos regiones que están cinco horas separadas en enero pueden estar cuatro horas separadas en abril. Un cronograma guardado como un instante más una zona sobrevive a eso. Un cronograma guardado como una hora local no.',
  'web.tools.timeZone.field.date.label': 'Fecha',
  'web.tools.timeZone.field.time.label': 'Hora',
  'web.tools.timeZone.field.zone.label': 'Tu zona',
  'web.tools.timeZone.field.audience.label': 'Zonas de audiencia',
  'web.tools.timeZone.field.audience.help': 'Elige las zonas en las que realmente están tus lectores.',
  'web.tools.timeZone.result.title': 'El mismo momento, en todas las que elegiste',
  'web.tools.timeZone.result.empty': 'Elige al menos una zona de audiencia.',
  'web.tools.timeZone.result.shift':
    'Un cambio de horario de verano cae entre esta fecha y el mismo día de la semana cuatro semanas después, así que la hora local se mueve.',
  'web.tools.timeZone.result.stable': 'Sin cambio de desplazamiento en las próximas cuatro semanas.',
  'web.tools.timeZone.result.later': 'Cuatro semanas después, {time}.',
  'web.tools.timeZone.result.invalidDate': 'Escribe una fecha y una hora para ver la comparación.',
  'web.tools.timeZone.faq.dst.q': '¿Hacia qué lado se mueve la hora?',
  'web.tools.timeZone.faq.dst.a':
    'Depende de la zona y de la dirección del cambio, y por eso la tabla muestra la hora local real cuatro semanas después en lugar de describir la regla. El desplazamiento de cada zona se lee de la base de datos de zonas horarias de tu navegador.',
  'web.tools.timeZone.faq.storage.q': '¿Cómo debería guardar su hora una publicación programada?',
  'web.tools.timeZone.faq.storage.a':
    'Como un instante más la zona IANA que eligió la persona, nunca como una hora local simple. Eso es lo que hacemos internamente, y por eso una publicación programada antes de un cambio de reloj sigue llegando a la hora local prevista.',

  /* ---------------------------------------------------------------------- */
  /* Calculadora de tasa de interacción                                    */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': 'Calculadora de tasa de interacción',
  'web.tools.engagementRate.lede':
    'Escribe los números que ya muestra tu propio panel. Esto los divide de tres formas y se detiene ahí: sin referencia, sin umbral de "bueno", nada que no tengamos de verdad.',
  'web.tools.engagementRate.explainer.title': 'Por qué tres denominadores, no uno',
  'web.tools.engagementRate.explainer.body':
    'Alcance, seguidores e impresiones responden preguntas distintas. La tasa por alcance dice cómo respondieron las personas que realmente vieron la publicación. La tasa por seguidores dice qué parte de tu audiencia interactuó, haya llegado o no la publicación a todos. La tasa por impresiones cuenta cada visualización, incluidas las repetidas. Comparar una tasa calculada de una forma con otra calculada de otra forma es una fuente común de un número de interacción que parece incorrecto.',
  'web.tools.engagementRate.field.interactions.label': 'Interacciones',
  'web.tools.engagementRate.field.interactions.help':
    'Me gusta, comentarios, veces compartida y guardados sumados, de la publicación que estás midiendo.',
  'web.tools.engagementRate.field.reach.label': 'Alcance',
  'web.tools.engagementRate.field.reach.help': 'Cuentas que vieron la publicación al menos una vez.',
  'web.tools.engagementRate.field.followers.label': 'Seguidores',
  'web.tools.engagementRate.field.followers.help': 'El tamaño de la cuenta en el momento de la publicación.',
  'web.tools.engagementRate.field.impressions.label': 'Impresiones',
  'web.tools.engagementRate.field.impressions.help': 'Total de visualizaciones, incluyendo a alguien que la vio dos veces.',
  'web.tools.engagementRate.result.title': 'Tasa de interacción, de tres formas',
  'web.tools.engagementRate.result.empty': 'no disponible',
  'web.tools.engagementRate.result.note':
    'No existe una buena tasa universal con la que comparar. Depende de la plataforma, el formato, el tamaño de la audiencia y el sector, y cualquier número único ofrecido como referencia es una suposición disfrazada de dato.',
  'web.tools.engagementRate.basis.reach': 'Por alcance',
  'web.tools.engagementRate.basis.followers': 'Por seguidores',
  'web.tools.engagementRate.basis.impressions': 'Por impresiones',
  'web.tools.engagementRate.faq.formula.q': '¿Cuál es la fórmula real?',
  'web.tools.engagementRate.faq.formula.a':
    'Interacciones divididas por el denominador que elijas, mostradas como porcentaje. Interacciones aquí significa me gusta, comentarios, veces compartida y guardados sumados; algunas plataformas los reportan por separado, en cuyo caso súmalos tú mismo antes de escribir el total.',
  'web.tools.engagementRate.faq.basis.q': '¿Qué denominador debería usar?',
  'web.tools.engagementRate.faq.basis.a':
    'El que tu plataforma reporte junto con la publicación, para que los dos números vengan de la misma ventana de medición. Comparar una tasa por alcance de una publicación con una tasa por seguidores de otra no es una comparación justa aunque ambas se llamen tasa de interacción.',
} as const;
