export const webUseCaseMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadados                                                              */
  /* ---------------------------------------------------------------------- */

  'web.meta.useCases.title': 'Casos de uso',
  'web.meta.useCases.description':
    'Três fluxos de trabalho para os quais este produto está sendo construído: gerenciar vários clientes em um só lugar, ter o trabalho aprovado antes de sair, e levar uma ideia a várias plataformas sem reescrevê-la.',
  'web.meta.useCase.clients.title': 'Gerenciando múltiplos clientes',
  'web.meta.useCase.clients.description':
    'Projetos separados, contas conectadas separadas, aprovações separadas e relatórios separados, para equipes que publicam em nome de outras pessoas.',
  'web.meta.useCase.approvals.title': 'Fluxos de aprovação',
  'web.meta.useCase.approvals.description':
    'Como um rascunho vira um post aprovado: quem revisa, o que invalida uma aprovação, e por que a mesma regra vale em toda superfície.',
  'web.meta.useCase.crossPlatform.title': 'Publicação entre plataformas',
  'web.meta.useCase.crossPlatform.description':
    'Um rascunho mestre, uma versão adaptada por plataforma, validada contra os limites registrados de cada plataforma antes de qualquer coisa ser agendada.',

  /* ---------------------------------------------------------------------- */
  /* Elementos compartilhados                                               */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': 'Casos de uso',
  'web.useCases.index.lede':
    'Três fluxos de trabalho para os quais este produto está sendo construído. Cada página diz o que o fluxo custa a uma equipe hoje, como o produto foi projetado para lidar com ele, e quais partes já estão construídas de fato.',
  'web.useCases.index.listLabel': 'Casos de uso',

  'web.useCases.notice.title': 'Isto descreve um design, não um serviço em funcionamento',
  'web.useCases.notice.body':
    'Nenhum conector está verificado em produção, então nada nesta página publica em lugar nenhum ainda. Onde uma parte do fluxo já está construída, a página diz isso. Onde não está, também diz.',

  'web.useCases.section.problem': 'O problema',
  'web.useCases.section.approach': 'Como o produto foi projetado',
  'web.useCases.section.today': 'O que já está construído de fato',
  'web.useCases.section.related': 'Relacionados',

  /* ---------------------------------------------------------------------- */
  /* Gerenciando múltiplos clientes                                         */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': 'Gerenciando múltiplos clientes',
  'web.useCases.clients.lede':
    'O trabalho de um cliente nunca deveria estar a um clique errado de distância da audiência de outro cliente.',
  'web.useCases.clients.problem':
    'A maioria das equipes separa clientes tomando cuidado. Uma conta compartilhada guarda toda página conectada, um calendário guarda toda programação, e a única coisa que separa um rascunho de um cliente da audiência errada é a pessoa olhando para a tela às 18h. Quando alguém sai da equipe, a separação vai junto com o hábito.',
  'web.useCases.clients.approach1':
    'Um projeto é a unidade de separação. Contas conectadas, rascunhos, filas, mídia e recibos pertencem a um projeto, e um membro só vê os projetos aos quais foi adicionado.',
  'web.useCases.clients.approach2':
    'A separação é reforçada três vezes: na autenticação, no serviço de aplicação que autoriza a ação, e no próprio banco de dados por meio de segurança em nível de linha. Estar autenticado nunca é tratado como permissão.',
  'web.useCases.clients.approach3':
    'Os relatórios seguem a mesma fronteira, então um relatório por cliente é o formato padrão em vez de uma planilha montada à mão por alguém.',
  'web.useCases.clients.today':
    'Projetos, associação restrita a projeto e as políticas de segurança em nível de linha por trás delas estão construídos e testados, incluindo testes que tentam leituras entre projetos e verificam que elas falham. Os planos são dimensionados por quantos projetos uma equipe precisa. Nada é publicado em nenhuma plataforma a partir de nenhum projeto ainda.',

  /* ---------------------------------------------------------------------- */
  /* Fluxos de aprovação                                                    */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': 'Fluxos de aprovação',
  'web.useCases.approvals.lede':
    'Uma aprovação só vale alguma coisa se a coisa aprovada for a coisa que sai.',
  'web.useCases.approvals.problem':
    'Aprovações geralmente vivem fora da ferramenta que publica. Uma captura de tela vai para um cliente, o cliente responde que sim, e então o texto muda. A aprovação agora se refere a um rascunho que ninguém tem, e a ferramenta não sabe disso, então publica o que foi entregue por último.',
  'web.useCases.approvals.approach1':
    'Uma aprovação é vinculada exatamente ao conteúdo que foi revisado. Editar um rascunho aprovado invalida a aprovação e diz qual campo mudou, em vez de simplesmente carregar a decisão antiga adiante.',
  'web.useCases.approvals.approach2':
    'Um revisor pode aprovar, pedir mudanças ou rejeitar, e um comentário é obrigatório para qualquer coisa além de aprovar, então o autor nunca fica sem saber o que corrigir.',
  'web.useCases.approvals.approach3':
    'A regra vive na camada de aplicação compartilhada, então o app web, a API REST, o servidor MCP, a CLI e os webhooks todos a seguem. Nenhuma superfície tem um atalho para contornar a revisão.',
  'web.useCases.approvals.today':
    'Os estados de aprovação, a superfície de revisão, as regras de reaprovação e os eventos de auditoria por trás deles estão construídos. O que não está construído é a última etapa, porque nenhum conector concluiu sua definição de pronto, então um post aprovado ainda não tem para onde ir.',

  /* ---------------------------------------------------------------------- */
  /* Publicação entre plataformas                                          */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': 'Publicação entre plataformas',
  'web.useCases.crossPlatform.lede':
    'Uma ideia, uma edição, e uma versão por plataforma que respeita o que aquela plataforma realmente aceita.',
  'web.useCases.crossPlatform.problem':
    'Publicar o mesmo texto em todo lugar produz uma versão que é cortada em uma plataforma, sem um título obrigatório em outra, e carregando um link que uma terceira remove silenciosamente. A alternativa, reescrever à mão cinco vezes, é para onde o trabalho realmente vai.',
  'web.useCases.crossPlatform.approach1':
    'Um rascunho mestre guarda a ideia. Cada conta selecionada ganha sua própria versão, e uma edição no mestre se aplica apenas onde cabe, dizendo claramente quais destinos não puderam recebê-la e por quê.',
  'web.useCases.crossPlatform.approach2':
    'A validação roda contra os limites registrados de cada plataforma, contados do jeito que aquela plataforma conta, então um teto de caracteres é verificado em grafemas onde a plataforma usa grafemas e em unidades ponderadas onde ela usa essas.',
  'web.useCases.crossPlatform.approach3':
    'Todo limite de plataforma mostrado em qualquer lugar deste site é gerado a partir do registro de conectores e traz o documento de onde veio e a data em que uma pessoa o leu.',
  'web.useCases.crossPlatform.today':
    'O compositor, as versões por destino, as regras de validação e o conjunto de dados de limites gerado estão construídos. A etapa de publicação não está: nenhum conector está verificado em produção, então um rascunho validado pode ser agendado internamente e não pode chegar a uma plataforma.',
} as const;
