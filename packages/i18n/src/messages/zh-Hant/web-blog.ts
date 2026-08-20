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
  'web.blog.meta.title': '關於發布作業的文章',
  'web.blog.meta.description':
    '關於發布節奏、排程模式、時區、各平台適配，以及將客戶業務作為獨立專案運作的文章。',

  'web.blog.title': '文章',
  'web.blog.lede':
    '關於發布運作機制的筆記：如何拿捏排程規模、佇列在某週延誤時如何運作、各平台之間真正的差異，以及客戶業務如何保持分開。',

  'web.blog.notice.prelaunch.title': '這些文章談的是問題本身，而不是一個你已能使用的產品',
  'web.blog.notice.prelaunch.body':
    '此處尚無任何連接器完成供應商驗證，因此本產品目前尚未透過任何平台發布內容。以下每條平台規則，都附有其來源的官方文件，以及有人閱讀該文件的日期。',

  'web.blog.cluster.cadence': '發布節奏',
  'web.blog.cluster.scheduling': '排程',
  'web.blog.cluster.adaptation': '各平台適配',
  'web.blog.cluster.operations': '代理商營運',
  'web.blog.cluster.developers': '透過 API 整合',

  'web.blog.label.published': '發布於 {date}',
  'web.blog.label.updated': '更新於 {date}',
  'web.blog.label.writtenBy': '作者：{name}',
  'web.blog.label.reviewedBy': '審閱者：{name}',
  'web.blog.label.sources': '來源',
  'web.blog.label.sourceRead': '閱讀於 {date}',
  'web.blog.label.cluster': '主題',
  'web.blog.label.articleList': '文章',
  'web.blog.label.backToIndex': '所有文章',
  'web.blog.label.count': '{count, plural, =0 {尚無文章} other {# 篇文章}}',

  'web.blog.byline.editorial.name': '發布研究小組',
  'web.blog.byline.editorial.role': '撰寫並維護這些文章',
  'web.blog.byline.platform.name': '平台文件小組',
  'web.blog.byline.platform.role': '核對每一句關於平台的敘述與其官方來源',

  'web.blog.feed.title': '關於發布作業的文章',
  'web.blog.feed.description': '關於發布節奏、排程模式、時區、各平台適配與代理商營運的新文章。',
  'web.blog.feed.label': 'RSS 訂閱',

  'web.blog.empty.title': '這裡尚未發布任何內容',
  'web.blog.empty.body': '第一批文章正在撰寫中。準備就緒後就會出現在訂閱中。',

  'web.blog.label.language': '以此語言閱讀',
  'web.blog.label.notTranslated': '此文章尚未以你的語言撰寫，正顯示英文版本。',
  'web.blog.label.languageCount': '{count, plural, other {# 種語言}}',
} as const;
