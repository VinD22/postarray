/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Configurar Post Array',
  'onboarding.progress': 'Etapa {current} de {total}',
  'onboarding.skipForNow': 'Pule por agora',
  'onboarding.goal': 'Uma publicação agendada verificada em menos de dez minutos.',

  'onboarding.plan.title': 'Escolha como deseja pagar',
  'onboarding.plan.help': 'Um plano, todos os recursos. Altere o intervalo sempre que desejar.',

  'onboarding.workspace.title': 'Nomeie seu espaço de trabalho',
  'onboarding.workspace.namePlaceholder': 'Nome da sua empresa ou cliente',
  'onboarding.workspace.timeZone': 'Fuso horário para agendamento',
  'onboarding.workspace.timeZoneHelp':
    'Todo horário programado é armazenado nesta zona, portanto, uma mudança de relógio nunca move sua publicação por acidente.',
  'onboarding.workspace.locale': 'Idioma da interface',

  'onboarding.role.title': 'O que melhor descreve você?',
  'onboarding.role.creator': 'Criador',
  'onboarding.role.team': 'Equipe interna',
  'onboarding.role.agency': 'Agência',
  'onboarding.role.developer': 'Desenvolvedor ou agente construtor',
  'onboarding.role.help': 'Isso altera os padrões que sugerimos. Você pode mudar tudo mais tarde.',

  'onboarding.connect.title': 'Conecte sua primeira conta',
  'onboarding.connect.help':
    'Mostraremos exatamente quais permissões cada plataforma é solicitada antes de você aprovar qualquer coisa.',
  'onboarding.connect.skipNote':
    'Você pode explorar primeiro com a conta de exemplo. Nada é publicado a partir dele.',
  'onboarding.connect.success': '{account} está conectado.',

  'onboarding.content.title': 'Comece com algo que você já tem',
  'onboarding.content.useAsset': 'Use uma imagem ou vídeo',
  'onboarding.content.useBrief': 'Comece com um breve resumo',
  'onboarding.content.useText': 'Escreva você mesmo',

  'onboarding.preview.title': 'Isso é o que irá publicar',
  'onboarding.preview.help': 'Uma prévia real das regras da plataforma para esta conta.',

  'onboarding.schedule.title': 'Escolha quando sair',
  'onboarding.schedule.help':
    'Revise o horário, a configuração de privacidade, a divulgação e o custo estimado do provedor.',

  'onboarding.done.title': 'Agendado',
  'onboarding.done.body': 'Sua publicação está agendada para {time} em {timeZone}.',
  'onboarding.done.nextStep.title': 'O que fazer a seguir',
  'onboarding.done.nextStep.connectMore': 'Conectar outra conta',
  'onboarding.done.nextStep.inviteTeam': 'Convide um colega de equipe',
  'onboarding.done.nextStep.setApproval': 'Definir uma política de aprovação',
  'onboarding.done.nextStep.exploreApi': 'Explore a API e o servidor MCP',

  'onboarding.checklist.title': 'Primeiros passos',
  'onboarding.checklist.connectAccount': 'Conecte uma conta',
  'onboarding.checklist.firstPost': 'Publique ou agende uma publicação',
  'onboarding.checklist.inviteTeammate': 'Convide um colega de equipe',
  'onboarding.checklist.setProjectVoice': 'Descreva a voz do projeto',
  'onboarding.checklist.tryAutomation': 'Tente uma regra de automação',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Tudo concluído} one {# passo à esquerda} other {# passos à esquerda} many {# passos à esquerda}}',
} as const;
