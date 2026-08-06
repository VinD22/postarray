/** vi beta catalog namespace. */
export const analyticsMessages = {
  'analytics.title': 'Phân tích',
  'analytics.subtitle':
    'Điều gì đã xảy ra, nó mới như thế nào và điều gì đáng để thử nghiệm tiếp theo.',
  'analytics.range.7d': '7 ngày qua',
  'analytics.range.30d': '30 ngày qua',
  'analytics.range.90d': '90 ngày qua',
  'analytics.range.custom': 'Phạm vi tùy chỉnh',
  'analytics.range.limitedByProvider':
    '{provider} returns at most {days, plural, one {# day} other {# days}} of history for this account.',
  'analytics.account.select': 'Chọn một tài khoản',
  'analytics.compareTo': 'So với {baseline}',
  'analytics.baseline.trailingMedian':
    'your median of the previous {count, plural, one {# comparable post} other {# comparable posts}}',
  'analytics.metric.followers': 'Người theo dõi',
  'analytics.metric.subscribers': 'Người đăng ký',
  'analytics.metric.profileViews': 'Lượt xem hồ sơ',
  'analytics.metric.impressions': 'Số lần hiển thị',
  'analytics.metric.reach': 'Tiếp cận',
  'analytics.metric.views': 'Lượt xem',
  'analytics.metric.videoViews': 'Lượt xem video',
  'analytics.metric.watchTime': 'Thời gian xem',
  'analytics.metric.averageViewDuration': 'Thời lượng xem trung bình',
  'analytics.metric.averageViewPercentage': 'Phần trăm trung bình đã xem',
  'analytics.metric.likes': 'Lượt thích và phản ứng',
  'analytics.metric.comments': 'Nhận xét và trả lời',
  'analytics.metric.shares': 'Chia sẻ, đăng lại và trích dẫn',
  'analytics.metric.saves': 'Lưu và đánh dấu',
  'analytics.metric.linkClicks': 'Số lần nhấp vào liên kết',
  'analytics.metric.clickThroughRate': 'Tỷ lệ nhấp qua',
  'analytics.metric.engagementRate': 'Tỷ lệ tương tác',
  'analytics.metric.publishedCount': 'Bài viết được xuất bản',
  'analytics.metric.followerChange': 'Thay đổi người theo dõi',
  'analytics.definition.title': 'Cách xác định {metric}',
  'analytics.definition.provider': 'Được báo cáo bởi {provider} là {providerField}.',
  'analytics.definition.denominator.label': 'Mẫu số: {denominator}.',
  'analytics.definition.unit': 'Đơn vị: {unit}.',
  'analytics.definition.normalized':
    'Chuẩn hóa từ giá trị nhà cung cấp. Giá trị thô được giữ và có sẵn.',
  'analytics.definition.notComparable':
    '{provider} và {otherProvider} định nghĩa điều này một cách khác nhau. Hãy so sánh chúng một cách cẩn thận.',
  'analytics.value.unavailable': 'Không có sẵn',
  'analytics.value.unavailableReason.permission':
    'Tài khoản này chưa được cấp quyền cần thiết cho chỉ số này.',
  'analytics.value.unavailableReason.unsupported': '{provider} không báo cáo số liệu này.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} công bố số liệu này sau. Kiểm tra lại sau {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'Lần đồng bộ hóa cuối cùng không thành công. Chúng tôi đang thử lại và sẽ không hiển thị số được đoán.',
  'analytics.freshness.synced': 'Đã đồng bộ hóa {relativeTime}',
  'analytics.freshness.stale':
    'Đồng bộ hóa thành công lần cuối {relativeTime}. Điều này có thể đã lỗi thời.',
  'analytics.freshness.coverage':
    '{covered} của các bài đăng {total} trong phạm vi này có dữ liệu hiện tại.',
  'analytics.feedback.title': 'Điều này gợi ý gì',
  'analytics.feedback.aboveBaseline':
    'Bài đăng này đã nhận được nhiều {percent} hơn {metric} so với {baseline}.',
  'analytics.feedback.belowBaseline':
    'Bài đăng này nhận được ít {percent} {metric} hơn {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Bài đăng hình ảnh và bài đăng video không thể so sánh trực tiếp ở đây.',
  'analytics.feedback.smallSample':
    'Mẫu này nhỏ. Kiểm tra lại câu tương tự trước khi đưa ra kết luận.',
  'analytics.feedback.association':
    'Số lượng bình luận đã tăng lên sau khi độ trễ nhận xét đầu tiên thay đổi từ {before} thành {after}. Đây là một hiệp hội, không phải bằng chứng về nguyên nhân.',
  'analytics.feedback.nextTest': 'Kiểm tra gì tiếp theo',
  'analytics.feedback.doNotInfer': 'Điều này không hiển thị',
  'analytics.feedback.noScore':
    'Không có điểm đa nền tảng duy nhất ở đây. Chọn một số liệu có định nghĩa mà bạn tin tưởng.',
  'analytics.experiment.title': 'Thí nghiệm',
  'analytics.experiment.hypothesis': 'giả thuyết',
  'analytics.experiment.variants': 'Biến thể',
  'analytics.experiment.successMetric': 'Chỉ số thành công',
  'analytics.experiment.window': 'Cửa sổ đo',
  'analytics.experiment.status.running': 'Chạy đến {date}',
  'analytics.experiment.status.complete': 'Hoàn thành',
  'analytics.experiment.tagBeforePublishing':
    'Gắn thẻ thử nghiệm trước khi xuất bản để việc so sánh không được thực hiện sau thực tế.',
  'analytics.experiment.caveats': 'Hãy cẩn thận',
  'analytics.export.title': 'Xuất khẩu',
  'analytics.export.csv': 'Tải xuống CSV',
  'analytics.export.json': 'Tải xuống JSON',
  'analytics.export.providerRestriction':
    '{provider} hạn chế cách kết hợp hoặc lưu trữ dữ liệu của nó. Một số trường không được bao gồm.',
  'analytics.links.title': 'Liên kết được theo dõi',
  'analytics.links.subtitle':
    'Đo lường chuyển hướng của bên thứ nhất. Đây là một chuỗi riêng biệt với các lần nhấp vào liên kết mà một nền tảng báo cáo.',
  'analytics.links.destination': 'Điểm đến',
  'analytics.links.shortUrl': 'URL ngắn',
  'analytics.links.totalRequests': 'Tổng số yêu cầu',
  'analytics.links.humanClicks': 'Số nhấp chuột bị trùng lặp',
  'analytics.links.suspectedBots': 'Bot đáng ngờ',
  'analytics.links.referrerClass': 'Người giới thiệu',
  'analytics.links.deviceClass': 'Thiết bị',
  'analytics.links.country': 'Quốc gia',
  'analytics.links.lastEvent': 'Lần nhấp cuối cùng {relativeTime}',
  'analytics.links.privacyNote':
    'Chúng tôi chỉ giữ vị trí thô và loại thiết bị. Địa chỉ IP thô được lưu giữ trong thời gian ngắn để phát hiện lạm dụng và trùng lặp, sau đó bị loại bỏ.',
  'analytics.links.separateSources':
    'Không thêm các nhấp chuột này vào số được báo cáo trên nền tảng. Họ đếm những thứ khác nhau.',
} as const;
