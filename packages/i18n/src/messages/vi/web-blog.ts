/**
 * The blog's page chrome.
 *
 * What belongs here: headings, labels, cluster names, byline names, feed
 * strings. What deliberately does not: article prose. The English catalog is
 * merged into one object that every page resolves, so putting article bodies
 * here would ship several thousand words of publishing advice to a reader who
 * opened the pricing page. Article content lives in typed modules under
 * `apps/web/src/features/blog/articles`, loaded per slug.
 *
 * The same rules bind both: no em dash, no hype word, and nothing that claims
 * this product publishes to any platform today, because no connector has
 * passed its definition of done.
 */
export const webBlogMessages = {
  'web.blog.meta.title': 'Bài viết về vận hành đăng bài',
  'web.blog.meta.description':
    'Bài viết về nhịp độ đăng bài, các mô hình lên lịch, múi giờ, cách thích ứng theo từng nền tảng và cách vận hành công việc khách hàng như những dự án riêng biệt.',

  'web.blog.title': 'Bài viết',
  'web.blog.lede':
    'Ghi chú về cơ chế của việc đăng bài: cách định cỡ một lịch đăng, cách hàng đợi hoạt động khi một tuần bị trễ, những gì thực sự khác nhau giữa các nền tảng, và cách công việc khách hàng luôn được tách biệt.',

  'web.blog.notice.prelaunch.title':
    'Những bài viết này nói về vấn đề, không phải về một sản phẩm bạn có thể dùng ngay',
  'web.blog.notice.prelaunch.body':
    'Chưa có kết nối nào ở đây hoàn tất quá trình xác minh nhà cung cấp, nên hiện tại chưa có gì được đăng lên bất kỳ nền tảng nào qua sản phẩm này. Mỗi quy tắc nền tảng bên dưới đều đi kèm tài liệu chính thức mà nó bắt nguồn và ngày một người đã đọc tài liệu đó.',

  'web.blog.cluster.cadence': 'Nhịp độ',
  'web.blog.cluster.scheduling': 'Lên lịch',
  'web.blog.cluster.adaptation': 'Thích ứng theo từng nền tảng',
  'web.blog.cluster.operations': 'Vận hành đại lý',
  'web.blog.cluster.developers': 'Tích hợp qua API',

  'web.blog.label.published': 'Đã đăng {date}',
  'web.blog.label.updated': 'Đã cập nhật {date}',
  'web.blog.label.writtenBy': 'Viết bởi {name}',
  'web.blog.label.reviewedBy': 'Xem lại bởi {name}',
  'web.blog.label.sources': 'Nguồn',
  'web.blog.label.sourceRead': 'Đọc {date}',
  'web.blog.label.cluster': 'Chủ đề',
  'web.blog.label.articleList': 'Bài viết',
  'web.blog.label.backToIndex': 'Tất cả bài viết',
  'web.blog.label.count':
    '{count, plural, =0 {Chưa có bài viết nào} other {# bài viết}}',

  'web.blog.byline.editorial.name': 'Ban nghiên cứu về xuất bản',
  'web.blog.byline.editorial.role': 'Viết và duy trì các bài viết này',
  'web.blog.byline.platform.name': 'Ban tài liệu nền tảng',
  'web.blog.byline.platform.role': 'Đối chiếu từng câu về nền tảng với nguồn chính thức của nó',

  'web.blog.feed.title': 'Bài viết về vận hành đăng bài',
  'web.blog.feed.description':
    'Bài viết mới về nhịp độ đăng bài, các mô hình lên lịch, múi giờ, cách thích ứng theo từng nền tảng và vận hành đại lý.',
  'web.blog.feed.label': 'Nguồn cấp RSS',

  'web.blog.empty.title': 'Chưa có bài viết nào ở đây',
  'web.blog.empty.body':
    'Những bài viết đầu tiên đang được viết. Nguồn cấp sẽ có chúng khi chúng được đăng.',

  'web.blog.label.language': 'Đọc bằng',
  'web.blog.label.notTranslated':
    'Bài viết này chưa được viết bằng ngôn ngữ của bạn. Đang hiển thị bản tiếng Anh.',
  'web.blog.label.languageCount': '{count, plural, other {# ngôn ngữ}}',
} as const;
