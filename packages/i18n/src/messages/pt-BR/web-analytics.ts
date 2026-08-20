/**
 * Web surface strings for Analytics, Automation Rules, RSS autopost and
 * tracked links.
 *
 * `analytics.ts` and `automation.ts` hold the domain vocabulary shared by every
 * surface (metric names, trigger sentences, provider caveats). This file holds
 * what only the web screens need: column headings, filter labels, wizard steps,
 * the sentence builder chrome and the per screen empty, error, offline,
 * permission and rate limit copy.
 *
 * Every leaf name here is new. Nothing in this file overwrites a key defined in
 * `analytics.ts` or `automation.ts`, which is asserted by `lint.test.ts`.
 */
export const webAnalyticsMessages = {
  /* ======================================================================
     Analytics shell
     ====================================================================== */
  'analytics.chart.legend': 'Série mostrada neste gráfico',
  'analytics.tab.overview': 'Visão geral',
  'analytics.tab.experiments': 'Experimentos',
  'analytics.tab.links': 'Links rastreados',
  'analytics.tab.label': 'Seções de análise',

  'analytics.question.baseline': 'Quais publicações se afastaram de sua linha de base?',
  'analytics.question.baselineHelp':
    'Cada publicação é comparada com suas próprias publicações recentes na mesma conta e no mesmo formato. Nada aqui compara você a outro espaço de trabalho ou outra empresa.',
  'analytics.question.accounts': 'Quais contas precisam de atenção?',
  'analytics.question.next': 'O que vale a pena testar a seguir?',

  'analytics.filter.project': 'Project',
  'analytics.filter.accounts': 'Contas',
  'analytics.filter.allAccounts': 'Todas as contas conectadas',
  'analytics.filter.range': 'Intervalo de datas',
  'analytics.filter.format': 'Formato de conteúdo',
  'analytics.filter.allFormats': 'Todos os formatos',
  'analytics.filter.comparePrevious': 'Compare com o período anterior',
  'analytics.filter.applied':
    '{count, plural, =0 {Sem filtros} one {# filtro} other {# filtros} many {# filtros}} aplicados. {results, plural, =0 {Nenhuma correspondência de publicações} one {# correspondência de publicações} other {# correspondência de publicações} many {# correspondência de publicações}}.',

  'analytics.rankMetric.label': 'Classificar publicações de',
  'analytics.rankMetric.help':
    'Não há pontuação combinada em Relay. Escolha uma métrica cuja definição você confia e a tabela será ordenada apenas por essa métrica.',
  'analytics.rankMetric.chosen':
    'Classificado por {metric}, conforme relatado por cada provedor de conta.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Conscientização',
  'analytics.outcome.awarenessHelp':
    'Quantas vezes a publicação foi entregue ou vista. Os provedores contam isso de maneira diferente, portanto, um valor só é comparável a si mesmo ao longo do tempo.',
  'analytics.outcome.consumption': 'Consumo',
  'analytics.outcome.consumptionHelp':
    'Quanto da publicação as pessoas realmente assistiram ou leram.',
  'analytics.outcome.interaction': 'Interação',
  'analytics.outcome.interactionHelp':
    'O que as pessoas fizeram na plataforma: curtidas, comentários, compartilhamentos e salvamentos.',
  'analytics.outcome.conversion': 'Conversão',
  'analytics.outcome.conversionHelp':
    'O que as pessoas fizeram depois de sair da plataforma. Somente links rastreados podem responder a isso, e apenas para os links que você escolheu rastrear.',
  'analytics.outcome.separateNote':
    'Esses quatro grupos são contados separadamente. Somá-los contaria a mesma pessoa mais de uma vez.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Postagens publicadas no intervalo selecionado, com cada uma comparada com sua linha de base recente.',
  'analytics.table.post': 'Publicação',
  'analytics.table.account': 'Conta',
  'analytics.table.format': 'Formato',
  'analytics.table.published': 'Publicado',
  'analytics.table.value': 'Valor',
  'analytics.table.delta': 'Contra a linha de base',
  'analytics.table.sample': 'Amostra',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Evidência',
  'analytics.table.openEvidence': 'Mostre a evidência para {post}',
  'analytics.table.rowActions': 'Ações para {post}',
  'analytics.table.openPost': 'Métricas de publicação aberta',
  'analytics.table.openReceipt': 'Abrir recibo de publicação',
  'analytics.table.noBaseline': 'Sem linha de base ainda',
  'analytics.table.noBaselineReason':
    'Existem menos de {required} publicações comparáveis nesta conta. Uma comparação seria ruído, então nada é mostrado.',
  'analytics.table.sortBy': 'Classificar por {column}',
  'analytics.table.detailToggle': 'Detalhes',

  'analytics.delta.above': '{percent} acima da linha de base',
  'analytics.delta.below': '{percent} abaixo da linha de base',
  'analytics.delta.level': 'Em linha com a linha de base',
  'analytics.delta.unavailable': 'Sem comparação',

  'analytics.evidence.title': 'Como foi feita essa comparação',
  'analytics.evidence.baseline':
    'Linha de base: a mediana {metric} do anterior {count, plural, one {# publicação comparável} other {# publicações comparáveis} many {# publicações comparáveis}} em {account}.',
  'analytics.evidence.comparableBy':
    'Comparável significa a mesma conta, o mesmo formato de conteúdo ({format}) e um horário de publicação dentro do mesmo período.',
  'analytics.evidence.postsUsed': 'Postagens usadas para a linha de base',
  'analytics.evidence.excluded':
    '{count, plural, =0 {Nenhuma publicação foi excluída} one {# a publicação foi excluída} other {# publicações foram excluídas} many {# publicações foram excluídas}} porque a métrica não estava disponível para elas.',
  'analytics.evidence.smallSample':
    'Com {count, plural, one {# publicação} other {# publicações} many {# publicações}} na linha de base, um único publicação incomum move a mediana muito. Trate isso como um sinal para testar novamente, não como um resultado.',
  'analytics.evidence.confounders': 'O que isso não explica',
  'analytics.evidence.confounder.time':
    'A hora do dia de publicação variou nas publicações da linha de base.',
  'analytics.evidence.confounder.format':
    'Postagens de imagens e publicações de vídeo não são diretamente comparáveis aqui.',
  'analytics.evidence.confounder.followers':
    'A contagem de seguidores em {account} mudou para {percent} durante este período.',
  'analytics.evidence.confounder.paid':
    'Relay não pode dizer se alguma dessas publicações recebeu distribuição paga.',
  'analytics.evidence.confounder.provider':
    '{provider} alterou a forma como relata {metric} dentro deste período.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'O que {metric} significa',
  'analytics.definition.inlineHeading': 'Definição',
  'analytics.definition.observedAt': 'Observado {dateTime}.',
  'analytics.definition.sourceLink': 'Documentação do provedor',
  'analytics.definition.verifiedOn': 'Verificado na documentação do fornecedor em {date}.',
  'analytics.definition.panelTitle': 'Definições de métricas nesta visualização',
  'analytics.definition.panelIntro':
    'Cada número nesta tela vem de um campo de provedor nomeado. As definições abaixo também são repetidas ao lado de cada valor, então nada importante fica apenas em uma dica de ferramenta.',
  'analytics.definition.aggregation.sum': 'Agregado pela adição de cada observação.',
  'analytics.definition.aggregation.average': 'Agregado como média.',
  'analytics.definition.aggregation.median': 'Agregado como mediana.',
  'analytics.definition.aggregation.last': 'A observação mais recente.',
  'analytics.definition.aggregation.delta': 'A mudança entre a primeira e a última observação.',
  'analytics.definition.aggregation.none': 'Relatado como uma única observação.',
  'analytics.definition.denominator.none': 'Esta é uma contagem, não uma taxa.',
  'analytics.definition.historyWindow':
    '{provider} mantém {days, plural, one {# dia} other {# dias} many {# dias}} de histórico para este campo.',
  'analytics.definition.historyWindowNone':
    '{provider} não indica um limite de histórico para este campo.',

  'analytics.definition.term.providerField': 'Campo do provedor',
  'analytics.definition.term.unit': 'Unidade',
  'analytics.definition.term.denominator': 'Denominador',
  'analytics.definition.term.aggregation': 'Como é agregado',
  'analytics.definition.term.history': 'Histórico que o provedor mantém',
  'analytics.definition.term.definition': 'O que o provedor diz que significa',

  'analytics.unit.count': 'Uma contagem de eventos',
  'analytics.unit.seconds': 'Segundos',
  'analytics.unit.percent': 'Uma porcentagem que o provedor já calculou',
  'analytics.unit.ratio': 'Uma proporção Relay calculada a partir de dois campos de provedor',
  'analytics.unit.currency_minor': 'Uma quantia de dinheiro em unidades menores',

  'analytics.denominator.none': 'Esta é uma contagem, não uma taxa. Não tem denominador.',
  'analytics.denominator.impressions': 'Dividido por impressões',
  'analytics.denominator.reach': 'Dividido por alcance',
  'analytics.denominator.views': 'Dividido por visualizações',
  'analytics.denominator.followers':
    'Dividido pela contagem de seguidores no momento da observação',
  'analytics.denominator.sessions': 'Dividido por sessões',

  'analytics.format.text': 'Texto',
  'analytics.format.image': 'Imagem',
  'analytics.format.carousel': 'Carrossel',
  'analytics.format.video': 'Vídeo',
  'analytics.format.short_video': 'Vídeo curto',
  'analytics.format.long_video': 'Vídeo longo',
  'analytics.format.document': 'Documento',
  'analytics.format.thread': 'Tópico',

  'analytics.value.unavailableReason.notImplemented':
    'Relay ainda não construiu o mapeamento para esta métrica em {provider}.',
  'analytics.value.estimated': 'Estimado',
  'analytics.value.estimatedMethod': 'Método: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'De onde vieram esses números',
  'analytics.freshness.intro':
    'Os provedores agregam de acordo com sua própria programação. Nada nesta tela está ao vivo.',
  'analytics.freshness.accountRow': '{account} em {provider}',
  'analytics.freshness.never': 'Nunca sincronizado',
  'analytics.freshness.nextAttempt': 'Próxima tentativa de sincronização {relativeTime}.',
  'analytics.freshness.openStatus': 'Status do provedor',

  'analytics.accounts.title': 'Contas que precisam de atenção',
  'analytics.accounts.empty':
    'Todas as contas conectadas retornaram dados neste período. Nada precisa de você aqui.',
  'analytics.accounts.reason.permission':
    'A permissão de análise não foi concedida quando esta conta foi conectada.',
  'analytics.accounts.reason.expired':
    'O acesso expirou, portanto nenhuma métrica foi coletada desde {date}.',
  'analytics.accounts.reason.stale': 'A última sincronização bem-sucedida foi {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# tentativa de sincronização} other {# tentativas de sincronização} many {# tentativas de sincronização}} falharam consecutivamente. O motivo registrado foi {reason}.',
  'analytics.accounts.reason.noPosts': 'Nada foi publicado nesta conta no intervalo selecionado.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Observações',
  'analytics.observations.intro':
    'Estas são descrições do que os números mostram. Não são previsões e não estabelecem causa.',
  'analytics.observations.empty':
    'Ainda não há história publicada suficiente para descrever um padrão. Publique mais algumas publicações na mesma conta e formato.',
  'analytics.observations.citedPosts': 'Baseado em',
  'analytics.observations.citedPeriod': 'Período: {start} a {end}.',
  'analytics.observations.nextTestTitle': 'Um teste que você pode executar em seguida',
  'analytics.observations.nextTestBody':
    'Publique {count, plural, one {# mais publicações} other {# mais publicações} many {# mais publicações}} em {account} alterando apenas {variable} e compare a mesma métrica. Marque-o como um experimento antes de publicar para que a comparação seja planejada e não encontrada posteriormente.',
  'analytics.observations.tagFirst': 'Marque um experimento',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} ao longo do tempo',
  'analytics.chart.summary':
    '{metric} em {account}, {count, plural, one {# ponto} other {# pontos} many {# pontos}} de {start} a {end}.',
  'analytics.chart.showTable': 'Mostrar como tabela',
  'analytics.chart.hideTable': 'Ocultar a mesa',
  'analytics.chart.tableCaption': 'A mesma série de uma mesa.',
  'analytics.chart.columnPeriod': 'Período',
  'analytics.chart.columnValue': 'Valor',
  'analytics.chart.gapLabel': 'Nenhum dado coletado',
  'analytics.chart.gapExplained':
    'Uma quebra na linha significa que nenhuma observação foi coletada naquele período. Isso não significa zero.',
  'analytics.chart.annotation': 'Anotação',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'Nenhuma observação foi coletada neste intervalo.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Planeje um experimento',
  'analytics.experiment.empty':
    'Nenhuma experiência ainda. Um experimento é uma comparação que você decide antes de publicar, que é o único tipo que pode responder a uma pergunta.',
  'analytics.experiment.emptyExample':
    'Exemplo: publique o mesmo anúncio em X duas vezes, uma vez com o link na publicação e outra com o link no primeiro comentário, depois compare os cliques no link em 72 horas.',
  'analytics.experiment.name': 'O que você está testando',
  'analytics.experiment.namePlaceholder': 'Primeiro comentário aos 5 minutos contra 30 minutos',
  'analytics.experiment.hypothesisPlaceholder':
    'Um atraso menor antes do primeiro comentário obter mais respostas em X.',
  'analytics.experiment.variantLabel': 'Variante {index}',
  'analytics.experiment.variantDescription': 'O que há de diferente nesta variante',
  'analytics.experiment.addVariant': 'Adicionar uma variante',
  'analytics.experiment.removeVariant': 'Remover variante {index}',
  'analytics.experiment.accounts': 'Contas incluídas',
  'analytics.experiment.windowHelp':
    'As métricas continuam em movimento depois que uma publicação vai ao ar. Corrija a janela agora para que a comparação não seja feita em um momento que corresponda a uma variante.',
  'analytics.experiment.windowDays':
    'Medir por {count, plural, one {# dia} other {# dias} many {# dias}} após a publicação de cada publicação',
  'analytics.experiment.minSample': 'Mínimo de publicações por variante',
  'analytics.experiment.minSampleHelp':
    'Abaixo desta contagem, o resultado é mostrado como inconclusivo e não como vencedor.',
  'analytics.experiment.status.planned': 'Planejado',
  'analytics.experiment.status.collecting':
    'Coletando. {published} de {target} publicações publicadas.',
  'analytics.experiment.status.inconclusive': 'Completo, sem diferença clara',
  'analytics.experiment.result.difference':
    '{variant} registrou {percent} mais {metric} do que {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'As duas variantes estão dentro de {percent} uma da outra em {metric}. Isso está dentro da faixa em que essas publicações variam de qualquer maneira.',
  'analytics.experiment.result.association':
    'Esta é uma associação medida em {count, plural, one {# publicação} other {# publicações} many {# publicações}}. Isso não prova que a mudança causou a diferença.',
  'analytics.experiment.result.unavailable':
    '{metric} estava indisponível para {count, plural, one {# publicação} other {# publicações} many {# publicações}} neste experimento, então essas publicações são excluídas em vez de contadas como zero.',
  'analytics.experiment.result.title': 'Resultado',
  'analytics.experiment.completeNow': 'Feche esta experiência',
  'analytics.experiment.completeConfirm':
    'O fechamento interrompe a coleta. As publicações permanecem publicadas e os números ficam disponíveis.',
  'analytics.experiment.postsTitle': 'Postagens nesta experiência',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Carregando análises para as contas selecionadas',
  'analytics.state.loadingProvider': 'Buscando {provider} análises',
  'analytics.state.empty': 'Nada publicado neste intervalo',
  'analytics.state.emptyBody':
    'Analytics descreve publicações que já foram publicadas. Publique algo ou amplie o intervalo de datas.',
  'analytics.state.emptyExample':
    'Quando uma publicação estiver no ar, você verá uma linha como: X @acme, "Lançamento do tópico", 12.400 impressões, 58 por cento acima da mediana das 10 anteriores.',
  'analytics.state.errorTitle': 'Não foi possível carregar o Analytics',
  'analytics.state.errorBody':
    'Nenhum número é mostrado em vez de um número adivinhado. Suas publicações e recibos não serão afetados.',
  'analytics.state.partialTitle': '{loaded} de {total} contas retornaram dados',
  'analytics.state.partialBody':
    'As contas que responderam são mostradas com atualização própria. O restante está listado com o motivo pelo qual não o fez.',
  'analytics.state.partialSucceeded': 'Dados retornados',
  'analytics.state.partialFailed': 'Não retornou dados',
  'analytics.state.offlineTitle': 'Você está off-line',
  'analytics.state.offlineBody':
    'Os números abaixo foram carregados antes da queda da conexão, portanto, são mais antigos do que os rótulos de atualização sugerem.',
  'analytics.state.permissionTitle': 'Você não pode ver análises nesta área de trabalho',
  'analytics.state.permissionBody':
    'Analytics precisa da função de analista ou superior. Um proprietário ou administrador deste espaço de trabalho pode concedê-lo.',
  'analytics.state.rateLimitTitle': '{provider} limita a taxa de solicitações de análise',
  'analytics.state.rateLimitCause':
    'A conta usou sua parcela da cota do provedor para esta janela. Relay não tenta novamente, porque isso atrasaria a publicação.',
  'analytics.state.rateLimitAlternative':
    'Restringe o intervalo de datas ou o filtro da conta, que pede menos ao provedor.',
  'analytics.state.rateLimitReset': 'Solicita currículo',
  'analytics.state.reference': 'Referência de diagnóstico',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Crie um link rastreado',
  'analytics.links.empty': 'Nenhum link rastreado ainda',
  'analytics.links.emptyBody':
    'Um link rastreado é um URL curto Relay redirecionado, para que você possa ver os cliques mesmo quando uma plataforma não relata nenhum. O destino original nunca é alterado sem uma entrada de auditoria.',
  'analytics.links.emptyExample':
    'Exemplo: relay.to/a7Kq2 redireciona para acme.com/blog/launch com campanha q3-launch.',
  'analytics.links.table.caption':
    'Links rastreados neste espaço de trabalho e suas contagens de cliques primários.',
  'analytics.links.campaign': 'Campanha',
  'analytics.links.created': 'Criado',
  'analytics.links.usedIn':
    '{count, plural, =0 {Ainda não usado em uma publicação} one {Usado em # publicação} other {Usado em publicações #} many {Usado em # publicações}}',
  'analytics.links.state.active': 'Ativo',
  'analytics.links.state.expired': 'Expirado {date}',
  'analytics.links.state.disabled': 'Desativado',
  'analytics.links.state.disabledAt': 'Desativado em {date}. Este link curto não redireciona mais.',
  'analytics.links.state.blocked': 'Bloqueado por segurança',
  'analytics.links.state.blockedBody':
    'Este redirecionamento não está disponível porque o destino falhou em uma verificação de segurança. Altere o destino ou fale com o suporte.',
  'analytics.links.state.disabledReason':
    'Desativado por {actor} em {date}. Motivo registrado: {reason}.',
  'analytics.links.detailTitle': 'Link rastreado {slug}',
  'analytics.links.exactRedirect': 'Redirecionamento exato',
  'analytics.links.exactRedirectHelp':
    'Este é o destino que um visitante chega agora, incluindo todos os parâmetros UTM, mostrados por extenso e não abreviados.',
  'analytics.links.editDestination': 'Alterar o destino',
  'analytics.links.editDestinationWarning':
    'Alterar o destino afeta todos os locais onde este link já foi publicado. Os relatórios dos períodos anteriores à alteração mantêm o destino que estava ativo no momento.',
  'analytics.links.editDestinationAudit':
    'A alteração é registrada no log de auditoria com seu nome, o destino antigo e o novo.',
  'analytics.links.destinationHistory': 'Histórico de destino',
  'analytics.links.destinationHistoryRow': '{destination}, ativo de {start} a {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, ativo desde {start}',
  'analytics.links.domainLabel': 'Domínio curto',
  'analytics.links.domainDefault': 'Relay domínio padrão',
  'analytics.links.domainVerified': 'Verificado por DNS em {date}',
  'analytics.links.domainPending': 'Aguardando o registro DNS',
  'analytics.links.domainPendingHelp':
    'Adicione o registro TXT abaixo em {domain} e verifique novamente. Até que seja verificado, este domínio não pode ser selecionado para um novo link.',
  'analytics.links.domainFailed': 'O registro DNS não corresponde em {date}',
  'analytics.links.domainCheck': 'Verifique o DNS novamente',
  'analytics.links.expiry': 'Expiração',
  'analytics.links.expiryNone': 'Sem expiração definida',
  'analytics.links.expiryHelp':
    'Após a expiração, o link retorna uma página simples informando que terminou. Nunca é apontado silenciosamente para outro lugar.',
  'analytics.links.disable': 'Desative este link agora',
  'analytics.links.disableTitle': 'Desativar {slug}?',
  'analytics.links.disableBody':
    'Os visitantes chegam a uma página dizendo que o link não está mais disponível. As publicações publicadas ainda contêm o URL curto, portanto, ele fica visível para qualquer pessoa que clicar.',
  'analytics.links.disableReason': 'Motivo para desabilitar',
  'analytics.links.enable': 'Ative este link novamente',
  'analytics.links.abuseTitle': 'Denunciar abuso deste link',
  'analytics.links.abuseBody':
    'Se este URL curto estiver sendo usado para algo que você não pretendia, denuncie e o redirecionamento será suspenso enquanto é revisado.',
  'analytics.links.abuseAction': 'Denuncie este link',
  'analytics.links.measurementLabel': 'Medição de redirecionamento primário',
  'analytics.links.measurementExplained':
    'Relay conta uma solicitação quando o serviço de redirecionamento é solicitado para esta URL. Um clique desduplicado remove solicitações repetidas do mesmo visitante dentro de uma janela curta, e as solicitações que correspondem a padrões conhecidos do rastreador são excluídas em vez de excluídas.',
  'analytics.links.botsNote':
    '{count, plural, one {# request} other {# requests} many {# requests}} foram classificados como automatizados e são excluídos da contagem desduplicada.',
  'analytics.links.series.title': 'Solicitações e cliques desduplicados ao longo do tempo',
  'analytics.links.series.requests': 'Total de solicitações',
  'analytics.links.series.clicks': 'Cliques desduplicados',
  'analytics.links.breakdownTitle': 'De onde vieram os cliques',
  'analytics.links.breakdown.share': '{percent} de cliques desduplicados',
  'analytics.links.referrer.direct': 'Nenhum referenciador enviado',
  'analytics.links.referrer.social': 'Plataforma social',
  'analytics.links.referrer.search': 'Mecanismo de pesquisa',
  'analytics.links.referrer.email': 'E-mail do cliente',
  'analytics.links.referrer.other': 'Outro site',
  'analytics.links.device.mobile': 'Móvel',
  'analytics.links.device.desktop': 'Desktop',
  'analytics.links.device.tablet': 'Comprimido',
  'analytics.links.device.unknown': 'Não determinado',
  'analytics.links.countryUnknown': 'País não determinado',
  'analytics.links.lastEventLabel': 'Último clique',
  'analytics.links.noEvents': 'Nenhum clique registrado ainda',
  'analytics.links.noEventsBody':
    'Este link não foi solicitado desde que foi criado. Esse é um zero real, medido pelo nosso próprio serviço de redirecionamento.',
  'analytics.links.compareWarning':
    '{provider} relata {providerValue} cliques em links para esta publicação. Relay registrou {relayValue} cliques desduplicados. Os dois contam eventos diferentes e nenhum substitui o outro.',
  'analytics.links.errorTitle': 'As estatísticas do link não puderam ser carregadas',
  'analytics.links.errorBody':
    'O serviço de redirecionamento ainda está funcionando, então o link continua enviando visitantes ao seu destino. Apenas os relatórios são afetados.',
  'analytics.links.createDestination': 'URL de destino',
  'analytics.links.createDestinationHelp':
    'Deve ser um endereço https público. Endereços de rede privada e cadeias de redirecionamento são rejeitados pelo serviço de redirecionamento.',
  'analytics.links.createCampaign': 'Nome da campanha',
  'analytics.links.createSlug': 'Final personalizado',
  'analytics.links.createSlugHelp': 'Deixe em branco e Relay gera um final aleatório curto.',
  'analytics.links.createUtm': 'Parâmetros UTM',
  'analytics.links.blockedScheme': 'Apenas destinos https são aceitos.',
  'analytics.links.blockedPrivate':
    'Esse endereço está em uma rede privada, portanto o serviço de redirecionamento não o aceitará.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Regras',
  'automation.tab.feeds': 'Feeds RSS',
  'automation.tab.label': 'Seções de automação',

  'automation.rules.table.caption': 'Regras de automação neste espaço de trabalho.',
  'automation.rules.table.rule': 'Regra',
  'automation.rules.table.state': 'Estado',
  'automation.rules.table.accounts': 'Contas',
  'automation.rules.table.lastRun': 'Última execução',
  'automation.rules.table.nextCheck': 'Próxima verificação',
  'automation.rules.neverRun': 'Ainda não executado',
  'automation.rules.emptyExample':
    'Exemplo: quando um novo item aparecer no feed do blog Acme, se o idioma for inglês, crie um rascunho a partir do modelo de anúncio do Blog e solicite aprovação.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {Nenhuma conta selecionada} one {# conta} other {# contas} many {# contas}}',
  'automation.rules.openRule': 'Abra {name}',
  'automation.rules.duplicateRule': 'Duplicado {name}',
  'automation.rules.deleteTitle': 'Excluir {name}?',
  'automation.rules.deleteBody':
    'A regra é interrompida imediatamente e seu histórico de execução é mantido no log de auditoria. Postagens já criadas não serão afetadas.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'um comentário agendado ou item do tópico falha',

  'automation.condition.timeWindow': 'o tempo está entre {start} e {end} em {timeZone}',
  'automation.condition.domainPresent': 'o texto está vinculado a {domain}',
  'automation.condition.hashtagPresent': 'o texto contém a hashtag {hashtag}',
  'automation.condition.providerCapability': 'a conta pode realmente fazer {capability}',
  'automation.condition.planStatus': 'a assinatura está ativa',

  'automation.action.continueSequence': 'continue o tópico preparado ou a sequência de comentários',
  'automation.action.notifyEmail': 'envie um e-mail para {target}',
  'automation.action.notifyWebhook': 'envie um webhook para {target}',
  'automation.action.pauseConnection': 'pause a conta afetada',
  'automation.action.quotePost': 'cite a publicação de origem uma vez',
  'automation.action.followUpComment': 'adicione um comentário preparado na publicação de origem',

  'automation.param.feed': 'Alimentação',
  'automation.param.template': 'Modelo',
  'automation.param.signature': 'Assinatura',
  'automation.param.disclosure': 'Divulgação',
  'automation.param.locale': 'Idioma',
  'automation.param.project': 'Project',
  'automation.param.campaign': 'Campanha',
  'automation.param.account': 'Conta',
  'automation.param.platform': 'Plataforma',
  'automation.param.contentType': 'Tipo de conteúdo',
  'automation.param.keyword': 'Palavra-chave',
  'automation.param.hashtag': 'Hashtag',
  'automation.param.domain': 'Domínio',
  'automation.param.capability': 'Capacidade',
  'automation.param.timeZone': 'Fuso horário',
  'automation.param.startTime': 'De',
  'automation.param.endTime': 'Para',
  'automation.param.duration': 'Duração',
  'automation.param.metric': 'Métrica',
  'automation.param.value': 'Valor',
  'automation.param.target': 'Enviar para',
  'automation.param.time': 'Tempo',
  'automation.param.cadence': 'Com que frequência',
  'automation.param.notSet': 'não definido',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Nome da regra',
  'automation.editor.namePlaceholder': 'Blog para redes sociais',
  'automation.editor.when': 'Quando',
  'automation.editor.if': 'Se',
  'automation.editor.then': 'Então',
  'automation.editor.after': 'Depois',
  'automation.editor.until': 'Até',
  'automation.editor.sentenceLabel': 'Frase da regra',
  'automation.editor.readBack': 'Leia a frase antes de ligar isso. É toda a regra.',
  'automation.editor.chooseTrigger': 'Escolha o que inicia esta regra',
  'automation.editor.addCondition': 'Adicione uma condição',
  'automation.editor.addAction': 'Adicione uma ação',
  'automation.editor.removeCondition': 'Remova a condição {label}',
  'automation.editor.removeAction': 'Remova a ação {label}',
  'automation.editor.moveActionUp': 'Mova {label} antes',
  'automation.editor.moveActionDown': 'Mover {label} mais tarde',
  'automation.editor.actionOrder': 'As ações são executadas nesta ordem, de cima para baixo.',
  'automation.editor.noConditions': 'Sem condições. A regra é executada sempre que é acionada.',
  'automation.editor.noActions': 'Nenhuma ação ainda. Uma regra sem ação não pode ser salva.',
  'automation.editor.delayNone': 'sem demora',
  'automation.editor.delayLabel': 'Atraso antes da execução das ações',
  'automation.editor.endLabel': 'Quando esta regra termina',
  'automation.editor.end.manual': 'Eu desligo isso',
  'automation.editor.end.date': 'uma data que eu escolho',
  'automation.editor.end.count':
    'foi executado {count, plural, one {# tempo} other {# vezes} many {# vezes}}',
  'automation.editor.end.dateValue': 'Pare em',
  'automation.editor.end.countValue': 'Pare depois de tantas corridas',
  'automation.editor.parameterFor': 'Configurações para {label}',
  'automation.editor.saveDraft': 'Salvar como rascunho',
  'automation.editor.savedAt': 'Salvo {time}',
  'automation.editor.unsaved': 'Alterações não salvas',

  'automation.editor.view.sentence': 'Frase',
  'automation.editor.view.structured': 'Estruturado',
  'automation.editor.view.api': 'Representação API',
  'automation.editor.view.label': 'Visualização do editor',
  'automation.editor.apiHelp':
    'Isso é exatamente o que a API REST, a CLI e o servidor MCP enviam. Editá-lo aqui e voltar para a frase mantém todos os campos.',
  'automation.editor.apiInvalid':
    'Esta não é uma regra JSON válida, portanto não foi aplicada: {reason}',
  'automation.editor.apiApply': 'Aplique este JSON',
  'automation.editor.structuredHelp':
    'A mesma regra dos campos. Use isto quando uma regra tiver muitas condições e a frase for longa.',

  'automation.editor.error.noAction': 'Adicione pelo menos uma ação antes de salvar.',
  'automation.editor.error.noTrigger': 'Escolha um gatilho antes de salvar.',
  'automation.editor.error.noAccounts':
    'Escolha pelo menos uma conta na qual esta regra possa agir.',
  'automation.editor.error.missingParameter': '{label} precisa de um valor.',
  'automation.editor.error.summary':
    '{count, plural, one {# algo precisa de sua atenção} other {# coisas precisam de sua atenção} many {# coisas precisam de sua atenção}} antes que esta regra possa ser salva.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'O que inicia esta regra',
  'automation.picker.conditionTitle': 'Adicione uma condição',
  'automation.picker.actionTitle': 'Adicione uma ação',
  'automation.picker.search': 'Filtrar esta lista',
  'automation.picker.noResults': 'Nada nesta lista corresponde ao que você digitou.',
  'automation.picker.groupContent': 'Conteúdo',
  'automation.picker.groupPublishing': 'Publicação',
  'automation.picker.groupNotify': 'Pessoas e sistemas',
  'automation.picker.groupControl': 'Controle de regras',
  'automation.picker.groupSchedule': 'Tempo',
  'automation.picker.groupExternal': 'Eventos externos',
  'automation.picker.groupMeasurement': 'Medição',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# action is} other {# actions are} many {# actions are}} não listadas porque as contas selecionadas não podem executá-las.',
  'automation.picker.hiddenDetail': '{action} não está disponível para {provider}. {reason}',
  'automation.picker.consequential': 'Cria algo em uma plataforma',
  'automation.picker.internalOnly': 'Fica dentro de Relay',

  'automation.accounts.label': 'Contas nas quais esta regra pode agir',
  'automation.accounts.help':
    'Uma regra nunca pode afetar uma conta que não esteja listada aqui, sejam quais forem suas condições.',
  'automation.accounts.none': 'Nenhuma conta selecionada ainda',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Regras de medição para este gatilho',
  'automation.threshold.intro':
    'Uma regra que reage a um número precisa saber qual número, medido em que período e com que frequência ela pode agir.',
  'automation.threshold.metric': 'Métrica para assistir',
  'automation.threshold.value': 'Valor limite',
  'automation.threshold.window': 'Janela de medição',
  'automation.threshold.windowHelp':
    'Contado a partir do momento da publicação da publicação de origem. Fora desta janela a regra para de assistir a publicação.',
  'automation.threshold.expiry': 'Pare de assistir uma publicação depois',
  'automation.threshold.cooldown': 'Resfriamento entre execuções',
  'automation.threshold.cooldownHelp':
    'O menor tempo permitido entre duas execuções para a mesma publicação de origem.',
  'automation.threshold.maxPerPost': 'Máximo de execuções por publicação de origem',
  'automation.threshold.defaultsTitle':
    'Padrões que permanecem ativados a menos que você os altere',
  'automation.threshold.defaultOncePerPost': 'Executar uma vez por publicação de origem.',
  'automation.threshold.defaultStale':
    'Não execute se a métrica estiver indisponível ou obsoleta. O limite de atualização usado é {duration}.',
  'automation.threshold.staleLimit': 'Trate uma métrica como obsoleta após',
  'automation.threshold.providerNote':
    '{provider} informa {metric} sobre um atraso, portanto esta regra só pode agir após o provedor publicar o número.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Acompanhamento de outra conta',
  'automation.crossAccount.off': 'Desligado. Esta regra só atua na conta de origem.',
  'automation.crossAccount.enable': 'Permitir acompanhamento de outra conta',
  'automation.crossAccount.body':
    'Ambas as contas devem estar conectadas a este espaço de trabalho e ambas devem ser nomeadas aqui. O acompanhamento é uma publicação preparada que você escreve com antecedência e segue a mesma política de aprovação de qualquer outra coisa.',
  'automation.crossAccount.sourceAccount': 'Conta de origem',
  'automation.crossAccount.followUpAccount': 'Conta que publica o follow up',
  'automation.crossAccount.preauthorize':
    'Confirmo que este espaço de trabalho controla {sourceAccount} e {followUpAccount} e que o acompanhamento não é apresentado como endosso independente.',
  'automation.crossAccount.preauthorizeRequired':
    'Confirme a pré-autorização antes que esta regra possa ser salva.',
  'automation.crossAccount.duplicateCheck':
    'Duplicações de contas cruzadas e verificações de cadência são executadas antes do acompanhamento, e são ignoradas em vez de atrasadas se repetirem a publicação de origem.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro': 'Tudo o que esta regra pode fazer, antes de fazer qualquer coisa.',
  'automation.preflight.accountsLabel': 'Contas nas quais pode atuar',
  'automation.preflight.maxActionsLabel': 'Mais ações externas por execução',
  'automation.preflight.maxActionsPeriod':
    'No máximo {count, plural, one {# ação externa} other {# ações externas} many {# ações externas}} em {period}.',
  'automation.preflight.approvalLabel': 'Aprovação',
  'automation.preflight.approvalNone':
    'Nenhuma ação nesta regra cria nada em uma plataforma, portanto nenhuma aprovação se aplica.',
  'automation.preflight.providerLabel': 'Restrições do provedor',
  'automation.preflight.providerNone': 'Nenhum se aplica às ações desta regra.',
  'automation.preflight.costLabel': 'Custo medido estimado',
  'automation.preflight.costUnknown':
    'O custo não pode ser estimado para essas ações até que o preço do fornecedor seja conhecido.',
  'automation.preflight.costMethod':
    'Estimado a partir da lista de preços do fornecedor em {date}. O recibo registra o que foi efetivamente cobrado.',
  'automation.preflight.cadenceLabel': 'Cadência e duplicatas',
  'automation.preflight.cadenceBody':
    'As verificações de duplicatas e cadência são executadas antes de cada ação. Uma ação que exceda o orçamento de cadência de uma conta é ignorada e registrada, e não colocada na fila.',
  'automation.preflight.failureLabel': 'Se uma execução falhar',
  'automation.preflight.failure.pauseAfter':
    'A regra é pausada após {count, plural, one {# falha consecutiva} other {# falhas consecutivas} many {# falhas consecutivas}} e arquiva um item de ação.',
  'automation.preflight.failure.continue':
    'A regra continua em execução e cada falha é registrada no log de execução.',
  'automation.preflight.exampleLabel': 'Exemplo executado',
  'automation.preflight.exampleIntro':
    'Usando o evento mais recente que este gatilho teria correspondido.',
  'automation.preflight.exampleNone':
    'Nenhum evento correspondente aconteceu ainda, portanto nenhum exemplo pode ser mostrado. Em vez disso, execute um evento de teste.',
  'automation.preflight.activate': 'Ative esta regra',
  'automation.preflight.activateConfirmTitle': 'Ligue {name}?',
  'automation.preflight.activateConfirmBody':
    'A partir de agora esta regra atua sem perguntar primeiro, dentro dos limites listados acima.',
  'automation.preflight.blocked':
    'Esta regra ainda não pode ser ativada. {count, plural, one {# item} other {# itens} many {# itens}} acima precisam de uma decisão.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Evento de teste',
  'automation.test.body':
    'Um teste avalia a frase inteira e mostra o que ela faria. Ele nunca publica, nunca publica um comentário e nunca envia um webhook para um endpoint real.',
  'automation.test.useLastEvent': 'Use o evento correspondente mais recente',
  'automation.test.usePayload': 'Colar uma carga de evento',
  'automation.test.run': 'Execute o teste',
  'automation.test.running': 'Executando o teste',
  'automation.test.resultTitle': 'O que o teste fez',
  'automation.test.conditionPassed': '{condition} aprovado',
  'automation.test.conditionFailed': '{condition} não passou, então a regra parou aqui',
  'automation.test.actionSimulated': '{action} seria executado',
  'automation.test.actionSkipped': '{action} seria ignorado: {reason}',
  'automation.test.noExternalEffect': 'Não sobrou nada Relay durante este teste.',
  'automation.test.failed': 'O teste não pôde ser concluído: {reason}',

  'automation.runs.table.caption': 'Execuções recentes desta regra.',
  'automation.runs.startedAt': 'Iniciado',
  'automation.runs.outcome.label': 'Resultado',
  'automation.runs.actionsTaken': 'Ações',
  'automation.runs.trigger': 'Acionado por',
  'automation.runs.outcome.completed': 'Concluído',
  'automation.runs.outcome.skipped': 'Ignorado',
  'automation.runs.outcome.failed': 'Falha',
  'automation.runs.outcome.testMode': 'Modo de teste',
  'automation.runs.actionCount':
    '{count, plural, =0 {Sem ação externa} one {# ação externa} other {# ações externas} many {# ações externas}}',
  'automation.runs.skippedReason': 'Ignorado porque {reason}',
  'automation.runs.openDetail': 'Abra a execução de {time}',
  'automation.runs.createdItems': 'Criado',

  'automation.versions.caption': 'Cada versão salva desta regra.',
  'automation.versions.current': 'Atual',
  'automation.versions.savedBy': 'Salvo por {actor} em {date}',
  'automation.versions.compare': 'Compare com a versão atual',
  'automation.versions.restore': 'Restaurar esta versão',
  'automation.versions.restoreConfirm':
    'Restaurar cria uma nova versão. Nada é substituído e a regra permanece no estado atual até você ativá-la.',
  'automation.versions.diffTitle': 'Versão {from} em comparação com a versão {to}',

  'automation.kill.title': 'Pare {name} agora',
  'automation.kill.body':
    'A regra para imediatamente, no meio de uma corrida, se houver. Qualquer coisa já enviada para uma plataforma permanece publicada, porque uma publicação externa nunca é revertida.',
  'automation.kill.confirmPhrase': 'PARE',
  'automation.kill.confirmLabel': 'Digite STOP para confirmar',
  'automation.kill.stopped':
    'Esta regra foi interrompida por {actor} em {date}. Ele não poderá ser executado novamente até que você o ligue novamente.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Carregando regras de automação',
  'automation.state.loadingRule': 'Carregando a regra e suas execuções recentes',
  'automation.state.errorTitle': 'Não foi possível carregar as regras',
  'automation.state.errorBody':
    'As regras que já estão em execução não são afetadas por isso. Apenas esta tela falhou.',
  'automation.state.offlineTitle': 'Você está off-line',
  'automation.state.offlineBody':
    'Você pode ler uma regra e editar o rascunho, e ele permanece neste dispositivo. Salvar, testar e ativar uma regra precisa de uma conexão.',
  'automation.state.permissionTitle': 'Você não pode alterar as regras de automação',
  'automation.state.permissionBody':
    'As regras atuam nas contas conectadas, portanto, para mudar uma delas, é necessário a função de gerente ou superior. Você ainda pode ler todas as regras e seu histórico de execução.',
  'automation.state.rateLimitTitle': 'As execuções de regras estão sendo desaceleradas',
  'automation.state.rateLimitCause':
    'Este espaço de trabalho atingiu o limite de execução de automação para a janela atual. Postagens agendadas e publicações manuais não são afetadas.',
  'automation.state.rateLimitAlternative':
    'As regras com cadência podem ter um intervalo mais longo, o que utiliza menos execuções.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Transforme um feed em rascunhos ou publicações programadas, com a mesma validação e aprovação de qualquer coisa que você mesmo escreve.',
  'automation.rss.empty': 'Nenhum feed ainda',
  'automation.rss.emptyBody':
    'Adicione um feed e Relay verifica-o de acordo com uma programação. Cada novo item se torna um rascunho, uma publicação agendada ou uma solicitação de aprovação, conforme sua escolha.',
  'automation.rss.emptyExample':
    'Exemplo: o feed do blog Acme cria um rascunho para X e LinkedIn cada vez que um artigo é publicado e aguarda um aprovador.',
  'automation.rss.table.caption': 'Alimenta as pesquisas deste espaço de trabalho.',
  'automation.rss.table.feed': 'Alimentação',
  'automation.rss.table.policy': 'O que acontece com um novo item',
  'automation.rss.table.health': 'Saúde',

  'automation.rss.step.url': 'Endereço de alimentação',
  'automation.rss.step.preview': 'Verifique o feed',
  'automation.rss.step.seen': 'Ponto inicial',
  'automation.rss.step.targets': 'Para onde vai',
  'automation.rss.step.template': 'O que diz a publicação',
  'automation.rss.step.policy': 'Como é publicado',
  'automation.rss.stepOf': 'Etapa {current} de {total}',

  'automation.rss.urlHelp':
    'Relay busca o feed de nossos servidores, não do seu navegador. Endereços de rede privada são recusados.',
  'automation.rss.validateAction': 'Verifique este feed',
  'automation.rss.validateFailed': 'Esse endereço não retornou um feed legível',
  'automation.rss.validateFailedReason': 'O que recebemos de volta: {reason}',
  'automation.rss.validateBlocked':
    'Esse endereço aponta para uma rede privada, portanto não foi obtido.',
  'automation.rss.previewTitle': 'Visualização do feed',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# item} other {# itens} many {# itens}} devolvidos, os mais novos primeiro.',
  'automation.rss.previewItemPublished': 'Publicado {dateTime}',
  'automation.rss.previewNoImage': 'Nenhuma imagem neste item',
  'automation.rss.previewImageAlt': 'Imagem do item de feed {title}',
  'automation.rss.previewNoDate':
    'Este item não tem carimbo de data/hora, então Relay usa a hora em que o viu pela primeira vez.',
  'automation.rss.previewFieldsTitle': 'Campos que este feed fornece',
  'automation.rss.previewFieldMissing': 'Não presente neste feed',

  'automation.rss.seenTitle': 'O que conta como já visto',
  'automation.rss.seenLatest':
    'Trate tudo que está atualmente no feed como visto. Apenas itens futuros são postados.',
  'automation.rss.seenAll': 'Trate o item mais novo como novo e publique-o na próxima verificação.',
  'automation.rss.seenHelp':
    'A maioria dos feeds contém artigos antigos. Escolher a primeira opção é como você evita a publicação de um backlog.',

  'automation.rss.targetsHelp':
    'Escolha as contas ou o grupo salvo. Cada destino ainda recebe sua própria validação antes de qualquer coisa ser agendada.',
  'automation.rss.targetGroup': 'Grupo salvo',
  'automation.rss.targetIndividual': 'Contas individuais',

  'automation.rss.templateFields': 'Campos disponíveis',
  'automation.rss.templateInsert': 'Inserir {field}',
  'automation.rss.templateField.title': 'Título do item',
  'automation.rss.templateField.summary': 'Resumo do item',
  'automation.rss.templateField.link': 'Link do item',
  'automation.rss.templateField.author': 'Autor do item',
  'automation.rss.templateField.published': 'Data de publicação',
  'automation.rss.templateField.categories': 'Categorias',
  'automation.rss.templatePreview': 'Prévia com o item mais novo',
  'automation.rss.adaptWithAi': 'Adapte o texto para cada alvo',
  'automation.rss.adaptHelp':
    'O texto é reescrito para se adequar a cada plataforma e mostrado como uma diferença que você aceita ou rejeita. A mídia vem do item de feed. Relay não gera imagens.',
  'automation.rss.noImageGeneration':
    'Se um item do feed não tiver imagem, a publicação sai sem ela.',
  'automation.rss.imageFromFeed': 'Use a imagem do item do feed quando houver uma',

  'automation.rss.policyHelp':
    'Um item de feed não é especial. Ele segue a mesma política de aprovação de uma publicação que você mesmo escreve.',
  'automation.rss.cadenceInterval': 'Um item no máximo a cada',
  'automation.rss.cadenceHelp':
    'Itens extras aguardam na fila em vez de serem publicados juntos, portanto, um feed que publica dez artigos de uma vez não inunda uma conta.',
  'automation.rss.immediateWarning':
    'A publicação imediata envia uma publicação para uma plataforma sem que ninguém a leia primeiro. Ele estará disponível apenas se a política de aprovação dessas contas permitir.',

  'automation.rss.healthTitle': 'Alimentar saúde',
  'automation.rss.healthOk': 'Trabalhando',
  'automation.rss.healthStalled': 'Nenhum item novo para {duration}',
  'automation.rss.healthFailing':
    'A última {count, plural, one {verificação} other {# verificações} many {# verificações}} falhou',
  'automation.rss.health.nextPoll': 'Próxima verificação {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Nenhum item processado ainda} one {# item processado} other {# itens processados} many {# itens processados}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {Nenhuma duplicata ignorada} one {# duplicata ignorada} other {# duplicatas ignoradas} many {# duplicatas ignoradas}}',
  'automation.rss.health.lastPollLabel': 'Última verificação',
  'automation.rss.health.lastItemLabel': 'Último novo item no feed',
  'automation.rss.health.lastPostLabel': 'Último rascunho ou publicação criada',
  'automation.rss.health.processedLabel': 'Itens processados',
  'automation.rss.recentItems': 'Itens recentes',
  'automation.rss.itemOutcome.draft': 'Rascunho criado',
  'automation.rss.itemOutcome.scheduled': 'Programado para {time}',
  'automation.rss.itemOutcome.published': 'Publicado',
  'automation.rss.itemOutcome.awaitingApproval': 'Aguardando aprovação',
  'automation.rss.itemOutcome.duplicate': 'Pular, já visto',
  'automation.rss.itemOutcome.failed': 'Falha: {reason}',
  'automation.rss.pauseFeed': 'Pausar este feed',
  'automation.rss.resumeFeed': 'Retomar este feed',
  'automation.rss.deleteTitle': 'Remover {title}?',
  'automation.rss.deleteBody':
    'Relay para de verificar este feed. Rascunhos e publicações já criados permanecem exatamente como estão.',
  'automation.rss.errorTitle': 'Este feed não pôde ser lido',
  'automation.rss.errorBody':
    'Relay continua verificando a programação normal. Nada foi publicado a partir de uma resposta parcial.',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'Não disponível em nenhuma regra',
  'automation.refuse.body':
    'Curtidas e seguidores automáticos, grupos de engajamento, respostas e mensagens não solicitadas e publicação do mesmo conteúdo de várias contas para torná-lo popular não são opções aqui. As plataformas os proíbem e prejudicam as contas que os utilizam.',
  'automation.refuse.readPolicy': 'Leia a política de uso aceitável',
} as const;
