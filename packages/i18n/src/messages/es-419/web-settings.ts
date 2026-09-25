/** Spanish (Latin America) beta catalog. B5 legal, billing and consent messages deliberately use English fallback. */
export const webSettingsMessages = {
  'settings.ui.subtitle': 'Todo lo que configura este espacio de trabajo. Aquí no se publica nada.',
  'settings.ui.nav.label': 'Secciones de configuración',
  'settings.ui.index.help':
    'Elige una sección. Cada cambio se le atribuye a usted y aparece en el registro de auditoría.',
  'settings.ui.section.members': 'Miembros y roles',
  'settings.ui.section.membersSummary':
    'Quién está en este espacio de trabajo y qué puede hacer cada persona.',
  'settings.ui.section.projects': 'Proyectos',
  'settings.ui.section.projectsSummary':
    'Voz, audiencia, reclamos aprobados, términos bloqueados, reglas locales, dominios y glosario.',
  'settings.ui.section.agents': 'Agentes y API',
  'settings.ui.section.agentsSummary':
    'Cuentas de servicio, alcances, límites, credenciales, actividad y campo de pruebas.',
  'settings.ui.section.apps': 'Aplicaciones para desarrolladores',
  'settings.ui.section.appsSummary':
    'Aplicaciones OAuth de terceros, listas de permitidos de redireccionamiento, consentimientos y concesiones.',
  'settings.ui.section.webhooks': 'Ganchos web',
  'settings.ui.section.webhooksSummary':
    'Eventos salientes firmados, registros de entrega, reenvío y rotación secreta.',
  'settings.ui.section.billingSummary':
    'Plan, prueba, intervalo, uso de proveedor medido, facturas y cancelación.',
  'settings.ui.section.referrals': 'Referencia y afiliado',
  'settings.ui.section.referralsSummary':
    'Su enlace de referencia divulgado, registros atribuidos y estado de la comisión.',
  'settings.ui.section.localization': 'Localización',
  'settings.ui.section.localizationSummary':
    'Idioma de la interfaz, idiomas del contenido, mercados, zona horaria y formato de hora.',
  'settings.ui.section.security': 'Seguridad',
  'settings.ui.section.securitySummary':
    'Sesiones, autenticación de dos factores, credenciales, agentes, webhooks y subvenciones de aplicaciones.',
  'settings.ui.section.data': 'Controles de datos',
  'settings.ui.section.dataSummary':
    'Exportar, revocar una conexión, eliminar un proyecto, eliminar contenido o cerrar la cuenta.',
  'settings.ui.state.loading': 'Cargando {section}',
  'settings.ui.state.errorTitle': 'no pudimos cargar{section}',
  'settings.ui.state.errorRetry': 'Inténtalo de nuevo',
  'settings.ui.state.savingAnnouncement': 'Ahorro {section}',
  'settings.ui.state.savedAnnouncement': '{section}salvado',
  'settings.ui.state.saveFailedAnnouncement':
    '{section}no fue salvo. Tu entrada todavía está aquí.',
  'settings.ui.state.offlineTitle': 'Estás desconectado',
  'settings.ui.state.offlineBody':
    'Puedes leer esta página. Los cambios no se pueden guardar hasta que se restablezca la conexión.',
  'settings.ui.state.permissionTitle': 'No tienes acceso a {section}',
  'settings.ui.state.permissionBody':
    'Esta sección cambia el comportamiento del espacio de trabajo, por lo que está limitado por función.',
  'settings.ui.state.permissionRequirements': 'lo que necesitas',
  'settings.ui.state.permissionContact':
    'Un propietario o administrador de este espacio de trabajo puede otorgarlo. Se enumeran en Miembros y funciones.',
  'settings.ui.state.rateLimitTitle': 'Demasiados cambios en poco tiempo',
  'settings.ui.state.rateLimitCause':
    'Este espacio de trabajo alcanzó el límite de escritura para cambios de configuración.',
  'settings.ui.state.rateLimitReset': 'Restablecimientos de límites',
  'settings.ui.state.rateLimitAlternative':
    'Nada de lo que guardaste se perdió. Las acciones de solo lectura siguen funcionando mientras esperas.',
  'settings.ui.state.rateLimitUsage': 'La configuración escribe esta hora.',
  'settings.ui.state.rateLimitUsageText': '{used}de {limit}usado',
  'settings.ui.state.unsavedTitle': 'Tienes cambios sin guardar',
  'settings.ui.state.unsavedBody': 'Guárdalos antes de salir de esta sección.',
  'settings.ui.state.readOnlyTitle': 'Este espacio de trabajo es de solo lectura',
  'settings.ui.state.readOnlyBody':
    'La facturación está vencida. Su contenido, recibos y conexiones están intactos. La configuración se puede leer pero no cambiar.',
  'settings.ui.state.referenceLabel': 'Referencia de soporte',
  'settings.ui.attribution': 'Cambiado por {name} {relativeTime}',
  'settings.ui.attributionNever': 'No ha cambiado desde que fue creado.',
  'settings.ui.copyFailed':
    'Su navegador bloqueó la copia. Seleccione el texto y cópielo manualmente.',
  'settings.ui.members.description':
    'Cada invitación, cambio de rol y eliminación se registra con su nombre y la hora.',
  'settings.ui.members.tableCaption': 'Personas en este espacio de trabajo, con rol y alcance.',
  'settings.ui.members.column.person': 'persona',
  'settings.ui.members.column.role': 'Rol',
  'settings.ui.members.column.scope': 'Alcance',
  'settings.ui.members.column.approvals': 'Aprobaciones',
  'settings.ui.members.column.lastActive': 'Último activo',
  'settings.ui.members.column.actions': 'Acciones',
  'settings.ui.members.scopeAll': 'Todos los proyectos y cuentas.',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {#proyecto} other {#proyectos} many {#proyectos}}: {names}',
  'settings.ui.members.approvals.canApprove': 'puede aprobar',
  'settings.ui.members.approvals.cannotApprove': 'No se puede aprobar',
  'settings.ui.members.approvals.canApproveOwnProjects': 'Puede aprobar los proyectos enumerados',
  'settings.ui.members.lastActiveNever': 'Aún no ha iniciado sesión',
  'settings.ui.members.changeRole': 'Cambiar rol para {name}',
  'settings.ui.members.remove': 'Quitar {name}',
  'settings.ui.members.lastOwnerTitle': 'Un espacio de trabajo mantiene al menos un propietario',
  'settings.ui.members.lastOwnerBody':
    'Primero, convierta a otra persona en propietario y luego este cambio estará disponible.',
  'settings.ui.members.inviteTitle': 'Invitar a alguien a este espacio de trabajo',
  'settings.ui.members.inviteBody':
    'Reciben un correo electrónico con un enlace. La invitación caduca después de siete días y puedes revocarla antes de esa fecha.',
  'settings.ui.members.inviteRole': 'Rol',
  'settings.ui.members.inviteScope': 'Proyectos en los que pueden trabajar.',
  'settings.ui.members.inviteScopeAll': 'Todos los proyectos en este espacio de trabajo',
  'settings.ui.members.inviteScopeSelected': 'Sólo los proyectos que selecciono',
  'settings.ui.members.inviteApprovals': 'Puede decidir solicitudes de aprobación',
  'settings.ui.members.inviteApprovalsHelp':
    'Solo se les puede otorgar esto a los roles que ya incluyen revisión. Es independiente de la edición.',
  'settings.ui.members.inviteSubmit': 'enviar invitación',
  'settings.ui.members.invitePending': 'Invitado {relativeTime}por {name}',
  'settings.ui.members.inviteRevoke': 'Revocar invitación',
  'settings.ui.members.inviteResend': 'Enviar la invitación nuevamente',
  'settings.ui.members.emptyTitle': 'Eres la única persona aquí',
  'settings.ui.members.emptyBody':
    'Invita a las personas que escriben, aprueban o leen los resultados. Cada uno obtiene un rol y un alcance de proyecto.',
  'settings.ui.members.emptyExample':
    'Una forma común: un propietario para la facturación, un aprobador por proyecto y editores que redactan pero nunca publican.',
  'settings.ui.members.roleReferenceTitle': 'Qué puede hacer cada rol',
  'settings.ui.members.roleReferenceCaption': 'Roles y las acciones que cada uno permite',
  'settings.ui.members.roleColumn.role': 'Rol',
  'settings.ui.members.roleColumn.can': 'puedo hacer',
  'settings.ui.members.roleColumn.cannot': 'no puedo hacer',
  'settings.ui.members.roleCannot.owner': 'No se retiene nada al propietario.',
  'settings.ui.members.roleCannot.admin':
    'Cambiar la facturación o eliminar el espacio de trabajo.',
  'settings.ui.members.roleCannot.manager':
    'Cambiar facturación, roles o eliminación del espacio de trabajo.',
  'settings.ui.members.roleCannot.editor': 'Aprobar, programar, publicar o cambiar conexiones.',
  'settings.ui.members.roleCannot.approver': 'Cambiar conexiones, reglas o facturación.',
  'settings.ui.members.roleCannot.analyst': 'Crea, edita, aprueba o publica cualquier cosa.',
  'settings.ui.members.roleCannot.viewer': 'Cambia cualquier cosa.',
  'settings.ui.members.removeTitle': 'Quitar {name}desde este espacio de trabajo',
  'settings.ui.members.removeConsequence.access':
    'Pierden el acceso inmediatamente, en todas las superficies.',
  'settings.ui.members.removeConsequence.drafts':
    'Los borradores que escribieron permanecen en el espacio de trabajo y son editables.',
  'settings.ui.members.removeConsequence.audit':
    'Sus acciones pasadas permanecen en el registro de auditoría y en los recibos.',
  'settings.ui.members.removeConsequence.approvals':
    'Las solicitudes de aprobación que las esperan regresan a la cola para otro aprobador.',
  'settings.ui.projects.description':
    'Mantenga separado cada producto, cliente, publicación o iniciativa. Cada proyecto tiene sus propios canales, medios, borradores, calendario y reglas de publicación.',
  'settings.ui.projects.listCaption': 'Proyectos en este Workspace',
  'settings.ui.projects.column.project': 'Proyecto',
  'settings.ui.projects.column.locales': 'Idiomas del contenido',
  'settings.ui.projects.column.accounts': 'Cuentas',
  'settings.ui.projects.column.updated': 'Actualizado',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Sin cuentas} one {#cuenta} other {#cuentas} many {#cuentas}}',
  'settings.ui.projects.emptyTitle': 'Cree su primer proyecto',
  'settings.ui.projects.emptyBody':
    'Un proyecto mantiene sincronizado a un producto o cliente en sus canales sociales, sin mezclar medios, borradores ni calendarios con otro proyecto.',
  'settings.ui.projects.emptyExample':
    'Ejemplo: Acme App, Acme Podcast y el cliente Northwind pueden ser tres proyectos separados en un mismo Workspace.',
  'settings.ui.projects.voiceHelp':
    'Cómo debería sonar este proyecto. Se usa para las pautas de revisión y la verificación de afirmaciones.',
  'settings.ui.projects.audienceHelp': 'Para quién es el contenido, por mercado.',
  'settings.ui.projects.approvedClaimsHelp':
    'Declaraciones que un revisor ha aprobado. Todo lo que esté fuera de esta lista se marca antes de la aprobación, no después de la publicación.',
  'settings.ui.projects.blockedTermsHelp':
    'Palabras que bloquean la programación de este proyecto. Una por línea.',
  'settings.ui.projects.domainsHelp':
    'Dominios a los que este proyecto puede vincular y acortar. Solo se pueden seleccionar dominios verificados en el compositor.',
  'settings.ui.projects.domainVerified': 'Verificado {date}',
  'settings.ui.projects.domainPending': 'Registro DNS aún no visto',
  'settings.ui.projects.domainVerificationUnavailable': 'La verificación aún no está disponible',
  'settings.ui.projects.disclosureUnavailable':
    'Los valores predeterminados de divulgación por canal aún no están disponibles. Agregue la divulgación requerida directamente en la publicación hasta que se lance esta función.',
  'settings.ui.projects.glossaryUnavailable':
    'El glosario del espacio de trabajo aún no está disponible. El tono, la audiencia, las afirmaciones aprobadas y los términos bloqueados anteriores se siguen guardando y aplicando.',
  'settings.ui.projects.localeRulesUnavailable':
    'Las reglas de redacción por idioma aún no están disponibles. Los idiomas y mercados del espacio de trabajo siguen disponibles en Localización.',
  'settings.ui.projects.disclosureHelp':
    'Aplicado por defecto en el compositor para las plataformas que elijas aquí. Se puede cambiar por publicación antes de la aprobación.',
  'settings.ui.projects.glossaryHelp':
    'Nombres de productos, términos legales y cualquier cosa que deba sobrevivir a una traducción sin cambios.',
  'settings.ui.projects.glossaryCaption':
    'Términos protegidos y cómo se maneja cada uno por idioma',
  'settings.ui.projects.glossaryEmpty':
    'Aún no hay términos protegidos. Agregue nombres de productos y términos legales que no se deben traducir ni reformular.',
  'settings.ui.projects.localeRulesHelp':
    'Reglas por idioma de contenido. Se aplican cuando adapta o transcrea y se muestran al revisor.',
  'settings.ui.projects.saveProject': 'Guardar proyecto',
  'settings.ui.projects.capacityTitle': 'Capacidad de proyectos',
  'settings.ui.projects.capacityHelp':
    'El plan base de $29 incluye 3 proyectos activos. Un espacio de trabajo puede tener acceso a hasta 20 sin crear otra cuenta.',
  'settings.ui.projects.capacitySummary': '{used} de {limit}',
  'settings.ui.projects.atLimitAction': 'Ver planes',
  'settings.ui.projects.atLimitTitle':
    'Este espacio de trabajo ya usó todos los espacios de proyecto',
  'settings.ui.projects.atLimitBody':
    'Archive un proyecto inactivo o cambie el derecho del espacio de trabajo antes de agregar otro. El límite actual es {limit}.',
  'settings.ui.projects.listLabel': 'Elija un proyecto para editar',
  'settings.ui.projects.detailsTitle': 'Detalles del proyecto',
  'settings.ui.projects.projectMeta':
    '{accounts, plural, =0 {Sin canales} one {#canal} other {#canales} many {#canales}} · Actualizado {updated}',
  'settings.ui.projects.archiveAction': 'Archivar proyecto',
  'settings.ui.projects.archiveTitle': '¿Archivar {project}?',
  'settings.ui.projects.archiveBody':
    'Este proyecto inactivo saldrá del espacio de trabajo activo y liberará un espacio de proyecto.',
  'settings.ui.projects.archiveChannels':
    'Sus canales conectados dejarán de aparecer en los flujos de proyectos activos.',
  'settings.ui.projects.archiveHistory':
    'Los borradores, publicaciones publicadas, recibos e historial de auditoría se conservan.',
  'settings.ui.projects.archiveLastDisabled':
    'Conserve al menos un proyecto activo en el espacio de trabajo.',
  'settings.ui.projects.archiveConnectedDisabled':
    'Desconecte los canales de este proyecto antes de archivarlo.',
  'settings.ui.localization.description':
    'Tres configuraciones separadas: el idioma de esta aplicación, los idiomas en los que publicas y los mercados para los que escribes. Cambiar uno nunca cambia a otro.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Elija un idioma de interfaz para esta aplicación. Los idiomas del contenido están separados y ya están disponibles.',
  'settings.ui.localization.marketHelp':
    'Un mercado cambia ejemplos, divulgaciones legales y llamados a la acción. No cambia el idioma de una publicación.',
  'settings.ui.localization.previewTitle': 'Cómo se leerán las fechas y los números',
  'settings.ui.localization.previewDate': 'Fecha',
  'settings.ui.localization.previewTime': 'tiempo',
  'settings.ui.localization.previewNumber': 'Número',
  'settings.ui.localization.previewCurrency': 'Moneda',
  'settings.ui.localization.weekStartHelp': 'Utilizado por la vista de semana del calendario.',
  'settings.ui.security.description':
    'Todo lo que puede actuar en este espacio de trabajo, en un solo lugar: tus sesiones, credenciales, agentes, webhooks y las aplicaciones a las que has otorgado acceso.',
  'settings.ui.security.sessionsCaption': 'Sesiones iniciadas para su cuenta',
  'settings.ui.security.sessionColumn.device': 'Dispositivo y navegador',
  'settings.ui.security.sessionColumn.location': 'Ubicación aproximada',
  'settings.ui.security.sessionColumn.lastSeen': 'último usado',
  'settings.ui.security.sessionCurrent': 'Esta sesión',
  'settings.ui.security.sessionRevokeAll': 'Cerrar sesión cada dos sesiones',
  'settings.ui.security.sessionLocationUnknown': 'Ubicación no registrada',
  'settings.ui.security.mfaOn': 'La autenticación de dos factores está activada',
  'settings.ui.security.mfaOff': 'La autenticación de dos factores está desactivada',
  'settings.ui.security.mfaBody':
    'Se requiere un segundo factor antes de realizar cambios en la facturación, crear una cuenta de servicio, volver a conectar una cuenta y revocar credenciales.',
  'settings.ui.security.credentialsTitle': 'Claves API',
  'settings.ui.security.credentialsBody':
    'Claves propiedad de este espacio de trabajo. Son independientes de las subvenciones para aplicaciones y de su propia sesión.',
  'settings.ui.security.agentsTitle': 'cuentas de servicio',
  'settings.ui.security.webhooksTitle': 'Puntos finales de webhook',
  'settings.ui.security.grantsTitle': 'Aplicaciones que has permitido',
  'settings.ui.security.grantsBody':
    'Revocar una aplicación detiene sus tokens inmediatamente. Tus propias conexiones y publicaciones programadas no se ven afectadas.',
  'settings.ui.security.grantScopes': 'Permisos concedidos',
  'settings.ui.security.socialPermissionsTitle': 'Permisos de cuentas sociales',
  'settings.ui.security.socialPermissionsBody':
    'Lo que cada cuenta conectada ha permitido hacer a Post Array, a partir de la instantánea de capacidad tomada en el momento de la conexión.',
  'settings.ui.security.viewInSection': 'Gestionar en {section}',
  'settings.ui.security.emptySessions': 'Sólo esta sesión está iniciada.',
  'settings.ui.security.emptyGrants':
    'Ninguna aplicación de terceros tiene acceso a este espacio de trabajo. Las aplicaciones aparecen aquí después de que usted las permite en una pantalla de consentimiento.',
  'settings.ui.security.revokeGrantTitle': 'Revocar el acceso a {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Sus tokens de acceso y actualización dejan de funcionar inmediatamente.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Publica que ya está programado, permanece programado. Cancélelos por separado si desea que se detengan.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'La aplicación puede solicitar acceso nuevamente y usted puede rechazarlo.',
  'settings.ui.data.description':
    'Saque sus datos, elimine algo o cierre la cuenta. Cada acción destructiva nombra exactamente lo que toca primero.',
  'settings.ui.data.exportTitle': 'Exportar',
  'settings.ui.data.exportBody':
    'Un archivo portátil de contenido, cronogramas, recibos, análisis y eventos de auditoría, además de los medios cargados.',
  'settings.ui.data.exportJson': 'JSON estructurado',
  'settings.ui.data.exportCsv': 'Hoja de cálculo CSV',
  'settings.ui.data.exportMedia': 'Archivo de medios',
  'settings.ui.data.exportJsonHelp':
    'Un archivo por tipo de registro. Documentado y estable en todas las versiones.',
  'settings.ui.data.exportCsvHelp':
    'Publicaciones, recibos y métricas como tablas planas para una hoja de cálculo.',
  'settings.ui.data.exportMediaHelp':
    'Los archivos originales que subiste o importaste, con sumas de verificación.',
  'settings.ui.data.exportStart': 'Preparar exportación',
  'settings.ui.data.exportRunning':
    'Preparando su exportación. Sigue ejecutándose si cierras esta página.',
  'settings.ui.data.exportReady': 'Exportación lista, preparada {date}',
  'settings.ui.data.exportDownload': 'Descargar exportar',
  'settings.ui.data.exportExpires': 'El enlace de descarga caduca. {date}.',
  'settings.ui.data.deleteTitle': 'Eliminar',
  'settings.ui.data.deleteBody':
    'Elige lo más pequeño que resuelva tu problema. Cada opción a continuación dice lo que sobrevive.',
  'settings.ui.data.deleteConnection': 'Revocar una conexión social',
  'settings.ui.data.deleteConnectionHelp':
    'Elimina el acceso Post Array a esa cuenta. El espacio de trabajo, su contenido y sus recibos permanecen.',
  'settings.ui.data.deleteProject': 'Eliminar una marca',
  'settings.ui.data.deleteProjectHelp':
    'Elimina la marca, sus reglas y su glosario. El contenido publicado en él conserva sus recibos.',
  'settings.ui.data.deleteContent': 'Eliminar contenido y medios',
  'settings.ui.data.deleteContentHelp':
    'Elimina borradores y archivos almacenados. No elimina nada ya publicado en una plataforma.',
  'settings.ui.data.deleteAccount': 'Cerrar este espacio de trabajo',
  'settings.ui.data.deleteAccountHelp':
    'Cancela trabajos programados, revoca todas las conexiones, elimina medios almacenados y cierra el espacio de trabajo.',
  'settings.ui.data.scheduledJobsTitle': 'Trabajo programado que se cancelará primero',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {No hay nada programado en este momento} one {#publicación programada} other {#publicaciones programadas} many {#publicaciones programadas}}',
  'settings.ui.data.cancelJobsFirst': 'Cancelar publicaciones programadas ahora',
  'settings.ui.data.cancelJobsDone': 'Publicaciones programadas canceladas. No se publicará nada.',
  'settings.ui.data.deleteConfirmPhraseLabel':
    'Escriba el nombre del espacio de trabajo para confirmar',
  'settings.ui.data.deleteConsequence.jobs':
    'Cada publicación programada se cancela antes de que se elimine algo.',
  'settings.ui.data.deleteConsequence.connections':
    'Cada conexión social es revocada por el proveedor.',
  'settings.ui.data.deleteConsequence.media':
    'Los medios almacenados se eliminan y no se pueden recuperar.',
  'settings.ui.data.deleteConsequence.receipts':
    'Los recibos de publicación se conservan durante el período de retención establecido en los Términos y luego se eliminan.',
  'settings.ui.data.deleteConsequence.published':
    'Las publicaciones que ya están publicadas en una plataforma no se eliminan. Retire los que están en la plataforma.',
  'settings.ui.data.exportFirst': 'Exporta tus datos antes de eliminarlos.',
  'settings.ui.referral.description':
    'Comparta Post Array con un enlace divulgado. La comisión nunca está condicionada a una revisión positiva.',
  'settings.ui.referral.linkLabel': 'Tu enlace de referencia',
  'settings.ui.referral.tableCaption': 'Registros atribuidos y su estado de comisión.',
  'settings.ui.referral.column.signup': 'Regístrate',
  'settings.ui.referral.column.date': 'Fecha',
  'settings.ui.referral.column.state': 'Comisión',
  'settings.ui.referral.column.amount': 'Cantidad',
  'settings.ui.referral.emptyTitle': 'Aún no hay registros atribuidos',
  'settings.ui.referral.emptyBody':
    'Los registros aparecen aquí una vez que alguien inicia una prueba a través de su enlace. Los montos permanecen pendientes hasta que se cierre la ventana de reembolso.',
  'settings.ui.referral.emptyExample':
    'Fila de ejemplo: acme.example, inició una prueba el 12 de junio, estuvo pendiente hasta el 12 de julio y luego se aprobó.',
  'settings.ui.referral.termsLink': 'Lea los términos del socio',
  'settings.ui.referral.balance': 'Comisión aprobada',
  'settings.ui.referral.balanceUnavailableReason':
    'El libro de comisiones de este período aún no ha sido conciliado.',
  'developer.ui.agents.description':
    'Una cuenta de servicio es una identidad con nombre para un agente, un script o un flujo de trabajo. Tiene sus propios alcances, sus propios límites y su propia pista de auditoría.',
  'developer.ui.agents.emptyTitle': 'Aún no hay cuentas de servicio',
  'developer.ui.agents.emptyBody':
    'Cree uno para cada automatización que ejecute. Cuentas separadas significa que puedes revocar una sin detener las demás.',
  'developer.ui.agents.emptyExample':
    'Ejemplo: "Agente de contenido", proyecto Acme EU, puede redactar y programar hasta 6 publicaciones por día entre las 07:00 y las 22:00, nunca publica inmediatamente.',
  'developer.ui.agents.step.identity': 'Nombre y propósito',
  'developer.ui.agents.step.scope': 'lo que puede alcanzar',
  'developer.ui.agents.step.limits': 'Límites',
  'developer.ui.agents.purpose': 'Para que sirve esta cuenta',
  'developer.ui.agents.purposeHelp':
    'Una frase. Aparece junto a cada acción que realiza esta cuenta en el registro de auditoría.',
  'developer.ui.agents.scopeHelp':
    'Un alcance se otorga exactamente a sí mismo. Nada aquí implica nada más.',
  'developer.ui.agents.limitsHelp':
    'Los límites los impone la API, no el agente. Un agente no puede aumentar su propio límite.',
  'developer.ui.agents.quietHours': 'Horas tranquilas',
  'developer.ui.agents.quietHoursHelp':
    'La cuenta no puede programar ni publicar dentro de este horario, en la zona horaria del espacio de trabajo.',
  'developer.ui.agents.lookAheadHelp': '¿Qué tan lejos en el futuro puede colocar una publicación?',
  'developer.ui.agents.cadenceHelp':
    'El mayor número de publicaciones externas que pueda provocar en un día.',
  'developer.ui.agents.expiry': 'Caducidad de la credencial',
  'developer.ui.agents.expiryHelp':
    'Una vida más corta es más segura. Puedes rotar en cualquier momento.',
  'developer.ui.agents.summaryTitle': 'Antes de crearlo',
  'developer.ui.agents.summaryAccounts': 'Cuentas a las que puede llegar',
  'developer.ui.agents.summaryMaxActions':
    'A lo sumo {count, plural, one {#publicación externa} other {#publicaciones externas} many {#publicaciones externas}}por día.',
  'developer.ui.agents.summaryApproval': 'Comportamiento de aprobación',
  'developer.ui.agents.summaryCreate': 'Crear cuenta de servicio',
  'developer.ui.agents.detailTitle': 'cuenta de servicio',
  'developer.ui.agents.statusActive': 'Activo',
  'developer.ui.agents.statusStopped': 'Detenido',
  'developer.ui.agents.statusExpired': 'Credencial caducada',
  'developer.ui.agents.stoppedBody':
    'Esta cuenta está detenida. Cada llamada que hace es rechazada por un motivo claro. Nada de lo que creó fue eliminado.',
  'developer.ui.agents.killTitle': 'Detener {name}',
  'developer.ui.agents.killConsequence.calls':
    'Todas las llamadas a API, MCP y CLI desde esta cuenta se rechazan a la vez.',
  'developer.ui.agents.killConsequence.scheduled':
    'Publica que ya está programado, permanece programado. Cancélalos del calendario si quieres que se detengan.',
  'developer.ui.agents.killConsequence.reversible': 'Puedes empezar de nuevo más tarde.',
  'developer.ui.agents.resume': 'Iniciar este agente nuevamente',
  'developer.ui.agents.rotate': 'Rotar credencial',
  'developer.ui.agents.rotateTitle': 'Gire la credencial para {name}',
  'developer.ui.agents.rotateConsequence.old':
    'La credencial actual deja de funcionar inmediatamente.',
  'developer.ui.agents.rotateConsequence.new': 'El nuevo se muestra una vez, en esta página.',
  'developer.ui.agents.rotateConsequence.clients':
    'Todo lo que utilice el valor anterior falla hasta que lo actualice.',
  'developer.ui.agents.credentialStored': 'He almacenado esta credencial',
  'developer.ui.agents.credentialLabel': 'Credencial de cuenta de servicio',
  'developer.ui.agents.credentialWarning': 'Esta es la única vez que se muestra esta credencial.',
  'developer.ui.agents.credentialWarningBody':
    'Cópialo en tu tienda secreta ahora. Mantenemos solo un hash, por lo que no podemos volver a mostrarlo. Al girar se crea uno nuevo.',
  'developer.ui.agents.credentialConsumed':
    'La credencial ya no se muestra. Gírelo si no lo guardó.',
  'developer.ui.agents.credentialReveal': 'Mostrar credencial',
  'developer.ui.agents.credentialHide': 'Ocultar credencial',
  'developer.ui.scope.accounts_read': 'Vea sus cuentas conectadas y lo que cada una puede hacer',
  'developer.ui.scope.accounts_write': 'Cambiar el nombre de las cuentas y cambiar cómo se agrupan',
  'developer.ui.scope.drafts_read': 'Lee tus borradores y sus variantes.',
  'developer.ui.scope.drafts_write': 'Crear y editar borradores',
  'developer.ui.scope.posts_schedule': 'Programe contenido aprobado en sus cuentas',
  'developer.ui.scope.posts_publish': 'Publica en tus cuentas inmediatamente',
  'developer.ui.scope.posts_cancel': 'Cancelar publicaciones programadas',
  'developer.ui.scope.analytics_read': 'Lea análisis de sus cuentas',
  'developer.ui.scope.media_read': 'Ver los archivos en tu biblioteca',
  'developer.ui.scope.media_write': 'Sube y edita archivos en tu biblioteca',
  'developer.ui.scope.rules_read': 'Lea sus reglas de automatización',
  'developer.ui.scope.rules_write':
    'Crear y cambiar reglas de automatización que se puedan publicar.',
  'developer.ui.scope.growth_read': 'Lea sus planes de crecimiento',
  'developer.ui.scope.growth_write': 'Crear y editar planes de crecimiento.',
  'developer.ui.scope.webhooks_manage': 'Crear y cambiar puntos finales de webhook',
  'developer.ui.scope.billing_read': 'Lea su plan, estado de prueba y uso',
  'developer.ui.scope.connections_admin': 'Conectar y desconectar cuentas sociales',
  'developer.ui.activity.caption':
    'Llamadas de herramientas recientes, con las que fueron rechazadas',
  'developer.ui.activity.column.time': 'tiempo',
  'developer.ui.activity.column.tool': 'Herramienta o ruta',
  'developer.ui.activity.column.outcome': 'Resultado',
  'developer.ui.activity.column.subject': 'Asunto',
  'developer.ui.activity.outcome.ok': 'Permitido',
  'developer.ui.activity.outcome.denied': 'denegado',
  'developer.ui.activity.outcome.failed': 'Fallido',
  'developer.ui.activity.filterDenied': 'Mostrar solo intentos rechazados',
  'developer.ui.activity.deniedExplain':
    'Un intento denegado es como se muestra un agente mal configurado. Estas filas se mantienen, no se ocultan.',
  'developer.ui.activity.emptyTitle': 'Aún no se han registrado llamadas',
  'developer.ui.activity.emptyBody':
    'Las llamadas aparecen aquí a los pocos segundos de realizarse, incluidas las que fueron rechazadas.',
  'developer.ui.activity.emptyExample':
    'Fila de ejemplo: 12:03, draft_post, Permitido, borrador para la cuenta X @acme.',
  'developer.ui.setup.help':
    'Pega esto en el cliente que estás conectando. Reemplace el marcador de posición de la credencial con el valor que almacenó.',
  'developer.ui.setup.credentialPlaceholder':
    'El fragmento utiliza un marcador de posición. Nunca envíe la credencial real a un repositorio.',
  'developer.ui.setup.copySnippet': 'Copiar fragmento para {client}',
  'developer.ui.setup.snippetCopied': 'Fragmento copiado',
  'developer.ui.setup.tabLabel': 'Fragmentos de configuración del cliente',
  'developer.ui.playground.help':
    'Las llamadas se ejecutan en una copia inicializada de este espacio de trabajo. No se contacta a ningún proveedor y no se programa nada.',
  'developer.ui.playground.tool': 'Herramienta',
  'developer.ui.playground.arguments': 'Argumentos',
  'developer.ui.playground.argumentsHelp': 'JSON. El mismo cuerpo que acepta la API real.',
  'developer.ui.playground.result': 'Resultado',
  'developer.ui.playground.resultEmpty':
    'Ejecute una herramienta para ver la respuesta que devolvería.',
  'developer.ui.playground.invalidJson':
    'Este aún no es un JSON válido, por lo que no se puede enviar.',
  'developer.ui.playground.deniedByApproval':
    'Nivel de aprobación {level}no permite esta llamada. El ensayo lo rechaza exactamente como lo haría la API.',
  'developer.ui.playground.announceResult': 'Se acabó el ensayo. {outcome}.',
  'developer.ui.apps.description':
    'Registre una aplicación para que otras personas puedan otorgarle acceso a su espacio de trabajo. Cada aplicación tiene su propia identidad, su propia lista de redirecciones permitidas y su propia pista de auditoría.',
  'developer.ui.apps.emptyTitle': 'No hay aplicaciones registradas',
  'developer.ui.apps.emptyBody':
    'Registre una aplicación cuando otro producto necesite actuar en nombre de un usuario Post Array. Para su propia automatización, utilice una cuenta de servicio.',
  'developer.ui.apps.emptyExample':
    'Ejemplo: "Acme Publisher", cliente confidencial, redireccionamiento https://acme.example/oauth/callback, alcances cuentas: lectura y borradores: escritura.',
  'developer.ui.apps.typeHelp':
    'Un cliente confidencial se ejecuta en un servidor que usted controla y puede guardar un secreto. Un cliente público es un navegador o una aplicación de escritorio y utiliza PKCE sin ningún secreto.',
  'developer.ui.apps.redirectAdd': 'Agregar una URI de redireccionamiento',
  'developer.ui.apps.redirectRemove': 'Quitar {uri}',
  'developer.ui.apps.redirectInvalid':
    'Introduzca un URI https completo sin comodines ni cadena de consulta. Debe coincidir exactamente con el valor que envía su aplicación.',
  'developer.ui.apps.linksTitle': 'Enlaces publicados',
  'developer.ui.apps.linksHelp':
    'Estos aparecen en la pantalla de consentimiento. Un usuario que no pueda comunicarse con ellos no otorgará acceso.',
  'developer.ui.apps.linkUnreachable':
    'No pudimos acceder a esta URL la última vez que verificamos. {date}.',
  'developer.ui.apps.linkReachable': 'Accesible, comprobado {date}',
  'developer.ui.apps.scopesTitle': 'Permisos que esta aplicación puede solicitar',
  'developer.ui.apps.scopesHelp':
    'Pide lo mínimo que necesites. Un usuario ve los permisos de lectura y los permisos consiguientes como dos grupos separados.',
  'developer.ui.apps.scopeGroup.read': 'Leer permisos',
  'developer.ui.apps.scopeGroup.reversible': 'Cambios que puedes deshacer',
  'developer.ui.apps.scopeGroup.consequential': 'Permisos consecuentes',
  'developer.ui.apps.scopeGroupHelp.read':
    'Estos permiten que la aplicación mire los datos. Nada cambia.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Estos permiten que la aplicación cree o edite cosas dentro de Post Array. Nada llega a una plataforma.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Estos pueden provocar una publicación en una cuenta real o cambiar quién puede acceder a sus cuentas. Siempre se enumeran por separado y nunca se agrupan.',
  'developer.ui.apps.noBundling':
    'No existe un alcance de acceso combinado. La facturación y la administración de la conexión siempre se solicitan por nombre.',
  'developer.ui.apps.secretTitle': 'secreto del cliente',
  'developer.ui.apps.secretWarning': 'Esta es la única vez que se muestra el secreto del cliente.',
  'developer.ui.apps.secretWarningBody':
    'Guárdelo ahora en el administrador secreto del lado de su servidor. Mantenemos solo un hash. Si lo pierdes, gíralo: no hay forma de revelarlo nuevamente.',
  'developer.ui.apps.secretConsumed': 'El secreto ya no se muestra. Gírelo si no lo guardó.',
  'developer.ui.apps.secretStored': 'He guardado este secreto',
  'developer.ui.apps.secretPublicClient':
    'Un cliente público no tiene ningún secreto. Utiliza el flujo de código de autorización con PKCE.',
  'developer.ui.apps.rotateTitle': 'Rotar el secreto del cliente para {app}',
  'developer.ui.apps.rotateConsequence.old': 'El secreto actual deja de funcionar inmediatamente.',
  'developer.ui.apps.rotateConsequence.grants':
    'Las concesiones de usuarios existentes no se revocan.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Sus servidores no pueden actualizar los tokens hasta que implemente el nuevo valor.',
  'developer.ui.apps.consentPreviewTitle': 'Vista previa de la pantalla de consentimiento',
  'developer.ui.apps.consentPreviewHelp':
    'Esto es lo que ve un usuario. Se genera a partir del registro de la aplicación, por lo que no puede prometer más de lo que pide la aplicación.',
  'developer.ui.apps.consentPreviewSample':
    'Solo vista previa. No se concede nada ni se emite ningún token.',
  'developer.ui.apps.grantsCaption': 'Workspace que otorgaron acceso a esta aplicación',
  'developer.ui.apps.grantColumn.workspace': 'Workspace',
  'developer.ui.apps.grantColumn.scopes': 'Alcances',
  'developer.ui.apps.grantColumn.granted': 'Concedido',
  'developer.ui.apps.grantColumn.lastUsed': 'último usado',
  'developer.ui.apps.grantsEmpty': 'Nadie ha otorgado acceso a esta aplicación todavía.',
  'developer.ui.apps.logsCaption': 'Solicitudes recientes, con secretos y cargas útiles eliminados',
  'developer.ui.apps.logColumn.time': 'tiempo',
  'developer.ui.apps.logColumn.route': 'Ruta',
  'developer.ui.apps.logColumn.status': 'Estado',
  'developer.ui.apps.logColumn.workspace': 'Workspace',
  'developer.ui.apps.logsRedacted':
    'Los cuerpos de solicitud y respuesta se almacenan y se eliminan las credenciales, los tokens y el contenido del usuario.',
  'developer.ui.apps.sandboxTitle': 'Credenciales de zona de pruebas',
  'developer.ui.apps.sandboxBody':
    'Un ID de cliente independiente y un espacio de trabajo con datos inicializados. Las llamadas realizadas con él nunca llegan a un proveedor.',
  'developer.ui.apps.rateLimitLabel': 'Límite de tarifa',
  'developer.ui.apps.rateLimitUsage': '{used}de {limit}pide esta hora',
  'developer.ui.apps.disable': 'Deshabilitar aplicación',
  'developer.ui.apps.enable': 'Habilitar aplicación',
  'developer.ui.apps.disabledBody':
    'Esta aplicación está deshabilitada. Los tokens existentes se rechazan y no se puede iniciar ninguna nueva concesión. Las subvenciones se mantienen para que puedas habilitarlas nuevamente.',
  'developer.ui.apps.deleteTitle': 'Eliminar {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Cada subvención se revoca y cada token deja de funcionar.',
  'developer.ui.apps.deleteConsequence.logs':
    'Los registros de solicitudes se mantienen durante el período de retención de la auditoría.',
  'developer.ui.apps.deleteConsequence.irreversible':
    'La identificación del cliente no se puede reutilizar.',
  'developer.ui.webhooks.description':
    'Entregas HTTPS firmadas para los eventos que elijas. Cada entrega se registra con su respuesta y cualquier entrega se puede enviar nuevamente.',
  'developer.ui.webhooks.emptyTitle': 'Aún no hay puntos finales',
  'developer.ui.webhooks.emptyBody':
    'Agregue un punto final para recibir resultados de publicación, decisiones de aprobación y estado de la conexión en sus propios sistemas.',
  'developer.ui.webhooks.emptyExample':
    'Ejemplo: https://hooks.acme.example/relay, suscrito a post.published, post.failed y connection.action_required.',
  'developer.ui.webhooks.create': 'Agregar un punto final',
  'developer.ui.webhooks.url': 'URL de punto final',
  'developer.ui.webhooks.urlHelp':
    'Solo HTTPS. No seguimos redirecciones y no reintentamos un 2xx.',
  'developer.ui.webhooks.eventsTitle': 'Eventos',
  'developer.ui.webhooks.eventsHelp':
    'Elija los eventos que maneja. Enviar todo a un punto final que ignora la mayor parte hace que las fallas sean más difíciles de ver.',
  'developer.ui.webhooks.eventsAll': 'cada evento',
  'developer.ui.webhooks.eventsSelected': 'Sólo los eventos que selecciono',
  'developer.ui.webhooks.eventsCount':
    '{count, plural, one {#evento} other {#eventos} many {#eventos}}',
  'developer.ui.webhooks.eventGroup.connections': 'Conexiones',
  'developer.ui.webhooks.eventGroup.content': 'Contenido y aprobación',
  'developer.ui.webhooks.eventGroup.publishing': 'Publicación',
  'developer.ui.webhooks.eventGroup.automation': 'Automatización y feeds',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'Proyectos y cuentas',
  'developer.ui.webhooks.scopeAll': 'Cada proyecto y cuenta',
  'developer.ui.webhooks.scopeSelected': 'Sólo los que selecciono',
  'developer.ui.webhooks.secretTitle': 'Secreto de firma',
  'developer.ui.webhooks.secretBody':
    'Verifique el encabezado de la firma antes de analizar un cuerpo. Deduplicar en la identificación de entrega, que es estable en todos los reintentos.',
  'developer.ui.webhooks.secretRotateTitle': 'Rotar el secreto de firma',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Ambos secretos se aceptan durante 24 horas para que pueda implementarlos sin perder una entrega.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Después de esa ventana sólo se utiliza el nuevo secreto.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Envía un evento de ejemplo firmado y marcado como prueba, para que su receptor pueda ignorarlo de forma segura.',
  'developer.ui.webhooks.testDeliverySent':
    'Entrega de prueba enviada. El resultado aparece en el registro a continuación.',
  'developer.ui.webhooks.deliveriesCaption':
    'Entregas recientes y la respuesta que recibió cada una',
  'developer.ui.webhooks.deliveryColumn.time': 'Solicitado',
  'developer.ui.webhooks.deliveryColumn.event': 'Evento',
  'developer.ui.webhooks.deliveryColumn.attempt': 'intento',
  'developer.ui.webhooks.deliveryColumn.response': 'Respuesta',
  'developer.ui.webhooks.deliveryColumn.status': 'Estado',
  'developer.ui.webhooks.deliveryStatus.pending': 'esperando',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Entregado',
  'developer.ui.webhooks.deliveryStatus.failed': 'Error, lo volveré a intentar',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Error, no más intentos',
  'developer.ui.webhooks.deliveryStatus.disabled': 'No enviado, punto final deshabilitado',
  'developer.ui.webhooks.deliveryNoResponse': 'No se recibió respuesta',
  'developer.ui.webhooks.deliveryNextAttempt': 'Próximo intento {relativeTime}',
  'developer.ui.webhooks.inspect': 'inspeccionar la entrega',
  'developer.ui.webhooks.inspectTitle': 'Entrega {id}',
  'developer.ui.webhooks.inspectRequest': 'Cuerpo de la solicitud',
  'developer.ui.webhooks.inspectResponse': 'Cuerpo de respuesta',
  'developer.ui.webhooks.redeliver': 'Enviar esta entrega nuevamente',
  'developer.ui.webhooks.redeliverHelp':
    'La misma identificación de evento se envía nuevamente con el indicador de reenvío configurado, por lo que un receptor idempotente lo ignora de manera segura.',
  'developer.ui.webhooks.redelivered': 'En cola para reenvío.',
  'developer.ui.webhooks.failureTitle': 'Este punto final está fallando',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {#la entrega seguida falló} other {#entregas consecutivas fallaron} many {#entregas consecutivas fallaron}}. después {limit}En caso de fallas consecutivas, el punto final se desactiva y se presenta un elemento de acción.',
  'developer.ui.webhooks.disabledTitle':
    'Este punto final se deshabilitó después de repetidos errores',
  'developer.ui.webhooks.disabledBody':
    'Dejamos de enviarle para que su cola no se llene. Repare el receptor, envíe una entrega de prueba y luego habilítelo nuevamente.',
  'developer.ui.webhooks.lastSuccessLabel': 'Último éxito',
  'developer.ui.webhooks.lastSuccessNever': 'Nunca se ha realizado ninguna entrega',
  'developer.ui.webhooks.deleteTitle': 'Eliminar este punto final',
  'developer.ui.webhooks.deleteConsequence.stop': 'No se envía nada más a esta URL.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'Los registros de entrega se mantienen durante el período de retención de la auditoría.',
  'growth.ui.entryHelp':
    'Responda una breve entrada, confirme lo que entendimos y obtenga un plan que pueda aceptar artículo por artículo. Propone trabajo. Nunca programa ni publica nada por sí solo.',
  'growth.ui.step.intake': 'ingesta',
  'growth.ui.step.confirm': 'Confirmar',
  'growth.ui.step.plan': 'Planificar',
  'growth.ui.stepIndicator': 'paso {current}de {total}: {name}',
  'growth.ui.intake.section.product': 'Producto',
  'growth.ui.intake.section.audience': 'Audiencia y mercados',
  'growth.ui.intake.section.objective': 'Objetivo',
  'growth.ui.intake.section.capacity': 'Canales y capacidad',
  'growth.ui.intake.section.limits': '¿Qué está fuera de los límites?',
  'growth.ui.intake.help':
    'Aquí no se adivina nada para usted. Todo lo que dejes vacío se marca como faltante en lugar de como completado.',
  'growth.ui.intake.productNameHelp': 'El nombre que utiliza con los clientes.',
  'growth.ui.intake.siteUrlHelp':
    'Leemos la página que nos das como material fuente. Usted confirma todos los datos que extraemos de él.',
  'growth.ui.intake.descriptionHelp': 'Qué vendes y para quién es, en tus propias palabras.',
  'growth.ui.intake.marketsHelp': 'Países o regiones. Uno por línea.',
  'growth.ui.intake.localesHelp': 'Los idiomas en los que publicará.',
  'growth.ui.intake.objectiveHelp': 'De qué quieres más en el próximo trimestre.',
  'growth.ui.intake.conversionHelp':
    'La acción realmente se puede medir. Un registro, una demostración, una compra.',
  'growth.ui.intake.proofHelp':
    'Estudios de casos, evaluaciones comparativas que ejecutó, capturas de pantalla de su propiedad, permisos que ya posee. Uno por línea.',
  'growth.ui.intake.proofNone': 'Aún no tengo pruebas aprobadas',
  'growth.ui.intake.proofNoneEffect':
    'El plan evitará por completo los resultados de los clientes y las reclamaciones de resultados.',
  'growth.ui.intake.channelsHelp': 'Las cuentas desde las que ya publicas.',
  'growth.ui.intake.capacityHelp': 'Sea honesto. Un plan que no puedes ejecutar no es un plan.',
  'growth.ui.intake.competitorsHelp': 'Opcional. Uno por línea.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Reclamaciones que no puede realizar por motivos legales o de políticas. Uno por línea.',
  'growth.ui.intake.prohibitedTopicsHelp': 'Temas de los que mantenerse alejado. Uno por línea.',
  'growth.ui.intake.submit': 'Revisar lo que entendimos',
  'growth.ui.intake.savedAnnouncement': 'Perfil comercial guardado.',
  'growth.ui.intake.requiredMissing':
    'Complete los campos marcados como obligatorios antes de continuar.',
  'growth.ui.confirm.factsTitle': 'Hechos que confirmaste',
  'growth.ui.confirm.factsHelp': 'Estos se pueden utilizar en copia.',
  'growth.ui.confirm.assumptionsTitle': 'Suposiciones que hicimos',
  'growth.ui.confirm.assumptionsHelp':
    'Estos no son hechos. Dan forma al plan pero nunca se convierten en un reclamo en un post.',
  'growth.ui.confirm.missingTitle': 'desaparecido',
  'growth.ui.confirm.missingHelp':
    'El plan gira en torno a cada uno de estos y lo dice donde es importante.',
  'growth.ui.confirm.confidence.label': 'Confianza: {level}',
  'growth.ui.confirm.confidence.low': 'bajo',
  'growth.ui.confirm.confidence.medium': 'medio',
  'growth.ui.confirm.confidence.high': 'alto',
  'growth.ui.confirm.promote': 'Confirmar como un hecho',
  'growth.ui.confirm.correct': 'Corregir esto',
  'growth.ui.confirm.correctLabel': 'Tu corrección',
  'growth.ui.confirm.generate': 'generar el plan',
  'growth.ui.confirm.announcement': 'Perfil empresarial confirmado.',
  'growth.ui.plan.generatingBody':
    'Esto lleva unos segundos. Puedes salir de esta página: el plan termina solo.',
  'growth.ui.plan.stateDraft': 'Borrador, no aprobado',
  'growth.ui.plan.stateApproved': 'Aprobado',
  'growth.ui.plan.stateSuperseded': 'Reemplazado por una versión más nueva',
  'growth.ui.plan.newVersionNotice':
    'Una actualización crea la versión {version}y deja intacta la versión aprobada.',
  'growth.ui.plan.emptyTitle': 'Aún no hay ningún plan',
  'growth.ui.plan.emptyBody':
    'Complete el perfil comercial y construiremos un plan a partir de los datos que confirme.',
  'growth.ui.plan.emptyExample':
    'Un plan contiene una estrategia, cuatro semanas de resúmenes, una campaña UGC, oportunidades respaldadas por catálogo y hasta cinco herramientas.',
  'growth.ui.plan.tabsLabel': 'Secciones del plan',
  'growth.ui.plan.modelNote': 'Generado por {model}, rápido {promptVersion}, en {date}.',
  'growth.ui.strategy.snapshotTitle': 'Instantánea empresarial',
  'growth.ui.strategy.channelPriority': 'Prioridad {rank}',
  'growth.ui.strategy.channelFormats': 'Formatos nativos',
  'growth.ui.strategy.pillarProof': 'Prueba en la que se apoya este pilar',
  'growth.ui.strategy.pillarProofNone':
    'No hay pruebas aprobadas. Mantenga este pilar descriptivo.',
  'growth.ui.strategy.cadenceCaption': 'Publicaciones por semana por canal',
  'growth.ui.strategy.cadenceColumn.channel': 'canal',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Publicaciones por semana',
  'growth.ui.strategy.cadenceTotal': 'Total por semana',
  'growth.ui.strategy.capacityWarning':
    'Esta cadencia es {planned}publicaciones por semana contra una capacidad declarada de {capacity}horas. Reducirlo o aumentar la capacidad en el perfil.',
  'growth.ui.strategy.measurementBody':
    'Comparado con sus propias publicaciones finales en el mismo canal y formato. No se utiliza ningún punto de referencia externo porque ninguno es comparable a su cuenta.',
  'growth.ui.strategy.localeAdaptations': 'Notas de idioma',
  'growth.ui.fourWeek.caption': 'Briefs propuestos por semana y día',
  'growth.ui.fourWeek.column.date': 'Fecha',
  'growth.ui.fourWeek.column.channel': 'canal',
  'growth.ui.fourWeek.column.pillar': 'Pilar',
  'growth.ui.fourWeek.column.format': 'Formato',
  'growth.ui.fourWeek.column.brief': 'Breve',
  'growth.ui.fourWeek.column.cta': 'Llamado a la acción',
  'growth.ui.fourWeek.column.measurement': 'Etiqueta de medida',
  'growth.ui.fourWeek.column.actions': 'Acciones',
  'growth.ui.fourWeek.approvalRequired': 'Se requiere aprobación antes de poder publicar',
  'growth.ui.fourWeek.approvalNotRequired': 'No se requiere aprobación para esta cuenta',
  'growth.ui.fourWeek.noCta': 'Sin llamado a la acción',
  'growth.ui.fourWeek.weekEmpty': 'No se proponen resúmenes para esta semana.',
  'growth.ui.fourWeek.acceptedCount': '{accepted}de {total}escritos aceptados como borradores',
  'growth.ui.fourWeek.acceptAnnouncement': 'Borrador creado a partir de este informe.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Propuesta de calendario agregada para {date}.',
  'growth.ui.ugc.promptAngle': 'ángulo {number}',
  'growth.ui.ugc.checklistTitle': 'Derechos, consentimiento y divulgación',
  'growth.ui.ugc.checklistHelp':
    'Trabaje en esto con cada participante antes de que se publique algo. El consentimiento para aparecer no es consentimiento para hacer publicidad.',
  'growth.ui.ugc.incentiveNone': 'No se ofrece incentivo',
  'growth.ui.ugc.incentiveDisclosure':
    'Un incentivo debe ser divulgado en cada publicación que resulte del mismo, por usted y por el participante.',
  'growth.ui.ugc.honesty':
    'Esto planifica una campaña que ejecuta con personas reales. Post Array no busca creadores, no los contacta, no escribe testimonios ni crea contenido para clientes.',
  'growth.ui.opportunities.caption':
    'Oportunidades verificadas del catálogo, clasificadas según su perfil',
  'growth.ui.opportunities.column.opportunity': 'Oportunidad',
  'growth.ui.opportunities.column.type': 'Tipo',
  'growth.ui.opportunities.column.audience': 'Audiencia',
  'growth.ui.opportunities.column.fit': '¿Por qué esto encaja?',
  'growth.ui.opportunities.column.requirements': 'Requisitos',
  'growth.ui.opportunities.column.rules': 'Reglas de autopromoción',
  'growth.ui.opportunities.column.cost': 'Costo',
  'growth.ui.opportunities.column.effort': 'Esfuerzo',
  'growth.ui.opportunities.column.verified': 'Última verificación',
  'growth.ui.opportunities.column.actions': 'Acciones',
  'growth.ui.opportunities.costFree': 'Gratis',
  'growth.ui.opportunities.effort.low': 'Bajo',
  'growth.ui.opportunities.effort.medium': 'Medio',
  'growth.ui.opportunities.effort.high': 'Alto',
  'growth.ui.opportunities.noRequiredAsset': 'No se requiere ningún activo',
  'growth.ui.opportunities.prepareTitle': 'Preparar una presentación para {name}',
  'growth.ui.opportunities.prepareRules': 'Sus reglas, citadas',
  'growth.ui.opportunities.prepareChecklist': 'que tener listo',
  'growth.ui.opportunities.prepareManual':
    'Envíe esto usted mismo en su sitio. Post Array no completa formularios, no crea cuentas ni envía correos electrónicos a nadie.',
  'growth.ui.opportunities.pitchTitle': 'Borrador de tono',
  'growth.ui.opportunities.pitchHelp':
    'Edítalo antes de enviarlo. Utiliza sólo los hechos que usted confirmó.',
  'growth.ui.opportunities.submittedOn': 'Enviado {date}',
  'growth.ui.opportunities.staleTitle': 'Algunas entradas necesitan volver a verificarse',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {#la entrada ya pasó su fecha de revisión} other {#las entradas han pasado su fecha de revisión} many {#las entradas han pasado su fecha de revisión}}. Consulte las reglas actuales en el sitio antes de confiar en ellas.',
  'growth.ui.opportunities.emptyExample':
    'Una fila del catálogo contiene la URL oficial, la audiencia, las reglas de envío citadas en el sitio, el costo, el esfuerzo y la fecha en que una persona lo revisó por última vez.',
  'growth.ui.tools.shown': '{shown}de {max}mostrado',
  'growth.ui.tools.fewerThanMax':
    'Sólo {count, plural, one {#coincidencias de herramientas} other {#las herramientas coinciden} many {#las herramientas coinciden}}este flujo de trabajo con una revisión actual. Preferiríamos mostrar menos que rellenar la lista.',
  'growth.ui.tools.emptyTitle':
    'Ninguna herramienta revisada se adapta a este flujo de trabajo todavía',
  'growth.ui.tools.emptyBody':
    'Cada entrada necesita un precio verificado, términos de derechos verificados y una limitación nombrada antes de aparecer aquí.',
  'growth.ui.tools.emptyExample':
    'Una entrada dice para qué es mejor, por qué se ajusta a su plan, qué no puede hacer, las habilidades que necesita, cómo regresa la producción a Post Array y cuándo se verificó el precio por última vez.',
  'growth.ui.tools.openSite': 'Abra el sitio oficial para {name}',
  'growth.ui.tools.stale': 'Pasada su fecha de revisión. Excluido de los planes generados.',
  'growth.ui.item.explainTitle': '¿Por qué se sugirió esto?',
  'growth.ui.item.explainEvidence': 'en que se basa',
  'growth.ui.item.explainNoEvidence':
    'Esto surgió del objetivo y de las reglas del canal, no de un hecho confirmado sobre tu negocio.',
  'growth.ui.item.dismissTitle': 'Descartar esta sugerencia',
  'growth.ui.item.dismissBody':
    'Cuéntanos por qué. El motivo se almacena con el plan y da forma a la siguiente versión.',
  'growth.ui.item.dismissReasonLabel': 'Razón',
  'growth.ui.item.dismissReason.notRelevant': 'No relevante para este negocio.',
  'growth.ui.item.dismissReason.noCapacity': 'No tenemos la capacidad',
  'growth.ui.item.dismissReason.wrongAudience': 'Audiencia equivocada',
  'growth.ui.item.dismissReason.alreadyDone': 'ya hacemos esto',
  'growth.ui.item.dismissReason.policy': 'Contra nuestra póliza o reclamaciones',
  'growth.ui.item.dismissReason.other': 'algo mas',
  'growth.ui.item.dismissNote': 'Cualquier cosa que quieras agregar',
  'growth.ui.item.dismissed': 'Despedido. Permanece visible para que puedas deshacerlo.',
  'growth.ui.item.undoDismiss': 'Deshacer descartar',
  'growth.ui.export.title': 'Exportar este plan',
  'growth.ui.export.formatLabel': 'Formato',
  'growth.ui.export.copy': 'Copiar al portapapeles',
  'growth.ui.export.download': 'Descargar archivo',
  'growth.ui.export.copied': 'Plano copiado al portapapeles.',
  'growth.ui.export.schemaNote':
    'Los tres formatos provienen de un esquema validado, versión {version}. Las vistas estructuradas son seguras para el control de fuentes y no contienen secretos.',
  'growth.ui.export.previewLabel': 'Vista previa de exportación',
} as const;
