/**
 * The weekly digest email. Only the `email.digest.*` keys are translated here
 * (the `digest.*` in-app keys are outside this locale's current coverage and
 * fall back to English).
 */
export const digestMessages = {
  'email.digest.subject': 'Ang iyong linggo sa {workspaceName}',
  'email.digest.intro':
    'Ito ang nakikita namin para sa {workspaceName} mula {windowStart} hanggang {windowEnd}.',
  'email.digest.noData':
    'Wala kaming naisukat ngayong linggo. Kung may kulang na numero, kulang ito dahil hindi namin ito nabasa, hindi dahil zero ito.',
  'email.digest.footer':
    'Natatanggap mo ito dahil naka-on ang weekly summary para sa {workspaceName}. I-off ito sa mga setting ng workspace.',
} as const;
