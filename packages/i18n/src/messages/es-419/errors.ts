/** Spanish (Latin America) beta catalog. B5 legal, billing and consent messages deliberately use English fallback. */
export const errorMessages = {
  'error.unknown.message': 'Algo salió mal y no pudimos clasificarlo.',
  'error.unknown.action':
    'Inténtalo de nuevo. Si sigue sucediendo, envíenos la referencia a continuación.',
  'error.internal.message': 'Este es un problema de nuestro lado, no de su contenido.',
  'error.internal.action':
    'Tu trabajo está guardado. Hemos sido alertados. Inténtalo de nuevo en unos minutos.',
  'error.not_implemented.message': 'Relay aún no ha creado esto.',
  'error.not_implemented.action': 'Siga el registro de cambios para saber cuándo se envía.',
  'error.offline.message': 'Estás desconectado.',
  'error.offline.action':
    'Su borrador se guarda en este dispositivo. La publicación y la programación se reanudan cuando se restablece la conexión.',
  'error.network_unreachable.message': 'No pudimos comunicarnos con el servidor.',
  'error.network_unreachable.action':
    'Comprueba tu conexión y vuelve a intentarlo. No se perdió nada.',
  'error.request_invalid.message': 'La solicitud no estaba en una forma que podamos aceptar.',
  'error.request_invalid.action':
    'Verifique los campos que se enumeran a continuación y envíelo nuevamente.',
  'error.validation_failed.message':
    'Algunos campos necesitan un cambio antes de poder guardarlos.',
  'error.validation_failed.action': 'Corrija los campos resaltados.',
  'error.unauthenticated.message': 'Debes iniciar sesión para hacer esto.',
  'error.unauthenticated.action': 'Inicia sesión y te traeremos de regreso aquí.',
  'error.session_expired.message': 'Tu sesión expiró.',
  'error.session_expired.action': 'Inicia sesión nuevamente. Su borrador se guarda.',
  'error.mfa_required.message': 'Esta acción necesita confirmación de dos factores.',
  'error.mfa_required.action': 'Confirme con su aplicación de autenticación para continuar.',
  'error.forbidden.message': 'Su rol no permite esta acción.',
  'error.forbidden.action':
    'Solicite acceso a un propietario o administrador de este espacio de trabajo.',
  'error.insufficient_scope.message': 'Esta credencial no tiene el alcance {scope}.',
  'error.insufficient_scope.action':
    'Otorgue ese alcance o utilice una credencial que ya lo tenga.',
  'error.workspace_not_found.message': 'Ese espacio de trabajo no existe o no eres miembro.',
  'error.workspace_not_found.action': 'Elige un espacio de trabajo al que perteneces.',
  'error.workspace_suspended.message': 'Este espacio de trabajo está suspendido.',
  'error.workspace_suspended.action':
    'Contacta con soporte para solucionarlo. Tus datos están intactos.',
  'error.not_found.message': 'Ese artículo ya no existe.',
  'error.not_found.action': 'Es posible que haya sido eliminado. Regrese y actualice la lista.',
  'error.conflict.message': 'Alguien más cambió esto mientras trabajabas en ello.',
  'error.conflict.action': 'Revise ambas versiones y luego guárdelas nuevamente.',
  'error.idempotency_key_reused.message':
    'Esta clave de idempotencia ya se utilizó para una solicitud diferente.',
  'error.idempotency_key_reused.action':
    'Utilice una nueva clave o repita exactamente la solicitud original.',
  'error.rate_limited.message': 'Demasiadas solicitudes.',
  'error.rate_limited.action': 'Inténtalo de nuevo después {time}.',
  'error.quota_exceeded.message': 'Esta acción supera el límite del período actual.',
  'error.quota_exceeded.action': 'El límite se restablece {relativeTime}.',
  'error.payment_required.message': 'Este espacio de trabajo no tiene una suscripción activa.',
  'error.payment_required.action':
    'Inicie la suscripción para publicar nuevamente. No se elimina nada.',
  'error.subscription_past_due.message': 'El último pago no se realizó.',
  'error.subscription_past_due.action': 'Actualiza el método de pago en el portal Polar.',
  'error.trial_expired.message': 'El juicio terminó el {date}.',
  'error.trial_expired.action': 'Inicia la suscripción para continuar publicando.',
  'error.entitlement_missing.message': 'Este espacio de trabajo no tiene acceso a esa función.',
  'error.entitlement_missing.action':
    'Verifique la configuración de facturación o comuníquese con el soporte.',
  'error.channel_limit_reached.message':
    'Este espacio de trabajo ya utiliza todos {limit}canales activos.',
  'error.channel_limit_reached.action': 'Desconecte un canal antes de conectar otro.',
  'error.connection_not_found.message': 'Esa conexión ya no está en este espacio de trabajo.',
  'error.connection_not_found.action':
    'Conecte la cuenta nuevamente para seguir publicando en ella.',
  'error.connection_revoked.message': '{account}acceso revocado en {provider}.',
  'error.connection_revoked.action':
    'Vuelva a conectar la cuenta. Las publicaciones programadas se reanudan después de eso.',
  'error.connection_expired.message': 'Acceso para {account}caducado.',
  'error.connection_expired.action':
    'Vuelva a conectar la cuenta para restaurar la publicación y el análisis.',
  'error.connection_paused.message': '{account}está en pausa.',
  'error.connection_paused.action': 'Reanúdelo desde Connections cuando esté listo.',
  'error.connection_permission_missing.message':
    '{account}no ha concedido el permiso necesario para ello.',
  'error.connection_permission_missing.action':
    'Vuelve a conectarte y acepta {permission}en la pantalla de consentimiento.',
  'error.connection_account_type_invalid.message':
    'Instagram necesita una cuenta profesional. {account}es una cuenta personal.',
  'error.connection_account_type_invalid.action':
    'Cámbielo a una cuenta comercial o de creador en la aplicación Instagram y luego vuelva a conectarse.',
  'error.connection_review_pending.message':
    '{provider}todavía está revisando esta aplicación para {account}.',
  'error.connection_review_pending.action':
    'Las publicaciones se publican de forma privada hasta que se apruebe la revisión. Actualizamos esta página cuando cambia.',
  'error.capability_unsupported.message': '{provider}no ofrece esto a través de su API oficial.',
  'error.capability_unsupported.action': 'Utilice un formato que admita esta cuenta.',
  'error.capability_not_implemented.message': 'Relay no ha creado esto para {provider}todavía.',
  'error.capability_not_implemented.action':
    'La página de capacidades enumera lo que cada conector puede hacer hoy.',
  'error.capability_requires_review.message':
    '{provider}otorga esto solo después de revisar la aplicación o la cuenta.',
  'error.capability_requires_review.action':
    'Permanece no disponible hasta que se apruebe esa revisión.',
  'error.content_invalid.message': '{provider}no aceptará este contenido por {account}.',
  'error.content_invalid.action':
    'Los problemas se enumeran en el objetivo. Arréglalos y vuelve a intentarlo.',
  'error.content_changed_after_approval.message':
    'Esta publicación cambió después de que fue aprobada.',
  'error.content_changed_after_approval.action':
    'Solicite aprobación nuevamente antes de que pueda publicarse.',
  'error.duplicate_content.message':
    'Se publicó contenido muy similar en {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Cambie el texto o publíquelo más tarde. Las plataformas restringen las publicaciones duplicadas.',
  'error.cadence_limit_reached.message':
    '{account}ha alcanzado la cadencia de publicación establecida para este espacio de trabajo.',
  'error.cadence_limit_reached.action':
    'Programe esto para un horario posterior o aumente el límite de cadencia.',
  'error.media_invalid.message': 'Este archivo no se puede publicar en {provider}.',
  'error.media_invalid.action': 'El límite exacto se muestra al lado del archivo.',
  'error.media_too_large.message': 'Este archivo es más grande que {provider}acepta.',
  'error.media_too_large.action':
    'Comprímelo o sube una versión más pequeña. Se conserva el original.',
  'error.media_processing_failed.message': 'No pudimos preparar este archivo para {provider}.',
  'error.media_processing_failed.action': 'Intente cargarlo nuevamente o use un formato diferente.',
  'error.media_rights_undeclared.message': 'Este medio no tiene declaración de derechos.',
  'error.media_rights_undeclared.action':
    'Confirme que tiene los derechos para publicarlo, incluidas las personas que aparecen en él.',
  'error.alt_text_required.message': 'Esta imagen necesita texto alternativo para {provider}.',
  'error.alt_text_required.action': 'Describe la imagen o márcala como decorativa.',
  'error.approval_required.message':
    'Este espacio de trabajo requiere aprobación antes de publicarse.',
  'error.approval_required.action': 'Solicitar aprobación de {approver}.',
  'error.approval_expired.message': 'La aprobación para esta publicación expiró el {date}.',
  'error.approval_expired.action': 'Solicite aprobación nuevamente.',
  'error.schedule_in_past.message': 'Ese tiempo ya ha pasado {timeZone}.',
  'error.schedule_in_past.action': 'Elija un momento posterior o publíquelo ahora.',
  'error.schedule_conflict.message':
    '{account}ya tiene una publicación dentro {duration}de esta época.',
  'error.schedule_conflict.action': 'Mueva uno de ellos o continúe si se desea ese espacio.',
  'error.time_zone_invalid.message': 'No reconocemos la zona horaria {timeZone}.',
  'error.time_zone_invalid.action': 'Elija una zona de la lista.',
  'error.destination_unavailable.message':
    'el destino {destination}ya no está disponible en {provider}.',
  'error.destination_unavailable.action': 'Actualiza la lista de destinos y elige otro.',
  'error.mention_unresolved.message': 'Una mención no ha coincidido con un real. {provider}cuenta.',
  'error.mention_unresolved.action':
    'Busque y seleccione la cuenta, o elimine la mención. Nunca publicamos una etiqueta nativa falsa.',
  'error.provider_transient.message': '{provider}No pude procesar esto en este momento.',
  'error.provider_transient.action':
    'Lo volveremos a intentar automáticamente. Nada está duplicado.',
  'error.provider_permanent.message': '{provider}Rechazó esto y no aceptará un nuevo intento.',
  'error.provider_permanent.action': 'La respuesta desinfectada está en el recibo.',
  'error.provider_rate_limited.message': '{provider}La tarifa limitó este espacio de trabajo.',
  'error.provider_rate_limited.action': 'Lo volveremos a intentar después {time}.',
  'error.provider_unavailable.message': '{provider}no responde.',
  'error.provider_unavailable.action':
    'Consulte la página de estado. Las publicaciones programadas siguen intentándolo.',
  'error.provider_content_rejected.message':
    '{provider}rechazó este contenido bajo sus propias políticas.',
  'error.provider_content_rejected.action':
    'El motivo que dio está en el recibo. Edite el contenido o apele con {provider}.',
  'error.user_action_required.message': '{account}necesita algo de usted antes de poder publicar.',
  'error.user_action_required.action': 'Abra la conexión para ver qué falta.',
  'error.short_link_destination_blocked.message': 'Ese destino no se puede acortar.',
  'error.short_link_destination_blocked.action':
    'Se bloquean las redes privadas, los esquemas inseguros y los destinos abusivos conocidos.',
  'error.short_link_domain_unverified.message': 'el dominio {domain}Aún no está verificado.',
  'error.short_link_domain_unverified.action':
    'Agregue el registro DNS que se muestra en la configuración y luego verifique.',
  'error.rss_feed_invalid.message': 'Esa URL no devolvió un feed RSS o Atom válido.',
  'error.rss_feed_invalid.action':
    'Verifique la dirección. Lo recuperamos de forma segura y no seguimos redirecciones privadas.',
  'error.webhook_signature_invalid.message': 'La firma en ese webhook no se verificó.',
  'error.webhook_signature_invalid.action':
    'Compruebe que el remitente utilice el secreto de firma actual. La carga útil no fue procesada.',
  'error.webhook_delivery_failed.message': 'Entrega a {endpoint}falló.',
  'error.webhook_delivery_failed.action':
    'Lo volvemos a intentar con retroceso. El registro de entrega tiene la respuesta.',
  'error.automation_rule_not_permitted.message':
    'Esa regla violaría una regla de plataforma, por lo que no se puede crear.',
  'error.automation_rule_not_permitted.action':
    'Los me gusta, los seguimientos, las respuestas no solicitadas y las publicaciones masivas duplicadas nunca están disponibles.',
  'error.ai_unavailable.message': 'El asistente de escritura no está disponible en este momento.',
  'error.ai_unavailable.action': 'Tu texto está intacto. Vuelve a intentarlo en breve.',
  'error.ai_output_invalid.message': 'El asistente devolvió algo que no pudimos validar.',
  'error.ai_output_invalid.action': 'No se aplicó nada a su borrador. Intentar otra vez.',
  'error.ai_budget_exceeded.message':
    'Este espacio de trabajo alcanzó su límite de asistentes por ahora.',
  'error.ai_budget_exceeded.action':
    'El límite se restablece {relativeTime}. Escribir a mano todavía funciona.',
  'error.storage_unavailable.message': 'No pudimos acceder al almacenamiento de medios.',
  'error.storage_unavailable.action':
    'Tu texto está guardado. Intente cargar nuevamente en un momento.',
  'error.export_unavailable.message': 'Esa exportación no se pudo producir.',
  'error.export_unavailable.action':
    'Pruebe con un rango más pequeño o comuníquese con el soporte técnico con la referencia.',
  'error.reference': 'Referencia {correlationId}',
  'error.reportToSupport': 'Envía esto a soporte',
  'error.contentPreserved': 'Su contenido se conserva. No se publicó nada.',
} as const;
