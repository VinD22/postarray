export const queueMessages = {
  'queue.title': 'Fila de publicações',
  'queue.subtitle':
    'Quando este projeto pode publicar, e com que intervalo. Nada é publicado sem uma pessoa aceitar o horário.',

  'queue.rules.heading': 'Regras da fila',
  'queue.rules.empty':
    'Ainda não há regras de fila. Até você adicionar uma, o próximo horário é simplesmente a primeira hora livre.',
  'queue.rules.create': 'Nova regra de fila',
  'queue.rules.count': '{count, plural, =0 {Nenhuma regra} one {# regra} other {# regras}}',
  'queue.rules.enabled': 'Em uso',
  'queue.rules.disabled': 'Pausada',
  'queue.rules.archived': 'Arquivada',
  'queue.rules.edit': 'Editar regra',
  'queue.rules.archive': 'Arquivar regra',
  'queue.rules.archiveHelp':
    'Arquivar interrompe novas propostas. Horários já reservados mantêm seu horário e seu motivo.',

  'queue.field.name': 'Nome da regra',
  'queue.field.nameHelp': 'Um nome que você vai reconhecer depois, por exemplo Manhãs de dia útil.',
  'queue.field.timeZone': 'Fuso horário',
  'queue.field.timeZoneHelp':
    'As janelas, a contagem diária e as datas de bloqueio são todas lidas neste fuso.',
  'queue.field.minimumGap': 'Intervalo mínimo',
  'queue.field.minimumGapHelp': 'Minutos entre dois posts. Zero significa nenhuma regra de espaçamento.',
  'queue.field.maximumPerDay': 'Máximo por dia',
  'queue.field.maximumPerDayHelp':
    'Deixe em branco para não ter limite diário. Zero significa que esta regra não propõe nada.',
  'queue.field.maximumPerDayUnlimited': 'Sem limite diário',
  'queue.field.priority': 'Prioridade',
  'queue.field.priorityHelp': 'A regra de maior prioridade que puder oferecer um horário é a usada.',
  'queue.field.enabled': 'Usar esta regra',

  'queue.windows.heading': 'Janelas semanais',
  'queue.windows.help':
    'Escolha os horários locais em que este projeto pode publicar. Use os campos de dia e hora, ou os botões na grade.',
  'queue.windows.empty': 'Ainda não há janelas. Uma regra sem janela nunca pode oferecer um horário.',
  'queue.windows.add': 'Adicionar janela',
  'queue.windows.remove': 'Remover janela',
  'queue.windows.entry': '{weekday}, das {start} às {end}',
  'queue.windows.start': 'De',
  'queue.windows.end': 'Até',
  'queue.windows.weekday': 'Dia',
  'queue.windows.toggleCell': '{weekday} às {hour}',
  'queue.windows.gridLabel': 'Disponibilidade semanal, um botão por dia e hora',

  'queue.weekday.1': 'Segunda-feira',
  'queue.weekday.2': 'Terça-feira',
  'queue.weekday.3': 'Quarta-feira',
  'queue.weekday.4': 'Quinta-feira',
  'queue.weekday.5': 'Sexta-feira',
  'queue.weekday.6': 'Sábado',
  'queue.weekday.7': 'Domingo',

  'queue.blackouts.heading': 'Datas bloqueadas',
  'queue.blackouts.help': 'Datas em que este projeto não vai publicar, lidas no fuso horário da regra.',
  'queue.blackouts.empty': 'Nenhuma data bloqueada.',
  'queue.blackouts.add': 'Adicionar bloqueio',
  'queue.blackouts.remove': 'Remover bloqueio',
  'queue.blackouts.from': 'Primeiro dia',
  'queue.blackouts.to': 'Último dia',
  'queue.blackouts.entry': '{from} até {to}',

  'queue.connections.heading': 'Contas',
  'queue.connections.all': 'Toda conta neste projeto',
  'queue.connections.scoped':
    '{count, plural, one {# conta} many {# contas} other {# contas}} às quais esta regra se aplica',

  'queue.slot.heading': 'Próximo horário da fila',
  'queue.slot.action': 'Usar o próximo horário da fila',
  'queue.slot.proposed': '{local} em {timeZone}',
  'queue.slot.utc': 'Isso é {utc} em UTC.',
  'queue.slot.why': 'Por que este horário',
  'queue.slot.accept': 'Usar este horário',
  'queue.slot.release': 'Escolher outro horário',
  'queue.slot.expires': 'Esta proposta é mantida até {expires}.',
  'queue.slot.unavailable': 'Um horário da fila está indisponível agora.',
  'queue.slot.pending': 'Buscando o próximo horário.',
  'queue.slot.accepted': 'Agendado para {local} em {timeZone}.',
  'queue.slot.notAutomatic': 'Nada é agendado até você escolher este horário.',

  'queue.reason.noRulesConfigured':
    'Este projeto não tem regras de fila configuradas, então nenhuma janela se aplicou.',
  'queue.reason.fallbackFirstFreeHour': 'A primeira hora livre a partir de agora foi usada.',
  'queue.reason.matchedRule': 'A regra {name} escolheu este horário, em {zone}.',
  'queue.reason.matchedWindow': 'Ele cai na janela das {start} às {end} em {zone}.',
  'queue.reason.minimumGap': 'Está a pelo menos {minutes} minutos de todo outro post.',
  'queue.reason.noMinimumGap': 'Esta regra não define intervalo mínimo entre posts.',
  'queue.reason.dailyCap': 'Aquele dia comporta no máximo {limit} posts, e não está cheio.',
  'queue.reason.dailyCapUnlimited': 'Esta regra não define limite diário.',
  'queue.reason.blackoutSkipped':
    '{days, plural, one {# dia bloqueado foi} many {# dias bloqueados foram} other {# dias bloqueados foram}} pulados para chegar até aqui.',
  'queue.reason.dstNonexistentSkipped':
    'O primeiro horário da janela não existe naquela data em {zone}, então o próximo que existe foi usado.',
  'queue.reason.dstAmbiguousFirst':
    'Esse horário local acontece duas vezes em {zone} naquela data. A primeira ocorrência foi usada.',
  'queue.reason.priorityChosen': 'Esta regra tem prioridade {priority}, a mais alta que pôde oferecer.',
  'queue.reason.connectionScoped':
    'Esta regra cobre {count, plural, one {# conta} many {# contas} other {# contas}}.',
  'queue.reason.horizonExhausted': 'Nenhuma janela ficou livre em {days} dias.',
} as const;
