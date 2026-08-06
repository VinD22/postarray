/** vi beta catalog namespace. */
export const stateMessages = {
  'state.draft.label': 'bản nháp',
  'state.draft.description':
    'Chỉ những người trong không gian làm việc này mới có thể nhìn thấy nó. Không có gì được lên lịch.',
  'state.validation_needed.label': 'Cần xác thực',
  'state.validation_needed.description':
    'Một hoặc nhiều mục tiêu có vấn đề cần phải được khắc phục trước khi có thể lên lịch.',
  'state.approval_requested.label': 'Đã yêu cầu phê duyệt',
  'state.approval_requested.description': 'Đang chờ {approver} quyết định.',
  'state.approved.label': 'Đã được phê duyệt',
  'state.approved.description':
    'Được phê duyệt bởi {approver}. Bây giờ nó có thể được lên lịch hoặc xuất bản.',
  'state.scheduled.label': 'Đã lên lịch',
  'state.scheduled.description': 'Xuất bản {time} trong {timeZone}.',
  'state.preparing_media.label': 'Chuẩn bị phương tiện',
  'state.preparing_media.description': 'Tải lên và chuyển đổi tập tin cho nền tảng.',
  'state.dispatching.label': 'điều phối',
  'state.dispatching.description': 'Đang gửi tới {provider} ngay bây giờ.',
  'state.provider_processing.label': 'Xử lý nhà cung cấp',
  'state.provider_processing.description':
    '{provider} đã chấp nhận tải lên và vẫn đang xử lý nó. Chúng tôi xác nhận khi nó hoạt động.',
  'state.published.label': 'Đã xuất bản',
  'state.published.description': 'Trực tiếp trên {provider} kể từ {time}.',
  'state.partially_published.label': 'Đã xuất bản một phần',
  'state.partially_published.description':
    '{published, plural, one {# target published} other {# targets published}}, {failed, plural, one {# failed} other {# failed}}. The published posts are live and were not rolled back.',
  'state.action_required.label': 'Cần hành động',
  'state.action_required.description':
    'Điều này không thể tiếp tục cho đến khi bạn làm điều gì đó.',
  'state.retry_scheduled.label': 'Đã lên lịch thử lại',
  'state.retry_scheduled.description':
    'Thử {attempt} của {max} sẽ chạy ở {time}. Không có gì được nhân đôi.',
  'state.failed_permanently.label': 'thất bại',
  'state.failed_permanently.description':
    'Điều này sẽ không được thử lại. Nội dung của bạn được giữ nguyên và lý do là trên biên nhận.',
  'state.canceled.label': 'Đã hủy',
  'state.canceled.description': 'Đã bị hủy bởi {actor} trên {date}. Không có gì được công bố.',
  'state.deleted_externally.label': 'Đã xóa trên nền tảng',
  'state.deleted_externally.description':
    'Bài đăng này không còn trên {provider} nữa. Biên nhận và số liệu được thu thập trước khi nó đi sẽ được lưu giữ.',
  'state.approval.not_required.label': 'Không cần phê duyệt',
  'state.approval.not_required.description':
    'Chính sách cho những mục tiêu này không cần phải được phê duyệt.',
  'state.approval.requested.label': 'Đã yêu cầu',
  'state.approval.requested.description': 'Đã gửi tới {approver} {relativeTime}.',
  'state.approval.in_review.label': 'Đang xem xét',
  'state.approval.in_review.description': '{approver} hiện đang xem xét điều này.',
  'state.approval.approved.label': 'Đã được phê duyệt',
  'state.approval.approved.description': 'Được phê duyệt bởi {approver} trên {date}.',
  'state.approval.changes_requested.label': 'Đã yêu cầu thay đổi',
  'state.approval.changes_requested.description': '{approver} đã yêu cầu thay đổi trên {date}.',
  'state.approval.rejected.label': 'Bị từ chối',
  'state.approval.rejected.description': 'Bị từ chối bởi {approver} trên {date}.',
  'state.approval.expired.label': 'Đã hết hạn',
  'state.approval.expired.description':
    'Yêu cầu này đã hết hạn trên {date} mà không có quyết định.',
  'state.approval.withdrawn.label': 'Đã rút',
  'state.approval.withdrawn.description': 'Tác giả đã rút lại yêu cầu này trên {date}.',
  'state.summary.targets':
    '{ready, plural, one {# target ready} other {# targets ready}}, {blocked, plural, =0 {none blocked} one {# blocked} other {# blocked}}',
  'state.changedAt': 'Đã thay đổi {relativeTime}',
} as const;
