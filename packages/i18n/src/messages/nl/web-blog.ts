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
  'web.blog.meta.title': 'Artikelen over publicatiewerk',
  'web.blog.meta.description':
    'Artikelen over publicatieritme, planningsmodellen, tijdzones, aanpassing per platform en het gescheiden runnen van klantwerk als aparte merken.',

  'web.blog.title': 'Artikelen',
  'web.blog.lede':
    'Notities over de mechaniek van publicatiewerk: hoe je een planning dimensioneert, hoe een wachtrij zich gedraagt als een week uitloopt, wat er echt verschilt tussen platforms, en hoe klantwerk gescheiden blijft.',

  'web.blog.notice.prelaunch.title':
    'Deze artikelen gaan over het probleem, niet over een product dat je al kunt gebruiken',
  'web.blog.notice.prelaunch.body':
    'Geen enkele connector hier heeft providerverificatie voltooid, dus vandaag wordt er via dit product niets op een platform gepubliceerd. Elke platformregel hieronder draagt het officiële document waar hij vandaan komt en de datum waarop iemand het heeft gelezen.',

  'web.blog.cluster.cadence': 'Ritme',
  'web.blog.cluster.scheduling': 'Planning',
  'web.blog.cluster.adaptation': 'Aanpassing per platform',
  'web.blog.cluster.operations': 'Bureauwerkzaamheden',
  'web.blog.cluster.developers': 'Integreren via de API',

  'web.blog.label.published': 'Gepubliceerd op {date}',
  'web.blog.label.updated': 'Bijgewerkt op {date}',
  'web.blog.label.writtenBy': 'Geschreven door {name}',
  'web.blog.label.reviewedBy': 'Beoordeeld door {name}',
  'web.blog.label.sources': 'Bronnen',
  'web.blog.label.sourceRead': 'Gelezen op {date}',
  'web.blog.label.cluster': 'Onderwerp',
  'web.blog.label.articleList': 'Artikelen',
  'web.blog.label.backToIndex': 'Alle artikelen',
  'web.blog.label.count':
    '{count, plural, =0 {Nog geen artikelen} one {# artikel} other {# artikelen}}',

  'web.blog.byline.editorial.name': 'De redactie publicatieonderzoek',
  'web.blog.byline.editorial.role': 'Schrijft en onderhoudt deze artikelen',
  'web.blog.byline.platform.name': 'De redactie platformdocumentatie',
  'web.blog.byline.platform.role': 'Toetst elke platformzin aan de officiële bron',

  'web.blog.feed.title': 'Artikelen over publicatiewerk',
  'web.blog.feed.description':
    'Nieuwe artikelen over publicatieritme, planningsmodellen, tijdzones, aanpassing per platform en bureauwerkzaamheden.',
  'web.blog.feed.label': 'RSS-feed',

  'web.blog.empty.title': 'Hier is nog niets gepubliceerd',
  'web.blog.empty.body':
    'De eerste artikelen worden geschreven. De feed draagt ze zodra ze online staan.',

  'web.blog.label.language': 'Lees dit in',
  'web.blog.label.notTranslated':
    'Dit artikel is nog niet in jouw taal geschreven. De Engelse versie wordt getoond.',
  'web.blog.label.languageCount': '{count, plural, one {# taal} other {# talen}}',
} as const;
