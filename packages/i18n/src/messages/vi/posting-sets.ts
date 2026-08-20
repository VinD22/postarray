/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 *
 * Three features that all answer "who is this going to, and when", grouped in
 * one namespace so their vocabulary stays consistent. The hold copy is the part
 * most worth reading twice: pausing stops work that has not happened, and every
 * sentence here has to say that plainly rather than implying a post can be
 * pulled back off a platform.
 */
export const postingSetMessages = {
  /* ------------------------------------------------------------- the hold */
  'calendar.hold.action': 'Tạm dừng',
  'calendar.hold.resumeAction': 'Tiếp tục',
  'calendar.hold.badge': 'Đã tạm dừng',
  'calendar.hold.badgeBilling': 'Tạm dừng do thanh toán',
  'calendar.hold.term': 'Tạm giữ',
  'calendar.hold.byPerson': 'Bạn đã tạm dừng vào {date}.',
  'calendar.hold.byBilling': 'Đã tạm dừng vào {date} vì không gian làm việc này mất quyền truy cập đầy đủ.',
  'calendar.hold.none': 'Không tạm dừng',

  'calendar.hold.confirmTitle': 'Tạm dừng bài đăng này?',
  'calendar.hold.confirmBody':
    'Bài đăng này sẽ giữ nguyên vị trí và sẽ không được gửi đi vào lúc {time}. Bạn có thể tiếp tục nó bất cứ lúc nào trước đó, hoặc chọn thời điểm mới nếu thời điểm đó đã qua.',
  'calendar.hold.confirmScope':
    'Tạm dừng chỉ dừng những gì chưa xảy ra. Bất cứ điều gì đã được đăng lên một nền tảng vẫn giữ nguyên trạng thái đã đăng, và việc tạm dừng không xóa hay chỉnh sửa nó.',
  'calendar.hold.confirmNoteLabel': 'Vì sao bạn tạm dừng bài này? (tùy chọn)',
  'calendar.hold.confirmNoteHint':
    'Được lưu trong hồ sơ kiểm tra cho nhóm của bạn. Nó không được gửi tới bất kỳ nền tảng nào.',
  'calendar.hold.confirm': 'Tạm dừng bài đăng này',
  'calendar.hold.cancel': 'Giữ nguyên lịch',

  'calendar.hold.resumeTitle': 'Tiếp tục bài đăng này?',
  'calendar.hold.resumeBody': 'Nó sẽ được gửi đi vào lúc {time}, theo {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'Thời điểm đó đã qua',
  'calendar.hold.resumeMissedBody':
    'Bài đăng này đến hạn vào lúc {time} trong khi bị tạm dừng. Hãy chọn thời điểm mới để nó không được gửi đi ngay khi bạn tiếp tục.',
  'calendar.hold.resumeTimeLabel': 'Thời điểm đăng mới',
  'calendar.hold.resumeConfirm': 'Tiếp tục',

  'calendar.hold.paused': 'Đã tạm dừng. Nó sẽ không được gửi đi cho đến khi bạn tiếp tục.',
  'calendar.hold.resumed': 'Đã tiếp tục. Nó sẽ được gửi đi vào lúc {time}.',

  'calendar.hold.blocked.published':
    'Bài đăng này đã được gửi đi. Tạm dừng không thể lấy lại nó khỏi nền tảng.',
  'calendar.hold.blocked.inFlight':
    'Bài đăng này đang được gửi đi ngay lúc này. Đã quá muộn để tạm dừng, và dừng lại giữa chừng có thể khiến nó chỉ đăng được một phần.',
  'calendar.hold.blocked.finished': 'Bài đăng này đã hoàn tất, nên không có gì để tạm dừng.',
  'calendar.hold.blocked.billing':
    'Bài đăng này đang bị tạm giữ vì không gian làm việc mất quyền truy cập đầy đủ. Tiếp tục nó là vấn đề thanh toán, không phải vấn đề lên lịch.',
  'calendar.hold.blocked.billingAction': 'Đến trang thanh toán',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Bộ đăng bài',
  'set.lede':
    'Một câu trả lời đã lưu cho "tôi đang đăng cho ai, và bằng cách nào". Áp dụng một Bộ sẽ sao chép các thiết lập của nó vào một bản nháp mới.',
  'set.appliedOnce':
    'Một Bộ chỉ được đọc một lần, khi bạn áp dụng nó. Chỉnh sửa nó sau đó chỉ thay đổi điều bài đăng tiếp theo bắt đầu từ. Các bản nháp và bài đã lên lịch mà bạn đã tạo từ nó vẫn giữ nguyên như cũ.',
  'set.empty.title': 'Chưa có Bộ nào',
  'set.empty.body': 'Tạo một Bộ để không phải xây lại cùng một danh sách tài khoản cho mỗi bài đăng.',
  'set.create': 'Bộ mới',
  'set.edit': 'Chỉnh sửa Bộ',
  'set.archive': 'Lưu trữ Bộ',
  'set.archived': 'Đã lưu trữ',
  'set.archivedNote': 'Các Bộ đã lưu trữ bị ẩn khỏi bộ chọn. Các bài đăng đã tạo từ chúng không thay đổi.',
  'set.showArchived': 'Hiện các mục đã lưu trữ',
  'set.saved': 'Đã lưu Bộ.',
  'set.archivedToast': 'Đã lưu trữ Bộ. Các bài đăng đã tạo từ nó không thay đổi.',

  'set.field.name': 'Tên',
  'set.field.nameHint': 'Điều bạn sẽ tìm trong bộ chọn. Một tên riêng cho mỗi dự án.',
  'set.field.description': 'Mô tả',
  'set.field.descriptionHint': 'Tùy chọn. Bộ này dùng để làm gì.',
  'set.field.targets': 'Tài khoản',
  'set.field.targetsHint': 'Mọi tài khoản mà một bài đăng tạo từ Bộ này sẽ bắt đầu với.',
  'set.field.targetCount': '{count, plural, =0 {Không có tài khoản} other {# tài khoản}}',
  'set.field.signature': 'Chữ ký',
  'set.field.signatureNone': 'Không có chữ ký',
  'set.field.approval': 'Phê duyệt',
  'set.field.approvalHint': 'Sự phê duyệt mà một bài đăng tạo từ Bộ này cần trước khi có thể xuất bản.',
  'set.field.schedule': 'Khi nào xuất bản',

  'set.approval.none': 'Không cần phê duyệt',
  'set.approval.single_approver': 'Một người phê duyệt được chỉ định',
  'set.approval.any_approver': 'Bất kỳ người phê duyệt nào',
  'set.approval.named_approver': 'Một người phê duyệt cụ thể',
  'set.approval.policy_auto': 'Theo đúng chính sách của không gian làm việc',

  'set.slot.next_free_slot': 'Khung giờ trống tiếp theo từ hàng đợi',
  'set.slot.next_free_slotHint':
    'Dùng các quy tắc hàng đợi của dự án này để đề xuất một thời điểm. Nó đề xuất; bạn chấp nhận.',
  'set.slot.pick_time': 'Hỏi tôi về một thời điểm',
  'set.slot.pick_timeHint': 'Áp dụng Bộ này để trống thời điểm cho bạn tự chọn.',
  'set.slot.draft_only': 'Để nó là bản nháp',
  'set.slot.draft_onlyHint': 'Áp dụng Bộ này hoàn toàn không đụng đến lịch đăng.',
  'set.slot.noRules':
    'Dự án này chưa có quy tắc hàng đợi nào, nên hàng đợi sẽ đề xuất giờ trống đầu tiên và cho bạn biết vậy.',
  'set.slot.rulesLink': 'Quy tắc hàng đợi',

  'set.defaults.title': 'Mặc định theo từng nền tảng',
  'set.defaults.body':
    'Các giá trị khởi đầu được sao chép vào mỗi bài đăng mới. Bạn có thể thay đổi bất kỳ giá trị nào trong số này trong trình soạn thảo sau đó.',
  'set.defaults.add': 'Thêm một nền tảng',
  'set.defaults.remove': 'Xóa mặc định của {platform}',
  'set.defaults.privacy': 'Quyền riêng tư',
  'set.defaults.privacyNone': 'Mặc định của nền tảng',
  'set.defaults.bodyPrefix': 'Văn bản trước bài đăng',
  'set.defaults.bodySuffix': 'Văn bản sau bài đăng',
  'set.defaults.requireAltText': 'Yêu cầu văn bản thay thế cho mọi ảnh',
  'set.defaults.requireAltTextHint':
    'Một bài đăng tạo từ Bộ này không thể được lên lịch cho nền tảng đó cho đến khi mọi ảnh đều có văn bản thay thế.',
  'set.defaults.empty': 'Không có mặc định theo nền tảng nào. Mọi tài khoản bắt đầu từ bài đăng gốc.',

  'set.error.nameTaken': 'Một Bộ khác trong dự án này đã dùng tên đó rồi.',
  'set.error.archived': 'Bộ này đã được lưu trữ. Hãy khôi phục nó trước khi chỉnh sửa.',
  'set.error.duplicateTarget': 'Tài khoản đó đã có trong Bộ này rồi.',
  'set.error.duplicatePlatform': 'Bộ này đã có mặc định cho nền tảng đó rồi.',

  /* --------------------------------------------------- remembered targets */
  'targetMemory.setting.title': 'Ghi nhớ tài khoản giữa các bài đăng',
  'targetMemory.setting.body':
    'Khi bật, trình soạn thảo sẽ bắt đầu mỗi bài đăng mới với các tài khoản mà người đó đã chọn lần gần nhất trong dự án này. Tính năng này tắt trừ khi bạn bật nó.',
  'targetMemory.setting.stored':
    'Chỉ danh sách tài khoản được lưu lại, và chỉ cho người đã chọn chúng. Không có nội dung, thời điểm, thiết lập quyền riêng tư hay trạng thái phê duyệt nào được lưu, và không ai khác trong dự án có thể thấy danh sách của bạn.',
  'targetMemory.setting.offNote': 'Khi tính năng này tắt, hoàn toàn không có gì được lưu.',
  'targetMemory.setting.turnOffWarning':
    'Tắt tính năng này sẽ xóa mọi lựa chọn đã lưu trong dự án này, cho tất cả mọi người.',
  'targetMemory.setting.enabled': 'Bật',
  'targetMemory.setting.disabled': 'Tắt',
  'targetMemory.setting.saved': 'Đã lưu thiết lập.',
  'targetMemory.setting.cleared': 'Đã lưu thiết lập. Các lựa chọn đã lưu trong dự án này đã bị xóa.',

  'targetMemory.composer.restored':
    '{count, plural, other {Đã bắt đầu với # tài khoản từ lần trước.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, other {# tài khoản bạn dùng lần trước đã bị bỏ qua vì cần được chú ý.}}',
  'targetMemory.composer.droppedAll':
    'Không có tài khoản nào bạn đã dùng lần trước khả dụng lúc này, nên không có gì được chọn sẵn.',
  'targetMemory.composer.undo': 'Xóa lựa chọn',
  'targetMemory.composer.forget': 'Ngừng ghi nhớ tài khoản của tôi',
  'targetMemory.composer.forgotten': 'Lựa chọn đã lưu của bạn đã bị xóa.',
  'targetMemory.composer.reviewAccounts': 'Xem lại tài khoản',
} as const;
