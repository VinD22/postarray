/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Navegação primária',
  'a11y.region.main': 'Conteúdo principal',
  'a11y.region.composer': 'Composer',
  'a11y.region.preview': 'Prévia',
  'a11y.region.validation': 'Problemas de validação',
  'a11y.region.targets': 'Contas-alvo',
  'a11y.region.notifications': 'Notificações',

  'a11y.announce.saved': 'Rascunho salvo',
  'a11y.announce.saving': 'Salvando rascunho',
  'a11y.announce.saveFailed': 'Não foi possível salvar o rascunho. Seu texto ainda está aqui.',
  'a11y.announce.offline': 'Você está off-line. As alterações são mantidas neste dispositivo.',
  'a11y.announce.online': 'Voltar on-line',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Sem problemas de validação} one {# problema de validação} other {# problemas de validação} many {# problemas de validação}}',
  'a11y.announce.validationCleared': 'Todos os problemas de validação resolvidos',
  'a11y.announce.targetSelected':
    '{account} selecionado. {count, plural, one {# meta} other {# metas} many {# metas}} no total.',
  'a11y.announce.targetOverridden': '{account} agora tem sua própria versão',
  'a11y.announce.targetReset': '{account} redefinir para o rascunho mestre',
  'a11y.announce.uploadProgress': '{name}, {percent} carregado',
  'a11y.announce.uploadComplete': '{name} enviado',
  'a11y.announce.uploadFailed': '{name} falhou ao enviar',
  'a11y.announce.scheduled': 'Programado para {time} em {timeZone}',
  'a11y.announce.rescheduled': 'Movido para {time} em {timeZone}',
  'a11y.announce.publishing': 'Publicação',
  'a11y.announce.published':
    '{count, plural, one {Publicado na conta #} other {Publicado nas contas #} many {Publicado nas contas #}}',
  'a11y.announce.publishPartial':
    'Publicado em {published} de {total} contas. {failed, plural, one {# conta precisa de atenção} other {# contas precisam de atenção} many {# contas precisam de atenção}}.',
  'a11y.announce.publishFailed': 'Falha na publicação. Seu conteúdo é preservado.',
  'a11y.announce.approvalRequested': 'Aprovação solicitada de {approver}',
  'a11y.announce.approved': 'Aprovado',
  'a11y.announce.connectionAdded': '{account} conectado',
  'a11y.announce.connectionRemoved': '{account} desconectado',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Filtros limpos} one {# filtro aplicado} other {# filtros aplicados} many {# filtros aplicados}}, {results, plural, one {# resultado} other {# resultados} many {# resultados}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Copiado para a área de transferência',
  'a11y.announce.suggestionApplied': 'Sugestão aplicada',
  'a11y.announce.suggestionRejected': 'Sugestão rejeitada',

  'a11y.label.closeDialog': 'Fechar caixa de diálogo',
  'a11y.label.openMenu': 'Abrir menu',
  'a11y.label.sortBy': 'Classificar por {field}',
  'a11y.label.sortAscending': 'Ordenado crescente',
  'a11y.label.sortDescending': 'Ordenado em ordem decrescente',
  'a11y.label.removeTarget': 'Remova {account} dos alvos',
  'a11y.label.removeMedia': 'Remover {name}',
  'a11y.label.editAltText': 'Editar texto alternativo para {name}',
  'a11y.label.mediaPreview': 'Prévia de {name}',
  'a11y.label.playVideo': 'Jogar {name}',
  'a11y.label.pauseVideo': 'Pausa {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {nada agendado} one {# publicação} other {# publicações} many {# publicações}}',
  'a11y.label.postSummary': '{account} em {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} de {limit} caracteres usados',
  'a11y.label.requiredField': 'Obrigatório',
  'a11y.label.externalLink': 'Abre em uma nova aba',
  'a11y.label.loadingRegion': 'Carregando conteúdo',
  'a11y.label.expandRow': 'Mostrar detalhes de {name}',
  'a11y.label.collapseRow': 'Ocultar detalhes de {name}',
  'a11y.languagePicker.label': 'Escolha o idioma da interface',
  'a11y.languagePicker.filterLabel': 'Filtrar idiomas',
  'a11y.languagePicker.announceChanged': 'Idioma da interface alterado para {language}',

  'a11y.keyboard.hint.calendar':
    'Use as teclas de seta para mover entre os slots. Pressione Enter para abrir uma publicação. Pressione Espaço e depois as teclas de seta para reagendar.',
  'a11y.keyboard.hint.composer':
    'Pressione Control e as teclas de colchetes para mover entre os alvos. Pressione Control e I para passar para a próxima edição.',
  'a11y.keyboard.hint.dialog': 'Pressione Escape para fechar.',
  'a11y.keyboard.shortcutsTitle': 'Atalhos de teclado',

  'a11y.table.alternative': 'Visualização de tabela',
  'a11y.table.alternativeHint': 'A mesma programação de uma tabela classificável.',
  'a11y.motion.reduced': 'As animações são reduzidas devido à configuração do sistema.',
} as const;
