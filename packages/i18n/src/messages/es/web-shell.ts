/**
 * The web application shell: Home, the command palette, the Action center
 * queue chrome, the demo data notice, and the parts of sign in and onboarding
 * that the shared `auth`, `onboarding` and `billing` catalogs do not cover.
 *
 * Owned by the web shell. Screen catalogs (composer, calendar, analytics)
 * belong to their own files.
 */
export const webShellMessages = {
  /* -- Document and shell chrome ----------------------------------------- */
  'shell.appName': 'Post Array',
  'shell.documentTitle': '{page} · Post Array',
  'shell.tagline': 'Una mesa de publicación para personas y agentes.',
  'shell.menu.open': 'abre el menú',
  'shell.menu.title': 'Menú',
  'shell.nav.more': 'Más',
  'shell.help.title': 'Ayuda',
  'shell.help.documentation': 'Documentación',
  'shell.help.keyboardShortcuts': 'Atajos de teclado',
  'shell.help.platformStatus': 'Estado de la plataforma',
  'shell.help.whatChanged': 'que cambio',
  'shell.help.contactSupport': 'Contactar con soporte',
  'shell.account.settings': 'Configuración',
  'shell.account.profile': 'Tu perfil',
  'shell.workspace.create': 'Crear un espacio de trabajo',
  'shell.workspace.manage': 'Workspace ajustes',
  'shell.workspace.role': 'Tú are {role} aquí',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Datos de demostración',
  'shell.demo.title': 'Estás viendo datos de demostración.',
  'shell.demo.body':
    'No se puede acceder a la API Post Array desde este navegador, por lo que las pantallas están llenas de un espacio de trabajo de ejemplo inicializado. Nada aquí está conectado a una cuenta real y nada se puede publicar.',
  'shell.demo.howToConnect':
    'Configure NEXT_PUBLIC_RELAY_API_URL y reinicie la aplicación para usar datos en vivo.',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Estás desconectado',
  'shell.offline.body':
    'Los borradores se guardan en este dispositivo. La programación y publicación se reanudan cuando se restablece la conexión.',
  'shell.offline.retry': 'Verifique la conexión',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Abrir la paleta de comandos',
  'palette.title': 'paleta de comandos',
  'palette.description': 'Busca una pantalla, una cuenta o una acción.',
  'palette.placeholder': 'Escriba un comando o un nombre de pantalla',
  'palette.empty': 'Nada matches {query}.',
  'palette.group.actions': 'Acciones',
  'palette.group.goTo': 'Ir a',
  'palette.group.workspaces': 'Espacios de trabajo',
  'palette.group.settings': 'Configuración',
  'palette.hint.navigate': 'Muévete con las teclas de flecha',
  'palette.hint.select': 'Abrir con Enter',
  'palette.hint.close': 'Cerrar con escape',
  'palette.action.compose': 'Redactar una publicación',
  'palette.action.connectAccount': 'Conectar una cuenta',
  'palette.action.openActionCenter': 'Abrir el centro de acción',
  'palette.action.uploadMedia': 'Subir medios',
  'palette.action.createRule': 'Crear una regla de automatización',
  'palette.action.toggleTheme': 'Cambiar el tema',
  'palette.action.signOut': 'Cerrar sesión',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Abrir el centro de acción',
  'actionCenter.group.now.label': 'ahora',
  'actionCenter.group.soon.label': 'pronto',
  'actionCenter.group.watching.label': 'mirando',
  'actionCenter.group.now.hint': 'La publicación está en riesgo hasta que se gestionen.',
  'actionCenter.group.soon.hint': 'Estos tienen una fecha límite que aún puedes cumplir.',
  'actionCenter.group.watching.hint': 'No urgente. Vale la pena echarle un vistazo esta semana.',
  'actionCenter.severity.now': 'te necesita ahora',
  'actionCenter.severity.soon': 'te necesita pronto',
  'actionCenter.severity.watching': 'mirando',
  'actionCenter.filter.all': 'Todos',
  'actionCenter.filter.connections': 'Conexiones',
  'actionCenter.filter.publishing': 'Publicación',
  'actionCenter.filter.automation': 'Automatización',
  'actionCenter.filter.billing': 'Facturación',
  'actionCenter.snoozed': 'pospuesto',
  'actionCenter.snoozeOneDay': 'Dormir por un día',
  'actionCenter.snoozedUntil': 'Pospuesto until {date}',
  'actionCenter.unsnooze': 'trae esto de vuelta',
  'actionCenter.resolved': 'Resolved {relativeTime}',
  'actionCenter.emptyFiltered': 'Nada en este grupo necesita atención.',
  'actionCenter.errorTitle': 'El centro de actividades no se pudo cargar.',
  'actionCenter.loading': 'Cargando lo que necesita atención',
  'actionCenter.affectedAccount': 'Affects {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Nada necesita atención} one {# elemento} many {# elementos} other {# elementos}}',
  'actionCenter.action.reconnect': 'Reconectar',
  'actionCenter.action.openReceipt': 'abrir el recibo',
  'actionCenter.action.review': 'Revisión',
  'actionCenter.action.openDraft': 'Abrir el borrador',
  'actionCenter.action.openCalendar': 'Abre el calendario',
  'actionCenter.action.viewStatus': 'Ver estado',
  'actionCenter.action.checkFeed': 'Comprueba el feed',
  'actionCenter.action.inspectDeliveries': 'Inspeccionar entregas',
  'actionCenter.action.addBalance': 'Revisar el uso',
  'actionCenter.action.fixConnection': 'Arreglar la conexión',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Inicio',
  'home.subtitle': 'Lo que te necesita hoy y lo que saldrá a continuación.',
  'home.greetingSummary':
    '{actions, plural, =0 {Nada te necesita en este momento} one {# artículo te necesita} many {# artículos te necesitan} other {# artículos te necesitan}}. {upcoming, plural, =0 {No hay nada programado en las próximas 24 horas} one {# publicación sale en las próximas 24 horas} many {# publicaciones sale en las próximas 24 horas} other {# publicaciones sale en las próximas 24 horas}}.',
  'home.needsYou.title': 'te necesita ahora',
  'home.needsYou.empty': 'Nada te necesita ahora mismo.',
  'home.needsYou.emptyBody':
    'El estado de la conexión, las aprobaciones y las publicaciones fallidas aparecen aquí en el momento en que ocurren.',
  'home.needsYou.viewAll': 'Abrir el centro de acción',
  'home.needsYou.emptyQuiet':
    'Disfruta de la calma: todo lo que necesite una decisión aparecerá aquí en el momento en que ocurra.',
  'home.upcoming.title': 'Próximas 24 horas',
  'home.upcoming.empty': 'No hay nada programado en las próximas 24 horas.',
  'home.upcoming.emptyBody':
    'Escribe una publicación y elige una hora. Puedes cambiarlo más tarde.',
  'home.upcoming.viewAll': 'Abre el calendario',
  'home.upcoming.timeZoneNote':
    'Los tiempos se muestran in {timeZone}, la zona del espacio de trabajo.',
  'home.upcoming.columnTime': 'tiempo',
  'home.upcoming.columnAccount': 'cuenta',
  'home.upcoming.columnContent': 'Contenido',
  'home.upcoming.columnStatus': 'Estado',
  'home.receipts.title': 'Recibos recientes',
  'home.receipts.empty': 'Aún no se han publicado publicaciones desde este espacio de trabajo.',
  'home.receipts.emptyBody':
    'Cada publicación produce un recibo que puede inspeccionar y compartir.',
  'home.receipts.viewAll': 'Todos los recibos',
  'home.receipts.publishedTo': 'Publicado to {account}',
  'home.connections.title': 'Estado de la conexión',
  'home.connections.summary':
    '{healthy, plural, one {# cuenta está funcionando} many {# cuentas están funcionando} other {# cuentas están funcionando}}. {attention, plural, =0 {Ninguno necesita atención} one {# necesita atención} many {# necesita atención} other {# necesita atención}}.',
  'home.connections.viewAll': 'Todas las conexiones',
  'home.connections.empty': 'Aún no hay cuentas conectadas.',
  'home.advisor.title': 'Asesor de crecimiento',
  'home.advisor.summary':
    'El plan version {version} era approved {date}. Week {week} of {total} has {briefs, plural, one {# escrito aún no redactado} many {# escritos aún no redactado} other {# escritos aún no redactado}}.',
  'home.advisor.noPlan':
    'El asesor elabora un plan a partir de los hechos que usted confirma. Propone trabajos y nunca publica solo.',
  'home.advisor.openPlan': 'abre el plano',
  'home.advisor.createDrafts': 'Crear borradores desde week {week}',
  'home.advisor.start': 'Iniciar el perfil empresarial',
  'home.trial.banner':
    'Prueba, {days, plural, =0 {termina hoy} one {# días restantes} many {# días restantes} other {# días restantes}}. Converts {date} to {amount}.',
  'home.trial.manage': 'Gestionar o cancelar',
  'home.error.title': 'Inicio no se pudo cargar',
  'home.error.body':
    'Tu espacio de trabajo está intacto. Este es un problema al alcanzar la API Post Array.',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title': 'Publique a través de API oficiales y vea exactamente qué sucedió.',
  'auth.aside.point.receipts':
    'Cada publicación produce un recibo: quién la aprobó, cuándo se envió, qué devolvió la plataforma.',
  'auth.aside.point.approvals':
    'Nada llega a una plataforma sin la aprobación que requiere su póliza.',
  'auth.aside.point.surfaces':
    'El mismo flujo de trabajo desde la aplicación web, la API REST, MCP, la CLI y los webhooks.',
  'auth.provider.title': 'Antes de continuar',
  'auth.provider.google.access':
    'Google comparte su nombre, dirección de correo electrónico y foto de perfil con Post Array. Post Array no puede leer Gmail, Drive o Calendar.',
  'auth.provider.facebook.access':
    'Facebook comparte tu nombre, dirección de correo electrónico y foto de perfil con Post Array. Conectar una página para publicar es un paso independiente que apruebas más adelante.',
  'auth.provider.note': 'Esto inicia sesión. No conecta una cuenta para publicar.',
  'auth.continueWithEmail': 'Continuar con el correo electrónico',
  'auth.method.password': 'Contraseña',
  'auth.method.magicLink': 'Enlace de correo electrónico',
  'auth.method.username': 'Nombre de usuario',
  'auth.method.chooseLabel': '¿Cómo quieres iniciar sesión?',
  'auth.username.placeholder': 'tu-nombre de usuario',
  'auth.username.aliasNote':
    'Un nombre de usuario es un alias de la dirección de correo electrónico de su cuenta. La contraseña es la misma.',
  'auth.password.placeholder': 'Tu contraseña',
  'auth.submit.signIn': 'Iniciar sesión',
  'auth.submit.signUp': 'Crear cuenta',
  'auth.submit.working': 'comprobando',
  'auth.failure.credentials':
    'Esa dirección de correo electrónico y contraseña no coinciden con una cuenta. Verifique ambos y vuelva a intentarlo.',
  'auth.failure.usernameCredentials':
    'Ese nombre de usuario y contraseña no coinciden con una cuenta. Verifique ambos y vuelva a intentarlo.',
  'auth.failure.noAccountLeak': 'Por su seguridad, no decimos si una dirección está registrada.',
  'auth.failure.provider':
    'El inicio de sesión en with {provider} no se completó. No se cambió nada.',
  'auth.failure.network': 'No pudimos llegar a Post Array. Comprueba tu conexión y vuelve a intentarlo.',
  'auth.signUp.emailInUseNote':
    'Si esta dirección ya tiene una cuenta, le enviamos por correo electrónico un enlace de inicio de sesión en lugar de crear una segunda.',
  'auth.legal.readTerms': 'Lea los términos',
  'auth.legal.readPrivacy': 'Lea el Aviso de Privacidad',
  'auth.switchToSignUp': 'Crea una cuenta',
  'auth.switchToSignIn': 'Inicia sesión en su lugar',
  'auth.checkEmail.body': 'Enviamos un enlace de inicio de sesión to {email}. Funciona una vez.',
  'auth.checkEmail.wrongAddress': 'Utilice una dirección diferente',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Facturación',
  'onboarding.stepName.workspace': 'Workspace',
  'onboarding.stepName.role': 'Caso de uso',
  'onboarding.stepName.connect': 'Conectar',
  'onboarding.stepName.compose': 'Primera publicación',
  'onboarding.stepName.receipt': 'Confirmación',
  'onboarding.stepList': 'Pasos de configuración',
  'onboarding.stepComplete': 'hecho',
  'onboarding.stepCurrent': 'Paso actual',
  'onboarding.exit': 'Terminar más tarde',
  'onboarding.plan.intervalMonthlyLabel': '$29 por mes',
  'onboarding.plan.intervalAnnualLabel': '$300 por año',
  'onboarding.plan.checkoutHint':
    'La siguiente pantalla es Polar, nuestro comerciante registrado. El acceso se concede cuando Polar confirma la suscripción, no cuando vuelve el navegador.',
  'onboarding.plan.factsTitle': '¿Qué pasa cuando continúas?',
  'onboarding.workspace.help':
    'Un espacio de trabajo contiene sus proyectos, cuentas conectadas, borradores y recibos. Puede crear más más adelante.',
  'onboarding.workspace.localeNote':
    'El idioma de su interfaz cambia esta aplicación. Los idiomas del contenido se eligen por publicación y son independientes de esta configuración.',
  'onboarding.workspace.timeZoneDetected': 'Detectado desde este dispositivo: {timeZone}',
  'onboarding.connect.permissionsTitle': 'Se solicitará What {provider}',
  'onboarding.connect.permissionsFooter':
    'Post Array nunca pide un permiso que no utiliza y puedes desconectarte en cualquier momento.',
  'onboarding.connect.chooseProvider': 'Elige una plataforma',
  'onboarding.connect.opensProvider': 'Continuando opens {provider} en esta pestaña.',
  'onboarding.compose.help':
    'Escribe la publicación, luego verifica la vista previa y la validación antes de elegir una hora.',
  'onboarding.compose.openComposer': 'Abrir el compositor completo',
  'onboarding.receipt.title': 'Tu primera publicación está programada.',
  'onboarding.receipt.body':
    'Aquí está el récord hasta el momento. Sigue actualizándose durante el envío, la respuesta del proveedor y la primera sincronización analítica.',
  'onboarding.receipt.goHome': 'Ir a casa',
  'onboarding.blocked.title': 'Este paso necesita del anterior.',
  'onboarding.blocked.body': 'Finish {step} primero. Nada de lo que ingresaste se pierde.',
} as const;
