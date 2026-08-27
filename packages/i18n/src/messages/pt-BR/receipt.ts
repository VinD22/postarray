/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Recibo de publicação',
  'receipt.subtitle': 'Exatamente o que foi publicado, onde, quando e com aprovação de quem.',
  'receipt.target': '{account} em {provider}',
  'receipt.externalId': 'ID de publicação externa',
  'receipt.permalink': 'Link permanente',
  'receipt.permalinkUnavailable':
    '{provider} não retorna um link permanente para este tipo de publicação.',
  'receipt.contentVersion': 'Versão do conteúdo',
  'receipt.contentHash': 'Soma de verificação de conteúdo',
  'receipt.mediaVersion': 'Versão de mídia',
  'receipt.idempotencyKey': 'Referência de idempotência',
  'receipt.correlationId': 'Referência de correlação',

  'receipt.surface.label': 'Criado a partir de',
  'receipt.surface.web': 'Aplicativo Web',
  'receipt.surface.api': 'API REST',
  'receipt.surface.mcp': 'servidor MCP',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'Postagem automática RSS',
  'receipt.surface.automation': 'Regra de automação',
  'receipt.surface.webhook': 'webhook de entrada',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Conta de serviço {name}',
  'receipt.actor.oauthApp': '{app} atuando em nome de {name}',
  'receipt.actor.system': 'Post Array',

  'receipt.timeline.title': 'Linha do tempo',
  'receipt.timeline.created': 'Rascunho criado por {actor}',
  'receipt.timeline.approvalRequested': 'Aprovação solicitada de {approver}',
  'receipt.timeline.approved': 'Aprovado por {actor} sob a política {policy}',
  'receipt.timeline.scheduled': 'Programado para {local} em {timeZone}',
  'receipt.timeline.revalidated': 'Credenciais e limites de plataforma verificados novamente',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# arquivo preparado para a plataforma} other {# arquivos preparados para a plataforma} many {# arquivos preparados para a plataforma}}',
  'receipt.timeline.dispatched': 'Enviado para {provider}',
  'receipt.timeline.providerAccepted': '{provider} aceitou a publicação',
  'receipt.timeline.providerProcessing': '{provider} ainda está processando a mídia',
  'receipt.timeline.published': 'Publicado como {externalId}',
  'receipt.timeline.commentPublished': 'Item de acompanhamento {position} publicado',
  'receipt.timeline.retryScheduled': 'Tentar novamente {attempt} agendado para {time}',
  'receipt.timeline.failed': 'Tentativa {attempt} falhou',
  'receipt.timeline.canceled': 'Cancelado por {actor}',
  'receipt.timeline.analyticsSynced': 'Analítica sincronizada',
  'receipt.timeline.deletedExternally': 'A publicação não está mais em {provider}',

  'receipt.times.scheduled': 'Horário agendado',
  'receipt.times.dispatched': 'Tempo de envio',
  'receipt.times.published': 'Hora de publicação',
  'receipt.times.latency': 'Enviado {duration} após o horário programado.',

  'receipt.attempts.title': 'Tentativas',
  'receipt.attempts.count':
    '{count, plural, one {# tentativa} other {# tentativas} many {# tentativas}}',
  'receipt.attempts.classification': 'Classificação',
  'receipt.attempts.providerResponse': 'Resposta do provedor',
  'receipt.attempts.responseRedacted':
    'A resposta do provedor é armazenada com tokens e dados pessoais removidos.',
  'receipt.attempts.remediation': 'O que fazer a seguir',

  'receipt.cost.estimated': 'Estimado {amount}',
  'receipt.cost.actual': 'Reconciliado {amount}',
  'receipt.cost.pending': 'O uso real ainda não foi reconciliado.',

  'receipt.partial.title': 'Publicado parcialmente',
  'receipt.partial.body':
    '{published, plural, one {# alvo publicado} other {# alvos publicados} many {# alvos publicados}}. {failed, plural, one {# destino falhou} other {# destinos falharam} many {# alvos falharam}}. As publicações publicadas ainda existem na plataforma.',
  'receipt.partial.doNotRollback':
    'Não excluímos uma publicação que já foi publicada. Exclua-o da plataforma se desejar.',

  'receipt.export.title': 'Compartilhe este recibo',
  'receipt.export.pdf': 'Baixar como PDF',
  'receipt.export.json': 'Baixar como JSON',
  'receipt.export.permissionNote':
    'Somente proprietários, administradores e aprovadores podem compartilhar um recibo.',

  'receipt.analytics.lastSync': 'Analytics sincronizado pela última vez {relativeTime}.',
  'receipt.analytics.nextSync': 'Próxima sincronização em torno de {time}.',
} as const;
