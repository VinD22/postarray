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
  'web.blog.meta.title': 'Writing on publishing operations',
  'web.blog.meta.description':
    'Articles on posting cadence, scheduling models, time zones, per platform adaptation and running client work as separate projects.',

  'web.blog.title': 'Writing',
  'web.blog.lede':
    'Notes on the mechanics of publishing work: how a schedule is sized, how a queue behaves when a week slips, what actually differs between platforms, and how client work stays separated.',

  'web.blog.notice.prelaunch.title':
    'These articles are about the problem, not about a product you can use yet',
  'web.blog.notice.prelaunch.body':
    'No connector here has completed provider verification, so nothing publishes to any platform through this product today. Every platform rule below carries the official document it came from and the date a person read it.',

  'web.blog.cluster.cadence': 'Cadence',
  'web.blog.cluster.scheduling': 'Scheduling',
  'web.blog.cluster.adaptation': 'Per platform adaptation',
  'web.blog.cluster.operations': 'Agency operations',
  'web.blog.cluster.developers': 'Integrating through the API',

  'web.blog.label.published': 'Published {date}',
  'web.blog.label.updated': 'Updated {date}',
  'web.blog.label.writtenBy': 'Written by {name}',
  'web.blog.label.reviewedBy': 'Reviewed by {name}',
  'web.blog.label.sources': 'Sources',
  'web.blog.label.sourceRead': 'Read {date}',
  'web.blog.label.cluster': 'Topic',
  'web.blog.label.articleList': 'Articles',
  'web.blog.label.backToIndex': 'All articles',
  'web.blog.label.count':
    '{count, plural, =0 {No articles yet} one {# article} other {# articles}}',

  'web.blog.byline.editorial.name': 'The publishing research desk',
  'web.blog.byline.editorial.role': 'Writes and maintains these articles',
  'web.blog.byline.platform.name': 'The platform documentation desk',
  'web.blog.byline.platform.role': 'Checks every platform sentence against its official source',

  'web.blog.feed.title': 'Writing on publishing operations',
  'web.blog.feed.description':
    'New articles on posting cadence, scheduling models, time zones, per platform adaptation and agency operations.',
  'web.blog.feed.label': 'RSS feed',

  'web.blog.empty.title': 'There is nothing published here yet',
  'web.blog.empty.body':
    'The first articles are being written. The feed will carry them when they are up.',
} as const;
