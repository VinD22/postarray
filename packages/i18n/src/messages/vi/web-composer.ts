/** vi beta catalog namespace. */
export const webComposerMessages = {
  'composerWeb.pane.targets': 'Tài khoản mục tiêu và Bộ',
  'composerWeb.pane.master': 'Bản nháp chính và cài đặt chia sẻ',
  'composerWeb.pane.variant': 'Phiên bản dành cho mục tiêu mở',
  'composerWeb.pane.review': 'Xem trước, xác nhận, chi phí và phê duyệt',
  'composerWeb.pane.showPreview': 'Hiển thị bản xem trước',
  'composerWeb.pane.hidePreview': 'Ẩn bản xem trước',
  'composerWeb.pane.previewCollapsed':
    'Bảng xem trước bị ẩn. Mở nó để kiểm tra bài viết cuối cùng.',
  'composerWeb.step.targets': 'Mục tiêu',
  'composerWeb.step.write': 'Viết',
  'composerWeb.step.perTarget': 'Mỗi mục tiêu',
  'composerWeb.step.review': 'Xem lại',
  'composerWeb.step.progress': 'Bước {current} của {total}',
  'composerWeb.step.legend': 'Các bước Composer',
  'composerWeb.summary.label': 'Bản tóm tắt dự thảo',
  'composerWeb.summary.targets':
    '{count, plural, =0 {No targets} one {# target} other {# targets}}',
  'composerWeb.summary.issues': '{count, plural, =0 {No issues} one {# issue} other {# issues}}',
  'composerWeb.summary.notScheduled': 'Không có thời gian được chọn',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Chi phí chưa được định giá',
  'composerWeb.summary.openReview': 'Đánh giá mở',
  'composerWeb.rail.masterEntry': 'bản thảo chính',
  'composerWeb.rail.masterHint': 'Chỉnh sửa ở đây để tiếp cận mọi mục tiêu vẫn được kế thừa.',
  'composerWeb.rail.accountsHeading': 'Tài khoản mục tiêu',
  'composerWeb.rail.setsHeading': 'Bộ và nhóm',
  'composerWeb.rail.setsHelp':
    'Tập hợp là một nhóm tài khoản và mặc định đã lưu. Áp dụng một bản sao các giá trị của nó vào bản nháp này. Các chỉnh sửa sau này đối với Bộ không làm thay đổi bản nháp này.',
  'composerWeb.rail.openTarget': 'Mở phiên bản cho {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Giới hạn không xác định',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {no media} one {# media file} other {# media files}}',
  'composerWeb.rail.paused': 'Đã tạm dừng. Nó sẽ không xuất bản cho đến khi bạn tiếp tục nó.',
  'composerWeb.rail.state.notBuilt': 'Chưa được xây dựng',
  'composerWeb.rail.state.unsupported': 'Nhà cung cấp không hỗ trợ',
  'composerWeb.rail.empty': 'Chưa có tài khoản nào được chọn.',
  'composerWeb.rail.emptyHelp':
    'Chọn các tài khoản mà bài đăng này sẽ tiếp cận. Bạn có thể thêm nhiều hơn sau.',
  'composerWeb.rail.divergenceHint':
    'Mở một mục tiêu để xem phiên bản của chính nó. Bản thảo chính không thay đổi.',
  'composerWeb.rail.searchLabel': 'Lọc tài khoản',
  'composerWeb.rail.removeTarget': 'Xóa {account}',
  'composerWeb.globalEdit.open': 'Chỉnh sửa toàn cầu',
  'composerWeb.globalEdit.title': 'Áp dụng thay đổi này cho mọi mục tiêu đã chọn',
  'composerWeb.globalEdit.description':
    'Bản thảo chính luôn thay đổi. Các mục tiêu vẫn kế thừa trường này sẽ theo dõi nó. Mục tiêu với phiên bản riêng của họ giữ nó.',
  'composerWeb.globalEdit.fieldLabel': 'trường',
  'composerWeb.globalEdit.compatibleHeading': 'Những mục tiêu này thực hiện sự thay đổi',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Những mục tiêu này giữ phiên bản riêng của họ',
  'composerWeb.globalEdit.incompatibleHeading':
    'Những mục tiêu này không thể thực hiện được sự thay đổi',
  'composerWeb.globalEdit.incompatibleHelp':
    'Không có gì bị rơi mà không nói với bạn. Mỗi tài khoản bên dưới sẽ có một phiên bản rõ ràng với thay đổi được điều chỉnh và bạn có thể chỉnh sửa nó sau đó.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} cho phép các ký tự {limit}. Văn bản này là {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} không chấp nhận liên kết trong trường này. Liên kết vẫn ở trong bản nháp chính và trong các mục tiêu cho phép nó.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} accepts {limit, plural, one {# file} other {# files}}. This draft has {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported':
    '{account} không chấp nhận các tệp {mimeType}.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} không hỗ trợ các mục tiếp theo nên trình tự vẫn nằm trên bản nháp chính.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} xuất bản văn bản thuần túy. Các dấu định dạng sẽ xuất hiện dưới dạng ký tự.',
  'composerWeb.globalEdit.adaptedPreview': 'Thay vào đó {account} nhận được gì',
  'composerWeb.globalEdit.confirm': 'Áp dụng và tạo các phiên bản',
  'composerWeb.globalEdit.nothingToApply':
    'Không có gì thay đổi. Bản nháp chính đã có giá trị này.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Change applied to # target} other {Change applied to # targets}}. {adapted, plural, =0 {No target needed an adapted version} one {# target got an adapted version} other {# targets got adapted versions}}.',
  'composerWeb.override.heading': 'Mục tiêu này có phiên bản riêng',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# field differs from the master draft} other {# fields differ from the master draft}}',
  'composerWeb.override.field.body': 'Đăng văn bản',
  'composerWeb.override.field.contentKind': 'Loại bài đăng',
  'composerWeb.override.field.locale': 'Ngôn ngữ nội dung',
  'composerWeb.override.field.mediaIds': 'Phương tiện truyền thông',
  'composerWeb.override.field.links': 'Liên kết',
  'composerWeb.override.field.signature': 'Chữ ký',
  'composerWeb.override.field.threadItems': 'Bình luận và chủ đề',
  'composerWeb.override.field.schedule': 'lịch trình',
  'composerWeb.override.resetField': 'Đặt lại {field} thành chính',
  'composerWeb.override.resetFieldTitle': 'Đặt lại {field} cho {account}?',
  'composerWeb.override.resetFieldBody':
    'Phiên bản {field} được viết cho {account} bị loại bỏ và bản nháp chính được sử dụng lại. Không có thay đổi mục tiêu khác.',
  'composerWeb.override.resetAll': 'Đặt lại mọi trường thành chính',
  'composerWeb.override.inheritNotice':
    'Mục tiêu này tuân theo dự thảo chính. Chỉnh sửa mọi thứ ở đây sẽ tạo ra một phiên bản mà chỉ {account} nhận được.',
  'composerWeb.override.created': '{account} hiện có {field} của riêng mình.',
  'composerWeb.limits.heading': 'Giới hạn cho {account}',
  'composerWeb.limits.text': 'Nhắn tin tối đa ký tự {limit}',
  'composerWeb.limits.linkCost':
    'A link counts as {count, plural, one {# character} other {# characters}} whatever its length.',
  'composerWeb.limits.images':
    '{count, plural, =0 {No images} one {# image} other {up to # images}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {No video} one {# video} other {up to # videos}}',
  'composerWeb.limits.duration': 'Video lên tới {duration}',
  'composerWeb.limits.aspect': 'Tỷ lệ khung hình giữa {min} và {max}',
  'composerWeb.limits.fileSize': 'Tệp lên tới {size}',
  'composerWeb.limits.mimeTypes': 'Các loại tệp được chấp nhận: {types}',
  'composerWeb.limits.source': 'Từ ảnh chụp nhanh khả năng {version}, hãy đọc {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'Cần có hình thu nhỏ.',
  'composerWeb.native.heading': 'Cài đặt {provider}',
  'composerWeb.native.privacy': 'Ai có thể nhìn thấy điều này',
  'composerWeb.native.privacyChoose': 'Chọn khán giả',
  'composerWeb.native.privacyExplicit':
    '{provider} không cho phép đối tượng được chọn trước. Hãy chọn một trước khi việc này có thể được lên lịch.',
  'composerWeb.native.community': 'cộng đồng',
  'composerWeb.native.board': 'Ban',
  'composerWeb.native.group': 'Nhóm hoặc Trang',
  'composerWeb.native.organization': 'Tổ chức',
  'composerWeb.native.channel': 'Kênh',
  'composerWeb.native.publication': 'Xuất bản',
  'composerWeb.native.disclosureHeading': 'Tiết lộ',
  'composerWeb.native.disclosureCommercial': 'Bài đăng này quảng bá sản phẩm hoặc dịch vụ',
  'composerWeb.native.disclosureBranded':
    'Bài đăng này là nội dung có thương hiệu cho một công ty khác',
  'composerWeb.native.disclosureAi': 'Một số nội dung này được tạo bằng công cụ AI',
  'composerWeb.native.disclosureUnsupported':
    '{provider} không cung cấp thông tin tiết lộ này thông qua API của nó. Thay vào đó hãy thêm nó vào văn bản.',
  'composerWeb.native.none': 'Không có cài đặt {provider} nào áp dụng cho loại bài đăng này.',
  'composerWeb.entity.resolvedHeading': 'Đã giải quyết trên {provider}',
  'composerWeb.entity.resolvedId': 'ID tài khoản {externalId}',
  'composerWeb.entity.plainTextWarning':
    'Không khớp. Nó sẽ xuất bản dưới dạng văn bản thuần túy, không phải là thẻ gốc trên {provider}.',
  'composerWeb.entity.removeMention': 'Xóa đề cập đến {label}',
  'composerWeb.entity.addMention': 'Thêm một đề cập',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {No mentions} one {# mention} other {# mentions}}, {resolved} matched to a real account',
  'composerWeb.entity.lookupUnsupported':
    '{provider} không cung cấp tính năng tra cứu thực thể cho loại tài khoản này.',
  'composerWeb.entity.lookupNotBuilt':
    'Post Array chưa xây dựng tính năng tra cứu thực thể cho {provider}. Không có gì được đoán trong khi chờ đợi.',
  'composerWeb.entity.searchHint': 'Nhập ít nhất hai ký tự, sau đó chọn một kết quả.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {No matches} one {# match} other {# matches}}',
  'composerWeb.links.heading': 'Liên kết',
  'composerWeb.links.detected':
    '{count, plural, one {# link found in this draft} other {# links found in this draft}}',
  'composerWeb.links.noneDetected': 'Chưa có liên kết nào trong bản dự thảo này.',
  'composerWeb.links.modeLabel': 'Cách liên kết này xuất bản',
  'composerWeb.links.original': 'URL gốc',
  'composerWeb.links.utmSource': 'Nguồn',
  'composerWeb.links.utmMedium': 'Trung bình',
  'composerWeb.links.utmCampaign': 'Chiến dịch',
  'composerWeb.links.utmTerm': 'kỳ hạn',
  'composerWeb.links.utmContent': 'Nội dung',
  'composerWeb.links.domainVerified': '{domain}, đã được xác minh cho không gian làm việc này',
  'composerWeb.links.domainDefault': 'Tên miền mặc định Post Array',
  'composerWeb.links.domainNone': 'Chưa có tên miền có thương hiệu nào được xác minh.',
  'composerWeb.links.notAllowedHere': '{account} không cho phép liên kết ở đây.',
  'composerWeb.sequence.kindComment': 'Bình luận',
  'composerWeb.sequence.kindThread': 'Phần chủ đề',
  'composerWeb.sequence.kindLabel': 'Loại mặt hàng',
  'composerWeb.sequence.moveUp': 'Di chuyển mục này sớm hơn',
  'composerWeb.sequence.moveDown': 'Di chuyển mục này sau',
  'composerWeb.sequence.remove': 'Xóa mục này',
  'composerWeb.sequence.absoluteTime': 'Chạy ở {time}, tức là {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'Nếu một mục không thành công, bài đăng đã xuất bản vẫn được xuất bản và các mục sau đó sẽ không chạy. Bạn nhận được một mục hành động.',
  'composerWeb.sequence.maxReached':
    '{account} accepts {limit, plural, one {# follow up item} other {# follow up items}}.',
  'composerWeb.sequence.minDelay': 'Độ trễ ngắn nhất mà {provider} cho phép ở đây là {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Cùng tài khoản với bài viết',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {No issues} one {# issue} other {# issues}} on this item',
  'composerWeb.sequence.customMinutes': 'Phút sau mục trước',
  'composerWeb.repeat.enable': 'Lặp lại bài đăng này',
  'composerWeb.repeat.cadenceLabel': 'Bao lâu một lần',
  'composerWeb.repeat.maximum': 'Một bài đăng lặp lại có thể chạy nhiều nhất là {limit} lần.',
  'composerWeb.repeat.occurrenceLabel': 'Số lượng bài viết',
  'composerWeb.repeat.duplicateCheck':
    'Mỗi lần xuất hiện đều được kiểm tra nội dung trùng lặp trước khi xuất bản. Một trường hợp không kiểm tra được sẽ trở thành một mục hành động thay vì xuất bản.',
  'composerWeb.repeat.occurrenceList': 'Lần xuất hiện đầu tiên',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {and # more occurrence} other {and # more occurrences}}',
  'composerWeb.set.heading': 'Bộ và chữ ký',
  'composerWeb.set.pickerTitle': 'Bắt đầu từ một bộ',
  'composerWeb.set.pickerDescription':
    'Bộ điền vào mục tiêu, văn bản và cài đặt. Bản nháp mà nó tạo ra là độc lập nên việc chỉnh sửa Tập sau sẽ không bao giờ thay đổi bài đăng đã được phê duyệt hoặc lên lịch.',
  'composerWeb.set.accountCount': '{count, plural, one {# account} other {# accounts}}',
  'composerWeb.set.apply': 'Sử dụng bộ này',
  'composerWeb.set.none': 'Chưa có Bộ nào được lưu.',
  'composerWeb.signature.pickerLabel': 'Chữ ký',
  'composerWeb.signature.scope': 'Dành cho {project} trên {provider} trong {language}',
  'composerWeb.signature.previewHeading': 'Cách kết thúc bài viết',
  'composerWeb.signature.notMatching':
    'Chữ ký này dành cho một dự án, nền tảng hoặc ngôn ngữ khác, vì vậy nó không được cung cấp ở đây.',
  'composerWeb.assist.menuLabel': 'Hỗ trợ văn bản này',
  'composerWeb.assist.unavailableTitle': 'Hỗ trợ văn bản chưa được định cấu hình',
  'composerWeb.assist.unavailableBody':
    'Không có cổng AI nào được thiết lập cho không gian làm việc này nên các hành động hỗ trợ sẽ bị tắt. Mọi thứ khác trong trình soạn thảo đều hoạt động bình thường.',
  'composerWeb.assist.targetLabel': 'Áp dụng cho',
  'composerWeb.assist.targetMaster': 'Bản thảo chính',
  'composerWeb.assist.targetVariant': 'Phiên bản dành cho {account}',
  'composerWeb.assist.beforeLabel': 'văn bản hiện tại',
  'composerWeb.assist.afterLabel': 'Văn bản đề xuất',
  'composerWeb.assist.regionLabel': 'Thay đổi văn bản được đề xuất, chưa được áp dụng',
  'composerWeb.assist.added': 'đã thêm',
  'composerWeb.assist.removed': 'đã xóa',
  'composerWeb.assist.evidence': 'Bằng chứng và nguồn',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Không tìm thấy nguồn cho khiếu nại này. Kiểm tra nó trước khi xuất bản.',
  'composerWeb.assist.failed': 'Yêu cầu hỗ trợ không hoàn thành. Văn bản của bạn không thay đổi.',
  'composerWeb.assist.noMediaGeneration':
    'Post Array không tạo hình ảnh hoặc video. Mang các tập tin đã hoàn thành vào thư viện và xuất bản chúng ở đây.',
  'composerWeb.autosave.pinned':
    'Đây là phiên bản đã được phê duyệt. Chỉnh sửa nó sẽ tạo ra một phiên bản mới và xóa sự chấp thuận.',
  'composerWeb.autosave.pinnedAcknowledge': 'Chỉnh sửa và xóa phê duyệt',
  'composerWeb.autosave.conflictTitle': 'Hai phiên bản của dự thảo này',
  'composerWeb.autosave.conflictKeepMine': 'Giữ những gì tôi đã viết',
  'composerWeb.autosave.conflictKeepTheirs': 'Sử dụng phiên bản từ {name}',
  'composerWeb.autosave.conflictHelp':
    'Không có gì được hợp nhất tự động. Chọn từng trường rồi lưu.',
  'composerWeb.autosave.retry': 'Hãy thử lưu lại',
  'composerWeb.shortcuts.title': 'Phím tắt Composer',
  'composerWeb.shortcuts.nextTarget': 'Mục tiêu tiếp theo',
  'composerWeb.shortcuts.previousTarget': 'Mục tiêu trước đó',
  'composerWeb.shortcuts.nextIssue': 'Số tiếp theo',
  'composerWeb.shortcuts.previousIssue': 'Số trước',
  'composerWeb.shortcuts.save': 'Lưu bản nháp ngay bây giờ',
  'composerWeb.shortcuts.openSchedule': 'Mở bảng lịch trình',
  'composerWeb.shortcuts.open': 'Hiển thị phím tắt',
  'composerWeb.review.heading': 'Xem lại',
  'composerWeb.review.contentVersion': 'Phiên bản nội dung {checksum}',
  'composerWeb.review.approvalPolicy': 'Chính sách: {policy}',
  'composerWeb.review.approverPending': 'Đang chờ quyết định từ {approver}.',
  'composerWeb.review.approverNone': 'Không cần phê duyệt cho các mục tiêu này.',
  'composerWeb.review.perTargetHeading': 'Mỗi tài khoản nhận được gì',
  'composerWeb.review.finalUrl': 'Liên kết đã xuất bản',
  'composerWeb.review.privacyState': 'Khán giả: {value}',
  'composerWeb.review.disclosureState': 'Tiết lộ: {value}',
  'composerWeb.review.disclosureNone': 'Không có bộ tiết lộ',
  'composerWeb.review.mediaVersion': '{name}, phiên bản {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# target cannot be scheduled yet} other {# targets cannot be scheduled yet}}',
  'composerWeb.review.offlineBlocked':
    'Lập kế hoạch và xuất bản cần có sự kết nối. Bản nháp của bạn an toàn trên thiết bị này.',
  'composerWeb.review.publishConfirm':
    'This publishes to {count, plural, one {# account} other {# accounts}} straight away. It cannot be undone from here.',
  'composerWeb.savedFlash': 'Đã lưu',
  'composerWeb.validation.clear.v2': 'Không có gì chặn.',
  'composerWeb.schedule.confirmed': 'Đã lên lịch',
  'composerWeb.page.newDraft': 'Dự thảo mới',
  'composerWeb.page.loading': 'Đang tải bản nháp, mục tiêu của nó và giới hạn của chúng',
  'composerWeb.page.errorTitle': 'Không thể mở được bản nháp này',
  'composerWeb.page.errorBody':
    'Không có gì bị mất. Hãy thử lại và nếu vẫn không thành công thì tham chiếu bên dưới sẽ giúp bộ phận hỗ trợ tìm thấy yêu cầu.',
  'composerWeb.page.noConnectionsTitle': 'Kết nối tài khoản trước khi soạn',
  'composerWeb.page.noConnectionsBody':
    'Bản nháp cần có ít nhất một tài khoản được kết nối để Post Array biết các giới hạn, bản xem trước và cài đặt cần hiển thị.',
  'composerWeb.page.noConnectionsExample':
    'Ví dụ: khi kết nối X và LinkedIn, một bản nháp sẽ trở thành hai phiên bản gốc có bộ đếm riêng.',
  'composerWeb.page.permissionTitle': 'Bạn không thể tạo bài viết trong không gian làm việc này',
  'composerWeb.page.permissionBody':
    'Việc soạn thảo cần có vai trò biên tập viên trở lên. Chủ sở hữu hoặc quản trị viên có thể thay đổi vai trò của bạn.',
  'composerWeb.page.rateLimitTitle': 'Lưu quá nhiều bản nháp trong thời gian ngắn',
  'composerWeb.page.rateLimitCause':
    'Không gian làm việc này đã đạt đến giới hạn ghi cho cửa sổ hiện tại. Trong khi đó, văn bản của bạn được lưu giữ trên thiết bị này.',
  'composerWeb.page.rateLimitAlternative':
    'Hãy tiếp tục viết. Quá trình lưu sẽ tự động tiếp tục khi cửa sổ đặt lại.',
  'mediaLib.view.grid': 'Lưới',
  'mediaLib.view.list': 'Danh sách',
  'mediaLib.view.label': 'Bố cục',
  'mediaLib.sort.label': 'Sắp xếp',
  'mediaLib.sort.newest': 'Mới nhất đầu tiên',
  'mediaLib.sort.name': 'Tên',
  'mediaLib.sort.size': 'Lớn nhất đầu tiên',
  'mediaLib.select': 'Chọn {name}',
  'mediaLib.column.file': 'tập tin',
  'mediaLib.column.type': 'Loại',
  'mediaLib.column.size': 'Kích thước',
  'mediaLib.column.altText': 'Văn bản thay thế',
  'mediaLib.column.rights': 'Quyền',
  'mediaLib.column.added': 'Đã thêm',
  'mediaLib.openDetail': 'Mở {name}',
  'mediaLib.empty.title': 'Chưa có phương tiện truyền thông nào',
  'mediaLib.empty.body':
    'Tải lên hình ảnh và video bạn đã có hoặc nhập tệp từ URL. Post Array kiểm tra loại và kích thước đối với từng tài khoản bạn xuất bản.',
  'mediaLib.empty.example':
    'Ví dụ: launch_hero.jpg, 1600 x 900, bộ văn bản thay thế, được sử dụng trong 2 bài viết.',
  'mediaLib.error.title': 'Không thể tải thư viện',
  'mediaLib.error.body': 'Các tập tin của bạn được an toàn. Không có gì thay đổi bởi thất bại này.',
  'mediaLib.offline.title': 'Thư viện không khả dụng khi ngoại tuyến',
  'mediaLib.offline.body':
    'Chúng tôi không thể làm mới thư viện khi không có kết nối. Các tệp đã có trên màn hình này không thay đổi. Hãy kết nối lại rồi thử lại.',
  'mediaLib.rateLimited.title': 'Thư viện cần tạm nghỉ một chút',
  'mediaLib.rateLimited.cause':
    'API yêu cầu chúng tôi chậm lại trong khi tải tệp của bạn. Phương tiện đã lưu trữ của bạn vẫn an toàn.',
  'mediaLib.rateLimited.resetLabel': 'Thử lại sau',
  'mediaLib.rateLimited.alternative':
    'Bạn vẫn có thể soạn nháp cục bộ, nhưng việc tải lên và thay đổi thư viện phải chờ đến khi giới hạn được đặt lại.',
  'mediaLib.loading': 'Đang tải thư viện phương tiện của bạn',
  'mediaLib.permission.title': 'Bạn không thể thấy thư viện không gian làm việc này',
  'mediaLib.permission.body':
    'Việc xem phương tiện truyền thông cần có vai trò người xem trở lên đối với dự án này. Chủ sở hữu hoặc quản trị viên có thể cấp nó.',
  'mediaLib.upload.heading': 'Thêm phương tiện',
  'mediaLib.upload.browse': 'Chọn tập tin',
  'mediaLib.upload.dropHint':
    'Kéo tệp vào đây hoặc chọn chúng. Quá trình tải lên sẽ tiếp tục nếu kết nối bị rớt.',
  'mediaLib.upload.queueHeading': 'Tải lên',
  'mediaLib.upload.progress': '{name}, {percent} của {size} đã gửi',
  'mediaLib.upload.paused': 'Đã tạm dừng. {sent} của {size} đã được lưu trữ.',
  'mediaLib.upload.resume': 'Tiếp tục tải lên',
  'mediaLib.upload.pause': 'Tạm dừng tải lên',
  'mediaLib.upload.cancel': 'Hủy tải lên này',
  'mediaLib.upload.retry': 'Hãy thử tải lên lại lần nữa',
  'mediaLib.upload.finalizing': 'Đang hoàn thiện {name}',
  'mediaLib.upload.done': '{name} có trong thư viện của bạn',
  'mediaLib.upload.failed': '{name} chưa hoàn thành. {reason}',
  'mediaLib.upload.offline':
    'Ngoại tuyến. Quá trình tải lên tiếp tục từ nơi chúng dừng lại khi bạn kết nối lại.',
  'mediaLib.upload.rejectedType':
    '{name} là {mimeType}, không có tài khoản nào bạn chọn chấp nhận.',
  'mediaLib.upload.rejectedSize':
    '{name} là {size}. Giới hạn thấp nhất trên tài khoản của bạn là {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Accepted by # of your accounts} other {Accepted by # of your accounts}}',
  'mediaLib.upload.rejectedBy': 'Không được {accounts} chấp nhận',
  'mediaLib.upload.checkedAgainst': 'Đã đối chiếu với các tài khoản được chọn trong bản nháp này.',
  'mediaLib.upload.noTargets':
    'Không có tài khoản nào được chọn nên tệp chỉ được kiểm tra theo các giá trị mặc định của không gian làm việc.',
  'mediaLib.import.urlLabel': 'URL tệp công khai',
  'mediaLib.import.urlPlaceholder': 'https://cdn.example.com/launch-video.mp4',
  'mediaLib.import.importing': 'Đang nhập phương tiện',
  'mediaLib.import.succeeded': 'Tệp đã có trong thư viện của bạn',
  'mediaLib.import.scanPending':
    'Post Array đã ghi lại nguồn của tệp. Việc xuất bản sẽ chờ đến khi kiểm tra an toàn hoàn tất.',
  'mediaLib.import.failed': 'Không thể nhập tệp',
  'mediaLib.import.failedHelp':
    'Hãy kiểm tra rằng liên kết công khai và trỏ trực tiếp đến một tệp phương tiện được hỗ trợ, rồi thử lại.',
  'mediaLib.import.readOnly': 'Kết nối API để nhập tệp trong môi trường này.',
  'mediaLib.import.offline': 'Kết nối lại trước khi nhập một tệp.',
  'mediaLib.import.issue.invalid': 'Nhập một URL đầy đủ.',
  'mediaLib.import.issue.scheme': 'Dùng liên kết HTTP hoặc HTTPS.',
  'mediaLib.import.issue.credentials': 'Dùng liên kết không có tên đăng nhập hay mật khẩu.',
  'mediaLib.retention.title': 'Tệp lưu trữ được giữ trong 30 ngày sau khi bài đăng được tạo',
  'mediaLib.retention.body':
    'Khi một tệp được đính kèm vào một bài đăng, chúng tôi sẽ xóa vĩnh viễn tệp đó khỏi kho lưu trữ của Post Array 30 ngày sau khi bài đăng đó được tạo. Các tệp đang chờ được đính kèm dùng ngày tải lên làm mốc dọn dẹp dự phòng. Nội dung bài đăng, biên nhận xuất bản và lịch sử kiểm tra vẫn khả dụng lâu hơn. Một bài đăng đã xuất bản trên một nền tảng xã hội không bị gỡ bỏ khi tệp lưu trữ của nó hết hạn.',
  'mediaLib.retention.limits':
    'Ảnh, âm thanh và tệp PDF có thể lên đến {imageSize}. Video có thể lên đến {videoSize}.',
  'mediaLib.retention.expiresLabel': 'Ngày xóa tệp',
  'mediaLib.retention.deleted': 'Đã xóa vĩnh viễn',
  'mediaLib.retention.deletedTitle': 'Tệp lưu trữ này đã bị xóa',
  'mediaLib.retention.deletedBody':
    'Thời hạn lưu trữ 30 ngày đã kết thúc. Nội dung bài đăng, biên nhận xuất bản và lịch sử kiểm tra vẫn còn.',
  'mediaLib.processing.unavailableTitle': 'Tệp này chưa sẵn sàng để xuất bản',
  'mediaLib.processing.unavailableBody':
    'Việc xử lý hoặc kiểm tra an toàn vẫn đang chờ, hoặc đã không đạt. Hãy tải lại tệp nếu trạng thái này không tự hết.',
  'mediaLib.processing.pendingTitle': 'Quét an toàn chưa khả dụng trong giai đoạn tiền phát hành',
  'mediaLib.processing.pendingBody':
    'Tệp được lưu trữ trong 30 ngày, nhưng nó không thể được đính kèm vào một bài đăng đã xuất bản cho đến khi quét an toàn được bật.',
  'mediaLib.processing.blockedTitle': 'Tệp này không thể xuất bản',
  'mediaLib.processing.blockedBody':
    'Tệp không qua được xử lý hoặc kiểm tra an toàn. Hãy tải lên một tệp khác.',
  'mediaLib.alt.heading': 'Văn bản thay thế',
  'mediaLib.alt.help':
    'Mô tả những gì quan trọng trong hình ảnh cho người không thể nhìn thấy nó. Một hoặc hai câu thường là đủ.',
  'mediaLib.alt.count': '{used} của các ký tự {limit}',
  'mediaLib.alt.requiredBy': 'Được yêu cầu bởi {accounts}',
  'mediaLib.alt.waive': 'Hình ảnh này không mang thông tin',
  'mediaLib.alt.waiveReason': 'Tại sao nó không cần mô tả',
  'mediaLib.alt.waiveHelp':
    'Chỉ sử dụng cái này để trang trí. Hình ảnh được miễn trừ xuất bản với mô tả trống nếu nền tảng cho phép.',
  'mediaLib.alt.waived': 'Được miễn trừ bởi {name} trên {date}. Lý do: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} không chấp nhận văn bản thay thế thông qua API cho tài khoản này.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# file has no alt text} other {# files have no alt text}}',
  'mediaLib.rights.heading': 'Quyền và sự đồng ý',
  'mediaLib.rights.declared': 'Được khai báo bởi {name} trên {date}',
  'mediaLib.rights.undeclared': 'Chưa được khai báo. Khai báo nó trước khi tập tin này xuất bản.',
  'mediaLib.rights.ownerLabel': 'Ai sở hữu tập tin này',
  'mediaLib.rights.ownerSelf': 'Không gian làm việc này',
  'mediaLib.rights.ownerLicensed': 'Được cấp phép từ người khác',
  'mediaLib.rights.ownerUgc': 'Một khách hàng hoặc người sáng tạo đã cho phép',
  'mediaLib.rights.licenseLabel': 'Giấy phép hoặc tài liệu tham khảo cho phép',
  'mediaLib.rights.peopleLabel': 'Mọi người xuất hiện trong tập tin này',
  'mediaLib.rights.peopleConsent': 'Mọi người được hiển thị đã đồng ý được xuất bản',
  'mediaLib.rights.musicLabel': 'Tệp này chứa nhạc hoặc nhạc phim',
  'mediaLib.rights.confirm':
    'Tôi có quyền xuất bản tệp này, bao gồm mọi người, âm nhạc, biểu tượng và thương hiệu trong đó.',
  'mediaLib.rights.blocking':
    'Tệp này không thể được lên lịch cho đến khi các quyền được khai báo.',
  'mediaLib.editor.heading': 'Chỉnh sửa ảnh',
  'mediaLib.editor.description':
    'Mọi chỉnh sửa đều được lưu dưới dạng phiên bản mới. Tệp gốc được lưu giữ và có thể được khôi phục.',
  'mediaLib.editor.tab.crop': 'Cắt',
  'mediaLib.editor.tab.transform': 'Thay đổi kích thước và xoay',
  'mediaLib.editor.tab.canvas': 'Vải bạt',
  'mediaLib.editor.tab.output': 'Định dạng và kích thước',
  'mediaLib.editor.tab.thumbnail': 'Hình thu nhỏ',
  'mediaLib.editor.presetLabel': 'Đặt trước khía cạnh',
  'mediaLib.editor.presetFree': 'miễn phí',
  'mediaLib.editor.presetFor': '{ratio}, được sử dụng bởi {accounts}',
  'mediaLib.editor.cropX': 'Cắt từ cạnh đầu',
  'mediaLib.editor.cropY': 'Cắt từ trên xuống',
  'mediaLib.editor.cropWidth': 'Cắt chiều rộng',
  'mediaLib.editor.cropHeight': 'Cắt chiều cao',
  'mediaLib.editor.cropKeyboardHint':
    'Hộp cắt được thiết lập với các trường số nên nó hoạt động hoàn toàn từ bàn phím.',
  'mediaLib.editor.widthLabel': 'Chiều rộng tính bằng pixel',
  'mediaLib.editor.heightLabel': 'Chiều cao tính bằng pixel',
  'mediaLib.editor.lockRatio': 'Giữ tỷ lệ hiện tại',
  'mediaLib.editor.rotateLabel': 'Xoay',
  'mediaLib.editor.rotateDegrees': '{degrees} độ',
  'mediaLib.editor.flipHorizontal': 'Lật qua trục tung',
  'mediaLib.editor.flipVertical': 'Lật qua trục ngang',
  'mediaLib.editor.canvasColor': 'Màu nền',
  'mediaLib.editor.canvasFit': 'Làm thế nào hình ảnh nằm trên canvas',
  'mediaLib.editor.canvasFitCover': 'Đổ đầy khung vẽ và cắt phần tràn',
  'mediaLib.editor.canvasFitContain': 'Lắp toàn bộ hình ảnh và đệm phần còn lại',
  'mediaLib.editor.formatLabel': 'định dạng đầu ra',
  'mediaLib.editor.qualityLabel': 'Chất lượng nén',
  'mediaLib.editor.qualityValue': '{value} trên 100',
  'mediaLib.editor.estimatedSize': 'Sản lượng ước tính {size}, từ {original}',
  'mediaLib.editor.estimatedSizeUnknown': 'Kích thước đầu ra chỉ được biết khi tệp được xử lý.',
  'mediaLib.editor.thumbnailHelp':
    'Chọn khung hoặc tệp được sử dụng làm hình thu nhỏ video mà nền tảng chấp nhận.',
  'mediaLib.editor.thumbnailFrame': 'Khung tại {time}',
  'mediaLib.editor.save': 'Lưu dưới dạng phiên bản mới',
  'mediaLib.editor.saving': 'Đang lưu phiên bản {version}',
  'mediaLib.editor.saved': 'Đã lưu phiên bản {version}. Bản gốc vẫn còn ở đây.',
  'mediaLib.editor.discard': 'Hủy các chỉnh sửa này',
  'mediaLib.editor.noChanges': 'Chưa có thay đổi nào để lưu.',
  'mediaLib.editor.revalidate':
    'Việc lưu sẽ kiểm tra lại tệp này với mọi tài khoản trong bản nháp sử dụng nó.',
  'mediaLib.editor.noGeneration':
    'Trình chỉnh sửa này thay đổi tệp bạn đã tải lên. Nó không tạo ra hình ảnh mới.',
  'mediaLib.versions.heading': 'Phiên bản',
  'mediaLib.versions.original': 'Tải lên ban đầu',
  'mediaLib.versions.current': 'Phiên bản hiện tại',
  'mediaLib.versions.restore': 'Khôi phục phiên bản {version}',
  'mediaLib.versions.item': 'Phiên bản {version}, {dimensions}, {size}, {date}',
  'mediaLib.provenance.heading': 'Tập tin này đến từ đâu',
  'mediaLib.provenance.sourceUrl': 'URL nguồn',
  'mediaLib.provenance.fetchedAt': 'Đã tìm nạp {date}',
  'mediaLib.provenance.declaredAuthor': 'Tác giả đã nêu',
  'mediaLib.provenance.declaredLicense': 'Giấy phép đã nêu',
  'mediaLib.provenance.contentCredentials': 'Thông tin xác thực nội dung được nhúng',
  'mediaLib.provenance.contentCredentialsNone':
    'Tệp này không có thông tin xác thực nội dung được nhúng. Điều đó là bình thường và không có nghĩa là có gì sai.',
  'mediaLib.provenance.unverified':
    'Những chi tiết này được lấy từ nguồn chứ không phải từ Post Array. Kiểm tra chúng trước khi bạn dựa vào chúng.',
  'mediaLib.picker.title': 'Chọn phương tiện',
  'mediaLib.picker.description':
    'Các tệp được kiểm tra đối với các tài khoản đã chọn trong bản nháp này.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Choose files} one {Add # file} other {Add # files}}',
  'mediaLib.picker.forMaster': 'Thêm vào bản thảo chính',
  'mediaLib.picker.forVariant': 'Chỉ thêm vào phiên bản dành cho {account}',
} as const;
