/** vi beta catalog namespace. */
export const errorMessages = {
  'error.unknown.message': 'Đã xảy ra lỗi và chúng tôi không thể phân loại nó.',
  'error.unknown.action':
    'Hãy thử lại. Nếu nó tiếp tục xảy ra, hãy gửi cho chúng tôi tài liệu tham khảo bên dưới.',
  'error.internal.message': 'Đây là vấn đề về phía chúng tôi, không phải với nội dung của bạn.',
  'error.internal.action':
    'Công việc của bạn đã được lưu. Chúng tôi đã được cảnh báo. Hãy thử lại sau vài phút.',
  'error.not_implemented.message': 'Post Array chưa xây dựng cái này.',
  'error.not_implemented.action': 'Theo dõi nhật ký thay đổi khi nó được vận chuyển.',
  'error.offline.message': 'Bạn đang ngoại tuyến.',
  'error.offline.action':
    'Bản nháp của bạn được lưu giữ trên thiết bị này. Xuất bản và lập lịch tiếp tục khi kết nối trở lại.',
  'error.network_unreachable.message': 'Chúng tôi không thể kết nối với máy chủ.',
  'error.network_unreachable.action':
    'Hãy kiểm tra kết nối của bạn và thử lại. Không có gì bị mất.',
  'error.request_invalid.message': 'Yêu cầu không ở dạng mà chúng tôi có thể chấp nhận.',
  'error.request_invalid.action': 'Kiểm tra các trường được liệt kê dưới đây và gửi lại.',
  'error.validation_failed.message': 'Một số trường cần thay đổi trước khi có thể lưu trường này.',
  'error.validation_failed.action': 'Sửa các trường được đánh dấu.',
  'error.unauthenticated.message': 'Bạn cần phải đăng nhập để thực hiện việc này.',
  'error.unauthenticated.action': 'Đăng nhập và chúng tôi sẽ đưa bạn trở lại đây.',
  'error.session_expired.message': 'Phiên của bạn đã hết hạn.',
  'error.session_expired.action': 'Đăng nhập lại. Bản nháp của bạn đã được lưu.',
  'error.mfa_required.message': 'Hành động này cần xác nhận hai yếu tố.',
  'error.mfa_required.action': 'Xác nhận với ứng dụng xác thực của bạn để tiếp tục.',
  'error.forbidden.message': 'Vai trò của bạn không cho phép hành động này.',
  'error.forbidden.action':
    'Hãy yêu cầu chủ sở hữu hoặc quản trị viên của không gian làm việc này cấp quyền truy cập.',
  'error.insufficient_scope.message': 'Thông tin xác thực này không có phạm vi {scope}.',
  'error.insufficient_scope.action': 'Cấp phạm vi đó hoặc sử dụng thông tin xác thực đã có nó.',
  'error.workspace_not_found.message':
    'Không gian làm việc đó không tồn tại hoặc bạn không phải là thành viên.',
  'error.workspace_not_found.action': 'Chọn một không gian làm việc mà bạn thuộc về.',
  'error.workspace_suspended.message': 'Không gian làm việc này bị đình chỉ.',
  'error.workspace_suspended.action':
    'Hãy liên hệ với bộ phận hỗ trợ để giải quyết. Dữ liệu của bạn vẫn còn nguyên vẹn.',
  'error.not_found.message': 'Mục đó không còn tồn tại.',
  'error.not_found.action': 'Nó có thể đã bị xóa. Quay lại và làm mới danh sách.',
  'error.conflict.message': 'Ai đó đã thay đổi điều này trong khi bạn đang thực hiện nó.',
  'error.conflict.action': 'Xem lại cả hai phiên bản, sau đó lưu lại.',
  'error.idempotency_key_reused.message':
    'Khóa bình thường này đã được sử dụng cho một yêu cầu khác.',
  'error.idempotency_key_reused.action': 'Sử dụng khóa mới hoặc lặp lại yêu cầu ban đầu chính xác.',
  'error.rate_limited.message': 'Quá nhiều yêu cầu.',
  'error.rate_limited.action': 'Hãy thử lại sau {time}.',
  'error.quota_exceeded.message': 'Hành động này vượt quá giới hạn cho giai đoạn hiện tại.',
  'error.quota_exceeded.action': 'Giới hạn đặt lại {relativeTime}.',
  'error.payment_required.message': 'Không gian làm việc này không có đăng ký hoạt động.',
  'error.payment_required.action': 'Bắt đầu đăng ký để xuất bản lại. Không có gì bị xóa.',
  'error.subscription_past_due.message': 'Khoản thanh toán cuối cùng đã không được thực hiện.',
  'error.subscription_past_due.action': 'Cập nhật phương thức thanh toán trong cổng Polar.',
  'error.trial_expired.message': 'Cuộc thử nghiệm đã kết thúc vào {date}.',
  'error.trial_expired.action': 'Bắt đầu đăng ký để tiếp tục xuất bản.',
  'error.post_credits_exhausted.message':
    'Không gian làm việc này đã dùng hết các bài đăng miễn phí. Mọi thứ khác vẫn hoạt động.',
  'error.post_credits_exhausted.action':
    'Chọn một gói để tiếp tục đăng bài. Các tài khoản của bạn vẫn được kết nối, bản nháp và lịch đăng vẫn được giữ.',
  'error.entitlement_missing.message':
    'Không gian làm việc này không có quyền truy cập vào tính năng đó.',
  'error.entitlement_missing.action':
    'Hãy kiểm tra cài đặt thanh toán hoặc liên hệ với bộ phận hỗ trợ.',
  'error.channel_limit_reached.message':
    'Không gian làm việc này đã sử dụng tất cả các kênh hoạt động {limit}.',
  'error.channel_limit_reached.action': 'Ngắt kết nối một kênh trước khi kết nối một kênh khác.',
  'error.project_limit_reached.message':
    'Không gian làm việc này đã sử dụng hết {limit} dự án hoạt động.',
  'error.project_limit_reached.action':
    'Lưu trữ một dự án không hoạt động hoặc thay đổi hạn mức dự án của không gian làm việc.',
  'error.project_has_connections.message':
    'Dự án này vẫn còn {connected, plural, other {# kênh đã kết nối}}.',
  'error.project_has_connections.action':
    'Ngắt kết nối mọi kênh trong dự án này trước khi lưu trữ nó.',
  'error.project_last_active.message':
    'Một không gian làm việc phải giữ ít nhất một dự án hoạt động.',
  'error.project_last_active.action': 'Tạo một dự án khác trước khi lưu trữ dự án này.',
  'error.connection_not_found.message': 'Kết nối đó không còn trong không gian làm việc này nữa.',
  'error.connection_not_found.action':
    'Kết nối lại tài khoản để tiếp tục xuất bản lên tài khoản đó.',
  'error.connection_revoked.message': '{account} đã thu hồi quyền truy cập trên {provider}.',
  'error.connection_revoked.action':
    'Kết nối lại tài khoản. Bài viết theo lịch trình sẽ tiếp tục sau đó.',
  'error.connection_expired.message': 'Quyền truy cập của {account} đã hết hạn.',
  'error.connection_expired.action': 'Kết nối lại tài khoản để khôi phục xuất bản và phân tích.',
  'error.connection_paused.message': '{account} bị tạm dừng.',
  'error.connection_paused.action': 'Tiếp tục nó từ Kết nối khi bạn đã sẵn sàng.',
  'error.connection_permission_missing.message':
    '{account} chưa cấp quyền cần thiết để thực hiện việc này.',
  'error.connection_permission_missing.action':
    'Kết nối lại và chấp nhận {permission} trên màn hình đồng ý.',
  'error.connection_account_type_invalid.message':
    'Instagram cần có tài khoản chuyên nghiệp. {account} là tài khoản cá nhân.',
  'error.connection_account_type_invalid.action':
    'Chuyển nó sang tài khoản doanh nghiệp hoặc người sáng tạo trong ứng dụng Instagram, sau đó kết nối lại.',
  'error.connection_review_pending.message':
    '{provider} vẫn đang xem xét ứng dụng này cho {account}.',
  'error.connection_review_pending.action':
    'Bài đăng được xuất bản riêng tư cho đến khi quá trình xem xét được thông qua. Chúng tôi cập nhật trang này khi nó thay đổi.',
  'error.capability_unsupported.message':
    '{provider} không cung cấp tính năng này thông qua API chính thức.',
  'error.capability_unsupported.action': 'Sử dụng định dạng mà tài khoản này hỗ trợ.',
  'error.capability_not_implemented.message': 'Post Array chưa xây dựng tính năng này cho {provider}.',
  'error.capability_not_implemented.action':
    'Trang khả năng liệt kê những gì mỗi trình kết nối có thể thực hiện hiện nay.',
  'error.capability_requires_review.message':
    '{provider} chỉ cấp quyền này sau khi xem xét ứng dụng hoặc tài khoản.',
  'error.capability_requires_review.action':
    'Nó vẫn không có sẵn cho đến khi đánh giá đó được thông qua.',
  'error.content_invalid.message': '{provider} sẽ không chấp nhận nội dung này cho {account}.',
  'error.content_invalid.action':
    'Các vấn đề được liệt kê trên mục tiêu. Hãy sửa chúng và thử lại.',
  'error.content_changed_after_approval.message':
    'Bài đăng này đã thay đổi sau khi được phê duyệt.',
  'error.content_changed_after_approval.action': 'Yêu cầu phê duyệt lại trước khi có thể xuất bản.',
  'error.duplicate_content.message':
    'Nội dung tương tự đã được xuất bản lên {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Thay đổi văn bản hoặc xuất bản nó sau. Nền tảng hạn chế bài viết trùng lặp.',
  'error.cadence_limit_reached.message':
    '{account} đã đạt đến nhịp đăng bài được đặt cho không gian làm việc này.',
  'error.cadence_limit_reached.action':
    'Lên lịch việc này cho thời điểm sau hoặc tăng giới hạn nhịp.',
  'error.media_invalid.message': 'Không thể xuất bản tệp này lên {provider}.',
  'error.media_invalid.action': 'Giới hạn chính xác được hiển thị bên cạnh tệp.',
  'error.media_too_large.message': 'Tệp này lớn hơn {provider} chấp nhận.',
  'error.media_too_large.action':
    'Nén nó hoặc tải lên một phiên bản nhỏ hơn. Bản gốc được giữ lại.',
  'error.media_processing_failed.message': 'Chúng tôi không thể chuẩn bị tệp này cho {provider}.',
  'error.media_processing_failed.action': 'Hãy thử tải lên lại hoặc sử dụng định dạng khác.',
  'error.media_rights_undeclared.message': 'Phương tiện truyền thông này không có tuyên bố quyền.',
  'error.media_rights_undeclared.action':
    'Xác nhận rằng bạn có quyền xuất bản nó, bao gồm bất kỳ người nào trong đó.',
  'error.alt_text_required.message': 'Hình ảnh này cần văn bản thay thế cho {provider}.',
  'error.alt_text_required.action': 'Mô tả hình ảnh hoặc đánh dấu nó là trang trí.',
  'error.approval_required.message':
    'Không gian làm việc này yêu cầu phê duyệt trước khi xuất bản.',
  'error.approval_required.action': 'Yêu cầu phê duyệt từ {approver}.',
  'error.approval_expired.message': 'Sự chấp thuận cho bài đăng này đã hết hạn trên {date}.',
  'error.approval_expired.action': 'Yêu cầu phê duyệt lại.',
  'error.schedule_in_past.message': 'Thời gian đó đã trôi qua trong {timeZone}.',
  'error.schedule_in_past.action': 'Chọn thời điểm sau hoặc xuất bản ngay bây giờ.',
  'error.schedule_conflict.message': '{account} đã có bài đăng trong {duration} tại thời điểm này.',
  'error.schedule_conflict.action':
    'Di chuyển một trong số chúng hoặc tiếp tục nếu khoảng cách đó được dự định.',
  'error.time_zone_invalid.message': 'Chúng tôi không nhận ra múi giờ {timeZone}.',
  'error.time_zone_invalid.action': 'Chọn một khu vực từ danh sách.',
  'error.destination_unavailable.message':
    'Điểm đến {destination} không còn có sẵn trên {provider} nữa.',
  'error.destination_unavailable.action': 'Làm mới danh sách đích và chọn một danh sách khác.',
  'error.mention_unresolved.message': 'Một đề cập chưa được khớp với tài khoản {provider} thực.',
  'error.mention_unresolved.action':
    'Tìm kiếm và chọn tài khoản hoặc xóa đề cập. Chúng tôi không bao giờ xuất bản thẻ gốc giả mạo.',
  'error.provider_transient.message': '{provider} không thể xử lý việc này ngay bây giờ.',
  'error.provider_transient.action': 'Chúng tôi sẽ tự động thử lại. Không có gì được nhân đôi.',
  'error.provider_permanent.message':
    '{provider} đã từ chối điều này và sẽ không chấp nhận thử lại.',
  'error.provider_permanent.action': 'Phản hồi được vệ sinh có trên biên nhận.',
  'error.provider_rate_limited.message': 'Tỷ lệ {provider} đã giới hạn không gian làm việc này.',
  'error.provider_rate_limited.action': 'Chúng tôi sẽ thử lại sau {time}.',
  'error.provider_unavailable.message': '{provider} không phản hồi.',
  'error.provider_unavailable.action':
    'Kiểm tra trang trạng thái. Bài viết theo lịch trình tiếp tục thử lại.',
  'error.provider_content_rejected.message':
    '{provider} từ chối nội dung này theo chính sách riêng của mình.',
  'error.provider_content_rejected.action':
    'Lý do nó đưa ra là trên biên lai. Chỉnh sửa nội dung hoặc khiếu nại với {provider}.',
  'error.user_action_required.message': '{account} cần thứ gì đó từ bạn trước khi có thể xuất bản.',
  'error.user_action_required.action': 'Mở kết nối xem còn thiếu gì.',
  'error.short_link_destination_blocked.message': 'Đích đến đó không thể rút ngắn được.',
  'error.short_link_destination_blocked.action':
    'Mạng riêng, các chương trình không an toàn và các điểm đến lạm dụng đã biết đều bị chặn.',
  'error.short_link_domain_unverified.message': 'Tên miền {domain} chưa được xác minh.',
  'error.short_link_domain_unverified.action':
    'Thêm bản ghi DNS hiển thị trong cài đặt, sau đó xác minh.',
  'error.rss_feed_invalid.message': 'URL đó không trả về nguồn cấp dữ liệu RSS hoặc Atom hợp lệ.',
  'error.rss_feed_invalid.action':
    'Kiểm tra địa chỉ. Chúng tôi tìm nạp nó một cách an toàn và không theo các chuyển hướng riêng tư.',
  'error.webhook_signature_invalid.message': 'Chữ ký trên webhook đó không được xác minh.',
  'error.webhook_signature_invalid.action':
    'Kiểm tra xem người gửi có sử dụng bí mật ký hiện tại hay không. Tải trọng không được xử lý.',
  'error.webhook_delivery_failed.message': 'Việc gửi tới {endpoint} không thành công.',
  'error.webhook_delivery_failed.action':
    'Chúng tôi thử lại với backoff. Nhật ký giao hàng có phản hồi.',
  'error.automation_rule_not_permitted.message':
    'Quy tắc đó sẽ phá vỡ quy tắc nền tảng nên không thể tạo được quy tắc đó.',
  'error.automation_rule_not_permitted.action':
    'Tính năng tự động thích, theo dõi, trả lời không theo yêu cầu và đăng bài hàng loạt không bao giờ có sẵn.',
  'error.ai_unavailable.message': 'Trợ lý viết bài hiện không có sẵn.',
  'error.ai_unavailable.action': 'Văn bản của bạn không bị ảnh hưởng. Hãy thử lại ngay.',
  'error.ai_output_invalid.message':
    'Người trợ lý đã trả lại thứ gì đó mà chúng tôi không thể xác thực.',
  'error.ai_output_invalid.action': 'Không có gì được áp dụng cho bản nháp của bạn. Hãy thử lại.',
  'error.ai_budget_exceeded.message':
    'Hiện tại, không gian làm việc này đã đạt đến giới hạn trợ lý.',
  'error.ai_budget_exceeded.action': 'Giới hạn đặt lại {relativeTime}. Viết bằng tay vẫn được.',
  'error.storage_unavailable.message': 'Chúng tôi không thể truy cập bộ nhớ phương tiện.',
  'error.storage_unavailable.action':
    'Văn bản của bạn đã được lưu. Hãy thử tải lên lại sau giây lát.',
  'error.export_unavailable.message': 'Việc xuất khẩu đó không thể thực hiện được.',
  'error.export_unavailable.action':
    'Hãy thử phạm vi nhỏ hơn hoặc liên hệ với bộ phận hỗ trợ kèm theo tài liệu tham khảo.',
  'error.reference': 'Tham khảo {correlationId}',
  'error.reportToSupport': 'Gửi cái này để hỗ trợ',
  'error.contentPreserved': 'Nội dung của bạn được bảo tồn. Không có gì được công bố.',
} as const;
