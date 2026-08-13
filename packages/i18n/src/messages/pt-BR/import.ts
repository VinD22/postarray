export const importMessages = {
  'import.title': 'Importar posts de um CSV',
  'import.subtitle':
    'Envie uma planilha, veja o que ela vai fazer, depois decida. Enviar apenas verifica o arquivo. Não cria nada.',

  'import.step.upload': 'Enviar',
  'import.step.columns': 'Colunas',
  'import.step.review': 'Revisar',
  'import.step.apply': 'Aplicar',
  'import.step.results': 'Resultados',
  'import.step.position': 'Etapa {current} de {total}',

  'import.upload.heading': 'Escolha um arquivo CSV',
  'import.upload.help':
    'Somente CSV. Arquivos de planilha como .xlsx não são lidos. Exporte sua planilha como CSV primeiro.',
  'import.upload.field': 'Arquivo CSV',
  'import.upload.fieldHelp': 'Selecione um arquivo, ou cole as linhas na caixa abaixo.',
  'import.upload.paste': 'Ou cole o texto CSV',
  'import.upload.pasteHelp': 'Inclua a linha de cabeçalho. Tudo é verificado antes de qualquer coisa ser criada.',
  'import.upload.project': 'Projeto',
  'import.upload.projectHelp': 'Toda linha em um arquivo pertence a este projeto.',
  'import.upload.submit': 'Verificar este arquivo',
  'import.upload.submitting': 'Lendo o arquivo',
  'import.upload.allowPast': 'Permitir horários que já passaram',
  'import.upload.allowPastHelp':
    'Desativado por padrão. Uma linha datada no passado é reportada para você corrigir, em vez de ser movida por nós.',
  'import.upload.tooLarge': 'Esse arquivo é maior que {limit} caracteres. Divida-o e tente de novo.',
  'import.upload.duplicate':
    'Este é o mesmo arquivo que você enviou antes, então você está vendo aquela importação em vez de uma segunda cópia dela.',

  'import.template.heading': 'O que as colunas significam',
  'import.template.download': 'Baixar um modelo de CSV',
  'import.template.required': 'Colunas obrigatórias',
  'import.template.optional': 'Colunas opcionais',
  'import.column.external_row_id': 'Seu próprio id para a linha. Precisa ser único dentro do arquivo.',
  'import.column.project': 'O nome ou id do projeto ao qual a linha pertence.',
  'import.column.targets':
    'Um conjunto: seguido de um id de conjunto de contas, ou ids de conta separados por barra vertical.',
  'import.column.caption': 'O texto do post.',
  'import.column.scheduled_local_time': 'Data e hora local, escritas como 2026-09-01T10:00.',
  'import.column.time_zone': 'O fuso IANA em que essa hora local é lida, por exemplo Europe/Berlin.',
  'import.column.media':
    'Um id de mídia, sha256: seguido do checksum de uma mídia que você já tem, ou um endereço https para o servidor buscar.',
  'import.column.title': 'Um título, onde o destino usar um.',
  'import.column.destination': 'A página, quadro ou canal dentro da conta.',
  'import.column.privacy': 'O valor de privacidade que o destino espera.',
  'import.column.first_comment': 'Texto publicado como o primeiro comentário depois do post.',
  'import.column.approval_policy': 'A política de aprovação a anexar a cada rascunho.',
  'import.column.perPlatform':
    'Uma coluna caption_ ou title_ nomeada com uma plataforma sobrescreve apenas aquela plataforma, por exemplo caption_instagram.',

  'import.columns.heading': 'Verificação de colunas',
  'import.columns.ok': 'Toda coluna obrigatória está presente.',
  'import.columns.missing':
    '{count, plural, one {# coluna obrigatória está faltando} many {# colunas obrigatórias estão faltando} other {# colunas obrigatórias estão faltando}}',
  'import.columns.unknown':
    '{count, plural, one {# coluna não foi reconhecida e é ignorada} many {# colunas não foram reconhecidas e são ignoradas} other {# colunas não foram reconhecidas e são ignoradas}}',
  'import.columns.present': 'Colunas encontradas',

  'import.review.heading': 'O que este arquivo vai fazer',
  'import.review.counts':
    '{valid, plural, =0 {Nenhuma linha está pronta} one {# linha está pronta} other {# linhas estão prontas}}, {invalid, plural, =0 {nenhuma precisa de atenção} one {# precisa de atenção} other {# precisam de atenção}}.',
  'import.review.empty': 'Nenhuma linha foi lida deste arquivo.',
  'import.review.rowsHeading': 'Linhas',
  'import.review.filterAll': 'Todas as linhas',
  'import.review.filterValid': 'Prontas',
  'import.review.filterInvalid': 'Precisam de atenção',
  'import.review.filterFailed': 'Falharam',
  'import.review.downloadErrors': 'Baixar os problemas como CSV',
  'import.review.parsedWith': 'Lido com o parser {version}',

  'import.table.row': 'Id da linha',
  'import.table.line': 'Linha',
  'import.table.state': 'Estado',
  'import.table.caption': 'Legenda',
  'import.table.time': 'Agendado',
  'import.table.problems': 'Problemas',
  'import.table.draft': 'Rascunho',
  'import.table.noProblems': 'Nenhum',

  'import.state.pending': 'Não verificado',
  'import.state.valid': 'Pronto',
  'import.state.invalid': 'Precisa de atenção',
  'import.state.applied': 'Rascunho criado',
  'import.state.skipped': 'Já feito',
  'import.state.failed': 'Falhou',

  'import.job.state.uploaded': 'Enviado',
  'import.job.state.validating': 'Verificando',
  'import.job.state.validated': 'Verificado',
  'import.job.state.applying': 'Aplicando',
  'import.job.state.applied': 'Aplicado',
  'import.job.state.failed': 'Não pôde ser lido',

  'import.apply.heading': 'O que deve acontecer com as linhas que estão prontas?',
  'import.apply.drafts': 'Criar rascunhos',
  'import.apply.draftsHelp':
    'O padrão. Cada linha pronta vira um rascunho que você pode abrir, editar e aprovar. Nada é agendado.',
  'import.apply.scheduled': 'Criar rascunhos e agendá-los',
  'import.apply.scheduledHelp':
    'Cada linha pronta vira um rascunho e assume o horário escrito no arquivo. Escolha isto apenas se os horários estiverem corretos.',
  'import.apply.confirm': 'Aplicar {count, plural, one {# linha} many {# linhas} other {# linhas}}',
  'import.apply.confirmScheduled':
    'Criar e agendar {count, plural, one {# linha} many {# linhas} other {# linhas}}',
  'import.apply.running': 'Aplicando linhas',
  'import.apply.safeToRepeat':
    'Aplicar duas vezes é seguro. Uma linha que já criou um rascunho é deixada em paz.',

  'import.results.heading': 'Resultados',
  'import.results.applied':
    '{count, plural, one {# rascunho criado} many {# rascunhos criados} other {# rascunhos criados}}',
  'import.results.skipped':
    '{count, plural, one {# linha já estava feita} many {# linhas já estavam feitas} other {# linhas já estavam feitas}}',
  'import.results.failed':
    '{count, plural, one {# linha falhou} many {# linhas falharam} other {# linhas falharam}}',
  'import.results.retry': 'Aplicar as linhas restantes de novo',
  'import.results.openDrafts': 'Abrir os rascunhos',
  'import.results.unavailable': 'indisponível',

  'import.history.heading': 'Importações anteriores',
  'import.history.empty': 'Ainda não há importações.',
  'import.history.open': 'Abrir',

  'import.a11y.rowsTable': 'Linhas do manifesto e seus problemas',
  'import.a11y.stepList': 'Etapas da importação',
  'import.a11y.uploadedFile': 'Arquivo selecionado: {filename}',

  'import.error.emptyFile': 'Esse arquivo não tem linhas.',
  'import.error.missingColumn': 'A coluna {column} está faltando.',
  'import.error.unknownColumn': 'A coluna {column} não foi reconhecida, então é ignorada.',
  'import.error.duplicateRowId': 'O id de linha {value} é usado mais de uma vez neste arquivo.',
  'import.error.required': 'Esta célula não pode estar vazia.',
  'import.error.invalidCell': 'Esta célula não está em um formato que conseguimos ler.',
  'import.error.rowShape': 'Esta linha tem {actual} células, mas o cabeçalho tem {expected}.',
  'import.error.invalidLocalTime':
    'O horário {value} não é uma data e hora local como 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'O fuso {value} não é um nome de fuso horário IANA.',
  'import.error.nonexistentLocalTime':
    'O horário {value} não existe em {zone}. Os relógios pulam por cima dele.',
  'import.error.ambiguousLocalTime':
    'O horário {value} acontece duas vezes em {zone} naquele dia. Escolha um horário diferente.',
  'import.error.scheduleInPast': 'O horário {value} em {zone} já passou.',
  'import.error.invalidTargets':
    'O valor {value} não é um conjunto de contas salvo nem uma lista de ids de conta.',
  'import.error.invalidMedia':
    'O valor {value} não é um id de mídia, um checksum sha256 nem um endereço https.',
  'import.error.mediaNotFound': 'Nenhuma mídia neste workspace corresponde a {value}.',
  'import.error.mediaImportStarted':
    'A mídia em {value} está sendo buscada. Aplique este arquivo de novo assim que ela estiver na biblioteca.',
  'import.error.unknownVariantTarget':
    'Esta linha não tem conta {provider}, então a legenda de {provider} não foi usada.',
  'import.error.applyFailed': 'Esta linha não pôde ser aplicada. Referência: {code}.',
  'import.error.alreadyApplied': 'Esta linha já criou um rascunho, então foi deixada em paz.',
  'import.error.tooManyRows': 'Apenas as primeiras {limit} linhas de um arquivo são lidas.',
} as const;
