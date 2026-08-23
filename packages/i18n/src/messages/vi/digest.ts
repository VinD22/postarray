/** Vietnamese beta translations for the weekly digest and its email. */
export const digestMessages = {
  'digest.title': 'Tuần này',
  'digest.subtitle': 'Đây là những gì chúng tôi có thể thấy từ {windowStart} đến {windowEnd}.',
  'digest.empty': 'Chưa có gì để tóm tắt cho tuần này. Hãy đăng một nội dung và nội dung đó sẽ xuất hiện ở đây.',
  'digest.regenerate': 'Tạo lại tuần này',
  'digest.generating': 'Đang tạo bản tóm tắt tuần này',
  'digest.source.deterministic': 'Được viết từ hồ sơ đăng bài và các phép đo của bạn, không dùng trợ lý viết.',
  'digest.source.ai': 'Được trợ lý viết từ hồ sơ của bạn. Mọi con số đều đã được đối chiếu với hồ sơ đó.',
  'digest.unavailable.aiOff': 'Trợ lý viết đang tắt nên đây là phiên bản cơ bản. Không có gì bị thiếu.',
  'digest.unavailable.rejected': 'Phiên bản của trợ lý không khớp với dữ liệu nên đã bị loại bỏ. Đây là phiên bản cơ bản.',
  'digest.headline.published':
    '{published, plural, =0 {Không có bài đăng nào hoàn tất} one {Đã hoàn tất # bài đăng} other {Đã hoàn tất # bài đăng}} từ {windowStart} đến {windowEnd}.',
  'digest.headline.nothingPublished': 'Không có nội dung nào được đăng từ {windowStart} đến {windowEnd}.',
  'digest.outcome.published':
    '{count, plural, one {# bài đăng đã hoàn tất trên {provider}} other {# bài đăng đã hoàn tất trên {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {# bài đăng đã đến một số đích trên {provider} nhưng chưa đến các đích khác} other {# bài đăng đã đến một số đích trên {provider} nhưng chưa đến các đích khác}}.',
  'digest.outcome.failed':
    '{count, plural, one {# bài đăng không được đăng trên {provider}} other {# bài đăng không được đăng trên {provider}}}.',
  'digest.metrics.noneYet': 'Chưa có phép đo nào cho tuần này. Điều đó có nghĩa là chúng tôi chưa biết các bài đăng hoạt động ra sao, không phải chúng hoạt động kém.',
  'digest.freshness.statement':
    '{label, select, fresh {Các phép đo được đồng bộ lần cuối lúc {lastObservedAt}.} stale {Các phép đo chưa được đồng bộ từ {lastObservedAt}, nên những con số trên có thể đã cũ.} other {Chưa có gì được đồng bộ nên chưa có dữ liệu nào ở trên được đo.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Điều đáng biết: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Email tóm tắt hằng tuần',
  'digest.settings.description': 'Một email ngắn mỗi tuần về những gì đã đăng và những gì chúng tôi đo được. Bật theo mặc định.',
  'digest.settings.enabled': 'Gửi bản tóm tắt hằng tuần',
  'email.digest.subject': 'Tuần của bạn tại {workspaceName}',
  'email.digest.intro':
    'Đây là những gì chúng tôi có thể thấy được cho {workspaceName} từ {windowStart} đến {windowEnd}.',
  'email.digest.noData':
    'Chúng tôi không đo lường được gì trong tuần này. Khi một con số bị thiếu, đó là vì chúng tôi không đọc được nó, không phải vì nó bằng không.',
  'email.digest.footer':
    'Bạn nhận được email này vì bản tóm tắt hàng tuần đang bật cho {workspaceName}. Tắt tính năng này trong cài đặt không gian làm việc.',
} as const;
