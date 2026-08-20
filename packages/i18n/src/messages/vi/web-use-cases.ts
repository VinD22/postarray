/**
 * The three project-led use case pages.
 *
 * These describe workflows, not capabilities. The rule that binds every string
 * here: a sentence may describe how the product is designed and what has been
 * built, and may never imply that anything reaches a platform. Nothing
 * publishes, so "what works today" is written in the past and present tense of
 * the build, not of a live service.
 */
export const webUseCaseMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.useCases.title': 'Các trường hợp sử dụng',
  'web.meta.useCases.description':
    'Ba quy trình mà sản phẩm này đang được xây dựng xoay quanh: vận hành nhiều khách hàng trong một nơi, được phê duyệt công việc trước khi nó ra ngoài, và đưa một ý tưởng đến nhiều nền tảng mà không phải viết lại nó.',
  'web.meta.useCase.clients.title': 'Quản lý nhiều khách hàng',
  'web.meta.useCase.clients.description':
    'Các dự án riêng biệt, tài khoản kết nối riêng biệt, phê duyệt riêng biệt và báo cáo riêng biệt, dành cho các nhóm đăng bài thay mặt người khác.',
  'web.meta.useCase.approvals.title': 'Quy trình phê duyệt',
  'web.meta.useCase.approvals.description':
    'Cách một bản nháp trở thành bài đăng đã phê duyệt: ai xem lại nó, điều gì làm mất hiệu lực một phê duyệt, và vì sao cùng một quy tắc áp dụng trên mọi bề mặt.',
  'web.meta.useCase.crossPlatform.title': 'Đăng bài đa nền tảng',
  'web.meta.useCase.crossPlatform.description':
    'Một bản nháp gốc, một phiên bản thích ứng cho từng nền tảng, được kiểm tra theo giới hạn đã ghi nhận của từng nền tảng trước khi bất cứ điều gì được lên lịch.',

  /* ---------------------------------------------------------------------- */
  /* Shared furniture                                                       */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': 'Các trường hợp sử dụng',
  'web.useCases.index.lede':
    'Ba quy trình mà sản phẩm này đang được xây dựng xoay quanh. Mỗi trang nêu quy trình này đang tốn gì của một nhóm hôm nay, sản phẩm được thiết kế để xử lý nó ra sao, và phần nào thực sự đã được xây dựng.',
  'web.useCases.index.listLabel': 'Các trường hợp sử dụng',

  'web.useCases.notice.title': 'Đây mô tả một thiết kế, không phải một dịch vụ đang chạy',
  'web.useCases.notice.body':
    'Chưa có kết nối nào được xác minh trong môi trường thực tế, nên chưa có gì trên trang này được đăng đi đâu cả. Ở đâu một phần của quy trình đã được xây dựng, trang nói rõ vậy. Ở đâu chưa, trang cũng nói rõ điều đó.',

  'web.useCases.section.problem': 'Vấn đề',
  'web.useCases.section.approach': 'Sản phẩm được thiết kế ra sao',
  'web.useCases.section.today': 'Những gì thực sự đã được xây dựng',
  'web.useCases.section.related': 'Liên quan',

  /* ---------------------------------------------------------------------- */
  /* Managing multiple clients                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': 'Quản lý nhiều khách hàng',
  'web.useCases.clients.lede':
    'Công việc cho một khách hàng không bao giờ nên chỉ cách một cú nhấp nhầm khỏi đối tượng của một khách hàng khác.',
  'web.useCases.clients.problem':
    'Hầu hết các nhóm tách biệt khách hàng bằng cách cẩn thận. Một tài khoản dùng chung chứa mọi trang đã kết nối, một lịch chứa mọi lịch đăng, và điều duy nhất đứng giữa một bản nháp của khách hàng và sai đối tượng là người đang nhìn màn hình lúc 6 giờ chiều. Khi ai đó rời nhóm, sự tách biệt cũng rời đi cùng thói quen đó.',
  'web.useCases.clients.approach1':
    'Một dự án là đơn vị tách biệt. Tài khoản đã kết nối, bản nháp, hàng đợi, phương tiện và biên nhận đều thuộc về một dự án, và một thành viên chỉ thấy các dự án mà họ được thêm vào.',
  'web.useCases.clients.approach2':
    'Sự tách biệt được thực thi ba lần: khi xác thực, trong dịch vụ ứng dụng cấp quyền cho hành động, và trong chính cơ sở dữ liệu thông qua bảo mật cấp dòng. Việc đã đăng nhập không bao giờ được xem là quyền hạn.',
  'web.useCases.clients.approach3':
    'Báo cáo cũng tuân theo cùng ranh giới đó, nên một báo cáo riêng cho từng khách hàng là hình dạng mặc định thay vì một bảng tính ai đó phải tự ráp lại bằng tay.',
  'web.useCases.clients.today':
    'Các dự án, tư cách thành viên giới hạn theo dự án và các chính sách bảo mật cấp dòng đứng sau chúng đã được xây dựng và kiểm thử, kể cả các bài kiểm thử thử đọc chéo giữa các dự án và xác nhận rằng chúng thất bại. Các gói được định cỡ theo số lượng dự án một nhóm cần. Chưa có gì được đăng lên một nền tảng từ bất kỳ dự án nào.',

  /* ---------------------------------------------------------------------- */
  /* Approval workflows                                                     */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': 'Quy trình phê duyệt',
  'web.useCases.approvals.lede':
    'Một sự phê duyệt chỉ có giá trị nếu thứ được phê duyệt chính là thứ được gửi đi.',
  'web.useCases.approvals.problem':
    'Việc phê duyệt thường diễn ra bên ngoài công cụ đăng bài. Một ảnh chụp màn hình được gửi cho khách hàng, khách hàng trả lời đồng ý, rồi nội dung lại thay đổi. Sự phê duyệt giờ đây chỉ tham chiếu đến một bản nháp mà không ai còn giữ, và công cụ hoàn toàn không biết, nên nó đăng bất cứ thứ gì nó được đưa lần cuối.',
  'web.useCases.approvals.approach1':
    'Một sự phê duyệt được gắn với đúng nội dung đã được xem lại. Chỉnh sửa một bản nháp đã phê duyệt sẽ làm mất hiệu lực phê duyệt đó và nói rõ trường nào đã thay đổi, thay vì âm thầm mang quyết định cũ đi tiếp.',
  'web.useCases.approvals.approach2':
    'Người xem lại có thể phê duyệt, yêu cầu thay đổi hoặc từ chối, và một bình luận là bắt buộc cho bất cứ điều gì khác ngoài phê duyệt, nên tác giả không bao giờ phải đoán mình cần sửa gì.',
  'web.useCases.approvals.approach3':
    'Quy tắc này nằm trong lớp ứng dụng dùng chung, nên ứng dụng web, REST API, máy chủ MCP, CLI và webhook đều tuân theo nó. Không bề mặt nào có lối tắt qua việc xem lại.',
  'web.useCases.approvals.today':
    'Các trạng thái phê duyệt, bề mặt xem lại, quy tắc phê duyệt lại và các sự kiện kiểm tra đứng sau chúng đã được xây dựng. Điều chưa được xây dựng là bước cuối cùng, vì chưa có kết nối nào hoàn tất định nghĩa hoàn thành của nó, nên một bài đăng đã phê duyệt chưa có nơi nào để đến.',

  /* ---------------------------------------------------------------------- */
  /* Cross-platform publishing                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': 'Đăng bài đa nền tảng',
  'web.useCases.crossPlatform.lede':
    'Một ý tưởng, một lần chỉnh sửa, và một phiên bản cho từng nền tảng tôn trọng những gì nền tảng đó thực sự chấp nhận.',
  'web.useCases.crossPlatform.problem':
    'Đăng cùng một nội dung ở mọi nơi tạo ra một phiên bản bị cắt bớt trên nền tảng này, thiếu tiêu đề bắt buộc trên nền tảng khác, và mang một liên kết mà nền tảng thứ ba âm thầm loại bỏ. Cách thay thế, viết lại bằng tay năm lần, là nơi công việc thực sự dồn vào.',
  'web.useCases.crossPlatform.approach1':
    'Một bản nháp gốc chứa ý tưởng. Mỗi tài khoản được chọn có phiên bản riêng, và một chỉnh sửa trên bản gốc chỉ áp dụng ở nơi phù hợp, nói rõ mục tiêu nào không thể nhận nó và vì sao.',
  'web.useCases.crossPlatform.approach2':
    'Việc kiểm tra chạy theo giới hạn đã ghi nhận cho từng nền tảng, đếm theo đúng cách nền tảng đó đếm, nên một giới hạn ký tự được kiểm tra theo grapheme ở nơi nền tảng dùng grapheme và theo đơn vị có trọng số ở nơi nền tảng dùng cách đó.',
  'web.useCases.crossPlatform.approach3':
    'Mọi giới hạn nền tảng hiển thị ở bất kỳ đâu trên trang này đều được tạo ra từ danh mục kết nối và đi kèm tài liệu mà nó bắt nguồn cùng ngày một người đã đọc tài liệu đó.',
  'web.useCases.crossPlatform.today':
    'Trình soạn thảo, các phiên bản theo từng mục tiêu, quy tắc kiểm tra và bộ dữ liệu giới hạn được tạo ra đã được xây dựng. Bước đăng bài thì chưa: chưa có kết nối nào được xác minh trong môi trường thực tế, nên một bản nháp đã qua kiểm tra có thể được lên lịch nội bộ nhưng không thể đến được một nền tảng.',
} as const;
