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
  'web.blog.meta.title': 'Teksty o działaniach publikacyjnych',
  'web.blog.meta.description':
    'Artykuły o częstotliwości publikacji, modelach planowania, strefach czasowych, dostosowaniu do platformy i prowadzeniu pracy dla klientów jako osobnych marek.',

  'web.blog.title': 'Teksty',
  'web.blog.lede':
    'Notatki o mechanice pracy publikacyjnej: jak dobiera się wielkość harmonogramu, jak zachowuje się kolejka, gdy tydzień się przesuwa, co naprawdę różni się między platformami i jak utrzymać rozdzielenie pracy dla klientów.',

  'web.blog.notice.prelaunch.title':
    'Te artykuły dotyczą problemu, nie produktu, którego możesz już używać',
  'web.blog.notice.prelaunch.body':
    'Żaden łącznik nie przeszedł tu weryfikacji dostawcy, więc dziś nic nie jest publikowane na żadnej platformie przez ten produkt. Każda reguła platformy poniżej niesie oficjalny dokument, z którego pochodzi, i datę, kiedy ktoś go przeczytał.',

  'web.blog.cluster.cadence': 'Częstotliwość',
  'web.blog.cluster.scheduling': 'Planowanie',
  'web.blog.cluster.adaptation': 'Dostosowanie do platformy',
  'web.blog.cluster.operations': 'Działania agencji',
  'web.blog.cluster.developers': 'Integracja przez API',

  'web.blog.label.published': 'Opublikowano {date}',
  'web.blog.label.updated': 'Zaktualizowano {date}',
  'web.blog.label.writtenBy': 'Napisane przez {name}',
  'web.blog.label.reviewedBy': 'Sprawdzone przez {name}',
  'web.blog.label.sources': 'Źródła',
  'web.blog.label.sourceRead': 'Przeczytano {date}',
  'web.blog.label.cluster': 'Temat',
  'web.blog.label.articleList': 'Artykuły',
  'web.blog.label.backToIndex': 'Wszystkie artykuły',
  'web.blog.label.count':
    '{count, plural, =0 {Brak artykułów} one {# artykuł} few {# artykuły} many {# artykułów} other {# artykułu}}',

  'web.blog.byline.editorial.name': 'Zespół badawczy ds. publikacji',
  'web.blog.byline.editorial.role': 'Pisze i utrzymuje te artykuły',
  'web.blog.byline.platform.name': 'Zespół ds. dokumentacji platform',
  'web.blog.byline.platform.role': 'Sprawdza każde zdanie o platformie względem jej oficjalnego źródła',

  'web.blog.feed.title': 'Teksty o działaniach publikacyjnych',
  'web.blog.feed.description':
    'Nowe artykuły o częstotliwości publikacji, modelach planowania, strefach czasowych, dostosowaniu do platformy i działaniach agencji.',
  'web.blog.feed.label': 'Kanał RSS',

  'web.blog.empty.title': 'Nic tu jeszcze nie opublikowano',
  'web.blog.empty.body': 'Pierwsze artykuły są w trakcie pisania. Kanał poniesie je, gdy będą gotowe.',

  'web.blog.label.language': 'Czytaj to w',
  'web.blog.label.notTranslated':
    'Ten artykuł nie jest jeszcze napisany w Twoim języku. Pokazywana jest wersja angielska.',
  'web.blog.label.languageCount':
    '{count, plural, one {# język} few {# języki} many {# języków} other {# języka}}',
} as const;
