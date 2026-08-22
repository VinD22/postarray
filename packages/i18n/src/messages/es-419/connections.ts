/** Spanish (Latin America) beta catalog. B5 legal, billing and consent messages deliberately use English fallback. */
export const connectionMessages = {
  'connection.title': 'Conexiones',
  'connection.subtitle':
    'Las cuentas, páginas y canales en los que este espacio de trabajo puede publicar.',
  'connection.add': 'Conectar una cuenta',
  'connection.count':
    '{used, plural, one {#canal activo} other {#canales activos} many {#canales activos}}de {limit}',
  'connection.limitReached':
    'Este espacio de trabajo está utilizando todos {limit}canales. Desconecte uno antes de conectar otro.',
  'connection.account.label': 'cuenta',
  'connection.account.type.profile': 'Perfil',
  'connection.account.type.page': 'Página',
  'connection.account.type.channel': 'canal',
  'connection.account.type.group': 'grupo',
  'connection.account.type.organization': 'Organización',
  'connection.account.type.business': 'cuenta comercial',
  'connection.account.type.creator': 'Cuenta de creador',
  'connection.connectedBy': 'Conectado por {name}en {date}',
  'connection.lastPublished': 'Último publicado {relativeTime}',
  'connection.lastPublishedNever': 'Aún no hay nada publicado desde esta cuenta.',
  'connection.lastAnalyticsSync': 'Análisis sincronizados {relativeTime}',
  'connection.status.healthy': 'trabajando',
  'connection.status.expiringSoon': 'Vence {relativeTime}',
  'connection.status.expired': 'Acceso caducado',
  'connection.status.revoked': 'Acceso revocado',
  'connection.status.paused': 'En pausa',
  'connection.status.permissionMissing': 'Permiso faltante',
  'connection.status.reviewPending': 'Esperando revisión de la plataforma',
  'connection.status.unknown': 'Salud no disponible',
  'connection.token.expiresAt': 'El acceso caduca {date}',
  'connection.token.expiryUnknown': '{provider}no nos dice cuándo caduca este acceso.',
  'connection.permissions.title': 'Permisos',
  'connection.permissions.granted': 'Concedido',
  'connection.permissions.missing': 'No concedido',
  'connection.permissions.explainBeforeOAuth':
    'Relay preguntará {provider}para estos permisos. Puedes desconectarte en cualquier momento.',
  'connection.permissions.whyNeeded': '¿Por qué es necesario esto?',
  'connection.reconnect.title': 'Reconectar {account}',
  'connection.reconnect.body':
    'Las publicaciones programadas para esta cuenta están en espera hasta que se vuelva a conectar. No se pierde nada.',
  'connection.disconnect.title': 'Desconectar {account}?',
  'connection.disconnect.body':
    'Las publicaciones programadas para esta cuenta no se publicarán. Los recibos y análisis ya recopilados permanecen en este espacio de trabajo.',
  'connection.pause.body':
    'Una cuenta pausada mantiene su historial y su programación, pero no se publica hasta que la reanudas.',
  'connection.incident.invalidToken':
    '{provider}rechazó el acceso almacenado para {account}. Vuelva a conectarse para restaurar la publicación.',
  'connection.incident.permissionLost':
    '{account}ya no otorga {permission}. Vuelva a conectarse y acepte ese permiso.',
  'connection.incident.roleLost':
    'tu {provider}El usuario ya no tiene un rol en {account}. Pídale a un administrador de esa página que la restaure.',
  'connection.incident.accountTypeInvalid':
    'Instagram necesita una cuenta profesional. Cambiar {account}a una cuenta comercial o de creador y luego vuelva a conectarse.',
  'connection.incident.reviewRestricted':
    '{provider}ha restringido esta aplicación pendiente de revisión. Publicaciones de {account}publicar de forma privada hasta que se complete la revisión.',
  'connection.group.title': 'Grupos de clientes',
  'connection.group.description':
    'Agrupa cuentas por cliente o proyecto para filtrar cada pantalla.',
  'connection.group.assign': 'Mover al grupo',
  'connection.group.none': 'Desagrupados',
  'connection.group.moveNote':
    'Al mover una cuenta se conservan sus publicaciones, recibos y análisis.',
  'connection.oauth.starting': 'Apertura {provider}',
  'connection.oauth.returned': 'Terminando la conexión',
  'connection.oauth.chooseAccounts': 'Elige qué cuentas conectar',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'No hay cuentas sobre esto {provider}El inicio de sesión se puede conectar. {reason}',
  'connection.oauth.canceled': 'La conexión fue cancelada el {provider}. Nada cambió.',
  'connection.oauth.alreadyConnected': '{account}ya está conectado a este espacio de trabajo.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account}está conectado a otro espacio de trabajo. Desconéctelo allí primero.',
  'capability.title': 'Qué admite esta cuenta',
  'capability.matrix.title': 'Capacidades de la plataforma',
  'capability.matrix.subtitle':
    'Generado a partir de las definiciones de conectores que mantenemos y revisamos manualmente.',
  'capability.level.supported': 'Apoyado',
  'capability.level.unsupported': 'No ofrecido por la plataforma.',
  'capability.level.not_implemented': 'Aún no construido',
  'capability.level.requires_review': 'Necesita revisión de plataforma',
  'capability.level.beta': 'Beta',
  'capability.level.unknown': 'No disponible',
  'capability.explain.supported': 'Relay puede hacer esto para esta cuenta hoy.',
  'capability.explain.unsupported':
    '{provider}no ofrece esto a través de su API oficial, por lo que ninguna herramienta puede hacerlo de forma segura.',
  'capability.explain.not_implemented':
    '{provider}ofrece esto, pero Relay aún no lo ha creado. Está en la hoja de ruta del conector.',
  'capability.explain.requires_review':
    '{provider}otorga esto solo después de revisar la aplicación o la cuenta. Permanece no disponible hasta que se apruebe esa revisión.',
  'capability.explain.beta':
    'Esto funciona, con límites que no hemos terminado de verificar. Verifique el resultado antes de confiar en él.',
  'capability.explain.unknown':
    'No pudimos leer los permisos actuales para esta cuenta. Vuelva a conectarse para actualizarlos.',
  'capability.lastChecked': 'Comprobado {relativeTime}',
  'capability.feature.text': 'Publicaciones de texto',
  'capability.feature.image': 'Imágenes',
  'capability.feature.carousel': 'Carruseles',
  'capability.feature.video': 'Vídeo',
  'capability.feature.document': 'Documentos',
  'capability.feature.firstComment': 'Primer comentario programado',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'menciones nativas',
  'capability.feature.destinations': 'Selección de destino',
  'capability.feature.thumbnail': 'Miniatura personalizada',
  'capability.feature.altText': 'Texto alternativo',
  'capability.feature.analytics': 'Analítica',
  'capability.feature.delete': 'Eliminar una publicación publicada',
  'capability.feature.commentCount': 'El comentario cuenta',
  'capability.feature.commentReplies': 'Leer y responder comentarios',
  'capability.feature.disclosure': 'Divulgación de automatización',
} as const;
