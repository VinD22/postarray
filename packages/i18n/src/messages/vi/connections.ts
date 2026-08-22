/** vi beta catalog namespace. */
export const connectionMessages = {
  'connection.title': 'Kết nối',
  'connection.subtitle': 'Các tài khoản, Trang và kênh mà không gian làm việc này có thể đăng lên.',
  'connection.add': 'Kết nối một tài khoản',
  'connection.count': '{used, plural, one {# active channel} other {# active channels}} of {limit}',
  'connection.limitReached':
    'Không gian làm việc này đang sử dụng tất cả các kênh {limit}. Ngắt kết nối một cái trước khi kết nối cái khác.',
  'connection.account.label': 'Tài khoản',
  'connection.account.type.profile': 'Hồ sơ',
  'connection.account.type.page': 'Trang',
  'connection.account.type.channel': 'Kênh',
  'connection.account.type.group': 'Nhóm',
  'connection.account.type.organization': 'Tổ chức',
  'connection.account.type.business': 'Tài khoản doanh nghiệp',
  'connection.account.type.creator': 'Tài khoản người sáng tạo',
  'connection.connectedBy': 'Được kết nối bởi {name} trên {date}',
  'connection.lastPublished': 'Được xuất bản lần cuối {relativeTime}',
  'connection.lastPublishedNever': 'Chưa có gì được xuất bản từ tài khoản này',
  'connection.lastAnalyticsSync': 'Phân tích đã được đồng bộ hóa {relativeTime}',
  'connection.status.healthy': 'Đang làm việc',
  'connection.status.expiringSoon': 'Hết hạn {relativeTime}',
  'connection.status.expired': 'Quyền truy cập đã hết hạn',
  'connection.status.revoked': 'Quyền truy cập bị thu hồi',
  'connection.status.paused': 'Đã tạm dừng',
  'connection.status.permissionMissing': 'Thiếu quyền',
  'connection.status.reviewPending': 'Đang chờ xem xét nền tảng',
  'connection.status.unknown': 'Sức khỏe không có sẵn',
  'connection.token.expiresAt': 'Quyền truy cập hết hạn {date}',
  'connection.token.expiryUnknown':
    '{provider} không cho chúng tôi biết khi nào quyền truy cập này hết hạn.',
  'connection.permissions.title': 'Quyền',
  'connection.permissions.granted': 'Đã được cấp',
  'connection.permissions.missing': 'Không được cấp',
  'connection.permissions.explainBeforeOAuth':
    'Relay sẽ yêu cầu {provider} cấp các quyền này. Bạn có thể ngắt kết nối bất cứ lúc nào.',
  'connection.permissions.whyNeeded': 'Tại sao điều này là cần thiết',
  'connection.reconnect.title': 'Kết nối lại {account}',
  'connection.reconnect.body':
    'Các bài đăng đã lên lịch cho tài khoản này sẽ bị treo cho đến khi nó được kết nối lại. Không có gì bị mất.',
  'connection.disconnect.title': 'Ngắt kết nối {account}?',
  'connection.disconnect.body':
    'Các bài đăng đã lên lịch cho tài khoản này sẽ không được xuất bản. Biên lai và số liệu phân tích đã được thu thập vẫn nằm trong không gian làm việc này.',
  'connection.pause.body':
    'Tài khoản bị tạm dừng sẽ giữ lại lịch sử và lịch biểu của nó nhưng không xuất bản cho đến khi bạn tiếp tục lại.',
  'connection.incident.invalidToken':
    '{provider} đã từ chối quyền truy cập được lưu trữ cho {account}. Kết nối lại để khôi phục xuất bản.',
  'connection.incident.permissionLost':
    '{account} không còn cấp {permission} nữa. Kết nối lại và chấp nhận sự cho phép đó.',
  'connection.incident.roleLost':
    'Người dùng {provider} của bạn không còn có vai trò trên {account} nữa. Hãy yêu cầu quản trị viên của Trang đó khôi phục Trang đó.',
  'connection.incident.accountTypeInvalid':
    'Instagram cần có tài khoản chuyên nghiệp. Chuyển {account} sang tài khoản doanh nghiệp hoặc người sáng tạo, sau đó kết nối lại.',
  'connection.incident.reviewRestricted':
    '{provider} đã hạn chế ứng dụng này đang chờ xem xét. Các bài đăng từ {account} xuất bản riêng tư cho đến khi quá trình xem xét hoàn tất.',
  'connection.group.title': 'Nhóm khách hàng',
  'connection.group.description': 'Nhóm tài khoản theo khách hàng hoặc dự án để lọc mọi màn hình.',
  'connection.group.assign': 'Di chuyển đến nhóm',
  'connection.group.none': 'Đã tách nhóm',
  'connection.group.moveNote':
    'Việc di chuyển một tài khoản sẽ giữ lại các bài đăng, biên lai và số liệu phân tích của tài khoản đó.',
  'connection.oauth.starting': 'Mở {provider}',
  'connection.oauth.returned': 'Kết thúc kết nối',
  'connection.oauth.chooseAccounts': 'Chọn tài khoản để kết nối',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'Không có tài khoản nào trên thông tin đăng nhập {provider} này có thể được kết nối. {reason}',
  'connection.oauth.canceled': 'Kết nối đã bị hủy trên {provider}. Không có gì thay đổi.',
  'connection.oauth.alreadyConnected': '{account} đã được kết nối với không gian làm việc này.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} được kết nối với không gian làm việc khác. Ngắt kết nối nó ở đó trước.',
  'capability.title': 'Tài khoản này hỗ trợ những gì',
  'capability.matrix.title': 'Khả năng nền tảng',
  'capability.matrix.subtitle':
    'Được tạo từ các định nghĩa về trình kết nối mà chúng tôi duy trì và xem xét thủ công.',
  'capability.level.supported': 'Được hỗ trợ',
  'capability.level.unsupported': 'Không được cung cấp bởi nền tảng',
  'capability.level.not_implemented': 'Chưa được xây dựng',
  'capability.level.requires_review': 'Cần xem xét lại nền tảng',
  'capability.level.beta': 'bản thử nghiệm',
  'capability.level.unknown': 'Không có sẵn',
  'capability.explain.supported': 'Relay có thể thực hiện việc này cho tài khoản này ngay hôm nay.',
  'capability.explain.unsupported':
    '{provider} không cung cấp tính năng này thông qua API chính thức, vì vậy không có công cụ nào có thể thực hiện việc đó một cách an toàn.',
  'capability.explain.not_implemented':
    '{provider} cung cấp tính năng này, nhưng Relay vẫn chưa xây dựng nó. Nó nằm trên lộ trình kết nối.',
  'capability.explain.requires_review':
    '{provider} chỉ cấp quyền này sau khi xem xét ứng dụng hoặc tài khoản. Nó vẫn không có sẵn cho đến khi đánh giá đó được thông qua.',
  'capability.explain.beta':
    'Điều này hoạt động, với các giới hạn mà chúng tôi chưa xác minh xong. Kiểm tra kết quả trước khi bạn dựa vào nó.',
  'capability.explain.unknown':
    'Chúng tôi không thể đọc các quyền hiện tại cho tài khoản này. Kết nối lại để làm mới chúng.',
  'capability.lastChecked': 'Đã kiểm tra {relativeTime}',
  'capability.feature.text': 'bài viết văn bản',
  'capability.feature.image': 'Hình ảnh',
  'capability.feature.carousel': 'băng chuyền',
  'capability.feature.video': 'Video',
  'capability.feature.document': 'Tài liệu',
  'capability.feature.firstComment': 'Đã lên lịch bình luận đầu tiên',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'Đề cập gốc',
  'capability.feature.destinations': 'Lựa chọn điểm đến',
  'capability.feature.privacy': 'Kiểm soát quyền riêng tư',
  'capability.feature.thumbnail': 'Hình thu nhỏ tùy chỉnh',
  'capability.feature.altText': 'Văn bản thay thế',
  'capability.feature.analytics': 'Phân tích',
  'capability.feature.delete': 'Xóa bài đăng đã xuất bản',
  'capability.feature.commentCount': 'Số lượng bình luận',
  'capability.feature.commentReplies': 'Đọc và trả lời bình luận',
  'capability.feature.disclosure': 'Tự động tiết lộ',
} as const;
