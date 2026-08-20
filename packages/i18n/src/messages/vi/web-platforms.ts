/**
 * The per platform scheduler pages.
 *
 * Rules that bind this file specifically:
 *
 *  - Not one string here names a platform, states a character ceiling, a file
 *    size or a capability. Every one of those comes from the generated
 *    datasets the page reads, so a page physically cannot claim support the
 *    connectors do not have. The strings below are labels and framing only.
 *  - The framing is always "what the platform requires" and "what this product
 *    intends to support". Never "what you can publish". No connector has
 *    passed its definition of done, so nothing publishes.
 *  - Anything a platform does not document is `common.unavailable`, never a
 *    zero and never a guess.
 */
export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'Lên lịch, theo từng nền tảng',
  'web.meta.schedule.description':
    'Những gì mỗi nền tảng trong nhóm khởi động yêu cầu từ một tài khoản đã kết nối, các giới hạn mà API chính thức của nó áp đặt, và sản phẩm này đã đi được đến đâu so với chúng.',
  'web.meta.schedulePlatform.title': 'Lên lịch cho {platform}',
  'web.meta.schedulePlatform.description':
    'Những gì {platform} yêu cầu từ một tài khoản đã kết nối, các giới hạn mà API chính thức của nó áp đặt, và phần nào trong số đó sản phẩm này đã xây dựng.',

  /* ---------------------------------------------------------------------- */
  /* Index                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Lên lịch, theo từng nền tảng',
  'web.schedule.index.lede':
    'Một trang cho mỗi nền tảng trong nhóm khởi động. Mỗi trang nêu rõ nền tảng đó yêu cầu gì từ một tài khoản đã kết nối, các giới hạn mà API chính thức của nó áp đặt, và quá trình xây dựng đang ở đâu. Mọi con số đều đi kèm tài liệu mà nó bắt nguồn và ngày một người đã đọc tài liệu đó.',
  'web.schedule.index.listLabel': 'Các nền tảng trong nhóm khởi động',
  'web.schedule.index.cohortNote':
    'Nhóm khởi động là tập hợp các nền tảng mà sản phẩm này đang được xây dựng để phục vụ. Đó là một kế hoạch, không phải danh sách khả dụng.',
  'web.schedule.index.limitsKnown': 'Đã ghi nhận giới hạn',
  'web.schedule.index.limitsUnknown': 'Chưa ghi nhận giới hạn',

  /* ---------------------------------------------------------------------- */
  /* Platform page                                                          */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Lên lịch cho {platform}',
  'web.schedule.platform.lede':
    'Những gì {platform} yêu cầu từ một tài khoản đã kết nối, các giới hạn mà API chính thức của nó áp đặt, và phần nào trong số đó sản phẩm này đã xây dựng đến nay.',

  'web.schedule.notice.title': 'Chưa có gì được đăng lên {platform}',
  'web.schedule.notice.body':
    'Chưa có kết nối nào hoàn tất định nghĩa hoàn thành của nó, và chưa có kết nối nào được xác minh trong môi trường thực tế. Trang này mô tả những gì nền tảng yêu cầu và những gì sản phẩm này dự định hỗ trợ. Nó không mô tả một bộ lên lịch đang hoạt động.',

  'web.schedule.requirements.title': '{platform} yêu cầu những gì',
  'web.schedule.requirements.accountTypes': 'Loại tài khoản',
  'web.schedule.requirements.restriction': 'Hạn chế của nền tảng',
  'web.schedule.requirements.cost': 'Chi phí API',
  'web.schedule.requirements.unavailable.title': 'Chưa có hồ sơ kết nối đã rà soát',
  'web.schedule.requirements.unavailable.body':
    'Nền tảng này gia nhập nhóm khởi động sau đợt nghiên cứu kết nối gần nhất, nên chưa có hồ sơ ghi ngày về yêu cầu tài khoản của nó để hiển thị. Nó sẽ xuất hiện ở đây khi một người đã đọc tài liệu chính thức và ghi lại điều đó.',
  'web.schedule.requirements.apiSource': 'Tài liệu API chính thức',
  'web.schedule.requirements.policySource': 'Chính sách nền tảng',

  /* ---------------------------------------------------------------------- */
  /* Limits                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Giới hạn mà {platform} áp đặt',
  'web.schedule.limits.lede':
    'Đọc cho một tài khoản mới kết nối không có tư cách được nâng cấp. Một nền tảng có thể tăng hoặc giảm bất kỳ giới hạn nào trong số này mà không báo cho ai, đó là lý do mỗi bộ giới hạn đi kèm ngày nó được đọc.',
  'web.schedule.limits.unavailable.title': 'Chưa ghi nhận giới hạn cho {platform}',
  'web.schedule.limits.unavailable.body':
    'Bản dựng này chưa có bộ chuyển đổi cho nền tảng này, nên chưa có giới hạn nào được ghi nhận để hiển thị. Một con số bịa ra sẽ tệ hơn là không có gì.',
  'web.schedule.limits.sourceLabel': 'Tài liệu chính thức của nền tảng',

  'web.schedule.limits.text': 'Nội dung văn bản',
  'web.schedule.limits.title_field': 'Trường tiêu đề',
  'web.schedule.limits.countingUnit': 'Cách đếm ký tự',
  'web.schedule.limits.links': 'Cách đếm liên kết',
  'web.schedule.limits.images': 'Số ảnh mỗi bài đăng',
  'web.schedule.limits.videos': 'Số video mỗi bài đăng',
  'web.schedule.limits.videoDuration': 'Thời lượng video',
  'web.schedule.limits.imageBytes': 'Ảnh lớn nhất',
  'web.schedule.limits.gifBytes': 'Ảnh động lớn nhất',
  'web.schedule.limits.videoBytes': 'Video lớn nhất',
  'web.schedule.limits.documentBytes': 'Tài liệu lớn nhất',
  'web.schedule.limits.altText': 'Văn bản thay thế',
  'web.schedule.limits.mimeTypes': 'Định dạng tệp được chấp nhận',
  'web.schedule.limits.markdown': 'Ký hiệu định dạng',

  'web.schedule.value.characters': '{count, plural, other {# ký tự}}',
  'web.schedule.value.files': '{count, plural, =0 {Không có} other {# tệp}}',
  'web.schedule.value.durationRange': 'Từ {min} đến {max}',
  'web.schedule.value.durationMax': 'Tối đa {max}',
  'web.schedule.value.markdownYes': 'Được chấp nhận',
  'web.schedule.value.markdownNo': 'Được đăng dưới dạng ký tự thường',

  'web.schedule.unit.utf16':
    'Theo đơn vị mã UTF-16, đây là cách hầu hết trình soạn thảo báo cáo số lượng ký tự.',
  'web.schedule.unit.grapheme':
    'Theo grapheme, nên một emoji gồm nhiều điểm mã vẫn chỉ tính là một ký tự.',
  'web.schedule.unit.weighted':
    'Theo cách tính có trọng số, trong đó hầu hết ký tự không phải Latin tính bằng hai thay vì một.',

  'web.schedule.link.none': 'Liên kết không được tính vào giới hạn.',
  'web.schedule.link.actual': 'Một liên kết tính đúng bằng số ký tự nó chiếm chỗ.',
  'web.schedule.link.fixed':
    'Mọi liên kết đều được viết lại thành bộ rút gọn của nền tảng và tính {count, plural, other {# ký tự}} bất kể độ dài thực của nó.',

  /* ---------------------------------------------------------------------- */
  /* Capability state                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'Những gì đã được xây dựng cho {platform}',
  'web.schedule.capabilities.lede':
    'Được tạo ra từ danh mục kết nối, không phải viết tay ở đây. "Nền tảng không cung cấp" là một sự thật về nền tảng và là kết luận cuối cùng. "Chưa được xây dựng" là một sự thật về sản phẩm này và là trạng thái mặc định trung thực trong khi chưa có kết nối nào hoàn tất định nghĩa hoàn thành của nó.',
  'web.schedule.capabilities.unavailable.title': 'Chưa có hồ sơ khả năng cho {platform}',
  'web.schedule.capabilities.unavailable.body':
    'Chưa có bộ chuyển đổi nào trong bản dựng này, nên danh mục chưa có gì để báo cáo. Dòng này sẽ xuất hiện trên ma trận khả năng ngay khi có điều gì đó thật để nói.',
  'web.schedule.capabilities.matrixLink': 'Xem ma trận khả năng đầy đủ',

  'web.schedule.next.title': 'Đi tiếp đến đâu',
  'web.schedule.next.body':
    'Ma trận khả năng chứa mọi nền tảng và mọi khả năng trong một bảng. Các trang trường hợp sử dụng mô tả các quy trình mà sản phẩm này đang được xây dựng xoay quanh.',

  /* ---------------------------------------------------------------------- */
  /* Post specs cluster (/specs)                                            */
  /* ---------------------------------------------------------------------- */

  'web.meta.specs.title': 'Thông số bài đăng, theo từng nền tảng',
  'web.meta.specs.description':
    'Các giới hạn mà mỗi nền tảng trong nhóm khởi động áp đặt lên một bài đăng, được tạo ra từ mã kết nối, mỗi giới hạn đi kèm tài liệu chính thức mà nó bắt nguồn và ngày một người đã đọc tài liệu đó.',
  'web.meta.specsPlatform.title': 'Thông số bài đăng cho {platform}',
  'web.meta.specsPlatform.description':
    'Mọi giới hạn được ghi nhận cho {platform}: nó là gì, tài liệu chính thức mà con số bắt nguồn, và ngày một người đã đọc tài liệu đó.',

  'web.specs.index.title': 'Thông số bài đăng, theo từng nền tảng',
  'web.specs.index.lede':
    'Một trang cho mỗi giới hạn, mỗi nền tảng. Mỗi trang nêu giá trị đã ghi nhận, tài liệu chính thức mà nó bắt nguồn và ngày một người đã đọc tài liệu đó. Không có gì ở đây được gõ tay: các giá trị được tạo ra từ mã kết nối, nên một trang chỉ tồn tại khi bộ dữ liệu có giá trị đó.',
  'web.specs.index.listLabel': 'Các nền tảng có giới hạn đã ghi nhận',
  'web.specs.index.count': '{count, plural, other {# giới hạn đã ghi nhận}}',
  'web.specs.index.missingTitle': 'Vì sao một nền tảng có thể thiếu ở đây',
  'web.specs.index.missingBody':
    'Một nền tảng chỉ xuất hiện khi bản dựng này có bộ chuyển đổi cho nó và bộ dữ liệu được tạo ra có ít nhất một giá trị. Một nền tảng không có gì được ghi nhận sẽ không có trang, vì một trang dựng trên con số bịa ra sẽ tệ hơn là không có trang nào cả.',
  'web.specs.index.methodTitle': 'Các giá trị này đến từ đâu',
  'web.specs.index.methodBody':
    'Bộ dữ liệu được tạo lại từ mã khả năng kết nối, cùng loại mã dùng để đo một bản nháp. Các giá trị được đọc cho một tài khoản mới kết nối không có tư cách được nâng cấp.',

  'web.specs.platform.listLabel': 'Giới hạn đã ghi nhận cho nền tảng này',
  'web.specs.platform.limitsTitle': 'Những gì được ghi nhận cho {platform}',
  'web.specs.platform.limitsBody':
    'Mỗi dòng liên kết đến một trang tự nêu giá trị của nó, kèm tài liệu mà nó bắt nguồn. Một giới hạn mà nền tảng này không ghi tài liệu sẽ không có dòng và không có trang.',

  'web.specs.detail.valueTitle': 'Giá trị đã ghi nhận',
  'web.specs.detail.sourceLabel': 'Tài liệu chính thức của nền tảng',
  'web.specs.detail.freshnessTitle': 'Mức độ cập nhật của thông tin này',
  'web.specs.detail.freshnessBody':
    'Một nền tảng có thể tăng hoặc giảm một giới hạn mà không công bố. Giá trị ở trên được đọc cho một tài khoản mới kết nối không có tư cách được nâng cấp, và ngày bên cạnh nguồn là ngày một người đã đọc tài liệu đó lần cuối.',
  'web.specs.detail.checkTitle': 'Kiểm tra một bài đăng thật với giới hạn này',
  'web.specs.detail.checkBody':
    'Công cụ kiểm tra trước khi đăng đo một bản nháp và một tệp phương tiện theo mọi giới hạn đã ghi nhận cho một nền tảng, ngay trong trình duyệt, không tải bất cứ thứ gì lên. Mở công cụ này từ trang này sẽ chọn sẵn nền tảng đó.',
  'web.specs.detail.checkLink': 'Mở công cụ kiểm tra trước khi đăng cho nền tảng này',
  'web.specs.detail.siblingTitle': 'Mọi thứ khác được ghi nhận cho nền tảng này',
  'web.specs.detail.siblingBody':
    'Các giá trị khác trong cùng bộ dữ liệu được tạo ra, có nguồn theo cùng cách.',
  'web.specs.detail.scheduleLink': 'Đọc toàn bộ trang nền tảng',

  'web.specs.notice.title': 'Một giới hạn của nền tảng, không phải một bộ lên lịch đang hoạt động',
  'web.specs.notice.body':
    'Chưa có kết nối nào hoàn tất định nghĩa hoàn thành của nó. Trang này nêu những gì nền tảng áp đặt. Nó không nói rằng sản phẩm này đã đăng lên đó.',

  'web.specs.constraint.characterLimit.name': 'Giới hạn ký tự',
  'web.specs.constraint.characterLimit.title': 'Giới hạn ký tự của {platform}',
  'web.specs.constraint.characterLimit.lede':
    'Nội dung văn bản dài nhất mà {platform} chấp nhận cho một bài đăng qua API chính thức của nó, đọc từ cùng bộ dữ liệu được tạo ra mà công cụ kiểm tra trước khi đăng dùng để đo một bản nháp.',
  'web.specs.constraint.characterLimit.description':
    'Giới hạn nội dung văn bản mà {platform} áp đặt cho một bài đăng, kèm tài liệu chính thức mà con số bắt nguồn và ngày một người đã đọc tài liệu đó.',

  'web.specs.constraint.titleLimit.name': 'Giới hạn độ dài tiêu đề',
  'web.specs.constraint.titleLimit.title': 'Giới hạn độ dài tiêu đề của {platform}',
  'web.specs.constraint.titleLimit.lede':
    'Tiêu đề dài nhất mà {platform} chấp nhận trong trường tiêu đề riêng mà API của nó cung cấp, đọc từ cùng bộ dữ liệu được tạo ra mà công cụ kiểm tra trước khi đăng dùng để đo một bản nháp.',
  'web.specs.constraint.titleLimit.description':
    'Giới hạn trường tiêu đề mà {platform} áp đặt, kèm tài liệu chính thức mà con số bắt nguồn và ngày một người đã đọc tài liệu đó.',

  'web.specs.constraint.imageSize.name': 'Giới hạn kích thước ảnh',
  'web.specs.constraint.imageSize.title': 'Giới hạn kích thước ảnh của {platform}',
  'web.specs.constraint.imageSize.lede':
    'Tệp ảnh tĩnh lớn nhất mà {platform} chấp nhận qua API chính thức của nó, đọc từ cùng bộ dữ liệu được tạo ra mà công cụ kiểm tra trước khi đăng dùng để đo một tệp.',
  'web.specs.constraint.imageSize.description':
    'Tệp ảnh lớn nhất mà {platform} chấp nhận, kèm tài liệu chính thức mà con số bắt nguồn và ngày một người đã đọc tài liệu đó.',

  'web.specs.constraint.videoSize.name': 'Giới hạn kích thước video',
  'web.specs.constraint.videoSize.title': 'Giới hạn kích thước video của {platform}',
  'web.specs.constraint.videoSize.lede':
    'Tệp video lớn nhất mà {platform} chấp nhận qua API chính thức của nó, đọc từ cùng bộ dữ liệu được tạo ra mà công cụ kiểm tra trước khi đăng dùng để đo một tệp.',
  'web.specs.constraint.videoSize.description':
    'Tệp video lớn nhất mà {platform} chấp nhận, kèm tài liệu chính thức mà con số bắt nguồn và ngày một người đã đọc tài liệu đó.',

  'web.specs.constraint.videoLength.name': 'Giới hạn thời lượng video',
  'web.specs.constraint.videoLength.title': 'Giới hạn thời lượng video của {platform}',
  'web.specs.constraint.videoLength.lede':
    'Một video đăng lên {platform} qua API chính thức của nó được phép dài bao lâu, đọc từ cùng bộ dữ liệu được tạo ra mà công cụ kiểm tra trước khi đăng dùng để đo một tệp.',
  'web.specs.constraint.videoLength.description':
    'Một video đăng lên {platform} được phép dài bao lâu, kèm tài liệu chính thức mà con số bắt nguồn và ngày một người đã đọc tài liệu đó.',

  'web.specs.constraint.imageCount.name': 'Số ảnh mỗi bài đăng',
  'web.specs.constraint.imageCount.title': 'Số ảnh mỗi bài đăng của {platform}',
  'web.specs.constraint.imageCount.lede':
    'Số ảnh mà {platform} chấp nhận trên một bài đăng qua API chính thức của nó, đọc từ cùng bộ dữ liệu được tạo ra mà công cụ kiểm tra trước khi đăng dùng để đo một bản nháp.',
  'web.specs.constraint.imageCount.description':
    'Số ảnh vừa với một bài đăng trên {platform}, kèm tài liệu chính thức mà con số bắt nguồn và ngày một người đã đọc tài liệu đó.',

  'web.specs.constraint.altTextLimit.name': 'Giới hạn văn bản thay thế',
  'web.specs.constraint.altTextLimit.title': 'Giới hạn văn bản thay thế của {platform}',
  'web.specs.constraint.altTextLimit.lede':
    'Văn bản thay thế dài nhất mà {platform} chấp nhận cho một ảnh đính kèm qua API chính thức của nó, đọc từ cùng bộ dữ liệu được tạo ra mà công cụ kiểm tra trước khi đăng dùng để đo một bản nháp.',
  'web.specs.constraint.altTextLimit.description':
    'Giới hạn văn bản thay thế mà {platform} áp đặt cho một ảnh đính kèm, kèm tài liệu chính thức mà con số bắt nguồn và ngày một người đã đọc tài liệu đó.',

  'web.specs.constraint.fileTypes.name': 'Định dạng tệp được chấp nhận',
  'web.specs.constraint.fileTypes.title': 'Định dạng tệp được {platform} chấp nhận',
  'web.specs.constraint.fileTypes.lede':
    'Các loại phương tiện mà {platform} chấp nhận qua API chính thức của nó, đọc từ cùng bộ dữ liệu được tạo ra mà công cụ kiểm tra trước khi đăng dùng để đo một tệp.',
  'web.specs.constraint.fileTypes.description':
    'Những loại phương tiện mà {platform} chấp nhận, kèm tài liệu chính thức mà danh sách bắt nguồn và ngày một người đã đọc tài liệu đó.',
} as const;
