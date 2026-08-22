export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadados                                                              */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': 'Ferramentas de publicação gratuitas',
  'web.meta.tools.description':
    'Pequenas ferramentas privadas para quem publica em várias plataformas: uma verificação de limite por plataforma, um construtor de UTM, uma verificação de tamanho de título do YouTube e um planejador de fuso horário.',
  'web.meta.tools.preflight.title': 'Verificador de post antes de publicar',
  'web.meta.tools.preflight.description':
    'Verifique um rascunho contra os limites de texto e mídia publicados de dez plataformas, com a fonte e a data em que cada limite foi lido.',
  'web.meta.tools.utm.title': 'Construtor de link UTM',
  'web.meta.tools.utm.description':
    'Componha uma URL de campanha marcada e veja o que cada parâmetro UTM significa. Roda inteiramente no seu navegador.',
  'web.meta.tools.youtubeTitle.title': 'Verificador de tamanho de título do YouTube',
  'web.meta.tools.youtubeTitle.description':
    'Meça um título do YouTube contra o teto documentado, contado do jeito que uma pessoa conta caracteres.',
  'web.meta.tools.timeZone.title': 'Planejador de fuso horário e horário de verão',
  'web.meta.tools.timeZone.description':
    'Veja um horário de publicação em vários fusos de audiência e encontre as semanas em que uma mudança de horário de verão desloca a hora local.',
  'web.meta.tools.engagementRate.title': 'Calculadora de taxa de engajamento',
  'web.meta.tools.engagementRate.description':
    'Divida interações por alcance, seguidores ou impressões. Três cálculos simples, sem referência inventada.',

  /* ---------------------------------------------------------------------- */
  /* Elementos compartilhados entre ferramentas                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'Ferramentas gratuitas',
  'web.tools.index.summary':
    'Pequenas calculadoras construídas sobre os mesmos dados de limite de plataforma que nossos conectores leem.',
  'web.tools.index.lede':
    'Quatro pequenas ferramentas, construídas sobre os mesmos dados de limite de plataforma que nossos conectores usam. Sem conta, sem envio de arquivo, sem rastreamento do que você digita.',
  'web.tools.index.dataTitle': 'De onde vêm os números',
  'web.tools.index.dataBody':
    'Cada limite é gerado a partir do código de capacidade de conectores neste repositório, e cada linha de plataforma traz a página de documentação oficial de onde veio e a data em que uma pessoa leu aquela página.',
  'web.tools.index.honesty':
    'Estas ferramentas não publicam nada. Nenhum conector concluiu a verificação do provedor ainda, então nada aqui conecta uma conta.',
  'web.tools.shared.privacyTitle': 'Isto roda no seu navegador',
  'web.tools.shared.privacyBody':
    'Tudo o que você digita fica nesta página. Não há requisição a um servidor, nenhum armazenamento e nenhum evento de análise carregando seu texto.',
  'web.tools.shared.sourceLink': 'Documentação da plataforma',
  'web.tools.shared.sourceRead': 'Lido em {date}',
  'web.tools.shared.unavailable': 'indisponível',
  'web.tools.shared.unavailableWhy':
    'Ainda não temos um conector para esta plataforma, então não temos um limite verificado para mostrar. Preferimos não dizer nada a adivinhar.',
  'web.tools.shared.copy': 'Copiar',
  'web.tools.shared.copied': 'Copiado',
  'web.tools.shared.copyFailed': 'Seu navegador bloqueou a cópia. Selecione o texto e copie-o.',
  'web.tools.shared.faqTitle': 'Perguntas',
  'web.tools.shared.baselineTitle': 'Qual conta estes números descrevem',
  'web.tools.shared.baselineBody':
    'O caso conservador: uma conta recém-conectada sem elegibilidade elevada. Algumas plataformas levantam um teto assim que um canal ou um negócio é verificado, e onde isso acontece a página diz.',
  'web.tools.shared.otherTools': 'Outras ferramentas',

  /* ---------------------------------------------------------------------- */
  /* Nomes das ferramentas e resumos de uma linha                          */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'Verificador de post antes de publicar',
  'web.tools.preflight.summary':
    'Um rascunho, verificado contra os limites de texto e mídia de dez plataformas de uma vez.',
  'web.tools.utm.name': 'Construtor de link UTM',
  'web.tools.utm.summary':
    'Monte uma URL de campanha marcada sem estragar a query string que ela já tinha.',
  'web.tools.youtubeTitle.name': 'Verificador de tamanho de título do YouTube',
  'web.tools.youtubeTitle.summary': 'Meça um título do jeito que uma pessoa conta caracteres.',
  'web.tools.timeZone.name': 'Planejador de fuso horário e horário de verão',
  'web.tools.timeZone.summary':
    'Um horário de publicação em vários fusos de audiência, com as mudanças de horário de verão marcadas.',
  'web.tools.engagementRate.name': 'Calculadora de taxa de engajamento',
  'web.tools.engagementRate.summary':
    'Interações divididas por alcance, seguidores ou impressões. Nada é consultado, nada é usado como referência.',

  /* ---------------------------------------------------------------------- */
  /* Verificador de post antes de publicar                                 */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'Verificador de post antes de publicar',
  'web.tools.preflight.lede':
    'Cole um rascunho, escolha as plataformas em que você publica, e veja quais rejeitariam antes de você descobrir por um erro da API.',
  'web.tools.preflight.explainer.title': 'Por que um contador de caracteres não basta',
  'web.tools.preflight.explainer.body':
    'As plataformas discordam sobre o que é um caractere. Algumas contam unidades de código, então um emoji custa dois. Algumas contam grafemas, então uma bandeira ou um emoji de família custa um. Algumas reescrevem todo link para uma largura fixa, então uma URL de 200 caracteres custa o mesmo que uma de 20. Esta ferramenta aplica a regra de cada plataforma separadamente.',
  'web.tools.preflight.explainer.counting':
    'O rascunho é medido com o segmentador Intl do navegador, que divide o texto nas unidades que um leitor chamaria de caracteres, depois ajustado para a regra da plataforma.',
  'web.tools.preflight.field.draft.label': 'Seu rascunho',
  'web.tools.preflight.field.draft.help':
    'Cole o corpo do post. Links são detectados automaticamente para que seu custo possa ser aplicado por plataforma.',
  'web.tools.preflight.field.platforms.label': 'Plataformas a verificar',
  'web.tools.preflight.field.platforms.help': 'Escolha quantas você publicar.',
  'web.tools.preflight.field.mediaKind.label': 'Mídia anexada',
  'web.tools.preflight.field.mediaKind.none': 'Sem mídia',
  'web.tools.preflight.field.mediaKind.image': 'Imagens',
  'web.tools.preflight.field.mediaKind.video': 'Um vídeo',
  'web.tools.preflight.field.mediaCount.label': 'Quantas imagens',
  'web.tools.preflight.field.byteSize.label': 'Tamanho do arquivo em megabytes',
  'web.tools.preflight.field.byteSize.help': 'O maior arquivo único. Deixe vazio para pular.',
  'web.tools.preflight.field.duration.label': 'Duração do vídeo em segundos',
  'web.tools.preflight.field.duration.help': 'Deixe vazio para pular a verificação de duração.',
  'web.tools.preflight.field.width.label': 'Largura da mídia em pixels',
  'web.tools.preflight.field.height.label': 'Altura da mídia em pixels',
  'web.tools.preflight.field.dimensions.help':
    'Opcional. Usado apenas para mostrar a proporção que você estaria publicando.',
  'web.tools.preflight.results.title': 'Resultado por plataforma',
  'web.tools.preflight.results.empty': 'Escolha ao menos uma plataforma para ver um resultado.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Nada bloqueando} other {# falhariam}}, {warning, plural, =0 {nenhum aviso} other {# para verificar}}.',
  'web.tools.preflight.status.pass': 'Cabe',
  'web.tools.preflight.status.warning': 'Vale a pena verificar',
  'web.tools.preflight.status.fail': 'Falharia',
  'web.tools.preflight.status.unavailable': 'Indisponível',
  'web.tools.preflight.count.label':
    '{count} de {limit} {unit, select, grapheme {caracteres} utf16 {unidades de código} weighted {caracteres ponderados} other {caracteres}}',
  'web.tools.preflight.finding.textOver':
    'Acima do limite em {over, plural, one {# caractere} many {# caracteres} other {# caracteres}}.',
  'web.tools.preflight.finding.textNear': 'A {remaining} caracteres do limite.',
  'web.tools.preflight.finding.textFits': 'O corpo cabe.',
  'web.tools.preflight.finding.linkFixed':
    'Todo link é reescrito para uma largura fixa, então cada um custa {cost} caracteres independente do seu tamanho real.',
  'web.tools.preflight.finding.linkActual': 'Links contam pelos caracteres que ocupam.',
  'web.tools.preflight.finding.imagesOver':
    'Esta plataforma aceita {limit, plural, =0 {nenhuma imagem} one {# imagem} other {# imagens}} em um post.',
  'web.tools.preflight.finding.videosOver':
    'Esta plataforma aceita {limit, plural, =0 {nenhum vídeo} one {# vídeo} other {# vídeos}} em um post.',
  'web.tools.preflight.finding.bytesOver': 'O arquivo é maior que o teto de {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    'Nenhum teto de bytes publicado para este tipo de mídia, então o tamanho não foi verificado.',
  'web.tools.preflight.finding.durationOver': 'Mais longo que o teto de {limit} segundos.',
  'web.tools.preflight.finding.durationUnder': 'Mais curto que o mínimo de {limit} segundos.',
  'web.tools.preflight.finding.durationUnknown':
    'Nenhum teto de duração publicado, então o tamanho não foi verificado.',
  'web.tools.preflight.finding.altText':
    'Texto alternativo é aceito até {limit} caracteres, o que vale a pena usar.',
  'web.tools.preflight.finding.ratio': 'Você estaria publicando em cerca de {ratio} para 1.',
  'web.tools.preflight.faq.counting.q': 'Como vocês contam caracteres?',
  'web.tools.preflight.faq.counting.a':
    'Por grafema, usando o segmentador Intl do navegador, que é a unidade que um leitor entende por caractere. Onde uma plataforma documenta uma regra diferente, como contar unidades de código ou cobrar uma largura fixa por link, essa regra é aplicada por cima.',
  'web.tools.preflight.faq.accuracy.q': 'Quão atuais são estes limites?',
  'web.tools.preflight.faq.accuracy.a':
    'Cada limite é gerado a partir do código de conectores no nosso repositório em vez de digitado em uma página, e cada linha de plataforma mostra o documento oficial de onde veio e a data em que uma pessoa o leu. Se uma plataforma muda um número, a correção é uma mudança de código e toda ferramenta aqui a segue.',
  'web.tools.preflight.faq.privacy.q': 'Meu rascunho é enviado a algum lugar?',
  'web.tools.preflight.faq.privacy.a':
    'Não. A verificação roda no seu navegador. Não há requisição carregando seu texto, nada é armazenado, e fechar a aba já é suficiente para descartá-lo.',
  'web.tools.preflight.faq.publish.q': 'Esta ferramenta pode publicar por mim?',
  'web.tools.preflight.faq.publish.a':
    'Ainda não. Nenhum conector concluiu a verificação do provedor, então nada neste site publica em uma plataforma ainda. Esta página é uma verificação de limite, não um compositor.',

  /* ---------------------------------------------------------------------- */
  /* Construtor de UTM                                                     */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'Construtor de link UTM',
  'web.tools.utm.lede':
    'Adicione parâmetros de campanha a uma URL sem perder a query string que ela já tinha, e sem adivinhar o que cada parâmetro significa.',
  'web.tools.utm.explainer.title': 'Para que serve cada parâmetro',
  'web.tools.utm.explainer.body':
    'Os parâmetros UTM são lidos por ferramentas de análise, não pela plataforma em que você publica. Eles viajam na URL, então qualquer um que veja o link os vê. Mantenha-os curtos, em minúsculas e consistentes, porque duas grafias da mesma campanha viram duas linhas em um relatório.',
  'web.tools.utm.field.url.label': 'URL de destino',
  'web.tools.utm.field.url.help':
    'A página onde você quer que as pessoas cheguem, incluindo https.',
  'web.tools.utm.field.url.invalid': 'Isso não é interpretado como uma URL http ou https.',
  'web.tools.utm.field.source.label': 'Origem da campanha',
  'web.tools.utm.field.source.help': 'De onde veio o clique. Por exemplo o nome de uma plataforma.',
  'web.tools.utm.field.medium.label': 'Meio da campanha',
  'web.tools.utm.field.medium.help': 'O tipo de link. Por exemplo social, email ou indicação.',
  'web.tools.utm.field.campaign.label': 'Nome da campanha',
  'web.tools.utm.field.campaign.help': 'O lançamento, promoção ou tema ao qual este link pertence.',
  'web.tools.utm.field.term.label': 'Termo da campanha',
  'web.tools.utm.field.term.help': 'Opcional. Tradicionalmente a palavra-chave paga.',
  'web.tools.utm.field.content.label': 'Conteúdo da campanha',
  'web.tools.utm.field.content.help':
    'Opcional. Separa dois links para a mesma página, por exemplo duas versões de um post.',
  'web.tools.utm.result.title': 'Sua URL marcada',
  'web.tools.utm.result.empty': 'Digite uma URL de destino para ver o resultado.',
  'web.tools.utm.result.label': 'URL composta',
  'web.tools.utm.result.preserved':
    'A query string que já estava na sua URL é mantida exatamente como você a digitou.',
  'web.tools.utm.result.replaced':
    'Sua URL já trazia um destes parâmetros. O valor que você digitou aqui o substitui.',
  'web.tools.utm.faq.encoding.q': 'O que acontece com espaços e acentos?',
  'web.tools.utm.faq.encoding.a':
    'Eles são codificados em percentual, o que faz um link sobreviver a ser colado em um post. Um espaço vira um sinal de mais e uma letra acentuada vira sua forma codificada, e ferramentas de análise decodificam ambos de volta.',
  'web.tools.utm.faq.existing.q': 'Isso vai quebrar uma URL que já tem parâmetros?',
  'web.tools.utm.faq.existing.a':
    'Não. Os parâmetros existentes são preservados na ordem original, e apenas um parâmetro UTM que você preencheu é adicionado ou substituído. Um fragmento no fim da URL fica no fim.',
  'web.tools.utm.faq.privacy.q': 'Minha URL é enviada para algum lugar?',
  'web.tools.utm.faq.privacy.a': 'Não. A URL é composta no seu navegador e nunca sai desta página.',

  /* ---------------------------------------------------------------------- */
  /* Verificador de tamanho de título do YouTube                           */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'Verificador de tamanho de título do YouTube',
  'web.tools.youtubeTitle.lede':
    'Um título com um caractere a mais é rejeitado no envio. Um título apenas longo é cortado em algum lugar que você não escolheu.',
  'web.tools.youtubeTitle.explainer.title': 'Dois limites diferentes',
  'web.tools.youtubeTitle.explainer.body':
    'O teto rígido é o que o endpoint de envio aceita. Onde um título é mostrado é uma questão separada: um resultado de busca, uma barra lateral e um telefone cortam um título em pontos diferentes, e nenhum desses pontos de corte é publicado. Esta ferramenta afirma o teto documentado e mostra o formato do seu título, e não inventa um número de corte.',
  'web.tools.youtubeTitle.field.title.label': 'Título do vídeo',
  'web.tools.youtubeTitle.field.title.help': 'Contado por grafema, então um emoji custa um.',
  'web.tools.youtubeTitle.result.count': '{count} de {limit} caracteres',
  'web.tools.youtubeTitle.result.over':
    'Acima em {over, plural, one {# caractere} many {# caracteres} other {# caracteres}}. O envio seria rejeitado.',
  'web.tools.youtubeTitle.result.fits': 'Dentro do teto documentado.',
  'web.tools.youtubeTitle.result.front':
    'Os primeiros {count} caracteres carregam mais peso, porque é aproximadamente o espaço que um layout estreito comporta. O seu começa: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'O limite de título está indisponível nesta versão, então nada é verificado aqui.',
  'web.tools.youtubeTitle.faq.limit.q': 'De onde vem o limite?',
  'web.tools.youtubeTitle.faq.limit.a':
    'Da referência oficial de inserção de vídeos, gerada nesta página a partir do mesmo código de conector que nosso envio usaria. A data em que uma pessoa leu essa página pela última vez aparece ao lado do número.',
  'web.tools.youtubeTitle.faq.truncation.q': 'Onde exatamente o YouTube corta um título?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'Depende da superfície e do viewport, e o YouTube não publica uma contagem de caracteres para isso. Mostramos o teto, que é documentado, e não imprimimos um número de corte que seria um chute.',
  'web.tools.youtubeTitle.faq.emoji.q': 'Um emoji conta como um caractere?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'Neste contador sim, porque contamos grafemas. Uma plataforma que conta unidades de código internamente pode cobrar mais pelo mesmo emoji, e é por isso que o verificador de post aplica a regra de cada plataforma separadamente.',

  /* ---------------------------------------------------------------------- */
  /* Planejador de fuso horário e horário de verão                         */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'Planejador de fuso horário e horário de verão',
  'web.tools.timeZone.lede':
    'Um horário semanal que parece estável no seu calendário se move para metade da sua audiência duas vezes por ano. Isto mostra onde e quando.',
  'web.tools.timeZone.explainer.title': 'Por que um horário local fixo não é um horário fixo',
  'web.tools.timeZone.explainer.body':
    'Um horário só significa algo com um fuso anexado. Os fusos mudam seu deslocamento em datas que variam por país, e duas regiões que estão cinco horas separadas em janeiro podem estar quatro horas separadas em abril. Um cronograma armazenado como um instante mais um fuso sobrevive a isso. Um cronograma armazenado como uma hora local não.',
  'web.tools.timeZone.field.date.label': 'Data',
  'web.tools.timeZone.field.time.label': 'Hora',
  'web.tools.timeZone.field.zone.label': 'Seu fuso',
  'web.tools.timeZone.field.audience.label': 'Fusos da audiência',
  'web.tools.timeZone.field.audience.help':
    'Escolha os fusos em que seus leitores realmente estão.',
  'web.tools.timeZone.result.title': 'O mesmo momento, em todos que você escolheu',
  'web.tools.timeZone.result.empty': 'Escolha ao menos um fuso de audiência.',
  'web.tools.timeZone.result.shift':
    'Uma mudança de horário de verão cai entre esta data e o mesmo dia da semana quatro semanas depois, então a hora local se move.',
  'web.tools.timeZone.result.stable':
    'Nenhuma mudança de deslocamento nas próximas quatro semanas.',
  'web.tools.timeZone.result.later': 'Quatro semanas depois, {time}.',
  'web.tools.timeZone.result.invalidDate': 'Digite uma data e uma hora para ver a comparação.',
  'web.tools.timeZone.faq.dst.q': 'Para que lado a hora se move?',
  'web.tools.timeZone.faq.dst.a':
    'Depende do fuso e da direção da mudança, e é por isso que a tabela mostra a hora local real quatro semanas à frente em vez de descrever a regra. O deslocamento de cada fuso é lido do banco de dados de fusos horários do seu navegador.',
  'web.tools.timeZone.faq.storage.q': 'Como um post agendado deveria armazenar seu horário?',
  'web.tools.timeZone.faq.storage.a':
    'Como um instante mais o fuso IANA que a pessoa escolheu, nunca como um horário local simples. É o que fazemos internamente, e é por isso que um post agendado antes de uma mudança de relógio ainda chega na hora local pretendida.',

  /* ---------------------------------------------------------------------- */
  /* Calculadora de taxa de engajamento                                    */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': 'Calculadora de taxa de engajamento',
  'web.tools.engagementRate.lede':
    'Digite os números que seu próprio painel já mostra. Isto os divide de três formas e para aí: sem referência, sem limiar de "bom", nada que não temos de fato.',
  'web.tools.engagementRate.explainer.title': 'Por que três denominadores, não um',
  'web.tools.engagementRate.explainer.body':
    'Alcance, seguidores e impressões respondem perguntas diferentes. A taxa por alcance diz como as pessoas que realmente viram o post reagiram. A taxa por seguidores diz que fração da sua audiência interagiu, tendo o post alcançado todo mundo ou não. A taxa por impressões conta toda visualização, incluindo repetidas. Comparar uma taxa calculada de um jeito com outra calculada de outro jeito é uma fonte comum de um número de engajamento que parece errado.',
  'web.tools.engagementRate.field.interactions.label': 'Interações',
  'web.tools.engagementRate.field.interactions.help':
    'Curtidas, comentários, compartilhamentos e salvamentos somados, do post que você está medindo.',
  'web.tools.engagementRate.field.reach.label': 'Alcance',
  'web.tools.engagementRate.field.reach.help': 'Contas que viram o post ao menos uma vez.',
  'web.tools.engagementRate.field.followers.label': 'Seguidores',
  'web.tools.engagementRate.field.followers.help': 'O tamanho da conta no momento do post.',
  'web.tools.engagementRate.field.impressions.label': 'Impressões',
  'web.tools.engagementRate.field.impressions.help':
    'Total de visualizações, incluindo alguém que viu duas vezes.',
  'web.tools.engagementRate.result.title': 'Taxa de engajamento, de três formas',
  'web.tools.engagementRate.result.empty': 'indisponível',
  'web.tools.engagementRate.result.note':
    'Não existe uma boa taxa universal para comparar. Depende da plataforma, do formato, do tamanho da audiência e do setor, e qualquer número único oferecido como referência é um chute disfarçado de dado.',
  'web.tools.engagementRate.basis.reach': 'Por alcance',
  'web.tools.engagementRate.basis.followers': 'Por seguidores',
  'web.tools.engagementRate.basis.impressions': 'Por impressões',
  'web.tools.engagementRate.faq.formula.q': 'Qual é a fórmula de verdade?',
  'web.tools.engagementRate.faq.formula.a':
    'Interações divididas pelo denominador que você escolher, mostradas como porcentagem. Interações aqui significa curtidas, comentários, compartilhamentos e salvamentos somados; algumas plataformas relatam isso separadamente, e nesse caso some você mesmo antes de digitar o total.',
  'web.tools.engagementRate.faq.basis.q': 'Qual denominador devo usar?',
  'web.tools.engagementRate.faq.basis.a':
    'O que sua plataforma relata junto com o post, para que os dois números venham da mesma janela de medição. Comparar uma taxa por alcance de um post com uma taxa por seguidores de outro não é uma comparação justa, mesmo que ambas sejam chamadas de taxa de engajamento.',
} as const;
