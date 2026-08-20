/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
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
  'composerWeb.step.progress': 'Step {current} of {total}',
  'composerWeb.step.legend': 'Composer pasos',

  'composerWeb.summary.label': 'Borrador de resumen',
  'composerWeb.summary.targets':
    '{count, plural, =0 {Sin objetivos} one {# objetivo} many {# objetivos} other {# objetivos}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {Sin problemas} one {# problema} many {# problemas} other {# problemas}}',
  'composerWeb.summary.notScheduled': 'No hay tiempo elegido',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Costo aún sin precio',
  'composerWeb.summary.openReview': 'Abrir revisión',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'borrador maestro',
  'composerWeb.rail.masterHint': 'Edite aquí para llegar a todos los objetivos que aún heredan.',
  'composerWeb.rail.accountsHeading': 'Cuentas objetivo',
  'composerWeb.rail.setsHeading': 'Conjuntos y grupos',
  'composerWeb.rail.setsHelp':
    'Un Conjunto es un grupo guardado de cuentas y valores predeterminados. La aplicación de uno copia sus valores en este borrador. Las ediciones posteriores del Conjunto no cambian este borrador.',
  'composerWeb.rail.openTarget': 'Abra la versión for {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Límite desconocido',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {sin medios} one {# archivo multimedia} many {# archivos multimedia} other {# archivos multimedia}}',
  'composerWeb.rail.paused': 'En pausa. No se publicará hasta que lo reanudes.',
  'composerWeb.rail.state.notBuilt': 'Aún no construido',
  'composerWeb.rail.state.unsupported': 'El proveedor no admite',
  'composerWeb.rail.empty': 'Aún no hay cuentas seleccionadas.',
  'composerWeb.rail.emptyHelp':
    'Elija las cuentas a las que debería llegar esta publicación. Puedes agregar más más tarde.',
  'composerWeb.rail.divergenceHint':
    'Abra un objetivo para ver su propia versión. El borrador maestro no ha cambiado.',
  'composerWeb.rail.searchLabel': 'Filtrar cuentas',
  'composerWeb.rail.removeTarget': 'Remove {account}',

  // ---------------------------------------------------------- global edit
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
    '{account} allows {limit} caracteres. Este texto is {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} no acepta un enlace en este campo. El vínculo permanece en el borrador maestro y en los objetivos que lo permiten.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} accepts {limit, plural, one {# archivo} many {# archivos} other {# archivos}}. Este borrador has {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported': '{account} no accept {mimeType} archivos.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} no admite elementos de seguimiento, por lo que la secuencia permanece en el borrador maestro.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} publica texto sin formato. Las marcas de formato aparecerían como caracteres.',
  'composerWeb.globalEdit.adaptedPreview': 'What {account} obtiene en su lugar',
  'composerWeb.globalEdit.confirm': 'Aplicar y crear las versiones.',
  'composerWeb.globalEdit.nothingToApply': 'Nada cambia. El borrador maestro ya tiene este valor.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Cambio aplicado a # objetivo} many {Cambio aplicado a # objetivos} other {Cambio aplicado a # objetivos}}. {adapted, plural, =0 {Ningún objetivo necesitaba una versión adaptada} one {# objetivo obtuvo una versión adaptada} many {# objetivos obtuvieron versiones adaptadas} other {# objetivos obtuvieron versiones adaptadas}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'Este objetivo tiene su propia versión.',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# campo difiere del borrador maestro} many {# campos difieren del borrador maestro} other {# campos difieren del borrador maestro}}',
  'composerWeb.override.field.body': 'Publicar texto',
  'composerWeb.override.field.contentKind': 'Tipo de publicación',
  'composerWeb.override.field.locale': 'Idioma del contenido',
  'composerWeb.override.field.mediaIds': 'Medios',
  'composerWeb.override.field.links': 'Enlaces',
  'composerWeb.override.field.signature': 'Firma',
  'composerWeb.override.field.threadItems': 'Comentarios e hilo',
  'composerWeb.override.field.schedule': 'Horario',
  'composerWeb.override.resetField': 'Reset {field} para dominar',
  'composerWeb.override.resetFieldTitle': 'Reset {field} for {account}?',
  'composerWeb.override.resetFieldBody':
    'La versión of {field} escrita for {account} se descarta y se vuelve a utilizar el borrador maestro. Ningún otro objetivo cambia.',
  'composerWeb.override.resetAll': 'Restablecer todos los campos para dominar',
  'composerWeb.override.inheritNotice':
    'Este objetivo sigue el borrador maestro. Editar cualquier cosa aquí crea una versión que recibe only {account}.',
  'composerWeb.override.created': '{account} ahora tiene su own {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Límites for {account}',
  'composerWeb.limits.text': 'Envía mensajes de hasta to {limit} caracteres',
  'composerWeb.limits.linkCost':
    'Un enlace cuenta as {count, plural, one {# carácter} many {# caracteres} other {# caracteres}} cualquiera que sea su longitud.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Sin imágenes} one {# imagen} many {hasta # imágenes} other {hasta # imágenes}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {Sin vídeo} one {# vídeo} many {hasta # vídeos} other {hasta # vídeos}}',
  'composerWeb.limits.duration': 'Subir vídeo to {duration}',
  'composerWeb.limits.aspect': 'Relación de aspecto between {min} and {max}',
  'composerWeb.limits.fileSize': 'Archivos hasta to {size}',
  'composerWeb.limits.mimeTypes': 'Tipos de archivos aceptados: {types}',
  'composerWeb.limits.source': 'De capacidad snapshot {version}, read {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'Se requiere una miniatura.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider} configuración',
  'composerWeb.native.privacy': '¿Quién puede ver esto?',
  'composerWeb.native.privacyChoose': 'Elige una audiencia',
  'composerWeb.native.privacyExplicit':
    '{provider} no permite una audiencia preseleccionada. Elija uno antes de que se pueda programar esto.',
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
    '{provider} no ofrece esta divulgación a través de su API. Agréguelo en el texto en su lugar.',
  'composerWeb.native.none': 'La configuración No {provider} se aplica a este tipo de publicación.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Resuelto on {provider}',
  'composerWeb.entity.resolvedId': 'Cuenta ID {externalId}',
  'composerWeb.entity.plainTextWarning':
    'No coincidente. Se publicará como texto sin formato, que no es una etiqueta nativa on {provider}.',
  'composerWeb.entity.removeMention': 'Eliminar la mención of {label}',
  'composerWeb.entity.addMention': 'Añadir una mención',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Sin menciones} one {# mención} many {# menciones} other {# menciones}}, {resolved} coincidente con una cuenta real',
  'composerWeb.entity.lookupUnsupported':
    '{provider} no ofrece búsqueda de entidades para este tipo de cuenta.',
  'composerWeb.entity.lookupNotBuilt':
    'Relay aún no ha creado la búsqueda de entidades for {provider}. Mientras tanto no se adivina nada.',
  'composerWeb.entity.searchHint': 'Escriba al menos dos caracteres y luego elija un resultado.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {No hay coincidencias} one {# coincidencia} many {# coincidencias} other {# coincidencias}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Enlaces',
  'composerWeb.links.detected':
    '{count, plural, one {# enlace encontrado en este borrador} many {# enlaces encontrados en este borrador} other {# enlaces encontrados en este borrador}}',
  'composerWeb.links.noneDetected': 'Aún no hay enlaces en este borrador.',
  'composerWeb.links.modeLabel': 'Cómo se publica este enlace',
  'composerWeb.links.original': 'URL original',
  'composerWeb.links.utmSource': 'Fuente',
  'composerWeb.links.utmMedium': 'Medio',
  'composerWeb.links.utmCampaign': 'Campaña',
  'composerWeb.links.utmTerm': 'Término',
  'composerWeb.links.utmContent': 'Contenido',
  'composerWeb.links.domainVerified': '{domain}, verificado para este espacio de trabajo',
  'composerWeb.links.domainDefault': 'Relay dominio predeterminado',
  'composerWeb.links.domainNone': 'Aún no se ha verificado ningún dominio de marca.',
  'composerWeb.links.notAllowedHere': '{account} no permite un enlace aquí.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Comentario',
  'composerWeb.sequence.kindThread': 'Parte del hilo',
  'composerWeb.sequence.kindLabel': 'tipo de artículo',
  'composerWeb.sequence.moveUp': 'Mover este elemento antes',
  'composerWeb.sequence.moveDown': 'Mover este elemento más tarde',
  'composerWeb.sequence.remove': 'Eliminar este elemento',
  'composerWeb.sequence.absoluteTime': 'Ejecuta at {time}, que is {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'Si un elemento falla, la publicación ya publicada permanece publicada y los elementos posteriores no se publican. Obtienes un elemento de acción.',
  'composerWeb.sequence.maxReached':
    '{account} accepts {limit, plural, one {# elemento de seguimiento} many {# elementos de seguimiento} other {# elementos de seguimiento}}.',
  'composerWeb.sequence.minDelay': 'El delay {provider} más corto permite aquí is {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Misma cuenta que la publicación.',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Sin problemas} one {# problema} many {# problemas} other {# problemas}} en este elemento',
  'composerWeb.sequence.customMinutes': 'Minutos después del elemento anterior',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Repite esta publicación',
  'composerWeb.repeat.cadenceLabel': '¿Con qué frecuencia?',
  'composerWeb.repeat.maximum': 'Una publicación repetida puede ejecutarse most {limit} veces.',
  'composerWeb.repeat.occurrenceLabel': 'Número de publicaciones',
  'composerWeb.repeat.duplicateCheck':
    'Cada aparición se verifica en busca de contenido duplicado antes de su publicación. Una ocurrencia que no pasa la verificación se convierte en un elemento de acción en lugar de publicarse.',
  'composerWeb.repeat.occurrenceList': 'Primeras apariciones',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {y # ocurrencias más} many {y # ocurrencias más} other {y # ocurrencias más}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Conjuntos y firma',
  'composerWeb.set.pickerTitle': 'Empezar desde un conjunto',
  'composerWeb.set.pickerDescription':
    'Un conjunto completa objetivos, texto y configuraciones. El borrador que crea es independiente, por lo que editar el conjunto más tarde nunca cambia una publicación aprobada o programada.',
  'composerWeb.set.accountCount':
    '{count, plural, one {# cuenta} many {# cuentas} other {# cuentas}}',
  'composerWeb.set.apply': 'Utilice este conjunto',
  'composerWeb.set.none': 'Aún no hay conjuntos guardados.',
  'composerWeb.signature.pickerLabel': 'Firma',
  'composerWeb.signature.scope': 'For {project} on {provider} in {language}',
  'composerWeb.signature.previewHeading': 'Como termina el post',
  'composerWeb.signature.notMatching':
    'Esta firma está dirigida a una marca, plataforma o idioma diferente, por lo que no se ofrece aquí.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Ayuda con este texto',
  'composerWeb.assist.unavailableTitle': 'La asistencia de texto no está configurada',
  'composerWeb.assist.unavailableBody':
    'No hay ninguna puerta de enlace de IA configurada para este espacio de trabajo, por lo que las acciones de asistencia están desactivadas. Todo lo demás en el compositor funciona con normalidad.',
  'composerWeb.assist.targetLabel': 'Se aplica a',
  'composerWeb.assist.targetMaster': 'El borrador maestro',
  'composerWeb.assist.targetVariant': 'La versión for {account}',
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
    'Relay no crea imágenes ni vídeos. Traiga los archivos terminados a la biblioteca y publíquelos aquí.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'Esta es la versión aprobada. Editarlo crea una nueva versión y borra la aprobación.',
  'composerWeb.autosave.pinnedAcknowledge': 'Editar y borrar la aprobación',
  'composerWeb.autosave.conflictTitle': 'Dos versiones de este borrador.',
  'composerWeb.autosave.conflictKeepMine': 'guarda lo que escribi',
  'composerWeb.autosave.conflictKeepTheirs': 'Utilice la versión from {name}',
  'composerWeb.autosave.conflictHelp':
    'Nada se fusiona automáticamente. Elija por campo y luego guarde.',
  'composerWeb.autosave.retry': 'Intenta guardar de nuevo',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Composer atajos',
  'composerWeb.shortcuts.nextTarget': 'próximo objetivo',
  'composerWeb.shortcuts.previousTarget': 'Objetivo anterior',
  'composerWeb.shortcuts.nextIssue': 'Próximo número',
  'composerWeb.shortcuts.previousIssue': 'Número anterior',
  'composerWeb.shortcuts.save': 'Guardar borrador ahora',
  'composerWeb.shortcuts.openSchedule': 'Abrir la hoja de programación',
  'composerWeb.shortcuts.open': 'Mostrar atajos',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'Revisión',
  'composerWeb.review.contentVersion': 'Contenido version {checksum}',
  'composerWeb.review.approvalPolicy': 'Política: {policy}',
  'composerWeb.review.approverPending': 'Esperando decisión from {approver}.',
  'composerWeb.review.approverNone': 'No se requiere aprobación para estos objetivos.',
  'composerWeb.review.perTargetHeading': 'Lo que recibe cada cuenta',
  'composerWeb.review.finalUrl': 'Enlace publicado',
  'composerWeb.review.privacyState': 'Audiencia: {value}',
  'composerWeb.review.disclosureState': 'Divulgación: {value}',
  'composerWeb.review.disclosureNone': 'Sin conjunto de divulgación',
  'composerWeb.review.mediaVersion': '{name}, version {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# objetivo no se puede programar todavía} many {# objetivos no se puede programar todavía} other {# objetivos no se puede programar todavía}}',
  'composerWeb.review.offlineBlocked':
    'La programación y la publicación necesitan una conexión. Su borrador está seguro en este dispositivo.',
  'composerWeb.review.publishConfirm':
    'Esto publica to {count, plural, one {# cuenta} many {# cuentas} other {# cuentas}} de inmediato. No se puede deshacer desde aquí.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Nuevo borrador',
  'composerWeb.page.loading': 'Cargando el borrador, sus objetivos y sus límites.',
  'composerWeb.page.errorTitle': 'Este borrador no se pudo abrir.',
  'composerWeb.page.errorBody':
    'No se perdió nada. Inténtelo de nuevo y, si sigue fallando, la referencia siguiente le ayudará a encontrar la solicitud.',
  'composerWeb.page.noConnectionsTitle': 'Conecte una cuenta antes de componer',
  'composerWeb.page.noConnectionsBody':
    'Un borrador necesita al menos una cuenta conectada para que Relay conozca los límites, la vista previa y la configuración a mostrar.',
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

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Cuadrícula',
  'mediaLib.view.list': 'Lista',
  'mediaLib.view.label': 'Diseño',
  'mediaLib.sort.label': 'ordenar',
  'mediaLib.sort.newest': 'Lo nuevo primero',
  'mediaLib.sort.name': 'Nombre',
  'mediaLib.sort.size': 'El más grande primero',
  'mediaLib.select': 'Select {name}',
  'mediaLib.column.file': 'Archivo',
  'mediaLib.column.type': 'Tipo',
  'mediaLib.column.size': 'Tamaño',
  'mediaLib.column.altText': 'Texto alternativo',
  'mediaLib.column.rights': 'Derechos',
  'mediaLib.column.added': 'Añadido',
  'mediaLib.openDetail': 'Open {name}',

  'mediaLib.empty.title': 'Aún no hay medios',
  'mediaLib.empty.body':
    'Sube las imágenes y videos que ya tienes, o importa un archivo desde una URL. Relay verifica el tipo y el tamaño de cada cuenta en la que publica.',
  'mediaLib.empty.example':
    'Ejemplo: launch_hero.jpg, 1600 por 900, conjunto de texto alternativo, usado en 2 publicaciones.',
  'mediaLib.error.title': 'No se pudo cargar la biblioteca',
  'mediaLib.error.body': 'Tus archivos están seguros. Este fracaso no cambió nada.',
  'mediaLib.loading': 'Cargando tu biblioteca multimedia',
  'mediaLib.permission.title': 'No puedes ver esta biblioteca de espacio de trabajo',
  'mediaLib.permission.body':
    'La visualización de medios necesita el rol de espectador o superior en esta marca. Un propietario o administrador puede otorgarlo.',

  'mediaLib.upload.heading': 'Agregar medios',
  'mediaLib.upload.browse': 'Elige archivos',
  'mediaLib.upload.dropHint':
    'Arrastre los archivos aquí o selecciónelos. Las cargas se reanudan si se corta la conexión.',
  'mediaLib.upload.queueHeading': 'Subidas',
  'mediaLib.upload.progress': '{name}, {percent} of {size} enviado',
  'mediaLib.upload.paused': 'En pausa. {sent} of {size} ya está almacenado.',
  'mediaLib.upload.resume': 'Reanudar carga',
  'mediaLib.upload.pause': 'Pausar carga',
  'mediaLib.upload.cancel': 'Cancelar esta carga',
  'mediaLib.upload.retry': 'Intenta esta carga nuevamente',
  'mediaLib.upload.finalizing': 'Finishing {name}',
  'mediaLib.upload.done': '{name} está en tu biblioteca',
  'mediaLib.upload.failed': '{name} no terminó. {reason}',
  'mediaLib.upload.offline':
    'Sin conexión. Las cargas continúan desde donde se detuvieron cuando te vuelves a conectar.',
  'mediaLib.upload.rejectedType':
    '{name} is {mimeType}, que ninguna de tus cuentas seleccionadas acepta.',
  'mediaLib.upload.rejectedSize':
    '{name} is {size}. El límite más bajo en todas sus cuentas is {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Aceptado por # de tus cuentas} many {Aceptado por # de tus cuentas} other {Aceptado por # de tus cuentas}}',
  'mediaLib.upload.rejectedBy': 'No aceptado by {accounts}',
  'mediaLib.upload.checkedAgainst': 'Comparado con las cuentas seleccionadas en este borrador.',
  'mediaLib.upload.noTargets':
    'No se selecciona ninguna cuenta, por lo que el archivo se compara únicamente con los valores predeterminados del espacio de trabajo.',

  'mediaLib.alt.heading': 'Texto alternativo',
  'mediaLib.alt.help':
    'Describe lo que importa en la imagen para alguien que no puede verlo. Una o dos frases suelen ser suficientes.',
  'mediaLib.alt.count': '{used} of {limit} caracteres',
  'mediaLib.alt.requiredBy': 'Requerido by {accounts}',
  'mediaLib.alt.waive': 'Esta imagen no contiene información.',
  'mediaLib.alt.waiveReason': 'Por qué no necesita descripción',
  'mediaLib.alt.waiveHelp':
    'Úselo sólo para decoración. Una imagen renunciada se publica con una descripción vacía cuando la plataforma lo permite.',
  'mediaLib.alt.waived': 'Renuncia by {name} on {date}. Razón: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} no acepta texto alternativo a través de su API para esta cuenta.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# archivo no tiene texto alternativo} many {# archivos no tiene texto alternativo} other {# archivos no tiene texto alternativo}}',

  'mediaLib.rights.heading': 'Derechos y consentimiento',
  'mediaLib.rights.declared': 'Declarado by {name} on {date}',
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
  'mediaLib.editor.presetFor': '{ratio}, usado by {accounts}',
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
  'mediaLib.editor.rotateDegrees': '{degrees} grados',
  'mediaLib.editor.flipHorizontal': 'Voltear a lo largo del eje vertical',
  'mediaLib.editor.flipVertical': 'Voltear sobre el eje horizontal',
  'mediaLib.editor.canvasColor': 'Color de fondo',
  'mediaLib.editor.canvasFit': 'Cómo se asienta la imagen en el lienzo',
  'mediaLib.editor.canvasFitCover': 'Llene el lienzo y recorte el desbordamiento.',
  'mediaLib.editor.canvasFitContain': 'Ajusta la imagen completa y rellena el resto.',
  'mediaLib.editor.formatLabel': 'Formato de salida',
  'mediaLib.editor.qualityLabel': 'Calidad de compresión',
  'mediaLib.editor.qualityValue': '{value} de 100',
  'mediaLib.editor.estimatedSize': 'Estimado output {size}, from {original}',
  'mediaLib.editor.estimatedSizeUnknown':
    'El tamaño de salida solo se conoce una vez que se procesa el archivo.',
  'mediaLib.editor.thumbnailHelp':
    'Elija el fotograma o archivo utilizado como miniatura del vídeo cuando la plataforma lo acepte.',
  'mediaLib.editor.thumbnailFrame': 'Cuadro at {time}',
  'mediaLib.editor.save': 'Guardar como una nueva versión',
  'mediaLib.editor.saving': 'Guardando version {version}',
  'mediaLib.editor.saved': 'Version {version} guardado. El original todavía está aquí.',
  'mediaLib.editor.discard': 'Descartar estas ediciones',
  'mediaLib.editor.noChanges': 'Aún no hay cambios para guardar.',
  'mediaLib.editor.revalidate':
    'Al guardar se vuelve a comprobar este archivo con cada cuenta de los borradores que lo utilizan.',
  'mediaLib.editor.noGeneration':
    'Este editor cambia el archivo que subiste. No crea nuevas imágenes.',

  'mediaLib.versions.heading': 'Versiones',
  'mediaLib.versions.original': 'Carga original',
  'mediaLib.versions.current': 'Versión actual',
  'mediaLib.versions.restore': 'Restaurar version {version}',
  'mediaLib.versions.item': 'Version {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'De donde vino este archivo',
  'mediaLib.provenance.sourceUrl': 'URL de origen',
  'mediaLib.provenance.fetchedAt': 'Fetched {date}',
  'mediaLib.provenance.declaredAuthor': 'Autor declarado',
  'mediaLib.provenance.declaredLicense': 'licencia indicada',
  'mediaLib.provenance.contentCredentials': 'Credenciales de contenido integrado',
  'mediaLib.provenance.contentCredentialsNone':
    'Este archivo no lleva credenciales de contenido incrustado. Esto es común y no significa que algo esté mal.',
  'mediaLib.provenance.unverified':
    'Estos detalles provienen de la fuente, no de Relay. Compruébalos antes de confiar en ellos.',

  'mediaLib.picker.title': 'Elige medios',
  'mediaLib.picker.description':
    'Los archivos se comparan con las cuentas seleccionadas en este borrador.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Elegir archivos} one {Agregar # archivo} many {Agregar # archivos} other {Agregar # archivos}}',
  'mediaLib.picker.forMaster': 'Agregar al borrador maestro',
  'mediaLib.picker.forVariant': 'Agregando a la versión for {account} solamente',
} as const;
