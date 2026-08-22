export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadados                                                              */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'Agendamento, plataforma por plataforma',
  'web.meta.schedule.description':
    'O que cada plataforma do grupo de lançamento exige de uma conta conectada, os limites que sua API oficial aplica, e até onde este produto chegou em relação a eles.',
  'web.meta.schedulePlatform.title': 'Agendamento para {platform}',
  'web.meta.schedulePlatform.description':
    'O que {platform} exige de uma conta conectada, os limites que sua API oficial aplica, e quais partes disso este produto já construiu.',

  /* ---------------------------------------------------------------------- */
  /* Índice                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Agendamento, plataforma por plataforma',
  'web.schedule.index.lede':
    'Uma página por plataforma no grupo de lançamento. Cada uma afirma o que a plataforma pede de uma conta conectada, os limites que sua API oficial aplica, e onde a construção está. Todo número traz o documento de onde veio e a data em que uma pessoa o leu.',
  'web.schedule.index.listLabel': 'Plataformas no grupo de lançamento',
  'web.schedule.index.cohortNote':
    'O grupo é o conjunto de plataformas para o qual este produto está sendo construído. É um plano, não uma lista de disponibilidade.',
  'web.schedule.index.limitsKnown': 'Limites registrados',
  'web.schedule.index.limitsUnknown': 'Limites ainda não registrados',

  /* ---------------------------------------------------------------------- */
  /* Página da plataforma                                                   */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Agendamento para {platform}',
  'web.schedule.platform.lede':
    'O que {platform} pede de uma conta conectada, os limites que sua API oficial aplica, e contra quais deles este produto já construiu até agora.',

  'web.schedule.notice.title': 'Nada é publicado no {platform} ainda',
  'web.schedule.notice.body':
    'Nenhum conector concluiu sua definição de pronto, e nenhum está verificado em produção. Esta página descreve o que a plataforma exige e o que este produto pretende suportar. Não descreve um agendador funcionando.',

  'web.schedule.requirements.title': 'O que {platform} exige',
  'web.schedule.requirements.accountTypes': 'Tipo de conta',
  'web.schedule.requirements.restriction': 'Restrição da plataforma',
  'web.schedule.requirements.cost': 'Custo da API',
  'web.schedule.requirements.unavailable.title': 'Ainda não há registro revisado do conector',
  'web.schedule.requirements.unavailable.body':
    'Esta plataforma entrou no grupo depois da última rodada de pesquisa de conectores, então não há um registro datado dos requisitos da conta para mostrar. Vai aparecer aqui assim que uma pessoa ler a documentação oficial e registrá-la.',
  'web.schedule.requirements.apiSource': 'Documentação oficial da API',
  'web.schedule.requirements.policySource': 'Política da plataforma',

  /* ---------------------------------------------------------------------- */
  /* Limites                                                                */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Limites que {platform} aplica',
  'web.schedule.limits.lede':
    'Lidos para uma conta recém-conectada sem elegibilidade elevada. Uma plataforma pode aumentar ou diminuir qualquer um destes sem avisar ninguém, e é por isso que cada conjunto traz a data em que foi lido.',
  'web.schedule.limits.unavailable.title': 'Limites não registrados para {platform}',
  'web.schedule.limits.unavailable.body':
    'Esta versão não inclui adaptador para esta plataforma, então não há um teto registrado para mostrar. Um número inventado seria pior que nenhum.',
  'web.schedule.limits.sourceLabel': 'Documentação oficial da plataforma',

  'web.schedule.limits.text': 'Texto do corpo',
  'web.schedule.limits.title_field': 'Campo de título',
  'web.schedule.limits.countingUnit': 'Como os caracteres são contados',
  'web.schedule.limits.links': 'Como os links são contados',
  'web.schedule.limits.images': 'Imagens por post',
  'web.schedule.limits.videos': 'Vídeos por post',
  'web.schedule.limits.videoDuration': 'Duração do vídeo',
  'web.schedule.limits.imageBytes': 'Maior imagem',
  'web.schedule.limits.gifBytes': 'Maior imagem animada',
  'web.schedule.limits.videoBytes': 'Maior vídeo',
  'web.schedule.limits.documentBytes': 'Maior documento',
  'web.schedule.limits.altText': 'Texto alternativo',
  'web.schedule.limits.mimeTypes': 'Tipos de arquivo aceitos',
  'web.schedule.limits.markdown': 'Marcas de formatação',

  'web.schedule.value.characters':
    '{count, plural, one {# caractere} many {# caracteres} other {# caracteres}}',
  'web.schedule.value.files': '{count, plural, =0 {Nenhum} one {# arquivo} other {# arquivos}}',
  'web.schedule.value.durationRange': 'Entre {min} e {max}',
  'web.schedule.value.durationMax': 'Até {max}',
  'web.schedule.value.markdownYes': 'Aceito',
  'web.schedule.value.markdownNo': 'Publicado como caracteres simples',

  'web.schedule.unit.utf16':
    'Por unidade de código UTF-16, que é o que a maioria dos editores relata como contagem de caracteres.',
  'web.schedule.unit.grapheme':
    'Por grafema, então um emoji feito de vários pontos de código ainda custa um caractere.',
  'web.schedule.unit.weighted':
    'Por um esquema ponderado em que a maioria dos caracteres não latinos custa dois em vez de um.',

  'web.schedule.link.none': 'Links não são contados contra o teto.',
  'web.schedule.link.actual': 'Um link custa exatamente os caracteres que ocupa.',
  'web.schedule.link.fixed':
    'Todo link é reescrito para o encurtador da plataforma e custa {count, plural, one {# caractere} many {# caracteres} other {# caracteres}} independente do seu tamanho real.',

  /* ---------------------------------------------------------------------- */
  /* Estado das capacidades                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'O que está construído para {platform}',
  'web.schedule.capabilities.lede':
    'Gerado a partir do registro de conectores, não escrito aqui. "Não oferecido pela plataforma" é um fato sobre a plataforma e é definitivo. "Ainda não construído" é um fato sobre este produto e é o padrão honesto enquanto nenhum conector concluiu sua definição de pronto.',
  'web.schedule.capabilities.unavailable.title':
    'Ainda não há registro de capacidade para {platform}',
  'web.schedule.capabilities.unavailable.body':
    'Não há adaptador nesta versão, então o registro não tem nada a reportar. A linha vai aparecer na matriz de capacidades assim que houver algo real a dizer.',
  'web.schedule.capabilities.matrixLink': 'Ler a matriz de capacidades completa',

  'web.schedule.next.title': 'Para onde ir agora',
  'web.schedule.next.body':
    'A matriz de capacidades traz toda plataforma e toda capacidade em uma única tabela. As páginas de casos de uso descrevem os fluxos de trabalho para os quais este produto está sendo construído.',
} as const;
