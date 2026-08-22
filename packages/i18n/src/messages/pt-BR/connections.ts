/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'Conexões',
  'connection.subtitle':
    'As contas, páginas e canais nos quais este espaço de trabalho pode publicar.',
  'connection.add': 'Conecte uma conta',
  'connection.count':
    '{used, plural, one {# canal ativo} other {# canais ativos} many {# canais ativos}} de {limit}',
  'connection.limitReached':
    'Este espaço de trabalho está usando todos os canais {limit}. Desconecte um antes de conectar outro.',

  'connection.account.label': 'Conta',
  'connection.account.type.profile': 'Perfil',
  'connection.account.type.page': 'Página',
  'connection.account.type.channel': 'Canal',
  'connection.account.type.group': 'Grupo',
  'connection.account.type.organization': 'Organização',
  'connection.account.type.business': 'Conta empresarial',
  'connection.account.type.creator': 'Conta do criador',
  'connection.connectedBy': 'Conectado por {name} em {date}',
  'connection.lastPublished': 'Última publicação {relativeTime}',
  'connection.lastPublishedNever': 'Nada publicado nesta conta ainda',
  'connection.lastAnalyticsSync': 'Analítica sincronizada {relativeTime}',

  'connection.status.healthy': 'Trabalhando',
  'connection.status.expiringSoon': 'Expira {relativeTime}',
  'connection.status.expired': 'Acesso expirado',
  'connection.status.revoked': 'Acesso revogado',
  'connection.status.paused': 'Pausado',
  'connection.status.permissionMissing': 'Permissão ausente',
  'connection.status.reviewPending': 'Aguardando revisão da plataforma',
  'connection.status.unknown': 'Saúde indisponível',

  'connection.token.expiresAt': 'O acesso expira {date}',
  'connection.token.expiryUnknown': '{provider} não nos informa quando esse acesso expira.',

  'connection.permissions.title': 'Permissões',
  'connection.permissions.granted': 'Concedido',
  'connection.permissions.missing': 'Não concedido',
  'connection.permissions.explainBeforeOAuth':
    'Relay solicitará essas permissões a {provider}. Você pode desconectar a qualquer momento.',
  'connection.permissions.whyNeeded': 'Por que isso é necessário',

  'connection.reconnect.title': 'Reconecte {account}',
  'connection.reconnect.body':
    'As publicações agendadas para esta conta ficarão em espera até que ela seja reconectada. Nada está perdido.',
  'connection.disconnect.title': 'Desconectar {account}?',
  'connection.disconnect.body':
    'Postagens agendadas para esta conta não serão publicadas. Os recibos e análises já coletados permanecem neste espaço de trabalho.',
  'connection.pause.body':
    'Uma conta pausada mantém seu histórico e sua programação, mas não publica até que você a retome.',

  'connection.incident.invalidToken':
    '{provider} rejeitou o acesso armazenado para {account}. Reconecte para restaurar a publicação.',
  'connection.incident.permissionLost':
    '{account} não concede mais {permission}. Reconecte e aceite essa permissão.',
  'connection.incident.roleLost':
    'Seu usuário {provider} não tem mais função em {account}. Peça a um administrador dessa página para restaurá-la.',
  'connection.incident.accountTypeInvalid':
    'Instagram precisa de uma conta profissional. Mude {account} para uma conta comercial ou de criador e reconecte.',
  'connection.incident.reviewRestricted':
    '{provider} restringiu este aplicativo com revisão pendente. Postagens de {account} serão publicadas de forma privada até que a revisão seja concluída.',

  'connection.group.title': 'Grupos de clientes',
  'connection.group.description':
    'Os projetos mantêm cada produto ou cliente e suas contas separados.',
  'connection.group.assign': 'Mover para o grupo',
  'connection.group.none': 'Desagrupado',
  'connection.group.moveNote': 'Mover uma conta mantém suas publicações, recibos e análises.',

  'connection.oauth.starting': 'Abertura {provider}',
  'connection.oauth.returned': 'Terminando a conexão',
  'connection.oauth.chooseAccounts': 'Escolha quais contas conectar',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'Nenhuma conta neste login {provider} pode ser conectada. {reason}',
  'connection.oauth.canceled': 'A conexão foi cancelada em {provider}. Nada mudou.',
  'connection.oauth.alreadyConnected': '{account} já está conectado a este espaço de trabalho.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} está conectado a outro espaço de trabalho. Desconecte-o primeiro.',

  'capability.title': 'O que esta conta suporta',
  'capability.matrix.title': 'Capacidades da plataforma',
  'capability.matrix.subtitle':
    'Gerado a partir das definições do conector que mantemos e revisamos manualmente.',
  'capability.level.supported': 'Suportado',
  'capability.level.unsupported': 'Não oferecido pela plataforma',
  'capability.level.not_implemented': 'Ainda não construído',
  'capability.level.requires_review': 'Precisa de revisão da plataforma',
  'capability.level.beta': 'Beta',
  'capability.level.unknown': 'Indisponível',
  'capability.explain.supported': 'Relay pode fazer isso para esta conta hoje.',
  'capability.explain.unsupported':
    '{provider} não oferece isso por meio de sua API oficial, portanto nenhuma ferramenta pode fazer isso com segurança.',
  'capability.explain.not_implemented':
    '{provider} oferece isso, mas Relay ainda não o construiu. Está no roteiro do conector.',
  'capability.explain.requires_review':
    '{provider} concede isso somente depois de revisar o aplicativo ou a conta. Ele permanece indisponível até que a revisão seja aprovada.',
  'capability.explain.beta':
    'Isso funciona, com limites que não terminamos de verificar. Verifique o resultado antes de confiar nele.',
  'capability.explain.unknown':
    'Não foi possível ler as permissões atuais desta conta. Reconecte para atualizá-los.',
  'capability.lastChecked': 'Verificado {relativeTime}',
  'capability.feature.text': 'Postagens de texto',
  'capability.feature.image': 'Imagens',
  'capability.feature.carousel': 'Carrosséis',
  'capability.feature.video': 'Vídeo',
  'capability.feature.document': 'Documentos',
  'capability.feature.firstComment': 'Primeiro comentário agendado',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'Menções nativas',
  'capability.feature.destinations': 'Seleção de destino',
  'capability.feature.privacy': 'Controles de privacidade',
  'capability.feature.thumbnail': 'Miniatura personalizada',
  'capability.feature.altText': 'Texto alternativo',
  'capability.feature.analytics': 'Analítica',
  'capability.feature.delete': 'Excluir uma publicação publicada',
  'capability.feature.commentCount': 'Contagem de comentários',
  'capability.feature.commentReplies': 'Lendo e respondendo comentários',
  'capability.feature.disclosure': 'Divulgação de automação',
} as const;
