/**
 * Bulk CSV import.
 *
 * Two groups of strings. The `import.error.*` keys are the ones the parser and
 * the apply step emit: they are stored on a row, rendered in the report and
 * written into the downloadable CSV, so they have to make sense to someone
 * reading a spreadsheet rather than a screen. Everything else is the wizard.
 *
 * The copy says drafts wherever drafts are what happens, and it says schedule
 * only on the step where a person chooses it. Nothing here promises that a post
 * reaches a platform.
 */
export const importMessages = {
  'import.title': 'Nhập bài đăng từ CSV',
  'import.subtitle':
    'Tải lên một bảng tính, xem trước những gì nó sẽ làm, rồi mới quyết định. Việc tải lên chỉ kiểm tra tệp. Nó không tạo ra bất cứ điều gì.',

  'import.step.upload': 'Tải lên',
  'import.step.columns': 'Cột',
  'import.step.review': 'Xem lại',
  'import.step.apply': 'Áp dụng',
  'import.step.results': 'Kết quả',
  'import.step.position': 'Bước {current} trên {total}',

  'import.upload.heading': 'Chọn một tệp CSV',
  'import.upload.help':
    'Chỉ CSV. Các tệp bảng tính như .xlsx không được đọc. Hãy xuất bảng tính của bạn dưới dạng CSV trước.',
  'import.upload.field': 'Tệp CSV',
  'import.upload.fieldHelp': 'Chọn một tệp, hoặc dán các dòng vào ô bên dưới.',
  'import.upload.paste': 'Hoặc dán văn bản CSV',
  'import.upload.pasteHelp': 'Bao gồm dòng tiêu đề. Mọi thứ được kiểm tra trước khi bất cứ điều gì được tạo.',
  'import.upload.project': 'Dự án',
  'import.upload.projectHelp': 'Mọi dòng trong một tệp đều thuộc về dự án này.',
  'import.upload.submit': 'Kiểm tra tệp này',
  'import.upload.submitting': 'Đang đọc tệp',
  'import.upload.allowPast': 'Cho phép thời điểm đã qua',
  'import.upload.allowPastHelp':
    'Mặc định tắt. Một dòng có ngày trong quá khứ sẽ được báo cáo để bạn tự sửa, thay vì bị tự động dời đi.',
  'import.upload.tooLarge': 'Tệp đó lớn hơn {limit} ký tự. Hãy chia nhỏ và thử lại.',
  'import.upload.duplicate':
    'Đây là cùng một tệp bạn đã tải lên trước đó, nên bạn đang xem lại lượt nhập đó thay vì một bản sao thứ hai.',

  'import.template.heading': 'Ý nghĩa của từng cột',
  'import.template.download': 'Tải mẫu CSV',
  'import.template.required': 'Cột bắt buộc',
  'import.template.optional': 'Cột tùy chọn',
  'import.column.external_row_id': 'Id riêng của bạn cho dòng đó. Nó phải là duy nhất trong tệp.',
  'import.column.project': 'Tên hoặc id dự án mà dòng đó thuộc về.',
  'import.column.targets':
    'Hoặc bắt đầu bằng set: theo sau là id của một Set tài khoản, hoặc các id tài khoản cách nhau bằng dấu gạch đứng.',
  'import.column.caption': 'Nội dung văn bản của bài đăng.',
  'import.column.scheduled_local_time': 'Ngày và giờ địa phương, viết theo dạng 2026-09-01T10:00.',
  'import.column.time_zone': 'Múi giờ IANA để đọc thời gian địa phương đó, ví dụ Europe/Berlin.',
  'import.column.media':
    'Một id phương tiện, sha256: theo sau là checksum của phương tiện bạn đã có, hoặc một địa chỉ https để máy chủ tải về.',
  'import.column.title': 'Một tiêu đề, khi nền tảng đích có dùng tiêu đề.',
  'import.column.destination': 'Trang, bảng hoặc kênh bên trong tài khoản.',
  'import.column.privacy': 'Giá trị quyền riêng tư mà nền tảng đích yêu cầu.',
  'import.column.first_comment': 'Văn bản được đăng làm bình luận đầu tiên sau bài đăng.',
  'import.column.approval_policy': 'Chính sách phê duyệt được gắn cho mỗi bản nháp.',
  'import.column.perPlatform':
    'Một cột caption_ hoặc title_ đặt tên theo một nền tảng sẽ chỉ ghi đè cho nền tảng đó, ví dụ caption_instagram.',

  'import.columns.heading': 'Kiểm tra cột',
  'import.columns.ok': 'Mọi cột bắt buộc đều có mặt.',
  'import.columns.missing': '{count, plural, other {# cột bắt buộc đang thiếu}}',
  'import.columns.unknown':
    '{count, plural, other {# cột không được nhận diện và bị bỏ qua}}',
  'import.columns.present': 'Các cột tìm thấy',

  'import.review.heading': 'Tệp này sẽ làm gì',
  'import.review.counts':
    '{valid, plural, =0 {Không có dòng nào sẵn sàng} other {# dòng sẵn sàng}}, {invalid, plural, =0 {không dòng nào cần chú ý} other {# dòng cần chú ý}}.',
  'import.review.empty': 'Không có dòng nào được đọc từ tệp này.',
  'import.review.rowsHeading': 'Các dòng',
  'import.review.filterAll': 'Tất cả các dòng',
  'import.review.filterValid': 'Sẵn sàng',
  'import.review.filterInvalid': 'Cần chú ý',
  'import.review.filterFailed': 'Thất bại',
  'import.review.downloadErrors': 'Tải các vấn đề dưới dạng CSV',
  'import.review.parsedWith': 'Đọc bằng bộ phân tích {version}',

  'import.table.row': 'Id dòng',
  'import.table.line': 'Dòng',
  'import.table.state': 'Trạng thái',
  'import.table.caption': 'Nội dung',
  'import.table.time': 'Đã lên lịch',
  'import.table.problems': 'Vấn đề',
  'import.table.draft': 'Bản nháp',
  'import.table.noProblems': 'Không có',

  'import.state.pending': 'Chưa kiểm tra',
  'import.state.valid': 'Sẵn sàng',
  'import.state.invalid': 'Cần chú ý',
  'import.state.applied': 'Đã tạo bản nháp',
  'import.state.skipped': 'Đã xong từ trước',
  'import.state.failed': 'Thất bại',

  'import.job.state.uploaded': 'Đã tải lên',
  'import.job.state.validating': 'Đang kiểm tra',
  'import.job.state.validated': 'Đã kiểm tra',
  'import.job.state.applying': 'Đang áp dụng',
  'import.job.state.applied': 'Đã áp dụng',
  'import.job.state.failed': 'Không thể đọc được',

  'import.apply.heading': 'Điều gì sẽ xảy ra với các dòng đã sẵn sàng?',
  'import.apply.drafts': 'Tạo bản nháp',
  'import.apply.draftsHelp':
    'Mặc định. Mỗi dòng sẵn sàng trở thành một bản nháp bạn có thể mở, chỉnh sửa và phê duyệt. Không có gì được lên lịch.',
  'import.apply.scheduled': 'Tạo bản nháp và lên lịch cho chúng',
  'import.apply.scheduledHelp':
    'Mỗi dòng sẵn sàng trở thành một bản nháp và lấy thời điểm được ghi trong tệp. Chỉ chọn mục này nếu các thời điểm đó là chính xác.',
  'import.apply.confirm': 'Áp dụng {count, plural, other {# dòng}}',
  'import.apply.confirmScheduled': 'Tạo và lên lịch {count, plural, other {# dòng}}',
  'import.apply.running': 'Đang áp dụng các dòng',
  'import.apply.safeToRepeat':
    'Áp dụng hai lần vẫn an toàn. Một dòng đã tạo bản nháp sẽ được để yên.',

  'import.results.heading': 'Kết quả',
  'import.results.applied': '{count, plural, other {# bản nháp đã tạo}}',
  'import.results.skipped': '{count, plural, other {# dòng đã xong từ trước}}',
  'import.results.failed': '{count, plural, other {# dòng thất bại}}',
  'import.results.retry': 'Áp dụng lại các dòng còn lại',
  'import.results.openDrafts': 'Mở các bản nháp',
  'import.results.unavailable': 'không khả dụng',

  'import.history.heading': 'Các lượt nhập trước đây',
  'import.history.empty': 'Chưa có lượt nhập nào.',
  'import.history.open': 'Mở',

  'import.a11y.rowsTable': 'Các dòng của tệp và các vấn đề của chúng',
  'import.a11y.stepList': 'Các bước nhập',
  'import.a11y.uploadedFile': 'Tệp đã chọn: {filename}',

  'import.error.emptyFile': 'Tệp đó không có dòng nào.',
  'import.error.missingColumn': 'Thiếu cột {column}.',
  'import.error.unknownColumn': 'Cột {column} không được nhận diện, nên nó bị bỏ qua.',
  'import.error.duplicateRowId': 'Id dòng {value} được dùng nhiều hơn một lần trong tệp này.',
  'import.error.required': 'Ô này không được để trống.',
  'import.error.invalidCell': 'Ô này không đúng định dạng chúng tôi có thể đọc.',
  'import.error.rowShape': 'Dòng này có {actual} ô nhưng tiêu đề có {expected}.',
  'import.error.invalidLocalTime':
    'Thời điểm {value} không phải là một ngày giờ địa phương như 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'Múi giờ {value} không phải là một tên múi giờ IANA.',
  'import.error.nonexistentLocalTime':
    'Thời điểm {value} không tồn tại tại {zone}. Đồng hồ nhảy qua nó.',
  'import.error.ambiguousLocalTime':
    'Thời điểm {value} xảy ra hai lần tại {zone} vào ngày đó. Hãy chọn một thời điểm khác.',
  'import.error.scheduleInPast': 'Thời điểm {value} tại {zone} đã qua.',
  'import.error.invalidTargets':
    'Giá trị {value} không phải là một Set tài khoản đã lưu hay danh sách id tài khoản.',
  'import.error.invalidMedia':
    'Giá trị {value} không phải là id phương tiện, checksum sha256 hay địa chỉ https.',
  'import.error.mediaNotFound': 'Không có phương tiện nào trong không gian làm việc này khớp với {value}.',
  'import.error.mediaImportStarted':
    'Phương tiện tại {value} đang được tải về. Hãy áp dụng tệp này lại khi nó đã có trong thư viện.',
  'import.error.unknownVariantTarget':
    'Dòng này không có tài khoản {provider}, nên nội dung dành cho {provider} không được dùng.',
  'import.error.applyFailed': 'Không thể áp dụng dòng này. Mã tham khảo: {code}.',
  'import.error.alreadyApplied': 'Dòng này đã tạo bản nháp từ trước, nên nó được để yên.',
  'import.error.tooManyRows': 'Chỉ {limit} dòng đầu tiên của một tệp được đọc.',
} as const;
