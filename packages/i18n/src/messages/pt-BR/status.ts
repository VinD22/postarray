/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'Nada agendado ainda',
  'empty.calendar.body':
    'Escreva sua primeira publicação e escolha um horário. Você pode alterá-lo mais tarde.',
  'empty.calendar.action': 'Escrever uma publicação',
  'empty.drafts.title': 'Sem rascunhos',
  'empty.drafts.body': 'Os rascunhos que você salva aparecem aqui com seus objetivos e problemas.',
  'empty.connections.title': 'Nenhuma conta conectada',
  'empty.connections.body':
    'Conecte uma conta para publicar nela. Mostramos as permissões exatas primeiro.',
  'empty.connections.action': 'Conecte uma conta',
  'empty.analytics.title': 'Nenhuma métrica ainda',
  'empty.analytics.body':
    'As métricas aparecem depois que sua primeira publicação estiver no ar por tempo suficiente para que a plataforma relate sobre ela.',
  'empty.analytics.noPermission':
    'Esta conta não concedeu acesso analítico. Reconecte para adicioná-lo.',
  'empty.approvals.title': 'Nada esperando por você',
  'empty.approvals.body': 'As solicitações de aprovação dos seus projetos aparecem aqui.',
  'empty.library.title': 'Sua biblioteca está vazia',
  'empty.library.body': 'Faça upload de imagens e vídeos ou importe-os de um URL ou da API.',
  'empty.library.action': 'Carregar mídia',
  'empty.automation.title': 'Ainda não há regras',
  'empty.automation.body':
    'Uma regra reage a algo e propõe uma ação. Cada regra mostra seus limites antes de você ativá-la.',
  'empty.webhooks.title': 'Sem pontos finais',
  'empty.webhooks.body':
    'Adicione um endpoint para receber eventos assinados sobre publicação e conexões.',
  'empty.searchResults.title': 'Nenhum resultado para {query}',
  'empty.searchResults.body': 'Verifique a ortografia ou limpe um filtro.',
  'empty.filtered.title': 'Nada corresponde a esses filtros',
  'empty.filtered.action': 'Limpar filtros',
  'empty.auditLog.title': 'Nenhuma atividade ainda',
  'empty.receipts.title': 'Nenhum recibo ainda',
  'empty.receipts.body':
    'Cada publicação produz um recibo que você pode inspecionar e compartilhar.',

  'loading.default': 'Carregando',
  'loading.calendar': 'Carregando seu calendário',
  'loading.analytics': 'Carregando métricas',
  'loading.preview': 'Construindo a visualização',
  'loading.validating': 'Verificando os limites atuais da plataforma',
  'loading.publishing': 'Publicando em {provider}',
  'loading.uploading': 'Enviando {name}',
  'loading.uploadProgress': '{percent} carregado',
  'loading.connecting': 'Conectando a {provider}',
  'loading.savingDraft': 'Salvando seu rascunho',
  'loading.generatingPlan': 'Construindo seu plano',
  'loading.longRunning': 'Isso está demorando mais que o normal. Ele ainda está em execução.',

  'offline.banner': 'Você está off-line. As alterações são mantidas neste dispositivo.',
  'offline.draftSafe':
    'Seu rascunho está seguro. Ele sincroniza quando você estiver on-line novamente.',
  'offline.publishDisabled':
    'A publicação precisa de uma conexão. Isso não será colocado na fila silenciosamente.',
  'offline.scheduleQueued':
    'Esta solicitação de agendamento está na fila deste dispositivo e será enviada quando você estiver on-line novamente.',
  'offline.reconnected': 'De volta on-line. Sincronizando suas alterações.',
  'offline.syncConflict':
    'Algumas alterações não puderam ser mescladas automaticamente. Revise-os antes de salvar.',

  'permission.denied.title': 'Você não tem acesso a este',
  'permission.denied.role': 'Isso precisa da função {role}. Você é {currentRole}.',
  'permission.denied.scope': 'Esta credencial precisa do escopo {scope}.',
  'permission.denied.contactOwner': 'Peça a {owner} para concedê-lo.',
  'permission.denied.projectScope': 'Seu acesso é limitado a {projects}.',
  'permission.readOnly': 'Este espaço de trabalho é somente leitura no momento.',
  'permission.mfaRequired': 'Confirme com autenticação de dois fatores para continuar.',

  'rateLimit.title': 'Desacelere por um momento',
  'rateLimit.body': 'Você fez solicitações {count} em {window}. O limite é {limit}.',
  'rateLimit.resetsAt': 'Isso é redefinido em {time}.',
  'rateLimit.cheaperAlternative': 'Agendar em vez de publicar agora evita esse limite.',
  'rateLimit.providerCost':
    '{provider} cobranças por operação. Esta ação está estimada em {amount}.',

  'incident.providerDegraded':
    '{provider} está tendo problemas. Postagens agendadas continuam tentando novamente.',
  'incident.providerDown': '{provider} não está disponível. Nada se perde e nada se duplica.',
  'incident.isolated': 'Outras plataformas não são afetadas.',
  'incident.statusPage': 'Status ao vivo por conector e superfície',
  'incident.startedAt': 'Iniciado {relativeTime}',

  'translation.incomplete':
    'Algum texto nesta tela ainda não foi traduzido para {language} e é mostrado em inglês.',
  'translation.beta': 'Esta linguagem está em beta. Relate qualquer coisa que esteja errada.',

  'confirm.discardChanges.title': 'Descartar suas alterações?',
  'confirm.discardChanges.body': 'Isso não pode ser desfeito.',
  'confirm.deleteItem.title': 'Excluir {name}?',
  'confirm.deleteItem.body': 'Isso não pode ser desfeito.',
  'confirm.cancelScheduled.title': 'Cancelar esta publicação agendada?',
  'confirm.cancelScheduled.body':
    'Não será publicado. O rascunho fica aqui para que você possa agendá-lo novamente.',
  'confirm.publishNow.title': 'Publicar agora?',
  'confirm.publishNow.body':
    '{count, plural, one {Isto publica na conta # imediatamente} other {Isto publica nas contas # imediatamente} many {Isto publica nas contas # imediatamente}}. Não pode ser recuperado de Relay.',
  'confirm.typeToConfirm': 'Digite {word} para confirmar.',
} as const;
