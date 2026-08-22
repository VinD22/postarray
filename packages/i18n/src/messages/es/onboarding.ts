/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Configurar Relay',
  'onboarding.progress': 'Step {current} of {total}',
  'onboarding.skipForNow': 'Saltar por ahora',
  'onboarding.goal': 'Una publicación programada verificada en menos de diez minutos.',

  'onboarding.plan.title': 'Choose how you want to pay',
  'onboarding.plan.help': 'One plan, every feature. Change the interval whenever you like.',

  'onboarding.workspace.title': 'Ponle un nombre a tu espacio de trabajo',
  'onboarding.workspace.namePlaceholder': 'El nombre de su empresa o cliente',
  'onboarding.workspace.timeZone': 'Zona horaria para programar',
  'onboarding.workspace.timeZoneHelp':
    'Cada hora programada se almacena en esta zona, por lo que un cambio de hora nunca mueve tu publicación por accidente.',
  'onboarding.workspace.locale': 'Idioma de la interfaz',

  'onboarding.role.title': '¿Qué te describe mejor?',
  'onboarding.role.creator': 'Creador',
  'onboarding.role.team': 'equipo interno',
  'onboarding.role.agency': 'Agencia',
  'onboarding.role.developer': 'Desarrollador o constructor de agentes',
  'onboarding.role.help':
    'Esto cambia los valores predeterminados que sugerimos. Puedes cambiar todo más tarde.',

  'onboarding.connect.title': 'Conecta tu primera cuenta',
  'onboarding.connect.help':
    'Le mostraremos exactamente qué permisos solicita cada plataforma antes de aprobar algo.',
  'onboarding.connect.skipNote':
    'Puede explorar primero con la cuenta de muestra. No se publica nada de ello.',
  'onboarding.connect.success': '{account} está conectado.',

  'onboarding.content.title': 'Empieza con algo que ya tienes',
  'onboarding.content.useAsset': 'Utilice una imagen o vídeo',
  'onboarding.content.useBrief': 'Comience con un breve resumen',
  'onboarding.content.useText': 'Escríbelo tú mismo',

  'onboarding.preview.title': 'Esto es lo que publicaré.',
  'onboarding.preview.help': 'Un adelanto real de las reglas de la plataforma para esta cuenta.',

  'onboarding.schedule.title': 'Elige cuando sale',
  'onboarding.schedule.help':
    'Revise el tiempo, la configuración de privacidad, la divulgación y el costo estimado del proveedor.',

  'onboarding.done.title': 'Programado',
  'onboarding.done.body': 'Tu publicación está programada para las for {time} in {timeZone}.',
  'onboarding.done.nextStep.title': '¿Qué hacer a continuación?',
  'onboarding.done.nextStep.connectMore': 'Conectar otra cuenta',
  'onboarding.done.nextStep.inviteTeam': 'Invitar a un compañero de equipo',
  'onboarding.done.nextStep.setApproval': 'Establecer una política de aprobación',
  'onboarding.done.nextStep.exploreApi': 'Explora la API y el servidor MCP',

  'onboarding.checklist.title': 'Empezando',
  'onboarding.checklist.connectAccount': 'Conectar una cuenta',
  'onboarding.checklist.firstPost': 'Publicar o programar una publicación',
  'onboarding.checklist.inviteTeammate': 'Invitar a un compañero de equipo',
  'onboarding.checklist.setProjectVoice': 'Describe la voz del proyecto',
  'onboarding.checklist.tryAutomation': 'Pruebe una regla de automatización',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Todo listo} one {# paso a la izquierda} many {# pasos a la izquierda} other {# pasos a la izquierda}}',
} as const;
