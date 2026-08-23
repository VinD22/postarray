/** Korean beta translations for the weekly digest and its email. */
export const digestMessages = {
  'digest.title': '이번 주',
  'digest.subtitle': '{windowStart}부터 {windowEnd}까지 확인할 수 있는 내용입니다.',
  'digest.empty': '이번 주에는 아직 요약할 내용이 없습니다. 게시물을 올리면 여기에 표시됩니다.',
  'digest.regenerate': '이번 주 다시 만들기',
  'digest.generating': '이번 주 요약을 만드는 중',
  'digest.source.deterministic': '게시 기록과 자체 측정값만으로 작성했으며 글쓰기 도우미는 사용하지 않았습니다.',
  'digest.source.ai': '도우미가 자체 기록을 바탕으로 작성했습니다. 모든 숫자는 기록과 대조했습니다.',
  'digest.unavailable.aiOff': '글쓰기 도우미가 꺼져 있어 일반 버전으로 표시됩니다. 빠진 내용은 없습니다.',
  'digest.unavailable.rejected': '도우미 버전이 데이터와 일치하지 않아 폐기되었습니다. 일반 버전으로 표시합니다.',
  'digest.headline.published':
    '{published, plural, =0 {완료된 게시물이 없습니다} one {게시물 #개가 완료되었습니다} other {게시물 #개가 완료되었습니다}} 기간: {windowStart}~{windowEnd}.',
  'digest.headline.nothingPublished': '{windowStart}부터 {windowEnd} 사이에 게시된 내용이 없습니다.',
  'digest.outcome.published':
    '{count, plural, one {플랫폼 {provider}에서 게시물 #개가 완료되었습니다} other {플랫폼 {provider}에서 게시물 #개가 완료되었습니다}}.',
  'digest.outcome.partial':
    '{count, plural, one {플랫폼 {provider}에서 게시물 #개가 일부 대상에 도달했지만 다른 대상에는 도달하지 않았습니다} other {플랫폼 {provider}에서 게시물 #개가 일부 대상에 도달했지만 다른 대상에는 도달하지 않았습니다}}.',
  'digest.outcome.failed':
    '{count, plural, one {플랫폼 {provider}에서 게시물 #개가 게시되지 않았습니다} other {플랫폼 {provider}에서 게시물 #개가 게시되지 않았습니다}}.',
  'digest.metrics.noneYet':
    '이번 주 측정값은 아직 도착하지 않았습니다. 이는 게시물의 성과가 나빴다는 뜻이 아니라 성과를 아직 알 수 없다는 뜻입니다.',
  'digest.freshness.statement':
    '{label, select, fresh {측정값은 {lastObservedAt}에 마지막으로 동기화되었습니다.} stale {측정값은 {lastObservedAt} 이후 동기화되지 않아 위 숫자가 오래되었을 수 있습니다.} other {아직 동기화된 내용이 없어 위에 측정된 값이 없습니다.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': '알아둘 점: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': '주간 요약 이메일',
  'digest.settings.description': '게시된 내용과 측정할 수 있었던 내용을 담은 짧은 이메일을 매주 보냅니다. 기본으로 켜져 있습니다.',
  'digest.settings.enabled': '주간 요약 보내기',
  'email.digest.subject': '{workspaceName}의 이번 주',
  'email.digest.intro':
    '{windowStart}부터 {windowEnd}까지 {workspaceName}에 대해 확인할 수 있는 내용입니다.',
  'email.digest.noData':
    '이번 주에는 아무것도 측정하지 못했습니다. 숫자가 없다면 값이 0이어서가 아니라 읽을 수 없었기 때문입니다.',
  'email.digest.footer':
    '{workspaceName}에서 주간 요약이 켜져 있기 때문에 이 메일을 받으셨습니다. 작업공간 설정에서 끌 수 있습니다.',
} as const;
