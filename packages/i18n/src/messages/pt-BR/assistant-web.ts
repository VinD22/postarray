/**
 * A tela do assistente no aplicativo web.
 *
 * Quem lê esta tela é alguém que publica, não alguém que opera software. Cada
 * frase aqui é escrita para essa pessoa: diz o que o assistente está
 * oferecendo, diz claramente que uma sugestão é uma sugestão e, antes de
 * escrever qualquer coisa, diz exatamente o que vai acontecer, em quais contas,
 * com qual texto e a que horas, no fuso horário do próprio espaço de trabalho.
 *
 * Nada neste espaço de nomes promete uma ação que ainda não aconteceu, e nada
 * dá a entender que o assistente possa agir por conta própria.
 */
export const assistantWebMessages = {
  'assistantWeb.title': 'Assistente',
  'assistantWeb.subtitle': 'Diga o que você quer. Ele sugere, você decide, nada acontece sozinho.',

  'assistantWeb.empty.title': 'Diga o que você quer, com suas próprias palavras.',
  'assistantWeb.empty.body':
    'Ele pode planejar uma semana de publicações, sugerir outras formas de começar uma, dizer o que vai sair e deixar uma publicação pronta para você aprovar. Ele nunca publica nada sozinho.',
  'assistantWeb.empty.promptsLabel': 'O que as pessoas costumam pedir',
  'assistantWeb.empty.promptPlan': 'Planeje minha semana de publicações.',
  'assistantWeb.empty.promptWeek': 'O que sai esta semana?',
  'assistantWeb.empty.promptFailures': 'Alguma publicação falhou?',
  'assistantWeb.empty.promptCaption': 'Sugira outra forma de começar esta publicação.',
  'assistantWeb.empty.reassurance':
    'Você pode mudar de ideia a qualquer momento. Nada é escrito até você aprovar.',

  'assistantWeb.input.label': 'O que você gostaria de fazer?',
  'assistantWeb.input.placeholder':
    'Peça um plano, um texto de abertura ou o que vai sair esta semana.',
  'assistantWeb.input.send': 'Enviar',
  'assistantWeb.input.hint': 'Palavras simples funcionam melhor. Não há nada para aprender.',

  'assistantWeb.turn.you': 'Você',
  'assistantWeb.turn.assistant': 'Assistente',
  'assistantWeb.turn.working': 'Lendo seu espaço de trabalho e escrevendo uma resposta.',
  'assistantWeb.turn.workingNote': 'Nada mudou enquanto isto é executado.',
  'assistantWeb.turn.suggestionBadge': 'Sugestão',
  'assistantWeb.turn.suggestionNote': 'Isto é uma sugestão, não um registro do que aconteceu.',
  'assistantWeb.turn.provenance': 'Sugerido por {provider} {model}.',
  'assistantWeb.turn.degraded':
    'Escrito desta vez a partir das suas próprias configurações, sem o modelo de redação.',

  'assistantWeb.subject.label': 'A publicação a que isto se refere',
  'assistantWeb.subject.none': 'Nenhuma publicação escolhida ainda.',
  'assistantWeb.subject.choose': 'Escolha uma publicação',
  'assistantWeb.subject.needed': 'Escolha a qual publicação você se refere e pergunte de novo.',
  'assistantWeb.subject.untitled': 'Publicação sem título',
  'assistantWeb.subject.composerOnly':
    'Isto é feito no compositor, onde você pode ver a publicação como cada conta vai exibi-la.',
  'assistantWeb.subject.openComposer': 'Abrir no compositor',

  'assistantWeb.confirm.title': 'Antes que algo aconteça',
  'assistantWeb.confirm.body':
    'Nada foi escrito ainda. Leia isto e aprove apenas se for o que você quer.',
  'assistantWeb.confirm.accountsLabel': 'Contas que isto alcança',
  'assistantWeb.confirm.accountsUnavailable': 'Quais contas isto alcança não está disponível.',
  'assistantWeb.confirm.accountCount':
    '{count, plural, one {# conta} other {# contas} many {# contas}}',
  'assistantWeb.confirm.textLabel': 'O texto',
  'assistantWeb.confirm.textUnavailable': 'Esta ação não altera nenhum texto.',
  'assistantWeb.confirm.timeLabel': 'O horário',
  'assistantWeb.confirm.timeValue': '{dateTime} ({timeZone})',
  'assistantWeb.confirm.timeUnavailable': 'Esta ação não define um horário.',
  'assistantWeb.confirm.zoneNote':
    'Os horários são mostrados no fuso horário do seu espaço de trabalho.',
  'assistantWeb.confirm.noteLabel': 'Observação para quem aprovar',
  'assistantWeb.confirm.expires': 'Esta aprovação expira em {dateTime}.',
  'assistantWeb.confirm.approve': 'Aprovar e executar',
  'assistantWeb.confirm.cancel': 'Agora não',
  'assistantWeb.confirm.cancelled': 'Cancelado. Nada foi escrito.',
  'assistantWeb.confirm.applied': 'Pronto. Você aprovou, então foi executado.',
  'assistantWeb.confirm.openConfirmation': 'Abrir a tela completa de aprovação',
  'assistantWeb.confirm.proposalTitle': 'Apenas uma proposta',
  'assistantWeb.confirm.working': 'Aprovando. Não feche esta tela.',

  'assistantWeb.overBudget.title': 'Este espaço de trabalho usou toda a sua cota de IA do mês.',
  'assistantWeb.overBudget.body':
    'O assistente não pode escrever mais nada até a cota recomeçar. Nada do que você já criou é afetado, e você ainda pode escrever, agendar e publicar por conta própria.',
  'assistantWeb.overBudget.reset': 'A cota recomeça em {dateTime}.',
  'assistantWeb.overBudget.resetUnknown': 'Não temos uma data para quando ela recomeça.',
  'assistantWeb.overBudget.compose': 'Escreva você mesmo uma publicação',

  'assistantWeb.result.planTitle': 'Uma semana sugerida. Nada está agendado.',
  'assistantWeb.result.planSlot': 'Dia {day} às {time}',
  'assistantWeb.result.planEmpty': 'Nenhuma publicação foi sugerida.',
  'assistantWeb.result.weekTitle': 'O que está agendado',
  'assistantWeb.result.weekEmpty': 'Nada está agendado para esse período.',
  'assistantWeb.result.weekMore': 'Há mais do que isto. O calendário mostra tudo.',
  'assistantWeb.result.openCalendar': 'Abrir o calendário',
  'assistantWeb.result.failuresTitle': 'O que falhou, e o motivo registrado na ocasião',
  'assistantWeb.result.failuresEmpty': 'Nada falhou.',
  'assistantWeb.result.captionsTitle': 'Outras formas de começar esta publicação',
  'assistantWeb.result.captionsEmpty': 'Nenhuma outra abertura foi sugerida.',
  'assistantWeb.result.copy': 'Copiar este texto',
  'assistantWeb.result.copied': 'Copiado.',

  'assistantWeb.error.title': 'Isso não foi executado.',
  'assistantWeb.error.body': 'Nada foi alterado. Você pode perguntar de novo.',
  'assistantWeb.error.retry': 'Perguntar de novo',
} as const;
