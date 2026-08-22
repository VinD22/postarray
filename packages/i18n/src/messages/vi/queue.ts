/**
 * Queue rules and slot reservations.
 *
 * The reason keys are the ones the slot finder emits. They are the sentences a
 * person reads before they accept a proposed time, and the sentences an audit
 * reads back years later, so they say what actually happened rather than
 * congratulating anyone.
 */
export const queueMessages = {
  'queue.title': 'Hàng đợi đăng bài',
  'queue.subtitle':
    'Khi nào dự án này sẵn sàng đăng bài, và cách nhau bao xa. Không có gì được đăng nếu không có người chấp nhận thời điểm đó.',

  'queue.rules.heading': 'Quy tắc hàng đợi',
  'queue.rules.empty':
    'Chưa có quy tắc hàng đợi nào. Cho đến khi bạn thêm một quy tắc, khung giờ tiếp theo chỉ đơn giản là giờ trống đầu tiên.',
  'queue.rules.create': 'Quy tắc hàng đợi mới',
  'queue.rules.count': '{count, plural, =0 {Không có quy tắc} other {# quy tắc}}',
  'queue.rules.enabled': 'Đang dùng',
  'queue.rules.disabled': 'Đã tạm dừng',
  'queue.rules.archived': 'Đã lưu trữ',
  'queue.rules.edit': 'Chỉnh sửa quy tắc',
  'queue.rules.archive': 'Lưu trữ quy tắc',
  'queue.rules.archiveHelp':
    'Lưu trữ sẽ dừng các đề xuất trong tương lai. Các khung giờ đã được đặt trước vẫn giữ nguyên thời điểm và lý do của chúng.',

  'queue.field.name': 'Tên quy tắc',
  'queue.field.nameHelp':
    'Một cái tên bạn sẽ nhận ra sau này, ví dụ: Buổi sáng các ngày trong tuần.',
  'queue.field.timeZone': 'Múi giờ',
  'queue.field.timeZoneHelp':
    'Khung giờ, số lượng đăng mỗi ngày và các ngày không đăng bài đều được đọc theo múi giờ này.',
  'queue.field.minimumGap': 'Khoảng cách tối thiểu',
  'queue.field.minimumGapHelp':
    'Số phút giữa hai bài đăng. Bằng 0 nghĩa là không có quy tắc giãn cách.',
  'queue.field.maximumPerDay': 'Tối đa mỗi ngày',
  'queue.field.maximumPerDayHelp':
    'Để trống nếu không giới hạn theo ngày. Bằng 0 nghĩa là quy tắc này không đề xuất gì cả.',
  'queue.field.maximumPerDayUnlimited': 'Không giới hạn theo ngày',
  'queue.field.priority': 'Mức ưu tiên',
  'queue.field.priorityHelp':
    'Quy tắc có mức ưu tiên cao nhất có thể đề xuất khung giờ sẽ được dùng.',
  'queue.field.enabled': 'Dùng quy tắc này',

  'queue.windows.heading': 'Khung giờ hằng tuần',
  'queue.windows.help':
    'Chọn các giờ theo múi giờ địa phương mà dự án này có thể đăng bài. Dùng các trường ngày và giờ, hoặc các nút trên lưới.',
  'queue.windows.empty':
    'Chưa có khung giờ nào. Một quy tắc không có khung giờ sẽ không bao giờ đề xuất được thời điểm nào.',
  'queue.windows.add': 'Thêm khung giờ',
  'queue.windows.remove': 'Xóa khung giờ',
  'queue.windows.entry': '{weekday}, {start} đến {end}',
  'queue.windows.start': 'Từ',
  'queue.windows.end': 'Đến',
  'queue.windows.weekday': 'Ngày',
  'queue.windows.toggleCell': '{weekday} lúc {hour}',
  'queue.windows.gridLabel': 'Khả năng đăng bài hằng tuần, một nút cho mỗi ngày và giờ',

  'queue.weekday.1': 'Thứ Hai',
  'queue.weekday.2': 'Thứ Ba',
  'queue.weekday.3': 'Thứ Tư',
  'queue.weekday.4': 'Thứ Năm',
  'queue.weekday.5': 'Thứ Sáu',
  'queue.weekday.6': 'Thứ Bảy',
  'queue.weekday.7': 'Chủ Nhật',

  'queue.blackouts.heading': 'Ngày không đăng bài',
  'queue.blackouts.help':
    'Những ngày dự án này sẽ không đăng bài, được đọc theo múi giờ của quy tắc.',
  'queue.blackouts.empty': 'Không có ngày không đăng bài nào.',
  'queue.blackouts.add': 'Thêm ngày không đăng bài',
  'queue.blackouts.remove': 'Xóa ngày không đăng bài',
  'queue.blackouts.from': 'Ngày đầu tiên',
  'queue.blackouts.to': 'Ngày cuối cùng',
  'queue.blackouts.entry': '{from} đến {to}',

  'queue.connections.heading': 'Tài khoản',
  'queue.connections.all': 'Mọi tài khoản trong dự án này',
  'queue.connections.scoped': '{count, plural, other {# tài khoản}} mà quy tắc này áp dụng',

  'queue.slot.heading': 'Khung giờ hàng đợi tiếp theo',
  'queue.slot.action': 'Dùng khung giờ hàng đợi tiếp theo',
  'queue.slot.proposed': '{local} theo {timeZone}',
  'queue.slot.utc': 'Tức là {utc} theo giờ UTC.',
  'queue.slot.why': 'Vì sao lại là thời điểm này',
  'queue.slot.accept': 'Dùng thời điểm này',
  'queue.slot.release': 'Chọn thời điểm khác',
  'queue.slot.expires': 'Đề xuất này được giữ đến {expires}.',
  'queue.slot.unavailable': 'Hiện không có khung giờ hàng đợi nào.',
  'queue.slot.pending': 'Đang tìm khung giờ tiếp theo.',
  'queue.slot.accepted': 'Đã lên lịch cho {local} theo {timeZone}.',
  'queue.slot.notAutomatic': 'Không có gì được lên lịch cho đến khi bạn chọn thời điểm này.',

  'queue.reason.noRulesConfigured':
    'Dự án này chưa có quy tắc hàng đợi nào được thiết lập, nên không có khung giờ nào được áp dụng.',
  'queue.reason.fallbackFirstFreeHour': 'Giờ trống đầu tiên kể từ bây giờ đã được dùng thay thế.',
  'queue.reason.matchedRule': 'Quy tắc {name} đã chọn thời điểm này, theo {zone}.',
  'queue.reason.matchedWindow': 'Thời điểm này nằm trong khung giờ {start} đến {end} theo {zone}.',
  'queue.reason.minimumGap': 'Thời điểm này cách mọi bài đăng khác ít nhất {minutes} phút.',
  'queue.reason.noMinimumGap': 'Quy tắc này không đặt khoảng cách tối thiểu giữa các bài đăng.',
  'queue.reason.dailyCap': 'Ngày đó có tối đa {limit} bài đăng, và chưa đầy.',
  'queue.reason.dailyCapUnlimited': 'Quy tắc này không đặt giới hạn theo ngày.',
  'queue.reason.blackoutSkipped':
    '{days, plural, other {# ngày không đăng bài}} đã bị bỏ qua để đến được thời điểm này.',
  'queue.reason.dstNonexistentSkipped':
    'Thời điểm đầu tiên trong khung giờ không tồn tại vào ngày đó theo {zone}, nên thời điểm tiếp theo tồn tại đã được dùng.',
  'queue.reason.dstAmbiguousFirst':
    'Giờ địa phương đó xảy ra hai lần theo {zone} vào ngày đó. Lần xuất hiện đầu tiên đã được dùng.',
  'queue.reason.priorityChosen':
    'Quy tắc này có mức ưu tiên {priority}, mức cao nhất có thể đề xuất.',
  'queue.reason.connectionScoped': 'Quy tắc này áp dụng cho {count, plural, other {# tài khoản}}.',
  'queue.reason.horizonExhausted': 'Không có khung giờ nào trống trong vòng {days} ngày.',
} as const;
