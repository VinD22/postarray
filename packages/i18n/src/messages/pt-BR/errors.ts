/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'Algo deu errado e não conseguimos classificá-lo.',
  'error.unknown.action':
    'Tente novamente. Se continuar acontecendo, envie-nos a referência abaixo.',
  'error.internal.message': 'Este é um problema da nossa parte, não do seu conteúdo.',
  'error.internal.action':
    'Seu trabalho está salvo. Fomos alertados. Tente novamente em alguns minutos.',
  'error.not_implemented.message': 'Post Array ainda não construiu isso.',
  'error.not_implemented.action': 'Siga o changelog para quando for lançado.',
  'error.offline.message': 'Você está off-line.',
  'error.offline.action':
    'Seu rascunho é mantido neste dispositivo. A publicação e o agendamento serão retomados quando a conexão retornar.',
  'error.network_unreachable.message': 'Não foi possível acessar o servidor.',
  'error.network_unreachable.action': 'Verifique sua conexão e tente novamente. Nada foi perdido.',
  'error.request_invalid.message': 'A solicitação não estava em um formato que possamos aceitar.',
  'error.request_invalid.action': 'Verifique os campos listados abaixo e envie novamente.',
  'error.validation_failed.message':
    'Alguns campos precisam de alteração antes que possam ser salvos.',
  'error.validation_failed.action': 'Corrija os campos destacados.',
  'error.unauthenticated.message': 'Você precisa estar conectado para fazer isso.',
  'error.unauthenticated.action': 'Faça login e nós o traremos de volta aqui.',
  'error.session_expired.message': 'Sua sessão expirou.',
  'error.session_expired.action': 'Faça login novamente. Seu rascunho foi salvo.',
  'error.mfa_required.message': 'Esta ação precisa de confirmação de dois fatores.',
  'error.mfa_required.action': 'Confirme com seu aplicativo autenticador para continuar.',
  'error.forbidden.message': 'Sua função não permite esta ação.',
  'error.forbidden.action':
    'Peça acesso a um proprietário ou administrador deste espaço de trabalho.',
  'error.insufficient_scope.message': 'Esta credencial não tem o escopo {scope}.',
  'error.insufficient_scope.action': 'Conceda esse escopo ou use uma credencial que já o tenha.',
  'error.workspace_not_found.message': 'Esse espaço de trabalho não existe ou você não é membro.',
  'error.workspace_not_found.action': 'Escolha um espaço de trabalho ao qual você pertence.',
  'error.workspace_suspended.message': 'Este espaço de trabalho está suspenso.',
  'error.workspace_suspended.action':
    'Entre em contato com o suporte para resolver o problema. Seus dados estão intactos.',
  'error.not_found.message': 'Esse item não existe mais.',
  'error.not_found.action': 'Pode ter sido excluído. Volte e atualize a lista.',
  'error.conflict.message': 'Alguém mudou isso enquanto você estava trabalhando nisso.',
  'error.conflict.action': 'Revise ambas as versões e salve novamente.',
  'error.idempotency_key_reused.message':
    'Esta chave de idempotência já foi usada para uma solicitação diferente.',
  'error.idempotency_key_reused.action':
    'Use uma nova chave ou repita exatamente a solicitação original.',
  'error.rate_limited.message': 'Muitos pedidos.',
  'error.rate_limited.action': 'Tente novamente depois de {time}.',
  'error.quota_exceeded.message': 'Esta ação ultrapassou o limite do período atual.',
  'error.quota_exceeded.action': 'O limite é redefinido {relativeTime}.',
  'error.payment_required.message': 'Este espaço de trabalho não tem uma assinatura ativa.',
  'error.payment_required.action': 'Inicie a assinatura para publicar novamente. Nada é excluído.',
  'error.subscription_past_due.message': 'O último pagamento não foi realizado.',
  'error.subscription_past_due.action': 'Atualize a forma de pagamento no portal Polar.',
  'error.trial_expired.message': 'O teste terminou em {date}.',
  'error.trial_expired.action': 'Inicie a assinatura para continuar publicando.',
  'error.post_credits_exhausted.message':
    'Este espaço de trabalho usou todas as suas publicações gratuitas. Todo o restante continua funcionando.',
  'error.post_credits_exhausted.action':
    'Escolha um plano para continuar publicando. Suas contas continuam conectadas e seus rascunhos e agendamentos são mantidos.',
  'error.entitlement_missing.message': 'Este espaço de trabalho não tem acesso a esse recurso.',
  'error.entitlement_missing.action':
    'Verifique as configurações de faturamento ou entre em contato com o suporte.',
  'error.channel_limit_reached.message':
    'Este espaço de trabalho já usa todos os canais ativos {limit}.',
  'error.channel_limit_reached.action': 'Desconecte um canal antes de conectar outro.',
  'error.connection_not_found.message': 'Essa conexão não está mais neste espaço de trabalho.',
  'error.connection_not_found.action': 'Conecte a conta novamente para continuar publicando nela.',
  'error.connection_revoked.message': '{account} acesso revogado em {provider}.',
  'error.connection_revoked.action':
    'Reconecte a conta. As publicações agendadas são retomadas depois disso.',
  'error.connection_expired.message': 'O acesso para {account} expirou.',
  'error.connection_expired.action': 'Reconecte a conta para restaurar a publicação e a análise.',
  'error.connection_paused.message': '{account} está em pausa.',
  'error.connection_paused.action': 'Retome em Conexões quando estiver pronto.',
  'error.connection_permission_missing.message':
    '{account} não concedeu a permissão necessária para fazer isso.',
  'error.connection_permission_missing.action':
    'Reconecte e aceite {permission} na tela de consentimento.',
  'error.connection_account_type_invalid.message':
    'Instagram precisa de uma conta profissional. {account} é uma conta pessoal.',
  'error.connection_account_type_invalid.action':
    'Mude para uma conta comercial ou de criador no aplicativo Instagram e reconecte.',
  'error.connection_review_pending.message':
    '{provider} ainda está revisando este aplicativo para {account}.',
  'error.connection_review_pending.action':
    'As publicações são publicadas de forma privada até que a revisão seja aprovada. Atualizamos esta página quando ela muda.',
  'error.capability_unsupported.message':
    '{provider} não oferece isso por meio de sua API oficial.',
  'error.capability_unsupported.action': 'Use um formato compatível com esta conta.',
  'error.capability_not_implemented.message': 'Post Array ainda não construiu isso para {provider}.',
  'error.capability_not_implemented.action':
    'A página de capacidade lista o que cada conector pode fazer hoje.',
  'error.capability_requires_review.message':
    '{provider} concede isso somente após revisar o aplicativo ou a conta.',
  'error.capability_requires_review.action':
    'Ele permanece indisponível até que a revisão seja aprovada.',
  'error.content_invalid.message': '{provider} não aceitará este conteúdo para {account}.',
  'error.content_invalid.action':
    'Os problemas estão listados no alvo. Corrija-os e tente novamente.',
  'error.content_changed_after_approval.message': 'Esta publicação mudou após ser aprovada.',
  'error.content_changed_after_approval.action': 'Solicite aprovação novamente antes de publicar.',
  'error.duplicate_content.message':
    'Conteúdo muito semelhante foi publicado em {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Altere o texto ou publique-o mais tarde. As plataformas restringem publicações duplicadas.',
  'error.cadence_limit_reached.message':
    '{account} atingiu a cadência de publicação definida para este espaço de trabalho.',
  'error.cadence_limit_reached.action':
    'Agende isso para um horário posterior ou aumente o limite de cadência.',
  'error.media_invalid.message': 'Este arquivo não pode ser publicado em {provider}.',
  'error.media_invalid.action': 'O limite exato é mostrado ao lado do arquivo.',
  'error.media_too_large.message': 'Este arquivo é maior do que {provider} aceita.',
  'error.media_too_large.action': 'Comprima ou carregue uma versão menor. O original é mantido.',
  'error.media_processing_failed.message':
    'Não foi possível preparar este arquivo para {provider}.',
  'error.media_processing_failed.action': 'Tente enviá-lo novamente ou use um formato diferente.',
  'error.media_rights_undeclared.message': 'Esta mídia não tem declaração de direitos.',
  'error.media_rights_undeclared.action':
    'Confirme que você tem o direito de publicá-lo, incluindo qualquer pessoa nele.',
  'error.alt_text_required.message': 'Esta imagem precisa de texto alternativo para {provider}.',
  'error.alt_text_required.action': 'Descreva a imagem ou marque-a como decorativa.',
  'error.approval_required.message':
    'Este espaço de trabalho requer aprovação antes da publicação.',
  'error.approval_required.action': 'Solicite aprovação de {approver}.',
  'error.approval_expired.message': 'A aprovação para esta publicação expirou em {date}.',
  'error.approval_expired.action': 'Solicite aprovação novamente.',
  'error.schedule_in_past.message': 'Esse tempo já passou em {timeZone}.',
  'error.schedule_in_past.action': 'Escolha um horário posterior ou publique agora.',
  'error.schedule_conflict.message':
    '{account} já tem uma publicação dentro de {duration} deste período.',
  'error.schedule_conflict.action': 'Mova um deles ou continue se esse espaçamento for pretendido.',
  'error.time_zone_invalid.message': 'Não reconhecemos o fuso horário {timeZone}.',
  'error.time_zone_invalid.action': 'Escolha uma zona da lista.',
  'error.destination_unavailable.message':
    'O destino {destination} não está mais disponível em {provider}.',
  'error.destination_unavailable.action': 'Atualize a lista de destinos e escolha outra.',
  'error.mention_unresolved.message': 'Uma menção não correspondeu a uma conta {provider} real.',
  'error.mention_unresolved.action':
    'Pesquise e selecione a conta ou remova a menção. Nunca publicamos uma tag nativa falsa.',
  'error.provider_transient.message': '{provider} não foi possível processar isso agora.',
  'error.provider_transient.action': 'Tentaremos novamente automaticamente. Nada é duplicado.',
  'error.provider_permanent.message':
    '{provider} rejeitou esta opção e não aceitará nova tentativa.',
  'error.provider_permanent.action': 'A resposta higienizada está no recibo.',
  'error.provider_rate_limited.message': '{provider} taxa limitou este espaço de trabalho.',
  'error.provider_rate_limited.action': 'Tentaremos novamente após {time}.',
  'error.provider_unavailable.message': '{provider} não está respondendo.',
  'error.provider_unavailable.action':
    'Verifique a página de status. Postagens agendadas continuam tentando novamente.',
  'error.provider_content_rejected.message':
    '{provider} rejeitou este conteúdo de acordo com suas próprias políticas.',
  'error.provider_content_rejected.action':
    'O motivo dado está no recibo. Edite o conteúdo ou apele com {provider}.',
  'error.user_action_required.message': '{account} precisa de algo seu antes de publicar.',
  'error.user_action_required.action': 'Abra a conexão para ver o que está faltando.',
  'error.short_link_destination_blocked.message': 'Esse destino não pode ser encurtado.',
  'error.short_link_destination_blocked.action':
    'Redes privadas, esquemas inseguros e destinos abusivos conhecidos são bloqueados.',
  'error.short_link_domain_unverified.message': 'O domínio {domain} ainda não foi verificado.',
  'error.short_link_domain_unverified.action':
    'Adicione o registro DNS mostrado nas configurações e verifique.',
  'error.rss_feed_invalid.message': 'Esse URL não retornou um feed RSS ou Atom válido.',
  'error.rss_feed_invalid.action':
    'Verifique o endereço. Nós o buscamos com segurança e não seguimos redirecionamentos privados.',
  'error.webhook_signature_invalid.message': 'A assinatura naquele webhook não foi verificada.',
  'error.webhook_signature_invalid.action':
    'Verifique se o remetente usa o segredo de assinatura atual. A carga não foi processada.',
  'error.webhook_delivery_failed.message': 'Falha na entrega para {endpoint}.',
  'error.webhook_delivery_failed.action':
    'Tentamos novamente com espera. O log de entrega contém a resposta.',
  'error.automation_rule_not_permitted.message':
    'Essa regra violaria uma regra da plataforma, portanto não pode ser criada.',
  'error.automation_rule_not_permitted.action':
    'Curtidas automatizadas, seguidores, respostas não solicitadas e publicações duplicadas em massa nunca estão disponíveis.',
  'error.ai_unavailable.message': 'O assistente de redação não está disponível no momento.',
  'error.ai_unavailable.action': 'Seu texto está intacto. Tente novamente em breve.',
  'error.ai_output_invalid.message': 'O assistente retornou algo que não conseguimos validar.',
  'error.ai_output_invalid.action': 'Nada foi aplicado ao seu rascunho. Tente novamente.',
  'error.ai_budget_exceeded.message':
    'Este espaço de trabalho atingiu seu limite de assistentes por enquanto.',
  'error.ai_budget_exceeded.action':
    'O limite é redefinido {relativeTime}. Escrever à mão ainda funciona.',
  'error.storage_unavailable.message': 'Não foi possível acessar o armazenamento de mídia.',
  'error.storage_unavailable.action':
    'Seu texto foi salvo. Tente fazer upload novamente em alguns instantes.',
  'error.export_unavailable.message': 'Essa exportação não pôde ser produzida.',
  'error.export_unavailable.action':
    'Experimente uma faixa menor ou entre em contato com o suporte com a referência.',

  'error.reference': 'Referência {correlationId}',
  'error.reportToSupport': 'Envie isto para suporte',
  'error.contentPreserved': 'Seu conteúdo é preservado. Nada foi publicado.',
  'error.project_limit_reached.message':
    'Este espaço de trabalho já usa todos os {limit} projetos ativos.',
  'error.project_limit_reached.action':
    'Arquive um projeto inativo ou altere a cota de projetos do espaço de trabalho.',
  'error.project_has_connections.message':
    'Este projeto ainda tem {connected, plural, one {# canal conectado} other {# canais conectados} many {# canais conectados}}.',
  'error.project_has_connections.action':
    'Desconecte todos os canais deste projeto antes de arquivá-lo.',
  'error.project_last_active.message':
    'Um espaço de trabalho precisa manter pelo menos um projeto ativo.',
  'error.project_last_active.action': 'Crie outro projeto antes de arquivar este.',
} as const;
