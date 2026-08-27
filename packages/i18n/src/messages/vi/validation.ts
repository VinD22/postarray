/** vi beta catalog namespace. */
export const validationMessages = {
  'validation.text_required.message': '{provider} cần một số văn bản cho loại bài đăng này.',
  'validation.text_too_long.message':
    '{over, plural, one {# character over the limit for {account}} other {# characters over the limit for {account}}}',
  'validation.text_too_long.hint': '{provider} cho phép các ký tự {limit} cho tài khoản này.',
  'validation.text_too_short.message': '{provider} cần ít nhất các ký tự {min} ở đây.',
  'validation.title_required.message': '{provider} cần một danh hiệu.',
  'validation.title_too_long.message': 'Tiêu đề vượt quá giới hạn ký tự {limit}.',
  'validation.description_too_long.message': 'Mô tả vượt quá giới hạn ký tự {limit}.',
  'validation.media_required.message':
    '{provider} cần ít nhất một hình ảnh hoặc video cho loại bài đăng này.',
  'validation.media_count_exceeded.message':
    '{provider} accepts at most {limit, plural, one {# file} other {# files}} here. This post has {count}.',
  'validation.media_type_unsupported.message': '{provider} không chấp nhận các tệp {mimeType}.',
  'validation.media_aspect_ratio_unsupported.message':
    'Tệp này là {actual}. {provider} cần tỷ lệ giữa {min} và {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Cắt nó bằng nền tảng cài sẵn để khắc phục điều này.',
  'validation.media_resolution_too_low.message':
    'Tệp này là {actual}. {provider} cần ít nhất {required}.',
  'validation.media_duration_too_long.message':
    'Video này là {actual}. {provider} chấp nhận tối đa {limit} cho tài khoản này.',
  'validation.media_duration_too_short.message':
    'Video này là {actual}. {provider} cần ít nhất {limit}.',
  'validation.media_file_too_large.message':
    'Tệp này là {actual}. {provider} chấp nhận tối đa {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} không thể xuất bản hình ảnh và video trong cùng một bài đăng.',
  'validation.media_unavailable.message':
    'Một tệp đính kèm không còn khả dụng. Hãy xóa nó khỏi bài đăng hoặc tải lên lại.',
  'validation.alt_text_missing.message':
    'Alt text is missing on {count, plural, one {# image} other {# images}}.',
  'validation.alt_text_missing.hint': 'Mô tả hình ảnh hoặc đánh dấu nó là trang trí.',
  'validation.thumbnail_unsupported.message':
    '{provider} không chấp nhận hình thu nhỏ tùy chỉnh ở đây.',
  'validation.destination_required.message': 'Chọn nơi xuất bản nội dung này trên {provider}.',
  'validation.destination_unsupported.message':
    '{destination} không chấp nhận loại bài đăng này trên {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# mention has not been matched to a real account} other {# mentions have not been matched to real accounts}}.',
  'validation.mention_unresolved.hint':
    'Chọn tài khoản từ kết quả tìm kiếm hoặc xóa đề cập. Văn bản thuần túy không bao giờ xuất bản dưới dạng thẻ gốc.',
  'validation.hashtag_count_exceeded.message':
    'Hashtag {count}. {provider} được coi là thư rác nhiều hơn {limit}.',
  'validation.link_not_allowed.message': '{provider} không cho phép liên kết trong trường này.',
  'validation.link_destination_unverified.message':
    'Miền liên kết {domain} chưa được xác minh cho không gian làm việc này.',
  'validation.privacy_setting_required.message':
    '{provider} yêu cầu lựa chọn quyền riêng tư rõ ràng trước khi xuất bản.',
  'validation.privacy_setting_required.hint':
    'Không có mặc định. Chọn người có thể xem bài đăng này.',
  'validation.disclosure_required.message':
    'Bài đăng này cần được tiết lộ theo quy tắc dự án dành cho {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} không hỗ trợ nhận xét đầu tiên được lên lịch cho tài khoản này.',
  'validation.thread_unsupported.message': '{provider} không hỗ trợ chủ đề cho tài khoản này.',
  'validation.repeat_end_required.message':
    'Một bài đăng lặp lại cần có ngày kết thúc hoặc số lần lặp lại.',
  'validation.schedule_in_past.message': 'Thời gian đó đã trôi qua trong {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'Bài đăng có thể được lên lịch trước tối đa {limit}, cũng là thời gian tệp phương tiện tải lên được lưu giữ.',
  'validation.schedule_outside_quiet_hours.message':
    'Điều này rơi vào khoảng thời gian yên tĩnh được đặt cho {project}.',
  'validation.duplicate_within_window.message':
    'Nội dung tương tự đã được lên lịch hoặc xuất bản cho {account} trong {window}.',
  'validation.blocked_term_present.message': 'Văn bản chứa thuật ngữ bị chặn cho {project}.',
  'validation.unsupported_claim.message':
    'Xác nhận quyền sở hữu này không nằm trong các xác nhận quyền sở hữu đã được phê duyệt đối với {project}.',
  'validation.unsupported_claim.hint':
    'Thêm nó vào các tuyên bố đã được phê duyệt kèm theo bằng chứng hoặc diễn đạt lại câu.',
  'validation.cadence_exceeded.message':
    '{account} would publish {count, plural, one {# time} other {# times}} that day, over the limit of {limit}.',
  'validation.connection_paused.message': '{account} bị tạm dừng và sẽ không xuất bản.',
  'validation.account_type_invalid.message':
    '{account} không phải là loại tài khoản mà {provider} yêu cầu cho loại bài đăng này.',
  'validation.severity.error': 'Phải sửa',
  'validation.severity.warning': 'Kiểm tra cái này',
  'validation.severity.info': 'Để biết thông tin của bạn',
  'validation.field.required': 'Trường này là bắt buộc.',
  'validation.field.tooShort':
    'Use at least {min, plural, one {# character} other {# characters}}.',
  'validation.field.tooLong': 'Use at most {max, plural, one {# character} other {# characters}}.',
  'validation.field.invalidEmail': 'Nhập địa chỉ email hợp lệ.',
  'validation.field.invalidUrl': 'Nhập URL đầy đủ, bao gồm https.',
  'validation.field.invalidDate': 'Nhập một ngày hợp lệ.',
  'validation.field.invalidTime': 'Nhập thời gian hợp lệ.',
  'validation.field.invalidNumber': 'Nhập một số.',
  'validation.field.outOfRange': 'Nhập giá trị từ {min} đến {max}.',
  'validation.field.mustMatch': 'Hai giá trị này phải khớp nhau.',
  'validation.field.alreadyTaken': 'Cái đó đã được sử dụng rồi.',
  'validation.field.unsafeValue': 'Giá trị đó không được phép ở đây.',
} as const;
