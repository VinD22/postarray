/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Rascunho',
  'state.draft.description':
    'Somente pessoas neste espaço de trabalho podem vê-lo. Nada está programado.',
  'state.validation_needed.label': 'Validação necessária',
  'state.validation_needed.description':
    'Um ou mais alvos têm um problema que deve ser corrigido antes que isso possa ser agendado.',
  'state.approval_requested.label': 'Aprovação solicitada',
  'state.approval_requested.description': 'Aguardando {approver} decidir.',
  'state.approved.label': 'Aprovado',
  'state.approved.description': 'Aprovado por {approver}. Agora pode ser agendado ou publicado.',
  'state.scheduled.label': 'Agendado',
  'state.scheduled.description': 'Publica {time} em {timeZone}.',
  'state.preparing_media.label': 'Preparando mídia',
  'state.preparing_media.description': 'Upload e conversão de arquivos para a plataforma.',
  'state.dispatching.label': 'Envio',
  'state.dispatching.description': 'Enviando para {provider} agora.',
  'state.provider_processing.label': 'Processamento do provedor',
  'state.provider_processing.description':
    '{provider} aceitou o upload e ainda está processando. Confirmamos quando estiver ao vivo.',
  'state.published.label': 'Publicado',
  'state.published.description': 'Ao vivo em {provider} desde {time}.',
  'state.partially_published.label': 'Publicado parcialmente',
  'state.partially_published.description':
    '{published, plural, one {# alvo publicado} other {# alvos publicados} many {# alvos publicados}}, {failed, plural, one {# falhou} other {# falhou} many {# falhou}}. As publicações publicadas estão ativas e não foram revertidas.',
  'state.action_required.label': 'Ação necessária',
  'state.action_required.description': 'Isso não pode continuar até que você faça algo.',
  'state.retry_scheduled.label': 'Repetição agendada',
  'state.retry_scheduled.description':
    'A tentativa {attempt} de {max} será executada em {time}. Nada é duplicado.',
  'state.failed_permanently.label': 'Falha',
  'state.failed_permanently.description':
    'Isso não será tentado novamente. Seu conteúdo está preservado e o motivo está no recibo.',
  'state.canceled.label': 'Cancelado',
  'state.canceled.description': 'Cancelado por {actor} em {date}. Nada foi publicado.',
  'state.deleted_externally.label': 'Excluído na plataforma',
  'state.deleted_externally.description':
    'Esta publicação não está mais em {provider}. O recibo e as métricas coletadas antes de sua saída são mantidos.',

  'state.approval.not_required.label': 'Não é necessária aprovação',
  'state.approval.not_required.description': 'A política para essas metas não requer aprovação.',
  'state.approval.requested.label': 'Solicitado',
  'state.approval.requested.description': 'Enviado para {approver} {relativeTime}.',
  'state.approval.in_review.label': 'Em revisão',
  'state.approval.in_review.description': '{approver} está olhando para isso agora.',
  'state.approval.approved.label': 'Aprovado',
  'state.approval.approved.description': 'Aprovado por {approver} em {date}.',
  'state.approval.changes_requested.label': 'Alterações solicitadas',
  'state.approval.changes_requested.description': '{approver} solicitou alterações em {date}.',
  'state.approval.rejected.label': 'Rejeitado',
  'state.approval.rejected.description': 'Rejeitado por {approver} em {date}.',
  'state.approval.expired.label': 'Expirado',
  'state.approval.expired.description': 'Esta solicitação expirou em {date} sem decisão.',
  'state.approval.withdrawn.label': 'Retirado',
  'state.approval.withdrawn.description': 'O autor retirou esta solicitação em {date}.',

  'state.summary.targets':
    '{ready, plural, one {# alvo pronto} other {# alvos prontos} many {# alvos prontos}}, {blocked, plural, =0 {nenhum bloqueado} one {# bloqueado} other {# bloqueado} many {# bloqueado}}',
  'state.changedAt': 'Alterado {relativeTime}',
} as const;
