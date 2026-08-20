/**
 * The weekly digest email. Only the `email.digest.*` keys are translated here
 * (the `digest.*` in-app keys are outside this locale's current coverage and
 * fall back to English).
 */
export const digestMessages = {
  'email.digest.subject': '{workspaceName}의 이번 주',
  'email.digest.intro':
    '{windowStart}부터 {windowEnd}까지 {workspaceName}에 대해 확인할 수 있는 내용입니다.',
  'email.digest.noData':
    '이번 주에는 아무것도 측정하지 못했습니다. 숫자가 없다면 값이 0이어서가 아니라 읽을 수 없었기 때문입니다.',
  'email.digest.footer':
    '{workspaceName}에서 주간 요약이 켜져 있기 때문에 이 메일을 받으셨습니다. 작업공간 설정에서 끌 수 있습니다.',
} as const;
