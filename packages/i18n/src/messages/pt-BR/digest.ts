/** Weekly digest copy for Brazilian Portuguese. */
export const digestMessages = {
  'digest.title': 'Esta semana',
  'digest.subtitle': 'O que conseguimos ver de {windowStart} a {windowEnd}.',
  'digest.empty':
    'Ainda não há nada para resumir nesta semana. Publique algo e isso aparecerá aqui.',
  'digest.regenerate': 'Reconstruir o resumo desta semana',
  'digest.generating': 'Criando o resumo desta semana',
  'digest.source.deterministic':
    'Escrito com base nos seus registros de publicação e nas suas próprias medições, sem o assistente de escrita.',
  'digest.source.ai':
    'Escrito pelo assistente com base nos seus próprios registros. Cada número foi conferido neles.',
  'digest.unavailable.aiOff':
    'O assistente de escrita está desativado, então esta é a versão simples. Nada está faltando.',
  'digest.unavailable.rejected':
    'A versão do assistente não correspondeu aos seus dados e foi descartada. Esta é a versão simples.',
  'digest.headline.published':
    '{published, plural, =0 {Nenhuma publicação foi concluída} one {# publicação foi concluída} other {# publicações foram concluídas}} entre {windowStart} e {windowEnd}.',
  'digest.headline.nothingPublished':
    'Nada foi publicado entre {windowStart} e {windowEnd}.',
  'digest.outcome.published':
    '{count, plural, one {# publicação foi concluída em {provider}} many {# publicações foram concluídas em {provider}} other {# publicações foram concluídas em {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {# publicação chegou a alguns destinos em {provider}, mas não a outros} many {# publicações chegaram a alguns destinos em {provider}, mas não a outros} other {# publicações chegaram a alguns destinos em {provider}, mas não a outros}}.',
  'digest.outcome.failed':
    '{count, plural, one {# publicação não foi enviada em {provider}} many {# publicações não foram enviadas em {provider}} other {# publicações não foram enviadas em {provider}}}.',
  'digest.metrics.noneYet':
    'Nenhuma medição chegou nesta semana. Isso significa que não sabemos como essas publicações tiveram desempenho, não que tiveram um desempenho ruim.',
  'digest.freshness.statement':
    '{label, select, fresh {As medições foram sincronizadas pela última vez às {lastObservedAt}.} stale {As medições não são sincronizadas desde {lastObservedAt}, então os números acima podem estar desatualizados.} other {Nada foi sincronizado ainda, então nada acima foi medido.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Vale saber: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Resumo semanal por e-mail',
  'digest.settings.description':
    'Um e-mail curto toda semana com o que foi publicado e o que conseguimos medir. Ativado por padrão.',
  'digest.settings.enabled': 'Enviar o resumo semanal',
  'email.digest.subject': 'Sua semana em {workspaceName}',
  'email.digest.intro':
    'Veja o que conseguimos observar em {workspaceName} entre {windowStart} e {windowEnd}.',
  'email.digest.noData':
    'Não conseguimos medir nada nesta semana. Quando um número está ausente, é porque não conseguimos lê-lo, não porque era zero.',
  'email.digest.footer':
    'Você recebe isto porque o resumo semanal está ativado para {workspaceName}. Desative-o nas configurações do espaço de trabalho.',
} as const;
