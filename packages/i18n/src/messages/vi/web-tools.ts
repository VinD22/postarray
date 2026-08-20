/**
 * The free tools on the public site.
 *
 * These pages exist because this repository already knows every launch cohort
 * platform's real publishing limits from its connector capability code. A tool
 * here may therefore state a number, but only a number the generated dataset
 * carries, always beside the official source and the date a person read it.
 *
 * Rules that bind this file specifically:
 *
 *  - A tool never claims the product publishes anywhere. Nothing in the launch
 *    cohort is verified for production yet, and these pages say so.
 *  - Every calculation described here runs in the reader's browser. Copy that
 *    promises privacy must stay true of the component that renders it.
 *  - No tool writes, rewrites, suggests or scores content. No tool looks up a
 *    handle, a follower count or anything else that would need an unofficial
 *    endpoint.
 *  - A limit we do not have is "unavailable". Never zero, never a guess.
 */
export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': 'Công cụ đăng bài miễn phí',
  'web.meta.tools.description':
    'Các công cụ nhỏ, riêng tư dành cho người đăng bài trên nhiều nền tảng: kiểm tra giới hạn theo từng nền tảng, trình tạo UTM, kiểm tra độ dài tiêu đề YouTube và bộ lập kế hoạch múi giờ.',
  'web.meta.tools.preflight.title': 'Công cụ kiểm tra trước khi đăng',
  'web.meta.tools.preflight.description':
    'Kiểm tra một bản nháp theo giới hạn văn bản và phương tiện đã đăng của mười nền tảng, kèm nguồn và ngày mỗi giới hạn được đọc.',
  'web.meta.tools.utm.title': 'Trình tạo liên kết UTM',
  'web.meta.tools.utm.description':
    'Soạn một URL chiến dịch có gắn thẻ và xem ý nghĩa của từng tham số UTM. Chạy hoàn toàn trong trình duyệt của bạn.',
  'web.meta.tools.youtubeTitle.title': 'Công cụ kiểm tra độ dài tiêu đề YouTube',
  'web.meta.tools.youtubeTitle.description':
    'Đo một tiêu đề YouTube theo giới hạn đã ghi trong tài liệu, đếm theo cách một người đếm ký tự.',
  'web.meta.tools.timeZone.title': 'Bộ lập kế hoạch múi giờ và giờ mùa hè',
  'web.meta.tools.timeZone.description':
    'Xem một thời điểm đăng bài trên nhiều múi giờ khán giả và tìm những tuần mà việc chuyển giờ mùa hè làm dịch chuyển giờ địa phương.',
  'web.meta.tools.engagementRate.title': 'Công cụ tính tỷ lệ tương tác',
  'web.meta.tools.engagementRate.description':
    'Chia lượt tương tác cho phạm vi tiếp cận, người theo dõi hoặc lượt hiển thị. Ba phép tính đơn giản, không có chuẩn mực bịa ra.',

  /* ---------------------------------------------------------------------- */
  /* Shared tool furniture                                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'Công cụ miễn phí',
  'web.tools.index.summary':
    'Các công cụ tính toán nhỏ dựa trên cùng dữ liệu giới hạn nền tảng mà các kết nối của chúng tôi đọc.',
  'web.tools.index.lede':
    'Bốn công cụ nhỏ, dựa trên cùng dữ liệu giới hạn nền tảng mà các kết nối của chúng tôi dùng. Không cần tài khoản, không tải lên, không theo dõi những gì bạn gõ.',
  'web.tools.index.dataTitle': 'Các con số này đến từ đâu',
  'web.tools.index.dataBody':
    'Mỗi giới hạn được tạo ra từ mã khả năng kết nối trong kho mã này, và mỗi dòng nền tảng đi kèm trang tài liệu chính thức mà nó bắt nguồn cùng ngày một người đã đọc trang đó.',
  'web.tools.index.honesty':
    'Các công cụ này không đăng bất cứ điều gì. Chưa có kết nối nào hoàn tất xác minh nhà cung cấp, nên chưa có gì ở đây kết nối một tài khoản.',
  'web.tools.shared.privacyTitle': 'Công cụ này chạy trong trình duyệt của bạn',
  'web.tools.shared.privacyBody':
    'Mọi thứ bạn gõ đều ở lại trên trang này. Không có yêu cầu nào gửi đến máy chủ, không lưu trữ và không có sự kiện phân tích nào mang theo nội dung của bạn.',
  'web.tools.shared.sourceLink': 'Tài liệu nền tảng',
  'web.tools.shared.sourceRead': 'Đọc vào {date}',
  'web.tools.shared.unavailable': 'không khả dụng',
  'web.tools.shared.unavailableWhy':
    'Chúng tôi chưa có kết nối cho nền tảng này, nên chưa có giới hạn đã xác minh để hiển thị. Chúng tôi thà không nói gì còn hơn đoán mò.',
  'web.tools.shared.copy': 'Sao chép',
  'web.tools.shared.copied': 'Đã sao chép',
  'web.tools.shared.copyFailed': 'Trình duyệt của bạn đã chặn việc sao chép. Hãy chọn văn bản và sao chép nó.',
  'web.tools.shared.faqTitle': 'Câu hỏi',
  'web.tools.shared.baselineTitle': 'Các con số này mô tả tài khoản nào',
  'web.tools.shared.baselineBody':
    'Trường hợp thận trọng nhất: một tài khoản mới kết nối không có tư cách được nâng cấp. Một số nền tảng nâng giới hạn khi một kênh hoặc một doanh nghiệp được xác minh, và ở đâu điều đó xảy ra, trang sẽ nói rõ.',
  'web.tools.shared.otherTools': 'Công cụ khác',

  /* ---------------------------------------------------------------------- */
  /* Tool names and one line summaries, shared by the index and the footer   */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'Công cụ kiểm tra trước khi đăng',
  'web.tools.preflight.summary':
    'Một bản nháp, được kiểm tra theo giới hạn văn bản và phương tiện của mười nền tảng cùng lúc.',
  'web.tools.utm.name': 'Trình tạo liên kết UTM',
  'web.tools.utm.summary': 'Xây dựng một URL chiến dịch có gắn thẻ mà không làm hỏng chuỗi truy vấn đã có.',
  'web.tools.youtubeTitle.name': 'Công cụ kiểm tra độ dài tiêu đề YouTube',
  'web.tools.youtubeTitle.summary': 'Đo một tiêu đề theo cách một người đếm ký tự.',
  'web.tools.timeZone.name': 'Bộ lập kế hoạch múi giờ và giờ mùa hè',
  'web.tools.timeZone.summary':
    'Một thời điểm đăng bài trên nhiều múi giờ khán giả, với các dịch chuyển giờ mùa hè được đánh dấu.',
  'web.tools.engagementRate.name': 'Công cụ tính tỷ lệ tương tác',
  'web.tools.engagementRate.summary':
    'Lượt tương tác chia cho phạm vi tiếp cận, người theo dõi hoặc lượt hiển thị. Không tra cứu gì, không so chuẩn gì.',

  /* ---------------------------------------------------------------------- */
  /* Post preflight checker                                                  */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'Công cụ kiểm tra trước khi đăng',
  'web.tools.preflight.lede':
    'Dán một bản nháp, chọn các nền tảng bạn đăng, và xem nền tảng nào sẽ từ chối nó trước khi bạn phát hiện qua một lỗi API.',
  'web.tools.preflight.explainer.title': 'Vì sao bộ đếm ký tự thôi là chưa đủ',
  'web.tools.preflight.explainer.body':
    'Các nền tảng không đồng nhất về định nghĩa một ký tự. Một số đếm theo đơn vị mã, nên một emoji tốn hai. Một số đếm theo grapheme, nên một lá cờ hay một emoji gia đình chỉ tốn một. Một số viết lại mọi liên kết thành một độ dài cố định, nên một URL 200 ký tự tốn bằng một URL 20 ký tự. Công cụ này áp dụng riêng từng quy tắc của mỗi nền tảng.',
  'web.tools.preflight.explainer.counting':
    'Bản nháp được đo bằng bộ phân đoạn Intl của trình duyệt, tách văn bản thành các đơn vị mà người đọc gọi là ký tự, rồi được điều chỉnh theo quy tắc của nền tảng.',
  'web.tools.preflight.field.draft.label': 'Bản nháp của bạn',
  'web.tools.preflight.field.draft.help':
    'Dán nội dung bài đăng. Liên kết được phát hiện tự động để chi phí của chúng được áp dụng theo từng nền tảng.',
  'web.tools.preflight.field.platforms.label': 'Nền tảng cần kiểm tra',
  'web.tools.preflight.field.platforms.help': 'Chọn bao nhiêu nền tảng tùy bạn đăng.',
  'web.tools.preflight.field.mediaKind.label': 'Phương tiện đính kèm',
  'web.tools.preflight.field.mediaKind.none': 'Không có phương tiện',
  'web.tools.preflight.field.mediaKind.image': 'Ảnh',
  'web.tools.preflight.field.mediaKind.video': 'Một video',
  'web.tools.preflight.field.mediaCount.label': 'Bao nhiêu ảnh',
  'web.tools.preflight.field.byteSize.label': 'Dung lượng tệp, tính bằng megabyte',
  'web.tools.preflight.field.byteSize.help': 'Tệp đơn lớn nhất. Để trống để bỏ qua.',
  'web.tools.preflight.field.duration.label': 'Độ dài video, tính bằng giây',
  'web.tools.preflight.field.duration.help': 'Để trống để bỏ qua kiểm tra thời lượng.',
  'web.tools.preflight.field.width.label': 'Chiều rộng phương tiện, tính bằng pixel',
  'web.tools.preflight.field.height.label': 'Chiều cao phương tiện, tính bằng pixel',
  'web.tools.preflight.field.dimensions.help':
    'Tùy chọn. Chỉ dùng để hiển thị tỷ lệ khung hình bạn sẽ đăng.',
  'web.tools.preflight.results.title': 'Kết quả theo từng nền tảng',
  'web.tools.preflight.results.empty': 'Chọn ít nhất một nền tảng để xem kết quả.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Không có gì bị chặn} other {# sẽ thất bại}}, {warning, plural, =0 {không có cảnh báo} other {# cần chú ý}}.',
  'web.tools.preflight.status.pass': 'Vừa vặn',
  'web.tools.preflight.status.warning': 'Đáng kiểm tra',
  'web.tools.preflight.status.fail': 'Sẽ thất bại',
  'web.tools.preflight.status.unavailable': 'Không khả dụng',
  'web.tools.preflight.count.label':
    '{count} trên {limit} {unit, select, grapheme {ký tự} utf16 {đơn vị mã} weighted {ký tự có trọng số} other {ký tự}}',
  'web.tools.preflight.finding.textOver':
    'Vượt giới hạn {over, plural, other {# ký tự}}.',
  'web.tools.preflight.finding.textNear': 'Còn cách giới hạn {remaining} ký tự.',
  'web.tools.preflight.finding.textFits': 'Nội dung vừa vặn.',
  'web.tools.preflight.finding.linkFixed':
    'Mọi liên kết đều được viết lại thành một độ dài cố định, nên mỗi liên kết tốn {cost} ký tự bất kể độ dài thực của nó.',
  'web.tools.preflight.finding.linkActual': 'Liên kết được tính đúng bằng số ký tự nó chiếm chỗ.',
  'web.tools.preflight.finding.imagesOver':
    'Nền tảng này chấp nhận {limit, plural, =0 {không ảnh nào} other {# ảnh}} trong một bài đăng.',
  'web.tools.preflight.finding.videosOver':
    'Nền tảng này chấp nhận {limit, plural, =0 {không video nào} other {# video}} trong một bài đăng.',
  'web.tools.preflight.finding.bytesOver': 'Tệp này lớn hơn giới hạn {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    'Chưa có giới hạn dung lượng công bố cho loại phương tiện này, nên dung lượng chưa được kiểm tra.',
  'web.tools.preflight.finding.durationOver': 'Dài hơn giới hạn {limit} giây.',
  'web.tools.preflight.finding.durationUnder': 'Ngắn hơn mức tối thiểu {limit} giây.',
  'web.tools.preflight.finding.durationUnknown':
    'Chưa có giới hạn thời lượng công bố, nên độ dài chưa được kiểm tra.',
  'web.tools.preflight.finding.altText':
    'Văn bản thay thế được chấp nhận đến {limit} ký tự, đáng để tận dụng.',
  'web.tools.preflight.finding.ratio': 'Bạn sẽ đăng với tỷ lệ khoảng {ratio} trên 1.',
  'web.tools.preflight.faq.counting.q': 'Bạn đếm ký tự như thế nào?',
  'web.tools.preflight.faq.counting.a':
    'Theo grapheme, dùng bộ phân đoạn Intl của trình duyệt, đơn vị mà người đọc hiểu là một ký tự. Ở đâu một nền tảng ghi tài liệu một quy tắc khác, chẳng hạn đếm theo đơn vị mã hoặc tính giá cố định cho mỗi liên kết, quy tắc đó được áp dụng thêm.',
  'web.tools.preflight.faq.accuracy.q': 'Các giới hạn này cập nhật đến mức nào?',
  'web.tools.preflight.faq.accuracy.a':
    'Mỗi giới hạn được tạo ra từ mã kết nối trong kho mã của chúng tôi thay vì được gõ tay vào một trang, và mỗi dòng nền tảng hiển thị tài liệu chính thức mà nó bắt nguồn cùng ngày một người đã đọc tài liệu đó. Nếu một nền tảng thay đổi một con số, cách sửa chỉ là một thay đổi mã và mọi công cụ ở đây đều theo kịp.',
  'web.tools.preflight.faq.privacy.q': 'Bản nháp của tôi có được tải lên không?',
  'web.tools.preflight.faq.privacy.a':
    'Không. Việc kiểm tra chạy trong trình duyệt của bạn. Không có yêu cầu nào mang theo văn bản của bạn, không có gì được lưu trữ, và đóng thẻ trình duyệt là đủ để bỏ đi tất cả.',
  'web.tools.preflight.faq.publish.q': 'Công cụ này có thể đăng bài giúp tôi không?',
  'web.tools.preflight.faq.publish.a':
    'Chưa phải hôm nay. Chưa có kết nối nào hoàn tất xác minh nhà cung cấp, nên chưa có gì trên trang này đăng lên một nền tảng. Trang này là một công cụ kiểm tra giới hạn, không phải một trình soạn thảo.',

  /* ---------------------------------------------------------------------- */
  /* UTM builder                                                             */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'Trình tạo liên kết UTM',
  'web.tools.utm.lede':
    'Thêm tham số chiến dịch vào một URL mà không làm mất chuỗi truy vấn đã có, và không đoán mò tham số nào có nghĩa là gì.',
  'web.tools.utm.explainer.title': 'Mỗi tham số dùng để làm gì',
  'web.tools.utm.explainer.body':
    'Tham số UTM được các công cụ phân tích đọc, không phải nền tảng bạn đăng bài lên. Chúng đi kèm trong URL, nên bất kỳ ai thấy liên kết cũng thấy chúng. Hãy giữ chúng ngắn gọn, chữ thường và nhất quán, vì hai cách viết khác nhau cho cùng một chiến dịch sẽ trở thành hai dòng trong báo cáo.',
  'web.tools.utm.field.url.label': 'URL đích',
  'web.tools.utm.field.url.help': 'Trang bạn muốn mọi người đến, bao gồm cả https.',
  'web.tools.utm.field.url.invalid': 'Đó không phải là một URL http hay https hợp lệ.',
  'web.tools.utm.field.source.label': 'Nguồn chiến dịch',
  'web.tools.utm.field.source.help': 'Lượt nhấp đến từ đâu. Ví dụ: tên một nền tảng.',
  'web.tools.utm.field.medium.label': 'Kênh chiến dịch',
  'web.tools.utm.field.medium.help': 'Loại liên kết. Ví dụ: mạng xã hội, email hoặc giới thiệu.',
  'web.tools.utm.field.campaign.label': 'Tên chiến dịch',
  'web.tools.utm.field.campaign.help': 'Đợt ra mắt, chương trình khuyến mãi hoặc chủ đề mà liên kết này thuộc về.',
  'web.tools.utm.field.term.label': 'Từ khóa chiến dịch',
  'web.tools.utm.field.term.help': 'Tùy chọn. Theo truyền thống là từ khóa trả phí.',
  'web.tools.utm.field.content.label': 'Nội dung chiến dịch',
  'web.tools.utm.field.content.help':
    'Tùy chọn. Phân biệt hai liên kết đến cùng một trang, ví dụ hai phiên bản của một bài đăng.',
  'web.tools.utm.result.title': 'URL đã gắn thẻ của bạn',
  'web.tools.utm.result.empty': 'Nhập một URL đích để xem kết quả.',
  'web.tools.utm.result.label': 'URL đã soạn',
  'web.tools.utm.result.preserved':
    'Chuỗi truy vấn đã có sẵn trên URL của bạn được giữ nguyên đúng như bạn đã gõ.',
  'web.tools.utm.result.replaced':
    'URL của bạn đã có sẵn một trong các tham số này. Giá trị bạn nhập ở đây thay thế nó.',
  'web.tools.utm.faq.encoding.q': 'Điều gì xảy ra với khoảng trắng và dấu?',
  'web.tools.utm.faq.encoding.a':
    'Chúng được mã hóa phần trăm, đó là điều giúp một liên kết sống sót khi được dán vào một bài đăng. Một khoảng trắng trở thành dấu cộng và một chữ có dấu trở thành dạng đã mã hóa của nó, và các công cụ phân tích giải mã cả hai trở lại.',
  'web.tools.utm.faq.existing.q': 'Nó có làm hỏng một URL đã có sẵn tham số không?',
  'web.tools.utm.faq.existing.a':
    'Không. Các tham số hiện có được giữ nguyên theo thứ tự ban đầu, và chỉ tham số UTM bạn điền vào mới được thêm hoặc thay thế. Một mảnh đoạn ở cuối URL vẫn ở lại cuối.',
  'web.tools.utm.faq.privacy.q': 'URL của tôi có được gửi đi đâu không?',
  'web.tools.utm.faq.privacy.a':
    'Không. URL được soạn ngay trong trình duyệt của bạn và không bao giờ rời khỏi trang này.',

  /* ---------------------------------------------------------------------- */
  /* YouTube title length checker                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'Công cụ kiểm tra độ dài tiêu đề YouTube',
  'web.tools.youtubeTitle.lede':
    'Một tiêu đề dài hơn giới hạn dù chỉ một ký tự sẽ bị từ chối khi tải lên. Một tiêu đề chỉ đơn thuần dài sẽ bị cắt ở một chỗ bạn không chọn.',
  'web.tools.youtubeTitle.explainer.title': 'Hai giới hạn khác nhau',
  'web.tools.youtubeTitle.explainer.body':
    'Giới hạn cứng là những gì điểm cuối tải lên chấp nhận. Nơi một tiêu đề được hiển thị là một câu hỏi khác: kết quả tìm kiếm, thanh bên và điện thoại đều cắt tiêu đề ở một điểm khác nhau, và không điểm cắt nào trong số đó được công bố. Công cụ này nêu giới hạn đã ghi trong tài liệu và cho bạn thấy hình dạng tiêu đề của bạn, và nó không bịa ra một con số cắt bớt.',
  'web.tools.youtubeTitle.field.title.label': 'Tiêu đề video',
  'web.tools.youtubeTitle.field.title.help': 'Được đếm theo grapheme, nên một emoji tốn một.',
  'web.tools.youtubeTitle.result.count': '{count} trên {limit} ký tự',
  'web.tools.youtubeTitle.result.over':
    'Vượt {over, plural, other {# ký tự}}. Việc tải lên sẽ bị từ chối.',
  'web.tools.youtubeTitle.result.fits': 'Nằm trong giới hạn đã ghi trong tài liệu.',
  'web.tools.youtubeTitle.result.front':
    '{count} ký tự đầu tiên mang trọng lượng nhiều nhất, vì đó gần đúng là chỗ mà một bố cục hẹp có. Tiêu đề của bạn bắt đầu: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'Giới hạn tiêu đề không khả dụng trong bản dựng này, nên không có gì được kiểm tra ở đây.',
  'web.tools.youtubeTitle.faq.limit.q': 'Giới hạn này đến từ đâu?',
  'web.tools.youtubeTitle.faq.limit.a':
    'Từ tài liệu tham khảo videos insert chính thức, được tạo vào trang này từ cùng mã kết nối mà bộ tải lên của chúng tôi sẽ dùng. Ngày một người đọc trang đó lần cuối được hiển thị bên cạnh con số.',
  'web.tools.youtubeTitle.faq.truncation.q': 'YouTube cắt một tiêu đề ở chính xác đâu?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'Điều đó phụ thuộc vào bề mặt hiển thị và khung nhìn, và YouTube không công bố một số lượng ký tự cho việc đó. Chúng tôi hiển thị giới hạn, vốn đã được ghi trong tài liệu, và chúng tôi không in ra một con số cắt bớt vì đó sẽ là đoán mò.',
  'web.tools.youtubeTitle.faq.emoji.q': 'Một emoji có được tính là một ký tự không?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'Trong bộ đếm này thì có, vì chúng tôi đếm theo grapheme. Một nền tảng đếm theo đơn vị mã nội bộ có thể tính nhiều hơn cho cùng một emoji, đó là lý do công cụ kiểm tra trước khi đăng áp dụng riêng từng quy tắc của mỗi nền tảng.',

  /* ---------------------------------------------------------------------- */
  /* Time zone and daylight saving planner                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'Bộ lập kế hoạch múi giờ và giờ mùa hè',
  'web.tools.timeZone.lede':
    'Một khung giờ hằng tuần trông ổn định trên lịch của bạn lại dịch chuyển đối với một nửa khán giả của bạn hai lần một năm. Công cụ này cho thấy ở đâu và khi nào.',
  'web.tools.timeZone.explainer.title': 'Vì sao một giờ địa phương cố định không phải là một thời điểm cố định',
  'web.tools.timeZone.explainer.body':
    'Một thời điểm chỉ có ý nghĩa khi đi kèm một múi giờ. Các múi giờ thay đổi độ lệch của chúng vào những ngày khác nhau theo từng quốc gia, và hai vùng cách nhau năm giờ vào tháng Một có thể chỉ còn cách nhau bốn giờ vào tháng Tư. Một lịch đăng được lưu dưới dạng một thời điểm cộng một múi giờ sẽ vượt qua điều đó. Một lịch đăng lưu dưới dạng một giờ địa phương thì không.',
  'web.tools.timeZone.field.date.label': 'Ngày',
  'web.tools.timeZone.field.time.label': 'Giờ',
  'web.tools.timeZone.field.zone.label': 'Múi giờ của bạn',
  'web.tools.timeZone.field.audience.label': 'Múi giờ khán giả',
  'web.tools.timeZone.field.audience.help': 'Chọn các múi giờ mà độc giả của bạn thực sự ở đó.',
  'web.tools.timeZone.result.title': 'Cùng một thời điểm, ở mọi nơi bạn đã chọn',
  'web.tools.timeZone.result.empty': 'Chọn ít nhất một múi giờ khán giả.',
  'web.tools.timeZone.result.shift':
    'Một thay đổi giờ mùa hè rơi vào giữa ngày này và cùng thứ trong tuần bốn tuần sau, nên giờ địa phương sẽ dịch chuyển.',
  'web.tools.timeZone.result.stable': 'Không có thay đổi độ lệch trong bốn tuần tới.',
  'web.tools.timeZone.result.later': 'Bốn tuần sau, {time}.',
  'web.tools.timeZone.result.invalidDate': 'Nhập một ngày và một giờ để xem so sánh.',
  'web.tools.timeZone.faq.dst.q': 'Giờ dịch chuyển theo hướng nào?',
  'web.tools.timeZone.faq.dst.a':
    'Điều đó phụ thuộc vào múi giờ và hướng của sự thay đổi, đó là lý do bảng hiển thị giờ địa phương thực tế sau bốn tuần thay vì mô tả quy tắc. Độ lệch cho mỗi múi giờ được đọc từ cơ sở dữ liệu múi giờ trong trình duyệt của bạn.',
  'web.tools.timeZone.faq.storage.q': 'Một bài đăng đã lên lịch nên lưu thời điểm của nó như thế nào?',
  'web.tools.timeZone.faq.storage.a':
    'Dưới dạng một thời điểm cộng múi giờ IANA mà người đó đã chọn, không bao giờ là một giờ địa phương đơn thuần. Đó là những gì chúng tôi làm nội bộ, và đó là lý do một bài đăng được lên lịch trước một lần đổi giờ vẫn đến đúng giờ địa phương dự định.',

  /* ---------------------------------------------------------------------- */
  /* Engagement rate calculator                                              */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': 'Công cụ tính tỷ lệ tương tác',
  'web.tools.engagementRate.lede':
    'Nhập các con số mà chính bảng điều khiển của bạn đã hiển thị cho bạn. Công cụ này chia chúng theo ba cách rồi dừng lại: không chuẩn mực, không ngưỡng "tốt", không có gì chúng tôi thực sự không có.',
  'web.tools.engagementRate.explainer.title': 'Vì sao có ba mẫu số, không phải một',
  'web.tools.engagementRate.explainer.body':
    'Phạm vi tiếp cận, người theo dõi và lượt hiển thị trả lời những câu hỏi khác nhau. Tỷ lệ theo phạm vi tiếp cận cho bạn biết những người thực sự thấy bài đăng đã phản hồi ra sao. Tỷ lệ theo người theo dõi cho bạn biết bao nhiêu phần khán giả của bạn đã tương tác, dù bài đăng có tiếp cận tất cả mọi người hay không. Tỷ lệ theo lượt hiển thị đếm mọi lượt xem, kể cả lượt lặp lại. So sánh một tỷ lệ tính theo cách này với một tỷ lệ tính theo cách khác là một nguồn phổ biến khiến một con số tương tác trông có vẻ sai.',
  'web.tools.engagementRate.field.interactions.label': 'Lượt tương tác',
  'web.tools.engagementRate.field.interactions.help':
    'Lượt thích, bình luận, chia sẻ và lưu cộng lại, từ bài đăng bạn đang đo.',
  'web.tools.engagementRate.field.reach.label': 'Phạm vi tiếp cận',
  'web.tools.engagementRate.field.reach.help': 'Số tài khoản đã thấy bài đăng ít nhất một lần.',
  'web.tools.engagementRate.field.followers.label': 'Người theo dõi',
  'web.tools.engagementRate.field.followers.help': 'Quy mô tài khoản tại thời điểm đăng bài.',
  'web.tools.engagementRate.field.impressions.label': 'Lượt hiển thị',
  'web.tools.engagementRate.field.impressions.help': 'Tổng số lượt xem, kể cả một người đã xem hai lần.',
  'web.tools.engagementRate.result.title': 'Tỷ lệ tương tác, theo ba cách',
  'web.tools.engagementRate.result.empty': 'không khả dụng',
  'web.tools.engagementRate.result.note':
    'Không có tỷ lệ tốt phổ quát nào để so sánh. Nó phụ thuộc vào nền tảng, định dạng, quy mô khán giả và ngành nghề, và bất kỳ con số đơn lẻ nào được đưa ra như một chuẩn mực đều là một phỏng đoán khoác áo dữ liệu.',
  'web.tools.engagementRate.basis.reach': 'Theo phạm vi tiếp cận',
  'web.tools.engagementRate.basis.followers': 'Theo người theo dõi',
  'web.tools.engagementRate.basis.impressions': 'Theo lượt hiển thị',
  'web.tools.engagementRate.faq.formula.q': 'Công thức thực sự là gì?',
  'web.tools.engagementRate.faq.formula.a':
    'Lượt tương tác chia cho mẫu số bạn chọn, hiển thị dưới dạng phần trăm. Lượt tương tác ở đây nghĩa là lượt thích, bình luận, chia sẻ và lưu cộng lại; một số nền tảng báo cáo chúng riêng lẻ, trong trường hợp đó hãy tự cộng chúng trước khi nhập tổng vào.',
  'web.tools.engagementRate.faq.basis.q': 'Tôi nên dùng mẫu số nào?',
  'web.tools.engagementRate.faq.basis.a':
    'Bất kỳ mẫu số nào nền tảng của bạn báo cáo cùng với bài đăng, để cả hai con số đến từ cùng một cửa sổ đo lường. So sánh một tỷ lệ theo phạm vi tiếp cận trên một bài đăng với một tỷ lệ theo người theo dõi trên bài đăng khác không phải là một so sánh công bằng dù cả hai đều được gọi là tỷ lệ tương tác.',
} as const;
