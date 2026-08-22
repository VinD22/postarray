/**
 * The in-page product demonstration: the hero demonstration on the home page
 * and the guided walkthrough at `/demo`.
 *
 * Rules that bind this file specifically:
 *
 *  - Every panel on those surfaces is built from the real design system, so a
 *    reader is looking at the interface rather than at a drawing of it. The
 *    copy must therefore never describe something the interface does not do.
 *  - The content is sample content for a company that does not exist, and it
 *    says so in words, in the caption a screen reader reads with the figure.
 *  - No number here is an engagement number. There is no follower count, no
 *    reach figure and no score, because the product has no such data and a
 *    demonstration that invents one is a fabricated dashboard.
 *  - Nothing publishes today. No connector has passed provider verification,
 *    so the demonstration stops at the point the product stops: a scheduled
 *    post, an approval, and a receipt whose publishing half is unavailable.
 *  - The demonstration submits nothing. It has no form, no destination and no
 *    account behind it, and the copy must not suggest otherwise.
 */
export const webDemoMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata and navigation                                                 */
  /* ---------------------------------------------------------------------- */

  'web.meta.demo.title': 'Xem Relay hoạt động như thế nào',
  'web.meta.demo.description':
    'Một hành trình có hướng dẫn qua quy trình đăng bài, từ một dự án mới đến biên nhận, được hiển thị trong giao diện thật với nội dung mẫu. Chưa có gì được đăng, và hành trình này chỉ rõ ranh giới đó ở đâu.',

  'web.demo.nav.label': 'Xem hoạt động',
  'web.demo.nav.summary':
    'Một hành trình có hướng dẫn qua sản phẩm theo đúng thứ tự bạn gặp nó, được xây dựng từ giao diện thật với nội dung mẫu.',

  /* ---------------------------------------------------------------------- */
  /* The frame every demonstration panel sits in                             */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': 'Minh họa',
  'web.demo.frame.sample':
    'Một minh họa được xây dựng từ giao diện thật, chứa nội dung mẫu cho một công ty không có thật. Không phải tài khoản thật. Không có gì ở đây gửi đi bất cứ điều gì.',

  'web.demo.control.pause': 'Tạm dừng minh họa',
  'web.demo.control.play': 'Phát minh họa',
  'web.demo.control.replay': 'Phát lại minh họa',

  /* ---------------------------------------------------------------------- */
  /* The home page hero demonstration                                        */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.caption':
    'Một bản nháp trở thành một phiên bản cho từng nền tảng, nhận một thời điểm, và xuất hiện trên tuần. Nội dung mẫu, không phải tài khoản thật.',
  'web.demo.hero.more': 'Đi qua toàn bộ quy trình',

  /* ---------------------------------------------------------------------- */
  /* The walkthrough page                                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': 'Cách nó hoạt động, theo đúng thứ tự bạn gặp nó',
  'web.demo.lede':
    'Chín bước, từ một không gian làm việc trống đến hồ sơ những gì đã xảy ra. Mỗi bước cho thấy bề mặt bạn thực sự sẽ nhìn thấy, với nội dung mẫu trong đó. Không có gì trên trang này tự chuyển động, nên bạn có thể đọc theo tốc độ của riêng mình.',
  'web.demo.notice.title': 'Đây là một minh họa, không phải một tài khoản thật',
  'web.demo.notice.body':
    'Mỗi bảng ở đây là giao diện sản phẩm với nội dung mẫu bên trong. Chưa có kết nối nào hoàn tất xác minh nhà cung cấp, nên hiện tại chưa có gì được đăng lên bất kỳ nền tảng nào qua sản phẩm này. Ở đâu quy trình dừng lại, trang nói rõ điều đó thay vì vẽ tiếp phần còn lại.',
  'web.demo.contents.title': 'Chín bước',
  'web.demo.stepLabel': 'Bước {position} trên {total}',
  'web.demo.next': 'Tiếp theo: {step}',
  'web.demo.closing.pricing': 'Xem giá',
  'web.demo.closing.title': 'Đó là toàn bộ vòng lặp',
  'web.demo.closing.body':
    'Không có gì ở trên là bản dựng thử của một sản phẩm chúng tôi hy vọng sẽ xây dựng. Đó là giao diện đúng như hiện trạng, với nửa phần đăng bài được đánh dấu trung thực là chưa hoàn thiện.',

  /* ---------------------------------------------------------------------- */
  /* The six steps                                                           */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': 'Tạo một dự án',
  'web.demo.step.project.body':
    'Một dự án chứa tài khoản, bản nháp, phê duyệt và một múi giờ. Mọi truy vấn trong sản phẩm đều giới hạn trong phạm vi một dự án, trong dịch vụ ứng dụng và lại một lần nữa trong cơ sở dữ liệu, nên một khách hàng không thể vô tình thấy khách hàng khác.',

  'web.demo.step.connect.title': 'Kết nối một tài khoản',
  'web.demo.step.connect.body':
    'Kết nối chỉ chạy qua các API nền tảng chính thức, và cho bạn biết nền tảng yêu cầu gì ở tài khoản trước khi bạn bắt đầu. Hiện tại mọi kết nối đều dừng ở bước xác minh, đó là lý do mỗi dòng bên dưới nói rõ điều đó thay vì hiển thị dấu tích xanh.',

  'web.demo.step.compose.title': 'Viết một lần, thích ứng theo từng nền tảng',
  'web.demo.step.compose.body':
    'Bạn viết một bản nháp gốc. Chọn một tài khoản mở ra một bản ghi đè riêng cho tài khoản đó, với giới hạn riêng và bản xem trước riêng. Không có gì bạn viết cho LinkedIn thay đổi những gì X nhận được, và các kiểm tra dưới mỗi phiên bản chạy trước khi bất cứ điều gì được lên lịch.',

  'web.demo.step.variants.title': 'Xem chính xác những gì mỗi tài khoản nhận được',
  'web.demo.step.variants.body':
    'Một bản nháp trở thành một phiên bản cho mỗi tài khoản, mỗi phiên bản được viết cho nền tảng nó đến: một dòng ngắn hơn cho X, ghi chú phát hành đầy đủ cho LinkedIn, một nội dung và văn bản thay thế cho Instagram. Bạn chỉnh sửa bất kỳ phiên bản nào mà không đụng đến các phiên bản khác, và mỗi phiên bản mang theo kiểm tra áp dụng cho nó.',

  'web.demo.step.schedule.title': 'Cho nó một thời điểm, hoặc giao cho hàng đợi',
  'web.demo.step.schedule.body':
    'Một thời điểm được lưu dưới dạng một thời khắc cộng múi giờ của dự án, không bao giờ là một giờ địa phương đơn thuần, nên một lần đổi giờ mùa hè không làm dịch chuyển bất cứ điều gì bên dưới bạn. Hàng đợi là lối đi khác: nó lấy khung giờ tiếp theo được phép theo các quy tắc bạn đặt.',

  'web.demo.step.calendar.title': 'Theo dõi lịch',
  'web.demo.step.calendar.body':
    'Tuần hiển thị nền tảng, tài khoản, trạng thái và thời điểm cho mỗi bài đăng. Di chuyển một bài đăng vừa là một nút bấm vừa là kéo thả, nên lịch hoàn toàn có thể dùng được từ bàn phím.',

  'web.demo.step.receipt.title': 'Đọc biên nhận sau đó',
  'web.demo.step.receipt.body':
    'Mỗi lần thử đều ghi một biên nhận không thể thay đổi: ai đã viết nó, ai đã phê duyệt nó, theo chính sách nào, vào thời khắc nào. Nửa phần đăng bài của hồ sơ đó được viết bởi lượt chạy đăng bài, phần chưa tồn tại.',

  /* ---------------------------------------------------------------------- */
  /* Panel labels                                                            */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': 'Dự án',
  'web.demo.project.zone': 'Múi giờ: {zone}',
  'web.demo.project.scope':
    'Bản nháp, tài khoản, phê duyệt và biên nhận thuộc về dự án này và không nơi nào khác.',

  'web.demo.accounts.label': 'Tài khoản trong dự án này',
  'web.demo.accounts.state': 'Chưa hoàn tất xác minh',
  'web.demo.accounts.note':
    'Mỗi dòng sẽ mang theo tình trạng token, các quyền đã cấp và lần đăng thành công gần nhất. Không dòng nào trong số đó có thể đăng bài hôm nay.',

  'web.demo.master.label': 'Bản nháp gốc',
  'web.demo.master.project': 'Trong dự án {project}',

  'web.demo.variants.label': 'Những gì mỗi tài khoản nhận được',

  'web.demo.schedule.label': 'Đã lên lịch',
  'web.demo.schedule.value': '{when} theo {zone}',
  'web.demo.schedule.approval': 'Cần một sự phê duyệt trước khi bất cứ điều gì có thể được gửi đi.',
  'web.demo.schedule.queue':
    'Hàng đợi là lối đi khác: nó chọn khung giờ tiếp theo mà các quy tắc của bạn cho phép, theo múi giờ này.',

  'web.demo.week.label': 'Tuần này',
  'web.demo.week.caption': 'Cùng ba bài đăng trên lịch, đọc theo múi giờ của dự án.',
  'web.demo.week.empty': 'Chưa có gì được lên lịch',

  'web.demo.receipt.label': 'Biên nhận đến nay',
  'web.demo.receipt.pending':
    'Những gì đã được gửi đi, nền tảng trả lời ra sao, ID bài đăng bên ngoài và liên kết cố định đều được viết bởi lượt chạy đăng bài. Chúng vẫn chưa khả dụng cho đến khi một kết nối hoàn tất xác minh nhà cung cấp.',
  'web.demo.receipt.field.externalId': 'ID bài đăng bên ngoài',
  'web.demo.receipt.field.permalink': 'Liên kết cố định',

  /* ---------------------------------------------------------------------- */
  /* Sample content                                                          */
  /*                                                                         */
  /* Northbound Tools is the sample company the marketing pages already use.  */
  /* Its handles sit on the reserved `.example` domain and its people are     */
  /* first names with no surname, so nothing here can be mistaken for a real  */
  /* customer, a real account or a real endorsement.                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools (mẫu)',
  'web.demo.sample.actor': 'Ada, thành viên mẫu',
  'web.demo.sample.approver': 'Ravi, người xem lại mẫu',
  'web.demo.sample.policy': 'Cần một phê duyệt trước khi gửi',
  'web.demo.sample.master':
    'Northbound 2.4 đã ra mắt hôm nay. Nhập liệu nhanh hơn, tìm kiếm có phím tắt, và lỗi xuất dữ liệu mà hai bạn đã báo cáo đã được sửa.',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'Northbound 2.4 đã ra mắt. Nhập liệu nhanh hơn, tìm kiếm bằng phím tắt, và lỗi xuất dữ liệu đó đã được sửa.',
  'web.demo.sample.x.check': 'Số ký tự và thứ tự chuỗi bài',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    'Northbound 2.4 đã ra mắt hôm nay. Ghi chú phát hành giải thích đầy đủ các thay đổi về nhập liệu và bản sửa lỗi xuất dữ liệu.',
  'web.demo.sample.linkedin.check': 'Vai trò tổ chức và độ dài bài đăng',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    'Cùng bức ảnh phát hành, với một nội dung viết cho dòng thời gian và văn bản thay thế do một người viết.',
  'web.demo.sample.instagram.check': 'Loại tài khoản, tỷ lệ khung hình và văn bản thay thế',

  /* ---------------------------------------------------------------------- */
  /* The nine scene product tour                                             */
  /*                                                                         */
  /* The step names are the indicator's button labels, so they are short      */
  /* enough to sit in a row of nine and specific enough to be worth clicking. */
  /* They are also the labels of the stacked walkthrough a reader gets with   */
  /* reduced motion or no JavaScript, which is the same tour with the timing  */
  /* taken out rather than a reduced version of it.                           */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': 'Các bước trong hành trình',
  'web.demo.tour.jump': 'Hiện bước {position}: {step}',
  'web.demo.tour.step.project': 'Tạo một dự án',
  'web.demo.tour.step.connect': 'Kết nối tài khoản',
  'web.demo.tour.step.compose': 'Soạn một lần',
  'web.demo.tour.step.variants': 'Thích ứng theo từng nền tảng',
  'web.demo.tour.step.validate': 'Kiểm tra nó',
  'web.demo.tour.step.schedule': 'Cho nó một thời điểm',
  'web.demo.tour.step.week': 'Xem tuần này',
  'web.demo.tour.step.publish': 'Đăng và ghi lại',
  'web.demo.tour.step.digest': 'Đọc bản tóm tắt',

  /* ---------------------------------------------------------------------- */
  /* Checks (step 5)                                                         */
  /*                                                                         */
  /* Only checks the composer genuinely runs today: the per account character */
  /* limit (`validation.text_too_long`), alt text on every image             */
  /* (`validation.alt_text_missing`), and whether a first comment is allowed  */
  /* on the account it was written for (the `firstComment` capability).       */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': 'Kiểm tra trước khi lên lịch',
  'web.demo.validate.check.length': 'Giới hạn ký tự, theo từng tài khoản',
  'web.demo.validate.check.lengthDetail':
    'Mỗi phiên bản được đo theo giới hạn mà nền tảng cấp cho tài khoản đó.',
  'web.demo.validate.check.altText': 'Văn bản thay thế cho mọi ảnh',
  'web.demo.validate.check.altTextDetail':
    'Một ảnh không có mô tả, hoặc không được đánh dấu là trang trí, sẽ chặn việc lên lịch.',
  'web.demo.validate.check.firstComment': 'Bình luận đầu tiên được cho phép ở đây',
  'web.demo.validate.check.firstCommentDetail':
    'Bình luận đầu tiên chỉ được cung cấp cho các tài khoản mà nền tảng của chúng hỗ trợ tính năng này.',
  'web.demo.validate.note':
    'Những kiểm tra này chạy trong trình soạn thảo trước khi bất cứ điều gì được lên lịch, và lại một lần nữa trước khi bất cứ điều gì được gửi đi.',

  /* ---------------------------------------------------------------------- */
  /* Publish and receipt (step 8)                                            */
  /*                                                                         */
  /* The steps a scheduled post has really passed are completed. Everything   */
  /* the publish run would write is pending, because no connector has passed  */
  /* provider verification, so there is no publish run to write it.           */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': 'Đăng bài và hồ sơ của nó',
  'web.demo.live.step.approved': 'Đã phê duyệt bởi {approver}',
  'web.demo.live.step.queued': 'Đã vào hàng đợi cho khung giờ của nó',
  'web.demo.live.step.sent': 'Đã gửi đến nền tảng',
  'web.demo.live.step.confirmed': 'Đã được nền tảng xác nhận',
  'web.demo.live.badge.pending': 'Chưa đăng',
  'web.demo.live.badge.live': 'Đã lên trực tiếp',
  'web.demo.live.pending':
    'Hai bước cuối cùng được viết bởi lượt chạy đăng bài. Chưa có kết nối nào hoàn tất xác minh nhà cung cấp, nên chúng vẫn đang chờ và ID bài đăng bên ngoài cùng liên kết cố định vẫn chưa khả dụng.',

  /* ---------------------------------------------------------------------- */
  /* The weekly digest (step 9)                                              */
  /*                                                                         */
  /* Sentences about what the product did, never engagement figures. There is */
  /* no reach, no impression count and no score here, because the product has */
  /* none to read and a digest that invented one would be a fabricated        */
  /* dashboard with a friendlier voice.                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': 'Tuần của bạn, bằng những câu văn',
  'web.demo.digest.sample': 'Mẫu',
  'web.demo.digest.line.variants':
    'Ba phiên bản riêng cho từng nền tảng đã được gửi đi từ một bản nháp trong tuần này.',
  'web.demo.digest.line.earliest': 'Sáng thứ Ba là khung giờ sớm nhất của bạn.',
  'web.demo.digest.line.approval': 'Mỗi phiên bản đều được phê duyệt trước khi vào hàng đợi.',
  'web.demo.digest.line.alt': 'Mỗi ảnh đều mang văn bản thay thế do một người viết.',
  'web.demo.digest.footer':
    'Số liệu phân tích trực tiếp sẽ xuất hiện ở đây khi các bài đăng của bạn được đăng.',

  /* ---------------------------------------------------------------------- */
  /* The three added walkthrough steps                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': 'Kiểm tra trước khi nó được lên lịch',
  'web.demo.step.validate.body':
    'Trình soạn thảo đo mỗi phiên bản theo tài khoản nó được viết cho: giới hạn ký tự thật sự của tài khoản đó, văn bản thay thế cho mọi ảnh, và liệu nền tảng có cho phép bình luận đầu tiên hay không. Một phiên bản không qua được kiểm tra sẽ không thể được lên lịch.',

  'web.demo.step.publish.title': 'Đăng bài, và giữ lại hồ sơ',
  'web.demo.step.publish.body':
    'Một lượt chạy đăng bài gửi mỗi phiên bản vào đúng thời khắc của nó, ghi lại nền tảng trả lời ra sao, và viết một biên nhận không thể thay đổi. Lượt chạy đó là phần chưa tồn tại, nên hai bước cuối cùng bên dưới đang chờ thay vì được vẽ như đã hoàn tất.',

  'web.demo.step.digest.title': 'Đọc bản tóm tắt hằng tuần',
  'web.demo.step.digest.body':
    'Bản tóm tắt mô tả những gì sản phẩm đã làm bằng những câu văn: bao nhiêu phiên bản đã được gửi đi từ một bản nháp, khung giờ nào sớm nhất, điều gì đã được phê duyệt. Nó không mang theo số liệu tương tác nào, vì số liệu phân tích đến từ các nền tảng sau khi một bài đăng được đăng và chưa có gì được đăng cả.',
} as const;
