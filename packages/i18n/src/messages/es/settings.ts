/** Workspace settings: members, roles, projects, localization, security, data. */
export const settingsMessages = {
  'settings.title': 'Configuración',
  'settings.saved': 'Guardado',
  'settings.unsavedChanges': 'Tienes cambios sin guardar.',

  'settings.workspace.title': 'Workspace',
  'settings.workspace.name': 'Workspace nombre',
  'settings.workspace.defaultTimeZone': 'Zona horaria predeterminada',
  'settings.workspace.defaultLocale': 'Idioma de interfaz predeterminado',
  'settings.workspace.defaultContentLocale': 'Idioma de contenido predeterminado',
  'settings.workspace.transferOwnership': 'Transferir propiedad',
  'settings.workspace.delete': 'Eliminar espacio de trabajo',
  'settings.workspace.deleteWarning':
    'Eliminar un espacio de trabajo cancela las publicaciones programadas, revoca conexiones y elimina los medios almacenados. Los recibos se conservan durante el período de retención establecido en los Términos.',

  'settings.members.title': 'Miembros y roles',
  'settings.members.invite': 'invitar gente',
  'settings.members.inviteEmail': 'Dirección de correo electrónico',
  'settings.members.inviteSent': 'Invitación enviada to {email}.',
  'settings.members.pending': 'Invitado, aún no aceptado',
  'settings.members.count': '{count, plural, one {# miembro} many {# miembros} other {# miembros}}',
  'settings.members.removeConfirm':
    'Remove {name} de este espacio de trabajo? Sus acciones pasadas permanecen en el registro de auditoría.',
  'settings.role.owner.label': 'propietario',
  'settings.role.admin.label': 'administrador',
  'settings.role.manager.label': 'Gerente',
  'settings.role.editor.label': 'Redactor',
  'settings.role.approver.label': 'Aprobador',
  'settings.role.analyst.label': 'analista',
  'settings.role.viewer.label': 'Visor',
  'settings.role.owner.description': 'Todo, incluida facturación, seguridad y eliminación.',
  'settings.role.admin.description':
    'Todo excepto facturación y eliminación del espacio de trabajo.',
  'settings.role.manager.description': 'Gestiona marcas, conexiones, horarios y reglas.',
  'settings.role.editor.description': 'Crea y edita contenido, solicita aprobación.',
  'settings.role.approver.description':
    'Aprobar o rechazar contenidos y programar lo que se aprueba.',
  'settings.role.analyst.description': 'Leer análisis y recibos.',
  'settings.role.viewer.description': 'Sólo lectura.',
  'settings.role.scopeLabel': 'Límite a marcas y cuentas',
  'settings.role.mfaRequired': 'Los propietarios deben utilizar autenticación de dos factores.',

  'settings.projects.title': 'Marcas',
  'settings.projects.add': 'Agregar una marca',
  'settings.projects.voice': 'Voz',
  'settings.projects.audience': 'Audiencia',
  'settings.projects.approvedClaims': 'Reclamaciones aprobadas',
  'settings.projects.blockedTerms': 'Términos bloqueados',
  'settings.projects.disclosureDefaults': 'Valores predeterminados de divulgación',
  'settings.projects.domains': 'Dominios',
  'settings.projects.glossary.title': 'Glosario',
  'settings.projects.glossary.term': 'Término',
  'settings.projects.glossary.preferred': 'Traducción preferida',
  'settings.projects.glossary.prohibited': 'No traducir como',
  'settings.projects.glossary.context': 'Contexto',
  'settings.projects.glossary.keepUntranslated': 'Mantener sin traducir',
  'settings.projects.localeRules.title': 'Reglas locales',
  'settings.projects.localeRules.formality': 'Formalidad',
  'settings.projects.localeRules.pronouns': 'Pronombres y honoríficos',
  'settings.projects.localeRules.idioms': 'Modismos a evitar',
  'settings.projects.localeRules.emoji': 'Normas de emojis y hashtags',
  'settings.projects.localeRules.legal': 'Divulgaciones legales regionales',
  'settings.projects.localeRules.cta': 'Llamado a la acción por mercado',
  'settings.projects.localeRules.reviewedExamples': 'Ejemplos aprobados por un revisor nativo',

  'settings.sets.title': 'Conjuntos',
  'settings.sets.description':
    'Un grupo reutilizable de objetivos, variantes, configuraciones, comentarios y retrasos. La aplicación de un conjunto crea un borrador independiente.',
  'settings.sets.editNote':
    'Editar un conjunto no cambia las publicaciones que ya están aprobadas o programadas.',
  'settings.signatures.title': 'Firmas',
  'settings.signatures.description':
    'Texto de cierre, hashtags, enlaces o divulgaciones, definidos por marca, plataforma e idioma.',
  'settings.signatures.autoApply': 'Agregar automáticamente cuando el contexto coincida',

  'settings.localization.title': 'Localización',
  'settings.localization.interfaceLocale': 'Idioma de la interfaz',
  'settings.localization.interfaceLocaleHelp':
    'El idioma de esta aplicación para ti. No cambia el idioma de tus publicaciones.',
  'settings.localization.contentLocales': 'Idiomas del contenido',
  'settings.localization.contentLocalesHelp':
    'Los idiomas en los que publicas. Cada marca puede establecer reglas y un glosario por idioma.',
  'settings.localization.marketLocales': 'Mercados de audiencia',
  'settings.localization.beta': 'Traducción beta',
  'settings.localization.betaHelp':
    'Este lenguaje es asistido por una máquina y aún no ha sido revisado completamente por una persona. El texto no traducido vuelve al inglés.',
  'settings.localization.humanReviewed': 'Revisado por un hablante nativo.',
  'settings.localization.timeZone': 'Zona horaria',
  'settings.localization.weekStart': 'Primer día de la semana',
  'settings.localization.hourCycle.label': 'Formato de hora',
  'settings.localization.hourCycle.h12': '12 horas',
  'settings.localization.hourCycle.h23': '24 horas',

  'settings.notifications.title': 'Notificaciones',
  'settings.notifications.email': 'Correo electrónico',
  'settings.notifications.inApp': 'En la aplicación',
  'settings.notifications.approvalRequests': 'Solicitudes de aprobación',
  'settings.notifications.publishResults': 'Publicar resultados',
  'settings.notifications.connectionHealth': 'Estado de la conexión',
  'settings.notifications.ruleFailures': 'Fallos de automatización',
  'settings.notifications.weeklySummary': 'Resumen semanal',
  'settings.notifications.digestOnly': 'Agrúpelos en un mensaje diario',

  'settings.security.title': 'Seguridad',
  'settings.security.mfa': 'Autenticación de dos factores',
  'settings.security.mfaEnable': 'Activar la autenticación de dos factores',
  'settings.security.mfaRequiredFor':
    'Requerido para cambios de facturación, cuentas de servicio, reconectar una cuenta y revocar credenciales.',
  'settings.security.passkeys': 'Claves de acceso',
  'settings.security.sessions': 'Sesiones activas',
  'settings.security.sessionRevoke': 'Cerrar sesión en esta sesión',
  'settings.security.auditLog.title': 'Registro de auditoría',
  'settings.security.auditLog.description':
    'Cada acción, quién o qué la realizó y cuándo. Exportable por propietarios y administradores.',
  'settings.security.killSwitch': 'parada de emergencia',
  'settings.security.killSwitchBody':
    'Detiene inmediatamente todas las publicaciones y automatizaciones programadas en este espacio de trabajo. No se elimina nada. Puedes apagarlo nuevamente.',
  'settings.security.killSwitchActive':
    'La parada de emergencia está activada. No se publicará ninguna publicación.',

  'settings.data.title': 'Data controls',
  'settings.data.export': 'Export your data',
  'settings.data.exportPreparing': 'Preparing your export. We will email you when it is ready.',
  'settings.data.deletionRequest': 'Request deletion',
  'settings.data.deletionExplain':
    'Deletion cancels scheduled workflows, revokes provider access, removes stored media and tombstones analytics where the provider requires it.',
  'settings.data.retention': 'Retention',
  'settings.data.consents': 'Consents',
  'settings.data.consent.productAnalytics': 'Product analytics',
  'settings.data.consent.diagnostics': 'Share diagnostics with support',
  'settings.data.consent.aiImprovement':
    'Use my content to improve the assistant. This is off unless you turn it on.',
  'settings.data.consent.marketingEmail': 'Product news by email',
} as const;
