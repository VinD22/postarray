/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Analítica',
  'analytics.subtitle': 'O que aconteceu, quão recente é e o que vale a pena testar a seguir.',
  'analytics.range.7d': 'Últimos 7 dias',
  'analytics.range.30d': 'Últimos 30 dias',
  'analytics.range.90d': 'Últimos 90 dias',
  'analytics.range.custom': 'Intervalo personalizado',
  'analytics.range.limitedByProvider':
    '{provider} retorna no máximo {days, plural, one {# dia} other {# dias} many {# dias}} de histórico para esta conta.',
  'analytics.account.select': 'Escolha uma conta',
  'analytics.compareTo': 'Comparado com {baseline}',
  'analytics.baseline.trailingMedian':
    'sua mediana das publicações anteriores {count, plural, one {# comparáveis} other {# publicações comparáveis} many {# publicações comparáveis}}',

  'analytics.metric.followers': 'Seguidores',
  'analytics.metric.subscribers': 'Assinantes',
  'analytics.metric.profileViews': 'Visualizações de perfil',
  'analytics.metric.impressions': 'Impressões',
  'analytics.metric.reach': 'Alcance',
  'analytics.metric.views': 'Visualizações',
  'analytics.metric.videoViews': 'Visualizações de vídeo',
  'analytics.metric.watchTime': 'Tempo de exibição',
  'analytics.metric.averageViewDuration': 'Duração média da visualização',
  'analytics.metric.averageViewPercentage': 'Porcentagem média visualizada',
  'analytics.metric.likes': 'Gostas e reações',
  'analytics.metric.comments': 'Comentários e respostas',
  'analytics.metric.shares': 'Compartilhamentos, republicações e citações',
  'analytics.metric.saves': 'Salva e marca como favorito',
  'analytics.metric.linkClicks': 'Cliques em links',
  'analytics.metric.clickThroughRate': 'Taxa de cliques',
  'analytics.metric.engagementRate': 'Taxa de engajamento',
  'analytics.metric.publishedCount': 'Postagens publicadas',
  'analytics.metric.followerChange': 'Mudança de seguidor',

  'analytics.definition.title': 'Como {metric} é definido',
  'analytics.definition.provider': 'Relatado por {provider} como {providerField}.',
  'analytics.definition.denominator.label': 'Denominador: {denominator}.',
  'analytics.definition.unit': 'Unidade: {unit}.',
  'analytics.definition.normalized':
    'Normalizado a partir do valor do provedor. O valor bruto é mantido e disponível.',
  'analytics.definition.notComparable':
    '{provider} e {otherProvider} definem isso de forma diferente. Compare-os com cuidado.',

  'analytics.value.unavailable': 'Indisponível',
  'analytics.value.unavailableReason.permission':
    'Esta conta não concedeu a permissão necessária para esta métrica.',
  'analytics.value.unavailableReason.unsupported': '{provider} não reporta esta métrica.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} publica esta métrica posteriormente. Verifique novamente após {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'A última sincronização falhou. Estamos tentando novamente e não mostraremos um número adivinhado.',
  'analytics.freshness.synced': 'Sincronizado {relativeTime}',
  'analytics.freshness.stale':
    'Última sincronização bem-sucedida {relativeTime}. Isso pode estar desatualizado.',
  'analytics.freshness.coverage':
    '{covered} de {total} publicações neste intervalo têm dados atuais.',

  'analytics.feedback.title': 'O que isso sugere',
  'analytics.feedback.aboveBaseline':
    'Esta publicação recebeu {percent} mais {metric} do que {baseline}.',
  'analytics.feedback.belowBaseline':
    'Esta publicação recebeu {percent} menos {metric} do que {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Postagens de imagens e publicações de vídeo não são diretamente comparáveis aqui.',
  'analytics.feedback.smallSample':
    'A amostra é pequena. Teste o mesmo gancho novamente antes de tirar uma conclusão.',
  'analytics.feedback.association':
    'Os comentários aumentaram depois que o atraso do primeiro comentário mudou de {before} para {after}. Esta é uma associação, não uma prova de causa.',
  'analytics.feedback.nextTest': 'O que testar a seguir',
  'analytics.feedback.doNotInfer': 'O que isso não mostra',
  'analytics.feedback.noScore':
    'Não há uma pontuação única entre plataformas aqui. Escolha uma métrica com uma definição em que você confia.',

  'analytics.experiment.title': 'Experimentos',
  'analytics.experiment.hypothesis': 'Hipótese',
  'analytics.experiment.variants': 'Variantes',
  'analytics.experiment.successMetric': 'Métrica de sucesso',
  'analytics.experiment.window': 'Janela de medição',
  'analytics.experiment.status.running': 'Em execução até {date}',
  'analytics.experiment.status.complete': 'Completo',
  'analytics.experiment.tagBeforePublishing':
    'Marque um experimento antes de publicar para que a comparação não seja feita depois do fato.',
  'analytics.experiment.caveats': 'Advertências',

  'analytics.export.title': 'Exportar',
  'analytics.export.csv': 'Baixar CSV',
  'analytics.export.json': 'Baixar JSON',
  'analytics.export.providerRestriction':
    '{provider} restringe como seus dados podem ser combinados ou armazenados. Alguns campos não estão incluídos.',

  'analytics.links.title': 'Links rastreados',
  'analytics.links.subtitle':
    'Medições de redirecionamento primário. Estas são uma série separada dos relatórios de cliques em links de uma plataforma.',
  'analytics.links.destination': 'Destino',
  'analytics.links.shortUrl': 'URL curto',
  'analytics.links.totalRequests': 'Total de solicitações',
  'analytics.links.humanClicks': 'Cliques desduplicados',
  'analytics.links.suspectedBots': 'Bots suspeitos',
  'analytics.links.referrerClass': 'Referenciador',
  'analytics.links.deviceClass': 'Dispositivo',
  'analytics.links.country': 'País',
  'analytics.links.lastEvent': 'Último clique {relativeTime}',
  'analytics.links.privacyNote':
    'Mantemos apenas localização aproximada e classe de dispositivo. Endereços IP brutos são mantidos brevemente para abuso e detecção de duplicatas e depois descartados.',
  'analytics.links.separateSources':
    'Não adicione esses cliques a um número relatado pela plataforma. Eles contam coisas diferentes.',
} as const;
