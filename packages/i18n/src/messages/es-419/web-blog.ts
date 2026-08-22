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
  'web.blog.meta.title': 'Artículos sobre operaciones de publicación',
  'web.blog.meta.description':
    'Artículos sobre el ritmo de publicación, modelos de programación, zonas horarias, adaptación por plataforma y cómo llevar el trabajo de clientes como proyectos separados.',

  'web.blog.title': 'Artículos',
  'web.blog.lede':
    'Notas sobre la mecánica de publicar trabajo: cómo se dimensiona un calendario, cómo se comporta una cola cuando una semana se retrasa, qué difiere realmente entre plataformas, y cómo el trabajo de clientes permanece separado.',

  'web.blog.notice.prelaunch.title':
    'Estos artículos hablan del problema, no de un producto que ya puedas usar',
  'web.blog.notice.prelaunch.body':
    'Ningún conector aquí ha completado la verificación del proveedor, así que hoy nada se publica en ninguna plataforma a través de este producto. Cada regla de plataforma a continuación incluye el documento oficial del que proviene y la fecha en que una persona lo leyó.',

  'web.blog.cluster.cadence': 'Ritmo',
  'web.blog.cluster.scheduling': 'Programación',
  'web.blog.cluster.adaptation': 'Adaptación por plataforma',
  'web.blog.cluster.operations': 'Operaciones de agencia',
  'web.blog.cluster.developers': 'Integración por API',

  'web.blog.label.published': 'Publicado el {date}',
  'web.blog.label.updated': 'Actualizado el {date}',
  'web.blog.label.writtenBy': 'Escrito por {name}',
  'web.blog.label.reviewedBy': 'Revisado por {name}',
  'web.blog.label.sources': 'Fuentes',
  'web.blog.label.sourceRead': 'Leído el {date}',
  'web.blog.label.cluster': 'Tema',
  'web.blog.label.articleList': 'Artículos',
  'web.blog.label.backToIndex': 'Todos los artículos',
  'web.blog.label.count':
    '{count, plural, =0 {Aún no hay artículos} one {#artículo} other {#artículos} many {#artículos}}',

  'web.blog.byline.editorial.name': 'El equipo de investigación de publicación',
  'web.blog.byline.editorial.role': 'Escribe y mantiene estos artículos',
  'web.blog.byline.platform.name': 'El equipo de documentación de plataformas',
  'web.blog.byline.platform.role':
    'Verifica cada frase sobre una plataforma contra su fuente oficial',

  'web.blog.feed.title': 'Artículos sobre operaciones de publicación',
  'web.blog.feed.description':
    'Nuevos artículos sobre el ritmo de publicación, modelos de programación, zonas horarias, adaptación por plataforma y operaciones de agencia.',
  'web.blog.feed.label': 'Feed RSS',

  'web.blog.empty.title': 'Todavía no hay nada publicado aquí',
  'web.blog.empty.body':
    'Los primeros artículos se están escribiendo. Aparecerán en el feed cuando estén listos.',

  'web.blog.label.language': 'Leer en',
  'web.blog.label.notTranslated':
    'Este artículo aún no está escrito en tu idioma. Se muestra la versión en inglés.',
  'web.blog.label.languageCount': '{count, plural, one {#idioma} other {#idiomas} many {#idiomas}}',
} as const;
