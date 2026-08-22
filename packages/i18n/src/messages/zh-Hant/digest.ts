/**
 * The weekly digest email. Only the `email.digest.*` keys are translated here
 * (the `digest.*` in-app keys are outside this locale's current coverage and
 * fall back to English).
 */
export const digestMessages = {
  'email.digest.subject': '你在 {workspaceName} 的這一週',
  'email.digest.intro':
    '以下是我們在 {windowStart} 到 {windowEnd} 期間，於 {workspaceName} 觀察到的內容。',
  'email.digest.noData':
    '我們這週未能測得任何數據。若某個數字缺漏，是因為我們無法讀取它，而不是因為它是零。',
  'email.digest.footer':
    '你收到此郵件是因為 {workspaceName} 已啟用每週摘要功能。可在工作區設定中關閉。',
} as const;
