/**
 * The comparison pages' chrome.
 *
 * What belongs here: state words, section headings, labels, and the three
 * disclosure sentences whose numbers are read at render time from the code
 * that decides them. What deliberately does not: the claims themselves. A
 * comparison table is several hundred words of dated, sourced content per
 * page, and the English catalog is merged into one object that every page load
 * resolves, so those claims live in typed modules under
 * `apps/web/src/features/comparisons/entries` and are loaded per slug.
 *
 * The `web.compare.*` namespace is the older `/compare` index. This namespace
 * is the per comparison page, kept separate so the index copy that beta locales
 * already carry is not disturbed.
 */
export const webComparisonMessages = {
  'web.comparison.eyebrow': 'So sánh',

  'web.comparison.state.yes': 'Có',
  'web.comparison.state.no': 'Không',
  'web.comparison.state.partial': 'Một phần',
  'web.comparison.state.notVerified': 'Chưa xác minh',

  'web.comparison.label.claim': 'Nhận định',
  'web.comparison.label.sourceRead': 'Đọc {date}',
  'web.comparison.label.checked': 'Mọi dòng đã kiểm tra {date}',
  'web.comparison.label.nextReview': 'Lần kiểm tra tiếp theo vào {date}',
  'web.comparison.label.backToIndex': 'Tất cả bài so sánh',

  'web.comparison.table.title': 'Mỗi lựa chọn làm được gì',
  'web.comparison.table.caption': 'Một nhận định trên mỗi dòng, kèm nguồn đứng sau mỗi câu trả lời',

  'web.comparison.bestFor.title': 'Cái nào phù hợp',
  'web.comparison.bestFor.ours': 'Chọn sản phẩm này khi',
  'web.comparison.bestFor.alternative': 'Chọn {name} khi',

  'web.comparison.notDo.title': 'Những gì sản phẩm này không làm',
  'web.comparison.notDo.body':
    'Những câu này được đọc từ mã nguồn quyết định chúng, không phải gõ tay, nên mục này không thể lệch khỏi thực tế của sản phẩm hôm nay.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {Chưa có kết nối nào hoàn tất xác minh nhà cung cấp, nên hiện tại chưa có gì được đăng lên bất kỳ nền tảng nào qua sản phẩm này.} other {# kết nối đã hoàn tất xác minh nhà cung cấp. Mọi nền tảng khác trong nhóm khởi động vẫn chỉ đang được dự định.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {Chưa có ngôn ngữ nào hoàn tất việc rà soát bởi con người, nên mọi ngôn ngữ trong giao diện đều được gắn nhãn thử nghiệm.} other {# ngôn ngữ đã hoàn tất việc rà soát bởi con người. Mọi ngôn ngữ khác đều được gắn nhãn thử nghiệm.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Mọi gói giá đều đã được quyết định và có mức giá thực tế.} other {# gói giá vẫn là chỗ giữ chỗ chưa quyết định và chưa thể mua.}}',

  'web.comparison.notVerified.title': 'Chưa xác minh nghĩa là gì',
  'web.comparison.notVerified.body':
    'Một ô ghi chưa xác minh khi sự thật đó không thể đọc được từ tài liệu công khai chính thức của lựa chọn kia vào ngày kiểm tra. Nó không bao giờ được điền theo trí nhớ, và không bao giờ được sao chép từ một bản tóm tắt do người khác viết.',

  'web.comparison.method.title': 'Trang này được làm ra như thế nào',
  'web.comparison.method.body':
    'Mỗi dòng là một nhận định, kèm tài liệu mà nó bắt nguồn và ngày một người đã đọc tài liệu đó. Không có ảnh chụp màn hình đối thủ, không có câu chữ tính năng sao chép và không có điểm yếu nào được bịa ra.',
  'web.comparison.method.cadence':
    'Mỗi bài so sánh được kiểm tra lại ít nhất một lần mỗi 90 ngày, và ngay lập tức khi một nền tảng hay một lựa chọn thay đổi điều gì đó mà một dòng đã ghi nhận.',

  'web.comparison.questions.title': 'Câu hỏi',
  'web.comparison.sources.title': 'Nguồn được trích dẫn trên trang này',

  'web.comparison.index.title': 'Các bài so sánh đã đăng',
  'web.comparison.index.body':
    'Mỗi trang so sánh sản phẩm này với một nhóm lựa chọn thay thế mà sự thật của chúng có thể đọc được từ tài liệu chính thức. Một sản phẩm được nêu tên có trang riêng khi sự thật hiện tại của nó có thể đọc được từ chính các trang công khai của nó, và không phải trước đó.',
  'web.comparison.index.checked': 'Đã kiểm tra {date}',
} as const;
