export const postingSetMessages = {
  /* ------------------------------------------------------------- a pausa */
  'calendar.hold.action': 'Pausar',
  'calendar.hold.resumeAction': 'Retomar',
  'calendar.hold.badge': 'Pausado',
  'calendar.hold.badgeBilling': 'Pausado pela cobrança',
  'calendar.hold.term': 'Pausa',
  'calendar.hold.byPerson': 'Pausado por você em {date}.',
  'calendar.hold.byBilling': 'Pausado em {date} porque este workspace perdeu o acesso completo.',
  'calendar.hold.none': 'Não pausado',

  'calendar.hold.confirmTitle': 'Pausar este post?',
  'calendar.hold.confirmBody':
    'Este post vai ficar onde está e não vai sair às {time}. Você pode retomá-lo a qualquer momento antes disso, ou escolher um novo horário se aquele já passou.',
  'calendar.hold.confirmScope':
    'Pausar interrompe o que ainda não aconteceu. Qualquer coisa já publicada em uma plataforma continua publicada, e pausar não a exclui nem a edita.',
  'calendar.hold.confirmNoteLabel': 'Por que você está pausando isto? (opcional)',
  'calendar.hold.confirmNoteHint':
    'Mantido no registro de auditoria da sua equipe. Não é enviado a nenhuma plataforma.',
  'calendar.hold.confirm': 'Pausar este post',
  'calendar.hold.cancel': 'Deixar agendado',

  'calendar.hold.resumeTitle': 'Retomar este post?',
  'calendar.hold.resumeBody': 'Ele vai sair às {time}, em {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'Esse horário já passou',
  'calendar.hold.resumeMissedBody':
    'Este post estava previsto para {time} enquanto estava pausado. Escolha um novo horário para que ele não saia no momento em que você retomá-lo.',
  'calendar.hold.resumeTimeLabel': 'Novo horário de publicação',
  'calendar.hold.resumeConfirm': 'Retomar',

  'calendar.hold.paused': 'Pausado. Não vai sair até você retomá-lo.',
  'calendar.hold.resumed': 'Retomado. Vai sair às {time}.',

  'calendar.hold.blocked.published': 'Este post já saiu. Pausar não pode retirá-lo da plataforma.',
  'calendar.hold.blocked.inFlight':
    'Este post está sendo enviado agora. É tarde demais para pausá-lo, e interromper na metade poderia deixá-lo publicado apenas parcialmente.',
  'calendar.hold.blocked.finished': 'Este post já está concluído, então não há nada para pausar.',
  'calendar.hold.blocked.billing':
    'Este post está pausado porque o workspace perdeu o acesso completo. Retomá-lo é uma questão de cobrança, não de agendamento.',
  'calendar.hold.blocked.billingAction': 'Ir para a cobrança',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Posting Sets',
  'set.lede':
    'Uma resposta salva para "para quem estou publicando isto, e como". Aplicar um Set copia suas configurações para um novo rascunho.',
  'set.appliedOnce':
    'Um Set é lido uma vez, quando você o aplica. Editá-lo depois muda de onde o próximo post vai partir. Rascunhos e posts agendados que você já criou a partir dele permanecem exatamente como estão.',
  'set.empty.title': 'Ainda não há Sets',
  'set.empty.body': 'Crie um para parar de reconstruir a mesma lista de contas a cada post.',
  'set.create': 'Novo Set',
  'set.edit': 'Editar Set',
  'set.archive': 'Arquivar Set',
  'set.archived': 'Arquivado',
  'set.archivedNote':
    'Sets arquivados ficam ocultos no seletor. Posts feitos a partir deles não mudam.',
  'set.showArchived': 'Mostrar arquivados',
  'set.saved': 'Set salvo.',
  'set.archivedToast': 'Set arquivado. Posts já criados a partir dele não mudam.',

  'set.field.name': 'Nome',
  'set.field.nameHint': 'O que você vai procurar no seletor. Um por projeto.',
  'set.field.description': 'Descrição',
  'set.field.descriptionHint': 'Opcional. Para que este Set serve.',
  'set.field.targets': 'Contas',
  'set.field.targetsHint': 'Toda conta com a qual um post feito a partir deste Set começa.',
  'set.field.targetCount': '{count, plural, =0 {Nenhuma conta} one {# conta} other {# contas}}',
  'set.field.signature': 'Assinatura',
  'set.field.signatureNone': 'Sem assinatura',
  'set.field.approval': 'Aprovação',
  'set.field.approvalHint':
    'A aprovação que um post feito a partir deste Set precisa antes de poder publicar.',
  'set.field.schedule': 'Quando publicar',

  'set.approval.none': 'Nenhuma aprovação necessária',
  'set.approval.single_approver': 'Um aprovador designado',
  'set.approval.any_approver': 'Qualquer aprovador',
  'set.approval.named_approver': 'Um aprovador específico',
  'set.approval.policy_auto': 'O que a política do workspace disser',

  'set.slot.next_free_slot': 'Próximo horário livre da fila',
  'set.slot.next_free_slotHint':
    'Usa as regras de fila deste projeto para oferecer um horário. Ela propõe; você aceita.',
  'set.slot.pick_time': 'Peça um horário',
  'set.slot.pick_timeHint': 'Aplicar o Set deixa o horário em branco para você escolher.',
  'set.slot.draft_only': 'Deixar como rascunho',
  'set.slot.draft_onlyHint': 'Aplicar o Set não mexe no agendamento de forma alguma.',
  'set.slot.noRules':
    'Este projeto ainda não tem regras de fila, então a fila vai oferecer a primeira hora livre e dizer isso.',
  'set.slot.rulesLink': 'Regras de fila',

  'set.defaults.title': 'Padrões por plataforma',
  'set.defaults.body':
    'Valores iniciais copiados para cada novo post. Você pode mudar qualquer um deles no compositor depois.',
  'set.defaults.add': 'Adicionar uma plataforma',
  'set.defaults.remove': 'Remover padrões de {platform}',
  'set.defaults.privacy': 'Privacidade',
  'set.defaults.privacyNone': 'Padrão da plataforma',
  'set.defaults.bodyPrefix': 'Texto antes do post',
  'set.defaults.bodySuffix': 'Texto depois do post',
  'set.defaults.requireAltText': 'Exigir texto alternativo em toda imagem',
  'set.defaults.requireAltTextHint':
    'Um post feito a partir deste Set não pode ser agendado para esta plataforma até que toda imagem tenha texto alternativo.',
  'set.defaults.empty': 'Nenhum padrão por plataforma. Toda conta parte do post mestre.',

  'set.error.nameTaken': 'Outro Set neste projeto já usa esse nome.',
  'set.error.archived': 'Este Set está arquivado. Restaure-o antes de editar.',
  'set.error.duplicateTarget': 'Essa conta já está neste Set.',
  'set.error.duplicatePlatform': 'Este Set já tem padrões para essa plataforma.',

  /* --------------------------------------------------- contas lembradas */
  'targetMemory.setting.title': 'Lembrar contas entre posts',
  'targetMemory.setting.body':
    'Quando isto está ativado, o compositor começa cada novo post com as contas que a pessoa escolheu da última vez neste projeto. Está desativado a menos que você o ative.',
  'targetMemory.setting.stored':
    'Apenas a lista de contas é mantida, e apenas para a pessoa que as escolheu. Nenhuma legenda, horário, configuração de privacidade ou estado de aprovação é armazenado, e mais ninguém no projeto pode ver sua lista.',
  'targetMemory.setting.offNote': 'Enquanto isto está desativado, nada é armazenado.',
  'targetMemory.setting.turnOffWarning':
    'Desativar isto exclui toda seleção salva neste projeto, para todos.',
  'targetMemory.setting.enabled': 'Ativado',
  'targetMemory.setting.disabled': 'Desativado',
  'targetMemory.setting.saved': 'Configuração salva.',
  'targetMemory.setting.cleared':
    'Configuração salva. As seleções salvas neste projeto foram excluídas.',

  'targetMemory.composer.restored':
    '{count, plural, one {Começou com # conta da última vez.} many {Começou com # contas da última vez.} other {Começou com # contas da última vez.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {# conta que você usou da última vez ficou de fora porque precisa de atenção.} many {# contas que você usou da última vez ficaram de fora porque precisam de atenção.} other {# contas que você usou da última vez ficaram de fora porque precisam de atenção.}}',
  'targetMemory.composer.droppedAll':
    'Nenhuma das contas que você usou da última vez está disponível agora, então nada foi pré-selecionado.',
  'targetMemory.composer.undo': 'Limpar seleção',
  'targetMemory.composer.forget': 'Parar de lembrar minhas contas',
  'targetMemory.composer.forgotten': 'Sua seleção salva foi excluída.',
  'targetMemory.composer.reviewAccounts': 'Revisar contas',
} as const;
