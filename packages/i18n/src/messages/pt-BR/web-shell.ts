/**
 * The web application shell: Home, the command palette, the Action center
 * queue chrome, the demo data notice, and the parts of sign in and onboarding
 * that the shared `auth`, `onboarding` and `billing` catalogs do not cover.
 *
 * Owned by the web shell. Screen catalogs (composer, calendar, analytics)
 * belong to their own files.
 */
export const webShellMessages = {
  /* -- Document and shell chrome ----------------------------------------- */
  'shell.appName': 'Post Array',
  'shell.documentTitle': '{page} · Post Array',
  'shell.tagline': 'Uma mesa de publicação para pessoas e agentes.',
  'shell.menu.open': 'Abra o menu',
  'shell.menu.title': 'Menu',
  'shell.nav.more': 'Mais',
  'shell.help.title': 'Ajuda',
  'shell.help.documentation': 'Documentação',
  'shell.help.keyboardShortcuts': 'Atalhos de teclado',
  'shell.help.platformStatus': 'Status da plataforma',
  'shell.help.whatChanged': 'O que mudou',
  'shell.help.contactSupport': 'Entre em contato com o suporte',
  'shell.account.settings': 'Configurações',
  'shell.account.profile': 'Seu perfil',
  'shell.workspace.create': 'Criar um espaço de trabalho',
  'shell.workspace.manage': 'Workspace configurações',
  'shell.workspace.role': 'Você está {role} aqui',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Dados de demonstração',
  'shell.demo.title': 'Você está vendo dados de demonstração',
  'shell.demo.body':
    'A API Post Array não pode ser acessada neste navegador, portanto, as telas são preenchidas com um exemplo de espaço de trabalho propagado. Nada aqui está conectado a uma conta real e nada pode ser publicado.',
  'shell.demo.howToConnect':
    'Defina NEXT_PUBLIC_POSTARRAY_API_URL e reinicie o aplicativo para usar dados ao vivo.',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Você está off-line',
  'shell.offline.body':
    'Os rascunhos são mantidos neste dispositivo. Agendamento e retomada da publicação quando a conexão retornar.',
  'shell.offline.retry': 'Verifique a conexão',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Abra a paleta de comandos',
  'palette.title': 'Paleta de comandos',
  'palette.description': 'Procure uma tela, uma conta ou uma ação.',
  'palette.placeholder': 'Digite um comando ou um nome de tela',
  'palette.empty': 'Nada corresponde a {query}.',
  'palette.group.actions': 'Ações',
  'palette.group.goTo': 'Vá para',
  'palette.group.workspaces': 'Workspaces',
  'palette.group.settings': 'Configurações',
  'palette.hint.navigate': 'Mova com as teclas de seta',
  'palette.hint.select': 'Abra com Enter',
  'palette.hint.close': 'Fechar com Escape',
  'palette.action.compose': 'Escrever uma publicação',
  'palette.action.connectAccount': 'Conecte uma conta',
  'palette.action.openActionCenter': 'Abra o centro de ação',
  'palette.action.uploadMedia': 'Carregar mídia',
  'palette.action.createRule': 'Criar uma regra de automação',
  'palette.action.toggleTheme': 'Mude o tema',
  'palette.action.signOut': 'Sair',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Abra o centro de ação',
  'actionCenter.group.now.label': 'Agora',
  'actionCenter.group.soon.label': 'Em breve',
  'actionCenter.group.watching.label': 'Assistindo',
  'actionCenter.group.now.hint': 'A publicação está em risco até que sejam tratadas.',
  'actionCenter.group.soon.hint': 'Estes têm um prazo que você ainda pode cumprir.',
  'actionCenter.group.watching.hint': 'Não é urgente. Vale a pena dar uma olhada esta semana.',
  'actionCenter.severity.now': 'Preciso de você agora',
  'actionCenter.severity.soon': 'Preciso de você em breve',
  'actionCenter.severity.watching': 'Assistindo',
  'actionCenter.filter.all': 'Todos',
  'actionCenter.filter.connections': 'Conexões',
  'actionCenter.filter.publishing': 'Publicação',
  'actionCenter.filter.automation': 'Automação',
  'actionCenter.filter.billing': 'Faturamento',
  'actionCenter.snoozed': 'Adiado',
  'actionCenter.snoozeOneDay': 'Adiar por um dia',
  'actionCenter.snoozedUntil': 'Adiado até {date}',
  'actionCenter.unsnooze': 'Traga isso de volta',
  'actionCenter.resolved': 'Resolvido {relativeTime}',
  'actionCenter.emptyFiltered': 'Nada neste grupo precisa de atenção.',
  'actionCenter.errorTitle': 'O Action Center não pôde carregar',
  'actionCenter.loading': 'Carregando o que precisa de atenção',
  'actionCenter.affectedAccount': 'Afeta {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Nada precisa de atenção} one {# item} other {# itens} many {# itens}}',
  'actionCenter.action.reconnect': 'Reconectar',
  'actionCenter.action.openReceipt': 'Abra o recibo',
  'actionCenter.action.review': 'Revisão',
  'actionCenter.action.openDraft': 'Abra o rascunho',
  'actionCenter.action.openCalendar': 'Abra o calendário',
  'actionCenter.action.viewStatus': 'Ver status',
  'actionCenter.action.checkFeed': 'Verifique o feed',
  'actionCenter.action.inspectDeliveries': 'Inspecionar entregas',
  'actionCenter.action.addBalance': 'Analise o uso',
  'actionCenter.action.fixConnection': 'Conserte a conexão',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Casa',
  'home.subtitle': 'O que precisa de você hoje e o que acontecerá a seguir.',
  'home.greetingSummary':
    '{actions, plural, =0 {Nada precisa de você agora} one {# o item precisa de você} other {# os itens precisam de você} many {# os itens precisam de você}}. {upcoming, plural, =0 {Nada está programado nas próximas 24 horas} one {# a publicação sai nas próximas 24 horas} other {# as publicações saem nas próximas 24 horas} many {# as publicações saem nas próximas 24 horas}}.',
  'home.needsYou.title': 'Precisa de você agora',
  'home.needsYou.empty': 'Nada precisa de você agora.',
  'home.needsYou.emptyBody':
    'A integridade da conexão, aprovações e publicações com falha aparecem aqui no momento em que acontecem.',
  'home.needsYou.viewAll': 'Abra o centro de ação',
  'home.needsYou.emptyQuiet':
    'Aproveite a calmaria. Tudo o que precisar de uma decisão vai aparecer aqui assim que acontecer.',
  'home.upcoming.title': 'Próximas 24 horas',
  'home.upcoming.empty': 'Nada está programado para as próximas 24 horas.',
  'home.upcoming.emptyBody':
    'Escreva uma publicação e escolha um horário. Você pode alterá-lo mais tarde.',
  'home.upcoming.viewAll': 'Abra o calendário',
  'home.upcoming.timeZoneNote':
    'Os tempos são mostrados em {timeZone}, a zona do espaço de trabalho.',
  'home.upcoming.columnTime': 'Tempo',
  'home.upcoming.columnAccount': 'Conta',
  'home.upcoming.columnContent': 'Conteúdo',
  'home.upcoming.columnStatus': 'Status',
  'home.receipts.title': 'Recibos recentes',
  'home.receipts.empty': 'Nenhuma publicação publicada neste espaço de trabalho ainda.',
  'home.receipts.emptyBody':
    'Cada publicação produz um recibo que você pode inspecionar e compartilhar.',
  'home.receipts.viewAll': 'Todos os recibos',
  'home.receipts.publishedTo': 'Publicado em {account}',
  'home.connections.title': 'Saúde da conexão',
  'home.connections.summary':
    '{healthy, plural, one {# conta está funcionando} other {# contas estão funcionando} many {# contas estão funcionando}}. {attention, plural, =0 {Nenhum precisa de atenção} one {# precisa de atenção} other {# precisa de atenção} many {# precisa de atenção}}.',
  'home.connections.viewAll': 'Todas as conexões',
  'home.connections.empty': 'Nenhuma conta conectada ainda.',
  'home.advisor.title': 'Conselheiro de crescimento',
  'home.advisor.summary':
    'A versão do plano {version} foi aprovada {date}. Semana {week} de {total} tem {briefs, plural, one {# resumo ainda não redigido} other {# resumos ainda não redigidos} many {# resumos ainda não redigidos}}.',
  'home.advisor.noPlan':
    'O consultor constrói um plano a partir de fatos que você confirma. Propõe trabalhos e nunca publica por conta própria.',
  'home.advisor.openPlan': 'Abra o plano',
  'home.advisor.createDrafts': 'Criar rascunhos da semana {week}',
  'home.advisor.start': 'Inicie o perfil comercial',
  'home.trial.banner':
    'Teste, {days, plural, =0 {termina hoje} one {# dia restante} other {# dias restantes} many {# dias restantes}}. Converte {date} em {amount}.',
  'home.trial.manage': 'Gerenciar ou cancelar',
  'home.error.title': 'Home não pôde carregar',
  'home.error.body':
    'Seu espaço de trabalho está intacto. Este é um problema ao atingir a API Post Array.',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title': 'Publique através de APIs oficiais e veja exatamente o que aconteceu.',
  'auth.aside.point.receipts':
    'Toda publicação produz um recibo: quem aprovou, quando foi despachada, o que a plataforma retornou.',
  'auth.aside.point.approvals':
    'Nada chega a uma plataforma sem a aprovação que sua política exige.',
  'auth.aside.point.surfaces':
    'O mesmo fluxo de trabalho do aplicativo web, API REST, MCP, CLI e webhooks.',
  'auth.provider.title': 'Antes de continuar',
  'auth.provider.google.access':
    'Google compartilha seu nome, endereço de e-mail e foto do perfil com Post Array. Post Array não consegue ler seu Gmail, Drive ou Agenda.',
  'auth.provider.facebook.access':
    'Facebook compartilha seu nome, endereço de e-mail e foto do perfil com Post Array. Conectar uma página para publicar é uma etapa separada que você aprovará mais tarde.',
  'auth.provider.note': 'Isso faz seu login. Não conecta uma conta para publicar.',
  'auth.continueWithEmail': 'Continue com e-mail',
  'auth.method.password': 'Senha',
  'auth.method.magicLink': 'Link de e-mail',
  'auth.method.username': 'Nome de usuário',
  'auth.method.chooseLabel': 'Como deseja fazer login?',
  'auth.username.placeholder': 'seu-nome de usuário',
  'auth.username.aliasNote':
    'Um nome de usuário é um alias para o endereço de e-mail da sua conta. A senha é a mesma.',
  'auth.password.placeholder': 'Sua senha',
  'auth.submit.signIn': 'Fazer login',
  'auth.submit.signUp': 'Criar conta',
  'auth.submit.working': 'Verificando',
  'auth.failure.credentials':
    'Esse endereço de e-mail e senha não correspondem a uma conta. Verifique ambos e tente novamente.',
  'auth.failure.usernameCredentials':
    'Esse nome de usuário e senha não correspondem a uma conta. Verifique ambos e tente novamente.',
  'auth.failure.noAccountLeak':
    'Para sua segurança, não informamos se um endereço está registrado.',
  'auth.failure.provider': 'O login com {provider} não foi concluído. Nada foi alterado.',
  'auth.failure.network':
    'Não conseguimos alcançar Post Array. Verifique sua conexão e tente novamente.',
  'auth.signUp.emailInUseNote':
    'Se este endereço já tiver uma conta, enviaremos um link de login por e-mail em vez de criar um segundo.',
  'auth.legal.readTerms': 'Leia os Termos',
  'auth.legal.readPrivacy': 'Leia o Aviso de Privacidade',
  'auth.switchToSignUp': 'Crie uma conta',
  'auth.switchToSignIn': 'Faça login em vez disso',
  'auth.checkEmail.body': 'Enviamos um link de login para {email}. Funciona uma vez.',
  'auth.checkEmail.wrongAddress': 'Use um endereço diferente',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Faturamento',
  'onboarding.stepName.workspace': 'Workspace',
  'onboarding.stepName.role': 'Caso de uso',
  'onboarding.stepName.connect': 'Conectar',
  'onboarding.stepName.compose': 'Primeira publicação',
  'onboarding.stepName.receipt': 'Confirmação',
  'onboarding.stepList': 'Etapas de configuração',
  'onboarding.stepComplete': 'Concluído',
  'onboarding.stepCurrent': 'Etapa atual',
  'onboarding.exit': 'Terminar mais tarde',
  'onboarding.plan.intervalMonthlyLabel': '$29 por mês',
  'onboarding.plan.intervalAnnualLabel': '$300 por ano',
  'onboarding.plan.checkoutHint':
    'A próxima tela é Polar, nosso comerciante oficial. O acesso é concedido quando a Polar confirma a assinatura, não quando o navegador volta.',
  'onboarding.plan.factsTitle': 'O que acontece quando você continua',
  'onboarding.workspace.help':
    'Um espaço de trabalho contém seus projetos, contas conectadas, rascunhos e recibos. Você pode criar mais posteriormente.',
  'onboarding.workspace.localeNote':
    'O idioma da sua interface altera este aplicativo. Os idiomas do conteúdo são escolhidos por publicação e são separados desta configuração.',
  'onboarding.workspace.timeZoneDetected': 'Detectado neste dispositivo: {timeZone}',
  'onboarding.connect.permissionsTitle': 'O que {provider} será solicitado',
  'onboarding.connect.permissionsFooter':
    'Post Array nunca pede permissão que não usa e você pode desconectar a qualquer momento.',
  'onboarding.connect.chooseProvider': 'Escolha uma plataforma',
  'onboarding.connect.opensProvider': 'Continuar abre {provider} nesta guia.',
  'onboarding.compose.help':
    'Escreva a publicação e verifique a visualização e a validação antes de escolher um horário.',
  'onboarding.compose.openComposer': 'Abra o compositor completo',
  'onboarding.receipt.title': 'Sua primeira publicação está agendada',
  'onboarding.receipt.body':
    'Aqui está o recorde até agora. Ele continua atualizando através do envio, da resposta do provedor e da primeira sincronização analítica.',
  'onboarding.receipt.goHome': 'Vá para casa',
  'onboarding.blocked.title': 'Esta etapa precisa da anterior',
  'onboarding.blocked.body': 'Termine {step} primeiro. Nada que você digitou será perdido.',
} as const;
