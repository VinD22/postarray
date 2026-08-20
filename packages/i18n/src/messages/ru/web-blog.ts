/**
 * The blog's page chrome. See `en/web-blog.ts` for what belongs here versus
 * article prose, which is not translated in this file.
 */
export const webBlogMessages = {
  'web.blog.meta.title': 'Статьи об операциях публикации',
  'web.blog.meta.description':
    'Статьи о частоте публикаций, моделях планирования, часовых поясах, адаптации под платформы и ведении клиентской работы как отдельных проектов.',

  'web.blog.title': 'Статьи',
  'web.blog.lede':
    'Заметки о механике публикационной работы: как рассчитывается размер расписания, как ведёт себя очередь, когда неделя сдвигается, что на самом деле отличается между платформами и как клиентская работа остаётся разделённой.',

  'web.blog.notice.prelaunch.title':
    'Эти статьи о проблеме, а не о продукте, которым вы уже можете пользоваться',
  'web.blog.notice.prelaunch.body':
    'Ни один коннектор здесь не прошёл проверку поставщика, поэтому сегодня через этот продукт ничего не публикуется ни на одну платформу. Каждое правило платформы ниже сопровождается официальным документом, из которого оно взято, и датой, когда его прочитал человек.',

  'web.blog.cluster.cadence': 'Частота',
  'web.blog.cluster.scheduling': 'Планирование',
  'web.blog.cluster.adaptation': 'Адаптация под платформы',
  'web.blog.cluster.operations': 'Работа агентства',
  'web.blog.cluster.developers': 'Интеграция через API',

  'web.blog.label.published': 'Опубликовано {date}',
  'web.blog.label.updated': 'Обновлено {date}',
  'web.blog.label.writtenBy': 'Автор: {name}',
  'web.blog.label.reviewedBy': 'Проверил: {name}',
  'web.blog.label.sources': 'Источники',
  'web.blog.label.sourceRead': 'Прочитано {date}',
  'web.blog.label.cluster': 'Тема',
  'web.blog.label.articleList': 'Статьи',
  'web.blog.label.backToIndex': 'Все статьи',
  'web.blog.label.count':
    '{count, plural, =0 {Пока нет статей} one {# статья} few {# статьи} many {# статей} other {# статьи}}',

  'web.blog.byline.editorial.name': 'Редакция по публикационным исследованиям',
  'web.blog.byline.editorial.role': 'Пишет и ведёт эти статьи',
  'web.blog.byline.platform.name': 'Отдел документации платформ',
  'web.blog.byline.platform.role': 'Проверяет каждое утверждение о платформе по официальному источнику',

  'web.blog.feed.title': 'Статьи об операциях публикации',
  'web.blog.feed.description':
    'Новые статьи о частоте публикаций, моделях планирования, часовых поясах, адаптации под платформы и работе агентств.',
  'web.blog.feed.label': 'RSS-лента',

  'web.blog.empty.title': 'Здесь пока ничего не опубликовано',
  'web.blog.empty.body': 'Первые статьи пишутся. Лента покажет их, когда они появятся.',

  'web.blog.label.language': 'Читать на',
  'web.blog.label.notTranslated':
    'Эта статья ещё не написана на вашем языке. Показана английская версия.',
  'web.blog.label.languageCount':
    '{count, plural, one {# язык} few {# языка} many {# языков} other {# языка}}',
} as const;
