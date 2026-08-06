/** vi beta catalog namespace. */
export const webAnalyticsMessages = {
  'analytics.chart.legend': 'Chuỗi hiển thị trong biểu đồ này',
  'analytics.tab.overview': 'Tổng quan',
  'analytics.tab.experiments': 'Thí nghiệm',
  'analytics.tab.links': 'Liên kết được theo dõi',
  'analytics.tab.label': 'Phần phân tích',
  'analytics.question.baseline': 'Những bài đăng nào đã di chuyển khỏi đường cơ sở của chính bạn?',
  'analytics.question.baselineHelp':
    'Mỗi bài đăng được so sánh với các bài đăng gần đây của bạn trên cùng một tài khoản và ở cùng định dạng. Không có gì ở đây so sánh bạn với một không gian làm việc khác hoặc một công ty khác.',
  'analytics.question.accounts': 'Những tài khoản nào cần chú ý?',
  'analytics.question.next': 'Điều gì đáng để thử nghiệm tiếp theo?',
  'analytics.filter.brand': 'Brand',
  'analytics.filter.accounts': 'Tài khoản',
  'analytics.filter.allAccounts': 'Tất cả các tài khoản được kết nối',
  'analytics.filter.range': 'Phạm vi ngày',
  'analytics.filter.format': 'Định dạng nội dung',
  'analytics.filter.allFormats': 'Tất cả các định dạng',
  'analytics.filter.comparePrevious': 'So sánh với kỳ trước',
  'analytics.filter.applied':
    '{count, plural, =0 {No filters} one {# filter} other {# filters}} applied. {results, plural, =0 {No posts match} one {# post matches} other {# posts match}}.',
  'analytics.rankMetric.label': 'Xếp hạng bài viết theo',
  'analytics.rankMetric.help':
    'Không có điểm tổng hợp trong Relay. Chọn một số liệu có định nghĩa mà bạn tin cậy và bảng được sắp xếp theo chỉ số đó.',
  'analytics.rankMetric.chosen':
    'Được xếp hạng bởi {metric}, theo báo cáo của từng nhà cung cấp tài khoản.',
  'analytics.outcome.awareness': 'Nhận thức',
  'analytics.outcome.awarenessHelp':
    'Số lần bài viết được gửi hoặc nhìn thấy. Các nhà cung cấp tính giá trị này theo cách khác nên một giá trị chỉ có thể so sánh được với chính nó theo thời gian.',
  'analytics.outcome.consumption': 'Tiêu thụ',
  'analytics.outcome.consumptionHelp': 'Bao nhiêu bài viết mà mọi người thực sự đã xem hoặc đọc.',
  'analytics.outcome.interaction': 'Tương tác',
  'analytics.outcome.interactionHelp':
    'Những gì mọi người đã làm trên nền tảng: thích, bình luận, chia sẻ và lưu.',
  'analytics.outcome.conversion': 'chuyển đổi',
  'analytics.outcome.conversionHelp':
    'Mọi người đã làm gì sau khi rời khỏi nền tảng. Chỉ những liên kết được theo dõi mới có thể trả lời câu hỏi này và chỉ dành cho những liên kết bạn đã chọn theo dõi.',
  'analytics.outcome.separateNote':
    'Bốn nhóm này được tính riêng. Cộng chúng lại với nhau sẽ tính cùng một người nhiều lần.',
  'analytics.table.caption':
    'Các bài đăng được xuất bản trong phạm vi đã chọn, mỗi bài được so sánh với đường cơ sở gần đây của chính bạn.',
  'analytics.table.post': 'bài đăng',
  'analytics.table.account': 'Tài khoản',
  'analytics.table.format': 'định dạng',
  'analytics.table.published': 'Đã xuất bản',
  'analytics.table.value': 'Giá trị',
  'analytics.table.delta': 'Chống lại đường cơ sở',
  'analytics.table.sample': 'mẫu',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Bằng chứng',
  'analytics.table.openEvidence': 'Đưa ra bằng chứng cho {post}',
  'analytics.table.rowActions': 'Các hành động dành cho {post}',
  'analytics.table.openPost': 'Mở số liệu bài đăng',
  'analytics.table.openReceipt': 'Mở biên lai xuất bản',
  'analytics.table.noBaseline': 'Chưa có đường cơ sở',
  'analytics.table.noBaselineReason':
    'Có ít hơn {required} bài đăng tương đương tồn tại trên tài khoản này. Việc so sánh sẽ gây nhiễu nên không có kết quả nào được hiển thị.',
  'analytics.table.sortBy': 'Sắp xếp theo {column}',
  'analytics.table.detailToggle': 'Chi tiết',
  'analytics.delta.above': '{percent} trên đường cơ sở',
  'analytics.delta.below': '{percent} dưới mức cơ bản',
  'analytics.delta.level': 'Phù hợp với đường cơ sở',
  'analytics.delta.unavailable': 'Không so sánh',
  'analytics.evidence.title': 'Sự so sánh này được thực hiện như thế nào',
  'analytics.evidence.baseline':
    'Baseline: the median {metric} of the previous {count, plural, one {# comparable post} other {# comparable posts}} on {account}.',
  'analytics.evidence.comparableBy':
    'Có thể so sánh có nghĩa là cùng một tài khoản, cùng định dạng nội dung ({format}) và thời gian xuất bản trong cùng một khoảng thời gian.',
  'analytics.evidence.postsUsed': 'Bài viết được sử dụng làm cơ sở',
  'analytics.evidence.excluded':
    '{count, plural, =0 {No posts were excluded} one {# post was excluded} other {# posts were excluded}} because the metric was unavailable for them.',
  'analytics.evidence.smallSample':
    'With {count, plural, one {# post} other {# posts}} in the baseline, a single unusual post moves the median a long way. Treat this as a signal to test again, not as a result.',
  'analytics.evidence.confounders': 'Điều này không giải thích được điều gì',
  'analytics.evidence.confounder.time':
    'Thời gian xuất bản trong ngày khác nhau giữa các bài viết cơ bản.',
  'analytics.evidence.confounder.format':
    'Bài đăng hình ảnh và bài đăng video không thể so sánh trực tiếp ở đây.',
  'analytics.evidence.confounder.followers':
    'Số người theo dõi trên {account} đã thay đổi bởi {percent} trong thời gian này.',
  'analytics.evidence.confounder.paid':
    'Relay không thể biết liệu bất kỳ bài đăng nào trong số này có nhận được phân phối trả phí hay không.',
  'analytics.evidence.confounder.provider':
    '{provider} đã thay đổi cách báo cáo {metric} trong giai đoạn này.',
  'analytics.definition.open': '{metric} nghĩa là gì',
  'analytics.definition.inlineHeading': 'Định nghĩa',
  'analytics.definition.observedAt': 'Đã quan sát {dateTime}.',
  'analytics.definition.sourceLink': 'Tài liệu của nhà cung cấp',
  'analytics.definition.verifiedOn': 'Đã đối chiếu tài liệu của nhà cung cấp trên {date}.',
  'analytics.definition.panelTitle': 'Định nghĩa số liệu trong chế độ xem này',
  'analytics.definition.panelIntro':
    'Mỗi số trên màn hình này đều đến từ một trường nhà cung cấp được đặt tên. Các định nghĩa bên dưới cũng được lặp lại bên cạnh mỗi giá trị, vì vậy không có gì quan trọng chỉ tồn tại trong chú giải công cụ.',
  'analytics.definition.aggregation.sum': 'Tổng hợp bằng cách thêm từng quan sát.',
  'analytics.definition.aggregation.average': 'Tổng hợp như một phương tiện.',
  'analytics.definition.aggregation.median': 'Tổng hợp như một trung vị.',
  'analytics.definition.aggregation.last': 'Quan sát gần đây nhất.',
  'analytics.definition.aggregation.delta':
    'Sự thay đổi giữa lần quan sát đầu tiên và lần quan sát cuối cùng.',
  'analytics.definition.aggregation.none': 'Báo cáo là một quan sát duy nhất.',
  'analytics.definition.denominator.none': 'Đây là một con số, không phải là một tỷ lệ.',
  'analytics.definition.historyWindow':
    '{provider} keeps {days, plural, one {# day} other {# days}} of history for this field.',
  'analytics.definition.historyWindowNone': '{provider} không nêu giới hạn lịch sử cho trường này.',
  'analytics.definition.term.providerField': 'Trường nhà cung cấp',
  'analytics.definition.term.unit': 'Đơn vị',
  'analytics.definition.term.denominator': 'mẫu số',
  'analytics.definition.term.aggregation': 'Nó được tổng hợp như thế nào',
  'analytics.definition.term.history': 'Lịch sử nhà cung cấp lưu giữ',
  'analytics.definition.term.definition': 'Nhà cung cấp nói điều đó có nghĩa là gì',
  'analytics.unit.count': 'Số sự kiện',
  'analytics.unit.seconds': 'Giây',
  'analytics.unit.percent': 'Tỷ lệ phần trăm nhà cung cấp đã tính toán',
  'analytics.unit.ratio': 'Tỷ lệ Relay được tính từ hai trường nhà cung cấp',
  'analytics.unit.currency_minor': 'Một số tiền tính theo đơn vị nhỏ',
  'analytics.denominator.none': 'Đây là một con số, không phải là một tỷ lệ. Nó không có mẫu số.',
  'analytics.denominator.impressions': 'Chia theo số lần hiển thị',
  'analytics.denominator.reach': 'Chia theo phạm vi tiếp cận',
  'analytics.denominator.views': 'Chia theo lượt xem',
  'analytics.denominator.followers': 'Chia cho số người theo dõi tại thời điểm quan sát',
  'analytics.denominator.sessions': 'Chia theo phiên',
  'analytics.format.text': 'văn bản',
  'analytics.format.image': 'Hình ảnh',
  'analytics.format.carousel': 'băng chuyền',
  'analytics.format.video': 'Video',
  'analytics.format.short_video': 'Video ngắn',
  'analytics.format.long_video': 'Video dài',
  'analytics.format.document': 'tài liệu',
  'analytics.format.thread': 'chủ đề',
  'analytics.value.unavailableReason.notImplemented':
    'Relay chưa xây dựng ánh xạ cho số liệu này trên {provider}.',
  'analytics.value.estimated': 'ước tính',
  'analytics.value.estimatedMethod': 'Phương pháp: {method}.',
  'analytics.freshness.title': 'Những con số này đến từ đâu',
  'analytics.freshness.intro':
    'Các nhà cung cấp tổng hợp theo lịch trình riêng của họ. Không có gì trên màn hình này là trực tiếp.',
  'analytics.freshness.accountRow': '{account} trên {provider}',
  'analytics.freshness.never': 'Chưa bao giờ được đồng bộ hóa',
  'analytics.freshness.nextAttempt': 'Lần đồng bộ hóa tiếp theo {relativeTime}.',
  'analytics.freshness.openStatus': 'Trạng thái nhà cung cấp',
  'analytics.accounts.title': 'Tài khoản cần chú ý',
  'analytics.accounts.empty':
    'Mọi tài khoản được kết nối đều trả về dữ liệu trong khoảng thời gian này. Không có gì cần bạn ở đây.',
  'analytics.accounts.reason.permission':
    'Quyền phân tích không được cấp khi tài khoản này được kết nối.',
  'analytics.accounts.reason.expired':
    'Quyền truy cập đã hết hạn nên không có số liệu nào được thu thập kể từ {date}.',
  'analytics.accounts.reason.stale': 'Lần đồng bộ hóa thành công cuối cùng là {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# sync attempt} other {# sync attempts}} failed in a row. The reason recorded was {reason}.',
  'analytics.accounts.reason.noPosts':
    'Không có gì được xuất bản lên tài khoản này trong phạm vi đã chọn.',
  'analytics.observations.title': 'Quan sát',
  'analytics.observations.intro':
    'Đây là những mô tả về những gì các con số hiển thị. Chúng không phải là những dự đoán và chúng không xác lập được nguyên nhân.',
  'analytics.observations.empty':
    'Chưa có đủ lịch sử được công bố để mô tả một mẫu hình. Xuất bản thêm một vài bài đăng trên cùng một tài khoản và định dạng.',
  'analytics.observations.citedPosts': 'Dựa trên',
  'analytics.observations.citedPeriod': 'Khoảng thời gian: {start} đến {end}.',
  'analytics.observations.nextTestTitle': 'Một bài kiểm tra bạn có thể chạy tiếp theo',
  'analytics.observations.nextTestBody':
    'Publish {count, plural, one {# more post} other {# more posts}} on {account} changing only {variable}, then compare the same metric. Tag it as an experiment before publishing so the comparison is planned rather than found afterwards.',
  'analytics.observations.tagFirst': 'Gắn thẻ một thử nghiệm',
  'analytics.chart.title': '{metric} theo thời gian',
  'analytics.chart.summary':
    '{metric} on {account}, {count, plural, one {# point} other {# points}} from {start} to {end}.',
  'analytics.chart.showTable': 'Hiển thị dưới dạng bảng',
  'analytics.chart.hideTable': 'Ẩn bảng',
  'analytics.chart.tableCaption': 'Cùng một loạt như một bảng.',
  'analytics.chart.columnPeriod': 'Thời kỳ',
  'analytics.chart.columnValue': 'Giá trị',
  'analytics.chart.gapLabel': 'Không có dữ liệu nào được thu thập',
  'analytics.chart.gapExplained':
    'Việc ngắt dòng có nghĩa là không có quan sát nào được thu thập trong khoảng thời gian đó. Nó không có nghĩa là số không.',
  'analytics.chart.annotation': 'Chú thích',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'Không có quan sát nào được thu thập trong phạm vi này.',
  'analytics.experiment.new': 'Lên kế hoạch cho một thí nghiệm',
  'analytics.experiment.empty':
    'Chưa có thử nghiệm nào. Thử nghiệm là sự so sánh mà bạn quyết định trước khi xuất bản, đây là loại so sánh duy nhất có thể trả lời một câu hỏi.',
  'analytics.experiment.emptyExample':
    'Ví dụ: xuất bản cùng một thông báo trên X hai lần, một lần với liên kết trong bài đăng và một lần với liên kết trong bình luận đầu tiên, sau đó so sánh số lần nhấp vào liên kết trong 72 giờ.',
  'analytics.experiment.name': 'Bạn đang thử nghiệm cái gì',
  'analytics.experiment.namePlaceholder': 'Bình luận đầu tiên lúc 5 phút so với 30 phút',
  'analytics.experiment.hypothesisPlaceholder':
    'Thời gian trễ ngắn hơn trước khi nhận xét đầu tiên nhận được nhiều phản hồi hơn trên X.',
  'analytics.experiment.variantLabel': 'Biến thể {index}',
  'analytics.experiment.variantDescription': 'Biến thể này có gì khác biệt',
  'analytics.experiment.addVariant': 'Thêm một biến thể',
  'analytics.experiment.removeVariant': 'Xóa biến thể {index}',
  'analytics.experiment.accounts': 'Đã bao gồm tài khoản',
  'analytics.experiment.windowHelp':
    'Các số liệu tiếp tục thay đổi sau khi bài đăng được đăng trực tuyến. Hãy sửa cửa sổ ngay bây giờ để việc so sánh không được thực hiện tại thời điểm phù hợp với một biến thể.',
  'analytics.experiment.windowDays':
    'Measure for {count, plural, one {# day} other {# days}} after each post publishes',
  'analytics.experiment.minSample': 'Bài viết tối thiểu cho mỗi biến thể',
  'analytics.experiment.minSampleHelp':
    'Dưới con số này, kết quả được hiển thị là không thuyết phục hơn là kết quả là người chiến thắng.',
  'analytics.experiment.status.planned': 'Đã lên kế hoạch',
  'analytics.experiment.status.collecting':
    'Thu thập. {published} trong số các bài đăng của {target} đã được xuất bản.',
  'analytics.experiment.status.inconclusive': 'Hoàn thành, không có sự khác biệt rõ ràng',
  'analytics.experiment.result.difference':
    '{variant} đã ghi lại {percent} nhiều {metric} hơn {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'Hai biến thể này nằm trong {percent} của nhau trên {metric}. Dù sao thì đó cũng là phạm vi mà các bài đăng này khác nhau.',
  'analytics.experiment.result.association':
    'This is an association measured on {count, plural, one {# post} other {# posts}}. It does not prove that the change caused the difference.',
  'analytics.experiment.result.unavailable':
    '{metric} was unavailable for {count, plural, one {# post} other {# posts}} in this experiment, so those posts are excluded rather than counted as zero.',
  'analytics.experiment.result.title': 'kết quả',
  'analytics.experiment.completeNow': 'Đóng thử nghiệm này',
  'analytics.experiment.completeConfirm':
    'Đóng cửa dừng thu thập. Các bài viết vẫn được xuất bản và các con số vẫn có sẵn.',
  'analytics.experiment.postsTitle': 'Bài đăng trong thử nghiệm này',
  'analytics.state.loading': 'Đang tải phân tích cho các tài khoản đã chọn',
  'analytics.state.loadingProvider': 'Đang tìm nạp phân tích {provider}',
  'analytics.state.empty': 'Không có gì được xuất bản trong phạm vi này',
  'analytics.state.emptyBody':
    'Phân tích mô tả các bài đăng đã xuất bản. Xuất bản nội dung nào đó hoặc mở rộng phạm vi ngày.',
  'analytics.state.emptyExample':
    'Sau khi bài đăng hiển thị trực tuyến, bạn sẽ thấy một hàng như: X @acme, "Khởi chạy chủ đề", 12.400 lượt hiển thị, cao hơn 58% so với mức trung bình của 10 lượt trước đó.',
  'analytics.state.errorTitle': 'Không thể tải phân tích',
  'analytics.state.errorBody':
    'Không có con số nào được hiển thị thay vì một con số được đoán. Bài đăng và biên nhận của bạn không bị ảnh hưởng.',
  'analytics.state.partialTitle': '{loaded} của tài khoản {total} trả về dữ liệu',
  'analytics.state.partialBody':
    'Các tài khoản đã trả lời sẽ được hiển thị với sự mới mẻ của riêng chúng. Phần còn lại được liệt kê với lý do họ không làm như vậy.',
  'analytics.state.partialSucceeded': 'Dữ liệu trả về',
  'analytics.state.partialFailed': 'Không trả lại dữ liệu',
  'analytics.state.offlineTitle': 'Bạn đang ngoại tuyến',
  'analytics.state.offlineBody':
    'Các số liệu bên dưới được tải trước khi kết nối bị ngắt, vì vậy chúng cũ hơn so với đề xuất trên nhãn độ mới.',
  'analytics.state.permissionTitle':
    'Bạn không thể xem số liệu phân tích trong không gian làm việc này',
  'analytics.state.permissionBody':
    'Analytics cần có vai trò phân tích viên trở lên. Chủ sở hữu hoặc quản trị viên của không gian làm việc này có thể cấp quyền đó.',
  'analytics.state.rateLimitTitle': '{provider} là yêu cầu phân tích giới hạn tốc độ',
  'analytics.state.rateLimitCause':
    'Tài khoản đã sử dụng phần hạn ngạch của nhà cung cấp cho thời lượng này. Relay không thử lại nhiều hơn vì điều đó sẽ trì hoãn việc xuất bản.',
  'analytics.state.rateLimitAlternative':
    'Thu hẹp phạm vi ngày hoặc bộ lọc tài khoản để yêu cầu nhà cung cấp ít hơn.',
  'analytics.state.rateLimitReset': 'Tiếp tục yêu cầu',
  'analytics.state.reference': 'Tham khảo chẩn đoán',
  'analytics.links.new': 'Tạo liên kết được theo dõi',
  'analytics.links.empty': 'Chưa có liên kết nào được theo dõi',
  'analytics.links.emptyBody':
    'Liên kết được theo dõi là một URL ngắn Relay chuyển hướng qua, do đó bạn có thể thấy các nhấp chuột ngay cả khi nền tảng không báo cáo. Đích đến ban đầu không bao giờ bị thay đổi nếu không có mục kiểm tra.',
  'analytics.links.emptyExample':
    'Ví dụ: Relay.to/a7Kq2 chuyển hướng đến acme.com/blog/launch với chiến dịch q3-launch.',
  'analytics.links.table.caption':
    'Các liên kết được theo dõi trong không gian làm việc này và số lần nhấp chuột của bên thứ nhất.',
  'analytics.links.campaign': 'Chiến dịch',
  'analytics.links.created': 'Đã tạo',
  'analytics.links.usedIn':
    '{count, plural, =0 {Not used in a post yet} one {Used in # post} other {Used in # posts}}',
  'analytics.links.state.active': 'Đang hoạt động',
  'analytics.links.state.expired': '{date} đã hết hạn',
  'analytics.links.state.disabled': 'Đã tắt',
  'analytics.links.state.disabledReason': 'Bị tắt bởi {actor} trên {date}. Lý do ghi: {reason}.',
  'analytics.links.detailTitle': 'Liên kết được theo dõi {slug}',
  'analytics.links.exactRedirect': 'Chuyển hướng chính xác',
  'analytics.links.exactRedirectHelp':
    'Đây là đích đến mà khách truy cập hiện tại bao gồm mọi thông số UTM, được hiển thị đầy đủ và không rút gọn.',
  'analytics.links.editDestination': 'Thay đổi điểm đến',
  'analytics.links.editDestinationWarning':
    'Việc thay đổi đích đến sẽ ảnh hưởng đến mọi nơi mà liên kết này đã được xuất bản. Báo cáo cho các khoảng thời gian trước khi thay đổi sẽ giữ nguyên đích đang hoạt động vào thời điểm đó.',
  'analytics.links.editDestinationAudit':
    'Thay đổi được ghi lại trong nhật ký kiểm tra với tên của bạn, điểm đến cũ và điểm đến mới.',
  'analytics.links.destinationHistory': 'Lịch sử điểm đến',
  'analytics.links.destinationHistoryRow': '{destination}, hoạt động từ {start} đến {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, hoạt động kể từ {start}',
  'analytics.links.domainLabel': 'Tên miền ngắn',
  'analytics.links.domainDefault': 'Tên miền mặc định Relay',
  'analytics.links.domainVerified': 'Được xác minh bằng DNS trên {date}',
  'analytics.links.domainPending': 'Đang chờ bản ghi DNS',
  'analytics.links.domainPendingHelp':
    'Thêm bản ghi TXT bên dưới tại {domain}, sau đó kiểm tra lại. Cho đến khi nó xác minh, tên miền này không thể được chọn cho một liên kết mới.',
  'analytics.links.domainFailed': 'Bản ghi DNS không khớp trên {date}',
  'analytics.links.domainCheck': 'Kiểm tra lại DNS',
  'analytics.links.expiry': 'Hết hạn',
  'analytics.links.expiryNone': 'Không có thời hạn sử dụng',
  'analytics.links.expiryHelp':
    'Sau khi hết hạn, liên kết sẽ trả về một trang đơn giản cho biết nó đã kết thúc. Nó không bao giờ được âm thầm chỉ vào một nơi nào khác.',
  'analytics.links.disable': 'Tắt liên kết này ngay bây giờ',
  'analytics.links.disableTitle': 'Tắt {slug}?',
  'analytics.links.disableBody':
    'Khách truy cập đến một trang thông báo rằng liên kết không còn tồn tại. Các bài đăng đã xuất bản vẫn chứa URL ngắn nên bất kỳ ai nhấp vào đều hiển thị URL này.',
  'analytics.links.disableReason': 'Lý do vô hiệu hóa',
  'analytics.links.enable': 'Kích hoạt lại liên kết này',
  'analytics.links.abuseTitle': 'Báo cáo lạm dụng liên kết này',
  'analytics.links.abuseBody':
    'Nếu URL ngắn này đang được sử dụng cho mục đích gì đó ngoài ý muốn của bạn, hãy báo cáo nó và lệnh chuyển hướng sẽ bị tạm dừng trong khi nó được xem xét.',
  'analytics.links.abuseAction': 'Báo cáo liên kết này',
  'analytics.links.measurementLabel': 'Đo lường chuyển hướng của bên thứ nhất',
  'analytics.links.measurementExplained':
    'Relay tính yêu cầu khi dịch vụ chuyển hướng được yêu cầu cho URL này. Nhấp chuột bị trùng lặp sẽ loại bỏ các yêu cầu lặp lại từ cùng một khách truy cập trong một cửa sổ ngắn và các yêu cầu phù hợp với các mẫu trình thu thập thông tin đã biết sẽ bị loại trừ thay vì bị xóa.',
  'analytics.links.botsNote':
    '{count, plural, one {# request} other {# requests}} were classified as automated and are excluded from the deduplicated count.',
  'analytics.links.series.title': 'Số yêu cầu và số lần nhấp chuột trùng lặp theo thời gian',
  'analytics.links.series.requests': 'Tổng số yêu cầu',
  'analytics.links.series.clicks': 'Số nhấp chuột bị trùng lặp',
  'analytics.links.breakdownTitle': 'Các nhấp chuột đến từ đâu',
  'analytics.links.breakdown.share': '{percent} số nhấp chuột bị trùng lặp',
  'analytics.links.referrer.direct': 'Không có người giới thiệu nào được gửi',
  'analytics.links.referrer.social': 'Nền tảng xã hội',
  'analytics.links.referrer.search': 'Công cụ tìm kiếm',
  'analytics.links.referrer.email': 'Ứng dụng email',
  'analytics.links.referrer.other': 'Trang web khác',
  'analytics.links.device.mobile': 'Điện thoại di động',
  'analytics.links.device.desktop': 'Máy tính để bàn',
  'analytics.links.device.tablet': 'Máy tính bảng',
  'analytics.links.device.unknown': 'Không xác định',
  'analytics.links.countryUnknown': 'Quốc gia không được xác định',
  'analytics.links.lastEventLabel': 'Nhấp chuột cuối cùng',
  'analytics.links.noEvents': 'Chưa có lần nhấp chuột nào được ghi lại',
  'analytics.links.noEventsBody':
    'Liên kết này chưa được yêu cầu kể từ khi nó được tạo. Đó là con số 0 thực sự, được đo lường bởi dịch vụ chuyển hướng của chúng tôi.',
  'analytics.links.compareWarning':
    '{provider} báo cáo số lần nhấp vào liên kết {providerValue} cho bài đăng này. Relay đã ghi lại {relayValue} số lần nhấp chuột trùng lặp. Cả hai đếm các sự kiện khác nhau và không thay thế sự kiện kia.',
  'analytics.links.errorTitle': 'Không thể tải số liệu thống kê liên kết',
  'analytics.links.errorBody':
    'Dịch vụ chuyển hướng vẫn hoạt động nên liên kết tiếp tục đưa khách truy cập đến đích. Chỉ có báo cáo bị ảnh hưởng.',
  'analytics.links.createDestination': 'URL đích',
  'analytics.links.createDestinationHelp':
    'Phải là địa chỉ https công khai. Dịch vụ chuyển hướng từ chối các địa chỉ mạng riêng và chuỗi chuyển hướng.',
  'analytics.links.createCampaign': 'Tên chiến dịch',
  'analytics.links.createSlug': 'Kết thúc tùy chỉnh',
  'analytics.links.createSlugHelp':
    'Để trống phần này và Relay tạo ra một kết thúc ngắn ngẫu nhiên.',
  'analytics.links.createUtm': 'thông số UTM',
  'analytics.links.blockedScheme': 'Chỉ các điểm đến https mới được chấp nhận.',
  'analytics.links.blockedPrivate':
    'Địa chỉ đó nằm trên mạng riêng nên dịch vụ chuyển hướng sẽ không chấp nhận.',
  'automation.tab.rules': 'Quy tắc',
  'automation.tab.feeds': 'nguồn cấp dữ liệu RSS',
  'automation.tab.label': 'Phần tự động hóa',
  'automation.rules.table.caption': 'Quy tắc tự động hóa trong không gian làm việc này.',
  'automation.rules.table.rule': 'quy tắc',
  'automation.rules.table.state': 'tiểu bang',
  'automation.rules.table.accounts': 'Tài khoản',
  'automation.rules.table.lastRun': 'Lần chạy cuối cùng',
  'automation.rules.table.nextCheck': 'Kiểm tra tiếp theo',
  'automation.rules.neverRun': 'Chưa chạy',
  'automation.rules.emptyExample':
    'Ví dụ: khi một mục mới xuất hiện trong nguồn cấp dữ liệu blog Acme, nếu ngôn ngữ là tiếng Anh, hãy tạo bản nháp từ mẫu thông báo Blog và yêu cầu phê duyệt.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {No accounts selected} one {# account} other {# accounts}}',
  'automation.rules.openRule': 'Mở {name}',
  'automation.rules.duplicateRule': 'Nhân đôi {name}',
  'automation.rules.deleteTitle': 'Xóa {name}?',
  'automation.rules.deleteBody':
    'Quy tắc dừng ngay lập tức và lịch sử chạy của nó được lưu giữ trong nhật ký kiểm tra. Các bài viết đã được tạo sẽ không bị ảnh hưởng.',
  'automation.trigger.commentFailed':
    'một bình luận theo lịch trình hoặc mục chủ đề không thành công',
  'automation.condition.timeWindow': 'thời gian nằm giữa {start} và {end} trong {timeZone}',
  'automation.condition.domainPresent': 'văn bản liên kết đến {domain}',
  'automation.condition.hashtagPresent': 'văn bản chứa hashtag {hashtag}',
  'automation.condition.providerCapability': 'tài khoản thực sự có thể thực hiện {capability}',
  'automation.condition.planStatus': 'đăng ký đang hoạt động',
  'automation.action.continueSequence': 'tiếp tục chuỗi chủ đề hoặc bình luận đã chuẩn bị sẵn',
  'automation.action.notifyEmail': 'gửi email đến {target}',
  'automation.action.notifyWebhook': 'gửi webhook tới {target}',
  'automation.action.pauseConnection': 'tạm dừng tài khoản bị ảnh hưởng',
  'automation.action.quotePost': 'trích dẫn bài viết nguồn một lần',
  'automation.action.followUpComment': 'thêm một bình luận chuẩn bị trên bài viết nguồn',
  'automation.param.feed': 'Nguồn cấp dữ liệu',
  'automation.param.template': 'mẫu',
  'automation.param.signature': 'Chữ ký',
  'automation.param.disclosure': 'Tiết lộ',
  'automation.param.locale': 'Ngôn ngữ',
  'automation.param.brand': 'Brand',
  'automation.param.campaign': 'Chiến dịch',
  'automation.param.account': 'Tài khoản',
  'automation.param.platform': 'Nền tảng',
  'automation.param.contentType': 'Loại nội dung',
  'automation.param.keyword': 'Từ khóa',
  'automation.param.hashtag': 'Thẻ bắt đầu bằng #',
  'automation.param.domain': 'Tên miền',
  'automation.param.capability': 'Khả năng',
  'automation.param.timeZone': 'Múi giờ',
  'automation.param.startTime': 'Từ',
  'automation.param.endTime': 'Đến',
  'automation.param.duration': 'Thời lượng',
  'automation.param.metric': 'Số liệu',
  'automation.param.value': 'Giá trị',
  'automation.param.target': 'Gửi tới',
  'automation.param.time': 'thời gian',
  'automation.param.cadence': 'Bao lâu một lần',
  'automation.param.notSet': 'chưa được đặt',
  'automation.editor.name': 'Tên quy tắc',
  'automation.editor.namePlaceholder': 'Blog lên mạng xã hội',
  'automation.editor.when': 'Khi nào',
  'automation.editor.if': 'Nếu',
  'automation.editor.then': 'Sau đó',
  'automation.editor.after': 'Sau',
  'automation.editor.until': 'Cho đến khi',
  'automation.editor.sentenceLabel': 'Câu quy tắc',
  'automation.editor.readBack': 'Đọc lại câu trước khi bạn bật cái này lên. Đó là toàn bộ quy tắc.',
  'automation.editor.chooseTrigger': 'Chọn những gì bắt đầu quy tắc này',
  'automation.editor.addCondition': 'Thêm một điều kiện',
  'automation.editor.addAction': 'Thêm một hành động',
  'automation.editor.removeCondition': 'Xóa điều kiện {label}',
  'automation.editor.removeAction': 'Xóa hành động {label}',
  'automation.editor.moveActionUp': 'Di chuyển {label} sớm hơn',
  'automation.editor.moveActionDown': 'Di chuyển {label} sau',
  'automation.editor.actionOrder': 'Các hành động chạy theo thứ tự này, từ trên xuống dưới.',
  'automation.editor.noConditions': 'Không có điều kiện. Quy tắc chạy mỗi khi nó được kích hoạt.',
  'automation.editor.noActions': 'Chưa có hành động nào. Không thể lưu quy tắc không có hành động.',
  'automation.editor.delayNone': 'không chậm trễ',
  'automation.editor.delayLabel': 'Trì hoãn trước khi hành động được thực hiện',
  'automation.editor.endLabel': 'Khi quy tắc này dừng lại',
  'automation.editor.end.manual': 'Tôi tắt cái này đi',
  'automation.editor.end.date': 'ngày tôi chọn',
  'automation.editor.end.count': 'it has run {count, plural, one {# time} other {# times}}',
  'automation.editor.end.dateValue': 'Dừng lại',
  'automation.editor.end.countValue': 'Dừng lại sau nhiều lần chạy',
  'automation.editor.parameterFor': 'Cài đặt cho {label}',
  'automation.editor.saveDraft': 'Lưu dưới dạng bản nháp',
  'automation.editor.savedAt': 'Đã lưu {time}',
  'automation.editor.unsaved': 'Những thay đổi chưa được lưu',
  'automation.editor.view.sentence': 'câu',
  'automation.editor.view.structured': 'Có cấu trúc',
  'automation.editor.view.api': 'Đại diện API',
  'automation.editor.view.label': 'Chế độ xem trình chỉnh sửa',
  'automation.editor.apiHelp':
    'Đây chính xác là những gì API REST, CLI và máy chủ MCP gửi. Chỉnh sửa nó ở đây và chuyển trở lại câu sẽ giữ nguyên mọi trường.',
  'automation.editor.apiInvalid':
    'Đây không phải là quy tắc JSON hợp lệ nên nó không được áp dụng: {reason}',
  'automation.editor.apiApply': 'Áp dụng JSON này',
  'automation.editor.structuredHelp':
    'Quy tắc tương tự như các trường. Sử dụng điều này khi một quy tắc có nhiều điều kiện và câu dài.',
  'automation.editor.error.noAction': 'Thêm ít nhất một hành động trước khi lưu.',
  'automation.editor.error.noTrigger': 'Chọn trình kích hoạt trước khi lưu.',
  'automation.editor.error.noAccounts': 'Chọn ít nhất một tài khoản mà quy tắc này có thể áp dụng.',
  'automation.editor.error.missingParameter': '{label} cần một giá trị.',
  'automation.editor.error.summary':
    '{count, plural, one {# thing needs your attention} other {# things need your attention}} before this rule can be saved.',
  'automation.picker.triggerTitle': 'Điều gì bắt đầu quy tắc này',
  'automation.picker.conditionTitle': 'Thêm một điều kiện',
  'automation.picker.actionTitle': 'Thêm một hành động',
  'automation.picker.search': 'Lọc danh sách này',
  'automation.picker.noResults': 'Không có gì trong danh sách này khớp với những gì bạn đã nhập.',
  'automation.picker.groupContent': 'Nội dung',
  'automation.picker.groupPublishing': 'Xuất bản',
  'automation.picker.groupNotify': 'Con người và hệ thống',
  'automation.picker.groupControl': 'Kiểm soát quy tắc',
  'automation.picker.groupSchedule': 'thời gian',
  'automation.picker.groupExternal': 'Sự kiện bên ngoài',
  'automation.picker.groupMeasurement': 'Đo lường',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# action is} other {# actions are}} not listed because the selected accounts cannot perform them.',
  'automation.picker.hiddenDetail': '{action} không có sẵn cho {provider}. {reason}',
  'automation.picker.consequential': 'Tạo một cái gì đó trên nền tảng',
  'automation.picker.internalOnly': 'Ở bên trong Relay',
  'automation.accounts.label': 'Các tài khoản mà quy tắc này có thể áp dụng',
  'automation.accounts.help':
    'Một quy tắc không bao giờ có thể chạm vào tài khoản không được liệt kê ở đây, bất kể điều kiện của nó nói gì.',
  'automation.accounts.none': 'Chưa có tài khoản nào được chọn',
  'automation.threshold.title': 'Quy tắc đo lường cho trình kích hoạt này',
  'automation.threshold.intro':
    'Một quy tắc phản ứng với một số cần phải biết số nào, được đo trong khoảng thời gian nào và tần suất nó có thể hoạt động.',
  'automation.threshold.metric': 'Số liệu cần xem',
  'automation.threshold.value': 'Giá trị ngưỡng',
  'automation.threshold.window': 'Cửa sổ đo',
  'automation.threshold.windowHelp':
    'Tính từ thời điểm bài viết nguồn được xuất bản. Bên ngoài cửa sổ này quy tắc dừng xem bài viết.',
  'automation.threshold.expiry': 'Dừng xem bài viết sau',
  'automation.threshold.cooldown': 'Thời gian hồi chiêu giữa các lần thực hiện',
  'automation.threshold.cooldownHelp':
    'Thời gian ngắn nhất được phép giữa hai lần chạy cho cùng một bài đăng nguồn.',
  'automation.threshold.maxPerPost': 'Số lần thực thi tối đa trên mỗi bài đăng nguồn',
  'automation.threshold.defaultsTitle': 'Mặc định vẫn giữ nguyên trừ khi bạn thay đổi chúng',
  'automation.threshold.defaultOncePerPost': 'Chạy một lần cho mỗi bài viết nguồn.',
  'automation.threshold.defaultStale':
    'Không thực thi nếu số liệu không có sẵn hoặc cũ. Giới hạn độ tươi được sử dụng là {duration}.',
  'automation.threshold.staleLimit': 'Hãy coi số liệu là cũ sau',
  'automation.threshold.providerNote':
    '{provider} báo cáo {metric} về độ trễ, vì vậy quy tắc này chỉ có thể hoạt động sau khi nhà cung cấp công bố số.',
  'automation.crossAccount.title': 'Theo dõi từ tài khoản khác',
  'automation.crossAccount.off': 'Tắt. Quy tắc này chỉ hoạt động trên tài khoản nguồn.',
  'automation.crossAccount.enable': 'Cho phép theo dõi từ tài khoản khác',
  'automation.crossAccount.body':
    'Cả hai tài khoản phải được kết nối với không gian làm việc này và cả hai đều phải được đặt tên ở đây. Phần tiếp theo là một bài đăng được chuẩn bị sẵn mà bạn viết trước và nó phải trải qua chính sách phê duyệt giống như bất kỳ bài đăng nào khác.',
  'automation.crossAccount.sourceAccount': 'Tài khoản nguồn',
  'automation.crossAccount.followUpAccount': 'Tài khoản xuất bản theo dõi',
  'automation.crossAccount.preauthorize':
    'Tôi xác nhận rằng không gian làm việc này kiểm soát cả {sourceAccount} và {followUpAccount}, đồng thời việc theo dõi không được trình bày dưới dạng chứng thực độc lập.',
  'automation.crossAccount.preauthorizeRequired':
    'Xác nhận ủy quyền trước trước khi có thể lưu quy tắc này.',
  'automation.crossAccount.duplicateCheck':
    'Kiểm tra nhịp độ và trùng lặp tài khoản chéo chạy trước khi theo dõi và nó sẽ bị bỏ qua thay vì bị trì hoãn nếu nó lặp lại bài đăng nguồn.',
  'automation.preflight.intro':
    'Mọi thứ mà quy tắc này có thể làm trước khi nó có thể làm được bất kỳ điều gì trong số đó.',
  'automation.preflight.accountsLabel': 'Các tài khoản mà nó có thể hoạt động',
  'automation.preflight.maxActionsLabel': 'Hầu hết các hành động bên ngoài mỗi lần chạy',
  'automation.preflight.maxActionsPeriod':
    'At most {count, plural, one {# external action} other {# external actions}} in {period}.',
  'automation.preflight.approvalLabel': 'Phê duyệt',
  'automation.preflight.approvalNone':
    'Không có hành động nào trong quy tắc này tạo ra bất cứ điều gì trên nền tảng, do đó không có phê duyệt nào được áp dụng.',
  'automation.preflight.providerLabel': 'Hạn chế của nhà cung cấp',
  'automation.preflight.providerNone':
    'Không có điều gì áp dụng cho các hành động trong quy tắc này.',
  'automation.preflight.costLabel': 'Ước tính chi phí đo lường',
  'automation.preflight.costUnknown':
    'Không thể ước tính chi phí cho những hành động này cho đến khi biết được giá của nhà cung cấp.',
  'automation.preflight.costMethod':
    'Ước tính từ bảng giá nhà cung cấp trên {date}. Biên nhận ghi lại những gì thực sự đã được tính phí.',
  'automation.preflight.cadenceLabel': 'Nhịp và trùng lặp',
  'automation.preflight.cadenceBody':
    'Kiểm tra trùng lặp và nhịp chạy trước mỗi hành động. Một hành động vượt quá ngân sách nhịp độ cho một tài khoản sẽ bị bỏ qua và ghi lại, không phải xếp hàng đợi.',
  'automation.preflight.failureLabel': 'Nếu chạy không thành công',
  'automation.preflight.failure.pauseAfter':
    'The rule pauses after {count, plural, one {# consecutive failure} other {# consecutive failures}} and files an action item.',
  'automation.preflight.failure.continue':
    'Quy tắc tiếp tục chạy và mỗi lỗi được ghi lại trong nhật ký chạy.',
  'automation.preflight.exampleLabel': 'Chạy ví dụ',
  'automation.preflight.exampleIntro': 'Sử dụng sự kiện gần đây nhất, trình kích hoạt này sẽ khớp.',
  'automation.preflight.exampleNone':
    'Chưa có sự kiện trùng khớp nào xảy ra nên không thể hiển thị ví dụ nào. Thay vào đó hãy chạy một sự kiện thử nghiệm.',
  'automation.preflight.activate': 'Bật quy tắc này',
  'automation.preflight.activateConfirmTitle': 'Bật {name}?',
  'automation.preflight.activateConfirmBody':
    'Từ giờ trở đi, quy tắc này sẽ hoạt động mà không cần hỏi bạn trước, trong giới hạn được liệt kê ở trên.',
  'automation.preflight.blocked':
    'This rule cannot be turned on yet. {count, plural, one {# item} other {# items}} above needs a decision.',
  'automation.test.title': 'Sự kiện thử nghiệm',
  'automation.test.body':
    'Việc chạy thử sẽ đánh giá toàn bộ câu và cho biết nó sẽ làm gì. Nó không bao giờ xuất bản, không bao giờ đăng bình luận và không bao giờ gửi webhook đến điểm cuối thực sự.',
  'automation.test.useLastEvent': 'Sử dụng sự kiện phù hợp gần đây nhất',
  'automation.test.usePayload': 'Dán tải trọng sự kiện',
  'automation.test.run': 'Chạy thử nghiệm',
  'automation.test.running': 'Chạy thử nghiệm',
  'automation.test.resultTitle': 'Bài kiểm tra đã làm gì',
  'automation.test.conditionPassed': '{condition} đã vượt qua',
  'automation.test.conditionFailed': '{condition} không vượt qua nên luật dừng ở đây',
  'automation.test.actionSimulated': '{action} sẽ chạy',
  'automation.test.actionSkipped': '{action} sẽ bị bỏ qua: {reason}',
  'automation.test.noExternalEffect': 'Không còn gì Relay trong quá trình thử nghiệm này.',
  'automation.test.failed': 'Bài kiểm tra không thể hoàn thành: {reason}',
  'automation.runs.table.caption': 'Các lần chạy gần đây của quy tắc này.',
  'automation.runs.startedAt': 'Đã bắt đầu',
  'automation.runs.outcome.label': 'kết quả',
  'automation.runs.actionsTaken': 'hành động',
  'automation.runs.trigger': 'Kích hoạt bởi',
  'automation.runs.outcome.completed': 'Đã hoàn thành',
  'automation.runs.outcome.skipped': 'Đã bỏ qua',
  'automation.runs.outcome.failed': 'thất bại',
  'automation.runs.outcome.testMode': 'Chế độ kiểm tra',
  'automation.runs.actionCount':
    '{count, plural, =0 {No external action} one {# external action} other {# external actions}}',
  'automation.runs.skippedReason': 'Đã bỏ qua vì {reason}',
  'automation.runs.openDetail': 'Mở đường chạy từ {time}',
  'automation.runs.createdItems': 'Đã tạo',
  'automation.versions.caption': 'Mọi phiên bản đã lưu của quy tắc này.',
  'automation.versions.current': 'hiện tại',
  'automation.versions.savedBy': 'Được lưu bởi {actor} trên {date}',
  'automation.versions.compare': 'So sánh với phiên bản hiện tại',
  'automation.versions.restore': 'Khôi phục phiên bản này',
  'automation.versions.restoreConfirm':
    'Việc khôi phục sẽ tạo ra một phiên bản mới. Không có gì bị ghi đè và quy tắc vẫn ở trạng thái hiện tại cho đến khi bạn bật nó.',
  'automation.versions.diffTitle': 'Phiên bản {from} so với phiên bản {to}',
  'automation.kill.title': 'Dừng {name} ngay bây giờ',
  'automation.kill.body':
    'Quy tắc dừng ngay lập tức, ở giữa đường chạy nếu có sự cố xảy ra. Mọi thứ đã được gửi tới nền tảng vẫn được xuất bản vì bài đăng bên ngoài không bao giờ bị khôi phục.',
  'automation.kill.confirmPhrase': 'DỪNG',
  'automation.kill.confirmLabel': 'Gõ STOP để xác nhận',
  'automation.kill.stopped':
    'Quy tắc này đã bị {actor} dừng lại trên {date}. Nó không thể chạy lại cho đến khi bạn bật lại.',
  'automation.state.loading': 'Đang tải quy tắc tự động hóa',
  'automation.state.loadingRule': 'Đang tải quy tắc và các lần chạy gần đây của nó',
  'automation.state.errorTitle': 'Không thể tải các quy tắc',
  'automation.state.errorBody':
    'Các quy tắc đang chạy không bị ảnh hưởng bởi điều này. Chỉ có màn hình này không thành công.',
  'automation.state.offlineTitle': 'Bạn đang ngoại tuyến',
  'automation.state.offlineBody':
    'Bạn có thể đọc quy tắc và chỉnh sửa bản nháp và nội dung đó vẫn ở trên thiết bị này. Việc lưu, kiểm tra và bật quy tắc cần có kết nối.',
  'automation.state.permissionTitle': 'Bạn không thể thay đổi quy tắc tự động hóa',
  'automation.state.permissionBody':
    'Các quy tắc áp dụng cho các tài khoản được kết nối, do đó, việc thay đổi một tài khoản cần có vai trò người quản lý trở lên. Bạn vẫn có thể đọc mọi quy tắc và lịch sử chạy của nó.',
  'automation.state.rateLimitTitle': 'Việc chạy quy tắc đang bị chậm lại',
  'automation.state.rateLimitCause':
    'Không gian làm việc này đã đạt đến giới hạn chạy tự động hóa cho cửa sổ hiện tại. Các bài đăng được lên lịch và xuất bản thủ công đều không bị ảnh hưởng.',
  'automation.state.rateLimitAlternative':
    'Các quy tắc có nhịp có thể được cung cấp khoảng thời gian dài hơn, sử dụng ít lần chạy hơn.',
  'automation.rss.subtitle':
    'Biến nguồn cấp dữ liệu thành bản nháp hoặc bài đăng được lên lịch, với cùng mức xác thực và phê duyệt như bất kỳ nội dung nào bạn tự viết.',
  'automation.rss.empty': 'Chưa có nguồn cấp dữ liệu nào',
  'automation.rss.emptyBody':
    'Thêm nguồn cấp dữ liệu và Relay sẽ kiểm tra nguồn cấp dữ liệu đó theo lịch trình. Mỗi mục mới sẽ trở thành bản nháp, bài đăng được lên lịch hoặc yêu cầu phê duyệt, tùy theo lựa chọn của bạn.',
  'automation.rss.emptyExample':
    'Ví dụ: nguồn cấp dữ liệu blog Acme tạo bản nháp cho X và LinkedIn mỗi khi một bài viết được xuất bản và chờ người phê duyệt.',
  'automation.rss.table.caption': 'Cung cấp các cuộc thăm dò không gian làm việc này.',
  'automation.rss.table.feed': 'Nguồn cấp dữ liệu',
  'automation.rss.table.policy': 'Điều gì xảy ra với một mặt hàng mới',
  'automation.rss.table.health': 'sức khỏe',
  'automation.rss.step.url': 'Địa chỉ nguồn cấp dữ liệu',
  'automation.rss.step.preview': 'Kiểm tra nguồn cấp dữ liệu',
  'automation.rss.step.seen': 'Điểm xuất phát',
  'automation.rss.step.targets': 'Nó đi đâu',
  'automation.rss.step.template': 'Bài viết nói gì',
  'automation.rss.step.policy': 'Nó được xuất bản như thế nào',
  'automation.rss.stepOf': 'Bước {current} của {total}',
  'automation.rss.urlHelp':
    'Relay tìm nạp nguồn cấp dữ liệu từ máy chủ của chúng tôi chứ không phải từ trình duyệt của bạn. Địa chỉ mạng riêng bị từ chối.',
  'automation.rss.validateAction': 'Kiểm tra nguồn cấp dữ liệu này',
  'automation.rss.validateFailed': 'Địa chỉ đó không trả về nguồn cấp dữ liệu có thể đọc được',
  'automation.rss.validateFailedReason': 'Những gì chúng tôi nhận được: {reason}',
  'automation.rss.validateBlocked': 'Địa chỉ đó trỏ đến một mạng riêng nên không được tìm nạp.',
  'automation.rss.previewTitle': 'Xem trước nguồn cấp dữ liệu',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# item} other {# items}} returned, newest first.',
  'automation.rss.previewItemPublished': 'Đã xuất bản {dateTime}',
  'automation.rss.previewNoImage': 'Không có hình ảnh trong mục này',
  'automation.rss.previewImageAlt': 'Hình ảnh từ mục nguồn cấp dữ liệu {title}',
  'automation.rss.previewNoDate':
    'Mục này không có dấu thời gian, vì vậy Relay sử dụng thời điểm lần đầu tiên nó nhìn thấy nó.',
  'automation.rss.previewFieldsTitle': 'Các trường mà nguồn cấp dữ liệu này cung cấp',
  'automation.rss.previewFieldMissing': 'Không có trong nguồn cấp dữ liệu này',
  'automation.rss.seenTitle': 'Những gì được tính là đã thấy',
  'automation.rss.seenLatest':
    'Xử lý mọi thứ hiện có trong nguồn cấp dữ liệu như đã thấy. Chỉ các mục trong tương lai được đăng.',
  'automation.rss.seenAll': 'Hãy coi mục mới nhất là mới và đăng nó vào lần kiểm tra tiếp theo.',
  'automation.rss.seenHelp':
    'Hầu hết các nguồn cấp dữ liệu đều chứa các bài viết cũ. Chọn tùy chọn đầu tiên là cách bạn tránh xuất bản tồn đọng.',
  'automation.rss.targetsHelp':
    'Chọn tài khoản hoặc nhóm đã lưu. Mỗi mục tiêu vẫn được xác nhận riêng trước khi mọi thứ được lên lịch.',
  'automation.rss.targetGroup': 'Nhóm đã lưu',
  'automation.rss.targetIndividual': 'Tài khoản cá nhân',
  'automation.rss.templateFields': 'Các trường có sẵn',
  'automation.rss.templateInsert': 'Chèn {field}',
  'automation.rss.templateField.title': 'Tiêu đề mục',
  'automation.rss.templateField.summary': 'Tóm tắt mục',
  'automation.rss.templateField.link': 'Liên kết mục',
  'automation.rss.templateField.author': 'Tác giả mục',
  'automation.rss.templateField.published': 'Ngày xuất bản',
  'automation.rss.templateField.categories': 'Danh mục',
  'automation.rss.templatePreview': 'Xem trước với mục mới nhất',
  'automation.rss.adaptWithAi': 'Điều chỉnh văn bản cho từng mục tiêu',
  'automation.rss.adaptHelp':
    'Từ ngữ được viết lại để phù hợp với từng nền tảng và được hiển thị dưới dạng khác biệt mà bạn chấp nhận hoặc từ chối. Phương tiện đến từ mục nguồn cấp dữ liệu. Relay không tạo ra hình ảnh.',
  'automation.rss.noImageGeneration':
    'Nếu một mục nguồn cấp dữ liệu không có hình ảnh, bài đăng sẽ không có hình ảnh.',
  'automation.rss.imageFromFeed': 'Sử dụng hình ảnh từ mục nguồn cấp dữ liệu khi nó có',
  'automation.rss.policyHelp':
    'Mục nguồn cấp dữ liệu không có gì đặc biệt. Nó tuân theo chính sách phê duyệt tương tự như một bài viết bạn tự viết.',
  'automation.rss.cadenceInterval': 'Mỗi mục tối đa một mục',
  'automation.rss.cadenceHelp':
    'Các mục bổ sung chờ trong hàng đợi thay vì xuất bản cùng nhau, do đó, một nguồn cấp dữ liệu đăng mười bài viết cùng một lúc sẽ không làm ngập tài khoản.',
  'automation.rss.immediateWarning':
    'Xuất bản ngay lập tức sẽ gửi một bài đăng tới một nền tảng mà không có người đọc nó trước. Nó chỉ khả dụng nếu chính sách phê duyệt cho các tài khoản này cho phép.',
  'automation.rss.healthTitle': 'Sức khỏe thức ăn',
  'automation.rss.healthOk': 'Đang làm việc',
  'automation.rss.healthStalled': 'Không có mặt hàng mới cho {duration}',
  'automation.rss.healthFailing': 'The last {count, plural, one {check} other {# checks}} failed',
  'automation.rss.health.nextPoll': 'Kiểm tra tiếp theo {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {No items processed yet} one {# item processed} other {# items processed}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {No duplicates skipped} one {# duplicate skipped} other {# duplicates skipped}}',
  'automation.rss.health.lastPollLabel': 'Đã kiểm tra lần cuối',
  'automation.rss.health.lastItemLabel': 'Mục mới cuối cùng trong nguồn cấp dữ liệu',
  'automation.rss.health.lastPostLabel': 'Bản nháp hoặc bài đăng cuối cùng được tạo',
  'automation.rss.health.processedLabel': 'Các mục đã được xử lý',
  'automation.rss.recentItems': 'Các mục gần đây',
  'automation.rss.itemOutcome.draft': 'Đã tạo bản nháp',
  'automation.rss.itemOutcome.scheduled': 'Đã lên lịch cho {time}',
  'automation.rss.itemOutcome.published': 'Đã xuất bản',
  'automation.rss.itemOutcome.awaitingApproval': 'Đang chờ phê duyệt',
  'automation.rss.itemOutcome.duplicate': 'Đã bỏ qua, đã xem rồi',
  'automation.rss.itemOutcome.failed': 'Không thành công: {reason}',
  'automation.rss.pauseFeed': 'Tạm dừng nguồn cấp dữ liệu này',
  'automation.rss.resumeFeed': 'Tiếp tục nguồn cấp dữ liệu này',
  'automation.rss.deleteTitle': 'Xóa {title}?',
  'automation.rss.deleteBody':
    'Relay ngừng kiểm tra nguồn cấp dữ liệu này. Các bản nháp và bài đăng đã được tạo vẫn giữ nguyên như cũ.',
  'automation.rss.errorTitle': 'Không thể đọc được nguồn cấp dữ liệu này',
  'automation.rss.errorBody':
    'Relay tiếp tục kiểm tra theo lịch trình bình thường. Không có gì được công bố từ một phản hồi một phần.',
  'automation.refuse.title': 'Không có sẵn trong bất kỳ quy tắc nào',
  'automation.refuse.body':
    'Tự động thích và theo dõi, nhóm tương tác, trả lời và tin nhắn không được yêu cầu cũng như đăng cùng một nội dung từ nhiều tài khoản để làm cho nội dung đó trông phổ biến không phải là các tùy chọn ở đây. Các nền tảng cấm chúng và chúng làm hỏng các tài khoản sử dụng chúng.',
  'automation.refuse.readPolicy': 'Đọc chính sách sử dụng được chấp nhận',
} as const;
