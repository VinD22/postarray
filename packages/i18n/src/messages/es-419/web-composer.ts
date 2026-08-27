/** Spanish (Latin America) beta catalog. B5 legal, billing and consent messages deliberately use English fallback. */
export const webComposerMessages = {
  'composerWeb.pane.targets': 'Cuentas y conjuntos de destino',
  'composerWeb.pane.master': 'Borrador maestro y configuración compartida',
  'composerWeb.pane.variant': 'Versión para el objetivo abierto.',
  'composerWeb.pane.review': 'Vista previa, validación, coste y aprobación.',
  'composerWeb.pane.showPreview': 'Mostrar vista previa',
  'composerWeb.pane.hidePreview': 'Ocultar vista previa',
  'composerWeb.pane.previewCollapsed':
    'El panel de vista previa está oculto. Ábrelo para comprobar la publicación final.',
  'composerWeb.step.targets': 'Objetivos',
  'composerWeb.step.write': 'escribir',
  'composerWeb.step.perTarget': 'Por objetivo',
  'composerWeb.step.review': 'Revisión',
  'composerWeb.step.progress': 'paso {current}de {total}',
  'composerWeb.step.legend': 'Composer pasos',
  'composerWeb.summary.label': 'Borrador de resumen',
  'composerWeb.summary.targets':
    '{count, plural, =0 {Sin objetivos} one {#objetivo} other {#objetivos} many {#objetivos}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {Sin problemas} one {#problema} other {#problemas} many {#problemas}}',
  'composerWeb.summary.notScheduled': 'No hay tiempo elegido',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Costo aún sin precio',
  'composerWeb.summary.openReview': 'Abrir revisión',
  'composerWeb.rail.masterEntry': 'borrador maestro',
  'composerWeb.rail.masterHint': 'Edite aquí para llegar a todos los objetivos que aún heredan.',
  'composerWeb.rail.accountsHeading': 'Cuentas objetivo',
  'composerWeb.rail.setsHeading': 'Conjuntos y grupos',
  'composerWeb.rail.setsHelp':
    'Un Conjunto es un grupo guardado de cuentas y valores predeterminados. La aplicación de uno copia sus valores en este borrador. Las ediciones posteriores del Conjunto no cambian este borrador.',
  'composerWeb.rail.openTarget': 'Abra la versión para{account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Límite desconocido',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {sin medios} one {#archivo multimedia} other {#archivos multimedia} many {#archivos multimedia}}',
  'composerWeb.rail.paused': 'En pausa. No se publicará hasta que lo reanudes.',
  'composerWeb.rail.state.notBuilt': 'Aún no construido',
  'composerWeb.rail.state.unsupported': 'El proveedor no admite',
  'composerWeb.rail.empty': 'Aún no hay cuentas seleccionadas.',
  'composerWeb.rail.emptyHelp':
    'Elija las cuentas a las que debería llegar esta publicación. Puedes agregar más más tarde.',
  'composerWeb.rail.divergenceHint':
    'Abra un objetivo para ver su propia versión. El borrador maestro no ha cambiado.',
  'composerWeb.rail.searchLabel': 'Filtrar cuentas',
  'composerWeb.rail.removeTarget': 'Quitar {account}',
  'composerWeb.globalEdit.open': 'Edición global',
  'composerWeb.globalEdit.title': 'Aplicar este cambio a cada objetivo seleccionado.',
  'composerWeb.globalEdit.description':
    'El borrador maestro siempre cambia. Los objetivos que aún heredan este campo lo siguen. Los objetivos con su propia versión la conservan.',
  'composerWeb.globalEdit.fieldLabel': 'campo',
  'composerWeb.globalEdit.compatibleHeading': 'Estos objetivos toman el cambio',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Estos objetivos mantienen su propia versión.',
  'composerWeb.globalEdit.incompatibleHeading': 'Estos objetivos no pueden aceptar el cambio.',
  'composerWeb.globalEdit.incompatibleHelp':
    'No se cae nada sin decírtelo. Cada cuenta a continuación obtiene una versión explícita con el cambio adaptado y puedes editarla después.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account}permite {limit}personajes. Este texto es {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account}no acepta un enlace en este campo. El vínculo permanece en el borrador maestro y en los objetivos que lo permiten.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account}acepta {limit, plural, one {#archivo} other {#archivos} many {#archivos}}. Este borrador tiene {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported': '{account}no acepta {mimeType}archivos.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account}no admite elementos de seguimiento, por lo que la secuencia permanece en el borrador maestro.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account}publica texto plano. Las marcas de formato aparecerían como caracteres.',
  'composerWeb.globalEdit.adaptedPreview': 'que {account}obtiene en su lugar',
  'composerWeb.globalEdit.confirm': 'Aplicar y crear las versiones.',
  'composerWeb.globalEdit.nothingToApply': 'Nada cambia. El borrador maestro ya tiene este valor.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Cambio aplicado a #objetivo} other {Cambio aplicado a #objetivos} many {Cambio aplicado a #objetivos}}. {adapted, plural, =0 {Ningún objetivo necesitaba una versión adaptada} one {#target obtuvo una versión adaptada} other {#Los objetivos obtuvieron versiones adaptadas.} many {#Los objetivos obtuvieron versiones adaptadas.}}.',
  'composerWeb.override.heading': 'Este objetivo tiene su propia versión.',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {#El campo difiere del borrador maestro.} other {#Los campos difieren del borrador maestro.} many {#Los campos difieren del borrador maestro.}}',
  'composerWeb.override.field.body': 'Publicar texto',
  'composerWeb.override.field.contentKind': 'Tipo de publicación',
  'composerWeb.override.field.locale': 'Idioma del contenido',
  'composerWeb.override.field.mediaIds': 'Medios',
  'composerWeb.override.field.links': 'Enlaces',
  'composerWeb.override.field.signature': 'Firma',
  'composerWeb.override.field.threadItems': 'Comentarios e hilo',
  'composerWeb.override.field.schedule': 'Horario',
  'composerWeb.override.resetField': 'Reiniciar {field}dominar',
  'composerWeb.override.resetFieldTitle': 'Reiniciar {field}para {account}?',
  'composerWeb.override.resetFieldBody':
    'la versión de {field}escrito para {account}se descarta y el borrador maestro se utiliza nuevamente. Ningún otro objetivo cambia.',
  'composerWeb.override.resetAll': 'Restablecer todos los campos para dominar',
  'composerWeb.override.inheritNotice':
    'Este objetivo sigue el borrador maestro. Editar cualquier cosa aquí crea solo una versión. {account}recibe.',
  'composerWeb.override.created': '{account}ahora tiene el suyo {field}.',
  'composerWeb.limits.heading': 'Límites para {account}',
  'composerWeb.limits.text': 'Texto hasta {limit}personajes',
  'composerWeb.limits.linkCost':
    'Un enlace cuenta como{count, plural, one {#personaje} other {#personajes} many {#personajes}}cualquiera que sea su longitud.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Sin imágenes} one {#imagen} other {hasta #imágenes} many {hasta #imágenes}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {Sin vídeo} one {#vídeo} other {hasta #vídeos} many {hasta #vídeos}}',
  'composerWeb.limits.duration': 'vídeo hasta {duration}',
  'composerWeb.limits.aspect': 'Relación de aspecto entre {min}y {max}',
  'composerWeb.limits.fileSize': 'Archivos hasta {size}',
  'composerWeb.limits.mimeTypes': 'Tipos de archivos aceptados: {types}',
  'composerWeb.limits.source': 'De la instantánea de capacidad {version}, leer {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'Se requiere una miniatura.',
  'composerWeb.native.heading': '{provider}ajustes',
  'composerWeb.native.privacyChoose': 'Elige una audiencia',
  'composerWeb.native.privacyExplicit':
    '{provider}no permite una audiencia preseleccionada. Elija uno antes de que se pueda programar esto.',
  'composerWeb.native.community': 'Comunidad',
  'composerWeb.native.board': 'tablero',
  'composerWeb.native.group': 'Grupo o página',
  'composerWeb.native.organization': 'Organización',
  'composerWeb.native.channel': 'canal',
  'composerWeb.native.publication': 'Publicación',
  'composerWeb.native.disclosureHeading': 'Divulgación',
  'composerWeb.native.disclosureCommercial': 'Esta publicación promociona un producto o servicio.',
  'composerWeb.native.disclosureBranded':
    'Esta publicación es contenido de marca para otra empresa.',
  'composerWeb.native.disclosureAi':
    'Parte de este contenido se creó con una herramienta de inteligencia artificial.',
  'composerWeb.native.disclosureUnsupported':
    '{provider}no ofrece esta divulgación a través de su API. Agréguelo en el texto en su lugar.',
  'composerWeb.native.none': 'No {provider}La configuración se aplica a este tipo de publicación.',
  'composerWeb.entity.resolvedHeading': 'Resuelto el {provider}',
  'composerWeb.entity.resolvedId': 'ID de cuenta {externalId}',
  'composerWeb.entity.plainTextWarning':
    'No coincidente. Se publicará como texto sin formato, que no es una etiqueta nativa en {provider}.',
  'composerWeb.entity.removeMention': 'Eliminar la mención de {label}',
  'composerWeb.entity.addMention': 'Añadir una mención',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Sin menciones} one {#mencionar} other {#menciona} many {#menciona}}, {resolved}emparejado con una cuenta real',
  'composerWeb.entity.lookupUnsupported':
    '{provider}no ofrece búsqueda de entidades para este tipo de cuenta.',
  'composerWeb.entity.lookupNotBuilt':
    'Post Array no ha creado una búsqueda de entidades para {provider}todavía. Mientras tanto no se adivina nada.',
  'composerWeb.entity.searchHint': 'Escriba al menos dos caracteres y luego elija un resultado.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {No hay coincidencias} one {#partido} other {#partidos} many {#partidos}}',
  'composerWeb.links.heading': 'Enlaces',
  'composerWeb.links.detected':
    '{count, plural, one {#enlace encontrado en este borrador} other {#enlaces encontrados en este borrador} many {#enlaces encontrados en este borrador}}',
  'composerWeb.links.noneDetected': 'Aún no hay enlaces en este borrador.',
  'composerWeb.links.modeLabel': 'Cómo se publica este enlace',
  'composerWeb.links.original': 'URL original',
  'composerWeb.links.utmSource': 'Fuente',
  'composerWeb.links.utmMedium': 'Medio',
  'composerWeb.links.utmCampaign': 'Campaña',
  'composerWeb.links.utmTerm': 'Término',
  'composerWeb.links.utmContent': 'Contenido',
  'composerWeb.links.domainVerified': '{domain}, verificado para este espacio de trabajo',
  'composerWeb.links.domainDefault': 'Post Array dominio predeterminado',
  'composerWeb.links.domainNone': 'Aún no se ha verificado ningún dominio de marca.',
  'composerWeb.links.notAllowedHere': '{account}no permite un enlace aquí.',
  'composerWeb.sequence.kindComment': 'Comentario',
  'composerWeb.sequence.kindThread': 'Parte del hilo',
  'composerWeb.sequence.kindLabel': 'tipo de artículo',
  'composerWeb.sequence.moveUp': 'Mover este elemento antes',
  'composerWeb.sequence.moveDown': 'Mover este elemento más tarde',
  'composerWeb.sequence.remove': 'Eliminar este elemento',
  'composerWeb.sequence.absoluteTime': 'corre en {time}, que es {utc}hora UTC.',
  'composerWeb.sequence.partialFailure':
    'Si un elemento falla, la publicación ya publicada permanece publicada y los elementos posteriores no se publican. Obtienes un elemento de acción.',
  'composerWeb.sequence.maxReached':
    '{account}acepta {limit, plural, one {#artículo de seguimiento} other {#elementos de seguimiento} many {#elementos de seguimiento}}.',
  'composerWeb.sequence.minDelay': 'El retraso más corto {provider}permite aquí está {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Misma cuenta que la publicación.',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Sin problemas} one {#problema} other {#problemas} many {#problemas}}en este artículo',
  'composerWeb.sequence.customMinutes': 'Minutos después del elemento anterior',
  'composerWeb.repeat.enable': 'Repite esta publicación',
  'composerWeb.repeat.cadenceLabel': '¿Con qué frecuencia?',
  'composerWeb.repeat.maximum':
    'Una publicación repetida puede ejecutarse como máximo {limit}veces.',
  'composerWeb.repeat.occurrenceLabel': 'Número de publicaciones',
  'composerWeb.repeat.duplicateCheck':
    'Cada aparición se verifica en busca de contenido duplicado antes de su publicación. Una ocurrencia que no pasa la verificación se convierte en un elemento de acción en lugar de publicarse.',
  'composerWeb.repeat.occurrenceList': 'Primeras apariciones',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {y #más ocurrencia} other {y #más ocurrencias} many {y #más ocurrencias}}',
  'composerWeb.set.heading': 'Conjuntos y firma',
  'composerWeb.set.pickerTitle': 'Empezar desde un conjunto',
  'composerWeb.set.pickerDescription':
    'Un conjunto completa objetivos, texto y configuraciones. El borrador que crea es independiente, por lo que editar el conjunto más tarde nunca cambia una publicación aprobada o programada.',
  'composerWeb.set.accountCount': '{count, plural, one {#cuenta} other {#cuentas} many {#cuentas}}',
  'composerWeb.set.apply': 'Utilice este conjunto',
  'composerWeb.set.none': 'Aún no hay conjuntos guardados.',
  'composerWeb.signature.pickerLabel': 'Firma',
  'composerWeb.signature.scope': 'Para {project}en {provider}en {language}',
  'composerWeb.signature.previewHeading': 'Como termina el post',
  'composerWeb.signature.notMatching':
    'Esta firma está dirigida a un proyecto, plataforma o idioma diferente, por lo que no se ofrece aquí.',
  'composerWeb.assist.menuLabel': 'Ayuda con este texto',
  'composerWeb.assist.unavailableTitle': 'La asistencia de texto no está configurada',
  'composerWeb.assist.unavailableBody':
    'No hay ninguna puerta de enlace de IA configurada para este espacio de trabajo, por lo que las acciones de asistencia están desactivadas. Todo lo demás en el compositor funciona con normalidad.',
  'composerWeb.assist.targetLabel': 'Se aplica a',
  'composerWeb.assist.targetMaster': 'El borrador maestro',
  'composerWeb.assist.targetVariant': 'La versión para {account}',
  'composerWeb.assist.beforeLabel': 'Texto actual',
  'composerWeb.assist.afterLabel': 'Texto propuesto',
  'composerWeb.assist.regionLabel': 'Cambio de texto propuesto, aún no aplicado',
  'composerWeb.assist.added': 'añadido',
  'composerWeb.assist.removed': 'eliminado',
  'composerWeb.assist.evidence': 'Evidencia y fuentes',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'No se encontró ninguna fuente para esta afirmación. Compruébalo antes de publicar.',
  'composerWeb.assist.failed':
    'La solicitud de asistencia no se completó. Su texto no ha cambiado.',
  'composerWeb.assist.noMediaGeneration':
    'Post Array no crea imágenes ni videos. Traiga los archivos terminados a la biblioteca y publíquelos aquí.',
  'composerWeb.autosave.pinned':
    'Esta es la versión aprobada. Editarlo crea una nueva versión y borra la aprobación.',
  'composerWeb.autosave.pinnedAcknowledge': 'Editar y borrar la aprobación',
  'composerWeb.autosave.conflictTitle': 'Dos versiones de este borrador.',
  'composerWeb.autosave.conflictKeepMine': 'guarda lo que escribi',
  'composerWeb.autosave.conflictKeepTheirs': 'Utilice la versión de {name}',
  'composerWeb.autosave.conflictHelp':
    'Nada se fusiona automáticamente. Elija por campo y luego guarde.',
  'composerWeb.autosave.retry': 'Intenta guardar de nuevo',
  'composerWeb.shortcuts.title': 'Composer atajos',
  'composerWeb.shortcuts.nextTarget': 'próximo objetivo',
  'composerWeb.shortcuts.previousTarget': 'Objetivo anterior',
  'composerWeb.shortcuts.nextIssue': 'Próximo número',
  'composerWeb.shortcuts.previousIssue': 'Número anterior',
  'composerWeb.shortcuts.save': 'Guardar borrador ahora',
  'composerWeb.shortcuts.openSchedule': 'Abrir la hoja de programación',
  'composerWeb.shortcuts.open': 'Mostrar atajos',
  'composerWeb.review.heading': 'Revisión',
  'composerWeb.review.contentVersion': 'Versión del contenido {checksum}',
  'composerWeb.review.approvalPolicy': 'Política: {policy}',
  'composerWeb.review.approverPending': 'A la espera de una decisión de {approver}.',
  'composerWeb.review.approverNone': 'No se requiere aprobación para estos objetivos.',
  'composerWeb.review.perTargetHeading': 'Lo que recibe cada cuenta',
  'composerWeb.review.finalUrl': 'Enlace publicado',
  'composerWeb.review.privacyState': 'Audiencia: {value}',
  'composerWeb.review.disclosureState': 'Divulgación: {value}',
  'composerWeb.review.disclosureNone': 'Sin conjunto de divulgación',
  'composerWeb.review.mediaVersion': '{name}, versión {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {#El objetivo aún no se puede programar} other {#Los objetivos aún no se pueden programar.} many {#Los objetivos aún no se pueden programar.}}',
  'composerWeb.review.offlineBlocked':
    'La programación y la publicación necesitan una conexión. Su borrador está seguro en este dispositivo.',
  'composerWeb.review.publishConfirm':
    'Esto se publica en {count, plural, one {#cuenta} other {#cuentas} many {#cuentas}}de inmediato. No se puede deshacer desde aquí.',
  'composerWeb.page.newDraft': 'Nuevo borrador',
  'composerWeb.page.loading': 'Cargando el borrador, sus objetivos y sus límites.',
  'composerWeb.page.errorTitle': 'Este borrador no se pudo abrir.',
  'composerWeb.page.errorBody':
    'No se perdió nada. Inténtelo de nuevo y, si sigue fallando, la referencia siguiente le ayudará a encontrar la solicitud.',
  'composerWeb.page.noConnectionsTitle': 'Conecte una cuenta antes de componer',
  'composerWeb.page.noConnectionsBody':
    'Un borrador necesita al menos una cuenta conectada para que Post Array conozca los límites, la vista previa y la configuración que se mostrará.',
  'composerWeb.page.noConnectionsExample':
    'Ejemplo: con X y LinkedIn conectados, un borrador se convierte en dos versiones nativas con sus propios contadores.',
  'composerWeb.page.permissionTitle': 'No puedes crear publicaciones en este espacio de trabajo.',
  'composerWeb.page.permissionBody':
    'Para redactar se necesita el rol de editor o superior. Un propietario o administrador puede cambiar su función.',
  'composerWeb.page.rateLimitTitle': 'Demasiados borradores guardados en poco tiempo',
  'composerWeb.page.rateLimitCause':
    'Este espacio de trabajo alcanzó su límite de escritura para la ventana actual. Mientras tanto, su texto se conserva en este dispositivo.',
  'composerWeb.page.rateLimitAlternative':
    'Sigue escribiendo. El guardado se reanuda automáticamente cuando la ventana se restablece.',
  'mediaLib.view.grid': 'Cuadrícula',
  'mediaLib.view.list': 'Lista',
  'mediaLib.view.label': 'Diseño',
  'mediaLib.sort.label': 'ordenar',
  'mediaLib.sort.newest': 'Lo nuevo primero',
  'mediaLib.sort.name': 'Nombre',
  'mediaLib.sort.size': 'El más grande primero',
  'mediaLib.select': 'Seleccionar {name}',
  'mediaLib.column.file': 'Archivo',
  'mediaLib.column.type': 'Tipo',
  'mediaLib.column.size': 'Tamaño',
  'mediaLib.column.altText': 'Texto alternativo',
  'mediaLib.column.rights': 'Derechos',
  'mediaLib.column.added': 'Añadido',
  'mediaLib.openDetail': 'Abierto {name}',
  'mediaLib.empty.title': 'Aún no hay medios',
  'mediaLib.empty.body':
    'Sube las imágenes y videos que ya tienes, o importa un archivo desde una URL. Post Array verifica el tipo y el tamaño de cada cuenta en la que publica.',
  'mediaLib.empty.example':
    'Ejemplo: launch_hero.jpg, 1600 por 900, conjunto de texto alternativo, usado en 2 publicaciones.',
  'mediaLib.error.title': 'No se pudo cargar la biblioteca',
  'mediaLib.error.body': 'Tus archivos están seguros. Este fracaso no cambió nada.',
  'mediaLib.offline.title': 'La biblioteca no está disponible sin conexión',
  'mediaLib.offline.body':
    'No podemos actualizar la biblioteca sin conexión. Los archivos que ya están en esta pantalla no cambian. Vuelva a conectarse e intente de nuevo.',
  'mediaLib.rateLimited.title': 'La biblioteca necesita una pausa breve',
  'mediaLib.rateLimited.cause':
    'La API nos pidió reducir la velocidad mientras cargábamos sus archivos. Sus medios almacenados están seguros.',
  'mediaLib.rateLimited.resetLabel': 'Vuelva a intentarlo después de',
  'mediaLib.rateLimited.alternative':
    'Puede seguir redactando localmente, pero las subidas y los cambios en la biblioteca esperarán hasta que se restablezca el límite.',
  'mediaLib.loading': 'Cargando tu biblioteca multimedia',
  'mediaLib.permission.title': 'No puedes ver esta biblioteca de espacio de trabajo',
  'mediaLib.permission.body':
    'La visualización de medios necesita el rol de espectador o superior en este proyecto. Un propietario o administrador puede otorgarlo.',
  'mediaLib.upload.heading': 'Agregar medios',
  'mediaLib.upload.browse': 'Elige archivos',
  'mediaLib.upload.dropHint':
    'Arrastre los archivos aquí o selecciónelos. Las cargas se reanudan si se corta la conexión.',
  'mediaLib.upload.queueHeading': 'Subidas',
  'mediaLib.upload.progress': '{name}, {percent}de {size}enviado',
  'mediaLib.upload.paused': 'En pausa. {sent}de {size}ya está almacenado.',
  'mediaLib.upload.resume': 'Reanudar carga',
  'mediaLib.upload.pause': 'Pausar carga',
  'mediaLib.upload.cancel': 'Cancelar esta carga',
  'mediaLib.upload.retry': 'Intenta esta carga nuevamente',
  'mediaLib.upload.finalizing': 'Acabado {name}',
  'mediaLib.upload.done': '{name}está en tu biblioteca',
  'mediaLib.upload.failed': '{name}no terminó. {reason}',
  'mediaLib.upload.offline':
    'Sin conexión. Las cargas continúan desde donde se detuvieron cuando te vuelves a conectar.',
  'mediaLib.upload.rejectedType':
    '{name}es {mimeType}, que ninguna de sus cuentas seleccionadas acepta.',
  'mediaLib.upload.rejectedSize': '{name}es {size}. El límite más bajo en sus cuentas es {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Aceptado por #de tus cuentas} other {Aceptado por #de tus cuentas} many {Aceptado por #de tus cuentas}}',
  'mediaLib.upload.rejectedBy': 'No aceptado por {accounts}',
  'mediaLib.upload.checkedAgainst': 'Comparado con las cuentas seleccionadas en este borrador.',
  'mediaLib.upload.noTargets':
    'No se selecciona ninguna cuenta, por lo que el archivo se compara únicamente con los valores predeterminados del espacio de trabajo.',
  'mediaLib.import.urlLabel': 'URL pública del archivo',
  'mediaLib.import.urlPlaceholder': 'https://cdn.example.com/launch-video.mp4',
  'mediaLib.import.importing': 'Importando medio',
  'mediaLib.import.succeeded': 'El archivo está en tu biblioteca',
  'mediaLib.import.scanPending':
    'Post Array registró su origen. La publicación espera hasta que finalice la verificación de seguridad.',
  'mediaLib.import.failed': 'No se pudo importar el archivo',
  'mediaLib.import.failedHelp':
    'Verifique que el enlace sea público y apunte directamente a un archivo multimedia compatible, luego intente de nuevo.',
  'mediaLib.import.readOnly': 'Conecte la API para importar archivos en este entorno.',
  'mediaLib.import.offline': 'Vuelva a conectarse antes de importar un archivo.',
  'mediaLib.import.issue.invalid': 'Ingrese una URL completa.',
  'mediaLib.import.issue.scheme': 'Use un enlace HTTP o HTTPS.',
  'mediaLib.import.issue.credentials': 'Use un enlace sin nombre de usuario ni contraseña.',
  'mediaLib.retention.title':
    'Los archivos almacenados se conservan 30 días después de crear la publicación',
  'mediaLib.retention.body':
    'Una vez que un archivo se adjunta a una publicación, lo eliminamos de forma permanente del almacenamiento de Post Array 30 días después de crearse esa publicación. Los archivos que esperan ser adjuntados usan la fecha de subida como referencia de limpieza. El texto de la publicación, los recibos de publicación y el historial de auditoría siguen disponibles por más tiempo. Una publicación ya publicada en una plataforma social no se elimina cuando vence su archivo almacenado.',
  'mediaLib.retention.limits':
    'Las imágenes, el audio y los archivos PDF pueden pesar hasta {imageSize}. Los videos pueden pesar hasta {videoSize}.',
  'mediaLib.retention.expiresLabel': 'Fecha de eliminación del archivo',
  'mediaLib.retention.deleted': 'Eliminado de forma permanente',
  'mediaLib.retention.deletedTitle': 'Este archivo almacenado se ha eliminado',
  'mediaLib.retention.deletedBody':
    'El período de almacenamiento de 30 días terminó. El texto de la publicación, los recibos de publicación y el historial de auditoría se conservan.',
  'mediaLib.processing.unavailableTitle': 'Este archivo aún no está listo para publicarse',
  'mediaLib.processing.unavailableBody':
    'El procesamiento o la verificación de seguridad todavía están pendientes, o no se aprobaron. Vuelva a subir el archivo si este estado no se resuelve.',
  'mediaLib.processing.pendingTitle':
    'El escaneo de seguridad no está disponible antes del lanzamiento',
  'mediaLib.processing.pendingBody':
    'El archivo se almacena durante 30 días, pero no se puede adjuntar a una publicación publicada hasta que se habilite el escaneo de seguridad.',
  'mediaLib.processing.blockedTitle': 'Este archivo no se puede publicar',
  'mediaLib.processing.blockedBody':
    'El archivo no aprobó el procesamiento ni la verificación de seguridad. Suba un archivo diferente.',
  'mediaLib.alt.heading': 'Texto alternativo',
  'mediaLib.alt.help':
    'Describe lo que importa en la imagen para alguien que no puede verlo. Una o dos frases suelen ser suficientes.',
  'mediaLib.alt.count': '{used}de {limit}personajes',
  'mediaLib.alt.requiredBy': 'Requerido por {accounts}',
  'mediaLib.alt.waive': 'Esta imagen no contiene información.',
  'mediaLib.alt.waiveReason': 'Por qué no necesita descripción',
  'mediaLib.alt.waiveHelp':
    'Úselo sólo para decoración. Una imagen renunciada se publica con una descripción vacía cuando la plataforma lo permite.',
  'mediaLib.alt.waived': 'Renunciado por {name}en {date}. Razón: {reason}',
  'mediaLib.alt.unsupported':
    '{provider}no acepta texto alternativo a través de su API para esta cuenta.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {#el archivo no tiene texto alternativo} other {#los archivos no tienen texto alternativo} many {#los archivos no tienen texto alternativo}}',
  'mediaLib.rights.heading': 'Derechos y consentimiento',
  'mediaLib.rights.declared': 'Declarado por {name}en {date}',
  'mediaLib.rights.undeclared':
    'Aún no declarado. Declarelo antes de que se publique este archivo.',
  'mediaLib.rights.ownerLabel': '¿Quién es el propietario de este archivo?',
  'mediaLib.rights.ownerSelf': 'este espacio de trabajo',
  'mediaLib.rights.ownerLicensed': 'Con licencia de otra persona',
  'mediaLib.rights.ownerUgc': 'Un cliente o creador dio permiso',
  'mediaLib.rights.licenseLabel': 'Referencia de licencia o permiso',
  'mediaLib.rights.peopleLabel': 'Las personas aparecen en este archivo.',
  'mediaLib.rights.peopleConsent': 'Todos los mostrados han aceptado ser publicados.',
  'mediaLib.rights.musicLabel': 'Este archivo contiene música o una banda sonora.',
  'mediaLib.rights.confirm':
    'Tengo los derechos para publicar este archivo, incluidas las personas, la música, los logotipos y las marcas que contiene.',
  'mediaLib.rights.blocking':
    'Este archivo no se puede programar hasta que se declaren los derechos.',
  'mediaLib.editor.heading': 'Editar imagen',
  'mediaLib.editor.description':
    'Cada edición se guarda como una nueva versión. El archivo original se conserva y se puede restaurar.',
  'mediaLib.editor.tab.crop': 'Cultivo',
  'mediaLib.editor.tab.transform': 'Cambiar tamaño y rotar',
  'mediaLib.editor.tab.canvas': 'Lienzo',
  'mediaLib.editor.tab.output': 'Formato y tamaño',
  'mediaLib.editor.tab.thumbnail': 'Miniatura',
  'mediaLib.editor.presetLabel': 'Aspecto preestablecido',
  'mediaLib.editor.presetFree': 'Gratis',
  'mediaLib.editor.presetFor': '{ratio}, utilizado por {accounts}',
  'mediaLib.editor.cropX': 'Recortar desde el borde inicial',
  'mediaLib.editor.cropY': 'Recortar desde arriba',
  'mediaLib.editor.cropWidth': 'Ancho de cultivo',
  'mediaLib.editor.cropHeight': 'Altura del cultivo',
  'mediaLib.editor.cropKeyboardHint':
    'El cuadro de recorte está configurado con campos numéricos, por lo que funciona completamente desde el teclado.',
  'mediaLib.editor.widthLabel': 'Ancho en píxeles',
  'mediaLib.editor.heightLabel': 'Altura en píxeles',
  'mediaLib.editor.lockRatio': 'Mantener la relación actual',
  'mediaLib.editor.rotateLabel': 'Rotación',
  'mediaLib.editor.rotateDegrees': '{degrees}grados',
  'mediaLib.editor.flipHorizontal': 'Voltear a lo largo del eje vertical',
  'mediaLib.editor.flipVertical': 'Voltear sobre el eje horizontal',
  'mediaLib.editor.canvasColor': 'Color de fondo',
  'mediaLib.editor.canvasFit': 'Cómo se asienta la imagen en el lienzo',
  'mediaLib.editor.canvasFitCover': 'Llene el lienzo y recorte el desbordamiento.',
  'mediaLib.editor.canvasFitContain': 'Ajusta la imagen completa y rellena el resto.',
  'mediaLib.editor.formatLabel': 'Formato de salida',
  'mediaLib.editor.qualityLabel': 'Calidad de compresión',
  'mediaLib.editor.qualityValue': '{value}de 100',
  'mediaLib.editor.estimatedSize': 'Producción estimada {size}, de {original}',
  'mediaLib.editor.estimatedSizeUnknown':
    'El tamaño de salida solo se conoce una vez que se procesa el archivo.',
  'mediaLib.editor.thumbnailHelp':
    'Elija el fotograma o archivo utilizado como miniatura del vídeo cuando la plataforma lo acepte.',
  'mediaLib.editor.thumbnailFrame': 'Marco en {time}',
  'mediaLib.editor.save': 'Guardar como una nueva versión',
  'mediaLib.editor.saving': 'Versión guardada {version}',
  'mediaLib.editor.saved': 'Versión {version}salvado. El original todavía está aquí.',
  'mediaLib.editor.discard': 'Descartar estas ediciones',
  'mediaLib.editor.noChanges': 'Aún no hay cambios para guardar.',
  'mediaLib.editor.revalidate':
    'Al guardar se vuelve a comprobar este archivo con cada cuenta de los borradores que lo utilizan.',
  'mediaLib.editor.noGeneration':
    'Este editor cambia el archivo que subiste. No crea nuevas imágenes.',
  'mediaLib.versions.heading': 'Versiones',
  'mediaLib.versions.original': 'Carga original',
  'mediaLib.versions.current': 'Versión actual',
  'mediaLib.versions.restore': 'Restaurar versión {version}',
  'mediaLib.versions.item': 'Versión {version}, {dimensions}, {size}, {date}',
  'mediaLib.provenance.heading': 'De donde vino este archivo',
  'mediaLib.provenance.sourceUrl': 'URL de origen',
  'mediaLib.provenance.fetchedAt': 'Obtenido {date}',
  'mediaLib.provenance.declaredAuthor': 'Autor declarado',
  'mediaLib.provenance.declaredLicense': 'licencia indicada',
  'mediaLib.provenance.contentCredentials': 'Credenciales de contenido integrado',
  'mediaLib.provenance.contentCredentialsNone':
    'Este archivo no lleva credenciales de contenido incrustado. Esto es común y no significa que algo esté mal.',
  'mediaLib.provenance.unverified':
    'Estos detalles provienen de la fuente, no de Post Array. Compruébalos antes de confiar en ellos.',
  'mediaLib.picker.title': 'Elige medios',
  'mediaLib.picker.description':
    'Los archivos se comparan con las cuentas seleccionadas en este borrador.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Elige archivos} one {Añadir #archivo} other {Añadir #archivos} many {Añadir #archivos}}',
  'mediaLib.picker.forMaster': 'Agregar al borrador maestro',
  'mediaLib.picker.forVariant': 'Añadiendo a la versión para {account}solo',
} as const;
