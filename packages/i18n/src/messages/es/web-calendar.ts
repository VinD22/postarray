/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'x',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'facebook',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Threads',
  'web.provider.bluesky': 'Bluesky',
  'web.provider.mastodon': 'Mastodon',
  'web.provider.telegram': 'Telegram',
  'web.provider.reddit': 'Reddit',
  'web.provider.wordpress': 'WordPress',
  'web.provider.medium': 'Medium',
  'web.provider.devto': 'Dev.to',
  'web.provider.pinterest': 'Pinterest',
  'web.provider.discord': 'Discord',
  'web.provider.slack': 'Slack',
  'web.connection.requirement.mastodon':
    'Mastodon se conecta con un token de acceso que creas en tu propia instancia, no con tu contraseña.',
  'web.connection.requirement.telegram':
    'Relay publica como un bot. Añade el bot al canal o grupo donde quieras publicar.',
  'web.connection.requirement.reddit':
    'Escribir en Reddit requiere una aplicación aprobada, y cada publicación necesita un título y un subreddit.',
  'web.connection.requirement.wordpress':
    'Relay publica a través de la API REST del sitio con una contraseña de aplicación que creas en WordPress.',
  'web.connection.requirement.medium':
    'Medium se conecta por OAuth y Relay publica historias públicas en Markdown.',
  'web.connection.requirement.devto':
    'Dev.to se conecta con una clave API creada en tu configuración de Dev.to.',
  'web.connection.requirement.pinterest':
    'Escribir en Pinterest requiere acceso de aplicación aprobado, y un pin necesita una imagen y un tablero propio.',
  'web.connection.requirement.discord':
    'Relay publica como un bot. Añade el bot a los servidores y canales donde quieras publicar.',
  'web.connection.requirement.slack':
    'Relay publica como una app. Añade la app a los canales donde quieras publicar.',
  'web.provider.fake': 'Conector de prueba',

  'web.accountType.personal_profile': 'perfil personal',
  'web.accountType.creator_profile': 'Cuenta de creador',
  'web.accountType.business_profile': 'cuenta comercial',
  'web.accountType.page': 'Página',
  'web.accountType.organization': 'Organización',
  'web.accountType.channel': 'canal',
  'web.accountType.group': 'grupo',
  'web.accountType.board': 'tablero',
  'web.accountType.community': 'Comunidad',
  'web.accountType.publication': 'Publicación',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Todo lo programado, en espera de aprobación, publicado o bloqueado, en un solo lugar.',
  'web.calendar.view.agenda': 'Agenda',
  'web.calendar.view.table': 'mesa',
  'web.calendar.view.switchLabel': 'Elige cómo se presenta el horario',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} to {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'Showing {range} in {timeZone}',
  'web.calendar.timeZone.workspace': 'Workspace zona horaria: {timeZone}',
  'web.calendar.timeZone.change': 'Cambio en la configuración del espacio de trabajo',
  'web.calendar.jumpToDate': 'Saltar a una cita',
  'web.calendar.nowLabel': 'ahora',
  'web.calendar.allDayHeading': 'Aún no hay hora exacta',

  'web.calendar.filter.group': 'grupo de clientes',
  'web.calendar.filter.anyBrand': 'cualquier marca',
  'web.calendar.filter.anyAccount': 'cualquier cuenta',
  'web.calendar.filter.anyPlatform': 'Cualquier plataforma',
  'web.calendar.filter.anyStatus': 'cualquier estado',
  'web.calendar.filter.anyLocale': 'Cualquier idioma de contenido',
  'web.calendar.filter.anyCampaign': 'Cualquier campaña',
  'web.calendar.filter.anyGroup': 'cada grupo',
  'web.calendar.filter.regionLabel': 'Filtrar el horario',
  'web.calendar.bucket.scheduled': 'Programado',
  'web.calendar.bucket.draft': 'Borradores y aprobaciones',
  'web.calendar.bucket.published': 'Publicado',
  'web.calendar.bucket.failed': 'necesita atencion',
  'web.calendar.filter.summary':
    '{count, plural, =0 {Sin filtros} one {# filtro} many {# filtros} other {# filtros}}, {results, plural, =0 {sin publicaciones} one {# publicación} many {# publicaciones} other {# publicaciones}}',

  'web.calendar.grid.label': 'Cuadrícula de horarios for {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Nada at {time} on {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {Mostrar # publicación más} many {Mostrar # publicaciones más} other {Mostrar # publicaciones más}}',
  'web.calendar.month.label': 'Cuadrícula del mes for {month}',
  'web.calendar.agenda.label': 'Agenda for {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Nada programado',

  'web.calendar.table.caption': 'Cada publicación in {range}, ordenada por hora de publicación.',
  'web.calendar.table.column.time': 'tiempo',
  'web.calendar.table.column.account': 'cuenta',
  'web.calendar.table.column.content': 'Contenido',
  'web.calendar.table.column.language': 'Idioma',
  'web.calendar.table.column.media': 'Medios',
  'web.calendar.table.column.status': 'Estado',
  'web.calendar.table.column.approver': 'Aprobador',
  'web.calendar.table.column.campaign': 'Campaña',
  'web.calendar.table.column.actions': 'Acciones',
  'web.calendar.table.rowMenu': 'Acciones for {title}',
  'web.calendar.table.noApprover': 'No se necesita aprobación',
  'web.calendar.table.noCampaign': 'Sin campaña',

  'web.calendar.entry.untitled': 'Borrador sin título',
  'web.calendar.entry.language': 'Language {locale}',
  'web.calendar.entry.openDetail': 'Open {title}',
  'web.calendar.entry.selected': '{title} seleccionado. {hint}',
  'web.calendar.detail.title': 'Publicación programada',
  'web.calendar.detail.close': 'Cerrar esta publicación',

  'web.calendar.keyboard.title': 'Mover una publicación con el teclado',
  'web.calendar.keyboard.body':
    'Enfoca una publicación y presiona Enter para abrirla. Presione M para seleccionar una publicación, luego use las teclas de flecha para moverla una ranura y Enter para confirmar. Presione Escape para volver a colocarlo.',
  'web.calendar.keyboard.pickUp': 'Mover esta publicación',
  'web.calendar.keyboard.grabbed':
    '{title} recogió from {from}. Las teclas de flecha lo mueven. Entrar confirma. La fuga se cancela.',
  'web.calendar.keyboard.moved': 'Propuesto time {to}. Entrar confirma.',
  'web.calendar.keyboard.released': '{title} poner de nuevo at {from}.',
  'web.calendar.keyboard.stepMinutes': 'Cada paso is {minutes} minutos.',

  'web.calendar.reschedule.title': '¿Mover esta publicación?',
  'web.calendar.reschedule.subject': '{account} on {provider}',
  'web.calendar.reschedule.from': 'From {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'To {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Mover publicación',
  'web.calendar.reschedule.dstTitle': 'Los relojes cambian entre estos dos tiempos.',
  'web.calendar.reschedule.dstBody':
    'El desplazamiento in {timeZone} is {fromOffset} en el tiempo anterior and {toOffset} en el nuevo tiempo. La hora local que usted eligió se mantiene, por lo que el instante UTC cambia.',
  'web.calendar.reschedule.conflictTitle': 'Otras publicaciones están cerca de este momento.',
  'web.calendar.reschedule.conflictBody':
    '{account} ya has {count, plural, one {# post} many {# posts} other {# posts}} within {window} del nuevo tiempo.',
  'web.calendar.reschedule.campaignTitle': 'Conflicto de campaña',
  'web.calendar.reschedule.campaignBody':
    'Campaign {campaign} ejecuta from {start} to {end}. La nueva hora está fuera de esa ventana.',
  'web.calendar.reschedule.leadTimeTitle': 'esto es muy pronto',
  'web.calendar.reschedule.leadTimeBody':
    'La nueva hora is {duration} a partir de ahora. {provider} needs {required} para preparar los medios para este tipo de publicación.',
  'web.calendar.reschedule.pastTitle': 'Ese tiempo ha pasado',
  'web.calendar.reschedule.pastBody': 'Elija un momento en el futuro o publíquelo ahora.',

  'web.calendar.published.title': 'Esta publicación ya está publicada.',
  'web.calendar.published.body':
    'Existe una publicación on {provider} at {permalinkLabel}. Mover la entrada en Relay no mueve la publicación en la plataforma. Elige lo que quieres que suceda.',
  'web.calendar.published.optionLocal': 'Actualizar solo el registro local',
  'web.calendar.published.optionLocalHint':
    'El recibo mantiene el tiempo de publicación real. Solo se mueve la entrada de planificación, por lo que su calendario coincide con su plan.',
  'web.calendar.published.optionNew': 'Programe una nueva publicación en el nuevo horario',
  'web.calendar.published.optionNewHint':
    'Esto crea una segunda publicación externa separada. El que ya on {provider} permanece en línea.',
  'web.calendar.published.optionLabel': '¿Qué debería pasar?',

  'web.calendar.attention.title':
    '{count, plural, one {# publicación necesita una decisión o una solución} many {# publicaciones necesita una decisión o una solución} other {# publicaciones necesita una decisión o una solución}}',
  'web.calendar.attention.body': 'Se quedan aquí y en el centro de acción hasta que se resuelvan.',
  'web.calendar.attention.open': 'Abrir el centro de acción',
  'web.calendar.attention.showOnly': 'Mostrar solo estos',

  'web.calendar.loading': 'Cargando el horario',
  'web.calendar.error.title': 'No se pudo cargar el horario',
  'web.calendar.error.body':
    'Nada de lo programado ha cambiado. Tus publicaciones aún se publican en los horarios planificados.',
  'web.calendar.error.retry': 'Inténtalo de nuevo',
  'web.calendar.empty.example':
    '09:30 Europa/Berlín, X @acme, "Los primeros comentarios programados están en vivo", programado, 1 imagen',
  'web.calendar.emptyFiltered.body':
    'Ninguna publicación in {range} coincide con estos filtros. Amplíe el rango o borre un filtro.',
  'web.calendar.offline.title': 'Estás desconectado',
  'web.calendar.offline.body':
    'El siguiente programa es la última copia que cargó este dispositivo. La reprogramación y la publicación no están disponibles hasta que se restablezca la conexión.',
  'web.calendar.rateLimited.cause':
    'Este espacio de trabajo lee el calendario más veces de las que permite la ventana actual.',
  'web.calendar.rateLimited.resetLabel': 'Puedes volver a intentarlo en',
  'web.calendar.rateLimited.resetUnknown': '{provider} no dijo cuándo se restablece esto.',
  'web.calendar.permission.requirementsLabel': 'Alcance requerido',
  'web.calendar.permission.title': 'No puedes ver este calendario',
  'web.calendar.permission.body':
    'El acceso al calendario se otorga por marca. Su cuenta no está en las marcas en esta vista.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Calendario',
  'web.receipt.breadcrumb.post': 'Publicar',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Cargando el recibo de publicación',
  'web.receipt.notFound.title': 'No hay recibo con esa referencia.',
  'web.receipt.notFound.body':
    'Un recibo existe una vez que se ha enviado una publicación. Consulta la referencia o abre el post desde el calendario.',
  'web.receipt.error.title': 'No se pudo cargar el recibo',
  'web.receipt.error.body':
    'El recibo es inmutable y no se ve afectado por esto. No se volvió a publicar nada.',

  'web.receipt.section.summary': 'que paso',
  'web.receipt.section.timeline': 'Cronograma del evento',
  'web.receipt.section.items': 'Publicación raíz y elementos de seguimiento',
  'web.receipt.section.attempts': 'Intentos',
  'web.receipt.section.provenance': 'Procedencia',
  'web.receipt.section.cost': 'Uso del proveedor',
  'web.receipt.section.analytics': 'Sincronización de análisis',
  'web.receipt.section.targets': 'Objetivos en esta campaña',

  'web.receipt.item.root': 'Publicación raíz',
  'web.receipt.item.comment': 'Comment {position}',
  'web.receipt.item.thread': 'Hilo part {position}',
  'web.receipt.item.delay': 'Runs {delay} después de la publicación raíz',
  'web.receipt.item.noDelay': 'Se ejecuta con la publicación raíz.',
  'web.receipt.item.pending': 'Aún no iniciado',
  'web.receipt.item.rootUnaffected':
    'La publicación raíz está activa. Un elemento de seguimiento que falla nunca cambia eso.',

  'web.receipt.attempt.heading': 'Attempt {number}',
  'web.receipt.attempt.startedAt': 'Started {time}',
  'web.receipt.attempt.startedLabel': 'iniciado',
  'web.receipt.attempt.responseSummary': 'Respuesta desinfectada del proveedor',
  'web.receipt.attempt.duration': 'Took {duration}',
  'web.receipt.attempt.httpStatus': 'Estado HTTP',
  'web.receipt.attempt.providerRequestId': 'Referencia de solicitud del proveedor',
  'web.receipt.attempt.retryable': 'Reintentado automáticamente',
  'web.receipt.attempt.notRetryable': 'No reintentado automáticamente',
  'web.receipt.attempt.nextRetry': 'Siguiente intento at {time}',
  'web.receipt.attempt.nextRetryLabel': 'Próximo intento',
  'web.receipt.attempt.showResponse': 'Mostrar la respuesta del proveedor desinfectada',
  'web.receipt.attempt.hideResponse': 'Ocultar la respuesta del proveedor desinfectada',
  'web.receipt.attempt.none': 'Un intento, ningún fracaso.',

  'web.receipt.provenance.capabilityVersion': 'Instantánea de capacidad',
  'web.receipt.provenance.capabilityHint':
    'La instantánea utilizada en la aprobación y revisada antes del envío.',
  'web.receipt.provenance.accountType': 'Tipo de cuenta',
  'web.receipt.provenance.externalAccount': 'Referencia de cuenta externa',
  'web.receipt.provenance.workflow': 'Referencia de flujo de trabajo',
  'web.receipt.provenance.createdAt': 'Recibo written {time}',

  'web.receipt.approval.notRequired': 'No se requirió aprobación para este objetivo.',
  'web.receipt.approval.policy': 'Policy {policy}',
  'web.receipt.approval.unknownPolicy': 'Referencia de política no registrada',

  'web.receipt.cost.currency': 'Cargado in {currency}',
  'web.receipt.cost.estimatedLabel': 'Estimado antes de publicar',
  'web.receipt.cost.actualLabel': 'Conciliado real',
  'web.receipt.provenance.writtenLabel': 'Recibo escrito',
  'web.receipt.cost.reconciledAt': 'Reconciled {time}',
  'web.receipt.cost.notMetered': '{provider} no cobra por operación para este tipo de publicación.',

  'web.receipt.analytics.never': 'Los análisis aún no se han sincronizado para esta publicación.',
  'web.receipt.analytics.explain':
    'Los proveedores agregan según sus propios horarios. El momento a continuación es cuando Relay los leyó por última vez, no cuando los números eran verdaderos.',

  'web.receipt.export.download': 'Descargar el recibo',
  'web.receipt.export.copyReference': 'Copiar la referencia del recibo',
  'web.receipt.export.denied':
    'Para compartir un recibo se necesita el rol de propietario, administrador o aprobador. Tú are {role}.',

  'web.receipt.partial.retryFailedOnly': 'Reintentar sólo los objetivos que fallaron',
  'web.receipt.partial.retryHint':
    'Un reintento nunca toca un objetivo que ya produjo una publicación externa.',

  'web.receipt.remediation.user_action_required':
    'Esto necesita un cambio en Relay o on {provider} antes de que pueda ejecutarse nuevamente.',
  'web.receipt.remediation.content_invalid':
    'Edite el contenido para que tenga passes {provider} validación y luego prográmelo nuevamente.',
  'web.receipt.remediation.transient_provider':
    '{provider} devolvió un error temporal. Relay volvió a intentarlo según su propio cronograma.',
  'web.receipt.remediation.permanent_provider':
    '{provider} rechazó esto permanentemente. Volver a intentar el mismo contenido no cambiará la respuesta.',
  'web.receipt.remediation.internal':
    'Esto fue un error de nuestra parte. Está registrado con la referencia a continuación.',
  'web.receipt.remediation.unknown':
    '{provider} devolvió algo para lo que no tenemos una regla. La respuesta desinfectada se encuentra a continuación.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Cuentas',
  'web.connection.tab.capabilities': 'Matriz de capacidades',
  'web.connection.tab.groups': 'Grupos de clientes',
  'web.connection.loading': 'Cargando cuentas conectadas',
  'web.connection.error.title': 'No se pudieron cargar las cuentas conectadas',
  'web.connection.error.body':
    'La publicación no se ve afectada. Las publicaciones programadas aún se ejecutan contra el acceso almacenado.',
  'web.connection.list.label': 'Cuentas conectadas',
  'web.connection.empty.example':
    'X, @acme, perfil personal, conectado el 12 de junio por Ana Ruiz, publicación y métricas, publicado por última vez el 6 de agosto',
  'web.connection.filter.provider': 'Plataforma',
  'web.connection.filter.health': 'Salud',
  'web.connection.filter.group': 'grupo de clientes',
  'web.connection.filter.anyHealth': 'cualquier salud',
  'web.connection.healthFilter.healthy': 'trabajando',
  'web.connection.healthFilter.expiring_soon': 'Expira pronto',
  'web.connection.healthFilter.expired': 'Acceso caducado',
  'web.connection.healthFilter.revoked': 'Acceso revocado',
  'web.connection.healthFilter.permission_missing': 'Permiso faltante',
  'web.connection.healthFilter.review_pending': 'Esperando revisión de la plataforma',
  'web.connection.healthFilter.paused': 'En pausa',
  'web.connection.healthFilter.unknown': 'Salud no disponible',

  'web.connection.row.summaryLabel': 'Qué puede hacer esta cuenta',
  'web.connection.row.expand': 'Mostrar el resumen completo for {account}',
  'web.connection.row.collapse': 'Ocultar el resumen completo for {account}',
  'web.connection.row.metered': 'Medido por operación. Estimated {amount} por publicación creada.',
  'web.connection.row.limitationHeading': 'Limitaciones de esta cuenta',
  'web.connection.row.noLimitations': 'No hay limitaciones de producción o beta en esta cuenta.',
  'web.connection.row.beta': 'Conector beta',
  'web.connection.row.betaBody':
    'Este conector funciona, con límites que no hemos terminado de verificar. Consulte la publicación publicada antes de confiar en ella.',

  'web.connection.detail.expiryLabel': 'El acceso caduca',
  'web.connection.health.expiresIn': 'Acceso expires {relativeTime}, on {date}',
  'web.connection.health.noExpiry':
    'Este acceso no caduca en un schedule {provider} nos lo indica.',
  'web.connection.health.checkedAt': 'Salud checked {relativeTime}',

  'web.connection.action.inspect': 'Inspeccionar permisos',
  'web.connection.action.viewCapabilities': 'Mira lo que soporta',
  'web.connection.action.moveGroup': 'Pasar a otro grupo',
  'web.connection.action.menu': 'Más acciones for {account}',

  'web.connection.pause.title': 'Pause {account}?',
  'web.connection.resume.title': 'Resume {account}?',
  'web.connection.resume.body':
    'Las publicaciones programadas para esta cuenta comienzan a publicarse nuevamente en los horarios planificados. Las publicaciones cuyo tiempo ya haya pasado no se activan de forma retroactiva.',
  'web.connection.disconnect.confirmWord': 'DESCONECTAR',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# publicación programada} many {# publicaciones programadas} other {# publicaciones programadas}} para esta cuenta no se publicará.',
  'web.connection.disconnect.consequence.published':
    'Las publicaciones ya publicadas permanecen on {provider}. Relay no los elimina.',
  'web.connection.disconnect.consequence.analytics':
    'Las métricas ya recopiladas permanecen en este espacio de trabajo y dejan de actualizarse.',

  'web.connection.connect.title': 'Conectar una cuenta',
  'web.connection.connect.chooseProvider': '¿Qué plataforma?',
  'web.connection.connect.permissionHeading': '¿Para qué Relay será ask {provider}?',
  'web.connection.connect.requirementHeading': 'Antes de continuar',
  'web.connection.connect.continue': 'Continuar to {provider}',
  'web.connection.connect.handoffNote':
    'La siguiente pantalla is {provider}, no Relay. Relay nunca ve su contraseña.',
  'web.connection.connect.noWriteWithoutApproval':
    'Conectar una cuenta no publica nada. Cada publicación sigue esta política de aprobación del espacio de trabajo.',

  'web.connection.requirement.instagram':
    'Instagram la publicación necesita una cuenta profesional, lo que significa una cuenta comercial o de creador vinculada a una página de Facebook.',
  'web.connection.requirement.facebook':
    'Relay publica en Facebook Pages. Un perfil personal no puede ser un objetivo de publicación.',
  'web.connection.requirement.linkedin':
    'Para publicar para una organización, necesita una función de administrador de contenido en esa página de LinkedIn.',
  'web.connection.requirement.youtube':
    'Hasta que Google complete la auditoría de la aplicación, las cargas de este proyecto se publican como privadas. Puedes cambiar la visibilidad en YouTube después.',
  'web.connection.requirement.tiktok':
    'TikTok requiere que usted mismo elija la audiencia para cada publicación. Relay no puede preseleccionar uno por usted.',
  'web.connection.requirement.x':
    'X cargos por operación. Una publicación que contiene una URL cuesta más que una publicación de texto sin formato y la estimación se muestra antes de programarla.',
  'web.connection.requirement.threads':
    'La publicación Threads utiliza la cuenta vinculada a su cuenta profesional Instagram.',
  'web.connection.requirement.bluesky':
    'Bluesky se conecta con una contraseña de aplicación creada en su configuración de Bluesky, no con la contraseña de su cuenta.',
  'web.connection.requirement.generic':
    'Necesitas permiso para publicar en esta cuenta desde la propia plataforma. Relay no puede concederlo.',

  'web.connection.purpose.publish': 'Publicando las publicaciones que programes en Relay.',
  'web.connection.purpose.readPosts':
    'Leer una publicación Relay publicada para que el recibo pueda demostrar que está publicada.',
  'web.connection.purpose.identity':
    'Mostrando el nombre exacto de la cuenta en Relay, para que nunca publiques en la cuenta equivocada.',
  'web.connection.purpose.analytics':
    'Leer las métricas que informa esta plataforma para sus propias publicaciones.',
  'web.connection.purpose.refresh':
    'Mantener activo el acceso para que una publicación programada no falle de la noche a la mañana.',
  'web.connection.purpose.chooseDestination':
    'Listado de las páginas y canales que puede elegir como destino de publicación.',

  'web.connection.permissions.title': 'Permisos on {account}',
  'web.connection.permissions.scopeColumn': 'Permiso',
  'web.connection.permissions.stateColumn': 'Estado',
  'web.connection.permissions.purposeColumn': 'Para qué lo usa Relay',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {falta # permisos} many {faltan # permisos} other {faltan # permisos}}. Vuelva a conectarse y acéptelo para restaurar las funciones siguientes.',
  'web.connection.permissions.snapshot': 'Leer from {provider} {relativeTime}',

  'web.connection.capability.title': 'Matriz de capacidades',
  'web.connection.capability.subtitle':
    'Generado a partir de las definiciones de conectores versionadas en esta compilación y luego revisado manualmente. Son los mismos datos que utilizan el compositor y la página de capacidad pública.',
  'web.connection.capability.tableLabel': 'Capacidades por plataforma',
  'web.connection.capability.featureColumn': 'Capacidad',
  'web.connection.capability.legendTitle': 'como leer esto',
  'web.connection.capability.legend.supported':
    'Relay puede hacer esto hoy para una cuenta conectada del tipo correcto.',
  'web.connection.capability.legend.not_implemented':
    'La plataforma ofrece esto y Relay aún no lo ha creado. Está en la hoja de ruta del conector.',
  'web.connection.capability.legend.unsupported':
    'La plataforma no ofrece esto a través de su API oficial, por lo que ninguna herramienta puede hacerlo de forma segura.',
  'web.connection.capability.legend.requires_review':
    'Construido y la plataforma lo otorga solo después de revisar la aplicación o la cuenta.',
  'web.connection.capability.versionLabel': 'Definiciones de conectores',
  'web.connection.capability.version': 'Definiciones de conectores version {version}',
  'web.connection.capability.observedAt': 'Instantánea read {relativeTime}',
  'web.connection.capability.forAccount': 'Mostrado for {account}',
  'web.connection.capability.noSnapshot':
    'Aún no hay una instantánea de capacidad para esta cuenta. Vuelva a conectarse para leer uno.',
  'web.connection.capability.cellLabel': '{feature} on {provider}: {state}',

  'web.connection.group.title': 'Grupos de clientes',
  'web.connection.group.listLabel': 'Grupos de clientes',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Sin cuentas} one {# cuenta} many {# cuentas} other {# cuentas}}',
  'web.connection.group.create': 'Crear un grupo',
  'web.connection.group.nameLabel': 'Nombre del grupo',
  'web.connection.group.namePlaceholder': 'Acme UE',
  'web.connection.group.moveTitle': 'Move {account}',
  'web.connection.group.moveLabel': 'Mover a',
  'web.connection.group.moveConfirm': 'Mover cuenta',
  'web.connection.group.movedAnnouncement': '{account} movió to {group}',
  'web.connection.group.filterCalendarHint':
    'Un grupo filtra el calendario y las analíticas. Al mover una cuenta se conservan todas las publicaciones, recibos y métricas que ya tiene.',
  'web.connection.group.empty.title': 'Aún no hay grupos de clientes',
  'web.connection.group.empty.body':
    'Un grupo es un cliente o una marca. Cuentas grupales para filtrar el calendario y analíticas por cliente.',

  'web.connection.incident.title': 'Esta cuenta necesita atención.',
  'web.connection.incident.remediationHeading': 'que hacer',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# publicación programada está en espera} many {# publicaciones programadas están en espera} other {# publicaciones programadas están en espera}} para esta cuenta.',
  'web.connection.incident.nothingLost': 'Nada se pierde y nada se duplica.',
} as const;
