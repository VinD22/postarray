/**
 * The public marketing site and public documentation surfaces.
 *
 * Rules that bind this file specifically, beyond the catalog rules in
 * `lint.ts`:
 *
 *  - Every claim here is either a product fact we control (price, channel
 *    allowance, surfaces) or a provider fact that carries a source link and a
 *    verification date in the page that renders it. No adjective stands in for
 *    a number.
 *  - Nothing here promises reach, ranking, engagement or "going" anywhere.
 *  - Nothing here describes AI image or AI video generation as a Post Array
 *    feature, because it is not one.
 *  - No integration is called official until the provider has approved it. The
 *    connector matrix uses `capability.level.*` from `connections.ts` so the
 *    marketing site and the product cannot drift apart.
 *  - Legal wording that must be drafted by counsel is marked with
 *    `web.legal.counselPending.*` rather than guessed at here.
 */
export const webMarketingMessages = {
  /* ---------------------------------------------------------------------- */
  /* Shared marketing furniture                                              */
  /* ---------------------------------------------------------------------- */

  'web.brand.name': 'Post Array',
  'web.brand.tagline': 'O plano de controle de publicação multilíngue para pessoas e agentes.',
  'web.skipToContent': 'Pular para o conteúdo principal',
  'web.nav.label': 'Navegação no site',
  'web.nav.openMenu': 'Menu',
  'web.nav.closeMenu': 'Feche o menu',
  'web.nav.footerLabel': 'Navegação de rodapé',
  'web.cta.seeCapabilities': 'Leia a matriz de capacidade',
  'web.cta.readDocs': 'Leia a documentação',

  'web.label.lastReviewed': 'Última revisão {date}',
  'web.label.nextReview': 'Próxima revisão {date}',
  'web.label.researchDate': 'Pesquisou {date}',
  'web.label.officialSource': 'Fonte oficial',
  'web.label.onThisPage': 'Nesta página',
  'web.label.provider': 'Plataforma',
  'web.label.capability': 'Capacidade',

  'web.notFound.title': 'Não há página neste endereço',
  'web.notFound.body':
    'O link pode estar desatualizado ou retiramos a página. As páginas que deixam de ser precisas são descontinuadas em vez de deixadas de lado, e o changelog registra isso quando isso acontece.',
  'web.notFound.action': 'Vá para a página inicial',

  'web.correction.title': 'Encontrei algo errado nesta página',
  'web.correction.body':
    'As regras da plataforma mudam e erramos. Envie a URL e o que está incorreto e nós corrigiremos a página ou a retiraremos.',
  'web.correction.email': 'correções@postarray.com',

  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.home.title': 'Post Array, o plano de controle de publicação multilíngue',
  'web.meta.home.description':
    'Transforme uma ideia original em conteúdo nativo da plataforma, aprove-a uma vez, publique-a de forma confiável por meio de APIs oficiais da plataforma e saiba o que melhorar em seguida.',
  'web.meta.product.title': 'Como Post Array funciona',
  'web.meta.product.description':
    'Um passeio pela mesa editorial: redigir uma vez, adaptar por plataforma, validar em relação aos limites reais, aprovar, agendar, publicar e guardar o recibo.',
  'web.meta.integrations.title': 'Plataformas Post Array publica para',
  'web.meta.integrations.description':
    'A quais plataformas Post Array se conecta, o que cada conexão pode fazer hoje e o que a própria plataforma não permite.',
  'web.meta.capabilities.title': 'Matriz de capacidade do conector',
  'web.meta.capabilities.description':
    'Uma por plataforma, por tabela de capacidade gerada a partir de nossas definições de conector, separando o que construímos daquilo que a plataforma não oferece.',
  'web.meta.creators.title': 'Post Array para criadores',
  'web.meta.creators.description':
    'Para criadores solo que publicam a mesma ideia em vários formatos e idiomas sem reescrevê-la cinco vezes.',
  'web.meta.agencies.title': 'Post Array para agências',
  'web.meta.agencies.description':
    'Separação de clientes, aprovações, links de revisão compartilháveis, recibos e relatórios para equipes que publicam em nome de outras pessoas.',
  'web.meta.developers.title': 'Post Array para desenvolvedores',
  'web.meta.developers.description':
    'Um back-end por trás do aplicativo da web, a API REST, um servidor MCP remoto, a CLI e webhooks assinados. As mesmas regras de aprovação em todas as superfícies.',
  'web.meta.pricing.title': 'Preços',
  'web.meta.resources.title': 'Recursos',
  'web.meta.resources.description':
    'Status, changelog, documentação, metodologia, comparações, radar da ferramenta e catálogo de oportunidades.',
  'web.meta.status.title': 'Status',
  'web.meta.status.description':
    'Estado atual de cada superfície Post Array e de cada conector, além do histórico de incidentes.',
  'web.meta.changelog.title': 'Registro de alterações',
  'web.meta.changelog.description':
    'O que foi enviado, o que mudou nos conectores e o que foi corrigido.',
  'web.meta.docs.title': 'Documentação',
  'web.meta.docs.description':
    'API REST, servidor MCP, CLI e documentação de webhook para construção em Post Array.',
  'web.meta.methodology.title': 'Metodologia',
  'web.meta.methodology.description':
    'Como pesquisamos declarações de plataforma, como as datamos, como comparamos outros produtos e como corrigimos erros.',
  'web.meta.compare.title': 'Comparações',
  'web.meta.compare.description':
    'Comparações honestas e desatualizadas com outras ferramentas de publicação, incluindo para quem cada uma é melhor.',
  'web.meta.toolRadar.title': 'Radar de ferramenta criativa',
  'web.meta.toolRadar.description':
    'Um catálogo datado e revisado editorialmente de ferramentas criativas especializadas, com limitações, ressalvas de direitos e divulgação comercial.',
  'web.meta.opportunities.title': 'Oportunidades de promoção',
  'web.meta.opportunities.description':
    'Um catálogo com curadoria de locais onde um produto pode ser listado, lançado ou discutido, com regras de submissão próprias de cada destino.',

  /* ---------------------------------------------------------------------- */
  /* Home                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.home.promise':
    'Transforme uma ideia original em conteúdo nativo da plataforma, aprove-a uma vez, publique-a de forma confiável e saiba o que melhorar em seguida.',
  'web.home.lede':
    'Post Array é uma editora para pessoas que são responsáveis ​​pelo que sai. Você escreve uma vez, adapta por plataforma, vê os limites reais antes de agendar, obtém a aprovação que precisa, publica através de APIs oficiais da plataforma e guarda um recibo para cada publicação.',

  'web.home.example.title': 'Uma ideia, cinco versões nativas da plataforma',
  'web.home.example.body':
    'O compositor começa com uma versão master. Selecionar uma conta abre uma substituição apenas para essa conta, com seus próprios limites ativos e sua própria visualização. Nada do que você escreve para LinkedIn muda o que X recebe.',
  'web.home.example.column.account': 'Conta',
  'web.home.example.column.variant': 'O que esta conta recebe',
  'web.home.example.column.check': 'Verificado antes do agendamento',
  'web.home.example.caption':
    'Uma composição ilustrativa. Os limites e configurações mostrados vêm da definição do conector para cada plataforma, não de uma estimativa.',
  'web.home.example.x.account': 'X, @northbound',
  'web.home.example.x.variant': 'Texto mestre, abreviado, mais um tópico de duas publicações',
  'web.home.example.x.check':
    'Contagem de caracteres, ordem dos threads, custo estimado da API para uma publicação de link',
  'web.home.example.linkedin.account': 'LinkedIn, Ferramentas Northbound',
  'web.home.example.linkedin.variant': 'Texto mestre mais longo com o documento anexado',
  'web.home.example.linkedin.check':
    'Função da organização, comprimento da publicação, tipo de documento',
  'web.home.example.instagram.account': 'Instagram, @northbound.tools',
  'web.home.example.instagram.variant':
    'Corte quadrado da mesma imagem, legenda reescrita para o feed',
  'web.home.example.instagram.check':
    'Tipo de conta profissional, proporção, texto alternativo presente',
  'web.home.example.youtube.account': 'YouTube, sentido norte',
  'web.home.example.youtube.variant': 'O mesmo clipe de um Curta, com título e descrição próprios',
  'web.home.example.youtube.check':
    'Escopo do upload, estado de auditoria, privacidade em que o upload chegará',
  'web.home.example.bluesky.account': 'Bluesky, sentido norte.exemplo',
  'web.home.example.bluesky.variant': 'Texto mestre com o cartão de link',
  'web.home.example.bluesky.check':
    'Contagem de caracteres, resolução do cartão de link, texto alternativo presente',

  'web.home.pillars.title': 'O que Post Array foi feito para ser bom',
  'web.home.pillars.confidence.title': 'Publique com confiança',
  'web.home.pillars.confidence.body':
    'Uma visualização verdadeira por conta, políticas determinísticas e verificações de plataforma antes de qualquer coisa ser colocada na fila, a aprovação que seu espaço de trabalho exige, um recibo imutável com o ID de publicação externo e um estado de integridade para cada conexão.',
  'web.home.pillars.confidence.proof':
    'Cada gravação externa carrega uma chave de idempotência, portanto, uma falha do trabalhador após a plataforma aceitar uma publicação não cria uma segunda.',
  'web.home.pillars.adapt.title': 'Adapte em vez de duplicar',
  'web.home.pillars.adapt.body':
    'Variantes por plataforma que você pode substituir uma conta por vez, e transcriação em vez de tradução literal, com um glossário do projeto e um revisor nomeado por idioma.',
  'web.home.pillars.adapt.proof':
    'A interface está disponível em idiomas selecionados. A adaptação de conteúdo abrange 20 idiomas de conteúdo e cada um deles pode ser revisado antes de ser publicado.',
  'web.home.pillars.loop.title': 'Feche o ciclo',
  'web.home.pillars.loop.body':
    'Analytics que nomeia a métrica, a plataforma que a reportou, o denominador e quando foi atualizada pela última vez. Onde uma plataforma não relata algo, Post Array diz isso em vez de mostrar um zero.',
  'web.home.pillars.loop.proof':
    'Uma publicação é comparada com sua própria mediana, e não com uma pontuação que ninguém pode auditar.',
  'web.home.pillars.anywhere.title': 'Trabalhe de onde você já está',
  'web.home.pillars.anywhere.body':
    'O aplicativo da web, uma API REST, um servidor MCP remoto, uma CLI e webhooks assinados chamam os mesmos serviços de aplicativo, as mesmas regras de autorização e os mesmos validadores.',
  'web.home.pillars.anywhere.proof':
    'Um agente não pode ignorar uma política de aprovação usando uma superfície diferente, porque a política é aplicada no serviço, não na interface.',
  'web.home.pillars.economics.title': 'Economia que você pode prever',
  'web.home.pillars.economics.body':
    'Um preço, todos os recursos enviados, 30 canais ativos e membros de equipe ilimitados. O uso da plataforma que um provedor cobra por operação é repassado ao custo e mostrado antes de você confirmar a ação.',
  'web.home.pillars.economics.proof':
    'Não existe sistema de crédito de geração de imagem ou vídeo, pois Post Array não gera mídia.',

  'web.home.honest.title': 'O que Post Array não faz',
  'web.home.honest.lede':
    'Estes são limites, não uma provocação de roteiro. Se um deles mudar, ele muda primeiro no changelog.',
  'web.home.honest.noAutomationOfEngagement':
    'Sem curtidas, seguidores, repostagens, respostas não solicitadas ou mensagens diretas automáticas. Sem cápsulas de engajamento e sem engajamento fabricado.',
  'web.home.honest.noUnofficial':
    'Sem automação do navegador, sem repetição de cookies, sem raspagem e sem endpoints de publicação não oficiais. Somente APIs da plataforma oficial.',
  'web.home.honest.noPromises':
    'Nenhuma promessa sobre alcance, classificação ou engajamento. Post Array pode lhe dizer o que aconteceu e o que testar em seguida. Ele não pode dizer o que o público fará.',
  'web.home.honest.noUnattendedPublishing':
    'Nenhuma publicação autônoma por padrão. Um agente pode redigir, validar e solicitar aprovação. Um ser humano decide antes de qualquer coisa se tornar pública, a menos que você opte deliberadamente pela exclusão de uma política específica.',

  'web.home.surfaces.title': 'Cinco superfícies, um backend',
  'web.home.surfaces.body':
    'Os mesmos casos de uso, as mesmas verificações de locação, os mesmos validadores e os mesmos fluxos de trabalho de publicação. Uma superfície é uma entrada, nunca um atalho para ultrapassar uma regra.',
  'web.home.surfaces.web': 'Aplicativo Web',
  'web.home.surfaces.webBody':
    'Composer, calendário, aprovações, análises, conexões e configurações.',
  'web.home.surfaces.api': 'API REST',
  'web.home.surfaces.apiBody':
    'Chaves com escopo, chaves de idempotência em cada gravação, paginação do cursor, erros de digitação.',
  'web.home.surfaces.mcp': 'Servidor MCP remoto',
  'web.home.surfaces.mcpBody':
    'HTTP streamable, OAuth, por escopos de ferramenta e uma visualização antes de cada chamada consequente.',
  'web.home.surfaces.cli': 'CLI',
  'web.home.surfaces.cliBody':
    'Saída estável legível por máquina para scripts e integração contínua.',
  'web.home.surfaces.webhooks': 'Webhooks assinados',
  'web.home.surfaces.webhooksBody':
    'Publique resultados, decisões de aprovação e integridade da conexão, com nova entrega.',

  'web.home.closing.title': 'Comece com uma conta e uma publicação',
  'web.home.closing.body':
    'Conecte uma conta, rascunhe uma publicação, observe a execução da validação, agende e leia o recibo. Esse é o produto completo em cerca de dez minutos.',

  /* ---------------------------------------------------------------------- */
  /* Product                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.product.title': 'A editora',
  'web.product.lede':
    'Sete perguntas devem ser respondidas em cada etapa sem clicar em nada: o que está sendo postado, onde, qual versão cada conta recebe, quando e em qual fuso horário, quem aprovou, quanto pode custar e o que aconteceu.',

  'web.product.step.source.title': 'Fonte',
  'web.product.step.source.body':
    'Comece com um briefing, um arquivo que você já possui, um item RSS ou uma solicitação de um agente. A mídia importada mantém a procedência que você forneceu, incluindo a origem e quem detém os direitos.',
  'web.product.step.compose.title': 'Componha uma vez e substitua',
  'web.product.step.compose.body':
    'Uma versão master impulsiona todos os alvos. Selecionar uma conta abre uma substituição apenas para essa conta: seu próprio texto, seu próprio corte de mídia, suas próprias configurações, seu próprio contador de limite ao vivo e sua própria visualização. Redefinir uma substituição restaura o mestre em uma ação e mostra a diferença primeiro.',
  'web.product.step.validate.title': 'Validar antes que qualquer coisa seja colocada na fila',
  'web.product.step.validate.body':
    'A validação é determinística e roda no servidor. Ele verifica os limites da plataforma a partir do instantâneo de capacidade versionado, o tipo de conta, texto alternativo, direitos de mídia, regras de duplicação e cadência, resolução de menção e destino e o custo estimado de uso da plataforma. Cada problema nomeia o alvo ao qual pertence e como corrigi-lo.',
  'web.product.step.approve.title': 'Aprovar uma vez',
  'web.product.step.approve.body':
    'A aprovação é uma política do espaço de trabalho, não um hábito. Um revisor vê cada alvo, cada variante, o fuso horário, o estado de privacidade e o custo estimado em uma tela, e funciona em um telefone. O conteúdo alterado após a aprovação requer aprovação novamente.',
  'web.product.step.schedule.title': 'Agende em fuso horário real',
  'web.product.step.schedule.body':
    'Cada publicação programada armazena um fuso horário instantâneo e um fuso horário da IANA, nunca um horário local ingênuo. As transições de horário de verão são mostradas antes de você confirmar, não descobertas depois.',
  'web.product.step.publish.title': 'Publique e guarde o recibo',
  'web.product.step.publish.body':
    'Cada alvo é despachado com uma chave de idempotência. Um destino que falha não reverte um destino que foi bem-sucedido e esse estado tem seu próprio nome: parcialmente publicado. Cada resultado produz um recibo imutável com o ID da publicação externa, o identificador da solicitação, o histórico de tentativas e o erro exato, se houver.',
  'web.product.step.learn.title': 'Aprenda',
  'web.product.step.learn.body':
    'As métricas são normalizadas, nomeadas, atribuídas à plataforma que as reportou e carimbadas com um tempo de atualização. Uma métrica que uma plataforma não relata é marcada como indisponível com o motivo. Nunca é renderizado como zero.',

  'web.product.shot.caption':
    'As capturas de tela nesta página são capturadas do produto em execução. Até que uma superfície esteja completa o suficiente para ser fotografada honestamente, nós a descrevemos em palavras em vez de fazer um desenho dela.',
  'web.product.shot.pending': 'Captura de tela pendente de captura',
  'web.product.shot.pendingReason':
    'Esta superfície ainda está em construção. Publicaremos uma captura real em vez de uma ilustração.',

  'web.product.states.title': 'Os estados que ninguém gosta de projetar',
  'web.product.states.body':
    'Uma ferramenta de publicação é julgada no dia ruim, não no bom. Cada um deles tem uma tela projetada, uma frase simples e uma próxima ação.',
  'web.product.states.partial':
    'Publicado parcialmente: quais alvos estão ativos, quais falharam e por quê.',
  'web.product.states.revoked':
    'Um token revogado encontrado no momento do envio, com o caminho de reconexão.',
  'web.product.states.rateLimited':
    'Um limite de taxa da plataforma, com quando ela é redefinida e o que está na fila atrás dela.',
  'web.product.states.duplicate':
    'Uma duplicata ou bloco de cadência, com a regra que disparou e o caminho da apelação.',
  'web.product.states.offline': 'Offline enquanto compõe: nada do que você escreveu é perdido.',
  'web.product.states.permission':
    'Uma ação que sua função não permite, nomeando a função que permite.',

  /* ---------------------------------------------------------------------- */
  /* Integrations and capability matrix                                      */
  /* ---------------------------------------------------------------------- */

  'web.integrations.title': 'Plataformas',
  'web.integrations.lede':
    'Post Array se conecta por meio de APIs oficiais da plataforma. Cada conector tem um proprietário nomeado, um URL de política registrado e uma data de revisão. Um conector não é listado como compatível até que seja aprovado na definição de conector concluído.',
  'web.integrations.reviewNotice.title':
    'Nenhum conector é descrito como oficial antes da plataforma aprová-lo',
  'web.integrations.reviewNotice.body':
    'Várias plataformas exigem uma revisão do aplicativo antes que ele possa ser publicado em nome de um cliente. Onde essa revisão é excelente, o conector diz isso e descreve exatamente o que está restrito até que seja aprovado.',
  'web.integrations.accountTypes': 'Tipos de conta para os quais este conector pode publicar',
  'web.integrations.restriction': 'Restrição que você deve saber antes de conectar',
  'web.integrations.cost': 'Custo de uso da plataforma',
  'web.integrations.viewMatrix': 'Veja todos os recursos desta plataforma',

  'web.capabilities.title': 'Matriz de capacidade do conector',
  'web.capabilities.lede':
    'Gerado a partir das mesmas definições de conector que o produto lê e revisado por uma pessoa antes da publicação. O marketing não pode prometer algo que um adaptador não pode fazer.',
  'web.capabilities.legend.title': 'Como ler esta tabela',
  'web.capabilities.legend.body':
    'Quatro estados, e a diferença entre os dois do meio é importante. Ainda não construído é o nosso backlog. O que não é oferecido pela plataforma é um fato sobre a plataforma que nenhuma ferramenta pode contornar.',
  'web.capabilities.tableCaption':
    'Capacidades por plataforma. Cada célula nomeia seu estado em palavras e também por cor.',
  'web.capabilities.snapshot': 'Versão de definições do conector {version}, revisado {date}',
  'web.capabilities.sourceNote':
    'Cada declaração de plataforma nesta tabela está vinculada à documentação oficial de onde veio e à data em que a lemos pela última vez.',

  /* ---------------------------------------------------------------------- */
  /* Audience pages                                                          */
  /* ---------------------------------------------------------------------- */

  'web.creators.title': 'Para criadores',
  'web.creators.lede':
    'Você publica a mesma ideia em vários formatos, às vezes em mais de um idioma, e você é toda a equipe. O trabalho que Post Array remove é redigitar, recortar e verificar.',
  'web.creators.job.adapt.title': 'Escreva uma vez, envie cinco versões nativas',
  'web.creators.job.adapt.body':
    'A versão master carrega a ideia. Cada conta obtém o comprimento, o corte, as configurações e o tom que a plataforma espera, e você pode ver todos eles lado a lado antes de confirmar.',
  'web.creators.job.languages.title': 'Publique em outro idioma sem adivinhar',
  'web.creators.job.languages.body':
    'A transcriação mantém a intenção em vez das palavras, usa o glossário do seu projeto e marca se um revisor nativo o leu. Nada é publicado em um idioma que você não possa garantir, a menos que você o diga.',
  'web.creators.job.rights.title': 'Mantenha seu registro de direitos com o arquivo',
  'web.creators.job.rights.body':
    'Media carrega de onde veio, quem detém os direitos e se foi criada com uma ferramenta generativa. As plataformas perguntam cada vez mais. Post Array armazena sua resposta com o ativo em vez de perguntar novamente.',
  'web.creators.job.cost.title': 'Saiba o custo antes de postar',
  'web.creators.job.cost.body':
    'X cobra por operação e cobra mais por uma publicação contendo uma URL. Post Array estima isso antes de você confirmar, então uma semana com muitos links é uma decisão e não uma surpresa na fatura.',
  'web.creators.notFor.title': 'O que isso não é',
  'web.creators.notFor.body':
    'Post Array não gera imagens ou vídeos, não executa automação de engajamento e não prevê o desempenho de uma publicação. Se essas são as ferramentas que você deseja, outros produtos as fazem e preferimos que você saiba agora.',

  'web.agencies.title': 'Para agências',
  'web.agencies.lede':
    'Você publica em nome de outras pessoas, o que torna a atribuição, aprovação e evidência parte do trabalho, em vez de uma gentileza.',
  'web.agencies.job.separation.title': 'Separação de clientes que sustenta',
  'web.agencies.job.separation.body':
    'Todo espaço de trabalho é isolado no nível do banco de dados e também no aplicativo. Uma consulta que ultrapassa os limites do espaço de trabalho falha no Postgres, não apenas em um caminho de código que alguém poderia esquecer.',
  'web.agencies.job.approval.title': 'Aprovações que um cliente pode realmente usar',
  'web.agencies.job.approval.body':
    'Um revisor vê cada alvo, cada variante, a programação com seu fuso horário e o custo estimado em uma única tela, e a tela funciona em um telefone. As decisões de aprovação são registradas com quem, quando e o que viram.',
  'web.agencies.job.receipts.title': 'Evidência da conversa estranha',
  'web.agencies.job.receipts.body':
    'Cada publicação produz um recibo imutável com o ID da publicação externa e o histórico completo de tentativas. Quando um cliente pergunta se algo saiu às nove, a resposta tem um carimbo de data e hora e um identificador de plataforma anexados.',
  'web.agencies.job.roles.title': 'Funções que correspondem à forma como o trabalho é dividido',
  'web.agencies.job.roles.body':
    'Proprietário, administrador, editor, aprovador, analista e visualizador, com escopo por projeto e por conta. Cada espaço de trabalho inclui o proprietário e até 5 colegas de equipe. Cada ação é atribuída à pessoa que a concluiu.',
  'web.agencies.limits.title': 'O limite, declarado claramente',
  'web.agencies.limits.body':
    'Um plano cobre 30 canais sociais ativos. Um canal é uma conexão de conta social, página, perfil, grupo ou publicação. Se precisar de mais de 30, diga-nos o que precisa e lhe daremos uma resposta direta, em vez de uma camada oculta.',

  'web.developers.title': 'Para desenvolvedores',
  'web.developers.lede':
    'A publicação é a parte de um fluxo de trabalho onde um erro é público e permanente. Post Array oferece um back-end, erros de digitação, idempotência em cada gravação e um modelo de aprovação que um agente não pode contornar.',
  'web.developers.surface.api.title': 'API REST',
  'web.developers.surface.api.body':
    'Chaves de API com escopo, uma chave de idempotência necessária em cada gravação, paginação do cursor e um envelope de erro digitado contendo um código estável, uma chave de mensagem e detalhes limpos. Nenhuma carga útil do provedor é refletida de volta para você de forma bruta.',
  'web.developers.surface.mcp.title': 'Servidor MCP remoto',
  'web.developers.surface.mcp.body':
    'HTTP streamável com OAuth. As ferramentas são granulares e cada uma declara seus efeitos colaterais. Ler, redigir, solicitar aprovação, agendar e publicar são escopos separados, portanto, um modelo que pode redigir não pode publicar.',
  'web.developers.surface.cli.title': 'CLI',
  'web.developers.surface.cli.body':
    'Cada comando suporta saída legível por máquina com um formato estável, para que um script possa analisá-lo e um trabalho de integração contínua possa falhar nele.',
  'web.developers.surface.webhooks.title': 'Webhooks assinados',
  'web.developers.surface.webhooks.body':
    'Publique resultados, decisões de aprovação, integridade da conexão e resultados de validação, assinados, resistentes à reprodução e reentregas no painel.',
  'web.developers.safety.title': 'O modelo de segurança do agente',
  'web.developers.safety.body':
    'Uma credencial de agente é uma conta de serviço com escopo definido, não uma cópia de uma sessão pessoal. Ele carrega restrições por marca, por conta, por localidade, por domínio, por cadência e por antecipação, e o servidor reautoriza cada chamada em vez de confiar no host do agente.',
  'web.developers.safety.injection':
    'Páginas da Web, feeds, comentários e respostas da plataforma são tratados como dados não confiáveis. A saída do modelo é revalidada deterministicamente, porque um modelo dizendo que uma publicação está correta não é uma decisão de segurança.',
  'web.developers.safety.killSwitch':
    'Todo agente e todo espaço de trabalho tem um kill switch que interrompe o trabalho pendente sem excluí-lo.',
  'web.developers.openSource.title': 'Peças abertas',
  'web.developers.openSource.body':
    'O contrato do conector, a CLI, os exemplos de esquema, as definições da ferramenta MCP e o simulador de provedor são as partes que você precisa para construir em Post Array sem uma conta sandbox. Onde um repositório ainda não foi publicado, esta página diz isso em vez de vincular a nada.',

  /* ---------------------------------------------------------------------- */
  /* Resources index                                                         */
  /* ---------------------------------------------------------------------- */

  'web.resources.title': 'Recursos',
  'web.resources.lede':
    'Verdade operacional sobre o produto e a pesquisa por trás de qualquer coisa que afirmamos sobre uma plataforma.',
  'web.resources.status.body':
    'Estado atual de cada superfície e cada conector, com histórico de incidentes.',
  'web.resources.changelog.body':
    'O que foi enviado, o que mudou em um conector e o que corrigimos.',
  'web.resources.docs.body': 'REST API, MCP, CLI e documentação de webhook.',
  'web.resources.methodology.body':
    'Como pesquisamos, datamos, fornecemos e corrigimos todas as reivindicações da plataforma.',
  'web.resources.compare.body':
    'Comparações datadas com outras ferramentas, incluindo para quem cada uma delas se adapta.',
  'web.resources.capabilities.body':
    'Por plataforma, por capacidade, gerada a partir das definições do conector.',
  'web.resources.toolRadar.body':
    'Ferramentas criativas especializadas, datadas, com limitações e divulgação.',
  'web.resources.opportunities.body':
    'Seleção de locais para lançar, listar ou contribuir, com regras de cada destino.',
  'web.resources.guides.title': 'Guias e fluxos de trabalho',
  'web.resources.guides.empty': 'Nenhum guia foi publicado ainda',
  'web.resources.guides.emptyBody':
    'O padrão editorial requer dados originais do produto, um fluxo de trabalho reproduzível, fontes primárias de plataforma com uma data de verificação e um editor humano nomeado. Os primeiros guias publicam quando o encontram.',

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.status.title': 'Status',
  'web.status.lede':
    'O estado de cada superfície Post Array e de cada conector. O estado do conector abrange nosso adaptador e a API da plataforma da qual ele depende.',
  'web.status.updated': 'Os status são definidos manualmente. Última atualização {time}.',
  'web.status.surfaces.title': 'Superfícies',
  'web.status.connectors.title': 'Conectores',
  'web.status.level.operational': 'Operando normalmente',
  'web.status.level.degraded': 'Degradado',
  'web.status.level.partial': 'Falta parcial',
  'web.status.level.outage': 'Interrupção',
  'web.status.level.maintenance': 'Manutenção planejada',
  'web.status.level.notLive': 'Ainda não ativo',
  'web.status.notLiveBody':
    'Este conector foi construído, mas ainda não está transportando tráfego de clientes, portanto não há nada para relatar.',
  'web.status.incidents.title': 'Histórico de incidentes',
  'web.status.incidents.empty': 'Nenhum incidente foi registrado',
  'web.status.incidents.emptyBody':
    'Esta página começa vazia de propósito. Publicamos todos os incidentes que afetaram a publicação, inclusive aqueles causados por nossos próprios erros, com o cronograma e o que mudou depois.',
  'web.status.incident.started': 'Iniciado {time}',
  'web.status.incident.resolved': 'Resolvido {time}',
  'web.status.incident.impact': 'Impacto',
  'web.status.incident.cause': 'Porque',
  'web.status.incident.followUp': 'O que mudou depois',
  'web.status.subscribe.title': 'Receba quando algo quebrar',
  'web.status.subscribe.body':
    'A integridade da conexão, falhas de publicação e incidentes de plataforma são entregues como webhooks assinados para seu próprio endpoint. Ainda não existe uma lista de discussão de status separada.',

  /* ---------------------------------------------------------------------- */
  /* Changelog                                                               */
  /* ---------------------------------------------------------------------- */

  'web.changelog.title': 'Registro de alterações',
  'web.changelog.lede':
    'Alterações de produtos, alterações e correções de conectores. Uma alteração de capacidade que afeta o que você pode publicar aparece aqui antes de aparecer em qualquer outro lugar deste site.',
  'web.changelog.kind.shipped': 'Enviado',
  'web.changelog.kind.changed': 'Alterado',
  'web.changelog.kind.fixed': 'Fixo',
  'web.changelog.kind.connector': 'Conector',
  'web.changelog.kind.correction': 'Correção',
  'web.changelog.kind.security': 'Segurança',
  'web.changelog.empty': 'Nada foi enviado publicamente ainda',
  'web.changelog.emptyBody':
    'Post Array está em construção. A primeira entrada aqui é a primeira coisa que um cliente pode usar, não um marco sobre nós mesmos.',

  /* ---------------------------------------------------------------------- */
  /* Docs shell                                                              */
  /* ---------------------------------------------------------------------- */

  'web.docs.title': 'Documentação',
  'web.docs.lede':
    'Um back-end, quatro entradas. Cada seção documenta os mesmos casos de uso, portanto, um conceito que você aprende na API REST é o mesmo conceito no MCP e na CLI.',
  'web.docs.section.start.title': 'Primeiros passos',
  'web.docs.section.start.body':
    'Autenticação, espaços de trabalho, projetos e sua primeira publicação.',
  'web.docs.section.api.title': 'API REST',
  'web.docs.section.api.body':
    'Recursos, paginação, idempotência, códigos de erro e limites de taxa.',
  'web.docs.section.mcp.title': 'servidor MCP',
  'web.docs.section.mcp.body':
    'Transporte, OAuth, catálogo de ferramentas, escopos e handshake de aprovação.',
  'web.docs.section.cli.title': 'CLI',
  'web.docs.section.cli.body': 'Instale, autentique e o contrato de saída legível por máquina.',
  'web.docs.section.webhooks.title': 'Webhooks',
  'web.docs.section.webhooks.body':
    'Catálogo de eventos, verificação de assinatura, novas tentativas e nova entrega.',
  'web.docs.section.connectors.title': 'Conectores',
  'web.docs.section.connectors.body':
    'Por requisitos de plataforma, tipos de conta, limites e restrições conhecidas.',
  'web.docs.section.errors.title': 'Referência de erro',
  'web.docs.section.errors.body': 'Cada código de erro, o que o causa e o que fazer a respeito.',
  'web.docs.pending': 'Ainda não publicado',
  'web.docs.pendingBody':
    'Esta seção foi escrita na API enviada e publicada com ela. Preferimos mostrar nada a você do que documentação para um endpoint que pode mudar.',
  'web.docs.principles.title': 'Em que você pode confiar',
  'web.docs.principles.idempotency':
    'Cada gravação requer uma chave de idempotência. Reproduzir uma solicitação com a mesma chave retorna o resultado original em vez de criar uma segunda publicação.',
  'web.docs.principles.errors':
    'Cada erro carrega um código estável, uma chave de mensagem e detalhes limpos. Os códigos não mudam de significado entre versões.',
  'web.docs.principles.versioning':
    'Alterações significativas recebem uma nova versão e uma janela de descontinuação anunciada. Mudanças aditivas não.',
  'web.docs.principles.scopes':
    'Leitura, redação, solicitação de aprovação, agendamento e publicação são escopos distintos. Uma credencial obtém o menor conjunto que faz seu trabalho.',

  /* ---------------------------------------------------------------------- */
  /* Methodology                                                             */
  /* ---------------------------------------------------------------------- */

  'web.methodology.title': 'Metodologia',
  'web.methodology.lede':
    'Como algo neste site pode ser chamado de verdade e o que acontece quando isso não é verdade.',
  'web.methodology.claims.title': 'Reivindicações da plataforma',
  'web.methodology.claims.body':
    'Toda reivindicação sobre o que uma plataforma permite vem da documentação ou página de política da própria plataforma. Registramos o URL, a data em que foi lido, a versão da API onde se aplica e o proprietário que o verifica novamente. Uma reclamação sem essas quatro coisas não vai para o site.',
  'web.methodology.recheck.title': 'Quando verificamos novamente',
  'web.methodology.recheck.beforeConnector':
    'Antes de um conector ser iniciado e novamente antes de transportar o tráfego do cliente.',
  'web.methodology.recheck.monthly':
    'Todos os meses para registros de alterações da plataforma e preços de fornecedores.',
  'web.methodology.recheck.quarterly':
    'A cada trimestre para planos de concorrentes, regras da comunidade e documentos legais.',
  'web.methodology.recheck.immediate':
    'Imediatamente após qualquer rejeição da plataforma, aviso de aplicação, suspensão de uso ou alteração inexplicável no comportamento de publicação ou análise.',
  'web.methodology.comparison.title': 'Comparações',
  'web.methodology.comparison.bestFor':
    'Cada comparação indica para quem cada produto é melhor, inclusive quando não somos nós.',
  'web.methodology.comparison.dated':
    'Cada comparação traz a data da pesquisa e vincula as principais fontes de preços e capacidade.',
  'web.methodology.comparison.distinction':
    'Uma capacidade ausente é rotulada como algo que não construímos ou como algo que a plataforma não permite. Estas são frases diferentes e nunca as fundimos.',
  'web.methodology.comparison.noLogos':
    'Não usamos logotipos de clientes de outras empresas, citações ou capturas de tela de interface e não reivindicamos um endosso que não possuímos.',
  'web.methodology.benchmarks.title': 'Benchmarks e dados do produto',
  'web.methodology.benchmarks.body':
    'Qualquer número extraído da atividade do cliente indica sua amostra, suas exclusões, sua definição de métrica e seu limite de privacidade, e é agregado para que nenhum espaço de trabalho possa ser identificado. Se uma amostra for muito pequena para ser publicada com segurança, dizemos isso em vez de publicá-la de qualquer maneira.',
  'web.methodology.ai.title': 'AI em nosso próprio conteúdo',
  'web.methodology.ai.body':
    'Um modelo pode pesquisar, delinear, traduzir, verificar e formatar. Uma pessoa nomeada é proprietária de cada reivindicação, edita o artigo e o mantém atualizado. Não publicamos artigos gerados não revisados e não geramos capturas de tela.',
  'web.methodology.corrections.title': 'Correções',
  'web.methodology.corrections.body':
    'Quando uma página está errada, nós a corrigimos no local, adicionamos uma nota de correção datada e listamos a correção no changelog. Quando uma página está muito obsoleta para ser corrigida, nós a retiramos em vez de deixá-la ativa.',

  /* ---------------------------------------------------------------------- */
  /* Compare                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.compare.title': 'Comparações',
  'web.compare.lede':
    'Essas páginas são úteis mesmo se você escolher outro produto. Esse é o padrão que eles devem atender antes de publicar.',
  'web.compare.rules.title': 'As regras que estas páginas seguem',
  'web.compare.rules.bestFor':
    'Cada página indica para quem o outro produto é melhor, em sua própria seção, primeiro.',
  'web.compare.rules.dated': 'Cada reivindicação é datada e vincula a fonte primária de onde veio.',
  'web.compare.rules.distinction':
    'Separamos o que não construímos daquilo que uma plataforma não permite.',
  'web.compare.rules.axes':
    'Cada página compara as mesmas coisas: subsídio de conta, limites de publicação, equipe e aprovação, API, acesso MCP e CLI, idiomas de conteúdo, análises, manipulação de vídeo, uso incorporado, auto-hospedagem, suporte e o custo da API da plataforma que você paga adicionalmente.',
  'web.compare.rules.correction': 'Cada página traz um contato de correção e uma data de revisão.',
  'web.compare.planned.title': 'Páginas planejadas',
  'web.compare.planned.body':
    'Eles serão publicados assim que a verificação atual de preços e capacidade for concluída. Uma comparação escrita de memória é pior do que nenhuma comparação.',
  'web.compare.empty': 'Nenhuma comparação foi publicada ainda',
  'web.compare.emptyBody':
    'Cada página precisa de uma nova verificação de fatos em relação aos preços e documentação do outro produto. Eles publicam um de cada vez à medida que o trabalho termina.',

  /* ---------------------------------------------------------------------- */
  /* Tool radar                                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.title': 'Radar da ferramenta criativa',
  'web.toolRadar.lede':
    'Post Array não gera imagens ou vídeos. Isso ajuda você a decidir qual ferramenta especializada usar e trazer o ativo finalizado com seu registro de direitos intacto.',
  'web.toolRadar.record.title': 'O que todo registro deve conter',
  'web.toolRadar.record.url': 'O URL oficial e a organização proprietária do produto.',
  'web.toolRadar.record.useCase':
    'O fluxo de trabalho para o qual está sendo recomendado e suas limitações documentadas.',
  'web.toolRadar.record.pricing': 'Seu modelo de preços e a data em que o verificamos.',
  'web.toolRadar.record.rights':
    'Seus direitos, licenciamento, retenção e advertências de privacidade, nas próprias palavras do fornecedor.',
  'web.toolRadar.record.disclosure':
    'Se temos alguma relação comercial com ela. A classificação nunca depende disso.',
  'web.toolRadar.record.verified':
    'Uma última data verificada e um aviso visível quando um registro passa da janela de revisão.',
  'web.toolRadar.category.title': 'Categorias',
  'web.toolRadar.empty': 'O catálogo ainda não foi preenchido',
  'web.toolRadar.emptyBody':
    'Os registros são escritos por uma pessoa da documentação do próprio fornecedor. Não preencheremos esta página com links gerados por modelos que pareçam plausíveis.',
  'web.toolRadar.noAffiliateYet':
    'Não há relacionamento de afiliado com nenhuma ferramenta listada aqui hoje.',

  /* ---------------------------------------------------------------------- */
  /* Opportunities                                                           */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.title': 'Oportunidades de promoção',
  'web.opportunities.lede':
    'Um catálogo com curadoria de locais onde um produto pode ser lançado, listado, discutido ou contribuído, com as regras que cada destino define para si.',
  'web.opportunities.rules.title': 'Como este catálogo se comporta',
  'web.opportunities.rules.curated':
    'Cada entrada é um registro revisado com uma URL oficial, as regras de envio atuais e uma data de verificação. Nada é descoberto por um modelo e apresentado como verificado.',
  'web.opportunities.rules.noAutomation':
    'Post Array nunca envia um formulário, raspa um contato, envia e-mails em massa ou publicações para uma comunidade para você. Você faz o envio.',
  'web.opportunities.rules.noGuarantee':
    'Uma listagem não é uma promessa de classificação e um link não é uma estratégia de crescimento. Mostramos requisitos de adequação, público, esforço, custo e divulgação para que você decida se vale a pena passar a tarde.',
  'web.opportunities.rules.stale':
    'Um registro após a data de revisão é rotulado ou oculto em vez de mostrado como atual.',
  'web.opportunities.category.title': 'Categorias',
  'web.opportunities.empty': 'O catálogo ainda não foi preenchido',
  'web.opportunities.emptyBody':
    'Cada regra de destino deve ser lida e registrada por uma pessoa antes de ser recomendada. As categorias estão listadas acima para que você possa ver o que está por vir.',

  /* ---------------------------------------------------------------------- */
  /* Platform names and per platform facts                                   */
  /* ---------------------------------------------------------------------- */

  'web.marketing.provider.x.label': 'X',
  'web.marketing.provider.linkedin.label': 'LinkedIn',
  'web.marketing.provider.instagram.label': 'Instagram',
  'web.marketing.provider.facebook.label': 'Facebook',
  'web.marketing.provider.youtube.label': 'YouTube',
  'web.marketing.provider.tiktok.label': 'TikTok',
  'web.marketing.provider.threads.label': 'Threads',
  'web.marketing.provider.bluesky.label': 'Bluesky',

  'web.marketing.provider.x.accountTypes': 'Uma conta pessoal ou empresarial X que você controla.',
  'web.marketing.provider.x.restriction':
    'A publicação automatizada requer o consentimento expresso do titular da conta, que Post Array registra. Postagens duplicadas ou substancialmente semelhantes entre contas não são permitidas e respostas automáticas não solicitadas não são criadas.',
  'web.marketing.provider.x.cost':
    'X cobra por cada operação de API e cobra mais por uma publicação contendo uma URL. Post Array estima o custo antes de você confirmar e repassa sem marcação.',

  'web.marketing.provider.linkedin.accountTypes':
    'Um perfil de membro ou uma página de organização onde você ocupa a função certa.',
  'web.marketing.provider.linkedin.restriction':
    'A publicação em nome de uma organização precisa de um produto de gerenciamento de comunidade aprovado e de uma identidade comercial verificada. A análise das publicações dos membros depende de uma permissão de leitura LinkedIn fechou para novos aplicativos, então Post Array não a oferecerá.',
  'web.marketing.provider.linkedin.cost':
    'Sem cobrança por operação. Aplicam-se limites diários de inscrição e membros.',

  'web.marketing.provider.instagram.accountTypes':
    'Uma conta profissional Instagram, empresa ou criador.',
  'web.marketing.provider.instagram.restriction':
    'Instagram a publicação de conteúdo está disponível apenas para contas profissionais. Uma conta de consumidor não pode ser publicada por nenhum aplicativo, incluindo este. A publicação usa o contêiner oficial e a sequência de publicação, e Post Array confirma o estado final em vez de relatar o upload como bem-sucedido.',
  'web.marketing.provider.instagram.cost':
    'Sem cobrança por operação. A revisão do meta app e a verificação comercial são necessárias.',

  'web.marketing.provider.facebook.accountTypes': 'Uma página do Facebook que você administra.',
  'web.marketing.provider.facebook.restriction':
    'O alvo de publicação é uma página. Automatizar um perfil pessoal não é oferecido pela API e Post Array não tenta fazê-lo.',
  'web.marketing.provider.facebook.cost':
    'Sem cobrança por operação. A revisão do meta app e a verificação comercial são necessárias.',

  'web.marketing.provider.youtube.accountTypes':
    'Um canal YouTube conectado através de sua conta do Google.',
  'web.marketing.provider.youtube.restriction':
    'Um projeto que não passou na auditoria de conformidade da API do Google pode fazer upload apenas como privado. Post Array não descreverá o upload público como disponível até que a auditoria seja aprovada e a tela de conexão indique em que estado seus uploads chegarão.',
  'web.marketing.provider.youtube.cost':
    'Sem cobrança por operação. Uma cota diária se aplica e não pode ser compartilhada entre projetos.',

  'web.marketing.provider.tiktok.accountTypes':
    'Uma conta TikTok com autorização de publicação direta.',
  'web.marketing.provider.tiktok.restriction':
    'Até que a auditoria da API de publicação de conteúdo seja aprovada, as publicações serão privadas e serão aplicados limites por conta. No momento da publicação Post Array busca as informações do criador atual, mostra as opções de privacidade disponíveis sem pré-selecionar nenhuma e solicita as configurações de comentário, dueto e ponto e a declaração de conteúdo comercial.',
  'web.marketing.provider.tiktok.cost':
    'Sem cobrança por operação. O modo não auditado aplica limites de publicação diários.',

  'web.marketing.provider.threads.accountTypes':
    'Um perfil Threads vinculado a uma conta profissional Instagram.',
  'web.marketing.provider.threads.restriction':
    'Publishing segue o contêiner Meta e a sequência de publicação. Os recursos estão sendo verificados em relação à coleção oficial antes que qualquer coisa aqui seja chamada de suportada.',
  'web.marketing.provider.threads.cost': 'Sem cobrança por operação.',

  'web.marketing.provider.bluesky.accountTypes':
    'Uma conta Bluesky em qualquer provedor de hospedagem.',
  'web.marketing.provider.bluesky.restriction':
    'Um protocolo aberto sem etapa de revisão do aplicativo. Limites de taxa e limites de tamanho de registro ainda se aplicam e são aplicados antes do envio.',
  'web.marketing.provider.bluesky.cost': 'Sem cobrança por operação.',
  'web.marketing.provider.mastodon.label': 'Mastodon',
  'web.marketing.provider.mastodon.accountTypes': 'Uma conta Mastodon em qualquer instância.',
  'web.marketing.provider.mastodon.restriction':
    'Um protocolo aberto, sem revisão de aplicativo. O limite de caracteres é definido por instância e os limites de frequência dela são respeitados.',
  'web.marketing.provider.mastodon.cost': 'Sem custo por operação.',
  'web.marketing.provider.telegram.label': 'Telegram',
  'web.marketing.provider.telegram.accountTypes':
    'Um bot do Telegram que você controla, publicando em um canal ou grupo.',
  'web.marketing.provider.telegram.restriction':
    'Um bot só publica onde foi adicionado. O token é uma credencial do aplicativo e o chat de destino é escolhido por conexão.',
  'web.marketing.provider.telegram.cost': 'Sem custo por operação.',
  'web.marketing.provider.reddit.label': 'Reddit',
  'web.marketing.provider.reddit.accountTypes': 'Uma conta Reddit autorizada a publicar.',
  'web.marketing.provider.reddit.restriction':
    'Escrever no Reddit exige um aplicativo aprovado. As publicações são de texto ou link em subreddits permitidos; não há comentários ou votos automáticos.',
  'web.marketing.provider.reddit.cost': 'Sem custo por operação.',
  'web.marketing.provider.wordpress.label': 'WordPress',
  'web.marketing.provider.wordpress.accountTypes': 'Um site WordPress com senha de aplicativo.',
  'web.marketing.provider.wordpress.restriction':
    'As publicações saem pela API REST do site como o usuário conectado. Upload de imagens e vídeos ainda não foi construído.',
  'web.marketing.provider.wordpress.cost': 'Sem custo por operação.',
  'web.marketing.provider.medium.label': 'Medium',
  'web.marketing.provider.medium.accountTypes': 'Um perfil de autor Medium conectado via OAuth.',
  'web.marketing.provider.medium.restriction':
    'As publicações saem como histórias públicas em Markdown. A API de integração não tem exclusão, então ela não é oferecida.',
  'web.marketing.provider.medium.cost': 'Sem custo por operação.',
  'web.marketing.provider.devto.label': 'Dev.to',
  'web.marketing.provider.devto.accountTypes': 'Um perfil Dev.to conectado com sua chave de API.',
  'web.marketing.provider.devto.restriction':
    'Os artigos saem como publicações Markdown públicas. Upload de imagens e análises ainda não foram construídos.',
  'web.marketing.provider.devto.cost': 'Sem custo por operação.',
  'web.marketing.provider.pinterest.label': 'Pinterest',
  'web.marketing.provider.pinterest.accountTypes':
    'Uma conta empresarial Pinterest conectada via OAuth.',
  'web.marketing.provider.pinterest.restriction':
    'Um pin exige uma imagem e um quadro seu. Escrever exige revisão do aplicativo e os quadros são lidos na conexão.',
  'web.marketing.provider.pinterest.cost': 'Sem custo por operação.',
  'web.marketing.provider.discord.label': 'Discord',
  'web.marketing.provider.discord.accountTypes':
    'Um bot do Discord que você controla, publicando em canais de texto.',
  'web.marketing.provider.discord.restriction':
    'O bot só publica nos canais que enxerga. Mensagens de texto são suportadas; arquivos ainda não.',
  'web.marketing.provider.discord.cost': 'Sem custo por operação.',
  'web.marketing.provider.slack.label': 'Slack',
  'web.marketing.provider.slack.accountTypes': 'Um espaço do Slack conectado via app OAuth.',
  'web.marketing.provider.slack.restriction':
    'As mensagens saem para canais públicos e privados onde o app está. Upload de arquivos e análises ainda não foram construídos.',
  'web.marketing.provider.slack.cost': 'Sem custo por operação.',

  /* ---------------------------------------------------------------------- */
  /* Capability matrix notes                                                 */
  /* ---------------------------------------------------------------------- */

  'web.capabilities.short.supported': 'Suportado',
  'web.capabilities.short.unsupported': 'Plataforma não oferece isso',
  'web.capabilities.short.not_implemented': 'Ainda não construído',
  'web.capabilities.short.requires_review': 'Precisa de revisão da plataforma',
  'web.capabilities.notesTitle': 'Notas e fontes',
  'web.capabilities.noteRef': 'Nota {number}',
  'web.capabilities.summary':
    '{supported, plural, one {# capacidade suportada} other {# capacidades suportadas} many {# capacidades suportadas}}, {requiresReview, plural, one {# aguardando uma revisão da plataforma} other {# aguardando uma revisão da plataforma} many {# aguardando uma plataforma revisão}}, {notImplemented, plural, one {# ainda não construído} other {# ainda não construído} many {# ainda não construído}}, {unsupported, plural, one {# a plataforma não oferece} other {# a plataforma não oferece} many {# a plataforma oferece não oferecer}}.',
  'web.capabilities.buildState.title':
    'Nenhum conector está transportando tráfego de cliente ainda',
  'web.capabilities.buildState.body':
    'Post Array está em construção. Esta tabela reflete as definições do conector tal como estão hoje, e é por isso que a maioria das células é lida como ainda não construída. Uma célula só se torna suportada depois que o conector passa na definição de concluído, incluindo testes de contrato em relação aos acessórios da plataforma registrados. As células que dizem que uma plataforma não oferece algo, ou que a impede de uma revisão, são fatos sobre a plataforma e já são definitivas.',
  'web.capabilities.note.instagramProfessional':
    'Somente contas profissionais. Uma conta de consumidor não pode ser publicada por nenhum aplicativo.',
  'web.capabilities.note.facebookPagesOnly':
    'Somente páginas. A API não publica em um perfil pessoal.',
  'web.capabilities.note.youtubeAudit':
    'Até que a auditoria de conformidade da API do Google seja aprovada, os uploads serão considerados privados.',
  'web.capabilities.note.tiktokAudit':
    'Até que a auditoria da API de publicação de conteúdo seja aprovada, as publicações serão privadas e limitadas.',
  'web.capabilities.note.tiktokPrivacy':
    'A opção de privacidade é obtida no momento da publicação e deve ser escolhida por uma pessoa.',
  'web.capabilities.note.linkedinMemberAnalytics':
    'A análise de publicações de membros precisa de permissão de leitura LinkedIn fechou para novos aplicativos.',
  'web.capabilities.note.linkedinOrgAccess':
    'Requer um produto de gerenciamento de comunidade aprovado e uma empresa verificada.',
  'web.capabilities.note.linkedinDocuments':
    'LinkedIn é a única plataforma conectada com um tipo de publicação de documento.',
  'web.capabilities.note.metaReview': 'Requer revisão do aplicativo Meta e verificação comercial.',
  'web.capabilities.note.xConsent':
    'Requer consentimento registrado do titular da conta para publicação automatizada.',
  'web.capabilities.note.xDisclosure':
    'A plataforma fornece um campo feito com IA, que Post Array define a partir de sua declaração.',
  'web.capabilities.note.noDestinations':
    'Esta plataforma não tem conceito de destino como página, quadro ou comunidade.',
  'web.capabilities.note.noThreads': 'Esta plataforma não possui sequência multipost nativa.',
  'web.capabilities.note.noDocuments':
    'Esta plataforma não possui tipo de publicação de documento.',
  'web.capabilities.note.videoOnly': 'Esta plataforma aceita apenas uploads de vídeos.',
  'web.capabilities.note.noAltText':
    'Esta plataforma não aceita texto alternativo através de sua API de publicação.',
  'web.capabilities.note.noPrivacyChoice':
    'Esta plataforma não oferece opção de privacidade por publicação por meio de sua API.',
  'web.capabilities.note.noThumbnail':
    'Esta plataforma não aceita miniaturas personalizadas através de sua API.',
  'web.capabilities.note.inBuild': 'A plataforma oferece isso. Post Array ainda não foi enviado.',
  'web.capabilities.note.noCarousel': 'A plataforma não oferece carrossel deslizável.',
  'web.capabilities.note.noDisclosure':
    'A plataforma não tem campo de divulgação para conteúdo de IA ou comercial.',
  'web.capabilities.note.noAnalytics':
    'A plataforma não expõe métricas de engajamento pela API oficial.',
  'web.capabilities.note.redditReview':
    'Escrever no Reddit exige um aplicativo aprovado da API de dados.',
  'web.capabilities.note.redditMedia':
    'Publicações com imagem e vídeo ainda não foram construídas para o Reddit.',
  'web.capabilities.note.mediumImages': 'A API de integração não aceita anexos de imagem.',
  'web.capabilities.note.mediumNoDelete': 'A API de integração não tem endpoint de exclusão.',
  'web.capabilities.note.devtoImages':
    'A API aceita apenas corpos de artigo; upload de imagens ainda não foi construído.',
  'web.capabilities.note.pinterestNeedsImage':
    'Um pin exige uma imagem; pins só de texto não existem.',
  'web.capabilities.note.pinterestReview':
    'Escrever no Pinterest exige acesso de aplicativo aprovado.',

  /* ---------------------------------------------------------------------- */
  /* Status page surfaces                                                    */
  /* ---------------------------------------------------------------------- */

  'web.status.surface.web': 'Aplicativo Web',
  'web.status.surface.api': 'API REST',
  'web.status.surface.mcp': 'servidor MCP',
  'web.status.surface.cli': 'CLI',
  'web.status.surface.webhooks': 'Entrega de Webhook',
  'web.status.surface.publishing': 'Trabalhadores da publicação',
  'web.status.surface.media': 'Processamento de mídia',
  'web.status.surface.analytics': 'Coleção analítica',
  'web.status.surface.links': 'Redirecionamentos de link curto',
  'web.status.surface.checkout': 'Checkout e cobrança',
  'web.status.preLaunch.title': 'Post Array ainda não está disponível em geral',
  'web.status.preLaunch.body':
    'Esta página está ativa antes do produto ser lançado, para que o hábito de relatórios exista desde o primeiro cliente, em vez de ser adicionado após a primeira interrupção. As superfícies ainda em construção são marcadas como tal em vez de serem mostradas como íntegras.',

  /* ---------------------------------------------------------------------- */
  /* Comparison targets                                                      */
  /* ---------------------------------------------------------------------- */

  'web.compare.product.postiz': 'Postiz',
  'web.compare.product.buffer': 'Buffer',
  'web.compare.product.hootsuite': 'Hootsuite',
  'web.compare.product.later': 'Mais tarde',
  'web.compare.product.metricool': 'Metricool',
  'web.compare.product.publer': 'Publer',
  'web.compare.product.socialbee': 'SocialBee',
  'web.compare.product.typefully': 'Tipo',
  'web.compare.product.publishingApis': 'APIs de publicação para desenvolvedores',
  'web.compare.state.factCheckPending': 'Verificação de fatos em andamento',

  /* ---------------------------------------------------------------------- */
  /* Tool radar categories                                                   */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.category.video': 'Geração e edição de vídeo',
  'web.toolRadar.category.image': 'Geração e edição de imagens',
  'web.toolRadar.category.audio': 'Áudio, voz e música',
  'web.toolRadar.category.ugc': 'Avatar e vídeo estilo criador',
  'web.toolRadar.category.clipping': 'Vídeo longo para clipes curtos',
  'web.toolRadar.category.design': 'Design e layout',
  'web.toolRadar.category.research': 'Pesquisa e coleta de fontes',
  'web.toolRadar.category.workflow': 'Automação de fluxo de trabalho',

  /* ---------------------------------------------------------------------- */
  /* Opportunity categories                                                  */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.category.launch': 'Diretórios de lançamento e inicialização de produtos',
  'web.opportunities.category.review': 'Diretórios de software e revisão',
  'web.opportunities.category.marketplace': 'Mercados de integração e automação',
  'web.opportunities.category.community':
    'Tópicos de demonstração da comunidade que permitem envios',
  'web.opportunities.category.partner': 'Ecossistemas de parceiros e diretórios de integração',
  'web.opportunities.category.editorial':
    'Tutoriais, podcasts e boletins informativos para convidados',
  'web.opportunities.category.openSource': 'Listas de código aberto e recursos de documentação',

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.footer.product': 'Produto',
  'web.footer.company': 'Empresa',
  'web.footer.resources': 'Recursos',
  'web.footer.legal': 'Jurídico',
  'web.footer.developers': 'Desenvolvedores',
  'web.footer.statement':
    'Post Array publica apenas por meio de APIs de plataforma oficial. A disponibilidade do conector depende das aprovações controladas pelas plataformas, e todas as reivindicações de capacidade neste site são datadas e fornecidas.',
  'web.footer.noAffiliation':
    'Os nomes e marcas das plataformas pertencem aos seus proprietários. Seu uso aqui identifica um conector e não implica endosso ou parceria.',
  'web.footer.copyright': 'Post Array {year}',
} as const;
