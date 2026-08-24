/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Agentes e API',
  'developer.subtitle':
    'A API, o servidor MCP e a CLI usam as mesmas permissões, política de aprovação e recibos que o aplicativo.',

  'developer.serviceAccount.title': 'Contas de serviço',
  'developer.serviceAccount.create': 'Crie uma conta de serviço',
  'developer.serviceAccount.name': 'Nome',
  'developer.serviceAccount.scopeProjects': 'Projects e contas que ele pode usar',
  'developer.serviceAccount.scopePlatforms': 'Plataformas',
  'developer.serviceAccount.scopeLocales': 'Idiomas de conteúdo',
  'developer.serviceAccount.scopeDomains': 'Domínios de links permitidos',
  'developer.serviceAccount.scopeHours': 'Horários permitidos',
  'developer.serviceAccount.scopeCadence': 'Máximo de publicações por dia',
  'developer.serviceAccount.scopeLookAhead': 'Com que antecedência pode agendar',
  'developer.serviceAccount.approvalLevel': 'Nível de aprovação',
  'developer.serviceAccount.killSwitch': 'Pare este agente',

  'developer.approvalLevel.0': 'Leia e valide apenas',
  'developer.approvalLevel.1': 'Criar e editar rascunhos',
  'developer.approvalLevel.2': 'Agendamento dentro dos limites definidos acima',
  'developer.approvalLevel.3': 'Pergunte a uma pessoa antes de publicar',
  'developer.approvalLevel.description.0':
    'O agente pode consultar contas, recursos, calendários e análises. Não muda nada.',
  'developer.approvalLevel.description.1':
    'O agente pode escrever rascunhos. Uma pessoa ainda agenda e publica.',
  'developer.approvalLevel.description.2':
    'O agente pode agendar dentro das contas, horários, cadência, idiomas, domínios e previsão que você definir. Qualquer coisa fora desses limites precisa de uma pessoa.',
  'developer.approvalLevel.description.3':
    'A publicação imediata, uma nova conta ou domínio, uma ação em massa, conteúdo confidencial ou uma configuração de privacidade alterada sempre precisa de uma confirmação explícita de uma pessoa.',
  'developer.bulkThreshold':
    'Em massa significa mais de {publications, plural, one {# publicação externa} other {# publicações externas} many {# publicações externas}} em uma solicitação, ou o mesmo conteúdo para mais de {accounts, plural, one {# conta} other {# contas} many {# contas}}.',

  'developer.credential.title': 'Credenciais',
  'developer.credential.create': 'Crie uma chave de API',
  'developer.credential.shownOnce':
    'Esta credencial é mostrada uma vez. Copie agora. Armazenamos apenas um hash dele.',
  'developer.credential.prefix': 'Prefixo',
  'developer.credential.created': 'Criado {date} por {name}',
  'developer.credential.lastUsed': 'Último uso {relativeTime}',
  'developer.credential.neverUsed': 'Nunca usado',
  'developer.credential.expires': 'Expira {date}',
  'developer.credential.revokeConfirm':
    'Revogar esta credencial? Qualquer coisa que o utilize para de funcionar imediatamente.',

  'developer.scope.title': 'Escopos',
  'developer.scope.accountsRead': 'Leia as contas conectadas e seus recursos',
  'developer.scope.draftsWrite': 'Criar e editar rascunhos',
  'developer.scope.postsSchedule': 'Agendar conteúdo aprovado',
  'developer.scope.postsPublish': 'Publique imediatamente',
  'developer.scope.analyticsRead': 'Leia as análises',
  'developer.scope.receiptsRead': 'Leia os recibos de publicação',
  'developer.scope.webhooksWrite': 'Gerenciar webhooks',
  'developer.scope.connectionsAdmin': 'Conectar e desconectar contas',
  'developer.scope.billingRead': 'Leia o estado de cobrança',
  'developer.scope.consequential': 'Consequencial',
  'developer.scope.readOnly': 'Somente leitura',

  'developer.setup.title': 'Conecte um cliente',
  'developer.setup.claudeCode': 'Código Claude',
  'developer.setup.codex': 'Códice',
  'developer.setup.hermes': 'Hermes',
  'developer.setup.buzz': 'Fluxo de trabalho do Buzz',
  'developer.setup.cli': 'CLI',
  'developer.setup.genericMcp': 'Qualquer cliente MCP',
  'developer.setup.copyConfig': 'Copiar configuração',
  'developer.setup.mcpEndpoint': 'ponto final MCP',
  'developer.setup.apiBaseUrl': 'URL base da API',

  'developer.playground.title': 'Teste',
  'developer.playground.description':
    'Execute ferramentas em dados propagados. Nada chega a uma plataforma real.',
  'developer.playground.run': 'Executar',
  'developer.playground.sandboxBadge': 'Caixa de areia',

  'developer.activity.title': 'Atividade recente',
  'developer.activity.toolCall': '{tool} chamado por {actor} {relativeTime}',
  'developer.activity.denied': 'Negado: {reason}',
  'developer.activity.empty': 'Nenhuma ligação ainda.',
  'developer.activity.redacted':
    'Os corpos de solicitação e resposta são armazenados com os segredos removidos.',

  'developer.apps.title': 'Aplicativos para desenvolvedores',
  'developer.apps.subtitle':
    'Deixe outro produto agir através de Post Array com as permissões que um usuário concede a ele.',
  'developer.apps.create': 'Registre um aplicativo',
  'developer.apps.name': 'Nome do aplicativo',
  'developer.apps.type.label': 'Tipo de cliente',
  'developer.apps.type.public': 'Público, não pode guardar segredo',
  'developer.apps.type.confidential': 'Confidencial, roda em um servidor',
  'developer.apps.homepage': 'URL da página inicial',
  'developer.apps.privacyUrl': 'URL da política de privacidade',
  'developer.apps.termsUrl': 'URL dos termos',
  'developer.apps.logo': 'Logo',
  'developer.apps.redirectUris': 'Redirecionar URIs',
  'developer.apps.redirectUrisHelp':
    'Somente correspondências exatas. Curingas e caminhos parciais são rejeitados.',
  'developer.apps.clientId': 'ID do cliente',
  'developer.apps.clientSecret': 'Segredo do cliente',
  'developer.apps.secretShownOnce':
    'O segredo é mostrado uma vez. Gire-o se você perdê-lo. Não mostraremos isso novamente.',
  'developer.apps.status.draft': 'Rascunho',
  'developer.apps.status.active': 'Ativo',
  'developer.apps.status.disabled': 'Desativado',
  'developer.apps.consentPreview': 'Visualização da tela de consentimento',
  'developer.apps.grants.title': 'Subsídios ativos',
  'developer.apps.grants.count':
    '{count, plural, one {# concessão} other {# concessões} many {# concessões}}',
  'developer.apps.deleteConfirm':
    'Excluir este aplicativo? Cada concessão é revogada e seus tokens param de funcionar.',

  'developer.consent.title': '{app} deseja acesso ao seu espaço de trabalho',
  'developer.consent.workspace': 'Workspace',
  'developer.consent.projects': 'Projects e contas',
  'developer.consent.willBeAbleTo': '{app} será capaz de',
  'developer.consent.willNotBeAbleTo': '{app} não será capaz de',
  'developer.consent.approvalStillApplies':
    'Sua política de aprovação ainda se aplica. Este aplicativo não pode publicar em torno dele.',
  'developer.consent.revokeAnyTime': 'Você pode revogar isso nas Configurações a qualquer momento.',
  'developer.consent.allow': 'Permitir acesso',
  'developer.consent.deny': 'Não permitir',
  'developer.consent.developerIdentity': 'Publicado por {developer}',

  'developer.grants.title': 'Aplicativos com acesso',
  'developer.grants.grantedOn': 'Concedido {date}',
  'developer.grants.lastUsed': 'Último uso {relativeTime}',
  'developer.grants.revoke': 'Revogar acesso',
  'developer.grants.revoked':
    'Acesso revogado. Suas próprias conexões e publicações agendadas não serão afetadas.',

  'developer.docs.openapi': 'Documento OpenAPI',
  'developer.docs.clients': 'Clientes gerados',
  'developer.docs.idempotency':
    'Envie uma chave de idempotência com cada solicitação de criação, agendamento e publicação. Repetir uma solicitação com a mesma chave retorna o resultado original em vez de publicar duas vezes.',
  'developer.docs.pagination':
    'Os resultados são paginados por cursor. Os horários são explícitos e incluem uma zona.',
  'developer.docs.rateLimits':
    'Os limites de taxa se aplicam por espaço de trabalho, credencial, rota e conector.',
} as const;
