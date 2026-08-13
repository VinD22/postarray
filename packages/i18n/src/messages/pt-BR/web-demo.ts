export const webDemoMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadados e navegação                                                  */
  /* ---------------------------------------------------------------------- */

  'web.meta.demo.title': 'Veja como funciona',
  'web.meta.demo.description':
    'Um tour guiado pelo fluxo de publicação, de um novo projeto até o recibo, mostrado na interface real com conteúdo de exemplo. Nada é publicado ainda, e o tour diz onde essa linha está.',

  'web.demo.nav.label': 'Veja funcionando',
  'web.demo.nav.summary':
    'Um tour guiado pelo produto na ordem em que você o encontra, construído a partir da interface real com conteúdo de exemplo.',

  /* ---------------------------------------------------------------------- */
  /* O quadro em que cada painel de demonstração fica                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': 'Demonstração',
  'web.demo.frame.sample':
    'Uma demonstração construída a partir da interface real, preenchida com conteúdo de exemplo de uma empresa que não existe. Não é uma conta real. Nada aqui envia nada.',

  'web.demo.control.pause': 'Pausar a demonstração',
  'web.demo.control.play': 'Reproduzir a demonstração',
  'web.demo.control.replay': 'Reproduzir de novo a demonstração',

  /* ---------------------------------------------------------------------- */
  /* A demonstração em destaque na página inicial                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.caption':
    'Um rascunho vira uma versão por plataforma, ganha um horário e chega na semana. Conteúdo de exemplo, não é uma conta real.',
  'web.demo.hero.more': 'Percorra todo o fluxo de trabalho',

  /* ---------------------------------------------------------------------- */
  /* A página do tour                                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': 'Como funciona, na ordem em que você encontra',
  'web.demo.lede':
    'Seis etapas, de um workspace vazio até o registro do que aconteceu. Cada uma mostra a superfície que você realmente estaria vendo, com conteúdo de exemplo nela.',
  'web.demo.notice.title': 'Isto é uma demonstração, não uma conta real',
  'web.demo.notice.body':
    'Todo painel aqui é a interface do produto com conteúdo de exemplo. Nenhum conector concluiu a verificação do provedor, então nada é publicado em nenhuma plataforma por meio deste produto hoje. Onde o fluxo de trabalho para, a página diz isso em vez de desenhar o resto.',
  'web.demo.contents.title': 'As seis etapas',
  'web.demo.stepLabel': 'Etapa {position} de {total}',
  'web.demo.closing.title': 'Esse é todo o ciclo',
  'web.demo.closing.body':
    'Nada acima é uma maquete de um produto que esperamos construir. É a interface como ela está, com a metade da publicação marcada honestamente como inacabada.',

  /* ---------------------------------------------------------------------- */
  /* As seis etapas                                                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': 'Criar um projeto',
  'web.demo.step.project.body':
    'Um projeto guarda contas, rascunhos, aprovações e um fuso horário. Toda consulta no produto é restrita a um deles, no serviço de aplicação e de novo no banco de dados, então um cliente não consegue ver outro cliente por acidente.',

  'web.demo.step.connect.title': 'Conectar uma conta',
  'web.demo.step.connect.body':
    'A conexão passa apenas pelas APIs oficiais da plataforma, e diz o que a plataforma exige da conta antes de você começar. Hoje todo conector para na verificação, e é por isso que cada linha abaixo diz isso em vez de mostrar um visto verde.',

  'web.demo.step.compose.title': 'Escreva uma vez, adapte por plataforma',
  'web.demo.step.compose.body':
    'Você escreve um rascunho mestre. Selecionar uma conta abre uma sobreposição apenas para aquela conta, com seus próprios limites e sua própria pré-visualização. Nada que você escrever para o LinkedIn muda o que o X recebe, e as verificações de cada versão rodam antes de qualquer coisa ser agendada.',

  'web.demo.step.schedule.title': 'Defina um horário, ou entregue à fila',
  'web.demo.step.schedule.body':
    'Um horário é armazenado como um instante mais o fuso horário do projeto, nunca como um horário local simples, então uma mudança de horário de verão não move nada por baixo de você. A fila é a outra rota: ela pega o próximo horário permitido pelas regras que você definiu.',

  'web.demo.step.calendar.title': 'Observe o calendário',
  'web.demo.step.calendar.body':
    'A semana mostra a plataforma, a conta, o estado e o horário de cada post. Mover um é tanto um botão quanto um arraste, então o calendário é totalmente usável pelo teclado.',

  'web.demo.step.receipt.title': 'Leia o recibo depois',
  'web.demo.step.receipt.body':
    'Toda tentativa gera um recibo imutável: quem escreveu, quem aprovou, sob qual política, em qual instante. A metade de publicação desse registro é escrita pela execução de publicação, que é a parte que ainda não existe.',

  /* ---------------------------------------------------------------------- */
  /* Rótulos dos painéis                                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': 'Projeto',
  'web.demo.project.zone': 'Fuso horário: {zone}',
  'web.demo.project.scope':
    'Rascunhos, contas, aprovações e recibos pertencem a este projeto e a nenhum outro lugar.',

  'web.demo.accounts.label': 'Contas neste projeto',
  'web.demo.accounts.state': 'Verificação não concluída',
  'web.demo.accounts.note':
    'Cada linha traria a saúde do token, as permissões concedidas e o último post enviado com sucesso. Nenhuma delas pode publicar hoje.',

  'web.demo.master.label': 'Rascunho mestre',
  'web.demo.master.project': 'No projeto {project}',

  'web.demo.variants.label': 'O que cada conta recebe',

  'web.demo.schedule.label': 'Agendado',
  'web.demo.schedule.value': '{when} em {zone}',
  'web.demo.schedule.approval': 'Uma aprovação é necessária antes que qualquer coisa possa ser enviada.',
  'web.demo.schedule.queue':
    'A fila é a outra rota: ela escolhe o próximo horário que suas regras permitem, neste fuso horário.',

  'web.demo.week.label': 'A semana',
  'web.demo.week.caption': 'Os mesmos três posts no calendário, lidos no fuso horário do projeto.',
  'web.demo.week.empty': 'Nada agendado',

  'web.demo.receipt.label': 'Recibo até agora',
  'web.demo.receipt.pending':
    'O que foi enviado, o que a plataforma respondeu, o ID externo do post e o link permanente são escritos pela execução de publicação. Ficam indisponíveis até que um conector conclua a verificação do provedor.',
  'web.demo.receipt.field.externalId': 'ID externo do post',
  'web.demo.receipt.field.permalink': 'Link permanente',

  /* ---------------------------------------------------------------------- */
  /* Conteúdo de exemplo                                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools (exemplo)',
  'web.demo.sample.actor': 'Ada, colega de exemplo',
  'web.demo.sample.approver': 'Ravi, revisor de exemplo',
  'web.demo.sample.policy': 'Uma aprovação antes de enviar',
  'web.demo.sample.master':
    'A Northbound 2.4 saiu hoje. As importações estão mais rápidas, a busca tem um atalho de teclado, e o bug de exportação que dois de vocês relataram foi corrigido.',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'A Northbound 2.4 saiu. Importações mais rápidas, busca por teclado, e aquele bug de exportação foi corrigido.',
  'web.demo.sample.x.check': 'Contagem de caracteres e ordem da thread',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    'A Northbound 2.4 saiu hoje. A nota de versão explica em detalhes as mudanças de importação e a correção de exportação.',
  'web.demo.sample.linkedin.check': 'Papel na organização e tamanho do post',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    'A mesma foto do lançamento, com uma legenda escrita para o feed e texto alternativo escrito por uma pessoa.',
  'web.demo.sample.instagram.check': 'Tipo de conta, proporção e texto alternativo',

  /* ---------------------------------------------------------------------- */
  /* O tour de nove cenas                                                   */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': 'Etapas do tour',
  'web.demo.tour.jump': 'Mostrar etapa {position}: {step}',
  'web.demo.tour.step.project': 'Criar um projeto',
  'web.demo.tour.step.connect': 'Conectar contas',
  'web.demo.tour.step.compose': 'Compor uma vez',
  'web.demo.tour.step.variants': 'Adaptar por plataforma',
  'web.demo.tour.step.validate': 'Verificar',
  'web.demo.tour.step.schedule': 'Definir um horário',
  'web.demo.tour.step.week': 'Ver a semana',
  'web.demo.tour.step.publish': 'Publicar e registrar',
  'web.demo.tour.step.digest': 'Ler o resumo',

  /* ---------------------------------------------------------------------- */
  /* Verificações (etapa 5)                                                 */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': 'Verificações antes de agendar',
  'web.demo.validate.check.length': 'Limite de caracteres, por conta',
  'web.demo.validate.check.lengthDetail':
    'Cada versão é medida contra o limite que a plataforma dá para aquela conta.',
  'web.demo.validate.check.altText': 'Texto alternativo em toda imagem',
  'web.demo.validate.check.altTextDetail':
    'Uma imagem sem uma descrição, ou sem ser marcada como decorativa, impede o agendamento.',
  'web.demo.validate.check.firstComment': 'Primeiro comentário permitido aqui',
  'web.demo.validate.check.firstCommentDetail':
    'Um primeiro comentário só é oferecido em contas cuja plataforma o suporta.',
  'web.demo.validate.note':
    'Isto roda no compositor antes de qualquer coisa ser agendada, e de novo antes de qualquer coisa ser enviada.',

  /* ---------------------------------------------------------------------- */
  /* Publicação e recibo (etapa 8)                                         */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': 'Publicação e o registro dela',
  'web.demo.live.step.approved': 'Aprovado por {approver}',
  'web.demo.live.step.queued': 'Na fila para o seu horário',
  'web.demo.live.step.sent': 'Enviado para a plataforma',
  'web.demo.live.step.confirmed': 'Confirmado pela plataforma',
  'web.demo.live.badge.pending': 'Não publicado',
  'web.demo.live.badge.live': 'Ao vivo',
  'web.demo.live.pending':
    'As duas últimas etapas são escritas pela execução de publicação. Nenhum conector concluiu a verificação do provedor ainda, então elas ficam pendentes e o ID externo do post e o link permanente ficam indisponíveis.',

  /* ---------------------------------------------------------------------- */
  /* O resumo semanal (etapa 9)                                            */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': 'Sua semana, em frases',
  'web.demo.digest.sample': 'Exemplo',
  'web.demo.digest.line.variants':
    'Três versões nativas de plataforma saíram de um rascunho esta semana.',
  'web.demo.digest.line.earliest': 'A manhã de terça-feira foi seu horário mais cedo.',
  'web.demo.digest.line.approval': 'Toda versão foi aprovada antes de entrar na fila.',
  'web.demo.digest.line.alt': 'Toda imagem tinha texto alternativo escrito por uma pessoa.',
  'web.demo.digest.footer': 'Análises ao vivo aparecem aqui conforme seus posts são publicados.',

  /* ---------------------------------------------------------------------- */
  /* As três etapas adicionadas ao tour                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': 'Verifique antes de agendar',
  'web.demo.step.validate.body':
    'O compositor mede cada versão contra a conta para a qual foi escrita: o limite de caracteres que aquela conta realmente tem, texto alternativo em toda imagem, e se a plataforma oferece um primeiro comentário. Uma versão que falha em uma verificação não pode ser agendada.',

  'web.demo.step.publish.title': 'Publique e mantenha o registro',
  'web.demo.step.publish.body':
    'Uma execução de publicação envia cada versão no seu instante, registra o que a plataforma respondeu, e escreve um recibo imutável. Essa execução é a parte que ainda não existe, então as duas últimas etapas abaixo ficam pendentes em vez de desenhadas como concluídas.',

  'web.demo.step.digest.title': 'Leia o resumo semanal',
  'web.demo.step.digest.body':
    'O resumo descreve o que o produto fez em frases: quantas versões saíram de um rascunho, qual horário foi o mais cedo, o que foi aprovado. Não traz nenhum número de engajamento, porque as análises vêm das plataformas depois que um post é publicado, e nada é publicado ainda.',
} as const;
