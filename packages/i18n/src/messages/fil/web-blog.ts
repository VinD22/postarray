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
  'web.blog.meta.title': 'Mga sulatin tungkol sa publishing operations',
  'web.blog.meta.description':
    'Mga artikulo tungkol sa cadence ng pag-post, mga modelo ng pag-iiskedyul, time zone, pag-adapt kada platform, at pagpapatakbo ng gawaing kliyente bilang magkakahiwalay na project.',

  'web.blog.title': 'Mga sulatin',
  'web.blog.lede':
    'Mga tala tungkol sa mekanika ng pag-publish ng trabaho: paano sinusukat ang laki ng iskedyul, paano kumikilos ang isang queue kapag naantala ang isang linggo, ano talaga ang naiiba sa bawat platform, at paano nananatiling magkahiwalay ang gawaing kliyente.',

  'web.blog.notice.prelaunch.title':
    'Tungkol sa problema ang mga artikulong ito, hindi tungkol sa isang produktong magagamit mo na',
  'web.blog.notice.prelaunch.body':
    'Wala pang koneksyon dito ang nakumpleto ang provider verification, kaya wala pang na-publish sa anumang platform sa pamamagitan ng produktong ito ngayon. Dala ng bawat panuntunan ng platform sa ibaba ang opisyal na dokumentong pinagmulan nito at ang petsang binasa iyon ng isang tao.',

  'web.blog.cluster.cadence': 'Cadence',
  'web.blog.cluster.scheduling': 'Pag-iiskedyul',
  'web.blog.cluster.adaptation': 'Pag-adapt kada platform',
  'web.blog.cluster.operations': 'Operasyon ng ahensya',
  'web.blog.cluster.developers': 'Pagkonekta sa pamamagitan ng API',

  'web.blog.label.published': 'Na-publish {date}',
  'web.blog.label.updated': 'Na-update {date}',
  'web.blog.label.writtenBy': 'Isinulat ni {name}',
  'web.blog.label.reviewedBy': 'Na-review ni {name}',
  'web.blog.label.sources': 'Mga source',
  'web.blog.label.sourceRead': 'Nabasa {date}',
  'web.blog.label.cluster': 'Paksa',
  'web.blog.label.articleList': 'Mga artikulo',
  'web.blog.label.backToIndex': 'Lahat ng artikulo',
  'web.blog.label.count':
    '{count, plural, =0 {Wala pang artikulo} one {# artikulo} other {# na artikulo}}',

  'web.blog.byline.editorial.name': 'Ang publishing research desk',
  'web.blog.byline.editorial.role': 'Sumusulat at nangangasiwa sa mga artikulong ito',
  'web.blog.byline.platform.name': 'Ang platform documentation desk',
  'web.blog.byline.platform.role':
    'Sinusuri ang bawat pangungusap tungkol sa platform laban sa opisyal na source nito',

  'web.blog.feed.title': 'Mga sulatin tungkol sa publishing operations',
  'web.blog.feed.description':
    'Mga bagong artikulo tungkol sa cadence ng pag-post, mga modelo ng pag-iiskedyul, time zone, pag-adapt kada platform, at operasyon ng ahensya.',
  'web.blog.feed.label': 'RSS feed',

  'web.blog.empty.title': 'Wala pang na-publish dito',
  'web.blog.empty.body':
    'Isinusulat pa ang mga unang artikulo. Ilalagay ang mga ito sa feed kapag handa na.',

  'web.blog.label.language': 'Basahin sa',
  'web.blog.label.notTranslated':
    'Hindi pa nasusulat ang artikulong ito sa iyong wika. Ipinapakita ang bersyong English.',
  'web.blog.label.languageCount': '{count, plural, one {# wika} other {# na wika}}',
} as const;
