/**
 * The weekly digest email. Only the `email.digest.*` keys are translated here
 * (the `digest.*` in-app keys are outside this locale's current coverage and
 * fall back to English).
 */
export const digestMessages = {
  'email.digest.subject': 'Tuần của bạn tại {workspaceName}',
  'email.digest.intro':
    'Đây là những gì chúng tôi có thể thấy được cho {workspaceName} từ {windowStart} đến {windowEnd}.',
  'email.digest.noData':
    'Chúng tôi không đo lường được gì trong tuần này. Khi một con số bị thiếu, đó là vì chúng tôi không đọc được nó, không phải vì nó bằng không.',
  'email.digest.footer':
    'Bạn nhận được email này vì bản tóm tắt hàng tuần đang bật cho {workspaceName}. Tắt tính năng này trong cài đặt không gian làm việc.',
} as const;
