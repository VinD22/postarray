/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Analítica',
  'analytics.subtitle':
    'Qué sucedió, qué tan fresco está y qué vale la pena probar a continuación.',
  'analytics.range.7d': 'últimos 7 días',
  'analytics.range.30d': 'últimos 30 días',
  'analytics.range.90d': 'últimos 90 días',
  'analytics.range.custom': 'Rango personalizado',
  'analytics.range.limitedByProvider':
    '{provider} regresa a most {days, plural, one {# día} many {# días} other {# días}} de historial para esta cuenta.',
  'analytics.account.select': 'Elige una cuenta',
  'analytics.compareTo': 'Comparado with {baseline}',
  'analytics.baseline.trailingMedian':
    'su mediana de previous {count, plural, one {# publicación comparable} many {# publicaciones comparables} other {# publicaciones comparables}}',

  'analytics.metric.followers': 'Seguidores',
  'analytics.metric.subscribers': 'Suscriptores',
  'analytics.metric.profileViews': 'Vistas de perfil',
  'analytics.metric.impressions': 'Impresiones',
  'analytics.metric.reach': 'alcanzar',
  'analytics.metric.views': 'Vistas',
  'analytics.metric.videoViews': 'Vistas de vídeo',
  'analytics.metric.watchTime': 'tiempo de visualización',
  'analytics.metric.averageViewDuration': 'Duración promedio de la vista',
  'analytics.metric.averageViewPercentage': 'Porcentaje promedio visto',
  'analytics.metric.likes': 'Gustos y reacciones',
  'analytics.metric.comments': 'Comentarios y respuestas',
  'analytics.metric.shares': 'Acciones, reenvíos y cotizaciones.',
  'analytics.metric.saves': 'Guarda y marca',
  'analytics.metric.linkClicks': 'Clics en enlaces',
  'analytics.metric.clickThroughRate': 'Tasa de clics',
  'analytics.metric.engagementRate': 'Tasa de participación',
  'analytics.metric.publishedCount': 'Publicaciones publicadas',
  'analytics.metric.followerChange': 'Cambio de seguidor',

  'analytics.definition.title': 'How {metric} está definido',
  'analytics.definition.provider': 'Reportado by {provider} as {providerField}.',
  'analytics.definition.denominator.label': 'Denominador: {denominator}.',
  'analytics.definition.unit': 'Unidad: {unit}.',
  'analytics.definition.normalized':
    'Normalizado a partir del valor del proveedor. El valor bruto se mantiene y está disponible.',
  'analytics.definition.notComparable':
    '{provider} and {otherProvider} define esto de manera diferente. Compárelos con cuidado.',

  'analytics.value.unavailable': 'No disponible',
  'analytics.value.unavailableReason.permission':
    'Esta cuenta no ha otorgado el permiso necesario para esta métrica.',
  'analytics.value.unavailableReason.unsupported': '{provider} no informa esta métrica.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} publica esta métrica más adelante. Verifique nuevamente after {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'La última sincronización falló. Estamos reintentando y no mostraremos un número adivinado.',
  'analytics.freshness.synced': 'Synced {relativeTime}',
  'analytics.freshness.stale': 'Último éxito sync {relativeTime}. Esto puede estar desactualizado.',
  'analytics.freshness.coverage':
    '{covered} of {total} publicaciones en este rango tienen datos actuales.',

  'analytics.feedback.title': 'Lo que esto sugiere',
  'analytics.feedback.aboveBaseline':
    'Esta publicación received {percent} more {metric} than {baseline}.',
  'analytics.feedback.belowBaseline':
    'Esta publicación received {percent} fewer {metric} than {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Las publicaciones de imágenes y videos no son directamente comparables aquí.',
  'analytics.feedback.smallSample':
    'La muestra es pequeña. Pruebe el mismo anzuelo nuevamente antes de sacar una conclusión.',
  'analytics.feedback.association':
    'Los comentarios aumentaron después de que cambió el retraso del primer comentario from {before} to {after}. Esta es una asociación, no una prueba de causa.',
  'analytics.feedback.nextTest': 'Qué probar a continuación',
  'analytics.feedback.doNotInfer': 'Lo que esto no muestra',
  'analytics.feedback.noScore':
    'Aquí no existe una puntuación única multiplataforma. Elija una métrica con una definición en la que confíe.',

  'analytics.experiment.title': 'experimentos',
  'analytics.experiment.hypothesis': 'Hipótesis',
  'analytics.experiment.variants': 'Variantes',
  'analytics.experiment.successMetric': 'Métrica de éxito',
  'analytics.experiment.window': 'Ventana de medición',
  'analytics.experiment.status.running': 'Corriendo until {date}',
  'analytics.experiment.status.complete': 'completo',
  'analytics.experiment.tagBeforePublishing':
    'Etiqueta un experimento antes de publicarlo para que la comparación no se realice después del hecho.',
  'analytics.experiment.caveats': 'Advertencias',

  'analytics.export.title': 'Exportar',
  'analytics.export.csv': 'Descargar CSV',
  'analytics.export.json': 'Descargar JSON',
  'analytics.export.providerRestriction':
    '{provider} restringe cómo sus datos pueden combinarse o almacenarse. Algunos campos no están incluidos.',

  'analytics.links.title': 'Enlaces rastreados',
  'analytics.links.subtitle':
    'Mediciones de redireccionamiento de origen. Estas son una serie separada de los informes de clics en enlaces que informa una plataforma.',
  'analytics.links.destination': 'Destino',
  'analytics.links.shortUrl': 'URL corta',
  'analytics.links.totalRequests': 'Solicitudes totales',
  'analytics.links.humanClicks': 'Clics deduplicados',
  'analytics.links.suspectedBots': 'Bots sospechosos',
  'analytics.links.referrerClass': 'referente',
  'analytics.links.deviceClass': 'Dispositivo',
  'analytics.links.country': 'País',
  'analytics.links.lastEvent': 'Último click {relativeTime}',
  'analytics.links.privacyNote':
    'Mantenemos únicamente la ubicación aproximada y la clase de dispositivo. Las direcciones IP sin procesar se conservan brevemente para detectar abusos y duplicados y luego se descartan.',
  'analytics.links.separateSources':
    'No agregue estos clics a un número informado por la plataforma. Cuentan cosas diferentes.',
} as const;
