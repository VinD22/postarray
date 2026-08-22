/** vi beta catalog namespace. */
export const statusMessages = {
  'empty.calendar.title': 'Chưa có lịch trình nào',
  'empty.calendar.body':
    'Viết bài đăng đầu tiên của bạn và chọn thời gian. Bạn có thể thay đổi nó sau.',
  'empty.calendar.action': 'Soạn một bài viết',
  'empty.drafts.title': 'Không có bản nháp',
  'empty.drafts.body':
    'Các bản nháp bạn lưu sẽ xuất hiện ở đây cùng với mục tiêu và vấn đề của chúng.',
  'empty.connections.title': 'Không có tài khoản nào được kết nối',
  'empty.connections.body':
    'Kết nối một tài khoản để xuất bản lên nó. Trước tiên, chúng tôi sẽ hiển thị cho bạn các quyền chính xác.',
  'empty.connections.action': 'Kết nối một tài khoản',
  'empty.analytics.title': 'Chưa có số liệu nào',
  'empty.analytics.body':
    'Số liệu xuất hiện sau khi bài đăng đầu tiên của bạn tồn tại đủ lâu để nền tảng báo cáo về bài đăng đó.',
  'empty.analytics.noPermission':
    'Tài khoản này chưa được cấp quyền truy cập phân tích. Kết nối lại để thêm nó.',
  'empty.approvals.title': 'Không có gì chờ đợi bạn',
  'empty.approvals.body': 'Yêu cầu phê duyệt cho dự án của bạn xuất hiện ở đây.',
  'empty.library.title': 'Thư viện của bạn trống',
  'empty.library.body': 'Tải hình ảnh và video lên hoặc nhập chúng từ URL hoặc API.',
  'empty.library.action': 'Tải lên phương tiện',
  'empty.automation.title': 'Chưa có quy tắc nào',
  'empty.automation.body':
    'Một quy tắc phản ứng với một cái gì đó và đề xuất một hành động. Mọi quy tắc đều hiển thị giới hạn của nó trước khi bạn bật nó lên.',
  'empty.webhooks.title': 'Không có điểm cuối',
  'empty.webhooks.body': 'Thêm điểm cuối để nhận các sự kiện đã ký về xuất bản và kết nối.',
  'empty.searchResults.title': 'Không có kết quả nào cho {query}',
  'empty.searchResults.body': 'Kiểm tra chính tả hoặc xóa bộ lọc.',
  'empty.filtered.title': 'Không có gì phù hợp với các bộ lọc này',
  'empty.filtered.action': 'Xóa bộ lọc',
  'empty.auditLog.title': 'Chưa có hoạt động nào',
  'empty.receipts.title': 'Chưa có biên lai',
  'empty.receipts.body': 'Mỗi ấn phẩm đều tạo ra một biên nhận mà bạn có thể kiểm tra và chia sẻ.',
  'loading.default': 'Đang tải',
  'loading.calendar': 'Đang tải lịch của bạn',
  'loading.analytics': 'Đang tải số liệu',
  'loading.preview': 'Xây dựng bản xem trước',
  'loading.validating': 'Kiểm tra giới hạn nền tảng hiện tại',
  'loading.publishing': 'Xuất bản lên {provider}',
  'loading.uploading': 'Đang tải lên {name}',
  'loading.uploadProgress': '{percent} đã tải lên',
  'loading.connecting': 'Đang kết nối với {provider}',
  'loading.savingDraft': 'Đang lưu bản nháp của bạn',
  'loading.generatingPlan': 'Xây dựng kế hoạch của bạn',
  'loading.longRunning': 'Quá trình này mất nhiều thời gian hơn bình thường. Nó vẫn đang chạy.',
  'offline.banner': 'Bạn đang ngoại tuyến. Những thay đổi được lưu giữ trên thiết bị này.',
  'offline.draftSafe': 'Dự thảo của bạn được an toàn. Nó đồng bộ khi bạn trực tuyến trở lại.',
  'offline.publishDisabled': 'Xuất bản cần có sự kết nối. Điều này sẽ không được xếp hàng âm thầm.',
  'offline.scheduleQueued':
    'Yêu cầu lịch trình này được xếp hàng đợi trên thiết bị này và sẽ được gửi khi bạn trực tuyến trở lại.',
  'offline.reconnected': 'Trở lại trực tuyến. Đang đồng bộ hóa các thay đổi của bạn.',
  'offline.syncConflict':
    'Một số thay đổi không thể được hợp nhất tự động. Hãy xem lại chúng trước khi lưu.',
  'permission.denied.title': 'Bạn không có quyền truy cập vào cái này',
  'permission.denied.role': 'Điều này cần có vai trò {role}. Bạn là {currentRole}.',
  'permission.denied.scope': 'Thông tin xác thực này cần có phạm vi {scope}.',
  'permission.denied.contactOwner': 'Hãy yêu cầu {owner} cấp nó.',
  'permission.denied.projectScope': 'Quyền truy cập của bạn bị giới hạn ở {projects}.',
  'permission.readOnly': 'Không gian làm việc này hiện chỉ được đọc.',
  'permission.mfaRequired': 'Xác nhận bằng xác thực hai yếu tố để tiếp tục.',
  'rateLimit.title': 'Chậm lại một lát',
  'rateLimit.body': 'Bạn đã thực hiện các yêu cầu {count} trong {window}. Giới hạn là {limit}.',
  'rateLimit.resetsAt': 'Điều này đặt lại ở {time}.',
  'rateLimit.cheaperAlternative':
    'Lập kế hoạch thay vì xuất bản bây giờ sẽ tránh được giới hạn này.',
  'rateLimit.providerCost':
    '{provider} tính phí cho mỗi hoạt động. Hành động này được ước tính ở mức {amount}.',
  'incident.providerDegraded':
    '{provider} đang gặp sự cố. Bài viết theo lịch trình tiếp tục thử lại.',
  'incident.providerDown':
    '{provider} không có sẵn. Không có gì bị mất và không có gì bị trùng lặp.',
  'incident.isolated': 'Các nền tảng khác không bị ảnh hưởng.',
  'incident.statusPage': 'Trạng thái trực tiếp theo đầu nối và bề mặt',
  'incident.startedAt': 'Đã bắt đầu {relativeTime}',
  'translation.incomplete':
    'Một số văn bản trên màn hình này chưa được dịch sang {language} và được hiển thị bằng tiếng Anh.',
  'translation.beta':
    'Ngôn ngữ này đang trong giai đoạn thử nghiệm. Báo cáo bất cứ điều gì đọc sai.',
  'confirm.discardChanges.title': 'Hủy thay đổi của bạn?',
  'confirm.discardChanges.body': 'Điều này không thể hoàn tác được.',
  'confirm.deleteItem.title': 'Xóa {name}?',
  'confirm.deleteItem.body': 'Điều này không thể hoàn tác được.',
  'confirm.cancelScheduled.title': 'Hủy bài đăng đã lên lịch này?',
  'confirm.cancelScheduled.body':
    'Nó sẽ không xuất bản. Bản nháp vẫn ở đây nên bạn có thể lên lịch lại.',
  'confirm.publishNow.title': 'Xuất bản bây giờ?',
  'confirm.publishNow.body':
    '{count, plural, one {This publishes to # account immediately} other {This publishes to # accounts immediately}}. It cannot be recalled from Relay.',
  'confirm.typeToConfirm': 'Nhập {word} để xác nhận.',
} as const;
