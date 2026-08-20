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
  'web.blog.meta.title': 'Scritti sulle operazioni di pubblicazione',
  'web.blog.meta.description':
    'Articoli su cadenza di pubblicazione, modelli di programmazione, fusi orari, adattamento per piattaforma e gestione del lavoro clienti come marchi separati.',

  'web.blog.title': 'Scritti',
  'web.blog.lede':
    'Note sulla meccanica del lavoro di pubblicazione: come si dimensiona un calendario, come si comporta una coda quando una settimana slitta, cosa cambia davvero tra le piattaforme e come restare separati nel lavoro clienti.',

  'web.blog.notice.prelaunch.title':
    'Questi articoli parlano del problema, non di un prodotto che puoi già usare',
  'web.blog.notice.prelaunch.body':
    'Nessun connettore qui ha completato la verifica del provider, quindi oggi niente viene pubblicato su nessuna piattaforma tramite questo prodotto. Ogni regola di piattaforma qui sotto porta il documento ufficiale da cui proviene e la data in cui una persona lo ha letto.',

  'web.blog.cluster.cadence': 'Cadenza',
  'web.blog.cluster.scheduling': 'Programmazione',
  'web.blog.cluster.adaptation': 'Adattamento per piattaforma',
  'web.blog.cluster.operations': 'Operazioni di agenzia',
  'web.blog.cluster.developers': "Integrazione tramite l'API",

  'web.blog.label.published': 'Pubblicato il {date}',
  'web.blog.label.updated': 'Aggiornato il {date}',
  'web.blog.label.writtenBy': 'Scritto da {name}',
  'web.blog.label.reviewedBy': 'Rivisto da {name}',
  'web.blog.label.sources': 'Fonti',
  'web.blog.label.sourceRead': 'Letto il {date}',
  'web.blog.label.cluster': 'Argomento',
  'web.blog.label.articleList': 'Articoli',
  'web.blog.label.backToIndex': 'Tutti gli articoli',
  'web.blog.label.count':
    '{count, plural, =0 {Nessun articolo} one {# articolo} many {# articoli} other {# articoli}}',

  'web.blog.byline.editorial.name': 'La redazione di ricerca sulla pubblicazione',
  'web.blog.byline.editorial.role': 'Scrive e mantiene questi articoli',
  'web.blog.byline.platform.name': 'La redazione della documentazione di piattaforma',
  'web.blog.byline.platform.role': 'Verifica ogni frase sulle piattaforme rispetto alla sua fonte ufficiale',

  'web.blog.feed.title': 'Scritti sulle operazioni di pubblicazione',
  'web.blog.feed.description':
    'Nuovi articoli su cadenza di pubblicazione, modelli di programmazione, fusi orari, adattamento per piattaforma e operazioni di agenzia.',
  'web.blog.feed.label': 'Feed RSS',

  'web.blog.empty.title': 'Qui non è stato ancora pubblicato nulla',
  'web.blog.empty.body': 'I primi articoli sono in scrittura. Il feed li conterrà quando saranno pubblicati.',

  'web.blog.label.language': 'Leggi questo in',
  'web.blog.label.notTranslated':
    'Questo articolo non è ancora scritto nella tua lingua. Viene mostrata la versione inglese.',
  'web.blog.label.languageCount': '{count, plural, one {# lingua} many {# lingue} other {# lingue}}',
} as const;
