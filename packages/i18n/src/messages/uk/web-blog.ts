/**
 * The blog's page chrome. See `en/web-blog.ts` for what belongs here versus
 * article prose, which is not translated in this file.
 */
export const webBlogMessages = {
  'web.blog.meta.title': 'Статті про операції публікації',
  'web.blog.meta.description':
    'Статті про частоту публікацій, моделі планування, часові пояси, адаптацію під платформи та ведення клієнтської роботи як окремих проєктів.',

  'web.blog.title': 'Статті',
  'web.blog.lede':
    'Нотатки про механіку публікаційної роботи: як розраховується розмір розкладу, як поводиться черга, коли тиждень зсувається, що насправді відрізняється між платформами і як клієнтська робота залишається розділеною.',

  'web.blog.notice.prelaunch.title':
    'Ці статті про проблему, а не про продукт, яким ви вже можете користуватися',
  'web.blog.notice.prelaunch.body':
    'Жоден конектор тут не пройшов перевірку постачальника, тому сьогодні через цей продукт нічого не публікується на жодну платформу. Кожне правило платформи нижче супроводжується офіційним документом, з якого воно взяте, і датою, коли його прочитала людина.',

  'web.blog.cluster.cadence': 'Частота',
  'web.blog.cluster.scheduling': 'Планування',
  'web.blog.cluster.adaptation': 'Адаптація під платформи',
  'web.blog.cluster.operations': 'Робота агентства',
  'web.blog.cluster.developers': 'Інтеграція через API',

  'web.blog.label.published': 'Опубліковано {date}',
  'web.blog.label.updated': 'Оновлено {date}',
  'web.blog.label.writtenBy': 'Автор: {name}',
  'web.blog.label.reviewedBy': 'Перевірив: {name}',
  'web.blog.label.sources': 'Джерела',
  'web.blog.label.sourceRead': 'Прочитано {date}',
  'web.blog.label.cluster': 'Тема',
  'web.blog.label.articleList': 'Статті',
  'web.blog.label.backToIndex': 'Усі статті',
  'web.blog.label.count':
    '{count, plural, =0 {Ще немає статей} one {# стаття} few {# статті} many {# статей} other {# статті}}',

  'web.blog.byline.editorial.name': 'Редакція публікаційних досліджень',
  'web.blog.byline.editorial.role': 'Пише і веде ці статті',
  'web.blog.byline.platform.name': 'Відділ документації платформ',
  'web.blog.byline.platform.role':
    'Перевіряє кожне твердження про платформу за офіційним джерелом',

  'web.blog.feed.title': 'Статті про операції публікації',
  'web.blog.feed.description':
    'Нові статті про частоту публікацій, моделі планування, часові пояси, адаптацію під платформи та роботу агентств.',
  'web.blog.feed.label': 'RSS-стрічка',

  'web.blog.empty.title': 'Тут ще нічого не опубліковано',
  'web.blog.empty.body': 'Перші статті пишуться. Стрічка покаже їх, коли вони з’являться.',

  'web.blog.label.language': 'Читати цією мовою',
  'web.blog.label.notTranslated':
    'Цю статтю ще не написано вашою мовою. Показано англійську версію.',
  'web.blog.label.languageCount':
    '{count, plural, one {# мова} few {# мови} many {# мов} other {# мови}}',
} as const;
