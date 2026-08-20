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
  'web.blog.meta.title': 'Texty o publikačním provozu',
  'web.blog.meta.description':
    'Články o rytmu publikování, modelech plánování, časových pásmech, přizpůsobení pro jednotlivé platformy a vedení klientské práce jako samostatných značek.',

  'web.blog.title': 'Texty',
  'web.blog.lede':
    'Poznámky o mechanice publikační práce: jak se dimenzuje harmonogram, jak se fronta chová, když se týden posune, co se mezi platformami skutečně liší a jak zůstává klientská práce oddělená.',

  'web.blog.notice.prelaunch.title':
    'Tyto články jsou o problému, ne o produktu, který už můžete používat',
  'web.blog.notice.prelaunch.body':
    'Žádný konektor zde neprošel ověřením poskytovatele, takže dnes se přes tento produkt nic nepublikuje na žádné platformě. Každé pravidlo platformy níže nese oficiální dokument, ze kterého pochází, a datum, kdy jej někdo přečetl.',

  'web.blog.cluster.cadence': 'Rytmus',
  'web.blog.cluster.scheduling': 'Plánování',
  'web.blog.cluster.adaptation': 'Přizpůsobení pro platformu',
  'web.blog.cluster.operations': 'Provoz agentury',
  'web.blog.cluster.developers': 'Integrace přes API',

  'web.blog.label.published': 'Publikováno {date}',
  'web.blog.label.updated': 'Aktualizováno {date}',
  'web.blog.label.writtenBy': 'Napsal(a) {name}',
  'web.blog.label.reviewedBy': 'Zkontroloval(a) {name}',
  'web.blog.label.sources': 'Zdroje',
  'web.blog.label.sourceRead': 'Přečteno {date}',
  'web.blog.label.cluster': 'Téma',
  'web.blog.label.articleList': 'Články',
  'web.blog.label.backToIndex': 'Všechny články',
  'web.blog.label.count':
    '{count, plural, =0 {Žádné články} one {# článek} few {# články} many {# článku} other {# článků}}',

  'web.blog.byline.editorial.name': 'Výzkumná redakce pro publikování',
  'web.blog.byline.editorial.role': 'Píše a spravuje tyto články',
  'web.blog.byline.platform.name': 'Redakce dokumentace platforem',
  'web.blog.byline.platform.role': 'Ověřuje každou větu o platformě proti jejímu oficiálnímu zdroji',

  'web.blog.feed.title': 'Texty o publikačním provozu',
  'web.blog.feed.description':
    'Nové články o rytmu publikování, modelech plánování, časových pásmech, přizpůsobení pro platformy a provozu agentury.',
  'web.blog.feed.label': 'RSS kanál',

  'web.blog.empty.title': 'Zatím zde nic nebylo publikováno',
  'web.blog.empty.body': 'První články se právě píší. Kanál je ponese, jakmile budou hotové.',

  'web.blog.label.language': 'Číst v',
  'web.blog.label.notTranslated':
    'Tento článek zatím není napsán ve vašem jazyce. Zobrazuje se anglická verze.',
  'web.blog.label.languageCount':
    '{count, plural, one {# jazyk} few {# jazyky} many {# jazyka} other {# jazyků}}',
} as const;
