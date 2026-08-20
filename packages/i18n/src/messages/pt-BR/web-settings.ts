/**
 * Web catalog for settings, the developer portal, billing and the Growth
 * Advisor.
 *
 * This file only adds what the web screens need on top of the intent catalogs
 * in `settings.ts`, `developer.ts`, `billing.ts` and `growth.ts`. Everything
 * here lives under a `.ui.` segment so a key can never collide with one of
 * those files when the catalogs are merged.
 *
 * Several strings are mandated word for word and must not be softened:
 *  - `billing.ui.annualFraming` states the saving in currency, never a percent.
 *  - `billing.ui.cancelConfirmedBeforeConversion` must read
 *    "Canceled. You will not be charged."
 *  - the media generation boundary paragraph is NOT restated here. It already
 *    exists as `billing.mediaGeneration.explanation`, and the Tool Radar
 *    renders that same key so there is one sentence to review and translate.
 */
export const webSettingsMessages = {
  /* ------------------------------------------------------------------ shell */

  'settings.ui.subtitle': 'Tudo o que configura este espaço de trabalho. Nada aqui publica nada.',
  'settings.ui.nav.label': 'Seções de configurações',
  'settings.ui.index.help':
    'Escolha uma seção. Cada alteração é atribuída a você e aparece no log de auditoria.',

  'settings.ui.section.members': 'Membros e funções',
  'settings.ui.section.membersSummary':
    'Quem está neste espaço de trabalho e o que cada pessoa pode fazer.',
  'settings.ui.section.projects': 'Projects',
  'settings.ui.section.projectsSummary':
    'Voz, público, reivindicações aprovadas, termos bloqueados, regras de localidade, domínios e glossário.',
  'settings.ui.section.agents': 'Agentes e API',
  'settings.ui.section.agentsSummary':
    'Contas de serviço, escopos, limites, credenciais, atividades e playground de simulação.',
  'settings.ui.section.apps': 'Aplicativos para desenvolvedores',
  'settings.ui.section.appsSummary':
    'Aplicativos OAuth de terceiros, listas de permissões de redirecionamento, consentimento e concessões.',
  'settings.ui.section.webhooks': 'Webhooks',
  'settings.ui.section.webhooksSummary':
    'Eventos de saída assinados, registros de entrega, nova entrega e rotação secreta.',
  'settings.ui.section.referrals': 'Referência e afiliado',
  'settings.ui.section.referralsSummary':
    'Seu link de indicação divulgado, inscrições atribuídas e status de comissão.',
  'settings.ui.section.localization': 'Localização',
  'settings.ui.section.localizationSummary':
    'Idioma da interface, idiomas do conteúdo, mercados, fuso horário e formato da hora.',
  'settings.ui.section.security': 'Segurança',
  'settings.ui.section.securitySummary':
    'Sessões, autenticação de dois fatores, credenciais, agentes, webhooks e concessões de aplicativos.',
  'settings.ui.section.data': 'Controles de dados',
  'settings.ui.section.dataSummary':
    'Exporte, revogue uma conexão, exclua uma marca, exclua conteúdo ou feche a conta.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Carregando {section}',
  'settings.ui.state.errorTitle': 'Não foi possível carregar {section}',
  'settings.ui.state.errorRetry': 'Tente novamente',
  'settings.ui.state.savingAnnouncement': 'Salvando {section}',
  'settings.ui.state.savedAnnouncement': '{section} salvo',
  'settings.ui.state.saveFailedAnnouncement':
    '{section} não foi salvo. Sua opinião ainda está aqui.',
  'settings.ui.state.offlineTitle': 'Você está off-line',
  'settings.ui.state.offlineBody':
    'Você pode ler esta página. As alterações não podem ser salvas até que a conexão seja restabelecida.',
  'settings.ui.state.permissionTitle': 'Você não tem acesso a {section}',
  'settings.ui.state.permissionBody':
    'Esta seção altera o comportamento do espaço de trabalho, por isso é limitado por função.',
  'settings.ui.state.permissionRequirements': 'O que você precisa',
  'settings.ui.state.permissionContact':
    'Um proprietário ou administrador deste espaço de trabalho pode concedê-lo. Eles estão listados em Membros e funções.',
  'settings.ui.state.rateLimitTitle': 'Muitas mudanças em pouco tempo',
  'settings.ui.state.rateLimitCause':
    'Este espaço de trabalho atingiu o limite de gravação para alterações nas configurações.',
  'settings.ui.state.rateLimitReset': 'Redefinições de limite',
  'settings.ui.state.rateLimitAlternative':
    'Nada que você salvou foi perdido. As ações somente leitura ainda funcionam enquanto você espera.',
  'settings.ui.state.rateLimitUsage': 'Configurações escreve esta hora',
  'settings.ui.state.rateLimitUsageText': '{used} de {limit} usado',
  'settings.ui.state.unsavedTitle': 'Você tem alterações não salvas',
  'settings.ui.state.unsavedBody': 'Salve-os antes de sair desta seção.',
  'settings.ui.state.readOnlyTitle': 'Este espaço de trabalho é somente leitura',
  'settings.ui.state.readOnlyBody':
    'O faturamento está vencido. Seu conteúdo, recibos e conexões estão intactos. As configurações podem ser lidas, mas não alteradas.',

  'settings.ui.state.referenceLabel': 'Referência de suporte',

  'settings.ui.attribution': 'Alterado por {name} {relativeTime}',
  'settings.ui.attributionNever': 'Não mudou desde que foi criado',
  'settings.ui.copyFailed':
    'Seu navegador bloqueou a cópia. Selecione o texto e copie-o manualmente.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'Cada convite, mudança de função e remoção é registrado com seu nome e horário.',
  'settings.ui.members.tableCaption': 'Pessoas neste espaço de trabalho, com função e escopo',
  'settings.ui.members.column.person': 'Pessoa',
  'settings.ui.members.column.role': 'Função',
  'settings.ui.members.column.scope': 'Escopo',
  'settings.ui.members.column.approvals': 'Aprovações',
  'settings.ui.members.column.lastActive': 'Último ativo',
  'settings.ui.members.column.actions': 'Ações',
  'settings.ui.members.scopeAll': 'Todas as marcas e contas',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {# marca} other {# marcas} many {# marcas}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Pode aprovar',
  'settings.ui.members.approvals.cannotApprove': 'Não é possível aprovar',
  'settings.ui.members.approvals.canApproveOwnProjects': 'Pode aprovar as marcas listadas',
  'settings.ui.members.lastActiveNever': 'Ainda não fez login',
  'settings.ui.members.changeRole': 'Alterar função para {name}',
  'settings.ui.members.remove': 'Remover {name}',
  'settings.ui.members.lastOwnerTitle': 'Um espaço de trabalho mantém pelo menos um proprietário',
  'settings.ui.members.lastOwnerBody':
    'Primeiro, torne outra pessoa proprietária e, em seguida, essa alteração ficará disponível.',
  'settings.ui.members.inviteTitle': 'Convide alguém para este espaço de trabalho',
  'settings.ui.members.inviteBody':
    'Eles recebem um email com um link. O convite expira após sete dias e você pode revogá-lo antes disso.',
  'settings.ui.members.inviteRole': 'Função',
  'settings.ui.members.inviteScope': 'Projects em que eles podem trabalhar',
  'settings.ui.members.inviteScopeAll': 'Todas as marcas neste espaço de trabalho',
  'settings.ui.members.inviteScopeSelected': 'Somente as marcas que eu selecionar',
  'settings.ui.members.inviteApprovals': 'Pode decidir solicitações de aprovação',
  'settings.ui.members.inviteApprovalsHelp':
    'Somente funções que já incluem revisão podem receber isso. É separado da edição.',
  'settings.ui.members.inviteSubmit': 'Enviar convite',
  'settings.ui.members.invitePending': 'Convidado {relativeTime} por {name}',
  'settings.ui.members.inviteRevoke': 'Revogar convite',
  'settings.ui.members.inviteResend': 'Envie o convite novamente',
  'settings.ui.members.emptyTitle': 'Você é a única pessoa aqui',
  'settings.ui.members.emptyBody':
    'Convide as pessoas que escrevem, aprovam ou leem os resultados. Cada um recebe uma função e um escopo de marca.',
  'settings.ui.members.emptyExample':
    'Um formato comum: um proprietário para faturamento, um aprovador por marca e editores que redigem, mas nunca publicam.',
  'settings.ui.members.roleReferenceTitle': 'O que cada função pode fazer',
  'settings.ui.members.roleReferenceCaption': 'Funções e as ações que cada uma permite',
  'settings.ui.members.roleColumn.role': 'Função',
  'settings.ui.members.roleColumn.can': 'Pode fazer',
  'settings.ui.members.roleColumn.cannot': 'Não é possível fazer',
  'settings.ui.members.roleCannot.owner': 'Nada é negado ao proprietário.',
  'settings.ui.members.roleCannot.admin': 'Altere o faturamento ou exclua o espaço de trabalho.',
  'settings.ui.members.roleCannot.manager':
    'Alterar cobrança, funções ou exclusão do espaço de trabalho.',
  'settings.ui.members.roleCannot.editor': 'Aprovar, agendar, publicar ou alterar conexões.',
  'settings.ui.members.roleCannot.approver': 'Alterar conexões, regras ou cobrança.',
  'settings.ui.members.roleCannot.analyst': 'Crie, edite, aprove ou publique qualquer coisa.',
  'settings.ui.members.roleCannot.viewer': 'Mude qualquer coisa.',
  'settings.ui.members.removeTitle': 'Remova {name} deste espaço de trabalho',
  'settings.ui.members.removeConsequence.access':
    'Eles perdem o acesso imediatamente, em todas as superfícies.',
  'settings.ui.members.removeConsequence.drafts':
    'Os rascunhos que eles escreveram permanecem na área de trabalho e permanecem editáveis.',
  'settings.ui.members.removeConsequence.audit':
    'Suas ações anteriores permanecem no registro de auditoria e nos recibos.',
  'settings.ui.members.removeConsequence.approvals':
    'As solicitações de aprovação que aguardam retornam à fila para outro aprovador.',

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'Uma marca segue as regras pelas quais o conteúdo é verificado: o que você pode reivindicar, o que não pode dizer e como cada idioma é escrito.',
  'settings.ui.projects.listCaption': 'Projects nesta área de trabalho',
  'settings.ui.projects.column.project': 'Project',
  'settings.ui.projects.column.locales': 'Idiomas de conteúdo',
  'settings.ui.projects.column.accounts': 'Contas',
  'settings.ui.projects.column.updated': 'Atualizado',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Sem contas} one {# conta} other {# contas} many {# contas}}',
  'settings.ui.projects.emptyTitle': 'Nenhuma marca ainda',
  'settings.ui.projects.emptyBody':
    'A marca agrupa contas, regras de aprovação e regras de idioma. A maioria das equipes começa com uma e adiciona uma segunda quando um cliente ou mercado precisa de regras diferentes.',
  'settings.ui.projects.emptyExample':
    'Exemplo: marca "Acme EU", idiomas inglês e alemão, termo bloqueado "garantido", divulgação "Parceria paga" em Instagram.',
  'settings.ui.projects.voiceHelp':
    'Como essa marca soa. Usado quando você solicita uma reescrita e quando as reivindicações são verificadas.',
  'settings.ui.projects.audienceHelp': 'A quem se destina o conteúdo, por mercado.',
  'settings.ui.projects.approvedClaimsHelp':
    'Declarações que um revisor limpou. Qualquer coisa fora desta lista é sinalizada antes da aprovação, não após a publicação.',
  'settings.ui.projects.blockedTermsHelp':
    'Palavras que bloqueiam agendamento para esta marca. Um por linha.',
  'settings.ui.projects.domainsHelp':
    'Domínios aos quais esta marca pode vincular e encurtar. Somente domínios verificados podem ser selecionados no compositor.',
  'settings.ui.projects.domainVerified': 'Verificado {date}',
  'settings.ui.projects.domainPending': 'Registro DNS ainda não visto',
  'settings.ui.projects.glossaryHelp':
    'Nomes de produtos, termos legais e qualquer coisa que deva sobreviver a uma tradução inalterada.',
  'settings.ui.projects.glossaryCaption': 'Termos protegidos e como cada um é tratado por idioma',
  'settings.ui.projects.glossaryEmpty':
    'Ainda não há termos protegidos. Adicione nomes de produtos e termos legais que não devem ser traduzidos ou reformulados.',
  'settings.ui.projects.localeRulesHelp':
    'Regras por idioma do conteúdo. Eles são aplicados quando você adapta ou transcria e são mostrados ao revisor.',
  'settings.ui.projects.saveProject': 'Salvar marca',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'Três configurações separadas: o idioma deste aplicativo, os idiomas em que você publica e os mercados para os quais você está escrevendo. Mudar um nunca muda outro.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Escolha um idioma de interface para este aplicativo. Os idiomas do conteúdo são separados e já estão disponíveis.',
  'settings.ui.localization.marketHelp':
    'Um mercado muda exemplos, divulgações legais e apelos à ação. Isso não altera o idioma de uma publicação.',
  'settings.ui.localization.previewTitle': 'Como serão lidas as datas e os números',
  'settings.ui.localization.previewDate': 'Data',
  'settings.ui.localization.previewTime': 'Tempo',
  'settings.ui.localization.previewNumber': 'Número',
  'settings.ui.localization.previewCurrency': 'Moeda',
  'settings.ui.localization.weekStartHelp': 'Usado pela visualização da semana do calendário.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'Tudo o que pode atuar neste espaço de trabalho, em um só lugar: suas sessões, credenciais, agentes, webhooks e os aplicativos aos quais você concedeu acesso.',
  'settings.ui.security.sessionsCaption': 'Sessões assinadas para sua conta',
  'settings.ui.security.sessionColumn.device': 'Dispositivo e navegador',
  'settings.ui.security.sessionColumn.location': 'Localização aproximada',
  'settings.ui.security.sessionColumn.lastSeen': 'Última utilização',
  'settings.ui.security.sessionCurrent': 'Esta sessão',
  'settings.ui.security.sessionRevokeAll': 'Sair a cada duas sessões',
  'settings.ui.security.sessionLocationUnknown': 'Local não registrado',
  'settings.ui.security.mfaOn': 'A autenticação de dois fatores está ativada',
  'settings.ui.security.mfaOff': 'A autenticação de dois fatores está desativada',
  'settings.ui.security.mfaBody':
    'Um segundo fator é necessário antes de alterações de faturamento, criação de conta de serviço, reconexão de uma conta e revogação de credenciais.',
  'settings.ui.security.credentialsTitle': 'Chaves API',
  'settings.ui.security.credentialsBody':
    'Chaves pertencentes a este espaço de trabalho. Eles são separados das concessões de aplicativos e da sua própria sessão.',
  'settings.ui.security.agentsTitle': 'Contas de serviço',
  'settings.ui.security.webhooksTitle': 'Extremidades do Webhook',
  'settings.ui.security.grantsTitle': 'Aplicativos que você permitiu',
  'settings.ui.security.grantsBody':
    'A revogação de um aplicativo interrompe seus tokens imediatamente. Suas próprias conexões e publicações agendadas não são afetadas.',
  'settings.ui.security.grantScopes': 'Permissões concedidas',
  'settings.ui.security.socialPermissionsTitle': 'Permissões de conta social',
  'settings.ui.security.socialPermissionsBody':
    'O que cada conta conectada permitiu que Relay fizesse, a partir do instantâneo de capacidade obtido no momento da conexão.',
  'settings.ui.security.viewInSection': 'Gerenciar em {section}',
  'settings.ui.security.emptySessions': 'Somente esta sessão está conectada.',
  'settings.ui.security.emptyGrants':
    'Nenhum aplicativo de terceiros tem acesso a este espaço de trabalho. Os aplicativos aparecem aqui depois que você os permite em uma tela de consentimento.',
  'settings.ui.security.revokeGrantTitle': 'Revogar acesso para {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Seus tokens de acesso e atualização param de funcionar imediatamente.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Postagens já agendadas ficam agendadas. Cancele-os separadamente se quiser que sejam interrompidos.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'O aplicativo pode solicitar acesso novamente e você pode recusar.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'Compartilhe Relay com um link divulgado. A Comissão nunca está condicionada a uma avaliação positiva.',
  'settings.ui.referral.linkLabel': 'Seu link de indicação',
  'settings.ui.referral.tableCaption': 'Inscrições atribuídas e seu estado de comissão',
  'settings.ui.referral.column.signup': 'Inscreva-se',
  'settings.ui.referral.column.date': 'Data',
  'settings.ui.referral.column.state': 'Comissão',
  'settings.ui.referral.column.amount': 'Quantidade',
  'settings.ui.referral.emptyTitle': 'Nenhuma inscrição atribuída ainda',
  'settings.ui.referral.emptyBody':
    'As inscrições aparecem aqui assim que alguém inicia um teste através do seu link. Os valores permanecem pendentes até o encerramento do período de reembolso.',
  'settings.ui.referral.emptyExample':
    'Linha de exemplo: acme.example, iniciou um teste em 12 de junho, pendente até 12 de julho e depois aprovado.',
  'settings.ui.referral.termsLink': 'Leia os termos do parceiro',
  'settings.ui.referral.balance': 'Comissão aprovada',
  'settings.ui.referral.balanceUnavailableReason':
    'O livro-razão de comissões ainda não foi reconciliado para este período.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'Uma conta de serviço é uma identidade nomeada para um agente, um script ou um fluxo de trabalho. Ele carrega seus próprios escopos, seus próprios limites e sua própria trilha de auditoria.',
  'developer.ui.agents.emptyTitle': 'Nenhuma conta de serviço ainda',
  'developer.ui.agents.emptyBody':
    'Crie um para cada automação executada. Contas separadas significam que você pode revogar uma sem interromper as outras.',
  'developer.ui.agents.emptyExample':
    'Exemplo: "Agente de conteúdo", marca Acme EU, pode redigir e agendar até 6 publicações por dia entre 07h00 e 22h00, nunca publica imediatamente.',
  'developer.ui.agents.step.identity': 'Nome e finalidade',
  'developer.ui.agents.step.scope': 'O que pode alcançar',
  'developer.ui.agents.step.limits': 'Limites',
  'developer.ui.agents.purpose': 'Para que serve esta conta',
  'developer.ui.agents.purposeHelp':
    'Uma frase. Ele aparece ao lado de cada ação realizada por esta conta no registro de auditoria.',
  'developer.ui.agents.scopeHelp':
    'Um escopo concede exatamente a si mesmo. Nada aqui implica outra coisa.',
  'developer.ui.agents.limitsHelp':
    'Os limites são impostos pela API, não pelo agente. Um agente não pode aumentar seu próprio limite.',
  'developer.ui.agents.quietHours': 'Horas de silêncio',
  'developer.ui.agents.quietHoursHelp':
    'A conta não pode agendar ou publicar dentro deste horário, no fuso horário do espaço de trabalho.',
  'developer.ui.agents.lookAheadHelp':
    'A que distância no futuro uma publicação pode ser colocada.',
  'developer.ui.agents.cadenceHelp':
    'O máximo de publicações externas que isso pode causar em um dia.',
  'developer.ui.agents.expiry': 'Expiração da credencial',
  'developer.ui.agents.expiryHelp':
    'Uma vida mais curta é mais segura. Você pode girar a qualquer momento.',
  'developer.ui.agents.summaryTitle': 'Antes de criá-lo',
  'developer.ui.agents.summaryAccounts': 'Contas que pode alcançar',
  'developer.ui.agents.summaryMaxActions':
    'No máximo {count, plural, one {# publicação externa} other {# publicações externas} many {# publicações externas}} por dia.',
  'developer.ui.agents.summaryApproval': 'Comportamento de aprovação',
  'developer.ui.agents.summaryCreate': 'Criar conta de serviço',
  'developer.ui.agents.detailTitle': 'Conta de serviço',
  'developer.ui.agents.statusActive': 'Ativo',
  'developer.ui.agents.statusStopped': 'Parado',
  'developer.ui.agents.statusExpired': 'Credencial expirada',
  'developer.ui.agents.stoppedBody':
    'Esta conta foi interrompida. Cada chamada que faz é recusada com um motivo claro. Nada que ele criou foi removido.',
  'developer.ui.agents.killTitle': 'Pare {name}',
  'developer.ui.agents.killConsequence.calls':
    'Todas as chamadas de API, MCP e CLI desta conta são recusadas imediatamente.',
  'developer.ui.agents.killConsequence.scheduled':
    'Postagens já agendadas ficam agendadas. Cancele-os do calendário se quiser que sejam interrompidos.',
  'developer.ui.agents.killConsequence.reversible': 'Você pode reiniciá-lo mais tarde.',
  'developer.ui.agents.resume': 'Iniciar este agente novamente',
  'developer.ui.agents.rotate': 'Rodar credencial',
  'developer.ui.agents.rotateTitle': 'Rode a credencial para {name}',
  'developer.ui.agents.rotateConsequence.old':
    'A credencial atual para de funcionar imediatamente.',
  'developer.ui.agents.rotateConsequence.new': 'O novo é mostrado uma vez, nesta página.',
  'developer.ui.agents.rotateConsequence.clients':
    'Qualquer coisa que use o valor antigo falhará até que você o atualize.',
  'developer.ui.agents.credentialStored': 'Eu armazenei esta credencial',
  'developer.ui.agents.credentialLabel': 'Credencial da conta de serviço',
  'developer.ui.agents.credentialWarning': 'Esta é a única vez que esta credencial é mostrada',
  'developer.ui.agents.credentialWarningBody':
    'Copie-o para seu armazenamento secreto agora. Mantemos apenas um hash, por isso não podemos mostrá-lo novamente. Girar cria um novo.',
  'developer.ui.agents.credentialConsumed':
    'A credencial não é mais exibida. Gire-o se você não o armazenou.',
  'developer.ui.agents.credentialReveal': 'Mostrar credencial',
  'developer.ui.agents.credentialHide': 'Ocultar credencial',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read': 'Veja suas contas conectadas e o que cada uma pode fazer',
  'developer.ui.scope.accounts_write': 'Renomeie contas e altere a forma como elas são agrupadas',
  'developer.ui.scope.drafts_read': 'Leia seus rascunhos e suas variantes',
  'developer.ui.scope.drafts_write': 'Criar e editar rascunhos',
  'developer.ui.scope.posts_schedule': 'Agende conteúdo aprovado para suas contas',
  'developer.ui.scope.posts_publish': 'Publique em suas contas imediatamente',
  'developer.ui.scope.posts_cancel': 'Cancelar publicações agendadas',
  'developer.ui.scope.analytics_read': 'Leia análises de suas contas',
  'developer.ui.scope.media_read': 'Veja os arquivos em sua biblioteca',
  'developer.ui.scope.media_write': 'Carregue e edite arquivos em sua biblioteca',
  'developer.ui.scope.rules_read': 'Leia suas regras de automação',
  'developer.ui.scope.rules_write': 'Criar e alterar regras de automação que podem publicar',
  'developer.ui.scope.growth_read': 'Leia seus planos de crescimento',
  'developer.ui.scope.growth_write': 'Criar e editar planos de crescimento',
  'developer.ui.scope.webhooks_manage': 'Criar e alterar endpoints de webhook',
  'developer.ui.scope.billing_read': 'Leia seu plano, estado de teste e uso',
  'developer.ui.scope.connections_admin': 'Conectar e desconectar contas sociais',

  'developer.ui.activity.caption':
    'Chamadas de ferramentas recentes, com aquelas que foram recusadas',
  'developer.ui.activity.column.time': 'Tempo',
  'developer.ui.activity.column.tool': 'Ferramenta ou rota',
  'developer.ui.activity.column.outcome': 'Resultado',
  'developer.ui.activity.column.subject': 'Assunto',
  'developer.ui.activity.outcome.ok': 'Permitido',
  'developer.ui.activity.outcome.denied': 'Negado',
  'developer.ui.activity.outcome.failed': 'Falha',
  'developer.ui.activity.filterDenied': 'Mostrar apenas tentativas negadas',
  'developer.ui.activity.deniedExplain':
    'Uma tentativa negada é como um agente mal configurado se mostra. Essas linhas são mantidas, não ocultas.',
  'developer.ui.activity.emptyTitle': 'Nenhuma chamada gravada ainda',
  'developer.ui.activity.emptyBody':
    'As chamadas aparecem aqui alguns segundos depois de acontecerem, incluindo as que foram recusadas.',
  'developer.ui.activity.emptyExample':
    'Exemplo de linha: 12:03, draft_post, Permitido, rascunho para conta X @acme.',

  'developer.ui.setup.help':
    'Cole isso no cliente que você está conectando. Substitua o espaço reservado da credencial pelo valor que você armazenou.',
  'developer.ui.setup.credentialPlaceholder':
    'O snippet usa um espaço reservado. Nunca envie a credencial real para um repositório.',
  'developer.ui.setup.copySnippet': 'Copiar snippet para {client}',
  'developer.ui.setup.snippetCopied': 'Trecho copiado',
  'developer.ui.setup.tabLabel': 'Snippets de configuração do cliente',

  'developer.ui.playground.help':
    'As chamadas são executadas em uma cópia propagada deste espaço de trabalho. Nenhum provedor é contatado e nada é agendado.',
  'developer.ui.playground.tool': 'Ferramenta',
  'developer.ui.playground.arguments': 'Argumentos',
  'developer.ui.playground.argumentsHelp': 'JSON. O mesmo corpo que a API real aceita.',
  'developer.ui.playground.result': 'Resultado',
  'developer.ui.playground.resultEmpty':
    'Execute uma ferramenta para ver a resposta que ela retornaria.',
  'developer.ui.playground.invalidJson':
    'Este JSON ainda não é válido, portanto não pode ser enviado.',
  'developer.ui.playground.deniedByApproval':
    'O nível de aprovação {level} não permite esta chamada. A simulação recusa exatamente como a API faria.',
  'developer.ui.playground.announceResult': 'Teste finalizado. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'Registre um aplicativo para que outras pessoas possam conceder acesso ao seu espaço de trabalho. Cada aplicativo tem sua própria identidade, sua própria lista de permissões de redirecionamento e sua própria trilha de auditoria.',
  'developer.ui.apps.emptyTitle': 'Nenhum aplicativo registrado',
  'developer.ui.apps.emptyBody':
    'Registre um aplicativo quando outro produto precisar agir em nome de um usuário Relay. Para sua própria automação, use uma conta de serviço.',
  'developer.ui.apps.emptyExample':
    'Exemplo: "Acme Publisher", cliente confidencial, redirecionamento https://acme.example/oauth/callback, escopos de contas: leitura e rascunhos: gravação.',
  'developer.ui.apps.typeHelp':
    'Um cliente confidencial é executado em um servidor que você controla e pode manter um segredo. Um cliente público é um navegador ou aplicativo de desktop e usa PKCE sem segredo.',
  'developer.ui.apps.redirectAdd': 'Adicione um URI de redirecionamento',
  'developer.ui.apps.redirectRemove': 'Remover {uri}',
  'developer.ui.apps.redirectInvalid':
    'Insira um URI https completo sem curinga e sem string de consulta. Ele deve corresponder exatamente ao valor que seu aplicativo envia.',
  'developer.ui.apps.linksTitle': 'Links publicados',
  'developer.ui.apps.linksHelp':
    'Eles aparecem na tela de consentimento. Um usuário que não consegue contatá-los não concederá acesso.',
  'developer.ui.apps.linkUnreachable':
    'Não foi possível acessar este URL na última verificação, {date}.',
  'developer.ui.apps.linkReachable': 'Alcançável, verificado {date}',
  'developer.ui.apps.scopesTitle': 'Permissões que este aplicativo pode solicitar',
  'developer.ui.apps.scopesHelp':
    'Peça o mínimo que você precisa. Um usuário vê as permissões de leitura e as permissões consequentes como dois grupos separados.',
  'developer.ui.apps.scopeGroup.read': 'Permissões de leitura',
  'developer.ui.apps.scopeGroup.reversible': 'Alterações que você pode desfazer',
  'developer.ui.apps.scopeGroup.consequential': 'Permissões consequentes',
  'developer.ui.apps.scopeGroupHelp.read':
    'Eles permitem que o aplicativo analise os dados. Nada muda.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Eles permitem que o aplicativo crie ou edite coisas dentro de Relay. Nada chega a uma plataforma.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Isso pode causar uma publicação em uma conta real ou alterar quem pode acessar suas contas. Eles são sempre listados separadamente e nunca são agrupados.',
  'developer.ui.apps.noBundling':
    'Não há escopo de acesso combinado. A cobrança e a administração da conexão são sempre solicitadas pelo nome.',
  'developer.ui.apps.secretTitle': 'Segredo do cliente',
  'developer.ui.apps.secretWarning': 'Esta é a única vez que o segredo do cliente é mostrado',
  'developer.ui.apps.secretWarningBody':
    'Armazene-o no gerenciador de segredos do lado do servidor agora. Mantemos apenas um hash. Se você perdê-lo, gire-o: não há como revelá-lo novamente.',
  'developer.ui.apps.secretConsumed':
    'O segredo não é mais exibido. Gire-o se você não o armazenou.',
  'developer.ui.apps.secretStored': 'Eu armazenei este segredo',
  'developer.ui.apps.secretPublicClient':
    'Um cliente público não tem segredo. Ele usa o fluxo de código de autorização com PKCE.',
  'developer.ui.apps.rotateTitle': 'Alterne o segredo do cliente para {app}',
  'developer.ui.apps.rotateConsequence.old': 'O segredo atual para de funcionar imediatamente.',
  'developer.ui.apps.rotateConsequence.grants':
    'As concessões de usuários existentes não são revogadas.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Seus servidores não atualizam os tokens até que você implemente o novo valor.',
  'developer.ui.apps.consentPreviewTitle': 'Visualização da tela de consentimento',
  'developer.ui.apps.consentPreviewHelp':
    'Isso é o que o usuário vê. Ele é gerado a partir do registro do aplicativo, portanto não pode prometer mais do que o aplicativo pede.',
  'developer.ui.apps.consentPreviewSample':
    'Apenas visualização. Nada é concedido e nenhum token é emitido.',
  'developer.ui.apps.grantsCaption': 'Workspaces que concederam acesso a este aplicativo',
  'developer.ui.apps.grantColumn.workspace': 'Workspace',
  'developer.ui.apps.grantColumn.scopes': 'Escopos',
  'developer.ui.apps.grantColumn.granted': 'Concedido',
  'developer.ui.apps.grantColumn.lastUsed': 'Última utilização',
  'developer.ui.apps.grantsEmpty': 'Ninguém concedeu acesso a este aplicativo ainda.',
  'developer.ui.apps.logsCaption': 'Solicitações recentes, com segredos e cargas removidas',
  'developer.ui.apps.logColumn.time': 'Tempo',
  'developer.ui.apps.logColumn.route': 'Rota',
  'developer.ui.apps.logColumn.status': 'Status',
  'developer.ui.apps.logColumn.workspace': 'Workspace',
  'developer.ui.apps.logsRedacted':
    'Os corpos de solicitação e resposta são armazenados com credenciais, tokens e conteúdo do usuário removidos.',
  'developer.ui.apps.sandboxTitle': 'Credenciais de sandbox',
  'developer.ui.apps.sandboxBody':
    'Um ID de cliente e espaço de trabalho separados com dados propagados. As chamadas feitas com ele nunca chegam a um provedor.',
  'developer.ui.apps.rateLimitLabel': 'Limite de taxa',
  'developer.ui.apps.rateLimitUsage': '{used} de {limit} solicitações nesta hora',
  'developer.ui.apps.disable': 'Desativar aplicativo',
  'developer.ui.apps.enable': 'Ativar aplicativo',
  'developer.ui.apps.disabledBody':
    'Este aplicativo está desativado. Os tokens existentes são recusados ​​e nenhuma nova concessão pode ser iniciada. As concessões são mantidas para que você possa ativá-las novamente.',
  'developer.ui.apps.deleteTitle': 'Excluir {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Toda concessão é revogada e todo token para de funcionar.',
  'developer.ui.apps.deleteConsequence.logs':
    'Os registros de solicitação são mantidos durante o período de retenção de auditoria.',
  'developer.ui.apps.deleteConsequence.irreversible': 'O ID do cliente não pode ser reutilizado.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Entregas HTTPS assinadas para os eventos que você escolher. Cada entrega é registrada com sua resposta e qualquer entrega pode ser enviada novamente.',
  'developer.ui.webhooks.emptyTitle': 'Nenhum endpoint ainda',
  'developer.ui.webhooks.emptyBody':
    'Adicione um endpoint para receber resultados de publicação, decisões de aprovação e integridade da conexão em seus próprios sistemas.',
  'developer.ui.webhooks.emptyExample':
    'Exemplo: https://hooks.acme.example/relay, inscrito em publicação.published, publicação.failed e connection.action_required.',
  'developer.ui.webhooks.create': 'Adicionar um ponto de extremidade',
  'developer.ui.webhooks.url': 'URL do ponto final',
  'developer.ui.webhooks.urlHelp':
    'apenas HTTPS. Não seguimos redirecionamentos e não tentamos novamente um 2xx.',
  'developer.ui.webhooks.eventsTitle': 'Eventos',
  'developer.ui.webhooks.eventsHelp':
    'Escolha os eventos que você gerencia. Enviar tudo para um endpoint que ignora a maior parte torna as falhas mais difíceis de ver.',
  'developer.ui.webhooks.eventsAll': 'Todos os eventos',
  'developer.ui.webhooks.eventsSelected': 'Somente os eventos que eu selecionar',
  'developer.ui.webhooks.eventsCount':
    '{count, plural, one {# evento} other {# eventos} many {# eventos}}',
  'developer.ui.webhooks.eventGroup.connections': 'Conexões',
  'developer.ui.webhooks.eventGroup.content': 'Conteúdo e aprovação',
  'developer.ui.webhooks.eventGroup.publishing': 'Publicação',
  'developer.ui.webhooks.eventGroup.automation': 'Automação e feeds',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'Projects e contas',
  'developer.ui.webhooks.scopeAll': 'Todas as marcas e contas',
  'developer.ui.webhooks.scopeSelected': 'Somente os que eu selecionar',
  'developer.ui.webhooks.secretTitle': 'Assinatura secreta',
  'developer.ui.webhooks.secretBody':
    'Verifique o cabeçalho da assinatura antes de analisar um corpo. Desduplicar o ID de entrega, que é estável entre novas tentativas.',
  'developer.ui.webhooks.secretRotateTitle': 'Rode o segredo de assinatura',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Ambos os segredos são aceitos por 24 horas para que você possa implantar sem perder uma entrega.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Depois dessa janela, apenas o novo segredo é usado.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Envia um evento de exemplo assinado marcado como teste, para que seu receptor possa ignorá-lo com segurança.',
  'developer.ui.webhooks.testDeliverySent':
    'Entrega de teste enviada. O resultado aparece no log abaixo.',
  'developer.ui.webhooks.deliveriesCaption': 'Entregas recentes e a resposta que cada uma recebeu',
  'developer.ui.webhooks.deliveryColumn.time': 'Solicitado',
  'developer.ui.webhooks.deliveryColumn.event': 'Evento',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Tentativa',
  'developer.ui.webhooks.deliveryColumn.response': 'Resposta',
  'developer.ui.webhooks.deliveryColumn.status': 'Status',
  'developer.ui.webhooks.deliveryStatus.pending': 'Aguardando',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Entregue',
  'developer.ui.webhooks.deliveryStatus.failed': 'Falha, tentarei novamente',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Falha, não há mais tentativas',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Não enviado, endpoint desativado',
  'developer.ui.webhooks.deliveryNoResponse': 'Nenhuma resposta recebida',
  'developer.ui.webhooks.deliveryNextAttempt': 'Próxima tentativa {relativeTime}',
  'developer.ui.webhooks.inspect': 'Inspecione a entrega',
  'developer.ui.webhooks.inspectTitle': 'Entrega {id}',
  'developer.ui.webhooks.inspectRequest': 'Corpo da solicitação',
  'developer.ui.webhooks.inspectResponse': 'Corpo da resposta',
  'developer.ui.webhooks.redeliver': 'Envie esta entrega novamente',
  'developer.ui.webhooks.redeliverHelp':
    'O mesmo ID de evento é enviado novamente com o sinalizador de nova entrega definido, portanto, um receptor idempotente o ignora com segurança.',
  'developer.ui.webhooks.redelivered': 'Na fila para nova entrega.',
  'developer.ui.webhooks.failureTitle': 'Este endpoint está falhando',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# entrega consecutiva falhou} other {# entregas consecutivas falharam} many {# entregas consecutivas falharam}}. Após {limit} falhas consecutivas, o endpoint é desabilitado e um item de ação é arquivado.',
  'developer.ui.webhooks.disabledTitle': 'Este endpoint foi desativado após falhas repetidas',
  'developer.ui.webhooks.disabledBody':
    'Paramos de enviar para ele para que sua fila não encha. Conserte o receptor, envie uma entrega de teste e ative-o novamente.',
  'developer.ui.webhooks.lastSuccessLabel': 'Último sucesso',
  'developer.ui.webhooks.lastSuccessNever': 'Nenhuma entrega foi bem-sucedida',
  'developer.ui.webhooks.deleteTitle': 'Excluir este endpoint',
  'developer.ui.webhooks.deleteConsequence.stop': 'Nada mais é enviado para este URL.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'Os registros de entrega são mantidos durante o período de retenção de auditoria.',

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'Um plano, dois intervalos. A Polar é o comerciante registrado: ela mantém a forma de pagamento, emite faturas e trata do cancelamento.',
  'billing.ui.statusHeading': 'Status atual',
  'billing.ui.planHeading': 'Plano',
  'billing.ui.intervalHeading': 'Intervalo de cobrança',
  'billing.ui.usageHeading': 'Uso medido do provedor',
  'billing.ui.invoicesHeading': 'Faturas',
  'billing.ui.cancelHeading': 'Cancelamento',
  'billing.ui.trialDaysRemaining':
    'Teste, {count, plural, =0 { termina hoje} one {# dia restante} other {# dias restantes} many {# dias restantes}}',
  'billing.ui.convertsOn': 'Converte em {date} para {amount} por {interval}.',
  'billing.ui.dueToday': '$0 com vencimento hoje',
  'billing.ui.conversionLabel': 'Converte',
  'billing.ui.channelsLabel': 'Canais ativos',
  'billing.ui.paymentMethodPolar': 'Método de pagamento mantido pela Polar',
  'billing.ui.paymentMethodDescriptor': '{project} terminando {last4}, expira {expiry}',
  'billing.ui.paymentMethodMissing': 'Nenhum método de pagamento cadastrado ainda',
  'billing.ui.cancelBeforeDate': 'Cancele antes de {date} e você não será cobrado.',
  'billing.ui.annualFraming': '$25/mês cobrado anualmente. Economize $ 48/ano.',
  'billing.ui.monthlyOption': '$29 por mês',
  'billing.ui.annualOption': '$300 por ano',
  'billing.ui.intervalChangeHelp':
    'A alteração do intervalo entra em vigor na próxima renovação. A Polar rateia e mostra o valor exato antes de você confirmar.',
  'billing.ui.intervalChangedAnnouncement': 'Intervalo de cobrança definido como {interval}.',
  'billing.ui.allowanceChannels':
    '30 canais sociais ativos. Um canal é uma conta, página ou canal conectado.',
  'billing.ui.allowanceChannelsUsage': '{used} de {limit} canais ativos',
  'billing.ui.allowanceFairUse':
    'Uso justo significa anti-spam, controles de taxas e custos do provedor. Eles se aplicam da mesma forma a todos os assinantes e são publicados, não discricionários.',
  'billing.ui.allowanceMetered':
    'X e alguns outros provedores cobram por operação. Essas cobranças são repassadas ao custo e não fazem parte do preço do plano.',
  'billing.ui.allowanceNoMedia':
    'A geração de imagem e a geração de vídeo não estão incluídas e não são vendidas. Relay não gera mídia.',
  'billing.ui.readFairUse': 'Leia a política de uso justo',
  'billing.ui.readMeteredPolicy': 'Leia como o uso medido é cobrado',
  'billing.ui.usageCaption': 'Uso medido do provedor neste período, cobrado pelo custo',
  'billing.ui.usageColumn.item': 'Item',
  'billing.ui.usageColumn.quantity': 'Quantidade',
  'billing.ui.usageColumn.unitPrice': 'Preço unitário',
  'billing.ui.usageColumn.amount': 'Quantidade',
  'billing.ui.usageTotal': 'Total deste período',
  'billing.ui.usagePeriod': 'Período {start} a {end}',
  'billing.ui.usageSource': 'Preços publicados pelo fornecedor. Verificado {date}.',
  'billing.ui.usageReconciled': 'Conciliado com a fatura do fornecedor em {date}.',
  'billing.ui.usagePending': 'Ainda não reconciliado. O valor final pode variar ligeiramente.',
  'billing.ui.usageUnavailableReason':
    'O provedor ainda não retornou o uso neste período. Normalmente está disponível em 24 horas.',
  'billing.ui.usageEmpty': 'Nenhum uso medido neste período.',
  'billing.ui.spendAlert': 'Alerta de gastos',
  'billing.ui.spendAlertHelp':
    'Enviaremos um e-mail para você quando o uso medido ultrapassar esse valor em um período de cobrança.',
  'billing.ui.spendAlertPause': 'Também pause as ações medidas quando o alerta for alcançado',
  'billing.ui.balanceLabel': 'Saldo de uso',
  'billing.ui.balanceHelp': 'O uso medido é retirado deste saldo e faturado pela Polar.',
  'billing.ui.invoicesCaption': 'Faturas emitidas pela Polar',
  'billing.ui.invoiceColumn.date': 'Data',
  'billing.ui.invoiceColumn.description': 'Descrição',
  'billing.ui.invoiceColumn.amount': 'Quantidade',
  'billing.ui.invoiceColumn.state': 'Estado',
  'billing.ui.invoiceState.paid': 'Pago',
  'billing.ui.invoiceState.open': 'Abrir',
  'billing.ui.invoiceState.uncollectible': 'Não coletado',
  'billing.ui.invoiceState.refunded': 'Reembolsado',
  'billing.ui.invoicesEmpty':
    'Nenhuma fatura ainda. O primeiro é emitido quando o teste é convertido.',
  'billing.ui.invoicesInPortal': 'Todas as faturas e recibos estão disponíveis no portal Polar.',
  'billing.ui.portalHelp':
    'O portal é onde você altera a forma de pagamento, baixa faturas e cancela. Ele abre em uma nova guia.',
  'billing.ui.pastDueHeading': 'Pagamento vencido',
  'billing.ui.pastDueBody':
    'O último pagamento não foi realizado. Atualize a forma de pagamento no portal Polar para continuar publicando.',
  'billing.ui.gracePolicy':
    'As publicações agendadas continuam em execução até {date}. Depois disso, o espaço de trabalho torna-se somente leitura: nada é excluído e nada é publicado.',
  'billing.ui.cancelBody':
    'O cancelamento é uma ação e entra em vigor no final do período pelo qual você pagou. Não há nenhuma ligação a fazer e nenhum formulário a preencher.',
  'billing.ui.cancelStart': 'Cancelar assinatura',
  'billing.ui.cancelDialogTitle': 'Cancelar esta assinatura',
  'billing.ui.cancelConsequence.noCharge':
    'Você não será cobrado. Nada é levado hoje ou em {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'Você mantém todos os recursos até {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Rascunhos, recibos, mídia e análises permanecem neste espaço de trabalho.',
  'billing.ui.cancelConsequence.scheduled':
    'Postagens agendadas após {date} não serão publicadas. Cancele ou reagende antes disso.',
  'billing.ui.cancelConsequence.restart':
    'Você pode iniciar a assinatura novamente a qualquer momento.',
  'billing.ui.cancelConfirm': 'Cancelar assinatura',
  'billing.ui.cancelKeep': 'Manter assinatura',
  'billing.ui.cancelConfirmedBeforeConversion': 'Cancelado. Você não será cobrado.',
  'billing.ui.cancelConfirmedAfterConversion': 'Cancelado. O acesso continua até {date}.',
  'billing.ui.cancelAnnouncement': 'Assinatura cancelada.',
  'billing.ui.canceledNotice': 'Esta assinatura foi cancelada.',
  'billing.ui.resume': 'Inicie a assinatura novamente',
  'billing.ui.noSubscriptionTitle': 'Sem assinatura neste espaço de trabalho',
  'billing.ui.noSubscriptionBody':
    'Inicie o teste de sete dias para publicar. A Polar coleta uma forma de pagamento e não cobra nada hoje.',
  'billing.ui.noSubscriptionExample':
    'O mês custa US$ 29. O valor anual é de US$ 300, o que equivale a US$ 25/mês cobrado anualmente. Economize $ 48/ano.',
  'billing.ui.overChannelLimitAction': 'Revisar canais conectados',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'Responda a uma breve pergunta, confirme o que entendemos e obtenha um plano que você pode aceitar item por item. Propõe trabalho. Ele nunca agenda ou publica nada por conta própria.',
  'growth.ui.step.intake': 'Ingestão',
  'growth.ui.step.confirm': 'Confirmar',
  'growth.ui.step.plan': 'Plano',
  'growth.ui.stepIndicator': 'Etapa {current} de {total}: {name}',
  'growth.ui.intake.section.product': 'Produto',
  'growth.ui.intake.section.audience': 'Público e mercados',
  'growth.ui.intake.section.objective': 'Objetivo',
  'growth.ui.intake.section.capacity': 'Canais e capacidade',
  'growth.ui.intake.section.limits': 'O que está fora dos limites',
  'growth.ui.intake.help':
    'Nada aqui é adivinhado para você. Tudo o que você deixar em branco será marcado como ausente em vez de preenchido.',
  'growth.ui.intake.productNameHelp': 'O nome que você usa com os clientes.',
  'growth.ui.intake.siteUrlHelp':
    'Lemos a página que você nos forneceu como material de origem. Você confirma todos os fatos que extraímos dele.',
  'growth.ui.intake.descriptionHelp':
    'O que você vende e para quem se destina, com suas próprias palavras.',
  'growth.ui.intake.marketsHelp': 'Países ou regiões. Um por linha.',
  'growth.ui.intake.localesHelp': 'Os idiomas em que você publicará.',
  'growth.ui.intake.objectiveHelp': 'O que você mais deseja no próximo trimestre.',
  'growth.ui.intake.conversionHelp':
    'A ação que você pode realmente medir. Uma inscrição, uma demonstração, uma compra.',
  'growth.ui.intake.proofHelp':
    'Estudos de caso, benchmarks que você executou, capturas de tela que você possui, permissões que você já possui. Um por linha.',
  'growth.ui.intake.proofNone': 'Não tenho nenhuma prova aprovada ainda',
  'growth.ui.intake.proofNoneEffect':
    'O plano evitará totalmente os resultados do cliente e reclamações de resultados.',
  'growth.ui.intake.channelsHelp': 'As contas das quais você já publica.',
  'growth.ui.intake.capacityHelp':
    'Seja honesto. Um plano que você não pode executar não é um plano.',
  'growth.ui.intake.competitorsHelp': 'Opcional. Um por linha.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Reivindicações que você não pode fazer, por motivos legais ou políticos. Um por linha.',
  'growth.ui.intake.prohibitedTopicsHelp': 'Tópicos para ficar longe. Um por linha.',
  'growth.ui.intake.submit': 'Revise o que entendemos',
  'growth.ui.intake.savedAnnouncement': 'Perfil comercial salvo.',
  'growth.ui.intake.requiredMissing':
    'Preencha os campos marcados como obrigatórios antes de continuar.',

  'growth.ui.confirm.factsTitle': 'Fatos que você confirmou',
  'growth.ui.confirm.factsHelp': 'Estes podem ser usados em cópia.',
  'growth.ui.confirm.assumptionsTitle': 'Suposições que fizemos',
  'growth.ui.confirm.assumptionsHelp':
    'Estes não são fatos. Eles moldam o plano, mas nunca se tornam uma reivindicação em uma publicação.',
  'growth.ui.confirm.missingTitle': 'Desaparecido',
  'growth.ui.confirm.missingHelp':
    'O plano funciona em torno de cada um deles e diz isso onde é importante.',
  'growth.ui.confirm.confidence.label': 'Confiança: {level}',
  'growth.ui.confirm.confidence.low': 'baixo',
  'growth.ui.confirm.confidence.medium': 'médio',
  'growth.ui.confirm.confidence.high': 'alto',
  'growth.ui.confirm.promote': 'Confirme como um fato',
  'growth.ui.confirm.correct': 'Corrija isto',
  'growth.ui.confirm.correctLabel': 'Sua correção',
  'growth.ui.confirm.generate': 'Gere o plano',
  'growth.ui.confirm.announcement': 'Perfil comercial confirmado.',

  'growth.ui.plan.generatingBody':
    'Isso leva alguns segundos. Você pode sair desta página: o plano termina sozinho.',
  'growth.ui.plan.stateDraft': 'Rascunho, não aprovado',
  'growth.ui.plan.stateApproved': 'Aprovado',
  'growth.ui.plan.stateSuperseded': 'Substituído por uma versão mais recente',
  'growth.ui.plan.newVersionNotice':
    'Uma atualização cria a versão {version} e deixa a versão aprovada intacta.',
  'growth.ui.plan.emptyTitle': 'Nenhum plano ainda',
  'growth.ui.plan.emptyBody':
    'Preencha o perfil do negócio e construiremos um plano a partir dos fatos que você confirmar.',
  'growth.ui.plan.emptyExample':
    'Um plano contém uma estratégia, quatro semanas de briefs, uma campanha UGC, oportunidades apoiadas por catálogo e até cinco ferramentas.',
  'growth.ui.plan.tabsLabel': 'Seções do plano',
  'growth.ui.plan.modelNote': 'Gerado por {model}, prompt {promptVersion}, em {date}.',

  'growth.ui.strategy.snapshotTitle': 'Instantâneo de negócios',
  'growth.ui.strategy.channelPriority': 'Prioridade {rank}',
  'growth.ui.strategy.channelFormats': 'Formatos nativos',
  'growth.ui.strategy.pillarProof': 'Prova em que este pilar se apoia',
  'growth.ui.strategy.pillarProofNone': 'Nenhuma prova aprovada. Mantenha este pilar descritivo.',
  'growth.ui.strategy.cadenceCaption': 'Postagens por semana por canal',
  'growth.ui.strategy.cadenceColumn.channel': 'Canal',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Postagens por semana',
  'growth.ui.strategy.cadenceTotal': 'Total por semana',
  'growth.ui.strategy.capacityWarning':
    'Esta cadência é de {planned} publicações por semana contra uma capacidade declarada de {capacity} horas. Reduza ou aumente a capacidade do perfil.',
  'growth.ui.strategy.measurementBody':
    'Comparado com suas próprias publicações finais no mesmo canal e formato. Nenhum benchmark externo é usado, porque nenhum é comparável à sua conta.',
  'growth.ui.strategy.localeAdaptations': 'Notas de idioma',

  'growth.ui.fourWeek.caption': 'Resumos propostos por semana e dia',
  'growth.ui.fourWeek.column.date': 'Data',
  'growth.ui.fourWeek.column.channel': 'Canal',
  'growth.ui.fourWeek.column.pillar': 'Pilar',
  'growth.ui.fourWeek.column.format': 'Formato',
  'growth.ui.fourWeek.column.brief': 'Breve',
  'growth.ui.fourWeek.column.cta': 'Apelo à ação',
  'growth.ui.fourWeek.column.measurement': 'Etiqueta de medição',
  'growth.ui.fourWeek.column.actions': 'Ações',
  'growth.ui.fourWeek.approvalRequired': 'Aprovação necessária antes de publicar',
  'growth.ui.fourWeek.approvalNotRequired': 'Não é necessária aprovação para esta conta',
  'growth.ui.fourWeek.noCta': 'Sem apelo à ação',
  'growth.ui.fourWeek.weekEmpty': 'Nenhum briefing proposto para esta semana.',
  'growth.ui.fourWeek.acceptedCount': '{accepted} de {total} resumos aceitos como rascunhos',
  'growth.ui.fourWeek.acceptAnnouncement': 'Rascunho criado a partir deste brief.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Proposta de calendário adicionada para {date}.',

  'growth.ui.ugc.promptAngle': 'Ângulo {number}',
  'growth.ui.ugc.checklistTitle': 'Direitos, consentimento e divulgação',
  'growth.ui.ugc.checklistHelp':
    'Trabalhe com cada participante antes de qualquer coisa ser publicada. O consentimento para aparecer não é consentimento para anunciar.',
  'growth.ui.ugc.incentiveNone': 'Nenhum incentivo oferecido',
  'growth.ui.ugc.incentiveDisclosure':
    'Um incentivo deverá ser divulgado em cada publicação que dele resultar, por você e pelo participante.',
  'growth.ui.ugc.honesty':
    'Isso planeja uma campanha que você realiza com pessoas reais. Relay não encontra criadores, não os contata, escreve depoimentos ou cria conteúdo para clientes.',

  'growth.ui.opportunities.caption':
    'Oportunidades verificadas no catálogo, classificadas por adequação ao seu perfil',
  'growth.ui.opportunities.column.opportunity': 'Oportunidade',
  'growth.ui.opportunities.column.type': 'Tipo',
  'growth.ui.opportunities.column.audience': 'Público',
  'growth.ui.opportunities.column.fit': 'Por que isso se encaixa',
  'growth.ui.opportunities.column.requirements': 'Requisitos',
  'growth.ui.opportunities.column.rules': 'Regras de autopromoção',
  'growth.ui.opportunities.column.cost': 'Custo',
  'growth.ui.opportunities.column.effort': 'Esforço',
  'growth.ui.opportunities.column.verified': 'Última verificação',
  'growth.ui.opportunities.column.actions': 'Ações',
  'growth.ui.opportunities.costFree': 'Grátis',
  'growth.ui.opportunities.effort.low': 'Baixo',
  'growth.ui.opportunities.effort.medium': 'Médio',
  'growth.ui.opportunities.effort.high': 'Alto',
  'growth.ui.opportunities.noRequiredAsset': 'Nenhum recurso necessário',
  'growth.ui.opportunities.prepareTitle': 'Prepare um envio para {name}',
  'growth.ui.opportunities.prepareRules': 'Suas regras, citadas',
  'growth.ui.opportunities.prepareChecklist': 'O que preparar',
  'growth.ui.opportunities.prepareManual':
    'Você mesmo envia isso no site deles. Relay não preenche formulários, cria contas ou envia e-mails para ninguém.',
  'growth.ui.opportunities.pitchTitle': 'Rascunho do argumento de venda',
  'growth.ui.opportunities.pitchHelp':
    'Edite antes de enviá-lo. Ele usa apenas os fatos que você confirmou.',
  'growth.ui.opportunities.submittedOn': 'Enviado {date}',
  'growth.ui.opportunities.staleTitle': 'Algumas entradas precisam de nova verificação',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# a entrada já passou da data de revisão} other {# as entradas já passaram da data de revisão} many {# as entradas já passaram da data de revisão}}. Verifique as regras atuais no site antes de confiar nelas.',
  'growth.ui.opportunities.emptyExample':
    'Uma linha do catálogo contém o URL oficial, o público, as regras de envio citadas no site, o custo, o esforço e a data em que uma pessoa o verificou pela última vez.',

  'growth.ui.tools.shown': '{shown} de {max} mostrado',
  'growth.ui.tools.fewerThanMax':
    'Apenas a ferramenta {count, plural, one {# corresponde a} other {# as ferramentas correspondem} many {# as ferramentas correspondem}} a este fluxo de trabalho com uma revisão atual. Preferimos mostrar menos do que preencher a lista.',
  'growth.ui.tools.emptyTitle':
    'Nenhuma ferramenta revisada se adapta a este fluxo de trabalho ainda',
  'growth.ui.tools.emptyBody':
    'Cada inscrição precisa de um preço verificado, termos de direitos verificados e uma limitação nomeada antes de aparecer aqui.',
  'growth.ui.tools.emptyExample':
    'Uma entrada diz para que é melhor, por que se adapta ao seu plano, o que não pode fazer, as habilidades necessárias, como o resultado volta para Relay e quando o preço foi verificado pela última vez.',
  'growth.ui.tools.openSite': 'Abra o site oficial de {name}',
  'growth.ui.tools.stale': 'Passou a data de revisão. Excluído dos planos gerados.',

  'growth.ui.item.explainTitle': 'Por que isso foi sugerido',
  'growth.ui.item.explainEvidence': 'Em que se baseia',
  'growth.ui.item.explainNoEvidence':
    'Isso veio do objetivo e das regras do canal, não de um fato confirmado sobre o seu negócio.',
  'growth.ui.item.dismissTitle': 'Rejeite esta sugestão',
  'growth.ui.item.dismissBody':
    'Diga-nos por quê. O motivo é armazenado com o plano e molda a próxima versão.',
  'growth.ui.item.dismissReasonLabel': 'Motivo',
  'growth.ui.item.dismissReason.notRelevant': 'Não relevante para este negócio',
  'growth.ui.item.dismissReason.noCapacity': 'Não temos capacidade',
  'growth.ui.item.dismissReason.wrongAudience': 'Público errado',
  'growth.ui.item.dismissReason.alreadyDone': 'Já fazemos isso',
  'growth.ui.item.dismissReason.policy': 'Contra nossa política ou reivindicações',
  'growth.ui.item.dismissReason.other': 'Algo mais',
  'growth.ui.item.dismissNote': 'Qualquer coisa que você queira adicionar',
  'growth.ui.item.dismissed': 'Dispensado. Ele permanece visível para que você possa desfazê-lo.',
  'growth.ui.item.undoDismiss': 'Desfazer dispensa',

  'growth.ui.export.title': 'Exportar este plano',
  'growth.ui.export.formatLabel': 'Formato',
  'growth.ui.export.copy': 'Copiar para a área de transferência',
  'growth.ui.export.download': 'Baixar arquivo',
  'growth.ui.export.copied': 'Plano copiado para a área de transferência.',
  'growth.ui.export.schemaNote':
    'Todos os três formatos vêm de um esquema validado, versão {version}. As visualizações estruturadas são seguras para controle de origem e não contêm segredos.',
  'growth.ui.export.previewLabel': 'Exportar visualização',
} as const;
