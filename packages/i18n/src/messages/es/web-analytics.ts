/**
 * Web surface strings for Analytics, Automation Rules, RSS autopost and
 * tracked links.
 *
 * `analytics.ts` and `automation.ts` hold the domain vocabulary shared by every
 * surface (metric names, trigger sentences, provider caveats). This file holds
 * what only the web screens need: column headings, filter labels, wizard steps,
 * the sentence builder chrome and the per screen empty, error, offline,
 * permission and rate limit copy.
 *
 * Every leaf name here is new. Nothing in this file overwrites a key defined in
 * `analytics.ts` or `automation.ts`, which is asserted by `lint.test.ts`.
 */
export const webAnalyticsMessages = {
  /* ======================================================================
     Analytics shell
     ====================================================================== */
  'analytics.chart.legend': 'Serie mostrada en este gráfico',
  'analytics.tab.overview': 'Descripción general',
  'analytics.tab.experiments': 'experimentos',
  'analytics.tab.links': 'Enlaces rastreados',
  'analytics.tab.label': 'Secciones de análisis',

  'analytics.question.baseline': '¿Qué publicaciones se alejaron de su propia línea de base?',
  'analytics.question.baselineHelp':
    'Cada publicación se compara con sus publicaciones recientes en la misma cuenta y en el mismo formato. Aquí nada te compara con otro espacio de trabajo u otra empresa.',
  'analytics.question.accounts': '¿Qué cuentas necesitan atención?',
  'analytics.question.next': '¿Qué vale la pena probar a continuación?',

  'analytics.filter.project': 'Project',
  'analytics.filter.accounts': 'Cuentas',
  'analytics.filter.allAccounts': 'Todas las cuentas conectadas',
  'analytics.filter.range': 'Rango de fechas',
  'analytics.filter.format': 'Formato de contenido',
  'analytics.filter.allFormats': 'Todos los formatos',
  'analytics.filter.comparePrevious': 'Comparar con el periodo anterior',
  'analytics.filter.applied':
    '{count, plural, =0 {Sin filtros} one {# filtro} many {# filtros} other {# filtros}} aplicados. {results, plural, =0 {Ninguna publicación coincide} one {# publicación coincide} many {# publicación coincide} other {# publicación coincide}}.',

  'analytics.rankMetric.label': 'Clasificar publicaciones por',
  'analytics.rankMetric.help':
    'No hay puntuación combinada en Relay. Elija una métrica en cuya definición confíe y la tabla se ordenará únicamente según esa métrica.',
  'analytics.rankMetric.chosen':
    'Clasificado by {metric}, según lo informado por cada proveedor de cuenta.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Conciencia',
  'analytics.outcome.awarenessHelp':
    'Cuántas veces se entregó o vio la publicación. Los proveedores cuentan esto de forma diferente, por lo que un valor sólo es comparable consigo mismo a lo largo del tiempo.',
  'analytics.outcome.consumption': 'Consumo',
  'analytics.outcome.consumptionHelp': 'Cuánto de la publicación la gente realmente vio o leyó.',
  'analytics.outcome.interaction': 'Interacción',
  'analytics.outcome.interactionHelp':
    'Qué hizo la gente en la plataforma: me gusta, comentarios, acciones y guardados.',
  'analytics.outcome.conversion': 'Conversión',
  'analytics.outcome.conversionHelp':
    'Lo que hizo la gente después de abandonar la plataforma. Sólo los enlaces rastreados pueden responder a esto, y sólo para los enlaces que usted eligió rastrear.',
  'analytics.outcome.separateNote':
    'Estos cuatro grupos se cuentan por separado. Sumarlos contaría a la misma persona más de una vez.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Publicaciones publicadas en el rango seleccionado, cada una comparada con su propia línea de base reciente.',
  'analytics.table.post': 'Publicar',
  'analytics.table.account': 'cuenta',
  'analytics.table.format': 'Formato',
  'analytics.table.published': 'Publicado',
  'analytics.table.value': 'Valor',
  'analytics.table.delta': 'Contra la línea de base',
  'analytics.table.sample': 'muestra',
  'analytics.table.sampleSize': 'norte = {count}',
  'analytics.table.evidence': 'evidencia',
  'analytics.table.openEvidence': 'Muestre la evidencia for {post}',
  'analytics.table.rowActions': 'Acciones for {post}',
  'analytics.table.openPost': 'Abrir métricas de publicaciones',
  'analytics.table.openReceipt': 'Recibo de publicación abierto',
  'analytics.table.noBaseline': 'Aún no hay línea de base',
  'analytics.table.noBaselineReason':
    'Existen menos than {required} publicaciones comparables en esta cuenta. Una comparación sería ruido, por lo que no se muestra ninguno.',
  'analytics.table.sortBy': 'Ordenar by {column}',
  'analytics.table.detailToggle': 'Detalles',

  'analytics.delta.above': '{percent} por encima del valor inicial',
  'analytics.delta.below': '{percent} por debajo del valor inicial',
  'analytics.delta.level': 'En línea con la línea de base',
  'analytics.delta.unavailable': 'Sin comparación',

  'analytics.evidence.title': 'Cómo se hizo esta comparación',
  'analytics.evidence.baseline':
    'Línea de base: los median {metric} de los previous {count, plural, one {# publicación comparable} many {# publicaciones comparables} other {# publicaciones comparables}} on {account}.',
  'analytics.evidence.comparableBy':
    'Comparable significa la misma cuenta, el mismo formato de contenido ({format}) y una hora de publicación dentro del mismo período.',
  'analytics.evidence.postsUsed': 'Publicaciones utilizadas para la línea de base',
  'analytics.evidence.excluded':
    '{count, plural, =0 {No se excluyeron publicaciones} one {Se excluyó # publicaciones} many {Se excluyeron # publicaciones} other {Se excluyeron # publicaciones}} porque la métrica no estaba disponible para ellos.',
  'analytics.evidence.smallSample':
    'With {count, plural, one {# publicación} many {# publicaciones} other {# publicaciones}} en la línea de base, una sola publicación inusual mueve la mediana considerablemente. Trate esto como una señal para volver a realizar la prueba, no como un resultado.',
  'analytics.evidence.confounders': 'Lo que esto no tiene en cuenta',
  'analytics.evidence.confounder.time':
    'La hora de publicación varió según las publicaciones de referencia.',
  'analytics.evidence.confounder.format':
    'Las publicaciones de imágenes y videos no son directamente comparables aquí.',
  'analytics.evidence.confounder.followers':
    'El recuento de seguidores on {account} cambió by {percent} durante este período.',
  'analytics.evidence.confounder.paid':
    'Relay no puede decir si alguna de estas publicaciones recibió distribución remunerada.',
  'analytics.evidence.confounder.provider':
    '{provider} cambió la forma en que reports {metric} dentro de este período.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'What {metric} significa',
  'analytics.definition.inlineHeading': 'Definición',
  'analytics.definition.observedAt': 'Observed {dateTime}.',
  'analytics.definition.sourceLink': 'Documentación del proveedor',
  'analytics.definition.verifiedOn': 'Comprobado con la documentación del proveedor on {date}.',
  'analytics.definition.panelTitle': 'Definiciones de métricas en esta vista',
  'analytics.definition.panelIntro':
    'Cada número en esta pantalla proviene de un campo de proveedor designado. Las definiciones siguientes también se repiten junto a cada valor, por lo que nada importante se encuentra únicamente en la información sobre herramientas.',
  'analytics.definition.aggregation.sum': 'Agregado sumando cada observación.',
  'analytics.definition.aggregation.average': 'Agregado como media.',
  'analytics.definition.aggregation.median': 'Agregado como mediana.',
  'analytics.definition.aggregation.last': 'La observación más reciente.',
  'analytics.definition.aggregation.delta': 'El cambio entre la primera y la última observación.',
  'analytics.definition.aggregation.none': 'Reportado como una sola observación.',
  'analytics.definition.denominator.none': 'Esto es un conteo, no una tasa.',
  'analytics.definition.historyWindow':
    '{provider} keeps {days, plural, one {# día} many {# días} other {# días}} de historial para este campo.',
  'analytics.definition.historyWindowNone':
    '{provider} no indica un límite de historial para este campo.',

  'analytics.definition.term.providerField': 'Campo de proveedor',
  'analytics.definition.term.unit': 'Unidad',
  'analytics.definition.term.denominator': 'denominador',
  'analytics.definition.term.aggregation': 'como se agrega',
  'analytics.definition.term.history': 'Historial que mantiene el proveedor',
  'analytics.definition.term.definition': 'Lo que el proveedor dice que significa',

  'analytics.unit.count': 'Un recuento de eventos',
  'analytics.unit.seconds': 'Segundos',
  'analytics.unit.percent': 'Un porcentaje que el proveedor ya calculó',
  'analytics.unit.ratio': 'Un ratio Relay calculado a partir de dos campos de proveedores',
  'analytics.unit.currency_minor': 'Una cantidad de dinero en unidades menores.',

  'analytics.denominator.none': 'Esto es un conteo, no una tasa. No tiene denominador.',
  'analytics.denominator.impressions': 'Dividido por impresiones',
  'analytics.denominator.reach': 'Dividido por alcance',
  'analytics.denominator.views': 'Dividido por vistas',
  'analytics.denominator.followers':
    'Dividido por el recuento de seguidores en el momento de la observación.',
  'analytics.denominator.sessions': 'Dividido por sesiones',

  'analytics.format.text': 'Texto',
  'analytics.format.image': 'Imagen',
  'analytics.format.carousel': 'carrusel',
  'analytics.format.video': 'Vídeo',
  'analytics.format.short_video': 'vídeo corto',
  'analytics.format.long_video': 'vídeo largo',
  'analytics.format.document': 'Documento',
  'analytics.format.thread': 'Hilo',

  'analytics.value.unavailableReason.notImplemented':
    'Relay aún no ha creado la asignación para esta métrica on {provider}.',
  'analytics.value.estimated': 'Estimado',
  'analytics.value.estimatedMethod': 'Método: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'De dónde vinieron estos números',
  'analytics.freshness.intro':
    'Los proveedores agregan según su propio horario. Nada en esta pantalla está en vivo.',
  'analytics.freshness.accountRow': '{account} on {provider}',
  'analytics.freshness.never': 'Nunca sincronizado',
  'analytics.freshness.nextAttempt': 'Siguiente sincronización attempt {relativeTime}.',
  'analytics.freshness.openStatus': 'Estado del proveedor',

  'analytics.accounts.title': 'Cuentas que necesitan atención',
  'analytics.accounts.empty':
    'Cada cuenta conectada devolvió datos en este período. Nada te necesita aquí.',
  'analytics.accounts.reason.permission':
    'No se otorgó el permiso de análisis cuando se conectó esta cuenta.',
  'analytics.accounts.reason.expired':
    'El acceso expiró, por lo que no se ha recopilado ninguna métrica since {date}.',
  'analytics.accounts.reason.stale': 'La última sincronización exitosa was {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# intento de sincronización} many {# intentos de sincronización} other {# intentos de sincronización}} fallaron seguidos. El motivo registró was {reason}.',
  'analytics.accounts.reason.noPosts':
    'No se publicó nada en esta cuenta en el rango seleccionado.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Observaciones',
  'analytics.observations.intro':
    'Estas son descripciones de lo que muestran los números. No son predicciones y no establecen causa.',
  'analytics.observations.empty':
    'Aún no hay suficiente historia publicada para describir un patrón. Publica algunas publicaciones más en la misma cuenta y formato.',
  'analytics.observations.citedPosts': 'Basado en',
  'analytics.observations.citedPeriod': 'Periodo: {start} to {end}.',
  'analytics.observations.nextTestTitle': 'Una prueba que podrías realizar a continuación',
  'analytics.observations.nextTestBody':
    'Publish {count, plural, one {# publicación más} many {# publicaciones más} other {# publicaciones más}} on {account} cambiando only {variable}, luego compara la misma métrica. Etiquételo como un experimento antes de publicarlo para que la comparación se planifique en lugar de encontrarse después.',
  'analytics.observations.tagFirst': 'Etiquetar un experimento',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} a lo largo del tiempo',
  'analytics.chart.summary':
    '{metric} on {account}, {count, plural, one {# punto} many {# puntos} other {# puntos}} from {start} to {end}.',
  'analytics.chart.showTable': 'Mostrar como una tabla',
  'analytics.chart.hideTable': 'Ocultar la mesa',
  'analytics.chart.tableCaption': 'La misma serie que una mesa.',
  'analytics.chart.columnPeriod': 'Periodo',
  'analytics.chart.columnValue': 'Valor',
  'analytics.chart.gapLabel': 'No se han recopilado datos',
  'analytics.chart.gapExplained':
    'Una interrupción en la línea significa que no se recopiló ninguna observación para ese período. No significa cero.',
  'analytics.chart.annotation': 'Anotación',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'No se recogieron observaciones en este rango.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Planificar un experimento',
  'analytics.experiment.empty':
    'Aún no hay experimentos. Un experimento es una comparación que decides antes de publicar y que es el único tipo que puede responder a una pregunta.',
  'analytics.experiment.emptyExample':
    'Ejemplo: publicar el mismo anuncio en X dos veces, una con el enlace de la publicación y otra con el enlace del primer comentario, luego comparar los clics en el enlace durante 72 horas.',
  'analytics.experiment.name': '¿Qué estás probando?',
  'analytics.experiment.namePlaceholder': 'Primer comentario a los 5 minutos contra 30 minutos.',
  'analytics.experiment.hypothesisPlaceholder':
    'Un retraso más corto antes de que el primer comentario obtenga más respuestas en X.',
  'analytics.experiment.variantLabel': 'Variant {index}',
  'analytics.experiment.variantDescription': '¿Qué es diferente en esta variante?',
  'analytics.experiment.addVariant': 'Agregar una variante',
  'analytics.experiment.removeVariant': 'Quitar variant {index}',
  'analytics.experiment.accounts': 'Cuentas incluidas',
  'analytics.experiment.windowHelp':
    'Las métricas siguen avanzando después de que se publica una publicación. Corrija la ventana ahora para que la comparación no se realice en un momento que coincida con una variante.',
  'analytics.experiment.windowDays':
    'Mida for {count, plural, one {# día} many {# días} other {# días}} después de que se publique cada publicación.',
  'analytics.experiment.minSample': 'Publicaciones mínimas por variante',
  'analytics.experiment.minSampleHelp':
    'Por debajo de este recuento, el resultado se muestra como no concluyente y no como ganador.',
  'analytics.experiment.status.planned': 'planeado',
  'analytics.experiment.status.collecting':
    'Coleccionando. {published} of {target} publicaciones publicadas.',
  'analytics.experiment.status.inconclusive': 'Completo, sin diferencia clara',
  'analytics.experiment.result.difference':
    '{variant} recorded {percent} more {metric} than {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'Las dos variantes son within {percent} entre sí on {metric}. De todos modos, eso está dentro del rango en el que varían estas publicaciones.',
  'analytics.experiment.result.association':
    'Esta es una asociación medida on {count, plural, one {# publicación} many {# publicaciones} other {# publicaciones}}. No prueba que el cambio haya causado la diferencia.',
  'analytics.experiment.result.unavailable':
    '{metric} no estaba disponible for {count, plural, one {# publicación} many {# publicaciones} other {# publicaciones}} en este experimento, por lo que esas publicaciones se excluyen en lugar de contarse como cero.',
  'analytics.experiment.result.title': 'Resultado',
  'analytics.experiment.completeNow': 'Cerrar este experimento',
  'analytics.experiment.completeConfirm':
    'El cierre detiene la recogida. Las publicaciones permanecen publicadas y los números permanecen disponibles.',
  'analytics.experiment.postsTitle': 'Publicaciones en este experimento',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Cargando análisis para las cuentas seleccionadas',
  'analytics.state.loadingProvider': 'Fetching {provider} análisis',
  'analytics.state.empty': 'No hay nada publicado en este rango.',
  'analytics.state.emptyBody':
    'Los análisis describen publicaciones que ya se publicaron. Publicar algo o ampliar el rango de fechas.',
  'analytics.state.emptyExample':
    'Una vez que una publicación esté activa, verá una fila como: X @acme, "Hilo de lanzamiento", 12,400 impresiones, 58 por ciento por encima de la media de las 10 anteriores.',
  'analytics.state.errorTitle': 'No se pudieron cargar los análisis',
  'analytics.state.errorBody':
    'No se muestra ningún número en lugar de uno adivinado. Sus publicaciones y recibos no se ven afectados.',
  'analytics.state.partialTitle': '{loaded} of {total} cuentas devolvieron datos',
  'analytics.state.partialBody':
    'Los relatos que respondieron se muestran con frescura propia. El resto se enumeran con el motivo por el que no lo hicieron.',
  'analytics.state.partialSucceeded': 'Datos devueltos',
  'analytics.state.partialFailed': 'No devolvió datos',
  'analytics.state.offlineTitle': 'Estás desconectado',
  'analytics.state.offlineBody':
    'Las siguientes figuras se cargaron antes de que se interrumpiera la conexión, por lo que son más antiguas de lo que sugieren las etiquetas de actualización.',
  'analytics.state.permissionTitle': 'No puedes ver análisis en este espacio de trabajo.',
  'analytics.state.permissionBody':
    'Analytics necesita el rol de analista o superior. Un propietario o administrador de este espacio de trabajo puede otorgarlo.',
  'analytics.state.rateLimitTitle': '{provider} es la tasa que limita las solicitudes de análisis',
  'analytics.state.rateLimitCause':
    'La cuenta ha utilizado su parte de la cuota del proveedor para esta ventana. Relay no vuelve a intentarlo con más fuerza, porque eso retrasaría la publicación.',
  'analytics.state.rateLimitAlternative':
    'Limite el rango de fechas o el filtro de cuenta, que solicita menos al proveedor.',
  'analytics.state.rateLimitReset': 'Solicitudes de currículum',
  'analytics.state.reference': 'Referencia diagnóstica',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Crear un enlace rastreado',
  'analytics.links.empty': 'Aún no hay enlaces rastreados',
  'analytics.links.emptyBody':
    'Un enlace rastreado es una URL corta a la que redirecciona Relay, por lo que puede ver los clics incluso cuando una plataforma no informa ninguno. El destino original nunca se cambia sin una entrada de auditoría.',
  'analytics.links.emptyExample':
    'Ejemplo: Relay.to/a7Kq2 redirige a acme.com/blog/launch con la campaña q3-launch.',
  'analytics.links.table.caption':
    'Enlaces rastreados en este espacio de trabajo y recuentos de clics propios.',
  'analytics.links.campaign': 'Campaña',
  'analytics.links.created': 'Creado',
  'analytics.links.usedIn':
    '{count, plural, =0 {Aún no se usa en una publicación} one {Usado en # publicación} many {Usado en # publicaciones} other {Usado en # publicaciones}}',
  'analytics.links.state.active': 'Activo',
  'analytics.links.state.expired': 'Expired {date}',
  'analytics.links.state.disabled': 'Desactivado',
  'analytics.links.state.disabledAt': 'Desactivado el {date}. Esta URL corta ya no redirige.',
  'analytics.links.state.blocked': 'Bloqueado por seguridad',
  'analytics.links.state.blockedBody':
    'Esta redirección no está disponible porque su destino no superó una comprobación de seguridad. Cambia el destino o contacta con soporte.',
  'analytics.links.state.disabledReason':
    'Deshabilitado by {actor} on {date}. Motivo registrado: {reason}.',
  'analytics.links.detailTitle': 'Seguimiento link {slug}',
  'analytics.links.exactRedirect': 'Redirección exacta',
  'analytics.links.exactRedirectHelp':
    'Este es el destino al que llega un visitante en este momento, incluidos todos los parámetros UTM, que se muestran en su totalidad y no abreviados.',
  'analytics.links.editDestination': 'cambiar el destino',
  'analytics.links.editDestinationWarning':
    'Cambiar el destino afecta a todos los lugares donde ya se publicó este enlace. Los informes de períodos anteriores al cambio mantienen el destino que estaba activo en ese momento.',
  'analytics.links.editDestinationAudit':
    'El cambio se registra en el registro de auditoría con su nombre, el destino anterior y el nuevo.',
  'analytics.links.destinationHistory': 'Historial de destino',
  'analytics.links.destinationHistoryRow': '{destination}, activo from {start} to {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, activo since {start}',
  'analytics.links.domainLabel': 'Dominio corto',
  'analytics.links.domainDefault': 'Relay dominio predeterminado',
  'analytics.links.domainVerified': 'Verificado por DNS on {date}',
  'analytics.links.domainPending': 'Esperando el registro DNS',
  'analytics.links.domainPendingHelp':
    'Agregue el registro TXT debajo de at {domain} y luego verifique nuevamente. Hasta que se verifique, este dominio no se puede seleccionar para un nuevo enlace.',
  'analytics.links.domainFailed': 'El registro DNS no coincide con on {date}',
  'analytics.links.domainCheck': 'Verifique DNS nuevamente',
  'analytics.links.expiry': 'Caducidad',
  'analytics.links.expiryNone': 'Sin vencimiento establecido',
  'analytics.links.expiryHelp':
    'Después de la expiración, el enlace devuelve una página sin formato que indica que ha finalizado. Nunca apunta silenciosamente a otra parte.',
  'analytics.links.disable': 'Desactiva este enlace ahora',
  'analytics.links.disableTitle': 'Disable {slug}?',
  'analytics.links.disableBody':
    'Los visitantes llegan a una página que dice que el enlace ya no está disponible. Las publicaciones publicadas todavía contienen la URL corta, por lo que es visible para cualquiera que haga clic.',
  'analytics.links.disableReason': 'Razón para deshabilitar',
  'analytics.links.enable': 'Habilitar este enlace nuevamente',
  'analytics.links.abuseTitle': 'Informar abuso de este enlace',
  'analytics.links.abuseBody':
    'Si esta URL corta se utiliza para algo que no pretendía, infórmelo y la redirección se suspenderá mientras se revisa.',
  'analytics.links.abuseAction': 'Reportar este enlace',
  'analytics.links.measurementLabel': 'Medición de redirección propia',
  'analytics.links.measurementExplained':
    'Relay cuenta una solicitud cuando se solicita esta URL al servicio de redireccionamiento. Un clic deduplicado elimina las solicitudes repetidas del mismo visitante dentro de una ventana corta, y las solicitudes que coinciden con patrones de rastreo conocidos se excluyen en lugar de eliminarse.',
  'analytics.links.botsNote':
    '{count, plural, one {# solicitud} many {# solicitudes} other {# solicitudes}} se clasificaron como automatizadas y se excluyen del recuento de duplicados.',
  'analytics.links.series.title': 'Solicitudes y clics deduplicados a lo largo del tiempo',
  'analytics.links.series.requests': 'Solicitudes totales',
  'analytics.links.series.clicks': 'Clics deduplicados',
  'analytics.links.breakdownTitle': 'De dónde vinieron los clics',
  'analytics.links.breakdown.share': '{percent} de clics deduplicados',
  'analytics.links.referrer.direct': 'No se envió ningún referente',
  'analytics.links.referrer.social': 'plataforma social',
  'analytics.links.referrer.search': 'motor de búsqueda',
  'analytics.links.referrer.email': 'Cliente de correo electrónico',
  'analytics.links.referrer.other': 'Otro sitio web',
  'analytics.links.device.mobile': 'Móvil',
  'analytics.links.device.desktop': 'Escritorio',
  'analytics.links.device.tablet': 'tableta',
  'analytics.links.device.unknown': 'No determinado',
  'analytics.links.countryUnknown': 'País no determinado',
  'analytics.links.lastEventLabel': 'último clic',
  'analytics.links.noEvents': 'Aún no se han registrado clics',
  'analytics.links.noEventsBody':
    'Este enlace no ha sido solicitado desde su creación. Eso es un cero real, medido por nuestro propio servicio de redireccionamiento.',
  'analytics.links.compareWarning':
    '{provider} reports {providerValue} clics en enlaces para esta publicación. Relay recorded {relayValue} clics deduplicados. Los dos cuentan eventos diferentes y ninguno reemplaza al otro.',
  'analytics.links.errorTitle': 'No se pudieron cargar las estadísticas del enlace',
  'analytics.links.errorBody':
    'El servicio de redireccionamiento sigue funcionando, por lo que el enlace sigue enviando visitantes a su destino. Sólo los informes se ven afectados.',
  'analytics.links.createDestination': 'URL de destino',
  'analytics.links.createDestinationHelp':
    'Debe ser una dirección https pública. El servicio de redireccionamiento rechaza las direcciones de red privadas y las cadenas de redireccionamiento.',
  'analytics.links.createCampaign': 'Nombre de la campaña',
  'analytics.links.createSlug': 'Final personalizado',
  'analytics.links.createSlugHelp': 'Deja esto vacío y Relay genera un final aleatorio corto.',
  'analytics.links.createUtm': 'Parámetros UTM',
  'analytics.links.blockedScheme': 'Sólo se aceptan destinos https.',
  'analytics.links.blockedPrivate':
    'Esa dirección está en una red privada, por lo que el servicio de redireccionamiento no la aceptará.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Reglas',
  'automation.tab.feeds': 'Canales RSS',
  'automation.tab.label': 'Secciones de automatización',

  'automation.rules.table.caption': 'Reglas de automatización en este espacio de trabajo.',
  'automation.rules.table.rule': 'regla',
  'automation.rules.table.state': 'Estado',
  'automation.rules.table.accounts': 'Cuentas',
  'automation.rules.table.lastRun': 'última ejecución',
  'automation.rules.table.nextCheck': 'Próximo cheque',
  'automation.rules.neverRun': 'Aún no se ha ejecutado',
  'automation.rules.emptyExample':
    'Ejemplo: cuando aparece un elemento nuevo en el feed del blog de Acme, si el idioma es inglés, cree un borrador a partir de la plantilla de anuncio del blog y solicite aprobación.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {No hay cuentas seleccionadas} one {# cuenta} many {# cuentas} other {# cuentas}}',
  'automation.rules.openRule': 'Open {name}',
  'automation.rules.duplicateRule': 'Duplicate {name}',
  'automation.rules.deleteTitle': 'Delete {name}?',
  'automation.rules.deleteBody':
    'La regla se detiene inmediatamente y su historial de ejecución se conserva para el registro de auditoría. Las publicaciones que ya creó no se ven afectadas.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'un comentario programado o un elemento del hilo falla',

  'automation.condition.timeWindow': 'la hora es between {start} and {end} in {timeZone}',
  'automation.condition.domainPresent': 'los enlaces de texto to {domain}',
  'automation.condition.hashtagPresent': 'el texto contiene el hashtag {hashtag}',
  'automation.condition.providerCapability': 'la cuenta en realidad puede do {capability}',
  'automation.condition.planStatus': 'la suscripción está activa',

  'automation.action.continueSequence':
    'continuar con el hilo preparado o la secuencia de comentarios',
  'automation.action.notifyEmail': 'enviar un correo electrónico to {target}',
  'automation.action.notifyWebhook': 'enviar un webhook to {target}',
  'automation.action.pauseConnection': 'pausar la cuenta afectada',
  'automation.action.quotePost': 'cita la publicación fuente una vez',
  'automation.action.followUpComment': 'agregar un comentario preparado en la publicación fuente',

  'automation.param.feed': 'alimentar',
  'automation.param.template': 'Plantilla',
  'automation.param.signature': 'Firma',
  'automation.param.disclosure': 'Divulgación',
  'automation.param.locale': 'Idioma',
  'automation.param.project': 'Project',
  'automation.param.campaign': 'Campaña',
  'automation.param.account': 'cuenta',
  'automation.param.platform': 'Plataforma',
  'automation.param.contentType': 'Tipo de contenido',
  'automation.param.keyword': 'palabra clave',
  'automation.param.hashtag': 'Hashtag',
  'automation.param.domain': 'Dominio',
  'automation.param.capability': 'Capacidad',
  'automation.param.timeZone': 'Zona horaria',
  'automation.param.startTime': 'De',
  'automation.param.endTime': 'a',
  'automation.param.duration': 'Duración',
  'automation.param.metric': 'Métrica',
  'automation.param.value': 'Valor',
  'automation.param.target': 'Enviar a',
  'automation.param.time': 'tiempo',
  'automation.param.cadence': '¿Con qué frecuencia?',
  'automation.param.notSet': 'no establecido',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Nombre de la regla',
  'automation.editor.namePlaceholder': 'Blog en redes sociales',
  'automation.editor.when': 'cuando',
  'automation.editor.if': 'si',
  'automation.editor.then': 'entonces',
  'automation.editor.after': 'después',
  'automation.editor.until': 'hasta',
  'automation.editor.sentenceLabel': 'oración regla',
  'automation.editor.readBack': 'Lee la oración antes de encender esto. Es toda la regla.',
  'automation.editor.chooseTrigger': 'Elige qué inicia esta regla',
  'automation.editor.addCondition': 'Agregar una condición',
  'automation.editor.addAction': 'Agregar una acción',
  'automation.editor.removeCondition': 'Retire el condition {label}',
  'automation.editor.removeAction': 'Retire el action {label}',
  'automation.editor.moveActionUp': 'Move {label} antes',
  'automation.editor.moveActionDown': 'Move {label} después',
  'automation.editor.actionOrder': 'Las acciones se ejecutan en este orden, de arriba a abajo.',
  'automation.editor.noConditions': 'Sin condiciones. La regla se ejecuta cada vez que se activa.',
  'automation.editor.noActions': 'Aún no hay acciones. Una regla sin acción no se puede guardar.',
  'automation.editor.delayNone': 'sin demora',
  'automation.editor.delayLabel': 'Retraso antes de que se ejecuten las acciones.',
  'automation.editor.endLabel': 'Cuando esta regla se detenga',
  'automation.editor.end.manual': 'apago esto',
  'automation.editor.end.date': 'una fecha que elijo',
  'automation.editor.end.count':
    'tiene run {count, plural, one {# tiempo} many {# veces} other {# veces}}',
  'automation.editor.end.dateValue': 'Detente',
  'automation.editor.end.countValue': 'Detente después de tantas carreras',
  'automation.editor.parameterFor': 'Configuración for {label}',
  'automation.editor.saveDraft': 'Guardar como borrador',
  'automation.editor.savedAt': 'Saved {time}',
  'automation.editor.unsaved': 'Cambios no guardados',

  'automation.editor.view.sentence': 'oración',
  'automation.editor.view.structured': 'estructurado',
  'automation.editor.view.api': 'Representación API',
  'automation.editor.view.label': 'Vista del editor',
  'automation.editor.apiHelp':
    'Esto es exactamente lo que envían la API REST, la CLI y el servidor MCP. Editarlo aquí y volver a la oración mantiene todos los campos.',
  'automation.editor.apiInvalid':
    'Esta no es una regla JSON válida, por lo que no se aplicó: {reason}',
  'automation.editor.apiApply': 'Aplicar este JSON',
  'automation.editor.structuredHelp':
    'La misma regla que los campos. Úselo cuando una regla tenga muchas condiciones y la oración sea larga.',

  'automation.editor.error.noAction': 'Agregue al menos una acción antes de guardar.',
  'automation.editor.error.noTrigger': 'Elija un activador antes de guardar.',
  'automation.editor.error.noAccounts':
    'Elija al menos una cuenta en la que esta regla pueda actuar.',
  'automation.editor.error.missingParameter': '{label} necesita un valor.',
  'automation.editor.error.summary':
    '{count, plural, one {# cosas necesitan tu atención} many {# cosas necesitan tu atención} other {# cosas necesitan tu atención}} antes de que se pueda guardar esta regla.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': '¿Qué inicia esta regla?',
  'automation.picker.conditionTitle': 'Agregar una condición',
  'automation.picker.actionTitle': 'Agregar una acción',
  'automation.picker.search': 'Filtrar esta lista',
  'automation.picker.noResults': 'Nada en esta lista coincide con lo que usted escribió.',
  'automation.picker.groupContent': 'Contenido',
  'automation.picker.groupPublishing': 'Publicación',
  'automation.picker.groupNotify': 'Personas y sistemas',
  'automation.picker.groupControl': 'Control de reglas',
  'automation.picker.groupSchedule': 'tiempo',
  'automation.picker.groupExternal': 'Eventos externos',
  'automation.picker.groupMeasurement': 'Medición',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# acción es} many {# acciones son} other {# acciones son}} no aparecen en la lista porque las cuentas seleccionadas no pueden realizarlas.',
  'automation.picker.hiddenDetail': '{action} no está disponible for {provider}. {reason}',
  'automation.picker.consequential': 'Crea algo en una plataforma.',
  'automation.picker.internalOnly': 'Se queda dentro Relay',

  'automation.accounts.label': 'Cuentas sobre las que esta regla puede actuar',
  'automation.accounts.help':
    'Una regla nunca puede afectar a una cuenta que no figura aquí, independientemente de lo que digan sus condiciones.',
  'automation.accounts.none': 'Aún no hay cuentas seleccionadas',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Reglas de medición para este disparador',
  'automation.threshold.intro':
    'Una regla que reacciona ante un número necesita saber qué número, medido durante qué período y con qué frecuencia puede actuar.',
  'automation.threshold.metric': 'Métrica a seguir',
  'automation.threshold.value': 'Valor umbral',
  'automation.threshold.window': 'Ventana de medición',
  'automation.threshold.windowHelp':
    'Contado desde el momento en que se publicó la publicación fuente. Fuera de esta ventana la regla deja de ver la publicación.',
  'automation.threshold.expiry': 'Dejar de ver una publicación después',
  'automation.threshold.cooldown': 'Enfriamiento entre ejecuciones',
  'automation.threshold.cooldownHelp':
    'El tiempo más corto permitido entre dos ejecuciones para la misma publicación de origen.',
  'automation.threshold.maxPerPost': 'Ejecuciones máximas por publicación de origen',
  'automation.threshold.defaultsTitle':
    'Valores predeterminados que permanecen a menos que los cambies',
  'automation.threshold.defaultOncePerPost': 'Ejecutar una vez por publicación fuente.',
  'automation.threshold.defaultStale':
    'No ejecute si la métrica no está disponible o está obsoleta. El límite de frescura utilizado is {duration}.',
  'automation.threshold.staleLimit': 'Tratar una métrica como obsoleta después',
  'automation.threshold.providerNote':
    '{provider} reports {metric} con retraso, por lo que esta regla solo puede actuar después de que el proveedor publique el número.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Seguimiento desde otra cuenta',
  'automation.crossAccount.off': 'Apagado. Esta regla sólo actúa en la cuenta de origen.',
  'automation.crossAccount.enable': 'Permitir un seguimiento desde otra cuenta',
  'automation.crossAccount.body':
    'Ambas cuentas deben estar conectadas a este espacio de trabajo y ambas deben nombrarse aquí. El seguimiento es una publicación preparada que usted escribe con anticipación y pasa por la misma política de aprobación que cualquier otra cosa.',
  'automation.crossAccount.sourceAccount': 'Cuenta de origen',
  'automation.crossAccount.followUpAccount': 'Cuenta que publica el seguimiento.',
  'automation.crossAccount.preauthorize':
    'Confirmo que este espacio de trabajo controla both {sourceAccount} and {followUpAccount} y que el seguimiento no se presenta como respaldo independiente.',
  'automation.crossAccount.preauthorizeRequired':
    'Confirme la autorización previa antes de poder guardar esta regla.',
  'automation.crossAccount.duplicateCheck':
    'Las verificaciones de cadencia y duplicados de cuentas cruzadas se ejecutan antes del seguimiento, y se omiten en lugar de retrasarse si se repite la publicación original.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro':
    'Todo lo que esta regla puede hacer, antes de que pueda hacer nada de eso.',
  'automation.preflight.accountsLabel': 'Cuentas sobre las que puede actuar',
  'automation.preflight.maxActionsLabel': 'La mayoría de las acciones externas por ejecución',
  'automation.preflight.maxActionsPeriod':
    'En most {count, plural, one {# acción externa} many {# acciones externas} other {# acciones externas}} in {period}.',
  'automation.preflight.approvalLabel': 'Aprobación',
  'automation.preflight.approvalNone':
    'Ninguna acción en esta regla crea nada en una plataforma, por lo que no se aplica ninguna aprobación.',
  'automation.preflight.providerLabel': 'Restricciones del proveedor',
  'automation.preflight.providerNone': 'Ninguna se aplica a las acciones de esta regla.',
  'automation.preflight.costLabel': 'Costo medido estimado',
  'automation.preflight.costUnknown':
    'No se puede estimar el costo de estas acciones hasta que se conozca el precio del proveedor.',
  'automation.preflight.costMethod':
    'Estimado a partir de la lista de precios del proveedor on {date}. El recibo registra lo que realmente se cobró.',
  'automation.preflight.cadenceLabel': 'Cadencia y duplicados',
  'automation.preflight.cadenceBody':
    'Se realizan comprobaciones de duplicados y cadencia antes de cada acción. Una acción que excedería el presupuesto de cadencia de una cuenta se omite y se registra, no se pone en cola.',
  'automation.preflight.failureLabel': 'Si una carrera falla',
  'automation.preflight.failure.pauseAfter':
    'La regla detiene after {count, plural, one {# falla consecutiva} many {# fallas consecutivas} other {# fallas consecutivas}} y presenta un elemento de acción.',
  'automation.preflight.failure.continue':
    'La regla sigue ejecutándose y cada error se registra en el registro de ejecución.',
  'automation.preflight.exampleLabel': 'Ejecución de ejemplo',
  'automation.preflight.exampleIntro':
    'Utilizando el evento más reciente, este activador habría coincidido.',
  'automation.preflight.exampleNone':
    'Aún no ha ocurrido ningún evento coincidente, por lo que no se puede mostrar ningún ejemplo. En su lugar, ejecute un evento de prueba.',
  'automation.preflight.activate': 'Activa esta regla',
  'automation.preflight.activateConfirmTitle': '¿Girar on {name}?',
  'automation.preflight.activateConfirmBody':
    'A partir de ahora esta norma actúa sin consultarte primero, dentro de los límites indicados anteriormente.',
  'automation.preflight.blocked':
    'Esta regla no se puede activar todavía. {count, plural, one {# elemento} many {# elementos} other {# elementos}} arriba necesita una decisión.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Evento de prueba',
  'automation.test.body':
    'Una prueba evalúa la oración completa y muestra lo que haría. Nunca publica, nunca publica un comentario y nunca envía un webhook a un punto final real.',
  'automation.test.useLastEvent': 'Utilice el evento coincidente más reciente',
  'automation.test.usePayload': 'Pegar una carga útil de evento',
  'automation.test.run': 'ejecutar la prueba',
  'automation.test.running': 'ejecutando la prueba',
  'automation.test.resultTitle': '¿Qué hizo la prueba?',
  'automation.test.conditionPassed': '{condition} pasó',
  'automation.test.conditionFailed': '{condition} no pasó, por lo que la regla se detuvo aquí',
  'automation.test.actionSimulated': '{action} se ejecutaría',
  'automation.test.actionSkipped': '{action} se omitiría: {reason}',
  'automation.test.noExternalEffect': 'No quedó nada Relay durante esta prueba.',
  'automation.test.failed': 'La prueba no se pudo completar: {reason}',

  'automation.runs.table.caption': 'Ejecuciones recientes de esta regla.',
  'automation.runs.startedAt': 'iniciado',
  'automation.runs.outcome.label': 'Resultado',
  'automation.runs.actionsTaken': 'Acciones',
  'automation.runs.trigger': 'Provocado por',
  'automation.runs.outcome.completed': 'Completado',
  'automation.runs.outcome.skipped': 'Saltado',
  'automation.runs.outcome.failed': 'Fallido',
  'automation.runs.outcome.testMode': 'Modo de prueba',
  'automation.runs.actionCount':
    '{count, plural, =0 {Sin acción externa} one {# acción externa} many {# acciones externas} other {# acciones externas}}',
  'automation.runs.skippedReason': 'Saltado because {reason}',
  'automation.runs.openDetail': 'Abrir la carrera from {time}',
  'automation.runs.createdItems': 'Creado',

  'automation.versions.caption': 'Cada versión guardada de esta regla.',
  'automation.versions.current': 'Actual',
  'automation.versions.savedBy': 'Guardado by {actor} on {date}',
  'automation.versions.compare': 'Comparar con la versión actual',
  'automation.versions.restore': 'Restaurar esta versión',
  'automation.versions.restoreConfirm':
    'La restauración crea una nueva versión. No se sobrescribe nada y la regla permanece en su estado actual hasta que la activa.',
  'automation.versions.diffTitle': 'Version {from} comparado con version {to}',

  'automation.kill.title': 'Stop {name} ahora',
  'automation.kill.body':
    'La regla se detiene inmediatamente, en medio de una ejecución, si hay alguna. Todo lo que ya se envía a una plataforma permanece publicado, porque una publicación externa nunca se revierte.',
  'automation.kill.confirmPhrase': 'DETENER',
  'automation.kill.confirmLabel': 'Escriba DETENER para confirmar',
  'automation.kill.stopped':
    'Esta regla se detuvo by {actor} on {date}. No puede volver a funcionar hasta que lo vuelvas a encender.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Cargando reglas de automatización',
  'automation.state.loadingRule': 'Cargando la regla y sus ejecuciones recientes',
  'automation.state.errorTitle': 'No se pudieron cargar las reglas.',
  'automation.state.errorBody':
    'Las reglas que ya están en ejecución no se ven afectadas por esto. Sólo esta pantalla falló.',
  'automation.state.offlineTitle': 'Estás desconectado',
  'automation.state.offlineBody':
    'Puede leer una regla y editar el borrador, y permanece en este dispositivo. Para guardar, probar y activar una regla se necesita una conexión.',
  'automation.state.permissionTitle': 'No puedes cambiar las reglas de automatización',
  'automation.state.permissionBody':
    'Las reglas actúan en las cuentas conectadas, por lo que para cambiar una se necesita el rol de administrador o superior. Aún puedes leer cada regla y su historial de ejecución.',
  'automation.state.rateLimitTitle': 'La ejecución de reglas se está ralentizando',
  'automation.state.rateLimitCause':
    'Este espacio de trabajo alcanzó su asignación de ejecución de automatización para la ventana actual. Las publicaciones programadas y la publicación manual no se ven afectadas.',
  'automation.state.rateLimitAlternative':
    'A las reglas con cadencia se les puede dar un intervalo más largo, lo que utiliza menos carreras.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Convierte un feed en borradores o publicaciones programadas, con la misma validación y aprobación que cualquier cosa que escribas tú mismo.',
  'automation.rss.empty': 'Aún no hay feeds',
  'automation.rss.emptyBody':
    'Agregue un feed y Relay lo revisa según un cronograma. Cada elemento nuevo se convierte en un borrador, una publicación programada o una solicitud de aprobación, lo que elijas.',
  'automation.rss.emptyExample':
    'Ejemplo: el feed del blog de Acme crea un borrador para X y LinkedIn cada vez que se publica un artículo y espera a un aprobador.',
  'automation.rss.table.caption': 'Alimenta las encuestas de este espacio de trabajo.',
  'automation.rss.table.feed': 'alimentar',
  'automation.rss.table.policy': '¿Qué sucede con un artículo nuevo?',
  'automation.rss.table.health': 'Salud',

  'automation.rss.step.url': 'Dirección de alimentación',
  'automation.rss.step.preview': 'Comprueba el feed',
  'automation.rss.step.seen': 'Punto de partida',
  'automation.rss.step.targets': 'donde va',
  'automation.rss.step.template': 'lo que dice la publicación',
  'automation.rss.step.policy': 'como se publica',
  'automation.rss.stepOf': 'Step {current} of {total}',

  'automation.rss.urlHelp':
    'Relay obtiene el feed de nuestros servidores, no de su navegador. Se rechazan las direcciones de redes privadas.',
  'automation.rss.validateAction': 'Mira este feed',
  'automation.rss.validateFailed': 'Esa dirección no devolvió un feed legible.',
  'automation.rss.validateFailedReason': 'Lo que obtuvimos: {reason}',
  'automation.rss.validateBlocked':
    'Esa dirección apunta a una red privada, por lo que no fue recuperada.',
  'automation.rss.previewTitle': 'Vista previa del feed',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# artículo} many {# artículos} other {# artículos}} devueltos, los más nuevos primero.',
  'automation.rss.previewItemPublished': 'Published {dateTime}',
  'automation.rss.previewNoImage': 'No hay imagen en este artículo',
  'automation.rss.previewImageAlt': 'Imagen del feed item {title}',
  'automation.rss.previewNoDate':
    'Este elemento no tiene marca de tiempo, por lo que Relay usa la hora en que lo vio por primera vez.',
  'automation.rss.previewFieldsTitle': 'Campos que proporciona este feed',
  'automation.rss.previewFieldMissing': 'No presente en este feed',

  'automation.rss.seenTitle': 'Lo que cuenta como ya visto',
  'automation.rss.seenLatest':
    'Trate todo lo que se encuentra actualmente en el feed como se ve. Sólo se publican artículos futuros.',
  'automation.rss.seenAll':
    'Trate el artículo más nuevo como nuevo y publíquelo en el siguiente cheque.',
  'automation.rss.seenHelp':
    'La mayoría de los feeds contienen artículos antiguos. Elegir la primera opción es la forma de evitar publicar un trabajo pendiente.',

  'automation.rss.targetsHelp':
    'Elija las cuentas o el grupo guardado. Cada objetivo aún obtiene su propia validación antes de programar algo.',
  'automation.rss.targetGroup': 'grupo guardado',
  'automation.rss.targetIndividual': 'cuentas individuales',

  'automation.rss.templateFields': 'Campos disponibles',
  'automation.rss.templateInsert': 'Insert {field}',
  'automation.rss.templateField.title': 'Título del artículo',
  'automation.rss.templateField.summary': 'Resumen del artículo',
  'automation.rss.templateField.link': 'Enlace del artículo',
  'automation.rss.templateField.author': 'Autor del artículo',
  'automation.rss.templateField.published': 'Fecha de publicación',
  'automation.rss.templateField.categories': 'Categorías',
  'automation.rss.templatePreview': 'Vista previa con el elemento más nuevo',
  'automation.rss.adaptWithAi': 'Adaptar el texto para cada target',
  'automation.rss.adaptHelp':
    'El texto se reescribe para adaptarse a cada plataforma y se muestra como una diferencia que usted acepta o rechaza. Los medios provienen del elemento del feed. Relay no genera imágenes.',
  'automation.rss.noImageGeneration':
    'Si un elemento del feed no tiene imagen, la publicación se publica sin ella.',
  'automation.rss.imageFromFeed': 'Utilice la imagen del elemento del feed cuando tenga una.',

  'automation.rss.policyHelp':
    'Un elemento del feed no es especial. Sigue la misma política de aprobación que una publicación que usted mismo escribe.',
  'automation.rss.cadenceInterval': 'Un artículo como máximo cada',
  'automation.rss.cadenceHelp':
    'Los artículos adicionales esperan en la cola en lugar de publicarse juntos, por lo que un feed que publica diez artículos a la vez no inunda una cuenta.',
  'automation.rss.immediateWarning':
    'La publicación inmediata envía una publicación a una plataforma sin que una persona la lea primero. Está disponible sólo si la política de aprobación de estas cuentas lo permite.',

  'automation.rss.healthTitle': 'Salud de la alimentación',
  'automation.rss.healthOk': 'trabajando',
  'automation.rss.healthStalled': 'Ningún artículo nuevo for {duration}',
  'automation.rss.healthFailing':
    'Los last {count, plural, one {check} many {# controles} other {# controles}} fallaron',
  'automation.rss.health.nextPoll': 'Siguiente check {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Ningún artículo procesado todavía} one {# artículo procesado} many {# artículos procesados} other {# artículos procesados}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {No se omitieron duplicados} one {# duplicados omitidos} many {# duplicados omitidos} other {# duplicados omitidos}}',
  'automation.rss.health.lastPollLabel': 'Última comprobación',
  'automation.rss.health.lastItemLabel': 'Último elemento nuevo en el feed',
  'automation.rss.health.lastPostLabel': 'Último borrador o publicación creada',
  'automation.rss.health.processedLabel': 'Artículos procesados',
  'automation.rss.recentItems': 'Artículos recientes',
  'automation.rss.itemOutcome.draft': 'Borrador creado',
  'automation.rss.itemOutcome.scheduled': 'Programado for {time}',
  'automation.rss.itemOutcome.published': 'Publicado',
  'automation.rss.itemOutcome.awaitingApproval': 'Esperando aprobación',
  'automation.rss.itemOutcome.duplicate': 'Saltado, ya visto',
  'automation.rss.itemOutcome.failed': 'Fallido: {reason}',
  'automation.rss.pauseFeed': 'Pausar este feed',
  'automation.rss.resumeFeed': 'Reanudar este feed',
  'automation.rss.deleteTitle': 'Remove {title}?',
  'automation.rss.deleteBody':
    'Relay deja de comprobar este feed. Los borradores y publicaciones que ya creó permanecen exactamente como están.',
  'automation.rss.errorTitle': 'Este feed no se pudo leer.',
  'automation.rss.errorBody':
    'Relay sigue comprobando en el horario normal. No se publicó nada a partir de una respuesta parcial.',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'No disponible en ninguna regla',
  'automation.refuse.body':
    'Me gusta y seguidores automáticos, grupos de participación, respuestas y mensajes no solicitados y publicar el mismo contenido desde varias cuentas para que parezca popular no son opciones aquí. Las plataformas los prohíben y dañan las cuentas que los utilizan.',
  'automation.refuse.readPolicy': 'Lea la política de uso aceptable',
} as const;
