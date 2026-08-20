/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'Facebook',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Threads',
  'web.provider.bluesky': 'Bluesky',
  'web.provider.mastodon': 'Mastodon',
  'web.provider.telegram': 'Telegram',
  'web.provider.reddit': 'Reddit',
  'web.provider.wordpress': 'WordPress',
  'web.provider.medium': 'Medium',
  'web.provider.devto': 'Dev.to',
  'web.provider.pinterest': 'Pinterest',
  'web.provider.discord': 'Discord',
  'web.provider.slack': 'Slack',
  'web.connection.requirement.mastodon':
    'O Mastodon conecta com um token de acesso que você cria na sua própria instância, não com sua senha.',
  'web.connection.requirement.telegram':
    'O Relay publica como um bot. Adicione o bot ao canal ou grupo onde você quer publicar.',
  'web.connection.requirement.reddit':
    'Escrever no Reddit exige um aplicativo aprovado, e cada publicação precisa de um título e um subreddit.',
  'web.connection.requirement.wordpress':
    'O Relay publica pela API REST do site com uma senha de aplicativo criada no WordPress.',
  'web.connection.requirement.medium':
    'O Medium conecta via OAuth e o Relay publica histórias públicas em Markdown.',
  'web.connection.requirement.devto':
    'O Dev.to conecta com uma chave de API criada nas suas configurações do Dev.to.',
  'web.connection.requirement.pinterest':
    'Escrever no Pinterest exige acesso de aplicativo aprovado, e um pin precisa de uma imagem e um quadro seu.',
  'web.connection.requirement.discord':
    'O Relay publica como um bot. Adicione o bot aos servidores e canais onde você quer publicar.',
  'web.connection.requirement.slack':
    'O Relay publica como um app. Adicione o app aos canais onde você quer publicar.',
  'web.provider.fake': 'Conector de teste',

  'web.accountType.personal_profile': 'Perfil pessoal',
  'web.accountType.creator_profile': 'Conta do criador',
  'web.accountType.business_profile': 'Conta empresarial',
  'web.accountType.page': 'Página',
  'web.accountType.organization': 'Organização',
  'web.accountType.channel': 'Canal',
  'web.accountType.group': 'Grupo',
  'web.accountType.board': 'Quadro',
  'web.accountType.community': 'Comunidade',
  'web.accountType.publication': 'Publicação',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Tudo agendado, aguardando aprovação, publicado ou bloqueado, em um só lugar.',
  'web.calendar.view.agenda': 'Agenda',
  'web.calendar.view.table': 'Tabela',
  'web.calendar.view.switchLabel': 'Escolha como a programação será definida',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} a {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'Mostrando {range} em {timeZone}',
  'web.calendar.timeZone.workspace': 'Workspace fuso horário: {timeZone}',
  'web.calendar.timeZone.change': 'Alteração nas configurações do espaço de trabalho',
  'web.calendar.jumpToDate': 'Pular para uma data',
  'web.calendar.nowLabel': 'Agora',
  'web.calendar.allDayHeading': 'Ainda não há hora exata',

  'web.calendar.filter.group': 'Grupo de clientes',
  'web.calendar.filter.anyProject': 'Qualquer marca',
  'web.calendar.filter.anyAccount': 'Qualquer conta',
  'web.calendar.filter.anyPlatform': 'Qualquer plataforma',
  'web.calendar.filter.anyStatus': 'Qualquer status',
  'web.calendar.filter.anyLocale': 'Qualquer idioma de conteúdo',
  'web.calendar.filter.anyCampaign': 'Qualquer campanha',
  'web.calendar.filter.anyGroup': 'Todos os grupos',
  'web.calendar.filter.regionLabel': 'Filtre a programação',
  'web.calendar.bucket.scheduled': 'Agendado',
  'web.calendar.bucket.draft': 'Projetos e aprovações',
  'web.calendar.bucket.published': 'Publicado',
  'web.calendar.bucket.failed': 'Precisa de atenção',
  'web.calendar.filter.summary':
    '{count, plural, =0 {Sem filtros} one {# filtro} other {# filtros} many {# filtros}}, {results, plural, =0 {sem publicações} one {# publicação} other {# publicações} many {# publicações}}',

  'web.calendar.grid.label': 'Programação de grade para {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Nada em {time} em {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {Mostrar # mais publicações} other {Mostrar # mais publicações} many {Mostrar # mais publicações}}',
  'web.calendar.month.label': 'Grade do mês para {month}',
  'web.calendar.agenda.label': 'Agenda para {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Nada agendado',

  'web.calendar.table.caption':
    'Todas as publicações em {range}, classificadas por horário de publicação.',
  'web.calendar.table.column.time': 'Tempo',
  'web.calendar.table.column.account': 'Conta',
  'web.calendar.table.column.content': 'Conteúdo',
  'web.calendar.table.column.language': 'Idioma',
  'web.calendar.table.column.media': 'Mídia',
  'web.calendar.table.column.status': 'Status',
  'web.calendar.table.column.approver': 'Aprovador',
  'web.calendar.table.column.campaign': 'Campanha',
  'web.calendar.table.column.actions': 'Ações',
  'web.calendar.table.rowMenu': 'Ações para {title}',
  'web.calendar.table.noApprover': 'Não é necessária aprovação',
  'web.calendar.table.noCampaign': 'Sem campanha',

  'web.calendar.entry.untitled': 'Rascunho sem título',
  'web.calendar.entry.language': 'Idioma {locale}',
  'web.calendar.entry.openDetail': 'Abra {title}',
  'web.calendar.entry.selected': '{title} selecionado. {hint}',
  'web.calendar.detail.title': 'Postagem agendada',
  'web.calendar.detail.close': 'Feche esta publicação',

  'web.calendar.keyboard.title': 'Mova uma publicação com o teclado',
  'web.calendar.keyboard.body':
    'Foque uma publicação e pressione Enter para abri-la. Pressione M para pegar uma publicação, depois use as teclas de seta para movê-la um slot e Enter para confirmar. Pressione Escape para colocá-lo de volta.',
  'web.calendar.keyboard.pickUp': 'Mover esta publicação',
  'web.calendar.keyboard.grabbed':
    '{title} retirado de {from}. As teclas de seta movem-no. Digite confirma. Escape cancelado.',
  'web.calendar.keyboard.moved': 'Hora proposta {to}. Digite confirma.',
  'web.calendar.keyboard.released': '{title} colocado de volta em {from}.',
  'web.calendar.keyboard.stepMinutes': 'Cada etapa dura {minutes} minutos.',

  'web.calendar.reschedule.title': 'Mover esta publicação?',
  'web.calendar.reschedule.subject': '{account} em {provider}',
  'web.calendar.reschedule.from': 'De {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'Para {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Mover publicação',
  'web.calendar.reschedule.dstTitle': 'Os relógios mudam entre esses dois horários',
  'web.calendar.reschedule.dstBody':
    'O deslocamento em {timeZone} é {fromOffset} no horário antigo e {toOffset} no horário novo. A hora local que você escolheu é mantida, então as mudanças instantâneas UTC.',
  'web.calendar.reschedule.conflictTitle': 'Outras publicações estão próximas deste horário',
  'web.calendar.reschedule.conflictBody':
    '{account} já tem {count, plural, one {# publicação} other {# publicações} many {# publicações}} dentro de {window} do novo horário.',
  'web.calendar.reschedule.campaignTitle': 'Conflito de campanha',
  'web.calendar.reschedule.campaignBody':
    'A campanha {campaign} vai de {start} a {end}. O novo horário está fora dessa janela.',
  'web.calendar.reschedule.leadTimeTitle': 'Isso será muito em breve',
  'web.calendar.reschedule.leadTimeBody':
    'O novo horário é {duration} a partir de agora. {provider} precisa de {required} para preparar mídia para este tipo de publicação.',
  'web.calendar.reschedule.pastTitle': 'Esse tempo já passou',
  'web.calendar.reschedule.pastBody': 'Escolha um horário no futuro ou publique agora.',

  'web.calendar.published.title': 'Este publicação já foi publicado',
  'web.calendar.published.body':
    'Existe uma publicação em {provider} em {permalinkLabel}. Mover a entrada em Relay não move a publicação na plataforma. Escolha o que você quer que aconteça.',
  'web.calendar.published.optionLocal': 'Atualize apenas o registro local',
  'web.calendar.published.optionLocalHint':
    'O recibo mantém o tempo real de publicação. Apenas a entrada de planejamento se move, então seu calendário corresponde ao seu plano.',
  'web.calendar.published.optionNew': 'Agende uma nova publicação no novo horário',
  'web.calendar.published.optionNewHint':
    'Isso cria uma segunda publicação externa separada. Aquele que já está em {provider} permanece online.',
  'web.calendar.published.optionLabel': 'O que deveria acontecer',

  'web.calendar.attention.title':
    '{count, plural, one {# a publicação precisa de uma decisão ou uma correção} other {# as publicações precisam de uma decisão ou uma correção} many {# as publicações precisam de uma decisão ou uma correção}}',
  'web.calendar.attention.body': 'Eles ficam aqui e no centro de ação até serem resolvidos.',
  'web.calendar.attention.open': 'Abra o centro de ação',
  'web.calendar.attention.showOnly': 'Mostrar apenas estes',

  'web.calendar.loading': 'Carregando a programação',
  'web.calendar.error.title': 'A programação não pôde ser carregada',
  'web.calendar.error.body':
    'Nada programado mudou. Suas publicações ainda serão publicadas nos horários planejados.',
  'web.calendar.error.retry': 'Tente novamente',
  'web.calendar.empty.example':
    '09:30 Europa/Berlim, X @acme, "Os primeiros comentários programados estão ao vivo", Agendado, 1 imagem',
  'web.calendar.emptyFiltered.body':
    'Nenhuma publicação em {range} corresponde a esses filtros. Amplie o intervalo ou limpe um filtro.',
  'web.calendar.offline.title': 'Você está off-line',
  'web.calendar.offline.body':
    'A programação abaixo é a última cópia que este dispositivo carregou. O reagendamento e a publicação ficam indisponíveis até que a conexão seja retornada.',
  'web.calendar.rateLimited.cause':
    'Esta área de trabalho lê o calendário mais vezes do que a janela atual permite.',
  'web.calendar.rateLimited.resetLabel': 'Você pode tentar novamente em',
  'web.calendar.rateLimited.resetUnknown': '{provider} não disse quando isso será reiniciado.',
  'web.calendar.permission.requirementsLabel': 'Escopo necessário',
  'web.calendar.permission.title': 'Você não pode ver este calendário',
  'web.calendar.permission.body':
    'O acesso ao calendário é concedido por marca. Sua conta não está nas marcas nesta visualização.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Calendário',
  'web.receipt.breadcrumb.post': 'Publicação',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Carregando o recibo de publicação',
  'web.receipt.notFound.title': 'Nenhum recibo com essa referência',
  'web.receipt.notFound.body':
    'Um recibo existe quando uma publicação é despachada. Verifique a referência ou abra a publicação no calendário.',
  'web.receipt.error.title': 'O recibo não pôde ser carregado',
  'web.receipt.error.body': 'O recibo é imutável e não é afetado por isso. Nada foi republicado.',

  'web.receipt.section.summary': 'O que aconteceu',
  'web.receipt.section.timeline': 'Cronograma do evento',
  'web.receipt.section.items': 'Postagem raiz e itens de acompanhamento',
  'web.receipt.section.attempts': 'Tentativas',
  'web.receipt.section.provenance': 'Proveniência',
  'web.receipt.section.cost': 'Uso do provedor',
  'web.receipt.section.analytics': 'Sincronização de análise',
  'web.receipt.section.targets': 'Alvos nesta campanha',

  'web.receipt.item.root': 'Postagem raiz',
  'web.receipt.item.comment': 'Comente {position}',
  'web.receipt.item.thread': 'Parte da rosca {position}',
  'web.receipt.item.delay': 'Executa {delay} após a publicação raiz',
  'web.receipt.item.noDelay': 'Executa com a raiz publicação',
  'web.receipt.item.pending': 'Ainda não iniciado',
  'web.receipt.item.rootUnaffected':
    'A publicação raiz está ativa. Um item de acompanhamento que falha nunca muda isso.',

  'web.receipt.attempt.heading': 'Tentativa {number}',
  'web.receipt.attempt.startedAt': 'Iniciado {time}',
  'web.receipt.attempt.startedLabel': 'Iniciado',
  'web.receipt.attempt.responseSummary': 'Resposta do fornecedor higienizado',
  'web.receipt.attempt.duration': 'Levou {duration}',
  'web.receipt.attempt.httpStatus': 'status HTTP',
  'web.receipt.attempt.providerRequestId': 'Referência de solicitação do provedor',
  'web.receipt.attempt.retryable': 'Repetido automaticamente',
  'web.receipt.attempt.notRetryable': 'Não foi repetida automaticamente',
  'web.receipt.attempt.nextRetry': 'Próxima tentativa de {time}',
  'web.receipt.attempt.nextRetryLabel': 'Próxima tentativa',
  'web.receipt.attempt.showResponse': 'Mostre a resposta do fornecedor higienizado',
  'web.receipt.attempt.hideResponse': 'Ocultar a resposta do provedor higienizado',
  'web.receipt.attempt.none': 'Uma tentativa, sem falhas.',

  'web.receipt.provenance.capabilityVersion': 'Capacidade instantânea',
  'web.receipt.provenance.capabilityHint':
    'O instantâneo usado na aprovação e verificado novamente antes do envio.',
  'web.receipt.provenance.accountType': 'Tipo de conta',
  'web.receipt.provenance.externalAccount': 'Referência de conta externa',
  'web.receipt.provenance.workflow': 'Referência de fluxo de trabalho',
  'web.receipt.provenance.createdAt': 'Recibo escrito {time}',

  'web.receipt.approval.notRequired': 'Nenhuma aprovação foi necessária para esta meta.',
  'web.receipt.approval.policy': 'Política {policy}',
  'web.receipt.approval.unknownPolicy': 'Referência de política não registrada',

  'web.receipt.cost.currency': 'Carregado em {currency}',
  'web.receipt.cost.estimatedLabel': 'Estimado antes da publicação',
  'web.receipt.cost.actualLabel': 'Reconciliado real',
  'web.receipt.provenance.writtenLabel': 'Recibo escrito',
  'web.receipt.cost.reconciledAt': 'Reconciliado {time}',
  'web.receipt.cost.notMetered': '{provider} não cobra por operação para este tipo de publicação.',

  'web.receipt.analytics.never': 'O Analytics ainda não sincronizou esta publicação.',
  'web.receipt.analytics.explain':
    'Provedores agregam em seus próprios horários. O horário abaixo é quando Relay os leu pela última vez, não quando os números eram verdadeiros.',

  'web.receipt.export.download': 'Baixe o recibo',
  'web.receipt.export.copyReference': 'Copiar a referência do recibo',
  'web.receipt.export.denied':
    'O compartilhamento de um recibo requer a função de proprietário, administrador ou aprovador. Você é {role}.',

  'web.receipt.partial.retryFailedOnly': 'Tente novamente apenas os alvos que falharam',
  'web.receipt.partial.retryHint':
    'Uma nova tentativa nunca atinge um alvo que já produziu uma publicação externa.',

  'web.receipt.remediation.user_action_required':
    'Isso precisa de uma alteração em Relay ou em {provider} antes de poder ser executado novamente.',
  'web.receipt.remediation.content_invalid':
    'Edite o conteúdo para que ele passe na validação {provider} e agende-o novamente.',
  'web.receipt.remediation.transient_provider':
    '{provider} retornou um erro temporário. Relay tentou novamente de acordo com sua própria programação.',
  'web.receipt.remediation.permanent_provider':
    '{provider} recusou permanentemente. Tentar novamente o mesmo conteúdo não alterará a resposta.',
  'web.receipt.remediation.internal':
    'Isso foi uma falha da nossa parte. Está registrado com a referência abaixo.',
  'web.receipt.remediation.unknown':
    '{provider} retornou algo para o qual não temos uma regra. A resposta higienizada está abaixo.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Contas',
  'web.connection.tab.capabilities': 'Matriz de capacidade',
  'web.connection.tab.groups': 'Grupos de clientes',
  'web.connection.loading': 'Carregando contas conectadas',
  'web.connection.error.title': 'Não foi possível carregar contas conectadas',
  'web.connection.error.body':
    'A publicação não é afetada. Postagens agendadas ainda são executadas no acesso armazenado.',
  'web.connection.list.label': 'Contas conectadas',
  'web.connection.empty.example':
    'X, @acme, perfil pessoal, conectado em 12 de junho por Ana Ruiz, publicação e métricas, publicado pela última vez em 6 de agosto',
  'web.connection.filter.provider': 'Plataforma',
  'web.connection.filter.health': 'Saúde',
  'web.connection.filter.group': 'Grupo de clientes',
  'web.connection.filter.anyHealth': 'Qualquer saúde',
  'web.connection.healthFilter.healthy': 'Trabalhando',
  'web.connection.healthFilter.expiring_soon': 'Expirando em breve',
  'web.connection.healthFilter.expired': 'Acesso expirado',
  'web.connection.healthFilter.revoked': 'Acesso revogado',
  'web.connection.healthFilter.permission_missing': 'Permissão ausente',
  'web.connection.healthFilter.review_pending': 'Aguardando revisão da plataforma',
  'web.connection.healthFilter.paused': 'Pausado',
  'web.connection.healthFilter.unknown': 'Saúde indisponível',

  'web.connection.row.summaryLabel': 'O que esta conta pode fazer',
  'web.connection.row.expand': 'Mostrar o resumo completo de {account}',
  'web.connection.row.collapse': 'Ocultar o resumo completo de {account}',
  'web.connection.row.metered':
    'Medido por operação. Estimativa de {amount} por publicação criada.',
  'web.connection.row.limitationHeading': 'Limitações nesta conta',
  'web.connection.row.noLimitations': 'Sem produção ou limitação beta nesta conta.',
  'web.connection.row.beta': 'Conector Beta',
  'web.connection.row.betaBody':
    'Este conector funciona, com limites que não terminamos de verificar. Verifique a publicação publicada antes de confiar nela.',

  'web.connection.detail.expiryLabel': 'O acesso expira',
  'web.connection.health.expiresIn': 'O acesso expira em {relativeTime}, em {date}',
  'web.connection.health.noExpiry': 'Este acesso não expira em um horário {provider} nos diz.',
  'web.connection.health.checkedAt': 'Saúde verificada {relativeTime}',

  'web.connection.action.inspect': 'Inspecionar permissões',
  'web.connection.action.viewCapabilities': 'Veja o que ele suporta',
  'web.connection.action.moveGroup': 'Mover para outro grupo',
  'web.connection.action.menu': 'Mais ações para {account}',

  'web.connection.pause.title': 'Pausa {account}?',
  'web.connection.resume.title': 'Currículo {account}?',
  'web.connection.resume.body':
    'As publicações agendadas para esta conta começam a ser publicadas novamente nos horários planejados. Postagens cujo tempo já passou não são disparadas retroativamente.',
  'web.connection.disconnect.confirmWord': 'DESCONECTAR',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# publicação agendada} other {# publicações agendadas} many {# publicações agendadas}} para esta conta não serão publicadas.',
  'web.connection.disconnect.consequence.published':
    'Postagens já publicadas ficam em {provider}. Relay não os exclui.',
  'web.connection.disconnect.consequence.analytics':
    'As métricas já coletadas permanecem neste espaço de trabalho e param de ser atualizadas.',

  'web.connection.connect.title': 'Conecte uma conta',
  'web.connection.connect.chooseProvider': 'Qual plataforma',
  'web.connection.connect.permissionHeading': 'O que Relay pedirá a {provider}',
  'web.connection.connect.requirementHeading': 'Antes de continuar',
  'web.connection.connect.continue': 'Continue para {provider}',
  'web.connection.connect.handoffNote':
    'A próxima tela é {provider}, não Relay. Relay nunca vê sua senha.',
  'web.connection.connect.noWriteWithoutApproval':
    'Conectar uma conta não publica nada. Cada publicação ainda segue esta política de aprovação do espaço de trabalho.',

  'web.connection.requirement.instagram':
    'Instagram a publicação precisa de uma conta profissional, o que significa uma conta comercial ou de criador vinculada a uma página do Facebook.',
  'web.connection.requirement.facebook':
    'Relay publica para Facebook Pages. Um perfil pessoal não pode ser alvo de publicação.',
  'web.connection.requirement.linkedin':
    'Para publicar para uma organização, você precisa de uma função de administrador de conteúdo nessa página LinkedIn.',
  'web.connection.requirement.youtube':
    'Até que o Google conclua a auditoria do aplicativo, os uploads deste projeto serão publicados como privados. Você pode alterar a visibilidade em YouTube posteriormente.',
  'web.connection.requirement.tiktok':
    'TikTok exige que você mesmo escolha o público de cada publicação. Relay não pode pré-selecionar um para você.',
  'web.connection.requirement.x':
    'X cobranças por operação. Uma publicação que contém um URL custa mais do que uma publicação de texto simples, e a estimativa é mostrada antes do agendamento.',
  'web.connection.requirement.threads':
    'A publicação no Threads usa a conta vinculada à sua conta profissional do Instagram.',
  'web.connection.requirement.bluesky':
    'Bluesky se conecta com uma senha de aplicativo criada nas configurações Bluesky, não com a senha da sua conta.',
  'web.connection.requirement.generic':
    'Você precisa de permissão para postar nesta conta na própria plataforma. Relay não pode conceder.',

  'web.connection.purpose.publish': 'Publicando as publicações que você agendou em Relay.',
  'web.connection.purpose.readPosts':
    'Lendo uma publicação Relay publicada, para que o recibo possa provar que está ativa.',
  'web.connection.purpose.identity':
    'Mostrando o nome exato da conta em Relay, para que você nunca publique na conta errada.',
  'web.connection.purpose.analytics':
    'Lendo as métricas que esta plataforma reporta para suas próprias publicações.',
  'web.connection.purpose.refresh':
    'Manter o acesso ativo para que uma publicação agendada não falhe durante a noite.',
  'web.connection.purpose.chooseDestination':
    'Listando as páginas e canais que você pode escolher como alvo de publicação.',

  'web.connection.permissions.title': 'Permissões em {account}',
  'web.connection.permissions.scopeColumn': 'Permissão',
  'web.connection.permissions.stateColumn': 'Estado',
  'web.connection.permissions.purposeColumn': 'Para que Relay o usa',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {# permissão está faltando} other {# permissões estão faltando} many {# permissões estão faltando}}. Reconecte e aceite para restaurar os recursos abaixo.',
  'web.connection.permissions.snapshot': 'Leia de {provider} {relativeTime}',

  'web.connection.capability.title': 'Matriz de capacidade',
  'web.connection.capability.subtitle':
    'Gerado a partir das definições do conector versionado nesta compilação e revisado manualmente. São os mesmos dados que o compositor e a página de capacidade pública usam.',
  'web.connection.capability.tableLabel': 'Capacidades por plataforma',
  'web.connection.capability.featureColumn': 'Capacidade',
  'web.connection.capability.legendTitle': 'Como ler isto',
  'web.connection.capability.legend.supported':
    'Relay pode fazer isso hoje para uma conta conectada do tipo certo.',
  'web.connection.capability.legend.not_implemented':
    'A plataforma oferece isso e Relay ainda não a construiu. Está no roteiro do conector.',
  'web.connection.capability.legend.unsupported':
    'A plataforma não oferece isso através de sua API oficial, portanto nenhuma ferramenta pode fazer isso com segurança.',
  'web.connection.capability.legend.requires_review':
    'Construído, e a plataforma o concede somente após revisar o aplicativo ou a conta.',
  'web.connection.capability.versionLabel': 'Definições do conector',
  'web.connection.capability.version': 'Versão de definições do conector {version}',
  'web.connection.capability.observedAt': 'Instantâneo lido {relativeTime}',
  'web.connection.capability.forAccount': 'Mostrado para {account}',
  'web.connection.capability.noSnapshot':
    'Nenhum instantâneo de capacidade para esta conta ainda. Reconecte para ler um.',
  'web.connection.capability.cellLabel': '{feature} em {provider}: {state}',

  'web.connection.group.title': 'Grupos de clientes',
  'web.connection.group.listLabel': 'Grupos de clientes',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Sem contas} one {# conta} other {# contas} many {# contas}}',
  'web.connection.group.create': 'Criar um grupo',
  'web.connection.group.nameLabel': 'Nome do grupo',
  'web.connection.group.namePlaceholder': 'Acme EU',
  'web.connection.group.moveTitle': 'Mover {account}',
  'web.connection.group.moveLabel': 'Mover para',
  'web.connection.group.moveConfirm': 'Mover conta',
  'web.connection.group.movedAnnouncement': '{account} movido para {group}',
  'web.connection.group.filterCalendarHint':
    'Um grupo filtra o calendário e as análises. Mover uma conta mantém todas as publicações, recibos e métricas que ela já possui.',
  'web.connection.group.empty.title': 'Nenhum grupo de clientes ainda',
  'web.connection.group.empty.body':
    'Um grupo é um cliente ou uma marca. Agrupe contas para filtrar o calendário e as análises por cliente.',

  'web.connection.incident.title': 'Esta conta precisa de atenção',
  'web.connection.incident.remediationHeading': 'O que fazer',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# a publicação agendada está em espera} other {# as publicações agendadas estão em espera} many {# as publicações agendadas estão em espera}} para esta conta.',
  'web.connection.incident.nothingLost': 'Nada se perde e nada se duplica.',
} as const;
