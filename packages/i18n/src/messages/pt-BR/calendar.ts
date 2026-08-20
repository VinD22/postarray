/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Calendário',
  'calendar.view.day': 'Dia',
  'calendar.view.week': 'Semana',
  'calendar.view.month': 'Mês',
  'calendar.view.list': 'Lista',
  'calendar.view.label': 'Visualização do calendário',
  'calendar.today': 'Hoje',
  'calendar.goToDate': 'Ir para a data',
  'calendar.previousPeriod': 'Período anterior',
  'calendar.nextPeriod': 'Próximo período',
  'calendar.timeZoneNote': 'Os tempos são mostrados em {timeZone}.',
  'calendar.weekOf': 'Semana de {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount':
    '{count, plural, =0 {Nada programado} one {# publicação} other {# publicações} many {# publicações}}',
  'calendar.slotOverflow': '{count, plural, one {# mais} other {# mais} many {# mais}}',
  'calendar.newPostAt': 'Nova publicação em {time}',

  'calendar.filter.project': 'Project',
  'calendar.filter.account': 'Conta',
  'calendar.filter.platform': 'Plataforma',
  'calendar.filter.status': 'Status',
  'calendar.filter.locale': 'Idioma do conteúdo',
  'calendar.filter.campaign': 'Campanha',
  'calendar.filter.applied':
    '{count, plural, one {# filtro aplicado} other {# filtros aplicados} many {# filtros aplicados}}',

  'calendar.drag.instructions':
    'Arraste uma publicação para um novo espaço ou selecione-a e use as teclas de seta para movê-la.',
  'calendar.drag.confirmTitle': 'Mover esta publicação?',
  'calendar.drag.confirmBody': 'De {from} a {to} em {timeZone}.',
  'calendar.drag.dstNotice':
    'Os relógios mudam entre esses horários em {timeZone}. O novo horário é {utc} UTC.',
  'calendar.drag.publishedNotice':
    'Este publicação já foi publicado. Movê-lo altera apenas o registro local. Publicá-lo novamente é uma ação separada.',
  'calendar.drag.conflictNotice':
    '{account} já tem {count, plural, one {# publicação} other {# publicações} many {# publicações}} dentro de uma hora após o novo horário.',

  'calendar.queue.title': 'Fila',
  'calendar.queue.upcoming': 'Próximos',
  'calendar.queue.needsApproval': 'Aguardando aprovação',
  'calendar.queue.drafts': 'Rascunhos',
  'calendar.queue.published': 'Publicado',
  'calendar.queue.failed': 'Falha',
  'calendar.queue.nextSlot': 'O próximo slot grátis é {time}.',

  'calendar.post.publishesAt': 'Publica {time} em {timeZone}',
  'calendar.post.publishedAt': 'Publicado {time}',
  'calendar.post.targetCount': '{count, plural, one {# conta} other {# contas} many {# contas}}',
  'calendar.post.mediaType.text': 'Texto',
  'calendar.post.mediaType.image': 'Imagem',
  'calendar.post.mediaType.carousel': 'Carrossel',
  'calendar.post.mediaType.video': 'Vídeo',
  'calendar.post.mediaType.document': 'Documento',

  'actionCenter.title': 'Centro de ação',
  'actionCenter.description': 'Tudo que precisa de uma decisão ou correção, em uma fila.',
  'actionCenter.empty': 'Nada precisa de atenção agora.',
  'actionCenter.item.connectionExpiring':
    '{account} precisa ser reconectado antes de {date} ou as publicações agendadas falharão.',
  'actionCenter.item.connectionActionRequired':
    '{account} precisa de atenção em {provider} antes de poder publicar novamente.',
  'actionCenter.item.validationFailed':
    'Um rascunho para {account} não passa na validação {provider}.',
  'actionCenter.item.approvalOverdue': 'Uma solicitação de aprovação está aguardando desde {date}.',
  'actionCenter.item.scheduleConflict': '{account} tem publicações agendadas próximas em {date}.',
  'actionCenter.item.providerIncident':
    '{provider} está relatando um problema. As publicações agendadas serão repetidas.',
  'actionCenter.item.commentFailed':
    'A publicação principal foi publicada, mas um item de acompanhamento para {account} falhou.',
  'actionCenter.item.analyticsStale': 'Analytics para {account} não foi atualizado desde {date}.',
  'actionCenter.item.rssStalled': 'O feed {name} não retornou um item válido desde {date}.',
  'actionCenter.item.webhookFailing':
    'As entregas para {endpoint} falharam {count, plural, one {# vez} other {# vezes} many {# vezes}} consecutivas.',
  'actionCenter.item.usageBalance':
    'Uma ação medida para {provider} precisa de um equilíbrio de uso antes de poder ser executada.',

  'approval.title': 'Aprovações',
  'approval.requestTitle': 'Solicitação de aprovação',
  'approval.requestedBy': 'Solicitado por {name} {relativeTime}',
  'approval.requestedFrom': 'Aguardando {name}',
  'approval.policy.none': 'Não é necessária aprovação para essas metas.',
  'approval.policy.anyApprover': 'Qualquer aprovador pode aprovar isso.',
  'approval.policy.namedApprover': '{name} deve aprovar isso.',
  'approval.policy.everyApprover': 'Todo aprovador deve aprovar isso.',
  'approval.decision.approvedBy': 'Aprovado por {name} em {date}',
  'approval.decision.rejectedBy': 'Rejeitado por {name} em {date}',
  'approval.decision.changesRequestedBy': 'Alterações solicitadas por {name} em {date}',
  'approval.comment.label': 'Nota para o autor',
  'approval.comment.placeholder': 'Diga o que precisa mudar e por quê.',
  'approval.reapproval.needed':
    'Esta publicação foi alterada após aprovação. Ele precisa de aprovação novamente antes de poder ser publicado.',
  'approval.reapproval.reason.content': 'O conteúdo foi alterado.',
  'approval.reapproval.reason.account': 'As contas de destino foram alteradas.',
  'approval.reapproval.reason.media': 'A mídia mudou.',
  'approval.reapproval.reason.schedule': 'O horário de publicação mudou.',
  'approval.reapproval.reason.privacy':
    'As configurações de privacidade ou divulgação foram alteradas.',
  'approval.reapproval.reason.locale': 'O idioma do conteúdo mudou.',
  'approval.expiresAt': 'Esta solicitação expira em {date}.',
} as const;
