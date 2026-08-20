/**
 * Web catalog for settings, the developer portal, billing and the Growth
 * Advisor.
 *
 * This file only adds what the web screens need on top of the intent catalogs
 * in `settings.ts`, `developer.ts`, `billing.ts` and `growth.ts`. Everything
 * here lives under a `.ui.` segment so a key can never collide with one of
 * those files when the catalogs are merged.
 *
 * Several strings are mandated word for word and must not be softened:
 *  - `billing.ui.annualFraming` states the saving in currency, never a percent.
 *  - `billing.ui.cancelConfirmedBeforeConversion` must read
 *    "Canceled. You will not be charged."
 *  - the media generation boundary paragraph is NOT restated here. It already
 *    exists as `billing.mediaGeneration.explanation`, and the Tool Radar
 *    renders that same key so there is one sentence to review and translate.
 */
export const webSettingsMessages = {
  /* ------------------------------------------------------------------ shell */

  'settings.ui.subtitle': 'Todo lo que configura este espacio de trabajo. Aquí no se publica nada.',
  'settings.ui.nav.label': 'Secciones de configuración',
  'settings.ui.index.help':
    'Elige una sección. Cada cambio se le atribuye a usted y aparece en el registro de auditoría.',

  'settings.ui.section.members': 'Miembros y roles',
  'settings.ui.section.membersSummary':
    'Quién está en este espacio de trabajo y qué puede hacer cada persona.',
  'settings.ui.section.projects': 'Marcas',
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
  'settings.ui.section.billing': 'Facturación',
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
    'Exportar, revocar una conexión, eliminar una marca, eliminar contenido o cerrar la cuenta.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Loading {section}',
  'settings.ui.state.errorTitle': 'No pudimos load {section}',
  'settings.ui.state.errorRetry': 'Inténtalo de nuevo',
  'settings.ui.state.savingAnnouncement': 'Saving {section}',
  'settings.ui.state.savedAnnouncement': '{section} guardado',
  'settings.ui.state.saveFailedAnnouncement':
    '{section} no se guardó. Tu entrada todavía está aquí.',
  'settings.ui.state.offlineTitle': 'Estás desconectado',
  'settings.ui.state.offlineBody':
    'Puedes leer esta página. Los cambios no se pueden guardar hasta que se restablezca la conexión.',
  'settings.ui.state.permissionTitle': 'No tienes acceso to {section}',
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
  'settings.ui.state.rateLimitUsageText': '{used} of {limit} usado',
  'settings.ui.state.unsavedTitle': 'Tienes cambios sin guardar',
  'settings.ui.state.unsavedBody': 'Guárdalos antes de salir de esta sección.',
  'settings.ui.state.readOnlyTitle': 'Este espacio de trabajo es de solo lectura',
  'settings.ui.state.readOnlyBody':
    'La facturación está vencida. Su contenido, recibos y conexiones están intactos. La configuración se puede leer pero no cambiar.',

  'settings.ui.state.referenceLabel': 'Referencia de soporte',

  'settings.ui.attribution': 'Cambiado by {name} {relativeTime}',
  'settings.ui.attributionNever': 'No ha cambiado desde que fue creado.',
  'settings.ui.copyFailed':
    'Su navegador bloqueó la copia. Seleccione el texto y cópielo manualmente.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'Cada invitación, cambio de rol y eliminación se registra con su nombre y la hora.',
  'settings.ui.members.tableCaption': 'Personas en este espacio de trabajo, con rol y alcance.',
  'settings.ui.members.column.person': 'persona',
  'settings.ui.members.column.role': 'Rol',
  'settings.ui.members.column.scope': 'Alcance',
  'settings.ui.members.column.approvals': 'Aprobaciones',
  'settings.ui.members.column.lastActive': 'Último activo',
  'settings.ui.members.column.actions': 'Acciones',
  'settings.ui.members.scopeAll': 'Todas las marcas y cuentas.',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {# marca} many {# marcas} other {# marcas}}: {names}',
  'settings.ui.members.approvals.canApprove': 'puede aprobar',
  'settings.ui.members.approvals.cannotApprove': 'No se puede aprobar',
  'settings.ui.members.approvals.canApproveOwnProjects': 'Puede aprobar las marcas enumeradas',
  'settings.ui.members.lastActiveNever': 'Aún no ha iniciado sesión',
  'settings.ui.members.changeRole': 'Cambiar rol for {name}',
  'settings.ui.members.remove': 'Remove {name}',
  'settings.ui.members.lastOwnerTitle': 'Un espacio de trabajo mantiene al menos un propietario',
  'settings.ui.members.lastOwnerBody':
    'Primero, convierta a otra persona en propietario y luego este cambio estará disponible.',
  'settings.ui.members.inviteTitle': 'Invitar a alguien a este espacio de trabajo',
  'settings.ui.members.inviteBody':
    'Reciben un correo electrónico con un enlace. La invitación caduca después de siete días y puedes revocarla antes de esa fecha.',
  'settings.ui.members.inviteRole': 'Rol',
  'settings.ui.members.inviteScope': 'Marcas en las que pueden trabajar.',
  'settings.ui.members.inviteScopeAll': 'Todas las marcas en este espacio de trabajo',
  'settings.ui.members.inviteScopeSelected': 'Sólo las marcas que selecciono',
  'settings.ui.members.inviteApprovals': 'Puede decidir solicitudes de aprobación',
  'settings.ui.members.inviteApprovalsHelp':
    'Solo se les puede otorgar esto a los roles que ya incluyen revisión. Es independiente de la edición.',
  'settings.ui.members.inviteSubmit': 'enviar invitación',
  'settings.ui.members.invitePending': 'Invited {relativeTime} by {name}',
  'settings.ui.members.inviteRevoke': 'Revocar invitación',
  'settings.ui.members.inviteResend': 'Enviar la invitación nuevamente',
  'settings.ui.members.emptyTitle': 'Eres la única persona aquí',
  'settings.ui.members.emptyBody':
    'Invita a las personas que escriben, aprueban o leen los resultados. Cada uno obtiene un rol y un alcance de marca.',
  'settings.ui.members.emptyExample':
    'Una forma común: un propietario para la facturación, un aprobador por marca y editores que redactan pero nunca publican.',
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
  'settings.ui.members.removeTitle': 'Remove {name} de este espacio de trabajo',
  'settings.ui.members.removeConsequence.access':
    'Pierden el acceso inmediatamente, en todas las superficies.',
  'settings.ui.members.removeConsequence.drafts':
    'Los borradores que escribieron permanecen en el espacio de trabajo y son editables.',
  'settings.ui.members.removeConsequence.audit':
    'Sus acciones pasadas permanecen en el registro de auditoría y en los recibos.',
  'settings.ui.members.removeConsequence.approvals':
    'Las solicitudes de aprobación que las esperan regresan a la cola para otro aprobador.',

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'Una marca impone las reglas con las que se verifica el contenido: lo que puedes afirmar, lo que no puedes decir y cómo está escrito en cada idioma.',
  'settings.ui.projects.listCaption': 'Marcas en este espacio de trabajo',
  'settings.ui.projects.column.project': 'Project',
  'settings.ui.projects.column.locales': 'Idiomas del contenido',
  'settings.ui.projects.column.accounts': 'Cuentas',
  'settings.ui.projects.column.updated': 'Actualizado',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Sin cuentas} one {# cuenta} many {# cuentas} other {# cuentas}}',
  'settings.ui.projects.emptyTitle': 'Aún no hay marcas',
  'settings.ui.projects.emptyBody':
    'Una marca agrupa cuentas, reglas de aprobación y reglas de idioma. La mayoría de los equipos comienzan con una y agregan una segunda cuando un cliente o un mercado necesita reglas diferentes.',
  'settings.ui.projects.emptyExample':
    'Ejemplo: marca "Acme EU", idiomas inglés y alemán, término bloqueado "garantizado", divulgación "Asociación paga" activada por Instagram.',
  'settings.ui.projects.voiceHelp':
    'Cómo suena esta marca. Se utiliza cuando solicita una reescritura y cuando se verifican las reclamaciones.',
  'settings.ui.projects.audienceHelp': 'Para quién es el contenido, por mercado.',
  'settings.ui.projects.approvedClaimsHelp':
    'Declaraciones que un revisor ha aprobado. Todo lo que esté fuera de esta lista se marca antes de la aprobación, no después de la publicación.',
  'settings.ui.projects.blockedTermsHelp':
    'Palabras que bloquean la programación de esta marca. Uno por línea.',
  'settings.ui.projects.domainsHelp':
    'Dominios a los que esta marca puede vincular y acortar. Solo se pueden seleccionar dominios verificados en el compositor.',
  'settings.ui.projects.domainVerified': 'Verified {date}',
  'settings.ui.projects.domainPending': 'Registro DNS aún no visto',
  'settings.ui.projects.disclosureHelp':
    'Aplicado por defecto en el compositor para las plataformas que elijas aquí. Se puede cambiar por publicación antes de la aprobación.',
  'settings.ui.projects.glossaryHelp':
    'Nombres de productos, términos legales y cualquier cosa que deba sobrevivir a una traducción sin cambios.',
  'settings.ui.projects.glossaryCaption': 'Términos protegidos y cómo se maneja cada uno por idioma',
  'settings.ui.projects.glossaryEmpty':
    'Aún no hay términos protegidos. Agregue nombres de productos y términos legales que no se deben traducir ni reformular.',
  'settings.ui.projects.localeRulesHelp':
    'Reglas por idioma de contenido. Se aplican cuando adapta o transcrea y se muestran al revisor.',
  'settings.ui.projects.saveProject': 'guardar marca',

  /* ------------------------------------------------------------ localization */

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

  /* ---------------------------------------------------------------- security */

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
    'Lo que cada cuenta conectada le ha permitido hacer a Relay, a partir de la instantánea de capacidad tomada en el momento de la conexión.',
  'settings.ui.security.viewInSection': 'Administrar in {section}',
  'settings.ui.security.emptySessions': 'Sólo esta sesión está iniciada.',
  'settings.ui.security.emptyGrants':
    'Ninguna aplicación de terceros tiene acceso a este espacio de trabajo. Las aplicaciones aparecen aquí después de que usted las permite en una pantalla de consentimiento.',
  'settings.ui.security.revokeGrantTitle': 'Revocar acceso for {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Sus tokens de acceso y actualización dejan de funcionar inmediatamente.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Publica que ya está programado, permanece programado. Cancélelos por separado si desea que se detengan.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'La aplicación puede solicitar acceso nuevamente y usted puede rechazarlo.',

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'Take your data out, remove one thing, or close the account. Every destructive action names exactly what it touches first.',
  'settings.ui.data.exportTitle': 'Export',
  'settings.ui.data.exportBody':
    'A portable archive of content, schedules, receipts, analytics and audit events, plus your uploaded media.',
  'settings.ui.data.exportJson': 'Structured JSON',
  'settings.ui.data.exportCsv': 'Spreadsheet CSV',
  'settings.ui.data.exportMedia': 'Media archive',
  'settings.ui.data.exportJsonHelp':
    'One file per record type. Documented and stable across versions.',
  'settings.ui.data.exportCsvHelp': 'Posts, receipts and metrics as flat tables for a spreadsheet.',
  'settings.ui.data.exportMediaHelp':
    'The original files you uploaded or imported, with checksums.',
  'settings.ui.data.exportStart': 'Prepare export',
  'settings.ui.data.exportRunning':
    'Preparing your export. It keeps running if you close this page.',
  'settings.ui.data.exportReady': 'Export ready, prepared {date}',
  'settings.ui.data.exportDownload': 'Download export',
  'settings.ui.data.exportExpires': 'The download link expires {date}.',
  'settings.ui.data.deleteTitle': 'Delete',
  'settings.ui.data.deleteBody':
    'Choose the smallest thing that solves your problem. Each option below says what survives.',
  'settings.ui.data.deleteConnection': 'Revoke one social connection',
  'settings.ui.data.deleteConnectionHelp':
    'Removes Relay access to that account. The workspace, its content and its receipts stay.',
  'settings.ui.data.deleteProject': 'Delete a project',
  'settings.ui.data.deleteProjectHelp':
    'Removes the project, its rules and its glossary. Content published under it keeps its receipts.',
  'settings.ui.data.deleteContent': 'Delete content and media',
  'settings.ui.data.deleteContentHelp':
    'Removes drafts and stored files. It does not remove anything already published on a platform.',
  'settings.ui.data.deleteAccount': 'Close this workspace',
  'settings.ui.data.deleteAccountHelp':
    'Cancels scheduled jobs, revokes every connection, removes stored media and closes the workspace.',
  'settings.ui.data.scheduledJobsTitle': 'Scheduled work that will be canceled first',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {Nothing is scheduled right now} one {# scheduled post} other {# scheduled posts}}',
  'settings.ui.data.cancelJobsFirst': 'Cancel scheduled posts now',
  'settings.ui.data.cancelJobsDone': 'Scheduled posts canceled. Nothing will publish.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'Type the workspace name to confirm',
  'settings.ui.data.deleteConsequence.jobs':
    'Every scheduled post is canceled before anything is removed.',
  'settings.ui.data.deleteConsequence.connections':
    'Every social connection is revoked at the provider.',
  'settings.ui.data.deleteConsequence.media': 'Stored media is deleted and cannot be recovered.',
  'settings.ui.data.deleteConsequence.receipts':
    'Publication receipts are kept for the retention period stated in the Terms, then removed.',
  'settings.ui.data.deleteConsequence.published':
    'Posts already live on a platform are not deleted. Remove those on the platform.',
  'settings.ui.data.exportFirst': 'Export your data before you delete it.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'Comparta Relay con un enlace divulgado. La comisión nunca está condicionada a una revisión positiva.',
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

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'Una cuenta de servicio es una identidad con nombre para un agente, un script o un flujo de trabajo. Tiene sus propios alcances, sus propios límites y su propia pista de auditoría.',
  'developer.ui.agents.emptyTitle': 'Aún no hay cuentas de servicio',
  'developer.ui.agents.emptyBody':
    'Cree uno para cada automatización que ejecute. Cuentas separadas significa que puedes revocar una sin detener las demás.',
  'developer.ui.agents.emptyExample':
    'Ejemplo: "Agente de contenido", marca Acme EU, puede redactar y programar hasta 6 publicaciones por día entre las 07:00 y las 22:00, nunca publica inmediatamente.',
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
    'A most {count, plural, one {# publicación externa} many {# publicaciones externas} other {# publicaciones externas}} por día.',
  'developer.ui.agents.summaryApproval': 'Comportamiento de aprobación',
  'developer.ui.agents.summaryCreate': 'Crear cuenta de servicio',
  'developer.ui.agents.detailTitle': 'cuenta de servicio',
  'developer.ui.agents.statusActive': 'Activo',
  'developer.ui.agents.statusStopped': 'Detenido',
  'developer.ui.agents.statusExpired': 'Credencial caducada',
  'developer.ui.agents.stoppedBody':
    'Esta cuenta está detenida. Cada llamada que hace es rechazada por un motivo claro. Nada de lo que creó fue eliminado.',
  'developer.ui.agents.killTitle': 'Stop {name}',
  'developer.ui.agents.killConsequence.calls':
    'Todas las llamadas a API, MCP y CLI desde esta cuenta se rechazan a la vez.',
  'developer.ui.agents.killConsequence.scheduled':
    'Publica que ya está programado, permanece programado. Cancélalos del calendario si quieres que se detengan.',
  'developer.ui.agents.killConsequence.reversible': 'Puedes empezar de nuevo más tarde.',
  'developer.ui.agents.resume': 'Iniciar este agente nuevamente',
  'developer.ui.agents.rotate': 'Rotar credencial',
  'developer.ui.agents.rotateTitle': 'Rotar la credencial for {name}',
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

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
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
  'developer.ui.setup.copySnippet': 'Copiar fragmento for {client}',
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
    'La aprobación level {level} no permite esta llamada. El ensayo lo rechaza exactamente como lo haría la API.',
  'developer.ui.playground.announceResult': 'Se acabó el ensayo. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'Registre una aplicación para que otras personas puedan otorgarle acceso a su espacio de trabajo. Cada aplicación tiene su propia identidad, su propia lista de redirecciones permitidas y su propia pista de auditoría.',
  'developer.ui.apps.emptyTitle': 'No hay aplicaciones registradas',
  'developer.ui.apps.emptyBody':
    'Registre una aplicación cuando otro producto necesite actuar en nombre de un usuario Relay. Para su propia automatización, utilice una cuenta de servicio.',
  'developer.ui.apps.emptyExample':
    'Ejemplo: "Acme Publisher", cliente confidencial, redireccionamiento https://acme.example/oauth/callback, alcances cuentas: lectura y borradores: escritura.',
  'developer.ui.apps.typeHelp':
    'Un cliente confidencial se ejecuta en un servidor que usted controla y puede guardar un secreto. Un cliente público es un navegador o una aplicación de escritorio y utiliza PKCE sin ningún secreto.',
  'developer.ui.apps.redirectAdd': 'Agregar una URI de redireccionamiento',
  'developer.ui.apps.redirectRemove': 'Remove {uri}',
  'developer.ui.apps.redirectInvalid':
    'Introduzca un URI https completo sin comodines ni cadena de consulta. Debe coincidir exactamente con el valor que envía su aplicación.',
  'developer.ui.apps.linksTitle': 'Enlaces publicados',
  'developer.ui.apps.linksHelp':
    'Estos aparecen en la pantalla de consentimiento. Un usuario que no pueda comunicarse con ellos no otorgará acceso.',
  'developer.ui.apps.linkUnreachable':
    'No pudimos acceder a esta URL la última vez que verificamos, {date}.',
  'developer.ui.apps.linkReachable': 'Accesible, checked {date}',
  'developer.ui.apps.scopesTitle': 'Permisos que esta aplicación puede solicitar',
  'developer.ui.apps.scopesHelp':
    'Pide lo mínimo que necesites. Un usuario ve los permisos de lectura y los permisos consiguientes como dos grupos separados.',
  'developer.ui.apps.scopeGroup.read': 'Leer permisos',
  'developer.ui.apps.scopeGroup.reversible': 'Cambios que puedes deshacer',
  'developer.ui.apps.scopeGroup.consequential': 'Permisos consecuentes',
  'developer.ui.apps.scopeGroupHelp.read':
    'Estos permiten que la aplicación mire los datos. Nada cambia.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Estos permiten que la aplicación cree o edite cosas dentro de Relay. Nada llega a una plataforma.',
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
  'developer.ui.apps.rotateTitle': 'Rotar el secreto del cliente for {app}',
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
  'developer.ui.apps.grantsCaption':
    'Espacios de trabajo que han otorgado acceso a esta aplicación',
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
  'developer.ui.apps.rateLimitUsage': '{used} of {limit} solicitudes esta hora',
  'developer.ui.apps.disable': 'Deshabilitar aplicación',
  'developer.ui.apps.enable': 'Habilitar aplicación',
  'developer.ui.apps.disabledBody':
    'Esta aplicación está deshabilitada. Los tokens existentes se rechazan y no se puede iniciar ninguna nueva concesión. Las subvenciones se mantienen para que puedas habilitarlas nuevamente.',
  'developer.ui.apps.deleteTitle': 'Delete {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Cada subvención se revoca y cada token deja de funcionar.',
  'developer.ui.apps.deleteConsequence.logs':
    'Los registros de solicitudes se mantienen durante el período de retención de la auditoría.',
  'developer.ui.apps.deleteConsequence.irreversible':
    'La identificación del cliente no se puede reutilizar.',

  /* ---------------------------------------------------------------- webhooks */

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
    '{count, plural, one {# evento} many {# eventos} other {# eventos}}',
  'developer.ui.webhooks.eventGroup.connections': 'Conexiones',
  'developer.ui.webhooks.eventGroup.content': 'Contenido y aprobación',
  'developer.ui.webhooks.eventGroup.publishing': 'Publicación',
  'developer.ui.webhooks.eventGroup.automation': 'Automatización y feeds',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'Marcas y cuentas',
  'developer.ui.webhooks.scopeAll': 'Cada marca y cuenta',
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
  'developer.ui.webhooks.deliveryNextAttempt': 'Siguiente attempt {relativeTime}',
  'developer.ui.webhooks.inspect': 'inspeccionar la entrega',
  'developer.ui.webhooks.inspectTitle': 'Delivery {id}',
  'developer.ui.webhooks.inspectRequest': 'Cuerpo de la solicitud',
  'developer.ui.webhooks.inspectResponse': 'Cuerpo de respuesta',
  'developer.ui.webhooks.redeliver': 'Enviar esta entrega nuevamente',
  'developer.ui.webhooks.redeliverHelp':
    'La misma identificación de evento se envía nuevamente con el indicador de reenvío configurado, por lo que un receptor idempotente lo ignora de manera segura.',
  'developer.ui.webhooks.redelivered': 'En cola para reenvío.',
  'developer.ui.webhooks.failureTitle': 'Este punto final está fallando',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# entregas seguidas fallidas} many {# entregas seguidas fallidas} other {# entregas seguidas fallidas}}. After {limit} fallas consecutivas, el punto final se desactiva y se presenta un elemento de acción.',
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

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'One plan, two intervals. Polar is the merchant of record: it holds the payment method, issues invoices and handles cancellation.',
  'billing.ui.statusHeading': 'Current status',
  'billing.ui.planHeading': 'Plan',
  'billing.ui.intervalHeading': 'Billing interval',
  'billing.ui.usageHeading': 'Metered provider usage',
  'billing.ui.invoicesHeading': 'Invoices',
  'billing.ui.cancelHeading': 'Cancellation',
  'billing.ui.trialDaysRemaining':
    'Trial, {count, plural, =0 {ends today} one {# day remaining} other {# days remaining}}',
  'billing.ui.convertsOn': 'Converts on {date} to {amount} per {interval}.',
  'billing.ui.dueToday': '$0 due today',
  'billing.ui.conversionLabel': 'Converts',
  'billing.ui.channelsLabel': 'Active channels',
  'billing.ui.paymentMethodPolar': 'Payment method held by Polar',
  'billing.ui.paymentMethodDescriptor': '{project} ending {last4}, expires {expiry}',
  'billing.ui.paymentMethodMissing': 'No payment method on file yet',
  'billing.ui.cancelBeforeDate': 'Cancel before {date} and you will not be charged.',
  'billing.ui.annualFraming': '$25/month billed annually. Save $48/year.',
  'billing.ui.monthlyOption': '$29 per month',
  'billing.ui.annualOption': '$300 per year',
  'billing.ui.intervalChangeHelp':
    'Changing the interval takes effect at the next renewal. Polar prorates it and shows the exact amount before you confirm.',
  'billing.ui.intervalChangedAnnouncement': 'Billing interval set to {interval}.',
  'billing.ui.allowanceChannels':
    '30 active social channels. A channel is one connected account, page or channel.',
  'billing.ui.allowanceChannelsUsage': '{used} of {limit} active channels',
  'billing.ui.allowanceFairUse':
    'Fair use means anti spam, rate and provider cost controls. They apply the same way to every subscriber and are published, not discretionary.',
  'billing.ui.allowanceMetered':
    'X and some other providers charge per operation. Those charges are passed through at cost and are not part of the plan price.',
  'billing.ui.allowanceNoMedia':
    'Image generation and video generation are not included and are not sold. Relay does not generate media.',
  'billing.ui.readFairUse': 'Read the fair use policy',
  'billing.ui.readMeteredPolicy': 'Read how metered usage is billed',
  'billing.ui.usageCaption': 'Metered provider usage this period, billed at cost',
  'billing.ui.usageColumn.item': 'Item',
  'billing.ui.usageColumn.quantity': 'Quantity',
  'billing.ui.usageColumn.unitPrice': 'Unit price',
  'billing.ui.usageColumn.amount': 'Amount',
  'billing.ui.usageTotal': 'Total this period',
  'billing.ui.usagePeriod': 'Period {start} to {end}',
  'billing.ui.usageSource': 'Prices published by the provider. Verified {date}.',
  'billing.ui.usageReconciled': 'Reconciled against the provider invoice on {date}.',
  'billing.ui.usagePending': 'Not reconciled yet. The final amount can move slightly.',
  'billing.ui.usageUnavailableReason':
    'The provider has not returned usage for this period yet. It is normally available within 24 hours.',
  'billing.ui.usageEmpty': 'No metered usage this period.',
  'billing.ui.spendAlert': 'Spend alert',
  'billing.ui.spendAlertHelp':
    'We email you when metered usage passes this amount in a billing period.',
  'billing.ui.spendAlertPause': 'Also pause metered actions when the alert is reached',
  'billing.ui.balanceLabel': 'Usage balance',
  'billing.ui.balanceHelp': 'Metered usage is drawn from this balance and invoiced by Polar.',
  'billing.ui.invoicesCaption': 'Invoices issued by Polar',
  'billing.ui.invoiceColumn.date': 'Date',
  'billing.ui.invoiceColumn.description': 'Description',
  'billing.ui.invoiceColumn.amount': 'Amount',
  'billing.ui.invoiceColumn.state': 'State',
  'billing.ui.invoiceState.paid': 'Paid',
  'billing.ui.invoiceState.open': 'Open',
  'billing.ui.invoiceState.uncollectible': 'Not collected',
  'billing.ui.invoiceState.refunded': 'Refunded',
  'billing.ui.invoicesEmpty': 'No invoice yet. The first one is issued when the trial converts.',
  'billing.ui.invoicesInPortal': 'Every invoice and receipt is available in the Polar portal.',
  'billing.ui.portalHelp':
    'The portal is where you change the payment method, download invoices and cancel. It opens in a new tab.',
  'billing.ui.pastDueHeading': 'Payment overdue',
  'billing.ui.pastDueBody':
    'The last payment did not go through. Update the payment method in the Polar portal to keep publishing.',
  'billing.ui.gracePolicy':
    'Scheduled posts keep running until {date}. After that the workspace becomes read only: nothing is deleted and nothing is published.',
  'billing.ui.cancelBody':
    'Cancelling is one action and takes effect at the end of the period you have paid for. There is no call to make and no form to fill in.',
  'billing.ui.cancelStart': 'Cancel subscription',
  'billing.ui.cancelDialogTitle': 'Cancel this subscription',
  'billing.ui.cancelConsequence.noCharge':
    'You will not be charged. Nothing is taken today or on {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'You keep every feature until {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Drafts, receipts, media and analytics stay in this workspace.',
  'billing.ui.cancelConsequence.scheduled':
    'Posts scheduled after {date} will not publish. Cancel or reschedule them before then.',
  'billing.ui.cancelConsequence.restart': 'You can start the subscription again at any time.',
  'billing.ui.cancelConfirm': 'Cancel subscription',
  'billing.ui.cancelKeep': 'Keep subscription',
  'billing.ui.cancelConfirmedBeforeConversion': 'Canceled. You will not be charged.',
  'billing.ui.cancelConfirmedAfterConversion': 'Canceled. Access continues until {date}.',
  'billing.ui.cancelAnnouncement': 'Subscription canceled.',
  'billing.ui.canceledNotice': 'This subscription is canceled.',
  'billing.ui.resume': 'Start the subscription again',
  'billing.ui.noSubscriptionTitle': 'No subscription on this workspace',
  'billing.ui.noSubscriptionBody':
    'Start the seven day trial to publish. Polar collects a payment method and charges nothing today.',
  'billing.ui.noSubscriptionExample':
    'Monthly is $29. Annual is $300, which is $25/month billed annually. Save $48/year.',
  'billing.ui.overChannelLimitAction': 'Review connected channels',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'Responda una breve entrada, confirme lo que entendimos y obtenga un plan que pueda aceptar artículo por artículo. Propone trabajo. Nunca programa ni publica nada por sí solo.',
  'growth.ui.step.intake': 'ingesta',
  'growth.ui.step.confirm': 'Confirmar',
  'growth.ui.step.plan': 'Planificar',
  'growth.ui.stepIndicator': 'Step {current} of {total}: {name}',
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
    'Una actualización crea version {version} y deja intacta la versión aprobada.',
  'growth.ui.plan.emptyTitle': 'Aún no hay ningún plan',
  'growth.ui.plan.emptyBody':
    'Complete el perfil comercial y construiremos un plan a partir de los datos que confirme.',
  'growth.ui.plan.emptyExample':
    'Un plan contiene una estrategia, cuatro semanas de resúmenes, una campaña UGC, oportunidades respaldadas por catálogo y hasta cinco herramientas.',
  'growth.ui.plan.tabsLabel': 'Secciones del plan',
  'growth.ui.plan.modelNote': 'Generado by {model}, prompt {promptVersion}, on {date}.',

  'growth.ui.strategy.snapshotTitle': 'Instantánea empresarial',
  'growth.ui.strategy.channelPriority': 'Priority {rank}',
  'growth.ui.strategy.channelFormats': 'Formatos nativos',
  'growth.ui.strategy.pillarProof': 'Prueba en la que se apoya este pilar',
  'growth.ui.strategy.pillarProofNone':
    'No hay pruebas aprobadas. Mantenga este pilar descriptivo.',
  'growth.ui.strategy.cadenceCaption': 'Publicaciones por semana por canal',
  'growth.ui.strategy.cadenceColumn.channel': 'canal',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Publicaciones por semana',
  'growth.ui.strategy.cadenceTotal': 'Total por semana',
  'growth.ui.strategy.capacityWarning':
    'Esta cadencia is {planned} publica por semana frente a una capacidad establecida de of {capacity} horas. Reducirlo o aumentar la capacidad en el perfil.',
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
  'growth.ui.fourWeek.acceptedCount': '{accepted} of {total} escritos aceptados como borradores',
  'growth.ui.fourWeek.acceptAnnouncement': 'Borrador creado a partir de este informe.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Propuesta de calendario agregada for {date}.',

  'growth.ui.ugc.promptAngle': 'Angle {number}',
  'growth.ui.ugc.checklistTitle': 'Rights, consent and disclosure',
  'growth.ui.ugc.checklistHelp':
    'Work through this with each participant before anything is published. Consent to appear is not consent to advertise.',
  'growth.ui.ugc.incentiveNone': 'No incentive offered',
  'growth.ui.ugc.incentiveDisclosure':
    'An incentive must be disclosed on every post that results from it, by you and by the participant.',
  'growth.ui.ugc.honesty':
    'This plans a campaign you run with real people. Relay does not find creators, contact them, write testimonials or create customer content.',

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
  'growth.ui.opportunities.prepareTitle': 'Preparar una presentación for {name}',
  'growth.ui.opportunities.prepareRules': 'Sus reglas, citadas',
  'growth.ui.opportunities.prepareChecklist': 'que tener listo',
  'growth.ui.opportunities.prepareManual':
    'Envíe esto usted mismo en su sitio. Relay no completa formularios, no crea cuentas ni envía correos electrónicos a nadie.',
  'growth.ui.opportunities.pitchTitle': 'Borrador de tono',
  'growth.ui.opportunities.pitchHelp':
    'Edítalo antes de enviarlo. Utiliza sólo los hechos que usted confirmó.',
  'growth.ui.opportunities.submittedOn': 'Submitted {date}',
  'growth.ui.opportunities.staleTitle': 'Algunas entradas necesitan volver a verificarse',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# entrada ya pasó su fecha de revisión} many {# entradas ya pasó su fecha de revisión} other {# entradas ya pasó su fecha de revisión}}. Consulte las reglas actuales en el sitio antes de confiar en ellas.',
  'growth.ui.opportunities.emptyExample':
    'Una fila del catálogo contiene la URL oficial, la audiencia, las reglas de envío citadas en el sitio, el costo, el esfuerzo y la fecha en que una persona lo revisó por última vez.',

  'growth.ui.tools.shown': '{shown} of {max} mostrado',
  'growth.ui.tools.fewerThanMax':
    'Only {count, plural, one {# coincidencias de herramientas} many {# coincidencias de herramientas} other {# coincidencias de herramientas}} este flujo de trabajo con una revisión actual. Preferiríamos mostrar menos que rellenar la lista.',
  'growth.ui.tools.emptyTitle':
    'Ninguna herramienta revisada se adapta a este flujo de trabajo todavía',
  'growth.ui.tools.emptyBody':
    'Cada entrada necesita un precio verificado, términos de derechos verificados y una limitación nombrada antes de aparecer aquí.',
  'growth.ui.tools.emptyExample':
    'Una entrada dice para qué es mejor, por qué se ajusta a su plan, qué no puede hacer, las habilidades que necesita, cómo regresa la producción a Relay y cuándo se verificó el precio por última vez.',
  'growth.ui.tools.openSite': 'Abrir el sitio oficial for {name}',
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
    'Los tres formatos provienen de un esquema validado, version {version}. Las vistas estructuradas son seguras para el control de fuentes y no contienen secretos.',
  'growth.ui.export.previewLabel': 'Vista previa de exportación',
} as const;
