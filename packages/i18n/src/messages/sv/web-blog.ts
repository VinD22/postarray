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
  'web.blog.meta.title': 'Texter om publiceringsarbete',
  'web.blog.meta.description':
    'Artiklar om publiceringstakt, schemaläggningsmodeller, tidszoner, anpassning per plattform och att driva kunduppdrag som separata varumärken.',

  'web.blog.title': 'Texter',
  'web.blog.lede':
    'Anteckningar om mekaniken bakom publiceringsarbete: hur ett schema dimensioneras, hur en kö beter sig när en vecka förskjuts, vad som faktiskt skiljer mellan plattformar och hur kunduppdrag hålls separata.',

  'web.blog.notice.prelaunch.title':
    'Dessa artiklar handlar om problemet, inte om en produkt du redan kan använda',
  'web.blog.notice.prelaunch.body':
    'Ingen anslutning här har slutfört leverantörsverifiering, så inget publiceras till någon plattform genom denna produkt idag. Varje plattformsregel nedan bär det officiella dokument den kommer från och datumet en person läste det.',

  'web.blog.cluster.cadence': 'Takt',
  'web.blog.cluster.scheduling': 'Schemaläggning',
  'web.blog.cluster.adaptation': 'Anpassning per plattform',
  'web.blog.cluster.operations': 'Byråarbete',
  'web.blog.cluster.developers': 'Integrera via API:et',

  'web.blog.label.published': 'Publicerad {date}',
  'web.blog.label.updated': 'Uppdaterad {date}',
  'web.blog.label.writtenBy': 'Skriven av {name}',
  'web.blog.label.reviewedBy': 'Granskad av {name}',
  'web.blog.label.sources': 'Källor',
  'web.blog.label.sourceRead': 'Läst {date}',
  'web.blog.label.cluster': 'Ämne',
  'web.blog.label.articleList': 'Artiklar',
  'web.blog.label.backToIndex': 'Alla artiklar',
  'web.blog.label.count':
    '{count, plural, =0 {Inga artiklar än} one {# artikel} other {# artiklar}}',

  'web.blog.byline.editorial.name': 'Publiceringsredaktionen',
  'web.blog.byline.editorial.role': 'Skriver och underhåller dessa artiklar',
  'web.blog.byline.platform.name': 'Redaktionen för plattformsdokumentation',
  'web.blog.byline.platform.role':
    'Kontrollerar varje mening om en plattform mot dess officiella källa',

  'web.blog.feed.title': 'Texter om publiceringsarbete',
  'web.blog.feed.description':
    'Nya artiklar om publiceringstakt, schemaläggningsmodeller, tidszoner, anpassning per plattform och byråarbete.',
  'web.blog.feed.label': 'RSS-flöde',

  'web.blog.empty.title': 'Inget har publicerats här än',
  'web.blog.empty.body': 'De första artiklarna skrivs just nu. Flödet bär dem när de är uppe.',

  'web.blog.label.language': 'Läs detta på',
  'web.blog.label.notTranslated':
    'Denna artikel är ännu inte skriven på ditt språk. Den engelska versionen visas.',
  'web.blog.label.languageCount': '{count, plural, one {# språk} other {# språk}}',
} as const;
